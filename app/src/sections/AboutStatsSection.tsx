import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Building2, FileCheck, Users, Calendar } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';

gsap.registerPlugin(ScrollTrigger);

const AboutStatsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isReady } = useLoading();

  useEffect(() => {
    if (!isReady) return;
    
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const header = section.querySelector('.section-header');
      const stats = section.querySelectorAll('.stat-card');
      
      const tl = gsap.timeline({
        scrollTrigger: { 
          trigger: section, 
          start: 'top 80%', 
          toggleActions: 'play none none none' 
        }
      });
      
      tl.fromTo(header,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
        0
      )
      .fromTo(stats,
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
        0.3
      );
    }, section);

    return () => ctx.revert();
  }, [isReady]);

  const stats = [
    {
      icon: Building2,
      value: '500+',
      label: 'Bisnis Terbantu',
      description: 'UMKM, startup, dan korporasi telah mempercayakan legalitas bisnisnya kepada kami'
    },
    {
      icon: FileCheck,
      value: '1000+',
      label: 'Izin Diproses',
      description: 'Berbagai jenis perizinan berhasil kami urus dengan tingkat keberhasilan tinggi'
    },
    {
      icon: Users,
      value: '98%',
      label: 'Tingkat Kepuasan',
      description: 'Klien kami puas dengan layanan cepat, transparan, dan profesional yang kami berikan'
    },
    {
      icon: Calendar,
      value: '5+',
      label: 'Tahun Beroperasi',
      description: 'Pengalaman bertahun-tahun dalam industri legal-tech Indonesia'
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-legalo-dark">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="section-header text-center mb-16">
            <span className="inline-block bg-legalo-red/20 text-legalo-red text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              Pencapaian Kami
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.02em] text-white mb-4">
              Angka yang Membuktikan Kepercayaan
            </h2>
            <p className="text-white/60 text-base lg:text-lg max-w-2xl mx-auto">
              Setiap angka di bawah ini mewakili bisnis yang berhasil kami bantu dan 
              mimpi yang kami wujudkan bersama klien kami.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="stat-card bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 text-center hover:bg-white/10 transition-colors"
              >
                <div className="w-16 h-16 rounded-2xl bg-legalo-red/20 flex items-center justify-center mx-auto mb-6">
                  <stat.icon className="w-8 h-8 text-legalo-red" />
                </div>
                <p className="font-heading font-bold text-4xl lg:text-5xl text-legalo-red mb-2">
                  {stat.value}
                </p>
                <p className="font-semibold text-white text-lg mb-3">
                  {stat.label}
                </p>
                <p className="text-white/50 text-sm leading-relaxed">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutStatsSection;