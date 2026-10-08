/**
 * Diagnostic Care — Comprehensive Nationwide Healthcare Services Engine
 * Connects Patients, Doctors, Hospitals, Diagnostic Centers, Pharmacies,
 * Ambulances, Home Healthcare, Leads, and Support Ticketing.
 */

import {
  Organization,
  HospitalDetails,
  PharmacyDetails,
  AmbulanceFleetItem,
  HomeCareServiceItem,
  HealthcareServiceRequest,
  LeadItem,
  SupportTicket,
  SupportMessage,
  VerificationStatus,
  CMSBanner,
  MarketingPromotion,
} from '@/types';

class ServicesEngine {
  private organizations: Organization[] = [
    {
      id: 'org-popular-moulvibazar',
      name: 'Popular Diagnostic Center (Moulvibazar)',
      slug: 'popular-diagnostic-center-moulvibazar',
      orgType: 'DIAGNOSTIC_CENTER',
      tradeLicenseNumber: 'TRAD/MB/2024/0981',
      logoUrl: '/logo.png',
      contactPhone: '01886748564',
      contactEmail: 'moulvibazar@populardiagnostic.com',
      verificationStatus: 'VERIFIED',
      isFeatured: true,
      rating: 4.9,
      reviewCount: 142,
      branches: [
        {
          id: 'branch-popular-sadar',
          organizationId: 'org-popular-moulvibazar',
          name: 'Moulvibazar Main Branch',
          isMainBranch: true,
          upazilaId: 'upz-moulvibazar-sadar',
          upazilaName: 'Moulvibazar Sadar',
          districtName: 'Moulvibazar',
          addressLine: 'Chowmohana, Syed Mujtoba Ali Road',
          phone: '01886748564',
          openingTime: '07:30',
          closingTime: '23:00',
          isActive: true,
        },
      ],
    },
    {
      id: 'org-square-hospital-dhaka',
      name: 'Square Hospitals Ltd. (Dhaka)',
      slug: 'square-hospitals-dhaka',
      orgType: 'HOSPITAL',
      tradeLicenseNumber: 'TRAD/DHK/2023/8891',
      logoUrl: '/logo.png',
      contactPhone: '10616',
      contactEmail: 'info@squarehospital.com',
      verificationStatus: 'VERIFIED',
      isFeatured: true,
      rating: 4.9,
      reviewCount: 380,
      branches: [
        {
          id: 'branch-square-panthapath',
          organizationId: 'org-square-hospital-dhaka',
          name: 'Main Tertiary Care Facility',
          isMainBranch: true,
          upazilaId: 'upz-dhanmondi',
          upazilaName: 'Panthapath / Dhanmondi',
          districtName: 'Dhaka',
          addressLine: '18/F Bir Uttam Qazi Nuruzzaman Sarak, Dhaka 1205',
          phone: '10616',
          openingTime: '00:00',
          closingTime: '23:59',
          isActive: true,
        },
      ],
    },
    {
      id: 'org-osmani-medical-sylhet',
      name: 'Sylhet MAG Osmani Medical College & Hospital',
      slug: 'mag-osmani-medical-sylhet',
      orgType: 'HOSPITAL',
      tradeLicenseNumber: 'GOV/SYL/1962/001',
      logoUrl: '/logo.png',
      contactPhone: '01886748564',
      verificationStatus: 'VERIFIED',
      isFeatured: true,
      rating: 4.6,
      reviewCount: 210,
      branches: [
        {
          id: 'branch-osmani-main',
          organizationId: 'org-osmani-medical-sylhet',
          name: 'Main Hospital Complex',
          isMainBranch: true,
          upazilaId: 'upz-sylhet-sadar',
          upazilaName: 'Sylhet Sadar',
          districtName: 'Sylhet',
          addressLine: 'Medical College Road, Kajolshah, Sylhet',
          phone: '01886748564',
          openingTime: '00:00',
          closingTime: '23:59',
          isActive: true,
        },
      ],
    },
    {
      id: 'org-lazz-pharma-sylhet',
      name: 'Lazz Pharma (Sylhet & Moulvibazar Delivery Hub)',
      slug: 'lazz-pharma-sylhet',
      orgType: 'PHARMACY',
      tradeLicenseNumber: 'DRUG/SYL/2022/4119',
      logoUrl: '/logo.png',
      contactPhone: '01886748564',
      verificationStatus: 'VERIFIED',
      isFeatured: true,
      rating: 4.8,
      reviewCount: 94,
      branches: [
        {
          id: 'branch-lazz-amberkhana',
          organizationId: 'org-lazz-pharma-sylhet',
          name: 'Amberkhana Point Branch',
          isMainBranch: true,
          upazilaId: 'upz-sylhet-sadar',
          upazilaName: 'Amberkhana',
          districtName: 'Sylhet',
          addressLine: 'Airport Road, Amberkhana Point',
          phone: '01886748564',
          openingTime: '08:00',
          closingTime: '23:30',
          isActive: true,
        },
      ],
    },
  ];

