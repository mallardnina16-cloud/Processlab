import { useState, useEffect, useRef, Children, cloneElement } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { importProgram } from "../scripts/lib/importProgram.mjs";
import { makeSupabaseDb } from "../scripts/lib/db-supabase.mjs";
import { C, F, BRAND_NAME } from "./theme.js";
import { usePrefersReducedMotion, Logo, Card, Btn, inputSt, Inp, TA, Avatar, Badge, SectionTitle, PremiumHero, Tab, ALPHABET, AlphaIndex, Spinner, Icon, useIsWide, UnderlineTabs, Segmented, Eyebrow, DayPicker, NumField } from "./ui.jsx";

const SUPABASE_URL = "https://wetjzebxuyefzvulujxl.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndldGp6ZWJ4dXllZnp2dWx1anhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0OTUxMDcsImV4cCI6MjA5MTA3MTEwN30.8DvkApXsMT7hGahVQD5kpAJdD92Tzyo7qC0nwmnGEaU";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const COACH_EMAIL = "mallardnina16@gmail.com";
const CONTRACT_TEXT = {
  sections: [
    {
      title: "1. Organisation des séances",
      lines: [
        "Une séance peut être annulée ou déplacée jusqu'à la veille avant 20h, sans pénalité.",
        "Passé ce délai, une séance annulée le jour même est considérée comme prise, sauf circonstance réelle et exceptionnelle, à mon appréciation.",
        "Une séance annulée dans les règles peut être rattrapée dans le mois de coaching en cours (4 semaines), sauf si l'annulation intervient lors de la dernière semaine — dans ce cas, le rattrapage se fait en tout début du mois suivant.",
        "En cas de retard, la séance se termine à l'heure prévue initialement, afin de respecter le planning des autres clientes.",
      ],
    },
    {
      title: "2. Paiement",
      lines: [
        "Le règlement du mois de coaching doit être effectué avant le début de la dernière semaine du cycle.",
        "Un mois de coaching correspond à 4 semaines glissantes, pas au mois calendaire.",
      ],
    },
    {
      title: "3. Engagement personnel",
      lines: [
        "Le journal quotidien (alimentation, ressenti, séances) est un outil de suivi essentiel — je m'engage à le remplir avec assiduité pour permettre un accompagnement de qualité.",
        "Je m'engage à signaler toute douleur, gêne physique ou contre-indication médicale, avant ou pendant une séance.",
        "Je viens en tenue adaptée à l'effort physique, avec mon eau et le nécessaire pour la séance.",
      ],
    },
    {
      title: "4. Parrainage",
      lines: [
        "Toute personne parrainée qui débute un accompagnement m'offre une séance de coaching, créditée dès la première séance de la personne parrainée.",
      ],
    },
    {
      title: "5. Confidentialité",
      lines: [
        "Les données partagées (mesures, poids, photos, journal) restent strictement confidentielles entre nous.",
        "Aucune photo ou donnée ne sera utilisée publiquement (réseaux sociaux, communication) sans mon accord explicite préalable.",
      ],
    },
    {
      title: "6. Responsabilité et santé",
      lines: [
        "La pratique sportive comporte des risques inhérents à l'effort physique. Il est de ma responsabilité de t'informer de toute condition médicale, blessure ou contre-indication existante avant de commencer un programme, et de signaler tout changement en cours d'accompagnement.",
        "En cas de douleur inhabituelle ou de gêne persistante, je m'engage à interrompre l'exercice concerné et à t'en informer avant de poursuivre.",
      ],
    },
    {
      title: "7. Spécificités du suivi à distance",
      lines: [
        "Je m'engage à réaliser les séances aux jours convenus dans mon planning, dans la mesure de mes possibilités, et à te prévenir si je dois décaler une séance.",
        "Je m'engage à être transparente sur mon ressenti, mes difficultés et mes résultats afin que tu puisses ajuster mon accompagnement au mieux.",
        "Je m'engage à te signaler rapidement si un exercice ne me convient pas, plutôt que de sauter la séance ou de mal l'exécuter en silence.",
        "Un point vocal complet est prévu une fois par semaine ou toutes les deux semaines, selon mon évolution et mes besoins.",
        "Je peux t'envoyer une vidéo de moi sur un exercice pour que tu puisses corriger ma technique à distance.",
      ],
    },
  ],
  coachLines: [
    "Toute séance que je manque de mon fait est systématiquement rendue.",
    "Toute annulation de ma part te sera communiquée le plus tôt possible, avec un minimum de 12h de préavis sauf urgence réelle.",
    "Je reste disponible par téléphone en cas de besoin entre les séances.",
    "Je m'engage à répondre à tes messages sous 24h.",
    "Je m'engage à tenir le point vocal hebdomadaire ou bimensuel convenu, sauf empêchement signalé à l'avance.",
    "Je révise ton programme régulièrement pour qu'il continue de correspondre à ton évolution et tes objectifs.",
    "Tes données personnelles et physiques ne sont jamais partagées sans ton accord.",
  ],
};





// Ligne cliquable façon dossier (clientes, programmes de l'onglet Séances).
const FolderRow = ({ title, subtitle, onClick, muted = false }) => (
  <button onClick={onClick} style={{
    width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
    background: C.field, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px",
    marginBottom: 10, cursor: "pointer", textAlign: "left", color: muted ? C.textMuted : C.white,
  }}>
    <div>
      <div style={{ fontWeight: 800, fontSize: 15 }}>{title}</div>
      {subtitle && <div style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>{subtitle}</div>}
    </div>
    <span style={{ color: C.textMuted, fontSize: 18 }}>›</span>
  </button>
);
const crumbSt = { background: "none", border: "none", color: C.pink, cursor: "pointer", padding: 0, fontSize: 13, fontWeight: 700 };

const QuickAction = ({ title, subtitle, icon, onClick, accent = C.pink }) => (
  <button onClick={onClick} style={{
    background: C.field, border: `1px solid ${accent}22`, borderRadius: 12, padding: "12px 12px",
    textAlign: "left", cursor: "pointer", color: C.white, display: "flex", alignItems: "center", gap: 10,
  }}>
    <div style={{ width: 34, height: 34, borderRadius: 10, background: accent + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{icon}</div>
    <div style={{ minWidth: 0 }}>
      <div style={{ fontWeight: 700, fontSize: 13 }}>{title}</div>
      <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{subtitle}</div>
    </div>
  </button>
);

// Mise en page commune des écrans de l'espace cliente (calibrés téléphone)
const SCREEN = { minHeight: "100vh", background: C.black, color: C.white, fontFamily: F.sans, padding: "20px 16px 110px", maxWidth: 560, margin: "0 auto" };
const H1 = { fontFamily: F.serif, fontWeight: 400, fontSize: 32, letterSpacing: "-0.6px", color: C.heading, margin: "8px 0 16px" };
const CLIENT_TABS = [["home", "home", "Aujourd'hui"], ["repas", "fork", "Repas"], ["perfs", "dumbbell", "Séances"], ["body", "chart", "Progrès"], ["contrat", "user", "Moi"]];
// Écrans secondaires rattachés à un onglet (pour garder l'onglet allumé)
const CLIENT_TAB_OF = { history: "body", bilan: "body", journal: "home" };
const ClientBottomNav = ({ currentScreen, onNavigate }) => {
  const active = CLIENT_TAB_OF[currentScreen] || currentScreen;
  return (
    <nav style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 50, background: C.card, borderTop: `1px solid ${C.border}`, padding: "8px 4px calc(10px + env(safe-area-inset-bottom, 0px))" }}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${CLIENT_TABS.length}, 1fr)`, maxWidth: 560, margin: "0 auto" }}>
        {CLIENT_TABS.map(([key, icon, label]) => (
          <button key={key} onClick={() => { onNavigate(key); window.scrollTo(0, 0); }} style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "4px 0", color: active === key ? C.cherry : C.textMuted, fontWeight: active === key ? 650 : 500, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
            <Icon name={icon} size={23} />{label}
          </button>
        ))}
      </div>
    </nav>
  );
};

const ClientOnboarding = ({ clientName, onFinish, onEnableReminders, reminderEnabled }) => {
  const [step, setStep] = useState(0);
  const steps = [
    { title: "Bienvenue", text: `Bonjour ${clientName?.split(" ")[0] || "toi"} 👋`, detail: "Ton espace est pensé pour te guider pas à pas, sans surcharge." },
    { title: "Ton journal", text: "Remplis ton journal chaque jour", detail: "Un rapide check-in te permet de garder un suivi clair avec ton coach." },
    { title: "Tes séances", text: "Accède à tes entraînements à tout moment", detail: "Tu retrouves tes séances prévues et l’historique de tes performances." },
    { title: "Rappels", text: reminderEnabled ? "Tes rappels sont déjà prêts" : "Active les rappels pour ne rien oublier", detail: "Tu recevras des notifications utiles sans te disperser." },
  ];
  const current = steps[step];
  return (
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: F.sans, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 430, background: C.card, border: `1px solid ${C.border}`, borderRadius: 24, padding: 24 }}>
        <div style={{ fontSize: 11, color: C.pink, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Bienvenue dans Nina - Her process</div>
        <h2 style={{ fontSize: 24, fontFamily: F.serif, fontWeight: 400, letterSpacing: "-0.5px", color: C.heading, margin: "0 0 8px" }}>{current.title}</h2>
        <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.5, margin: "0 0 20px" }}>{current.text}</p>
        <div style={{ background: C.field, borderRadius: 12, padding: 14, marginBottom: 18 }}>
          <div style={{ fontSize: 13, color: C.white, lineHeight: 1.5 }}>{current.detail}</div>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          {steps.map((_, idx) => <div key={idx} style={{ flex: 1, height: 5, borderRadius: 999, background: idx <= step ? C.pink : C.border }} />)}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => (step < steps.length - 1 ? setStep(step + 1) : onFinish())} style={{ flex: 1, background: C.cherry, border: "none", borderRadius: 12, padding: "12px 14px", color: C.brandCream, fontWeight: 800, cursor: "pointer" }}>
            {step < steps.length - 1 ? "Continuer" : "C’est parti"}
          </button>
          {step > 0 ? (
            <button onClick={() => setStep(step - 1)} style={{ padding: "12px 14px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.field, color: C.white, cursor: "pointer" }}>Retour</button>
          ) : (
            <button onClick={onFinish} style={{ padding: "12px 14px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.field, color: C.textMuted, cursor: "pointer" }}>Passer</button>
          )}
        </div>
        {step === steps.length - 1 && !reminderEnabled && (
          <button onClick={onEnableReminders} style={{ width: "100%", marginTop: 12, padding: "12px 14px", borderRadius: 12, border: `1px solid ${C.orange}44`, background: C.orange + "15", color: C.orange, fontWeight: 700, cursor: "pointer" }}>
            🔔 Activer les rappels
          </button>
        )}
      </div>
    </div>
  );
};


const SESSION_OPTIONS = [
  { value: "done", label: "✅ Faite", color: C.green },
  { value: "rest", label: "😴 Jour de repos", color: C.blue },
  { value: "missed", label: "❌ Pas faite", color: C.red },
];
const sessionColor = v => SESSION_OPTIONS.find(o => o.value === v)?.color || C.textMuted;
const sessionLabel = v => SESSION_OPTIONS.find(o => o.value === v)?.label || "—";
const MEAL_SLOT_OPTIONS = [
  { value: "petit-déjeuner", label: "🌅 Petit-déjeuner" },
  { value: "déjeuner", label: "☀️ Déjeuner" },
  { value: "dîner", label: "🌙 Dîner" },
  { value: "collation", label: "🍎 Collation" },
];
const SEX_OPTIONS = [{ value: "F", label: "Femme" }, { value: "M", label: "Homme" }];
const NUTRITION_GOAL_OPTIONS = [
  { value: "cut", label: "Perte de poids" },
  { value: "recomp", label: "Recomposition corporelle" },
  { value: "maintain", label: "Maintien" },
  { value: "bulk", label: "Prise de masse" },
];
const nutritionGoalLabel = v => NUTRITION_GOAL_OPTIONS.find(o => o.value === v)?.label || "—";
// Une ligne entries peut exister sans que la cliente ait rempli son journal : le trigger
// meals_sync_entries la crée dès qu'un repas est noté (journal_filled = false). Seul le
// journal général compte comme « rempli ». Colonne absente (ancienne base) = rempli.
const isJournalFilled = (e) => !!e && e.journal_filled !== false;
// Objectif de protéines (g/jour) fixé par la coach dans le profil nutritionnel — null si non défini
const proteinTarget = profile => profile?.protein_target_g > 0 ? profile.protein_target_g : null;
// Objectif calorique fixé par la coach pour un jour d'entraînement ou un jour off. Un seul des
// deux renseigné = valable tous les jours. null si aucun objectif.
const kcalTarget = (profile, isTraining) => {
  const training = profile?.kcal_target_training > 0 ? profile.kcal_target_training : null;
  const rest = profile?.kcal_target_rest > 0 ? profile.kcal_target_rest : null;
  return isTraining ? (training ?? rest) : (rest ?? training);
};
// Plancher de lipides (g/jour) fixé par la coach — null si non défini
const fatFloor = profile => profile?.fat_min_g > 0 ? profile.fat_min_g : null;
// Jour d'entraînement : séance planifiée, réalisée dans l'appli ou cochée « faite » dans le journal
const isTrainingDate = (date, { schedule = [], sessionLogs = [], entries = [] } = {}) =>
  schedule.some(s => s.date === date) || sessionLogs.some(l => l.date === date) || entries.some(e => e.date === date && e.session_status === "done");
// Repas estimés par l'IA, pas, formules : 10 à 20 % de marge, on n'affiche pas au kcal près
const round50 = n => Math.round(n / 50) * 50;
// Moyenne des pesées entre deux dates incluses (null si aucune) : une pesée isolée varie
// d'un à deux kilos selon l'eau, le cycle ou le transit, la moyenne se lit mieux.
const avgWeightBetween = (weights = [], from, to) => {
  const ws = weights.filter(w => w.date >= from && w.date <= to);
  return ws.length ? ws.reduce((sum, w) => sum + Number(w.value), 0) / ws.length : null;
};
const feelings = ["😩", "😔", "😐", "🙂", "🔥"];
const feelingLabels = ["Très difficile", "Difficile", "Neutre", "Bien", "Excellent"];
const today = new Date().toISOString().slice(0, 10);
const daysUntil = d => Math.ceil((new Date(d) - new Date(today)) / 86400000);

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
};

const addDays = (dateStr, days) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

const CACHE_TTL_MS = 5 * 60 * 1000;
const getCacheKey = (key) => `nina:herprocess:${key}`;
const readCache = (key) => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(getCacheKey(key));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.ts > CACHE_TTL_MS) {
      window.sessionStorage.removeItem(getCacheKey(key));
      return null;
    }
    return parsed.value;
  } catch {
    return null;
  }
};
const writeCache = (key, value) => {
  if (typeof window === "undefined") return;
  try { window.sessionStorage.setItem(getCacheKey(key), JSON.stringify({ ts: Date.now(), value })); } catch {}
};

// Comme Promise.allSettled, mais borné dans le temps : une requête réseau qui ne répond
// jamais (wifi capricieux, portail captif...) ne bloque plus l'écran indéfiniment — au bout
// de `ms`, elle est traitée comme un échec, exactement comme une vraie erreur Supabase.
const settleWithTimeout = (promise, ms = 15000) => Promise.race([
  promise.then(value => ({ status: "fulfilled", value })).catch(reason => ({ status: "rejected", reason })),
  new Promise(resolve => setTimeout(() => resolve({ status: "rejected", reason: new Error("Délai réseau dépassé") }), ms)),
]);

// Récupère blocks + photos d'exercices pour UNE séance précise, à appeler juste avant de
// l'ouvrir (édition, aperçu, lancement) — jamais chargé pour toute la liste d'un coup. Des
// photos d'exercices jamais correctement envoyées vers le stockage (policy RLS manquante) ont
// fini stockées en base64 directement en base, gonflant une liste complète à plusieurs
// dizaines de Mo si on les charge toutes en même temps.
const fetchWorkoutDetail = async (baseWorkout) => {
  const [wRes, eRes] = await Promise.all([
    settleWithTimeout(supabase.from("workouts").select("blocks").eq("id", baseWorkout.id).single()),
    settleWithTimeout(supabase.from("exercises").select("id, photo").eq("workout_id", baseWorkout.id)),
  ]);
  if (wRes.status === "rejected") { console.error("fetchWorkoutDetail: échoué", wRes.reason); return baseWorkout; }
  const blocks = wRes.value.data?.blocks;
  const photosById = {};
  if (eRes.status === "fulfilled") (eRes.value.data || []).forEach(e => { photosById[e.id] = e.photo; });
  return {
    ...baseWorkout,
    blocks: blocks ?? baseWorkout.blocks ?? [],
    exercises: (baseWorkout.exercises || []).map(e => ({ ...e, photo: photosById[e.id] ?? e.photo })),
  };
};

// ══════════════════════════════════════════════════════════════════════════════
// DÉPENSE ÉNERGÉTIQUE — BMR (Mifflin-St Jeor), NEAT (pas), activité (MET), fiabilité
// ══════════════════════════════════════════════════════════════════════════════
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

// ~0.0005 kcal/kg par pas — approximation NEAT standard, indépendante de l'intensité de marche
const stepsToCalories = (steps, weightKg) => (steps && weightKg) ? Math.round(steps * weightKg * 0.0005) : 0;

// MET net (MET - 1) : le métabolisme de base de la durée de la séance est déjà compté dans le BMR
const activityCalories = (metValue, weightKg, durationMin) => (metValue && weightKg && durationMin) ? Math.round(Math.max(0, metValue - 1) * weightKg * (durationMin / 60)) : 0;

// Calories d'activité du jour : chaque séance est saisie une seule fois, soit avec la montre,
// soit estimée (MET) — on les additionne toutes.
const daySportCalories = (sessions = []) => sessions.reduce((sum, s) => sum + (s.calories || 0), 0);

const calcDailyEnergy = ({ profile, weightKg, steps, activitySessions = [] }) => {
  const age = calcAge(profile?.birth_date);
  const bmr = calcBMR({ sex: profile?.sex, weightKg, heightCm: profile?.height_cm, age });
  if (!bmr) return null;
  const neat = stepsToCalories(steps, weightKg);
  const sport = daySportCalories(activitySessions);
  return { bmr, neat, sport, tdee: bmr + neat + sport };
};

// Constat neutre selon l'objectif, affiché côté coach uniquement. La dépense est une estimation
// prudente (sans digestion ni petits mouvements du quotidien) : arrondi à 50 kcal.
const BALANCE_RANGES = { cut: [-800, -150], recomp: [-350, 100], maintain: [-150, 150], bulk: [100, 600] };
const energyBalanceMessage = (balance, goal) => {
  if (balance == null) return null;
  const b = round50(balance);
  const abs = Math.abs(b);
  const range = BALANCE_RANGES[goal];
  const matches = !!range && b >= range[0] && b <= range[1];
  const tooLow = goal === "cut" && b < BALANCE_RANGES.cut[0];
  const text = abs === 0 ? "Proche de l'équilibre" : b < 0 ? `Déficit ≈ ${abs} kcal` : `Surplus ≈ ${abs} kcal`;
  return {
    text: matches ? `${text} — cohérent avec l'objectif` : tooLow ? `${text} — déficit important` : text,
    color: matches ? C.green : tooLow ? C.orange : C.textMuted,
  };
};

// Les 7 dates (lundi → dimanche, "YYYY-MM-DD") de la semaine ISO contenant `date`
const isoWeekDates = (date) => {
  const monday = startOfWeek(new Date(date));
  return Array.from({ length: 7 }, (_, i) => { const d = new Date(monday); d.setDate(d.getDate() + i); return dayKey(d); });
};

// Bilan hebdomadaire d'une cliente — agrège meals/entries/activity_sessions sur les 7 dates
// données. Les moyennes nutrition se basent sur les jours où au moins un repas a été loggé
// (pas sur les 7 jours) pour ne pas fausser la moyenne avec des jours à zéro par absence de saisie.
const calcWeeklySummary = ({ entries = [], meals = [], activitySessions = [], weights = [], profile, weekDates, trainingCtx }) => {
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
    // Journée « repas seulement » : pas et activité inconnus, la dépense serait fausse
    if (!isJournalFilled(entry) || dayMeals.length === 0) return;
    const weightForDate = [...weights].reverse().find(w => w.date <= d) || weights[0];
    const energy = calcDailyEnergy({ profile, weightKg: weightForDate?.value, steps: entry.steps, activitySessions: weekActivity.filter(a => a.date === d) });
    if (!energy) return;
    balanceSum += dayMeals.reduce((s, m) => s + (m.calories || 0), 0) - energy.tdee;
    balanceDays++;
  });

  // Objectif calorique moyen sur les jours où des repas ont été notés (jours d'entraînement / off)
  const dayTargets = mealDays.map(d => kcalTarget(profile, isTrainingDate(d, { ...trainingCtx, entries })));
  const avgKcalTarget = dayTargets.length && dayTargets.every(t => t) ? Math.round(dayTargets.reduce((a, t) => a + t, 0) / dayTargets.length) : null;

  const stepsEntries = weekEntries.filter(e => e.steps);
  const avgSteps = stepsEntries.length ? Math.round(stepsEntries.reduce((s, e) => s + e.steps, 0) / stepsEntries.length) : null;

  return {
    daysCompleted: weekDates.filter(d => weekEntries.some(e => e.date === d && isJournalFilled(e))).length,
    totalDays: weekDates.length,
    mealDaysCount: mealDays.length,
    avgCalories: avgOverMealDays("calories"), avgProtein: avgOverMealDays("protein_g"),
    avgCarb: avgOverMealDays("carb_g"), avgFat: avgOverMealDays("fat_g"),
    avgFiber: avgOverMealDays("fiber_g"), avgSugar: avgOverMealDays("sugar_g"),
    avgKcalTarget,
    balanceTotal: balanceDays ? round50(balanceSum) : null,
    balanceAvg: balanceDays ? Math.round(balanceSum / balanceDays) : null,
    avgSteps,
    sessionsCount: weekActivity.length,
    totalDurationMin: weekActivity.reduce((s, a) => s + (a.duration_min || 0), 0),
  };
};

// Indice de fiabilité v1 : complétude des champs qui alimentent le calcul du jour
// Suivi de cycle — optionnel, renseigné par la cliente. Estimation approximative à partir
// de la date de début des dernières règles + durées moyennes ; ce n'est ni un diagnostic ni
// un suivi médical, juste un repère de contexte pour lire les variations de la semaine.
const CYCLE_PHASE_LABELS = { period: "Règles", follicular: "Phase folliculaire", ovulation: "Ovulation", luteal: "Phase lutéale" };
const calcCyclePhase = (profile, dateStr) => {
  if (!profile?.cycle_last_period_start) return null;
  const cycleLength = profile.cycle_avg_length || 28;
  const periodLength = profile.cycle_avg_period_length || 5;
  const start = new Date(profile.cycle_last_period_start);
  const date = new Date(dateStr);
  const daysSinceStart = Math.floor((date - start) / 86400000);
  if (daysSinceStart < 0) return null;
  const dayInCycle = (daysSinceStart % cycleLength) + 1;
  const ovulationDay = Math.max(periodLength + 2, cycleLength - 14);
  let phase;
  if (dayInCycle <= periodLength) phase = "period";
  else if (dayInCycle < ovulationDay - 1) phase = "follicular";
  else if (dayInCycle <= ovulationDay + 1) phase = "ovulation";
  else phase = "luteal";
  return { phase, dayInCycle, label: CYCLE_PHASE_LABELS[phase] };
};

const calcReliability = ({ hasEntry, hasSteps, hasWeightThisWeek, hasActivityInfo, hasCalories }) => {
  const checks = [hasEntry, hasSteps, hasWeightThisWeek, hasActivityInfo, hasCalories];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
};


const AnimatedList = ({ children, stagger = 70, slide = 8, scale = 1.02 }) => {
  const reduced = usePrefersReducedMotion();
  return (
    <div>
      <style>{`@keyframes fadeUpSlide { from { opacity: 0; transform: translateY(${slide}px) scale(${scale}); } to { opacity: 1; transform: translateY(0) scale(1); } }`}</style>
      {Children.map(children, (child, i) => {
        if (!child) return null;
        const delay = `${i * stagger}ms`;
        const animStyle = reduced ? {} : { animation: `fadeUpSlide .46s cubic-bezier(.2,.9,.25,1) both`, animationDelay: delay };
        return cloneElement(child, { style: { ...(child.props.style || {}), ...animStyle } });
      })}
    </div>
  );
};

// Clé publique VAPID (sans risque à exposer côté client — c'est le fonctionnement normal du protocole Web Push)
const VAPID_PUBLIC_KEY = "BIKdD3Lx2qzFRUoHVFm-7IBt_SGgaoo5kYhNS1XaIDueRX2Whecw5B2VpV9kvxzCsedlZmH3kzySWRU1DndMItg";

// Convertit la clé VAPID (base64 URL-safe) au format attendu par l'API PushManager
const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
};

// Abonne l'appareil de la cliente aux notifications push et enregistre l'abonnement côté serveur.
// Remplace l'ancien système basé sur setTimeout (peu fiable en arrière-plan) par un vrai Web Push,
// qui fonctionne même app fermée grâce au service worker (/sw.js).
const requestNotifications = async (clientId) => {
  if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {
    alert("Les notifications ne sont pas supportées sur cet appareil/navigateur. Sur iPhone, ajoute d'abord l'app à l'écran d'accueil depuis Safari.");
    return false;
  }
  try {
    const perm = await Notification.requestPermission();
    if (perm !== "granted") return false;

    const registration = await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;

    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
    }

    const subJson = subscription.toJSON();
    if (clientId) {
      await supabase.from("push_subscriptions").upsert(
        {
          client_id: clientId,
          endpoint: subJson.endpoint,
          p256dh: subJson.keys.p256dh,
          auth: subJson.keys.auth,
        },
        { onConflict: "endpoint" }
      );
    }
    return true;
  } catch (err) {
    console.error("Erreur d'abonnement aux notifications :", err);
    alert("Impossible d'activer les notifications. Réessaie, ou vérifie les autorisations de ton navigateur.");
    return false;
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN — appel sécurisé de l'Edge Function admin-manage-clients
// ══════════════════════════════════════════════════════════════════════════════
const ADMIN_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/admin-manage-clients`;

const callAdminFunction = async (payload) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  try {
    const res = await fetch(ADMIN_FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err) {
    return { error: "Impossible de contacter le serveur." };
  }
};

const ANALYZE_MEAL_URL = `${SUPABASE_URL}/functions/v1/analyze-meal`;
const analyzeMeal = async ({ text, photoBase64 }) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  try {
    const res = await fetch(ANALYZE_MEAL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ text, photoBase64 }),
    });
    const json = await res.json();
    if (!res.ok) return { error: json.error || "Erreur lors de l'analyse du repas." };
    return { data: json };
  } catch (err) {
    return { error: "Impossible de contacter le serveur d'analyse." };
  }
};

const ANALYZE_WEEKLY_BILAN_URL = `${SUPABASE_URL}/functions/v1/analyze-weekly-bilan`;
const analyzeWeeklyBilan = async (payload) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  try {
    const res = await fetch(ANALYZE_WEEKLY_BILAN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) return { error: json.error || "Erreur lors de l'analyse." };
    return { data: json };
  } catch (err) {
    return { error: "Impossible de contacter le serveur d'analyse." };
  }
};

const ADMIN_PW_WORDS = ["Fort", "Puissant", "Energie", "Focus", "Victoire", "Motiv", "Champion", "Solide"];
const generateSimplePassword = () => {
  const w = ADMIN_PW_WORDS[Math.floor(Math.random() * ADMIN_PW_WORDS.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${w}${num}!`;
};

// ══════════════════════════════════════════════════════════════════════════════
// CATALOGUE D'EXERCICES — référence statique (aucune image, aucun appel réseau)
// Sert uniquement à pré-remplir le nom + les consignes techniques d'un exercice
// dans le WorkoutBuilder. La photo reste ajoutée manuellement comme aujourd'hui.
// ══════════════════════════════════════════════════════════════════════════════
const EXERCISE_CATALOGUE = {
  "Musculation avec charges": [
    { nom: "Squat barre (back squat)", positionnement: "Barre posée sur le haut du trapèze (position basse ou haute selon mobilité), pieds largeur épaules à légèrement plus larges, pointes de pied légèrement ouvertes. Regard neutre, gainage activé avant de sortir la barre du rack.", execution: "Initier le mouvement en reculant les hanches, descendre en contrôlant la trajectoire des genoux dans l'axe des pieds jusqu'à ce que les hanches passent sous les genoux (ou selon amplitude travaillée). Remonter en poussant le sol, extension complète des hanches et des genoux.", respiration: "Inspiration profonde et gainage avant la descente, blocage respiratoire (apnée contrôlée) pendant la phase excentrique et le point bas, expiration active pendant la remontée, idéalement après avoir passé le point de sticking.", vigilance: "Genoux qui rentrent vers l'intérieur (valgus), talons qui décollent, dos qui s'arrondit en bas de mouvement, buste qui bascule trop en avant. Toujours garder les abdominaux et le plancher pelvien engagés." },
    { nom: "Squat gobelet (goblet squat)", positionnement: "Haltère ou kettlebell tenu à deux mains contre la poitrine, coudes proches du corps, pieds largeur épaules.", execution: "Descendre en poussant les hanches en arrière et en pliant les genoux, buste reste vertical, coudes viennent frôler l'intérieur des genoux en bas de mouvement. Remonter en poussant dans le sol.", respiration: "Inspiration en descente, expiration active en remontée.", vigilance: "Excellent exercice d'apprentissage du squat : surveiller que le dos reste neutre et que les talons restent au sol tout au long du mouvement." },
    { nom: "Soulevé de terre (deadlift)", positionnement: "Barre au-dessus du milieu de pied, pieds largeur bassin, mains en prise pronation ou mixte juste à l'extérieur des jambes, dos plat, épaules légèrement au-dessus de la barre.", execution: "Pousser le sol avec les jambes tout en gardant la barre proche du corps, extension simultanée des hanches et des genoux jusqu'à la position debout complète, gainage constant.", respiration: "Grande inspiration et gainage abdominal avant de décoller la barre, apnée contrôlée pendant la phase de tirage, expiration une fois la position debout atteinte.", vigilance: "Ne jamais arrondir le bas du dos, ne pas laisser la barre s'éloigner du corps, éviter l'hyperextension lombaire en haut de mouvement." },
    { nom: "Soulevé de terre roumain (RDL)", positionnement: "Barre ou haltères tenus devant les cuisses, pieds largeur bassin, genoux légèrement fléchis et fixes tout au long du mouvement.", execution: "Pousser les hanches vers l'arrière en gardant le dos neutre et la charge proche des jambes, descendre jusqu'à ressentir un étirement des ischio-jambiers, puis remonter par extension des hanches.", respiration: "Inspiration en descente, expiration à la remontée sur la contraction des fessiers et ischios.", vigilance: "Le mouvement part des hanches et non des genoux ; éviter d'arrondir le dos et de descendre plus bas que la souplesse des ischios ne le permet." },
    { nom: "Hip thrust barre", positionnement: "Dos (omoplates) appuyé sur un banc, barre positionnée sur les hanches (avec protection), pieds à plat au sol, genoux fléchis à 90° en position haute.", execution: "Pousser dans les talons pour lever le bassin jusqu'à l'alignement genoux-hanches-épaules, contracter fortement les fessiers en haut, redescendre en contrôlant sans reposer la charge au sol entre les répétitions.", respiration: "Inspiration en descente, expiration puissante à la poussée en position haute.", vigilance: "Éviter l'hyperextension lombaire en haut de mouvement (ne pas cambrer excessivement), le menton reste rentré, le bassin ne doit pas partir en rotation." },
    { nom: "Développé couché (bench press)", positionnement: "Allongé sur le banc, omoplates rétractées et abaissées, pieds ancrés au sol, léger pont lombaire naturel, prise de barre légèrement plus large que les épaules.", execution: "Descendre la barre de façon contrôlée jusqu'à effleurer la poitrine, coudes à environ 45-70° du buste, puis pousser vers le haut jusqu'à extension complète des bras.", respiration: "Inspiration en descente, expiration active pendant la poussée.", vigilance: "Ne pas décoller les fessiers du banc, garder les omoplates stables, éviter de faire rebondir la barre sur la poitrine." },
    { nom: "Développé militaire (overhead press)", positionnement: "Debout, pieds largeur bassin, barre ou haltères au niveau des épaules, gainage abdominal et fessier activé.", execution: "Pousser la charge à la verticale au-dessus de la tête en gardant le tronc gainé, jusqu'à extension complète des bras, redescendre de façon contrôlée.", respiration: "Inspiration et gainage avant la poussée, expiration en fin de mouvement une fois les bras tendus.", vigilance: "Éviter de cambrer excessivement le bas du dos pour compenser un manque de mobilité d'épaule ; garder les côtes basses engagées." },
    { nom: "Rowing barre", positionnement: "Buste penché en avant à environ 45°, dos plat, genoux légèrement fléchis, barre tenue à bout de bras sous les épaules.", execution: "Tirer la barre vers le bas des abdominaux en rapprochant les omoplates, coudes proches du corps, puis redescendre de façon contrôlée sans perdre la position du dos.", respiration: "Expiration pendant le tirage, inspiration pendant la phase de retour.", vigilance: "Ne pas utiliser l'élan du bas du dos pour tirer la charge ; maintenir la colonne neutre tout au long du mouvement." },
    { nom: "Tirage horizontal poulie basse", positionnement: "Assis face à la poulie, pieds calés, genoux légèrement fléchis, dos droit, poignée saisie à bout de bras.", execution: "Tirer la poignée vers l'abdomen en rapprochant les omoplates et en gardant les coudes proches du corps, revenir en contrôlant l'étirement sans arrondir excessivement le dos.", respiration: "Expiration pendant le tirage, inspiration au retour.", vigilance: "Éviter de se pencher en arrière pour tricher le mouvement ; le buste reste globalement stable, le tirage vient des dorsaux." },
    { nom: "Tirage vertical (lat pulldown)", positionnement: "Assis, cuisses bloquées sous les rouleaux, prise large ou moyenne selon l'objectif, buste légèrement en arrière.", execution: "Tirer la barre vers le haut de la poitrine en engageant les dorsaux, coudes qui descendent vers les hanches, remonter en contrôlant l'étirement.", respiration: "Expiration pendant le tirage, inspiration à la remontée.", vigilance: "Éviter de tirer la barre derrière la nuque ; ne pas utiliser un balancement excessif du buste pour générer l'élan." },
    { nom: "Curl biceps haltères", positionnement: "Debout, bras le long du corps, haltères tenus en supination, coudes proches du buste.", execution: "Fléchir les coudes pour amener les haltères vers les épaules sans bouger les bras, puis redescendre de façon contrôlée jusqu'à extension complète.", respiration: "Expiration en montée, inspiration en descente.", vigilance: "Éviter de balancer le buste ou de décoller les coudes du corps pour tricher la charge." },
    { nom: "Extension triceps à la poulie", positionnement: "Face à la poulie haute, coudes fixes proches du buste, prise de la corde ou barre.", execution: "Étendre les avant-bras vers le bas jusqu'à extension complète des coudes, puis remonter en contrôlant sans décoller les coudes du corps.", respiration: "Expiration en poussée, inspiration au retour.", vigilance: "Les coudes restent fixes tout au long du mouvement ; éviter de les projeter vers l'avant." },
    { nom: "Fentes avant haltères (walking lunges)", positionnement: "Debout, haltères le long du corps, tronc gainé.", execution: "Faire un grand pas en avant, descendre jusqu'à ce que le genou arrière frôle le sol, genou avant aligné avec la cheville, puis pousser pour ramener les jambes ou avancer sur le pas suivant.", respiration: "Inspiration en descente, expiration en poussée pour remonter.", vigilance: "Éviter que le genou avant dépasse largement la pointe du pied de façon incontrôlée ; garder le buste droit et gainé." },
    { nom: "Presse à cuisses (leg press)", positionnement: "Assis, dos et bassin bien calés contre le dossier, pieds largeur bassin sur le plateau, genoux alignés avec les pieds.", execution: "Fléchir les genoux pour amener le plateau vers soi jusqu'à un angle d'environ 90°, puis pousser pour revenir en extension sans verrouiller complètement les genoux.", respiration: "Inspiration en descente, expiration en poussée.", vigilance: "Ne jamais décoller le bas du dos du dossier ; éviter de verrouiller brutalement les genoux en fin de poussée." },
    { nom: "Leg curl (ischio-jambiers)", positionnement: "Allongé ou assis selon la machine, coussin positionné juste au-dessus des talons, genoux alignés avec l'axe de la machine.", execution: "Fléchir les genoux pour amener les talons vers les fessiers, contracter en fin de mouvement, puis revenir en contrôlant la phase excentrique.", respiration: "Expiration en flexion, inspiration au retour.", vigilance: "Éviter de décoller les hanches du support pour tricher l'amplitude ; contrôler particulièrement la descente." },
    { nom: "Leg extension (quadriceps)", positionnement: "Assis, dos calé au dossier, coussin positionné sur le bas des tibias, genoux alignés avec l'axe de rotation de la machine.", execution: "Étendre les genoux jusqu'à extension complète, contracter les quadriceps, puis revenir en contrôlant la descente.", respiration: "Expiration en extension, inspiration au retour.", vigilance: "Ne pas verrouiller violemment les genoux en fin de mouvement ; contrôler la vitesse de descente pour protéger l'articulation." },
    { nom: "Élévations latérales haltères", positionnement: "Debout, haltères le long du corps, léger fléchissement des coudes.", execution: "Lever les bras sur les côtés jusqu'à hauteur des épaules, puis redescendre de façon contrôlée.", respiration: "Expiration en montée, inspiration en descente.", vigilance: "Éviter d'utiliser l'élan du buste ; privilégier une charge modérée pour préserver la technique et les épaules." },
    { nom: "Développé incliné haltères", positionnement: "Allongé sur banc incliné (30-45°), haltères tenus au niveau de la poitrine, omoplates rétractées.", execution: "Pousser les haltères vers le haut jusqu'à extension quasi complète des bras, puis redescendre en contrôlant jusqu'au niveau de la poitrine haute.", respiration: "Inspiration en descente, expiration en poussée.", vigilance: "Garder les poignets alignés avec les avant-bras ; éviter une inclinaison trop forte du banc qui reporte le travail sur les épaules." },
    { nom: "Rowing haltère unilatéral", positionnement: "Un genou et une main en appui sur un banc, dos parallèle au sol, haltère tenu bras tendu dans l'autre main.", execution: "Tirer l'haltère vers la hanche en rapprochant l'omoplate, coude proche du corps, puis redescendre en contrôlant l'étirement.", respiration: "Expiration au tirage, inspiration au retour.", vigilance: "Éviter de faire pivoter le buste pour aider le mouvement ; garder les hanches et les épaules alignées face au sol." },
    { nom: "Good morning", positionnement: "Barre légère posée sur le haut du dos, pieds largeur bassin, genoux légèrement fléchis et fixes.", execution: "Pousser les hanches vers l'arrière en inclinant le buste vers l'avant, dos neutre, jusqu'à ressentir l'étirement des ischio-jambiers, puis remonter par extension des hanches.", respiration: "Inspiration en descente, expiration en remontée.", vigilance: "Charge légère recommandée, mouvement technique ; ne jamais arrondir le dos, amplitude limitée par la souplesse des ischios." },
  ],
  "Poids du corps": [
    { nom: "Pompes (push-up)", positionnement: "Position de planche haute, mains légèrement plus larges que les épaules, corps aligné de la tête aux talons, gainage abdominal et fessier activé.", execution: "Descendre en fléchissant les coudes jusqu'à ce que la poitrine frôle le sol, coudes à environ 45° du buste, puis pousser pour revenir en extension complète des bras.", respiration: "Inspiration en descente, expiration active en poussée.", vigilance: "Éviter que les hanches s'affaissent ou se cambrent ; garder la tête dans le prolongement de la colonne." },
    { nom: "Squat au poids du corps", positionnement: "Pieds largeur épaules, pointes légèrement ouvertes, bras tendus devant ou mains croisées sur la poitrine.", execution: "Reculer les hanches et fléchir les genoux pour descendre jusqu'à une amplitude confortable (cuisses parallèles au sol si mobilité le permet), puis remonter en poussant le sol.", respiration: "Inspiration en descente, expiration en remontée.", vigilance: "Genoux dans l'axe des pieds, talons ancrés au sol, dos neutre tout au long du mouvement." },
    { nom: "Fentes (lunges)", positionnement: "Debout, tronc gainé, mains sur les hanches ou le long du corps.", execution: "Faire un pas en avant ou en arrière, descendre jusqu'à ce que le genou arrière frôle le sol, puis pousser pour revenir en position initiale.", respiration: "Inspiration en descente, expiration en poussée.", vigilance: "Genou avant aligné avec la cheville, buste droit, éviter de perdre l'équilibre latéralement." },
    { nom: "Gainage / planche (plank)", positionnement: "Appui sur les avant-bras et les pointes de pied, corps aligné de la tête aux talons, coudes sous les épaules.", execution: "Maintenir la position en gardant le bassin ni trop haut ni affaissé, gainage abdominal et fessier constant pendant toute la durée.", respiration: "Respiration ample et régulière, sans blocage prolongé, en gardant le gainage actif.", vigilance: "Éviter que le bas du dos se creuse ; ne pas relever les fessiers pour soulager l'effort." },
    { nom: "Planche latérale (side plank)", positionnement: "Appui sur un avant-bras et le côté du pied, corps aligné, hanche décollée du sol.", execution: "Maintenir l'alignement tête-épaule-hanche-pied en gainant les obliques, sans laisser le bassin s'affaisser vers le sol.", respiration: "Respiration régulière tout en maintenant le gainage.", vigilance: "Éviter de faire pivoter le bassin vers l'avant ou l'arrière ; l'épaule d'appui reste stable, sans s'enfoncer." },
    { nom: "Mountain climbers", positionnement: "Position de planche haute, mains sous les épaules, gainage activé.", execution: "Ramener alternativement les genoux vers la poitrine de façon dynamique, en gardant le bassin stable et le dos plat.", respiration: "Respiration rythmée avec le mouvement, sans bloquer la respiration.", vigilance: "Éviter que les hanches montent ou descendent excessivement ; garder un rythme contrôlé plutôt que précipité." },
    { nom: "Burpees", positionnement: "Départ debout, pieds largeur bassin.", execution: "Descendre en squat, poser les mains au sol, envoyer les jambes en planche, effectuer une pompe (optionnelle), ramener les pieds vers les mains, puis sauter en extension complète.", respiration: "Expiration à l'effort (saut et extension), inspiration pendant la phase de mise en position basse.", vigilance: "Garder le dos neutre lors de la transition planche-squat ; adapter l'intensité et la réception du saut pour préserver les articulations." },
    { nom: "Dips sur banc", positionnement: "Mains posées sur le bord d'un banc, doigts vers l'avant, jambes tendues ou fléchies devant soi, fessiers proches du banc.", execution: "Descendre en fléchissant les coudes jusqu'à un angle d'environ 90°, puis pousser pour remonter en extension.", respiration: "Inspiration en descente, expiration en poussée.", vigilance: "Épaules basses et loin des oreilles, éviter une descente trop profonde qui stresse excessivement l'articulation de l'épaule." },
    { nom: "Superman", positionnement: "Allongé sur le ventre, bras tendus devant la tête, jambes tendues.", execution: "Lever simultanément bras et jambes du sol en contractant les lombaires et les fessiers, maintenir brièvement, puis redescendre en contrôlant.", respiration: "Expiration à la montée, inspiration à la descente.", vigilance: "Mouvement d'amplitude modérée : éviter l'hyperextension excessive et les à-coups." },
    { nom: "Hip thrust au sol (glute bridge)", positionnement: "Allongé sur le dos, genoux fléchis, pieds à plat proches des fessiers, bras le long du corps.", execution: "Pousser dans les talons pour lever le bassin jusqu'à l'alignement genoux-hanches-épaules, contracter les fessiers, puis redescendre en contrôlant.", respiration: "Inspiration en descente, expiration en poussée.", vigilance: "Éviter de pousser sur les orteils plutôt que les talons ; ne pas cambrer excessivement le bas du dos en haut de mouvement." },
    { nom: "Squat bulgare (au poids du corps)", positionnement: "Pied arrière surélevé sur un banc, pied avant à bonne distance pour permettre un angle de genou d'environ 90° en bas de mouvement.", execution: "Descendre en fléchissant le genou avant jusqu'à ce que le genou arrière frôle le sol, puis pousser pour remonter.", respiration: "Inspiration en descente, expiration en remontée.", vigilance: "Buste légèrement penché en avant pour engager les fessiers, genou avant qui reste dans l'axe du pied." },
    { nom: "Tractions (pull-up)", positionnement: "Suspendu à la barre, prise pronation légèrement plus large que les épaules, épaules engagées (pas totalement relâchées).", execution: "Tirer le corps vers le haut jusqu'à ce que le menton dépasse la barre, en engageant les dorsaux, puis redescendre en contrôlant jusqu'à extension complète des bras.", respiration: "Expiration en tirant vers le haut, inspiration en descente.", vigilance: "Éviter les mouvements de balancier excessifs ; contrôler particulièrement la phase descendante plutôt que de se laisser tomber." },
    { nom: "Chaise (wall sit)", positionnement: "Dos plaqué contre un mur, genoux fléchis à 90°, pieds à plat au sol légèrement en avant du buste.", execution: "Maintenir la position isométrique en gardant le dos collé au mur et les genoux alignés avec les pieds.", respiration: "Respiration régulière et continue, sans blocage.", vigilance: "Éviter que les genoux dépassent largement la pointe des pieds ; répartir le poids sur l'ensemble du pied." },
    { nom: "Crunch", positionnement: "Allongé sur le dos, genoux fléchis, pieds à plat, mains derrière ou de chaque côté de la tête sans tirer sur la nuque.", execution: "Enrouler le haut du buste vers les genoux en contractant les abdominaux, puis redescendre en contrôlant sans reposer complètement la tête entre les répétitions.", respiration: "Expiration en montée, inspiration en descente.", vigilance: "Ne pas tirer sur la nuque avec les mains ; le mouvement vient de la contraction abdominale, pas de l'élan." },
    { nom: "Relevé de jambes", positionnement: "Allongé sur le dos, jambes tendues, mains sous le bassin ou le long du corps pour stabiliser le bassin.", execution: "Lever les jambes tendues (ou légèrement fléchies) jusqu'à la verticale en gardant le bas du dos plaqué au sol, puis redescendre en contrôlant sans le décoller.", respiration: "Expiration en montée, inspiration en descente.", vigilance: "Dès que le bas du dos se décolle du sol, réduire l'amplitude ; éviter de laisser tomber les jambes sous l'effet de la gravité." },
  ],
  "Fonctionnel": [
    { nom: "Kettlebell swing", positionnement: "Pieds largeur épaules, kettlebell tenue à deux mains devant soi, dos neutre, léger fléchissement des genoux.", execution: "Initier un hip hinge en envoyant les hanches vers l'arrière, laisser la kettlebell osciller entre les jambes, puis extension puissante des hanches pour propulser la kettlebell à hauteur d'épaule.", respiration: "Expiration brève au moment de l'extension des hanches, inspiration pendant la phase de descente.", vigilance: "Le mouvement est propulsé par les hanches et non par les bras ou les épaules ; éviter d'arrondir le dos en bas de mouvement." },
    { nom: "Farmer's walk (portage de charge)", positionnement: "Debout, une charge lourde (haltère, kettlebell) dans chaque main, épaules basses et engagées, gainage abdominal actif.", execution: "Marcher en gardant le buste droit et le gainage constant, pas contrôlés, sans balancement excessif des charges.", respiration: "Respiration régulière et profonde tout au long du portage, sans blocage prolongé.", vigilance: "Éviter d'incliner le buste d'un côté ; garder les épaules basses plutôt que remontées vers les oreilles." },
    { nom: "Battle ropes", positionnement: "Pieds largeur bassin, légère flexion des genoux et des hanches, une extrémité de corde dans chaque main.", execution: "Créer des vagues alternées ou simultanées en mobilisant les bras depuis les épaules, en gardant le tronc gainé et stable.", respiration: "Respiration rythmée avec le mouvement, expiration accentuée sur les phases d'effort intense.", vigilance: "Garder les jambes légèrement fléchies pour absorber l'intensité ; éviter de cambrer le bas du dos sous la fatigue." },
    { nom: "Box jump (saut sur box)", positionnement: "Debout face à la box, pieds largeur bassin, légère flexion préparatoire des genoux.", execution: "Fléchir les genoux et engager les bras vers l'arrière, puis sauter en extension complète pour atterrir en douceur sur la box, genoux fléchis à la réception.", respiration: "Inspiration avant le saut, expiration au moment de l'impulsion.", vigilance: "Réceptionner en silence avec les genoux fléchis pour absorber le choc ; redescendre en marchant plutôt qu'en sautant en arrière." },
    { nom: "Thruster (squat + press)", positionnement: "Haltères ou kettlebells tenus au niveau des épaules, pieds largeur épaules.", execution: "Descendre en squat complet, puis utiliser l'impulsion de la remontée pour enchaîner directement une poussée des charges au-dessus de la tête.", respiration: "Inspiration en descente du squat, expiration pendant la poussée au-dessus de la tête.", vigilance: "Le mouvement doit rester fluide et enchaîné ; ne pas sacrifier la technique du squat pour aller plus vite." },
    { nom: "Jumping jacks", positionnement: "Debout, pieds joints, bras le long du corps.", execution: "Sauter en écartant simultanément les jambes et en levant les bras au-dessus de la tête, puis revenir à la position de départ en un même mouvement.", respiration: "Respiration rythmée avec le mouvement, sans blocage.", vigilance: "Réception souple sur l'avant du pied, genoux légèrement fléchis pour limiter l'impact articulaire." },
    { nom: "Sled push (poussée de traîneau)", positionnement: "Mains posées sur les montants du traîneau, bras tendus ou légèrement fléchis, buste incliné vers l'avant, dos neutre.", execution: "Pousser le traîneau en avançant avec des appuis puissants, en gardant les hanches basses et le tronc gainé tout au long du déplacement.", respiration: "Respiration rythmée avec les foulées, expiration active à chaque poussée.", vigilance: "Éviter de se redresser complètement pendant la poussée ; garder une inclinaison constante du buste." },
    { nom: "Med ball slam (lancer de medicine ball)", positionnement: "Debout, pieds largeur épaules, medicine ball tenue à deux mains au-dessus de la tête.", execution: "Projeter la balle vers le sol avec puissance en engageant les abdominaux et les hanches, accompagner le mouvement avec une légère flexion des genoux.", respiration: "Inspiration à la montée de la balle, expiration puissante au moment du lancer.", vigilance: "Garder le dos neutre lors de la préparation ; éviter l'hyperextension lombaire au-dessus de la tête." },
    { nom: "TRX row (tirage en suspension)", positionnement: "Sangles tenues à bout de bras, corps incliné en arrière, talons ancrés au sol, corps gainé et aligné.", execution: "Tirer le buste vers les mains en rapprochant les omoplates, coudes proches du corps, puis revenir en contrôlant l'extension des bras.", respiration: "Expiration au tirage, inspiration au retour.", vigilance: "Garder le corps aligné comme une planche du début à la fin du mouvement, sans casser au niveau des hanches." },
    { nom: "Step-up", positionnement: "Debout face à un banc ou une box, pied posé à plat dessus.", execution: "Pousser dans le pied posé sur le support pour monter tout le corps, jusqu'à extension complète de la jambe, puis redescendre en contrôlant.", respiration: "Expiration en montée, inspiration en descente.", vigilance: "Éviter de prendre appui sur le pied au sol pour s'aider à monter ; le genou de la jambe motrice reste aligné avec le pied." },
  ],
  "Échauffement & Mobilité": [
    { nom: "Vélo / rameur échauffement", positionnement: "Assise sur le vélo ou le rameur, réglages ajustés, allure légère à modérée.", execution: "Pédaler ou ramer à intensité progressive pendant 3 à 5 minutes pour élever la fréquence cardiaque et la température corporelle avant la séance.", respiration: "Respiration ample et régulière, sans essoufflement excessif.", vigilance: "L'objectif est de préparer le corps, pas de fatiguer ; garder une intensité modérée." },
    { nom: "Rotations articulaires (chevilles, hanches, épaules)", positionnement: "Debout, appui stable, mobiliser chaque articulation une à une (chevilles, genoux, hanches, épaules, poignets).", execution: "Effectuer des cercles lents et contrôlés dans un sens puis dans l'autre pour chaque articulation, 8 à 10 répétitions par sens.", respiration: "Respiration libre et régulière tout au long du mouvement.", vigilance: "Rester dans une amplitude confortable, sans forcer sur une articulation raide ou douloureuse." },
    { nom: "Mobilité hanches 90/90", positionnement: "Assise au sol, une jambe pliée devant à 90°, l'autre pliée sur le côté à 90°.", execution: "Faire pivoter les deux genoux d'un côté à l'autre en gardant le buste droit, en contrôlant le mouvement des hanches.", respiration: "Expiration pendant la rotation, inspiration au retour.", vigilance: "Mouvement lent et contrôlé ; s'arrêter si tension ou douleur dans la hanche ou le genou." },
    { nom: "Cercles de hanches (leg swings)", positionnement: "Debout, appui sur un mur ou une chaise avec une main, jambe libre légèrement tendue.", execution: "Balancer la jambe libre d'avant en arrière puis d'un côté à l'autre, amplitude progressive, sans à-coups.", respiration: "Respiration régulière, sans blocage.", vigilance: "Garder le bassin stable, ne pas chercher l'amplitude maximale dès les premières répétitions." },
    { nom: "Mobilité épaules (cercles de bras)", positionnement: "Debout, bras tendus sur les côtés à hauteur d'épaule.", execution: "Effectuer des petits cercles avec les bras, en augmentant progressivement l'amplitude, dans un sens puis dans l'autre.", respiration: "Respiration libre et continue.", vigilance: "Garder les épaules basses, loin des oreilles, pour éviter de solliciter le trapèze plutôt que l'épaule." },
    { nom: "Cat-cow (mobilité colonne vertébrale)", positionnement: "À quatre pattes, mains sous les épaules, genoux sous les hanches.", execution: "Alterner entre creuser le dos (regard vers le haut, bassin basculé) et arrondir le dos (menton vers la poitrine, bassin rétroversé), mouvement fluide et continu.", respiration: "Inspiration en creusant le dos, expiration en l'arrondissant.", vigilance: "Mouvement lent, synchronisé avec la respiration ; éviter les à-coups dans le bas du dos." },
    { nom: "Squat à vide échauffement", positionnement: "Pieds largeur épaules, bras tendus devant pour l'équilibre.", execution: "Descendre en squat sur une amplitude confortable, remonter, répéter à rythme lent et contrôlé pour préparer hanches, genoux et chevilles.", respiration: "Inspiration en descente, expiration en remontée.", vigilance: "Amplitude progressive, sans forcer sur une raideur ; garder les talons au sol." },
    { nom: "Fentes marchées dynamiques", positionnement: "Debout, espace dégagé devant soi.", execution: "Avancer en fentes alternées sur quelques mètres, buste droit, en insistant sur l'amplitude et la fluidité plutôt que sur la charge.", respiration: "Respiration régulière au rythme des pas.", vigilance: "Contrôler la descente du genou arrière, ne pas viser la vitesse mais la qualité du mouvement." },
    { nom: "Gainage dynamique échauffement", positionnement: "Position de planche haute ou basse.", execution: "Alterner de courtes périodes de gainage statique (15-20 sec) avec de légers mouvements (touches d'épaule, translations) pour activer la sangle abdominale.", respiration: "Respiration régulière, gainage actif sans bloquer la respiration.", vigilance: "Garder le bassin aligné, ne pas laisser les hanches s'affaisser ou remonter." },
    { nom: "Étirement ischio-jambiers (debout)", positionnement: "Debout, un pied légèrement devant l'autre, jambe avant tendue, talon au sol.", execution: "Pencher le buste vers l'avant depuis les hanches, dos plat, jusqu'à ressentir un étirement à l'arrière de la cuisse, maintenir 20-30 secondes.", respiration: "Respiration lente et profonde, expirer pour approfondir légèrement l'étirement.", vigilance: "Ne pas arrondir excessivement le dos ; s'arrêter à la sensation de tension, jamais de douleur vive." },
    { nom: "Étirement quadriceps (debout)", positionnement: "Debout en équilibre, éventuellement appui sur un mur, attraper la cheville d'une jambe derrière soi.", execution: "Amener le talon vers la fesse en gardant les genoux alignés et le bassin gainé, maintenir 20-30 secondes de chaque côté.", respiration: "Respiration lente et régulière tout au long de l'étirement.", vigilance: "Garder le genou pointé vers le sol, ne pas cambrer excessivement le bas du dos." },
    { nom: "Étirement fessiers (figure 4)", positionnement: "Allongée sur le dos, une cheville posée sur le genou opposé, formant un chiffre 4.", execution: "Attraper l'arrière de la cuisse de la jambe au sol et tirer doucement vers la poitrine jusqu'à sentir l'étirement dans le fessier de la jambe croisée, maintenir 20-30 secondes.", respiration: "Respiration profonde et régulière, expirer pour relâcher davantage.", vigilance: "Garder le bas du dos au sol, ne pas forcer si tension dans le genou." },
    { nom: "Étirement mollets", positionnement: "Debout face à un mur, mains en appui, une jambe reculée tendue, talon au sol.", execution: "Pousser légèrement les hanches vers le mur en gardant le talon arrière ancré au sol jusqu'à sentir l'étirement du mollet, maintenir 20-30 secondes de chaque côté.", respiration: "Respiration lente et régulière.", vigilance: "Garder le pied arrière pointé droit devant, ne pas laisser la cheville rouler vers l'intérieur." },
    { nom: "Étirement fléchisseurs de hanche (psoas)", positionnement: "Position de fente basse, genou arrière au sol, bassin gainé.", execution: "Pousser légèrement le bassin vers l'avant tout en gardant le buste droit, jusqu'à sentir l'étirement à l'avant de la hanche arrière, maintenir 20-30 secondes de chaque côté.", respiration: "Respiration profonde, expirer pour approfondir doucement.", vigilance: "Ne pas cambrer le bas du dos pour aller plus loin ; le bassin doit rester gainé." },
    { nom: "Étirement pectoraux (à la porte)", positionnement: "Avant-bras posé contre un cadre de porte ou un mur, coude à hauteur d'épaule.", execution: "Pivoter doucement le buste dans la direction opposée jusqu'à sentir l'étirement à l'avant de l'épaule et de la poitrine, maintenir 20-30 secondes de chaque côté.", respiration: "Respiration lente et régulière.", vigilance: "Ne pas forcer si sensation à l'articulation de l'épaule plutôt qu'un étirement musculaire." },
    { nom: "Étirement dorsaux (enfant / child's pose)", positionnement: "À genoux, fesses vers les talons, bras tendus loin devant, front proche du sol.", execution: "Relâcher le poids du buste vers l'avant en allongeant la colonne, maintenir la position 30 secondes en respirant profondément.", respiration: "Respiration profonde et lente, le dos s'ouvre à chaque expiration.", vigilance: "Position de récupération douce, aucune contrainte ; adapter l'écart des genoux selon le confort." },
  ],
  "Machines guidées (salle de sport)": [
    { nom: "Presse à cuisses (leg press) machine", positionnement: "Assise, dos et bassin bien calés contre le dossier, pieds largeur bassin sur le plateau, genoux alignés avec les pieds.", execution: "Fléchir les genoux pour amener le plateau vers soi jusqu'à un angle d'environ 90°, puis pousser pour revenir en extension sans verrouiller complètement les genoux.", respiration: "Inspiration en descente, expiration en poussée.", vigilance: "Ne jamais décoller le bas du dos du dossier ; éviter de verrouiller brutalement les genoux en fin de poussée." },
    { nom: "Hack squat (machine guidée)", positionnement: "Dos et épaules calés contre le support incliné, pieds à plat sur la plateforme, largeur bassin.", execution: "Fléchir les genoux pour descendre jusqu'à un angle confortable, puis pousser dans les pieds pour remonter en extension contrôlée.", respiration: "Inspiration en descente, expiration en poussée.", vigilance: "Garder le dos et les épaules plaqués contre le support tout au long du mouvement ; ne pas décoller les talons." },
    { nom: "Presse à épaules guidée (shoulder press machine)", positionnement: "Assise, dos calé au dossier, poignées saisies au niveau des épaules, pieds à plat au sol.", execution: "Pousser les poignées vers le haut jusqu'à extension quasi complète des bras, puis redescendre en contrôlant jusqu'au niveau de départ.", respiration: "Inspiration en descente, expiration en poussée.", vigilance: "Garder le dos plaqué au dossier, éviter de cambrer pour aider la poussée." },
    { nom: "Tirage poitrine assis (chest press machine)", positionnement: "Assise, dos calé au dossier, poignées saisies au niveau de la poitrine, coudes alignés avec les épaules.", execution: "Pousser les poignées vers l'avant jusqu'à extension quasi complète des bras, puis revenir en contrôlant l'étirement de la poitrine.", respiration: "Inspiration en retour, expiration en poussée.", vigilance: "Garder les omoplates légèrement rétractées et le dos au dossier tout au long du mouvement." },
    { nom: "Pec deck / butterfly (machine)", positionnement: "Assise, dos calé au dossier, avant-bras ou mains posés sur les leviers, coudes à hauteur d'épaule.", execution: "Rapprocher les leviers l'un de l'autre devant la poitrine en contractant les pectoraux, puis revenir en contrôlant l'étirement.", respiration: "Expiration à la fermeture, inspiration au retour.", vigilance: "Mouvement contrôlé sans à-coups ; éviter d'aller au-delà d'une amplitude confortable pour l'épaule." },
    { nom: "Tirage vertical poulie haute (lat pulldown machine)", positionnement: "Assise, cuisses bloquées sous les rouleaux, prise large ou moyenne selon l'objectif, buste légèrement en arrière.", execution: "Tirer la barre vers le haut de la poitrine en engageant les dorsaux, coudes qui descendent vers les hanches, remonter en contrôlant l'étirement.", respiration: "Expiration pendant le tirage, inspiration à la remontée.", vigilance: "Éviter de tirer la barre derrière la nuque ; ne pas utiliser un balancement excessif du buste pour générer l'élan." },
    { nom: "Tirage horizontal assis (seated row machine)", positionnement: "Assise, poitrine calée contre le support si présent, pieds calés, poignée saisie à bout de bras.", execution: "Tirer la poignée vers l'abdomen en rapprochant les omoplates, coudes proches du corps, revenir en contrôlant l'étirement.", respiration: "Expiration pendant le tirage, inspiration au retour.", vigilance: "Éviter de se pencher en arrière pour tricher le mouvement ; garder le buste stable." },
    { nom: "Tractions / dips assistés (machine)", positionnement: "Genoux ou pieds posés sur la plateforme d'assistance, mains en prise pour tractions ou appuis pour dips.", execution: "Réaliser le mouvement de traction ou de dips avec l'assistance de la machine qui allège une partie du poids du corps, en contrôlant chaque répétition.", respiration: "Expiration à l'effort (montée pour tractions, poussée pour dips), inspiration au retour.", vigilance: "Réduire progressivement l'assistance au fil des séances ; garder un mouvement complet et contrôlé plutôt que rapide." },
    { nom: "Leg curl allongé (machine)", positionnement: "Allongée sur le ventre, coussin positionné juste au-dessus des talons, genoux alignés avec l'axe de la machine.", execution: "Fléchir les genoux pour amener les talons vers les fessiers, contracter en fin de mouvement, puis revenir en contrôlant la phase excentrique.", respiration: "Expiration en flexion, inspiration au retour.", vigilance: "Éviter de décoller les hanches du support pour tricher l'amplitude ; contrôler particulièrement la descente." },
    { nom: "Leg extension (machine)", positionnement: "Assise, dos calé au dossier, coussin positionné sur le bas des tibias, genoux alignés avec l'axe de rotation de la machine.", execution: "Étendre les genoux jusqu'à extension complète, contracter les quadriceps, puis revenir en contrôlant la descente.", respiration: "Expiration en extension, inspiration au retour.", vigilance: "Ne pas verrouiller violemment les genoux en fin de mouvement ; contrôler la vitesse de descente pour protéger l'articulation." },
    { nom: "Adducteurs (machine)", positionnement: "Assise, dos calé au dossier, coussins latéraux positionnés contre l'intérieur des cuisses, jambes écartées.", execution: "Rapprocher les jambes l'une de l'autre en contractant les adducteurs, puis revenir en contrôlant l'écartement.", respiration: "Expiration à la fermeture, inspiration au retour.", vigilance: "Mouvement lent et contrôlé, sans à-coups ; ajuster l'amplitude de départ selon la souplesse." },
    { nom: "Abducteurs (machine)", positionnement: "Assise, dos calé au dossier, coussins latéraux positionnés contre l'extérieur des cuisses, jambes rapprochées.", execution: "Écarter les jambes contre la résistance en contractant les fessiers moyens, puis revenir en contrôlant le retour.", respiration: "Expiration à l'écartement, inspiration au retour.", vigilance: "Garder le dos plaqué au dossier, éviter de se pencher pour aider le mouvement." },
    { nom: "Presse à mollets (calf press machine)", positionnement: "Assise ou sur presse à cuisses, avant des pieds posés sur la plateforme, talons dans le vide.", execution: "Pousser sur l'avant des pieds pour étendre les chevilles au maximum, puis redescendre en contrôlant jusqu'à un étirement complet du mollet.", respiration: "Expiration en poussée, inspiration en descente.", vigilance: "Amplitude complète recherchée ; éviter les rebonds rapides qui réduisent le travail musculaire." },
    { nom: "Rowing convergent assis (machine)", positionnement: "Assise, poitrine calée, poignées convergentes saisies devant soi.", execution: "Tirer les poignées vers l'arrière en rapprochant les omoplates, coudes proches du corps, puis revenir en contrôlant l'étirement.", respiration: "Expiration au tirage, inspiration au retour.", vigilance: "Garder la poitrine en contact avec le support tout au long du mouvement pour isoler le dos." },
    { nom: "Multipresse / smith machine — squat guidé", positionnement: "Barre guidée posée sur le haut du trapèze, pieds légèrement en avant de la barre, largeur épaules.", execution: "Descendre en squat en gardant le buste droit, la trajectoire étant guidée par la machine, puis pousser pour remonter en extension.", respiration: "Inspiration en descente, expiration en remontée.", vigilance: "Ajuster la position des pieds pour garder les genoux alignés avec les orteils malgré la trajectoire fixe de la barre." },
    { nom: "Abdominaux à la machine (crunch machine)", positionnement: "Assise, dos calé, mains ou avant-bras positionnés sur les leviers, coudes proches des poignées de résistance.", execution: "Enrouler le buste vers l'avant en contractant les abdominaux, puis revenir en contrôlant l'étirement sans à-coups.", respiration: "Expiration en enroulement, inspiration au retour.", vigilance: "Le mouvement vient de la contraction abdominale, pas de la poussée des bras sur les leviers." },
  ],
};

// Construit le texte de consigne formaté à partir d'une fiche du catalogue
const useExercisesCatalogue = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase.from("exercises_catalogue").select("*").order("categorie").order("nom");
    setItems(data || []);
    setLoading(false);
  };
  useEffect(() => { fetchItems(); }, []);
  const addItem = async (item) => {
    const { data, error } = await supabase.from("exercises_catalogue").insert([item]).select().single();
    if (!error && data) setItems(prev => [...prev, data]);
    return { data, error };
  };
  const updateItem = async (id, patch) => {
    const { data, error } = await supabase.from("exercises_catalogue").update(patch).eq("id", id).select().single();
    if (!error && data) setItems(prev => prev.map(i => i.id === id ? data : i));
    return { data, error };
  };
  const deleteItem = async (id) => {
    const { error } = await supabase.from("exercises_catalogue").delete().eq("id", id);
    if (!error) setItems(prev => prev.filter(i => i.id !== id));
    return { error };
  };
  const grouped = items.reduce((acc, it) => { (acc[it.categorie] = acc[it.categorie] || []).push(it); return acc; }, {});
  return { items, grouped, loading, addItem, updateItem, deleteItem, refetch: fetchItems };
};
const formatCatalogNote = (item) =>
  `📍 Positionnement : ${item.positionnement}\n\n▶️ Exécution : ${item.execution}\n\n🌬️ Respiration : ${item.respiration}\n\n⚠️ Vigilance : ${item.vigilance}`;

// ══════════════════════════════════════════════════════════════════════════════
// CATALOGUE PICKER — modal de sélection d'un exercice depuis le référentiel
// ══════════════════════════════════════════════════════════════════════════════
const CatalogPickerModal = ({ onSelect, onClose }) => {
  const { items, grouped, loading, addItem, updateItem, deleteItem, refetch } = useExercisesCatalogue();
  const [search, setSearch] = useState("");
  const [openCat, setOpenCat] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [creating, setCreating] = useState(false);
  const [importing, setImporting] = useState(false);
  const q = search.trim().toLowerCase();

  const handleImportSeed = async () => {
    const existingNames = new Set(items.map(i => i.nom.trim().toLowerCase()));
    const toInsert = [];
    Object.entries(EXERCISE_CATALOGUE).forEach(([categorie, list]) => {
      list.forEach(item => {
        if (!existingNames.has(item.nom.trim().toLowerCase())) {
          toInsert.push({ ...item, categorie, media_url: "", is_builtin: true });
        }
      });
    });
    if (toInsert.length === 0) { alert("Tous les exercices prédéfinis sont déjà dans ton catalogue."); return; }
    if (!window.confirm(`Ajouter ${toInsert.length} exercices prédéfinis (échauffement, mobilité, machines guidées...) à ton catalogue ?`)) return;
    setImporting(true);
    const { error } = await supabase.from("exercises_catalogue").insert(toInsert);
    setImporting(false);
    if (error) { alert("❌ Erreur lors de l'import : " + error.message); return; }
    await refetch();
    alert(`✅ ${toInsert.length} exercices ajoutés à ton catalogue !`);
  };

  const emptyForm = { nom: "", categorie: "Mes exercices", positionnement: "", execution: "", respiration: "", vigilance: "", media_url: "" };
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const startEdit = (item) => { setEditingItem(item); setForm({ nom: item.nom, categorie: item.categorie, positionnement: item.positionnement || "", execution: item.execution || "", respiration: item.respiration || "", vigilance: item.vigilance || "", media_url: item.media_url || "" }); setCreating(false); };
  const startCreate = () => { setCreating(true); setEditingItem(null); setForm(emptyForm); };
  const cancelForm = () => { setCreating(false); setEditingItem(null); setForm(emptyForm); };

const handleMediaUpload = async e => {
    const file = e.target.files[0]; if (!file) return;
    setUploadingMedia(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      const fileName = `exercises/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
      const arrayBuffer = await file.arrayBuffer();
      const base64 = btoa(new Uint8Array(arrayBuffer).reduce((s, b) => s + String.fromCharCode(b), ""));
      const res = await fetch(`${SUPABASE_URL}/functions/v1/upload-exercise-media`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ fileName, fileBase64: base64, contentType: file.type }),
      });
      const result = await res.json();
      if (result.error) {
        alert("❌ Impossible d'envoyer le fichier : " + result.error);
        return;
      }
      setForm(f => ({ ...f, media_url: result.url }));
    } catch (err) {
      console.error("Erreur upload média catalogue :", err);
      alert("❌ Erreur inattendue pendant l'envoi : " + (err?.message || "cause inconnue."));
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleSave = async () => {
    if (!form.nom.trim()) return alert("Donne un nom à l'exercice.");
    setSaving(true);
    if (editingItem) await updateItem(editingItem.id, form);
    else await addItem({ ...form, is_builtin: false });
    setSaving(false);
    cancelForm();
  };
  const handleDelete = async (item) => {
    if (!window.confirm(`Supprimer "${item.nom}" du catalogue ?`)) return;
    await deleteItem(item.id);
    if (editingItem?.id === item.id) cancelForm();
  };

  if (creating || editingItem) {
    return (
      <div style={{ position: "fixed", inset: 0, background: C.overlay, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 22, width: "100%", maxWidth: 460, maxHeight: "88vh", overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900 }}>{editingItem ? "✏️ Modifier l'exercice" : "+ Nouvel exercice"}</h3>
            <button onClick={cancelForm} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 20 }}>✕</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Inp label="Nom de l'exercice" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} />
            <Inp label="Catégorie" value={form.categorie} onChange={e => setForm({ ...form, categorie: e.target.value })} placeholder="ex: Mes exercices, Étirements..." />
            <TA label="Positionnement" value={form.positionnement} onChange={e => setForm({ ...form, positionnement: e.target.value })} style={{ minHeight: 60 }} />
            <TA label="Exécution" value={form.execution} onChange={e => setForm({ ...form, execution: e.target.value })} style={{ minHeight: 60 }} />
            <TA label="Respiration" value={form.respiration} onChange={e => setForm({ ...form, respiration: e.target.value })} style={{ minHeight: 44 }} />
            <TA label="Vigilance" value={form.vigilance} onChange={e => setForm({ ...form, vigilance: e.target.value })} style={{ minHeight: 60 }} />
            <div>
              <label style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>🎬 Photo / GIF</label>
              {form.media_url ? (
                <div style={{ position: "relative", display: "inline-block" }}>
                  <img src={form.media_url} alt="" style={{ width: 120, height: 90, objectFit: "cover", borderRadius: 10 }} />
                  <button onClick={() => setForm({ ...form, media_url: "" })} style={{ position: "absolute", top: -6, right: -6, background: C.red, border: "none", borderRadius: "50%", width: 18, height: 18, color: "white", fontSize: 10, cursor: "pointer" }}>✕</button>
                </div>
              ) : (
                <label style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: C.field, border: `1px dashed ${C.border}`, borderRadius: 10, cursor: "pointer", width: "fit-content" }}>
                  <span>{uploadingMedia ? "⏳" : "🖼️"}</span><span style={{ fontSize: 13, color: C.textMuted }}>{uploadingMedia ? "Envoi..." : "Ajouter une photo/GIF"}</span>
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleMediaUpload} disabled={uploadingMedia} />
                </label>
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <Btn variant="secondary" onClick={cancelForm} style={{ flex: 1 }}>Annuler</Btn>
            <Btn onClick={handleSave} disabled={saving} style={{ flex: 2 }}>{saving ? "Enregistrement..." : "💾 Enregistrer"}</Btn>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: C.overlay, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }} onClick={onClose}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 22, width: "100%", maxWidth: 460, maxHeight: "82vh", display: "flex", flexDirection: "column" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900 }}>📋 Catalogue d'exercices</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 20 }}>✕</button>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <input type="text" placeholder="Rechercher un exercice..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputSt, flex: 1 }} autoFocus />
          <button onClick={startCreate} style={{ background: C.pink, border: "none", borderRadius: 10, padding: "0 16px", color: C.black, fontWeight: 800, fontSize: 20, cursor: "pointer", flexShrink: 0 }}>+</button>
        </div>
        <button onClick={handleImportSeed} disabled={importing || loading} style={{ width: "100%", background: C.blue + "18", border: `1px solid ${C.blue}44`, color: C.blue, borderRadius: 10, padding: "9px 12px", fontSize: 12, fontWeight: 700, cursor: importing ? "not-allowed" : "pointer", marginBottom: 14, opacity: importing ? 0.6 : 1 }}>
          {importing ? "Import en cours..." : "📥 Importer les exercices prédéfinis (échauffement, mobilité, machines...)"}
        </button>
        {loading ? <Spinner /> : (
          <div style={{ overflowY: "auto", flex: 1 }}>
            {Object.entries(grouped).map(([cat, list]) => {
              const filtered = q ? list.filter(item => item.nom.toLowerCase().includes(q)) : list;
              if (filtered.length === 0) return null;
              const isOpen = q ? true : openCat === cat;
              return (
                <div key={cat} style={{ marginBottom: 10 }}>
                  <button onClick={() => setOpenCat(openCat === cat ? null : cat)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: C.field, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", color: C.white, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                    <span>{cat}</span>
                    <span style={{ color: C.textMuted, fontSize: 11 }}>{filtered.length} · {isOpen ? "▲" : "▼"}</span>
                  </button>
                  {isOpen && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
                      {filtered.map(item => (
                        <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 10px" }}>
                          {item.media_url && <img src={item.media_url} alt="" style={{ width: 34, height: 34, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} />}
                          <button onClick={() => onSelect(item)} style={{ flex: 1, textAlign: "left", background: "none", border: "none", color: C.white, fontSize: 13, cursor: "pointer", padding: "4px 0" }}>{item.nom}</button>
                          <button onClick={() => startEdit(item)} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 13, padding: 4 }}>✏️</button>
                          <button onClick={() => handleDelete(item)} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: 13, padding: 4 }}>🗑️</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {Object.keys(grouped).length === 0 && <div style={{ textAlign: "center", color: C.textMuted, padding: 30, fontSize: 13 }}>Catalogue vide. Clique sur "+" pour ajouter ton premier exercice.</div>}
          </div>
        )}
      </div>
    </div>
  );
};

// Petit bouton réutilisable qui ouvre le picker et applique la sélection à onApply(name, note)
const CatalogPickerButton = ({ onApply }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{ display: "flex", alignItems: "center", gap: 6, background: C.purple + "18", border: `1px solid ${C.purple}44`, color: C.purple, borderRadius: 8, padding: "8px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
      >
        📋 Catalogue
      </button>
      {open && (
        <CatalogPickerModal
          onClose={() => setOpen(false)}
          onSelect={(item) => { onApply(item.nom, formatCatalogNote(item), item.media_url); setOpen(false); }}
        />
      )}
    </>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// WORKOUT BUILDER
// ══════════════════════════════════════════════════════════════════════════════
const newSimpleEx = () => ({ id: Date.now().toString(), type: "exercise", name: "", sets: 3, reps: "12", mode: "reps", duration: 30, rest: 60, tempo: "", rpe: "", technique: "", note: "", photo: null, suggested_weight: "", weight_type: "haltères" });
const newCircuit = () => ({ id: Date.now().toString(), type: "circuit", rounds: 3, rest_between_rounds: 120, interval_mode: false, exercises: [{ id: Date.now().toString() + "a", name: "", reps: "12", mode: "reps", duration: 30, work_time: 30, rest_time: 30, tempo: "", rpe: "", technique: "", note: "", suggested_weight: "", weight_type: "haltères" }] });
const newWarmup = () => ({ id: Date.now().toString(), type: "warmup", exercises: [{ id: Date.now().toString() + "w", name: "", reps: "", note: "", photo: null }] });

const ExerciseFields = ({ ex, onChange, onDelete, showSets = true, intervalMode = false }) => {
  const handlePhoto = async e => {
    const file = e.target.files[0]; if (!file) return;
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = async () => {
      const MAX = 800;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width > height) { height = Math.round(height * MAX / width); width = MAX; }
        else { width = Math.round(width * MAX / height); height = MAX; }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width; canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      canvas.toBlob(async (blob) => {
        URL.revokeObjectURL(url);
        const fileName = `exercises/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
        const { data, error } = await supabase.storage.from("exercise-media").upload(fileName, blob, { contentType: "image/jpeg", upsert: true });
        if (error) {
          const reader = new FileReader();
          reader.onload = ev => onChange({ ...ex, photo: ev.target.result });
          reader.readAsDataURL(file);
        } else {
          const { data: urlData } = supabase.storage.from("exercise-media").getPublicUrl(fileName);
          onChange({ ...ex, photo: urlData.publicUrl });
        }
      }, "image/jpeg", 0.75);
    };
    img.src = url;
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}><Inp label="Nom de l'exercice" placeholder="ex: Squat..." value={ex.name} onChange={e => onChange({ ...ex, name: e.target.value })} /></div>
<CatalogPickerButton onApply={(name, note, media_url) => onChange({ ...ex, name, note, photo: media_url || ex.photo })} />
        <button onClick={onDelete} style={{ background: C.red + "22", border: "none", borderRadius: 6, width: 36, height: 42, color: C.red, cursor: "pointer", flexShrink: 0 }}>✕</button>
      </div>
      {!intervalMode && (
        <div style={{ display: "flex", gap: 8 }}>
          {[["reps", "🔢 Reps"], ["time", "⏱️ Temps (chrono)"]].map(([val, label]) => (
            <button key={val} type="button" onClick={() => onChange({ ...ex, mode: val })} style={{ flex: 1, padding: "8px", borderRadius: 8, border: `1.5px solid ${(ex.mode || "reps") === val ? C.pink : C.border}`, background: (ex.mode || "reps") === val ? C.pink + "22" : C.field, color: (ex.mode || "reps") === val ? C.pink : C.textMuted, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>{label}</button>
          ))}
        </div>
      )}
      {showSets && !intervalMode && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <Inp label="Séries" type="number" min="1" value={ex.sets || 3} onChange={e => onChange({ ...ex, sets: parseInt(e.target.value) || 1 })} />
          {(ex.mode || "reps") === "time" ? (
            <Inp label="Durée (sec)" type="number" min="1" value={ex.duration || 30} onChange={e => onChange({ ...ex, duration: parseInt(e.target.value) || 0 })} />
          ) : (
            <Inp label="Reps" placeholder="ex: 12" value={ex.reps || ""} onChange={e => onChange({ ...ex, reps: e.target.value })} />
          )}
          <Inp label="Repos (sec)" type="number" value={ex.rest || 60} onChange={e => onChange({ ...ex, rest: parseInt(e.target.value) || 0 })} />
        </div>
      )}
      {!showSets && !intervalMode && (
        (ex.mode || "reps") === "time" ? (
          <Inp label="Durée (sec)" type="number" min="1" value={ex.duration || 30} onChange={e => onChange({ ...ex, duration: parseInt(e.target.value) || 0 })} />
        ) : (
          <Inp label="Reps" placeholder="ex: 12" value={ex.reps || ""} onChange={e => onChange({ ...ex, reps: e.target.value })} />
        )
      )}
      {intervalMode && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Inp label="Travail (sec)" type="number" value={ex.work_time || 30} onChange={e => onChange({ ...ex, work_time: parseInt(e.target.value) || 30 })} />
          <Inp label="Repos (sec)" type="number" value={ex.rest_time || 30} onChange={e => onChange({ ...ex, rest_time: parseInt(e.target.value) || 30 })} />
        </div>
      )}
      <div>
        <label style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>⚖️ Poids suggéré</label>
        <div style={{ display: "flex", gap: 10 }}>
          <input type="text" placeholder="ex: 10" value={ex.suggested_weight || ""} onChange={e => onChange({ ...ex, suggested_weight: e.target.value })} style={{ ...inputSt, flex: 1 }} />
          <select value={ex.weight_type || "haltères"} onChange={e => onChange({ ...ex, weight_type: e.target.value })} style={{ ...inputSt, width: "auto", flex: 1 }}>
            <option value="haltères">kg haltères</option>
            <option value="disques">kg disques</option>
            <option value="barre">kg barre</option>
            <option value="poids du corps">poids du corps</option>
            <option value="élastique">élastique</option>
            <option value="machine">machine (kg)</option>
            <option value="kettlebell">kettlebell</option>
            <option value="medicine ball">medicine ball</option>
            <option value="slam ball">slam ball</option>
            <option value="ballon (swiss ball)">ballon (swiss ball)</option>
            <option value="TRX / sangles">TRX / sangles</option>
            <option value="corde ondulatoire">corde ondulatoire</option>
            <option value="corde à sauter">corde à sauter</option>
            <option value="box / step">box / step</option>
            <option value="tapis">tapis</option>
            <option value="banc">banc</option>
          </select>
        </div>
      </div>
      <div>
        <label style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 4 }}>⏱️ Tempo (optionnel)</label>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input type="text" placeholder="ex: 3-1-2-0" value={ex.tempo || ""} onChange={e => onChange({ ...ex, tempo: e.target.value })} style={{ ...inputSt, flex: 1 }} />
          <span style={{ fontSize: 10, color: C.textMuted, flexShrink: 0, lineHeight: 1.3 }}>desc-bas-<br/>mont-haut</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 4 }}>🎯 RPE (optionnel)</label>
          <input type="text" placeholder="ex: 8 ou 7-8" value={ex.rpe || ""} onChange={e => onChange({ ...ex, rpe: e.target.value })} style={{ ...inputSt, width: "100%" }} />
        </div>
        <div style={{ flex: 2 }}>
          <label style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 4 }}>🔥 Technique (optionnel)</label>
          <input type="text" placeholder="ex: Dropset 1 × -25 %, AMRAP, rest-pause..." value={ex.technique || ""} onChange={e => onChange({ ...ex, technique: e.target.value })} style={{ ...inputSt, width: "100%" }} />
        </div>
      </div>
      <TA label="Consigne" placeholder="Ex: descends bien..." value={ex.note || ""} onChange={e => onChange({ ...ex, note: e.target.value })} style={{ minHeight: 48 }} />
      <div>
        {ex.photo ? (
          <div style={{ position: "relative", display: "inline-block" }}>
            <img src={ex.photo} alt="" style={{ width: 100, height: 75, objectFit: "cover", borderRadius: 10 }} />
            <button onClick={() => onChange({ ...ex, photo: null })} style={{ position: "absolute", top: -6, right: -6, background: C.red, border: "none", borderRadius: "50%", width: 18, height: 18, color: "white", fontSize: 10, cursor: "pointer" }}>✕</button>
          </div>
        ) : (
          <label style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: C.field, border: `1px dashed ${C.border}`, borderRadius: 10, cursor: "pointer", width: "fit-content" }}>
            <span>🖼️</span><span style={{ fontSize: 13, color: C.textMuted }}>Photo du mouvement</span>
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhoto} />
          </label>
        )}
      </div>
    </div>
  );
};

const WorkoutBuilder = ({ workout, onSave, onCancel, defaultProgram = "", programNames = [] }) => {
  const [name, setName] = useState(workout?.name || "");
  const [programName, setProgramName] = useState(workout ? (workout.program_name || "") : defaultProgram);
  const [desc, setDesc] = useState(workout?.description || "");
  const initBlocks = () => {
    if (workout?.blocks && workout.blocks.length > 0) return workout.blocks;
    if (workout?.exercises && workout.exercises.length > 0) return workout.exercises.map(e => ({ ...e, type: e.type || "exercise" }));
    return [];
  };
  const [blocks, setBlocks] = useState(initBlocks);
  const [saving, setSaving] = useState(false);

  const addSimple = () => setBlocks(b => [...b, newSimpleEx()]);
  const addCircuit = () => setBlocks(b => [...b, { ...newCircuit(), id: Date.now().toString() }]);
  const delBlock = id => setBlocks(b => b.filter(x => x.id !== id));
  const updBlock = (id, patch) => setBlocks(b => b.map(x => x.id === id ? { ...x, ...patch } : x));
  const moveBlock = (id, dir) => {
    const i = blocks.findIndex(x => x.id === id);
    if ((dir === -1 && i === 0) || (dir === 1 && i === blocks.length - 1)) return;
    const arr = [...blocks]; [arr[i], arr[i + dir]] = [arr[i + dir], arr[i]]; setBlocks(arr);
  };
  const updCircuitEx = (cid, eid, patch) => setBlocks(b => b.map(x => x.id === cid ? { ...x, exercises: x.exercises.map(e => e.id === eid ? { ...e, ...patch } : e) } : x));
  const addCircuitEx = cid => setBlocks(b => b.map(x => x.id === cid ? { ...x, exercises: [...x.exercises, { id: Date.now().toString(), name: "", reps: "12", mode: "reps", duration: 30, work_time: 30, rest_time: 30, tempo: "", rpe: "", technique: "", note: "", suggested_weight: "", weight_type: "haltères" }] } : x));
  const delCircuitEx = (cid, eid) => setBlocks(b => b.map(x => x.id === cid ? { ...x, exercises: x.exercises.filter(e => e.id !== eid) } : x));
  const addWarmupEx = wid => setBlocks(b => b.map(x => x.id === wid ? { ...x, exercises: [...x.exercises, { id: Date.now().toString(), name: "", reps: "", note: "", photo: null }] } : x));
  const delWarmupEx = (wid, eid) => setBlocks(b => b.map(x => x.id === wid ? { ...x, exercises: x.exercises.filter(e => e.id !== eid) } : x));
  const updWarmupEx = (wid, eid, patch) => setBlocks(b => b.map(x => x.id === wid ? { ...x, exercises: x.exercises.map(e => e.id === eid ? { ...e, ...patch } : e) } : x));

  const handleSave = async () => {
    if (!name.trim()) return alert("Donne un nom à la séance");
    setSaving(true);
    const allEx = blocks.flatMap(b => b.type === "circuit" ? b.exercises.map(e => ({ ...e, type: "exercise", sets: b.rounds, rest: b.rest_between_rounds })) : [b]);
    await onSave({ id: workout?.id, name, description: desc, program_name: programName, exercises: allEx, blocks });
    setSaving(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button onClick={onCancel} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 20, padding: 0 }}>←</button>
        <h2 style={{ margin: 0, fontSize: 20, fontFamily: F.serif, fontWeight: 400, letterSpacing: "-0.5px", color: C.heading }}>{workout ? "Modifier" : "Nouvelle séance"}</h2>
      </div>
      <Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Inp label="Nom de la séance" placeholder="ex: Pembe · S1 · Séance 1 — Fessiers" value={name} onChange={e => setName(e.target.value)} />
          <Inp label="Programme (optionnel)" placeholder="ex: Pembe — Renfo dos & fessiers" value={programName} onChange={e => setProgramName(e.target.value)} list="program-names" />
          <datalist id="program-names">{programNames.map(p => <option key={p} value={p} />)}</datalist>
          <TA label="Description" placeholder="Objectif, durée..." value={desc} onChange={e => setDesc(e.target.value)} style={{ minHeight: 56 }} />
        </div>
      </Card>

      {blocks.map((block, idx) => {
        if (block.type === "warmup") {
          return (
            <Card key={block.id} style={{ borderColor: C.yellow + "55", background: C.yellow + "08" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: C.yellow + "22", border: `1.5px solid ${C.yellow}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🔥</div>
                  <span style={{ fontSize: 11, color: C.yellow, fontWeight: 700 }}>ÉCHAUFFEMENT</span>
                </div>
                <button onClick={() => delBlock(block.id)} style={{ background: C.red + "22", border: "none", borderRadius: 6, width: 26, height: 26, color: C.red, cursor: "pointer" }}>✕</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {block.exercises.map((ex, ei) => (
                  <div key={ex.id} style={{ background: C.field, borderRadius: 12, padding: 14, border: `1px solid ${C.yellow}33` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <span style={{ fontSize: 11, color: C.yellow, fontWeight: 700 }}>Exo {ei + 1}</span>
                      <button onClick={() => delWarmupEx(block.id, ex.id)} style={{ background: C.red + "22", border: "none", borderRadius: 6, width: 24, height: 24, color: C.red, cursor: "pointer", fontSize: 11 }}>✕</button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                        <div style={{ flex: 1 }}><Inp label="Nom de l'exercice" placeholder="ex: Vélo, étirements..." value={ex.name} onChange={e => updWarmupEx(block.id, ex.id, { name: e.target.value })} /></div>
                       <CatalogPickerButton onApply={(name, note, media_url) => updWarmupEx(block.id, ex.id, { name, note, photo: media_url || ex.photo })} />
                      </div>
                      <Inp label="Reps / Durée" placeholder="ex: 10 reps ou 30 sec" value={ex.reps} onChange={e => updWarmupEx(block.id, ex.id, { reps: e.target.value })} />
                      <TA label="Commentaire" placeholder="Consigne, conseil..." value={ex.note} onChange={e => updWarmupEx(block.id, ex.id, { note: e.target.value })} style={{ minHeight: 48 }} />
                      <div>
                        {ex.photo ? (
                          <div style={{ position: "relative", display: "inline-block" }}>
                            <img src={ex.photo} alt="" style={{ width: 100, height: 75, objectFit: "cover", borderRadius: 10 }} />
                            <button onClick={() => updWarmupEx(block.id, ex.id, { photo: null })} style={{ position: "absolute", top: -6, right: -6, background: C.red, border: "none", borderRadius: "50%", width: 18, height: 18, color: "white", fontSize: 10, cursor: "pointer" }}>✕</button>
                          </div>
                        ) : (
                          <label style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: C.field, border: `1px dashed ${C.yellow}44`, borderRadius: 10, cursor: "pointer", width: "fit-content" }}>
                            <span>🖼️</span>
                            <span style={{ fontSize: 13, color: C.textMuted }}>Photo du mouvement</span>
                            <input type="file" accept="image/*" style={{ display: "none" }} onChange={async e => {
                              const file = e.target.files[0]; if (!file) return;
                              const imgEl = new Image();
                              const url = URL.createObjectURL(file);
                              imgEl.onload = async () => {
                                const MAX = 800; let { width, height } = imgEl;
                                if (width > MAX || height > MAX) {
                                  if (width > height) { height = Math.round(height * MAX / width); width = MAX; }
                                  else { width = Math.round(width * MAX / height); height = MAX; }
                                }
                                const canvas = document.createElement("canvas");
                                canvas.width = width; canvas.height = height;
                                canvas.getContext("2d").drawImage(imgEl, 0, 0, width, height);
                                canvas.toBlob(async (blob) => {
                                  URL.revokeObjectURL(url);
                                  const fileName = `exercises/${Date.now()}_warmup`;
                                  const { data, error } = await supabase.storage.from("exercise-media").upload(fileName, blob, { contentType: "image/jpeg", upsert: true });
                                  if (error) {
                                    const reader = new FileReader();
                                    reader.onload = ev => updWarmupEx(block.id, ex.id, { photo: ev.target.result });
                                    reader.readAsDataURL(blob);
                                  } else {
                                    const { data: urlData } = supabase.storage.from("exercise-media").getPublicUrl(fileName);
                                    updWarmupEx(block.id, ex.id, { photo: urlData.publicUrl });
                                  }
                                }, "image/jpeg", 0.75);
                              };
                              imgEl.src = url;
                            }} />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={() => addWarmupEx(block.id)} style={{ padding: "10px", borderRadius: 10, border: `1.5px dashed ${C.yellow}44`, background: "transparent", color: C.yellow, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                  + Ajouter un exercice d'échauffement
                </button>
              </div>
            </Card>
          );
        } else if (block.type === "exercise") {
          return (
            <Card key={block.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: C.pink + "22", border: `1.5px solid ${C.pink}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: C.pink }}>{idx + 1}</div>
                  <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 700 }}>EXERCICE</span>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => moveBlock(block.id, -1)} style={{ background: C.track, border: "none", borderRadius: 6, width: 26, height: 26, color: C.textMuted, cursor: "pointer" }}>↑</button>
                  <button onClick={() => moveBlock(block.id, 1)} style={{ background: C.track, border: "none", borderRadius: 6, width: 26, height: 26, color: C.textMuted, cursor: "pointer" }}>↓</button>
                  <button onClick={() => delBlock(block.id)} style={{ background: C.red + "22", border: "none", borderRadius: 6, width: 26, height: 26, color: C.red, cursor: "pointer" }}>✕</button>
                </div>
              </div>
              <ExerciseFields ex={block} onChange={patch => updBlock(block.id, patch)} onDelete={() => delBlock(block.id)} showSets={true} />
            </Card>
          );
        } else {
          return (
            <Card key={block.id} style={{ borderColor: C.purple + "55", background: C.purple + "08" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: C.purple + "22", border: `1.5px solid ${C.purple}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: C.purple }}>{idx + 1}</div>
                  <span style={{ fontSize: 11, color: C.purple, fontWeight: 700 }}>🔄 CIRCUIT</span>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => moveBlock(block.id, -1)} style={{ background: C.track, border: "none", borderRadius: 6, width: 26, height: 26, color: C.textMuted, cursor: "pointer" }}>↑</button>
                  <button onClick={() => moveBlock(block.id, 1)} style={{ background: C.track, border: "none", borderRadius: 6, width: 26, height: 26, color: C.textMuted, cursor: "pointer" }}>↓</button>
                  <button onClick={() => delBlock(block.id)} style={{ background: C.red + "22", border: "none", borderRadius: 6, width: 26, height: 26, color: C.red, cursor: "pointer" }}>✕</button>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                <Inp label="Nombre de tours" type="number" min="1" value={block.rounds || 3} onChange={e => updBlock(block.id, { rounds: parseInt(e.target.value) || 1 })} />
                <Inp label="Repos entre tours (sec)" type="number" value={block.rest_between_rounds || 120} onChange={e => updBlock(block.id, { rest_between_rounds: parseInt(e.target.value) || 60 })} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, padding: "10px 14px", background: block.interval_mode ? C.orange + "15" : C.field, borderRadius: 10, border: `1px solid ${block.interval_mode ? C.orange + "44" : C.border}` }}>
                <button onClick={() => updBlock(block.id, { interval_mode: !block.interval_mode })} style={{ width: 44, height: 24, borderRadius: 12, background: block.interval_mode ? C.orange : C.muted, border: "none", cursor: "pointer", position: "relative" }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.white, position: "absolute", top: 3, left: block.interval_mode ? 23 : 3, transition: "all .2s" }} />
                </button>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: block.interval_mode ? C.orange : C.white }}>⚡ Mode Interval Training</div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>Timer travail / repos pour chaque exo</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {block.exercises.map((ex, ei) => (
                  <div key={ex.id} style={{ background: C.field, borderRadius: 12, padding: 14, border: `1px solid ${C.purple}33` }}>
                    <div style={{ fontSize: 11, color: C.purple, fontWeight: 700, marginBottom: 10 }}>Exo {ei + 1}</div>
                    <ExerciseFields ex={ex} onChange={patch => updCircuitEx(block.id, ex.id, patch)} onDelete={() => delCircuitEx(block.id, ex.id)} showSets={false} intervalMode={block.interval_mode} />
                  </div>
                ))}
                <button onClick={() => addCircuitEx(block.id)} style={{ padding: "10px", borderRadius: 10, border: `1.5px dashed ${C.purple}55`, background: "transparent", color: C.purple, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                  + Ajouter un exercice au circuit
                </button>
              </div>
            </Card>
          );
        }
      })}

      {blocks.length === 0 && <div style={{ textAlign: "center", padding: "20px 0", color: C.textMuted }}>Ajoute des exercices ou un circuit ci-dessous</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {!blocks.find(b => b.type === "warmup") && (
          <button onClick={() => setBlocks(b => [{ ...newWarmup(), id: Date.now().toString() }, ...b])} style={{ width: "100%", padding: "12px", borderRadius: 12, border: `1.5px dashed ${C.yellow}55`, background: C.yellow + "08", color: C.yellow, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            🔥 + Ajouter un échauffement
          </button>
        )}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={addSimple} style={{ flex: 1, padding: "12px", borderRadius: 12, border: `1.5px dashed ${C.pink}55`, background: "transparent", color: C.pink, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>+ Exercice simple</button>
          <button onClick={addCircuit} style={{ flex: 1, padding: "12px", borderRadius: 12, border: `1.5px dashed ${C.purple}55`, background: "transparent", color: C.purple, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>🔄 + Circuit</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, paddingBottom: 30 }}>
        <Btn variant="secondary" onClick={onCancel} style={{ flex: 1 }}>Annuler</Btn>
        <Btn onClick={handleSave} disabled={saving} style={{ flex: 2 }}>{saving ? "Enregistrement..." : "💾 Enregistrer"}</Btn>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// WORKOUT SUMMARY — génération automatique du sommaire (type, durée, matériel)
// ══════════════════════════════════════════════════════════════════════════════
const estimateBlockDuration = (block) => {
  if (block.type === "warmup") {
    return (block.exercises?.length || 0) * 50; // ~50s par exercice d'échauffement
  }
  if (block.type === "circuit") {
    const rounds = block.rounds || 3;
    const restBetween = block.rest_between_rounds || 0;
    let perRound = 0;
    (block.exercises || []).forEach(ex => {
      if (block.interval_mode) {
        perRound += (parseInt(ex.work_time, 10) || 30) + (parseInt(ex.rest_time, 10) || 30);
      } else if ((ex.mode || "reps") === "time") {
        perRound += parseInt(ex.duration, 10) || 30;
      } else {
        perRound += 45; // estimation par exercice en reps (pas de timer)
      }
    });
    return rounds * perRound + Math.max(0, rounds - 1) * restBetween;
  }
  // exercise simple
  const sets = block.sets || 3;
  const rest = block.rest || 60;
  const workPerSet = (block.mode || "reps") === "time" ? (parseInt(block.duration, 10) || 30) : 40;
  return sets * workPerSet + Math.max(0, sets - 1) * rest;
};

const getWorkoutSummary = (workout) => {
  const blocks = (workout?.blocks && workout.blocks.length > 0)
    ? workout.blocks
    : (workout?.exercises || []).map(e => ({ ...e, type: e.type || "exercise" }));

  const hasCircuit = blocks.some(b => b.type === "circuit");
  const hasSimple = blocks.some(b => b.type === "exercise");
  let type = "Musculation classique";
  if (hasCircuit && hasSimple) type = "Mixte (musculation + circuit)";
  else if (hasCircuit) type = "Circuit training";

  const totalSeconds = blocks.reduce((acc, b) => acc + estimateBlockDuration(b), 0);
  const durationMinutes = Math.max(5, Math.round(totalSeconds / 60));

  const allExercises = blocks.flatMap(b => (b.type === "circuit" || b.type === "warmup") ? (b.exercises || []) : [b]);
  const equipmentSet = new Set();
  allExercises.forEach(e => { if (e.weight_type) equipmentSet.add(e.weight_type); });

  // Structure détaillée bloc par bloc, pour afficher clairement ce qui est un circuit
  // (avec son nombre de tours) et ce qui est un exercice seul, avant de démarrer la séance.
  const blocksSummary = blocks.map(b => {
    if (b.type === "warmup") {
      return { type: "warmup", label: "🔥 Échauffement", exercises: (b.exercises || []).map(e => e.name) };
    }
    if (b.type === "circuit") {
      const rounds = b.rounds || 3;
      return {
        type: "circuit",
        label: `🔄 Circuit · ${rounds} tour${rounds > 1 ? "s" : ""}${b.interval_mode ? " · ⚡ interval" : ""}`,
        rounds,
        exercises: (b.exercises || []).map(e => e.name),
      };
    }
    return { type: "exercise", label: "💪 Exercice seul", name: b.name, sets: b.sets, reps: (b.mode || "reps") === "time" ? `${b.duration || 30}s` : b.reps };
  });

  return {
    type,
    hasCircuit,
    durationMinutes,
    exerciseCount: allExercises.length,
    exercises: allExercises.map(e => ({ name: e.name, weight_type: e.weight_type })),
    blocksSummary,
    equipment: Array.from(equipmentSet),
  };
};

// Écran de preview affiché avant de lancer une séance : type, durée, matériel, liste des exercices
const WorkoutPreview = ({ workout, onStart, onBack }) => {
  const summary = getWorkoutSummary(workout);
  return (
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: F.sans, padding: 20 }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 14, marginBottom: 18, padding: 0 }}>← Retour</button>
      <h2 style={{ fontSize: 24, fontFamily: F.serif, fontWeight: 400, letterSpacing: "-0.5px", color: C.heading, margin: "0 0 6px" }}>{workout.name}</h2>
      {workout.description && <p style={{ color: C.textMuted, fontSize: 14, marginBottom: 20, marginTop: 0 }}>{workout.description}</p>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <Card style={{ padding: 14, textAlign: "center" }}>
          <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>TYPE</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: summary.hasCircuit ? C.purple : C.pink }}>{summary.hasCircuit ? "🔄" : "💪"} {summary.type}</div>
        </Card>
        <Card style={{ padding: 14, textAlign: "center" }}>
          <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>DURÉE ESTIMÉE</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: C.orange }}>~{summary.durationMinutes} min</div>
        </Card>
      </div>

      {summary.equipment.length > 0 && (
        <Card style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 10 }}>⚖️ MATÉRIEL NÉCESSAIRE</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {summary.equipment.map(eq => <Badge key={eq} color={C.blue}>{eq}</Badge>)}
          </div>
        </Card>
      )}

     <Card style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 12 }}>📋 STRUCTURE DE LA SÉANCE ({summary.exerciseCount} exercice{summary.exerciseCount > 1 ? "s" : ""})</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {summary.blocksSummary.map((b, i) => (
            <div key={i} style={{
              background: b.type === "circuit" ? C.purple + "0f" : b.type === "warmup" ? C.yellow + "0f" : C.field,
              border: `1px solid ${b.type === "circuit" ? C.purple + "33" : b.type === "warmup" ? C.yellow + "33" : C.border}`,
              borderRadius: 12, padding: 14,
            }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: b.type === "circuit" ? C.purple : b.type === "warmup" ? C.yellow : C.pink, marginBottom: 8 }}>
                {b.label}
              </div>
              {b.type === "exercise" ? (
                <div style={{ fontSize: 14 }}>
                  {b.name || "—"}
                  {b.sets && b.reps && <span style={{ color: C.textMuted, fontSize: 12 }}> · {b.sets} séries × {b.reps}</span>}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {b.exercises.map((n, j) => <div key={j} style={{ fontSize: 13, color: C.textMuted }}>{j + 1}. {n || "—"}</div>)}
                  {b.exercises.length === 0 && <div style={{ fontSize: 12, color: C.textMuted }}>Aucun exercice</div>}
                </div>
              )}
            </div>
          ))}
          {summary.blocksSummary.length === 0 && <div style={{ fontSize: 13, color: C.textMuted, textAlign: "center", padding: "8px 0" }}>Aucun exercice pour le moment</div>}
        </div>
      </Card>

      <Btn onClick={onStart} style={{ fontSize: 17, marginBottom: 20 }}>▶ Commencer la séance</Btn>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// WORKOUT PLAYER
// ══════════════════════════════════════════════════════════════════════════════
// Séries d'une perf enregistrée : format actuel (une ligne par série) ou ancien format
// (un seul poids / nombre de reps pour tout l'exercice).
const perfSets = (perf) => {
  if (!perf) return [];
  const sets = perf.sets?.length ? perf.sets : [{ weight: perf.weight, reps: perf.reps }];
  return sets.filter(s => s && (s.weight || s.reps));
};
const formatPerfSets = (sets) => sets.map(s => [s.weight, s.reps && `${s.reps} reps`].filter(Boolean).join(" × ")).join(" · ");
const sameExerciseName = (a, b) => !!a && !!b && a.trim().toLowerCase() === b.trim().toLowerCase();

const WorkoutPlayer = ({ workout, onFinish, clientId, sessionLogs = [] }) => {
  const rawBlocks = (workout.blocks && workout.blocks.length > 0) ? workout.blocks : workout.exercises.map(e => ({ ...e, type: e.type || "exercise" }));
  const blocks = [
    ...rawBlocks.filter(b => b.type === "warmup"),
    ...rawBlocks.filter(b => b.type !== "warmup")
  ];
  const summary = getWorkoutSummary(workout);
  const [showSummary, setShowSummary] = useState(false);
  const [blockIdx, setBlockIdx] = useState(0);
  const [resting, setResting] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [restLabel, setRestLabel] = useState("REPOS");
  const [done, setDone] = useState(false);
  const [exLogs, setExLogs] = useState({});
  const [globalNote, setGlobalNote] = useState("");
  const [simpleSets, setSimpleSets] = useState(0);
  const [loggingSet, setLoggingSet] = useState(false);
  const [loggingCircuitSet, setLoggingCircuitSet] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [circuitExIdx, setCircuitExIdx] = useState(0);
  const [intervalPhase, setIntervalPhase] = useState("work");
  const [savingFinal, setSavingFinal] = useState(false);
  const [saveError, setSaveError] = useState("");
  const timerRef = useRef(null);

  const currentBlock = blocks[blockIdx];
  const allExercises = blocks.flatMap(b => b.type === "circuit" ? b.exercises.map(e => ({ ...e, sets: b.rounds })) : (b.type === "warmup" ? b.exercises : [b]));

  // Nombre de séries attendues pour un exercice donné (pour générer les lignes de perf)
  const getExpectedSets = (ex) => {
    const n = parseInt(ex.sets, 10);
    return n && n > 0 ? n : 1;
  };

  // Historique d'un exercice retrouvé par son nom dans TOUTES les séances de la cliente, pas
  // seulement celle en cours : dans un programme chaque semaine est une séance distincte
  // (S1 · J1, S2 · J1...), il faut donc remonter aux semaines précédentes pour le même exercice.
  // sessionLogs arrive trié du plus récent au plus ancien.
  const getAllPerfs = (exName) => sessionLogs
    .map(l => {
      let logs = {};
      try { logs = JSON.parse(l.exercise_logs || "{}"); } catch {}
      const perf = Object.values(logs).find(e => sameExerciseName(e?.name, exName));
      const sets = perfSets(perf);
      return sets.length ? { date: l.date, sets, summary: formatPerfSets(sets) } : null;
    })
    .filter(Boolean).slice(0, 5);
  const getLastPerf = (exName) => getAllPerfs(exName)[0] || null;
  // Rappel « la dernière fois » pour la série en cours de saisie
  const LastSetHint = ({ exName, setIdx }) => {
    const s = getLastPerf(exName)?.sets?.[setIdx];
    if (!s || !(s.weight || s.reps)) return null;
    return <div style={{ fontSize: 12, color: C.purple, marginBottom: 10 }}>🕐 La dernière fois, série {setIdx + 1} : {formatPerfSets([s])}</div>;
  };

  useEffect(() => () => clearInterval(timerRef.current), []);
  useEffect(() => { setSimpleSets(0); setLoggingSet(false); setLoggingCircuitSet(false); setCurrentRound(1); setCircuitExIdx(0); setIntervalPhase("work"); }, [blockIdx]);

  const startTimer = (secs, label, onEnd) => {
    clearInterval(timerRef.current);
    setResting(true); setRestTime(secs); setRestLabel(label);
    timerRef.current = setInterval(() => {
      setRestTime(t => { if (t <= 1) { clearInterval(timerRef.current); setResting(false); onEnd(); return 0; } return t - 1; });
    }, 1000);
  };
  const skipTimer = () => { clearInterval(timerRef.current); setResting(false); };
  const goNextBlock = () => { const next = blockIdx + 1; if (next < blocks.length) { setBlockIdx(next); } else { setDone(true); } };
  const completeSimpleSet = () => {
    setLoggingSet(true);
  };
  const confirmSetLog = () => {
    setLoggingSet(false);
    const nd = simpleSets + 1; setSimpleSets(nd);
    if (nd < currentBlock.sets) startTimer(currentBlock.rest || 60, "REPOS", () => {});
    else goNextBlock();
  };
  const circuitEx = currentBlock?.type === "circuit" ? currentBlock.exercises[circuitExIdx] : null;
  const confirmCircuitLog = () => {
    setLoggingCircuitSet(false);
    advanceCircuit();
  };
  const advanceCircuit = () => {
    setIntervalPhase("work");
    const nextEx = circuitExIdx + 1;
    if (nextEx < currentBlock.exercises.length) { setCircuitExIdx(nextEx); }
    else {
      const nextRound = currentRound + 1;
      if (nextRound <= currentBlock.rounds) { setCurrentRound(nextRound); setCircuitExIdx(0); startTimer(currentBlock.rest_between_rounds || 120, "REPOS ENTRE TOURS", () => {}); }
      else { goNextBlock(); }
    }
  };
  const startIntervalWork = () => {
    setIntervalPhase("work");
    startTimer(circuitEx.work_time || 30, "⚡ TRAVAIL", () => {
      setIntervalPhase("rest");
      startTimer(circuitEx.rest_time || 30, "😴 REPOS", () => { advanceCircuit(); });
    });
  };
  const setExComment = (exId, value) => {
    setExLogs(prev => ({ ...prev, [exId]: { ...prev[exId], comment: value } }));
  };
  const saveAndFinish = async () => {
    setSavingFinal(true);
    setSaveError("");
    if (clientId) {
      const logsWithNames = {};
      allExercises.forEach(e => {
        const expected = getExpectedSets(e);
        const setsArr = exLogs[e.id]?.sets || Array.from({ length: expected }, () => ({ weight: "", reps: "" }));
        logsWithNames[e.id] = { name: e.name, suggested_weight: e.suggested_weight, weight_type: e.weight_type, sets: setsArr, comment: exLogs[e.id]?.comment || "" };
      });
      const { error } = await supabase.from("session_logs").insert([{ client_id: clientId, workout_id: workout.id, workout_name: workout.name, date: today, exercise_logs: JSON.stringify(logsWithNames), note: globalNote }]);
      if (error) {
        setSavingFinal(false);
        setSaveError("❌ Impossible d'enregistrer la séance. Vérifie ta connexion et réessaie. Si ça persiste, préviens ta coach — rien n'est perdu, tes données sont encore ici.");
        return;
      }
    }
    setSavingFinal(false);
    onFinish();
  };

  const setSetField = (exId, setIdx, field, value, expected) => {
    setExLogs(prev => {
      const current = prev[exId]?.sets || Array.from({ length: expected }, () => ({ weight: "", reps: "" }));
      const next = current.map((s, i) => i === setIdx ? { ...s, [field]: value } : s);
      return { ...prev, [exId]: { ...prev[exId], sets: next } };
    });
  };

  // Petite barre de rappel affichée sous la navbar de chaque écran de la séance :
  // type, durée estimée, nombre d'exercices, avec possibilité de déplier la liste complète.
  const SessionSummaryBar = () => (
    <div style={{ padding: "10px 20px", borderBottom: `1px solid ${C.border}` }}>
      <button onClick={() => setShowSummary(s => !s)} style={{ background: "none", border: "none", color: C.textMuted, fontSize: 12, cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 6, width: "100%" }}>
        <span>{summary.hasCircuit ? "🔄" : "💪"} {summary.type} · ~{summary.durationMinutes} min · {summary.exerciseCount} exercices</span>
        <span style={{ marginLeft: "auto" }}>{showSummary ? "▲" : "▼"}</span>
      </button>
    {showSummary && (
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
          {summary.blocksSummary.map((b, i) => (
            <div key={i}>
              <div style={{ fontSize: 11, fontWeight: 700, color: b.type === "circuit" ? C.purple : b.type === "warmup" ? C.yellow : C.pink, marginBottom: 4 }}>{b.label}</div>
              {b.type === "exercise" ? (
                <div style={{ fontSize: 12, color: C.textMuted }}>{b.name || "—"}</div>
              ) : (
                b.exercises.map((n, j) => <div key={j} style={{ fontSize: 12, color: C.textMuted }}>{j + 1}. {n || "—"}</div>)
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (done) return (
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: F.sans, padding: 20 }}>
      <div style={{ textAlign: "center", paddingTop: 40, marginBottom: 32 }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>🏆</div>
        <h1 style={{ fontSize: 26, fontFamily: F.serif, fontWeight: 400, letterSpacing: "-0.5px", color: C.heading, marginBottom: 8 }}>Séance terminée !</h1>
        <p style={{ color: C.textMuted }}>{workout.name}</p>
      </div>
      <Card style={{ marginBottom: 16 }}><div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 12 }}>📝 NOTE SUR LA SÉANCE</div><TA placeholder="Comment c'était ?" value={globalNote} onChange={e => setGlobalNote(e.target.value)} style={{ minHeight: 100 }} /></Card>
      <Card style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 16 }}>MES PERFORMANCES</div>
        {allExercises.map(ex => {
          const expected = getExpectedSets(ex);
          const sets = exLogs[ex.id]?.sets || Array.from({ length: expected }, () => ({ weight: "", reps: "" }));
          return (
            <div key={ex.id} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{ex.name || "—"}</div>
              {ex.suggested_weight && <div style={{ fontSize: 12, color: C.orange, marginBottom: 6 }}>⚖️ {ex.suggested_weight} {ex.weight_type}</div>}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 10 }}>
                {Array.from({ length: expected }, (_, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "28px 1fr 1fr", gap: 8, alignItems: "center" }}>
                    <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, textAlign: "center" }}>S{i + 1}</div>
                    <input type="text" placeholder="ex: 10 kg" value={sets[i]?.weight || ""} onChange={e => setSetField(ex.id, i, "weight", e.target.value, expected)} style={{ ...inputSt, fontSize: 13 }} />
                    <input type="text" placeholder={ex.reps || "reps"} value={sets[i]?.reps || ""} onChange={e => setSetField(ex.id, i, "reps", e.target.value, expected)} style={{ ...inputSt, fontSize: 13 }} />
                  </div>
                ))}
              </div>
              <TA placeholder="💬 Commentaire sur cet exercice (optionnel)" value={exLogs[ex.id]?.comment || ""} onChange={e => setExComment(ex.id, e.target.value)} style={{ minHeight: 44, fontSize: 13 }} />
            </div>
          );
        })}
      </Card>
      {saveError && (
        <div style={{ background: C.red + "15", border: `1px solid ${C.red}44`, borderRadius: 12, padding: 14, marginBottom: 14, fontSize: 13, color: C.red }}>
          {saveError}
        </div>
      )}
      <Btn onClick={saveAndFinish} disabled={savingFinal} style={{ marginBottom: 30 }}>
        {savingFinal ? "Enregistrement..." : "💾 Enregistrer et terminer"}
      </Btn>
    </div>
  );

  if (!currentBlock) return null;

  const TimerBar = () => resting ? (
    <div style={{ background: C.surface, border: `1px solid ${restLabel.includes("TRAVAIL") ? C.green : C.orange}44`, borderRadius: 20, padding: 28, marginBottom: 20, textAlign: "center" }}>
      <div style={{ fontSize: 13, color: restLabel.includes("TRAVAIL") ? C.green : C.orange, fontWeight: 700, marginBottom: 8 }}>{restLabel}</div>
      <div style={{ fontSize: 72, fontWeight: 900, color: restLabel.includes("TRAVAIL") ? C.green : C.orange, letterSpacing: "-2px" }}>{restTime}s</div>
      <Btn small variant="ghost" onClick={skipTimer} style={{ width: "auto", margin: "16px auto 0" }}>Passer →</Btn>
    </div>
  ) : null;

  const NavBar = () => (
    <>
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={onFinish} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 14, padding: 0 }}>✕ Quitter</button>
        <span style={{ fontWeight: 700, fontSize: 14 }}>{workout.name}</span>
        <span style={{ fontSize: 13, color: C.pink, fontWeight: 700 }}>{blockIdx + 1}/{blocks.length}</span>
      </div>
      <div style={{ height: 3, background: C.border }}><div style={{ height: "100%", background: C.pink, width: `${(blockIdx / blocks.length) * 100}%`, transition: "width .4s" }} /></div>
      <SessionSummaryBar />
    </>
  );

  if (currentBlock.type === "warmup") return (
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: F.sans }}>
      <NavBar />
      <div style={{ padding: 20 }}>
        <div style={{ background: C.yellow + "15", border: `1px solid ${C.yellow}44`, borderRadius: 12, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>🔥</span>
          <div>
            <div style={{ fontSize: 13, color: C.yellow, fontWeight: 700 }}>ÉCHAUFFEMENT</div>
            <div style={{ fontSize: 11, color: C.textMuted }}>{currentBlock.exercises.length} exercice{currentBlock.exercises.length > 1 ? "s" : ""}</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {currentBlock.exercises.map((ex, i) => (
            <Card key={ex.id} style={{ borderColor: C.yellow + "33" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: ex.photo || ex.note ? 12 : 0 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.yellow + "22", border: `1.5px solid ${C.yellow}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: C.yellow }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{ex.name}</div>
                  {ex.reps && <div style={{ fontSize: 13, color: C.yellow, marginTop: 2 }}>⏱️ {ex.reps}</div>}
                </div>
              </div>
              {ex.photo && <img src={ex.photo} alt="" style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 10, marginBottom: 10 }} />}
              {ex.note && <div style={{ background: C.yellow + "11", border: `1px solid ${C.yellow}22`, borderRadius: 10, padding: 10, fontSize: 13, color: C.textMuted }}>💡 {ex.note}</div>}
            </Card>
          ))}
        </div>
        <div style={{ marginTop: 20 }}>
          <Btn onClick={goNextBlock} style={{ fontSize: 17, background: C.yellow, color: C.black }}>
            ✅ Échauffement terminé — Commencer la séance →
          </Btn>
        </div>
      </div>
    </div>
  );

  if (currentBlock.type === "exercise") return (
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: F.sans }}>
      <NavBar />
      <div style={{ padding: 20 }}>
        <TimerBar />
        {loggingSet ? (
          <Card style={{ borderColor: C.green + "44" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.green, marginBottom: 14 }}>✅ Série {simpleSets + 1} terminée !</div>
            <LastSetHint exName={currentBlock.name} setIdx={simpleSets} />
            {currentBlock.suggested_weight && <div style={{ fontSize: 12, color: C.orange, marginBottom: 10 }}>⚖️ {currentBlock.suggested_weight} {currentBlock.weight_type}</div>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
              <input type="text" placeholder="ex: 10 kg" autoFocus value={exLogs[currentBlock.id]?.sets?.[simpleSets]?.weight || ""} onChange={e => setSetField(currentBlock.id, simpleSets, "weight", e.target.value, getExpectedSets(currentBlock))} style={{ ...inputSt, fontSize: 13 }} />
              <input type="text" placeholder={currentBlock.reps || "reps"} value={exLogs[currentBlock.id]?.sets?.[simpleSets]?.reps || ""} onChange={e => setSetField(currentBlock.id, simpleSets, "reps", e.target.value, getExpectedSets(currentBlock))} style={{ ...inputSt, fontSize: 13 }} />
            </div>
            <Btn onClick={confirmSetLog}>Valider →</Btn>
          </Card>
        ) : (
          <div>
            <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 6 }}>EXERCICE</div>
            <h2 style={{ fontSize: 26, fontFamily: F.serif, fontWeight: 400, letterSpacing: "-0.5px", color: C.heading, margin: "0 0 10px" }}>{currentBlock.name}</h2>
            {currentBlock.photo && <img src={currentBlock.photo} alt="" style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 14, marginBottom: 14 }} />}
            {currentBlock.suggested_weight && <div style={{ background: C.orange + "15", border: `1px solid ${C.orange}44`, borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13 }}>⚖️ <span style={{ color: C.orange, fontWeight: 700 }}>Suggéré :</span> {currentBlock.suggested_weight} {currentBlock.weight_type}</div>}
            {currentBlock.tempo && <div style={{ background: C.blue + "15", border: `1px solid ${C.blue}44`, borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13 }}>⏱️ <span style={{ color: C.blue, fontWeight: 700 }}>Tempo :</span> {currentBlock.tempo}</div>}
            {currentBlock.rpe && <div style={{ background: C.yellow + "15", border: `1px solid ${C.yellow}44`, borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13 }}>🎯 <span style={{ color: C.yellow, fontWeight: 700 }}>RPE :</span> {currentBlock.rpe}</div>}
            {currentBlock.technique && <div style={{ background: C.red + "12", border: `1px solid ${C.red}44`, borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, whiteSpace: "pre-line" }}>🔥 <span style={{ color: C.red, fontWeight: 700 }}>Technique :</span> {currentBlock.technique}</div>}
            {(() => { const lp = getLastPerf(currentBlock.name); return lp ? <div style={{ background: C.purple + "15", border: `1px solid ${C.purple}44`, borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13 }}>🕐 <span style={{ color: C.purple, fontWeight: 700 }}>Dernière fois ({formatDate(lp.date)}) :</span> {lp.summary}</div> : null; })()}
            {getAllPerfs(currentBlock.name).length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <button onClick={() => setShowHistory(!showHistory)} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 12px", color: C.textMuted, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
                  📊 {showHistory ? "Masquer" : "Voir"} mon historique ({getAllPerfs(currentBlock.name).length} séances)
                </button>
                {showHistory && (
                  <div style={{ marginTop: 10, background: C.field, borderRadius: 12, padding: 12 }}>
                    {getAllPerfs(currentBlock.name).map((p, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < getAllPerfs(currentBlock.name).length - 1 ? `1px solid ${C.border}` : "none" }}>
                        <span style={{ fontSize: 12, color: C.textMuted }}>{formatDate(p.date)}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: C.pink, textAlign: "right" }}>{p.summary}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 }}>
              {[{ l: "SÉRIES", v: `${simpleSets}/${currentBlock.sets}`, c: C.pink }, (currentBlock.mode || "reps") === "time" ? { l: "DURÉE", v: `${currentBlock.duration || 30}s`, c: C.white } : { l: "REPS", v: currentBlock.reps, c: C.white }, { l: "REPOS", v: `${currentBlock.rest}s`, c: C.orange }].map(s => (
                <div key={s.l} style={{ background: C.field, borderRadius: 12, padding: "12px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>{s.l}</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: s.c }}>{s.v}</div>
                </div>
              ))}
            </div>
            {currentBlock.note && <div style={{ background: C.pink + "0f", border: `1px solid ${C.pink}33`, borderRadius: 12, padding: 14, marginBottom: 14, fontSize: 14, lineHeight: 1.5, whiteSpace: "pre-line" }}>💡 {currentBlock.note}</div>}
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              {Array.from({ length: currentBlock.sets }, (_, i) => (
                <div key={i} style={{ width: 36, height: 36, borderRadius: "50%", background: i < simpleSets ? C.green : i === simpleSets ? C.pink + "22" : C.field, border: `2px solid ${i < simpleSets ? C.green : i === simpleSets ? C.pink : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: i < simpleSets ? C.black : i === simpleSets ? C.pink : C.textMuted }}>{i < simpleSets ? "✓" : i + 1}</div>
              ))}
            </div>
            {!resting && ((currentBlock.mode || "reps") === "time" ? (
              <Btn onClick={() => startTimer(currentBlock.duration || 30, "⚡ TRAVAIL", completeSimpleSet)} style={{ fontSize: 17, background: C.green, color: C.black }}>▶ Lancer le chrono ({currentBlock.duration || 30}s) — Série {simpleSets + 1}</Btn>
            ) : (
              <Btn onClick={completeSimpleSet} style={{ fontSize: 17 }}>✅ Série {simpleSets + 1} terminée !</Btn>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (currentBlock.type === "circuit") return (
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: F.sans }}>
      <NavBar />
      <div style={{ padding: 20 }}>
        <div style={{ background: C.purple + "15", border: `1px solid ${C.purple}44`, borderRadius: 12, padding: "10px 14px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: C.purple, fontWeight: 700 }}>🔄 Circuit</span>
          <span style={{ fontSize: 20, fontWeight: 900, color: C.purple }}>Tour {currentRound}/{currentBlock.rounds}</span>
          <span style={{ fontSize: 12, color: C.textMuted }}>{circuitExIdx + 1}/{currentBlock.exercises.length} exos</span>
        </div>
        <TimerBar />
        {!resting && circuitEx && (
          <div>
            <h2 style={{ fontSize: 26, fontFamily: F.serif, fontWeight: 400, letterSpacing: "-0.5px", color: C.heading, margin: "0 0 10px" }}>{circuitEx.name}</h2>
            {circuitEx.photo && <img src={circuitEx.photo} alt="" style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 14, marginBottom: 14 }} />}
            {circuitEx.suggested_weight && <div style={{ background: C.orange + "15", border: `1px solid ${C.orange}44`, borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13 }}>⚖️ <span style={{ color: C.orange, fontWeight: 700 }}>Suggéré :</span> {circuitEx.suggested_weight} {circuitEx.weight_type}</div>}
            {circuitEx.tempo && <div style={{ background: C.blue + "15", border: `1px solid ${C.blue}44`, borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13 }}>⏱️ <span style={{ color: C.blue, fontWeight: 700 }}>Tempo :</span> {circuitEx.tempo}</div>}
            {circuitEx.rpe && <div style={{ background: C.yellow + "15", border: `1px solid ${C.yellow}44`, borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13 }}>🎯 <span style={{ color: C.yellow, fontWeight: 700 }}>RPE :</span> {circuitEx.rpe}</div>}
            {circuitEx.technique && <div style={{ background: C.red + "12", border: `1px solid ${C.red}44`, borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, whiteSpace: "pre-line" }}>🔥 <span style={{ color: C.red, fontWeight: 700 }}>Technique :</span> {circuitEx.technique}</div>}
            {(() => { const lp = getLastPerf(circuitEx.name); return lp ? <div style={{ background: C.purple + "15", border: `1px solid ${C.purple}44`, borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13 }}>🕐 <span style={{ color: C.purple, fontWeight: 700 }}>Dernière fois ({formatDate(lp.date)}) :</span> {lp.summary}</div> : null; })()}
            {currentBlock.interval_mode ? (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                  <div style={{ background: C.green + "15", borderRadius: 12, padding: "14px 8px", textAlign: "center", border: `1px solid ${C.green}44` }}><div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>⚡ TRAVAIL</div><div style={{ fontSize: 28, fontWeight: 900, color: C.green }}>{circuitEx.work_time}s</div></div>
                  <div style={{ background: C.orange + "15", borderRadius: 12, padding: "14px 8px", textAlign: "center", border: `1px solid ${C.orange}44` }}><div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>😴 REPOS</div><div style={{ fontSize: 28, fontWeight: 900, color: C.orange }}>{circuitEx.rest_time}s</div></div>
                </div>
                {circuitEx.note && <div style={{ background: C.pink + "0f", border: `1px solid ${C.pink}33`, borderRadius: 12, padding: 14, marginBottom: 14, fontSize: 14, whiteSpace: "pre-line" }}>💡 {circuitEx.note}</div>}
                <Btn onClick={startIntervalWork} style={{ fontSize: 17, background: C.green, color: C.black }}>▶ Démarrer</Btn>
              </div>
            ) : loggingCircuitSet ? (
              <Card style={{ borderColor: C.green + "44" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.green, marginBottom: 14 }}>✅ {circuitEx.name} — Tour {currentRound} terminé !</div>
                <LastSetHint exName={circuitEx.name} setIdx={currentRound - 1} />
                {circuitEx.suggested_weight && <div style={{ fontSize: 12, color: C.orange, marginBottom: 10 }}>⚖️ {circuitEx.suggested_weight} {circuitEx.weight_type}</div>}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                  <input type="text" placeholder="ex: 10 kg" autoFocus value={exLogs[circuitEx.id]?.sets?.[currentRound - 1]?.weight || ""} onChange={e => setSetField(circuitEx.id, currentRound - 1, "weight", e.target.value, currentBlock.rounds)} style={{ ...inputSt, fontSize: 13 }} />
                  <input type="text" placeholder={circuitEx.reps || "reps"} value={exLogs[circuitEx.id]?.sets?.[currentRound - 1]?.reps || ""} onChange={e => setSetField(circuitEx.id, currentRound - 1, "reps", e.target.value, currentBlock.rounds)} style={{ ...inputSt, fontSize: 13 }} />
                </div>
                <Btn onClick={confirmCircuitLog}>Valider →</Btn>
              </Card>
            ) : (
              <div>
                {(circuitEx.mode || "reps") === "time" ? (
                  <div style={{ background: C.field, borderRadius: 12, padding: "14px", textAlign: "center", marginBottom: 14 }}><div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>DURÉE</div><div style={{ fontSize: 32, fontWeight: 900, color: C.purple }}>{circuitEx.duration || 30}s</div></div>
                ) : (
                  <div style={{ background: C.field, borderRadius: 12, padding: "14px", textAlign: "center", marginBottom: 14 }}><div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>REPS</div><div style={{ fontSize: 32, fontWeight: 900, color: C.purple }}>{circuitEx.reps}</div></div>
                )}
                {circuitEx.note && <div style={{ background: C.pink + "0f", border: `1px solid ${C.pink}33`, borderRadius: 12, padding: 14, marginBottom: 14, fontSize: 14, whiteSpace: "pre-line" }}>💡 {circuitEx.note}</div>}
                {(circuitEx.mode || "reps") === "time" ? (
                  <Btn onClick={() => startTimer(circuitEx.duration || 30, "⚡ TRAVAIL", () => setLoggingCircuitSet(true))} style={{ fontSize: 17, background: C.green, color: C.black }}>▶ Lancer le chrono ({circuitEx.duration || 30}s)</Btn>
                ) : (
                  <Btn onClick={() => setLoggingCircuitSet(true)} style={{ fontSize: 17, background: C.purple, color: C.brandCream }}>✅ Exo suivant →</Btn>
                )}
              </div>
            )}
            <div style={{ display: "flex", gap: 6, marginTop: 20 }}>
              {currentBlock.exercises.map((e, i) => (<div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: i < circuitExIdx ? C.green : i === circuitExIdx ? C.purple : C.border }} />))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return null;
};
// ══════════════════════════════════════════════════════════════════════════════
// DATA HOOKS
// ══════════════════════════════════════════════════════════════════════════════
const useActivityTypes = () => {
  const [activityTypes, setActivityTypes] = useState(() => readCache("activity_types") || []);
  const [loadingActivityTypes, setLoadingActivityTypes] = useState(() => !readCache("activity_types"));
  useEffect(() => {
    settleWithTimeout(supabase.from("activity_types").select("id, name, met_value").order("position")).then(settled => {
      if (settled.status === "rejected") console.error("useActivityTypes: chargement échoué", settled.reason);
      const result = (settled.status === "fulfilled" ? settled.value.data : null) || [];
      writeCache("activity_types", result);
      setActivityTypes(result);
      setLoadingActivityTypes(false);
    });
  }, []);
  return { activityTypes, loadingActivityTypes };
};

const useClients = () => {
  const [clients, setClients] = useState(() => readCache("clients") || []);
  const [loading, setLoading] = useState(() => !readCache("clients"));
  const fetch = async () => {
    const cached = readCache("clients");
    if (cached) {
      setClients(cached);
      setLoading(false);
    } else {
      setLoading(true);
    }
    const settled = await settleWithTimeout(supabase.from("clients").select("id, name, avatar, goal, start_date, next_payment, sessions_per_week, monthly_amount, streak, today_done, user_id, contract_accepted, is_paused, contract_ended, contract_ended_at, created_at").order("created_at"));
    if (settled.status === "rejected") console.error("useClients: chargement échoué", settled.reason);
    const result = (settled.status === "fulfilled" ? settled.value.data : null) || [];
    writeCache("clients", result);
    setClients(result); setLoading(false);
  };
  useEffect(() => { fetch(); }, []);
  const addClient = async (c) => { const { data, error } = await supabase.from("clients").insert([c]).select().single(); if (error) { alert("Erreur lors de la création de la cliente : " + error.message); return null; } setClients(cl => [...cl, data]); return data; };
  const updateClient = async (id, patch) => { const { data, error } = await supabase.from("clients").update(patch).eq("id", id).select().single(); if (error) { alert("Erreur lors de la mise à jour : " + error.message); return null; } setClients(c => c.map(x => x.id === id ? data : x)); return data; };
  const deleteClient = async (id) => { await supabase.from("clients").delete().eq("id", id); setClients(c => c.filter(x => x.id !== id)); };
  return { clients, loading, addClient, updateClient, deleteClient };
};

const useWorkouts = () => {
  const [workouts, setWorkouts] = useState(() => readCache("workouts") || []);
  const [loading, setLoading] = useState(() => !readCache("workouts"));
  // Assignations client_workouts chargées UNE SEULE FOIS pour toutes les séances,
  // au lieu d'une requête séparée par carte (évite des dizaines d'appels réseau redondants).
  const [assignmentsByWorkout, setAssignmentsByWorkout] = useState({});
  const fetchAssignments = async () => {
    const settled = await settleWithTimeout(supabase.from("client_workouts").select("workout_id, client_id"));
    const data = settled.status === "fulfilled" ? settled.value.data : null;
    if (settled.status === "rejected") console.error("useWorkouts: fetchAssignments échoué", settled.reason);
    const map = {};
    (data || []).forEach(r => { (map[r.workout_id] = map[r.workout_id] || []).push(r.client_id); });
    setAssignmentsByWorkout(map);
  };
  const fetch = async () => {
    const cached = readCache("workouts");
    if (cached) {
      setWorkouts(cached);
      setLoading(false);
    } else {
      setLoading(true);
    }
    // photo/blocks exclus de la liste : des photos d'exercices jamais correctement envoyées
    // vers le stockage (policy RLS manquante) ont fini stockées en base64 directement dans
    // ces colonnes, gonflant la réponse à plusieurs dizaines de Mo et provoquant des 503.
    // Le détail complet (blocks, photo) est rechargé à la demande via fetchWorkoutDetail
    // quand une séance précise est ouverte, pour ne jamais transférer TOUTES les séances
    // à la fois.
    const [wsResult, exsResult] = await Promise.all([
      supabase.from("workouts").select("id, name, description, program_name, created_at, is_archived").order("created_at"),
      supabase.from("exercises").select("id, workout_id, name, sets, reps, rest, note, position, suggested_weight, weight_type, tempo").order("position"),
    ].map(p => settleWithTimeout(p)));
    await fetchAssignments();
    const ws = wsResult.status === "fulfilled" ? wsResult.value.data : null;
    const exs = exsResult.status === "fulfilled" ? exsResult.value.data : null;
    if (wsResult.status === "rejected") console.error("useWorkouts: chargement des séances échoué", wsResult.reason);
    if (!ws) { setLoading(false); return; }
    const result = ws.map(w => ({ ...w, exercises: (exs || []).filter(e => e.workout_id === w.id) }));
    writeCache("workouts", result);
    setWorkouts(result);
    setLoading(false);
  };
  useEffect(() => { fetch(); }, []);
  const toggleAssignment = async (workoutId, clientId) => {
    const has = (assignmentsByWorkout[workoutId] || []).includes(clientId);
    if (has) {
      await supabase.from("client_workouts").delete().eq("workout_id", workoutId).eq("client_id", clientId);
      setAssignmentsByWorkout(prev => ({ ...prev, [workoutId]: (prev[workoutId] || []).filter(id => id !== clientId) }));
    } else {
      await supabase.from("client_workouts").insert([{ workout_id: workoutId, client_id: clientId, scheduled_date: null }]);
      setAssignmentsByWorkout(prev => ({ ...prev, [workoutId]: [...(prev[workoutId] || []), clientId] }));
    }
  };
  const saveWorkout = async (workout) => {
    if (workout.id && workouts.find(w => w.id === workout.id)) {
      await supabase.from("workouts").update({ name: workout.name, description: workout.description, program_name: (workout.program_name || "").trim() || null, blocks: workout.blocks || [] }).eq("id", workout.id);
      await supabase.from("exercises").delete().eq("workout_id", workout.id);
    } else {
      const { data } = await supabase.from("workouts").insert([{ name: workout.name, description: workout.description, program_name: (workout.program_name || "").trim() || null, blocks: workout.blocks || [] }]).select().single();
      workout.id = data.id;
    }
    if (workout.exercises?.length) {
      await supabase.from("exercises").insert(workout.exercises.map((e, i) => ({ workout_id: workout.id, name: e.name, sets: e.sets, reps: e.reps, rest: e.rest, note: e.note, photo: e.photo, position: i, suggested_weight: e.suggested_weight, weight_type: e.weight_type, tempo: e.tempo || "" })));
    }
    await fetch();
  };
  const deleteWorkout = async (id) => { await supabase.from("workouts").delete().eq("id", id); setWorkouts(w => w.filter(x => x.id !== id)); };
  const setArchived = async (id, isArchived) => {
    await supabase.from("workouts").update({ is_archived: isArchived }).eq("id", id);
    setWorkouts(w => w.map(x => x.id === id ? { ...x, is_archived: isArchived } : x));
  };
  // Version liée au cache local : en plus de retourner la séance enrichie (comme la fonction
  // partagée fetchWorkoutDetail), met aussi à jour la liste `workouts` en mémoire.
  const loadWorkoutDetail = async (baseWorkout) => {
    const enriched = await fetchWorkoutDetail(baseWorkout);
    setWorkouts(ws => ws.map(w => w.id === enriched.id ? enriched : w));
    return enriched;
  };
  return { workouts, loading, saveWorkout, deleteWorkout, setArchived, assignmentsByWorkout, toggleAssignment, fetchWorkoutDetail: loadWorkoutDetail, reload: fetch };
};
const usePayments = () => {
  const [payments, setPayments] = useState(() => readCache("payments") || []);
  const [loading, setLoading] = useState(() => !readCache("payments"));
  const fetchPayments = async () => {
    const cached = readCache("payments");
    if (cached) {
      setPayments(cached);
      setLoading(false);
    } else {
      setLoading(true);
    }
    const settled = await settleWithTimeout(supabase.from("payments").select("id, client_id, amount, paid_date, next_due_date, note").order("paid_date", { ascending: false }));
    if (settled.status === "rejected") console.error("usePayments: chargement échoué", settled.reason);
    const result = (settled.status === "fulfilled" ? settled.value.data : null) || [];
    writeCache("payments", result);
    setPayments(result);
    setLoading(false);
  };
  useEffect(() => { fetchPayments(); }, []);
  const addPaymentRecord = async (clientId, amount, paidDate, note = "") => {
    const nextDue = addDays(paidDate, 28);
    const { data, error } = await supabase.from("payments").insert([{ client_id: clientId, amount, paid_date: paidDate, next_due_date: nextDue, note }]).select().single();
    if (!error && data) setPayments(p => [data, ...p]);
    return { data, error, nextDue };
  };
  return { payments, loadingPayments: loading, addPaymentRecord };
};
// isCoach : n'inclut les colonnes d'analyse privée de weekly_focus (analyse_fonctionne,
// analyse_surveiller, decision) dans la requête que pour l'usage côté CoachApp — la cliente
// ne doit jamais les recevoir, même sans les afficher (RLS filtre les LIGNES, pas les
// colonnes : c'est cette requête qui décide ce qui part sur le réseau).
const useClientData = (clientId, { isCoach = false } = {}) => {
  // Séparé par isCoach : si la coach teste son app via son propre compte cliente dans le même
  // onglet, un cache partagé pourrait exposer les colonnes d'analyse privée (récupérées côté
  // coach) au moment où la session cliente relit ensuite le même clientId depuis sessionStorage.
  const cacheKey = `client-data:${clientId || "none"}:${isCoach ? "coach" : "client"}`;
  const [entries, setEntries] = useState(() => readCache(cacheKey)?.entries || []);
  const [weights, setWeights] = useState(() => readCache(cacheKey)?.weights || []);
  const [measurements, setMeasurements] = useState(() => readCache(cacheKey)?.measurements || []);
  const [assignedWorkouts, setAssignedWorkouts] = useState(() => readCache(cacheKey)?.assignedWorkouts || []);
  const [progressPhotos, setProgressPhotos] = useState(() => readCache(cacheKey)?.progressPhotos || []);
  const [payments, setPayments] = useState(() => readCache(cacheKey)?.payments || []);
  const [profile, setProfile] = useState(() => readCache(cacheKey)?.profile || null);
  const [activitySessions, setActivitySessions] = useState(() => readCache(cacheKey)?.activitySessions || []);
  const [meals, setMeals] = useState(() => readCache(cacheKey)?.meals || []);
  const [schedule, setSchedule] = useState(() => readCache(cacheKey)?.schedule || []);
  const [appointments, setAppointments] = useState(() => readCache(cacheKey)?.appointments || []);
  const [weeklyFocus, setWeeklyFocus] = useState(() => readCache(cacheKey)?.weeklyFocus || []);
  const [weeklyCheckins, setWeeklyCheckins] = useState(() => readCache(cacheKey)?.weeklyCheckins || []);
  const [loading, setLoading] = useState(() => !readCache(cacheKey));

  const fetch = async () => {
    if (!clientId) {
      setLoading(false);
      return;
    }
    const cached = readCache(cacheKey);
    if (cached) {
      setEntries(cached.entries || []); setWeights(cached.weights || []); setMeasurements(cached.measurements || []);
      setAssignedWorkouts(cached.assignedWorkouts || []); setProgressPhotos(cached.progressPhotos || []); setPayments(cached.payments || []);
      setProfile(cached.profile || null); setActivitySessions(cached.activitySessions || []); setMeals(cached.meals || []);
      setSchedule(cached.schedule || []); setAppointments(cached.appointments || []); setWeeklyFocus(cached.weeklyFocus || []);
      setWeeklyCheckins(cached.weeklyCheckins || []);
      setLoading(false);
    } else {
      setEntries([]); setWeights([]); setMeasurements([]); setAssignedWorkouts([]); setProgressPhotos([]); setPayments([]);
      setProfile(null); setActivitySessions([]); setMeals([]); setSchedule([]); setAppointments([]); setWeeklyFocus([]);
      setWeeklyCheckins([]);
      setLoading(true);
    }
    // allSettled plutôt que all : si une table manque encore (ex: migration nutrition pas encore
    // exécutée) ou qu'une requête échoue, le reste du journal continue de se charger normalement
    // au lieu de rester bloqué en chargement indéfiniment.
    const settled = await Promise.all([
      supabase.from("entries").select("id, client_id, date, feeling, steps, meal_note, photos, calories_total, protein_total, carb_total, fat_total, session_status, session_note, hydration, sleep_hours, nap, had_difficulty, difficulty_note, coach_message").eq("client_id", clientId).order("date", { ascending: false }),
      supabase.from("weights").select("id, client_id, value, date").eq("client_id", clientId).order("date"),
      supabase.from("measurements").select("id, client_id, chest, waist, hips, thighs, date").eq("client_id", clientId).order("date"),
      // blocks/photo exclus ici pour la même raison que useWorkouts : évite de transférer des
      // photos d'exercices potentiellement énormes (stockées en base64 faute de policy sur le
      // bucket) juste pour afficher la liste des séances assignées.
      supabase.from("client_workouts").select("workout_id, scheduled_date, workouts(id, name, description, exercises(id, workout_id, name, sets, reps, rest, note, position, suggested_weight, weight_type, tempo))").eq("client_id", clientId),
      supabase.from("progress_photos").select("id, client_id, photo, note, date").eq("client_id", clientId).order("date", { ascending: false }),
      supabase.from("payments").select("id, client_id, amount, paid_date, next_due_date, note").eq("client_id", clientId).order("paid_date", { ascending: false }),
      // "*" plutôt qu'une liste de colonnes : la lecture continue de fonctionner même si une
      // colonne récente (ex: protein_target_g) n'a pas encore été ajoutée en base.
      supabase.from("client_profiles").select("*").eq("client_id", clientId).maybeSingle(),
      supabase.from("activity_sessions").select("id, client_id, date, activity_name, met_value, duration_min, source, calories").eq("client_id", clientId).order("date", { ascending: false }),
      supabase.from("meals").select("id, client_id, date, meal_slot, raw_text, photo_url, source, items, calories, protein_g, carb_g, fat_g, fiber_g, sugar_g, confidence").eq("client_id", clientId).order("created_at", { ascending: false }),
      supabase.from("workout_schedule").select("id, client_id, workout_id, date").eq("client_id", clientId).order("date"),
      supabase.from("appointments").select("id, client_id, date, time, duration_min, note").eq("client_id", clientId).order("date"),
      supabase.from("weekly_focus").select(`id, client_id, week_start, objectif, engagement, pourquoi${isCoach ? ", analyse_fonctionne, analyse_surveiller, decision" : ""}`).eq("client_id", clientId).order("week_start", { ascending: false }),
      supabase.from("weekly_checkins").select("id, client_id, week_start, energie, faim, stress, sommeil, confiance, facile, difficile, besoin").eq("client_id", clientId).order("week_start", { ascending: false }),
    ].map(p => settleWithTimeout(p)));
    const [e, w, m, cw, pp, pay, prof, acts, mls, sched, appts, wf, wc] = settled.map(r => r.status === "fulfilled" ? r.value : { data: null, error: r.reason });
    settled.forEach((r, i) => { if (r.status === "rejected") console.error("useClientData: requête échouée", i, r.reason); });
    const nextPayload = {
      entries: e.data || [],
      weights: w.data || [],
      measurements: m.data || [],
      assignedWorkouts: (cw.data || []).map(x => ({ workout_id: x.workout_id, scheduled_date: x.scheduled_date, workout: x.workouts })),
      progressPhotos: pp.data || [],
      payments: pay.data || [],
      profile: prof.data || null,
      activitySessions: acts.data || [],
      meals: mls.data || [],
      schedule: sched.data || [],
      appointments: appts.data || [],
      weeklyFocus: wf.data || [],
      weeklyCheckins: wc.data || [],
    };
    writeCache(cacheKey, nextPayload);
    setEntries(nextPayload.entries); setWeights(nextPayload.weights); setMeasurements(nextPayload.measurements);
    setAssignedWorkouts(nextPayload.assignedWorkouts); setProgressPhotos(nextPayload.progressPhotos); setPayments(nextPayload.payments);
    setProfile(nextPayload.profile); setActivitySessions(nextPayload.activitySessions); setMeals(nextPayload.meals);
    setSchedule(nextPayload.schedule); setAppointments(nextPayload.appointments); setWeeklyFocus(nextPayload.weeklyFocus);
    setWeeklyCheckins(nextPayload.weeklyCheckins);
    setLoading(false);
  };
  useEffect(() => { fetch(); }, [clientId]);

  const addEntry = async (entry) => {
    const { data } = await supabase.from("entries").insert([{ ...entry, client_id: clientId }]).select().single();
    if (data) { setEntries(e => [data, ...e]); await supabase.from("clients").update({ today_done: true }).eq("id", clientId); }
    return data;
  };
  const updateEntry = async (id, patch) => {
    const { data } = await supabase.from("entries").update(patch).eq("id", id).select().single();
    if (data) setEntries(e => e.map(x => x.id === id ? data : x));
    if (data && patch.journal_filled && data.date === today) await supabase.from("clients").update({ today_done: true }).eq("id", clientId);
    return data;
  };
  const addWeight = async (value) => { const { data } = await supabase.from("weights").insert([{ client_id: clientId, value, date: today }]).select().single(); if (data) setWeights(w => [...w, data]); };
  const addMeasurement = async (m) => { const { data } = await supabase.from("measurements").insert([{ ...m, client_id: clientId, date: today }]).select().single(); if (data) setMeasurements(ms => [...ms, data]); };
  const toggleWorkout = async (workoutId) => {
    const has = assignedWorkouts.find(a => a.workout_id === workoutId);
    if (has) { await supabase.from("client_workouts").delete().eq("client_id", clientId).eq("workout_id", workoutId); setAssignedWorkouts(a => a.filter(x => x.workout_id !== workoutId)); }
    else { await supabase.from("client_workouts").insert([{ client_id: clientId, workout_id: workoutId, scheduled_date: null }]); fetch(); }
  };
  const updateScheduledDate = async (workoutId, date) => { await supabase.from("client_workouts").update({ scheduled_date: date }).eq("client_id", clientId).eq("workout_id", workoutId); fetch(); };
  const addProgressPhoto = async (photo, note) => { const { data } = await supabase.from("progress_photos").insert([{ client_id: clientId, photo, note, date: today }]).select().single(); if (data) setProgressPhotos(pp => [data, ...pp]); };
  const addPayment = async (amount, paidDate, note) => {
    const nextDue = addDays(paidDate, 28);
    const { data } = await supabase.from("payments").insert([{ client_id: clientId, amount, paid_date: paidDate, next_due_date: nextDue, note }]).select().single();
    if (data) { setPayments(p => [data, ...p]); await supabase.from("clients").update({ next_payment: nextDue }).eq("id", clientId); }
    return data;
  };
  const updateProfile = async (patch) => {
    const { data, error } = await supabase.from("client_profiles").upsert([{ client_id: clientId, ...patch, updated_at: new Date().toISOString() }], { onConflict: "client_id" }).select().single();
    if (error) { alert("Erreur lors de la mise à jour du profil : " + error.message); return null; }
    setProfile(data);
    return data;
  };
  const addActivitySession = async (session) => {
    const { data, error } = await supabase.from("activity_sessions").insert([{ ...session, client_id: clientId }]).select().single();
    if (error) { alert("Erreur lors de l'enregistrement de la séance : " + error.message); return null; }
    if (data) setActivitySessions(a => [data, ...a]);
    return data;
  };
  const deleteActivitySession = async (id) => {
    await supabase.from("activity_sessions").delete().eq("id", id);
    setActivitySessions(a => a.filter(x => x.id !== id));
  };
  // Le trigger SQL meals_sync_entries recalcule entries.calories_total/meal_note côté serveur
  // à chaque insert/update/delete sur meals — on refetch tout pour que le state local reflète
  // ce recalcul, plutôt que de dupliquer la logique d'agrégation ici.
  const addMeal = async (meal) => {
    const { data, error } = await supabase.from("meals").insert([{ ...meal, client_id: clientId }]).select().single();
    if (error) { alert("Erreur lors de l'enregistrement du repas : " + error.message); return null; }
    await fetch();
    return data;
  };
  const updateMeal = async (id, patch) => {
    const { data, error } = await supabase.from("meals").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", id).select().single();
    if (error) { alert("Erreur lors de la mise à jour du repas : " + error.message); return null; }
    await fetch();
    return data;
  };
  const deleteMeal = async (id) => {
    await supabase.from("meals").delete().eq("id", id);
    await fetch();
  };
  // dates : tableau de dates "YYYY-MM-DD" — une seule date pour un placement ponctuel,
  // plusieurs pour une récurrence (ex: le même jour chaque semaine sur N semaines).
  const scheduleWorkout = async (workoutId, dates) => {
    const rows = dates.map(date => ({ client_id: clientId, workout_id: workoutId, date }));
    const { error } = await supabase.from("workout_schedule").upsert(rows, { onConflict: "client_id,workout_id,date" });
    if (error) { alert("Erreur lors de la planification : " + error.message); return; }
    await fetch();
  };
  const unscheduleWorkout = async (scheduleId) => {
    await supabase.from("workout_schedule").delete().eq("id", scheduleId);
    setSchedule(s => s.filter(x => x.id !== scheduleId));
  };
  // Retire cette occurrence et toutes celles de la même séance à partir de cette date —
  // pratique pour arrêter une série récurrente en cours de route.
  const unscheduleSeriesFrom = async (workoutId, fromDate) => {
    await supabase.from("workout_schedule").delete().eq("client_id", clientId).eq("workout_id", workoutId).gte("date", fromDate);
    setSchedule(s => s.filter(x => !(x.workout_id === workoutId && x.date >= fromDate)));
  };
  const addAppointment = async (appointment) => {
    const { data, error } = await supabase.from("appointments").insert([{ ...appointment, client_id: clientId }]).select().single();
    if (error) { alert("Erreur lors de la création du rendez-vous : " + error.message); return null; }
    if (data) setAppointments(a => [...a, data].sort((x, y) => x.date.localeCompare(y.date)));
    return data;
  };
  const deleteAppointment = async (id) => {
    await supabase.from("appointments").delete().eq("id", id);
    setAppointments(a => a.filter(x => x.id !== id));
  };
  const upsertWeeklyFocus = async (weekStart, patch) => {
    const { data, error } = await supabase.from("weekly_focus").upsert([{ client_id: clientId, week_start: weekStart, ...patch, updated_at: new Date().toISOString() }], { onConflict: "client_id,week_start" }).select().single();
    if (error) { alert("Erreur lors de l'enregistrement de l'objectif : " + error.message); return null; }
    setWeeklyFocus(wf => [data, ...wf.filter(x => x.week_start !== weekStart)]);
    return data;
  };
  const upsertWeeklyCheckin = async (weekStart, patch) => {
    const { data, error } = await supabase.from("weekly_checkins").upsert([{ client_id: clientId, week_start: weekStart, ...patch, updated_at: new Date().toISOString() }], { onConflict: "client_id,week_start" }).select().single();
    if (error) { alert("Erreur lors de l'enregistrement de ton ressenti : " + error.message); return null; }
    setWeeklyCheckins(wc => [data, ...wc.filter(x => x.week_start !== weekStart)]);
    return data;
  };

  return { entries, weights, measurements, assignedWorkouts, progressPhotos, payments, profile, activitySessions, meals, schedule, appointments, weeklyFocus, weeklyCheckins, loading, addEntry, updateEntry, addWeight, addMeasurement, toggleWorkout, updateScheduledDate, addProgressPhoto, addPayment, updateProfile, addActivitySession, deleteActivitySession, addMeal, updateMeal, deleteMeal, scheduleWorkout, unscheduleWorkout, unscheduleSeriesFrom, addAppointment, deleteAppointment, upsertWeeklyFocus, upsertWeeklyCheckin };
};
const JournalForm = ({ entries, onSave, onBack, onViewHistory, clientId, profile, latestWeightKg, activityTypes = [], activitySessions = [], onAddActivitySession, onDeleteActivitySession, meals = [], onAddMeal, onUpdateMeal, onDeleteMeal, getKcalTarget = () => null }) => {
  const [selectedDate, setSelectedDate] = useState(today);
  const [feeling, setFeeling] = useState(null);
  const [steps, setSteps] = useState("");
  const [photos, setPhotos] = useState([]);
  const [sessionStatus, setSessionStatus] = useState(null);
  const [sessionNote, setSessionNote] = useState("");
  const [hydration, setHydration] = useState("");
  const [sleepHours, setSleepHours] = useState("");
  const [nap, setNap] = useState(null);
  const [hadDifficulty, setHadDifficulty] = useState(null);
  const [difficultyNote, setDifficultyNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [activityMode, setActivityMode] = useState("met"); // "met" | "watch"
  const [activityTypeId, setActivityTypeId] = useState("");
  const [activityDuration, setActivityDuration] = useState("");
  const [watchCalories, setWatchCalories] = useState("");
  const [savingActivity, setSavingActivity] = useState(false);
  // Date ouverte dans le journal alimentaire (null = journal affiché). Le journal alimentaire
  // s'affiche à la place du formulaire sans le démonter, pour ne pas perdre ce qui est déjà saisi.
  const [mealsDate, setMealsDate] = useState(null);

  const sessionsForDate = activitySessions.filter(s => s.date === selectedDate);
  const mealsForDate = meals.filter(m => m.date === selectedDate);
  const dayCalories = mealsForDate.reduce((sum, m) => sum + (m.calories || 0), 0);
  const dayProtein = Math.round(mealsForDate.reduce((sum, m) => sum + (m.protein_g || 0), 0));
  const dayTarget = getKcalTarget(selectedDate);


  const handleAddActivity = async () => {
    if (activityMode === "watch") {
      if (!watchCalories) return;
      setSavingActivity(true);
      await onAddActivitySession({ date: selectedDate, activity_name: "Séance (montre connectée)", met_value: null, duration_min: activityDuration ? parseInt(activityDuration) : null, source: "watch", calories: Math.round(parseFloat(watchCalories)) });
    } else {
      const type = activityTypes.find(t => t.id === activityTypeId);
      if (!type || !activityDuration || !latestWeightKg) return;
      setSavingActivity(true);
      const calories = activityCalories(type.met_value, latestWeightKg, parseInt(activityDuration));
      await onAddActivitySession({ date: selectedDate, activity_name: type.name, met_value: type.met_value, duration_min: parseInt(activityDuration), source: "met_estimate", calories });
    }
    setSavingActivity(false); setShowAddActivity(false); setActivityTypeId(""); setActivityDuration(""); setWatchCalories("");
  };

  const existing = entries.find(e => e.date === selectedDate) || null;

  useEffect(() => {
    // Ligne créée par un repas seulement : ses valeurs par défaut (😐, 0 pas...) ne viennent
    // pas de la cliente, on part d'un formulaire vierge.
    if (isJournalFilled(existing)) {
      setFeeling(existing.feeling || null); setSteps(existing.steps?.toString() || "");
      setPhotos(existing.photos || []);
      setSessionStatus(existing.session_status || null); setSessionNote(existing.session_note || "");
      setHydration(existing.hydration?.toString() || ""); setSleepHours(existing.sleep_hours?.toString() || "");
      setNap(existing.nap ?? null); setHadDifficulty(existing.had_difficulty ?? null);
      setDifficultyNote(existing.difficulty_note || "");
    } else {
      setFeeling(null); setSteps(""); setPhotos([]);
      setSessionStatus(null); setSessionNote(""); setHydration("");
      setSleepHours(""); setNap(null); setHadDifficulty(null);
      setDifficultyNote("");
    }
  }, [selectedDate]);

  const compressAndUpload = async (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = async () => {
        const MAX = 800;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          if (width > height) { height = Math.round(height * MAX / width); width = MAX; }
          else { width = Math.round(width * MAX / height); height = MAX; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        canvas.toBlob(async (blob) => {
          URL.revokeObjectURL(url);
          const fileName = `${clientId}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
          const { data, error } = await supabase.storage.from("photos").upload(fileName, blob, { contentType: "image/jpeg", upsert: true });
          if (error) {
            const reader = new FileReader();
            reader.onload = ev => resolve(ev.target.result);
            reader.readAsDataURL(blob);
          } else {
            const { data: urlData } = supabase.storage.from("photos").getPublicUrl(fileName);
            resolve(urlData.publicUrl);
          }
        }, "image/jpeg", 0.75);
      };
      img.src = url;
    });
  };

  const handlePhoto = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) { const result = await compressAndUpload(file); setPhotos(p => [...p, result]); }
  };

  const handleSave = async () => {
    setSaving(true);
    // meal_note / calories_total / protein_total / carb_total / fat_total sont désormais des
    // champs dérivés, maintenus par le trigger SQL meals_sync_entries à partir de la table meals.
    // On ne les touche pas ici sur une mise à jour (pour ne pas écraser ce que le trigger vient
    // de calculer) ; on les initialise à vide uniquement à la création d'une toute nouvelle ligne.
    const payload = {
      date: selectedDate, steps: parseInt(steps) || 0, feeling: feeling || 3, photos,
      session_status: sessionStatus || "rest", session_note: sessionNote,
      hydration: parseFloat(String(hydration).replace(",", ".")) || 0, sleep_hours: parseFloat(String(sleepHours).replace(",", ".")) || 0,
      nap: nap || false, had_difficulty: hadDifficulty || false, difficulty_note: difficultyNote,
      journal_filled: true,
    };
    if (!existing) {
      payload.meal_note = ""; payload.calories_total = null; payload.protein_total = null; payload.carb_total = null; payload.fat_total = null;
    }
    await onSave(payload);
    setSaving(false); onBack();
  };

  if (mealsDate) return <MealLogForm meals={meals} profile={profile} clientId={clientId} getKcalTarget={getKcalTarget} initialDate={mealsDate} onAddMeal={onAddMeal} onUpdateMeal={onUpdateMeal} onDeleteMeal={onDeleteMeal} onBack={() => { setMealsDate(null); window.scrollTo(0, 0); }} backLabel="← Retour au journal" />;

  const lbl = { fontSize: 13, color: C.textMuted, fontWeight: 600, marginBottom: 8 };
  const sectionTitle = { fontSize: 17, fontWeight: 650, color: C.heading, margin: "0 0 14px" };
  const chip = (on, color = C.cherry) => ({ flex: 1, minHeight: 44, borderRadius: 12, border: `1px solid ${on ? color : C.border}`, background: on ? color + "18" : C.card, color: on ? color : C.textMuted, fontWeight: on ? 650 : 500, fontSize: 14, cursor: "pointer", fontFamily: "inherit" });
  return (
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: F.sans, padding: "16px 16px 120px", maxWidth: 560, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 15, padding: "8px 0", display: "flex", alignItems: "center", gap: 4, fontFamily: "inherit" }}><Icon name="back" size={18} /> Retour</button>
        {onViewHistory && <button onClick={onViewHistory} style={{ background: "none", border: "none", color: C.cherry, cursor: "pointer", fontSize: 14, fontWeight: 650, padding: "8px 0", fontFamily: "inherit" }}>Historique</button>}
      </div>
      <h1 style={{ fontFamily: F.serif, fontWeight: 400, fontSize: 32, letterSpacing: "-0.6px", color: C.heading, margin: "0 0 14px" }}>Mon journal</h1>
      <DayPicker value={selectedDate} onChange={setSelectedDate} maxBack={3} done={d => entries.some(e => e.date === d && isJournalFilled(e))} />

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card>
          <h2 style={sectionTitle}>Comment s'est passée ta journée ?</h2>
          <div style={lbl}>Ressenti{feeling ? <span style={{ color: C.white }}> · {feelingLabels[feeling - 1]}</span> : null}</div>
          <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
            {feelings.map((f, i) => (<button key={i} onClick={() => setFeeling(i + 1)} aria-label={feelingLabels[i]} style={{ flex: 1, height: 50, borderRadius: 12, border: `1px solid ${feeling === i + 1 ? C.cherry : C.border}`, background: feeling === i + 1 ? C.pink + "1c" : C.card, fontSize: 24, cursor: "pointer" }}>{f}</button>))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
            <NumField label="Pas" value={steps} onChange={e => setSteps(e.target.value.replace(/[^0-9]/g, ""))} placeholder="9 500" />
            <NumField label="Sommeil" unit="h" decimal value={sleepHours} onChange={e => setSleepHours(e.target.value)} placeholder="7,5" />
            <NumField label="Eau (hors thé, café)" unit="L" decimal value={hydration} onChange={e => setHydration(e.target.value)} placeholder="1,5" />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 13, color: C.textMuted, fontWeight: 600 }}>Sieste</span>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => setNap(true)} style={chip(nap === true)}>Oui</button>
                <button onClick={() => setNap(false)} style={chip(nap === false)}>Non</button>
              </div>
            </div>
          </div>
          <div style={lbl}>Séance du jour</div>
          <div style={{ display: "flex", gap: 6 }}>
            {[["done", "Faite", C.green], ["rest", "Repos", C.blue], ["missed", "Pas faite", C.red]].map(([v, label, color]) => (
              <button key={v} onClick={() => setSessionStatus(v)} style={chip(sessionStatus === v, color)}>{label}</button>
            ))}
          </div>
          {sessionStatus === "done" && <div style={{ marginTop: 12 }}><TA placeholder="Un retour sur ta séance ? (facultatif)" value={sessionNote} onChange={e => setSessionNote(e.target.value)} style={{ minHeight: 64 }} /></div>}
          <button onClick={() => setHadDifficulty(!hadDifficulty)} style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 18, background: "none", border: "none", padding: "6px 0", cursor: "pointer", fontFamily: "inherit", fontSize: 15, color: C.white, textAlign: "left" }}>
            <span style={{ width: 24, height: 24, borderRadius: 7, border: `1.5px solid ${hadDifficulty ? C.orange : C.muted}`, background: hadDifficulty ? C.orange : C.card, color: C.brandCream, display: "grid", placeItems: "center", fontSize: 14, flexShrink: 0 }}>{hadDifficulty ? "✓" : ""}</span>
            J'ai rencontré une difficulté
          </button>
          {hadDifficulty && <div style={{ marginTop: 8 }}><TA placeholder="Raconte, ta coach la lira : j'ai craqué le soir, fatigue…" value={difficultyNote} onChange={e => setDifficultyNote(e.target.value)} style={{ minHeight: 72 }} /></div>}
        </Card>

        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
            <h2 style={{ ...sectionTitle, margin: 0 }}>Mon alimentation</h2>
            <span style={{ fontSize: 14, color: C.textMuted, fontVariantNumeric: "tabular-nums" }}>{mealsForDate.length} repas</span>
          </div>
          {dayTarget && <CalorieProgress value={dayCalories} target={dayTarget.target} training={dayTarget.training} label="Calories du jour" />}
          {proteinTarget(profile) && <ProteinProgress value={dayProtein} target={proteinTarget(profile)} label="Protéines du jour" />}
          {!dayTarget && mealsForDate.length > 0 && <div style={{ fontSize: 14, color: C.textMuted, marginBottom: 12 }}>{Math.round(dayCalories)} kcal · {dayProtein} g de protéines</div>}
          {mealsForDate.length === 0 && <p style={{ fontSize: 14, color: C.textMuted, margin: "0 0 12px" }}>Aucun repas noté pour ce jour.</p>}
          <Btn variant="secondary" onClick={() => setMealsDate(selectedDate)} style={{ width: "100%" }}>{mealsForDate.length > 0 ? "Voir et modifier mes repas" : "Noter mes repas"}</Btn>
        </Card>

        <Card>
          <h2 style={sectionTitle}>Activités en plus <span style={{ fontSize: 13, color: C.textMuted, fontWeight: 500 }}>(hors séance du programme)</span></h2>
          {sessionsForDate.map(s => (
            <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, padding: "10px 0", borderTop: `1px solid ${C.border}` }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{s.activity_name}</div>
                <div style={{ fontSize: 13, color: C.textMuted }}>{s.duration_min ? `${s.duration_min} min · ` : ""}{s.calories} kcal{s.source === "watch" ? " · montre" : ""}</div>
              </div>
              <button onClick={() => onDeleteActivitySession(s.id)} aria-label="Supprimer" style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 10, width: 40, height: 40, color: C.textMuted, cursor: "pointer", flexShrink: 0 }}>✕</button>
            </div>
          ))}
          {!showAddActivity ? (
            <Btn variant="secondary" onClick={() => setShowAddActivity(true)} style={{ marginTop: sessionsForDate.length ? 8 : 0, width: "100%" }}>+ Ajouter une activité</Btn>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: sessionsForDate.length ? 8 : 0 }}>
              <div style={{ display: "flex", gap: 6 }}>
                {[["met", "Sans montre"], ["watch", "Avec montre"]].map(([v, label]) => (<button key={v} onClick={() => setActivityMode(v)} style={chip(activityMode === v)}>{label}</button>))}
              </div>
              {activityMode === "met" ? (<>
                <select value={activityTypeId} onChange={e => setActivityTypeId(e.target.value)} style={inputSt}>
                  <option value="">Type d'activité…</option>
                  {activityTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <NumField label="Durée" unit="min" value={activityDuration} onChange={e => setActivityDuration(e.target.value)} placeholder="45" />
                {!latestWeightKg && <div style={{ fontSize: 13, color: C.orange }}>Note d'abord ton poids dans Progrès pour estimer les calories.</div>}
              </>) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <NumField label="Calories actives" unit="kcal" value={watchCalories} onChange={e => setWatchCalories(e.target.value)} placeholder="320" />
                  <NumField label="Durée" unit="min" value={activityDuration} onChange={e => setActivityDuration(e.target.value)} placeholder="45" />
                </div>
              )}
              <div style={{ display: "flex", gap: 10 }}>
                <Btn variant="secondary" onClick={() => setShowAddActivity(false)} style={{ flex: 1 }}>Annuler</Btn>
                <Btn onClick={handleAddActivity} disabled={savingActivity} style={{ flex: 2 }}>{savingActivity ? "…" : "Ajouter"}</Btn>
              </div>
            </div>
          )}
        </Card>

        <Card style={{ padding: 14 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
            <span style={{ width: 40, height: 40, borderRadius: 12, background: C.field, display: "grid", placeItems: "center", fontSize: 18, flexShrink: 0 }}>📷</span>
            <span style={{ flex: 1, fontSize: 15 }}>Ajouter des photos <span style={{ display: "block", fontSize: 13, color: C.textMuted }}>Facultatif · pour ta coach</span></span>
            <input type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handlePhoto} />
          </label>
          {photos.length > 0 && (
            <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
              {photos.map((p, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img src={p} alt="" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 10 }} />
                  <button onClick={() => setPhotos(photos.filter((_, j) => j !== i))} aria-label="Retirer la photo" style={{ position: "absolute", top: -6, right: -6, background: C.white, border: "none", borderRadius: "50%", width: 22, height: 22, color: C.brandCream, fontSize: 11, cursor: "pointer" }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, padding: "12px 16px calc(12px + env(safe-area-inset-bottom, 0px))", background: C.black + "f2", borderTop: `1px solid ${C.border}`, zIndex: 40 }}>
        <div style={{ maxWidth: 528, margin: "0 auto" }}>
          <Btn onClick={handleSave} disabled={saving} style={{ width: "100%" }}>{saving ? "Enregistrement…" : isJournalFilled(existing) ? "Mettre à jour mon journal" : "Enregistrer mon journal"}</Btn>
        </div>
      </div>
    </div>
  );
};
// ══════════════════════════════════════════════════════════════════════════════
// JOURNAL ALIMENTAIRE — saisie des repas, dans son propre écran
// ══════════════════════════════════════════════════════════════════════════════
// Chaque repas est enregistré tout de suite dans la table meals ; le trigger SQL
// meals_sync_entries en recopie les totaux dans la ligne entries du jour, donc le
// journal général (et la fiche cliente côté coach) reste synchronisé sans action de plus.
const MealLogForm = ({ meals = [], profile, clientId, getKcalTarget = () => null, initialDate = today, onAddMeal, onUpdateMeal, onDeleteMeal, onBack, backLabel = "Retour", bottomNav = null }) => {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [editingMealId, setEditingMealId] = useState(null);
  const [mealSlot, setMealSlot] = useState(MEAL_SLOT_OPTIONS[0].value);
  const [mealText, setMealText] = useState("");
  const [mealPhotoUrl, setMealPhotoUrl] = useState(null);
  const [mealPhotoBase64, setMealPhotoBase64] = useState(null);
  const [uploadingMealPhoto, setUploadingMealPhoto] = useState(false);
  const [analyzingMeal, setAnalyzingMeal] = useState(false);
  const [mealError, setMealError] = useState("");
  // Résultat de l'analyse IA, montré à la cliente avant l'enregistrement
  const [pending, setPending] = useState(null);
  const [savingMeal, setSavingMeal] = useState(false);

  const mealsForDate = meals.filter(m => m.date === selectedDate);
  const dayTotal = key => Math.round(mealsForDate.reduce((sum, m) => sum + (m[key] || 0), 0));
  const target = proteinTarget(profile);
  const dayTarget = getKcalTarget(selectedDate);
  const fatMin = fatFloor(profile);

  const resetMealForm = () => { setShowAddMeal(false); setEditingMealId(null); setMealText(""); setMealSlot(MEAL_SLOT_OPTIONS[0].value); setMealError(""); setMealPhotoUrl(null); setMealPhotoBase64(null); setPending(null); };
  const startAddMeal = (slot) => { resetMealForm(); setMealSlot(slot); setShowAddMeal(true); };
  // Un repas déjà noté s'ouvre avec son détail (aliments repérés par l'IA) : modifiable ou supprimable
  const startEditMeal = (m) => { setEditingMealId(m.id); setMealSlot(m.meal_slot); setMealText(m.raw_text || ""); setMealPhotoUrl(m.photo_url || null); setMealPhotoBase64(null); setShowAddMeal(true); setMealError(""); setPending({ ...m, saved: true }); };

  // reject() est essentiel ici : sans elle, la moindre erreur (format image non décodable,
  // échec du storage...) laisse la promesse en attente pour toujours, avec le bouton
  // "Analyser" qui reste grisé indéfiniment et aucun message d'erreur affiché.
  const compressMealPhoto = (file) => new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    const fail = (msg) => { URL.revokeObjectURL(url); reject(new Error(msg)); };
    img.onerror = () => fail("Impossible de lire cette photo (format non supporté).");
    img.onload = () => {
      try {
        const MAX = 800;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          if (width > height) { height = Math.round(height * MAX / width); width = MAX; }
          else { width = Math.round(width * MAX / height); height = MAX; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
        const base64 = dataUrl.split(",")[1];
        canvas.toBlob(async (blob) => {
          if (!blob) { fail("Échec de la compression de la photo."); return; }
          URL.revokeObjectURL(url);
          // Le bucket "photos" a une policy RLS qui refuse cet upload (même limitation que
          // la photo générique du journal, cf. compressAndUpload) : on retombe sur le data
          // URL en base64 comme "url" d'affichage plutôt que de bloquer la cliente. Ça marche
          // pour l'affichage, juste moins optimal en taille qu'un vrai fichier Storage.
          try {
            const fileName = `${clientId}/meal_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
            const { error } = await supabase.storage.from("photos").upload(fileName, blob, { contentType: "image/jpeg", upsert: true });
            const publicUrl = error ? dataUrl : supabase.storage.from("photos").getPublicUrl(fileName).data.publicUrl;
            resolve({ url: publicUrl, base64 });
          } catch (err) {
            resolve({ url: dataUrl, base64 });
          }
        }, "image/jpeg", 0.75);
      } catch (err) {
        fail("Erreur lors du traitement de la photo.");
      }
    };
    img.src = url;
    // Garde-fou : si ni onload ni onerror ne se déclenchent (rare, certains navigateurs mobiles),
    // on ne reste jamais bloqué plus de 20s sans retour.
    setTimeout(() => fail("Le traitement de la photo prend trop de temps, réessaie."), 20000);
  });

  const handleMealPhoto = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setUploadingMealPhoto(true); setMealError("");
    try {
      const { url, base64 } = await compressMealPhoto(file);
      setMealPhotoUrl(url); setMealPhotoBase64(base64);
    } catch (err) {
      setMealError(err.message || "Impossible d'ajouter cette photo.");
    }
    setUploadingMealPhoto(false);
  };

  const fetchAsBase64 = async (url) => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.readAsDataURL(blob);
    });
  };

  const handleSubmitMeal = async () => {
    if (!mealText.trim() && !mealPhotoUrl) return;
    setAnalyzingMeal(true); setMealError("");
    // Photo fraîchement attachée cette session -> base64 déjà en mémoire. Photo d'un repas
    // existant en cours d'édition -> on la retélécharge pour la ré-analyser.
    const photoBase64 = mealPhotoBase64 || (mealPhotoUrl ? await fetchAsBase64(mealPhotoUrl) : null);
    const { data, error } = await analyzeMeal({ text: mealText.trim(), photoBase64 });
    if (error) { setMealError(error); setAnalyzingMeal(false); return; }
    setPending({
      date: selectedDate, meal_slot: mealSlot, raw_text: mealText.trim(), source: mealPhotoUrl ? "photo" : "text",
      photo_url: mealPhotoUrl || null,
      items: data.items || [], calories: data.calories || 0, protein_g: data.protein_g || 0,
      carb_g: data.carb_g || 0, fat_g: data.fat_g || 0, fiber_g: data.fiber_g || 0, sugar_g: data.sugar_g || 0,
      confidence: data.confidence ?? 0,
    });
    setAnalyzingMeal(false);
  };
  const handleSaveMeal = async () => {
    if (!pending) return;
    setSavingMeal(true);
    const { saved, id, client_id, created_at, updated_at, ...payload } = pending;
    if (editingMealId) await onUpdateMeal(editingMealId, payload);
    else await onAddMeal(payload);
    setSavingMeal(false); resetMealForm();
  };

  useEffect(() => { resetMealForm(); }, [selectedDate]);

  const SLOTS = ["petit-déjeuner", "déjeuner", "collation", "dîner"];
  const slotLabel = v => (MEAL_SLOT_OPTIONS.find(o => o.value === v)?.label || v).replace(/^\S+\s/, "");
  const num = { fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", textAlign: "right" };
  const macroRow = (label, value, goal, unit, pct, sub) => (<>
    <span style={{ fontSize: sub ? 14 : 15, color: sub ? C.textMuted : C.white, paddingLeft: sub ? 12 : 0 }}>{label}</span>
    <span style={{ height: 5, borderRadius: 3, background: pct != null ? C.track : "transparent", overflow: "hidden" }}>{pct != null && <i style={{ display: "block", height: "100%", width: `${Math.min(100, pct)}%`, background: C.green }} />}</span>
    <span style={{ ...num, fontSize: sub ? 14 : 15, color: C.textMuted }}><b style={{ color: sub ? C.textMuted : C.white, fontWeight: sub ? 600 : 650 }}>{value}</b>{goal ? ` / ${goal}` : ""} {unit}</span>
  </>);
  return (
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: F.sans, padding: "16px 16px 120px", maxWidth: 560, margin: "0 auto" }}>
      {!bottomNav && <button onClick={onBack} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 15, padding: "8px 0", marginBottom: 4, display: "flex", alignItems: "center", gap: 4, fontFamily: "inherit" }}><Icon name="back" size={18} /> {backLabel}</button>}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, margin: "4px 0 14px" }}>
        <h1 style={{ fontFamily: F.serif, fontWeight: 400, fontSize: 32, letterSpacing: "-0.6px", color: C.heading, margin: 0 }}>Mes repas</h1>
        {dayTarget && <Badge color={dayTarget.training ? C.pink : C.textMuted}>{dayTarget.training ? "Jour d'entraînement" : "Jour off"}</Badge>}
      </div>
      <DayPicker value={selectedDate} onChange={setSelectedDate} maxBack={3} />

      <Card style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <Eyebrow>Calories</Eyebrow>
          <span style={{ ...num, color: C.textMuted, fontSize: 15 }}><b style={{ color: C.white, fontSize: 22, fontWeight: 650 }}>{dayTotal("calories").toLocaleString()}</b>{dayTarget ? ` / ${dayTarget.target.toLocaleString()}` : ""} kcal</span>
        </div>
        {dayTarget && (<>
          <div style={{ height: 6, borderRadius: 3, background: C.track, overflow: "hidden", margin: "10px 0 6px" }}><i style={{ display: "block", height: "100%", width: `${Math.min(100, dayTotal("calories") / dayTarget.target * 100)}%`, background: C.cherry }} /></div>
          <div style={{ fontSize: 13, color: C.textMuted }}>{dayTarget.target - dayTotal("calories") >= 0 ? `Il reste ${(dayTarget.target - dayTotal("calories")).toLocaleString()} kcal` : `${(dayTotal("calories") - dayTarget.target).toLocaleString()} kcal au-dessus de l'objectif`}</div>
        </>)}
        <div style={{ display: "grid", gridTemplateColumns: "92px 1fr 112px", columnGap: 12, rowGap: 10, alignItems: "center", marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
          {macroRow("Protéines", dayTotal("protein_g"), target, "g", target ? dayTotal("protein_g") / target * 100 : null)}
          {macroRow("Lipides", dayTotal("fat_g"), fatMin, fatMin ? "g min." : "g", fatMin ? dayTotal("fat_g") / fatMin * 100 : null)}
          {macroRow("Glucides", dayTotal("carb_g"), null, "g", null)}
          {macroRow("dont sucres", dayTotal("sugar_g"), null, "g", null, true)}
          {macroRow("Fibres", dayTotal("fiber_g"), null, "g", null)}
        </div>
      </Card>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {SLOTS.map(slot => {
          const items = mealsForDate.filter(m => m.meal_slot === slot);
          const kcal = Math.round(items.reduce((sum, m) => sum + (m.calories || 0), 0));
          return (
            <div key={slot} style={{ background: items.length ? C.card : "transparent", border: `1px ${items.length ? "solid" : "dashed"} ${items.length ? C.border : C.muted + "88"}`, borderRadius: 16, padding: "12px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: 30 }}>
                <span style={{ fontWeight: 650, fontSize: 16, color: C.heading }}>{slotLabel(slot)}</span>
                {items.length ? <span style={{ ...num, fontWeight: 650 }}>{kcal} kcal</span> : <button onClick={() => startAddMeal(slot)} style={{ background: "none", border: "none", color: C.cherry, fontWeight: 650, fontSize: 15, cursor: "pointer", padding: "6px 0", fontFamily: "inherit" }}>+ Ajouter</button>}
              </div>
              {items.map(m => (
                <button key={m.id} onClick={() => startEditMeal(m)} style={{ width: "100%", display: "flex", justifyContent: "space-between", gap: 12, padding: "8px 0 2px", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 15, color: C.textMuted, textAlign: "left" }}>
                  <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.photo_url && !m.raw_text ? "📷 Photo" : m.raw_text || "Repas"}</span>
                  <span style={{ ...num, minWidth: 48 }}>{Math.round(m.calories)}</span>
                </button>
              ))}
              {items.length > 0 && <button onClick={() => startAddMeal(slot)} style={{ background: "none", border: "none", color: C.cherry, fontWeight: 600, fontSize: 14, cursor: "pointer", padding: "8px 0 0", fontFamily: "inherit" }}>+ Ajouter</button>}
            </div>
          );
        })}
      </div>

      {showAddMeal && (
        <div onClick={() => !analyzingMeal && !savingMeal && resetMealForm()} style={{ position: "fixed", inset: 0, background: C.overlay, zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: C.card, width: "100%", maxWidth: 560, maxHeight: "92vh", overflowY: "auto", borderRadius: "22px 22px 0 0", padding: "10px 18px calc(22px + env(safe-area-inset-bottom, 0px))", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ width: 40, height: 5, borderRadius: 3, background: C.border, alignSelf: "center" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontFamily: F.serif, fontWeight: 400, fontSize: 26, color: C.heading, margin: 0 }}>{slotLabel(mealSlot)}</h2>
              <button onClick={resetMealForm} aria-label="Fermer" style={{ background: "none", border: "none", fontSize: 20, color: C.textMuted, cursor: "pointer", width: 40, height: 40 }}>✕</button>
            </div>
            <Segmented options={SLOTS.map(v => [v, slotLabel(v).replace("Petit-déjeuner", "Petit-déj.")])} active={mealSlot} onChange={v => { setMealSlot(v); if (pending) setPending({ ...pending, meal_slot: v, saved: false }); }} />
            <TA placeholder="Ce que tu as mangé, avec les quantités si tu les connais. Ex : saumon 150 g, patate douce, salade avec 1 c. à s. d'huile d'olive" value={mealText} onChange={e => { setMealText(e.target.value); if (pending) setPending(null); }} style={{ minHeight: 84, marginTop: -6 }} />
            {mealPhotoUrl ? (
              <div style={{ position: "relative", alignSelf: "flex-start" }}>
                <img src={mealPhotoUrl} alt="" style={{ width: 120, height: 90, objectFit: "cover", borderRadius: 12 }} />
                <button onClick={() => { setMealPhotoUrl(null); setMealPhotoBase64(null); setPending(null); }} aria-label="Retirer la photo" style={{ position: "absolute", top: -8, right: -8, background: C.white, border: "none", borderRadius: "50%", width: 24, height: 24, color: C.brandCream, fontSize: 11, cursor: "pointer" }}>✕</button>
              </div>
            ) : (
              <label style={{ border: `1px dashed ${C.muted}`, borderRadius: 12, padding: 12, textAlign: "center", fontSize: 15, color: C.cherry, fontWeight: 600, cursor: uploadingMealPhoto ? "wait" : "pointer" }}>
                {uploadingMealPhoto ? "Envoi de la photo…" : "📷 Ajouter une photo"}
                <input type="file" accept="image/*" style={{ display: "none" }} disabled={uploadingMealPhoto} onChange={e => { setPending(null); handleMealPhoto(e); }} />
              </label>
            )}
            {mealError && <div style={{ fontSize: 14, color: C.red }}>{mealError}</div>}
            {pending && (
              <div style={{ background: C.field, borderRadius: 14, padding: "12px 14px" }}>
                <Eyebrow style={{ marginBottom: 8 }}>{pending.saved ? "Détail du repas" : "Estimé par l'IA · vérifie avant d'enregistrer"}</Eyebrow>
                {(pending.items || []).map((it, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 15, padding: "4px 0" }}>
                    <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.name}{it.quantity ? <span style={{ color: C.textMuted }}> · {it.quantity}</span> : null}</span>
                    <span style={{ ...num, color: C.textMuted }}>{Math.round(it.calories)}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 650, fontSize: 15, borderTop: `1px solid ${C.border}`, marginTop: 6, paddingTop: 8 }}>
                  <span>Total</span><span style={num}>{Math.round(pending.calories)} kcal</span>
                </div>
                <div style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>Protéines {Math.round(pending.protein_g)} g · glucides {Math.round(pending.carb_g)} g dont sucres {Math.round(pending.sugar_g || 0)} g · lipides {Math.round(pending.fat_g)} g{pending.confidence < 0.6 ? " · estimation approximative" : ""}</div>
              </div>
            )}
            {!pending ? (
              <Btn onClick={handleSubmitMeal} disabled={analyzingMeal || uploadingMealPhoto || (!mealText.trim() && !mealPhotoUrl)}>{analyzingMeal ? "Analyse en cours…" : "Analyser"}</Btn>
            ) : pending.saved ? (
              <div style={{ display: "flex", gap: 10 }}>
                <Btn variant="danger" onClick={async () => { await onDeleteMeal(editingMealId); resetMealForm(); }} style={{ flex: 1 }}>Supprimer</Btn>
                <Btn variant="secondary" onClick={() => setPending(null)} style={{ flex: 1 }}>Modifier</Btn>
              </div>
            ) : (
              <Btn onClick={handleSaveMeal} disabled={savingMeal}>{savingMeal ? "Enregistrement…" : `Enregistrer ${mealSlot === "dîner" ? "le dîner" : mealSlot === "collation" ? "la collation" : mealSlot === "déjeuner" ? "le déjeuner" : "le petit-déjeuner"}`}</Btn>
            )}
          </div>
        </div>
      )}
      {bottomNav}
    </div>
  );
};
// ══════════════════════════════════════════════════════════════════════════════
// PERF CARD — une ligne par série
// ══════════════════════════════════════════════════════════════════════════════
const PerfCard = ({ log, workout }) => {
  let exLogs = {};
  try { exLogs = JSON.parse(log.exercise_logs || "{}"); } catch {}
  const enrichedLogs = Object.entries(exLogs).map(([key, exLog]) => {
    let name = exLog.name;
    if (!name && workout) {
      const allEx = (workout.blocks || []).flatMap(b => b.type === "circuit" ? b.exercises : [b]);
      const match = allEx.find(e => e.id === key) || workout.exercises?.find(e => e.id === key);
      name = match?.name || "—";
    }
    // Compat ancien format (weight/reps uniques) -> on le transforme en 1 ligne
    const sets = exLog.sets && exLog.sets.length > 0 ? exLog.sets : (exLog.weight || exLog.reps ? [{ weight: exLog.weight, reps: exLog.reps }] : []);
    return { ...exLog, name: name || "—", sets };
  }).filter(l => l.sets.some(s => s.weight || s.reps));
  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div><div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>{log.workout_name}</div><div style={{ fontSize: 12, color: C.textMuted }}>{formatDate(log.date)}</div></div>
        <Badge color={C.green}>✅ Réalisée</Badge>
      </div>
      {enrichedLogs.length > 0 && (
        <div style={{ marginBottom: log.note ? 14 : 0 }}>
          <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 10 }}>DÉTAIL DES EXERCICES</div>
          {enrichedLogs.map((exLog, i) => (
            <div key={i} style={{ padding: "10px 12px", background: C.field, borderRadius: 10, marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{exLog.name}</div>
                {exLog.suggested_weight && <div style={{ fontSize: 11, color: C.textMuted }}>Suggéré : {exLog.suggested_weight} {exLog.weight_type}</div>}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {exLog.sets.map((s, si) => (s.weight || s.reps) && (
                  <div key={si} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 8px", background: C.card, borderRadius: 8 }}>
                    <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 700 }}>Série {si + 1}</span>
                    <div style={{ display: "flex", gap: 12 }}>
                      {s.weight && <span style={{ fontSize: 13, fontWeight: 800, color: C.pink }}>{s.weight}</span>}
                      {s.reps && <span style={{ fontSize: 13, fontWeight: 800, color: C.purple }}>{s.reps} reps</span>}
                    </div>
                  </div>
                ))}
              </div>
              {exLog.comment && <div style={{ marginTop: 6, fontSize: 12, color: C.pink, fontStyle: "italic" }}>💬 {exLog.comment}</div>}
            </div>
          ))}
        </div>
      )}
      {enrichedLogs.length === 0 && <div style={{ fontSize: 13, color: C.textMuted, textAlign: "center", padding: "8px 0" }}>Aucune performance saisie</div>}
      {log.note && <div style={{ background: C.pink + "15", borderRadius: 10, padding: 10, fontSize: 13, color: C.pink }}>💬 {log.note}</div>}
    </Card>
  );
};

// Calories consommées vs objectif fixé par la coach — constat neutre, jamais de jugement.
// training : true/false pour préciser le type de jour, null pour une moyenne.
const CalorieProgress = ({ value, target, label, training = null }) => {
  const v = Math.round(value);
  const pct = Math.min(100, Math.round((v / target) * 100));
  const left = target - v;
  return (
    <div style={{ background: C.yellow + "10", border: `1px solid ${C.yellow}33`, borderRadius: 12, padding: "10px 14px", marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: C.yellow, fontWeight: 700 }}>🔥 {label.toUpperCase()}</span>
        <span style={{ fontSize: 14, fontWeight: 900 }}>{v.toLocaleString()} <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 400 }}>/ {target.toLocaleString()} kcal</span></span>
      </div>
      <div style={{ height: 6, background: C.track, borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: C.yellow, borderRadius: 3 }} />
      </div>
      <div style={{ fontSize: 11, color: C.textMuted, marginTop: 6 }}>
        {training === true ? "Jour d'entraînement · " : training === false ? "Jour off · " : ""}
        {left >= 0 ? `Il reste ${left.toLocaleString()} kcal` : `${(-left).toLocaleString()} kcal au-dessus de l'objectif`}
      </div>
    </div>
  );
};

// Protéines consommées vs objectif fixé par la coach — constat neutre, jamais de jugement
const ProteinProgress = ({ value, target, label }) => {
  const pct = Math.min(100, Math.round((value / target) * 100));
  const reached = value >= target;
  return (
    <div style={{ background: C.green + "10", border: `1px solid ${C.green}33`, borderRadius: 12, padding: "10px 14px", marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: C.green, fontWeight: 700 }}>💪 {label.toUpperCase()}</span>
        <span style={{ fontSize: 14, fontWeight: 900 }}>{value} g <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 400 }}>/ {target} g</span></span>
      </div>
      <div style={{ height: 6, background: C.track, borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: C.green, borderRadius: 3 }} />
      </div>
      <div style={{ fontSize: 11, color: C.textMuted, marginTop: 6 }}>{reached ? "Objectif de protéines atteint" : `Encore ${target - value} g pour atteindre l'objectif`}</div>
    </div>
  );
};

const EntryDetail = ({ entry, onBack, profile, weights = [], activitySessions = [], meals = [], showBalance = false }) => {
  const [zoomPhoto, setZoomPhoto] = useState(null);
  const sessionsForDate = activitySessions.filter(s => s.date === entry.date);
  const slotOrder = (slot) => { const i = MEAL_SLOT_OPTIONS.findIndex(o => o.value === slot); return i < 0 ? 99 : i; };
  const mealsForDate = meals.filter(m => m.date === entry.date).sort((a, b) => slotOrder(a.meal_slot) - slotOrder(b.meal_slot));
  const weightForDate = [...weights].reverse().find(w => w.date <= entry.date) || weights[0];
  const dailyEnergy = calcDailyEnergy({ profile, weightKg: weightForDate?.value, steps: entry.steps, activitySessions: sessionsForDate });
  const balanceMsg = dailyEnergy && entry.calories_total != null && isJournalFilled(entry) ? energyBalanceMessage(entry.calories_total - dailyEnergy.tdee, profile?.nutrition_goal) : null;
  const hasWeightThisWeek = weights.some(w => Math.abs((new Date(w.date) - new Date(entry.date)) / 86400000) <= 7);
  const reliability = calcReliability({
    hasEntry: true,
    hasSteps: !!entry.steps,
    hasWeightThisWeek,
    hasActivityInfo: sessionsForDate.length > 0 || !!entry.session_status,
    hasCalories: entry.calories_total != null,
  });
  return (
  <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: F.sans, padding: 20 }}>
    <button onClick={onBack} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 14, marginBottom: 18, padding: 0 }}>← Retour</button>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
      <h2 style={{ fontSize: 20, fontFamily: F.serif, fontWeight: 400, letterSpacing: "-0.5px", color: C.heading, margin: 0 }}>{new Date(entry.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</h2>
      <span style={{ fontSize: 36 }}>{feelings[(entry.feeling || 3) - 1]}</span>
    </div>
    <div style={{ fontSize: 14, color: C.textMuted, marginBottom: 20, fontWeight: 600 }}>{feelingLabels[(entry.feeling || 3) - 1]}</div>
    {profile && showBalance && (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: C.pink + "10", border: `1px solid ${C.pink}33`, borderRadius: 14, padding: 16, marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 11, color: C.pink, fontWeight: 700, marginBottom: 4 }}>⚡ BALANCE ÉNERGÉTIQUE</div>
          {dailyEnergy ? (
            <>
              <div style={{ fontSize: 13, color: C.textMuted }}>Dépense estimée : <strong style={{ color: C.white }}>≈ {round50(dailyEnergy.tdee).toLocaleString()} kcal</strong></div>
              {balanceMsg ? <div style={{ fontSize: 14, fontWeight: 700, color: balanceMsg.color, marginTop: 4 }}>{balanceMsg.text}</div> : <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Calories du jour non renseignées</div>}
            </>
          ) : <div style={{ fontSize: 12, color: C.textMuted }}>Poids manquant pour estimer la dépense</div>}
        </div>
        <div style={{ textAlign: "center", flexShrink: 0 }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: reliability >= 80 ? C.green : reliability >= 50 ? C.orange : C.red }}>{reliability}%</div>
          <div style={{ fontSize: 9, color: C.textMuted, fontWeight: 700 }}>FIABILITÉ</div>
        </div>
      </div>
    )}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14 }}><div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>PAS</div><div style={{ fontSize: 24, fontWeight: 900, color: C.pink }}>{(entry.steps || 0).toLocaleString()}</div></div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14 }}><div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>SÉANCE</div><div style={{ fontWeight: 700, fontSize: 13, color: sessionColor(entry.session_status) }}>{sessionLabel(entry.session_status)}</div></div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14 }}><div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>💧 HYDRATATION</div><div style={{ fontSize: 24, fontWeight: 900, color: C.blue }}>{entry.hydration || "—"} L</div></div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14 }}><div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>😴 SOMMEIL</div><div style={{ fontSize: 20, fontWeight: 900 }}>{entry.sleep_hours || "—"}h{entry.nap ? <span style={{ fontSize: 13, color: C.purple }}> · sieste</span> : ""}</div></div>
    </div>
    {sessionsForDate.length > 0 && (
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 10 }}>🏃 ACTIVITÉ SPORTIVE</div>
        {sessionsForDate.map(s => (
          <div key={s.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "6px 0", borderBottom: `1px solid ${C.border}` }}>
            <span>{s.activity_name}{s.duration_min ? ` · ${s.duration_min} min` : ""}</span>
            <span style={{ fontWeight: 700, color: C.orange }}>{s.calories} kcal</span>
          </div>
        ))}
      </div>
    )}
    {(entry.calories_total || entry.protein_total || entry.carb_total || entry.fat_total) && (
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 12 }}>🍽️ TOTAUX ALIMENTAIRES</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {[{ l: "KCAL", v: entry.calories_total, c: C.yellow, u: "" }, { l: "PROT", v: entry.protein_total, c: C.green, u: "g" }, { l: "GLUC", v: entry.carb_total, c: C.blue, u: "g" }, { l: "LIP", v: entry.fat_total, c: C.pink, u: "g" }].map(s => (
            <div key={s.l} style={{ background: C.field, borderRadius: 10, padding: "8px 4px", textAlign: "center" }}><div style={{ fontSize: 15, fontWeight: 900, color: s.c }}>{s.v != null ? `${s.v}${s.u}` : "—"}</div><div style={{ fontSize: 9, color: C.textMuted, marginTop: 2 }}>{s.l}</div></div>
          ))}
        </div>
        {proteinTarget(profile) && entry.protein_total != null && <div style={{ marginTop: 12 }}><ProteinProgress value={Math.round(entry.protein_total)} target={proteinTarget(profile)} label="Protéines vs objectif" /></div>}
      </div>
    )}
    {mealsForDate.length > 0 ? (
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 12 }}>🍽️ REPAS ({mealsForDate.length})</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {mealsForDate.map(m => (
            <div key={m.id} style={{ background: C.field, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 12, color: C.pink, fontWeight: 700, marginBottom: 8 }}>{MEAL_SLOT_OPTIONS.find(o => o.value === m.meal_slot)?.label || m.meal_slot}</div>
              {m.photo_url && <img src={m.photo_url} alt="" onClick={() => setZoomPhoto(m.photo_url)} style={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 8, marginBottom: 8, cursor: "zoom-in" }} />}
              {m.raw_text && <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 8 }}>{m.raw_text}</div>}
              {m.items && m.items.length > 0 && (
                <div style={{ background: C.field2, borderRadius: 8, padding: "8px 10px", marginBottom: 8 }}>
                  <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 4 }}>🔍 REPÉRÉ PAR L'IA</div>
                  {m.items.map((it, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 12, padding: "3px 0", borderBottom: i < m.items.length - 1 ? `1px solid ${C.border}` : "none" }}>
                      <span style={{ color: C.white }}>{it.name} <span style={{ color: C.textMuted }}>· {it.quantity}</span></span>
                      <span style={{ color: C.textMuted, flexShrink: 0 }}>{Math.round(it.calories)} kcal</span>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {m.calories != null && <Badge color={C.yellow}>{Math.round(m.calories)} kcal</Badge>}
                {m.protein_g != null && <Badge color={C.green}>💪 {Math.round(m.protein_g)}g</Badge>}
                {m.carb_g != null && <Badge color={C.blue}>🍞 {Math.round(m.carb_g)}g</Badge>}
                {m.fat_g != null && <Badge color={C.pink}>🥑 {Math.round(m.fat_g)}g</Badge>}
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : entry.meal_note && <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, marginBottom: 12 }}><div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 8 }}>🍽️ REPAS</div><div style={{ fontSize: 14, lineHeight: 1.6 }}>{entry.meal_note}</div></div>}
    {zoomPhoto && (
      <div onClick={() => setZoomPhoto(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, cursor: "zoom-out" }}>
        <img src={zoomPhoto} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 10 }} />
      </div>
    )}
    {entry.photos && entry.photos.length > 0 && (
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 12 }}>📷 PHOTOS REPAS ({entry.photos.length})</div>
        <div style={{ display: "grid", gridTemplateColumns: entry.photos.length === 1 ? "1fr" : "repeat(2, 1fr)", gap: 10 }}>
          {entry.photos.map((p, i) => <img key={i} src={p} alt="" style={{ width: "100%", aspectRatio: entry.photos.length === 1 ? "16/9" : "1", objectFit: "cover", borderRadius: 10 }} />)}
        </div>
      </div>
    )}
    {entry.session_note && <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, marginBottom: 12 }}><div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 8 }}>💪 NOTE SÉANCE</div><div style={{ fontSize: 14, lineHeight: 1.6 }}>{entry.session_note}</div></div>}
    {entry.had_difficulty && <div style={{ background: C.orange + "15", border: `1px solid ${C.orange}44`, borderRadius: 14, padding: 16, marginBottom: 12 }}><div style={{ fontSize: 11, color: C.orange, fontWeight: 700, marginBottom: 8 }}>⚠️ DIFFICULTÉ</div><div style={{ fontSize: 14, lineHeight: 1.6 }}>{entry.difficulty_note || "Difficulté signalée"}</div></div>}
    {entry.coach_message && <div style={{ background: C.pink + "15", border: `1px solid ${C.pink}44`, borderRadius: 14, padding: 16, marginBottom: 12 }}><div style={{ fontSize: 11, color: C.pink, fontWeight: 700, marginBottom: 8 }}>💬 MESSAGE DE TON COACH</div><div style={{ fontSize: 14, lineHeight: 1.6 }}>{entry.coach_message}</div></div>}
  </div>
  );
};

// Une journée du journal en une carte compacte : ressenti, chiffres clés sur une ligne,
// alimentation, puis seulement ce qui mérite l'attention (difficulté, photos, message).
const EntryCard = ({ e, onClick, proteinGoal }) => {
  const filled = isJournalFilled(e);
  const facts = filled ? [
    `${(e.steps || 0).toLocaleString()} pas`,
    sessionLabel(e.session_status).replace(/^\S+\s/, ""),
    e.sleep_hours ? `${String(e.sleep_hours).replace(".", ",")} h de sommeil${e.nap ? " + sieste" : ""}` : null,
    e.hydration ? `${String(e.hydration).replace(".", ",")} L d'eau` : null,
  ].filter(Boolean) : [];
  return (
    <Card onClick={onClick} style={{ padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 26, width: 32, textAlign: "center", flexShrink: 0 }}>{filled ? feelings[(e.feeling || 3) - 1] : "🍽️"}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 650, fontSize: 15, textTransform: "capitalize" }}>{new Date(e.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</div>
          <div style={{ fontSize: 13.5, color: C.textMuted }}>{filled ? `${feelingLabels[(e.feeling || 3) - 1]} · ${facts.join(" · ")}` : "Repas notés, journal non rempli"}</div>
        </div>
        {onClick && <Icon name="chevron" size={18} color={C.muted} />}
      </div>
      {e.calories_total != null && (
        <div style={{ fontSize: 13.5, color: C.textMuted, marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.border}`, fontVariantNumeric: "tabular-nums" }}>
          <b style={{ color: C.white, fontWeight: 650 }}>{Math.round(e.calories_total)} kcal</b>
          {e.protein_total != null && ` · protéines ${Math.round(e.protein_total)}${proteinGoal ? ` / ${proteinGoal}` : ""} g`}
          {e.carb_total != null && ` · glucides ${Math.round(e.carb_total)} g`}
          {e.fat_total != null && ` · lipides ${Math.round(e.fat_total)} g`}
        </div>
      )}
      {e.had_difficulty && (
        <div style={{ background: C.orange + "12", borderRadius: 10, padding: "9px 12px", marginTop: 10, fontSize: 14 }}>
          <b style={{ color: C.orange, fontWeight: 650 }}>Difficulté · </b>{e.difficulty_note || "signalée sans détail"}
        </div>
      )}
      {e.session_note && <div style={{ fontSize: 14, color: C.textMuted, marginTop: 8 }}>Séance : {e.session_note}</div>}
      {e.photos && e.photos.length > 0 && <div style={{ display: "flex", gap: 6, marginTop: 10 }}>{e.photos.slice(0, 4).map((p, i) => <img key={i} src={p} alt="" style={{ width: 54, height: 54, objectFit: "cover", borderRadius: 8 }} />)}{e.photos.length > 4 && <span style={{ fontSize: 13, color: C.textMuted, alignSelf: "center" }}>+{e.photos.length - 4}</span>}</div>}
      {e.coach_message && <div style={{ background: C.pink + "12", borderRadius: 10, padding: "9px 12px", marginTop: 10, fontSize: 14, color: C.pink }}>Message de Nina · {e.coach_message}</div>}
    </Card>
  );
};

const PaymentHistory = ({ payments }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
    {payments.length === 0 && <p style={{ color: C.textMuted, textAlign: "center", margin: 0 }}>Aucun paiement enregistré.</p>}
    {payments.map((p, i) => (
      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: C.field, borderRadius: 12 }}>
        <div><div style={{ fontWeight: 700, fontSize: 14, color: C.green }}>✅ {p.amount} €</div><div style={{ fontSize: 12, color: C.textMuted }}>Reçu le {formatDate(p.paid_date)}</div>{p.note && <div style={{ fontSize: 12, color: C.textMuted }}>{p.note}</div>}</div>
        <div style={{ textAlign: "right" }}><div style={{ fontSize: 11, color: C.textMuted }}>Prochain</div><div style={{ fontSize: 13, fontWeight: 700, color: C.yellow }}>{formatDate(p.next_due_date)}</div></div>
      </div>
    ))}
  </div>
);

const WorkoutScheduleEditor = ({ workoutId, schedule, onSchedule, onUnschedule }) => {
  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState(today);
  const [weeks, setWeeks] = useState(1);
  const upcoming = schedule.filter(s => s.workout_id === workoutId && s.date >= today).sort((a, b) => a.date.localeCompare(b.date));

  const handleAdd = () => {
    if (!date) return;
    const dates = Array.from({ length: Math.max(1, parseInt(weeks) || 1) }, (_, i) => addDays(date, i * 7));
    onSchedule(workoutId, dates);
    setShowForm(false); setDate(today); setWeeks(1);
  };

  return (
    <div>
      <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>📅 Programmation</div>
      {upcoming.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
          {upcoming.map(s => (
            <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: C.field, borderRadius: 8, padding: "8px 12px" }}>
              <span style={{ fontSize: 13 }}>{formatDate(s.date)}</span>
              <button onClick={() => onUnschedule(s.id)} style={{ background: C.red + "22", border: "none", borderRadius: 6, width: 24, height: 24, color: C.red, cursor: "pointer" }}>✕</button>
            </div>
          ))}
        </div>
      )}
      {!showForm ? (
        <button onClick={() => setShowForm(true)} style={{ width: "100%", padding: 10, borderRadius: 10, border: `1px dashed ${C.pink}55`, background: C.field, color: C.pink, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>+ Programmer une date</button>
      ) : (
        <div style={{ background: C.field, borderRadius: 10, padding: 12 }}>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ ...inputSt, fontSize: 13, marginBottom: 10 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: C.textMuted }}>Répéter chaque semaine, pendant</span>
            <input type="number" min="1" max="26" value={weeks} onChange={e => setWeeks(e.target.value)} style={{ ...inputSt, width: 60, fontSize: 13, padding: "8px 10px" }} />
            <span style={{ fontSize: 12, color: C.textMuted }}>semaine{weeks > 1 ? "s" : ""}</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="secondary" small onClick={() => setShowForm(false)} style={{ flex: 1 }}>Annuler</Btn>
            <Btn small onClick={handleAdd} style={{ flex: 2 }}>Programmer</Btn>
          </div>
        </div>
      )}
    </div>
  );
};

const nextWeekMonday = () => {
  const d = startOfWeek(new Date());
  d.setDate(d.getDate() + 7);
  return dayKey(d);
};

const WeeklyFocusEditor = ({ weeklyFocus = [], onSave }) => {
  const weekStart = nextWeekMonday();
  const existing = weeklyFocus.find(w => w.week_start === weekStart);
  const [editing, setEditing] = useState(false);
  const [objectif, setObjectif] = useState(existing?.objectif || "");
  const [engagement, setEngagement] = useState(existing?.engagement || "");
  const [pourquoi, setPourquoi] = useState(existing?.pourquoi || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setObjectif(existing?.objectif || ""); setEngagement(existing?.engagement || ""); setPourquoi(existing?.pourquoi || "");
  }, [existing?.id]);

  const handleSave = async () => {
    setSaving(true);
    await onSave(weekStart, { objectif, engagement, pourquoi });
    setSaving(false); setEditing(false);
  };

  return (
    <Card style={{ marginBottom: 14, borderColor: C.cherry + "55" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700 }}>🎯 OBJECTIF — SEMAINE DU {new Date(weekStart).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</div>
        {!editing && <button onClick={() => setEditing(true)} style={{ background: "none", border: "none", color: C.cherryLight, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{existing ? "Modifier" : "+ Définir"}</button>}
      </div>
      {editing ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Inp label="Objectif" placeholder="ex: Mieux répartir mes protéines sur la journée" value={objectif} onChange={e => setObjectif(e.target.value)} />
          <Inp label="Engagement concret" placeholder="ex: Ajouter une source de protéines au petit-déj, 4 jours cette semaine" value={engagement} onChange={e => setEngagement(e.target.value)} />
          <TA label="Pourquoi (optionnel)" placeholder="ex: Pour améliorer la satiété" value={pourquoi} onChange={e => setPourquoi(e.target.value)} />
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="secondary" small onClick={() => setEditing(false)} style={{ flex: 1 }}>Annuler</Btn>
            <Btn small onClick={handleSave} disabled={saving} style={{ flex: 2 }}>{saving ? "..." : "Enregistrer"}</Btn>
          </div>
        </div>
      ) : existing ? (
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{existing.objectif}</div>
          {existing.engagement && <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 4 }}>→ {existing.engagement}</div>}
          {existing.pourquoi && <div style={{ fontSize: 12, color: C.textMuted, fontStyle: "italic" }}>{existing.pourquoi}</div>}
        </div>
      ) : (
        <p style={{ color: C.textMuted, fontSize: 12, margin: 0 }}>Pas encore d'objectif défini pour la semaine à venir.</p>
      )}
    </Card>
  );
};

const CoachAnalysisCard = ({ weekStart, weekLabel, clientName, goal, summary, checkin, cyclePhase, existing, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [fonctionne, setFonctionne] = useState(existing?.analyse_fonctionne || "");
  const [surveiller, setSurveiller] = useState(existing?.analyse_surveiller || "");
  const [decision, setDecision] = useState(existing?.decision || "");
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  useEffect(() => {
    setFonctionne(existing?.analyse_fonctionne || ""); setSurveiller(existing?.analyse_surveiller || ""); setDecision(existing?.decision || "");
    setEditing(false); setAiError("");
  }, [weekStart, existing?.id]);

  const hasContent = existing?.analyse_fonctionne || existing?.analyse_surveiller || existing?.decision;

  const handleSave = async () => {
    setSaving(true);
    await onSave(weekStart, { analyse_fonctionne: fonctionne, analyse_surveiller: surveiller, decision });
    setSaving(false); setEditing(false);
  };

  const handleAiSuggest = async () => {
    setEditing(true); setAiLoading(true); setAiError("");
    const { data, error } = await analyzeWeeklyBilan({ clientName, weekLabel, goal, summary, checkin, cyclePhase });
    if (error) { setAiError(error); setAiLoading(false); return; }
    setFonctionne(data.ce_qui_fonctionne || ""); setSurveiller(data.a_surveiller || ""); setDecision(data.decision_suggeree || "");
    setAiLoading(false);
  };

  if (!editing) return (
    <div>
      {hasContent ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {existing.analyse_fonctionne && <div style={{ fontSize: 13 }}><strong style={{ color: C.green }}>Ce qui fonctionne :</strong> {existing.analyse_fonctionne}</div>}
          {existing.analyse_surveiller && <div style={{ fontSize: 13 }}><strong style={{ color: C.orange }}>À surveiller :</strong> {existing.analyse_surveiller}</div>}
          {existing.decision && <div style={{ fontSize: 13 }}><strong style={{ color: C.cherryLight }}>Décision :</strong> {existing.decision}</div>}
        </div>
      ) : <p style={{ color: C.textMuted, fontSize: 12, margin: 0 }}>Pas encore d'analyse pour cette semaine.</p>}
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <Btn variant="ghost" small onClick={() => setEditing(true)}>{hasContent ? "✏️ Modifier" : "+ Écrire moi-même"}</Btn>
        <Btn variant="ghost" small onClick={handleAiSuggest} disabled={aiLoading}>{aiLoading ? "Analyse..." : "🤖 Suggestion IA"}</Btn>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <Btn variant="ghost" small onClick={handleAiSuggest} disabled={aiLoading} style={{ alignSelf: "flex-start" }}>{aiLoading ? "Analyse en cours..." : "🤖 " + (hasContent || fonctionne ? "Régénérer la" : "Générer une") + " suggestion IA"}</Btn>
      {aiError && <div style={{ fontSize: 12, color: C.red }}>{aiError}</div>}
      <TA label="Ce qui fonctionne" value={fonctionne} onChange={e => setFonctionne(e.target.value)} />
      <TA label="À surveiller" value={surveiller} onChange={e => setSurveiller(e.target.value)} />
      <TA label="Décision" value={decision} onChange={e => setDecision(e.target.value)} />
      <div style={{ display: "flex", gap: 8 }}>
        <Btn variant="secondary" onClick={() => setEditing(false)} style={{ flex: 1 }}>Annuler</Btn>
        <Btn onClick={handleSave} disabled={saving} style={{ flex: 2 }}>{saving ? "..." : "Enregistrer"}</Btn>
      </div>
    </div>
  );
};

const FourWeekComparison = ({ entries, meals, activitySessions, weights, profile, weeklyCheckins = [] }) => {
  const thisMonday = startOfWeek(new Date());
  const weeks = [3, 2, 1, 0].map(n => {
    const monday = new Date(thisMonday);
    monday.setDate(monday.getDate() - n * 7);
    const weekDates = isoWeekDates(monday);
    const summary = calcWeeklySummary({ entries, meals, activitySessions, weights, profile, weekDates });
    const checkin = weeklyCheckins.find(c => c.week_start === weekDates[0]);
    const weightsInWeek = weights.filter(w => weekDates.includes(w.date));
    const weight = weightsInWeek.length ? weightsInWeek[weightsInWeek.length - 1].value : ([...weights].reverse().find(w => w.date <= weekDates[6])?.value ?? null);
    return { label: n === 0 ? "Cette sem." : `S-${n}`, summary, checkin, weight };
  });

  const rows = [
    ["Poids", w => w.weight != null ? `${w.weight} kg` : "—"],
    ["Calories", w => w.summary.avgCalories ?? "—"],
    ["Protéines", w => w.summary.avgProtein != null ? `${w.summary.avgProtein}g` : "—"],
    ["Pas", w => w.summary.avgSteps?.toLocaleString() ?? "—"],
    ["Faim", w => w.checkin?.faim != null ? `${w.checkin.faim}/5` : "—"],
    ["Énergie", w => w.checkin?.energie != null ? `${w.checkin.energie}/5` : "—"],
  ];

  return (
    <Card style={{ marginBottom: 14, overflowX: "auto" }}>
      <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 12 }}>📈 ÉVOLUTION SUR 4 SEMAINES</div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 360 }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "4px 8px" }}></th>
            {weeks.map(w => <th key={w.label} style={{ padding: "4px 8px", color: C.textMuted, fontWeight: 700 }}>{w.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, get]) => (
            <tr key={label} style={{ borderTop: `1px solid ${C.border}` }}>
              <td style={{ padding: "8px", fontWeight: 700, color: C.white }}>{label}</td>
              {weeks.map(w => <td key={w.label} style={{ padding: "8px", textAlign: "center", color: C.textMuted }}>{get(w)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};

const WeeklyBilanView = ({ entries, meals, activitySessions, weights, profile, weeklyCheckins = [], weeklyFocus = [], onSaveFocus, clientName, schedule = [], sessionLogs = [] }) => {
  const [offset, setOffset] = useState(0);
  const monday = startOfWeek(new Date());
  monday.setDate(monday.getDate() + offset * 7);
  const weekDates = isoWeekDates(monday);
  const summary = calcWeeklySummary({ entries, meals, activitySessions, weights, profile, weekDates, trainingCtx: { schedule, sessionLogs } });
  const balanceMsg = summary.balanceAvg != null ? energyBalanceMessage(summary.balanceAvg, profile?.nutrition_goal) : null;
  const cyclePhase = calcCyclePhase(profile, weekDates[6]);
  const weekAvgWeight = avgWeightBetween(weights, weekDates[0], weekDates[6]);
  const prevAvgWeight = avgWeightBetween(weights, addDays(weekDates[0], -7), addDays(weekDates[0], -1));

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <button onClick={() => setOffset(o => o - 1)} style={{ background: "none", border: "none", color: C.textMuted, fontSize: 20, cursor: "pointer", padding: "0 8px" }}>‹</button>
        <span style={{ fontSize: 13, fontWeight: 700 }}>{new Date(weekDates[0]).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} – {new Date(weekDates[6]).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span>
        <button onClick={() => offset < 0 && setOffset(o => o + 1)} style={{ background: "none", border: "none", color: offset >= 0 ? C.border : C.textMuted, fontSize: 20, cursor: offset >= 0 ? "default" : "pointer", padding: "0 8px" }}>›</button>
      </div>
      {cyclePhase && (
        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 14, textAlign: "center" }}>🌙 Cycle (estimé) : <strong style={{ color: C.white }}>{cyclePhase.label}</strong></div>
      )}
      {!profile ? (
        <Card><p style={{ color: C.textMuted, fontSize: 13, textAlign: "center", margin: 0 }}>Profil nutritionnel non renseigné — certains indicateurs ne peuvent pas être calculés.</p></Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Card>
            <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 10 }}>RÉGULARITÉ</div>
            <div style={{ fontSize: 22, fontWeight: 900 }}>{summary.daysCompleted}/{summary.totalDays} <span style={{ fontSize: 13, color: C.textMuted, fontWeight: 400 }}>jours de journal remplis</span></div>
          </Card>
          <Card>
            <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 10 }}>⚡ BALANCE ÉNERGÉTIQUE</div>
            {summary.balanceTotal != null ? (
              <>
                <div style={{ fontSize: 22, fontWeight: 900 }}>{summary.balanceTotal > 0 ? "+" : ""}{summary.balanceTotal.toLocaleString()} kcal <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 400 }}>cumulé</span></div>
                {balanceMsg && <div style={{ fontSize: 13, fontWeight: 700, color: balanceMsg.color, marginTop: 4 }}>Moyenne/jour : {balanceMsg.text}</div>}
              </>
            ) : <div style={{ fontSize: 13, color: C.textMuted }}>Pas assez de données cette semaine.</div>}
          </Card>
          <Card>
            <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 10 }}>🍽️ NUTRITION — MOYENNE/JOUR ({summary.mealDaysCount} jour{summary.mealDaysCount > 1 ? "s" : ""} loggé{summary.mealDaysCount > 1 ? "s" : ""})</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {[["Calories", summary.avgCalories, "kcal", C.yellow], ["Protéines", summary.avgProtein, "g", C.green], ["Glucides", summary.avgCarb, "g", C.blue], ["Lipides", summary.avgFat, "g", C.pink], ["Fibres", summary.avgFiber, "g", C.purple], ["Sucres", summary.avgSugar, "g", C.orange]].map(([label, val, unit, color]) => (
                <div key={label} style={{ background: C.field, borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 16, fontWeight: 900, color }}>{val != null ? `${val}${unit}` : "—"}</div>
                  <div style={{ fontSize: 9, color: C.textMuted, marginTop: 2 }}>{label.toUpperCase()}</div>
                  {label === "Protéines" && proteinTarget(profile) && <div style={{ fontSize: 9, color: C.green, marginTop: 2 }}>objectif {proteinTarget(profile)} g</div>}
                  {label === "Calories" && summary.avgKcalTarget && <div style={{ fontSize: 9, color: C.yellow, marginTop: 2 }}>objectif ≈ {summary.avgKcalTarget}</div>}
                  {label === "Lipides" && fatFloor(profile) && <div style={{ fontSize: 9, color: C.pink, marginTop: 2 }}>min {fatFloor(profile)} g</div>}
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 10 }}>⚖️ POIDS — MOYENNE DE LA SEMAINE</div>
            {weekAvgWeight != null ? (
              <div style={{ fontSize: 22, fontWeight: 900 }}>{weekAvgWeight.toFixed(1)} kg {prevAvgWeight != null && <span style={{ fontSize: 13, color: C.textMuted, fontWeight: 400 }}>({weekAvgWeight - prevAvgWeight > 0 ? "+" : ""}{(weekAvgWeight - prevAvgWeight).toFixed(1)} kg vs semaine précédente)</span>}</div>
            ) : <div style={{ fontSize: 13, color: C.textMuted }}>Aucune pesée cette semaine.</div>}
          </Card>
          <Card>
            <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 10 }}>🏃 ACTIVITÉ</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              <div style={{ background: C.field, borderRadius: 10, padding: "10px 8px", textAlign: "center" }}><div style={{ fontSize: 16, fontWeight: 900 }}>{summary.avgSteps?.toLocaleString() ?? "—"}</div><div style={{ fontSize: 9, color: C.textMuted, marginTop: 2 }}>PAS/JOUR</div></div>
              <div style={{ background: C.field, borderRadius: 10, padding: "10px 8px", textAlign: "center" }}><div style={{ fontSize: 16, fontWeight: 900 }}>{summary.sessionsCount}</div><div style={{ fontSize: 9, color: C.textMuted, marginTop: 2 }}>SÉANCES</div></div>
              <div style={{ background: C.field, borderRadius: 10, padding: "10px 8px", textAlign: "center" }}><div style={{ fontSize: 16, fontWeight: 900 }}>{summary.totalDurationMin}</div><div style={{ fontSize: 9, color: C.textMuted, marginTop: 2 }}>MIN TOTAL</div></div>
            </div>
          </Card>
        </div>
      )}
      <Card style={{ marginTop: 12 }}>
        <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 10 }}>🧠 RESSENTI DE LA CLIENTE</div>
        <WeeklyCheckinCard weekStart={weekDates[0]} existing={weeklyCheckins.find(c => c.week_start === weekDates[0])} readOnly />
      </Card>
      <Card style={{ marginTop: 12, borderColor: C.cherry + "55" }}>
        <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 10 }}>🔒 MON ANALYSE (privé, jamais visible côté cliente)</div>
        <CoachAnalysisCard
          weekStart={weekDates[0]}
          weekLabel={`${new Date(weekDates[0]).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} – ${new Date(weekDates[6]).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}`}
          clientName={clientName}
          goal={profile?.nutrition_goal}
          summary={summary}
          checkin={weeklyCheckins.find(c => c.week_start === weekDates[0])}
          cyclePhase={cyclePhase?.label}
          existing={weeklyFocus.find(f => f.week_start === weekDates[0])}
          onSave={onSaveFocus}
        />
      </Card>
    </div>
  );
};

const CHECKIN_DIMENSIONS = [
  { key: "energie", label: "Énergie" },
  { key: "faim", label: "Faim" },
  { key: "stress", label: "Stress" },
  { key: "sommeil", label: "Sommeil" },
  { key: "confiance", label: "Confiance" },
];

// readOnly (coach) : affichage seul. Sinon (cliente) : formulaire de saisie/édition.
const WeeklyCheckinCard = ({ weekStart, existing, onSave, readOnly }) => {
  const [editing, setEditing] = useState(!existing);
  const [values, setValues] = useState(() => Object.fromEntries(CHECKIN_DIMENSIONS.map(d => [d.key, existing?.[d.key] ?? null])));
  const [facile, setFacile] = useState(existing?.facile || "");
  const [difficile, setDifficile] = useState(existing?.difficile || "");
  const [besoin, setBesoin] = useState(existing?.besoin || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValues(Object.fromEntries(CHECKIN_DIMENSIONS.map(d => [d.key, existing?.[d.key] ?? null])));
    setFacile(existing?.facile || ""); setDifficile(existing?.difficile || ""); setBesoin(existing?.besoin || "");
    setEditing(!existing);
  }, [weekStart, existing?.id]);

  const handleSave = async () => {
    setSaving(true);
    await onSave(weekStart, { ...values, facile, difficile, besoin });
    setSaving(false); setEditing(false);
  };

  const summary = existing && (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        {CHECKIN_DIMENSIONS.map(d => (
          <div key={d.key} style={{ background: C.field, borderRadius: 10, padding: "8px 10px", textAlign: "center", minWidth: 64 }}>
            <div style={{ fontSize: 16, fontWeight: 900 }}>{existing[d.key] ?? "—"}/5</div>
            <div style={{ fontSize: 9, color: C.textMuted, marginTop: 2 }}>{d.label.toUpperCase()}</div>
          </div>
        ))}
      </div>
      {existing.facile && <div style={{ fontSize: 13, marginBottom: 6 }}><strong>Facile :</strong> {existing.facile}</div>}
      {existing.difficile && <div style={{ fontSize: 13, marginBottom: 6 }}><strong>Difficile :</strong> {existing.difficile}</div>}
      {existing.besoin && <div style={{ fontSize: 13 }}><strong>Besoin :</strong> {existing.besoin}</div>}
    </div>
  );

  if (readOnly) return existing ? summary : <p style={{ color: C.textMuted, fontSize: 12, margin: 0 }}>Pas encore de ressenti renseigné pour cette semaine.</p>;

  if (!editing) return (
    <div>
      {summary}
      <Btn variant="ghost" small onClick={() => setEditing(true)} style={{ marginTop: 10 }}>✏️ Modifier mon ressenti</Btn>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {CHECKIN_DIMENSIONS.map(d => (
        <div key={d.key}>
          <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 6 }}>{d.label.toUpperCase()}</div>
          <div style={{ display: "flex", gap: 6 }}>
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} onClick={() => setValues(v => ({ ...v, [d.key]: n }))} style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: `2px solid ${values[d.key] === n ? C.cherryLight : C.border}`, background: values[d.key] === n ? C.cherry + "22" : C.field, color: values[d.key] === n ? C.cherryLight : C.textMuted, fontWeight: 800, cursor: "pointer" }}>{n}</button>
            ))}
          </div>
        </div>
      ))}
      <TA label="Qu'est-ce qui a été le plus facile cette semaine ?" value={facile} onChange={e => setFacile(e.target.value)} />
      <TA label="Qu'est-ce qui a été le plus difficile ?" value={difficile} onChange={e => setDifficile(e.target.value)} />
      <TA label="De quoi as-tu besoin pour mieux vivre ta prochaine semaine ?" value={besoin} onChange={e => setBesoin(e.target.value)} />
      <div style={{ display: "flex", gap: 10 }}>
        {existing && <Btn variant="secondary" onClick={() => setEditing(false)} style={{ flex: 1 }}>Annuler</Btn>}
        <Btn onClick={handleSave} disabled={saving} style={{ flex: existing ? 2 : 1 }}>{saving ? "..." : "Enregistrer mon ressenti"}</Btn>
      </div>
    </div>
  );
};

const calcWeeklyAchievements = (summary) => {
  const items = [];
  if (summary.sessionsCount > 0) items.push(`Tu as réalisé ${summary.sessionsCount} séance${summary.sessionsCount > 1 ? "s" : ""}.`);
  if (summary.daysCompleted > 0) items.push(`Tu as rempli ton journal ${summary.daysCompleted}/${summary.totalDays} jours.`);
  if (summary.mealDaysCount > 0) items.push(`Tu as suivi ton alimentation ${summary.mealDaysCount}/${summary.totalDays} jours.`);
  return items;
};

const ClientWeeklyBilan = ({ entries, meals, activitySessions, weights, profile, weeklyFocus = [], weeklyCheckins = [], onSaveCheckin, onBack, schedule = [], sessionLogs = [] }) => {
  const [offset, setOffset] = useState(-1); // par défaut : la semaine qui vient de se terminer
  const monday = startOfWeek(new Date());
  monday.setDate(monday.getDate() + offset * 7);
  const weekDates = isoWeekDates(monday);
  const summary = calcWeeklySummary({ entries, meals, activitySessions, weights, profile, weekDates, trainingCtx: { schedule, sessionLogs } });
  const achievements = calcWeeklyAchievements(summary);

  const currentWeekStart = dayKey(startOfWeek(new Date()));
  const focus = weeklyFocus.find(w => w.week_start === currentWeekStart);

  // Moyenne des pesées de la semaine comparée à celle de la semaine précédente
  const weekAvgWeight = avgWeightBetween(weights, weekDates[0], weekDates[6]);
  const prevAvgWeight = avgWeightBetween(weights, addDays(weekDates[0], -7), addDays(weekDates[0], -1));
  const weightTrend = weekAvgWeight != null && prevAvgWeight != null ? weekAvgWeight - prevAvgWeight : null;
  const cyclePhase = calcCyclePhase(profile, weekDates[6]);

  return (
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: F.sans, padding: 20 }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 14, marginBottom: 18, padding: 0 }}>← Retour</button>
      <h2 style={{ fontSize: 22, fontFamily: F.serif, fontWeight: 400, letterSpacing: "-0.5px", color: C.heading, margin: "0 0 4px" }}>Mon bilan de la semaine</h2>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <button onClick={() => setOffset(o => o - 1)} style={{ background: "none", border: "none", color: C.textMuted, fontSize: 18, cursor: "pointer", padding: "0 8px 0 0" }}>‹</button>
        <p style={{ color: C.textMuted, fontSize: 13, margin: 0 }}>Du {new Date(weekDates[0]).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} au {new Date(weekDates[6]).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}</p>
        <button onClick={() => offset < -1 && setOffset(o => o + 1)} style={{ background: "none", border: "none", color: offset >= -1 ? C.border : C.textMuted, fontSize: 18, cursor: offset >= -1 ? "default" : "pointer", padding: "0 0 0 8px" }}>›</button>
      </div>
      <p style={{ color: C.textMuted, fontSize: 12, fontStyle: "italic", marginBottom: 24 }}>Une semaine ne se juge pas sur une journée. On regarde la tendance.</p>

      {!profile ? (
        <Card><p style={{ color: C.textMuted, fontSize: 13, textAlign: "center", margin: 0 }}>Ton profil n'est pas encore complet — parles-en à ta coach pour débloquer ton bilan complet.</p></Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Card style={{ padding: 14 }}>
              <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>🔥 CALORIES/JOUR</div>
              <div style={{ fontSize: 18, fontWeight: 900 }}>{summary.avgCalories != null ? `${summary.avgCalories.toLocaleString()} kcal` : "—"}</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{summary.avgKcalTarget ? `objectif ≈ ${summary.avgKcalTarget.toLocaleString()} kcal` : "en moyenne"}</div>
            </Card>
            <Card style={{ padding: 14 }}>
              <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>🥗 ALIMENTATION</div>
              <div style={{ fontSize: 18, fontWeight: 900 }}>{summary.mealDaysCount}/{summary.totalDays} jours</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>suivis</div>
            </Card>
            <Card style={{ padding: 14 }}>
              <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>🏃‍♀️ PAS/JOUR</div>
              <div style={{ fontSize: 18, fontWeight: 900 }}>{summary.avgSteps?.toLocaleString() ?? "—"}</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>en moyenne</div>
            </Card>
            <Card style={{ padding: 14 }}>
              <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>🏋🏽‍♀️ SÉANCES</div>
              <div style={{ fontSize: 18, fontWeight: 900 }}>{summary.sessionsCount}</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>réalisées</div>
            </Card>
          </div>

          {proteinTarget(profile) && summary.avgProtein != null && (
            <ProteinProgress value={summary.avgProtein} target={proteinTarget(profile)} label="Protéines — moyenne/jour" />
          )}

          {weightTrend != null && (
            <Card>
              <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 8 }}>MON ÉVOLUTION</div>
              <div style={{ fontSize: 20, fontWeight: 900 }}>{weightTrend > 0 ? "+" : ""}{weightTrend.toFixed(1)} kg <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 400 }}>moyenne de la semaine vs semaine précédente</span></div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 8, lineHeight: 1.5 }}>Le poids peut varier naturellement selon ton cycle, ton hydratation, ton alimentation et ton transit — c'est la tendance sur plusieurs semaines qui compte, pas une seule pesée.</div>
            </Card>
          )}

          {cyclePhase && (
            <div style={{ background: C.purple + "10", border: `1px solid ${C.purple}33`, borderRadius: 14, padding: 16, fontSize: 12, color: C.textMuted, lineHeight: 1.5 }}>
              🌙 Cette semaine correspond (approximativement) à ta <strong style={{ color: C.white }}>{cyclePhase.label.toLowerCase()}</strong>. Certaines variations de poids, de faim ou d'énergie peuvent être normales à ce moment du cycle.
            </div>
          )}

          <Card>
            <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 10 }}>🧠 MON RESSENTI</div>
            <WeeklyCheckinCard weekStart={weekDates[0]} existing={weeklyCheckins.find(c => c.week_start === weekDates[0])} onSave={onSaveCheckin} />
          </Card>

          {achievements.length > 0 && (
            <Card style={{ borderColor: C.green + "44" }}>
              <div style={{ fontSize: 10, color: C.green, fontWeight: 700, marginBottom: 10 }}>✨ CETTE SEMAINE</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {achievements.map((a, i) => <div key={i} style={{ fontSize: 13 }}>{a}</div>)}
              </div>
            </Card>
          )}

          <Card style={{ borderColor: C.cherry + "55" }}>
            <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 10 }}>🎯 MON OBJECTIF DE LA SEMAINE</div>
            {focus ? (
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{focus.objectif}</div>
                {focus.engagement && <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 6 }}>→ {focus.engagement}</div>}
                {focus.pourquoi && <div style={{ fontSize: 12, color: C.textMuted, fontStyle: "italic" }}>{focus.pourquoi}</div>}
              </div>
            ) : <p style={{ color: C.textMuted, fontSize: 12, margin: 0 }}>Ta coach n'a pas encore défini d'objectif pour cette semaine.</p>}
          </Card>
        </div>
      )}
    </div>
  );
};

const AppointmentScheduler = ({ appointments, onAdd, onDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState(today);
  const [time, setTime] = useState("18:00");
  const [note, setNote] = useState("");
  const upcoming = appointments.filter(a => a.date >= today).sort((a, b) => a.date.localeCompare(b.date) || (a.time || "").localeCompare(b.time || ""));

  const handleAdd = async () => {
    if (!date) return;
    await onAdd({ date, time, duration_min: 30, note });
    setShowForm(false); setNote("");
  };

  return (
    <Card>
      <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>🗓️ Rendez-vous</div>
      {upcoming.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
          {upcoming.map(a => (
            <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: C.field, borderRadius: 8, padding: "8px 12px" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{formatDate(a.date)}{a.time ? ` · ${a.time.slice(0, 5)}` : ""}</div>
                {a.note && <div style={{ fontSize: 11, color: C.textMuted }}>{a.note}</div>}
              </div>
              <button onClick={() => onDelete(a.id)} style={{ background: C.red + "22", border: "none", borderRadius: 6, width: 24, height: 24, color: C.red, cursor: "pointer" }}>✕</button>
            </div>
          ))}
        </div>
      )}
      {!showForm ? (
        <button onClick={() => setShowForm(true)} style={{ width: "100%", padding: 10, borderRadius: 10, border: `1px dashed ${C.pink}55`, background: C.field, color: C.pink, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>+ Fixer un rendez-vous</button>
      ) : (
        <div style={{ background: C.field, borderRadius: 10, padding: 12 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ ...inputSt, flex: 1, fontSize: 13 }} />
            <input type="time" value={time} onChange={e => setTime(e.target.value)} style={{ ...inputSt, width: 100, fontSize: 13 }} />
          </div>
          <input type="text" placeholder="Note (ex: bilan mensuel, appel...)" value={note} onChange={e => setNote(e.target.value)} style={{ ...inputSt, fontSize: 13, marginBottom: 10 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="secondary" small onClick={() => setShowForm(false)} style={{ flex: 1 }}>Annuler</Btn>
            <Btn small onClick={handleAdd} style={{ flex: 2 }}>Fixer le rendez-vous</Btn>
          </div>
        </div>
      )}
    </Card>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// WEEK STRIP — calendrier semaine (séances programmées + rendez-vous)
// ══════════════════════════════════════════════════════════════════════════════
const startOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay(); // 0=dim..6=sam
  const diff = (day === 0 ? -6 : 1) - day; // ramène au lundi
  d.setDate(d.getDate() + diff);
  return d;
};
const dayKey = d => d.toISOString().slice(0, 10);
const DAY_LABELS = ["L", "M", "M", "J", "V", "S", "D"];

const WeekStrip = ({ schedule = [], workoutsById = {}, appointments = [], onSelectWorkout, loadingWorkoutId }) => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selected, setSelected] = useState(today);
  const monday = startOfWeek(new Date());
  monday.setDate(monday.getDate() + weekOffset * 7);
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(monday); d.setDate(d.getDate() + i); return d; });

  useEffect(() => {
    if (!days.some(d => dayKey(d) === selected)) setSelected(dayKey(days[0]));
  }, [weekOffset]);

  const itemsForDay = (key) => [
    ...schedule.filter(s => s.date === key).map(s => ({ type: "workout", workoutId: s.workout_id, name: workoutsById[s.workout_id]?.name || "Séance" })),
    ...appointments.filter(a => a.date === key).map(a => ({ type: "appt", name: a.note ? `RDV coaching — ${a.note}` : "RDV coaching", time: a.time })),
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <button onClick={() => setWeekOffset(o => o - 1)} style={{ background: "none", border: "none", color: C.textMuted, fontSize: 18, cursor: "pointer", padding: "0 8px" }}>‹</button>
        <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 700 }}>{weekOffset === 0 ? "Cette semaine" : monday.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}</span>
        <button onClick={() => setWeekOffset(o => o + 1)} style={{ background: "none", border: "none", color: C.textMuted, fontSize: 18, cursor: "pointer", padding: "0 8px" }}>›</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginBottom: 14 }}>
        {days.map((d, i) => {
          const key = dayKey(d);
          const items = itemsForDay(key);
          const isToday = key === today;
          const isSelected = key === selected;
          return (
            <button key={key} onClick={() => setSelected(key)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "8px 2px", borderRadius: 12, border: `2px solid ${isSelected ? C.cherryLight : isToday ? C.cherryLight + "55" : C.border}`, background: isSelected ? C.cherry + "22" : C.field, cursor: "pointer" }}>
              <span style={{ fontSize: 10, color: C.textMuted, fontWeight: 700 }}>{DAY_LABELS[i]}</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: isSelected ? C.cherryLight : C.white }}>{d.getDate()}</span>
              <span style={{ display: "flex", gap: 2, height: 5 }}>
                {items.slice(0, 3).map((it, j) => <span key={j} style={{ width: 5, height: 5, borderRadius: "50%", background: it.type === "appt" ? C.blue : C.orange }} />)}
              </span>
            </button>
          );
        })}
      </div>
      <div>
        {itemsForDay(selected).length === 0 ? (
          <div style={{ fontSize: 12, color: C.textMuted, textAlign: "center", padding: "10px 0" }}>Rien de prévu ce jour-là.</div>
        ) : itemsForDay(selected).map((it, i) => {
          const clickable = it.type === "workout" && onSelectWorkout && workoutsById[it.workoutId];
          const isLoading = it.type === "workout" && loadingWorkoutId === it.workoutId;
          const Row = clickable ? "button" : "div";
          return (
            <Row key={i} onClick={clickable ? () => onSelectWorkout(workoutsById[it.workoutId]) : undefined} disabled={isLoading} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left", background: "none", border: "none", padding: "9px 0", borderTop: i > 0 ? `1px solid ${C.border}` : "none", cursor: clickable ? "pointer" : "default", fontFamily: "inherit" }}>
              <span style={{ fontSize: 16 }}>{it.type === "appt" ? "🗓️" : "💪"}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.white }}>{it.name}</div>
                {it.time && <div style={{ fontSize: 11, color: C.textMuted }}>{it.time.slice(0, 5)}</div>}
              </div>
              {clickable && <span style={{ color: C.cherryLight, fontWeight: 700, fontSize: 12 }}>{isLoading ? "..." : "→"}</span>}
            </Row>
          );
        })}
      </div>
    </div>
  );
};

const CycleTracker = ({ profile, onSave }) => {
  const [editing, setEditing] = useState(!profile?.cycle_last_period_start);
  const [lastPeriod, setLastPeriod] = useState(profile?.cycle_last_period_start || "");
  const [cycleLength, setCycleLength] = useState(profile?.cycle_avg_length || 28);
  const [periodLength, setPeriodLength] = useState(profile?.cycle_avg_period_length || 5);
  const [saving, setSaving] = useState(false);

  const currentPhase = calcCyclePhase(profile, today);

  const handleSave = async () => {
    setSaving(true);
    await onSave({ cycle_last_period_start: lastPeriod || null, cycle_avg_length: parseInt(cycleLength) || 28, cycle_avg_period_length: parseInt(periodLength) || 5 });
    setSaving(false); setEditing(false);
  };

  return (
    <Card>
      <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 10 }}>🌙 MON CYCLE</div>
      <p style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.5, marginTop: 0 }}>
        Optionnel — sert uniquement à afficher un repère de contexte dans ton bilan hebdo (ex : "cette semaine correspond à ta phase lutéale — des variations de poids, faim ou énergie peuvent être normales"). Estimation approximative, ce n'est pas un suivi médical.
      </p>
      {currentPhase && !editing && (
        <div style={{ background: C.field, borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>PHASE ACTUELLE (ESTIMÉE)</div>
          <div style={{ fontSize: 16, fontWeight: 900 }}>{currentPhase.label}</div>
        </div>
      )}
      {editing ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Inp label="Date de début des dernières règles" type="date" value={lastPeriod} onChange={e => setLastPeriod(e.target.value)} />
          <Inp label="Durée moyenne du cycle (jours)" type="number" value={cycleLength} onChange={e => setCycleLength(e.target.value)} />
          <Inp label="Durée moyenne des règles (jours)" type="number" value={periodLength} onChange={e => setPeriodLength(e.target.value)} />
          <div style={{ display: "flex", gap: 8 }}>
            {profile?.cycle_last_period_start && <Btn variant="secondary" onClick={() => setEditing(false)} style={{ flex: 1 }}>Annuler</Btn>}
            <Btn onClick={handleSave} disabled={saving || !lastPeriod} style={{ flex: 2 }}>{saving ? "..." : "Enregistrer"}</Btn>
          </div>
        </div>
      ) : (
        <Btn variant="ghost" onClick={() => setEditing(true)}>{profile?.cycle_last_period_start ? "✏️ Modifier" : "+ Renseigner mon cycle"}</Btn>
      )}
    </Card>
  );
};

const PauseModal = ({ client, onClose, onUpdate }) => {
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [pauses, setPauses] = useState([]);
const [resumeDate, setResumeDate] = useState(today);
  useEffect(() => {
    supabase.from("pauses").select("*").eq("client_id", client.id).order("created_at", { ascending: false }).then(({ data }) => setPauses(data || []));
  }, [client.id]);

  const handlePause = async () => {
    if (!startDate || !endDate) return alert("Remplis les deux dates.");
    if (endDate < startDate) return alert("La date de fin doit être après la date de début.");
    setSaving(true);
    const daysCount = Math.ceil((new Date(endDate) - new Date(startDate)) / 86400000) + 1;
    const newNextPayment = addDays(client.next_payment, daysCount);
    await supabase.from("pauses").insert([{ client_id: client.id, start_date: startDate, end_date: endDate, days_count: daysCount, reason }]);
    await supabase.from("clients").update({ is_paused: true, pause_start_date: startDate, pause_end_date: endDate, next_payment: newNextPayment }).eq("id", client.id);
    onUpdate(); setSaving(false); onClose();
  };

const handleResume = async () => {
    setSaving(true);
    const plannedDays = Math.ceil((new Date(client.pause_end_date) - new Date(client.pause_start_date)) / 86400000) + 1;
    const actualDays = Math.ceil((new Date(resumeDate) - new Date(client.pause_start_date)) / 86400000) + 1;
    const correctedNextPayment = addDays(client.next_payment, actualDays - plannedDays);
    const { data, error } = await supabase
      .from("clients")
      .update({ is_paused: false, pause_start_date: null, pause_end_date: null, next_payment: correctedNextPayment })
      .eq("id", client.id)
      .select()
      .single();
    if (!error) {
      await supabase.from("pauses").update({ end_date: resumeDate, days_count: actualDays }).eq("client_id", client.id).eq("start_date", client.pause_start_date);
    }
    setSaving(false);
    if (error) { alert("❌ Impossible de reprendre. Réessaie dans un instant."); return; }
    onUpdate(data);
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: C.overlay, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 28, width: "100%", maxWidth: 440, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>⏸️ Pause — {client.name}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 20 }}>✕</button>
        </div>
       {client.is_paused ? (
          <div>
            <div style={{ background: C.orange + "15", border: `1px solid ${C.orange}44`, borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <div style={{ fontWeight: 700, color: C.orange, marginBottom: 6 }}>⏸️ Cliente en pause</div>
              <div style={{ fontSize: 13, color: C.textMuted }}>Prévue du {formatDate(client.pause_start_date)} au {formatDate(client.pause_end_date)}</div>
            </div>
            <Inp label="Date réelle de reprise" type="date" value={resumeDate} onChange={e => setResumeDate(e.target.value)} style={{ marginBottom: 14 }} />
            {resumeDate && (
              <div style={{ background: C.blue + "15", border: `1px solid ${C.blue}44`, borderRadius: 10, padding: 12, fontSize: 13, marginBottom: 14 }}>
                ⏱️ Prochain paiement recalculé au <strong>{formatDate((() => {
                  const plannedDays = Math.ceil((new Date(client.pause_end_date) - new Date(client.pause_start_date)) / 86400000) + 1;
                  const actualDays = Math.ceil((new Date(resumeDate) - new Date(client.pause_start_date)) / 86400000) + 1;
                  return addDays(client.next_payment, actualDays - plannedDays);
                })())}</strong>
              </div>
            )}
            <Btn onClick={handleResume} disabled={saving} style={{ width: "100%", background: C.green, color: C.black }}>{saving ? "..." : "▶ Confirmer la reprise"}</Btn>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
            <Inp label="Date de début de pause" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <Inp label="Date de fin de pause" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            {startDate && endDate && endDate >= startDate && (
              <div style={{ background: C.blue + "15", border: `1px solid ${C.blue}44`, borderRadius: 10, padding: 12, fontSize: 13 }}>
                ⏱️ <span style={{ color: C.blue, fontWeight: 700 }}>{Math.ceil((new Date(endDate) - new Date(startDate)) / 86400000) + 1} jours</span> — prochain paiement au <strong>{formatDate(addDays(client.next_payment, Math.ceil((new Date(endDate) - new Date(startDate)) / 86400000) + 1))}</strong>
              </div>
            )}
            <Inp label="Raison (optionnel)" placeholder="Vacances, blessure..." value={reason} onChange={e => setReason(e.target.value)} />
            <Btn onClick={handlePause} disabled={saving}>{saving ? "Enregistrement..." : "⏸️ Mettre en pause"}</Btn>
          </div>
        )}
        {pauses.length > 0 && (
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
            <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 10 }}>HISTORIQUE DES PAUSES</div>
            {pauses.map((p, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}`, fontSize: 12 }}>
                <div><div style={{ fontWeight: 700 }}>{formatDate(p.start_date)} → {formatDate(p.end_date)}</div>{p.reason && <div style={{ color: C.textMuted }}>{p.reason}</div>}</div>
                <Badge color={C.orange}>{p.days_count}j</Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
// ══════════════════════════════════════════════════════════════════════════════
// WORKOUT CARD (liste des séances coach + assignation directe)
// ══════════════════════════════════════════════════════════════════════════════
const WorkoutCard = ({ workout: w, clients, allClients, onEdit, onDelete, onArchive, onUnarchive, onDuplicate, assignedIds = [], onToggleAssign }) => {
  const [showAssign, setShowAssign] = useState(false);
  const assignments = assignedIds;
  const toggle = (clientId) => onToggleAssign(w.id, clientId);
  const assignedClients = (allClients || clients).filter(c => assignments.includes(c.id));

  return (
    <Card style={{ marginBottom: 14, opacity: w.is_archived ? 0.7 : 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ fontWeight: 800, fontSize: 16 }}>{w.name}</div>
            {w.is_archived && <Badge color={C.textMuted}>📦 Archivée</Badge>}
          </div>
          {w.description && <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 6 }}>{w.description}</div>}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn small variant="secondary" onClick={onEdit} style={{ width: "auto" }}>✏️</Btn>
          <Btn small variant="secondary" onClick={onDuplicate} style={{ width: "auto" }} title="Dupliquer">⧉</Btn>
          {w.is_archived ? (
            <Btn small variant="secondary" onClick={onUnarchive} style={{ width: "auto" }}>♻️</Btn>
          ) : (
            <Btn small variant="secondary" onClick={onArchive} style={{ width: "auto" }}>📦</Btn>
          )}
          <Btn small variant="danger" onClick={onDelete} style={{ width: "auto" }}>🗑️</Btn>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        <Badge color={C.orange}>{(w.blocks?.length || w.exercises?.length || 0)} exercices</Badge>
        <Badge color={C.purple}>{(w.blocks?.length > 0 ? w.blocks.filter(b => b.type === "exercise").reduce((a, b) => a + (b.sets || 0), 0) : w.exercises?.reduce((a, e) => a + (e.sets || 0), 0)) || 0} séries</Badge>
      </div>
      {/* Clientes assignées */}
      {assignedClients.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
          {assignedClients.map(c => (
            <span key={c.id} style={{ background: (c.is_paused ? C.orange : C.green) + "22", color: c.is_paused ? C.orange : C.green, borderRadius: 99, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>
              {c.is_paused ? "⏸" : "✓"} {c.name.split(" ")[0]}
            </span>
          ))}
        </div>
      )}
      {/* Bouton assignation */}
      <button
        onClick={() => setShowAssign(v => !v)}
        style={{ background: showAssign ? C.pink + "22" : C.field, border: `1px solid ${showAssign ? C.pink : C.border}`, color: showAssign ? C.pink : C.textMuted, borderRadius: 10, padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", width: "100%" }}
      >
        {showAssign ? "✕ Fermer" : `👩 Assigner à des clientes (${assignments.length}/${clients.length})`}
      </button>
      {showAssign && (
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          {clients.length === 0 && <div style={{ fontSize: 13, color: C.textMuted, textAlign: "center", padding: 10 }}>Aucune cliente active</div>}
          {clients.map(c => {
            const assigned = assignments.includes(c.id);
            return (
              <div key={c.id} onClick={() => toggle(c.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: assigned ? C.green + "12" : C.field, border: `1px solid ${assigned ? C.green + "44" : C.border}`, borderRadius: 10, cursor: "pointer" }}>
                <Avatar initials={c.avatar} size={28} color={C.pink} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.white }}>{c.name}</div>
                </div>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: assigned ? C.green : C.track, border: `2px solid ${assigned ? C.green : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: C.black, fontWeight: 900 }}>
                  {assigned ? "✓" : ""}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// COACH APP
// ══════════════════════════════════════════════════════════════════════════════
const CoachApp = ({ user, onLogout }) => {
  const { clients, loading: loadingClients, addClient, updateClient, deleteClient } = useClients();
  const { workouts, loading: loadingWorkouts, saveWorkout, deleteWorkout, setArchived, assignmentsByWorkout, toggleAssignment, fetchWorkoutDetail, reload: reloadWorkouts } = useWorkouts();
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState("");
  const [importBusy, setImportBusy] = useState(false);
  const [importReport, setImportReport] = useState(null);
  const [importError, setImportError] = useState("");
  const runProgramImport = async (dryRun) => {
    setImportBusy(true); setImportError(""); setImportReport(null);
    try {
      const program = JSON.parse(importText);
      const report = await importProgram(makeSupabaseDb(supabase), program, { dryRun });
      setImportReport({ ...report, dryRun });
      if (!dryRun) await reloadWorkouts();
    } catch (e) {
      setImportError(e.message + (e.details ? " — " + e.details.join(" ") : ""));
    } finally { setImportBusy(false); }
  };
  const openWorkoutEditor = async (w) => { setEditingWorkout(await fetchWorkoutDetail(w)); };
  const handleDuplicateWorkout = async (workout) => {
    await saveWorkout({
      name: `${workout.name} (copie)`,
      description: workout.description,
      program_name: workout.program_name,
      blocks: workout.blocks || [],
      exercises: (workout.exercises || []).map(({ id, workout_id, ...rest }) => rest),
    });
  };
      const { payments: allPayments, loadingPayments, addPaymentRecord } = usePayments();
  const [selected, setSelected] = useState(null);
  const [mainTab, setMainTab] = useState("dashboard");
  const [clientTab, setClientTab] = useState("journal");
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [buildingWorkout, setBuildingWorkout] = useState(false);
  const [showArchivedWorkouts, setShowArchivedWorkouts] = useState(false);
  const [workoutLetterFilter, setWorkoutLetterFilter] = useState(null);
  const [workoutNav, setWorkoutNav] = useState({ client: null, program: null });
  const [newWorkoutProgram, setNewWorkoutProgram] = useState("");
  const [showAddClient, setShowAddClient] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [newClientForm, setNewClientForm] = useState({ name: "", email: "", password: "", goal: "", start_date: "", next_payment: "", sessions_per_week: "3", monthly_amount: "" });
  const [addingClient, setAddingClient] = useState(false);
  const [msgText, setMsgText] = useState("");
  const [sessionLogs, setSessionLogs] = useState([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(today);
  const [paymentNote, setPaymentNote] = useState("");
  const [addingPayment, setAddingPayment] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);
  const [clientSearch, setClientSearch] = useState("");
  // Journaux des 7 derniers jours de toutes les clientes : alimente « À ton attention »
  const [recentEntries, setRecentEntries] = useState([]);
  const isWide = useIsWide();

  // ── ADMIN ────────────────────────────────────────────────────────────────
  const [adminUsers, setAdminUsers] = useState([]);
  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [resetTargetId, setResetTargetId] = useState(null);
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resettingId, setResettingId] = useState(null);

  const [todayEntries, setTodayEntries] = useState([]);
  const doneTodayRef = useRef(new Set());
  const [notifGranted, setNotifGranted] = useState(typeof Notification !== "undefined" && Notification.permission === "granted");

  const client = clients.find(c => c.id === selected);
  const { entries, weights, measurements, assignedWorkouts, progressPhotos, payments, profile, activitySessions, meals, schedule, appointments, weeklyFocus, weeklyCheckins, loading: loadingData, addEntry, updateEntry, toggleWorkout, updateScheduledDate, addPayment, updateProfile, scheduleWorkout, unscheduleWorkout, unscheduleSeriesFrom, addAppointment, deleteAppointment, upsertWeeklyFocus } = useClientData(selected, { isCoach: true });
  // Vérifie si une cliente a rempli son journal AUJOURD'HUI (recharge chaque fois que todayEntries change)
  const isDoneToday = (clientId) => todayEntries.some(e => e.client_id === clientId && isJournalFilled(e));
  // Exclure les clientes en pause et les contrats terminés des alertes paiement/journal
  const paymentAlerts = clients.filter(c => { const d = daysUntil(c.next_payment); return d >= 0 && d <= 5 && !c.is_paused && !c.contract_ended; });
  const pendingJournalClients = clients.filter(c => !c.is_paused && !c.contract_ended && !isDoneToday(c.id));
  const urgentPayments = clients.filter(c => !c.is_paused && !c.contract_ended && daysUntil(c.next_payment) <= 7);
  const sortByName = (a, b) => a.name.localeCompare(b.name, "fr", { sensitivity: "base" });
  const activeWorkoutsList = workouts.filter(w => !w.is_archived).sort(sortByName);
  const archivedWorkoutsList = workouts.filter(w => w.is_archived).sort(sortByName);
  // Répertoire A-Z : les séances sont rangées par cliente assignée (et non par leur nom, les
  // anciennes séances ne commençant pas toutes par le prénom). Le filtre porte sur l'initiale de la cliente.
  const GROUP_SHARED = "Plusieurs clientes";
  const GROUP_NONE = "Non assignées";
  const clientNameById = Object.fromEntries(clients.map(c => [c.id, c.name]));
  const firstLetterOf = (name) => (name || "").trim().normalize("NFD").replace(/[̀-ͯ]/g, "").charAt(0).toUpperCase();
  // Séance non assignée (ex. semaines suivantes pas encore débloquées) : on la range quand même
  // sous la cliente dont le prénom ouvre son nom ("Pembe · S2 · ...").
  const normName = (s) => (s || "").trim().normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const clientFromWorkoutName = (name) => {
    const prefix = normName((name || "").split(" · ")[0]);
    if (!prefix) return null;
    const c = clients.find(c => { const n = normName(c.name); return n === prefix || n.startsWith(prefix + " "); });
    return c ? c.name : null;
  };
  const pausedClientIds = new Set(clients.filter(c => c.is_paused).map(c => c.id));
  const groupKeyOf = (w) => {
    const ids = assignmentsByWorkout[w.id] || [];
    // Une cliente en pause ne compte pas : la séance reste sous la cliente active qui la partage.
    const activeNames = [...new Set(ids.filter(id => !pausedClientIds.has(id)).map(id => clientNameById[id]).filter(Boolean))];
    if (activeNames.length === 1) return activeNames[0];
    if (activeNames.length > 1) return GROUP_SHARED;
    const pausedNames = [...new Set(ids.map(id => clientNameById[id]).filter(Boolean))];
    if (pausedNames.length === 1) return pausedNames[0];
    if (pausedNames.length > 1) return GROUP_SHARED;
    return clientFromWorkoutName(w.name) || GROUP_NONE;
  };
  const isClientGroup = (key) => key !== GROUP_SHARED && key !== GROUP_NONE;
  // Navigation de l'onglet Séances : lettre → cliente → programme → séances regroupées par semaine.
  const PROGRAM_NONE = "Séances hors programme";
  const WEEK_NONE = "Autres séances";
  const naturalCmp = (a, b) => a.localeCompare(b, "fr", { numeric: true, sensitivity: "base" });
  const programKeyOf = (w) => (w.program_name || "").trim() || PROGRAM_NONE;
  const weekOf = (w) => { const m = (w.name || "").match(/(?:^|[\s·])S(\d+)(?=\s|·|$)/); return m ? Number(m[1]) : null; };
  const allWorkoutsSorted = [...workouts].sort((a, b) => naturalCmp(a.name || "", b.name || ""));
  const groupBy = (list, keyFn) => {
    const byKey = new Map();
    for (const w of list) { const k = keyFn(w); if (!byKey.has(k)) byKey.set(k, []); byKey.get(k).push(w); }
    return byKey;
  };
  const clientGroups = [...groupBy(allWorkoutsSorted, groupKeyOf).entries()].sort(([a], [b]) => {
    const rank = (key) => (isClientGroup(key) ? 0 : key === GROUP_SHARED ? 1 : 2);
    return rank(a) - rank(b) || naturalCmp(a, b);
  });
  // Les clientes en pause sont masquées ; elles réapparaissent dès la fin de leur pause.
  const pausedClientNames = new Set(clients.filter(c => c.is_paused).map(c => c.name));
  const listedClientGroups = clientGroups.filter(([key]) => !pausedClientNames.has(key));
  const workoutLetters = new Set(listedClientGroups.map(([key]) => (isClientGroup(key) ? firstLetterOf(key) : null)).filter(Boolean));
  const visibleClientGroups = workoutLetterFilter ? listedClientGroups.filter(([key]) => isClientGroup(key) && firstLetterOf(key) === workoutLetterFilter) : listedClientGroups;
  // Programmes d'une cliente, dans l'ordre où ils ont été créés (programme 1, programme 2…), "hors programme" en dernier.
  const programsOf = (items) => [...groupBy(items, programKeyOf).entries()].sort(([a, wa], [b, wb]) => {
    if (a === PROGRAM_NONE || b === PROGRAM_NONE) return a === PROGRAM_NONE ? 1 : -1;
    const first = (ws) => ws.reduce((m, w) => (w.created_at < m ? w.created_at : m), ws[0].created_at || "");
    return first(wa).localeCompare(first(wb));
  });
  const weeksOf = (items) => [...groupBy(items, w => weekOf(w) ?? WEEK_NONE).entries()].sort(([a], [b]) => {
    if (a === WEEK_NONE || b === WEEK_NONE) return a === WEEK_NONE ? 1 : -1;
    return a - b;
  });
  const navClientItems = workoutNav.client ? (clientGroups.find(([key]) => key === workoutNav.client) || [null, []])[1] : [];
  const navProgramItems = workoutNav.program ? navClientItems.filter(w => programKeyOf(w) === workoutNav.program) : [];
  const navClient = workoutNav.client && isClientGroup(workoutNav.client) ? clients.find(c => c.name === workoutNav.client) : null;
  const isAssignedTo = (w, clientId) => (assignmentsByWorkout[w.id] || []).includes(clientId);
  // Assigne (ou retire) toute une semaine d'un coup à la cliente ouverte.
  const setWeekAssigned = async (items, assign) => {
    if (!navClient) return;
    for (const w of items) if (isAssignedTo(w, navClient.id) !== assign) await toggleAssignment(w.id, navClient.id);
  };
  const programNames = [...new Set(workouts.map(w => (w.program_name || "").trim()).filter(Boolean))].sort(naturalCmp);
  const workoutsById = Object.fromEntries(workouts.map(w => [w.id, w]));

  // Chargement des entrées du jour + abonnement temps réel
  useEffect(() => {
    supabase.from("entries").select("client_id, date, journal_filled").eq("date", today).then(({ data }) => {
      const rows = data || [];
      doneTodayRef.current = new Set(rows.filter(isJournalFilled).map(e => e.client_id));
      setTodayEntries(rows);
    });
    supabase.from("entries").select("client_id, date, feeling, had_difficulty, difficulty_note, journal_filled").gte("date", addDays(today, -6)).order("date", { ascending: false })
      .then(({ data }) => setRecentEntries(data || []));
    // Une ligne du jour peut être créée par un repas (non remplie) puis complétée par le
    // journal (update) : on écoute les deux, et on ne notifie qu'au passage à « rempli ».
    const onEntryChange = (payload) => {
      const row = payload.new;
      if (!row || row.date !== today) return;
      setTodayEntries(prev => [...prev.filter(e => e.client_id !== row.client_id), row]);
      if (!isJournalFilled(row) || doneTodayRef.current.has(row.client_id)) return;
      doneTodayRef.current.add(row.client_id);
      // Notification navigateur coach
      const newClient = clients.find(c => c.id === row.client_id);
      if (newClient) {
        if (typeof Notification !== "undefined" && Notification.permission === "granted") {
          new Notification(BRAND_NAME + " 📋", { body: `${newClient.name} vient de remplir son journal !`, icon: "/logo.png" });
        }
      }
    };
    const channel = supabase.channel("coach_entries_today")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "entries" }, onEntryChange)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "entries" }, onEntryChange)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [clients]);

  const requestCoachNotifs = async () => {
    if (!("Notification" in window)) return alert("Notifications non supportées sur ce navigateur.");
    const perm = await Notification.requestPermission();
    if (perm === "granted") { setNotifGranted(true); new Notification(BRAND_NAME + " ✅", { body: "Tu seras notifiée dès qu'une cliente remplit son journal !", icon: "/logo.png" }); }
  };

  useEffect(() => {
    if (selected) {
      supabase.from("session_logs").select("*").eq("client_id", selected).order("date", { ascending: false }).then(({ data }) => setSessionLogs(data || []));
    }
  }, [selected]);

  // ── ADMIN : chargement des comptes Supabase Auth via l'Edge Function sécurisée ──
  useEffect(() => {
    if (mainTab === "admin") {
      setLoadingAdmin(true);
      setAdminError("");
      callAdminFunction({ action: "list_users" }).then(res => {
        if (res.error) { setAdminError(res.error); setAdminUsers([]); }
        else { setAdminUsers(res.users || []); }
        setLoadingAdmin(false);
      });
    }
  }, [mainTab]);

  const handleResetPassword = async (c, authUser) => {
    if (!authUser) { setResetMessage("❌ Compte introuvable pour cette cliente."); return; }
    if (!newPasswordInput || newPasswordInput.length < 6) { setResetMessage("❌ Le mot de passe doit faire au moins 6 caractères."); return; }
    setResettingId(c.id);
    setResetMessage("");
    const res = await callAdminFunction({ action: "reset_password", targetUserId: authUser.id, newPassword: newPasswordInput });
    if (res.error) setResetMessage("❌ " + res.error);
    else setResetMessage(`✅ Nouveau mot de passe défini : ${newPasswordInput}`);
    setResettingId(null);
  };

  const handleAddClient = async () => {
    if (!newClientForm.name || !newClientForm.email || !newClientForm.password) return alert("Remplis au minimum le nom, l'email et le mot de passe.");
    setAddingClient(true);
    // IMPORTANT : on ne fait JAMAIS supabase.auth.signUp() ici — ça remplacerait la session
    // de la coach par celle du nouveau compte créé. La création du compte Auth doit se faire
    // côté serveur (service role), via l'Edge Function admin, pour ne pas toucher à la session en cours.
    const res = await callAdminFunction({ action: "create_client_user", email: newClientForm.email, password: newClientForm.password });
    if (res.error) { alert("Erreur : " + res.error); setAddingClient(false); return; }
    const userId = res.user?.id;
    const avatar = newClientForm.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    const created = await addClient({ name: newClientForm.name, avatar, goal: newClientForm.goal, start_date: newClientForm.start_date, next_payment: newClientForm.next_payment, sessions_per_week: parseInt(newClientForm.sessions_per_week) || 3, monthly_amount: parseFloat(newClientForm.monthly_amount) || 0, streak: 0, today_done: false, user_id: userId, contract_accepted: false });
    setAddingClient(false);
    if (!created) return;
    setShowAddClient(false);
    setNewClientForm({ name: "", email: "", password: "", goal: "", start_date: "", next_payment: "", sessions_per_week: "3", monthly_amount: "" });
    alert(`✅ Compte créé !\n\nEmail : ${newClientForm.email}\nMot de passe : ${newClientForm.password}`);
  };

  const handleSaveClient = async (id, patch) => { await updateClient(id, patch); alert("✅ Profil mis à jour !"); };
  const handleDeleteClient = async (id) => { await deleteClient(id); setSelected(null); setMainTab("clients"); alert("✅ Cliente supprimée."); };
  const handleToggleContractEnded = async (c) => {
    if (c.contract_ended) {
      await updateClient(c.id, { contract_ended: false, contract_ended_at: null });
      return;
    }
    if (!window.confirm(`Marquer le contrat de ${c.name} comme terminé ? Elle gardera accès à l'appli et aux séances que tu lui mets à disposition, mais ne sera plus suivie dans le journal/paiements.`)) return;
    await updateClient(c.id, { contract_ended: true, contract_ended_at: today });
  };

  const handleAddPayment = async () => {
    if (!paymentAmount || !paymentDate) return alert("Remplis le montant et la date.");
    setAddingPayment(true);
    await addPayment(parseFloat(paymentAmount), paymentDate, paymentNote);
    setAddingPayment(false); setShowPaymentForm(false);
    setPaymentAmount(""); setPaymentDate(today); setPaymentNote("");
    alert(`✅ Paiement de ${paymentAmount}€ enregistré !`);
  };

  const handleSendMessage = async () => {
    if (!msgText.trim() || !selected) return;
    const todayEntry = entries.find(e => e.date === today);
    if (todayEntry) { await updateEntry(todayEntry.id, { coach_message: msgText }); }
    else { await addEntry({ date: today, steps: 0, feeling: 3, meal_note: "", session_status: "rest", coach_message: msgText, photos: [] }); }
    setMsgText(""); setShowMessage(false); alert("✅ Message envoyé !");
  };

  if (selectedEntry) return <EntryDetail entry={selectedEntry} onBack={() => setSelectedEntry(null)} profile={profile} weights={weights} activitySessions={activitySessions} meals={meals} showBalance />;

  if (buildingWorkout || editingWorkout) return (
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: F.sans, padding: 20 }}>
      <WorkoutBuilder workout={editingWorkout} defaultProgram={newWorkoutProgram} programNames={programNames} onSave={async w => { await saveWorkout(w); setEditingWorkout(null); setBuildingWorkout(false); setNewWorkoutProgram(""); }} onCancel={() => { setEditingWorkout(null); setBuildingWorkout(false); setNewWorkoutProgram(""); }} />
    </div>
  );

  const NAV_ITEMS = [["dashboard", "home", "Aujourd'hui"], ["clients", "users", "Clientes"], ["workouts", "dumbbell", "Séances"], ["comptabilite", "wallet", "Paiements"], ["admin", "key", "Accès"]];
  const activeClientCount = clients.filter(c => !c.is_paused && !c.contract_ended).length;
  const goTab = (k) => { setMainTab(k); window.scrollTo(0, 0); };
  const openClient = (id, tab = "journal") => { setSelected(id); setClientTab(tab); setMainTab("clients"); window.scrollTo(0, 0); };
  const todayLabel = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: F.sans, display: "flex" }}>
      {isWide ? (
        <aside style={{ width: 236, flexShrink: 0, borderRight: `1px solid ${C.border}`, background: C.surface, padding: "30px 16px 20px", display: "flex", flexDirection: "column", gap: 4, position: "sticky", top: 0, height: "100vh" }}>
          <div style={{ padding: "0 10px 30px" }}><Logo size={46} /></div>
          <Eyebrow style={{ padding: "0 12px 10px", fontSize: 10 }}>Mon espace coach</Eyebrow>
          {NAV_ITEMS.map(([k, icon, label]) => (
            <button key={k} onClick={() => goTab(k)} style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 46, padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 15, textAlign: "left", background: mainTab === k ? C.pink + "1c" : "transparent", color: mainTab === k ? C.cherry : C.textMuted, fontWeight: mainTab === k ? 650 : 500 }}>
              <Icon name={icon} />
              <span style={{ flex: 1 }}>{label}</span>
              {k === "clients" && <span style={{ fontSize: 12, color: C.textMuted, background: C.card, borderRadius: 6, padding: "1px 7px" }}>{activeClientCount}</span>}
            </button>
          ))}
          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
            {!notifGranted && (
              <button onClick={requestCoachNotifs} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.card, color: C.cherry, cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600 }}><Icon name="bell" size={18} /> Activer les notifications</button>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 10, borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
              <Avatar initials="NM" size={36} color={C.pink} />
              <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 650, fontSize: 14 }}>Nina Mallard</div><div style={{ fontSize: 12, color: C.textMuted }}>Coach</div></div>
              <button onClick={onLogout} title="Déconnexion" aria-label="Déconnexion" style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", padding: 6 }}><Icon name="logout" size={19} /></button>
            </div>
          </div>
        </aside>
      ) : (
        <nav style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 50, background: C.card, borderTop: `1px solid ${C.border}`, display: "grid", gridTemplateColumns: `repeat(${NAV_ITEMS.length}, 1fr)`, padding: "8px 4px calc(10px + env(safe-area-inset-bottom, 0px))" }}>
          {NAV_ITEMS.map(([k, icon, label]) => (
            <button key={k} onClick={() => goTab(k)} style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: mainTab === k ? C.cherry : C.textMuted, fontWeight: mainTab === k ? 650 : 500, fontSize: 11, cursor: "pointer", fontFamily: "inherit", padding: "4px 0" }}>
              <Icon name={icon} size={22} />{label}
            </button>
          ))}
        </nav>
      )}

      <main style={{ flex: 1, minWidth: 0, padding: isWide ? "0 40px 48px" : "0 16px 110px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ minHeight: isWide ? 64 : 58, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, borderBottom: `1px solid ${C.border}`, marginBottom: isWide ? 30 : 20 }}>
            {isWide ? <Eyebrow>Her Process · {NAV_ITEMS.find(([k]) => k === mainTab)?.[2] || "Clientes"}</Eyebrow> : <Logo size={30} />}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {isWide ? <span style={{ fontSize: 13, color: C.textMuted, textTransform: "capitalize" }}>{todayLabel}</span> : (<>
                {!notifGranted && <button onClick={requestCoachNotifs} aria-label="Activer les notifications" style={{ background: "none", border: "none", color: C.cherry, padding: 8, cursor: "pointer" }}><Icon name="bell" /></button>}
                <button onClick={onLogout} aria-label="Déconnexion" style={{ background: "none", border: "none", color: C.textMuted, padding: 8, cursor: "pointer" }}><Icon name="logout" /></button>
              </>)}
            </div>
          </div>
          {mainTab === "dashboard" && (() => {
            const activeClients = clients.filter(c => !c.is_paused && !c.contract_ended);
            const doneCount = activeClients.filter(c => isDoneToday(c.id)).length;
            // À ton attention : ce qui mérite un regard, à partir des journaux des 7 derniers jours
            const attention = [];
            activeClients.forEach(c => {
              const rows = recentEntries.filter(e => e.client_id === c.id);
              const diff = rows.find(e => e.had_difficulty && isJournalFilled(e));
              if (diff) attention.push({ c, tone: C.orange, title: "Une difficulté signalée", detail: `${formatDate(diff.date)}${diff.difficulty_note ? " · " + diff.difficulty_note : ""}`, tab: "journal" });
              const low = rows.find(e => isJournalFilled(e) && e.feeling && e.feeling <= 2);
              if (low) attention.push({ c, tone: C.pink, title: "Un ressenti bas", detail: `${formatDate(low.date)} · ${feelingLabels[low.feeling - 1]}`, tab: "journal" });
              const lastFilled = rows.find(isJournalFilled);
              const since = lastFilled ? Math.round((new Date(today) - new Date(lastFilled.date)) / 86400000) : null;
              if (!lastFilled) attention.push({ c, tone: C.textMuted, title: "Aucun journal depuis 7 jours", detail: "Prendre de ses nouvelles ?", tab: "journal" });
              else if (since >= 2) attention.push({ c, tone: C.textMuted, title: `Pas de journal depuis ${since} jours`, detail: `Dernier journal le ${formatDate(lastFilled.date)}`, tab: "journal" });
              const d = c.next_payment ? daysUntil(c.next_payment) : null;
              if (d != null && d < 0) attention.push({ c, tone: C.red, title: "Paiement en retard", detail: `Échéance du ${formatDate(c.next_payment)} · ${c.monthly_amount} €`, tab: "paiements" });
              else if (d != null && d <= 3) attention.push({ c, tone: C.yellow, title: d === 0 ? "Paiement aujourd'hui" : `Paiement dans ${d} jour${d > 1 ? "s" : ""}`, detail: `${c.monthly_amount} € · ${formatDate(c.next_payment)}`, tab: "paiements" });
            });
            const stat = (label, value, sub, onClick) => (
              <Card onClick={onClick} style={{ display: "flex", flexDirection: "column", gap: 6, padding: "18px 20px" }}>
                <span style={{ fontSize: 14, color: C.textMuted }}>{label}</span>
                <span style={{ fontFamily: F.serif, fontSize: 36, color: C.heading, lineHeight: 1.1, fontVariantNumeric: "tabular-nums" }}>{value}</span>
                <span style={{ fontSize: 12.5, color: C.textMuted }}>{sub}</span>
              </Card>
            );
            return (
              <div>
                <Eyebrow>{isWide ? "Chaque jour compte" : todayLabel}</Eyebrow>
                <h1 style={{ fontFamily: F.serif, fontWeight: 400, fontSize: isWide ? 44 : 34, letterSpacing: "-1px", color: C.heading, margin: "8px 0 6px" }}>Bonjour Nina.</h1>
                <p style={{ color: C.textMuted, fontSize: 15, margin: "0 0 24px" }}>Ce qui demande ton attention aujourd'hui.</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 22 }}>
                  {stat("Journaux remplis aujourd'hui", `${doneCount}/${activeClients.length}`, "Les autres ont encore la journée")}
                  {stat("À ton attention", attention.length, "Sur les 7 derniers jours")}
                  {stat("Paiements à suivre", urgentPayments.length, "En retard ou dans les 7 jours", () => goTab("comptabilite"))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: isWide ? "minmax(0, 1.6fr) minmax(280px, 1fr)" : "1fr", gap: 18, alignItems: "start" }}>
                  <Card style={{ padding: "20px 22px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <h2 style={{ fontSize: 19, fontWeight: 650, margin: 0, color: C.heading }}>À ton attention</h2>
                      {attention.length > 0 && <Badge color={C.textMuted}>{attention.length} à regarder</Badge>}
                    </div>
                    {attention.length === 0 && <p style={{ color: C.textMuted, fontSize: 14, margin: "12px 0 4px" }}>Rien de particulier cette semaine. Tout le monde avance.</p>}
                    {attention.map((a, i) => (
                      <button key={i} onClick={() => openClient(a.c.id, a.tab)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "15px 0", background: "none", border: "none", borderTop: i ? `1px solid ${C.border}` : "none", textAlign: "left", cursor: "pointer", fontFamily: "inherit", color: C.white }}>
                        <Avatar initials={a.c.avatar} size={40} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 650, fontSize: 15 }}>{a.c.name}</div>
                          <div style={{ fontSize: 14, color: a.tone }}>{a.title}</div>
                          <div style={{ fontSize: 13, color: C.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.detail}</div>
                        </div>
                        <Icon name="chevron" color={C.muted} />
                      </button>
                    ))}
                  </Card>
                  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    <Card style={{ padding: "20px 22px" }}>
                      <h2 style={{ fontSize: 17, fontWeight: 650, margin: "0 0 8px", color: C.heading }}>Journal du jour</h2>
                      {activeClients.length === 0 && <p style={{ color: C.textMuted, fontSize: 14 }}>Aucune cliente active.</p>}
                      {activeClients.map((c, i) => (
                        <button key={c.id} onClick={() => openClient(c.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 0", background: "none", border: "none", borderTop: i ? `1px solid ${C.border}` : "none", cursor: "pointer", fontFamily: "inherit", color: C.white, textAlign: "left" }}>
                          <Avatar initials={c.avatar} size={32} color={isDoneToday(c.id) ? C.green : C.muted} />
                          <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{c.name}</span>
                          {isDoneToday(c.id) ? <Badge color={C.green}>Rempli</Badge> : <Badge color={C.textMuted}>Pas encore</Badge>}
                        </button>
                      ))}
                    </Card>
                    <Card style={{ padding: "20px 22px", background: C.green + "12", borderColor: C.green + "30" }}>
                      <Eyebrow style={{ marginBottom: 10 }}>Raccourcis</Eyebrow>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <Btn variant="secondary" onClick={() => setShowAddClient(true)}>+ Nouvelle cliente</Btn>
                        <Btn variant="secondary" onClick={() => { goTab("workouts"); setBuildingWorkout(true); }}>+ Créer une séance</Btn>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            );
          })()}

          {mainTab === "workouts" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <h1 style={{ fontFamily: F.serif, fontWeight: 400, fontSize: isWide ? 38 : 30, letterSpacing: "-0.8px", color: C.heading, margin: "0 0 6px" }}>Mes séances</h1>
                  <p style={{ color: C.textMuted, fontSize: 15, margin: "0 0 14px" }}>Tes programmes rangés par cliente, puis par semaine.</p>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <Btn small onClick={() => setBuildingWorkout(true)} style={{ width: "auto" }}>+ Créer une séance</Btn>
                    <Btn small variant="secondary" onClick={() => setShowCatalog(true)} style={{ width: "auto" }}>Bibliothèque d'exercices</Btn>
                  </div>
                </div>
              </div>

              <Card style={{ marginBottom: 20, borderColor: C.purple + "44" }}>
                <button
                  onClick={() => setShowImport(v => !v)}
                  style={{ background: "none", border: "none", color: C.purple, fontWeight: 800, fontSize: 14, cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 8 }}
                >
                  {showImport ? "▲" : "▼"} 📥 Importer un programme (JSON)
                </button>
                {showImport && (
                  <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.5 }}>
                      Colle un JSON de programme (format <code>docs/program-spec.md</code>). Crée les séances avec tout saisi (séries, reps, repos, tempo, RPE, technique, consigne), ajoute les exercices manquants à la médiathèque, et assigne à la cliente indiquée. Les photos restent à charger à la main. « Prévisualiser » n'écrit rien.
                    </div>
                    <textarea
                      value={importText}
                      onChange={e => setImportText(e.target.value)}
                      placeholder='{ "program_name": "...", "client": "Lidia", "workouts": [ ... ] }'
                      spellCheck={false}
                      style={{ ...inputSt, minHeight: 140, fontFamily: "monospace", fontSize: 12, resize: "vertical" }}
                    />
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <Btn small variant="secondary" disabled={importBusy || !importText.trim()} onClick={() => runProgramImport(true)} style={{ width: "auto" }}>
                        {importBusy ? "…" : "👁 Prévisualiser"}
                      </Btn>
                      <Btn small disabled={importBusy || !importText.trim()} onClick={() => runProgramImport(false)} style={{ width: "auto" }}>
                        {importBusy ? "Import en cours…" : "📥 Importer"}
                      </Btn>
                    </div>
                    {importError && (
                      <div style={{ background: C.red + "15", border: `1px solid ${C.red}44`, borderRadius: 10, padding: 12, fontSize: 13, color: C.red, whiteSpace: "pre-wrap" }}>{importError}</div>
                    )}
                    {importReport && (
                      <div style={{ background: (importReport.dryRun ? C.blue : C.green) + "12", border: `1px solid ${(importReport.dryRun ? C.blue : C.green)}44`, borderRadius: 10, padding: 12, fontSize: 13, lineHeight: 1.6 }}>
                        <div style={{ fontWeight: 800, marginBottom: 4 }}>{importReport.dryRun ? "Prévisualisation (rien écrit)" : "✅ Import terminé"}</div>
                        <div>Programme : {importReport.program}</div>
                        {importReport.client && <div>Cliente : {importReport.client}</div>}
                        <div>Séances : {importReport.workoutsCreated.length} · assignations : {importReport.assignments}</div>
                        <div>Médiathèque : +{importReport.catalogueCreated.length} ({importReport.catalogueSkipped.length} déjà présentes)</div>
                        {importReport.nameCollisions.length > 0 && (
                          <div style={{ color: C.orange, marginTop: 4 }}>⚠ Noms déjà utilisés : {importReport.nameCollisions.join(", ")}</div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </Card>
              {loadingWorkouts ? <Spinner /> : (
                <>
                  {workouts.length === 0 && <Card><p style={{ color: C.textMuted, textAlign: "center", margin: 0 }}>Aucune séance. Clique sur "+ Nouvelle séance" pour commencer.</p></Card>}

                  {/* Fil d'Ariane */}
                  {workoutNav.client && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", fontSize: 13, marginBottom: 16 }}>
                      <button onClick={() => setWorkoutNav({ client: null, program: null })} style={crumbSt}>← Toutes les clientes</button>
                      <span style={{ color: C.textMuted }}>/</span>
                      {workoutNav.program ? (
                        <>
                          <button onClick={() => setWorkoutNav({ client: workoutNav.client, program: null })} style={crumbSt}>{workoutNav.client}</button>
                          <span style={{ color: C.textMuted }}>/</span>
                          <span style={{ fontWeight: 800 }}>{workoutNav.program}</span>
                        </>
                      ) : <span style={{ fontWeight: 800 }}>{workoutNav.client}</span>}
                    </div>
                  )}

                  {/* Niveau 1 : clientes */}
                  {!workoutNav.client && workouts.length > 0 && (
                    <>
                      <AlphaIndex letters={workoutLetters} active={workoutLetterFilter} onChange={setWorkoutLetterFilter} />
                      {visibleClientGroups.length === 0 && (
                        <Card><p style={{ color: C.textMuted, textAlign: "center", margin: 0 }}>Aucune cliente ne commence par « {workoutLetterFilter} ».</p></Card>
                      )}
                      {visibleClientGroups.map(([key, items]) => {
                        const nbPrograms = programsOf(items).filter(([p]) => p !== PROGRAM_NONE).length;
                        return (
                          <FolderRow key={key} onClick={() => setWorkoutNav({ client: key, program: null })}
                            title={key} muted={!isClientGroup(key)}
                            subtitle={`${nbPrograms} programme${nbPrograms > 1 ? "s" : ""} · ${items.length} séance${items.length > 1 ? "s" : ""}`} />
                        );
                      })}
                    </>
                  )}

                  {/* Niveau 2 : programmes de la cliente */}
                  {workoutNav.client && !workoutNav.program && (
                    navClientItems.length === 0
                      ? <Card><p style={{ color: C.textMuted, textAlign: "center", margin: 0 }}>Plus aucune séance ici.</p></Card>
                      : programsOf(navClientItems).map(([prog, items], i) => {
                          const nbAssigned = navClient ? items.filter(w => isAssignedTo(w, navClient.id)).length : 0;
                          const nbWeeks = weeksOf(items).filter(([wk]) => wk !== WEEK_NONE).length;
                          return (
                            <FolderRow key={prog} onClick={() => setWorkoutNav({ client: workoutNav.client, program: prog })}
                              title={prog === PROGRAM_NONE ? prog : `Programme ${i + 1} — ${prog}`} muted={prog === PROGRAM_NONE}
                              subtitle={[nbWeeks > 0 && `${nbWeeks} semaine${nbWeeks > 1 ? "s" : ""}`, `${items.length} séance${items.length > 1 ? "s" : ""}`, navClient && `${nbAssigned} assignée${nbAssigned > 1 ? "s" : ""}`].filter(Boolean).join(" · ")} />
                          );
                        })
                  )}

                  {/* Niveau 3 : séances du programme, par semaine */}
                  {workoutNav.client && workoutNav.program && (
                    <>
                      {workoutNav.program !== PROGRAM_NONE && (
                        <Btn small variant="secondary" onClick={() => { setNewWorkoutProgram(workoutNav.program); setBuildingWorkout(true); }} style={{ width: "auto", marginBottom: 16 }}>+ Séance dans ce programme</Btn>
                      )}
                      {navProgramItems.length === 0 && <Card><p style={{ color: C.textMuted, textAlign: "center", margin: 0 }}>Plus aucune séance dans ce programme.</p></Card>}
                      {weeksOf(navProgramItems).map(([wk, items]) => {
                        const active = items.filter(w => !w.is_archived);
                        const archived = items.filter(w => w.is_archived);
                        const allAssigned = navClient && active.length > 0 && active.every(w => isAssignedTo(w, navClient.id));
                        return (
                          <div key={wk} style={{ marginBottom: 22 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, margin: "4px 2px 10px" }}>
                              <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 0.4, textTransform: "uppercase", color: C.textMuted }}>
                                {wk === WEEK_NONE ? wk : `Semaine ${wk}`}
                              </div>
                              {navClient && active.length > 0 && (
                                <Btn small variant={allAssigned ? "secondary" : undefined} onClick={() => setWeekAssigned(active, !allAssigned)} style={{ width: "auto" }}>
                                  {allAssigned ? `Retirer la semaine` : `Assigner à ${navClient.name}`}
                                </Btn>
                              )}
                            </div>
                            {[...active, ...(showArchivedWorkouts ? archived : [])].map(w => (
                              <WorkoutCard
                                key={w.id}
                                workout={w}
                                clients={clients.filter(c => !c.is_paused)}
                                allClients={clients}
                                assignedIds={assignmentsByWorkout[w.id] || []}
                                onToggleAssign={toggleAssignment}
                                onEdit={() => openWorkoutEditor(w)}
                                onDelete={() => deleteWorkout(w.id)}
                                onArchive={() => setArchived(w.id, true)}
                                onUnarchive={() => setArchived(w.id, false)}
                                onDuplicate={() => handleDuplicateWorkout(w)}
                              />
                            ))}
                          </div>
                        );
                      })}
                      {navProgramItems.some(w => w.is_archived) && (
                        <button
                          onClick={() => setShowArchivedWorkouts(v => !v)}
                          style={{ background: "none", border: "none", color: C.textMuted, fontSize: 13, cursor: "pointer", padding: 0, textDecoration: "underline" }}
                        >
                          {showArchivedWorkouts ? "▲ Masquer" : "▼ Voir"} les séances archivées ({navProgramItems.filter(w => w.is_archived).length})
                        </button>
                      )}
                    </>
                  )}
                </>
              )}
           </div>
          )}

          {mainTab === "comptabilite" && (() => {
            const currentMonthPrefix = today.slice(0, 7);
            const isInCurrentMonth = d => d && d.slice(0, 7) === currentMonthPrefix;
            const activeForBilling = clients.filter(c => !c.is_paused && !c.contract_ended);
            const dueThisMonth = activeForBilling.filter(c => isInCurrentMonth(c.next_payment));
            const caPrevu = dueThisMonth.reduce((s, c) => s + (parseFloat(c.monthly_amount) || 0), 0);
            const paymentsThisMonth = allPayments.filter(p => isInCurrentMonth(p.paid_date));
            const caEncaisse = paymentsThisMonth.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);
            const isNewClient = c => c.start_date && (new Date(today) - new Date(c.start_date)) / 86400000 <= 28;
            const newClients = activeForBilling.filter(c => isNewClient(c) && !isInCurrentMonth(c.next_payment));
            const newClientsTotal = newClients.reduce((s, c) => s + (parseFloat(c.monthly_amount) || 0), 0);
            const rowStatus = c => {
              if (isNewClient(c) && !isInCurrentMonth(c.next_payment)) return "nouvelle";
              if (c.next_payment && c.next_payment < today) return "retard";
              if (isInCurrentMonth(c.next_payment)) return "attente";
              return "avenir";
            };
            const handleMarkPaid = async (c) => {
              if (!window.confirm(`Confirmer la réception du paiement de ${c.monthly_amount} € pour ${c.name} aujourd'hui ?`)) return;
              const { error, nextDue } = await addPaymentRecord(c.id, c.monthly_amount, today);
              if (error) { alert("❌ Erreur lors de l'enregistrement du paiement."); return; }
              await updateClient(c.id, { next_payment: nextDue });
            };
            return (
              <div>
                <h1 style={{ fontFamily: F.serif, fontWeight: 400, fontSize: isWide ? 38 : 30, letterSpacing: "-0.8px", color: C.heading, margin: "0 0 6px" }}>Paiements</h1>
                <p style={{ color: C.textMuted, fontSize: 15, margin: "0 0 22px" }}>Les échéances de tes clientes, cycle de 4 semaines.</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 20 }}>
                  {[["Prévu ce mois", `${caPrevu.toFixed(0)} €`], ["Encaissé ce mois", `${caEncaisse.toFixed(0)} €`], ["Clientes à encaisser", dueThisMonth.length]].map(([label, value]) => (
                    <Card key={label} style={{ display: "flex", flexDirection: "column", gap: 6, padding: "18px 20px" }}>
                      <span style={{ fontSize: 14, color: C.textMuted }}>{label}</span>
                      <span style={{ fontFamily: F.serif, fontSize: 32, color: C.heading, fontVariantNumeric: "tabular-nums" }}>{value}</span>
                    </Card>
                  ))}
                </div>
                {newClients.length > 0 && (
                  <div style={{ background: C.blue + "15", border: `1px solid ${C.blue}44`, borderRadius: 12, padding: 16, marginBottom: 20 }}>
                    <div style={{ fontWeight: 700, color: C.blue, marginBottom: 8, fontSize: 13 }}>👋 Nouvelles clientes (moins de 28 jours)</div>
                    {newClients.map(c => (
                      <div key={c.id} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 13 }}>
                        <span>{c.name} — arrivée le {formatDate(c.start_date)}</span>
                        <span style={{ color: C.blue, fontWeight: 700 }}>{c.monthly_amount} € attendu le {formatDate(c.next_payment)}</span>
                      </div>
                    ))}
                    <div style={{ fontSize: 12, color: C.textMuted, marginTop: 8 }}>Ce montant ({newClientsTotal.toFixed(0)} €) viendra gonfler le CA prévu du mois où tombe leur échéance.</div>
                  </div>
                )}
                <Card style={{ padding: isWide ? "20px 24px" : 16 }}>
                  <h2 style={{ fontSize: 19, fontWeight: 650, margin: "0 0 10px", color: C.heading }}>Échéances</h2>
                  {isWide && (
                    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.7fr) 1fr 1fr 1fr 170px", gap: 12, padding: "10px 0", borderBottom: `1px solid ${C.border}`, fontSize: 13, color: C.textMuted }}>
                      <span>Cliente</span><span>Échéance</span><span style={{ textAlign: "right" }}>Montant</span><span>État</span><span />
                    </div>
                  )}
                  {loadingPayments ? <Spinner /> : [...activeForBilling].sort((a, b) => (a.next_payment || "9999").localeCompare(b.next_payment || "9999")).map(c => {
                    const status = rowStatus(c);
                    const badge = <Badge color={status === "avenir" ? C.green : status === "nouvelle" ? C.blue : status === "retard" ? C.red : C.yellow}>{status === "avenir" ? "À jour" : status === "nouvelle" ? "Nouvelle" : status === "retard" ? "En retard" : "À encaisser"}</Badge>;
                    const action = (status === "attente" || status === "retard") ? <Btn small variant="secondary" onClick={() => handleMarkPaid(c)} style={{ width: "auto" }}>Saisir le règlement</Btn> : null;
                    return isWide ? (
                      <div key={c.id} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.7fr) 1fr 1fr 1fr 170px", gap: 12, alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${C.border}` }}>
                        <button onClick={() => openClient(c.id, "paiements")} style={{ display: "flex", alignItems: "center", gap: 12, background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "inherit", color: C.white, textAlign: "left", minWidth: 0 }}>
                          <Avatar initials={c.avatar} size={34} />
                          <span style={{ minWidth: 0 }}><span style={{ display: "block", fontWeight: 650, fontSize: 15 }}>{c.name}</span><span style={{ fontSize: 12.5, color: C.textMuted }}>Cycle de 4 semaines</span></span>
                        </button>
                        <span style={{ fontSize: 14 }}>{formatDate(c.next_payment)}</span>
                        <span style={{ fontSize: 15, fontWeight: 650, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{(parseFloat(c.monthly_amount) || 0).toFixed(2).replace(".", ",")} €</span>
                        <span>{badge}</span>
                        <span style={{ textAlign: "right" }}>{action}</span>
                      </div>
                    ) : (
                      <div key={c.id} style={{ padding: "14px 0", borderBottom: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <Avatar initials={c.avatar} size={34} />
                          <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 650, fontSize: 15 }}>{c.name}</div><div style={{ fontSize: 13, color: C.textMuted }}>Échéance {formatDate(c.next_payment)}</div></div>
                          <span style={{ fontWeight: 650, fontVariantNumeric: "tabular-nums" }}>{(parseFloat(c.monthly_amount) || 0).toFixed(0)} €</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>{badge}{action}</div>
                      </div>
                    );
                  })}
                  {activeForBilling.length === 0 && <p style={{ color: C.textMuted, textAlign: "center" }}>Aucune cliente active.</p>}
                </Card>
              </div>
            );
          })()}
        
          {mainTab === "admin" && (
            <div>
              <h1 style={{ fontFamily: F.serif, fontWeight: 400, fontSize: isWide ? 38 : 30, letterSpacing: "-0.8px", color: C.heading, margin: "0 0 6px" }}>Accès des clientes</h1>
              <p style={{ color: C.textMuted, fontSize: 15, margin: "0 0 22px" }}>Réinitialise le mot de passe d'une cliente sans passer par Supabase.</p>
              {adminError && (
                <Card style={{ borderColor: C.red + "44", marginBottom: 16 }}>
                  <div style={{ color: C.red, fontSize: 13 }}>❌ {adminError}</div>
                </Card>
              )}
              {loadingAdmin ? <Spinner /> : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {clients.length === 0 && <Card><p style={{ color: C.textMuted, textAlign: "center", margin: 0 }}>Aucune cliente.</p></Card>}
                  {clients.map(c => {
                    const authUser = adminUsers.find(u => u.id === c.user_id);
                    const isResetting = resetTargetId === c.id;
                    return (
                      <Card key={c.id}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: isResetting ? 14 : 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <Avatar initials={c.avatar} size={34} />
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 14 }}>{c.name}</div>
                              <div style={{ fontSize: 12, color: C.textMuted }}>{authUser?.email || "Compte introuvable"}</div>
                            </div>
                          </div>
                          <Btn
                            small
                            variant={isResetting ? "secondary" : "primary"}
                            onClick={() => {
                              const next = isResetting ? null : c.id;
                              setResetTargetId(next);
                              setNewPasswordInput(next ? generateSimplePassword() : "");
                              setResetMessage("");
                            }}
                            style={{ width: "auto" }}
                          >
                            {isResetting ? "Annuler" : "🔑 Réinitialiser"}
                          </Btn>
                        </div>
                        {isResetting && (
                          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            <Inp label="Nouveau mot de passe" placeholder="ex: NinaHer2026!" value={newPasswordInput} onChange={e => setNewPasswordInput(e.target.value)} />
                            <div style={{ display: "flex", gap: 10 }}>
                              <Btn small variant="secondary" onClick={() => setNewPasswordInput(generateSimplePassword())} style={{ width: "auto" }}>🎲 Générer</Btn>
                              <Btn small onClick={() => handleResetPassword(c, authUser)} disabled={!newPasswordInput || resettingId === c.id} style={{ flex: 1 }}>
                                {resettingId === c.id ? "..." : "Confirmer"}
                              </Btn>
                            </div>
                            {resetMessage && (
                              <div style={{ fontSize: 13, color: resetMessage.startsWith("✅") ? C.green : C.red, fontWeight: 600 }}>{resetMessage}</div>
                            )}
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {mainTab === "clients" && (() => {
            const q = normName(clientSearch);
            const match = (c) => !q || normName(c.name).includes(q);
            const groups = [
              ["Actives", clients.filter(c => !c.is_paused && !c.contract_ended && match(c))],
              ["En pause", clients.filter(c => c.is_paused && !c.contract_ended && match(c))],
              ["Contrat terminé", clients.filter(c => c.contract_ended && match(c))],
            ].filter(([, list]) => list.length > 0);
            const list = (
              <Card style={{ padding: 14, ...(isWide ? { position: "sticky", top: 20 } : {}) }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  <input value={clientSearch} onChange={e => setClientSearch(e.target.value)} placeholder="Rechercher une cliente" aria-label="Rechercher une cliente" style={{ ...inputSt, padding: "10px 12px" }} />
                  <button onClick={() => setShowAddClient(true)} aria-label="Nouvelle cliente" title="Nouvelle cliente" style={{ flexShrink: 0, width: 44, borderRadius: 12, border: "none", background: C.cherry, color: C.brandCream, cursor: "pointer", display: "grid", placeItems: "center" }}><Icon name="plus" /></button>
                </div>
                {loadingClients ? <Spinner /> : groups.length === 0 ? <p style={{ color: C.textMuted, fontSize: 14, margin: 8 }}>Aucune cliente trouvée.</p> : groups.map(([label, items]) => (
                  <div key={label} style={{ marginBottom: 6 }}>
                    <Eyebrow style={{ fontSize: 10, padding: "8px 8px 4px" }}>{label} · {items.length}</Eyebrow>
                    {items.map(c => (
                      <button key={c.id} onClick={() => openClient(c.id, clientTab)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 8px", borderRadius: 12, border: "none", background: selected === c.id ? C.pink + "1c" : "transparent", cursor: "pointer", fontFamily: "inherit", color: C.white, textAlign: "left", opacity: c.contract_ended ? 0.6 : 1 }}>
                        <div style={{ position: "relative" }}>
                          <Avatar initials={c.avatar} size={38} color={c.is_paused ? C.orange : c.contract_ended ? C.muted : C.pink} />
                          {!c.contract_ended && !c.is_paused && <span style={{ position: "absolute", right: 0, bottom: 0, width: 10, height: 10, borderRadius: "50%", background: isDoneToday(c.id) ? C.green : C.track, border: `2px solid ${C.card}` }} />}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 650, fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div>
                          <div style={{ fontSize: 12.5, color: C.textMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.is_paused ? "En pause" : c.contract_ended ? "Contrat terminé" : isDoneToday(c.id) ? "Journal rempli aujourd'hui" : c.goal || "—"}</div>
                        </div>
                        {selected === c.id && isWide && <Icon name="chevron" size={18} color={C.cherry} />}
                      </button>
                    ))}
                  </div>
                ))}
              </Card>
            );
            if (!isWide && !client) return list;
            const CLIENT_GROUPS = { suivi: ["journal", "bilan"], entrainement: ["seances", "perf"], corps: ["body"], admin: ["paiements"] };
            const group = Object.keys(CLIENT_GROUPS).find(g => CLIENT_GROUPS[g].includes(clientTab)) || "suivi";
            const fiche = !client ? (
              <Card style={{ padding: 40, textAlign: "center" }}><p style={{ color: C.textMuted, margin: 0 }}>Choisis une cliente dans la liste pour ouvrir sa fiche.</p></Card>
            ) : (
            <div style={{ minWidth: 0 }}>
              {!isWide && <button onClick={() => setSelected(null)} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 15, marginBottom: 14, padding: 0, fontFamily: "inherit" }}><Icon name="back" size={18} /> Clientes</button>}
              <Card style={{ padding: isWide ? "20px 24px" : 16, marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                  <Avatar initials={client.avatar} size={52} />
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <h2 style={{ fontFamily: F.serif, fontWeight: 400, fontSize: 28, letterSpacing: "-0.5px", color: C.heading, margin: "0 0 4px" }}>{client.name}</h2>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                      {client.goal && <span style={{ fontSize: 14, color: C.textMuted, marginRight: 4 }}>{client.goal}</span>}
                      {client.is_paused && <Badge color={C.orange}>En pause</Badge>}
                      {client.contract_ended && <Badge color={C.textMuted}>Contrat terminé le {formatDate(client.contract_ended_at)}</Badge>}
                      {!client.contract_ended && client.next_payment && <Badge color={daysUntil(client.next_payment) < 0 ? C.red : daysUntil(client.next_payment) <= 3 ? C.yellow : C.textMuted}>Paiement {formatDate(client.next_payment)}</Badge>}
                      <Badge color={C.pink}>🔥 {client.streak || 0} j</Badge>
                    </div>
                  </div>
                  <Btn small onClick={() => setShowMessage(true)} style={{ width: "auto", display: "flex", alignItems: "center", gap: 8 }}><Icon name="message" size={17} /> Message</Btn>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
                  <Btn small variant="secondary" onClick={() => setEditingClient(client)} style={{ width: "auto" }}>Modifier la fiche</Btn>
                  {!client.contract_ended && <Btn small variant="secondary" onClick={() => setShowPauseModal(true)} style={{ width: "auto" }}>{client.is_paused ? "Gérer la pause" : "Mettre en pause"}</Btn>}
                  <Btn small variant="secondary" onClick={() => handleToggleContractEnded(client)} style={{ width: "auto" }}>{client.contract_ended ? "Réactiver le contrat" : "Fin de contrat"}</Btn>
                </div>
              </Card>
              {client.contract_ended && (
                <div style={{ background: C.field, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, marginBottom: 18, fontSize: 14, color: C.textMuted }}>
                  Le contrat de {client.name.split(" ")[0]} est terminé. Elle garde accès à son espace et aux séances que tu lui assignes, mais n'apparaît plus dans le suivi journal et paiements.
                </div>
              )}

              <UnderlineTabs tabs={[["suivi", "Suivi"], ["entrainement", "Entraînement"], ["corps", "Nutrition & corps"], ["admin", "Administratif"]]} active={group} onChange={g => setClientTab(CLIENT_GROUPS[g][0])} />
              {group === "suivi" && <Segmented options={[["journal", "Journal"], ["bilan", "Bilan de la semaine"]]} active={clientTab} onChange={setClientTab} />}
              {group === "entrainement" && <Segmented options={[["seances", "Séances et planning"], ["perf", "Performances"]]} active={clientTab} onChange={setClientTab} />}

              {clientTab === "journal" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {loadingData ? <Spinner /> : entries.length === 0 ? <Card><p style={{ color: C.textMuted, textAlign: "center", margin: 0 }}>Aucune entrée.</p></Card> : entries.map((e, i) => <EntryCard key={i} e={e} proteinGoal={proteinTarget(profile)} onClick={() => setSelectedEntry(e)} />)}
                </div>
              )}

              {clientTab === "bilan" && (
                loadingData ? <Spinner /> : (
                  <div>
                    <WeeklyFocusEditor weeklyFocus={weeklyFocus} onSave={upsertWeeklyFocus} />
                    <FourWeekComparison entries={entries} meals={meals} activitySessions={activitySessions} weights={weights} profile={profile} weeklyCheckins={weeklyCheckins} />
                    <WeeklyBilanView schedule={schedule} sessionLogs={sessionLogs} entries={entries} meals={meals} activitySessions={activitySessions} weights={weights} profile={profile} weeklyCheckins={weeklyCheckins} weeklyFocus={weeklyFocus} onSaveFocus={upsertWeeklyFocus} clientName={client?.name} />
                  </div>
                )
              )}

              {clientTab === "seances" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <Card>
                    <WeekStrip schedule={schedule} workoutsById={workoutsById} appointments={appointments} />
                  </Card>
                  <AppointmentScheduler appointments={appointments} onAdd={addAppointment} onDelete={deleteAppointment} />
                  {loadingData ? <Spinner /> : activeWorkoutsList.map(w => {
                    const assigned = assignedWorkouts.find(a => a.workout_id === w.id);
                    return (
                      <Card key={w.id} style={{ borderColor: assigned ? C.green + "44" : C.border }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: assigned ? 14 : 0 }}>
                          <div><div style={{ fontWeight: 800, fontSize: 15, marginBottom: 2 }}>{w.name}</div><div style={{ fontSize: 12, color: C.textMuted }}>{w.exercises?.length || 0} exercices</div></div>
                          <button onClick={() => toggleWorkout(w.id)} style={{ padding: "8px 16px", borderRadius: 100, fontWeight: 700, fontSize: 12, cursor: "pointer", background: assigned ? C.green + "22" : C.pink + "22", border: `1.5px solid ${assigned ? C.green : C.pink}`, color: assigned ? C.green : C.pink, flexShrink: 0 }}>
                            {assigned ? "✓ Assignée" : "+ Assigner"}
                          </button>
                        </div>
                        {assigned && <WorkoutScheduleEditor workoutId={w.id} schedule={schedule} onSchedule={scheduleWorkout} onUnschedule={unscheduleWorkout} />}
                      </Card>
                    );
                  })}
                </div>
              )}

              {clientTab === "perf" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {loadingData ? <Spinner /> : sessionLogs.length === 0 ? <Card><p style={{ color: C.textMuted, textAlign: "center", margin: 0 }}>Aucune séance enregistrée.</p></Card> : sessionLogs.map((log, i) => <PerfCard key={i} log={log} workout={workouts.find(w => w.id === log.workout_id)} />)}
                </div>
              )}

              {clientTab === "body" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {loadingData ? <Spinner /> : (<>
                    {(
                      <Card>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: profile ? 10 : 0 }}>
                          <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em" }}>🍽️ PROFIL NUTRITIONNEL</div>
                          <button onClick={() => setEditingClient(client)} style={{ background: "none", border: "none", color: C.pink, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{profile ? "Modifier" : "+ Compléter"}</button>
                        </div>
                        {profile ? (
                          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 13 }}>
                            <span><strong>{calcAge(profile.birth_date) ?? "—"}</strong> ans</span>
                            <span>{profile.sex === "F" ? "Femme" : profile.sex === "M" ? "Homme" : "—"}</span>
                            <span><strong>{profile.height_cm || "—"}</strong> cm</span>
                            <span style={{ color: C.pink, fontWeight: 700 }}>{nutritionGoalLabel(profile.nutrition_goal)}</span>
                            <span style={{ color: C.green }}>💪 <strong>{proteinTarget(profile) ? `${proteinTarget(profile)} g` : "—"}</strong> prot./jour</span>
                            {(profile.kcal_target_training || profile.kcal_target_rest) && <span style={{ color: C.yellow }}>🔥 <strong>{profile.kcal_target_training || "—"}</strong> entraînement · <strong>{profile.kcal_target_rest || "—"}</strong> off</span>}
                            {fatFloor(profile) && <span style={{ color: C.pink }}>🥑 min <strong>{fatFloor(profile)} g</strong></span>}
                          </div>
                        ) : <p style={{ color: C.textMuted, fontSize: 12, margin: 0 }}>Profil non renseigné — la balance énergétique ne peut pas être calculée pour cette cliente.</p>}
                      </Card>
                    )}
                    {weights.length > 1 && (
                      <Card>
                        <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 14 }}>POIDS</div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                          {[{ l: "DÉPART", v: `${weights[0].value} kg`, c: C.white }, { l: "ACTUEL", v: `${weights[weights.length - 1].value} kg`, c: C.pink }, { l: "PERDU", v: `-${(weights[0].value - weights[weights.length - 1].value).toFixed(1)} kg`, c: C.green }].map(s => (
                            <div key={s.l} style={{ background: C.field, borderRadius: 10, padding: 12, textAlign: "center" }}><div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>{s.l}</div><div style={{ fontSize: 18, fontWeight: 900, color: s.c }}>{s.v}</div></div>
                          ))}
                        </div>
                      </Card>
                    )}
                    {measurements.length > 0 && (
                      <Card>
                        <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 14 }}>📏 MENSURATIONS</div>
                        {measurements.length >= 2 && (() => {
                          const first = measurements[0], last = measurements[measurements.length - 1];
                          return (
                            <div style={{ marginBottom: 14 }}>
                              {[["chest", "Poitrine"], ["waist", "Tour de taille"], ["hips", "Hanches"], ["thighs", "Cuisses"]].map(([k, label]) => {
                                if (last[k] == null || first[k] == null) return null;
                                const diff = (last[k] - first[k]).toFixed(1);
                                return (
                                  <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}`, fontSize: 13 }}>
                                    <span style={{ color: C.textMuted }}>{label}</span>
                                    <span>
                                      <strong>{last[k]} cm</strong>{" "}
                                      <span style={{ color: diff < 0 ? C.green : diff > 0 ? C.red : C.textMuted, fontSize: 11 }}>
                                        {diff < 0 ? diff : diff > 0 ? `+${diff}` : "—"} cm
                                      </span>
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })()}
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {[...measurements].reverse().map((m, i) => (
                            <div key={i} style={{ background: C.field, borderRadius: 10, padding: "10px 12px" }}>
                              <div style={{ fontSize: 12, color: C.pink, fontWeight: 700, marginBottom: 6 }}>{formatDate(m.date)}</div>
                              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                                {[["chest", "Poitrine"], ["waist", "Taille"], ["hips", "Hanches"], ["thighs", "Cuisses"]].map(([k, label]) => m[k] != null ? (
                                  <div key={k} style={{ textAlign: "center" }}>
                                    <div style={{ fontSize: 9, color: C.textMuted, marginBottom: 2 }}>{label.toUpperCase()}</div>
                                    <div style={{ fontSize: 13, fontWeight: 800 }}>{m[k]} <span style={{ fontSize: 10, color: C.textMuted }}>cm</span></div>
                                  </div>
                                ) : null)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    )}
                    {progressPhotos.length > 0 && (
                      <Card>
                        <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 14 }}>📸 PHOTOS DE PROGRESSION</div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                          {progressPhotos.map((p, i) => <div key={i}><img src={p.photo} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 12, marginBottom: 4 }} /><div style={{ fontSize: 11, color: C.textMuted }}>{formatDate(p.date)}</div>{p.note && <div style={{ fontSize: 11, color: C.white }}>{p.note}</div>}</div>)}
                        </div>
                      </Card>
                    )}
                    {weights.length <= 1 && progressPhotos.length === 0 && measurements.length === 0 && <Card><p style={{ color: C.textMuted, textAlign: "center", margin: 0 }}>Pas encore de données.</p></Card>}
                  </>)}
                </div>
              )}

      {clientTab === "paiements" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <Card>
                    <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 14 }}>📋 CONTRAT</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <div style={{ background: C.field, borderRadius: 10, padding: 12 }}><div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>DÉBUT</div><div style={{ fontWeight: 700, fontSize: 13 }}>{formatDate(client.start_date)}</div></div>
                      <div style={{ background: C.field, borderRadius: 10, padding: 12 }}><div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>SÉANCES/SEMAINE</div><div style={{ fontWeight: 700, fontSize: 13 }}>{client.sessions_per_week || 3}x</div></div>
                      <div style={{ background: C.field, borderRadius: 10, padding: 12 }}><div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>MONTANT</div><div style={{ fontWeight: 700, fontSize: 18, color: C.green }}>{client.monthly_amount || "—"} €</div></div>
                      <div style={{ background: !client.contract_ended && daysUntil(client.next_payment) <= 3 ? C.yellow + "15" : C.field, borderRadius: 10, padding: 12 }}><div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>PROCHAIN PAIEMENT</div><div style={{ fontWeight: 700, fontSize: 13, color: !client.contract_ended && daysUntil(client.next_payment) <= 3 ? C.yellow : C.white }}>{client.contract_ended ? "Contrat terminé" : formatDate(client.next_payment)}</div></div>
                    </div>
                  </Card>
                  <Card>
                    <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 14 }}>HISTORIQUE DES PAIEMENTS</div>
                    <PaymentHistory payments={payments} />
                    <div style={{ fontSize: 12, color: C.textMuted, marginTop: 12, textAlign: "center" }}>💡 L'enregistrement des paiements se fait désormais depuis l'onglet Comptabilité.</div>
                  </Card>
                </div>
              )}

            </div>
            );
            return isWide ? (
              <div style={{ display: "grid", gridTemplateColumns: "300px minmax(0, 1fr)", gap: 24, alignItems: "start" }}>{list}{fiche}</div>
            ) : fiche;
          })()}
        </div>
      </main>

      {/* MODALS */}
      {showCatalog && <CatalogPickerModal onClose={() => setShowCatalog(false)} onSelect={() => {}} />}
      {showMessage && client && (
        <div onClick={() => setShowMessage(false)} style={{ position: "fixed", inset: 0, background: C.overlay, display: "flex", alignItems: isWide ? "center" : "flex-end", justifyContent: "center", zIndex: 100, padding: isWide ? 20 : 0 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: C.card, borderRadius: isWide ? 20 : "22px 22px 0 0", padding: "22px 20px calc(22px + env(safe-area-inset-bottom, 0px))", width: "100%", maxWidth: 480 }}>
            <h3 style={{ fontFamily: F.serif, fontWeight: 400, fontSize: 24, color: C.heading, margin: "0 0 4px" }}>Message à {client.name.split(" ")[0]}</h3>
            <p style={{ color: C.textMuted, fontSize: 14, margin: "0 0 14px" }}>Il s'affiche sur son accueil jusqu'à ce qu'elle le marque comme lu.</p>
            <TA value={msgText} onChange={e => setMsgText(e.target.value)} placeholder={`Bravo ${client.name.split(" ")[0]} 💪`} style={{ minHeight: 120 }} />
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <Btn variant="secondary" onClick={() => setShowMessage(false)} style={{ flex: 1 }}>Annuler</Btn>
              <Btn onClick={handleSendMessage} disabled={!msgText.trim()} style={{ flex: 2 }}>Envoyer</Btn>
            </div>
          </div>
        </div>
      )}
      {showAddClient && (
        <div style={{ position: "fixed", inset: 0, background: C.overlay, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 28, width: "100%", maxWidth: 420, maxHeight: "90vh", overflowY: "auto" }}>
            <h3 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 900 }}>Nouvelle cliente</h3>
            <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 20, marginTop: 0 }}>Un compte sera créé automatiquement.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Inp label="Nom complet" placeholder="Camille Rousseau" value={newClientForm.name} onChange={e => setNewClientForm({ ...newClientForm, name: e.target.value })} />
              <Inp label="Email" type="email" placeholder="camille@email.com" value={newClientForm.email} onChange={e => setNewClientForm({ ...newClientForm, email: e.target.value })} />
              <Inp label="Mot de passe temporaire" type="text" placeholder="ex: NinaHer2025!" value={newClientForm.password} onChange={e => setNewClientForm({ ...newClientForm, password: e.target.value })} />
              <Inp label="Objectif" placeholder="Perte de poids..." value={newClientForm.goal} onChange={e => setNewClientForm({ ...newClientForm, goal: e.target.value })} />
              <Inp label="Séances par semaine" type="number" min="1" max="7" value={newClientForm.sessions_per_week} onChange={e => setNewClientForm({ ...newClientForm, sessions_per_week: e.target.value })} />
              <Inp label="Montant toutes les 4 semaines (€)" type="number" placeholder="150" value={newClientForm.monthly_amount} onChange={e => setNewClientForm({ ...newClientForm, monthly_amount: e.target.value })} />
              <Inp label="Date de début" type="date" value={newClientForm.start_date} onChange={e => setNewClientForm({ ...newClientForm, start_date: e.target.value })} />
              <Inp label="Premier paiement dû le" type="date" value={newClientForm.next_payment} onChange={e => setNewClientForm({ ...newClientForm, next_payment: e.target.value })} />
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <Btn variant="secondary" onClick={() => setShowAddClient(false)} style={{ flex: 1 }}>Annuler</Btn>
              <Btn onClick={handleAddClient} disabled={addingClient} style={{ flex: 2 }}>{addingClient ? "Création..." : "Créer le compte"}</Btn>
            </div>
          </div>
        </div>
      )}
      {editingClient && <EditClientModal client={editingClient} onSave={handleSaveClient} onUpdateProfile={updateProfile} onDelete={handleDeleteClient} onClose={() => setEditingClient(null)} />}
     {showPauseModal && client && <PauseModal client={client} onClose={() => setShowPauseModal(false)} onUpdate={(updatedClient) => {
        if (updatedClient) updateClient(client.id, updatedClient);
      }} />}
    </div>
  );
};
// ══════════════════════════════════════════════════════════════════════════════
// CLIENT APP
// ══════════════════════════════════════════════════════════════════════════════
const ClientApp = ({ user, onLogout }) => {
  const [clientInfo, setClientInfo] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [screen, setScreen] = useState("home");
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(typeof Notification !== "undefined" && Notification?.permission === "granted");
  const [previewWorkout, setPreviewWorkout] = useState(null);
  const [loadingWorkoutId, setLoadingWorkoutId] = useState(null);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [sessionLogs, setSessionLogs] = useState([]);
  const [bodyTab, setBodyTab] = useState("weight");
  const [showRules, setShowRules] = useState(false);
  const [seancesTab, setSeancesTab] = useState("todo");
  const [perfView, setPerfView] = useState("sessions");
  const [openExercise, setOpenExercise] = useState(null);
  const [exerciseSearch, setExerciseSearch] = useState("");
  const [newWeight, setNewWeight] = useState("");
  const [newMeasure, setNewMeasure] = useState({ chest: "", waist: "", hips: "", thighs: "" });
  const [newPhotoNote, setNewPhotoNote] = useState("");
  const [imgConsentAnswer, setImgConsentAnswer] = useState(null);
  const [imgConsentFaceAnswer, setImgConsentFaceAnswer] = useState(null);
  const [savingImgConsent, setSavingImgConsent] = useState(false);
  useEffect(() => {
    supabase.from("clients").select("*").eq("user_id", user.id).single().then(({ data }) => {
      if (data) {
        setClientInfo(data); setClientId(data.id);
        const stored = window.localStorage.getItem(`nina:herprocess:onboarding:${data.id}`);
        setOnboardingDone(stored === "1");
        const remindersStored = window.localStorage.getItem(`nina:herprocess:reminders:${data.id}`);
        const reminderState = remindersStored === "1" || (typeof Notification !== "undefined" && Notification.permission === "granted");
        setNotifEnabled(reminderState);
      }
    });
  }, [user.id]);

  useEffect(() => {
    if (clientId) {
      supabase.from("session_logs").select("*").eq("client_id", clientId).order("date", { ascending: false }).then(({ data }) => setSessionLogs(data || []));
    }
  }, [clientId]);

  const { entries, weights, measurements, assignedWorkouts, progressPhotos, payments, profile, activitySessions, meals, schedule, appointments, weeklyFocus, weeklyCheckins, loading, addEntry, updateEntry, addWeight, addMeasurement, addProgressPhoto, addActivitySession, deleteActivitySession, addMeal, updateMeal, deleteMeal, upsertWeeklyCheckin, updateProfile } = useClientData(clientId);
  const { activityTypes } = useActivityTypes();

  const myWorkouts = assignedWorkouts.filter(a => a.workout).map(a => ({ ...a.workout, scheduledDate: a.scheduled_date }));
  const workoutsById = Object.fromEntries(myWorkouts.map(w => [w.id, w]));

  const todayEntry = entries.find(e => e.date === today);
  const todayJournalDone = isJournalFilled(todayEntry);
  const todaySchedule = schedule.filter(s => s.date === today);
  const todayWorkout = myWorkouts.find(w => w.id === todaySchedule[0]?.workout_id) || myWorkouts.find(w => w.scheduledDate === today);
  const coachMsg = entries.find(e => e.coach_message)?.coach_message;
  const pendingClientTasks = [];
  if (!todayJournalDone && !clientInfo?.contract_ended) pendingClientTasks.push({ title: "Compléter ton journal", subtitle: "Un petit check-in vaut souvent mieux que rien", icon: "📝", onClick: () => setScreen("journal"), accent: C.orange });
  if (!clientInfo?.contract_ended && !meals.some(m => m.date === today)) pendingClientTasks.push({ title: "Noter tes repas", subtitle: "Ajoute-les au fil de la journée", icon: "🍽️", onClick: () => setScreen("repas"), accent: C.green });
  if (todayWorkout) pendingClientTasks.push({ title: "Ta séance du jour", subtitle: "Prêt à démarrer ?", icon: "💪", onClick: () => openWorkoutPreview(todayWorkout), accent: C.pink });
  if (!clientInfo?.contract_accepted) pendingClientTasks.push({ title: "Valider ton contrat", subtitle: "Relis les règles et engage-toi", icon: "📄", onClick: () => setScreen("contrat"), accent: C.blue });
  // Historique par exercice (toutes séances confondues, du plus récent au plus ancien) :
  // un même exercice revient d'une semaine à l'autre du programme sous des séances différentes.
  const exerciseHistory = (() => {
    const byName = new Map();
    sessionLogs.forEach(l => {
      let logs = {};
      try { logs = JSON.parse(l.exercise_logs || "{}"); } catch {}
      Object.values(logs).forEach(e => {
        const sets = perfSets(e);
        if (!e?.name || !sets.length) return;
        const key = e.name.trim().toLowerCase();
        if (!byName.has(key)) byName.set(key, { name: e.name.trim(), entries: [] });
        byName.get(key).entries.push({ date: l.date, summary: formatPerfSets(sets), comment: e.comment });
      });
    });
    return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name, "fr"));
  })();
  const lastWeight = weights[weights.length - 1];
  const startWeight = weights[0];
  // Objectif calorique du jour fixé par la coach (jour d'entraînement ou jour off) — null si aucun
  const getKcalTarget = (date) => {
    const training = isTrainingDate(date, { schedule, sessionLogs, entries });
    const target = kcalTarget(profile, training);
    return target ? { target, training } : null;
  };
  const todayKcalTarget = getKcalTarget(today);
  const todayCalories = meals.filter(m => m.date === today).reduce((sum, m) => sum + (m.calories || 0), 0);
  const weekAvgWeight = avgWeightBetween(weights, addDays(today, -6), today);

  const handleSaveJournal = async (payload) => {
    const existingEntry = entries.find(e => e.date === payload.date);
    if (existingEntry) { await updateEntry(existingEntry.id, payload); }
    else { await addEntry({ ...payload, client_id: clientId }); }
  };
  const openWorkoutPreview = async (w) => {
    setLoadingWorkoutId(w.id);
    setPreviewWorkout(await fetchWorkoutDetail(w));
    setLoadingWorkoutId(null);
  };

  const handleAddWeight = async () => { if (!newWeight) return; await addWeight(parseFloat(newWeight)); setNewWeight(""); alert("✅ Poids enregistré !"); };
  const handleAddMeasure = async () => { await addMeasurement({ chest: parseFloat(newMeasure.chest), waist: parseFloat(newMeasure.waist), hips: parseFloat(newMeasure.hips), thighs: parseFloat(newMeasure.thighs) }); setNewMeasure({ chest: "", waist: "", hips: "", thighs: "" }); alert("✅ Mensurations enregistrées !"); };
  const handleAddProgressPhoto = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = async ev => { await addProgressPhoto(ev.target.result, newPhotoNote); setNewPhotoNote(""); alert("✅ Photo ajoutée !"); };
    reader.readAsDataURL(file);
  };
  const handleEnableNotifs = async () => {
    const granted = await requestNotifications(clientId);
      if (granted) {
      setNotifEnabled(true);
      if (clientId) window.localStorage.setItem(`nina:herprocess:reminders:${clientId}`, "1");
      alert("✅ Rappels activés ! Tu recevras des notifications utiles pour ton suivi.");
    } else alert(`Pour activer : Réglages → Notifications → ${BRAND_NAME} → Autoriser`);
  };

  const handleCompleteOnboarding = () => {
    if (clientId) window.localStorage.setItem(`nina:herprocess:onboarding:${clientId}`, "1");
    setOnboardingDone(true);
  };

  if (selectedEntry) return <EntryDetail entry={selectedEntry} onBack={() => setSelectedEntry(null)} profile={profile} weights={weights} activitySessions={activitySessions} meals={meals} />;
  if (previewWorkout) return <WorkoutPreview workout={previewWorkout} onBack={() => setPreviewWorkout(null)} onStart={() => { setActiveWorkout(previewWorkout); setPreviewWorkout(null); }} />;
  if (activeWorkout) return <WorkoutPlayer workout={activeWorkout} onFinish={() => { setActiveWorkout(null); supabase.from("session_logs").select("*").eq("client_id", clientId).order("date", { ascending: false }).then(({ data }) => setSessionLogs(data || [])); }} clientId={clientId} sessionLogs={sessionLogs} />;

  if (screen === "journal") {
    if (!clientId) return <div style={{ minHeight: "100vh", background: C.black, display: "flex", alignItems: "center", justifyContent: "center" }}><Spinner /></div>;
    return <JournalForm entries={entries} getKcalTarget={getKcalTarget} onSave={handleSaveJournal} onBack={() => setScreen("home")} onViewHistory={() => setScreen("history")} clientId={clientId} profile={profile} latestWeightKg={lastWeight?.value} activityTypes={activityTypes} activitySessions={activitySessions} onAddActivitySession={addActivitySession} onDeleteActivitySession={deleteActivitySession} meals={meals} onAddMeal={addMeal} onUpdateMeal={updateMeal} onDeleteMeal={deleteMeal} />;
  }

  if (screen === "repas") {
    if (!clientId) return <div style={{ minHeight: "100vh", background: C.black, display: "flex", alignItems: "center", justifyContent: "center" }}><Spinner /></div>;
    return <MealLogForm meals={meals} profile={profile} clientId={clientId} getKcalTarget={getKcalTarget} onAddMeal={addMeal} onUpdateMeal={updateMeal} onDeleteMeal={deleteMeal} onBack={() => setScreen("home")} bottomNav={<ClientBottomNav currentScreen="repas" onNavigate={setScreen} />} />;
  }

  if (!clientInfo) return <div style={{ minHeight: "100vh", background: C.black, display: "flex", alignItems: "center", justifyContent: "center" }}><Spinner /></div>;

  if (!onboardingDone) {
    return <ClientOnboarding clientName={clientInfo.name} onFinish={handleCompleteOnboarding} onEnableReminders={handleEnableNotifs} reminderEnabled={notifEnabled} />;
  }

  if (screen === "perfs") {
    const search = exerciseSearch.trim().toLowerCase();
    const shownExercises = search ? exerciseHistory.filter(ex => ex.name.toLowerCase().includes(search)) : exerciseHistory;
    return (
    <div style={SCREEN}>
      <h1 style={H1}>Mes séances</h1>
      <Segmented options={[["todo", "À faire"], ["history", `Mes performances · ${sessionLogs.length}`]]} active={seancesTab} onChange={setSeancesTab} />
      {seancesTab === "todo" && (
        <>
      <Card style={{ marginBottom: 20 }}>
        <WeekStrip schedule={schedule} workoutsById={workoutsById} appointments={appointments} onSelectWorkout={openWorkoutPreview} loadingWorkoutId={loadingWorkoutId} />
      </Card>
      {loading ? <div style={{ marginBottom: 20 }}><Spinner /></div> : myWorkouts.length === 0 ? (
        <Card><p style={{ color: C.textMuted, margin: 0 }}>Ta coach ne t'a pas encore assigné de séance.</p></Card>
      ) : (() => {
        const nextDate = (w) => schedule.filter(sc => sc.workout_id === w.id && sc.date >= today).sort((x, y) => x.date.localeCompare(y.date))[0]?.date || w.scheduledDate;
        const doneIds = new Set(sessionLogs.map(l => l.workout_id));
        const sorted = [...myWorkouts].sort((x, y) => (nextDate(x) || "9999").localeCompare(nextDate(y) || "9999") || (x.name || "").localeCompare(y.name || "", "fr", { numeric: true }));
        return (
          <Card style={{ padding: "6px 16px" }}>
            {sorted.map((w, i) => {
              const d = nextDate(w); const isToday = d === today;
              return (
                <button key={w.id} onClick={() => openWorkoutPreview(w)} disabled={loadingWorkoutId === w.id} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "13px 0", background: "none", border: "none", borderTop: i ? `1px solid ${C.border}` : "none", cursor: "pointer", fontFamily: "inherit", color: C.white, textAlign: "left" }}>
                  <span style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, display: "grid", placeItems: "center", background: isToday ? C.cherry : doneIds.has(w.id) ? C.green + "1c" : C.field, color: isToday ? C.brandCream : doneIds.has(w.id) ? C.green : C.textMuted }}><Icon name={doneIds.has(w.id) && !isToday ? "check" : "dumbbell"} size={20} /></span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: "block", fontWeight: 650, fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.name}</span>
                    <span style={{ fontSize: 13, color: isToday ? C.cherry : C.textMuted }}>{loadingWorkoutId === w.id ? "Chargement…" : isToday ? "Prévue aujourd'hui" : d ? `Prévue le ${new Date(d).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}` : `${w.exercises?.length || 0} exercices`}{doneIds.has(w.id) ? " · déjà faite" : ""}</span>
                  </span>
                  <Icon name="chevron" size={18} color={C.muted} />
                </button>
              );
            })}
          </Card>
        );
      })()}
        </>
      )}
      {seancesTab === "history" && (
        <>
          <Tab tabs={[["sessions", "Par séance"], ["exercises", "Par exercice"]]} active={perfView} onChange={setPerfView} />
          {sessionLogs.length === 0 ? (
            <Card><p style={{ color: C.textMuted, textAlign: "center", margin: 0 }}>Pas encore de séance enregistrée. Tes performances apparaîtront ici après ta première séance.</p></Card>
          ) : perfView === "sessions" ? (
            sessionLogs.map((log, i) => <div key={log.id || i} style={{ marginBottom: 12 }}><PerfCard log={log} workout={myWorkouts.find(w => w.id === log.workout_id)} /></div>)
          ) : (
            <div>
              <input type="text" placeholder="🔍 Chercher un exercice (ex: hip thrust)" value={exerciseSearch} onChange={e => setExerciseSearch(e.target.value)} style={{ ...inputSt, marginBottom: 14 }} />
              {shownExercises.length === 0 && <p style={{ color: C.textMuted, fontSize: 13, textAlign: "center" }}>Aucun exercice trouvé.</p>}
              {shownExercises.map(ex => {
                const open = openExercise === ex.name;
                return (
                  <Card key={ex.name} onClick={() => setOpenExercise(open ? null : ex.name)} style={{ marginBottom: 10, cursor: "pointer" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>{ex.name}</div>
                        <div style={{ fontSize: 12, color: C.textMuted }}>Dernière fois ({formatDate(ex.entries[0].date)}) : <span style={{ color: C.pink, fontWeight: 700 }}>{ex.entries[0].summary}</span></div>
                      </div>
                      <span style={{ color: C.purple, fontWeight: 700, flexShrink: 0 }}>{open ? "▲" : `${ex.entries.length} ▼`}</span>
                    </div>
                    {open && (
                      <div style={{ marginTop: 12, background: C.field, borderRadius: 10, padding: "4px 12px" }}>
                        {ex.entries.map((e, i) => (
                          <div key={i} style={{ padding: "9px 0", borderBottom: i < ex.entries.length - 1 ? `1px solid ${C.border}` : "none" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                              <span style={{ fontSize: 12, color: C.textMuted, flexShrink: 0 }}>{formatDate(e.date)}</span>
                              <span style={{ fontSize: 13, fontWeight: 700, color: C.pink, textAlign: "right" }}>{e.summary}</span>
                            </div>
                            {e.comment && <div style={{ fontSize: 12, color: C.textMuted, fontStyle: "italic", marginTop: 4 }}>💬 {e.comment}</div>}
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}
      <ClientBottomNav currentScreen={screen} onNavigate={setScreen} />
    </div>
    );
  }

  if (screen === "contrat") return (
        <div style={SCREEN}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "8px 0 18px" }}>
            <Avatar initials={clientInfo.avatar} size={52} />
            <div><h1 style={{ fontFamily: F.serif, fontWeight: 400, fontSize: 30, color: C.heading, margin: 0 }}>{clientInfo.name}</h1>{clientInfo.goal && <div style={{ fontSize: 14, color: C.textMuted }}>{clientInfo.goal}</div>}</div>
          </div>
          <Card style={{ marginBottom: 14, padding: "6px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0" }}>
              <Icon name="bell" color={C.cherry} />
              <span style={{ flex: 1, fontSize: 15 }}>Rappels<span style={{ display: "block", fontSize: 13, color: C.textMuted }}>{notifEnabled ? "Activés sur ce téléphone" : "Pour ne pas oublier ton journal"}</span></span>
              {!notifEnabled && <Btn small onClick={handleEnableNotifs} style={{ width: "auto" }}>Activer</Btn>}
            </div>
            <button onClick={onLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderTop: `1px solid ${C.border}`, background: "none", borderLeft: "none", borderRight: "none", borderBottom: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 15, color: C.white, textAlign: "left" }}>
              <Icon name="logout" color={C.textMuted} /> Se déconnecter
            </button>
          </Card>
          {clientInfo.contract_ended && (
            <div style={{ background: C.textMuted + "15", border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: C.textMuted, marginBottom: 4 }}>🏁 Accompagnement terminé le {formatDate(clientInfo.contract_ended_at)}</div>
              <div style={{ fontSize: 13, color: C.textMuted }}>Ton coach continue de te donner accès à certaines séances. Le suivi journal et paiement n'est plus actif.</div>
            </div>
          )}
          <Card style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 14 }}>MON ACCOMPAGNEMENT</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[{ label: "Date de début", val: formatDate(clientInfo.start_date), icon: "📅" }, { label: "Séances par semaine", val: `${clientInfo.sessions_per_week || 3} séances`, icon: "💪" }, { label: "Montant toutes les 4 semaines", val: `${clientInfo.monthly_amount || "—"} €`, icon: "💶" }, { label: "Prochain paiement", val: clientInfo.contract_ended ? "Contrat terminé" : formatDate(clientInfo.next_payment), icon: "💳", highlight: !clientInfo.contract_ended && daysUntil(clientInfo.next_payment) <= 7 }].map(item => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: item.highlight ? C.yellow + "15" : C.field, borderRadius: 10, border: item.highlight ? `1px solid ${C.yellow}44` : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 18 }}>{item.icon}</span><span style={{ fontSize: 13, color: C.textMuted }}>{item.label}</span></div>
                  <span style={{ fontWeight: 700, fontSize: 14, color: item.highlight ? C.yellow : C.white }}>{item.val}</span>
                </div>
              ))}
            </div>
          </Card>
          {!clientInfo.contract_ended && daysUntil(clientInfo.next_payment) <= 7 && <div style={{ background: C.yellow + "15", border: `1px solid ${C.yellow}44`, borderRadius: 14, padding: 16, marginBottom: 14 }}><div style={{ fontWeight: 700, color: C.yellow, marginBottom: 4 }}>⚠️ Paiement à venir</div><div style={{ fontSize: 13 }}>Ton prochain paiement de <strong>{clientInfo.monthly_amount} €</strong> est dû le <strong>{formatDate(clientInfo.next_payment)}</strong>.</div></div>}
          <Card style={{ marginBottom: 14 }}>
            <button onClick={() => setShowRules(v => !v)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "inherit", color: C.white, marginBottom: showRules || !clientInfo.contract_accepted ? 16 : 0 }}>
              <span style={{ fontSize: 16, fontWeight: 650 }}>Règlement du coaching{clientInfo.contract_accepted && <span style={{ display: "block", fontSize: 13, fontWeight: 500, color: C.green, textAlign: "left" }}>Accepté le {formatDate(clientInfo.contract_accepted_at)}</span>}</span>
              <span style={{ fontSize: 14, color: C.cherry, fontWeight: 650 }}>{showRules || !clientInfo.contract_accepted ? "Masquer" : "Lire"}</span>
            </button>
            {(showRules || !clientInfo.contract_accepted) && (<>
            {CONTRACT_TEXT.sections.map((section, si) => (
              <div key={si} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: C.pink, fontWeight: 700, marginBottom: 8 }}>{section.title}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {section.lines.map((line, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, lineHeight: 1.5 }}><span style={{ color: C.pink, flexShrink: 0 }}>•</span><span>{line}</span></div>
                  ))}
                </div>
              </div>
            ))}
            <div>
              <div style={{ fontSize: 12, color: C.green, fontWeight: 700, marginBottom: 8 }}>LES ENGAGEMENTS DE TON COACH</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {CONTRACT_TEXT.coachLines.map((line, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, lineHeight: 1.5 }}><span style={{ color: C.green, flexShrink: 0 }}>•</span><span>{line}</span></div>
                ))}
              </div>
            </div>
           {!clientInfo.contract_accepted ? (
              <Btn onClick={async () => {
                const { data, error } = await supabase.from("clients").update({ contract_accepted: true, contract_accepted_at: today }).eq("id", clientId).select().single();
                if (!error && data) setClientInfo(data);
              }} style={{ marginTop: 16 }}>✅ J'ai lu et j'accepte le règlement</Btn>
            ) : (
              null
            )}
            </>)}
          </Card>

          {clientInfo.contract_accepted && clientInfo.image_consent === null && (
            <Card style={{ marginBottom: 14, borderColor: C.blue + "44" }}>
              <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 14 }}>📸 DROIT À L'IMAGE</div>
              <div style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 16, color: C.textMuted }}>
                J'accepte d'être filmée ou photographiée pendant les séances, toujours dans le respect de mon corps et de manière appropriée, pour illustrer le travail réalisé.
              </div>
              <div style={{ fontSize: 12, color: C.pink, fontWeight: 700, marginBottom: 8 }}>Acceptes-tu d'être filmée / photographiée ?</div>
              <div style={{ display: "flex", gap: 10, marginBottom: imgConsentAnswer === true ? 16 : 0 }}>
                {[true, false].map(val => (
                  <button key={String(val)} onClick={() => { setImgConsentAnswer(val); if (!val) setImgConsentFaceAnswer(null); }} style={{ flex: 1, padding: 12, borderRadius: 12, border: `2px solid ${imgConsentAnswer === val ? C.pink : C.border}`, background: imgConsentAnswer === val ? C.pink + "22" : C.field, color: imgConsentAnswer === val ? C.pink : C.textMuted, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>{val ? "✅ Oui" : "❌ Non"}</button>
                ))}
              </div>
              {imgConsentAnswer === true && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: C.pink, fontWeight: 700, marginBottom: 8 }}>Souhaites-tu que ton visage soit caché ?</div>
                  <div style={{ display: "flex", gap: 10 }}>
                    {[true, false].map(val => (
                      <button key={String(val)} onClick={() => setImgConsentFaceAnswer(val)} style={{ flex: 1, padding: 12, borderRadius: 12, border: `2px solid ${imgConsentFaceAnswer === val ? C.pink : C.border}`, background: imgConsentFaceAnswer === val ? C.pink + "22" : C.field, color: imgConsentFaceAnswer === val ? C.pink : C.textMuted, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>{val ? "🙈 Oui, caché" : "🙂 Non, visible"}</button>
                    ))}
                  </div>
                </div>
              )}
              <Btn
                disabled={imgConsentAnswer === null || (imgConsentAnswer === true && imgConsentFaceAnswer === null) || savingImgConsent}
                onClick={async () => {
                  setSavingImgConsent(true);
                  const { data, error } = await supabase.from("clients").update({
                    image_consent: imgConsentAnswer,
                    image_consent_hide_face: imgConsentAnswer ? imgConsentFaceAnswer : null,
                    image_consent_at: today,
                  }).eq("id", clientId).select().single();
                  setSavingImgConsent(false);
                  if (!error && data) setClientInfo(data);
                }}
              >
                {savingImgConsent ? "Enregistrement..." : "✅ Valider ma réponse"}
              </Btn>
            </Card>
          )}

          {clientInfo.contract_accepted && clientInfo.image_consent !== null && (
            <Card style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 8 }}>📸 DROIT À L'IMAGE</div>
              <div style={{ fontSize: 13, color: C.green, fontWeight: 700 }}>
                {clientInfo.image_consent
                  ? `✅ Tu as accepté d'être filmée${clientInfo.image_consent_hide_face ? " (visage caché)" : " (visage visible)"} — réponse du ${formatDate(clientInfo.image_consent_at)}`
                  : `❌ Tu as refusé d'être filmée — réponse du ${formatDate(clientInfo.image_consent_at)}`}
              </div>
            </Card>
          )}
         
          <Card><div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 14 }}>HISTORIQUE DES PAIEMENTS</div><PaymentHistory payments={payments} /></Card>
          <ClientBottomNav currentScreen={screen} onNavigate={setScreen} />
        </div>
  );

  if (screen === "bilan") return (
    <ClientWeeklyBilan schedule={schedule} sessionLogs={sessionLogs} entries={entries} meals={meals} activitySessions={activitySessions} weights={weights} profile={profile} weeklyFocus={weeklyFocus} weeklyCheckins={weeklyCheckins} onSaveCheckin={upsertWeeklyCheckin} onBack={() => setScreen("body")} />
  );

  if (screen === "body") return (
        <div style={SCREEN}>
          <h1 style={H1}>Mes progrès</h1>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {[["bilan", "Bilan de la semaine", "Tendance et ressenti"], ["history", "Mes journées", "Historique du journal"]].map(([k, t, sub]) => (
              <button key={k} onClick={() => { setScreen(k); window.scrollTo(0, 0); }} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px", textAlign: "left", cursor: "pointer", fontFamily: "inherit", color: C.white }}>
                <span style={{ display: "block", fontWeight: 650, fontSize: 15 }}>{t}</span><span style={{ fontSize: 13, color: C.textMuted }}>{sub}</span>
              </button>
            ))}
          </div>
          <Segmented options={[["weight", "Poids"], ["measures", "Mesures"], ["photos", "Photos"], ["cycle", "Cycle"]]} active={bodyTab} onChange={setBodyTab} />
          {bodyTab === "weight" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {weekAvgWeight != null && (() => {
                // Moyenne glissante sur 7 jours, une valeur par pesée : la courbe montre la tendance, pas le bruit
                const pts = weights.slice(-30).map(w => ({ d: w.date, v: avgWeightBetween(weights, addDays(w.date, -6), w.date) }));
                const prev = avgWeightBetween(weights, addDays(today, -13), addDays(today, -7));
                const vs = pts.map(x => x.v), min = Math.min(...vs), max = Math.max(...vs), span = max - min || 1;
                const path = pts.map((x, i) => `${pts.length > 1 ? (i / (pts.length - 1)) * 300 : 150},${8 + (1 - (x.v - min) / span) * 48}`).join(" L");
                return (
                  <Card>
                    <Eyebrow>Moyenne des 7 derniers jours</Eyebrow>
                    <div style={{ fontFamily: F.serif, fontSize: 38, color: C.heading, margin: "6px 0 2px", fontVariantNumeric: "tabular-nums" }}>{weekAvgWeight.toFixed(1).replace(".", ",")} <span style={{ fontFamily: F.sans, fontSize: 15, color: C.textMuted }}>kg{prev != null ? ` · ${weekAvgWeight - prev > 0 ? "+" : ""}${(weekAvgWeight - prev).toFixed(1).replace(".", ",")} kg en une semaine` : ""}</span></div>
                    {pts.length > 1 && (
                      <svg viewBox="0 0 300 64" preserveAspectRatio="none" style={{ width: "100%", height: 72, display: "block", margin: "6px 0" }} aria-hidden="true">
                        <path d={`M${path} L300,64 L0,64 Z`} fill={C.pink + "1c"} />
                        <path d={`M${path}`} fill="none" stroke={C.cherry} strokeWidth="2" vectorEffect="non-scaling-stroke" />
                      </svg>
                    )}
                    <div style={{ fontSize: 13, color: C.textMuted }}>Une pesée isolée varie d'un à deux kilos selon l'eau, le cycle ou le transit. La moyenne montre la vraie tendance.</div>
                  </Card>
                );
              })()}
              <Card><div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 12 }}>AJOUTER UN PESAGE</div><div style={{ display: "flex", gap: 10 }}><input type="number" step="0.1" placeholder="ex: 63.2 kg" value={newWeight} onChange={e => setNewWeight(e.target.value)} style={{ ...inputSt, flex: 1 }} /><button onClick={handleAddWeight} style={{ background: C.pink, border: "none", borderRadius: 10, padding: "11px 18px", fontWeight: 800, color: C.black, cursor: "pointer" }}>+</button></div></Card>
              {weights.length > 0 && <Card>{[...weights].reverse().map((w, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${C.border}`, fontSize: 13 }}><span style={{ color: C.textMuted }}>{formatDate(w.date)}</span><span style={{ fontWeight: 700 }}>{w.value} kg</span></div>)}</Card>}
            </div>
          )}
          {bodyTab === "measures" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {measurements.length >= 2 && (() => { const first = measurements[0], last = measurements[measurements.length - 1]; return <Card><div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 12 }}>ÉVOLUTION GLOBALE</div>{[["chest", "Poitrine"], ["waist", "Tour de taille"], ["hips", "Hanches"], ["thighs", "Cuisses"]].map(([k, label]) => { const diff = last[k] - first[k]; return <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}`, fontSize: 13 }}><span style={{ color: C.textMuted }}>{label}</span><span><strong>{last[k]} cm</strong> <span style={{ color: diff < 0 ? C.green : diff > 0 ? C.red : C.textMuted, fontSize: 11 }}>{diff < 0 ? diff : diff > 0 ? `+${diff}` : "—"} cm</span></span></div>; })}</Card>; })()}
              {measurements.length > 0 && (
                <Card>
                  <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 12 }}>HISTORIQUE COMPLET</div>
                  {[...measurements].reverse().map((m, i) => (
                    <div key={i} style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: 12, marginBottom: 12 }}>
                      <div style={{ fontSize: 12, color: C.pink, fontWeight: 700, marginBottom: 8 }}>{formatDate(m.date)}</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                        {[["chest", "Poitrine"], ["waist", "Taille"], ["hips", "Hanches"], ["thighs", "Cuisses"]].map(([k, label]) => m[k] ? (
                          <div key={k} style={{ background: C.field, borderRadius: 8, padding: "8px 10px" }}>
                            <div style={{ fontSize: 9, color: C.textMuted, marginBottom: 2 }}>{label.toUpperCase()}</div>
                            <div style={{ fontSize: 15, fontWeight: 800 }}>{m[k]} <span style={{ fontSize: 11, color: C.textMuted }}>cm</span></div>
                          </div>
                        ) : null)}
                      </div>
                    </div>
                  ))}
                </Card>
              )}
              <Card><div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 12 }}>NOUVELLES MENSURATIONS</div><div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{[["chest", "Poitrine (cm)"], ["waist", "Tour de taille (cm)"], ["hips", "Hanches (cm)"], ["thighs", "Cuisses (cm)"]].map(([k, label]) => <input key={k} type="number" placeholder={label} value={newMeasure[k]} onChange={e => setNewMeasure({ ...newMeasure, [k]: e.target.value })} style={inputSt} />)}<Btn onClick={handleAddMeasure}>Enregistrer</Btn></div></Card>
            </div>
          )}
          {bodyTab === "photos" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Card>
                <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 12 }}>AJOUTER UNE PHOTO</div>
                <input type="text" placeholder="Note : ex: Semaine 4, de face" value={newPhotoNote} onChange={e => setNewPhotoNote(e.target.value)} style={{ ...inputSt, marginBottom: 10 }} />
                <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: C.field, border: `1px dashed ${C.pink}55`, borderRadius: 10, cursor: "pointer" }}>
                  <span style={{ fontSize: 20 }}>📸</span>
                  <div><div style={{ fontSize: 13, color: C.white, fontWeight: 600 }}>Photo de progression</div><div style={{ fontSize: 11, color: C.textMuted }}>De face, de profil, de dos...</div></div>
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleAddProgressPhoto} />
                </label>
              </Card>
              {progressPhotos.length > 0 && <Card><div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 14 }}>MON ÉVOLUTION</div><div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>{progressPhotos.map((p, i) => <div key={i}><img src={p.photo} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 12, marginBottom: 4 }} /><div style={{ fontSize: 11, color: C.textMuted }}>{formatDate(p.date)}</div>{p.note && <div style={{ fontSize: 11, color: C.white }}>{p.note}</div>}</div>)}</div></Card>}
            </div>
          )}
          {bodyTab === "cycle" && <CycleTracker profile={profile} onSave={updateProfile} />}
          <ClientBottomNav currentScreen={screen} onNavigate={setScreen} />
        </div>
  );

  if (screen === "history") return (
        <div style={SCREEN}>
          <button onClick={() => setScreen("body")} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 15, marginBottom: 6, padding: "8px 0", display: "flex", alignItems: "center", gap: 4, fontFamily: "inherit" }}><Icon name="back" size={18} /> Progrès</button>
          <h1 style={{ fontFamily: F.serif, fontWeight: 400, fontSize: 32, letterSpacing: "-0.6px", color: C.heading, margin: "0 0 16px" }}>Mes journées</h1>
          {loading ? <Spinner /> : entries.length === 0 ? <p style={{ color: C.textMuted, textAlign: "center" }}>Aucune entrée.</p> : entries.map((e, i) => <div key={i} style={{ marginBottom: 12 }}><EntryCard e={e} proteinGoal={proteinTarget(profile)} onClick={() => setSelectedEntry(e)} /></div>)}
          <ClientBottomNav currentScreen={screen} onNavigate={setScreen} />
        </div>
  );

  // ── AUJOURD'HUI ──────────────────────────────────────────────────────────
  const firstName = clientInfo.name?.split(" ")[0] || "";
  const todayMeals = meals.filter(m => m.date === today);
  const todayLogged = sessionLogs.some(l => l.date === today);
  const tasks = clientInfo.contract_ended ? [] : [
    todayWorkout && { done: todayLogged, title: "Séance du jour", sub: todayLogged ? "Faite, bravo" : todayWorkout.name, action: todayLogged ? null : "Commencer", onClick: () => openWorkoutPreview(todayWorkout) },
    { done: todayMeals.length >= 3, title: "Mes repas", sub: todayMeals.length ? `${todayMeals.length} repas noté${todayMeals.length > 1 ? "s" : ""}${todayKcalTarget ? ` · ${Math.round(todayCalories).toLocaleString()} / ${todayKcalTarget.target.toLocaleString()} kcal` : ""}` : "Aucun repas noté", action: "Ajouter", onClick: () => setScreen("repas") },
    { done: todayJournalDone, title: "Mon journal", sub: todayJournalDone ? "Rempli, merci" : "Ressenti, pas, sommeil, eau", action: todayJournalDone ? "Revoir" : "Remplir", onClick: () => setScreen("journal") },
  ].filter(Boolean);
  const doneTasks = tasks.filter(t => t.done).length;
  const weekDays = isoWeekDates(new Date());
  return (
    <div style={SCREEN}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Logo size={30} />
        <Eyebrow>{new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</Eyebrow>
      </div>
      <h1 style={{ fontFamily: F.serif, fontWeight: 400, fontSize: 36, letterSpacing: "-0.8px", color: C.heading, margin: "22px 0 16px" }}>Bonjour {firstName}.</h1>

      {!clientInfo.contract_accepted && (
        <button onClick={() => setScreen("contrat")} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, background: C.blue + "12", border: `1px solid ${C.blue}33`, borderRadius: 14, padding: 14, marginBottom: 12, cursor: "pointer", fontFamily: "inherit", textAlign: "left", color: C.white }}>
          <span style={{ flex: 1, fontSize: 15 }}><b style={{ fontWeight: 650 }}>Règlement à valider</b><span style={{ display: "block", fontSize: 13, color: C.textMuted }}>2 minutes pour le lire et l'accepter</span></span>
          <Icon name="chevron" color={C.blue} />
        </button>
      )}

      {!notifEnabled && !clientInfo.contract_ended && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 14px", marginBottom: 12 }}>
          <Icon name="bell" color={C.cherry} />
          <span style={{ flex: 1, fontSize: 15 }}><b style={{ fontWeight: 650 }}>Active tes rappels</b><span style={{ display: "block", fontSize: 13, color: C.textMuted }}>Pour ne pas oublier ton journal</span></span>
          <Btn small onClick={handleEnableNotifs} style={{ width: "auto" }}>Activer</Btn>
        </div>
      )}

      {tasks.length > 0 && (
        <div style={{ background: C.cherry, color: C.brandCream, borderRadius: 18, padding: "14px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 650, letterSpacing: "0.14em", textTransform: "uppercase", color: "#e9c9c9", marginBottom: 4 }}>Ma journée · {doneTasks} sur {tasks.length}</div>
          {tasks.map((t, i) => (
            <button key={t.title} onClick={t.onClick} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 0", background: "none", border: "none", borderTop: i ? "1px solid rgba(255,255,255,0.14)" : "none", cursor: "pointer", fontFamily: "inherit", color: C.brandCream, textAlign: "left" }}>
              <span style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, display: "grid", placeItems: "center", border: `1.5px solid ${t.done ? C.brandCream : "#e9c9c9"}`, background: t.done ? C.brandCream : "transparent", color: C.cherry }}>{t.done && <Icon name="check" size={15} strokeWidth={2.4} />}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontSize: 16, fontWeight: 600 }}>{t.title}</span>
                <span style={{ display: "block", fontSize: 13, color: "#e9c9c9", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.sub}</span>
              </span>
              {t.action && <span style={{ fontSize: 14, fontWeight: 650, flexShrink: 0 }}>{t.action}</span>}
            </button>
          ))}
        </div>
      )}

      {coachMsg && (
        <div style={{ background: C.green + "14", border: `1px solid ${C.green}30`, borderRadius: 16, padding: 16, marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}><Eyebrow>Un mot de Nina</Eyebrow><Badge color={C.green}>nouveau</Badge></div>
          <p style={{ fontSize: 15, lineHeight: 1.5, margin: "0 0 10px" }}>{coachMsg}</p>
          <button onClick={async () => { const entry = entries.find(e => e.coach_message); if (entry) await updateEntry(entry.id, { coach_message: "" }); }} style={{ background: "none", border: "none", padding: "6px 0", color: C.cherry, fontWeight: 650, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>J'ai lu, merci</button>
        </div>
      )}

      <Card style={{ marginBottom: 14 }}>
        <Eyebrow style={{ marginBottom: 12 }}>Ma semaine</Eyebrow>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, textAlign: "center" }}>
          {weekDays.map(d => {
            const filled = entries.some(e => e.date === d && isJournalFilled(e));
            const planned = schedule.some(sc => sc.date === d);
            const isToday = d === today;
            return (
              <div key={d} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, fontSize: 12, color: C.textMuted }}>
                {new Date(d).toLocaleDateString("fr-FR", { weekday: "narrow" })}
                <span style={{ width: 36, height: 36, borderRadius: "50%", display: "grid", placeItems: "center", fontSize: 13, fontWeight: isToday ? 650 : 500, background: isToday ? C.cherry : filled ? C.green + "1f" : planned ? C.pink + "1f" : C.field, color: isToday ? C.brandCream : filled ? C.green : planned ? C.pink : C.white }}>{filled && !isToday ? <Icon name="check" size={15} strokeWidth={2.2} /> : new Date(d).getDate()}</span>
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 12.5, color: C.textMuted, marginTop: 10 }}>Vert : journal rempli · rose : séance prévue</div>
      </Card>

      <button onClick={() => setScreen("bilan")} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, cursor: "pointer", fontFamily: "inherit", textAlign: "left", color: C.white }}>
        <span style={{ flex: 1 }}><b style={{ fontWeight: 650, fontSize: 15 }}>Mon bilan de la semaine</b><span style={{ display: "block", fontSize: 13, color: C.textMuted }}>Ta tendance, tes réussites, ton objectif</span></span>
        <Icon name="chevron" color={C.muted} />
      </button>

      <ClientBottomNav currentScreen={screen} onNavigate={setScreen} />
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// LOGIN SCREEN
// ══════════════════════════════════════════════════════════════════════════════
const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) return setError("Remplis tous les champs.");
    setLoading(true); setError("");
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) { setError("Email ou mot de passe incorrect."); setLoading(false); return; }
    onLogin(data.user); setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: F.sans, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420, background: C.card, border: `1px solid ${C.border}`, borderRadius: 24, padding: 24, boxShadow: "0 10px 30px rgba(64,32,32,0.08)" }}>
        <div style={{ marginBottom: 24, display: "flex", justifyContent: "center" }}><Logo size={32} /></div>
        <h2 style={{ fontSize: 24, fontFamily: F.serif, fontWeight: 400, letterSpacing: "-0.5px", color: C.heading, margin: "0 0 8px", textAlign: "center" }}>Connexion</h2>
        <p style={{ color: C.textMuted, fontSize: 14, marginBottom: 24, marginTop: 0, textAlign: "center" }}>Connecte-toi à ton espace Nina - Her process</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Inp label="Email" type="email" placeholder="ton@email.com" value={email} onChange={e => setEmail(e.target.value)} />
          <Inp label="Mot de passe" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
          {error && <div style={{ background: C.red + "22", border: `1px solid ${C.red}44`, borderRadius: 10, padding: "10px 14px", fontSize: 13, color: C.red }}>{error}</div>}
          <Btn onClick={handleLogin} disabled={loading} style={{ marginTop: 6 }}>{loading ? "Connexion..." : "Se connecter →"}</Btn>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// EDIT CLIENT MODAL
// ══════════════════════════════════════════════════════════════════════════════
const EditClientModal = ({ client, onSave, onUpdateProfile, onDelete, onClose }) => {
  const [form, setForm] = useState({
    name: client.name || "", goal: client.goal || "",
    sessions_per_week: client.sessions_per_week || 3,
    monthly_amount: client.monthly_amount || "",
    start_date: client.start_date || "", next_payment: client.next_payment || "",
  });
  const [profileForm, setProfileForm] = useState({ birth_date: "", sex: "", height_cm: "", nutrition_goal: "", protein_target_g: "", kcal_target_training: "", kcal_target_rest: "", fat_min_g: "" });
  // false tant que la colonne protein_target_g n'existe pas en base : on ne l'envoie pas
  // dans l'upsert (sinon tout l'enregistrement du profil échouerait), sauf si une valeur est saisie.
  const [hasProteinColumn, setHasProteinColumn] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    supabase.from("client_profiles").select("*").eq("client_id", client.id).maybeSingle().then(({ data }) => {
      if (data) {
        setProfileForm({ birth_date: data.birth_date || "", sex: data.sex || "", height_cm: data.height_cm || "", nutrition_goal: data.nutrition_goal || "", protein_target_g: data.protein_target_g || "", kcal_target_training: data.kcal_target_training || "", kcal_target_rest: data.kcal_target_rest || "", fat_min_g: data.fat_min_g || "" });
        setHasProteinColumn("protein_target_g" in data);
      }
      setLoadingProfile(false);
    });
  }, [client.id]);

  const handleSave = async () => {
    setSaving(true);
    setProfileError("");
    const avatar = form.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    await onSave(client.id, { name: form.name, avatar, goal: form.goal, sessions_per_week: parseInt(form.sessions_per_week) || 3, monthly_amount: parseFloat(form.monthly_amount) || 0, start_date: form.start_date, next_payment: form.next_payment });
    const proteinValue = profileForm.protein_target_g === "" ? null : Math.round(Number(profileForm.protein_target_g));
    if (proteinValue != null && !(proteinValue >= 1 && proteinValue <= 500)) {
      setSaving(false);
      setProfileError("L'objectif de protéines doit être compris entre 1 et 500 g par jour.");
      return;
    }
    const toInt = v => v === "" || v == null ? null : Math.round(Number(v));
    const kcalTraining = toInt(profileForm.kcal_target_training);
    const kcalRest = toInt(profileForm.kcal_target_rest);
    const fatMin = toInt(profileForm.fat_min_g);
    if ([kcalTraining, kcalRest].some(v => v != null && !(v >= 800 && v <= 6000))) {
      setSaving(false);
      setProfileError("Les objectifs caloriques doivent être compris entre 800 et 6000 kcal par jour.");
      return;
    }
    if (fatMin != null && !(fatMin >= 1 && fatMin <= 300)) {
      setSaving(false);
      setProfileError("Le minimum de lipides doit être compris entre 1 et 300 g par jour.");
      return;
    }
    if (profileForm.birth_date || profileForm.sex || profileForm.height_cm || profileForm.nutrition_goal || proteinValue != null || hasProteinColumn || kcalTraining != null || kcalRest != null || fatMin != null) {
      // Passe par le hook (updateProfile) : il fait l'upsert AVEC .select(), rafraîchit
      // l'état `profile` immédiatement (la carte se met à jour sans quitter la fiche) et
      // remonte l'erreur Postgres exacte en cas d'échec (policy RLS, contrainte manquante…).
      const saved = await onUpdateProfile({
        birth_date: profileForm.birth_date || null,
        sex: profileForm.sex || null,
        height_cm: profileForm.height_cm ? parseFloat(profileForm.height_cm) : null,
        nutrition_goal: profileForm.nutrition_goal || null,
        ...(proteinValue != null || hasProteinColumn ? { protein_target_g: proteinValue } : {}),
        kcal_target_training: kcalTraining, kcal_target_rest: kcalRest, fat_min_g: fatMin,
      });
      if (!saved) {
        setSaving(false);
        setProfileError("Le profil nutritionnel n'a pas pu être enregistré. Réessaie.");
        return;
      }
    }
    setSaving(false); onClose();
  };

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    await onDelete(client.id);
    setDeleting(false); onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: C.overlay, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 28, width: "100%", maxWidth: 440, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>Modifier {client.name}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 20 }}>✕</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
          <Inp label="Nom complet" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Inp label="Objectif" value={form.goal} onChange={e => setForm({ ...form, goal: e.target.value })} />
          <Inp label="Séances par semaine" type="number" min="1" max="7" value={form.sessions_per_week} onChange={e => setForm({ ...form, sessions_per_week: e.target.value })} />
          <Inp label="Montant toutes les 4 semaines (€)" type="number" value={form.monthly_amount} onChange={e => setForm({ ...form, monthly_amount: e.target.value })} />
          <Inp label="Date de début" type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} />
          <Inp label="Prochain paiement" type="date" value={form.next_payment} onChange={e => setForm({ ...form, next_payment: e.target.value })} />
        </div>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>🍽️ Profil nutritionnel</div>
          {loadingProfile ? <Spinner /> : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Inp label="Date de naissance" type="date" value={profileForm.birth_date} onChange={e => setProfileForm({ ...profileForm, birth_date: e.target.value })} />
              <div>
                <label style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Sexe</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {SEX_OPTIONS.map(o => (<button key={o.value} onClick={() => setProfileForm({ ...profileForm, sex: o.value })} style={{ flex: 1, padding: 11, borderRadius: 10, border: `2px solid ${profileForm.sex === o.value ? C.pink : C.border}`, background: profileForm.sex === o.value ? C.pink + "22" : C.field, color: profileForm.sex === o.value ? C.pink : C.textMuted, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>{o.label}</button>))}
                </div>
              </div>
              <Inp label="Taille (cm)" type="number" placeholder="ex: 165" value={profileForm.height_cm} onChange={e => setProfileForm({ ...profileForm, height_cm: e.target.value })} />
              <div>
                <label style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Objectif nutritionnel</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {NUTRITION_GOAL_OPTIONS.map(o => (<button key={o.value} onClick={() => setProfileForm({ ...profileForm, nutrition_goal: o.value })} style={{ padding: 11, borderRadius: 10, border: `2px solid ${profileForm.nutrition_goal === o.value ? C.pink : C.border}`, background: profileForm.nutrition_goal === o.value ? C.pink + "22" : C.field, color: profileForm.nutrition_goal === o.value ? C.pink : C.textMuted, fontWeight: 700, fontSize: 13, cursor: "pointer", textAlign: "left" }}>{o.label}</button>))}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Inp label="Kcal jour d'entraînement" type="number" inputMode="numeric" placeholder="ex: 1950" value={profileForm.kcal_target_training} onChange={e => setProfileForm({ ...profileForm, kcal_target_training: e.target.value })} />
                <Inp label="Kcal jour off" type="number" inputMode="numeric" placeholder="ex: 1600" value={profileForm.kcal_target_rest} onChange={e => setProfileForm({ ...profileForm, kcal_target_rest: e.target.value })} />
              </div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: -6 }}>Un seul renseigné = valable tous les jours. Laisser vide si aucun objectif.</div>
              <Inp label="Objectif protéines (g/jour)" type="number" inputMode="numeric" min="1" max="500" placeholder="ex: 120 — laisser vide si aucun" value={profileForm.protein_target_g} onChange={e => setProfileForm({ ...profileForm, protein_target_g: e.target.value })} />
              <Inp label="Minimum de lipides (g/jour)" type="number" inputMode="numeric" min="1" max="300" placeholder="ex: 50 — laisser vide si aucun" value={profileForm.fat_min_g} onChange={e => setProfileForm({ ...profileForm, fat_min_g: e.target.value })} />
            </div>
          )}
          {profileError && <div style={{ marginTop: 12, background: C.red + "15", border: `1px solid ${C.red}44`, borderRadius: 10, padding: 12, fontSize: 12, color: C.red }}>{profileError}</div>}
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <Btn variant="secondary" onClick={onClose} style={{ flex: 1 }}>Annuler</Btn>
          <Btn onClick={handleSave} disabled={saving} style={{ flex: 2 }}>{saving ? "Enregistrement..." : "💾 Enregistrer"}</Btn>
        </div>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
          {!confirmDelete ? (
            <Btn variant="danger" onClick={handleDelete} style={{ width: "100%" }}>🗑️ Supprimer cette cliente</Btn>
          ) : (
            <div>
              <div style={{ background: C.red + "15", border: `1px solid ${C.red}44`, borderRadius: 10, padding: 14, marginBottom: 10, fontSize: 13, color: C.red, textAlign: "center" }}>⚠️ Action irréversible.</div>
              <div style={{ display: "flex", gap: 10 }}>
                <Btn variant="secondary" onClick={() => setConfirmDelete(false)} style={{ flex: 1 }}>Annuler</Btn>
                <Btn variant="danger" onClick={handleDelete} disabled={deleting} style={{ flex: 1, background: C.red, color: C.brandCream, border: "none" }}>{deleting ? "Suppression..." : "Confirmer 🗑️"}</Btn>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCoach, setIsCoach] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) { setUser(session.user); setIsCoach(session.user.email === COACH_EMAIL); }
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) { setUser(session.user); setIsCoach(session.user.email === COACH_EMAIL); }
      else { setUser(null); setIsCoach(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => { await supabase.auth.signOut(); setUser(null); setIsCoach(false); };

  if (loading) return <div style={{ minHeight: "100vh", background: C.black, display: "flex", alignItems: "center", justifyContent: "center" }}><Spinner /></div>;
  if (!user) return <LoginScreen onLogin={u => { setUser(u); setIsCoach(u.email === COACH_EMAIL); }} />;
  if (isCoach) return <CoachApp user={user} onLogout={handleLogout} />;
  return <ClientApp user={user} onLogout={handleLogout} />;
}
