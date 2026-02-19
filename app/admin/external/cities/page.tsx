"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Edit,
  Trash2,
  Search,
  MoreHorizontal,

  ArrowUpDown,
  Building,
  MapPin,
  RefreshCw,
  AlertTriangle,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// Interface based on the provided Mongoose schema
interface Country {
  Id: number;
  Name: string;
}

interface City {
  _id?: string; // Optional for internal use
  Id: number;
  Name: string;
  images: string | null;
  Region: string;
  Country: Country;
  status?: "active" | "inactive"; // Added for UI purposes
}

export default function CitiesListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [cityToDelete, setCityToDelete] = useState<string | null>(null);
  const [cityToEdit, setCityToEdit] = useState<City | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Filters
  const [regionFilter, setRegionFilter] = useState(
    searchParams.get("regionFilter") || "all"
  );
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("statusFilter") || "all"
  );

  // Sorting
  const [sortField, setSortField] = useState(
    searchParams.get("sortBy") || "Name"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Get unique regions for filter
  const uniqueRegions = Array.from(
    new Set(cities.map((city) => city.Region).filter(Boolean))
  );

  // Fetch cities from API
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/city");

        if (!response.ok) {
          throw new Error("Failed to fetch cities");
        }

        const data = await response.json();
        console.log(data);
        setCities(data.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching cities:", err);
        setError("Failed to load cities. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load cities",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [toast]);

  // Reset image preview when edit dialog closes
  useEffect(() => {
    if (!editDialogOpen) {
      setImageFile(null);
      setImagePreview(null);
    } else if (cityToEdit?.images) {
      setImagePreview(cityToEdit.images);
    }
  }, [editDialogOpen, cityToEdit]);

  // Apply filters and search
  const filteredCities = cities.filter((city) => {
    const matchesSearch =
      city.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.Region?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.Country?.Name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRegion =
      regionFilter === "all" || city.Region === regionFilter;
    const matchesStatus =
      statusFilter === "all" || city.status === statusFilter;

    return matchesSearch && matchesRegion && matchesStatus;
  });

  // Apply sorting
  const sortedCities = [...filteredCities].sort((a, b) => {
    let valueA, valueB;

    // Handle different field types
    switch (sortField) {
      case "Name":
        valueA = a.Name?.toLowerCase() || "";
        valueB = b.Name?.toLowerCase() || "";
        break;
      case "Region":
        valueA = a.Region?.toLowerCase() || "";
        valueB = b.Region?.toLowerCase() || "";
        break;
      case "Country.Name":
        valueA = a.Country?.Name?.toLowerCase() || "";
        valueB = b.Country?.Name?.toLowerCase() || "";
        break;
      default:
        valueA = a[sortField as keyof City] || "";
        valueB = b[sortField as keyof City] || "";
    }

    // Apply sort direction
    if (sortDirection === "asc") {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  const handleDeleteClick = (id: string) => {
    setCityToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleEditClick = (city: City) => {
    setCityToEdit({ ...city });
    setEditDialogOpen(true);
    if (city.images) {
      setImagePreview(city.images);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (cityToEdit) {
      setCityToEdit({ ...cityToEdit, images: null });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!cityToDelete) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/city/${cityToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete city");
      }

      // Remove the deleted city from the state
      setCities(cities.filter((city) => city._id !== cityToDelete));

      toast({
        title: "Success",
        description: "City deleted successfully",
      });
    } catch (err) {
      console.error("Error deleting city:", err);
      toast({
        title: "Error",
        description: "Failed to delete city",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setCityToDelete(null);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityToEdit) return;

    try {
      setSaving(true);

      // Create FormData if there's an image to upload
      let requestBody;
      let requestOptions: RequestInit = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (imageFile) {
        // If we have a new image file, use FormData
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("data", JSON.stringify(cityToEdit));

        requestBody = formData;
        // Remove Content-Type header to let the browser set it with the boundary
        requestOptions = {
          method: "PUT",
          body: formData,
        };
      } else {
        // Otherwise just send JSON
        requestBody = JSON.stringify(cityToEdit);
        requestOptions = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: requestBody,
        };
      }

      const response = await fetch(
        `/api/city/${cityToEdit._id}`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error("Failed to update city");
      }

      const updatedCity = await response.json();

      // Update the city in the state
      setCities(
        cities.map((city) =>
          city._id === cityToEdit._id
            ? { ...city, ...updatedCity.data.city }
            : city
        )
      );

      toast({
        title: "Success",
        description: "City updated successfully",
      });

      setEditDialogOpen(false);
    } catch (err) {
      console.error("Error updating city:", err);
      toast({
        title: "Error",
        description: "Failed to update city",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSyncClick = () => {
    setSyncDialogOpen(true);
  };

  const handleSyncConfirm = async () => {
    try {
      setSyncing(true);
      const response = await fetch("/api/partner/sync/city", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to sync cities");
      }




      toast({
        title: "Success",
        description: "Cities synced successfully",
      });
    } catch (err) {
      console.error("Error syncing cities:", err);
      toast({
        title: "Error",
        description: "Failed to sync cities with partner API",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
      setSyncDialogOpen(false);
    }
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge color
  const getStatusBadgeClass = (status?: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800";
      default:
        return "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"; // Default to active
    }
  };

  // Handle sort change
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Cities</h1>
        <div className="flex gap-2">
          <Button
            className="bg-amber-500 hover:bg-amber-600 text-white"
            onClick={handleSyncClick}
            disabled={syncing}
          >
            {syncing ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Sync with Partner API
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search cities..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {uniqueRegions.map((region) => (
                    <SelectItem key={region} value={region || ""}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin" />
              <span className="ml-2 text-lg">Loading Cities...</span>
            </div>
          )}

          {error && !loading && (
            <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4">
              <p>{error}</p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          )}

          {!loading && !error && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead className="w-[200px]">
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("Name")}
                      >
                        City Name
                        {sortField === "Name" && (
                          <ArrowUpDown
                            className="ml-2 h-4 w-4"
                            data-direction={sortDirection}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("Region")}
                      >
                        Region
                        {sortField === "Region" && (
                          <ArrowUpDown
                            className="ml-2 h-4 w-4"
                            data-direction={sortDirection}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("Country.Name")}
                      >
                        Country
                        {sortField === "Country.Name" && (
                          <ArrowUpDown
                            className="ml-2 h-4 w-4"
                            data-direction={sortDirection}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCities.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No cities found. Try adjusting your search or filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedCities.map((city) => (
                      <TableRow key={city._id}>
                        <TableCell>
                          {city.images ? (
                            <div className="relative h-10 w-10 rounded-md overflow-hidden">
                              <Image
                                src={city.images || "/placeholder.svg"}
                                alt={city.Name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                              <Building className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <div>{city.Name}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="mr-2 text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                            </div>
                            <span>{city.Region || "N/A"}</span>
                          </div>
                        </TableCell>
                        <TableCell>{city.Country?.Name || "Tunisie"}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeClass(city.status)}>
                            {city.status
                              ? city.status.charAt(0).toUpperCase() +
                              city.status.slice(1)
                              : "Active"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleEditClick(city)}
                              >
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() =>
                                  handleDeleteClick(city._id || "")
                                }
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this city?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              city and remove it from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit City Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit City</DialogTitle>
            <DialogDescription>
              Make changes to the city information below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              {/* City Image */}
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="cityImage" className="text-right pt-2">
                  Image
                </Label>
                <div className="col-span-3">
                  {imagePreview ? (
                    <div className="relative w-full h-40 mb-2 rounded-md overflow-hidden">
                      <Image
                        src={imagePreview || "/placeholder.svg"}
                        alt="City preview"
                        fill
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">
                        Click to upload or drag and drop
                      </p>
                    </div>
                  )}
                  <Input
                    id="cityImage"
                    type="file"
                    accept="image/*"
                    className={imagePreview ? "hidden" : "mt-2"}
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              {/* City Name */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cityName" className="text-right">
                  Name
                </Label>
                <Input
                  id="cityName"
                  value={cityToEdit?.Name || ""}
                  onChange={(e) =>
                    setCityToEdit(
                      cityToEdit
                        ? { ...cityToEdit, Name: e.target.value }
                        : null
                    )
                  }
                  className="col-span-3"
                />
              </div>

              {/* City Region */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cityRegion" className="text-right">
                  Region
                </Label>
                <Input
                  id="cityRegion"
                  value={cityToEdit?.Region || ""}
                  onChange={(e) =>
                    setCityToEdit(
                      cityToEdit
                        ? { ...cityToEdit, Region: e.target.value }
                        : null
                    )
                  }
                  className="col-span-3"
                />
              </div>

              {/* Country */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="countryName" className="text-right">
                  Country
                </Label>
                <Input
                  id="countryName"
                  value={cityToEdit?.Country?.Name || "Tunisie"}
                  onChange={(e) =>
                    setCityToEdit(
                      cityToEdit
                        ? {
                          ...cityToEdit,
                          Country: {
                            ...cityToEdit.Country,
                            Name: e.target.value,
                            Id: cityToEdit.Country?.Id || 219,
                          },
                        }
                        : null
                    )
                  }
                  className="col-span-3"
                />
              </div>

              {/* Status */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cityStatus" className="text-right">
                  Status
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch
                    id="cityStatus"
                    checked={cityToEdit?.status !== "inactive"}
                    onCheckedChange={(checked) =>
                      setCityToEdit(
                        cityToEdit
                          ? {
                            ...cityToEdit,
                            status: checked ? "active" : "inactive",
                          }
                          : null
                      )
                    }
                  />
                  <Label htmlFor="cityStatus" className="cursor-pointer">
                    {cityToEdit?.status !== "inactive" ? "Active" : "Inactive"}
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-lta-purple hover:bg-lta-purple/90 text-white"
              >
                {saving && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Sync Confirmation Dialog */}
      <Dialog open={syncDialogOpen} onOpenChange={setSyncDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Sync Cities with Partner API
            </DialogTitle>
            <DialogDescription className="mt-2 text-red-600 font-medium">
              Warning: This action will override all your existing city data.
            </DialogDescription>
            <DialogDescription className="mt-2">
              This will fetch the latest city data from our partner API and
              replace your current city database. Any custom modifications
              you've made to existing cities will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSyncDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="default"
              className="bg-amber-500 hover:bg-amber-600 text-white"
              onClick={handleSyncConfirm}
              disabled={syncing}
            >
              {syncing && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
              {syncing ? "Syncing..." : "Sync Cities"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
