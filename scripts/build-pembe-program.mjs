#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════════
// build-pembe-program.mjs
//
// Génère programs/pembe/bloc1-renfo-dos-fessiers.json : programme de Pembe —
// débutante complète, lombalgie non diagnostiquée, métier physique. Objectifs :
// perte de gras + fessiers / cuisses, renforcement du dos. Basic-Fit.
// 4 semaines × (4 séances + 1 optionnelle), séances de ~40 min.
//
//   node scripts/build-pembe-program.mjs
//
// Pas de RPE ni de tempo affichés (notions inconnues de la cliente) : l'intensité
// est donnée en clair dans chaque `note` (« il doit te rester X répétitions »).
// Chaque exercice a un GIF dans `photo` : ExerciseDB (CDN) ou, à défaut, un GIF
// généré depuis free-exercise-db (domaine public) et servi depuis ce repo.
// ══════════════════════════════════════════════════════════════════════════════

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { exBlock, circuitBlock, warmupBlock, makeWorkout, makeIdGen } from "./lib/programBlocks.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../programs/pembe/bloc1-renfo-dos-fessiers.json");
const WEEKS = 4;

// ── GIFs ─────────────────────────────────────────────────────────────────────
const edb = (id) => `https://static.exercisedb.dev/media/${id}.gif`;
const repo = (f) => `https://raw.githubusercontent.com/mallardnina16-cloud/Processlab/main/public/exercise-gifs/${f}.gif`;

const GIF = {
  "Cat-cow": repo("cat-cow"),
  "Cercles de hanches à quatre pattes": repo("cercles-hanches-quatre-pattes"),
  "Hip thrust barre": repo("hip-thrust"),
  "Rotation des genoux allongée (essuie-glace)": edb("6sYyrRX"),
  "World's greatest stretch": edb("DFGXwZr"),
  "Hip thrust au sol (glute bridge)": edb("u0cNiij"),
  "Pont fessier tenu (isométrie)": edb("u0cNiij"),
  "Marche latérale élastique (band walk)": edb("O95afRA"),
  "Band pull-apart": edb("sTfvVsG"),
  "Gainage sur les genoux + touches d'épaules": edb("h1ezqSu"),
  "Soulevé de terre roumain sur steps (amplitude réduite)": edb("rR0LJzx"),
  "Fente arrière aux haltères": edb("SSsBDwB"),
  "Fentes arrière alternées (poids du corps)": edb("SSsBDwB"),
  "Leg curl assis": edb("Zg3XY7P"),
  "Abduction à la machine (buste penché)": edb("CHpahtl"),
  "Tirage vertical à la poulie (prise large)": edb("eYnzaCm"),
  "Rowing assis à la machine": edb("7I6LNUG"),
  "Rowing haltère 1 bras": edb("C0MA9bC"),
  "Chest press à la machine": edb("DOoWcnA"),
  "Développé épaules à la machine": edb("dNFYIU1"),
  "Face pull": edb("ZfyAGhK"),
  "Presse à cuisses": edb("10Z2DXU"),
  "Squat gobelet (goblet squat)": edb("yn8yg1r"),
  "Squat gobelet tenu (isométrie)": edb("yn8yg1r"),
  "Step-up": edb("aXtJhlg"),
  "Step-in rapide": edb("aXtJhlg"),
  "Cable kickback (extension de hanche à la poulie)": edb("Kpajagk"),
  "Extension du dos à 45° (biais fessier)": edb("zhMwOwE"),
  "Extension du dos à 45° tenue (isométrie)": edb("zhMwOwE"),
  "Pompes inclinées (mains sur banc)": edb("B1EVP9F"),
  "Tirage horizontal poulie basse": edb("fUBheHs"),
  "Dead bug": edb("iny3m5y"),
  "Pallof press": edb("9pa4H5m"),
  "Planche latérale (side plank)": edb("RKjH6Lt"),
  "Pull-through à la poulie": edb("OM46QHm"),
};

const gif = (name) => {
  if (!GIF[name]) throw new Error(`GIF manquant pour "${name}"`);
  return GIF[name];
};

