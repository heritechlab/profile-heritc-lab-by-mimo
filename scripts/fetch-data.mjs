/**
 * Menarik data YouTube & GitHub sekali saat build, lalu menyimpannya ke
 * src/data/generated/*.json. Hasilnya di-cache selama CACHE_TTL_JAM agar
 * `npm run dev` tidak memanggil API setiap kali file berubah.
 *
 * Gagal jaringan TIDAK menggagalkan build: data cache terakhir dipakai
 * sebagai fallback, atau array kosong bila belum pernah ada.
 *
 * Env (opsional, hanya di sisi build/server):
 *   GITHUB_TOKEN       -> rate limit 5000/jam
 *   YOUTUBE_API_KEY    -> untuk jumlah subscriber (tanpa ini, subs disembunyikan)
 *   CACHE_TTL_JAM      -> default 6
 *   FORCE_FETCH=1      -> abaikan cache
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { XMLParser } from 'fast-xml-parser';
import YAML from 'yaml';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'src', 'data', 'generated');
const TTL_MS = Number(process.env.CACHE_TTL_JAM ?? 6) * 60 * 60 * 1000;
const FORCE = process.env.FORCE_FETCH === '1';

const readYaml = async (name) =>
  YAML.parse(await readFile(path.join(ROOT, 'src', 'data', name), 'utf8'));

const log = (msg) => console.log(`[fetch] ${msg}`);

async function loadCache(file) {
  const p = path.join(OUT_DIR, file);
  if (!existsSync(p) || FORCE) return null;
  try {
    const raw = JSON.parse(await readFile(p, 'utf8'));
    if (Date.now() - raw.fetchedAt < TTL_MS) {
      log(`${file}: cache masih berlaku, lewati`);
      return raw;
    }
    return null;
  } catch {
    return null;
  }
}

async function saveCache(file, payload) {
  await mkdir(OUT_DIR, { recursive: true });
  const p = path.join(OUT_DIR, file);
  const body = { fetchedAt: Date.now(), ...payload };
  await writeFile(p, JSON.stringify(body, null, 2), 'utf8');
  log(`${file}: tersimpan`);
  return body;
}

async function saveStale(file, payload) {
  await mkdir(OUT_DIR, { recursive: true });
  const p = path.join(OUT_DIR, file);
  const prev = existsSync(p) ? JSON.parse(await readFile(p, 'utf8')) : {};
  const body = {
    ...prev,
    ...payload,
    fetchedAt: prev.fetchedAt ?? Date.now(),
    stale: true,
  };
  await writeFile(p, JSON.stringify(body, null, 2), 'utf8');
  return body;
}

// ---------------------------------------------------------------- YouTube
async function fetchYouTube() {
  const social = await readYaml('social.yml');
  const { channelId, url, handle, nama } = social.youtube;
  const base = { channelId, url, handle, nama, subscriberCount: null, videos: [] };

  const cached = await loadCache('youtube.json');
  if (cached) return { ...base, ...cached, stale: false };

  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      { headers: { 'user-agent': 'Mozilla/5.0 (compatible; heri-site-build/1.0)' } },
    );
    if (!res.ok) throw new Error(`RSS ${res.status}`);
    const xml = await res.text();
    const doc = new XMLParser({ ignoreAttributes: false }).parse(xml);
    const entries = Array.isArray(doc.feed?.entry) ? doc.feed.entry : doc.feed?.entry ? [doc.feed.entry] : [];

    const videos = entries.map((e) => {
      const videoId = String(e['yt:videoId'] ?? e.id ?? '').split(':').pop();
      const link = e.link?.['@_href'] ?? e.link?.['@href'] ?? `https://www.youtube.com/watch?v=${videoId}`;
      const isShort = link.includes('/shorts/');
      return {
        videoId,
        title: String(e.title),
        url: link,
        published: String(e.published),
        short: isShort,
        thumb: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      };
    });

    let subscriberCount = null;
    const key = process.env.YOUTUBE_API_KEY;
    if (key) {
      try {
        const r = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${key}`,
        );
        const j = await r.json();
        subscriberCount = j?.items?.[0]?.statistics?.subscriberCount ?? null;
      } catch (err) {
        log(`statistik YouTube dilewati: ${err.message}`);
      }
    }

    log(`youtube: ${videos.length} video`);
    return await saveCache('youtube.json', { videos, subscriberCount });
  } catch (err) {
    log(`youtube GAGAL (${err.message}) -> pakai fallback`);
    return await saveStale('youtube.json', base);
  }
}

// --------------------------------------------------------------- GitHub
async function fetchGitHub() {
  const social = await readYaml('social.yml');
  const { username } = social.github;
  const headers = {
    'user-agent': 'heri-site-build/1.0',
    accept: 'application/vnd.github+json',
    ...(process.env.GITHUB_TOKEN
      ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
      : {}),
  };

  const cached = await loadCache('github.json');
  if (cached) return { ...cached, stale: false };

  try {
    const uRes = await fetch(`https://api.github.com/users/${username}`, { headers });
    if (!uRes.ok) throw new Error(`user ${uRes.status}`);
    const user = await uRes.json();

    const rRes = await fetch(
      `https://api.github.com/users/${username}/repos?sort=pushed&per_page=100`,
      { headers },
    );
    if (!rRes.ok) throw new Error(`repos ${rRes.status}`);
    const all = await rRes.json();

    const repos = all
      .filter((r) => !r.fork && !r.archived)
      .map((r) => ({
        name: r.name,
        fullName: r.full_name,
        description: r.description ?? '',
        url: r.html_url,
        homepage: r.homepage || '',
        language: r.language ?? '',
        topics: r.topics ?? [],
        stars: r.stargazers_count ?? 0,
        forks: r.forks_count ?? 0,
        updatedAt: r.pushed_at ?? r.updated_at,
        createdAt: r.created_at,
        private: r.private,
      }));

    log(`github: ${repos.length} repo`);
    return await saveCache('github.json', {
      user: {
        login: user.login,
        name: user.name,
        avatar: user.avatar_url,
        url: user.html_url,
        bio: user.bio ?? '',
        followers: user.followers ?? 0,
        publicRepos: user.public_repos ?? 0,
        hireable: !!user.hireable,
      },
      repos,
    });
  } catch (err) {
    log(`github GAGAL (${err.message}) -> pakai fallback`);
    return await saveStale('github.json', { user: null, repos: [] });
  }
}

// ---------------------------------------------------------------- main
const [yt, gh] = await Promise.all([fetchYouTube(), fetchGitHub()]);
await saveCache('build-meta.json', {
  youtubeStale: !!yt.stale,
  githubStale: !!gh.stale,
  videoCount: yt.videos?.length ?? 0,
  repoCount: gh.repos?.length ?? 0,
});
log('selesai');
