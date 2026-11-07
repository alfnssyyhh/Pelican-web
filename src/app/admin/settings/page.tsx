"use client";

import * as React from "react";
import Link from "next/link";
import {
  Layers,
  FileText,
  Truck,
  Briefcase,
  ClipboardList,
  ImageIcon,
  Tags,
  Building2,
  PhoneCall,
  Globe,
  Users,
  Lock,
  ChevronRight,
  Loader2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAdminToast } from "@/components/admin/ui/toast-provider";
import { AppNavbar } from "@/components/admin/AppNavbar";
import type { SiteSettings } from "@/lib/admin-store";

interface SettingsItem {
  label: string;
  description: string;
  icon: LucideIcon;
  path?: string;
  onClick?: () => void;
}

interface SettingsGroup {
  title: string;
  items: SettingsItem[];
}

type ModalType = "company" | "contact" | "seo" | null;

const INITIAL_SETTINGS: SiteSettings = {
  general: {
    company_name: "PT Pelican Mitra Sejati",
    tagline: "Marine Engineering Solutions, Vessel Automation, and Industrial Power Systems",
    email: "info@pelican-ms.com",
    phone: "+62 877 8780 6333",
    whatsapp: "6287787806333",
    address:
      "Komplek Pertokoan Cipta Puri Blok CC No. 15, Tiban Baru, Sekupang, Kota Batam, Kepulauan Riau 29426",
    operating_hours: "Monday to Saturday 08:00 to 17:00 WIB, 24/7 emergency support",
    default_locale: "en",
  },
  seo: {
    meta_title: "PT Pelican Mitra Sejati | Marine Engineering and Ship Spare Parts Batam",
    meta_description:
      "Authorized partner for marine engineering, Cummins and MAN marine diesel engine overhaul, electrical automation, Technoton sensor calibration, and industrial generator rental in Batam.",
    canonical_domain: "https://pelican-ms.com",
    og_image: "/og-image.png",
    robots_index: true,
    sitemap_enabled: true,
    llms_txt_enabled: true,
    google_verification: "pelican-ms-verified-search-console",
  },
  users: [],
};

