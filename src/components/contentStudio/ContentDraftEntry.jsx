/**
 * One manifest-aware review card shared by the Surveyor Content Studio.
 * Editing preserves field types instead of converting every value to a string.
 */

import { useId } from 'react';
import { Check, Pencil, X } from 'lucide-react';
import {
  getCustomContentCategory,
  getCustomContentField,
} from '../../domain/content/customContentManifest.js';
import { contentFieldTruth } from '../../domain/content/contentEffectProjection.js';
import {
  INK,
  BODY,
  MUTED,
  BORDER,
  CARD_ALT,
  GOLD,
  SLATE,
  sans,
  SP,
  FS,
} from '../theme.js';
import Badge from '../primitives/Badge.jsx';
import IconButton from '../primitives/IconButton.jsx';
import { FieldLabelBadge } from '../surveyor/surveyorPanelKit.jsx';

const ENTRY_LABEL_TONE = {
  required: 'gold',
  inferred: 'info',
  optional: 'muted',
  uncertain: 'warning',
};

function valuesFor(spec) {
  const raw = spec?.values ?? spec?.enum ?? spec?.options;
  return Array.isArray(raw)
    ? raw.map((entry) => (
      typeof entry === 'string'
        ? { value: entry, label: entry }
        : { value: String(entry?.key ?? entry?.value ?? ''), label: String(entry?.label ?? entry?.key ?? '') }
    )).filter((entry) => entry.value)
    : [];
}

function inputType(spec, value) {
  const kind = spec?.type ?? spec?.valueType;
  if (kind === 'boolean' || kind === 'bool' || typeof value === 'boolean') return 'boolean';
  if (kind === 'number' || typeof value === 'number') return 'number';
  if (kind === 'array' || kind === 'string[]' || Array.isArray(value)) return 'array';
  if (valuesFor(spec).length > 0) return 'enum';
  if (kind === 'text' || spec?.multiline === true) return 'text';
  return 'string';
}

