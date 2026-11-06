/**
 * CSS Styling & Regression Prevention Tests
 * Ensures theme variables, layout rules, and responsiveness fixes stay protected against regressions.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const STYLES_PATH = path.resolve(__dirname, '../../styles.css');

describe('Aggarwal Agencies - CSS & Regression Prevention Tests', () => {
  let css = '';

  it('should load styles.css successfully', () => {
    assert.ok(fs.existsSync(STYLES_PATH), 'styles.css must exist');
    css = fs.readFileSync(STYLES_PATH, 'utf8');
    assert.ok(css.length > 10000, 'styles.css must have content');
  });

  describe('1. Color & Theming Tokens', () => {
    it('should define root variables for light theme', () => {
      assert.ok(css.includes(':root'), ':root block must exist');
      assert.ok(css.includes('--primary:'), '--primary color token must be defined');
      assert.ok(css.includes('--accent:'), '--accent color token must be defined');
      assert.ok(css.includes('--bg-main:'), '--bg-main background token must be defined');
      assert.ok(css.includes('--text-main:'), '--text-main text token must be defined');
    });

    it('should define dark theme overrides for [data-theme="dark"]', () => {
      assert.ok(css.includes('[data-theme="dark"]'), '[data-theme="dark"] block must exist');
      assert.ok(css.includes('--bg-main: #060b18') || css.includes('--bg-main:'), 'dark theme --bg-main must be defined');
      assert.ok(css.includes('--text-main: #f8fafc') || css.includes('--text-main:'), 'dark theme --text-main must be defined');
    });
  });

  describe('2. Navbar & Header Anti-Regression Rules', () => {
    it('should strictly hide .mobile-cta-row by default on desktop', () => {
      // Regression guard: prevents duplicate Catalog & WhatsApp buttons from showing in desktop nav
      assert.match(
        css,
        /\.mobile-cta-row\s*\{[^}]*display:\s*none\s*!important/i,
        'mobile-cta-row MUST be hidden with display: none !important on desktop'
      );
    });

    it('should enforce white-space: nowrap on .nav-link to prevent vertical stacked wrapping', () => {
      assert.match(
        css,
        /\.nav-link\s*\{[^}]*white-space:\s*nowrap/i,
        '.nav-link MUST have white-space: nowrap to prevent 4-line wrapping'
      );
    });
  });

  describe('3. Category Card Filter Integrity', () => {
    it('should NOT force display: flex !important on .category-card (allows tab filtering)', () => {
      assert.doesNotMatch(
        css,
        /\.category-card\s*\{[^}]*display:\s*flex\s*!important/i,
        '.category-card must not have display: flex !important so filtering can hide unselected categories'
      );
    });

    it('should define .category-card.is-hidden with display: none !important', () => {
      assert.match(
        css,
        /\.category-card\.is-hidden\s*\{[^}]*display:\s*none\s*!important/i,
        '.category-card.is-hidden must be display: none !important'
      );
    });
  });

  describe('4. Responsive Media Queries', () => {
    it('should define tablet & mobile navigation collapse breakpoint at 992px', () => {
      assert.ok(
        css.includes('@media (max-width: 992px)'),
        '@media (max-width: 992px) breakpoint must exist for smooth navbar collapse'
      );
    });

    it('should define compact mobile optimizations at 768px', () => {
      assert.ok(
        css.includes('@media (max-width: 768px)'),
        '@media (max-width: 768px) breakpoint must exist'
      );
    });

    it('should define smartphone optimizations at 480px', () => {
      assert.ok(
        css.includes('@media (max-width: 480px)'),
        '@media (max-width: 480px) breakpoint must exist'
      );
    });
  });

});
