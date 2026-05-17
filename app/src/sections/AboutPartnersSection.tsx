import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLoading } from '@/context/LoadingContext';

gsap.registerPlugin(ScrollTrigger);

const AboutPartnersSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isReady } = useLoading();

  useEffect(() => {
    if (!isReady) return;
    
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const header = section.querySelector('.section-header');
      const logos = section.querySelectorAll('.partner-logo');
      
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
      .fromTo(logos,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power2.out' },
        0.3
      );
    }, section);

    return () => ctx.revert();
  }, [isReady]);

  const partners = [
    { name: 'Google for Startups', category: 'Accelerator' },
    { name: 'East Ventures', category: 'Venture Capital' },
    { name: '1000 Startup Digital', category: 'Program' },
    { name: 'Indigo Incubator', category: 'Incubator' },
    { name: 'BEKRAF', category: 'Government' },
    { name: 'Kemenkop UKM', category: 'Government' },
    { name: 'IDEO', category: 'Design Partner' },
    { name: 'AWS', category: 'Cloud Partner' }
  ];

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-legalo-bg">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="section-header text-center mb-16">
            <span className="inline-block bg-legalo-red/10 text-legalo-red text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              Partner Kami
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.02em] text-legalo-dark mb-4">
              Kolaborasi untuk Masa Depan
            </h2>
            <p className="text-legalo-text-secondary text-base lg:text-lg max-w-2xl mx-auto">
              Kami bekerja sama dengan berbagai organisasi, accelerator, dan lembaga 
              untuk memberikan layanan terbaik bagi ekosistem startup Indonesia.
            </p>
          </div>

          {/* Partners Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {partners.map((partner, index) => (
              <div 
                key={index} 
                className="partner-logo bg-white rounded-2xl p-6 shadow-tile hover:shadow-xl transition-all hover:-translate-y-1 group"
              >
                {/* Logo Placeholder */}
                <div className="w-full h-16 bg-legalo-bg rounded-xl flex items-center justify-center mb-4 group-hover:bg-legalo-red/5 transition-colors">
                  <span className="font-heading font-bold text-xl text-legalo-text-secondary group-hover:text-legalo-red transition-colors">
                    {partner.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                
                {/* Info */}
                <div className="text-center">
                  <p className="font-semibold text-legalo-dark text-sm mb-1">
                    {partner.name}
                  </p>
                  <p className="text-legalo-text-secondary text-xs">
                    {partner.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPartnersSection;