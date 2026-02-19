"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { z } from "zod";
import ThankYouModal from "@/components/ThankYouModal";
import ContactCard from "@/components/contactCard";

interface TravellersState {
  adults: number;
  children: number;
  infants1to2: number;
  infantsUnder1: number;
  seniors: number;
}

// Define validation schema
const contactSchema = z.object({
  title: z.string().optional(),
  forename: z.string().min(1, "First name is required"),
  name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  telephone: z.string().min(1, "Phone number is required"),
});

const crossingSchema = z.object({
  crossingType: z.string().min(1, "Crossing type is required"),
  departureDate: z.string().min(1, "Departure date is required"),
  departurePort: z.string().min(1, "Departure port is required"),
  arrivalPort: z.string().min(1, "Arrival port is required"),
  class: z.string().min(1, "Class is required"),
  airLine: z.string().optional(),
});

export default function FlightsPage() {
  const { toast } = useToast();
  const { t } = useLanguage();

  const [showModal, setShowModal] = useState(false);
  const [referralCode, setReferralCode] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [travellers, setTravellers] = useState<TravellersState>({
    adults: 1,
    children: 0,
    infants1to2: 0,
    infantsUnder1: 0,
    seniors: 0,
  });

  // Reset errors when travellers change
  useEffect(() => {
    setFormErrors({});
  }, [travellers]);

  const handleTravellerChange = (
    type: keyof TravellersState,
    value: number
  ) => {
    setTravellers((prev) => ({
      ...prev,
      [type]: Math.max(0, value),
    }));
  };

  const validateTravellerData = (
    formData: FormData,
    travellerType: keyof TravellersState,
    count: number,
    requirePassport: boolean
  ) => {
    const errors: Record<string, string> = {};

    for (let i = 0; i < count; i++) {
      const firstName = formData.get(
        `${travellerType}FirstName_${i}`
      ) as string;
      const lastName = formData.get(`${travellerType}LastName_${i}`) as string;
      const dob = formData.get(`${travellerType}Dob_${i}`) as string;

      if (!firstName || firstName.trim() === "") {
        errors[`${travellerType}FirstName_${i}`] = "First name is required";
      }

      if (!lastName || lastName.trim() === "") {
        errors[`${travellerType}LastName_${i}`] = "Last name is required";
      }

      if (!dob) {
        errors[`${travellerType}Dob_${i}`] = "Date of birth is required";
      }

      if (requirePassport) {
        const passport = formData.get(
          `${travellerType}Passport_${i}`
        ) as string;
        if (!passport || passport.trim() === "") {
          errors[`${travellerType}Passport_${i}`] =
            "Passport number is required";
        }
      }
    }

    return errors;
  };

  const renderTravellerSection = (
    travellerType: keyof TravellersState,
    title: string,
    requirePassport: boolean
  ) => {
    const { t } = useLanguage();

    const count = travellers[travellerType];
    if (count <= 0) return null;

    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">{title}s</h3>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={`${travellerType}-${i}`}
            className="mb-6 border p-4 rounded-lg"
          >
            <h3 className="font-medium mb-3">
              {title} {i + 1}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t.ticketsBookingPage.contactInfo.forename.label}
                </label>
                <Input
                  name={`${travellerType}FirstName_${i}`}
                  placeholder={
                    t.ticketsBookingPage.contactInfo.forename.placeholder
                  }
                  required
                  className={
                    formErrors[`${travellerType}FirstName_${i}`]
                      ? "border-red-500"
                      : ""
                  }
                />
                {formErrors[`${travellerType}FirstName_${i}`] && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors[`${travellerType}FirstName_${i}`]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t.ticketsBookingPage.contactInfo.name.label}
                </label>
                <Input
                  name={`${travellerType}LastName_${i}`}
                  placeholder={
                    t.ticketsBookingPage.contactInfo.name.placeholder
                  }
                  required
                  className={
                    formErrors[`${travellerType}LastName_${i}`]
                      ? "border-red-500"
                      : ""
                  }
                />
                {formErrors[`${travellerType}LastName_${i}`] && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors[`${travellerType}LastName_${i}`]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t.ticketsBookingPage.contactInfo.dateOfBirth.label}
                </label>
                <Input
                  name={`${travellerType}Dob_${i}`}
                  type="date"
                  required
                  className={
                    formErrors[`${travellerType}Dob_${i}`]
                      ? "border-red-500"
                      : ""
                  }
                />
                {formErrors[`${travellerType}Dob_${i}`] && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors[`${travellerType}Dob_${i}`]}
                  </p>
                )}
              </div>
              {requirePassport && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t.ticketsBookingPage.contactInfo.passportNumber.label}
                  </label>
                  <Input
                    name={`${travellerType}Passport_${i}`}
                    placeholder={
                      t.ticketsBookingPage.contactInfo.passportNumber
                        .placeholder
                    }
                    required
                    className={
                      formErrors[`${travellerType}Passport_${i}`]
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {formErrors[`${travellerType}Passport_${i}`] && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors[`${travellerType}Passport_${i}`]}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});

    const formData = new FormData(event.currentTarget);
    let hasErrors = false;
    let allErrors: Record<string, string> = {};

    // Validate crossing information
    try {
      const crossingData = {
        crossingType: formData.get("crossingType") as string,
        departureDate: formData.get("departureDate") as string,
        departurePort: formData.get("departurePort") as string,
        arrivalPort: formData.get("arrivalPort") as string,
        class: formData.get("class") as string,
        airLine: formData.get("airLine") as string,
      };

      crossingSchema.parse(crossingData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          allErrors[err.path[0] as string] = err.message;
        });
        hasErrors = true;
      }
    }

    // Validate contact information
    try {
      const contactData = {
        title: formData.get("title") as string,
        forename: formData.get("forename") as string,
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        telephone: formData.get("telephone") as string,
      };

      contactSchema.parse(contactData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          allErrors[err.path[0] as string] = err.message;
        });
        hasErrors = true;
      }
    }

    // Validate traveller information
    const adultErrors = validateTravellerData(
      formData,
      "adults",
      travellers.adults,
      true
    );
    const childrenErrors = validateTravellerData(
      formData,
      "children",
      travellers.children,
      true
    );
    const infants1to2Errors = validateTravellerData(
      formData,
      "infants1to2",
      travellers.infants1to2,
      false
    );
    const infantsUnder1Errors = validateTravellerData(
      formData,
      "infantsUnder1",
      travellers.infantsUnder1,
      false
    );
    const seniorsErrors = validateTravellerData(
      formData,
      "seniors",
      travellers.seniors,
      true
    );

    allErrors = {
      ...allErrors,
      ...adultErrors,
      ...childrenErrors,
      ...infants1to2Errors,
      ...infantsUnder1Errors,
      ...seniorsErrors,
    };

    if (Object.keys(allErrors).length > 0) {
      setFormErrors(allErrors);
      setIsSubmitting(false);

      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please check the form for errors and try again.",
      });

      return;
    }

    // Collect all traveller data
    const travellersData: any[] = [];

    // Process adults
    for (let i = 0; i < travellers.adults; i++) {
      travellersData.push({
        type: "adult",
        firstName: formData.get(`adultsFirstName_${i}`),
        lastName: formData.get(`adultsLastName_${i}`),
        dob: formData.get(`adultsDob_${i}`),
        passport: formData.get(`adultsPassport_${i}`),
      });
    }

    // Process children
    for (let i = 0; i < travellers.children; i++) {
      travellersData.push({
        type: "child",
        firstName: formData.get(`childrenFirstName_${i}`),
        lastName: formData.get(`childrenLastName_${i}`),
        dob: formData.get(`childrenDob_${i}`),
        passport: formData.get(`childrenPassport_${i}`),
      });
    }

    // Process infants 1-2
    for (let i = 0; i < travellers.infants1to2; i++) {
      travellersData.push({
        type: "infant1-2",
        firstName: formData.get(`infants1to2FirstName_${i}`),
        lastName: formData.get(`infants1to2LastName_${i}`),
        dob: formData.get(`infants1to2Dob_${i}`),
      });
    }

    // Process infants under 1
    for (let i = 0; i < travellers.infantsUnder1; i++) {
      travellersData.push({
        type: "infant<1",
        firstName: formData.get(`infantsUnder1FirstName_${i}`),
        lastName: formData.get(`infantsUnder1LastName_${i}`),
        dob: formData.get(`infantsUnder1Dob_${i}`),
      });
    }

    // Process seniors
    for (let i = 0; i < travellers.seniors; i++) {
      travellersData.push({
        type: "senior",
        firstName: formData.get(`seniorsFirstName_${i}`),
        lastName: formData.get(`seniorsLastName_${i}`),
        dob: formData.get(`seniorsDob_${i}`),
        passport: formData.get(`seniorsPassport_${i}`),
      });
    }

    const submissionData = {
      crossingType: formData.get("crossingType"),
      departureDate: formData.get("departureDate"),
      departurePort: formData.get("departurePort"),
      arrivalPort: formData.get("arrivalPort"),
      class: formData.get("class"),
      airLine: formData.get("airLine"),
      contactInfo: {
        title: formData.get("title"),
        forename: formData.get("forename"),
        name: formData.get("name"),
        email: formData.get("email"),
        telephone: formData.get("telephone"),
      },
      observations: formData.get("observations"),
      travellers: travellersData,
    };

    try {
      const res = await fetch("/api/booking/tickets/flight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await res.json();
      setReferralCode(result.data.bookingReference || "");
      // Show success message
      setShowModal(true);
    } catch (error) {
      console.error("API error:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description:
          "There was an error processing your booking. Please try again or contact customer support.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="bg-lta-purple py-10 md:py-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-lta-orange opacity-10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="container px-4 md:px-6 relative z-10 text-white">
            <h1 className="text-3xl md:text-5xl font-black mb-4">{t.ticketsBookingPage.flightTitle}</h1>
            <p className="text-white/80 max-w-2xl text-lg">{t.ticketsBookingPage.flightdescription}</p>
          </div>
        </div>

        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <form
                    className="space-y-6"
                    onSubmit={handleSubmit}
                    noValidate
                  >
                    <div>
                      <h2 className="text-xl font-semibold mb-4">
                        {
                          t.ticketsBookingPage.crossingAndCabinInfo
                            .flightCrossTitle
                        }
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            {
                              t.ticketsBookingPage.crossingAndCabinInfo
                                .crossingType.label
                            }
                          </label>
                          <Select name="crossingType" required>
                            <SelectTrigger
                              className={
                                formErrors.crossingType ? "border-red-500" : ""
                              }
                            >
                              <SelectValue
                                placeholder={
                                  t.ticketsBookingPage.crossingAndCabinInfo
                                    .crossingType.placeholder
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="one-way">
                                {
                                  t.ticketsBookingPage.crossingAndCabinInfo
                                    .crossingType.options.oneWay
                                }
                              </SelectItem>
                              <SelectItem value="round-trip">
                                {
                                  t.ticketsBookingPage.crossingAndCabinInfo
                                    .crossingType.options.roundTrip
                                }
                              </SelectItem>
                              <SelectItem value="open-return">
                                {
                                  t.ticketsBookingPage.crossingAndCabinInfo
                                    .crossingType.options.openReturn
                                }
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          {formErrors.crossingType && (
                            <p className="text-red-500 text-xs mt-1">
                              {formErrors.crossingType}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            {
                              t.ticketsBookingPage.crossingAndCabinInfo
                                .departureDate.label
                            }
                          </label>
                          <Input
                            name="departureDate"
                            type="date"
                            required
                            className={
                              formErrors.departureDate ? "border-red-500" : ""
                            }
                          />
                          {formErrors.departureDate && (
                            <p className="text-red-500 text-xs mt-1">
                              {formErrors.departureDate}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            {
                              t.ticketsBookingPage.crossingAndCabinInfo
                                .departureAirPort.label
                            }
                          </label>
                          <Input
                            name="departurePort"
                            placeholder={
                              t.ticketsBookingPage.crossingAndCabinInfo
                                .departureAirPort.placeholder
                            }
                            required
                            className={
                              formErrors.departurePort ? "border-red-500" : ""
                            }
                          />
                          {formErrors.departurePort && (
                            <p className="text-red-500 text-xs mt-1">
                              {formErrors.departurePort}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            {
                              t.ticketsBookingPage.crossingAndCabinInfo
                                .arrivalAirPort.label
                            }{" "}
                          </label>
                          <Input
                            name="arrivalPort"
                            placeholder={
                              t.ticketsBookingPage.crossingAndCabinInfo
                                .arrivalAirPort.placeholder
                            }
                            required
                            className={
                              formErrors.arrivalPort ? "border-red-500" : ""
                            }
                          />
                          {formErrors.arrivalPort && (
                            <p className="text-red-500 text-xs mt-1">
                              {formErrors.arrivalPort}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            {
                              t.ticketsBookingPage.crossingAndCabinInfo.class
                                .label
                            }
                          </label>
                          <Select name="class" required>
                            <SelectTrigger
                              className={
                                formErrors.class ? "border-red-500" : ""
                              }
                            >
                              <SelectValue
                                placeholder={
                                  t.ticketsBookingPage.crossingAndCabinInfo
                                    .class.placeholder
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="economy">
                                {
                                  t.ticketsBookingPage.crossingAndCabinInfo
                                    .class.options.economy
                                }
                              </SelectItem>
                              <SelectItem value="business">
                                {
                                  t.ticketsBookingPage.crossingAndCabinInfo
                                    .class.options.business
                                }
                              </SelectItem>
                              <SelectItem value="first">
                                {
                                  t.ticketsBookingPage.crossingAndCabinInfo
                                    .class.options.first
                                }
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          {formErrors.class && (
                            <p className="text-red-500 text-xs mt-1">
                              {formErrors.class}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            {
                              t.ticketsBookingPage.crossingAndCabinInfo.airLine
                                .label
                            }
                          </label>
                          <Select name="airLine" defaultValue="none">
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  t.ticketsBookingPage.crossingAndCabinInfo
                                    .airLine.placeholder
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No AirLine</SelectItem>
                              <SelectItem value="tunisair">
                                Tunis Air
                              </SelectItem>
                              <SelectItem value="airfrance">
                                Air France
                              </SelectItem>
                              <SelectItem value="lufthansa">
                                Lufthansa
                              </SelectItem>
                              <SelectItem value="turkishairlines">
                                Turkish Airlines
                              </SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Travellers */}
                    <div>
                      <h2 className="text-xl font-semibold mb-4">
                        {t.ticketsBookingPage.travellersInfo.title}
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            {t.ticketsBookingPage.travellersInfo.adults.label}
                          </label>
                          <Input
                            type="number"
                            value={travellers.adults}
                            onChange={(e) =>
                              handleTravellerChange(
                                "adults",
                                Number.parseInt(e.target.value)
                              )
                            }
                            min="1"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            {t.ticketsBookingPage.travellersInfo.children.label}
                          </label>
                          <Input
                            type="number"
                            value={travellers.children}
                            onChange={(e) =>
                              handleTravellerChange(
                                "children",
                                Number.parseInt(e.target.value)
                              )
                            }
                            min="0"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            {
                              t.ticketsBookingPage.travellersInfo.infants1to2
                                .label
                            }
                          </label>
                          <Input
                            type="number"
                            value={travellers.infants1to2}
                            onChange={(e) =>
                              handleTravellerChange(
                                "infants1to2",
                                Number.parseInt(e.target.value)
                              )
                            }
                            min="0"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            {
                              t.ticketsBookingPage.travellersInfo.infantsUnder1
                                .label
                            }
                          </label>
                          <Input
                            type="number"
                            value={travellers.infantsUnder1}
                            onChange={(e) =>
                              handleTravellerChange(
                                "infantsUnder1",
                                Number.parseInt(e.target.value)
                              )
                            }
                            min="0"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            {t.ticketsBookingPage.travellersInfo.seniors.label}
                          </label>
                          <Input
                            type="number"
                            value={travellers.seniors}
                            onChange={(e) =>
                              handleTravellerChange(
                                "seniors",
                                Number.parseInt(e.target.value)
                              )
                            }
                            min="0"
                          />
                        </div>
                      </div>
                      {renderTravellerSection(
                        "adults",
                        t.ticketsBookingPage.travellersInfo.adults.label,
                        true
                      )}
                      {renderTravellerSection(
                        "children",
                        t.ticketsBookingPage.travellersInfo.children.label,
                        true
                      )}
                      {renderTravellerSection(
                        "infants1to2",
                        t.ticketsBookingPage.travellersInfo.infants1to2.label,
                        false
                      )}
                      {renderTravellerSection(
                        "infantsUnder1",
                        t.ticketsBookingPage.travellersInfo.infantsUnder1.label,
                        false
                      )}
                      {renderTravellerSection(
                        "seniors",
                        t.ticketsBookingPage.travellersInfo.seniors.label,
                        true
                      )}
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold mb-4">
                        {t.ticketsBookingPage.contactInfo.title}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            {t.ticketsBookingPage.contactInfo.titleField.label}
                          </label>
                          <Select name="title" defaultValue="mr">
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  t.ticketsBookingPage.contactInfo.titleField
                                    .placeholder
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mr">
                                {
                                  t.ticketsBookingPage.contactInfo.titleField
                                    .options.mr
                                }
                              </SelectItem>
                              <SelectItem value="mrs">
                                {
                                  t.ticketsBookingPage.contactInfo.titleField
                                    .options.mrs
                                }
                              </SelectItem>
                              <SelectItem value="ms">
                                {
                                  t.ticketsBookingPage.contactInfo.titleField
                                    .options.ms
                                }
                              </SelectItem>
                              <SelectItem value="dr">
                                {
                                  t.ticketsBookingPage.contactInfo.titleField
                                    .options.dr
                                }
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            {t.ticketsBookingPage.contactInfo.forename.label}
                          </label>
                          <Input
                            name="forename"
                            placeholder={
                              t.ticketsBookingPage.contactInfo.forename
                                .placeholder
                            }
                            required
                            className={
                              formErrors.forename ? "border-red-500" : ""
                            }
                          />
                          {formErrors.forename && (
                            <p className="text-red-500 text-xs mt-1">
                              {formErrors.forename}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            {t.ticketsBookingPage.contactInfo.name.label}
                          </label>
                          <Input
                            name="name"
                            placeholder={
                              t.ticketsBookingPage.contactInfo.name.placeholder
                            }
                            required
                            className={formErrors.name ? "border-red-500" : ""}
                          />
                          {formErrors.name && (
                            <p className="text-red-500 text-xs mt-1">
                              {formErrors.name}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            {t.ticketsBookingPage.contactInfo.email.label}
                          </label>
                          <Input
                            name="email"
                            type="email"
                            placeholder={
                              t.ticketsBookingPage.contactInfo.email.placeholder
                            }
                            required
                            className={formErrors.email ? "border-red-500" : ""}
                          />
                          {formErrors.email && (
                            <p className="text-red-500 text-xs mt-1">
                              {formErrors.email}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            {t.ticketsBookingPage.contactInfo.telephone.label}
                          </label>
                          <Input
                            name="telephone"
                            type="tel"
                            placeholder={
                              t.ticketsBookingPage.contactInfo.telephone
                                .placeholder
                            }
                            required
                            className={
                              formErrors.telephone ? "border-red-500" : ""
                            }
                          />
                          {formErrors.telephone && (
                            <p className="text-red-500 text-xs mt-1">
                              {formErrors.telephone}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold mb-4">
                        {t.ticketsBookingPage.observations.title}
                      </h2>
                      <Textarea
                        name="observations"
                        placeholder={
                          t.ticketsBookingPage.observations.placeholder
                        }
                        rows={4}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-lta-purple hover:bg-lta-purple/90 text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          {t.ticketsBookingPage.buttons.processing}
                        </>
                      ) : (
                        t.ticketsBookingPage.buttons.submitBooking
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div>
              <div className="sticky top-20 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4">
                      {t.ticketsBookingPage.flightWhyBookWithUs.title}
                    </h3>
                    <ul className="space-y-3">
                      {t.ticketsBookingPage.flightWhyBookWithUs.items.map(
                        (item, index) => (
                          <li key={index} className="flex items-start">
                            <div className="h-5 w-5 rounded-full bg-lta-purple text-white flex items-center justify-center mr-3 mt-0.5 shrink-0">
                              ✓
                            </div>
                            <span className="mr-3">{item.name}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </CardContent>
                </Card>
                <ContactCard />
              </div>
            </div>
          </div>
        </div>
      </main>
      <ThankYouModal
        open={showModal}
        onClose={() => setShowModal(false)}
        bookingReference={referralCode}
      />
    </div >
  );
}
