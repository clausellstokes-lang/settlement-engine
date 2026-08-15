/**
 * domain/display/hegemonyRead.js — THE UNNAMED EMPIRE, the DISPLAY WRAPPER
 * (ruling 3, DESIGN_SIM_DEPTH_R2 D4). The hegemony COMPUTATION moved to the domain
 * leaf src/domain/worldPulse/hegemony.js so the reason half (warReasons:
 * fear_of_dominance) reads the domain directly — display reads domain, NEVER the
 * reverse. This wrapper is a THIN re-export: its public API (hegemonyRead /
 * hasHegemony / HEGEMONY_TUNING / SUBORDINATING_TERM_TYPES) is unchanged, so every
 * existing display consumer (RealmDashboard) and this module's tests pass verbatim.
 *
 * PRESENTATION ONLY. Pure; no store, no rng, no wall clock; lazy-only (rides the
 * realm-dashboard / inspector chunk) so budget-free.
 */

export {
  hegemonyRead,
  hasHegemony,
  HEGEMONY_TUNING,
  SUBORDINATING_TERM_TYPES,
} from '../worldPulse/hegemony.js';
