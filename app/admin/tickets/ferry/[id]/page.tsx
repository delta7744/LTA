"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Calendar,
  Users,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Ship,
  Car,
  User,
  Baby,
  Shield,
  RefreshCw,
  ArrowRight,
  Anchor,
  Edit,
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

type TravelerType = "adult" | "child" | "infant1-2" | "infant<1" | "senior";
type ContactTitle = "mr" | "mrs" | "ms" | "dr";
type CrossingType = "one-way" | "round-trip" | "open-return";
type CabinType = "inside" | "outside" | "deluxe" | "suite" | "none";
type VehicleType = "none" | "car" | "suv" | "van" | "motorcycle" | "other";
type Status = "pending" | "confirmed" | "canceled" | "completed";
type PaymentStatus = "unpaid" | "paid";

interface Traveler {
  type: TravelerType;
  firstName: string;
  lastName: string;
  dob: Date;
  passport?: string;
}

interface ContactInfo {
  title?: ContactTitle;
  forename: string;
  name: string;
  email: string;
  telephone: string;
}

interface FerryBooking {
  _id: string;
  crossingType: CrossingType;
  departureDate: Date;
  returnDate?: Date;
  departurePort: string;
  arrivalPort: string;
  cabinType: CabinType;
  vehicleType?: VehicleType;
  contactInfo: ContactInfo;
  travellers: Traveler[];
  observations?: string;
  status: Status;
  bookingReference?: string;
  totalPrice?: number; // default 0
  paymentStatus?: PaymentStatus; // default "unpaid"
  createdAt?: Date; // auto-generated timestamp
  updatedAt?: Date; // auto-generated timestamp
}

// Get traveler type icon
const getTravelerIcon = (type: TravelerType) => {
  switch (type) {
    case "adult":
      return <User className="h-4 w-4" />;
    case "child":
      return <User className="h-3 w-3" />;
    case "infant1-2":
    case "infant<1":
      return <Baby className="h-4 w-4" />;
    case "senior":
      return <User className="h-4 w-4" />;
    default:
      return <User className="h-4 w-4" />;
  }
};

// Get vehicle type icon
const getVehicleIcon = (type: VehicleType) => {
  switch (type) {
    case "car":
    case "suv":
    case "van":
      return <Car className="h-4 w-4" />;
    case "motorcycle":
      return <Car className="h-4 w-4" />; // You could use a motorcycle icon if available
    default:
      return null;
  }
};

// Get cabin type display name
const getCabinTypeDisplay = (type: CabinType) => {
  switch (type) {
    case "inside":
      return "Inside Cabin";
    case "outside":
      return "Outside Cabin";
    case "deluxe":
      return "Deluxe Cabin";
    case "suite":
      return "Suite";
    case "none":
      return "No Cabin";
    default:
      return type;
  }
};

// Get crossing type display name
const getCrossingTypeDisplay = (type: CrossingType) => {
  switch (type) {
    case "one-way":
      return "One Way";
    case "round-trip":
      return "Round Trip";
    case "open-return":
      return "Open Return";
    default:
      return type;
  }
};

export default function FerryBookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [booking, setBooking] = useState<FerryBooking | null>(null);
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
        const response = await fetch(`/api/booking/tickets/ferry/${params.id}`);

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
        `/api/booking/tickets/ferry/${booking._id}`,
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
            <h1 className="text-3xl font-bold">Ferry Booking Details</h1>
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
          {/* Ferry Route Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ship className="h-5 w-5" />
                Ferry Route
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="flex items-center gap-2 mb-1">
                      <Anchor className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        From
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold">
                      {booking.departurePort}
                    </h3>
                  </div>
                  <ArrowRight className="h-6 w-6 text-lta-purple" />
                  <div className="text-center">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">To</span>
                    </div>
                    <h3 className="text-xl font-semibold">
                      {booking.arrivalPort}
                    </h3>
                  </div>
                </div>
                <Badge variant="outline">
                  {getCrossingTypeDisplay(booking.crossingType)}
                </Badge>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Departure Date</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(booking.departureDate)}
                    </p>
                  </div>
                </div>
                {booking.returnDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Return Date</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(booking.returnDate)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Accommodation & Vehicle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Accommodation & Vehicle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium mb-2">Cabin Type</p>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span>{getCabinTypeDisplay(booking.cabinType)}</span>
                  </div>
                </div>
                {booking.vehicleType && booking.vehicleType !== "none" && (
                  <div>
                    <p className="font-medium mb-2">Vehicle</p>
                    <div className="flex items-center gap-2">
                      {getVehicleIcon(booking.vehicleType)}
                      <span className="capitalize">{booking.vehicleType}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Travelers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Travelers ({booking.travellers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {booking.travellers.map((traveler, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getTravelerIcon(traveler.type)}
                      <div>
                        <p className="font-medium">
                          {traveler.firstName} {traveler.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {traveler.type.replace(/[<>]/g, "")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>DOB: {formatDate(traveler.dob)}</p>
                      {traveler.passport && (
                        <p>Passport: {traveler.passport}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Observations */}
          {booking.observations && (
            <Card>
              <CardHeader>
                <CardTitle>Special Requests & Observations</CardTitle>
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
                  {booking.totalPrice?.toFixed(2) || "0.00"} TND
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
