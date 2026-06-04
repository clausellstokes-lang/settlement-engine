import { color, semantic } from './tokens.js';

const fallback = Object.freeze({
  id: 'neutral',
  label: 'Neutral',
  color: color['muted-500'],
  bg: color['parchment-100'],
  border: color['parchment-200'],
  edge: { width: 1.5, dash: null, priority: 0 },
});

export const RELATIONSHIP_TOKENS = Object.freeze({
  neutral: {
    id: 'neutral',
    label: 'Neutral',
    color: color['muted-500'],
    bg: color['parchment-100'],
    border: color['parchment-200'],
    edge: { width: 1.5, dash: null, priority: 0 },
  },
  trade_partner: {
    id: 'trade_partner',
    label: 'Trade Partner',
    color: semantic.success,
    bg: semantic.successBg,
    border: color['parchment-200'],
    edge: { width: 2, dash: null, priority: 2 },
  },
  allied: {
    id: 'allied',
    label: 'Allied',
    color: semantic.info,
    bg: semantic.infoBg,
    border: color['parchment-200'],
    edge: { width: 2.2, dash: null, priority: 3 },
  },
  patron: {
    id: 'patron',
    label: 'Patron',
    color: color['violet-500'],
    bg: color['violet-100'],
    border: color['parchment-200'],
    edge: { width: 2, dash: '6 3', priority: 2, arrow: true },
  },
  client: {
    id: 'client',
    label: 'Client',
    color: color['gold-700'],
    bg: 'rgba(201,162,76,0.12)',
    border: color['parchment-200'],
    edge: { width: 2, dash: '6 3', priority: 2, arrow: false },
  },
  rival: {
    id: 'rival',
    label: 'Rival',
    color: color['amber-500'],
    bg: color['amber-100'],
    border: color['parchment-200'],
    edge: { width: 1.8, dash: '2 3', priority: 1 },
  },
  cold_war: {
    id: 'cold_war',
    label: 'Cold War',
    color: color['red-600'],
    bg: color['red-100'],
    border: color['parchment-200'],
    edge: { width: 1.8, dash: '1 3', priority: 1 },
  },
  hostile: {
    id: 'hostile',
    label: 'Hostile',
    color: color['red-600'],
    bg: color['red-100'],
    border: color['parchment-200'],
    edge: { width: 3, dash: null, priority: 4 },
  },
  criminal_network: {
    id: 'criminal_network',
    label: 'Criminal Network',
    color: color['violet-500'],
    bg: color['violet-100'],
    border: color['parchment-200'],
    edge: { width: 1.8, dash: '3 2', priority: 2 },
  },
  secret_alliance: {
    id: 'secret_alliance',
    label: 'Secret Alliance',
    color: semantic.info,
    bg: semantic.infoBg,
    border: color['parchment-200'],
    edge: { width: 2, dash: '4 2', priority: 3 },
  },
});

export const RELATIONSHIP_TYPE_OPTIONS = Object.freeze(
  ['neutral', 'trade_partner', 'allied', 'patron', 'client', 'rival', 'cold_war', 'hostile', 'criminal_network']
    .map(id => {
      const token = RELATIONSHIP_TOKENS[id];
      return { id, label: token.label, color: token.color };
    }),
);

export function relationshipToken(type) {
  return RELATIONSHIP_TOKENS[type] || fallback;
}

export function relationshipEdgeStyle(type) {
  const token = relationshipToken(type);
  return {
    color: token.color,
    ...(token.edge || fallback.edge),
  };
}
