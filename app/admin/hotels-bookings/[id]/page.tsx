"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {

  Edit,
  Calendar,
  Users,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Bed,
  Utensils,
  Wifi,
  Car,
  Tv,
  Snowflake,
  Shield,

  Check,
  X,
  AlertTriangle,
  Clock,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Define the Hotel Booking type (same as in the list page)
interface CancellationPolicy {
  Fees: string;
  Type: string;
  Nature: string;
  FromDate?: string;
}

interface Room {
  Id: number;
  Name: string;
  Photo?: string;
  Description?: string;
  Icones: string[];
  Quantity: number;
  Price: string;
  BasePrice?: string;
  StopReservation: boolean;
  OnRequest: boolean;
  CancellationPolicy: CancellationPolicy[];
}

interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

interface MainGuest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
}

interface HotelBooking {
  _id: string;
  hotel: string;
  hotelId: number;
  checkIn: string;
  checkOut: string;
  rooms: Map<string, Room>;
  boardingType: string;
  bookingInfo: {
    mainGuest: MainGuest;
    roomGuests: Map<string, GuestInfo[]>;
    specialRequests?: string;
    acceptTerms: boolean;
  };
  status: "pending" | "confirmed" | "canceled" | "completed";
  bookingReference: string;
  totalAmount?: number;
  createdAt: string;
  updatedAt: string;
}

// Helper function to convert Map from JSON
function convertMapsFromJSON(booking: any): HotelBooking {
  const roomsMap = new Map<string, Room>();
  if (booking.rooms && typeof booking.rooms === "object") {
    Object.entries(booking.rooms).forEach(([key, value]) => {
      roomsMap.set(key, value as Room);
    });
  }

  const roomGuestsMap = new Map<string, GuestInfo[]>();
  if (
    booking.bookingInfo?.roomGuests &&
    typeof booking.bookingInfo.roomGuests === "object"
  ) {
    Object.entries(booking.bookingInfo.roomGuests).forEach(([key, value]) => {
      roomGuestsMap.set(key, value as GuestInfo[]);
    });
  }

  return {
    ...booking,
    rooms: roomsMap,
    bookingInfo: {
      ...booking.bookingInfo,
      roomGuests: roomGuestsMap,
    },
  };
}

// Icon mapping for room amenities
const getAmenityIcon = (iconName: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    wifi: <Wifi className="h-4 w-4" />,
    ac: <Snowflake className="h-4 w-4" />,
    tv: <Tv className="h-4 w-4" />,
    fridge: <CreditCard className="h-4 w-4" />,
    safe: <Shield className="h-4 w-4" />,
    minibar: <Utensils className="h-4 w-4" />,
    parking: <Car className="h-4 w-4" />,
  };
  return iconMap[iconName] || <span className="text-xs">{iconName}</span>;
};

