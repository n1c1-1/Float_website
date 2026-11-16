// Refreshes src/data/release.json from the latest GitHub release of FLOAT.
// Usage: npm run release   (Node 22, no dependency).
// On any failure the file is left as it is and the reason is printed.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const API = 'https://api.github.com/repos/n1c1-1/FLOAT/releases/latest';
const FILE = fileURLToPath(new URL('../src/data/release.json', import.meta.url));
const ASSET = 'FLOAT-Setup.exe';

const months = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  fr: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
};

function fail(why) {
  console.error(`release.json left as it is: ${why}`);
  process.exit(1);
}

try {
  const res = await fetch(API, { headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'float-site-update-release' } });
  if (!res.ok) fail(`GitHub answered ${res.status} ${res.statusText}`);
  const rel = await res.json();

  if (!rel.tag_name) fail('the release has no tag');
  const asset = (rel.assets ?? []).find((a) => a.name === ASSET);
  if (!asset) fail(`the release has no asset named ${ASSET}`);
  const sha = /\b([0-9a-fA-F]{64})\b/.exec(rel.body ?? '');
  if (!sha) fail('no SHA-256 (64 hexadecimal digits) in the release body');
  const when = new Date(rel.published_at ?? rel.created_at);
  if (Number.isNaN(when.getTime())) fail('the release has no usable date');

  const d = when.getUTCDate(), m = when.getUTCMonth(), y = when.getUTCFullYear();
  const current = JSON.parse(readFileSync(FILE, 'utf8'));
  const next = {
    ...current,
    tag: rel.tag_name,
    date: { en: `${d} ${months.en[m]} ${y}`, fr: `${d === 1 ? '1er' : d} ${months.fr[m]} ${y}` },
    file: ASSET,
    sizeBytes: asset.size,
    sizeMB: Math.round(asset.size / 1e6),
    sha256: sha[1].toLowerCase(),
  };
  writeFileSync(FILE, JSON.stringify(next, null, 2) + '\n');
  console.log(`release.json updated: ${next.tag}, ${next.date.en}, ${next.sizeBytes} bytes, ${next.sha256}`);
} catch (e) {
  fail(e instanceof Error ? e.message : String(e));
}
