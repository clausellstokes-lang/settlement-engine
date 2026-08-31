/**
 * PublicSimulationBand.jsx — §807(b): the READ-ONLY shared dossier KEEPS
 * "How this was simulated" (§777's survivor: the in-dossier drawer is the one
 * home — a shared world shows its machinery proudly).
 *
 * Owner surfaces mount the same drawer through DossierActionBand; this band
 * serves the PUBLIC variant alone, feeding the drawer the shared settlement so
 * the rail renders its settlement-derived simulation spine for a viewer whose
 * store holds no pipelineHistory (PipelineRail's viewer mode). Extracted as a
 * sibling leaf (the DossierGroupTabStrip idiom) so OutputContainer stays under
 * the components max-lines ceiling.
 */
import { Suspense, lazy } from 'react';
import { SP, swatch } from '../theme.js';

const SimulationDrawer = lazy(() => import('./SimulationDrawer.jsx'));

/** @param {{ settlement: any }} props */
export default function PublicSimulationBand({ settlement }) {
  return (
    <div style={{ padding: `${SP.sm}px ${SP.lg}px 0`, background: swatch['#FAF8F4'] }}>
      <Suspense fallback={null}><SimulationDrawer settlement={settlement} /></Suspense>
    </div>
  );
}
