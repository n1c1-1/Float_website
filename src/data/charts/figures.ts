// The measurement figures of the block pages, built from the Pleiades project's stored results (the JSON files of
// this folder) for the Chart component. One function per figure, given the language.
import type { Lang } from '../../i18n/ui';
import registration from './registration.json';
import selection from './selection.json';
import rejection from './stacking_rejection.json';
import coverage from './stacking_coverage.json';
import colourFit from './color_fit.json';
import response from './color_response.json';

const minutes = { en: 'Time since the first frame (min)', fr: 'Temps depuis la première pose (min)' };

export function registrationFigure(lang: Lang) {
  return {
    lang,
    title: { en: 'Star size of each frame over the night', fr: 'Taille des étoiles de chaque pose au fil de la nuit' },
    x: { label: minutes, min: 0, max: 300, ticks: [0, 60, 120, 180, 240, 300] },
    y: { label: { en: 'Star size, FWHM (px)', fr: 'Taille des étoiles, FWHM (px)' }, min: 1, max: 6, ticks: [1, 2, 3, 4, 5, 6] },
    legend: 'tr' as const,
    series: [
      { type: 'scatter' as const, x: registration.minutes, y: registration.fwhm_coarse, colour: 'ink' as const, r: 1.5,
        label: { en: 'Coarse (2 × 2 super-pixels)', fr: 'Grossière (super-pixels 2 × 2)' } },
      { type: 'scatter' as const, x: registration.minutes, y: registration.fwhm_moffat, colour: 'orange' as const, r: 1.5,
        label: { en: 'Moffat fit', fr: 'Ajustement de Moffat' } },
    ],
  };
}

export function selectionFigure(lang: Lang) {
  return {
    lang,
    title: { en: 'Weight of each frame over the night', fr: 'Poids de chaque pose au fil de la nuit' },
    x: { label: minutes, min: 0, max: 300, ticks: [0, 60, 120, 180, 240, 300] },
    y: { label: { en: 'Weight (best frame = 1)', fr: 'Poids (meilleure pose = 1)' }, min: 0, max: 1.05,
         ticks: [0, 0.2, 0.4, 0.6, 0.8, 1], digits: 1 },
    legend: [0.5, 0.62] as [number, number],
    refs: [{ axis: 'y' as const, value: selection.threshold, anchor: 'start' as const,
             label: { en: 'minimum, 5 % of the best weight', fr: 'minimum, 5 % du meilleur poids' } }],
    series: [
      { type: 'scatter' as const, x: selection.minutes, y: selection.weight_kept, colour: 'blue' as const, r: 1.5,
        label: { en: `Kept (${selection.kept})`, fr: `Gardées (${selection.kept})` } },
      { type: 'scatter' as const, x: selection.minutes, y: selection.weight_left, colour: 'orange' as const, r: 3,
        hollow: true, opacity: 1,
        label: { en: `Left out (${selection.left_weight})`, fr: `Écartées (${selection.left_weight})` } },
    ],
  };
}

export function rejectionFigure(lang: Lang) {
  const at = rejection.minutes;
  return {
    lang,
    title: { en: 'Share of the samples of each frame rejected', fr: 'Part des échantillons de chaque pose rejetés' },
    x: { label: minutes, min: 0, max: 300, ticks: [0, 60, 120, 180, 240, 300] },
    y: { label: { en: 'Samples rejected (%)', fr: 'Échantillons rejetés (%)' }, min: 0, max: 0.25,
         ticks: [0, 0.05, 0.1, 0.15, 0.2, 0.25], digits: 2 },
    legend: 'tr' as const,
    series: [
      { type: 'scatter' as const, x: at, y: rejection.high_pct, colour: 'blue' as const, r: 1.5,
        label: { en: 'Above the mean', fr: 'Au-dessus de la moyenne' } },
      { type: 'scatter' as const, x: at, y: rejection.low_pct, colour: 'orange' as const, r: 1.5,
        label: { en: 'Below the mean', fr: 'Au-dessous de la moyenne' } },
    ],
  };
}

const channels = [
  { key: 'R', colour: 'red' as const, dash: 'solid' as const, en: 'Red', fr: 'Rouge' },
  { key: 'G', colour: 'green' as const, dash: 'dashed' as const, en: 'Green', fr: 'Vert' },
  { key: 'B', colour: 'chblue' as const, dash: 'dotted' as const, en: 'Blue', fr: 'Bleu' },
];

