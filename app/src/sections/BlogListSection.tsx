import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Calendar, Clock, User, Loader2 } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';
import { Button } from '@/components/ui/button';
import { blogAPI } from '@/services/api';
import type { Category } from '@/pages/BlogPage';

gsap.registerPlugin(ScrollTrigger);

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  category: { _id: string; name: string; slug: string };
  author: { name: string };
  publishedAt: string;
  readTime: number;
}

interface BlogListSectionProps {
  activeCategory: string;
  onCategoriesLoaded?: (categories: Category[]) => void;
}

const BlogListSection = ({ activeCategory, onCategoriesLoaded }: BlogListSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(9);
  const { isReady } = useLoading();
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all blogs once on mount
  useEffect(() => {
    fetchAllBlogs();
  }, []);

  // Reset visible count when category changes
  useEffect(() => {
    setVisibleCount(9);
  }, [activeCategory]);

  useEffect(() => {
    if (!isReady || isLoading) return;
    
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const cards = section.querySelectorAll('.animate-card');
      
      gsap.fromTo(cards,
        { y: 50, opacity: 0, scale: 0.95 },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1, 
          duration: 0.6, 
          stagger: 0.08, 
          ease: 'power2.out',
          scrollTrigger: { 
            trigger: section, 
            start: 'top 80%', 
            toggleActions: 'play none none none' 
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, [isReady, visibleCount, allBlogs, activeCategory, isLoading]);

  const fetchAllBlogs = async () => {
    try {
      setIsLoading(true);
      // Always fetch all blogs without category filter
      const response = await blogAPI.getPublished({ limit: 100 });
      const fetchedBlogs = response.data.data.blogs;
      setAllBlogs(fetchedBlogs);
      setError('');
      
      // Extract unique categories from all blogs and notify parent
      if (onCategoriesLoaded && fetchedBlogs.length > 0) {
        const uniqueCategories = extractUniqueCategories(fetchedBlogs);
        onCategoriesLoaded(uniqueCategories);
      }
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
      setError('Failed to load blogs');
    } finally {
      setIsLoading(false);
    }
  };

  const extractUniqueCategories = (blogs: Blog[]): Category[] => {
    const categoryMap = new Map<string, { id: string; label: string }>();
    
    blogs.forEach(blog => {
      if (blog.category?._id && blog.category?.name) {
        categoryMap.set(blog.category._id, {
          id: blog.category._id,
          label: blog.category.name
        });
      }
    });
    
    // Convert map to array of Category objects
    return Array.from(categoryMap.values());
  };

  // Filter blogs based on active category
  const filteredBlogs = activeCategory === 'all' 
    ? allBlogs 
    : allBlogs.filter(blog => blog.category?._id === activeCategory);
  
  const displayedArticles = filteredBlogs.slice(0, visibleCount);
  const hasMore = filteredBlogs.length > visibleCount;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return '/images/blog_perizinan.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  if (isLoading) {
    return (
      <section ref={sectionRef} className="py-24 lg:py-32 bg-legalo-bg">
        <div className="w-full px-6 lg:px-12 xl:px-20">
          <div className="max-w-7xl mx-auto flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-legalo-red" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section ref={sectionRef} className="py-24 lg:py-32 bg-legalo-bg">
        <div className="w-full px-6 lg:px-12 xl:px-20">
          <div className="max-w-7xl mx-auto text-center py-20">
            <p className="text-red-500">{error}</p>
            <Button onClick={fetchAllBlogs} variant="outline" className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-legalo-bg">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-12 lg:mb-16">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-legalo-dark mb-4">
              {activeCategory === 'all' ? 'Semua Artikel' : 'Artikel'}
            </h2>
            <p className="text-legalo-dark/60 text-base lg:text-lg">
              {filteredBlogs.length} artikel ditemukan
            </p>
          </div>
          
          {/* Articles Grid */}
          {displayedArticles.length === 0 ? (
            <div className="text-center py-20 text-legalo-dark/60">
              No articles found in this category.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {displayedArticles.map((blog) => (
                <article 
                  key={blog._id} 
                  className="animate-card group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  {/* Image */}
                  <Link to={`/artikel/${blog.slug}`}>
                    <div className="relative h-52 overflow-hidden">
                      <img 
                        src={getImageUrl(blog.featuredImage)} 
                        alt={blog.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                      <span className="absolute top-4 left-4 bg-legalo-red text-white text-xs font-medium px-3 py-1.5 rounded-md">
                        {blog.category?.name}
                      </span>
                    </div>
                  </Link>
                  
                  {/* Content */}
                  <div className="p-6">
                    <Link to={`/artikel/${blog.slug}`}>
                      <h3 className="font-heading font-semibold text-lg text-legalo-dark mb-3 group-hover:text-legalo-red transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                    </Link>
                    
                    <p className="text-legalo-dark/60 text-sm leading-relaxed mb-4 line-clamp-2">
                      {blog.excerpt}
                    </p>
                    
                    {/* Divider */}
                    <div className="border-t border-legalo-dark/10 mb-4"></div>
                    
                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-xs text-legalo-dark/50">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" strokeWidth={1.5} />
                        <span>{blog.author?.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
                        <span>{formatDate(blog.publishedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
                        <span>{blog.readTime} menit</span>
                      </div>
                    </div>
                    
                    {/* Read More Link */}
                    <Link 
                      to={`/artikel/${blog.slug}`}
                      className="mt-4 inline-flex items-center gap-2 text-legalo-red font-medium text-sm group-hover:gap-3 transition-all"
                    >
                      Baca Selengkapnya
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
          
          {/* Load More Button */}
          {hasMore && (
            <div className="mt-12 text-center">
              <Button
                onClick={handleLoadMore}
                variant="outline"
                className="px-8 py-3 h-auto border-legalo-dark/20 text-legalo-dark hover:border-legalo-red hover:text-legalo-red rounded-xl"
              >
                Muat Lebih Banyak
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogListSection;
