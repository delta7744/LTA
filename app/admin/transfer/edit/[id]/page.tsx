"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

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

export default function EditTransferPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Transfer>>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    transferType: "baggage",
    region: "tunis",
    destination: "",
    tripType: "one-way",
    pickupAddress: "",
    dropoffAddress: "",
    preferredDate: "",
    specialRequests: "",
    status: "pending",
  });

  useEffect(() => {
    const fetchTransfer = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/transfer/${params.id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch transfer details");
        }
        const transfersData = await response.json();
        const data = transfersData.data;

        // Format the date for the input field (YYYY-MM-DDThh:mm)
        const date = new Date(data.preferredDate);
        const formattedDate = date.toISOString().slice(0, 16);

        setFormData({
          ...data,
          preferredDate: formattedDate,
        });

        setError(null);
      } catch (err) {
        console.error("Error fetching transfer:", err);
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
      fetchTransfer();
    }
  }, [params.id, toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      const response = await fetch(`/api/transfer/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update transfer");
      }

      toast({
        title: "Success",
        description: "Transfer updated successfully",
      });

      router.push(`/admin/transfer/details/${params.id}`);
    } catch (err) {
      console.error("Error updating transfer:", err);
      toast({
        title: "Error",
        description: "Failed to update transfer",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <RefreshCw className="h-8 w-8 animate-spin text-lta-purple" />
        <span className="ml-2 text-lg">Loading transfer details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
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
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className="text-3xl font-bold">Edit Transfer</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Transfer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transferType">Transfer Type</Label>
                <Select
                  value={formData.transferType}
                  onValueChange={(value) =>
                    handleSelectChange("transferType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select transfer type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baggage">Baggage</SelectItem>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="group">Group</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Select
                  value={formData.region}
                  onValueChange={(value) => handleSelectChange("region", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tunis">Tunis</SelectItem>
                    <SelectItem value="ariana">Ariana</SelectItem>
                    <SelectItem value="ben-arous">Ben Arous</SelectItem>
                    <SelectItem value="manouba">Manouba</SelectItem>
                    <SelectItem value="nabeul">Nabeul</SelectItem>
                    <SelectItem value="zaghouan">Zaghouan</SelectItem>
                    <SelectItem value="bizerte">Bizerte</SelectItem>
                    <SelectItem value="beja">Beja</SelectItem>
                    <SelectItem value="jendouba">Jendouba</SelectItem>
                    <SelectItem value="kef">Kef</SelectItem>
                    <SelectItem value="siliana">Siliana</SelectItem>
                    <SelectItem value="kairouan">Kairouan</SelectItem>
                    <SelectItem value="kasserine">Kasserine</SelectItem>
                    <SelectItem value="sidi-bouzid">Sidi Bouzid</SelectItem>
                    <SelectItem value="sousse">Sousse</SelectItem>
                    <SelectItem value="monastir">Monastir</SelectItem>
                    <SelectItem value="mahdia">Mahdia</SelectItem>
                    <SelectItem value="sfax">Sfax</SelectItem>
                    <SelectItem value="gabes">Gabes</SelectItem>
                    <SelectItem value="medenine">Medenine</SelectItem>
                    <SelectItem value="tataouine">Tataouine</SelectItem>
                    <SelectItem value="gafsa">Gafsa</SelectItem>
                    <SelectItem value="tozeur">Tozeur</SelectItem>
                    <SelectItem value="kebili">Kebili</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Trip Type</Label>
              <RadioGroup
                value={formData.tripType}
                onValueChange={(value) => handleSelectChange("tripType", value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="one-way" id="one-way" />
                  <Label htmlFor="one-way">One Way</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="round-trip" id="round-trip" />
                  <Label htmlFor="round-trip">Round Trip</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Pickup & Dropoff</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pickupAddress">Pickup Address</Label>
              <Input
                id="pickupAddress"
                name="pickupAddress"
                value={formData.pickupAddress}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dropoffAddress">Dropoff Address</Label>
              <Input
                id="dropoffAddress"
                name="dropoffAddress"
                value={formData.dropoffAddress}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferredDate">Preferred Date & Time</Label>
              <Input
                id="preferredDate"
                name="preferredDate"
                type="datetime-local"
                value={formData.preferredDate}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="specialRequests">Special Requests</Label>
              <Textarea
                id="specialRequests"
                name="specialRequests"
                value={formData.specialRequests || ""}
                onChange={handleChange}
                rows={4}
              />
            </div>
            <Separator className="my-4" />
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end space-x-4">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-lta-purple hover:bg-lta-purple/90 text-white"
            disabled={saving}
          >
            {saving ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
