/**
 * MOSQUITO Inbuilt Information & Modal System
 * Provides rich, interactive modals for all Footer & Navigation options:
 * SHOP: All, Topwear, Bottomwear, Outerwear, Sale, Wishlist (Accessories removed)
 * HELP: Return/Exchange, Track Order, Shipping Policy, Size Guide, Contact Us, FAQs, Gift Card
 * MOSQUITO: Our Story, MOSQUITO Club, Privacy Policy, Terms
 */

class InfoModalManager {
  constructor() {
    this.modalBackdrop = document.getElementById('info-modal-backdrop');
    this.modalContent = document.getElementById('info-modal-content');
    this.modalTitle = document.getElementById('info-modal-title');
    this.modalCategoryBadge = document.getElementById('info-modal-badge');
    this.init();
  }

  init() {
    // Backdrop click to close
    if (this.modalBackdrop) {
      this.modalBackdrop.addEventListener('click', (e) => {
        if (e.target === this.modalBackdrop) {
          this.close();
        }
      });
    }

    // Keyboard ESC to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });

    // Close button
    const closeBtn = document.getElementById('info-modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }
  }

  isOpen() {
    return this.modalBackdrop && !this.modalBackdrop.classList.contains('hidden') && this.modalBackdrop.classList.contains('active');
  }

  close() {
    if (!this.modalBackdrop) return;
    this.modalBackdrop.classList.remove('active');
    setTimeout(() => {
      this.modalBackdrop.classList.add('hidden');
      this.modalBackdrop.style.display = 'none';
      document.body.style.overflow = '';
    }, 200);
  }

  open(type, extraData = null) {
    if (!this.modalBackdrop || !this.modalContent) return;

    this.modalBackdrop.classList.remove('hidden');
    this.modalBackdrop.style.display = 'flex';
    // Force reflow for smooth animation
    void this.modalBackdrop.offsetWidth;
    this.modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Render content according to requested type
    switch (type) {
      case 'return-exchange':
        this.renderReturnExchange();
        break;
      case 'track-order':
        this.renderTrackOrder();
        break;
      case 'shipping-policy':
        this.renderShippingPolicy();
        break;
      case 'size-guide':
        this.renderSizeGuide();
        break;
      case 'contact-us':
        this.renderContactUs();
        break;
      case 'faqs':
        this.renderFAQs();
        break;
      case 'gift-card':
        this.renderGiftCard();
        break;
      case 'our-story':
        this.renderOurStory();
        break;
      case 'mosquito-club':
        this.renderMosquitoClub();
        break;
      case 'privacy-policy':
        this.renderPrivacyPolicy();
        break;
      case 'terms':
        this.renderTerms();
        break;
      case 'sale':
        this.renderSale();
        break;
      case 'wishlist':
        this.renderWishlist();
        break;
      default:
        this.renderOurStory();
    }

    // Scroll modal to top
    this.modalContent.scrollTop = 0;
  }

  /* ----------------------------------------------------
     1. RETURN & EXCHANGE PORTAL
     ---------------------------------------------------- */
  renderReturnExchange() {
    this.modalCategoryBadge.textContent = 'HELP & SERVICES';
    this.modalTitle.textContent = '30-Day Doorstep Return & Exchange';

    this.modalContent.innerHTML = `
      <div class="space-y-6">
        <!-- Highlights Banner -->
        <div class="p-4 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-start gap-3.5">
          <div class="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-800">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          </div>
          <div>
            <h4 class="text-xs font-bold font-sans uppercase tracking-wider text-amber-950">Zero-Friction Doorstep Reverse Pickup</h4>
            <p class="text-xs text-amber-900/80 mt-0.5 leading-relaxed">
              We offer a complimentary 30-day exchange and return window on all MOSQUITO apparel. Our courier will pick up from your doorstep at zero extra cost.
            </p>
          </div>
        </div>

        <!-- Form -->
        <div class="bg-neutral-50 p-6 rounded-2xl border border-neutral-200 space-y-4">
          <h4 class="text-xs font-mono uppercase tracking-widest font-bold text-neutral-900 border-b border-neutral-200 pb-2">
            Initiate Request
          </h4>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div>
              <label class="block font-mono uppercase text-[10px] text-neutral-500 font-semibold mb-1">Order ID *</label>
              <input type="text" id="ret-order-id" placeholder="e.g. MSQ-9842" class="w-full bg-white border border-neutral-200 rounded-lg px-3.5 py-2.5 font-mono text-neutral-900 focus:outline-none focus:border-black" />
            </div>

            <div>
              <label class="block font-mono uppercase text-[10px] text-neutral-500 font-semibold mb-1">Registered Mobile Number *</label>
              <input type="tel" id="ret-phone" maxlength="10" placeholder="9876543210" class="w-full bg-white border border-neutral-200 rounded-lg px-3.5 py-2.5 font-mono text-neutral-900 focus:outline-none focus:border-black" />
            </div>

            <div class="sm:col-span-2">
              <label class="block font-mono uppercase text-[10px] text-neutral-500 font-semibold mb-1">Action Required *</label>
              <select id="ret-type" class="w-full bg-white border border-neutral-200 rounded-lg px-3.5 py-2.5 text-neutral-900 focus:outline-none focus:border-black font-sans">
                <option value="exchange">Exchange for Different Size (Recommended)</option>
                <option value="exchange-color">Exchange for Different Style/Color</option>
                <option value="refund-upi">Full Refund to Original UPI / Bank Account</option>
                <option value="store-credit">Store Credit (+5% Bonus Credit)</option>
              </select>
            </div>

            <div class="sm:col-span-2">
              <label class="block font-mono uppercase text-[10px] text-neutral-500 font-semibold mb-1">Reason for Return / Exchange *</label>
              <select id="ret-reason" class="w-full bg-white border border-neutral-200 rounded-lg px-3.5 py-2.5 text-neutral-900 focus:outline-none focus:border-black font-sans">
                <option>Size runs too large</option>
                <option>Size runs too small</option>
                <option>Fabric feel / Drape preference</option>
                <option>Style looks different than expected</option>
                <option>Defective or damaged in transit</option>
              </select>
            </div>

            <div class="sm:col-span-2">
              <label class="block font-mono uppercase text-[10px] text-neutral-500 font-semibold mb-1">Pickup Address & Pincode *</label>
              <input type="text" id="ret-pickup-addr" placeholder="Doorstep pickup address" class="w-full bg-white border border-neutral-200 rounded-lg px-3.5 py-2.5 text-neutral-900 focus:outline-none focus:border-black" />
            </div>
          </div>

          <div class="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button onclick="window.infoManager.submitReturnRequest()" class="w-full sm:w-auto px-6 py-3 bg-neutral-900 text-white rounded-full font-mono text-xs uppercase tracking-wider font-bold hover:bg-black transition-all shadow-md">
              Submit Return Request →
            </button>
            <a href="https://wa.me/919490751996?text=Hi%20MOSQUITO%20Team%2C%20I%20would%20like%20to%20request%20an%20exchange%2Freturn" target="_blank" class="text-xs font-mono text-emerald-700 hover:text-emerald-900 flex items-center gap-1 font-bold">
              <span>Instant WhatsApp Concierge Support</span> →
            </a>
          </div>
        </div>

        <!-- 3 Step Process -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div class="p-4 border border-neutral-200 rounded-xl bg-white space-y-1">
            <span class="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center font-mono font-bold text-neutral-800 mb-2">1</span>
            <div class="font-bold text-neutral-900">1. Instant Approval</div>
            <div class="text-neutral-500 text-[11px]">Request is verified automatically and pickup agent assigned.</div>
          </div>
          <div class="p-4 border border-neutral-200 rounded-xl bg-white space-y-1">
            <span class="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center font-mono font-bold text-neutral-800 mb-2">2</span>
            <div class="font-bold text-neutral-900">2. Free Doorstep Pickup</div>
            <div class="text-neutral-500 text-[11px]">Hand over garment in its original box with tags intact.</div>
          </div>
          <div class="p-4 border border-neutral-200 rounded-xl bg-white space-y-1">
            <span class="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center font-mono font-bold text-neutral-800 mb-2">3</span>
            <div class="font-bold text-neutral-900">3. Express Replacement</div>
            <div class="text-neutral-500 text-[11px]">New size is dispatched immediately or refund credited in 24 hrs.</div>
          </div>
        </div>
      </div>
    `;
  }

  submitReturnRequest() {
    const orderId = document.getElementById('ret-order-id')?.value.trim() || 'MSQ-' + Math.floor(1000 + Math.random() * 9000);
    const phone = document.getElementById('ret-phone')?.value.trim() || '9490751996';
    const type = document.getElementById('ret-type')?.value || 'Exchange';
    
    window.appManager.showToast(`✓ Request submitted for ${orderId}! Reverse pickup scheduled.`);
    
    // Trigger WhatsApp notification link
    const waUrl = `https://wa.me/919490751996?text=${encodeURIComponent(`Hi MOSQUITO Concierge, I have submitted a ${type} request for Order ID: ${orderId} (Mobile: ${phone}). Please confirm pickup.`)}`;
    setTimeout(() => {
      window.open(waUrl, '_blank');
      this.close();
    }, 1200);
  }

  /* ----------------------------------------------------
     2. TRACK YOUR ORDER PORTAL
     ---------------------------------------------------- */
  renderTrackOrder() {
    this.modalCategoryBadge.textContent = 'HELP & LOGISTICS';
    this.modalTitle.textContent = 'Live Air Express Order Tracking';

    this.modalContent.innerHTML = `
      <div class="space-y-6">
        <!-- Search Input -->
        <div class="p-5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
          <div class="flex flex-col sm:flex-row gap-2.5">
            <input type="text" id="track-order-input" value="MSQ-8492" placeholder="Enter Order ID (e.g. MSQ-8492) or 10-Digit Mobile" class="flex-1 bg-white border border-neutral-200 rounded-xl px-4 py-3 font-mono text-xs text-neutral-900 focus:outline-none focus:border-black font-bold uppercase" />
            <button onclick="window.infoManager.updateTrackStatus()" class="px-6 py-3 bg-neutral-900 text-white rounded-xl font-mono text-xs font-bold uppercase tracking-wider hover:bg-black transition-all">
              Track Parcel
            </button>
          </div>
          <div class="flex items-center justify-between text-[11px] text-neutral-500 font-mono">
            <span>Air Express Carrier: <strong>Bluedart Apex</strong></span>
            <span>AWB: <strong>BD98249019IN</strong></span>
          </div>
        </div>

        <!-- Simulated Active Timeline -->
        <div class="p-6 bg-white border border-neutral-200 rounded-2xl space-y-6">
          <div class="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div>
              <span class="text-[10px] font-mono uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-bold">In Transit • On Schedule</span>
              <h4 class="text-sm font-bold text-neutral-900 mt-1.5">Estimated Delivery: Tomorrow by 2:00 PM IST</h4>
            </div>
            <div class="text-right">
              <span class="text-xs font-mono font-bold text-neutral-900">Destination: Mumbai / India</span>
            </div>
          </div>

          <!-- Vertical Timeline Steps -->
          <div class="space-y-5 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
            <!-- Step 1 -->
            <div class="relative">
              <span class="absolute -left-6 top-1 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white shadow-xs"></span>
              <div class="font-bold text-xs text-neutral-900">Order Placed & Payment Verified</div>
              <div class="text-[11px] text-neutral-500">Yesterday, 04:30 PM • 100% Secure Transaction</div>
            </div>
            <!-- Step 2 -->
            <div class="relative">
              <span class="absolute -left-6 top-1 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white shadow-xs"></span>
              <div class="font-bold text-xs text-neutral-900">Quality Inspected & Cold-Press Packed</div>
              <div class="text-[11px] text-neutral-500">Yesterday, 07:15 PM • Flagship Fulfillment Hub</div>
            </div>
            <!-- Step 3 -->
            <div class="relative">
              <span class="absolute -left-6 top-1 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white shadow-xs ring-4 ring-emerald-100"></span>
              <div class="font-bold text-xs text-emerald-800">Departed Airport Transit Hub (Air Express)</div>
              <div class="text-[11px] text-neutral-500">Today, 06:20 AM • Bluedart Flight Cargo</div>
            </div>
            <!-- Step 4 -->
            <div class="relative opacity-60">
              <span class="absolute -left-6 top-1 w-4 h-4 rounded-full bg-neutral-300 border-2 border-white"></span>
              <div class="font-bold text-xs text-neutral-700">Out for Delivery with Courier OTP</div>
              <div class="text-[11px] text-neutral-400">Expected Tomorrow Morning</div>
            </div>
          </div>
        </div>

        <div class="p-4 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between">
          <div class="text-xs text-neutral-700">Need real-time live WhatsApp location alerts?</div>
          <a href="https://wa.me/919490751996?text=Hi%20MOSQUITO%20Team%2C%20please%20send%20tracking%20updates%20for%20my%20order" target="_blank" class="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-mono font-bold hover:bg-emerald-800 transition-colors">
            WhatsApp Tracker →
          </a>
        </div>
      </div>
    `;
  }

  updateTrackStatus() {
    const val = document.getElementById('track-order-input')?.value.trim();
    window.appManager.showToast(`Fetching latest satellite GPS scan for ${val || 'your parcel'}...`);
  }

  /* ----------------------------------------------------
     3. SHIPPING POLICY
     ---------------------------------------------------- */
  renderShippingPolicy() {
    this.modalCategoryBadge.textContent = 'HELP & LOGISTICS';
    this.modalTitle.textContent = 'Domestic Air Express Shipping Policy';

    this.modalContent.innerHTML = `
      <div class="space-y-6 text-xs text-neutral-700 leading-relaxed">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1.5">
            <span class="font-mono text-emerald-700 font-bold text-xs">01 / DISPATCH SPEED</span>
            <h4 class="font-bold text-neutral-900 text-sm">24-Hour Express Dispatch</h4>
            <p class="text-neutral-600 text-[11px]">All orders placed before 3:00 PM IST are inspected, cold-pressed, and handed to Air Express carriers the very same day.</p>
          </div>
          <div class="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1.5">
            <span class="font-mono text-emerald-700 font-bold text-xs">02 / COVERAGE</span>
            <h4 class="font-bold text-neutral-900 text-sm">28,000+ Indian Pin Codes</h4>
            <p class="text-neutral-600 text-[11px]">We deliver to all metro cities, tier 1, tier 2, and remote regional destinations across India via Bluedart & Delhivery Air.</p>
          </div>
          <div class="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1.5">
            <span class="font-mono text-emerald-700 font-bold text-xs">03 / SHIPPING FEE</span>
            <h4 class="font-bold text-neutral-900 text-sm">100% Free Shipping</h4>
            <p class="text-neutral-600 text-[11px]">Zero hidden fees or minimum cart constraints. Every single order qualifies for complimentary air express shipping.</p>
          </div>
          <div class="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1.5">
            <span class="font-mono text-emerald-700 font-bold text-xs">04 / PACKAGING</span>
            <h4 class="font-bold text-neutral-900 text-sm">Tamper-Proof Cold-Press</h4>
            <p class="text-neutral-600 text-[11px]">Garments are packed in protective matte black branded enclosures with moisture seal shields to prevent transit creasing.</p>
          </div>
        </div>

        <div class="border-t border-neutral-200 pt-4 space-y-3">
          <h4 class="font-bold text-sm text-neutral-900 uppercase font-sans">Delivery Timeline Estimates</h4>
          <ul class="space-y-2 font-mono text-[11px]">
            <li class="flex justify-between border-b border-neutral-100 pb-1">
              <span>Metros (Mumbai, Delhi NCR, Bangalore, Hyderabad, Chennai, Kolkata):</span>
              <strong class="text-neutral-900">1 – 2 Business Days</strong>
            </li>
            <li class="flex justify-between border-b border-neutral-100 pb-1">
              <span>Tier 2 & Tier 3 Regional Cities:</span>
              <strong class="text-neutral-900">2 – 3 Business Days</strong>
            </li>
            <li class="flex justify-between border-b border-neutral-100 pb-1">
              <span>North East & Island Territories:</span>
              <strong class="text-neutral-900">3 – 4 Business Days</strong>
            </li>
          </ul>
        </div>
      </div>
    `;
  }

  /* ----------------------------------------------------
     4. SIZE GUIDE
     ---------------------------------------------------- */
  renderSizeGuide() {
    this.modalCategoryBadge.textContent = 'HELP & FIT';
    this.modalTitle.textContent = 'Sartorial Size & Measurement Chart';

    this.modalContent.innerHTML = `
      <div class="space-y-6 text-xs">
        <!-- Fit Description -->
        <p class="text-neutral-600 leading-relaxed">
          MOSQUITO silhouettes are engineered with contemporary relaxed street drape. If you prefer a tailored fit, choose your exact size. For a signature runway oversized silhouette, order one size up.
        </p>

        <!-- Unit & Gender Switchers -->
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-3">
          <div class="flex gap-2">
            <button id="size-tab-men" onclick="window.infoManager.switchSizeGender('men')" class="px-3.5 py-1.5 rounded-full text-xs font-mono uppercase font-bold bg-neutral-900 text-white shadow-xs">
              Men's Edition
            </button>
            <button id="size-tab-women" onclick="window.infoManager.switchSizeGender('women')" class="px-3.5 py-1.5 rounded-full text-xs font-mono uppercase font-bold bg-neutral-100 text-neutral-700 hover:bg-neutral-200">
              Women's Edition
            </button>
          </div>
          <div class="text-[11px] font-mono text-neutral-500">
            Measurements shown in: <strong>Inches (in)</strong>
          </div>
        </div>

        <!-- Size Table Container -->
        <div id="size-table-wrapper" class="overflow-x-auto">
          <table class="w-full text-left font-mono text-xs border border-neutral-200 rounded-xl overflow-hidden">
            <thead class="bg-neutral-900 text-white text-[11px] uppercase tracking-wider">
              <tr>
                <th class="py-3 px-4">Size</th>
                <th class="py-3 px-4">Chest / Bust</th>
                <th class="py-3 px-4">Waist</th>
                <th class="py-3 px-4">Shoulder</th>
                <th class="py-3 px-4">Garment Length</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-200 bg-white">
              <tr class="hover:bg-neutral-50"><td class="py-2.5 px-4 font-bold">XS (36)</td><td class="py-2.5 px-4">36"</td><td class="py-2.5 px-4">30"</td><td class="py-2.5 px-4">17.5"</td><td class="py-2.5 px-4">27"</td></tr>
              <tr class="hover:bg-neutral-50"><td class="py-2.5 px-4 font-bold">S (38)</td><td class="py-2.5 px-4">38"</td><td class="py-2.5 px-4">32"</td><td class="py-2.5 px-4">18.0"</td><td class="py-2.5 px-4">28"</td></tr>
              <tr class="hover:bg-neutral-50 bg-neutral-50/60"><td class="py-2.5 px-4 font-bold text-[#9E7831]">M (40) • Most Popular</td><td class="py-2.5 px-4">40"</td><td class="py-2.5 px-4">34"</td><td class="py-2.5 px-4">18.5"</td><td class="py-2.5 px-4">29"</td></tr>
              <tr class="hover:bg-neutral-50"><td class="py-2.5 px-4 font-bold">L (42)</td><td class="py-2.5 px-4">42"</td><td class="py-2.5 px-4">36"</td><td class="py-2.5 px-4">19.0"</td><td class="py-2.5 px-4">30"</td></tr>
              <tr class="hover:bg-neutral-50"><td class="py-2.5 px-4 font-bold">XL (44)</td><td class="py-2.5 px-4">44"</td><td class="py-2.5 px-4">38"</td><td class="py-2.5 px-4">19.5"</td><td class="py-2.5 px-4">31"</td></tr>
              <tr class="hover:bg-neutral-50"><td class="py-2.5 px-4 font-bold">XXL (46)</td><td class="py-2.5 px-4">46"</td><td class="py-2.5 px-4">40"</td><td class="py-2.5 px-4">20.0"</td><td class="py-2.5 px-4">32"</td></tr>
            </tbody>
          </table>
        </div>

        <div class="p-4 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between">
          <div>
            <div class="font-bold text-neutral-900">Unsure about your exact fit?</div>
            <div class="text-[11px] text-neutral-500">Send your height and weight to our styling concierge for instant sizing advice.</div>
          </div>
          <a href="https://wa.me/919490751996?text=Hi%20MOSQUITO%20Stylist%2C%20can%20you%20help%20me%20choose%20my%20size%3F" target="_blank" class="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-mono text-xs font-bold uppercase transition-colors">
            Ask Stylist →
          </a>
        </div>
      </div>
    `;
  }

  switchSizeGender(gender) {
    const menBtn = document.getElementById('size-tab-men');
    const womenBtn = document.getElementById('size-tab-women');
    const wrapper = document.getElementById('size-table-wrapper');

    if (gender === 'men') {
      menBtn.className = 'px-3.5 py-1.5 rounded-full text-xs font-mono uppercase font-bold bg-neutral-900 text-white shadow-xs';
      womenBtn.className = 'px-3.5 py-1.5 rounded-full text-xs font-mono uppercase font-bold bg-neutral-100 text-neutral-700 hover:bg-neutral-200';
      wrapper.innerHTML = `
        <table class="w-full text-left font-mono text-xs border border-neutral-200 rounded-xl overflow-hidden">
          <thead class="bg-neutral-900 text-white text-[11px] uppercase tracking-wider">
            <tr><th class="py-3 px-4">Size</th><th class="py-3 px-4">Chest</th><th class="py-3 px-4">Waist</th><th class="py-3 px-4">Shoulder</th><th class="py-3 px-4">Garment Length</th></tr>
          </thead>
          <tbody class="divide-y divide-neutral-200 bg-white">
            <tr class="hover:bg-neutral-50"><td class="py-2.5 px-4 font-bold">XS (36)</td><td class="py-2.5 px-4">36"</td><td class="py-2.5 px-4">30"</td><td class="py-2.5 px-4">17.5"</td><td class="py-2.5 px-4">27"</td></tr>
            <tr class="hover:bg-neutral-50"><td class="py-2.5 px-4 font-bold">S (38)</td><td class="py-2.5 px-4">38"</td><td class="py-2.5 px-4">32"</td><td class="py-2.5 px-4">18.0"</td><td class="py-2.5 px-4">28"</td></tr>
            <tr class="hover:bg-neutral-50 bg-neutral-50/60"><td class="py-2.5 px-4 font-bold text-[#9E7831]">M (40)</td><td class="py-2.5 px-4">40"</td><td class="py-2.5 px-4">34"</td><td class="py-2.5 px-4">18.5"</td><td class="py-2.5 px-4">29"</td></tr>
            <tr class="hover:bg-neutral-50"><td class="py-2.5 px-4 font-bold">L (42)</td><td class="py-2.5 px-4">42"</td><td class="py-2.5 px-4">36"</td><td class="py-2.5 px-4">19.0"</td><td class="py-2.5 px-4">30"</td></tr>
            <tr class="hover:bg-neutral-50"><td class="py-2.5 px-4 font-bold">XL (44)</td><td class="py-2.5 px-4">44"</td><td class="py-2.5 px-4">38"</td><td class="py-2.5 px-4">19.5"</td><td class="py-2.5 px-4">31"</td></tr>
            <tr class="hover:bg-neutral-50"><td class="py-2.5 px-4 font-bold">XXL (46)</td><td class="py-2.5 px-4">46"</td><td class="py-2.5 px-4">40"</td><td class="py-2.5 px-4">20.0"</td><td class="py-2.5 px-4">32"</td></tr>
          </tbody>
        </table>
      `;
    } else {
      womenBtn.className = 'px-3.5 py-1.5 rounded-full text-xs font-mono uppercase font-bold bg-neutral-900 text-white shadow-xs';
      menBtn.className = 'px-3.5 py-1.5 rounded-full text-xs font-mono uppercase font-bold bg-neutral-100 text-neutral-700 hover:bg-neutral-200';
      wrapper.innerHTML = `
        <table class="w-full text-left font-mono text-xs border border-neutral-200 rounded-xl overflow-hidden">
          <thead class="bg-neutral-900 text-white text-[11px] uppercase tracking-wider">
            <tr><th class="py-3 px-4">Size</th><th class="py-3 px-4">Bust</th><th class="py-3 px-4">Waist</th><th class="py-3 px-4">Hip</th><th class="py-3 px-4">Dress Length</th></tr>
          </thead>
          <tbody class="divide-y divide-neutral-200 bg-white">
            <tr class="hover:bg-neutral-50"><td class="py-2.5 px-4 font-bold">XS (UK 6)</td><td class="py-2.5 px-4">32"</td><td class="py-2.5 px-4">26"</td><td class="py-2.5 px-4">35"</td><td class="py-2.5 px-4">36"</td></tr>
            <tr class="hover:bg-neutral-50 bg-neutral-50/60"><td class="py-2.5 px-4 font-bold text-[#9E7831]">S (UK 8) • Popular</td><td class="py-2.5 px-4">34"</td><td class="py-2.5 px-4">28"</td><td class="py-2.5 px-4">37"</td><td class="py-2.5 px-4">37"</td></tr>
            <tr class="hover:bg-neutral-50"><td class="py-2.5 px-4 font-bold">M (UK 10)</td><td class="py-2.5 px-4">36"</td><td class="py-2.5 px-4">30"</td><td class="py-2.5 px-4">39"</td><td class="py-2.5 px-4">38"</td></tr>
            <tr class="hover:bg-neutral-50"><td class="py-2.5 px-4 font-bold">L (UK 12)</td><td class="py-2.5 px-4">38"</td><td class="py-2.5 px-4">32"</td><td class="py-2.5 px-4">41"</td><td class="py-2.5 px-4">39"</td></tr>
            <tr class="hover:bg-neutral-50"><td class="py-2.5 px-4 font-bold">XL (UK 14)</td><td class="py-2.5 px-4">40"</td><td class="py-2.5 px-4">34"</td><td class="py-2.5 px-4">43"</td><td class="py-2.5 px-4">40"</td></tr>
          </tbody>
        </table>
      `;
    }
  }

  /* ----------------------------------------------------
     5. CONTACT US
     ---------------------------------------------------- */
  renderContactUs() {
    this.modalCategoryBadge.textContent = 'HELP & CONCIERGE';
    this.modalTitle.textContent = 'Direct Client Care & Concierge';

    this.modalContent.innerHTML = `
      <div class="space-y-6 text-xs">
        <p class="text-neutral-600 leading-relaxed">
          Our customer concierge team is at your service 7 days a week for styling guidance, order modifications, custom fittings, and parcel tracking.
        </p>

        <!-- Direct Contact Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- WhatsApp -->
          <a href="https://wa.me/919490751996" target="_blank" class="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center gap-3.5 hover:bg-emerald-100/70 transition-all group">
            <div class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
            </div>
            <div>
              <div class="text-[10px] font-mono uppercase text-emerald-800 font-bold">WhatsApp Concierge</div>
              <div class="font-bold text-neutral-900 text-sm font-mono">+91 9490751996</div>
              <div class="text-[11px] text-emerald-700">Instant Replies (10 AM - 8 PM IST)</div>
            </div>
          </a>

          <!-- Email -->
          <a href="mailto:concierge@mosquito.stores" class="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl flex items-center gap-3.5 hover:bg-neutral-100 transition-all group">
            <div class="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            </div>
            <div>
              <div class="text-[10px] font-mono uppercase text-neutral-500 font-bold">Email Inquiries</div>
              <div class="font-bold text-neutral-900 text-sm font-mono">concierge@mosquito.stores</div>
              <div class="text-[11px] text-neutral-500">Official Brand Inquiries</div>
            </div>
          </a>
        </div>

        <!-- Quick Contact Form -->
        <div class="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-3.5">
          <h4 class="font-bold uppercase tracking-wider text-neutral-900 font-mono text-xs">Send Direct Message</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <input type="text" id="contact-name" placeholder="Your Name" class="bg-white border border-neutral-200 rounded-lg px-3.5 py-2.5 text-neutral-900 focus:outline-none focus:border-black" />
            <input type="tel" id="contact-phone" maxlength="10" placeholder="Mobile Number" class="bg-white border border-neutral-200 rounded-lg px-3.5 py-2.5 text-neutral-900 font-mono focus:outline-none focus:border-black" />
            <div class="sm:col-span-2">
              <textarea id="contact-message" rows="3" placeholder="How can our styling or support team assist you today?" class="w-full bg-white border border-neutral-200 rounded-lg px-3.5 py-2.5 text-neutral-900 focus:outline-none focus:border-black"></textarea>
            </div>
          </div>
          <button onclick="window.infoManager.sendQuickMessage()" class="px-6 py-2.5 bg-neutral-900 hover:bg-black text-white rounded-full font-mono text-xs uppercase font-bold tracking-wider transition-all">
            Send Message →
          </button>
        </div>
      </div>
    `;
  }

  sendQuickMessage() {
    const name = document.getElementById('contact-name')?.value.trim() || 'Valued Customer';
    const msg = document.getElementById('contact-message')?.value.trim() || 'Order query';
    const waUrl = `https://wa.me/919490751996?text=${encodeURIComponent(`Hi MOSQUITO Concierge, my name is ${name}. Message: ${msg}`)}`;
    window.appManager.showToast('Connecting to MOSQUITO Concierge on WhatsApp...');
    window.open(waUrl, '_blank');
    this.close();
  }

  /* ----------------------------------------------------
     6. FREQUENTLY ASKED QUESTIONS (FAQS)
     ---------------------------------------------------- */
  renderFAQs() {
    this.modalCategoryBadge.textContent = 'HELP & SUPPORT';
    this.modalTitle.textContent = 'Frequently Asked Questions';

    const faqs = [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major payment avenues: Instant UPI (Google Pay, PhonePe, Paytm, CRED, BHIM), Cash on Delivery (COD) across India, Credit & Debit Cards (RuPay, Visa, MasterCard), and Direct 1-Click WhatsApp Concierge Booking.'
      },
      {
        q: 'How long does domestic shipping take?',
        a: 'Orders are dispatched within 24 hours via Bluedart/Delhivery Air Express. Most metro destinations receive delivery within 1-2 business days, while other Indian pin codes arrive in 2-3 business days.'
      },
      {
        q: 'What is your return and exchange policy?',
        a: 'We offer a 30-day hassle-free doorstep exchange and return policy. If the fit is not ideal, our courier will pick it up directly from your doorstep with zero return charges.'
      },
      {
        q: 'Are MOSQUITO garments made with pure organic cotton?',
        a: 'Yes. All MOSQUITO t-shirts, hoodies, and shirts are woven from 240–280 GSM combed organic cotton and fine-gauge natural twill, treated with bio-wash for ultimate longevity and softness.'
      },
      {
        q: 'Can I place an order directly on WhatsApp?',
        a: 'Yes! You can choose "WhatsApp Booking" during checkout or click the floating WhatsApp button to chat with our stylist at +91 9490751996.'
      }
    ];

    this.modalContent.innerHTML = `
      <div class="space-y-3.5 text-xs">
        ${faqs.map((f, i) => `
          <div class="border border-neutral-200 rounded-xl p-4 bg-neutral-50/50 space-y-1.5">
            <h4 class="font-bold text-neutral-900 text-sm flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-neutral-200 text-neutral-800 font-mono text-[10px] flex items-center justify-center font-bold">${i+1}</span>
              ${f.q}
            </h4>
            <p class="text-neutral-600 leading-relaxed pl-7 text-xs">${f.a}</p>
          </div>
        `).join('')}

        <div class="pt-4 text-center">
          <p class="text-neutral-500 text-[11px] mb-2">Have a question not listed here?</p>
          <a href="https://wa.me/919490751996" target="_blank" class="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-700 hover:text-emerald-900">
            <span>Chat Live with MOSQUITO Support</span> →
          </a>
        </div>
      </div>
    `;
  }

