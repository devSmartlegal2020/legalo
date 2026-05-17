import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight, MessageCircle } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';

gsap.registerPlugin(ScrollTrigger);

const AboutCTASection = () => {
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

  const whatsappNumber = '6281234567890';
  const whatsappMessage = 'Halo Legalo.id, saya tertarik untuk berdiskusi tentang kerja sama/partnership dengan tim Anda. Bisa dibantu?';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-legalo-red">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-item w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-8">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="animate-item font-heading font-bold text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-[1.1] tracking-[-0.02em] text-white mb-6">
            Tertarik Berkolaborasi?
          </h2>
          
          <p className="animate-item text-white/80 text-lg lg:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            Kami terbuka untuk berbagai bentuk kerja sama, partnership, dan kolaborasi 
            yang dapat memberikan nilai tambah bagi ekosistem bisnis Indonesia. 
            Mari diskusikan peluang bersama!
          </p>
          
          <div className="animate-item flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white hover:bg-legalo-dark text-legalo-red hover:text-white px-8 py-4 rounded-xl text-base font-semibold inline-flex items-center gap-2 transition-all shadow-lg hover:shadow-xl w-full sm:w-auto justify-center"
            >
              <MessageCircle className="w-5 h-5" />
              Hubungi via WhatsApp
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
          
          <p className="animate-item mt-8 text-white/60 text-sm">
            Atau email kami di{' '}
            <a href="mailto:partnership@legalo.id" className="text-white underline hover:no-underline">
              partnership@legalo.id
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutCTASection;