/**
 * GalleryDescriptionEditor — lightweight rich-text editor for gallery
 * descriptions (§4c). Contenteditable + a small formatting toolbar
 * (bold/italic/underline, heading, bulleted/numbered list, link, clear).
 * Every change is run through sanitizeGalleryHtml before it leaves the
 * component, so the stored value is always safe HTML. Uncontrolled body
 * (innerHTML seeded once) to avoid caret jumps; emits sanitized HTML.
 *
 * Links use an inline URL field (no native window.prompt — banned project-wide),
 * saving + restoring the editor selection so the URL applies to the chosen text.
 */
import { useRef, useEffect, useState } from 'react';
import { Bold, Italic, Underline, Heading, List, ListOrdered, Link2, Eraser, Check, X } from 'lucide-react';

import { sanitizeGalleryHtml } from '../lib/sanitizeGalleryHtml.js';
import { BORDER2, CARD, CARD_ALT, INK, R, FS, sans } from './theme.js';

const exec = (cmd, value = null) => {
  try { document.execCommand(cmd, false, value); } catch { /* command unsupported */ }
};

function ToolbarButton({ icon: Icon, title, onMouseDown }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={onMouseDown}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 26, height: 26, border: `1px solid ${BORDER2}`, borderRadius: R.sm,
        background: CARD, color: INK, cursor: 'pointer',
      }}
    >
      <Icon size={13} />
    </button>
  );
}

export default function GalleryDescriptionEditor({ value = '', onChange, maxLength = 4000 }) {
  const ref = useRef(null);
  const savedRange = useRef(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkOpen, setLinkOpen] = useState(false);

  // Seed the editable once; thereafter it's uncontrolled (sanitized on emit).
  useEffect(() => {
    if (ref.current) ref.current.innerHTML = sanitizeGalleryHtml(value || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emit = () => {
    onChange?.(sanitizeGalleryHtml(ref.current?.innerHTML || '').slice(0, maxLength));
  };

  // mousedown + preventDefault keeps the selection inside the editable so
  // execCommand applies to it rather than blurring first.
  const cmd = (e, command, val) => { e.preventDefault(); exec(command, val); emit(); };

  const saveSelection = () => {
    const sel = typeof window !== 'undefined' ? window.getSelection() : null;
    if (sel && sel.rangeCount && ref.current && ref.current.contains(sel.anchorNode)) {
      savedRange.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const openLink = (e) => { e.preventDefault(); saveSelection(); setLinkUrl(''); setLinkOpen(true); };

  const applyLink = () => {
    const url = linkUrl.trim();
    setLinkOpen(false);
    if (!url) return;
    const sel = typeof window !== 'undefined' ? window.getSelection() : null;
    if (savedRange.current && sel) { sel.removeAllRanges(); sel.addRange(savedRange.current); }
    ref.current?.focus();
    exec('createLink', url);
    emit();
  };

  return (
    <div style={{ border: `1px solid ${BORDER2}`, borderRadius: R.md, background: CARD, overflow: 'hidden' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, padding: 5, background: CARD_ALT, borderBottom: `1px solid ${BORDER2}`, alignItems: 'center' }}>
        <ToolbarButton icon={Bold} title="Bold" onMouseDown={(e) => cmd(e, 'bold')} />
        <ToolbarButton icon={Italic} title="Italic" onMouseDown={(e) => cmd(e, 'italic')} />
        <ToolbarButton icon={Underline} title="Underline" onMouseDown={(e) => cmd(e, 'underline')} />
        <ToolbarButton icon={Heading} title="Heading" onMouseDown={(e) => cmd(e, 'formatBlock', 'h3')} />
        <ToolbarButton icon={List} title="Bulleted list" onMouseDown={(e) => cmd(e, 'insertUnorderedList')} />
        <ToolbarButton icon={ListOrdered} title="Numbered list" onMouseDown={(e) => cmd(e, 'insertOrderedList')} />
        <ToolbarButton icon={Link2} title="Add link" onMouseDown={openLink} />
        <ToolbarButton icon={Eraser} title="Clear formatting" onMouseDown={(e) => cmd(e, 'removeFormat')} />
        {linkOpen && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginLeft: 4 }}>
            <input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); applyLink(); }
                if (e.key === 'Escape') setLinkOpen(false);
              }}
              placeholder="https://…"
              aria-label="Link URL"
              // eslint-disable-next-line jsx-a11y/no-autofocus -- focus the URL field when the link popover opens so the user can type immediately
              autoFocus
              style={{ width: 150, border: `1px solid ${BORDER2}`, borderRadius: R.sm, padding: '2px 6px', fontFamily: sans, fontSize: FS.xxs, color: INK }}
            />
            <ToolbarButton icon={Check} title="Apply link" onMouseDown={(e) => { e.preventDefault(); applyLink(); }} />
            <ToolbarButton icon={X} title="Cancel" onMouseDown={(e) => { e.preventDefault(); setLinkOpen(false); }} />
          </span>
        )}
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label="Gallery description"
        onInput={emit}
        onBlur={emit}
        style={{ minHeight: 80, maxHeight: 220, overflowY: 'auto', padding: 9, fontFamily: sans, fontSize: FS.xs, color: INK, lineHeight: 1.5, outline: 'none' }}
      />
    </div>
  );
}
