#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════════
// build-lidia-program.mjs
//
// Génère programs/lidia-batir-en-deficit.json : le programme "Bâtir en Déficit"
// pour Lidia — 6 semaines × 4 séances, évolutif, dominante charnière / extension
// de hanche, quadriceps minimisé, déficit qui construit.
//
//   node scripts/build-lidia-program.mjs
//
// Le JSON produit est consommé tel quel par :
//   - scripts/seed-program.mjs           (écriture directe en base, local)
//   - api/import-program.js              (endpoint protégé)
//   - le panneau "Importer un programme" du dashboard coach
// ══════════════════════════════════════════════════════════════════════════════

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { exBlock, circuitBlock, warmupBlock, makeWorkout, makeIdGen } from "./lib/programBlocks.mjs";
import { CATALOGUE } from "./lib/lidiaCatalogue.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Métadonnées de phase par semaine (index 0 = semaine 1) ───────────────────
const PHASES = [
  { label: "Reprise assidue",       intent: "RPE plafonné à 7, pas d'AMRAP ni de dropset cette semaine. On rétablit l'assiduité et la technique sans chercher les courbatures maximales.", steps: "8 000",  liss: "2 LISS de 25 min les jours off" },
  { label: "Accumulation 1",        intent: "RPE 7–8. Le travail métabolique (circuits congestion) démarre. Premier dropset léger sur l'abduction.", steps: "8 500",  liss: "2 LISS de 30 min les jours off" },
  { label: "Accumulation 2",        intent: "RPE 8. +1 série sur les accessoires, dropsets et rest-pause. REFEED le week-end : les 2 jours off, glucides au niveau 'jour training'.", steps: "9 000",  liss: "2 LISS de 30 min + 1 séance d'intervalles optionnelle 10×(20 s fort / 40 s facile)" },
  { label: "Intensification",       intent: "RPE 8. Hip thrust & RDL lourds (5–6 reps, repos 3 min). Le volume accessoire est maintenu.", steps: "9 500",  liss: "2 LISS de 30 min les jours off" },
  { label: "Pic",                   intent: "RPE 8–9. Dropsets + rest-pause. Série AMRAP sur le hip thrust. REFEED le week-end.", steps: "10 000", liss: "2 LISS de 35 min les jours off" },
  { label: "Décharge + retest",     intent: "Volume −50 %, RPE 6–7, on soigne la technique. En fin de semaine : test hip thrust / RDL / abduction (à distance d'une séance lourde).", steps: "10 000", liss: "2 LISS de 25 min faciles" },
];

const NUTRI_STD  = "Nutrition : jour training ~1950 kcal (P 150 / C 200 / F 60) · jour off ~1600 kcal (P 150 / C 120 / F 55). Planchers tous les jours : protéines ≥ 145 g, lipides ≥ 50 g. Pesée le matin, on ne lit que la moyenne des 7 jours (cible −0,3 à −0,6 kg/sem).";
const NUTRI_S6   = "Nutrition : MAINTENANCE toute la semaine, ~2200 kcal (P 150 / C 250 / F 65). Semaine de décharge : on remplit les muscles, on relance le métabolisme, on prépare la suite.";

const DAY_TITLES = [
  "J1 — Extension lourde + ischios",
  "J2 — Haut du corps (densité)",
  "J3 — Charnière lourde + abduction",
  "J4 — Unilatéral + métabolique + traîneau",
];

const desc = (dayIdx, w) => {
  const p = PHASES[w];
  const nutri = w === 5 ? NUTRI_S6 : NUTRI_STD;
  return [
    `Semaine ${w + 1}/6 — ${p.label}. ${p.intent}`,
    nutri,
    `NEAT : ${p.steps} pas/jour · ${p.liss}.`,
  ].join("\n\n");
};

// pick(valeurParSemaine) : tableau de 6 → valeur de la semaine w
const P = (...v) => (w) => v[w];

