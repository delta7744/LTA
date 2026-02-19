"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Users,
  Phone,
  Mail,
  CreditCard,
  Plane,
  User,
  Baby,
  RefreshCw,
  ArrowRight,
  Luggage,
  TicketIcon as Seat,
  Edit,
  DollarSign,
  CheckCircle,
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
import { Input } from "@/components/ui/input";

type FlightType = "one-way" | "round-trip" | "multi-city";
type Status = "pending" | "confirmed" | "canceled" | "completed";
type PaymentStatus = "unpaid" | "partial" | "paid";

interface Passenger {
  type: "adult" | "child" | "infant";
  firstName: string;
  lastName: string;
  dob: Date;
  passport?: string;
  nationality?: string;
}

interface FlightBooking {
  _id: string;
  crossingType: "one-way" | "round-trip" | "multi-city";
  departureDate: Date | string;
  departurePort: string;
  arrivalPort: string;
  class: "economy" | "premium-economy" | "business" | "first";
  airLine?: string;
  contactInfo: {
    title?: string;
    forename: string;
    name: string;
    email: string;
    telephone: string;
  };
  travellers: {
    type: "adult" | "child" | "infant";
    firstName: string;
    lastName: string;
    dob: Date | string;
    passport?: string;
  }[];
  observations?: string;
  status: "pending" | "confirmed" | "canceled" | "completed";
  bookingStatus?: string;
  bookingReference?: string;
  totalPrice?: number;
  paymentStatus?: "unpaid" | "partial" | "paid";
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// Get passenger type icon
const getPassengerIcon = (type: string) => {
  switch (type) {
    case "adult":
      return <User className="h-4 w-4" />;
    case "child":
      return <User className="h-3 w-3" />;
    case "infant":
      return <Baby className="h-4 w-4" />;
    default:
      return <User className="h-4 w-4" />;
  }
};

// Get cabin class display
const getCabinClassDisplay = (cabinClass: string) => {
  switch (cabinClass) {
    case "economy":
      return "Economy Class";
    case "premium-economy":
      return "Premium Economy";
    case "business":
      return "Business Class";
    case "first":
      return "First Class";
    default:
      return cabinClass;
  }
};

// Get flight type display
const getFlightTypeDisplay = (flightType: FlightType) => {
  switch (flightType) {
    case "one-way":
      return "One Way";
    case "round-trip":
      return "Round Trip";
    case "multi-city":
      return "Multi City";
    default:
      return flightType;
  }
};

// Get crossing type display
const getCrossingTypeDisplay = (crossingType: FlightType) => {
  switch (crossingType) {
    case "one-way":
      return "One Way";
    case "round-trip":
      return "Round Trip";
    case "multi-city":
      return "Multi City";
    default:
      return crossingType;
  }
};

export default function FlightBookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [booking, setBooking] = useState<FlightBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Status update dialog state
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<Status>("pending");
  const [newPaymentStatus, setNewPaymentStatus] =
    useState<PaymentStatus>("unpaid");
  const [newTotalPrice, setNewTotalPrice] = useState<number>(0);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/booking/tickets/flight/${params.id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch booking details");
        }

        const data = await response.json();
        setBooking(data.data);

