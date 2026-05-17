import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote, Star } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';

gsap.registerPlugin(ScrollTrigger);

interface Testimonial {
  quote: string;
  name: string;
  company: string;
  service: string;
  rating: number;
}

interface ServiceDetailTestimonialSectionProps {
  testimonials: Testimonial[];
}

const ServiceDetailTestimonialSection = ({
  testimonials
}: ServiceDetailTestimonialSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isReady } = useLoading();

  useEffect(() => {
    if (!isReady) return;
    
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const header = section.querySelector('.testimonial-header');
      const cards = section.querySelectorAll('.testimonial-card');
      
      const tl = gsap.timeline({
        scrollTrigger: { 
          trigger: section, 
          start: 'top 80%', 
          toggleActions: 'play none none none' 
        }
      });
      
      tl.fromTo(header,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
        0
      )
      .fromTo(cards,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power2.out' },
        0.3
      );
    }, section);

    return () => ctx.revert();
  }, [isReady]);

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-white">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="testimonial-header text-center mb-16 opacity-0">
            <span className="inline-block bg-legalo-red/10 text-legalo-red text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              Testimoni
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.02em] text-legalo-dark mb-4">
              Apa Kata Klien Kami
            </h2>
            <p className="text-legalo-dark/60 text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
              Kisah sukses dari klien yang telah menggunakan layanan kami
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className={`grid gap-6 lg:gap-8 ${testimonials.length === 1 ? 'max-w-2xl mx-auto' : 'grid-cols-1 md:grid-cols-2'}`}>
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="testimonial-card bg-legalo-bg rounded-2xl p-6 lg:p-8 relative opacity-0"
              >
                {/* Quote Icon */}
                <div className="absolute top-6 right-6">
                  <Quote className="w-10 h-10 text-legalo-red/20" />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < testimonial.rating ? 'fill-[#F4A261] text-[#F4A261]' : 'text-gray-300'}`}
                    />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-legalo-dark/80 text-base leading-relaxed mb-6 relative z-10">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-legalo-red/10 flex items-center justify-center">
                    <span className="font-heading font-bold text-legalo-red">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-legalo-dark">{testimonial.name}</div>
                    <div className="text-sm text-legalo-dark/60">{testimonial.company}</div>
                  </div>
                </div>

                {/* Service Tag */}
                <div className="mt-4 pt-4 border-t border-legalo-dark/10">
                  <span className="text-xs text-legalo-dark/50">
                    Layanan: {testimonial.service}
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

export default ServiceDetailTestimonialSection;
