const T = process.env.BIRTHS_TREE;
export async function measure(town) {
  const base = await (await import(`${process.env.RL_DIR}/measure-slots.mjs`)).measure(town);
  const insts = (Array.isArray(town.institutions) ? town.institutions : []).map((i) => ({ name: i.name, category: i.category, desc: i.desc, catalogId: i.catalogId ?? null }));
  return { ...base, seedKey: town._seed ?? null, id: town.id ?? null, insts, json: JSON.stringify(town).length };
}
