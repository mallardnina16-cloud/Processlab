#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════════
// build-auriane-program.mjs
//
// Génère programs/auriane/bloc1-full-body-decouverte.json : programme d'Auriane —
// 39 ans, 1,65 m, 64,7 kg, débutante en musculation mais active (11 000 pas/j,
// 1 h de footing/sem). Objectif : −5 kg en conservant/construisant du muscle
// (~1600 kcal, P 120 g). 4 semaines × (2 séances full body coachées au studio
// + 1 séance maison optionnelle).
//
//   node scripts/build-auriane-program.mjs
//
// Matériel du studio : rack mural, haltères 4 → 12,5 kg, barre 10 kg + disques,
// box, plateforme HIIT adidas (banc/step), poids de chevilles, mini-bands,
// gros ballon, sac de frappe, steps.
//
// Comme pour Pembe : pas de RPE ni de tempo affichés, l'intensité est donnée en
// clair dans chaque `note`. Chaque exercice a un GIF dans `photo` (ExerciseDB ou
// GIF généré depuis free-exercise-db et servi depuis ce repo).
// ══════════════════════════════════════════════════════════════════════════════

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { exBlock, circuitBlock, warmupBlock, makeWorkout, makeIdGen } from "./lib/programBlocks.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../programs/auriane/bloc1-full-body-decouverte.json");
const WEEKS = 4;

// ── GIFs ─────────────────────────────────────────────────────────────────────
const edb = (id) => `https://static.exercisedb.dev/media/${id}.gif`;
const repo = (f) => `https://raw.githubusercontent.com/mallardnina16-cloud/Processlab/main/public/exercise-gifs/${f}.gif`;

const GIF = {
  // Échauffements
  "Sac de frappe (échauffement)": edb("hoXt6wv"),
  "Cat-cow": repo("cat-cow"),
  "Ouverture thoracique à quatre pattes": null,
  "Marche latérale élastique (band walk)": edb("O95afRA"),
  "Monster walk": edb("O95afRA"),
  "Squat au poids du corps": repo("squat-poids-du-corps"),
  "Charnière de hanche (poids du corps)": edb("rR0LJzx"),
  "World's greatest stretch": edb("DFGXwZr"),
  "Hip thrust au sol (glute bridge)": edb("u0cNiij"),
  "Wall slides": null,
  "Pompes inclinées (mains sur la box)": edb("B1EVP9F"),
  // Séance A
  "Squat gobelet (goblet squat)": edb("yn8yg1r"),
  "Soulevé de terre barre surélevée": edb("ila4NZS"),
  "Développé couché haltères": edb("SpYC0Kp"),
  "Rowing haltère 1 bras": edb("C0MA9bC"),
  "Step-up": edb("aXtJhlg"),
  "Dead bug": edb("iny3m5y"),
  "Abduction allongée sur le côté (poids de chevilles)": edb("7WaDzyL"),
  // Séance B
  "Hip thrust barre": repo("hip-thrust"),
  "Split squat statique aux haltères": edb("9E25EOx"),
  "Développé épaules haltères debout": edb("A6wtbuL"),
  "Pompes inclinées (mains sur banc)": edb("B1EVP9F"),
  "Pull-over haltère allongée": edb("9XjtHvS"),
  "Leg curl sur gros ballon": repo("ball-leg-curl"),
  "Marche du serveur à une main (suitcase carry)": edb("qPEzJjA"),
  "Superman alterné": repo("superman"),
  "Superman": repo("superman"),
  // Séance maison
  "Squat sumo": repo("squat-sumo"),
  "Pompes inclinées (mains sur une table)": edb("B1EVP9F"),
  "Fentes arrière alternées (poids du corps)": edb("SSsBDwB"),
  "Gainage / planche (plank)": repo("planche"),
};

const gif = (name) => {
  if (!(name in GIF)) throw new Error(`GIF manquant pour "${name}"`);
  return GIF[name];
};

