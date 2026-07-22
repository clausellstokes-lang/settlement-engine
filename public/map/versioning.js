"use strict";
/**
 * Version Control Guidelines
 * --------------------------
 * We use Semantic Versioning: major.minor.patch. Refer to https://semver.org
 * Our .map file format is considered the public API.
 *
 * Update the version on each merge to master:
 * 1. MAJOR version: Incompatible changes that break existing maps
 * 2. MINOR version: Additions or changes that are backward-compatible but may require old .map files to be updated
 * 3. PATCH version: Backward-compatible bug fixes and small features that don't affect the .map file format
 *
 * Example: 1.102.2 -> Major version 1, Minor version 102, Patch version 2
 * Version bumping is automated via GitHub Actions on PR merge.
 *
 * For the changes that may be interesting to end users, update the `latestPublicChanges` array below (new changes on top).
 */

const VERSION = "1.114.2";
if (parseMapVersion(VERSION) !== VERSION) alert("versioning.js: Invalid format or parsing function");

{
  document.title += " v" + VERSION;
  const loadingScreenVersion = document.getElementById("versionText");
  if (loadingScreenVersion) loadingScreenVersion.innerText = `v${VERSION}`;

  const storedVersion = localStorage.getItem("version");
  if (compareVersions(storedVersion, VERSION, {major: true, minor: true, patch: false}).isOlder) {
    setTimeout(showUpdateWindow, 6000);
  }

  const latestPublicChanges = [
    "Search input in Overview dialogs",
    "Custom settlement grouping and icon selection",
    "Ability to set custom image as Marker or Regiment icon",
    "Submap and Transform tools rework",
    "Azgaar Bot to answer questions and provide help",
    "Labels: ability to set letter spacing",
    "Zones performance improvement",
    "Notes Editor: on-demand AI text generation",
    "New style preset: Dark Seas",
    "New routes generation algorithm",
    "Routes overview tool",
    "Configurable longitude",
    "Export zones to GeoJSON"
  ];

  function showUpdateWindow() {
    const changelog = "https://github.com/Azgaar/Fantasy-Map-Generator/wiki/Changelog";
    const reddit = "https://www.reddit.com/r/FantasyMapGenerator";
    const discord = "https://discordapp.com/invite/X7E84HU";
    const patreon = "https://www.patreon.com/azgaar";

    alertMessage.innerHTML = /* html */ `SettlementForge Map has been updated to version <strong>${VERSION}</strong>. Loaded save files will be auto-updated.
      ${storedVersion ? "<span>In case of errors reload the page to update the code.</span>" : ""}

      <ul>
        <strong>Latest changes:</strong>
        ${latestPublicChanges.map(change => `<li>${change}</li>`).join("")}
      </ul>

      <p>Map engine based on <a href="https://github.com/Azgaar/Fantasy-Map-Generator" target="_blank">Azgaar's Fantasy Map Generator</a> (MIT License).</p>`;

    $("#alert").dialog({
      resizable: false,
      title: "SettlementForge Map update",
      width: "28em",
      position: {my: "center center-4em", at: "center", of: "svg"},
      buttons: {
        "Clear cache": () => cleanupData(),
        "Don't show again": function () {
          $(this).dialog("close");
          localStorage.setItem("version", VERSION);
        }
      }
    });
  }
}

// SECURITY (SettlementForge fork patch, H11): the /map/ frame shares its ORIGIN
// with the host SettlementForge app (same host, different path), so localStorage
// and Cache Storage are SHARED. Stock cleanupData() called localStorage.clear()
// and deleted EVERY Cache Storage entry — destroying the host's Supabase auth
// token (sb-<ref>-auth-token) and all host app state on a "Clear cache" click.
// Scope every clear to what the MAP FORK owns; leave everything else intact.
// Delete-only-fork-keys is the safe direction: an unrecognized key survives, so a
// host key (which never matches a fork name or prefix) can never be destroyed.

