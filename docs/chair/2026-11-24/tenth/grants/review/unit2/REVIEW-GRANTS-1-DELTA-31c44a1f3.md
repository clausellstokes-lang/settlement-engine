# REVIEW-GRANTS-1 — the delta 39bfb0831..31c44a1f3 (written 2026-11-24 19:20 UTC)

VERDICT: CLEAR 31c44a1f36 for migration 211 and for the owner's files, with one wording defect (W1). All checks
below were executed by me in PGlite (`delta.mjs`, `delta.log`) unless marked PLAUSIBLE.

1. 211: with comment lines removed, the two versions are identical. Two comment blocks changed; no executable line moved.
2. The owner's files:
   - The new 0b counts the role's global row. With a global grant planted, 0b reads true after part B, and so does the
     truth (a real function made with the two convention lines).
   - Wrong-role case: if file 2 AND 0b both run as another role, 0b reads `false, false` while a function postgres
     makes is still open (true, true). Only `running_as` shows it.
   - On the live chain (203 + files 1–4) and on the line (210 + 211): 0b reads false, false; 6a shows exactly the four
     columns; 6b shows both triggers enabled; 7 returns no row, also with search_path = public only. No public function
     takes an argument type from another schema.
   - File 7's allowed list equals the register's USER + ANYONE + KEPT_OPEN rows (137 = 137).
   - Leaving out trigger functions is no hole: one cannot be called except as a trigger (PLAUSIBLE, Postgres semantics).
     Leaving out extension members hides only what an extension installs; none is in public in the replay (PLAUSIBLE
     for production).
   - By design, 7 cannot see a USER function that anon can also run (the known 59).
3. The tests go red when what they guard breaks:
   - M1, a guard that over-refuses an insert: the insert and upsert controls go red.
   - M2, a guard that over-refuses an upsert: both upsert controls go red.
   - M3, 0b without its global row: the global arm goes red.
   - M5, 7 without its allowed list: both arms go red. M6, 7 blind: the plant arm goes red.
   - M4: pinning the read to postgres by name passes all arms, so the "another role" arm doesn't pin the owner's own
     wrong-role case.
4. The rehearsal wave now states the four parts and expects `_guard_server_owned_columns`, which is true of 211.

W1 (CONFIRMED): `FOR-THE-OWNER-GRANTS.md`, the "0b again" row, says "If it still reads true, file 2 ran as another
role". When file 2 and 0b run in the same wrong role, 0b reads false, false. The before-row's "running_as must be
postgres" is the only catch. Cure: read postgres's rows by name (`defaclrole = 'postgres'::regrole`) beside running_as.