// ── Intensité en langage clair ───────────────────────────────────────────────
// S1–S2 : apprentissage, 3 répétitions en réserve. S3–S4 : 2 en réserve.
const CHARGE = [
  "Charge : à la fin de chaque série, il doit te rester environ 3 répétitions possibles. On apprend le geste, il doit rester parfait.",
  "Charge : à la fin de chaque série, il doit te rester environ 3 répétitions possibles. Si c'était trop facile la semaine dernière, monte un peu le poids.",
  "Charge : à la fin de chaque série, il ne doit te rester que 2 répétitions possibles. Les dernières répétitions sont dures, mais le geste reste propre.",
  "Charge : à la fin de chaque série, il ne doit te rester que 2 répétitions possibles. Essaie de battre tes poids ou tes répétitions de la semaine 3.",
];
const withCharge = (note, w) => `${CHARGE[w]}\n\n${note}`;

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

// pick(valeurParSemaine) : tableau de 4 → valeur de la semaine w
const P = (...v) => (w) => v[w];

// ── Échauffements ────────────────────────────────────────────────────────────
const WARMUP_A = [
  { name: "Sac de frappe (échauffement)", reps: "2 min", note: "Enchaînements simples (direct, crochet), sans forcer. On monte la température." },
  { name: "Cat-cow", reps: "8 lentes", note: "À quatre pattes : arrondis le dos en soufflant, puis creuse doucement en inspirant." },
  { name: "Ouverture thoracique à quatre pattes", reps: "6 / côté", note: "Une main derrière la tête, ouvre le coude vers le plafond en suivant du regard. Le bassin ne bouge pas." },
  { name: "Marche latérale élastique (band walk)", reps: "2 × 10 pas / côté", note: "Élastique au-dessus des genoux, légèrement accroupie, petits pas. Tu dois sentir le côté des fesses chauffer." },
  { name: "Squat au poids du corps", reps: "8", note: "Genoux dans l'axe des pieds, descends aussi bas que ton dos reste droit." },
  { name: "Charnière de hanche (poids du corps)", reps: "8", note: "Mains sur les hanches, genoux légèrement fléchis : recule les fesses comme pour fermer une porte, dos plat, puis redresse-toi en serrant les fesses." },
];

const WARMUP_B = [
  { name: "Sac de frappe (échauffement)", reps: "2 min", note: "Enchaînements simples, sans forcer." },
  { name: "World's greatest stretch", reps: "4 / côté", note: "Grande fente, main au sol, puis tourne le buste et lève le bras vers le plafond." },
  { name: "Hip thrust au sol (glute bridge)", reps: "12", note: "Avec l'élastique au-dessus des genoux. Monte le bassin, serre les fesses 2 secondes en haut, les genoux poussent vers l'extérieur." },
  { name: "Monster walk", reps: "2 × 10 pas", note: "Élastique au-dessus des genoux, pas en diagonale vers l'avant. Les genoux ne rentrent pas." },
  { name: "Wall slides", reps: "8", note: "Dos, tête et bras contre le mur, coudes à 90°. Fais glisser les bras vers le haut sans que le bas du dos décolle du mur." },
  { name: "Pompes inclinées (mains sur la box)", reps: "5", note: "Corps gainé, réveil des épaules avant les poussées." },
];

const WARMUP_MAISON = [
  { name: "Cat-cow", reps: "8 lentes", note: "Lentement, sans forcer." },
  { name: "World's greatest stretch", reps: "4 / côté", note: "Ouvre les hanches et le haut du dos." },
  { name: "Squat au poids du corps", reps: "10", note: "Tranquillement, pour réveiller les jambes." },
];

// ── Textes de séance ─────────────────────────────────────────────────────────
const PHASE = [
  "Semaine 1/4 — Découverte. On apprend les mouvements et on trouve tes poids de départ. Note les poids utilisés : ce sera ta base.",
  "Semaine 2/4 — Apprentissage. Même structure, on monte un peu les poids si le geste est propre.",
  "Semaine 3/4 — On charge. Il ne doit plus te rester que 2 répétitions en fin de série. Le step-up passe sur la box.",
  "Semaine 4/4 — Semaine pleine. Objectif : battre tes poids ou tes répétitions de la semaine 3.",
];

