// ══════════════════════════════════════════════════════════════════════════════
// db-supabase.mjs — adaptateur { select, insert } au-dessus d'un client
// @supabase/supabase-js déjà instancié (utilisé par api/import-program.js et
// potentiellement le dashboard coach).
// ══════════════════════════════════════════════════════════════════════════════

export function makeSupabaseDb(supabase) {
  return {
    async select(table, { columns = "*", filters = [] } = {}) {
      let q = supabase.from(table).select(columns);
      for (const [col, op, val] of filters) {
        if (op === "eq") q = q.eq(col, val);
        else if (op === "ilike") q = q.ilike(col, String(val).replace(/\*/g, "%"));
        else if (op === "in") q = q.in(col, val);
        else q = q.filter(col, op, val);
      }
      const { data, error } = await q;
      if (error) throw new Error(`select ${table} : ${error.message}`);
      return data || [];
    },

    async insert(table, rows, { returning = false } = {}) {
      let q = supabase.from(table).insert(rows);
      if (returning) q = q.select();
      const { data, error } = await q;
      if (error) throw new Error(`insert ${table} : ${error.message}`);
      return returning ? data || [] : null;
    },
  };
}
