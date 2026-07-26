/**
 * ContentPackBar — export / import of custom-content packs (premium).
 *
 * Export emits strict pack format v2 with independent pack lineage and a
 * deterministic manifest hash. Import parses hostile input, builds a dependency
 * and validation preview, then submits one atomic custom-content command. The
 * file is reviewed before the command is sent. Its exact command
 * fingerprint is then rechecked at the store boundary, and the status line
 * reflects the durable receipt rather than optimistic per-item acceptance.
 * Pack setting defaults are a second, explicit environment migration: importing
 * definitions never silently changes the active account environment. Public
 * distribution is intentionally absent until licensing, moderation, and
 * compatibility policy form a complete marketplace program.
 */

import { useRef, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { useStore } from '../../store/index.js';
import {
  buildContentPack, parseContentPack, prepareImport, PACK_BUCKETS,
} from '../../lib/contentPacks.js';
import { SECOND as SEC, BORDER as BOR, CARD, FS, swatch } from '../theme.js';
import Button from '../primitives/Button.jsx';

const ACCENT = swatch['#7C3AED'];

export default function ContentPackBar() {
  const customContent = useStore((s) => s.customContent);
  const activeEnvironment = useStore((s) => s.activeContentEnvironment);
  const applyCustomContentCommand = useStore((s) => s.applyCustomContentCommand);
  const getInstalledContentPackState = useStore(
    (s) => s.getInstalledContentPackState,
  );
  const previewEnvironmentMigration = useStore(
    (s) => s.previewCustomContentEnvironmentMigration,
  );
  const migrateEnvironment = useStore(
    (s) => s.migrateCustomContentEnvironment,
  );
  const fileRef = useRef(null);
  const [status, setStatus] = useState(null); // { ok: boolean, msg: string }
  const [pendingImport, setPendingImport] = useState(null);
  const [pendingEnvironment, setPendingEnvironment] = useState(null);
  const [busy, setBusy] = useState(false);

  const totalAuthored = PACK_BUCKETS.reduce(
    (sum, b) => sum + (Array.isArray(customContent?.[b]) ? customContent[b].length : 0), 0,
  );

  const handleExport = () => {
    // A setting pack is a coherent export, not just a list of definitions.
    // Only the reviewed active defaults travel with it; campaign bindings stay
    // private, immutable campaign state and are never smuggled into portability.
    const pack = buildContentPack(customContent, {
      tunables: activeEnvironment?.tunables || {},
      visualSelection: activeEnvironment?.visualSelection || {},
    });
    const blob = new Blob([JSON.stringify(pack, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `settlementforge-pack-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setStatus({ ok: true, msg: `Exported ${totalAuthored} item${totalAuthored === 1 ? '' : 's'}.` });
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (fileRef.current) fileRef.current.value = ''; // allow re-importing the same file
    if (!file) return;
    let text;
    try { text = await file.text(); }
    catch { setStatus({ ok: false, msg: 'Could not read the file.' }); return; }

    const parsed = parseContentPack(text);
    if (!parsed.ok) { setStatus({ ok: false, msg: parsed.error || 'Invalid pack.' }); return; }

    let installedState;
    try {
      installedState = typeof getInstalledContentPackState === 'function'
        ? await getInstalledContentPackState(parsed.pack.packId)
        : {
            activePackVersion: null,
            activeManifestHash: null,
            entries: {},
          };
    } catch (error) {
      setStatus({
        ok: false,
        msg: `Could not inspect the installed pack state. ${
          error instanceof Error ? error.message : 'Try again.'
        }`,
      });
      return;
    }
    const prepared = prepareImport(parsed.pack, {
      existingByPackEntry: installedState.entries,
    });
    if (prepared.rejected.length) {
      const missing = prepared.diagnostics.missingDependencies.length;
      const detail = missing
        ? ` ${missing} unresolved custom ${missing === 1 ? 'dependency' : 'dependencies'}.`
        : '';
      setStatus({
        ok: false,
        msg: `Nothing imported. ${prepared.rejected.length} invalid ${
          prepared.rejected.length === 1 ? 'entry needs' : 'entries need'
        } review.${detail}`,
      });
      return;
    }

    const request = {
      kind: 'content.pack.import',
      entries: prepared.items.map(entry => ({
        category: entry.bucket,
        item: entry.item,
        definitionId: entry.definitionId,
        expectedHeadRevisionId: entry.expectedHeadRevisionId,
        packEntryId: entry.packEntryId,
      })),
      source: {
        type: 'pack',
        ref: `${parsed.pack.packId}@${parsed.pack.packVersion}`,
        pack: {
          packId: parsed.pack.packId,
          packVersion: parsed.pack.packVersion,
          manifestHash: parsed.pack.manifestHash,
          name: parsed.pack.name,
          // The command journal is later the full-fidelity archive source.
          // Carry the admitted v2 manifest whole; reduced display metadata
          // cannot reconstruct authorship, license, tunables, or dependencies.
          manifest: parsed.pack,
          expectedActivePackVersion:
            installedState.activePackVersion || null,
          expectedActiveManifestHash:
            installedState.activeManifestHash || null,
        },
      },
    };
    const { previewCustomContentCommand } = await import(
      '../../domain/content/customContentCommands.js'
    );
    const preview = previewCustomContentCommand({
      kind: request.kind,
      entries: request.entries.map(entry => ({
        category: entry.category,
        data: entry.item,
        definitionId: entry.definitionId,
        expectedHeadRevisionId: entry.expectedHeadRevisionId,
        packEntryId: entry.packEntryId,
      })),
      pack: request.source.pack,
    });
    setPendingEnvironment(null);
    setPendingImport({
      pack: parsed.pack,
      prepared,
      request,
      previewFingerprint: preview.fingerprint,
    });
    setStatus({
      ok: true,
      msg: `Reviewed ${prepared.items.length} pack ${
        prepared.items.length === 1 ? 'entry' : 'entries'
      }. Confirm to apply them atomically.`,
    });
  };

  const prepareImportedEnvironment = async (pack, receipt) => {
    if (
      typeof previewEnvironmentMigration !== 'function'
      || typeof migrateEnvironment !== 'function'
    ) return;
    const { makeContentEnvironmentRevision } = await import(
      '../../domain/content/contentEnvironment.js'
    );
    const importedItems = Array.isArray(receipt.result?.items)
      ? receipt.result.items
      : [];
    const directDefinitions = importedItems.flatMap(item => {
      const identity = String(item?.definitionId || item?.id || '');
      const category = receipt.perEntry.find(entry => (
        String(entry.definitionId) === identity
      ))?.category;
      if (
        !identity
        || !item?.revisionId
        || !item?.contentHash
        || !category
      ) return [];
      return [{
        definitionId: identity,
        revisionId: item.revisionId,
        contentHash: item.contentHash,
        category,
      }];
    });
    const environment = makeContentEnvironmentRevision({
      environmentId: `pack:${pack.manifestHash.slice(0, 32)}`,
      environmentRevisionId: `pack-revision:${pack.manifestHash}`,
      packVersions: [{
        packId: pack.packId,
        packVersionId: pack.packVersion,
        manifestHash: pack.manifestHash,
      }],
      directDefinitions,
      tunables: pack.tunables || {},
      visualSelection: pack.visualSelection || {},
      source: 'imported-pack',
    });
    const review = await previewEnvironmentMigration(environment);
    if (review?.ok) {
      setPendingEnvironment({
        environment,
        previewFingerprint: review.previewFingerprint,
        changes: review.changes || [],
      });
    }
  };

  const applyPendingImport = async () => {
    if (!pendingImport || busy) return;
    setBusy(true);
    try {
      const receipt = await applyCustomContentCommand({
        ...pendingImport.request,
        previewFingerprint: pendingImport.previewFingerprint,
      });
      if (
        !receipt.ok
        || receipt.status !== 'applied'
        || receipt.persistence?.state !== 'confirmed'
      ) {
        setStatus({
          ok: false,
          msg: receipt.status === 'reconcile-required'
            || receipt.persistence?.state === 'ambiguous'
            ? 'Import result is not confirmed. Reconnect and reconcile before retrying.'
            : `Nothing imported. ${receipt.reason || 'The command was refused.'}`,
        });
        return;
      }
      const created = receipt.perEntry.filter(entry => entry.status === 'created').length;
      const updated = receipt.perEntry.filter(entry => entry.status === 'updated').length;
      const unchanged = receipt.perEntry.filter(entry => entry.status === 'unchanged').length;
      const parts = [`Applied ${receipt.perEntry.length} pack ${
        receipt.perEntry.length === 1 ? 'entry' : 'entries'
      } atomically.`];
      if (created) parts.push(`${created} new.`);
      if (updated) parts.push(`${updated} updated.`);
      if (unchanged) parts.push(`${unchanged} unchanged.`);
      await prepareImportedEnvironment(pendingImport.pack, receipt);
      setPendingImport(null);
      setStatus({ ok: true, msg: parts.join(' ') });
    } catch (error) {
      setStatus({
        ok: false,
        msg: `Nothing imported. ${
          error instanceof Error ? error.message : 'The command failed.'
        }`,
      });
    } finally {
      setBusy(false);
    }
  };

  const applyPendingEnvironment = async () => {
    if (!pendingEnvironment || busy) return;
    setBusy(true);
    try {
      const receipt = await migrateEnvironment(
        pendingEnvironment.environment,
        { previewFingerprint: pendingEnvironment.previewFingerprint },
      );
      if (
        receipt?.ok
        && receipt.status === 'applied'
        && receipt.persistence?.state === 'confirmed'
      ) {
        setStatus({
          ok: true,
          msg: 'The pack setting defaults are now active for future standalone generations.',
        });
        setPendingEnvironment(null);
        return;
      }
      setStatus({
        ok: false,
        msg: receipt?.status === 'stale'
          ? 'The setting review is stale. Import or review the pack again.'
          : `Settings were not changed. ${receipt?.reason || 'The command was not confirmed.'}`,
      });
    } catch (error) {
      setStatus({
        ok: false,
        msg: `Settings were not changed. ${
          error instanceof Error ? error.message : 'The command failed.'
        }`,
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      data-testid="content-pack-bar"
      style={{
        marginBottom: 12, padding: '8px 12px', background: CARD,
        border: `1px solid ${BOR}`,
        display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
      }}
    >
      <span style={{ fontSize: FS.xxs, fontWeight: 800, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Content packs
      </span>
      <Button
        variant="secondary" size="sm" icon={<Download size={12} />}
        onClick={handleExport} disabled={totalAuthored === 0}
      >
        Export
      </Button>
      <Button
        variant="secondary" size="sm" icon={<Upload size={12} />}
        onClick={() => fileRef.current?.click()}
      >
        Import
      </Button>
      <input
        ref={fileRef} type="file" accept="application/json,.json"
        onChange={handleFile} style={{ display: 'none' }}
        aria-label="Import content pack file"
      />
      {status && (
        <span style={{ fontSize: FS.xs, color: status.ok ? SEC : swatch.danger, marginLeft: 'auto' }}>
          {status.msg}
        </span>
      )}
      {pendingImport && (
        <div
          role="group"
          aria-label="Reviewed content pack"
          style={{
            width: '100%',
            borderTop: `1px dashed ${BOR}`,
            paddingTop: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap',
          }}
        >
          <span style={{ flex: 1, minWidth: 220, fontSize: FS.xs, color: SEC }}>
            <strong>{pendingImport.pack.name}</strong>{' '}
            {pendingImport.pack.packVersion} · {pendingImport.prepared.items.length}{' '}
            validated {pendingImport.prepared.items.length === 1 ? 'entry' : 'entries'}
            {' · '}{Object.keys(pendingImport.pack.tunables || {}).length} setting defaults
          </span>
          <Button
            variant="ai"
            size="sm"
            busy={busy}
            disabled={busy}
            onClick={applyPendingImport}
          >
            Apply reviewed pack
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={busy}
            onClick={() => {
              setPendingImport(null);
              setStatus(null);
            }}
          >
            Cancel
          </Button>
        </div>
      )}
      {pendingEnvironment && (
        <div
          role="group"
          aria-label="Pack setting migration review"
          style={{
            width: '100%',
            borderTop: `1px dashed ${BOR}`,
            paddingTop: 8,
          }}
        >
          <div style={{ fontSize: FS.xs, color: SEC, marginBottom: 6 }}>
            Definitions are imported. Applying this setting revision would change{' '}
            {pendingEnvironment.changes.length} reviewed environment{' '}
            {pendingEnvironment.changes.length === 1 ? 'field' : 'fields'}.
            Existing campaigns remain pinned to their current revision.
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Button
              variant="ai"
              size="sm"
              busy={busy}
              disabled={busy}
              onClick={applyPendingEnvironment}
            >
              Apply setting defaults
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={busy}
              onClick={() => {
                setPendingEnvironment(null);
                setStatus({
                  ok: true,
                  msg: 'Definitions imported; existing setting defaults retained.',
                });
              }}
            >
              Keep current defaults
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