const REGLES = [
  "Progression : chaque exercice a une fourchette de répétitions (ex. 8-12). Quand tu fais le haut de la fourchette sur toutes les séries avec un geste propre, on augmente un peu la charge la séance suivante.",
  "Ces 3 à 4 premières semaines, la balance peut stagner ou monter de 0,5 à 1 kg : c'est de l'eau (courbatures, muscles qui se remplissent), pas du gras. On regarde la moyenne de la semaine et les mensurations.",
  "Au quotidien : ~1600 kcal, 120 g de protéines minimum, au moins 10 000 pas.",
].join("\n\n");

const desc = (w, intro) => [PHASE[w], intro, REGLES].join("\n\n");

// ══════════════════════════════════════════════════════════════════════════════
// SÉANCE A — Full body, priorité squat (studio)
// ══════════════════════════════════════════════════════════════════════════════
const sA = (w, id) => [
  warmup(id(), WARMUP_A, id),
  ex(id(), w, {
    name: "Squat gobelet (goblet squat)", sets: 3, reps: "8-12", rest: 90,
    weight: P("8", "8-10", "10-12,5", "12,5")(w), weightType: "haltères", equipment: "Haltère",
    note: "Haltère tenu contre le sternum, coudes vers le bas. Pieds largeur de hanches ou un peu plus, pointes légèrement ouvertes. Descends en 3 secondes, genoux dans l'axe des pieds, aussi bas que ton dos reste droit. Si tes talons décollent, on les surélève avec un petit disque.",
  }),
  ex(id(), w, {
    name: "Soulevé de terre barre surélevée", sets: 3, reps: "8-10", rest: 90,
    weight: P("20", "20-25", "25-30", "30")(w), weightType: "barre", equipment: "Barre, disques, steps",
    note: "Disques posés sur les steps : la barre part à mi-tibia. Pieds largeur de hanches, barre au-dessus du milieu du pied. Attrape la barre juste à l'extérieur des jambes, poitrine haute, dos plat. Avant de tirer, serre les bras comme pour « casser » la barre en deux. Pousse le sol avec les pieds, la barre glisse le long des jambes, finis debout en serrant les fesses — sans te pencher en arrière. Pour redescendre : d'abord les fesses en arrière, puis les genoux.",
  }),
  circuit(id(), {
    rounds: 3, restBetweenRounds: 75,
    exercises: [
      { name: "Développé couché haltères", reps: "8-12", weight: P("2×6", "2×6", "2×7", "2×8")(w), weightType: "haltères", equipment: "Haltères, banc",
        note: withCharge("SUPERSET : enchaîne avec le rowing, puis 1 min 15 de repos.\n\nOmoplates serrées contre le banc, pieds bien à plat. Les coudes partent à 45° du corps (pas en croix). Descends les haltères au niveau de la poitrine en 2 secondes, pousse sans verrouiller.", w) },
      { name: "Rowing haltère 1 bras", reps: "10-12 / côté", weight: P("8", "8-10", "10", "10-12,5")(w), weightType: "haltères", equipment: "Haltère, banc",
        note: withCharge("Un genou et une main sur le banc (ou en fente, main sur la box), dos plat comme une table. Tire le coude vers la hanche, le buste ne tourne pas. Redescends lentement.", w) },
    ],
  }, id),
  ex(id(), w, {
    name: "Step-up", sets: 2, reps: "8 / jambe", rest: 60,
    weight: P("poids du corps", "poids du corps", "poids du corps", "2×4")(w), weightType: P("poids du corps", "poids du corps", "poids du corps", "haltères")(w),
    equipment: P("Plateforme", "Plateforme", "Box", "Box, haltères")(w),
    note: P(
      "Sur la plateforme à sa hauteur maximale, pied posé à une extrémité (au-dessus d'un pied de la plateforme) pour qu'elle ne bascule pas. Pied entier dessus, pousse uniquement avec la jambe du haut, redescends en 3 secondes.",
      "Sur la plateforme à sa hauteur maximale. Pied entier dessus, pousse uniquement avec la jambe du haut, redescends en 3 secondes.",
      "On passe sur la box, côté le plus bas, calée contre le mur. Au départ, seule la pointe du pied arrière touche le sol : tu dois monter sans t'aider de cette jambe. Redescends toujours en contrôlant, jamais en sautant.",
      "Sur la box avec 2 haltères légers. Seule la pointe du pied arrière touche le sol au départ, montée sans élan, descente contrôlée.",
    )(w),
  }),
  circuit(id(), {
    rounds: 3, restBetweenRounds: 45,
    exercises: [
      { name: "Dead bug", reps: "6-8 / côté", weightType: "poids du corps",
        note: "SUPERSET : enchaîne avec l'abduction, puis 45 s de repos.\n\nSur le dos, bras vers le plafond, genoux à 90°. Tends un bras et la jambe opposée en soufflant longuement. Le bas du dos reste plaqué au sol tout le temps : s'il décolle, réduis l'amplitude." },
      { name: "Abduction allongée sur le côté (poids de chevilles)", reps: "12-15 / côté", weightType: "poids de chevilles", equipment: "Poids de chevilles",
        weight: P("poids de chevilles léger", "poids de chevilles léger", "poids de chevilles", "poids de chevilles")(w),
        note: "Allongée sur le côté, jambe du dessous pliée. Jambe du dessus tendue, légèrement EN ARRIÈRE de ton corps, orteils vers l'avant (pas vers le plafond). Monte de 30 à 40° seulement, tiens 1 seconde, redescends en 2 secondes. Le bassin ne bascule pas en arrière. Tu dois sentir le haut-côté de la fesse brûler." },
    ],
  }, id),
];

