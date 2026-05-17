import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight, MapPin } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';

gsap.registerPlugin(ScrollTrigger);

const VOSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isReady } = useLoading();

  useEffect(() => {
    if (!isReady) return;
    
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const leftCol = section.querySelector('.left-col');
      const rightCol = section.querySelector('.right-col');
      const textItems = section.querySelectorAll('.text-animate');
      
      const tl = gsap.timeline({
        scrollTrigger: { 
          trigger: section, 
          start: 'top 80%', 
          toggleActions: 'play none none none' 
        }
      });
      
      // Left column (image) slides in from left
      tl.fromTo(leftCol,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        0
      )
      // Right column (text) slides in from right
      .fromTo(rightCol,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        0.1
      )
      // Text items stagger
      .fromTo(textItems,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
        0.3
      );
    }, section);

    return () => ctx.revert();
  }, [isReady]);

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const locations = ['Jakarta', 'Surabaya', 'Bali', 'Bandung'];

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 lg:py-32 bg-white">
      <div className="w-full px-5 sm:px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-20 items-center">
          <div className="left-col order-2 lg:order-1">
            <img src="/images/vo_workspace.jpg" alt="Virtual workspace" className="w-full h-[280px] sm:h-[350px] lg:h-[500px] object-cover rounded-xl" />
          </div>
          <div className="right-col order-1 lg:order-2">
            <span className="text-animate text-legalo-red text-xs font-semibold uppercase tracking-widest mb-4 sm:mb-6 block">VIRTUAL OFFICE</span>
            <h2 className="text-animate font-heading font-bold text-2xl sm:text-3xl lg:text-5xl leading-[1.1] tracking-[-0.02em] text-legalo-dark mb-4 sm:mb-6 break-words">
              Work from anywhere. <span className="text-legalo-red">Stay official</span>.
            </h2>
            <p className="text-animate text-legalo-dark/60 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
              Get a prestigious business address, mail handling, and on-demand meeting rooms—without the long-term lease.
            </p>
            <div className="text-animate flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-2 mb-6 sm:mb-8">
              {locations.map((loc, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 sm:gap-2 text-sm text-legalo-dark/80">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-legalo-red" />{loc}
                </span>
              ))}
            </div>
            <button onClick={scrollToContact} className="text-animate group bg-legalo-red hover:bg-legalo-red-dark text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded text-sm font-medium inline-flex items-center gap-2 transition-all">
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />Lihat Lokasi
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VOSection;