export function coverageFigure(lang: Lang) {
  const v = coverage.variation_pct;
  const n = (x: number) => (lang === 'fr' ? String(x).replace('.', ',') : String(x));
  return {
    lang,
    title: { en: 'Distribution of the coverage of each colour', fr: 'Distribution de la couverture de chaque couleur' },
    x: { label: { en: 'Coverage / median coverage', fr: 'Couverture / couverture médiane' }, min: 0.88, max: 1.12,
         ticks: [0.9, 0.95, 1.0, 1.05, 1.1], digits: 2 },
    y: { label: { en: 'Share of the pixels (%)', fr: 'Part des pixels (%)' }, min: 0, max: 25 },
    legend: 'tr' as const,
    series: channels.map((c, i) => ({
      type: 'step' as const, x: coverage.edges, y: (coverage as any)[c.key] as number[], colour: c.colour, dash: c.dash,
      width: 1.8, label: `${lang === 'fr' ? c.fr : c.en}, ${n(v[i])} %`,
    })),
  };
}

export function colourFitFigure(lang: Lang) {
  const line = (f: { slope: number; intercept: number }, a: number, b: number) => ({
    x: [a, b], y: [f.intercept + f.slope * a, f.intercept + f.slope * b] });
  const r = colourFit.red, b = colourFit.blue;
  return {
    lang,
    title: { en: 'Measured colour ratio of each star against its catalogue ratio',
             fr: 'Rapport de couleur mesuré de chaque étoile contre celui du catalogue' },
    x: { label: { en: 'Expected ratio to green, from the Gaia spectrum', fr: 'Rapport au vert attendu, d’après le spectre Gaia' },
         min: 0.2, max: 2, ticks: [0.2, 0.6, 1.0, 1.4, 1.8], digits: 1 },
    y: { label: { en: 'Measured ratio to green', fr: 'Rapport au vert mesuré' }, min: 0, max: 3.2,
         ticks: [0, 0.5, 1, 1.5, 2, 2.5, 3], digits: 1 },
    legend: [0.68, 0.62] as [number, number],
    refs: [{ axis: 'x' as const, value: 1, label: { en: 'white reference', fr: 'référence de blanc' } }],
    series: [
      { type: 'scatter' as const, x: r.x, y: r.y, colour: 'red' as const, r: 1.7, opacity: 0.55,
        label: { en: 'Red / green, stars', fr: 'Rouge / vert, étoiles' } },
      { type: 'scatter' as const, x: b.x, y: b.y, colour: 'chblue' as const, r: 1.9, hollow: true, opacity: 0.7,
        label: { en: 'Blue / green, stars', fr: 'Bleu / vert, étoiles' } },
      { type: 'line' as const, ...line(r, 0.75, 2.0), colour: 'ink' as const, dash: 'solid' as const, width: 1.5,
        label: { en: 'Theil–Sen line, red', fr: 'Droite de Theil-Sen, rouge' } },
      { type: 'line' as const, ...line(b, 0.25, 1.4), colour: 'ink' as const, dash: 'dashed' as const, width: 1.5,
        label: { en: 'Theil–Sen line, blue', fr: 'Droite de Theil-Sen, bleu' } },
    ],
  };
}

export function responseFigure(lang: Lang) {
  return {
    lang,
    title: { en: 'Approximate spectral response of the sensor', fr: 'Réponse spectrale approchée du capteur' },
    x: { label: { en: 'Wavelength (nm)', fr: 'Longueur d’onde (nm)' }, min: 400, max: 800,
         ticks: [400, 450, 500, 550, 600, 650, 700, 750, 800] },
    y: { label: { en: 'Relative response', fr: 'Réponse relative' }, min: 0, max: 1.05, ticks: [0, 0.2, 0.4, 0.6, 0.8, 1], digits: 1 },
    legend: 'tr' as const,
    refs: [
      { axis: 'x' as const, value: 486.1, label: 'Hβ' },
      { axis: 'x' as const, value: 500.7, label: '[OIII]', row: 1 },
      { axis: 'x' as const, value: 656.3, label: 'Hα' },
    ],
    series: channels.map((c) => ({
      type: 'line' as const, x: response.lam, y: (response as any)[c.key] as number[], colour: c.colour, dash: c.dash,
      width: 2, label: lang === 'fr' ? c.fr : c.en,
    })),
  };
}

export const facts = {
  frames: registration.frames,
  stacked: selection.kept,
  colourStars: colourFit.stars,
  responseStars: response.stars,
};
