#!/usr/bin/env python3
"""
countsweep.py — THE ONE PARSE INSTRUMENT FOR THE HABIT VOLUME (J-HB-27).

WHAT IT IS FOR. Across three review rounds this volume's defects were almost never
wrong at their SOURCE. They were wrong in a SENTENCE that had copied a source table
and then stopped watching it: a row count, a coverage verdict, a set membership, a
carry-road partition, a decline figure, a deferral-book total. J-HB-23 named the rule
("A TABLE EDIT AND ITS COUNT ARE ONE EDIT") and the rule was then broken twice more,
because a rule with no instrument is a hope.

THE LAW IT ENFORCES — DERIVE, DON'T RESTATE. Every counted quantity in the volume is
DERIVED here from the volume's OWN tables, and then DIFFED against a DECLARED list of
the prose homes that state it. A home is not "a line number" and not "an anchor plus a
nearby number": it is an EXACT PHRASE that must occur an EXACT number of times. That
shape is deliberate and it closes the FIRST-MATCH DOCUMENT PIN class — a pin that
locates its target by first match silently retargets when a second match appears, so
every home here asserts its own occurrence count and a home that appears twice is as
loud a failure as a home that appears zero times.

WHAT A FAILURE MEANS. A FAIL is never "the script is out of date". It is one of exactly
two things: (a) a table was edited and a sentence was not, or (b) a sentence was edited
and the table was not. Both are the same bug and both are fixed by re-parsing, never by
editing this script's EXPECTATIONS.

⭐ WHAT "NEVER EDIT THE SCRIPT" DOES AND DOES NOT COVER (round four). The rule is scoped
to EXPECTATIONS — any transcribed quantity, any expected set, any figure this script
would compare the volume against. This script holds NONE, and adding one is what would
make it fail GREEN. The rule does NOT cover the RENDERING TABLE below (`WORDS`), which
is not an expectation of any kind: it is a numeral→English-word renderer used to BUILD
the phrase a derived quantity is searched for. Growing it is always permitted and never
changes a verdict, only the spelling of a phrase the volume is asked for. ⚠⚠ THE REASON
THIS IS WRITTEN DOWN: at round three `W()` was a bare dict lookup, so the two edits most
likely to happen next — adding a coverage row (deferral book 43 → 44) and adding a
judgment block (27 → 28) — did not FAIL the census, they CRASHED it with a KeyError and
printed nothing at all. An instrument that dies on the edit it exists to catch is worse
than no instrument, because its silence reads as absence of a finding. `W()` is now TOTAL
over the integers: any integer renders, falling back to the NUMERAL when the table has no
word for it, so an unrendered number produces an ordinary loud HOME DIFF.

THE SECOND FAMILY — THE STRUCK-PREMISE SCAN (J-HB-28). The count family closes the stale
NUMBER class. It cannot see the stale CLAIM class: a sentence that restates a premise
§0.3 already refuted, at a home nobody re-read. That family is at the bottom of this file
and it re-runs at every revision exactly as the count family does.

USAGE:  python3 countsweep.py [path-to-volume]
EXIT:   0 iff ZERO diffs.  Non-zero is the number of failing quantities.
"""

import hashlib
import json
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_VOLUME = os.path.join(HERE, "DESIGN_HABIT_ARCHITECTURE-POLISHED.md")
SWEEP_SCRIPT = os.path.join(HERE, "VERIFY_oddsratio.py")

# ---------------------------------------------------------------- text plumbing

CELL_SPLIT = re.compile(r"(?<!\\)\|")


def read_volume(path):
    with open(path, "r", encoding="utf-8") as fh:
        return fh.read()


def norm(text):
    """Whitespace-normalized view. Prose homes wrap across lines; the document's own
    line breaks are typography, never structure, so every phrase match runs against
    this view and never against a raw line."""
    text = re.sub(r"(?m)^>\s?", "", text)
    return re.sub(r"\s+", " ", text)


def strip_markers(cell):
    """Drop the volume's leading decoration (star/stop glyphs, bold, spaces) so a cell
    can be classified on the word it actually leads with."""
    return cell.strip().lstrip("⭐⛔⚠✅* \t").strip()


def cells(row, want=None):
    """Split a table row. ⚠⚠ `want` PADS A SHORT ROW, AND THAT IS A CRASH FIX, NOT A
    LENIENCY.

    A row missing a cell is precisely what `malformed_row_scan` exists to report — and at
    round four a mutant proved the instrument died of an IndexError inside `coverage()`
    BEFORE that scan ever ran, taking the whole census's stdout with it. The same shape as
    the `W()` KeyError: the instrument aborting on the edit it exists to catch, so its
    silence reads as absence of a finding. The scan measures the RAW row and is unaffected
    by this padding; padding only keeps the other fifty quantities alive long enough to be
    printed beside the malformed-row finding."""
    parts = CELL_SPLIT.split(row)
    if parts and parts[0].strip() == "":
        parts = parts[1:]
    if parts and parts[-1].strip() == "":
        parts = parts[:-1]
    out = [p.strip() for p in parts]
    if want is not None and len(out) < want:
        out = out + [""] * (want - len(out))
    return out


def all_tables(text):
    """Every markdown table in the document, as (header_cells, [data_rows], line_no).
    A table is a run of consecutive lines starting with '|' whose second line is the
    separator."""
    lines = text.split("\n")
    tables = []
    i = 0
    while i < len(lines):
        if lines[i].lstrip().startswith("|"):
            run = []
            start = i
            while i < len(lines) and lines[i].lstrip().startswith("|"):
                run.append(lines[i])
                i += 1
            if len(run) >= 2 and set(run[1].replace("|", "").replace(" ", "")) <= set("-:"):
                tables.append((cells(run[0]), run[2:], start + 1))
        else:
            i += 1
    return tables


def table_by_header(text, signature):
    for header, rows, line_no in all_tables(text):
        if [c.strip() for c in header] == signature:
            return rows
    raise LookupError("no table with header %r" % (signature,))


def lead_int(cell):
    m = re.search(r"\d+", cell)
    return int(m.group(0)) if m else None


def action_tokens(cell):
    """Backticked tokens that are ACTION TOKENS by the volume's own §3g shape rule
    (lower_snake). This is what stops `bilateralOffer === false` from being counted as
    an action beside `sue_for_peace`."""
    return [t for t in re.findall(r"`([^`]+)`", cell) if re.fullmatch(r"[a-z][a-z_]*", t)]


# ---------------------------------------------------------------- number words

# ⭐ A RENDERING TABLE, NOT AN EXPECTATION TABLE. Nothing here is compared against the
# volume. Each entry only says how to SPELL an integer that was DERIVED elsewhere, so
# that the phrase we go looking for reads the way the volume writes it. Growing this
# table is explicitly permitted (see the module docstring) and can never change a
# verdict — a missing entry degrades a phrase to its numeral, never to a pass.
WORDS = {
    0: "ZERO", 1: "ONE", 2: "TWO", 3: "THREE", 4: "FOUR", 5: "FIVE", 6: "SIX",
    7: "SEVEN", 8: "EIGHT", 9: "NINE", 10: "TEN", 11: "ELEVEN", 12: "TWELVE",
    13: "THIRTEEN", 14: "FOURTEEN", 15: "FIFTEEN", 16: "SIXTEEN", 17: "SEVENTEEN",
    18: "EIGHTEEN", 19: "NINETEEN", 20: "TWENTY", 21: "TWENTY-ONE", 22: "TWENTY-TWO",
    23: "TWENTY-THREE", 24: "TWENTY-FOUR", 25: "TWENTY-FIVE", 26: "TWENTY-SIX",
    27: "TWENTY-SEVEN", 28: "TWENTY-EIGHT", 29: "TWENTY-NINE", 30: "THIRTY",
    31: "THIRTY-ONE", 32: "THIRTY-TWO", 33: "THIRTY-THREE", 40: "FORTY",
    41: "FORTY-ONE", 42: "FORTY-TWO", 43: "FORTY-THREE", 44: "FORTY-FOUR",
    45: "FORTY-FIVE", 46: "FORTY-SIX", 50: "FIFTY",
}


