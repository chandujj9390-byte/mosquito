const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const productsFile = path.join(rootDir, 'js', 'products.js');
const indexFile = path.join(rootDir, 'index.html');

let prodCode = fs.readFileSync(productsFile, 'utf8');
eval(prodCode.replace('const PRODUCTS =', 'global.PRODUCTS ='));

let menProducts = global.PRODUCTS.filter(p => p.collection === 'men');

function renderCard(product) {
  return `
        <div class="product-card group flex flex-col justify-between bg-white text-left">
          
          <!-- Image Container with Square Sharp Look & Hover Quick View -->
          <div class="relative w-full aspect-[4/5] overflow-hidden bg-neutral-100 cursor-pointer" onclick="appManager.openQuickView('${product.id}')">
            <img src="${product.images[0]}" alt="${product.name}" class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 primary-img" loading="lazy"/>

            <!-- Top Left Black Solid Rectangle Badge (MSQ PICK / VD PICK style) -->
            ${product.badge ? `
              <div class="absolute top-3 left-3 z-10">
                <span class="bg-black text-white px-2.5 py-1 text-[11px] font-sans font-black tracking-wider uppercase inline-block shadow-sm">
                  ${product.badge}
                </span>
              </div>
            ` : ''}

            <!-- Top Right Floating Action Circles (Wishlist Heart & Share) -->
            <div class="absolute top-3 right-3 flex flex-col gap-2 z-10" onclick="event.stopPropagation()">
              <button onclick="appManager.toggleWishlist('${product.id}', event)" class="action-circle-btn" title="Save to Wishlist" aria-label="Save to Wishlist">
                <svg class="w-3.5 h-3.5 text-neutral-800" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </button>
              <button onclick="appManager.shareProduct('${product.id}', event)" class="action-circle-btn" title="Share Garment" aria-label="Share Garment">
                <svg class="w-3.5 h-3.5 text-neutral-800" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Product Details (Typography Matching Reference Image 2) -->
          <div class="pt-3.5 pb-2 flex flex-col justify-between flex-1">
            <div>
              <!-- Bold Uppercase Title -->
              <h3 class="text-[13px] sm:text-[14px] font-sans font-black tracking-tight text-neutral-900 uppercase line-clamp-1 hover:text-neutral-600 transition-colors cursor-pointer" onclick="appManager.openQuickView('${product.id}')">
                ${product.name}
              </h3>
              
              <!-- Category / Sub-Category in Subtle Gray -->
              <div class="text-[11px] font-sans text-neutral-500 uppercase tracking-wide mt-0.5">
                ${product.category}
              </div>
            </div>

            <!-- Price with Rupee Symbol -->
            <div class="mt-2 text-[14px] sm:text-[15px] font-sans font-bold text-neutral-900 tracking-tight">
              ₹${product.price.toLocaleString('en-IN')}
            </div>
          </div>

        </div>
  `;
}

let cardsHtml = menProducts.map(renderCard).join('\n');

let indexHtml = fs.readFileSync(indexFile, 'utf8');

// Match everything between <div id="products-grid" ...> and the corresponding closing </div> before </main>
const startTag = '<div id="products-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">';
const startIndex = indexHtml.indexOf(startTag);

if (startIndex !== -1) {
  const containerClose = indexHtml.indexOf('</div>\n    </div>\n  </main>', startIndex);
  if (containerClose !== -1) {
    const before = indexHtml.substring(0, startIndex + startTag.length);
    const after = indexHtml.substring(containerClose);
    indexHtml = before + '\n' + cardsHtml + '\n      ' + after;
    fs.writeFileSync(indexFile, indexHtml, 'utf8');
    console.log('Successfully updated index.html with clean cards (removed Quick Add and secondary hover images).');
  } else {
    console.error('Could not find container close marker');
  }
} else {
  console.error('Could not find startTag in index.html');
}
