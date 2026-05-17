import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, Eye } from 'lucide-react';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { ctaAPI, type CTA } from '@/services/api';

interface CTAFormData {
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  backgroundColor: string;
  textColor: string;
  buttonBackgroundColor: string;
  buttonTextColor: string;
  isActive: boolean;
}

interface CTAFormProps {
  ctaId?: string;
  initialData?: Partial<CTAFormData>;
}

const CTAForm = ({ ctaId, initialData }: CTAFormProps) => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<CTAFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    buttonText: initialData?.buttonText || 'Learn More',
    buttonUrl: initialData?.buttonUrl || '#',
    backgroundColor: initialData?.backgroundColor || '#1a1a2e',
    textColor: initialData?.textColor || '#ffffff',
    buttonBackgroundColor: initialData?.buttonBackgroundColor || '#D93A3A',
    buttonTextColor: initialData?.buttonTextColor || '#ffffff',
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
  });

  const handleSubmit = async () => {
    setError('');
    setIsSaving(true);

    try {
      if (ctaId) {
        await ctaAPI.update(ctaId, formData);
      } else {
        await ctaAPI.create(formData);
      }
      navigate('/admin/ctas');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save CTA');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof CTAFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>CTA Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Enter CTA title"
                />
              </div>

              <div className="space-y-2">
                <Label>Description *</Label>
                <RichTextEditor
                  content={formData.description}
                  onChange={(content) => handleChange('description', content)}
                  placeholder="Write your CTA description here..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="buttonText">Button Text *</Label>
                  <Input
                    id="buttonText"
                    value={formData.buttonText}
                    onChange={(e) => handleChange('buttonText', e.target.value)}
                    placeholder="e.g. Get Started"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buttonUrl">Button URL *</Label>
                  <Input
                    id="buttonUrl"
                    value={formData.buttonUrl}
                    onChange={(e) => handleChange('buttonUrl', e.target.value)}
                    placeholder="e.g. /contact or https://..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Styling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="backgroundColor">Background Color</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      id="backgroundColor"
                      value={formData.backgroundColor}
                      onChange={(e) => handleChange('backgroundColor', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                    />
                    <Input
                      value={formData.backgroundColor}
                      onChange={(e) => handleChange('backgroundColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="textColor">Text Color</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      id="textColor"
                      value={formData.textColor}
                      onChange={(e) => handleChange('textColor', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                    />
                    <Input
                      value={formData.textColor}
                      onChange={(e) => handleChange('textColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buttonBackgroundColor">Button Background Color</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      id="buttonBackgroundColor"
                      value={formData.buttonBackgroundColor}
                      onChange={(e) => handleChange('buttonBackgroundColor', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                    />
                    <Input
                      value={formData.buttonBackgroundColor}
                      onChange={(e) => handleChange('buttonBackgroundColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buttonTextColor">Button Text Color</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      id="buttonTextColor"
                      value={formData.buttonTextColor}
                      onChange={(e) => handleChange('buttonTextColor', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                    />
                    <Input
                      value={formData.buttonTextColor}
                      onChange={(e) => handleChange('buttonTextColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleChange('isActive', checked)}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              <p className="text-sm text-gray-500">
                Inactive CTAs won't appear on blog posts.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="rounded-xl p-6 text-center"
                style={{
                  backgroundColor: formData.backgroundColor,
                  color: formData.textColor,
                }}
              >
                <h3 className="font-bold text-lg mb-2">{formData.title || 'CTA Title'}</h3>
                <div
                  className="text-sm mb-4 opacity-90"
                  dangerouslySetInnerHTML={{
                    __html: formData.description || '<p>Your description will appear here.</p>',
                  }}
                />
                <span
                  className="inline-block px-4 py-2 rounded-lg font-medium text-sm"
                  style={{
                    backgroundColor: formData.buttonBackgroundColor,
                    color: formData.buttonTextColor,
                  }}
                >
                  {formData.buttonText}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleSubmit}
              disabled={isSaving}
              className="w-full"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {ctaId ? 'Update CTA' : 'Create CTA'}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/admin/ctas')}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTAForm;