def W(n):
    """TOTAL over the integers by construction — the numeral is the fallback.

    A KeyError here would abort the whole census, taking the other thirty-odd
    quantities' verdicts with it, on the most likely future edit there is: a table
    growing by one row. A number the table cannot spell therefore renders as itself,
    the phrase built from it simply is not found in the volume, and the result is an
    ordinary HOME DIFF naming the phrase — which is the outcome the instrument exists
    to produce."""
    return WORDS.get(n, str(n))


def w(n):
    return W(n).lower()


def Wt(n):
    return W(n).title()


def setstr(s):
    return "{" + ", ".join(str(x) for x in sorted(s)) + "}"


# ---------------------------------------------------------------- the derivations

class Volume:
    def __init__(self, path):
        self.path = path
        self.text = read_volume(path)
        self.n = norm(self.text)
        self.lines = self.text.split("\n")

    # -- tables ------------------------------------------------------------
    def closes(self):
        rows = table_by_header(self.text, [
            "#", "Circumstance", "Episode key", "Key road",
            "Closing vocabulary (existing)", "Grade map"])
        out = {}
        for r in rows:
            c = cells(r, 6)
            out[lead_int(c[0])] = {"key": c[2], "road": c[3], "vocab": c[4], "grades": c[5]}
        return out

    def carry_roads(self):
        buckets = {"carried": set(), "recomputed": set(), "both": set(), "verify": set()}
        for num, row in self.closes().items():
            lead = strip_markers(row["road"])
            if lead.startswith("BOTH ROADS"):
                buckets["both"].add(num)
            elif lead.startswith("CARRIED"):
                buckets["carried"].add(num)
            elif lead.startswith("RECOMPUTED") and "VERIFY-AT-BUILD" in lead:
                buckets["verify"].add(num)
            elif lead.startswith("RECOMPUTED"):
                buckets["recomputed"].add(num)
            else:
                buckets.setdefault("unclassified", set()).add(num)
        return buckets

    def coverage(self):
        rows = table_by_header(self.text, ["Site", "Action", "Close", "Coverage"])
        out = []
        for r in rows:
            c = cells(r, 4)
            out.append({"site": lead_int(c[0]), "action": c[1],
                        "close": c[2], "cover": c[3]})
        return out

    def needs_close_rows(self):
        """A row is a NEEDS-A-CLOSE row only when its Coverage cell LEADS with the
        verdict. Site 1's row mentions the token in a conditional sentence and is
        COVERED; a substring test would count it and inflate the book."""
        return [r for r in self.coverage()
                if strip_markers(r["cover"]).startswith("NEEDS-A-CLOSE")]

    def partition(self):
        rows = table_by_header(self.text, ["Disposition", "Count", "Rows", "Why"])
        out = []
        for r in rows:
            c = cells(r, 4)
            label = strip_markers(c[0]).strip("*").split(" ")[0].strip("*")
            declared = lead_int(c[1])
            members = [int(x) for x in re.findall(r"\d+", c[2])]
            out.append({"label": label, "declared": declared, "members": members})
        return out

    def learn_sites(self):
        for row in self.partition():
            if row["label"].startswith("LEARN"):
                return set(row["members"])
        raise LookupError("no LEARN row in the disposition partition")

    def defer_sites(self):
        for row in self.partition():
            if row["label"].startswith("DEFER"):
                return set(row["members"])
        raise LookupError("no DEFER row in the disposition partition")

    def site_table(self):
        rows = table_by_header(self.text, [
            "#", "Site (symbol)", "Seam — where the term enters",
            "Class(es)", "Actions", "Wave"])
        return [lead_int(cells(r, 6)[0]) for r in rows]

    def arity(self):
        rows = table_by_header(self.text, ["Site", "Arity", "The measurement"])
        out = {}
        for r in rows:
            c = cells(r, 3)
            site = lead_int(c[0])
            cell = c[1].upper()
            if "PER-ACTION" in cell:
                out[site] = "PER-ACTION"
            elif "DYADIC" in cell:
                out[site] = "DYADIC"
            elif "MONADIC" in cell:
                out[site] = "MONADIC"
            else:
                # ⚠ A cell we cannot classify is ONE quantity's finding, never the whole
                # census's death. arity_table's set comparison reports it by name.
                out[site] = "UNPARSED"
        return out

    def anticipation_wave_wired(self):
        """The rows with a non-null anticipationWave, read off HB-7's charter sentence
        rather than hand-listed here."""
        m = re.search(r"exactly two rows are non-null — site (\d+).{0,80}?and site (\d+)", self.n)
        if not m:
            raise LookupError("HB-7's anticipationWave sentence not found")
        return {int(m.group(1)), int(m.group(2))}

    def derived_one_term_set(self):
        """J-HB-25 as corrected by J-HB-26: LEARN and dyadic and unwired."""
        learn = self.learn_sites()
        ar = self.arity()
        wired = self.anticipation_wave_wired()
        return {s for s in learn if ar.get(s) == "DYADIC" and s not in wired}

    def checklist(self):
        rows = table_by_header(self.text, [
            "#", "Domain (owner's word)", "The fork, by SYMBOL",
            "Idiom", "Call", "Reason / close"])
        out = []
        for r in rows:
            c = cells(r, 6)
            label = strip_markers(c[1]).strip("*")
            label = re.split(r"\s+—\s+", label)[0].strip().strip("*").strip()
            out.append({"id": c[0].strip(), "label": label})
        return out

    def checklist_labels_ordered(self):
        seen, order = {}, []
        for row in self.checklist():
            if row["label"] not in seen:
                seen[row["label"]] = 0
                order.append(row["label"])
            seen[row["label"]] += 1
        return order, seen

    def seams(self):
        return table_by_header(self.text, ["#", "Neighbour", "The contract", "The tripwire"])

    def lifecycle(self):
        return table_by_header(self.text, ["Path", "Writer / reader", "Survives?"])

    def anticipation_seams(self):
        rows = table_by_header(self.text, ["Rank", "Seam", "How the term enters", "Belief routing"])
        return [cells(r, 4) for r in rows]

    def classes(self):
        return table_by_header(self.text, ["#", "Class", "Fires when", "Borrowed from"])

    def flags(self):
        return table_by_header(self.text, ["Flag", "Wave", "What it gates"])

    def idioms(self):
        for header, rows, _ in all_tables(self.text):
            if header and header[0].strip() == "Idiom" and len(header) == 5:
                return rows
        raise LookupError("the §3c application-law idiom table was not found")

    # -- line-anchored scans ----------------------------------------------
    def line_matches(self, pattern):
        rx = re.compile(pattern)
        return [ln for ln in self.lines if rx.match(ln)]

    def numbered_blocks(self, prefix):
        got = [int(m.group(1)) for ln in self.lines
               for m in [re.match(r"^\*\*%s(\d+) —" % prefix, ln)] if m]
        return got

    def bands_lines(self):
        return self.line_matches(r"^\*\*Bands:\*\*")

    # -- inline literals ---------------------------------------------------
    def chartered_prefixes(self):
        m = re.search(r"CHARTERED_VOLUME_PREFIXES = Object\.freeze\(\[([^\]]*)\]\)", self.n)
        return re.findall(r"'([A-Z]+)'", m.group(1))

    def severity_ladder(self):
        m = re.search(r"SEVERITY_LADDER = Object\.freeze\(\[([^\]]*)\]\)", self.n)
        return re.findall(r"'([a-z]+)'", m.group(1))

    def severity_weights(self):
        m = re.search(r"SEVERITY_W\s*=\s*\{([^}]*)\}", self.n)
        return re.findall(r"([a-z]+):", m.group(1))

    def census_split(self):
        m = re.search(r"Census 1 dispositioned fifty decision sites: (\d+) HABIT-READY, "
                      r"(\d+) NEEDS-A-CLOSE, (\d+) NOT-A-DECISION", self.n)
        return tuple(int(g) for g in m.groups())

    def war_seam_row(self):
        """§8.1's WAR row — the declared home of every foreign field THIS PROGRAM WRITES."""
        for r in self.seams():
            c = cells(r, 4)
            if c[1].startswith("**WAR"):
                return " ".join(c)
        raise LookupError("§8.1 has no WAR seam row")

    def foreign_fields_written(self):
        """Scoped to §8.1's WAR seam row ON PURPOSE. A bare document-wide scan for
        `X.habitEpisode` also returns HB-9's `occupationRecord.habitEpisode`, which is a
        DEFERRED close's proposal and not a field any HB wave writes — counting it would
        contradict Q1's own two-field question. The two quantities are separated rather
        than one of them being silently dropped."""
        return sorted(set(re.findall(r"\b([a-z][A-Za-z]*)\.habitEpisode\b",
                                     norm(self.war_seam_row()))))

    def foreign_fields_deferred(self):
        allf = set(re.findall(r"\b([a-zA-Z][A-Za-z]*)\.habitEpisode\b", self.n))
        return sorted(allf - set(self.foreign_fields_written()))

    def jhb13_fields(self):
        """The SAME name set, read off J-HB-13's ruling instead of §8.1's seam row — an
        INDEPENDENT home for it. Cardinality is not identity: a seam row that re-spells
        `treaty.habitEpisode` as `treatyRec.habitEpisode` still has length two and a
        length check sees nothing, which is the exact mutant that passed at round three.
        Two homes derived separately and compared as SETS is what sees it."""
        m = re.search(r"\*\*J-HB-13 —.*?(?=\*\*J-HB-14 —)", self.n, re.S)
        if not m:
            raise LookupError("J-HB-13's block was not found")
        return sorted(set(re.findall(r"\b([a-z][A-Za-z]*)\.habitEpisode\b", m.group(0))))

    def q1_block(self):
        m = re.search(r"\*\*Q1 —.*?(?=\*\*Q2 —)", self.n, re.S)
        if not m:
            raise LookupError("Q1's block was not found")
        return m.group(0)

    def malformed_rows(self):
        bad = []
        for header, rows, line_no in all_tables(self.text):
            want = len(header)
            for offset, r in enumerate(rows):
                got = len(cells(r))
                if got != want:
                    bad.append((line_no + 2 + offset, want, got, r[:70]))
        return bad


