import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Toaster } from '@/components/ui/sonner';
import { useLoading } from '../context/LoadingContext';
import Navigation from '../sections/Navigation';
import AboutHeroSection from '../sections/AboutHeroSection';
import AboutStorySection from '../sections/AboutStorySection';
import AboutStatsSection from '../sections/AboutStatsSection';
import AboutTeamSection from '../sections/AboutTeamSection';
import AboutAwardsSection from '../sections/AboutAwardsSection';
import AboutPartnersSection from '../sections/AboutPartnersSection';
import AboutJobsSection from '../sections/AboutJobsSection';
import AboutCTASection from '../sections/AboutCTASection';
import Footer from '../sections/Footer';
import ConsultationModal from '../components/ConsultationModal';

gsap.registerPlugin(ScrollTrigger);

const AboutPage = () => {
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
        <AboutHeroSection onOpenModal={openModal} />
        <AboutStorySection />
        <AboutStatsSection />
        <AboutTeamSection />
        <AboutAwardsSection />
        <AboutPartnersSection />
        <AboutJobsSection />
        <AboutCTASection />
      </main>
      
      <Footer />
      
      <ConsultationModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default AboutPage;