import { Component } from 'react';
import { swatch, FS } from '../theme';

/**
 * DetailErrorBoundary — the small, scoped fallback for the settlement detail
 * BODY (the dossier OutputContainer or the town-map viewer). Extracted from
 * SettlementDetail.jsx (behavior-preserving) so the parent stays under the
 * component size ratchet. Renders a compact inline error rather than tearing
 * down the whole detail view when a body surface throws.
 */
export default class DetailErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[SettlementDetail] detail render failed', error, info);
  }

  render() {
    if (this.state.error) {
      return <div style={{ padding: 12, color: swatch.danger, fontSize: FS.sm }}>Error loading settlement output.</div>;
    }
    return this.props.children;
  }
}