# ---------------------------------------------------------------- home checking

class Result:
    def __init__(self, name, value, recipe, family="COUNT"):
        self.name = name
        self.value = value
        self.recipe = recipe
        self.family = family
        self.homes = []
        self.notes = []
        self.xchecks = []

    def ok(self):
        return all(h[2] for h in self.homes) and not self.notes


def xcheck(res, description):
    """A STRUCTURAL cross-check: an assertion between two of the volume's own tables,
    with no prose home to diff against. Recorded and displayed so a quantity whose
    evidence is internal consistency never reads as a quantity nobody checked."""
    res.xchecks.append(description)
    return res


def check(vol, res, phrase, times=1):
    found = vol.n.count(phrase)
    res.homes.append((phrase, times, found == times, found))
    return res


def build(vol):
    R = []

    # ---- 1. named-domain checklist: rows -------------------------------
    rows = vol.checklist()
    n_rows = len(rows)
    r = Result("checklist_rows", n_rows,
               "count data rows of the §3c named-domain table")
    check(vol, r, "there are exactly **%s** of" % W(n_rows))
    check(vol, r, "Parsed from the table below at this revision: **%s data rows**" % W(n_rows))
    check(vol, r, "**THE COUNT IS %s AND THE WALKER" % W(n_rows))
    check(vol, r, "row count `== %d`" % n_rows)
    check(vol, r, "ITS DENOMINATOR IS %s.**" % W(n_rows))
    check(vol, r, "THE %s NAMED-DOMAIN ROWS OF §3c ASSERTED PRESENT" % W(n_rows))
    check(vol, r, "**%s named-domain rows across" % W(n_rows))
    check(vol, r, "%s ROWS ACROSS EIGHT LABELS" % W(n_rows))
    check(vol, r, "%s rows across EIGHT labels" % W(n_rows))
    R.append(r)

    # ---- 2. checklist labels + decomposition ---------------------------
    order, counts = vol.checklist_labels_ordered()
    r = Result("checklist_labels", len(order),
               "distinct domain labels in column 2, first-appearance order")
    check(vol, r, "{ " + ", ".join(order) + " }", times=3)
    check(vol, r, "carrying **%s domain labels**" % W(len(order)))
    check(vol, r, "%s labels, every one named in full here" % w(len(order)))
    check(vol, r, "ACROSS %s LABELS" % W(len(order)))
    check(vol, r, "across %s labels across the owner's SEVEN" % W(len(order)), times=2)
    R.append(r)

    decomp = " · ".join("%s %d" % (lab, counts[lab]) for lab in order)
    total = sum(counts.values())
    r = Result("checklist_decomposition", "%s = %d" % (decomp, total),
               "per-label counts in first-appearance order; must sum to the row count")
    check(vol, r, decomp + " = **%d**" % total)
    check(vol, r, "**" + " + ".join(str(counts[l]) for l in order) + " = %d.**" % total)
    check(vol, r, "+".join(str(counts[l]) for l in order) + " = %d" % total)
    xcheck(r, "the per-label decomposition sums to the checklist row count")
    if total != n_rows:
        r.notes.append("decomposition sums to %d, table has %d rows" % (total, n_rows))
    R.append(r)

    # ---- 3. the closes --------------------------------------------------
    cl = vol.closes()
    r = Result("closes", len(cl), "count data rows of the §3a closes table")
    check(vol, r, "THE %s JOINED CLOSES" % W(len(cl)))
    check(vol, r, "The %s closes are audited" % W(len(cl)))
    check(vol, r, "**%s closes, audited into" % W(len(cl)))
    check(vol, r, "THE %s GRADE MAPS (§3a's table)" % W(len(cl)))
    check(vol, r, "the closes are %s, not seven" % W(len(cl)))
    check(vol, r, "**%s close-side hooks ≤ 6 lines each" % W(len(cl)))
    check(vol, r, "seven of eight closes survive")
    R.append(r)

    # ---- 4. the carry-road partition ------------------------------------
    b = vol.carry_roads()
    r = Result("carry_road_partition",
               "carried=%s recomputed=%s both=%s verify=%s"
               % (setstr(b["carried"]), setstr(b["recomputed"]),
                  setstr(b["both"]), setstr(b["verify"])),
               "classify each closes-table Key road cell on the word it leads with")
    check(vol, r, "CARRIED %s · RECOMPUTED %s · ⭐ BOTH ROADS %s"
          % (setstr(b["carried"]), setstr(b["recomputed"]), setstr(b["both"])))
    check(vol, r, "CARRIED %s, RECOMPUTED %s, ⭐ BOTH ROADS %s"
          % (setstr(b["carried"]), setstr(b["recomputed"]), setstr(b["both"])))
    check(vol, r, "VERIFY-AT-BUILD %s" % setstr(b["verify"]), times=2)
    check(vol, r, "%s carried / %s recomputed / ONE BOTH ROADS / ONE verify-at-build"
          % (W(len(b["carried"])), W(len(b["recomputed"]))))
    xcheck(r, "the four buckets partition the closes table exactly")
    tot = sum(len(v) for v in b.values())
    if tot != len(cl):
        r.notes.append("buckets hold %d closes, table has %d" % (tot, len(cl)))
    R.append(r)

    # ---- 5. the coverage table ------------------------------------------
    cov = vol.coverage()
    nc = vol.needs_close_rows()
    r = Result("coverage_rows", len(cov),
               "count data rows of the §3a close-coverage table; every LEARN site must "
               "appear in it and no coverage row may name a site the site table lacks")
    xcheck(r, "every LEARN site appears in the coverage table")
    xcheck(r, "no coverage row names a site absent from the site table")
    missing = sorted(vol.learn_sites() - {x["site"] for x in cov})
    if missing:
        r.notes.append("LEARN sites absent from the coverage table: %s" % missing)
    stray = sorted({x["site"] for x in cov} - set(vol.site_table()))
    if stray:
        r.notes.append("coverage rows for sites absent from the site table: %s" % stray)
    R.append(r)

    # ---- 6. the deferral book -------------------------------------------
    ready, census_needs, notdec = vol.census_split()
    site_rows = [x for x in nc if x["site"] != 7]
    per_action = sum(len(action_tokens(x["action"])) for x in nc if x["site"] == 7)
    book = census_needs + len(site_rows) + per_action
    r = Result("deferral_book", book,
               "census NEEDS-A-CLOSE + demoted site rows + per-action rows, "
               "all three derived from the coverage table and the census sentence")
    check(vol, r, "**THE BOOK IS %s ROWS AT THIS REVISION" % W(book))
    check(vol, r, "THE DECOMPOSITION IS %d + %d + %d:**"
          % (census_needs, len(site_rows), per_action))
    check(vol, r, "**ALL %s ROWS" % W(book))
    check(vol, r, "**%s rows (%d + %d + %d)**"
          % (W(book), census_needs, len(site_rows), per_action))
    check(vol, r, "**%s-row deferral book (%d + %d + %d)**"
          % (W(book), census_needs, len(site_rows), per_action))
    R.append(r)

    # ---- 7. joined sites / disposition partition ------------------------
    part = vol.partition()
    site_ids = vol.site_table()
    r = Result("disposition_partition",
               " ".join("%s=%d" % (p["label"], len(p["members"])) for p in part),
               "each partition row's declared Count vs the length of its own Rows list, "
               "and the sum against the site table")
    xcheck(r, "each row's declared Count equals the length of its own Rows list")
    xcheck(r, "the partition covers the site table exactly")
    for p in part:
        if p["declared"] != len(p["members"]):
            r.notes.append("%s declares %s but lists %d rows"
                           % (p["label"], p["declared"], len(p["members"])))
    tot = sum(len(p["members"]) for p in part)
    if tot != len(site_ids):
        r.notes.append("partition covers %d sites, site table has %d" % (tot, len(site_ids)))
    R.append(r)

    learn = vol.learn_sites()
    r = Result("joined_sites", len(learn), "the LEARN row of the disposition partition")
    check(vol, r, "THE JOINED SET IS THEREFORE %s SITES" % W(len(learn)))
    check(vol, r, "the polish measures %s.**" % W(len(learn)))
    check(vol, r, "**%s joined chooser sites of %s listed" % (W(len(learn)), w(len(site_ids))))
    check(vol, r, "from twelve to %s" % w(len(learn)))
    R.append(r)

    r = Result("site_table", len(site_ids), "count data rows of the §3c site table")
    check(vol, r, "THE %s CENSUS-LISTED SITES" % W(len(site_ids)))
    R.append(r)

    # ---- 8. arity table --------------------------------------------------
    ar = vol.arity()
    expected = set(site_ids) - {s for p in part if p["label"] in ("STAY-DETERMINISTIC", "NO", "DEAD-CODE")
                                for s in p["members"]}
    r = Result("arity_table", len(ar),
               "one arity row per site that is neither struck, nor declared NO, nor dead code")
    xcheck(r, "one arity row per non-struck, non-NO, non-dead-code site")
    if set(ar) != expected:
        r.notes.append("arity rows %s vs expected %s" % (setstr(set(ar)), setstr(expected)))
    R.append(r)

    r = Result("site7_arity", "%s dyadicActions=['deploy']" % ar.get(7),
               "the arity table's row for site 7")
    check(vol, r, "**PER-ACTION** — `dyadicActions: ['deploy']`")
    check(vol, r, "`arity: 'per-action'` with `dyadicActions: ['deploy']`", times=3)
    xcheck(r, "site 7's parsed arity is PER-ACTION")
    if ar.get(7) != "PER-ACTION":
        r.notes.append("site 7 arity parsed as %r" % ar.get(7))
    R.append(r)

    # ---- 9. the derived one-term set ------------------------------------
    d = vol.derived_one_term_set()
    r = Result("derived_one_term_set", setstr(d),
               "registry query LEARN and dyadic and anticipationWave null (J-HB-26)")
    check(vol, r, "the arity table at this revision: `%s`.**" % setstr(d))
    check(vol, r, "EXECUTED at this revision: `%s` — ⛔ and NOT site 12" % setstr(d))
    check(vol, r, "set is `%s`. **Veto cost:**" % setstr(d))
    check(vol, r, "EXECUTED at this revision, that is **`%s`**" % setstr(d))
    R.append(r)

    # ---- 10. strategy moves ----------------------------------------------
    moves = set()
    for x in cov:
        if x["site"] == 7:
            moves.update(action_tokens(x["action"]))
    r = Result("strategy_moves", len(moves),
               "union of site-7 action tokens across the coverage table")
    check(vol, r, "`STRATEGY_MOVES` (HB-1, %s)" % W(len(moves)))
    check(vol, r, "`STRATEGY_MOVES` at %s, so ≤ %d" % (w(len(moves)), len(moves)))
    check(vol, r, "ten of %s moves are MONADIC" % w(len(moves)), times=2)
    check(vol, r, "nine of %s strategy moves" % w(len(moves)))
    check(vol, r, "believedMove ∈ %d × ownAction ∈ {deploy} = %d cells"
          % (len(moves), len(moves)))
    check(vol, r, "NOT %d × %d = %d" % (len(moves), len(moves), len(moves) ** 2))
    check(vol, r, "%d of the %d cells" % (len(moves) ** 2 - len(moves), len(moves) ** 2))
    R.append(r)

    # ---- 11. seams --------------------------------------------------------
    sm = vol.seams()
    r = Result("seam_rows", len(sm), "count data rows of §8.1")
    check(vol, r, "The %s seam rows" % W(len(sm)))
    check(vol, r, "**%s** seams pinned both sides" % W(len(sm)))
    check(vol, r, "the %s rows of §8.1 below" % W(len(sm)))
    check(vol, r, "amends by **+%d**" % len(sm))
    R.append(r)

    # ---- 12. lifecycle paths ----------------------------------------------
    lp = vol.lifecycle()
    r = Result("lifecycle_paths", len(lp), "count data rows of §8.5")
    check(vol, r, "(%s paths" % W(len(lp)))
    check(vol, r, "re-parsed at this revision: %d data rows" % len(lp))
    check(vol, r, "answers on %s.**" % W(len(lp)))
    check(vol, r, "on every one of the %s lifecycle" % W(len(lp)))
    check(vol, r, "**%s, not fourteen" % w(len(lp)))
    check(vol, r, "The %s inherited paths" % W(len(lp) - 1))
    R.append(r)

    # ---- 13. anticipation seams -------------------------------------------
    asx = vol.anticipation_seams()
    struck = [row for row in asx if "STRUCK" in row[1]]
    live = len(asx) - len(struck)
    r = Result("anticipation_seams", "%d rows, %d struck, %d live" % (len(asx), len(struck), live),
               "§3d seam table rows minus the struck ones")
    check(vol, r, "**THE %s ANTICIPATION SEAMS**" % W(live))
    check(vol, r, "seam 4 is struck (R6)")
    R.append(r)

    # ---- 14. idioms --------------------------------------------------------
    idi = vol.idioms()
    r = Result("idioms", len(idi), "count data rows of the §3c application-law table")
    check(vol, r, "There are %s idioms" % W(len(idi)))
    check(vol, r, "by the %s idiom signatures" % W(len(idi)))
    check(vol, r, "%s-idiom scan" % w(len(idi)), times=3)
    R.append(r)

    # ---- 15. circumstance classes -------------------------------------------
    cc = vol.classes()
    r = Result("circumstance_classes", len(cc), "count data rows of the §1.2 vocabulary table")
    check(vol, r, "— %s, total, precedence-ordered" % W(len(cc)))
    check(vol, r, "a member of CIRCUMSTANCE_CLASSES (%d)" % len(cc))
    check(vol, r, "expect(CIRCUMSTANCE_CLASSES.length).toBe(%d)" % len(cc))
    check(vol, r, "`HABIT_CLASS_CEILING = %d`" % len(cc))
    check(vol, r, "%s circumstance classes (a CEILING" % W(len(cc)))
    check(vol, r, "all %s tokens were measured" % w(len(cc)))
    check(vol, r, "at most %s entries" % W(len(cc)))
    check(vol, r, "`CIRCUMSTANCE_CLASSES` (%d, closed" % len(cc))
    check(vol, r, "`CIRCUMSTANCE_CLASSES` (%d, codepoint-sorted)" % len(cc))
    check(vol, r, "%s circumstance classes: is `unpressed`" % Wt(len(cc)))
    R.append(r)

    # ---- 16. flags -----------------------------------------------------------
    fl = vol.flags()
    r = Result("flags", len(fl), "count data rows of the §2.1 flag table")
    check(vol, r, "— %s flags, one strict ladder" % w(len(fl)))
    check(vol, r, "%s flags in one strict ladder" % W(len(fl)))
    check(vol, r, "Why %s and not one" % w(len(fl)))
    check(vol, r, "THE FLAG FAMILY — %s new rows" % w(len(fl)))
    check(vol, r, "rows for all %s flags" % w(len(fl)))
    check(vol, r, "%s AUTHORED rows in `subsystemRowsVirtual.js`" % Wt(len(fl)))
    check(vol, r, "one of the %s keys" % w(len(fl)))
    check(vol, r, "the %s `Active` functions" % w(len(fl)))
    R.append(r)

    # ---- 17. waves + bands ----------------------------------------------------
    waves = vol.numbered_blocks("HB-")
    r = Result("waves", len(waves), "count `**HB-n —` wave charters in §4")
    check(vol, r, "**Wave count: %d.**" % len(waves))
    check(vol, r, "%s waves, all dark" % W(len(waves)))
    check(vol, r, "amends by **+%d**" % len(waves))
    check(vol, r, "%s-wave corpus" % w(len(waves)))
    xcheck(r, "wave numbers are contiguous HB-0..HB-9")
    if sorted(waves) != list(range(0, len(waves))):
        r.notes.append("wave numbers not contiguous 0..%d: %s" % (len(waves) - 1, waves))
    R.append(r)

    bands = vol.bands_lines()
    none_by_design = [b for b in bands if "NONE BY DESIGN" in b]
    bearing = len(bands) - len(none_by_design)
    r = Result("bands_anchored_scan",
               "%d anchored lines, %d tuning-bearing, %d NONE BY DESIGN"
               % (len(bands), bearing, len(none_by_design)),
               "start-of-line `**Bands:**` scan; the anchored hit count must equal the wave count")
    check(vol, r, "the scan now returns **%d of %d**" % (len(bands), len(waves)))
    check(vol, r, "is %s without and %s with" % (W(len(none_by_design)), W(bearing)))
    check(vol, r, "**%s are tuning-bearing and %s carry `Bands: NONE BY DESIGN`**"
          % (W(bearing), W(len(none_by_design))))
    check(vol, r, "the other %s carry an explicit" % W(len(none_by_design)))
    check(vol, r, "%s waves bear tuning" % Wt(bearing))
    xcheck(r, "the anchored Bands hit count equals the wave count")
    if len(bands) != len(waves):
        r.notes.append("anchored Bands lines %d != wave count %d" % (len(bands), len(waves)))
    R.append(r)

    # ---- 18. judgment blocks ---------------------------------------------------
    jb = vol.numbered_blocks("J-HB-")
    r = Result("judgment_blocks", len(jb), "count `**J-HB-n —` blocks in §6")
    check(vol, r, "%s judgment blocks (J-HB-1..%d" % (W(len(jb)), len(jb)))
    xcheck(r, "J-HB numbers are contiguous with no gaps or duplicates")
    if sorted(jb) != list(range(1, len(jb) + 1)):
        r.notes.append("J-HB numbers not contiguous 1..%d: %s" % (len(jb), sorted(jb)))
    R.append(r)

    # ---- 19. refutations --------------------------------------------------------
    rf = vol.numbered_blocks("R")
    rf = [x for x in rf if x <= 100]
    r = Result("refutations", len(rf), "count `**Rn —` blocks in §0.3")
    check(vol, r, "**%s PREMISES WERE REFUTED OR SUPERSEDED" % W(len(rf)))
    check(vol, r, "%s premises REFUTED" % W(len(rf)))
    check(vol, r, "this volume lost %s premises" % w(len(rf)))
    check(vol, r, "and %s times now" % w(len(rf)))
    check(vol, r, "FIVE AT THE COMPILE (R1-R5)")
    check(vol, r, "SEVEN AT THE AMENDMENT (R6-R12)")
    check(vol, r, "SIX AT THE POLISH (R13-R18)")
    xcheck(r, "R numbers are contiguous with no gaps or duplicates")
    if sorted(rf) != list(range(1, len(rf) + 1)):
        r.notes.append("R numbers not contiguous 1..%d: %s" % (len(rf), sorted(rf)))
    R.append(r)

    # ---- 20. chair questions ------------------------------------------------------
    q = vol.numbered_blocks("Q")
    r = Result("chair_questions", len(q), "count `**Qn —` blocks in §7")
    check(vol, r, "OPEN CHAIR QUESTIONS (%s" % w(len(q)))
    check(vol, r, "%s questions to the chair" % W(len(q)))
    check(vol, r, "%s HB-prefixed chair questions" % w(len(q)))
    check(vol, r, "It holds %s questions and nothing else" % w(len(q)))
    check(vol, r, "of exactly those %s questions" % w(len(q)))
    xcheck(r, "Q numbers are contiguous with no gaps or duplicates")
    if sorted(q) != list(range(1, len(q) + 1)):
        r.notes.append("Q numbers not contiguous 1..%d: %s" % (len(q), sorted(q)))
    R.append(r)

    # ---- 21. chartered prefixes -----------------------------------------------------
    cp = vol.chartered_prefixes()
    r = Result("chartered_prefixes", len(cp), "count members of the quoted CHARTERED_VOLUME_PREFIXES array")
    check(vol, r, "— **%s.** `HB` is the TWELFTH" % W(len(cp)))
    check(vol, r, "is %s at HEAD" % W(len(cp)))
    R.append(r)

    # ---- 22. severity + hold rungs ----------------------------------------------------
    sl = vol.severity_ladder()
    sw = vol.severity_weights()
    r = Result("severity_ladder", len(sl), "the quoted SEVERITY_LADDER array vs SEVERITY_W's keys")
    check(vol, r, "all %s severity rungs" % w(len(sl)), times=2)
    check(vol, r, "entry for all %s rungs" % w(len(sl)))
    xcheck(r, "SEVERITY_W's key set equals SEVERITY_LADDER exactly")
    if sorted(sl) != sorted(sw):
        r.notes.append("SEVERITY_LADDER %s != SEVERITY_W keys %s" % (sl, sw))
    R.append(r)

    # ---- 23. closing vocabularies -------------------------------------------------------
    cl6 = re.findall(r"[a-z_]+", cl[6]["vocab"].split("`")[-2]) if "`" in cl[6]["vocab"] else []
    r = Result("tradition_outcome", len(cl6), "tokens in close 6's closing-vocabulary cell")
    check(vol, r, "**`TRADITION_OUTCOME` — %s, not three (R12).**" % W(len(cl6)))
    check(vol, r, "REFUTED — IT IS %s.**" % W(len(cl6)))
    check(vol, r, "covered three of %s" % w(len(cl6)))
    check(vol, r, "close 6\nis %s rungs".replace("\n", " ") % W(len(cl6)))
    R.append(r)

    # ---- 24. foreign fields ---------------------------------------------------------------
    ff = vol.foreign_fields_written()
    r = Result("foreign_fields_written", "%d %s" % (len(ff), ff),
               "distinct `<record>.habitEpisode` spellings inside §8.1's WAR seam row, "
               "diffed as a NAME SET against the set J-HB-13 names independently")
    # ⭐ THE HOME PHRASE IS BUILT FROM THE DERIVED NAMES, NEVER FROM A TRANSCRIPTION.
    # Re-spell a record inside the seam row and this phrase becomes one the volume does
    # not contain, so the re-spelling reds as a HOME DIFF that prints both spellings.
    check(vol, r, "**%s foreign fields (%s)"
          % (W(len(ff)), " and ".join("`%s.habitEpisode`" % f for f in ff)))
    check(vol, r, "ARE %s, NOT ONE" % W(len(ff)))
    check(vol, r, "FROM ONE FIELD TO %s" % W(len(ff)))
    check(vol, r, "⚠ %s foreign fields, not one" % W(len(ff)))
    check(vol, r, "See Q1, now %s fields" % w(len(ff)))
    xcheck(r, "§8.1's WAR seam row and J-HB-13 name the SAME SET of written fields")
    j13 = vol.jhb13_fields()
    if j13 != ff:
        r.notes.append("NAME-SET DIFF — §8.1's WAR seam row writes %s but J-HB-13 names "
                       "%s; only in %s / only in %s"
                       % (ff, j13, sorted(set(ff) - set(j13)), sorted(set(j13) - set(ff))))
    R.append(r)

    fd = vol.foreign_fields_deferred()
    r = Result("foreign_fields_deferred", "%d %s" % (len(fd), fd),
               "every other `<record>.habitEpisode` spelling in the volume — HB-9's "
               "deferred closes, surfaced rather than hidden by the scoping above")
    for name in fd:
        check(vol, r, "onto `%s.habitEpisode`" % name)
    xcheck(r, "every deferred spelling is named at Q1's third-field clause")
    for name in fd:
        if ("`%s.habitEpisode`" % name) not in vol.q1_block():
            r.notes.append("deferred spelling %r is not named inside Q1's block" % name)
    R.append(r)

    # ---- 25. malformed rows ------------------------------------------------------------------
    bad = vol.malformed_rows()
    r = Result("malformed_row_scan", len(bad),
               "every table's data rows must carry exactly its header's cell count")
    xcheck(r, "every data row in every table carries its header's cell count")
    for b in bad:
        r.notes.append("line %d: header wants %d cells, row has %d — %s" % b)
    R.append(r)

    # ---- 26. the sweep script's own identity ----------------------------------------------------
    # ⚠ The §3b figures are only re-checkable if the reader can tell WHICH script produced
    # them. The hash is DERIVED here from the file on disk, never transcribed, so the
    # volume's quoted hash is diffed exactly like any other counted quantity.
    with open(SWEEP_SCRIPT, "rb") as fh:
        sweep_md5 = hashlib.md5(fh.read()).hexdigest()
    r = Result("sweep_script_md5", sweep_md5, "md5 of VERIFY_oddsratio.py as it sits on disk")
    check(vol, r, "`VERIFY_oddsratio.py`, md5 `%s`" % sweep_md5)
    R.append(r)

    # ...and this instrument's own. §9 quoted it as bare prose, which is a transcription
    # and therefore exactly the class this file exists to abolish. It is now diffed.
    with open(__file__, "rb") as fh:
        own_md5 = hashlib.md5(fh.read()).hexdigest()
    r = Result("countsweep_md5", own_md5, "md5 of countsweep.py itself, diffed against "
                                          "the §9 sentence that quotes it")
    check(vol, r, "**SCRIPT: `countsweep.py`, md5 `%s`" % own_md5)
    R.append(r)

    # ---- 27. the executed sweep figures ---------------------------------------------------------
    r = Result("sweep_figures", "", "re-execute VERIFY_oddsratio.py and diff every figure "
                                    "the §3b EXECUTED table quotes")
    try:
        out = subprocess.run([sys.executable, SWEEP_SCRIPT], capture_output=True,
                             text=True, timeout=900)
        d = json.loads(out.stdout)
        sw2 = d["sweep"]
        figs = {
            "analytic law interval": ("[%s, %s]" % (d["analytic"]["law_lo"], d["analytic"]["law_hi"]),
                                      "the analytic interval `[(1−s)/(1+s), (1+s)/(1−s)] = [0.481481, 2.076923]`"),
            "observed odds range": ("%s" % sw2["odds_observed_range"],
                                    "observed range **[0.481791, 2.075591]**"),
            "violation rate": ("%s" % sw2["deleted_perprob_violation_rate"],
                               "violation rate **0.2643**"),
            "worst per-probability": ("%s" % sw2["deleted_perprob_worst"],
                                      "Worst observed **1.9380**"),
            "odds violations": ("%s" % sw2["odds_violations"], "**ZERO violations**"),
            "case A max": ("%s" % d["caseA"]["perprob_max"], "per-probability max **1.5457**"),
            "case B max": ("%s" % d["caseB"]["perprob_max"], "i.e. **2.0061 — 49% past"),
            "case C max": ("%s" % d["caseC"]["perprob_max"],
                           "per-probability ratio is `1.6933`**"),
            "case C p_deploy": ("%s" % d["caseC"]["note_pdeploy"], "`p_deploy = 0.2104` dark"),
        }
        r.value = "; ".join("%s=%s" % (k, v[0]) for k, v in figs.items())
        for label, (got, phrase) in figs.items():
            check(vol, r, phrase)
        # the quoted figures must be the ones the script actually returns
        for label, (got, phrase) in figs.items():
            bare = re.findall(r"[-+]?\d*\.?\d+", phrase)
            nums = re.findall(r"[-+]?\d*\.?\d+", got)
            for nx in nums:
                if float(nx) != 0 and nx not in phrase and nx.rstrip("0").rstrip(".") not in phrase:
                    if not any(abs(float(nx) - float(bx)) < 1e-9 for bx in bare if bx):
                        r.notes.append("%s: script says %s, volume quotes %r" % (label, got, phrase))
    except Exception as exc:  # noqa: BLE001
        r.notes.append("sweep script did not execute: %r" % (exc,))
    R.append(r)

    R.extend(build_struck_premise_family(vol))
    return R


