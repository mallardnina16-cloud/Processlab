// ══════════════════════════════════════════════════════════════════════════════
// db-rest.mjs — adaptateur { select, insert } pour l'API REST de Supabase
// (PostgREST), en `fetch` pur : aucune dépendance npm à installer.
//
//   const db = makeRestDb(SUPABASE_URL, SERVICE_ROLE_KEY);
//
// La clé service-role contourne les RLS. À n'utiliser QUE côté serveur / CLI.
// ══════════════════════════════════════════════════════════════════════════════

export function makeRestDb(url, key) {
  const base = url.replace(/\/$/, "") + "/rest/v1";
  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };

  return {
    async select(table, { columns = "*", filters = [] } = {}) {
      const p = new URLSearchParams();
      p.set("select", columns);
      for (const [col, op, val] of filters) p.append(col, `${op}.${val}`);
      const res = await fetch(`${base}/${table}?${p.toString()}`, { headers });
      if (!res.ok) throw new Error(`GET ${table} → ${res.status} ${await res.text()}`);
      return res.json();
    },

    async insert(table, rows, { returning = false } = {}) {
      const res = await fetch(`${base}/${table}`, {
        method: "POST",
        headers: { ...headers, Prefer: returning ? "return=representation" : "return=minimal" },
        body: JSON.stringify(rows),
      });
      if (!res.ok) throw new Error(`POST ${table} → ${res.status} ${await res.text()}`);
      return returning ? res.json() : null;
    },
  };
}
