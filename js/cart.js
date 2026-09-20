/**
 * MOSQUITO Shopping Bag & Cart Engine
 * Manages slide-over drawer, promo codes, currency calculation, and storage
 */

class CartManager {
  constructor() {
    this.items = this.loadCart();
    this.currentCurrency = 'INR';
    localStorage.setItem('mosquito_currency', 'INR');
    this.appliedPromo = null; // { code: 'MOSQUITO10', discountPercent: 10 }
    this.shippingThresholdINR = 10000; // Free shipping threshold in INR
    this.drawerOpen = false;

    this.PROMO_CODES = {
      'MOSQUITO10': { discountPercent: 10, label: '10% Welcome Editorial Discount' },
      'EDITORIAL': { discountPercent: 15, label: '15% Runway Privilege' },
      'VIP20': { discountPercent: 20, label: '20% VIP Member Tier' }
    };

    this.initEventListeners();
  }

  loadCart() {
    try {
      const saved = localStorage.getItem('mosquito_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading cart', e);
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem('mosquito_cart', JSON.stringify(this.items));
    } catch (e) {
      console.error('Error saving cart', e);
    }
  }

  initEventListeners() {
    // Open drawer button
    const bagTriggers = document.querySelectorAll('[data-action="open-bag"]');
    bagTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openDrawer();
      });
    });

    // Close drawer buttons
    const closeTriggers = document.querySelectorAll('[data-action="close-bag"]');
    closeTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeDrawer();
      });
    });

    // Drawer backdrop click
    const backdrop = document.getElementById('bag-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => this.closeDrawer());
    }

    // Promo code apply button
    const promoBtn = document.getElementById('apply-promo-btn');
    const promoInput = document.getElementById('promo-code-input');
    if (promoBtn && promoInput) {
      promoBtn.addEventListener('click', () => {
        this.applyPromoCode(promoInput.value.trim().toUpperCase());
      });
      promoInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.applyPromoCode(promoInput.value.trim().toUpperCase());
        }
      });
    }

    // Checkout trigger from drawer -> Redirects to dedicated Customer Details page
    const checkoutBtn = document.getElementById('drawer-checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        this.closeDrawer();
        window.location.href = 'checkout.html';
      });
    }
  }

  formatPrice(inrAmount) {
    return `Rs. ${Math.round(inrAmount).toLocaleString('en-IN')}.00`;
  }

  addItem(productId, size, colorName, fit) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = this.items.findIndex(
      item => item.id === productId && item.size === size && item.color === colorName
    );

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += 1;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        priceINR: product.price,
        image: product.images[0],
        size: size || product.sizes[0],
        color: colorName || (product.colors[0] ? product.colors[0].name : 'Default'),
        fit: fit || product.fit,
        category: product.category,
        quantity: 1
      });
    }

    this.saveCart();
    this.render();
    this.openDrawer();

    if (window.appManager) {
      window.appManager.showToast(`Added "${product.name}" (${size || product.sizes[0]}) to Bag.`);
    }
  }

  updateQuantity(index, delta) {
    if (!this.items[index]) return;
    this.items[index].quantity += delta;
    if (this.items[index].quantity <= 0) {
      this.items.splice(index, 1);
    }
    this.saveCart();
    this.render();
  }

  removeItem(index) {
    if (!this.items[index]) return;
    const removedName = this.items[index].name;
    this.items.splice(index, 1);
    this.saveCart();
    this.render();
    if (window.appManager) {
      window.appManager.showToast(`Removed "${removedName}" from Bag.`);
    }
  }

  updateItemSize(index, newSize) {
    if (!this.items[index]) return;
    this.items[index].size = newSize;
    this.saveCart();
    this.render();
  }

  applyPromoCode(code) {
    const msgElem = document.getElementById('promo-status-msg');
    if (!code) {
      if (msgElem) {
        msgElem.textContent = 'Please enter a coupon code.';
        msgElem.className = 'text-xs text-amber-600 mt-1';
      }
      return;
    }

    if (this.PROMO_CODES[code]) {
      this.appliedPromo = {
        code: code,
        discountPercent: this.PROMO_CODES[code].discountPercent,
        label: this.PROMO_CODES[code].label
      };
      if (msgElem) {
        msgElem.textContent = `Applied: ${this.appliedPromo.label} (${this.appliedPromo.discountPercent}% OFF)`;
        msgElem.className = 'text-xs text-emerald-600 font-medium mt-1';
      }
      this.render();
      if (window.appManager) {
        window.appManager.showToast(`Promo "${code}" activated! ${this.appliedPromo.discountPercent}% discount.`);
      }
    } else {
      if (msgElem) {
        msgElem.textContent = 'Invalid promo code. Try MOSQUITO10, EDITORIAL or VIP20';
        msgElem.className = 'text-xs text-red-500 mt-1';
      }
    }
  }

  getTotals() {
    const subtotalINR = this.items.reduce((sum, item) => sum + ((item.priceINR || item.priceUSD || 0) * item.quantity), 0);
    const discountINR = this.appliedPromo ? (subtotalINR * this.appliedPromo.discountPercent) / 100 : 0;
    const discountedSubtotalINR = subtotalINR - discountINR;
    
    // Free shipping if discountedSubtotal >= threshold or cart is empty
    const shippingINR = (discountedSubtotalINR >= this.shippingThresholdINR || subtotalINR === 0) ? 0 : 499;
    
    // GST (12% Included or Calculated)
    const taxINR = discountedSubtotalINR * 0.12;
    const totalINR = discountedSubtotalINR + shippingINR + taxINR;

    return {
      subtotalINR,
      discountINR,
      discountedSubtotalINR,
      shippingINR,
      taxINR,
      totalINR,
      itemCount: this.items.reduce((count, item) => count + item.quantity, 0)
    };
  }

  openDrawer() {
    this.drawerOpen = true;
    const drawer = document.getElementById('quick-bag-drawer');
    const backdrop = document.getElementById('bag-backdrop');
    if (drawer && backdrop) {
      backdrop.style.display = 'block';
      drawer.style.visibility = 'visible';
      drawer.classList.add('active');
      backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    this.render();
  }

  closeDrawer() {
    this.drawerOpen = false;
    const drawer = document.getElementById('quick-bag-drawer');
    const backdrop = document.getElementById('bag-backdrop');
    if (drawer && backdrop) {
      drawer.classList.remove('active');
      backdrop.classList.remove('active');
      setTimeout(() => {
        if (!this.drawerOpen) {
          drawer.style.visibility = 'hidden';
          backdrop.style.display = 'none';
        }
      }, 350);
      document.body.style.overflow = '';
    }
  }

  render() {
    // 1. Update Cart Badges in Header & Mobile Nav
    const totals = this.getTotals();
    const badges = document.querySelectorAll('.cart-badge-count');
    badges.forEach(badge => {
      badge.textContent = totals.itemCount;
      if (totals.itemCount > 0) {
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    });

    // 2. Free Shipping Progress Bar
    const shippingMsg = document.getElementById('free-shipping-msg');
    const shippingBar = document.getElementById('free-shipping-bar');
    if (shippingMsg && shippingBar) {
      const remainingINR = Math.max(0, this.shippingThresholdINR - totals.discountedSubtotalINR);
      const progressPercent = Math.min(100, (totals.discountedSubtotalINR / this.shippingThresholdINR) * 100);
      
      shippingBar.style.width = `${progressPercent}%`;
      if (totals.itemCount === 0) {
        shippingMsg.innerHTML = `Complimentary express delivery across India on orders over <span class="font-semibold text-neutral-900">${this.formatPrice(this.shippingThresholdINR)}</span>`;
      } else if (remainingINR === 0) {
        shippingMsg.innerHTML = `<span class="text-emerald-700 font-medium">✓ Complimentary Express Delivery Unlocked!</span>`;
      } else {
        shippingMsg.innerHTML = `Add <span class="font-semibold text-neutral-900">${this.formatPrice(remainingINR)}</span> more for complimentary express delivery`;
      }
    }

    // 3. Render Cart Items inside Drawer
    const itemsContainer = document.getElementById('drawer-items-list');
    const emptyState = document.getElementById('drawer-empty-state');
    const summarySection = document.getElementById('drawer-summary-section');

    if (!itemsContainer) return;

    if (this.items.length === 0) {
      itemsContainer.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      if (summarySection) summarySection.classList.add('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    if (summarySection) summarySection.classList.remove('hidden');

    itemsContainer.innerHTML = this.items.map((item, index) => {
      const productObj = PRODUCTS.find(p => p.id === item.id);
      const availableSizes = productObj ? productObj.sizes : ['XS', 'S', 'M', 'L', 'XL'];
      const itemPrice = item.priceINR || item.priceUSD || 0;

      return `
        <div class="flex gap-4 py-4 border-b border-neutral-100 group transition-all">
          <div class="w-20 h-26 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0 relative">
            <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
          </div>
          <div class="flex-1 flex flex-col justify-between min-w-0">
            <div>
              <div class="flex justify-between items-start gap-2">
                <h4 class="text-sm font-medium text-neutral-900 truncate tracking-tight font-sans">${item.name}</h4>
                <button onclick="cartManager.removeItem(${index})" class="text-neutral-400 hover:text-neutral-900 transition-colors p-1" title="Remove item">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
              <p class="text-xs text-neutral-500 mt-0.5">${item.color} • ${item.fit} Fit</p>
              
              <div class="flex items-center gap-2 mt-2">
                <span class="text-xs text-neutral-400 uppercase font-mono">Size:</span>
                <select onchange="cartManager.updateItemSize(${index}, this.value)" class="text-xs bg-neutral-50 border border-neutral-200 rounded px-2 py-0.5 text-neutral-800 font-mono focus:outline-none focus:border-neutral-900 cursor-pointer">
                  ${availableSizes.map(sz => `<option value="${sz}" ${sz === item.size ? 'selected' : ''}>${sz}</option>`).join('')}
                </select>
              </div>
            </div>

            <div class="flex items-center justify-between mt-3 pt-2">
              <!-- Quantity Stepper -->
              <div class="flex items-center gap-1.5 bg-neutral-50 p-0.5 rounded-lg border border-neutral-200">
                <button onclick="cartManager.updateQuantity(${index}, -1)" class="qty-btn" aria-label="Decrease quantity">−</button>
                <span class="w-6 text-center text-xs font-mono font-medium text-neutral-900">${item.quantity}</span>
                <button onclick="cartManager.updateQuantity(${index}, 1)" class="qty-btn" aria-label="Increase quantity">+</button>
              </div>

              <!-- Item Subtotal -->
              <span class="text-sm font-semibold text-neutral-900 font-mono">
                ${this.formatPrice(itemPrice * item.quantity)}
              </span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // 4. Update Summary Pricing
    const subtotalEl = document.getElementById('drawer-subtotal');
    const discountRow = document.getElementById('drawer-discount-row');
    const discountEl = document.getElementById('drawer-discount');
    const totalEl = document.getElementById('drawer-total');

    if (subtotalEl) subtotalEl.textContent = this.formatPrice(totals.subtotalINR);
    if (discountRow && discountEl) {
      if (totals.discountINR > 0) {
        discountRow.classList.remove('hidden');
        discountEl.textContent = `-${this.formatPrice(totals.discountINR)}`;
      } else {
        discountRow.classList.add('hidden');
      }
    }
    if (totalEl) totalEl.textContent = this.formatPrice(totals.discountedSubtotalINR);
  }
}

// Global instance
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (!window.cartManager) window.cartManager = new CartManager();
    });
  } else {
    window.cartManager = new CartManager();
  }
}
