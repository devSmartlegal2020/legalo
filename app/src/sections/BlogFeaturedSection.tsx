import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Calendar, Clock, User, Loader2 } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';
import { blogAPI } from '@/services/api';

gsap.registerPlugin(ScrollTrigger);

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  category: { name: string; slug: string };
  author: { name: string };
  publishedAt: string;
  readTime: number;
}

const BlogFeaturedSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isReady } = useLoading();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedBlogs();
  }, []);

  useEffect(() => {
    if (!isReady || isLoading) return;
    
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const header = section.querySelector('.animate-header');
      const cards = section.querySelectorAll('.animate-card');
      
      const tl = gsap.timeline({
        scrollTrigger: { 
          trigger: section, 
          start: 'top 80%', 
          toggleActions: 'play none none none' 
        }
      });
      
      tl.fromTo(header,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        0
      )
      .fromTo(cards,
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.15, ease: 'power2.out' },
        0.2
      );
    }, section);

    return () => ctx.revert();
  }, [isReady, blogs, isLoading]);

  const fetchFeaturedBlogs = async () => {
    try {
      setIsLoading(true);
      const response = await blogAPI.getFeatured(3);
      setBlogs(response.data.data.blogs);
    } catch (error) {
      console.error('Failed to fetch featured blogs:', error);
    } finally {
      setIsLoading(false);
    }
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

  if (blogs.length === 0) {
    return null;
  }

  const mainFeatured = blogs[0];
  const secondaryFeatured = blogs.slice(1);

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-legalo-bg">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="animate-header mb-16 lg:mb-20">
            <span className="inline-block bg-legalo-red/10 text-legalo-red text-xs font-semibold px-4 py-2 rounded-full mb-6">
              Featured Articles
            </span>
            
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="lg:max-w-2xl">
                <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.02em] text-legalo-dark mb-4">
                  Artikel Unggulan
                </h2>
                <p className="text-legalo-dark/60 text-base lg:text-lg leading-relaxed">
                  Temukan artikel terpopuler dan terbaru yang membantu bisnis Anda berkembang dengan legalitas yang kuat.
                </p>
              </div>
              
              <Link 
                to="/artikel"
                className="group shrink-0 border border-legalo-dark/20 rounded-lg px-5 py-3 text-sm font-medium inline-flex items-center gap-2 hover:border-legalo-red hover:text-legalo-red transition-all"
              >
                Lihat Semua Artikel
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
          
          {/* Featured Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Main Featured Article */}
            {mainFeatured && (
              <article className="animate-card group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden lg:row-span-2">
                <Link to={`/artikel/${mainFeatured.slug}`}>
                  <div className="relative h-64 lg:h-80 overflow-hidden">
                    <img 
                      src={getImageUrl(mainFeatured.featuredImage)} 
                      alt={mainFeatured.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    <span className="absolute top-4 left-4 bg-legalo-red text-white text-xs font-semibold px-3 py-1.5 rounded-md">
                      {mainFeatured.category?.name}
                    </span>
                  </div>
                </Link>
                
                <div className="p-6 lg:p-8">
                  <div className="flex items-center gap-4 text-xs text-legalo-dark/50 mb-4">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" strokeWidth={1.5} />
                      <span>{mainFeatured.author?.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
                      <span>{formatDate(mainFeatured.publishedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
                      <span>{mainFeatured.readTime} menit</span>
                    </div>
                  </div>
                  
                  <Link to={`/artikel/${mainFeatured.slug}`}>
                    <h3 className="font-heading font-bold text-xl lg:text-2xl text-legalo-dark mb-4 group-hover:text-legalo-red transition-colors">
                      {mainFeatured.title}
                    </h3>
                  </Link>
                  
                  <p className="text-legalo-dark/60 text-sm lg:text-base leading-relaxed mb-6">
                    {mainFeatured.excerpt}
                  </p>
                  
                  <Link 
                    to={`/artikel/${mainFeatured.slug}`}
                    className="inline-flex items-center gap-2 text-legalo-red font-medium text-sm group-hover:gap-3 transition-all"
                  >
                    Baca Selengkapnya
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            )}
            
            {/* Secondary Featured Articles */}
            {secondaryFeatured.map((article) => (
              <article 
                key={article._id} 
                className="animate-card group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col sm:flex-row"
              >
                <Link 
                  to={`/artikel/${article.slug}`}
                  className="relative w-full sm:w-48 lg:w-56 h-48 sm:h-auto overflow-hidden shrink-0"
                >
                  <img 
                    src={getImageUrl(article.featuredImage)} 
                    alt={article.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  <span className="absolute top-3 left-3 bg-legalo-red text-white text-xs font-semibold px-2.5 py-1 rounded">
                    {article.category?.name}
                  </span>
                </Link>
                
                <div className="p-5 lg:p-6 flex flex-col justify-center flex-1">
                  <div className="flex items-center gap-3 text-xs text-legalo-dark/50 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" strokeWidth={1.5} />
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" strokeWidth={1.5} />
                      <span>{article.readTime} menit</span>
                    </div>
                  </div>
                  
                  <Link to={`/artikel/${article.slug}`}>
                    <h3 className="font-heading font-semibold text-lg text-legalo-dark mb-2 group-hover:text-legalo-red transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                  </Link>
                  
                  <p className="text-legalo-dark/60 text-sm leading-relaxed mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>
                  
                  <Link 
                    to={`/artikel/${article.slug}`}
                    className="inline-flex items-center gap-1 text-legalo-red font-medium text-sm self-start group-hover:gap-2 transition-all"
                  >
                    Baca Selengkapnya
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogFeaturedSection;
