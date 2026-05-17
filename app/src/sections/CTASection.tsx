import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';

gsap.registerPlugin(ScrollTrigger);

const CTASection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isReady } = useLoading();

  useEffect(() => {
    if (!isReady) return;
    
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const elements = section.querySelectorAll('.animate-item');
      
      gsap.fromTo(elements,
        { y: 40, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          stagger: 0.1, 
          ease: 'power2.out',
          scrollTrigger: { 
            trigger: section, 
            start: 'top 80%', 
            toggleActions: 'play none none none' 
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, [isReady]);

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-legalo-red">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="animate-item font-heading font-bold text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-[1.1] tracking-[-0.02em] text-white mb-6">Ready to stop guessing?</h2>
          <p className="animate-item text-white/80 text-lg lg:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">Book a free consultation. We'll map your next steps in 30 minutes.</p>
          <button onClick={scrollToContact} className="animate-item group bg-white hover:bg-legalo-dark text-legalo-red hover:text-white px-8 py-4 rounded text-sm font-medium inline-flex items-center gap-2 transition-all">
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />Jadwalkan Konsultasi
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
