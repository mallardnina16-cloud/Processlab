// ══════════════════════════════════════════════════════════════════════════════
// programBlocks.mjs — fabrique de "blocks" au format attendu par Processlab
//
// Un programme = une liste de séances. Chaque séance a des `blocks` (le format
// natif du WorkoutBuilder) + une liste `exercises` dénormalisée (ce que
// saveWorkout() insère dans la table `exercises`, pour les compteurs et la vue
// planning). On reproduit ici EXACTEMENT la logique de handleSave() de l'app :
//   allEx = blocks.flatMap(b => b.type === "circuit"
//     ? b.exercises.map(e => ({ ...e, type: "exercise", sets: b.rounds, rest: b.rest_between_rounds }))
//     : [b])
//
// Champs ajoutés par rapport au schéma d'origine : `rpe` et `technique`
// (dropset / rest-pause / AMRAP / myo-reps…). Ils vivent uniquement dans le JSON
// `blocks` (colonne jsonb) — aucune migration de base nécessaire.
// ══════════════════════════════════════════════════════════════════════════════

const slug = (s) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Compteur pour générer des ids stables et uniques dans une même séance.
export const makeIdGen = (prefix) => {
  let n = 0;
  return () => `${prefix}-${++n}`;
};

// ── Exercice simple ──────────────────────────────────────────────────────────
export const exBlock = (id, {
  name,
  sets = 3,
  reps = "12",
  mode = "reps",
  duration = 30,
  rest = 90,
  tempo = "",
  note = "",
  rpe = "",
  technique = "",
  weight = "",
  weightType = "haltères",
}) => ({
  id,
  type: "exercise",
  name,
  sets,
  reps: String(reps),
  mode,
  duration,
  rest,
  tempo,
  note,
  photo: null,
  suggested_weight: weight === "" ? "" : String(weight),
  weight_type: weightType,
  rpe: String(rpe),
  technique,
});

// ── Circuit (tours) ──────────────────────────────────────────────────────────
export const circuitBlock = (id, {
  rounds = 3,
  restBetweenRounds = 90,
  intervalMode = false,
  exercises = [],
}, idGen) => ({
  id,
  type: "circuit",
  rounds,
  rest_between_rounds: restBetweenRounds,
  interval_mode: intervalMode,
  exercises: exercises.map((e) => ({
    id: idGen(),
    name: e.name,
    reps: String(e.reps ?? "12"),
    mode: e.mode || "reps",
    duration: e.duration ?? 30,
    work_time: e.workTime ?? 30,
    rest_time: e.restTime ?? 30,
    tempo: e.tempo || "",
    note: e.note || "",
    suggested_weight: e.weight === undefined || e.weight === "" ? "" : String(e.weight),
    weight_type: e.weightType || "haltères",
    rpe: String(e.rpe ?? ""),
    technique: e.technique || "",
  })),
});

// ── Échauffement ─────────────────────────────────────────────────────────────
export const warmupBlock = (id, exercises, idGen) => ({
  id,
  type: "warmup",
  exercises: exercises.map((e) => ({
    id: idGen(),
    name: e.name,
    reps: e.reps || "",
    note: e.note || "",
    photo: null,
  })),
});

// ── Dénormalisation → table `exercises` (réplique de handleSave) ──────────────
export const denormExercises = (blocks) =>
  blocks.flatMap((b) =>
    b.type === "circuit"
      ? b.exercises.map((e) => ({ ...e, type: "exercise", sets: b.rounds, rest: b.rest_between_rounds }))
      : [b]
  );

// Ligne prête pour supabase.from("exercises").insert(...) — mêmes colonnes que l'app
export const denormRows = (blocks) =>
  denormExercises(blocks).map((e, i) => ({
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

// ── Séance complète ─────────────────────────────────────────────────────────
export const makeWorkout = ({ name, description, blocks }) => ({
  name,
  description,
  blocks,
  exercises: denormRows(blocks),
});

export { slug };
