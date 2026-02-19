"use client";
import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  TicketIcon as Tickets,
  Hotel,
  Compass,
  MapPin,
  Phone,
  Truck,
  ChevronDown,
  Globe,
  TreePalm,
  TentTree,
  Tag,
  Search,
  X,
  User,
  Bell,
  ChevronRight,
  Home,
  Plane,
  Ship,
  LogOut,
  Settings,
  Heart,
  BookOpen,
  Loader2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useLanguage } from "@/components/language-provider";
import TopNavbar from "@/components/top-navbar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useCities } from "@/context/CityContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define city interface
interface City {
  Id: string;
  Name?: string;
  Region?: string;
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & {
    title: string;
    icon?: React.ReactNode;
  }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100 focus:outline-none",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none text-primary flex items-center">
            {icon && <span className="mr-2 flex-shrink-0">{icon}</span>}
            <span className="truncate">{title}</span>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-slate-500">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

// Debounce function for search input
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function Navbar() {
  const { t, changeLanguage, currentLanguage } = useLanguage();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { cities = [], loading: citiesLoading = false } = useCities() || {};
  const [currentPage, setCurrentPage] = useState(0);
  const citiesPerPage = 12;
  const pageCount = Math.ceil((cities?.length || 0) / citiesPerPage);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [scrolled, setScrolled] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Define available languages
  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "ar", name: "العربية", flag: "🇹🇳" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
  ];

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  // Auto-hide mobile menu on navigation
  useEffect(() => {
    setOpen(false);

    // Simulate navigation transition
    setIsNavigating(true);
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname]);

  const getCurrentPageCities = useCallback(() => {
    if (!Array.isArray(cities)) return [];
    const start = currentPage * citiesPerPage;
    const end = start + citiesPerPage;
    return cities.slice(start, end);
  }, [cities, currentPage, citiesPerPage]);

  const goToNextPage = useCallback(() => {
    setCurrentPage((prev) => (prev + 1) % pageCount);
  }, [pageCount]);

  const goToPrevPage = useCallback(() => {
    setCurrentPage((prev) => (prev - 1 + pageCount) % pageCount);
  }, [pageCount]);

  // Filter cities based on search query
  const getFilteredCities = useCallback(() => {
    if (!Array.isArray(cities)) return [];
    if (!debouncedSearchQuery.trim()) return getCurrentPageCities();

    return cities
      .filter((city) =>
        city.Name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      )
      .slice(0, 12); // Limit to 12 results
  }, [cities, debouncedSearchQuery, getCurrentPageCities]);

  const handleLanguageChange = useCallback(
    (langCode: string) => {
      // Call the language change function from language provider
      if (typeof changeLanguage === "function") {
        changeLanguage(langCode);
      }
    },
    [changeLanguage]
  );

  // Check if a path is active (for highlighting current page)
  const isActivePath = useCallback(
    (path: string) => {
      if (path === "/") return pathname === "/";
      return pathname.startsWith(path);
    },
    [pathname]
  );

