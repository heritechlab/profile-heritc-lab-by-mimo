import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const base = process.env.BASE ?? 'http://localhost:4321';
const out = 'artifacts';
await mkdir(out, { recursive: true });

const pages = [
  ['/', 'home'],
  ['/tentang', 'tentang'],
  ['/youtube', 'youtube'],
  ['/proyek', 'proyek'],
  ['/website', 'website'],
  ['/kontak', 'kontak'],
];

const browser = await chromium.launch();
const errors = [];

async function shot(ctx, url, name, width, height, fullPage) {
  const page = await ctx.newPage();
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`${name}: ${m.text()}`);
  });
  page.on('pageerror', (e) => errors.push(`${name}: ${e.message}`));
  await page.goto(base + url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${out}/${name}.png`, fullPage });
  await page.close();
}

const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
for (const [url, name] of pages) await shot(desktop, url, `d-${name}`, 1440, 900, false);
await shot(desktop, '/', 'd-home-full', 1440, 900, true);
await desktop.close();

const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
for (const [url, name] of pages) await shot(mobile, url, `m-${name}`, 390, 844, false);
await mobile.close();

await browser.close();
console.log(errors.length ? `CONSOLE ERRORS:\n${errors.join('\n')}` : 'no console errors');
