"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { format } from "date-fns";
import Image from "next/image";
import {
  CalendarIcon,
  Clock,
  Info,
  RefreshCw,
  MapPin,
  User,
  Users,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverTrigger } from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ThankYouModal from "@/components/ThankYouModal";
import { useLanguage } from "@/components/language-provider";
import { FALLBACK_TOURS } from "@/lib/fallback-data";

// Define the schema for form validation
const bookingFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(8, "Phone number must be at least 8 characters"),
  nationality: z.string().optional(),
  passportNumber: z.string().optional(),
  address: z.string().optional(),
  adults: z.number().min(1, "At least 1 adult is required"),
  children: z.number().min(0, "Children cannot be negative"),
  startDate: z.date(),
  endDate: z.date().optional(),
  specialRequests: z.string().optional(),
  contactPreference: z.enum(["phone", "email", "whatsapp"]),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

// Service information interface
interface ServiceInfo {
  id: string;
  name: string;
  type: "trip" | "other" | string;
  price: number;
  childPrice?: number;
  currency: string;
  description?: string;
  image?: string;
  duration?: number;
  tax?: number;
}

export default function CheckoutPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // State for service information
  const [service, setService] = useState<ServiceInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeStep, setActiveStep] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [referralCode, setReferralCode] = useState<string>("");

  // Form state
  const [formValues, setFormValues] = useState<Partial<BookingFormValues>>({
    adults: 1,
    children: 0,
    startDate: new Date(),
    contactPreference: "phone",
  });

  // Calculate total amount
  const calculateTotal = () => {
    if (!service) return 0;

    const adultTotal = (formValues.adults || 1) * service.price;
    const childTotal =
      (formValues.children || 0) * (service.childPrice || service.price * 0.7);
    const taxAmount = service.tax || 0;

    return adultTotal + childTotal + taxAmount;
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormValues((prev) => ({ ...prev, [name]: checked }));

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle number input changes
  const handleNumberChange = (name: string, value: number) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate current step
  const validateStep = (step: number): boolean => {
    try {
      let stepSchema;

      if (step === 1) {
        // Personal information validation
        stepSchema = z.object({
          firstName: bookingFormSchema.shape.firstName,
          lastName: bookingFormSchema.shape.lastName,
          email: bookingFormSchema.shape.email,
          phone: bookingFormSchema.shape.phone,
          contactPreference: bookingFormSchema.shape.contactPreference,
        });
      } else if (step === 2) {
        // Travel details validation
        stepSchema = z.object({
          adults: bookingFormSchema.shape.adults,
          startDate: bookingFormSchema.shape.startDate,
        });
      } else if (step === 3) {
        // Terms validation
        stepSchema = z.object({
          termsAccepted: bookingFormSchema.shape.termsAccepted,
        });
      }

      if (stepSchema) {
        stepSchema.parse(formValues);
        setErrors({});
        return true;
      }

      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  // Handle next step
  const handleNextStep = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    setActiveStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(activeStep) || !service) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please check the form for errors and try again.",
      });
      return;
    }

    setSubmitting(true);

    try {
      // Calculate total amount
      const totalAmount = calculateTotal();

      // Prepare booking data
      const bookingData = {
        customer: {
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          email: formValues.email,
          phone: formValues.phone,
          nationality: formValues.nationality || "",
          passportNumber: formValues.passportNumber || "",
          address: formValues.address || "",
          contactPreference: formValues.contactPreference,
        },
        serviceType: service.type,
        serviceId: service.id,
        serviceName: service.name,
        startDate: formValues.startDate,
        endDate: formValues.endDate,
        adults: formValues.adults || 1,
        children: formValues.children || 0,
        totalAmount,
        paidAmount: 0, // Initially no payment is made
        remainingAmount: totalAmount,
        currency: service.currency,
        status: "pending",
        paymentStatus: "unpaid",
        specialRequests: formValues.specialRequests || "",
      };

      // Send booking data to API
      if (service.id.startsWith("fb-")) {
        // Mock success for fallback data
        console.log("Mocking booking submission for fallback service:", service.id);
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network
        setReferralCode(`LTA-REF-${Math.floor(Math.random() * 100000)}`);
        setShowModal(true);
        return;
      }

      const response = await fetch("/api/booking/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error("Failed to create booking");
      }

      const result = await response.json();
      setReferralCode(result.data.bookingReference || "");
      // Show success message
      setShowModal(true);
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description:
          "There was an error processing your booking. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Fetch service information from URL parameters
  useEffect(() => {
    const serviceId = searchParams.get("serviceId");
    const serviceType = searchParams.get("serviceType");

    if (!serviceId || !serviceType) {
      toast({
        variant: "destructive",
        title: "Invalid Request",
        description: "Missing service information. Please try again.",
      });
      router.push("/");
      return;
    }

    const fetchServiceInfo = async () => {
      try {
        setLoading(true);

        // Fetch service data based on type
        let serviceData = null;

        if (serviceType === "trip") {
          // Check for fallback ID first
          if (serviceId.startsWith('fb-')) {
            const fallback = FALLBACK_TOURS.find(t => t._id === serviceId);
            if (fallback) {
              serviceData = {
                id: serviceId,
                name: fallback.title,
                type: "trip",
                price: fallback.price || 0,
                childPrice: fallback.price * 0.7 || 0,
                currency: "TND",
                description: fallback.description || "",
                duration: fallback.duration || 0,
                image: fallback.images?.[0] || "",
                tax: fallback.tax || 0,
              };
              if (fallback.departureDate) setFormValues(v => ({ ...v, startDate: new Date(fallback.departureDate as string) }));
              if (fallback.returnDate) setFormValues(v => ({ ...v, endDate: new Date(fallback.returnDate as string) }));
            }
          }

          if (!serviceData) {
            try {
              const response = await fetch(`/api/tours/${serviceId}`);
              if (response.ok) {
                const apiData = await response.json();
                const data = apiData.data;
                if (data) {
                  serviceData = {
                    id: serviceId,
                    name: data.title,
                    type: "trip",
                    price: data.price || 0,
                    childPrice: data.childPrice || data.price * 0.7 || 0,
                    currency: "TND",
                    description: data.description || "",
                    duration: data.duration || 0,
                    image: data.images?.[0] || "",
                    tax: data.tax || 0,
                  };
                  if (data.departureDate) setFormValues(v => ({ ...v, startDate: new Date(data.departureDate) }));
                  if (data.returnDate) setFormValues(v => ({ ...v, endDate: new Date(data.returnDate) }));
                }
              }
            } catch (e) { console.error("API fetch failed, checking fallbacks"); }
          }
        }

        if (serviceData) {
          setService(serviceData);
        } else {
          throw new Error("Failed to load service data");
        }

        // If there are adults in the URL, use it
        const adultsParam = searchParams.get("adults");
        if (adultsParam) {
          setFormValues((prev) => ({
            ...prev,
            adults: Number.parseInt(adultsParam),
          }));
        }

        // If there are children in the URL, use it
        const childrenParam = searchParams.get("children");
        if (childrenParam) {
          setFormValues((prev) => ({
            ...prev,
            children: Number.parseInt(childrenParam),
          }));
        }
      } catch (error) {
        console.error("Error fetching service info:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load service information. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchServiceInfo();
  }, [searchParams, router, toast]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-lg">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-500">Service information not found.</p>
          <Button className="mt-4" onClick={() => router.push("/")}>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-lta-purple py-10 md:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-lta-orange opacity-10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-4">
            {service.type === "trip"
              ? t.checkoutPage.bookTourPackage
              : t.checkoutPage.bookGeneric}{" "}
          </h1>
          <p className="text-white/80 max-w-2xl text-sm md:text-base">
            {service.type === "trip" && <>{t.checkoutPage.tourDescription}</>}
          </p>
        </div>
      </div>
      <div className="container py-10">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between">
            <div
              className={`flex flex-col items-center ${activeStep >= 1 ? "text-lta-purple" : "text-muted-foreground"
                }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${activeStep >= 1
                  ? "border-lta-purple bg-lta-purple text-white shadow-lg shadow-lta-purple/20"
                  : "border-muted-foreground"
                  }`}
              >
                <User className="h-5 w-5" />
              </div>
              <span className="mt-2 text-sm font-medium">
                {t.checkoutPage.contactInformation}
              </span>
            </div>
            <div className="flex-1 flex items-center">
              <div
                className={`h-1 w-full ${activeStep >= 2 ? "bg-lta-purple" : "bg-muted"
                  }`}
              ></div>
            </div>
            <div
              className={`flex flex-col items-center ${activeStep >= 2 ? "text-lta-purple" : "text-muted-foreground"
                }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${activeStep >= 2
                  ? "border-lta-purple bg-lta-purple text-white shadow-lg shadow-lta-purple/20"
                  : "border-muted-foreground"
                  }`}
              >
                <Users className="h-5 w-5" />
              </div>
              <span className="mt-2 text-sm font-medium">
                {t.checkoutPage.travellersInfoTitle}
              </span>
            </div>
            <div className="flex-1 flex items-center">
              <div
                className={`h-1 w-full ${activeStep >= 3 ? "bg-lta-purple" : "bg-muted"
                  }`}
              ></div>
            </div>
            <div
              className={`flex flex-col items-center ${activeStep >= 3 ? "text-lta-purple" : "text-muted-foreground"
                }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${activeStep >= 3
                  ? "border-lta-purple bg-lta-purple text-white shadow-lg shadow-lta-purple/20"
                  : "border-muted-foreground"
                  }`}
              >
                <Info className="h-5 w-5" />
              </div>
              <span className="mt-2 text-sm font-medium">
                {" "}
                {t.checkoutPage.confirmation}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Booking Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit}>
              <Card>
                {activeStep === 1 && (
                  <>
                    <CardHeader>
                      <CardTitle>{t.contactPage.contactInfo}</CardTitle>
                      <CardDescription>
                        {t.form.personalInformation}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Personal Information */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">
                            {t.form.firstName.label}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            placeholder={t.form.firstName.placeholder}
                            value={formValues.firstName || ""}
                            onChange={handleInputChange}
                            className={errors.firstName ? "border-red-500" : ""}
                          />
                          {errors.firstName && (
                            <p className="text-xs text-red-500">
                              {errors.firstName}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">
                            {t.form.lastName.label}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            placeholder={t.form.lastName.placeholder}
                            value={formValues.lastName || ""}
                            onChange={handleInputChange}
                            className={errors.lastName ? "border-red-500" : ""}
                          />
                          {errors.lastName && (
                            <p className="text-xs text-red-500">
                              {errors.lastName}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="email">
                            {t.form.email.label}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder={t.form.email.placeholder}
                            value={formValues.email || ""}
                            onChange={handleInputChange}
                            className={errors.email ? "border-red-500" : ""}
                          />
                          {errors.email && (
                            <p className="text-xs text-red-500">
                              {errors.email}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">
                            {t.form.phone.label}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            placeholder={t.form.phone.placeholder}
                            value={formValues.phone || ""}
                            onChange={handleInputChange}
                            className={errors.phone ? "border-red-500" : ""}
                          />
                          {errors.phone && (
                            <p className="text-xs text-red-500">
                              {errors.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>
                          {t.checkoutPage.preferredContactMethod}

                          <span className="text-red-500">*</span>
                        </Label>
                        <RadioGroup
                          value={formValues.contactPreference}
                          onValueChange={(value) =>
                            handleSelectChange("contactPreference", value)
                          }
                          className="flex flex-col space-y-1 sm:flex-row sm:space-x-4 sm:space-y-0"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="phone" id="contact-phone" />
                            <Label
                              htmlFor="contact-phone"
                              className="cursor-pointer"
                            >
                              {t.checkoutPage.contactPhone}
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="email" id="contact-email" />
                            <Label
                              htmlFor="contact-email"
                              className="cursor-pointer"
                            >
                              {t.checkoutPage.contactEmail}
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="whatsapp"
                              id="contact-whatsapp"
                            />
                            <Label
                              htmlFor="contact-whatsapp"
                              className="cursor-pointer"
                            >
                              {t.checkoutPage.contactWhatsApp}
                            </Label>
                          </div>
                        </RadioGroup>
                        {errors.contactPreference && (
                          <p className="text-xs text-red-500">
                            {errors.contactPreference}
                          </p>
                        )}
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="nationality">
                            {" "}
                            {t.checkoutPage.nationalityLabel}
                          </Label>
                          <Input
                            id="nationality"
                            name="nationality"
                            placeholder={t.checkoutPage.nationalityPlaceholder}
                            value={formValues.nationality || ""}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="passportNumber">
                            {
                              t.ticketsBookingPage.contactInfo.passportNumber
                                .label
                            }
                          </Label>
                          <Input
                            id="passportNumber"
                            name="passportNumber"
                            placeholder={
                              t.ticketsBookingPage.contactInfo.passportNumber
                                .placeholder
                            }
                            value={formValues.passportNumber || ""}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">{t.form.address.label}</Label>
                        <Input
                          id="address"
                          name="address"
                          placeholder={t.form.address.placeholder}
                          value={formValues.address || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </CardContent>
                  </>
                )}

                {activeStep === 2 && (
                  <>
                    <CardHeader>
                      <CardTitle> {t.checkoutPage.travelDetails}</CardTitle>
                      <CardDescription>
                        {t.checkoutPage.travelDetailsDescription}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Booking Details */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="adults">
                            {t.checkoutPage.adultsLabel}
                            <span className="text-red-500">*</span>
                          </Label>
                          <div className="flex items-center">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-10 w-10 rounded-r-none"
                              onClick={() =>
                                handleNumberChange(
                                  "adults",
                                  Math.max(1, (formValues.adults || 1) - 1)
                                )
                              }
                            >
                              -
                            </Button>
                            <Input
                              id="adults"
                              name="adults"
                              type="number"
                              min="1"
                              className="h-10 rounded-none text-center"
                              value={formValues.adults || 1}
                              onChange={(e) =>
                                handleNumberChange(
                                  "adults",
                                  Number.parseInt(e.target.value) || 1
                                )
                              }
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-10 w-10 rounded-l-none"
                              onClick={() =>
                                handleNumberChange(
                                  "adults",
                                  (formValues.adults || 1) + 1
                                )
                              }
                            >
                              +
                            </Button>
                          </div>
                          {errors.adults && (
                            <p className="text-xs text-red-500">
                              {errors.adults}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="children">
                            {" "}
                            {t.checkoutPage.childrenLabel}
                            (Under 12)
                          </Label>
                          <div className="flex items-center">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-10 w-10 rounded-r-none"
                              onClick={() =>
                                handleNumberChange(
                                  "children",
                                  Math.max(0, (formValues.children || 0) - 1)
                                )
                              }
                            >
                              -
                            </Button>
                            <Input
                              id="children"
                              name="children"
                              type="number"
                              min="0"
                              className="h-10 rounded-none text-center"
                              value={formValues.children || 0}
                              onChange={(e) =>
                                handleNumberChange(
                                  "children",
                                  Number.parseInt(e.target.value) || 0
                                )
                              }
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-10 w-10 rounded-l-none"
                              onClick={() =>
                                handleNumberChange(
                                  "children",
                                  (formValues.children || 0) + 1
                                )
                              }
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="startDate">
                            {t.checkoutPage.startDateLabel}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !formValues.startDate &&
                                  "text-muted-foreground",
                                  errors.startDate && "border-red-500"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formValues.startDate ? (
                                  format(formValues.startDate, "PPP")
                                ) : (
                                  <span> {t.checkoutPage.pickADate}</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                          </Popover>
                          {errors.startDate && (
                            <p className="text-xs text-red-500">
                              {errors.startDate}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="endDate">
                            {" "}
                            {t.checkoutPage.endDateLabel}
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !formValues.endDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formValues.endDate ? (
                                  format(formValues.endDate, "PPP")
                                ) : (
                                  <span> {t.checkoutPage.pickADate}</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                          </Popover>
                        </div>
                      </div>

                      {/* Special Requests */}
                      <div className="space-y-2">
                        <Label htmlFor="specialRequests">
                          {t.detailsPage.specialRequests}
                        </Label>
                        <Textarea
                          id="specialRequests"
                          name="specialRequests"
                          placeholder={t.detailsPage.specialRequestsPlaceholder}
                          value={formValues.specialRequests || ""}
                          onChange={handleInputChange}
                          rows={4}
                        />
                      </div>
                    </CardContent>
                  </>
                )}

                {activeStep === 3 && (
                  <>
                    <CardHeader>
                      <CardTitle> {t.checkoutPage.reviewAndConfirm}</CardTitle>
                      <CardDescription>
                        {t.checkoutPage.reviewAndConfirmDescription}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <Alert className="bg-primary/10 border-primary/20">
                        <Info className="h-4 w-4 text-primary" />
                        <AlertTitle>
                          {" "}
                          {t.checkoutPage.bookingRequestOnly}
                        </AlertTitle>
                        <AlertDescription>
                          {t.checkoutPage.bookingRequestOnlyDescription}
                        </AlertDescription>
                      </Alert>

                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="personal-info">
                          <AccordionTrigger className="text-base font-medium">
                            {t.checkoutPage.personalInfoTitle}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid gap-2 text-sm">
                              <div className="grid grid-cols-2">
                                <span className="text-muted-foreground">
                                  {t.checkoutPage.nameLabel}
                                </span>
                                <span>
                                  {formValues.firstName} {formValues.lastName}
                                </span>
                              </div>
                              <div className="grid grid-cols-2">
                                <span className="text-muted-foreground">
                                  {t.checkoutPage.emailLabelReview}
                                </span>
                                <span>{formValues.email}</span>
                              </div>
                              <div className="grid grid-cols-2">
                                <span className="text-muted-foreground">
                                  Phone:
                                </span>
                                <span>{formValues.phone}</span>
                              </div>
                              <div className="grid grid-cols-2">
                                <span className="text-muted-foreground">
                                  {t.checkoutPage.contactPreferenceLabel}
                                </span>
                                <span className="capitalize">
                                  {formValues.contactPreference}
                                </span>
                              </div>
                              {formValues.nationality && (
                                <div className="grid grid-cols-2">
                                  <span className="text-muted-foreground">
                                    {t.checkoutPage.nationalityLabelReview}
                                  </span>
                                  <span>{formValues.nationality}</span>
                                </div>
                              )}
                              {formValues.passportNumber && (
                                <div className="grid grid-cols-2">
                                  <span className="text-muted-foreground">
                                    {t.checkoutPage.passportNumberLabelReview}
                                  </span>
                                  <span>{formValues.passportNumber}</span>
                                </div>
                              )}
                              {formValues.address && (
                                <div className="grid grid-cols-2">
                                  <span className="text-muted-foreground">
                                    {t.checkoutPage.addressLabelReview}
                                  </span>
                                  <span>{formValues.address}</span>
                                </div>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-4"
                              onClick={() => setActiveStep(1)}
                            >
                              {t.checkoutPage.editButton}
                            </Button>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="travel-details">
                          <AccordionTrigger className="text-base font-medium">
                            {t.ticketsBookingPage.travellersInfo.title}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid gap-2 text-sm">
                              <div className="grid grid-cols-2">
                                <span className="text-muted-foreground">
                                  Service:
                                </span>
                                <span>{service.name}</span>
                              </div>
                              <div className="grid grid-cols-2">
                                <span className="text-muted-foreground">
                                  Type:
                                </span>
                                <span className="capitalize">
                                  {service.type}
                                </span>
                              </div>
                              <div className="grid grid-cols-2">
                                <span className="text-muted-foreground">
                                  Travelers:
                                </span>
                                <span>
                                  {formValues.adults}{" "}
                                  {formValues.adults === 1 ? "Adult" : "Adults"}
                                  {formValues.children &&
                                    formValues.children > 0
                                    ? `, ${formValues.children} ${formValues.children === 1
                                      ? "Child"
                                      : "Children"
                                    }`
                                    : ""}
                                </span>
                              </div>
                              <div className="grid grid-cols-2">
                                <span className="text-muted-foreground">
                                  Start Date:
                                </span>
                                <span>
                                  {formValues.startDate
                                    ? format(formValues.startDate, "PPP")
                                    : "Not specified"}
                                </span>
                              </div>
                              {formValues.endDate && (
                                <div className="grid grid-cols-2">
                                  <span className="text-muted-foreground">
                                    End Date:
                                  </span>
                                  <span>
                                    {format(formValues.endDate, "PPP")}
                                  </span>
                                </div>
                              )}
                              {formValues.specialRequests && (
                                <div className="grid grid-cols-2">
                                  <span className="text-muted-foreground">
                                    Special Requests:
                                  </span>
                                  <span>{formValues.specialRequests}</span>
                                </div>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-4"
                              onClick={() => setActiveStep(2)}
                            >
                              {t.checkoutPage.editButton}
                            </Button>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="price-details">
                          <AccordionTrigger className="text-base font-medium">
                            {t.checkoutPage.priceDetailsTitle}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  {t.checkoutPage.adultsLabel}(
                                  {formValues.adults || 1} × {service.price}{" "}
                                  {service.currency})
                                </span>
                                <span>
                                  {(
                                    (formValues.adults || 1) * service.price
                                  ).toFixed(2)}{" "}
                                  {service.currency}
                                </span>
                              </div>

                              {(formValues.children || 0) > 0 && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">
                                    {t.checkoutPage.childrenLabel}(
                                    {formValues.children} × {service.childPrice}{" "}
                                    {service.currency})
                                  </span>
                                  <span>
                                    {(
                                      (formValues.children || 0) *
                                      (service.childPrice || 0)
                                    ).toFixed(2)}{" "}
                                    {service.currency}
                                  </span>
                                </div>
                              )}

                              {service.tax && service.tax > 0 && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">
                                    {t.serviceDetails.tax}
                                  </span>
                                  <span>
                                    {service.tax.toFixed(2)} {service.currency}
                                  </span>
                                </div>
                              )}

                              <Separator className="my-2" />

                              <div className="flex justify-between font-medium">
                                <span>{t.detailsPage.total}</span>
                                <span>
                                  {calculateTotal().toFixed(2)}{" "}
                                  {service.currency}
                                </span>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <div className="flex items-start space-x-2 pt-4">
                        <Checkbox
                          id="terms"
                          checked={formValues.termsAccepted || false}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(
                              "termsAccepted",
                              checked === true
                            )
                          }
                          className={
                            errors.termsAccepted ? "border-red-500" : ""
                          }
                        />
                        <div className="grid gap-1.5 leading-none">
                          <Label
                            htmlFor="terms"
                            className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${errors.termsAccepted ? "text-red-500" : ""
                              }`}
                          >
                            {t.checkoutPage.termsAndConditions}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            By submitting this booking request, you agree to our{" "}
                            <a href="/terms" className="text-primary underline">
                              {t.checkoutPage.termsLink}
                            </a>{" "}
                            and{" "}
                            <a
                              href="/privacy"
                              className="text-primary underline"
                            >
                              {t.checkoutPage.privacyLink}
                            </a>
                            .
                          </p>
                          {errors.termsAccepted && (
                            <p className="text-xs text-red-500">
                              {errors.termsAccepted}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </>
                )}

                <CardFooter className="flex justify-between">
                  {activeStep > 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevStep}
                    >
                      {t.checkoutPage.backButton}
                    </Button>
                  ) : (
                    <div></div>
                  )}

                  {activeStep < 3 ? (
                    <Button type="button" onClick={handleNextStep}>
                      {t.checkoutPage.continueButton}
                    </Button>
                  ) : (
                    <Button type="submit" disabled={submitting}>
                      {submitting ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          {t.checkoutPage.processing}
                        </>
                      ) : (
                        t.checkoutPage.submitBooking
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </form>
          </div>

          {/* Booking Summary */}
          <div>
            <div className="sticky top-20 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t.detailsPage.bookingSummary}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {service.image && (
                    <div className="relative h-40 w-full overflow-hidden rounded-md">
                      <Image
                        src={service.image || "/placeholder.svg"}
                        alt={service.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="rounded-lg bg-muted p-4">
                    <h3 className="font-medium">{service.name}</h3>
                    {service.description && (
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-3">
                        {service.description}
                      </p>
                    )}

                    <div className="mt-3 flex items-center text-sm">
                      <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span className="capitalize">{service.type} Package</span>
                    </div>

                    {service.duration && (
                      <div className="mt-2 flex items-center text-sm">
                        <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>
                          {service.duration} {t.general.days}
                        </span>
                      </div>
                    )}

                    {formValues.startDate && (
                      <div className="mt-2 flex items-center text-sm">
                        <CalendarIcon className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>
                          {format(formValues.startDate, "PPP")}
                          {formValues.endDate &&
                            ` - ${format(formValues.endDate, "PPP")}`}
                        </span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>
                        {t.checkoutPage.adultsLabel} ({formValues.adults || 1} ×{" "}
                        {service.price} {service.currency})
                      </span>
                      <span>
                        {((formValues.adults || 1) * service.price).toFixed(2)}{" "}
                        {service.currency}
                      </span>
                    </div>

                    {(formValues.children || 0) > 0 && (
                      <div className="flex justify-between">
                        <span>
                          {t.checkoutPage.children} ({formValues.children} ×{" "}
                          {service.childPrice} {service.currency})
                        </span>
                        <span>
                          {(
                            (formValues.children || 0) *
                            (service.childPrice || 0)
                          ).toFixed(2)}{" "}
                          {service.currency}
                        </span>
                      </div>
                    )}

                    {service.tax && service.tax > 0 && (
                      <div className="flex justify-between">
                        <span> {t.checkoutPage.tax}</span>
                        <span>
                          {service.tax.toFixed(2)} {service.currency}
                        </span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between font-medium">
                    <span> {t.checkoutPage.total}</span>
                    <span>
                      {calculateTotal().toFixed(2)} {service.currency}
                    </span>
                  </div>

                  <div className="rounded-md bg-primary/10 p-3 text-sm">
                    <p className="flex items-center text-primary">
                      <Info className="mr-2 h-4 w-4" />
                      <span>{t.checkoutPage.bookingRequestInfo}</span>
                    </p>
                  </div>

                  <Badge
                    className="w-full justify-center py-2 text-center"
                    variant="outline"
                  >
                    {t.checkoutPage.payAtOffice}
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <ThankYouModal
          open={showModal}
          onClose={() => setShowModal(false)}
          bookingReference={referralCode}
        />
      </div>
    </>
  );
}
