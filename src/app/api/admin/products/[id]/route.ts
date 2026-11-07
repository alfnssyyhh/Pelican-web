import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { readProductsLive, writeProductsLive } from "@/lib/admin-store";
import { translateMaritimeIdToEn } from "@/lib/translator";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteProps) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Access denied. Session invalid or expired." },
      { status: 401 }
    );
  }

  const { id } = await params;
  const productId = parseInt(id, 10);
  if (isNaN(productId)) {
    return NextResponse.json({ error: "Invalid product ID." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const products = await readProductsLive();
    const index = products.findIndex((p) => p.id === productId);
    if (index === -1) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const current = products[index];
    const nextName = body.name !== undefined ? String(body.name).trim() : current.name;
    if (!nextName) {
      return NextResponse.json({ error: "Product name is required." }, { status: 400 });
    }

    const nextSlug =
      body.slug !== undefined
        ? String(body.slug)
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
        : current.slug;

    if (products.some((p, i) => i !== index && p.slug === nextSlug)) {
      return NextResponse.json(
        { error: "Product slug already exists on another item." },
        { status: 400 }
      );
    }

    const updated = {
      ...current,
      name: nextName,
      slug: nextSlug,
      sku: body.sku !== undefined ? String(body.sku).trim() : current.sku,
      status: body.status !== undefined ? body.status : current.status,
      stock_status: body.stock_status !== undefined ? body.stock_status : current.stock_status,
      categories:
        body.category !== undefined
          ? [String(body.category).trim()]
          : body.categories !== undefined
            ? body.categories
            : current.categories,
      short_description:
        body.short_description !== undefined
          ? String(body.short_description).trim()
          : current.short_description,
      short_description_id:
        body.short_description !== undefined
          ? String(body.short_description).trim()
          : (current.short_description_id || current.short_description),
      short_description_en:
        body.short_description_en !== undefined
          ? String(body.short_description_en).trim()
          : body.short_description !== undefined
            ? translateMaritimeIdToEn(String(body.short_description).trim())
            : (current.short_description_en || translateMaritimeIdToEn(current.short_description || "")),
      name_id: nextName,
      name_en: body.name_en !== undefined ? String(body.name_en).trim() : (current.name_en || nextName),
      description:
        body.description !== undefined ? String(body.description).trim() : current.description,
      thumbnail_url:
        body.thumbnail_url !== undefined ? body.thumbnail_url : current.thumbnail_url,
    };

    products[index] = updated;
    await writeProductsLive(products);

    return NextResponse.json({
      success: true,
      product: updated,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update product." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteProps) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Access denied. Session invalid or expired." },
      { status: 401 }
    );
  }

  const { id } = await params;
  const productId = parseInt(id, 10);
  if (isNaN(productId)) {
    return NextResponse.json({ error: "Invalid product ID." }, { status: 400 });
  }

  try {
    const products = await readProductsLive();
    const index = products.findIndex((p) => p.id === productId);
    if (index === -1) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    products.splice(index, 1);
    await writeProductsLive(products);

    return NextResponse.json({
      success: true,
      message: `Product #${productId} successfully deleted.`,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete product." },
      { status: 500 }
    );
  }
}
