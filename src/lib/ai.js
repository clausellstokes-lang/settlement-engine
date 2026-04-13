/**
 * ai.js — AI narrative generation service.
 *
 * Calls the generate-narrative edge function when Supabase is configured.
 * Falls back to a mock that returns placeholder text for local dev.
 */

import { supabase, isConfigured } from './supabase.js';

/**
 * Generate an AI narrative synthesis for a settlement.
 * @param {'narrative' | 'dailyLife'} type
 * @param {object} settlement — settlement data object
 * @param {string} [settlementId] — optional DB id for credit tracking
 * @returns {{ result: object, creditsRemaining: number, type: string }}
 */
export async function generateNarrative(type, settlement, settlementId) {
  if (!isConfigured) {
    return mockGenerate(type, settlement);
  }

  const { data, error } = await supabase.functions.invoke('generate-narrative', {
    body: { type, settlement, settlementId },
  });

  if (error) throw new Error(error.message || 'Narrative generation failed');
  if (data?.error) throw new Error(data.error);
  return data;
}

// ── Mock for local dev ──────────────────────────────────────────────────────

function mockGenerate(type, settlement) {
  const name = settlement?.name || 'this settlement';

  if (type === 'narrative') {
    return {
      result: {
        overview: `${name} rises from the landscape like a testament to the resilience of its people. The settlement bears the marks of its history in every weathered stone and creaking timber. Travelers approaching from the main road are greeted first by the smell of woodsmoke and the distant clang of a smithy.\n\nThe heart of ${name} pulses with a quiet industriousness. Its people are neither wealthy nor destitute, but carry themselves with the particular dignity of folk who have weathered hard seasons and emerged intact.`,
        districts: [
          'The market square, where merchants hawk their wares beneath faded canvas awnings.',
          'The craftsmen\'s quarter, alive with the sounds of hammer and saw.',
        ],
        atmosphere: `The air here carries the mingled scents of baking bread, animal dung, and the faint sweetness of nearby wildflowers. Conversations happen in low murmurs punctuated by occasional laughter.`,
        hooks: [
          'A merchant has been found dead in the market square, his coin purse untouched but his ledger missing.',
          'Strange lights have been seen in the old quarry at night, and livestock near the site have been found drained of blood.',
          'The local healer claims she has been having prophetic dreams about a great calamity.',
        ],
        secrets: [
          'The settlement\'s founding charter, locked in the elder\'s strongbox, contains a clause that would shock the populace if revealed.',
          'An underground network of smugglers operates beneath the merchants\' guild.',
        ],
      },
      creditsRemaining: 0,
      type: 'narrative',
    };
  }

  return {
    result: {
      dawn: `As the first grey light seeps over the horizon, ${name} stirs to life. A rooster crows from behind the smithy, and the night watch shuffles toward the tavern for a warm meal before sleep.`,
      morning: `The market opens with the clatter of stall frames being assembled. A queue forms at the baker's door. Children chase each other through the lanes while their parents begin the day's labors.`,
      midday: `The sun reaches its zenith and work pauses. Folk gather in the shade of the old oak in the square, sharing bread and gossip. A traveling merchant arrives with news from distant lands.`,
      evening: `As shadows lengthen, the tavern fills with the day's stories. A bard tunes their lute in the corner. The smell of stew drifts from open windows, and lanterns are lit along the main road.`,
      night: `${name} settles into a watchful quiet. The night patrol makes their rounds, boots crunching on gravel. Behind closed doors, families share evening prayers or whispered schemes.`,
    },
    creditsRemaining: 0,
    type: 'dailyLife',
  };
}
