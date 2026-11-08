#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════════
// build-nina-program.mjs
//
// Génère programs/nina/bloc1-seche-fessiers-cardio.json : programme perso de
// Nina — perte de poids en gardant le muscle (fessiers), 6 séances/sem, 4 sem :
//   Lundi    bas du corps A (charnière + fessiers)
//   Mardi    haut du corps (poids du corps) + cardio
//   Mercredi circuit full body — salle battle rope / chariot / rameur
//   Jeudi    bas du corps B (fessiers + ischios)
//   Vendredi circuit cardio — salle SkiErg / Assault bike / rameur
//            (remplaçable par un cours Body by Ciara)
//   Dimanche VMA + explosivité sans impact
//
//   node scripts/build-nina-program.mjs
//
// Contexte : problème de dos (travail du contrôle moteur avec le kiné → RDL OK),
// plus de sauts ni de course. Fémurs longs, dominance quadriceps, prend vite des
// cuisses → programme orienté hanche, peu de volume quadri. Pas de presse (sauf
// option pieds très écartés), pas de fente bulgare, pas de bras en isolation.
// Intensifications (demi-reps, 1,5 rep, dropset, myo-reps, rest-pause,
// isométrie) réservées aux exercices où le dos n'est pas chargé ; le RDL garde
// toujours 2 répétitions en réserve. S4 = allègement sans technique.
// ══════════════════════════════════════════════════════════════════════════════

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { exBlock, circuitBlock, warmupBlock, makeWorkout, makeIdGen } from "./lib/programBlocks.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../programs/nina/bloc1-seche-fessiers-cardio.json");
const WEEKS = 4;
const DELOAD = 3; // index de la semaine d'allègement

// ── GIFs ─────────────────────────────────────────────────────────────────────
const edb = (id) => `https://static.exercisedb.dev/media/${id}.gif`;
const repo = (f) => `https://raw.githubusercontent.com/mallardnina16-cloud/Processlab/main/public/exercise-gifs/${f}.gif`;

const GIF = {
  // Échauffement / gainage
  "Rameur (échauffement)": null,
  "SkiErg (échauffement)": edb("vpQaQkH"),
  "Bird-dog": null,
  "Dead bug": edb("iny3m5y"),
  "Hip thrust au sol (glute bridge)": edb("u0cNiij"),
  "Band pull-apart": edb("sTfvVsG"),
  "Pompes scapulaires": null,
  "Soulevé de terre roumain (RDL) — séries d'approche": edb("wQ2c4XD"),
  "Hip thrust barre — séries d'approche": repo("hip-thrust"),
  "Pallof press": edb("9pa4H5m"),
  "Planche latérale (side plank)": edb("RKjH6Lt"),
  "Curl-up McGill": null,
  "Retour au calme : étirements": edb("sU5BrfP"),
  // Bas du corps
  "Soulevé de terre roumain (RDL)": edb("wQ2c4XD"),
  "Fente arrière pied sur patin (déficit)": edb("SSsBDwB"),
  "Hip thrust barre": repo("hip-thrust"),
  "Leg curl allongé": edb("17lJ1kr"),
  "Leg curl assis": edb("Zg3XY7P"),
  "Abduction assise à la machine": edb("CHpahtl"),
  "Step-up à la poulie": edb("aXtJhlg"),
  "RDL unilatéral haltères": edb("gKozT8X"),
  "Cable kickback (extension de hanche à la poulie)": edb("Kpajagk"),
  "Presse à cuisses pieds larges (optionnel)": edb("10Z2DXU"),
  // Haut du corps
  "Tractions assistées": edb("kiJ4Z2K"),
  "Pompes": edb("I4hDWkc"),
  "Rowing haltères buste appuyé (banc incliné)": edb("7vG5o25"),
  "Rowing inversé TRX": edb("jdiExfW"),
  "Face pull": edb("ZfyAGhK"),
  "Développé landmine à genoux": null,
  // Cardio / circuits / explosivité
  "SkiErg": edb("vpQaQkH"),
  "Rameur": null,
  "Assault bike": edb("H1PESYI"),
  "Assault bike (sprint)": edb("H1PESYI"),
  "Poussée de chariot (sled push)": null,
  "Battle rope": edb("RJa4tCo"),
  "Soulevé de terre kettlebell": null,
  "Farmer carry": edb("qPEzJjA"),
  "Pont fessier élastique aux genoux": edb("u0cNiij"),
  "Bear plank + touches d'épaules": edb("h1ezqSu"),
  "Wall drive (montées de genoux au mur)": null,
  "Poussée isométrique au mur": null,
  "Lancer de med ball poitrine contre le mur": edb("aDoFKrE"),
};

const gif = (name) => {
  if (!(name in GIF)) throw new Error(`GIF manquant pour "${name}"`);
  return GIF[name];
};

// P(s1, s2, s3, s4)(w) → valeur de la semaine w
const P = (...v) => (w) => v[w];
const isDeload = (w) => w === DELOAD;

// ── Intensité en langage clair ───────────────────────────────────────────────
const CHARGE = [
  "Charge : 2 répétitions en réserve. Semaine de découverte des techniques : prends un peu moins que d'habitude et note tes charges.",
  "Charge : 1 à 2 répétitions en réserve. Monte les charges par rapport à la semaine 1.",
  "Charge : 1 répétition en réserve. Bats tes charges ou tes répétitions de la semaine 2.",
  "Allègement : mêmes charges qu'en semaine 3, une série en moins, aucune technique d'intensification. Tu dois finir la séance en ayant de la marge.",
];
const withCharge = (note, w) => `${CHARGE[w]}\n\n${note}`;

