#!/usr/bin/env python3
"""Read-only integrity gate for the historical urbanism evidence registry.

The registry is intentionally claim-sized and citation-only by default. This gate
checks the epistemic laws that ordinary JSON Schema cannot express: a witness is
not a prevalence prior, absence needs coverage, interpretive claims do not become
measured geometry, and restricted sources never license geometry/pixel copying.
"""

from __future__ import annotations

import argparse
import copy
import json
import re
import sys
from datetime import date
from pathlib import Path
from typing import Any, Iterable
from urllib.parse import urlparse


DOCS = Path(__file__).resolve().parent
REGISTRY = DOCS.parent / "historical-evidence"
MANIFEST_PATH = REGISTRY / "manifest.json"
RECORDS_PATH = REGISTRY / "records.json"
SCHEMA_PATH = REGISTRY / "historical-evidence.schema.json"

RECORD_ID_RE = re.compile(r"^HE-[A-Z0-9-]+$")
TOKEN_ID_RE = re.compile(r"^[a-z0-9-]+$")
MECHANISM_ID_RE = re.compile(r"^[a-z]+(?:[.-][a-z0-9]+)+$")
CONTENT_HASH_RE = re.compile(r"^[a-f0-9]{64}$")
REQUIRED_PROHIBITIONS = {
    "DIRECT_GEOMETRY_COPY",
    "PIXEL_STYLE_COPY",
    "UNIVERSAL_RULE",
    "UNREGISTERED_PREVALENCE_PRIOR",
}
SOURCE_ROLES = {
    "BASE_CADASTRE",
    "HISTORIC_PRIMARY_PLAN",
    "HISTORIC_VIEW",
    "ARCHAEOLOGY",
    "WRITTEN_GAZETTEER",
    "INTERPRETIVE_RECONSTRUCTION",
    "THEMATIC_ANALYSIS",
}
CARTOGRAPHIC_SOURCE_ROLES = {
    "BASE_CADASTRE",
    "HISTORIC_PRIMARY_PLAN",
    "ARCHAEOLOGY",
    "INTERPRETIVE_RECONSTRUCTION",
    "THEMATIC_ANALYSIS",
}
CERTAINTY_ASPECTS = {"EXISTENCE", "ALIGNMENT", "EXTENT", "DATE", "FUNCTION", "MATERIAL"}
CERTAINTY_LEVELS = {"OBSERVED_EXISTING", "CERTAIN", "LIKELY", "HYPOTHETICAL", "UNKNOWN"}
EVIDENCE_MODES = {"DIRECTLY_DEPICTED", "TEXT_ASSERTED", "SCHOLARLY_INTERPRETED", "REVIEW_INFERENCE"}
GEOMETRY_STATUSES = {"NONE", "SYMBOLIC", "APPROXIMATE", "SOURCE_MEASURED"}
GEOMETRY_LINEAGES = {
    "ORIGINAL_SOURCE", "REDRAWN_SOURCE", "GEOREFERENCED_SOURCE", "INTERPRETIVE_ONLY", "NO_GEOMETRY",
}
PLANIMETRIC_QUALITIES = {
    "SURVEYED", "GEOREFERENCED_CORRECTED", "SCHEMATIC", "OBLIQUE_OR_DISTORTED", "UNKNOWN",
}
EDITORIAL_STATES = {"ORIGINAL_SOURCE_STATE", "EDITORIALLY_SUPPLEMENTED", "COMPOSITE"}
GEOREFERENCE_TRANSFORMS = {"AFFINE", "HELMERT", "OTHER_DECLARED"}
RIGHTS_MODES = {"CITATION_ONLY", "FACT_METADATA_ONLY", "OPEN_DERIVED_DATA"}
DERIVATIVE_SCOPES = {"MEASURED_FACTS", "DERIVED_NETWORK", "DERIVED_GEOMETRY", "SOURCE_GEOMETRY"}
COVERAGE_PURPOSES = {
    "FEATURE_SEARCH", "ARCHAEOLOGICAL_COVERAGE", "PLAN_COVERAGE", "MEASUREMENT_ELIGIBILITY",
}
ALLOWED_USES = {
    "POSSIBILITY_WITNESS",
    "MECHANISM_DESIGN",
    "COUNTEREXAMPLE",
    "COHORT_STATISTIC",
    "VALIDATION_CASE",
}


class IntegrityError(RuntimeError):
    pass


def require(condition: bool, message: str) -> None:
    if not condition:
        raise IntegrityError(message)


def require_keys(value: dict[str, Any], required: Iterable[str], label: str) -> None:
    missing = sorted(set(required) - set(value))
    require(not missing, f"{label} missing keys: {', '.join(missing)}")


