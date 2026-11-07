const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../src');
function walk(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) results = results.concat(walk(full));
    else if (full.endsWith('.tsx')) results.push(full);
  });
  return results;
}

const files = walk(srcDir);
const headingReport = [];

files.forEach(f => {
  const code = fs.readFileSync(f, 'utf8');
  const headings = [];
  const regex = /<h([1-6])\b[^>]*>(.*?)<\/h\1>/gs;
  let match;
  while ((match = regex.exec(code)) !== null) {
    headings.push({ level: parseInt(match[1]), text: match[2].replace(/<[^>]+>/g, '').trim().slice(0, 40) });
  }
  if (headings.length > 0) {
    const rel = path.relative(srcDir, f);
    headingReport.push({ file: rel, headings });
  }
});

console.log(JSON.stringify(headingReport, null, 2));