const TECH = {
  demiReps: "Demi-reps : juste après chaque série, sans poser la barre, enchaîne 10 demi-répétitions dans la moitié haute du mouvement. Sur la dernière série, finis par 10 secondes d'isométrie en haut, fessiers serrés au maximum.",
  unEtDemi: "Méthode 1,5 rep : descends en bas, remonte à mi-course, redescends en bas, puis remonte entièrement. L'ensemble compte pour 1 répétition.",
  dropset: "Dropset sur la dernière série : à la fin de la série, baisse la charge d'environ 30 % et repars tout de suite jusqu'à 1 répétition de l'échec.",
  myo: "Myo-reps : une série d'activation de 15 à 20 répétitions, 5 respirations, puis 5 répétitions, 5 respirations, 5 répétitions… 4 mini-séries au total.",
  restPause: "Rest-pause sur la dernière série : 8 répétitions, pose 15 s, max de répétitions propres, pose 15 s, max de répétitions propres.",
  excentrique3: "Excentrique : descente en 3 secondes, montée dynamique.",
  excentrique4: "Excentrique : descente en 4 secondes, en contrôlant jusqu'aux bras tendus.",
  pauseBas: "Pause en bas : tiens 2 secondes en position étirée sans te relâcher, puis remonte.",
  pauseHaut: "Pause en contraction : tiens 2 secondes coudes en arrière, omoplates serrées.",
  partielles: "Partielles en étirement : à la fin de la dernière série, enchaîne 6 à 8 demi-répétitions dans la partie étirée (jambes presque tendues).",
  iso20: "Isométrie : à la fin de chaque série, tiens 20 secondes la jambe en arrière en contraction maximale.",
  dropMeca: "Dropset mécanique : pompes en déficit (mains sur 2 haltères) jusqu'à 1 rep de l'échec, puis sans repos pompes classiques, puis pompes inclinées (mains sur un banc).",
};
const withTech = (note, key) => (key ? `${note}\n\n${TECH[key]}` : note);

// ── Blocs avec GIF ───────────────────────────────────────────────────────────
const ex = (id, w, { charged = true, equipment, note, ...o }) => ({
  ...exBlock(id, { ...o, note: charged ? withCharge(note, w) : note }),
  ...(equipment ? { equipment } : {}),
  photo: gif(o.name),
});

const circuit = (id, opts, idGen) => {
  const b = circuitBlock(id, opts, idGen);
  b.exercises = b.exercises.map((e, i) => ({
    ...e,
    ...(opts.exercises[i].equipment ? { equipment: opts.exercises[i].equipment } : {}),
    photo: gif(e.name),
  }));
  return b;
};

const warmup = (id, list, idGen) => {
  const b = warmupBlock(id, list, idGen);
  b.exercises = b.exercises.map((e) => ({ ...e, photo: gif(e.name) }));
  return b;
};

// Exercice cardio en intervalles (circuit à 1 exo, timer travail/repos)
const intervals = (id, idGen, { name, rounds, work, rest, restAfter = 0, note, equipment, technique = "" }) =>
  circuit(id, {
    rounds, restBetweenRounds: restAfter, intervalMode: true,
    exercises: [{ name, reps: `${work} s`, mode: "time", duration: work, workTime: work, restTime: rest,
      weightType: "machine", equipment, technique, note }],
  }, idGen);

// ── Préparation du dos ───────────────────────────────────────────────────────
const PREPA_DOS = [
  { name: "Bird-dog", reps: "6 / côté", note: "Dos plat, tiens 3 s bras et jambe opposés tendus. Rien ne tourne." },
  { name: "Dead bug", reps: "6 / côté", note: "Lombaires plaquées au sol, expiration longue en tendant." },
  { name: "Hip thrust au sol (glute bridge)", reps: "15", note: "Côtes basses, serre fort en haut : on allume les fessiers avant de charger." },
];

const retourAuCalme = (id) => ex(id, 0, {
  name: "Retour au calme : étirements", sets: 1, reps: "5 min", mode: "time", duration: 300, rest: 0,
  weightType: "poids du corps", charged: false,
  note: "Psoas (un genou au sol, bassin rétroversé) 30 s / côté · fessiers en figure 4 au sol 30 s / côté · ischios à la sangle, dos au sol, 30 s / côté · suspension à la barre 2 × 20 s. Pas d'étirement qui arrondit le dos sous tension.",
});

// ── Textes de séance ─────────────────────────────────────────────────────────
const PHASE = [
  "Semaine 1/4 — Découverte des techniques. Charges un peu sous tes habitudes, on apprend les méthodes et on note tout.",
  "Semaine 2/4 — On monte les charges, les techniques restent les mêmes.",
  "Semaine 3/4 — Semaine la plus dure : bats tes charges ou tes répétitions de la semaine 2.",
  "Semaine 4/4 — Allègement : une série en moins, aucune technique d'intensification, cardio réduit. On récupère avant le bloc suivant.",
];

const REGLES = [
  "Dos : douleur notée de 0 à 10 avant la séance. Jusqu'à 3/10, séance normale. Au-dessus, ou si ça monte pendant la séance : -20 % sur les charges, et le RDL est remplacé par un pont fessier lesté. Le RDL garde toujours 2 répétitions en réserve, jamais d'intensification dessus.",
  "Morphologie : fémurs longs et dominance quadri → la priorité, c'est la hanche. Buste penché sur les fentes et les step-ups, pousse dans le talon, et vérifie que tu sens tes fessiers avant tes cuisses.",
  "Sèche : déficit modéré (-300 à -450 kcal), 1,8 à 2 g de protéines / kg, 8 à 10 000 pas par jour. Le RDL et le hip thrust doivent progresser : s'ils baissent, remonte un peu les calories.",
].join("\n\n");

