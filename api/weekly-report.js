// Vercel Cron → envoie chaque dimanche soir un bilan hebdomadaire de chaque cliente active
// (régularité, balance énergétique, nutrition moyenne, activité) pour la semaine qui vient
// de se terminer (lundi → dimanche).
//
// Variables d'environnement requises (Vercel → Settings → Environment Variables) :
//   SUPABASE_SERVICE_ROLE_KEY  — Supabase → Settings → API → "service_role" secret key
//                                 (JAMAIS la clé anon, celle-ci contourne les policies RLS —
//                                 c'est nécessaire ici car ce script tourne sans session
//                                 utilisatrice, mais elle ne doit JAMAIS être utilisée côté client)
//   RESEND_API_KEY             — clé API Resend
//   CRON_SECRET                — chaîne aléatoire de ton choix, protège cet endpoint contre
//                                 des appels extérieurs non désirés

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://wetjzebxuyefzvulujxl.supabase.co";
const COACH_EMAIL = "mallardnina16@gmail.com";

const supabase = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// ── Mêmes calculs purs que dans l'app (src/App.jsx) — dupliqués ici car cette fonction
// tourne dans un contexte serveur séparé, sans accès au bundle React de l'app. ──
const calcAge = (birthDate) => {
  if (!birthDate) return null;
  const b = new Date(birthDate);
  if (isNaN(b.getTime())) return null;
  return Math.floor((Date.now() - b.getTime()) / (365.25 * 86400000));
};
const calcBMR = ({ sex, weightKg, heightCm, age }) => {
  if (!sex || !weightKg || !heightCm || !age) return null;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(sex === "F" ? base - 161 : base + 5);
};
const stepsToCalories = (steps, weightKg) => (steps && weightKg) ? Math.round(steps * weightKg * 0.0005) : 0;
const daySportCalories = (sessions = []) => {
  const watch = sessions.find(s => s.source === "watch");
  if (watch) return watch.calories || 0;
  return sessions.reduce((sum, s) => sum + (s.calories || 0), 0);
};
const calcDailyEnergy = ({ profile, weightKg, steps, activitySessions = [] }) => {
  const age = calcAge(profile?.birth_date);
  const bmr = calcBMR({ sex: profile?.sex, weightKg, heightCm: profile?.height_cm, age });
  if (!bmr) return null;
  return { bmr, neat: stepsToCalories(steps, weightKg), sport: daySportCalories(activitySessions), tdee: bmr + stepsToCalories(steps, weightKg) + daySportCalories(activitySessions) };
};
const startOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() + (day === 0 ? -6 : 1) - day);
  return d;
};
const dayKey = d => d.toISOString().slice(0, 10);
const isoWeekDates = (date) => {
  const monday = startOfWeek(new Date(date));
  return Array.from({ length: 7 }, (_, i) => { const d = new Date(monday); d.setDate(d.getDate() + i); return dayKey(d); });
};
const calcWeeklySummary = ({ entries = [], meals = [], activitySessions = [], weights = [], profile, weekDates }) => {
  const weekEntries = entries.filter(e => weekDates.includes(e.date));
  const weekMeals = meals.filter(m => weekDates.includes(m.date));
  const weekActivity = activitySessions.filter(a => weekDates.includes(a.date));
  const mealDays = [...new Set(weekMeals.map(m => m.date))];
  const sumMeals = key => weekMeals.reduce((s, m) => s + (m[key] || 0), 0);
  const avgOverMealDays = key => mealDays.length ? Math.round(sumMeals(key) / mealDays.length) : null;

  let balanceSum = 0, balanceDays = 0;
  weekDates.forEach(d => {
    const entry = weekEntries.find(e => e.date === d);
    const dayMeals = weekMeals.filter(m => m.date === d);
    if (!entry || dayMeals.length === 0) return;
    const weightForDate = [...weights].reverse().find(w => w.date <= d) || weights[0];
    const energy = calcDailyEnergy({ profile, weightKg: weightForDate?.value, steps: entry.steps, activitySessions: weekActivity.filter(a => a.date === d) });
    if (!energy) return;
    balanceSum += dayMeals.reduce((s, m) => s + (m.calories || 0), 0) - energy.tdee;
    balanceDays++;
  });

  const stepsEntries = weekEntries.filter(e => e.steps);
  const avgSteps = stepsEntries.length ? Math.round(stepsEntries.reduce((s, e) => s + e.steps, 0) / stepsEntries.length) : null;

  return {
    daysCompleted: weekDates.filter(d => weekEntries.some(e => e.date === d)).length,
    totalDays: weekDates.length,
    avgCalories: avgOverMealDays("calories"), avgProtein: avgOverMealDays("protein_g"),
    balanceTotal: balanceDays ? Math.round(balanceSum) : null,
    avgSteps, sessionsCount: weekActivity.length,
  };
};

