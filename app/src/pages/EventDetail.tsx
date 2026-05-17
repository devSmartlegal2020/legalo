import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Video,
  Users,
  CheckCircle,
  ExternalLink,
  Loader2,
  ChevronRight,
  Star,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';
import { 
  formatPrice, 
  getIconForType,
  type EventData 
} from '@/data/eventsData';
import { eventAPI } from '@/services/api';

// Fallback placeholder images
const FALLBACK_EVENT_IMAGE = 'https://placehold.co/800x400/d93a3a/ffffff?text=Legalo+Event';
const FALLBACK_SPEAKER_IMAGE = 'https://placehold.co/200x200/0b0d10/ffffff?text=Speaker';

const EventDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<EventData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedEvents, setRelatedEvents] = useState<EventData[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'agenda' | 'speakers'>('overview');
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [speakerImageErrors, setSpeakerImageErrors] = useState<Record<number, boolean>>({});
  const [relatedImageErrors, setRelatedImageErrors] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (slug) {
      fetchEvent();
    }
  }, [slug]);

  const fetchEvent = async () => {
    try {
      setIsLoading(true);
      
      // Fetch event data
      const eventResponse = await eventAPI.getBySlug(slug!);
      const eventData = eventResponse.data.data.event;
      
      if (eventData) {
        setEvent(eventData);
        
        // Fetch related events
        const relatedResponse = await eventAPI.getRelated(slug!, 3);
        setRelatedEvents(relatedResponse.data.data.events || []);
      }
    } catch (error) {
      console.error('Failed to fetch event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Registration submitted successfully! Check your email for confirmation.');
    }, 1500);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleSpeakerImageError = (index: number) => {
    setSpeakerImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const handleRelatedImageError = (index: number) => {
    setRelatedImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const getEventImage = () => {
    if (imageError || !event?.image) {
      return FALLBACK_EVENT_IMAGE;
    }
    if (event.image.startsWith('http')) {
      return event.image;
    }
    return `http://localhost:5000${event.image}`;
  };

  const getSpeakerImage = (speaker: EventData['speakers'][0], index: number) => {
    if (speakerImageErrors[index] || !speaker.image) {
      return FALLBACK_SPEAKER_IMAGE;
    }
    if (speaker.image.startsWith('http')) {
      return speaker.image;
    }
    return `http://localhost:5000${speaker.image}`;
  };

  const getRelatedEventImage = (relatedEvent: EventData, index: number) => {
    if (relatedImageErrors[index] || !relatedEvent.image) {
      return FALLBACK_EVENT_IMAGE;
    }
    if (relatedEvent.image.startsWith('http')) {
      return relatedEvent.image;
    }
    return `http://localhost:5000${relatedEvent.image}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-legalo-bg">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-legalo-red" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-legalo-bg">
        <Navigation />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <AlertCircle className="h-16 w-16 text-legalo-red mb-4" />
          <h1 className="text-2xl font-bold mb-4 text-legalo-dark">Event Not Found</h1>
          <p className="text-gray-600 mb-6">The event you are looking for does not exist.</p>
          <Button asChild>
            <Link to="/events">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const EventIcon = getIconForType(event.type);

  return (
    <div className="min-h-screen bg-legalo-bg">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-24 lg:pt-32 bg-legalo-dark overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src={getEventImage()} 
            alt={event.title}
            className="w-full h-full object-cover opacity-20"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-legalo-dark/80 via-legalo-dark/90 to-legalo-dark" />
        </div>

        <div className="relative z-10 w-full px-6 lg:px-12 xl:px-20 py-12 lg:py-20">
          <div className="max-w-7xl mx-auto">
            {/* Back Link */}
            <Link
              to="/events"
              className="inline-flex items-center text-sm text-white/60 hover:text-white transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left: Event Info */}
              <div>
                {/* Badges */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="inline-flex items-center gap-1.5 bg-legalo-red text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                    <EventIcon className="w-3.5 h-3.5" />
                    {event.type}
                  </span>
                  {event.featured && (
                    <span className="inline-flex items-center gap-1.5 bg-yellow-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                      <Star className="w-3.5 h-3.5" />
                      Featured
                    </span>
                  )}
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
                    event.price === 0 ? 'bg-green-500 text-white' : 'bg-white/10 text-white'
                  }`}>
                    {formatPrice(event.price, event.currency)}
                  </span>
                </div>

                {/* Title */}
                <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-6 leading-tight">
                  {event.title}
                </h1>

                {/* Description */}
                <p className="text-white/70 text-lg mb-8 leading-relaxed">
                  {event.description}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-6 text-white/80 mb-8">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-legalo-red" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-legalo-red" />
                    <span>{event.time} ({event.duration})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {event.isOnline ? (
                      <>
                        <Video className="h-5 w-5 text-legalo-red" />
                        <span>{event.location}</span>
                      </>
                    ) : (
                      <>
                        <MapPin className="h-5 w-5 text-legalo-red" />
                        <span>{event.location}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Seats Available */}
                <div className="flex items-center gap-2 text-white/60 text-sm mb-8">
                  <Users className="h-4 w-4" />
                  <span>{event.seatsAvailable} seats available out of {event.attendees}</span>
                </div>

                {/* Quick CTA */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {event.registrationLink && (
                    <Button 
                      size="lg" 
                      className="bg-legalo-red hover:bg-legalo-red/90 text-white"
                      onClick={() => window.open(event.registrationLink, '_blank')}
                    >
                      Register Now
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-legalo-dark transition-colors"
                    onClick={() => document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Quick Registration
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>

              {/* Right: Event Image Card */}
              <div className="hidden lg:block">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10">
                  <img 
                    src={getEventImage()} 
                    alt={event.title}
                    className="w-full h-64 object-cover"
                    onError={handleImageError}
                  />
                  <div className="p-6">
                    <div className="text-white/60 text-sm mb-2">Category</div>
                    <div className="text-white font-medium mb-4">{event.category}</div>
                    
                    {event.price > 0 && event.originalPrice && (
                      <div className="mb-4">
                        <div className="text-white/60 text-sm line-through">
                          {formatPrice(event.originalPrice, event.currency)}
                        </div>
                        <div className="text-2xl font-bold text-legalo-red">
                          {formatPrice(event.price, event.currency)}
                        </div>
                      </div>
                    )}
                    
                    <div className="text-white/60 text-sm">
                      Limited seats available. Register early to secure your spot.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section with Tabs */}
      <section className="py-12 lg:py-16">
        <div className="w-full px-6 lg:px-12 xl:px-20">
          <div className="max-w-7xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex gap-1 border-b border-gray-200 mb-8">
              {(['overview', 'agenda', 'speakers'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                    activeTab === tab 
                      ? 'text-legalo-red' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-legalo-red" />
                  )}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    {/* Full Description */}
                    <div>
                      <h2 className="font-heading font-bold text-2xl text-legalo-dark mb-4">
                        About This Event
                      </h2>
                      <p className="text-gray-600 leading-relaxed">
                        {event.fullDescription}
                      </p>
                    </div>

                    {/* What You'll Learn */}
                    {event.whatYoullLearn && event.whatYoullLearn.length > 0 && (
                      <div>
                        <h3 className="font-heading font-bold text-xl text-legalo-dark mb-4">
                          What You'll Learn
                        </h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {event.whatYoullLearn.map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <CheckCircle className="h-5 w-5 text-legalo-red flex-shrink-0 mt-0.5" />
                              <span className="text-gray-600">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Target Audience */}
                    {event.targetAudience && event.targetAudience.length > 0 && (
                      <div>
                        <h3 className="font-heading font-bold text-xl text-legalo-dark mb-4">
                          Who Should Attend
                        </h3>
                        <ul className="space-y-2">
                          {event.targetAudience.map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <Users className="h-5 w-5 text-legalo-red flex-shrink-0 mt-0.5" />
                              <span className="text-gray-600">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Prerequisites */}
                    {event.prerequisites && event.prerequisites.length > 0 && (
                      <div className="bg-blue-50 rounded-xl p-6">
                        <h3 className="font-heading font-bold text-lg text-legalo-dark mb-3">
                          Prerequisites
                        </h3>
                        <ul className="space-y-2">
                          {event.prerequisites.map((item, index) => (
                            <li key={index} className="flex items-start gap-2 text-gray-600">
                              <span className="text-blue-500">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Materials */}
                    {event.materials && event.materials.length > 0 && (
                      <div className="bg-green-50 rounded-xl p-6">
                        <h3 className="font-heading font-bold text-lg text-legalo-dark mb-3">
                          What You'll Receive
                        </h3>
                        <ul className="space-y-2">
                          {event.materials.map((item, index) => (
                            <li key={index} className="flex items-start gap-2 text-gray-600">
                              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'agenda' && (
                  <div>
                    <h2 className="font-heading font-bold text-2xl text-legalo-dark mb-6">
                      Event Agenda
                    </h2>
                    <div className="space-y-4">
                      {event.agenda.map((item, index) => (
                        <div 
                          key={index} 
                          className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-legalo-red/30 transition-colors"
                        >
                          <div className="flex-shrink-0 w-24 text-sm font-medium text-legalo-red">
                            {item.time}
                          </div>
                          <div>
                            <h4 className="font-semibold text-legalo-dark mb-1">
                              {item.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'speakers' && (
                  <div>
                    <h2 className="font-heading font-bold text-2xl text-legalo-dark mb-6">
                      Speakers & Instructors
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {event.speakers.map((speaker, index) => (
                        <div 
                          key={index} 
                          className="bg-white rounded-xl p-6 border border-gray-100 hover:border-legalo-red/30 transition-all hover:shadow-md"
                        >
                          <div className="flex items-start gap-4">
                            <img 
                              src={getSpeakerImage(speaker, index)} 
                              alt={speaker.name}
                              className="w-16 h-16 rounded-full object-cover bg-gray-100"
                              onError={() => handleSpeakerImageError(index)}
                            />
                            <div>
                              <h4 className="font-semibold text-legalo-dark">
                                {speaker.name}
                              </h4>
                              <p className="text-sm text-legalo-red mb-2">
                                {speaker.role}
                              </p>
                              <p className="text-sm text-gray-600">
                                {speaker.bio}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Location Details */}
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                  <h3 className="font-heading font-bold text-lg text-legalo-dark mb-4">
                    Location Details
                  </h3>
                  
                  {event.isOnline ? (
                    <div>
                      <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <Video className="h-5 w-5 text-legalo-red" />
                        <span>Online Event</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">
                        Platform: {event.platform}
                      </p>
                      <p className="text-sm text-gray-500">
                        Join link will be sent to registered participants 24 hours before the event.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <MapPin className="h-5 w-5 text-legalo-red" />
                        <span>{event.venue}</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">
                        {event.venueAddress}
                      </p>
                      {/* Map placeholder */}
                      <div className="bg-gray-100 rounded-lg h-40 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">Map View</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Registration Form */}
                <div id="registration-form" className="bg-white rounded-xl p-6 border border-gray-100">
                  <h3 className="font-heading font-bold text-lg text-legalo-dark mb-4">
                    Quick Registration
                  </h3>
                  <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <Input 
                        required
                        value={registrationForm.name}
                        onChange={(e) => setRegistrationForm({...registrationForm, name: e.target.value})}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <Input 
                        type="email"
                        required
                        value={registrationForm.email}
                        onChange={(e) => setRegistrationForm({...registrationForm, email: e.target.value})}
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <Input 
                        value={registrationForm.phone}
                        onChange={(e) => setRegistrationForm({...registrationForm, phone: e.target.value})}
                        placeholder="+62 xxx xxxx xxxx"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company/Organization
                      </label>
                      <Input 
                        value={registrationForm.company}
                        onChange={(e) => setRegistrationForm({...registrationForm, company: e.target.value})}
                        placeholder="Your company"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message (Optional)
                      </label>
                      <Textarea 
                        value={registrationForm.message}
                        onChange={(e) => setRegistrationForm({...registrationForm, message: e.target.value})}
                        placeholder="Any questions or special requirements?"
                        rows={3}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-legalo-red hover:bg-legalo-red/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Registration'
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Events */}
      {relatedEvents.length > 0 && (
        <section className="py-12 lg:py-16 bg-white">
          <div className="w-full px-6 lg:px-12 xl:px-20">
            <div className="max-w-7xl mx-auto">
              <h2 className="font-heading font-bold text-2xl text-legalo-dark mb-8">
                Similar Events You Might Like
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedEvents.map((relatedEvent, index) => {
                  const RelatedIcon = getIconForType(relatedEvent.type);
                  return (
                    <Link 
                      key={index}
                      to={`/events/${relatedEvent.slug}`}
                      className="group block bg-legalo-bg rounded-xl overflow-hidden border border-gray-100 hover:border-legalo-red/30 hover:shadow-lg transition-all"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={getRelatedEventImage(relatedEvent, index)} 
                          alt={relatedEvent.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={() => handleRelatedImageError(index)}
                        />
                        <div className="absolute top-4 left-4">
                          <span className="inline-flex items-center gap-1.5 bg-legalo-red text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                            <RelatedIcon className="w-3.5 h-3.5" />
                            {relatedEvent.type}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-heading font-semibold text-lg text-legalo-dark mb-2 group-hover:text-legalo-red transition-colors">
                          {relatedEvent.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {relatedEvent.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            {relatedEvent.date}
                          </div>
                          <div className={`text-sm font-semibold ${
                            relatedEvent.price === 0 ? 'text-green-600' : 'text-legalo-red'
                          }`}>
                            {formatPrice(relatedEvent.price, relatedEvent.currency)}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default EventDetail;