const desc = (w, intro) => [PHASE[w], intro, REGLES].join("\n\n");

// ════════════════════════════════════════════════════════════════════════════
// LUNDI — Bas du corps A (charnière + fessiers)
// ════════════════════════════════════════════════════════════════════════════
const lundi = (w, id) => {
  const d = isDeload(w);
  return [
    warmup(id(), [
      { name: "Rameur (échauffement)", reps: "4 min", note: "Allure progressive." },
      ...PREPA_DOS,
      { name: "Soulevé de terre roumain (RDL) — séries d'approche", reps: "8 barre seule + 5 à mi-charge", note: "On répète le geste avant de charger." },
    ], id),
    ex(id(), w, {
      name: "Soulevé de terre roumain (RDL)", sets: d ? 3 : 4, reps: "6-8", rest: 150, charged: false,
      tempo: d ? "3-0-1-0" : "3-2-1-0", rpe: d ? "6" : "7-8",
      technique: d ? "" : "Tempo 3-2-1 : pause 2 s en étirement",
      weightType: "barre", equipment: "Barre, disques",
      note: withTech(
        "Toujours 2 répétitions en réserve, toutes les semaines : c'est ton dos qui décide.\n\nGainage avant chaque répétition, hanches vers l'arrière, barre collée aux cuisses, genoux légèrement fléchis et fixes. Descends jusqu'à l'étirement des ischios, remonte en poussant les hanches, sans hyperextension en haut. Descente en 3 s.",
        d ? null : "pauseBas",
      ),
    }),
    ex(id(), w, {
      name: "Fente arrière pied sur patin (déficit)", sets: d ? 2 : 3, reps: "8 / jambe", rest: 90,
      tempo: "3-0-1-0", technique: d ? "" : "1,5 rep",
      weightType: "haltères", equipment: "Haltères, patin (slider), step",
      note: withTech(withCharge(
        "Pied avant sur un step (déficit = plus d'amplitude de hanche), pied arrière sur le patin. Glisse le pied arrière loin derrière en 3 s, buste penché à ~30° en gardant le dos plat. Pousse dans le talon avant pour remonter. Le genou avant reste au-dessus de la cheville : si tu sens surtout la cuisse, allonge le pas et penche plus le buste.", w),
        d ? null : "unEtDemi"),
    }),
    ex(id(), w, {
      name: "Hip thrust barre", sets: d ? 2 : 3, reps: d ? "10" : "10 + 10 demi-reps", rest: 120,
      tempo: "2-0-1-1", technique: d ? "" : "Demi-reps après chaque série + iso 10 s (dernière série)",
      weightType: "barre", equipment: "Barre, disques, banc, mousse",
      note: withTech(withCharge(
        "Bas des omoplates sur le banc, tibias verticaux en haut, menton rentré, côtes basses. Monte jusqu'à l'alignement épaules-hanches-genoux, serre 1 s, redescends en 2 s. Pas de cambrure pour monter plus haut.", w),
        d ? null : "demiReps"),
    }),
    ex(id(), w, {
      name: "Leg curl allongé", sets: d ? 2 : 3, reps: "10-12", rest: 60,
      technique: d ? "" : "Dropset (dernière série)",
      weightType: "machine", equipment: "Machine leg curl allongé",
      note: withTech(withCharge("Bassin collé au banc, descente en 3 s.", w), d ? null : "dropset"),
    }),
    ex(id(), w, {
      name: "Abduction assise à la machine", sets: d ? 2 : 1, reps: d ? "15-20" : "15-20 + 4 × 5 (myo-reps)", rest: 45,
      technique: d ? "" : "Myo-reps",
      weightType: "machine", equipment: "Machine abduction",
      note: withTech(withCharge("Buste penché vers l'avant, dos plat. Écarte avec le côté des fesses, tiens 1 s, reviens lentement.", w), d ? null : "myo"),
    }),
    circuit(id(), {
      rounds: d ? 2 : 3, restBetweenRounds: 30,
      exercises: [
        { name: "Pallof press", reps: "10 / côté", weightType: "machine", equipment: "Poulie ou élastique",
          note: "CIRCUIT GAINAGE : enchaîne avec la planche latérale.\n\nDe profil à la poulie, pousse les bras devant toi et tiens 2 s : rien ne tourne." },
        { name: "Planche latérale (side plank)", reps: "30 s / côté", mode: "time", duration: 30, weightType: "poids du corps",
          note: "Coude sous l'épaule, corps aligné, hanche poussée vers le plafond." },
      ],
    }, id),
    retourAuCalme(id()),
  ];
};