// ══════════════════════════════════════════════════════════════════════════════
// JOUR 1 — Extension lourde + ischios
// ══════════════════════════════════════════════════════════════════════════════
const day1 = (w, id) => {
  const blocks = [
    warmupBlock(id(), [
      { name: "Vélo ou rameur", reps: "5 min", note: "Allure progressive, on élève la température et le cardio." },
      { name: "Kas glute bridge", reps: "20 (poids du corps)", note: "Réveil des fessiers, amplitude haute, rétroversion." },
      { name: "Marche latérale élastique (band walk)", reps: "15 pas / sens", note: "Élastique au-dessus des genoux, tension constante, petits pas." },
      { name: "Hip airplane", reps: "8 / côté", note: "Charnière sur une jambe, ouverture/fermeture lente du bassin. Équilibre + moyen fessier." },
    ], id),

    exBlock(id(), {
      name: "Hip thrust barre",
      sets: P(4, 4, 4, 4, 3, 3)(w),
      reps: P("8", "9", "10", "6", "5", "8")(w),
      rest: P(150, 150, 150, 180, 180, 120)(w),
      tempo: "2-0-1-1",
      rpe: P("7", "7-8", "8", "8", "9", "6")(w),
      weight: P("100", "105", "107,5", "120", "135", "85")(w),
      weightType: "barre",
      technique: P("", "", "", "", "Séries lourdes à 5 reps, puis passer au bloc AMRAP ci-dessous.", "Décharge — reste léger et propre.")(w),
      note: "Omoplates sur le banc, pieds à plat, poussée dans les talons. Pause 1 s en haut, menton rentré, PAS d'hyperextension lombaire. Le bassin ne tourne pas." + (w === 5 ? " En fin de semaine, test 5RM à un autre moment." : ""),
    }),
  ];

  // Bloc AMRAP séparé, uniquement en semaine 5 (Pic)
  if (w === 4) {
    blocks.push(exBlock(id(), {
      name: "Hip thrust barre — série AMRAP",
      sets: 1,
      reps: "max (viser 10+)",
      rest: 0,
      rpe: "9",
      weight: "110",
      weightType: "barre",
      technique: "AMRAP : une seule série jusqu'à l'échec TECHNIQUE (quand l'amplitude se réduit), pas l'échec total.",
      note: "Après les séries lourdes à 5 reps, on redescend à ~110 kg pour UNE série max. Noter charge + reps exactes dans le carnet : c'est LE chiffre à battre au prochain bloc. Jamais d'AMRAP sur le RDL.",
    }));
  }

  blocks.push(
    exBlock(id(), {
      name: "Soulevé de terre roumain (RDL)",
      sets: P(3, 3, 4, 4, 4, 3)(w),
      reps: P("10", "10", "10", "8", "8", "8")(w),
      rest: 120,
      tempo: "3-1-1-0",
      rpe: P("7", "7-8", "8", "8", "8-9", "6")(w),
      weight: P("2×28", "2×30", "2×30", "2×34", "2×36", "2×22")(w),
      weightType: "haltères",
      note: "Charnière de hanche : hanches vers l'arrière, tibias quasi verticaux, dos neutre. Les haltères frôlent les cuisses. Descente jusqu'à l'étirement des ischios, pas plus bas.",
    }),

    // Superset A — Leg curl allongé + Abduction machine buste penché
    circuitBlock(id(), {
      rounds: P(3, 3, 4, 4, 3, 3)(w),
      restBetweenRounds: 90,
      exercises: [
        {
          name: "Leg curl allongé",
          reps: P("12", "13", "12", "10", "10", "12")(w),
          rpe: "8",
          weightType: "machine",
          technique: P("", "", "", "", "Rest-pause sur la dernière série : 15 s de pause, puis reps jusqu'à RPE 9.", "")(w),
          note: "Hanches plaquées au banc, excentrique 3 s, pas de rebond en bas.",
        },
        {
          name: "Abduction à la machine (buste penché)",
          reps: P("18", "20", "20", "16", "20", "15")(w),
          rpe: "8",
          weight: P("75", "78", "80", "92", "90", "60")(w),
          weightType: "machine",
          technique: P("", "Dropset léger : 1 × −20 % en fin de dernière série.", "Dropset : 1 × −25 % en fin de dernière série.", "", "Double dropset : 2 × −20 % en fin de dernière série.", "")(w),
          note: "Buste penché en avant = biais haut du grand fessier. Amplitude complète, 1 s en position ouverte, aucun élan du dos.",
        },
      ],
    }, id),

    exBlock(id(), {
      name: "Kas glute bridge",
      sets: P(2, 2, 3, 3, 3, 2)(w),
      reps: "20",
      rest: 60,
      rpe: "7",
      weight: P("40", "50", "60", "70", "70", "poids du corps")(w),
      weightType: "barre",
      note: "Amplitude haute uniquement (les 15-20 derniers degrés). Rétroversion, on verrouille les fessiers 1 s. Bas du dos passif.",
    }),

    // Superset B — Dead bug lesté + Planche
    circuitBlock(id(), {
      rounds: 3,
      restBetweenRounds: 45,
      exercises: [
        { name: "Dead bug lesté", reps: "8 / côté", rpe: "7", weight: "petit haltère / disque", weightType: "haltères", note: "Lombaires plaquées au sol en permanence. Bras et jambe opposés descendent lentement." },
        { name: "Gainage / planche (plank)", mode: "time", duration: P(30, 35, 40, 45, 45, 30)(w), reps: "", rpe: "7", note: "Corps gainé, bassin ni haut ni affaissé, fessiers serrés." },
      ],
    }, id),
  );

  // Quad "assurance genou" — optionnel, retirable ; absent en décharge
  if (w !== 5) {
    blocks.push(exBlock(id(), {
      name: "Squat gobelet (goblet squat)",
      sets: 2,
      reps: "12",
      rest: 75,
      rpe: "6-7",
      weight: "kettlebell léger",
      weightType: "kettlebell",
      technique: "OPTIONNEL — santé du genou, à retirer si le genou n'aime pas.",
      note: "Talons surélevés sur des cales/disques, descente sur un box, buste assez vertical. Charge légère, on ne cherche pas la performance.",
    }));
  }

  return blocks;
};