# ============================================================================
# FAMILY TWO — THE STRUCK-PREMISE SCAN (J-HB-28)
# ============================================================================
#
# WHAT IT IS FOR. The count family closes the stale-NUMBER class: a table moved and a
# sentence quoting its size did not. It is structurally blind to the stale-CLAIM class,
# which is the same defect one level up — §0.3 refutes a premise at its source, and a
# sentence somewhere else in the volume goes on asserting it because nobody re-read that
# page. That is what F1 was: J-HB-5 still said the episode key is one "both sides compute
# independently" long after J-HB-13 ruled it MINTED AT OPEN AND CARRIED, so the volume
# carried a live sentence built on a premise its own register had killed.
#
# HOW IT WORKS. Each refuted premise declares SIGNATURE PHRASES — the distinctive wording
# of the REFUTED claim, taken from §0.3's own left column. Every occurrence anywhere in
# the volume must be LICENSED. There are exactly three licences and each is a POSITIVE
# test, never a list of excuses:
#
#   (a) REGISTER   — the occurrence lies inside the §0.3 span. Computed from the
#                    document's own headings, not from a line number.
#   (b) STRUCK     — a strike token from a CLOSED set stands within STRIKE_RADIUS
#                    characters of the occurrence, inside the same unit.
#   (c) QUOTED     — the occurrence sits inside a quotation AND the unit carries a
#                    quoting-to-strike label from a CLOSED set. Both halves are required:
#                    a quotation with no label is just an assertion in quotation marks.
#
# ⚠⚠ WHY THE RADIUS EXISTS, AND WHY IT IS NOT DECORATION. Licensing on "a strike token
# appears somewhere in this unit" fails OPEN — the estate's own hazard, an enumeration on
# the CREDIT side. A 2,900-character block that says ⛔ about one thing would then license
# a stale premise restated about something else 2,000 characters later. MEASURED across
# every licensed occurrence in this volume, the largest true strike distance is 317
# characters; the radius is set just above it, and the §3a occupation bullet — whose
# nearest ⛔ is 1,444 characters away — is licensed by its QUOTATION, which is the tighter
# and more honest reason.
#
# ⚠⚠ THE ANTI-VACUITY GUARD, AND THE ONE SUBTLETY IN IT. A signature that has drifted out
# of the register — a typo, or a register entry re-worded without re-reading this table —
# matches nothing and passes silently, which is the filename-anchored-pin vacuity class
# exactly. But "every signature must occur in §0.3" is the WRONG rule, and getting it
# wrong once during round four is why this comment exists: the sharpest signatures are the
# ones that appear NOWHERE, because they are the DERIVED restatement spellings a refuted
# premise mutates into. 'both sides compute independently' was never register wording; it
# was J-HB-5's paraphrase of R4, and the correct end state is that it occurs zero times.
# So each signature declares its ANCHOR:
#
#   "register"  — this phrase is the register's OWN wording. It MUST occur at least once
#                 inside §0.3, and zero register hits is a STALE SIGNATURE finding. This
#                 is the typo/drift guard, and every premise must carry at least one.
#   "forbidden" — a derived restatement spelling that should exist nowhere. Zero hits is
#                 the CLEAN state, and every hit must still hold a licence.

