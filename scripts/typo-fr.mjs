// French typography on the built pages: a non-breaking space before ; : ? ! » and after «, in the text only
// (never inside tags, scripts, styles or code). Run after `astro build`.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('../dist/fr/', import.meta.url);
const skip = /(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<pre[\s\S]*?<\/pre>|<code[\s\S]*?<\/code>|<[^>]+>)/g;

async function* pages(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* pages(p);
    else if (e.name.endsWith('.html')) yield p;
  }
}

let n = 0;
for await (const file of pages(root.pathname.replace(/^\/([A-Za-z]:)/, '$1'))) {
  const html = await readFile(file, 'utf8');
  const out = html
    .split(skip)
    .map((part, i) => (i % 2 ? part : part.replace(/ ([;:?!»])/g, ' $1').replace(/« /g, '« ')))
    .join('');
  if (out !== html) { await writeFile(file, out); n++; }
}
console.log(`typo-fr: ${n} page(s) adjusted`);
