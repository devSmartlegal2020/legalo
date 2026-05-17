import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, Users, Eye, Clock, Shield, CheckCircle } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';

gsap.registerPlugin(ScrollTrigger);

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

interface ServiceDetailBenefitsSectionProps {
  benefits: Benefit[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  zap: Zap,
  users: Users,
  eye: Eye,
  clock: Clock,
  shield: Shield,
  checkCircle: CheckCircle,
};

const ServiceDetailBenefitsSection = ({
  benefits
}: ServiceDetailBenefitsSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isReady } = useLoading();

  useEffect(() => {
    if (!isReady) return;
    
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const header = section.querySelector('.benefits-header');
      const cards = section.querySelectorAll('.benefit-card');
      
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
      .fromTo(cards,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power2.out' },
        0.3
      );
    }, section);

    return () => ctx.revert();
  }, [isReady]);

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-white">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="benefits-header text-center mb-16 opacity-0">
            <span className="inline-block bg-legalo-red/10 text-legalo-red text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              Keunggulan
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.02em] text-legalo-dark mb-4">
              Mengapa Memilih Kami
            </h2>
            <p className="text-legalo-dark/60 text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
              Kami menawarkan layanan terbaik dengan standar profesional untuk memastikan kepuasan Anda
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = iconMap[benefit.icon] || CheckCircle;
              return (
                <div 
                  key={index}
                  className="benefit-card group bg-legalo-bg rounded-2xl p-6 lg:p-8 hover:shadow-lg transition-all duration-300 border border-transparent hover:border-legalo-red/20 opacity-0"
                >
                  <div className="w-14 h-14 rounded-xl bg-legalo-red/10 flex items-center justify-center mb-6 group-hover:bg-legalo-red/20 transition-colors">
                    <IconComponent 
                      className="w-7 h-7 text-legalo-red group-hover:scale-110 transition-transform" 
                      strokeWidth={1.5}
                    />
                  </div>

                  <h3 className="font-heading font-semibold text-xl text-legalo-dark mb-3">
                    {benefit.title}
                  </h3>

                  <p className="text-legalo-dark/60 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceDetailBenefitsSection;
