/**
 * Bounded PostgREST collection reads for custom-content persistence.
 *
 * The project-wide row cap and proxy URL limits are independent constraints:
 * collection reads must page responses, while `in(...)` filters must also be
 * split into bounded request URLs. Query factories rebuild each builder so no
 * settled Supabase request is reused.
 */

const PAGE_SIZE = 500;
const FILTER_CHUNK_SIZE = 100;

/** @param {() => any} queryFactory */
export async function fetchAllSupabaseRows(queryFactory) {
  const rows = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const { data, error } = await queryFactory().range(
      offset,
      offset + PAGE_SIZE - 1,
    );
    if (error) throw error;
    const page = Array.isArray(data) ? data : [];
    rows.push(...page);
    if (page.length < PAGE_SIZE) return rows;
  }
}

/** @param {unknown[]} values */
function uniqueStrings(values) {
  return [...new Set(values.filter(Boolean).map(String))];
}

/**
 * @param {unknown[]} values
 * @param {(chunk:string[]) => () => any} queryFactoryForChunk
 */
export async function fetchSupabaseRowsByChunks(
  values,
  queryFactoryForChunk,
) {
  const ids = uniqueStrings(values);
  const pages = [];
  for (let index = 0; index < ids.length; index += FILTER_CHUNK_SIZE) {
    pages.push(fetchAllSupabaseRows(queryFactoryForChunk(
      ids.slice(index, index + FILTER_CHUNK_SIZE),
    )));
  }
  return (await Promise.all(pages)).flat();
}
