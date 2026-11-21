export type Lang = 'en' | 'fr';

/** Every page of the site, with its address in each language. `null`: not written yet. */
export const routes: Record<string, Record<Lang, string | null>> = {
  home: { en: '/', fr: '/fr/' },
  why: { en: '/why/', fr: '/fr/pourquoi/' },
  download: { en: '/download/', fr: '/fr/telecharger/' },
  images: { en: '/images/', fr: '/fr/images/' },
  learn: { en: '/learn/', fr: '/fr/apprendre/' },
  blocks: { en: '/blocks/', fr: '/fr/blocs/' },
  notes: { en: '/notes/', fr: '/fr/notes/' },
  project: { en: '/project/', fr: '/fr/projet/' },
};

export const nav: { key: string; en: string; fr: string }[] = [
  { key: 'why', en: 'Why', fr: 'Pourquoi' },
  { key: 'download', en: 'Download', fr: 'Télécharger' },
  { key: 'learn', en: 'Learn', fr: 'Apprendre' },
  { key: 'blocks', en: 'Blocks', fr: 'Blocs' },
  { key: 'notes', en: 'Notes', fr: 'Notes' },
  { key: 'project', en: 'Project', fr: 'Projet' },
];

export const ui = {
  en: {
    tagline: 'FLOw for AsTrophotography',
    soon: 'Not written yet',
    source: 'Source code',
    licence: 'GNU General Public License v3.',
    figure: 'Figure',
    table: 'Table',
    close: 'Close',
    zoomHint: 'Click to open at full size',
    onThisPage: 'On this page',
    blocks: 'Blocks',
    skip: 'Skip to the content',
    download: 'Download',
    report: 'Report a problem',
    betaOf: 'beta of',
  },
  fr: {
    tagline: 'FLOw for AsTrophotography',
    soon: 'Pas encore écrite',
    source: 'Code source',
    licence: 'Licence publique générale GNU v3.',
    figure: 'Figure',
    table: 'Tableau',
    close: 'Fermer',
    zoomHint: 'Cliquer pour ouvrir en taille réelle',
    onThisPage: 'Sur cette page',
    blocks: 'Blocs',
    skip: 'Aller au contenu',
    download: 'Télécharger',
    report: 'Signaler un problème',
    betaOf: 'bêta du',
  },
} as const;

/** The blocks of the graph, in the order of a workflow. `key`: the view files src/views/blocks/<key>En.astro and
 *  <key>Fr.astro (a block without them is shown greyed). `desc`: one line for the index of the blocks. */
