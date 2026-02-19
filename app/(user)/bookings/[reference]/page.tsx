"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CalendarIcon,
  Phone,
  Users,
} from "lucide-react";
import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/components/language-provider";

export default function BookingTrackingPage() {
  const params = useParams();
  const { t } = useLanguage();
  const ref = params.reference as string;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<any | null>(null);

  useEffect(() => {
    const getBookingDetails = async () => {
      try {
        const response = await fetch(`/api/track/${ref}`);
        if (!response.ok) {
          throw new Error("Failed to fetch booking");
        }

        const { data } = await response.json();
        console.log("Booking data:", data);
        setBooking(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching booking:", err);
        setError("Unable to find booking with the provided reference.");
        setBooking(null);
      } finally {
        setLoading(false);
      }
    };

    if (ref) getBookingDetails();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-lta-purple/10 text-lta-purple";
    }
  };
  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-lta-purple" />
          <p className="mt-2 text-lg">
            {t.bookingTrackingPage.loading.message}
          </p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container py-10">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />{" "}
          {t.bookingTrackingPage.buttons.backToSearch}
        </Button>

        <Alert variant="destructive" className="mx-auto max-w-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t.bookingTrackingPage.error.title}</AlertTitle>
          <AlertDescription>
            {error || t.bookingTrackingPage.error.notFound}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-10">

      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader className="bg-lta-purple/5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>
                  {t.bookingTrackingPage.card.title.replace("{ref}", ref)}
                </CardTitle>
                <CardDescription>
                  {t.bookingTrackingPage.card.bookedOn.replace(
                    "{date}",
                    formatDate(booking.createdAt)
                  )}
                </CardDescription>
              </div>
              <Badge className={getStatusColor(booking.status)}>
                {t.bookingTrackingPage.statuses[
                  booking.status.toLowerCase() as keyof typeof t.bookingTrackingPage.statuses
                ] || booking.status}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <Tabs defaultValue="customer" className="w-full">
              <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger value="customer">
                  {t.bookingTrackingPage.tabs.customerInfo}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="customer" className="mt-6 space-y-4">
                <div className="text-sm flex items-center">
                  <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {t.bookingTrackingPage.customerInfo.nameLabel
                      .replace("{firstName}", booking.user.firstName)
                      .replace(
                        "{lastName}",
                        booking.user.lastName ||
                        t.bookingTrackingPage.customerInfo.na
                      )}
                  </span>
                </div>
                <div className="text-sm flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>
                    {t.bookingTrackingPage.customerInfo.phoneLabel.replace(
                      "{phone}",
                      booking.user.phone ||
                      t.bookingTrackingPage.customerInfo.na
                    )}
                  </span>
                </div>
                <div className="text-sm flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>
                    {t.bookingTrackingPage.customerInfo.emailLabel.replace(
                      "{email}",
                      booking.user.email ||
                      t.bookingTrackingPage.customerInfo.na
                    )}
                  </span>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}