import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, Download, FileText, BookOpen, Shield, Briefcase, Link2, Upload } from 'lucide-react';
import { ebookAPI } from '@/services/api';

// Available icon options
const ICON_OPTIONS = [
  { value: 'FileText', label: 'Document', icon: FileText },
  { value: 'BookOpen', label: 'Book', icon: BookOpen },
  { value: 'Shield', label: 'Shield', icon: Shield },
  { value: 'Briefcase', label: 'Briefcase', icon: Briefcase },
];

// Available color options
const COLOR_OPTIONS = [
  { value: 'from-blue-600 to-blue-800', label: 'Blue', bgColor: 'bg-blue-100 text-blue-700' },
  { value: 'from-purple-600 to-purple-800', label: 'Purple', bgColor: 'bg-purple-100 text-purple-700' },
  { value: 'from-green-600 to-green-800', label: 'Green', bgColor: 'bg-green-100 text-green-700' },
  { value: 'from-orange-600 to-orange-800', label: 'Orange', bgColor: 'bg-orange-100 text-orange-700' },
  { value: 'from-teal-600 to-teal-800', label: 'Teal', bgColor: 'bg-teal-100 text-teal-700' },
  { value: 'from-red-600 to-red-800', label: 'Red', bgColor: 'bg-red-100 text-red-700' },
];

interface EbookFormData {
  title: string;
  summary: string;
  category: string;
  pages: number;
  coverColor: string;
  iconName: string;
  downloadType: 'upload' | 'external';
  externalUrl: string;
  metaTitle: string;
  metaDescription: string;
  status: 'draft' | 'published';
}

interface EbookFormProps {
  ebookId?: string;
  initialData?: Partial<EbookFormData> & { fileUrl?: string; fileName?: string; downloadCount?: number };
}

