import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, Eye, Clock } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';

gsap.registerPlugin(ScrollTrigger);

const ServicesFeaturesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isReady } = useLoading();

  useEffect(() => {
    if (!isReady) return;
    
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const header = section.querySelector('.section-header');
      const features = section.querySelectorAll('.feature-item');
      
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
      .fromTo(features,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power2.out' },
        0.2
      );
    }, section);

    return () => ctx.revert();
  }, [isReady]);

  const features = [
    {
      icon: Zap,
      title: 'Simpel',
      description: 'Proses digital 100%, tanpa ribet mengurus dokumen. Platform kami memudahkan Anda mengakses layanan legal kapan saja, di mana saja.',
      color: 'bg-yellow-500'
    },
    {
      icon: Eye,
      title: 'Transparan',
      description: 'Harga jujur, tidak ada biaya tersembunyi. Anda tahu persis apa yang Anda bayar dan layanan apa yang Anda terima.',
      color: 'bg-blue-500'
    },
    {
      icon: Clock,
      title: 'Cepat',
      description: 'Pengerjaan efisien dengan timeline yang jelas. Kami mengerti bahwa waktu adalah aset berharga untuk bisnis Anda.',
      color: 'bg-green-500'
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-legalo-bg">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="section-header text-center mb-16 lg:mb-20">
            <span className="inline-block bg-legalo-red/10 text-legalo-red text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              Kenapa Memilih Kami
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.02em] text-legalo-dark mb-4">
              Proses Digital yang Mudah
            </h2>
            <p className="text-legalo-dark/60 text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
              Legalo.id membuat proses legal menjadi lebih mudah, transparan, dan cepat 
              melalui platform digital terintegrasi.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="feature-item text-center"
              >
                {/* Icon Circle */}
                <div className={`w-20 h-20 rounded-full ${feature.color} flex items-center justify-center mx-auto mb-6`}>
                  <feature.icon 
                    className="w-10 h-10 text-white" 
                    strokeWidth={1.5} 
                  />
                </div>

                {/* Title */}
                <h3 className="font-heading font-semibold text-xl lg:text-2xl text-legalo-dark mb-4">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-legalo-dark/60 text-sm lg:text-base leading-relaxed max-w-sm mx-auto">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesFeaturesSection;
