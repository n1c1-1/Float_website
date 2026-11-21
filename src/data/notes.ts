// The technical notes: one page each, written like a short paper (abstract, method, measures, limits, references).
import type { Lang } from '../i18n/ui';

type L = Record<Lang, string>;
export interface Note { n: number; slug: string; slugFr?: string; title: L; summary: L; date: L }

export const notes: Note[] = [
  {
    n: 1, slug: 'noise2noise',
    title: {
      en: 'Noise2Noise on half-stacks: denoising amateur deep-sky stacks without clean images',
      fr: 'Noise2Noise sur demi-empilements : débruiter des empilements amateurs sans image propre',
    },
    summary: {
      en: 'Every stack is written as two half-stacks with independent noise; a network pretrained on amateur data adapts to them in seconds. Method, measures on six held-out cases, limits.',
      fr: 'Chaque empilement est écrit en deux demi-empilements aux bruits indépendants ; un réseau pré-entraîné sur des données amateurs s’y adapte en quelques secondes. Méthode, mesures sur six cas tenus à l’écart, limites.',
    },
    date: { en: 'November 2026', fr: 'novembre 2026' },
  },
  {
    n: 2, slug: 'sensor-curve', slugFr: 'courbe-capteur',
    title: {
      en: 'What star spectra tell about a camera’s spectral response, and where it stops',
      fr: 'Ce que les spectres des étoiles disent de la courbe d’un capteur, et où cela s’arrête',
    },
    summary: {
      en: 'The sensitivity curve rebuilt from the Gaia spectra of the field’s stars: six to eight combinations constrained, the response at emission lines set by the smoothing. Measures on the Rosette and on a test with known truth.',
      fr: 'La courbe de sensibilité reconstruite à partir des spectres Gaia des étoiles du champ : six à huit combinaisons contraintes, la réponse aux raies d’émission fixée par le lissage. Mesures sur la Rosette et sur un test à vérité connue.',
    },
    date: { en: 'November 2026', fr: 'novembre 2026' },
  },
];

export const noteUrl = (x: Note, lang: Lang) => (lang === 'en' ? `/notes/${x.slug}/` : `/fr/notes/${x.slugFr ?? x.slug}/`);
