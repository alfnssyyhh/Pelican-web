const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) results = results.concat(walk(file));
    else if (file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
  });
  return results;
}

const srcDir = path.resolve(__dirname, '../src');
const files = walk(srcDir);

const findings = {
  missingAlts: [],
  nonDescriptiveLinks: [],
  externalLinksWithoutRel: [],
  metaAudits: [],
  largeFiles: [],
};

// 1. Check images & links
files.forEach(f => {
  const code = fs.readFileSync(f, 'utf8');
  const relPath = path.relative(srcDir, f);

  // Check Images
  const imgRegex = /<(Image|img)\b([^>]*?)(\/?>)/g;
  let match;
  while ((match = imgRegex.exec(code)) !== null) {
    const props = match[2];
    if (!props.includes('alt=')) {
      findings.missingAlts.push({ file: relPath, snippet: match[0].replace(/\s+/g, ' ').slice(0, 100) });
    }
  }

  // Check Links for generic text like "baca selengkapnya", "read more", "learn more", "click here"
  const linkRegex = /<Link\b([^>]*?)>(.*?)<\/Link>/gs;
  while ((match = linkRegex.exec(code)) !== null) {
    const linkProps = match[1];
    const linkText = match[2].replace(/<[^>]+>/g, '').trim();
    const isGeneric = /^(read more|baca selengkapnya|learn more|click here|klik di sini|view details|lihat rincian)$/i.test(linkText);
    const hasAriaLabel = linkProps.includes('aria-label');
    if (isGeneric && !hasAriaLabel) {
      findings.nonDescriptiveLinks.push({ file: relPath, text: linkText, href: linkProps.slice(0, 60) });
    }
  }

  // Check external links for rel="noopener noreferrer"
  const aRegex = /<a\b([^>]*?)>/g;
  while ((match = aRegex.exec(code)) !== null) {
    const aProps = match[1];
    if (aProps.includes('href="http') && !aProps.includes('pelican-ms.com')) {
      if (!aProps.includes('rel=') || (!aProps.includes('noopener') && !aProps.includes('noreferrer'))) {
        findings.externalLinksWithoutRel.push({ file: relPath, snippet: aProps.slice(0, 80) });
      }
    }
  }
});

// 2. Check public directory for heavy files (> 500KB)
const publicDir = path.resolve(__dirname, '../public');
function walkPublic(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walkPublic(full);
    else if (stat.size > 500 * 1024) {
      findings.largeFiles.push({ file: path.relative(publicDir, full), sizeKb: Math.round(stat.size / 1024) });
    }
  });
}
walkPublic(publicDir);

console.log(JSON.stringify(findings, null, 2));