// ── Intensité en langage clair ───────────────────────────────────────────────
// Cible finale de chaque exercice : L (léger) / M (moyen) / H (lourd).
// S1–S2 : tout en léger (apprentissage). S3 : plafonné à moyen. S4 : cible.
const CHARGE = {
  L: "Charge LÉGÈRE : choisis un poids avec lequel tu pourrais encore faire 4 ou 5 répétitions de plus. C'est confortable, tu te concentres sur le bon geste.",
  M: "Charge MOYENNE : à la fin de la série, il doit te rester 3 répétitions possibles, pas plus. Les dernières sont difficiles mais ton geste reste parfait.",
  H: "Charge LOURDE : à la fin de la série, tu ne pourrais en faire qu'1 ou 2 de plus. C'est vraiment dur, mais ton dos ne bouge pas et le geste reste propre.",
};
const level = (target, w) => (w < 2 ? "L" : w === 2 && target === "H" ? "M" : target);
const withCharge = (note, target, w) => `${CHARGE[level(target, w)]}\n\n${note}`;

// ── Blocs avec GIF ───────────────────────────────────────────────────────────
const ex = (id, w, { target, note, ...o }) => ({
  ...exBlock(id, { ...o, note: target ? withCharge(note, target, w) : note }),
  photo: gif(o.name),
});

const circuit = (id, opts, idGen) => {
  const b = circuitBlock(id, opts, idGen);
  b.exercises = b.exercises.map((e) => ({ ...e, photo: gif(e.name) }));
  return b;
};

const warmup = (id, list, idGen) => {
  const b = warmupBlock(id, list, idGen);
  b.exercises = b.exercises.map((e) => ({ ...e, photo: gif(e.name) }));
  return b;
};

// ── Échauffements ────────────────────────────────────────────────────────────
const WARMUP_BAS = [
  { name: "Cat-cow", reps: "10 lentes", note: "À quatre pattes : arrondis le dos en soufflant, puis creuse doucement en inspirant. Lentement, sans forcer." },
  { name: "Cercles de hanches à quatre pattes", reps: "8 / sens / jambe", note: "Genou plié, dessine de grands cercles avec le genou. Le dos ne bouge pas, le ventre est rentré." },
  { name: "Rotation des genoux allongée (essuie-glace)", reps: "8 / côté", note: "Sur le dos, genoux pliés, épaules au sol. Laisse tomber les genoux d'un côté puis de l'autre, doucement, sans douleur." },
  { name: "World's greatest stretch", reps: "5 / côté", note: "Grande fente, main au sol, puis tourne le buste et lève le bras vers le plafond. Ouvre les hanches et le haut du dos." },
  { name: "Hip thrust au sol (glute bridge)", reps: "15", note: "Monte le bassin en serrant les fesses 1 seconde en haut. Le bas du dos ne se creuse pas." },
  { name: "Marche latérale élastique (band walk)", reps: "2 × 10 pas / côté", note: "Élastique au-dessus des genoux, légèrement accroupie, petits pas. Tu dois sentir le côté des fesses chauffer." },
];

const WARMUP_HAUT = [
  { name: "Cat-cow", reps: "10 lentes", note: "À quatre pattes : arrondis le dos en soufflant, puis creuse doucement en inspirant." },
  { name: "Rotation des genoux allongée (essuie-glace)", reps: "8 / côté", note: "Sur le dos, épaules au sol, genoux pliés qui basculent doucement d'un côté puis de l'autre." },
  { name: "Cercles de hanches à quatre pattes", reps: "8 / sens / jambe", note: "Grands cercles avec le genou, le dos reste immobile." },
  { name: "Band pull-apart", reps: "2 × 15", note: "Élastique tendu devant la poitrine, bras tendus : écarte-le en rapprochant les omoplates. Épaules basses." },
  { name: "Hip thrust au sol (glute bridge)", reps: "15", note: "Réveille les fessiers : ils protègent ton bas du dos pendant les tirages." },
  { name: "Gainage sur les genoux + touches d'épaules", reps: "2 × 8 / côté", note: "Position de pompe sur les genoux. Touche l'épaule opposée sans que le bassin bouge." },
];

