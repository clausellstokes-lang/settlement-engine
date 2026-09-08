/**
 * ReadOnlyCustomContentList.jsx
 *
 * The free-tier view for authored content that predates the premium gate.
 * Keeping this browser separate from the authoring manager makes the access
 * boundary explicit: it can select and inspect local definitions, but it has
 * no command writer and therefore cannot mutate their revision history.
 */
import { useState } from 'react';
import {
  BORDER as BOR,
  CARD,
  FS,
  INK,
  MUTED as MUT,
  SECOND as SEC,
  serif_,
} from '../theme.js';
import { useStore } from '../../store/index.js';
import Button from '../primitives/Button.jsx';
import { Tag } from './primitives.jsx';
import { CUSTOM_CATEGORIES } from './customCategoryDefs.js';

export default function ReadOnlyCustomContentList({ search, initialCat }) {
  const customContent = useStore(state => state.customContent);
  // Seed the active bucket from a validated ?cat= deep-link; institutions otherwise.
  const [activeCat, setActiveCat] = useState(() => (
    initialCat && CUSTOM_CATEGORIES.some(category => category.key === initialCat)
      ? initialCat
      : 'institutions'
  ));
  const category = CUSTOM_CATEGORIES.find(candidate => candidate.key === activeCat);
  const items = customContent[activeCat] || [];
  const filtered = search
    ? items.filter(item => (
        (item.name || '').toLowerCase().includes(search)
        || (item.description || '').toLowerCase().includes(search)
      ))
    : items;
  const totalLocal = Object.values(customContent).reduce(
    (sum, entries) => sum + (entries?.length || 0),
    0,
  );

  if (totalLocal === 0) return null;

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{
        fontSize: FS.xs,
        fontWeight: 700,
        color: MUT,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: 8,
      }}>
        Grandfathered items &middot; read only
      </div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
        {CUSTOM_CATEGORIES.map(candidate => {
          const count = (customContent[candidate.key] || []).length;
          if (count === 0) return null;
          return (
            <Button
              key={candidate.key}
              variant="ghost"
              size="sm"
              aria-pressed={activeCat === candidate.key}
              onClick={() => setActiveCat(candidate.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 10px',
                minHeight: 44,
                fontSize: FS.xs,
                fontWeight: activeCat === candidate.key ? 700 : 500,
                fontFamily: 'inherit',
                cursor: 'pointer',
                border: `1px solid ${activeCat === candidate.key ? candidate.color : BOR}`,
                borderRadius: 0,
                background: activeCat === candidate.key ? `${candidate.color}14` : 'transparent',
                color: activeCat === candidate.key ? candidate.color : SEC,
              }}
            >
              {candidate.label}
              <span style={{
                fontSize: FS.micro,
                fontWeight: 700,
                background: `${candidate.color}20`,
                color: candidate.color,
                padding: '0 4px',
                marginLeft: 2,
              }}>
                {count}
              </span>
            </Button>
          );
        })}
      </div>
      {filtered.length === 0 ? (
        <div style={{ padding: '14px', textAlign: 'center', fontSize: FS.sm, color: MUT }}>
          No items in {category.label.toLowerCase()}.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filtered.map(item => (
            <div
              key={item.id}
              style={{
                border: `1px solid ${BOR}`,
                borderLeft: '3px solid #7c3aed',
                padding: '8px 12px',
                background: CARD,
                opacity: 0.85,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  fontFamily: serif_,
                  fontSize: FS.md,
                  fontWeight: 700,
                  color: INK,
                  flex: 1,
                }}>
                  {item.name}
                </span>
                <Tag label="Local" color="#7c3aed" />
                {item.category && <Tag label={item.category} color={category.color} />}
              </div>
              {item.description && (
                <div style={{ fontSize: FS.xs, color: SEC, lineHeight: 1.4, marginTop: 4 }}>
                  {item.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
