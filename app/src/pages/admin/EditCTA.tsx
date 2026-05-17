import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import CTAForm from '@/components/admin/CTAForm';
import { ctaAPI, type CTA } from '@/services/api';
import { toast } from 'sonner';

const EditCTA = () => {
  const { id } = useParams<{ id: string }>();
  const [cta, setCTA] = useState<CTA | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCTA();
    }
  }, [id]);

  const fetchCTA = async () => {
    try {
      setIsLoading(true);
      const response = await ctaAPI.getById(id!);
      setCTA(response.data.data.cta);
    } catch (error) {
      console.error('Failed to fetch CTA:', error);
      toast.error('Failed to load CTA');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!cta) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-2">CTA Not Found</h1>
        <p className="text-gray-500">The CTA you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit CTA</h1>
        <p className="text-gray-500 mt-1">Update your call-to-action block</p>
      </div>

      <CTAForm
        ctaId={cta._id}
        initialData={{
          title: cta.title,
          description: cta.description,
          buttonText: cta.buttonText,
          buttonUrl: cta.buttonUrl,
          backgroundColor: cta.backgroundColor,
          textColor: cta.textColor,
          buttonBackgroundColor: cta.buttonBackgroundColor,
          buttonTextColor: cta.buttonTextColor,
          isActive: cta.isActive,
        }}
      />
    </div>
  );
};

export default EditCTA;
