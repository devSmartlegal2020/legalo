/**
 * In-memory token blacklist with TTL cleanup.
 * Tokens are stored with their expiry timestamp.
 * Cleanup runs every hour to remove expired entries.
 */

interface BlacklistEntry {
  expiresAt: number;
}

const blacklist = new Map<string, BlacklistEntry>();

// Run cleanup every hour
const CLEANUP_INTERVAL = 60 * 60 * 1000;

setInterval(() => {
  const now = Date.now();
  let removed = 0;
  for (const [token, entry] of blacklist.entries()) {
    if (entry.expiresAt <= now) {
      blacklist.delete(token);
      removed++;
    }
  }
  if (removed > 0 && process.env.NODE_ENV !== 'production') {
    console.log(`Token blacklist cleanup: removed ${removed} expired tokens`);
  }
}, CLEANUP_INTERVAL);

export const addToBlacklist = (token: string, expiresAt: number): void => {
  blacklist.set(token, { expiresAt });
};

export const isBlacklisted = (token: string): boolean => {
  const entry = blacklist.get(token);
  if (!entry) return false;
  
  // If expired, clean it up
  if (entry.expiresAt <= Date.now()) {
    blacklist.delete(token);
    return false;
  }
  
  return true;
};

export const getBlacklistSize = (): number => blacklist.size;