// ════════════════════════════════════════════════════════════════════════════
// MARDI — Haut du corps (poids du corps à l'honneur) + cardio
// ════════════════════════════════════════════════════════════════════════════
const mardi = (w, id) => {
  const d = isDeload(w);
  return [
    warmup(id(), [
      { name: "SkiErg (échauffement)", reps: "3 min", note: "Ou rameur selon la salle. Allure progressive." },
      { name: "Band pull-apart", reps: "15", note: "Bras tendus, serre les omoplates, côtes basses." },
      { name: "Pompes scapulaires", reps: "10", note: "En planche haute, bras tendus : rapproche puis écarte les omoplates sans plier les coudes." },
    ], id),
    ex(id(), w, {
      name: "Tractions assistées", sets: d ? 3 : 4, reps: "5-6", rest: 120,
      tempo: d ? "" : "4-0-1-0", technique: d ? "" : "Excentrique 4 s",
      weightType: "élastique", equipment: "Barre de traction, élastique ou machine",
      note: withTech(withCharge("Prends l'assistance la plus faible qui te permet des répétitions complètes. Épaules basses, poitrine vers la barre, ventre gainé sans te cambrer.", w),
        d ? null : "excentrique4"),
    }),
    ex(id(), w, {
      name: "Pompes", sets: 3, reps: d ? "max - 2" : "max (drop set mécanique)", rest: 120,
      technique: d ? "" : "Drop set mécanique : déficit → classiques → inclinées",
      weightType: "poids du corps", equipment: "2 haltères, banc", charged: false,
      note: withTech(
        "Corps gainé de la tête aux talons, fesses serrées, coudes à ~45° du corps, poitrine jusqu'au sol (ou aux haltères en déficit).",
        d ? null : "dropMeca",
      ),
    }),
    ex(id(), w, {
      name: "Rowing haltères buste appuyé (banc incliné)", sets: d ? 2 : 3, reps: "10", rest: 75,
      technique: d ? "" : "Pause 2 s en contraction",
      weightType: "haltères", equipment: "Banc incliné, haltères",
      note: withTech(withCharge("Poitrine collée au dossier : ton bas du dos ne porte rien. Coudes vers les hanches.", w), d ? null : "pauseHaut"),
    }),
    circuit(id(), {
      rounds: d ? 2 : 3, restBetweenRounds: 75,
      exercises: [
        { name: "Rowing inversé TRX", reps: "12", weightType: "poids du corps", equipment: "TRX ou anneaux",
          note: "SUPERSET : enchaîne avec le face pull, puis 1 min 15 de repos.\n\nCorps gainé en planche, fesses serrées. Plus tes pieds avancent, plus c'est dur. Poitrine aux poignées, omoplates serrées." },
        { name: "Face pull", reps: "15", weightType: "machine", equipment: "Poulie haute, corde",
          note: "Tire la corde vers le front en écartant les mains, coudes hauts, tiens 1 s." },
      ],
    }, id),
    ex(id(), w, {
      name: "Développé landmine à genoux", sets: d ? 2 : 3, reps: "8-10 / bras", rest: 75,
      weightType: "barre", equipment: "Barre dans un landmine (ou calée dans un coin), disques",
      note: withCharge("À genoux (ou un genou au sol), fessiers serrés, côtes basses. Pousse la barre vers l'avant et le haut d'un bras, sans cambrer ni tourner le buste.", w),
    }),
    intervals(id(), id, {
      name: "SkiErg", rounds: P(6, 7, 8, 5)(w), work: 60, rest: 60, equipment: "SkiErg (ou rameur)",
      technique: "Intervalles 1 min / 1 min",
      note: `CARDIO : ${P(6, 7, 8, 5)(w)} × (1 min soutenue / 1 min très facile). Allure soutenue = ~85 % de ta FC max, tenable à l'identique sur toutes les répétitions.\n\nSalle sans SkiErg : même format au rameur (allure 2 min soutenues / 1 min facile possible aussi).\n\nSkiErg : tire en pliant les hanches, pas en arrondissant le dos ; bras et hanches finissent ensemble.`,
    }),
    retourAuCalme(id()),
  ];
};

// ════════════════════════════════════════════════════════════════════════════
// MERCREDI — Circuit full body, salle battle rope + chariot + rameur
// ════════════════════════════════════════════════════════════════════════════
const mercredi = (w, id) => {
  const minutes = P(8, 8, 9, 6)(w);
  const blocs = P(3, 3, 3, 2)(w);
  return [
    warmup(id(), [
      { name: "Rameur (échauffement)", reps: "4 min", note: "Allure progressive." },
      ...PREPA_DOS,
    ], id),
    circuit(id(), {
      rounds: blocs, restBetweenRounds: 120,
      exercises: [
        { name: "Poussée de chariot (sled push)", reps: "20 m", weightType: "machine", equipment: "Chariot",
          technique: `AMRAP ${minutes} min`,
          note: `AMRAP : ${blocs} blocs de ${minutes} min, enchaîne les 6 exercices en boucle et fais le maximum de tours propres, puis 2 min de repos. Note ton nombre de tours pour le battre la semaine suivante.\n\nChariot : bras tendus ou fléchis, corps penché, dos plat, petits pas puissants. Charge moyenne.` },
        { name: "Soulevé de terre kettlebell", reps: "10", weightType: "kettlebell", equipment: "Kettlebell",
          note: "Charnière de hanche contrôlée, kettlebell entre les pieds, dos plat. Pas de swing." },
        { name: "Pompes", reps: "10", weightType: "poids du corps",
          note: "Corps gainé, poitrine au sol. Mains sur un banc si la technique se dégrade." },
        { name: "Rowing inversé TRX", reps: "10", weightType: "poids du corps", equipment: "TRX ou anneaux",
          note: "Corps gainé en planche, omoplates serrées en haut." },
        { name: "Battle rope", reps: "30 s", mode: "time", duration: 30, weightType: "machine", equipment: "Battle rope",
          note: "Vagues alternées, genoux fléchis, buste droit et gainé : le mouvement part des épaules, pas du dos." },
        { name: "Rameur", reps: "10 cal", weightType: "machine", equipment: "Rameur",
          note: "Jambes, puis hanches, puis bras. Dos plat, pas d'arrondi en fin de tirage." },
      ],
    }, id),
    circuit(id(), {
      rounds: 2, restBetweenRounds: 30,
      exercises: [
        { name: "Farmer carry", reps: "40 m", weightType: "haltères", equipment: "Haltères ou kettlebells lourds",
          note: "FINISHER : 2 allers-retours. Épaules basses, buste droit, pas rapides." },
      ],
    }, id),
    retourAuCalme(id()),
  ];
};

