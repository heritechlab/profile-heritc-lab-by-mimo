/**
 * Membuat public/og.png (1200x630) untuk pratinjau tautan WhatsApp/sosmed.
 * Dijalankan saat build; hasilnya di-commit agar tidak bergantung pada OS.
 */
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import YAML from 'yaml';
import { readFile } from 'node:fs/promises';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'og.png');

const profile = YAML.parse(await readFile(path.join(ROOT, 'src/data/profile.yml'), 'utf8'));

const W = 1200;
const H = 630;
const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M60 0H0V60" fill="none" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1"/>
    </pattern>
    <linearGradient id="rail" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#f2a20c"/>
      <stop offset="1" stop-color="#f2a20c" stop-opacity="0.1"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="#15110c"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <rect x="0" y="0" width="${W}" height="10" fill="#f2a20c"/>

  <g font-family="Arial, Helvetica, sans-serif">
    <text x="72" y="120" fill="#f2a20c" font-size="20" font-weight="700" letter-spacing="6">${esc(
      profile.posisi.toUpperCase(),
    )}</text>

    <text x="72" y="270" fill="#f6f2ec" font-size="132" font-weight="700" letter-spacing="-6">HERI</text>
    <text x="72" y="392" fill="#f2a20c" font-size="132" font-weight="700" letter-spacing="-6">TC LAB</text>

    <rect x="72" y="430" width="420" height="6" fill="url(#rail)"/>

    <text x="72" y="490" fill="#a79e93" font-size="28">${esc(profile.lokasi)} · YouTube · GitHub · Situs dikelola</text>
    <text x="72" y="546" fill="#6f675e" font-size="22" letter-spacing="3">PORTOFOLIO &amp; KANAL</text>
  </g>

  <g transform="translate(${W - 200}, ${H - 170})">
    <rect width="128" height="128" rx="12" fill="#1d1813" stroke="#3a322a" stroke-width="2"/>
    <rect width="128" height="6" rx="0" fill="#f2a20c"/>
    <text x="64" y="86" font-family="Arial, Helvetica, sans-serif" font-size="40" font-weight="700"
      text-anchor="middle" fill="#f6f2ec">HTL</text>
  </g>
</svg>`;

await mkdir(path.dirname(OUT), { recursive: true });
await sharp(Buffer.from(svg)).png({ compressionLevel: 9, quality: 90 }).toFile(OUT);
console.log(`[og] public/og.png dibuat (${W}x${H})`);
