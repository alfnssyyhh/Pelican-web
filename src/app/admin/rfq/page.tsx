"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Eye,
  MessageCircle,
  Trash2,
  MailCheck,
  Building,
  Anchor,
  Phone,
  Clock,
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ListToolbar } from "@/components/ui/ListToolbar";
import { ListPagination } from "@/components/ui/ListPagination";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAdminToast } from "@/components/admin/ui/toast-provider";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import type { RfqInquiry } from "@/lib/admin-store";

export default function RfqPage() {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [rfqs, setRfqs] = useState<RfqInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Detail / Edit modal state
  const [selectedRfq, setSelectedRfq] = useState<RfqInquiry | null>(null);
  const [newStatus, setNewStatus] = useState("New");
  const [notes, setNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete state
  const [deletingRfq, setDeletingRfq] = useState<RfqInquiry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetch("/api/admin/rfqs")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setRfqs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredRfqs = useMemo(() => {
    return rfqs.filter((r) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchId = r.id?.toLowerCase().includes(q);
        const matchName = r.name?.toLowerCase().includes(q);
        const matchComp = r.company?.toLowerCase().includes(q);
        const matchVessel = r.vesselOrProject?.toLowerCase().includes(q);
        if (!matchId && !matchName && !matchComp && !matchVessel) return false;
      }
      if (statusFilter !== "all") {
        if (r.status !== statusFilter) return false;
      }
      return true;
    });
  }, [rfqs, search, statusFilter]);

  const paginatedRfqs = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRfqs.slice(start, start + pageSize);
  }, [filteredRfqs, page, pageSize]);

  const handleOpenDetail = (rfq: RfqInquiry) => {
    setSelectedRfq(rfq);
    setNewStatus(rfq.status || "New");
    setNotes(rfq.notes || "");
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRfq) return;
    setIsUpdating(true);

    try {
      const res = await fetch(`/api/admin/rfqs/${selectedRfq.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, notes }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update inquiry.");

      setRfqs((prev) =>
        prev.map((item) => (item.id === selectedRfq.id ? data.rfq : item))
      );
      setSelectedRfq(null);
      showToast(`Inquiry ${selectedRfq.id} updated successfully.`, "success");
      router.refresh();
    } catch (err: any) {
      showToast(err.message || "Failed to update inquiry.", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingRfq) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/rfqs/${deletingRfq.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete inquiry.");
      }

      setRfqs((prev) => prev.filter((r) => r.id !== deletingRfq.id));
      const deletedId = deletingRfq.id;
      setDeletingRfq(null);
      showToast(`Inquiry ${deletedId} deleted permanently.`, "success");
      router.refresh();
    } catch (err: any) {
      showToast(err.message || "Failed to delete inquiry.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const openWhatsApp = (rfq: RfqInquiry) => {
    const cleanPhone = (rfq.phone || "").replace(/[^0-9]/g, "");
    const text = `Hello ${rfq.name}, thank you for contacting PT Pelican Mitra Sejati regarding inquiry ${rfq.id}. We are ready to assist with your technical requirements.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const rfqSuggestions = useMemo(() => {
    const list: string[] = [];
    rfqs.forEach((r) => {
      if (r.id) list.push(r.id);
      if (r.name) list.push(r.name);
      if (r.company) list.push(r.company);
      if (r.vesselOrProject) list.push(r.vesselOrProject);
      if (r.category) list.push(r.category);
    });
    return list;
  }, [rfqs]);

  return (
    <div className="min-h-screen flex flex-col">
      <AppNavbar />
      <main className="mx-auto w-full max-w-[1280px] px-6 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="m-0 text-3xl font-bold tracking-tight text-foreground">
              Inquiries (RFQ)
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Review and manage B2B customer quotation requests and follow-ups
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <ListToolbar
          search={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder="Search inquiry number, client, vessel, or company..."
          suggestions={rfqSuggestions}
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
            <SelectTrigger className="w-auto min-w-[150px] max-w-[200px] h-8 text-xs">
              <SelectValue placeholder="All status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="In Progress">In progress</SelectItem>
                <SelectItem value="In Review">In review</SelectItem>
                <SelectItem value="Quoted">Quoted</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </ListToolbar>

        {/* Table Card */}
        <Card className="shadow-xs mb-4">
          <CardContent className="p-0">
            <Table className="min-w-[980px] table-fixed">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[130px] shrink-0 pl-4">Inquiry #</TableHead>
                  <TableHead className="w-[24%] min-w-[180px]">Client & Company</TableHead>
                  <TableHead className="w-[18%] min-w-[140px]">Vessel / Facility</TableHead>
                  <TableHead className="w-[14%] min-w-[120px]">Contact Phone</TableHead>
                  <TableHead className="w-[18%] min-w-[150px]">Service Category</TableHead>
                  <TableHead className="w-[110px] shrink-0">Date</TableHead>
                  <TableHead className="w-[100px] shrink-0">Status</TableHead>
                  <TableHead className="w-[76px] shrink-0 text-right pr-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRfqs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="py-12 text-center text-xs text-muted-foreground"
                    >
                      {loading ? "Loading inquiries..." : "No quotation inquiries found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRfqs.map((rfq) => {
                    const dateStr = rfq.createdAt ? new Date(rfq.createdAt).toLocaleDateString("en-GB") : "-";
                    return (
                      <TableRow
                        key={rfq.id}
                        className="cursor-pointer hover:bg-neutral-200/70 dark:hover:bg-neutral-800/80 transition-colors"
                        onClick={() => handleOpenDetail(rfq)}
                      >
                        <TableCell className="font-bold text-xs text-[#dc2626] whitespace-nowrap pl-4 truncate">
                          <span title={rfq.id}>{rfq.id}</span>
                        </TableCell>
                        <TableCell className="text-xs font-normal text-slate-900 dark:text-white truncate">
                          <div className="truncate" title={rfq.name}>{rfq.name}</div>
                          {rfq.company && (
                            <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5 truncate" title={rfq.company}>
                              <Building className="size-3 shrink-0" />
                              <span className="truncate">{rfq.company}</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-xs font-normal text-slate-900 dark:text-white truncate">
                          <div className="flex items-center gap-1 truncate" title={rfq.vesselOrProject || "General Project"}>
                            <Anchor className="size-3 text-muted-foreground shrink-0" />
                            <span className="truncate">{rfq.vesselOrProject || "General Project"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs font-normal text-slate-900 dark:text-white whitespace-nowrap truncate">
                          <span title={rfq.phone || "-"}>{rfq.phone || "-"}</span>
                        </TableCell>
                        <TableCell className="text-xs font-normal text-slate-900 dark:text-white truncate">
                          <span title={rfq.category}>{rfq.category}</span>
                        </TableCell>
                        <TableCell className="text-xs font-normal text-slate-900 dark:text-white whitespace-nowrap">
                          {dateStr}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={rfq.status || "New"} className="text-[10px]" />
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
                            <DropdownMenuContent align="end" className="w-40 p-1.5">
                              <DropdownMenuItem
                                onClick={() => handleOpenDetail(rfq)}
                                className="cursor-pointer"
                              >
                                <Eye className="size-3.5" />
                                <span>View Details</span>
                              </DropdownMenuItem>

                              {rfq.phone && (
                                <DropdownMenuItem
                                  onClick={() => openWhatsApp(rfq)}
                                  className="cursor-pointer text-emerald-600 dark:text-emerald-400"
                                >
                                  <MessageCircle className="size-3.5" />
                                  <span>Open WhatsApp</span>
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuSeparator />

                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => setDeletingRfq(rfq)}
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
          count={filteredRfqs.length}
          onPageChange={setPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPage(1);
          }}
        />

        {/* Detail & Status Modal */}
        <Dialog open={!!selectedRfq} onOpenChange={(open) => !open && setSelectedRfq(null)}>
          <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <span className="text-primary font-medium text-sm">{selectedRfq?.id}</span>
                <StatusBadge status={selectedRfq?.status || "New"} className="text-[10px]" />
              </div>
              <DialogTitle className="text-lg">
                Quotation Request Details
              </DialogTitle>
              <DialogDescription>
                Client contact and technical scope submitted through the inquiry portal.
              </DialogDescription>
            </DialogHeader>

            {selectedRfq && (
              <form onSubmit={handleUpdateStatus} className="flex flex-col gap-4 py-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border border-border bg-muted/30 p-3.5 text-xs">
                  <div>
                    <span className="text-muted-foreground font-medium">Client Name:</span>
                    <p className="font-semibold text-foreground text-sm mt-0.5">{selectedRfq.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-medium">Company / Yard:</span>
                    <p className="font-semibold text-foreground mt-0.5">{selectedRfq.company || "-"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-medium">Vessel / Project:</span>
                    <p className="font-semibold text-foreground mt-0.5">{selectedRfq.vesselOrProject || "-"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-medium">Contact Phone:</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-normal text-foreground">{selectedRfq.phone}</span>
                      <button
                        type="button"
                        onClick={() => openWhatsApp(selectedRfq)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                      >
                        <MessageCircle className="size-3" /> WhatsApp
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-foreground">Service Category</label>
                  <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground">
                    {selectedRfq.category}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-foreground">Technical Scope Requested</label>
                  <div className="rounded-lg border border-border bg-card p-3 text-xs leading-relaxed text-foreground whitespace-pre-wrap">
                    {selectedRfq.scope || "No specific scope provided."}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">Update Follow-Up Status</label>
                    <Select
                      value={newStatus}
                      onValueChange={(val) => {
                        if (val) setNewStatus(val);
                      }}
                    >
                      <SelectTrigger className="w-full h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="In Review">In Review</SelectItem>
                          <SelectItem value="Quoted">Quoted</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">Internal Follow-Up Notes</label>
                    <Input
                      value={notes}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNotes(e.target.value)}
                      placeholder="e.g. Sent technical quote via email..."
                      className="h-8 text-xs bg-card"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedRfq(null)}
                    disabled={isUpdating}
                  >
                    Close
                  </Button>
                  <Button type="submit" size="sm" disabled={isUpdating}>
                    {isUpdating ? "Saving..." : "Save Status"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirm */}
        <ConfirmDialog
          open={!!deletingRfq}
          title="Delete Inquiry"
          message={`Are you sure you want to permanently delete inquiry "${deletingRfq?.id}" from ${deletingRfq?.name}?`}
          variant="destructive"
          confirmLabel="Delete Permanently"
          loading={isDeleting}
          onConfirm={handleDelete}
          onCancel={() => setDeletingRfq(null)}
        />
      </main>
    </div>
  );
}