  /* ----------------------------------------------------
     7. CHECK GIFT CARD BALANCE
     ---------------------------------------------------- */
  renderGiftCard() {
    this.modalCategoryBadge.textContent = 'HELP & PRIVILEGE';
    this.modalTitle.textContent = 'Check Gift Card & Privilege Balance';

    this.modalContent.innerHTML = `
      <div class="space-y-6 text-xs">
        <!-- Gift Card Visual Preview -->
        <div class="max-w-md mx-auto bg-gradient-to-tr from-neutral-950 via-neutral-900 to-neutral-800 p-6 rounded-2xl text-white shadow-xl border border-neutral-700 font-mono space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-[10px] tracking-widest text-[#DFBD74] uppercase font-bold">MOSQUITO GIFT CARD</span>
            <span class="text-xs text-neutral-400">INDIA FLAGSHIP</span>
          </div>
          <div class="text-lg tracking-[0.25em] text-neutral-200 font-bold py-2">
            •••• •••• •••• 9842
          </div>
          <div class="flex justify-between items-center text-[10px] text-neutral-400 uppercase">
            <span>Valid across all capsules</span>
            <span class="text-[#DFBD74] font-bold">No Expiry</span>
          </div>
        </div>

        <!-- Lookup Form -->
        <div class="bg-neutral-50 p-6 rounded-2xl border border-neutral-200 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="sm:col-span-2">
              <label class="block font-mono uppercase text-[10px] text-neutral-500 font-semibold mb-1">16-Digit Card Number *</label>
              <input type="text" id="gc-number" maxlength="19" placeholder="4902 8812 9042 1192" class="w-full bg-white border border-neutral-200 rounded-lg px-3.5 py-2.5 font-mono text-neutral-900 focus:outline-none focus:border-black font-bold" />
            </div>
            <div>
              <label class="block font-mono uppercase text-[10px] text-neutral-500 font-semibold mb-1">4-Digit PIN *</label>
              <input type="password" id="gc-pin" maxlength="4" placeholder="••••" class="w-full bg-white border border-neutral-200 rounded-lg px-3.5 py-2.5 font-mono text-neutral-900 focus:outline-none focus:border-black font-bold" />
            </div>
          </div>

          <div id="gc-result-box" class="hidden p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-900">
            <div>
              <div class="text-[10px] font-mono uppercase font-bold text-emerald-700">Available Gift Balance</div>
              <div class="text-xl font-bold font-mono text-emerald-950">₹2,500.00</div>
            </div>
            <button onclick="window.infoManager.applyGiftCardToCart(2500)" class="px-4 py-2 bg-emerald-800 text-white rounded-lg font-mono text-xs uppercase font-bold hover:bg-emerald-900 transition-colors">
              Apply to Bag
            </button>
          </div>

          <button onclick="window.infoManager.checkGiftCardBalance()" class="w-full py-3 bg-neutral-900 hover:bg-black text-white rounded-full font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-md">
            Check Live Balance →
          </button>
        </div>
      </div>
    `;
  }

