import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Toaster } from '@/components/ui/sonner';
import { useLoading } from '@/context/LoadingContext';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';
import ConsultationModal from '@/components/ConsultationModal';
import ServiceDetailHeroSection from '@/sections/services/ServiceDetailHeroSection';
import ServiceDetailBenefitsSection from '@/sections/services/ServiceDetailBenefitsSection';
import ServiceDetailProcessSection from '@/sections/services/ServiceDetailProcessSection';
import ServiceDetailPricingSection from '@/sections/services/ServiceDetailPricingSection';
import ServiceDetailTestimonialSection from '@/sections/services/ServiceDetailTestimonialSection';
import ServiceDetailFAQSection from '@/sections/services/ServiceDetailFAQSection';
import ServiceDetailCTASection from '@/sections/services/ServiceDetailCTASection';

gsap.registerPlugin(ScrollTrigger);

const KonsultasiHukumPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isReady, setReady } = useLoading();

  useEffect(() => {
    if (!isReady) {
      setReady(true);
    }
    
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(timer);
  }, [isReady, setReady]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Service data
  const heroData = {
    title: 'Konsultasi Hukum',
    subtitle: 'Legal Consultation',
    summary: 'Dapatkan saran dan solusi hukum profesional dari tim pengacara berpengalaman untuk berbagai kebutuhan bisnis Anda. Dari review kontrak hingga penyelesaian sengketa, kami siap membantu.',
    highlights: [
      'Konsultasi fleksibel online/offline',
      'Pengacara berpengalaman 10+ tahun',
      'Solusi praktis dan actionable',
      'Respon cepat dalam 24 jam'
    ],
    backgroundImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80'
  };

  const benefitsData = {
    benefits: [
      {
        icon: 'users',
        title: 'Pengacara Berpengalaman',
        description: 'Tim konsultan terdiri dari pengacara dengan pengalaman 10+ tahun di berbagai bidang hukum bisnis dan korporasi.'
      },
      {
        icon: 'zap',
        title: 'Solusi Praktis',
        description: 'Tidak hanya teori hukum, kami memberikan rekomendasi konkret yang bisa langsung diimplementasikan dalam bisnis.'
      },
      {
        icon: 'checkCircle',
        title: 'Jangkauan Luas',
        description: 'Cakupan layanan mencakup hukum bisnis, ketenagakerjaan, kontrak, properti, dan sengketa komersial.'
      }
    ]
  };

  const processData = {
    steps: [
      {
        step: 1,
        title: 'Jadwalkan Konsultasi',
        description: 'Pilih jadwal yang nyaman untuk Anda, tersedia opsi online via video call atau offline meeting di kantor kami.'
      },
      {
        step: 2,
        title: 'Persiapan Kasus',
        description: 'Kirimkan dokumen terkait sebelumnya agar konsultan dapat melakukan analisis awal dan persiapan materi.'
      },
      {
        step: 3,
        title: 'Sesi Konsultasi',
        description: 'Diskusi mendalam dengan konsultan hukum untuk memahami masalah, analisis risiko, dan penentuan strategi.'
      },
      {
        step: 4,
        title: 'Laporan & Tindak Lanjut',
        description: 'Menerima ringkasan advis hukum dalam bentuk written memo dan rekomendasi langkah selanjutnya jika diperlukan.'
      }
    ]
  };

  const pricingData = {
    packages: [
      {
        name: 'Paket Basic',
        price: 'Rp 500.000',
        description: 'Sesi konsultasi 30 menit',
        features: [
          'Konsultasi 30 menit',
          '1 topik kasus',
          'Review dokumen dasar',
          'Advis lisan',
          'Tersedia online/offline'
        ],
        ctaText: 'Pilih Paket'
      },
      {
        name: 'Paket Standard',
        price: 'Rp 1.200.000',
        description: 'Sesi konsultasi 60 menit',
        features: [
          'Konsultasi 60 menit',
          'Multiple topik terkait',
          'Review dokumen detail',
          'Advis tertulis (memo)',
          'Rekomendasi strategi',
          'Tindak lanjut 1x gratis'
        ],
        popular: true,
        ctaText: 'Pilih Paket'
      },
      {
        name: 'Paket Corporate',
        price: 'Rp 3.500.000',
        description: 'Retainer bulanan untuk perusahaan',
        features: [
          '4x konsultasi per bulan',
          'Unlimited topik',
          'Review kontrak/klausul',
          'Legal memo priority',
          'Drafting dokumen dasar',
          'Hotline darurat hukum',
          'Monthly legal report'
        ],
        ctaText: 'Pilih Paket'
      }
    ]
  };

  const testimonialData = {
    testimonials: [
      {
        quote: 'Sangat membantu dalam mereview kontrak kerjasama dengan vendor. Konsultan memperhatikan detail yang saya lewatkan dan memberikan rekomendasi klausul yang melindungi perusahaan. Nilai investasi yang sangat worth it!',
        name: 'Andi Wijaya',
        company: 'COO PT Digital Solusi Prima',
        service: 'Konsultasi Hukum',
        rating: 5
      },
      {
        quote: 'Sebagai startup, kami butuh advis hukum yang fleksibel dan terjangkau. Paket konsultasi dari Legalo memberikan solusi tepat. Timnya responsif dan sangat memahami kebutuhan bisnis startup.',
        name: 'Rina Anggraini',
        company: 'Founder StartUp Indonesia',
        service: 'Konsultasi Hukum',
        rating: 5
      }
    ]
  };

  const faqData = {
    faqs: [
      {
        question: 'Apa saja topik yang bisa dikonsultasikan?',
        answer: 'Kami melayani konsultasi dalam berbagai bidang hukum bisnis termasuk: review dan drafting kontrak, hukum ketenagakerjaan, penyelesaian sengketa bisnis, due diligence, perlindungan konsumen, hak kekayaan intelektual, dan compliance perusahaan.'
      },
      {
        question: 'Bagaimana cara booking jadwal konsultasi?',
        answer: 'Anda bisa membooking melalui website kami, WhatsApp, atau telepon. Tim kami akan mengkonfirmasi ketersediaan jadwal dan mengirimkan link meeting untuk sesi online atau alamat untuk sesi offline.'
      },
      {
        question: 'Apakah konsultasi online sama efektif dengan offline?',
        answer: 'Ya, konsultasi online via video call sama efektifnya. Kami menggunakan platform yang aman dan memungkinkan screen sharing untuk review dokumen. Banyak klien kami memilih opsi online untuk fleksibilitas waktu.'
      },
      {
        question: 'Apakah ada garansi untuk advis yang diberikan?',
        answer: 'Kami memberikan advis berdasarkan pengalaman dan pengetahuan hukum terkini. Namun, hasil hukum dapat dipengaruhi oleh banyak faktor. Kami akan menjelaskan risiko dan peluang secara transparan sehingga Anda bisa membuat keputusan yang informed.'
      },
      {
        question: 'Bisakah konsultasi dilakukan mendadak/urgent?',
        answer: 'Ya, kami menyediakan layanan konsultasi urgent dengan respon dalam 24 jam untuk kasus darurat. Silakan hubungi hotline kami atau pilih paket Corporate yang termasuk akses hotline darurat hukum.'
      }
    ]
  };

  const ctaData = {
    title: 'Butuh Saran Hukum Profesional?',
    subtitle: 'Solusi Hukum Anda',
    primaryCta: 'Konsultasi Gratis Sekarang',
    secondaryCta: 'Hubungi via WhatsApp'
  };

  return (
    <div className="relative bg-legalo-bg min-h-screen overflow-x-hidden">
      <Toaster position="top-center" />
      
      <Navigation />
      
      <main>
        <ServiceDetailHeroSection
          title={heroData.title}
          subtitle={heroData.subtitle}
          summary={heroData.summary}
          highlights={heroData.highlights}
          backgroundImage={heroData.backgroundImage}
          onOpenModal={openModal}
        />

        <ServiceDetailBenefitsSection benefits={benefitsData.benefits} />

        <ServiceDetailProcessSection steps={processData.steps} />

        <ServiceDetailPricingSection
          packages={pricingData.packages}
          onOpenModal={openModal}
        />

        <ServiceDetailTestimonialSection testimonials={testimonialData.testimonials} />

        <ServiceDetailFAQSection faqs={faqData.faqs} />

        <ServiceDetailCTASection
          title={ctaData.title}
          subtitle={ctaData.subtitle}
          primaryCta={ctaData.primaryCta}
          secondaryCta={ctaData.secondaryCta}
          onOpenModal={openModal}
        />
      </main>
      
      <Footer />
      
      <ConsultationModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default KonsultasiHukumPage;
