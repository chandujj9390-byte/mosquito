const fs = require('fs');
const path = require('path');
const http = require('http');

const rootDir = path.resolve(__dirname, '..');
const prodCode = fs.readFileSync(path.join(rootDir, 'js', 'products.js'), 'utf8');
eval(prodCode.replace('const PRODUCTS =', 'global.PRODUCTS ='));

async function checkUrl(urlPath) {
  return new Promise((resolve) => {
    const encoded = encodeURI(urlPath);
    http.get(`http://localhost:3000${encoded}`, (res) => {
      resolve({ path: urlPath, status: res.statusCode, ok: res.statusCode === 200 });
    }).on('error', (err) => {
      resolve({ path: urlPath, status: err.message, ok: false });
    });
  });
}

async function run() {
  console.log(`Checking ${global.PRODUCTS.length} products images in products.js...`);
  let missing = [];
  let allImages = new Set();

  for (const p of global.PRODUCTS) {
    for (const img of p.images) {
      allImages.add(img);
    }
  }

  console.log(`Total unique image paths: ${allImages.size}`);

  for (const img of allImages) {
    const res = await checkUrl(img);
    if (!res.ok) {
      missing.push({ img, status: res.status });
      console.log(`[MISSING] (${res.status}) ${img}`);
    } else {
      console.log(`[OK] ${img}`);
    }
  }

  console.log(`\nSummary: ${allImages.size - missing.length} valid, ${missing.length} missing.`);
}

run();
