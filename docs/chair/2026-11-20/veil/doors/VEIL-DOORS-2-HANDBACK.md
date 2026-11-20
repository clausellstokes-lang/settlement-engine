# VEIL-DOORS-2 — hand-back (finishing the doors beside `data`)

Seat: VEIL-DOORS-2, branch `lane/veil-doors-2-2026-11-20`, cut from origin/lane/veil-doors-2026-11-20 at **cca49cb8d** (read
back from origin first: equal). Assignment: `lane/chair-2026-11-08 :: docs/chair/2026-11-20/seventh/prompts/VEIL-DOORS-2.txt`,
read at 6cb1e2003. Written 2026-11-20 02:37 UTC; kept current at every push. Every database local: a scratch PostgreSQL 16.15 in this
container (unix socket `/var/tmp/vd2/sock`, `listen_addresses = ''`, read back empty), and in-process pglite. **TIP: the commit
carrying this file.**

## 1. The bytes
| File | sha256 |
|---|---|
| 211 (FROZEN) | `eface6d093933170b9541fe630068c26e5bd41477e95e913ae7168e373be0b01` (proved at cca49cb8d) |
| 211 down (FROZEN) | `ce8474ffc251b4c4bd6005d5a409d4a15bd20fef6b507534ef6338d3bd49712f` (proved at cca49cb8d) |
| 212 at the base | `a79c285206c85ae9554d8c19c0420b9e57a52357db8355317118169c7285c576` (equal to the predecessor's 04704a660) |
| 212 down at the base | `f8bcf5426b811cf209ce3f67140d7e4403a303ae69b0272ebd8e17fd64b6a019` |

## 2. The base, measured (item 1)
Each figure with its output file beside it (`docs/chair/2026-11-20/veil/doors/v2/out/`), read by its count lines.
- The doors' arms and the walker: `base-doors-arms.txt`: Test Files 2 passed (2), Tests 13 passed (13) (galleryDoors.pglite
  7 of 7, galleryDoors.walker 6 of 6), exit 0.
- `tests/security` WHOLE (the predecessor's two re-keys included; it had not re-run the directory): `base-tests-security.txt`:
  Test Files 158 passed | 1 skipped (159); Tests 2003 passed | 1 skipped (2004); exit 0. The predecessor's 11 reds of
  04704a660 are gone at cca49cb8d (its two re-keyed files are among the 158).
- The instruments: the native chain loader (the pglite arms' scaffold with Supabase's default privileges, then every
  migration on disk in order); born towns by the engine's own pipeline through vite's loader (the browser's wizard
  defaults, the four sizes cycled, `publicProse` composed); the cost harness (median of 9 after one warm-up, read as anon).