// ══════════════════════════════════════════════════════════════════════════════
// SÉANCE B — Full body, priorité fessiers & ischios (studio)
// ══════════════════════════════════════════════════════════════════════════════
const sB = (w, id) => [
  warmup(id(), WARMUP_B, id),
  ex(id(), w, {
    name: "Hip thrust barre", sets: 3, reps: "10-12", rest: 90,
    weight: P("20-30", "30", "35-40", "40-45")(w), weightType: "barre", equipment: "Barre, disques, banc, mousse",
    note: "Banc calé contre le mur, mousse ou serviette sur la barre. Le bas des omoplates sur le bord du banc, pieds placés pour que les tibias soient verticaux en haut. Menton rentré, monte jusqu'à l'alignement épaules-hanches-genoux et serre les fesses 1 seconde. Les côtes restent basses : ne te cambre pas pour monter plus haut.",
  }),
  circuit(id(), {
    rounds: 3, restBetweenRounds: 75,
    exercises: [
      { name: "Split squat statique aux haltères", reps: "8-10 / jambe", weight: P("poids du corps", "2×4", "2×6", "2×6-8")(w), weightType: P("poids du corps", "haltères", "haltères", "haltères")(w), equipment: "Haltères",
        note: withCharge("SUPERSET : enchaîne avec le développé épaules, puis 1 min 15 de repos.\n\nEn fente, une grande enjambée entre les pieds, pied arrière sur la pointe. Descends à la verticale jusqu'à ce que le genou arrière frôle le sol, buste légèrement penché vers l'avant, pousse dans le pied avant. Commence par ta jambe la plus faible. Si l'équilibre est fragile, une main sur le rack.", w) },
      { name: "Développé épaules haltères debout", reps: "8-12", weight: P("2×4", "2×5", "2×5-6", "2×6")(w), weightType: "haltères", equipment: "Haltères",
        note: withCharge("Debout, pieds largeur de hanches, fesses et abdos serrés. Haltères à hauteur d'oreilles, pousse vers le haut légèrement vers l'avant. Ne cambre pas le bas du dos : si tu te penches en arrière, c'est trop lourd. Variante : à genoux sur un genou, fesse de la jambe au sol serrée.", w) },
    ],
  }, id),
  circuit(id(), {
    rounds: 3, restBetweenRounds: 75,
    exercises: [
      { name: "Pompes inclinées (mains sur banc)", reps: "6-10", weightType: "poids du corps", equipment: P("Barre dans le rack ou banc", "Barre dans le rack ou banc", "Banc", "Banc")(w),
        note: withCharge("SUPERSET : enchaîne avec le pull-over (même banc), puis 1 min 15 de repos.\n\nCorps gainé en planche de la tête aux talons, coudes à 45° du corps, la poitrine descend jusqu'au support. Trop dur : barre dans le rack à hauteur de hanches. Trop facile : on baisse la barre d'un cran.", w) },
      { name: "Pull-over haltère allongée", reps: "10-12", weight: P("6", "6-8", "8", "8-10")(w), weightType: "haltères", equipment: "Haltère, banc",
        note: withCharge("Allongée dans la longueur du banc, un haltère tenu à deux mains par le disque du haut. Bras tendus au-dessus de la poitrine, coudes légèrement fléchis et FIXES. Descends l'haltère derrière la tête en 3 secondes jusqu'à ce que les bras soient dans le prolongement du corps, ou avant si tes épaules tirent. Les côtes restent basses et le bas du dos collé au banc. Remonte en tirant avec le dos, en soufflant.", w) },
    ],
  }, id),
  circuit(id(), {
    rounds: 3, restBetweenRounds: 60,
    exercises: [
      { name: "Leg curl sur gros ballon", reps: P("8-10", "8-10", "8-12", "10-12")(w), weightType: "poids du corps", equipment: "Gros ballon",
        note: "SUPERSET : enchaîne avec la marche du serveur, puis 1 min de repos.\n\nSur le dos, talons sur le ballon, bras écartés au sol. Monte le bassin, puis ramène les talons vers les fesses en gardant les hanches HAUTES : en fin de mouvement genoux, hanches et épaules sont alignés. Retends les jambes en 3 secondes sans laisser retomber le bassin. Si le bassin redescend, la série s'arrête.\n\nTrop dur : ramène le ballon fesses au sol, monte le bassin, puis retends lentement en 4 secondes (excentrique seul). Encore trop dur : pont tenu talons sur le ballon, 20-30 s." },
      { name: "Marche du serveur à une main (suitcase carry)", reps: "30 s / côté", mode: "time", duration: 30, weight: P("10", "10-12,5", "12,5", "12,5")(w), weightType: "haltères", equipment: "Haltère",
        note: "UN seul haltère, bras tendu le long du corps comme une valise. Marche lentement, épaules à la même hauteur, buste droit : tu ne penches PAS du côté de l'haltère. Ventre serré, respiration normale. Si la place manque : allers-retours de quelques pas ou tenue statique 30 s. À 12,5 kg facile : marche sur la pointe des pieds." },
    ],
  }, id),
  ex(id(), w, {
    name: P("Superman alterné", "Superman alterné", "Superman", "Superman")(w),
    sets: 2, reps: P("8 / côté", "8 / côté", "8", "10")(w), rest: 45, weightType: "poids du corps", charged: false,
    note: P(
      "Allongée sur le ventre, bras tendus devant, front sur une serviette. Lève en même temps le bras et la jambe opposés de quelques centimètres, tiens 2 secondes. Regard vers le sol, fesses serrées : c'est la hanche qui lève la jambe, pas le bas du dos qui se cambre.",
      "Comme la semaine 1 : bras et jambe opposés, 2 secondes de tenue, regard vers le sol, fesses serrées.",
      "On passe au superman complet : bras et jambes se lèvent en même temps de quelques centimètres, 3 secondes de tenue. Regard vers le sol, fesses serrées, aucune douleur dans le bas du dos (sinon, reviens à la version alternée).",
      "Superman complet, 3 secondes de tenue. Regard vers le sol, fesses serrées.",
    )(w),
  }),
];

