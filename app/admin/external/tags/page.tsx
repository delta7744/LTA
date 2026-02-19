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
  Tag as TagIcon,
  RefreshCw,
  AlertTriangle,
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
import { Tag } from "@/lib/types";

export default function TagsListPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<string | null>(null);
  const [tagToEdit, setTagToEdit] = useState<Tag | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sorting
  const [sortField, setSortField] = useState("Title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Fetch tags from API
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/tag");

        if (!response.ok) {
          throw new Error("Failed to fetch tags");
        }

        const data = await response.json();
        setTags(data.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching tags:", err);
        setError("Failed to load tags. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load tags",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [toast]);

  // Apply filters and search
  const filteredTags = tags.filter((tag) => {
    return tag.Title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Apply sorting
  const sortedTags = [...filteredTags].sort((a, b) => {
    let valueA = a[sortField as keyof Tag]?.toLowerCase() || "";
    let valueB = b[sortField as keyof Tag]?.toLowerCase() || "";

    return sortDirection === "asc"
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA);
  });

  const handleDeleteClick = (id: string) => {
    setTagToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleEditClick = (tag: Tag) => {
    setTagToEdit({ ...tag });
    setEditDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!tagToDelete) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/tag/${tagToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete tag");
      }

      // Remove the deleted tag from the state
      setTags(tags.filter((tag) => tag._id !== tagToDelete));

      toast({
        title: "Success",
        description: "Tag deleted successfully",
      });
    } catch (err) {
      console.error("Error deleting tag:", err);
      toast({
        title: "Error",
        description: "Failed to delete tag",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setTagToDelete(null);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagToEdit) return;

    try {
      setSaving(true);

      const response = await fetch(`/api/tag/${tagToEdit._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tagToEdit),
      });

      if (!response.ok) {
        throw new Error("Failed to update tag");
      }

      const updatedTag = await response.json();

      // Update the tag in the state
      setTags(
        tags.map((tag) =>
          tag._id === tagToEdit._id ? { ...tag, ...updatedTag.data.tag } : tag
        )
      );

      toast({
        title: "Success",
        description: "Tag updated successfully",
      });

      setEditDialogOpen(false);
    } catch (err) {
      console.error("Error updating tag:", err);
      toast({
        title: "Error",
        description: "Failed to update tag",
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
      const response = await fetch("/api/partner/sync/tag", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to sync tags");
      }

      toast({
        title: "Success",
        description: "Tags synced successfully",
      });

      // Refresh the tags list
      const refreshResponse = await fetch("/api/tag");
      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        setTags(data.data.tags || []);
      }
    } catch (err) {
      console.error("Error syncing tags:", err);
      toast({
        title: "Error",
        description: "Failed to sync tags with partner API",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
      setSyncDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {" "}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tags</h1>
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
                placeholder="Search tags..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin" />
              <span className="ml-2 text-lg">Loading Tags...</span>
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
                      <TagIcon className="h-4 w-4" />
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
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTags.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No tags found. Try adjusting your search or add a new
                        tag.
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedTags.map((tag) => (
                      <TableRow key={tag._id}>
                        <TableCell>
                          <TagIcon className="h-4 w-4" />
                        </TableCell>
                        <TableCell className="font-medium">
                          {tag.Title}
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
                                onClick={() => handleEditClick(tag)}
                              >
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteClick(tag._id)}
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
            <DialogTitle>Are you sure you want to delete this tag?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the tag
              and remove it from our servers.
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
      </Dialog>{" "}
      {/* Sync Confirmation Dialog */}
      <Dialog open={syncDialogOpen} onOpenChange={setSyncDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Sync Tags with Partner API
            </DialogTitle>
            <DialogDescription className="mt-2 text-red-600 font-medium">
              Warning: This action will override all your existing tag data.
            </DialogDescription>
            <DialogDescription className="mt-2">
              This will fetch the latest tag data from our partner API and
              replace your current tag database. Any custom modifications you've
              made to existing tags will be lost.
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
              {syncing ? "Syncing..." : "Sync Tags"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Edit Tag Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {tagToEdit?._id ? "Edit Tag" : "Add New Tag"}
            </DialogTitle>
            <DialogDescription>
              {tagToEdit?._id
                ? "Make changes to the tag below."
                : "Create a new tag by entering the details below."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tagTitle" className="text-right">
                  Title
                </Label>
                <Input
                  id="tagTitle"
                  value={tagToEdit?.Title || ""}
                  onChange={(e) =>
                    setTagToEdit(
                      tagToEdit ? { ...tagToEdit, Title: e.target.value } : null
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
                {saving
                  ? "Saving..."
                  : tagToEdit?._id
                    ? "Save Changes"
                    : "Create Tag"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>{" "}
      </Dialog>
    </div>
  );
}
