// The frame sets the tutorials use, offered for download. The archives are in the R2 bucket `float` under data/
// (see MEDIA in tutorials.ts); a tutorial names its set with `set` in its manifest's `data`.
import { MEDIA } from './tutorials';
import type { Lang } from '../i18n/ui';

type L = Record<Lang, string>;
export interface Archive { file: string; what: L; size: L }
export interface Dataset {
  slug: string; slugFr: string;
  title: L; summary: L;
  /** acquisition, one row each: label, value */
  rows: [L, L][];
  archives: Archive[];
  image: { src: string; w: number; h: number };
  note?: L;
}

export const datasets: Dataset[] = [
  {
    slug: 'rosette', slugFr: 'rosette',
    title: { en: 'Rosette Nebula (NGC 2237)', fr: 'Nébuleuse de la Rosette (NGC 2237)' },
    summary: {
      en: 'Two nights with a mirrorless camera on a 130/900 Newtonian: 794 lights of 15 s, with darks and flats.',
      fr: 'Deux nuits avec un appareil photo hybride sur un Newton 130/900 : 794 brutes de 15 s, avec darks et flats.',
    },
    rows: [
      [{ en: 'Camera', fr: 'Appareil' }, { en: 'Sony A7S, ISO 4000, raw files (ARW)', fr: 'Sony A7S, 4000 ISO, fichiers bruts (ARW)' }],
      [{ en: 'Optics', fr: 'Optique' }, { en: '130/900 Newtonian', fr: 'Newton 130/900' }],
      [{ en: 'Lights', fr: 'Brutes' }, { en: '436 of 15 s (1.8 h) on 29 December 2024; 358 of 15 s (1.5 h) on 28 December 2024', fr: '436 de 15 s (1,8 h) le 29 décembre 2024 ; 358 de 15 s (1,5 h) le 28 décembre 2024' }],
      [{ en: 'Calibration', fr: 'Calibration' }, { en: '48 darks, 62 flats', fr: '48 darks, 62 flats' }],
    ],
    archives: [
      { file: 'rosette-2024-12-29-lights.zip', what: { en: 'Lights, 29 December 2024', fr: 'Brutes, 29 décembre 2024' }, size: { en: '5.5 GB', fr: '5,5 Go' } },
      { file: 'rosette-calibration.zip', what: { en: 'Darks and flats', fr: 'Darks et flats' }, size: { en: '1.4 GB', fr: '1,4 Go' } },
      { file: 'rosette-2024-12-28-lights.zip', what: { en: 'Lights, 28 December 2024 (the second night)', fr: 'Brutes, 28 décembre 2024 (la seconde nuit)' }, size: { en: '4.5 GB', fr: '4,5 Go' } },
    ],
    image: { src: '/tutorials/rosette-finish/result.jpg', w: 2000, h: 1324 },
    note: {
      en: 'The first two archives are enough for every tutorial but one: the second night is used only by Add a second night.',
      fr: 'Les deux premières archives suffisent à tous les tutoriels sauf un : la seconde nuit ne sert qu’à Ajouter une seconde nuit.',
    },
  },
  {
    slug: 'north-america', slugFr: 'amerique-du-nord',
    title: { en: 'North America Nebula (NGC 7000) and the Pelican', fr: 'Nébuleuse de l’Amérique du Nord (NGC 7000) et le Pélican' },
    summary: {
      en: 'One night with the same camera: 580 lights of 10 s, without darks or flats.',
      fr: 'Une nuit avec le même appareil : 580 brutes de 10 s, sans darks ni flats.',
    },
    rows: [
      [{ en: 'Camera', fr: 'Appareil' }, { en: 'Sony A7S, ISO 4000, raw files (ARW)', fr: 'Sony A7S, 4000 ISO, fichiers bruts (ARW)' }],
      [{ en: 'Lights', fr: 'Brutes' }, { en: '580 of 10 s (1.6 h)', fr: '580 de 10 s (1,6 h)' }],
      [{ en: 'Calibration', fr: 'Calibration' }, { en: 'none', fr: 'aucune' }],
    ],
    archives: [
      { file: 'north-america-lights.zip', what: { en: 'Lights', fr: 'Brutes' }, size: { en: '7.6 GB', fr: '7,6 Go' } },
    ],
    image: { src: '/tutorials/no-calibration-frames/result.jpg', w: 2000, h: 1417 },
  },
];

export const archiveUrl = (a: Archive) => `${MEDIA}/data/${a.file}`;
export const datasetUrl = (d: Dataset, lang: Lang) => (lang === 'en' ? `/learn/data/${d.slug}/` : `/fr/apprendre/donnees/${d.slugFr}/`);
export const datasetBySlug = (slug: string) => datasets.find((d) => d.slug === slug);