  checkGiftCardBalance() {
    const resBox = document.getElementById('gc-result-box');
    if (resBox) {
      resBox.classList.remove('hidden');
      window.appManager.showToast('✓ Verified! Gift Card Balance: ₹2,500.');
    }
  }

  applyGiftCardToCart(amount) {
    window.appManager.showToast(`Applied ₹${amount} gift balance to your order summary.`);
    this.close();
    window.checkoutManager.open();
  }

  /* ----------------------------------------------------
     8. OUR STORY
     ---------------------------------------------------- */
  renderOurStory() {
    this.modalCategoryBadge.textContent = 'BRAND MANIFESTO';
    this.modalTitle.textContent = 'The MOSQUITO Story & Heritage';

    this.modalContent.innerHTML = `
      <div class="space-y-6 text-xs text-neutral-700 leading-relaxed">
        <blockquote class="font-editorial text-xl sm:text-2xl font-light text-neutral-900 italic border-l-2 border-[#DFBD74] pl-4 py-1">
          “We engineer clothes not for seasons, but for silhouettes that define the modern street with quiet authority.”
        </blockquote>

        <p>
          Founded on the principle of raw architectural street couture, <strong>MOSQUITO</strong> represents an unhurried fusion between minimalist Scandinavian structural lines and rich, tactile Indian textile heritage.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div class="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1">
            <span class="font-mono text-[#9E7831] font-bold text-xs">MONOLITHIC DRAPE</span>
            <p class="text-neutral-600 text-[11px]">Boxy drops, relaxed shoulder slopes, and structured hems crafted for effortless fluid movement in contemporary metropolitan environments.</p>
          </div>
          <div class="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1">
            <span class="font-mono text-[#9E7831] font-bold text-xs">TEXTILE PURITY</span>
            <p class="text-neutral-600 text-[11px]">280+ GSM combed organic cotton, double-faced twill, breathable linen blends, and artisanal Indian embroideries crafted to breathe and endure.</p>
          </div>
        </div>

        <div class="border-t border-neutral-200 pt-4 flex items-center justify-between">
          <span class="font-mono text-[11px] text-neutral-500 uppercase tracking-widest font-semibold">Flagship India Edition</span>
          <button onclick="window.infoManager.close(); document.getElementById('catalog-section')?.scrollIntoView({behavior:'smooth'});" class="px-5 py-2 bg-neutral-900 text-white rounded-full font-mono text-xs uppercase font-bold hover:bg-black transition-all">
            Explore Ready-to-Wear Pieces →
          </button>
        </div>
      </div>
    `;
  }