// ══════════════════════════════════════════════════════════════════════════════
// SÉANCE C (optionnelle) — Maison
// ══════════════════════════════════════════════════════════════════════════════
const sC = (w, id) => [
  warmup(id(), WARMUP_MAISON, id),
  circuit(id(), {
    rounds: P(2, 3, 3, 3)(w), restBetweenRounds: 90,
    exercises: [
      { name: "Squat sumo", reps: "15", weightType: "poids du corps",
        note: "CIRCUIT : enchaîne les 6 exercices, puis 1 min 30 de repos avant le tour suivant.\n\nPieds écartés, pointes vers l'extérieur, élastique au-dessus des genoux si tu en as un. Descends lentement, les genoux poussent vers l'extérieur." },
      { name: "Hip thrust au sol (glute bridge)", reps: "15", weightType: "poids du corps",
        note: "Monte le bassin et serre les fesses 2 secondes en haut. Le bas du dos ne se creuse pas." },
      { name: "Pompes inclinées (mains sur une table)", reps: "8-10", weightType: "poids du corps",
        note: "Mains sur une table ou un plan de travail stable, corps gainé de la tête aux talons." },
      { name: "Fentes arrière alternées (poids du corps)", reps: "10 / jambe", weightType: "poids du corps",
        note: "Une jambe puis l'autre, buste légèrement penché vers l'avant, descente en 2 secondes." },
      { name: "Dead bug", reps: "8 / côté", weightType: "poids du corps",
        note: "Bas du dos plaqué au sol, souffle en tendant bras et jambe opposés." },
      { name: "Gainage / planche (plank)", reps: "30 s", mode: "time", duration: 30, weightType: "poids du corps",
        note: "Sur les avant-bras, corps aligné, fesses serrées, bassin ni haut ni affaissé." },
    ],
  }, id),
];

