import type { Lang } from '../i18n/ui';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

type L<T = string> = { en: T; fr: T };
/** A crop at 100 %; `label` names it when a step shows several (the right setting, pushed too far, order swapped). */
export interface Detail { src: string | L; w: number; h: number; caption: L; label?: L }
export interface Step {
  id: string; title: L; text: L; shot: L; w: number; h: number; at: L<number>;
  check?: L; pitfall?: L;
  /** Why the gesture is made (one or two sentences). */
  why?: L;
  /** A detail of the image at 100 %, shown under the step's text: what to look at once the gesture is made. */
  detail?: Detail | Detail[];
  /** A plain table under the step: the first column is the row header. */
  table?: { caption: L; head: L[]; rows: L[][] };
  /** The diagnosis made before touching Post: what is wrong on the image, how it is read, which step corrects it. */
  diagnosis?: { problem: L; read: L; fix: L; step?: string }[];
}
export interface VideoFile { src: string; captions?: string; chapters?: string; poster?: string; seconds?: number }
export interface Tutorial {
  slug: string; slugFr: string; section: 'path' | 'post'; level?: 1 | 2 | 3 | 4; order: number;
  title: L; summary: L; duration: L; needs: L<string[]>;
  /** `url`, `licence` and `size` may be absent (our own frames before their download exists); `note` adds a sentence. */
  data: { name: string | L; author: string | L; licence?: string | L; url?: string; size?: string | L; note?: L;
    /** Archives of the frames, in the R2 bucket: `file` is the key under /data/. */
    files?: { what: L; file: string; size: L }[] };
  video: Partial<Record<Lang, VideoFile>>;
  steps: Step[]; blocks?: string[]; next?: string | null;
  /** The finished image, shown at the top of the page (an export, not a screenshot). */
  result?: { src: string; w: number; h: number; caption: L };
}

// A tutorial exists on the site only when its manifest file exists. Files starting with _ are samples: dev only.
const files = import.meta.glob('../data/tutorials/*.json', { eager: true, import: 'default' }) as Record<string, Tutorial>;
const keep = ([path]: [string, Tutorial]) => !(import.meta.env.PROD && /\/_[^/]*$/.test(path));

const rank = (t: Tutorial) => (t.section === 'path' ? t.level ?? 1 : 9) * 1000 + t.order;
// The videos are served from the R2 bucket `float` (too large for the repository); their path in the manifest is
// their key in the bucket. Posters, captions and screenshots stay in public/.
export const MEDIA = 'https://pub-7e934645c502451783a2a17449d8713f.r2.dev';
export const dataUrl = (file: string) => `${MEDIA}/data/${file}`;
export const videoUrl = (src: string) => (import.meta.env.PROD ? MEDIA + src : src);
// A tutorial is shown once it is complete: its poster exists in both languages (one being recorded has a manifest
// but no media yet, and must not appear half-made).
const onDisk = (src?: string) => !!src && existsSync(join(process.cwd(), 'public', src));
// `draft: true` in a manifest keeps a tutorial off the site (one filmed on an image that is to be replaced).
const ready = (t: Tutorial) => !(t as Tutorial & { draft?: boolean }).draft && (['en', 'fr'] as Lang[]).every((l) => onDisk(t.video?.[l]?.poster) && t.steps?.length > 0);
export const tutorials: Tutorial[] = Object.entries(files).filter(keep).map(([, t]) => t).filter(ready).sort((a, b) => rank(a) - rank(b));

/** A text of the data credit, given once for both languages or once per language. */
export const tr = (v: string | L | undefined, lang: Lang) => (v && typeof v === 'object' ? v[lang] : v);
export const bySlug = (slug: string) => tutorials.find((t) => t.slug === slug);
export const inSection = (section: 'path' | 'post', level?: number) =>
  tutorials.filter((t) => t.section === section && (section === 'post' || t.level === level));
export const tutorialUrl = (t: Tutorial, lang: Lang) => (lang === 'en' ? `/learn/${t.slug}/` : `/fr/apprendre/${t.slugFr}/`);
/** Previous and next in the reading order: the manifest's `next` first, else the order of the list. */
export const neighbours = (t: Tutorial) => {
  const i = tutorials.indexOf(t);
  const next = (t.next ? bySlug(t.next) : undefined) ?? tutorials[i + 1];
  return { prev: tutorials[i - 1], next };
};
export const levelNames: Record<number, L> = {
  1: { en: 'Beginner', fr: 'Débutant' }, 2: { en: 'Intermediate', fr: 'Intermédiaire' },
  3: { en: 'Advanced', fr: 'Avancé' }, 4: { en: 'Expert', fr: 'Expert' },
};
/** The picture that stands for a tutorial: its video's poster, else its first screenshot. */
export const posterOf = (t: Tutorial, lang: Lang) => t.video[lang]?.poster ?? t.steps[0]?.shot[lang];
