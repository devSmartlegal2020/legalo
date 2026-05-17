import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { User, Clock, Users, Headphones, Shield, Check } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';

gsap.registerPlugin(ScrollTrigger);

const WhySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isReady } = useLoading();

  useEffect(() => {
    if (!isReady) return;
    
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const imageCol = section.querySelector('.image-col');
      const statsCard = section.querySelector('.stats-card');
      const tag = section.querySelector('.section-tag');
      const headline = section.querySelector('.headline');
      const desc = section.querySelector('.description');
      const features = section.querySelectorAll('.feature-item');
      const benefitsHeader = section.querySelector('.benefits-header');
      const benefits = section.querySelectorAll('.benefit-item');
      
      const tl = gsap.timeline({
        scrollTrigger: { 
          trigger: section, 
          start: 'top 80%', 
          toggleActions: 'play none none none' 
        }
      });
      
      // Image column fades in
      tl.fromTo(imageCol,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        0
      )
      // Stats card pops up with scale
      .fromTo(statsCard,
        { y: 30, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out' },
        0.3
      )
      // Tag fades in
      .fromTo(tag,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        0.2
      )
      // Headline slides up
      .fromTo(headline,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
        0.3
      )
      // Description fades in
      .fromTo(desc,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        0.4
      )
      // Feature items stagger
      .fromTo(features,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
        0.5
      )
      // Benefits header
      .fromTo(benefitsHeader,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        0.7
      )
      // Benefits items stagger
      .fromTo(benefits,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' },
        0.8
      );
    }, section);

    return () => ctx.revert();
  }, [isReady]);

  const features = [
    { 
      icon: Clock, 
      title: 'Proses Cepat', 
      desc: 'Pengerjaan dokumen dan proses legal yang efisien dengan timeline yang jelas.' 
    },
    { 
      icon: Users, 
      title: 'Tim Berpengalaman', 
      desc: 'Ditangani oleh profesional berpengalaman di bidang hukum dan bisnis.' 
    },
    { 
      icon: Headphones, 
      title: 'Dukungan 24/7', 
      desc: 'Layanan konsultasi dan bantuan kapan saja Anda membutuhkan.' 
    },
    { 
      icon: Shield, 
      title: 'Jaminan Kerahasiaan', 
      desc: 'Perlindungan data dan informasi klien dengan standar keamanan tinggi.' 
    },
  ];

  const benefits = [
    'Konsultasi gratis untuk evaluasi kebutuhan',
    'Harga transparan tanpa biaya tersembunyi',
    'Update progres real-time',
    'Garansi kepuasan layanan',
    'Dokumen digital & fisik',
    'After-sales support',
  ];

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 lg:py-32 bg-legalo-bg">
      <div className="w-full px-5 sm:px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-start">
          {/* Left Column - Image with Stats Card */}
          <div className="image-col relative">
            <div className="relative">
              <img 
                src="/images/why_team.jpg" 
                alt="Team working" 
                className="w-full h-[400px] sm:h-[500px] lg:h-[600px] object-cover rounded-xl" 
              />
              
              {/* Overlapping Stats Card */}
              <div className="stats-card absolute -bottom-6 -right-4 sm:right-4 lg:-right-8 bg-white rounded-xl shadow-lg p-6 max-w-[280px]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-legalo-red/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-legalo-red" strokeWidth={1.5} />
                  </div>
                  <span className="font-heading font-bold text-2xl text-legalo-dark">10+</span>
                </div>
                <p className="text-legalo-dark font-medium text-sm mb-1">Tahun Pengalaman</p>
                <p className="text-legalo-dark/60 text-xs leading-relaxed">Melayani ratusan klien dengan tingkat kepuasan tinggi</p>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:pt-8">
            {/* Tag */}
            <span className="section-tag inline-block bg-legalo-red/10 text-legalo-red text-xs font-semibold px-4 py-2 rounded-full mb-6">
              Mengapa Memilih Kami
            </span>

            {/* Headline */}
            <h2 className="headline font-heading font-bold text-2xl sm:text-3xl lg:text-4xl leading-[1.15] tracking-[-0.02em] text-legalo-dark mb-6">
              Partner Terpercaya untuk Kesuksesan Bisnis Anda
            </h2>

            {/* Description */}
            <p className="description text-legalo-dark/60 text-base lg:text-lg leading-relaxed mb-8">
              Legalo.id telah membantu ratusan perusahaan dari berbagai industri dalam menangani kebutuhan legal dan administrasi bisnis mereka.
            </p>

            {/* 2x2 Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              {features.map((feature, i) => (
                <div key={i} className="feature-item">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-legalo-red/10 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-4 h-4 text-legalo-red" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-legalo-dark text-sm mb-1">{feature.title}</h3>
                      <p className="text-legalo-dark/60 text-xs leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-legalo-dark/10 mb-6"></div>

            {/* Benefits Section */}
            <div className="benefits-header mb-4">
              <p className="font-heading font-semibold text-legalo-dark text-sm">Keuntungan Bekerja Sama dengan Kami:</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {benefits.map((benefit, i) => (
                <div key={i} className="benefit-item flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-green-600" strokeWidth={2} />
                  </div>
                  <span className="text-legalo-dark/70 text-xs">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
