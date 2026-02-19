"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format, differenceInDays, addDays } from "date-fns";
import {
  MapPin,
  Phone,
  Mail,
  Users,
  Star,
  Check,
  Clock,
  ArrowRight,
  ChevronRight,
  CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SearchDetails, HotelDetail, HotelBooking } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import ThankYouModal from "@/components/ThankYouModal";
import { useLanguage } from "@/components/language-provider";

// Define room configuration type
interface RoomConfig {
  Adult: number;
  Child: number[];
}

// Define guest information type
interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

// Define booking information type
interface BookingInfo {
  mainGuest: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  };
  roomGuests: Record<number, GuestInfo[]>;
  specialRequests?: string;
  acceptTerms: boolean;
}

export default function HotelDetailPage() {
  const { t } = useLanguage();
  const params = useParams();
  const searchParams = useSearchParams();
  const hotelId = params.id as string;

  // Parse search params if available
  const searchParamValue = searchParams.get("search");
  const parsedSearch: SearchDetails | null = searchParamValue
    ? JSON.parse(decodeURIComponent(searchParamValue))
    : null;

  const [hotelDetail, setHotelDetail] = useState<HotelDetail | null>(null);
  const [bookingData, setBookingData] = useState<HotelBooking | null>(null);
  const [selectedBoarding, setSelectedBoarding] = useState<string | null>(null);
  const [loading, setLoading] = useState({
    details: true,
    booking: false,
  });
  const [error, setError] = useState({
    details: null as string | null,
    booking: null as string | null,
  });

  // Initialize date range with defaults if no search params
  const [dateRange, setDateRange] = useState<{
    checkIn: Date | undefined;
    checkOut: Date | undefined;
  }>({
    checkIn: parsedSearch
      ? new Date(parsedSearch.BookingDetails.CheckIn)
      : new Date(),
    checkOut: parsedSearch
      ? new Date(parsedSearch.BookingDetails.CheckOut)
      : addDays(new Date(), 7),
  });
  const [roomConfigurations, setRoomConfigurations] = useState<RoomConfig[]>(
    parsedSearch?.Rooms?.map((room: any) => ({
      ...room,
      Child: room.Child || [],
    })) || [{ Adult: 2, Child: [] }]
  );
  const [selectedRooms, setSelectedRooms] = useState<Record<number, any>>({});
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [referralCode, setReferralCode] = useState<string>("");
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingInfo, setBookingInfo] = useState<BookingInfo>({
    mainGuest: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      postalCode: "",
    },
    roomGuests: {},
    specialRequests: "",
    acceptTerms: false,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [paramsChanged, setParamsChanged] = useState(!parsedSearch);

  // Initialize room guests when selected rooms change
  useEffect(() => {
    if (Object.keys(selectedRooms).length > 0) {
      const initialRoomGuests: Record<number, GuestInfo[]> = {};

      Object.entries(selectedRooms).forEach(([roomIndex, room]) => {
        const roomIdx = Number.parseInt(roomIndex);
        const roomConfig = roomConfigurations[roomIdx];

        const guestCount = roomConfig.Adult + (roomConfig.Child?.length || 0);
        initialRoomGuests[roomIdx] = Array(guestCount).fill({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
        });
      });

      setBookingInfo((prev) => ({
        ...prev,
        roomGuests: initialRoomGuests,
      }));
    }
  }, [selectedRooms, roomConfigurations]);

  // Fetch hotel details
  useEffect(() => {
    const fetchHotelDetails = async () => {
      setLoading((prev) => ({ ...prev, details: true }));
      setError((prev) => ({ ...prev, details: null }));

      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
        const response = await fetch(`${baseUrl}/hotel/detail`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({
            data: { Hotel: hotelId },
          }),
        });
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const result = await response.json();
        const mockHotelDetail = result.HotelDetail;
        setHotelDetail(mockHotelDetail);
      } catch (error) {
        console.error("Error fetching hotel details:", error);
        setError((prev) => ({
          ...prev,
          details: "Failed to load hotel details. Please try again later.",
        }));
      } finally {
        setLoading((prev) => ({ ...prev, details: false }));
      }
    };

    fetchHotelDetails();
  }, [hotelId]);

  // Fetch booking data with updated parameters
  const fetchBookingData = async (
    checkIn: Date,
    checkOut: Date,
    rooms: RoomConfig[]
  ) => {
    if (!checkIn || !checkOut) return;

    setLoading((prev) => ({ ...prev, booking: true }));
    setError((prev) => ({ ...prev, booking: null }));

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const apiData = {
        SearchDetails: {
          BookingDetails: {
            CheckIn: format(checkIn, "yyyy-MM-dd"),
            CheckOut: format(checkOut, "yyyy-MM-dd"),
            Hotel: Number(hotelId),
          },
          Rooms: rooms,
        },
      };

      const response = await fetch(`${baseUrl}/hotel/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          data: apiData,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();
      const newBookingData = result.HotelSearch[0] || [];
      setBookingData(newBookingData);
      console.log(result.HotelSearch[0])
      setSelectedRooms({});

      if (newBookingData.Price?.Boarding?.length > 0) {
        setSelectedBoarding(newBookingData.Price.Boarding[0].Code);
      }

      setParamsChanged(false);
    } catch (error) {
      console.error("Error fetching booking data:", error);
      setError((prev) => ({
        ...prev,
        booking: "Failed to load booking data. Please try again later.",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, booking: false }));
    }
  };

  // Fetch booking data if search params are available or when params change
  useEffect(() => {
    if (paramsChanged && dateRange.checkIn && dateRange.checkOut) {
      fetchBookingData(
        dateRange.checkIn,
        dateRange.checkOut,
        roomConfigurations
      );
    } else if (parsedSearch) {
      fetchBookingData(
        new Date(parsedSearch.BookingDetails.CheckIn),
        new Date(parsedSearch.BookingDetails.CheckOut),
        parsedSearch.Rooms.map((room: any) => ({
          ...room,
          Child: room.Child || [],
        }))
      );
    }
  }, []);

  // Calculate stay duration
  const stayDuration =
    dateRange.checkIn && dateRange.checkOut
      ? differenceInDays(dateRange.checkOut, dateRange.checkIn)
      : 0;

  // Handle form input changes
  const handleMainGuestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookingInfo((prev) => ({
      ...prev,
      mainGuest: {
        ...prev.mainGuest,
        [name]: value,
      },
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle room guest changes
  const handleRoomGuestChange = (
    roomIndex: number,
    guestIndex: number,
    field: string,
    value: string
  ) => {
    setBookingInfo((prev) => {
      const updatedRoomGuests = { ...prev.roomGuests };

      if (!updatedRoomGuests[roomIndex]) {
        updatedRoomGuests[roomIndex] = [];
      }

      if (!updatedRoomGuests[roomIndex][guestIndex]) {
        updatedRoomGuests[roomIndex][guestIndex] = {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
        };
      }

      updatedRoomGuests[roomIndex][guestIndex] = {
        ...updatedRoomGuests[roomIndex][guestIndex],
        [field]: value,
      };

      return {
        ...prev,
        roomGuests: updatedRoomGuests,
      };
    });

    const errorKey = `room_${roomIndex}_guest_${guestIndex}_${field}`;
    if (formErrors[errorKey]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  // Validate form before proceeding
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!bookingInfo.mainGuest.firstName.trim()) {
        errors.firstName = "First name is required";
      }
      if (!bookingInfo.mainGuest.lastName.trim()) {
        errors.lastName = "Last name is required";
      }
      if (!bookingInfo.mainGuest.email.trim()) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(bookingInfo.mainGuest.email)) {
        errors.email = "Email is invalid";
      }
      if (!bookingInfo.mainGuest.phone.trim()) {
        errors.phone = "Phone number is required";
      }
    }

    if (currentStep === 2) {
      Object.entries(bookingInfo.roomGuests).forEach(([roomIndex, guests]) => {
        guests.forEach((guest, guestIndex) => {
          if (!guest.firstName.trim()) {
            errors[`room_${roomIndex}_guest_${guestIndex}_firstName`] =
              "First name is required";
          }
          if (!guest.lastName.trim()) {
            errors[`room_${roomIndex}_guest_${guestIndex}_lastName`] =
              "Last name is required";
          }
        });
      });
    }

    if (currentStep === 3) {
      if (!bookingInfo.acceptTerms) {
        errors.acceptTerms = "You must accept the terms and conditions";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle next step
  const handleNextStep = () => {
    if (validateForm()) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // Handle booking submission
  const handleBookingSubmit = async () => {
    if (validateForm()) {
      const bookingData = {
        hotel: hotelDetail?.Name,
        hotelId: hotelDetail?.Id,
        checkIn: dateRange.checkIn
          ? format(dateRange.checkIn, "yyyy-MM-dd")
          : "",
        checkOut: dateRange.checkOut
          ? format(dateRange.checkOut, "yyyy-MM-dd")
          : "",
        rooms: selectedRooms,
        boardingType: selectedBoarding,
        bookingInfo,
      };

      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
        const response = await fetch(`${baseUrl}/booking/hotels`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify(bookingData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to submit booking.");
        }
        const result = await response.json();

        setIsBookingModalOpen(false);
        // Safely access bookingReference from nested data object
        const bookingRef = result?.data?.bookingReference || result?.bookingReference || "";
        setReferralCode(bookingRef);
        setShowModal(true);
      } catch (error) {
        console.error("Error submitting booking:", error);
        alert("There was a problem submitting your booking. Please try again.");
      }
    }
  };

  if (loading.details) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2">
              <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
            </div>
            <div>
              <div className="h-40 bg-gray-200 rounded mb-4"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error.details) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.details}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button asChild>
            <Link href="/hotels">Back to Hotels</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!hotelDetail) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert>
          <AlertTitle>Hotel Not Found</AlertTitle>
          <AlertDescription>
            The requested hotel could not be found.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button asChild>
            <Link href="/hotels">Back to Hotels</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-lta-purple py-6">
          <div className="container">
            <div className="flex flex-col gap-2">
              <div className="flex items-center text-white/80 text-sm">
                <Link href="/" className="hover:text-white">
                  {t.detailsPage.home}
                </Link>
                <ChevronRight className="w-4 h-4 mx-1" />
                <Link href="/hotels" className="hover:text-white">
                  {t.detailsPage.hotels}
                </Link>
                <ChevronRight className="w-4 h-4 mx-1" />
                <span className="text-white">{hotelDetail.Name}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {hotelDetail.Name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>
                    {hotelDetail.Adress}, {hotelDetail.City.Name},{" "}
                    {hotelDetail.City.Country}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container py-12">
          {/* Hotel Images */}
          <div className="mb-8">
            <Carousel className="w-full">
              <CarouselContent>
                <CarouselItem>
                  <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
                    <Image
                      src={hotelDetail.Image || "/placeholder.svg"}
                      alt={hotelDetail.Name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CarouselItem>
                {hotelDetail.Album.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
                      <Image
                        src={image.Url || "/placeholder.svg"}
                        alt={
                          image.Alt ||
                          `${hotelDetail.Name} - Image ${index + 1}`
                        }
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

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Hotel Details */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview">
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">
                    {t.detailsPage.overview}
                  </TabsTrigger>
                  <TabsTrigger value="amenities">
                    {t.detailsPage.amenities}
                  </TabsTrigger>
                  <TabsTrigger value="policies">
                    {t.detailsPage.policies}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <div className="space-y-6">
                    <div>
                      <div className="mb-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                          <div>
                            <h1 className="text-3xl font-bold">
                              {hotelDetail.Name}
                            </h1>
                            <div className="flex items-center mt-2">
                              {Array.from({
                                length: hotelDetail.Category.Star,
                              }).map((_, i) => (
                                <Star
                                  key={i}
                                  className="h-5 w-5 text-yellow-400 fill-yellow-400"
                                />
                              ))}
                              <span className="ml-2 text-muted-foreground">
                                {hotelDetail.Category.Title}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <h2 className="text-xl font-semibold mb-4">
                        {t.detailsPage.about}
                      </h2>
                      <div
                        className="text-muted-foreground"
                        dangerouslySetInnerHTML={{
                          __html: hotelDetail.LongDescription,
                        }}
                      />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        {t.detailsPage.contactInformation}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          <span>{hotelDetail.Phone}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          <span>{hotelDetail.Email}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>
                            {t.detailsPage.checkInTime} {hotelDetail.CheckIn}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        {t.detailsPage.tags}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {hotelDetail.Tag.map((tag) => (
                          <Badge key={tag.Id} variant="secondary">
                            {tag.Title}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        {t.detailsPage.themes}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {hotelDetail.Theme.map((theme, index) => (
                          <Badge key={index} variant="outline">
                            {theme}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="amenities">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-3">
                        {t.detailsPage.hotelAmenities}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {hotelDetail.Option.map((option) => (
                          <div key={option.Id} className="flex items-center">
                            <Check className="h-4 w-4 mr-2 text-green-500" />
                            <span>{option.Title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Separator />

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        {t.detailsPage.mealPlansAvailable}
                      </h3>
                      <div className="space-y-2">
                        {hotelDetail.Boarding.map((boarding) => (
                          <div key={boarding.Id} className="flex items-center">
                            <Check className="h-4 w-4 mr-2 text-green-500" />
                            <span>
                              {boarding.Name} ({boarding.Code})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="policies">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-3">
                        {t.detailsPage.hotelPolicies}
                      </h2>
                      <div
                        className="text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: hotelDetail.Note }}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Booking */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>{t.detailsPage.checkAvailability}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Date Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="check-in">
                          {t.hotelSearchPage.checkInDate}
                        </Label>
                        <Popover
                          open={isCheckInOpen}
                          onOpenChange={setIsCheckInOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              id="check-in"
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateRange.checkIn ? (
                                format(dateRange.checkIn, "MMM d, yyyy")
                              ) : (
                                <span>{t.detailsPage.selectDates}</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              initialFocus
                              mode="single"
                              selected={dateRange.checkIn}
                              onSelect={(date) => {
                                if (date) {
                                  setDateRange((prev) => {
                                    const newCheckIn = date;
                                    let newCheckOut = prev.checkOut;

                                    if (
                                      newCheckOut &&
                                      newCheckOut <= newCheckIn
                                    ) {
                                      newCheckOut = addDays(newCheckIn, 1);
                                    }

                                    setParamsChanged(true);
                                    setIsCheckInOpen(false);
                                    return {
                                      checkIn: newCheckIn,
                                      checkOut: newCheckOut,
                                    };
                                  });
                                }
                              }}
                              disabled={(date) =>
                                !!(
                                  date < new Date() ||
                                  (dateRange.checkOut &&
                                    date >= dateRange.checkOut)
                                )
                              }
                              defaultMonth={dateRange.checkIn}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="check-out">
                          {t.hotelSearchPage.checkOutDate}
                        </Label>
                        <Popover
                          open={isCheckOutOpen}
                          onOpenChange={setIsCheckOutOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              id="check-out"
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateRange.checkOut ? (
                                format(dateRange.checkOut, "MMM d, yyyy")
                              ) : (
                                <span>{t.detailsPage.selectCheckOut}</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              initialFocus
                              mode="single"
                              selected={dateRange.checkOut}
                              onSelect={(date) => {
                                if (date) {
                                  setDateRange((prev) => {
                                    setParamsChanged(true);
                                    setIsCheckOutOpen(false);
                                    return { ...prev, checkOut: date };
                                  });
                                }
                              }}
                              disabled={(date) =>
                                !dateRange.checkIn ||
                                date <= dateRange.checkIn ||
                                date < addDays(new Date(), 1)
                              }
                              defaultMonth={
                                dateRange.checkOut ||
                                addDays(dateRange.checkIn || new Date(), 1)
                              }
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    {/* Room Configuration */}
                    <div className="space-y-2">
                      <Label>{t.detailsPage.roomConfiguration}</Label>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <Users className="mr-2 h-4 w-4" />
                            {roomConfigurations.length}{" "}
                            {roomConfigurations.length === 1 ? "room" : "rooms"}
                            ,{" "}
                            {roomConfigurations.reduce(
                              (total, room) => total + room.Adult,
                              0
                            )}{" "}
                            {t.detailsPage.adults}
                            {roomConfigurations.reduce(
                              (total, room) =>
                                total + (room.Child?.length || 0),
                              0
                            ) > 0 &&
                              `, ${roomConfigurations.reduce(
                                (total, room) =>
                                  total + (room.Child?.length || 0),
                                0
                              )} ${t.detailsPage.children}`}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>
                              {t.detailsPage.roomConfigurationTitle}
                            </DialogTitle>
                          </DialogHeader>
                          <ScrollArea className="max-h-[60vh]">
                            <div className="space-y-4 p-2">
                              {roomConfigurations.map((room, index) => (
                                <Card key={index} className="p-4">
                                  <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-medium">
                                      {t.detailsPage.room} {index + 1}
                                    </h3>
                                    {roomConfigurations.length > 1 && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          const newRooms = [
                                            ...roomConfigurations,
                                          ];
                                          newRooms.splice(index, 1);
                                          setRoomConfigurations(newRooms);
                                          const newSelectedRooms = {
                                            ...selectedRooms,
                                          };
                                          delete newSelectedRooms[index];
                                          setSelectedRooms(newSelectedRooms);
                                          setParamsChanged(true);
                                        }}
                                      >
                                        {t.detailsPage.remove}
                                      </Button>
                                    )}
                                  </div>
                                  <div className="space-y-3">
                                    <div>
                                      <Label htmlFor={`adults-${index}`}>
                                        {t.detailsPage.adults}
                                      </Label>
                                      <Select
                                        value={room.Adult.toString()}
                                        onValueChange={(value) => {
                                          const newRooms = [
                                            ...roomConfigurations,
                                          ];
                                          newRooms[index] = {
                                            ...newRooms[index],
                                            Adult: Number.parseInt(value),
                                          };
                                          setRoomConfigurations(newRooms);
                                          const newSelectedRooms = {
                                            ...selectedRooms,
                                          };
                                          delete newSelectedRooms[index];
                                          setSelectedRooms(newSelectedRooms);
                                          setParamsChanged(true);
                                        }}
                                      >
                                        <SelectTrigger
                                          id={`adults-${index}`}
                                          className="w-full"
                                        >
                                          <SelectValue placeholder="Select number of adults" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {[1, 2, 3, 4].map((num) => (
                                            <SelectItem
                                              key={num}
                                              value={num.toString()}
                                            >
                                              {num} {t.detailsPage.adults}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <div className="flex justify-between items-center mb-2">
                                        <Label>{t.detailsPage.children}</Label>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            const newRooms = [
                                              ...roomConfigurations,
                                            ];
                                            newRooms[index] = {
                                              ...newRooms[index],
                                              Child: [
                                                ...(newRooms[index].Child ||
                                                  []),
                                                6,
                                              ],
                                            };
                                            setRoomConfigurations(newRooms);
                                            const newSelectedRooms = {
                                              ...selectedRooms,
                                            };
                                            delete newSelectedRooms[index];
                                            setSelectedRooms(newSelectedRooms);
                                            setParamsChanged(true);
                                          }}
                                        >
                                          {t.detailsPage.addChild}
                                        </Button>
                                      </div>
                                      {room.Child && room.Child.length > 0 ? (
                                        <div className="space-y-2">
                                          {room.Child.map((age, childIndex) => (
                                            <div
                                              key={childIndex}
                                              className="flex items-center gap-2"
                                            >
                                              <div className="flex-1">
                                                <Label
                                                  htmlFor={`child-age-${index}-${childIndex}`}
                                                  className="text-xs"
                                                >
                                                  Child {childIndex + 1}{" "}
                                                  {t.detailsPage.childAge}
                                                </Label>
                                                <Select
                                                  value={age.toString()}
                                                  onValueChange={(value) => {
                                                    const newRooms = [
                                                      ...roomConfigurations,
                                                    ];
                                                    newRooms[index].Child[
                                                      childIndex
                                                    ] = Number.parseInt(value);
                                                    setRoomConfigurations(
                                                      newRooms
                                                    );
                                                    const newSelectedRooms = {
                                                      ...selectedRooms,
                                                    };
                                                    delete newSelectedRooms[
                                                      index
                                                    ];
                                                    setSelectedRooms(
                                                      newSelectedRooms
                                                    );
                                                    setParamsChanged(true);
                                                  }}
                                                >
                                                  <SelectTrigger
                                                    id={`child-age-${index}-${childIndex}`}
                                                  >
                                                    <SelectValue />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    {Array.from(
                                                      { length: 17 },
                                                      (_, i) => i + 1
                                                    ).map((age) => (
                                                      <SelectItem
                                                        key={age}
                                                        value={age.toString()}
                                                      >
                                                        {age}{" "}
                                                        {age === 1
                                                          ? "year"
                                                          : "years"}
                                                      </SelectItem>
                                                    ))}
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="mt-4"
                                                onClick={() => {
                                                  const newRooms = [
                                                    ...roomConfigurations,
                                                  ];
                                                  newRooms[index].Child.splice(
                                                    childIndex,
                                                    1
                                                  );
                                                  setRoomConfigurations(
                                                    newRooms
                                                  );
                                                  const newSelectedRooms = {
                                                    ...selectedRooms,
                                                  };
                                                  delete newSelectedRooms[
                                                    index
                                                  ];
                                                  setSelectedRooms(
                                                    newSelectedRooms
                                                  );
                                                  setParamsChanged(true);
                                                }}
                                              >
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="24"
                                                  height="24"
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  className="w-4 h-4"
                                                >
                                                  <path d="M3 6h18"></path>
                                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                                </svg>
                                              </Button>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <div className="text-center py-2 text-sm text-muted-foreground border rounded-md">
                                          {t.detailsPage.noChildrenAdded}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </Card>
                              ))}
                              <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                  setRoomConfigurations([
                                    ...roomConfigurations,
                                    { Adult: 2, Child: [] },
                                  ]);
                                  setParamsChanged(true);
                                }}
                              >
                                {t.detailsPage.addAnotherRoom}
                              </Button>
                            </div>
                          </ScrollArea>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {(!dateRange.checkIn || !dateRange.checkOut) && (
                      <Alert>
                        <AlertTitle>
                          {t.detailsPage.selectDatesTitle}
                        </AlertTitle>
                        <AlertDescription>
                          {t.detailsPage.selectDatesPrompt}
                        </AlertDescription>
                      </Alert>
                    )}

                    {dateRange.checkIn && dateRange.checkOut && (
                      <Button
                        className="w-full"
                        disabled={loading.booking}
                        onClick={async () => {
                          await fetchBookingData(
                            dateRange.checkIn!,
                            dateRange.checkOut!,
                            roomConfigurations
                          );
                        }}
                      >
                        {loading.booking
                          ? t.detailsPage.loading
                          : t.detailsPage.checkAvailability}
                      </Button>
                    )}

                    <Separator />

                    {/* Room Selection */}
                    {loading.booking ? (
                      <div className="space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-full animate-pulse"></div>
                        <div className="h-20 bg-gray-200 rounded w-full animate-pulse"></div>
                        <div className="h-20 bg-gray-200 rounded w-full animate-pulse"></div>
                      </div>
                    ) : error.booking ? (
                      <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error.booking}</AlertDescription>
                      </Alert>
                    ) : bookingData ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="boarding-plan">
                            {t.detailsPage.selectMealPlan}
                          </Label>
                          <Select
                            value={selectedBoarding || ""}
                            onValueChange={setSelectedBoarding}
                          >
                            <SelectTrigger
                              id="boarding-plan"
                              className="w-full"
                            >
                              <SelectValue placeholder="Select meal plan" />
                            </SelectTrigger>
                            <SelectContent>
                              {bookingData.Price.Boarding.map((boarding) => (
                                <SelectItem
                                  key={boarding.Code}
                                  value={boarding.Code}
                                >
                                  {boarding.Name} ({boarding.Code})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {selectedBoarding && (
                          <div className="space-y-4">
                            <h3 className="font-medium">
                              {t.detailsPage.availableRooms}
                            </h3>

                            <Accordion
                              type="single"
                              collapsible
                              className="w-full"
                              defaultValue="room-0"
                            >
                              {roomConfigurations.map(
                                (roomConfig, roomIndex) => {
                                  const selectedBoardingData =
                                    bookingData?.Price.Boarding.find(
                                      (b) => b.Code === selectedBoarding
                                    );

                                  if (!selectedBoardingData) return null;

                                  const paxData = selectedBoardingData.Pax.find(
                                    (pax) => {
                                      if (pax.Adult !== roomConfig.Adult)
                                        return false;

                                      if (
                                        roomConfig.Child &&
                                        roomConfig.Child.length > 0
                                      ) {
                                        if (!pax.Child) return false;
                                        if (
                                          pax.Child.length !==
                                          roomConfig.Child.length
                                        )
                                          return false;
                                        return true;
                                      } else {
                                        return (
                                          !pax.Child || pax.Child.length === 0
                                        );
                                      }
                                    }
                                  );

                                  if (!paxData) return null;

                                  return (
                                    <AccordionItem
                                      key={roomIndex}
                                      value={`room-${roomIndex}`}
                                    >
                                      <AccordionTrigger className="hover:no-underline">
                                        <div className="flex items-center justify-between w-full pr-4">
                                          <span>
                                            Room {roomIndex + 1}:{" "}
                                            {roomConfig.Adult}{" "}
                                            {roomConfig.Adult === 1
                                              ? "adult"
                                              : "adults"}
                                            {roomConfig.Child &&
                                              roomConfig.Child.length > 0 &&
                                              `, ${roomConfig.Child.length} ${roomConfig.Child.length === 1
                                                ? "child"
                                                : "children"
                                              } (ages: ${roomConfig.Child.join(
                                                ", "
                                              )})`}
                                          </span>
                                          {selectedRooms[roomIndex] && (
                                            <Badge
                                              variant="outline"
                                              className="ml-2"
                                            >
                                              {t.detailsPage.selected}:{" "}
                                              {selectedRooms[roomIndex].Name}
                                            </Badge>
                                          )}
                                        </div>
                                      </AccordionTrigger>
                                      <AccordionContent>
                                        <div className="space-y-3">
                                          {paxData.Rooms.map((room) => (
                                            <Card
                                              key={room.Id}
                                              className={cn(
                                                "border-2",
                                                selectedRooms[roomIndex]?.Id ===
                                                  room.Id
                                                  ? "border-primary"
                                                  : "border-border"
                                              )}
                                            >
                                              <CardContent className="p-4">
                                                <div className="flex justify-between items-start">
                                                  <div>
                                                    <h4 className="font-medium">
                                                      {room.Name}
                                                    </h4>
                                                    {room.Description && (
                                                      <p className="text-sm text-muted-foreground">
                                                        {room.Description}
                                                      </p>
                                                    )}
                                                    <div className="text-sm mt-1">
                                                      <span className="text-muted-foreground">
                                                        Available:{" "}
                                                      </span>
                                                      <span className="font-medium">
                                                        {room.Quantity}
                                                      </span>
                                                    </div>
                                                    {room.CancellationDeadline && (
                                                      <div className="text-xs text-muted-foreground mt-1">
                                                        Free cancellation until:{" "}
                                                        {
                                                          room.CancellationDeadline
                                                        }
                                                      </div>
                                                    )}
                                                  </div>
                                                  <div className="text-right">
                                                    <div className="text-lg font-bold">
                                                      {Number.parseFloat(
                                                        room.Price
                                                      ).toFixed(3)}{" "}
                                                      {bookingData.Currency}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                      for{" "}
                                                      {differenceInDays(
                                                        dateRange.checkOut!,
                                                        dateRange.checkIn!
                                                      )}{" "}
                                                      {differenceInDays(
                                                        dateRange.checkOut!,
                                                        dateRange.checkIn!
                                                      ) === 1
                                                        ? "night"
                                                        : "nights"}
                                                    </div>
                                                    <Button
                                                      size="sm"
                                                      className="mt-2"
                                                      variant={
                                                        selectedRooms[roomIndex]
                                                          ?.Id === room.Id
                                                          ? "default"
                                                          : "outline"
                                                      }
                                                      onClick={() => {
                                                        setSelectedRooms(
                                                          (prev) => ({
                                                            ...prev,
                                                            [roomIndex]: room,
                                                          })
                                                        );
                                                      }}
                                                    >
                                                      {selectedRooms[roomIndex]
                                                        ?.Id === room.Id
                                                        ? t.detailsPage.selected
                                                        : t.detailsPage.select}
                                                    </Button>
                                                  </div>
                                                </div>
                                              </CardContent>
                                            </Card>
                                          ))}
                                        </div>
                                      </AccordionContent>
                                    </AccordionItem>
                                  );
                                }
                              )}
                            </Accordion>

                            {/* Summary and Book Button */}
                            {Object.keys(selectedRooms).length > 0 && (
                              <div className="mt-6 space-y-4">
                                <Separator />
                                <div className="space-y-2">
                                  <h3 className="font-medium">
                                    {t.detailsPage.bookingSummary}
                                  </h3>
                                  <div className="space-y-1">
                                    {Object.entries(selectedRooms).map(
                                      ([roomIndex, room]) => (
                                        <div
                                          key={roomIndex}
                                          className="flex justify-between"
                                        >
                                          <span>
                                            Room{" "}
                                            {Number.parseInt(roomIndex) + 1}:{" "}
                                            {room.Name}
                                          </span>
                                          <span className="font-medium">
                                            {Number.parseFloat(
                                              room.Price
                                            ).toFixed(3)}{" "}
                                            {bookingData.Currency}
                                          </span>
                                        </div>
                                      )
                                    )}
                                    <Separator className="my-2" />
                                    <div className="flex justify-between font-bold">
                                      <span>{t.detailsPage.total}</span>
                                      <span>
                                        {Object.values(selectedRooms)
                                          .reduce(
                                            (sum, room: any) =>
                                              sum +
                                              Number.parseFloat(room.Price),
                                            0
                                          )
                                          .toFixed(3)}{" "}
                                        {bookingData.Currency}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  className="w-full"
                                  onClick={() => {
                                    setCurrentStep(1);
                                    setIsBookingModalOpen(true);
                                  }}
                                >
                                  {t.detailsPage.proceedToBooking}
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Alert>
                        <AlertTitle>{t.detailsPage.noAvailability}</AlertTitle>
                        <AlertDescription>
                          {t.detailsPage.checkAvailabilityPrompt}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t.detailsPage.completeYourBooking}</DialogTitle>
            <DialogDescription>
              {hotelDetail.Name} •{" "}
              {dateRange.checkIn ? format(dateRange.checkIn, "MMM d") : ""} -{" "}
              {dateRange.checkOut
                ? format(dateRange.checkOut, "MMM d, yyyy")
                : ""}{" "}
              • {stayDuration} {stayDuration === 1 ? "night" : "nights"}
            </DialogDescription>
          </DialogHeader>

          {/* Booking Steps */}
          <div className="mt-4">
            <div className="flex justify-between mb-6">
              <div
                className={`flex flex-col items-center ${currentStep >= 1 ? "text-primary" : "text-muted-foreground"
                  }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${currentStep >= 1
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                    }`}
                >
                  1
                </div>
                <span className="text-xs">{t.detailsPage.guestInfo}</span>
              </div>
              <div className="flex-1 flex items-center">
                <div
                  className={`h-1 w-full ${currentStep >= 2 ? "bg-primary" : "bg-muted"
                    }`}
                ></div>
              </div>
              <div
                className={`flex flex-col items-center ${currentStep >= 2 ? "text-primary" : "text-muted-foreground"
                  }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${currentStep >= 2
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                    }`}
                >
                  2
                </div>
                <span className="text-xs">{t.detailsPage.roomGuests}</span>
              </div>
              <div className="flex-1 flex items-center">
                <div
                  className={`h-1 w-full ${currentStep >= 3 ? "bg-primary" : "bg-muted"
                    }`}
                ></div>
              </div>
              <div
                className={`flex flex-col items-center ${currentStep >= 3 ? "text-primary" : "text-muted-foreground"
                  }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${currentStep >= 3
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                    }`}
                >
                  3
                </div>
                <span className="text-xs">{t.detailsPage.payment}</span>
              </div>
            </div>

            {/* Step 1: Main Guest Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">{t.detailsPage.firstName}</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={bookingInfo.mainGuest.firstName}
                      onChange={handleMainGuestChange}
                      className={formErrors.firstName ? "border-red-500" : ""}
                    />
                    {formErrors.firstName && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">{t.detailsPage.lastName}</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={bookingInfo.mainGuest.lastName}
                      onChange={handleMainGuestChange}
                      className={formErrors.lastName ? "border-red-500" : ""}
                    />
                    {formErrors.lastName && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.lastName}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">{t.detailsPage.email}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={bookingInfo.mainGuest.email}
                      onChange={handleMainGuestChange}
                      className={formErrors.email ? "border-red-500" : ""}
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="phone">{t.detailsPage.phoneNumber}*</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={bookingInfo.mainGuest.phone}
                      onChange={handleMainGuestChange}
                      className={formErrors.phone ? "border-red-500" : ""}
                    />
                    {formErrors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">{t.detailsPage.address}</Label>
                  <Input
                    id="address"
                    name="address"
                    value={bookingInfo.mainGuest.address || ""}
                    onChange={handleMainGuestChange}
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">{t.detailsPage.city}</Label>
                    <Input
                      id="city"
                      name="city"
                      value={bookingInfo.mainGuest.city || ""}
                      onChange={handleMainGuestChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">
                      {t.detailsPage.postalCode}
                    </Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={bookingInfo.mainGuest.postalCode || ""}
                      onChange={handleMainGuestChange}
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <Label htmlFor="country">{t.detailsPage.country}</Label>
                    <Input
                      id="country"
                      name="country"
                      value={bookingInfo.mainGuest.country || ""}
                      onChange={handleMainGuestChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Room Guests Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {Object.entries(selectedRooms).map(([roomIndex, room]) => {
                  const roomIdx = Number.parseInt(roomIndex);
                  const roomConfig = roomConfigurations[roomIdx];
                  const totalGuests =
                    roomConfig.Adult + (roomConfig.Child?.length || 0);

                  return (
                    <Card key={roomIndex} className="p-4">
                      <CardHeader className="p-0 pb-4">
                        <CardTitle className="text-lg">
                          {t.detailsPage.room} {Number.parseInt(roomIndex) + 1}:{" "}
                          {room.Name}
                        </CardTitle>
                        <CardDescription>
                          {roomConfig.Adult} {t.detailsPage.adults}
                          {roomConfig.Child &&
                            roomConfig.Child.length > 0 &&
                            `, ${roomConfig.Child.length} ${t.detailsPage.children}`}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-0 space-y-4">
                        <Accordion
                          type="single"
                          collapsible
                          defaultValue="guest-0"
                        >
                          {Array.from({ length: totalGuests }).map(
                            (_, guestIndex) => {
                              const isChild = guestIndex >= roomConfig.Adult;
                              const childIndex = isChild
                                ? guestIndex - roomConfig.Adult
                                : -1;
                              const childAge =
                                isChild && roomConfig.Child
                                  ? roomConfig.Child[childIndex]
                                  : null;

                              const guestInfo = bookingInfo.roomGuests[
                                roomIdx
                              ]?.[guestIndex] || {
                                firstName: "",
                                lastName: "",
                                email: "",
                                phone: "",
                              };

                              return (
                                <AccordionItem
                                  key={guestIndex}
                                  value={`guest-${guestIndex}`}
                                >
                                  <AccordionTrigger className="py-2">
                                    <span>
                                      {isChild
                                        ? `Child ${childIndex + 1}`
                                        : `Adult ${guestIndex + 1}`}
                                      {isChild
                                        ? ` (${childAge} years old)`
                                        : ""}
                                      {guestIndex === 0
                                        ? " - Primary Guest"
                                        : ""}
                                    </span>
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                                      <div>
                                        <Label
                                          htmlFor={`guest-${roomIdx}-${guestIndex}-firstName`}
                                        >
                                          {t.detailsPage.firstName}
                                        </Label>
                                        <Input
                                          id={`guest-${roomIdx}-${guestIndex}-firstName`}
                                          value={guestInfo.firstName}
                                          onChange={(e) =>
                                            handleRoomGuestChange(
                                              roomIdx,
                                              guestIndex,
                                              "firstName",
                                              e.target.value
                                            )
                                          }
                                          className={
                                            formErrors[
                                              `room_${roomIdx}_guest_${guestIndex}_firstName`
                                            ]
                                              ? "border-red-500"
                                              : ""
                                          }
                                        />
                                        {formErrors[
                                          `room_${roomIdx}_guest_${guestIndex}_firstName`
                                        ] && (
                                            <p className="text-red-500 text-xs mt-1">
                                              {
                                                formErrors[
                                                `room_${roomIdx}_guest_${guestIndex}_firstName`
                                                ]
                                              }
                                            </p>
                                          )}
                                      </div>
                                      <div>
                                        <Label
                                          htmlFor={`guest-${roomIdx}-${guestIndex}-lastName`}
                                        >
                                          {t.detailsPage.lastName}
                                        </Label>
                                        <Input
                                          id={`guest-${roomIdx}-${guestIndex}-lastName`}
                                          value={guestInfo.lastName}
                                          onChange={(e) =>
                                            handleRoomGuestChange(
                                              roomIdx,
                                              guestIndex,
                                              "lastName",
                                              e.target.value
                                            )
                                          }
                                          className={
                                            formErrors[
                                              `room_${roomIdx}_guest_${guestIndex}_lastName`
                                            ]
                                              ? "border-red-500"
                                              : ""
                                          }
                                        />
                                        {formErrors[
                                          `room_${roomIdx}_guest_${guestIndex}_lastName`
                                        ] && (
                                            <p className="text-red-500 text-xs mt-1">
                                              {
                                                formErrors[
                                                `room_${roomIdx}_guest_${guestIndex}_lastName`
                                                ]
                                              }
                                            </p>
                                          )}
                                      </div>
                                    </div>
                                    {!isChild && (
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                                        <div>
                                          <Label
                                            htmlFor={`guest-${roomIdx}-${guestIndex}-email`}
                                          >
                                            {t.detailsPage.email}
                                          </Label>
                                          <Input
                                            id={`guest-${roomIdx}-${guestIndex}-email`}
                                            type="email"
                                            value={guestInfo.email}
                                            onChange={(e) =>
                                              handleRoomGuestChange(
                                                roomIdx,
                                                guestIndex,
                                                "email",
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                        <div>
                                          <Label
                                            htmlFor={`guest-${roomIdx}-${guestIndex}-phone`}
                                          >
                                            {t.detailsPage.phoneNumber}
                                          </Label>
                                          <Input
                                            id={`guest-${roomIdx}-${guestIndex}-phone`}
                                            value={guestInfo.phone}
                                            onChange={(e) =>
                                              handleRoomGuestChange(
                                                roomIdx,
                                                guestIndex,
                                                "phone",
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </AccordionContent>
                                </AccordionItem>
                              );
                            }
                          )}
                        </Accordion>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Step 3: Payment and Confirmation */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t.detailsPage.bookingSummary}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{hotelDetail.Name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {dateRange.checkIn &&
                            format(dateRange.checkIn, "MMM d")}{" "}
                          -{" "}
                          {dateRange.checkOut &&
                            format(dateRange.checkOut, "MMM d, yyyy")}{" "}
                          ({stayDuration}{" "}
                          {stayDuration === 1
                            ? t.detailsPage.night
                            : t.detailsPage.nights}
                          )
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedBoarding &&
                            bookingData?.Price.Boarding.find(
                              (b) => b.Code === selectedBoarding
                            )?.Name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {Object.keys(selectedRooms).length}{" "}
                          {Object.keys(selectedRooms).length === 1
                            ? t.detailsPage.room
                            : t.detailsPage.rooms}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {Object.entries(selectedRooms).map(([roomIndex, room]) => (
                      <div key={roomIndex} className="flex justify-between">
                        <span>
                          {t.detailsPage.room} {Number.parseInt(roomIndex) + 1}:{" "}
                          {room.Name}
                        </span>
                        <span className="font-medium">
                          {Number.parseFloat(room.Price).toFixed(3)}{" "}
                          {bookingData?.Currency}
                        </span>
                      </div>
                    ))}

                    <Separator />

                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>
                        {Object.values(selectedRooms)
                          .reduce(
                            (sum, room: any) =>
                              sum + Number.parseFloat(room.Price),
                            0
                          )
                          .toFixed(3)}{" "}
                        {bookingData?.Currency}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    {t.detailsPage.paymentMethod}
                  </h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialRequests">
                    {t.detailsPage.specialRequests}
                  </Label>
                  <Textarea
                    id="specialRequests"
                    placeholder="Any special requests or requirements?"
                    value={bookingInfo.specialRequests || ""}
                    onChange={(e) =>
                      setBookingInfo((prev) => ({
                        ...prev,
                        specialRequests: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="acceptTerms"
                    checked={bookingInfo.acceptTerms}
                    onCheckedChange={(checked) =>
                      setBookingInfo((prev) => ({
                        ...prev,
                        acceptTerms: checked === true,
                      }))
                    }
                    className={formErrors.acceptTerms ? "border-red-500" : ""}
                  />
                  <Label htmlFor="acceptTerms" className="text-sm">
                    {t.detailsPage.acceptTerms}
                  </Label>
                </div>
                {formErrors.acceptTerms && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.acceptTerms}
                  </p>
                )}
              </div>
            )}

            <DialogFooter className="mt-6 flex justify-between">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                >
                  {t.detailsPage.back}
                </Button>
              ) : (
                <div></div>
              )}
              {currentStep < 3 ? (
                <Button type="button" onClick={handleNextStep}>
                  {t.detailsPage.next}
                </Button>
              ) : (
                <Button type="button" onClick={handleBookingSubmit}>
                  {t.detailsPage.completeBooking}
                </Button>
              )}
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
      <ThankYouModal
        open={showModal}
        onClose={() => setShowModal(false)}
        bookingReference={referralCode}
      />
    </div>
  );
}