const WARMUP_D = [
  { name: "Cat-cow", reps: "10 lentes", note: "Lentement, sans forcer." },
  { name: "World's greatest stretch", reps: "5 / côté", note: "Ouvre les hanches et le haut du dos." },
  { name: "Cercles de hanches à quatre pattes", reps: "6 / sens / jambe", note: "Grands cercles, dos immobile." },
];

// ── Textes de séance ─────────────────────────────────────────────────────────
const PHASE = [
  "Semaine 1/4 — Découverte. Tout se fait en charge LÉGÈRE : tu apprends les mouvements et tu trouves tes poids. Note le poids utilisé sur chaque exercice, ce sera ta base.",
  "Semaine 2/4 — Apprentissage. Toujours en charge LÉGÈRE, mais essaie de monter un peu tes poids par rapport à la semaine 1 si le geste est propre.",
  "Semaine 3/4 — On commence à charger. Suis la consigne de charge de chaque exercice (légère ou moyenne). C'est normal que ce soit plus dur.",
  "Semaine 4/4 — Semaine pleine. Certains exercices passent en charge LOURDE : il ne doit te rester qu'1 ou 2 répétitions en fin de série.",
];

const REGLES = [
  "Comment choisir ton poids : la consigne « Charge » de chaque exercice te dit combien de répétitions il doit te RESTER en fin de série. Si la dernière série te paraît plus facile que ça, augmente un peu le poids la prochaine fois.",
  "Dos : si une douleur dans le dos dépasse 3/10 ou descend dans la jambe, arrête l'exercice, ne force pas, et mets un commentaire. Une sensation de muscle qui travaille est normale, une douleur pointue ne l'est pas.",
  "Jours sans salle : 30 min de tapis de marche, inclinaison 6 à 10 %, vitesse 4,5 à 5,5 km/h. Tu dois pouvoir parler en marchant.",
].join("\n\n");

const desc = (w, intro) => [PHASE[w], intro, REGLES].join("\n\n");

// ══════════════════════════════════════════════════════════════════════════════
// SÉANCE 1 — Fessiers & ischios
// ══════════════════════════════════════════════════════════════════════════════
const s1 = (w, id) => [
  warmup(id(), WARMUP_BAS, id),
  ex(id(), w, {
    name: "Hip thrust barre", sets: 3, reps: "12", rest: 120, weightType: "barre", target: "H",
    note: "À la machine hip thrust si ton club en a une, sinon à la barre guidée avec la mousse sur la barre. Haut du dos sur le banc, pieds à plat. Pousse dans les talons, serre fort les fesses 1 seconde en haut. Menton rentré : tu regardes devant toi, pas le plafond. Le bas du dos ne se creuse pas.",
  }),
  ex(id(), w, {
    name: "Soulevé de terre roumain sur steps (amplitude réduite)", sets: 3, reps: "12", rest: 90, weightType: "haltères", target: "M",
    note: "Place 2 steps (avec 1 ou 2 réhausseurs) de chaque côté de tes pieds et pose les haltères dessus : tu commences et tu termines chaque répétition haltères posées sur les steps. Comme ça, tu ne descends jamais trop bas et tu ne ramasses pas les poids au sol.\n\nGenoux légèrement fléchis, dos plat. Pousse les fesses en arrière comme pour fermer une porte avec les fesses, les haltères glissent le long des cuisses jusqu'à toucher les steps. Remonte en serrant les fesses. Tu dois sentir l'arrière des cuisses s'étirer, jamais le bas du dos.",
  }),
  ex(id(), w, {
    name: "Fente arrière aux haltères", sets: 3, reps: "10 / jambe", rest: 90, weightType: "haltères", target: "M",
    note: "Grand pas en arrière, buste légèrement penché vers l'avant pour faire travailler la fesse. Descends doucement en comptant 2 secondes, puis pousse dans le talon de la jambe avant. Fais toutes les répétitions d'une jambe, puis l'autre.",
  }),
  ex(id(), w, {
    name: "Leg curl assis", sets: 3, reps: "12", rest: 60, weightType: "machine", target: "M",
    note: "Plie les jambes, puis remonte lentement en comptant 3 secondes : c'est la remontée lente qui fait travailler l'arrière des cuisses.",
  }),
  ex(id(), w, {
    name: "Abduction à la machine (buste penché)", sets: 3, reps: "15", rest: 60, weightType: "machine", target: "H",
    note: "Penche le buste vers l'avant, mains sur les poignées. Écarte les jambes et tiens 1 seconde ouverte. Tu dois sentir une brûlure sur le côté des fesses en fin de série.",
  }),
];