// ── Assemblage ───────────────────────────────────────────────────────────────
const SESSIONS = [
  { title: "Séance A — Full body, priorité squat", build: sA,
    intro: "Au studio, avec Nina. Durée : ~60 min (10 min d'échauffement, 45 min de travail, 5 min de bilan). Laisse au moins 48 h entre la séance A et la séance B." },
  { title: "Séance B — Full body, fessiers & ischios", build: sB,
    intro: "Au studio, avec Nina. Durée : ~60 min. En fin de séance, on fait le point sur ta récupération depuis la séance A (courbatures, fatigue, sommeil)." },
  { title: "Séance C (optionnelle) — Maison", build: sC,
    intro: "À la maison, ~30 min, sans matériel (un élastique si tu en as un). Volontairement facile : tu dois arriver reposée à tes séances au studio. Pas la veille d'une séance au studio. Si tu fais ton footing ce jour-là, saute-la." },
];

const workouts = [];
for (let w = 0; w < WEEKS; w++) {
  SESSIONS.forEach((s, i) => {
    const id = makeIdGen(`s${w + 1}d${i + 1}`);
    workouts.push(makeWorkout({
      name: `Auriane · S${w + 1} · ${s.title}`,
      description: desc(w, s.intro),
      blocks: s.build(w, id),
    }));
  });
}

