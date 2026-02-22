"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
interface Translations {
  general: {
    search: string;
    to: string;
    from: string;
    days: string;
    other: string;
    currency: string;
    languageSwitch: string;
    contact: {
      title: string;
      email: string;
      phone: string;
      address: string;
      whatsapp: string;
    };
  };

  buttons: {
    bookNow: string;
    search: string;
    viewMore: string;
    submit: string;
    select: string;
    applyFilters: string;
    reset: string;
    contactUs: string;
    subscribe: string;
    viewDetails: string;
  };

  tours: {
    adventure: string;
    cultural: string;
    beach: string;
  };
  transfer: {
    baggage: string;
    family: string;
    group: string;
  };
  trips: {
    oneWay: string;
    roundTrip: string;
  };
  tickets: {
    flights: string;
    ferry: string;
  };

  form: {
    name: { label: string; placeholder: string };
    firstName: { label: string; placeholder: string };
    lastName: { label: string; placeholder: string };
    email: { label: string; placeholder: string };
    phone: { label: string; placeholder: string };
    address: { label: string; placeholder: string };
    subject: { label: string; placeholder: string };
    message: { label: string; placeholder: string };
    submit: string;
    personalInformation: string;
    errorMessages: {
      required: string;
      invalidEmail: string;
      invalidPhone: string;
    };
  };

  landingPage: {
    tripSectionTitle: string;
    tripSectionSubtitle: string;
    hotelSectionTitle: string;
    hotelSectionSubtitle: string;
    callToAction: string;
  };

  navbar: {
    tours: string;
    hotels: string;
    tickets: string;
    transfer: string;
    contact: string;
    bookings: string;
    about: string;
  };

  footer: {
    tagline: string;
    subscribeToNewsletter: string;
    emailPlaceholder: string;
    allRightsReserved: string;
    address: string;
    phone: string;
    email: string;
    followUs: string;
    quickLinks: string;
    termsConditions: string;
    privacyPolicy: string;
    newsletter: string;
    contactUs: string;
    socialMedia: {
      facebook: string; // Added for social media links
      instagram: string;
      twitter: string;
    };
  };

  transferPage: {
    packageRequest: string;
    description: string;
    transferDetails: string;
    transferType: string;
    selectType: string;
    region: string;
    selectRegion: string;
    destination: string;
    enterDestination: string;
    tripType: string;
    selectTripType: string;
    pickupAddress: string;
    enterPickupAddress: string;
    dropoffAddress: string;
    enterDropoffAddress: string;
    preferredDate: string; // Renamed for clarity
    specialRequest: string;
    whyChooseUs: {
      title: string;
      items: Array<{
        name: string;
        description: string; // Added for more detail
      }>;
    };
  };


  toursPage: {
    adventureTours: string;
    culturalTours: string;
    beachTours: string;
    toursFound: string;
    noToursFound: string;
    searchPlaceholder: string;
    travelerType: string;
    more: string;
    previous: string;
    next: string;
  };

  contactPage: {
    title: string;
    description: string;
    formTitle: string;
    contactInfo: string; // Fixed typo
    ourAddress: string; // Fixed typo
    phoneNumbers: string;
    emailAddresses: string;
    workingHours: string;
    mondayToFriday: string;
    saturday: string;
    sunday: string;
  };

  faqPage: {
    title: string;
    imageAlt: string;
    faqs: Array<{
      question: string;
      answer: string;
    }>;
  };


  ticketsBookingPage: {
    ferryTitle: string;
    flightTitle: string;
    ferrydescription: string;
    flightdescription: string;
    crossingAndCabinInfo: {
      flightCrossTitle: string;
      ferryCrossTitle: string;
      crossingType: {
        label: string;
        placeholder: string;
        options: {
          oneWay: string;
          roundTrip: string;
          openReturn: string;
        };
      };
      departureDate: {
        label: string;
      };
      departurePort: {
        label: string;
        placeholder: string;
      };
      departureAirPort: {
        label: string;
        placeholder: string;
      };
      arrivalAirPort: {
        label: string;
        placeholder: string;
      };
      arrivalPort: {
        label: string;
        placeholder: string;
      };
      cabinType: {
        label: string;
        placeholder: string;
        options: {
          inside: string;
          outside: string;
          deluxe: string;
          suite: string;
          none: string;
        };
      };
      vehicleType: {
        label: string;
        placeholder: string;
        options: {
          none: string;
          car: string;
          suv: string;
          van: string;
          motorcycle: string;
          other: string;
        };
      };
      class: {
        label: string;
        placeholder: string;
        options: {
          economy: string;
          business: string;
          first: string;
        };
      };
      airLine: {
        label: string;
        placeholder: string;
      };
    };
    travellersInfo: {
      title: string;
      adults: {
        label: string;
      };
      children: {
        label: string;
      };
      infants1to2: {
        label: string;
      };
      infantsUnder1: {
        label: string;
      };
      seniors: {
        label: string;
      };
    };
    contactInfo: {
      title: string;
      titleField: {
        label: string;
        placeholder: string;
        options: {
          mr: string;
          mrs: string;
          ms: string;
          dr: string;
        };
      };
      forename: {
        label: string;
        placeholder: string;
      };
      name: {
        label: string;
        placeholder: string;
      };
      email: {
        label: string;
        placeholder: string;
      };
      telephone: {
        label: string;
        placeholder: string;
      };
      dateOfBirth: {
        label: string;
      };
      passportNumber: {
        label: string;
        placeholder: string;
      };
    };
    observations: {
      title: string;
      placeholder: string;
    };
    buttons: {
      submitBooking: string;
      processing: string;
    };
    formErrors: {
      required: string;
      invalidEmail: string;
      invalidPhone: string;
      invalidDate: string;
    };
    ferryWhyBookWithUs: {
      title: string;
      items: Array<{
        name: string;
      }>;
    };
    flightWhyBookWithUs: {
      title: string;
      items: Array<{
        name: string;
      }>;
    };
  };
  bookingManagementPage: {
    title: string;
    description: string;
    card: {
      title: string;
      description: string;
    };
    form: {
      placeholder: string;
      buttons: {
        search: string;
        searching: string;
      };
      error: {
        emptyReference: string;
      };
    };
    referenceFormat: {
      title: string;
      hotels: {
        label: string;
        example: string;
      };
      services: {
        label: string;
        example: string;
      };
    };
    help: {
      findReference: string;
      contactSupport: string;
      supportEmail: string;
    };
  };

  bookingTrackingPage: {
    loading: {
      message: string;
    };
    error: {
      title: string;
      notFound: string;
      fetchFailed: string;
    };
    buttons: {
      backToSearch: string;
    };
    card: {
      title: string;
      bookedOn: string;
    };
    statuses: {
      confirmed: string;
      pending: string;
      canceled: string;
      completed: string;
    };
    tabs: {
      customerInfo: string;
    };
    customerInfo: {
      nameLabel: string;
      phoneLabel: string;
      emailLabel: string;
      na: string;
    };
  };
  hotelSearchPage: {
    title: string;
    description: string;
    found: string;
    noHotelFound: string;
    perNight: string;

    // Header
    filtersAndSearch: string;
    findYourPerfectStay: string;
    searchPlaceholder: string;

    // Dates Section
    dates: string;
    checkInDate: string;
    checkOutDate: string;
    selectDate: string;

    // Destination Section
    destination: string;
    selectDestination: string;
    loadingCities: string;

    // Rooms & Guests Section
    roomsAndGuests: string;
    room: string;
    adult: string;
    adults: string;
    child: string;
    children: string;
    noChildren: string;
    addChild: string;
    selectAge: string;
    yearsOld: string;
    lessThanOneYear: string;
    addRoom: string;
    removeRoom: string;

    // Hotel Categories Section
    hotelCategories: string;
    loadingCategories: string;

    // Tags Section
    tags: string;
    loadingTags: string;

    // Additional Options Section
    additionalOptions: string;
    showOnlyAvailableHotels: string;

    // Footer
    searchHotels: string;
    resetFilters: string;
  };

  detailsPage: {
    // Breadcrumb Navigation
    home: string;
    hotels: string;

    // Hero Section
    checkIn: string;

    // Tabs
    overview: string;
    amenities: string;
    policies: string;

    // Overview Tab
    about: string;
    contactInformation: string;
    checkInTime: string;
    tags: string;
    themes: string;

    // Amenities Tab
    hotelAmenities: string;
    mealPlansAvailable: string;

    // Policies Tab
    hotelPolicies: string;

    // Booking Card
    bookYourStay: string;
    checkAvailability: string;
    checkInCheckOut: string;
    selectDates: string;
    night: string;
    nights: string;
    roomConfiguration: string;
    room: string;
    rooms: string;
    adults: string;
    children: string;
    confirmChanges: string;
    selectMealPlan: string;
    availableRooms: string;
    available: string;
    freeCancellationUntil: string;
    selected: string;
    select: string;
    bookingSummary: string;
    total: string;
    proceedToBooking: string;

    // Room Configuration Dialog
    roomConfigurationTitle: string;
    remove: string;
    adultsLabel: string;
    selectNumberOfAdults: string;
    childrenLabel: string;
    addChild: string;
    noChildrenAdded: string;
    childAge: string;
    year: string;
    years: string;
    addAnotherRoom: string;

    // Map Card
    location: string;
    viewLargerMap: string;
    coordinates: string;

    // Booking Modal
    completeYourBooking: string;
    guestInfo: string;
    roomGuests: string;
    payment: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    primaryGuest: string;
    paymentMethod: string;
    specialRequests: string;
    specialRequestsPlaceholder: string;
    acceptTerms: string;
    back: string;
    next: string;
    completeBooking: string;
    error: string;
    selectCheckOut: string;
    selectDatesTitle: string;
    selectDatesPrompt: string;
    loading: string;
    noAvailability: string;
    checkAvailabilityPrompt: string;
  };
  serviceDetails: {
    // Error State
    packageNotFoundMessage: string;
    tripPackageNotFound: string;
    backToHome: string;

    // Breadcrumb Navigation
    home: string;
    trip: string;

    // Hero Section
    departure: string;
    days: string;
    available: string;

    // Tabs
    overview: string;
    itinerary: string;
    accommodation: string;
    inclusionstab: string;

    // Overview Tab
    aboutThisPackage: string;
    guidanceSupport: string;
    packageHighlights: string;

    // Itinerary Tab
    dayItinerary: string;
    meals: string;

    // Accommodation Tab
    accommodationDetails: string;
    hotel: string;
    transportation: string;
    transport: string;

    // Inclusions Tab
    packageInclusionsExclusions: string;
    inclusions: string;
    exclusions: string;
    mealsIncluded: string;
    visaProcessing: string;
    experiencedGuides: string;

    // Booking Card
    bookYourPackage: string;
    tax: string;
    perPerson: string;
    total: string;
    bookNow: string;
    departureLabel: string;
    returnLabel: string;
    roundTrip: string;
    oneWayTrip: string;
  };
  checkoutPage: {
    bookTourPackage: string;
    bookGeneric: string;
    tourDescription: string;

    // Progress Steps
    confirmation: string;

    // Booking Form - Step 1 (Contact Information)
    contactInformation: string; // t.contactPage.contactInfo
    personalInformation: string; // t.form.personalInformation
    firstNameLabel: string; // t.form.firstName.label
    firstNamePlaceholder: string; // t.form.firstName.placeholder
    lastNameLabel: string; // t.form.lastName.label
    lastNamePlaceholder: string; // t.form.lastName.placeholder
    emailLabel: string; // t.form.email.label
    emailPlaceholder: string; // t.form.email.placeholder
    phoneLabel: string; // t.form.phone.label
    phonePlaceholder: string; // t.form.phone.placeholder
    preferredContactMethod: string;
    contactPhone: string;
    contactEmail: string;
    contactWhatsApp: string;
    nationalityLabel: string;
    nationalityPlaceholder: string;
    passportNumberLabel: string; // t.ticketsBookingPage.contactInfo.passportNumber.label
    passportNumberPlaceholder: string; // t.ticketsBookingPage.contactInfo.passportNumber.placeholder
    addressLabel: string; // t.form.address.label
    addressPlaceholder: string; // t.form.address.placeholder

    // Booking Form - Step 2 (Travel Details)
    travelDetails: string;
    travelDetailsDescription: string;
    travellersInfoTitle: string; // t.ticketsBookingPage.travellersInfo.title
    adultsLabel: string;
    childrenLabel: string;
    startDateLabel: string;
    endDateLabel: string;
    pickADate: string;
    specialRequestsLabel: string; // t.detailsPage.specialRequests
    specialRequestsPlaceholder: string; // t.detailsPage.form.specialRequests

    // Booking Form - Step 3 (Review & Confirm)
    reviewAndConfirm: string;
    reviewAndConfirmDescription: string;
    bookingRequestOnly: true; // Flag for static string
    bookingRequestOnlyDescription: string;
    personalInfoTitle: string;
    nameLabel: string;
    emailLabelReview: string;
    phoneLabelReview: string;
    contactPreferenceLabel: string;
    nationalityLabelReview: string;
    passportNumberLabelReview: string;
    addressLabelReview: string;
    editButton: string;
    travelersLabel: string;
    adult: string;
    adults: string;
    child: string;
    children: string;
    startDateLabelReview: string;
    notSpecified: string;
    endDateLabelReview: string;
    priceDetailsTitle: string;
    acceptTerms: boolean; // Flag for static string
    termsAndConditions: string;
    termsLink: string;
    privacyLink: string;

    // Booking Form
    backButton: string;
    continueButton: string;
    submitBooking: string;
    processing: string;

    // Booking Summary
    bookingSummary: string; // t.detailsPage.bookingSummary
    packageLabel: string;
    tax: string; // t.ticketsBookingPage.tax
    total: string; // t.detailsPage.total
    days: string; // t.general.days
    bookingRequestInfo: string;
    payAtOffice: string;
  };

  all: string;
  loadingTours: string;
  errorLoadingTours: string;
  tryAgain: string;
  soldOut: string;
  guideIncluded: string;

  [key: string]: any;
}

interface LanguageContextType {
  t: Translations;
  changeLanguage: (langCode: string) => void;
  currentLanguage: string;
  isLoading: boolean;
}

