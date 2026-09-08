# RECEIPT — LANE SEAM (the ARCH train)

Seat: Opus 5 — implementer. Chair: Fable 5.1.

## CAR 3a — THE SEAM, UNREACHABLE (ARCH §12 row 3a)

**STATUS: PARTIAL — in flight.** A session can die with no notice; every section below is
written as it is executed and nothing here is a prediction unless it says so.

### 3a.0 ARRIVAL — executed

```
$ git -C $SC/laneSEAM rev-parse HEAD
3b22b5c569e5c93f709f2a6057e3a0c280ff18ac
$ git -C $SC/laneSEAM status --porcelain | wc -l
       0
$ ls -ld $SC/laneSEAM/node_modules      # symlinked packages, never materialised
drwxr-xr-x@ 455 cstokes  wheel  14560 Sep  8 11:18 .../laneSEAM/node_modules
$ pgrep -fl vitest | wc -l
       0
```

HEAD equals the brief's §915 CAS (3b22b5c56). Porcelain 0. Runner count 0.

### 3a.1 THE REGISTER FIGURES, PREDICTED IN WRITING BEFORE ANY INSTRUMENT RAN

The only register door this car opens is the LIGHTING CENSUS, as sub-car 3a-b by its own
ritual. Predicted from the tree, at 11:5x, before `sovereigntyLightingContract.walker.test.js`
was run even once:

| figure | frozen (MEASURE car 4, `40dbcfc66`) | predicted after 3a | why |
|---|---|---|---|
| `files` | 2553 | **2562** | +9: seven new `src/domain/display/stateProse/*` files and two new test files |
| `parked` | 375 | **375** | nothing is parked by this car |
| `credited` | 2178 | **2187** | the same +9, all credited |
| `titles` | 23843 | **23901** | +58: `composeStateProse.test.js` 42, `composeStateProseFence.test.js` 9, `stateProseKernel.test.js` +7 |
| `suiteTitles` | 6377 | **6394** | +17: 13 + 3 + 1 new `describe()` blocks |

⚠ The `files`/`credited` prediction carries one unknown the lane could not settle from the
baseline alone: whether the census counts test files as well as `src/`. If it counts `src/`
only, the pair reads 2560 / 2185 instead. Both figures are stated so the measurement can
convict one of them rather than confirm whatever it says.
