#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════════
// build-rachel-program.mjs
//
// Génère programs/rachel/bloc1-fessiers-recomposition-s1.json : semaine 1 du programme
// "Fessiers & Recomposition" de Rachel — 3 séances (la séance 4, circuit, est
// créée à la main par la coach). Mobilité d'épaule limitée : aucun développé
// au-dessus de la tête, amplitude sans douleur.
//
//   node scripts/build-rachel-program.mjs
//   node scripts/seed-program.mjs programs/rachel/bloc1-fessiers-recomposition-s1.json --dry-run
// ══════════════════════════════════════════════════════════════════════════════

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { exBlock, circuitBlock, warmupBlock, makeWorkout, makeIdGen } from "./lib/programBlocks.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const INTRO = "Semaine 1/8 — Phase 1, prise de repères. RPE 7 : garde 2 à 3 répétitions en réserve sur chaque série et note la charge utilisée sur chaque exercice.";
const SHOULDER = "Épaule : uniquement l'amplitude sans douleur, le côté limité peut faire une amplitude plus courte. Une raideur est normale ; une douleur = on arrête l'exercice et on le note en commentaire.";
const NEAT = "NEAT : 8 000 à 10 000 pas/jour · marche rapide de 40 à 45 min le mercredi et le vendredi.";
const desc = (structure) => [INTRO, structure, SHOULDER, NEAT].join("\n\n");

// Échauffement d'épaule commun aux 3 séances
const SHOULDER_WARMUP = [
  { name: "Rotation externe élastique", reps: "2 × 15", note: "Coude collé au corps, rotation lente vers l'extérieur." },
  { name: "Wall slides", reps: "2 × 10", note: "Dans l'amplitude confortable uniquement, on ne force pas la montée des bras." },
  { name: "Ouverture thoracique à quatre pattes", reps: "10 / côté", note: "Mobilise le haut du dos pour soulager l'épaule." },
  { name: "Band pull-apart", reps: "2 × 15", note: "Bras à hauteur de poitrine, on rapproche les omoplates." },
];

// ══════════════════════════════════════════════════════════════════════════════
// SÉANCE 1 — Bas A : fessiers + quadriceps
// ══════════════════════════════════════════════════════════════════════════════
const seance1 = () => {
  const id = makeIdGen("s1d1");
  return makeWorkout({
    name: "Rachel · S1 · Séance 1 — Bas A : fessiers + quadriceps",
    description: desc("Structure : 2 exercices lourds en séries classiques (hip thrust, fente arrière à la barre guidée), puis 2 supersets qui associent un exercice de jambes à du gainage, puis un finisher AMRAP de 8 min."),
    blocks: [
      warmupBlock(id(), [
        ...SHOULDER_WARMUP,
        { name: "Marche latérale élastique (band walk)", reps: "2 × 12 pas / côté", note: "Élastique au-dessus des genoux, genoux poussés vers l'extérieur." },
        { name: "Hip thrust au sol (glute bridge)", reps: "2 × 15", note: "Activation : serre les fessiers 1 s en haut, sans cambrer." },
      ], id),
      exBlock(id(), {
        name: "Hip thrust barre", sets: 4, reps: "10-12", rest: 120, tempo: "2-0-1-2", rpe: 7,
        weightType: "barre",
        note: "Pause de 2 s en haut. Menton rentré, tibias verticaux en haut, bas du ventre rentré : on serre les fessiers sans cambrer.",
      }),
      exBlock(id(), {
        name: "Fente arrière à la barre guidée", sets: 3, reps: "10 / jambe", rest: 90, tempo: "2-0-1-0", rpe: 7,
        weightType: "barre",
        note: "À la barre guidée (Smith). Grand pas en arrière, buste légèrement penché en avant, on pousse dans le talon de la jambe avant.",
      }),
      circuitBlock(id(), {
        rounds: 3, restBetweenRounds: 75,
        exercises: [
          { name: "Step-up", reps: "10 / jambe", rpe: 7, weightType: "haltères",
            note: "Box haute (genou au-dessus de la hanche). On monte en poussant dans le talon, sans s'aider de la jambe du bas." },
          { name: "Dead bug", reps: "10 / côté", rpe: 7, weightType: "poids du corps",
            note: "Bas du dos plaqué au sol. Bras dans l'amplitude confortable pour l'épaule." },
        ],
      }, id),
      circuitBlock(id(), {
        rounds: 3, restBetweenRounds: 60,
        exercises: [
          { name: "Abduction assise à la machine", reps: "20", rpe: 7, weightType: "machine",
            note: "Tiens 1 s en position ouverte, retour contrôlé sans relâcher la tension." },
          { name: "Gainage / planche (plank)", reps: "30 s", mode: "time", duration: 30, rpe: 7, weightType: "poids du corps",
            note: "Sur les avant-bras ou sur les mains, selon le confort de l'épaule." },
        ],
      }, id),
      circuitBlock(id(), {
        rounds: 4, restBetweenRounds: 10,
        exercises: [
          { name: "Kettlebell swing", reps: "12", rpe: 8, weightType: "kettlebell", technique: "AMRAP 8 min",
            note: "Finisher : enchaîne le plus de tours possible en 8 min (objectif : 4 tours). Le mouvement vient des hanches, les bras ne montent pas au-dessus des épaules." },
          { name: "Pompes inclinées (mains sur banc)", reps: "8", rpe: 8, weightType: "poids du corps",
            note: "Mains sur un banc, corps gainé." },
          { name: "Vélo ou rameur", reps: "30 s rapide", mode: "time", duration: 30, rpe: 8, weightType: "poids du corps",
            note: "Vélo, à allure rapide." },
        ],
      }, id),
    ],
  });
};