const languages: Record<string, Translations> = {
  en: {
    general: {
      search: "Search",
      from: "From",
      to: "to",
      days: "days",
      other: "other",
      currency: "USD", // Added
      languageSwitch: "Change Language", // Added
      contact: {
        title: "Contact Us",
        email: "lta.leadertravelagency@gmail.com",
        phone: "54 222 153 | 54 222 175 | 56 521 032",
        address: "Tunis – Rue Abderrahmen Azzem, Monplaisir, Immobilier El Wifak, Bloc A, 5ème étage, Bureau 54",
        whatsapp: "54 222 153 | 54 222 175 | 56 521 032", // Added
      },
    },
    buttons: {
      bookNow: "Book Now",
      search: "Search",
      viewMore: "View More",
      submit: "Submit",
      select: "Select",
      applyFilters: "Apply",
      reset: "Reset",
      contactUs: "Contact Us",
      subscribe: "Subscribe",
      viewDetails: "View Details",
    },

    tours: {
      adventure: "Adventure",
      cultural: "Cultural",
      beach: "Beach",
    },
    transfer: {
      baggage: "Baggage Transfer",
      family: "Family Trip",
      group: "Group Travel",
    },
    trips: {
      oneWay: "One-Way",
      roundTrip: "Round-Trip",
    },
    tickets: {
      flights: "Flights",
      ferry: "Ferry",
    },

    form: {
      name: { label: "Full Name", placeholder: "Enter your full name" },
      firstName: { label: "First Name", placeholder: "Enter your first name" },
      lastName: { label: "Last Name", placeholder: "Enter your last name" },
      email: { label: "Email", placeholder: "Enter your email address" },
      phone: { label: "Phone", placeholder: "Enter your phone number" },
      address: { label: "Address", placeholder: "Enter your address" },
      subject: { label: "Subject", placeholder: "Enter a subject" },
      message: { label: "Message", placeholder: "Write your message here" },
      submit: "Submit",
      personalInformation:
        "Your personal information will remain confidential.",
      errorMessages: {
        required: "This field is required",
        invalidEmail: "Please enter a valid email address",
        invalidPhone: "Please enter a valid phone number",
      },
    },

    landingPage: {
      tripSectionTitle: "Discover Your Dream Destinations",
      tripSectionSubtitle:
        "Explore our curated selection of breathtaking destinations",
      hotelSectionTitle: "Unforgettable Hotel Stays",
      hotelSectionSubtitle: "Find the perfect accommodation for your journey",
      callToAction: "Book Your Adventure Now", // Added
    },

    navbar: {
      tours: "Tours",

      hotels: "Hotels",
      tickets: "Tickets",
      transfer: "Transfers",
      contact: "Contact",
      bookings: "My Bookings",
      about: "About Us", // Added
    },

    all: "All",
    loadingTours: "Loading tours...",
    errorLoadingTours: "Error loading tours",
    tryAgain: "Try Again",
    soldOut: "Sold Out",
    guideIncluded: "Guide Included",

    footer: {
      tagline: "Your trusted partner for unforgettable travel experiences.",
      subscribeToNewsletter:
        "Join our newsletter for exclusive offers and travel tips.",
      emailPlaceholder: "Enter your email",
      allRightsReserved: "All rights reserved.",
      address: "Tunis – Rue Abderrahmen Azzem, Monplaisir, Immobilier El Wifak, Bloc A, 5ème étage, Bureau 54",
      phone: "54 222 153 | 54 222 175 | 56 521 032",
      email: "lta.leadertravelagency@gmail.com",
      followUs: "Follow Us",
      quickLinks: "Quick Links",
      termsConditions: "Terms & Conditions",
      privacyPolicy: "Privacy Policy",
      newsletter: "Newsletter",
      contactUs: "Contact Us",
      socialMedia: {
        facebook: "Facebook",
        instagram: "Instagram",
        twitter: "Twitter",
      },
    },

    transferPage: {
      packageRequest: "Request a Transfer",
      description:
        "Effortlessly plan your transfers across Tunisia. Whether for baggage, family trips, or group travel, complete the form below for a tailored solution.",
      transferDetails: "Transfer Details",
      transferType: "Transfer Type",
      selectType: "Select transfer type",
      region: "Region in Tunisia",
      selectRegion: "Select a region",
      destination: "Destination",
      enterDestination: "Enter your destination",
      tripType: "Trip Type",
      selectTripType: "Select trip type",
      pickupAddress: "Pickup Address",
      enterPickupAddress: "Enter pickup address",
      dropoffAddress: "Dropoff Address",
      enterDropoffAddress: "Enter dropoff address",
      preferredDate: "Preferred Date",
      specialRequest: "Special Requests",
      whyChooseUs: {
        title: "Why Choose Us",
        items: [
          {
            name: "Reliable Service",
            description: "Punctual and dependable transfers every time.",
          },
          {
            name: "Comfortable Rides",
            description: "Modern vehicles for all group sizes.",
          },
          {
            name: "Transparent Pricing",
            description: "Affordable rates with no hidden fees.",
          },
          {
            name: "Expert Drivers",
            description: "Professional and knowledgeable staff.",
          },
        ],
      },
    },


    toursPage: {
      adventureTours: "Adventure Tours & Experiences",
      culturalTours: "Cultural Tours & Experiences",
      beachTours: "Beach Tours & Experiences",
      toursFound: "tours found",
      noToursFound: "No tours found",
      searchPlaceholder: "Search destinations or tours",
      travelerType: "Traveler Type",
      more: "More",
      previous: "Previous",
      next: "Next",
    },

    contactPage: {
      title: "Get in Touch",
      description:
        "Questions about our services or need help with your booking? Our team is here to assist you in planning your perfect trip.",
      formTitle: "Contact Form",
      contactInfo: "Contact Information",
      ourAddress: "Our Address",
      phoneNumbers: "Phone Numbers",
      emailAddresses: "Email Addresses",
      workingHours: "Working Hours",
      mondayToFriday: "Monday to Friday: 9:00 AM - 6:00 PM",
      saturday: "Saturday: 10:00 AM - 4:00 PM",
      sunday: "Sunday: Closed",
    },

    faqPage: {
      title: "Frequently Asked Questions",
      imageAlt: "Travel FAQs",
      faqs: [
        {
          question: "What documents are required for international travel?",
          answer:
            "A valid passport (with at least 6 months validity), visa (if required), travel insurance, and booking confirmations are typically needed. Contact our team for destination-specific requirements.",
        },
        {
          question: "Do you offer travel insurance?",
          answer:
            "Yes, we offer comprehensive travel insurance packages that cover medical emergencies, trip cancellations, lost luggage, and other unforeseen circumstances. Our consultants can help you select the best option for your trip.",
        },
        {
          question: "What is your cancellation policy?",
          answer:
            "Our cancellation policy varies by booking type and lead time. Generally, cancellations made 30+ days before departure receive a full refund minus admin fees. Cancellations 15-29 days before receive a 50% refund. Less than 15 days is usually non-refundable.",
        },
        {
          question: "Are group discounts available?",
          answer:
            "Yes, we offer discounts for groups of 15 or more. Contact us for a customized quote.",
        },
      ],
    },
    ticketsBookingPage: {
      ferryTitle: "Ferry Booking",
      ferrydescription:
        "Book your ferry crossing with ease. Fill out the form below to reserve your cabin and vehicle space.",
      flightTitle: "Flight Booking",
      flightdescription:
        "Book your flight tickets with ease. Fill out the form below to reserve your cabin and vehicle space.",
      crossingAndCabinInfo: {
        flightCrossTitle: "Crossing and Flight Information",
        ferryCrossTitle: "Crossing and Cabin Information",
        crossingType: {
          label: "Type of Crossing (*)",
          placeholder: "Select crossing type",
          options: {
            oneWay: "One-Way",
            roundTrip: "Round-Trip",
            openReturn: "Open Return",
          },
        },
        departureDate: {
          label: "Departure Date (*)",
        },
        departurePort: {
          label: "Port/Country of Departure (*)",
          placeholder: "e.g. Tunis, Tunisia",
        },
        departureAirPort: {
          label: "Airport of Departure (*)",
          placeholder: "e.g. Tunis Airport",
        },
        arrivalAirPort: {
          label: "Airport of Arrival (*)",
          placeholder: "e.g. Paris Charles de Gaulle Airport",
        },
        arrivalPort: {
          label: "Port/Country of Arrival (*)",
          placeholder: "e.g. Marseille, France",
        },
        cabinType: {
          label: "Cabin Type (*)",
          placeholder: "Select cabin type",
          options: {
            inside: "Inside Cabin",
            outside: "Outside Cabin",
            deluxe: "Deluxe Cabin",
            suite: "Suite",
            none: "No Cabin",
          },
        },
        vehicleType: {
          label: "Vehicle Type",
          placeholder: "Select vehicle type",
          options: {
            none: "No Vehicle",
            car: "Car (up to 5m)",
            suv: "SUV (5-6m)",
            van: "Van (6-7m)",
            motorcycle: "Motorcycle",
            other: "Other",
          },
        },
        class: {
          label: "Class",
          placeholder: "Select class",
          options: {
            economy: "Economy",
            business: "Business",
            first: "First",
          },
        },
        airLine: {
          label: "Airline",
          placeholder: "Select airline",
        },
      },
      travellersInfo: {
        title: "Travellers Information",
        adults: {
          label: "Adult(s) (16-60) (*)",
        },
        children: {
          label: "Child(ren) (2-16)",
        },
        infants1to2: {
          label: "Infant(s) (1-2)",
        },
        infantsUnder1: {
          label: "Infant(s) (under 1)",
        },
        seniors: {
          label: "Senior(s) (60+)",
        },
      },
      contactInfo: {
        title: "Contact Information (*)",
        titleField: {
          label: "Title",
          placeholder: "Select title",
          options: {
            mr: "Mr",
            mrs: "Mrs",
            ms: "Ms",
            dr: "Dr",
          },
        },
        forename: {
          label: "Forename (*)",
          placeholder: "Your first name",
        },
        name: {
          label: "Name (*)",
          placeholder: "Your last name",
        },
        email: {
          label: "Email (*)",
          placeholder: "Your email address",
        },
        telephone: {
          label: "Telephone (*)",
          placeholder: "Your phone number",
        },
        dateOfBirth: {
          label: "Date of Birth",
        },
        passportNumber: {
          label: "Passport Number",
          placeholder: "Your passport number",
        },
      },
      observations: {
        title: "Observations",
        placeholder: "Any special requests or additional information",
      },
      buttons: {
        submitBooking: "Submit Booking",
        processing: "Processing...",
      },
      formErrors: {
        required: "This field is required",
        invalidEmail: "Please enter a valid email address",
        invalidPhone: "Please enter a valid phone number",
        invalidDate: "Please select a valid departure date",
      },
      ferryWhyBookWithUs: {
        title: "Why Book With Us?",
        items: [
          { name: "Competitive ferry prices" },
          { name: "Wide selection of cabins" },
          { name: "Easy vehicle booking" },
          { name: "24/7 customer support" },
        ],
      },
      flightWhyBookWithUs: {
        title: "Why Book With Us?",
        items: [
          { name: "Great flight deals" },
          { name: "Multiple airline choices" },
          { name: "Secure and fast booking" },
          { name: "24/7 customer support" },
        ],
      },
    },
    bookingManagementPage: {
      title: "Track Your Booking",
      description:
        "Easily find your reservation details by entering your booking reference number below. Whether you booked a hotel, service, or tour, you can check the status, view details, or manage your booking—all in one place.",
      card: {
        title: "Find Your Booking",
        description:
          "Enter your booking reference number to view or manage your booking",
      },
      form: {
        placeholder:
          "Enter booking reference (e.g., BK-H-123456 or BK-S-123456)",
        buttons: {
          search: "Search",
          searching: "Searching",
        },
        error: {
          emptyReference: "Please enter a booking reference",
        },
      },
      referenceFormat: {
        title: "Booking Reference Format",
        hotels: {
          label: "Hotels",
          example: "BK-H-XXXXXX (e.g., BK-H-123456)",
        },
        services: {
          label: "Services",
          example: "BK-S-XXXXXX (e.g., BK-S-789012)",
        },
      },
      help: {
        findReference: "Need help finding your booking reference?",
        contactSupport:
          "Check your confirmation email or contact our customer support at",
        supportEmail: "support@example.com",
      },
    },
    bookingTrackingPage: {
      loading: {
        message: "Loading booking details...",
      },
      error: {
        title: "Error",
        notFound:
          "Booking not found. Please check the reference number and try again.",
        fetchFailed: "Unable to find booking with the provided reference.",
      },
      buttons: {
        backToSearch: "Back to search",
      },
      card: {
        title: "Booking Reference: {ref}",
        bookedOn: "Booked on: {date}",
      },
      statuses: {
        confirmed: "Confirmed",
        pending: "Pending",
        canceled: "Canceled",
        completed: "Completed",
      },
      tabs: {
        customerInfo: "Customer Information",
      },
      customerInfo: {
        nameLabel: "{firstName} {lastName}",
        phoneLabel: "Phone: {phone}",
        emailLabel: "Email: {email}",
        na: "N/A",
      },
    },
    hotelSearchPage: {
      title: "Hotel Search",
      description:
        "Discover the perfect place to stay during your trip. Search and compare hotels across Tunisia by location, date, and preferences. Whether you're looking for luxury, comfort, or budget-friendly options, we've got you covered.",
      found: "found",
      noHotelFound: "No hotel found",
      perNight: "per night",
      filtersAndSearch: "Filters & Search",
      findYourPerfectStay: "Find your perfect stay",
      searchPlaceholder: "Search by hotel name...",

      // Dates Section
      dates: "Dates",
      checkInDate: "Check-in Date",
      checkOutDate: "Check-out Date",
      selectDate: "Select date",

      // Destination Section
      destination: "Destination",
      selectDestination: "Select destination",
      loadingCities: "Loading cities...",

      // Rooms & Guests Section
      roomsAndGuests: "Rooms & Guests",
      room: "Room",
      adult: "Adult",
      adults: "Adults",
      child: "Child",
      children: "Children",
      noChildren: "No children",
      addChild: "Add Child",
      selectAge: "Select age",
      yearsOld: "years old",
      lessThanOneYear: "< 1 year",
      addRoom: "Add Room",
      removeRoom: "Remove Room",

      // Hotel Categories Section
      hotelCategories: "Hotel Categories",
      loadingCategories: "Loading categories...",

      // Tags Section
      tags: "Tags",
      loadingTags: "Loading tags...",

      // Additional Options Section
      additionalOptions: "Additional Options",
      showOnlyAvailableHotels: "Show only available hotels",

      // Footer
      searchHotels: "Search Hotels",
      resetFilters: "Reset Filters",
    },
    detailsPage: {
      home: "Home",
      hotels: "Hotels",

      // Hero Section
      checkIn: "Check in",

      // Tabs
      overview: "Overview",
      amenities: "Amenities",
      policies: "Policies",

      // Overview Tab
      about: "About",
      contactInformation: "Contact Information",
      checkInTime: "Check-in time",
      tags: "Tags",
      themes: "Themes",

      // Amenities Tab
      hotelAmenities: "Hotel Amenities",
      mealPlansAvailable: "Meal Plans Available",

      // Policies Tab
      hotelPolicies: "Hotel Policies",

      // Booking Card
      bookYourStay: "Book Your Stay",
      checkAvailability: "Check Availability",
      checkInCheckOut: "Check-in / Check-out",
      selectDates: "Select dates",
      night: "night",
      nights: "nights",
      roomConfiguration: "Room Configuration",
      room: "room",
      rooms: "rooms",
      adults: "adults",
      children: "children",
      confirmChanges: "Confirm Changes",
      selectMealPlan: "Select Meal Plan",
      availableRooms: "Available Rooms",
      available: "Available",
      freeCancellationUntil: "Free cancellation until",
      selected: "Selected",
      select: "Select",
      bookingSummary: "Booking Summary",
      total: "Total",
      proceedToBooking: "Proceed to Booking",

      // Room Configuration Dialog
      roomConfigurationTitle: "Room Configuration",
      remove: "Remove",
      adultsLabel: "Adults",
      selectNumberOfAdults: "Select number of adults",
      childrenLabel: "Children",
      addChild: "Add Child",
      noChildrenAdded: "No children added",
      childAge: "Child Age",
      year: "year",
      years: "years",
      addAnotherRoom: "Add Another Room",

      // Map Card
      location: "Location",
      viewLargerMap: "View Larger Map",
      coordinates: "Coordinates",

      // Booking Modal
      completeYourBooking: "Complete Your Booking",
      guestInfo: "Guest Info",
      roomGuests: "Room Guests",
      payment: "Payment",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      phoneNumber: "Phone Number",
      address: "Address",
      city: "City",
      postalCode: "Postal Code",
      country: "Country",
      primaryGuest: "Primary Guest",
      paymentMethod: "Payment Method",
      specialRequests: "Special Requests",
      specialRequestsPlaceholder: "Any special requests or requirements?",
      acceptTerms:
        "I agree to the terms and conditions, including the cancellation policy",
      back: "Back",
      next: "Next",
      completeBooking: "Complete Booking",
      error: "Error",
      selectCheckOut: "Select check-out date",
      selectDatesTitle: "Select Dates",
      selectDatesPrompt: "Please select your stay dates to see available rooms and prices.",
      loading: "Loading availability...",
      noAvailability: "No availability found for these dates.",
      checkAvailabilityPrompt: "Please select dates to check availability.",
    },
    serviceDetails: {
      packageNotFoundMessage:
        "The package you're looking for doesn't exist or has been removed.",
      tripPackageNotFound: "Trip package not found",
      backToHome: "Back to home",

      // Breadcrumb Navigation
      home: "Home",
      trip: "Tours",

      // Hero Section
      departure: "Departure",
      days: "days",
      available: "AVAILABLE",

      // Tabs
      overview: "Overview",
      itinerary: "Itinerary",
      accommodation: "Accommodation",
      inclusionstab: "Inclusions",

      // Overview Tab
      aboutThisPackage: "About This Package",
      guidanceSupport:
        "Our experienced guides will accompany you throughout the journey, providing spiritual guidance and ensuring all rituals are performed correctly. Enjoy comfortable transportation, delicious meals, and the peace of mind that comes with our 24/7 support services.",
      packageHighlights: "Package Highlights",

      // Itinerary Tab
      dayItinerary: "Day Itinerary",
      meals: "Meals",

      // Accommodation Tab
      accommodationDetails: "Accommodation Details",
      hotel: "Hotel",
      transportation: "Transportation",
      transport: "Transport",

      // Inclusions Tab
      packageInclusionsExclusions: "Package Inclusions & Exclusions",
      inclusions: "Inclusions",
      exclusions: "Exclusions",
      mealsIncluded: "Meals included",
      visaProcessing: "Visa processing and fees",
      experiencedGuides: "Experienced guides and religious scholars",

      // Booking Card
      bookYourPackage: "Book Your Package",
      tax: "tax",
      perPerson: "Per Person",
      total: "Total",
      bookNow: "Book Now",
      departureLabel: "Departure",
      returnLabel: "Return",
      roundTrip: "Round trip",
      oneWayTrip: "One way trip",
    },
    checkoutPage: {
      bookTourPackage: "Your Tour Package",
      bookGeneric: "Booking",
      tourDescription:
        "Explore unforgettable destinations with our tour packages. Whether you're seeking adventure, culture, or relaxation, personalize your itinerary and book your next great escape with ease.",

      // Progress Steps
      confirmation: "Confirmation",

      // Booking Form - Step 1 (Contact Information)
      contactInformation: "Contact Information",
      personalInformation: "Please provide your personal information",
      firstNameLabel: "First Name",
      firstNamePlaceholder: "Enter your first name",
      lastNameLabel: "Last Name",
      lastNamePlaceholder: "Enter your last name",
      emailLabel: "Email",
      emailPlaceholder: "Enter your email address",
      phoneLabel: "Phone Number",
      phonePlaceholder: "Enter your phone number",
      preferredContactMethod: "Preferred Contact Method",
      contactPhone: "Phone",
      contactEmail: "Email",
      contactWhatsApp: "WhatsApp",
      nationalityLabel: "Nationality",
      nationalityPlaceholder: "Enter your nationality",
      passportNumberLabel: "Passport Number",
      passportNumberPlaceholder: "Enter your passport number",
      addressLabel: "Address",
      addressPlaceholder: "Enter your address",

      // Booking Form - Step 2 (Travel Details)
      travelDetails: "Travel Details",
      travelDetailsDescription: "Provide information about your travel plans",
      travellersInfoTitle: "Traveller Information",
      adultsLabel: "Adults",
      childrenLabel: "Children (Under 12)",
      startDateLabel: "Start Date",
      endDateLabel: "End Date",
      pickADate: "Pick a date",
      specialRequestsLabel: "Special Requests",
      specialRequestsPlaceholder: "Any special requests or requirements?",

      // Booking Form - Step 3 (Review & Confirm)
      reviewAndConfirm: "Review & Confirm",
      reviewAndConfirmDescription:
        "Please review your booking details before submitting",
      bookingRequestOnly: true,
      bookingRequestOnlyDescription:
        "This is a booking request only. No payment is required at this time. Our team will contact you to confirm availability and arrange payment.",
      personalInfoTitle: "Personal Information",
      nameLabel: "Name:",
      emailLabelReview: "Email:",
      phoneLabelReview: "Phone:",
      contactPreferenceLabel: "Contact Preference:",
      nationalityLabelReview: "Nationality:",
      passportNumberLabelReview: "Passport Number:",
      addressLabelReview: "Address:",
      editButton: "Edit",
      travelersLabel: "Travelers:",
      adult: "Adult",
      adults: "Adults",
      child: "Child",
      children: "Children",
      startDateLabelReview: "Start Date:",
      notSpecified: "Not specified",
      endDateLabelReview: "End Date:",
      priceDetailsTitle: "Price Details",
      acceptTerms: true,
      termsAndConditions: "I accept the terms and conditions",
      termsLink: "Terms and Conditions",
      privacyLink: "Privacy Policy",

      // Form Buttons
      backButton: "Back",
      continueButton: "Continue",
      submitBooking: "Submit Booking Request",
      processing: "Processing...",

      // Booking Summary
      bookingSummary: "Booking Summary",
      packageLabel: "Package",
      tax: "Tax",
      total: "Total",
      days: "days",
      bookingRequestInfo:
        "This is a booking request only. No payment is required now.",
      payAtOffice: "Pay at our office",
    },
  },

  fr: {
    general: {
      search: "Rechercher",
      to: "à",
      from: "de",
      days: "jours",
      other: "autre",
      currency: "EUR",
      languageSwitch: "Changer de langue",
      contact: {
        title: "Nous contacter",
        email: "lta.leadertravelagency@gmail.com",
        phone: "54 222 153 | 54 222 175 | 56 521 032",
        address: "Tunis – Rue Abderrahmen Azzem, Monplaisir, Immobilier El Wifak, Bloc A, 5ème étage, Bureau 54",
        whatsapp: "54 222 153 | 54 222 175 | 56 521 032",
      },
    },
    buttons: {
      bookNow: "Réserver",
      search: "Rechercher",
      viewMore: "Voir plus",
      submit: "Envoyer",
      select: "Sélectionner",
      applyFilters: "Appliquer",
      reset: "Réinitialiser",
      contactUs: "Nous contacter",
      subscribe: "S’abonner",
      viewDetails: "Voir les détails",
    },

    tours: {
      adventure: "Aventure",
      cultural: "Culturel",
      beach: "Plage",
    },
    transfer: {
      baggage: "Transfert de bagages",
      family: "Voyage en famille",
      group: "Voyage en groupe",
    },
    trips: {
      oneWay: "Aller simple",
      roundTrip: "Aller-retour",
    },
    tickets: {
      flights: "Vols",
      ferry: "Ferry",
    },

    form: {
      name: { label: "Nom complet", placeholder: "Entrez votre nom complet" },
      firstName: { label: "Prénom", placeholder: "Entrez votre prénom" },
      lastName: {
        label: "Nom de famille",
        placeholder: "Entrez votre nom de famille",
      },
      email: { label: "Email", placeholder: "Entrez votre adresse email" },
      phone: {
        label: "Téléphone",
        placeholder: "Entrez votre numéro de téléphone",
      },
      address: { label: "Adresse", placeholder: "Entrez votre adresse" },
      subject: { label: "Sujet", placeholder: "Entrez un sujet" },
      message: { label: "Message", placeholder: "Écrivez votre message ici" },
      submit: "Envoyer",
      personalInformation:
        "Vos informations personnelles resteront confidentielles.",
      errorMessages: {
        required: "Ce champ est requis",
        invalidEmail: "Veuillez saisir une adresse e-mail valide",
        invalidPhone: "Veuillez saisir un numéro de téléphone valide",
      },
    },

    landingPage: {
      tripSectionTitle: "Découvrez vos destinations de rêve",
      tripSectionSubtitle:
        "Explorez notre sélection des plus belles destinations",
      hotelSectionTitle: "Hébergements d'exception",
      hotelSectionSubtitle: "Trouvez l'hôtel idéal pour votre voyage",
      callToAction: "Réservez votre aventure dès maintenant",
    },

    navbar: {
      tours: "Circuits",

      hotels: "Hôtels",
      tickets: "Billets",
      transfer: "Transferts",
      contact: "Contact",
      bookings: "Mes réservations",
      about: "À propos",
    },

    footer: {
      tagline: "Votre partenaire pour des voyages inoubliables.",
      subscribeToNewsletter:
        "Inscrivez-vous à notre newsletter pour des offres exclusives.",
      emailPlaceholder: "Votre e-mail",
      allRightsReserved: "Tous droits réservés.",
      address: "Tunis – Rue Abderrahmen Azzem, Monplaisir, Immobilier El Wifak, Bloc A, 5ème étage, Bureau 54",
      phone: "54 222 153 | 54 222 175 | 56 521 032",
      email: "lta.leadertravelagency@gmail.com",
      followUs: "Suivez-nous",
      quickLinks: "Liens rapides",
      termsConditions: "Conditions générales",
      privacyPolicy: "Politique de confidentialité",
      newsletter: "Newsletter",
      contactUs: "Nous contacter",
      socialMedia: {
        facebook: "Facebook",
        instagram: "Instagram",
        twitter: "Twitter",
      },
    },

    transferPage: {
      packageRequest: "Demander un transfert",
      description:
        "Planifiez vos déplacements en Tunisie sans effort. Remplissez le formulaire pour une solution sur mesure.",
      transferDetails: "Détails du transfert",
      transferType: "Type de transfert",
      selectType: "Sélectionnez le type",
      region: "Région en Tunisie",
      selectRegion: "Sélectionnez une région",
      destination: "Destination",
      enterDestination: "Entrez votre destination",
      tripType: "Type de trajet",
      selectTripType: "Sélectionnez le type de trajet",
      pickupAddress: "Adresse de prise en charge",
      enterPickupAddress: "Entrez l’adresse de prise en charge",
      dropoffAddress: "Adresse de dépôt",
      enterDropoffAddress: "Entrez l’adresse de dépôt",
      preferredDate: "Date préférée",
      specialRequest: "Demandes spéciales",
      whyChooseUs: {
        title: "Pourquoi nous choisir",
        items: [
          {
            name: "Service fiable",
            description: "Ponctualité et fiabilité à chaque trajet.",
          },
          {
            name: "Véhicules confortables",
            description: "Adaptés à tous les groupes.",
          },
          {
            name: "Tarifs transparents",
            description: "Prix abordables sans frais cachés.",
          },
          {
            name: "Chauffeurs experts",
            description: "Professionnels et bien informés.",
          },
        ],
      },
    },



    toursPage: {
      adventureTours: "Circuits d’aventure",
      culturalTours: "Circuits culturels",
      beachTours: "Circuits balnéaires",
      toursFound: "circuits trouvés",
      noToursFound: "Aucun circuit trouvé",
      searchPlaceholder: "Rechercher des destinations ou circuits",
      travelerType: "Type de voyageur",
      more: "Plus",
      previous: "Précédent",
      next: "Suivant",
    },

    contactPage: {
      title: "Contactez-nous",
      description:
        "Questions sur nos services ou besoin d’aide ? Nous sommes là pour planifier votre voyage idéal.",
      formTitle: "Formulaire de contact",
      contactInfo: "Coordonnées",
      ourAddress: "Adresse",
      phoneNumbers: "Numéros de téléphone",
      emailAddresses: "Adresses e-mail",
      workingHours: "Horaires",
      mondayToFriday: "Lundi à vendredi : 9h00 - 18h00",
      saturday: "SábadoSamedi : 10h00 - 16h00",
      sunday: "Dimanche : Fermé",
    },

    faqPage: {
      title: "Questions fréquentes",
      imageAlt: "FAQ sur les voyages",
      faqs: [
        {
          question: "Quels documents pour voyager à l’international ?",
          answer:
            "Un passeport valide (6 mois minimum), un visa (si requis), une assurance voyage et des confirmations de réservation sont nécessaires. Contactez-nous pour plus de détails.",
        },
        {
          question: "Proposez-vous une assurance voyage ?",
          answer:
            "Oui, nous offrons des assurances couvrant les urgences médicales, annulations et pertes de bagages. Contactez-nous pour choisir la meilleure option.",
        },
        {
          question: "Quelle est votre politique d’annulation ?",
          answer:
            "Les annulations 30+ jours avant le départ sont remboursées (moins frais). Entre 15-29 jours, 50 % de remboursement. Moins de 15 jours, non remboursable. Vérifiez vos conditions de réservation.",
        },
        {
          question: "Y a-t-il des réductions pour les groupes ?",
          answer:
            "Oui, pour 15 personnes ou plus. Contactez-nous pour un devis personnalisé.",
        },
      ],
    },

    ticketsBookingPage: {
      ferryTitle: "Réservation de ferry",
      ferrydescription:
        "Réservez votre traversée en ferry facilement. Remplissez le formulaire ci-dessous pour réserver votre cabine et votre espace véhicule.",
      flightTitle: "Réservation de billets",
      flightdescription:
        "Réservez votre voyage en avion. Remplissez le formulaire ci-dessous pour réserver votre billet et votre espace.",
      crossingAndCabinInfo: {
        flightCrossTitle: "Informations sur la traversée et le vol",
        ferryCrossTitle: "Informations sur la traversée et la cabine",
        crossingType: {
          label: "Type de traversée (*)",
          placeholder: "Sélectionner le type de traversée",
          options: {
            oneWay: "Aller simple",
            roundTrip: "Aller-retour",
            openReturn: "Retour ouvert",
          },
        },
        departureDate: {
          label: "Date de départ (*)",
        },
        departurePort: {
          label: "Port/Pays de départ (*)",
          placeholder: "ex. Tunis, Tunisie",
        },
        departureAirPort: {
          label: "Aéroport de départ (*)",
          placeholder: "ex : Aéroport de Tunis",
        },
        arrivalAirPort: {
          label: "Aéroport d'arrivée (*)",
          placeholder: "ex : Aéroport Paris Charles de Gaulle",
        },

        arrivalPort: {
          label: "Port/Pays d'arrivée (*)",
          placeholder: "ex. Marseille, France",
        },
        cabinType: {
          label: "Type de cabine (*)",
          placeholder: "Sélectionner le type de cabine",
          options: {
            inside: "Cabine intérieure",
            outside: "Cabine extérieure",
            deluxe: "Cabine deluxe",
            suite: "Suite",
            none: "Sans cabine",
          },
        },
        vehicleType: {
          label: "Type de véhicule",
          placeholder: "Sélectionner le type de véhicule",
          options: {
            none: "Aucun véhicule",
            car: "Voiture (jusqu'à 5m)",
            suv: "SUV (5-6m)",
            van: "Van (6-7m)",
            motorcycle: "Moto",
            other: "Autre",
          },
        },
        class: {
          label: "Classe",
          placeholder: "Sélectionnez une classe",
          options: {
            economy: "Économie",
            business: "Affaires",
            first: "Première",
          },
        },
        airLine: {
          label: "Compagnie aérienne",
          placeholder: "Sélectionnez une compagnie aérienne",
        },
      },
      travellersInfo: {
        title: "Informations sur les voyageurs",
        adults: {
          label: "Adulte(s) (16-60) (*)",
        },
        children: {
          label: "Enfant(s) (2-16)",
        },
        infants1to2: {
          label: "Bébé(s) (1-2 ans)",
        },
        infantsUnder1: {
          label: "Bébé(s) (moins de 1 an)",
        },
        seniors: {
          label: "Senior(s) (60+)",
        },
      },
      contactInfo: {
        title: "Coordonnées (*)",
        titleField: {
          label: "Titre",
          placeholder: "Sélectionner le titre",
          options: {
            mr: "M.",
            mrs: "Mme",
            ms: "Mlle",
            dr: "Dr",
          },
        },
        forename: {
          label: "Prénom (*)",
          placeholder: "Votre prénom",
        },
        name: {
          label: "Nom (*)",
          placeholder: "Votre nom de famille",
        },
        email: {
          label: "E-mail (*)",
          placeholder: "Votre adresse e-mail",
        },
        telephone: {
          label: "Téléphone (*)",
          placeholder: "Votre numéro de téléphone",
        },
        dateOfBirth: {
          label: "Date de naissance",
        },
        passportNumber: {
          label: "Numéro de passeport",
          placeholder: "Votre numéro de passeport",
        },
      },
      observations: {
        title: "Observations",
        placeholder: "Demandes spéciales ou informations supplémentaires",
      },
      buttons: {
        submitBooking: "Soumettre la réservation",
        processing: "Traitement en cours...",
      },
      formErrors: {
        required: "Ce champ est requis",
        invalidEmail: "Veuillez entrer une adresse e-mail valide",
        invalidPhone: "Veuillez entrer un numéro de téléphone valide",
        invalidDate: "Veuillez sélectionner une date de départ valide",
      },
      ferryWhyBookWithUs: {
        title: "Pourquoi réserver avec nous ?",
        items: [
          { name: "Prix de ferry compétitifs" },
          { name: "Large choix de cabines" },
          { name: "Réservation de véhicule facile" },
          { name: "Support client 24/7" },
        ],
      },
      flightWhyBookWithUs: {
        title: "Pourquoi réserver avec nous ?",
        items: [
          { name: "Bonnes affaires sur les vols" },
          { name: "Nombreuses compagnies aériennes" },
          { name: "Réservation sécurisée et rapide" },
          { name: "Service client 24h/24 et 7j/7" },
        ],
      },
    },
    bookingManagementPage: {
      title: "Suivre votre réservation",
      description:
        "Retrouvez facilement les détails de votre réservation en entrant votre numéro de référence ci-dessous. Que vous ayez réservé un hôtel, un service ou une visite, vous pouvez vérifier le statut, consulter les détails ou gérer votre réservation, tout en un seul endroit.",
      card: {
        title: "Trouver votre réservation",
        description:
          "Entrez votre numéro de référence de réservation pour consulter ou gérer votre réservation",
      },
      form: {
        placeholder:
          "Entrez la référence de réservation (ex. BK-H-123456 ou BK-S-123456)",
        buttons: {
          search: "Rechercher",
          searching: "Recherche en cours",
        },
        error: {
          emptyReference: "Veuillez entrer une référence de réservation",
        },
      },
      referenceFormat: {
        title: "Format de la référence de réservation",
        hotels: {
          label: "Hôtels",
          example: "BK-H-XXXXXX (ex. BK-H-123456)",
        },
        services: {
          label: "Services",
          example: "BK-S-XXXXXX (ex. BK-S-789012)",
        },
      },
      help: {
        findReference:
          "Besoin d'aide pour trouver votre référence de réservation ?",
        contactSupport:
          "Vérifiez votre e-mail de confirmation ou contactez notre support client à",
        supportEmail: "support@example.com",
      },
    },
    bookingTrackingPage: {
      loading: {
        message: "Chargement des détails de la réservation...",
      },
      error: {
        title: "Erreur",
        notFound:
          "Réservation non trouvée. Veuillez vérifier le numéro de référence et réessayer.",
        fetchFailed:
          "Impossible de trouver la réservation avec la référence fournie.",
      },
      buttons: {
        backToSearch: "Retour à la recherche",
      },
      card: {
        title: "Référence de réservation : {ref}",
        bookedOn: "Réservé le : {date}",
      },
      statuses: {
        confirmed: "Confirmé",
        pending: "En attente",
        canceled: "Annulé",
        completed: "Terminé",
      },
      tabs: {
        customerInfo: "Informations du client",
      },
      customerInfo: {
        nameLabel: "{firstName} {lastName}",
        phoneLabel: "Téléphone : {phone}",
        emailLabel: "E-mail : {email}",
        na: "N/D",
      },
    },
    hotelSearchPage: {
      title: "Recherche d'hôtels",
      description:
        "Trouvez l'endroit parfait pour séjourner pendant votre voyage. Recherchez et comparez les hôtels à travers la Tunisie par emplacement, date et préférences. Que vous cherchiez le luxe, le confort ou des options économiques, nous avons ce qu'il vous faut.",
      found: "trouvé",
      noHotelFound: "Aucun hôtel trouvé",
      perNight: "par nuit",
      filtersAndSearch: "Filtres et recherche",
      findYourPerfectStay: "Trouvez votre séjour idéal",
      searchPlaceholder: "Rechercher par nom d'hôtel...",

      // Dates Section
      dates: "Dates",
      checkInDate: "Date d'arrivée",
      checkOutDate: "Date de départ",
      selectDate: "Sélectionner une date",

      // Destination Section
      destination: "Destination",
      selectDestination: "Sélectionner une destination",
      loadingCities: "Chargement des villes...",

      // Rooms & Guests Section
      roomsAndGuests: "Chambres et invités",
      room: "Chambre",
      adult: "Adulte",
      adults: "Adultes",
      child: "Enfant",
      children: "Enfants",
      noChildren: "Aucun enfant",
      addChild: "Ajouter un enfant",
      selectAge: "Sélectionner l'âge",
      yearsOld: "ans",
      lessThanOneYear: "Moins d'un an",
      addRoom: "Ajouter une chambre",
      removeRoom: "Supprimer la chambre",

      // Hotel Categories Section
      hotelCategories: "Catégories d'hôtels",
      loadingCategories: "Chargement des catégories...",

      // Tags Section
      tags: "Étiquettes",
      loadingTags: "Chargement des étiquettes...",

      // Additional Options Section
      additionalOptions: "Options supplémentaires",
      showOnlyAvailableHotels: "Afficher uniquement les hôtels disponibles",

      // Footer
      searchHotels: "Rechercher des hôtels",
      resetFilters: "Réinitialiser les filtres",
    },
    detailsPage: {
      // Breadcrumb Navigation
      home: "Accueil",
      hotels: "Hôtels",

      // Hero Section
      checkIn: "Arrivée",

      // Tabs
      overview: "Aperçu",
      amenities: "Équipements",
      policies: "Politiques",

      // Overview Tab
      about: "À propos",
      contactInformation: "Coordonnées",
      checkInTime: "Heure d'arrivée",
      tags: "Étiquettes",
      themes: "Thèmes",

      // Amenities Tab
      hotelAmenities: "Équipements de l'hôtel",
      mealPlansAvailable: "Plans de repas disponibles",

      // Policies Tab
      hotelPolicies: "Politiques de l'hôtel",

      // Booking Card
      bookYourStay: "Réservez votre séjour",
      checkAvailability: "Vérifier la disponibilité",
      checkInCheckOut: "Arrivée / Départ",
      selectDates: "Sélectionner les dates",
      night: "nuit",
      nights: "nuits",
      roomConfiguration: "Configuration des chambres",
      room: "chambre",
      rooms: "chambres",
      adults: "adultes",
      children: "enfants",
      confirmChanges: "Confirmer les modifications",
      selectMealPlan: "Sélectionner un plan de repas",
      availableRooms: "Chambres disponibles",
      available: "disponible",
      freeCancellationUntil: "Annulation gratuite jusqu'à",
      selected: "Sélectionné",
      select: "Sélectionner",
      bookingSummary: "Résumé de la réservation",
      total: "Total",
      proceedToBooking: "Passer à la réservation",

      // Room Configuration Dialog
      roomConfigurationTitle: "Configuration des chambres",
      remove: "Supprimer",
      adultsLabel: "Adultes",
      selectNumberOfAdults: "Sélectionner le nombre d'adultes",
      childrenLabel: "Enfants",
      addChild: "Ajouter un enfant",
      noChildrenAdded: "Aucun enfant ajouté",
      childAge: "Âge de l'enfant",
      year: "an",
      years: "ans",
      addAnotherRoom: "Ajouter une autre chambre",

      // Map Card
      location: "Emplacement",
      viewLargerMap: "Voir une carte plus grande",
      coordinates: "Coordonnées",

      // Booking Modal
      completeYourBooking: "Finaliser votre réservation",
      guestInfo: "Informations sur l'invité",
      roomGuests: "Invités de la chambre",
      payment: "Paiement",
      firstName: "Prénom",
      lastName: "Nom",
      email: "Email",
      phoneNumber: "Numéro de téléphone",
      address: "Adresse",
      city: "Ville",
      postalCode: "Code postal",
      country: "Pays",
      primaryGuest: "Invité principal",
      paymentMethod: "Méthode de paiement",
      specialRequests: "Demandes spéciales",
      specialRequestsPlaceholder: "Des demandes ou exigences particulières ?",
      acceptTerms:
        "J'accepte les termes et conditions, y compris la politique d'annulation",
      back: "Retour",
      next: "Suivant",
      completeBooking: "Finaliser la réservation",
      error: "Erreur",
      selectCheckOut: "Sélectionnez la date de départ",
      selectDatesTitle: "Sélectionnez les dates",
      selectDatesPrompt: "Veuillez sélectionner vos dates de séjour pour voir les chambres et les prix disponibles.",
      loading: "Chargement des disponibilités...",
      noAvailability: "Aucune disponibilité trouvée pour ces dates.",
      checkAvailabilityPrompt: "Veuillez sélectionner des dates pour vérifier la disponibilité.",
    },
    serviceDetails: {
      packageNotFoundMessage:
        "Le forfait que vous recherchez n'existe pas ou a été supprimé.",
      tripPackageNotFound: "Forfait voyage non trouvé",
      backToHome: "Retour à l'accueil",

      // Breadcrumb Navigation
      home: "Accueil",
      trip: "tours",

      // Hero Section
      departure: "Départ",
      days: "jours",
      available: "DISPONIBLE",

      // Tabs
      overview: "Aperçu",
      itinerary: "Itinéraire",
      accommodation: "Hébergement",
      inclusionstab: "Inclusions",

      // Overview Tab
      aboutThisPackage: "À propos de ce forfait",
      guidanceSupport:
        "Nos guides expérimentés vous accompagneront tout au long du voyage, offrant des conseils spirituels et s'assurant que tous les rituels sont effectués correctement. Profitez d'un transport confortable, de repas délicieux et de la tranquillité d'esprit offerte par nos services d'assistance 24/7.",
      packageHighlights: "Points forts du forfait",

      // Itinerary Tab
      dayItinerary: "Itinéraire quotidien",
      meals: "Repas",

      // Accommodation Tab
      accommodationDetails: "Détails de l'hébergement",
      hotel: "Hôtel",
      transportation: "Transport",
      transport: "Transport",

      // Inclusions Tab
      packageInclusionsExclusions: "Inclusions et exclusions du forfait",
      inclusions: "Inclusions",
      exclusions: "Exclusions",
      mealsIncluded: "Repas inclus",
      visaProcessing: "Traitement et frais de visa",
      experiencedGuides: "Guides expérimentés et érudits religieux",

      // Booking Card
      bookYourPackage: "Réservez votre forfait",
      tax: "taxe",
      perPerson: "Par personne",
      total: "Total",
      bookNow: "Réserver maintenant",
      departureLabel: "Départ",
      returnLabel: "Retour",
      roundTrip: "Aller-retour",
      oneWayTrip: "Aller simple",
    },
    checkoutPage: {
      // Hero Section
      bookTourPackage: "Votre forfait voyage",
      bookGeneric: "Réservation",
      tourDescription:
        "Découvrez des destinations inoubliables avec nos forfaits touristiques. Que vous recherchiez l'aventure, la culture ou la détente, personnalisez votre itinéraire et réservez votre prochaine grande escapade en toute simplicité.",

      // Progress Steps
      confirmation: "Confirmation",

      // Booking Form - Step 1 (Contact Information)
      contactInformation: "Informations de contact",
      personalInformation: "Veuillez fournir vos informations personnelles",
      firstNameLabel: "Prénom",
      firstNamePlaceholder: "Entrez votre prénom",
      lastNameLabel: "Nom",
      lastNamePlaceholder: "Entrez votre nom",
      emailLabel: "Email",
      emailPlaceholder: "Entrez votre adresse email",
      phoneLabel: "Numéro de téléphone",
      phonePlaceholder: "Entrez votre numéro de téléphone",
      preferredContactMethod: "Méthode de contact préférée",
      contactPhone: "Téléphone",
      contactEmail: "Email",
      contactWhatsApp: "WhatsApp",
      nationalityLabel: "Nationalité",
      nationalityPlaceholder: "Entrez votre nationalité",
      passportNumberLabel: "Numéro de passeport",
      passportNumberPlaceholder: "Entrez votre numéro de passeport",
      addressLabel: "Adresse",
      addressPlaceholder: "Entrez votre adresse",

      // Booking Form - Step 2 (Travel Details)
      travelDetails: "Détails du voyage",
      travelDetailsDescription:
        "Fournissez des informations sur vos plans de voyage",
      travellersInfoTitle: "Informations sur les voyageurs",
      adultsLabel: "Adultes",
      childrenLabel: "Enfants (moins de 12 ans)",
      startDateLabel: "Date de début",
      endDateLabel: "Date de fin",
      pickADate: "Choisissez une date",
      specialRequestsLabel: "Demandes spéciales",
      specialRequestsPlaceholder:
        "Avez-vous des demandes ou exigences spéciales ?",

      // Booking Form - Step 3 (Review & Confirm)
      reviewAndConfirm: "Vérification et confirmation",
      reviewAndConfirmDescription:
        "Veuillez vérifier les détails de votre réservation avant de soumettre",
      bookingRequestOnly: true,
      bookingRequestOnlyDescription:
        "Ceci est uniquement une demande de réservation. Aucun paiement n'est requis pour le moment. Notre équipe vous contactera pour confirmer la disponibilité et organiser le paiement.",
      personalInfoTitle: "Informations personnelles",
      nameLabel: "Nom :",
      emailLabelReview: "Email :",
      phoneLabelReview: "Téléphone :",
      contactPreferenceLabel: "Préférence de contact :",
      nationalityLabelReview: "Nationalité :",
      passportNumberLabelReview: "Numéro de passeport :",
      addressLabelReview: "Adresse :",
      editButton: "Modifier",
      travelersLabel: "Voyageurs :",
      adult: "Adulte",
      adults: "Adultes",
      child: "Enfant",
      children: "Enfants",
      startDateLabelReview: "Date de début :",
      notSpecified: "Non spécifié",
      endDateLabelReview: "Date de fin :",
      priceDetailsTitle: "Détails du prix",
      acceptTerms: true,
      termsAndConditions: "J'accepte les termes et conditions",
      termsLink: "Termes et conditions",
      privacyLink: "Politique de confidentialité",

      // Form Buttons
      backButton: "Retour",
      continueButton: "Continuer",
      submitBooking: "Soumettre la demande de réservation",
      processing: "En cours de traitement...",

      // Booking Summary
      bookingSummary: "Résumé de la réservation",
      packageLabel: "Forfait",
      tax: "Taxe",
      total: "Total",
      days: "jours",
      bookingRequestInfo:
        "Ceci est uniquement une demande de réservation. Aucun paiement n'est requis maintenant.",
      payAtOffice: "Payer à notre bureau",
    },

    all: "Tous",
    loadingTours: "Chargement des circuits...",
    errorLoadingTours: "Erreur lors du chargement des circuits",
    tryAgain: "Réessayer",
    soldOut: "Complet",
    guideIncluded: "Guide Inclus",
  },

  ar: {
    general: {
      search: "بحث",
      to: "إلى",
      from: "من",
      days: "أيام",
      other: "أخرى",
      currency: "دينار تونسي",
      languageSwitch: "تغيير اللغة",
      contact: {
        title: "تواصلوا معنا",
        email: "lta.leadertravelagency@gmail.com",
        phone: "54 222 153 | 54 222 175 | 56 521 032",
        address: "Tunis – Rue Abderrahmen Azzem, Monplaisir, Immobilier El Wifak, Bloc A, 5ème étage, Bureau 54",
        whatsapp: "54 222 153 | 54 222 175 | 56 521 032",
      },
    },
    buttons: {
      bookNow: "احجز الآن",
      search: "بحث",
      viewMore: "عرض المزيد",
      submit: "إرسال",
      select: "اختر",
      applyFilters: "تطبيق",
      reset: "إعادة ضبط",
      contactUs: "تواصلوا معنا",
      subscribe: "اشترك",
      viewDetails: "عرض التفاصيل",
    },

    tours: {
      adventure: "مغامرة",
      cultural: "ثقافي",
      beach: "شاطئ",
    },
    transfer: {
      baggage: "نقل الأمتعة",
      family: "رحلة عائلية",
      group: "رحلة جماعية",
    },
    trips: {
      oneWay: "ذهاب فقط",
      roundTrip: "ذهاب وعودة",
    },
    tickets: {
      flights: "الرحلات الجوية",
      ferry: "العبارة",
    },

    form: {
      name: { label: "الاسم الكامل", placeholder: "أدخل اسمك الكامل" },
      firstName: { label: "الاسم الأول", placeholder: "أدخل الاسم الأول" },
      lastName: { label: "اسم العائلة", placeholder: "أدخل اسم العائلة" },
      email: {
        label: "البريد الإلكتروني",
        placeholder: "أدخل بريدك الإلكتروني",
      },
      phone: { label: "رقم الهاتف", placeholder: "أدخل رقم هاتفك" },
      address: { label: "العنوان", placeholder: "أدخل عنوانك" },
      subject: { label: "الموضوع", placeholder: "أدخل موضوعًا" },
      message: { label: "الرسالة", placeholder: "اكتب رسالتك هنا" },
      submit: "إرسال",
      personalInformation: "سيتم الحفاظ على خصوصية معلوماتك الشخصية.",
      errorMessages: {
        required: "هذا الحقل مطلوب",
        invalidEmail: "الرجاء إدخال بريد إلكتروني صحيح",
        invalidPhone: "الرجاء إدخال رقم هاتف صحيح",
      },
    },

    landingPage: {
      tripSectionTitle: "اكتشف وجهات أحلامك",
      tripSectionSubtitle: "استكشف مجموعتنا المختارة من أجمل الوجهات",
      hotelSectionTitle: "إقامات فندقية لا تُنسى",
      hotelSectionSubtitle: "ابحث عن الإقامة المثالية لرحلتك",
      callToAction: "احجز مغامرتك الآن",
    },

    navbar: {
      tours: "جولات",

      hotels: "فنادق",
      tickets: "تذاكر",
      transfer: "نقل",
      contact: "تواصل",
      bookings: "حجوزاتي",
      about: "من نحن",
    },

    footer: {
      tagline: "شريكك الموثوق لتجارب سفر لا تُنسى.",
      subscribeToNewsletter: "اشترك في نشرتنا لعروض حصرية.",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      allRightsReserved: "جميع الحقوق محفوظة.",
      address: "Tunis – Rue Abderrahmen Azzem, Monplaisir, Immobilier El Wifak, Bloc A, 5ème étage, Bureau 54",
      phone: "54 222 153 | 54 222 175 | 56 521 032",
      email: "lta.leadertravelagency@gmail.com",
      followUs: "تابعنا",
      quickLinks: "روابط سريعة",
      termsConditions: "الشروط والأحكام",
      privacyPolicy: "سياسة الخصوصية",
      newsletter: "النشرة الإخبارية",
      contactUs: "تواصلوا معنا",
      socialMedia: {
        facebook: "فيسبوك",
        instagram: "إنستغرام",
        twitter: "تويتر",
      },
    },

    transferPage: {
      packageRequest: "طلب خدمة نقل",
      description:
        "خطط لتنقلاتك في تونس بسهولة. سواء للأمتعة، الرحلات العائلية، أو السفر الجماعي، املأ النموذج للحصول على حل مخصص.",
      transferDetails: "تفاصيل النقل",
      transferType: "نوع النقل",
      selectType: "اختر نوع النقل",
      region: "المنطقة في تونس",
      selectRegion: "اختر المنطقة",
      destination: "الوجهة",
      enterDestination: "أدخل وجهتك",
      tripType: "نوع الرحلة",
      selectTripType: "اختر نوع الرحلة",
      pickupAddress: "عنوان الاستلام",
      enterPickupAddress: "أدخل عنوان الاستلام",
      dropoffAddress: "عنوان التسليم",
      enterDropoffAddress: "أدخل عنوان التسليم",
      preferredDate: "التاريخ المفضل",
      specialRequest: "طلبات خاصة",
      whyChooseUs: {
        title: "لماذا تختارنا",
        items: [
          {
            name: "خدمة موثوقة",
            description: "نقل دقيق وفي الوقت المحدد.",
          },
          {
            name: "راحة الركاب",
            description: "مركبات حديثة لكل الأحجام.",
          },
          {
            name: "أسعار شفافة",
            description: "تكاليف معقولة بدون رسوم مخفية.",
          },
          {
            name: "سائقون محترفون",
            description: "فريق ذو خبرة ومعرفة.",
          },
        ],
      },
    },



    toursPage: {
      adventureTours: "جولات مغامرة",
      culturalTours: "جولات ثقافية",
      beachTours: "جولات شاطئية",
      toursFound: "جولات موجودة",
      noToursFound: "لم يتم العثور على جولات",
      searchPlaceholder: "ابحث عن وجهات أو جولات",
      travelerType: "نوع المسافر",
      more: "المزيد",
      previous: "السابق",
      next: "التالي",
    },

    contactPage: {
      title: "تواصلوا معنا",
      description:
        "أسئلة حول خدماتنا أو تحتاجون مساعدة في الحجز؟ فريقنا هنا لمساعدتكم.",
      formTitle: "نموذج التواصل",
      contactInfo: "معلومات التواصل",
      ourAddress: "عنواننا",
      phoneNumbers: "أرقام الهاتف",
      emailAddresses: "عناوين البريد",
      workingHours: "ساعات العمل",
      mondayToFriday: "الإثنين إلى الجمعة: 9:00 ص - 6:00 م",
      saturday: "السبت: 10:00 ص - 4:00 م",
      sunday: "الأحد: مغلق",
    },

    faqPage: {
      title: "الأسئلة الشائعة",
      imageAlt: "أسئلة السفر",
      faqs: [
        {
          question: "ما المستندات المطلوبة للسفر الدولي؟",
          answer:
            "جواز سفر ساري (6 أشهر على الأقل)، تأشيرة (إذا لزم)، تأمين سفر، وتأكيدات الحجز. تواصلوا معنا لمتطلبات محددة.",
        },
        {
          question: "متى أحجز رحلة العمرة؟",
          answer: "احجز قبل 3-6 أشهر لتوفر أفضل وأسعار مناسبة، خاصة في رمضان.",
        },
        {
          question: "هل تقدمون تأمين سفر؟",
          answer:
            "نعم، نقدم تأميناً شاملاً للطوارئ الطبية، الإلغاء، وفقدان الأمتعة. تواصلوا معنا لاختيار الأنسب.",
        },
        {
          question: "ما سياسة الإلغاء؟",
          answer:
            "الإلغاء قبل 30+ يوماً: استرداد كامل (ناقص الرسوم). 15-29 يوماً: 50%. أقل من 15 يوماً: غير قابل للاسترداد. راجع شروط حجزك.",
        },
        {
          question: "هل هناك خصومات للمجموعات؟",
          answer: "نعم، لـ 15 شخصاً أو أكثر. تواصلوا معنا لعرض مخصص.",
        },
      ],
    },

    ticketsBookingPage: {
      ferryTitle: "حجز العبارة",
      ferrydescription:
        "احجز رحلة العبارة بسهولة. املأ النموذج أدناه لحجز كابينتك ومساحة المركبة.",
      flightTitle: "حجز التذكرة",
      flightdescription:
        "احجز تذكرة طيران بسهولة. املأ النموذج أدناه لمعلوماتك.",
      crossingAndCabinInfo: {
        flightCrossTitle: "معلومات العبور والرحلات الجوية",
        ferryCrossTitle: "معلومات العبور والكابينة",
        crossingType: {
          label: "نوع الرحلة (*)",
          placeholder: "اختر نوع الرحلة",
          options: {
            oneWay: "ذهاب فقط",
            roundTrip: "ذهاب وعودة",
            openReturn: "عودة مفتوحة",
          },
        },
        departureDate: {
          label: "تاريخ المغادرة (*)",
        },
        departurePort: {
          label: "ميناء/بلد المغادرة (*)",
          placeholder: "مثال: تونس، تونس",
        },
        departureAirPort: {
          label: "مطار المغادرة (*)",
          placeholder: "مثال: مطار تونس",
        },
        arrivalAirPort: {
          label: "مطار الوصول (*)",
          placeholder: "مثال: مطار باريس شارل ديغول",
        },

        arrivalPort: {
          label: "ميناء/بلد الوصول (*)",
          placeholder: "مثال: مرسيليا، فرنسا",
        },
        cabinType: {
          label: "نوع الكابينة (*)",
          placeholder: "اختر نوع الكابينة",
          options: {
            inside: "كابينة داخلية",
            outside: "كابينة خارجية",
            deluxe: "كابينة ديلوكس",
            suite: "جناح",
            none: "بدون كابينة",
          },
        },
        vehicleType: {
          label: "نوع المركبة",
          placeholder: "اختر نوع المركبة",
          options: {
            none: "بدون مركبة",
            car: "سيارة (حتى 5 أمتار)",
            suv: "سيارة دفع رباعي (5-6 أمتار)",
            van: "فان (6-7 أمتار)",
            motorcycle: "دراجة نارية",
            other: "أخرى",
          },
        },
        class: {
          label: "الدرجة",
          placeholder: "اختر الدرجة",
          options: {
            economy: "الدرجة الاقتصادية",
            business: "درجة رجال الأعمال",
            first: "الدرجة الأولى",
          },
        },
        airLine: {
          label: "شركة الطيران",
          placeholder: "اختر شركة الطيران",
        },
      },
      travellersInfo: {
        title: "معلومات المسافرين",
        adults: {
          label: "بالغون (16-60) (*)",
        },
        children: {
          label: "أطفال (2-16)",
        },
        infants1to2: {
          label: "رضع (1-2 سنة)",
        },
        infantsUnder1: {
          label: "رضع (أقل من سنة)",
        },
        seniors: {
          label: "كبار السن (60+)",
        },
      },
      contactInfo: {
        title: "معلومات التواصل (*)",
        titleField: {
          label: "اللقب",
          placeholder: "اختر اللقب",
          options: {
            mr: "السيد",
            mrs: "السيدة",
            ms: "الآنسة",
            dr: "دكتور",
          },
        },
        forename: {
          label: "الاسم الأول (*)",
          placeholder: "اسمك الأول",
        },
        name: {
          label: "اسم العائلة (*)",
          placeholder: "اسم عائلتك",
        },
        email: {
          label: "البريد الإلكتروني (*)",
          placeholder: "بريدك الإلكتروني",
        },
        telephone: {
          label: "الهاتف (*)",
          placeholder: "رقم هاتفك",
        },
        dateOfBirth: {
          label: "تاريخ الميلاد",
        },
        passportNumber: {
          label: "رقم جواز السفر",
          placeholder: "رقم جواز سفرك",
        },
      },
      observations: {
        title: "ملاحظات",
        placeholder: "أي طلبات خاصة أو معلومات إضافية",
      },
      buttons: {
        submitBooking: "إرسال الحجز",
        processing: "جاري المعالجة...",
      },
      formErrors: {
        required: "هذا الحقل مطلوب",
        invalidEmail: "الرجاء إدخال بريد إلكتروني صحيح",
        invalidPhone: "الرجاء إدخال رقم هاتف صحيح",
        invalidDate: "الرجاء اختيار تاريخ مغادرة صحيح",
      },
      ferryWhyBookWithUs: {
        title: "لماذا الحجز معنا؟",
        items: [
          { name: "أسعار عبارات تنافسية" },
          { name: "تشكيلة واسعة من الكبائن" },
          { name: "حجز المركبات بسهولة" },
          { name: "دعم عملاء على مدار الساعة" },
        ],
      },
      flightWhyBookWithUs: {
        title: "لماذا تحجز معنا؟",
        items: [
          { name: "عروض رائعة على الرحلات الجوية" },
          { name: "خيارات متعددة من شركات الطيران" },
          { name: "حجز آمن وسريع" },
          { name: "دعم عملاء على مدار الساعة" },
        ],
      },
    },
    bookingManagementPage: {
      title: "تتبع حجزك",
      description:
        "اعثر بسهولة على تفاصيل حجزك بإدخال رقم الإشارة أدناه. سواء كنت قد حجزت فندقًا، خدمة، أو جولة، يمكنك التحقق من الحالة، عرض التفاصيل، أو إدارة حجزك—كل ذلك في مكان واحد.",
      card: {
        title: "العثور على حجزك",
        description: "أدخل رقم إشارة الحجز لعرض أو إدارة حجزك",
      },
      form: {
        placeholder: "أدخل إشارة الحجز (مثال: BK-H-123456 أو BK-S-123456)",
        buttons: {
          search: "بحث",
          searching: "جاري البحث",
        },
        error: {
          emptyReference: "الرجاء إدخال إشارة الحجز",
        },
      },
      referenceFormat: {
        title: "صيغة إشارة الحجز",
        hotels: {
          label: "الفنادق",
          example: "BK-H-XXXXXX (مثال: BK-H-123456)",
        },
        services: {
          label: "الخدمات",
          example: "BK-S-XXXXXX (مثال: BK-S-789012)",
        },
      },
      help: {
        findReference: "هل تحتاج إلى مساعدة للعثور على إشارة الحجز؟",
        contactSupport:
          "تحقق من بريدك الإلكتروني التأكيدي أو تواصل مع دعم العملاء على",
        supportEmail: "support@example.com",
      },
    },
    bookingTrackingPage: {
      loading: {
        message: "جاري تحميل تفاصيل الحجز...",
      },
      error: {
        title: "خطأ",
        notFound:
          "الحجز غير موجود. الرجاء التحقق من رقم الإشارة والمحاولة مجددًا.",
        fetchFailed: "تعذر العثور على الحجز بالإشارة المقدمة.",
      },
      buttons: {
        backToSearch: "العودة إلى البحث",
      },
      card: {
        title: "إشارة الحجز: {ref}",
        bookedOn: "تم الحجز في: {date}",
      },
      statuses: {
        confirmed: "مؤكد",
        pending: "قيد الانتظار",
        canceled: "ملغى",
        completed: "مكتمل",
      },
      tabs: {
        customerInfo: "معلومات العميل",
      },
      customerInfo: {
        nameLabel: "{firstName} {lastName}",
        phoneLabel: "الهاتف: {phone}",
        emailLabel: "البريد الإلكتروني: {email}",
        na: "غير متوفر",
      },
    },
    hotelSearchPage: {
      title: "البحث عن فنادق",
      description:
        "اكتشف المكان المثالي للإقامة خلال رحلتك. ابحث وقارن بين الفنادق في تونس حسب الموقع، التاريخ، والتفضيلات. سواء كنت تبحث عن الفخامة، الراحة، أو خيارات اقتصادية، لدينا كل ما تحتاجه.",
      found: "تم العثور عليها",
      noHotelFound: "لم يتم العثور على فندق",
      perNight: "لكل ليلة",
      filtersAndSearch: "الفلاتر والبحث",
      findYourPerfectStay: "ابحث عن إقامتك المثالية",
      searchPlaceholder: "ابحث باسم الفندق...",

      // Dates Section
      dates: "التواريخ",
      checkInDate: "تاريخ الوصول",
      checkOutDate: "تاريخ المغادرة",
      selectDate: "اختر التاريخ",

      // Destination Section
      destination: "الوجهة",
      selectDestination: "اختر الوجهة",
      loadingCities: "جارٍ تحميل المدن...",

      // Rooms & Guests Section
      roomsAndGuests: "الغرف والضيوف",
      room: "غرفة",
      adult: "بالغ",
      adults: "بالغين",
      child: "طفل",
      children: "أطفال",
      noChildren: "لا يوجد أطفال",
      addChild: "إضافة طفل",
      selectAge: "اختر العمر",
      yearsOld: "سنة",
      lessThanOneYear: "أقل من سنة",
      addRoom: "إضافة غرفة",
      removeRoom: "إزالة الغرفة",

      // Hotel Categories Section
      hotelCategories: "فئات الفنادق",
      loadingCategories: "جارٍ تحميل الفئات...",

      // Tags Section
      tags: "الوسوم",
      loadingTags: "جارٍ تحميل الوسوم...",

      // Additional Options Section
      additionalOptions: "خيارات إضافية",
      showOnlyAvailableHotels: "إظهار الفنادق المتاحة فقط",

      // Footer
      searchHotels: "البحث عن فنادق",
      resetFilters: "إعادة تعيين الفلاتر",
    },
    detailsPage: {
      home: "الرئيسية",
      hotels: "الفنادق",

      // Hero Section
      checkIn: "الوصول",

      // Tabs
      overview: "نظرة عامة",
      amenities: "المرافق",
      policies: "السياسات",

      // Overview Tab
      about: "عن الفندق",
      contactInformation: "معلومات التواصل",
      checkInTime: "وقت الوصول",
      tags: "الوسوم",
      themes: "المواضيع",

      // Amenities Tab
      hotelAmenities: "مرافق الفندق",
      mealPlansAvailable: "خطط الوجبات المتوفرة",

      // Policies Tab
      hotelPolicies: "سياسات الفندق",

      // Booking Card
      bookYourStay: "احجز إقامتك",
      checkAvailability: "تحقق من التوفر",
      checkInCheckOut: "الوصول / المغادرة",
      selectDates: "اختر التواريخ",
      night: "ليلة",
      nights: "ليالٍ",
      roomConfiguration: "تكوين الغرفة",
      room: "غرفة",
      rooms: "غرف",
      adults: "بالغين",
      children: "أطفال",
      confirmChanges: "تأكيد التغييرات",
      selectMealPlan: "اختر خطة الوجبات",
      availableRooms: "الغرف المتوفرة",
      available: "متوفر",
      freeCancellationUntil: "إلغاء مجاني حتى",
      selected: "محدد",
      select: "اختر",
      bookingSummary: "ملخص الحجز",
      total: "الإجمالي",
      proceedToBooking: "المتابعة للحجز",

      // Room Configuration Dialog
      roomConfigurationTitle: "تكوين الغرفة",
      remove: "إزالة",
      adultsLabel: "البالغين",
      selectNumberOfAdults: "اختر عدد البالغين",
      childrenLabel: "الأطفال",
      addChild: "إضافة طفل",
      noChildrenAdded: "لم يتم إضافة أطفال",
      childAge: "عمر الطفل",
      year: "سنة",
      years: "سنوات",
      addAnotherRoom: "إضافة غرفة أخرى",

      // Map Card
      location: "الموقع",
      viewLargerMap: "عرض خريطة أكبر",
      coordinates: "الإحداثيات",

      // Booking Modal
      completeYourBooking: "أكمل حجزك",
      guestInfo: "معلومات الضيف",
      roomGuests: "ضيوف الغرفة",
      payment: "الدفع",
      firstName: "الاسم الأول",
      lastName: "الاسم الأخير",
      email: "البريد الإلكتروني",
      phoneNumber: "رقم الهاتف",
      address: "العنوان",
      city: "المدينة",
      postalCode: "الرمز البريدي",
      country: "الدولة",
      primaryGuest: "الضيف الأساسي",
      paymentMethod: "طريقة الدفع",
      specialRequests: "طلبات خاصة",
      specialRequestsPlaceholder: "هل لديك أي طلبات أو متطلبات خاصة؟",
      acceptTerms: "أوافق على الشروط والأحكام، بما في ذلك سياسة الإلغاء",
      back: "رجوع",
      next: "التالي",
      completeBooking: "إكمال الحجز",
      error: "خطأ",
      selectCheckOut: "اختر تاريخ المغادرة",
      selectDatesTitle: "اختر التواريخ",
      selectDatesPrompt: "يرجى اختيار تواريخ إقامتك لرؤية الغرف والأسعار المتاحة.",
      loading: "جاري تحميل التوفر...",
      noAvailability: "لا يوجد توفر لهذه التواريخ.",
      checkAvailabilityPrompt: "يرجى اختيار التواريخ للتحقق من التوفر.",
    },
    serviceDetails: {
      packageNotFoundMessage: "الباقة التي تبحث عنها غير موجودة أو تم إزالتها.",
      tripPackageNotFound: "لم يتم العثور على الباقة",
      backToHome: "العودة إلى الرئيسية",

      // Breadcrumb Navigation
      home: "الرئيسية",
      trip: "جولات",

      // Hero Section
      departure: "المغادرة",
      days: "أيام",
      available: "متوفر",

      // Tabs
      overview: "نظرة عامة",
      itinerary: "الجدول الزمني",
      accommodation: "الإقامة",
      inclusionstab: "الشموليات",

      // Overview Tab
      aboutThisPackage: "عن هذه الباقة",
      guidanceSupport:
        "سيكون مرشدونا ذوو الخبرة بجانبك طوال الرحلة، مقدمين الإرشاد الروحي وضمان أداء جميع الشعائر بشكل صحيح. استمتع بالنقل المريح، الوجبات اللذيذة، وراحة البال التي تأتي مع خدمات الدعم على مدار الساعة.",
      packageHighlights: "أبرز مميزات الباقة",

      // Itinerary Tab
      dayItinerary: "الجدول اليومي",
      meals: "الوجبات",

      // Accommodation Tab
      accommodationDetails: "تفاصيل الإقامة",
      hotel: "الفندق",
      transportation: "النقل",
      transport: "النقل",

      // Inclusions Tab
      packageInclusionsExclusions: "الشموليات والاستثناءات",
      inclusions: "الشموليات",
      exclusions: "الاستثناءات",
      mealsIncluded: "الوجبات مشمولة",
      visaProcessing: "معالجة التأشيرة والرسوم",
      experiencedGuides: "مرشدون ذوو خبرة وعلماء دين",

      // Booking Card
      bookYourPackage: "احجز باقتك",
      tax: "الضريبة",
      perPerson: "للشخص",
      total: "الإجمالي",
      bookNow: "احجز الآن",
      departureLabel: "المغادرة",
      returnLabel: "العودة",
      roundTrip: "رحلة ذهاب وإياب",
      oneWayTrip: "رحلة ذهاب فقط",
    },
    checkoutPage: {
      bookTourPackage: "باقة الرحلة الخاصة بك",
      bookGeneric: "الحجز",
      tourDescription:
        "استكشف وجهات لا تُنسى مع باقات الرحلات السياحية. سواء كنت تبحث عن المغامرة، الثقافة، أو الاسترخاء، قم بتخصيص خط سيرك واحجز مغامرتك القادمة بسهولة.",

      // Progress Steps
      confirmation: "التأكيد",

      // Booking Form - Step 1 (Contact Information)
      contactInformation: "معلومات التواصل",
      personalInformation: "يرجى تقديم معلوماتك الشخصية",
      firstNameLabel: "الاسم الأول",
      firstNamePlaceholder: "أدخل اسمك الأول",
      lastNameLabel: "الاسم الأخير",
      lastNamePlaceholder: "أدخل اسمك الأخير",
      emailLabel: "البريد الإلكتروني",
      emailPlaceholder: "أدخل عنوان بريدك الإلكتروني",
      phoneLabel: "رقم الهاتف",
      phonePlaceholder: "أدخل رقم هاتفك",
      preferredContactMethod: "طريقة التواصل المفضلة",
      contactPhone: "الهاتف",
      contactEmail: "البريد الإلكتروني",
      contactWhatsApp: "واتساب",
      nationalityLabel: "الجنسية",
      nationalityPlaceholder: "أدخل جنسيتك",
      passportNumberLabel: "رقم جواز السفر",
      passportNumberPlaceholder: "أدخل رقم جواز سفرك",
      addressLabel: "العنوان",
      addressPlaceholder: "أدخل عنوانك",

      // Booking Form - Step 2 (Travel Details)
      travelDetails: "تفاصيل السفر",
      travelDetailsDescription: "قدم معلومات حول خطط سفرك",
      travellersInfoTitle: "معلومات المسافرين",
      adultsLabel: "البالغون",
      childrenLabel: "الأطفال (أقل من 12 سنة)",
      startDateLabel: "تاريخ البدء",
      endDateLabel: "تاريخ الانتهاء",
      pickADate: "اختر تاريخًا",
      specialRequestsLabel: "الطلبات الخاصة",
      specialRequestsPlaceholder: "هل لديك أي طلبات أو متطلبات خاصة؟",

      // Booking Form - Step 3 (Review & Confirm)
      reviewAndConfirm: "المراجعة والتأكيد",
      reviewAndConfirmDescription: "يرجى مراجعة تفاصيل الحجز قبل الإرسال",
      bookingRequestOnly: true,
      bookingRequestOnlyDescription:
        "هذا طلب حجز فقط. لا يتطلب الدفع الآن. سيقوم فريقنا بالتواصل معك لتأكيد التوافر وترتيب الدفع.",
      personalInfoTitle: "المعلومات الشخصية",
      nameLabel: "الاسم:",
      emailLabelReview: "البريد الإلكتروني:",
      phoneLabelReview: "الهاتف:",
      contactPreferenceLabel: "تفضيل التواصل:",
      nationalityLabelReview: "الجنسية:",
      passportNumberLabelReview: "رقم جواز السفر:",
      addressLabelReview: "العنوان:",
      editButton: "تعديل",
      travelersLabel: "المسافرون:",
      adult: "بالغ",
      adults: "بالغون",
      child: "طفل",
      children: "أطفال",
      startDateLabelReview: "تاريخ البدء:",
      notSpecified: "غير محدد",
      endDateLabelReview: "تاريخ الانتهاء:",
      priceDetailsTitle: "تفاصيل السعر",
      acceptTerms: true,
      termsAndConditions: "أوافق على الشروط والأحكام",
      termsLink: "الشروط والأحكام",
      privacyLink: "سياسة الخصوصية",

      // Form Buttons
      backButton: "رجوع",
      continueButton: "متابعة",
      submitBooking: "إرسال طلب الحجز",
      processing: "جارٍ المعالجة...",

      // Booking Summary
      bookingSummary: "ملخص الحجز",
      packageLabel: "الباقة",
      tax: "الضريبة",
      total: "الإجمالي",
      days: "أيام",
      bookingRequestInfo: "هذا طلب حجز فقط. لا يتطلب الدفع الآن.",
      payAtOffice: "الدفع في مكتبنا",
    },

    all: "الكل",
    loadingTours: "جاري تحميل الجولات...",
    errorLoadingTours: "خطأ في تحميل الجولات",
    tryAgain: "أعد المحاولة",
    soldOut: "نفذت الكمية",
    guideIncluded: "يتضمن مرشد",
  },

  es: {
    general: {
      search: "Buscar",
      to: "a",
      from: "desde",
      days: "días",
      other: "otro",
      currency: "EUR",
      languageSwitch: "Cambiar idioma",
      contact: {
        title: "Contáctanos",
        email: "lta.leadertravelagency@gmail.com",
        phone: "54 222 153 | 54 222 175 | 56 521 032",
        address: "Tunis – Rue Abderrahmen Azzem, Monplaisir, Immobilier El Wifak, Bloc A, 5ème étage, Bureau 54",
        whatsapp: "54 222 153 | 54 222 175 | 56 521 032",
      },
    },
    buttons: {
      bookNow: "Reservar ahora",
      search: "Buscar",
      viewMore: "Ver más",
      submit: "Enviar",
      select: "Seleccionar",
      applyFilters: "Aplicar",
      reset: "Restablecer",
      contactUs: "Contáctanos",
      subscribe: "Suscribirse",
      viewDetails: "Ver detalles",
    },

    tours: {
      adventure: "Aventura",
      cultural: "Cultural",
      beach: "Playa",
    },
    transfer: {
      baggage: "Transferencia de equipaje",
      family: "Viaje familiar",
      group: "Viaje en grupo",
    },
    trips: {
      oneWay: "Solo ida",
      roundTrip: "Ida y vuelta",
    },
    tickets: {
      flights: "Vuelos",
      ferry: "Ferry",
    },

    form: {
      name: {
        label: "Nombre completo",
        placeholder: "Ingresa tu nombre completo",
      },
      firstName: { label: "Nombre", placeholder: "Ingresa tu nombre" },
      lastName: { label: "Apellido", placeholder: "Ingresa tu apellido" },
      email: {
        label: "Correo electrónico",
        placeholder: "Ingresa tu correo electrónico",
      },
      phone: {
        label: "Teléfono",
        placeholder: "Ingresa tu número de teléfono",
      },
      address: { label: "Dirección", placeholder: "Ingresa tu dirección" },
      subject: { label: "Asunto", placeholder: "Ingresa un asunto" },
      message: { label: "Mensaje", placeholder: "Escribe tu mensaje aquí" },
      submit: "Enviar",
      personalInformation: "Tu información personal se mantendrá confidencial.",
      errorMessages: {
        required: "Este campo es obligatorio",
        invalidEmail: "Ingresa un correo electrónico válido",
        invalidPhone: "Ingresa un número de teléfono válido",
      },
    },

    landingPage: {
      tripSectionTitle: "Descubre tus destinos soñados",
      tripSectionSubtitle: "Explora nuestra selección de destinos inolvidables",
      hotelSectionTitle: "Estancias de ensueño",
      hotelSectionSubtitle: "Encuentra el alojamiento perfecto para tu viaje",
      callToAction: "Reserva tu aventura ahora",
    },

    navbar: {
      tours: "Tours",

      hotels: "Hoteles",
      tickets: "Entradas",
      transfer: "Traslados",
      contact: "Contacto",
      bookings: "Mis reservas",
      about: "Sobre nosotros",
    },

    footer: {
      tagline: "Tu aliado para experiencias de viaje únicas.",
      subscribeToNewsletter: "Suscríbete para ofertas exclusivas.",
      emailPlaceholder: "Ingresa tu correo",
      allRightsReserved: "Todos los derechos reservados.",
      address: "Tunis – Rue Abderrahmen Azzem, Monplaisir, Immobilier El Wifak, Bloc A, 5ème étage, Bureau 54",
      phone: "54 222 153 | 54 222 175 | 56 521 032",
      email: "lta.leadertravelagency@gmail.com",
      followUs: "Síguenos",
      quickLinks: "Enlaces rápidos",
      termsConditions: "Términos y condiciones",
      privacyPolicy: "Política de privacidad",
      newsletter: "Boletín",
      contactUs: "Contáctanos",
      socialMedia: {
        facebook: "Facebook",
        instagram: "Instagram",
        twitter: "Twitter",
      },
    },

    transferPage: {
      packageRequest: "Solicitar traslado",
      description:
        "Organiza tus traslados en Túnez fácilmente. Completa el formulario para una solución personalizada.",
      transferDetails: "Detalles del traslado",
      transferType: "Tipo de traslado",
      selectType: "Selecciona el tipo",
      region: "Región en Túnez",
      selectRegion: "Selecciona una región",
      destination: "Destino",
      enterDestination: "Ingresa tu destino",
      tripType: "Tipo de viaje",
      selectTripType: "Selecciona el tipo de viaje",
      pickupAddress: "Dirección de recogida",
      enterPickupAddress: "Ingresa la dirección de recogida",
      dropoffAddress: "Dirección de entrega",
      enterDropoffAddress: "Ingresa la dirección de entrega",
      preferredDate: "Fecha preferida",
      specialRequest: "Solicitudes especiales",
      whyChooseUs: {
        title: "Por qué elegirnos",
        items: [
          {
            name: "Servicio confiable",
            description: "Traslados puntuales y seguros.",
          },
          {
            name: "Vehículos cómodos",
            description: "Adaptados a todos los grupos.",
          },
          {
            name: "Precios claros",
            description: "Tarifas justas sin costos ocultos.",
          },
          {
            name: "Conductores expertos",
            description: "Profesionales con experiencia.",
          },
        ],
      },
    },


    toursPage: {
      adventureTours: "Tours de aventura",
      culturalTours: "Tours culturales",
      beachTours: "Tours de playa",
      toursFound: "tours encontrados",
      noToursFound: "No se encontraron tours",
      searchPlaceholder: "Buscar destinos o tours",
      travelerType: "Tipo de viajero",
      more: "Más",
      previous: "Anterior",
      next: "Siguiente",
    },

    contactPage: {
      title: "Contáctanos",
      description:
        "¿Preguntas sobre nuestros servicios o necesitas ayuda con tu reserva? Estamos aquí para ayudarte.",
      formTitle: "Formulario de contacto",
      contactInfo: "Información de contacto",
      ourAddress: "Nuestra dirección",
      phoneNumbers: "Números de teléfono",
      emailAddresses: "Correos electrónicos",
      workingHours: "Horario de atención",
      mondayToFriday: "Lunes a viernes: 9:00 - 18:00",
      saturday: "Sábado: 10:00 - 16:00",
      sunday: "Domingo: Cerrado",
    },

    faqPage: {
      title: "Preguntas frecuentes",
      imageAlt: "Preguntas sobre viajes",
      faqs: [
        {
          question: "¿Qué documentos necesito para viajar al extranjero?",
          answer:
            "Pasaporte válido (mínimo 6 meses), visa (si aplica), seguro de viaje y confirmaciones de reserva. Contáctanos para requisitos específicos.",
        },
        {
          question: "¿Ofrecen seguro de viaje?",
          answer:
            "Sí, ofrecemos seguros que cubren emergencias médicas, cancelaciones y pérdida de equipaje. Contáctanos para más detalles.",
        },
        {
          question: "¿Cuál es la política de cancelación?",
          answer:
            "Cancelaciones 30+ días antes: reembolso total (menos tarifas). 15-29 días: 50%. Menos de 15 días: no reembolsable. Revisa tus condiciones.",
        },
        {
          question: "¿Hay descuentos para grupos?",
          answer:
            "Sí, para 15 personas o más. Contáctanos para una cotización personalizada.",
        },
      ],
    },

    ticketsBookingPage: {
      ferryTitle: "Reserva de ferry",
      ferrydescription:
        "Reserva tu cruce en ferry con facilidad. Completa el formulario a continuación para reservar tu camarote y espacio para vehículo.",
      flightTitle: "Reserva de entradas",
      flightdescription:
        "Reserva tus entradas de vuelo con facilidad. Completa el formulario a continuación para reservar tus entradas.",
      crossingAndCabinInfo: {
        flightCrossTitle: "Información de cruce y vuelo",
        ferryCrossTitle: "Información de cruce y cabina",

        crossingType: {
          label: "Tipo de cruce (*)",
          placeholder: "Seleccionar tipo de cruce",
          options: {
            oneWay: "Solo ida",
            roundTrip: "Ida y vuelta",
            openReturn: "Retorno abierto",
          },
        },
        departureDate: {
          label: "Fecha de salida (*)",
        },
        departurePort: {
          label: "Puerto/País de salida (*)",
          placeholder: "ej. Túnez, Túnez",
        },
        departureAirPort: {
          label: "Aéroport de départ (*)",
          placeholder: "ex : Aéroport de Tunis",
        },
        arrivalAirPort: {
          label: "Aéroport d'arrivée (*)",
          placeholder: "ex : Aéroport Paris Charles de Gaulle",
        },

        arrivalPort: {
          label: "Puerto/País de llegada (*)",
          placeholder: "ej. Marsella, Francia",
        },
        cabinType: {
          label: "Tipo de camarote (*)",
          placeholder: "Seleccionar tipo de camarote",
          options: {
            inside: "Camarote interior",
            outside: "Camarote exterior",
            deluxe: "Camarote deluxe",
            suite: "Suite",
            none: "Sin camarote",
          },
        },
        vehicleType: {
          label: "Tipo de vehículo",
          placeholder: "Seleccionar tipo de vehículo",
          options: {
            none: "Sin vehículo",
            car: "Coche (hasta 5m)",
            suv: "SUV (5-6m)",
            van: "Furgoneta (6-7m)",
            motorcycle: "Motocicleta",
            other: "Otro",
          },
        },
        class: {
          label: "Clase",
          placeholder: "Selecciona una clase",
          options: {
            economy: "Económica",
            business: "Ejecutiva",
            first: "Primera",
          },
        },
        airLine: {
          label: "Aerolínea",
          placeholder: "Selecciona una aerolínea",
        },
      },
      travellersInfo: {
        title: "Información de los viajeros",
        adults: {
          label: "Adulto(s) (16-60) (*)",
        },
        children: {
          label: "Niño(s) (2-16)",
        },
        infants1to2: {
          label: "Bebé(s) (1-2 años)",
        },
        infantsUnder1: {
          label: "Bebé(s) (menores de 1 año)",
        },
        seniors: {
          label: "Mayor(es) (60+)",
        },
      },
      contactInfo: {
        title: "Información de contacto (*)",
        titleField: {
          label: "Título",
          placeholder: "Seleccionar título",
          options: {
            mr: "Sr.",
            mrs: "Sra.",
            ms: "Srta.",
            dr: "Dr.",
          },
        },
        forename: {
          label: "Nombre (*)",
          placeholder: "Tu nombre",
        },
        name: {
          label: "Apellido (*)",
          placeholder: "Tu apellido",
        },
        email: {
          label: "Correo electrónico (*)",
          placeholder: "Tu correo electrónico",
        },
        telephone: {
          label: "Teléfono (*)",
          placeholder: "Tu número de teléfono",
        },
        dateOfBirth: {
          label: "Fecha de nacimiento",
        },
        passportNumber: {
          label: "Número de pasaporte",
          placeholder: "Tu número de pasaporte",
        },
      },
      observations: {
        title: "Observaciones",
        placeholder: "Solicitudes especiales o información adicional",
      },
      buttons: {
        submitBooking: "Enviar reserva",
        processing: "Procesando...",
      },
      formErrors: {
        required: "Este campo es obligatorio",
        invalidEmail: "Ingresa un correo electrónico válido",
        invalidPhone: "Ingresa un número de teléfono válido",
        invalidDate: "Selecciona una fecha de salida válida",
      },
      ferryWhyBookWithUs: {
        title: "¿Por qué reservar con nosotros?",
        items: [
          { name: "Precios competitivos de ferry" },
          { name: "Amplia selección de camarotes" },
          { name: "Reserva de vehículos fácil" },
          { name: "Soporte al cliente 24/7" },
        ],
      },
      flightWhyBookWithUs: {
        title: "¿Por qué reservar con nosotros?",
        items: [
          { name: "Ofertas excelentes en vuelos" },
          { name: "Varias opciones de aerolíneas" },
          { name: "Reserva segura y rápida" },
          { name: "Atención al cliente 24/7" },
        ],
      },
    },
    bookingManagementPage: {
      title: "Seguimiento de tu reserva",
      description:
        "Encuentra fácilmente los detalles de tu reserva ingresando tu número de referencia a continuación. Ya sea que hayas reservado un hotel, un servicio o una excursión, puedes verificar el estado, consultar detalles o gestionar tu reserva, todo en un solo lugar.",
      card: {
        title: "Encontrar tu reserva",
        description:
          "Ingresa tu número de referencia de reserva para ver o gestionar tu reserva",
      },
      form: {
        placeholder:
          "Ingresa la referencia de la reserva (ej. BK-H-123456 o BK-S-123456)",
        buttons: {
          search: "Buscar",
          searching: "Buscando",
        },
        error: {
          emptyReference: "Por favor, ingresa una referencia de reserva",
        },
      },
      referenceFormat: {
        title: "Formato de la referencia de reserva",
        hotels: {
          label: "Hoteles",
          example: "BK-H-XXXXXX (ej. BK-H-123456)",
        },
        services: {
          label: "Servicios",
          example: "BK-S-XXXXXX (ej. BK-S-789012)",
        },
      },
      help: {
        findReference:
          "¿Necesitas ayuda para encontrar tu referencia de reserva?",
        contactSupport:
          "Revisa tu correo de confirmación o contacta con nuestro soporte al cliente en",
        supportEmail: "support@example.com",
      },
    },

    bookingTrackingPage: {
      loading: {
        message: "Cargando detalles de la reserva...",
      },
      error: {
        title: "Error",
        notFound:
          "Reserva no encontrada. Por favor, verifica el número de referencia e intenta de nuevo.",
        fetchFailed:
          "No se pudo encontrar la reserva con la referencia proporcionada.",
      },
      buttons: {
        backToSearch: "Volver a la búsqueda",
      },
      card: {
        title: "Referencia de reserva: {ref}",
        bookedOn: "Reservado el: {date}",
      },
      statuses: {
        confirmed: "Confirmado",
        pending: "Pendiente",
        canceled: "Cancelado",
        completed: "Completado",
      },
      tabs: {
        customerInfo: "Información del cliente",
      },
      customerInfo: {
        nameLabel: "{firstName} {lastName}",
        phoneLabel: "Teléfono: {phone}",
        emailLabel: "Correo electrónico: {email}",
        na: "N/D",
      },
    },
    hotelSearchPage: {
      title: "Búsqueda de hoteles",
      description:
        "Descubre el lugar perfecto para hospedarte durante tu viaje. Busca y compara hoteles en Túnez por ubicación, fecha y preferencias. Ya sea que busques lujo, comodidad u opciones económicas, tenemos todo lo que necesitas.",
      found: "encontrado",
      noHotelFound: "No se encontró ningún hotel",
      perNight: "por noche",
      filtersAndSearch: "Filtros y búsqueda",
      findYourPerfectStay: "Encuentra tu estancia perfecta",
      searchPlaceholder: "Buscar por nombre del hotel...",

      // Dates Section
      dates: "Fechas",
      checkInDate: "Fecha de entrada",
      checkOutDate: "Fecha de salida",
      selectDate: "Seleccionar fecha",

      // Destination Section
      destination: "Destino",
      selectDestination: "Seleccionar destino",
      loadingCities: "Cargando ciudades...",

      // Rooms & Guests Section
      roomsAndGuests: "Habitaciones y huéspedes",
      room: "Habitación",
      adult: "Adulto",
      adults: "Adultos",
      child: "Niño",
      children: "Niños",
      noChildren: "Sin niños",
      addChild: "Añadir niño",
      selectAge: "Seleccionar edad",
      yearsOld: "años",
      lessThanOneYear: "Menos de un año",
      addRoom: "Añadir habitación",
      removeRoom: "Eliminar habitación",

      // Hotel Categories Section
      hotelCategories: "Categorías de hoteles",
      loadingCategories: "Cargando categorías...",

      // Tags Section
      tags: "Etiquetas",
      loadingTags: "Cargando etiquetas...",

      // Additional Options Section
      additionalOptions: "Opciones adicionales",
      showOnlyAvailableHotels: "Mostrar solo hoteles disponibles",

      // Footer
      searchHotels: "Buscar hoteles",
      resetFilters: "Restablecer filtros",
    },
    detailsPage: {
      // Breadcrumb Navigation
      home: "Inicio",
      hotels: "Hoteles",

      // Hero Section
      checkIn: "Entrada",

      // Tabs
      overview: "Resumen",
      amenities: "Comodidades",
      policies: "Políticas",

      // Overview Tab
      about: "Acerca de",
      contactInformation: "Información de contacto",
      checkInTime: "Hora de entrada",
      tags: "Etiquetas",
      themes: "Temas",

      // Amenities Tab
      hotelAmenities: "Comodidades del hotel",
      mealPlansAvailable: "Planes de comidas disponibles",

      // Policies Tab
      hotelPolicies: "Políticas del hotel",

      // Booking Card
      bookYourStay: "Reserva tu estancia",
      checkAvailability: "Verificar disponibilidad",
      checkInCheckOut: "Entrada / Salida",
      selectDates: "Seleccionar fechas",
      night: "noche",
      nights: "noches",
      roomConfiguration: "Configuración de habitaciones",
      room: "habitación",
      rooms: "habitaciones",
      adults: "adultos",
      children: "niños",
      confirmChanges: "Confirmar cambios",
      selectMealPlan: "Seleccionar plan de comidas",
      availableRooms: "Habitaciones disponibles",
      available: "disponible",
      freeCancellationUntil: "Cancelación gratuita hasta",
      selected: "Seleccionado",
      select: "Seleccionar",
      bookingSummary: "Resumen de la reserva",
      total: "Total",
      proceedToBooking: "Proceder a la reserva",

      // Room Configuration Dialog
      roomConfigurationTitle: "Configuración de habitaciones",
      remove: "Eliminar",
      adultsLabel: "Adultos",
      selectNumberOfAdults: "Seleccionar número de adultos",
      childrenLabel: "Niños",
      addChild: "Añadir niño",
      noChildrenAdded: "No se han añadido niños",
      childAge: "Edad del niño",
      year: "año",
      years: "años",
      addAnotherRoom: "Añadir otra habitación",

      // Map Card
      location: "Ubicación",
      viewLargerMap: "Ver mapa más grande",
      coordinates: "Coordenadas",

      // Booking Modal
      completeYourBooking: "Completar tu reserva",
      guestInfo: "Información del huésped",
      roomGuests: "Huéspedes de la habitación",
      payment: "Pago",
      firstName: "Nombre",
      lastName: "Apellido",
      email: "Correo electrónico",
      phoneNumber: "Número de teléfono",
      address: "Dirección",
      city: "Ciudad",
      postalCode: "Código postal",
      country: "País",
      primaryGuest: "Huésped principal",
      paymentMethod: "Método de pago",
      specialRequests: "Solicitudes especiales",
      specialRequestsPlaceholder: "¿Alguna solicitud o requisito especial?",
      acceptTerms:
        "Acepto los términos y condiciones, incluida la política de cancelación",
      back: "Atrás",
      next: "Siguiente",
      completeBooking: "Completar la reserva",
      error: "Error",
      selectCheckOut: "Seleccionar fecha de salida",
      selectDatesTitle: "Seleccionar fechas",
      selectDatesPrompt: "Por favor, seleccione las fechas de su estancia para ver las habitaciones y precios disponibles.",
      loading: "Cargando disponibilidad...",
      noAvailability: "No se encontró disponibilidad para estas fechas.",
      checkAvailabilityPrompt: "Por favor, seleccione las fechas para comprobar la disponibilidad.",
    },
    serviceDetails: {
      packageNotFoundMessage:
        "El paquete que estás buscando no existe o ha sido eliminado.",
      tripPackageNotFound: "Paquete de tour no encontrado",
      backToHome: "Volver al inicio",

      // Breadcrumb Navigation
      home: "Inicio",
      trip: "Tours",

      // Hero Section
      departure: "Salida",
      days: "días",
      available: "DISPONIBLE",

      // Tabs
      overview: "Resumen",
      itinerary: "Itinerario",
      accommodation: "Alojamiento",
      inclusions: "Inclusiones",

      // Overview Tab
      aboutThisPackage: "Acerca de este paquete",
      guidanceSupport:
        "Nuestros guías experimentados te acompañarán durante todo el viaje, brindando orientación espiritual y asegurando que todos los rituales se realicen correctamente. Disfruta de un transporte cómodo, comidas deliciosas y la tranquilidad que viene con nuestros servicios de soporte 24/7.",
      packageHighlights: "Aspectos destacados del paquete",

      // Itinerary Tab
      dayItinerary: "Itinerario diario",
      meals: "Comidas",

      // Accommodation Tab
      accommodationDetails: "Detalles del alojamiento",
      hotel: "Hotel",
      transportation: "Transporte",
      transport: "Transporte",

      // Inclusions Tab
      packageInclusionsExclusions: "Inclusiones y exclusiones del paquete",
      inclusionstab: "Inclusiones",
      exclusions: "Exclusiones",
      mealsIncluded: "Comidas incluidas",
      visaProcessing: "Procesamiento y tarifas de visa",
      experiencedGuides: "Guías experimentados y eruditos religiosos",

      // Booking Card
      bookYourPackage: "Reserva tu paquete",
      tax: "impuesto",
      perPerson: "Por persona",
      total: "Total",
      bookNow: "Reservar ahora",
      departureLabel: "Salida",
      returnLabel: "Regreso",
      roundTrip: "Viaje de ida y vuelta",
      oneWayTrip: "Viaje de ida",
    },
    checkoutPage: {
      // Hero Section
      bookTourPackage: "Tu paquete turístico",
      bookGeneric: "Reserva",
      tourDescription:
        "Explora destinos inolvidables con nuestros paquetes turísticos. Ya sea que busques aventura, cultura o relajación, personaliza tu itinerario y reserva tu próxima gran escapada con facilidad.",

      // Progress Steps
      confirmation: "Confirmación",

      // Booking Form - Step 1 (Contact Information)
      contactInformation: "Información de contacto",
      personalInformation: "Por favor, proporciona tu información personal",
      firstNameLabel: "Nombre",
      firstNamePlaceholder: "Ingresa tu nombre",
      lastNameLabel: "Apellido",
      lastNamePlaceholder: "Ingresa tu apellido",
      emailLabel: "Correo electrónico",
      emailPlaceholder: "Ingresa tu dirección de correo electrónico",
      phoneLabel: "Número de teléfono",
      phonePlaceholder: "Ingresa tu número de teléfono",
      preferredContactMethod: "Método de contacto preferido",
      contactPhone: "Teléfono",
      contactEmail: "Correo electrónico",
      contactWhatsApp: "WhatsApp",
      nationalityLabel: "Nacionalidad",
      nationalityPlaceholder: "Ingresa tu nacionalidad",
      passportNumberLabel: "Número de pasaporte",
      passportNumberPlaceholder: "Ingresa tu número de pasaporte",
      addressLabel: "Dirección",
      addressPlaceholder: "Ingresa tu dirección",

      // Booking Form - Step 2 (Travel Details)
      travelDetails: "Detalles del viaje",
      travelDetailsDescription:
        "Proporciona información sobre tus planes de viaje",
      travellersInfoTitle: "Información de los viajeros",
      adultsLabel: "Adultos",
      childrenLabel: "Niños (menores de 12 años)",
      startDateLabel: "Fecha de inicio",
      endDateLabel: "Fecha de fin",
      pickADate: "Elige una fecha",
      specialRequestsLabel: "Solicitudes especiales",
      specialRequestsPlaceholder:
        "¿Tienes alguna solicitud o requerimiento especial?",

      // Booking Form - Step 3 (Review & Confirm)
      reviewAndConfirm: "Revisar y confirmar",
      reviewAndConfirmDescription:
        "Por favor, revisa los detalles de tu reserva antes de enviar",
      bookingRequestOnly: true,
      bookingRequestOnlyDescription:
        "Esto es solo una solicitud de reserva. No se requiere pago en este momento. Nuestro equipo se pondrá en contacto contigo para confirmar la disponibilidad y organizar el pago.",
      personalInfoTitle: "Información personal",
      nameLabel: "Nombre:",
      emailLabelReview: "Correo electrónico:",
      phoneLabelReview: "Teléfono:",
      contactPreferenceLabel: "Preferencia de contacto:",
      nationalityLabelReview: "Nacionalidad:",
      passportNumberLabelReview: "Número de pasaporte:",
      addressLabelReview: "Dirección:",
      editButton: "Editar",
      travelersLabel: "Viajeros:",
      adult: "Adulto",
      adults: "Adultos",
      child: "Niño",
      children: "Niños",
      startDateLabelReview: "Fecha de inicio:",
      notSpecified: "No especificado",
      endDateLabelReview: "Fecha de fin:",
      priceDetailsTitle: "Detalles del precio",
      acceptTerms: true,
      termsAndConditions: "Acepto los términos y condiciones",
      termsLink: "Términos y condiciones",
      privacyLink: "Política de privacidad",

      // Form Buttons
      backButton: "Atrás",
      continueButton: "Continuar",
      submitBooking: "Enviar solicitud de reserva",
      processing: "Procesando...",

      // Booking Summary
      bookingSummary: "Resumen de la reserva",
      packageLabel: "Paquete",
      tax: "Impuesto",
      total: "Total",
      days: "días",
      bookingRequestInfo:
        "Esto es solo una solicitud de reserva. No se requiere pago ahora.",
      payAtOffice: "Pagar en nuestra oficina",
    },
    all: "Todos",
    loadingTours: "Cargando tours...",
    errorLoadingTours: "Error al cargar tours",
    tryAgain: "Intentar de nuevo",
    soldOut: "Agotado",
    guideIncluded: "Guía incluido",
  },

  de: {
    general: {
      search: "Suchen",
      to: "bis",
      from: "von",
      days: "Tage",
      other: "andere",
      currency: "USD",
      languageSwitch: "Sprache ändern",
      contact: {
        title: "Kontaktieren Sie uns",
        email: "lta.leadertravelagency@gmail.com",
        phone: "54 222 153 | 54 222 175 | 56 521 032",
        address: "Tunis – Rue Abderrahmen Azzem, Monplaisir, Immobilier El Wifak, Bloc A, 5ème étage, Bureau 54",
        whatsapp: "54 222 153 | 54 222 175 | 56 521 032",
      },
    },
    buttons: {
      bookNow: "Jetzt buchen",
      search: "Suchen",
      viewMore: "Mehr anzeigen",
      submit: "Absenden",
      select: "Auswählen",
      applyFilters: "anwenden",
      reset: "Zurücksetzen",
      contactUs: "Kontaktieren Sie uns",
      subscribe: "Abonnieren",
      viewDetails: "Details anzeigen",
    },
    tours: {
      adventure: "Abenteuer",
      cultural: "Kulturell",
      beach: "Strand",
    },
    transfer: {
      baggage: "Gepäcktransport",
      family: "Familienreise",
      group: "Gruppenreise",
    },
    trips: {
      oneWay: "Hinreise",
      roundTrip: "Hin- und Rückreise",
    },
    tickets: {
      flights: "Flüge",
      ferry: "Fähre",
    },
    form: {
      name: {
        label: "Vollständiger Name",
        placeholder: "Geben Sie Ihren vollständigen Namen ein",
      },
      firstName: {
        label: "Vorname",
        placeholder: "Geben Sie Ihren Vornamen ein",
      },
      lastName: {
        label: "Nachname",
        placeholder: "Geben Sie Ihren Nachnamen ein",
      },
      email: {
        label: "E-Mail",
        placeholder: "Geben Sie Ihre E-Mail-Adresse ein",
      },
      phone: {
        label: "Telefon",
        placeholder: "Geben Sie Ihre Telefonnummer ein",
      },
      address: { label: "Adresse", placeholder: "Geben Sie Ihre Adresse ein" },
      subject: { label: "Betreff", placeholder: "Geben Sie einen Betreff ein" },
      message: {
        label: "Nachricht",
        placeholder: "Schreiben Sie Ihre Nachricht hier",
      },
      submit: "Absenden",
      personalInformation: "Ihre persönlichen Daten bleiben vertraulich.",
      errorMessages: {
        required: "Dieses Feld ist erforderlich",
        invalidEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
        invalidPhone: "Bitte geben Sie eine gültige Telefonnummer ein",
      },
    },
    landingPage: {
      tripSectionTitle: "Entdecken Sie Ihre Traumziele",
      tripSectionSubtitle:
        "Erkunden Sie unsere sorgfältig ausgewählten atemberaubenden Reiseziele",
      hotelSectionTitle: "Unvergessliche Hotelaufenthalte",
      hotelSectionSubtitle: "Finden Sie die perfekte Unterkunft für Ihre Reise",
      callToAction: "Buchen Sie jetzt Ihr Abenteuer",
    },
    navbar: {
      tours: "Reisen",

      hotels: "Hotels",
      tickets: "Tickets",
      transfer: "Transfers",
      contact: "Kontakt",
      bookings: "Meine Buchungen",
      about: "Über uns",
    },
    footer: {
      tagline:
        "Ihr vertrauenswürdiger Partner für unvergessliche Reiseerlebnisse.",
      subscribeToNewsletter:
        "Melden Sie sich für unseren Newsletter an, um exklusive Angebote und Reisetipps zu erhalten.",
      emailPlaceholder: "Geben Sie Ihre E-Mail-Adresse ein",
      allRightsReserved: "Alle Rechte vorbehalten.",
      address: "Tunis – Rue Abderrahmen Azzem, Monplaisir, Immobilier El Wifak, Bloc A, 5ème étage, Bureau 54",
      phone: "54 222 153 | 54 222 175 | 56 521 032",
      email: "lta.leadertravelagency@gmail.com",
      followUs: "Folgen Sie uns",
      quickLinks: "Schnelllinks",
      termsConditions: "Allgemeine Geschäftsbedingungen",
      privacyPolicy: "Datenschutzrichtlinie",
      newsletter: "Newsletter",
      contactUs: "Kontaktieren Sie uns",
      socialMedia: {
        facebook: "Facebook",
        instagram: "Instagram",
        twitter: "Twitter",
      },
    },
    transferPage: {
      packageRequest: "Transfer anfragen",
      description:
        "Planen Sie mühelos Ihre Transfers in Tunesien. Ob für Gepäck, Familienreisen oder Gruppenreisen, füllen Sie das untenstehende Formular für eine maßgeschneiderte Lösung aus.",
      transferDetails: "Transferdetails",
      transferType: "Transfertyp",
      selectType: "Wählen Sie den Transfertyp",
      region: "Region in Tunesien",
      selectRegion: "Wählen Sie eine Region",
      destination: "Ziel",
      enterDestination: "Geben Sie Ihr Ziel ein",
      tripType: "Reisetyp",
      selectTripType: "Wählen Sie den Reisetyp",
      pickupAddress: "Abholadresse",
      enterPickupAddress: "Geben Sie die Abholadresse ein",
      dropoffAddress: "Abgabeadresse",
      enterDropoffAddress: "Geben Sie die Abgabeadresse ein",
      preferredDate: "Wunschdatum",
      specialRequest: "Besondere Anforderungen",
      whyChooseUs: {
        title: "Warum uns wählen",
        items: [
          {
            name: "Zuverlässiger Service",
            description: "Pünktliche und zuverlässige Transfers, immer.",
          },
          {
            name: "Komfortable Fahrten",
            description: "Moderne Fahrzeuge für alle Gruppengrößen.",
          },
          {
            name: "Transparente Preise",
            description: "Erschwingliche Tarife ohne versteckte Kosten.",
          },
          {
            name: "Erfahrene Fahrer",
            description: "Professionelles und kompetentes Personal.",
          },
        ],
      },
    },

    toursPage: {
      adventureTours: "Abenteuerreisen & Erlebnisse",
      culturalTours: "Kulturreisen & Erlebnisse",
      beachTours: "Strandreisen & Erlebnisse",
      toursFound: "Reisen gefunden",
      noToursFound: "Keine Reisen gefunden",
      searchPlaceholder: "Suche nach Zielen oder Reisen",
      travelerType: "Reisetyp",
      more: "Mehr",
      previous: "Vorherige",
      next: "Nächste",
    },
    contactPage: {
      title: "Kontakt aufnehmen",
      description:
        "Fragen zu unseren Dienstleistungen oder benötigen Sie Hilfe bei Ihrer Buchung? Unser Team steht Ihnen zur Seite, um Ihre perfekte Reise zu planen.",
      formTitle: "Kontaktformular",
      contactInfo: "Kontaktinformationen",
      ourAddress: "Unsere Adresse",
      phoneNumbers: "Telefonnummern",
      emailAddresses: "E-Mail-Adressen",
      workingHours: "Öffnungszeiten",
      mondayToFriday: "Montag bis Freitag: 9:00 - 18:00 Uhr",
      saturday: "Samstag: 10:00 - 16:00 Uhr",
      sunday: "Sonntag: Geschlossen",
    },
    faqPage: {
      title: "Häufig gestellte Fragen",
      imageAlt: "Reise-FAQs",
      faqs: [
        {
          question:
            "Welche Dokumente sind für internationale Reisen erforderlich?",
          answer:
            "Ein gültiger Reisepass (mit mindestens 6 Monaten Gültigkeit), ein Visum (falls erforderlich), eine Reiseversicherung und Buchungsbestätigungen sind in der Regel erforderlich. Kontaktieren Sie unser Team für destinationsspezifische Anforderungen.",
        },
        {
          question: "Bieten Sie Reiseversicherungen an?",
          answer:
            "Ja, wir bieten umfassende Reiseversicherungspakete an, die medizinische Notfälle, Reiseannullierungen, verlorenes Gepäck und andere unvorhergesehene Umstände abdecken. Unsere Berater können Ihnen helfen, die richtige Option für Ihre Reise auszuwählen.",
        },
        {
          question: "Wie lautet Ihre Stornierungsrichtlinie?",
          answer:
            "Unsere Stornierungsrichtlinie variiert je nach Art der Buchung und Stornierungsfrist. Im Allgemeinen können Stornierungen, die 30 Tage vor der Abreise erfolgen, eine vollständige Rückerstattung abzüglich Verwaltungsgebühren erhalten. Stornierungen, die 15-29 Tage vor der Abreise erfolgen, erhalten in der Regel eine 50%ige Rückerstattung, während Stornierungen weniger als 15 Tage vor der Abreise in der Regel nicht erstattungsfähig sind. Bitte überprüfen Sie die spezifischen Bedingungen Ihrer Buchung für weitere Details.",
        },
        {
          question: "Gibt es Gruppenrabatte?",
          answer:
            "Ja, wir bieten Rabatte für Gruppen ab 15 Personen an. Kontaktieren Sie uns für ein individuelles Angebot.",
        },
      ],
    },
    ticketsBookingPage: {
      ferryTitle: "Fährbuchung",
      ferrydescription:
        "Buchen Sie Ihre Fährüberfahrt mühelos. Füllen Sie das Formular unten aus, um Ihre Kabine und Ihren Fahrzeugplatz zu reservieren.",
      flightTitle: "Flugbuchung",
      flightdescription:
        "Buchen Sie Ihre Flugreise mühelos. Füllen Sie das Formular unten aus, um Ihre Flugnummer und Ihren Sitzplatz zu reservieren.",
      crossingAndCabinInfo: {
        flightCrossTitle: "Informationen zur Überfahrt und zum Flug",
        ferryCrossTitle: "Informationen zur Überfahrt und zur Kabine",
        crossingType: {
          label: "Art der Überfahrt (*)",
          placeholder: "Überfahrttyp auswählen",
          options: {
            oneWay: "Hinfahrt",
            roundTrip: "Hin- und Rückfahrt",
            openReturn: "Offene Rückfahrt",
          },
        },
        departureDate: {
          label: "Abfahrtsdatum (*)",
        },
        departurePort: {
          label: "Abfahrtshafen/Land (*)",
          placeholder: "z.B. Tunis, Tunesien",
        },
        departureAirPort: {
          label: "Abflughafen (*)",
          placeholder: "z. B. Flughafen Tunis",
        },
        arrivalAirPort: {
          label: "Ankunftsflughafen (*)",
          placeholder: "z. B. Flughafen Paris Charles de Gaulle",
        },

        arrivalPort: {
          label: "Ankunftshafen/Land (*)",
          placeholder: "z.B. Marseille, Frankreich",
        },
        cabinType: {
          label: "Kabinentyp (*)",
          placeholder: "Kabinentyp auswählen",
          options: {
            inside: "Innenkabine",
            outside: "Außenkabine",
            deluxe: "Deluxe-Kabine",
            suite: "Suite",
            none: "Keine Kabine",
          },
        },
        vehicleType: {
          label: "Fahrzeugtyp",
          placeholder: "Fahrzeugtyp auswählen",
          options: {
            none: "Kein Fahrzeug",
            car: "Auto (bis 5m)",
            suv: "SUV (5-6m)",
            van: "Van (6-7m)",
            motorcycle: "Motorrad",
            other: "Sonstiges",
          },
        },
        class: {
          label: "Klasse",
          placeholder: "Klasse auswählen",
          options: {
            economy: "Economy",
            business: "Business",
            first: "First Class",
          },
        },
        airLine: {
          label: "Fluggesellschaft",
          placeholder: "Fluggesellschaft auswählen",
        },
      },
      travellersInfo: {
        title: "Reisendeninformationen",
        adults: {
          label: "Erwachsene (16-60) (*)",
        },
        children: {
          label: "Kinder (2-16)",
        },
        infants1to2: {
          label: "Kleinkinder (1-2 Jahre)",
        },
        infantsUnder1: {
          label: "Säuglinge (unter 1 Jahr)",
        },
        seniors: {
          label: "Senioren (60+)",
        },
      },
      contactInfo: {
        title: "Kontaktinformationen (*)",
        titleField: {
          label: "Anrede",
          placeholder: "Anrede auswählen",
          options: {
            mr: "Herr",
            mrs: "Frau",
            ms: "Fräulein",
            dr: "Dr.",
          },
        },
        forename: {
          label: "Vorname (*)",
          placeholder: "Ihr Vorname",
        },
        name: {
          label: "Nachname (*)",
          placeholder: "Ihr Nachname",
        },
        email: {
          label: "E-Mail (*)",
          placeholder: "Ihre E-Mail-Adresse",
        },
        telephone: {
          label: "Telefon (*)",
          placeholder: "Ihre Telefonnummer",
        },
        dateOfBirth: {
          label: "Geburtsdatum",
        },
        passportNumber: {
          label: "Reisepassnummer",
          placeholder: "Ihre Reisepassnummer",
        },
      },
      observations: {
        title: "Bemerkungen",
        placeholder: "Besondere Wünsche oder zusätzliche Informationen",
      },
      buttons: {
        submitBooking: "Buchung absenden",
        processing: "Wird verarbeitet...",
      },
      formErrors: {
        required: "Dieses Feld ist erforderlich",
        invalidEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
        invalidPhone: "Bitte geben Sie eine gültige Telefonnummer ein",
        invalidDate: "Bitte wählen Sie ein gültiges Abfahrtsdatum",
      },
      ferryWhyBookWithUs: {
        title: "Warum bei uns buchen?",
        items: [
          { name: "Wettbewerbsfähige Fährpreise" },
          { name: "Große Auswahl an Kabinen" },
          { name: "Einfache Fahrzeugbuchung" },
          { name: "Kundensupport rund um die Uhr" },
        ],
      },
      flightWhyBookWithUs: {
        title: "Warum bei uns buchen?",
        items: [
          { name: "Top Flugangebote" },
          { name: "Große Auswahl an Fluggesellschaften" },
          { name: "Schnelle und sichere Buchung" },
          { name: "Kundensupport rund um die Uhr" },
        ],
      },
    },
    bookingManagementPage: {
      title: "Ihre Buchung verfolgen",
      description:
        "Finden Sie Ihre Buchungsdetails einfach, indem Sie unten Ihre Buchungsreferenznummer eingeben. Egal, ob Sie ein Hotel, einen Service oder eine Tour gebucht haben, Sie können den Status überprüfen, Details ansehen oder Ihre Buchung verwalten – alles an einem Ort.",
      card: {
        title: "Ihre Buchung finden",
        description:
          "Geben Sie Ihre Buchungsreferenznummer ein, um Ihre Buchung anzuzeigen oder zu verwalten",
      },
      form: {
        placeholder:
          "Buchungsreferenz eingeben (z.B. BK-H-123456 oder BK-S-123456)",
        buttons: {
          search: "Suchen",
          searching: "Wird gesucht",
        },
        error: {
          emptyReference: "Bitte geben Sie eine Buchungsreferenz ein",
        },
      },
      referenceFormat: {
        title: "Format der Buchungsreferenz",
        hotels: {
          label: "Hotels",
          example: "BK-H-XXXXXX (z.B. BK-H-123456)",
        },
        services: {
          label: "Dienstleistungen",
          example: "BK-S-XXXXXX (z.B. BK-S-789012)",
        },
      },
      help: {
        findReference:
          "Benötigen Sie Hilfe beim Finden Ihrer Buchungsreferenz?",
        contactSupport:
          "Überprüfen Sie Ihre Bestätigungs-E-Mail oder kontaktieren Sie unseren Kundensupport unter",
        supportEmail: "support@example.com",
      },
    },
    bookingTrackingPage: {
      loading: {
        message: "Buchungsdetails werden geladen...",
      },
      error: {
        title: "Fehler",
        notFound:
          "Buchung nicht gefunden. Bitte überprüfen Sie die Referenznummer und versuchen Sie es erneut.",
        fetchFailed:
          "Buchung mit der angegebenen Referenz konnte nicht gefunden werden.",
      },
      buttons: {
        backToSearch: "Zurück zur Suche",
      },
      card: {
        title: "Buchungsreferenz: {ref}",
        bookedOn: "Gebucht am: {date}",
      },
      statuses: {
        confirmed: "Bestätigt",
        pending: "Ausstehend",
        canceled: "Storniert",
        completed: "Abgeschlossen",
      },
      tabs: {
        customerInfo: "Kundeninformationen",
      },
      customerInfo: {
        nameLabel: "{firstName} {lastName}",
        phoneLabel: "Telefon: {phone}",
        emailLabel: "E-Mail: {email}",
        na: "N/V",
      },
    },
    hotelSearchPage: {
      title: "Hotelsuche",
      description:
        "Entdecken Sie den perfekten Ort für Ihren Aufenthalt während Ihrer Reise. Suchen und vergleichen Sie Hotels in Tunesien nach Standort, Datum und Vorlieben. Egal, ob Sie Luxus, Komfort oder preisgünstige Optionen suchen, wir haben alles für Sie.",
      found: "gefunden",
      noHotelFound: "Kein Hotel gefunden",
      perNight: "pro Nacht",
      filtersAndSearch: "Filter und Suche",
      findYourPerfectStay: "Finden Sie Ihren perfekten Aufenthalt",
      searchPlaceholder: "Nach Hotelname suchen...",

      // Dates Section
      dates: "Daten",
      checkInDate: "Anreisedatum",
      checkOutDate: "Abreisedatum",
      selectDate: "Datum auswählen",

      // Destination Section
      destination: "Reiseziel",
      selectDestination: "Reiseziel auswählen",
      loadingCities: "Städte werden geladen...",

      // Rooms & Guests Section
      roomsAndGuests: "Zimmer und Gäste",
      room: "Zimmer",
      adult: "Erwachsener",
      adults: "Erwachsene",
      child: "Kind",
      children: "Kinder",
      noChildren: "Keine Kinder",
      addChild: "Kind hinzufügen",
      selectAge: "Alter auswählen",
      yearsOld: "Jahre",
      lessThanOneYear: "Weniger als ein Jahr",
      addRoom: "Zimmer hinzufügen",
      removeRoom: "Zimmer entfernen",

      // Hotel Categories Section
      hotelCategories: "Hotelkategorien",
      loadingCategories: "Kategorien werden geladen...",

      // Tags Section
      tags: "Tags",
      loadingTags: "Tags werden geladen...",

      // Additional Options Section
      additionalOptions: "Zusätzliche Optionen",
      showOnlyAvailableHotels: "Nur verfügbare Hotels anzeigen",

      // Footer
      searchHotels: "Hotels suchen",
      resetFilters: "Filter zurücksetzen",
    },
    detailsPage: {
      home: "Startseite",
      hotels: "Hotels",

      // Hero Section
      checkIn: "Anreise",

      // Tabs
      overview: "Übersicht",
      amenities: "Ausstattung",
      policies: "Richtlinien",

      // Overview Tab
      about: "Über",
      contactInformation: "Kontaktinformationen",
      checkInTime: "Anreisezeit",
      tags: "Tags",
      themes: "Themen",

      // Amenities Tab
      hotelAmenities: "Hoteleinrichtungen",
      mealPlansAvailable: "Verfügbare Verpflegungspläne",

      // Policies Tab
      hotelPolicies: "Hotelrichtlinien",

      // Booking Card
      bookYourStay: "Ihren Aufenthalt buchen",
      checkAvailability: "Verfügbarkeit prüfen",
      checkInCheckOut: "Anreise / Abreise",
      selectDates: "Daten auswählen",
      night: "Nacht",
      nights: "Nächte",
      roomConfiguration: "Zimmerkonfiguration",
      room: "Zimmer",
      rooms: "Zimmer",
      adults: "Erwachsene",
      children: "Kinder",
      confirmChanges: "Änderungen bestätigen",
      selectMealPlan: "Verpflegungsplan auswählen",
      availableRooms: "Verfügbare Zimmer",
      available: "verfügbar",
      freeCancellationUntil: "Kostenlose Stornierung bis",
      selected: "Ausgewählt",
      select: "Auswählen",
      bookingSummary: "Buchungsübersicht",
      total: "Gesamt",
      proceedToBooking: "Zur Buchung fortfahren",

      // Room Configuration Dialog
      roomConfigurationTitle: "Zimmerkonfiguration",
      remove: "Entfernen",
      adultsLabel: "Erwachsene",
      selectNumberOfAdults: "Anzahl der Erwachsenen auswählen",
      childrenLabel: "Kinder",
      addChild: "Kind hinzufügen",
      noChildrenAdded: "Keine Kinder hinzugefügt",
      childAge: "Alter des Kindes",
      year: "Jahr",
      years: "Jahre",
      addAnotherRoom: "Ein weiteres Zimmer hinzufügen",

      // Map Card
      location: "Standort",
      viewLargerMap: "Größere Karte anzeigen",
      coordinates: "Koordinaten",

      // Booking Modal
      completeYourBooking: "Ihre Buchung abschließen",
      guestInfo: "Gastinformationen",
      roomGuests: "Zimmergäste",
      payment: "Zahlung",
      firstName: "Vorname",
      lastName: "Nachname",
      email: "E-Mail",
      phoneNumber: "Telefonnummer",
      address: "Adresse",
      city: "Stadt",
      postalCode: "Postleitzahl",
      country: "Land",
      primaryGuest: "Hauptgast",
      paymentMethod: "Zahlungsmethode",
      specialRequests: "Besondere Anfragen",
      specialRequestsPlaceholder:
        "Gibt es besondere Anfragen oder Anforderungen?",
      acceptTerms:
        "Ich stimme den Allgemeinen Geschäftsbedingungen zu, einschließlich der Stornierungsrichtlinie",
      back: "Zurück",
      next: "Weiter",
      completeBooking: "Buchung abschließen",
      error: "Fehler",
      selectCheckOut: "Check-out-Datum wählen",
      selectDatesTitle: "Daten auswählen",
      selectDatesPrompt: "Bitte wählen Sie Ihre Reisedaten aus, um verfügbare Zimmer und Preise zu sehen.",
      loading: "Verfügbarkeit wird geladen...",
      noAvailability: "Keine Verfügbarkeit für diese Daten gefunden.",
      checkAvailabilityPrompt: "Bitte wählen Sie Daten aus, um die Verfügbarkeit zu prüfen.",
    },
    serviceDetails: {
      packageNotFoundMessage:
        "Das gesuchte Paket existiert nicht oder wurde entfernt.",
      tripPackageNotFound: "Reisen-Paket nicht gefunden",
      backToHome: "Zurück zur Startseite",

      // Breadcrumb Navigation
      home: "Startseite",
      trip: "Reisen",

      // Hero Section
      departure: "Abreise",
      days: "Tage",
      available: "VERFÜGBAR",

      // Tabs
      overview: "Übersicht",
      itinerary: "Reiseplan",
      accommodation: "Unterkunft",
      inclusions: "Inklusivleistungen",

      // Overview Tab
      aboutThisPackage: "Über dieses Paket",
      guidanceSupport:
        "Unsere erfahrenen Reiseleiter begleiten Sie während der gesamten Reise, bieten spirituelle Anleitung und stellen sicher, dass alle Rituale korrekt durchgeführt werden. Genießen Sie bequemen Transport, köstliche Mahlzeiten und die Sicherheit, die unsere 24/7-Unterstützung bietet.",
      packageHighlights: "Höhepunkte des Pakets",

      // Itinerary Tab
      dayItinerary: "Täglicher Reiseplan",
      meals: "Mahlzeiten",

      // Accommodation Tab
      accommodationDetails: "Unterkunftsdetails",
      hotel: "Hotel",
      transportation: "Transport",
      transport: "Transport",

      // Inclusions Tab
      packageInclusionsExclusions: "Inklusivleistungen und Ausschlüsse",
      inclusionstab: "Inklusivleistungen",
      exclusions: "Ausschlüsse",
      mealsIncluded: "Mahlzeiten inbegriffen",
      visaProcessing: "Visumbearbeitung und Gebühren",
      experiencedGuides: "Erfahrene Reiseleiter und Religionsgelehrte",

      // Booking Card
      bookYourPackage: "Ihr Paket buchen",
      tax: "Steuer",
      perPerson: "Pro Person",
      total: "Gesamt",
      bookNow: "Jetzt buchen",
      departureLabel: "Abreise",
      returnLabel: "Rückkehr",
      roundTrip: "Hin- und Rückreise",
      oneWayTrip: "Hinfahrt",
    },
    checkoutPage: {
      bookTourPackage: "Ihr Reisepaket",
      bookGeneric: "Buchung",
      tourDescription:
        "Entdecken Sie unvergessliche Reiseziele mit unseren Reisepaketen. Ob Sie Abenteuer, Kultur oder Entspannung suchen, gestalten Sie Ihre Reiseroute individuell und buchen Sie Ihr nächstes großes Abenteuer mit Leichtigkeit.",

      // Progress Steps
      confirmation: "Bestätigung",

      // Booking Form - Step 1 (Contact Information)
      contactInformation: "Kontaktinformationen",
      personalInformation:
        "Bitte geben Sie Ihre persönlichen Informationen ein",
      firstNameLabel: "Vorname",
      firstNamePlaceholder: "Geben Sie Ihren Vornamen ein",
      lastNameLabel: "Nachname",
      lastNamePlaceholder: "Geben Sie Ihren Nachnamen ein",
      emailLabel: "E-Mail",
      emailPlaceholder: "Geben Sie Ihre E-Mail-Adresse ein",
      phoneLabel: "Telefonnummer",
      phonePlaceholder: "Geben Sie Ihre Telefonnummer ein",
      preferredContactMethod: "Bevorzugte Kontaktmethode",
      contactPhone: "Telefon",
      contactEmail: "E-Mail",
      contactWhatsApp: "WhatsApp",
      nationalityLabel: "Nationalität",
      nationalityPlaceholder: "Geben Sie Ihre Nationalität ein",
      passportNumberLabel: "Passnummer",
      passportNumberPlaceholder: "Geben Sie Ihre Passnummer ein",
      addressLabel: "Adresse",
      addressPlaceholder: "Geben Sie Ihre Adresse ein",

      // Booking Form - Step 2 (Travel Details)
      travelDetails: "Reisedetails",
      travelDetailsDescription:
        "Geben Sie Informationen zu Ihren Reiseplänen an",
      travellersInfoTitle: "Informationen zu den Reisenden",
      adultsLabel: "Erwachsene",
      childrenLabel: "Kinder (unter 12 Jahre)",
      startDateLabel: "Startdatum",
      endDateLabel: "Enddatum",
      pickADate: "Wählen Sie ein Datum",
      specialRequestsLabel: "Besondere Wünsche",
      specialRequestsPlaceholder:
        "Haben Sie spezielle Wünsche oder Anforderungen?",

      // Booking Form - Step 3 (Review & Confirm)
      reviewAndConfirm: "Überprüfen und Bestätigen",
      reviewAndConfirmDescription:
        "Bitte überprüfen Sie Ihre Buchungsdetails vor dem Absenden",
      bookingRequestOnly: true,
      bookingRequestOnlyDescription:
        "Dies ist nur eine Buchungsanfrage. Derzeit ist keine Zahlung erforderlich. Unser Team wird Sie kontaktieren, um die Verfügbarkeit zu bestätigen und die Zahlung zu organisieren.",
      personalInfoTitle: "Persönliche Informationen",
      nameLabel: "Name:",
      emailLabelReview: "E-Mail:",
      phoneLabelReview: "Telefon:",
      contactPreferenceLabel: "Kontaktpräferenz:",
      nationalityLabelReview: "Nationalität:",
      passportNumberLabelReview: "Passnummer:",
      addressLabelReview: "Adresse:",
      editButton: "Bearbeiten",
      travelersLabel: "Reisende:",
      adult: "Erwachsener",
      adults: "Erwachsene",
      child: "Kind",
      children: "Kinder",
      startDateLabelReview: "Startdatum:",
      notSpecified: "Nicht angegeben",
      endDateLabelReview: "Enddatum:",
      priceDetailsTitle: "Preisdetails",
      acceptTerms: true,
      termsAndConditions: "Ich akzeptiere die Allgemeinen Geschäftsbedingungen",
      termsLink: "Allgemeine Geschäftsbedingungen",
      privacyLink: "Datenschutzrichtlinie",

      // Form Buttons
      backButton: "Zurück",
      continueButton: "Weiter",
      submitBooking: "Buchungsanfrage senden",
      processing: "Wird verarbeitet...",

      // Booking Summary
      bookingSummary: "Buchungszusammenfassung",
      packageLabel: "Paket",
      tax: "Steuer",
      total: "Gesamt",
      days: "Tage",
      bookingRequestInfo:
        "Dies ist nur eine Buchungsanfrage. Jetzt ist keine Zahlung erforderlich.",
      payAtOffice: "Zahlung in unserem Büro",
    },
    all: "Alle",
    loadingTours: "Touren werden geladen...",
    errorLoadingTours: "Fehler beim Laden der Touren",
    tryAgain: "Erneut versuchen",
    soldOut: "Ausverkauft",
    guideIncluded: "Führer inklusive",
  },
};
// Create context with default value
const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Get initial language from localStorage or default to 'en'
  const [currentLanguage, setCurrentLanguage] = useState("en");

  useEffect(() => {
    // Try to get language from localStorage on client side
    try {
      const savedLanguage = localStorage.getItem("language") || "en";
      setCurrentLanguage(savedLanguage);

      // Set document direction and language for RTL languages
      if (savedLanguage === "ar") {
        document.documentElement.dir = "rtl";
        document.documentElement.lang = "ar";
      } else {
        document.documentElement.dir = "ltr";
        document.documentElement.lang = savedLanguage;
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
  }, []);

  const changeLanguage = (langCode: string) => {
    if (languages[langCode]) {
      setCurrentLanguage(langCode);
      try {
        localStorage.setItem("language", langCode);
      } catch (error) {
        console.error("Error writing to localStorage:", error);
      }

      // Set document direction and language for RTL languages
      if (langCode === "ar") {
        document.documentElement.dir = "rtl";
        document.documentElement.lang = "ar";
      } else {
        document.documentElement.dir = "ltr";
        document.documentElement.lang = langCode;
      }
    }
  };

  // Get translations for current language with English as fallback
  const t = {
    ...languages.en, // Default fallback to English
    ...languages[currentLanguage],
  };

  return (
    <LanguageContext.Provider
      value={{ t, changeLanguage, currentLanguage, isLoading: false }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
