import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight, Star } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';

gsap.registerPlugin(ScrollTrigger);

interface ServicesHeroSectionProps {
  onOpenModal?: () => void;
}

const ServicesHeroSection = ({ onOpenModal }: ServicesHeroSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isReady } = useLoading();

  // Define headline words with accent colors (Option A: "Legalitas" and "Kuat" in red)
  const headlineWords = [
    { text: 'Lindungi', accent: false },
    { text: 'Bisnis', accent: false },
    { text: 'Anda', accent: false },
    { text: 'dengan', accent: false },
    { text: 'Legalitas', accent: true },
    { text: 'Kuat', accent: true },
  ];

  useEffect(() => {
    if (!isReady) return;
    
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const trustBadge = section.querySelector('.trust-badge');
      const words = section.querySelectorAll('.word');
      const desc = section.querySelector('.hero-desc');
      const ctas = section.querySelectorAll('.hero-cta');
      
      const tl = gsap.timeline({
        scrollTrigger: { 
          trigger: section, 
          start: 'top 80%', 
          toggleActions: 'play none none none' 
        }
      });
      
      // Trust badge
      tl.fromTo(trustBadge,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        0
      )
      // Headline words stagger
      .fromTo(words,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' },
        0.2
      )
      // Description
      .fromTo(desc,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        0.6
      )
      // CTAs
      .fromTo(ctas,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
        0.8
      );
    }, section);

    return () => ctx.revert();
  }, [isReady]);

  const scrollToProcess = () => {
    const processSection = document.querySelector('#process-section');
    if (processSection) {
      processSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={sectionRef} 
      className="relative min-h-screen w-full overflow-hidden"
      style={{ zIndex: 10 }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <picture>
          <source 
            srcSet="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80" 
            type="image/webp" 
          />
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
            alt="Professional office environment"
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async"
          />
        </picture>
      </div>

      {/* Dark Overlay - Match homepage exactly */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-black/60" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center px-6 lg:px-12 xl:px-20 pt-24 pb-12">
        <div className="max-w-7xl mx-auto w-full">
          
          {/* Trust Badge */}
          <div className="trust-badge inline-flex items-center gap-2 mb-8 w-fit">
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 border border-white/20">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#F4A261] text-[#F4A261]" />
                ))}
              </div>
              <span className="text-white text-sm font-medium">Terpercaya 500+ Bisnis</span>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            
            {/* Headline - Left Side (8 cols) */}
            <div className="lg:col-span-8">
              <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.05] tracking-[-0.02em]">
                {headlineWords.map((word, i) => (
                  <span
                    key={i}
                    className={`word inline-block mr-[0.2em] opacity-0 ${
                      word.accent ? 'text-legalo-red' : 'text-white'
                    }`}
                  >
                    {word.text}
                  </span>
                ))}
              </h1>
            </div>

            {/* Description - Right Side (4 cols) */}
            <div className="lg:col-span-4 lg:pb-4">
              <p className="hero-desc text-white/70 text-base lg:text-lg leading-relaxed opacity-0">
                Solusi legal one-stop untuk UMKM dan startup. Proses cepat, transparan, dan terjangkau.
              </p>
            </div>
          </div>

          {/* CTAs - Bottom */}
          <div className="flex flex-col sm:flex-row gap-4 mt-12 lg:mt-16">
            <button
              onClick={onOpenModal}
              className="hero-cta group bg-legalo-red hover:bg-legalo-red-dark text-white px-8 py-4 rounded text-sm font-medium inline-flex items-center justify-center gap-2 transition-all opacity-0"
            >
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              Konsultasi Gratis Sekarang
            </button>
            
            <button
              onClick={scrollToProcess}
              className="hero-cta group border border-white/30 hover:bg-white hover:text-black text-white px-8 py-4 rounded text-sm font-medium inline-flex items-center justify-center gap-2 transition-all opacity-0"
            >
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              Lihat Cara Kerja
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2">
        <span className="text-white/50 text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
      </div>
    </section>
  );
};

export default ServicesHeroSection;
