import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, Video, Users } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';

gsap.registerPlugin(ScrollTrigger);

const EventsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isReady } = useLoading();

  useEffect(() => {
    if (!isReady) return;
    
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
      
      // Header animates first
      tl.fromTo(header,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        0
      )
      // Cards stagger upward
      .fromTo(cards,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power2.out' },
        0.2
      );
    }, section);

    return () => ctx.revert();
  }, [isReady]);

  const events = [
    { date: '15', month: 'FEB', title: 'Legal 101 for Founders', meta: 'Webinar • 19:00 WIB', icon: Video },
    { date: '03', month: 'MAR', title: 'Contracts & Negotiation', meta: 'Workshop • 13:00 WIB', icon: Users },
    { date: '22', month: 'MAR', title: 'HR Compliance Clinic', meta: 'Online • 10:00 WIB', icon: Calendar },
  ];

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-legalo-bg">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="animate-header flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16 lg:mb-20">
            <div>
              <span className="text-legalo-red text-xs font-semibold uppercase tracking-widest mb-4 block">ACARA</span>
              <h2 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-[-0.02em] text-legalo-dark">Learn & Connect.</h2>
            </div>
            <p className="text-legalo-dark/60 text-base lg:text-lg max-w-md">Join our webinars and workshops to stay updated on legal matters.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <div key={index} className="animate-card group p-8 lg:p-10 bg-white border border-legalo-dark/10 rounded-xl hover:border-legalo-red/30 hover:shadow-lg transition-all duration-300 cursor-pointer">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <span className="font-heading font-bold text-4xl lg:text-5xl text-legalo-dark group-hover:text-legalo-red transition-colors">{event.date}</span>
                    <span className="text-legalo-dark/40 text-sm uppercase ml-2">{event.month}</span>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-legalo-red/10 flex items-center justify-center">
                    <event.icon className="w-5 h-5 text-legalo-red" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-legalo-dark/50 text-sm mb-3"><span>{event.meta}</span></div>
                <h3 className="font-heading font-semibold text-xl text-legalo-dark group-hover:text-legalo-red transition-colors">{event.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
