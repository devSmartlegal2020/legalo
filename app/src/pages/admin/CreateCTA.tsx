import CTAForm from '@/components/admin/CTAForm';

const CreateCTA = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New CTA</h1>
        <p className="text-gray-500 mt-1">Create a new call-to-action block for blog posts</p>
      </div>

      <CTAForm />
    </div>
  );
};

export default CreateCTA;
