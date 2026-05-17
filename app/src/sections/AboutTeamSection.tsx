import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Linkedin, Mail } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';

gsap.registerPlugin(ScrollTrigger);

const AboutTeamSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isReady } = useLoading();

  useEffect(() => {
    if (!isReady) return;
    
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const header = section.querySelector('.section-header');
      const cards = section.querySelectorAll('.team-card');
      
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
      .fromTo(cards,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: 'power2.out' },
        0.3
      );
    }, section);

    return () => ctx.revert();
  }, [isReady]);

  const team = [
    {
      name: 'Ahmad Hidayat',
      role: 'Chief Executive Officer',
      bio: 'Pengalaman 15 tahun di bidang hukum bisnis dan korporasi. Alumni Harvard Law School.',
      initials: 'AH'
    },
    {
      name: 'Sarah Wijaya',
      role: 'Chief Operating Officer',
      bio: 'Spesialis operasional dan transformasi digital. Mantan konsultan di McKinsey & Company.',
      initials: 'SW'
    },
    {
      name: 'Budi Santoso',
      role: 'Chief Technology Officer',
      bio: 'Engineer berpengalaman dengan background di Google dan Tokopedia. Ahli dalam legal-tech.',
      initials: 'BS'
    },
    {
      name: 'Dewi Kusuma',
      role: 'Head of Legal',
      bio: 'Advokat bersertifikat dengan pengalaman menangani 500+ kasus hukum bisnis.',
      initials: 'DK'
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-legalo-bg">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="section-header text-center mb-16">
            <span className="inline-block bg-legalo-red/10 text-legalo-red text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              Tim Kami
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.02em] text-legalo-dark mb-4">
              Dipimpin oleh Profesional Berpengalaman
            </h2>
            <p className="text-legalo-text-secondary text-base lg:text-lg max-w-2xl mx-auto">
              Tim kami terdiri dari para ahli hukum, teknologi, dan bisnis yang berdedikasi 
              untuk memberikan layanan terbaik bagi Anda.
            </p>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div 
                key={index} 
                className="team-card bg-white rounded-3xl p-6 shadow-tile hover:shadow-xl transition-all hover:-translate-y-1"
              >
                {/* Avatar */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-legalo-red/20 to-legalo-red/5 flex items-center justify-center mx-auto mb-6 border-4 border-legalo-red/10">
                  <span className="font-heading font-bold text-2xl text-legalo-red">
                    {member.initials}
                  </span>
                </div>

                {/* Info */}
                <div className="text-center mb-6">
                  <h3 className="font-heading font-bold text-lg text-legalo-dark mb-1">
                    {member.name}
                  </h3>
                  <p className="text-legalo-red text-sm font-medium">
                    {member.role}
                  </p>
                </div>

                {/* Bio */}
                <p className="text-legalo-text-secondary text-sm leading-relaxed text-center mb-6">
                  {member.bio}
                </p>

                {/* Social Links */}
                <div className="flex justify-center gap-3">
                  <a 
                    href="#" 
                    className="w-10 h-10 rounded-full bg-legalo-bg flex items-center justify-center text-legalo-text-secondary hover:bg-legalo-red hover:text-white transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a 
                    href="#" 
                    className="w-10 h-10 rounded-full bg-legalo-bg flex items-center justify-center text-legalo-text-secondary hover:bg-legalo-red hover:text-white transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTeamSection;