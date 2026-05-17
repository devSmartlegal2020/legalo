import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLoading } from '@/context/LoadingContext';

gsap.registerPlugin(ScrollTrigger);

interface ServiceDetailContentSectionProps {
  whatIs: string;
  whoIsFor: string;
  whyImportant: string;
}

const ServiceDetailContentSection = ({
  whatIs,
  whoIsFor,
  whyImportant
}: ServiceDetailContentSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isReady } = useLoading();

  useEffect(() => {
    if (!isReady) return;
    
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const cards = section.querySelectorAll('.content-card');
      
      cards.forEach((card) => {
        gsap.fromTo(card,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, [isReady]);

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-legalo-bg">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* What Is */}
            <div className="content-card bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 opacity-0">
              <div className="w-12 h-12 rounded-xl bg-legalo-red/10 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-legalo-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-heading font-semibold text-xl text-legalo-dark mb-4">Apa Itu Layanan Ini?</h3>
              <p className="text-legalo-dark/70 text-sm leading-relaxed">{whatIs}</p>
            </div>

            {/* Who Is For */}
            <div className="content-card bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 opacity-0">
              <div className="w-12 h-12 rounded-xl bg-legalo-red/10 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-legalo-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-heading font-semibold text-xl text-legalo-dark mb-4">Untuk Siapa?</h3>
              <p className="text-legalo-dark/70 text-sm leading-relaxed">{whoIsFor}</p>
            </div>

            {/* Why Important */}
            <div className="content-card bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 opacity-0">
              <div className="w-12 h-12 rounded-xl bg-legalo-red/10 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-legalo-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-heading font-semibold text-xl text-legalo-dark mb-4">Mengapa Penting?</h3>
              <p className="text-legalo-dark/70 text-sm leading-relaxed">{whyImportant}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceDetailContentSection;
