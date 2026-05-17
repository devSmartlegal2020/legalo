import EbookForm from '@/components/admin/EbookForm';

const CreateEbook = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New E-book</h1>
        <p className="text-gray-500 mt-1">Add a new e-book to your library</p>
      </div>
      <EbookForm />
    </div>
  );
};

export default CreateEbook;