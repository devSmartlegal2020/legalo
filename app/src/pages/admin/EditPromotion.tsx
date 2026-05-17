import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PromotionForm from '@/components/admin/PromotionForm';
import { promotionAPI } from '@/services/api';
import { Loader2 } from 'lucide-react';

const EditPromotion = () => {
  const { id } = useParams<{ id: string }>();
  const [promotion, setPromotion] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchPromotion(id);
    }
  }, [id]);

  const fetchPromotion = async (promotionId: string) => {
    try {
      setIsLoading(true);
      const response = await promotionAPI.getById(promotionId);
      const promoData = response.data.data.promotion;
      
      // Transform data to match form structure
      setPromotion({
        ...promoData,
        discountType: promoData.discount?.type || '',
        discountValue: promoData.discount?.value?.toString() || '',
        discountCode: promoData.discount?.code || '',
        startDate: promoData.startDate ? new Date(promoData.startDate) : null,
        endDate: promoData.endDate ? new Date(promoData.endDate) : null,
        targetPages: promoData.targetPages || [],
        targetCategories: promoData.targetCategories?.map((cat: any) =>
          typeof cat === 'string' ? cat : cat.toString()
        ) || [],
      });
    } catch (err) {
      setError('Failed to load promotion');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Promotion</h1>
        <p className="text-gray-500 mt-1">Update promotional offer details</p>
      </div>

      <PromotionForm key={promotion?._id || 'new'} promotionId={id} initialData={promotion} />
    </div>
  );
};

export default EditPromotion;
