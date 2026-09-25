import type { APIRoute } from 'astro';
import { loadGenerated } from '../lib/data';
import { siteMeta } from '../lib/site';

const esc = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const GET: APIRoute = async ({ site }) => {
  const { youtube } = await loadGenerated();
  const base = (site ?? new URL('https://example.com')).href.replace(/\/$/, '');

  const items = youtube.videos
    .map(
      (v) => `    <item>
      <title><![CDATA[${v.title.replace(/\]\]>/g, ']]&gt;')}]]></title>
      <link>${esc(v.url)}</link>
      <guid isPermaLink="false">yt:${esc(v.videoId)}</guid>
      <pubDate>${new Date(v.published).toUTCString()}</pubDate>
    </item>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${esc(siteMeta.name)}</title>
    <link>${esc(base)}/</link>
    <description>${esc(siteMeta.description)}</description>
    <language>id</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
