import React, { useState, useEffect } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Loader2, Save, Eye, Image as ImageIcon, Calendar as CalendarIcon, Clock, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import RichTextEditor from './RichTextEditor';
import KeywordRecommendations from './KeywordRecommendations';
import { blogAPI, categoryAPI, ctaAPI, uploadAPI, type CTA } from '@/services/api';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface BlogFormData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  status: 'draft' | 'published' | 'scheduled';
  tags: string;
  isFeatured: boolean;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl: string;
  scheduledPublishAt?: string;
  cta: string;
}

interface BlogFormProps {
  blogId?: string;
  initialData?: Partial<Omit<BlogFormData, 'cta'>> & { featuredImage?: string; scheduledPublishAt?: string; cta?: string | { _id?: string } };
}

const BlogForm = ({ blogId, initialData }: BlogFormProps) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [ctas, setCTAs] = useState<CTA[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage || '');
  const [isUploading, setIsUploading] = useState(false);
  
  // Keyword recommendations state
  const [showKeywordModal, setShowKeywordModal] = useState(false);
  const [keywordLoading, setKeywordLoading] = useState(false);
  const [keywordLoadingStep, setKeywordLoadingStep] = useState(0);
  const [keywordError, setKeywordError] = useState<string | null>(null);
  const [keywordRecommendations, setKeywordRecommendations] = useState<any[]>([]);
  const [keywordSource, setKeywordSource] = useState('');

  const getInitialCtaId = () => {
    if (!initialData?.cta) return '';
    if (typeof initialData.cta === 'string') return initialData.cta;
    return initialData.cta._id || '';
  };

  const [formData, setFormData] = useState<BlogFormData>({
    title: initialData?.title || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    category: initialData?.category || '',
    status: initialData?.status || 'draft',
    tags: initialData?.tags || '',
    isFeatured: initialData?.isFeatured || false,
    metaTitle: initialData?.metaTitle || '',
    metaDescription: initialData?.metaDescription || '',
    metaKeywords: initialData?.metaKeywords || '',
    canonicalUrl: initialData?.canonicalUrl || '',
    scheduledPublishAt: initialData?.scheduledPublishAt || '',
    cta: getInitialCtaId(),
  });

  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(
    initialData?.scheduledPublishAt ? new Date(initialData.scheduledPublishAt) : undefined
  );
  const [scheduleTime, setScheduleTime] = useState(
    initialData?.scheduledPublishAt
      ? format(new Date(initialData.scheduledPublishAt), 'HH:mm')
      : '09:00'
  );

  useEffect(() => {
    fetchCategories();
    fetchCTAs();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data.data.categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchCTAs = async () => {
    try {
      const response = await ctaAPI.getActive();
      setCTAs(response.data.data.ctas);
    } catch (error) {
      console.error('Failed to fetch CTAs:', error);
    }
  };

  const handleGetRecommendations = async () => {
    // Validate minimum content length
    const plainText = formData.content.replace(/<[^\u003e]*>/g, '').trim();
    if (formData.title.length < 5 || plainText.length < 100) {
      setError('Please write a title (min 5 chars) and content (min 100 chars) before getting recommendations.');
      return;
    }

    setKeywordLoading(true);
    setKeywordLoadingStep(0);
    setKeywordError(null);
    setKeywordRecommendations([]);
    setShowKeywordModal(true);

    try {
      setKeywordLoadingStep(0);
      
      const response = await blogAPI.recommendKeywords({
        title: formData.title,
        content: formData.content,
        country: 'id',
        maxKeywords: 10,
      });

      setKeywordLoadingStep(1);
      
      if (response.data.success) {
        setKeywordRecommendations(response.data.data.keywords);
        setKeywordSource(response.data.data.source);
        setKeywordLoadingStep(2);
      }
    } catch (err: any) {
      console.error('Failed to get recommendations:', err);
      setKeywordError(
        err.response?.data?.message || 'Failed to generate keyword recommendations'
      );
    } finally {
      setKeywordLoading(false);
    }
  };

  const handleApplyKeywords = (selectedKeywords: string[]) => {
    const currentKeywords = formData.metaKeywords
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    // Merge with existing keywords, removing duplicates
    const mergedKeywords = [...new Set([...currentKeywords, ...selectedKeywords])];
    
    handleChange('metaKeywords', mergedKeywords.join(', '));
  };

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const response = await uploadAPI.uploadImage(file);
      setFeaturedImage(response.data.data.url);
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (saveStatus: 'draft' | 'published' | 'scheduled', unschedule = false) => {
    setError('');
    setValidationErrors([]);
    setIsSaving(true);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('excerpt', formData.excerpt);
      submitData.append('content', formData.content);
      submitData.append('category', formData.category);
      submitData.append('status', saveStatus);
      submitData.append('tags', formData.tags);
      submitData.append('isFeatured', String(formData.isFeatured));
      submitData.append('metaTitle', formData.metaTitle || formData.title);
      submitData.append('metaDescription', formData.metaDescription || formData.excerpt);
      submitData.append('metaKeywords', formData.metaKeywords);
      submitData.append('canonicalUrl', formData.canonicalUrl);
      submitData.append('cta', formData.cta);

      // Handle scheduled publish date
      if (saveStatus === 'scheduled' && scheduleDate && !unschedule) {
        const [hours, minutes] = scheduleTime.split(':').map(Number);
        const scheduledDateTime = new Date(scheduleDate);
        scheduledDateTime.setHours(hours, minutes, 0, 0);
        submitData.append('scheduledPublishAt', scheduledDateTime.toISOString());
      } else if (unschedule) {
        // Clear scheduled date when unscheduling
        submitData.append('scheduledPublishAt', '');
      }

      // Append featured image URL (already uploaded)
      if (featuredImage) {
        submitData.append('featuredImage', featuredImage);
      }

      if (blogId) {
        await blogAPI.update(blogId, submitData);
      } else {
        await blogAPI.create(submitData);
      }

      navigate('/admin/blogs');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to save blog';
      const errors = err.response?.data?.errors || [];
      setError(message);
      if (errors.length > 0) {
        setValidationErrors(
          errors.map((e: any) => {
            const field = e.path || e.param || 'Field';
            const msg = e.msg || e.message || String(e);
            return `${field}: ${msg}`;
          })
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof BlogFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear validation errors when user starts fixing fields
    if (validationErrors.length > 0) {
      setValidationErrors([]);
      setError('');
    }
  };

  return (
    <form className="space-y-6">
      {(error || validationErrors.length > 0) && (
        <Alert variant="destructive">
          <AlertDescription>
            <div className="space-y-2">
              {error && <p className="font-semibold">{error}</p>}
              {validationErrors.length > 0 && (
                <ul className="list-disc pl-4 space-y-1">
                  {validationErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter blog title"
              required
            />
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt *</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => handleChange('excerpt', e.target.value)}
              placeholder="Brief summary of the blog post"
              rows={3}
              required
            />
            <p className="text-xs text-gray-500">
              {formData.excerpt.length}/500 characters
            </p>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* CTA Override */}
          <div className="space-y-2">
            <Label htmlFor="cta">CTA Override</Label>
            <Select
              value={formData.cta || undefined}
              onValueChange={(value) => handleChange('cta', value || '')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Use category default" />
              </SelectTrigger>
              <SelectContent>
                {ctas.map((cta) => (
                  <SelectItem key={cta._id} value={cta._id}>
                    {cta.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Leave empty to use the category's default CTA.
            </p>
          </div>

          {/* Content Editor */}
          <div className="space-y-2">
            <Label>Content *</Label>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => handleChange('content', content)}
              placeholder="Write your blog content here..."
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => handleChange('tags', e.target.value)}
              placeholder="legal, business, startup"
            />
          </div>

          {/* Featured Post */}
          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.isFeatured}
              onCheckedChange={(checked) => handleChange('isFeatured', checked)}
            />
            <Label htmlFor="featured">Mark as featured post</Label>
          </div>

          {/* Scheduling */}
          <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Schedule Publication</span>
            </div>

            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-2">
                <Label>Publish Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-[240px] justify-start text-left font-normal',
                        !scheduleDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {scheduleDate ? format(scheduleDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={scheduleDate}
                      onSelect={setScheduleDate}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="schedule-time">Publish Time</Label>
                <Input
                  id="schedule-time"
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-[140px]"
                />
              </div>

              {initialData?.status === 'scheduled' && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setScheduleDate(undefined);
                    handleSubmit('draft', true);
                  }}
                  disabled={isSaving}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Remove Schedule
                </Button>
              )}
            </div>

            {initialData?.status === 'scheduled' && initialData?.scheduledPublishAt && (
              <p className="text-sm text-muted-foreground">
                Currently scheduled for:{' '}
                <span className="font-medium text-foreground">
                  {format(new Date(initialData.scheduledPublishAt), 'PPP p')}
                </span>
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Featured Image
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                {featuredImage ? (
                  <div className="space-y-4">
                    <img
                      src={`http://localhost:5000${featuredImage}`}
                      alt="Featured"
                      className="max-h-64 mx-auto rounded-lg object-cover"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setFeaturedImage('')}
                    >
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
                    <div>
                      <label className="cursor-pointer">
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file);
                          }}
                          disabled={isUploading}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          disabled={isUploading}
                          asChild
                        >
                          <span>
                            {isUploading ? 'Uploading...' : 'Upload Image'}
                          </span>
                        </Button>
                      </label>
                    </div>
                    <p className="text-sm text-gray-500">
                      Recommended size: 1200x630px
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Meta Title */}
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle}
                  onChange={(e) => handleChange('metaTitle', e.target.value)}
                  placeholder="Leave empty to use blog title"
                />
                <p className="text-xs text-gray-500">
                  Recommended: 50-60 characters
                </p>
              </div>

              {/* Meta Description */}
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => handleChange('metaDescription', e.target.value)}
                  placeholder="Leave empty to use excerpt"
                  rows={3}
                />
                <p className="text-xs text-gray-500">
                  Recommended: 150-160 characters
                </p>
              </div>

              {/* Meta Keywords */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="metaKeywords">Meta Keywords (comma separated)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGetRecommendations}
                    disabled={keywordLoading}
                    className="gap-1"
                  >
                    {keywordLoading ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Sparkles className="h-3 w-3" />
                    )}
                    Get Recommendations
                  </Button>
                </div>
                <Input
                  id="metaKeywords"
                  value={formData.metaKeywords}
                  onChange={(e) => handleChange('metaKeywords', e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>

              {/* Canonical URL */}
              <div className="space-y-2">
                <Label htmlFor="canonicalUrl">Canonical URL</Label>
                <Input
                  id="canonicalUrl"
                  value={formData.canonicalUrl}
                  onChange={(e) => handleChange('canonicalUrl', e.target.value)}
                  placeholder="https://example.com/original-post"
                />
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
          onClick={() => navigate('/admin/blogs')}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSubmit('draft')}
          disabled={isSaving}
        >
          {isSaving && !scheduleDate ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          Save as Draft
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSubmit('scheduled')}
          disabled={isSaving || !scheduleDate}
          title={!scheduleDate ? 'Select a date and time to schedule' : undefined}
        >
          {isSaving && scheduleDate ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Clock className="h-4 w-4 mr-2" />
          )}
          Schedule
        </Button>
        <Button
          type="button"
          onClick={() => handleSubmit('published')}
          disabled={isSaving}
        >
          {isSaving && !scheduleDate ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          <Save className="h-4 w-4 mr-2" />
          Publish Now
        </Button>
      </div>

      {/* Keyword Recommendations Modal */}
      <KeywordRecommendations
        isOpen={showKeywordModal}
        onClose={() => setShowKeywordModal(false)}
        keywords={keywordRecommendations}
        isLoading={keywordLoading}
        loadingStep={keywordLoadingStep}
        error={keywordError}
        source={keywordSource}
        onApply={handleApplyKeywords}
      />
    </form>
  );
};

export default BlogForm;
