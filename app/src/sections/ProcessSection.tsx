import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FileText, Search, Send, CheckCircle } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';

gsap.registerPlugin(ScrollTrigger);

const ProcessSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isReady } = useLoading();

  useEffect(() => {
    if (!isReady) return;
    
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const header = section.querySelector('.section-header');
      const steps = section.querySelectorAll('.process-step');
      const connector = section.querySelector('.process-connector');
      
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
      .fromTo(steps,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power2.out' },
        0.3
      )
      .fromTo(connector,
        { scaleX: 0 },
        { scaleX: 1, duration: 1, ease: 'power2.out' },
        0.5
      );
    }, section);

    return () => ctx.revert();
  }, [isReady]);

  const steps = [
    {
      icon: Search,
      number: '01',
      title: 'Konsultasi Gratis',
      description: 'Diskusikan kebutuhan legal bisnis Anda dengan tim ahli kami. Kami akan membantu mengidentifikasi solusi terbaik.'
    },
    {
      icon: FileText,
      number: '02',
      title: 'Dokumentasi',
      description: 'Tim kami akan mempersiapkan dan mengurus semua dokumen legal yang diperlukan untuk bisnis Anda.'
    },
    {
      icon: Send,
      number: '03',
      title: 'Pengajuan',
      description: 'Kami mengurus semua proses pengajuan ke instansi terkait dengan cepat dan profesional.'
    },
    {
      icon: CheckCircle,
      number: '04',
      title: 'Selesai',
      description: 'Dokumen legal Anda siap digunakan. Kami juga menyediakan dukungan berkelanjutan untuk kebutuhan legal selanjutnya.'
    }
  ];

  return (
    <section 
      ref={sectionRef} 
      id="process-section"
      className="py-24 lg:py-32 bg-legalo-dark"
    >
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-[1440px] mx-auto">
          {/* Section Header */}
          <div className="section-header text-center mb-16 lg:mb-20">
            <span className="inline-block bg-legalo-red/10 text-legalo-red text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              Cara Kerja
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.02em] text-white mb-4">
              Proses yang Simpel dan Transparan
            </h2>
            <p className="text-[#94A3B8] text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
              Hanya 4 langkah mudah untuk menyelesaikan kebutuhan legal bisnis Anda bersama Legalo.id
            </p>
          </div>

          {/* Process Steps */}
          <div className="relative">
            {/* Connector Line - Desktop Only */}
            <div className="hidden lg:block absolute top-[60px] left-[12.5%] right-[12.5%] h-0.5 process-connector origin-left">
              <div className="w-full h-full bg-gradient-to-r from-legalo-red via-legalo-red to-legalo-red/30"></div>
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
              {steps.map((step, index) => (
                <div 
                  key={index}
                  className="process-step relative flex flex-col items-center text-center"
                >
                  {/* Step Number and Icon */}
                  <div className="relative z-10 mb-6">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-legalo-red to-legalo-red-dark flex items-center justify-center shadow-lg shadow-legalo-red/20">
                      <step.icon className="w-12 h-12 text-white" strokeWidth={1.5} />
                    </div>
                    <span className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-white text-legalo-dark font-bold text-sm flex items-center justify-center shadow-lg">
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="font-heading font-semibold text-xl text-white mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-[#94A3B8] text-sm lg:text-base leading-relaxed max-w-[280px]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