export default function HotelBookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [booking, setBooking] = useState<HotelBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Status editing state
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/booking/hotels/${params.id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch booking details");
        }

        const data = await response.json();
        const convertedBooking = convertMapsFromJSON(data.data);
        setBooking(convertedBooking);
        setNewStatus(convertedBooking.status);
        setError(null);
      } catch (err) {
        console.error("Error fetching booking details:", err);
        setError("Failed to load booking details. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load booking details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchBookingDetails();
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

  // Calculate number of nights
  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800";
      case "canceled":
        return "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800";
      case "completed":
        return "bg-lta-purple/10 text-lta-purple hover:bg-lta-purple/20";
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Check className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "canceled":
        return <X className="h-4 w-4" />;
      case "completed":
        return <Check className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  // Handle status update
  const handleUpdateStatus = async () => {
    if (!booking || newStatus === booking.status) {
      setIsStatusDialogOpen(false);
      return;
    }

    try {
      setIsUpdatingStatus(true);

      const response = await fetch(
        `/api/booking/hotels/${booking._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update booking status");
      }

      const data = await response.json();

      // Update local booking state
      setBooking({
        ...booking,
        status: newStatus as "pending" | "confirmed" | "canceled" | "completed",
        updatedAt: new Date().toISOString(),
      });

      toast({
        title: "Status Updated",
        description: `Booking status has been updated to ${newStatus}`,
        variant: "default",
      });
    } catch (err) {
      console.error("Error updating booking status:", err);
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingStatus(false);
      setIsStatusDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-lg">Loading Hotel Booking Details...</span>
      </div>

    );
  }

  if (error || !booking) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">

        </div>
        <div className="bg-red-50 text-red-800 p-4 rounded-md">
          <p>{error || "Booking not found"}</p>
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
            <h1 className="text-3xl font-bold">Booking Details</h1>
            <p className="text-muted-foreground">{booking.bookingReference}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusBadgeClass(booking.status)}>
            {booking.status
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </Badge>
          <Button variant="outline" onClick={() => setIsStatusDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Update Status
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hotel Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Hotel Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{booking.hotel}</h3>
                <p className="text-muted-foreground">
                  Hotel ID: {booking.hotelId}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Check-in</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(booking.checkIn)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Check-out</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(booking.checkOut)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Bed className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {calculateNights(booking.checkIn, booking.checkOut)} nights
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.boardingType}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Room Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bed className="h-5 w-5" />
                Room Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {Array.from(booking.rooms.entries()).map(([roomKey, room]) => (
                <div key={roomKey} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-semibold">{room.Name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Room ID: {room.Id}
                      </p>
                      {room.Description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {room.Description}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">${room.Price}</p>
                      {room.BasePrice && room.BasePrice !== room.Price && (
                        <p className="text-sm text-muted-foreground line-through">
                          ${room.BasePrice}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Quantity: {room.Quantity}
                      </p>
                    </div>
                  </div>

                  {/* Room Amenities */}
                  {room.Icones.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Amenities:</p>
                      <div className="flex flex-wrap gap-2">
                        {room.Icones.map((icon, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-xs"
                          >
                            {getAmenityIcon(icon)}
                            <span className="capitalize">{icon}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Room Status */}
                  <div className="flex gap-2 mb-4">
                    {room.OnRequest && (
                      <Badge variant="outline" className="text-xs">
                        On Request
                      </Badge>
                    )}
                    {room.StopReservation && (
                      <Badge variant="destructive" className="text-xs">
                        Reservation Stopped
                      </Badge>
                    )}
                  </div>

                  {/* Cancellation Policy */}
                  {room.CancellationPolicy.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">
                        Cancellation Policy:
                      </p>
                      <div className="space-y-2">
                        {room.CancellationPolicy.map((policy, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 p-2 rounded text-xs"
                          >
                            <p>
                              <strong>Fees:</strong> {policy.Fees}
                            </p>
                            <p>
                              <strong>Type:</strong> {policy.Type}
                            </p>
                            <p>
                              <strong>Nature:</strong> {policy.Nature}
                            </p>
                            {policy.FromDate && (
                              <p>
                                <strong>From Date:</strong> {policy.FromDate}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Room Guests */}
                  {booking.bookingInfo.roomGuests.has(roomKey) && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">
                        Guests in this room:
                      </p>
                      <div className="space-y-2">
                        {booking.bookingInfo.roomGuests
                          .get(roomKey)
                          ?.map((guest, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 text-sm"
                            >
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {guest.firstName} {guest.lastName}
                              </span>
                              <span className="text-muted-foreground">
                                ({guest.email})
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Main Guest Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Main Guest
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">
                  {booking.bookingInfo.mainGuest.firstName}{" "}
                  {booking.bookingInfo.mainGuest.lastName}
                </h3>
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {booking.bookingInfo.mainGuest.email}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {booking.bookingInfo.mainGuest.phone}
                  </span>
                </div>
                {booking.bookingInfo.mainGuest.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="text-sm">
                      <p>{booking.bookingInfo.mainGuest.address}</p>
                      {booking.bookingInfo.mainGuest.city && (
                        <p>{booking.bookingInfo.mainGuest.city}</p>
                      )}
                      {booking.bookingInfo.mainGuest.country && (
                        <p>{booking.bookingInfo.mainGuest.country}</p>
                      )}
                      {booking.bookingInfo.mainGuest.postalCode && (
                        <p>{booking.bookingInfo.mainGuest.postalCode}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Booking Information */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Reference</p>
                <p className="text-sm text-muted-foreground">
                  {booking.bookingReference}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Total Price</p>
                <p className="text-sm text-muted-foreground">
                  {booking?.totalAmount || "N/A"} TND
                </p>
              </div>

              <div>
                <p className="text-sm font-medium">Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getStatusBadgeClass(booking.status)}>
                    {getStatusIcon(booking.status)}
                    <span className="ml-1">
                      {booking.status
                        .split("-")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </span>
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setIsStatusDialogOpen(true)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm text-muted-foreground">
                  {formatDateTime(booking.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-sm text-muted-foreground">
                  {formatDateTime(booking.updatedAt)}
                </p>
              </div>
              {booking.bookingInfo.specialRequests && (
                <div>
                  <p className="text-sm font-medium">Special Requests</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.bookingInfo.specialRequests}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium">Terms Accepted</p>
                <p className="text-sm text-muted-foreground">
                  {booking.bookingInfo.acceptTerms ? "Yes" : "No"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Status Update Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Booking Status</DialogTitle>
            <DialogDescription>
              Change the status of booking {booking.bookingReference}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="status"
                className="text-right text-sm font-medium"
              >
                Status
              </label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsStatusDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={isUpdatingStatus || newStatus === booking.status}
            >
              {isUpdatingStatus && (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
