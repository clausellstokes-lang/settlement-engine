---
name: gate-mutex-self-deadlock-on-npm-check
description: "⚠⚠ NEVER WRAP `npm run check` / `check:tail` IN `sh scripts/gate-mutex.sh --run` — IT SELF-DEADLOCKS AND BURNS 20 MINUTES. The gate chain's own `test:ratchet` step re-invokes `gate-mutex.sh --run`, and the ancestry detection does NOT see through the npm process chain, so the inner call polls against its own ancestor's lock and gives up: `gate-mutex: GAVE UP after 40 poll(s) — atomic lock remains held` / `HELD by atomic lock PID <self>`. The gate reports **exit 3** — the mutex's give-up code, NOT a red gate. Run `npm run check:tail` BARE; its inner steps take the mutex themselves. (2026-08-12, Lane V, schema-6 mint.)"
metadata:
  type: project
  date: 2026-08-12
  branch: claude/composite-r4
  originSessionId: c42c8924-7331-45ab-a096-c5f1bc35f7d3
  modified: 2026-08-12T01:28:38.953Z
---

## The trap

The standing lane law reads "Vitest/gate ONLY through `sh scripts/gate-mutex.sh --run`".
Read literally that includes the full gate — and it must not. `npm run check` is a chain
whose `test:ratchet` step is itself
`sh scripts/gate-mutex.sh --run -- node scripts/check-test-ratchet.mjs`. The script has
ancestry detection meant to let a nested call through, but it does not resolve through
the `npm → sh → npm → sh` chain, so the inner acquisition sees a live foreign holder —
which is its own grandparent — and polls `GATE_MUTEX_MAX_POLLS` (40) ×
`GATE_MUTEX_POLL_SECONDS` (30) = **20 minutes** before giving up.

## How it presents, and why it is easy to misread as a red gate

```
> settlementforge@1.0.0 test:ratchet
> sh scripts/gate-mutex.sh --run -- node scripts/check-test-ratchet.mjs

gate-mutex: GAVE UP after 40 poll(s) — atomic lock remains held.
gate-mutex: HELD by atomic lock PID 14215: sh scripts/gate-mutex.sh --run -- npm run check:tail
[gate-tail] exit: 3 (the gate's own status, not a pipe's)
```

**Exit 3 is the mutex's give-up code.** Everything BEFORE `test:ratchet` really ran and
really passed (in the recorded instance: all validators, both typecheck ratchets, and
lint at 0 errors / 28 pre-existing warnings). Nothing in the suite failed. The tell is
the `HELD by ... PID <n>` line naming YOUR OWN wrapper command.

⚠ The harness task notification for that background run said "exit code 0" while the
in-shell capture said 3 — the recorded wrapper-code hazard, live again. Trust only the
`TRUE_EXIT=$?` you captured yourself.

## The rule

- **Full gate:** `npm run check:tail` **bare**, with `echo "TRUE_EXIT=$?"` on the next
  line. Never `gate-mutex.sh --run -- npm run check*`. Never through a pipe.
- **Focused vitest:** `sh scripts/gate-mutex.sh --run -- npx vitest run <files>` — the
  wrapper is correct here, because nothing inside re-acquires.
- Before re-running after a give-up, confirm the lock actually released:
  `ls -la "${TMPDIR:-/tmp}/settlementforge-vitest-gate.lock"` (absent = free),
  `sh scripts/gate-mutex.sh` (inspect-only, exit 0 = free), and `ps -p <held pid>`.
  A lock held by a DEAD pid is a report-it condition — never clear anything living.
