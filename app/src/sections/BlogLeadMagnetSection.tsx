import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Download, FileText, CheckCircle } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

interface BlogLeadMagnetSectionProps {
  onOpenModal: () => void;
}

const BlogLeadMagnetSection = ({ onOpenModal }: BlogLeadMagnetSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isReady } = useLoading();

  useEffect(() => {
    if (!isReady) return;
    
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const elements = section.querySelectorAll('.animate-item');
      
      gsap.fromTo(elements,
        { y: 40, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          stagger: 0.1, 
          ease: 'power2.out',
          scrollTrigger: { 
            trigger: section, 
            start: 'top 80%', 
            toggleActions: 'play none none none' 
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, [isReady]);

  const benefits = [
    'Panduan lengkap pendirian PT/CV',
    'Checklist dokumen legal yang wajib dimiliki',
    'Template kontrak dasar untuk UMKM',
    'Tips mengurus perizinan bisnis'
  ];

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-legalo-dark">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div className="animate-item">
              <span className="inline-block bg-legalo-red/20 text-legalo-red text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                Free Resource
              </span>
              
              <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.02em] text-white mb-6">
                Download Free Legal Guide for UMKM
              </h2>
              
              <p className="text-white/70 text-lg lg:text-xl leading-relaxed mb-8">
                Dapatkan panduan lengkap tentang aspek legalitas bisnis untuk UMKM dan startup. 
                E-book ini dirancang khusus untuk membantu Anda memahami dasar-dasar hukum bisnis di Indonesia.
              </p>
              
              <ul className="space-y-3 mb-10">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3 text-white/80">
                    <CheckCircle className="w-5 h-5 text-legalo-red shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                onClick={onOpenModal}
                className="h-14 px-8 bg-legalo-red hover:bg-legalo-red-dark text-white font-medium rounded-xl inline-flex items-center gap-3 transition-colors text-base"
              >
                <Download className="w-5 h-5" />
                Download E-book
              </Button>
            </div>
            
            {/* Visual */}
            <div className="animate-item flex justify-center lg:justify-end">
              <div className="relative">
                {/* E-book Mockup */}
                <div className="relative w-72 h-96 bg-gradient-to-br from-legalo-red to-legalo-red-dark rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="absolute inset-4 bg-white/10 rounded-xl border border-white/20 flex flex-col items-center justify-center p-6">
                    <FileText className="w-20 h-20 text-white/80 mb-6" />
                    <div className="text-center">
                      <h3 className="font-heading font-bold text-xl text-white mb-2">
                        Legal Guide
                      </h3>
                      <p className="text-white/70 text-sm">
                        For UMKM & Startups
                      </p>
                    </div>
                    
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex items-center gap-2 text-white/60 text-xs">
                        <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">L</span>
                        <span>Legalo.id</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-legalo-red/30 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-legalo-red/20 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogLeadMagnetSection;
