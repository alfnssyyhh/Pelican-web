"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  UploadCloud,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  MoreHorizontal,
  Image as ImageIcon,
  FileText,
} from "lucide-react";
import { AppNavbar } from "@/components/admin/AppNavbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ListToolbar } from "@/components/ui/ListToolbar";
import { ListPagination } from "@/components/ui/ListPagination";
import { useAdminToast } from "@/components/admin/ui/toast-provider";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import type { MediaItem } from "@/lib/admin-store";

export default function MediaPage() {
  const { showToast } = useAdminToast();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // Upload dialog state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Products");
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Delete state
  const [deletingMedia, setDeletingMedia] = useState<MediaItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Copied state
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/media")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setMedia(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>(["Products", "Rentals", "Works", "Articles", "Branding"]);
    media.forEach((m) => m.category && set.add(m.category));
    return Array.from(set);
  }, [media]);

  const filteredMedia = useMemo(() => {
    return media.filter((m) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = m.title?.toLowerCase().includes(q);
        const matchFile = m.filename?.toLowerCase().includes(q);
        if (!matchTitle && !matchFile) return false;
      }
      if (categoryFilter !== "all") {
        if (m.category !== categoryFilter) return false;
      }
      return true;
    });
  }, [media, search, categoryFilter]);

  const paginatedMedia = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredMedia.slice(start, start + pageSize);
  }, [filteredMedia, page, pageSize]);

  const handleCopyUrl = (m: MediaItem) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(m.url);
      setCopiedId(m.id);
      showToast("Direct asset URL copied to clipboard.", "info");
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError("Please select a file to upload.");
      return;
    }
    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", title || selectedFile.name);
      formData.append("category", category);

      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload file.");

      if (data.media) {
        setMedia((prev) => [data.media, ...prev]);
      }
      setIsUploadOpen(false);
      setSelectedFile(null);
      setTitle("");
      showToast("Media asset uploaded successfully.", "success");
    } catch (err: any) {
      const msg = err.message || "Failed to upload file.";
      setUploadError(msg);
      showToast(msg, "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingMedia) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/media/${deletingMedia.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete media.");
      }

      setMedia((prev) => prev.filter((m) => m.id !== deletingMedia.id));
      const deletedTitle = deletingMedia.title;
      setDeletingMedia(null);
      showToast(`Media "${deletedTitle}" deleted successfully.`, "success");
    } catch (err: any) {
      showToast(err.message || "Failed to delete media.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AppNavbar />
      <main className="mx-auto w-full max-w-[1280px] px-6 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="m-0 text-3xl font-bold tracking-tight text-foreground">
              Media Asset Library
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload, preview, and manage web media assets and technical diagrams
            </p>
          </div>

          <Button
            onClick={() => {
              setSelectedFile(null);
              setTitle("");
              setUploadError(null);
              setIsUploadOpen(true);
            }}
            className="flex items-center gap-1.5 shadow-xs"
          >
            <UploadCloud className="size-4" />
            <span>Upload Media</span>
          </Button>
        </div>

        {/* Toolbar */}
        <ListToolbar
          search={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder="Search media title or filename..."
          suggestions={media.map((m) => m.title).filter(Boolean)}
          hasActiveFilters={Boolean(search || categoryFilter !== "all")}
          onResetFilters={() => {
            setSearch("");
            setCategoryFilter("all");
            setPage(1);
          }}
          className="mb-6"
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
            <SelectTrigger className="w-auto min-w-[150px] max-w-[220px] h-8 text-xs">
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

        {/* Media Grid */}
        {loading ? (
          <div className="py-20 text-center text-xs text-muted-foreground">
            Loading media assets...
          </div>
        ) : paginatedMedia.length === 0 ? (
          <div className="py-20 text-center text-xs text-muted-foreground">
            No media assets found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            {paginatedMedia.map((item) => {
              const isImage = item.mime_type?.startsWith("image/") || /\.(png|jpe?g|webp|svg)$/i.test(item.filename);
              return (
                <Card
                  key={item.id}
                  className="group overflow-hidden rounded-xl border border-border bg-card shadow-xs transition-all hover:border-slate-300 dark:hover:border-slate-600 flex flex-col"
                >
                  <div className="relative aspect-square w-full bg-muted/40 overflow-hidden flex items-center justify-center border-b border-border">
                    {isImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.url}
                        alt={item.title}
                        className="size-full object-cover transition-transform duration-200 group-hover:scale-105"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <FileText className="size-8 text-muted-foreground" />
                    )}

                    <div className="absolute top-1.5 right-1.5">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <button
                              type="button"
                              className="flex size-7 items-center justify-center rounded-lg bg-card/90 backdrop-blur-xs text-muted-foreground hover:text-foreground shadow-xs cursor-pointer outline-none"
                            >
                              <MoreHorizontal className="size-3.5" />
                            </button>
                          }
                        />
                        <DropdownMenuContent align="end" className="w-36 p-1.5">
                          <DropdownMenuItem
                            onClick={() => handleCopyUrl(item)}
                            className="cursor-pointer"
                          >
                            <Copy className="size-3.5" />
                            <span>Copy URL</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => window.open(item.url, "_blank")}
                            className="cursor-pointer"
                          >
                            <ExternalLink className="size-3.5" />
                            <span>Open Media</span>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => setDeletingMedia(item)}
                            className="cursor-pointer"
                          >
                            <Trash2 className="size-3.5" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="p-2.5 flex flex-col flex-1 justify-between gap-1">
                    <p className="truncate text-xs font-semibold text-foreground" title={item.title}>
                      {item.title}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>{item.size_kb} KB</span>
                      <button
                        type="button"
                        onClick={() => handleCopyUrl(item)}
                        className="flex items-center gap-1 text-primary hover:underline cursor-pointer font-medium"
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check className="size-2.5 text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="size-2.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        <ListPagination
          page={page}
          pageSize={pageSize}
          count={filteredMedia.length}
          onPageChange={setPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPage(1);
          }}
          pageSizeOptions={[12, 24, 48]}
        />

        {/* Upload Modal */}
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Media Asset</DialogTitle>
              <DialogDescription>
                Choose an image file from your computer to store in the media library.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleUpload} className="flex flex-col gap-4 py-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">Select File</label>
                <input
                  required
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      setSelectedFile(file);
                      if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ""));
                    }
                  }}
                  className="rounded-lg border border-border bg-card p-2 text-xs text-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-2.5 file:py-1 file:text-xs file:font-semibold file:text-primary-foreground"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">Media Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Cummins Diesel Engine Cutaway"
                  className="h-8 text-xs bg-card"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">Category</label>
                <Select
                  value={category}
                  onValueChange={(val) => {
                    if (val) setCategory(val);
                  }}
                >
                  <SelectTrigger className="w-full h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Products">Products & Spare Parts</SelectItem>
                      <SelectItem value="Rentals">Rental Fleet</SelectItem>
                      <SelectItem value="Works">Project Works</SelectItem>
                      <SelectItem value="Articles">Articles & News</SelectItem>
                      <SelectItem value="Branding">Branding & Identity</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {uploadError && (
                <p className="text-xs font-medium text-red-600 dark:text-red-400">
                  {uploadError}
                </p>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsUploadOpen(false)}
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={uploading}>
                  {uploading ? "Uploading..." : "Upload Asset"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <ConfirmDialog
          open={!!deletingMedia}
          title="Delete Media File"
          message={`Are you sure you want to permanently delete "${deletingMedia?.filename}"? Any web page linking to this image will no longer display it.`}
          variant="destructive"
          confirmLabel="Delete Permanently"
          loading={isDeleting}
          onConfirm={handleDelete}
          onCancel={() => setDeletingMedia(null)}
        />
      </main>
    </div>
  );
}
