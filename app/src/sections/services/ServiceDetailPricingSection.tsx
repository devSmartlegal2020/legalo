import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, ChevronRight, MessageCircle, Clock } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';

gsap.registerPlugin(ScrollTrigger);

interface PricingPackage {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
  ctaText?: string;
  duration?: string;
  ctaHref?: string;
}

interface PricingGroup {
  title: string;
  packages: PricingPackage[];
}

interface ServiceDetailPricingSectionProps {
  packages?: PricingPackage[];
  groups?: PricingGroup[];
  onOpenModal: () => void;
}

const getGridClasses = (count: number): string => {
  if (count === 1) return 'grid-cols-1 max-w-lg mx-auto';
  if (count === 2) return 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto';
  if (count === 3) return 'grid-cols-1 md:grid-cols-3';
  return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
};

const ServiceDetailPricingSection = ({
  packages: packagesProp,
  groups,
  onOpenModal
}: ServiceDetailPricingSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const activeGroupRef = useRef<HTMLDivElement>(null);
  const { isReady } = useLoading();
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (!isReady) return;
    
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const header = section.querySelector('.pricing-header');
      const selectorCards = section.querySelectorAll('.group-selector-card');
      const cards = section.querySelectorAll('.pricing-card');
      const customQuote = section.querySelector('.custom-quote');
      
      const tl = gsap.timeline({
        scrollTrigger: { 
          trigger: section, 
          start: 'top 80%', 
          toggleActions: 'play none none none' 
        }
      });
      
      tl.fromTo(header,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
        0
      );

      if (selectorCards.length > 0) {
        tl.fromTo(selectorCards,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' },
          0.15
        );
      }
      
      tl.fromTo(cards,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
        0.3
      )
      .fromTo(customQuote,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        0.6
      );
    }, section);

    return () => ctx.revert();
  }, [isReady]);

  // Animate cards when active group changes (skip initial mount because scroll timeline handles it)
  useEffect(() => {
    if (!groups || !activeGroupRef.current) return;
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const cards = activeGroupRef.current.querySelectorAll('.pricing-card');
    gsap.fromTo(cards,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
    );
  }, [selectedGroupIndex, groups]);

  const renderCard = (pkg: PricingPackage, cardKey: React.Key) => (
    <div 
      key={cardKey}
      className={`pricing-card relative rounded-2xl p-6 lg:p-8 opacity-0 ${
        pkg.popular 
          ? 'bg-legalo-dark text-white border-2 border-legalo-red' 
          : 'bg-white border border-gray-200'
      }`}
    >
      {pkg.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-legalo-red text-white text-xs font-semibold px-4 py-1 rounded-full">
          Paling Populer
        </div>
      )}

      <div className="mb-4">
        <h3 className={`font-heading font-semibold text-xl mb-2 ${pkg.popular ? 'text-white' : 'text-legalo-dark'}`}>
          {pkg.name}
        </h3>
        <p className={`text-sm ${pkg.popular ? 'text-white/70' : 'text-legalo-dark/60'}`}>
          {pkg.description}
        </p>
        {pkg.duration && (
          <div className={`flex items-center gap-1.5 mt-2 text-xs font-medium ${pkg.popular ? 'text-white/60' : 'text-legalo-dark/50'}`}>
            <Clock className="w-3.5 h-3.5" />
            {pkg.duration}
          </div>
        )}
      </div>

      <div className="mb-6">
        <span className={`text-sm block mb-1 ${pkg.popular ? 'text-white/70' : 'text-legalo-dark/50'}`}>
          Mulai dari
        </span>
        <span className={`font-heading font-bold text-3xl lg:text-4xl ${pkg.popular ? 'text-legalo-red' : 'text-legalo-red'}`}>
          {pkg.price}
        </span>
      </div>

      <div className="space-y-3 mb-8">
        {pkg.features.map((feature, featureIndex) => (
          <div key={featureIndex} className="flex items-start gap-3">
            <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${pkg.popular ? 'text-legalo-red' : 'text-legalo-red'}`} />
            <span className={`text-sm ${pkg.popular ? 'text-white/80' : 'text-legalo-dark/70'}`}>{feature}</span>
          </div>
        ))}
      </div>

      {pkg.ctaHref ? (
        <a
          href={pkg.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full py-3 px-6 rounded-lg font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all group ${
            pkg.popular
              ? 'bg-legalo-red hover:bg-legalo-red-dark text-white'
              : 'bg-legalo-dark hover:bg-legalo-dark/90 text-white'
          }`}
        >
          {pkg.ctaText || 'Pilih Paket'}
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </a>
      ) : (
        <button
          onClick={onOpenModal}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all group ${
            pkg.popular
              ? 'bg-legalo-red hover:bg-legalo-red-dark text-white'
              : 'bg-legalo-dark hover:bg-legalo-dark/90 text-white'
          }`}
        >
          {pkg.ctaText || 'Pilih Paket'}
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      )}
    </div>
  );

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-legalo-bg">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="pricing-header text-center mb-16 opacity-0">
            <span className="inline-block bg-legalo-red/10 text-legalo-red text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              Harga & Paket
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.02em] text-legalo-dark mb-4">
              Pilih Paket yang Sesuai
            </h2>
            <p className="text-legalo-dark/60 text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
              Harga transparan tanpa biaya tersembunyi. Pilih paket yang paling sesuai dengan kebutuhan Anda
            </p>
          </div>

          {/* Pricing Groups or Flat Packages */}
          {groups ? (
            <div className="space-y-12">
              {/* Group Selector */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {groups.map((group, index) => {
                  const isSelected = selectedGroupIndex === index;
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedGroupIndex(index)}
                      className={`group-selector-card text-center rounded-xl p-5 transition-all duration-200 ${
                        isSelected
                          ? 'bg-legalo-dark text-white ring-2 ring-legalo-red border-transparent'
                          : 'bg-white border border-gray-200 text-legalo-dark hover:border-legalo-red/60 hover:shadow-sm'
                      }`}
                    >
                      <span className="font-heading font-semibold text-sm leading-snug">
                        {group.title}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Group Packages */}
              <div ref={activeGroupRef}>
                <div className={`grid gap-6 lg:gap-8 ${getGridClasses(groups[selectedGroupIndex].packages.length)}`}>
                  {groups[selectedGroupIndex].packages.map((pkg, pkgIndex) => renderCard(pkg, `${selectedGroupIndex}-${pkgIndex}`))}
                </div>
              </div>
            </div>
          ) : (
            <div className={`grid gap-6 lg:gap-8 ${getGridClasses((packagesProp || []).length)}`}>
              {(packagesProp || []).map((pkg, index) => renderCard(pkg, index))}
            </div>
          )}

          {/* Custom Quote CTA */}
          <div className="custom-quote mt-12 text-center opacity-0">
            <div className="bg-white rounded-2xl p-8 lg:p-12 border border-gray-200 max-w-3xl mx-auto">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-legalo-red/10 flex items-center justify-center mb-6">
                  <MessageCircle className="w-8 h-8 text-legalo-red" />
                </div>
                <h3 className="font-heading font-semibold text-xl text-legalo-dark mb-3">
                  Butuh Penawaran Kustom?
                </h3>
                <p className="text-legalo-dark/60 text-sm leading-relaxed mb-6 max-w-lg">
                  Jika kebutuhan Anda tidak sesuai dengan paket yang tersedia, kami dapat membuat penawaran khusus sesuai dengan kebutuhan spesifik bisnis Anda
                </p>
                <button
                  onClick={onOpenModal}
                  className="bg-transparent border-2 border-legalo-red text-legalo-red hover:bg-legalo-red hover:text-white px-8 py-3 rounded-lg font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all group"
                >
                  <MessageCircle className="w-4 h-4" />
                  Minta Penawaran Kustom
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceDetailPricingSection;
