// ⚠ THE TIMEOUT IS RAISED AND THE REASON IS DECLARED (MF-B5). These pins build SIX FULL
// SETTLEMENTS apiece — a city build measures 1.9 s on this machine — so a 5 s default was
// already inside the margin at MF-B4 and this lane's members (the second ground-law pass,
// the meander, the water clip) pushed four of them past it. The code is not slow: the pins
// are heavy by construction, because a census over a corpus is what they are.
// ⛔ THE LANDING EXECUTOR OWNS THIS: the repo's own vitest config governs at landing, and a
// pin that needs 20 s here needs it there. Land the timeout with the tests or they red.
// ⚠⚠ RAISED 30 s → 120 s AT MF-B8, AND THE CAUSE IS THE T-01 GRAIN. The fabric these pins
// build roughly DOUBLED — 11,308 drawn bodies across the corpus at MF-B7, 22,934 here — and
// several pins build four to six full settlements apiece. MEASURED: the build-out ladder pin
// took 30.7 s under parallel load and TIMED OUT, then passed in 87 s when its file ran alone.
// ⛔ A TIMEOUT REDS LIKE AN ASSERTION AND IS NOT ONE. The pin was correct both times; only the
// wall clock moved. ⭐ THE CLASS: **when a proof's SUBJECT grows, its budget is part of the
// proof** — and MF-B7's own hazard list already says the landing executor must land the
// timeout WITH the tests or they red in the repo for a reason that is not a defect.
export default { test: { include: ['tests/**/*.test.js'], environment: 'node', globals: false, testTimeout: 120000, hookTimeout: 120000 } };
