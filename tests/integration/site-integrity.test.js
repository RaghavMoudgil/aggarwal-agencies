/**
 * Integration & Site Integrity Test Suite
 * Validates index.html semantic markup, confirmed business data, asset paths, and accessibility.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '../../');
const INDEX_PATH = path.join(ROOT_DIR, 'index.html');
const STYLES_PATH = path.join(ROOT_DIR, 'styles.css');
const MAIN_JS_PATH = path.join(ROOT_DIR, 'main.js');
const CALC_JS_PATH = path.join(ROOT_DIR, 'js/calculator.js');
const OWNER_IMG_PATH = path.join(ROOT_DIR, 'images/owner.jpg');

describe('Aggarwal Agencies - Site Integrity & Integration Tests', () => {
  let htmlContent = '';

  it('should locate and read index.html', () => {
    assert.ok(fs.existsSync(INDEX_PATH), 'index.html must exist in workspace root');
    htmlContent = fs.readFileSync(INDEX_PATH, 'utf8');
    assert.ok(htmlContent.length > 5000, 'index.html should have full website content');
  });

  describe('1. Confirmed Real-World Business Information', () => {
    it('should display the confirmed Shop Name: "Aggarwal Agencies"', () => {
      assert.ok(
        htmlContent.includes('Aggarwal Agencies') || htmlContent.includes('AGGARWAL <span>AGENCIES</span>'),
        'Shop name "Aggarwal Agencies" must be present'
      );
    });

    it('should display the confirmed Owner Name: "Vipin Aggarwal"', () => {
      assert.ok(
        htmlContent.includes('Vipin Aggarwal'),
        'Owner name "Vipin Aggarwal" must be present'
      );
    });

    it('should display the confirmed Address in Ambala, Haryana', () => {
      assert.ok(htmlContent.includes('12/X1, Ashok Vihar'), 'Street address must be present');
      assert.ok(htmlContent.includes('Ambala'), 'City Ambala must be present');
      assert.ok(htmlContent.includes('Haryana'), 'State Haryana must be present');
      assert.ok(htmlContent.includes('134003'), 'Pin code 134003 must be present');
    });

    it('should have direct click-to-call and WhatsApp links with phone 9813387465', () => {
      assert.ok(htmlContent.includes('tel:+919813387465'), 'Click to call link must be present');
      assert.ok(htmlContent.includes('wa.me/919813387465'), 'WhatsApp wholesale link must be present');
      assert.ok(htmlContent.includes('98133 87465') || htmlContent.includes('9813387465'), 'Phone display text must be present');
    });

    it('should link directly to the confirmed Google Maps location', () => {
      assert.ok(
        htmlContent.includes('https://maps.app.goo.gl/hXZymV7XEtPFGTzt6'),
        'Google Maps short URL must be linked'
      );
    });

    it('should strictly preserve XXXXXX placeholders for unconfirmed fields', () => {
      assert.ok(htmlContent.includes('XXXXXX'), 'Unconfirmed fields must be marked as XXXXXX per strict user instructions');
    });
  });

  describe('2. Navigation & Anchor Integrity', () => {
    it('should verify all header anchor links point to existing section IDs', () => {
      const anchorRegex = /<a[^>]+href="#([a-zA-Z0-9_-]+)"/g;
      let match;
      const anchors = new Set();
      while ((match = anchorRegex.exec(htmlContent)) !== null) {
        anchors.add(match[1]);
      }

      assert.ok(anchors.size >= 5, 'Should find navigation anchor links');

      anchors.forEach(id => {
        const idRegex = new RegExp(`id=["']${id}["']`);
        assert.ok(
          idRegex.test(htmlContent),
          `Anchor target #${id} must correspond to an element with id="${id}" in index.html`
        );
      });
    });

    it('should verify every category tab filter button corresponds to matching category cards', () => {
      const buttonFilterMatches = [...htmlContent.matchAll(/data-filter="([^"]+)"/g)].map(m => m[1]);
      const cardCategoryMatches = new Set([...htmlContent.matchAll(/data-category="([^"]+)"/g)].map(m => m[1]));

      assert.ok(buttonFilterMatches.length >= 6, 'Should have multiple filter buttons');
      assert.ok(buttonFilterMatches.includes('all'), 'Should have "all" filter');

      buttonFilterMatches.forEach(filter => {
        if (filter !== 'all') {
          assert.ok(
            cardCategoryMatches.has(filter),
            `Category button for '${filter}' must have matching cards with data-category='${filter}'`
          );
        }
      });
    });
  });

  describe('3. Local Assets & File System Verification', () => {
    it('should have styles.css in root directory with valid size', () => {
      assert.ok(fs.existsSync(STYLES_PATH), 'styles.css must exist');
      const stats = fs.statSync(STYLES_PATH);
      assert.ok(stats.size > 10000, 'styles.css should have comprehensive styling');
    });

    it('should have main.js and js/calculator.js with valid size', () => {
      assert.ok(fs.existsSync(MAIN_JS_PATH), 'main.js must exist');
      assert.ok(fs.existsSync(CALC_JS_PATH), 'js/calculator.js must exist');
      assert.ok(fs.statSync(MAIN_JS_PATH).size > 1000, 'main.js should have content');
      assert.ok(fs.statSync(CALC_JS_PATH).size > 1000, 'js/calculator.js should have content');
    });

    it('should have images/owner.jpg with valid non-zero image size', () => {
      assert.ok(fs.existsSync(OWNER_IMG_PATH), 'images/owner.jpg must exist');
      const stats = fs.statSync(OWNER_IMG_PATH);
      assert.ok(stats.size > 5000, 'images/owner.jpg must be a valid image file');
    });
  });

  describe('4. Accessibility & Best Practices', () => {
    it('should have lang attribute on html tag', () => {
      assert.match(htmlContent, /<html\s+lang=["']en["']/i);
    });

    it('should have responsive viewport meta tag', () => {
      assert.match(htmlContent, /<meta\s+name=["']viewport["']/i);
    });

    it('should ensure all <img> tags have alt attributes', () => {
      const imgTags = htmlContent.match(/<img[^>]*>/g) || [];
      assert.ok(imgTags.length > 0, 'There should be images in the document');
      imgTags.forEach(tag => {
        assert.match(tag, /alt=["'][^"']*["']/i, `Image tag must have alt attribute: ${tag}`);
      });
    });

    it('should have embedded or linked toy favicon', () => {
      assert.match(htmlContent, /rel=["'](?:shortcut\s+)?icon["']/i, 'Favicon link must exist');
    });
  });

});
