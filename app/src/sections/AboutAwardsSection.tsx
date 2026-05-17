import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Shield, Star, Trophy, FileBadge, Medal } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';

gsap.registerPlugin(ScrollTrigger);

const AboutAwardsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isReady } = useLoading();

  useEffect(() => {
    if (!isReady) return;
    
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const header = section.querySelector('.section-header');
      const items = section.querySelectorAll('.award-item');
      
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
      .fromTo(items,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' },
        0.3
      );
    }, section);

    return () => ctx.revert();
  }, [isReady]);

  const awards = [
    {
      icon: Trophy,
      title: 'Startup Legal Tech of The Year',
      organization: 'Indonesia Technology Awards',
      year: '2024'
    },
    {
      icon: Award,
      title: 'Best Legal Innovation',
      organization: 'ASEAN Business Awards',
      year: '2023'
    },
    {
      icon: Shield,
      title: 'Certified Legal Partner',
      organization: 'Perhimpunan Advokat Indonesia',
      year: '2022'
    },
    {
      icon: Star,
      title: 'Top 10 Legal Startups',
      organization: 'Forbes Indonesia',
      year: '2023'
    },
    {
      icon: FileBadge,
      title: 'ISO 27001 Certified',
      organization: 'Information Security Management',
      year: '2024'
    },
    {
      icon: Medal,
      title: 'Digital Innovation Award',
      organization: 'Kementerian Komunikasi dan Informatika',
      year: '2023'
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-legalo-dark">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="section-header text-center mb-16">
            <span className="inline-block bg-legalo-red/20 text-legalo-red text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              Penghargaan & Sertifikasi
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.02em] text-white mb-4">
              Diakui oleh Industri
            </h2>
            <p className="text-white/60 text-base lg:text-lg max-w-2xl mx-auto">
              Komitmen kami terhadap kualitas dan inovasi telah diakui oleh berbagai 
              lembaga dan organisasi terkemuka.
            </p>
          </div>

          {/* Awards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {awards.map((award, index) => (
              <div 
                key={index} 
                className="award-item bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex items-start gap-4 hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-legalo-red/20 flex items-center justify-center flex-shrink-0">
                  <award.icon className="w-6 h-6 text-legalo-red" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    {award.title}
                  </h3>
                  <p className="text-white/50 text-sm">
                    {award.organization}
                  </p>
                  <span className="inline-block mt-2 text-legalo-red text-xs font-semibold">
                    {award.year}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutAwardsSection;