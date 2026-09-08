/**
 * Exact, session-only context carried from the settlement portrait.
 *
 * This card is intentionally not a RealmItem card. Scene semantics and Herald
 * stories have different identity vocabularies; presenting the recorded scene
 * references directly is more honest than guessing which story "must" match.
 */

import {
  BODY,
  BORDER,
  CARD_ALT,
  FS,
  INK,
  SECOND,
} from '../theme.js';
import Button from '../primitives/Button.jsx';
import { heraldDestinationForSceneAction } from './heraldCommandNavigation.js';

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value : '';
}

function causeText(cause, reference) {
  const displayText = text(cause?.displayText);
  if (displayText) return displayText;
  const effect = text(cause?.effect);
  const sourceRef = text(cause?.sourceRef);
  if (effect && sourceRef) return `${effect}: ${sourceRef}`;
  return effect || sourceRef || `Recorded reference: ${reference}`;
}

export default function HeraldSceneContext({ context, onDismiss }) {
  if (!context) return null;
  const destination = heraldDestinationForSceneAction(context.action);
  if (!destination.action) return null;

  const causes = Array.isArray(context.provenance) ? context.provenance : [];
  const causeById = new Map(causes.map((cause) => [cause.id, cause]));
  const references = Array.isArray(context.provenanceRefs)
    ? context.provenanceRefs
    : [];
  const canonicalKind = text(context.canonicalRef?.kind);
  const canonicalId = text(context.canonicalRef?.id);

  return (
    <section
      aria-label="Settlement portrait context"
      data-testid="herald-scene-context"
      style={{
        display: 'grid',
        gap: 8,
        marginBottom: 12,
        padding: 12,
        border: `1px solid ${BORDER}`,
        borderRadius: 0,
        background: CARD_ALT,
        color: INK,
      }}
    >
      <div style={{ display: 'flex', gap: 8, alignItems: 'start', justifyContent: 'space-between' }}>
        <div>
          <div style={{
            color: SECOND,
            fontSize: FS.micro,
            fontWeight: 850,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
          }}>
            From the settlement portrait
          </div>
          <h2 style={{ margin: '3px 0 0', fontSize: FS.md }}>
            {text(context.label) || context.sceneId}
          </h2>
        </div>
        {onDismiss && (
          <Button
            size="sm"
            variant="ghost"
            aria-label="Dismiss settlement portrait context"
            onClick={onDismiss}
          >
            Dismiss
          </Button>
        )}
      </div>

      <dl
        style={{
          display: 'grid',
          gridTemplateColumns: 'max-content minmax(0, 1fr)',
          gap: '3px 8px',
          margin: 0,
          color: BODY,
          fontSize: FS.xs,
        }}
      >
        <dt style={{ color: INK, fontWeight: 800 }}>Action</dt>
        <dd style={{ margin: 0 }}>{destination.label}</dd>
        <dt style={{ color: INK, fontWeight: 800 }}>Scene</dt>
        <dd style={{ margin: 0, overflowWrap: 'anywhere' }}>{context.sceneId}</dd>
        {context.entityKind && (
          <>
            <dt style={{ color: INK, fontWeight: 800 }}>Kind</dt>
            <dd style={{ margin: 0 }}>{context.entityKind}</dd>
          </>
        )}
        {canonicalKind && canonicalId && (
          <>
            <dt style={{ color: INK, fontWeight: 800 }}>Canonical record</dt>
            <dd style={{ margin: 0, overflowWrap: 'anywhere' }}>
              {canonicalKind}: {canonicalId}
            </dd>
          </>
        )}
      </dl>

      {references.length > 0 && (
        <div style={{ display: 'grid', gap: 4, color: BODY, fontSize: FS.xs }}>
          <strong style={{ color: INK }}>Why this is here</strong>
          <ul style={{ margin: 0, paddingInlineStart: 18 }}>
            {references.map((reference) => {
              const cause = causeById.get(reference);
              return (
                <li key={reference} style={{ marginBottom: 3 }}>
                  {causeText(cause, reference)}
                  {cause?.family ? ` · ${cause.family}` : ''}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <p style={{ margin: 0, color: SECOND, fontSize: FS.micro }}>
        These are the portrait compiler’s recorded references. The Herald has
        not guessed a story identity for this place.
      </p>
    </section>
  );
}
