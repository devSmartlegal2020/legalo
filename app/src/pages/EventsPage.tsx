import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Toaster } from '@/components/ui/sonner';
import { useLoading } from '../context/LoadingContext';
import Navigation from '../sections/Navigation';
import EventsHeroSection from '../sections/EventsHeroSection';
import EventsFeaturedSection from '../sections/EventsFeaturedSection';
import EventsListSection from '../sections/EventsListSection';
import EventsScheduleSection from '../sections/EventsScheduleSection';
import EventsCTASection from '../sections/EventsCTASection';
import Footer from '../sections/Footer';
import ConsultationModal from '../components/ConsultationModal';
import type { EventData } from '@/data/eventsData';
import { eventAPI } from '@/services/api';

export interface EventsPageData {
  featured: EventData[];
  upcoming: EventData[];
  schedule: EventData[];
}

gsap.registerPlugin(ScrollTrigger);

const EventsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isReady, setReady } = useLoading();
  const [eventsData, setEventsData] = useState<EventsPageData>({ featured: [], upcoming: [], schedule: [] });
  const [isLoading, setIsLoading] = useState(true);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (!isReady) {
      setReady(true);
    }
    
    fetchEvents();

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(timer);
  }, [isReady, setReady]);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const [featuredResponse, upcomingResponse, scheduleResponse] = await Promise.all([
        eventAPI.getFeatured(6),
        eventAPI.getUpcoming(10),
        eventAPI.getSchedule(),
      ]);
      
      setEventsData({
        featured: featuredResponse.data.data.events || [],
        upcoming: upcomingResponse.data.data.events || [],
        schedule: scheduleResponse.data.data.events || [],
      });
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative bg-legalo-bg min-h-screen overflow-x-hidden">
      <Toaster position="top-center" />
      
      <Navigation />
      
      <main>
        <EventsHeroSection onOpenModal={openModal} />
        <EventsFeaturedSection events={eventsData.featured} isLoading={isLoading} />
        <EventsListSection events={eventsData.upcoming} isLoading={isLoading} />
        <EventsScheduleSection events={eventsData.schedule} isLoading={isLoading} />
        <EventsCTASection />
      </main>
      
      <Footer />
      
      <ConsultationModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default EventsPage;
