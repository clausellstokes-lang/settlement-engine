/**
 * TreeSymbols — SVG <symbol> defs for the forest brush tree styles.
 * Referenced by ForestsLayer via <use href="#sf-tree-pine"/> etc.
 *
 * Each symbol is authored in a 0-20 x 0-30 viewbox where the base (tree trunk)
 * sits at y=30. The forest layer places each tree via <use x={x} y={y}> and
 * the symbol anchors correctly.
 */

import React from 'react';

export default function TreeSymbols() {
  return (
    <>
      {/* Pine — dark green triangle stack */}
      <symbol id="sf-tree-pine" viewBox="0 0 20 30" overflow="visible">
        <rect x="9" y="22" width="2" height="8" fill="#5c3a1a" />
        <polygon points="10,2 17,12 12,12 18,20 12,20 16,28 4,28 8,20 2,20 8,12 3,12" fill="#2f4a2f" stroke="#1a2d1a" strokeWidth="0.4" />
      </symbol>

      {/* Oak — broad round crown */}
      <symbol id="sf-tree-oak" viewBox="0 0 20 30" overflow="visible">
        <rect x="9" y="18" width="2" height="12" fill="#5c3a1a" />
        <circle cx="10" cy="12" r="8" fill="#4a6a3a" stroke="#1a2d1a" strokeWidth="0.5" />
        <circle cx="6"  cy="14" r="4" fill="#5c7d46" opacity="0.6" />
        <circle cx="14" cy="10" r="3" fill="#5c7d46" opacity="0.6" />
      </symbol>

      {/* Palm — tall thin trunk, frond cluster */}
      <symbol id="sf-tree-palm" viewBox="0 0 20 30" overflow="visible">
        <path d="M 9 30 Q 10 20 10 8" stroke="#5c3a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M 10 8 Q 2 4 1 10"  stroke="#3d5a3d" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <path d="M 10 8 Q 18 4 19 10" stroke="#3d5a3d" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <path d="M 10 8 Q 4 2 2 6"   stroke="#4e7049" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <path d="M 10 8 Q 16 2 18 6" stroke="#4e7049" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <circle cx="10" cy="8" r="1.3" fill="#4e7049" />
      </symbol>

      {/* Birch — light, vertical, silver trunk */}
      <symbol id="sf-tree-birch" viewBox="0 0 20 30" overflow="visible">
        <rect x="9" y="20" width="2" height="10" fill="#e8e6dc" stroke="#3a3a2a" strokeWidth="0.3" />
        <line x1="9" y1="22" x2="11" y2="22" stroke="#3a3a2a" strokeWidth="0.4" />
        <line x1="9" y1="25" x2="11" y2="25" stroke="#3a3a2a" strokeWidth="0.4" />
        <line x1="9" y1="28" x2="11" y2="28" stroke="#3a3a2a" strokeWidth="0.4" />
        <ellipse cx="10" cy="12" rx="5" ry="9" fill="#8fa858" stroke="#4a5a25" strokeWidth="0.5" />
      </symbol>
    </>
  );
}
