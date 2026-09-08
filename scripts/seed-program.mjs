#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════════
// seed-program.mjs — écrit un programme dans la base Processlab, en local.
// Aucune dépendance npm : `fetch` pur vers l'API REST de Supabase.
//
//   SUPABASE_SERVICE_ROLE_KEY='xxx' node scripts/seed-program.mjs programs/lidia-batir-en-deficit.json
//
// Options :
//   --dry-run            n'écrit rien, montre ce qui serait fait
//   --client "Prénom"    force la cliente (sinon on prend `client` du JSON)
//   --no-assign          crée les séances sans les rattacher à une cliente
//
// La clé service-role : Supabase → Settings → API → "service_role".
// Elle contourne les RLS : ne jamais la committer ni l'exposer côté client.
// ══════════════════════════════════════════════════════════════════════════════

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { importProgram } from "./lib/importProgram.mjs";
import { makeRestDb } from "./lib/db-rest.mjs";

const SUPABASE_URL = "https://wetjzebxuyefzvulujxl.supabase.co";

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
const dryRun = args.includes("--dry-run");
const noAssign = args.includes("--no-assign");
const clientIdx = args.indexOf("--client");
const clientOverride = clientIdx >= 0 ? args[clientIdx + 1] : undefined;

if (!file) {
  console.error('Usage : node scripts/seed-program.mjs <programme.json> [--dry-run] [--client "Prénom"] [--no-assign]');
  process.exit(1);
}

const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!key) {
  console.error("✗ Variable SUPABASE_SERVICE_ROLE_KEY absente.");
  console.error(`  SUPABASE_SERVICE_ROLE_KEY='...' node scripts/seed-program.mjs ${file}`);
  process.exit(1);
}

const program = JSON.parse(readFileSync(resolve(process.cwd(), file), "utf8"));
if (noAssign) program.assign = false;

const db = makeRestDb(SUPABASE_URL, key);

console.log(`\n▶ ${dryRun ? "[DRY-RUN] " : ""}Import de "${program.program_name || file}"\n`);

try {
  const report = await importProgram(db, program, {
    dryRun,
    clientOverride,
    onLog: (m) => console.log("  " + m),
  });

  console.log("\n── Résultat ─────────────────────────────────────────");
  if (report.client) console.log(`Cliente          : ${report.client}`);
  console.log(`Séances créées   : ${report.workoutsCreated.length}`);
  console.log(`Assignations     : ${report.assignments}`);
  console.log(`Médiathèque +    : ${report.catalogueCreated.length} (${report.catalogueSkipped.length} déjà présentes)`);
  if (report.nameCollisions.length)
    console.log(`⚠ Noms déjà utilisés (doublons créés) : ${report.nameCollisions.join(", ")}`);
  console.log("─────────────────────────────────────────────────────");
  console.log(dryRun ? "\nRien n'a été écrit (--dry-run).\n" : "\n✅ Terminé.\n");
} catch (err) {
  console.error("\n✗ Échec :", err.message);
  if (err.details) err.details.forEach((d) => console.error("  - " + d));
  process.exit(1);
}
