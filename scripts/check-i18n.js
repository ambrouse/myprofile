const fs = require('fs');
const path = require('path');

const root = process.cwd();
const viPath = path.join(root, 'i18n', 'vi.json');
const enPath = path.join(root, 'i18n', 'en.json');
const htmlPath = path.join(root, 'index.html');

const readJson = (filePath) => {
  const raw = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  return JSON.parse(raw);
};

const vi = readJson(viPath);
const en = readJson(enPath);
const html = fs.readFileSync(htmlPath, 'utf8');

const keyPattern = /data-i18n="([^"]+)"/g;
const keysInHtml = new Set();
let match;
while ((match = keyPattern.exec(html)) !== null) {
  keysInHtml.add(match[1]);
}

const missingInVi = [];
const missingInEn = [];
for (const key of keysInHtml) {
  if (!(key in vi)) missingInVi.push(key);
  if (!(key in en)) missingInEn.push(key);
}

const extraInVi = Object.keys(vi).filter((k) => !keysInHtml.has(k));
const extraInEn = Object.keys(en).filter((k) => !keysInHtml.has(k));

let failed = false;

if (missingInVi.length || missingInEn.length) {
  failed = true;
  console.error('Missing keys detected:');
  if (missingInVi.length) console.error(' - vi missing:', missingInVi.join(', '));
  if (missingInEn.length) console.error(' - en missing:', missingInEn.join(', '));
}

console.log(`i18n coverage: ${keysInHtml.size} keys in HTML`);
console.log(`vi keys: ${Object.keys(vi).length}, en keys: ${Object.keys(en).length}`);
console.log(`extra vi keys: ${extraInVi.length}, extra en keys: ${extraInEn.length}`);

if (failed) process.exit(1);
