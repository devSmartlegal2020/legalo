import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Toaster } from '@/components/ui/sonner';
import { useLoading } from '../context/LoadingContext';
import Preloader from '../components/Preloader';
import Navigation from '../sections/Navigation';
import HeroSection from '../sections/HeroSection';
import ProblemSection from '../sections/ProblemSection';
import PillarsSection from '../sections/PillarsSection';
import WhySection from '../sections/WhySection';
import ServicesSection from '../sections/ServicesSection';
import VOSection from '../sections/VOSection';
import TestimonialSection from '../sections/TestimonialSection';
import EventsSection from '../sections/EventsSection';
import CTASection from '../sections/CTASection';
import BlogSection from '../sections/BlogSection';
import FAQSection from '../sections/FAQSection';
import ContactSection from '../sections/ContactSection';
import Footer from '../sections/Footer';

gsap.registerPlugin(ScrollTrigger);

function HomePage() {
  const { isLoading, isReady, setLoading, setReady } = useLoading();
  const [startAnimation, setStartAnimation] = useState(false);

  const handlePreloaderComplete = () => {
    setLoading(false);
    setTimeout(() => {
      setReady(true);
      setStartAnimation(true);
    }, 100);
  };

  useEffect(() => {
    if (startAnimation && isReady && !isLoading) {
      const heroHeadline = document.querySelector('.hero-headline');
      const heroDesc = document.querySelector('.hero-desc');
      const heroCtas = document.querySelector('.hero-ctas');

      const tl = gsap.timeline();

      tl.fromTo(heroHeadline?.querySelectorAll('.word') || [],
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 1, ease: 'power3.out' },
        0
      )
      .fromTo(heroDesc,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        0.4
      )
      .fromTo(heroCtas?.querySelectorAll('button') || [],
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power2.out' },
        0.6
      );
      
      setStartAnimation(false);
      
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 1200);
    }
  }, [startAnimation, isReady, isLoading]);

  useEffect(() => {
    if (isReady && !isLoading) {
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isReady, isLoading]);

  return (
    <div className="relative bg-legalo-bg min-h-screen overflow-x-hidden">
      <Toaster position="top-center" />
      {isLoading && <Preloader onComplete={handlePreloaderComplete} />}
      <div 
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        style={{ visibility: isLoading ? 'hidden' : 'visible' }}
      >
        <Navigation />
        <main>
          <HeroSection />
          <ProblemSection />
          <PillarsSection />
          <WhySection />
          <ServicesSection />
          <VOSection />
          <TestimonialSection />
          <EventsSection />
          <CTASection />
          <BlogSection />
          <FAQSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default HomePage;