// ════════════════════════════════════════════════════════════════════════════
// JEUDI — Bas du corps B (fessiers + ischios)
// ════════════════════════════════════════════════════════════════════════════
const jeudi = (w, id) => {
  const d = isDeload(w);
  return [
    warmup(id(), [
      { name: "Rameur (échauffement)", reps: "4 min", note: "Allure progressive." },
      ...PREPA_DOS,
      { name: "Hip thrust barre — séries d'approche", reps: "10 barre seule + 5 à mi-charge", note: "On monte progressivement." },
    ], id),
    ex(id(), w, {
      name: "Hip thrust barre", sets: d ? 3 : 4, reps: "6-8", rest: 150,
      tempo: "2-0-1-2", technique: d ? "Squeeze 2 s en haut" : "Squeeze 2 s en haut + rest-pause (dernière série)",
      weightType: "barre", equipment: "Barre, disques, banc, mousse",
      note: withTech(withCharge(
        "Séance LOURDE : c'est ton exercice principal de la semaine. Tiens 2 s en haut à chaque répétition, côtes basses, menton rentré.", w),
        d ? null : "restPause"),
    }),
    ex(id(), w, {
      name: "Step-up à la poulie", sets: d ? 2 : 3, reps: "10 / jambe", rest: 90,
      tempo: d ? "" : "3-0-1-0", technique: d ? "" : "Excentrique 3 s",
      weightType: "machine", equipment: "Poulie basse, poignée, step haut (box au genou)",
      note: withTech(withCharge(
        "Poignée de la poulie basse en main, face à la poulie (elle tire vers l'avant : tu peux pencher le buste sans tomber). Pied entier sur le step, buste penché, pousse dans le talon. Ne t'aide pas de la jambe du bas.", w),
        d ? null : "excentrique3"),
    }),
    ex(id(), w, {
      name: "RDL unilatéral haltères", sets: d ? 2 : 3, reps: "10 / jambe", rest: 75,
      technique: d ? "" : "Pause 2 s en bas",
      weightType: "haltères", equipment: "Haltères",
      note: withTech(withCharge(
        "Version B-stance si l'équilibre limite (pointe du pied arrière au sol, 90 % du poids sur la jambe avant). Bassin de face, dos plat, haltère le long de la jambe.", w),
        d ? null : "pauseBas"),
    }),
    ex(id(), w, {
      name: "Leg curl assis", sets: d ? 2 : 3, reps: "12", rest: 60,
      technique: d ? "" : "Partielles en étirement (dernière série)",
      weightType: "machine", equipment: "Machine leg curl assis",
      note: withTech(withCharge("Cuisses bien bloquées, buste légèrement penché en avant pour plus d'étirement.", w), d ? null : "partielles"),
    }),
    ex(id(), w, {
      name: "Cable kickback (extension de hanche à la poulie)", sets: d ? 2 : 3, reps: "12 / jambe", rest: 45,
      technique: d ? "" : "Isométrie 20 s en fin de série",
      weightType: "machine", equipment: "Poulie basse, sangle de cheville",
      note: withTech(withCharge("Buste penché, ventre gainé. Pousse vers l'arrière avec la fesse et arrête-toi quand la hanche est tendue : le bas du dos ne se creuse pas.", w), d ? null : "iso20"),
    }),
    ex(id(), w, {
      name: "Presse à cuisses pieds larges (optionnel)", sets: 2, reps: "12", rest: 60,
      weightType: "machine", equipment: "Presse à cuisses",
      note: withCharge("OPTIONNEL — seulement si tu as encore de l'énergie. Pieds très écartés et hauts sur la plateforme, descends tant que le bassin reste collé au dossier. Pousse dans les talons.", w),
    }),
    circuit(id(), {
      rounds: 2, restBetweenRounds: 30,
      exercises: [
        { name: "Curl-up McGill", reps: "5 × 10 s", weightType: "poids du corps",
          note: "BIG 3 DE McGILL.\n\nSur le dos, une jambe pliée, mains sous les lombaires (courbure naturelle conservée). Décolle juste la tête et les épaules de quelques cm, sans plier la nuque, tiens 10 s." },
        { name: "Planche latérale (side plank)", reps: "3 × 10 s / côté", weightType: "poids du corps",
          note: "Tenues courtes et très contractées, corps aligné." },
        { name: "Bird-dog", reps: "5 × 10 s / côté", weightType: "poids du corps",
          note: "Tends bras et jambe opposés, tiens 10 s, serre le poing et contracte la fesse. Rien ne bouge." },
      ],
    }, id),
    retourAuCalme(id()),
  ];
};

