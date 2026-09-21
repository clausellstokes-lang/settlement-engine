/**
 * Manual custom-content editor.
 *
 * The canonical manifest owns field admission and bounded enum values. This
 * component adds only human-facing controls, explanations, dependency pickers,
 * the interpretation receipt, and the same-seed taste gate. Keeping the form
 * in a leaf prevents the Compendium manager from becoming a second schema.
 */

import {
  DEITY_ALIGNMENT,
  DEITY_LAW,
  DEITY_TIER,
  satisfiesOptions,
} from '../../domain/customContentSchema.js';
import { td } from '../../copy/deityAuthoring.js';
import {
  contentFieldTruth,
} from '../../domain/content/contentEffectProjection.js';
import { getCustomContentField } from '../../domain/content/customContentManifest.js';
import CategorySelect from '../primitives/CategorySelect.jsx';
import Button from '../primitives/Button.jsx';
import { FieldLabelBadge } from '../surveyor/surveyorPanelKit.jsx';
import {
  BORDER as BOR,
  CARD,
  FS,
  INK,
  MUTED as MUT,
  SECOND as SEC,
  sans,
  swatch,
} from '../theme.js';
import ContentInterpretation from '../contentStudio/ContentInterpretation.jsx';
import ContentSampleReceipt from '../contentStudio/ContentSampleReceipt.jsx';
import CustomContentCommitControls from './CustomContentCommitControls.jsx';
import DeityEffectPreview from './DeityEffectPreview.jsx';
import { DependenciesSection } from './Dependencies.jsx';
import { t } from '../../copy/index.js';
import {
  CUSTOM_CONTENT_CHARSET_HINTS as CHARSET_HINTS,
  CUSTOM_CONTENT_CHARSET_SURFACE_KEY as CHARSET_SURFACE_KEY,
  CUSTOM_CONTENT_FIELD_HINTS as FIELD_HINTS,
  CUSTOM_CONTENT_FIELD_LABELS as FIELD_LABELS,
} from './customContentEditorCopy.js';
import useIsMobile from '../../hooks/useIsMobile.js';
import { chromeFontSize, proseFontSize } from '../../design/proseScale.js';

const ESSENTIAL_FIELDS = Object.freeze(['name', 'category', 'description']);

// These legacy arrays contribute copy only. The manifest supplies the admitted
// enum values below, so adding or removing an option has one semantic authority.
const ENUM_LABELS = Object.freeze({
  alignmentAxis: Object.freeze(Object.fromEntries(
    DEITY_ALIGNMENT.map(option => [option.key, option.label]),
  )),
  lawAxis: Object.freeze(Object.fromEntries(
    DEITY_LAW.map(option => [option.key, option.label]),
  )),
  rankAxis: Object.freeze(Object.fromEntries(
    DEITY_TIER.map(option => [option.key, option.label]),
  )),
});

const CONTROL_STYLE = Object.freeze({
  width: '100%',
  padding: '5px 8px',
  border: `1px solid ${BOR}`,
  fontSize: FS.sm,
  fontFamily: sans,
  color: INK,
  outline: 'none',
  background: CARD,
});

function humanize(value) {
  return String(value || '')
    .split('-')
    .map(word => (word ? word[0].toUpperCase() + word.slice(1) : word))
    .join(' ');
}

function listValue(value) {
  if (Array.isArray(value)) return value;
  if (typeof value !== 'string' || !value.trim()) return [];
  return value.split(',').map(entry => entry.trim()).filter(Boolean);
}

/**
 * An untouched control has no value to validate yet. Its badge should explain
 * the field contract ("Presentation", "Conditional", and so on), not claim the
 * registered field is unsupported because `undefined` is not persistable.
 * Once the author enters a value, the value-aware classifier takes over.
 */
