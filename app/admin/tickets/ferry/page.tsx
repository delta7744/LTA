"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Trash2,
  Search,
  MoreHorizontal,
  RefreshCw,
  FileText,
  Calendar,
  Users,
  MapPin,
  DollarSign,
  Filter,
  Download,
  Eye,
  CalendarDays,
  Phone,
  Mail,
  AlertCircle,
  Ship,
  Anchor,
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

type TravelerType = "adult" | "child" | "infant1-2" | "infant<1" | "senior";
type ContactTitle = "mr" | "mrs" | "ms" | "dr";
type CrossingType = "one-way" | "round-trip" | "open-return";
type CabinType = "inside" | "outside" | "deluxe" | "suite" | "none";
type VehicleType = "none" | "car" | "suv" | "van" | "motorcycle" | "other";
type Status = "pending" | "confirmed" | "canceled" | "completed";
type PaymentStatus = "unpaid" | "partial" | "paid";

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
  totalPrice?: number;
  paymentStatus?: PaymentStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function FerryBookingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [bookings, setBookings] = useState<FerryBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [cabinTypeFilter, setCabinTypeFilter] = useState("all");
  const [crossingTypeFilter, setCrossingTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const { toast } = useToast();

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/booking/tickets/ferry");

        if (!response.ok) {
          throw new Error("Failed to fetch ferry bookings");
        }

        const data = await response.json();
        setBookings(data.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching ferry bookings:", err);
        setError("Failed to load ferry bookings. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load ferry bookings",
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
        booking.arrivalPort.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || booking.status === statusFilter;
      const matchesPaymentStatus =
        paymentStatusFilter === "all" ||
        booking.paymentStatus === paymentStatusFilter;
      const matchesCabinType =
        cabinTypeFilter === "all" || booking.cabinType === cabinTypeFilter;
      const matchesCrossingType =
        crossingTypeFilter === "all" ||
        booking.crossingType === crossingTypeFilter;

      const matchesDate = (() => {
        if (dateFilter === "all") return true;
        const now = new Date();
        const departureDate = new Date(booking.departureDate);

        switch (dateFilter) {
          case "upcoming":
            return departureDate > now;
          case "current":
            const returnDate = booking.returnDate
              ? new Date(booking.returnDate)
              : departureDate;
            return departureDate <= now && returnDate >= now;
          case "past":
            const endDate = booking.returnDate
              ? new Date(booking.returnDate)
              : departureDate;
            return endDate < now;
          default:
            return true;
        }
      })();

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPaymentStatus &&
        matchesCabinType &&
        matchesCrossingType &&
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
        `/api/booking/tickets/ferry/${bookingToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete ferry booking");
      }

      setBookings(
        bookings.filter((booking) => booking._id !== bookingToDelete)
      );

      toast({
        title: "Success",
        description: "Ferry booking deleted successfully",
      });
    } catch (err) {
      console.error("Error deleting ferry booking:", err);
      toast({
        title: "Error",
        description: "Failed to delete ferry booking",
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

  // Get crossing type display
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

  // Get cabin type display
  const getCabinTypeDisplay = (type: CabinType) => {
    switch (type) {
      case "inside":
        return "Inside";
      case "outside":
        return "Outside";
      case "deluxe":
        return "Deluxe";
      case "suite":
        return "Suite";
      case "none":
        return "No Cabin";
      default:
        return type;
    }
  };

  // Get unique values for filters
  const getUniquePorts = () => {
    const ports = new Set<string>();
    bookings.forEach((booking) => {
      ports.add(booking.departurePort);
      ports.add(booking.arrivalPort);
    });
    return Array.from(ports).sort();
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
            Ferry Bookings
          </h1>
          <p className="text-muted-foreground">
            Manage and view all ferry bookings and crossings
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
            <Ship className="h-4 w-4 text-muted-foreground" />
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
              Active Crossings
            </CardTitle>
            <Anchor className="h-4 w-4 text-lta-purple" />
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
                placeholder="Search by reference, customer name, email, or route..."
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
                value={cabinTypeFilter}
                onValueChange={setCabinTypeFilter}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Cabin Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cabins</SelectItem>
                  <SelectItem value="inside">Inside</SelectItem>
                  <SelectItem value="outside">Outside</SelectItem>
                  <SelectItem value="deluxe">Deluxe</SelectItem>
                  <SelectItem value="suite">Suite</SelectItem>
                  <SelectItem value="none">No Cabin</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={crossingTypeFilter}
                onValueChange={setCrossingTypeFilter}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Crossing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="one-way">One Way</SelectItem>
                  <SelectItem value="round-trip">Round Trip</SelectItem>
                  <SelectItem value="open-return">Open Return</SelectItem>
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
          <CardTitle>Ferry Bookings ({filteredBookings.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading && (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin" />
              <span className="ml-2 text-lg">Loading ferry bookings...</span>
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
                    <TableHead className="min-w-[250px]">
                      Route & Crossing
                    </TableHead>
                    <TableHead className="min-w-[150px]">
                      Travel Dates
                    </TableHead>
                    <TableHead className="min-w-[120px]">Travelers</TableHead>
                    <TableHead className="min-w-[150px]">
                      Accommodation
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
                        No ferry bookings found. Try adjusting your search or
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
                              <Anchor className="h-3 w-3 text-lta-purple" />
                              <span className="font-medium">
                                {booking.departurePort}
                              </span>
                              <ArrowRight className="h-3 w-3 text-muted-foreground" />
                              <span className="font-medium">
                                {booking.arrivalPort}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {getCrossingTypeDisplay(booking.crossingType)}
                            </div>
                            {booking.vehicleType &&
                              booking.vehicleType !== "none" && (
                                <div className="text-xs text-lta-purple capitalize">
                                  {booking.vehicleType}
                                </div>
                              )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <CalendarDays className="h-3 w-3 mr-1" />
                              {formatDate(booking.departureDate)}
                            </div>
                            {booking.returnDate && (
                              <div className="text-xs text-muted-foreground">
                                Return: {formatDate(booking.returnDate)}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Users className="h-3 w-3 mr-1" />
                            {booking.travellers.length} Travelers
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm font-medium">
                              {getCabinTypeDisplay(booking.cabinType)}
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
                                  href={`/admin/tickets/ferry/${booking._id}`}
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
              Are you sure you want to delete this ferry booking?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              ferry booking and remove it from our servers.
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