// ════════════════════════════════════════════════════════════════════════════
// VENDREDI — Circuit cardio, salle SkiErg + Assault bike + rameur
// ════════════════════════════════════════════════════════════════════════════
const vendredi = (w, id) => {
  const work = P(30, 35, 40, 30)(w);
  const rest = 60 - work;
  const rounds = P(4, 4, 4, 3)(w);
  const iv = (name, note, extra = {}) => ({ name, reps: `${work} s`, mode: "time", duration: work, workTime: work, restTime: rest, weightType: "poids du corps", note, ...extra });
  return [
    warmup(id(), [
      { name: "Rameur (échauffement)", reps: "4 min", note: "Allure progressive." },
      ...PREPA_DOS,
    ], id),
    circuit(id(), {
      rounds, restBetweenRounds: 60, intervalMode: true,
      exercises: [
        iv("SkiErg", `CIRCUIT : ${rounds} tours de 8 exercices, ${work} s d'effort / ${rest} s de récup, 1 min entre les tours. Zéro impact.\n\nCette séance peut être remplacée par un cours Body by Ciara (conditioning ou circuit, sans sauts).\n\nSkiErg : allure forte et régulière.`, { weightType: "machine", equipment: "SkiErg" }),
        iv("Pont fessier élastique aux genoux", "Élastique au-dessus des genoux, pousse les genoux vers l'extérieur, tiens 1 s en haut.", { weightType: "élastique", equipment: "Mini-bande" }),
        iv("Pompes", "Rythme régulier, corps gainé. Passe sur les genoux ou mains sur un banc quand la technique se dégrade."),
        iv("Rameur", "Allure forte, dos plat.", { weightType: "machine", equipment: "Rameur" }),
        iv("Bear plank + touches d'épaules", "Genoux à 2-3 cm du sol, dos plat. Touche l'épaule opposée en alternant, le bassin ne bouge pas."),
        iv("Assault bike", "Allure forte, buste droit.", { weightType: "machine", equipment: "Assault bike" }),
        iv("Wall drive (montées de genoux au mur)", "Mains au mur, corps incliné à 45° et gainé. Monte un genou à hauteur de hanche et alterne vite, sans sauter : le pied d'appui reste au sol."),
        iv("Dead bug", "Lombaires au sol, tempo contrôlé : c'est ta récup active."),
      ],
    }, id),
    retourAuCalme(id()),
  ];
};

// ════════════════════════════════════════════════════════════════════════════
// DIMANCHE — VMA + explosivité sans impact (salle SkiErg + Assault bike)
// ════════════════════════════════════════════════════════════════════════════
const dimanche = (w, id) => {
  const d = isDeload(w);
  const vma = w <= 1
    ? [
        intervals(id(), id, {
          name: "SkiErg", rounds: d ? 6 : 8, work: 30, rest: 30, restAfter: 180, equipment: "SkiErg",
          technique: "VMA 30/30",
          note: "VMA : 30 s à l'allure la plus haute que tu peux tenir À L'IDENTIQUE sur toutes les répétitions / 30 s très facile. Note tes calories ou ton allure par répétition. Puis 3 min de récup avant l'Assault bike.",
        }),
        intervals(id(), id, {
          name: "Assault bike", rounds: d ? 6 : 8, work: 30, rest: 30, restAfter: 120, equipment: "Assault bike",
          technique: "VMA 30/30",
          note: "Même consigne : régularité avant tout. Si tu chutes de plus de 10 % de watts, c'est que tu es partie trop vite.",
        }),
      ]
    : [
        circuit(id(), {
          rounds: d ? 2 : 5, restBetweenRounds: 0, intervalMode: true,
          exercises: (d ? ["SkiErg", "Assault bike", "Rameur"] : ["SkiErg", "Assault bike"]).map((name) => ({
            name, reps: "60 s", mode: "time", duration: 60, workTime: 60, restTime: 60, weightType: "machine", equipment: name,
            technique: "VMA 1 min / 1 min",
            note: "VMA : 1 min forte / 1 min très facile, en alternant les machines. Allure forte = tenable sur toutes les répétitions.",
          })),
        }, id),
      ];
  return [
    warmup(id(), [
      { name: "Rameur (échauffement)", reps: "5 min", note: "Progressif, avec 3 accélérations de 10 s sur la fin." },
      ...PREPA_DOS,
    ], id),
    circuit(id(), {
      rounds: d ? 3 : 5, restBetweenRounds: 90,
      exercises: [
        { name: "Poussée isométrique au mur", reps: "6 s", mode: "time", duration: 6, weightType: "poids du corps",
          note: "EXPLOSIVITÉ (jambes fraîches) : enchaîne directement avec 6 s de sprint à l'Assault bike, puis 1 min 30 de récup.\n\nPosition de départ de sprint, mains au mur, corps incliné et gainé, un genou haut : pousse le mur À 100 % avec la jambe d'appui pendant 6 s. Alterne la jambe à chaque série." },
        { name: "Assault bike (sprint)", reps: "6 s", mode: "time", duration: 6, weightType: "machine", equipment: "Assault bike",
          note: "Sprint maximal : l'accélération la plus violente possible." },
      ],
    }, id),
    ex(id(), w, {
      name: "Lancer de med ball poitrine contre le mur", sets: d ? 3 : 4, reps: "6", rest: 60, charged: false,
      weightType: "med ball", equipment: "Med ball 3-5 kg, mur",
      note: "Debout face au mur, pieds fixes, gainé. Lance le plus fort et le plus vite possible depuis la poitrine, rattrape, relance. Chaque lancer doit être violent : arrête la série si la vitesse baisse.",
    }),
    ex(id(), w, {
      name: "Wall drive (montées de genoux au mur)", sets: d ? 3 : 4, reps: "8 échanges", rest: 60, charged: false,
      weightType: "poids du corps",
      note: "Mains au mur, corps incliné à 45°, un genou haut. Échange de jambes explosif (A-switch) : le genou monte, le pied d'appui frappe le sol sous la hanche. 8 échanges le plus vite possible, sans sauter.",
    }),
    ...vma,
    ex(id(), w, {
      name: "Assault bike (sprint)", sets: d ? 3 : 5, reps: "8 s", mode: "time", duration: 8, rest: 110, charged: false,
      weightType: "machine", equipment: "Assault bike", technique: "Sprints alactiques",
      note: "PUISSANCE : 8 s à fond absolu, 1 min 50 de récup complète. La récup est longue exprès : chaque sprint doit être aussi fort que le premier.",
    }),
    retourAuCalme(id()),
  ];
};

