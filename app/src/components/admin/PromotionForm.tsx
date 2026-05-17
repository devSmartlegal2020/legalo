import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Loader2,
  Save,
  Image as ImageIcon,
  Plus,
  Trash2,
  CalendarIcon,
  Gift,
  Megaphone,
  Clock,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { promotionAPI, uploadAPI, categoryAPI, API_BASE_URL } from '@/services/api';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface PromotionFormData {
  title: string;
  subtitle: string;
  description: string;
  fullDescription: string;
  startDate: Date | null;
  endDate: Date | null;
  terms: string[];
  benefits: string[];
  ctaText: string;
  ctaLink: string;
  priority: number;
  showInPopup: boolean;
  popupDelay: number;
  popupDuration: number;
  targetPages: string[];
  targetCategories: string[];
  status: 'draft' | 'published' | 'archived';
  discountType: '' | 'percentage' | 'fixed';
  discountValue: string;
  discountCode: string;
}

interface PromotionFormProps {
  promotionId?: string;
  initialData?: Partial<PromotionFormData> & { image?: string; bannerImage?: string };
}

const AVAILABLE_PAGES = [
  { path: '/', label: 'Home' },
  { path: '/layanan', label: 'Services' },
  { path: '/layanan/pt-cv', label: 'Pendirian PT/CV' },
  { path: '/layanan/oss-nib', label: 'Izin OSS/NIB' },
  { path: '/layanan/trademark', label: 'Pendaftaran Merek' },
  { path: '/layanan/konsultasi', label: 'Konsultasi Hukum' },
  { path: '/tentang-kami', label: 'About' },
  { path: '/events', label: 'Events' },
  { path: '/promo', label: 'Promotions' },
  { path: '/ebook-newsletter', label: 'Ebook Newsletter' },
  { path: '/artikel', label: 'Blog' },
];

