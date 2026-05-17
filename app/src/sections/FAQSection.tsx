import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useLoading } from '@/context/LoadingContext';

gsap.registerPlugin(ScrollTrigger);

const FAQSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isReady } = useLoading();

  useEffect(() => {
    if (!isReady) return;
    
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const header = section.querySelector('.animate-header');
      const items = section.querySelectorAll('.animate-item');
      
      const tl = gsap.timeline({
        scrollTrigger: { 
          trigger: section, 
          start: 'top 80%', 
          toggleActions: 'play none none none' 
        }
      });
      
      // Header animates first
      tl.fromTo(header,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        0
      )
      // Accordion items stagger upward
      .fromTo(items,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
        0.2
      );
    }, section);

    return () => ctx.revert();
  }, [isReady]);

  const faqs = [
    { question: 'Berapa lama proses pendirian PT?', answer: 'Proses pendirian PT biasanya memakan waktu 7-14 hari kerja, tergantung pada kelengkapan dokumen dan respon dari pihak berwenang. Kami akan memantau setiap tahapan dan memberikan update secara berkala.' },
    { question: 'Apakah bisa dilakukan secara online?', answer: 'Ya, seluruh proses dapat dilakukan secara online. Anda tidak perlu datang ke kantor kami. Cukup kirimkan dokumen yang diperlukan melalui portal kami, dan tim kami akan mengurus sisanya.' },
    { question: 'Di kota mana Virtual Office tersedia?', answer: 'Virtual Office kami tersedia di Jakarta, Surabaya, Bali, dan Bandung. Semua lokasi berada di area bisnis premium dengan alamat yang dapat digunakan untuk legalitas perusahaan.' },
    { question: 'Bagaimana sistem pembayaran?', answer: 'Kami menerima pembayaran melalui transfer bank, kartu kredit, dan virtual account. Untuk layanan tertentu, kami juga menyediakan opsi cicilan dengan bunga ringan.' },
    { question: 'Apakah ada garansi keberhasilan izin?', answer: 'Kami memberikan jaminan pengurusan ulang gratis jika izin tidak berhasil dikarenakan kesalahan dari pihak kami. Namun, keberhasilan akhir tetap bergantung pada persyaratan dan regulasi yang berlaku.' },
    { question: 'Bisakah Legalo membantu kontrak karyawan?', answer: 'Tentu saja. Tim legal kami dapat membantu menyusun kontrak kerja, perjanjian kerahasiaan (NDA), dan dokumen HR lainnya yang sesuai dengan regulasi ketenagakerjaan Indonesia.' },
  ];

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-legalo-bg">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-3xl mx-auto">
          <div className="animate-header text-center mb-12 lg:mb-16">
            <span className="text-legalo-red text-xs font-semibold uppercase tracking-widest mb-4 block">FAQ</span>
            <h2 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-[-0.02em] text-legalo-dark">Common questions.</h2>
          </div>
          <div className="space-y-3">
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="animate-item bg-white border border-legalo-dark/10 rounded-xl px-5 lg:px-6 data-[state=open]:border-legalo-red/30 transition-colors">
                  <AccordionTrigger className="text-left font-heading font-medium text-base lg:text-lg text-legalo-dark hover:text-legalo-red transition-colors py-5">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-legalo-dark/60 text-sm lg:text-base leading-relaxed pb-5">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
