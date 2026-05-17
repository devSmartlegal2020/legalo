import PromotionForm from '@/components/admin/PromotionForm';

const CreatePromotion = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Promotion</h1>
        <p className="text-gray-500 mt-1">Create and publish a new promotional offer</p>
      </div>

      <PromotionForm />
    </div>
  );
};

export default CreatePromotion;