const PromotionForm = ({ promotionId, initialData }: PromotionFormProps) => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [image, setImage] = useState(initialData?.image || '');
  const [bannerImage, setBannerImage] = useState(initialData?.bannerImage || '');
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const [formData, setFormData] = useState<PromotionFormData>({
    title: initialData?.title || '',
    subtitle: initialData?.subtitle || '',
    description: initialData?.description || '',
    fullDescription: initialData?.fullDescription || '',
    startDate: initialData?.startDate ? new Date(initialData.startDate) : null,
    endDate: initialData?.endDate ? new Date(initialData.endDate) : null,
    terms: initialData?.terms || [],
    benefits: initialData?.benefits || [],
    ctaText: initialData?.ctaText || 'Claim Offer',
    ctaLink: initialData?.ctaLink || '/promo',
    priority: initialData?.priority || 0,
    showInPopup: initialData?.showInPopup || false,
    popupDelay: initialData?.popupDelay || 2000,
    popupDuration: initialData?.popupDuration || 7000,
    targetPages: initialData?.targetPages || [],
    targetCategories: initialData?.targetCategories || [],
    status: initialData?.status || 'draft',
    discountType: initialData?.discountType || '',
    discountValue: initialData?.discountValue || '',
    discountCode: initialData?.discountCode || '',
  });

  const [termsInput, setTermsInput] = useState('');
  const [benefitsInput, setBenefitsInput] = useState('');

  // Fetch categories for targeting
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await categoryAPI.getAll();
        setCategories(response.data.data.categories || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleImageUpload = async (file: File, type: 'image' | 'banner') => {
    try {
      if (type === 'image') setIsUploading(true);
      else setIsUploadingBanner(true);
      
      const response = await uploadAPI.uploadImage(file);
      if (type === 'image') {
        setImage(response.data.data.url);
      } else {
        setBannerImage(response.data.data.url);
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Failed to upload image');
    } finally {
      if (type === 'image') setIsUploading(false);
      else setIsUploadingBanner(false);
    }
  };

  const addListItem = (field: 'terms' | 'benefits', value: string) => {
    const trimmedValue = value.trim();
    if (!trimmedValue) return;
    
    const currentItems = formData[field];
    if (currentItems.length >= 10) return;
    
    setFormData(prev => ({
      ...prev,
      [field]: [...currentItems, trimmedValue]
    }));
  };

  const removeListItem = (field: 'terms' | 'benefits', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleListInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: 'terms' | 'benefits',
    value: string,
    setInput: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addListItem(field, value);
      setInput('');
    }
  };

  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, startDate: date }));
    } else {
      setFormData(prev => ({ ...prev, startDate: null }));
    }
    setStartDateOpen(false);
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, endDate: date }));
    } else {
      setFormData(prev => ({ ...prev, endDate: null }));
    }
    setEndDateOpen(false);
  };

  const toggleTargetPage = (path: string) => {
    setFormData(prev => {
      const current = prev.targetPages;
      if (current.includes(path)) {
        return { ...prev, targetPages: current.filter(p => p !== path) };
      }
      return { ...prev, targetPages: [...current, path] };
    });
  };

  const toggleTargetCategory = (categoryId: string) => {
    setFormData(prev => {
      const current = prev.targetCategories;
      if (current.includes(categoryId)) {
        return { ...prev, targetCategories: current.filter(c => c !== categoryId) };
      }
      return { ...prev, targetCategories: [...current, categoryId] };
    });
  };

  const handleSubmit = async (saveStatus: 'draft' | 'published' | 'archived') => {
    setError('');
    setIsSaving(true);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('subtitle', formData.subtitle);
      submitData.append('description', formData.description);
      submitData.append('fullDescription', formData.fullDescription);
      submitData.append('startDate', formData.startDate ? formData.startDate.toISOString() : '');
      submitData.append('endDate', formData.endDate ? formData.endDate.toISOString() : '');
      submitData.append('terms', JSON.stringify(formData.terms));
      submitData.append('benefits', JSON.stringify(formData.benefits));
      submitData.append('ctaText', formData.ctaText);
      submitData.append('ctaLink', formData.ctaLink);
      submitData.append('priority', String(formData.priority));
      submitData.append('showInPopup', String(formData.showInPopup));
      submitData.append('popupDelay', String(formData.popupDelay));
      submitData.append('popupDuration', String(formData.popupDuration));
      submitData.append('targetPages', JSON.stringify(formData.targetPages));
      submitData.append('targetCategories', JSON.stringify(formData.targetCategories));
      submitData.append('status', saveStatus);
      submitData.append('discountType', formData.discountType);
      submitData.append('discountValue', formData.discountValue);
      submitData.append('discountCode', formData.discountCode);

      if (image) {
        submitData.append('image', image);
      }
      if (bannerImage) {
        submitData.append('bannerImage', bannerImage);
      }

      if (promotionId) {
        await promotionAPI.update(promotionId, submitData);
      } else {
        await promotionAPI.create(submitData);
      }

      navigate('/admin/promotions');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save promotion');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof PromotionFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="dates">Dates & Duration</TabsTrigger>
          <TabsTrigger value="discount">
            <Gift className="h-4 w-4 mr-2" />
            Discount
          </TabsTrigger>
          <TabsTrigger value="popup">
            <Megaphone className="h-4 w-4 mr-2" />
            Popup
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Promotion Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g., Special Discount for New Members"
              required
            />
          </div>

          {/* Subtitle */}
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={formData.subtitle}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              placeholder="e.g., Limited Time Offer"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Short Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Brief description of the promotion"
              rows={2}
              required
            />
          </div>

          {/* Full Description */}
          <div className="space-y-2">
            <Label htmlFor="fullDescription">Full Description</Label>
            <Textarea
              id="fullDescription"
              value={formData.fullDescription}
              onChange={(e) => handleChange('fullDescription', e.target.value)}
              placeholder="Detailed description with all the details"
              rows={4}
            />
          </div>

          {/* CTA */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ctaText">CTA Button Text</Label>
              <Input
                id="ctaText"
                value={formData.ctaText}
                onChange={(e) => handleChange('ctaText', e.target.value)}
                placeholder="e.g., Claim Offer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ctaLink">CTA Link</Label>
              <Input
                id="ctaLink"
                value={formData.ctaLink}
                onChange={(e) => handleChange('ctaLink', e.target.value)}
                placeholder="e.g., /promo/special-offer"
              />
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priority (Higher = Shown First)</Label>
            <Input
              id="priority"
              type="number"
              value={formData.priority}
              onChange={(e) => handleChange('priority', parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </div>

          {/* Terms */}
          <div className="space-y-3">
            <Label>Terms & Conditions <span className="text-xs text-muted-foreground">(max 10 items)</span></Label>
            <div className="space-y-2">
              {formData.terms.length > 0 && (
                <div className="space-y-1">
                  {formData.terms.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2 p-2 bg-muted rounded-md text-sm"
                    >
                      <span className="flex-1">{item}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeListItem('terms', index)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2">
                <Input
                  value={termsInput}
                  onChange={(e) => setTermsInput(e.target.value)}
                  onKeyDown={(e) => handleListInputKeyDown(e, 'terms', termsInput, setTermsInput)}
                  placeholder="Enter a term..."
                  className="flex-1"
                  disabled={formData.terms.length >= 10}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    addListItem('terms', termsInput);
                    setTermsInput('');
                  }}
                  disabled={!termsInput.trim() || formData.terms.length >= 10}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-3">
            <Label>Benefits <span className="text-xs text-muted-foreground">(max 10 items)</span></Label>
            <div className="space-y-2">
              {formData.benefits.length > 0 && (
                <div className="space-y-1">
                  {formData.benefits.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2 p-2 bg-muted rounded-md text-sm"
                    >
                      <span className="flex-1">{item}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeListItem('benefits', index)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2">
                <Input
                  value={benefitsInput}
                  onChange={(e) => setBenefitsInput(e.target.value)}
                  onKeyDown={(e) => handleListInputKeyDown(e, 'benefits', benefitsInput, setBenefitsInput)}
                  placeholder="Enter a benefit..."
                  className="flex-1"
                  disabled={formData.benefits.length >= 10}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    addListItem('benefits', benefitsInput);
                    setBenefitsInput('');
                  }}
                  disabled={!benefitsInput.trim() || formData.benefits.length >= 10}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="dates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date */}
            <div className="space-y-2">
              <Label>Start Date *</Label>
              <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-11",
                      !formData.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                    {formData.startDate ? (
                      <span className="truncate">
                        {formData.startDate.toLocaleDateString('id-ID', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    ) : (
                      "Select start date"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.startDate || undefined}
                    onSelect={handleStartDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label>End Date *</Label>
              <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-11",
                      !formData.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                    {formData.endDate ? (
                      <span className="truncate">
                        {formData.endDate.toLocaleDateString('id-ID', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    ) : (
                      "Select end date"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.endDate || undefined}
                    onSelect={handleEndDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Media */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Promotion Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Image */}
              <div className="space-y-2">
                <Label>Main Image *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {image ? (
                    <div className="space-y-4">
                      <img
                        src={`${API_BASE_URL}${image}`}
                        alt="Promotion"
                        className="max-h-48 mx-auto rounded-lg object-cover"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setImage('')}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <ImageIcon className="h-10 w-10 mx-auto text-gray-400" />
                      <div>
                        <label className="cursor-pointer">
                          <Input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, 'image');
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
                      <p className="text-xs text-gray-500">
                        Recommended: 800x600px
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Banner Image */}
              <div className="space-y-2">
                <Label>Banner Image (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {bannerImage ? (
                    <div className="space-y-4">
                      <img
                        src={`${API_BASE_URL}${bannerImage}`}
                        alt="Banner"
                        className="max-h-32 mx-auto rounded-lg object-cover"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setBannerImage('')}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <ImageIcon className="h-10 w-10 mx-auto text-gray-400" />
                      <div>
                        <label className="cursor-pointer">
                          <Input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, 'banner');
                            }}
                            disabled={isUploadingBanner}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            disabled={isUploadingBanner}
                            asChild
                          >
                            <span>
                              {isUploadingBanner ? 'Uploading...' : 'Upload Banner'}
                            </span>
                          </Button>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">
                        Recommended: 1920x400px (wide banner)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discount" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Discount Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <Select
                  value={formData.discountType || 'none'}
                  onValueChange={(value) => handleChange('discountType', value === 'none' ? '' : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select discount type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Discount</SelectItem>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount (IDR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.discountType && (
                <>
                  <div className="space-y-2">
                    <Label>Discount Value</Label>
                    <Input
                      type="number"
                      value={formData.discountValue}
                      onChange={(e) => handleChange('discountValue', e.target.value)}
                      placeholder={formData.discountType === 'percentage' ? "e.g., 20" : "e.g., 50000"}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Promo Code (Optional)</Label>
                    <Input
                      value={formData.discountCode}
                      onChange={(e) => handleChange('discountCode', e.target.value)}
                      placeholder="e.g., SPECIAL20"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="popup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5" />
                Popup Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="showInPopup"
                  checked={formData.showInPopup}
                  onCheckedChange={(checked) => handleChange('showInPopup', checked)}
                />
                <Label htmlFor="showInPopup">Show this promotion in popup</Label>
              </div>

              {formData.showInPopup && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="popupDelay">
                        <Clock className="h-4 w-4 inline mr-1" />
                        Delay (ms)
                      </Label>
                      <Input
                        id="popupDelay"
                        type="number"
                        value={formData.popupDelay}
                        onChange={(e) => handleChange('popupDelay', parseInt(e.target.value) || 0)}
                        placeholder="2000"
                      />
                      <p className="text-xs text-gray-500">Delay before popup appears</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="popupDuration">
                        <Clock className="h-4 w-4 inline mr-1" />
                        Duration (ms)
                      </Label>
                      <Input
                        id="popupDuration"
                        type="number"
                        value={formData.popupDuration}
                        onChange={(e) => handleChange('popupDuration', parseInt(e.target.value) || 0)}
                        placeholder="7000"
                      />
                      <p className="text-xs text-gray-500">How long popup stays open</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {formData.showInPopup && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Targeting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">Target Pages</Label>
                    <span className="text-xs text-muted-foreground">
                      {formData.targetPages.length === 0 ? 'Show on all pages' : `${formData.targetPages.length} page(s) selected`}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Select specific pages where this popup should appear. Leave empty to show on all pages.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {AVAILABLE_PAGES.map((page) => (
                      <div key={page.path} className="flex items-center space-x-2">
                        <Checkbox
                          id={`page-${page.path}`}
                          checked={formData.targetPages.includes(page.path)}
                          onCheckedChange={() => toggleTargetPage(page.path)}
                        />
                        <Label
                          htmlFor={`page-${page.path}`}
                          className="text-sm cursor-pointer"
                        >
                          {page.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">Target Blog Categories</Label>
                    <span className="text-xs text-muted-foreground">
                      {formData.targetCategories.length === 0 ? 'All categories' : `${formData.targetCategories.length} categor${formData.targetCategories.length === 1 ? 'y' : 'ies'} selected`}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Select blog categories to target. The popup will appear on blog pages in these categories. Leave empty to target all categories.
                  </p>
                  {isLoadingCategories ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading categories...
                    </div>
                  ) : categories.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No categories available.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {categories.map((category) => (
                        <div key={category._id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`cat-${category._id}`}
                            checked={formData.targetCategories.includes(category._id)}
                            onCheckedChange={() => toggleTargetCategory(category._id)}
                          />
                          <Label
                            htmlFor={`cat-${category._id}`}
                            className="text-sm cursor-pointer"
                          >
                            {category.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {!formData.showInPopup && (
            <div className="text-sm text-muted-foreground text-center py-4">
              Enable "Show this promotion in popup" above to configure targeting options.
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/admin/promotions')}
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
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          Save as Draft
        </Button>
        <Button
          type="button"
          onClick={() => handleSubmit('published')}
          disabled={isSaving}
        >
          {isSaving && formData.status === 'published' ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          <Save className="h-4 w-4 mr-2" />
          Publish
        </Button>
      </div>
    </form>
  );
};

export default PromotionForm;
