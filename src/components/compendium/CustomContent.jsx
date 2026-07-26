import { useEffect, useMemo, useRef, useState } from 'react';
import { INK, BODY, MUTED as MUT, SECOND as SEC, BORDER as BOR, CARD, serif_, FS, SP, swatch } from '../theme.js';
import { Plus, Edit3, Trash2, Copy, Wand2, X } from 'lucide-react';
import { deityTemper } from '../../domain/worldPulse/deityAxes.js';
import PantheonActivationStrip from './PantheonActivationStrip.jsx';
import FactionEventBanner from './FactionEventBanner.jsx';
import ContentPackBar from './ContentPackBar.jsx';
import CustomContentEditor from './CustomContentEditor.jsx';
import CustomContentUsageEcho from './CustomContentUsageEcho.jsx';
import SupplyChainsManager from './SupplyChainsManager.jsx';
import { AUTHORING_LANES } from './customCategories.js';
import { useStore } from '../../store/index.js';
import { t } from '../../copy/index.js';
import { navigate } from '../../hooks/useRoute.js';
import { buildRegistry } from '../../lib/customRegistry.js';
import DeleteConfirmation from '../DeleteConfirmation';
import { Tag } from './primitives.jsx';
import { DependencySummary } from './Dependencies.jsx';
import Button from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';
import { projectContentEffects } from '../../domain/content/contentEffectProjection.js';
import {
  admitCustomContentDefinition,
  getCustomContentCategory,
} from '../../domain/content/customContentManifest.js';
import { fingerprintContent } from '../../domain/content/contentFingerprint.js';
import {
  ArchivedContentLibrary,
  ContentDefinitionHistory,
} from '../contentStudio/CustomContentLifecycle.jsx';
import ContentEnvironmentLifecycle from '../contentStudio/ContentEnvironmentLifecycle.jsx';
import CampaignContentBindingLifecycle from '../contentStudio/CampaignContentBindingLifecycle.jsx';
export { default as ReadOnlyCustomContentList } from './ReadOnlyCustomContentList.jsx';
import ReadOnlyCustomContentList from './ReadOnlyCustomContentList.jsx';
// CustomItemAttributes + CustomContentUpsell live in leaf modules so this
// manager stays under the component-size ratchet; re-exported for existing
// import sites.
export { CustomItemAttributes } from './CustomItemAttributes.jsx';
import { CustomItemAttributes } from './CustomItemAttributes.jsx';
export { CustomContentUpsell } from './CustomContentGate.jsx';
import { CustomContentUpsell } from './CustomContentGate.jsx';

// ── Custom Content Manager ──────────────────────────────────────────────────

// The category defs (icons/colours/fields) live in a leaf so this manager
// stays under the component-size ratchet; re-exported for existing import sites.
export { CUSTOM_CATEGORIES } from './customCategoryDefs.js';
import { CUSTOM_CATEGORIES, CATEGORY_BY_KEY } from './customCategoryDefs.js';

// Clone a prebuilt registry seed into an editable draft — the registry entry's
// stable display fields mapped onto the form's draft shape (a "start from a
// built-in" starting point the author then edits + saves as their own item).
function seedDraftFromPrebuilt(entry) {
  if (!entry) return {};
  const draft = {
    name: entry.name ? `${entry.name} (copy)` : '',
    description: entry.desc || '',
  };
  if (entry.subcategory && entry.subcategory !== 'custom') draft.category = entry.subcategory;
  if (Array.isArray(entry.tags) && entry.tags.length) draft.tags = entry.tags.join(', ');
  if (entry.tierMin) draft.tierMin = entry.tierMin;
  return draft;
}


// Buckets with a prebuilt catalog to clone from ("start from a built-in").
const SEEDABLE = new Set(['institutions', 'services', 'resources', 'stressors', 'tradeGoods']);

function commandWasConfirmed(receipt) {
  return receipt?.ok === true
    && receipt.status === 'applied'
    && receipt.persistence?.state === 'confirmed';
}

