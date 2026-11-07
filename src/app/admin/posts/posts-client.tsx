"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  MoreHorizontal,
  Edit,
  ExternalLink,
  Trash2,
  FileText,
  X,
} from "lucide-react";
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
import type { Post } from "@/lib/data";

interface PostsClientProps {
  initialPosts: Post[];
}

interface PostFormData {
  title: string;
  slug: string;
  category: string;
  status: string;
  excerpt: string;
  content: string;
  thumbnail_url: string;
  tags: string[];
}

const EMPTY_FORM: PostFormData = {
  title: "",
  slug: "",
  category: "Electrical & marine automation",
  status: "publish",
  excerpt: "",
  content: "",
  thumbnail_url: "",
  tags: [],
};

export function PostsClient({ initialPosts }: PostsClientProps) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState<PostFormData>(EMPTY_FORM);
  const [tagInput, setTagInput] = useState("");
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete state
  const [deletingPost, setDeletingPost] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => p.categories?.forEach((c) => set.add(c)));
    return Array.from(set).sort();
  }, [posts]);

  // All existing tags for quick suggestion
  const allExistingTags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => p.tags?.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [posts]);

  const availableTagSuggestions = useMemo(() => {
    const selected = new Set(formData.tags.map((t) => t.toLowerCase()));
    return allExistingTags.filter((t) => !selected.has(t.toLowerCase()));
  }, [allExistingTags, formData.tags]);

  const handleAddTag = (tagToAdd: string) => {
    const clean = tagToAdd.trim().replace(/^#+/, "");
    if (!clean) return;
    if (formData.tags.some((t) => t.toLowerCase() === clean.toLowerCase())) return;
    setFormData((prev) => ({ ...prev, tags: [...prev.tags, clean] }));
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag(tagInput);
    } else if (e.key === "Backspace" && !tagInput && formData.tags.length > 0) {
      handleRemoveTag(formData.tags[formData.tags.length - 1]);
    }
  };

  // Filtered dataset
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchExcerpt = p.excerpt?.toLowerCase().includes(q);
        if (!matchTitle && !matchExcerpt) return false;
      }
      // Category
      if (categoryFilter !== "all") {
        if (!p.categories?.includes(categoryFilter)) return false;
      }
      // Status
      if (statusFilter !== "all") {
        if (p.status !== statusFilter) return false;
      }
      return true;
    });
  }, [posts, search, categoryFilter, statusFilter]);

  // Paginated dataset
  const paginatedPosts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredPosts.slice(start, start + pageSize);
  }, [filteredPosts, page, pageSize]);

  const handleOpenCreate = () => {
    setEditingPost(null);
    setFormData(EMPTY_FORM);
    setTagInput("");
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (p: Post) => {
    setEditingPost(p);
    setFormData({
      title: p.title,
      slug: p.slug,
      category: p.categories?.[0] || "Electrical & marine automation",
      status: p.status || "publish",
      excerpt: p.excerpt || "",
      content: p.content || "",
      thumbnail_url: p.thumbnail_url || "",
      tags: Array.isArray(p.tags) ? [...p.tags] : [],
    });
    setTagInput("");
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSaving(true);
    setFormError(null);

    try {
      const url = editingPost
        ? `/api/admin/posts/${editingPost.id}`
        : "/api/admin/posts";
      const method = editingPost ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save article.");
      }

      if (editingPost) {
        setPosts((prev) =>
          prev.map((item) => (item.id === editingPost.id ? data.post : item))
        );
        showToast("Technical article updated successfully.", "success");
      } else {
        setPosts((prev) => [data.post, ...prev]);
        showToast("Technical article published successfully.", "success");
      }

      setIsFormOpen(false);
      router.refresh();
    } catch (err: any) {
      const msg = err.message || "Failed to save article.";
      setFormError(msg);
      showToast(msg, "error");
    } finally {
      setFormSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingPost) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/posts/${deletingPost.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete article.");
      }

      setPosts((prev) => prev.filter((p) => p.id !== deletingPost.id));
      const deletedTitle = deletingPost.title;
      setDeletingPost(null);
      showToast(`Article "${deletedTitle}" deleted successfully.`, "success");
      router.refresh();
    } catch (err: any) {
      showToast(err.message || "Failed to delete article.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const postSuggestions = React.useMemo(() => {
    const list: string[] = [];
    posts.forEach((p) => {
      if (p.title) list.push(p.title);
      (p.categories || []).forEach((c) => list.push(c));
      (p.tags || []).forEach((t) => list.push(t));
    });
    return list;
  }, [posts]);

  return (
    <main className="mx-auto w-full max-w-[1280px] px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="m-0 text-3xl font-bold tracking-tight text-foreground">
            Articles & News
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your technical publications, marine case studies, and engineering news
          </p>
        </div>

        <Button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="size-4" />
          <span>New Article</span>
        </Button>
      </div>

      {/* Toolbar */}
      <ListToolbar
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        placeholder="Search article title, topic, or keyword..."
        suggestions={postSuggestions}
        hasActiveFilters={Boolean(search || categoryFilter !== "all" || statusFilter !== "all")}
        onResetFilters={() => {
          setSearch("");
          setCategoryFilter("all");
          setStatusFilter("all");
          setPage(1);
        }}
        className="mb-4"
      >
        <div className="flex items-center gap-2">
          <Select
            value={categoryFilter}
            onValueChange={(val) => {
              if (val) {
                setCategoryFilter(val);
                setPage(1);
              }
            }}
          >
            <SelectTrigger className="w-auto min-w-[150px] max-w-[240px] h-8 text-xs">
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

          <Select
            value={statusFilter}
            onValueChange={(val) => {
              if (val) {
                setStatusFilter(val);
                setPage(1);
              }
            }}
          >
            <SelectTrigger className="w-auto min-w-[130px] h-8 text-xs">
              <SelectValue placeholder="All status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="publish">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </ListToolbar>

      {/* Table Card */}
      <Card className="shadow-xs mb-4">
        <CardContent className="p-0">
          <Table className="min-w-[860px] table-fixed">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[72px] shrink-0 pl-4">Photo</TableHead>
                <TableHead className="w-[42%] min-w-[280px]">Article Title</TableHead>
                <TableHead className="w-[22%] min-w-[150px]">Category</TableHead>
                <TableHead className="w-[18%] min-w-[130px]">Date Published</TableHead>
                <TableHead className="w-[14%] min-w-[100px]">Status</TableHead>
                <TableHead className="w-[76px] shrink-0 text-right pr-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPosts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-12 text-center text-xs text-muted-foreground"
                  >
                    No articles found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedPosts.map((p) => {
                  const dateStr = p.date ? new Date(p.date).toLocaleDateString("en-GB") : "-";
                  return (
                    <TableRow
                      key={p.id}
                      className="cursor-pointer hover:bg-neutral-200/70 dark:hover:bg-neutral-800/80 transition-colors"
                      onClick={() => handleOpenEdit(p)}
                    >
                      <TableCell className="py-2.5 pl-4">
                        <div className="size-10 rounded-lg overflow-hidden border border-border bg-muted shrink-0 flex items-center justify-center">
                          {p.thumbnail_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={p.thumbnail_url}
                              alt={p.title}
                              className="size-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <FileText className="size-5 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="truncate">
                        <div className="line-clamp-1 font-normal text-xs text-slate-900 dark:text-white" title={p.title}>{p.title}</div>
                      </TableCell>
                      <TableCell className="text-xs font-normal text-slate-900 dark:text-white truncate">
                        <span title={p.categories?.[0] || "General"}>{p.categories?.[0] || "General"}</span>
                      </TableCell>
                      <TableCell className="text-xs font-normal text-slate-900 dark:text-white whitespace-nowrap">
                        {dateStr}
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={p.status || "publish"}
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
                          <DropdownMenuContent align="end" className="w-40 p-1.5">
                            <DropdownMenuItem
                              onClick={() => handleOpenEdit(p)}
                              className="cursor-pointer"
                            >
                              <Edit className="size-3.5" />
                              <span>Edit</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => window.open(`/artikel/${p.slug}`, "_blank")}
                              className="cursor-pointer"
                            >
                              <ExternalLink className="size-3.5" />
                              <span>View on Site</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => setDeletingPost(p)}
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
        count={filteredPosts.length}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(1);
        }}
      />

      {/* Add / Edit Article Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? "Edit Article" : "Write New Article"}
            </DialogTitle>
            <DialogDescription>
              Draft technical articles, service reports, and publications.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSavePost} className="flex flex-col gap-4 py-2">
            {/* Image upload with file picker & instant preview */}
            <ImageUploadField
              value={formData.thumbnail_url}
              onChange={(url) => setFormData((prev) => ({ ...prev, thumbnail_url: url }))}
              label="Featured Cover Image"
              category="Articles"
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Article Title <span className="text-red-500">*</span>
              </label>
              <Input
                required
                value={formData.title}
                onChange={(e) => {
                  const title = e.target.value;
                  const slug = title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-+|-+$/g, "");
                  setFormData((prev) => ({
                    ...prev,
                    title,
                    slug: editingPost ? prev.slug : slug,
                  }));
                }}
                placeholder="e.g. Marine Automation and Alarm Monitoring Systems"
                className="h-8 text-xs bg-card"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">Category</label>
                <Select
                  value={formData.category}
                  onValueChange={(val) => {
                    if (val) setFormData((prev) => ({ ...prev, category: val }));
                  }}
                >
                  <SelectTrigger className="w-full h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Electrical & marine automation">Electrical & marine automation</SelectItem>
                      <SelectItem value="Diesel Engine Services">Diesel Engine Services</SelectItem>
                      <SelectItem value="Generator Rental">Generator Rental</SelectItem>
                      <SelectItem value="ODME & OWS Calibration">ODME & OWS Calibration</SelectItem>
                      <SelectItem value="Shipyard Case Studies">Shipyard Case Studies</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
              <label className="text-xs font-semibold text-foreground">Brief Excerpt</label>
              <Input
                value={formData.excerpt}
                onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Short summary for preview cards..."
                className="h-8 text-xs bg-card"
              />
            </div>

            {/* Technical Keyword Tags (SEO) */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">
                  Technical Keyword Tags (SEO)
                </label>
                <span className="text-[11px] text-muted-foreground">
                  Press Enter or comma to add
                </span>
              </div>

              {/* Tag Input and Current Badges */}
              <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-input bg-card p-2 min-h-10">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      aria-label={`Remove tag ${tag}`}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder={
                    formData.tags.length === 0
                      ? "Type tag and press Enter (e.g. Troubleshooting)..."
                      : "Add more tags..."
                  }
                  className="flex-1 min-w-[140px] bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>

              {/* Quick suggestions from existing tags */}
              {availableTagSuggestions.length > 0 && (
                <div className="flex flex-wrap items-center gap-1 pt-1">
                  <span className="text-[11px] text-muted-foreground mr-1">Suggested:</span>
                  {availableTagSuggestions.slice(0, 8).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleAddTag(t)}
                      className="rounded border border-border bg-muted/40 px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      +{t}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Article Body Content (HTML or Markdown)
              </label>
              <Textarea
                rows={6}
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="Full article text, sections, and technical details..."
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
                {formSaving ? "Saving..." : editingPost ? "Save Changes" : "Publish Article"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deletingPost}
        title="Delete Article"
        message={`Are you sure you want to permanently delete "${deletingPost?.title}"? This action cannot be undone.`}
        variant="destructive"
        confirmLabel="Delete Permanently"
        loading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingPost(null)}
      />
    </main>
  );
}
