import json

PRODUCTS_PATH = "Pelican-web/pelican-app/src/data/products.json"

PRODUCT_DESC_MAP = {
    "test": "Suku cadang dan komponen pengujian industri maritim di Batam dengan jaminan kualitas OEM dan pengiriman cepat.",
    "seal-oring": "Seal O-Ring injektor mesin diesel Cummins K Series dan N Series kualitas OEM untuk galangan kapal Batam.",
    "set-lower-engine-gasket-kta-19m": "Set paking bawah mesin Cummins KTA-19M OEM lengkap untuk overhaul mesin utama kapal dan genset industri Batam.",
    "industrial-genset-rental-350-kva-silent-type": "Rental genset silent 350 kVA untuk industri galangan kapal dan proyek konstruksi di Batam dengan emisi suara rendah.",
    "marine-open-genset-rental-e1-cat-500-kva": "Rental genset maritim open type 500 kVA mesin Caterpillar E1 siap uji load bank di galangan kapal Batam.",
    "emergency-backup-power-by-yanmar-diesel-generator": "Solusi genset darurat Yanmar diesel generator untuk kontinuitas daya listrik industri dan maritim di Batam.",
    "industrial-genset-rental-1000-kva-open-type": "Rental genset industri kapasitas besar 1000 kVA open type untuk kebutuhan daya berat galangan kapal Batam.",
    "temporary-power-rental-for-construction-projects": "Layanan sewa genset daya temporer untuk proyek konstruksi dan operasional galangan kapal di Batam.",
    "marine-offshore-power-rental-solution": "Sewa genset maritim dan lepas pantai berspesifikasi tinggi untuk anjungan dan kapal kerja di perairan Batam.",
    "set-lower-engine-gasket-6bt-6ct": "Set lower gasket mesin Cummins 6BT dan 6CT OEM presisi untuk overhaul dan rekondisi mesin diesel kapal di Batam."
}

with open(PRODUCTS_PATH, "r", encoding="utf-8") as f:
    products = json.load(f)

updated_count = 0
for prod in products:
    slug = prod.get("slug")
    if slug in PRODUCT_DESC_MAP:
        prod["short_description"] = PRODUCT_DESC_MAP[slug]
        updated_count += 1
        print(f"Updated product {slug}: {len(PRODUCT_DESC_MAP[slug])} chars")

with open(PRODUCTS_PATH, "w", encoding="utf-8") as f:
    json.dump(products, f, indent=2, ensure_ascii=False)

print(f"\nSuccessfully updated {updated_count} products in {PRODUCTS_PATH}")