// ══════════════════════════════════════════════════════════════════════════════
// JOUR 2 — Haut du corps (densité)
// ══════════════════════════════════════════════════════════════════════════════
const day2 = (w, id) => [
  warmupBlock(id(), [
    { name: "Vélo / rameur échauffement", reps: "4 min", note: "Allure modérée." },
    { name: "Rotations articulaires (chevilles, hanches, épaules)", reps: "10 / sens", note: "Insister sur les épaules." },
    { name: "Face pull", reps: "20 (léger)", note: "Activation des rotateurs externes et du haut du dos." },
    { name: "Gainage / planche (plank)", reps: "30 s", note: "Réveil du gainage avant les tirages/poussées." },
  ], id),

  // Superset A
  circuitBlock(id(), {
    rounds: 3,
    restBetweenRounds: 90,
    exercises: [
      { name: "Tirage vertical à la poulie (prise neutre)", reps: P("10", "11", "12", "10", "12", "10")(w), rpe: "8", weightType: "machine",
        technique: P("", "", "", "", "Dropset : 1 × −25 % sur la dernière série.", "")(w),
        note: "Tirer vers le haut de la poitrine, coudes bas et arrière, omoplates serrées." },
      { name: "Développé haltères incliné", reps: P("10", "10", "11", "10", "12", "10")(w), rpe: "8", weightType: "haltères",
        note: "Banc à 30°, omoplates basses et serrées, amplitude complète sans verrouiller brutalement." },
    ],
  }, id),

  // Superset B
  circuitBlock(id(), {
    rounds: 3,
    restBetweenRounds: 90,
    exercises: [
      { name: "Rowing haltère 1 bras", reps: "10 / côté", rpe: "8", weightType: "haltères",
        note: "Buste penché ~45°, dos plat, on tire vers la hanche, coude près du corps." },
      { name: "Développé militaire haltères (assis)", reps: P("10", "10", "11", "10", "12", "10")(w), rpe: "8", weightType: "haltères",
        note: "Côtes basses, pas de cambrure lombaire, trajectoire proche de la tête." },
    ],
  }, id),

  // Triset C
  circuitBlock(id(), {
    rounds: 3,
    restBetweenRounds: 75,
    exercises: [
      { name: "Face pull", reps: "15", rpe: "7", weightType: "machine", note: "Santé d'épaule : coudes hauts, on écarte vers le visage, pas d'élan du buste." },
      { name: "Curl biceps haltères", reps: "12", rpe: "8", weightType: "haltères", technique: P("", "", "", "", "Dropset : 1 × −30 %.", "")(w), note: "Coudes fixes le long du corps, pas de balancier." },
      { name: "Extension triceps à la poulie", reps: "12", rpe: "8", technique: P("", "", "", "", "Dropset : 1 × −30 %.", "")(w), note: "Coudes fixes, extension complète, retour contrôlé." },
    ],
  }, id),

  // Finisher — intervalles
  circuitBlock(id(), {
    rounds: P(6, 6, 8, 8, 8, 4)(w),
    restBetweenRounds: 0,
    intervalMode: true,
    exercises: [
      { name: "Corde à sauter", workTime: 30, restTime: 30, note: "30 s vives et maîtrisées / 30 s calmes. Alternative : vélo, rameur, ou farmer walk 4 × 40 m." },
    ],
  }, id),

  exBlock(id(), {
    name: "Pallof press",
    sets: 3,
    reps: "12 / côté",
    rest: 45,
    rpe: "7",
    note: "Anti-rotation : bras tendus, on résiste à la rotation du câble, buste et bassin immobiles.",
  }),
];

