import type { Lang } from '../i18n/ui';

/** One entry per image sheet. Only what is known: a row with no value is not written. */
export interface ImageSheet {
  slug: Record<Lang, string>;
  name: Record<Lang, string>;
  designation: string;
  type: Record<Lang, string>;
  constellation: Record<Lang, string>;
  frames: string;            // e.g. '1348 × 13 s'
  /** The equipment, when known: one row each in the sheet's acquisition table. */
  setup?: { telescope: Record<Lang, string>; camera: Record<Lang, string>; mount: Record<Lang, string> };
  total: Record<Lang, string>;
  src: string;
  width: number;
  height: number;
  alt: Record<Lang, string>;
  caption: Record<Lang, string>;
  graph: { src: string; width: number; height: number; alt: Record<Lang, string>; caption: Record<Lang, string> };
  graphLine: Record<Lang, string>;   // the sentence above the graph figure
  graphRow: Record<Lang, string>;
  description: Record<Lang, string>;
}

export const images: ImageSheet[] = [
  {
    slug: { en: 'pleiades', fr: 'pleiades' },
    name: { en: 'The Pleiades', fr: 'Les Pléiades' },
    designation: 'M 45',
    type: { en: 'Open cluster and reflection nebulae', fr: 'Amas ouvert et nébuleuses par réflexion' },
    constellation: { en: 'Taurus', fr: 'Taureau' },
    frames: '1348 × 13 s',
    setup: {
      telescope: { en: '130/900 Newtonian', fr: 'Newton 130/900' },
      camera: { en: 'Sony A7S, stock filter removed and replaced by an Astrodon filter', fr: 'Sony A7S défiltré, refiltré Astrodon' },
      mount: { en: 'HEQ5', fr: 'HEQ5' },
    },
    total: { en: '4 h 52 min', fr: '4 h 52 min' },
    src: '/images/pleiades.jpg',
    width: 2704,
    height: 2296,
    alt: { en: 'The Pleiades and their reflection nebulae', fr: 'Les Pléiades et leurs nébuleuses par réflexion' },
    caption: {
      en: 'The Pleiades, processed in FLOAT from calibration to the final adjustments. A click opens the image on a dark background, a second one shows it at full size.',
      fr: 'Les Pléiades, traitées dans FLOAT de la calibration aux derniers réglages. Un clic ouvre l’image sur fond sombre, un second l’affiche en taille réelle.',
    },
    graph: {
      src: '/images/graph_simple.png', width: 1686, height: 233,
      alt: { en: 'The graph of the Pleiades processing', fr: 'Le graphe du traitement des Pléiades' },
      caption: { en: 'The processing graph, as FLOAT shows it.', fr: 'Le graphe du traitement, tel qu’il apparaît dans FLOAT.' },
    },
    graphLine: {
      en: 'A single workflow, with no branch: calibration, registration, frame selection, stacking, plate solving, gradient, denoising, colour, stars and background, then Post.',
      fr: 'Un seul workflow, sans branche : calibration, alignement, sélection des images, empilement, astrométrie, gradient, débruitage, couleur, étoiles et fond, puis Post.',
    },
    graphRow: { en: 'One workflow, ten blocks (figure 2)', fr: 'Un workflow, dix blocs (figure 2)' },
    description: {
      en: 'The Pleiades (M 45), 1348 × 13 s, processed in FLOAT: the image, its acquisition and its processing graph.',
      fr: 'Les Pléiades (M 45), 1348 × 13 s, traitées dans FLOAT : l’image, sa prise de vue et son graphe de traitement.',
    },
  },
];

export const imageUrl = (s: ImageSheet, lang: Lang) =>
  lang === 'en' ? `/images/${s.slug.en}/` : `/fr/images/${s.slug.fr}/`;
