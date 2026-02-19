"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/components/language-provider";
import { Trip } from "@/lib/types";

interface TransformedTrip {
  id: string;
  name: string;
  location: string;
  image: string;
  price: number;
  totalPrice: number;
  currency: string;
  category: string;
  duration: string;
  description: string;
  highlights: string[];
  status: string;
  maxParticipants: number;
  departureDate: string;
  transportType: string;
  guideAvailable: boolean;
}

export default function DestinationsSection() {
  const { t } = useLanguage();

  const [toursData, setToursData] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Record<string, string | null>>({});
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Define categories
  const categories = useMemo(
    () => [
      { key: "all", name: "All", label: t?.all || "All" },
      { key: "cultural", name: "Cultural", label: t?.cultural || "Cultural" },
      {
        key: "adventure",
        name: "Adventure",
        label: t?.adventure || "Adventure",
      },
      { key: "beach", name: "Beach", label: t?.beach || "Beach" },
    ],
    [t]
  );

  // Transform API data to component format and slice to 12 items
  const transformToursData = useCallback((apiTours) => {
    return (apiTours || [])
      .filter((tour) => tour.status === "active") // Only show active tours
      .slice(0, 12)
      .map((tour) => ({
        id: tour._id,
        name: tour.title,
        location: `${tour.departureCity} → ${tour.destination}`,
        image: tour.images?.[0] || "/placeholder.svg",
        price: tour.price,
        totalPrice: tour.price + (tour.tax || 0),
        currency: "TND", // You can modify this based on your needs
        category: tour.tripType,
        duration:
          tour.duration > 1 ? `${tour.duration} days` : `${tour.duration} day`,
        description: tour.description,
        highlights: tour.tripHighlights || [],
        status: tour.status,
        maxParticipants: tour.maxParticipants,
        departureDate: tour.departureDate,
        transportType: tour.transportType,
        guideAvailable: tour.guideAvailable,
      }));
  }, []);

  // Fetch tours for a specific category
  const fetchTours = useCallback(
    async (category) => {
      // Don't fetch if data already exists
      if (toursData[category]) {
        return;
      }

      setLoading((prev) => ({ ...prev, [category]: true }));
      setError((prev) => ({ ...prev, [category]: null }));

      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
        const response = await fetch(`${baseUrl}/tours/`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch tours: ${response.status}`);
        }

        const result = await response.json();
        const allTours = transformToursData(result.data || []);

        // Filter tours by category and store all data
        const filteredTours =
          category === "all"
            ? allTours
            : allTours.filter((tour) => tour.category === category);

        setToursData((prev) => ({
          ...prev,
          [category]: filteredTours,
          // Also store 'all' data if we're fetching a specific category
          ...(category !== "all" && !prev.all ? { all: allTours } : {}),
        }));
      } catch (error) {
        console.error(`Error fetching tours for ${category}:`, error);
        setError((prev) => ({
          ...prev,
          [category]: error.message,
        }));
      } finally {
        setLoading((prev) => ({ ...prev, [category]: false }));
      }
    },
    [toursData, transformToursData]
  );

  // Load initial data
  useEffect(() => {
    fetchTours("all");
  }, [fetchTours]);

  // Handle category change
  const handleCategoryChange = useCallback(
    (categoryKey) => {
      setSelectedCategory(categoryKey);

      // If we have 'all' data and need a specific category, filter from existing data
      if (categoryKey !== "all" && toursData.all) {
        const filteredTours = toursData.all.filter(
          (tour) => tour.category === categoryKey
        );
        setToursData((prev) => ({
          ...prev,
          [categoryKey]: filteredTours,
        }));
      } else if (!toursData[categoryKey]) {
        // Only fetch if we don't have the data
        fetchTours(categoryKey);
      }
    },
    [toursData, fetchTours]
  );

  // Get current category data
  const currentCategoryData = toursData[selectedCategory] || [];
  const isCurrentCategoryLoading = loading[selectedCategory] || false;
  const currentCategoryError = error[selectedCategory];

  // Truncate text utility
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  // Format date utility
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  return (
    <section className="py-16 container">
      <div className="text-center mb-16 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-lta-purple/5 blur-3xl rounded-full -mt-20"></div>
        <h4 className="text-lta-orange font-bold uppercase tracking-widest text-sm mb-2">Explore Tunisia</h4>
        <h2 className="text-4xl md:text-5xl font-black mb-4 text-lta-purple">
          {t?.landingPage.tripSectionTitle ||
            "Destinations You'll Love to Visit"}
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          {t?.landingPage.tripSectionSubtitle ||
            "Explore our handpicked selection of the most beautiful destinations in Tunisia, curated for leadership and excellence."}
        </p>
      </div>

      <Tabs
        value={selectedCategory}
        onValueChange={(val: any) => handleCategoryChange(val)}
        className="w-full"
      >
        <div className="flex justify-center mb-8">
          <TabsList className="bg-lta-purple/5 p-1 rounded-full h-auto">
            {categories.map((category) => (
              <TabsTrigger
                key={category.key}
                value={category.key}
                className="capitalize rounded-full px-8 py-2.5 data-[state=active]:bg-lta-purple data-[state=active]:text-white transition-all duration-300"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {categories.map((category) => (
          <TabsContent key={category.key} value={category.key} className="mt-0">
            {/* Loading state */}
            {isCurrentCategoryLoading && category.key === selectedCategory && (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-4 text-muted-foreground">
                  {t?.loadingTours || "Loading tours..."}
                </p>
              </div>
            )}

            {/* Error state */}
            {currentCategoryError && category.key === selectedCategory && (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">
                  {t?.errorLoadingTours || "Error loading tours"}:{" "}
                  {currentCategoryError}
                </p>
                <Button
                  onClick={() => {
                    setToursData((prev) => {
                      const newData = { ...prev };
                      delete newData[selectedCategory];
                      return newData;
                    });
                    fetchTours(selectedCategory);
                  }}
                  variant="outline"
                >
                  {t?.tryAgain || "Try Again"}
                </Button>
              </div>
            )}

            {/* Tours grid */}
            {!isCurrentCategoryLoading &&
              !currentCategoryError &&
              category.key === selectedCategory && (
                <>
                  {currentCategoryData.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        {t?.noToursFound ||
                          `No tours found in ${category.name.toLowerCase()} category.`}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {currentCategoryData.map((tour) => (
                        <Card
                          key={tour.id}
                          className="overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow flex flex-col h-full"
                        >
                          {/* Fixed height image container */}
                          <div className="relative h-48 flex-shrink-0">
                            <Image
                              src={tour.image}
                              alt={tour.name}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                e.target.src = "/placeholder.svg";
                              }}
                            />
                            <div className="absolute top-2 right-2 bg-lta-purple text-white px-2 py-1 rounded text-sm">
                              {tour.duration}
                            </div>
                            {tour.status === "sold_out" && (
                              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
                                {t?.soldOut || "Sold Out"}
                              </div>
                            )}
                          </div>

                          {/* Flexible content area */}
                          <CardContent className="p-4 flex-grow flex flex-col">
                            {/* Tour name - exactly 2 lines */}
                            <h3 className="font-semibold text-lg mb-1 line-clamp-2 h-14 leading-7">
                              {tour.name}
                            </h3>

                            {/* Location */}
                            <div className="flex items-center text-muted-foreground mb-2">
                              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                              <span className="text-sm truncate">
                                {truncateText(tour.location, 25)}
                              </span>
                            </div>

                            {/* Additional info */}
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>{formatDate(tour.departureDate)}</span>
                              </div>
                              <div className="flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                <span>{tour.maxParticipants}</span>
                              </div>
                            </div>

                            {/* Description - fixed height */}
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2 h-10 leading-5">
                              {truncateText(tour.description, 80)}
                            </p>

                            {/* Features */}
                            <div className="mt-auto mb-2">
                              <div className="flex flex-wrap gap-1 text-xs">
                                {tour.guideAvailable && (
                                  <span className="bg-green-100 text-green-600 px-2 py-1 rounded">
                                    {t?.guideIncluded || "Guide"}
                                  </span>
                                )}
                                <span className="bg-lta-purple/10 text-lta-purple px-2 py-1 rounded capitalize">
                                  {tour.transportType}
                                </span>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="font-bold text-lta-purple text-2xl flex items-baseline gap-1 mt-2">
                              {tour.price} <span className="text-sm font-medium">{tour.currency}</span>
                              {tour.totalPrice > tour.price && (
                                <span className="text-xs text-gray-400 ml-auto font-normal">
                                  {t?.from || "Incl."} {tour.totalPrice}
                                </span>
                              )}
                            </div>
                          </CardContent>

                          {/* Fixed footer */}
                          <CardFooter className="p-4 pt-0 mt-auto">
                            <Button
                              asChild
                              className={`w-full rounded-xl py-6 ${tour.status === "sold_out"
                                ? "bg-gray-300 hover:bg-gray-300 cursor-not-allowed"
                                : "bg-lta-purple hover:bg-lta-purple-light shadow-lg shadow-lta-purple/20"
                                } text-white transition-all duration-300`}
                              disabled={tour.status === "sold_out"}
                            >
                              <Link
                                href={
                                  tour.status === "sold_out"
                                    ? "#"
                                    : `/tours/${tour.id}`
                                }
                              >
                                {tour.status === "sold_out"
                                  ? t?.soldOut || "Sold Out"
                                  : t?.buttons?.viewDetails || "View Details"}
                              </Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              )}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