        // Initialize form values with current booking data
        if (data.data) {
          setNewStatus(data.data.status);
          setNewPaymentStatus(data.data.paymentStatus || "unpaid");
          setNewTotalPrice(data.data.totalPrice || 0);
        }

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
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format time for display
  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format date and time for display
  const formatDateTime = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800";
    }
  };

  // Get payment status badge color
  const getPaymentStatusBadgeClass = (status: PaymentStatus) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800";
      case "unpaid":
        return "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800";
    }
  };

  // Handle total price change
  const handleTotalPriceChange = (value: string) => {
    const price = Number.parseFloat(value);
    if (isNaN(price) || price < 0) {
      setNewTotalPrice(0);
      return;
    }
    setNewTotalPrice(price);
  };

  // Handle status update
  const handleUpdateStatus = async () => {
    if (!booking) return;

    setIsUpdatingStatus(true);

    try {
      const response = await fetch(
        `/api/booking/tickets/flight/${booking._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
            paymentStatus: newPaymentStatus,
            totalPrice: newTotalPrice,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update booking status");
      }

      const data = await response.json();

      // Update local booking state
      setBooking({
        ...booking,
        status: newStatus,
        paymentStatus: newPaymentStatus,
        totalPrice: newTotalPrice,
        updatedAt: new Date(),
      });

      setIsStatusDialogOpen(false);

      toast({
        title: "Success",
        description: "Booking details updated successfully",
        variant: "default",
      });
    } catch (err) {
      console.error("Error updating booking status:", err);
      toast({
        title: "Error",
        description: "Failed to update booking details",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-lg">Loading booking details...</span>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
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
            <h1 className="text-3xl font-bold">Flight Booking Details</h1>
            <p className="text-muted-foreground">{booking.bookingReference}</p>
          </div>
        </div>

        <Button variant="outline" onClick={() => setIsStatusDialogOpen(true)}>
          <Edit className="mr-2 h-4 w-4" />
          Update Booking
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Flight Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5" />
                Flight Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Flight Details */}
              <div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {booking.departurePort}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatTime(booking.departureDate)}
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <ArrowRight className="h-6 w-6 text-lta-purple" />
                        <div className="text-xs text-muted-foreground">
                          One Way
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {booking.arrivalPort}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {/* No arrival time in data */}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Date:</span>{" "}
                      {formatDate(booking.departureDate)}
                    </div>
                    {booking.airLine && (
                      <div>
                        <span className="font-medium">Airline:</span>{" "}
                        {booking.airLine}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Flight Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Flight Type:</span>{" "}
                  {getCrossingTypeDisplay(booking.crossingType)}
                </div>
                <div>
                  <span className="font-medium">Cabin Class:</span>{" "}
                  {getCabinClassDisplay(booking.class)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Passengers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Passengers ({booking.travellers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {booking.travellers.map((traveller, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getPassengerIcon(traveller.type)}
                      <div>
                        <p className="font-medium">
                          {traveller.firstName} {traveller.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {traveller.type}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>DOB: {formatDate(traveller.dob)}</p>
                      {traveller.passport && (
                        <p>Passport: {traveller.passport}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Services */}
          {(booking.observations || booking.bookingStatus) && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {booking.observations && (
                  <div className="flex items-start gap-2">
                    <Luggage className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Observations</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.observations}
                      </p>
                    </div>
                  </div>
                )}
                {booking.bookingStatus && (
                  <div className="flex items-start gap-2">
                    <Seat className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Booking Status</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.bookingStatus}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Special Requests */}
          {booking.observations && (
            <Card>
              <CardHeader>
                <CardTitle>Special Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{booking.observations}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">
                  {booking.contactInfo.title &&
                    `${booking.contactInfo.title.toUpperCase()}. `}
                  {booking.contactInfo.forename} {booking.contactInfo.name}
                </h3>
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{booking.contactInfo.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {booking.contactInfo.telephone}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Total Price</p>
                <p className="text-2xl font-bold">
                  TND {booking.totalPrice?.toFixed(2) || "0.00"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium">Payment Status</p>
                <Badge
                  className={getPaymentStatusBadgeClass(
                    booking.paymentStatus || "unpaid"
                  )}
                >
                  {(booking.paymentStatus || "unpaid")
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </Badge>
              </div>

              {booking.paymentStatus !== "paid" && (
                <Button
                  className="w-full mt-2 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setNewStatus(booking.status);
                    setNewPaymentStatus("paid");
                    setNewTotalPrice(booking.totalPrice || 0);
                    setIsStatusDialogOpen(true);
                  }}
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  Mark as Paid
                </Button>
              )}
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
                <p className="text-sm font-medium">Status</p>
                <Badge className={getStatusBadgeClass(booking.status)}>
                  {booking.status
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </Badge>

                {booking.status !== "confirmed" && (
                  <Button
                    className="w-full mt-2 bg-lta-purple hover:bg-lta-purple/90"
                    onClick={() => {
                      setNewStatus("confirmed");
                      setNewPaymentStatus(booking.paymentStatus || "unpaid");
                      setNewTotalPrice(booking.totalPrice || 0);
                      setIsStatusDialogOpen(true);
                    }}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Confirm Booking
                  </Button>
                )}
              </div>
              {booking.createdAt && (
                <div>
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDateTime(booking.createdAt)}
                  </p>
                </div>
              )}
              {booking.updatedAt && (
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDateTime(booking.updatedAt)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Status Update Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Booking Details</DialogTitle>
            <DialogDescription>
              Update the status and payment information for booking{" "}
              {booking.bookingReference}
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
              <Select value={newStatus} onValueChange={(value) => setNewStatus(value as Status)}>
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

            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="paymentStatus"
                className="text-right text-sm font-medium"
              >
                Payment Status
              </label>
              <Select
                value={newPaymentStatus}
                onValueChange={(value) => setNewPaymentStatus(value as PaymentStatus)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="totalPrice"
                className="text-right text-sm font-medium"
              >
                Total Price
              </label>
              <div className="col-span-3 relative">
                <div className="absolute left-0 top-0 bottom-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500">TND</span>
                </div>
                <Input
                  id="totalPrice"
                  type="number"
                  className="pl-12"
                  value={newTotalPrice}
                  onChange={(e) => handleTotalPriceChange(e.target.value)}
                  min={0}
                  step={0.01}
                />
              </div>
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
              disabled={
                isUpdatingStatus ||
                (newStatus === booking.status &&
                  newPaymentStatus === booking.paymentStatus &&
                  newTotalPrice === booking.totalPrice)
              }
              className="bg-lta-purple hover:bg-lta-purple/90"
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