// ══════════════════════════════════════════════════════════════════════════════
// SÉANCE 2 — Haut du corps, accent dos
// ══════════════════════════════════════════════════════════════════════════════
const s2 = (w, id) => [
  warmup(id(), WARMUP_HAUT, id),
  ex(id(), w, {
    name: "Tirage vertical à la poulie (prise large)", sets: 3, reps: "12", rest: 90, weightType: "machine", target: "M",
    note: "Mains un peu plus larges que les épaules. Tire la barre vers le haut de ta poitrine en pensant à envoyer les coudes vers tes poches. Ne te penche pas en arrière et ne tire pas avec les bras : c'est le dos qui travaille.",
  }),
  ex(id(), w, {
    name: "Rowing assis à la machine", sets: 3, reps: "12", rest: 90, weightType: "machine", target: "H",
    note: "Poitrine contre le support. Tire les poignées vers ton ventre et serre les omoplates 1 seconde, comme pour coincer un crayon entre elles. Relâche doucement.",
  }),
  ex(id(), w, {
    name: "Rowing haltère 1 bras", sets: 3, reps: "10 / bras", rest: 60, weightType: "haltères", target: "M",
    note: "Un genou et une main sur le banc, le dos plat comme une table. Tire l'haltère vers ta hanche, coude près du corps. Le buste ne tourne pas.",
  }),
  ex(id(), w, {
    name: "Chest press à la machine", sets: 3, reps: "12", rest: 90, weightType: "machine", target: "M",
    note: "Dos bien collé au dossier, épaules basses (loin des oreilles). Pousse devant toi sans verrouiller les coudes, reviens lentement.",
  }),
  ex(id(), w, {
    name: "Développé épaules à la machine", sets: 2, reps: "12", rest: 90, weightType: "machine", target: "L",
    note: "Dos collé au dossier : ne cambre pas pour pousser. Monte sans bloquer les coudes, redescends jusqu'au menton.",
  }),
  ex(id(), w, {
    name: "Face pull", sets: 3, reps: "15", rest: 60, weightType: "machine", target: "L",
    note: "Poulie à hauteur du visage, corde. Tire la corde vers ton front en écartant les mains. Excellent pour la posture : pas besoin de lourd, cherche la sensation entre les omoplates.",
  }),
];

// ══════════════════════════════════════════════════════════════════════════════
// SÉANCE 3 — Cuisses, fessiers & lombaires
// ══════════════════════════════════════════════════════════════════════════════
const s3 = (w, id) => [
  warmup(id(), WARMUP_BAS, id),
  ex(id(), w, {
    name: "Presse à cuisses", sets: 3, reps: "12", rest: 120, weightType: "machine", target: "H",
    note: "Pieds hauts et un peu écartés sur la plateforme : ça fait travailler les fesses. Descends tant que ton bas du dos reste collé au dossier — s'il décolle, tu es descendue trop bas. Ne verrouille pas les genoux en haut.",
  }),
  ex(id(), w, {
    name: "Squat gobelet (goblet squat)", sets: 3, reps: "10", rest: 90, weightType: "haltères", target: "M",
    note: "Haltère tenu contre la poitrine. Descends en comptant 3 secondes, poitrine fière, genoux dans l'axe des pieds. Descends seulement jusqu'où ton dos reste droit.",
  }),
  ex(id(), w, {
    name: "Step-up", sets: 3, reps: "10 / jambe", rest: 90, weightType: "haltères", target: "M",
    note: "Pied entier sur le banc ou le step. Monte en poussant uniquement avec la jambe posée dessus, sans t'aider de celle du bas. Redescends doucement.",
  }),
  ex(id(), w, {
    name: "Cable kickback (extension de hanche à la poulie)", sets: 3, reps: "12 / jambe", rest: 45, weightType: "machine", target: "H",
    note: "Sangle à la cheville, mains sur la machine, buste légèrement penché. Pousse la jambe en arrière en serrant la fesse. Ne cambre pas : si le bas du dos se creuse, tu vas trop loin.",
  }),
  ex(id(), w, {
    name: "Extension du dos à 45° (biais fessier)", sets: 3, reps: "12", rest: 60, weightType: "poids du corps", target: "L",
    note: "Sans poids. Le bord du coussin juste sous les hanches. Descends lentement en arrondissant un peu le haut du dos, puis remonte en serrant les fesses jusqu'à ce que ton corps soit aligné — jamais plus haut. Mouvement lent, aucune douleur. C'est cet exercice qui renforce ton bas du dos.",
  }),
];

