"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Edit,
  Trash2,
  Search,
  MoreHorizontal,
  ArrowUpDown,
  Folder,
  RefreshCw,
  AlertTriangle,
  Star,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Category } from "@/lib/types";

export default function CategoriesListPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sorting
  const [sortField, setSortField] = useState("Title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/categorie");

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        setCategories(data.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [toast]);

  // Apply filters and search
  const filteredCategories = categories.filter((category) => {
    return category.Title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Apply sorting
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    let valueA = a[sortField as keyof Category];
    let valueB = b[sortField as keyof Category];

    // Handle numeric sorting for Star rating
    if (sortField === "Star") {
      valueA = valueA || 0;
      valueB = valueB || 0;
      return sortDirection === "asc"
        ? Number(valueA) - Number(valueB)
        : Number(valueB) - Number(valueA);
    }

    // Default string sorting for other fields
    valueA = String(valueA || "").toLowerCase();
    valueB = String(valueB || "").toLowerCase();

    return sortDirection === "asc"
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA);
  });

  const handleDeleteClick = (id: string) => {
    setCategoryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleEditClick = (category: Category) => {
    setCategoryToEdit({ ...category });
    setEditDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/categorie/${categoryToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      // Remove the deleted category from the state
      setCategories(
        categories.filter((category) => category._id !== categoryToDelete)
      );

      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    } catch (err) {
      console.error("Error deleting category:", err);
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryToEdit) return;

    try {
      setSaving(true);

      const response = await fetch(`/api/categorie/${categoryToEdit._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryToEdit),
      });

      if (!response.ok) {
        throw new Error("Failed to update category");
      }

      const updatedCategory = await response.json();

      // Update the category in the state
      setCategories(
        categories.map((category) =>
          category._id === categoryToEdit._id
            ? { ...category, ...updatedCategory.data.category }
            : category
        )
      );

      toast({
        title: "Success",
        description: "Category updated successfully",
      });

      setEditDialogOpen(false);
    } catch (err) {
      console.error("Error updating category:", err);
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
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

  const handleSyncClick = () => {
    setSyncDialogOpen(true);
  };

  const handleSyncConfirm = async () => {
    try {
      setSyncing(true);
      const response = await fetch("/api/partner/sync/category", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to sync categories");
      }

      toast({
        title: "Success",
        description: "Categories synced successfully",
      });

      // Refresh the categories list
      const refreshResponse = await fetch("/api/categorie");
      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        setCategories(data.data || []);
      }
    } catch (err) {
      console.error("Error syncing categories:", err);
      toast({
        title: "Error",
        description: "Failed to sync categories with partner API",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
      setSyncDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categories</h1>
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
                placeholder="Search categories..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin" />
              <span className="ml-2 text-lg">Loading Cartegories...</span>
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
                    <TableHead className="w-[50px]">
                      <Folder className="h-4 w-4" />
                    </TableHead>
                    <TableHead>
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("Title")}
                      >
                        Title
                        {sortField === "Title" && (
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
                        onClick={() => handleSort("Star")}
                      >
                        Rating
                        {sortField === "Star" && (
                          <ArrowUpDown
                            className="ml-2 h-4 w-4"
                            data-direction={sortDirection}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCategories.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No categories found. Try adjusting your search.
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedCategories.map((category) => (
                      <TableRow key={category._id}>
                        <TableCell>
                          <Folder className="h-4 w-4" />
                        </TableCell>
                        <TableCell className="font-medium">
                          {category.Title}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {category.Star && (
                              <>
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                                <span>{category.Star}</span>
                              </>
                            )}
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
                                onClick={() => handleEditClick(category)}
                              >
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() =>
                                  handleDeleteClick(category._id || "")
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
              Are you sure you want to delete this category?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              category and remove it from our servers.
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
      {/* Sync Confirmation Dialog */}
      <Dialog open={syncDialogOpen} onOpenChange={setSyncDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Sync Categories with Partner API
            </DialogTitle>
            <DialogDescription className="mt-2 text-red-600 font-medium">
              Warning: This action will override all your existing category
              data.
            </DialogDescription>
            <DialogDescription className="mt-2">
              This will fetch the latest category data from our partner API and
              replace your current category database. Any custom modifications
              you've made to existing categories will be lost.
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
              {syncing ? "Syncing..." : "Sync Categories"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Edit Category Dialog (Update Only) */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Make changes to the category below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="categoryTitle" className="text-right">
                  Title
                </Label>
                <Input
                  id="categoryTitle"
                  value={categoryToEdit?.Title || ""}
                  onChange={(e) =>
                    setCategoryToEdit(
                      categoryToEdit
                        ? { ...categoryToEdit, Title: e.target.value }
                        : null
                    )
                  }
                  className="col-span-3"
                />
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
    </div>
  );
}
