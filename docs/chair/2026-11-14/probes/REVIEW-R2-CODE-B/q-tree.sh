#!/bin/sh
# q-tree.sh <repo> <dir>: the stage's comparison tree Q = the stage's base 80b960171 merged with the integration line as the
# lane merged it (976db5b19, the second parent of 0aa0cce00), conflicts in Services.jsx and dossierPhoneFloorAllViews.test.jsx
# taken from the line's side (neither is read by births). A field diff Q -> tip is the stage's own change to the record,
# the line's arrival removed. Births: TREE=<dir> OUT=... SEEDS=seeds1536.txt node births.mjs (REVIEW-R3-STAGES births.mjs).
set -eu
R=$1; Q=$2; T=$(git -C "$R" merge-tree --write-tree 80b960171 976db5b19 | head -1)
git -C "$R" worktree add --detach "$Q" 80b960171; cd "$Q"; git read-tree -u --reset "$T"
git show 976db5b19:src/pdf/sections/Services.jsx > src/pdf/sections/Services.jsx
git show 976db5b19:tests/components/dossierPhoneFloorAllViews.test.jsx > tests/components/dossierPhoneFloorAllViews.test.jsx
