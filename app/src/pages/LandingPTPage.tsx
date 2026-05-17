import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  MessageCircle,
  XCircle,
  CheckCircle2,
  Shield,
  Users,
  FileCheck,
  ArrowRight,
  Quote,
  ChevronDown,
  Star,
  Clock,
  Award,
  TrendingUp,
  Building2,
  FileText,
  BadgeCheck,
  Sparkles,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useLoading } from '@/context/LoadingContext';

gsap.registerPlugin(ScrollTrigger);

const WHATSAPP_NUMBER = '6281234567890';
const WHATSAPP_MESSAGE = encodeURIComponent(
  'Halo Legalo, saya ingin konsultasi tentang pendirian PT.'
);
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

const LandingPTPage = () => {
  const { isReady } = useLoading();

  const heroRef = useRef<HTMLDivElement>(null);
  const problemRef = useRef<HTMLDivElement>(null);
  const solutionRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const testimonialRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isReady) return;

    const sections = [
      { ref: heroRef, selector: '.hero-animate' },
      { ref: problemRef, selector: '.problem-animate' },
      { ref: solutionRef, selector: '.solution-animate' },
      { ref: processRef, selector: '.process-animate' },
      { ref: pricingRef, selector: '.pricing-animate' },
      { ref: socialRef, selector: '.social-animate' },
      { ref: testimonialRef, selector: '.testimonial-animate' },
      { ref: faqRef, selector: '.faq-animate' },
      { ref: closingRef, selector: '.closing-animate' },
    ];

    const triggers: ScrollTrigger[] = [];

    sections.forEach(({ ref, selector }) => {
      const section = ref.current;
      if (!section) return;

      const elements = section.querySelectorAll(selector);
      if (elements.length === 0) return;

      const ctx = gsap.context(() => {
        gsap.fromTo(
          elements,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              toggleActions: 'play none none none',
              onEnter: (self) => {
                triggers.push(self);
              },
            },
          }
        );
      }, section);

      return () => ctx.revert();
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [isReady]);

  const painPoints = [
    {
      title: 'Nggak Paham Alur & Istilah Hukum',
      desc: 'Dokumen dan regulasi yang rumit membingungkan',
      icon: FileText,
    },
    {
      title: 'Sudah Submit, Tapi Dokumen Ditolak',
      desc: 'Kesalahan kecil bisa membuat ulang dari awal',
      icon: XCircle,
    },
    {
      title: 'Proses Berlarut-larut & Makan Waktu',
      desc: 'Bolak-balik kantor pemerintah berbulan-bulan',
      icon: Clock,
    },
    {
      title: 'Takut Salah Langkah → Malah Rugi Biaya',
      desc: 'Satu kesalahan bisa berdampak finansial besar',
      icon: TrendingUp,
    },
  ];

  const solutions = [
    {
      icon: Shield,
      title: 'Legalitas Resmi',
      desc: 'Proses sesuai regulasi Kemenkumham RI',
      highlight: '100% Legal',
    },
    {
      icon: Users,
      title: 'Tim Berpengalaman',
      desc: 'Telah melayani ratusan klien dari berbagai industri',
      highlight: '500+ Klien',
    },
    {
      icon: CheckCircle2,
      title: 'Proses Transparan',
      desc: 'Update berkala di setiap tahapan',
      highlight: 'Real-time',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Konsultasi Gratis',
      description: 'Ceritakan kebutuhan Anda, kami bantu arahkan',
      icon: MessageCircle,
    },
    {
      number: '02',
      title: 'Pengumpulan Dokumen',
      description: 'Kami pandu step-by-step (nggak bakal bingung)',
      icon: FileCheck,
    },
    {
      number: '03',
      title: 'Proses Legalitas',
      description: 'Tim kami yang urus sampai selesai',
      icon: Shield,
    },
  ];

  const inclusions = [
    'Pembuatan Akta Notaris',
    'SK Kemenkumham',
    'NIB (Nomor Induk Berusaha)',
    'NPWP Perusahaan',
  ];

  const faqs = [
    {
      question: 'Berapa biaya yang dibutuhkan?',
      answer:
        'Tergantung kebutuhan PT Anda. Konsultasi dulu biar kami hitungkan secara transparan.',
    },
    {
      question: 'Dokumen apa saja yang diperlukan?',
      answer:
        'Nggak perlu pusing, kami kasih checklist lengkap + panduan.',
    },
    {
      question: 'Berapa lama proses pendirian PT?',
      answer:
        'Proses pendirian PT biasanya memakan waktu 7-14 hari kerja, tergantung pada kelengkapan dokumen dan respon dari pihak berwenang. Kami akan memantau setiap tahapan dan memberikan update secara berkala.',
    },
    {
      question: 'Apakah bisa dilakukan secara online?',
      answer:
        'Ya, seluruh proses dapat dilakukan secara online. Anda tidak perlu datang ke kantor kami. Cukup kirimkan dokumen yang diperlukan, dan tim kami akan mengurus sisanya.',
    },
    {
      question: 'Apakah ada garansi keberhasilan?',
      answer:
        'Kami memberikan jaminan pengurusan ulang gratis jika izin tidak berhasil dikarenakan kesalahan dari pihak kami. Keberhasilan akhir tetap bergantung pada persyaratan dan regulasi yang berlaku.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-legalo-dark/5">
        <div className="w-full px-6 lg:px-12 xl:px-20">
          <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
            <a href="/" className="font-heading font-bold text-xl text-legalo-dark">
              Legalo<span className="text-legalo-red">.</span>id
            </a>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 bg-legalo-red hover:bg-legalo-red-dark text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors shadow-lg shadow-legalo-red/20"
            >
              <MessageCircle className="w-4 h-4" />
              Konsultasi Gratis
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section - Enhanced with split layout */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center pt-16 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-legalo-dark via-legalo-dark to-legalo-red-dark" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-legalo-red rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-legalo-red-dark rounded-full blur-3xl" />
        </div>
        
        {/* Floating badge */}
        <div className="hero-animate absolute top-32 right-8 lg:right-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 hidden lg:flex items-center gap-2 z-20">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-white text-sm font-medium">Proses Cepat 7-14 Hari</span>
        </div>

        <div className="relative z-10 w-full px-6 lg:px-12 xl:px-20 py-20 lg:py-32">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left: Content */}
              <div className="text-center lg:text-left">
                <div className="hero-animate inline-flex items-center gap-2 bg-legalo-red/20 border border-legalo-red/30 rounded-full px-4 py-2 mb-6">
                  <Award className="w-4 h-4 text-legalo-red" />
                  <span className="text-white text-sm font-medium">#1 Jasa Pendirian PT Terpercaya</span>
                </div>
                
                <h1 className="hero-animate font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-[-0.02em] text-white mb-6">
                  Mau Punya PT Tanpa Ribet Urus Legalitas Sendiri?
                </h1>
                <p className="hero-animate text-white/70 text-lg sm:text-xl lg:text-2xl leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0">
                  Kami bantu urus dari nol sampai PT jadi — tanpa bolak-balik, tanpa
                  bingung prosedur.
                </p>
                <div className="hero-animate flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                  <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-full text-base font-semibold inline-flex items-center gap-3 transition-all shadow-lg shadow-[#25D366]/25 hover:shadow-[#25D366]/40 hover:scale-105"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Konsultasi Gratis via WhatsApp
                  </a>
                  <p className="text-white/50 text-sm">
                    (Tanya dulu aja, nggak harus langsung daftar)
                  </p>
                </div>

                {/* Trust badges */}
                <div className="hero-animate flex flex-wrap justify-center lg:justify-start gap-6 mt-10">
                  <div className="flex items-center gap-2 text-white/60">
                    <BadgeCheck className="w-5 h-5 text-legalo-red" />
                    <span className="text-sm">Terdaftar Resmi</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <Clock className="w-5 h-5 text-legalo-red" />
                    <span className="text-sm">7-14 Hari Kerja</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <Shield className="w-5 h-5 text-legalo-red" />
                    <span className="text-sm">Jaminan Aman</span>
                  </div>
                </div>
              </div>

              {/* Right: Image */}
              <div className="hero-animate relative hidden lg:block">
                <div className="relative">
                  <img
                    src="/images/hero_office.jpg"
                    alt="Professional Legal Services"
                    className="rounded-3xl shadow-2xl w-full h-[500px] object-cover"
                  />
                  <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-legalo-red/10 rounded-full flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-legalo-red" />
                      </div>
                      <div>
                        <p className="font-bold text-legalo-dark text-lg">500+</p>
                        <p className="text-legalo-dark/60 text-sm">PT Berdiri</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 bg-legalo-red rounded-2xl p-4 shadow-xl">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-white text-white" />
                      ))}
                    </div>
                    <p className="text-white text-sm mt-1 font-medium">4.9/5 Rating</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-animate mt-16 flex justify-center">
              <ChevronDown className="w-6 h-6 text-white/30 animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section - Enhanced with image and better cards */}
      <section ref={problemRef} className="py-24 lg:py-32 bg-legalo-bg">
        <div className="w-full px-6 lg:px-12 xl:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left: Image */}
              <div className="problem-animate relative hidden lg:block">
                <div className="relative">
                  <img
                    src="/images/blog_perizinan.jpg"
                    alt="Document Confusion"
                    className="rounded-3xl shadow-xl w-full h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-legalo-dark/60 to-transparent rounded-3xl" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white font-heading font-bold text-2xl">
                      Jangan Biarkan Legalitas Menghalangi Bisnis Anda
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: Content */}
              <div>
                <div className="problem-animate text-center lg:text-left mb-10">
                  <span className="inline-flex items-center gap-2 bg-legalo-red/10 text-legalo-red text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                    <XCircle className="w-4 h-4" />
                    Kebanyakan Orang Gagal di Sini
                  </span>
                  <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.02em] text-legalo-dark">
                    Kenapa Proses Legalitas PT Bikin Pusing?
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {painPoints.map((point, index) => (
                    <div
                      key={index}
                      className="problem-animate bg-white rounded-2xl p-6 border border-legalo-dark/5 hover:border-legalo-red/20 hover:shadow-lg transition-all group"
                    >
                      <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-legalo-red/10 transition-colors">
                        <point.icon className="w-6 h-6 text-legalo-red" />
                      </div>
                      <h3 className="text-legalo-dark font-semibold text-base mb-1">
                        {point.title}
                      </h3>
                      <p className="text-legalo-dark/50 text-sm leading-relaxed">
                        {point.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section - Enhanced with visual highlights */}
      <section ref={solutionRef} className="py-24 lg:py-32 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-legalo-red/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-legalo-red/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="w-full px-6 lg:px-12 xl:px-20 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="solution-animate inline-flex items-center gap-2 bg-legalo-red/10 text-legalo-red text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                <Shield className="w-4 h-4" />
                Solusi Kami
              </span>
              <h2 className="solution-animate font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.02em] text-legalo-dark mb-6 max-w-3xl mx-auto">
                Serahkan ke Tim yang Sudah Berpengalaman
              </h2>
              <p className="solution-animate text-legalo-dark/60 text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto">
                Kami bantu semua proses legalitas PT secara resmi, jelas, dan
                terarah — jadi Anda tinggal fokus ke bisnis.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Feature Cards */}
              <div className="space-y-6">
                {solutions.map((item, index) => (
                  <div
                    key={index}
                    className="solution-animate flex items-start gap-5 bg-legalo-bg rounded-2xl p-6 border border-legalo-dark/5 hover:border-legalo-red/20 hover:shadow-xl transition-all group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-legalo-red/10 flex items-center justify-center flex-shrink-0 group-hover:bg-legalo-red group-hover:scale-110 transition-all">
                      <item.icon className="w-7 h-7 text-legalo-red group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-heading font-semibold text-lg text-legalo-dark">
                          {item.title}
                        </h3>
                        <span className="bg-legalo-red/10 text-legalo-red text-xs font-bold px-2 py-1 rounded-full">
                          {item.highlight}
                        </span>
                      </div>
                      <p className="text-legalo-dark/60 text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right: Image */}
              <div className="solution-animate relative">
                <img
                  src="/images/why_team.jpg"
                  alt="Experienced Legal Team"
                  className="rounded-3xl shadow-2xl w-full h-[500px] object-cover"
                />
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-5 shadow-xl border border-legalo-dark/5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-legalo-red rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-legalo-dark text-xl">98%</p>
                      <p className="text-legalo-dark/60 text-sm">Tingkat Kepuasan</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section - Enhanced */}
      <section ref={processRef} className="py-24 lg:py-32 bg-legalo-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-legalo-red rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-legalo-red-dark rounded-full blur-3xl" />
        </div>

        <div className="w-full px-6 lg:px-12 xl:px-20 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="process-animate text-center mb-16 lg:mb-20">
              <span className="inline-flex items-center gap-2 bg-legalo-red/20 text-legalo-red text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                <Clock className="w-4 h-4" />
                Cuma 3 Langkah Sampai PT Jadi
              </span>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.02em] text-white mb-4">
                Proses yang Simpel dan Transparan
              </h2>
              <p className="text-white/50 text-lg max-w-2xl mx-auto">
                Nggak perlu pusing mikirin prosedur. Kami yang urus semuanya.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
              {/* Connector line - desktop */}
              <div className="hidden md:block absolute top-24 left-[16%] right-[16%] h-1 bg-gradient-to-r from-legalo-red/40 via-legalo-red to-legalo-red/40" />

              {steps.map((step, index) => (
                <div
                  key={index}
                  className="process-animate relative flex flex-col items-center text-center"
                >
                  <div className="relative z-10 mb-8">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-legalo-red to-legalo-red-dark flex items-center justify-center shadow-2xl shadow-legalo-red/30 ring-4 ring-legalo-red/20">
                      <step.icon className="w-12 h-12 text-white" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-white text-legalo-dark font-bold text-sm flex items-center justify-center shadow-lg">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="font-heading font-semibold text-2xl text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-white/50 text-base leading-relaxed max-w-[280px]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Strip Section - Enhanced */}
      <section ref={pricingRef} className="py-20 lg:py-28 bg-legalo-bg relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-legalo-red/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-legalo-red/10 rounded-full blur-3xl" />
        </div>

        <div className="w-full px-6 lg:px-12 xl:px-20 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="pricing-animate bg-white rounded-3xl p-8 lg:p-12 shadow-tile border border-legalo-dark/5 text-center relative overflow-hidden">
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-legalo-red/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              
              <span className="inline-flex items-center gap-2 bg-legalo-red/10 text-legalo-red text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4" />
                Bisnis Sah Tanpa Resah
              </span>
              
              <h2 className="font-heading font-bold text-5xl sm:text-6xl lg:text-7xl text-legalo-dark mb-2">
                Rp 4,5 Juta
              </h2>
              <p className="text-legalo-dark/40 text-lg mb-8">
                All-in Package
              </p>

              {/* Inclusions grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-8">
                {inclusions.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 bg-legalo-bg rounded-xl px-4 py-3">
                    <CheckCircle2 className="w-5 h-5 text-legalo-red flex-shrink-0" />
                    <span className="text-legalo-dark text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <p className="text-legalo-dark/50 text-sm mb-8">
                Bisa konsultasi dulu GRATIS, proses sangat praktis
              </p>
              
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 bg-legalo-red hover:bg-legalo-red-dark text-white px-8 py-4 rounded-full text-base font-semibold transition-all shadow-lg shadow-legalo-red/25 hover:shadow-legalo-red/40 hover:scale-105"
              >
                <MessageCircle className="w-5 h-5" />
                Tanya Detail via WhatsApp
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section - Enhanced with ticker */}
      <section ref={socialRef} className="py-16 lg:py-20 bg-white border-y border-legalo-dark/5">
        <div className="w-full px-6 lg:px-12 xl:px-20">
          <div className="max-w-5xl mx-auto text-center">
            <p className="social-animate text-legalo-dark/40 text-xs uppercase tracking-widest mb-8">
              Dipercaya Berbagai Perusahaan
            </p>
            <div className="social-animate flex flex-wrap justify-center items-center gap-12 lg:gap-20">
              {[
                { name: 'ASTRA', icon: Building2 },
                { name: 'Indomaret', icon: Building2 },
                { name: 'ASRX', icon: Building2 },
              ].map((company, index) => (
                <div key={index} className="flex items-center gap-3 group">
                  <company.icon className="w-8 h-8 text-legalo-dark/20 group-hover:text-legalo-red transition-colors" />
                  <span className="font-heading font-bold text-2xl lg:text-3xl text-legalo-dark/20 group-hover:text-legalo-dark/40 transition-colors">
                    {company.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section - Enhanced with image */}
      <section ref={testimonialRef} className="py-24 lg:py-32 bg-legalo-bg">
        <div className="w-full px-6 lg:px-12 xl:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left: Image */}
              <div className="testimonial-animate relative hidden lg:block">
                <img
                  src="/images/testimonial_portrait.jpg"
                  alt="Happy Client"
                  className="rounded-3xl shadow-2xl w-full h-[500px] object-cover"
                />
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-5 shadow-xl">
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-legalo-dark font-semibold text-sm">4.9/5 Rating</p>
                  <p className="text-legalo-dark/50 text-xs">Dari 500+ klien</p>
                </div>
              </div>

              {/* Right: Content */}
              <div>
                <span className="testimonial-animate inline-flex items-center gap-2 bg-legalo-red/10 text-legalo-red text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                  <Quote className="w-4 h-4" />
                  Testimoni
                </span>
                <h2 className="testimonial-animate font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.02em] text-legalo-dark mb-10">
                  Apa Kata Klien Kami?
                </h2>

                <div className="testimonial-animate bg-white rounded-3xl p-8 lg:p-10 shadow-tile relative">
                  <Quote className="absolute top-6 right-6 w-12 h-12 text-legalo-red/10" />
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-legalo-dark text-lg lg:text-xl leading-relaxed mb-8 italic">
                    "Pelayanan sangat cepat dan profesional. Prosesnya jelas dari awal
                    sampai selesai. Saya nggak perlu pusing mikirin dokumen-dokumennya."
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-legalo-red/10 flex items-center justify-center">
                      <span className="text-legalo-red font-bold text-lg">AD</span>
                    </div>
                    <div>
                      <p className="font-semibold text-legalo-dark">Andi Darmawan</p>
                      <p className="text-legalo-dark/50 text-sm">Founder, PT TechVision Indonesia</p>
                    </div>
                  </div>
                </div>

                {/* Mini testimonials */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="testimonial-animate bg-white rounded-2xl p-5 shadow-sm">
                    <p className="text-legalo-dark font-bold text-2xl mb-1">7-14</p>
                    <p className="text-legalo-dark/50 text-sm">Hari Kerja</p>
                  </div>
                  <div className="testimonial-animate bg-white rounded-2xl p-5 shadow-sm">
                    <p className="text-legalo-dark font-bold text-2xl mb-1">500+</p>
                    <p className="text-legalo-dark/50 text-sm">PT Berdiri</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Enhanced */}
      <section ref={faqRef} className="py-24 lg:py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-legalo-red/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        
        <div className="w-full px-6 lg:px-12 xl:px-20 relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="faq-animate text-center mb-12 lg:mb-16">
              <span className="inline-flex items-center gap-2 bg-legalo-red/10 text-legalo-red text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                <MessageCircle className="w-4 h-4" />
                Masih Ragu?
              </span>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.02em] text-legalo-dark">
                Ini yang Sering Ditanyakan
              </h2>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="faq-animate bg-legalo-bg border border-legalo-dark/5 rounded-2xl px-6 lg:px-8 data-[state=open]:border-legalo-red/30 data-[state=open]:shadow-lg transition-all"
                >
                  <AccordionTrigger className="text-left font-heading font-semibold text-base lg:text-lg text-legalo-dark hover:text-legalo-red transition-colors py-6">
                    <span className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-legalo-red/10 text-legalo-red text-sm font-bold flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </span>
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-legalo-dark/60 text-sm lg:text-base leading-relaxed pb-6 pl-11">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Closing CTA Section - Enhanced */}
      <section ref={closingRef} className="py-24 lg:py-32 bg-legalo-red relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white rounded-full blur-3xl opacity-5" />
        </div>

        <div className="relative z-10 w-full px-6 lg:px-12 xl:px-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="closing-animate inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-5 py-2.5 mb-8">
              <Clock className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">Respons dalam 1 x 24 jam</span>
            </div>
            
            <h2 className="closing-animate font-heading font-bold text-3xl sm:text-4xl lg:text-6xl leading-[1.1] tracking-[-0.02em] text-white mb-6">
              Nggak Perlu Bingung Lagi Urus Legalitas Sendiri
            </h2>
            <p className="closing-animate text-white/80 text-lg lg:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
              Konsultasi sekarang, biar Anda tahu langkah paling cepat & aman
              untuk punya PT.
            </p>
            <div className="closing-animate flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white hover:bg-legalo-dark text-legalo-red hover:text-white px-8 py-4 rounded-full text-base font-semibold inline-flex items-center gap-3 transition-all shadow-2xl hover:scale-105"
              >
                <MessageCircle className="w-5 h-5" />
                Konsultasi Gratis via WhatsApp
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
            
            {/* Trust indicators */}
            <div className="closing-animate flex flex-wrap justify-center gap-8 mt-10">
              <div className="flex items-center gap-2 text-white/60">
                <Shield className="w-5 h-5" />
                <span className="text-sm">Aman & Terpercaya</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <BadgeCheck className="w-5 h-5" />
                <span className="text-sm">Terdaftar Resmi</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Clock className="w-5 h-5" />
                <span className="text-sm">Proses Cepat</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="bg-legalo-dark py-10">
        <div className="w-full px-6 lg:px-12 xl:px-20">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-xl text-white">
                Legalo<span className="text-legalo-red">.</span>id
              </span>
            </div>
            <p className="text-white/40 text-sm">
              © {new Date().getFullYear()} Legalo.id. All rights reserved.
            </p>
            <p className="text-white/40 text-xs">Terdaftar di Kemenkumham RI</p>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-white via-white to-transparent sm:hidden">
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-4 rounded-full text-base font-semibold inline-flex items-center justify-center gap-3 transition-all shadow-lg shadow-[#25D366]/25"
        >
          <MessageCircle className="w-5 h-5" />
          Konsultasi Gratis via WhatsApp
        </a>
      </div>
    </div>
  );
};

export default LandingPTPage;
