"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Hotel,
  Compass,
  MapPin,
  Plane,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Download,
  Activity,
  Plus,
  Settings,
  Eye,
  Zap,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const [statsData, setStatsData] = useState(null);
  const [totalData, setTotalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all statistics
  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        setLoading(true);

        // Fetch both endpoints in parallel
        const [overviewResponse, totalResponse] = await Promise.all([
          fetch(`api/stat/overview`),
          fetch(`api/stat/total`),
        ]);

        if (!overviewResponse.ok || !totalResponse.ok) {
          throw new Error("Failed to fetch statistics");
        }

        const [overviewData, totalStatsData] = await Promise.all([
          overviewResponse.json(),
          totalResponse.json(),
        ]);

        setStatsData(overviewData);
        setTotalData(totalStatsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllStats();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-TN", {
      style: "currency",
      currency: "TND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value) => {
    if (value === 100) return "+100%";
    return value > 0 ? `+${value.toFixed(1)}%` : `${value.toFixed(1)}%`;
  };

  // Get trend icon
  const getTrendIcon = (change) => {
    if (change > 0) return <ArrowUp className="h-3 w-3 text-green-600" />;
    if (change < 0) return <ArrowDown className="h-3 w-3 text-red-600" />;
    return null;
  };

  // Get trend color
  const getTrendColor = (change) => {
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-muted-foreground";
  };

  // Loading skeleton for metric cards
  const MetricCardSkeleton = () => (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-20 mb-2" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8 p-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashbord</h1>
          <p className="text-muted-foreground">
            Manage and view all services
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              window.location.href = "/admin";
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-600 font-medium">
                Error loading statistics: {error}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </>
        ) : (
          <>
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-green-100">
                  Monthly Revenue
                </CardTitle>
                <div className="p-2 bg-white/20 rounded-lg">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">
                  {formatCurrency(statsData?.monthlyRevenue || 0)}
                </div>
                <p className="text-green-100 text-sm">Current month revenue</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-lta-purple to-lta-purple-light text-white">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/80">
                  Total Bookings
                </CardTitle>
                <div className="p-2 bg-white/20 rounded-lg">
                  <ShoppingCart className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">
                  {totalData?.totalCounts?.totalBookings ||
                    statsData?.keyMetrics?.totalBookings?.current ||
                    0}
                </div>
                <div className="flex items-center gap-1 text-white/80 text-sm">
                  {getTrendIcon(
                    statsData?.keyMetrics?.totalBookings?.change || 0
                  )}
                  <span>
                    {totalData?.recentActivity?.newBookings || 0} new this
                    period
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-500 to-violet-600 text-white">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-purple-100">
                  Hotel Bookings
                </CardTitle>
                <div className="p-2 bg-white/20 rounded-lg">
                  <Hotel className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">
                  {totalData?.totalCounts?.totalHotelBookings ||
                    statsData?.keyMetrics?.hotelBookings?.current ||
                    0}
                </div>
                <div className="flex items-center gap-1 text-purple-100 text-sm">
                  {getTrendIcon(
                    statsData?.keyMetrics?.hotelBookings?.change || 0
                  )}
                  <span>
                    {totalData?.recentActivity?.newHotelBookings || 0} new this
                    period
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-orange-500 to-red-500 text-white">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-orange-100">
                  Active Services
                </CardTitle>
                <div className="p-2 bg-white/20 rounded-lg">
                  <Compass className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">
                  {totalData?.summary?.totalServices || 4}
                </div>
                <p className="text-orange-100 text-sm">
                  Service types available
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Service Breakdown */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </>
        ) : (
          <>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Trips & Tours
                </CardTitle>
                <div className="p-2 bg-lta-purple/10 rounded-lg">
                  <Compass className="h-4 w-4 text-lta-purple" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {totalData?.totalCounts?.totalTrips || 0}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    +{totalData?.recentActivity?.newTrips || 0} new
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    this period
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Transportation
                </CardTitle>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Plane className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {(totalData?.totalCounts?.totalFlights || 0) +
                    (totalData?.totalCounts?.totalFerries || 0) +
                    (totalData?.totalCounts?.totalTransfers || 0)}
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div>Flights • Ferries • Transfers</div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Requests
                </CardTitle>
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Users className="h-4 w-4 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {totalData?.summary?.totalRequests || 0}
                </div>
                <p className="text-sm text-muted-foreground">
                  All service requests
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-lta-purple/10 rounded-lg">
                  <Activity className="h-5 w-5 text-lta-purple" />
                </div>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs">
                Last 30 days
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-12 rounded-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-lta-purple/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-lta-purple/10 rounded-full">
                        <ShoppingCart className="h-4 w-4 text-lta-purple" />
                      </div>
                      <span className="text-sm font-medium">New Bookings</span>
                    </div>
                    <Badge className="bg-lta-purple hover:bg-lta-purple/90">
                      +{totalData?.recentActivity?.newBookings || 0}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Hotel className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-sm font-medium">
                        Hotel Bookings
                      </span>
                    </div>
                    <Badge className="bg-green-500 hover:bg-green-500">
                      +{totalData?.recentActivity?.newHotelBookings || 0}
                    </Badge>
                  </div>


                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-full">
                        <Plane className="h-4 w-4 text-orange-600" />
                      </div>
                      <span className="text-sm font-medium">Transfers</span>
                    </div>
                    <Badge className="bg-orange-500 hover:bg-orange-500">
                      +{totalData?.recentActivity?.newTransfers || 0}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-lta-purple/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-lta-purple/10 rounded-full">
                        <Compass className="h-4 w-4 text-lta-purple" />
                      </div>
                      <span className="text-sm font-medium">Trips/Tours</span>
                    </div>
                    <Badge className="bg-lta-purple hover:bg-lta-purple/90">
                      +{totalData?.recentActivity?.newTrips || 0}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-full">
                        <Plane className="h-4 w-4 text-red-600" />
                      </div>
                      <span className="text-sm font-medium">
                        Ferry Requests
                      </span>
                    </div>
                    <Badge className="bg-red-500 hover:bg-red-500">
                      +{totalData?.recentActivity?.newFerries || 0}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 rounded-full">
                        <Plane className="h-4 w-4 text-yellow-600" />
                      </div>
                      <span className="text-sm font-medium">
                        Flight Requests
                      </span>
                    </div>
                    <Badge className="bg-yellow-500 hover:bg-yellow-500">
                      +{totalData?.recentActivity?.newFlights || 0}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-pink-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-pink-100 rounded-full">
                        <Plane className="h-4 w-4 text-pink-600" />
                      </div>
                      <span className="text-sm font-medium">
                        Transfer Requests
                      </span>
                    </div>
                    <Badge className="bg-pink-500 hover:bg-pink-500">
                      +{totalData?.recentActivity?.newTransfers || 0}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-lg">
          <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-gray-50">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Zap className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">

              <Button
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white justify-start gap-3 h-12"
                asChild
              >
                <Link href="/admin/tours/add">
                  <Plus className="h-4 w-4" />
                  Add New Tour
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12 hover:bg-lta-purple/5"
                asChild
              >
                <Link href="/admin/tickets/ferry">
                  <Settings className="h-4 w-4" />
                  Manage ferry requests
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12 hover:bg-lta-purple/5"
                asChild
              >
                <Link href="/admin/tickets/flights">
                  <Settings className="h-4 w-4" />
                  Manage flights requests
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12 hover:bg-green-50"
                asChild
              >
                <Link href="/admin/tours/">
                  <Settings className="h-4 w-4" />
                  Manage Tours
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12 hover:bg-purple-50"
                asChild
              >
                <Link href="/admin/transfer">
                  <Eye className="h-4 w-4" />
                  View Transfer requests
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12 hover:bg-orange-50"
                asChild
              >
                <Link href="/admin/hotels-bookings">
                  <Hotel className="h-4 w-4" />
                  Hotel Bookings
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12 hover:bg-lta-purple/5"
                asChild
              >
                <Link href="/admin/service-bookings">
                  <Compass className="h-4 w-4" />
                  Service Bookings
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