def require_closed_keys(
    value: dict[str, Any], required: Iterable[str], allowed: Iterable[str], label: str
) -> None:
    require_keys(value, required, label)
    extra = sorted(set(value) - set(allowed))
    require(not extra, f"{label} has undeclared keys: {', '.join(extra)}")


def require_nonempty_text(value: Any, label: str) -> None:
    require(isinstance(value, str) and bool(value.strip()), f"{label} must be non-empty text")


def require_https(value: Any, label: str) -> None:
    require_nonempty_text(value, label)
    parsed = urlparse(value)
    require(parsed.scheme == "https" and bool(parsed.netloc), f"{label} must be an https URL")


def require_iso_date(value: Any, label: str) -> None:
    require_nonempty_text(value, label)
    try:
        date.fromisoformat(value)
    except ValueError as exc:
        raise IntegrityError(f"{label} must be ISO date YYYY-MM-DD") from exc


def validate_scale(value: Any, label: str) -> str:
    require(isinstance(value, dict), f"{label} must be object")
    kind = value.get("kind")
    require(isinstance(kind, str) and kind in {"DECLARED", "NOT_APPLICABLE"}, f"{label}.kind is invalid")
    if kind == "DECLARED":
        require(set(value) == {"kind", "denominator"}, f"{label} DECLARED shape is invalid")
        denominator = value["denominator"]
        require(type(denominator) is int and denominator >= 1, f"{label}.denominator must be a positive integer")
    else:
        require(set(value) == {"kind", "reason"}, f"{label} NOT_APPLICABLE shape is invalid")
        require_nonempty_text(value["reason"], f"{label}.reason")
    return kind


def validate_legend(value: Any, label: str) -> str:
    require(isinstance(value, dict), f"{label} must be object")
    kind = value.get("kind")
    require(isinstance(kind, str) and kind in {"DECLARED", "NOT_APPLICABLE"}, f"{label}.kind is invalid")
    if kind == "DECLARED":
        require(set(value) == {"kind", "ref"}, f"{label} DECLARED shape is invalid")
        require_nonempty_text(value["ref"], f"{label}.ref")
    else:
        require(set(value) == {"kind", "reason"}, f"{label} NOT_APPLICABLE shape is invalid")
        require_nonempty_text(value["reason"], f"{label}.reason")
    return kind


def validate_artifact_ref(value: Any, label: str) -> None:
    require(isinstance(value, dict), f"{label} must be object")
    require(set(value) == {"artifactId", "contentHash"}, f"{label} shape is invalid")
    require_nonempty_text(value["artifactId"], f"{label}.artifactId")
    require(
        isinstance(value["contentHash"], str) and CONTENT_HASH_RE.fullmatch(value["contentHash"]),
        f"{label}.contentHash must be lowercase sha256",
    )


def validate_measure_q(value: Any, label: str) -> None:
    require(isinstance(value, dict), f"{label} must be object")
    require(set(value) == {"valueQ", "unitId"}, f"{label} shape is invalid")
    require(type(value["valueQ"]) is int and value["valueQ"] >= 0, f"{label}.valueQ is invalid")
    require_nonempty_text(value["unitId"], f"{label}.unitId")


def validate_rights(value: Any, label: str) -> str:
    require(isinstance(value, dict), f"{label} must be object")
    mode = value.get("mode")
    require(mode in RIGHTS_MODES, f"{label}.mode is invalid")
    if mode == "CITATION_ONLY":
        require_closed_keys(value, {"mode"}, {"mode", "note"}, label)
    elif mode == "FACT_METADATA_ONLY":
        require_closed_keys(value, {"mode"}, {"mode", "note", "termsRef"}, label)
        if "termsRef" in value:
            validate_artifact_ref(value["termsRef"], f"{label}.termsRef")
    else:
        require_closed_keys(
            value,
            {"mode", "licenseId", "licenseUrl", "termsRef", "allowedDerivativeScope", "verifiedAt"},
            {
                "mode", "licenseId", "licenseUrl", "licenseVersion", "termsRef",
                "allowedDerivativeScope", "verifiedAt", "note", "geometryPayloadRef",
            },
            label,
        )
        require_nonempty_text(value["licenseId"], f"{label}.licenseId")
        require_https(value["licenseUrl"], f"{label}.licenseUrl")
        if "licenseVersion" in value:
            require_nonempty_text(value["licenseVersion"], f"{label}.licenseVersion")
        validate_artifact_ref(value["termsRef"], f"{label}.termsRef")
        scopes = value["allowedDerivativeScope"]
        require(
            isinstance(scopes, list) and bool(scopes) and len(scopes) == len(set(scopes)),
            f"{label}.allowedDerivativeScope must be nonempty and unique",
        )
        require(set(scopes) <= DERIVATIVE_SCOPES, f"{label}: unknown derivative scope")
        require_iso_date(value["verifiedAt"], f"{label}.verifiedAt")
        if "geometryPayloadRef" in value:
            validate_artifact_ref(value["geometryPayloadRef"], f"{label}.geometryPayloadRef")
    if "note" in value:
        require_nonempty_text(value["note"], f"{label}.note")
    return mode


