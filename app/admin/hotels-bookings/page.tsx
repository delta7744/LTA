"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Trash2,
  Search,
  MoreHorizontal,

  FileText,
  Users,
  MapPin,
  DollarSign,
  Filter,
  Download,
  RefreshCw,
  Eye,
  CalendarDays,
  Bed,
  Phone,
  Mail,
  AlertCircle,
  Utensils,
  Building,
  CreditCard,
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

// Define the Hotel Booking type based on the Mongoose schema
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
  totalAmount: number; // This is calculated automatically in the schema
  createdAt: string;
  updatedAt: string;
}

// Helper function to convert Map from JSON
function convertMapsFromJSON(booking: any): HotelBooking {
  // Convert rooms Map
  const roomsMap = new Map<string, Room>();
  if (booking.rooms && typeof booking.rooms === "object") {
    Object.entries(booking.rooms).forEach(([key, value]) => {
      roomsMap.set(key, value as Room);
    });
  }

  // Convert roomGuests Map
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

export default function HotelBookingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [bookings, setBookings] = useState<HotelBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [boardingTypeFilter, setBoardingTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const { toast } = useToast();

  // Fetch hotel bookings from API
  useEffect(() => {
    const fetchHotelBookings = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/booking/hotels");

        if (!response.ok) {
          throw new Error("Failed to fetch hotel bookings");
        }

        const { data } = await response.json();
        // Convert the JSON data to proper Map objects
        const convertedBookings = data.map(convertMapsFromJSON) || [];
        setBookings(convertedBookings);
        setError(null);
      } catch (err) {
        console.error("Error fetching hotel bookings:", err);
        setError("Failed to load hotel bookings. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load hotel bookings",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHotelBookings();
  }, [toast]);

  // Apply filters and search
  const filteredBookings = bookings
    .filter((booking) => {
      const matchesSearch =
        booking.bookingReference
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        booking.hotel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.bookingInfo.mainGuest.firstName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        booking.bookingInfo.mainGuest.lastName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        booking.bookingInfo.mainGuest.email
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || booking.status === statusFilter;
      const matchesBoardingType =
        boardingTypeFilter === "all" ||
        booking.boardingType === boardingTypeFilter;

      const matchesDate = (() => {
        if (dateFilter === "all") return true;
        const now = new Date();
        const checkInDate = new Date(booking.checkIn);

        switch (dateFilter) {
          case "upcoming":
            return checkInDate > now;
          case "current":
            const checkOutDate = new Date(booking.checkOut);
            return checkInDate <= now && checkOutDate >= now;
          case "past":
            return new Date(booking.checkOut) < now;
          default:
            return true;
        }
      })();

      return (
        matchesSearch && matchesStatus && matchesBoardingType && matchesDate
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
        case "checkIn":
          aValue = new Date(a.checkIn);
          bValue = new Date(b.checkIn);
          break;
        case "hotel":
          aValue = a.hotel;
          bValue = b.hotel;
          break;
        case "guest":
          aValue = `${a.bookingInfo.mainGuest.firstName} ${a.bookingInfo.mainGuest.lastName}`;
          bValue = `${b.bookingInfo.mainGuest.firstName} ${b.bookingInfo.mainGuest.lastName}`;
          break;
        case "totalAmount":
          aValue = a.totalAmount;
          bValue = b.totalAmount;
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
      const response = await fetch(`/api/booking/hotels/${bookingToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete hotel booking");
      }

      // Remove the deleted booking from the state
      setBookings(
        bookings.filter((booking) => booking._id !== bookingToDelete)
      );

      toast({
        title: "Success",
        description: "Hotel booking deleted successfully",
      });
    } catch (err) {
      console.error("Error deleting hotel booking:", err);
      toast({
        title: "Error",
        description: "Failed to delete hotel booking",
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
  const formatPrice = (price: number, currency = "TND") => {
    return `${currency} ${price.toFixed(2)}`;
  };

  // Calculate number of nights
  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Count total rooms
  const countTotalRooms = (rooms: Map<string, Room>) => {
    let total = 0;
    rooms.forEach((room) => {
      total += room.Quantity;
    });
    return total;
  };

  // Count total guests
  const countTotalGuests = (roomGuests: Map<string, GuestInfo[]>) => {
    let total = 0;
    roomGuests.forEach((guests) => {
      total += guests.length;
    });
    return total;
  };

  // Remove this function as totalAmount is calculated in the schema
  // const calculateTotalAmount = (rooms: Map<string, Room>) => {
  //   let total = 0
  //   rooms.forEach((room) => {
  //     total += Number.parseFloat(room.Price) * room.Quantity
  //   })
  //   return total
  // }

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

  // Get boarding type icon
  const getBoardingTypeIcon = (boardingType: string) => {
    switch (boardingType.toLowerCase()) {
      case "all inclusive":
        return <Utensils className="h-4 w-4" />;
      case "half board":
        return <Utensils className="h-4 w-4" />;
      case "full board":
        return <Utensils className="h-4 w-4" />;
      case "bed & breakfast":
        return <Utensils className="h-4 w-4" />;
      default:
        return <Building className="h-4 w-4" />;
    }
  };

  // Get unique boarding types for filter
  const getUniqueBoardingTypes = () => {
    const types = [...new Set(bookings.map((booking) => booking.boardingType))];
    return types.sort();
  };

  // Get booking statistics
  const getBookingStats = () => {
    const total = bookings.length;
    const pending = bookings.filter((b) => b.status === "pending").length;
    const confirmed = bookings.filter((b) => b.status === "confirmed").length;
    const canceled = bookings.filter((b) => b.status === "canceled").length;
    const completed = bookings.filter((b) => b.status === "completed").length;

    const totalRevenue = bookings.reduce(
      (sum, booking) => sum + booking.totalAmount,
      0
    );

    // Payment logic: completed = paid, others = unpaid
    const paidRevenue = bookings
      .filter((b) => b.status === "completed")
      .reduce((sum, booking) => sum + booking.totalAmount, 0);

    const pendingRevenue = bookings
      .filter((b) => b.status !== "completed" && b.status !== "canceled")
      .reduce((sum, booking) => sum + booking.totalAmount, 0);

    const paidBookings = bookings.filter(
      (b) => b.status === "completed"
    ).length;
    const unpaidBookings = bookings.filter(
      (b) => b.status !== "completed" && b.status !== "canceled"
    ).length;

    return {
      total,
      pending,
      confirmed,
      canceled,
      completed,
      totalRevenue,
      paidRevenue,
      pendingRevenue,
      paidBookings,
      unpaidBookings,
    };
  };

  const stats = getBookingStats();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Hotel Bookings</h1>
          <p className="text-muted-foreground">
            Manage and view all hotel bookings
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
            <div className="text-2xl font-bold">{stats.paidBookings}</div>
            <p className="text-xs text-muted-foreground">
              {stats.unpaidBookings} unpaid bookings
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
              From active bookings
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
                placeholder="Search by reference, hotel, or guest name..."
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
                value={boardingTypeFilter}
                onValueChange={setBoardingTypeFilter}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Boarding" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Boarding</SelectItem>
                  {getUniqueBoardingTypes().map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
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
                  <SelectItem value="checkIn">Check-in Date</SelectItem>
                  <SelectItem value="totalAmount">Amount</SelectItem>
                  <SelectItem value="hotel">Hotel Name</SelectItem>
                  <SelectItem value="guest">Guest Name</SelectItem>
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
              <span className="ml-2 text-lg">Loading Hotels Bookings...</span>
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
                      Guest Information
                    </TableHead>
                    <TableHead className="min-w-[200px]">
                      Hotel & Location
                    </TableHead>
                    <TableHead className="min-w-[150px]">Stay Period</TableHead>
                    <TableHead className="min-w-[120px]">
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
                        colSpan={9}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No hotel bookings found. Try adjusting your search or
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
                            <div className="font-medium">{`${booking.bookingInfo.mainGuest.firstName} ${booking.bookingInfo.mainGuest.lastName}`}</div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {booking.bookingInfo.mainGuest.email}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {booking.bookingInfo.mainGuest.phone}
                            </div>
                            {booking.bookingInfo.mainGuest.country && (
                              <div className="text-xs text-muted-foreground">
                                {booking.bookingInfo.mainGuest.country}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{booking.hotel}</div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              Hotel ID: {booking.hotelId}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center">
                              {getBoardingTypeIcon(booking.boardingType)}
                              <span className="ml-1">
                                {booking.boardingType}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <CalendarDays className="h-3 w-3 mr-1" />
                              {formatDate(booking.checkIn)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              to {formatDate(booking.checkOut)}
                            </div>
                            <div className="text-xs text-lta-purple font-medium">
                              {calculateNights(
                                booking.checkIn,
                                booking.checkOut
                              )}{" "}
                              nights
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Bed className="h-3 w-3 mr-1" />
                              {countTotalRooms(booking.rooms)} room
                              {countTotalRooms(booking.rooms) !== 1 ? "s" : ""}
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Users className="h-3 w-3 mr-1" />
                              {countTotalGuests(
                                booking.bookingInfo.roomGuests
                              )}{" "}
                              guest
                              {countTotalGuests(
                                booking.bookingInfo.roomGuests
                              ) !== 1
                                ? "s"
                                : ""}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm font-medium">
                              <DollarSign className="h-3 w-3 mr-1" />
                              TND {booking.totalAmount.toFixed(2)}
                            </div>
                            <div className="text-xs">
                              {booking.status === "completed" ? (
                                <span className="text-green-600 font-medium">
                                  ✓ Paid
                                </span>
                              ) : booking.status === "canceled" ? (
                                <span className="text-gray-500">Canceled</span>
                              ) : (
                                <span className="text-orange-600 font-medium">
                                  ⏳ Unpaid
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {booking.status === "completed"
                                ? "Payment completed"
                                : booking.status === "canceled"
                                  ? "No payment required"
                                  : "Payment pending"}
                            </div>
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
                                  href={`/admin/hotels-bookings/${booking._id}`}
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
              Are you sure you want to delete this hotel booking?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              hotel booking and remove it from our servers.
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