// ══════════════════════════════════════════════════════════════════════════════
// SÉANCE 2 — Haut du corps : dos, épaules, bras
// ══════════════════════════════════════════════════════════════════════════════
const seance2 = () => {
  const id = makeIdGen("s1d2");
  return makeWorkout({
    name: "Rachel · S1 · Séance 2 — Haut du corps : dos, épaules, bras",
    description: desc("Structure : 2 exercices en séries classiques (rowing à la poulie, landmine press), puis 2 supersets (pompes inclinées + face pull + superman, puis élévations latérales + triceps), puis un finisher de course alternée."),
    blocks: [
      warmupBlock(id(), SHOULDER_WARMUP, id),
      exBlock(id(), {
        name: "Tirage horizontal poulie basse", sets: 4, reps: "10-12", rest: 90, tempo: "2-0-1-1", rpe: 7,
        weightType: "machine",
        note: "Prise neutre. Coudes près du corps, on rapproche les omoplates en fin de mouvement, sans élan du buste.",
      }),
      exBlock(id(), {
        name: "Landmine press unilatéral", sets: 3, reps: "10 / bras", rest: 90, tempo: "2-0-1-0", rpe: 7,
        weightType: "disques",
        note: "Poussée en diagonale, plus douce pour l'épaule qu'un développé vertical. Côté limité : amplitude réduite, sans douleur.",
      }),
      circuitBlock(id(), {
        rounds: 3, restBetweenRounds: 75,
        exercises: [
          { name: "Pompes inclinées (mains sur banc)", reps: "8-12", rpe: 7, weightType: "poids du corps",
            note: "Mains sur un banc, corps gainé, coudes à environ 45° du corps." },
          { name: "Face pull", reps: "15", rpe: 7, weightType: "machine",
            note: "Charge légère. Tire la corde vers le visage en ouvrant les coudes, sans monter les bras au-dessus de la tête." },
          { name: "Superman", reps: "12", tempo: "1-0-1-2", rpe: 7, weightType: "poids du corps",
            note: "Bras le long du corps ou en W (coudes pliés), pas tendus devant à cause de l'épaule. On décolle la poitrine et les jambes, tenue 2 s en haut." },
        ],
      }, id),
      circuitBlock(id(), {
        rounds: 3, restBetweenRounds: 60,
        exercises: [
          { name: "Élévations latérales haltères", reps: "12-15", rpe: 7, weightType: "haltères",
            note: "Charge légère. Bras légèrement en avant du corps, jusqu'à hauteur d'épaules maximum, sans hausser les épaules. Côté limité : on s'arrête avant la gêne." },
          { name: "Extension triceps à la poulie", reps: "12-15", rpe: 7, weightType: "machine",
            note: "À la corde. Coudes fixes le long du corps, on écarte la corde en bas." },
        ],
      }, id),
      exBlock(id(), {
        name: "Course / marche alternée", sets: 5, reps: "1 min de course", mode: "time", duration: 60, rest: 30, rpe: 8,
        weightType: "poids du corps",
        note: "Finisher : 5 × 1 min de course, avec 30 s de marche entre chaque. Allure soutenue mais régulière, tu dois pouvoir tenir les 5 répétitions.",
      }),
    ],
  });
};

