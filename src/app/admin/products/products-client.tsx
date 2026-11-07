"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  MoreHorizontal,
  Edit,
  ExternalLink,
  Trash2,
  Package,
  Layers,
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
import type { Product } from "@/lib/data";

interface ProductsClientProps {
  initialProducts: Product[];
}

interface ProductFormData {
  name: string;
  slug: string;
  sku: string;
  category: string;
  stock_status: string;
  status: string;
  short_description: string;
  description: string;
  thumbnail_url: string;
}

const EMPTY_FORM: ProductFormData = {
  name: "",
  slug: "",
  sku: "",
  category: "Technoton",
  stock_status: "instock",
  status: "publish",
  short_description: "",
  description: "",
  thumbnail_url: "",
};

export function ProductsClient({ initialProducts }: ProductsClientProps) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(EMPTY_FORM);
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete state
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.categories?.forEach((c) => set.add(c)));
    return Array.from(set).sort();
  }, [products]);

  // Filtered dataset
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchSku = p.sku?.toLowerCase().includes(q);
        const matchDesc = p.short_description?.toLowerCase().includes(q);
        if (!matchName && !matchSku && !matchDesc) return false;
      }
      // Category
      if (categoryFilter !== "all") {
        if (!p.categories?.includes(categoryFilter)) return false;
      }
      // Stock Status
      if (stockFilter !== "all") {
        if (p.stock_status !== stockFilter) return false;
      }
      return true;
    });
  }, [products, search, categoryFilter, stockFilter]);

  // Paginated dataset
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, page, pageSize]);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData(EMPTY_FORM);
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      slug: p.slug,
      sku: p.sku || "",
      category: p.categories?.[0] || "Technoton",
      stock_status: p.stock_status || "instock",
      status: p.status || "publish",
      short_description: p.short_description || "",
      description: p.description || "",
      thumbnail_url: p.thumbnail_url || "",
    });
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSaving(true);
    setFormError(null);

    try {
      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : "/api/admin/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save product.");
      }

      if (editingProduct) {
        setProducts((prev) =>
          prev.map((item) => (item.id === editingProduct.id ? data.product : item))
        );
        showToast("Product updated successfully.", "success");
      } else {
        setProducts((prev) => [data.product, ...prev]);
        showToast("Product created successfully.", "success");
      }

      setIsFormOpen(false);
      router.refresh();
    } catch (err: any) {
      const msg = err.message || "Failed to save product.";
      setFormError(msg);
      showToast(msg, "error");
    } finally {
      setFormSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/products/${deletingProduct.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete product.");
      }

      setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
      const deletedName = deletingProduct.name;
      setDeletingProduct(null);
      showToast(`Product "${deletedName}" deleted successfully.`, "success");
      router.refresh();
    } catch (err: any) {
      showToast(err.message || "Failed to delete product.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const productSuggestions = React.useMemo(() => {
    const list: string[] = [];
    products.forEach((p) => {
      if (p.name) list.push(p.name);
      if (p.sku) list.push(p.sku);
      (p.categories || []).forEach((c) => list.push(c));
    });
    return list;
  }, [products]);

  return (
    <main className="mx-auto w-full max-w-[1280px] px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="m-0 text-3xl font-bold tracking-tight text-foreground">
            Products & Spare Parts
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your technical spare parts catalog, specifications, and stock
          </p>
        </div>

        <Button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="size-4" />
          <span>Add Product</span>
        </Button>
      </div>

      {/* Toolbar: Search + Category + Stock Filter */}
      <ListToolbar
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        placeholder="Search product name, SKU, or category..."
        suggestions={productSuggestions}
        hasActiveFilters={Boolean(search || categoryFilter !== "all" || stockFilter !== "all")}
        onResetFilters={() => {
          setSearch("");
          setCategoryFilter("all");
          setStockFilter("all");
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

          <Select
            value={stockFilter}
            onValueChange={(val) => {
              if (val) {
                setStockFilter(val);
                setPage(1);
              }
            }}
          >
            <SelectTrigger className="w-auto min-w-[130px] h-8 text-xs">
              <SelectValue placeholder="All stock status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All stock status</SelectItem>
                <SelectItem value="instock">Stock Available</SelectItem>
                <SelectItem value="outofstock">Stock Unavailable</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </ListToolbar>

      {/* Table Card */}
      <Card className="shadow-xs mb-4">
        <CardContent className="p-0">
          <Table className="min-w-[920px] table-fixed">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[72px] shrink-0 pl-4">Photo</TableHead>
                <TableHead className="w-[30%] min-w-[220px]">Product Name</TableHead>
                <TableHead className="w-[16%] min-w-[130px]">SKU</TableHead>
                <TableHead className="w-[18%] min-w-[140px]">Category</TableHead>
                <TableHead className="w-[14%] min-w-[110px]">Stock Status</TableHead>
                <TableHead className="w-[12%] min-w-[95px]">Status</TableHead>
                <TableHead className="w-[76px] shrink-0 text-right pr-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-12 text-center text-xs text-muted-foreground"
                  >
                    No products found matching your search criteria.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedProducts.map((p) => {
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
                              alt={p.name}
                              className="size-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <Package className="size-5 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="truncate">
                        <div className="line-clamp-1 font-normal text-xs text-slate-900 dark:text-white" title={p.name}>{p.name}</div>
                      </TableCell>
                      <TableCell className="text-xs font-bold text-[#dc2626] truncate">
                        <span title={p.sku || "-"}>{p.sku || "-"}</span>
                      </TableCell>
                      <TableCell className="text-xs font-normal text-slate-900 dark:text-white truncate">
                        <span title={p.categories?.[0] || "Technoton"}>{p.categories?.[0] || "Technoton"}</span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={p.stock_status === "instock" ? "Stock Available" : "Stock Unavailable"}
                          className="text-[10px]"
                        />
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
                              onClick={() => window.open(`/product/${p.slug}`, "_blank")}
                              className="cursor-pointer"
                            >
                              <ExternalLink className="size-3.5" />
                              <span>View on Site</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => setDeletingProduct(p)}
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
        count={filteredProducts.length}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(1);
        }}
      />

      {/* Add / Edit Product Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
            <DialogDescription>
              Provide catalog specifications, photo, and inventory status.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveProduct} className="flex flex-col gap-4 py-2">
            {/* Image upload with file picker & instant preview */}
            <ImageUploadField
              value={formData.thumbnail_url}
              onChange={(url) => setFormData((prev) => ({ ...prev, thumbnail_url: url }))}
              label="Product Featured Photo"
              category="Products"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-+|-+$/g, "");
                    setFormData((prev) => ({
                      ...prev,
                      name,
                      slug: editingProduct ? prev.slug : slug,
                    }));
                  }}
                  placeholder="e.g. Fuel Level Sensor DUT-E"
                  className="h-8 text-xs bg-card"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">
                  SKU / Part Number
                </label>
                <Input
                  value={formData.sku}
                  onChange={(e) => setFormData((prev) => ({ ...prev, sku: e.target.value }))}
                  placeholder="e.g. DUTE-485-1000"
                  className="h-8 text-xs bg-card"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                      <SelectItem value="Technoton">Technoton</SelectItem>
                      <SelectItem value="Fleet Management">Fleet Management</SelectItem>
                      <SelectItem value="Marine Sensors">Marine Sensors</SelectItem>
                      <SelectItem value="Diesel Engine Parts">Diesel Engine Parts</SelectItem>
                      <SelectItem value="Automation & Control">Automation & Control</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">Stock Status</label>
                <Select
                  value={formData.stock_status}
                  onValueChange={(val) => {
                    if (val) setFormData((prev) => ({ ...prev, stock_status: val }));
                  }}
                >
                  <SelectTrigger className="w-full h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="instock">Stock Available</SelectItem>
                      <SelectItem value="outofstock">Stock Unavailable</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">Visibility</label>
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
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">Short Summary</label>
                <span className="text-[10px] text-muted-foreground">Auto-translate ID → EN aktif</span>
              </div>
              <Input
                value={formData.short_description}
                onChange={(e) => setFormData((prev) => ({ ...prev, short_description: e.target.value }))}
                placeholder="Tulis ringkasan komponen dalam Bahasa Indonesia..."
                className="h-8 text-xs bg-card"
              />
              <p className="text-[11px] text-muted-foreground font-normal">
                Cukup isi ringkasan dalam Bahasa Indonesia. Sistem akan otomatis menerjemahkan ke Bahasa Inggris teknis untuk katalog publik internasional.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Technical Specifications & Details
              </label>
              <Textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed technical specifications, power supply, output interfaces, and operating range..."
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
                {formSaving ? "Saving..." : editingProduct ? "Save Changes" : "Create Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deletingProduct}
        title="Delete Product"
        message={`Are you sure you want to permanently delete "${deletingProduct?.name}"? This action cannot be undone.`}
        variant="destructive"
        confirmLabel="Delete Permanently"
        loading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingProduct(null)}
      />
    </main>
  );
}
