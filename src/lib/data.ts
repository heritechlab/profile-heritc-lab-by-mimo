import { profile, social } from './content';

export { profile, social };

export type Video = {
  videoId: string;
  title: string;
  url: string;
  published: string;
  short: boolean;
  thumb: string;
};

export type Repo = {
  name: string;
  fullName: string;
  description: string;
  url: string;
  homepage: string;
  language: string;
  topics: string[];
  stars: number;
  forks: number;
  updatedAt: string;
  createdAt: string;
  private: boolean;
};

export type YoutubeData = {
  channelId: string;
  url: string;
  handle: string;
  nama: string;
  subscriberCount: string | null;
  videos: Video[];
  fetchedAt?: number;
  stale?: boolean;
};

export type GithubData = {
  user: {
    login: string;
    name: string;
    avatar: string;
    url: string;
    bio: string;
    followers: number;
    publicRepos: number;
    hireable: boolean;
  } | null;
  repos: Repo[];
  fetchedAt?: number;
  stale?: boolean;
};

const emptyYoutube: YoutubeData = {
  channelId: social.youtube.channelId,
  url: social.youtube.url,
  handle: social.youtube.handle,
  nama: social.youtube.nama,
  subscriberCount: null,
  videos: [],
  stale: true,
};

const emptyGithub: GithubData = { user: null, repos: [], stale: true };

/** Data hasil `npm run fetch` — dijalankan otomatis lewat prebuild. */
export async function loadGenerated() {
  const [yt, gh] = await Promise.all([
    import('../data/generated/youtube.json').catch(() => null),
    import('../data/generated/github.json').catch(() => null),
  ]);
  const ytData = (yt?.default ?? null) as Partial<YoutubeData> | null;
  const ghData = (gh?.default ?? null) as Partial<GithubData> | null;

  const youtube: YoutubeData = ytData
    ? { ...emptyYoutube, ...ytData, stale: ytData.stale ?? false }
    : emptyYoutube;
  const github: GithubData = ghData
    ? { ...emptyGithub, ...ghData, stale: ghData.stale ?? false }
    : emptyGithub;
  return { youtube, github, profile, social };
}

export const formatTanggal = (iso: string, opts?: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('id-ID', opts ?? { day: 'numeric', month: 'short', year: 'numeric' }).format(
    new Date(iso),
  );

export const relatif = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const hari = Math.round(diff / 86_400_000);
  if (hari <= 0) return 'hari ini';
  if (hari === 1) return 'kemarin';
  if (hari < 30) return `${hari} hari lalu`;
  const bulan = Math.round(hari / 30);
  if (bulan < 12) return `${bulan} bulan lalu`;
  return `${Math.round(bulan / 12)} tahun lalu`;
};

export const ringkasTeks = (s: string, n = 140) =>
  s.length > n ? `${s.slice(0, n).trimEnd()}…` : s;