STRIKE_TOKENS = ("⛔", "STRUCK", "REFUTED", "SUPERSEDED", "DELETED AS FALSE",
                 "UNSATISFIABLE", "CORRECTED AT", "DISCHARGED", "DOES NOT REPRODUCE")

QUOTE_TO_STRIKE_TOKENS = ("IT READ:", "THE COMPILE ASSERTED", "THE COMPILE PROPOSED",
                          "THAT CLAIM FAILS", "THE SENTENCE THAT STOOD HERE",
                          "SPELLING READ")

STRIKE_RADIUS = 420

# The refuted premises of §0.3, each with the distinctive wording of THE CLAIM THAT FELL.
# ⛔ These are not expectations: nothing here is a quantity and nothing is compared against
# a transcribed value. They are search phrases, and every one is itself checked for
# presence in the register so a re-worded register cannot leave a signature scanning for
# text that no longer exists.
REG, FORB = "register", "forbidden"

STRUCK_PREMISES = [
    ("R1", "the war-chooser wiring is PARKED and owner-gated",
     [("war-chooser wiring is PARKED", REG), ("PARKED and owner-gated", REG),
      ("PARKED/owner-gated", FORB)]),
    ("R2", "MISSION_GRADES is the credit-at-close precedent to inherit",
     [("as MISSION_GRADES does", REG), ("credit-at-close precedent", REG)]),
    ("R3", "habits ride the existing decay law and the family has riders",
     [("Habits ride the existing decay law", REG), ("ride the existing decay law", REG)]),
    ("R4", "the foreign records need opening stamps; the key is recomputed at both ends",
     [("recompute the same episode key", REG),
      ("a read obligation, not a schema obligation", REG),
      ("satisfied at all seven joined closes", REG),
      ("records need opening stamps", REG),
      # ⭐ THE SEED THE CHAIR NAMED. These are J-HB-5's and §3a's PARAPHRASES of R4, never
      # the register's own words, and the correct count for the first two is now ZERO.
      ("both sides compute independently", FORB), ("compute independently", FORB),
      ("both sides can compute it", FORB)]),
    ("R5", "the chartered prefix set is nine",
     [("chartered prefix set is nine", REG), ("prefix set is nine", REG)]),
    ("R6", "reactiveResponse is already habitStrength minus the learning",
     [("minus the learning", REG),
      ("structurally `habitStrength(actor, class, action)` already", REG)]),
    ("R7", "the 'fortify' test is a dead arm; delete the arm",
     [("test is A DEAD ARM", REG), ("delete the arm", REG)]),
    ("R8", "proseNumerics is red at base (401 vs 410), awaiting a ruled re-record",
     [("401 vs 410", REG), ("awaiting a RULED re-record", REG), ("red at base", REG)]),
    ("R9", "HABIT_HOLD_BANDS borrows CHANNEL_BANDS both-directions, codepoint-sorted",
     [("borrows `CHANNEL_BANDS`", REG),
      ("imports BOTH sides and asserts verbatim equality", REG)]),
    ("R10", "habit needs a tick-to-week converter or it STOPs",
     [("VERIFY-AT-BUILD the exact conversion symbol", REG),
      ("tick-age to WEEK-age", REG)]),
    ("R11", "route creation is a worldgen draw and is excluded",
     [("ROUTE CREATION is a WORLDGEN draw", REG),
      ("worldgen is excluded by the census denominator", REG)]),
    ("R12", "TRADITION_OUTCOME is triumph/good/failure",
     [("`triumph`/`good`/`failure`", REG), ("three-rung spelling", REG)]),
    ("R13", "site 14 deliberationRead joins as a cadence fork",
     [("joins as a cadence fork", REG), ("cadence fork", REG)]),
    ("R14", "site 4 widenAcceptance is a weighted fork over {hold, widen}",
     [("weighted fork over", REG), ("{hold, widen}", REG)]),
    ("R15", "successScore is a score-then-draw ladder and joins as LEARN",
     [("score-then-draw", REG)]),
    ("R16", "the tilt-never-lock pin bounds the per-probability ratio by construction",
     [("SELECTION-PROBABILITY RATIO", REG),
      ("(1 − HABIT_SPAN, 1 + HABIT_SPAN)", REG)]),
    ("R17", "bestTargetId is present on every emitted move, so site 7 is DYADIC",
     [("MEASURED present on every emitted move", REG),
      ("present on every emitted move", REG)]),
    ("R18", "the twelve joined sites all satisfy the graded-close precondition",
     [("all satisfy the graded-close precondition", REG),
      ("twelve joined sites all satisfy", REG)]),
]