// Exact localStorage keys the fork writes (options, presets, flags, AI config).
const FORK_LS_KEYS = new Set([
  "version", "preset", "presetStyle", "presets", "mapWidth", "mapHeight",
  "military", "winds", "burg-groups", "disable_click_arrow_tooltip",
  "installationDontAsk", "noReminder", "debug",
  "fmg-ai-model", "fmg-ai-temperature",
  "areaUnit", "distanceUnit", "heightUnit", "heightExponent",
  "populationRate", "urbanization", "urbanDensity",
  "temperatureScale", "temperatureEquator", "temperatureNorthPole", "temperatureSouthPole",
  "themeColor", "transparency", "uiSize", "tooltipSize",
  "era", "year", "regions", "template", "speakerVoice",
  "styleAncient", "styleClean", "styleGloom", "styleMonochrome"
]);
// Prefix families the fork writes with dynamic suffixes:
//   fmg-ai-*   → AI config + per-provider keys (fmg-ai-kl-<provider>, ai-generator.js)
//   fmgStyle_* → user-saved custom style presets (customPresetPrefix, style-presets.js)
const FORK_LS_PREFIXES = ["fmg-ai-", "fmgStyle_"];

function isForkLsKey(key) {
  if (typeof key !== "string") return false;
  if (FORK_LS_KEYS.has(key)) return true;
  return FORK_LS_PREFIXES.some(prefix => key.startsWith(prefix));
}

// Remove only the fork's own localStorage keys; preserve host keys (auth session,
// app state). Snapshot the keys first — mutating localStorage while indexing it
// by position skips entries.
function clearMapLocalStorage() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k != null) keys.push(k);
  }
  for (const k of keys) if (isForkLsKey(k)) localStorage.removeItem(k);
}

// Fork-owned Cache Storage names. The fork removed its service worker (sw.js), so
// it currently registers NO caches; this predicate scopes any future fork cache
// AND stops cleanupData from deleting a HOST cache (e.g. a host PWA/workbox cache)
// on the shared origin. Deliberately narrow to the "fmg" marker — a host cache
// name never matches.
function isForkCacheName(name) {
  return /fmg/i.test(String(name || ""));
}

async function cleanupData() {
  await clearCache();
  clearMapLocalStorage();
  localStorage.setItem("version", VERSION);
  localStorage.setItem("disable_click_arrow_tooltip", "true");
  location.reload();
}

async function clearCache() {
  if (typeof caches === "undefined" || !caches || typeof caches.keys !== "function") return;
  const cacheNames = await caches.keys();
  return Promise.all(cacheNames.filter(isForkCacheName).map(cacheName => caches.delete(cacheName)));
}

function parseMapVersion(version) {
  let [major, minor, patch] = version.split(".");

  if (patch === undefined) {
    // SettlementForge fork patch: legacy 2-part format, e.g. "1.732" → major 1, minor 73, patch 2.
    // The original truncated minor to 2 chars FIRST and then sliced(2) that same 2-char string, always
    // yielding "" (patch silently 0). Derive patch from the full minor before truncating it.
    patch = minor.slice(2);
    minor = minor.slice(0, 2);
  }

  // e.g. 0.7b
  major = parseInt(major) || 0;
  minor = parseInt(minor) || 0;
  patch = parseInt(patch) || 0;

  return `${major}.${minor}.${patch}`;
}

function isValidVersion(versionString) {
  if (!versionString) return false;
  const [major, minor, patch] = versionString.split(".");
  return !isNaN(major) && !isNaN(minor) && !isNaN(patch);
}

function compareVersions(version1, version2, options = {major: true, minor: true, patch: true}) {
  if (!isValidVersion(version1) || !isValidVersion(version2)) return {isEqual: false, isNewer: false, isOlder: false};

  let [major1, minor1, patch1] = version1.split(".").map(Number);
  let [major2, minor2, patch2] = version2.split(".").map(Number);

  if (!options.major) major1 = major2 = 0;
  if (!options.minor) minor1 = minor2 = 0;
  if (!options.patch) patch1 = patch2 = 0;

  const isEqual = major1 === major2 && minor1 === minor2 && patch1 === patch2;
  const isNewer = major1 > major2 || (major1 === major2 && (minor1 > minor2 || (minor1 === minor2 && patch1 > patch2)));
  const isOlder = major1 < major2 || (major1 === major2 && (minor1 < minor2 || (minor1 === minor2 && patch1 < patch2)));

  return {isEqual, isNewer, isOlder};
}
