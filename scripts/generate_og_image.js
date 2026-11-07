const sharp = require('sharp');
const path = require('path');

async function createOgImage() {
  const width = 1200;
  const height = 630;

  const svgText = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#09090b" />
      <rect x="0" y="0" width="14" height="${height}" fill="#dc2626" />
      
      <!-- Top Tag Badge -->
      <rect x="80" y="75" width="310" height="38" rx="6" fill="#18181b" stroke="#27272a" stroke-width="1" />
      <text x="96" y="100" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" fill="#a1a1aa" letter-spacing="1">BATAM, RIAU ISLANDS · INDONESIA</text>

      <!-- Main Headline -->
      <text x="80" y="220" font-family="system-ui, -apple-system, sans-serif" font-size="46" font-weight="700" fill="#ffffff" letter-spacing="-0.5">PT PELICAN MITRA SEJATI</text>
      
      <!-- Subheadline -->
      <text x="80" y="275" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="400" fill="#a1a1aa">Marine, Oil &amp; Gas, and Industrial Engineering Solutions</text>

      <!-- Key Services Solid Boxes -->
      <g transform="translate(80, 340)">
        <!-- Box 1 -->
        <rect x="0" y="0" width="320" height="96" rx="8" fill="#18181b" stroke="#27272a" stroke-width="1" />
        <text x="20" y="38" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#ef4444">RENTAL ARMADA GENSET</text>
        <text x="20" y="66" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="400" fill="#f4f4f5">25 kVA hingga 1250 kVA</text>

        <!-- Box 2 -->
        <rect x="340" y="0" width="320" height="96" rx="8" fill="#18181b" stroke="#27272a" stroke-width="1" />
        <text x="360" y="38" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#ef4444">KALIBRASI TERSERTIFIKASI</text>
        <text x="360" y="66" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="400" fill="#f4f4f5">MARPOL ODME &amp; OWS 15 ppm</text>

        <!-- Box 3 -->
        <rect x="680" y="0" width="340" height="96" rx="8" fill="#18181b" stroke="#27272a" stroke-width="1" />
        <text x="700" y="38" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#ef4444">OTOMASI &amp; MESIN KAPAL</text>
        <text x="700" y="66" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="400" fill="#f4f4f5">Diesel Overhaul &amp; Suku Cadang</text>
      </g>

      <!-- Bottom Domain & Info -->
      <line x1="80" y1="490" x2="1100" y2="490" stroke="#27272a" stroke-width="1" />
      <text x="80" y="535" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="500" fill="#ef4444">pelican-ms.com</text>
      <text x="210" y="535" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="400" fill="#71717a">· Layanan Cepat Tanggap Galangan Kapal &amp; Industri Batam</text>
    </svg>
  `;

  const outputPath = path.resolve(__dirname, '../public/og-image.png');
  await sharp(Buffer.from(svgText))
    .png()
    .toFile(outputPath);

  console.log('og-image.png created at:', outputPath);
}

createOgImage().catch(err => {
  console.error(err);
  process.exit(1);
});
