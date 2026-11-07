import { AppNavbar } from "@/components/admin/AppNavbar";

export default function DashboardPage() {
  const displayName = "PelicanAdmin88";

  return (
    <div className="min-h-screen flex flex-col">
      <AppNavbar />
      <main className="mx-auto flex flex-1 w-full max-w-[1280px] flex-col items-center justify-center px-6 text-center py-20">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          Welcome back, {displayName}.
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl font-normal leading-relaxed">
          Let&apos;s get started by exploring your dashboard and managing your service orders, products, fleet rentals, and inquiries.
        </p>
      </main>
    </div>
  );
}
