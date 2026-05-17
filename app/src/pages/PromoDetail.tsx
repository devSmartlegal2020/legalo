import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Gift, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';
import { promotionAPI, API_BASE_URL } from '@/services/api';

interface PromotionDetail {
  _id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  fullDescription?: string;
  image: string;
  bannerImage?: string;
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
    code?: string;
  };
  startDate: string;
  endDate: string;
  terms?: string[];
  benefits?: string[];
  ctaText?: string;
  ctaLink?: string;
  priority: number;
}

const PromoDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [promotion, setPromotion] = useState<PromotionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchPromotion(slug);
    }
  }, [slug]);

  const fetchPromotion = async (promoSlug: string) => {
    try {
      setIsLoading(true);
      const response = await promotionAPI.getBySlug(promoSlug);
      setPromotion(response.data.data.promotion);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load promotion');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getDiscountDisplay = () => {
    if (!promotion?.discount) return null;
    if (promotion.discount.type === 'percentage') {
      return `${promotion.discount.value}% OFF`;
    }
    return `Rp ${promotion.discount.value.toLocaleString()}`;
  };

  const isExpired = () => {
    if (!promotion) return false;
    const end = new Date(promotion.endDate);
    return new Date() > end;
  };

  const handleClaim = () => {
    if (!promotion) return;
    if (promotion.ctaLink) {
      if (promotion.ctaLink.startsWith('http')) {
        window.open(promotion.ctaLink, '_blank');
      } else {
        navigate(promotion.ctaLink);
      }
    } else {
      const whatsappNumber = '6281234567890';
      const message = `Halo Legalo.id, saya tertarik dengan promo "${promotion.title}". Mohon informasi lebih lanjut.`;
      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-legalo-bg">
        <Navigation />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-legalo-red" />
        </div>
      </div>
    );
  }

  if (error || !promotion) {
    return (
      <div className="min-h-screen bg-legalo-bg">
        <Navigation />
        <div className="flex flex-col items-center justify-center h-[60vh] px-6">
          <AlertCircle className="h-12 w-12 text-legalo-red mb-4" />
          <h1 className="text-2xl font-bold text-legalo-dark mb-2">Promo Not Found</h1>
          <p className="text-legalo-dark/60 mb-6">{error || 'The promotion you are looking for does not exist or has expired.'}</p>
          <Button asChild>
            <Link to="/promo">
              <ArrowLeft className="h-4 w-4 mr-2" />
              View All Promotions
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-legalo-bg">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="w-full px-6 lg:px-12 xl:px-20">
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <Link
              to="/promo"
              className="inline-flex items-center text-sm text-legalo-dark/60 hover:text-legalo-red transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Promotions
            </Link>

            {/* Hero Image */}
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-8 bg-legalo-dark/5">
              <img
                src={imageError ? '/placeholder-image.png' : `${API_BASE_URL}${promotion.bannerImage || promotion.image}`}
                alt={promotion.title}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
              {promotion.discount && (
                <div className="absolute top-6 right-6 bg-legalo-red text-white px-4 py-2 rounded-full font-semibold text-lg">
                  {getDiscountDisplay()}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl p-8 lg:p-12 border border-legalo-dark/10">
              <div className="flex flex-wrap gap-3 mb-6">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  isExpired()
                    ? 'bg-gray-100 text-gray-500'
                    : 'bg-green-100 text-green-700'
                }`}>
                  <Clock className="h-3 w-3 mr-1" />
                  {isExpired() ? 'Expired' : 'Active'}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(promotion.startDate).toLocaleDateString('id-ID')} - {new Date(promotion.endDate).toLocaleDateString('id-ID')}
                </span>
                {promotion.discount?.code && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                    <Gift className="h-3 w-3 mr-1" />
                    Code: {promotion.discount.code}
                  </span>
                )}
              </div>

              <h1 className="font-heading font-bold text-3xl lg:text-4xl text-legalo-dark mb-4">
                {promotion.title}
              </h1>

              {promotion.subtitle && (
                <p className="text-xl text-legalo-dark/70 mb-6">{promotion.subtitle}</p>
              )}

              <p className="text-legalo-dark/60 text-lg leading-relaxed mb-8">
                {promotion.description}
              </p>

              {promotion.fullDescription && (
                <div className="prose max-w-none mb-8">
                  <p className="text-legalo-dark/60 leading-relaxed whitespace-pre-line">{promotion.fullDescription}</p>
                </div>
              )}

              {promotion.benefits && promotion.benefits.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold text-legalo-dark mb-4">Benefits</h3>
                  <ul className="space-y-2">
                    {promotion.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start text-legalo-dark/70">
                        <span className="text-legalo-red mr-2">&#10003;</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {promotion.terms && promotion.terms.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold text-legalo-dark mb-4">Terms & Conditions</h3>
                  <ul className="space-y-2">
                    {promotion.terms.map((term, index) => (
                      <li key={index} className="flex items-start text-legalo-dark/70">
                        <span className="text-legalo-dark/40 mr-2">{index + 1}.</span>
                        {term}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-legalo-dark/10">
                <Button
                  onClick={handleClaim}
                  disabled={isExpired()}
                  className="bg-legalo-red hover:bg-legalo-red-dark text-white px-8 py-6 text-lg rounded-xl"
                >
                  {isExpired() ? 'Promo Expired' : (promotion.ctaText || 'Claim Offer')}
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="px-8 py-6 text-lg rounded-xl"
                >
                  <Link to="/promo">
                    View Other Promotions
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PromoDetail;
