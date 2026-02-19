"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Plus,
  ArrowUpRight,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock3,
  Plane,
  Bus,
  Train,
  Ship,
  MapPin,
  DollarSign,
  Compass,
  Briefcase,
  Palmtree,
  Mountain,
  Building,
  Wallet,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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

interface AdditionalActivity {
  activityName: string;
  description?: string;
  cost?: number;
  availability?: boolean;
  optional?: boolean;
}

interface Trip {
  _id: string;
  title: string;
  tripType: "cultural" | "adventure" | "beach";
  description: string;
  type: "organized" | "a_la_carte";
  transportType: "flight" | "bus" | "train" | "cruise";
  tripCategory: "adventure" | "cultural" | "luxury" | "budget";
  departureCity: string;
  destination: string;
  duration: string;
  departureDate: string;
  returnDate?: string;
  departureOptions: "go_only" | "go_and_back" | "customizable";
  includedServices: string[];
  notIncludedServices: string[];
  images: string[];
  brochure?: {
    name: string;
    content: string;
  };
  price: Array<{
    basePrice: number;
    discounts: number;
  }>;
  maxParticipants: number;
  travelerType: "adult" | "child" | "senior" | "any";
  itinerary: TripItinerary[];
  additionalActivities: AdditionalActivity[];
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

interface TripStats {
  totalTrips: number;
  activeTrips: number;
  upcomingTrips: number;
  soldOutTrips: number;
  archivedTrips: number;
  canceledTrips: number;
  averagePrice: number;
  averageDuration: string;
  topDestinations: { destination: string; count: number }[];
  recentTrips: Trip[];
  tripsByType: {
    cultural: number;
    adventure: number;
    beach: number;
  };
  tripsByCategory: {
    adventure: number;
    cultural: number;
    luxury: number;
    budget: number;
  };
  tripsByTransport: {
    flight: number;
    bus: number;
    train: number;
    cruise: number;
  };
}

export default function ToursDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<TripStats>({
    totalTrips: 0,
    activeTrips: 0,
    upcomingTrips: 0,
    soldOutTrips: 0,
    archivedTrips: 0,
    canceledTrips: 0,
    averagePrice: 0,
    averageDuration: "0",
    topDestinations: [],
    recentTrips: [],
    tripsByType: {
      cultural: 0,
      adventure: 0,
      beach: 0,
    },
    tripsByCategory: {
      adventure: 0,
      cultural: 0,
      luxury: 0,
      budget: 0,
    },
    tripsByTransport: {
      flight: 0,
      bus: 0,
      train: 0,
      cruise: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Fetch trips
        const response = await fetch("/api/tours");
        if (!response.ok) {
          throw new Error("Failed to fetch trips");
        }

        const tripsData = await response.json();
        const trips: Trip[] = tripsData.data || [];
        // Calculate trip statistics
        const activeTrips = trips.filter((t) => t.status === "active").length;
        const upcomingTrips = trips.filter(
          (t) => t.status === "upcoming"
        ).length;
        const soldOutTrips = trips.filter(
          (t) => t.status === "sold_out"
        ).length;
        const archivedTrips = trips.filter(
          (t) => t.status === "archived"
        ).length;
        const canceledTrips = trips.filter(
          (t) => t.status === "canceled"
        ).length;

        // Calculate average price
        let totalPrice = 0;
        trips.forEach((trip) => {
          if (trip.price && trip.price.length > 0) {
            totalPrice +=
              trip.price[0].basePrice - (trip.price[0].discounts || 0);
          }
        });
        const averagePrice =
          trips.length > 0 ? Math.round(totalPrice / trips.length) : 0;

        // Calculate average duration
        let totalDays = 0;
        trips.forEach((trip) => {
          if (typeof trip.duration === "number" && !isNaN(trip.duration)) {
            totalDays += trip.duration;
          }
        });
        const averageDuration =
          trips.length > 0
            ? `${Math.round(totalDays / trips.length)} days`
            : "0 days";

        // Calculate destination counts
        const destinationCounts: Record<string, number> = {};
        trips.forEach((trip) => {
          const destination = trip.destination;
          destinationCounts[destination] =
            (destinationCounts[destination] || 0) + 1;
        });

        const topDestinations = Object.entries(destinationCounts)
          .map(([destination, count]) => ({ destination, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        // Get recent trips
        const recentTrips = [...trips]
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 5);

        // Calculate trips by type
        const cultural = trips.filter((t) => t.tripType === "cultural").length;
        const adventure = trips.filter(
          (t) => t.tripType === "adventure"
        ).length;
        const beach = trips.filter((t) => t.tripType === "beach").length;

        // Calculate trips by category
        const adventureCategory = trips.filter(
          (t) => t.tripCategory === "adventure"
        ).length;
        const culturalCategory = trips.filter(
          (t) => t.tripCategory === "cultural"
        ).length;
        const luxury = trips.filter((t) => t.tripCategory === "luxury").length;
        const budget = trips.filter((t) => t.tripCategory === "budget").length;

        // Calculate trips by transport
        const flight = trips.filter((t) => t.transportType === "flight").length;
        const bus = trips.filter((t) => t.transportType === "bus").length;
        const train = trips.filter((t) => t.transportType === "train").length;
        const cruise = trips.filter((t) => t.transportType === "cruise").length;

        setStats({
          totalTrips: trips.length,
          activeTrips,
          upcomingTrips,
          soldOutTrips,
          archivedTrips,
          canceledTrips,
          averagePrice,
          averageDuration,
          topDestinations,
          recentTrips,
          tripsByType: {
            cultural,
            adventure,
            beach,
          },
          tripsByCategory: {
            adventure: adventureCategory,
            cultural: culturalCategory,
            luxury,
            budget,
          },
          tripsByTransport: {
            flight,
            bus,
            train,
            cruise,
          },
        });

        setError(null);
      } catch (err) {
        console.error("Error fetching trip statistics:", err);
        setError("Failed to load trip statistics. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load trip statistics",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [toast]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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
        return <Building className="h-4 w-4 mr-2 text-purple-500" />;
      case "adventure":
        return <Mountain className="h-4 w-4 mr-2 text-orange-500" />;
      case "beach":
        return <Palmtree className="h-4 w-4 mr-2 text-lta-purple" />;
      default:
        return <Compass className="h-4 w-4 mr-2 text-gray-500" />;
    }
  };

  // Get transport type icon
  const getTransportTypeIcon = (type: string) => {
    switch (type) {
      case "flight":
        return <Plane className="h-4 w-4 mr-2 text-lta-purple" />;
      case "bus":
        return <Bus className="h-4 w-4 mr-2 text-green-500" />;
      case "train":
        return <Train className="h-4 w-4 mr-2 text-red-500" />;
      case "cruise":
        return <Ship className="h-4 w-4 mr-2 text-purple-500" />;
      default:
        return <Compass className="h-4 w-4 mr-2 text-gray-500" />;
    }
  };

  // Get trip category icon
  const getTripCategoryIcon = (category: string) => {
    switch (category) {
      case "adventure":
        return <Mountain className="h-4 w-4 mr-2 text-orange-500" />;
      case "cultural":
        return <Building className="h-4 w-4 mr-2 text-purple-500" />;
      case "luxury":
        return <Briefcase className="h-4 w-4 mr-2 text-amber-500" />;
      case "budget":
        return <Wallet className="h-4 w-4 mr-2 text-green-500" />;
      default:
        return <Tag className="h-4 w-4 mr-2 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <RefreshCw className="h-8 w-8 animate-spin text-lta-purple" />
        <span className="ml-2 text-lg">Loading tour statistics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Tours Dashboard</h1>
        <Card>
          <CardContent className="p-6">
            <div className="bg-red-50 text-red-800 p-4 rounded-md">
              <p>{error}</p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tours Dashboard</h1>
        <Button
          className="bg-lta-purple hover:bg-lta-purple/90 text-white"
          asChild
        >
          <Link href="/admin/tours/add">
            <Plus className="mr-2 h-4 w-4" /> Add New Tour
          </Link>
        </Button>
      </div>

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Tours
                </CardTitle>
                <Compass className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalTrips}</div>
                <p className="text-xs text-muted-foreground">
                  All tours in the system
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Tours
                </CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeTrips}</div>
                <p className="text-xs text-muted-foreground">
                  {((stats.activeTrips / stats.totalTrips) * 100 || 0).toFixed(
                    1
                  )}
                  % of total tours
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg. Price
                </CardTitle>
                <DollarSign className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.averagePrice}</div>
                <p className="text-xs text-muted-foreground">
                  Average tour price
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg. Duration
                </CardTitle>
                <Calendar className="h-4 w-4 text-lta-purple" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.averageDuration}
                </div>
                <p className="text-xs text-muted-foreground">
                  Average tour length
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Tours</CardTitle>
                <CardDescription>
                  Latest tours added to the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stats.recentTrips.length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground">
                    No tours found
                  </p>
                ) : (
                  <div className="space-y-4">
                    {stats.recentTrips.map((trip) => (
                      <div
                        key={trip._id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-muted">
                              {getTripTypeIcon(trip.tripType)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{trip.title}</p>
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground">
                                {trip.departureCity} to {trip.destination}
                              </p>
                            </div>
                            <div className="flex items-center mt-1">
                              <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground">
                                {formatDate(trip.departureDate)} (
                                {trip.duration})
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusBadgeClass(trip.status)}>
                            {trip.status.charAt(0).toUpperCase() +
                              trip.status.slice(1).replace("_", " ")}
                          </Badge>
                          <div className="text-sm font-medium">
                            $
                            {trip.price && trip.price.length > 0
                              ? trip.price[0].basePrice -
                              (trip.price[0].discounts || 0)
                              : 0}
                          </div>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/tours/details/${trip._id}`}>
                              <ArrowUpRight className="h-4 w-4" />
                              <span className="sr-only">View details</span>
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/admin/tours/list">View All Tours</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Tour Status</CardTitle>
                <CardDescription>Distribution by tour status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-sm">Active</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        {stats.activeTrips}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        (
                        {(
                          (stats.activeTrips / stats.totalTrips) * 100 || 0
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{
                        width: `${(stats.activeTrips / stats.totalTrips) * 100 || 0
                          }%`,
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock3 className="h-4 w-4 mr-2 text-lta-purple" />
                      <span className="text-sm">Upcoming</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        {stats.upcomingTrips}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        (
                        {(
                          (stats.upcomingTrips / stats.totalTrips) * 100 || 0
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-lta-purple"
                      style={{
                        width: `${(stats.upcomingTrips / stats.totalTrips) * 100 || 0
                          }%`,
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-2 text-amber-500" />
                      <span className="text-sm">Sold Out</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        {stats.soldOutTrips}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        (
                        {(
                          (stats.soldOutTrips / stats.totalTrips) * 100 || 0
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-amber-500"
                      style={{
                        width: `${(stats.soldOutTrips / stats.totalTrips) * 100 || 0
                          }%`,
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <XCircle className="h-4 w-4 mr-2 text-red-500" />
                      <span className="text-sm">Canceled</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        {stats.canceledTrips}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        (
                        {(
                          (stats.canceledTrips / stats.totalTrips) * 100 || 0
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-red-500"
                      style={{
                        width: `${(stats.canceledTrips / stats.totalTrips) * 100 || 0
                          }%`,
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">Archived</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        {stats.archivedTrips}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        (
                        {(
                          (stats.archivedTrips / stats.totalTrips) * 100 || 0
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-gray-500"
                      style={{
                        width: `${(stats.archivedTrips / stats.totalTrips) * 100 || 0
                          }%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Destinations</CardTitle>
                <CardDescription>
                  Most popular tour destinations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stats.topDestinations.length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground">
                    No data available
                  </p>
                ) : (
                  <div className="space-y-4">
                    {stats.topDestinations.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                            {index + 1}
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium">
                              {item.destination}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.count} tours
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tour Types</CardTitle>
                <CardDescription>Distribution by tour type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2 text-purple-500" />
                      <span className="text-sm">Cultural</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        {stats.tripsByType.cultural}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        (
                        {(
                          (stats.tripsByType.cultural / stats.totalTrips) *
                          100 || 0
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-purple-500"
                      style={{
                        width: `${(stats.tripsByType.cultural / stats.totalTrips) *
                          100 || 0
                          }%`,
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Mountain className="h-4 w-4 mr-2 text-orange-500" />
                      <span className="text-sm">Adventure</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        {stats.tripsByType.adventure}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        (
                        {(
                          (stats.tripsByType.adventure / stats.totalTrips) *
                          100 || 0
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-orange-500"
                      style={{
                        width: `${(stats.tripsByType.adventure / stats.totalTrips) *
                          100 || 0
                          }%`,
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Palmtree className="h-4 w-4 mr-2 text-lta-purple" />
                      <span className="text-sm">Beach</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        {stats.tripsByType.beach}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        (
                        {(
                          (stats.tripsByType.beach / stats.totalTrips) * 100 ||
                          0
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-lta-purple"
                      style={{
                        width: `${(stats.tripsByType.beach / stats.totalTrips) * 100 ||
                          0
                          }%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Transport Types</CardTitle>
                <CardDescription>
                  Distribution by transport method
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Plane className="h-4 w-4 mr-2 text-lta-purple" />
                      <span className="text-sm">Flight</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        {stats.tripsByTransport.flight}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        (
                        {(
                          (stats.tripsByTransport.flight / stats.totalTrips) *
                          100 || 0
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-lta-purple"
                      style={{
                        width: `${(stats.tripsByTransport.flight / stats.totalTrips) *
                          100 || 0
                          }%`,
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Bus className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-sm">Bus</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        {stats.tripsByTransport.bus}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        (
                        {(
                          (stats.tripsByTransport.bus / stats.totalTrips) *
                          100 || 0
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{
                        width: `${(stats.tripsByTransport.bus / stats.totalTrips) *
                          100 || 0
                          }%`,
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Train className="h-4 w-4 mr-2 text-red-500" />
                      <span className="text-sm">Train</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        {stats.tripsByTransport.train}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        (
                        {(
                          (stats.tripsByTransport.train / stats.totalTrips) *
                          100 || 0
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-red-500"
                      style={{
                        width: `${(stats.tripsByTransport.train / stats.totalTrips) *
                          100 || 0
                          }%`,
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Ship className="h-4 w-4 mr-2 text-purple-500" />
                      <span className="text-sm">Cruise</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        {stats.tripsByTransport.cruise}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        (
                        {(
                          (stats.tripsByTransport.cruise / stats.totalTrips) *
                          100 || 0
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-purple-500"
                      style={{
                        width: `${(stats.tripsByTransport.cruise / stats.totalTrips) *
                          100 || 0
                          }%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tour Categories</CardTitle>
                <CardDescription>Distribution by tour category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Mountain className="h-4 w-4 mr-2 text-orange-500" />
                      <span className="text-sm">Adventure</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        {stats.tripsByCategory.adventure}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        (
                        {(
                          (stats.tripsByCategory.adventure / stats.totalTrips) *
                          100 || 0
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-orange-500"
                      style={{
                        width: `${(stats.tripsByCategory.adventure / stats.totalTrips) *
                          100 || 0
                          }%`,
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2 text-purple-500" />
                      <span className="text-sm">Cultural</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        {stats.tripsByCategory.cultural}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        (
                        {(
                          (stats.tripsByCategory.cultural / stats.totalTrips) *
                          100 || 0
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-purple-500"
                      style={{
                        width: `${(stats.tripsByCategory.cultural / stats.totalTrips) *
                          100 || 0
                          }%`,
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-amber-500" />
                      <span className="text-sm">Luxury</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        {stats.tripsByCategory.luxury}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        (
                        {(
                          (stats.tripsByCategory.luxury / stats.totalTrips) *
                          100 || 0
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-amber-500"
                      style={{
                        width: `${(stats.tripsByCategory.luxury / stats.totalTrips) *
                          100 || 0
                          }%`,
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Wallet className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-sm">Budget</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        {stats.tripsByCategory.budget}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        (
                        {(
                          (stats.tripsByCategory.budget / stats.totalTrips) *
                          100 || 0
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{
                        width: `${(stats.tripsByCategory.budget / stats.totalTrips) *
                          100 || 0
                          }%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
