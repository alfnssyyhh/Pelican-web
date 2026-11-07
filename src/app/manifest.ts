import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PT Pelican Mitra Sejati",
    short_name: "Pelican Marine",
    description:
      "Pusat layanan rekayasa teknik maritim, otomasi kapal, kalibrasi ODME/OWS, overhoul mesin diesel, dan rental genset 25-1250 kVA di Batam.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#dc2626",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
