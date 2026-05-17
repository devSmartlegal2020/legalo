import { Video, Users, Building2, Mic, Calendar } from 'lucide-react';

// Helper function to generate placeholder images
const getPlaceholderImage = (text: string) => `https://placehold.co/800x400/d93a3a/ffffff?text=${encodeURIComponent(text)}`;
const getSpeakerPlaceholder = (name: string) => `https://placehold.co/200x200/0b0d10/ffffff?text=${encodeURIComponent(name.charAt(0))}`;

export interface Speaker {
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface AgendaItem {
  time: string;
  title: string;
  description: string;
}

export interface EventData {
  slug: string;
  title: string;
  description: string;
  fullDescription: string;
  whatYoullLearn: string[];
  targetAudience: string[];
  date: string;
  time: string;
  duration: string;
  startDateTime?: string;
  endDateTime?: string;
  location: string;
  isOnline: boolean;
  platform?: string;
  venue?: string;
  venueAddress?: string;
  type: 'Webinar' | 'Workshop' | 'Networking' | 'Clinic';
  category: string;
  price: number;
  currency: string;
  originalPrice?: number;
  attendees: number;
  seatsAvailable: number;
  speakers: Speaker[];
  agenda: AgendaItem[];
  image: string;
  registrationLink?: string;
  prerequisites?: string[];
  materials?: string[];
  featured: boolean;
}

export const eventsData: EventData[] = [
  // Featured Events
  {
    slug: 'startup-legal-bootcamp-2024',
    title: 'Startup Legal Bootcamp 2024',
    description: 'A comprehensive 2-day intensive workshop covering everything from company incorporation to investor agreements.',
    fullDescription: 'Join us for an intensive 2-day bootcamp designed specifically for startup founders and entrepreneurs. This hands-on workshop will guide you through the essential legal foundations every startup needs, from choosing the right business structure to preparing for investor meetings. Our experienced legal professionals will share real-world case studies and practical templates you can use immediately.',
    whatYoullLearn: [
      'How to choose between PT, CV, and Firma for your startup',
      'Essential legal documents every startup needs',
      'Founder agreements and equity distribution',
      'Investor agreement basics and term sheet fundamentals',
      'Intellectual property protection strategies',
      'Employment law basics for startups',
      'Regulatory compliance checklist'
    ],
    targetAudience: [
      'Startup founders and co-founders',
      'Early-stage entrepreneurs',
      'Small business owners planning to scale',
      'Investors working with startups'
    ],
    date: '15-16 Maret 2024',
    time: '09:00 - 17:00 WIB',
    duration: '2 Days',
    location: 'Jakarta Selatan',
    isOnline: false,
    venue: 'Legalo.id Office - Meeting Room A',
    venueAddress: 'Jl. Sudirman No. 123, Jakarta Selatan 12190',
    type: 'Workshop',
    category: 'Startup Legal',
    price: 2500000,
    currency: 'IDR',
    originalPrice: 3500000,
    attendees: 50,
    seatsAvailable: 12,
    image: getPlaceholderImage('Startup+Legal+Bootcamp'),
    registrationLink: 'https://forms.legalo.id/startup-bootcamp',
    prerequisites: [
      'Basic understanding of business structures',
      'Laptop with Microsoft Office/Google Docs',
      'Business idea or existing startup'
    ],
    materials: [
      'Comprehensive workshop handbook',
      'Legal document templates (NDA, Term Sheet, etc.)',
      'Startup legal compliance checklist',
      '3-month access to Legalo.id consultation service'
    ],
    featured: true,
    speakers: [
      {
        name: 'Budi Santoso',
        role: 'Managing Partner, Legalo.id',
        bio: '15+ years experience in corporate law and startup advisory. Previously advised 200+ startups from seed to Series B.',
        image: getSpeakerPlaceholder('Budi Santoso')
      },
      {
        name: 'Diana Wijaya',
        role: 'Senior Legal Counsel, Tech Ventures',
        bio: 'Former in-house counsel at Gojek and Traveloka. Expert in tech startup legal frameworks and fundraising.',
        image: getSpeakerPlaceholder('Diana Wijaya')
      },
      {
        name: 'Andi Kusuma',
        role: 'Startup Founder & Mentor',
        bio: 'Founded 3 successful startups, raised over $5M in funding. Understanding founder perspective on legal needs.',
        image: getSpeakerPlaceholder('Andi Kusuma')
      }
    ],
    agenda: [
      {
        time: '09:00 - 09:30',
        title: 'Registration & Coffee',
        description: 'Check-in, networking, and light refreshments'
      },
      {
        time: '09:30 - 10:30',
        title: 'Opening: Legal Foundations for Startups',
        description: 'Understanding the legal landscape for Indonesian startups'
      },
      {
        time: '10:30 - 12:00',
        title: 'Business Structure Workshop',
        description: 'PT vs CV vs Firma: Which is right for your startup?'
      },
      {
        time: '12:00 - 13:00',
        title: 'Lunch Break & Networking',
        description: 'Catered lunch with fellow participants'
      },
      {
        time: '13:00 - 15:00',
        title: 'Essential Legal Documents',
        description: 'Deep dive into founder agreements, IP assignments, and NDA'
      },
      {
        time: '15:00 - 15:30',
        title: 'Coffee Break',
        description: 'Afternoon refreshments'
      },
      {
        time: '15:30 - 17:00',
        title: 'Case Studies & Q&A',
        description: 'Real-world startup legal scenarios and group discussion'
      },
      {
        time: '09:00 - 10:30',
        title: 'Day 2: Investor Readiness',
        description: 'Preparing your legal documents for fundraising'
      },
      {
        time: '10:30 - 12:00',
        title: 'Term Sheet Fundamentals',
        description: 'Understanding valuation, equity, and investor rights'
      },
      {
        time: '12:00 - 13:00',
        title: 'Lunch Break',
        description: 'Catered lunch'
      },
      {
        time: '13:00 - 15:00',
        title: 'Hands-on Document Workshop',
        description: 'Draft your own term sheet and founder agreement'
      },
      {
        time: '15:00 - 16:00',
        title: 'Compliance & Ongoing Legal Needs',
        description: 'Setting up systems for legal compliance'
      },
      {
        time: '16:00 - 17:00',
        title: 'Closing & Certificate Distribution',
        description: 'Final Q&A and certificate ceremony'
      }
    ]
  },
  {
    slug: 'hr-compliance-masterclass',
    title: 'HR Compliance Masterclass',
    description: 'Learn the latest regulations in employment law, contract management, and employee rights.',
    fullDescription: 'Stay ahead of the curve with our comprehensive HR Compliance Masterclass. This intensive webinar covers the latest updates to Indonesian employment law, including recent changes to the Omnibus Law, BPJS requirements, and termination procedures. Perfect for HR professionals, business owners, and anyone managing teams.',
    whatYoullLearn: [
      'Latest Omnibus Law updates affecting employment',
      'Proper PKWT (contract worker) management',
      'BPJS Kesehatan & Ketenagakerjaan compliance',
      'Termination procedures and severance calculations',
      'Employee data privacy under PDP Law',
      'Creating compliant employment contracts',
      'Handling workplace disputes legally'
    ],
    targetAudience: [
      'HR managers and professionals',
      'Small business owners with employees',
      'Startup founders building teams',
      'Legal consultants specializing in employment law'
    ],
    date: '22 Maret 2024',
    time: '14:00 - 16:00 WIB',
    duration: '2 Hours',
    location: 'Online (Zoom)',
    isOnline: true,
    platform: 'Zoom Meeting',
    type: 'Webinar',
    category: 'HR & Legal',
    price: 0,
    currency: 'IDR',
    attendees: 200,
    seatsAvailable: 145,
    image: getPlaceholderImage('HR+Compliance'),
    prerequisites: [
      'Basic understanding of employment concepts',
      'Stable internet connection',
      'Zoom account (free version sufficient)'
    ],
    materials: [
      'Webinar recording (available for 30 days)',
      'HR compliance checklist PDF',
      'Employment contract templates',
      'Termination calculation guide'
    ],
    featured: true,
    speakers: [
      {
        name: 'Siti Rahayu',
        role: 'HR Legal Specialist, Legalo.id',
        bio: 'Former HR Director at multinational companies. Expert in Indonesian employment law and labor relations.',
        image: getSpeakerPlaceholder('Siti Rahayu')
      },
      {
        name: 'Rudi Hartono',
        role: 'Labor Law Consultant',
        bio: '10+ years advising companies on labor law compliance. Former DISNAKER officer.',
        image: getSpeakerPlaceholder('Rudi Hartono')
      }
    ],
    agenda: [
      {
        time: '13:45 - 14:00',
        title: 'Zoom Room Open',
        description: 'Early join for technical checks'
      },
      {
        time: '14:00 - 14:15',
        title: 'Welcome & Introduction',
        description: 'Overview of today\'s agenda'
      },
      {
        time: '14:15 - 15:00',
        title: 'Omnibus Law Updates',
        description: 'Recent changes and their impact on employers'
      },
      {
        time: '15:00 - 15:30',
        title: 'BPJS Compliance Deep Dive',
        description: 'Understanding your obligations as an employer'
      },
      {
        time: '15:30 - 15:45',
        title: 'Break',
        description: 'Short break'
      },
      {
        time: '15:45 - 16:00',
        title: 'Q&A Session',
        description: 'Live questions from participants'
      }
    ]
  },
  {
    slug: 'umkm-legal-clinic-free',
    title: 'UMKM Legal Clinic: Free Consultation Day',
    description: 'Free one-on-one legal consultations for UMKM owners. Get expert advice at no cost.',
    fullDescription: 'In partnership with the Ministry of Cooperatives and SMEs, Legalo.id is offering free legal consultations to UMKM owners across Indonesia. Our experienced legal team will help you navigate business licensing, contract reviews, trademark registration, and compliance issues. This is your opportunity to get personalized legal advice without any cost.',
    whatYoullLearn: [
      'Personalized legal advice for your business',
      'Business licensing requirements for your industry',
      'Contract review and feedback',
      'Trademark registration guidance',
      'Compliance checklist for your specific business type'
    ],
    targetAudience: [
      'UMKM business owners',
      'Home-based business operators',
      'Sole proprietors',
      'Small business startups'
    ],
    date: '30 Maret 2024',
    time: '10:00 - 15:00 WIB',
    duration: '5 Hours',
    location: 'Multiple Cities',
    isOnline: false,
    venue: 'Various Legalo.id Partner Locations',
    venueAddress: 'Jakarta, Bandung, Surabaya, Yogyakarta',
    type: 'Clinic',
    category: 'Community',
    price: 0,
    currency: 'IDR',
    attendees: 100,
    seatsAvailable: 35,
    image: getPlaceholderImage('UMKM+Legal+Clinic'),
    registrationLink: 'https://forms.legalo.id/umkm-clinic',
    prerequisites: [
      'Valid UMKM registration (NIB)',
      'Bring relevant documents for review',
      'Book appointment slot in advance'
    ],
    materials: [
      'Free legal consultation (30 minutes)',
      'UMKM legal compliance guide',
      'Business licensing roadmap',
      'Discount voucher for future services'
    ],
    featured: true,
    speakers: [
      {
        name: 'Multiple Legal Consultants',
        role: 'Legalo.id Legal Team',
        bio: 'Team of experienced lawyers specializing in UMKM legal needs and business compliance.',
        image: getSpeakerPlaceholder('Legal Team')
      }
    ],
    agenda: [
      {
        time: '09:30 - 10:00',
        title: 'Registration & Opening',
        description: 'Check-in and welcome briefing'
      },
      {
        time: '10:00 - 12:00',
        title: 'Morning Consultation Sessions',
        description: 'One-on-one legal consultations (30 min each)'
      },
      {
        time: '12:00 - 13:00',
        title: 'Lunch Break',
        description: 'Light refreshments provided'
      },
      {
        time: '13:00 - 15:00',
        title: 'Afternoon Consultation Sessions',
        description: 'Continued one-on-one consultations'
      }
    ]
  },
  // Upcoming Events
  {
    slug: 'tax-planning-small-business',
    title: 'Tax Planning for Small Businesses',
    description: 'Learn effective tax strategies to minimize your business tax burden while staying compliant.',
    fullDescription: 'Tax planning is crucial for business profitability, but many small business owners struggle to understand their obligations and opportunities. This webinar will teach you legal tax optimization strategies, common deductions, and compliance requirements for Indonesian businesses.',
    whatYoullLearn: [
      'Understanding PPh 21, 23, and 25 obligations',
      'Legal tax deductions for businesses',
      'VAT (PPN) compliance and optimization',
      'Tax reporting calendar and deadlines',
      'Common tax mistakes to avoid',
      'Working with tax consultants effectively'
    ],
    targetAudience: [
      'Small business owners',
      'SME financial managers',
      'Accountants serving SMEs',
      'Startup finance teams'
    ],
    date: '05 April 2024',
    time: '19:00 - 20:30 WIB',
    duration: '1.5 Hours',
    location: 'Online (Zoom)',
    isOnline: true,
    platform: 'Zoom Webinar',
    type: 'Webinar',
    category: 'Finance & Tax',
    price: 0,
    currency: 'IDR',
    attendees: 150,
    seatsAvailable: 89,
    image: getPlaceholderImage('Tax+Planning'),
    materials: [
      'Tax planning checklist',
      'Tax calendar template',
      'Deduction guide for SMEs',
      'Webinar recording access'
    ],
    featured: false,
    speakers: [
      {
        name: 'Agus Salim',
        role: 'Tax Consultant, Brevet A & B',
        bio: 'Certified tax consultant with 12 years experience advising SMEs. Member of IKPI.',
        image: getSpeakerPlaceholder('Agus Salim')
      }
    ],
    agenda: [
      {
        time: '18:45 - 19:00',
        title: 'Room Open',
        description: 'Early joiners'
      },
      {
        time: '19:00 - 19:10',
        title: 'Introduction',
        description: 'Welcome and overview'
      },
      {
        time: '19:10 - 20:00',
        title: 'Tax Planning Strategies',
        description: 'Main presentation with examples'
      },
      {
        time: '20:00 - 20:30',
        title: 'Q&A',
        description: 'Live questions answered'
      }
    ]
  },
  {
    slug: 'trademark-registration-workshop',
    title: 'Trademark Registration Workshop',
    description: 'Step-by-step guidance on protecting your brand through trademark registration in Indonesia.',
    fullDescription: 'Your brand is one of your most valuable assets. Learn how to protect it through proper trademark registration with the Indonesian Intellectual Property Office (DGIP). This hands-on workshop covers the entire process from search to registration, including common pitfalls and how to avoid them.',
    whatYoullLearn: [
      'Trademark search techniques',
      'Classification of goods and services (Nice Classification)',
      'Application preparation and filing',
      'Responding to DGIP objections',
      'Trademark monitoring and enforcement',
      'International trademark protection basics'
    ],
    targetAudience: [
      'Brand owners',
      'Marketing managers',
      'Business owners launching new products',
      'Legal professionals'
    ],
    date: '12 April 2024',
    time: '13:00 - 15:00 WIB',
    duration: '2 Hours',
    location: 'Online (Zoom)',
    isOnline: true,
    platform: 'Zoom Meeting',
    type: 'Workshop',
    category: 'Intellectual Property',
    price: 500000,
    currency: 'IDR',
    originalPrice: 750000,
    attendees: 80,
    seatsAvailable: 45,
    image: getPlaceholderImage('Trademark+Workshop'),
    registrationLink: 'https://forms.legalo.id/trademark-workshop',
    materials: [
      'Trademark registration guidebook',
      'Nice Classification reference',
      'DGIP application templates',
      'Trademark monitoring checklist'
    ],
    featured: false,
    speakers: [
      {
        name: 'Nina Dewi',
        role: 'IP Attorney, Legalo.id',
        bio: 'Registered IP consultant with DGIP. Handled 300+ trademark applications.',
        image: getSpeakerPlaceholder('Nina Dewi')
      }
    ],
    agenda: [
      {
        time: '12:45 - 13:00',
        title: 'Room Open',
        description: 'Technical checks'
      },
      {
        time: '13:00 - 13:30',
        title: 'Trademark Basics',
        description: 'What can and cannot be trademarked'
      },
      {
        time: '13:30 - 14:00',
        title: 'Hands-on: Trademark Search',
        description: 'Live demonstration of search techniques'
      },
      {
        time: '14:00 - 14:15',
        title: 'Break',
        description: 'Short break'
      },
      {
        time: '14:15 - 14:45',
        title: 'Application Process',
        description: 'Step-by-step filing walkthrough'
      },
      {
        time: '14:45 - 15:00',
        title: 'Q&A',
        description: 'Questions and discussion'
      }
    ]
  },
  {
    slug: 'founders-legal-networking',
    title: 'Founders Legal Networking Night',
    description: 'Connect with fellow entrepreneurs and legal experts in an informal networking session.',
    fullDescription: 'Building a business is challenging, but you don\'t have to do it alone. Join us for an evening of networking with fellow founders, entrepreneurs, and legal experts. Share experiences, discuss challenges, and build valuable connections in a relaxed atmosphere. Light refreshments provided.',
    whatYoullLearn: [
      'Build your founder network',
      'Learn from peers\' experiences',
      'Get informal legal advice',
      'Discover partnership opportunities',
      'Share resources and best practices'
    ],
    targetAudience: [
      'Startup founders',
      'Entrepreneurs',
      'Small business owners',
      'Aspiring entrepreneurs'
    ],
    date: '18 April 2024',
    time: '18:00 - 21:00 WIB',
    duration: '3 Hours',
    location: 'Jakarta Selatan',
    isOnline: false,
    venue: 'Co-working Space - Event Hall',
    venueAddress: 'Jl. Senopati No. 45, Jakarta Selatan',
    type: 'Networking',
    category: 'Community',
    price: 150000,
    currency: 'IDR',
    attendees: 60,
    seatsAvailable: 25,
    image: getPlaceholderImage('Networking+Night'),
    registrationLink: 'https://forms.legalo.id/networking-night',
    materials: [
      'Access to exclusive founder community',
      'Event photos and contact list',
      'Networking tips guide'
    ],
    featured: false,
    speakers: [
      {
        name: 'Various Founders',
        role: 'Community Leaders',
        bio: 'Connect with successful founders from various industries.',
        image: getSpeakerPlaceholder('Community')
      }
    ],
    agenda: [
      {
        time: '18:00 - 18:30',
        title: 'Welcome & Check-in',
        description: 'Registration and welcome drinks'
      },
      {
        time: '18:30 - 19:00',
        title: 'Introduction Round',
        description: 'Quick introductions from all participants'
      },
      {
        time: '19:00 - 20:30',
        title: 'Networking Session',
        description: 'Free networking with structured activities'
      },
      {
        time: '20:30 - 21:00',
        title: 'Closing & Photos',
        description: 'Group photo and closing remarks'
      }
    ]
  },
  {
    slug: 'employment-law-update-2024',
    title: 'Employment Law Update 2024',
    description: 'Stay informed about the latest changes in Indonesian employment law and regulations.',
    fullDescription: 'Employment law in Indonesia continues to evolve with new regulations and court decisions. This webinar provides a comprehensive update on recent changes affecting employers, including updates to BPJS, termination rules, and remote work regulations.',
    whatYoullLearn: [
      'Latest government regulations on employment',
      'Recent Constitutional Court decisions',
      'Remote work legal framework updates',
      'Changes to BPJS contributions',
      'Updated termination procedures'
    ],
    targetAudience: [
      'HR professionals',
      'Business owners',
      'Legal consultants',
      'Union representatives'
    ],
    date: '25 April 2024',
    time: '14:00 - 16:00 WIB',
    duration: '2 Hours',
    location: 'Online (Zoom)',
    isOnline: true,
    platform: 'Zoom Webinar',
    type: 'Webinar',
    category: 'Employment Law',
    price: 0,
    currency: 'IDR',
    attendees: 300,
    seatsAvailable: 200,
    image: getPlaceholderImage('Employment+Law'),
    materials: [
      '2024 Employment Law Update PDF',
      'Compliance checklist 2024',
      'Recording access'
    ],
    featured: false,
    speakers: [
      {
        name: 'Legal Update Team',
        role: 'Legalo.id Research Division',
        bio: 'Team monitoring legal developments and regulatory changes.',
        image: getSpeakerPlaceholder('Legal Team')
      }
    ],
    agenda: [
      {
        time: '13:45 - 14:00',
        title: 'Room Open',
        description: 'Early access'
      },
      {
        time: '14:00 - 15:30',
        title: '2024 Legal Updates',
        description: 'Comprehensive review of changes'
      },
      {
        time: '15:30 - 16:00',
        title: 'Q&A Session',
        description: 'Live questions'
      }
    ]
  },
  {
    slug: 'contract-drafting-essentials',
    title: 'Contract Drafting Essentials',
    description: 'Master the fundamentals of drafting business contracts that protect your interests.',
    fullDescription: 'Contracts are the foundation of business relationships, but poorly drafted agreements can lead to disputes and losses. This workshop teaches you the essentials of contract drafting, including key clauses, risk management, and negotiation techniques.',
    whatYoullLearn: [
      'Contract structure and essential clauses',
      'Risk allocation techniques',
      'Drafting clear and enforceable terms',
      'Common contract pitfalls',
      'Negotiation strategies',
      'Contract review checklist'
    ],
    targetAudience: [
      'Business development managers',
      'Procurement teams',
      'Legal professionals',
      'Startup founders'
    ],
    date: '02 Mei 2024',
    time: '10:00 - 12:00 WIB',
    duration: '2 Hours',
    location: 'Online (Zoom)',
    isOnline: true,
    platform: 'Zoom Meeting',
    type: 'Workshop',
    category: 'Contract Law',
    price: 750000,
    currency: 'IDR',
    originalPrice: 1000000,
    attendees: 50,
    seatsAvailable: 30,
    image: getPlaceholderImage('Contract+Drafting'),
    registrationLink: 'https://forms.legalo.id/contract-workshop',
    prerequisites: [
      'Basic understanding of business contracts',
      'Laptop for hands-on exercises'
    ],
    materials: [
      'Contract drafting handbook',
      'Template library (20+ templates)',
      'Clause reference guide',
      'Contract review checklist'
    ],
    featured: false,
    speakers: [
      {
        name: 'Hendra Wijaya',
        role: 'Senior Contract Lawyer',
        bio: '20 years drafting and negotiating commercial contracts for Fortune 500 companies.',
        image: getSpeakerPlaceholder('Hendra Wijaya')
      }
    ],
    agenda: [
      {
        time: '09:45 - 10:00',
        title: 'Room Open',
        description: 'Preparation'
      },
      {
        time: '10:00 - 10:45',
        title: 'Contract Fundamentals',
        description: 'Structure and key elements'
      },
      {
        time: '10:45 - 11:30',
        title: 'Hands-on Exercise',
        description: 'Drafting practice'
      },
      {
        time: '11:30 - 12:00',
        title: 'Q&A and Wrap-up',
        description: 'Final questions'
      }
    ]
  },
  {
    slug: 'investor-readiness-clinic',
    title: 'Investor Readiness Clinic',
    description: 'Prepare your startup for investor meetings with proper legal documentation and compliance.',
    fullDescription: 'Before approaching investors, your startup needs to be legally prepared. This clinic provides personalized assessment and guidance on the legal documents and compliance items investors will scrutinize. Get your startup investment-ready.',
    whatYoullLearn: [
      'Investor due diligence checklist',
      'Essential legal documents for fundraising',
      'Cap table management',
      'IP ownership verification',
      'Compliance readiness assessment',
      'Common red flags for investors'
    ],
    targetAudience: [
      'Pre-seed and seed stage founders',
      'Startups preparing for fundraising',
      'Accelerator participants',
      'Early-stage investors'
    ],
    date: '08 Mei 2024',
    time: '15:00 - 17:00 WIB',
    duration: '2 Hours',
    location: 'Online (Zoom)',
    isOnline: true,
    platform: 'Zoom Meeting',
    type: 'Clinic',
    category: 'Startup Fundraising',
    price: 1000000,
    currency: 'IDR',
    originalPrice: 1500000,
    attendees: 30,
    seatsAvailable: 15,
    image: getPlaceholderImage('Investor+Readiness'),
    registrationLink: 'https://forms.legalo.id/investor-clinic',
    prerequisites: [
      'Existing startup (not just idea stage)',
      'Prepare cap table and legal documents for review'
    ],
    materials: [
      'Due diligence checklist',
      'Investor readiness assessment tool',
      'Document templates',
      '30-minute follow-up consultation'
    ],
    featured: false,
    speakers: [
      {
        name: 'Sarah Chen',
        role: 'Startup Advisor & Former VC',
        bio: 'Former associate at prominent VC fund. Advised 50+ startups on fundraising preparation.',
        image: getSpeakerPlaceholder('Sarah Chen')
      }
    ],
    agenda: [
      {
        time: '14:45 - 15:00',
        title: 'Room Open',
        description: 'Check-in'
      },
      {
        time: '15:00 - 15:30',
        title: 'Investor Expectations',
        description: 'What investors look for legally'
      },
      {
        time: '15:30 - 16:30',
        title: 'Clinic Sessions',
        description: 'Rotating small group consultations'
      },
      {
        time: '16:30 - 17:00',
        title: 'Wrap-up & Next Steps',
        description: 'Action items and follow-up'
      }
    ]
  }
];

// Helper functions
export const getEventBySlug = (slug: string): EventData | undefined => {
  return eventsData.find(event => event.slug === slug);
};

export const getFeaturedEvents = (): EventData[] => {
  return eventsData.filter(event => event.featured);
};

export const getUpcomingEvents = (): EventData[] => {
  return eventsData.filter(event => !event.featured);
};

export const getRelatedEvents = (currentSlug: string, limit: number = 3): EventData[] => {
  const currentEvent = getEventBySlug(currentSlug);
  if (!currentEvent) return [];
  
  return eventsData
    .filter(event => event.slug !== currentSlug && event.type === currentEvent.type)
    .slice(0, limit);
};

export const formatPrice = (price: number, currency: string): string => {
  if (price === 0) return 'FREE';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

export const getIconForType = (type: string) => {
  switch (type) {
    case 'Webinar':
      return Video;
    case 'Workshop':
      return Building2;
    case 'Networking':
      return Users;
    case 'Clinic':
      return Mic;
    default:
      return Calendar;
  }
};
