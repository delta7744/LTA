"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Check,
  X,
  ChevronRight,
  Hotel,
  Utensils,
  Bus,
  Download,
  Share2,
  Heart,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Trip } from "@/lib/types";
import { useParams } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useLanguage } from "@/components/language-provider";
import { FALLBACK_TOURS } from "@/lib/fallback-data";

export default function TourDetails() {
  const params = useParams();
  const { t } = useLanguage();
  const { id } = params;
  const [tripPackage, setTripPackage] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchTrip = async () => {
      // First check if it's a fallback ID
      if (typeof id === 'string' && id.startsWith('fb-')) {
        const fallback = FALLBACK_TOURS.find(t => t._id === id);
        if (fallback) {
          setTripPackage(fallback);
          setLoading(false);
          return;
        }
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/tours/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch trip package");
        }
        const data = await response.json();
        setTripPackage(data.data || null);
      } catch (error) {
        console.error("Error fetching trip package, checking fallbacks:", error);
        // Last resort: check if this ID is in fallbacks even if it didn't start with fb-
        const lastResort = FALLBACK_TOURS.find(t => t._id === id);
        setTripPackage(lastResort || null);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  const calculateTotalPrice = () => {
    if (!tripPackage) return 0;
    const basePrice = tripPackage.price || 0;
    const tax = tripPackage.tax || 0;
    return (basePrice + tax);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lta-purple"></div>
        </main>
      </div>
    );
  }

  if (!tripPackage) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">
              {t.serviceDetails.tripPackageNotFound}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t.serviceDetails.packageNotFoundMessage}
            </p>
            <Button asChild>
              <Link href="/">{t.serviceDetails.backToHome}</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-lta-purple py-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-lta-orange opacity-10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="container relative z-10">
            <div className="flex flex-col gap-2">
              <div className="flex items-center text-white/80 text-sm">
                <Link href="/" className="hover:text-white">
                  {t.serviceDetails.home}
                </Link>
                <ChevronRight className="w-4 h-4 mx-1" />
                <Link
                  href={`/tours/${tripPackage.tripType}`}
                  className="hover:text-white"
                >
                  {t.serviceDetails.trip}
                </Link>
                <ChevronRight className="w-4 h-4 mx-1" />
                <span className="text-white">{tripPackage.title}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {tripPackage.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>
                    {tripPackage.departureCity} to {tripPackage.destination}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{tripPackage.duration} days</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>
                    {t.serviceDetails.departure}:{" "}
                    {new Date(tripPackage.departureDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
                <Badge className="bg-green-500 text-white border-none">
                  {t.serviceDetails.available}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-12">
          {/* Gallery */}
          <div className="mb-8">
            <Carousel className="w-full">
              <CarouselContent>
                <CarouselItem>
                  <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
                    <Image
                      src={tripPackage.images[0] || "/placeholder.svg"}
                      alt={tripPackage.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CarouselItem>
                {tripPackage.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${tripPackage.title} - Image ${index + 1}`}
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
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Tour Details Tabs */}
              <Tabs defaultValue="overview" className="mb-4">
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="overview">
                    {t.serviceDetails.overview}
                  </TabsTrigger>
                  <TabsTrigger value="itinerary">
                    {t.serviceDetails.itinerary}
                  </TabsTrigger>
                  <TabsTrigger value="accommodation">
                    {t.serviceDetails.accommodation}
                  </TabsTrigger>
                  <TabsTrigger value="inclusions">
                    {t.serviceDetails.inclusionstab}
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      {t.serviceDetails.aboutThisPackage}
                    </h2>
                    <p className="text-muted-foreground text-base">
                      {tripPackage.description}
                    </p>
                    <p className="text-muted-foreground font-light mt-6">
                      {t.serviceDetails.guidanceSupport}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      {t.serviceDetails.packageHighlights}
                    </h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {tripPackage.tripHighlights.map((highlight, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                {/* Itinerary Tab */}
                <TabsContent value="itinerary" className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">
                    {tripPackage.duration} {t.serviceDetails.dayItinerary}
                  </h2>
                  <div className="space-y-6">
                    {tripPackage.itinerary.map((day, index) => (
                      <Card key={day._id || index}>
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold mb-4">
                            {day.day}
                          </h3>
                          <div className="space-y-4">
                            {day.activities.map((activity, actIndex) => (
                              <div
                                key={activity._id || actIndex}
                                className="border-l-2 border-lta-purple pl-4 ml-2"
                              >
                                <div className="flex justify-between">
                                  <h4 className="font-medium">
                                    {activity.activityName}
                                  </h4>
                                  {activity.activityTime && (
                                    <span className="text-sm text-muted-foreground">
                                      {new Date(
                                        activity.activityTime
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  )}
                                </div>
                                {activity.description && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {activity.description}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>

                          {day.meals && (
                            <div className="flex items-center mt-6">
                              <Utensils className="w-4 h-4 text-lta-purple mr-2" />
                              <span className="text-sm">
                                {t.serviceDetails.meals}: {day.meals}
                              </span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Accommodation Tab */}
                <TabsContent value="accommodation" className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">
                    {t.serviceDetails.accommodationDetails}{" "}
                  </h2>
                  <div className="space-y-4">
                    <p>{tripPackage.accommodationDetails}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg mb-1">
                            {tripPackage.transportType}
                          </h3>
                          <p className="text-sm mb-3">
                            {t.serviceDetails.accommodationDetails}
                          </p>
                          <div className="flex items-center mt-2">
                            <Hotel className="h-5 w-5 text-lta-purple mr-2" />
                            <span>{t.serviceDetails.hotel}</span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg mb-1">
                            {t.serviceDetails.transportation}
                          </h3>
                          <p className="text-sm mb-3">
                            {tripPackage.transport}
                          </p>
                          <div className="flex items-center mt-2">
                            <Bus className="h-5 w-5 text-lta-purple mr-2" />
                            <span>{t.serviceDetails.transport}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                {/* Inclusions Tab */}
                <TabsContent value="inclusions" className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">
                    {t.serviceDetails.packageInclusionsExclusions}{" "}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold text-lg mb-4 flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        {t.serviceDetails.inclusions}
                      </h3>
                      <ul className="space-y-3">
                        {tripPackage.includedServices.map((service, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-5 w-5 text-lta-purple mr-3 mt-0.5 flex-shrink-0" />
                            <span>{service}</span>
                          </li>
                        ))}
                        {tripPackage.guideAvailable && (
                          <li className="flex items-start">
                            <Users className="h-5 w-5 text-lta-purple mr-3 mt-0.5 flex-shrink-0" />
                            <span>{t.serviceDetails.experiencedGuides} </span>
                          </li>
                        )}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-4 flex items-center">
                        <X className="h-5 w-5 text-red-500 mr-2" />
                        {t.serviceDetails.exclusions}
                      </h3>
                      <ul className="space-y-3">
                        {tripPackage.excludedServices.map((service, index) => (
                          <li key={index} className="flex items-start">
                            <X className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span>{service}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Booking Card */}
              <Card>
                <CardHeader>
                  <CardTitle>{t.serviceDetails.bookYourPackage}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-2xl font-bold text-lta-purple">
                        {tripPackage.price} TND
                      </span>
                      <br />
                      {tripPackage.tax > 0 && (
                        <span className="text-sm text-muted-foreground ml-2">
                          {t.serviceDetails.tax} :{tripPackage.tax} TND tax
                        </span>
                      )}
                    </div>
                    <Badge variant="outline">
                      {t.serviceDetails.perPerson}
                    </Badge>
                  </div>

                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>{t.serviceDetails.total}</span>
                    <span>{calculateTotalPrice()} TND</span>
                  </div>

                  <Button
                    asChild
                    className="w-full bg-lta-purple hover:bg-lta-purple-light text-white mb-2 shadow-lg shadow-lta-purple/20 transition-all duration-300 rounded-xl py-6 font-bold"
                  >
                    <Link
                      href={`/checkout?serviceId=${tripPackage._id
                        }&serviceType=${"trip"}`}
                    >
                      {t.serviceDetails.bookNow}
                    </Link>
                  </Button>

                  <div className="mt-4 text-left text-sm text-muted-foreground">
                    <p>
                      {t.serviceDetails.departure}:{" "}
                      {new Date(tripPackage.departureDate).toLocaleDateString(
                        "fr-FR",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                    <p className="mt-1">
                      Return:{" "}
                      {tripPackage.returnDate && (
                        <span>
                          {new Date(tripPackage.returnDate).toLocaleDateString(
                            "fr-FR",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </span>
                      )}
                    </p>
                    <p className="mt-1">
                      {tripPackage.departureOptions === "go_and_back"
                        ? t.serviceDetails.roundTrip
                        : t.serviceDetails.oneWayTrip}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
