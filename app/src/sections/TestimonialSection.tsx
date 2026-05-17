import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, Quote } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';

gsap.registerPlugin(ScrollTrigger);

const TestimonialSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isReady } = useLoading();

  useEffect(() => {
    if (!isReady) return;
    
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const header = section.querySelector('.section-header');
      const cards = section.querySelectorAll('.testimonial-card');
      const stats = section.querySelectorAll('.stat-item');
      const partners = section.querySelector('.partners-block');
      
      const tl = gsap.timeline({
        scrollTrigger: { 
          trigger: section, 
          start: 'top 80%', 
          toggleActions: 'play none none none' 
        }
      });
      
      // Header fades in
      tl.fromTo(header,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
        0
      )
      // Cards stagger
      .fromTo(cards,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power2.out' },
        0.2
      )
      // Stats stagger
      .fromTo(stats,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out' },
        0.5
      )
      // Partners fade in last
      .fromTo(partners,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, [isReady]);

  const testimonials = [
    {
      quote: "Legalo.id sangat membantu kami dalam proses pendirian perusahaan. Timnya profesional, responsif, dan memberikan solusi yang tepat untuk setiap masalah hukum yang kami hadapi.",
      name: "Sarah Wijaya",
      role: "CEO, TechStart Indonesia",
      initials: "SW"
    },
    {
      quote: "Virtual office dari Legalo.id sangat membantu kami menghemat biaya operasional. Alamat premium dan fasilitas meeting room yang nyaman membuat klien kami terkesan.",
      name: "Budi Santoso",
      role: "Founder, Konsultan Digital",
      initials: "BS"
    },
    {
      quote: "Layanan HR dan legal mereka sangat komprehensif. Kebijakan perusahaan kami sekarang lebih terstruktur dan sesuai dengan regulasi yang berlaku.",
      name: "Dewi Kusuma",
      role: "HR Director, PT Maju Jaya",
      initials: "DK"
    }
  ];

  const stats = [
    { value: "98%", label: "Tingkat Kepuasan" },
    { value: "500+", label: "Klien Terlayani" },
    { value: "10+", label: "Tahun Pengalaman" },
    { value: "24/7", label: "Dukungan Pelanggan" }
  ];

  const partners = ['Google', 'Tokopedia', 'Gojek', 'Traveloka'];

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-legalo-dark">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="section-header text-center mb-16 lg:mb-20">
            <span className="inline-block bg-legalo-red/10 text-legalo-red text-xs font-semibold px-4 py-2 rounded-full mb-6">
              Testimoni Klien
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.02em] text-white mb-4">
              Apa Kata Klien Kami
            </h2>
            <p className="text-white/60 text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
              Kami bangga telah melayani ratusan klien yang puas dengan layanan kami. Berikut adalah beberapa testimoni dari mereka.
            </p>
          </div>

          {/* Testimonial Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 lg:mb-20">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card bg-white rounded-xl p-6 lg:p-8 relative overflow-hidden">
                {/* Decorative Quote Icon */}
                <div className="absolute top-4 right-4 opacity-10">
                  <Quote className="w-16 h-16 text-legalo-dark" />
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-legalo-dark/80 text-sm leading-relaxed mb-6 relative z-10">
                  "{testimonial.quote}"
                </p>

                {/* Divider */}
                <div className="border-t border-legalo-dark/10 mb-6"></div>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-legalo-red/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-legalo-red font-semibold text-sm">{testimonial.initials}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-legalo-dark text-sm">{testimonial.name}</p>
                    <p className="text-legalo-dark/50 text-xs">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 lg:mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item text-center">
                <p className="font-heading font-bold text-3xl lg:text-4xl text-legalo-red mb-2">{stat.value}</p>
                <p className="text-white/50 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Partners Section */}
          <div className="partners-block pt-10 border-t border-white/10">
            <p className="text-white/40 text-xs uppercase tracking-widest mb-6">Dipercaya oleh tim di</p>
            <div className="flex flex-wrap gap-8 lg:gap-12">
              {partners.map((partner, i) => (
                <span key={i} className="text-white/30 font-heading font-semibold text-xl">{partner}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;