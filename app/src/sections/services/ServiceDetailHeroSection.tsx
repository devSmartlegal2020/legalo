import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight, CheckCircle } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';

gsap.registerPlugin(ScrollTrigger);

interface ServiceDetailHeroSectionProps {
  title: string;
  subtitle: string;
  summary: string;
  highlights: string[];
  backgroundImage: string;
  onOpenModal: () => void;
}

const ServiceDetailHeroSection = ({
  title,
  subtitle,
  summary,
  highlights,
  backgroundImage,
  onOpenModal
}: ServiceDetailHeroSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isReady } = useLoading();

  useEffect(() => {
    if (!isReady) return;
    
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const subtitleEl = section.querySelector('.service-subtitle');
      const titleEl = section.querySelector('.service-title');
      const summaryEl = section.querySelector('.service-summary');
      const highlightsEl = section.querySelectorAll('.service-highlight');
      const ctaEl = section.querySelector('.service-cta');
      
      const tl = gsap.timeline({
        scrollTrigger: { 
          trigger: section, 
          start: 'top 80%', 
          toggleActions: 'play none none none' 
        }
      });
      
      tl.fromTo(subtitleEl,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        0
      )
      .fromTo(titleEl,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
        0.15
      )
      .fromTo(summaryEl,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        0.3
      )
      .fromTo(highlightsEl,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
        0.45
      )
      .fromTo(ctaEl,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        0.6
      );
    }, section);

    return () => ctx.revert();
  }, [isReady]);

  return (
    <section 
      ref={sectionRef} 
      className="relative min-h-[85vh] w-full overflow-hidden"
      style={{ zIndex: 10 }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <picture>
          <img 
            src={backgroundImage}
            alt={title}
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async"
          />
        </picture>
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-black/60" />

      {/* Content */}
      <div className="relative z-10 min-h-[85vh] flex flex-col justify-center px-6 lg:px-12 xl:px-20 pt-24 pb-12">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content - 8 cols */}
            <div className="lg:col-span-8">
              {/* Subtitle */}
              <span className="service-subtitle inline-block bg-legalo-red text-white text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6 opacity-0">
                {subtitle}
              </span>

              {/* Title */}
              <h1 className="service-title font-heading font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-[-0.02em] text-white mb-6 opacity-0">
                {title}
              </h1>

              {/* Summary */}
              <p className="service-summary text-white/80 text-base lg:text-lg leading-relaxed mb-8 max-w-2xl opacity-0">
                {summary}
              </p>

              {/* CTA Button */}
              <button
                onClick={onOpenModal}
                className="service-cta group bg-legalo-red hover:bg-legalo-red-dark text-white px-8 py-4 rounded text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all opacity-0"
              >
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                Konsultasi Gratis
              </button>
            </div>

            {/* Right Content - Highlights - 4 cols */}
            <div className="lg:col-span-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/20">
                <h3 className="text-white font-semibold text-lg mb-6">Keunggulan Layanan</h3>
                <div className="space-y-4">
                  {highlights.map((highlight, index) => (
                    <div 
                      key={index}
                      className="service-highlight flex items-start gap-3 opacity-0"
                    >
                      <CheckCircle className="w-5 h-5 text-legalo-red flex-shrink-0 mt-0.5" />
                      <span className="text-white/90 text-sm leading-relaxed">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2">
        <span className="text-white/50 text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
      </div>
    </section>
  );
};

export default ServiceDetailHeroSection;
