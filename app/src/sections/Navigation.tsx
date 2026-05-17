import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight, ChevronDown } from 'lucide-react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const location = useLocation();
  const isServicesPage = location.pathname === '/layanan';
  const isAboutPage = location.pathname === '/tentang-kami';
  const isEventsPage = location.pathname === '/events';
  const isPromoPage = location.pathname === '/promo';
  const isEbookPage = location.pathname === '/ebook-newsletter';
  const isBlogPage = location.pathname === '/artikel';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const scrollToContact = () => {
    if (isServicesPage || isAboutPage || isEventsPage || isPromoPage || isEbookPage || isBlogPage) {
      // On other pages, navigate to home and then scroll to contact
      window.location.href = '/#contact';
    } else {
      scrollToSection('#contact');
    }
  };

  // Service submenu items
  const serviceSubmenuItems = [
    { label: 'Company Establishment', path: '/layanan/pt-cv' },
    { label: 'Business Licensing', path: '/layanan/oss-nib' },
    { label: 'Trademark Registration', path: '/layanan/trademark' },
    { label: 'Legal Consultation', path: '/layanan/konsultasi' },
  ];

  // Unified navigation style - same as homepage for all pages
  const getNavStyle = () => {
    return isScrolled
      ? 'bg-white/95 backdrop-blur-sm py-4'
      : 'bg-transparent py-6';
  };

  const getTextColor = () => {
    return isScrolled
      ? 'text-legalo-dark'
      : 'text-white';
  };

  const getLinkColor = () => {
    return isScrolled
      ? 'text-legalo-dark/70 hover:text-legalo-dark'
      : 'text-white/80 hover:text-white';
  };

  const getCtaStyle = () => {
    return isScrolled
      ? 'text-legalo-dark border border-legalo-dark/20 px-5 py-2.5 rounded hover:bg-legalo-dark hover:text-white'
      : 'text-white border border-white/30 px-5 py-2.5 rounded hover:bg-white hover:text-legalo-dark';
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ${getNavStyle()}`}>
        <div className="w-full px-6 lg:px-12 xl:px-20 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className={`font-heading font-bold text-xl transition-colors ${getTextColor()}`}
          >
            Legalo<span className="text-legalo-red">.</span>id
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {/* Layanan - Router Link with Submenu */}
            <div 
              className="relative group"
              onMouseEnter={() => setIsServicesMenuOpen(true)}
              onMouseLeave={() => setIsServicesMenuOpen(false)}
            >
              <Link
                to="/layanan"
                className={`text-sm font-medium transition-colors inline-flex items-center gap-1 ${getLinkColor()} ${isServicesPage ? 'text-legalo-red font-semibold' : ''}`}
              >
                Layanan
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isServicesMenuOpen ? 'rotate-180' : ''}`} />
              </Link>
              
              {/* Dropdown Menu */}
              <div className={`absolute top-full left-0 mt-2 w-64 bg-white rounded shadow-xl border border-gray-100 overflow-hidden transition-all duration-200 ${isServicesMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                {serviceSubmenuItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    className={`block px-5 py-3 text-sm font-medium transition-colors hover:bg-legalo-red/5 hover:text-legalo-red ${location.pathname === item.path ? 'text-legalo-red bg-legalo-red/5' : 'text-legalo-dark/80'}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Tentang Kami - Router Link */}
            <Link
              to="/tentang-kami"
              className={`text-sm font-medium transition-colors ${getLinkColor()} ${isAboutPage ? 'text-legalo-red font-semibold' : ''}`}
            >
              Tentang Kami
            </Link>
            
            {/* Artikel - Router Link */}
            <Link
              to="/artikel"
              className={`text-sm font-medium transition-colors ${getLinkColor()} ${isBlogPage ? 'text-legalo-red font-semibold' : ''}`}
            >
              Artikel
            </Link>
            
            {/* Events - Router Link */}
            <Link
              to="/events"
              className={`text-sm font-medium transition-colors ${getLinkColor()} ${isEventsPage ? 'text-legalo-red font-semibold' : ''}`}
            >
              Events
            </Link>
            
            {/* Promo - Router Link */}
            <Link
              to="/promo"
              className={`text-sm font-medium transition-colors ${getLinkColor()} ${isPromoPage ? 'text-legalo-red font-semibold' : ''}`}
            >
              Promo
            </Link>
            
            {/* Ebook - Router Link */}
            <Link
              to="/ebook-newsletter"
              className={`text-sm font-medium transition-colors ${getLinkColor()} ${isEbookPage ? 'text-legalo-red font-semibold' : ''}`}
            >
              Ebook & Newsletter
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <button
              onClick={scrollToContact}
              className={`text-sm font-medium inline-flex items-center gap-2 transition-all ${getCtaStyle()}`}
            >
              Konsultasi Gratis
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 ${getTextColor()}`}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[999] bg-legalo-dark pt-24 px-6 lg:hidden">
          <div className="flex flex-col gap-4">
            {/* Layanan with Submenu */}
            <div className="border-b border-white/10">
              <Link
                to="/layanan"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xl font-medium text-white text-left py-3 flex items-center justify-between"
              >
                Layanan
                <ChevronRight className="w-5 h-5" />
              </Link>
              {/* Mobile Submenu */}
              <div className="pl-4 pb-3 space-y-2">
                {serviceSubmenuItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block py-2 text-sm transition-colors ${location.pathname === item.path ? 'text-legalo-red' : 'text-white/70 hover:text-white'}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              to="/tentang-kami"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xl font-medium text-white text-left py-3 border-b border-white/10"
            >
              Tentang Kami
            </Link>
            <Link
              to="/artikel"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xl font-medium text-white text-left py-3 border-b border-white/10"
            >
              Artikel
            </Link>
            <Link
              to="/events"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xl font-medium text-white text-left py-3 border-b border-white/10"
            >
              Events
            </Link>
            <Link
              to="/promo"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xl font-medium text-white text-left py-3 border-b border-white/10"
            >
              Promo
            </Link>
            <Link
              to="/ebook-newsletter"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xl font-medium text-white text-left py-3 border-b border-white/10"
            >
              Ebook & Newsletter
            </Link>
            <button
              onClick={scrollToContact}
              className="mt-4 bg-legalo-red text-white px-6 py-4 rounded text-center font-medium"
            >
              Konsultasi Gratis
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;