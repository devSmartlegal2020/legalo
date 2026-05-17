import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Check, ChevronRight } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';

gsap.registerPlugin(ScrollTrigger);

const VirtualOfficePackagesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isReady } = useLoading();

  useEffect(() => {
    if (!isReady) return;
    
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const header = section.querySelector('.section-header');
      const locations = section.querySelector('.locations-bar');
      const cards = section.querySelectorAll('.package-card');
      
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
      .fromTo(locations,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        0.2
      )
      .fromTo(cards,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power2.out' },
        0.3
      );
    }, section);

    return () => ctx.revert();
  }, [isReady]);

  const locations = ['Jakarta', 'Surabaya', 'Bali', 'Bandung'];

  const packages = [
    {
      name: 'Package A',
      subtitle: 'Basic',
      price: '500.000',
      period: '/bulan',
      description: 'Cocok untuk startup dan bisnis kecil yang baru memulai',
      features: [
        'Alamat bisnis premium',
        'Penerimaan surat & paket',
        'Notifikasi email',
        'Akses meeting room (pay per use)'
      ],
      highlighted: false
    },
    {
      name: 'Package B',
      subtitle: 'Business',
      price: '800.000',
      period: '/bulan',
      description: 'Ideal untuk bisnis yang sedang berkembang',
      features: [
        'Semua fitur Package A',
        'Meeting room 4 jam/bulan',
        'Nomor telepon dedicated',
        'Layanan resepsionis dasar',
        'Free domain email setup'
      ],
      highlighted: true
    },
    {
      name: 'Package C',
      subtitle: 'Premium',
      price: '1.500.000',
      period: '/bulan',
      description: 'Solusi lengkap untuk perusahaan established',
      features: [
        'Semua fitur Package B',
        'Meeting room unlimited',
        'Dedicated desk 2 hari/minggu',
        'Resepsionis panggilan',
        'Sekretaris virtual',
        'Priority support'
      ],
      highlighted: false
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-white">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="section-header text-center mb-8">
            <span className="inline-block bg-legalo-red/10 text-legalo-red text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              Virtual Office
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.02em] text-legalo-dark mb-4">
              Alamat Bisnis Premium
            </h2>
            <p className="text-legalo-dark/60 text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
              Dapatkan alamat bisnis bergengsi, layanan penanganan surat, 
              dan ruang meeting tanpa komitmen sewa jangka panjang.
            </p>
          </div>

          {/* Locations Bar */}
          <div className="locations-bar flex flex-wrap justify-center gap-4 lg:gap-8 mb-16">
            {locations.map((location, index) => (
              <span 
                key={index}
                className="inline-flex items-center gap-2 text-sm text-legalo-dark/70 bg-legalo-bg px-4 py-2 rounded-full"
              >
                <MapPin className="w-4 h-4 text-legalo-red" />
                {location}
              </span>
            ))}
          </div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {packages.map((pkg, index) => (
              <div 
                key={index}
                className={`package-card rounded-2xl p-6 lg:p-8 transition-all duration-300 ${
                  pkg.highlighted 
                    ? 'bg-legalo-dark text-white shadow-2xl scale-105 lg:scale-110' 
                    : 'bg-legalo-bg text-legalo-dark hover:shadow-lg'
                }`}
              >
                {/* Package Header */}
                <div className="mb-6">
                  <span className={`text-xs font-semibold uppercase tracking-widest mb-2 block ${
                    pkg.highlighted ? 'text-legalo-red' : 'text-legalo-red'
                  }`}>
                    {pkg.subtitle}
                  </span>
                  <h3 className={`font-heading font-bold text-2xl mb-2 ${
                    pkg.highlighted ? 'text-white' : 'text-legalo-dark'
                  }`}>
                    {pkg.name}
                  </h3>
                  <p className={`text-sm ${
                    pkg.highlighted ? 'text-white/70' : 'text-legalo-dark/60'
                  }`}>
                    {pkg.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-sm ${
                      pkg.highlighted ? 'text-white/70' : 'text-legalo-dark/60'
                    }`}>
                      Rp
                    </span>
                    <span className={`font-heading font-bold text-4xl lg:text-5xl ${
                      pkg.highlighted ? 'text-white' : 'text-legalo-dark'
                    }`}>
                      {pkg.price}
                    </span>
                    <span className={`text-sm ${
                      pkg.highlighted ? 'text-white/70' : 'text-legalo-dark/60'
                    }`}>
                      {pkg.period}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        pkg.highlighted ? 'text-legalo-red' : 'text-legalo-red'
                      }`} 
                      strokeWidth={2} 
                      />
                      <span className={`text-sm ${
                        pkg.highlighted ? 'text-white/80' : 'text-legalo-dark/70'
                      }`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button className={`w-full py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all group ${
                  pkg.highlighted 
                    ? 'bg-legalo-red hover:bg-legalo-red-dark text-white' 
                    : 'bg-legalo-dark hover:bg-legalo-red text-white'
                }`}>
                  Pilih Paket
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                {/* Best Value Badge */}
                {pkg.highlighted && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-legalo-red text-white text-xs font-semibold px-4 py-1 rounded-full">
                      Best Value
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VirtualOfficePackagesSection;
