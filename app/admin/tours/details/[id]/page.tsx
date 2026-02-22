"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Calendar,
  Users,
  MapPin,
  DollarSign,
  Building,
  Mountain,
  Palmtree,
  Plane,
  Bus,
  Train,
  Ship,
  Clock,
  RefreshCw,
  Edit,
  Check,
  X,
  AlertCircle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface TripActivity {
  activityName: string;
  activityTime?: string;
  description?: string;
  cost?: number;
}

interface TripItinerary {
  day: string;
  activities: TripActivity[];
  meals?: string;
  accommodation?: string;
}

interface Trip {
  _id: string;
  title: string;
  tripType: "cultural" | "adventure" | "beach";
  description: string;
  transportType: "flight" | "bus" | "train" | "cruise";
  transport: string;
  departureCity: string;
  destination: string;
  duration: string;
  departureDate: string;
  returnDate?: string;
  departureOptions: "go_only" | "go_and_back";
  includedServices: string[];
  excludedServices: string[];
  images: string[];
  price: { basePrice: number; discounts: number }[];
  tax: number;
  maxParticipants: number;
  travelerType: "adult" | "child" | "senior" | "any";
  itinerary: TripItinerary[];
  status: "active" | "sold_out" | "upcoming" | "archived" | "canceled";
  bookingConstraints?: {
    minBookingDays?: number;
    cancellationPolicy?: string;
  };
  createdBy?: string;
  handledBy?: string;
  createdAt: string;
  updatedAt: string;
}

