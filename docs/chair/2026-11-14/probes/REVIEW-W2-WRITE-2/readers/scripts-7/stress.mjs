export const stresses=t=>{const s=t.stress;const a=Array.isArray(s)?s:(s?[s]:[]);return [...a,...(Array.isArray(t.stresses)?t.stresses:[])].map(x=>x?.type||x).filter(Boolean);};