def validate_coverage(value: Any, *, source: dict[str, Any], label: str) -> None:
    require(isinstance(value, dict), f"{label} must be object")
    kind = value.get("kind")
    require(kind in {"TEXTUAL_SCOPE", "SPATIAL_MASK"}, f"{label}.kind is invalid")
    if kind == "TEXTUAL_SCOPE":
        require_closed_keys(
            value,
            {"kind", "description", "omissions", "absenceIsEvidence"},
            {"kind", "description", "omissions", "absenceIsEvidence"},
            label,
        )
        require_nonempty_text(value["description"], f"{label}.description")
        require(value["absenceIsEvidence"] is False, f"{label}: textual scope cannot prove absence")
    else:
        base = {"kind", "maskRef", "purpose", "horizontalError", "omissions", "absenceIsEvidence"}
        absence = {"eligibleSearchAreaRef", "containmentProofRef", "absenceJustification"}
        required = base | (absence if value.get("absenceIsEvidence") is True else set())
        allowed = base | absence
        require_closed_keys(value, required, allowed, label)
        require(type(value["absenceIsEvidence"]) is bool, f"{label}.absenceIsEvidence must be boolean")
        require(source["scale"]["kind"] == "DECLARED", f"{label}: spatial mask requires declared source scale")
        validate_artifact_ref(value["maskRef"], f"{label}.maskRef")
        require(value["purpose"] in COVERAGE_PURPOSES, f"{label}: invalid coverage purpose")
        if value["purpose"] == "ARCHAEOLOGICAL_COVERAGE":
            require(source["role"] == "ARCHAEOLOGY", f"{label}: archaeology coverage requires archaeology source")
        if value["purpose"] in {"PLAN_COVERAGE", "MEASUREMENT_ELIGIBILITY"}:
            require(source["role"] in CARTOGRAPHIC_SOURCE_ROLES, f"{label}: purpose/source role mismatch")
        validate_measure_q(value["horizontalError"], f"{label}.horizontalError")
        if value["absenceIsEvidence"]:
            validate_artifact_ref(value["eligibleSearchAreaRef"], f"{label}.eligibleSearchAreaRef")
            validate_artifact_ref(value["containmentProofRef"], f"{label}.containmentProofRef")
            require_nonempty_text(value["absenceJustification"], f"{label}.absenceJustification")
    omissions = value["omissions"]
    require(isinstance(omissions, list), f"{label}.omissions must be array")
    for index, omission in enumerate(omissions):
        require_nonempty_text(omission, f"{label}.omissions[{index}]")


def load_json(path: Path) -> Any:
    require(path.is_file(), f"missing registry file: {path.relative_to(DOCS.parent)}")
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise IntegrityError(f"invalid JSON in {path.name}: {exc}") from exc


