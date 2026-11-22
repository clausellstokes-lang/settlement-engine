/**
 * lib/downloadBlob.js — THE ONE browser blob-download primitive (the anchor-click idiom).
 *
 * A 13-line, surface-agnostic transport: given a Blob and a filename, hand the file to
 * the browser's download machinery and revoke the object URL on the next tick (so the
 * click's navigation has taken it). Nothing here knows what the bytes are.
 *
 * WHY IT LIVES ALONE (§725/§748): it used to sit inside src/lib/townMapExport.js, whose
 * town-map surface is being stripped — so three surfaces that have nothing to do with the
 * settlement map (the REALM map PNG export, the 3D town-scene artifact export, and the
 * WORLD-map timelapse clip) each imported a doomed town-map module for a primitive that
 * is not a town-map concern. It is the ONE idiom (code-quality-5: never inline it), so it
 * gets the ONE home, and the export lane's deletion cannot break the surfaces that stay.
 *
 * BROWSER-ONLY: needs `URL.createObjectURL` + `document`. Callers are already lazy,
 * browser-bound export surfaces; nothing eager imports this.
 */

/** Trigger a browser download of a Blob under a filename (the shareImage idiom).
 * @param {Blob} blob @param {string} filename */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  try {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } finally {
    // Revoke on the next tick so the click's navigation has taken the URL.
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}
