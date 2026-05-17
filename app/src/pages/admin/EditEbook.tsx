import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import EbookForm from '@/components/admin/EbookForm';
import { ebookAPI } from '@/services/api';

const EditEbook = () => {
  const { id } = useParams<{ id: string }>();
  const [ebook, setEbook] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchEbook();
    }
  }, [id]);

  const fetchEbook = async () => {
    try {
      setIsLoading(true);
      const response = await ebookAPI.getById(id!);
      const ebookData = response.data.data.ebook;
      
      setEbook({
        title: ebookData.title,
        summary: ebookData.summary,
        category: ebookData.category,
        pages: ebookData.pages,
        coverColor: ebookData.coverColor,
        iconName: ebookData.iconName,
        downloadType: ebookData.downloadType,
        externalUrl: ebookData.externalUrl,
        metaTitle: ebookData.metaTitle,
        metaDescription: ebookData.metaDescription,
        status: ebookData.status,
        fileUrl: ebookData.fileUrl,
        fileName: ebookData.fileName,
        downloadCount: ebookData.downloadCount,
      });
    } catch (err: any) {
      console.error('Failed to fetch ebook:', err);
      setError(err.response?.data?.message || 'Failed to load e-book');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit E-book</h1>
        <p className="text-gray-500 mt-1">Update e-book details and content</p>
      </div>
      <EbookForm ebookId={id} initialData={ebook} />
    </div>
  );
};

export default EditEbook;