// ══════════════════════════════════════════════════════════════════════════════
// SÉANCE 4 — Circuit renfo-cardio + isométrie + gainage profond & dos
// ══════════════════════════════════════════════════════════════════════════════
const s4 = (w, id) => [
  warmup(id(), WARMUP_D, id),
  circuit(id(), {
    rounds: 3, restBetweenRounds: 90, intervalMode: true,
    exercises: [
      { name: "Squat gobelet (goblet squat)", reps: "40 s", mode: "time", duration: 40, workTime: 40, restTime: 20, weightType: "haltères",
        note: "PARTIE 1 — CIRCUIT. 40 secondes d'effort, 20 secondes pour passer à l'exercice suivant, 1 min 30 de repos après chaque tour. Le 1er tour se fait doucement : c'est ton échauffement.\n\nHaltère léger contre la poitrine, rythme régulier. Tu dois être essoufflée mais pas à bout." },
      { name: "Pompes inclinées (mains sur banc)", reps: "40 s", mode: "time", duration: 40, workTime: 40, restTime: 20, weightType: "poids du corps",
        note: "Mains sur un banc, corps droit comme une planche. Si c'est trop dur, prends un support plus haut." },
      { name: "Fentes arrière alternées (poids du corps)", reps: "40 s", mode: "time", duration: 40, workTime: 40, restTime: 20, weightType: "poids du corps",
        note: "Sans poids, une jambe puis l'autre. Le genou arrière descend près du sol sans le toucher." },
      { name: "Tirage horizontal poulie basse", reps: "40 s", mode: "time", duration: 40, workTime: 40, restTime: 20, weightType: "machine",
        note: "Poids léger. Dos droit, tire vers le ventre en serrant les omoplates." },
      { name: "Step-in rapide", reps: "40 s", mode: "time", duration: 40, workTime: 40, restTime: 20, weightType: "poids du corps",
        note: "Montées rapides sur un step bas, un pied puis l'autre. Pose bien tout le pied. C'est la partie cardio : accélère !" },
    ],
  }, id),
  circuit(id(), {
    rounds: 3, restBetweenRounds: 60, intervalMode: true,
    exercises: [
      { name: "Squat gobelet tenu (isométrie)", reps: "30 s", mode: "time", duration: 30, workTime: 30, restTime: 30, weightType: "poids du corps",
        note: "PARTIE 2 — ISOMÉTRIE. On tient une position sans bouger. 3 tours, 30 s de pause entre chaque exercice.\n\nDescends en squat (cuisses le plus près possible de l'horizontale) et reste immobile 30 secondes. Poitrine fière, respire normalement. Les cuisses brûlent : c'est normal." },
      { name: "Pont fessier tenu (isométrie)", reps: "30 s", mode: "time", duration: 30, workTime: 30, restTime: 30, weightType: "poids du corps",
        note: "Sur le dos, bassin levé, fesses serrées au maximum pendant 30 secondes. Le bas du dos ne se creuse pas." },
      { name: "Extension du dos à 45° tenue (isométrie)", reps: "20 s", mode: "time", duration: 20, workTime: 20, restTime: 30, weightType: "poids du corps",
        note: "Au banc à 45°, monte jusqu'à ce que ton corps soit aligné et reste immobile 20 secondes, fesses serrées. Ne monte jamais plus haut que l'alignement." },
    ],
  }, id),
  circuit(id(), {
    rounds: 2, restBetweenRounds: 60, intervalMode: false,
    exercises: [
      { name: "Dead bug", reps: "8 / côté", weightType: "poids du corps",
        note: "GAINAGE PROFOND ET DOS. 2 tours, enchaîne les 4 exercices puis 1 min de pause.\n\nSur le dos, bras vers le plafond, genoux à 90°. Tends un bras et la jambe opposée en soufflant longuement. Le bas du dos reste plaqué au sol tout le temps : si il décolle, réduis l'amplitude." },
      { name: "Gainage sur les genoux + touches d'épaules", reps: "10 / côté", weightType: "poids du corps",
        note: "Position de pompe sur les genoux, mains sous les épaules. Touche l'épaule opposée en alternant, lentement. Le bassin ne doit pas bouger : imagine un verre d'eau posé sur ton dos." },
      { name: "Pallof press", reps: "10 / côté", weightType: "machine",
        note: "À la poulie réglée à hauteur de poitrine, de profil par rapport à la machine. Pousse la poignée droit devant toi et ramène-la, sans que ton buste tourne : tu résistes à la poulie. Ventre serré." },
      { name: "Planche latérale (side plank)", reps: "20 à 30 s / côté", mode: "time", duration: 25, weightType: "poids du corps",
        note: "Sur l'avant-bras, genoux au sol au début si c'est trop dur. Le corps forme une ligne droite, hanches hautes." },
    ],
  }, id),
];

