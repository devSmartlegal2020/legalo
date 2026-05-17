import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';

gsap.registerPlugin(ScrollTrigger);

const ContactSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isReady } = useLoading();

  useEffect(() => {
    if (!isReady) return;
    
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tag = section.querySelector('.section-tag');
      const headline = section.querySelector('.headline');
      const desc = section.querySelector('.description');
      const buttons = section.querySelector('.cta-buttons');
      const divider = section.querySelector('.divider');
      const contactList = section.querySelectorAll('.contact-item');
      const imageCol = section.querySelector('.image-col');
      
      const tl = gsap.timeline({
        scrollTrigger: { 
          trigger: section, 
          start: 'top 80%', 
          toggleActions: 'play none none none' 
        }
      });
      
      // Left column elements stagger
      tl.fromTo(tag,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        0
      )
      .fromTo(headline,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
        0.1
      )
      .fromTo(desc,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        0.2
      )
      .fromTo(buttons,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        0.3
      )
      .fromTo(divider,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.6, ease: 'power2.out' },
        0.4
      )
      .fromTo(contactList,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
        0.5
      )
      // Image slides in from right
      .fromTo(imageCol,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        0.2
      );
    }, section);

    return () => ctx.revert();
  }, [isReady]);

  const scrollToSection = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const contactInfo = [
    { icon: Phone, label: 'Telepon', value: '+62 812-3456-7890' },
    { icon: Mail, label: 'Email', value: 'hello@legalo.id' },
    { icon: MapPin, label: 'Alamat', value: 'Jakarta Selatan, Indonesia' },
  ];

  return (
    <section ref={sectionRef} id="contact" className="py-24 lg:py-32 bg-white">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Content */}
            <div className="content-col">
              {/* Tag */}
              <span className="section-tag inline-block bg-legalo-red/10 text-legalo-red text-xs font-semibold px-4 py-2 rounded-full mb-6">
                Mulai Sekarang
              </span>

              {/* Headline */}
              <h2 className="headline font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.02em] text-legalo-dark mb-6">
                Siap Mengembangkan Bisnis Anda?
              </h2>

              {/* Description */}
              <p className="description text-legalo-dark/60 text-base lg:text-lg leading-relaxed mb-8">
                Dapatkan konsultasi gratis untuk evaluasi kebutuhan legal bisnis Anda. Tim ahli kami siap membantu setiap langkah perjalanan bisnis Anda.
              </p>

              {/* CTA Buttons */}
              <div className="cta-buttons flex flex-wrap gap-4 mb-10">
                <button 
                  onClick={() => scrollToSection('#services')}
                  className="group bg-legalo-red hover:bg-legalo-red-dark text-white px-6 py-3.5 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition-all"
                >
                  Konsultasi Gratis
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button 
                  onClick={() => window.open('https://wa.me/6281234567890', '_blank')}
                  className="group border border-legalo-dark/20 hover:border-legalo-red text-legalo-dark hover:text-legalo-red px-6 py-3.5 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition-all"
                >
                  WhatsApp
                </button>
              </div>

              {/* Divider */}
              <div className="divider border-t border-legalo-dark/10 mb-8 origin-left"></div>

              {/* Contact Info List */}
              <div className="space-y-5">
                {contactInfo.map((item, index) => (
                  <div key={index} className="contact-item flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-legalo-red/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-legalo-red" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-legalo-dark/50 text-xs mb-0.5">{item.label}</p>
                      <p className="text-legalo-dark font-medium text-sm">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="image-col">
              <img 
                src="/images/why_team.jpg" 
                alt="Business team meeting" 
                className="w-full h-[400px] sm:h-[500px] lg:h-[600px] object-cover rounded-xl" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;