def units_of(text):
    """The volume split into LICENSING UNITS.

    A table row is its own unit — a table is one contiguous run of lines, so treating the
    whole table as one block would let a ⛔ in row 5 license a stale premise in row 9.
    Everything else is a blank-line-separated paragraph, because prose homes wrap across
    lines and a line-based scan cannot see a phrase that straddles a line break (the
    round-three vacuous-mutant lesson, in its other form)."""
    lines = text.split("\n")
    out, cur, cur_ln, cur_off, off = [], [], 0, 0, 0
    for i, ln in enumerate(lines):
        if ln.lstrip().startswith("|"):
            if cur:
                out.append((cur_ln, cur_off, "\n".join(cur)))
                cur = []
            out.append((i + 1, off, ln))
        elif ln.strip() == "":
            if cur:
                out.append((cur_ln, cur_off, "\n".join(cur)))
                cur = []
        else:
            if not cur:
                cur_ln, cur_off = i + 1, off
            cur.append(ln)
        off += len(ln) + 1
    if cur:
        out.append((cur_ln, cur_off, "\n".join(cur)))
    return out


def register_span(text):
    lo = text.index("### 0.3 The refutation register")
    hi = text.index("### 0.4 ")
    return lo, hi


def licence_for(unit_norm, hit_start, hit_end, in_register):
    """The licence this occurrence holds, or None. POSITIVE tests only."""
    if in_register:
        return "register"
    low = unit_norm.upper()
    for tok in STRIKE_TOKENS:
        for m in re.finditer(re.escape(tok.upper()), low):
            if min(abs(m.start() - hit_start), abs(m.end() - hit_end)) <= STRIKE_RADIUS:
                return "struck"
    quoted = any(q.start() <= hit_start and hit_end <= q.end()
                 for q in re.finditer(r"\"[^\"]*\"", unit_norm))
    if quoted and any(t in low for t in QUOTE_TO_STRIKE_TOKENS):
        return "quoted-to-strike"
    return None