// ── Assemblage ───────────────────────────────────────────────────────────────
const SESSIONS = [
  { title: "Lundi — Bas du corps A (charnière + fessiers)", build: lundi,
    intro: "~65 min. RDL en premier, puis fente arrière sur patin et hip thrust en demi-reps pour finir les fessiers." },
  { title: "Mardi — Haut du corps + cardio", build: mardi,
    intro: "~60 min. Tractions, pompes et tirages, puis 12 à 16 min d'intervalles au SkiErg (ou rameur)." },
  { title: "Mercredi — Circuit full body (salle battle rope / chariot)", build: mercredi,
    intro: "~40 min, salle avec battle rope, chariot et rameur. Circuit AMRAP sans exercice de quadri." },
  { title: "Jeudi — Bas du corps B (fessiers + ischios)", build: jeudi,
    intro: "~65 min. Hip thrust lourd en premier, puis step-up poulie et travail ischios / fessiers." },
  { title: "Vendredi — Circuit cardio (salle SkiErg)", build: vendredi,
    intro: "~40 min, salle avec SkiErg, Assault bike et rameur. Remplaçable par un cours Body by Ciara." },
  { title: "Dimanche — VMA + explosivité", build: dimanche,
    intro: "~50 min, salle SkiErg + Assault bike. Explosivité sans impact d'abord, puis VMA et sprints courts.\n\nSi tu es dans la salle battle rope / chariot : 8 × 10 m de chariot lourd en accélération max (récup 90 s), puis 2 × 8 × 30/30 au rameur (ou 6 × 250 m, récup 1 min), puis 6 × 20 m de chariot léger et rapide." },
];

const workouts = [];
for (let w = 0; w < WEEKS; w++) {
  SESSIONS.forEach((s, i) => {
    const id = makeIdGen(`s${w + 1}d${i + 1}`);
    workouts.push(makeWorkout({
      name: `Nina · S${w + 1} · ${s.title}`,
      description: desc(w, s.intro),
      blocks: s.build(w, id),
    }));
  });
}

// Fiches médiathèque (l'import ignore celles qui existent déjà).
const fiche = (nom, categorie, positionnement, execution, respiration, vigilance) =>
  ({ nom, categorie, positionnement, execution, respiration, vigilance });

