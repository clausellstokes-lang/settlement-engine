/**
 * eslint-plugin-analytics.js — Local ESLint rule for the analytics event contract.
 *
 * funnel-event-contract — event names passed to the analytics `track()`
 *   and `Funnel.track()` must be EVENTS.* constants from
 *   src/lib/analytics.js, never raw string literals or dynamically-built
 *   template strings.
 *
 *   Why a lint rule: track() already whitelists event names at RUNTIME
 *   (Object.values(EVENTS).includes(event)) — but an unknown name only
 *   produces a DEV console.warn and is then silently dropped in
 *   production. A misspelled event ('hompage_view') therefore costs a
 *   silent dashboard hole that nobody notices until the funnel looks
 *   wrong. This moves the check to BUILD/CI time and makes the enum the
 *   single source of truth: rename a key in EVENTS and every call site
 *   follows; typo a string and lint fails before merge.
 *
 *   Allowed:
 *     track(EVENTS.HOMEPAGE_VIEW)            — the canonical form
 *     Funnel.track(EVENTS.X, { ... })
 *     Funnel.track(eventName, payload)       — generic passthrough
 *       wrappers (useFunnelEvent, EditableInline, LockedDestination)
 *       receive the EVENTS.* constant from THEIR callers, so a variable
 *       first argument is fine.
 *   Flagged:
 *     track('homepage_view')                 — raw string (typo vector)
 *     Funnel.track(`evt_${id}`)              — dynamically-built name
 *
 *   Precision: the rule only fires on the `track` / `Funnel` bindings
 *   actually imported from the analytics module — it records their local
 *   names from the ImportDeclaration first. An unrelated `track()` or a
 *   different `Funnel` object elsewhere is never touched. Membership of
 *   EVENTS.* members is intentionally NOT validated here: that would
 *   couple the rule to the enum's keys (drift), and a typo'd EVENTS.FOO
 *   is `undefined` → the runtime guard drops it anyway.
 *
 * Used by eslint.config.js as a local plugin. Dependency-free.
 */

// Matches the analytics module specifier in an import: '../lib/analytics',
// '../../lib/analytics.js', etc. Anchored so 'myanalytics' won't match.
const ANALYTICS_SOURCE = /(^|[./])analytics(\.js)?$/;