// ══════════════════════════════════════════════════════════════════════════════
// SÉANCE 3 — Bas B : fessiers + ischios
// ══════════════════════════════════════════════════════════════════════════════
const seance3 = () => {
  const id = makeIdGen("s1d3");
  return makeWorkout({
    name: "Rachel · S1 · Séance 3 — Bas B : fessiers + ischios",
    description: desc("Structure : 2 exercices lourds en séries classiques (hip thrust lourd, soulevé de terre roumain), puis 2 supersets (kickback poulie + squat sumo, puis leg curl + extension à 45°), puis un finisher EMOM de 10 min."),
    blocks: [
      warmupBlock(id(), [
        ...SHOULDER_WARMUP,
        { name: "Marche latérale élastique (band walk)", reps: "2 × 12 pas / côté", note: "Élastique au-dessus des genoux, genoux poussés vers l'extérieur." },
      ], id),
      exBlock(id(), {
        name: "Hip thrust barre", sets: 4, reps: "8-10", rest: 120, tempo: "2-0-1-1", rpe: 7,
        weightType: "barre",
        note: "Plus lourd que lundi. Menton rentré, tibias verticaux en haut, on serre les fessiers 1 s sans cambrer.",
      }),
      exBlock(id(), {
        name: "Soulevé de terre roumain (RDL)", sets: 3, reps: "10", rest: 120, tempo: "3-0-1-0", rpe: 7,
        weightType: "haltères",
        note: "Dos neutre, on pousse les hanches vers l'arrière, haltères le long des cuisses. On descend jusqu'à l'étirement des ischios, pas plus.",
      }),
      circuitBlock(id(), {
        rounds: 3, restBetweenRounds: 75,
        exercises: [
          { name: "Cable kickback (extension de hanche à la poulie)", reps: "12-15 / jambe", rpe: 7, weightType: "machine",
            note: "Buste penché, on pousse le talon vers l'arrière sans cambrer. Contraction 1 s." },
          { name: "Squat sumo", reps: "12", tempo: "2-0-1-0", rpe: 7, weightType: "kettlebell",
            note: "Pieds larges, pointes ouvertes, haltère ou kettlebell tenu entre les jambes. Genoux dans l'axe des pieds, on pousse dans les talons." },
        ],
      }, id),
      circuitBlock(id(), {
        rounds: 3, restBetweenRounds: 75,
        exercises: [
          { name: "Leg curl allongé", reps: "12", tempo: "1-0-1-3", rpe: 7, weightType: "machine",
            note: "Bassin plaqué au banc, descente contrôlée en 3 s." },
          { name: "Extension du dos à 45° (biais fessier)", reps: "12-15", rpe: 7, weightType: "poids du corps",
            note: "Au banc à lombaires (back extension). Dos légèrement arrondi, regard vers le sol, pieds ouverts. On remonte en serrant les fessiers, sans hyperextension." },
        ],
      }, id),
      circuitBlock(id(), {
        rounds: 5, restBetweenRounds: 10,
        exercises: [
          { name: "Vélo ou rameur", reps: "12 calories", rpe: 8, weightType: "poids du corps", technique: "EMOM 10 min",
            note: "Finisher EMOM : lance un chrono de 10 min. Minutes impaires : 12 calories de vélo, puis repos jusqu'à la minute suivante." },
          { name: "Fentes marchées dynamiques", reps: "10", rpe: 8, weightType: "poids du corps",
            note: "Minutes paires : 10 fentes marchées, puis repos jusqu'à la minute suivante." },
        ],
      }, id),
    ],
  });
};

