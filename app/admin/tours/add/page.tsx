"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  CalendarIcon,
  Plus,
  Minus,
  Upload,
  DollarSign,
  Check,
  X,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

// Validation schemas
const activitySchema = z.object({
  activityName: z.string().min(1, "Activity name is required"),
  activityTime: z.date(),
  description: z.string().min(1, "Description is required"),
  cost: z.number().min(0, "Cost must be positive"),
});

const itineraryDaySchema = z.object({
  day: z.string().min(1, "Day title is required"),
  activities: z
    .array(activitySchema)
    .min(1, "At least one activity is required"),
  meals: z.string().min(1, "Meals information is required"),
  accommodation: z.string().min(1, "Accommodation information is required"),
});

const tourFormSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title too long"),
  tripType: z.enum(["cultural", "adventure", "beach"]),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description too long"),
  transportType: z.enum(["flight", "bus", "train", "cruise"]),
  departureCity: z.string().min(1, "Departure city is required"),
  destination: z.string().min(1, "Destination is required"),
  duration: z
    .number()
    .min(1, "Duration must be at least 1 day")
    .max(365, "Duration too long"),
  departureOptions: z.enum(["go_only", "go_and_back"]),
  price: z.number().min(1, "Price must be greater than 0"),
  maxParticipants: z
    .number()
    .min(1, "Must allow at least 1 participant")
    .max(100, "Too many participants"),
  travelerType: z.enum(["any", "adult", "child", "senior"]),
  hotel: z.string().min(1, "Hotel information is required"),
  tax: z.number().min(0, "Tax must be positive"),
  transport: z.string().min(1, "Transport details are required"),
  accommodationDetails: z.string().min(1, "Accommodation details are required"),
  mealsIncluded: z.boolean(),
  guideAvailable: z.boolean(),
  status: z.enum(["active", "sold_out", "upcoming", "archived", "canceled"]),
  departureDate: z
    .date()
    .min(new Date(), "Departure date must be in the future"),
  returnDate: z.date().optional(),
});

type TourFormData = z.infer<typeof tourFormSchema>;

const tunisiaRegions = [
  "Tunis",
  "Ariana",
  "Ben Arous",
  "Manouba",
  "Nabeul",
  "Zaghouan",
  "Bizerte",
  "Béja",
  "Jendouba",
  "Kef",
  "Siliana",
  "Kairouan",
  "Kasserine",
  "Sidi Bouzid",
  "Sousse",
  "Monastir",
  "Mahdia",
  "Sfax",
  "Gafsa",
  "Tozeur",
  "Kebili",
  "Gabès",
  "Medenine",
  "Tataouine",
];