  private hospitalDetails: Map<string, HospitalDetails> = new Map([
    [
      'org-square-hospital-dhaka',
      {
        organizationId: 'org-square-hospital-dhaka',
        totalBeds: 450,
        icuBeds: 45,
        nicuBeds: 20,
        hasEmergency24h: true,
        hasBloodBank: true,
        hasAmbulanceFleet: true,
        specialistCount: 160,
        featuredDepartments: ['Cardiology', 'Neurology', 'Oncology', 'Orthopedics', 'Pediatrics'],
      },
    ],
    [
      'org-osmani-medical-sylhet',
      {
        organizationId: 'org-osmani-medical-sylhet',
        totalBeds: 900,
        icuBeds: 30,
        nicuBeds: 18,
        hasEmergency24h: true,
        hasBloodBank: true,
        hasAmbulanceFleet: true,
        specialistCount: 120,
        featuredDepartments: ['Internal Medicine', 'Surgery', 'Gynecology', 'Cardiovascular', 'Nephrology'],
      },
    ],
  ]);

  private ambulanceFleet: AmbulanceFleetItem[] = [
    {
      id: 'amb-mb-01',
      organizationId: 'org-popular-moulvibazar',
      providerName: 'মৌলভীবাজার সেন্ট্রাল ইমার্জেন্সি অ্যাম্বুলেন্স সার্ভিস',
      vehicleType: 'ICU',
      vehiclePlateNumber: 'সিলেট-ছ-১১-৪৫০২',
      driverName: 'মো. রফিক উদ্দিন (Rafiq Uddin)',
      driverPhone: '01886748564',
      baseFareBDT: 1500,
      perKmFareBDT: 45,
      districtName: 'Moulvibazar',
      upazilaName: 'Moulvibazar Sadar',
      isAvailable24h: true,
      status: 'AVAILABLE',
    },
    {
      id: 'amb-syl-02',
      organizationId: 'org-osmani-medical-sylhet',
      providerName: 'সিলেট মেট্রো লাইফ সাপোর্ট অ্যাম্বুলেন্স',
      vehicleType: 'AC',
      vehiclePlateNumber: 'সিলেট-ছ-১২-৯৮২০',
      driverName: 'আব্দুল করিম (Abdul Karim)',
      driverPhone: '01886748564',
      baseFareBDT: 1200,
      perKmFareBDT: 35,
      districtName: 'Sylhet',
      upazilaName: 'Sylhet Sadar',
      isAvailable24h: true,
      status: 'AVAILABLE',
    },
    {
      id: 'amb-dhk-03',
      organizationId: 'org-square-hospital-dhaka',
      providerName: 'স্কয়ার হসপিটাল ক্রিটিক্যাল কেয়ার অ্যাম্বুলেন্স',
      vehicleType: 'ICU',
      vehiclePlateNumber: 'ঢাকা-মেট্রো-ছ-১৪-১১০২',
      driverName: 'মো. আলমগীর হোসেন',
      driverPhone: '10616',
      baseFareBDT: 2500,
      perKmFareBDT: 60,
      districtName: 'Dhaka',
      upazilaName: 'Dhanmondi',
      isAvailable24h: true,
      status: 'AVAILABLE',
    },
  ];

