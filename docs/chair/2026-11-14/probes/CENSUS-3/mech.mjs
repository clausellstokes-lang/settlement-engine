// CENSUS-2: the readers' `mechanism` field mapped to this census's kinds (a guide, not a key).
export const MECH = {
  a: (x) => /lacks/i.test(x.mechanism),
  b: (x) => /normal times/i.test(x.mechanism),
  c: (x) => /^a size$/i.test(x.mechanism.trim()),
  d: (x) => /broken text/i.test(x.mechanism),
  e: (x) => /^denies/i.test(x.mechanism),
  f: (x) => /count range|with a gate/i.test(x.mechanism),
  g: (x) => /machinery|slider name/i.test(x.mechanism),
  h: (x) => /acting|vacant|empty seat/i.test(`${x.mechanism} ${x.fact}`) && /ruler|holder|seat|role|power/i.test(x.mechanism),
};
