/**
 * Editable - content primitives that render as extractable prose by default,
 * with an opt-in form-field mode for DM scratch space.
 *
 * Two flavors:
 *   <EditableText name=... defaultValue=... style=... />     single-line content,
 *       used for names, titles, short labels, one-liners.
 *   <EditableProse name=... defaultValue=... style=... />    multi-line content,
 *       used for descriptions, blurbs, plot hooks, suggested fixes, NPC bios.
 *
 * Design intent (v2):
 *   The DM (and pdftotext / search / screen readers) MUST be able to see and
 *   extract the engine's prose. The original implementation wrapped every
 *   default value in a `TextInput` so it was click-to-edit in PDF readers -
 *   but TextInput defaults are not part of the PDF text stream, so anyone
 *   running the dossier through `pdftotext`, an AI summarizer, full-text
 *   search, or accessibility tooling saw blank where the engine output
 *   should have been. That trade was a net loss: the editing affordance
 *   was rarely used, and the extraction failure was a constant complaint.
 *
 *   The new contract:
 *     - Default mode renders plain `Text`. Engine prose IS the document.
 *     - `showField` opt-in renders a `TextInput` with visible chrome for
 *       the few places we actually want a writable empty field
 *       (`NotesField` - the DM scratch box).
 *
 * Conventions (preserved):
 *   - `name` kept on the prop signature so callers don't need to change.
 *     It's only consumed when we actually emit a TextInput.
 *   - `defaultValue` is the engine output. Rendered as Text by default.
 *   - `style` accepts the same StyleSheet shape as Text.
 *   - `lines` is only meaningful in showField mode (controls minHeight).
 *   - `showField` opts back IN to the form-field treatment.
 */
import { TextInput, View, Text } from '@react-pdf/renderer';
import { palette, type, pt } from '../theme.js';
import { noLig } from '../lib/format.js';

// Visible-field treatment (only used when `showField=true`, i.e. NotesField).
const FIELD_BG = '#fdf9f0';

function safeName(raw) {
  if (!raw) return `f_${Math.random().toString(36).slice(2, 9)}`;
  return String(raw).replace(/[^a-zA-Z0-9_.-]/g, '_').slice(0, 80);
}

function pickFontSize(style) {
  if (!style) return 10;
  if (Array.isArray(style)) {
    for (const s of style) {
      if (s && typeof s.fontSize === 'number') return s.fontSize;
    }
    return 10;
  }
  return typeof style.fontSize === 'number' ? style.fontSize : 10;
}

function flatStyle(style) {
  if (!style) return {};
  if (!Array.isArray(style)) return style;
  return style.reduce((a, s) => ({ ...a, ...(s || {}) }), {});
}

export function EditableText({
  name,
  defaultValue = '',
  style,
  hideIfEmpty = true,   // default: do not render empty content
  showField = false,    // opt-in: render as a writable form field instead
  fallback,             // placeholder when empty AND showField
  maxLength,            // only meaningful in showField mode
}) {
  const raw = defaultValue == null ? '' : String(defaultValue);
  const value = noLig(raw);
  if (hideIfEmpty && !value.trim()) return null;

  // Default path: plain Text. This is what every section uses for engine
  // prose. Visible to pdftotext, search, screen readers, AI summarizers.
  if (!showField) {
    return <Text style={style}>{value}</Text>;
  }

  // Opt-in form-field path (NotesField etc.).
  const fs = pickFontSize(style);
  const flat = flatStyle(style);
  const fieldStyle = {
    fontFamily: flat.fontFamily || 'Lora',
    color: flat.color || palette.ink,
    fontWeight: flat.fontWeight || 400,
    fontStyle: flat.fontStyle || 'normal',
    backgroundColor: FIELD_BG,
    paddingHorizontal: 2,
    paddingVertical: 0,
    minHeight: fs * 1.4,
    borderBottom: `0.4pt dotted ${palette.border}`,
  };
  return (
    <TextInput
      name={safeName(name)}
      defaultValue={value || (fallback ? noLig(fallback) : '')}
      fontSize={fs}
      maxLength={maxLength}
      style={fieldStyle}
    />
  );
}

export function EditableProse({
  name,
  defaultValue = '',
  style,
  lines = 3,
  hideIfEmpty = true,   // default: do not render empty content
  showField = false,    // opt-in: render as a writable form field instead
  maxLength,            // only meaningful in showField mode
}) {
  const raw = defaultValue == null ? '' : String(defaultValue);
  const value = noLig(raw);
  if (hideIfEmpty && !value.trim()) return null;

  const flat = flatStyle(style);
  const lineHeight = flat.lineHeight || 1.45;

  // Default path: plain Text with the caller's style + sane line-height.
  if (!showField) {
    const proseStyle = {
      fontFamily: flat.fontFamily || 'Lora',
      color: flat.color || palette.second,
      fontWeight: flat.fontWeight || 400,
      fontStyle: flat.fontStyle || 'normal',
      lineHeight,
      ...(flat.fontSize ? { fontSize: flat.fontSize } : {}),
    };
    return <Text style={proseStyle}>{value}</Text>;
  }

  // Opt-in form-field path.
  const fs = pickFontSize(style);
  const minHeight = Math.ceil(fs * lineHeight * lines + 6);
  const fieldStyle = {
    fontFamily: flat.fontFamily || 'Lora',
    color: flat.color || palette.second,
    fontWeight: flat.fontWeight || 400,
    fontStyle: flat.fontStyle || 'normal',
    lineHeight,
    backgroundColor: FIELD_BG,
    paddingHorizontal: 4,
    paddingVertical: 2,
    minHeight,
    border: `0.4pt solid ${palette.border}`,
    borderRadius: 1,
  };
  return (
    <TextInput
      name={safeName(name)}
      defaultValue={value}
      multiline
      fontSize={fs}
      maxLength={maxLength}
      style={fieldStyle}
    />
  );
}

/**
 * EditableLine - a labeled single-line input for definition-list rows.
 * Renders: [Label]   [Editable value]
 */
export function EditableLine({ label, name, defaultValue = '', labelWidth = 110, style }) {
  if (!String(defaultValue || '').trim()) return null;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 3 }}>
      <Text style={{ ...type.label, width: labelWidth, color: palette.muted, fontSize: pt['8'] }}>
        {label}
      </Text>
      <View style={{ flex: 1 }}>
        <EditableText name={name} defaultValue={defaultValue} style={style} />
      </View>
    </View>
  );
}

/**
 * NotesField - blank multi-line field for DM handwritten notes. This is
 * the ONE place we deliberately want visible field chrome - the DM expects
 * empty space to write in. Default ~6 lines.
 */
export function NotesField({ name, lines = 6, label = 'NOTES' }) {
  return (
    <View style={{ marginTop: 6 }}>
      {label && (
        <Text style={{ ...type.label, color: palette.muted, fontSize: pt['7.5'], marginBottom: 3 }}>
          {label}
        </Text>
      )}
      <EditableProse
        name={name}
        defaultValue=""
        lines={lines}
        showField
        hideIfEmpty={false}
      />
    </View>
  );
}

export default EditableText;