def validate_record(
    record: dict[str, Any],
    *,
    programs: set[str],
    mechanisms: set[str],
    cohorts: dict[str, dict[str, Any]],
) -> None:
    require_closed_keys(
        record,
        {
            "recordVersion", "recordId", "place", "representedPeriod", "source", "claim",
            "certainty", "coverage", "allowedUses", "prohibitedUses",
        },
        {
            "recordVersion", "recordId", "place", "representedPeriod", "source", "claim",
            "certainty", "coverage", "corroboratingRecordIds", "cohort", "allowedUses", "prohibitedUses",
        },
        "record",
    )
    require(record["recordVersion"] == 1, f"{record.get('recordId')}: recordVersion must be 1")
    record_id = record["recordId"]
    require(isinstance(record_id, str) and RECORD_ID_RE.fullmatch(record_id), f"invalid recordId: {record_id!r}")

    place = record["place"]
    require(isinstance(place, dict), f"{record_id}: place must be object")
    require_closed_keys(
        place,
        {"name", "polityOrRegion", "atlasProgramId"},
        {"name", "polityOrRegion", "atlasProgramId"},
        f"{record_id}.place",
    )
    require_nonempty_text(place["name"], f"{record_id}.place.name")
    require_nonempty_text(place["polityOrRegion"], f"{record_id}.place.polityOrRegion")
    require(place["atlasProgramId"] in programs, f"{record_id}: unregistered atlasProgramId")

    period = record["representedPeriod"]
    require(isinstance(period, dict), f"{record_id}: representedPeriod must be object")
    require_closed_keys(
        period, {"label"}, {"fromYear", "toYear", "label"}, f"{record_id}.representedPeriod"
    )
    require_nonempty_text(period.get("label"), f"{record_id}.representedPeriod.label")
    for key in ("fromYear", "toYear"):
        if key in period:
            require(type(period[key]) is int and -10000 <= period[key] <= 3000, f"{record_id}: {key} must be a bounded integer")
    if "fromYear" in period and "toYear" in period:
        require(period["fromYear"] <= period["toYear"], f"{record_id}: representedPeriod is reversed")

    source = record["source"]
    require(isinstance(source, dict), f"{record_id}: source must be object")
    require_closed_keys(
        source,
        {
            "publicationId", "publisher", "url", "accessedAt", "role", "scale", "legend",
            "geometryLineage", "planimetricQuality", "editorialState", "rights",
        },
        {
            "publicationId", "publisher", "url", "accessedAt", "sourceDate", "baseMapDate", "role",
            "scale", "legend", "geometryLineage", "planimetricQuality", "editorialState",
            "georeference", "sheetOrPage", "rights",
        },
        f"{record_id}.source",
    )
    require_nonempty_text(source["publicationId"], f"{record_id}.source.publicationId")
    require_nonempty_text(source["publisher"], f"{record_id}.source.publisher")
    require_https(source["url"], f"{record_id}.source.url")
    require_iso_date(source["accessedAt"], f"{record_id}.source.accessedAt")
    for key in ("sourceDate", "baseMapDate", "sheetOrPage"):
        if key in source:
            require_nonempty_text(source[key], f"{record_id}.source.{key}")
    role = source["role"]
    require(isinstance(role, str) and role in SOURCE_ROLES, f"{record_id}: invalid source role")
    scale_kind = validate_scale(source["scale"], f"{record_id}.source.scale")
    legend_kind = validate_legend(source["legend"], f"{record_id}.source.legend")
    require(source["geometryLineage"] in GEOMETRY_LINEAGES, f"{record_id}: invalid geometryLineage")
    require(source["planimetricQuality"] in PLANIMETRIC_QUALITIES, f"{record_id}: invalid planimetricQuality")
    require(source["editorialState"] in EDITORIAL_STATES, f"{record_id}: invalid editorialState")
    rights_mode = validate_rights(source["rights"], f"{record_id}.source.rights")
    if source["geometryLineage"] == "GEOREFERENCED_SOURCE":
        georef = source.get("georeference")
        require(isinstance(georef, dict), f"{record_id}: georeferenced source lacks transform metadata")
        require_closed_keys(
            georef,
            {"transform", "groundControlPointCount"},
            {"crs", "transform", "groundControlPointCount", "rmsError", "errorUnit"},
            f"{record_id}.source.georeference",
        )
        require(georef["transform"] in GEOREFERENCE_TRANSFORMS, f"{record_id}: invalid georeference transform")
        require(type(georef["groundControlPointCount"]) is int and georef["groundControlPointCount"] >= 3, f"{record_id}: invalid GCP count")
        if "rmsError" in georef:
            require(type(georef["rmsError"]) in {int, float} and georef["rmsError"] >= 0, f"{record_id}: invalid RMS error")
        for key in ("crs", "errorUnit"):
            if key in georef:
                require_nonempty_text(georef[key], f"{record_id}.source.georeference.{key}")
    elif "georeference" in source:
        raise IntegrityError(f"{record_id}: georeference metadata requires GEOREFERENCED_SOURCE lineage")

    claim = record["claim"]
    require(isinstance(claim, dict), f"{record_id}: claim must be object")
    require_closed_keys(
        claim,
        {"statement", "mechanismIds", "evidenceMode", "geometryStatus"},
        {"statement", "mechanismIds", "evidenceMode", "geometryStatus"},
        f"{record_id}.claim",
    )
    require_nonempty_text(claim["statement"], f"{record_id}.claim.statement")
    claim_mechanisms = claim["mechanismIds"]
    require(isinstance(claim_mechanisms, list) and bool(claim_mechanisms), f"{record_id}: no mechanismIds")
    require(len(claim_mechanisms) == len(set(claim_mechanisms)), f"{record_id}: duplicate mechanism id")
    require(all(isinstance(item, str) and MECHANISM_ID_RE.fullmatch(item) for item in claim_mechanisms), f"{record_id}: malformed mechanism id")
    require(set(claim_mechanisms) <= mechanisms, f"{record_id}: unregistered mechanism id")
    require(claim["evidenceMode"] in EVIDENCE_MODES, f"{record_id}: invalid evidenceMode")
    require(claim["geometryStatus"] in GEOMETRY_STATUSES, f"{record_id}: invalid geometryStatus")
    if claim["evidenceMode"] == "DIRECTLY_DEPICTED":
        require(claim["geometryStatus"] != "NONE", f"{record_id}: depicted evidence cannot have no geometry")
    if claim["evidenceMode"] in {"SCHOLARLY_INTERPRETED", "REVIEW_INFERENCE"}:
        require(claim["geometryStatus"] != "SOURCE_MEASURED", f"{record_id}: interpretation cannot be source-measured geometry")
    if source["geometryLineage"] == "NO_GEOMETRY":
        require(claim["geometryStatus"] == "NONE", f"{record_id}: NO_GEOMETRY source cannot support geometric claim")

    has_geometry = claim["geometryStatus"] != "NONE"
    cartographic_geometry = role in CARTOGRAPHIC_SOURCE_ROLES and has_geometry
    require_declared_scale = cartographic_geometry or claim["geometryStatus"] == "SOURCE_MEASURED"
    require_declared_legend = cartographic_geometry or claim["geometryStatus"] == "SYMBOLIC"
    if require_declared_scale:
        require(scale_kind == "DECLARED", f"{record_id}: cartographic/measured geometry requires declared scale")
    if require_declared_legend:
        require(legend_kind == "DECLARED", f"{record_id}: cartographic/symbolic geometry requires declared legend")

    certainty = record["certainty"]
    require(isinstance(certainty, list) and bool(certainty), f"{record_id}: certainty must be non-empty")
    aspects: list[str] = []
    for item in certainty:
        require(isinstance(item, dict), f"{record_id}: certainty entry must be object")
        require_closed_keys(
            item, {"aspect", "level", "basis"}, {"aspect", "level", "basis"}, f"{record_id}.certainty"
        )
        require(item["aspect"] in CERTAINTY_ASPECTS, f"{record_id}: invalid certainty aspect")
        require(item["level"] in CERTAINTY_LEVELS, f"{record_id}: invalid certainty level")
        require_nonempty_text(item["basis"], f"{record_id}.certainty.basis")
        aspects.append(item["aspect"])
    require(len(aspects) == len(set(aspects)), f"{record_id}: certainty aspect repeated")

    coverage = record["coverage"]
    validate_coverage(coverage, source=source, label=f"{record_id}.coverage")

    allowed = record["allowedUses"]
    prohibited = record["prohibitedUses"]
    require(isinstance(allowed, list) and bool(allowed) and len(allowed) == len(set(allowed)), f"{record_id}: invalid allowedUses")
    require(set(allowed) <= ALLOWED_USES, f"{record_id}: unknown allowed use")
    require(isinstance(prohibited, list) and REQUIRED_PROHIBITIONS <= set(prohibited), f"{record_id}: required prohibition missing")
    require(set(prohibited) == REQUIRED_PROHIBITIONS, f"{record_id}: unknown prohibited use")
    require(len(prohibited) == len(set(prohibited)), f"{record_id}: duplicate prohibited use")

    if "COHORT_STATISTIC" in allowed:
        cohort = record.get("cohort")
        require(isinstance(cohort, dict), f"{record_id}: cohort statistic lacks cohort")
        require_closed_keys(
            cohort,
            {"cohortId", "inclusionRuleVersion", "eligibleForPrevalence"},
            {"cohortId", "inclusionRuleVersion", "eligibleForPrevalence"},
            f"{record_id}.cohort",
        )
        cohort_id = cohort.get("cohortId")
        require(cohort_id in cohorts, f"{record_id}: cohort is not registered")
        require(cohort.get("eligibleForPrevalence") is True, f"{record_id}: record not eligible for prevalence")
        require(cohorts[cohort_id].get("eligibleForPrevalence") is True, f"{record_id}: cohort not eligible for prevalence")
        require(claim["evidenceMode"] != "REVIEW_INFERENCE", f"{record_id}: review inference cannot enter cohort statistic")
    elif "cohort" in record:
        cohort = record["cohort"]
        require(isinstance(cohort, dict), f"{record_id}: cohort must be object")
        require_closed_keys(
            cohort,
            {"cohortId", "inclusionRuleVersion", "eligibleForPrevalence"},
            {"cohortId", "inclusionRuleVersion", "eligibleForPrevalence"},
            f"{record_id}.cohort",
        )
        require(cohort.get("cohortId") in cohorts, f"{record_id}: unregistered cohort")

    if "cohort" in record:
        cohort = record["cohort"]
        require(type(cohort["inclusionRuleVersion"]) is int and cohort["inclusionRuleVersion"] >= 1, f"{record_id}: invalid cohort inclusionRuleVersion")
        require(isinstance(cohort["eligibleForPrevalence"], bool), f"{record_id}: invalid cohort eligibility")

    if rights_mode in {"CITATION_ONLY", "FACT_METADATA_ONLY"}:
        require("DIRECT_GEOMETRY_COPY" in prohibited and "PIXEL_STYLE_COPY" in prohibited, f"{record_id}: restricted source lacks copy prohibitions")

    if "corroboratingRecordIds" in record:
        corroborating = record["corroboratingRecordIds"]
        require(isinstance(corroborating, list), f"{record_id}: corroboratingRecordIds must be array")
        require(
            all(isinstance(item, str) and RECORD_ID_RE.fullmatch(item) for item in corroborating),
            f"{record_id}: malformed corroboratingRecordId",
        )
        require(len(corroborating) == len(set(corroborating)), f"{record_id}: duplicate corroboratingRecordId")


