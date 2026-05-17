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

const PendaftaranMerekPage = () => {
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
    title: 'Pendaftaran Merek',
    subtitle: 'Lindungi Brand Anda',
    summary: 'Daftarkan merek dagang Anda secara resmi di DJKI. Dapatkan perlindungan hukum eksklusif, e-sertifikat otentik, dan pantau status pengajuan real-time bersama tim ahli kami.',
    highlights: [
      'Perlindungan hukum 10 tahun',
      'Pengecekan merek gratis',
      'Pengajuan hanya 3 hari kerja',
      'E-sertifikat resmi DJKI'
    ],
    backgroundImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1920&q=80'
  };

  const benefitsData = {
    benefits: [
      {
        icon: 'shield',
        title: 'Perlindungan Hukum Kuat',
        description: 'Hak eksklusif penggunaan merek dan dasar hukum untuk menindak pelanggaran serta pembajakan brand Anda.'
      },
      {
        icon: 'zap',
        title: 'Proses Cepat & Transparan',
        description: 'Pengecekan gratis di database DJKI, pengajuan dokumen hanya 3 hari kerja, dan tracking status real-time.'
      },
      {
        icon: 'users',
        title: 'Tim Ahli Berpengalaman',
        description: 'Ribuan kasus sukses ditangani oleh konsultan berpengalaman dengan strategi pemilihan kelas merek yang tepat.'
      }
    ]
  };

  const processData = {
    steps: [
      {
        step: 1,
        title: 'Konsultasi & Pengecekan',
        description: 'Cek ketersediaan merek Anda secara gratis di database DJKI untuk memastikan peluang keberhasilan.'
      },
      {
        step: 2,
        title: 'Persiapan Dokumen',
        description: 'Siapkan identitas, logo, dan pemilihan kelas merek yang paling sesuai dengan bisnis Anda.'
      },
      {
        step: 3,
        title: 'Pengajuan ke DJKI',
        description: 'Ajukan permohonan merek resmi ke Direktorat Jenderal Kekayaan Intelektual dengan prioritas penanganan.'
      },
      {
        step: 4,
        title: 'Monitoring & Sertifikat',
        description: 'Pantau progress pengajuan hingga keputusan akhir dan terima e-sertifikat resmi dari DJKI.'
      }
    ]
  };

  const waBase = 'https://wa.me/6281234567890?text=';

  const pricingData = {
    packages: [
      {
        name: 'Jasa Cek Merek',
        price: 'Rp 499.000',
        duration: '5 Hari Kerja',
        description: 'Telusuri apakah merek Anda sudah terdaftar atau memiliki kemiripan dengan merek lain.',
        features: [
          'Konsultasi via chat',
          'Bantuan pemilihan kelas merek',
          'Hasil penelusuran (kesimpulan & saran)'
        ],
        ctaText: 'Cek Merek Sekarang',
        ctaHref: waBase + encodeURIComponent('Halo, saya ingin menggunakan Jasa Cek Merek dari Legalo.id')
      },
      {
        name: 'Jasa Pendaftaran Merek',
        price: 'Rp 3.500.000',
        duration: '3 Hari Kerja',
        description: 'Ajukan pendaftaran dan lindungi merek Anda secara resmi di DJKI.',
        features: [
          'Konsultasi pemilihan kelas merek',
          'Bukti penerimaan permohonan',
          'Monitoring & update status hingga keputusan',
          'E-sertifikat resmi dari DJKI'
        ],
        popular: true,
        ctaText: 'Daftarkan Merek',
        ctaHref: waBase + encodeURIComponent('Halo, saya ingin mendaftarkan merek dengan Jasa Pendaftaran Merek Legalo.id')
      },
      {
        name: 'Jasa Tanggapan Usul Tolak',
        price: 'Rp 3.500.000',
        duration: '5 Hari Kerja',
        description: 'Buat tanggapan profesional untuk menghadapi usulan penolakan merek dari DJKI.',
        features: [
          'Penyusunan dokumen tanggapan profesional',
          'Bantuan submit ke sistem DJKI'
        ],
        ctaText: 'Konsultasi Sekarang',
        ctaHref: waBase + encodeURIComponent('Halo, saya ingin konsultasi untuk Jasa Tanggapan Usul Tolak merek dari Legalo.id')
      }
    ]
  };

  const testimonialData = {
    testimonials: [
      {
        quote: 'Pendaftaran merek untuk brand fashion saya berjalan sangat lancar. Tim Legalo sangat detail dalam melakukan pencarian sebelum pengajuan, sehingga merek saya lolos tanpa kendala. Sangat profesional!',
        name: 'Dewi Lestari',
        company: 'Founder DL Fashion',
        service: 'Pendaftaran Merek',
        rating: 5
      },
      {
        quote: 'Sebelum daftar, saya pakai jasa cek merek dulu. Hasilnya sangat membantu—ada rekomendasi kelas merek yang saya nggak tahu sebelumnya. Worth it dan responsnya cepat!',
        name: 'Rizky Firmansyah',
        company: 'Owner Brewly Coffee',
        service: 'Jasa Cek Merek',
        rating: 5
      }
    ]
  };

  const faqData = {
    faqs: [
      {
        question: 'Berapa lama proses pendaftaran merek di DJKI?',
        answer: 'Proses pengajuan dokumen oleh tim kami hanya memerlukan 3 hari kerja. Namun, proses pemeriksaan di DJKI secara keseluruhan biasanya berlangsung 12-18 bulan hingga sertifikat diterbitkan, tergantung pada antrean dan kompleksitas merek.'
      },
      {
        question: 'Apa bedanya Jasa Cek Merek dan Jasa Pendaftaran Merek?',
        answer: 'Jasa Cek Merek cocok untuk Anda yang ingin memastikan ketersediaan merek dan mendapatkan rekomendasi kelas sebelum mengajukan pendaftaran. Jasa Pendaftaran Merek adalah layanan lengkap yang mencakup pengajuan resmi, monitoring, hingga e-sertifikat dari DJKI.'
      },
      {
        question: 'Bagaimana jika merek saya ditolak oleh DJKI?',
        answer: 'Jika merek ditolak, Anda bisa menggunakan Jasa Tanggapan Usul Tolak kami. Tim kami akan menyusun dokumen tanggapan profesional dan membantu submit ke DJKI agar peluang diterima lebih besar.'
      },
      {
        question: 'Apa yang dimaksud dengan kelas merek?',
        answer: 'Kelas merek adalah kategori jenis barang atau jasa berdasarkan sistem Nice Classification. Terdapat 45 kelas—1-34 untuk barang dan 35-45 untuk jasa. Pemilihan kelas yang tepat sangat penting untuk kelengkapan perlindungan hukum merek Anda.'
      },
      {
        question: 'Apakah saya bisa mendaftarkan logo saja tanpa nama?',
        answer: 'Ya, Anda bisa mendaftarkan logo saja, nama saja, atau kombinasi keduanya. Logo yang unik dan memiliki karakteristik khusus memiliki peluang diterima yang lebih tinggi. Konsultasikan dengan tim kami untuk strategi terbaik.'
      }
    ]
  };

  const ctaData = {
    title: 'Lindungi Merek Anda Sebelum Terlambat',
    subtitle: 'Aman Brand Anda',
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

export default PendaftaranMerekPage;
