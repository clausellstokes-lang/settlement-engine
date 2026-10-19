// BD §8.2's row as written (DRAFT constants quoted from the volume) composed by MN5's union
// T + p(1 - T) against master's ENTER_THRESHOLD 0.55 (embattlement.js l.74); cap W_SIEGE 0.85 (l.87).
const PRESENCE_BY_MIGHT = { thin: 0.35, modest: 0.50, capable: 0.60, strong: 0.70, formidable: 0.70 };
const ACT_BASED = 0.8, ENTER = 0.55, CAP = 0.85;
for (const [band, base] of Object.entries(PRESENCE_BY_MIGHT)) {
  const p = Math.min(CAP, base * ACT_BASED);
  // the town's own ramp T at which a PEACEABLE flock merely based in the country latches it (sigma = 0)
  const tLatch = p >= ENTER ? 0 : (ENTER - p) / (1 - p);
  console.log(band.padEnd(10), 'p(based)', p.toFixed(3), 'latches alone', p > ENTER, 'latches once own ramp T >=', tLatch.toFixed(3));
}
