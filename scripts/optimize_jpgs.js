const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.resolve(__dirname, '../public');

async function optimizeJpgs() {
  const jpgFiles = [
    'uploads/2026/02/DSC01588-1.jpg',
    'uploads/2026/03/DSC01555.jpg',
    'uploads/2026/01/DSC01267-1.jpg',
    'uploads/2026/03/DSC01543.jpg',
    'uploads/2026/03/DSC01493.jpg',
    'uploads/2026/01/DSC01539.jpg',
  ];

  for (const rel of jpgFiles) {
    const full = path.join(publicDir, rel);
    if (!fs.existsSync(full)) continue;

    try {
      const inputBuffer = fs.readFileSync(full);
      const originalSize = inputBuffer.length / 1024;
      const optimizedBuffer = await sharp(inputBuffer)
        .resize({ width: 1400, withoutEnlargement: true })
        .jpeg({ quality: 82, mozjpeg: true })
        .toBuffer();

      if (optimizedBuffer.length < inputBuffer.length) {
        fs.writeFileSync(full, optimizedBuffer);
        const newSize = optimizedBuffer.length / 1024;
        console.log(`Optimized ${rel}: ${originalSize.toFixed(1)} KB -> ${newSize.toFixed(1)} KB (${((1 - newSize/originalSize)*100).toFixed(0)}% reduction)`);
      }
    } catch (err) {
      console.warn(`Could not optimize ${rel}:`, err.message);
    }
  }
}

optimizeJpgs().catch(console.error);
