import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TrendingUp, ArrowRight, Eye, Loader2 } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';
import { blogAPI } from '@/services/api';

gsap.registerPlugin(ScrollTrigger);

interface PopularBlog {
  _id: string;
  title: string;
  slug: string;
  category: { name: string; slug: string };
  views: number;
}

const BlogPopularSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isReady } = useLoading();
  const [popularArticles, setPopularArticles] = useState<PopularBlog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPopularArticles();
  }, []);

  useEffect(() => {
    if (!isReady || isLoading) return;
    
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
      
      tl.fromTo(header,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        0
      )
      .fromTo(items,
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
        0.2
      );
    }, section);

    return () => ctx.revert();
  }, [isReady, isLoading, popularArticles]);

  const fetchPopularArticles = async () => {
    try {
      setIsLoading(true);
      const response = await blogAPI.getPopular(6);
      setPopularArticles(response.data.data.blogs);
      setError('');
    } catch (err) {
      console.error('Failed to fetch popular articles:', err);
      setError('Failed to load popular articles');
    } finally {
      setIsLoading(false);
    }
  };

  const formatViews = (views: number): string => {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + 'M';
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'K';
    }
    return views.toString();
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

  if (error || popularArticles.length === 0) {
    return null; // Don't show section if there's an error or no articles
  }

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-legalo-bg">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="animate-header mb-10">
                <span className="inline-block bg-legalo-red/10 text-legalo-red text-xs font-semibold px-4 py-2 rounded-full mb-4">
                  Popular Articles
                </span>
                
                <h2 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-legalo-dark mb-3">
                  Artikel Paling Populer
                </h2>
                <p className="text-legalo-dark/60">
                  Artikel yang paling banyak dibaca oleh pengunjung kami
                </p>
              </div>
              
              <div className="space-y-4">
                {popularArticles.map((article, index) => (
                  <Link
                    key={article._id}
                    to={`/artikel/${article.slug}`}
                    className="animate-item group block bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center gap-5">
                      {/* Rank */}
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-legalo-red/10 flex items-center justify-center">
                        <span className="font-heading font-bold text-lg text-legalo-red">
                          #{index + 1}
                        </span>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-legalo-red font-medium mb-1 block">
                          {article.category?.name}
                        </span>
                        <h3 className="font-heading font-semibold text-lg text-legalo-dark group-hover:text-legalo-red transition-colors line-clamp-1">
                          {article.title}
                        </h3>
                      </div>
                      
                      {/* Views */}
                      <div className="hidden sm:flex items-center gap-2 text-legalo-dark/50 text-sm">
                        <Eye className="w-4 h-4" />
                        <span>{formatViews(article.views)}</span>
                      </div>
                      
                      {/* Arrow */}
                      <div className="flex-shrink-0">
                        <ArrowRight className="w-5 h-5 text-legalo-dark/30 group-hover:text-legalo-red transition-colors" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="animate-item">
              <div className="bg-white rounded-2xl p-8 shadow-sm sticky top-40">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-legalo-red/10 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-legalo-red" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-xl text-legalo-dark">
                      Trending Now
                    </h3>
                    <p className="text-legalo-dark/60 text-sm">
                      Top picks this week
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {popularArticles.slice(0, 3).map((article, index) => (
                    <Link
                      key={article._id}
                      to={`/artikel/${article.slug}`}
                      className="group block p-4 bg-legalo-bg rounded-xl hover:bg-legalo-red/5 transition-colors"
                    >
                      <span className="text-xs text-legalo-red font-medium mb-2 block">
                        {article.category?.name}
                      </span>
                      <h4 className="font-heading font-semibold text-legalo-dark group-hover:text-legalo-red transition-colors line-clamp-2">
                        {article.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-2 text-legalo-dark/50 text-xs">
                        <Eye className="w-3 h-3" />
                        <span>{formatViews(article.views)} views</span>
                      </div>
                    </Link>
                  ))}
                </div>
                
                <Link 
                  to="/artikel"
                  className="w-full mt-6 py-3 text-legalo-red font-medium text-sm border border-legalo-red/20 rounded-xl hover:bg-legalo-red hover:text-white transition-all block text-center"
                >
                  Lihat Semua Artikel Populer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogPopularSection;
