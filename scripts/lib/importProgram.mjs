// ══════════════════════════════════════════════════════════════════════════════
// importProgram.mjs — applique un "JSON de programme" à la base Processlab.
//
// Indépendant du transport : reçoit un adaptateur `db` minimal (voir db-rest.mjs
// pour PostgREST/fetch, db-supabase.mjs pour @supabase/supabase-js).
//   db.select(table, { columns, filters })  -> rows[]
//   db.insert(table, rows, { returning })   -> rows[] | null
// `filters` = liste de [colonne, opérateur PostgREST, valeur] ex. ["name","ilike","%Lidia%"].
//
// Un programme :
//   {
//     program_name, client, assign,
//     catalogue_category_default,
//     catalogue: [{ nom, categorie?, positionnement, execution, respiration, vigilance }],
//     workouts: [{ name, description, blocks, exercises? }]
//   }
//
// Règles convenues avec la coach :
//   - fiches médiathèque manquantes → créées (comparaison sur `nom`, casse ignorée)
//   - séances → TOUJOURS créées à neuf (collisions de nom seulement signalées)
//   - assignation → client_workouts non datée (scheduled_date: null)
// ══════════════════════════════════════════════════════════════════════════════

const norm = (s) => (s || "").trim().toLowerCase();
const isUuid = (s) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s || "");

export function validateProgram(program) {
  const errors = [];
  if (!program || typeof program !== "object") return ["JSON invalide : objet attendu."];
  if (!Array.isArray(program.workouts) || program.workouts.length === 0)
    errors.push("`workouts` manquant ou vide.");
  (program.workouts || []).forEach((w, i) => {
    if (!w.name) errors.push(`workouts[${i}] : nom manquant.`);
    if (!Array.isArray(w.blocks)) errors.push(`workouts[${i}] (${w.name || "?"}) : blocks manquant.`);
  });
  if (program.catalogue && !Array.isArray(program.catalogue))
    errors.push("`catalogue` doit être un tableau.");
  return errors;
}

// Réplique de handleSave() dans src/App.jsx : dénormalise les blocks en lignes
// pour la table `exercises` (compteurs + vue planning).
export function denormFromBlocks(blocks) {
  const flat = (blocks || []).flatMap((b) =>
    b.type === "circuit"
      ? (b.exercises || []).map((e) => ({ ...e, type: "exercise", sets: b.rounds, rest: b.rest_between_rounds }))
      : [b]
  );
  return flat.map((e, i) => ({
    name: e.name ?? "",
    sets: e.sets ?? null,
    reps: e.reps ?? "",
    rest: e.rest ?? null,
    note: e.note ?? "",
    position: i,
    suggested_weight: e.suggested_weight ?? "",
    weight_type: e.weight_type ?? "",
    tempo: e.tempo ?? "",
  }));
}

async function resolveClientId(db, clientRef) {
  if (!clientRef) return { id: null, error: "Aucune cliente indiquée." };
  // motif façon PostgREST (`*` = joker) ; l'adaptateur supabase-js le convertit en `%`
  const filters = isUuid(clientRef)
    ? [["id", "eq", clientRef]]
    : [["name", "ilike", `*${clientRef}*`]];
  const rows = await db.select("clients", { columns: "id,name", filters });
  if (!rows || rows.length === 0) return { id: null, error: `Aucune cliente ne correspond à "${clientRef}".` };
  if (rows.length > 1) return { id: null, error: `Plusieurs clientes correspondent à "${clientRef}" : ${rows.map((c) => c.name).join(", ")}.` };
  return { id: rows[0].id, name: rows[0].name };
}

/**
 * @param db      adaptateur { select, insert }
 * @param program objet JSON de programme
 * @param opts    { dryRun?, clientOverride?, onLog? }
 */
export async function importProgram(db, program, opts = {}) {
  const log = opts.onLog || (() => {});
  const report = {
    program: program.program_name || "(sans nom)",
    client: null,
    catalogueCreated: [],
    catalogueSkipped: [],
    workoutsCreated: [],
    assignments: 0,
    nameCollisions: [],
    dryRun: !!opts.dryRun,
  };

  const errors = validateProgram(program);
  if (errors.length) { const e = new Error("Programme invalide"); e.details = errors; throw e; }

  // 1 ─ cliente ------------------------------------------------------------------
  const wantAssign = program.assign !== false;
  let clientId = null;
  if (wantAssign) {
    const r = await resolveClientId(db, opts.clientOverride || program.client);
    if (!r.id) { const e = new Error(r.error); e.details = [r.error]; throw e; }
    clientId = r.id;
    report.client = r.name;
    log(`Cliente : ${r.name} (${clientId})`);
  }

  // 2 ─ médiathèque ------------------------------------------------------------
  const cat = Array.isArray(program.catalogue) ? program.catalogue : [];
  if (cat.length) {
    const existing = await db.select("exercises_catalogue", { columns: "nom" });
    const have = new Set((existing || []).map((r) => norm(r.nom)));
    const toInsert = [];
    for (const item of cat) {
      if (have.has(norm(item.nom))) { report.catalogueSkipped.push(item.nom); continue; }
      toInsert.push({
        nom: item.nom,
        categorie: item.categorie || program.catalogue_category_default || "Mes exercices",
        positionnement: item.positionnement || "",
        execution: item.execution || "",
        respiration: item.respiration || "",
        vigilance: item.vigilance || "",
        media_url: "",
      });
      report.catalogueCreated.push(item.nom);
    }
    log(`Médiathèque : ${toInsert.length} à créer, ${report.catalogueSkipped.length} déjà présentes`);
    if (!opts.dryRun && toInsert.length) await db.insert("exercises_catalogue", toInsert);
  }

  // 3 ─ collisions de noms de séances ---------------------------------------------
  const existingW = await db.select("workouts", { columns: "name" });
  const existingNames = new Set((existingW || []).map((r) => norm(r.name)));
  for (const w of program.workouts)
    if (existingNames.has(norm(w.name))) report.nameCollisions.push(w.name);

  // 4 ─ séances + dénorm + assignation ------------------------------------------
  for (const w of program.workouts) {
    const blocks = w.blocks || [];
    const exercises = Array.isArray(w.exercises) && w.exercises.length ? w.exercises : denormFromBlocks(blocks);

    if (opts.dryRun) {
      report.workoutsCreated.push({ name: w.name, blocks: blocks.length, exercises: exercises.length });
      if (wantAssign) report.assignments++;
      continue;
    }

    const [wRow] = await db.insert("workouts",
      [{ name: w.name, description: w.description || "", blocks }],
      { returning: true });
    if (!wRow || !wRow.id) throw new Error(`Séance "${w.name}" : insertion sans id retourné.`);

    if (exercises.length) {
      await db.insert("exercises",
        exercises.map((e, i) => ({ ...e, workout_id: wRow.id, position: e.position ?? i })));
    }

    if (wantAssign && clientId) {
      await db.insert("client_workouts", [{ workout_id: wRow.id, client_id: clientId, scheduled_date: null }]);
      report.assignments++;
    }

    report.workoutsCreated.push({ id: wRow.id, name: w.name, blocks: blocks.length, exercises: exercises.length });
    log(`✓ ${w.name}`);
  }

  return report;
}