// Fiches médiathèque des exercices absents des programmes précédents
// (l'import ignore celles qui existent déjà).
const CATALOGUE = [
  { nom: "Sac de frappe (échauffement)", categorie: "Échauffement & Mobilité",
    positionnement: "Debout face au sac, gants aux mains, pieds décalés, genoux souples, garde haute.",
    execution: "Enchaîner des coups simples (directs, crochets) à intensité modérée en restant mobile sur les appuis.",
    respiration: "Expirer à chaque coup.",
    vigilance: "Poignets alignés avec l'avant-bras à l'impact. On ne cherche pas la puissance : c'est un échauffement." },
  { nom: "Squat au poids du corps", categorie: "Échauffement & Mobilité",
    positionnement: "Debout, pieds largeur de hanches ou un peu plus, pointes légèrement ouvertes.",
    execution: "Descendre en poussant les fesses en arrière et en pliant les genoux, puis remonter en poussant dans le sol.",
    respiration: "Inspirer en descendant, expirer en remontant.",
    vigilance: "Genoux dans l'axe des pieds, dos droit, talons au sol." },
  { nom: "Charnière de hanche (poids du corps)", categorie: "Échauffement & Mobilité",
    positionnement: "Debout, mains sur les hanches, pieds largeur de hanches, genoux légèrement fléchis.",
    execution: "Reculer les fesses en penchant le buste, dos plat, jusqu'à sentir l'étirement des ischios, puis se redresser en serrant les fessiers.",
    respiration: "Inspirer en descendant, expirer en remontant.",
    vigilance: "Le dos reste plat. Les genoux ne se plient pas davantage pendant la descente." },
  { nom: "Pompes inclinées (mains sur la box)", categorie: "Poids du corps",
    positionnement: "Mains sur la box, un peu plus larges que les épaules, corps aligné de la tête aux talons.",
    execution: "Descendre la poitrine vers la box, coudes à 45° du corps, puis repousser.",
    respiration: "Inspirer en descendant, expirer en poussant.",
    vigilance: "Box stable, calée contre le mur. Le bassin ne s'affaisse pas." },
  { nom: "Soulevé de terre barre surélevée", categorie: "Musculation avec charges",
    positionnement: "Disques posés sur des steps pour que la barre parte à mi-tibia. Pieds largeur de hanches, barre au-dessus du milieu du pied, mains juste à l'extérieur des jambes, poitrine haute, dos plat.",
    execution: "Mettre les bras sous tension, pousser le sol avec les pieds : la barre remonte le long des jambes, les hanches passent devant en fin de mouvement. Redescendre fesses en arrière puis genoux.",
    respiration: "Inspirer et gainer avant de tirer, expirer en haut.",
    vigilance: "Dos plat du début à la fin, barre collée aux jambes. Ne pas se pencher en arrière en haut." },
  { nom: "Développé couché haltères", categorie: "Musculation avec charges",
    positionnement: "Allongée sur le banc, pieds à plat au sol, omoplates serrées, haltères au-dessus de la poitrine.",
    execution: "Descendre les haltères au niveau de la poitrine, coudes à 45° du corps, puis pousser vers le haut.",
    respiration: "Inspirer en descendant, expirer en poussant.",
    vigilance: "Coudes pas en croix (90°). Les épaules restent plaquées au banc." },
  { nom: "Abduction allongée sur le côté (poids de chevilles)", categorie: "Musculation avec charges",
    positionnement: "Allongée sur le côté, jambe du dessous pliée, jambe du dessus tendue légèrement en arrière de l'axe du corps, poids à la cheville.",
    execution: "Lever la jambe du dessus de 30 à 40°, tenir 1 s, redescendre en 2 s.",
    respiration: "Expirer en montant, inspirer en descendant.",
    vigilance: "Orteils vers l'avant (pas vers le plafond), sinon c'est le fléchisseur de hanche qui travaille. Le bassin ne bascule pas en arrière." },
  { nom: "Split squat statique aux haltères", categorie: "Musculation avec charges",
    positionnement: "En fente, une grande enjambée entre les pieds, pied arrière sur la pointe, un haltère dans chaque main.",
    execution: "Descendre à la verticale jusqu'à ce que le genou arrière frôle le sol, puis remonter en poussant dans le pied avant, sans changer la position des pieds.",
    respiration: "Inspirer en descendant, expirer en remontant.",
    vigilance: "Genou avant dans l'axe du pied, buste légèrement penché vers l'avant. Une main sur un support si l'équilibre est fragile." },
  { nom: "Développé épaules haltères debout", categorie: "Musculation avec charges",
    positionnement: "Debout, pieds largeur de hanches, fessiers et abdominaux serrés, haltères à hauteur d'oreilles.",
    execution: "Pousser les haltères vers le haut et légèrement vers l'avant, puis redescendre à hauteur d'oreilles.",
    respiration: "Expirer en poussant, inspirer en descendant.",
    vigilance: "Ne pas cambrer le bas du dos ni se pencher en arrière. Variante à genoux sur un genou pour plus de stabilité." },
  { nom: "Pull-over haltère allongée", categorie: "Musculation avec charges",
    positionnement: "Allongée dans la longueur du banc, un haltère tenu à deux mains par le disque du haut, bras au-dessus de la poitrine, coudes légèrement fléchis.",
    execution: "Descendre l'haltère derrière la tête jusqu'à ce que les bras soient dans le prolongement du corps, puis le ramener au-dessus de la poitrine en tirant avec les dorsaux.",
    respiration: "Inspirer en descendant, expirer en remontant.",
    vigilance: "Coudes fixes. Côtes basses, bas du dos collé au banc : limiter l'amplitude si les épaules tirent ou si le dos se cambre." },
  { nom: "Leg curl sur gros ballon", categorie: "Poids du corps",
    positionnement: "Allongée sur le dos, talons sur le gros ballon, bras écartés au sol paumes vers le bas.",
    execution: "Monter le bassin, puis ramener les talons vers les fesses en roulant le ballon, hanches hautes. Retendre lentement les jambes sans laisser retomber le bassin.",
    respiration: "Expirer en ramenant le ballon, inspirer en retendant.",
    vigilance: "Le bassin ne redescend pas pendant le mouvement. Progression : pont tenu → excentrique seul → complet → une jambe." },
  { nom: "Marche du serveur à une main (suitcase carry)", categorie: "Fonctionnel",
    positionnement: "Debout, un seul haltère lourd tenu bras tendu le long du corps.",
    execution: "Marcher lentement en gardant les épaules à la même hauteur et le buste droit. Changer de main.",
    respiration: "Respiration normale, ventre serré.",
    vigilance: "Ne pas pencher du côté de l'haltère ni compenser de l'autre côté. Version statique possible si la place manque." },
  { nom: "Superman alterné", categorie: "Poids du corps",
    positionnement: "Allongée sur le ventre, bras tendus devant, front posé sur une serviette.",
    execution: "Lever en même temps le bras et la jambe opposés de quelques centimètres, tenir 2 s, alterner.",
    respiration: "Expirer en montant.",
    vigilance: "Regard vers le sol. Les fessiers lèvent la jambe : pas de cambrure forcée du bas du dos." },
  { nom: "Superman", categorie: "Poids du corps",
    positionnement: "Allongée sur le ventre, bras tendus devant, front posé sur une serviette.",
    execution: "Lever en même temps les bras et les jambes de quelques centimètres, tenir 3 s, redescendre.",
    respiration: "Expirer en montant.",
    vigilance: "Amplitude courte, regard vers le sol, fessiers serrés. Revenir à la version alternée en cas de gêne lombaire." },
  { nom: "Pompes inclinées (mains sur une table)", categorie: "Poids du corps",
    positionnement: "Mains sur une table ou un plan de travail stable, corps aligné de la tête aux talons.",
    execution: "Descendre la poitrine vers le support, coudes à 45° du corps, puis repousser.",
    respiration: "Inspirer en descendant, expirer en poussant.",
    vigilance: "Support qui ne glisse pas. Le bassin ne s'affaisse pas." },
];

const program = {
  version: 1,
  program_name: "Auriane — Full body découverte (Bloc 1, S1 à S4)",
  client: "Auriane",
  assign: true,
  archive_existing_named: false,
  catalogue_category_default: "Musculation avec charges",
  catalogue: CATALOGUE,
  workouts,
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(program, null, 1));
console.log(`✓ ${OUT} — ${workouts.length} séances`);
