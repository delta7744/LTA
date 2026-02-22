import { Geo } from "next/font/google";

interface Itinerary {
  day: string;
  meals: string;
  activities: Activity[];
  _id: string; // MongoDB ObjectId
  createdAt?: string; // ISO date string (optional)
  updatedAt?: string; // ISO date string (optional)
}

interface Activity {
  activityName: string;
  activityTime?: string; // ISO date string (optional)
  description?: string; // Optional field
  cost?: number; // Optional field
  _id: string; // MongoDB ObjectId
  createdAt?: string; // ISO date string (optional)
  updatedAt?: string; // ISO date string (optional)
}
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "paid"
  | "partially_paid"
  | "canceled"
  | "completed"
  | "refunded";

export type ServiceType =
  | "trip"
  | "ticket"
  | "transfer"
  | "hotel"
  | "custom";

export type PaymentMethod =
  | "credit_card"
  | "bank_transfer"
  | "cash"
  | "paypal"
  | "other";

interface TripItinerary {
  day: string;
  meals: string;
  activities: Activity[];
  _id: string;
  accommodation: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TripPrice {
  basePrice: number;
  discounts: number;
}

export interface Trip {
  _id: string;
  title: string;
  tripType: "cultural" | "adventure" | "beach";
  description: string;
  transportType: "flight" | "bus" | "train" | "cruise";
  transport: string;
  departureCity: string;
  destination: string;
  duration: number;
  departureDate: string;
  returnDate?: string;
  departureOptions: "go_only" | "go_and_back";
  includedServices: string[];
  excludedServices: string[];
  notIncludedServices?: string[];
  tripHighlights: string[];
  images: string[];
  price: TripPrice[];
  tax?: number;
  maxParticipants: number;
  travelerType: "adult" | "child" | "senior" | "any";
  itinerary: TripItinerary[];
  status: "active" | "sold_out" | "upcoming" | "archived" | "canceled";
  accommodationDetails: string;
  guideAvailable: boolean;
  bookingConstraints?: {
    minBookingDays?: number;
    cancellationPolicy?: string;
  };
  createdBy?: string;
  handledBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Banner {
  _id: string;
  title: string;
  subTitle: string;
  image: string;
  link: string;
  isActive: boolean;
}

export interface Tag {
  _id: string;
  Id: string;
  Title: string;
}

export interface Category {
  _id?: string;
  Id: string;
  Title: string;
  Star?: number;
}

// Search Parameters Types
export interface SearchDetails {
  BookingDetails: {
    CheckIn: string
    CheckOut: string
    City?: number
    Hotel?: number[]
  }
  Filters: {
    Keywords: string
    Category: string[]
    OnlyAvailable: boolean
    Tags: string[]
  }
  Rooms: RoomConfig[]
}

export interface RoomConfig {
  Adult: number
  Child?: number[]
}

// Hotel Types
export interface Hotel {
  Hotel: {
    Id: number
    Name: string
    Category: {
      Id: string
      Title: string
      Star: number | null
    }
    City: {
      Id: number
      Name: string
    }
    Adress: string
    Image: string
    Theme: string[]
    Note: string
  }
  Token: string
  Price: {
    Boarding: BoardingOption[]
    BasePrice: string
  }
  Source: string
  Currency: string
  Recommended: number
}

export interface BoardingOption {
  Id: number
  Code: string
  Name: string
  Description: string
  Pax: PaxOption[]
}

export interface PaxOption {
  Adult: number
  Child?: number[]
  Rooms: RoomOption[]
}

export interface RoomOption {
  Id: number
  Name: string
  Photo: string | null
  Description: string
  Icones: string[]
  Quantity: number
  Price: string
  BasePrice: string
  StopReservation: boolean
  OnRequest: boolean
}


interface Country {
  Id?: number;
  Name?: string;
}

export interface City {
  Id?: number;
  Name?: string;
  images?: string | null;
  Region?: string;
  Country?: Country;
}

// Add these types to your existing types.ts file

export interface HotelDetail {
  Id: number;
  Name: string;
  Category: {
    Title: string;
    Star: number;
  };
  City: {
    Id: number;
    Name: string;
    Country: string;
  };
  Email: string;
  Phone: string;
  LongDescription: string;
  Adress: string;
  Localization?: {
    Longitude: string;
    Latitude: string;
  };
  CheckIn: string;
  Image: string;
  Album: {
    Url: string;
    Alt: string | null;
  }[];
  Option: {
    Id: number;
    Title: string;
  }[];
  Tag: {
    Id: number;
    Title: string;
    Image: string;
  }[];
  Boarding: {
    Id: number;
    Code: string;
    Name: string;
    Description: string | null;
  }[];
  Theme: string[];
  Note: string;
}

export interface HotelBooking {
  Hotel: {
    Id: number;
    Name: string;
    Category: {
      Title: string;
      Star: number;
    };
    City: {
      Id: number;
      Name: string;
    };
    Adress: string;
    Image: string;
    Theme: string[];
  };
  Token: string;
  Price: {
    Boarding: {
      Id: number;
      Code: string;
      Name: string;
      Description: string;
      Pax: {
        Adult: number;
        Child?: number[];
        Rooms: {
          Id: number;
          Name: string;
          Photo: string | null;
          Description: string;
          Icones: string[];
          Quantity: number;
          Price: string;
          BasePrice: string;
          StopReservation: boolean;
          CancellationPolicy: {
            Fees: string;
            Type: string;
            Nature: string;
            FromDate?: string;
          }[];
          CancellationDeadline: string;
        }[];
      }[];
    }[];
    BasePrice: string;
  };
  Source: string;
  Currency: string;
  Recommended: number;
}