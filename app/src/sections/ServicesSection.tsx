import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';

gsap.registerPlugin(ScrollTrigger);

const ServicesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isReady } = useLoading();

  useEffect(() => {
    if (!isReady) return;
    
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const header = section.querySelector('.animate-header');
      const items = section.querySelectorAll('.animate-item');
      
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
      // Items stagger upward
      .fromTo(items,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power2.out' },
        0.2
      );
    }, section);

    return () => ctx.revert();
  }, [isReady]);

  const services = [
    { num: '01', title: 'Pendirian PT', subtitle: 'Company Formation', description: 'Complete company setup including deeds, NPWP, and NIB registration.' },
    { num: '02', title: 'Izin Usaha', subtitle: 'Business Licenses', description: 'All business permits mapped to your KBLI codes and industry requirements.' },
    { num: '03', title: 'Merek & HAKI', subtitle: 'Intellectual Property', description: 'Trademark search, filing, and monitoring to protect your brand.' },
    { num: '04', title: 'Virtual Office', subtitle: 'Business Address', description: 'Premium address, mail handling, and meeting rooms in major cities.' },
  ];

  return (
    <section ref={sectionRef} id="services" className="py-24 lg:py-32 bg-white">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="animate-header flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 lg:mb-16">
            <div>
              <span className="text-legalo-red text-xs font-semibold uppercase tracking-widest mb-4 block">APA YANG KAMI TAWARKAN</span>
              <h2 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-[-0.02em] text-legalo-dark">
                Layanan Kami
              </h2>
            </div>
            <p className="text-legalo-dark/60 text-base lg:text-lg max-w-md">
              Solusi lengkap untuk kebutuhan legal dan operasional bisnis Anda.
            </p>
          </div>

          {/* Service List */}
          <div>
            {services.map((service, index) => (
              <div 
                key={index} 
                className="animate-item group border-t border-legalo-dark/10 py-6 lg:py-8 cursor-pointer hover:bg-legalo-bg/50 transition-colors"
              >
                <div className="grid grid-cols-12 gap-4 lg:gap-8 items-center">
                  {/* Number */}
                  <div className="col-span-2 lg:col-span-1">
                    <span className="font-heading font-bold text-2xl lg:text-3xl text-legalo-dark/30 group-hover:text-legalo-red transition-colors">
                      {service.num}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="col-span-10 lg:col-span-3">
                    <h3 className="font-heading font-semibold text-lg lg:text-xl text-legalo-dark group-hover:text-legalo-red transition-colors">
                      {service.title}
                    </h3>
                    <span className="text-legalo-dark/50 text-sm">
                      {service.subtitle}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="col-span-12 lg:col-span-6 lg:col-start-5">
                    <p className="text-legalo-dark/60 text-sm lg:text-base">
                      {service.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="hidden lg:flex col-span-2 justify-end">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      index === 0 
                        ? 'bg-legalo-red group-hover:bg-legalo-red-dark' 
                        : 'border border-legalo-dark/20 group-hover:bg-legalo-red group-hover:border-legalo-red'
                    }`}>
                      <ChevronRight className={`w-5 h-5 transition-colors ${
                        index === 0 ? 'text-white' : 'text-legalo-dark/50 group-hover:text-white'
                      }`} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {/* Bottom border */}
            <div className="border-t border-legalo-dark/10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
