# Bibliothèque de programmes

Un dossier par cliente, nommé en minuscules par son prénom. À l'intérieur, un fichier JSON par bloc de programme (format décrit dans `docs/program-spec.md`).

```
programs/
  <prenom>/
    bloc1-<slug-du-programme>.json
    bloc2-<slug-du-programme>.json
    ...
```

Les dossiers sont classés alphabétiquement par le Finder/l'explorateur de fichiers — pas besoin de sous-dossiers par lettre, il suffit de défiler jusqu'au prénom.

**Convention de nommage à l'intérieur du JSON :**
- `program_name` commence par le prénom : `"Wanissa — Reprise & Recomposition (Bloc 1, S1 à S4)"`
- Chaque `workouts[].name` commence aussi par le prénom : `"Wanissa · S1 · Séance 1 — ..."` — utile une fois importé dans l'appli, où l'onglet Séances liste tous les programmes de toutes les clientes ensemble.

Un nouveau bloc pour une cliente existante va dans son dossier ; une nouvelle cliente reçoit un nouveau dossier à son prénom.