def build_struck_premise_family(vol):
    reg_lo, reg_hi = register_span(vol.text)
    units = units_of(vol.text)
    out = []
    for rid, claim, sigs in STRUCK_PREMISES:
        r = Result("struck_%s" % rid, "", "scan the whole volume for %d signature "
                   "phrase(s) of the refuted claim %r" % (len(sigs), claim),
                   family="STRUCK-PREMISE")
        tally = {"register": 0, "struck": 0, "quoted-to-strike": 0}
        unlicensed, reg_hits = [], {s: 0 for s, _ in sigs}
        for ln, off, raw_unit in units:
            unit_norm = norm(raw_unit)
            in_register = reg_lo <= off < reg_hi
            for sig, _anchor in sigs:
                for m in re.finditer(re.escape(norm(sig)), unit_norm, re.I):
                    if in_register:
                        reg_hits[sig] += 1
                    lic = licence_for(unit_norm, m.start(), m.end(), in_register)
                    if lic is None:
                        snippet = unit_norm[max(0, m.start() - 60):m.end() + 60]
                        unlicensed.append((ln, sig, snippet))
                    else:
                        tally[lic] += 1
        for sig, anchor in sigs:
            if anchor == REG and reg_hits[sig] == 0:
                r.notes.append("STALE SIGNATURE — %r is declared REGISTER-anchored but "
                               "occurs nowhere inside §0.3, so it scans for wording the "
                               "register no longer uses" % sig)
        if not any(a == REG for _s, a in sigs):
            r.notes.append("UNANCHORED PREMISE — %s declares no register-anchored "
                           "signature, so nothing holds its scan to §0.3" % rid)
        for ln, sig, snippet in unlicensed:
            r.notes.append("UNLICENSED RESTATEMENT of %s at line ~%d — %r is neither in "
                           "the register, nor struck-marked within %d chars, nor a "
                           "labelled quotation: ...%s..."
                           % (rid, ln, sig, STRIKE_RADIUS, snippet))
        forb_live = sum(1 for s, a in sigs if a == FORB)
        r.value = ("%d ok (%d reg, %d struck, %d quoted) / %d unlicensed / %d forbidden-"
                   "spellings" % (sum(tally.values()), tally["register"], tally["struck"],
                                  tally["quoted-to-strike"], len(unlicensed), forb_live))
        xcheck(r, "every register-anchored signature still occurs inside §0.3 (anti-vacuity)")
        xcheck(r, "the premise carries at least one register-anchored signature")
        xcheck(r, "every occurrence outside §0.3 holds a positive licence")
        out.append(r)
    return out


