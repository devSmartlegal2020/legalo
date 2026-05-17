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

const IzinOSSNIBPage = () => {
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
    title: 'Izin OSS/NIB',
    subtitle: 'Business Licenses',
    summary: 'Pengurusan perizinan usaha melalui Sistem Online Single Submission (OSS) untuk mendapatkan Nomor Induk Berusaha (NIB) dan izin komersial sesuai KBLI. Pastikan bisnis Anda legal dan beroperasi sesuai regulasi.',
    highlights: [
      'NIB aktif dalam 1-3 hari',
      'Mapping KBLI akurat',
      'Izin lokasi termasuk',
      'Update status berkala'
    ],
    backgroundImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&q=80'
  };

  const benefitsData = {
    benefits: [
      {
        icon: 'zap',
        title: 'Proses Cepat',
        description: 'NIB aktif dalam 1-3 hari kerja dengan sistem yang terintegrasi langsung ke OSS-BKPM.'
      },
      {
        icon: 'shield',
        title: 'Kepatuhan Penuh',
        description: 'Memastikan semua izin sesuai dengan regulasi terbaru dan terhindar dari sanksi.'
      },
      {
        icon: 'checkCircle',
        title: 'Mapping KBLI Tepat',
        description: 'Analisis KBLI yang akurat sesuai aktivitas bisnis Anda untuk kelengkapan izin.'
      }
    ]
  };

  const processData = {
    steps: [
      {
        step: 1,
        title: 'Analisis Kebutuhan',
        description: 'Evaluasi bidang usaha Anda dan identifikasi KBLI serta izin komersial yang diperlukan.'
      },
      {
        step: 2,
        title: 'Persiapan Dokumen',
        description: 'Pengumpulan dan verifikasi dokumen seperti NPWP, akta perusahaan, dan data pendukung.'
      },
      {
        step: 3,
        title: 'Pendaftaran OSS',
        description: 'Pengajuan NIB dan izin terkait melalui sistem OSS dengan tracking status real-time.'
      },
      {
        step: 4,
        title: 'Aktivasi & Monitoring',
        description: 'NIB aktif dan siap digunakan. Kami bantu monitoring status izin secara berkala.'
      }
    ]
  };

  const pricingData = {
    packages: [
      {
        name: 'Paket NIB Basic',
        price: 'Rp 1.500.000',
        description: 'Pendaftaran NIB untuk usaha baru',
        features: [
          'Pendaftaran NIB baru',
          'Mapping 1-3 KBLI',
          'Izin lokasi (tergantung wilayah)',
          'Aktivasi akun OSS',
          'Dokumen NIB digital'
        ],
        ctaText: 'Pilih Paket'
      },
      {
        name: 'Paket OSS Complete',
        price: 'Rp 2.800.000',
        description: 'Solusi lengkap dengan izin komersial',
        features: [
          'Semua fitur NIB Basic',
          'Mapping hingga 5 KBLI',
          'Izin komersial dasar',
          'Pembaruan data perusahaan',
          'Konsultasi compliance',
          'Laporan berkala 3 bulan'
        ],
        popular: true,
        ctaText: 'Pilih Paket'
      }
    ]
  };

  const testimonialData = {
    testimonials: [
      {
        quote: 'Sangat membantu untuk pengurusan NIB usaha baru saya. Prosesnya cepat dan tim sangat memahami KBLI yang sesuai dengan bisnis saya. Dalam 2 hari NIB sudah aktif!',
        name: 'Budi Santoso',
        company: 'Owner UD Makmur Jaya',
        service: 'Izin OSS/NIB',
        rating: 5
      }
    ]
  };

  const faqData = {
    faqs: [
      {
        question: 'Apa itu NIB dan mengapa penting?',
        answer: 'NIB (Nomor Induk Berusaha) adalah identitas pelaku usaha yang dikeluarkan melalui OSS. NIB menggantikan TDP, SIUP, dan TDP sekaligus. Dengan NIB, bisnis Anda diakui secara hukum dan dapat mengikuti berbagai aktivitas bisnis formal.'
      },
      {
        question: 'Berapa lama proses pengurusan NIB?',
        answer: 'Proses NIB baru biasanya memakan waktu 1-3 hari kerja jika dokumen lengkap. Namun, durasi bisa berbeda tergantung pada verifikasi data dan respon dari sistem OSS-BKPM.'
      },
      {
        question: 'Apa itu KBLI dan bagaimana menentukannya?',
        answer: 'KBLI (Klasifikasi Baku Lapangan Usaha Indonesia) adalah kode klasifikasi bidang usaha. Tim kami akan membantu menganalisis aktivitas bisnis Anda dan menentukan KBLI yang paling sesuai untuk memastikan izin komersial yang tepat.'
      },
      {
        question: 'Apakah NIB perlu diperpanjang?',
        answer: 'NIB bersifat seumur hidup selama perusahaan masih beroperasi. Namun, jika ada perubahan data perusahaan seperti alamat atau KBLI, perlu dilakukan pembaruan data melalui sistem OSS.'
      },
      {
        question: 'Bisakah mengurus NIB untuk usaha yang sudah berjalan?',
        answer: 'Ya, kami juga melayani pembuatan NIB untuk usaha yang sudah beroperasi namun belum memiliki izin resmi. Kami akan membantu proses backdating sesuai dengan ketentuan yang berlaku.'
      }
    ]
  };

  const ctaData = {
    title: 'Pastikan Bisnis Anda Berizin Lengkap',
    subtitle: 'Legalitas Bisnis Anda',
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

export default IzinOSSNIBPage;
