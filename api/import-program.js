// ══════════════════════════════════════════════════════════════════════════════
// POST /api/import-program
//
// Crée dans la base un programme complet (séances + fiches médiathèque manquantes)
// et l'assigne à une cliente. Même moteur que scripts/seed-program.mjs.
//
// Auth : en-tête `x-import-secret` (ou ?secret=) == process.env.IMPORT_SECRET
//
// Variables d'environnement (Vercel → Settings → Environment Variables) :
//   SUPABASE_SERVICE_ROLE_KEY  — déjà présente (utilisée par les crons)
//   IMPORT_SECRET              — chaîne aléatoire de ton choix, protège cet endpoint
//
// Corps JSON :
//   { "program": { …JSON de programme… }, "client": "Lidia"?, "dryRun": false? }
// ou directement l'objet programme.
// ══════════════════════════════════════════════════════════════════════════════

import { createClient } from "@supabase/supabase-js";
import { importProgram } from "../scripts/lib/importProgram.mjs";
import { makeSupabaseDb } from "../scripts/lib/db-supabase.mjs";

const SUPABASE_URL = "https://wetjzebxuyefzvulujxl.supabase.co";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Méthode non autorisée (POST attendu)." });
  }

  const secret = process.env.IMPORT_SECRET;
  if (!secret) return res.status(503).json({ error: "IMPORT_SECRET non configuré sur le serveur." });

  const provided = req.headers["x-import-secret"] || req.query?.secret;
  if (provided !== secret) return res.status(401).json({ error: "Secret invalide." });

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return res.status(503).json({ error: "SUPABASE_SERVICE_ROLE_KEY absente." });

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { return res.status(400).json({ error: "JSON illisible." }); } }
  if (!body || typeof body !== "object") return res.status(400).json({ error: "Corps JSON manquant." });

  const program = body.program && body.workouts === undefined ? body.program : body;
  const clientOverride = body.client;
  const dryRun = !!body.dryRun;

  const supabase = createClient(SUPABASE_URL, key, { auth: { persistSession: false } });
  const db = makeSupabaseDb(supabase);

  try {
    const logs = [];
    const report = await importProgram(db, program, {
      dryRun,
      clientOverride,
      onLog: (m) => logs.push(m),
    });
    return res.status(200).json({ ok: true, report, logs });
  } catch (err) {
    return res.status(422).json({ ok: false, error: err.message, details: err.details || null });
  }
}