  private homeCareServices: HomeCareServiceItem[] = [
    {
      id: 'homecare-01',
      organizationId: 'org-popular-moulvibazar',
      providerName: 'কেয়ারপ্লাস হোম নার্সিং সার্ভিসেস (মৌলভীবাজার)',
      serviceCategory: 'HOME_NURSING',
      title: 'দক্ষ নার্স দ্বারা পোস্ট-অপারেটিভ ও স্যালাইন কেয়ার',
      description: 'সার্জারি পরবর্তী ড্রেসিং, ইনজেকশন, স্যালাইন পুশ এবং ভাইটাল সাইন মনিটরিং বাসায় পৌঁছে প্রদান।',
      feePerVisitBDT: 800,
      districtName: 'Moulvibazar',
      upazilaName: 'Moulvibazar Sadar',
      nurseCertification: 'BNC Registered Diploma Nurse',
      rating: 4.9,
      reviewCount: 32,
      isActive: true,
    },
    {
      id: 'homecare-02',
      organizationId: 'org-osmani-medical-sylhet',
      providerName: 'সিলেট ফিজিওথেরাপি ও রিহ্যাবিলিটেশন সেন্টার',
      serviceCategory: 'PHYSIOTHERAPY',
      title: 'স্ট্রোক ও প্যারালাইসিস রোগীর বিশেষজ্ঞ ফিজিওথেরাপি',
      description: 'অভিজ্ঞ ফিজিওথেরাপিস্ট দ্বারা হোম ভিজিটে এক্সারসাইজ ও ইলেক্ট্রোথেরাপি সাপোর্ট।',
      feePerVisitBDT: 1200,
      districtName: 'Sylhet',
      upazilaName: 'Sylhet Sadar',
      nurseCertification: 'BPT Certified Physiotherapist',
      rating: 4.8,
      reviewCount: 46,
      isActive: true,
    },
    {
      id: 'homecare-03',
      organizationId: 'org-square-hospital-dhaka',
      providerName: 'স্কয়ার হোম হেলথ সল্যুশনস (ঢাকা)',
      serviceCategory: 'ELDERLY_CARE',
      title: 'প্রবীণ রোগীর ১২ ঘণ্টার ফুল-শিফট হোম অ্যাটেনডেন্ট',
      description: 'বিছানায় থাকা বয়স্ক রোগীদের সার্বক্ষণিক যত্ন, ডায়াবেটিস চেক ও মেডিসিন প্রশাসন।',
      feePerVisitBDT: 2000,
      districtName: 'Dhaka',
      upazilaName: 'Uttara / Dhanmondi',
      nurseCertification: 'Certified Caregiver Institute',
      rating: 4.9,
      reviewCount: 78,
      isActive: true,
    },
  ];

  private serviceRequests: HealthcareServiceRequest[] = [
    {
      id: 'req-amb-101',
      requestNumber: 'SR-AMB-2026-101',
      patientUserId: 'user-patient-current',
      patientName: 'তানভীর আহমেদ',
      patientPhone: '01712000001',
      serviceType: 'AMBULANCE',
      providerId: 'amb-mb-01',
      providerName: 'মৌলভীবাজার সেন্ট্রাল ইমার্জেন্সি অ্যাম্বুলেন্স সার্ভিস',
      districtName: 'Moulvibazar',
      upazilaName: 'Moulvibazar Sadar',
      deliveryAddress: 'চৌমোহনা, কোর্ট রোড, মৌলভীবাজার',
      requestedDate: new Date().toISOString(),
      status: 'DISPATCHED',
      estimatedAmountBDT: 1500,
      paymentMethod: 'CASH',
      details: 'জরুরি কার্ডিয়াক রোগী স্থানান্তর',
      createdAt: new Date().toISOString(),
    },
  ];

