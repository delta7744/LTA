"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Calendar,
  Users,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  DollarSign,
  Clock,
  Check,
  X,
  AlertTriangle,
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
import { Input } from "@/components/ui/input";

// Define the Booking type based on the Mongoose schema
interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality?: string;
  passportNumber?: string;
  address?: string;
  contactPreference?: string;
}


interface Booking {
  _id: string;
  bookingReference: string;
  customer: Customer;
  serviceType: string;
  serviceId: string;
  serviceName: string;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  currency: string;
  status: "confirmed" | "pending" | "canceled" | "completed";
  paymentStatus: "unpaid" | "partially_paid" | "paid";
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ServiceBookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Status editing state
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const [newPaymentStatus, setNewPaymentStatus] = useState<string>("");
  const [newPaidAmount, setNewPaidAmount] = useState<number>(0);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/booking/services/${params.id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch booking details");
        }

        const data = await response.json();
        setBooking(data.data || null);
        if (data.data) {
          setNewStatus(data.data.status);
          setNewPaymentStatus(data.data.paymentStatus);
          setNewPaidAmount(data.data.paidAmount);
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
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800";
    }
  };

  // Get payment status badge color
  const getPaymentStatusBadgeClass = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800";
      case "partially_paid":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800";
      case "unpaid":
        return "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800";
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

  // Get payment status icon
  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <Check className="h-4 w-4" />;
      case "partially_paid":
        return <DollarSign className="h-4 w-4" />;
      case "unpaid":
        return <X className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  // Handle status update
  const handleUpdateStatus = async () => {
    if (!booking) {
      setIsStatusDialogOpen(false);
      return;
    }

    const hasChanges =
      newStatus !== booking.status ||
      newPaymentStatus !== booking.paymentStatus ||
      newPaidAmount !== booking.paidAmount;

    if (!hasChanges) {
      setIsStatusDialogOpen(false);
      return;
    }

    try {
      setIsUpdatingStatus(true);

      const response = await fetch(`/api/booking/services/${booking._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          paymentStatus: newPaymentStatus,
          paidAmount: newPaidAmount,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update booking status");
      }

      const data = await response.json();

      // Update local booking state
      setBooking({
        ...booking,
        status: newStatus as any,
        paymentStatus: newPaymentStatus as any,
        paidAmount: newPaidAmount,
        remainingAmount: booking.totalAmount - newPaidAmount,
        updatedAt: new Date().toISOString(),
      });

      toast({
        title: "Booking Updated",
        description: `Booking details have been successfully updated`,
        variant: "default",
      });
    } catch (err) {
      console.error("Error updating booking:", err);
      toast({
        title: "Error",
        description: "Failed to update booking details",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingStatus(false);
      setIsStatusDialogOpen(false);
    }
  };

  // Handle paid amount change
  const handlePaidAmountChange = (value: string) => {
    const amount = Number.parseFloat(value);
    if (isNaN(amount)) {
      setNewPaidAmount(0);
      return;
    }

    // Don't allow negative values or values greater than total amount
    if (booking && amount >= 0 && amount <= booking.totalAmount) {
      setNewPaidAmount(amount);

      // Auto-update payment status based on amount
      if (amount === 0) {
        setNewPaymentStatus("unpaid");
      } else if (amount === booking.totalAmount) {
        setNewPaymentStatus("paid");
      } else {
        setNewPaymentStatus("partially_paid");
      }
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
            <h1 className="text-3xl font-bold">Service Booking Details</h1>
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
            Update Booking
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Badge className="bg-lta-purple/10 text-lta-purple">
          {booking.serviceType.charAt(0).toUpperCase() +
            booking.serviceType.slice(1)}
        </Badge>
        <span className="text-sm text-muted-foreground">
          {booking.serviceName}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Service Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{booking.serviceName}</h3>
                <p className="text-muted-foreground">
                  Service Type: {booking.serviceType}
                </p>
                <p className="text-muted-foreground">
                  Service ID: {booking.serviceId}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Start Date</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(booking.startDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">End Date</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(booking.endDate)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {booking.adults} Adults, {booking.children} Children
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {calculateNights(booking.startDate, booking.endDate)} days
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">
                  {booking.customer.firstName} {booking.customer.lastName}
                </h3>
                {booking.customer.nationality && (
                  <p className="text-sm text-muted-foreground">
                    Nationality: {booking.customer.nationality}
                  </p>
                )}
                {booking.customer.passportNumber && (
                  <p className="text-sm text-muted-foreground">
                    Passport: {booking.customer.passportNumber}
                  </p>
                )}
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{booking.customer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{booking.customer.phone}</span>
                </div>
                {booking.customer.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="text-sm">
                      <p>{booking.customer.address}</p>
                    </div>
                  </div>
                )}
                {booking.customer.contactPreference && (
                  <div className="text-sm">
                    <span className="font-medium">
                      Preferred Contact Method:
                    </span>{" "}
                    {booking.customer.contactPreference}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Special Requests */}
          {booking.specialRequests && (
            <Card>
              <CardHeader>
                <CardTitle>Special Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{booking.specialRequests}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Reference</p>
                <p className="text-sm text-muted-foreground">
                  {booking.bookingReference}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium">Booking Status</p>
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
                </div>
              </div>

              <div>
                <p className="text-sm font-medium">Payment Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    className={getPaymentStatusBadgeClass(
                      booking.paymentStatus
                    )}
                  >
                    {getPaymentStatusIcon(booking.paymentStatus)}
                    <span className="ml-1">
                      {booking.paymentStatus
                        .split("_")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </span>
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-sm">Total Amount</span>
                <span className="font-semibold">
                  {booking.currency} {booking.totalAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Paid Amount</span>
                <span className="font-semibold text-green-600">
                  {booking.currency} {booking.paidAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Remaining Amount</span>
                <span className="font-semibold text-red-600">
                  {booking.currency} {booking.remainingAmount.toFixed(2)}
                </span>
              </div>

              <Separator />

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

            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="paymentStatus"
                className="text-right text-sm font-medium"
              >
                Payment Status
              </label>
              <Select
                value={newPaymentStatus}
                onValueChange={setNewPaymentStatus}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="partially_paid">Partially Paid</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="paidAmount"
                className="text-right text-sm font-medium"
              >
                Paid Amount
              </label>
              <div className="col-span-3 relative">
                <Input
                  id="paidAmount"
                  type="number"
                  className="pl-12"
                  value={newPaidAmount}
                  onChange={(e) => handlePaidAmountChange(e.target.value)}
                  min={0}
                  max={booking.totalAmount}
                  step={0.01}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  Total: {booking.currency} {booking.totalAmount.toFixed(2)}
                </div>
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
                  newPaidAmount === booking.paidAmount)
              }
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