export default {
  rules: {
    'funnel-event-contract': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Require analytics track()/Funnel.track() event names to be EVENTS.* constants, not raw strings or template literals.',
        },
        schema: [],
        messages: {
          rawString:
            '{{callee}} event name is a raw string "{{value}}" — pass an EVENTS.* constant from analytics.js so the name is typo-proof and stays in the dashboard schema.',
          dynamic:
            '{{callee}} event name is a {{kind}} — event names must be EVENTS.* constants, not dynamically-built strings.',
        },
      },
      create(context) {
        let trackLocal = null;   // local name bound to the imported `track`
        let funnelLocal = null;  // local name bound to the imported `Funnel`

        function checkEventArg(callNode, calleeLabel) {
          const arg = callNode.arguments[0];
          if (!arg) return; // arity is not this rule's concern
          if (arg.type === 'Literal' && typeof arg.value === 'string') {
            context.report({
              node: arg,
              messageId: 'rawString',
              data: { callee: calleeLabel, value: arg.value },
            });
          } else if (arg.type === 'TemplateLiteral') {
            context.report({
              node: arg,
              messageId: 'dynamic',
              data: { callee: calleeLabel, kind: 'template literal' },
            });
          }
        }

        return {
          ImportDeclaration(node) {
            if (typeof node.source.value !== 'string') return;
            if (!ANALYTICS_SOURCE.test(node.source.value)) return;
            for (const spec of node.specifiers) {
              if (spec.type !== 'ImportSpecifier') continue;
              if (spec.imported?.name === 'track') trackLocal = spec.local.name;
              if (spec.imported?.name === 'Funnel') funnelLocal = spec.local.name;
            }
          },
          CallExpression(node) {
            const callee = node.callee;
            // <Funnel>.track(...)
            if (
              funnelLocal &&
              callee.type === 'MemberExpression' &&
              !callee.computed &&
              callee.object.type === 'Identifier' &&
              callee.object.name === funnelLocal &&
              callee.property.type === 'Identifier' &&
              callee.property.name === 'track'
            ) {
              checkEventArg(node, `${funnelLocal}.track()`);
              return;
            }
            // bare track(...)
            if (
              trackLocal &&
              callee.type === 'Identifier' &&
              callee.name === trackLocal
            ) {
              checkEventArg(node, `${trackLocal}()`);
            }
          },
        };
      },
    },

    'analytics-props-hygiene': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Analytics props must be coarse (enums/bands/counts/booleans/hashes) — never names, prose, secrets, or whole domain objects.',
        },
        schema: [],
        messages: {
          bannedKey:
            'Analytics prop "{{key}}" is forbidden — it carries free text/PII. Props must be coarse (enums, bands, counts, booleans, hashes), never names or prose.',
          bannedSpread:
            'Spreading "{{name}}" into analytics props can leak names/prose/secrets — pick explicit coarse fields instead.',
        },
      },
      create(context) {
        const BANNED_KEYS = new Set(['name', 'newName', 'text', 'prose', 'secret', 'description', 'notes', 'email', 'body', 'label']);
        const BANNED_SPREADS = new Set(['settlement', 'npc', 'save', 'faction', 'institution', 'aiData', 'aiSettlement']);
        let trackLocal = null;
        let funnelLocal = null;

        function checkPropsArg(node) {
          const arg = node.arguments[1];
          if (!arg || arg.type !== 'ObjectExpression') return;
          for (const prop of arg.properties) {
            if (prop.type === 'SpreadElement') {
              const arg = prop.argument;
              // Bare identifier: `{ ...settlement }`. Member expression:
              // `{ ...state.settlement }` / `{ ...props.npc }` — resolve the
              // TERMINAL property name so a wrapped domain object can't slip
              // its names/prose/secrets past the bare-identifier check.
              let spreadName = null;
              if (arg?.type === 'Identifier') {
                spreadName = arg.name;
              } else if (
                arg?.type === 'MemberExpression' && !arg.computed
                && arg.property.type === 'Identifier'
              ) {
                spreadName = arg.property.name;
              }
              if (spreadName && BANNED_SPREADS.has(spreadName)) {
                context.report({ node: prop, messageId: 'bannedSpread', data: { name: spreadName } });
              }
              continue;
            }
            if (prop.type !== 'Property' || prop.computed) continue;
            const key = prop.key.type === 'Identifier' ? prop.key.name
              : (prop.key.type === 'Literal' ? String(prop.key.value) : null);
            if (key && BANNED_KEYS.has(key)) {
              context.report({ node: prop.key, messageId: 'bannedKey', data: { key } });
            }
          }
        }

        return {
          ImportDeclaration(node) {
            if (typeof node.source.value !== 'string') return;
            if (!ANALYTICS_SOURCE.test(node.source.value)) return;
            for (const spec of node.specifiers) {
              if (spec.type !== 'ImportSpecifier') continue;
              if (spec.imported?.name === 'track') trackLocal = spec.local.name;
              if (spec.imported?.name === 'Funnel') funnelLocal = spec.local.name;
            }
          },
          CallExpression(node) {
            const callee = node.callee;
            if (
              funnelLocal && callee.type === 'MemberExpression' && !callee.computed
              && callee.object.type === 'Identifier' && callee.object.name === funnelLocal
              && callee.property.type === 'Identifier' && callee.property.name === 'track'
            ) { checkPropsArg(node); return; }
            if (trackLocal && callee.type === 'Identifier' && callee.name === trackLocal) {
              checkPropsArg(node);
            }
          },
        };
      },
    },
  },
};
