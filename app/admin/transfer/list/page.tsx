"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Edit,
  Trash2,
  Plus,
  Search,
  MoreHorizontal,
  RefreshCw,
  Phone,
  Mail,
  Eye,
  MapPin,
  Calendar,
  Users,
  Car,
  ArrowUpDown,
  Filter,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
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
import { Separator } from "@/components/ui/separator";

// Define the Transfer type based on the Mongoose schema
interface Transfer {
  _id: string;
  bookingReference: string;

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

export default function TransferListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transferToDelete, setTransferToDelete] = useState<string | null>(null);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [typeFilter, setTypeFilter] = useState(
    searchParams.get("typeFilter") || "all"
  );
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("statusFilter") || "all"
  );
  const [tripTypeFilter, setTripTypeFilter] = useState(
    searchParams.get("tripTypeFilter") || "all"
  );
  const [regionFilter, setRegionFilter] = useState(
    searchParams.get("regionFilter") || "all"
  );

  // Sorting
  const [sortField, setSortField] = useState(
    searchParams.get("sortBy") || "createdAt"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Fetch transfers from API
  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/transfer");

        if (!response.ok) {
          throw new Error("Failed to fetch transfers");
        }
        const transfersData = await response.json();
        const transfers: Transfer[] = transfersData.data || [];
        setTransfers(transfers);
        setError(null);
      } catch (err) {
        console.error("Error fetching transfers:", err);
        setError("Failed to load transfers. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load transfers",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTransfers();
  }, [toast]);

  // Apply filters and search
  const filteredTransfers = transfers.filter((transfer) => {
    const matchesSearch =
      transfer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.pickupAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.dropoffAddress.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      typeFilter === "all" || transfer.transferType === typeFilter;
    const matchesStatus =
      statusFilter === "all" || transfer.status === statusFilter;
    const matchesTripType =
      tripTypeFilter === "all" || transfer.tripType === tripTypeFilter;
    const matchesRegion =
      regionFilter === "all" || transfer.region === regionFilter;

    return (
      matchesSearch &&
      matchesType &&
      matchesStatus &&
      matchesTripType &&
      matchesRegion
    );
  });

  // Apply sorting
  const sortedTransfers = [...filteredTransfers].sort((a, b) => {
    let valueA, valueB;

    switch (sortField) {
      case "preferredDate":
        valueA = new Date(a.preferredDate).getTime();
        valueB = new Date(b.preferredDate).getTime();
        break;
      case "createdAt":
        valueA = new Date(a.createdAt).getTime();
        valueB = new Date(b.createdAt).getTime();
        break;
      case "firstName":
      case "lastName":
      case "destination":
      case "region":
        valueA = a[sortField].toLowerCase();
        valueB = b[sortField].toLowerCase();
        break;
      default:
        valueA = a[sortField as keyof Transfer];
        valueB = b[sortField as keyof Transfer];
    }

    if (sortDirection === "asc") {
      return (valueA ?? "") > (valueB ?? "") ? 1 : -1;
    } else {
      return (valueA ?? "") < (valueB ?? "") ? 1 : -1;
    }
  });

  // Calculate statistics
  const stats = {
    total: transfers.length,
    pending: transfers.filter((t) => t.status === "pending").length,
    confirmed: transfers.filter((t) => t.status === "confirmed").length,
    canceled: transfers.filter((t) => t.status === "canceled").length,
  };

  // Get unique regions for filter
  const uniqueRegions = Array.from(
    new Set(transfers.map((t) => t.region).filter(Boolean))
  );

  const handleDeleteClick = (id: string) => {
    setTransferToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!transferToDelete) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/transfer/${transferToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete transfer");
      }

      setTransfers(
        transfers.filter((transfer) => transfer._id !== transferToDelete)
      );

      toast({
        title: "Success",
        description: "Transfer deleted successfully",
      });
    } catch (err) {
      console.error("Error deleting transfer:", err);
      toast({
        title: "Error",
        description: "Failed to delete transfer",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setTransferToDelete(null);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800";
      case "canceled":
        return "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800";
    }
  };

  // Get transfer type display name and icon
  const getTransferTypeDisplay = (type: string) => {
    switch (type) {
      case "baggage":
        return { name: "Baggage", icon: <Car className="h-4 w-4" /> };
      case "family":
        return { name: "Family", icon: <Users className="h-4 w-4" /> };
      case "group":
        return { name: "Group", icon: <Users className="h-4 w-4" /> };
      default:
        return { name: "Other", icon: <Car className="h-4 w-4" /> };
    }
  };

  // Handle sort change
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transfer Management</h1>
          <p className="text-muted-foreground">
            Manage transfer requests and bookings
          </p>
        </div>
        <Button
          className="bg-lta-purple hover:bg-lta-purple/90 text-white"
          asChild
        >
          <Link href="/admin/transfer/add">
            <Plus className="mr-2 h-4 w-4" /> Add New Transfer
          </Link>
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transfers
            </CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All transfer requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.confirmed}
            </div>
            <p className="text-xs text-muted-foreground">Ready for service</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Canceled</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.canceled}
            </div>
            <p className="text-xs text-muted-foreground">Canceled requests</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardContent className="p-6">
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transfers by name, email, destination, or address..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Transfer Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="baggage">Baggage</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                  <SelectItem value="group">Group</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={tripTypeFilter} onValueChange={setTripTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Trip Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Trip Types</SelectItem>
                  <SelectItem value="one-way">One Way</SelectItem>
                  <SelectItem value="round-trip">Round Trip</SelectItem>
                </SelectContent>
              </Select>

              {uniqueRegions.length > 0 && (
                <Select value={regionFilter} onValueChange={setRegionFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {uniqueRegions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-lta-purple" />
              <span className="ml-2 text-lg">Loading transfers...</span>
            </div>
          )}

          {/* Error State */}
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

          {/* Table */}
          {!loading && !error && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("firstName")}
                      >
                        Ref
                        {sortField === "firstName" && (
                          <ArrowUpDown
                            className="ml-2 h-4 w-4"
                            data-direction={sortDirection}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("destination")}
                      >
                        Route
                        {sortField === "destination" && (
                          <ArrowUpDown
                            className="ml-2 h-4 w-4"
                            data-direction={sortDirection}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Trip Type</TableHead>
                    <TableHead>
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort("preferredDate")}
                      >
                        Date
                        {sortField === "preferredDate" && (
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
                  {sortedTransfers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No transfers found. Try adjusting your search or
                        filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedTransfers.map((transfer) => {
                      const transferTypeInfo = getTransferTypeDisplay(
                        transfer.transferType
                      );
                      return (
                        <TableRow key={transfer._id}>
                          <TableCell className="font-medium">
                            <div className="font-mono text-sm">
                              {transfer.bookingReference}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center text-xs">
                                <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
                                <span className="truncate max-w-[150px]">
                                  {transfer.email}
                                </span>
                              </div>
                              <div className="flex items-center text-xs">
                                <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                                <span>{transfer.phone}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="mr-2 text-muted-foreground">
                                {transferTypeInfo.icon}
                              </div>
                              <span className="text-sm">
                                {transferTypeInfo.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center text-xs">
                                <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                                <span className="truncate max-w-[120px]">
                                  {transfer.pickupAddress}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                → {transfer.destination}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {transfer.tripType.replace("-", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm">
                              <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span>{formatDate(transfer.preferredDate)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={getStatusBadgeClass(transfer.status)}
                            >
                              {transfer.status.charAt(0).toUpperCase() +
                                transfer.status.slice(1)}
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
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/admin/transfer/details/${transfer._id}`}
                                  >
                                    <Eye className="mr-2 h-4 w-4" /> View
                                    Details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/admin/transfer/edit/${transfer._id}`}
                                  >
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() =>
                                    handleDeleteClick(transfer._id)
                                  }
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Results Summary */}
          {!loading && !error && (
            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-muted-foreground">
                Showing {sortedTransfers.length} of {transfers.length} transfers
              </div>
              <div className="text-sm text-muted-foreground">
                {filteredTransfers.length !== transfers.length &&
                  `Filtered from ${transfers.length} total`}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this transfer?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              transfer request and remove it from our servers.
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
    </div>
  );
}
