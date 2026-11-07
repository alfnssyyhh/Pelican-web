import Link from "next/link";
import { readProductsLive, readPostsLive } from "@/lib/admin-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, ArrowRight, Tags, Package, FileText } from "lucide-react";
import { AppNavbar } from "@/components/admin/AppNavbar";
import { TagManagerCard } from "@/components/admin/TagManagerCard";

export const dynamic = "force-dynamic";

export default async function AdminTaxonomyPage() {
  const [products, posts] = await Promise.all([readProductsLive(), readPostsLive()]);

  const productCategoryMap = new Map<string, number>();
  products.forEach((p) => {
    (p.categories || []).forEach((c) => {
      productCategoryMap.set(c, (productCategoryMap.get(c) || 0) + 1);
    });
  });

  const postCategoryMap = new Map<string, number>();
  const postTagMap = new Map<string, number>();
  posts.forEach((p) => {
    (p.categories || []).forEach((c) => {
      postCategoryMap.set(c, (postCategoryMap.get(c) || 0) + 1);
    });
    (p.tags || []).forEach((t) => {
      postTagMap.set(t, (postTagMap.get(t) || 0) + 1);
    });
  });

  const productCategories = Array.from(productCategoryMap.entries()).sort((a, b) => b[1] - a[1]);
  const postCategories = Array.from(postCategoryMap.entries()).sort((a, b) => b[1] - a[1]);
  const postTags = Array.from(postTagMap.entries()).sort((a, b) => b[1] - a[1]);

  return (
    <div className="min-h-screen">
      <AppNavbar />
      <div className="mx-auto w-full max-w-[1280px] px-6 py-8">
      {/* Header with Back to Settings */}
      <div className="mb-6">
        <Link
          href="/admin/settings"
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Settings
        </Link>

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Taxonomy & Classifications
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Summary of categories, product lines, and topical index tags across catalog and publications
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Product Categories */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Package className="size-4 text-primary" />
                <span>Spare Parts Catalog Categories</span>
              </CardTitle>
              <CardDescription>
                Component classifications by system function and manufacturer specifications
              </CardDescription>
            </div>
            <Button asChild variant="outline" size="xs">
              <Link href="/admin/products" className="inline-flex items-center gap-1">
                <span>Manage Parts</span>
                <ArrowRight className="size-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table className="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[75%] pl-6">Category Name</TableHead>
                  <TableHead className="w-[25%] pr-6 text-right">Parts Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="h-24 text-center text-sm text-muted-foreground">
                      No product categories found.
                    </TableCell>
                  </TableRow>
                ) : (
                  productCategories.map(([cat, count]) => (
                    <TableRow key={cat}>
                      <TableCell className="pl-6 font-medium text-foreground truncate" title={cat}>
                        {cat}
                      </TableCell>
                      <TableCell className="pr-6 text-right text-muted-foreground">
                        {count} item{count !== 1 ? "s" : ""}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Post Categories */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <FileText className="size-4 text-primary" />
                <span>Technical Article Categories</span>
              </CardTitle>
              <CardDescription>
                Marine engineering domains, maintenance guides, and operational updates
              </CardDescription>
            </div>
            <Button asChild variant="outline" size="xs">
              <Link href="/admin/posts" className="inline-flex items-center gap-1">
                <span>Manage Articles</span>
                <ArrowRight className="size-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table className="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[75%] pl-6">Topic Area</TableHead>
                  <TableHead className="w-[25%] pr-6 text-right">Articles Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {postCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="h-24 text-center text-sm text-muted-foreground">
                      No article categories found.
                    </TableCell>
                  </TableRow>
                ) : (
                  postCategories.map(([cat, count]) => (
                    <TableRow key={cat}>
                      <TableCell className="pl-6 font-medium text-foreground truncate" title={cat}>
                        {cat}
                      </TableCell>
                      <TableCell className="pr-6 text-right text-muted-foreground">
                        {count} article{count !== 1 ? "s" : ""}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Tags Cloud / Management */}
      <TagManagerCard initialTags={postTags} />
      </div>
    </div>
  );
}
