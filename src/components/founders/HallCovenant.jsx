/**
 * founders/HallCovenant.jsx — THE COVENANT, as an illuminated document (§2/§2b).
 *
 * One surface states the deal; the Hall embodies it. The product already renders
 * a treaty as a document a DM can read — the covenant is the house's own treaty
 * with its founders, rendered by the same discipline: a heavy gold rule opens it,
 * a hairline closes it, and the tense is permanent throughout.
 *
 * THE COPY IS LOAD-BEARING AND IS PINNED. Not one line may speak of payment,
 * price, purchase, or seats remaining for sale: the purchase class was abolished
 * before it ever sold (§1), and the covenant is the surface most likely to have
 * inherited the old sentence. tests/components/foundersHallPage.test.jsx asserts
 * the absence of that whole vocabulary.
 */
import { HALL, covenantProseStyle, quietLineStyle } from './hallRegister.js';
import { HALL_CHAIR_COUNT } from '../../lib/foundersHall.js';
import { SP, FS, serif_ } from '../theme.js';

export default function HallCovenant() {
  return (
    <section
      aria-label="The founders' covenant"
      style={{
        borderTop: `2px solid ${HALL.gold}`,
        borderBottom: `1px solid ${HALL.rule}`,
        padding: `${SP.lg}px 0`,
        display: 'flex', flexDirection: 'column', gap: SP.sm,
      }}
    >
      <h2 style={{
        margin: 0, fontFamily: serif_, fontSize: FS.lg, fontWeight: 700,
        letterSpacing: '0.04em', color: HALL.gold,
      }}>
        The covenant
      </h2>
      <p style={covenantProseStyle}>
        There are {HALL_CHAIR_COUNT} chairs in this Hall, and there will never be more.
        Every one of them is given, never sold. A chair is held by one founder,
        permanently: the line that reads &ldquo;Seat IX&rdquo; beside a name is a
        sentence that will not change.
      </p>
      <p style={covenantProseStyle}>
        A founder holds everything Cartographer runs, for as long as SettlementForge
        runs. No renewal, no tier to climb back up, nothing to keep paying for.
      </p>
      <p style={{ ...quietLineStyle, color: HALL.faint }}>
        Chairs are offered by invitation. They cannot be bought, traded, inherited,
        or transferred, and a founder is shown by the name they chose to be shown by
        &mdash; never by their account.
      </p>
    </section>
  );
}
