export const demoRoles = [
  {
    _id: '68162f63ff2da55b40ca61b8',
    name: 'ADMIN',
    description: 'Administrator with full access',
    permissions: ['all']
  },
  {
    _id: '681632b6ab1624e874bb2dcf',
    name: 'USER',
    description: 'Regular user/customer',
    permissions: ['read']
  },
  {
    _id: 'sales_role_id',
    name: 'SALES',
    description: 'Sales representative',
    permissions: ['read', 'write_sales']
  },
  {
    _id: 'executive_role_id',
    name: 'EXECUTIVE',
    description: 'Executive management',
    permissions: ['read_all']
  }
];

export const demoUsers = [
  {
    _id: 'demo_admin_1',
    firstName: 'Demo',
    lastName: 'Admin',
    email: 'admin@demo.com',
    phoneNumber: '1234567890',
    role: '68162f63ff2da55b40ca61b8', // ADMIN
    published: true,
    isAgent: false
  },
  {
    _id: 'demo_user_1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@demo.com',
    phoneNumber: '9876543210',
    role: '681632b6ab1624e874bb2dcf', // USER
    published: true,
    isAgent: false
  },
  {
    _id: 'demo_sales_1',
    firstName: 'Alice',
    lastName: 'Sales',
    email: 'alice.sales@demo.com',
    phoneNumber: '1112223333',
    role: 'sales_role_id', // SALES
    published: true,
    isAgent: true
  }
];

export const demoProperties = [
  {
    _id: 'prop_1',
    name: 'Luxury Villa in Bandra',
    propertyTypeId: 'type_villa',
    description: 'A beautiful 4BHK villa with sea view.',
    propertyAddress: {
      street: 'Carter Road',
      area: 'Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipOrPinCode: '400050',
      country: 'India'
    },
    price: 55000000,
    propertyStatus: 'FOR SALE',
    features: {
      bedRooms: 4,
      bathRooms: 5,
      areaInSquarFoot: 3500,
      bhk: 4,
      amenities: ['Pool', 'Garden', 'Gym']
    },
    images: ['https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'],
    published: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prop_2',
    name: 'Modern Apartment in Pune',
    propertyTypeId: 'type_apartment',
    description: 'Spacious 3BHK in a gated community.',
    propertyAddress: {
      street: 'Baner Road',
      area: 'Baner',
      city: 'Pune',
      state: 'Maharashtra',
      zipOrPinCode: '411045',
      country: 'India'
    },
    price: 12000000,
    propertyStatus: 'FOR SALE',
    features: {
      bedRooms: 3,
      bathRooms: 3,
      areaInSquarFoot: 1800,
      bhk: 3,
      amenities: ['Clubhouse', 'Security', 'Parking']
    },
    images: ['https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'],
    published: true,
    createdAt: new Date().toISOString()
  }
];

export const demoLeads = [
  {
    _id: 'lead_1',
    userId: {
      _id: 'demo_user_1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@demo.com',
      phoneNumber: '9876543210'
    },
    propertyId: 'prop_1',
    leadStatus: { _id: 'status_new', name: 'New' },
    followUpStatus: { _id: 'follow_pending', name: 'Pending' },
    note: 'Interested in the sea view villa.',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'lead_2',
    userId: {
      _id: 'demo_user_2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@demo.com',
      phoneNumber: '5556667777'
    },
    propertyId: 'prop_2',
    leadStatus: { _id: 'status_contacted', name: 'Contacted' },
    followUpStatus: { _id: 'follow_scheduled', name: 'Scheduled' },
    note: 'Looking for 3BHK in Pune.',
    createdAt: new Date().toISOString()
  }
];

export const demoRentalBookings = [
  {
    _id: 'booking_1',
    bookingId: 'RB-2023-001',
    propertyId: {
      _id: 'prop_1',
      name: 'Luxury Villa in Bandra',
      propertyAddress: {
        city: 'Mumbai',
        state: 'Maharashtra'
      }
    },
    customerId: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@demo.com'
    },
    assignedSalespersonId: {
      firstName: 'Alice',
      lastName: 'Sales',
      email: 'alice.sales@demo.com'
    },
    monthlyRent: 150000,
    securityDeposit: 500000,
    rentDueDate: 5,
    duration: 12,
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
    bookingStatus: 'ACTIVE',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'booking_2',
    bookingId: 'RB-2023-002',
    propertyId: {
      _id: 'prop_2',
      name: 'Modern Apartment in Pune',
      propertyAddress: {
        city: 'Pune',
        state: 'Maharashtra'
      }
    },
    customerId: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@demo.com'
    },
    assignedSalespersonId: {
      firstName: 'Bob',
      lastName: 'Agent',
      email: 'bob.agent@demo.com'
    },
    monthlyRent: 45000,
    securityDeposit: 150000,
    rentDueDate: 10,
    duration: 11,
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
    bookingStatus: 'PENDING',
    createdAt: new Date().toISOString()
  }
];

