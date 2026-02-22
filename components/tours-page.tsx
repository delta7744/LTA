"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Calendar,
  MapPin,
  Search,
  Clock,
  ArrowRight,
  Filter,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import type { Trip } from "@/lib/types";
import { tunisiaRegions } from "@/lib/constant";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { FALLBACK_TOURS } from "@/lib/fallback-data";

interface ToursPageProps {
  apiEndpoint: string;
  tourType: "adventure" | "cultural" | "beach";
}

export default function ToursPage({ apiEndpoint, tourType }: ToursPageProps) {
  const { t } = useLanguage();

  const [tourPackages, setTourPackages] = useState<Trip[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [departureDate, setDepartureDate] = useState<string>("");
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 0,
  });
  const [priceBounds, setPriceBounds] = useState<{ min: number; max: number }>({
    min: 0,
    max: 0,
  });
  const [selectedDurations, setSelectedDurations] = useState<
    Record<string, boolean>
  >({});
  const [selectedCities, setSelectedCities] = useState<Record<string, boolean>>(
    {}
  );
  const [selectedCategories, setSelectedCategories] = useState<
    Record<string, boolean>
  >({});
  const [sortOption, setSortOption] = useState<string>("recommended");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const searchParams = useSearchParams();

  // Initial sync from URL params
  useEffect(() => {
    const queryParam = searchParams.get("query");
    const dateParam = searchParams.get("date");

    if (queryParam) setSearchQuery(queryParam);
    if (dateParam) setDepartureDate(dateParam);
  }, [searchParams]);

  const getEffectivePrice = (pkg: Trip) => {
    if (pkg.price && Array.isArray(pkg.price) && pkg.price.length > 0) {
      return (pkg.price[0].basePrice || 0) - (pkg.price[0].discounts || 0);
    }
    // Fallback for objects that might still have a flat price if any exist
    if (typeof pkg.price === "number") return pkg.price;
    return 0;
  };

  // Custom slider refs and state
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<"min" | "max" | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);

        let packages: Trip[] = [];

        try {
          const response = await fetch(apiEndpoint);
          if (response.ok) {
            const data = await response.json();
            packages = data.data || [];
          } else {
            console.warn(`API returned ${response.status} for ${apiEndpoint}, using fallbacks`);
          }
        } catch (networkError) {
          console.warn("Backend unavailable, using fallback tours:", networkError);
        }

        if (packages.length === 0) {
          console.warn(`No ${tourType} tours found in API, using fallbacks`);
          packages = FALLBACK_TOURS.filter(t => t.tripType === tourType);
        }

        setTourPackages(packages);
        setFilteredPackages(packages);

        if (packages.length > 0) {
          const prices = packages.map((pkg: Trip) => getEffectivePrice(pkg));
          const minPrice = Math.floor(Math.min(...prices) / 100) * 100;
          const maxPrice = Math.ceil(Math.max(...prices) / 100) * 100;
          setPriceBounds({ min: minPrice, max: maxPrice });
          setPriceRange({ min: minPrice, max: maxPrice });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, [apiEndpoint]);

  // Apply filters automatically when tourPackages are loaded or search params change
  useEffect(() => {
    if (tourPackages.length > 0) {
      applyFilters();
    }
  }, [tourPackages, searchQuery, departureDate]);

  // Handle mouse/touch drag for custom slider
  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !trackRef.current) return;

      e.preventDefault(); // Prevent scrolling on touch devices
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const { left, width } = trackRef.current.getBoundingClientRect();
      const position = Math.max(0, Math.min(1, (clientX - left) / width));
      const newValue =
        priceBounds.min + position * (priceBounds.max - priceBounds.min);

      if (isDragging === "min") {
        setPriceRange((prev) => ({
          min: Math.min(Math.round(newValue / 100) * 100, prev.max - 100),
          max: prev.max,
        }));
      } else if (isDragging === "max") {
        setPriceRange((prev) => ({
          min: prev.min,
          max: Math.max(Math.round(newValue / 100) * 100, prev.min + 100),
        }));
      }
    };

    const handleUp = () => setIsDragging(null);

    if (isDragging) {
      window.addEventListener("mousemove", handleMove, { passive: false });
      window.addEventListener("touchmove", handleMove, { passive: false });
      window.addEventListener("mouseup", handleUp);
      window.addEventListener("touchend", handleUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchend", handleUp);
    };
  }, [isDragging, priceBounds]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDepartureDate(e.target.value);
  };

  const handlePriceInputChange = (type: "min" | "max", value: string) => {
    const numValue = Number(value);
    if (isNaN(numValue)) return;

    if (type === "min") {
      setPriceRange((prev) => ({
        min: Math.max(priceBounds.min, Math.min(numValue, prev.max - 100)),
        max: prev.max,
      }));
    } else {
      setPriceRange((prev) => ({
        min: prev.min,
        max: Math.min(priceBounds.max, Math.max(numValue, prev.min + 100)),
      }));
    }
  };

  const handleDurationChange = (duration: string, checked: boolean) => {
    setSelectedDurations((prev) => ({ ...prev, [duration]: checked }));
  };

  const handleCityChange = (city: string, checked: boolean) => {
    setSelectedCities((prev) => ({ ...prev, [city]: checked }));
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    setSelectedCategories((prev) => ({ ...prev, [category]: checked }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  const applyFilters = () => {
    let result = [...tourPackages];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (pkg) =>
          pkg.title.toLowerCase().includes(query) ||
          pkg.description.toLowerCase().includes(query) ||
          pkg.destination.toLowerCase().includes(query)
      );
    }

    if (departureDate) {
      const selectedDate = new Date(departureDate);
      result = result.filter((pkg) => {
        const packageDate = new Date(pkg.departureDate);
        return packageDate >= selectedDate;
      });
    }

    result = result.filter((pkg) => {
      const price = getEffectivePrice(pkg);
      return price >= priceRange.min && price <= priceRange.max;
    });

    const activeDurations = Object.entries(selectedDurations)
      .filter(([_, isSelected]) => isSelected)
      .map(([duration]) => duration);

    if (activeDurations.length > 0) {
      result = result.filter((pkg) => {
        return activeDurations.some((durationRange) => {
          if (durationRange === "1-3 days")
            return pkg.duration >= 1 && pkg.duration <= 3;
          if (durationRange === "4-7 days")
            return pkg.duration >= 4 && pkg.duration <= 7;
          if (durationRange === "8-14 days")
            return pkg.duration >= 8 && pkg.duration <= 14;
          if (durationRange === "15+ days") return pkg.duration >= 15;
          return false;
        });
      });
    }

    const activeCities = Object.entries(selectedCities)
      .filter(([_, isSelected]) => isSelected)
      .map(([city]) => city);

    if (activeCities.length > 0) {
      result = result.filter((pkg) =>
        activeCities.some(
          (city) => city.toLowerCase().trim() === pkg.departureCity?.toLowerCase().trim()
        )
      );
    }

    const activeCategories = Object.entries(selectedCategories)
      .filter(([_, isSelected]) => isSelected)
      .map(([category]) => category);

    if (activeCategories.length > 0) {
      result = result.filter((pkg) => activeCategories.includes(pkg.travelerType));
    }

    if (sortOption === "price-low-high") {
      result.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
    } else if (sortOption === "price-high-low") {
      result.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
    } else if (sortOption === "duration") {
      result.sort((a, b) => a.duration - b.duration);
    }

    setFilteredPackages(result);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      applyFilters();
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setDepartureDate("");
    setPriceRange({ min: priceBounds.min, max: priceBounds.max });
    setSelectedDurations({});
    setSelectedCities({});
    setSelectedCategories({});
    setSortOption("recommended");
    setFilteredPackages(tourPackages);
    setCurrentPage(1);
  };

  const getPageTitle = () => {
    switch (tourType) {
      case "adventure":
        return t.toursPage.adventureTours || "Adventure Tours & Experiences";
      case "cultural":
        return t.toursPage.culturalTours || "Cultural Tours & Experiences";
      case "beach":
        return t.toursPage.beachTours || "Beach Tours & Experiences";
      default:
        return t.navbar.tours || "Tours & Experiences";
    }
  };

  // Calculate slider positions
  const minPosition =
    priceBounds.max > priceBounds.min
      ? ((priceRange.min - priceBounds.min) /
        (priceBounds.max - priceBounds.min)) *
      100
      : 0;
  const maxPosition =
    priceBounds.max > priceBounds.min
      ? ((priceRange.max - priceBounds.min) /
        (priceBounds.max - priceBounds.min)) *
      100
      : 100;

  // Pagination
  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);
  const paginatedPackages = filteredPackages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPaginationRange = () => {
    const delta = 1;
    const range = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift("...");
    }
    if (currentPage + delta < totalPages - 1) {
      range.push("...");
    }

    if (totalPages > 1) {
      range.unshift(1);
      if (totalPages > 1) {
        range.push(totalPages);
      }
    }

    return range;
  };

  const FilterComponent = () => (
    <div className="space-y-6">
      {/* Price Filter */}
      <div>
        <h4 className="text-sm font-medium mb-3">
          {t.general.search || "Price Range"}
        </h4>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={priceRange.min}
              onChange={(e) => handlePriceInputChange("min", e.target.value)}
              min={priceBounds.min}
              max={priceRange.max - 100}
              step={100}
              className="w-28 bg-white border-gray-300 focus:border-lta-purple text-sm"
              placeholder="Min"
              disabled={priceBounds.min === 0 && priceBounds.max === 0}
            />
            <span className="text-sm text-muted-foreground">-</span>
            <Input
              type="number"
              value={priceRange.max}
              onChange={(e) => handlePriceInputChange("max", e.target.value)}
              min={priceRange.min + 100}
              max={priceBounds.max}
              step={100}
              className="w-28 bg-white border-gray-300 focus:border-lta-purple text-sm"
              placeholder="Max"
              disabled={priceBounds.min === 0 && priceBounds.max === 0}
            />
            <span className="text-sm text-muted-foreground">TND</span>
          </div>
          <div
            className={cn(
              "relative h-2 bg-gray-200 rounded-full mt-4 touch-none select-none",
              priceBounds.min === 0 &&
              priceBounds.max === 0 &&
              "opacity-50 cursor-not-allowed"
            )}
            ref={trackRef}
          >
            <div
              className="absolute h-2 bg-lta-purple rounded-full"
              style={{
                left: `${minPosition}%`,
                right: `${100 - maxPosition}%`,
              }}
            />
            <div
              className={cn(
                "absolute w-4 h-4 bg-lta-purple rounded-full -translate-x-1/2 -translate-y-[2px] cursor-pointer transition-transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-lta-purple",
                isDragging === "min" && "scale-125",
                priceBounds.min === 0 &&
                priceBounds.max === 0 &&
                " cursor-not-allowed"
              )}
              style={{ left: `${minPosition}%` }}
              onMouseDown={() => priceBounds.min !== 0 && setIsDragging("min")}
              onTouchStart={() => priceBounds.min !== 0 && setIsDragging("min")}
              role="slider"
              tabIndex={0}
              aria-label="Minimum price"
              aria-valuemin={priceBounds.min}
              aria-valuemax={priceRange.max - 100}
              aria-valuenow={priceRange.min}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") {
                  setPriceRange((prev) => ({
                    min: Math.max(priceBounds.min, prev.min - 100),
                    max: prev.max,
                  }));
                } else if (e.key === "ArrowRight") {
                  setPriceRange((prev) => ({
                    min: Math.min(prev.max - 100, prev.min + 100),
                    max: prev.max,
                  }));
                }
              }}
            />
            <div
              className={cn(
                "absolute w-4 h-4 bg-lta-purple rounded-full -translate-x-1/2 -translate-y-[2px] cursor-pointer transition-transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-lta-purple",
                isDragging === "max" && "scale-125",
                priceBounds.min === 0 &&
                priceBounds.max === 0 &&
                "cursor-not-allowed"
              )}
              style={{ left: `${maxPosition}%` }}
              onMouseDown={() => priceBounds.min !== 0 && setIsDragging("max")}
              onTouchStart={() => priceBounds.min !== 0 && setIsDragging("max")}
              role="slider"
              tabIndex={0}
              aria-label="Maximum price"
              aria-valuemin={priceRange.min + 100}
              aria-valuemax={priceBounds.max}
              aria-valuenow={priceRange.max}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") {
                  setPriceRange((prev) => ({
                    min: prev.min,
                    max: Math.max(prev.min + 100, prev.max - 100),
                  }));
                } else if (e.key === "ArrowRight") {
                  setPriceRange((prev) => ({
                    min: prev.min,
                    max: Math.min(priceBounds.max, prev.max + 100),
                  }));
                }
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>{priceBounds.min} TND</span>
            <span>{priceBounds.max} TND</span>
          </div>
        </div>
      </div>

      {/* Duration Filter */}
      <div>
        <h4 className="text-sm font-medium mb-3">{t.duration || "Duration"}</h4>
        <div className="space-y-2">
          {["1-3 days", "4-7 days", "8-14 days", "15+ days"].map((duration) => (
            <div key={duration} className="flex items-center">
              <Checkbox
                id={`duration-${duration}`}
                checked={selectedDurations[duration] || false}
                onCheckedChange={(checked) =>
                  handleDurationChange(duration, checked as boolean)
                }
                className="h-5 w-5"
              />
              <label htmlFor={`duration-${duration}`} className="ml-2 text-sm">
                {duration}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Traveler Type */}
      <div>
        <h4 className="text-sm font-medium mb-3">
          {t.toursPage.travelerType || "Traveler Type"}
        </h4>
        <div className="space-y-2">
          {["Solo", "Couple", "Family", "Group"].map((category) => (
            <div key={category} className="flex items-center">
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategories[category] || false}
                onCheckedChange={(checked) =>
                  handleCategoryChange(category, checked as boolean)
                }
                className="h-5 w-5"
              />
              <label htmlFor={`category-${category}`} className="ml-2 text-sm">
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Departure City */}
      <div>
        <h4 className="text-sm font-medium mb-3">
          {t.form.address.label || "Departure City"}
        </h4>
        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
          {tunisiaRegions.map((city) => (
            <div key={city} className="flex items-center">
              <Checkbox
                id={`city-${city}`}
                checked={selectedCities[city] || false}
                onCheckedChange={(checked) =>
                  handleCityChange(city, checked as boolean)
                }
                className="h-5 w-5"
              />
              <label htmlFor={`city-${city}`} className="ml-2 text-sm">
                {city}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 pt-4">
        <Button
          className="flex-1 bg-lta-purple hover:bg-lta-purple/90 h-12 text-sm"
          onClick={applyFilters}
        >
          <Search className="h-4 w-4 mr-2" />
          {t.buttons.applyFilters || "Apply Filters"}
        </Button>
        <Button
          variant="outline"
          className="flex-1 h-12 text-sm"
          onClick={resetFilters}
        >
          <X className="h-4 w-4 mr-2" />
          {t.buttons.reset || "Reset"}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="bg-lta-purple py-8 sm:py-12">
          <div className="container space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {getPageTitle()}
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder={
                    t.toursPage.searchPlaceholder ||
                    "Search destinations, tours, etc."
                  }
                  className="pl-10 bg-white w-full h-12 text-sm"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyDown}
                />
              </div>
              <div className="w-full">
                <Input
                  type="date"
                  className="bg-white w-full h-12 text-sm"
                  value={departureDate}
                  onChange={handleDateChange}
                />
              </div>
              <div className="w-full lg:col-span-2">
                <Button
                  className="w-full bg-white text-lta-purple hover:bg-gray-100 h-12 text-sm"
                  onClick={applyFilters}
                >
                  {t.general.search || "Search"}
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="container py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:hidden flex justify-between items-center mb-4">
              <h2 className="text-base sm:text-lg font-semibold">
                {filteredPackages.length}{" "}
                {t.toursPage.toursFound || "tours found"}
              </h2>
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetHeader>
                  <SheetTitle></SheetTitle>
                </SheetHeader>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 h-10 text-sm"
                  >
                    <Filter className="h-4 w-4" />
                    {t.buttons.applyFilters || "Filters"}
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-full sm:w-[400px] max-w-[90vw] overflow-y-auto p-4"
                >
                  <h2>{t.buttons.applyFilters || "Filter By"}</h2>
                  <FilterComponent />
                </SheetContent>
              </Sheet>
            </div>
            <div className="hidden lg:block w-full lg:w-1/4 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 text-lg">
                    {t.buttons.applyFilters || "Filter By"}
                  </h3>
                  <FilterComponent />
                </CardContent>
              </Card>
            </div>
            <div className="w-full lg:w-3/4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4">
                <h2 className="hidden lg:block text-lg font-semibold">
                  {filteredPackages.length}{" "}
                  {t.toursPage.toursFound || "tours found"}
                </h2>
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-sm">
                    {t.general.languageSwitch || "Sort by"}:
                  </span>
                  <select
                    className="border rounded p-2 text-sm h-10"
                    value={sortOption}
                    onChange={handleSortChange}
                  >
                    <option value="recommended">
                      {"Recommended"}
                    </option>
                    <option value="price-low-high">
                      {"Price: Low to High"}
                    </option>
                    <option value="price-high-low">
                      {"Price: High to Low"}
                    </option>
                    <option value="duration">
                      {t.serviceDetails.days || "Duration"}
                    </option>
                  </select>
                </div>
              </div>
              {loading ? (
                <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-2 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-white rounded-lg shadow-md p-4 animate-pulse"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="w-full h-40 bg-gray-200 rounded-md"></div>
                        <div className="space-y-3">
                          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                          <div className="h-10 bg-gray-200 rounded w-1/4 mt-4"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredPackages.length === 0 ? (
                <Card className="p-6 text-center">
                  <h3 className="text-lg font-medium mb-2">
                    {t.toursPage.noToursFound || "No tours found"}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {"Try adjusting your filters or search criteria"}
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-2 gap-4">
                  {paginatedPackages.map((item) => (
                    <Card key={item._id} className="overflow-hidden">
                      <div className="flex flex-col">
                        <div className="relative h-40 sm:h-48">
                          <Image
                            src={item.images?.[0] || "/placeholder.svg"}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            priority={false}
                            loading="lazy"
                          />
                          <div className="absolute top-2 left-2 bg-lta-purple text-white px-2 py-1 rounded text-xs sm:text-sm">
                            {item.tripType}
                          </div>
                        </div>
                        <div className="p-4 sm:p-6">
                          <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-1">
                            {item.title}
                          </h3>
                          <div className="flex items-center text-muted-foreground mb-2">
                            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span className="text-sm line-clamp-1">
                              {item.departureCity} {t.general.to || "to"}{" "}
                              {item.destination}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-3 sm:gap-4 mb-3 sm:mb-4">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-lta-purple mr-1 flex-shrink-0" />
                              <span className="text-sm">
                                {item.duration} {t.general.days || "days"}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-lta-purple mr-1 flex-shrink-0" />
                              <span className="text-sm">
                                {t.serviceDetails.departure || "Departure"}:{" "}
                                {new Date(
                                  item.departureDate
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {item.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {item.tripHighlights
                              ?.slice(0, 3)
                              .map((tag, index) => (
                                <span
                                  key={index}
                                  className="bg-gray-100 px-2 py-1 rounded text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                            {item.tripHighlights?.length > 3 && (
                              <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                                +{item.tripHighlights.length - 3}{" "}
                                {t.toursPage.more || "more"}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                            <div className="font-bold text-lta-purple text-lg sm:text-xl">
                              {getEffectivePrice(item)} TND
                              <span className="block text-sm text-muted-foreground">
                                {t.serviceDetails.perPerson || "per person"}
                              </span>
                            </div>
                            <Button
                              asChild
                              className="bg-lta-purple hover:bg-lta-purple/90 text-white w-full sm:w-auto h-10 text-sm"
                            >
                              <Link href={`/tours/${item._id}`} passHref>
                                {t.buttons.viewDetails || "View Details"}{" "}
                                <ArrowRight className="h-4 w-4 ml-1" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
              {filteredPackages.length > 0 && totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-10 h-10"
                      onClick={() =>
                        currentPage > 1 && handlePageChange(currentPage - 1)
                      }
                      disabled={currentPage === 1}
                    >
                      <span className="sr-only">
                        {t.toursPage.previous || "Previous"}
                      </span>
                      <ArrowRight className="h-4 w-4 rotate-180" />
                    </Button>
                    {getPaginationRange().map((page, i) =>
                      page === "..." ? (
                        <span key={`ellipsis-${i}`} className="px-2">
                          ...
                        </span>
                      ) : (
                        <Button
                          key={`page-${page}`}
                          variant={currentPage === page ? "default" : "outline"}
                          size="icon"
                          className="w-10 h-10"
                          onClick={() =>
                            typeof page === "number" && handlePageChange(page)
                          }
                        >
                          <span>{page}</span>
                        </Button>
                      )
                    )}
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-10 h-10"
                      onClick={() =>
                        currentPage < totalPages &&
                        handlePageChange(currentPage + 1)
                      }
                      disabled={currentPage === totalPages}
                    >
                      <span className="sr-only">{t.next || "Next"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
