import { AppNavbar } from "@/components/admin/AppNavbar";
import { ProductsClient } from "./products-client";
import { readProductsLive } from "@/lib/admin-store";

export const metadata = {
  title: "Products & Spare Parts | Pelican Admin",
};

export default async function ProductsPage() {
  const products = await readProductsLive();

  return (
    <div className="min-h-screen flex flex-col">
      <AppNavbar />
      <ProductsClient initialProducts={products} />
    </div>
  );
}
