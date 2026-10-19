from edit import apply
pairs = [
("each crossing of a LIT way adds ONE to its way-mode edge's `useCount` (BD20; the route lifecycle's own write, WY's — A.2; a candidate's crossing is counted by the lifecycle's desire-path read, never by BD)",
 "each crossing of a way adds ONE to its way-mode edge's `useCount` — a candidate's FIRST crossing mints that edge at `wayRung: 'wild'` through the lifecycle's writer (the desire path's birth) — where `routeLifecycleEnabled` is lit (BD20; the route lifecycle's own write, WY's — A.2)"),
]
apply(pairs, 'c17')
