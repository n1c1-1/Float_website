// After the build: rewrites dist/sitemap-0.xml from the pages that were really built. Each page is listed once with its
// language pair, and a pair is written only when the other page exists and points back (hreflang must be reciprocal).
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve(import.meta.dirname, '..', 'dist');
const site = 'https://float-astro.org';
const pages = new Map();            // url -> { lang, alternates: {hreflang: url} }

function* walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.name === 'index.html') yield p;
  }
}
for (const file of walk(dist)) {
  const html = fs.readFileSync(file, 'utf8');
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!canonical || /<meta name="robots" content="noindex"/.test(html)) continue;
  const alternates = {};
  for (const m of html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)) alternates[m[1]] = m[2];
  pages.set(canonical, { lang: html.match(/<html lang="([^"]+)"/)?.[1], alternates });
}

const loc = { en: 'en-GB', fr: 'fr-FR' };
const problems = [];
const entries = [...pages.keys()].sort().map((url) => {
  const { lang, alternates } = pages.get(url);
  const other = lang === 'en' ? 'fr' : 'en';
  const there = alternates[other];
  const back = there && pages.get(there)?.alternates[lang];
  const links = [];
  if (there && back === url && there !== url) {
    links.push([loc[lang], url], [loc[other], there]);
    const dflt = lang === 'en' ? url : there;
    links.push(['x-default', dflt]);
  } else problems.push(`${url}: its ${other} counterpart ${there ?? '(none)'} does not exist or does not point back`);
  return `<url><loc>${url}</loc>${links.map(([h, u]) => `<xhtml:link rel="alternate" hreflang="${h}" href="${u}"/>`).join('')}</url>`;
});
const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries.join('')}</urlset>`;
fs.writeFileSync(path.join(dist, 'sitemap-0.xml'), xml);
console.log(`sitemap-pairs: ${entries.length} pages${problems.length ? `, ${problems.length} with no valid pair:\n  ${problems.join('\n  ')}` : ''}`);
