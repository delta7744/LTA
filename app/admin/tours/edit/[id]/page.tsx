"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  RefreshCw,
  Plus,
  Trash,
  Save,
  AlertCircle,
} from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// Define the Trip interface
interface Activity {
  activityName: string;
  activityTime?: string;
  description?: string;
  cost: number;
}

interface ItineraryDay {
  day: string;
  meals?: string;
  accommodation?: string;
  activities: Activity[];
}

interface BookingConstraints {
  minBookingDays: number;
  cancellationPolicy: string;
}

interface Trip {
  _id: string;
  title: string;
  tripType: string;
  description: string;
  transportType: string;
  transport?: string;
  departureCity: string;
  destination: string;
  duration: number;
  departureDate: string;
  returnDate: string;
  departureOptions: string;
  includedServices: string[];
  excludedServices: string[];
  tripHighlights?: string[];
  price: number;
  tax: number;
  maxParticipants: number;
  travelerType: string;
  itinerary: ItineraryDay[];
  status: string;
  accommodationDetails?: boolean;
  guideAvailable?: boolean;
  bookingConstraints: BookingConstraints;
  createdAt: string;
  updatedAt: string;
}

export default function EditTripPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [includedService, setIncludedService] = useState("");
  const [excludedService, setExcludedService] = useState("");

  const [formData, setFormData] = useState<Trip>({
    _id: "",
    title: "",
    tripType: "cultural",
    description: "",
    transportType: "flight",
    transport: "",
    departureCity: "",
    destination: "",
    duration: 0,
    departureDate: "",
    returnDate: "",
    departureOptions: "go_and_back",
    includedServices: [],
    excludedServices: [],
    tripHighlights: [],
    price: 0,
    tax: 0,
    maxParticipants: 20,
    travelerType: "any",
    itinerary: [
      {
        day: "Day 1",
        meals: "Dinner",
        accommodation: "Hotel",
        activities: [
          {
            activityName: "Arrival",
            activityTime: "",
            description: "Arrival and check-in to hotel",
            cost: 0,
          },
        ],
      },
    ],
    status: "upcoming",
    accommodationDetails: false,
    guideAvailable: false,
    bookingConstraints: {
      minBookingDays: 7,
      cancellationPolicy: "Free cancellation up to 7 days before departure",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Fetch trip data
  useEffect(() => {
    const fetchTrip = async () => {
      if (!params.id) return;

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/tours/private/${params.id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch trip details");
        }

        const { data } = await response.json();

        // Format dates for input fields
        const formattedData = {
          ...data,
          departureDate: data.departureDate
            ? new Date(data.departureDate).toISOString().split("T")[0]
            : "",
          returnDate: data.returnDate
            ? new Date(data.returnDate).toISOString().split("T")[0]
            : "",
          // Ensure arrays exist
          includedServices: data.includedServices || [],
          excludedServices: data.excludedServices || [],
          itinerary: data.itinerary || [],
          // Ensure booking constraints exist
          bookingConstraints: {
            minBookingDays: data.bookingConstraints?.minBookingDays || 7,
            cancellationPolicy:
              data.bookingConstraints?.cancellationPolicy ||
              "Free cancellation up to 7 days before departure",
          },
        };

        setFormData(formattedData);
      } catch (err) {
        console.error("Error fetching trip:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load trip details"
        );
        toast({
          title: "Error",
          description: "Failed to load trip details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [params.id, toast]);

  // Form handlers
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) || 0 : value,
      }));
    },
    []
  );

  const handleSelectChange = useCallback((name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleBookingConstraintsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        bookingConstraints: {
          ...prev.bookingConstraints,
          [name]: name === "minBookingDays" ? Number(value) || 0 : value,
        },
      }));
    },
    []
  );

  // Service management
  const addIncludedService = useCallback(() => {
    if (includedService.trim()) {
      setFormData((prev) => ({
        ...prev,
        includedServices: [...prev.includedServices, includedService.trim()],
      }));
      setIncludedService("");
    }
  }, [includedService]);

  const removeIncludedService = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      includedServices: prev.includedServices.filter((_, i) => i !== index),
    }));
  }, []);

  const addExcludedService = useCallback(() => {
    if (excludedService.trim()) {
      setFormData((prev) => ({
        ...prev,
        excludedServices: [...prev.excludedServices, excludedService.trim()],
      }));
      setExcludedService("");
    }
  }, [excludedService]);

  const removeExcludedService = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      excludedServices: prev.excludedServices.filter((_, i) => i !== index),
    }));
  }, []);

  // Itinerary management
  const addItineraryDay = useCallback(() => {
    const newDay: ItineraryDay = {
      day: `Day ${formData.itinerary.length + 1}`,
      meals: "",
      accommodation: "",
      activities: [
        {
          activityName: "",
          activityTime: "",
          description: "",
          cost: 0,
        },
      ],
    };

    setFormData((prev) => ({
      ...prev,
      itinerary: [...prev.itinerary, newDay],
    }));
  }, [formData.itinerary.length]);

  const removeItineraryDay = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index),
    }));
  }, []);

  const updateItineraryDay = useCallback(
    (index: number, field: string, value: string) => {
      setFormData((prev) => ({
        ...prev,
        itinerary: prev.itinerary.map((day, i) =>
          i === index ? { ...day, [field]: value } : day
        ),
      }));
    },
    []
  );

  const addActivity = useCallback((dayIndex: number) => {
    const newActivity: Activity = {
      activityName: "",
      description: "",
      cost: 0,
    };

    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((day, i) =>
        i === dayIndex
          ? { ...day, activities: [...day.activities, newActivity] }
          : day
      ),
    }));
  }, []);

  const removeActivity = useCallback(
    (dayIndex: number, activityIndex: number) => {
      setFormData((prev) => ({
        ...prev,
        itinerary: prev.itinerary.map((day, i) =>
          i === dayIndex
            ? {
              ...day,
              activities: day.activities.filter(
                (_, j) => j !== activityIndex
              ),
            }
            : day
        ),
      }));
    },
    []
  );

  const updateActivity = useCallback(
    (
      dayIndex: number,
      activityIndex: number,
      field: string,
      value: string | number
    ) => {
      setFormData((prev) => ({
        ...prev,
        itinerary: prev.itinerary.map((day, i) =>
          i === dayIndex
            ? {
              ...day,
              activities: day.activities.map((activity, j) =>
                j === activityIndex
                  ? {
                    ...activity,
                    [field]: field === "cost" ? Number(value) || 0 : value,
                  }
                  : activity
              ),
            }
            : day
        ),
      }));
    },
    []
  );

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Tour title is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Tour description is required",
        variant: "destructive",
      });
      return;
    }

    if (formData.price <= 0) {
      toast({
        title: "Validation Error",
        description: "Price must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`/api/tours/private/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          updatedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update tour");
      }

      toast({
        title: "Success",
        description: "Tour updated successfully",
      });

      // Navigate back to the trip details page
      router.push(`/admin/tours/details/${params.id}`);
    } catch (err) {
      console.error("Error updating trip:", err);
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to update trip",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <RefreshCw className="h-8 w-8 animate-spin text-lta-purple" />
        <span className="ml-2 text-lg">Loading trip details...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">

          <h1 className="text-3xl font-bold">Edit Tour</h1>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-600 font-medium">{error}</p>
            </div>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Tour</h1>
          <p className="text-muted-foreground">
            Update tour information and settings
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Tour Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter tour title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tripType">Trip Type</Label>
                    <Select
                      value={formData.tripType}
                      onValueChange={(value) =>
                        handleSelectChange("tripType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select trip type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cultural">Cultural</SelectItem>
                        <SelectItem value="adventure">Adventure</SelectItem>
                        <SelectItem value="beach">Beach</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    required
                    placeholder="Describe the tour in detail"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="transportType">Transport Type</Label>
                    <Select
                      value={formData.transportType}
                      onValueChange={(value) =>
                        handleSelectChange("transportType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select transport type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flight">Flight</SelectItem>
                        <SelectItem value="bus">Bus</SelectItem>
                        <SelectItem value="train">Train</SelectItem>
                        <SelectItem value="cruise">Cruise</SelectItem>
                        <SelectItem value="car">Car</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="travelerType">Traveler Type</Label>
                    <Select
                      value={formData.travelerType}
                      onValueChange={(value) =>
                        handleSelectChange("travelerType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select traveler type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="adult">Adult Only</SelectItem>
                        <SelectItem value="child">Child Friendly</SelectItem>
                        <SelectItem value="senior">Senior Friendly</SelectItem>
                        <SelectItem value="any">Any Age</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="departureCity">Departure City *</Label>
                    <Input
                      id="departureCity"
                      name="departureCity"
                      value={formData.departureCity}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Tunis"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination *</Label>
                    <Input
                      id="destination"
                      name="destination"
                      value={formData.destination}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Paris"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (days) *</Label>
                    <Input
                      id="duration"
                      name="duration"
                      type="number"
                      min="1"
                      value={formData.duration}
                      onChange={handleInputChange}
                      required
                      placeholder="7"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="departureDate">Departure Date *</Label>
                    <Input
                      id="departureDate"
                      name="departureDate"
                      type="date"
                      value={formData.departureDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="returnDate">Return Date</Label>
                    <Input
                      id="returnDate"
                      name="returnDate"
                      type="date"
                      value={formData.returnDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Departure Options</Label>
                  <RadioGroup
                    value={formData.departureOptions}
                    onValueChange={(value) =>
                      handleSelectChange("departureOptions", value)
                    }
                    className="flex flex-wrap gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="go_only" id="go_only" />
                      <Label htmlFor="go_only">Go Only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="go_and_back" id="go_and_back" />
                      <Label htmlFor="go_and_back">Go and Back</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="customizable" id="customizable" />
                      <Label htmlFor="customizable">Customizable</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing & Capacity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (TND) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tax">Tax (TND)</Label>
                    <Input
                      id="tax"
                      name="tax"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.tax}
                      onChange={handleInputChange}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxParticipants">Max Participants *</Label>
                    <Input
                      id="maxParticipants"
                      name="maxParticipants"
                      type="number"
                      min="1"
                      value={formData.maxParticipants}
                      onChange={handleInputChange}
                      required
                      placeholder="20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleSelectChange("status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="sold_out">Sold Out</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                      <SelectItem value="canceled">Canceled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Booking Constraints</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minBookingDays">Minimum Booking Days</Label>
                    <Input
                      id="minBookingDays"
                      name="minBookingDays"
                      type="number"
                      min="0"
                      value={formData.bookingConstraints?.minBookingDays || ""}
                      onChange={handleBookingConstraintsChange}
                      placeholder="7"
                    />
                    <p className="text-xs text-muted-foreground">
                      Minimum days before departure for booking
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cancellationPolicy">
                    Cancellation Policy
                  </Label>
                  <Textarea
                    id="cancellationPolicy"
                    name="cancellationPolicy"
                    value={
                      formData.bookingConstraints?.cancellationPolicy || ""
                    }
                    onChange={handleBookingConstraintsChange}
                    rows={4}
                    placeholder="Describe the cancellation policy"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Itinerary Tab */}
          <TabsContent value="itinerary">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Itinerary</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addItineraryDay}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Day
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {formData.itinerary.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className="space-y-4 p-4 border rounded-lg"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">
                        Day {dayIndex + 1}
                      </h3>
                      {formData.itinerary.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItineraryDay(dayIndex)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`day-title-${dayIndex}`}>
                          Day Title
                        </Label>
                        <Input
                          id={`day-title-${dayIndex}`}
                          value={day.day}
                          onChange={(e) =>
                            updateItineraryDay(dayIndex, "day", e.target.value)
                          }
                          placeholder={`Day ${dayIndex + 1}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`day-meals-${dayIndex}`}>Meals</Label>
                        <Input
                          id={`day-meals-${dayIndex}`}
                          value={day.meals || ""}
                          onChange={(e) =>
                            updateItineraryDay(
                              dayIndex,
                              "meals",
                              e.target.value
                            )
                          }
                          placeholder="e.g., Breakfast, Lunch, Dinner"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`day-accommodation-${dayIndex}`}>
                          Accommodation
                        </Label>
                        <Input
                          id={`day-accommodation-${dayIndex}`}
                          value={day.accommodation || ""}
                          onChange={(e) =>
                            updateItineraryDay(
                              dayIndex,
                              "accommodation",
                              e.target.value
                            )
                          }
                          placeholder="e.g., Hotel, Resort"
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label className="text-base font-medium">
                          Activities
                        </Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addActivity(dayIndex)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Activity
                        </Button>
                      </div>

                      {day.activities.map((activity, activityIndex) => (
                        <div
                          key={activityIndex}
                          className="p-3 border rounded-md space-y-3 bg-gray-50"
                        >
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-medium">
                              Activity {activityIndex + 1}
                            </h4>
                            {day.activities.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  removeActivity(dayIndex, activityIndex)
                                }
                              >
                                <Trash className="h-3 w-3" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label
                                htmlFor={`activity-name-${dayIndex}-${activityIndex}`}
                              >
                                Activity Name *
                              </Label>
                              <Input
                                id={`activity-name-${dayIndex}-${activityIndex}`}
                                value={activity.activityName}
                                onChange={(e) =>
                                  updateActivity(
                                    dayIndex,
                                    activityIndex,
                                    "activityName",
                                    e.target.value
                                  )
                                }
                                placeholder="e.g., City Tour"
                                required
                              />
                            </div>
                            <div className="space-y-1">
                              <Label
                                htmlFor={`activity-cost-${dayIndex}-${activityIndex}`}
                              >
                                Cost (TND)
                              </Label>
                              <Input
                                id={`activity-cost-${dayIndex}-${activityIndex}`}
                                type="number"
                                min="0"
                                step="0.01"
                                value={activity.cost}
                                onChange={(e) =>
                                  updateActivity(
                                    dayIndex,
                                    activityIndex,
                                    "cost",
                                    e.target.value
                                  )
                                }
                                placeholder="0.00"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <Label
                              htmlFor={`activity-description-${dayIndex}-${activityIndex}`}
                            >
                              Description
                            </Label>
                            <Textarea
                              id={`activity-description-${dayIndex}-${activityIndex}`}
                              value={activity.description || ""}
                              onChange={(e) =>
                                updateActivity(
                                  dayIndex,
                                  activityIndex,
                                  "description",
                                  e.target.value
                                )
                              }
                              rows={2}
                              placeholder="Describe the activity"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Included Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add included service..."
                    value={includedService}
                    onChange={(e) => setIncludedService(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), addIncludedService())
                    }
                  />
                  <Button
                    type="button"
                    onClick={addIncludedService}
                    disabled={!includedService.trim()}
                  >
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.includedServices.map((service, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 border rounded-md bg-green-50"
                    >
                      <span className="text-sm">{service}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeIncludedService(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {formData.includedServices.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No included services added yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Excluded Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add excluded service..."
                    value={excludedService}
                    onChange={(e) => setExcludedService(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), addExcludedService())
                    }
                  />
                  <Button
                    type="button"
                    onClick={addExcludedService}
                    disabled={!excludedService.trim()}
                  >
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.excludedServices.map((service, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 border rounded-md bg-red-50"
                    >
                      <span className="text-sm">{service}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExcludedService(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {formData.excludedServices.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No excluded services added yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-4 pt-6 border-t">
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
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