const sendEmail = async ({ to, subject, html }) => {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${process.env.RESEND_API_KEY}` },
    body: JSON.stringify({ from: "Her Process <onboarding@resend.dev>", to: [to], subject, html }),
  });
  if (!r.ok) throw new Error("Resend: " + await r.text());
};

const fmt = (v, unit = "") => v == null ? "—" : `${v}${unit}`;

const buildEmailHtml = (weekDates, rows) => {
  const rowsHtml = rows.map(({ name, summary }) => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;">${name}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${summary.daysCompleted}/${summary.totalDays}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${fmt(summary.balanceTotal, " kcal")}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${fmt(summary.avgCalories)}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${fmt(summary.avgProtein, "g")}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${fmt(summary.avgSteps)}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${summary.sessionsCount}</td>
    </tr>`).join("");
  return `
    <div style="font-family:-apple-system,sans-serif;max-width:680px;margin:0 auto;color:#222;">
      <h2 style="color:#4b0f0f;">Bilan hebdomadaire — semaine du ${new Date(weekDates[0]).toLocaleDateString("fr-FR")} au ${new Date(weekDates[6]).toLocaleDateString("fr-FR")}</h2>
      <p style="color:#666;font-size:13px;">Détail complet disponible dans l'app, onglet "Bilan" de chaque cliente.</p>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <thead><tr style="text-align:center;color:#888;">
          <th style="padding:8px;text-align:left;">Cliente</th><th>Régularité</th><th>Balance cumulée</th><th>Kcal/j</th><th>Prot/j</th><th>Pas/j</th><th>Séances</th>
        </tr></thead>
        <tbody>${rowsHtml}</tbody>
      </table>
    </div>`;
};

export default async function handler(req, res) {
  if (process.env.CRON_SECRET && req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }
  try {
    const thisMonday = startOfWeek(new Date());
    const lastMonday = new Date(thisMonday);
    lastMonday.setDate(lastMonday.getDate() - 7);
    const weekDates = isoWeekDates(lastMonday);

    const { data: clients, error: clientsErr } = await supabase.from("clients").select("id, name").eq("is_paused", false).eq("contract_ended", false);
    if (clientsErr) throw clientsErr;
    if (!clients?.length) { res.status(200).json({ sent: false, reason: "no active clients" }); return; }

    const rows = [];
    for (const c of clients) {
      const [entriesRes, mealsRes, activityRes, weightsRes, profileRes] = await Promise.all([
        supabase.from("entries").select("date, steps").eq("client_id", c.id).gte("date", weekDates[0]).lte("date", weekDates[6]),
        supabase.from("meals").select("date, calories, protein_g, carb_g, fat_g, fiber_g, sugar_g").eq("client_id", c.id).gte("date", weekDates[0]).lte("date", weekDates[6]),
        supabase.from("activity_sessions").select("date, duration_min, calories, source").eq("client_id", c.id).gte("date", weekDates[0]).lte("date", weekDates[6]),
        supabase.from("weights").select("date, value").eq("client_id", c.id).order("date"),
        supabase.from("client_profiles").select("*").eq("client_id", c.id).maybeSingle(),
      ]);
      const summary = calcWeeklySummary({
        entries: entriesRes.data || [], meals: mealsRes.data || [], activitySessions: activityRes.data || [],
        weights: weightsRes.data || [], profile: profileRes.data, weekDates,
      });
      rows.push({ name: c.name, summary });
    }

    await sendEmail({
      to: COACH_EMAIL,
      subject: `Bilan hebdo — semaine du ${new Date(weekDates[0]).toLocaleDateString("fr-FR")}`,
      html: buildEmailHtml(weekDates, rows),
    });
    res.status(200).json({ sent: true, count: rows.length });
  } catch (err) {
    console.error("weekly-report error", err);
    res.status(500).json({ error: String(err.message || err) });
  }
}
