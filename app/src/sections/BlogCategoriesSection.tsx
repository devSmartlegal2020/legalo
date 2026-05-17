import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLoading } from '@/context/LoadingContext';
import type { Category } from '@/pages/BlogPage';

gsap.registerPlugin(ScrollTrigger);

interface BlogCategoriesSectionProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const BlogCategoriesSection = ({ categories, activeCategory, onCategoryChange }: BlogCategoriesSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isReady } = useLoading();

  useEffect(() => {
    if (!isReady) return;
    
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const elements = section.querySelectorAll('.animate-item');
      
      gsap.fromTo(elements,
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6, 
          stagger: 0.05, 
          ease: 'power2.out',
          scrollTrigger: { 
            trigger: section, 
            start: 'top 85%', 
            toggleActions: 'play none none none' 
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, [isReady]);

  return (
    <section ref={sectionRef} className="py-12 bg-white border-y border-legalo-dark/10 sticky top-20 z-30">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="animate-item flex items-center gap-4 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`animate-item shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  activeCategory === category.id
                    ? 'bg-legalo-red text-white shadow-md'
                    : 'bg-legalo-bg text-legalo-dark hover:bg-legalo-dark/5'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogCategoriesSection;