export default function AdminSettingsPage() {
  const { showToast } = useAdminToast();
  const [settings, setSettings] = React.useState<SiteSettings>(INITIAL_SETTINGS);
  const [form, setForm] = React.useState<SiteSettings>(INITIAL_SETTINGS);
  const [activeModal, setActiveModal] = React.useState<ModalType>(null);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((json: SiteSettings) => {
        if (json && json.general) {
          setSettings(json);
          setForm(json);
        }
      })
      .catch(() => {});
  }, []);

  const openModal = (type: ModalType) => {
    setForm(settings);
    setActiveModal(type);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        showToast(json.error || "Failed to update system settings.", "error");
        return;
      }
      if (json.settings) {
        setSettings(json.settings);
        setForm(json.settings);
      }
      setActiveModal(null);
      showToast("Settings updated successfully.", "success");
    } catch {
      showToast("Unable to reach server. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const groups: SettingsGroup[] = [
    {
      title: "Catalog & Content",
      items: [
        {
          label: "Products & Spare Parts",
          description: "Manage marine diesel components, filtration, and sensor hardware",
          icon: Layers,
          path: "/admin/products",
        },
        {
          label: "Technical Articles",
          description: "Publish engineering field guides, maintenance insights, and news",
          icon: FileText,
          path: "/admin/posts",
        },
        {
          label: "Generator Fleet",
          description: "Monitor rental fleet inventory, specifications, and availability",
          icon: Truck,
          path: "/admin/rentals",
        },
        {
          label: "Project Portfolio",
          description: "Showcase completed marine automation and vessel overhauls",
          icon: Briefcase,
          path: "/admin/works",
        },
      ],
    },
    {
      title: "Inquiries & Operations",
      items: [
        {
          label: "Quotation Requests",
          description: "Review, status track, and respond to incoming customer RFQs",
          icon: ClipboardList,
          path: "/admin/rfq",
        },
        {
          label: "Media Asset Library",
          description: "Manage high-resolution photos, spec sheets, and project banners",
          icon: ImageIcon,
          path: "/admin/media",
        },
        {
          label: "Taxonomy & Categories",
          description: "Structure part categories, system brands, and article tags",
          icon: Tags,
          path: "/admin/taxonomy",
        },
      ],
    },
    {
      title: "Company Profile & SEO",
      items: [
        {
          label: "Company Identity",
          description: "Update corporate legal name, tagline, workshop address, and hours",
          icon: Building2,
          onClick: () => openModal("company"),
        },
        {
          label: "Contact Channels",
          description: "Configure official email, office phone, and WhatsApp numbers",
          icon: PhoneCall,
          onClick: () => openModal("contact"),
        },
        {
          label: "Search Engine Optimization",
          description: "Configure meta titles, search descriptions, and canonical domain",
          icon: Globe,
          onClick: () => openModal("seo"),
        },
      ],
    },
    {
      title: "System & Security",
      items: [
        {
          label: "Users & Staff",
          description: "Manage administrator accounts, assign departments, and check activity",
          icon: Users,
          path: "/admin/users",
        },
        {
          label: "Profile & Security",
          description: "Update your personal credentials, contact info, and security password",
          icon: Lock,
          path: "/admin/profile",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <AppNavbar />
      <div className="mx-auto w-full max-w-[1280px] px-6 py-8">
      {/* Header (matches deliverjob-share/screenshots/settings.png) */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your system configuration, catalog structures, and company profiles
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => (
          <Card key={group.title} className="h-full w-full shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold">{group.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-0.5 pt-0">
              {group.items.map((item) => {
                const Icon = item.icon;
                const content = (
                  <>
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 transition-colors group-hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400 dark:group-hover:bg-red-900/50">
                      <Icon className="size-4.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-red-600 group-hover:text-red-700 dark:text-red-400 dark:group-hover:text-red-300">
                        {item.label}
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {item.description}
                      </div>
                    </div>
                    <ChevronRight className="size-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" />
                  </>
                );

                if (item.path) {
                  return (
                    <Link
                      key={item.label}
                      href={item.path}
                      className="group flex items-center gap-3 rounded-lg px-2.5 py-2.5 transition-colors hover:bg-muted"
                    >
                      {content}
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={item.onClick}
                    className="group flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left transition-colors hover:bg-muted"
                  >
                    {content}
                  </button>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal: Company Identity */}
      <Dialog open={activeModal === "company"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-lg">
          <form onSubmit={handleSaveSettings}>
            <DialogHeader>
              <DialogTitle>Company Identity</DialogTitle>
              <DialogDescription>
                Configure registered organization identity and workshop location.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <Field>
                <FieldLabel htmlFor="company_name">Company Name</FieldLabel>
                <Input
                  id="company_name"
                  value={form.general.company_name}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      general: { ...prev.general, company_name: e.target.value },
                    }))
                  }
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="tagline">Tagline</FieldLabel>
                <Input
                  id="tagline"
                  value={form.general.tagline}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      general: { ...prev.general, tagline: e.target.value },
                    }))
                  }
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="address">Workshop & Office Address</FieldLabel>
                <Textarea
                  id="address"
                  rows={3}
                  value={form.general.address}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      general: { ...prev.general, address: e.target.value },
                    }))
                  }
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="operating_hours">Operating Hours</FieldLabel>
                <Input
                  id="operating_hours"
                  value={form.general.operating_hours}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      general: { ...prev.general, operating_hours: e.target.value },
                    }))
                  }
                />
              </Field>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveModal(null)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Contact Channels */}
      <Dialog open={activeModal === "contact"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-lg">
          <form onSubmit={handleSaveSettings}>
            <DialogHeader>
              <DialogTitle>Contact Channels</DialogTitle>
              <DialogDescription>
                Set official communication lines for customer inquiries and quotations.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <Field>
                <FieldLabel htmlFor="contact_email">Corporate Email</FieldLabel>
                <Input
                  id="contact_email"
                  type="email"
                  value={form.general.email}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      general: { ...prev.general, email: e.target.value },
                    }))
                  }
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="contact_phone">Office Phone</FieldLabel>
                <Input
                  id="contact_phone"
                  value={form.general.phone}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      general: { ...prev.general, phone: e.target.value },
                    }))
                  }
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="contact_whatsapp">WhatsApp Hotline Number</FieldLabel>
                <Input
                  id="contact_whatsapp"
                  placeholder="e.g. 6287787806333"
                  value={form.general.whatsapp}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      general: { ...prev.general, whatsapp: e.target.value },
                    }))
                  }
                  required
                />
              </Field>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveModal(null)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: SEO Configuration */}
      <Dialog open={activeModal === "seo"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-lg">
          <form onSubmit={handleSaveSettings}>
            <DialogHeader>
              <DialogTitle>Search Engine Optimization</DialogTitle>
              <DialogDescription>
                Configure public search engine indexing, metadata, and site authority.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <Field>
                <FieldLabel htmlFor="meta_title">Default Meta Title</FieldLabel>
                <Input
                  id="meta_title"
                  value={form.seo.meta_title}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      seo: { ...prev.seo, meta_title: e.target.value },
                    }))
                  }
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="meta_description">Meta Description</FieldLabel>
                <Textarea
                  id="meta_description"
                  rows={3}
                  value={form.seo.meta_description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      seo: { ...prev.seo, meta_description: e.target.value },
                    }))
                  }
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="canonical_domain">Canonical Domain</FieldLabel>
                <Input
                  id="canonical_domain"
                  value={form.seo.canonical_domain}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      seo: { ...prev.seo, canonical_domain: e.target.value },
                    }))
                  }
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="google_verification">Google Search Console Verification</FieldLabel>
                <Input
                  id="google_verification"
                  value={form.seo.google_verification}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      seo: { ...prev.seo, google_verification: e.target.value },
                    }))
                  }
                />
              </Field>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveModal(null)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