// ══════════════════════════════════════════════════════════════════════════════
// SÉANCE 5 (optionnelle) — Fessiers express
// ══════════════════════════════════════════════════════════════════════════════
const s5 = (w, id) => [
  warmup(id(), WARMUP_BAS, id),
  ex(id(), w, {
    name: "Hip thrust barre", sets: 3, reps: "15", rest: 90, weightType: "barre", target: "M",
    note: "Plus léger qu'en séance 1, mais tiens 2 secondes en haut en serrant fort les fesses à chaque répétition. Menton rentré, bas du dos neutre.",
  }),
  ex(id(), w, {
    name: "Pull-through à la poulie", sets: 3, reps: "12", rest: 60, weightType: "machine", target: "M",
    note: "Dos à la poulie basse, corde entre les jambes. Pousse les fesses en arrière, dos plat, puis redresse-toi en serrant les fesses. C'est le même geste que le soulevé de terre roumain, en plus doux pour le dos.",
  }),
  ex(id(), w, {
    name: "Abduction à la machine (buste penché)", sets: 3, reps: "20", rest: 45, weightType: "machine", target: "H",
    note: "Buste penché, écarte et tiens 1 seconde. Va jusqu'à la brûlure.",
  }),
  ex(id(), w, {
    name: "Fentes arrière alternées (poids du corps)", sets: 2, reps: "12 / jambe", rest: 60, weightType: "poids du corps",
    note: "Sans poids, lentement : descends en 2 secondes, buste légèrement penché vers l'avant.",
  }),
];

// ── Assemblage ───────────────────────────────────────────────────────────────
const SESSIONS = [
  { title: "Séance 1 — Fessiers & ischios", build: s1,
    intro: "Durée : ~40 min. Séance prioritaire pour les fessiers et l'arrière des cuisses. Repos entre les séries : respecte le temps indiqué." },
  { title: "Séance 2 — Haut du corps, accent dos", build: s2,
    intro: "Durée : ~40 min. Un dos fort te protège au travail : on insiste sur les tirages. Les épaules restent basses sur tous les exercices." },
  { title: "Séance 3 — Cuisses, fessiers & lombaires", build: s3,
    intro: "Durée : ~40 min. Cuisses et fessiers, puis on termine par le renforcement du bas du dos." },
  { title: "Séance 4 — Circuit + gainage profond & dos", build: s4,
    intro: "Durée : ~40 min. Partie 1 : circuit renfo-cardio avec timer. Partie 2 : isométrie (positions tenues), puis gainage profond et dos. Pas besoin de charges lourdes aujourd'hui." },
  { title: "Séance 5 (optionnelle) — Fessiers express", build: s5,
    intro: "Durée : ~30 min. À faire seulement les semaines où tu vas 5 fois à la salle. Si tu es fatiguée ou que ton dos tire, remplace-la par 30 min de tapis." },
];

