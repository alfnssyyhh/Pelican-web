import fs from "fs/promises";
import path from "path";
import type { Product, Post } from "@/lib/data";

export interface RentalUnit {
  id: number;
  code: string;
  name: string;
  kva: string;
  kw: string;
  engine: string;
  canopy: string;
  voltage: string;
  fuel_rate: string;
  noise_level: string;
  status: "available" | "rented" | "maintenance" | string;
  location: string;
  thumbnail_url: string | null;
  description: string;
}

export interface WorkProject {
  id: number;
  slug: string;
  client: string;
  vessel: string;
  location: string;
  year: string;
  category: string;
  status: "publish" | "draft" | string;
  banner: string;
  scope: string;
  milestones: string[];
}

export interface RfqInquiry {
  id: string;
  createdAt: string;
  name: string;
  company: string;
  vesselOrProject: string;
  phone: string;
  category: string;
  scope: string;
  status: "Baru" | "Diproses" | "Selesai" | "Diarsipkan" | string;
  notes?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "rfq" | "rental" | "post" | "product" | "work" | string;
  link: string;
  is_read: boolean;
  created_at: string;
}

export interface MediaItem {
  id: number;
  title: string;
  filename: string;
  url: string;
  category: string;
  mime_type: string;
  size_kb: number;
  alt_text: string;
  uploaded_at: string;
}

export interface AdminUserItem {
  id: number;
  username: string;
  display_name: string;
  email: string;
  role: string;
  department: string;
  status: "Aktif" | "Nonaktif" | string;
  last_active: string;
  password_hash?: string;
  salt?: string;
}

export interface SiteSettings {
  general: {
    company_name: string;
    tagline: string;
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    operating_hours: string;
    default_locale: "id" | "en";
  };
  seo: {
    meta_title: string;
    meta_description: string;
    canonical_domain: string;
    og_image: string;
    robots_index: boolean;
    sitemap_enabled: boolean;
    llms_txt_enabled: boolean;
    google_verification: string;
  };
  users: AdminUserItem[];
}

function getDataPath(filename: string): string {
  // If running inside .next/standalone, persist to the real project root directory as well
  return path.join(process.cwd(), "src", "data", filename);
}

function getSourceDataPath(filename: string): string | null {
  // Check if cwd ends with '.next\standalone' or '.next/standalone'
  const cwd = process.cwd();
  if (cwd.includes(".next") && cwd.includes("standalone")) {
    const projectRoot = path.resolve(cwd, "..", "..");
    return path.join(projectRoot, "src", "data", filename);
  }
  return null;
}

async function readJsonFile<T>(filename: string, fallback: T): Promise<T> {
  try {
    const filePath = getDataPath(filename);
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  const filePath = getDataPath(filename);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");

  // Also write to parent project root if running from standalone
  const sourcePath = getSourceDataPath(filename);
  if (sourcePath) {
    try {
      await fs.mkdir(path.dirname(sourcePath), { recursive: true });
      await fs.writeFile(sourcePath, JSON.stringify(data, null, 2), "utf-8");
    } catch {
      // ignore
    }
  }
}

export async function readProductsLive(): Promise<Product[]> {
  return readJsonFile<Product[]>("products.json", []);
}

export async function writeProductsLive(products: Product[]): Promise<void> {
  return writeJsonFile("products.json", products);
}

export async function readPostsLive(): Promise<Post[]> {
  return readJsonFile<Post[]>("posts.json", []);
}

export async function writePostsLive(posts: Post[]): Promise<void> {
  return writeJsonFile("posts.json", posts);
}

export async function readRentalsLive(): Promise<RentalUnit[]> {
  return readJsonFile<RentalUnit[]>("rentals.json", []);
}

export async function writeRentalsLive(rentals: RentalUnit[]): Promise<void> {
  return writeJsonFile("rentals.json", rentals);
}

export async function readWorksLive(): Promise<WorkProject[]> {
  return readJsonFile<WorkProject[]>("works.json", []);
}

export async function writeWorksLive(works: WorkProject[]): Promise<void> {
  return writeJsonFile("works.json", works);
}

export async function readRfqsLive(): Promise<RfqInquiry[]> {
  return readJsonFile<RfqInquiry[]>("rfqs.json", []);
}

export async function writeRfqsLive(rfqs: RfqInquiry[]): Promise<void> {
  return writeJsonFile("rfqs.json", rfqs);
}

export async function readNotificationsLive(): Promise<NotificationItem[]> {
  return readJsonFile<NotificationItem[]>("notifications.json", []);
}

export async function writeNotificationsLive(notifications: NotificationItem[]): Promise<void> {
  return writeJsonFile("notifications.json", notifications);
}

export async function readMediaLive(): Promise<MediaItem[]> {
  return readJsonFile<MediaItem[]>("media.json", []);
}

export async function writeMediaLive(media: MediaItem[]): Promise<void> {
  return writeJsonFile("media.json", media);
}

const DEFAULT_SETTINGS: SiteSettings = {
  general: {
    company_name: "PT Pelican Mitra Sejati",
    tagline: "Solusi Rekayasa Maritim, Otomasi Kapal, dan Sistem Daya Industri",
    email: "info@pelican-ms.com",
    phone: "+62 877 8780 6333",
    whatsapp: "6287787806333",
    address:
      "Komplek Pertokoan Cipta Puri Blok CC No. 15, Tiban Baru, Sekupang, Kota Batam, Kepulauan Riau 29426",
    operating_hours:
      "Senin sampai Sabtu pukul 08.00 sampai 17.00 WIB, dukungan darurat 24 jam",
    default_locale: "id",
  },
  seo: {
    meta_title:
      "PT Pelican Mitra Sejati | Rekayasa Maritim dan Suku Cadang Kapal Batam",
    meta_description:
      "Mitra resmi rekayasa maritim, overhaul mesin diesel kapal Cummins dan MAN, otomasi kelistrikan, kalibrasi sensor Technoton, serta sewa genset industri di Batam.",
    canonical_domain: "https://pelican-ms.com",
    og_image: "/og-image.png",
    robots_index: true,
    sitemap_enabled: true,
    llms_txt_enabled: true,
    google_verification: "pelican-ms-verified-search-console",
  },
  users: [],
};

export async function readSettingsLive(): Promise<SiteSettings> {
  return readJsonFile<SiteSettings>("settings.json", DEFAULT_SETTINGS);
}

export async function writeSettingsLive(settings: SiteSettings): Promise<void> {
  return writeJsonFile("settings.json", settings);
}
