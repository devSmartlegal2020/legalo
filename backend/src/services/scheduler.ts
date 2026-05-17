import cron from 'node-cron';
import { Blog } from '../models';

let isSchedulerRunning = false;

export const startBlogScheduler = () => {
  if (isSchedulerRunning) {
    console.log('Blog scheduler is already running');
    return;
  }

  // Run every 5 minutes
  const task = cron.schedule('*/5 * * * *', async () => {
    try {
      const now = new Date();
      const result = await Blog.updateMany(
        {
          status: 'scheduled',
          scheduledPublishAt: { $lte: now },
        },
        {
          $set: {
            status: 'published',
            publishedAt: now,
          },
        }
      );

      if (result.modifiedCount > 0) {
        console.log(`[Scheduler] Published ${result.modifiedCount} scheduled blog(s) at ${now.toISOString()}`);
      }
    } catch (error) {
      console.error('[Scheduler] Error publishing scheduled blogs:', error);
    }
  });

  isSchedulerRunning = true;
  console.log('Blog scheduler started (runs every 5 minutes)');

  // Also run immediately on startup to catch any missed scheduled posts
  (async () => {
    try {
      const now = new Date();
      const result = await Blog.updateMany(
        {
          status: 'scheduled',
          scheduledPublishAt: { $lte: now },
        },
        {
          $set: {
            status: 'published',
            publishedAt: now,
          },
        }
      );

      if (result.modifiedCount > 0) {
        console.log(`[Scheduler] Startup: Published ${result.modifiedCount} scheduled blog(s)`);
      }
    } catch (error) {
      console.error('[Scheduler] Startup error:', error);
    }
  })();

  return task;
};
