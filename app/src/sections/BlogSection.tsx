import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, User, Calendar, Clock } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';

gsap.registerPlugin(ScrollTrigger);

const BlogSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isReady } = useLoading();

  useEffect(() => {
    if (!isReady) return;
    
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
      
      // Header animates first
      tl.fromTo(header,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        0
      )
      // Cards stagger with scale
      .fromTo(cards,
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.1, ease: 'power2.out' },
        0.2
      );
    }, section);

    return () => ctx.revert();
  }, [isReady]);

  const articles = [
    { 
      image: '/images/blog_perizinan.jpg', 
      category: 'Perizinan', 
      title: 'Panduan Lengkap Mengurus NIB dan Izin Usaha di 2024', 
      excerpt: 'Pelajari langkah-langkah lengkap untuk mengurus Nomor Induk Berusaha (NIB) dan izin usaha...',
      author: 'Tim Legalo',
      date: '15 Jan 2024',
      readTime: '5 menit'
    },
    { 
      image: '/images/blog_hr.jpg', 
      category: 'HR & Legal', 
      title: 'Kebijakan HR yang Wajib Dimiliki Setiap Perusahaan', 
      excerpt: 'Temukan kebijakan sumber daya manusia esensial yang perlu disusun untuk memastikan kepatuhan...',
      author: 'Tim Legalo',
      date: '10 Jan 2024',
      readTime: '7 menit'
    },
    { 
      image: '/images/blog_vo.jpg', 
      category: 'Virtual Office', 
      title: 'Manfaat Virtual Office untuk Startup dan UMKM', 
      excerpt: 'Kenali berbagai keuntungan menggunakan virtual office untuk menghemat biaya operasional sambil membangun kredibilitas bisnis...',
      author: 'Tim Legalo',
      date: '5 Jan 2024',
      readTime: '4 menit'
    },
  ];

  return (
    <section ref={sectionRef} id="blog" className="py-24 lg:py-32 bg-legalo-bg">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Header with tag, title, desc, and CTA */}
          <div className="animate-header mb-16 lg:mb-20">
            {/* Tag */}
            <span className="inline-block bg-legalo-red/10 text-legalo-red text-xs font-semibold px-4 py-2 rounded-full mb-6">
              Blog & Artikel
            </span>
            
            {/* Title and CTA Row */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="lg:max-w-2xl">
                <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.02em] text-legalo-dark mb-4">
                  Wawasan dan Informasi Terkini
                </h2>
                <p className="text-legalo-dark/60 text-base lg:text-lg leading-relaxed">
                  Artikel informatif seputar hukum bisnis, ketenagakerjaan, dan tips mengelola perusahaan dengan lebih baik.
                </p>
              </div>
              
              <button className="group shrink-0 border border-legalo-dark/20 rounded-lg px-5 py-3 text-sm font-medium inline-flex items-center gap-2 hover:border-legalo-red hover:text-legalo-red transition-all">
                Lihat Semua Artikel
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
          
          {/* Blog Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <article key={index} className="animate-card group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                {/* Image Container with Category Badge */}
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  {/* Category Badge on Image */}
                  <span className="absolute top-4 left-4 bg-legalo-red text-white text-xs font-medium px-3 py-1.5 rounded-md">
                    {article.category}
                  </span>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="font-heading font-semibold text-lg text-legalo-dark mb-3 group-hover:text-legalo-red transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-legalo-dark/60 text-sm leading-relaxed mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>
                  
                  {/* Divider */}
                  <div className="border-t border-legalo-dark/10 mb-4"></div>
                  
                  {/* Metadata Row */}
                  <div className="flex items-center gap-4 text-xs text-legalo-dark/50">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" strokeWidth={1.5} />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
                      <span>{article.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
