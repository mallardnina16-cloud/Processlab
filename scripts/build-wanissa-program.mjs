#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════════
// build-wanissa-program.mjs
//
// Génère programs/wanissa/bloc2-force-renfort-dos.json : bloc 2 de Wanissa —
// en salle, 3 séances/sem pendant 4 semaines :
//   1. Bas du corps lourd (6-8 reps) + techniques d'intensification progressives
//   2. Haut du corps focus dos & abdos (supersets muscu + gainage) + HIIT 15 min
//   3. Full body, séries longues (12-15) en rappel bas du corps
//
//   node scripts/build-wanissa-program.mjs
//
// Contexte : tassement vertébral T12-L1 ancien (accident), douleurs fréquentes ;
// sangle abdominale faible ; accouchement il y a ~2 ans ; appétit en baisse
// depuis l'arrêt de l'allaitement → pas de déficit sur ce bloc.
// Règles dos : pas de flexion du dos sous charge, pas d'impact ni de balistique
// (pas de swing, burpees, sauts, rameur), préparation du dos + retour au calme à
// chaque séance, règle douleur 0-10. Les intensifications (dropset, rest-pause,
// myo-reps) sont réservées aux machines et aux exercices sans charge sur le dos ;
// le RDL garde toujours 2 répétitions en réserve.
//
// Comme pour Auriane : intensité donnée en clair dans chaque `note`, technique
// d'intensification dans `technique`, GIF dans `photo` quand il en existe un.
// ══════════════════════════════════════════════════════════════════════════════

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { exBlock, circuitBlock, warmupBlock, makeWorkout, makeIdGen } from "./lib/programBlocks.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../programs/wanissa/bloc2-force-renfort-dos.json");
const WEEKS = 4;

// ── GIFs ─────────────────────────────────────────────────────────────────────
const edb = (id) => `https://static.exercisedb.dev/media/${id}.gif`;
const repo = (f) => `https://raw.githubusercontent.com/mallardnina16-cloud/Processlab/main/public/exercise-gifs/${f}.gif`;

const GIF = {
  // Préparation du dos / échauffements
  "Respiration 90/90": null,
  "Open book (rotation thoracique allongée)": null,
  "Étirement fléchisseurs de hanche (psoas)": null,
  "Bird-dog": null,
  "Hip thrust au sol (glute bridge)": edb("u0cNiij"),
  "Vélo (échauffement)": edb("H1PESYI"),
  "Soulevé de terre roumain (RDL) — séries d'approche": edb("wQ2c4XD"),
  "Band pull-apart": edb("sTfvVsG"),
  // Séance 1
  "Soulevé de terre roumain (RDL)": edb("wQ2c4XD"),
  "Fente arrière croisée en déficit": null,
  "Hip thrust unilatéral": edb("rmEukuS"),
  "Leg curl allongé": edb("17lJ1kr"),
  "Leg extension": edb("my33uHU"),
  "Abduction assise à la machine": edb("CHpahtl"),
  "Pallof press": edb("9pa4H5m"),
  // Séance 2
  "Tirage vertical à la poulie (prise neutre)": edb("rkg41Fb"),
  "Dead bug": edb("iny3m5y"),
  "Rowing haltères buste appuyé (banc incliné)": edb("7vG5o25"),
  "Marche du serveur à une main (suitcase carry)": edb("qPEzJjA"),
  "Développé militaire haltères (assis)": edb("f1jf47L"),
  "Gainage / planche (plank)": repo("planche"),
  "Planche RKC": repo("planche"),
  "Vélo (sprint)": edb("H1PESYI"),
  "Marche de l'ours": edb("0Yz8WdV"),
  "Step-up rapide": edb("aXtJhlg"),
  "Patineurs sans saut": null,
  "Mountain climbers": edb("RJgzwny"),
  // Séance 3
  "Presse à cuisses": edb("10Z2DXU"),
  "Fentes marchées": edb("IZVHb27"),
  "Tirage horizontal poulie basse": edb("fUBheHs"),
  "Hip thrust barre": repo("hip-thrust"),
  "Développé haltères incliné": edb("ns0SIbU"),
  "Extension du dos à 45° (dos neutre)": edb("zhMwOwE"),
  "Cable kickback (extension de hanche à la poulie)": edb("Kpajagk"),
  "Planche latérale (side plank)": edb("RKjH6Lt"),
  // Fin de séance
  "Retour au calme : étirements du dos": edb("sU5BrfP"),
};

const gif = (name) => {
  if (!(name in GIF)) throw new Error(`GIF manquant pour "${name}"`);
  return GIF[name];
};

// pick(valeurParSemaine) : tableau de 4 → valeur de la semaine w
const P = (...v) => (w) => v[w];

// ── Intensité en langage clair ───────────────────────────────────────────────
const CHARGE = [
  "Charge : à la fin de chaque série, il doit te rester 2 à 3 répétitions possibles. On trouve tes charges : note-les, ce sera ta base.",
  "Charge : à la fin de chaque série, il doit te rester 2 répétitions possibles. Si la semaine 1 était facile, monte un peu le poids.",
  "Charge : à la fin de chaque série, il ne doit te rester que 1 à 2 répétitions possibles. C'est dur, mais le geste reste propre.",
  "Charge : à la fin de chaque série, il ne doit te rester que 1 à 2 répétitions possibles. Essaie de battre tes poids ou tes répétitions de la semaine 3.",
];
const withCharge = (note, w) => `${CHARGE[w]}\n\n${note}`;

