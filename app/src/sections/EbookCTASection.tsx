import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, ArrowRight, CheckCircle, BookOpen, FileText, Bell } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

gsap.registerPlugin(ScrollTrigger);

const EbookCTASection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isReady } = useLoading();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    consent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const elements = section.querySelectorAll('.animate-item');
      
      gsap.fromTo(elements,
        { y: 40, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          stagger: 0.15, 
          ease: 'power2.out',
          scrollTrigger: { 
            trigger: section, 
            start: 'top 80%', 
            toggleActions: 'play none none none' 
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, [isReady]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.consent) {
      toast.error('Mohon setujui syarat dan ketentuan');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Berhasil berlangganan newsletter! Cek email Anda untuk konfirmasi.');
    setFormData({ name: '', email: '', company: '', consent: false });
    setIsSubmitting(false);
  };

  const benefits = [
    {
      icon: BookOpen,
      title: 'E-books Gratis',
      description: 'Akses ke semua e-book legal dan bisnis tanpa biaya'
    },
    {
      icon: Bell,
      title: 'Update Berkala',
      description: 'Informasi terbaru tentang regulasi dan perizinan'
    },
    {
      icon: FileText,
      title: 'Template & Checklist',
      description: 'Template dokumen legal dan checklist kepatuhan'
    },
  ];

  return (
    <section ref={sectionRef} id="newsletter" className="py-24 lg:py-32 bg-white">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-legalo-dark rounded-3xl p-8 lg:p-16 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-legalo-red/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-legalo-red/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Benefits */}
              <div>
                <span className="animate-item inline-block bg-legalo-red/20 text-legalo-red text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                  <Mail className="w-4 h-4 inline-block mr-2" />
                  Newsletter
                </span>
                
                <h2 className="animate-item font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.02em] text-white mb-6">
                  Download E-books & Join Our Newsletter
                </h2>
                
                <p className="animate-item text-white/70 text-lg leading-relaxed mb-8">
                  Dapatkan akses eksklusif ke koleksi e-book legal, tips bisnis, update regulasi terbaru, 
                  dan panduan praktis langsung di inbox Anda. Bergabung dengan ribuan UMKM dan startup yang telah mempercayai kami.
                </p>

                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="animate-item flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-legalo-red/20 flex items-center justify-center flex-shrink-0">
                        <benefit.icon className="w-5 h-5 text-legalo-red" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm mb-1">{benefit.title}</h4>
                        <p className="text-white/60 text-sm">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Right Side - Form */}
              <div className="animate-item lg:pl-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <h3 className="font-heading font-semibold text-xl text-white mb-2">
                    Subscribe Sekarang
                  </h3>
                  <p className="text-white/60 text-sm mb-6">
                    Isi formulir di bawah untuk bergabung
                  </p>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newsletter-name" className="text-white/80">Nama Lengkap *</Label>
                      <Input
                        id="newsletter-name"
                        type="text"
                        placeholder="Masukkan nama lengkap"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-lg focus:border-legalo-red"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newsletter-email" className="text-white/80">Email *</Label>
                      <Input
                        id="newsletter-email"
                        type="email"
                        placeholder="email@perusahaan.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-lg focus:border-legalo-red"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newsletter-company" className="text-white/80">Nama Perusahaan</Label>
                      <Input
                        id="newsletter-company"
                        type="text"
                        placeholder="Nama perusahaan (opsional)"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-lg focus:border-legalo-red"
                      />
                    </div>
                    
                    <div className="flex items-start space-x-3 pt-2">
                      <Checkbox
                        id="newsletter-consent"
                        checked={formData.consent}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, consent: checked as boolean })
                        }
                        className="mt-1 border-white/30 data-[state=checked]:bg-legalo-red data-[state=checked]:border-legalo-red"
                      />
                      <Label htmlFor="newsletter-consent" className="text-sm text-white/60 leading-normal cursor-pointer">
                        Saya menyetujui untuk menerima newsletter dan informasi dari Legalo.id. 
                        Data saya akan digunakan sesuai dengan kebijakan privasi.
                      </Label>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-legalo-red hover:bg-legalo-red-dark text-white font-medium py-6 rounded-lg transition-colors inline-flex items-center justify-center gap-2 group"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        <>
                          Subscribe Newsletter
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="flex items-center gap-2 text-white/40 text-xs">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>100% Gratis • Bisa berhenti kapan saja</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EbookCTASection;
