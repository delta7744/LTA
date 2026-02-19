"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Edit,
  Calendar,
  Users,
  MapPin,
  Phone,
  Mail,
  Car,
  User,
  FileText,
  RefreshCw,
  Navigation,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

// Define the Transfer type
interface Transfer {
  _id: string;
  bookingReference: string;
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

export default function TransferDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [transfer, setTransfer] = useState<Transfer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransferDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/transfer/${params.id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch transfer details");
        }

        const data = await response.json();
        setTransfer(data.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching transfer details:", err);
        setError("Failed to load transfer details. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load transfer details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchTransferDetails();
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

  // Get transfer type display name and icon
  const getTransferTypeDisplay = (type: string) => {
    switch (type) {
      case "baggage":
        return { name: "Baggage Transfer", icon: <Car className="h-5 w-5" /> };
      case "family":
        return { name: "Family Transfer", icon: <Users className="h-5 w-5" /> };
      case "group":
        return { name: "Group Transfer", icon: <Users className="h-5 w-5" /> };
      default:
        return { name: "Other Transfer", icon: <Car className="h-5 w-5" /> };
    }
  };

  // Get trip type display
  const getTripTypeDisplay = (type: string) => {
    return type === "one-way" ? "One Way" : "Round Trip";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-lg">Loading transfer details...</span>
      </div>
    );
  }

  if (error || !transfer) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4"></div>
        <div className="bg-red-50 text-red-800 p-4 rounded-md">
          <p>{error || "Transfer not found"}</p>
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

  const transferTypeInfo = getTransferTypeDisplay(transfer.transferType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Transfer Details</h1>
            <p className="text-muted-foreground">
              {transfer.firstName} {transfer.lastName} •{" "}
              {transfer.bookingReference}
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/admin/transfer/edit/${transfer._id}`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Transfer
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Transfer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {transferTypeInfo.icon}
                Transfer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium mb-1">Transfer Type</p>
                  <div className="flex items-center gap-2">
                    {transferTypeInfo.icon}
                    <span>{transferTypeInfo.name}</span>
                  </div>
                </div>
                <div>
                  <p className="font-medium mb-1">Trip Type</p>
                  <Badge variant="outline">
                    {getTripTypeDisplay(transfer.tripType)}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div>
                <p className="font-medium mb-2">Route Details</p>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-green-600 mt-1" />
                    <div>
                      <p className="font-medium text-green-600">
                        Pickup Location
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {transfer.pickupAddress}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Navigation className="h-4 w-4 text-red-600 mt-1" />
                    <div>
                      <p className="font-medium text-red-600">
                        Drop-off Location
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {transfer.dropoffAddress}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-lta-purple mt-1" />
                    <div>
                      <p className="font-medium text-lta-purple">Destination</p>
                      <p className="text-sm text-muted-foreground">
                        {transfer.destination}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Preferred Date</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(transfer.preferredDate)}
                    </p>
                  </div>
                </div>
                {transfer.region && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Region</p>
                      <p className="text-sm text-muted-foreground">
                        {transfer.region}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Special Requests */}
          {transfer.specialRequests && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Special Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">
                  {transfer.specialRequests}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">
                  {transfer.firstName} {transfer.lastName}
                </h3>
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{transfer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{transfer.phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transfer Status */}
          <Card>
            <CardHeader>
              <CardTitle>Transfer Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Current Status</p>
                <Badge className={getStatusBadgeClass(transfer.status)}>
                  {transfer.status.charAt(0).toUpperCase() +
                    transfer.status.slice(1)}
                </Badge>
              </div>
              {transfer.handledBy && (
                <div>
                  <p className="text-sm font-medium">Handled By</p>
                  <p className="text-sm text-muted-foreground">
                    {transfer.handledBy}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Transfer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Request Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Request ID</p>
                <p className="text-sm text-muted-foreground font-mono">
                  {transfer._id}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm text-muted-foreground">
                  {formatDateTime(transfer.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-sm text-muted-foreground">
                  {formatDateTime(transfer.updatedAt)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
