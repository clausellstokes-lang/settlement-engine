import { useCallback, useEffect, useState } from 'react';
import { Check, ExternalLink, RefreshCw, XCircle } from 'lucide-react';

import { fetchGalleryReports, resolveGalleryReport } from '../../lib/gallery.js';
import { navigate } from '../../hooks/useRoute.js';
import Button from '../primitives/Button.jsx';
import {
  BODY,
  BORDER,
  BORDER2,
  CARD,
  CARD_ALT,
  FS,
  INK,
  MUTED,
  R,
  RED,
  RED_BG,
  SECOND,
  SP,
  sans,
} from '../theme.js';
import { formatDate, human } from './galleryUtils.js';

const STATUS_OPTIONS = [
  ['open', 'Open'],
  ['resolved', 'Resolved'],
  ['dismissed', 'Dismissed'],
  ['all', 'All'],
];

function StatusPill({ status }) {
  const active = status === 'open';
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      minHeight: 22,
      padding: '2px 7px',
      borderRadius: R.sm,
      border: `1px solid ${active ? RED : BORDER2}`,
      background: active ? RED_BG : CARD_ALT,
      color: active ? RED : SECOND,
      fontFamily: sans,
      fontSize: FS.xxs,
      fontWeight: 900,
      textTransform: 'uppercase',
    }}>
      {status}
    </span>
  );
}

function ActionButton({ children, tone = 'secondary', busy, icon, onClick }) {
  return (
    <Button
      variant={tone}
      size="sm"
      busy={busy}
      icon={icon}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

export default function GalleryModerationPanel() {
  const [status, setStatus] = useState('open');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const loadReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setReports(await fetchGalleryReports({ status, limit: 50 }));
    } catch (err) {
      setError(err?.message || 'Gallery reports could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    loadReports();
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [loadReports]);

  const updateReport = async (reportId, nextStatus) => {
    setBusyId(reportId);
    setError(null);
    try {
      await resolveGalleryReport(reportId, nextStatus);
      await loadReports();
    } catch (err) {
      setError(err?.message || 'Gallery report could not be updated.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div style={{ display: 'grid', gap: SP.md }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap' }}>
        <div style={{ display: 'inline-flex', border: `1px solid ${BORDER}`, borderRadius: R.md, overflow: 'hidden' }}>
          {STATUS_OPTIONS.map(([id, label]) => {
            const active = status === id;
            return (
              <Button
                key={id}
                variant={active ? 'gold' : 'ghost'}
                size="sm"
                aria-pressed={active}
                onClick={() => setStatus(id)}
                style={{ borderRadius: 0, border: 'none', borderRight: id === 'all' ? 'none' : `1px solid ${BORDER}` }}
              >
                {label}
              </Button>
            );
          })}
        </div>
        <Button
          variant="secondary"
          size="sm"
          busy={loading}
          icon={<RefreshCw size={12} />}
          onClick={loadReports}
        >
          Refresh
        </Button>
      </div>

      {error && (
        <div style={{ border: `1px solid ${RED}`, borderRadius: R.md, background: RED_BG, color: RED, padding: SP.sm, fontFamily: sans, fontSize: FS.xs, fontWeight: 850 }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: SP.xl, color: MUTED, fontFamily: sans, fontSize: FS.sm }}>
          Loading gallery reports...
        </div>
      ) : reports.length === 0 ? (
        <div style={{ textAlign: 'center', padding: SP.xl, color: MUTED, fontFamily: sans, fontSize: FS.sm, border: `1px dashed ${BORDER}`, borderRadius: R.md, background: CARD_ALT }}>
          No gallery reports in this queue.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: SP.sm, maxHeight: 460, overflowY: 'auto' }}>
          {reports.map(report => (
            <article
              key={report.id}
              style={{
                display: 'grid',
                gap: SP.sm,
                padding: SP.md,
                border: `1px solid ${report.status === 'open' ? RED : BORDER}`,
                borderRadius: R.md,
                background: report.status === 'open' ? '#fffaf7' : CARD,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: SP.sm }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <strong style={{ color: INK, fontFamily: sans, fontSize: FS.sm, overflowWrap: 'anywhere' }}>
                      {report.name || 'Untitled settlement'}
                    </strong>
                    <StatusPill status={report.status} />
                    {report.reportCount > 1 && (
                      <span style={{ color: RED, fontFamily: sans, fontSize: FS.xxs, fontWeight: 900 }}>
                        {report.reportCount} reports
                      </span>
                    )}
                  </div>
                  <div style={{ marginTop: 3, color: MUTED, fontFamily: sans, fontSize: FS.xxs, fontWeight: 800 }}>
                    {human(report.tier)} / {human(report.reason)} / {report.reporterLabel} / {formatDate(report.createdAt)}
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!report.slug}
                  title="Open public dossier"
                  icon={<ExternalLink size={12} />}
                  onClick={() => report.slug && navigate('gallery', { params: { slug: report.slug } })}
                >
                  Open
                </Button>
              </div>
              {report.body && (
                <p style={{ margin: 0, color: BODY, fontFamily: sans, fontSize: FS.sm, lineHeight: 1.45, whiteSpace: 'pre-wrap' }}>
                  {report.body}
                </p>
              )}
              {!report.isPublic && (
                <div style={{ color: MUTED, fontFamily: sans, fontSize: FS.xs, fontStyle: 'italic' }}>
                  This settlement is no longer public.
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: SP.sm, flexWrap: 'wrap' }}>
                {report.status !== 'resolved' && (
                  <ActionButton
                    tone="success"
                    busy={busyId === report.id}
                    icon={<Check size={12} />}
                    onClick={() => updateReport(report.id, 'resolved')}
                  >
                    Resolve
                  </ActionButton>
                )}
                {report.status !== 'dismissed' && (
                  <ActionButton
                    tone="danger"
                    busy={busyId === report.id}
                    icon={<XCircle size={12} />}
                    onClick={() => updateReport(report.id, 'dismissed')}
                  >
                    Dismiss
                  </ActionButton>
                )}
                {report.status !== 'open' && (
                  <ActionButton
                    busy={busyId === report.id}
                    onClick={() => updateReport(report.id, 'open')}
                  >
                    Reopen
                  </ActionButton>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