  private leads: LeadItem[] = [
    {
      id: 'lead-01',
      businessName: 'গ্রীনভিউ ডিজিটাল প্যাথলজি ও ক্লিনিক',
      contactPerson: 'ডাঃ মো. কামরুজ্জামান (পরিচালক)',
      phone: '01711889900',
      email: 'greenview.mb@gmail.com',
      providerType: 'DIAGNOSTIC_CENTER',
      leadSource: 'PHONE_CALL',
      stage: 'INTERESTED',
      assignedToAgentName: 'মাহমুদুল হক (Lead Executive)',
      districtName: 'Moulvibazar',
      potentialMonthlyRevenueBDT: 15000,
      notes: 'মৌলভীবাজার কুলাউড়া রোডে নতুন ব্রাঞ্চ উদ্বোধন হয়েছে। সফটওয়্যার ডেমো দেখার আগ্রহ প্রকাশ করেছেন।',
      nextFollowupDate: '2026-10-10',
      createdAt: '2026-10-01T10:00:00Z',
    },
    {
      id: 'lead-02',
      businessName: 'সিলেট মডার্ন ট্রমা সেন্টার',
      contactPerson: 'এম. এ. মতিন (ম্যানেজার)',
      phone: '01819776655',
      providerType: 'HOSPITAL',
      leadSource: 'WEBSITE',
      stage: 'ONBOARDING',
      assignedToAgentName: 'ফারজানা আক্তার (Regional Manager)',
      districtName: 'Sylhet',
      potentialMonthlyRevenueBDT: 45000,
      notes: 'ট্রেড লাইসেন্স ও সিভিল সার্জন এনওসি ভেরিফিকেশনে পাঠানো হয়েছে।',
      nextFollowupDate: '2026-10-08',
      createdAt: '2026-10-03T14:30:00Z',
    },
  ];

  private supportTickets: SupportTicket[] = [
    {
      id: 'tick-2026-001',
      ticketNumber: 'TCK-2026-8812',
      requesterUserId: 'user-patient-current',
      requesterName: 'তানভীর আহমেদ',
      requesterPhone: '01712000001',
      requesterRole: 'PATIENT',
      subject: 'সিবিসি টেস্টের ডিজিটাল পিডিএফ ডাউনলোডে ওটিপি বিলম্ব',
      category: 'MEDICAL_REPORT',
      priority: 'HIGH',
      status: 'RESOLVED',
      assignedAgentName: 'সাদিয়া আফরোজ (Customer Care)',
      messages: [
        {
          id: 'msg-1',
          senderUserId: 'user-patient-current',
          senderName: 'তানভীর আহমেদ',
          senderRole: 'PATIENT',
          message: 'আমার রিপোর্টে ক্লিক করার পর এসএমএস আসতে প্রায় ২ মিনিট সময় লেগেছে।',
          timestamp: '2026-10-04T12:00:00Z',
        },
        {
          id: 'msg-2',
          senderUserId: 'agent-support-1',
          senderName: 'সাদিয়া আফরোজ',
          senderRole: 'SUPPORT_AGENT',
          message: 'প্রিয় তানভীর সাহেব, গ্রামীণফোন গেটওয়ে রিস্টার্ট হওয়ার কারণে বিলম্ব হয়েছিল। বর্তমানে ওটিপি লেটেন্সি স্বাভাবিক (২ সেকেন্ড) করা হয়েছে।',
          timestamp: '2026-10-04T12:10:00Z',
        },
      ],
      createdAt: '2026-10-04T12:00:00Z',
      updatedAt: '2026-10-04T12:15:00Z',
    },
  ];

  private banners: CMSBanner[] = [
    {
      id: 'banner-01',
      title: 'মৌলভীবাজার ও সিলেটে বিশেষজ্ঞ ডাক্তারদের সিরিয়াল এখন ঘরে বসেই',
      subtitle: 'পপুলার ডায়াগনস্টিক, সেন্ট্রাল ক্লিনিক ও শীর্ষ চিকিৎসকদের লাইভ কিউ ট্র্যাকিং',
      ctaText: 'সিরিয়াল বুক করুন',
      ctaLink: '#doctors-section',
      bgColor: '#0B2545',
      badge: 'সারাদেশে সেবা শুরু',
      isActive: true,
    },
    {
      id: 'banner-02',
      title: 'জরুরি অ্যাম্বুলেন্স ও হোম নার্সিং সার্ভিসেস',
      subtitle: 'আইসিইউ ও এসি অ্যাম্বুলেন্স তাৎক্ষণিক কল ডেসপ্যাচ — ২৪/৭ হেল্পলাইন: 01886748564',
      ctaText: 'অ্যাম্বুলেন্স খুঁজুন',
      ctaLink: '#ambulance-section',
      bgColor: '#134074',
      badge: 'জরুরি রেসপন্স',
      isActive: true,
    },
  ];

