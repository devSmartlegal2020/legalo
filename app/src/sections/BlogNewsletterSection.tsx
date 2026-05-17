import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Send, CheckCircle, Loader2 } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { newsletterAPI } from '@/services/api';
import { toast } from 'sonner';

gsap.registerPlugin(ScrollTrigger);

const BlogNewsletterSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { isReady } = useLoading();

  useEffect(() => {
    if (!isReady) return;
    
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const elements = section.querySelectorAll('.animate-item');
      
      gsap.fromTo(elements,
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6, 
          stagger: 0.1, 
          ease: 'power2.out',
          scrollTrigger: { 
            trigger: section, 
            start: 'top 85%', 
            toggleActions: 'play none none none' 
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, [isReady]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await newsletterAPI.subscribe({
        email,
        signupSource: 'blog_section'
      });

      setIsSubmitted(true);
      setEmail('');
      
      if (response.data.data.status === 'pending') {
        toast.success('Please check your email to confirm your subscription!');
      } else {
        setIsConfirmed(true);
        toast.success('Successfully subscribed to newsletter!');
      }
      
      // Reset after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setIsConfirmed(false);
      }, 5000);
    } catch (err: any) {
      console.error('Newsletter subscription error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to subscribe. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-white">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="animate-item w-16 h-16 bg-legalo-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-legalo-red" />
          </div>
          
          <h2 className="animate-item font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-legalo-dark mb-4">
            Dapatkan Insight Hukum Setiap Minggu
          </h2>
          
          <p className="animate-item text-legalo-dark/60 text-lg lg:text-xl leading-relaxed mb-10">
            Berlangganan newsletter kami untuk menerima tips legal, update regulasi terbaru, 
            dan panduan praktis langsung di inbox Anda. Gratis!
          </p>
          
          {isSubmitted ? (
            <div className="animate-item max-w-lg mx-auto p-6 bg-green-50 rounded-xl">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg text-green-800 mb-2">
                {isConfirmed ? 'Berhasil Berlangganan!' : 'Cek Email Anda!'}
              </h3>
              <p className="text-green-700">
                {isConfirmed 
                  ? 'Anda telah berhasil berlangganan newsletter kami.'
                  : 'Kami telah mengirimkan email konfirmasi. Silakan cek inbox atau folder spam Anda.'
                }
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="animate-item max-w-lg mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-legalo-dark/40" />
                  <Input
                    type="email"
                    placeholder="Masukkan email Anda"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 bg-legalo-bg border-legalo-dark/10 rounded-xl text-legalo-dark placeholder:text-legalo-dark/40 focus:border-legalo-red focus:ring-legalo-red"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-14 px-8 bg-legalo-red hover:bg-legalo-red-dark text-white font-medium rounded-xl transition-colors inline-flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Subscribe
                    </>
                  )}
                </Button>
              </div>
              
              <p className="text-legalo-dark/40 text-sm mt-4">
                Kami menghargai privasi Anda. Unsubscribe kapan saja.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogNewsletterSection;
