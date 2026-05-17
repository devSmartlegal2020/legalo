import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';

gsap.registerPlugin(ScrollTrigger);

const ProblemSection = () => {
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

  const benefits = ['No hidden fees', 'Online-first process', 'Bahasa & English support'];

  return (
    <section ref={sectionRef} id="about" className="py-24 lg:py-32 bg-legalo-bg">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-4xl mx-auto text-center">
          <span className="animate-item text-legalo-red text-xs font-semibold uppercase tracking-widest mb-6 block">
            KENAPA LEGALO?
          </span>
          <h2 className="animate-item font-heading font-bold text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-[1.1] tracking-[-0.02em] text-legalo-dark mb-8">
            Legal shouldn't be <span className="text-legalo-red">a roadblock</span>.
          </h2>
          <p className="animate-item text-legalo-dark/60 text-lg lg:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            Too many founders waste months on permits, contracts, and compliance—instead of building. We fix that with clear steps, fair pricing, and a team that moves fast.
          </p>
          <div className="animate-item flex flex-wrap justify-center gap-8">
            {benefits.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-legalo-dark/80">
                <Check className="w-5 h-5 text-legalo-red" strokeWidth={2} />
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
