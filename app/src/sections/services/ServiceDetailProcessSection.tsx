import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLoading } from '@/context/LoadingContext';

gsap.registerPlugin(ScrollTrigger);

interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

interface ServiceDetailProcessSectionProps {
  steps: ProcessStep[];
}

const ServiceDetailProcessSection = ({
  steps
}: ServiceDetailProcessSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isReady } = useLoading();

  useEffect(() => {
    if (!isReady) return;
    
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const header = section.querySelector('.process-header');
      const stepElements = section.querySelectorAll('.process-step');
      
      const tl = gsap.timeline({
        scrollTrigger: { 
          trigger: section, 
          start: 'top 80%', 
          toggleActions: 'play none none none' 
        }
      });
      
      tl.fromTo(header,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
        0
      )
      .fromTo(stepElements,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power2.out' },
        0.3
      );
    }, section);

    return () => ctx.revert();
  }, [isReady]);

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-legalo-dark">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="process-header text-center mb-16 opacity-0">
            <span className="inline-block bg-legalo-red/20 text-legalo-red text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              Proses Layanan
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.02em] text-white mb-4">
              Cara Kerja Kami
            </h2>
            <p className="text-white/60 text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
              Proses mudah dan transparan untuk membantu Anda mencapai tujuan legal dengan cepat
            </p>
          </div>

          {/* Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="process-step relative opacity-0"
              >
                {/* Step Number */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-legalo-red flex items-center justify-center text-white font-bold text-lg">
                    {step.step}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block flex-1 h-px bg-gradient-to-r from-legalo-red to-transparent" />
                  )}
                </div>

                {/* Content */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-legalo-red/30 transition-colors">
                  <h3 className="font-heading font-semibold text-lg text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Note */}
          <div className="text-center mt-12">
            <p className="text-white/50 text-sm">
              * Timeline dapat bervariasi tergantung pada kompleksitas dokumen dan respons dari instansi terkait
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceDetailProcessSection;