export const demoPurchaseBookings = [
  {
    _id: 'pb_1',
    bookingId: 'PB-2023-001',
    propertyId: {
      _id: 'prop_3',
      name: 'Seaside Apartment',
      propertyAddress: {
        city: 'Mumbai',
        state: 'Maharashtra'
      }
    },
    customerId: {
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael.brown@demo.com'
    },
    assignedSalespersonId: {
      firstName: 'Alice',
      lastName: 'Sales',
      email: 'alice.sales@demo.com'
    },
    agreedPrice: 25000000,
    bookingAmount: 1000000,
    bookingDate: new Date().toISOString(),
    paymentStatus: 'PARTIAL',
    bookingStatus: 'CONFIRMED',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'pb_2',
    bookingId: 'PB-2023-002',
    propertyId: {
      _id: 'prop_4',
      name: 'Downtown Office Space',
      propertyAddress: {
        city: 'Pune',
        state: 'Maharashtra'
      }
    },
    customerId: {
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 'sarah.wilson@demo.com'
    },
    assignedSalespersonId: {
      firstName: 'Bob',
      lastName: 'Agent',
      email: 'bob.agent@demo.com'
    },
    agreedPrice: 45000000,
    bookingAmount: 2000000,
    bookingDate: new Date().toISOString(),
    paymentStatus: 'PAID',
    bookingStatus: 'COMPLETED',
    createdAt: new Date().toISOString()
  }
];

export const demoPayments = [
  {
    _id: 'pay_1',
    transactionId: 'TXN-123456',
    bookingId: {
      bookingId: 'RB-2023-001',
      propertyId: { name: 'Luxury Villa in Bandra' }
    },
    amount: 150000,
    paymentDate: new Date().toISOString(),
    paymentMethod: 'BANK_TRANSFER',
    paymentType: 'RENT',
    status: 'COMPLETED',
    customerId: {
      firstName: 'John',
      lastName: 'Doe'
    }
  },
  {
    _id: 'pay_2',
    transactionId: 'TXN-789012',
    bookingId: {
      bookingId: 'PB-2023-001',
      propertyId: { name: 'Seaside Apartment' }
    },
    amount: 1000000,
    paymentDate: new Date().toISOString(),
    paymentMethod: 'CHEQUE',
    paymentType: 'BOOKING_AMOUNT',
    status: 'PENDING',
    customerId: {
      firstName: 'Michael',
      lastName: 'Brown'
    }
  }
];

export const demoMeetings = [
  {
    _id: 'meet_1',
    title: 'Property Viewing - Luxury Villa',
    description: 'Client wants to see the villa in Bandra',
    startTime: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    endTime: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
    meetingType: 'OFFLINE',
    status: 'SCHEDULED',
    participants: [
      { user: { firstName: 'John', lastName: 'Doe', email: 'john@demo.com' } },
      { user: { firstName: 'Alice', lastName: 'Sales', email: 'alice@demo.com' } }
    ],
    location: 'Bandra West, Mumbai'
  },
  {
    _id: 'meet_2',
    title: 'Contract Discussion',
    description: 'Discuss terms for Seaside Apartment',
    startTime: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
    endTime: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(),
    meetingType: 'ONLINE',
    status: 'COMPLETED',
    participants: [
      { user: { firstName: 'Michael', lastName: 'Brown', email: 'michael@demo.com' } },
      { user: { firstName: 'Bob', lastName: 'Agent', email: 'bob@demo.com' } }
    ],
    meetingLink: 'https://meet.google.com/abc-defg-hij'
  }
];

export const demoDocuments = [
  {
    _id: 'doc_1',
    title: 'Lease Agreement - Villa',
    documentType: 'AGREEMENT',
    fileUrl: '#',
    uploadedBy: { firstName: 'Admin', lastName: 'User' },
    createdAt: new Date().toISOString(),
    status: 'VERIFIED',
    relatedTo: 'RB-2023-001'
  },
  {
    _id: 'doc_2',
    title: 'Identity Proof - John Doe',
    documentType: 'KYC',
    fileUrl: '#',
    uploadedBy: { firstName: 'John', lastName: 'Doe' },
    createdAt: new Date().toISOString(),
    status: 'PENDING',
    relatedTo: 'USER-001'
  }
];

