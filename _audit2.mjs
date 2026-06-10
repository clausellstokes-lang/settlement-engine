import { INSTITUTION_SERVICES } from './src/data/institutionServices.js';
const show = ['Planar traders','International trade center','Caravan masters\' exchange','Caravanserai','Fish market','Fishing community','Ale house','Alehouse'];
for (const k of show){
  console.log('### '+k+' :', INSTITUTION_SERVICES[k] ? Object.keys(INSTITUTION_SERVICES[k]) : '(no INSTITUTION_SERVICES entry)');
}