  return (
    <>
      <TopNavbar />
      <header
        className={cn(
          "sticky top-0 z-50 border-b bg-white transition-all duration-200",
          scrolled && "shadow-md",
          isNavigating && "opacity-90"
        )}
      >
        <div className="container flex h-16 md:h-20 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <Image
                src="/logo.png"
                alt="LTA"
                width={120}
                height={40}
                className="object-contain h-10 w-auto transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </Link>
            <nav className="ml-4 md:ml-8">
              <NavigationMenu className="hidden lg:block">
                <NavigationMenuList className="gap-1">
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className={cn(
                        "h-20 px-3 data-[state=open]:bg-slate-100",
                        isActivePath("/tours") &&
                        "bg-slate-50 font-medium text-lta-purple"
                      )}
                    >
                      <Compass className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{t.navbar.tours}</span>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        <ListItem
                          href="/tours/cultural"
                          title={t.tours.cultural}
                          icon={<Globe className="h-4 w-4" />}
                        >
                          Explore rich cultural heritage and traditions
                        </ListItem>
                        <ListItem
                          href="/tours/adventure"
                          title={t.tours.adventure}
                          icon={<TentTree className="h-4 w-4" />}
                        >
                          Thrilling experiences for adventure seekers
                        </ListItem>
                        <ListItem
                          href="/tours/beach"
                          title={t.tours.beach}
                          icon={<TreePalm className="h-4 w-4" />}
                        >
                          Relax on beautiful beaches worldwide
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>


                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className={cn(
                        "h-20 px-3 data-[state=open]:bg-slate-100",
                        isActivePath("/hotels") &&
                        "bg-slate-50 font-medium text-lta-purple"
                      )}
                    >
                      <Hotel className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{t.navbar.hotels}</span>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="w-[600px] p-4">
                        {loading || citiesLoading ? (
                          <div className="text-center p-4 flex items-center justify-center">
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            <span>Loading cities...</span>
                          </div>
                        ) : Array.isArray(cities) && cities.length > 0 ? (
                          <>
                            <div className="mb-4 relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                placeholder="Search cities..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 h-10"
                              />
                              {searchQuery && (
                                <button
                                  onClick={() => setSearchQuery("")}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                            <ul className="grid grid-cols-3 gap-3">
                              {getFilteredCities().map((city) => (
                                <ListItem
                                  key={city.Id}
                                  href={`/hotels?cityId=${city.Id}`}
                                  title={city.Name || ""}
                                >
                                  {city.Region
                                    ? `Hotels in ${city.Region}`
                                    : "Explore accommodations"}
                                </ListItem>
                              ))}
                            </ul>
                            {!searchQuery && (
                              <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    goToPrevPage();
                                  }}
                                  disabled={pageCount <= 1}
                                  className="flex items-center gap-1 text-gray-700 hover:text-primary h-8"
                                >
                                  <ChevronDown className="h-4 w-4 rotate-90" />
                                  <span>Prev</span>
                                </Button>
                                <div className="flex items-center gap-1">
                                  {Array.from({
                                    length: Math.min(5, pageCount),
                                  }).map((_, index) => {
                                    // Show first page, last page, current page and neighbors
                                    const adjustedIndex = (() => {
                                      if (pageCount <= 5) return index;
                                      if (currentPage < 2) return index;
                                      if (currentPage > pageCount - 3)
                                        return pageCount - 5 + index;
                                      return currentPage - 2 + index;
                                    })();

                                    return (
                                      <Button
                                        key={adjustedIndex}
                                        variant={
                                          currentPage === adjustedIndex
                                            ? "default"
                                            : "outline"
                                        }
                                        size="sm"
                                        className={cn(
                                          "w-8 h-8 p-0",
                                          currentPage === adjustedIndex
                                            ? "bg-lta-purple text-white hover:bg-lta-purple/90"
                                            : "text-gray-600"
                                        )}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          setCurrentPage(adjustedIndex);
                                        }}
                                      >
                                        {adjustedIndex + 1}
                                      </Button>
                                    );
                                  })}
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    goToNextPage();
                                  }}
                                  disabled={pageCount <= 1}
                                  className="flex items-center gap-1 text-gray-700 hover:text-primary h-8"
                                >
                                  <span>Next</span>
                                  <ChevronDown className="h-4 w-4 -rotate-90" />
                                </Button>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center p-8 text-center">
                            <Hotel className="h-12 w-12 text-gray-300 mb-2" />
                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                              No cities available
                            </h3>
                            <p className="text-sm text-gray-500">
                              We couldn't find any cities in our database.
                              Please try again later.
                            </p>
                          </div>
                        )}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className={cn(
                        "h-20 px-3 data-[state=open]:bg-slate-100",
                        (isActivePath("/flights") || isActivePath("/ferry")) &&
                        "bg-slate-50 font-medium text-lta-purple"
                      )}
                    >
                      <Tickets className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{t.navbar.tickets}</span>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        <ListItem
                          href="/flights"
                          title={t.tickets.flights}
                          icon={<Plane className="h-4 w-4" />}
                        >
                          Book airline tickets for domestic and international
                          flights
                        </ListItem>
                        <ListItem
                          href="/ferry"
                          title={t.tickets.ferry}
                          icon={<Ship className="h-4 w-4" />}
                        >
                          Book ferry and boat tickets for sea travel
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <Link href="/transfer" legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "h-20 px-3",
                          isActivePath("/transfer") &&
                          "bg-slate-50 font-medium text-lta-purple"
                        )}
                      >
                        <Truck className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{t.navbar.transfer}</span>
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <Link href="/contact" legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "h-20 px-3",
                          isActivePath("/contact") &&
                          "bg-slate-50 font-medium text-lta-purple"
                        )}
                      >
                        <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{t.navbar.contact}</span>
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <Link href="/bookings" legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "h-20 px-3 relative",
                          isActivePath("/bookings") &&
                          "bg-slate-50 font-medium text-lta-purple"
                        )}
                      >
                        <Tag className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{t.navbar.bookings}</span>
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {/* Language selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="hidden sm:flex items-center justify-center"
                >
                  <Globe className="h-4 w-4" />
                  <span className="sr-only">Change language</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Select Language</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    className={cn(
                      "cursor-pointer flex items-center",
                      currentLanguage === lang.code && "bg-slate-100"
                    )}
                    onClick={() => handleLanguageChange(lang.code)}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                    {currentLanguage === lang.code && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Toggle menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full sm:max-w-md p-0 overflow-hidden"
              >
                <div className="flex flex-col h-full">
                  {/* Mobile menu header */}
                  <div className="p-4 border-b flex items-center justify-between">
                    <div className="relative h-10 w-24">
                      <Image
                        src="/logo.png"
                        alt="LTA"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Mobile language selector */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="sm:hidden"
                          >
                            <Globe className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Select Language</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {languages.map((lang) => (
                            <DropdownMenuItem
                              key={lang.code}
                              className={cn(
                                "cursor-pointer flex items-center",
                                currentLanguage === lang.code && "bg-slate-100"
                              )}
                              onClick={() => handleLanguageChange(lang.code)}
                            >
                              <span className="mr-2">{lang.flag}</span>
                              {lang.name}
                              {currentLanguage === lang.code && (
                                <Check className="ml-auto h-4 w-4" />
                              )}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>


                  {/* Mobile menu content - scrollable */}
                  <div className="flex-1 overflow-auto">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="tours" className="border-b">
                        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50">
                          <div className="flex items-center">
                            <Compass className="h-5 w-5 mr-3 text-lta-purple" />
                            <span className="font-medium">
                              {t.navbar.tours}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-2">
                          <div className="space-y-1 pl-12">
                            <Link
                              href="/tours/cultural"
                              className="flex items-center py-2 px-4 text-sm text-gray-600 hover:text-lta-purple hover:bg-gray-50 rounded-md"
                            >
                              <Globe className="h-4 w-4 mr-2 text-gray-500" />
                              {t.tours.cultural}
                            </Link>
                            <Link
                              href="/tours/adventure"
                              className="flex items-center py-2 px-4 text-sm text-gray-600 hover:text-lta-purple hover:bg-gray-50 rounded-md"
                            >
                              <TentTree className="h-4 w-4 mr-2 text-gray-500" />
                              {t.tours.adventure}
                            </Link>
                            <Link
                              href="/tours/beach"
                              className="flex items-center py-2 px-4 text-sm text-gray-600 hover:text-lta-purple hover:bg-gray-50 rounded-md"
                            >
                              <TreePalm className="h-4 w-4 mr-2 text-gray-500" />
                              {t.tours.beach}
                            </Link>
                          </div>
                        </AccordionContent>
                      </AccordionItem>


                      <AccordionItem value="hotels" className="border-b">
                        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50">
                          <div className="flex items-center">
                            <Hotel className="h-5 w-5 mr-3 text-lta-purple" />
                            <span className="font-medium">
                              {t.navbar.hotels}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="px-4 pb-3">
                            <div className="relative mb-3">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                placeholder="Search cities..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2"
                              />
                              {searchQuery && (
                                <button
                                  onClick={() => setSearchQuery("")}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              )}
                            </div>

                            {loading || citiesLoading ? (
                              <div className="text-center py-4 flex flex-col items-center">
                                <Loader2 className="h-6 w-6 animate-spin mb-2 text-lta-purple" />
                                <p className="text-sm text-gray-500">
                                  Loading cities...
                                </p>
                              </div>
                            ) : getFilteredCities().length > 0 ? (
                              <div className="grid grid-cols-2 gap-2">
                                {getFilteredCities().map((city) => (
                                  <Link
                                    key={city.Id}
                                    href={`/hotels?cityId=${city.Id}`}
                                    className="flex items-center py-2 px-3 text-sm text-gray-600 hover:text-lta-purple hover:bg-gray-50 rounded-md"
                                    onClick={() => setOpen(false)}
                                  >
                                    <Hotel className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                                    <span className="truncate">
                                      {city.Name}
                                    </span>
                                  </Link>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-4">
                                <p className="text-sm text-gray-500">
                                  No cities found
                                </p>
                              </div>
                            )}

                            {!searchQuery && pageCount > 1 && (
                              <div className="flex justify-center items-center gap-1 mt-4 pt-3 border-t border-gray-100">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={goToPrevPage}
                                  disabled={currentPage === 0}
                                  className="h-8 w-8 p-0"
                                >
                                  <ChevronDown className="h-4 w-4 rotate-90" />
                                </Button>
                                <span className="text-sm text-gray-500 mx-2">
                                  Page {currentPage + 1} of {pageCount}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={goToNextPage}
                                  disabled={currentPage === pageCount - 1}
                                  className="h-8 w-8 p-0"
                                >
                                  <ChevronDown className="h-4 w-4 -rotate-90" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="tickets" className="border-b">
                        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50">
                          <div className="flex items-center">
                            <Tickets className="h-5 w-5 mr-3 text-lta-purple" />
                            <span className="font-medium">
                              {t.navbar.tickets}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-2">
                          <div className="space-y-1 pl-12">
                            <Link
                              href="/flights"
                              className="flex items-center py-2 px-4 text-sm text-gray-600 hover:text-lta-purple hover:bg-gray-50 rounded-md"
                              onClick={() => setOpen(false)}
                            >
                              <Plane className="h-4 w-4 mr-2 text-gray-500" />
                              {t.tickets.flights || "Flights"}
                            </Link>
                            <Link
                              href="/ferry"
                              className="flex items-center py-2 px-4 text-sm text-gray-600 hover:text-lta-purple hover:bg-gray-50 rounded-md"
                              onClick={() => setOpen(false)}
                            >
                              <Ship className="h-4 w-4 mr-2 text-gray-500" />
                              {t.tickets.ferry || "Ferry"}
                            </Link>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    {/* Non-dropdown menu items */}
                    <Link
                      href="/transfer"
                      className="flex items-center px-4 py-3 border-b hover:bg-gray-50"
                      onClick={() => setOpen(false)}
                    >
                      <Truck className="h-5 w-5 mr-3 text-lta-purple" />
                      <span className="font-medium">{t.navbar.transfer}</span>
                    </Link>

                    <Link
                      href="/contact"
                      className="flex items-center px-4 py-3 border-b hover:bg-gray-50"
                      onClick={() => setOpen(false)}
                    >
                      <Phone className="h-5 w-5 mr-3 text-lta-purple" />
                      <span className="font-medium">{t.navbar.contact}</span>
                    </Link>

                    <Link
                      href="/bookings"
                      className="flex items-center px-4 py-3 border-b hover:bg-gray-50 relative"
                      onClick={() => setOpen(false)}
                    >
                      <Tag className="h-5 w-5 mr-3 text-lta-purple" />
                      <span className="font-medium">
                        {t.navbar.bookings || "Bookings"}
                      </span>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}

// Missing Star and Crown icons
function Star(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function Crown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  );
}
