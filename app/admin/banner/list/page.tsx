"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Edit,
  Trash2,
  Search,
  MoreHorizontal,
  RefreshCw,
  Upload,
  X,
  Plus,
  Filter,
  Download,

  ImageIcon,
  LinkIcon,
  BarChart3,
  Activity,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export interface Banner {
  _id: string;
  title: string;
  subTitle: string;
  image: string;
  link: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function BannerListPage() {
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<string | null>(null);
  const [bannerToEdit, setBannerToEdit] = useState<Banner | null>(null);
  const [bannerToCreate, setBannerToCreate] = useState<Banner | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/banner/private");
        if (!response.ok) throw new Error("Failed to fetch banners");
        const data = await response.json();
        setBanners(data.data || []);
        setError(null);
      } catch (err) {
        setError("Failed to load banners. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load banners",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, [toast]);

  // Reset image preview when edit/create dialog closes
  useEffect(() => {
    if (!editDialogOpen && !createDialogOpen) {
      setImageFile(null);
      setImagePreview(null);
    }
  }, [editDialogOpen, createDialogOpen]);

  // Set image preview when edit dialog opens
  useEffect(() => {
    if (editDialogOpen && bannerToEdit?.image) {
      setImagePreview(bannerToEdit.image);
      setImageFile(null); // Clear any file selection
    }
  }, [editDialogOpen, bannerToEdit]);

  // Clear image preview when create dialog opens
  useEffect(() => {
    if (createDialogOpen) {
      setImagePreview(null);
      setImageFile(null);
    }
  }, [createDialogOpen]);

  // Apply filters and search
  const filteredBanners = banners
    .filter((banner) => {
      const matchesSearch =
        banner.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        banner.subTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        banner.link?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && banner.isActive) ||
        (statusFilter === "inactive" && !banner.isActive);

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let valueA: any;
      let valueB: any;

      switch (sortBy) {
        case "title":
        case "subTitle":
          valueA = a[sortBy].toLowerCase();
          valueB = b[sortBy].toLowerCase();
          break;
        case "createdAt":
        case "updatedAt":
          valueA = new Date(a[sortBy] || 0);
          valueB = new Date(b[sortBy] || 0);
          break;
        default:
          valueA = a[sortBy as keyof Banner];
          valueB = b[sortBy as keyof Banner];
      }

      if (sortOrder === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

  const handleDeleteClick = (id: string) => {
    setBannerToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleEditClick = (banner: Banner) => {
    setBannerToEdit({ ...banner });
    setEditDialogOpen(true);
    // Clear any previous file selection and set preview from banner
    setImageFile(null);
    setImagePreview(banner.image || null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (editDialogOpen && bannerToEdit)
      setBannerToEdit({ ...bannerToEdit, image: "" });
    if (createDialogOpen && bannerToCreate)
      setBannerToCreate({ ...bannerToCreate, image: "" });
  };

  const handleDeleteConfirm = async () => {
    if (!bannerToDelete) return;
    try {
      setLoading(true);
      const response = await fetch(`/api/banner/private/${bannerToDelete}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete banner");
      setBanners(banners.filter((b) => b._id !== bannerToDelete));
      toast({ title: "Success", description: "Banner deleted successfully" });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete banner",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setBannerToDelete(null);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerToEdit) return;

    setSaving(true);
    try {
      const url = `/api/banner/private/${bannerToEdit._id}`;
      let options: RequestInit;

      if (imageFile) {
        const formData = new FormData();
        Object.entries(bannerToEdit).forEach(([key, value]) => {
          formData.append(key, value.toString());
        });
        formData.append("images", imageFile);
        options = { method: "PUT", body: formData };
      } else {
        options = {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bannerToEdit),
        };
      }

      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Failed to update banner");

      const { data } = await response.json();
      setBanners((prev) =>
        prev.map((b) => (b._id === data._id ? { ...b, ...data } : b))
      );

      toast({ title: "Success", description: "Banner updated successfully" });
      setEditDialogOpen(false);
    } catch {
      toast({
        title: "Error",
        description: "Failed to update banner",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCreateClick = () => {
    setBannerToCreate({
      _id: "",
      title: "",
      subTitle: "",
      image: "",
      link: "",
      isActive: true,
    });
    // Clear image state immediately
    setImageFile(null);
    setImagePreview(null);
    setCreateDialogOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerToCreate) return;
    try {
      setSaving(true);
      let requestOptions: RequestInit;
      if (imageFile) {
        const formData = new FormData();
        formData.append("images", imageFile);
        formData.append("title", bannerToCreate.title);
        formData.append("subTitle", bannerToCreate.subTitle);
        formData.append("link", bannerToCreate.link);
        formData.append("isActive", bannerToCreate.isActive.toString());
        requestOptions = { method: "POST", body: formData };
      } else {
        requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bannerToCreate),
        };
      }
      const response = await fetch("/api/banner/private", requestOptions);
      if (!response.ok) throw new Error("Failed to create banner");
      const createdBanner = await response.json();
      setBanners([createdBanner.data, ...banners]);
      toast({ title: "Success", description: "Banner created successfully" });
      setCreateDialogOpen(false);
    } catch {
      toast({
        title: "Error",
        description: "Failed to create banner",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
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
  const getStatusBadgeClass = (isActive: boolean) =>
    isActive
      ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
      : "bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800";

  // Get banner statistics
  const getBannerStats = () => {
    const total = banners.length;
    const active = banners.filter((b) => b.isActive).length;
    const inactive = banners.filter((b) => !b.isActive).length;
    const withImages = banners.filter((b) => b.image).length;

    return {
      total,
      active,
      inactive,
      withImages,
    };
  };

  const stats = getBannerStats();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ImageIcon className="h-8 w-8 text-lta-purple" />
            Banner Management
          </h1>
          <p className="text-muted-foreground">
            Manage and view all website banners
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          <Button onClick={handleCreateClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Banner
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Banners</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.active} active, {stats.inactive} inactive
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Banners
            </CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
            <p className="text-xs text-muted-foreground">Currently displayed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inactive Banners
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.inactive}
            </div>
            <p className="text-xs text-muted-foreground">Not displayed</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by title, subtitle, or link..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
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
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Created Date</SelectItem>
                  <SelectItem value="updatedAt">Updated Date</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="subTitle">Subtitle</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Banners ({filteredBanners.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading && (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin" />
              <span className="ml-2 text-lg">Loading Banners...</span>
            </div>
          )}

          {error && !loading && (
            <div className="bg-red-50 text-red-800 p-4 rounded-md m-6">
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[80px]">Image</TableHead>
                    <TableHead className="min-w-[300px]">Content</TableHead>
                    <TableHead className="min-w-[200px]">Link</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[150px]">Created</TableHead>
                    <TableHead className="text-right min-w-[80px]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBanners.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No banners found. Try adjusting your search or filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBanners.map((banner) => (
                      <TableRow key={banner._id} className="hover:bg-muted/50">
                        <TableCell>
                          {banner.image ? (
                            <div className="relative h-12 w-12 rounded-md overflow-hidden">
                              <Image
                                src={banner.image || "/placeholder.svg"}
                                alt={banner.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center">
                              <Upload className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">
                              <span className="font-medium">Title:</span>{" "}
                              {banner.title}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <span className="font-medium">Subtitle:</span>{" "}
                              {banner.subTitle}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <LinkIcon className="h-4 w-4 text-muted-foreground" />
                            <a
                              href={banner.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-lta-purple hover:underline text-sm truncate max-w-[200px]"
                            >
                              {banner.link}
                            </a>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getStatusBadgeClass(banner.isActive)}
                          >
                            {banner.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {banner.createdAt
                              ? formatDateTime(banner.createdAt)
                              : "N/A"}
                          </div>
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
                                onClick={() => handleEditClick(banner)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Banner
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteClick(banner._id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
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
              Are you sure you want to delete this banner?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              banner and remove it from our servers.
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

      {/* Edit Banner Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Banner</DialogTitle>
            <DialogDescription>
              Make changes to the banner information below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              {/* Banner Image */}
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="bannerImage" className="text-right pt-2">
                  Image
                </Label>
                <div className="col-span-3">
                  {imagePreview ? (
                    <div className="relative w-full h-40 mb-2 rounded-md overflow-hidden">
                      <Image
                        src={imagePreview || "/placeholder.svg"}
                        alt="Banner preview"
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
                    id="bannerImage"
                    type="file"
                    accept="image/*"
                    className={imagePreview ? "hidden" : "mt-2"}
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              {/* Banner Title */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bannerTitle" className="text-right">
                  Title
                </Label>
                <Input
                  id="bannerTitle"
                  value={bannerToEdit?.title || ""}
                  onChange={(e) =>
                    setBannerToEdit(
                      bannerToEdit
                        ? { ...bannerToEdit, title: e.target.value }
                        : null
                    )
                  }
                  className="col-span-3"
                />
              </div>

              {/* Banner Subtitle */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bannerSubTitle" className="text-right">
                  Subtitle
                </Label>
                <Input
                  id="bannerSubTitle"
                  value={bannerToEdit?.subTitle || ""}
                  onChange={(e) =>
                    setBannerToEdit(
                      bannerToEdit
                        ? { ...bannerToEdit, subTitle: e.target.value }
                        : null
                    )
                  }
                  className="col-span-3"
                />
              </div>

              {/* Banner Link */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bannerLink" className="text-right">
                  Link
                </Label>
                <Input
                  id="bannerLink"
                  value={bannerToEdit?.link || ""}
                  onChange={(e) =>
                    setBannerToEdit(
                      bannerToEdit
                        ? { ...bannerToEdit, link: e.target.value }
                        : null
                    )
                  }
                  className="col-span-3"
                />
              </div>

              {/* Status */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bannerStatus" className="text-right">
                  Status
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch
                    id="bannerStatus"
                    checked={bannerToEdit?.isActive}
                    onCheckedChange={(checked) =>
                      setBannerToEdit(
                        bannerToEdit
                          ? { ...bannerToEdit, isActive: checked }
                          : null
                      )
                    }
                  />
                  <Label htmlFor="bannerStatus" className="cursor-pointer">
                    {bannerToEdit?.isActive ? "Active" : "Inactive"}
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
              <Button type="submit" disabled={saving}>
                {saving && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Banner Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Banner</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new banner.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit}>
            <div className="grid gap-4 py-4">
              {/* Banner Image */}
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="createBannerImage" className="text-right pt-2">
                  Image
                </Label>
                <div className="col-span-3">
                  {imagePreview ? (
                    <div className="relative w-full h-40 mb-2 rounded-md overflow-hidden">
                      <Image
                        src={imagePreview || "/placeholder.svg"}
                        alt="Banner preview"
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
                    id="createBannerImage"
                    type="file"
                    accept="image/*"
                    className={imagePreview ? "hidden" : "mt-2"}
                    onChange={handleImageChange}
                  />
                </div>
              </div>
              {/* Banner Title */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="createBannerTitle" className="text-right">
                  Title
                </Label>
                <Input
                  id="createBannerTitle"
                  value={bannerToCreate?.title || ""}
                  onChange={(e) =>
                    setBannerToCreate(
                      bannerToCreate
                        ? { ...bannerToCreate, title: e.target.value }
                        : null
                    )
                  }
                  className="col-span-3"
                />
              </div>
              {/* Banner Subtitle */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="createBannerSubTitle" className="text-right">
                  Subtitle
                </Label>
                <Input
                  id="createBannerSubTitle"
                  value={bannerToCreate?.subTitle || ""}
                  onChange={(e) =>
                    setBannerToCreate(
                      bannerToCreate
                        ? { ...bannerToCreate, subTitle: e.target.value }
                        : null
                    )
                  }
                  className="col-span-3"
                />
              </div>
              {/* Banner Link */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="createBannerLink" className="text-right">
                  Link
                </Label>
                <Input
                  id="createBannerLink"
                  value={bannerToCreate?.link || ""}
                  onChange={(e) =>
                    setBannerToCreate(
                      bannerToCreate
                        ? { ...bannerToCreate, link: e.target.value }
                        : null
                    )
                  }
                  className="col-span-3"
                />
              </div>
              {/* Status */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="createBannerStatus" className="text-right">
                  Status
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch
                    id="createBannerStatus"
                    checked={bannerToCreate?.isActive}
                    onCheckedChange={(checked) =>
                      setBannerToCreate(
                        bannerToCreate
                          ? { ...bannerToCreate, isActive: checked }
                          : null
                      )
                    }
                  />
                  <Label
                    htmlFor="createBannerStatus"
                    className="cursor-pointer"
                  >
                    {bannerToCreate?.isActive ? "Active" : "Inactive"}
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                {saving ? "Saving..." : "Create Banner"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
