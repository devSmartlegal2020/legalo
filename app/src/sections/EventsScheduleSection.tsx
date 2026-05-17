import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLoading } from '@/context/LoadingContext';
import type { EventData } from '@/data/eventsData';

gsap.registerPlugin(ScrollTrigger);

interface EventsScheduleSectionProps {
  events: EventData[];
  isLoading?: boolean;
}

const EventsScheduleSection = ({ events, isLoading }: EventsScheduleSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isReady } = useLoading();

  useEffect(() => {
    if (!isReady || isLoading) return;
    
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const header = section.querySelector('.animate-header');
      const timeline = section.querySelectorAll('.animate-timeline');
      
      const tl = gsap.timeline({
        scrollTrigger: { 
          trigger: section, 
          start: 'top 80%', 
          toggleActions: 'play none none none' 
        }
      });
      
      tl.fromTo(header,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        0
      )
      .fromTo(timeline,
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
        0.2
      );
    }, section);

    return () => ctx.revert();
  }, [isReady, isLoading]);

  // Group events by month
  const groupEventsByMonth = (events: EventData[]) => {
    const grouped: Record<string, EventData[]> = {};
    
    events.forEach((event) => {
      if (!event.startDateTime) return;
      
      const date = new Date(event.startDateTime);
      const monthKey = date.toLocaleDateString('id-ID', {
        month: 'long',
        year: 'numeric',
      });
      
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(event);
    });
    
    return grouped;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Workshop': 'bg-purple-100 text-purple-700 border-purple-200',
      'Webinar': 'bg-blue-100 text-blue-700 border-blue-200',
      'Networking': 'bg-green-100 text-green-700 border-green-200',
      'Community': 'bg-orange-100 text-orange-700 border-orange-200',
      'Clinic': 'bg-pink-100 text-pink-700 border-pink-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getEventDay = (event: EventData) => {
    if (!event.startDateTime) return '';
    const date = new Date(event.startDateTime);
    return date.getDate().toString().padStart(2, '0');
  };

  // Don't render if no events
  if (!isLoading && events.length === 0) {
    return null;
  }

  const groupedEvents = groupEventsByMonth(events);
  const monthlySchedule = Object.entries(groupedEvents).map(([month, monthEvents]) => ({
    month,
    events: monthEvents,
  }));

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-legalo-bg">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="animate-header mb-16 lg:mb-20">
            <span className="inline-block bg-legalo-red/10 text-legalo-red text-xs font-semibold px-4 py-2 rounded-full mb-6">
              Event Calendar
            </span>
            
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="lg:max-w-2xl">
                <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.02em] text-legalo-dark mb-4">
                  Event Schedule
                </h2>
                <p className="text-legalo-dark/60 text-base lg:text-lg leading-relaxed">
                  Plan ahead with our chronological timeline of upcoming events. Find what works best for your schedule.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {monthlySchedule.map((month, monthIndex) => (
              <div key={monthIndex} className="animate-timeline">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-legalo-dark flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading font-semibold text-xl text-legalo-dark">
                    {month.month}
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {month.events.map((event, eventIndex) => (
                    <Link
                      key={eventIndex}
                      to={`/events/${event.slug}`}
                      className="group bg-white p-5 rounded-xl border border-legalo-dark/10 hover:border-legalo-red/30 hover:shadow-md transition-all duration-300 block"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-legalo-red/10 flex items-center justify-center">
                          <span className="font-heading font-bold text-lg text-legalo-red">
                            {getEventDay(event)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-2 border ${getTypeColor(event.type)}`}>
                            {event.type}
                          </span>
                          <h4 className="font-medium text-legalo-dark group-hover:text-legalo-red transition-colors text-sm leading-snug">
                            {event.title}
                          </h4>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-legalo-dark/50 text-sm mb-4">
              Can't find an event that fits your schedule?
            </p>
            <button className="inline-flex items-center gap-2 text-legalo-red font-medium hover:gap-3 transition-all group">
              <span>Subscribe to Event Notifications</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsScheduleSection;
