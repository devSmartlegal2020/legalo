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

const PendirianPTCVPage = () => {
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
    title: 'Pendirian PT/CV',
    subtitle: 'Company Formation',
    summary: 'Layanan pendirian badan usaha profesional untuk PT dan CV. Kami menangani seluruh proses legal mulai dari akta pendirian hingga izin operasional lengkap dengan harga terjangkau.',
    highlights: [
      'Proses cepat 7-14 hari kerja',
      'Akta resmi dari Notaris',
      'NPWP & NIB termasuk',
      'Gratis konsultasi legal'
    ],
    backgroundImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80'
  };

  const benefitsData = {
    benefits: [
      {
        icon: 'clock',
        title: 'Proses Cepat',
        description: 'Dokumen lengkap dalam 7-14 hari kerja dengan tracking progres real-time melalui sistem kami.'
      },
      {
        icon: 'users',
        title: 'Tim Legal Berpengalaman',
        description: 'Ditangani oleh notaris dan konsultan hukum berpengalaman dengan ribuan kasus sukses.'
      },
      {
        icon: 'eye',
        title: 'Harga Transparan',
        description: 'Tidak ada biaya tersembunyi. Semua biaya termasuk pajak dan biaya administrasi sudah jelas.'
      }
    ]
  };

  const processData = {
    steps: [
      {
        step: 1,
        title: 'Konsultasi & Persiapan',
        description: 'Diskusi kebutuhan bisnis Anda dan persiapan dokumen yang diperlukan seperti KTP, KK, dan nama perusahaan.'
      },
      {
        step: 2,
        title: 'Pembuatan Akta',
        description: 'Proses pembuatan akta notaris oleh notaris resmi dan penandatanganan dokumen pendirian.'
      },
      {
        step: 3,
        title: 'Pengurusan Izin',
        description: 'Pengajuan SK Kemenkumham, NPWP perusahaan, dan NIB/OSS untuk izin operasional lengkap.'
      },
      {
        step: 4,
        title: 'Serah Terima Dokumen',
        description: 'Dokumen lengkap diserahkan dalam bentuk fisik dan digital siap digunakan untuk operasional bisnis.'
      }
    ]
  };

  const pricingData = {
    groups: [
      {
        title: 'Perseroan Terbatas - PT (PMDN)',
        packages: [
          {
            name: 'Paket Mudah',
            price: 'Rp 6.000.000',
            duration: '5 Hari Kerja',
            description: 'Solusi lengkap untuk pendirian PT dengan proses standar dan pendampingan penuh',
            features: [
              'Pendampingan Konsultan Hukum',
              'Pemesanan Nama PT',
              'Dokumen pendirian (Pernyataan setor modal, surat kuasa, pernyataan domisili, dll)',
              'Pendaftaran penuh pada daftar perusahaan (Akta Notaris & SK Kemenkumham)',
              'Nomor Pokok Wajib Pajak (NPWP)',
              'Surat Keterangan Terdaftar Wajib Pajak (SKT)',
              'Nomor Induk Berusaha (NIB)',
              'Berita Negara Republik Indonesia (BNRI/TBNRI)',
              'Persetujuan Lingkungan (SPPL)',
              'Pernyataan Mandiri Memenuhi Kewajiban',
              'Pernyataan Mandiri K3L',
              'Rekening Perusahaan (Mandiri/BCA/BSI/BRI)'
            ],
            ctaText: 'Chat Sekarang'
          },
          {
            name: 'Paket Cepat',
            price: 'Rp 14.899.000',
            duration: '3 Hari Kerja',
            description: 'Proses lebih cepat dengan tambahan dokumen legal bisnis',
            features: [
              'Semua layanan di Paket Mudah, ditambah',
              'Draft Daftar Pemegang Saham PT',
              'Draft Sertifikat Saham, masing-masing Pemegang Saham',
              'Draft Perjanjian Pemegang Saham',
              'Draft Perjanjian Kerja Karyawan Kontrak (PKWT)'
            ],
            popular: true,
            ctaText: 'Chat Sekarang'
          }
        ]
      },
      {
        title: 'Perseroan Perseorangan',
        packages: [
          {
            name: 'Paket Mudah',
            price: 'Rp 2.000.000',
            duration: '2 Hari Kerja',
            description: 'Solusi praktis untuk mendirikan usaha perorangan secara legal',
            features: [
              'Pendampingan Konsultan Hukum',
              'Akun Perseroan Perorangan',
              'Sertifikat Pendirian Perseroan Perorangan',
              'Surat Pernyataan Pendirian Perseroan Perorangan',
              'Nomor Pokok Wajib Pajak (NPWP)',
              'Surat Keterangan Terdaftar Wajib Pajak (SKT)',
              'Nomor Induk Berusaha (NIB)',
              'Perusahaan Persetujuan Lingkungan (SPPL)',
              'Pernyataan UMK terkait Tata Ruang',
              'Pernyataan Mandiri Memenuhi Kewajiban',
              'Pernyataan Mandiri K3L'
            ],
            ctaText: 'Chat Sekarang'
          }
        ]
      },
      {
        title: 'Perseroan Komanditer (CV)',
        packages: [
          {
            name: 'Paket Mudah',
            price: 'Rp 3.700.000',
            duration: '5 Hari Kerja',
            description: 'Pendirian CV dengan proses lengkap dan legalitas dasar',
            features: [
              'Pendampingan Konsultan Hukum',
              'Dokumen pendirian (Pernyataan setor modal, surat kuasa, pernyataan domisili, dll)',
              'Pendaftaran penuh pada daftar perusahaan (Akta Notaris & SK Kemenkumham)',
              'Nomor Pokok Wajib Pajak (NPWP)',
              'Surat Keterangan Terdaftar Wajib Pajak (SKT)',
              'Nomor Induk Berusaha (NIB)',
              'Persetujuan Lingkungan (SPPL)',
              'Pernyataan Mandiri Memenuhi Kewajiban',
              'Rekening Perusahaan (Mandiri/BCA/BSI/BRI)'
            ],
            ctaText: 'Chat Sekarang'
          },
          {
            name: 'Paket Cepat',
            price: 'Rp 11.899.000',
            duration: '3 Hari Kerja',
            description: 'Proses lebih cepat dengan tambahan dokumen pendukung bisnis',
            features: [
              'Semua layanan di Paket Mudah, ditambah',
              'Draft Daftar Pemegang Saham PT',
              'Draft Sertifikat Saham, masing-masing Pemegang Saham',
              'Draft Perjanjian Pemegang Saham',
              'Draft Perjanjian Kerja Karyawan Kontrak (PKWT)'
            ],
            popular: true,
            ctaText: 'Chat Sekarang'
          }
        ]
      },
      {
        title: 'Perseroan Terbatas - PT (PMA)',
        packages: [
          {
            name: 'Paket Mudah',
            price: 'Rp 15.000.000',
            duration: '15 Hari Kerja',
            description: 'Solusi lengkap untuk pendirian PT PMA dengan pendampingan penuh',
            features: [
              'Pendampingan Konsultan Hukum selama pengurusan',
              'Pemesanan Nama PT',
              'Perbantuan pemilihan Kode/Nomor Kegiatan Usaha (KBLI)',
              'Penyiapan Dokumen Persyaratan',
              'Akta Notaris Pendirian PT',
              'SK Pengesahan Badan Hukum dari Menteri Hukum & HAM',
              'Nomor Pokok Wajib Pajak (NPWP)',
              'Surat Keterangan Terdaftar sebagai Wajib Pajak (SKT)',
              'Nomor Induk Berusaha (NIB)',
              'Izin Usaha',
              'Berita Negara Republik Indonesia (BNRI/TBNRI)',
              'Persetujuan Lingkungan (SPPL)',
              'Pernyataan UMK terkait Tata Ruang',
              'Pernyataan Mandiri Memenuhi Kewajiban',
              'Pernyataan Mandiri K3L'
            ],
            ctaText: 'Chat Sekarang'
          }
        ]
      }
    ]
  };

  const testimonialData = {
    testimonials: [
      {
        quote: 'Proses pendirian PT sangat mudah dan cepat. Dalam 10 hari semua dokumen sudah selesai. Tim Legalo sangat responsif dan membantu menjelaskan setiap tahapan dengan detail. Sangat direkomendasikan!',
        name: 'Ahmad Rizky',
        company: 'CEO PT Teknologi Nusantara',
        service: 'Pendirian PT',
        rating: 5
      },
      {
        quote: 'Sebagai founder startup, saya butuh pendirian CV yang cepat dan terjangkau. Legalo memberikan solusi tepat dengan harga yang sangat kompetitif. Prosesnya transparan dan timnya profesional.',
        name: 'Sarah Wijaya',
        company: 'Founder CV Creative Digital',
        service: 'Pendirian CV',
        rating: 5
      }
    ]
  };

  const faqData = {
    faqs: [
      {
        question: 'Berapa lama proses pendirian PT/CV?',
        answer: 'Proses pendirian PT/CV umumnya memakan waktu 7-14 hari kerja tergantung pada kelengkapan dokumen dan respon dari instansi terkait. Kami akan memberikan update progres secara berkala.'
      },
      {
        question: 'Dokumen apa saja yang diperlukan?',
        answer: 'Dokumen yang diperlukan meliputi: KTP dan KK seluruh pendiri, NPWP pribadi, pas foto 3x4, dan nama perusahaan alternatif (minimal 3 pilihan). Untuk PT memerlukan minimal 2 pemegang saham.'
      },
      {
        question: 'Apakah ada biaya tambahan yang muncul?',
        answer: 'Tidak ada biaya tersembunyi. Semua biaya yang tertera sudah termasuk pajak dan biaya administrasi. Namun, jika terjadi revisi nama perusahaan karena ditolak, mungkin ada biaya tambahan.'
      },
      {
        question: 'Apakah saya perlu datang ke kantor notaris?',
        answer: 'Untuk penandatanganan akta, Anda perlu hadir di hadapan notaris. Namun kami akan menjadwalkan dengan notaris terdekat dengan lokasi Anda untuk memudahkan proses.'
      },
      {
        question: 'Apakah bisa mendirikan PT dengan modal minim?',
        answer: 'Ya, berdasarkan UU No. 11 Tahun 2020, modal dasar PT minimal Rp 50 juta namun modal disetor minimal 25% atau Rp 12,5 juta. Kami bisa membantu Anda menyesuaikan struktur modal sesuai kebutuhan.'
      }
    ]
  };

  const ctaData = {
    title: 'Siap Mendirikan Badan Usaha Anda?',
    subtitle: 'Mulai Bisnis Anda Sekarang',
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
          groups={pricingData.groups}
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

export default PendirianPTCVPage;
