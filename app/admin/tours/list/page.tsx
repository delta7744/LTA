"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Edit,
  Trash2,
  Plus,
  Search,
  MoreHorizontal,
  Calendar,
  Eye,
  Building,
  Mountain,
  Palmtree,
  Plane,
  Bus,
  Train,
  Ship,
  ArrowUpDown,
  Users,
  DollarSign,
  Filter,
  Download,
  RefreshCw,
  MapPin,
  Clock,
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

interface TripActivity {
  activityName: string;
  activityTime?: string;
  description?: string;
  cost?: number;
}

interface TripItinerary {
  day: string;
  activities: TripActivity[];
  meals?: string;
  accommodation?: string;
}

interface Trip {
  _id: string;
  title: string;
  tripType: "cultural" | "adventure" | "beach";
  description: string;
  transportType: "flight" | "bus" | "train" | "cruise";
  transport: string;
  departureCity: string;
  destination: string;
  duration: string;
  departureDate: string;
  returnDate?: string;
  departureOptions: "go_only" | "go_and_back";
  includedServices: string[];
  excludedServices: string[];
  images: string[];
  price: number;
  tax: number;
  maxParticipants: number;
  travelerType: "adult" | "child" | "senior" | "any";
  itinerary: TripItinerary[];
  status: "active" | "sold_out" | "upcoming" | "archived" | "canceled";
  bookingConstraints?: {
    minBookingDays?: number;
    cancellationPolicy?: string;
  };
  createdBy?: string;
  handledBy?: string;
  createdAt: string;
  updatedAt: string;
}