// ── Fiches médiathèque (créées seulement si le nom n'existe pas encore) ────────
const CATALOGUE = [
  { nom: "Rotation externe élastique", categorie: "Échauffement & Mobilité",
    positionnement: "Debout, élastique tenu à hauteur de coude, coude collé au corps et plié à 90°, avant-bras devant le ventre.",
    execution: "Faire pivoter l'avant-bras vers l'extérieur en gardant le coude contre le corps, puis revenir lentement.",
    respiration: "Expiration pendant la rotation vers l'extérieur, inspiration au retour.",
    vigilance: "Mouvement lent, sans hausser l'épaule. Élastique léger : c'est un exercice de préparation, pas de force." },
  { nom: "Wall slides", categorie: "Échauffement & Mobilité",
    positionnement: "Dos contre un mur, pieds à 20 cm du mur, bas du dos proche du mur, avant-bras contre le mur en position de W.",
    execution: "Faire glisser les avant-bras vers le haut le long du mur, puis redescendre en rapprochant les omoplates.",
    respiration: "Expiration à la montée, inspiration à la descente.",
    vigilance: "Uniquement dans l'amplitude sans douleur. On ne cambre pas pour monter plus haut." },
  { nom: "Ouverture thoracique à quatre pattes", categorie: "Échauffement & Mobilité",
    positionnement: "À quatre pattes, une main derrière la tête, l'autre main au sol sous l'épaule.",
    execution: "Faire tourner le buste pour amener le coude vers le plafond, puis revenir vers le coude opposé.",
    respiration: "Expiration à l'ouverture, inspiration au retour.",
    vigilance: "La rotation vient du haut du dos, le bassin reste fixe." },
  { nom: "Band pull-apart", categorie: "Échauffement & Mobilité",
    positionnement: "Debout, élastique tenu devant soi à hauteur de poitrine, bras tendus, mains écartées largeur d'épaules.",
    execution: "Écarter l'élastique en ouvrant les bras jusqu'à rapprocher les omoplates, revenir en contrôlant.",
    respiration: "Expiration à l'ouverture, inspiration au retour.",
    vigilance: "Épaules basses, on ne cambre pas. Élastique léger." },
  { nom: "Fente arrière à la barre guidée", categorie: "Machines guidées (salle de sport)",
    positionnement: "Debout sous la barre guidée (Smith), barre posée sur le haut du dos, pieds largeur de hanches.",
    execution: "Reculer une jambe en grand pas, descendre jusqu'à ce que le genou arrière frôle le sol, remonter en poussant dans le talon de la jambe avant.",
    respiration: "Inspiration à la descente, expiration à la remontée.",
    vigilance: "Buste légèrement penché vers l'avant pour cibler les fessiers. Genou avant dans l'axe du pied. Si la barre gêne l'épaule, prise plus large." },
  { nom: "Dead bug", categorie: "Poids du corps",
    positionnement: "Allongée sur le dos, bas du dos plaqué au sol, bras vers le plafond, hanches et genoux à 90°.",
    execution: "Étendre un bras et la jambe opposée vers le sol sans décoller le bas du dos, revenir, puis changer de côté.",
    respiration: "Expiration pendant l'extension, inspiration au retour.",
    vigilance: "Le bas du dos ne décolle jamais. Bras dans l'amplitude confortable pour l'épaule." },
  { nom: "Pompes inclinées (mains sur banc)", categorie: "Poids du corps",
    positionnement: "Mains sur un banc, légèrement plus écartées que les épaules, corps gainé en ligne des talons à la tête.",
    execution: "Descendre la poitrine vers le banc en pliant les coudes à environ 45° du corps, puis pousser pour remonter.",
    respiration: "Inspiration à la descente, expiration à la poussée.",
    vigilance: "Les hanches ne s'affaissent pas. Plus le banc est haut, plus l'exercice est facile." },
  { nom: "Landmine press unilatéral", categorie: "Musculation avec charges",
    positionnement: "Debout ou à genoux, l'extrémité d'une barre calée dans un coin ou un support landmine, l'autre extrémité tenue à hauteur d'épaule.",
    execution: "Pousser la barre vers le haut et vers l'avant en diagonale jusqu'à tendre le bras, revenir en contrôlant.",
    respiration: "Expiration à la poussée, inspiration au retour.",
    vigilance: "Bonne alternative au développé vertical pour une épaule à la mobilité limitée. Gainage serré, pas de cambrure." },
  { nom: "Squat sumo", categorie: "Musculation avec charges",
    positionnement: "Pieds plus larges que les épaules, pointes de pieds ouvertes, haltère ou kettlebell tenu à bras tendus entre les jambes.",
    execution: "Descendre en poussant les genoux vers l'extérieur, buste droit, puis remonter en poussant dans les talons et en serrant les fessiers.",
    respiration: "Inspiration à la descente, expiration à la remontée.",
    vigilance: "Genoux dans l'axe des pieds, ils ne rentrent pas vers l'intérieur. Dos neutre." },
  { nom: "Course / marche alternée", categorie: "Fonctionnel",
    positionnement: "Sur tapis de course ou en extérieur, chaussures de course.",
    execution: "Alterner 1 min de course à allure soutenue et 30 s de marche active pour récupérer.",
    respiration: "Respiration régulière, rythmée sur la foulée.",
    vigilance: "Allure que l'on peut tenir sur toutes les répétitions. En cas de gêne aux genoux, passer en marche rapide inclinée." },
];

const program = {
  version: 1,
  program_name: "Rachel — Fessiers & Recomposition (Bloc 1, S1)",
  client: "Rachel",
  assign: true,
  archive_existing_named: false,
  catalogue_category_default: "Musculation avec charges",
  catalogue: CATALOGUE,
  workouts: [seance1(), seance2(), seance3()],
};

const out = resolve(__dirname, "../programs/rachel/bloc1-fessiers-recomposition-s1.json");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(program, null, 2) + "\n");
console.log(`✓ ${out} — ${program.workouts.length} séances`);
