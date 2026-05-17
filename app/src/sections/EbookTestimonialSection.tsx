import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, Quote, Building2 } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';

gsap.registerPlugin(ScrollTrigger);

const EbookTestimonialSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isReady } = useLoading();

  useEffect(() => {
    if (!isReady) return;
    
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const header = section.querySelector('.section-header');
      const cards = section.querySelectorAll('.testimonial-card');
      const logos = section.querySelectorAll('.company-logo');
      
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
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power2.out' },
        0.2
      )
      .fromTo(logos,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' },
        0.5
      );
    }, section);

    return () => ctx.revert();
  }, [isReady]);

  const testimonials = [
    {
      quote: "E-book dari Legalo.id sangat membantu saya memahami proses pendirian PT. Panduannya praktis dan mudah dipahami, bahkan untuk pemula seperti saya.",
      name: "Andi Wijaya",
      role: "Founder, TechStart Indonesia",
      initials: "AW",
      rating: 5
    },
    {
      quote: "Newsletter Legalo.id selalu memberikan update regulasi yang relevan untuk bisnis kami. Sangat membantu untuk tetap compliant dengan peraturan terbaru.",
      name: "Rina Susanti",
      role: "CEO, UMKM Digital",
      initials: "RS",
      rating: 5
    },
    {
      quote: "Template kontrak dari e-book mereka sangat berguna. Kami bisa menghemat waktu dan biaya konsultan legal dengan menggunakan resources yang diberikan.",
      name: "Budi Santoso",
      role: "Director, PT Maju Bersama",
      initials: "BS",
      rating: 5
    }
  ];

  const companies = [
    'TechStart',
    'UMKM Digital',
    'Inovasi Teknologi',
    'Kreatif Studio',
    'Nusantara Group',
    'Digital Solution'
  ];

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-legalo-bg">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="section-header text-center mb-16 lg:mb-20">
            <span className="inline-block bg-legalo-red/10 text-legalo-red text-xs font-semibold px-4 py-2 rounded-full mb-6">
              Testimonials
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.02em] text-legalo-dark mb-4">
              Apa Kata Pembaca Kami
            </h2>
            <p className="text-legalo-dark/60 text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
              Ribuan UMKM dan startup telah memanfaatkan e-book dan newsletter kami. 
              Berikut testimoni dari mereka.
            </p>
          </div>

          {/* Testimonial Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 lg:mb-20">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card bg-white rounded-2xl p-6 lg:p-8 shadow-sm relative overflow-hidden">
                {/* Decorative Quote Icon */}
                <div className="absolute top-4 right-4 opacity-10">
                  <Quote className="w-16 h-16 text-legalo-dark" />
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
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

          {/* Companies Section */}
          <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-sm">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 text-legalo-dark/60 text-sm mb-2">
                <Building2 className="w-4 h-4" />
                <span>Dipercaya oleh perusahaan</span>
              </div>
              <h3 className="font-heading font-semibold text-xl text-legalo-dark">
                Perusahaan yang Telah Memanfaatkan Resources Kami
              </h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {companies.map((company, i) => (
                <div 
                  key={i} 
                  className="company-logo flex items-center justify-center p-4 bg-legalo-bg rounded-xl hover:shadow-md transition-shadow"
                >
                  <span className="text-legalo-dark/60 font-semibold text-sm">{company}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EbookTestimonialSection;
