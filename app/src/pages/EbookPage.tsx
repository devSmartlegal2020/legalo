import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Toaster } from '@/components/ui/sonner';
import { useLoading } from '../context/LoadingContext';
import Navigation from '../sections/Navigation';
import EbookHeroSection from '../sections/EbookHeroSection';
import EbookListSection from '../sections/EbookListSection';
import EbookCTASection from '../sections/EbookCTASection';
import EbookTestimonialSection from '../sections/EbookTestimonialSection';
import Footer from '../sections/Footer';
import ConsultationModal from '../components/ConsultationModal';

gsap.registerPlugin(ScrollTrigger);

const EbookPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isReady, setReady } = useLoading();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (!isReady) {
      setReady(true);
    }
    
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(timer);
  }, [isReady, setReady]);

  return (
    <div className="relative bg-legalo-bg min-h-screen overflow-x-hidden">
      <Toaster position="top-center" />
      
      <Navigation />
      
      <main>
        <EbookHeroSection onOpenModal={openModal} />
        <EbookListSection />
        <EbookCTASection />
        <EbookTestimonialSection />
      </main>
      
      <Footer />
      
      <ConsultationModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default EbookPage;