// ══════════════════════════════════════════════════════════════════════════════
// JOUR 3 — Charnière lourde + abduction
// ══════════════════════════════════════════════════════════════════════════════
const day3 = (w, id) => [
  warmupBlock(id(), [
    { name: "Vélo / rameur échauffement", reps: "5 min", note: "Ou marche inclinée." },
    { name: "Étirement fléchisseurs de hanche (psoas)", reps: "30 s / côté", note: "Ouvrir l'avant de la hanche avant les charnières." },
    { name: "Good morning", reps: "15 (barre à vide)", note: "Rainurer la charnière, dos neutre." },
    { name: "Marche latérale élastique (band walk)", reps: "15 pas / sens", note: "Activation moyen fessier." },
  ], id),

  exBlock(id(), {
    name: "Soulevé de terre roumain (RDL)",
    sets: P(3, 3, 4, 4, 4, 3)(w),
    reps: P("8", "8", "8", "6", "6", "8")(w),
    rest: P(150, 150, 150, 180, 180, 120)(w),
    tempo: "3-1-1-0",
    rpe: P("7", "7-8", "8", "8", "8-9", "6")(w),
    weight: P("70", "75", "77,5", "90", "95", "55")(w),
    weightType: "barre",
    note: "Pousser le sol, ne pas 'tirer' avec le bas du dos. Barre collée aux jambes, dos neutre du début à la fin." + (w === 5 ? " Test 5RM possible en fin de semaine." : ""),
  }),

  exBlock(id(), {
    name: "Hip thrust à la machine",
    sets: P(3, 3, 4, 3, 3, 2)(w),
    reps: P("15", "15", "15", "12", "15", "15")(w),
    rest: 90,
    tempo: "2-1-2-0",
    rpe: P("8", "8", "8", "8", "8", "6")(w),
    weightType: "machine",
    technique: P("", "Ajoute ~5 % de charge vs S1.", "Rest-pause sur la dernière série : 15 s puis reps jusqu'à RPE 9.", "Ajoute de la charge, reps à 12.", "Dropset : 1 × −30 % en fin de dernière série.", "Décharge.")(w),
    note: "Tempo contrôlé, on cherche la contraction pas le rebond. Pause 1 s en haut.",
  }),

  // Superset A — Extension 45° + Abduction assise
  circuitBlock(id(), {
    rounds: P(3, 3, 4, 4, 3, 3)(w),
    restBetweenRounds: 90,
    exercises: [
      { name: "Extension du dos à 45° (biais fessier)", reps: P("12", "15", "15", "12", "15", "12")(w), rpe: "8",
        weight: P("10", "10", "12,5", "15", "15", "poids du corps")(w), weightType: "disques",
        technique: P("", "", "", "", "Rest-pause : 15 s puis mini-série.", "")(w),
        note: "Bassin en rétroversion, pointes de pieds vers l'extérieur, on verrouille en haut SANS casser les lombaires. C'est un hip extension, pas un back extension." },
      { name: "Abduction assise à la machine", reps: P("20", "22", "20", "18", "25", "15")(w), rpe: "8",
        weight: P("55", "58", "60", "68", "60", "45")(w), weightType: "machine",
        technique: P("", "", "", "", "Dropset : 1 × −25 %.", "")(w),
        note: "Amplitude complète, 1 s en position ouverte, pas d'à-coups." },
    ],
  }, id),

  exBlock(id(), {
    name: "Pull-through à la poulie",
    sets: P(2, 2, 3, 3, 3, 2)(w),
    reps: "15",
    rest: 60,
    rpe: "7",
    weightType: "machine",
    note: "Dos à la poulie basse, corde entre les jambes. Charnière : on projette le bassin vers l'avant, bras passifs, gainage.",
  }),

  exBlock(id(), {
    name: "Adduction à la machine",
    sets: 2,
    reps: "15",
    rest: 60,
    rpe: "7",
    weightType: "machine",
    note: "Équilibre adducteurs / abducteurs = bassin et genou plus stables (contrepoids utile à la dominance quad). Amplitude contrôlée." + (w === 3 ? " Ajoute un peu de charge cette semaine." : ""),
  }),

  // Superset B — Relevé genoux + Vacuum
  circuitBlock(id(), {
    rounds: 3,
    restBetweenRounds: 45,
    exercises: [
      { name: "Relevé de genoux suspendu", reps: "12", rpe: "8", note: "On enroule le bassin, sans balancer. Descente contrôlée. Option : appui avant-bras." },
      { name: "Vacuum abdominal", mode: "time", duration: 18, reps: "", note: "Expiration complète, on aspire le ventre au maximum, on tient 15-20 s. Travail du transverse / taille." },
    ],
  }, id),
];

