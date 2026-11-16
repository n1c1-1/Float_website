// Smaller copies of the large images under public/images/ (WebP and AVIF, several widths), read by Figure.astro
// as srcset. The original stays as it is (the zoom viewer opens it). Also the social card and the app icons
// from public/float.svg.   Run: node scripts/make-images.mjs
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..', 'public');
const WIDTHS = [480, 960, 1440, 1920];

function* walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (/\.(png|jpe?g)$/i.test(e.name) && !/-\d+\.(webp|avif)$/.test(e.name)) yield p;
  }
}

for (const file of walk(path.join(root, 'images'))) {
  const base = file.replace(/\.[^.]+$/, '');
  const img = sharp(file);
  const { width } = await img.metadata();
  const photo = /\.jpe?g$/i.test(file);
  const ws = [...new Set([...WIDTHS.filter((w) => w < width * 0.9), width])];
  for (const w of ws) {
    const r = () => sharp(file).resize({ width: w, withoutEnlargement: true });
    // screenshots (flat colours, thin text): near-lossless keeps the text sharp; photographs are lossy
    await r().webp(photo ? { quality: 80, effort: 5 } : { nearLossless: true, quality: 70, effort: 5 }).toFile(`${base}-${w}.webp`);
    await r().avif(photo ? { quality: 55, effort: 4 } : { lossless: false, quality: 80, effort: 4, chromaSubsampling: '4:4:4' }).toFile(`${base}-${w}.avif`);
  }
}

// social card 1200 x 630 and app icons
const og = path.join(root, 'images', 'pleiades.jpg');
await sharp(og).resize(1200, 630, { fit: 'cover', position: 'centre' }).jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(root, 'og-card.jpg'));
const svg = fs.readFileSync(path.join(root, 'float.svg'));
for (const [name, size] of [['icon-192.png', 192], ['icon-512.png', 512], ['apple-touch-icon.png', 180]]) {
  const icon = sharp(svg, { density: 600 }).resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } });
  await (name.startsWith('apple') ? icon.flatten({ background: '#fbfbf9' }) : icon).png().toFile(path.join(root, name));
}
console.log('done');
