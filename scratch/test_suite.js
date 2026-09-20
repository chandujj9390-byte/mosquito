const http = require('http');

const urls = [
  '/',
  '/index.html',
  '/checkout.html',
  '/payment.html',
  '/order-success.html',
  '/styles/main.css',
  '/js/app.js',
  '/js/products.js',
  '/js/cart.js',
  '/js/checkout.js',
  '/js/slider.js',
  '/js/info-modal.js',
  '/js/lenis-scroll.js',
  '/assets/logo.svg',
  '/assets/posters/1.png',
  '/assets/posters/2.png',
  '/assets/posters/3.png',
  '/assets/posters/4.png',
  '/assets/posters/5.png',
  '/assets/men/Embroided Shirts.jpg',
  '/assets/men/Embroided Shirts.avif',
  '/assets/men/shirts.png',
  '/assets/men/shirts (2).png',
  '/assets/men/T-shirts.jpg',
  '/assets/men/Hoodies.jpg',
  '/assets/men/Formal trousers.avif',
  '/assets/men/jeans pants.avif',
  '/assets/women/Crop Top.avif',
  '/assets/women/t shirts.avif',
  '/assets/women/Short Anarkali.avif',
  '/assets/women/Jeans.avif',
  '/assets/women/Formal Pants.avif',
  '/assets/women/Bodycon.avif',
  '/assets/women/Checked Shirt.avif',
  '/assets/women/Printed Cotton Kurti.avif',
  '/assets/women/Women formal Shirt.avif'
];

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
  console.log('Testing endpoints on http://localhost:3000...\n');
  let passed = 0;
  let failed = 0;

  for (const u of urls) {
    const res = await checkUrl(u);
    if (res.ok) {
      passed++;
      console.log(`[PASS] 200 OK - ${res.path}`);
    } else {
      failed++;
      console.log(`[FAIL] ${res.status} - ${res.path}`);
    }
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed out of ${urls.length} total.`);
  if (failed > 0) process.exit(1);
}

run();