def validate_data(manifest: dict[str, Any], records_doc: dict[str, Any]) -> dict[str, Any]:
    require_keys(
        manifest,
        {"registryVersion", "policyVersion", "capturedAt", "researchWave", "schemaFile", "recordsFile", "programs", "cohorts", "mechanisms"},
        "manifest",
    )
    require(manifest["registryVersion"] == 1 and manifest["policyVersion"] == 1, "unsupported manifest version")
    require_iso_date(manifest["capturedAt"], "manifest.capturedAt")
    research_wave = manifest["researchWave"]
    require(isinstance(research_wave, dict), "manifest.researchWave must be object")
    require_closed_keys(
        research_wave,
        {"waveId", "status", "samplingFrameId", "holdoutRosterId", "prevalenceEligible", "expansionProtocol"},
        {"waveId", "status", "samplingFrameId", "holdoutRosterId", "prevalenceEligible", "expansionProtocol"},
        "manifest.researchWave",
    )
    require(
        isinstance(research_wave["waveId"], str) and TOKEN_ID_RE.fullmatch(research_wave["waveId"]),
        "manifest.researchWave.waveId is invalid",
    )
    require(research_wave["status"] == "EXPLORATORY_CASE_REGISTRY", "wave 1 status drift")
    require(research_wave["samplingFrameId"] is None, "wave 1 must not claim a sampling frame")
    require(research_wave["holdoutRosterId"] is None, "wave 1 must not claim a holdout")
    require(research_wave["prevalenceEligible"] is False, "wave 1 cannot carry prevalence")
    require(
        research_wave["expansionProtocol"] == "../docs/HISTORICAL-EVIDENCE-EXPANSION-PROTOCOL.md",
        "expansion protocol pointer drift",
    )
    require(manifest["schemaFile"] == SCHEMA_PATH.name, "manifest schemaFile drift")
    require(manifest["recordsFile"] == RECORDS_PATH.name, "manifest recordsFile drift")

    program_rows = manifest["programs"]
    require(isinstance(program_rows, list) and bool(program_rows), "manifest programs must be non-empty")
    programs: set[str] = set()
    for row in program_rows:
        require_keys(row, {"programId", "name", "countryOrScope", "officialUrl", "surveyDepth"}, "program")
        program_id = row["programId"]
        require(isinstance(program_id, str) and TOKEN_ID_RE.fullmatch(program_id), f"invalid programId: {program_id!r}")
        require(program_id not in programs, f"duplicate programId: {program_id}")
        require_https(row["officialUrl"], f"program {program_id}.officialUrl")
        require(row["surveyDepth"] in {"PROGRAM_INVENTORY", "METHOD_DEEP", "MAP_LEGEND_DEEP"}, f"{program_id}: invalid surveyDepth")
        programs.add(program_id)

    cohort_rows = manifest["cohorts"]
    require(isinstance(cohort_rows, list), "manifest cohorts must be array")
    cohorts: dict[str, dict[str, Any]] = {}
    for row in cohort_rows:
        require_keys(row, {"cohortId", "inclusionRuleVersion", "inclusionRule", "eligibleForPrevalence"}, "cohort")
        cohort_id = row["cohortId"]
        require(isinstance(cohort_id, str) and TOKEN_ID_RE.fullmatch(cohort_id), f"invalid cohortId: {cohort_id!r}")
        require(cohort_id not in cohorts, f"duplicate cohortId: {cohort_id}")
        cohorts[cohort_id] = row

    mechanism_rows = manifest["mechanisms"]
    require(isinstance(mechanism_rows, list) and bool(mechanism_rows), "manifest mechanisms must be non-empty")
    mechanisms: set[str] = set()
    for row in mechanism_rows:
        require_keys(
            row,
            {
                "mechanismId", "label", "status", "possibilityEvidenceIds", "counterexampleEvidenceIds",
                "prerequisiteClasses", "temporalOperation", "realizationStage", "geographicTemporalScope",
                "activationWeightSource",
            },
            "mechanism",
        )
        mechanism_id = row["mechanismId"]
        require(isinstance(mechanism_id, str) and MECHANISM_ID_RE.fullmatch(mechanism_id), f"invalid mechanismId: {mechanism_id!r}")
        require(mechanism_id not in mechanisms, f"duplicate mechanismId: {mechanism_id}")
        require(row["status"] == "RESEARCH_ONLY", f"{mechanism_id}: registry cannot promote runtime law")
        require(row["activationWeightSource"] is None, f"{mechanism_id}: no prevalence cohort has been ratified")
        mechanisms.add(mechanism_id)

    require_closed_keys(
        records_doc,
        {"registryVersion", "researchWaveId", "capturedAt", "records"},
        {"registryVersion", "researchWaveId", "capturedAt", "records"},
        "records document",
    )
    require(records_doc["registryVersion"] == 1, "records registryVersion must be 1")
    require(records_doc["researchWaveId"] == research_wave["waveId"], "records researchWaveId drift")
    require_iso_date(records_doc["capturedAt"], "records.capturedAt")
    records = records_doc["records"]
    require(isinstance(records, list) and bool(records), "historical evidence registry must contain records")
    seen: set[str] = set()
    for record in records:
        require(isinstance(record, dict), "record must be object")
        validate_record(record, programs=programs, mechanisms=mechanisms, cohorts=cohorts)
        record_id = record["recordId"]
        require(record_id not in seen, f"duplicate recordId: {record_id}")
        seen.add(record_id)

    for record in records:
        record_id = record["recordId"]
        corroborating = set(record.get("corroboratingRecordIds", []))
        require(record_id not in corroborating, f"{record_id}: record cannot corroborate itself")
        require(corroborating <= seen, f"{record_id}: corroborating evidence reference missing")

    for mechanism in mechanism_rows:
        refs = set(mechanism["possibilityEvidenceIds"]) | set(mechanism["counterexampleEvidenceIds"])
        require(bool(mechanism["possibilityEvidenceIds"]), f"{mechanism['mechanismId']}: no possibility evidence")
        require(refs <= seen, f"{mechanism['mechanismId']}: evidence reference missing")

    referenced_programs = {record["place"]["atlasProgramId"] for record in records}
    referenced_mechanisms = {mechanism for record in records for mechanism in record["claim"]["mechanismIds"]}
    require(referenced_mechanisms == mechanisms, "registered mechanism/record coverage differs")

    return {
        "status": "ok",
        "research_wave": {
            "wave_id": research_wave["waveId"],
            "status": research_wave["status"],
            "sampling_frame_registered": research_wave["samplingFrameId"] is not None,
            "holdout_registered": research_wave["holdoutRosterId"] is not None,
            "prevalence_eligible": research_wave["prevalenceEligible"],
        },
        "programs_registered": len(programs),
        "programs_with_claim_records": len(referenced_programs),
        "records": len(records),
        "places": len({record["place"]["name"] for record in records}),
        "mechanisms": len(mechanisms),
        "prevalence_cohorts": sum(bool(row["eligibleForPrevalence"]) for row in cohort_rows),
        "cohort_statistic_records": sum("COHORT_STATISTIC" in record["allowedUses"] for record in records),
        "rights_modes": {
            mode: sum(record["source"]["rights"]["mode"] == mode for record in records)
            for mode in sorted(RIGHTS_MODES)
        },
    }


