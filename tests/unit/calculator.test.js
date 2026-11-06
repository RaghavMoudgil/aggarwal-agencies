/**
 * Unit Tests for Aggarwal Agencies Business Logic
 * Powered by Node.js built-in test runner (node:test & node:assert)
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const logic = require('../../js/calculator.js');

describe('Aggarwal Agencies - Business Logic & Calculator Unit Tests', () => {

  describe('1. Store Information Constants', () => {
    it('should have verified store details', () => {
      assert.strictEqual(logic.STORE_DETAILS.shopName, 'Aggarwal Agencies');
      assert.strictEqual(logic.STORE_DETAILS.ownerName, 'Mr. Vipin Aggarwal');
      assert.strictEqual(logic.STORE_DETAILS.phoneRaw, '9813387465');
      assert.strictEqual(logic.STORE_DETAILS.whatsappNumber, '919813387465');
      assert.strictEqual(logic.STORE_DETAILS.address, '12/X1, Ashok Vihar, Ghel, Ambala, Patti Kalalan, Haryana 134003');
      assert.strictEqual(logic.STORE_DETAILS.mapsUrl, 'https://maps.app.goo.gl/hXZymV7XEtPFGTzt6');
    });
  });

  describe('2. Wholesale Tier Calculations & Boundaries', () => {
    it('should assign Silver Starter Lot for quantities < 200', () => {
      const res50 = logic.calculateWholesaleTier(50);
      assert.strictEqual(res50.tierName, 'Silver Starter Lot');
      assert.strictEqual(res50.discountPct, 15);
      assert.strictEqual(res50.minMarginPct, 35);
      assert.strictEqual(res50.maxMarginPct, 40);
      assert.strictEqual(res50.dispatchDays, '48 Hours');

      const res199 = logic.calculateWholesaleTier(199);
      assert.strictEqual(res199.tierName, 'Silver Starter Lot');
      assert.strictEqual(res199.discountPct, 15);
    });

    it('should assign Gold Bulk Retailer for quantities 200 - 499 (Boundary check)', () => {
      const res200 = logic.calculateWholesaleTier(200);
      assert.strictEqual(res200.tierName, 'Gold Bulk Retailer');
      assert.strictEqual(res200.discountPct, 22);
      assert.strictEqual(res200.minMarginPct, 40);
      assert.strictEqual(res200.maxMarginPct, 45);

      const res499 = logic.calculateWholesaleTier(499);
      assert.strictEqual(res499.tierName, 'Gold Bulk Retailer');
    });

    it('should assign Platinum Wholesaler for quantities 500 - 999 (Boundary check)', () => {
      const res500 = logic.calculateWholesaleTier(500);
      assert.strictEqual(res500.tierName, 'Platinum Wholesaler');
      assert.strictEqual(res500.discountPct, 28);
      assert.strictEqual(res500.minMarginPct, 45);
      assert.strictEqual(res500.maxMarginPct, 52);

      const res999 = logic.calculateWholesaleTier(999);
      assert.strictEqual(res999.tierName, 'Platinum Wholesaler');
    });

    it('should assign Diamond Super-Stockist for quantities >= 1000', () => {
      const res1000 = logic.calculateWholesaleTier(1000);
      assert.strictEqual(res1000.tierName, 'Diamond Super-Stockist');
      assert.strictEqual(res1000.discountPct, 35);
      assert.strictEqual(res1000.minMarginPct, 50);
      assert.strictEqual(res1000.maxMarginPct, 60);
      assert.strictEqual(res1000.dispatchDays, 'Priority 24 Hours Express Freight');

      const res5000 = logic.calculateWholesaleTier(5000);
      assert.strictEqual(res5000.tierName, 'Diamond Super-Stockist');
    });

    it('should safely handle string inputs and edge cases (0, negative, NaN)', () => {
      const resString = logic.calculateWholesaleTier('300');
      assert.strictEqual(resString.qty, 300);
      assert.strictEqual(resString.tierName, 'Gold Bulk Retailer');

      const resZero = logic.calculateWholesaleTier(0);
      assert.strictEqual(resZero.qty, 0);
      assert.strictEqual(resZero.tierName, 'Silver Starter Lot');

      const resNegative = logic.calculateWholesaleTier(-50);
      assert.strictEqual(resNegative.qty, 0);

      const resNaN = logic.calculateWholesaleTier('invalid');
      assert.strictEqual(resNaN.qty, 0);
    });
  });

  describe('3. WhatsApp Inquiry URL Builder', () => {
    it('should generate valid wa.me URL with encoded message', () => {
      const url = logic.buildWhatsAppUrl({
        category: 'RC & Die-Cast Vehicles',
        qty: 500,
        tierName: 'Platinum Wholesaler'
      });

      assert.match(url, /^https:\/\/wa\.me\/919813387465\?text=/);
      assert.ok(url.includes('RC%20%26%20Die-Cast%20Vehicles'));
      assert.ok(url.includes('500%20units'));
      assert.ok(url.includes('Platinum%20Wholesaler'));
    });

    it('should strip non-digits from phone number', () => {
      const url = logic.buildWhatsAppUrl({
        phone: '+91 (98133) 87465',
        qty: 100
      });
      assert.match(url, /^https:\/\/wa\.me\/919813387465/);
    });
  });

  describe('4. RFQ / Inquiry Form Validation', () => {
    it('should accept valid inquiry form data', () => {
      const result = logic.validateQuoteForm({
        name: 'Ramesh Gupta',
        shopName: 'Gupta Toy Mart',
        phone: '9813387465',
        city: 'Ambala, Haryana'
      });

      assert.strictEqual(result.isValid, true);
      assert.strictEqual(Object.keys(result.errors).length, 0);
    });

    it('should accept Indian numbers with +91 or 0 prefix', () => {
      const res1 = logic.validateQuoteForm({
        name: 'Anita Sharma',
        shopName: 'Kids Zone',
        phone: '+919813387465',
        city: 'Delhi'
      });
      assert.strictEqual(res1.isValid, true);

      const res2 = logic.validateQuoteForm({
        name: 'Anita Sharma',
        shopName: 'Kids Zone',
        phone: '09813387465',
        city: 'Delhi'
      });
      assert.strictEqual(res2.isValid, true);
    });

    it('should reject invalid or incomplete data', () => {
      const emptyResult = logic.validateQuoteForm({});
      assert.strictEqual(emptyResult.isValid, false);
      assert.ok(emptyResult.errors.name);
      assert.ok(emptyResult.errors.shopName);
      assert.ok(emptyResult.errors.phone);
      assert.ok(emptyResult.errors.city);

      const shortPhoneResult = logic.validateQuoteForm({
        name: 'John',
        shopName: 'Store',
        phone: '12345',
        city: 'Ambala'
      });
      assert.strictEqual(shortPhoneResult.isValid, false);
      assert.ok(shortPhoneResult.errors.phone);
    });
  });

  describe('5. Theme Toggle Logic', () => {
    it('should toggle theme between light and dark', () => {
      assert.strictEqual(logic.getNextTheme('light'), 'dark');
      assert.strictEqual(logic.getNextTheme('dark'), 'light');
      assert.strictEqual(logic.getNextTheme('other'), 'dark');
    });
  });

});