function FieldEditor({ bucket, field, value, onChange }) {
  const controlId = useId();
  const spec = getCustomContentField(bucket, field);
  const type = inputType(spec, value);
  const values = valuesFor(spec);
  const common = {
    'aria-label': `Edit ${field}`,
    style: {
      flex: 1,
      minWidth: 120,
      fontSize: FS.xs,
      fontFamily: sans,
      color: INK,
      border: `1px solid ${BORDER}`,
      padding: `4px ${SP.xs}px`,
      background: '#fff',
    },
  };

  if (type === 'boolean') {
    return (
      <label
        htmlFor={controlId}
        style={{ display: 'inline-flex', alignItems: 'center', gap: SP.xs, fontSize: FS.xs, color: BODY }}
      >
        <input
          id={controlId}
          type="checkbox"
          aria-label={`Edit ${field}`}
          checked={value === true}
          onChange={(event) => onChange(event.target.checked)}
        />
        {value === true ? 'Enabled' : 'Disabled'}
      </label>
    );
  }
  if (type === 'enum') {
    return (
      <select {...common} value={String(value ?? '')} onChange={(event) => onChange(event.target.value)}>
        <option value="">Not set</option>
        {values.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    );
  }
  if (type === 'number') {
    return (
      <input
        {...common}
        type="number"
        min={spec?.min}
        max={spec?.max}
        step={spec?.step ?? 1}
        value={Number.isFinite(value) ? value : ''}
        onChange={(event) => {
          const next = event.target.value;
          onChange(next === '' ? null : Number(next));
        }}
      />
    );
  }
  if (type === 'array') {
    return (
      <input
        {...common}
        value={Array.isArray(value) ? value.join(', ') : String(value ?? '')}
        onChange={(event) => onChange(
          event.target.value.split(',').map((entry) => entry.trim()).filter(Boolean),
        )}
      />
    );
  }
  if (type === 'text') {
    return (
      <textarea
        {...common}
        rows={2}
        value={String(value ?? '')}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }
  return (
    <input
      {...common}
      value={String(value ?? '')}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function displayedValue(value) {
  if (Array.isArray(value)) return value.join(', ');
  if (value && typeof value === 'object') return JSON.stringify(value);
  if (value === true) return 'Yes';
  if (value === false) return 'No';
  return String(value ?? '–');
}

export default function ContentDraftEntry({
  entry: candidate,
  index,
  decision,
  onDecide,
}) {
  const action = decision?.action || 'pending';
  const baseEntry = candidate?.entry && typeof candidate.entry === 'object'
    ? candidate.entry
    : {};
  const edited = decision?.editedFields || {};
  const category = getCustomContentCategory(candidate?.bucket);
  const fieldKeys = Object.keys(baseEntry);
  const setField = (field, value) => onDecide(index, {
    action: 'edit',
    editedFields: { ...edited, [field]: value },
  });

  return (
    <fieldset
      data-testid={`content-entry-${index}`}
      style={{
        border: `1px solid ${action === 'reject' ? BORDER : action === 'approve' ? GOLD : SLATE}`,
        padding: SP.sm,
        margin: 0,
        background: action === 'reject' ? CARD_ALT : '#fff',
        opacity: action === 'reject' ? 0.68 : 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <legend style={{ padding: `0 ${SP.xs}px`, fontSize: FS.xs, color: BODY, fontFamily: sans }}>
        {category?.singular || category?.label || candidate?.bucket || `Entry ${index + 1}`}
        {baseEntry.name ? `: ${baseEntry.name}` : ''}
      </legend>

      <div style={{ display: 'flex', alignItems: 'center', gap: SP.xs, flexWrap: 'wrap' }}>
        {candidate?.label && (
          <Badge tone={ENTRY_LABEL_TONE[candidate.label] || 'muted'} size="sm">
            {candidate.label}
          </Badge>
        )}
        <span style={{ fontSize: FS.xs, color: candidate?.sourced ? GOLD : MUTED }}>
          {candidate?.sourced ? '◆ stated in your request' : '◇ inferred by the compiler'}
        </span>
        <span style={{ flex: 1 }} />
        <div role="radiogroup" aria-label={`Decision for ${baseEntry.name || `entry ${index + 1}`}`} style={{ display: 'flex', gap: 2 }}>
          <IconButton
            Icon={Check}
            label="Approve this entry"
            size="sm"
            tone={action === 'approve' ? 'active' : 'default'}
            pressed={action === 'approve'}
            onClick={() => onDecide(index, { action: 'approve' })}
          />
          <IconButton
            Icon={Pencil}
            label="Edit this entry"
            size="sm"
            tone={action === 'edit' ? 'active' : 'default'}
            pressed={action === 'edit'}
            onClick={() => onDecide(index, { action: 'edit', editedFields: edited })}
          />
          <IconButton
            Icon={X}
            label="Reject this entry"
            size="sm"
            tone={action === 'reject' ? 'active' : 'default'}
            pressed={action === 'reject'}
            onClick={() => onDecide(index, { action: 'reject' })}
          />
        </div>
      </div>

      {candidate?.rationale && (
        <p style={{ margin: 0, fontSize: FS.xs, color: MUTED, lineHeight: 1.45 }}>
          {candidate.rationale}
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {fieldKeys.map((field) => {
          const value = action === 'edit' && field in edited
            ? edited[field]
            : baseEntry[field];
          const truth = contentFieldTruth(candidate?.bucket, field, value);
          const editable = action === 'edit' && truth.label !== 'unsupported';
          return (
            <div key={field} style={{ display: 'flex', alignItems: 'center', gap: SP.xs, flexWrap: 'wrap' }}>
              <span style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans, minWidth: 92 }}>
                {field.replace(/([A-Z])/g, ' $1')}
              </span>
              <FieldLabelBadge kind={truth.label} />
              {editable ? (
                <FieldEditor
                  bucket={candidate?.bucket}
                  field={field}
                  value={value}
                  onChange={(next) => setField(field, next)}
                />
              ) : (
                <span style={{ fontSize: FS.xs, color: truth.label === 'unsupported' ? MUTED : BODY, fontFamily: sans }}>
                  {displayedValue(value)}
                </span>
              )}
              {truth.explanation && (
                <span style={{ flexBasis: '100%', marginLeft: 100, fontSize: FS.micro, color: MUTED, lineHeight: 1.35 }}>
                  {truth.explanation}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
