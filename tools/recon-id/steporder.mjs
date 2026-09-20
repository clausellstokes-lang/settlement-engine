import { getStepOrder } from './instrument.mjs';
const o = getStepOrder();
o.forEach((n,i)=>console.log(String(i+1).padStart(3), n));