function hasAuthoredValue(value) {
  if (value == null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

function ChoicePills({ field, options, draft, setDraft, accent }) {
  const mobile = useIsMobile();
  const selected = new Set(listValue(draft[field]));
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, padding: '4px 0' }}>
      {options.map(option => {
        const active = selected.has(option);
        return (
          <Button
            key={option}
            variant={active ? 'gold' : 'secondary'}
            size="sm"
            aria-pressed={active}
            onClick={() => {
              const next = new Set(selected);
              if (active) next.delete(option);
              else next.add(option);
              setDraft(current => ({ ...current, [field]: Array.from(next) }));
            }}
            style={{
              padding: '2px 8px',
              fontSize: chromeFontSize(FS.xxs, mobile),
              minHeight: 0,
              letterSpacing: '0.03em',
              border: `1px solid ${active ? accent : BOR}`,
              background: active ? `${accent}14` : 'transparent',
              color: active ? accent : SEC,
            }}
          >
            {humanize(option)}
          </Button>
        );
      })}
    </div>
  );
}

function EnumSelect({
  id,
  labelledBy,
  value,
  options,
  labels = {},
  placeholder = 'Not set',
  onChange,
}) {
  return (
    <select
      id={id}
      aria-labelledby={labelledBy}
      value={value || ''}
      onChange={onChange}
      style={CONTROL_STYLE}
    >
      <option value="">{placeholder}</option>
      {options.map(option => (
        <option key={option} value={option}>
          {labels[option] || humanize(option)}
        </option>
      ))}
    </select>
  );
}

function BooleanToggle({ field, draft, setDraft }) {
  const active = draft[field] === true;
  const accent = field === 'essential'
    ? swatch.success
    : field === 'magical'
      ? swatch.magic
      : swatch.danger;
  return (
    <Button
      variant={active ? 'gold' : 'secondary'}
      size="sm"
      aria-pressed={active}
      onClick={() => setDraft(current => ({ ...current, [field]: !active }))}
      style={active
        ? {
            border: `1px solid ${accent}`,
            background: `${accent}14`,
            color: accent,
          }
        : undefined}
    >
      {active ? 'Enabled' : 'Not enabled'}
    </Button>
  );
}

function CustomContentFieldControl({
  activeCat,
  customContent,
  draft,
  field,
  labelledBy,
  setDraft,
}) {
  const mobile = useIsMobile();
  const id = `ccm-field-${field}`;
  const value = draft[field] ?? '';
  const spec = getCustomContentField(activeCat, field);
  const change = event => {
    setDraft(current => ({ ...current, [field]: event.target.value }));
  };

  if (field === 'category') {
    return (
      <CategorySelect
        id={id}
        ariaLabelledBy={labelledBy}
        type={activeCat}
        value={value}
        customContent={customContent}
        onChange={next => setDraft(current => ({ ...current, category: next }))}
        maxLength={spec?.maxLength}
        style={CONTROL_STYLE}
      />
    );
  }
  if (field === 'satisfies') {
    return (
      <CategorySelect
        id={id}
        ariaLabelledBy={labelledBy}
        options={satisfiesOptions(customContent)}
        value={value}
        onChange={next => setDraft(current => ({ ...current, satisfies: next }))}
        placeholder="Does not fold into a trade category"
        newLabel="+ Other category…"
        maxLength={spec?.maxLength}
        style={CONTROL_STYLE}
      />
    );
  }
  if (spec?.type === 'boolean') {
    return (
      <BooleanToggle field={field} draft={draft} setDraft={setDraft} />
    );
  }
  if (
    spec?.type === 'string-or-string-list'
    && Array.isArray(spec.values)
  ) {
    return (
      <ChoicePills
        field={field}
        options={spec.values}
        draft={draft}
        setDraft={setDraft}
        accent={swatch.danger}
      />
    );
  }
  if (field === 'portfolio' || field === 'epithet') {
    const maxLength = spec?.maxLength;
    const placeholder = field === 'portfolio'
      ? td('form.portfolioPlaceholder')
      : 'A short flavour line, such as “kept since the first hearth was lit”.';
    return (
      <>
        <textarea
          id={id}
          aria-labelledby={labelledBy}
          value={value}
          onChange={change}
          rows={2}
          maxLength={maxLength}
          placeholder={placeholder}
          style={{ ...CONTROL_STYLE, resize: 'vertical' }}
        />
        <div style={{
          textAlign: 'right',
          fontSize: chromeFontSize(FS.micro, mobile),
          color: MUT,
          marginTop: 2,
        }}>
          {String(value).length}
          {maxLength != null ? ` / ${maxLength}` : ''}
        </div>
      </>
    );
  }
  if (field === 'description') {
    return (
      <textarea
        id={id}
        aria-labelledby={labelledBy}
        value={value}
        onChange={change}
        rows={2}
        maxLength={spec?.maxLength}
        placeholder="Description…"
        style={{ ...CONTROL_STYLE, resize: 'vertical' }}
      />
    );
  }
  if (spec?.type === 'enum' && Array.isArray(spec.values)) {
    return (
      <EnumSelect
        id={id}
        labelledBy={labelledBy}
        value={field === 'lawAxis' ? value || 'neutral' : value}
        options={spec.values}
        labels={ENUM_LABELS[field]}
        placeholder={field === 'tierMin'
          ? 'Any tier'
          : field === 'tierMax'
            ? 'No upper limit'
            : field === 'motifElement'
              ? 'Any founding image…'
              : field === 'motifAct'
                ? 'Any observance…'
                : 'Select…'}
        onChange={change}
      />
    );
  }
  return (
    <input
      id={id}
      aria-labelledby={labelledBy}
      value={value}
      onChange={change}
      maxLength={spec?.maxLength ?? spec?.itemMaxLength}
      placeholder={humanize(field)}
      style={CONTROL_STYLE}
    />
  );
}

