import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Toaster } from '@/components/ui/sonner';
import { useLoading } from '../context/LoadingContext';
import Navigation from '../sections/Navigation';
import ServicesHeroSection from '../sections/ServicesHeroSection';
import ProcessSection from '../sections/ProcessSection';
import ServicesListSection from '../sections/ServicesListSection';
import ServicesFeaturesSection from '../sections/ServicesFeaturesSection';
import VirtualOfficePackagesSection from '../sections/VirtualOfficePackagesSection';
import TestimonialSection from '../sections/TestimonialSection';
import ServicesCTASection from '../sections/ServicesCTASection';
import Footer from '../sections/Footer';
import ConsultationModal from '../components/ConsultationModal';

gsap.registerPlugin(ScrollTrigger);

const ServicesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isReady, setReady } = useLoading();

  // Ensure ScrollTrigger is refreshed after page load
  useEffect(() => {
    if (!isReady) {
      setReady(true);
    }
    
    // Refresh ScrollTrigger after a short delay to ensure all sections are rendered
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(timer);
  }, [isReady, setReady]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="relative bg-legalo-bg min-h-screen overflow-x-hidden">
      <Toaster position="top-center" />
      
      <Navigation />
      
      <main>
        <ServicesHeroSection onOpenModal={openModal} />
        <ServicesListSection />
        <ProcessSection />
        <ServicesFeaturesSection />
        <VirtualOfficePackagesSection />
        <TestimonialSection />
        <ServicesCTASection onOpenModal={openModal} />
      </main>
      
      <Footer />
      
      <ConsultationModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default ServicesPage;
