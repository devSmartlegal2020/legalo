import { ChevronRight } from 'lucide-react';

const HeroSection = () => {
  const scrollToServices = () => {
    const element = document.querySelector('#services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const headlineWords = [
    { text: 'Legal', accent: true },
    { text: '&', accent: false },
    { text: 'Virtual', accent: true },
    { text: 'Office', accent: true },
    { text: 'Solutions', accent: false },
    { text: 'for', accent: false },
    { text: 'Indonesian', accent: false },
    { text: 'Businesses', accent: false },
  ];

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden"
      style={{ zIndex: 10 }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/hero_bg.jpg"
          alt="Professional business meeting"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Dark Overlay */}
      <div className="hero-overlay absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-black/60" />

      {/* Content */}
      <div className="hero-content relative z-10 min-h-screen flex flex-col justify-center px-6 lg:px-12 xl:px-20 pt-24 pb-12">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            {/* Main Headline - Left Side */}
            <div className="lg:col-span-8">
              <h1 className="hero-headline font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.05] tracking-[-0.02em]">
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

            {/* Description - Right Side */}
            <div className="lg:col-span-4 lg:pb-4">
              <p className="hero-desc text-white/70 text-base lg:text-lg leading-relaxed opacity-0">
              Legalo.id connects startups, UMKM, and corporations with fast, transparent legal services and virtual office solutions across Indonesia.
            </p>
            </div>
          </div>

          {/* CTAs - Bottom */}
          <div className="hero-ctas flex flex-col sm:flex-row gap-4 mt-12 lg:mt-16">
            <button
              onClick={scrollToServices}
              className="group bg-legalo-red hover:bg-legalo-red-dark text-white px-8 py-4 rounded text-sm font-medium inline-flex items-center justify-center gap-2 transition-all"
            >
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              Lihat Layanan Kami
            </button>
            <button
              onClick={scrollToContact}
              className="group border border-white/30 hover:bg-white hover:text-black text-white px-8 py-4 rounded text-sm font-medium inline-flex items-center justify-center gap-2 transition-all"
            >
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              Hubungi Kami
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

export default HeroSection;
