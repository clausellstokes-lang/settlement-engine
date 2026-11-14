// threat-assessment block of a page: from 'Threat Assessment' to 'Disasters & Famine' or next blank-ish section
const {page}=require('./facts.js');
function block(town){const L=page(town).split('\n');const i=L.findIndex(l=>l==='Threat Assessment');if(i<0)return null;
 let j=i+1;while(j<L.length&&!/^(Disasters & Famine|Vulnerabilities|Standing forces|Supporting Capabilities|== )/.test(L[j]))j++;return L.slice(i,j).join('\n');}
function defenseTab(town){const L=page(town).split('\n');const i=L.findIndex(l=>l==='== Systems/Defense ==');if(i<0)return '';let j=i+1;while(j<L.length&&!/^== /.test(L[j]))j++;return L.slice(i,j).join('\n');}
module.exports={block,defenseTab};