/**
 * The charset findings for one field, beside that field.
 *
 * NEVER A SILENT STRIP. The wall reports; the author decides. The Normalise
 * action is offered only where the leaf measured that normalising the whole
 * string would clear its findings, and it rewrites the DRAFT alone.
 */
function CharsetFieldRejections({ field, rejections, draft, setDraft }) {
  const mobile = useIsMobile();
  const mine = rejections.filter(entry => entry.field === field);
  if (mine.length === 0) return null;
  const normalisable = mine.some(entry => entry.nfcWouldPass === true);
  const value = draft[field];
  return (
    <div role="alert" style={{ marginTop: 4 }}>
      {mine.map((entry, index) => (
        <div
          key={`${entry.code}-${entry.index === undefined ? index : entry.index}`}
          style={{ fontSize: proseFontSize(FS.micro, mobile), color: SEC, lineHeight: 1.4 }}
        >
          {t(CHARSET_HINTS[entry.code] || CHARSET_HINTS.uncovered_codepoint, {
            char: entry.char,
            position: entry.position,
            max: entry.max,
            actual: entry.actual,
            surfaceName: entry.surface
              ? t(`${CHARSET_SURFACE_KEY}.${entry.surface}`)
              : '',
          })}
        </div>
      ))}
      {normalisable && typeof value === 'string' && (
        <Button
          type="button"
          variant="ghost"
          onClick={() => setDraft(prev => ({ ...prev, [field]: value.normalize('NFC') }))}
        >
          {t('errors.customContentCharset.normalise')}
        </Button>
      )}
    </div>
  );
}

function EditorField({
  activeCat,
  charsetRejections,
  customContent,
  draft,
  field,
  setDraft,
}) {
  const mobile = useIsMobile();
  const headingId = `ccm-field-label-${field}`;
  const spec = getCustomContentField(activeCat, field);
  const fieldValue = draft[field];
  const truth = hasAuthoredValue(fieldValue)
    ? contentFieldTruth(activeCat, field, fieldValue)
    : contentFieldTruth(activeCat, field);
  const grouped = spec?.type === 'boolean'
    || (
      spec?.type === 'string-or-string-list'
      && Array.isArray(spec.values)
    );
  const heading = (
    <span id={headingId} style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      flexWrap: 'wrap',
      marginBottom: 2,
    }}>
      {FIELD_LABELS[field] || field.replace(/([A-Z])/g, ' $1')}
      <FieldLabelBadge
        kind={truth.label}
      />
    </span>
  );
  const labelStyle = {
    fontSize: chromeFontSize(FS.xxs, mobile),
    fontWeight: 700,
    color: MUT,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  };
  const control = (
    <CustomContentFieldControl
      activeCat={activeCat}
      customContent={customContent}
      draft={draft}
      field={field}
      labelledBy={headingId}
      setDraft={setDraft}
    />
  );

  return (
    <div>
      {grouped ? (
        <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
          <legend style={labelStyle}>{heading}</legend>
          {control}
        </fieldset>
      ) : (
        <>
          <div style={labelStyle}>{heading}</div>
          {control}
        </>
      )}
      {FIELD_HINTS[field] && (
        <div style={{
          fontSize: proseFontSize(FS.micro, mobile),
          color: MUT,
          fontStyle: 'italic',
          marginTop: 2,
          lineHeight: 1.4,
        }}>
          {FIELD_HINTS[field]}
        </div>
      )}
      <CharsetFieldRejections
        field={field}
        rejections={charsetRejections}
        draft={draft}
        setDraft={setDraft}
      />
    </div>
  );
}

