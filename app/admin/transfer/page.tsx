"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Calendar,
  Plus,
  ArrowUpRight,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock3,
  Luggage,
  Users,
  UserPlus,
  MapPin,
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

interface Transfer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  transferType: "baggage" | "family" | "group" | "other";
  region: string;
  destination: string;
  tripType: "one-way" | "round-trip";
  pickupAddress: string;
  dropoffAddress: string;
  preferredDate: string;
  specialRequests?: string;
  handledBy?: string;
  status: "pending" | "confirmed" | "canceled";
  createdAt: string;
  updatedAt: string;
}

interface TransferStats {
  total: number;
  pending: number;
  confirmed: number;
  canceled: number;
  byType: {
    baggage: number;
    family: number;
    group: number;
    other: number;
  };
  byTripType: {
    oneWay: number;
    roundTrip: number;
  };
  recentTransfers: Transfer[];
  topDestinations: { destination: string; count: number }[];
}

export default function TransferDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [stats, setStats] = useState<TransferStats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    canceled: 0,
    byType: {
      baggage: 0,
      family: 0,
      group: 0,
      other: 0,
    },
    byTripType: {
      oneWay: 0,
      roundTrip: 0,
    },
    recentTransfers: [],
    topDestinations: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Fetch all transfers to calculate stats
        const response = await fetch("/api/transfer");

        if (!response.ok) {
          throw new Error("Failed to fetch transfers");
        }

        const transfersData = await response.json();
        console.log(transfersData);
        const transfers: Transfer[] = transfersData.data || [];

        // Calculate statistics
        const pending = transfers.filter((t) => t.status === "pending").length;
        const confirmed = transfers.filter(
          (t) => t.status === "confirmed"
        ).length;
        const canceled = transfers.filter(
          (t) => t.status === "canceled"
        ).length;

        const baggage = transfers.filter(
          (t) => t.transferType === "baggage"
        ).length;
        const family = transfers.filter(
          (t) => t.transferType === "family"
        ).length;
        const group = transfers.filter(
          (t) => t.transferType === "group"
        ).length;
        const other = transfers.filter(
          (t) => t.transferType === "other"
        ).length;

        const oneWay = transfers.filter((t) => t.tripType === "one-way").length;
        const roundTrip = transfers.filter(
          (t) => t.tripType === "round-trip"
        ).length;

        // Get recent transfers (last 5)
        const recentTransfers = [...transfers]
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 5);

        // Calculate top destinations
        const destinationCounts: Record<string, number> = {};
        transfers.forEach((transfer) => {
          const destination = transfer.destination;
          destinationCounts[destination] =
            (destinationCounts[destination] || 0) + 1;
        });

        const topDestinations = Object.entries(destinationCounts)
          .map(([destination, count]) => ({ destination, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setStats({
          total: transfers.length,
          pending,
          confirmed,
          canceled,
          byType: {
            baggage,
            family,
            group,
            other,
          },
          byTripType: {
            oneWay,
            roundTrip,
          },
          recentTransfers,
          topDestinations,
        });

        setError(null);
      } catch (err) {
        console.error("Error fetching transfer stats:", err);
        setError("Failed to load transfer statistics. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load transfer statistics",
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
      case "confirmed":
        return "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800";
      case "canceled":
        return "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800";
    }
  };

  // Get transfer type icon
  const getTransferTypeIcon = (type: string) => {
    switch (type) {
      case "baggage":
        return <Luggage className="h-4 w-4 mr-2" />;
      case "family":
        return <Users className="h-4 w-4 mr-2" />;
      case "group":
        return <UserPlus className="h-4 w-4 mr-2" />;
      default:
        return <MapPin className="h-4 w-4 mr-2" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <RefreshCw className="h-8 w-8 animate-spin text-lta-purple" />
        <span className="ml-2 text-lg">Loading transfer statistics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Transfer Dashboard</h1>
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
        <h1 className="text-3xl font-bold">Transfer Dashboard</h1>
        <Button
          className="bg-lta-purple hover:bg-lta-purple/90 text-white"
          asChild
        >
          <Link href="/admin/transfer/add">
            <Plus className="mr-2 h-4 w-4" /> Add New Transfer
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transfers
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All time transfer requests
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock3 className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.pending / stats.total) * 100 || 0).toFixed(1)}% of total
              transfers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.confirmed}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.confirmed / stats.total) * 100 || 0).toFixed(1)}% of
              total transfers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Canceled</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.canceled}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.canceled / stats.total) * 100 || 0).toFixed(1)}% of total
              transfers
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Transfers</CardTitle>
            <CardDescription>Latest transfer requests received</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentTransfers.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">
                No transfers found
              </p>
            ) : (
              <div className="space-y-4">
                {stats.recentTransfers.map((transfer) => (
                  <div
                    key={transfer._id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-start space-x-4">
                      <div>{getTransferTypeIcon(transfer.transferType)}</div>
                      <div>
                        <p className="text-sm font-medium">
                          {transfer.firstName} {transfer.lastName}
                        </p>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">
                            {transfer.destination}
                          </p>
                        </div>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">
                            {formatDate(transfer.preferredDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusBadgeClass(transfer.status)}>
                        {transfer.status.charAt(0).toUpperCase() +
                          transfer.status.slice(1)}
                      </Badge>
                      <Button variant="ghost" size="icon" asChild>
                        <Link
                          href={`/admin/transfer/details/${transfer._id}`}
                        >
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
              <Link href="/admin/transfer/list">View All Transfers</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Transfer Breakdown</CardTitle>
            <CardDescription>Distribution by type and trip</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="type">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="type">By Type</TabsTrigger>
                <TabsTrigger value="trip">By Trip</TabsTrigger>
              </TabsList>
              <TabsContent value="type" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Luggage className="h-4 w-4 mr-2 text-lta-purple" />
                      <span className="text-sm">Baggage</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        {stats.byType.baggage}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        (
                        {(
                          (stats.byType.baggage / stats.total) * 100 || 0
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-lta-purple"
                      style={{
                        width: `${(stats.byType.baggage / stats.total) * 100 || 0
                          }%`,
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-sm">Family</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        {stats.byType.family}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        (
                        {(
                          (stats.byType.family / stats.total) * 100 || 0
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{
                        width: `${(stats.byType.family / stats.total) * 100 || 0
                          }%`,
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <UserPlus className="h-4 w-4 mr-2 text-purple-500" />
                      <span className="text-sm">Group</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        {stats.byType.group}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        (
                        {(
                          (stats.byType.group / stats.total) * 100 || 0
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-purple-500"
                      style={{
                        width: `${(stats.byType.group / stats.total) * 100 || 0
                          }%`,
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-orange-500" />
                      <span className="text-sm">Other</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        {stats.byType.other}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        (
                        {(
                          (stats.byType.other / stats.total) * 100 || 0
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-orange-500"
                      style={{
                        width: `${(stats.byType.other / stats.total) * 100 || 0
                          }%`,
                      }}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="trip" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ArrowUpRight className="h-4 w-4 mr-2 text-lta-purple" />
                      <span className="text-sm">One Way</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        {stats.byTripType.oneWay}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        (
                        {(
                          (stats.byTripType.oneWay / stats.total) * 100 || 0
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-lta-purple"
                      style={{
                        width: `${(stats.byTripType.oneWay / stats.total) * 100 || 0
                          }%`,
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ArrowUpRight className="h-4 w-4 mr-2 text-green-500 rotate-180" />
                      <span className="text-sm">Round Trip</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        {stats.byTripType.roundTrip}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        (
                        {(
                          (stats.byTripType.roundTrip / stats.total) * 100 || 0
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{
                        width: `${(stats.byTripType.roundTrip / stats.total) * 100 || 0
                          }%`,
                      }}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Destinations</CardTitle>
          <CardDescription>
            Most requested transfer destinations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.topDestinations.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">
              No destinations found
            </p>
          ) : (
            <div className="space-y-4">
              {stats.topDestinations.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      {index + 1}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium">{item.destination}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.count} transfers
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
