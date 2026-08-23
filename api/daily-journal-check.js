// Vercel Cron → envoie chaque matin la liste des clientes actives qui n'ont pas rempli leur
// journal la veille. Mêmes variables d'environnement requises que weekly-report.js
// (SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, CRON_SECRET).

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://wetjzebxuyefzvulujxl.supabase.co";
const COACH_EMAIL = "mallardnina16@gmail.com";

const supabase = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const sendEmail = async ({ to, subject, html }) => {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${process.env.RESEND_API_KEY}` },
    body: JSON.stringify({ from: "Her Process <onboarding@resend.dev>", to: [to], subject, html }),
  });
  if (!r.ok) throw new Error("Resend: " + await r.text());
};

export default async function handler(req, res) {
  if (process.env.CRON_SECRET && req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().slice(0, 10);

    const { data: clients, error: clientsErr } = await supabase.from("clients").select("id, name").eq("is_paused", false).eq("contract_ended", false);
    if (clientsErr) throw clientsErr;
    if (!clients?.length) { res.status(200).json({ sent: false, reason: "no active clients" }); return; }

    const { data: entries, error: entriesErr } = await supabase.from("entries").select("client_id").eq("date", yesterdayKey);
    if (entriesErr) throw entriesErr;
    const filledIds = new Set((entries || []).map(e => e.client_id));
    const missing = clients.filter(c => !filledIds.has(c.id));

    if (missing.length === 0) { res.status(200).json({ sent: false, reason: "all filled" }); return; }

    const html = `
      <div style="font-family:-apple-system,sans-serif;max-width:480px;margin:0 auto;color:#222;">
        <h2 style="color:#4b0f0f;">Journal non rempli hier (${yesterday.toLocaleDateString("fr-FR")})</h2>
        <ul style="font-size:14px;line-height:1.8;">
          ${missing.map(c => `<li>${c.name}</li>`).join("")}
        </ul>
      </div>`;

    await sendEmail({ to: COACH_EMAIL, subject: `${missing.length} cliente${missing.length > 1 ? "s" : ""} n'ont pas rempli leur journal hier`, html });
    res.status(200).json({ sent: true, missing: missing.map(c => c.name) });
  } catch (err) {
    console.error("daily-journal-check error", err);
    res.status(500).json({ error: String(err.message || err) });
  }
}
