"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  Home,
  Copy,
  Check,
  Calendar,
  Mail,
  Clock,
  ChevronRight,
  MapPin,
  CreditCard,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";

type ThankYouModalProps = {
  open: boolean;
  onClose: () => void;
  bookingReference?: string;
  bookingType?: string;
  customerEmail?: string;
  bookingDetails?: {
    serviceName?: string;
    price?: number;
    date?: string;
    location?: string;
    persons?: number;
    imageUrl?: string;
  };
};

export default function ThankYouModal({
  open,
  onClose,
  bookingReference,
  bookingType = "Travel",
  customerEmail,
  bookingDetails,
}: ThankYouModalProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleGoHome = () => {
    onClose();
    router.push("/");
  };

  const handleViewBookings = () => {
    onClose();
    router.push("/bookings");
  };

  const handleCopyReference = async () => {
    if (!bookingReference) return;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(bookingReference);
      } else {
        // Fallback for HTTP/non-secure contexts
        const textarea = document.createElement("textarea");
        textarea.value = bookingReference;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 overflow-hidden border-0 shadow-2xl">
        {/* Hero header similar to package detail page */}
        <div className="bg-lta-purple py-6 px-6 sm:px-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center text-white/80 text-sm">
              <span>Home</span>
              <ChevronRight className="w-4 h-4 mx-1" />
              <span>Bookings</span>
              <ChevronRight className="w-4 h-4 mx-1" />
              <span className="text-white">Confirmation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-white h-6 w-6" />
              <DialogTitle className="text-xl sm:text-2xl font-bold text-white">
                Booking Confirmed!
              </DialogTitle>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Success message */}
          <DialogDescription className="text-base text-slate-600 leading-relaxed">
            Your {bookingType.toLowerCase()} booking has been successfully
            confirmed! We've sent a detailed confirmation email with all the
            important information.
          </DialogDescription>

          {/* Booking reference card */}
          <Card className="border-lta-purple/10">
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-lta-purple mr-2" />
                  <span className="font-medium">Booking Reference</span>
                </div>
                <Badge className="bg-green-500 text-white border-none">
                  Confirmed
                </Badge>
              </div>

              <div className="flex items-center justify-between bg-slate-50 rounded-lg p-3 border border-slate-200">
                <span className="font-mono text-lg font-bold text-slate-800 tracking-wide">
                  {bookingReference}
                </span>
                <Button
                  onClick={handleCopyReference}
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-8 w-8 p-0 hover:bg-slate-100 transition-colors"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-lta-purple" />
                  ) : (
                    <Copy className="h-4 w-4 text-slate-500" />
                  )}
                </Button>
              </div>
              {copied && (
                <p className="text-xs text-lta-purple mt-1">
                  Copied to clipboard!
                </p>
              )}
            </CardContent>
          </Card>

          {/* Booking details if available */}
          {bookingDetails && (
            <Card className="border-lta-purple/10">
              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Booking Summary</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {bookingDetails.imageUrl && (
                    <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={bookingDetails.imageUrl || "/placeholder.svg"}
                        alt={bookingDetails.serviceName || "Booking image"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="space-y-2 flex-grow">
                    {bookingDetails.serviceName && (
                      <p className="font-semibold text-lg">
                        {bookingDetails.serviceName}
                      </p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      {bookingDetails.date && (
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-lta-purple mr-2" />
                          <span>{bookingDetails.date}</span>
                        </div>
                      )}
                      {bookingDetails.location && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-lta-purple mr-2" />
                          <span>{bookingDetails.location}</span>
                        </div>
                      )}
                      {bookingDetails.persons && (
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-lta-purple mr-2" />
                          <span>{bookingDetails.persons} Persons</span>
                        </div>
                      )}
                      {bookingDetails.price && (
                        <div className="flex items-center">
                          <CreditCard className="w-4 h-4 text-lta-purple mr-2" />
                          <span>{bookingDetails.price} TND</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Email confirmation */}
          {customerEmail && (
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 flex items-center">
              <Mail className="h-4 w-4 text-lta-purple mr-3 flex-shrink-0" />
              <div className="text-sm">
                <span className="text-slate-600">
                  Confirmation email sent to:
                </span>
                <span className="font-medium ml-1">{customerEmail}</span>
              </div>
            </div>
          )}

          <Separator />

          {/* Action buttons */}
          <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              onClick={handleViewBookings}
              variant="outline"
              className="flex-1 border-lta-purple/20 text-lta-purple hover:bg-lta-purple/5 hover:text-lta-purple transition-all duration-200"
            >
              View Bookings
            </Button>
            <Button
              onClick={handleGoHome}
              className="flex-1 bg-lta-purple hover:bg-lta-purple/90 text-white shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
