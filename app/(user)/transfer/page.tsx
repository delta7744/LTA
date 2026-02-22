"use client";

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
import { useLanguage } from "@/components/language-provider";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ThankYouModal from "@/components/ThankYouModal";
import { tunisiaRegions } from "@/lib/constant";
import ContactCard from "@/components/contactCard";

export default function TransferPackagePage() {
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [referralCode, setReferralCode] = useState<string>("");
  const searchParams = useSearchParams();

  const { t } = useLanguage();

  const queryFrom = searchParams.get("from") || "";
  const queryTo = searchParams.get("to") || "";
  const queryDate = searchParams.get("date") || "";
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const response = await fetch(`${baseUrl}/transfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const result = await response.json();
      setReferralCode(result.data.bookingReference || "");
      // Show success message
      setShowModal(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description:
          "There was an error submitting your request. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="bg-lta-purple py-10 md:py-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-lta-orange opacity-10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="container px-4 md:px-6 relative z-10 text-white">
            <h1 className="text-3xl md:text-5xl font-black mb-4">{t.transferPage.packageRequest}</h1>
            <p className="text-white/80 max-w-2xl text-lg">{t.transferPage.description}</p>
          </div>
        </div>

        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                      <h2 className="text-xl font-semibold mb-4">
                        {t.form.personalInformation}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label
                            htmlFor="firstName"
                            className="text-sm font-medium"
                          >
                            {t.form.firstName.label}
                          </label>
                          <Input
                            id="firstName"
                            name="firstName"
                            placeholder={t.form.firstName.placeholder}
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="lastName"
                            className="text-sm font-medium"
                          >
                            {t.form.lastName.label}
                          </label>
                          <Input
                            id="lastName"
                            name="lastName"
                            placeholder={t.form.lastName.placeholder}
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="email"
                            className="text-sm font-medium"
                          >
                            {t.form.email.label}
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder={t.form.email.placeholder}
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="phone"
                            className="text-sm font-medium"
                          >
                            {t.form.phone.label}
                          </label>
                          <Input
                            id="phone"
                            name="phone"
                            placeholder={t.form.phone.placeholder}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold mb-4">
                        {t.transferPage.transferDetails}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label
                            htmlFor="transferType"
                            className="text-sm font-medium"
                          >
                            {t.transferPage.transferType}
                          </label>
                          <Select name="transferType">
                            <SelectTrigger id="transferType">
                              <SelectValue
                                placeholder={t.transferPage.selectType}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="baggage">
                                {t.transfer.baggage}
                              </SelectItem>
                              <SelectItem value="family">
                                {t.transfer.family}
                              </SelectItem>
                              <SelectItem value="group">
                                {t.transfer.group}
                              </SelectItem>
                              <SelectItem value="other">
                                {t.general.other}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="region"
                            className="text-sm font-medium"
                          >
                            {t.transferPage.region}
                          </label>
                          <Select name="region">
                            <SelectTrigger id="region">
                              <SelectValue
                                placeholder={t.transferPage.selectRegion}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {tunisiaRegions.map((region, index) => (
                                <SelectItem
                                  key={index}
                                  value={region.toLowerCase()}
                                >
                                  {region}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="destination"
                            className="text-sm font-medium"
                          >
                            {t.transferPage.destination}
                          </label>
                          <Input
                            id="destination"
                            name="destination"
                            defaultValue={queryTo}
                            placeholder={t.transferPage.enterDestination}
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="tripType"
                            className="text-sm font-medium"
                          >
                            {t.transferPage.tripType}
                          </label>
                          <Select name="tripType">
                            <SelectTrigger id="tripType">
                              <SelectValue
                                placeholder={t.transferPage.selectTripType}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="one-way">
                                {t.trips.oneWay}
                              </SelectItem>
                              <SelectItem value="round-trip">
                                {t.trips.roundTrip}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="pickupAddress"
                            className="text-sm font-medium"
                          >
                            {t.transferPage.pickupAddress}
                          </label>
                          <Input
                            id="pickupAddress"
                            name="pickupAddress"
                            defaultValue={queryFrom}
                            placeholder={t.transferPage.enterPickupAddress}
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="dropoffAddress"
                            className="text-sm font-medium"
                          >
                            {t.transferPage.dropoffAddress}
                          </label>
                          <Input
                            id="dropoffAddress"
                            name="dropoffAddress"
                            placeholder={t.transferPage.enterDropoffAddress}
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="preferredDate"
                            className="text-sm font-medium"
                          >
                            {t.transferPage.preferredDate}
                          </label>
                          <Input
                            id="preferredDate"
                            name="preferredDate"
                            type="date"
                            defaultValue={queryDate}
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="specialRequests"
                            className="text-sm font-medium"
                          >
                            {t.transferPage.specialRequest}
                          </label>
                          <Textarea
                            id="specialRequests"
                            name="specialRequests"
                            placeholder={t.transferPage.specialRequest}
                            rows={5}
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-lta-purple hover:bg-lta-purple-light text-white transition-all duration-300 rounded-xl py-6 font-bold shadow-lg shadow-lta-purple/20"
                    >
                      {t.form.submit}
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
                      {t.transferPage.whyChooseUs.title}
                    </h3>
                    <ul className="space-y-3">
                      {t.transferPage.whyChooseUs.items.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <div className="h-5 w-5 rounded-full bg-lta-purple text-white flex items-center justify-center mr-3 mt-0.5 shrink-0">
                            ✓
                          </div>
                          <div>
                            <span className="mr-3">{item.name}</span>
                            <ol className="list-disc list-inside text-sm text-muted-foreground">
                              <li>{item.description}</li>
                            </ol>
                          </div>
                        </li>
                      ))}
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
    </div>
  );
}
