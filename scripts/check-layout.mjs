import assert from 'node:assert/strict';
import { mkdir, writeFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
if (!process.env.PLAYWRIGHT_BROWSERS_PATH && existsSync('.browser-cache')) process.env.PLAYWRIGHT_BROWSERS_PATH = new URL('../.browser-cache', import.meta.url).pathname.replace(/^\/([A-Z]:)/i, '$1');
const { chromium } = await import('@playwright/test');

await mkdir('test-results', { recursive: true });
const browser = await chromium.launch({ headless: true, timeout: 30000, ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {}), ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}) });
const results = [];
for (const width of [280, 320, 390, 600, 768, 1000, 1001, 1280, 1728, 2560, 3840]) {
  const page = await browser.newPage({ viewport: { width, height: 1000 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  console.log(`Loaded ${width}px`);
  await page.locator('img[loading="lazy"]').evaluateAll(images => images.forEach(img => img.loading = 'eager'));
  await page.waitForFunction(() => [...document.images].every(img => img.complete));
  await page.screenshot({ path: `test-results/fundora-${width}.png`, fullPage: true });
  console.log(`Assets loaded ${width}px`);
  assert.equal(await page.locator('h1').count(), 1);
  const geometry = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth,
    sections: [...document.querySelectorAll('main > section,footer')].map(el => ({ name: el.className, top: Math.round(el.getBoundingClientRect().top + scrollY), height: Math.round(el.getBoundingClientRect().height) })),
    images: [...document.images].filter(img => img.getBoundingClientRect().width > 0).map(img => ({ src: new URL(img.currentSrc).pathname, loaded: img.naturalWidth > 0, width: img.getBoundingClientRect().width, height: img.getBoundingClientRect().height })) }));
  assert.ok(geometry.document <= width, `Page overflow at ${width}: ${geometry.document}`);
  for (const img of geometry.images) {
    assert.ok(img.loaded && img.width > 0 && img.height > 0, `Broken image: ${img.src}`);
    assert.ok((await stat('public' + img.src)).size > 0);
  }
  if (width <= 1000) {
    const menu = page.locator('.menu-button');
    await menu.click();
    assert.equal(await menu.getAttribute('aria-expanded'), 'true');
    await page.keyboard.press('Escape');
    assert.equal(await menu.getAttribute('aria-expanded'), 'false');
    await menu.click();
    await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Features' }).click();
    assert.equal(await menu.getAttribute('aria-expanded'), 'false');
    assert.ok(page.url().endsWith('#features'));
  }
  for (const id of ['features', 'how-it-works', 'testimonials', 'faq']) {
    await page.locator(`footer a[href="#${id}"]`).click();
    assert.ok(page.url().endsWith('#' + id));
    assert.ok(await page.locator('#' + id).evaluate(el => Math.abs(el.getBoundingClientRect().top) < 50 || Math.abs(scrollY + innerHeight - document.documentElement.scrollHeight) < 5), `Section ${id} did not scroll into view at ${width}`);
  }
  const rail = page.locator('.testimonial-rail').first();
  await rail.focus();
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(350);
  assert.ok(await rail.evaluate(el => el.scrollLeft > 0), `Testimonials did not scroll at ${width}`);
  await rail.evaluate(el => el.scrollLeft = 0);
  await page.locator('footer a[href="#top"]').first().click();
  assert.ok(await page.evaluate(() => scrollY < 5));
  assert.equal(await page.locator('.attribution a').count(), 2);
  assert.deepEqual(errors, []);
  await page.screenshot({ path: `test-results/fundora-${width}.png`, fullPage: true });
  if ([390, 1728].includes(width)) {
    for (const selector of ['.hero', '.overview', '.features', '.footer']) await page.locator(selector).screenshot({ path: `test-results/${selector.slice(1)}-${width}.png` });
  }
  results.push({ width, ...geometry });
  await page.close();
}
await writeFile('test-results/layout-report.json', JSON.stringify(results, null, 2));
await browser.close();
console.log('Passed: eleven viewport sizes, local assets, navigation, mobile menu, keyboard scrolling, attribution, and browser errors.');
