import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, Clock, Users, ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLoading } from '@/context/LoadingContext';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/data/eventsData';
import type { EventData } from '@/data/eventsData';

interface EventsFeaturedSectionProps {
  events: EventData[];
  isLoading?: boolean;
}

const FALLBACK_EVENT_IMAGE = 'https://placehold.co/800x400/d93a3a/ffffff?text=Legalo+Event';

gsap.registerPlugin(ScrollTrigger);

const EventsFeaturedSection = ({ events, isLoading }: EventsFeaturedSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isReady } = useLoading();
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

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
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.15, ease: 'power2.out' },
        0.2
      );
    }, section);

    return () => ctx.revert();
  }, [isReady, isLoading]);

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

  if (isLoading) {
    return (
      <section ref={sectionRef} className="py-24 lg:py-32 bg-legalo-bg">
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
    return null;
  }

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-legalo-bg">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="animate-header mb-16 lg:mb-20">
            <span className="inline-block bg-legalo-red/10 text-legalo-red text-xs font-semibold px-4 py-2 rounded-full mb-6">
              Featured Events
            </span>
            
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="lg:max-w-2xl">
                <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.02em] text-legalo-dark mb-4">
                  Flagship Events You Can't Miss
                </h2>
                <p className="text-legalo-dark/60 text-base lg:text-lg leading-relaxed">
                  Our most impactful events designed to transform your understanding of business law and compliance.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <Link 
                key={index} 
                to={`/events/${event.slug}`}
                className="animate-card group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 block"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={getEventImage(event, index)} 
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={() => handleImageError(index)}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-legalo-red text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                      {event.type}
                    </span>
                  </div>
                  {event.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-legalo-dark/80 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
                        Featured
                      </span>
                    </div>
                  )}
                  {/* Price Badge */}
                  <div className="absolute bottom-4 left-4">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                      event.price === 0 
                        ? 'bg-green-500 text-white' 
                        : 'bg-white text-legalo-dark'
                    }`}>
                      {formatPrice(event.price, event.currency)}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 lg:p-8">
                  <div className="flex items-center gap-4 text-sm text-legalo-dark/50 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-legalo-red" strokeWidth={1.5} />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-legalo-red" strokeWidth={1.5} />
                      <span>{event.time}</span>
                    </div>
                  </div>
                  
                  <h3 className="font-heading font-semibold text-xl text-legalo-dark mb-3 group-hover:text-legalo-red transition-colors line-clamp-2">
                    {event.title}
                  </h3>
                  
                  <p className="text-legalo-dark/60 text-sm leading-relaxed mb-4 line-clamp-3">
                    {event.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-sm text-legalo-dark/50 mb-6">
                    <MapPin className="w-4 h-4" strokeWidth={1.5} />
                    <span>{event.location}</span>
                    <span className="mx-2">•</span>
                    <Users className="w-4 h-4" strokeWidth={1.5} />
                    <span>{event.seatsAvailable} seats left</span>
                  </div>
                  
                  <Button 
                    className="w-full bg-legalo-dark hover:bg-legalo-red text-white font-medium py-3 rounded-lg transition-colors inline-flex items-center justify-center gap-2 group/btn"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsFeaturedSection;
