"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/components/language-provider";

interface TransformedHotel {
  id: number;
  name: string;
  city: string;
  country: string;
  address: string;
  image: string;
  rating: number;
  category: string;
  themes: string[];
  price?: string;
  currency?: string;
}

export default function HotelSection() {
  const { t } = useLanguage();

  const [hotelData, setHotelData] = useState<Record<string, TransformedHotel[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Record<string, string | null>>({});
  const [selectedCity, setSelectedCity] = useState("hammamet");

  // Define cities with their correct MyGo IDs
  const cities = useMemo(
    () => [
      { id: 10, name: "Hammamet", key: "hammamet" },
      { id: 34, name: "Sousse", key: "sousse" },
      { id: 18, name: "Djerba", key: "djerba" },
    ],
    []
  );

  // Transform API data to component format and slice to 12 items
  const transformHotelData = useCallback((apiHotels: any[]): TransformedHotel[] => {
    return (apiHotels || []).slice(0, 12).map((item) => {
      const hotel = item.Hotel || item;
      return {
        id: hotel.Id,
        name: hotel.Name,
        city: hotel.City?.Name || "Unknown",
        country: hotel.City?.Country?.Name || "Tunisie",
        address: hotel.Adress || hotel.Address || "",
        image: hotel.Image || hotel.Photo || (hotel.Album?.[0]?.Url) || "/placeholder.svg",
        rating: hotel.Category?.Star || 0,
        category: hotel.Category?.Title || "",
        themes: hotel.Theme || hotel.Themes || [],
        price: item.Price?.BasePrice || hotel.Price?.BasePrice || item.Price || hotel.Price || "0.000",
        currency: item.Currency || hotel.Currency || "TND",
      };
    });
  }, []);

  const fetchHotels = useCallback(
    async (cityId: number, cityKey: string) => {
      setLoading((prev) => ({ ...prev, [cityKey]: true }));
      setError((prev) => ({ ...prev, [cityKey]: null }));

      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
        const response = await fetch(`${baseUrl}/hotel/list`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: { City: cityId },
          }),
        });

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const result = await response.json();
        const transformedHotels = transformHotelData(result.ListHotel || []);

        setHotelData((prev) => ({
          ...prev,
          [cityKey]: transformedHotels,
        }));
      } catch (err: any) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error(`Error fetching hotels for ${cityKey}:`, err);
        setError((prev) => ({
          ...prev,
          [cityKey]: errorMessage,
        }));
      } finally {
        setLoading((prev) => ({ ...prev, [cityKey]: false }));
      }
    },
    [transformHotelData]
  );

  // Load initial city data
  useEffect(() => {
    const defaultCity = cities[0];
    fetchHotels(defaultCity.id, defaultCity.key);
  }, [cities, fetchHotels]);

  // Handle city change - force fetch to ensure data is updated
  const handleCityChange = useCallback(
    (cityKey: string) => {
      setSelectedCity(cityKey);
      const city = cities.find((c) => c.key === cityKey);
      if (city) {
        fetchHotels(city.id, city.key);
      }
    },
    [cities, fetchHotels]
  );

  // Get current city data
  const currentCityData = hotelData[selectedCity] || [];
  const isCurrentCityLoading = loading[selectedCity] || false;
  const currentCityError = error[selectedCity];

  // Truncate text utility
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <section className="py-16 container">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 text-lta-purple">
          {t?.landingPage?.hotelSectionTitle || "Best Hotels"}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t?.landingPage?.hotelSectionSubtitle ||
            "Discover amazing hotels for your perfect stay"}
        </p>
      </div>

      <Tabs
        value={selectedCity}
        onValueChange={handleCityChange}
        className="w-full"
      >
        <div className="flex justify-center mb-8">
          <TabsList className="bg-gray-100">
            {cities.map((city) => (
              <TabsTrigger
                key={city.id}
                value={city.key}
                className="capitalize data-[state=active]:bg-lta-purple data-[state=active]:text-white transition-all duration-300"
              >
                {city.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {cities.map((city) => (
          <TabsContent key={city.id} value={city.key} className="mt-0">
            {/* Loading state for current city */}
            {isCurrentCityLoading && (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-4 text-muted-foreground">Loading hotels...</p>
              </div>
            )}

            {/* Error state for current city */}
            {currentCityError && !isCurrentCityLoading && (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">
                  Error loading hotels: {currentCityError}
                </p>
                <Button
                  onClick={() => fetchHotels(city.id, city.key)}
                  variant="outline"
                >
                  Try Again
                </Button>
              </div>
            )}

            {/* Hotels grid */}
            {!isCurrentCityLoading &&
              !currentCityError && (
                <>
                  {currentCityData.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        No hotels found in {city.name}.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {currentCityData.map((hotel) => (
                        <Card
                          key={hotel.id}
                          className="overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col h-full group"
                        >
                          {/* Clickable Image container */}
                          <Link href={`/hotels/${hotel.id}`} className="block relative h-48 flex-shrink-0 overflow-hidden">
                            <Image
                              src={hotel.image}
                              alt={hotel.name || "Hotel"}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder.svg";
                              }}
                            />
                          </Link>

                          {/* Flexible content area */}
                          <CardContent className="p-4 flex-grow flex flex-col">
                            {/* Hotel name - Clickable Header */}
                            <Link href={`/hotels/${hotel.id}`}>
                              <h3 className="font-semibold text-lg mb-1 line-clamp-2 h-14 leading-7 hover:text-lta-purple transition-colors cursor-pointer">
                                {hotel.name}
                              </h3>
                            </Link>

                            {/* Category Title Badge */}
                            <div className="mb-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-lta-purple bg-lta-purple/10 px-2 py-0.5 rounded-full border border-lta-purple/20">
                                {hotel.category}
                              </span>
                            </div>

                            {/* Location - 1 line */}
                            <p className="text-muted-foreground text-sm capitalize mb-2 truncate">
                              {truncateText(
                                `${hotel.city}, ${hotel.country}`,
                                30
                              )}
                            </p>

                            {/* Rating */}
                            <div className="flex items-center mb-2">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < hotel.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                    }`}
                                />
                              ))}
                              <span className="ml-2 text-sm text-muted-foreground">
                                ({hotel.rating}/5)
                              </span>
                            </div>

                            {/* Themes - consistent height */}
                            <div className="mt-auto">
                              {hotel.themes.length > 0 && (
                                <div className="h-12 flex items-start">
                                  <div className="flex flex-wrap gap-1">
                                    {hotel.themes
                                      .slice(0, 2)
                                      .map((theme, index) => (
                                        <span
                                          key={index}
                                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                                        >
                                          {truncateText(theme, 15)}
                                        </span>
                                      ))}
                                    {hotel.themes.length > 2 && (
                                      <span className="text-xs text-muted-foreground self-center">
                                        +{hotel.themes.length - 2}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardContent>

                          {/* Fixed footer with Price and Button */}
                          <CardFooter className="p-4 pt-0 mt-auto flex flex-col gap-4">
                            <div className="flex justify-between items-center w-full">
                              <div className="text-sm text-muted-foreground">
                                {t?.common?.from || "de"}
                              </div>
                              <div className="text-xl font-bold text-lta-purple">
                                {hotel.price && hotel.price !== "0.000" ? hotel.price : "..."}
                                <span className="ml-1 text-xs font-normal text-muted-foreground">
                                  {hotel.currency || "TND"}
                                </span>
                              </div>
                            </div>
                            <Button
                              asChild
                              className="w-full bg-lta-purple hover:bg-lta-purple/90 text-white"
                            >
                              <Link href={`/hotels/${hotel.id}`}>
                                {t?.buttons?.bookNow || "Book Now"}
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
