import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLoading } from '@/context/LoadingContext';

gsap.registerPlugin(ScrollTrigger);

interface FAQItem {
  question: string;
  answer: string;
}

interface ServiceDetailFAQSectionProps {
  faqs: FAQItem[];
}

const ServiceDetailFAQSection = ({
  faqs
}: ServiceDetailFAQSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isReady } = useLoading();

  useEffect(() => {
    if (!isReady) return;
    
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const header = section.querySelector('.faq-header');
      const accordion = section.querySelector('.faq-accordion');
      
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
      .fromTo(accordion,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        0.3
      );
    }, section);

    return () => ctx.revert();
  }, [isReady]);

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-legalo-bg">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="faq-header text-center mb-16 opacity-0">
            <span className="inline-block bg-legalo-red/10 text-legalo-red text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              FAQ
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.02em] text-legalo-dark mb-4">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-legalo-dark/60 text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
              Temukan jawaban untuk pertanyaan umum tentang layanan kami
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="faq-accordion bg-white rounded-2xl p-6 lg:p-8 shadow-sm opacity-0">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-100 last:border-0">
                  <AccordionTrigger className="text-left font-semibold text-legalo-dark hover:text-legalo-red py-5 text-base">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-legalo-dark/70 text-sm leading-relaxed pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Contact CTA */}
          <div className="text-center mt-10">
            <p className="text-legalo-dark/60 text-sm">
              Masih punya pertanyaan?{' '}
              <a href="#" className="text-legalo-red hover:underline font-medium">
                Hubungi tim kami
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceDetailFAQSection;