  // --- QUERY METHODS ---

  public getOrganizations(type?: Organization['orgType']) {
    if (!type) return this.organizations;
    return this.organizations.filter((o) => o.orgType === type);
  }

  public getHospitalDetails(organizationId: string) {
    return this.hospitalDetails.get(organizationId);
  }

  public getAmbulances(district?: string) {
    if (!district || district === 'ALL') return this.ambulanceFleet;
    return this.ambulanceFleet.filter((a) => a.districtName.toLowerCase() === district.toLowerCase());
  }

  public getHomeCareServices(district?: string) {
    if (!district || district === 'ALL') return this.homeCareServices;
    return this.homeCareServices.filter((h) => h.districtName.toLowerCase() === district.toLowerCase());
  }

  public getServiceRequests(userId?: string) {
    if (!userId) return this.serviceRequests;
    return this.serviceRequests.filter((r) => r.patientUserId === userId);
  }

  public createServiceRequest(payload: Omit<HealthcareServiceRequest, 'id' | 'requestNumber' | 'createdAt'>): HealthcareServiceRequest {
    const newReq: HealthcareServiceRequest = {
      id: `req-${Date.now()}`,
      requestNumber: `SR-${payload.serviceType}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      ...payload,
    };
    this.serviceRequests.unshift(newReq);
    return newReq;
  }

  public getLeads(stage?: LeadItem['stage']) {
    if (!stage) return this.leads;
    return this.leads.filter((l) => l.stage === stage);
  }

  public updateLeadStage(leadId: string, stage: LeadItem['stage'], note?: string): boolean {
    const lead = this.leads.find((l) => l.id === leadId);
    if (!lead) return false;
    lead.stage = stage;
    if (note) {
      lead.notes = `${lead.notes}\n[${new Date().toISOString().split('T')[0]}] ${note}`;
    }
    return true;
  }

  public createLead(leadData: Omit<LeadItem, 'id' | 'createdAt'>): LeadItem {
    const newLead: LeadItem = {
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...leadData,
    };
    this.leads.unshift(newLead);
    return newLead;
  }

  public getSupportTickets() {
    return this.supportTickets;
  }

  public createSupportTicket(payload: {
    requesterUserId: string;
    requesterName: string;
    requesterPhone: string;
    subject: string;
    category: SupportTicket['category'];
    priority: SupportTicket['priority'];
    message: string;
  }): SupportTicket {
    const newTicket: SupportTicket = {
      id: `tick-${Date.now()}`,
      ticketNumber: `TCK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      requesterUserId: payload.requesterUserId,
      requesterName: payload.requesterName,
      requesterPhone: payload.requesterPhone,
      requesterRole: 'PATIENT',
      subject: payload.subject,
      category: payload.category,
      priority: payload.priority,
      status: 'OPEN',
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderUserId: payload.requesterUserId,
          senderName: payload.requesterName,
          senderRole: 'PATIENT',
          message: payload.message,
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.supportTickets.unshift(newTicket);
    return newTicket;
  }

  public addSupportMessage(ticketId: string, sender: { userId: string; name: string; role: any }, message: string): boolean {
    const ticket = this.supportTickets.find((t) => t.id === ticketId);
    if (!ticket) return false;
    ticket.messages.push({
      id: `msg-${Date.now()}`,
      senderUserId: sender.userId,
      senderName: sender.name,
      senderRole: sender.role,
      message,
      timestamp: new Date().toISOString(),
    });
    ticket.updatedAt = new Date().toISOString();
    return true;
  }

  public updateProviderVerification(orgId: string, status: VerificationStatus): boolean {
    const org = this.organizations.find((o) => o.id === orgId);
    if (!org) return false;
    org.verificationStatus = status;
    return true;
  }

  public getBanners() {
    return this.banners.filter((b) => b.isActive);
  }
}

export const servicesEngine = new ServicesEngine();
