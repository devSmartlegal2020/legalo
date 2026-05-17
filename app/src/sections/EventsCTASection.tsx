import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Mail } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

const EventsCTASection = () => {
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
          stagger: 0.15, 
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

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-white">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-legalo-dark rounded-3xl p-8 lg:p-16 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-legalo-red/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-legalo-red/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="animate-item inline-block bg-legalo-red/20 text-legalo-red text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                  Stay Connected
                </span>
                
                <h2 className="animate-item font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.02em] text-white mb-6">
                  Never Miss an Event
                </h2>
                
                <p className="animate-item text-white/70 text-lg leading-relaxed mb-8">
                  Subscribe to our event newsletter and be the first to know about upcoming webinars, 
                  workshops, and exclusive networking opportunities for the business community.
                </p>
                
                <div className="animate-item flex flex-col sm:flex-row gap-4">
                  <Button className="bg-legalo-red hover:bg-legalo-red-dark text-white font-medium px-8 py-6 rounded-lg transition-colors inline-flex items-center justify-center gap-2 group">
                    Subscribe to Updates
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="border-white/30 text-white hover:bg-white/10 font-medium px-8 py-6 rounded-lg transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Contact Us
                  </Button>
                </div>
              </div>
              
              <div className="animate-item lg:pl-12">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <h3 className="font-heading font-semibold text-xl text-white mb-6">
                    Why Attend Our Events?
                  </h3>
                  
                  <ul className="space-y-4">
                    {[
                      'Learn from industry experts and legal professionals',
                      'Network with fellow entrepreneurs and business owners',
                      'Get practical insights you can apply immediately',
                      'Stay updated on the latest legal regulations',
                      'Free consultations and Q&A sessions',
                      'Access exclusive resources and templates'
                    ].map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-legalo-red/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-legalo-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-white/70 text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsCTASection;
