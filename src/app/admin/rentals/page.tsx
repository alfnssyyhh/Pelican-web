"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Truck,
  Wrench,
  ExternalLink,
} from "lucide-react";
import { AppNavbar } from "@/components/admin/AppNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ListToolbar } from "@/components/ui/ListToolbar";
import { ListPagination } from "@/components/ui/ListPagination";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ImageUploadField } from "@/components/ui/ImageUploadField";
import { useAdminToast } from "@/components/admin/ui/toast-provider";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import type { RentalUnit } from "@/lib/admin-store";

const EMPTY_FORM = {
  code: "",
  name: "",
  kva: "100 kVA",
  kw: "80 kW",
  engine: "Cummins Marine 6BT5.9",
  canopy: "Soundproof Heavy Canopy",
  voltage: "380V / 220V 3-Phase",
  fuel_rate: "18.5 L/hr",
  noise_level: "72 dBA @ 7m",
  status: "available",
  location: "Batam Workshop Yard",
  thumbnail_url: "",
  description: "",
};

export default function RentalsPage() {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [rentals, setRentals] = useState<RentalUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<RentalUnit | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete state
  const [deletingUnit, setDeletingUnit] = useState<RentalUnit | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetch("/api/admin/rentals")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setRentals(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredRentals = useMemo(() => {
    return rentals.filter((r) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchCode = r.code?.toLowerCase().includes(q);
        const matchName = r.name?.toLowerCase().includes(q);
        const matchEngine = r.engine?.toLowerCase().includes(q);
        if (!matchCode && !matchName && !matchEngine) return false;
      }
      if (statusFilter !== "all") {
        if (r.status !== statusFilter) return false;
      }
      return true;
    });
  }, [rentals, search, statusFilter]);

  const paginatedRentals = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRentals.slice(start, start + pageSize);
  }, [filteredRentals, page, pageSize]);

  const handleOpenCreate = () => {
    setEditingUnit(null);
    setFormData(EMPTY_FORM);
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (unit: RentalUnit) => {
    setEditingUnit(unit);
    setFormData({
      code: unit.code || "",
      name: unit.name || "",
      kva: unit.kva || "100 kVA",
      kw: unit.kw || "80 kW",
      engine: unit.engine || "",
      canopy: unit.canopy || "",
      voltage: unit.voltage || "",
      fuel_rate: unit.fuel_rate || "",
      noise_level: unit.noise_level || "",
      status: unit.status || "available",
      location: unit.location || "Batam Workshop Yard",
      thumbnail_url: unit.thumbnail_url || "",
      description: unit.description || "",
    });
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSaving(true);
    setFormError(null);

    try {
      const url = editingUnit
        ? `/api/admin/rentals/${editingUnit.id}`
        : "/api/admin/rentals";
      const method = editingUnit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save unit.");

      if (editingUnit) {
        setRentals((prev) =>
          prev.map((item) => (item.id === editingUnit.id ? data.rental : item))
        );
        showToast("Generator unit updated successfully.", "success");
      } else {
        setRentals((prev) => [data.rental, ...prev]);
        showToast("Generator unit added to fleet successfully.", "success");
      }

      setIsFormOpen(false);
      router.refresh();
    } catch (err: any) {
      const msg = err.message || "Failed to save unit.";
      setFormError(msg);
      showToast(msg, "error");
    } finally {
      setFormSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingUnit) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/rentals/${deletingUnit.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete unit.");
      }

      setRentals((prev) => prev.filter((r) => r.id !== deletingUnit.id));
      const deletedCode = deletingUnit.code;
      setDeletingUnit(null);
      showToast(`Rental unit "${deletedCode}" removed successfully.`, "success");
      router.refresh();
    } catch (err: any) {
      showToast(err.message || "Failed to delete unit.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const rentalSuggestions = useMemo(() => {
    const list: string[] = [];
    rentals.forEach((r) => {
      if (r.code) list.push(r.code);
      if (r.name) list.push(r.name);
      if (r.engine) list.push(r.engine);
      if (r.location) list.push(r.location);
    });
    return list;
  }, [rentals]);

  return (
    <div className="min-h-screen flex flex-col">
      <AppNavbar />
      <main className="mx-auto w-full max-w-[1280px] px-6 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="m-0 text-3xl font-bold tracking-tight text-foreground">
              Rental Fleet (Gensets)
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage generator units, capacity ratings, and availability status
            </p>
          </div>

          <Button onClick={handleOpenCreate} className="flex items-center gap-1.5 shadow-xs">
            <Plus className="size-4" />
            <span>Add Unit</span>
          </Button>
        </div>

        {/* Toolbar */}
        <ListToolbar
          search={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder="Search unit code, capacity, engine, or location..."
          suggestions={rentalSuggestions}
          hasActiveFilters={Boolean(search || statusFilter !== "all")}
          onResetFilters={() => {
            setSearch("");
            setStatusFilter("all");
            setPage(1);
          }}
          className="mb-4"
        >
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              if (val) {
                setStatusFilter(val);
                setPage(1);
              }
            }}
          >
            <SelectTrigger className="w-auto min-w-[160px] max-w-[220px] h-8 text-xs">
              <SelectValue placeholder="All status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="available">Stock Available</SelectItem>
                <SelectItem value="rented">Rented</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </ListToolbar>

        {/* Table Card */}
        <Card className="shadow-xs mb-4">
          <CardContent className="p-0">
            <Table className="min-w-[920px] table-fixed">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[72px] shrink-0 pl-4">Photo</TableHead>
                  <TableHead className="w-[14%] min-w-[110px]">Unit Code</TableHead>
                  <TableHead className="w-[32%] min-w-[220px]">Unit Name & Rating</TableHead>
                  <TableHead className="w-[18%] min-w-[140px]">Engine Model</TableHead>
                  <TableHead className="w-[16%] min-w-[120px]">Yard Location</TableHead>
                  <TableHead className="w-[12%] min-w-[95px]">Status</TableHead>
                  <TableHead className="w-[76px] shrink-0 text-right pr-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRentals.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-12 text-center text-xs text-muted-foreground"
                    >
                      {loading ? "Loading rental fleet units..." : "No units found matching your criteria."}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRentals.map((r) => {
                    return (
                      <TableRow
                        key={r.id}
                        className="cursor-pointer hover:bg-neutral-200/70 dark:hover:bg-neutral-800/80 transition-colors"
                        onClick={() => handleOpenEdit(r)}
                      >
                        <TableCell className="py-2.5 pl-4">
                          <div className="size-10 rounded-lg overflow-hidden border border-border bg-muted shrink-0 flex items-center justify-center">
                            {r.thumbnail_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={r.thumbnail_url}
                                alt={r.name}
                                className="size-full object-cover"
                                onError={(e) => {
                                  (e.currentTarget as HTMLElement).style.display = "none";
                                }}
                              />
                            ) : (
                              <Truck className="size-5 text-muted-foreground" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-bold text-xs text-[#dc2626] truncate">
                          <span title={r.code}>{r.code}</span>
                        </TableCell>
                        <TableCell className="truncate">
                          <div className="font-normal text-xs text-slate-900 dark:text-white line-clamp-1" title={r.name}>{r.name}</div>
                        </TableCell>
                        <TableCell className="text-xs font-normal text-slate-900 dark:text-white truncate">
                          <span title={r.engine || "Cummins / Yanmar"}>{r.engine || "Cummins / Yanmar"}</span>
                        </TableCell>
                        <TableCell className="text-xs font-normal text-slate-900 dark:text-white truncate">
                          <span title={r.location || "Batam Yard"}>{r.location || "Batam Yard"}</span>
                        </TableCell>
                        <TableCell>
                          <StatusBadge
                            status={
                              r.status === "available"
                                ? "Stock Available"
                                : r.status === "rented"
                                ? "Rented"
                                : r.status === "maintenance"
                                ? "Maintenance"
                                : "Stock Unavailable"
                            }
                            className="text-[10px]"
                          />
                        </TableCell>
                        <TableCell className="text-right pr-4" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              render={
                                <button
                                  type="button"
                                  className="flex size-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer outline-none ml-auto"
                                >
                                  <MoreHorizontal className="size-4" />
                                </button>
                              }
                            />
                            <DropdownMenuContent align="end" className="w-36 p-1.5">
                              <DropdownMenuItem
                                onClick={() => handleOpenEdit(r)}
                                className="cursor-pointer"
                              >
                                <Edit className="size-3.5" />
                                <span>Edit Unit</span>
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => window.open("/rent", "_blank")}
                                className="cursor-pointer"
                              >
                                <ExternalLink className="size-3.5" />
                                <span>View on Site</span>
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => setDeletingUnit(r)}
                                className="cursor-pointer"
                              >
                                <Trash2 className="size-3.5" />
                                <span>Delete</span>
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
          </CardContent>
        </Card>

        {/* Pagination */}
        <ListPagination
          page={page}
          pageSize={pageSize}
          count={filteredRentals.length}
          onPageChange={setPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPage(1);
          }}
        />

        {/* Form Modal */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingUnit ? `Edit Generator Unit ${editingUnit.code}` : "Add Generator Rental Unit"}
              </DialogTitle>
              <DialogDescription>
                Provide equipment ratings, engine model, and yard location.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSave} className="flex flex-col gap-4 py-2">
              <ImageUploadField
                value={formData.thumbnail_url}
                onChange={(url) => setFormData((prev) => ({ ...prev, thumbnail_url: url }))}
                label="Generator Unit Photo"
                category="Rentals"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Unit Code <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    value={formData.code}
                    onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
                    placeholder="e.g. GEN-100"
                    className="h-8 text-xs bg-card"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Unit Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Genset Silent Cummins 100 kVA"
                    className="h-8 text-xs bg-card"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-foreground">Capacity (kVA)</label>
                  <Input
                    value={formData.kva}
                    onChange={(e) => setFormData((prev) => ({ ...prev, kva: e.target.value }))}
                    placeholder="e.g. 100 kVA"
                    className="h-8 text-xs bg-card"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-foreground">Output (kW)</label>
                  <Input
                    value={formData.kw}
                    onChange={(e) => setFormData((prev) => ({ ...prev, kw: e.target.value }))}
                    placeholder="e.g. 80 kW"
                    className="h-8 text-xs bg-card"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-foreground">Availability</label>
                  <Select
                    value={formData.status}
                    onValueChange={(val) => {
                      if (val) setFormData((prev) => ({ ...prev, status: val }));
                    }}
                  >
                    <SelectTrigger className="w-full h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="available">Stock Available</SelectItem>
                        <SelectItem value="rented">Rented</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-foreground">Engine Specification</label>
                  <Input
                    value={formData.engine}
                    onChange={(e) => setFormData((prev) => ({ ...prev, engine: e.target.value }))}
                    placeholder="e.g. Cummins 6BT5.9-G2"
                    className="h-8 text-xs bg-card"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-foreground">Yard Location</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g. Batam Workshop Yard"
                    className="h-8 text-xs bg-card"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">Description & Scope</label>
                <Textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Canopy details, fuel consumption, circuit breaker specifications..."
                  className="text-xs bg-card"
                />
              </div>

              {formError && (
                <p className="text-xs font-medium text-red-600 dark:text-red-400">
                  {formError}
                </p>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFormOpen(false)}
                  disabled={formSaving}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={formSaving}>
                  {formSaving ? "Saving..." : editingUnit ? "Save Changes" : "Create Unit"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirm */}
        <ConfirmDialog
          open={!!deletingUnit}
          title="Delete Rental Unit"
          message={`Are you sure you want to permanently delete unit "${deletingUnit?.code} - ${deletingUnit?.name}"?`}
          variant="destructive"
          confirmLabel="Delete Permanently"
          loading={isDeleting}
          onConfirm={handleDelete}
          onCancel={() => setDeletingUnit(null)}
        />
      </main>
    </div>
  );
}
