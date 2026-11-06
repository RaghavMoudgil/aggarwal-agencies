/**
 * Aggarwal Agencies - Core Business & Wholesale Logic
 * Dual-environment module (Universal / UMD): works in Node.js test runner & browser
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.AggarwalLogic = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const STORE_DETAILS = {
    shopName: 'Aggarwal Agencies',
    ownerName: 'Mr. Vipin Aggarwal',
    phoneRaw: '9813387465',
    phoneFormatted: '+91 98133 87465',
    whatsappNumber: '919813387465',
    address: '12/X1, Ashok Vihar, Ghel, Ambala, Patti Kalalan, Haryana 134003',
    mapsUrl: 'https://maps.app.goo.gl/hXZymV7XEtPFGTzt6'
  };

  /**
   * Calculate wholesale tier, discount, estimated retailer margins, and dispatch SLA
   * @param {number|string} quantity - Order quantity in units
   * @param {string} [category] - Optional category name
   * @returns {Object} Tier calculation details
   */
  function calculateWholesaleTier(quantity, category = 'General Wholesale Mix') {
    let qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 0) {
      qty = 0;
    }

    let tierName = 'Silver Starter Lot';
    let discount = '15% Off Wholesale Price';
    let discountPct = 15;
    let estimatedMargin = '35% - 40%';
    let minMarginPct = 35;
    let maxMarginPct = 40;
    let dispatchDays = '48 Hours';

    if (qty >= 1000) {
      tierName = 'Diamond Super-Stockist';
      discount = '35% Extra Off Factory Price';
      discountPct = 35;
      estimatedMargin = '50% - 60%';
      minMarginPct = 50;
      maxMarginPct = 60;
      dispatchDays = 'Priority 24 Hours Express Freight';
    } else if (qty >= 500) {
      tierName = 'Platinum Wholesaler';
      discount = '28% Extra Off Factory Price';
      discountPct = 28;
      estimatedMargin = '45% - 52%';
      minMarginPct = 45;
      maxMarginPct = 52;
      dispatchDays = '24-36 Hours';
    } else if (qty >= 200) {
      tierName = 'Gold Bulk Retailer';
      discount = '22% Extra Off Factory Price';
      discountPct = 22;
      estimatedMargin = '40% - 45%';
      minMarginPct = 40;
      maxMarginPct = 45;
      dispatchDays = '24-48 Hours';
    } else {
      tierName = 'Silver Starter Lot';
      discount = '15% Off Wholesale Price';
      discountPct = 15;
      estimatedMargin = '35% - 40%';
      minMarginPct = 35;
      maxMarginPct = 40;
      dispatchDays = '48 Hours';
    }

    return {
      qty,
      category,
      tierName,
      discount,
      discountPct,
      estimatedMargin,
      minMarginPct,
      maxMarginPct,
      dispatchDays
    };
  }

  /**
   * Build pre-filled WhatsApp direct chat link
   * @param {Object} params
   * @returns {string} WhatsApp API URL
   */
  function buildWhatsAppUrl(params = {}) {
    const {
      phone = STORE_DETAILS.whatsappNumber,
      category = 'General Wholesale Mix',
      qty = 100,
      tierName = 'Silver Starter Lot'
    } = params;

    const cleanPhone = String(phone).replace(/\D/g, '');
    const message = [
      'Hello Aggarwal Agencies! I am interested in bulk ordering:',
      `• Category: ${category}`,
      `• Quantity: ${qty} units`,
      `• Tier: ${tierName}`,
      'Please share the wholesale price list and catalog for my store.'
    ].join('\n');

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  }

  /**
   * Validate contact / RFQ inquiry form data
   * @param {Object} data - Form fields { name, shopName, phone, city }
   * @returns {Object} { isValid: boolean, errors: Object }
   */
  function validateQuoteForm(data = {}) {
    const errors = {};

    if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
      errors.name = 'Please enter a valid contact name (at least 2 characters).';
    }

    if (!data.shopName || typeof data.shopName !== 'string' || data.shopName.trim().length < 2) {
      errors.shopName = 'Please enter your shop or business name.';
    }

    const rawPhone = String(data.phone || '').replace(/\D/g, '');
    // Indian phone numbers: 10 digits, or 12 digits starting with 91, or 11 digits starting with 0
    const isValidIndianPhone = /^(?:(?:\+?91)|0)?[6789]\d{9}$/.test(String(data.phone || '').trim());
    if (!isValidIndianPhone && rawPhone.length < 10) {
      errors.phone = 'Please enter a valid 10-digit mobile/WhatsApp number.';
    }

    if (!data.city || typeof data.city !== 'string' || data.city.trim().length < 2) {
      errors.city = 'Please enter your city and state for freight estimation.';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Theme switcher logic
   * @param {string} currentTheme - 'light' | 'dark'
   * @returns {string} Next theme 'light' | 'dark'
   */
  function getNextTheme(currentTheme) {
    return currentTheme === 'dark' ? 'light' : 'dark';
  }

  return {
    STORE_DETAILS,
    calculateWholesaleTier,
    buildWhatsAppUrl,
    validateQuoteForm,
    getNextTheme
  };
}));