const CATALOGUE = [
  fiche("Fente arrière pied sur patin (déficit)", "Musculation avec charges",
    "Pied avant sur un step, pied arrière sur un patin (slider), un haltère dans chaque main.",
    "Glisser le pied arrière loin derrière en descendant lentement, buste penché à ~30°, puis remonter en poussant dans le talon avant.",
    "Inspirer en descendant, expirer en remontant.",
    "Dos plat, genou avant au-dessus de la cheville. Un grand pas et le buste penché orientent le travail vers les fessiers."),
  fiche("Step-up à la poulie", "Machines guidées (salle de sport)",
    "Face à la poulie basse, poignée en main, devant un step haut (hauteur du genou).",
    "Poser le pied entier sur le step, buste penché, monter en poussant dans le talon, redescendre lentement.",
    "Expirer en montant.",
    "La jambe du bas ne pousse pas. Le genou reste dans l'axe du pied."),
  fiche("RDL unilatéral haltères", "Musculation avec charges",
    "Debout sur une jambe (ou en B-stance), un haltère dans chaque main ou dans la main opposée.",
    "Pencher le buste en reculant la hanche, dos plat, jusqu'à l'étirement de l'ischio, puis remonter en poussant la hanche.",
    "Inspirer en descendant, expirer en remontant.",
    "Le bassin reste de face, il ne s'ouvre pas. Dos plat."),
  fiche("Tractions assistées", "Poids du corps",
    "Suspendue à la barre, élastique sous les genoux ou les pieds, ou sur machine d'assistance.",
    "Tirer la poitrine vers la barre en descendant les coudes, puis redescendre lentement jusqu'aux bras tendus.",
    "Expirer en tirant.",
    "Épaules basses, pas de balancement, pas de cambrure."),
  fiche("Pompes", "Poids du corps",
    "Mains un peu plus larges que les épaules, corps aligné de la tête aux talons.",
    "Descendre la poitrine au sol, coudes à ~45° du corps, puis pousser.",
    "Inspirer en descendant, expirer en poussant.",
    "Fesses serrées, le bassin ne s'affaisse pas. Mains surélevées pour faciliter, sur haltères pour le déficit."),
  fiche("Rowing inversé TRX", "Poids du corps",
    "Suspendue aux poignées du TRX ou aux anneaux, corps gainé en planche, talons au sol.",
    "Tirer la poitrine vers les poignées en serrant les omoplates, puis redescendre lentement.",
    "Expirer en tirant.",
    "Le corps reste aligné, les hanches ne tombent pas. Avancer les pieds pour durcir."),
  fiche("Développé landmine à genoux", "Musculation avec charges",
    "À genoux ou un genou au sol, extrémité de la barre (dans un landmine) à hauteur d'épaule.",
    "Pousser la barre vers l'avant et le haut d'un bras, puis revenir lentement.",
    "Expirer en poussant.",
    "Fessiers serrés, côtes basses : pas de cambrure, le buste ne tourne pas."),
  fiche("SkiErg", "Fonctionnel",
    "Debout face au SkiErg, poignées en main, bras en haut.",
    "Tirer les poignées vers le bas en pliant les hanches et les genoux, puis se redresser en remontant les bras.",
    "Expirer en tirant.",
    "Le mouvement vient des hanches, pas d'un dos arrondi."),
  fiche("Rameur", "Fonctionnel",
    "Assise, pieds sanglés, bras tendus, tibias verticaux.",
    "Pousser avec les jambes, puis ouvrir les hanches, puis tirer avec les bras ; revenir dans l'ordre inverse.",
    "Expirer en poussant.",
    "Dos plat, on ne s'arrondit pas en fin de tirage ni au retour."),
  fiche("Assault bike", "Fonctionnel",
    "Assise sur l'Assault bike, mains sur les poignées mobiles.",
    "Pousser et tirer les poignées en pédalant, à l'intensité demandée.",
    "Respiration libre.",
    "Buste droit, gainé. L'intensité se règle sur la vitesse, pas sur la résistance."),
  fiche("Poussée de chariot (sled push)", "Fonctionnel",
    "Mains sur les montants du chariot, corps penché vers l'avant, dos plat.",
    "Pousser le chariot à petits pas puissants en conduisant les genoux vers l'avant.",
    "Respiration libre.",
    "Dos plat, pas d'arrondi. Charge adaptée à la vitesse recherchée."),
  fiche("Battle rope", "Fonctionnel",
    "Debout, pieds largeur d'épaules, genoux fléchis, une extrémité de corde dans chaque main.",
    "Créer des vagues alternées (ou simultanées) le plus vite possible.",
    "Respiration libre et rapide.",
    "Buste droit et gainé, le mouvement part des épaules."),
  fiche("Soulevé de terre kettlebell", "Musculation avec charges",
    "Pieds largeur de hanches, kettlebell au sol entre les pieds.",
    "Charnière de hanche pour saisir la kettlebell, dos plat, puis se redresser en poussant les hanches.",
    "Inspirer et gainer en bas, expirer en haut.",
    "Pas de swing, pas d'arrondi du dos."),
  fiche("Farmer carry", "Fonctionnel",
    "Une charge lourde dans chaque main, bras tendus le long du corps.",
    "Marcher à pas rapides sur la distance demandée.",
    "Respiration régulière.",
    "Épaules basses, buste droit, ventre gainé."),
  fiche("Pont fessier élastique aux genoux", "Poids du corps",
    "Sur le dos, pieds à plat, mini-bande au-dessus des genoux.",
    "Monter le bassin en poussant les genoux vers l'extérieur, tenir 1 s, redescendre.",
    "Expirer en montant.",
    "Côtes basses, pas de cambrure en haut."),
  fiche("Bear plank + touches d'épaules", "Poids du corps",
    "À quatre pattes, genoux décollés de 2-3 cm, dos plat.",
    "Toucher l'épaule opposée en alternant les mains.",
    "Respiration régulière.",
    "Le bassin ne bouge pas et ne tourne pas."),
  fiche("Wall drive (montées de genoux au mur)", "Fonctionnel",
    "Mains au mur, corps incliné à ~45° et gainé, un genou monté à hauteur de hanche.",
    "Échanger les jambes de façon explosive : le genou monte, le pied d'appui frappe le sol sous la hanche.",
    "Respiration libre.",
    "Pas de saut. Le corps reste aligné de la tête au talon d'appui."),
  fiche("Poussée isométrique au mur", "Fonctionnel",
    "Position de départ de sprint, mains au mur, corps incliné et gainé, un genou haut.",
    "Pousser le mur à intensité maximale avec la jambe d'appui pendant 6 s.",
    "Expiration bloquée courte puis soufflée.",
    "Corps aligné, pas de cambrure. Intensité maximale mais sans à-coup."),
  fiche("Lancer de med ball poitrine contre le mur", "Fonctionnel",
    "Debout face au mur à 1-2 m, med ball contre la poitrine, pieds fixes.",
    "Lancer la balle le plus fort possible contre le mur, rattraper, relancer.",
    "Expirer fort à chaque lancer.",
    "Gainage, pas de rotation du buste. Arrêter la série si la vitesse baisse."),
  fiche("Curl-up McGill", "Poids du corps",
    "Sur le dos, une jambe pliée, l'autre tendue, mains sous les lombaires.",
    "Décoller la tête et les épaules de quelques centimètres, tenir 10 s.",
    "Respiration courte et régulière pendant la tenue.",
    "La nuque ne se plie pas, le bas du dos garde sa courbure naturelle."),
  fiche("Pompes scapulaires", "Échauffement & Mobilité",
    "En planche haute, bras tendus.",
    "Rapprocher puis écarter les omoplates sans plier les coudes.",
    "Respiration régulière.",
    "Corps gainé, les bras restent tendus."),
  fiche("Presse à cuisses pieds larges (optionnel)", "Machines guidées (salle de sport)",
    "Assise sur la presse, pieds très écartés et hauts sur la plateforme.",
    "Descendre tant que le bassin reste collé au dossier, puis pousser dans les talons.",
    "Expirer en poussant.",
    "Le bassin ne décolle jamais. Pas de verrouillage des genoux en haut."),
];

const program = {
  version: 1,
  program_name: "Nina — Sèche fessiers & cardio (Bloc 1, S1 à S4)",
  client: "Nina",
  assign: true,
  archive_existing_named: false,
  catalogue_category_default: "Musculation avec charges",
  catalogue: CATALOGUE,
  workouts,
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(program, null, 1));
console.log(`✓ ${OUT} — ${workouts.length} séances`);