const workouts = [];
for (let w = 0; w < WEEKS; w++) {
  SESSIONS.forEach((s, i) => {
    const id = makeIdGen(`s${w + 1}d${i + 1}`);
    workouts.push(makeWorkout({
      name: `Pembe · S${w + 1} · ${s.title}`,
      description: desc(w, s.intro),
      blocks: s.build(w, id),
    }));
  });
}

// Fiches médiathèque des exercices absents des programmes précédents
// (l'import ignore celles qui existent déjà).
const CATALOGUE = [
  { nom: "Cercles de hanches à quatre pattes", categorie: "Échauffement & Mobilité",
    positionnement: "À quatre pattes, mains sous les épaules, genoux sous les hanches, dos plat, ventre légèrement rentré.",
    execution: "Lever un genou plié et dessiner de grands cercles avec le genou, vers l'avant puis vers l'arrière, en gardant le bassin et le dos immobiles.",
    respiration: "Respiration lente et régulière.",
    vigilance: "Le dos ne se creuse pas et ne tourne pas. Amplitude confortable, sans douleur à la hanche." },
  { nom: "Rotation des genoux allongée (essuie-glace)", categorie: "Échauffement & Mobilité",
    positionnement: "Allongée sur le dos, genoux pliés, pieds au sol, bras écartés en croix.",
    execution: "Laisser basculer les deux genoux d'un côté puis de l'autre, lentement, en gardant les épaules au sol.",
    respiration: "Expiration pendant la descente des genoux, inspiration au retour au centre.",
    vigilance: "Amplitude sans douleur dans le bas du dos. Mouvement lent, on ne lance pas les jambes." },
  { nom: "World's greatest stretch", categorie: "Échauffement & Mobilité",
    positionnement: "Grande fente avant, mains au sol à l'intérieur du pied avant, jambe arrière tendue.",
    execution: "Rapprocher le coude du pied avant, puis tourner le buste et lever le bras vers le plafond en suivant la main du regard. Revenir et changer de côté.",
    respiration: "Expiration pendant la rotation du buste.",
    vigilance: "La rotation vient du haut du dos. Ne pas forcer l'étirement de la hanche." },
  { nom: "Gainage sur les genoux + touches d'épaules", categorie: "Gainage",
    positionnement: "Position de pompe en appui sur les genoux, mains sous les épaules, corps aligné des genoux à la tête.",
    execution: "Lever une main pour toucher l'épaule opposée, la reposer, alterner, lentement.",
    respiration: "Respiration régulière, ventre engagé.",
    vigilance: "Le bassin ne bascule pas d'un côté à l'autre. Écarter les genoux pour plus de stabilité si besoin." },
  { nom: "Soulevé de terre roumain sur steps (amplitude réduite)", categorie: "Musculation avec charges",
    positionnement: "Debout entre deux steps réhaussés placés de chaque côté des pieds, haltères posés sur les steps. Pieds largeur de hanches, genoux légèrement fléchis.",
    execution: "Saisir les haltères sur les steps, se redresser, puis pousser les fesses en arrière, dos plat, jusqu'à reposer les haltères sur les steps. Remonter en serrant les fesses.",
    respiration: "Inspirer et gainer avant la descente, expirer en remontant.",
    vigilance: "La hauteur des steps limite l'amplitude pour protéger le bas du dos : ne jamais arrondir le dos pour aller plus bas. Les haltères restent près des jambes." },
  { nom: "Fente arrière aux haltères", categorie: "Musculation avec charges",
    positionnement: "Debout, un haltère dans chaque main, bras le long du corps, pieds largeur de hanches.",
    execution: "Faire un grand pas en arrière, descendre jusqu'à ce que le genou arrière frôle le sol, buste légèrement penché vers l'avant, puis revenir en poussant dans le talon avant.",
    respiration: "Inspirer en descendant, expirer en remontant.",
    vigilance: "Le genou avant reste dans l'axe du pied. Garder le dos droit." },
  { nom: "Fentes arrière alternées (poids du corps)", categorie: "Fonctionnel",
    positionnement: "Debout, mains sur les hanches, pieds largeur de hanches.",
    execution: "Reculer une jambe, descendre, revenir, puis changer de jambe en alternant.",
    respiration: "Respiration régulière sur le rythme.",
    vigilance: "Le genou avant reste dans l'axe du pied, le buste reste stable." },
  { nom: "Tirage vertical à la poulie (prise large)", categorie: "Musculation avec charges",
    positionnement: "Assise, cuisses calées sous les boudins, mains sur la barre un peu plus larges que les épaules.",
    execution: "Tirer la barre vers le haut de la poitrine en abaissant les coudes vers les côtes, puis remonter lentement.",
    respiration: "Expirer en tirant, inspirer en remontant.",
    vigilance: "Ne pas se pencher en arrière ni tirer derrière la nuque. Épaules basses." },
  { nom: "Rowing assis à la machine", categorie: "Musculation avec charges",
    positionnement: "Assise, poitrine contre le support, poignées saisies bras tendus.",
    execution: "Tirer les poignées vers le ventre en serrant les omoplates, tenir 1 s, relâcher lentement.",
    respiration: "Expirer en tirant, inspirer au retour.",
    vigilance: "Ne pas hausser les épaules ni se décoller du support." },
  { nom: "Chest press à la machine", categorie: "Musculation avec charges",
    positionnement: "Assise, dos collé au dossier, poignées à hauteur de poitrine.",
    execution: "Pousser les poignées devant soi sans verrouiller les coudes, revenir lentement.",
    respiration: "Expirer en poussant, inspirer au retour.",
    vigilance: "Épaules basses et collées au dossier." },
  { nom: "Développé épaules à la machine", categorie: "Musculation avec charges",
    positionnement: "Assise, dos collé au dossier, poignées à hauteur d'épaules.",
    execution: "Pousser vers le haut sans verrouiller les coudes, redescendre jusqu'à hauteur du menton.",
    respiration: "Expirer en poussant, inspirer en descendant.",
    vigilance: "Ne pas cambrer le bas du dos pour pousser." },
  { nom: "Squat gobelet tenu (isométrie)", categorie: "Gainage",
    positionnement: "Debout, pieds un peu plus larges que les hanches, mains jointes ou haltère léger contre la poitrine.",
    execution: "Descendre en squat et tenir la position immobile pendant la durée indiquée.",
    respiration: "Respirer normalement, ne pas bloquer la respiration.",
    vigilance: "Genoux dans l'axe des pieds, poitrine haute, dos droit." },
  { nom: "Pont fessier tenu (isométrie)", categorie: "Gainage",
    positionnement: "Allongée sur le dos, genoux pliés, pieds à plat près des fesses.",
    execution: "Monter le bassin et tenir la position haute en serrant les fessiers pendant la durée indiquée.",
    respiration: "Respiration régulière.",
    vigilance: "Le bas du dos ne se creuse pas : on monte jusqu'à l'alignement genoux-hanches-épaules." },
  { nom: "Extension du dos à 45° tenue (isométrie)", categorie: "Gainage",
    positionnement: "Sur le banc à 45°, le bord du coussin sous les hanches, bras croisés sur la poitrine.",
    execution: "Monter jusqu'à l'alignement du corps et tenir immobile pendant la durée indiquée.",
    respiration: "Respiration régulière.",
    vigilance: "Ne jamais dépasser l'alignement (pas d'hyperextension). Fessiers serrés." },
];

const program = {
  version: 1,
  program_name: "Pembe — Renfo dos & fessiers (Bloc 1, S1 à S4)",
  client: "Pembe",
  assign: true,
  archive_existing_named: false,
  catalogue_category_default: "Musculation avec charges",
  catalogue: CATALOGUE,
  workouts,
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(program, null, 1));
console.log(`✓ ${OUT} — ${workouts.length} séances`);
