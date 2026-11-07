import { AppNavbar } from "@/components/admin/AppNavbar";
import { OverviewClient } from "./overview-client";
import {
  readRfqsLive,
  readRentalsLive,
  readProductsLive,
  readPostsLive,
  readWorksLive,
} from "@/lib/admin-store";

export const metadata = {
  title: "Overview | Pelican Admin",
};

export default async function OverviewPage() {
  const [rfqs, rentals, products, posts, works] = await Promise.all([
    readRfqsLive(),
    readRentalsLive(),
    readProductsLive(),
    readPostsLive(),
    readWorksLive(),
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <AppNavbar />
      <OverviewClient
        initialRfqs={rfqs}
        initialRentals={rentals}
        initialProducts={products}
        initialPosts={posts}
        initialWorks={works}
      />
    </div>
  );
}
