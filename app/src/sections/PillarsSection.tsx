import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, Eye, HeadphonesIcon, Linkedin } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';

gsap.registerPlugin(ScrollTrigger);

const PillarsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isReady } = useLoading();

  useEffect(() => {
    if (!isReady) return;
    
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Values section animations
      const valuesHeader = section.querySelector('.values-header');
      const valueCards = section.querySelectorAll('.value-card');
      
      // Experts section animations
      const expertsHeader = section.querySelector('.experts-header');
      const expertCards = section.querySelectorAll('.expert-card');
      
      // Values timeline
      const valuesTl = gsap.timeline({
        scrollTrigger: { 
          trigger: section.querySelector('.values-section'), 
          start: 'top 80%', 
          toggleActions: 'play none none none' 
        }
      });
      
      valuesTl.fromTo(valuesHeader,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        0
      )
      .fromTo(valueCards,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power2.out' },
        0.2
      );
      
      // Experts timeline
      const expertsTl = gsap.timeline({
        scrollTrigger: { 
          trigger: section.querySelector('.experts-section'), 
          start: 'top 80%', 
          toggleActions: 'play none none none' 
        }
      });
      
      expertsTl.fromTo(expertsHeader,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        0
      )
      .fromTo(expertCards,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
        0.2
      );
    }, section);

    return () => ctx.revert();
  }, [isReady]);

  const pillars = [
    { icon: Zap, label: 'CEPAT', headline: 'Fast Process', body: 'Standard packages delivered in days, not months.' },
    { icon: Eye, label: 'TRANSPARAN', headline: 'Transparent Pricing', body: 'Clear quotes. No surprise charges.' },
    { icon: HeadphonesIcon, label: 'PROFESIONAL', headline: 'Professional Support', body: 'Legal team + account manager, always reachable.' },
  ];

  const experts = [
    {
      name: 'Dr. Ahmad Setiawan',
      title: 'Corporate Lawyer',
      description: 'Ahli dalam hukum bisnis dan pendirian perusahaan dengan pengalaman 15+ tahun.',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop'
    },
    {
      name: 'Sarah Wijaya, S.H.',
      title: 'IP Specialist',
      description: 'Spesialis perlindungan merek dan hak kekayaan intelektual untuk startup.',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop'
    },
    {
      name: 'Budi Santoso, S.H., M.H.',
      title: 'Employment Law',
      description: 'Pakar ketenagakerjaan dan kontrak kerja untuk berbagai industri.',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop'
    },
    {
      name: 'Dewi Kusuma, S.H.',
      title: 'Contract Specialist',
      description: 'Berfokus pada draft kontrak bisnis dan negosiasi.',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop'
    },
    {
      name: 'Rini Pratama, S.H., LL.M.',
      title: 'Tax & Compliance',
      description: 'Ahli perpajakan dan kepatuhan regulasi bisnis.',
      photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop'
    }
  ];

  return (
    <section ref={sectionRef} className="bg-white">
      {/* Part 1: Our Values */}
      <div className="values-section py-24 lg:py-32">
        <div className="w-full px-6 lg:px-12 xl:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="values-header text-center mb-16 lg:mb-20">
              <span className="text-legalo-red text-xs font-semibold uppercase tracking-widest mb-4 block">NILAI KAMI</span>
              <h2 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-[-0.02em] text-legalo-dark">
                Fast. Transparent. Professional.
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {pillars.map((pillar, index) => (
                <div key={index} className="value-card text-center p-8 lg:p-10 border border-legalo-dark/10 rounded-xl hover:border-legalo-red/30 hover:shadow-lg transition-all duration-300">
                  <div className="w-14 h-14 rounded-xl bg-legalo-red/10 flex items-center justify-center mb-6 mx-auto">
                    <pillar.icon className="w-7 h-7 text-legalo-red" strokeWidth={1.5} />
                  </div>
                  <span className="text-legalo-red/70 text-xs font-semibold uppercase tracking-widest mb-3 block">{pillar.label}</span>
                  <h3 className="font-heading font-semibold text-xl lg:text-2xl text-legalo-dark mb-4">{pillar.headline}</h3>
                  <p className="text-legalo-dark/60 text-sm lg:text-base leading-relaxed">{pillar.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: Top 5 Legal Experts */}
      <div className="experts-section py-24 lg:py-32 bg-slate-50">
        <div className="w-full px-6 lg:px-12 xl:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="experts-header text-center mb-12 lg:mb-16">
              <span className="text-legalo-red text-xs font-semibold uppercase tracking-widest mb-4 block">TIM AHLI KAMI</span>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.05] tracking-[-0.02em] text-legalo-dark">
                Top 5 Legal Experts
              </h2>
              <p className="text-legalo-dark/60 text-base lg:text-lg mt-4 max-w-2xl mx-auto">
                Tim profesional kami siap membantu kebutuhan legal bisnis Anda
              </p>
            </div>

            {/* Horizontal Scrollable Container with Partial 4th Card */}
            <div className="relative overflow-hidden">
              <div 
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6"
                style={{ 
                  scrollbarWidth: 'none', 
                  msOverflowStyle: 'none',
                }}
              >
                {experts.map((expert, index) => (
                  <div 
                    key={index} 
                    className="expert-card flex-shrink-0 w-[320px] snap-start bg-white border border-legalo-dark/10 rounded-xl overflow-hidden hover:border-legalo-red/30 hover:shadow-lg transition-all duration-300"
                  >
                    {/* Photo */}
                    <div className="relative h-[200px] overflow-hidden">
                      <img 
                        src={expert.photo} 
                        alt={expert.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-heading font-semibold text-lg text-legalo-dark mb-1">{expert.name}</h3>
                      <p className="text-legalo-red text-sm font-medium mb-3">{expert.title}</p>
                      <p className="text-legalo-dark/60 text-sm leading-relaxed mb-4">{expert.description}</p>
                      
                      {/* LinkedIn Link */}
                      <a 
                        href="#" 
                        className="inline-flex items-center gap-2 text-legalo-dark/50 hover:text-legalo-red text-sm transition-colors"
                        onClick={(e) => e.preventDefault()}
                      >
                        <Linkedin className="w-4 h-4" />
                        <span>Profil LinkedIn</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PillarsSection;
