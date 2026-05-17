import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Download, FileText, BookOpen, Shield, Briefcase, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { ebookAPI, newsletterAPI } from '@/services/api';

gsap.registerPlugin(ScrollTrigger);

// Dynamic icon mapper
const iconMap: { [key: string]: React.ComponentType<{ className?: string; strokeWidth?: number }> } = {
  FileText,
  BookOpen,
  Shield,
  Briefcase,
  Download,
};

// Color mapping from API to Tailwind classes
const colorMap: { [key: string]: string } = {
  blue: 'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
  green: 'bg-green-100 text-green-700',
  orange: 'bg-orange-100 text-orange-700',
  teal: 'bg-teal-100 text-teal-700',
  red: 'bg-red-100 text-red-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  indigo: 'bg-indigo-100 text-indigo-700',
  pink: 'bg-pink-100 text-pink-700',
  gray: 'bg-gray-100 text-gray-700',
};

// Cover color mapping from API to Tailwind gradient classes
const coverColorMap: { [key: string]: string } = {
  blue: 'from-blue-600 to-blue-800',
  purple: 'from-purple-600 to-purple-800',
  green: 'from-green-600 to-green-800',
  orange: 'from-orange-600 to-orange-800',
  teal: 'from-teal-600 to-teal-800',
  red: 'from-red-600 to-red-800',
  yellow: 'from-yellow-600 to-yellow-800',
  indigo: 'from-indigo-600 to-indigo-800',
  pink: 'from-pink-600 to-pink-800',
  gray: 'from-gray-600 to-gray-800',
};

interface Ebook {
  _id: string;
  id: string;
  title: string;
  summary: string;
  category: string;
  pages: number;
  iconName: string;
  coverColor: string;
  downloadType: 'internal' | 'external';
  externalUrl?: string;
  fileUrl?: string;
  fileName?: string;
  slug: string;
}

const EbookListSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isReady } = useLoading();
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    consent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    
    fetchEbooks();
  }, [isReady]);

  const fetchEbooks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await ebookAPI.getPublished();
      const ebooksData = response.data.data.ebooks || [];
      setEbooks(ebooksData);
    } catch (err: any) {
      console.error('Failed to fetch ebooks:', err);
      setError(err.response?.data?.message || 'Failed to load e-books');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isReady || isLoading) return;
    
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const header = section.querySelector('.animate-header');
      const cards = section.querySelectorAll('.animate-card');
      
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
      .fromTo(cards,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power2.out' },
        0.2
      );
    }, section);

    return () => ctx.revert();
  }, [isReady, isLoading, ebooks]);

  const getIconComponent = (iconName: string) => {
    return iconMap[iconName] || FileText;
  };

  const getColorClass = (coverColor: string) => {
    return colorMap[coverColor] || 'bg-gray-100 text-gray-700';
  };

  const getCoverGradient = (coverColor: string) => {
    return coverColorMap[coverColor] || 'from-gray-600 to-gray-800';
  };

  const handleDownloadClick = (ebook: Ebook) => {
    setSelectedEbook(ebook);
    setIsDialogOpen(true);
  };

  const handleDownload = (ebook: Ebook) => {
    if (ebook.downloadType === 'external' && ebook.externalUrl) {
      window.open(ebook.externalUrl, '_blank', 'noopener,noreferrer');
    } else if (ebook.fileUrl) {
      const link = document.createElement('a');
      link.href = ebook.fileUrl;
      link.download = ebook.fileName || `${ebook.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.consent) {
      toast.error('Mohon setujui syarat dan ketentuan');
      return;
    }

    if (!selectedEbook) {
      toast.error('E-book tidak ditemukan');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Record the download
      await ebookAPI.recordDownload(selectedEbook._id || selectedEbook.id, {
        email: formData.email,
        name: formData.name,
        company: formData.company,
        consent: formData.consent,
      });

      // Subscribe to newsletter if opted in
      if (formData.consent) {
        try {
          await newsletterAPI.subscribe({
            email: formData.email,
            name: formData.name,
            signupSource: 'ebook_download',
          });
        } catch (newsletterErr) {
          console.error('Newsletter subscription error:', newsletterErr);
        }
      }

      // Trigger the actual download
      handleDownload(selectedEbook);
      
      toast.success(`E-book "${selectedEbook.title}" sedang diunduh!`);
      setIsDialogOpen(false);
      setFormData({ name: '', email: '', company: '', consent: false });
      setSelectedEbook(null);
    } catch (err: any) {
      console.error('Download error:', err);
      toast.error(err.response?.data?.message || 'Gagal mengunduh e-book. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <section ref={sectionRef} id="ebooks" className="py-24 lg:py-32 bg-legalo-bg">
        <div className="w-full px-6 lg:px-12 xl:px-20">
          <div className="max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="w-12 h-12 text-legalo-red animate-spin mb-4" />
            <p className="text-legalo-dark/60">Memuat e-books...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section ref={sectionRef} id="ebooks" className="py-24 lg:py-32 bg-legalo-bg">
        <div className="w-full px-6 lg:px-12 xl:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold text-legalo-dark mb-2">Gagal Memuat E-books</h3>
              <p className="text-legalo-dark/60 mb-6">{error}</p>
              <Button onClick={fetchEbooks} variant="outline">
                Coba Lagi
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="ebooks" className="py-24 lg:py-32 bg-legalo-bg">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="animate-header mb-16 lg:mb-20">
            <span className="inline-block bg-legalo-red/10 text-legalo-red text-xs font-semibold px-4 py-2 rounded-full mb-6">
              E-book Collection
            </span>
            
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="lg:max-w-2xl">
                <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.02em] text-legalo-dark mb-4">
                  Download Free E-books
                </h2>
                <p className="text-legalo-dark/60 text-base lg:text-lg leading-relaxed">
                  Koleksi e-book gratis yang dirancang khusus untuk membantu UMKM dan startup memahami aspek legal dan bisnis di Indonesia.
                </p>
              </div>
            </div>
          </div>
          
          {ebooks.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-12 h-12 text-legalo-dark/30 mx-auto mb-4" />
              <p className="text-legalo-dark/60">Belum ada e-book yang tersedia.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ebooks.map((ebook) => {
                const IconComponent = getIconComponent(ebook.iconName);
                const colorClass = getColorClass(ebook.coverColor);
                const coverGradient = getCoverGradient(ebook.coverColor);
                
                return (
                  <div 
                    key={ebook._id || ebook.id} 
                    className="animate-card group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-legalo-dark/5"
                  >
                    {/* E-book Cover */}
                    <div className={`h-48 bg-gradient-to-br ${coverGradient} p-6 flex flex-col justify-between relative overflow-hidden`}>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                      
                      <div className="relative z-10">
                        <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${colorClass}`}>
                          {ebook.category}
                        </span>
                      </div>
                      
                      <div className="relative z-10">
                        <IconComponent className="w-12 h-12 text-white/80" strokeWidth={1.5} />
                      </div>
                    </div>
                    
                    <div className="p-6 lg:p-8">
                      <div className="flex items-center gap-2 text-sm text-legalo-dark/50 mb-4">
                        <FileText className="w-4 h-4" strokeWidth={1.5} />
                        <span>{ebook.pages} pages</span>
                        <span className="mx-1">•</span>
                        <span>PDF Format</span>
                      </div>
                      
                      <h3 className="font-heading font-semibold text-xl text-legalo-dark mb-3 group-hover:text-legalo-red transition-colors line-clamp-2">
                        {ebook.title}
                      </h3>
                      
                      <p className="text-legalo-dark/60 text-sm leading-relaxed mb-6 line-clamp-3">
                        {ebook.summary}
                      </p>
                      
                      <Button 
                        onClick={() => handleDownloadClick(ebook)}
                        className="w-full bg-legalo-dark hover:bg-legalo-red text-white font-medium py-3 rounded-lg transition-colors inline-flex items-center justify-center gap-2 group/btn"
                      >
                        <Download className="w-4 h-4" />
                        Download Free
                        <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Download Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">Download E-book</DialogTitle>
            <DialogDescription className="text-legalo-dark/60">
              Isi formulir di bawah untuk mengunduh "{selectedEbook?.title}"
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Masukkan nama lengkap"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="rounded-lg"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@perusahaan.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="rounded-lg"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Nama Perusahaan</Label>
              <Input
                id="company"
                type="text"
                placeholder="Nama perusahaan (opsional)"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="rounded-lg"
              />
            </div>
            
            <div className="flex items-start space-x-3 pt-2">
              <Checkbox
                id="consent"
                checked={formData.consent}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, consent: checked as boolean })
                }
                className="mt-1"
              />
              <Label htmlFor="consent" className="text-sm text-legalo-dark/70 leading-normal cursor-pointer">
                Saya menyetujui untuk menerima newsletter dan informasi terbaru dari Legalo.id. 
                Data saya akan digunakan sesuai dengan kebijakan privasi.
              </Label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-legalo-red hover:bg-legalo-red-dark text-white font-medium py-3 rounded-lg transition-colors"
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
                <span className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download E-book
                </span>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default EbookListSection;