export default function AddTourPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Dynamic arrays state
  const [itinerary, setItinerary] = useState([
    {
      day: "Day 1",
      activities: [
        {
          activityName: "",
          activityTime: new Date(),
          description: "",
          cost: 0,
        },
      ],
      meals: "",
      accommodation: "",
    },
  ]);
  const [includedServices, setIncludedServices] = useState([""]);
  const [excludedServices, setExcludedServices] = useState([""]);
  const [tripHighlights, setTripHighlights] = useState([""]);
  const [images, setImages] = useState<File[]>([]);

  const form = useForm<TourFormData>({
    resolver: zodResolver(tourFormSchema),
    defaultValues: {
      title: "",
      tripType: "cultural",
      description: "",
      transportType: "bus",
      departureCity: "tunis",
      destination: "",
      duration: 7,
      departureOptions: "go_and_back",
      price: 0,
      maxParticipants: 5,
      travelerType: "any",
      hotel: "",
      tax: 0,
      transport: "",
      accommodationDetails: "",
      mealsIncluded: false,
      guideAvailable: false,
      status: "active",
    },
  });

  // Calculate form completion progress
  const getFormProgress = () => {
    const values = form.getValues();
    const requiredFields = [
      values.title,
      values.description,
      values.destination,
      values.hotel,
      values.transport,
      values.accommodationDetails,
      values.departureDate,
    ];
    const filledFields = requiredFields.filter(
      (field) => field && field.toString().trim() !== ""
    ).length;
    const hasItinerary = itinerary.some(
      (day) =>
        day.activities.some(
          (activity) => activity.activityName && activity.description
        ) &&
        day.meals &&
        day.accommodation
    );
    const hasServices = includedServices.some(
      (service) => service.trim() !== ""
    );
    const hasHighlights = tripHighlights.some(
      (highlight) => highlight.trim() !== ""
    );
    const hasImages = images.length > 0;

    let totalProgress = (filledFields / requiredFields.length) * 60;
    if (hasItinerary) totalProgress += 15;
    if (hasServices) totalProgress += 10;
    if (hasHighlights) totalProgress += 10;
    if (hasImages) totalProgress += 5;

    return Math.min(totalProgress, 100);
  };

  // Validation for dynamic arrays
  const validateCurrentTab = () => {
    switch (activeTab) {
      case "basic":
        return form.trigger(["title", "tripType", "description"]);
      case "details":
        return form.trigger([
          "departureCity",
          "destination",
          "duration",
          "price",
          "hotel",
          "transport",
          "accommodationDetails",
        ]);
      case "services":
        return (
          includedServices.some((service) => service.trim() !== "") &&
          excludedServices.some((service) => service.trim() !== "")
        );
      case "itinerary":
        return itinerary.every(
          (day) =>
            day.day.trim() !== "" &&
            day.activities.every(
              (activity) =>
                activity.activityName.trim() !== "" &&
                activity.description.trim() !== ""
            ) &&
            day.meals.trim() !== "" &&
            day.accommodation.trim() !== ""
        );
      case "media":
        return images.length > 0;
      default:
        return true;
    }
  };

  const handleNextTab = async () => {
    const isValid = await validateCurrentTab();
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      });
      return;
    }

    const tabs = ["basic", "details", "services", "itinerary", "media"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const handlePreviousTab = () => {
    const tabs = ["basic", "details", "services", "itinerary", "media"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  // Dynamic array handlers
  const addItineraryDay = () => {
    setItinerary([
      ...itinerary,
      {
        day: `Day ${itinerary.length + 1}`,
        activities: [
          {
            activityName: "",
            activityTime: new Date(),
            description: "",
            cost: 0,
          },
        ],
        meals: "",
        accommodation: "",
      },
    ]);
  };

  const addActivity = (dayIndex: number) => {
    const updatedItinerary = [...itinerary];
    updatedItinerary[dayIndex].activities.push({
      activityName: "",
      activityTime: new Date(),
      description: "",
      cost: 0,
    });
    setItinerary(updatedItinerary);
  };

  const updateActivity = (
    dayIndex: number,
    activityIndex: number,
    field: string,
    value: any
  ) => {
    const updatedItinerary = [...itinerary];
    updatedItinerary[dayIndex].activities[activityIndex] = {
      ...updatedItinerary[dayIndex].activities[activityIndex],
      [field]: field === "activityTime" && value ? new Date(value) : value,
    };
    setItinerary(updatedItinerary);
  };

  const updateItineraryDay = (index: number, field: string, value: string) => {
    const updatedItinerary = [...itinerary];
    updatedItinerary[index] = { ...updatedItinerary[index], [field]: value };
    setItinerary(updatedItinerary);
  };

  const addTripHighlight = () => {
    setTripHighlights([...tripHighlights, ""]);
  };

  const updateTripHighlight = (index: number, value: string) => {
    const updatedHighlights = [...tripHighlights];
    updatedHighlights[index] = value;
    setTripHighlights(updatedHighlights);
  };

  const addIncludedService = () => {
    setIncludedServices([...includedServices, ""]);
  };

  const updateIncludedService = (index: number, value: string) => {
    const updatedServices = [...includedServices];
    updatedServices[index] = value;
    setIncludedServices(updatedServices);
  };

  const addExcludedService = () => {
    setExcludedServices([...excludedServices, ""]);
  };

  const updateExcludedService = (index: number, value: string) => {
    const updatedServices = [...excludedServices];
    updatedServices[index] = value;
    setExcludedServices(updatedServices);
  };

  const handleImageUpload = (files: FileList) => {
    const validFiles = Array.from(files).filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 5MB`,
          variant: "destructive",
        });
        return false;
      }
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    setImages((prev) => [...prev, ...validFiles]);
  };

  const onSubmit = async (data: TourFormData) => {
    setLoading(true);
    setSubmitError(null);

    try {
      // Validate dynamic arrays
      if (
        !itinerary.every(
          (day) =>
            day.day.trim() !== "" &&
            day.activities.every(
              (activity) =>
                activity.activityName.trim() !== "" &&
                activity.description.trim() !== ""
            ) &&
            day.meals.trim() !== "" &&
            day.accommodation.trim() !== ""
        )
      ) {
        throw new Error("Please complete all itinerary information");
      }

      if (!includedServices.some((service) => service.trim() !== "")) {
        throw new Error("Please add at least one included service");
      }

      if (!tripHighlights.some((highlight) => highlight.trim() !== "")) {
        throw new Error("Please add at least one trip highlight");
      }

      if (images.length === 0) {
        throw new Error("Please upload at least one image");
      }

      const formData = new FormData();

      // Add form data
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else {
          formData.append(key, value.toString());
        }
      });

      // Add dynamic arrays
      itinerary.forEach((day, dayIndex) => {
        formData.append(`itinerary[${dayIndex}][day]`, day.day);
        day.activities.forEach((activity, activityIndex) => {
          formData.append(
            `itinerary[${dayIndex}][activities][${activityIndex}][activityName]`,
            activity.activityName
          );
          formData.append(
            `itinerary[${dayIndex}][activities][${activityIndex}][activityTime]`,
            activity.activityTime.toISOString()
          );
          formData.append(
            `itinerary[${dayIndex}][activities][${activityIndex}][description]`,
            activity.description
          );
          formData.append(
            `itinerary[${dayIndex}][activities][${activityIndex}][cost]`,
            activity.cost.toString()
          );
        });
        formData.append(`itinerary[${dayIndex}][meals]`, day.meals);
        formData.append(
          `itinerary[${dayIndex}][accommodation]`,
          day.accommodation
        );
      });

      includedServices
        .filter((s) => s.trim())
        .forEach((service, index) => {
          formData.append(`includedServices[${index}]`, service);
        });

      excludedServices
        .filter((s) => s.trim())
        .forEach((service, index) => {
          formData.append(`excludedServices[${index}]`, service);
        });

      tripHighlights
        .filter((h) => h.trim())
        .forEach((highlight, index) => {
          formData.append(`tripHighlights[${index}]`, highlight);
        });

      images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await fetch("/api/tours/private", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create tour");
      }

      toast({
        title: "Success!",
        description: "Tour package created successfully",
      });

      router.push("/admin/tours");
    } catch (error) {
      console.error("Error creating tour package:", error);
      setSubmitError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">

          <div>
            <h1 className="text-3xl font-bold">Add New Tour</h1>
            <p className="text-muted-foreground">
              Create a comprehensive tour package
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground mb-1">
            Form Progress
          </div>
          <div className="flex items-center gap-2">
            <Progress value={getFormProgress()} className="w-32" />
            <span className="text-sm font-medium">
              {Math.round(getFormProgress())}%
            </span>
          </div>
        </div>
      </div>

      {submitError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-current opacity-60" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="details" className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-current opacity-60" />
                Details
              </TabsTrigger>
              <TabsTrigger value="services" className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-current opacity-60" />
                Services
              </TabsTrigger>
              <TabsTrigger
                value="itinerary"
                className="flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-current opacity-60" />
                Itinerary
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-current opacity-60" />
                Media
              </TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Basic Package Information
                  </CardTitle>
                  <CardDescription>
                    Enter the essential information about your tour package.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="lg:col-span-2">
                          <FormLabel>Tour Title *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter an engaging tour title"
                              {...field}
                              className="text-lg"
                            />
                          </FormControl>
                          <FormDescription>
                            This will be the main title displayed to customers
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tripType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trip Type *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select trip type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="cultural">Cultural</SelectItem>
                              <SelectItem value="adventure">
                                Adventure
                              </SelectItem>
                              <SelectItem value="beach">Beach</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="departureOptions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Departure Options *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select departure option" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="go_only">One Way</SelectItem>
                              <SelectItem value="go_and_back">
                                Round Trip
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="travelerType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Traveler Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select traveler type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="any">Any Age</SelectItem>
                              <SelectItem value="adult">Adults Only</SelectItem>
                              <SelectItem value="child">
                                Family Friendly
                              </SelectItem>
                              <SelectItem value="senior">
                                Senior Friendly
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="sold_out">Sold Out</SelectItem>
                              <SelectItem value="upcoming">Upcoming</SelectItem>
                              <SelectItem value="archived">Archived</SelectItem>
                              <SelectItem value="canceled">Canceled</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your tour package in detail..."
                            rows={5}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a compelling description that highlights what
                          makes this tour special
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Trip Highlights</h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addTripHighlight}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Highlight
                      </Button>
                    </div>

                    {tripHighlights.map((highlight, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <Input
                          placeholder="Enter a key highlight of this tour"
                          value={highlight}
                          onChange={(e) =>
                            updateTripHighlight(index, e.target.value)
                          }
                        />
                        {tripHighlights.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setTripHighlights(
                                tripHighlights.filter((_, i) => i !== index)
                              )
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/admin/tours")}
                  >
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleNextTab}>
                    Next: Package Details
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Package Details Tab */}
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Package Details</CardTitle>
                  <CardDescription>
                    Configure the specifics of your tour package.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="departureCity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Departure City *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select departure city" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {tunisiaRegions.map((region) => (
                                <SelectItem
                                  key={region}
                                  value={region.toLowerCase()}
                                >
                                  {region}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="destination"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Destination *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter destination" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration (Days) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="365"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  Number.parseInt(e.target.value) || 0
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxParticipants"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Participants *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="100"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  Number.parseInt(e.target.value) || 0
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="number"
                                min="1"
                                step="0.01"
                                className="pl-8"
                                placeholder="0.00"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    Number.parseFloat(e.target.value) || 0
                                  )
                                }
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tax Amount</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                className="pl-8"
                                placeholder="0.00"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    Number.parseFloat(e.target.value) || 0
                                  )
                                }
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="departureDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Departure Date *</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"
                                    }`}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value
                                    ? format(field.value, "PPP")
                                    : "Select departure date"}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <CalendarComponent
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="returnDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Return Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"
                                    }`}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value
                                    ? format(field.value, "PPP")
                                    : "Select return date"}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <CalendarComponent
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => {
                                  const departureDate =
                                    form.getValues("departureDate");
                                  return (
                                    date < new Date() ||
                                    (departureDate && date <= departureDate)
                                  );
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      Accommodation & Transport
                    </h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="transportType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Transport Type *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select transport type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="flight">Flight</SelectItem>
                                <SelectItem value="bus">Bus</SelectItem>
                                <SelectItem value="train">Train</SelectItem>
                                <SelectItem value="cruise">Cruise</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="hotel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hotel *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter hotel name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="transport"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Transport Details *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter transport details"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="accommodationDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Accommodation Details *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the accommodation arrangements"
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Package Options</h3>

                    <div className="flex flex-col gap-4">
                      <FormField
                        control={form.control}
                        name="mealsIncluded"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Meals Included</FormLabel>
                              <FormDescription>
                                Check if meals are included in the package
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="guideAvailable"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Guide Available</FormLabel>
                              <FormDescription>
                                Check if a tour guide is available
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePreviousTab}
                  >
                    Previous
                  </Button>
                  <Button type="button" onClick={handleNextTab}>
                    Next: Services
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services">
              <Card>
                <CardHeader>
                  <CardTitle>Included & Excluded Services</CardTitle>
                  <CardDescription>
                    Specify what services are included and excluded in the
                    package.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-green-700">
                        Included Services
                      </h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addIncludedService}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Service
                      </Button>
                    </div>

                    {includedServices.map((service, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <Input
                          placeholder="Enter included service"
                          value={service}
                          onChange={(e) =>
                            updateIncludedService(index, e.target.value)
                          }
                        />
                        {includedServices.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setIncludedServices(
                                includedServices.filter((_, i) => i !== index)
                              )
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-red-700">
                        Excluded Services
                      </h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addExcludedService}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Service
                      </Button>
                    </div>

                    {excludedServices.map((service, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <X className="h-4 w-4 text-red-500 flex-shrink-0" />
                        <Input
                          placeholder="Enter excluded service"
                          value={service}
                          onChange={(e) =>
                            updateExcludedService(index, e.target.value)
                          }
                        />
                        {excludedServices.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setExcludedServices(
                                excludedServices.filter((_, i) => i !== index)
                              )
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePreviousTab}
                  >
                    Previous
                  </Button>
                  <Button type="button" onClick={handleNextTab}>
                    Next: Itinerary
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Itinerary Tab */}
            <TabsContent value="itinerary">
              <Card>
                <CardHeader>
                  <CardTitle>Itinerary</CardTitle>
                  <CardDescription>
                    Create a detailed day-by-day itinerary for the tour package.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {itinerary.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className="border rounded-lg p-6 space-y-4 bg-muted/20"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-sm">
                            Day {dayIndex + 1}
                          </Badge>
                          <Input
                            className="font-medium"
                            placeholder="Day title (e.g., Arrival & City Tour)"
                            value={day.day}
                            onChange={(e) =>
                              updateItineraryDay(
                                dayIndex,
                                "day",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        {itinerary.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setItinerary(
                                itinerary.filter((_, i) => i !== dayIndex)
                              )
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-sm font-medium">Activities</h4>

                        {day.activities.map((activity, activityIndex) => (
                          <div
                            key={activityIndex}
                            className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 border rounded-md bg-background"
                          >
                            <div className="space-y-2">
                              <Label
                                htmlFor={`activity-${dayIndex}-${activityIndex}`}
                              >
                                Activity Name *
                              </Label>
                              <Input
                                id={`activity-${dayIndex}-${activityIndex}`}
                                placeholder="Enter activity name"
                                value={activity.activityName}
                                onChange={(e) =>
                                  updateActivity(
                                    dayIndex,
                                    activityIndex,
                                    "activityName",
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            <div className="space-y-2">
                              <Label
                                htmlFor={`activity-time-${dayIndex}-${activityIndex}`}
                              >
                                Activity Time
                              </Label>
                              <Input
                                id={`activity-time-${dayIndex}-${activityIndex}`}
                                type="datetime-local"
                                value={
                                  activity.activityTime
                                    ? new Date(activity.activityTime)
                                      .toISOString()
                                      .slice(0, 16)
                                    : ""
                                }
                                onChange={(e) =>
                                  updateActivity(
                                    dayIndex,
                                    activityIndex,
                                    "activityTime",
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            <div className="space-y-2">
                              <Label
                                htmlFor={`description-${dayIndex}-${activityIndex}`}
                              >
                                Description *
                              </Label>
                              <Input
                                id={`description-${dayIndex}-${activityIndex}`}
                                placeholder="Enter description"
                                value={activity.description}
                                onChange={(e) =>
                                  updateActivity(
                                    dayIndex,
                                    activityIndex,
                                    "description",
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            <div className="space-y-2">
                              <Label
                                htmlFor={`cost-${dayIndex}-${activityIndex}`}
                              >
                                Cost (Optional)
                              </Label>
                              <div className="relative">
                                <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  id={`cost-${dayIndex}-${activityIndex}`}
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  className="pl-8"
                                  placeholder="0.00"
                                  value={activity.cost?.toString() || ""}
                                  onChange={(e) =>
                                    updateActivity(
                                      dayIndex,
                                      activityIndex,
                                      "cost",
                                      Number.parseFloat(e.target.value) || 0
                                    )
                                  }
                                />
                              </div>
                            </div>

                            {day.activities.length > 1 && (
                              <div className="lg:col-span-4 flex justify-end">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const updatedItinerary = [...itinerary];
                                    updatedItinerary[dayIndex].activities =
                                      day.activities.filter(
                                        (_, i) => i !== activityIndex
                                      );
                                    setItinerary(updatedItinerary);
                                  }}
                                >
                                  <Minus className="h-4 w-4 mr-2" />
                                  Remove Activity
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addActivity(dayIndex)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Activity
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`meals-${dayIndex}`}>Meals *</Label>
                          <Input
                            id={`meals-${dayIndex}`}
                            placeholder="e.g., Breakfast, Lunch, Dinner"
                            value={day.meals}
                            onChange={(e) =>
                              updateItineraryDay(
                                dayIndex,
                                "meals",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`accommodation-${dayIndex}`}>
                            Accommodation *
                          </Label>
                          <Input
                            id={`accommodation-${dayIndex}`}
                            placeholder="e.g., Hotel, Hostel, Outdoor Camp"
                            value={day.accommodation}
                            onChange={(e) =>
                              updateItineraryDay(
                                dayIndex,
                                "accommodation",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={addItineraryDay}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Day
                  </Button>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePreviousTab}
                  >
                    Previous
                  </Button>
                  <Button type="button" onClick={handleNextTab}>
                    Next: Media
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Media Tab */}
            <TabsContent value="media">
              <Card>
                <CardHeader>
                  <CardTitle>Media</CardTitle>
                  <CardDescription>
                    Upload high-quality images for your tour package. First
                    image will be used as the main cover.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label>Package Images *</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {images.map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-video bg-muted rounded-lg overflow-hidden group"
                        >
                          <img
                            src={
                              URL.createObjectURL(image) || "/placeholder.svg"
                            }
                            alt={`Package image ${index + 1}`}
                            className="object-cover w-full h-full"
                          />
                          {index === 0 && (
                            <Badge className="absolute top-2 left-2 bg-lta-purple">
                              Cover Image
                            </Badge>
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                setImages(images.filter((_, i) => i !== index))
                              }
                            >
                              <X className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}

                      <label className="border-2 border-dashed rounded-lg aspect-video flex flex-col items-center justify-center p-6 hover:bg-muted/50 cursor-pointer transition-colors">
                        <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground text-center">
                          Click to upload images
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Max 5MB per image
                        </p>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              handleImageUpload(e.target.files);
                            }
                          }}
                        />
                      </label>
                    </div>
                    {images.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        Please upload at least one image for your tour package.
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePreviousTab}
                  >
                    Previous
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="min-w-[120px]"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Tour Package"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}
