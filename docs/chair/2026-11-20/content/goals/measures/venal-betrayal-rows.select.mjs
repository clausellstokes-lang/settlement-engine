import { readFileSync, writeFileSync } from 'node:fs';
const S = process.argv[2];
const EXCLUDE = new Set([
  'criminal.any.criminal[1]', 'criminal.any.criminal[4]', 'criminal.any.criminal[7]', 'criminal.any.political[5]', 'criminal.clergy.religious[2]',
  'title:the apothecary[0]', 'title:the apothecary[2]', 'title:the bowyer[0]', 'title:the cobbler[2]', 'title:the sawyer[2]', 'title:the dyer[2]', 'title:the chandler[1]',
  'title:the house boss[0]', 'title:the house boss[2]', 'title:the front man[1]', 'title:the theatre manager[0]', 'title:the beast master[0]', 'title:the beast master[2]',
  'title:the collier[0]', 'title:the master furrier[2]', 'title:the tanner[1]', 'title:the gang boss[0]', 'title:the black marketeer[0]', 'title:the black marketeer[1]',
  'title:the black marketeer[2]', 'title:the whisper broker[0]', 'title:the salt master[1]', 'title:the network\'s spider[0]', 'title:the network\'s spider[2]',
  'title:the guildmaster of thieves[0]', 'title:the guildmaster of thieves[1]', 'title:the printer[0]', 'title:the slave-market master[0]', 'title:the slave-market master[1]',
  'title:the slave-market master[2]', 'title:the head shepherd[2]', 'title:the master of the hunt[0]', 'title:the master of the hunt[2]', 'title:the camp foreman[0]',
  'title:the fence[0]', 'title:the fence[1]', 'title:the smuggler[2]', 'title:the horse-coper[1]', 'title:the slaver[0]', 'title:the slaver[1]', 'title:the slaver[2]',
  'title:the trafficker[1]', 'title:the bandit contact[0]', 'title:the bandit contact[1]', 'title:the outlaw host[0]', 'title:the outlaw host[2]', 'title:the ringleader[1]',
  'stress:famine[6]', 'stress:famine[7]', 'stress:occupied[5]', 'stress:politically_fractured[1]', 'stress:politically_fractured[2]', 'stress:indebted[1]',
  'stress:plague_onset[4]', 'stress:succession_void[3]', 'stress:monster_pressure[3]', 'stress:insurgency[3]', 'stress:insurgency[4]', 'stress:wartime[1]', 'stress:slave_revolt[6]',
]);
const rows = readFileSync(`${S}/secretRows.txt`, 'utf8').trim().split('\n').map((l) => l.split('\t'));
const keep = rows.filter(([k]) => !EXCLUDE.has(k)); const out = rows.filter(([k]) => EXCLUDE.has(k));
const missing = [...EXCLUDE].filter((k) => !rows.some(([r]) => r === k));
writeFileSync(`${S}/closedList.txt`, keep.map(([k, t]) => `${k}\t${t}`).join('\n') + '\n');
console.log(`candidates ${rows.length} · kept ${keep.length} · left out ${out.length} · exclusion keys not found ${missing.length} ${missing.join(' ')}`);