export const demoStats = {
  totalProperties: 15,
  totalLeads: 42,
  totalCustomers: 120,
  totalRentalBookings: 8,
  totalPurchaseBookings: 5,
  roleWiseCustomers: { USER: 110, AGENT: 10 },
  totalRevenue: 25000000,
  pendingPayments: 3,
  soldProperties: 5,
  unsoldProperties: 10,
  activeLeads: 25,
  averageRating: 4.5,
  todaySchedules: 2,
  tomorrowSchedules: 1
};

export const demoRecentActivities = [
  {
    id: 1,
    type: 'lead',
    message: 'New lead John Doe interested in Luxury Villa',
    time: new Date().toLocaleString(),
    icon: 'BiUserPlus',
    color: 'green',
    status: 'info'
  },
  {
    id: 2,
    type: 'property',
    message: 'New property Modern Apartment listed',
    time: new Date(Date.now() - 3600000).toLocaleString(),
    icon: 'FaBuilding',
    color: 'orange',
    status: 'info'
  }
];

export const demoMeetingStatuses = [
  {
    _id: 'status_1',
    name: 'SCHEDULED',
    description: 'Meeting has been scheduled',
    color: '#3182CE',
    published: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'status_2',
    name: 'COMPLETED',
    description: 'Meeting has been completed',
    color: '#38A169',
    published: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'status_3',
    name: 'CANCELLED',
    description: 'Meeting has been cancelled',
    color: '#E53E3E',
    published: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'status_4',
    name: 'RESCHEDULED',
    description: 'Meeting has been rescheduled',
    color: '#D69E2E',
    published: true,
    createdAt: new Date().toISOString()
  }
];

export const demoDocumentTypes = [
  {
    _id: 'doc_type_1',
    name: 'AGREEMENT',
    description: 'Legal agreements and contracts',
    published: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'doc_type_2',
    name: 'KYC',
    description: 'Know Your Customer documents',
    published: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'doc_type_3',
    name: 'IDENTITY_PROOF',
    description: 'Identity verification documents',
    published: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'doc_type_4',
    name: 'PROPERTY_DOCS',
    description: 'Property-related documents',
    published: true,
    createdAt: new Date().toISOString()
  }
];

export const demoLeadStatuses = [
  {
    _id: 'lead_status_1',
    name: 'New',
    description: 'Newly created lead',
    published: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'lead_status_2',
    name: 'Contacted',
    description: 'Lead has been contacted',
    published: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'lead_status_3',
    name: 'Qualified',
    description: 'Lead has been qualified',
    published: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'lead_status_4',
    name: 'Converted',
    description: 'Lead converted to customer',
    published: true,
    createdAt: new Date().toISOString()
  }
];

export const demoFollowUpStatuses = [
  {
    _id: 'follow_status_1',
    name: 'Pending',
    description: 'Follow-up is pending',
    published: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'follow_status_2',
    name: 'Scheduled',
    description: 'Follow-up has been scheduled',
    published: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'follow_status_3',
    name: 'Completed',
    description: 'Follow-up has been completed',
    published: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'follow_status_4',
    name: 'Cancelled',
    description: 'Follow-up has been cancelled',
    published: true,
    createdAt: new Date().toISOString()
  }
];

export const demoReferenceSources = [
  {
    _id: 'ref_source_1',
    name: 'Website',
    description: 'Lead came from website',
    published: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'ref_source_2',
    name: 'Referral',
    description: 'Lead came from referral',
    published: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'ref_source_3',
    name: 'Social Media',
    description: 'Lead came from social media',
    published: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'ref_source_4',
    name: 'Walk-in',
    description: 'Lead came from walk-in',
    published: true,
    createdAt: new Date().toISOString()
  }
];

export const demoPropertyTypes = [
  {
    _id: 'prop_type_1',
    typeName: 'Villa',
    description: 'Independent villa properties',
    published: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prop_type_2',
    typeName: 'Apartment',
    description: 'Apartment units in buildings',
    published: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prop_type_3',
    typeName: 'Plot',
    description: 'Land plots for sale',
    published: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prop_type_4',
    typeName: 'Commercial',
    description: 'Commercial properties',
    published: true,
    createdAt: new Date().toISOString()
  }
];
