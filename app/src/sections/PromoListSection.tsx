import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, ArrowRight, Clock, Gift, Loader2 } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';
import { promotionAPI } from '@/services/api';

gsap.registerPlugin(ScrollTrigger);

interface Promotion {
  _id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
    code?: string;
  };
  startDate: string;
  endDate: string;
  ctaText: string;
  ctaLink: string;
  priority: number;
  featured: boolean;
}

const PromoListSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isReady } = useLoading();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setIsLoading(true);
      const response = await promotionAPI.getActive({ limit: 10 });
      setPromotions(response.data.data.promotions);
    } catch (error) {
      console.error('Failed to fetch promotions:', error);
      // Fallback to empty array if API fails
      setPromotions([]);
    } finally {
      setIsLoading(false);
    }
  };

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
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power2.out' },
        0.2
      );
    }, section);

    return () => ctx.revert();
  }, [isReady, isLoading, promotions]);

  const getDiscountDisplay = (discount?: Promotion['discount']) => {
    if (!discount) return 'Special Offer';
    if (discount.type === 'percentage') {
      return `${discount.value}% OFF`;
    }
    return `Rp ${discount.value.toLocaleString()}`;
  };

  const getTypeFromDiscount = (discount?: Promotion['discount']) => {
    if (!discount) return 'Special';
    if (discount.type === 'percentage') return 'Discount';
    return 'Fixed Price';
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'Discount':
        return 'bg-legalo-red/10 text-legalo-red border-legalo-red/20';
      case 'Fixed Price':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Special':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatValidity = (_startDate: string, endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    
    if (now > end) {
      return 'Expired';
    }
    
    return `Valid until ${end.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })}`;
  };

  const handleClaimPromo = (promo: Promotion) => {
    if (promo.ctaLink) {
      if (promo.ctaLink.startsWith('http')) {
        window.open(promo.ctaLink, '_blank');
      } else {
        window.location.href = promo.ctaLink;
      }
    } else {
      const whatsappNumber = '6281234567890';
      const message = `Halo Legalo.id, saya tertarik dengan promo "${promo.title}". Mohon informasi lebih lanjut.`;
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-white">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="animate-header mb-16 lg:mb-20">
            <span className="inline-block bg-legalo-red/10 text-legalo-red text-xs font-semibold px-4 py-2 rounded-full mb-6">
              Promo Aktif
            </span>
            
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="lg:max-w-2xl">
                <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.02em] text-legalo-dark mb-4">
                  Penawaran Spesial Hari Ini
                </h2>
                <p className="text-legalo-dark/60 text-base lg:text-lg leading-relaxed">
                  Jangan lewatkan kesempatan untuk mendapatkan layanan hukum berkualitas dengan harga terbaik. 
                  Promo terbatas dan dapat berakhir kapan saja.
                </p>
              </div>
              
              <div className="shrink-0 flex items-center gap-2 text-sm text-legalo-dark/50">
                <Clock className="w-4 h-4" />
                <span>Diperbarui: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-legalo-red" />
            </div>
          ) : promotions.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-legalo-dark/60 text-lg">Tidak ada promo aktif saat ini.</p>
              <p className="text-legalo-dark/40 text-sm mt-2">Silakan cek kembali nanti untuk penawaran terbaru.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promotions.map((promo, index) => (
                <div 
                  key={promo._id} 
                  className={`animate-card group relative p-6 lg:p-8 bg-legalo-bg border rounded-xl hover:border-legalo-red/30 hover:shadow-lg transition-all duration-300 ${
                    index === 0 ? 'border-legalo-red/30 ring-2 ring-legalo-red/10' : 'border-legalo-dark/10'
                  }`}
                >
                  {index === 0 && (
                    <div className="absolute -top-3 left-6">
                      <span className="bg-legalo-red text-white text-xs font-semibold px-3 py-1 rounded-full">
                        🔥 Populer
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getTypeStyle(getTypeFromDiscount(promo.discount))} bg-opacity-50`}>
                      <Gift className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${getTypeStyle(getTypeFromDiscount(promo.discount))}`}>
                      {getTypeFromDiscount(promo.discount)}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <span className="text-legalo-red font-heading font-bold text-lg">
                      {getDiscountDisplay(promo.discount)}
                    </span>
                  </div>
                  
                  <h3 className="font-heading font-semibold text-xl text-legalo-dark mb-3 group-hover:text-legalo-red transition-colors">
                    {promo.title}
                  </h3>
                  
                  <p className="text-legalo-dark/60 text-sm leading-relaxed mb-4">
                    {promo.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-sm text-legalo-dark/50 mb-6">
                    <Calendar className="w-4 h-4" strokeWidth={1.5} />
                    <span>{formatValidity(promo.startDate, promo.endDate)}</span>
                  </div>
                  
                  <button 
                    onClick={() => handleClaimPromo(promo)}
                    className="w-full bg-legalo-red text-white font-medium py-3 px-6 rounded-lg hover:bg-legalo-red-dark transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                  >
                    <span>{promo.ctaText || 'Klaim Promo'}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Info Section */}
          <div className="mt-16 lg:mt-20 p-8 lg:p-12 bg-legalo-dark rounded-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h3 className="font-heading font-bold text-2xl lg:text-3xl text-white mb-2">
                  Butuh Bantuan Memilih Promo?
                </h3>
                <p className="text-white/70">
                  Tim kami siap membantu Anda menemukan penawaran yang paling sesuai dengan kebutuhan bisnis Anda.
                </p>
              </div>
              <button 
                onClick={() => {
                  const whatsappNumber = '6281234567890';
                  const message = 'Halo Legalo.id, saya butuh bantuan memilih promo yang sesuai.';
                  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
                  window.open(whatsappUrl, '_blank');
                }}
                className="shrink-0 bg-legalo-red text-white font-medium py-3 px-8 rounded-lg hover:bg-legalo-red-dark transition-all duration-300 inline-flex items-center gap-2 whitespace-nowrap"
              >
                <span>Hubungi Kami</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoListSection;
