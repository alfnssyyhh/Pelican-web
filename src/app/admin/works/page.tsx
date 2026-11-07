"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  MoreHorizontal,
  Edit,
  ExternalLink,
  Trash2,
  Briefcase,
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
import type { WorkProject } from "@/lib/admin-store";

const EMPTY_FORM = {
  client: "",
  slug: "",
  vessel: "",
  location: "Batam Shipyard",
  year: "2026",
  category: "Marine Engineering & Automation",
  status: "publish",
  banner: "",
  scope: "",
  milestones: "",
};

export default function WorksPage() {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [works, setWorks] = useState<WorkProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWork, setEditingWork] = useState<WorkProject | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete state
  const [deletingWork, setDeletingWork] = useState<WorkProject | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetch("/api/admin/works")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setWorks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    works.forEach((w) => w.category && set.add(w.category));
    return Array.from(set);
  }, [works]);

  const filteredWorks = useMemo(() => {
    return works.filter((w) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchClient = w.client?.toLowerCase().includes(q);
        const matchVessel = w.vessel?.toLowerCase().includes(q);
        const matchLoc = w.location?.toLowerCase().includes(q);
        if (!matchClient && !matchVessel && !matchLoc) return false;
      }
      if (categoryFilter !== "all") {
        if (w.category !== categoryFilter) return false;
      }
      return true;
    });
  }, [works, search, categoryFilter]);

  const paginatedWorks = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredWorks.slice(start, start + pageSize);
  }, [filteredWorks, page, pageSize]);

  const handleOpenCreate = () => {
    setEditingWork(null);
    setFormData(EMPTY_FORM);
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (work: WorkProject) => {
    setEditingWork(work);
    setFormData({
      client: work.client || "",
      slug: work.slug || "",
      vessel: work.vessel || "",
      location: work.location || "Batam Shipyard",
      year: work.year || "2026",
      category: work.category || "Marine Engineering & Automation",
      status: work.status || "publish",
      banner: work.banner || "",
      scope: work.scope || "",
      milestones: Array.isArray(work.milestones) ? work.milestones.join("\n") : "",
    });
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSaving(true);
    setFormError(null);

    try {
      const url = editingWork
        ? `/api/admin/works/${editingWork.id}`
        : "/api/admin/works";
      const method = editingWork ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save project.");

      if (editingWork) {
        setWorks((prev) =>
          prev.map((item) => (item.id === editingWork.id ? data.work : item))
        );
        showToast("Project track record updated successfully.", "success");
      } else {
        setWorks((prev) => [data.work, ...prev]);
        showToast("Project track record added successfully.", "success");
      }

      setIsFormOpen(false);
      router.refresh();
    } catch (err: any) {
      const msg = err.message || "Failed to save project.";
      setFormError(msg);
      showToast(msg, "error");
    } finally {
      setFormSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingWork) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/works/${deletingWork.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete project.");
      }

      setWorks((prev) => prev.filter((w) => w.id !== deletingWork.id));
      const deletedClient = deletingWork.client;
      setDeletingWork(null);
      showToast(`Project record for "${deletedClient}" deleted successfully.`, "success");
      router.refresh();
    } catch (err: any) {
      showToast(err.message || "Failed to delete project.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const workSuggestions = useMemo(() => {
    const list: string[] = [];
    works.forEach((w) => {
      if (w.client) list.push(w.client);
      if (w.vessel) list.push(w.vessel);
      if (w.location) list.push(w.location);
      if (w.category) list.push(w.category);
    });
    return list;
  }, [works]);

  return (
    <div className="min-h-screen flex flex-col">
      <AppNavbar />
      <main className="mx-auto w-full max-w-[1280px] px-6 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="m-0 text-3xl font-bold tracking-tight text-foreground">
              Project Portfolio & Works
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage maritime track records, shipyard repair projects, and case studies
            </p>
          </div>

          <Button onClick={handleOpenCreate} className="flex items-center gap-1.5 shadow-xs">
            <Plus className="size-4" />
            <span>Add Project</span>
          </Button>
        </div>

        {/* Toolbar */}
        <ListToolbar
          search={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder="Search client, vessel name, or shipyard..."
          suggestions={workSuggestions}
          hasActiveFilters={Boolean(search || categoryFilter !== "all")}
          onResetFilters={() => {
            setSearch("");
            setCategoryFilter("all");
            setPage(1);
          }}
          className="mb-4"
        >
          <Select
            value={categoryFilter}
            onValueChange={(val) => {
              if (val) {
                setCategoryFilter(val);
                setPage(1);
              }
            }}
          >
            <SelectTrigger className="w-auto min-w-[160px] max-w-[260px] h-8 text-xs">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </ListToolbar>

        {/* Table Card */}
        {/* Table Card */}
        <Card className="shadow-xs mb-4">
          <CardContent className="p-0">
            <Table className="min-w-[900px] table-fixed">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[72px] shrink-0 pl-4">Banner</TableHead>
                  <TableHead className="w-[32%] min-w-[220px]">Client & Vessel</TableHead>
                  <TableHead className="w-[16%] min-w-[120px]">Location</TableHead>
                  <TableHead className="w-[10%] min-w-[80px]">Year</TableHead>
                  <TableHead className="w-[20%] min-w-[150px]">Category</TableHead>
                  <TableHead className="w-[12%] min-w-[95px]">Status</TableHead>
                  <TableHead className="w-[76px] shrink-0 text-right pr-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedWorks.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-12 text-center text-xs text-muted-foreground"
                    >
                      {loading ? "Loading project portfolio..." : "No projects found matching your criteria."}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedWorks.map((w) => {
                    return (
                      <TableRow
                        key={w.id}
                        className="cursor-pointer hover:bg-neutral-200/70 dark:hover:bg-neutral-800/80 transition-colors"
                        onClick={() => handleOpenEdit(w)}
                      >
                        <TableCell className="py-2.5 pl-4">
                          <div className="size-10 rounded-lg overflow-hidden border border-border bg-muted shrink-0 flex items-center justify-center">
                            {w.banner ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={w.banner}
                                alt={w.client}
                                className="size-full object-cover"
                                onError={(e) => {
                                  (e.currentTarget as HTMLElement).style.display = "none";
                                }}
                              />
                            ) : (
                              <Briefcase className="size-5 text-muted-foreground" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="truncate">
                          <div className="font-normal text-xs text-slate-900 dark:text-white line-clamp-1" title={w.client}>{w.client}</div>
                          {w.vessel && (
                            <div className="text-[11px] font-normal text-muted-foreground dark:text-zinc-300 truncate" title={w.vessel}>
                              Vessel: {w.vessel}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-xs font-normal text-slate-900 dark:text-white truncate">
                          <span title={w.location || "Batam"}>{w.location || "Batam"}</span>
                        </TableCell>
                        <TableCell className="text-xs font-normal text-slate-900 dark:text-white">
                          {w.year || "2026"}
                        </TableCell>
                        <TableCell className="text-xs font-normal text-slate-900 dark:text-white truncate">
                          <span title={w.category}>{w.category}</span>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={w.status || "publish"} className="text-[10px]" />
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
                                onClick={() => handleOpenEdit(w)}
                                className="cursor-pointer"
                              >
                                <Edit className="size-3.5" />
                                <span>Edit Project</span>
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() =>
                                  window.open(w.slug ? `/works?project=${w.slug}` : "/works", "_blank")
                                }
                                className="cursor-pointer"
                              >
                                <ExternalLink className="size-3.5" />
                                <span>View on Site</span>
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => setDeletingWork(w)}
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
          count={filteredWorks.length}
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
                {editingWork ? `Edit Project: ${editingWork.client}` : "Add New Project Track Record"}
              </DialogTitle>
              <DialogDescription>
                Document client engagement, vessel details, and project milestones.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSave} className="flex flex-col gap-4 py-2">
              <ImageUploadField
                value={formData.banner}
                onChange={(url) => setFormData((prev) => ({ ...prev, banner: url }))}
                label="Project Banner Photo"
                category="Works"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Client Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    value={formData.client}
                    onChange={(e) => setFormData((prev) => ({ ...prev, client: e.target.value }))}
                    placeholder="e.g. Bourbon Offshore Asia"
                    className="h-8 text-xs bg-card"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Vessel / Asset Name
                  </label>
                  <Input
                    value={formData.vessel}
                    onChange={(e) => setFormData((prev) => ({ ...prev, vessel: e.target.value }))}
                    placeholder="e.g. AHTS Bourbon Liberty 212"
                    className="h-8 text-xs bg-card"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-foreground">Location</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g. PaxOcean Batam"
                    className="h-8 text-xs bg-card"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-foreground">Year</label>
                  <Input
                    value={formData.year}
                    onChange={(e) => setFormData((prev) => ({ ...prev, year: e.target.value }))}
                    placeholder="e.g. 2026"
                    className="h-8 text-xs bg-card"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-foreground">Status</label>
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
                        <SelectItem value="publish">Published</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">Category</label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  placeholder="e.g. Marine Engine Overhaul & Calibration"
                  className="h-8 text-xs bg-card"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">Scope of Work</label>
                <Textarea
                  rows={3}
                  value={formData.scope}
                  onChange={(e) => setFormData((prev) => ({ ...prev, scope: e.target.value }))}
                  placeholder="Technical scope, challenges resolved, parts replaced..."
                  className="text-xs bg-card"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Key Milestones (one per line)
                </label>
                <Textarea
                  rows={3}
                  value={formData.milestones}
                  onChange={(e) => setFormData((prev) => ({ ...prev, milestones: e.target.value }))}
                  placeholder="Initial inspection and crank deflection&#10;Disassembly and component renewal&#10;Sea trial and commissioning"
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
                  {formSaving ? "Saving..." : editingWork ? "Save Changes" : "Create Project"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirm */}
        <ConfirmDialog
          open={!!deletingWork}
          title="Delete Project"
          message={`Are you sure you want to permanently delete project "${deletingWork?.client}"?`}
          variant="destructive"
          confirmLabel="Delete Permanently"
          loading={isDeleting}
          onConfirm={handleDelete}
          onCancel={() => setDeletingWork(null)}
        />
      </main>
    </div>
  );
}