// ══════════════════════════════════════════════════════════════════════════════
// JOUR 4 — Unilatéral + métabolique + traîneau
// ══════════════════════════════════════════════════════════════════════════════
const day4 = (w, id) => [
  warmupBlock(id(), [
    { name: "Vélo / rameur échauffement", reps: "4 min", note: "Allure modérée." },
    { name: "Marche latérale élastique (band walk)", reps: "15 pas / sens", note: "Moyen fessier." },
    { name: "Monster walk", reps: "15 pas avant / arrière", note: "Tension constante, genoux qui ne rentrent pas." },
    { name: "Step-up en B-stance (kickstand)", reps: "10 / côté (poids du corps)", note: "Lent, buste penché, on sent le fessier." },
  ], id),

  exBlock(id(), {
    name: "Hip thrust unilatéral",
    sets: P(3, 3, 3, 4, 3, 2)(w),
    reps: P("10 / côté", "11 / côté", "12 / côté", "8 / côté", "10 / côté", "10 / côté")(w),
    rest: 90,
    rpe: P("8", "8", "8", "8", "8", "6")(w),
    weight: P("", "charge légère", "+ charge", "+ charge", "charge S3", "poids du corps")(w),
    weightType: "disques",
    technique: P("", "", "", "", "Rest-pause sur la dernière série de chaque jambe.", "")(w),
    note: "Une jambe (ou pied arrière en pointe, 70/30). Bassin strictement horizontal, aucune rotation. Poussée talon.",
  }),

  exBlock(id(), {
    name: "Step-up en B-stance (kickstand)",
    sets: P(3, 3, 3, 3, 3, 2)(w),
    reps: "10 / côté",
    rest: 90,
    rpe: "7",
    weight: P("poids du corps", "haltères légers", "haltères", "haltères +", "haltères", "poids du corps")(w),
    weightType: "haltères",
    note: "Box bas (20-30 cm). Buste penché, poussée dans le talon, on 'monte' avec le fessier — jambe arrière quasi passive. Peu de quadriceps.",
  }),

  // Circuit métabolique fessiers
  circuitBlock(id(), {
    rounds: P(3, 3, 4, 3, 4, 2)(w),
    restBetweenRounds: 75,
    exercises: [
      { name: "Cable kickback (extension de hanche à la poulie)", reps: "15 / côté", rpe: "8", weightType: "machine",
        technique: P("", "", "", "", "Ajoute un cran de charge.", "")(w),
        note: "Extension de hanche pure, buste stable, on ne cambre pas. Contraction 1 s." },
      { name: "Abduction assise à la machine", reps: "20", rpe: "8-9", weightType: "machine", note: "Rythme soutenu mais amplitude complète, on ne relâche pas la tension." },
      { name: "Frog pump", reps: "25", rpe: "9", note: "Plantes de pieds jointes, genoux ouverts. Amplitude courte, fessiers serrés, on ne repose pas le bassin." },
    ],
  }, id),

  exBlock(id(), {
    name: "Leg curl assis",
    sets: P(3, 3, 4, 4, 3, 3)(w),
    reps: P("15", "15", "15", "12", "12", "15")(w),
    rest: 75,
    rpe: "8",
    weightType: "machine",
    technique: P("", "", "", "", "Dropset : 1 × −30 %.", "")(w),
    note: "Pause 1 s en contraction, excentrique 3 s.",
  }),

  exBlock(id(), {
    name: "Poussée de traîneau (sled push)",
    sets: P(6, 6, 8, 8, 8, 5)(w),
    reps: "20 m",
    rest: 60,
    rpe: "8",
    weightType: "machine",
    technique: w === 4 ? "Ajoute 2 retours en marche arrière (tirage)." : "",
    note: "Buste penché ~45°, bras tendus, poussée par les hanches et les jambes, petits pas puissants. Très peu de courbatures. Alternative : marche inclinée 12 % pendant 10 min, ou circuit élastique (X-walk + monster walk + squat iso 30 s).",
  }),

  // Superset final — Roue abdo + Gainage latéral
  circuitBlock(id(), {
    rounds: 3,
    restBetweenRounds: 45,
    exercises: [
      { name: "Roue abdominale (ab wheel)", reps: P("8", "8", "10", "10", "10", "8")(w), rpe: "8", note: "Amplitude maîtrisée SANS cambrer. Anti-extension. Option : à genoux, amplitude réduite." },
      { name: "Planche latérale (side plank)", mode: "time", duration: 30, reps: "", rpe: "7", note: "30 s / côté. Alignement tête-épaule-hanche-pied, bassin qui ne s'affaisse pas." },
    ],
  }, id),
];

const DAYS = [day1, day2, day3, day4];

// ── Assemblage ──────────────────────────────────────────────────────────────
const workouts = [];
for (let w = 0; w < 6; w++) {
  for (let d = 0; d < 4; d++) {
    const id = makeIdGen(`s${w + 1}d${d + 1}`);
    const blocks = DAYS[d](w, id);
    workouts.push(makeWorkout({
      name: `S${w + 1} · ${DAY_TITLES[d]}`,
      description: desc(d, w),
      blocks,
    }));
  }
}

const program = {
  version: 1,
  program_name: "Bâtir en Déficit — Lidia (6 sem.)",
  client: "Lidia",
  assign: true,               // rattacher chaque séance à la cliente (client_workouts, non datée)
  archive_existing_named: false,
  catalogue_category_default: "Musculation avec charges",
  catalogue: CATALOGUE,
  workouts,
};

const outPath = resolve(__dirname, "../programs/lidia-batir-en-deficit.json");
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(program, null, 2) + "\n", "utf8");

const totalBlocks = workouts.reduce((a, w) => a + w.blocks.length, 0);
console.log(`✅ ${workouts.length} séances · ${totalBlocks} blocs · ${CATALOGUE.length} fiches médiathèque`);
console.log(`   → ${outPath}`);
