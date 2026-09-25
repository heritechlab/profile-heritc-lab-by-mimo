import { profile, social } from './content';

export const siteMeta = {
  name: social.youtube.nama,
  shortName: 'HTL',
  description: `${profile.namaSosial} — ${profile.posisi}. Jejak digital terpusat: kanal YouTube, proyek GitHub, dan website yang dikelola. Basis di ${profile.lokasi}.`,
  url: process.env.SITE_URL || '',
};

export const nav = [
  { href: '/tentang', label: 'Tentang' },
  { href: '/youtube', label: 'Kanal' },
  { href: '/proyek', label: 'Proyek' },
  { href: '/website', label: 'Situs' },
  { href: '/kontak', label: 'Kontak' },
];

export const foto = profile.foto || '';