  /* ----------------------------------------------------
     9. MOSQUITO CLUB (VIP PRIVILEGE)
     ---------------------------------------------------- */
  renderMosquitoClub() {
    this.modalCategoryBadge.textContent = 'VIP PRIVILEGE';
    this.modalTitle.textContent = 'The MOSQUITO Privilege Club';

    this.modalContent.innerHTML = `
      <div class="space-y-6 text-xs">
        <p class="text-neutral-600 leading-relaxed">
          Join an exclusive circle of sartorial enthusiasts. MOSQUITO Club members receive bespoke benefits, secret collection drop invites, and complimentary concierge access.
        </p>

        <!-- Perks Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div class="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1">
            <span class="text-emerald-700 font-bold font-mono">10% INSTANT PRIVILEGE</span>
            <div class="text-neutral-900 font-bold text-xs">Coupon Code: MOSQUITO10</div>
            <div class="text-[11px] text-neutral-500">Enjoy 10% off on all current and upcoming capsule orders.</div>
          </div>
          <div class="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1">
            <span class="text-amber-700 font-bold font-mono">24H RUNWAY ACCESS</span>
            <div class="text-neutral-900 font-bold text-xs">Secret Capsule Drops</div>
            <div class="text-[11px] text-neutral-500">Access limited edition drops 24 hours before public release.</div>
          </div>
        </div>

        <!-- 1-Click Join Form -->
        <div class="bg-neutral-900 text-white p-6 rounded-2xl space-y-4 shadow-xl">
          <div class="space-y-1">
            <h4 class="font-sans font-bold text-sm uppercase tracking-wider text-[#DFBD74]">Become a VIP Member (Free)</h4>
            <p class="text-xs text-neutral-400">Receive instant confirmation on WhatsApp with your member ID.</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <input type="text" id="vip-name" placeholder="Your Name" class="bg-neutral-800 border border-neutral-700 rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-[#DFBD74]" />
            <input type="tel" id="vip-phone" maxlength="10" placeholder="10-Digit Mobile Number" class="bg-neutral-800 border border-neutral-700 rounded-lg px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-[#DFBD74]" />
          </div>

          <button onclick="window.infoManager.joinVIPClub()" class="w-full py-3 bg-[#DFBD74] hover:bg-[#c9a65c] text-neutral-950 font-mono text-xs uppercase font-bold tracking-widest rounded-full transition-all shadow-md">
            Join VIP Privilege Club →
          </button>
        </div>
      </div>
    `;
  }

  joinVIPClub() {
    const name = document.getElementById('vip-name')?.value.trim() || 'VIP Member';
    const phone = document.getElementById('vip-phone')?.value.trim() || '9490751996';
    
    window.appManager.showToast(`✓ Welcome ${name}! Your 10% Privilege Code MOSQUITO10 is active.`);
    const waUrl = `https://wa.me/919490751996?text=${encodeURIComponent(`Hi MOSQUITO, please enroll me in the VIP Privilege Club. Name: ${name}, Mobile: ${phone}`)}`;
    setTimeout(() => {
      window.open(waUrl, '_blank');
      this.close();
    }, 1000);
  }

  /* ----------------------------------------------------
     10. PRIVACY POLICY
     ---------------------------------------------------- */
  renderPrivacyPolicy() {
    this.modalCategoryBadge.textContent = 'LEGAL & COMPLIANCE';
    this.modalTitle.textContent = 'Privacy & Data Protection Policy';

    this.modalContent.innerHTML = `
      <div class="space-y-4 text-xs text-neutral-700 leading-relaxed">
        <p>
          At <strong>MOSQUITO</strong>, we treat your personal privacy with the highest sartorial standard of integrity. This policy outlines how your data is collected, secured, and respected.
        </p>

        <div class="space-y-3">
          <div class="p-3.5 border border-neutral-200 rounded-xl bg-neutral-50">
            <h4 class="font-bold text-neutral-900 text-xs uppercase font-mono">1. Information We Collect</h4>
            <p class="text-neutral-600 text-[11px] mt-1">We collect your shipping name, delivery address, phone number for courier delivery OTP, and email for digital invoices.</p>
          </div>
          <div class="p-3.5 border border-neutral-200 rounded-xl bg-neutral-50">
            <h4 class="font-bold text-neutral-900 text-xs uppercase font-mono">2. 256-Bit SSL Bank-Grade Encryption</h4>
            <p class="text-neutral-600 text-[11px] mt-1">All payment transactions (UPI, Cards, NetBanking) are processed via PCI-DSS compliant gateways. MOSQUITO never stores your card or banking credentials.</p>
          </div>
          <div class="p-3.5 border border-neutral-200 rounded-xl bg-neutral-50">
            <h4 class="font-bold text-neutral-900 text-xs uppercase font-mono">3. Zero Third-Party Advertising Sharing</h4>
            <p class="text-neutral-600 text-[11px] mt-1">We never sell, lease, or monetize your contact information to external marketing brokers.</p>
          </div>
        </div>
      </div>
    `;
  }

  /* ----------------------------------------------------
     11. TERMS OF SERVICE
     ---------------------------------------------------- */
  renderTerms() {
    this.modalCategoryBadge.textContent = 'LEGAL & COMPLIANCE';
    this.modalTitle.textContent = 'Terms of Service & Guarantee';

    this.modalContent.innerHTML = `
      <div class="space-y-4 text-xs text-neutral-700 leading-relaxed">
        <p>
          By accessing and purchasing from <strong>MOSQUITO</strong>, you agree to our transparent terms designed to protect consumer authenticity and sartorial excellence.
        </p>

        <div class="space-y-3">
          <div class="p-3.5 border border-neutral-200 rounded-xl bg-neutral-50">
            <h4 class="font-bold text-neutral-900 text-xs uppercase font-mono">1. 100% Authentic Product Guarantee</h4>
            <p class="text-neutral-600 text-[11px] mt-1">Every garment sold on our platform is an authentic, original MOSQUITO design produced with genuine bio-washed fabrics.</p>
          </div>
          <div class="p-3.5 border border-neutral-200 rounded-xl bg-neutral-50">
            <h4 class="font-bold text-neutral-900 text-xs uppercase font-mono">2. All-Inclusive INR Pricing</h4>
            <p class="text-neutral-600 text-[11px] mt-1">All product prices displayed on the website are in Indian Rupees (INR) and include all applicable GST taxes. Free shipping is provided across India.</p>
          </div>
          <div class="p-3.5 border border-neutral-200 rounded-xl bg-neutral-50">
            <h4 class="font-bold text-neutral-900 text-xs uppercase font-mono">3. Order Fulfillment & Doorstep Inspection</h4>
            <p class="text-neutral-600 text-[11px] mt-1">Customers are protected by our 30-day doorstep exchange guarantee. If an item arrives damaged or incorrectly sized, replacement is initiated at zero expense.</p>
          </div>
        </div>
      </div>
    `;
  }

  /* ----------------------------------------------------
     12. SALE CAPSULE MODAL
     ---------------------------------------------------- */
  renderSale() {
    this.modalCategoryBadge.textContent = 'PROMOTIONAL CAPSULE';
    this.modalTitle.textContent = 'MOSQUITO Festive & Flash Sale';

    this.modalContent.innerHTML = `
      <div class="space-y-6 text-xs">
        <div class="p-5 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 text-white rounded-2xl border border-neutral-700 space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-[10px] font-mono uppercase tracking-widest text-[#DFBD74] font-bold">LIMITED TIME PRIVILEGE</span>
            <span class="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono">Live Now</span>
          </div>
          <h4 class="text-xl sm:text-2xl font-editorial font-light text-white leading-tight">
            Flat 10% Off on All Architectural Streetwear
          </h4>
          <p class="text-xs text-neutral-300">Apply promo code at checkout or click below to auto-apply.</p>

          <div class="flex items-center gap-3 pt-2">
            <div class="px-4 py-2 bg-neutral-800 border border-[#DFBD74]/40 rounded-lg font-mono text-sm text-[#DFBD74] font-bold tracking-widest select-all">
              MOSQUITO10
            </div>
            <button onclick="navigator.clipboard.writeText('MOSQUITO10'); window.appManager.showToast('Copied code MOSQUITO10 to clipboard!');" class="px-4 py-2 bg-[#DFBD74] text-neutral-950 rounded-lg font-mono text-xs uppercase font-bold hover:bg-[#c9a65c] transition-colors">
              Copy Code
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div class="p-3.5 border border-neutral-200 rounded-xl bg-neutral-50 text-center">
            <div class="font-bold text-neutral-900">Complimentary Shipping</div>
            <div class="text-[11px] text-neutral-500 mt-0.5">Air Express to 28,000+ Pincodes</div>
          </div>
          <div class="p-3.5 border border-neutral-200 rounded-xl bg-neutral-50 text-center">
            <div class="font-bold text-neutral-900">Cash on Delivery</div>
            <div class="text-[11px] text-neutral-500 mt-0.5">Zero Prepayment Required</div>
          </div>
          <div class="p-3.5 border border-neutral-200 rounded-xl bg-neutral-50 text-center">
            <div class="font-bold text-neutral-900">30-Day Exchanges</div>
            <div class="text-[11px] text-neutral-500 mt-0.5">Doorstep Pickup Included</div>
          </div>
        </div>

        <button onclick="window.infoManager.close(); document.getElementById('catalog-section')?.scrollIntoView({behavior:'smooth'});" class="w-full py-3.5 bg-neutral-900 hover:bg-black text-white rounded-full font-mono text-xs uppercase tracking-widest font-bold transition-all shadow-lg">
          Shop Ready-to-Wear Catalog →
        </button>
      </div>
    `;
  }

  /* ----------------------------------------------------
     13. WISHLIST MODAL
     ---------------------------------------------------- */
  renderWishlist() {
    this.modalCategoryBadge.textContent = 'YOUR CURATED COLLECTION';
    this.modalTitle.textContent = `Saved Wishlist Items (${window.appManager.wishlist.length})`;

    const items = window.appManager.wishlist.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);

    if (items.length === 0) {
      this.modalContent.innerHTML = `
        <div class="text-center py-12 space-y-4">
          <div class="w-16 h-16 mx-auto rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          </div>
          <h4 class="text-base font-bold text-neutral-900">Your Wishlist is Empty</h4>
          <p class="text-xs text-neutral-500 max-w-sm mx-auto">Explore our street couture editions and tap the heart icon to save your favorite garments.</p>
          <button onclick="window.infoManager.close(); document.getElementById('catalog-section')?.scrollIntoView({behavior:'smooth'});" class="px-6 py-2.5 bg-neutral-900 text-white rounded-full font-mono text-xs uppercase font-bold hover:bg-black transition-all">
            Browse Garments →
          </button>
        </div>
      `;
      return;
    }

    this.modalContent.innerHTML = `
      <div class="space-y-4">
        <div class="divide-y divide-neutral-200">
          ${items.map(p => `
            <div class="py-4 flex items-center justify-between gap-4">
              <div class="flex items-center gap-3.5">
                <img src="${p.imagePrimary}" alt="${p.name}" class="w-16 h-20 object-cover rounded-lg border border-neutral-200 bg-neutral-100 flex-shrink-0" />
                <div>
                  <div class="text-[10px] font-mono text-[#9E7831] uppercase tracking-wider font-bold">${p.edition}</div>
                  <h4 class="font-bold text-xs text-neutral-900 font-sans">${p.name}</h4>
                  <div class="font-mono text-xs font-bold text-neutral-900 mt-1">${p.priceFormatted}</div>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <button onclick="window.cartManager.addItem('${p.id}', '${p.sizes[0]}'); window.appManager.showToast('Added ${p.name} to Bag!');" class="px-3.5 py-2 bg-neutral-900 hover:bg-black text-white rounded-lg font-mono text-[11px] uppercase font-bold transition-all">
                  + Add to Bag
                </button>
                <button onclick="window.appManager.toggleWishlist('${p.id}'); window.infoManager.renderWishlist();" class="p-2 text-neutral-400 hover:text-rose-600 transition-colors" title="Remove">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="pt-4 border-t border-neutral-200 flex items-center justify-between">
          <button onclick="window.infoManager.close(); window.checkoutManager.open();" class="w-full py-3 bg-neutral-900 text-white rounded-full font-mono text-xs uppercase font-bold tracking-wider hover:bg-black transition-all">
            Proceed to Checkout →
          </button>
        </div>
      </div>
    `;
  }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
  window.infoManager = new InfoModalManager();
});
