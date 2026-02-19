"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Trash2,
  Search,
  MoreHorizontal,
  Users,
  DollarSign,
  Filter,
  RefreshCw,
  Eye,
  CalendarDays,
  Phone,
  Mail,
  AlertCircle,
  Plane,
  PlaneTakeoff,
  PlaneLanding,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type FlightType = "one-way" | "round-trip" | "multi-city";
type CabinClass = "economy" | "premium-economy" | "business" | "first";
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

interface ContactInfo {
  title?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
}

interface FlightSegment {
  departureAirport: string;
  arrivalAirport: string;
  departureDate: Date;
  arrivalDate: Date;
  airline?: string;
  flightNumber?: string;
  duration?: string;
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

export default function FlightBookingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [bookings, setBookings] = useState<FlightBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [cabinClassFilter, setCabinClassFilter] = useState("all");
  const [flightTypeFilter, setFlightTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const { toast } = useToast();

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/booking/tickets/flight");

        if (!response.ok) {
          throw new Error("Failed to fetch flight bookings");
        }

        const data = await response.json();
        setBookings(data.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching flight bookings:", err);
        setError("Failed to load flight bookings. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load flight bookings",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [toast]);

  // Apply filters and search
  const filteredBookings = bookings
    .filter((booking) => {
      const matchesSearch =
        booking.bookingReference
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        booking.contactInfo.forename
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        booking.contactInfo.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        booking.contactInfo.email
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        booking.departurePort
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        booking.arrivalPort.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.airLine?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || booking.status === statusFilter;
      const matchesPaymentStatus =
        paymentStatusFilter === "all" ||
        booking.paymentStatus === paymentStatusFilter;
      const matchesCabinClass =
        cabinClassFilter === "all" || booking.class === cabinClassFilter;
      const matchesFlightType =
        flightTypeFilter === "all" || booking.crossingType === flightTypeFilter;

      const matchesDate = (() => {
        if (dateFilter === "all") return true;
        const now = new Date();
        const departureDate = new Date(booking.departureDate);

        switch (dateFilter) {
          case "upcoming":
            return departureDate > now;
          case "current":
            // Since there's no return date, we'll assume the flight is current on the departure date
            return departureDate.toDateString() === now.toDateString();
          case "past":
            return departureDate < now;
          default:
            return true;
        }
      })();

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPaymentStatus &&
        matchesCabinClass &&
        matchesFlightType &&
        matchesDate
      );
    })
    .sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case "createdAt":
          aValue = new Date(a.createdAt || 0);
          bValue = new Date(b.createdAt || 0);
          break;
        case "departureDate":
          aValue = new Date(a.departureDate);
          bValue = new Date(b.departureDate);
          break;
        case "totalPrice":
          aValue = a.totalPrice || 0;
          bValue = b.totalPrice || 0;
          break;
        case "customer":
          aValue = `${a.contactInfo.forename} ${a.contactInfo.name}`;
          bValue = `${b.contactInfo.forename} ${b.contactInfo.name}`;
          break;
        case "route":
          aValue = `${a.departurePort} - ${a.arrivalPort}`;
          bValue = `${b.departurePort} - ${b.arrivalPort}`;
          break;
        default:
          aValue = a.bookingReference || "";
          bValue = b.bookingReference || "";
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleDeleteClick = (id: string) => {
    setBookingToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!bookingToDelete) return;

    try {
      setLoading(true);
      const response = await fetch(
        `/api/booking/tickets/flights/${bookingToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete flight booking");
      }

      setBookings(
        bookings.filter((booking) => booking._id !== bookingToDelete)
      );

      toast({
        title: "Success",
        description: "Flight booking deleted successfully",
      });
    } catch (err) {
      console.error("Error deleting flight booking:", err);
      toast({
        title: "Error",
        description: "Failed to delete flight booking",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setBookingToDelete(null);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  // Format date for display
  const formatDate = (dateString: Date | string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time for display
  const formatTime = (dateString: Date | string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format date and time for display
  const formatDateTime = (dateString: Date | string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return `TND ${price.toFixed(2)}`;
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
  const getPaymentStatusBadgeClass = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "paid":
        return "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800";
      case "partial":
        return "bg-lta-purple/10 text-lta-purple hover:bg-lta-purple/20";
      case "unpaid":
        return "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800";
    }
  };

  // Get cabin class display
  const getCabinClassDisplay = (cabinClass: string) => {
    switch (cabinClass) {
      case "economy":
        return "Economy";
      case "premium-economy":
        return "Premium Economy";
      case "business":
        return "Business";
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

  // Get booking statistics
  const getBookingStats = () => {
    const total = bookings.length;
    const pending = bookings.filter((b) => b.status === "pending").length;
    const confirmed = bookings.filter((b) => b.status === "confirmed").length;
    const canceled = bookings.filter((b) => b.status === "canceled").length;
    const completed = bookings.filter((b) => b.status === "completed").length;

    const totalRevenue = bookings.reduce(
      (sum, booking) => sum + (booking.totalPrice || 0),
      0
    );
    const paidBookings = bookings.filter((b) => b.paymentStatus === "paid");
    const paidRevenue = paidBookings.reduce(
      (sum, booking) => sum + (booking.totalPrice || 0),
      0
    );
    const pendingRevenue = totalRevenue - paidRevenue;

    const unpaid = bookings.filter((b) => b.paymentStatus === "unpaid").length;
    const partial = bookings.filter(
      (b) => b.paymentStatus === "partial"
    ).length;
    const paid = bookings.filter((b) => b.paymentStatus === "paid").length;

    return {
      total,
      pending,
      confirmed,
      canceled,
      completed,
      totalRevenue,
      paidRevenue,
      pendingRevenue,
      unpaid,
      partial,
      paid,
    };
  };

  const stats = getBookingStats();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            Flight Bookings
          </h1>
          <p className="text-muted-foreground">
            Manage and view all flight bookings and reservations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
            <Plane className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.confirmed} confirmed, {stats.pending} pending
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              TND {stats.totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.paidRevenue.toFixed(2)} collected
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Flights
            </CardTitle>
            <PlaneTakeoff className="h-4 w-4 text-lta-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.confirmed}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completed} completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Revenue
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              TND {stats.pendingRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Outstanding payments
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by reference, customer name, email, or flight details..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={paymentStatusFilter}
                onValueChange={setPaymentStatusFilter}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={cabinClassFilter}
                onValueChange={setCabinClassFilter}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Cabin Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="premium-economy">
                    Premium Economy
                  </SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="first">First Class</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={flightTypeFilter}
                onValueChange={setFlightTypeFilter}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Flight Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="one-way">One Way</SelectItem>
                  <SelectItem value="round-trip">Round Trip</SelectItem>
                  <SelectItem value="multi-city">Multi City</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="current">Current</SelectItem>
                  <SelectItem value="past">Past</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Created Date</SelectItem>
                  <SelectItem value="departureDate">Departure Date</SelectItem>
                  <SelectItem value="totalPrice">Price</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="route">Route</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Flight Bookings ({filteredBookings.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading && (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin" />
              <span className="ml-2 text-lg">Loading flight bookings...</span>
            </div>
          )}

          {error && !loading && (
            <div className="bg-red-50 text-red-800 p-4 rounded-md m-6">
              <p>{error}</p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          )}

          {!loading && !error && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px]">Reference</TableHead>
                    <TableHead className="min-w-[200px]">
                      Customer Information
                    </TableHead>
                    <TableHead className="min-w-[300px]">
                      Flight Details
                    </TableHead>
                    <TableHead className="min-w-[150px]">
                      Travel Dates
                    </TableHead>
                    <TableHead className="min-w-[120px]">Passengers</TableHead>
                    <TableHead className="min-w-[150px]">
                      Class & Type
                    </TableHead>
                    <TableHead className="min-w-[150px]">
                      Payment Details
                    </TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[100px]">Created</TableHead>
                    <TableHead className="text-right min-w-[80px]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={10}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No flight bookings found. Try adjusting your search or
                        filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBookings.map((booking) => (
                      <TableRow key={booking._id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <div className="font-mono text-sm">
                            {booking.bookingReference?.slice(0, 12)}...
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">
                              {booking.contactInfo.forename}{" "}
                              {booking.contactInfo.name}
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {booking.contactInfo.email}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {booking.contactInfo.telephone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <PlaneTakeoff className="h-3 w-3 text-lta-purple" />
                              <span className="font-medium">
                                {booking.departurePort}
                              </span>
                              <ArrowRight className="h-3 w-3 text-muted-foreground" />
                              <PlaneLanding className="h-3 w-3 text-green-600" />
                              <span className="font-medium">
                                {booking.arrivalPort}
                              </span>
                            </div>
                            {booking.airLine && (
                              <div className="text-sm text-muted-foreground">
                                {booking.airLine}
                              </div>
                            )}
                            <div className="text-xs text-lta-purple">
                              {getCrossingTypeDisplay(booking.crossingType)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <CalendarDays className="h-3 w-3 mr-1" />
                              {formatDate(booking.departureDate)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatTime(booking.departureDate)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Users className="h-3 w-3 mr-1" />
                            {booking.travellers.length} Passengers
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm font-medium">
                              {getCabinClassDisplay(booking.class)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {getFlightTypeDisplay(booking.crossingType)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm font-medium">
                              <DollarSign className="h-3 w-3 mr-1" />
                              {formatPrice(booking.totalPrice || 0)}
                            </div>
                            <Badge
                              className={getPaymentStatusBadgeClass(
                                booking.paymentStatus || "unpaid"
                              )}
                              variant="outline"
                            >
                              {(booking.paymentStatus || "unpaid")
                                .split("_")
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                )
                                .join(" ")}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getStatusBadgeClass(booking.status)}
                          >
                            {booking.status
                              .split("-")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatDateTime(booking.createdAt || new Date())}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/admin/tickets/flights/${booking._id}`}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteClick(booking._id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this flight booking?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              flight booking and remove it from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
