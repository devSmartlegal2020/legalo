import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';

gsap.registerPlugin(ScrollTrigger);

interface ServicesCTASectionProps {
  onOpenModal: () => void;
}

const ServicesCTASection = ({ onOpenModal }: ServicesCTASectionProps) => {
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

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-legalo-red">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="animate-item font-heading font-bold text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-[1.1] tracking-[-0.02em] text-white mb-6">
            Butuh bantuan legal?
          </h2>
          
          <p className="animate-item text-white/80 text-lg lg:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            Konsultasi gratis sekarang. Tim ahli kami siap membantu Anda menemukan solusi legal terbaik untuk bisnis Anda.
          </p>
          
          <button 
            onClick={onOpenModal}
            className="animate-item group bg-white hover:bg-legalo-dark text-legalo-red hover:text-white px-8 py-4 rounded-lg text-base font-semibold inline-flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
          >
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            Konsultasi Gratis Sekarang
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesCTASection;
