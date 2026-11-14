export const mag=(t,page)=>{const g=(re)=>{const m=page.match(re);return m?m[1]:null;};
return {acc:g(/Religious acceptance([a-z]+)/),leg:g(/Legality([a-z]+)/),avail:g(/Availability([a-z]+)/),rel:g(/Reliance on magic: ([A-Za-z ]+?)(?: ·|\n)/),econ:g(/Economic role: ([a-z]+)/),
arc:t.institutions.filter(i=>/wizard|mages'|academy of magic|mages' district|arcane|sorcer|enchant/i.test(i.name)).map(i=>i.name),
f:t.economicState.safetyProfile.flags};};
