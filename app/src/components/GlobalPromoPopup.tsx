import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import PromoPopup from './PromoPopup';

/**
 * GlobalPromoPopup - Renders the promo popup on all pages.
 * Uses route changes to reset and trigger the popup.
 */
export function GlobalPromoPopup() {
  const location = useLocation();
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  // Reset popup state on route change
  useEffect(() => {
    setIsPromoOpen(false);
    setHasTriggered(false);
  }, [location.pathname]);

  // Trigger popup after a short delay on each page
  useEffect(() => {
    if (hasTriggered) return;

    const isPromoClosed = localStorage.getItem('promoPopupClosed');
    if (isPromoClosed === 'true') return;

    const timer = setTimeout(() => {
      setIsPromoOpen(true);
      setHasTriggered(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [location.pathname, hasTriggered]);

  const handleClose = useCallback(() => {
    setIsPromoOpen(false);
  }, []);

  return <PromoPopup isOpen={isPromoOpen} onClose={handleClose} />;
}

export default GlobalPromoPopup;
