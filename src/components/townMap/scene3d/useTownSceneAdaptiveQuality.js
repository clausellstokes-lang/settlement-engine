import { useEffect, useRef, useState } from 'react';

const plansMatch = (a, b) => (
  a?.quality === b?.quality
  && a?.renderScale === b?.renderScale
  && a?.lodBias === b?.lodBias
  && a?.contactShadows === b?.contactShadows
  && a?.creaseInk === b?.creaseInk
  && a?.cullScale === b?.cullScale
  && a?.massingOnly === b?.massingOnly
  && a?.fallback === b?.fallback
);

function applyQualityMode(adaptiveQuality, state, mode) {
  const ceiling = adaptiveQuality.ceilingForMode?.(mode);
  return adaptiveQuality.setQualityCeiling?.(state, ceiling) || state;
}

/**
 * React adapter around the pure adaptive-quality governor.
 *
 * The governor state changes every frame because its EMA changes. React state
 * does not: this hook publishes only when an actuation rung changes, keeping
 * frame sensing out of the component render loop.
 *
 * @param {{
 *   createGovernorState:()=>any,
 *   observeFrame:(state:any,frameMs:number)=>any,
 *   actuationPlanFor:(state:any)=>any,
 *   ceilingForMode?:(mode:string)=>number,
 *   setQualityCeiling?:(state:any,ceiling:number)=>any,
 * }} adaptiveQuality
 * @param {{
 *   active?:boolean,
 *   onFallback?:(reason:string)=>void,
 *   qualityMode?:'auto'|'high'|'medium'|'low',
 *   resetKey?:string|null,
 * }} [options]
 */
export function useTownSceneAdaptiveQuality(adaptiveQuality, options = {}) {
  const [initial] = useState(() => {
    const state = applyQualityMode(
      adaptiveQuality,
      adaptiveQuality.createGovernorState(),
      options.qualityMode,
    );
    return { state, plan: adaptiveQuality.actuationPlanFor(state) };
  });
  const governor = useRef(initial.state);
  const [plan, setPlan] = useState(initial.plan);
  const lastPlan = useRef(initial.plan);
  const fallbackSent = useRef(false);
  const onFallback = useRef(options.onFallback);
  const qualityMode = useRef(options.qualityMode);

  useEffect(() => {
    onFallback.current = options.onFallback;
  }, [options.onFallback]);

  useEffect(() => {
    qualityMode.current = options.qualityMode;
  }, [options.qualityMode]);

  useEffect(() => {
    let cancelled = false;
    const nextState = applyQualityMode(
      adaptiveQuality,
      adaptiveQuality.createGovernorState(),
      qualityMode.current,
    );
    const nextPlan = adaptiveQuality.actuationPlanFor(nextState);
    governor.current = nextState;
    lastPlan.current = nextPlan;
    fallbackSent.current = false;
    queueMicrotask(() => {
      if (!cancelled) setPlan(nextPlan);
    });
    return () => { cancelled = true; };
  }, [adaptiveQuality, options.resetKey]);

  useEffect(() => {
    let cancelled = false;
    const nextState = applyQualityMode(
      adaptiveQuality,
      governor.current,
      options.qualityMode,
    );
    const nextPlan = adaptiveQuality.actuationPlanFor(nextState);
    governor.current = nextState;
    lastPlan.current = nextPlan;
    queueMicrotask(() => {
      if (!cancelled) setPlan(nextPlan);
    });
    return () => { cancelled = true; };
  }, [adaptiveQuality, options.qualityMode]);

  useEffect(() => {
    if (options.active === false || typeof requestAnimationFrame !== 'function') return undefined;
    let frame = 0;
    let previous = 0;
    let stopped = false;
    let visible = typeof document === 'undefined' || document.visibilityState !== 'hidden';

    const onVisibility = () => {
      visible = document.visibilityState !== 'hidden';
      previous = 0;
    };
    document?.addEventListener?.('visibilitychange', onVisibility);

    const tick = (now) => {
      if (stopped) return;
      if (visible && previous > 0) {
        const elapsed = Math.min(250, Math.max(1, now - previous));
        governor.current = adaptiveQuality.observeFrame(governor.current, elapsed);
        const nextPlan = adaptiveQuality.actuationPlanFor(governor.current);
        if (!plansMatch(lastPlan.current, nextPlan)) {
          lastPlan.current = nextPlan;
          setPlan(nextPlan);
        }
        if (nextPlan.fallback === 'plan2d' && !fallbackSent.current) {
          fallbackSent.current = true;
          onFallback.current?.('adaptive-quality-floor');
        } else if (nextPlan.fallback !== 'plan2d') {
          fallbackSent.current = false;
        }
      }
      previous = visible ? now : 0;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      stopped = true;
      if (frame) cancelAnimationFrame(frame);
      document?.removeEventListener?.('visibilitychange', onVisibility);
    };
  }, [adaptiveQuality, options.active]);

  return plan;
}