def check() -> dict[str, Any]:
    schema = load_json(SCHEMA_PATH)
    require(schema.get("$schema") == "https://json-schema.org/draft/2020-12/schema", "schema draft drift")
    manifest = load_json(MANIFEST_PATH)
    records_doc = load_json(RECORDS_PATH)
    return validate_data(manifest, records_doc)


def self_test() -> dict[str, Any]:
    manifest = load_json(MANIFEST_PATH)
    records_doc = load_json(RECORDS_PATH)
    validate_data(manifest, records_doc)
    cases: list[tuple[str, Any]] = []

    duplicate = copy.deepcopy(records_doc)
    duplicate["records"].append(copy.deepcopy(duplicate["records"][0]))
    cases.append(("duplicate_record", duplicate))

    prevalence = copy.deepcopy(records_doc)
    prevalence["records"][0]["allowedUses"].append("COHORT_STATISTIC")
    cases.append(("unregistered_prevalence", prevalence))

    textual_absence = copy.deepcopy(records_doc)
    textual_absence["records"][0]["coverage"]["absenceIsEvidence"] = True
    cases.append(("textual_scope_absence", textual_absence))

    restricted_geometry = copy.deepcopy(records_doc)
    restricted_geometry["records"][0]["source"]["rights"]["geometryPayloadRef"] = {
        "artifactId": "forbidden-geometry", "contentHash": "0" * 64,
    }
    cases.append(("restricted_rights_geometry_payload", restricted_geometry))

    open_without_terms = copy.deepcopy(records_doc)
    open_without_terms["records"][0]["source"]["rights"] = {
        "mode": "OPEN_DERIVED_DATA",
        "licenseId": "example-open",
        "licenseUrl": "https://example.invalid/license",
        "allowedDerivativeScope": ["MEASURED_FACTS"],
        "verifiedAt": "2026-08-20",
    }
    cases.append(("open_rights_missing_terms", open_without_terms))

    spatial_absence = copy.deepcopy(records_doc)
    spatial_absence["records"][0]["source"]["scale"] = {"kind": "DECLARED", "denominator": 2500}
    spatial_absence["records"][0]["coverage"] = {
        "kind": "SPATIAL_MASK",
        "maskRef": {"artifactId": "coverage-mask", "contentHash": "1" * 64},
        "purpose": "PLAN_COVERAGE",
        "horizontalError": {"valueQ": 1, "unitId": "plan-quantum"},
        "omissions": [],
        "absenceIsEvidence": True,
    }
    cases.append(("spatial_absence_missing_proof", spatial_absence))

    spatial_without_scale = copy.deepcopy(records_doc)
    spatial_without_scale["records"][0]["source"]["scale"] = {
        "kind": "NOT_APPLICABLE", "reason": "text source",
    }
    spatial_without_scale["records"][0]["coverage"] = {
        "kind": "SPATIAL_MASK",
        "maskRef": {"artifactId": "coverage-mask", "contentHash": "2" * 64},
        "purpose": "PLAN_COVERAGE",
        "horizontalError": {"valueQ": 1, "unitId": "plan-quantum"},
        "omissions": [],
        "absenceIsEvidence": False,
    }
    cases.append(("spatial_mask_without_declared_scale", spatial_without_scale))

    copy_rights = copy.deepcopy(records_doc)
    copy_rights["records"][0]["prohibitedUses"].remove("DIRECT_GEOMETRY_COPY")
    cases.append(("copy_rights", copy_rights))

    unregistered = copy.deepcopy(records_doc)
    unregistered["records"][0]["claim"]["mechanismIds"] = ["fabric.unregistered"]
    cases.append(("unregistered_mechanism", unregistered))

    scale_without_reason = copy.deepcopy(records_doc)
    scale_without_reason["records"][0]["source"]["scale"] = {"kind": "NOT_APPLICABLE"}
    cases.append(("scale_without_na_reason", scale_without_reason))

    legend_without_reason = copy.deepcopy(records_doc)
    legend_without_reason["records"][0]["source"]["legend"] = {"kind": "NOT_APPLICABLE"}
    cases.append(("legend_without_na_reason", legend_without_reason))

    missing_corroboration = copy.deepcopy(records_doc)
    missing_corroboration["records"][0]["corroboratingRecordIds"] = ["HE-MISSING-RECORD"]
    cases.append(("missing_corroboration", missing_corroboration))

    undeclared_source_key = copy.deepcopy(records_doc)
    undeclared_source_key["records"][0]["source"]["untypedConfidence"] = 1
    cases.append(("undeclared_source_key", undeclared_source_key))

    invalid_source_role = copy.deepcopy(records_doc)
    invalid_source_role["records"][0]["source"]["role"] = "HISTORICAL_TRUTH"
    cases.append(("invalid_source_role", invalid_source_role))

    impossible_geometry = copy.deepcopy(records_doc)
    impossible_geometry["records"][0]["source"]["geometryLineage"] = "NO_GEOMETRY"
    impossible_geometry["records"][0]["claim"]["geometryStatus"] = "APPROXIMATE"
    cases.append(("no_geometry_with_geometric_claim", impossible_geometry))

    passed: list[str] = []
    for name, fixture in cases:
        try:
            validate_data(manifest, fixture)
        except IntegrityError:
            passed.append(name)
        else:
            raise IntegrityError(f"negative control did not fail: {name}")
    return {"status": "ok", "negative_controls": passed}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--compact", action="store_true", help="emit compact JSON")
    parser.add_argument("--self-test", action="store_true", help="prove invalid fixtures fail")
    args = parser.parse_args()
    try:
        result = self_test() if args.self_test else check()
    except IntegrityError as exc:
        print(json.dumps({"status": "error", "error": str(exc)}, indent=2), file=sys.stderr)
        return 1
    print(json.dumps(result, indent=None if args.compact else 2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
