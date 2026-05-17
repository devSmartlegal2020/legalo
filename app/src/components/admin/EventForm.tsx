import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Loader2,
  Save,
  Image as ImageIcon,
  Plus,
  Trash2,
  Users,
  CalendarIcon,
  MapPin,
  DollarSign,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { eventAPI, uploadAPI } from '@/services/api';

interface Speaker {
  name: string;
  role: string;
  bio: string;
  image: string;
}

interface AgendaItem {
  time: string;
  title: string;
  description: string;
}

interface EventFormData {
  title: string;
  description: string;
  fullDescription: string;
  whatYoullLearn: string[];
  targetAudience: string[];
  startDateTime: Date | null;
  endDateTime: Date | null;
  location: string;
  isOnline: boolean;
  platform: string;
  venue: string;
  venueAddress: string;
  type: 'Webinar' | 'Workshop' | 'Networking' | 'Clinic';
  category: string;
  price: number;
  currency: string;
  originalPrice: number | null;
  attendees: number;
  seatsAvailable: number;
  registrationLink: string;
  prerequisites: string[];
  materials: string[];
  featured: boolean;
  status: 'draft' | 'published';
}

interface EventFormProps {
  eventId?: string;
  initialData?: Partial<EventFormData> & { image?: string; speakers?: Speaker[]; agenda?: AgendaItem[] };
}

// Helper function to calculate duration between two dates
const calculateDuration = (start: Date | null, end: Date | null): string => {
  if (!start || !end) return '';
  
  const diffMs = end.getTime() - start.getTime();
  if (diffMs <= 0) return '';
  
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffHours === 0) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`;
  } else if (diffMinutes === 0) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
  } else {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`;
  }
};

// Helper function to format date for display
const formatDateForDisplay = (date: Date | null): string => {
  if (!date) return '';
  return format(date, 'PPP'); // e.g., "April 10, 2026"
};

// Helper function to format time for display
const formatTimeForDisplay = (date: Date | null): string => {
  if (!date) return '';
  return format(date, 'HH:mm'); // 24-hour format
};

