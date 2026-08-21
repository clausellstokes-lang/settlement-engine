#!/usr/bin/env python3
"""Read-only integrity gate for SettlementForge map-reference evidence.

This gate validates inventory and evidence plumbing without opening or decoding an
image.  It deliberately calls the historical 53-image set an evaluation roster,
not a blind calibration holdout.  Use --hash-assets when a byte-level asset root
is needed; the default is fast enough for ordinary CI. It also invokes the separate
historical-urbanism registry gate; synthetic visual closure and historical evidence
remain distinct entries in the result.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
import sys
from pathlib import Path
from typing import Any, Iterable

from historical_evidence_integrity import IntegrityError as HistoricalIntegrityError
from historical_evidence_integrity import check as check_historical_evidence


DOCS = Path(__file__).resolve().parent
CORPUS = DOCS.parent
PLATES = CORPUS / "plates"
PREVIEWS = CORPUS / "previews"
ID_RE = re.compile(r"^hf\d+$")
PLATE_RE = re.compile(r"^(hf\d+)-(.+)\.png$")
PREVIEW_RE = re.compile(r"^prev-(hf\d+)-(.+)\.jpg$")


class IntegrityError(RuntimeError):
    pass


def require(condition: bool, message: str) -> None:
    if not condition:
        raise IntegrityError(message)


def numeric_id(value: str) -> tuple[int, str]:
    return int(value[2:]), value


def unique_by_id(paths: Iterable[Path], pattern: re.Pattern[str], label: str) -> dict[str, Path]:
    found: dict[str, Path] = {}
    for path in sorted(paths, key=lambda p: p.name):
        match = pattern.fullmatch(path.name)
        require(match is not None, f"unexpected {label} filename: {path.name}")
        plate_id = match.group(1)
        require(plate_id not in found, f"duplicate {label} id: {plate_id}")
        found[plate_id] = path
    return found


def walk_ids(value: Any) -> set[str]:
    out: set[str] = set()
    if isinstance(value, str) and ID_RE.fullmatch(value):
        out.add(value)
    elif isinstance(value, list):
        for item in value:
            out |= walk_ids(item)
    elif isinstance(value, dict):
        for item in value.values():
            out |= walk_ids(item)
    return out


def csv_rows(path: Path) -> tuple[list[str], list[dict[str, str]]]:
    with path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        require(reader.fieldnames is not None, f"missing CSV header: {path.name}")
        return list(reader.fieldnames), list(reader)


def semantic_cell_equal(text: str, value: Any) -> bool:
    if value is None:
        return text in ("", "null", "None")
    if isinstance(value, bool):
        return text.lower() == str(value).lower()
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        try:
            return float(text) == float(value)
        except ValueError:
            return False
    return text == str(value)


def scrub_ids() -> set[str]:
    text = (DOCS / "laneHF4-receipt.md").read_text(encoding="utf-8")
    match = re.search(r"^### .*SCRUB LIST.*?\n(.*?)\n---$", text, re.M | re.S)
    require(match is not None, "cannot locate HF4 scrub section")
    block = match.group(1)
    # The fifth item names hf373 only as the cured replacement.  It is not a
    # contaminated member and must not leak into the roster through broad regex.
    block = re.sub(r"Use \*\*hf\d+\*\* as the cured.*", "", block)
    return set(re.findall(r"\bhf\d+\b", block))


def calibration_ids() -> tuple[set[str], int, int]:
    calibration = (DOCS / "laneHF-CALIBRATION.md").read_text(encoding="utf-8")
    dedicated = set(re.findall(r"^\s*-\s+\*\*(hf\d+)\b", calibration, re.M))
    atlas = (DOCS / "laneMFS1-urbanism-atlas.md").read_text(encoding="utf-8")
    initial = set(re.findall(r"^###\s+(hf\d+)\s*[·.]", atlas, re.M))
    return dedicated | initial, len(dedicated), len(initial)


def asset_root(paths: Iterable[Path]) -> str:
    root = hashlib.sha256()
    for path in sorted(paths, key=lambda p: str(p.relative_to(CORPUS))):
        digest = hashlib.sha256()
        with path.open("rb") as handle:
            for chunk in iter(lambda: handle.read(1024 * 1024), b""):
                digest.update(chunk)
        relative = str(path.relative_to(CORPUS)).encode("utf-8")
        root.update(relative + b"\0" + str(path.stat().st_size).encode("ascii") + b"\0")
        root.update(digest.digest())
    return root.hexdigest()


def check(hash_assets: bool) -> dict[str, Any]:
    plate_paths = list(PLATES.glob("*.png"))
    preview_paths = list(PREVIEWS.glob("*.jpg"))
    plates = unique_by_id(plate_paths, PLATE_RE, "plate")
    previews = unique_by_id(preview_paths, PREVIEW_RE, "preview")
    require(len(plates) == 313, f"plate count: expected 313, got {len(plates)}")
    require(len(previews) == 313, f"preview count: expected 313, got {len(previews)}")
    require(set(plates) == set(previews), "plate/preview id sets differ")
    for plate_id in plates:
        p_stem = plates[plate_id].stem
        q_stem = previews[plate_id].stem.removeprefix("prev-")
        require(p_stem == q_stem, f"plate/preview stem mismatch: {plate_id}")

    measured_header, measured_csv = csv_rows(DOCS / "laneHFM1-corpus-measured.csv")
    measured_json = json.loads((DOCS / "laneHFM1-corpus-measured.json").read_text(encoding="utf-8"))
    require(len(measured_header) == 47, f"measured field count: {len(measured_header)}")
    require(len(measured_csv) == len(measured_json) == 313, "measured register count mismatch")
    csv_by_id = {row["id"]: row for row in measured_csv}
    json_by_id = {row["id"]: row for row in measured_json}
    require(len(csv_by_id) == len(json_by_id) == 313, "duplicate measured-register id")
    require(set(csv_by_id) == set(json_by_id) == set(plates), "register/asset id sets differ")
    for plate_id in sorted(plates, key=numeric_id):
        csv_row, json_row = csv_by_id[plate_id], json_by_id[plate_id]
        require(set(measured_header) <= set(json_row), f"JSON fields missing for {plate_id}")
        for field in measured_header:
            require(
                semantic_cell_equal(csv_row[field], json_row.get(field)),
                f"CSV/JSON mismatch at {plate_id}.{field}: {csv_row[field]!r} != {json_row.get(field)!r}",
            )

    cal_ids, dedicated_n, initial_n = calibration_ids()
    require(dedicated_n == 264, f"dedicated calibration rows: expected 264, got {dedicated_n}")
    require(initial_n == 49, f"atlas per-image sections: expected 49, got {initial_n}")
    require(cal_ids == set(plates), "combined calibration coverage does not equal asset roster")

    proposal = json.loads((DOCS / "laneHFM1-holdout-proposal.json").read_text(encoding="utf-8"))
    require("minimal_swap" in proposal, "holdout proposal lost minimal_swap")
    final_eval = list(proposal["minimal_swap"]["proposed"])
    require(len(final_eval) == len(set(final_eval)) == 53, "final evaluation roster is not 53 unique ids")
    require(set(final_eval) <= set(plates), "evaluation roster references missing asset")
    conservative = walk_ids(proposal)
    require(len(conservative) == 91, f"conservative exclusion union: expected 91, got {len(conservative)}")

    scrub = scrub_ids()
    require(len(scrub) == 34, f"scrub roster: expected 34, got {len(scrub)}")
    require("hf373" not in scrub, "cured exemplar hf373 leaked into scrub roster")
    require(scrub <= set(plates), "scrub roster references missing asset")
    require(not (scrub & set(final_eval)), "final evaluation roster contains lettering-scrub asset")

    frame = json.loads((DOCS / "MFS3a-frame.json").read_text(encoding="utf-8"))
    require(frame["corpus_n"] == 313, "frame corpus count drift")
    require(set(frame["holdout_ids"]) == conservative, "frame conservative exclusion drift")
    require(frame["studiable_n"] == 313 - len(conservative), "frame studiable count drift")
    require(set(frame["scrub_lettering_ids"]) == scrub, "frame scrub roster drift")
    require(frame["scrub_lettering_n"] == len(scrub), "frame scrub count drift")

    windows = json.loads((DOCS / "MFS3a-windows.json").read_text(encoding="utf-8"))
    window_keys = [key for key in windows if not key.startswith("_")]
    plan = json.loads((DOCS / "MFS3a-planmetrics.json").read_text(encoding="utf-8"))
    void = json.loads((DOCS / "MFS3a-voidmetrics.json").read_text(encoding="utf-8"))
    plan_keys = [row["key"] for row in plan]
    void_keys = [row["key"] for row in void]
    require(len(window_keys) == len(plan_keys) == len(void_keys) == 49, "S3a instrument row-count drift")
    require(window_keys == plan_keys == void_keys, "S3a instrument key-order drift")
    require(not any("error" in row for row in plan), "S3a plan metrics contain errors")

    context_header, context = csv_rows(DOCS / "MFS3B-context-census.csv")
    context_ids = [row["id"] for row in context]
    context_exclusion = set(proposal["proposed"]) | set(proposal["minimal_swap"]["proposed"]) | set(proposal["minimal_swap"]["added"])
    require(len(context_exclusion) == 81, f"context exclusion union: expected 81, got {len(context_exclusion)}")
    require(len(context_header) == 52, f"context field count: expected 52, got {len(context_header)}")
    require(len(context_ids) == len(set(context_ids)) == 232, "context census must contain 232 unique rows")
    require(set(context_ids) == set(plates) - context_exclusion, "context census eligibility drift")

    try:
        historical_evidence = check_historical_evidence()
    except HistoricalIntegrityError as exc:
        raise IntegrityError(f"historical evidence: {exc}") from exc

    result: dict[str, Any] = {
        "status": "ok",
        "assets": {"plates": 313, "previews": 313},
        "register": {"rows": 313, "fields": 47, "csv_json_semantic_mismatches": 0},
        "calibration": {"dedicated_rows": dedicated_n, "atlas_sections": initial_n, "covered_ids": 313},
        "evaluation_roster": {
            "ids": len(final_eval),
            "kind": "legacy_pixel_evaluation_not_untouched_holdout",
            "conservative_exclusion_ids": len(conservative),
        },
        "scrub": {"ids": len(scrub), "categories": 8},
        "plan_instruments": {"rows": 49, "errors": 0},
        "context_census": {"rows": 232, "fields": 52, "excluded_ids": len(context_exclusion)},
        "historical_evidence": historical_evidence,
    }
    if hash_assets:
        result["asset_set_sha256"] = asset_root(plate_paths + preview_paths)
    return result


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--hash-assets", action="store_true", help="hash all 626 image assets")
    parser.add_argument("--compact", action="store_true", help="emit compact JSON")
    args = parser.parse_args()
    try:
        result = check(args.hash_assets)
    except IntegrityError as exc:
        print(json.dumps({"status": "error", "error": str(exc)}, indent=2), file=sys.stderr)
        return 1
    print(json.dumps(result, indent=None if args.compact else 2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
