const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.resolve(__dirname, '../public');

async function optimizeImages() {
  console.log('Optimizing heavy public assets...');

  // 1. Optimize logo.png
  const logoPath = path.join(publicDir, 'logo.png');
  if (fs.existsSync(logoPath)) {
    const meta = await sharp(logoPath).metadata();
    console.log(`Original logo.png: ${meta.width}x${meta.height}, ${(fs.statSync(logoPath).size / 1024).toFixed(1)} KB`);
    const optimizedBuffer = await sharp(logoPath)
      .resize({ width: 800, withoutEnlargement: true })
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toBuffer();
    fs.writeFileSync(logoPath, optimizedBuffer);
    console.log(`Optimized logo.png: ${(optimizedBuffer.length / 1024).toFixed(1)} KB`);
  }

  // 2. Heavy images in uploads
  const heavyFiles = [
    'uploads/2026/03/VMS.png',
    'uploads/2026/02/DSC01588-1.jpg',
    'uploads/2026/03/DSC01555.jpg',
    'uploads/2026/01/DSC01267-1.jpg',
    'uploads/2026/03/DSC01543.jpg',
    'uploads/2026/03/DSC01493.jpg',
    'uploads/2026/03/3.png',
    'uploads/2026/03/4.png',
    'uploads/2026/03/2.png',
    'uploads/2026/03/odme.png',
    'uploads/2026/01/DSC01539.jpg',
  ];

  for (const rel of heavyFiles) {
    const full = path.join(publicDir, rel);
    if (!fs.existsSync(full)) continue;

    const originalSize = fs.statSync(full).size / 1024;
    const isPng = full.toLowerCase().endsWith('.png');

    try {
      let pipeline = sharp(full).resize({ width: 1400, withoutEnlargement: true });
      let optimizedBuffer;
      if (isPng) {
        optimizedBuffer = await pipeline.png({ compressionLevel: 9, quality: 85 }).toBuffer();
      } else {
        optimizedBuffer = await pipeline.jpeg({ quality: 82, mozjpeg: true }).toBuffer();
      }

      // If optimized is smaller, write back
      if (optimizedBuffer.length < fs.statSync(full).size) {
        fs.writeFileSync(full, optimizedBuffer);
        const newSize = optimizedBuffer.length / 1024;
        console.log(`Optimized ${rel}: ${originalSize.toFixed(1)} KB -> ${newSize.toFixed(1)} KB (${((1 - newSize/originalSize)*100).toFixed(0)}% reduction)`);
      }
    } catch (err) {
      console.warn(`Could not optimize ${rel}:`, err.message);
    }
  }

  console.log('Image optimization finished successfully.');
}

optimizeImages().catch(console.error);
