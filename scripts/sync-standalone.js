const fs = require('fs');
const path = require('path');

function copyDir(src, dest, overwrite = true) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, overwrite);
    } else {
      if (!overwrite && fs.existsSync(destPath)) {
        continue;
      }
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const rootDir = path.resolve(__dirname, '..');
const staticSrc = path.join(rootDir, '.next', 'static');
const staticDest = path.join(rootDir, '.next', 'standalone', '.next', 'static');
const publicSrc = path.join(rootDir, 'public');
const publicDest = path.join(rootDir, '.next', 'standalone', 'public');
const dataSrc = path.join(rootDir, 'src', 'data');
const dataDest = path.join(rootDir, '.next', 'standalone', 'src', 'data');

// Preserve any runtime uploads from standalone back to root public
const standaloneUploads = path.join(rootDir, '.next', 'standalone', 'public', 'uploads');
const rootUploads = path.join(rootDir, 'public', 'uploads');
if (fs.existsSync(standaloneUploads)) {
  copyDir(standaloneUploads, rootUploads, false);
}

console.log('[sync-standalone] Syncing static, public, and data assets to standalone bundle...');
copyDir(staticSrc, staticDest, true);
copyDir(publicSrc, publicDest, true);
copyDir(dataSrc, dataDest, true);
console.log('[sync-standalone] Assets synced successfully.');