function commandFailureMessage(receipt, fallback) {
  const reason = typeof receipt?.reason === 'string'
    ? receipt.reason.replaceAll('_', ' ')
    : '';
  return reason ? `${fallback}: ${reason}.` : `${fallback}.`;
}

export function CustomContentManager({ search, initialCat }) {
  const customContent = useStore(s => s.customContent);
  const previewBaseContent = useStore(s => (
    s.activeContentEnvironmentContent ?? s.customContent ?? {}
  ));
  const previewBaselineFingerprint = useMemo(
    () => fingerprintContent(previewBaseContent),
    [previewBaseContent],
  );
  const applyCustomContentCommand = useStore(s => s.applyCustomContentCommand);
  const canUseCustomContent = useStore(s => s.canUseCustomContent());
  const authTier = useStore(s => s.auth.tier);
  const customContentLoading = useStore(s => s.customContentLoading);
  const customContentError = useStore(s => s.customContentError);
  const loadCustomContentFromCloud = useStore(s => s.loadCustomContentFromCloud);

  // Seed the active bucket from a validated ?cat= deep-link so an "Author a X"
  // link opens straight on that bucket (CompendiumPanel parses the URL once and
  // passes initialCat — covers WB-j's ?cat=traditions); institutions otherwise.
  const [activeCat, setActiveCat] = useState(() => (initialCat && CATEGORY_BY_KEY[initialCat] ? initialCat : 'institutions'));
  const [addingNew, setAddingNew] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [draft, setDraft] = useState({});
  // "Start from a built-in" seed picker: surface prebuilt seeds to clone.
  const [showSeeds, setShowSeeds] = useState(false);
  // Progressive disclosure: essentials lead; the long schema tail collapses
  // behind an "Advanced attributes" toggle (deities show all axes flat — they
  // ARE the essentials; see renderForm).
  const [showAdvanced, setShowAdvanced] = useState(false);
  // Name of the item just saved (new, not edited) — drives the P9 peak/end
  // affordance so the authoring loop closes on a runnable next step ("test it").
  const [justSaved, setJustSaved] = useState(null);
  const [saveBusy, setSaveBusy] = useState(false);
  // Manual authoring uses the same deterministic interpretation/sample rails as
  // the Surveyor lane. The worker exists only while a sample is requested.
  const [manualSample, setManualSample] = useState(null);
  const [manualSampleReviewKey, setManualSampleReviewKey] = useState(null);
  const [manualSampleBusy, setManualSampleBusy] = useState(false);
  const [manualSampleError, setManualSampleError] = useState(null);
  const [manualSampleErrorReviewKey, setManualSampleErrorReviewKey] =
    useState(null);
  const [commandError, setCommandError] = useState(null);
  const manualPreviewAbort = useRef(null);

  const catDef = CUSTOM_CATEGORIES.find(c => c.key === activeCat);
  const items = customContent[activeCat] || [];
  const filtered = search ? items.filter(i => {
    const tagStr = Array.isArray(i.tags) ? i.tags.join(' ') : String(i.tags || '');
    return (i.name||'').toLowerCase().includes(search)
        || (i.description||'').toLowerCase().includes(search)
        || tagStr.toLowerCase().includes(search);
  }) : items;
  const authoredDraft = useMemo(() => {
    const category = getCustomContentCategory(activeCat);
    const allowed = new Set(
      category?.fields.map(field => field.key) || [],
    );
    return Object.fromEntries(
      Object.entries(draft).filter(([field]) => allowed.has(field)),
    );
  }, [activeCat, draft]);
  const reviewedManualEntry = useMemo(() => {
    const entry = {
      ...authoredDraft,
      ...(draft.localUid ? { localUid: draft.localUid } : {}),
    };
    if (activeCat !== 'deities') return entry;
    const lawAxis = draft.lawAxis || 'neutral';
    return {
      ...entry,
      lawAxis,
      // Temperament is retained for save compatibility but is derived from
      // the two authored axes. The preview and write must review the same
      // value; neither surface may treat it as a third authored mechanic.
      temperamentAxis: deityTemper({
        alignmentAxis: draft.alignmentAxis,
        lawAxis,
      }),
    };
  }, [activeCat, authoredDraft, draft.alignmentAxis, draft.lawAxis, draft.localUid]);
  const manualAdmission = useMemo(
    () => admitCustomContentDefinition(activeCat, reviewedManualEntry, {
      allowSystemFields: true,
    }),
    [activeCat, reviewedManualEntry],
  );
  const manualReviewKey = useMemo(
    () => JSON.stringify({
      bucket: activeCat,
      entry: reviewedManualEntry,
      previewBaselineFingerprint,
    }),
    [activeCat, previewBaselineFingerprint, reviewedManualEntry],
  );
  const manualDraft = useMemo(() => ({
    entries: reviewedManualEntry?.name
      ? [{
          bucket: activeCat,
          entry: reviewedManualEntry,
          label: 'required',
          sourced: true,
        }]
      : [],
    unsupported: [],
  }), [activeCat, reviewedManualEntry]);
  const manualInterpretation = useMemo(
    () => projectContentEffects(manualDraft, { 0: { action: 'approve' } }),
    [manualDraft],
  );
  const manualSampleCurrent = manualSample != null
    && manualSampleReviewKey === manualReviewKey;
  const manualSampleErrorCurrent = manualSampleErrorReviewKey === manualReviewKey
    ? manualSampleError
    : null;

  useEffect(() => {
    // A changed draft invalidates the in-flight taste gate immediately. The
    // previous result may stay in memory, but its captured review key can no
    // longer satisfy `manualSampleCurrent`, so it is neither shown nor saved.
    manualPreviewAbort.current?.abort();
  }, [manualReviewKey]);

  useEffect(() => () => manualPreviewAbort.current?.abort(), []);

  // ── Premium gate ─────────────────────────────────────────────────────────
  // Free / anon users see an upsell card. If they have grandfathered local
  // items, they can browse them in read-only mode below the upsell.
  if (!canUseCustomContent) {
    const totalCount = Object.values(customContent).reduce((sum, arr) => sum + (arr?.length || 0), 0);
    return (
      <div>
        <CustomContentUpsell existingCount={totalCount} isAnon={authTier === 'anon'} />
        <ReadOnlyCustomContentList search={search} />
      </div>
    );
  }

  const resetDraft = () => {
    manualPreviewAbort.current?.abort();
    setDraft({});
    setAddingNew(false);
    setEditingId(null);
    setShowSeeds(false);
    setJustSaved(null);
    setManualSample(null);
    setManualSampleReviewKey(null);
    setManualSampleError(null);
    setManualSampleErrorReviewKey(null);
    setManualSampleBusy(false);
    setCommandError(null);
  };

  const forgeManualSample = async () => {
    if (!manualAdmission.ok || manualSampleBusy) return;
    const reviewKey = manualReviewKey;
    const controller = new AbortController();
    manualPreviewAbort.current?.abort();
    manualPreviewAbort.current = controller;
    setManualSampleBusy(true);
    setManualSample(null);
    setManualSampleError(null);
    setManualSampleErrorReviewKey(null);
    try {
      const { runCustomContentPreview } = await import('../../lib/customContentPreviewClient.js');
      const sample = await runCustomContentPreview({
        seed: 'custom-content-taste-gate-v1',
        baseContent: previewBaseContent,
        accepted: [{
          bucket: activeCat,
          entry: reviewedManualEntry,
        }],
      }, { signal: controller.signal });
      setManualSample(sample);
      setManualSampleReviewKey(reviewKey);
    } catch (error) {
      if (error?.name !== 'AbortError') {
        setManualSampleError(
          error instanceof Error
            ? error.message
            : t('errors.customContentSampleFail'),
        );
        setManualSampleErrorReviewKey(reviewKey);
      }
    } finally {
      if (manualPreviewAbort.current === controller) {
        manualPreviewAbort.current = null;
        setManualSampleBusy(false);
      }
    }
  };

  const handleSave = async () => {
    if (!manualAdmission.ok || saveBusy || !manualSampleCurrent) return;
    if (typeof applyCustomContentCommand !== 'function') {
      setCommandError(
        t('errors.customContentWriterSaveUnavailable'),
      );
      return;
    }
    // This is the exact admitted entry used by the current taste gate. Metadata
    // such as row ids stays outside authored meaning and is carried separately
    // as command compare-and-swap identity below.
    const toSave = reviewedManualEntry;
    setSaveBusy(true);
    setCommandError(null);
    try {
      const existing = editingId
        ? items.find(item => item.id === editingId)
        : null;
      const receipt = await applyCustomContentCommand({
        kind: 'content.definition.create-revision',
        entries: [{
          category: activeCat,
          item: toSave,
          definitionId: existing?.definitionId || existing?.id || null,
          expectedHeadRevisionId: existing?.revisionId || null,
        }],
        source: { type: 'manual', ref: null, pack: null },
        expected: existing?.revisionId
          ? { headRevisionId: existing.revisionId }
          : {},
      });
      if (!commandWasConfirmed(receipt)) {
        setCommandError(commandFailureMessage(
          receipt,
          t('errors.customContentRevisionUnconfirmed'),
        ));
        return;
      }
      setEditingId(null);
      setAddingNew(false);
      setDraft({});
      setShowSeeds(false);
      setManualSample(null);
      setManualSampleReviewKey(null);
      setManualSampleErrorReviewKey(null);
      setJustSaved(draft.name.trim());
    } catch (error) {
      setCommandError(
        error instanceof Error
          ? t('errors.customContentRevisionSaveDetail', {
              detail: error.message,
            })
          : t('errors.customContentRevisionSaveFail'),
      );
    } finally {
      setSaveBusy(false);
    }
  };

  const archiveItem = async (item) => {
    const definitionId = item?.definitionId || item?.id;
    if (typeof applyCustomContentCommand !== 'function' || !definitionId) {
      setCommandError(
        t('errors.customContentWriterArchiveUnavailable'),
      );
      return;
    }
    setCommandError(null);
    try {
      const receipt = await applyCustomContentCommand({
        kind: 'content.definition.archive',
        definitionId,
        source: { type: 'manual', ref: null, pack: null },
        expected: item?.revisionId ? { headRevisionId: item.revisionId } : {},
      });
      if (!commandWasConfirmed(receipt)) {
        setCommandError(commandFailureMessage(
          receipt,
          t('errors.customContentArchiveUnconfirmed'),
        ));
        return;
      }
      setDeleteId(null);
    } catch (error) {
      setCommandError(
        error instanceof Error
          ? t('errors.customContentArchiveDetail', {
              detail: error.message,
            })
          : t('errors.customContentArchiveFail'),
      );
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setDraft({ ...item });
    setAddingNew(false);
    setShowSeeds(false);
  };

  // "Start from a built-in" — clone a prebuilt registry seed into an editable
  // draft (the author then tweaks + saves it as their own custom item).
  const cloneFromSeed = (entry) => {
    setDraft(seedDraftFromPrebuilt(entry));
    setAddingNew(true);
    setEditingId(null);
    setShowSeeds(false);
  };
  const seedEntries = (showSeeds && SEEDABLE.has(activeCat))
    ? buildRegistry(customContent).listPrebuilt(activeCat === 'services' ? 'services' : activeCat).slice(0, 60)
    : [];

  const singular = catDef.singular || catDef.label.slice(0,-1);

  return (
    <div>
      {/* Content packs — export/import authored content as a portable JSON pack
          (premium; file-based, no backend). */}
      <ContentPackBar />
      <ContentEnvironmentLifecycle />
      <CampaignContentBindingLifecycle />
      <ArchivedContentLibrary />
      {/* Sync status — visible whenever a cloud sync is in flight, regardless of
          which bucket is active. Without it, switching to a cached bucket during
          a background sync showed no status, so a later sync error popped with no
          preceding process to end (P10). */}
      {customContentLoading && !customContentError && (
        <div role="status" style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 12px', marginBottom:10, fontSize:FS.xs, color:BODY, fontStyle:'italic' }}>
          Syncing your custom content…
        </div>
      )}

      {/* Sync failure — a paid synced-write surface must not fail silently.
          Surface the error in plain language with a one-click retry. */}
      {customContentError && (
        <div role="alert" style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', padding:'8px 12px', marginBottom:10, background:`${swatch.danger}10`, borderLeft:`3px solid ${swatch.danger}` }}>
          <span style={{ flex:1, minWidth:180, fontSize:FS.sm, color:BODY, lineHeight:1.45 }}>
            Your custom content could not sync: {customContentError}
          </span>
          <Button variant="secondary" size="sm" onClick={() => loadCustomContentFromCloud()}>Retry sync</Button>
        </div>
      )}
      {commandError && (
        <div
          role="alert"
          style={{
            padding: '8px 12px',
            marginBottom: 10,
            background: `${swatch.danger}10`,
            borderLeft: `3px solid ${swatch.danger}`,
            fontSize: FS.sm,
            color: BODY,
            lineHeight: 1.45,
          }}
        >
          {commandError}
        </div>
      )}

      {/* Two authoring lanes: settlement ingredients vs world-facing actors.
          The manifest copy names each category's real activation boundary;
          lane placement alone never implies tick-time mechanical authority. */}
      {AUTHORING_LANES.map((lane, li) => (
        <div key={lane.key} data-testid={`authoring-lane-${lane.key}`} style={{ marginBottom: li < AUTHORING_LANES.length - 1 ? SP.xl : SP.md }}>
          <div style={{ fontSize:FS.xs, fontWeight:800, color: lane.key === 'living' ? swatch['#7A5A1A'] : INK, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:2 }}>
            {lane.label}
          </div>
          <div style={{ fontSize:FS.xs, color:BODY, lineHeight:1.4, marginBottom:6 }}>{lane.blurb}</div>
          <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
            {lane.buckets.map(key => {
              const c = CATEGORY_BY_KEY[key];
              if (!c) return null;
              const count = (customContent[c.key]||[]).length;
              return (
                <button key={c.key} type="button" aria-pressed={activeCat===c.key} onClick={() => { setActiveCat(c.key); resetDraft(); }}
                  style={{ display:'flex', alignItems:'center', gap:4, padding:'4px 10px', minHeight:44, fontSize:FS.xs, fontWeight:activeCat===c.key?700:500, cursor:'pointer', border:`1px solid ${activeCat===c.key?c.color:BOR}`, background:activeCat===c.key?`${c.color}14`:'transparent', color:activeCat===c.key?c.color:SEC }}>
                  <c.Icon size={11}/> {c.label}
                  {count > 0 && <span style={{ fontSize:FS.micro, fontWeight:700, background:`${c.color}20`, color:c.color, padding:'0 4px', marginLeft:2 }}>{count}</span>}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Deities — the activation/dormancy strip (name-free). */}
      {activeCat === 'deities' && <PantheonActivationStrip />}

      {/* Factions arrive via an in-world event, not generation. */}
      {activeCat === 'factions' && <FactionEventBanner />}

      {/* Supply Chains: discovered + verified, not hand-authored — its own manager. */}
      {activeCat === 'supplyChains' && <SupplyChainsManager />}

      {/* Add / Start-from-a-built-in / Test-in-a-generation affordances. */}
      {activeCat !== 'supplyChains' && !addingNew && !editingId && (
        <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap', marginBottom:10 }}>
          <Button variant="ai" size="sm" icon={<Plus size={12}/>} onClick={() => { setAddingNew(true); setDraft({}); setShowSeeds(false); setJustSaved(null); }}>
            Add Custom {singular}
          </Button>
          {SEEDABLE.has(activeCat) && (
            <Button variant="secondary" size="sm" icon={<Copy size={12}/>} onClick={() => setShowSeeds(s => !s)} aria-pressed={showSeeds}>
              Start from a built-in
            </Button>
          )}
          {/* The forward exit from authoring, set apart as a distinct next step. */}
          <Button variant="secondary" size="sm" icon={<Wand2 size={12}/>} onClick={() => navigate('generate')} title="Run a generation that draws on your custom content." style={{ marginLeft:'auto' }}>
            Test in a generation
          </Button>
        </div>
      )}

      {/* Built-in seed picker (clone a catalog entry into an editable draft). */}
      {!addingNew && !editingId && showSeeds && seedEntries.length > 0 && (
        <div data-testid="builtin-seed-picker" style={{ borderLeft:`3px solid ${swatch.magic}`, padding:'8px 10px', marginBottom:10, background:CARD, maxHeight:200, overflowY:'auto' }}>
          <div style={{ fontSize:FS.xxs, fontWeight:700, color:MUT, textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:6 }}>
            Clone a built-in {catDef.label.toLowerCase().replace(/s$/,'')} as a starting point
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
            {seedEntries.map(entry => (
              <Button key={entry.refId} variant="ghost" size="sm" onClick={() => cloneFromSeed(entry)}
                style={{ display:'flex', alignItems:'center', gap:6, justifyContent:'flex-start', textAlign:'left', border:`1px solid ${BOR}`, padding:'5px 8px', background:'transparent', color:INK }}>
                <span style={{ fontSize:FS.xs, fontWeight:600, flex:1 }}>{entry.name}</span>
                {entry.subcategory && <Tag label={entry.subcategory} color={catDef.color}/>}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Add/edit form */}
      {activeCat !== 'supplyChains' && (addingNew || editingId) && (
        <CustomContentEditor
          activeCat={activeCat}
          catDef={catDef}
          customContent={customContent}
          definitionReady={manualAdmission.ok}
          draft={draft}
          editingId={editingId}
          forgeManualSample={forgeManualSample}
          handleSave={handleSave}
          manualInterpretation={manualInterpretation}
          manualSample={manualSampleCurrent ? manualSample : null}
          manualSampleBusy={manualSampleBusy}
          manualSampleCurrent={manualSampleCurrent}
          manualSampleError={manualSampleErrorCurrent}
          resetDraft={resetDraft}
          saveBusy={saveBusy}
          setDraft={setDraft}
          setShowAdvanced={setShowAdvanced}
          showAdvanced={showAdvanced}
        />
      )}

      {/* Peak/end (P9): the authoring loop just closed on a save — offer the one
          forward action (run a generation that uses it) instead of snapping
          silently back to the list. Dismissible; hidden while authoring. */}
      {justSaved && !addingNew && !editingId && (
        <div role="status" style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', padding:'8px 12px', marginBottom:10, background:`${swatch.magic}0d`, borderLeft:`3px solid ${swatch.magic}` }}>
          <span style={{ flex:1, minWidth:160, fontSize:FS.sm, color:BODY, lineHeight:1.45 }}>
            <strong>{justSaved}</strong> saved as an immutable revision. See it shape a world.
          </span>
          <Button variant="ai" size="sm" icon={<Wand2 size={12}/>} onClick={() => navigate('generate')}>
            Test in a generation
          </Button>
          <IconButton Icon={X} glyph="×" label="Dismiss" tone="ghost" size="sm" onClick={() => setJustSaved(null)} />
        </div>
      )}

      {/* Items list */}
      {activeCat !== 'supplyChains' && (
        customContentLoading && items.length === 0 ? (
        <div data-testid="custom-content-loading" style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ height:44, background:`${swatch.magic}0d`, border:`1px solid ${BOR}` }}/>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        // Honest empty states: distinguish "filtered to nothing" from "truly none
        // yet", and offer a one-click out of each.
        search && items.length > 0 ? (
          <div style={{ padding:'20px 16px', textAlign:'center' }}>
            <div style={{ fontSize:FS.sm, color:MUT, marginBottom:10 }}>
              No custom {catDef.label.toLowerCase()} match &ldquo;{search}&rdquo;.
            </div>
          </div>
        ) : (
          <div style={{ padding:'20px 16px', textAlign:'center' }}>
            <div style={{ fontSize:FS.sm, color:MUT, marginBottom: SEEDABLE.has(activeCat) ? 10 : 0 }}>
              No custom {catDef.label.toLowerCase()} yet. Use the Add button above to create one.
            </div>
            {SEEDABLE.has(activeCat) && (
              <Button variant="secondary" size="sm" icon={<Copy size={12}/>} onClick={() => setShowSeeds(true)}>
                Start from a built-in {singular.toLowerCase()}
              </Button>
            )}
          </div>
        )
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {filtered.map(item => (
            <div key={item.id} style={{ border:`1px solid ${BOR}`, borderLeft:`3px solid #7c3aed`, padding:'8px 12px', background:'rgba(255,251,245,0.95)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontFamily:serif_, fontSize:FS.md, fontWeight:700, color:INK, flex:1 }}>{item.name}</span>
                <Tag label="Custom" color='#7c3aed'/>
                {item.category && <Tag label={item.category} color={catDef.color}/>}
                <IconButton Icon={Edit3} label="Edit item" tone="ghost" size="sm" onClick={() => handleEdit(item)} />
                <IconButton Icon={Trash2} label="Archive item" tone="danger" size="sm" onClick={() => setDeleteId(deleteId===item.id?null:item.id)} />
              </div>
              {(item.description || item.portfolio) && <div style={{ fontSize:FS.xs, color:SEC, lineHeight:1.4, marginTop:4 }}>{item.description || item.portfolio}</div>}
              <CustomItemAttributes item={item} bucket={activeCat} />
              {item.tags && <div style={{ display:'flex', gap:3, flexWrap:'wrap', marginTop:4 }}>{(typeof item.tags==='string'?item.tags.split(','):item.tags).map((t,i)=><Tag key={i} label={t.trim()} color={MUT}/>)}</div>}
              {/* Affects pills (stressors only) */}
              {Array.isArray(item.affects) && item.affects.length > 0 && (
                <div style={{ display:'flex', gap:3, flexWrap:'wrap', marginTop:4 }}>
                  {item.affects.map((a, i) => (
                    <span key={i} style={{
                      fontSize:FS.micro, fontWeight:700, color:swatch.danger,
                      // Translucent danger fill — was solid swatch.danger on
                      // swatch.danger text, rendering the label invisible.
                      background:`${swatch.danger}14`, border:'1px solid #8b1a1a44',
                      padding:'1px 6px',
                      textTransform:'uppercase', letterSpacing:'0.04em',
                    }}>{a}</span>
                  ))}
                </div>
              )}
              {/* Dependencies summary + dangling-ref warnings */}
              {Array.isArray(catDef.dependencies) && catDef.dependencies.length > 0 && (
                <DependencySummary deps={catDef.dependencies} item={item} />
              )}
              <CustomContentUsageEcho bucket={activeCat} item={item} customContent={customContent} />
              <ContentDefinitionHistory category={activeCat} item={item} />
              {deleteId === item.id && (
                <DeleteConfirmation
                  entityName={item.name}
                  details="Archive this definition so it cannot enter future generations. Existing settlement snapshots and pinned campaign versions remain intact."
                  onConfirm={() => archiveItem(item)}
                  onCancel={() => setDeleteId(null)}
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
