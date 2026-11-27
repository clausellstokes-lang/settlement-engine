# TRAD-MEASURE notes (running)
- 2026-11-27 seat start. Tree: lane/stack-121-guard-wip-2026-11-27 at cccda7569 (clean). Chair record c218485f3 at /home/user/chair (detached worktree).
- npm ci ok; unshallowed. Tools of R-MEASURE copied to /tmp/trad/tools.
- (A) reading: genesis is NOT a pipeline step. deriveFoundingTraditions is called by shownTraditions.js (view time), traditionsKernel.js (first-lit mint), and nowhere in src/generators. So "the birth draw" = a pure function of the FINISHED record, run at view or mint.
- GENERATOR_VERSION tree 0.10.0, master 0.9.0. FIELD_RITE_SINCE = '0.10.0' precedent.
- Plan: no vitest. esbuild bundle (plain node) of a harness exporting pipeline + traditions readers; births of plan-C/plan-V; count; candidate in a rsync copy at /tmp/trad/cand.
