import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConsultationModal = ({ isOpen, onClose }: ConsultationModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    serviceType: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, serviceType: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.serviceType) {
      toast.error('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Success
    toast.success('Terima kasih! Konsultasi Anda telah terkirim. Tim kami akan menghubungi Anda segera.');
    
    // Reset form
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      serviceType: '',
      message: ''
    });
    
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl text-legalo-dark">
            Konsultasi Gratis
          </DialogTitle>
          <DialogDescription className="text-legalo-dark/60">
            Isi formulir di bawah ini dan tim kami akan menghubungi Anda dalam 24 jam.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-legalo-dark">
              Nama Lengkap <span className="text-legalo-red">*</span>
            </Label>
            <Input
              id="fullName"
              name="fullName"
              placeholder="Masukkan nama lengkap Anda"
              value={formData.fullName}
              onChange={handleInputChange}
              className="border-legalo-dark/20 focus:border-legalo-red focus:ring-legalo-red"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-legalo-dark">
              Email <span className="text-legalo-red">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={handleInputChange}
              className="border-legalo-dark/20 focus:border-legalo-red focus:ring-legalo-red"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-legalo-dark">
              Nomor Telepon <span className="text-legalo-red">*</span>
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="08xx-xxxx-xxxx"
              value={formData.phone}
              onChange={handleInputChange}
              className="border-legalo-dark/20 focus:border-legalo-red focus:ring-legalo-red"
            />
          </div>

          {/* Service Type */}
          <div className="space-y-2">
            <Label htmlFor="serviceType" className="text-legalo-dark">
              Jenis Layanan <span className="text-legalo-red">*</span>
            </Label>
            <Select value={formData.serviceType} onValueChange={handleSelectChange}>
              <SelectTrigger className="border-legalo-dark/20 focus:border-legalo-red focus:ring-legalo-red">
                <SelectValue placeholder="Pilih jenis layanan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt-cv">Pendirian PT/CV</SelectItem>
                <SelectItem value="oss-nib">Izin OSS/NIB</SelectItem>
                <SelectItem value="trademark">Pendaftaran Merek</SelectItem>
                <SelectItem value="virtual-office">Virtual Office</SelectItem>
                <SelectItem value="consultation">Konsultasi Umum</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-legalo-dark">
              Pesan / Catatan
            </Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Ceritakan kebutuhan legal Anda (opsional)"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              className="border-legalo-dark/20 focus:border-legalo-red focus:ring-legalo-red resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-legalo-red hover:bg-legalo-red-dark text-white py-6 text-base font-semibold"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mengirim...
              </span>
            ) : (
              'Kirim Permohonan'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationModal;
