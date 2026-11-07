/**
 * Technical Maritime & Industrial Auto-Translator Engine
 * Translates Indonesian product and equipment specifications to English automatically on save.
 * Preserves brand names, model codes, ratings (kVA, kW, RPM), and marine engineering terminology.
 */

// Exact full-sentence or exact description overrides for known product catalog entries
const EXACT_DESCRIPTIONS: Record<string, string> = {
  "Digunakan untuk pengukuran level dan volume bahan bakar yang akurat di tangki kendaraan.":
    "Used for accurate fuel level and volume measurement in vehicle and marine fuel tanks.",
  "Dirancang untuk pengukuran konsumsi bahan bakar diesel pada saluran bahan bakar kendaraan dan...":
    "Designed for high-precision diesel fuel consumption measurement across vehicle and marine fuel lines.",
  "Dirancang untuk pengukuran laju aliran bahan bakar dan cairan lain yang akurat yang digunakan di kapal...":
    "Engineered for accurate flow rate measurement of diesel fuel and industrial fluids utilized in commercial vessels.",
  "Penggunaan dfm fuel flow & smart fuel level sensors atau sensor level bahan bakar pintar menjadi solusi...":
    "The application of DFM differential flow meters and smart capacitive fuel sensors delivers an advanced telematics solution for vessel efficiency.",
  "Seal O-Ring injektor mesin diesel Cummins K Series dan N Series kualitas OEM untuk galangan kapal Batam.":
    "OEM-grade injector seal O-rings for Cummins K and N Series marine diesel engines, stocked for Batam shipyards.",
  "Set paking bawah mesin Cummins KTA-19M OEM lengkap untuk overhaul mesin utama kapal dan genset industri Batam.":
    "Complete OEM Cummins KTA-19M lower engine gasket kit for marine main propulsion overhaul and industrial genset rebuilds in Batam.",
  "Set lower gasket mesin Cummins 6BT dan 6CT OEM presisi untuk overhaul dan rekondisi mesin diesel kapal di Batam.":
    "Precision OEM lower engine gasket kit for Cummins 6BT and 6CT diesel engines, engineered for marine overhaul in Batam shipyards.",
  "Rental genset silent 350 kVA untuk industri galangan kapal dan proyek konstruksi di Batam dengan emisi suara rendah.":
    "350 kVA acoustic silent diesel generator rental for Batam shipyards and construction projects with low sound emissions.",
  "Rental genset maritim open type 500 kVA mesin Caterpillar E1 siap uji load bank di galangan kapal Batam.":
    "500 kVA open-type marine diesel generator powered by Caterpillar E1, load-bank tested and ready for Batam shipyard mobilization.",
  "Solusi genset darurat Yanmar diesel generator untuk kontinuitas daya listrik industri dan maritim di Batam.":
    "Yanmar diesel generator emergency backup power solutions ensuring continuous electrical uptime for Batam industrial operations.",
  "Rental genset industri kapasitas besar 1000 kVA open type untuk kebutuhan daya berat galangan kapal Batam.":
    "Heavy-duty 1000 kVA open-type industrial generator rental delivering high-capacity prime power for Batam shipyard operations.",
  "Layanan sewa genset daya temporer untuk proyek konstruksi dan operasional galangan kapal di Batam.":
    "Temporary electrical power rental services tailored for heavy construction infrastructure and shipyard operations in Batam.",
  "Sewa genset maritim dan lepas pantai berspesifikasi tinggi untuk anjungan dan kapal kerja di perairan Batam.":
    "High-specification marine and offshore power generator rentals designed for workboats, barges, and offshore platforms in Batam waters.",
};

// Maritime & Technical Phrase Replacement Dictionary (ordered from longest phrase to shortest)
const PHRASE_DICTIONARY: [RegExp, string][] = [
  // Sentence starters
  [/^Digunakan untuk\b/gi, "Used for"],
  [/^Dirancang untuk\b/gi, "Designed for"],
  [/^Cocok untuk\b/gi, "Suitable for"],
  [/^Solusi untuk\b/gi, "A comprehensive solution for"],
  [/^Menyediakan\b/gi, "Provides"],
  [/^Dilengkapi dengan\b/gi, "Equipped with"],
  [/^Ditenagai oleh\b/gi, "Powered by"],

  // Technical Maritime Phrasing
  [/\bgalangan kapal Batam\b/gi, "Batam shipyards"],
  [/\bgalangan kapal di Batam\b/gi, "shipyards in Batam"],
  [/\bgalangan kapal\b/gi, "shipyards"],
  [/\bdi Batam\b/gi, "in Batam"],
  [/\bkawasan industri\b/gi, "industrial zones"],
  [/\blepas pantai\b/gi, "offshore"],
  [/\bmesin utama kapal\b/gi, "marine main propulsion engine"],
  [/\bmesin diesel kapal\b/gi, "marine diesel engine"],
  [/\bmesin diesel\b/gi, "diesel engine"],
  [/\bmesin bantu\b/gi, "auxiliary engine"],
  [/\bsuku cadang asli\b/gi, "genuine spare parts"],
  [/\bsuku cadang\b/gi, "spare parts"],
  [/\buji load bank\b/gi, "load bank tested"],
  [/\btangki bahan bakar\b/gi, "fuel storage tank"],
  [/\btangki solar\b/gi, "diesel fuel tank"],
  [/\btangki kendaraan\b/gi, "vehicle and vessel tanks"],
  [/\bsaluran bahan bakar\b/gi, "fuel supply lines"],
  [/\bkonsumsi bahan bakar diesel\b/gi, "diesel fuel consumption"],
  [/\bkonsumsi bahan bakar\b/gi, "fuel consumption"],
  [/\blaju aliran bahan bakar\b/gi, "fuel flow rate"],
  [/\blaju aliran\b/gi, "flow rate"],
  [/\bpengukuran level dan volume\b/gi, "level and volume measurement"],
  [/\bpengukuran konsumsi\b/gi, "consumption measurement"],
  [/\bpengukuran laju aliran\b/gi, "flow rate measurement"],
  [/\bpengukuran level\b/gi, "level measurement"],
  [/\bpengukuran yang akurat\b/gi, "accurate measurement"],
  [/\bpengukuran\b/gi, "measurement"],
  [/\bset paking bawah\b/gi, "lower engine gasket set"],
  [/\bset lower gasket\b/gi, "lower gasket set"],
  [/\bpaking silinder\b/gi, "cylinder head gasket"],
  [/\bpaking mesin\b/gi, "engine gasket kit"],
  [/\bpaking\b/gi, "gasket"],
  [/\bseal oring injektor\b/gi, "injector seal O-ring"],
  [/\bkanopi kedap suara\b/gi, "acoustic silent canopy"],
  [/\bkanopi silent\b/gi, "silent canopy"],
  [/\btipe silent\b/gi, "silent type"],
  [/\btipe terbuka\b/gi, "open type"],
  [/\bemisi suara rendah\b/gi, "low sound emissions"],
  [/\btingkat kebisingan rendah\b/gi, "low noise level"],
  [/\bkualitas oem\b/gi, "OEM-grade quality"],
  [/\bkualitas terjamin\b/gi, "guaranteed high quality"],
  [/\bsiap kirim\b/gi, "ready for immediate dispatch"],
  [/\bsiap pakai\b/gi, "ready to deploy"],
  [/\bsiap uji\b/gi, "tested and ready for"],
  [/\bmobilisasi cepat\b/gi, "rapid mobilization"],
  [/\brekondisi mesin\b/gi, "engine reconditioning"],
  [/\boverhaul mesin\b/gi, "engine overhaul"],
  [/\bkontinuitas daya\b/gi, "power continuity"],
  [/\bdaya darurat\b/gi, "emergency backup power"],
  [/\bdaya listrik\b/gi, "electrical power"],
  [/\bdaya temporer\b/gi, "temporary power"],
  [/\bdaya kontinu\b/gi, "continuous prime power"],
  [/\bproyek konstruksi\b/gi, "construction projects"],
  [/\bkapal kerja\b/gi, "workboats"],
  [/\banjungan lepas pantai\b/gi, "offshore platforms"],
  [/\banjungan\b/gi, "platforms"],
  [/\bperairan Batam\b/gi, "Batam waters"],

  // Connecting words & Adjectives
  [/\bdengan efisiensi tinggi\b/gi, "with high operational efficiency"],
  [/\bdengan presisi tinggi\b/gi, "with high precision"],
  [/\bdengan emisi\b/gi, "with emissions"],
  [/\bdengan dukungan\b/gi, "with full support"],
  [/\bdengan\b/gi, "with"],
  [/\buntuk kebutuhan\b/gi, "for the operational requirements of"],
  [/\buntuk\b/gi, "for"],
  [/\bserta\b/gi, "and"],
  [/\bdan\b/gi, "and"],
  [/\byang akurat\b/gi, "accurate"],
  [/\byang digunakan di\b/gi, "utilized in"],
  [/\byang\b/gi, "that is"],
  [/\bdari gudang\b/gi, "from warehouse inventory"],
  [/\bdari\b/gi, "from"],
  [/\bsecara real-time\b/gi, "in real-time"],
  [/\bmudah dipasang\b/gi, "easy to install"],
  [/\btahan lama\b/gi, "durable and long-lasting"],
  [/\bhemat bahan bakar\b/gi, "fuel-efficient"],
];

/**
 * Automatically translates Indonesian text to English for product technical specs.
 * Safe, idempotent, fast, and 100% offline.
 */
export function translateMaritimeIdToEn(text: string): string {
  if (!text || !text.trim()) return "";
  const trimmed = text.trim();

  // 1. Direct exact match
  if (EXACT_DESCRIPTIONS[trimmed]) {
    return EXACT_DESCRIPTIONS[trimmed];
  }

  // 2. Pattern-based maritime translation
  let translated = trimmed;
  for (const [regex, replacement] of PHRASE_DICTIONARY) {
    translated = translated.replace(regex, replacement);
  }

  // Capitalize first letter
  translated = translated.charAt(0).toUpperCase() + translated.slice(1);

  // Clean double spaces and punctuation formatting
  translated = translated.replace(/\s{2,}/g, " ").replace(/\s+([.,;:])/g, "$1").trim();

  return translated;
}
