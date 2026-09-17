/**
 * AvailableAtLaunchPill.jsx - the pill every purchase control wears until launch
 * (lib/launchGate.js). The canonical Pill, gold lettering on the OPAQUE soft-gold fill
 * (GOLD_SOFT). Opaque on purpose, measured by the lockout's review: a translucent tint
 * read 1.21:1 on the cedar header and 1.56:1 on slate buttons, while GOLD_TXT on
 * GOLD_SOFT holds about 6:1 on any surface. It also adds no rgba literal, which the
 * deep-craft kill-list ratchet counts.
 *
 * The words are a literal, not a copy-register key: the register is a lazy chunk, and
 * this pill also sits on eager surfaces (an eager `t` import once dragged the whole
 * register into the entry chunk, +58,594 B; see StaleDeployNotice.jsx).
 */
import Pill from './Pill.jsx';
import { GOLD_SOFT, GOLD_TXT } from '../theme.js';

/** The pill's words. No em dash. */
export const AVAILABLE_AT_LAUNCH = 'Available at launch';

/**
 * @param {{ style?: object }} [props]
 */
export default function AvailableAtLaunchPill({ style } = {}) {
  return (
    <Pill bg={GOLD_SOFT} color={GOLD_TXT} data-launch-pill="" style={style}>
      {AVAILABLE_AT_LAUNCH}
    </Pill>
  );
}
