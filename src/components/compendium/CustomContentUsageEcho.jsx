/**
 * Compact usage projection for an authored definition. It deliberately names
 * legacy name-only joins as inferred and never implies that simple eligibility
 * means the definition has activated.
 */

import { useMemo } from 'react';
import { useStore } from '../../store/index.js';
import { BODY, MUTED, BORDER, FS, SP, sans } from '../theme.js';
import { buildCustomContentUsage } from '../../domain/content/customContentUsage.js';

function tierLabel(eligibility) {
  const from = eligibility?.tierMin;
  const to = eligibility?.tierMax;
  if (from && to) return `${from}–${to}`;
  if (from) return `${from}+`;
  if (to) return `up to ${to}`;
  return 'all settlement tiers';
}

function pluralizedCount(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function usageSummary(counts) {
  const facts = [
    counts.settlements > 0
      ? `used in ${pluralizedCount(counts.settlements, 'settlement')}`
      : 'not yet materialized',
  ];
  if (counts.activations > 0) {
    facts.push(`activated ${pluralizedCount(counts.activations, 'time')}`);
  }
  if (counts.dependents > 0) {
    facts.push(pluralizedCount(counts.dependents, 'dependent definition'));
  }
  if (counts.mapStructures > 0) {
    facts.push(pluralizedCount(counts.mapStructures, 'map structure'));
  }
  if (counts.heraldMentions > 0) {
    facts.push(
      pluralizedCount(
        counts.heraldMentions,
        'Herald/Chronicle mention',
      ),
    );
  }
  return facts.join(' · ');
}

export default function CustomContentUsageEcho({ bucket, item, customContent }) {
  const savedSettlements = useStore((state) => state.savedSettlements || []);
  const campaigns = useStore((state) => state.campaigns || []);
  const usage = useMemo(() => buildCustomContentUsage({
    bucket,
    item,
    customContent,
    savedSettlements,
    campaigns,
  }), [bucket, item, customContent, savedSettlements, campaigns]);

  const inferred = [
    ...usage.settlements,
    ...usage.activations,
    ...usage.heraldMentions,
  ].some((entry) => entry.confidence === 'legacy-name');
  const summary = usageSummary(usage.counts);
  return (
    <div
      data-testid="custom-content-usage-echo"
      style={{
        marginTop: SP.xs,
        paddingTop: SP.xs,
        borderTop: `1px solid ${BORDER}`,
        fontFamily: sans,
        fontSize: FS.micro,
        color: MUTED,
        lineHeight: 1.5,
      }}
    >
      <span style={{ color: BODY }}>
        Eligible in {tierLabel(usage.eligibility)}
      </span>
      {' · '}{summary}
      {inferred && (
        <span>
          {' · some historical evidence is inferred by name because the stored record lacks a revision reference'}
        </span>
      )}
    </div>
  );
}
