const fs = require('fs');
const path = require('path');

const appDir = path.resolve(__dirname, '../src/app');

function inspectMetadata(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const titleMatch = content.match(/title:\s*["'`](.*?)["'`]/);
  const descMatch = content.match(/description:\s*["'`](.*?)["'`]/);
  const canMatch = content.match(/canonical:\s*["'`](.*?)["'`]/);

  return {
    file: path.relative(appDir, filePath),
    title: titleMatch ? titleMatch[1] : null,
    titleLen: titleMatch ? titleMatch[1].length : 0,
    desc: descMatch ? descMatch[1] : null,
    descLen: descMatch ? descMatch[1].length : 0,
    hasCanonical: !!canMatch || content.includes('canonical: `https://pelican-ms.com'),
  };
}

const pageFiles = [
  path.join(appDir, 'page.tsx'),
  path.join(appDir, 'service/page.tsx'),
  path.join(appDir, 'rent/page.tsx'),
  path.join(appDir, 'product/page.tsx'),
  path.join(appDir, 'product/[slug]/page.tsx'),
  path.join(appDir, 'artikel/page.tsx'),
  path.join(appDir, '[slug]/page.tsx'),
  path.join(appDir, 'works/page.tsx'),
  path.join(appDir, 'contact/page.tsx'),
];

const results = pageFiles.map(inspectMetadata);
console.log(JSON.stringify(results, null, 2));