const EventForm = ({ eventId, initialData }: EventFormProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [image, setImage] = useState(initialData?.image || '');
  const [isUploading, setIsUploading] = useState(false);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const [formData, setFormData] = useState<EventFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    fullDescription: initialData?.fullDescription || '',
    whatYoullLearn: initialData?.whatYoullLearn || [],
    targetAudience: initialData?.targetAudience || [],
    startDateTime: initialData?.startDateTime ? new Date(initialData.startDateTime) : null,
    endDateTime: initialData?.endDateTime ? new Date(initialData.endDateTime) : null,
    location: initialData?.location || '',
    isOnline: initialData?.isOnline || false,
    platform: initialData?.platform || '',
    venue: initialData?.venue || '',
    venueAddress: initialData?.venueAddress || '',
    type: initialData?.type || 'Webinar',
    category: initialData?.category || '',
    price: initialData?.price || 0,
    currency: initialData?.currency || 'IDR',
    originalPrice: initialData?.originalPrice || null,
    attendees: initialData?.attendees || 0,
    seatsAvailable: initialData?.seatsAvailable || 0,
    registrationLink: initialData?.registrationLink || '',
    prerequisites: initialData?.prerequisites || [],
    materials: initialData?.materials || [],
    featured: initialData?.featured || false,
    status: initialData?.status || 'draft',
  });

  const [speakers, setSpeakers] = useState<Speaker[]>(initialData?.speakers || []);
  const [agenda, setAgenda] = useState<AgendaItem[]>(initialData?.agenda || []);

  // Input states for list fields
  const [whatYoullLearnInput, setWhatYoullLearnInput] = useState('');
  const [targetAudienceInput, setTargetAudienceInput] = useState('');
  const [prerequisitesInput, setPrerequisitesInput] = useState('');
  const [materialsInput, setMaterialsInput] = useState('');

  // Calculate duration whenever start or end datetime changes
  const duration = calculateDuration(formData.startDateTime, formData.endDateTime);

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const response = await uploadAPI.uploadImage(file);
      setImage(response.data.data.url);
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const addSpeaker = () => {
    setSpeakers([...speakers, { name: '', role: '', bio: '', image: '' }]);
  };

  const updateSpeaker = (index: number, field: keyof Speaker, value: string) => {
    const updated = [...speakers];
    updated[index] = { ...updated[index], [field]: value };
    setSpeakers(updated);
  };

  const removeSpeaker = (index: number) => {
    setSpeakers(speakers.filter((_, i) => i !== index));
  };

  const addAgendaItem = () => {
    setAgenda([...agenda, { time: '', title: '', description: '' }]);
  };

  const updateAgendaItem = (index: number, field: keyof AgendaItem, value: string) => {
    const updated = [...agenda];
    updated[index] = { ...updated[index], [field]: value };
    setAgenda(updated);
  };

  const removeAgendaItem = (index: number) => {
    setAgenda(agenda.filter((_, i) => i !== index));
  };

  const handleArrayInput = (field: keyof EventFormData, value: string) => {
    const items = value.split('\n').filter(item => item.trim() !== '');
    setFormData(prev => ({ ...prev, [field]: items }));
  };

  // Helper functions for list fields with add/remove
  const addListItem = (field: 'whatYoullLearn' | 'targetAudience' | 'prerequisites' | 'materials', value: string) => {
    const trimmedValue = value.trim();
    if (!trimmedValue) return; // Prevent empty items
    
    const currentItems = formData[field];
    if (currentItems.length >= 5) return; // Maximum 5 items
    
    setFormData(prev => ({
      ...prev,
      [field]: [...currentItems, trimmedValue]
    }));
  };

  const removeListItem = (field: 'whatYoullLearn' | 'targetAudience' | 'prerequisites' | 'materials', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Handle adding items with Enter key
  const handleListInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: 'whatYoullLearn' | 'targetAudience' | 'prerequisites' | 'materials',
    value: string,
    setInput: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addListItem(field, value);
      setInput('');
    }
  };

  // Handle start date change
  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      const currentStart = formData.startDateTime;
      if (currentStart) {
        // Preserve time from current selection
        date.setHours(currentStart.getHours(), currentStart.getMinutes());
      }
      setFormData(prev => ({ ...prev, startDateTime: date }));
    } else {
      setFormData(prev => ({ ...prev, startDateTime: null }));
    }
    setStartDateOpen(false);
  };

  // Handle start time change
  const handleStartTimeChange = (timeValue: string) => {
    if (formData.startDateTime) {
      const [hours, minutes] = timeValue.split(':').map(Number);
      const newDate = new Date(formData.startDateTime);
      newDate.setHours(hours, minutes);
      setFormData(prev => ({ ...prev, startDateTime: newDate }));
    } else {
      // If no date selected, use today with the selected time
      const [hours, minutes] = timeValue.split(':').map(Number);
      const newDate = new Date();
      newDate.setHours(hours, minutes, 0, 0);
      setFormData(prev => ({ ...prev, startDateTime: newDate }));
    }
  };

  // Handle end date change
  const handleEndDateChange = (date: Date | undefined) => {
    if (date) {
      const currentEnd = formData.endDateTime;
      if (currentEnd) {
        // Preserve time from current selection
        date.setHours(currentEnd.getHours(), currentEnd.getMinutes());
      }
      setFormData(prev => ({ ...prev, endDateTime: date }));
    } else {
      setFormData(prev => ({ ...prev, endDateTime: null }));
    }
    setEndDateOpen(false);
  };

  // Handle end time change
  const handleEndTimeChange = (timeValue: string) => {
    if (formData.endDateTime) {
      const [hours, minutes] = timeValue.split(':').map(Number);
      const newDate = new Date(formData.endDateTime);
      newDate.setHours(hours, minutes);
      setFormData(prev => ({ ...prev, endDateTime: newDate }));
    } else {
      // If no date selected, use today with the selected time
      const [hours, minutes] = timeValue.split(':').map(Number);
      const newDate = new Date();
      newDate.setHours(hours, minutes, 0, 0);
      setFormData(prev => ({ ...prev, endDateTime: newDate }));
    }
  };

  const handleSubmit = async (saveStatus: 'draft' | 'published') => {
    setError('');
    setIsSaving(true);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('fullDescription', formData.fullDescription);
      submitData.append('whatYoullLearn', JSON.stringify(formData.whatYoullLearn));
      submitData.append('targetAudience', JSON.stringify(formData.targetAudience));
      
      // Send ISO strings for datetime fields
      submitData.append('startDateTime', formData.startDateTime ? formData.startDateTime.toISOString() : '');
      submitData.append('endDateTime', formData.endDateTime ? formData.endDateTime.toISOString() : '');
      
      submitData.append('location', formData.location);
      submitData.append('isOnline', String(formData.isOnline));
      submitData.append('platform', formData.platform);
      submitData.append('venue', formData.venue);
      submitData.append('venueAddress', formData.venueAddress);
      submitData.append('type', formData.type);
      submitData.append('category', formData.category);
      submitData.append('price', String(formData.price));
      submitData.append('currency', formData.currency);
      submitData.append('originalPrice', formData.originalPrice ? String(formData.originalPrice) : '');
      submitData.append('attendees', String(formData.attendees));
      submitData.append('seatsAvailable', String(formData.seatsAvailable));
      submitData.append('registrationLink', formData.registrationLink);
      submitData.append('prerequisites', JSON.stringify(formData.prerequisites));
      submitData.append('materials', JSON.stringify(formData.materials));
      submitData.append('featured', String(formData.featured));
      submitData.append('status', saveStatus);
      submitData.append('speakers', JSON.stringify(speakers));
      submitData.append('agenda', JSON.stringify(agenda));

      if (image) {
        submitData.append('image', image);
      }

      if (eventId) {
        await eventAPI.update(eventId, submitData);
      } else {
        await eventAPI.create(submitData);
      }

      navigate('/admin/events');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save event');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof EventFormData, value: any) => {
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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="speakers">
            <Users className="h-4 w-4 mr-2" />
            Speakers
          </TabsTrigger>
          <TabsTrigger value="agenda">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Agenda
          </TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter event title"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Short Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Brief description (max 500 chars)"
              rows={2}
              maxLength={500}
              required
            />
            <p className="text-xs text-gray-500">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Full Description */}
          <div className="space-y-2">
            <Label htmlFor="fullDescription">Full Description *</Label>
            <Textarea
              id="fullDescription"
              value={formData.fullDescription}
              onChange={(e) => handleChange('fullDescription', e.target.value)}
              placeholder="Detailed event description"
              rows={6}
              required
            />
          </div>

          {/* Type & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Event Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Webinar">Webinar</SelectItem>
                  <SelectItem value="Workshop">Workshop</SelectItem>
                  <SelectItem value="Networking">Networking</SelectItem>
                  <SelectItem value="Clinic">Clinic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                placeholder="e.g., Startup Legal, HR & Legal"
                required
              />
            </div>
          </div>

          {/* Featured */}
          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => handleChange('featured', checked)}
            />
            <Label htmlFor="featured">Mark as featured event</Label>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          {/* Start & End Datetime - Improved Design */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Datetime */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Start Date & Time</Label>
                <div className="border rounded-lg p-4 bg-card shadow-sm">
                  <div className="space-y-3">
                    {/* Date Selection */}
                    <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal h-11",
                            !formData.startDateTime && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                          {formData.startDateTime ? (
                            <span className="truncate">
                              {formData.startDateTime.toLocaleDateString('en-US', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          ) : (
                            "Select date"
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.startDateTime || undefined}
                          onSelect={handleStartDateChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    
                    {/* Time Selection */}
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                      <Input
                        type="time"
                        value={formData.startDateTime ? formatTimeForDisplay(formData.startDateTime) : ''}
                        onChange={(e) => handleStartTimeChange(e.target.value)}
                        className="flex-1 h-9"
                      />
                    </div>
                    
                    {/* Quick preset buttons for common times */}
                    <div className="flex gap-2 flex-wrap">
                      {['09:00', '10:00', '13:00', '14:00', '19:00'].map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => handleStartTimeChange(time)}
                          className="text-xs px-2 py-1 bg-muted hover:bg-muted/80 rounded-md transition-colors"
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* End Datetime */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">End Date & Time</Label>
                <div className="border rounded-lg p-4 bg-card shadow-sm">
                  <div className="space-y-3">
                    {/* Date Selection */}
                    <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal h-11",
                            !formData.endDateTime && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                          {formData.endDateTime ? (
                            <span className="truncate">
                              {formData.endDateTime.toLocaleDateString('en-US', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          ) : (
                            "Select date"
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.endDateTime || undefined}
                          onSelect={handleEndDateChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    
                    {/* Time Selection */}
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                      <Input
                        type="time"
                        value={formData.endDateTime ? formatTimeForDisplay(formData.endDateTime) : ''}
                        onChange={(e) => handleEndTimeChange(e.target.value)}
                        className="flex-1 h-9"
                      />
                    </div>
                    
                    {/* Quick preset buttons */}
                    <div className="flex gap-2 flex-wrap">
                      {['11:00', '12:00', '15:00', '17:00', '21:00'].map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => handleEndTimeChange(time)}
                          className="text-xs px-2 py-1 bg-muted hover:bg-muted/80 rounded-md transition-colors"
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Duration Display */}
            {duration && (
              <div className="flex items-center justify-center gap-2 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Duration:</span>
                <span className="font-semibold text-primary">{duration}</span>
              </div>
            )}
          </div>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isOnline"
                  checked={formData.isOnline}
                  onCheckedChange={(checked) => handleChange('isOnline', checked)}
                />
                <Label htmlFor="isOnline">This is an online event</Label>
              </div>

              {formData.isOnline ? (
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Input
                    id="platform"
                    value={formData.platform}
                    onChange={(e) => handleChange('platform', e.target.value)}
                    placeholder="e.g., Zoom Meeting"
                  />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      placeholder="e.g., Jakarta Selatan"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="venue">Venue</Label>
                    <Input
                      id="venue"
                      value={formData.venue}
                      onChange={(e) => handleChange('venue', e.target.value)}
                      placeholder="e.g., Legalo.id Office"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="venueAddress">Venue Address</Label>
                    <Input
                      id="venueAddress"
                      value={formData.venueAddress}
                      onChange={(e) => handleChange('venueAddress', e.target.value)}
                      placeholder="Full address"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleChange('price', parseInt(e.target.value) || 0)}
                    placeholder="0 for free"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => handleChange('currency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="IDR" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IDR">IDR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Original Price (for discounts)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    value={formData.originalPrice || ''}
                    onChange={(e) => handleChange('originalPrice', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="Leave empty if no discount"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Capacity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="attendees">Registered Attendees</Label>
              <Input
                id="attendees"
                type="number"
                value={formData.attendees}
                onChange={(e) => handleChange('attendees', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seatsAvailable">Seats Available</Label>
              <Input
                id="seatsAvailable"
                type="number"
                value={formData.seatsAvailable}
                onChange={(e) => handleChange('seatsAvailable', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
          </div>

          {/* Registration Link */}
          <div className="space-y-2">
            <Label htmlFor="registrationLink">Registration Link</Label>
            <Input
              id="registrationLink"
              value={formData.registrationLink}
              onChange={(e) => handleChange('registrationLink', e.target.value)}
              placeholder="https://forms.legalo.id/..."
            />
          </div>

          {/* What You'll Learn */}
          <div className="space-y-3">
            <Label>What You'll Learn <span className="text-xs text-muted-foreground">(max 5 items)</span></Label>
            <div className="space-y-2">
              {/* Display current items */}
              {formData.whatYoullLearn.length > 0 && (
                <div className="space-y-1">
                  {formData.whatYoullLearn.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2 p-2 bg-muted rounded-md text-sm"
                    >
                      <span className="flex-1">{item}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeListItem('whatYoullLearn', index)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add item input */}
              <div className="flex gap-2">
                <Input
                  value={whatYoullLearnInput}
                  onChange={(e) => setWhatYoullLearnInput(e.target.value)}
                  onKeyDown={(e) => handleListInputKeyDown(e, 'whatYoullLearn', whatYoullLearnInput, setWhatYoullLearnInput)}
                  placeholder="Enter a topic..."
                  className="flex-1"
                  disabled={formData.whatYoullLearn.length >= 5}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    addListItem('whatYoullLearn', whatYoullLearnInput);
                    setWhatYoullLearnInput('');
                  }}
                  disabled={!whatYoullLearnInput.trim() || formData.whatYoullLearn.length >= 5}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              
              {formData.whatYoullLearn.length >= 5 && (
                <p className="text-xs text-muted-foreground">Maximum 5 items reached</p>
              )}
            </div>
          </div>

          {/* Target Audience */}
          <div className="space-y-3">
            <Label>Target Audience <span className="text-xs text-muted-foreground">(max 5 items)</span></Label>
            <div className="space-y-2">
              {/* Display current items */}
              {formData.targetAudience.length > 0 && (
                <div className="space-y-1">
                  {formData.targetAudience.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2 p-2 bg-muted rounded-md text-sm"
                    >
                      <span className="flex-1">{item}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeListItem('targetAudience', index)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add item input */}
              <div className="flex gap-2">
                <Input
                  value={targetAudienceInput}
                  onChange={(e) => setTargetAudienceInput(e.target.value)}
                  onKeyDown={(e) => handleListInputKeyDown(e, 'targetAudience', targetAudienceInput, setTargetAudienceInput)}
                  placeholder="Enter audience type..."
                  className="flex-1"
                  disabled={formData.targetAudience.length >= 5}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    addListItem('targetAudience', targetAudienceInput);
                    setTargetAudienceInput('');
                  }}
                  disabled={!targetAudienceInput.trim() || formData.targetAudience.length >= 5}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              
              {formData.targetAudience.length >= 5 && (
                <p className="text-xs text-muted-foreground">Maximum 5 items reached</p>
              )}
            </div>
          </div>

          {/* Prerequisites */}
          <div className="space-y-3">
            <Label>Prerequisites <span className="text-xs text-muted-foreground">(max 5 items)</span></Label>
            <div className="space-y-2">
              {/* Display current items */}
              {formData.prerequisites.length > 0 && (
                <div className="space-y-1">
                  {formData.prerequisites.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2 p-2 bg-muted rounded-md text-sm"
                    >
                      <span className="flex-1">{item}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeListItem('prerequisites', index)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add item input */}
              <div className="flex gap-2">
                <Input
                  value={prerequisitesInput}
                  onChange={(e) => setPrerequisitesInput(e.target.value)}
                  onKeyDown={(e) => handleListInputKeyDown(e, 'prerequisites', prerequisitesInput, setPrerequisitesInput)}
                  placeholder="Enter a requirement..."
                  className="flex-1"
                  disabled={formData.prerequisites.length >= 5}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    addListItem('prerequisites', prerequisitesInput);
                    setPrerequisitesInput('');
                  }}
                  disabled={!prerequisitesInput.trim() || formData.prerequisites.length >= 5}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              
              {formData.prerequisites.length >= 5 && (
                <p className="text-xs text-muted-foreground">Maximum 5 items reached</p>
              )}
            </div>
          </div>

          {/* Materials */}
          <div className="space-y-3">
            <Label>Materials Provided <span className="text-xs text-muted-foreground">(max 5 items)</span></Label>
            <div className="space-y-2">
              {/* Display current items */}
              {formData.materials.length > 0 && (
                <div className="space-y-1">
                  {formData.materials.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2 p-2 bg-muted rounded-md text-sm"
                    >
                      <span className="flex-1">{item}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeListItem('materials', index)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add item input */}
              <div className="flex gap-2">
                <Input
                  value={materialsInput}
                  onChange={(e) => setMaterialsInput(e.target.value)}
                  onKeyDown={(e) => handleListInputKeyDown(e, 'materials', materialsInput, setMaterialsInput)}
                  placeholder="Enter a material..."
                  className="flex-1"
                  disabled={formData.materials.length >= 5}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    addListItem('materials', materialsInput);
                    setMaterialsInput('');
                  }}
                  disabled={!materialsInput.trim() || formData.materials.length >= 5}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              
              {formData.materials.length >= 5 && (
                <p className="text-xs text-muted-foreground">Maximum 5 items reached</p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="speakers" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Speakers</h3>
            <Button type="button" onClick={addSpeaker} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Speaker
            </Button>
          </div>

          {speakers.length === 0 ? (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
              No speakers added yet. Click "Add Speaker" to add one.
            </div>
          ) : (
            <div className="space-y-4">
              {speakers.map((speaker, index) => (
                <Card key={index}>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Speaker {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSpeaker(index)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Name *</Label>
                        <Input
                          value={speaker.name}
                          onChange={(e) => updateSpeaker(index, 'name', e.target.value)}
                          placeholder="Speaker name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Role/Title *</Label>
                        <Input
                          value={speaker.role}
                          onChange={(e) => updateSpeaker(index, 'role', e.target.value)}
                          placeholder="e.g., Managing Partner"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Bio *</Label>
                      <Textarea
                        value={speaker.bio}
                        onChange={(e) => updateSpeaker(index, 'bio', e.target.value)}
                        placeholder="Short biography"
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Image URL</Label>
                      <Input
                        value={speaker.image}
                        onChange={(e) => updateSpeaker(index, 'image', e.target.value)}
                        placeholder="/images/speakers/..."
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="agenda" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Agenda</h3>
            <Button type="button" onClick={addAgendaItem} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Agenda Item
            </Button>
          </div>

          {agenda.length === 0 ? (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
              No agenda items added yet. Click "Add Agenda Item" to add one.
            </div>
          ) : (
            <div className="space-y-4">
              {agenda.map((item, index) => (
                <Card key={index}>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Agenda Item {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAgendaItem(index)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label>Time *</Label>
                      <Input
                        value={item.time}
                        onChange={(e) => updateAgendaItem(index, 'time', e.target.value)}
                        placeholder="e.g., 09:00 - 10:30"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Title *</Label>
                      <Input
                        value={item.title}
                        onChange={(e) => updateAgendaItem(index, 'title', e.target.value)}
                        placeholder="Session title"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={item.description}
                        onChange={(e) => updateAgendaItem(index, 'description', e.target.value)}
                        placeholder="Session description"
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Event Image
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                {image ? (
                  <div className="space-y-4">
                    <img
                      src={`http://localhost:5000${image}`}
                      alt="Event"
                      className="max-h-64 mx-auto rounded-lg object-cover"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setImage('')}
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
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/admin/events')}
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

export default EventForm;
