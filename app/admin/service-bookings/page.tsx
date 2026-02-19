"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Edit,
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
  CreditCard,
  Phone,
  Mail,
  AlertCircle,
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

// Define the Booking type based on the Mongoose schema with separate payment logic
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
  status: "pending" | "confirmed" | "canceled" | "checked-in" | "checked-out";
  paymentStatus: "unpaid" | "partially_paid" | "paid";
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ServiceBookingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const { toast } = useToast();

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/booking/services");

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();
        setBookings(data.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load bookings",
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
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        booking.customer.firstName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        booking.customer.lastName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        booking.customer.email
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || booking.status === statusFilter;
      const matchesPaymentStatus =
        paymentStatusFilter === "all" ||
        booking.paymentStatus === paymentStatusFilter;
      const matchesServiceType =
        serviceTypeFilter === "all" ||
        booking.serviceType === serviceTypeFilter;

      const matchesDate = (() => {
        if (dateFilter === "all") return true;
        const now = new Date();
        const startDate = new Date(booking.startDate);

        switch (dateFilter) {
          case "upcoming":
            return startDate > now;
          case "current":
            const endDate = new Date(booking.endDate);
            return startDate <= now && endDate >= now;
          case "past":
            return new Date(booking.endDate) < now;
          default:
            return true;
        }
      })();

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPaymentStatus &&
        matchesServiceType &&
        matchesDate
      );
    })
    .sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case "createdAt":
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case "startDate":
          aValue = new Date(a.startDate);
          bValue = new Date(b.startDate);
          break;
        case "totalAmount":
          aValue = a.totalAmount;
          bValue = b.totalAmount;
          break;
        case "customer":
          aValue = `${a.customer.firstName} ${a.customer.lastName}`;
          bValue = `${b.customer.firstName} ${b.customer.lastName}`;
          break;
        case "serviceName":
          aValue = a.serviceName;
          bValue = b.serviceName;
          break;
        default:
          aValue = a.bookingReference;
          bValue = b.bookingReference;
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
      const response = await fetch(`/api/booking/services/${bookingToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete booking");
      }

      // Remove the deleted booking from the state
      setBookings(
        bookings.filter((booking) => booking._id !== bookingToDelete)
      );

      toast({
        title: "Success",
        description: "Booking deleted successfully",
      });
    } catch (err) {
      console.error("Error deleting booking:", err);
      toast({
        title: "Error",
        description: "Failed to delete booking",
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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
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

  // Format price for display
  const formatPrice = (price: number, currency: string) => {
    return `${currency} ${price.toFixed(2)}`;
  };

  // Calculate duration in days
  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
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
      case "checked-in":
        return "bg-lta-purple/10 text-lta-purple hover:bg-lta-purple/20";
      case "checked-out":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100 hover:text-purple-800";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800";
    }
  };

  // Get payment status badge color
  const getPaymentStatusBadgeClass = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "paid":
        return "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800";
      case "partially_paid":
        return "bg-lta-purple/10 text-lta-purple hover:bg-lta-purple/20";
      case "unpaid":
        return "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800";
    }
  };

  // Get service type icon
  const getServiceTypeIcon = (serviceType: string) => {
    switch (serviceType.toLowerCase()) {
      case "tour":
        return <MapPin className="h-4 w-4" />;
      case "transport":
        return <Calendar className="h-4 w-4" />;
      case "activity":
        return <Users className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // Get unique service types for filter
  const getUniqueServiceTypes = () => {
    const types = [...new Set(bookings.map((booking) => booking.serviceType))];
    return types.sort();
  };

  // Get booking statistics
  const getBookingStats = () => {
    const total = bookings.length;
    const pending = bookings.filter((b) => b.status === "pending").length;
    const confirmed = bookings.filter((b) => b.status === "confirmed").length;
    const canceled = bookings.filter((b) => b.status === "canceled").length;
    const checkedIn = bookings.filter((b) => b.status === "checked-in").length;
    const checkedOut = bookings.filter(
      (b) => b.status === "checked-out"
    ).length;

    const totalRevenue = bookings.reduce(
      (sum, booking) => sum + booking.totalAmount,
      0
    );
    const paidRevenue = bookings.reduce(
      (sum, booking) => sum + booking.paidAmount,
      0
    );
    const pendingRevenue = bookings.reduce(
      (sum, booking) => sum + booking.remainingAmount,
      0
    );

    const unpaid = bookings.filter((b) => b.paymentStatus === "unpaid").length;
    const partiallyPaid = bookings.filter(
      (b) => b.paymentStatus === "partially_paid"
    ).length;
    const paid = bookings.filter((b) => b.paymentStatus === "paid").length;

    return {
      total,
      pending,
      confirmed,
      canceled,
      checkedIn,
      checkedOut,
      totalRevenue,
      paidRevenue,
      pendingRevenue,
      unpaid,
      partiallyPaid,
      paid,
    };
  };

  const stats = getBookingStats();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Service Bookings</h1>
          <p className="text-muted-foreground">
            Manage and view all service bookings
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
            <FileText className="h-4 w-4 text-muted-foreground" />
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
              Payment Status
            </CardTitle>
            <CreditCard className="h-4 w-4 text-lta-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.paid}</div>
            <p className="text-xs text-muted-foreground">
              {stats.partiallyPaid} partial, {stats.unpaid} unpaid
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
                placeholder="Search by reference, customer name, email, or service..."
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
                  <SelectItem value="checked-in">Checked In</SelectItem>
                  <SelectItem value="checked-out">Checked Out</SelectItem>
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
                  <SelectItem value="partially_paid">Partially Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={serviceTypeFilter}
                onValueChange={setServiceTypeFilter}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Service Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  {getUniqueServiceTypes().map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
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
                  <SelectItem value="startDate">Start Date</SelectItem>
                  <SelectItem value="totalAmount">Amount</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="serviceName">Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bookings ({filteredBookings.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading && (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin" />
              <span className="ml-2 text-lg">Loading service bookings...</span>
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
                    <TableHead className="min-w-[200px]">
                      Service Details
                    </TableHead>
                    <TableHead className="min-w-[150px]">
                      Service Period
                    </TableHead>
                    <TableHead className="min-w-[120px]">
                      Participants
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
                        colSpan={9}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No service bookings found. Try adjusting your search or
                        filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBookings.map((booking) => (
                      <TableRow key={booking._id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <div className="font-mono text-sm">
                            {booking.bookingReference}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{`${booking.customer.firstName} ${booking.customer.lastName}`}</div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {booking.customer.email}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {booking.customer.phone}
                            </div>
                            {booking.customer.nationality && (
                              <div className="text-xs text-muted-foreground">
                                {booking.customer.nationality}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">
                              {booking.serviceName}
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              {getServiceTypeIcon(booking.serviceType)}
                              <span className="ml-1">
                                {booking.serviceType}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              ID: {booking.serviceId}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <CalendarDays className="h-3 w-3 mr-1" />
                              {formatDate(booking.startDate)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              to {formatDate(booking.endDate)}
                            </div>
                            <div className="text-xs text-lta-purple font-medium">
                              {calculateDuration(
                                booking.startDate,
                                booking.endDate
                              )}{" "}
                              days
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Users className="h-3 w-3 mr-1" />
                              {booking.adults} Adults
                            </div>
                            {booking.children > 0 && (
                              <div className="text-xs text-muted-foreground">
                                {booking.children} Children
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground">
                              Total: {booking.adults + booking.children}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm font-medium">
                              <DollarSign className="h-3 w-3 mr-1" />
                              {formatPrice(
                                booking.totalAmount,
                                booking.currency
                              )}
                            </div>
                            <div className="text-xs text-green-600">
                              Paid:{" "}
                              {formatPrice(
                                booking.paidAmount,
                                booking.currency
                              )}
                            </div>
                            {booking.remainingAmount > 0 && (
                              <div className="text-xs text-red-600">
                                Due:{" "}
                                {formatPrice(
                                  booking.remainingAmount,
                                  booking.currency
                                )}
                              </div>
                            )}
                            <Badge
                              className={getPaymentStatusBadgeClass(
                                booking.paymentStatus
                              )}
                              variant="outline"
                            >
                              {booking.paymentStatus
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
                            {formatDateTime(booking.createdAt)}
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
                                  href={`/admin/service-bookings/${booking._id}`}
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
              Are you sure you want to delete this service booking?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              service booking and remove it from our servers.
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