export default function TripDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/tours/private/${params.id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch trip details");
        }

        const data = await response.json();
        setTrip(data.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching trip details:", err);
        setError("Failed to load trip details. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load trip details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchTripDetails();
    }
  }, [params.id, toast]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format date and time for display
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (value: any) => {
    const num = Number(value);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  // Get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800";
      case "upcoming":
        return "bg-lta-purple/10 text-lta-purple hover:bg-lta-purple/20";
      case "sold_out":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100 hover:text-amber-800";
      case "archived":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800";
      case "canceled":
        return "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800";
    }
  };

  // Get trip type icon
  const getTripTypeIcon = (type: string) => {
    switch (type) {
      case "cultural":
        return <Building className="h-5 w-5" />;
      case "adventure":
        return <Mountain className="h-5 w-5" />;
      case "beach":
        return <Palmtree className="h-5 w-5" />;
      default:
        return null;
    }
  };

  // Get transport type icon
  const getTransportTypeIcon = (type: string) => {
    switch (type) {
      case "flight":
        return <Plane className="h-5 w-5" />;
      case "bus":
        return <Bus className="h-5 w-5" />;
      case "train":
        return <Train className="h-5 w-5" />;
      case "cruise":
        return <Ship className="h-5 w-5" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-lg">Loading trip details...</span>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">

        </div>
        <div className="bg-red-50 text-red-800 p-4 rounded-md">
          <p>{error || "Trip not found"}</p>
          <Button
            variant="outline"
            className="mt-2"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">

          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              {getTripTypeIcon(trip.tripType)}
              {trip.title}
            </h1>
            <p className="text-muted-foreground">{trip.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/trips/edit/${trip._id}`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Trip
            </Link>
          </Button>
        </div>
      </div>

      {/* Trip Images */}
      {trip.images && trip.images.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <Carousel className="w-full">
              <CarouselContent>
                {trip.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
                      <Image
                        src={image || "/placeholder.svg?height=400&width=800"}
                        alt={`${trip.title} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trip Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Trip Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Route</p>
                    <p className="text-sm text-muted-foreground">
                      {trip.departureCity} → {trip.destination}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getTransportTypeIcon(trip.transportType)}
                  <div>
                    <p className="font-medium">Transport</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {trip.transportType} - {trip.transport}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Departure Date</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(trip.departureDate)}
                    </p>
                  </div>
                </div>
                {trip.returnDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Return Date</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(trip.returnDate)}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-sm text-muted-foreground">
                      {trip.duration}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Max Participants</p>
                    <p className="text-sm text-muted-foreground">
                      {trip.maxParticipants} people
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Itinerary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Itinerary
              </CardTitle>
            </CardHeader>
            <CardContent>
              {trip.itinerary && trip.itinerary.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {trip.itinerary.map((day, index) => (
                    <AccordionItem key={index} value={`day-${index}`}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center justify-between w-full pr-4">
                          <span className="font-medium">{day.day}</span>
                          <span className="text-sm text-muted-foreground">
                            {day.activities.length} activities
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          {day.activities.map((activity, actIndex) => (
                            <div
                              key={actIndex}
                              className="border-l-2 border-lta-purple/30 pl-4"
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-medium">
                                    {activity.activityName}
                                  </h4>
                                  {activity.activityTime && (
                                    <p className="text-sm text-muted-foreground">
                                      Time: {activity.activityTime}
                                    </p>
                                  )}
                                  {activity.description && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {activity.description}
                                    </p>
                                  )}
                                </div>
                                {activity.cost && (
                                  <div className="text-sm font-medium">
                                    {formatCurrency(activity.cost)} TND
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                          {day.meals && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm">
                                <strong>Meals:</strong> {day.meals}
                              </p>
                            </div>
                          )}
                          {day.accommodation && (
                            <div className="mt-2 p-3 bg-lta-purple/5 rounded-lg">
                              <p className="text-sm">
                                <strong>Accommodation:</strong>{" "}
                                {day.accommodation}
                              </p>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <p className="text-muted-foreground">
                  No itinerary available for this trip.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <Check className="h-5 w-5" />
                  Included Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                {trip.includedServices && trip.includedServices.length > 0 ? (
                  <div className="space-y-2">
                    {trip.includedServices.map((service, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{service}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No included services specified.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <X className="h-5 w-5" />
                  Excluded Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                {trip.excludedServices && trip.excludedServices.length > 0 ? (
                  <div className="space-y-2">
                    {trip.excludedServices.map((service, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <X className="h-4 w-4 text-red-500" />
                        <span className="text-sm">{service}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No excluded services specified.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Constraints */}
          {trip.bookingConstraints && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Booking Policies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {trip.bookingConstraints.minBookingDays && (
                  <div>
                    <p className="font-medium">Minimum Booking Notice</p>
                    <p className="text-sm text-muted-foreground">
                      {trip.bookingConstraints.minBookingDays} days in advance
                    </p>
                  </div>
                )}
                {trip.bookingConstraints.cancellationPolicy && (
                  <div>
                    <p className="font-medium">Cancellation Policy</p>
                    <p className="text-sm text-muted-foreground">
                      {trip.bookingConstraints.cancellationPolicy}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Base Price</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(trip.price?.[0]?.basePrice)} TND
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Tax</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(trip.tax)} TND
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium">Total Price</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(
                    Number(trip.price?.[0]?.basePrice || 0) + Number(trip.tax || 0)
                  )}{" "}
                  TND
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Traveler Type</p>
                <Badge variant="outline" className="capitalize">
                  {trip.travelerType}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Trip Status */}
          <Card>
            <CardHeader>
              <CardTitle>Trip Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Current Status</p>
                <Badge className={getStatusBadgeClass(trip.status)}>
                  {trip.status.charAt(0).toUpperCase() +
                    trip.status.slice(1).replace("_", " ")}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium">Trip Type</p>
                <div className="flex items-center gap-2">
                  {getTripTypeIcon(trip.tripType)}
                  <span className="capitalize">{trip.tripType}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Departure Options</p>
                <Badge variant="outline" className="capitalize">
                  {trip.departureOptions.replace("_", " ")}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Management Information */}
          <Card>
            <CardHeader>
              <CardTitle>Management Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm text-muted-foreground">
                  {formatDateTime(trip.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-sm text-muted-foreground">
                  {formatDateTime(trip.updatedAt)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
