/**
 * AvailableAtLaunchPill.jsx - the pill every purchase control wears until launch
 * (lib/launchGate.js). The canonical Pill in the same gold tint the account page's
 * "Coming soon" chip uses, so pre-launch reads as one grammar across the site.
 *
 * The words are a literal, not a copy-register key: the register is a lazy chunk, and
 * this pill also sits on eager surfaces (an eager `t` import once dragged the whole
 * register into the entry chunk, +58,594 B; see StaleDeployNotice.jsx).
 */
import Pill from './Pill.jsx';
import { GOLD_TXT } from '../theme.js';

/** The pill's words. No em dash. */
export const AVAILABLE_AT_LAUNCH = 'Available at launch';

/** The account page's gold tint (account/accountTheme.js TINT_GOLD), inlined to keep this leaf small. */
const TINT_GOLD = 'rgba(201,162,76,0.12)';

/**
 * @param {{ style?: object }} [props]
 */
export default function AvailableAtLaunchPill({ style } = {}) {
  return (
    <Pill bg={TINT_GOLD} color={GOLD_TXT} data-launch-pill="" style={style}>
      {AVAILABLE_AT_LAUNCH}
    </Pill>
  );
}
