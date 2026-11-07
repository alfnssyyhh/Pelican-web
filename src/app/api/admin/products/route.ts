import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { readProductsLive, writeProductsLive } from "@/lib/admin-store";
import { translateMaritimeIdToEn } from "@/lib/translator";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Access denied. Session invalid or expired." },
      { status: 401 }
    );
  }
  const products = await readProductsLive();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Access denied. Session invalid or expired." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const {
      name,
      slug,
      sku,
      category,
      stock_status,
      status,
      short_description,
      description,
      thumbnail_url,
    } = body;

    if (!name || !String(name).trim()) {
      return NextResponse.json({ error: "Product name is required." }, { status: 400 });
    }

    const cleanSlug = String(slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const products = await readProductsLive();

    if (products.some((p) => p.slug === cleanSlug)) {
      return NextResponse.json(
        { error: "Product slug already exists. Please use a unique title or slug." },
        { status: 400 }
      );
    }

    const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;

    const shortDesc = String(short_description || "").trim();
    const shortDescEn = body.short_description_en
      ? String(body.short_description_en).trim()
      : translateMaritimeIdToEn(shortDesc);

    const newProduct = {
      id: newId,
      name: String(name).trim(),
      name_id: String(name).trim(),
      name_en: body.name_en ? String(body.name_en).trim() : String(name).trim(),
      slug: cleanSlug,
      status: status || "publish",
      sku: String(sku || "").trim(),
      price: "",
      regular_price: "",
      stock_status: stock_status || "instock",
      categories: category ? [String(category).trim()] : ["Technoton"],
      tags: [],
      description: String(description || "").trim(),
      short_description: shortDesc,
      short_description_id: shortDesc,
      short_description_en: shortDescEn,
      thumbnail_url: thumbnail_url ? String(thumbnail_url).trim() : "/uploads/2025/11/product-img.png",
    };

    products.unshift(newProduct);
    await writeProductsLive(products);

    return NextResponse.json({
      success: true,
      product: newProduct,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create product." },
      { status: 500 }
    );
  }
}
