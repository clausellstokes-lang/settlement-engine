// The canonical campaign-clock interval table. Integer weeks are the engine's
// single time base: a 4-4-5 display calendar lays twelve months over four exact
// thirteen-week seasons, for a fifty-two-week year.
//
// Keep this leaf dependency-free. Calendar, treaty, and advance-path consumers
// import the SAME frozen object rather than carrying clocks that can drift.
export const INTERVAL_WEEKS = Object.freeze({
  one_week: 1,
  one_month: 4,
  one_season: 13,
  one_year: 52,
});