const EbookForm = ({ ebookId, initialData }: EbookFormProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [existingFile, setExistingFile] = useState(initialData?.fileUrl ? { url: initialData.fileUrl, name: initialData.fileName || 'file.pdf' } : null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<EbookFormData>({
    title: initialData?.title || '',
    summary: initialData?.summary || '',
    category: initialData?.category || '',
    pages: initialData?.pages || 0,
    coverColor: initialData?.coverColor || 'from-blue-600 to-blue-800',
    iconName: initialData?.iconName || 'FileText',
    downloadType: initialData?.downloadType || 'external',
    externalUrl: initialData?.externalUrl || '',
    metaTitle: initialData?.metaTitle || '',
    metaDescription: initialData?.metaDescription || '',
    status: initialData?.status || 'draft',
  });

  const handleChange = (field: keyof EbookFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setUploadedFile(file);
        setExistingFile(null);
      } else {
        setError('Please upload a PDF file');
      }
    }
  };

  const handleSubmit = async (saveStatus: 'draft' | 'published') => {
    setError('');
    setIsSaving(true);

    try {
      const submitData = new FormData();
      
      submitData.append('title', formData.title);
      submitData.append('summary', formData.summary);
      submitData.append('category', formData.category);
      submitData.append('pages', formData.pages.toString());
      submitData.append('coverColor', formData.coverColor);
      submitData.append('iconName', formData.iconName);
      submitData.append('downloadType', formData.downloadType);
      submitData.append('externalUrl', formData.externalUrl);
      submitData.append('metaTitle', formData.metaTitle);
      submitData.append('metaDescription', formData.metaDescription);
      submitData.append('status', saveStatus);

      if (uploadedFile) {
        submitData.append('file', uploadedFile);
      }

      if (ebookId) {
        await ebookAPI.update(ebookId, submitData);
      } else {
        await ebookAPI.create(submitData);
      }

      navigate('/admin/ebooks');
    } catch (err: any) {
      console.error('Failed to save ebook:', err);
      setError(err.response?.data?.message || 'Failed to save e-book');
    } finally {
      setIsSaving(false);
    }
  };

  const SelectedIcon = ICON_OPTIONS.find(i => i.value === formData.iconName)?.icon || FileText;

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="download">Download Options</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>E-book Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Enter e-book title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Summary *</Label>
                <Textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => handleChange('summary', e.target.value)}
                  placeholder="Enter a brief summary of the e-book"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    placeholder="e.g., Pendirian Perusahaan"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pages">Pages *</Label>
                  <Input
                    id="pages"
                    type="number"
                    value={formData.pages}
                    onChange={(e) => handleChange('pages', parseInt(e.target.value) || 0)}
                    placeholder="Number of pages"
                    min={1}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Icon</Label>
                  <Select
                    value={formData.iconName}
                    onValueChange={(value) => handleChange('iconName', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent>
                      {ICON_OPTIONS.map((icon) => (
                        <SelectItem key={icon.value} value={icon.value}>
                          <div className="flex items-center gap-2">
                            <icon.icon className="w-4 h-4" />
                            <span>{icon.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Cover Color</Label>
                  <Select
                    value={formData.coverColor}
                    onValueChange={(value) => handleChange('coverColor', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      {COLOR_OPTIONS.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded ${color.bgColor.split(' ')[0]}`} />
                            <span>{color.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview Card */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`h-48 bg-gradient-to-br ${formData.coverColor} p-6 rounded-lg flex flex-col justify-between relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                
                <div className="relative z-10">
                  <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-white/90 text-gray-800">
                    {formData.category || 'Category'}
                  </span>
                </div>
                
                <div className="relative z-10">
                  <SelectedIcon className="w-12 h-12 text-white/80" strokeWidth={1.5} />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold text-lg">{formData.title || 'E-book Title'}</h3>
                <p className="text-sm text-gray-500 mt-1">{formData.pages} pages</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="download" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Download Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Download Type</Label>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={formData.downloadType === 'external' ? 'default' : 'outline'}
                    onClick={() => handleChange('downloadType', 'external')}
                    className="flex-1"
                  >
                    <Link2 className="w-4 h-4 mr-2" />
                    External URL
                  </Button>
                  <Button
                    type="button"
                    variant={formData.downloadType === 'upload' ? 'default' : 'outline'}
                    onClick={() => handleChange('downloadType', 'upload')}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload PDF
                  </Button>
                </div>
              </div>

              {formData.downloadType === 'external' ? (
                <div className="space-y-2">
                  <Label htmlFor="externalUrl">External Download URL</Label>
                  <Input
                    id="externalUrl"
                    type="url"
                    value={formData.externalUrl}
                    onChange={(e) => handleChange('externalUrl', e.target.value)}
                    placeholder="https://example.com/download.pdf"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Upload PDF File</Label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploadedFile ? 'Change File' : 'Select PDF File'}
                    </Button>
                  </div>

                  {uploadedFile && (
                    <div className="p-4 bg-gray-50 rounded-lg flex items-center gap-3">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <div className="flex-1">
                        <p className="font-medium">{uploadedFile.name}</p>
                        <p className="text-sm text-gray-500">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setUploadedFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  )}

                  {existingFile && !uploadedFile && (
                    <div className="p-4 bg-gray-50 rounded-lg flex items-center gap-3">
                      <FileText className="w-8 h-8 text-green-600" />
                      <div className="flex-1">
                        <p className="font-medium">{existingFile.name}</p>
                        <p className="text-sm text-gray-500">Current file</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setExistingFile(null)}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {initialData?.downloadCount !== undefined && (
                <div className="p-4 bg-blue-50 rounded-lg flex items-center gap-3">
                  <Download className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">
                      {initialData.downloadCount} downloads
                    </p>
                    <p className="text-sm text-blue-700">
                      This e-book has been downloaded {initialData.downloadCount} times
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle}
                  onChange={(e) => handleChange('metaTitle', e.target.value)}
                  placeholder="SEO title (optional)"
                />
                <p className="text-sm text-gray-500">
                  {formData.metaTitle.length}/60 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => handleChange('metaDescription', e.target.value)}
                  placeholder="SEO description (optional)"
                  rows={3}
                />
                <p className="text-sm text-gray-500">
                  {formData.metaDescription.length}/160 characters
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/admin/ebooks')}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSubmit('draft')}
          disabled={isSaving}
        >
          {isSaving && formData.status === 'draft' ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save as Draft
        </Button>
        <Button
          type="button"
          onClick={() => handleSubmit('published')}
          disabled={isSaving}
        >
          {isSaving && formData.status === 'published' ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Publish
        </Button>
      </div>
    </div>
  );
};

export default EbookForm;