// Explications des techniques d'intensification
const TECH = {
  pauseBas: "Pause en bas : tiens 2 secondes en bas de chaque répétition, sans te relâcher, puis remonte.",
  unEtDemi: "Technique 1,5 rep : descends en bas, remonte à mi-chemin, redescends en bas, puis remonte entièrement. L'ensemble compte pour 1 répétition.",
  serrage: "Serrage en haut : tiens 2 secondes en haut de chaque répétition en serrant fort la fesse.",
  restPause: "Rest-pause : à la fin de la série, pose 15 secondes, refais 2 à 4 répétitions, pose encore 15 secondes, puis 2 à 4 dernières répétitions.",
  dropset: "Dropset sur la dernière série : à la fin de la série, baisse la charge d'environ 25 % et repars tout de suite jusqu'à ne plus pouvoir faire une répétition propre.",
  doubleDrop: "Double dropset sur la dernière série : à la fin de la série, baisse la charge d'environ 25 % et repars tout de suite ; à la fin, baisse encore de 25 % et repars une dernière fois.",
  myo: "Myo-reps sur la dernière série : fais ta série, pose 15 secondes, refais 3 à 4 répétitions ; répète « 15 s de pause + 3 à 4 répétitions » 3 fois.",
  dropMeca: "Dropset mécanique sur la dernière série : quand tu ne peux plus pousser buste penché en avant, redresse-toi et continue buste droit, puis finis en demi-répétitions.",
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

// ── Préparation du dos (début de chaque séance) ──────────────────────────────
const PREPA_DOS = [
  { name: "Respiration 90/90", reps: "5 respirations",
    note: "Sur le dos, pieds posés au mur, genoux et hanches à 90°. Inspire par le nez, puis expire longuement par la bouche en rentrant le nombril : le bas du dos se pose au sol. Ton dos se relâche et tes abdos profonds s'allument." },
  { name: "Open book (rotation thoracique allongée)", reps: "6 / côté",
    note: "Allongée sur le côté, genoux pliés devant toi, bras tendus l'un sur l'autre. Ouvre le bras du dessus vers l'arrière en suivant ta main du regard, comme un livre qui s'ouvre. Va seulement jusqu'où c'est confortable : les genoux restent collés." },
  { name: "Étirement fléchisseurs de hanche (psoas)", reps: "30 s / côté",
    note: "Un genou au sol (sur une serviette), l'autre pied devant. Bascule le bassin en arrière en serrant la fesse de la jambe au sol, puis avance très légèrement. Tu dois sentir l'étirement devant la hanche, pas dans le bas du dos." },
  { name: "Bird-dog", reps: "6 / côté",
    note: "À quatre pattes, dos plat. Tends un bras et la jambe opposée, tiens 3 secondes, reviens. Imagine un verre d'eau posé sur ton dos : il ne doit pas tomber." },
  { name: "Hip thrust au sol (glute bridge)", reps: "12",
    note: "Sur le dos, pieds à plat. Monte le bassin en serrant les fesses, côtes basses, sans creuser le bas du dos. Des fessiers réveillés soulagent les lombaires." },
];

// ── Retour au calme (fin de chaque séance) ───────────────────────────────────
const retourAuCalme = (id) => ex(id, 0, {
  name: "Retour au calme : étirements du dos", sets: 1, reps: "5 min", mode: "time", duration: 300, rest: 0,
  weightType: "poids du corps", charged: false,
  note: "À faire à chaque fin de séance, pour soulager ton dos :\n\n• Étirement du psoas (un genou au sol, bassin basculé en arrière) : 30 s / côté\n• Étirement des fessiers allongée en « figure 4 » (cheville posée sur le genou opposé, dos au sol) : 30 s / côté\n• Étirement des ischios allongée avec une sangle, jambe tendue, dos au sol : 30 s / côté\n• Suspension à la barre (pieds qui frôlent le sol si besoin, épaules actives) : 2 × 20 s, pour décompresser le dos\n\nPas d'étirement qui arrondit le dos (genoux à la poitrine, posture de l'enfant).",
});

// ── Textes de séance ─────────────────────────────────────────────────────────
const PHASE = [
  "Semaine 1/4 — Prise de repères. On trouve tes charges : il doit te rester 2 à 3 répétitions en fin de série. Note tes poids, ce sera ta base.",
  "Semaine 2/4 — On monte un peu les charges et les premières techniques d'intensification arrivent, sur les machines.",
  "Semaine 3/4 — Intensification : pauses, descentes lentes, dropsets et rest-pause. Il ne doit plus te rester que 1 à 2 répétitions (sauf sur le RDL : toujours 2).",
  "Semaine 4/4 — La semaine la plus dure du bloc. Objectif : battre tes poids ou tes répétitions de la semaine 3. Bilan à la fin de la semaine.",
];

const REGLES = [
  "Ton dos d'abord : avant la séance, note ta douleur de 0 à 10. Jusqu'à 3/10, séance normale. Au-dessus de 3, ou si la douleur monte pendant la séance : baisse toutes les charges de 20 % et remplace le RDL par un pont fessier lesté. Ton dos ne s'arrondit jamais sous une charge.",
  "Progression : quand tu fais le haut de la fourchette sur toutes les séries avec un geste propre, monte un peu la charge la fois suivante. Si ton dos ou la fatigue coincent, refais la semaine précédente au lieu d'avancer.",
  "Nutrition : sur ce bloc, l'objectif est de manger assez, pas moins. Au moins ~1750 kcal et 120 à 140 g de protéines par jour. Si l'appétit manque : 4 à 5 petites prises plutôt que 3 gros repas, des calories à boire (smoothie, lait, skyr à boire) et des aliments denses (oléagineux, fromage, œufs).",
].join("\n\n");

const desc = (w, intro) => [PHASE[w], intro, REGLES].join("\n\n");

// ════════════════════════════════════════════════════════════════════════════
// SÉANCE 1 — Bas du corps lourd
// ════════════════════════════════════════════════════════════════════════════
const s1 = (w, id) => [
  warmup(id(), [
    { name: "Vélo (échauffement)", reps: "3 min", note: "Allure progressive, tu dois avoir chaud à la fin." },
    ...PREPA_DOS,
    { name: "Soulevé de terre roumain (RDL) — séries d'approche", reps: "8 à vide + 5 à mi-charge",
      note: "Barre seule, puis environ la moitié de ta charge de travail. On répète le geste avant de charger." },
  ], id),
  ex(id(), w, {
    name: "Soulevé de terre roumain (RDL)", sets: 4, reps: "6-8", rest: 150, charged: false,
    weight: P("22,5", "25", "27,5", "30")(w), weightType: "barre", equipment: "Barre, disques",
    technique: P("", "", "Tempo : descente en 3 s", "Tempo : descente en 3 s")(w),
    note: [
      "Charge : sur le RDL, il te reste TOUJOURS au moins 2 répétitions en fin de série, toutes les semaines. On ne force jamais une répétition : c'est ton dos qui décide.",
      "Debout, barre en main, pieds largeur de hanches, genoux légèrement fléchis. Inspire et gaine le ventre, puis recule les fesses : la barre glisse le long des cuisses, dos plat. Descends jusqu'à sentir les ischios s'étirer (souvent sous les genoux), puis remonte en poussant les hanches vers l'avant et en serrant les fesses. En haut, ne te penche pas en arrière.",
      ...(w >= 2 ? ["Cette semaine : descente lente en 3 secondes, remontée normale."] : []),
    ].join("\n\n"),
  }),
  ex(id(), w, {
    name: "Fente arrière croisée en déficit", sets: 3, reps: "6-8 / jambe", rest: 90,
    weightType: "haltères", equipment: "Haltères, step ou disque",
    technique: P("Descente en 3-4 s", "Descente en 3-4 s", "Pause 2 s en bas", "1,5 rep")(w),
    note: withTech(
      "Pied avant sur un step ou un disque (c'est le « déficit »). Un haltère dans chaque main. Recule la jambe arrière en diagonale, derrière la jambe avant, comme une révérence. Descends en 3 à 4 secondes, contrôle maximal, buste droit et légèrement penché vers l'avant. Le genou avant reste dans l'axe du pied. Pousse dans le talon avant pour remonter. Commence par ta jambe la plus faible.",
      P(null, null, "pauseBas", "unEtDemi")(w),
    ),
  }),
  ex(id(), w, {
    name: "Hip thrust unilatéral", sets: 3, reps: "8-10 / jambe", rest: 75,
    weightType: "haltères", equipment: "Banc, haltère",
    technique: P("", "Serrage 2 s en haut", "Rest-pause (dernière série)", "Rest-pause (2 dernières séries)")(w),
    note: withTech(
      "Le haut du dos sur le banc, un haltère posé sur la hanche de la jambe qui travaille, l'autre jambe pliée en l'air. Monte le bassin en poussant dans le talon, côtes basses, menton rentré, jusqu'à l'alignement épaule-hanche-genou. Le bassin reste bien horizontal, il ne tourne pas.",
      P(null, "serrage", "restPause", "restPause")(w),
    ),
  }),
  circuit(id(), {
    rounds: 3, restBetweenRounds: 75,
    exercises: [
      { name: "Leg curl allongé", reps: "10-12", weightType: "machine", equipment: "Machine leg curl",
        technique: P("", "Dropset (dernière série)", "Double dropset (dernière série)", "Myo-reps (dernière série)")(w),
        note: withTech(withCharge("SUPERSET : enchaîne avec le leg extension, puis 1 min 15 de repos.\n\nAllongée, le bassin reste collé au banc pendant toute la série. Ramène les talons vers les fesses, puis redescends en 3 secondes.", w),
          P(null, "dropset", "doubleDrop", "myo")(w)) },
      { name: "Leg extension", reps: "10-12", weightType: "machine", equipment: "Machine leg extension",
        technique: P("", "Dropset (dernière série)", "Double dropset (dernière série)", "Myo-reps (dernière série)")(w),
        note: withTech(withCharge("Dos bien calé contre le dossier, mains sur les poignées. Tends les jambes, tiens 1 seconde en haut, redescends en contrôlant.", w),
          P(null, "dropset", "doubleDrop", "myo")(w)) },
    ],
  }, id),
  ex(id(), w, {
    name: "Abduction assise à la machine", sets: 3, reps: "15-20", rest: 45,
    weightType: "machine", equipment: "Machine abduction",
    technique: P("", "", "Dropset mécanique (dernière série)", "Dropset mécanique (dernière série)")(w),
    note: withTech("Buste légèrement penché vers l'avant, dos plat, mains sur la machine. Écarte les genoux en poussant avec le côté des fesses, tiens 1 seconde, reviens lentement.", P(null, null, "dropMeca", "dropMeca")(w)),
  }),
  ex(id(), w, {
    name: "Pallof press", sets: 3, reps: "10 / côté", rest: 45, charged: false,
    weightType: "poulie", equipment: "Poulie ou élastique",
    note: [
      "De profil par rapport à la poulie (ou l'élastique), poignée contre le sternum, pieds largeur d'épaules, genoux souples. Pousse les bras devant toi en soufflant : la poulie essaie de te faire tourner, ton ventre l'en empêche. Le buste et le bassin ne bougent pas. Ramène les mains contre la poitrine. Choisis une charge qui te fait trembler un peu à la fin.",
      ...(w >= 2 ? ["Cette semaine : tiens 3 secondes bras tendus à chaque répétition."] : []),
    ].join("\n\n"),
  }),
  retourAuCalme(id()),
];

// ════════════════════════════════════════════════════════════════════════════
// SÉANCE 2 — Haut du corps, dos & abdos + HIIT 15 min
// ════════════════════════════════════════════════════════════════════════════
const HIIT_WORK = [30, 35, 40, 45];
const s2 = (w, id) => [
  warmup(id(), [
    { name: "Vélo (échauffement)", reps: "2 min", note: "Allure progressive." },
    ...PREPA_DOS,
    { name: "Band pull-apart", reps: "15", note: "Bras tendus devant, écarte l'élastique jusqu'à la poitrine en serrant les omoplates. Les côtes restent basses." },
  ], id),
  circuit(id(), {
    rounds: 4, restBetweenRounds: 90,
    exercises: [
      { name: "Tirage vertical à la poulie (prise neutre)", reps: "8-10", weightType: "machine", equipment: "Poulie haute, poignée prise neutre",
        technique: P("", "", "Tempo : remontée en 3 s", "Dropset (dernière série)")(w),
        note: withTech(withCharge("SUPERSET : enchaîne avec le dead bug, puis 1 min 30 de repos.\n\nAssise, cuisses bloquées, buste très légèrement penché en arrière, ventre gainé. Tire la poignée vers le haut de la poitrine en descendant les coudes vers tes poches. Ne te balance pas.", w),
          P(null, null, null, "dropset")(w)) + (w === 2 ? "\n\nCette semaine : laisse remonter la barre en 3 secondes." : "") },
      { name: "Dead bug", reps: "6-8 / côté", weight: P("", "", "1 haltère léger", "1 haltère léger")(w), weightType: P("poids du corps", "poids du corps", "haltères", "haltères")(w),
        note: [
          "Sur le dos, bras vers le plafond, genoux à 90°. Tends un bras et la jambe opposée en soufflant longuement. Le bas du dos reste plaqué au sol tout le temps : s'il décolle, réduis l'amplitude.",
          ...(w >= 2 ? ["Cette semaine : un haltère léger tenu à deux mains au-dessus de la poitrine, seules les jambes bougent."] : []),
        ].join("\n\n") },
    ],
  }, id),
  circuit(id(), {
    rounds: 3, restBetweenRounds: 75,
    exercises: [
      { name: "Rowing haltères buste appuyé (banc incliné)", reps: "10-12", weightType: "haltères", equipment: "Banc incliné, haltères",
        technique: P("", "", "Pause 1 s en haut", "Rest-pause (dernière série)")(w),
        note: withTech(withCharge("SUPERSET : enchaîne avec la marche du serveur, puis 1 min 15 de repos.\n\nAllongée sur le ventre sur un banc incliné (30-45°), la poitrine reste collée au dossier : ton bas du dos ne porte rien. Tire les coudes vers les hanches en serrant les omoplates, redescends lentement.", w),
          P(null, null, null, "restPause")(w)) + (w === 2 ? "\n\nCette semaine : tiens 1 seconde en haut, omoplates serrées." : "") },
      { name: "Marche du serveur à une main (suitcase carry)", reps: "30 s / côté", mode: "time", duration: 30, weightType: "haltères", equipment: "Haltère",
        note: "UN seul haltère, bras tendu le long du corps comme une valise. Marche lentement, épaules à la même hauteur, buste droit : tu ne penches PAS du côté de l'haltère. Ventre serré, respiration normale. Prends lourd : c'est ton gainage qui travaille." },
    ],
  }, id),
  circuit(id(), {
    rounds: 3, restBetweenRounds: 60,
    exercises: [
      { name: "Développé militaire haltères (assis)", reps: "10", weightType: "haltères", equipment: "Banc à dossier, haltères",
        note: withCharge("SUPERSET : enchaîne avec le gainage, puis 1 min de repos.\n\nAssise, dossier presque vertical, tout le dos collé au dossier. Haltères à hauteur d'oreilles, pousse vers le haut en soufflant. Les côtes restent basses : si ton dos se décolle ou se cambre, c'est trop lourd.", w) },
      w < 2
        ? { name: "Gainage / planche (plank)", reps: P("30 s", "40 s")(w), mode: "time", duration: P(30, 40)(w), weightType: "poids du corps",
            note: "Sur les avant-bras, corps aligné de la tête aux talons, fesses serrées, nombril rentré. Le bassin ne monte pas et ne s'affaisse pas. Respire normalement." }
        : { name: "Planche RKC", reps: P("", "", "20 s", "25 s")(w), mode: "time", duration: P(0, 0, 20, 25)(w), weightType: "poids du corps",
            note: "Planche sur les avant-bras, mais en contractant TOUT au maximum : serre les fesses et les cuisses, tire les coudes vers les pieds sans bouger. Plus courte qu'une planche classique, mais beaucoup plus intense. Respire par petites expirations." },
    ],
  }, id),
  circuit(id(), {
    rounds: 3, restBetweenRounds: 0, intervalMode: true,
    exercises: [
      { name: "Vélo (sprint)", reps: `${HIIT_WORK[w]} s`, mode: "time", duration: HIIT_WORK[w], workTime: HIIT_WORK[w], restTime: 60 - HIIT_WORK[w], weightType: "poids du corps",
        note: `HIIT 15 MIN : 3 tours de 5 exercices, ${HIIT_WORK[w]} s d'effort / ${60 - HIIT_WORK[w]} s de récupération. Pas de saut, pas d'impact : ton dos est protégé, c'est l'intensité qui compte.\n\nSur le vélo, résistance moyenne, pédale le plus vite possible en restant assise, buste droit.` },
      { name: "Marche de l'ours", reps: `${HIIT_WORK[w]} s`, mode: "time", duration: HIIT_WORK[w], workTime: HIIT_WORK[w], restTime: 60 - HIIT_WORK[w], weightType: "poids du corps",
        note: "À quatre pattes, genoux à 2-3 cm du sol. Avance main et pied opposés à petits pas, dos plat comme une table. Avance puis recule." },
      { name: "Step-up rapide", reps: `${HIIT_WORK[w]} s`, mode: "time", duration: HIIT_WORK[w], workTime: HIIT_WORK[w], restTime: 60 - HIIT_WORK[w], weightType: "poids du corps", equipment: "Step",
        note: "Monte et descends du step le plus vite possible en alternant les jambes, sans sauter. Pied entier sur le step." },
      { name: "Patineurs sans saut", reps: `${HIIT_WORK[w]} s`, mode: "time", duration: HIIT_WORK[w], workTime: HIIT_WORK[w], restTime: 60 - HIIT_WORK[w], weightType: "poids du corps",
        note: "Grand pas latéral, la jambe arrière passe en diagonale derrière toi, pied posé (pas de saut). Enchaîne de l'autre côté le plus vite possible, buste droit." },
      { name: "Mountain climbers", reps: `${HIIT_WORK[w]} s`, mode: "time", duration: HIIT_WORK[w], workTime: HIIT_WORK[w], restTime: 60 - HIIT_WORK[w], weightType: "poids du corps",
        note: "Mains sous les épaules, corps gainé. Ramène un genou vers la poitrine puis l'autre, rythme soutenu mais contrôlé : le bassin reste à hauteur des épaules et ne rebondit pas. Mains sur un banc si le bas du dos tire." },
    ],
  }, id),
  retourAuCalme(id()),
];

// ════════════════════════════════════════════════════════════════════════════
// SÉANCE 3 — Full body, séries longues
// ════════════════════════════════════════════════════════════════════════════
const s3 = (w, id) => [
  warmup(id(), [
    { name: "Vélo (échauffement)", reps: "3 min", note: "Allure progressive." },
    ...PREPA_DOS,
  ], id),
  ex(id(), w, {
    name: "Presse à cuisses", sets: 3, reps: "12-15", rest: 90,
    weightType: "machine", equipment: "Presse à cuisses",
    note: "Pieds hauts et larges sur la plateforme pour travailler les fessiers. Descends jusqu'où ton bassin et le bas de ton dos restent COLLÉS au dossier : s'ils décollent, tu arrêtes la descente avant. Pousse dans les talons, sans verrouiller les genoux en haut.",
  }),
  circuit(id(), {
    rounds: P(3, 3, 4, 4)(w), restBetweenRounds: 75,
    exercises: [
      { name: "Fentes marchées", reps: "12 / jambe", weightType: "haltères", equipment: "Haltères",
        note: withCharge("SUPERSET : enchaîne avec le tirage horizontal, puis 1 min 15 de repos.\n\nUn haltère dans chaque main, grands pas, buste droit et légèrement penché vers l'avant. Le genou arrière frôle le sol, le genou avant reste dans l'axe du pied.", w) },
      { name: "Tirage horizontal poulie basse", reps: "12-15", weightType: "machine", equipment: "Poulie basse",
        note: withCharge("Assise, genoux légèrement fléchis, buste droit et IMMOBILE : tu ne te penches ni en avant ni en arrière. Tire la poignée vers le nombril en serrant les omoplates, reviens lentement.", w) },
    ],
  }, id),
  circuit(id(), {
    rounds: 3, restBetweenRounds: 75,
    exercises: [
      { name: "Hip thrust barre", reps: "12-15", weightType: "barre", equipment: "Barre, disques, banc, mousse",
        technique: P("", "", "", "Serrage 2 s en haut")(w),
        note: withTech(withCharge("SUPERSET : enchaîne avec le développé incliné, puis 1 min 15 de repos.\n\nBanc calé, mousse sur la barre. Le bas des omoplates sur le bord du banc, tibias verticaux en haut. Menton rentré, monte jusqu'à l'alignement épaules-hanches-genoux et serre les fesses. Les côtes restent basses : ne te cambre pas pour monter plus haut.", w),
          P(null, null, null, "serrage")(w)) },
      { name: "Développé haltères incliné", reps: "12", weightType: "haltères", equipment: "Banc incliné, haltères",
        note: withCharge("Banc à 30°, omoplates serrées, pieds à plat. Coudes à 45° du corps, descends les haltères en 2 secondes au niveau du haut de la poitrine, pousse sans verrouiller.", w) },
    ],
  }, id),
  circuit(id(), {
    rounds: 3, restBetweenRounds: 60,
    exercises: [
      { name: "Extension du dos à 45° (dos neutre)", reps: P("10", "10-12", "12", "12-15")(w), weightType: "poids du corps", equipment: "Banc à lombaires 45°",
        note: "SUPERSET : enchaîne avec le kickback, puis 1 min de repos.\n\nC'est un exercice pour RENFORCER ton dos, pas pour le fatiguer : poids du corps uniquement. Bassin calé juste sous le coussin, bras croisés sur la poitrine. Le dos reste PLAT tout le long : tu plies seulement aux hanches, descends de quelques dizaines de centimètres, puis remonte en serrant les fesses jusqu'à l'alignement du corps, pas plus haut. Aucune douleur : si ça tire dans le dos, réduis l'amplitude ou arrête." },
      { name: "Cable kickback (extension de hanche à la poulie)", reps: "12-15 / jambe", weightType: "machine", equipment: "Poulie basse, sangle de cheville",
        note: "Sangle à la cheville, mains sur la machine, buste légèrement penché, ventre gainé. Pousse la jambe vers l'arrière avec la fesse et ARRÊTE-TOI quand la hanche est tendue : si ton bas du dos se creuse, tu es allée trop loin. Reviens lentement." },
    ],
  }, id),
  circuit(id(), {
    rounds: 3, restBetweenRounds: 30,
    exercises: [
      { name: "Gainage / planche (plank)", reps: "30 s", mode: "time", duration: 30, weightType: "poids du corps",
        note: "CIRCUIT GAINAGE : face, côté gauche, côté droit, puis 30 s de repos. 3 tours.\n\nSur les avant-bras, corps aligné, fesses serrées, nombril rentré. Le bassin ne monte pas et ne s'affaisse pas." },
      { name: "Planche latérale (side plank)", reps: "30 s — côté gauche", mode: "time", duration: 30, weightType: "poids du corps",
        note: "Sur l'avant-bras gauche, coude sous l'épaule, corps aligné de la tête aux pieds. Pousse la hanche vers le plafond. Trop dur : genoux pliés au sol." },
      { name: "Planche latérale (side plank)", reps: "30 s — côté droit", mode: "time", duration: 30, weightType: "poids du corps",
        note: "Sur l'avant-bras droit, coude sous l'épaule, corps aligné de la tête aux pieds. Pousse la hanche vers le plafond. Trop dur : genoux pliés au sol." },
    ],
  }, id),
  retourAuCalme(id()),
];

// ── Assemblage ───────────────────────────────────────────────────────────────
const SESSIONS = [
  { title: "Séance 1 — Bas du corps lourd", build: s1,
    intro: "En salle, ~70 min. Séance lourde : 6 à 8 répétitions sur les gros exercices, puis des techniques d'intensification sur les machines au fil des semaines. Laisse au moins 48 h avant la séance 3." },
  { title: "Séance 2 — Haut du corps, dos & abdos + HIIT", build: s2,
    intro: "En salle, ~60 min. Chaque exercice de muscu est enchaîné avec un exercice d'abdos, puis 15 min de HIIT sans impact pour finir." },
  { title: "Séance 3 — Full body, séries longues", build: s3,
    intro: "En salle, ~60 min. Séries plus longues (12 à 15 répétitions) en rappel du bas du corps, et un renfort du dos et des abdos en fin de séance." },
];

const workouts = [];
for (let w = 0; w < WEEKS; w++) {
  SESSIONS.forEach((s, i) => {
    const id = makeIdGen(`s${w + 1}d${i + 1}`);
    workouts.push(makeWorkout({
      name: `Wanissa · S${w + 1} · ${s.title}`,
      description: desc(w, s.intro),
      blocks: s.build(w, id),
    }));
  });
}

// Fiches médiathèque (l'import ignore celles qui existent déjà).
const CATALOGUE = [
  { nom: "Respiration 90/90", categorie: "Échauffement & Mobilité",
    positionnement: "Allongée sur le dos, pieds posés au mur, hanches et genoux pliés à 90°.",
    execution: "Inspirer par le nez en gonflant le bas des côtes, puis expirer longuement par la bouche en rentrant le nombril jusqu'à sentir le bas du dos se poser au sol.",
    respiration: "Expiration deux fois plus longue que l'inspiration.",
    vigilance: "Les épaules et la nuque restent relâchées. On ne force pas : c'est un exercice de relâchement." },
  { nom: "Open book (rotation thoracique allongée)", categorie: "Échauffement & Mobilité",
    positionnement: "Allongée sur le côté, genoux pliés devant soi, bras tendus l'un sur l'autre devant la poitrine.",
    execution: "Ouvrir le bras du dessus vers l'arrière en suivant la main du regard, puis revenir.",
    respiration: "Expirer en ouvrant.",
    vigilance: "Les genoux restent collés l'un à l'autre. Amplitude confortable, sans douleur dans le dos." },
  { nom: "Étirement fléchisseurs de hanche (psoas)", categorie: "Échauffement & Mobilité",
    positionnement: "Un genou au sol sur une serviette, l'autre pied devant, genou à 90°.",
    execution: "Basculer le bassin en arrière en serrant la fesse de la jambe au sol, puis avancer légèrement le bassin. Tenir.",
    respiration: "Respiration lente et profonde.",
    vigilance: "L'étirement se sent devant la hanche. Le bas du dos ne se creuse pas." },
  { nom: "Bird-dog", categorie: "Poids du corps",
    positionnement: "À quatre pattes, mains sous les épaules, genoux sous les hanches, dos plat.",
    execution: "Tendre un bras et la jambe opposée jusqu'à l'horizontale, tenir 3 s, revenir et changer de côté.",
    respiration: "Expirer en tendant.",
    vigilance: "Le bassin ne tourne pas et le dos ne se creuse pas." },
  { nom: "Vélo (échauffement)", categorie: "Échauffement & Mobilité",
    positionnement: "Assise sur le vélo, selle réglée pour que la jambe soit presque tendue en bas.",
    execution: "Pédaler à allure progressive.",
    respiration: "Respiration libre.",
    vigilance: "Buste droit, sans s'avachir sur le guidon." },
  { nom: "Soulevé de terre roumain (RDL)", categorie: "Musculation avec charges",
    positionnement: "Debout, barre en main, pieds largeur de hanches, genoux légèrement fléchis.",
    execution: "Reculer les fesses en gardant le dos plat, la barre glisse le long des cuisses jusqu'à l'étirement des ischios, puis remonter en poussant les hanches vers l'avant.",
    respiration: "Inspirer et gainer avant de descendre, expirer en haut.",
    vigilance: "Le dos ne s'arrondit jamais. La barre reste collée aux jambes. Ne pas se pencher en arrière en haut." },
  { nom: "Fente arrière croisée en déficit", categorie: "Musculation avec charges",
    positionnement: "Pied avant sur un step ou un disque, un haltère dans chaque main.",
    execution: "Reculer la jambe arrière en diagonale derrière la jambe avant (révérence), descendre lentement, puis remonter en poussant dans le talon avant.",
    respiration: "Inspirer en descendant, expirer en remontant.",
    vigilance: "Genou avant dans l'axe du pied, bassin de face. Descente contrôlée en 3-4 s." },
  { nom: "Hip thrust unilatéral", categorie: "Musculation avec charges",
    positionnement: "Haut du dos sur un banc, un pied au sol, l'autre jambe pliée en l'air, haltère sur la hanche de la jambe qui travaille.",
    execution: "Monter le bassin en poussant dans le talon jusqu'à l'alignement épaule-hanche-genou, puis redescendre.",
    respiration: "Expirer en montant.",
    vigilance: "Le bassin reste horizontal. Côtes basses, pas de cambrure en haut." },
  { nom: "Leg curl allongé", categorie: "Machines guidées (salle de sport)",
    positionnement: "Allongée sur le ventre sur la machine, boudin juste au-dessus des talons.",
    execution: "Ramener les talons vers les fesses, puis redescendre lentement.",
    respiration: "Expirer en ramenant.",
    vigilance: "Le bassin reste collé au banc." },
  { nom: "Leg extension", categorie: "Machines guidées (salle de sport)",
    positionnement: "Assise, dos calé contre le dossier, boudin sur le bas des tibias, genoux alignés avec l'axe de la machine.",
    execution: "Tendre les jambes, tenir 1 s, redescendre en contrôlant.",
    respiration: "Expirer en tendant.",
    vigilance: "Pas d'à-coup. Les fesses restent sur le siège." },
  { nom: "Abduction assise à la machine", categorie: "Machines guidées (salle de sport)",
    positionnement: "Assise, coussins à l'extérieur des genoux, buste légèrement penché vers l'avant, dos plat.",
    execution: "Écarter les genoux, tenir 1 s, revenir lentement.",
    respiration: "Expirer en écartant.",
    vigilance: "Pas d'élan. Le dos reste plat." },
  { nom: "Pallof press", categorie: "Fonctionnel",
    positionnement: "De profil par rapport à la poulie ou à l'élastique, poignée contre le sternum, pieds largeur d'épaules.",
    execution: "Pousser les bras devant soi sans laisser le buste tourner, puis ramener.",
    respiration: "Expirer en poussant.",
    vigilance: "Bassin et épaules restent de face. Rien ne tourne." },
  { nom: "Tirage vertical à la poulie (prise neutre)", categorie: "Machines guidées (salle de sport)",
    positionnement: "Assise, cuisses bloquées, poignée prise neutre (paumes face à face).",
    execution: "Tirer la poignée vers le haut de la poitrine en descendant les coudes, puis remonter lentement.",
    respiration: "Expirer en tirant.",
    vigilance: "Pas de balancement du buste. Le dos ne se cambre pas." },
  { nom: "Rowing haltères buste appuyé (banc incliné)", categorie: "Musculation avec charges",
    positionnement: "Allongée sur le ventre sur un banc incliné à 30-45°, un haltère dans chaque main, bras tendus.",
    execution: "Tirer les coudes vers les hanches en serrant les omoplates, puis redescendre lentement.",
    respiration: "Expirer en tirant.",
    vigilance: "La poitrine reste collée au dossier. On ne lève pas la tête." },
  { nom: "Développé militaire haltères (assis)", categorie: "Musculation avec charges",
    positionnement: "Assise, dossier presque vertical, dos collé, haltères à hauteur d'oreilles.",
    execution: "Pousser les haltères vers le haut, puis redescendre à hauteur d'oreilles.",
    respiration: "Expirer en poussant.",
    vigilance: "Le bas du dos reste collé au dossier, côtes basses." },
  { nom: "Planche RKC", categorie: "Poids du corps",
    positionnement: "Planche sur les avant-bras, corps aligné.",
    execution: "Contracter fesses, cuisses et abdominaux au maximum en tirant les coudes vers les pieds sans bouger. Tenir 10 à 25 s.",
    respiration: "Petites expirations régulières.",
    vigilance: "Le bassin ne monte pas. Durée courte, intensité maximale." },
  { nom: "Vélo (sprint)", categorie: "Fonctionnel",
    positionnement: "Assise sur le vélo, résistance moyenne.",
    execution: "Pédaler le plus vite possible pendant le temps d'effort.",
    respiration: "Respiration libre et rapide.",
    vigilance: "Rester assise, buste droit." },
  { nom: "Marche de l'ours", categorie: "Fonctionnel",
    positionnement: "À quatre pattes, genoux décollés de 2-3 cm, dos plat.",
    execution: "Avancer main et pied opposés à petits pas, puis reculer.",
    respiration: "Respiration régulière.",
    vigilance: "Les hanches restent à hauteur des épaules. Le dos ne bouge pas." },
  { nom: "Step-up rapide", categorie: "Fonctionnel",
    positionnement: "Face à un step bas.",
    execution: "Monter et descendre en alternant les jambes le plus vite possible.",
    respiration: "Respiration libre.",
    vigilance: "Pas de saut. Pied entier sur le step." },
  { nom: "Patineurs sans saut", categorie: "Fonctionnel",
    positionnement: "Debout, genoux souples.",
    execution: "Grand pas latéral, la jambe arrière passe en diagonale derrière, pied posé. Enchaîner de l'autre côté rapidement.",
    respiration: "Respiration libre.",
    vigilance: "Pas de saut. Genou d'appui dans l'axe du pied." },
  { nom: "Extension du dos à 45° (dos neutre)", categorie: "Machines guidées (salle de sport)",
    positionnement: "Sur le banc à lombaires 45°, bassin juste sous le coussin, bras croisés sur la poitrine.",
    execution: "Plier uniquement aux hanches en gardant le dos plat, puis remonter en serrant les fessiers jusqu'à l'alignement du corps.",
    respiration: "Expirer en remontant.",
    vigilance: "Le dos ne s'arrondit pas et ne se cambre pas en haut. Poids du corps uniquement en cas de fragilité lombaire." },
  { nom: "Retour au calme : étirements du dos", categorie: "Échauffement & Mobilité",
    positionnement: "Au sol sur un tapis, puis à la barre de traction.",
    execution: "Étirement du psoas, des fessiers (figure 4) et des ischios (sangle), 30 s par côté, puis 2 × 20 s de suspension à la barre.",
    respiration: "Respiration lente et profonde.",
    vigilance: "Aucun étirement qui arrondit le dos. Rien ne doit faire mal." },
];

const program = {
  version: 1,
  program_name: "Wanissa — Force & renfort du dos (Bloc 2, S1 à S4)",
  client: "Wanissa",
  assign: true,
  archive_existing_named: false,
  catalogue_category_default: "Musculation avec charges",
  catalogue: CATALOGUE,
  workouts,
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(program, null, 1));
console.log(`✓ ${OUT} — ${workouts.length} séances`);