export const blocks: { key: string; en: string; fr: string; slug: Record<Lang, string>; desc: Record<Lang, string> }[] = [
  { key: 'Calibration', en: 'Calibration', fr: 'Calibration', slug: { en: 'calibration', fr: 'calibration' }, desc: { en: "Master dark, flat and bias, hot-pixel search, then the calibration of each raw frame.", fr: "Masters de dark, de flat et d’offset, pixels chauds, puis calibration de chaque brute." } },
  { key: 'Registration', en: 'Registration', fr: 'Alignement', slug: { en: 'registration', fr: 'alignement' }, desc: { en: "Finds the stars, fits a cubic polynomial mapping each frame onto a reference, and measures each frame.", fr: "Trouve les étoiles, ajuste pour chaque image un polynôme cubique qui la ramène sur une référence, et mesure chaque image." } },
  { key: 'Selection', en: 'Selection', fr: 'Sélection', slug: { en: 'selection', fr: 'selection' }, desc: { en: "Weights each frame by transparency, noise and star size; four modes decide which stay.", fr: "Pondère chaque image par transparence, bruit et taille d’étoiles ; quatre modes décident lesquelles restent." } },
  { key: 'Stacking', en: 'Stacking', fr: 'Empilement', slug: { en: 'stacking', fr: 'empilement' }, desc: { en: "Bayer drizzle or Classic stack, outlier rejection, two independent half-stacks.", fr: "Drizzle Bayer ou empilement classique, rejet des valeurs aberrantes, deux demi-empilements indépendants." } },
  { key: 'Astrometry', en: 'Astrometry', fr: 'Astrométrie', slug: { en: 'astrometry', fr: 'astrometrie' }, desc: { en: "Plate solving of the stack: Asterion or FLOAT’s own search, then a fine fit on Gaia DR3.", fr: "Astrométrie de l’empilement : Asterion ou la recherche de FLOAT, puis ajustement fin sur Gaia DR3." } },
  { key: 'Gradient', en: 'Gradient', fr: 'Gradient', slug: { en: 'gradient', fr: 'gradient' }, desc: { en: "Models and removes the sky gradient of the stack; the sky level stays.", fr: "Modélise et retire le gradient du ciel de l’empilement ; le niveau du ciel reste." } },
  { key: 'Deconvolution', en: 'Deconvolution', fr: 'Déconvolution', slug: { en: 'deconvolution', fr: 'deconvolution' }, desc: { en: "Sharpens the stack with the star shape measured per zone and colour; neural method in beta.", fr: "Rend l’empilement plus net avec la forme des étoiles mesurée par zone et par couleur ; méthode neuronale en bêta." } },
  { key: 'Denoise', en: 'Denoise', fr: 'Débruitage', slug: { en: 'denoise', fr: 'debruitage' }, desc: { en: "A Noise2Noise network predicts one half-stack from the other; pretrained or adapted to the image.", fr: "Un réseau Noise2Noise prédit un demi-empilement à partir de l’autre ; pré-entraîné ou adapté à l’image." } },
  { key: 'Color', en: 'Color', fr: 'Couleur', slug: { en: 'color', fr: 'couleur' }, desc: { en: "Photometric white balance on the Gaia XP spectra of the stars in the field: one factor per colour.", fr: "Balance des blancs photométrique sur les spectres Gaia XP des étoiles du champ : un facteur par couleur." } },
  { key: 'Stars', en: 'Stars/background', fr: 'Étoiles/fond', slug: { en: 'stars', fr: 'etoiles' }, desc: { en: "A network splits the linear image into a starless image and the stars alone; Synthetic stars redraws the detected stars.", fr: "Un réseau sépare l’image linéaire en image sans étoiles et étoiles seules ; Étoiles de synthèse redessine les étoiles détectées." } },
  { key: 'Combination', en: 'Combination', fr: 'Combinaison', slug: { en: 'combination', fr: 'combinaison' }, desc: { en: "Several filters of a monochrome camera combined into one colour image by a recipe.", fr: "Plusieurs filtres d’une caméra monochrome réunis en une image couleur par une recette." } },
  { key: 'Post', en: 'Post', fr: 'Post', slug: { en: 'post', fr: 'post' }, desc: { en: "Layers, masks, blend modes and filters to finish each workflow’s image, then export.", fr: "Calques, masques, modes de fusion et filtres pour finir l’image de chaque workflow, puis l’export." } },
  { key: 'Report', en: 'Report', fr: 'Rapport', slug: { en: 'report', fr: 'rapport' }, desc: { en: "The record of a processing: the night, the measurements, the settings and the figures, to keep or share.", fr: "Le compte rendu d’un traitement : la nuit, les mesures, les réglages et les figures, à garder ou à partager." } },
];
export const blockUrl = (b: { slug: Record<Lang, string> }, lang: Lang) =>
  lang === 'en' ? `/blocks/${b.slug.en}/` : `/fr/blocs/${b.slug.fr}/`;

import releaseData from '../data/release.json';
export { releaseData as release };
/** The version of the software the site describes (the beta's version; release.json has none). */
export const version = '0.2.0';
/** The installer of the TAGGED release in release.json: the button and the SHA-256 beside it name the same file,
 *  and npm run release (scripts/update-release.mjs) moves tag, file and hash together. */
export const releaseFileUrl = `${releaseData.repo}/releases/download/${releaseData.tag}/${releaseData.file}`;
