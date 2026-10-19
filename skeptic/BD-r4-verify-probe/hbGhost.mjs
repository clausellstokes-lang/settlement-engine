// Probe: does HB's one writer drop a habit row whose ACTOR has ended (a body that no longer exists)?
// BD §4.4 / §15.1 claim: "a body's rows DROP when it ends (HB's drop pass)".
// Imports the worktree's landed module read-only; edits nothing.
const W = process.argv[2];
const { writeHabits, HABIT_LEDGER_KEY } = await import(`${W}/src/domain/worldPulse/habit/habitLedger.js`);
const { HABIT_TUNING } = await import(`${W}/src/domain/worldPulse/habit/habitCurve.js`);
let ws = { simulationRules: { habitConditioningEnabled: true }, calendar: { elapsedWeeks: 10 }, spatialLedgers: {} };
const nonNeutral = HABIT_TUNING.NEUTRAL_I + 2000;
// week 10: the body (a body id as actorId) is credited on route_menaced for a stretch
ws = writeHabits(ws, { credits: [{ actorId: 'body:gang:abc123', circumstanceClass: 'route_menaced', action: 'stretch:a|b', stock: nonNeutral }] });
console.log('after body credit:', JSON.stringify(ws.spatialLedgers[HABIT_LEDGER_KEY].rows));
// the body ENDS (BD drops its record; nothing in HB is told). 200 weeks pass; another actor writes.
ws = { ...ws, calendar: { elapsedWeeks: 210 } };
ws = writeHabits(ws, { credits: [{ actorId: 'settlement:kell', circumstanceClass: 'stores_thin', action: 'x', stock: nonNeutral }] });
const rows = ws.spatialLedgers[HABIT_LEDGER_KEY].rows;
console.log('after 200 weeks and an unrelated write:', JSON.stringify(rows));
console.log('dead body row survives:', Object.prototype.hasOwnProperty.call(rows, 'body:gang:abc123'));
console.log('its stored stock unchanged:', JSON.stringify(rows['body:gang:abc123']));