export default function TripListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<string | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [typeFilter, setTypeFilter] = useState(
    searchParams.get("typeFilter") || "all"
  );
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("statusFilter") || "all"
  );
  const [transportFilter, setTransportFilter] = useState(
    searchParams.get("transportFilter") || "all"
  );
  const [dateFilter, setDateFilter] = useState("all");

  // Sorting
  const [sortField, setSortField] = useState(
    searchParams.get("sortBy") || "createdAt"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Fetch trips from API
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/tours");

        if (!response.ok) {
          throw new Error("Failed to fetch trips");
        }

        const data = await response.json();
        setTrips(data.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching trips:", err);
        setError("Failed to load trips. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load trips",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [toast]);

  // Apply filters and search
  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.departureCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "all" || trip.tripType === typeFilter;
    const matchesStatus =
      statusFilter === "all" || trip.status === statusFilter;
    const matchesTransport =
      transportFilter === "all" || trip.transportType === transportFilter;

    const matchesDate = (() => {
      if (dateFilter === "all") return true;
      const now = new Date();
      const departureDate = new Date(trip.departureDate);

      switch (dateFilter) {
        case "upcoming":
          return departureDate > now;
        case "current":
          const returnDate = trip.returnDate
            ? new Date(trip.returnDate)
            : departureDate;
          return departureDate <= now && returnDate >= now;
        case "past":
          const endDate = trip.returnDate
            ? new Date(trip.returnDate)
            : departureDate;
          return endDate < now;
        default:
          return true;
      }
    })();

    return (
      matchesSearch &&
      matchesType &&
      matchesStatus &&
      matchesTransport &&
      matchesDate
    );
  });

  // Apply sorting
  const sortedTrips = [...filteredTrips].sort((a, b) => {
    let valueA: any;
    let valueB: any;

    switch (sortField) {
      case "price":
        valueA = a.price + (a.tax || 0) || 0;
        valueB = b.price + (b.tax || 0) || 0;
        break;
      case "departureDate":
        valueA = new Date(a.departureDate).getTime();
        valueB = new Date(b.departureDate).getTime();
        break;
      case "title":
      case "departureCity":
      case "destination":
        valueA = a[sortField].toLowerCase();
        valueB = b[sortField].toLowerCase();
        break;
      case "createdAt":
        valueA = new Date(a.createdAt).getTime();
        valueB = new Date(b.createdAt).getTime();
        break;
      default:
        valueA = a[sortField as keyof Trip];
        valueB = b[sortField as keyof Trip];
    }

    if (sortDirection === "asc") {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  const handleDeleteClick = (id: string) => {
    setTripToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!tripToDelete) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/tours/private/${tripToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete trip");
      }

      setTrips(trips.filter((trip) => trip._id !== tripToDelete));

      toast({
        title: "Success",
        description: "Trip deleted successfully",
      });
    } catch (err) {
      console.error("Error deleting trip:", err);
      toast({
        title: "Error",
        description: "Failed to delete trip",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setTripToDelete(null);
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

  // Get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800";
      case "upcoming":
        return "bg-lta-purple/10 text-lta-purple hover:bg-lta-purple/20";
      case "sold_out":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100 hover:text-amber-800";
      case "archived":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800";
      case "canceled":
        return "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800";
    }
  };

  // Get trip type icon
  const getTripTypeIcon = (type: string) => {
    switch (type) {
      case "cultural":
        return <Building className="h-4 w-4" />;
      case "adventure":
        return <Mountain className="h-4 w-4" />;
      case "beach":
        return <Palmtree className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Get transport type icon
  const getTransportTypeIcon = (type: string) => {
    switch (type) {
      case "flight":
        return <Plane className="h-4 w-4" />;
      case "bus":
        return <Bus className="h-4 w-4" />;
      case "train":
        return <Train className="h-4 w-4" />;
      case "cruise":
        return <Ship className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Handle sort change
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Safely extract a numeric base price from either old (number) or new (TripPrice[]) schema
  const getPrice = (price: any): number => {
    if (typeof price === 'number') return price;
    if (Array.isArray(price) && price.length > 0) {
      const p = price[0];
      const base = Number(p?.basePrice ?? p?.price ?? 0);
      const discount = Number(p?.discounts ?? 0);
      return Math.max(0, base - discount);
    }
    return 0;
  };

  // Get trip statistics
  const getTripStats = () => {
    const total = trips.length;
    const active = trips.filter((t) => t.status === "active").length;
    const upcoming = trips.filter((t) => t.status === "upcoming").length;
    const soldOut = trips.filter((t) => t.status === "sold_out").length;

    const totalRevenue = trips.reduce(
      (sum, trip) => sum + (getPrice(trip.price) + Number(trip.tax || 0)),
      0
    );
    const activeRevenue = trips
      .filter((t) => t.status === "active")
      .reduce((sum, trip) => sum + (getPrice(trip.price) + Number(trip.tax || 0)), 0);

    return {
      total,
      active,
      upcoming,
      soldOut,
      totalRevenue: Number(totalRevenue) || 0,
      activeRevenue: Number(activeRevenue) || 0,
    };
  };

  const stats = getTripStats();

  // Helper to safely format currency numbers
  const formatCurrency = (value: any) => {
    const num = Number(value);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            Trip Management
          </h1>
          <p className="text-muted-foreground">
            Manage and view all trips and tour packages
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          <Button
            className="bg-lta-purple hover:bg-lta-purple/90 text-white"
            asChild
          >
            <Link href="/admin/tours/add">
              <Plus className="mr-2 h-4 w-4" /> Add New Trip
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
            <Mountain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.active} active, {stats.upcoming} upcoming
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Prices</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              TND {formatCurrency(stats.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(stats.activeRevenue)} from active trips
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Trips</CardTitle>
            <Building className="h-4 w-4 text-lta-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              {stats.soldOut} sold out
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Trips
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.upcoming}
            </div>
            <p className="text-xs text-muted-foreground">Starting soon</p>
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
                placeholder="Search by title, description, departure city, or destination..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Trip Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="adventure">Adventure</SelectItem>
                  <SelectItem value="beach">Beach</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="sold_out">Sold Out</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={transportFilter}
                onValueChange={setTransportFilter}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Transport" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Transport</SelectItem>
                  <SelectItem value="flight">Flight</SelectItem>
                  <SelectItem value="bus">Bus</SelectItem>
                  <SelectItem value="train">Train</SelectItem>
                  <SelectItem value="cruise">Cruise</SelectItem>
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
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trips ({filteredTrips.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading && (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin" />
              <span className="ml-2 text-lg">Loading trips...</span>
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
                    <TableHead className="min-w-[300px]">
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("title")}
                      >
                        Trip Details
                        {sortField === "title" && (
                          <ArrowUpDown
                            className="ml-2 h-4 w-4"
                            data-direction={sortDirection}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="min-w-[200px]">
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("departureCity")}
                      >
                        Route
                        {sortField === "departureCity" && (
                          <ArrowUpDown
                            className="ml-2 h-4 w-4"
                            data-direction={sortDirection}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="min-w-[150px]">
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("departureDate")}
                      >
                        Travel Dates
                        {sortField === "departureDate" && (
                          <ArrowUpDown
                            className="ml-2 h-4 w-4"
                            data-direction={sortDirection}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="min-w-[120px]">Duration</TableHead>
                    <TableHead className="min-w-[150px]">
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("price")}
                      >
                        Pricing
                        {sortField === "price" && (
                          <ArrowUpDown
                            className="ml-2 h-4 w-4"
                            data-direction={sortDirection}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[100px]">Created</TableHead>
                    <TableHead className="text-right min-w-[80px]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTrips.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No trips found. Try adjusting your search or filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedTrips.map((trip) => (
                      <TableRow key={trip._id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {getTripTypeIcon(trip.tripType)}
                              <span className="font-medium">{trip.title}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Users className="h-3 w-3" />
                              Max {trip.maxParticipants} participants
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {getTransportTypeIcon(trip.transportType)}
                              <span className="font-medium">
                                {trip.departureCity}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span>{trip.destination}</span>
                            </div>
                            <div className="text-xs text-lta-purple capitalize">
                              {trip.transportType}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(trip.departureDate)}
                            </div>
                            {trip.returnDate && (
                              <div className="text-xs text-muted-foreground">
                                Return: {formatDate(trip.returnDate)}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Clock className="h-3 w-3 mr-1" />
                            {trip.duration}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm font-medium">
                              <DollarSign className="h-3 w-3 mr-1" />
                              {formatCurrency(getPrice(trip.price) + Number(trip.tax || 0))} TND
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Base: {formatCurrency(getPrice(trip.price))}, Tax:{" "}
                              {formatCurrency(Number(trip.tax || 0))}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeClass(trip.status)}>
                            {trip.status.charAt(0).toUpperCase() +
                              trip.status.slice(1).replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatDateTime(trip.createdAt)}
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
                                <Link href={`/admin/tours/details/${trip._id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/tours/edit/${trip._id}`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Trip
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteClick(trip._id)}
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
              Are you sure you want to delete this trip?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              trip and remove it from our servers.
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
