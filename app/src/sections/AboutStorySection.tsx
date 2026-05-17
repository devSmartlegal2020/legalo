import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Target, Eye, Heart, Lightbulb } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';

gsap.registerPlugin(ScrollTrigger);

const AboutStorySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isReady } = useLoading();

  useEffect(() => {
    if (!isReady) return;
    
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const header = section.querySelector('.section-header');
      const story = section.querySelector('.story-content');
      const cards = section.querySelectorAll('.value-card');
      
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
      .fromTo(story,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
        0.2
      )
      .fromTo(cards,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
        0.4
      );
    }, section);

    return () => ctx.revert();
  }, [isReady]);

  const values = [
    {
      icon: Target,
      title: 'Misi Kami',
      description: 'Menyederhanakan proses legalitas bisnis melalui teknologi, memastikan setiap UMKM dan startup dapat beroperasi dengan legalitas yang kuat tanpa hambatan birokrasi.'
    },
    {
      icon: Eye,
      title: 'Visi Kami',
      description: 'Menjadi platform legal-tech terdepan di Indonesia yang memberdayakan bisnis lokal untuk berkembang dengan fondasi hukum yang kokoh dan terpercaya.'
    },
    {
      icon: Heart,
      title: 'Komitmen UMKM',
      description: 'Kami percaya UMKM adalah tulang punggung ekonomi Indonesia. Oleh karena itu, kami berkomitmen memberikan layanan berkualitas dengan harga terjangkau.'
    },
    {
      icon: Lightbulb,
      title: 'Inovasi Teknologi',
      description: 'Dengan memanfaatkan teknologi terkini, kami terus mengembangkan solusi yang membuat proses hukum menjadi lebih cepat, transparan, dan efisien.'
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-legalo-bg">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="section-header text-center mb-16">
            <span className="inline-block bg-legalo-red/10 text-legalo-red text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              Cerita Kami
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.02em] text-legalo-dark mb-4">
              Mengapa Legalo.id Didirikan?
            </h2>
          </div>

          {/* Story Content */}
          <div className="story-content max-w-3xl mx-auto text-center mb-16">
            <p className="text-legalo-text-secondary text-lg leading-relaxed mb-6">
              Legalo.id lahir dari pengalaman pribadi para pendiri yang menghadapi kesulitan dalam 
              menjalankan proses legalitas bisnis. Kami menyadari bahwa banyak UMKM dan startup 
              terhambat pertumbuhannya karena kompleksitas regulasi dan biaya layanan hukum yang 
              mahal.
            </p>
            <p className="text-legalo-text-secondary text-lg leading-relaxed">
              Pada tahun 2019, kami memutuskan untuk mengubah paradigma ini. Dengan menggabungkan 
              keahlian hukum dan teknologi, Legalo.id hadir sebagai solusi yang affordable, 
              transparan, dan efisien untuk semua kebutuhan legal bisnis Anda.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <div 
                key={index} 
                className="value-card bg-white rounded-3xl p-8 shadow-tile hover:shadow-xl transition-shadow"
              >
                <div className="w-14 h-14 rounded-2xl bg-legalo-red/10 flex items-center justify-center mb-6">
                  <value.icon className="w-7 h-7 text-legalo-red" />
                </div>
                <h3 className="font-heading font-bold text-xl text-legalo-dark mb-3">
                  {value.title}
                </h3>
                <p className="text-legalo-text-secondary leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutStorySection;