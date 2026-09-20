/**
 * MOSQUITO Ultra-User-Friendly Express Booking & Checkout Manager
 * Flow:
 * 1. Customer Details (Name, Phone, Email, Address, Pincode auto-lookup)
 * 2. Payment Gateway (Instant UPI/QR, COD, WhatsApp Concierge, Cards)
 * 3. Order Successful Screen (Minimal Order ID, Itemized summary, Print Receipt, WhatsApp Updates)
 */

class CheckoutManager {
  constructor() {
    this.currentStep = 1; // 1: Customer Details, 2: Payment Gateway, 3: Order Successful
    this.selectedPayment = 'upi'; // 'upi', 'cod', 'card', 'whatsapp'
    this.currentOrderNumber = null;
    this.orderTimestamp = null;
    
    // Initialize clean shipping data (no demo/inbuilt names)
    this.shippingData = {
      fullName: '',
      phone: '',
      email: '',
      address: '',
      pincode: '',
      city: '',
      state: '',
      country: 'India',
      saveInfo: true,
      whatsappUpdates: true
    };

    // Pre-indexed Indian Pincode Directory for Instant City & State Detection
    this.PINCODE_DIRECTORY = {
      '400': { city: 'Mumbai', state: 'Maharashtra' },
      '401': { city: 'Thane / Palghar', state: 'Maharashtra' },
      '411': { city: 'Pune', state: 'Maharashtra' },
      '421': { city: 'Kalyan / Dombivli', state: 'Maharashtra' },
      '110': { city: 'New Delhi', state: 'Delhi NCR' },
      '122': { city: 'Gurugram', state: 'Haryana' },
      '201': { city: 'Noida / Ghaziabad', state: 'Uttar Pradesh' },
      '560': { city: 'Bengaluru', state: 'Karnataka' },
      '570': { city: 'Mysuru', state: 'Karnataka' },
      '500': { city: 'Hyderabad', state: 'Telangana' },
      '600': { city: 'Chennai', state: 'Tamil Nadu' },
      '641': { city: 'Coimbatore', state: 'Tamil Nadu' },
      '700': { city: 'Kolkata', state: 'West Bengal' },
      '302': { city: 'Jaipur', state: 'Rajasthan' },
      '380': { city: 'Ahmedabad', state: 'Gujarat' },
      '395': { city: 'Surat', state: 'Gujarat' },
      '390': { city: 'Vadodara', state: 'Gujarat' },
      '226': { city: 'Lucknow', state: 'Uttar Pradesh' },
      '160': { city: 'Chandigarh', state: 'Punjab / Chandigarh' },
      '682': { city: 'Kochi / Ernakulam', state: 'Kerala' },
      '695': { city: 'Thiruvananthapuram', state: 'Kerala' },
      '452': { city: 'Indore', state: 'Madhya Pradesh' },
      '462': { city: 'Bhopal', state: 'Madhya Pradesh' },
      '440': { city: 'Nagpur', state: 'Maharashtra' },
      '800': { city: 'Patna', state: 'Bihar' },
      '781': { city: 'Guwahati', state: 'Assam' },
      '751': { city: 'Bhubaneswar', state: 'Odisha' },
      '517': { city: 'Tirupati', state: 'Andhra Pradesh' },
      '530': { city: 'Visakhapatnam', state: 'Andhra Pradesh' },
      '520': { city: 'Vijayawada', state: 'Andhra Pradesh' }
    };

    // Cache initial modal layout
    const cardContent = document.getElementById('checkout-card-content');
    if (cardContent) {
      this.initialModalHTML = cardContent.innerHTML;
    }

    this.initEventListeners();
  }

  initEventListeners() {
    // Open Checkout Trigger buttons
    document.querySelectorAll('[data-action="open-checkout"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openCheckoutModal();
      });
    });

    // Close Checkout Trigger buttons
    document.querySelectorAll('[data-action="close-checkout"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeCheckoutModal();
      });
    });

    // Modal Backdrop click to close
    const backdrop = document.getElementById('checkout-modal-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) this.closeCheckoutModal();
      });
    }

    // Step navigation buttons
    const nextBtn = document.getElementById('checkout-next-btn');
    const backBtn = document.getElementById('checkout-back-btn');
    if (nextBtn) nextBtn.addEventListener('click', () => this.handleNextStep());
    if (backBtn) backBtn.addEventListener('click', () => this.handlePrevStep());

    // Pincode auto-lookup input
    const pincodeInput = document.getElementById('ship-pincode');
    if (pincodeInput) {
      pincodeInput.addEventListener('input', (e) => {
        const pin = e.target.value.replace(/\D/g, '').substring(0, 6);
        e.target.value = pin;
        this.detectPincodeCityState(pin);
      });
    }

    // Mobile Number auto-formatting
    const phoneInput = document.getElementById('ship-phone');
    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.startsWith('91')) val = val.substring(2);
        val = val.substring(0, 10);
        e.target.value = val;
      });
    }

    // Payment method cards
    document.querySelectorAll('.payment-method-card').forEach(card => {
      card.addEventListener('click', () => {
        const method = card.getAttribute('data-payment-method');
        this.selectPaymentMethod(method);
      });
    });

    // Credit Card formatting
    const cardNum = document.getElementById('card-number-input');
    if (cardNum) {
      cardNum.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '').substring(0, 16);
        let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
        e.target.value = formatted;
        const preview = document.getElementById('card-preview-number');
        if (preview) preview.textContent = formatted || '•••• •••• •••• ••••';
      });
    }

    const cardHolder = document.getElementById('card-holder-input');
    if (cardHolder) {
      cardHolder.addEventListener('input', (e) => {
        const preview = document.getElementById('card-preview-name');
        if (preview) preview.textContent = e.target.value.toUpperCase() || 'CARDHOLDER NAME';
      });
    }

    const cardExp = document.getElementById('card-expiry-input');
    if (cardExp) {
      cardExp.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '').substring(0, 4);
        if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2, 4);
        e.target.value = val;
        const preview = document.getElementById('card-preview-expiry');
        if (preview) preview.textContent = val || 'MM/YY';
      });
    }

    // Coupon code in checkout sidebar
    const checkoutPromoBtn = document.getElementById('checkout-apply-promo-btn');
    const checkoutPromoInput = document.getElementById('checkout-promo-input');
    if (checkoutPromoBtn && checkoutPromoInput) {
      checkoutPromoBtn.addEventListener('click', () => {
        window.cartManager.applyPromoCode(checkoutPromoInput.value.trim().toUpperCase());
        this.renderSidebarSummary();
      });
    }
  }

  detectPincodeCityState(pincode) {
    if (pincode.length >= 3) {
      const prefix = pincode.substring(0, 3);
      const match = this.PINCODE_DIRECTORY[prefix];
      const cityInput = document.getElementById('ship-city');
      const stateInput = document.getElementById('ship-state');
      const badge = document.getElementById('pincode-status-badge');

      if (match) {
        if (cityInput && (!cityInput.value || cityInput.dataset.autoFilled === 'true')) {
          cityInput.value = match.city;
          cityInput.dataset.autoFilled = 'true';
        }
        if (stateInput && (!stateInput.value || stateInput.dataset.autoFilled === 'true')) {
          stateInput.value = match.state;
          stateInput.dataset.autoFilled = 'true';
        }
        if (badge) {
          badge.innerHTML = `✓ Domestic Express Delivery Available to <span class="font-semibold text-neutral-900">${match.city}, ${match.state}</span>`;
          badge.className = 'text-[11px] text-emerald-700 font-medium mt-1.5 flex items-center gap-1';
          badge.classList.remove('hidden');
        }
      } else if (pincode.length === 6) {
        if (badge) {
          badge.innerHTML = `✓ Domestic Express Delivery Available across India (2-3 Days)`;
          badge.className = 'text-[11px] text-emerald-700 font-medium mt-1.5 flex items-center gap-1';
          badge.classList.remove('hidden');
        }
      }
    }
  }

  copyUPIId() {
    const upiId = 'pay@mosquito';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(upiId);
      if (window.appManager) {
        window.appManager.showToast(`UPI ID "${upiId}" copied to clipboard! Open your UPI App to pay.`);
      }
    }
  }

  copyOrderId(id) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(id);
      if (window.appManager) {
        window.appManager.showToast(`Order ID #${id} copied to clipboard!`);
      }
    }
  }

  selectPaymentMethod(method) {
    this.selectedPayment = method;
    document.querySelectorAll('.payment-method-card').forEach(card => {
      const isTarget = card.getAttribute('data-payment-method') === method;
      card.classList.toggle('active', isTarget);
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = isTarget;
    });

    // Toggle Panels
    const upiPanel = document.getElementById('payment-panel-upi');
    const codPanel = document.getElementById('payment-panel-cod');
    const cardPanel = document.getElementById('payment-panel-card');
    const whatsappPanel = document.getElementById('payment-panel-whatsapp');

    if (upiPanel) upiPanel.classList.toggle('hidden', method !== 'upi');
    if (codPanel) codPanel.classList.toggle('hidden', method !== 'cod');
    if (cardPanel) cardPanel.classList.toggle('hidden', method !== 'card');
    if (whatsappPanel) whatsappPanel.classList.toggle('hidden', method !== 'whatsapp');

    // Update bottom action button text
    const nextBtn = document.getElementById('checkout-next-btn');
    if (nextBtn && this.currentStep === 2) {
      const totals = window.cartManager.getTotals();
      if (method === 'whatsapp') {
        nextBtn.innerHTML = `<span>Book via WhatsApp (${window.cartManager.formatPrice(totals.totalINR)})</span>`;
        nextBtn.className = 'px-8 py-3.5 bg-emerald-600 text-white rounded-full text-xs uppercase tracking-widest font-bold hover:bg-emerald-700 transition-all flex items-center shadow-lg gap-2';
      } else if (method === 'cod') {
        nextBtn.innerHTML = `<span>Confirm Cash on Delivery (${window.cartManager.formatPrice(totals.totalINR)})</span>`;
        nextBtn.className = 'px-8 py-3.5 bg-neutral-900 text-white rounded-full text-xs uppercase tracking-widest font-bold hover:bg-black transition-all flex items-center shadow-lg gap-2';
      } else {
        nextBtn.innerHTML = `<span>Pay & Confirm Order (${window.cartManager.formatPrice(totals.totalINR)})</span>`;
        nextBtn.className = 'px-8 py-3.5 bg-neutral-900 text-white rounded-full text-xs uppercase tracking-widest font-bold hover:bg-black transition-all flex items-center shadow-lg gap-2';
      }
    }
  }

  instantBuyProduct(productId, size, colorName, fit) {
    // Add item to bag
    window.cartManager.addItem(productId, size, colorName, fit);
    window.cartManager.closeDrawer();
    this.openCheckoutModal();
  }

  openCheckoutModal() {
    if (window.cartManager.items.length === 0) {
      if (window.appManager) {
        window.appManager.showToast('Your bag is currently empty. Please select an item.');
      }
      return;
    }

    const cardContent = document.getElementById('checkout-card-content');
    if (cardContent && this.initialModalHTML && this.currentStep === 3) {
      cardContent.className = 'grid grid-cols-1 lg:grid-cols-12 min-h-[480px]';
      cardContent.innerHTML = this.initialModalHTML;
      this.initEventListeners();
    }

    this.currentStep = 1;
    this.populateSavedFormFields();
    this.updateStepUI();
    this.renderSidebarSummary();
    this.selectPaymentMethod(this.selectedPayment);

    const container = document.getElementById('checkout-modal-backdrop');
    if (container) {
      container.style.display = 'flex';
      container.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeCheckoutModal() {
    const container = document.getElementById('checkout-modal-backdrop');
    if (container) {
      container.classList.remove('active');
      container.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  populateSavedFormFields() {
    const nameEl = document.getElementById('ship-name');
    const phoneEl = document.getElementById('ship-phone');
    const emailEl = document.getElementById('ship-email');
    const addressEl = document.getElementById('ship-address');
    const pinEl = document.getElementById('ship-pincode');
    const cityEl = document.getElementById('ship-city');
    const stateEl = document.getElementById('ship-state');

    if (nameEl) nameEl.value = this.shippingData.fullName || '';
    if (phoneEl) phoneEl.value = this.shippingData.phone || '';
    if (emailEl) emailEl.value = this.shippingData.email || '';
    if (addressEl) addressEl.value = this.shippingData.address || '';
    if (pinEl) {
      pinEl.value = this.shippingData.pincode || '';
      if (this.shippingData.pincode) this.detectPincodeCityState(this.shippingData.pincode);
    }
    if (cityEl) cityEl.value = this.shippingData.city || '';
    if (stateEl) stateEl.value = this.shippingData.state || '';
  }

  saveFormInputsToState() {
    const name = document.getElementById('ship-name')?.value.trim() || '';
    const phone = document.getElementById('ship-phone')?.value.trim() || '';
    const email = document.getElementById('ship-email')?.value.trim() || '';
    const address = document.getElementById('ship-address')?.value.trim() || '';
    const pincode = document.getElementById('ship-pincode')?.value.trim() || '';
    const city = document.getElementById('ship-city')?.value.trim() || '';
    const state = document.getElementById('ship-state')?.value.trim() || '';
    const saveCheckbox = document.getElementById('ship-save-address')?.checked ?? true;

    this.shippingData = {
      fullName: name,
      phone: phone,
      email: email,
      address: address,
      pincode: pincode,
      city: city,
      state: state,
      country: 'India',
      saveInfo: saveCheckbox,
      whatsappUpdates: document.getElementById('ship-whatsapp-optin')?.checked ?? true
    };

    if (saveCheckbox && name && phone && address) {
      localStorage.setItem('mosquito_saved_address', JSON.stringify(this.shippingData));
    }
  }

  handleNextStep() {
    this.saveFormInputsToState();

    if (this.currentStep === 1) {
      // Validate Step 1 (Customer Details)
      if (!this.shippingData.fullName) {
        if (window.appManager) window.appManager.showToast('Please enter your full name.');
        document.getElementById('ship-name')?.focus();
        return;
      }

      if (!this.shippingData.phone || this.shippingData.phone.length < 10) {
        if (window.appManager) window.appManager.showToast('Please enter a valid 10-digit mobile number for delivery OTP.');
        document.getElementById('ship-phone')?.focus();
        return;
      }

      if (!this.shippingData.address) {
        if (window.appManager) window.appManager.showToast('Please provide your complete delivery address.');
        document.getElementById('ship-address')?.focus();
        return;
      }

      if (!this.shippingData.pincode || this.shippingData.pincode.length < 6) {
        if (window.appManager) window.appManager.showToast('Please enter a valid 6-digit Indian Pincode.');
        document.getElementById('ship-pincode')?.focus();
        return;
      }

      // Transition to Step 2: Payment Gateway
      this.currentStep = 2;
      this.updateStepUI();
      this.selectPaymentMethod(this.selectedPayment);
    } else if (this.currentStep === 2) {
      // Execute payment and move to Step 3: Order Successful
      if (this.selectedPayment === 'whatsapp') {
        this.executeWhatsAppBooking();
      } else {
        this.executeOrderPlacement();
      }
    }
  }

  handlePrevStep() {
    if (this.currentStep === 2) {
      this.currentStep = 1;
      this.updateStepUI();
    }
  }

  goToStep(stepNumber) {
    if (stepNumber === 1) {
      this.currentStep = 1;
      this.updateStepUI();
    } else if (stepNumber === 2) {
      this.handleNextStep();
    }
  }

  updateStepUI() {
    // Toggle Step Sections
    const step1Section = document.getElementById('checkout-step-1');
    const step2Section = document.getElementById('checkout-step-2');
    const tab1Btn = document.getElementById('step-tab-1');
    const tab2Btn = document.getElementById('step-tab-2');
    const tab3Btn = document.getElementById('step-tab-3');

    if (step1Section) step1Section.classList.toggle('hidden', this.currentStep !== 1);
    if (step2Section) step2Section.classList.toggle('hidden', this.currentStep !== 2);

    if (tab1Btn) {
      tab1Btn.classList.toggle('active', this.currentStep === 1);
      tab1Btn.classList.toggle('completed', this.currentStep >= 2);
    }
    if (tab2Btn) {
      tab2Btn.classList.toggle('active', this.currentStep === 2);
      tab2Btn.classList.toggle('completed', this.currentStep === 3);
    }
    if (tab3Btn) {
      tab3Btn.classList.toggle('active', this.currentStep === 3);
    }

    // Step footer buttons
    const backBtn = document.getElementById('checkout-back-btn');
    const nextBtn = document.getElementById('checkout-next-btn');

    if (backBtn) {
      backBtn.classList.toggle('invisible', this.currentStep === 1);
    }

    if (nextBtn) {
      if (this.currentStep === 1) {
        nextBtn.innerHTML = `<span>Next</span> <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>`;
        nextBtn.className = 'px-9 py-3.5 bg-neutral-950 text-white rounded-full text-xs uppercase tracking-widest font-bold hover:bg-black transition-all flex items-center shadow-lg gap-2 cursor-pointer';
      } else {
        this.selectPaymentMethod(this.selectedPayment);
      }
    }
  }

  renderSidebarSummary() {
    const listEl = document.getElementById('checkout-sidebar-items');
    const countEl = document.getElementById('checkout-sidebar-count');
    const subtotalEl = document.getElementById('checkout-subtotal-val');
    const discountEl = document.getElementById('checkout-discount-val');
    const discountRow = document.getElementById('checkout-discount-row');
    const totalEl = document.getElementById('checkout-total-val');

    if (!listEl) return;

    const items = window.cartManager.items;
    const totals = window.cartManager.getTotals();

    if (countEl) countEl.textContent = `${items.length} ${items.length === 1 ? 'Item' : 'Items'}`;

    listEl.innerHTML = items.map((item, idx) => `
      <div class="flex items-center gap-3 py-3 border-b border-neutral-100 last:border-0 text-xs">
        <div class="w-14 h-16 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0 border border-neutral-200">
          <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover"/>
        </div>
        <div class="flex-1 min-w-0">
          <h5 class="font-bold text-neutral-900 truncate uppercase text-[11px]">${item.name}</h5>
          <div class="text-neutral-500 text-[11px] mt-0.5">Size: <span class="font-semibold text-neutral-800">${item.size}</span> • ${item.category}</div>
          
          <!-- Quantity Stepper -->
          <div class="flex items-center gap-2 mt-2">
            <div class="inline-flex items-center border border-neutral-200 rounded-md bg-white">
              <button onclick="window.cartManager.updateQuantity(${idx}, -1); checkoutManager.renderSidebarSummary(); checkoutManager.updateStepUI();" class="px-2 py-0.5 hover:bg-neutral-100 text-neutral-600 font-bold">−</button>
              <span class="px-2 font-mono text-xs font-semibold text-neutral-900">${item.quantity}</span>
              <button onclick="window.cartManager.updateQuantity(${idx}, 1); checkoutManager.renderSidebarSummary(); checkoutManager.updateStepUI();" class="px-2 py-0.5 hover:bg-neutral-100 text-neutral-600 font-bold">+</button>
            </div>
            <button onclick="window.cartManager.removeItem(${idx}); checkoutManager.renderSidebarSummary(); checkoutManager.updateStepUI();" class="text-neutral-400 hover:text-red-500 text-[11px] ml-2" title="Remove Item">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </div>
        <div class="text-right">
          <div class="font-mono font-bold text-neutral-900 text-xs">
            ${window.cartManager.formatPrice(item.priceINR * item.quantity)}
          </div>
        </div>
      </div>
    `).join('');

    if (subtotalEl) subtotalEl.textContent = window.cartManager.formatPrice(totals.subtotalINR);
    if (discountRow && discountEl) {
      if (totals.discountINR > 0) {
        discountRow.classList.remove('hidden');
        discountEl.textContent = `-${window.cartManager.formatPrice(totals.discountINR)}`;
      } else {
        discountRow.classList.add('hidden');
      }
    }
    if (totalEl) totalEl.textContent = window.cartManager.formatPrice(totals.totalINR);
  }

  executeWhatsAppBooking() {
    const orderNum = 'MSQ-' + Math.floor(1000 + Math.random() * 9000);
    this.currentOrderNumber = orderNum;
    this.orderTimestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });
    
    const totals = window.cartManager.getTotals();
    const items = window.cartManager.items;

    const itemListText = items.map(i => `• ${i.name} (Size: ${i.size}, Qty: ${i.quantity}) - Rs. ${i.priceINR * i.quantity}`).join('\n');
    const message = `Hello MOSQUITO Concierge,\nI would like to confirm my order:\n\n*Order ID*: #${orderNum}\n*Customer*: ${this.shippingData.fullName}\n*Phone*: +91 ${this.shippingData.phone}\n*Address*: ${this.shippingData.address}, ${this.shippingData.city} - ${this.shippingData.pincode}, ${this.shippingData.state}\n\n*Garments*:\n${itemListText}\n\n*Total Amount*: ${window.cartManager.formatPrice(totals.totalINR)} (Free Air Express Shipping Included)\n\nPlease confirm my dispatch!`;

    const encodedMsg = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919490751996?text=${encodedMsg}`;

    window.open(whatsappUrl, '_blank');
    this.showConfirmationView(orderNum, 'WhatsApp Booking Concierge');
  }

  executeOrderPlacement() {
    const nextBtn = document.getElementById('checkout-next-btn');
    if (nextBtn) {
      nextBtn.disabled = true;
      nextBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Processing Payment...</span>
      `;
    }

    setTimeout(() => {
      const orderNum = 'MSQ-' + Math.floor(1000 + Math.random() * 9000);
      this.currentOrderNumber = orderNum;
      this.orderTimestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });
      
      const paymentLabels = {
        upi: 'Instant UPI / QR (GPay, PhonePe, Paytm, CRED)',
        cod: 'Cash on Delivery (Verified Doorstep Pay)',
        card: 'Credit / Debit Card (RuPay, Visa, MasterCard)',
        whatsapp: 'WhatsApp Stylist Concierge'
      };
      this.showConfirmationView(orderNum, paymentLabels[this.selectedPayment] || 'Verified Gateway Payment');
    }, 900);
  }

  showConfirmationView(orderNum, paymentMethodLabel) {
    this.currentStep = 3;
    const totals = window.cartManager.getTotals();
    const totalFormatted = window.cartManager.formatPrice(totals.totalINR);
    const itemsSnapshot = [...window.cartManager.items];
    const cleanOrderId = orderNum.replace('#', '');
    const fullOrderId = orderNum.startsWith('#') ? orderNum : '#' + orderNum;
    const randomTxn = 'TXN-' + Math.floor(10000000 + Math.random() * 90000000);
    const randomBarcode = '890' + Math.floor(100000000 + Math.random() * 900000000);

    // Keep Tab Bar visible and update to show step 3 active
    this.updateStepUI();

    const modalBody = document.getElementById('checkout-card-content');
    if (modalBody) {
      modalBody.className = 'p-6 sm:p-10 bg-[#F8F8F6] max-h-[85vh] overflow-y-auto';
      modalBody.innerHTML = `
        <!-- Printable Minimal Receipt Container -->
        <div id="printable-receipt-area" class="max-w-2xl mx-auto space-y-6">
          
          <!-- Success Header (Screen only animation) -->
          <div class="text-center space-y-3 pb-2 no-print">
            <div class="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md ring-8 ring-emerald-50 animate-bounce">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-mono font-semibold uppercase tracking-wider">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Payment Verified • Order Confirmed</span>
            </div>

            <h2 class="text-2xl sm:text-3xl font-brand font-bold text-neutral-950 leading-tight">
              Thank You For Your Order!
            </h2>
            <p class="text-neutral-600 text-xs max-w-md mx-auto">
              Thank you, <strong class="text-neutral-900">${this.shippingData.fullName || 'Customer'}</strong>. Your garments are booked and prepared for complimentary domestic express dispatch.
            </p>

            <!-- Minimal Clean Order ID Badge -->
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-neutral-800 border border-neutral-200 shadow-xs">
              <span class="font-mono text-xs uppercase font-bold tracking-wider">ORDER ID: ${fullOrderId}</span>
              <button onclick="window.checkoutManager.copyOrderId('${cleanOrderId}')" class="text-neutral-400 hover:text-black font-mono text-[10px] ml-1 uppercase font-semibold cursor-pointer" title="Copy Order ID">Copy</button>
            </div>
          </div>

          <!-- Luxury Tax Invoice Receipt Card -->
          <div class="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm text-xs relative overflow-hidden">
            <!-- Top Gold Accent Bar -->
            <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-emerald-500 to-amber-500"></div>

            <!-- Receipt Top Header -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-neutral-200 pb-5">
              <div>
                <h3 class="font-sans font-black text-lg tracking-[0.18em] text-neutral-950 uppercase">MOSQUITO</h3>
                <span class="font-mono text-[10px] text-neutral-500 tracking-wider uppercase block mt-0.5">Official Tax Invoice & Dispatch Manifest</span>
                <span class="text-[9px] text-neutral-400 font-mono">GSTIN: 37AAECM9482J1Z8</span>
              </div>
              <div class="text-left sm:text-right font-mono text-[11px] text-neutral-600">
                <div>Order: <strong class="text-neutral-950 font-bold">${fullOrderId}</strong></div>
                <div class="text-neutral-400 text-[10px] mt-0.5">${this.orderTimestamp || 'Today, IST'}</div>
                <div class="text-[10px] text-emerald-700 font-bold uppercase mt-0.5">✓ PAID IN FULL</div>
              </div>
            </div>

            <!-- 3-Column Summary Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 border-b border-neutral-200 pb-5 text-xs">
              <div class="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-100">
                <span class="font-mono uppercase text-[9px] text-neutral-400 block font-bold tracking-wider">Billed & Shipped To</span>
                <div class="font-bold text-neutral-950 mt-1">${this.shippingData.fullName || 'Customer'}</div>
                <div class="text-neutral-600 text-[11px] mt-0.5">${this.shippingData.address || 'Address provided'}</div>
                <div class="text-neutral-600 text-[11px]">${this.shippingData.city} - ${this.shippingData.pincode}, ${this.shippingData.state}</div>
                <div class="text-neutral-500 font-mono text-[10px] mt-1">Phone: +91 ${this.shippingData.phone}</div>
              </div>

              <div class="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-100">
                <span class="font-mono uppercase text-[9px] text-neutral-400 block font-bold tracking-wider">Delivery & Logistics</span>
                <div class="font-semibold text-emerald-800 mt-1">Air Express (2-3 Days)</div>
                <div class="text-neutral-600 text-[11px] mt-0.5">Carrier: BlueDart / Delhivery</div>
                <div class="text-neutral-500 font-mono text-[10px] mt-1">Status: Active & Queued</div>
              </div>

              <div class="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-100">
                <span class="font-mono uppercase text-[9px] text-neutral-400 block font-bold tracking-wider">Payment Details</span>
                <div class="inline-block px-2 py-0.5 bg-neutral-900 text-white rounded font-mono text-[9px] font-bold mt-1 uppercase">VERIFIED</div>
                <div class="text-neutral-700 text-[11px] font-medium mt-1">${paymentMethodLabel}</div>
                <div class="text-neutral-500 font-mono text-[10px] mt-0.5">Txn: ${randomTxn}</div>
              </div>
            </div>

            <!-- Items Breakdown Table -->
            <div class="space-y-2.5">
              <div class="font-mono uppercase text-[10px] text-neutral-400 font-bold">Purchased Garments (${itemsSnapshot.length})</div>
              <div class="divide-y divide-neutral-150 border border-neutral-200 rounded-2xl overflow-hidden bg-white">
                ${itemsSnapshot.map(item => `
                  <div class="p-3.5 flex items-center justify-between gap-3 hover:bg-neutral-50/50">
                    <div class="flex items-center gap-3 min-w-0">
                      <img src="${item.image}" alt="${item.name}" class="w-11 h-13 object-cover rounded-lg border border-neutral-200 no-print flex-shrink-0" onerror="this.src='/assets/logo.svg'" />
                      <div class="min-w-0">
                        <div class="font-bold text-neutral-950 uppercase text-xs truncate">${item.name}</div>
                        <div class="text-[11px] text-neutral-500 mt-0.5">
                          Size: <strong class="text-neutral-800">${item.size}</strong> • Qty: <strong class="text-neutral-800">${item.quantity}</strong>
                        </div>
                      </div>
                    </div>
                    <div class="font-mono text-xs font-bold text-neutral-950 text-right flex-shrink-0">
                      ${window.cartManager.formatPrice(item.priceINR * item.quantity)}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Total Price Calculation -->
            <div class="bg-neutral-50 p-4.5 rounded-2xl border border-neutral-200 space-y-2 font-mono text-xs">
              <div class="flex justify-between text-neutral-600">
                <span>Garment Subtotal:</span>
                <span class="text-neutral-900 font-semibold">${window.cartManager.formatPrice(totals.subtotalINR)}</span>
              </div>
              ${totals.discountINR > 0 ? `
                <div class="flex justify-between text-emerald-700 font-semibold">
                  <span>Privilege Coupon Discount (10%):</span>
                  <span>-${window.cartManager.formatPrice(totals.discountINR)}</span>
                </div>
              ` : ''}
              <div class="flex justify-between text-neutral-600">
                <span>Domestic Air Shipping:</span>
                <span class="text-emerald-700 font-bold uppercase">FREE</span>
              </div>
              <div class="flex justify-between text-neutral-500 text-[11px]">
                <span>Taxes & GST (Included):</span>
                <span>0.00</span>
              </div>
              <div class="flex justify-between text-sm sm:text-base font-bold text-neutral-950 pt-2.5 border-t border-neutral-200">
                <span>Total Amount Paid:</span>
                <span>${totalFormatted}</span>
              </div>
            </div>

            <!-- Authenticity Guarantee & Barcode -->
            <div class="pt-3 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-neutral-500 font-mono">
              <div class="flex items-center gap-2">
                <span class="tracking-widest text-[9px] text-neutral-400">BARCODE: ${randomBarcode}</span>
              </div>
              <div class="text-center sm:text-right">
                <span class="font-bold text-neutral-800">100% Genuine MOSQUITO Quality</span> • <span>30-Day Doorstep Exchange</span>
              </div>
            </div>

          </div>

          <!-- Bottom Actions (Screen only) -->
          <div class="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3 no-print">
            <!-- Print Receipt Button -->
            <button onclick="window.print()" class="w-full sm:w-auto flex-1 px-6 py-3.5 bg-white border border-neutral-300 text-neutral-900 rounded-full font-mono text-xs uppercase font-bold tracking-wider hover:bg-neutral-100 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
              <span>Print / Save Invoice</span>
            </button>

            <!-- WhatsApp Live Updates Button -->
            <a href="https://wa.me/919490751996?text=${encodeURIComponent(`Hi MOSQUITO Concierge, please send live courier dispatch updates for my Order ID ${fullOrderId}`)}" target="_blank" class="w-full sm:w-auto flex-1 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-mono text-xs uppercase font-bold tracking-wider transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
              <span>Get WhatsApp Updates</span>
            </a>

            <!-- Continue Shopping Button -->
            <button onclick="location.reload()" class="w-full sm:w-auto px-7 py-3.5 bg-neutral-950 hover:bg-black text-white rounded-full font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-md cursor-pointer">
              Continue Shopping
            </button>
          </div>

        </div>
      `;
    }

    // Clear Cart
    window.cartManager.items = [];
    window.cartManager.appliedPromo = null;
    window.cartManager.saveCart();
    window.cartManager.render();

    if (window.appManager) {
      window.appManager.showToast(`✓ Order #${orderNum} successfully placed!`);
    }
  }
}

// Global instance
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (!window.checkoutManager) window.checkoutManager = new CheckoutManager();
    });
  } else {
    window.checkoutManager = new CheckoutManager();
  }
}
