import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';
import { getIconForType, formatPrice } from '@/data/eventsData';
import type { EventData } from '@/data/eventsData';

const FALLBACK_EVENT_IMAGE = 'https://placehold.co/800x400/d93a3a/ffffff?text=Legalo+Event';

const getTypeColor = (type: string) => {
  switch (type) {
    case 'Webinar':
      return 'bg-blue-100 text-blue-700';
    case 'Workshop':
      return 'bg-purple-100 text-purple-700';
    case 'Networking':
      return 'bg-green-100 text-green-700';
    case 'Clinic':
      return 'bg-orange-100 text-orange-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

interface EventsListSectionProps {
  events: EventData[];
  isLoading?: boolean;
}

gsap.registerPlugin(ScrollTrigger);

const EventsListSection = ({ events, isLoading }: EventsListSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isReady } = useLoading();
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const handleImageError = (index: number) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const getEventImage = (event: EventData, index: number) => {
    if (imageErrors[index] || !event.image) {
      return FALLBACK_EVENT_IMAGE;
    }
    if (event.image.startsWith('http')) {
      return event.image;
    }
    return `http://localhost:5000${event.image}`;
  };

  useEffect(() => {
    if (!isReady || isLoading) return;
    
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const header = section.querySelector('.animate-header');
      const cards = section.querySelectorAll('.animate-card');
      
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
      .fromTo(cards,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power2.out' },
        0.2
      );
    }, section);

    return () => ctx.revert();
  }, [isReady, isLoading]);

  if (isLoading) {
    return (
      <section ref={sectionRef} className="py-24 lg:py-32 bg-white">
        <div className="w-full px-6 lg:px-12 xl:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-legalo-red"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section ref={sectionRef} className="py-24 lg:py-32 bg-white">
        <div className="w-full px-6 lg:px-12 xl:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="animate-header mb-16 lg:mb-20">
              <span className="inline-block bg-legalo-red/10 text-legalo-red text-xs font-semibold px-4 py-2 rounded-full mb-6">
                All Events
              </span>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.02em] text-legalo-dark mb-4">
                Upcoming Events
              </h2>
            </div>
            <div className="text-center py-12 text-legalo-dark/60">
              No upcoming events at the moment. Check back soon!
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-white">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="animate-header mb-16 lg:mb-20">
            <span className="inline-block bg-legalo-red/10 text-legalo-red text-xs font-semibold px-4 py-2 rounded-full mb-6">
              All Events
            </span>
            
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="lg:max-w-2xl">
                <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.02em] text-legalo-dark mb-4">
                  Upcoming Events
                </h2>
                <p className="text-legalo-dark/60 text-base lg:text-lg leading-relaxed">
                  Browse all our upcoming webinars, workshops, and community events designed for your business growth.
                </p>
              </div>
              
              <button className="shrink-0 border border-legalo-dark/20 rounded-lg px-5 py-3 text-sm font-medium inline-flex items-center gap-2 hover:border-legalo-red hover:text-legalo-red transition-all group">
                View Past Events
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => {
              const EventIcon = getIconForType(event.type);
              // Extract date parts from event.date string
              const dateParts = event.date.split(' ');
              const day = dateParts[0];
              const month = dateParts[1]?.substring(0, 3).toUpperCase() || '';
              
              return (
                <Link 
                  key={index} 
                  to={`/events/${event.slug}`}
                  className="animate-card group overflow-hidden bg-legalo-bg border border-legalo-dark/10 rounded-xl hover:border-legalo-red/30 hover:shadow-lg transition-all duration-300 block"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getEventImage(event, index)}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={() => handleImageError(index)}
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 lg:p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="font-heading font-bold text-4xl lg:text-5xl text-legalo-dark group-hover:text-legalo-red transition-colors">
                        {day}
                      </span>
                      <span className="text-legalo-dark/40 text-sm uppercase font-medium">
                        {month}
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-legalo-red/10 flex items-center justify-center">
                      <EventIcon className="w-5 h-5 text-legalo-red" strokeWidth={1.5} />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${getTypeColor(event.type)}`}>
                      {event.type}
                    </span>
                  </div>
                  
                  <h3 className="font-heading font-semibold text-xl text-legalo-dark mb-3 group-hover:text-legalo-red transition-colors">
                    {event.title}
                  </h3>
                  
                  <p className="text-legalo-dark/60 text-sm leading-relaxed mb-4">
                    {event.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-sm text-legalo-dark/50 mb-6">
                    <Clock className="w-4 h-4" strokeWidth={1.5} />
                    <span>{event.time}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-legalo-red font-medium text-sm group-hover:gap-2 transition-all">
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                    <div className={`text-sm font-bold ${
                      event.price === 0 ? 'text-green-600' : 'text-legalo-dark'
                    }`}>
                      {formatPrice(event.price, event.currency)}
                    </div>
                  </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsListSection;
