import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { Building2, FileCheck, Scale, Award, ChevronRight } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';

gsap.registerPlugin(ScrollTrigger);

const ServicesListSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isReady } = useLoading();

  useEffect(() => {
    if (!isReady) return;
    
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const header = section.querySelector('.section-header');
      const cards = section.querySelectorAll('.service-card');
      
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
      .fromTo(cards,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power2.out' },
        0.2
      );
    }, section);

    return () => ctx.revert();
  }, [isReady]);

  const services = [
    {
      icon: Building2,
      title: 'Pendirian PT/CV',
      subtitle: 'Company Formation',
      price: 'Rp 1.500.000',
      description: 'Layanan pendirian badan usaha lengkap dengan akta, NPWP, dan NIB. Tim legal berpengalaman siap membantu dari awal hingga bisnis Anda beroperasi penuh.',
      features: ['Akta Pendirian', 'NPWP Perusahaan', 'NIB/OSS', 'SK Kemenkumham'],
      link: '/layanan/pt-cv'
    },
    {
      icon: FileCheck,
      title: 'Izin OSS/NIB',
      subtitle: 'Business Licenses',
      price: 'Rp 1.500.000',
      description: 'Pengurusan perizinan usaha sesuai KBLI dan ketentuan OSS. Pastikan bisnis Anda memiliki izin yang lengkap dan sesuai regulasi yang berlaku.',
      features: ['NIB Registration', 'KBLI Mapping', 'Izin Khusus', 'Compliance Check'],
      link: '/layanan/oss-nib'
    },
    {
      icon: Award,
      title: 'Pendaftaran Merek',
      subtitle: 'Intellectual Property',
      price: 'Rp 3.000.000',
      description: 'Perlindungan merek dagang dengan pencarian, pengajuan, dan monitoring. Lindungi identitas bisnis Anda dari pelanggaran hak kekayaan intelektual.',
      features: ['Trademark Search', 'Pengajuan Merek', 'Monitoring', 'Perpanjangan'],
      link: '/layanan/trademark'
    },
    {
      icon: Scale,
      title: 'Konsultasi Hukum',
      subtitle: 'Legal Consultation',
      price: 'Rp 500.000',
      description: 'Konsultasi hukum profesional untuk kebutuhan bisnis Anda. Dapatkan saran dan solusi dari pengacara berpengalaman dalam berbagai bidang hukum.',
      features: ['Contract Review', 'Legal Advisory', 'Dispute Resolution', 'Due Diligence'],
      link: '/layanan/konsultasi'
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-white">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="section-header text-center mb-16 lg:mb-20">
            <span className="inline-block bg-legalo-red/10 text-legalo-red text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              Layanan Kami
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.02em] text-legalo-dark mb-4">
              Solusi Legal Terpercaya
            </h2>
            <p className="text-legalo-dark/60 text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
              Layanan lengkap untuk kebutuhan legal dan operasional bisnis Anda, 
              didukung oleh tim profesional berpengalaman.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="service-card group bg-legalo-bg rounded-2xl p-6 lg:p-8 hover:shadow-lg transition-all duration-300 border border-transparent hover:border-legalo-red/20 flex flex-col"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-legalo-red/10 flex items-center justify-center mb-6 group-hover:bg-legalo-red/20 transition-colors">
                  <service.icon 
                    className="w-7 h-7 text-legalo-red group-hover:scale-110 transition-transform" 
                    strokeWidth={1.5} 
                  />
                </div>

                {/* Title & Subtitle */}
                <div className="mb-4">
                  <h3 className="font-heading font-semibold text-xl lg:text-2xl text-legalo-dark mb-1">
                    {service.title}
                  </h3>
                  <span className="text-legalo-red text-sm font-medium">
                    {service.subtitle}
                  </span>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <span className="text-legalo-dark/50 text-xs uppercase tracking-wider block mb-1">
                    Mulai dari
                  </span>
                  <span className="font-heading font-bold text-2xl lg:text-3xl text-legalo-red">
                    {service.price}
                  </span>
                </div>

                {/* Description */}
                <p className="text-legalo-dark/60 text-sm lg:text-base leading-relaxed mb-6 flex-grow">
                  {service.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {service.features.map((feature, i) => (
                    <span 
                      key={i}
                      className="text-xs bg-white text-legalo-dark/70 px-3 py-1.5 rounded-full border border-legalo-dark/10"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* CTA Button */}
                <Link
                  to={service.link}
                  className="w-full bg-legalo-red hover:bg-legalo-red-dark text-white px-6 py-3 rounded-lg text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all group/btn"
                >
                  Lihat Detail
                  <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesListSection;
