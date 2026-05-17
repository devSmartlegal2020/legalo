import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Toaster } from '@/components/ui/sonner';
import { useLoading } from '../context/LoadingContext';
import Navigation from '../sections/Navigation';
import BlogHeroSection from '../sections/BlogHeroSection';
import BlogFeaturedSection from '../sections/BlogFeaturedSection';
import BlogCategoriesSection from '../sections/BlogCategoriesSection';
import BlogListSection from '../sections/BlogListSection';
import BlogLeadMagnetSection from '../sections/BlogLeadMagnetSection';
import BlogNewsletterSection from '../sections/BlogNewsletterSection';
import BlogPopularSection from '../sections/BlogPopularSection';
import Footer from '../sections/Footer';
import ConsultationModal from '../components/ConsultationModal';

gsap.registerPlugin(ScrollTrigger);

export interface Category {
  id: string;
  label: string;
}

const BlogPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [categories, setCategories] = useState<Category[]>([{ id: 'all', label: 'Semua' }]);
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

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const handleCategoriesLoaded = (loadedCategories: Category[]) => {
    setCategories([{ id: 'all', label: 'Semua' }, ...loadedCategories]);
  };

  return (
    <div className="relative bg-legalo-bg min-h-screen overflow-x-hidden">
      <Toaster position="top-center" />
      
      <Navigation />
      
      <main>
        <BlogHeroSection onOpenModal={openModal} />
        <BlogFeaturedSection />
        <BlogCategoriesSection 
          categories={categories}
          activeCategory={activeCategory} 
          onCategoryChange={handleCategoryChange} 
        />
        <BlogListSection 
          activeCategory={activeCategory}
          onCategoriesLoaded={handleCategoriesLoaded}
        />
        <BlogLeadMagnetSection onOpenModal={openModal} />
        <BlogNewsletterSection />
        <BlogPopularSection />
      </main>
      
      <Footer />
      
      <ConsultationModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default BlogPage;
