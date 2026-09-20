/**
 * MOSQUITO Main Application Controller
 * Handles Dual-Collection switcher, tactile filters, quick-views, search, and dynamic catalog rendering
 */

class AppManager {
  constructor() {
    let savedColl = 'men';
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        savedColl = localStorage.getItem('mosquito_collection') || 'men';
      }
    } catch (e) {
      savedColl = 'men';
    }
    this.currentCollection = (savedColl === 'women') ? 'women' : 'men';
    this.activeCategory = 'All';
    this.activeFit = 'All'; // 'All', 'Relaxed', 'Slim', 'Oversized'
    this.activeSize = 'All'; // 'All', 'XS', 'S', 'M', 'L', 'XL', 'XXL'
    this.inStockOnly = false;
    this.searchQuery = '';
    this.sortBy = 'featured'; // 'featured', 'price-low', 'price-high'

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        this.wishlist = JSON.parse(localStorage.getItem('mosquito_wishlist') || '[]');
      } else {
        this.wishlist = [];
      }
    } catch (e) {
      this.wishlist = [];
    }
    this.init();
  }

  init() {
    this.initCollectionSwitchers();
    this.initTactileFilters();
    this.initQuickViewModal();
    this.initSearch();
    this.updateWishlistCount();
    this.render();
  }

  toggleWishlist(productId, e) {
    if (e) e.stopPropagation();
    const index = this.wishlist.indexOf(productId);
    const product = PRODUCTS.find(p => p.id === productId);
    const prodName = product ? product.name : 'Item';

    if (index > -1) {
      this.wishlist.splice(index, 1);
      this.showToast(`Removed "${prodName}" from wishlist.`);
    } else {
      this.wishlist.push(productId);
      this.showToast(`Added "${prodName}" to wishlist.`);
    }

    localStorage.setItem('mosquito_wishlist', JSON.stringify(this.wishlist));
    this.updateWishlistCount();
    this.renderCatalog();
  }

  updateWishlistCount() {
    const badge = document.getElementById('wishlist-count-badge');
    if (badge) {
      badge.textContent = this.wishlist.length;
      badge.classList.toggle('hidden', this.wishlist.length === 0);
    }
  }

  shareProduct(productId, e) {
    if (e) e.stopPropagation();
    const product = PRODUCTS.find(p => p.id === productId);
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      this.showToast(`Link for "${product?.name || 'Garment'}" copied to clipboard!`);
    } else {
      this.showToast(`Sharing "${product?.name || 'Garment'}".`);
    }
  }

  setCollection(collection) {
    if (this.currentCollection === collection) return;
    this.currentCollection = collection;
    localStorage.setItem('mosquito_collection', collection);
    this.activeCategory = 'All';

    // Update middle hero segment buttons
    document.querySelectorAll('[data-collection-target]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-collection-target') === collection);
    });

    // Animate section transition
    const gridContainer = document.getElementById('products-grid-container');
    if (gridContainer) {
      gridContainer.classList.add('opacity-0', 'translate-y-4');
      setTimeout(() => {
        this.render();
        gridContainer.classList.remove('opacity-0', 'translate-y-4');
      }, 200);
    } else {
      this.render();
    }
  }

  initCollectionSwitchers() {
    // Collection switcher buttons (Middle of page & anywhere)
    const collectionBtns = document.querySelectorAll('[data-collection-target]');
    collectionBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = btn.getAttribute('data-collection-target');
        this.setCollection(target);
      });
    });
  }

  initTactileFilters() {
    // 2. In Stock Only Switch
    const stockSwitch = document.getElementById('stock-filter-switch');
    if (stockSwitch) {
      stockSwitch.addEventListener('change', (e) => {
        this.inStockOnly = e.target.checked;
        this.renderCatalog();
      });
    }

    // 3. Fit preference pills
    const fitBtns = document.querySelectorAll('[data-fit-filter]');
    fitBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeFit = btn.getAttribute('data-fit-filter');
        fitBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderCatalog();
      });
    });

    // 4. Size filter pills
    const sizeBtns = document.querySelectorAll('[data-size-filter]');
    sizeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeSize = btn.getAttribute('data-size-filter');
        sizeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderCatalog();
      });
    });

    // 5. Category filter pills
    const categoryContainer = document.getElementById('category-filter-pills');
    if (categoryContainer) {
      categoryContainer.addEventListener('click', (e) => {
        const pill = e.target.closest('[data-category]');
        if (pill) {
          const cat = pill.getAttribute('data-category');
          this.activeCategory = this.activeCategory === cat ? null : cat;
          this.renderCategoryPills();
          this.renderCatalog();
        }
      });
    }

    // 6. Sort selector
    const sortSelect = document.getElementById('catalog-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.sortBy = e.target.value;
        this.renderCatalog();
      });
    }
  }

  initSearch() {
    const searchInput = document.getElementById('global-search-input');
    const searchClear = document.getElementById('search-clear-btn');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        if (searchClear) {
          searchClear.classList.toggle('hidden', !this.searchQuery);
        }
        this.renderCatalog();
      });
    }

    if (searchClear && searchInput) {
      searchClear.addEventListener('click', () => {
        searchInput.value = '';
        this.searchQuery = '';
        searchClear.classList.add('hidden');
        this.renderCatalog();
      });
    }
  }

  initQuickViewModal() {
    const backdrop = document.getElementById('quick-view-backdrop');
    const closeBtn = document.getElementById('quick-view-close-btn');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeQuickView());
    }

    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) this.closeQuickView();
      });
    }
  }

  openQuickView(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    this.selectedQuickViewProduct = product;
    let selectedSize = product.sizes[0];
    let selectedColor = product.colors[0]?.name || 'Standard';

    const container = document.getElementById('quick-view-content');
    if (!container) return;

    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <!-- Image Gallery -->
        <div class="space-y-3">
          <div class="relative w-full aspect-[3/4] bg-neutral-100 overflow-hidden shadow-inner">
            <img id="qv-main-image" src="${product.images[0]}" alt="${product.name}" class="w-full h-full object-cover object-center transition-all duration-300"/>
            ${product.badge ? `<span class="absolute top-4 left-4 bg-black text-white px-3 py-1 text-[11px] font-mono tracking-wider font-bold uppercase">${product.badge}</span>` : ''}
          </div>
          ${product.images.length > 1 ? `
            <div class="flex gap-2">
              ${product.images.map((img, idx) => `
                <button onclick="document.getElementById('qv-main-image').src='${img}'" class="w-16 h-20 rounded-none overflow-hidden border border-neutral-200 hover:border-neutral-900 transition-all flex-shrink-0">
                  <img src="${img}" class="w-full h-full object-cover"/>
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <!-- Product Details -->
        <div class="flex flex-col justify-between h-full">
          <div>
            <div class="flex items-center justify-between text-xs text-neutral-400 uppercase tracking-widest font-mono">
              <span>${product.collection} / ${product.category}</span>
              <span class="${product.inStock ? 'text-emerald-700' : 'text-rose-600'} font-medium">
                ${product.inStock ? '● In Stock • Dispatch in 24h' : '○ Currently Backordered'}
              </span>
            </div>

            <h2 class="text-2xl sm:text-3xl font-sans font-bold uppercase text-neutral-900 mt-2 leading-tight tracking-tight">${product.name}</h2>
            <div class="text-xl font-mono font-semibold text-neutral-900 mt-2">
              ${window.cartManager.formatPrice(product.price)}
            </div>

            <p class="text-neutral-600 text-sm mt-4 leading-relaxed font-sans">${product.description}</p>

            <!-- Color Swatches -->
            <div class="mt-6">
              <label class="block text-xs font-mono text-neutral-500 uppercase tracking-wider mb-2">Color: <span id="qv-color-name" class="text-neutral-900 font-sans font-medium">${selectedColor}</span></label>
              <div class="flex items-center gap-3">
                ${product.colors.map((c, i) => `
                  <button class="color-dot ${i === 0 ? 'active' : ''}" style="background-color: ${c.hex};" title="${c.name}" onclick="appManager.selectQuickViewColor('${c.name}', this)"></button>
                `).join('')}
              </div>
            </div>

            <!-- Fit & Size Selector -->
            <div class="mt-6">
              <div class="flex justify-between items-center mb-2">
                <label class="text-xs font-mono text-neutral-500 uppercase tracking-wider">Select Size (${product.fit} Cut)</label>
                <button class="text-xs text-neutral-400 hover:text-neutral-900 underline font-mono">Size Guide</button>
              </div>
              <div class="flex flex-wrap gap-2" id="qv-size-group">
                ${['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(sz => {
                  const available = product.sizes.includes(sz);
                  return `
                    <button class="size-chip ${available ? (sz === selectedSize ? 'active' : '') : 'disabled'}" ${available ? `onclick="appManager.selectQuickViewSize('${sz}', this)"` : 'disabled'}>
                      ${sz}
                    </button>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Material & Craftsmanship Details -->
            <div class="mt-6 border-t border-neutral-200 pt-4 space-y-2 text-xs">
              <div class="flex justify-between text-neutral-700">
                <span class="font-mono text-neutral-400 uppercase">Composition</span>
                <span class="font-medium text-right">${product.composition}</span>
              </div>
              <div class="flex justify-between text-neutral-700">
                <span class="font-mono text-neutral-400 uppercase">Garment Care</span>
                <span class="font-medium text-right">${product.care}</span>
              </div>
              <div class="flex justify-between text-neutral-700">
                <span class="font-mono text-neutral-400 uppercase">Model Fit</span>
                <span class="font-medium text-right">${product.modelInfo}</span>
              </div>
            </div>
          </div>

          <!-- Add to Bag Action -->
          <div class="mt-8 pt-4 border-t border-neutral-100">
            <button id="qv-add-to-bag-btn" onclick="appManager.addQuickViewProductToBag()" ${!product.inStock ? 'disabled' : ''} class="w-full py-4 bg-neutral-950 hover:bg-black text-white text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2.5 rounded-xl shadow-lg hover:shadow-xl active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
              <span>${product.inStock ? 'Add to Bag' : 'Sold Out'}</span>
            </button>
          </div>
        </div>
      </div>
    `;

    this.selectedSize = selectedSize;
    this.selectedColor = selectedColor;

    const modal = document.getElementById('quick-view-backdrop');
    if (modal) {
      modal.style.display = 'flex';
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  selectQuickViewColor(colorName, btnElem) {
    this.selectedColor = colorName;
    const nameEl = document.getElementById('qv-color-name');
    if (nameEl) nameEl.textContent = colorName;

    document.querySelectorAll('#quick-view-content .color-dot').forEach(d => d.classList.remove('active'));
    if (btnElem) btnElem.classList.add('active');
  }

  selectQuickViewSize(size, btnElem) {
    this.selectedSize = size;
    document.querySelectorAll('#qv-size-group .size-chip').forEach(c => c.classList.remove('active'));
    if (btnElem) btnElem.classList.add('active');
  }

  addQuickViewProductToBag() {
    if (!this.selectedQuickViewProduct) return;
    window.cartManager.addItem(
      this.selectedQuickViewProduct.id,
      this.selectedSize,
      this.selectedColor,
      this.selectedQuickViewProduct.fit
    );
    this.closeQuickView();
  }

  closeQuickView() {
    const modal = document.getElementById('quick-view-backdrop');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
    this.selectedQuickViewProduct = null;
  }

  showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></div>
      <div class="flex-1 font-sans font-medium text-xs">${message}</div>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  renderLookbook() {
    const lookbookData = LOOKBOOK[this.currentCollection];
    if (!lookbookData) return;

    const titleEl = document.getElementById('lookbook-hero-title');
    const subEl = document.getElementById('lookbook-hero-subtitle');
    const tagEl = document.getElementById('lookbook-hero-tag');
    const quoteEl = document.getElementById('lookbook-editorial-quote');
    const curatorEl = document.getElementById('lookbook-curator');
    const bgEl = document.getElementById('lookbook-hero-bg');

    if (titleEl) titleEl.textContent = lookbookData.heroTitle;
    if (subEl) subEl.textContent = lookbookData.heroSubtitle;
    if (tagEl) tagEl.textContent = lookbookData.heroTag;
    if (quoteEl) quoteEl.textContent = lookbookData.editorialQuote;
    if (curatorEl) curatorEl.textContent = lookbookData.curator;
    if (bgEl) {
      bgEl.style.backgroundImage = `url('${lookbookData.heroImage}')`;
    }
  }

  renderCatalog() {
    const grid = document.getElementById('products-grid');
    const countEl = document.getElementById('products-count-badge');
    if (!grid) return;

    // Filter products
    let filtered = PRODUCTS.filter(p => p.collection === this.currentCollection);

    if (this.activeCategory && this.activeCategory !== 'All') {
      filtered = filtered.filter(p => p.category === this.activeCategory);
    }

    if (this.activeFit !== 'All') {
      filtered = filtered.filter(p => p.fit === this.activeFit);
    }

    if (this.activeSize !== 'All') {
      filtered = filtered.filter(p => p.sizes.includes(this.activeSize));
    }

    if (this.inStockOnly) {
      filtered = filtered.filter(p => p.inStock);
    }

    if (this.searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(this.searchQuery) ||
        p.category.toLowerCase().includes(this.searchQuery) ||
        p.description.toLowerCase().includes(this.searchQuery)
      );
    }

    // Sort
    if (this.sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    }

    if (countEl) {
      countEl.textContent = `${filtered.length} ${filtered.length === 1 ? 'Garment' : 'Garments'}`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-20 text-center">
          <p class="text-neutral-400 font-mono text-sm uppercase tracking-widest">No garments match your active filters</p>
          <button onclick="appManager.resetFilters()" class="mt-4 px-6 py-2.5 bg-black text-white text-xs uppercase tracking-widest font-bold hover:bg-neutral-800 transition-all">
            Reset All Filters
          </button>
        </div>
      `;
      return;
    }

    // Render Product Cards matching Reference Image 2 exactly
    grid.innerHTML = filtered.map((product) => {
      const isWishlisted = this.wishlist.includes(product.id);
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
              
              <!-- Wishlist Heart Circle -->
              <button onclick="appManager.toggleWishlist('${product.id}', event)" class="w-8 h-8 rounded-full bg-white text-neutral-900 flex items-center justify-center shadow-md hover:scale-110 transition-transform ${isWishlisted ? 'text-red-500' : 'text-neutral-700'}" title="Add to Wishlist">
                ${isWishlisted ? `
                  <svg class="w-4 h-4 fill-red-500 stroke-red-500" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                ` : `
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                `}
              </button>

              <!-- Share Circle Button -->
              <button onclick="appManager.shareProduct('${product.id}', event)" class="w-8 h-8 rounded-full bg-white text-neutral-700 flex items-center justify-center shadow-md hover:scale-110 transition-transform" title="Share Piece">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
              </button>

            </div>

          </div>

          <!-- Product Typography matching Image 2 Layout -->
          <div class="pt-3.5 pb-1 flex flex-col justify-between">
            <div>
              <!-- Bold Uppercase Product Name -->
              <h3 onclick="appManager.openQuickView('${product.id}')" class="font-sans font-black text-sm text-neutral-900 tracking-tight uppercase cursor-pointer hover:text-neutral-600 transition-colors">
                ${product.name}
              </h3>

              <!-- Price Format -->
              <p class="text-xs font-medium text-neutral-700 mt-1 font-mono">
                ${window.cartManager.formatPrice(product.price)}
              </p>

              <!-- Category Subtitle in Muted Uppercase -->
              <p class="text-[11px] font-sans font-medium text-neutral-400 uppercase tracking-wider mt-1.5">
                ${product.category}
              </p>
            </div>
          </div>

        </div>
      `;
    }).join('');
  }

  renderCategoryPills() {
    const container = document.getElementById('category-filter-pills');
    if (!container) return;

    const categories = this.currentCollection === 'women' ? WOMEN_CATEGORIES : MEN_CATEGORIES;

    container.innerHTML = `
      <div class="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none flex-wrap justify-center sm:justify-start">
        ${categories.map(cat => {
          const isActive = this.activeCategory === cat;
          return `
            <button data-category="${cat}" class="category-pill-btn ${isActive ? 'active' : ''}">
              ${cat}
            </button>
          `;
        }).join('')}
      </div>
    `;
  }

  resetFilters() {
    this.activeCategory = null;
    this.activeFit = 'All';
    this.activeSize = 'All';
    this.inStockOnly = false;
    this.searchQuery = '';
    this.sortBy = 'featured';

    this.renderCategoryPills();
    this.renderCatalog();
  }

  filterCategory(cat) {
    this.activeCategory = (cat === 'All' ? null : cat);
    this.renderCategoryPills();
    this.renderCatalog();
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  }

  filterTopwear() {
    this.activeCategory = this.currentCollection === 'men' ? 'Shirts' : 'T-Shirts';
    this.renderCategoryPills();
    this.renderCatalog();
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  }

  filterBottomwear() {
    this.activeCategory = 'Jeans';
    this.renderCategoryPills();
    this.renderCatalog();
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  }

  render() {
    // Update global collection buttons active states
    const collectionBtns = document.querySelectorAll('[data-collection-target]');
    collectionBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-collection-target') === this.currentCollection);
    });

    this.renderCategoryPills();
    this.renderLookbook();
    this.renderCatalog();
  }
}

// Global instance & Safe Two-Phase Mount
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (!window.appManager) window.appManager = new AppManager();
    });
  } else {
    window.appManager = new AppManager();
  }
}