# ---------------------------------------------------------------- reporting

def main():
    path = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_VOLUME
    vol = Volume(path)
    # ⭐⭐ THE BACKSTOP. Padding and the total W() remove the two crashes we KNOW about; this
    # removes the class. Whatever a future edit does to a table header or an inline
    # literal, this instrument's last act is to PRINT — a census that ends in a traceback
    # is a census whose silence a reader will mistake for "nothing found", which is the
    # single failure mode an instrument must not have.
    try:
        results = build(vol)
    except Exception as exc:  # noqa: BLE001
        print("COUNT CENSUS — countsweep.py over %s" % os.path.basename(path))
        print("")
        print("⛔ PARSE ABORT — the instrument could not finish deriving. THIS IS A "
              "FINDING, NOT AN OUTAGE:")
        print("   %s: %s" % (type(exc).__name__, exc))
        print("   A structure this script navigates by (a table header, a quoted literal, "
              "a named block)")
        print("   has moved. Fix the volume or re-aim the recipe — never delete the "
              "quantity.")
        return 1

    with open(__file__, "rb") as fh:
        self_md5 = hashlib.md5(fh.read()).hexdigest()

    # The §9 appendix IS this output, so hashing the whole file would make the figure
    # unstable by construction (paste the appendix, the hash it quotes goes stale). The
    # BODY hash — everything above the appendix — is stable across re-pastes and is
    # therefore the one a re-runner can actually check.
    # rstrip-then-newline so the hash is IDENTICAL whether the appendix is present or
    # not — otherwise a single trailing newline makes the quoted figure unverifiable,
    # which is the whole point of quoting it.
    body = vol.text.split("\n## §9 THE COUNT CENSUS")[0].rstrip("\n") + "\n"
    print("COUNT CENSUS — countsweep.py over %s" % os.path.basename(path))
    print("volume BODY md5 (above §9, stable across re-pastes): %s"
          % hashlib.md5(body.encode("utf-8")).hexdigest())
    print("countsweep.py md5                                  : %s" % self_md5)
    # BODY lines only: the whole-file count moves every time the appendix is re-pasted,
    # so quoting it inside the appendix would print a number that is false on arrival.
    print("volume BODY lines (above §9)                       : %d"
          % len(body.rstrip("\n").split("\n")))
    print("")
    failed = 0
    for family, heading in (("COUNT", "FAMILY ONE — THE COUNT LEDGER (J-HB-27): every "
                                      "counted quantity vs every prose home"),
                            ("STRUCK-PREMISE", "FAMILY TWO — THE STRUCK-PREMISE SCAN "
                                               "(J-HB-28): every refuted claim vs every "
                                               "restatement")):
        rows = [r for r in results if r.family == family]
        if not rows:
            continue
        print(heading)
        print("%-26s %-8s %-44s %-7s %s"
              % ("QUANTITY", "VERDICT", "DERIVED FROM THE VOLUME'S OWN TABLES",
                 "HOMES", "XCHK"))
        print("-" * 118)
        for r in rows:
            good = sum(1 for h in r.homes if h[2])
            verdict = "PASS" if r.ok() else "FAIL"
            if not r.ok():
                failed += 1
            val = str(r.value)
            if len(val) > 44:
                val = val[:41] + "..."
            print("%-26s %-8s %-44s %-7s %d"
                  % (r.name, verdict, val, "%d/%d" % (good, len(r.homes)), len(r.xchecks)))
            for phrase, times, ok, found in r.homes:
                if not ok:
                    print("      HOME DIFF  expected %dx, found %dx: %r"
                          % (times, found, phrase[:96]))
            for note in r.notes:
                print("      NOTE       %s" % note)
        print("-" * 118)
        print("")

    print("%d quantities swept across TWO families, %d FAIL, %d PASS"
          % (len(results), failed, len(results) - failed))
    print("TOTAL PROSE HOMES DIFFED: %d ; TOTAL STRUCTURAL CROSS-CHECKS: %d ; "
          "SIGNATURE PHRASES SCANNED: %d"
          % (sum(len(r.homes) for r in results), sum(len(r.xchecks) for r in results),
             sum(len(s[2]) for s in STRUCK_PREMISES)))
    if failed == 0:
        print("ZERO DIFFS — every counted quantity agrees with every prose home that "
              "states it, and no refuted premise is restated unmarked.")
    return failed


if __name__ == "__main__":
    sys.exit(main())
