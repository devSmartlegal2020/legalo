import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Loader2 } from 'lucide-react';
import { promotionAPI, API_BASE_URL } from '@/services/api';

interface PromoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId?: string;
}

interface PopupPromotion {
  _id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  ctaLink: string;
  popupDuration: number;
}

const STORAGE_KEY = 'promoPopupClosed';
const DEFAULT_DURATION = 7000; // 7 seconds

export function PromoPopup({ isOpen, onClose, categoryId }: PromoPopupProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [promotion, setPromotion] = useState<PopupPromotion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_DURATION / 1000);

  // Fetch promotion for popup
  useEffect(() => {
    if (!isOpen) return;

    const fetchPopupPromotion = async () => {
      try {
        setIsLoading(true);
        const path = location.pathname;
        const response = await promotionAPI.getPopup(path, categoryId);
        const promo = response.data.data.promotion;
        
        if (promo) {
          setPromotion(promo);
          setTimeLeft((promo.popupDuration || DEFAULT_DURATION) / 1000);
        } else {
          setPromotion(null);
        }
      } catch (error) {
        console.error('Failed to fetch popup promotion:', error);
        setPromotion(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopupPromotion();
  }, [isOpen, location.pathname, categoryId]);

  // Auto-close timer
  useEffect(() => {
    if (!isOpen || isClosing || !promotion) return;

    const intervalTime = 1000;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleClose();
          return 0;
        }
        return prev - 1;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isOpen, isClosing, promotion]);

  // Reset states when reopened
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setDontShowAgain(false);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    if (dontShowAgain) {
      localStorage.setItem(STORAGE_KEY, 'true');
    }
    onClose();
  }, [dontShowAgain, onClose]);

  const handleImageClick = () => {
    if (dontShowAgain) {
      localStorage.setItem(STORAGE_KEY, 'true');
    }
    onClose();
    
    if (promotion?.ctaLink) {
      if (promotion.ctaLink.startsWith('http')) {
        window.open(promotion.ctaLink, '_blank');
      } else {
        navigate(promotion.ctaLink);
      }
    } else {
      navigate('/promo');
    }
  };

  const handleOverlayClick = () => {
    handleClose();
  };

  // Check if popup should be shown
  const shouldShowPopup = () => {
    const isClosed = localStorage.getItem(STORAGE_KEY);
    return isClosed !== 'true';
  };

  if (!isOpen || !shouldShowPopup()) {
    return null;
  }

  // Show loading state
  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogOverlay className="bg-black/60 backdrop-blur-sm" />
        <DialogContent 
          className="max-w-[500px] w-full p-8 overflow-hidden border-0 bg-white shadow-2xl flex items-center justify-center"
          showCloseButton={false}
        >
          <Loader2 className="h-8 w-8 animate-spin text-legalo-red" />
        </DialogContent>
      </Dialog>
    );
  }

  // No active promotion
  if (!promotion) {
    return null;
  }

  const popupDuration = promotion.popupDuration || DEFAULT_DURATION;
  const progressPercent = (timeLeft / (popupDuration / 1000)) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogOverlay 
        className="bg-black/60 backdrop-blur-sm" 
        onClick={handleOverlayClick}
      />
      <DialogContent 
        className="max-w-[500px] w-full p-0 overflow-hidden border-0 bg-transparent shadow-2xl"
        showCloseButton={false}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-legalo-red"
          aria-label="Close popup"
        >
          <X className="w-4 h-4 text-legalo-dark" />
        </button>

        {/* Promotional Image */}
        <div 
          className="relative cursor-pointer group"
          onClick={handleImageClick}
        >
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/30 z-10">
            <div 
              className="h-full bg-legalo-red transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Promotion Image */}
          <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-legalo-red/10 to-legalo-dark/10 overflow-hidden">
            <img
              src={`${API_BASE_URL}${promotion.image}`}
              alt={promotion.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                // Fallback placeholder if image doesn't exist
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjM3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRDkzQTNBO3N0b3Atb3BhY2l0eTowLjEiIC8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzBCMEQxMDtzdG9wLW9wYWNpdHk6MC4xIiAvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZGllbnQpIiAvPgo8dGV4dCB4PSI1MCUiIHk9IjQ1JSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI0Q5M0EzQSI+U3BlY2lhbCBQcm9tb3Rpb248L3RleHQ+Cjx0ZXh0IHg9IjUwJSIgeT0iNTUlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMwQjBEMTAiPkNsaWNrIHRvIHZpZXcgZXhjbHVzaXZlIG9mZmVycyE8L3RleHQ+Cjwvc3ZnPg==';
              }}
            />
            
            {/* Click Indicator */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 text-legalo-dark px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                Click to View
              </span>
            </div>
          </div>

          {/* Promotion Info Overlay */}
          {promotion.title && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-12">
              <h3 className="text-white font-bold text-lg mb-1">{promotion.title}</h3>
              {promotion.description && (
                <p className="text-white/80 text-sm line-clamp-2">{promotion.description}</p>
              )}
            </div>
          )}
        </div>

        {/* Footer with Checkbox */}
        <div className="bg-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dontShowAgain"
              checked={dontShowAgain}
              onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
              className="border-legalo-dark/30 data-[state=checked]:bg-legalo-red data-[state=checked]:border-legalo-red"
            />
            <label
              htmlFor="dontShowAgain"
              className="text-sm text-legalo-dark/70 cursor-pointer select-none"
            >
              Don't show again
            </label>
          </div>
          
          <span className="text-xs text-legalo-dark/50">
            Closing in {timeLeft}s
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PromoPopup;
