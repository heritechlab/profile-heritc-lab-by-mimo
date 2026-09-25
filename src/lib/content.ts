import rawProfile from '../data/profile.yml';
import rawSocial from '../data/social.yml';
import rawWebsites from '../data/websites.yml';
import rawGithub from '../data/github.yml';

export interface Keahlian {
  grup: string;
  ringkas: string;
  item: string[];
}

export interface Statistik {
  label: string;
  nilai: string;
  satuan: string;
}

export interface Kontak {
  email: string;
  whatsapp: string;
  web3formsKey?: string;
  latitude: number | null;
  longitude: number | null;
}

export interface Profile {
  nama: string;
  namaSosial: string;
  posisi: string;
  tagline: string;
  bio: string;
  bioLanjutan: string;
  lokasi: string;
  zonaWaktu: string;
  bahasa: string[];
  foto: string;
  keahlian: Keahlian[];
  minat: string[];
  kontak: Kontak;
}

export interface SosialLink {
  platform: string;
  nama: string;
  url: string;
  utama?: boolean;
}

export interface Social {
  youtube: { handle: string; channelId: string; url: string; nama: string };
  github: { username: string; url: string };
  sosial: SosialLink[];
}

export interface Website {
  nama: string;
  url: string;
  deskripsi: string;
  peran: string;
  tanggungJawab?: string;
  stack: string[];
  status: 'aktif' | string;
  screenshot: string;
}

export interface WebsitesData {
  websites: Website[];
}

export interface GithubConfig {
  mode: 'unggulan' | 'semua';
  pinned: string[];
  sembunyikan: string[];
  override: Record<string, { peran?: string; hasil?: string }>;
  label: string;
}

export const profile = rawProfile as unknown as Profile;
export const social = rawSocial as unknown as Social;
export const websites = rawWebsites as unknown as WebsitesData;
export const githubConfig = rawGithub as unknown as GithubConfig;
