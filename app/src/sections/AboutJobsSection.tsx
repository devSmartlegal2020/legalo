import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Clock, ChevronRight, Briefcase } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';

gsap.registerPlugin(ScrollTrigger);

const AboutJobsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isReady } = useLoading();

  useEffect(() => {
    if (!isReady) return;
    
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const header = section.querySelector('.section-header');
      const cards = section.querySelectorAll('.job-card');
      
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

  const jobs = [
    {
      title: 'Senior Legal Consultant',
      department: 'Legal',
      location: 'Jakarta',
      type: 'Full-time',
      description: 'Bertanggung jawab untuk memberikan konsultasi hukum komprehensif kepada klien, meninjau dokumen legal, dan memastikan kepatuhan terhadap regulasi yang berlaku.',
      requirements: ['Sarjana Hukum', 'Pengalaman 3+ tahun', 'Sertifikat Advokat']
    },
    {
      title: 'Marketing Manager',
      department: 'Marketing',
      location: 'Jakarta / Remote',
      type: 'Full-time',
      description: 'Memimpin strategi pemasaran digital, mengelola kampanye iklan, dan membangun brand awareness Legalo.id di pasar target.',
      requirements: ['Pengalaman 4+ tahun di marketing', 'Ahli digital marketing', 'Leadership skills']
    },
    {
      title: 'Software Engineer',
      department: 'Technology',
      location: 'Jakarta / Remote',
      type: 'Full-time',
      description: 'Mengembangkan dan memelihara platform legal-tech kami, bekerja dengan tim produk untuk menghadirkan fitur-fitur inovatif.',
      requirements: ['Pengalaman dengan React/Node.js', 'Database knowledge', 'Problem solver']
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-legalo-dark">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="section-header text-center mb-16">
            <span className="inline-block bg-legalo-red/20 text-legalo-red text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              Karir
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.02em] text-white mb-4">
              Bergabung dengan Tim Kami
            </h2>
            <p className="text-white/60 text-base lg:text-lg max-w-2xl mx-auto">
              Kami selalu mencari talenta berbakat yang ingin berkontribusi dalam 
              membangun ekosistem legal yang lebih baik untuk Indonesia.
            </p>
          </div>

          {/* Jobs List */}
          <div className="space-y-6">
            {jobs.map((job, index) => (
              <div 
                key={index} 
                className="job-card bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 lg:p-8 hover:bg-white/10 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  {/* Left: Job Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-legalo-red bg-legalo-red/10 px-3 py-1 rounded-full">
                        <Briefcase className="w-3 h-3" />
                        {job.department}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-white/60 bg-white/10 px-3 py-1 rounded-full">
                        <Clock className="w-3 h-3" />
                        {job.type}
                      </span>
                    </div>
                    
                    <h3 className="font-heading font-bold text-xl text-white mb-2">
                      {job.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-white/50 text-sm mb-4">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                    
                    <p className="text-white/60 text-sm leading-relaxed mb-4">
                      {job.description}
                    </p>
                    
                    {/* Requirements */}
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map((req, i) => (
                        <span 
                          key={i}
                          className="text-xs text-white/40 bg-white/5 px-3 py-1 rounded-full"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: Apply Button */}
                  <div className="flex-shrink-0">
                    <button className="group w-full lg:w-auto bg-legalo-red hover:bg-legalo-red-dark text-white px-6 py-3 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all">
                      Lamar Sekarang
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutJobsSection;