import json

path = r"R:\Gemini-Workspace\Pelican-web\pelican-app\src\data\posts.json"
with open(path, "r", encoding="utf-8") as f:
    posts = json.load(f)

for p in posts:
    if p.get("slug") == "generator-synchronize-service":
        p["content_id"] = """<p><strong>Presisi Fasa. Tenaga Listrik Stabil. Operasi Paralel yang Mulus.</strong></p>
<p>Pada jaringan listrik kapal dan fasilitas industri, kebutuhan daya listrik mengalami fluktuasi secara konstan. Ketika beban peralatan bertambah, beberapa generator harus beroperasi secara paralel guna memastikan pasokan daya tidak terputus.</p>
<p>Sinkronisasi generator membutuhkan penyelarasan empat parameter listrik utama sebelum menutup pemutus arus (breaker bus-tie):</p>

<ul>
  <li>Tegangan listrik (Voltage magnitude)</li>
  <li>Frekuensi (Frequency)</li>
  <li>Urutan fasa (Phase sequence)</li>
  <li>Sudut fasa (Phase angle)</li>
</ul>

<p>Kegagalan dalam menyelaraskan parameter ini dapat memicu lonjakan arus transien yang berbahaya, guncangan mekanis pada poros, kerusakan breaker, trip akibat reverse power, hingga pemadaman total (blackout).</p>

<hr />

<h2>Mengapa Sinkronisasi Presisi Sangat Krusial</h2>
<h3>Pembagian Beban Proporsional (Load Sharing)</h3>
<p>Sistem loop load-sharing otomatis yang terkalibrasi memungkinkan generator membagi beban aktif (kW) dan reaktif (kVAR) secara proporsional sesuai kapasitas nominal masing-masing unit, mencegah beban lebih pada genset individual.</p>

<h3>Redundansi Daya Listrik Tanpa Terputus</h3>
<p>Operasi paralel memberikan keandalan operasional, memastikan sistem vital kapal (seperti steering gear, navigasi maritim, dan pompa bilga) tetap beroperasi penuh saat perpindahan beban generator.</p>

<h3>Optimalisasi Efisiensi Bahan Bakar</h3>
<p>Sistem Power Management System (PMS) secara otomatis menghidupkan atau mematikan generator bantu sesuai kebutuhan konsumsi daya riil, menjaga mesin diesel beroperasi pada kurva konsumsi bahan bakar paling efisien.</p>

<hr />

<h2>Pengalaman Rekayasa Teknik PT Pelican Mitra Sejati</h2>
<p>PT Pelican Mitra Sejati memiliki kapabilitas rekayasa teruji dalam sinkronisasi generator untuk kapal niaga, tongkang, dan anjungan lepas pantai. Tim spesialis elektrik kami menangani penalaan parameter, kalibrasi modul auto-synchronizer, pengujian relai reverse power, serta penyeimbangan speed droop pada governor.</p>

<div class="my-6">
  <img src="/uploads/2026/03/Screenshot-2026-03-04-110237-298x300.png" alt="Pengaturan sinkronisasi generator oleh tim teknisi Pelican" class="w-full max-w-sm mx-auto rounded-lg border border-slate-200" />
  <p class="text-xs text-slate-500 text-center italic mt-2">Setting sinkronisasi dan pengujian proteksi generator oleh tim teknisi Pelican</p>
</div>"""
        print("Updated content_id successfully!")
        break

with open(path, "w", encoding="utf-8") as f:
    json.dump(posts, f, indent=2, ensure_ascii=False)