export default function CustomContentEditor({
  activeCat,
  catDef,
  charsetRejections = [],
  customContent,
  definitionReady,
  draft,
  editingId,
  forgeManualSample,
  handleSave,
  manualInterpretation,
  manualSample,
  manualSampleBusy,
  manualSampleCurrent,
  manualSampleError,
  resetDraft,
  saveBusy,
  setDraft,
  setShowAdvanced,
  showAdvanced,
}) {
  const mobile = useIsMobile();
  const usesDisclosure = activeCat !== 'deities' && activeCat !== 'traditions';
  const essentials = usesDisclosure
    ? catDef.fields.filter(field => ESSENTIAL_FIELDS.includes(field))
    : catDef.fields;
  const advanced = usesDisclosure
    ? catDef.fields.filter(field => !ESSENTIAL_FIELDS.includes(field))
    : [];
  const singular = catDef.singular || catDef.label.slice(0, -1);
  const renderField = field => (
    <EditorField
      key={field}
      activeCat={activeCat}
      charsetRejections={charsetRejections}
      customContent={customContent}
      draft={draft}
      field={field}
      setDraft={setDraft}
    />
  );

  return (
    <div style={{
      padding: '10px 12px',
      background: swatch['#F8F4FF'],
      border: `1px solid ${swatch.magic}40`,
      marginBottom: 10,
    }}>
      <div style={{
        fontSize: chromeFontSize(FS.xs, mobile),
        fontWeight: 700,
        color: swatch.magic,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: 8,
      }}>
        {editingId ? 'Edit item' : `New custom ${singular}`}
      </div>
      {activeCat === 'deities' && (
        <div style={{
          fontSize: proseFontSize(FS.xs, mobile),
          color: SEC,
          lineHeight: 1.5,
          marginBottom: 8,
        }}>
          {td('form.intro')}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {essentials.map(renderField)}
      </div>
      {advanced.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <Button
            variant="ghost"
            size="sm"
            aria-expanded={showAdvanced}
            onClick={() => setShowAdvanced(current => !current)}
          >
            {showAdvanced ? 'Hide' : 'Show'} advanced attributes ({advanced.length})
          </Button>
          {showAdvanced && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              marginTop: 8,
            }}>
              {advanced.map(renderField)}
            </div>
          )}
        </div>
      )}

      {activeCat === 'deities' && (
        <>
          <div style={{
            fontSize: proseFontSize(FS.micro, mobile),
            color: MUT,
            fontStyle: 'italic',
            marginTop: 6,
            lineHeight: 1.4,
          }}>
            {td('form.temperNote')}
          </div>
          <DeityEffectPreview draft={draft} />
        </>
      )}

      {Array.isArray(catDef.dependencies) && catDef.dependencies.length > 0 && (
        <DependenciesSection
          deps={catDef.dependencies}
          draft={draft}
          setDraft={setDraft}
        />
      )}

      {draft.name && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          marginTop: 10,
        }}>
          <ContentInterpretation interpretation={manualInterpretation} />
          <Button
            variant="secondary"
            size="sm"
            busy={manualSampleBusy}
            disabled={manualSampleBusy || !definitionReady}
            onClick={forgeManualSample}
          >
            Forge unsaved sample
          </Button>
          {manualSampleError && (
            <div
              role="alert"
              style={{ fontSize: chromeFontSize(FS.xs, mobile), color: MUT, fontFamily: sans }}
            >
              {manualSampleError}
            </div>
          )}
          <ContentSampleReceipt sample={manualSample} />
        </div>
      )}

      <CustomContentCommitControls
        definitionReady={definitionReady}
        draft={draft}
        editingId={editingId}
        handleSave={handleSave}
        manualSampleCurrent={manualSampleCurrent}
        resetDraft={resetDraft}
        saveBusy={saveBusy}
      />
    </div>
  );
}
