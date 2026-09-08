# Format « JSON de programme »

Un fichier de programme décrit **une série de séances à créer d'un coup** dans
Processlab, avec tout saisi (séries, reps, repos, tempo, RPE, technique,
consignes), les fiches médiathèque manquantes, et l'assignation à une cliente.

Trois façons de l'appliquer, **même moteur** (`scripts/lib/importProgram.mjs`) :

| Moyen | Pour qui | Commande |
|---|---|---|
| Panneau **« Importer un programme »** (onglet Séances) | la coach, avec sa session | coller le JSON → *Prévisualiser* → *Importer* |
| Script local | la coach, en CLI | `SUPABASE_SERVICE_ROLE_KEY='…' node scripts/seed-program.mjs programs/mon-programme.json` |
| Endpoint `POST /api/import-program` | automatisation | corps `{ "program": {…} }`, en-tête `x-import-secret: $IMPORT_SECRET` |

Toujours possible : `--dry-run` (script) ou *Prévisualiser* (panneau) — **n'écrit rien**.

---

## Structure

```jsonc
{
  "version": 1,
  "program_name": "Bâtir en Déficit — Lidia (6 sem.)",
  "client": "Lidia",              // prénom (recherche ilike) ou uuid de la ligne `clients`
  "assign": true,                 // false = créer les séances sans les rattacher
  "catalogue_category_default": "Musculation avec charges",

  "catalogue": [                  // fiches ajoutées SEULEMENT si `nom` absent (casse ignorée)
    {
      "nom": "Kas glute bridge",
      "categorie": "Musculation avec charges",
      "positionnement": "…",
      "execution": "…",
      "respiration": "…",
      "vigilance": "…"
    }
  ],

  "workouts": [
    {
      "name": "S1 · J1 — Extension lourde + ischios",
      "description": "Semaine 1/6 … (objectif, nutrition, NEAT)",
      "blocks": [ /* voir ci-dessous */ ],
      "exercises": [ /* optionnel : dénorm recalculée sinon */ ]
    }
  ]
}
```

Les séances sont créées **dans l'ordre du tableau** (le tri par défaut est
`created_at`). Elles sont **toujours créées à neuf** ; un nom déjà utilisé n'est
pas bloquant, il est seulement signalé dans le rapport.

---

## Les `blocks`

Format natif du WorkoutBuilder. Trois types.

### `exercise` — exercice simple

```jsonc
{
  "id": "s1d1-2",                 // unique dans la séance
  "type": "exercise",
  "name": "Hip thrust barre",
  "sets": 4,
  "reps": "8",                    // texte libre : "8", "10 / côté", "max (viser 10+)"
  "mode": "reps",                 // "reps" | "time"
  "duration": 30,                 // si mode "time"
  "rest": 150,                    // repos après l'exercice, en secondes
  "tempo": "2-0-1-1",             // desc-bas-mont-haut, optionnel
  "rpe": "7",                     // optionnel — badge côté élève
  "technique": "Dropset : 1 × -25 %",   // optionnel — dropset / rest-pause / AMRAP / myo-reps…
  "suggested_weight": "100",      // texte libre : "100", "2×30", "poids du corps"
  "weight_type": "barre",         // barre | haltères | machine | disques | kettlebell | élastique | poids du corps …
  "note": "Consigne technique courte.",
  "photo": null                   // toujours null à l'import, chargée à la main ensuite
}
```

### `circuit` — superset / circuit / interval

Un **superset** = un circuit de 2 exercices, `rounds` = nombre de séries,
`rest_between_rounds` = repos après la paire.

```jsonc
{
  "id": "s1d1-4",
  "type": "circuit",
  "rounds": 3,
  "rest_between_rounds": 90,
  "interval_mode": false,         // true = timer travail/repos par exo
  "exercises": [
    {
      "id": "s1d1-4a",
      "name": "Leg curl allongé",
      "reps": "12", "mode": "reps", "duration": 30,
      "work_time": 30, "rest_time": 30,   // si interval_mode
      "tempo": "", "rpe": "8", "technique": "",
      "suggested_weight": "", "weight_type": "machine",
      "note": "…"
    }
  ]
}
```

### `warmup` — échauffement

```jsonc
{
  "id": "s1d1-1",
  "type": "warmup",
  "exercises": [
    { "id": "s1d1-1a", "name": "Vélo ou rameur", "reps": "5 min", "note": "Allure progressive.", "photo": null }
  ]
}
```

---

## Générer un programme par code

`scripts/build-lidia-program.mjs` est un exemple complet : il définit 4 séances
type + une matrice de progression sur 6 semaines et écrit le JSON. Pour un
nouveau programme, dupliquer ce fichier, ajuster les tables, lancer :

```bash
node scripts/build-mon-programme.mjs        # → programs/mon-programme.json
node scripts/seed-program.mjs programs/mon-programme.json --dry-run
```

Les helpers `scripts/lib/programBlocks.mjs` (`exBlock`, `circuitBlock`,
`warmupBlock`, `makeWorkout`) produisent des blocs valides et la dénorm
`exercises` automatiquement.

---

## Workflow de correction

1. La coach envoie un programme (texte libre, tableur, ou brouillon JSON).
2. Correction + complétion au format ci-dessus (RPE, technique, repos, tempo,
   consignes, fiches médiathèque manquantes).
3. Retour : le JSON + un récap des changements.
4. La coach *Prévisualise* puis *Importe* dans l'onglet Séances (ou l'endpoint
   s'en charge). Elle ne fait plus que charger les photos.
