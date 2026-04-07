import { useState, useEffect, useRef } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://wetjzebxuyefzvulujxl.supabase.co";
const SUPABASE_KEY = "sb_publishable_v6ENOZboJkDNbUy88oZJ0w_juqtwSb6";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const COACH_EMAIL = "mallardnina16@gmail.com";

const C = {
  black: "#0a0a0a", white: "#ffffff", pink: "#E8879C",
  surface: "#141414", card: "#1a1a1a", border: "#2a2a2a",
  muted: "#555555", textMuted: "#888888", green: "#4ade80", red: "#f87171",
  purple: "#a78bfa", orange: "#fb923c", blue: "#60a5fa", yellow: "#fbbf24",
};

const Logo = ({ size = 22 }) => (
  <div style={{ lineHeight: 1 }}>
    <div style={{ fontFamily: "'Arial Black', sans-serif", fontWeight: 900, fontSize: size, color: C.white, letterSpacing: "-1px", lineHeight: 0.88 }}>process</div>
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3 }}>
      <span style={{ fontFamily: "'Arial Black', sans-serif", fontWeight: 900, fontSize: size, color: C.white, letterSpacing: "-1px", lineHeight: 0.88 }}>lab</span>
      <div style={{ width: size * 0.22, height: size * 0.22, background: C.pink, marginBottom: 3, flexShrink: 0 }} />
    </div>
  </div>
);

const Card = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, cursor: onClick ? "pointer" : "default", ...style }}>{children}</div>
);

const Btn = ({ children, onClick, variant = "primary", disabled, small, style = {} }) => (
  <button onClick={onClick} disabled={disabled} style={{
    background: variant === "primary" ? C.pink : variant === "danger" ? C.red + "22" : variant === "ghost" ? "transparent" : variant === "green" ? C.green : variant === "draft" ? C.blue + "22" : "#222",
    color: variant === "primary" ? C.black : variant === "danger" ? C.red : variant === "green" ? C.black : variant === "draft" ? C.blue : C.white,
    border: variant === "ghost" ? `1px solid ${C.border}` : variant === "danger" ? `1px solid ${C.red}44` : variant === "draft" ? `1px solid ${C.blue}44` : "none",
    borderRadius: small ? 8 : 12, padding: small ? "7px 14px" : "13px 20px",
    fontWeight: 800, fontSize: small ? 13 : 15, cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1, fontFamily: "inherit", transition: "all .15s", ...style,
  }}>{children}</button>
);

const inputSt = { background: "#111", border: `1px solid ${C.border}`, borderRadius: 10, padding: "11px 14px", color: C.white, fontSize: 15, outline: "none", width: "100%", boxSizing: "border-box", fontFamily: "inherit" };

const Inp = ({ label, ...p }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && <label style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</label>}
    <input {...p} style={{ ...inputSt, ...p.style }} />
  </div>
);

const TA = ({ label, ...p }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && <label style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</label>}
    <textarea {...p} style={{ ...inputSt, resize: "vertical", minHeight: 72, ...p.style }} />
  </div>
);

const Avatar = ({ initials, size = 38, color = C.pink }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: color + "22", border: `2px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: size * 0.33, color, flexShrink: 0 }}>{initials}</div>
);

const Badge = ({ children, color = C.pink }) => (
  <span style={{ background: color + "22", color, borderRadius: 100, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{children}</span>
);

const Tab = ({ tabs, active, onChange }) => (
  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
    {tabs.map(([k, v]) => (
      <button key={k} onClick={() => onChange(k)} style={{
        padding: "8px 16px", borderRadius: 100, border: `1.5px solid ${active === k ? C.pink : C.border}`,
        background: active === k ? C.pink : "transparent", color: active === k ? C.black : C.textMuted,
        fontWeight: active === k ? 700 : 400, fontSize: 13, cursor: "pointer",
      }}>{v}</button>
    ))}
  </div>
);

const Spinner = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
    <div style={{ width: 32, height: 32, borderRadius: "50%", border: `3px solid ${C.border}`, borderTop: `3px solid ${C.pink}`, animation: "spin 0.8s linear infinite" }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const SESSION_OPTIONS = [
  { value: "done", label: "✅ Faite", color: C.green },
  { value: "rest", label: "😴 Jour de repos", color: C.blue },
  { value: "missed", label: "❌ Pas faite", color: C.red },
];
const sessionColor = v => SESSION_OPTIONS.find(o => o.value === v)?.color || C.textMuted;
const sessionLabel = v => SESSION_OPTIONS.find(o => o.value === v)?.label || "—";
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

// ── NOTIFICATIONS ─────────────────────────────────────────────────────────────
const scheduleNotification = () => {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const now = new Date();
  const target = new Date();
  target.setHours(20, 0, 0, 0);
  if (now >= target) target.setDate(target.getDate() + 1);
  const delay = target - now;
  setTimeout(() => {
    new Notification("process lab. 📋", {
      body: "N'oublie pas de remplir ton journal du jour !",
      icon: "/icon.png",
    });
    scheduleNotification(); // reschedule for next day
  }, delay);
};

const requestNotifications = async () => {
  if (!("Notification" in window)) {
    alert("Les notifications ne sont pas disponibles.\n\nAjoute l'app à ton écran d'accueil depuis Safari pour les activer.");
    return false;
  }
  if (Notification.permission === "granted") {
    scheduleNotification();
    return true;
  }
  const perm = await Notification.requestPermission();
  if (perm === "granted") {
    scheduleNotification();
    // Send immediate confirmation
    new Notification("process lab. ✅", { body: "Rappels activés ! Tu seras notifiée à 20h chaque soir.", icon: "/icon.png" });
    return true;
  }
  return false;
};

// ══════════════════════════════════════════════════════════════════════════════
// LOGIN
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
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: "'Helvetica Neue', Arial, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ marginBottom: 40 }}><Logo size={32} /></div>
      <div style={{ width: "100%", maxWidth: 380 }}>
        <h2 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 8px" }}>Connexion</h2>
        <p style={{ color: C.textMuted, fontSize: 14, marginBottom: 32, marginTop: 0 }}>Connecte-toi à ton espace Process Lab</p>
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
const EditClientModal = ({ client, onSave, onDelete, onClose }) => {
  const [form, setForm] = useState({
    name: client.name || "", goal: client.goal || "",
    sessions_per_week: client.sessions_per_week || 3,
    monthly_amount: client.monthly_amount || "",
    start_date: client.start_date || "", next_payment: client.next_payment || "",
    newPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const avatar = form.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    await onSave(client.id, { name: form.name, avatar, goal: form.goal, sessions_per_week: parseInt(form.sessions_per_week) || 3, monthly_amount: parseFloat(form.monthly_amount) || 0, start_date: form.start_date, next_payment: form.next_payment }, form.newPassword);
    setSaving(false); onClose();
  };

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    await onDelete(client.id, client.user_id);
    setDeleting(false); onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000c", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
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
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
            <Inp label="Nouveau mot de passe (optionnel)" type="text" placeholder="Laisser vide = pas de changement" value={form.newPassword} onChange={e => setForm({ ...form, newPassword: e.target.value })} />
          </div>
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
              <div style={{ background: C.red + "15", border: `1px solid ${C.red}44`, borderRadius: 10, padding: 14, marginBottom: 10, fontSize: 13, color: C.red, textAlign: "center" }}>
                ⚠️ Action irréversible. Toutes les données seront supprimées.
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <Btn variant="secondary" onClick={() => setConfirmDelete(false)} style={{ flex: 1 }}>Annuler</Btn>
                <Btn variant="danger" onClick={handleDelete} disabled={deleting} style={{ flex: 1, background: C.red, color: C.white, border: "none" }}>{deleting ? "Suppression..." : "Confirmer 🗑️"}</Btn>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// HOOKS
// ══════════════════════════════════════════════════════════════════════════════
const useClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetch = async () => {
    setLoading(true);
    const { data } = await supabase.from("clients").select("*").order("created_at");
    setClients(data || []); setLoading(false);
  };
  useEffect(() => { fetch(); }, []);
  const addClient = async (c) => { const { data } = await supabase.from("clients").insert([c]).select().single(); if (data) setClients(cl => [...cl, data]); return data; };
  const updateClient = async (id, patch) => { const { data } = await supabase.from("clients").update(patch).eq("id", id).select().single(); if (data) setClients(c => c.map(x => x.id === id ? data : x)); return data; };
  const deleteClient = async (id) => { await supabase.from("clients").delete().eq("id", id); setClients(c => c.filter(x => x.id !== id)); };
  return { clients, loading, addClient, updateClient, deleteClient, refresh: fetch };
};

const useWorkouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetch = async () => {
    setLoading(true);
    const { data: ws } = await supabase.from("workouts").select("*").order("created_at");
    if (!ws) { setLoading(false); return; }
    const { data: exs } = await supabase.from("exercises").select("*").order("position");
    setWorkouts(ws.map(w => ({ ...w, exercises: (exs || []).filter(e => e.workout_id === w.id) })));
    setLoading(false);
  };
  useEffect(() => { fetch(); }, []);
  const saveWorkout = async (workout) => {
    if (workout.id && workouts.find(w => w.id === workout.id)) {
      await supabase.from("workouts").update({ name: workout.name, description: workout.description }).eq("id", workout.id);
      await supabase.from("exercises").delete().eq("workout_id", workout.id);
    } else {
      const { data } = await supabase.from("workouts").insert([{ name: workout.name, description: workout.description }]).select().single();
      workout.id = data.id;
    }
    if (workout.exercises?.length) {
      await supabase.from("exercises").insert(workout.exercises.map((e, i) => ({ workout_id: workout.id, name: e.name, sets: e.sets, reps: e.reps, rest: e.rest, note: e.note, photo: e.photo, position: i, suggested_weight: e.suggested_weight, weight_type: e.weight_type })));
    }
    await fetch();
  };
  const deleteWorkout = async (id) => { await supabase.from("workouts").delete().eq("id", id); setWorkouts(w => w.filter(x => x.id !== id)); };
  return { workouts, loading, saveWorkout, deleteWorkout };
};

const useClientData = (clientId) => {
  const [entries, setEntries] = useState([]);
  const [weights, setWeights] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [assignedWorkouts, setAssignedWorkouts] = useState([]);
  const [progressPhotos, setProgressPhotos] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    if (!clientId) return;
    setLoading(true);
    const [e, w, m, cw, pp, pay] = await Promise.all([
      supabase.from("entries").select("*").eq("client_id", clientId).order("date", { ascending: false }),
      supabase.from("weights").select("*").eq("client_id", clientId).order("date"),
      supabase.from("measurements").select("*").eq("client_id", clientId).order("date"),
      supabase.from("client_workouts").select("*, workouts(*, exercises(*))").eq("client_id", clientId),
      supabase.from("progress_photos").select("*").eq("client_id", clientId).order("date", { ascending: false }),
      supabase.from("payments").select("*").eq("client_id", clientId).order("paid_date", { ascending: false }),
    ]);
    setEntries(e.data || []);
    setWeights(w.data || []);
    setMeasurements(m.data || []);
    setAssignedWorkouts((cw.data || []).map(x => ({ workout_id: x.workout_id, scheduled_date: x.scheduled_date, workout: x.workouts })));
    setProgressPhotos(pp.data || []);
    setPayments(pay.data || []);
    setLoading(false);
  };
  useEffect(() => { fetch(); }, [clientId]);

  const addEntry = async (entry) => {
    const { data } = await supabase.from("entries").insert([{ ...entry, client_id: clientId }]).select().single();
    if (data) { setEntries(e => [data, ...e]); if (entry.confirmed) await supabase.from("clients").update({ today_done: true }).eq("id", clientId); }
    return data;
  };
  const updateEntry = async (id, patch) => {
    const { data } = await supabase.from("entries").update(patch).eq("id", id).select().single();
    if (data) { setEntries(e => e.map(x => x.id === id ? data : x)); if (patch.confirmed) await supabase.from("clients").update({ today_done: true }).eq("id", clientId); }
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

  return { entries, weights, measurements, assignedWorkouts, progressPhotos, payments, loading, addEntry, updateEntry, addWeight, addMeasurement, toggleWorkout, updateScheduledDate, addProgressPhoto, addPayment, refresh: fetch };
};

// ══════════════════════════════════════════════════════════════════════════════
// JOURNAL FORM — used for both create and edit
// ══════════════════════════════════════════════════════════════════════════════
const JournalForm = ({ existing, onSave, onBack, clientId }) => {
  const isConfirmed = existing?.confirmed;

  const [feeling, setFeeling] = useState(existing?.feeling || null);
  const [steps, setSteps] = useState(existing?.steps?.toString() || "");
  const [mealNote, setMealNote] = useState(existing?.meal_note || "");
  const [photos, setPhotos] = useState(existing?.photos || []);
  const [sessionStatus, setSessionStatus] = useState(existing?.session_status || null);
  const [sessionNote, setSessionNote] = useState(existing?.session_note || "");
  const [hydration, setHydration] = useState(existing?.hydration?.toString() || "");
  const [sleepHours, setSleepHours] = useState(existing?.sleep_hours?.toString() || "");
  const [nap, setNap] = useState(existing?.nap ?? null);
  const [hadDifficulty, setHadDifficulty] = useState(existing?.had_difficulty ?? null);
  const [difficultyNote, setDifficultyNote] = useState(existing?.difficulty_note || "");
  const [saving, setSaving] = useState(false);

  const canSubmit = feeling && steps && mealNote && sessionStatus !== null && hydration && sleepHours && nap !== null && hadDifficulty !== null;

  const handlePhoto = e => {
    Array.from(e.target.files).forEach(file => {
      const r = new FileReader();
      r.onload = ev => setPhotos(p => [...p, ev.target.result]);
      r.readAsDataURL(file);
    });
  };

  const buildPayload = (confirmed) => ({
    date: today,
    steps: parseInt(steps),
    feeling,
    meal_note: mealNote,
    session_status: sessionStatus,
    session_note: sessionNote,
    hydration: parseFloat(hydration),
    sleep_hours: parseFloat(sleepHours),
    nap,
    had_difficulty: hadDifficulty,
    difficulty_note: difficultyNote,
    confirmed,
  });

  const handleSaveDraft = async () => {
    setSaving(true);
    await onSave(buildPayload(false), false);
    setSaving(false);
    onBack();
  };

  const handleConfirm = async () => {
    if (!canSubmit) return;
    setSaving(true);
    await onSave(buildPayload(true), true);
    setSaving(false);
    onBack();
  };

  if (isConfirmed) return (
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: "'Helvetica Neue', Arial, sans-serif", padding: 20 }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 14, marginBottom: 18, padding: 0 }}>← Retour</button>
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>✅</div>
        <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>Journal confirmé !</h2>
        <p style={{ color: C.textMuted }}>Ton journal du jour a été validé définitivement.</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: "'Helvetica Neue', Arial, sans-serif", padding: 20 }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 14, marginBottom: 18, padding: 0 }}>← Retour</button>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, margin: 0 }}>Journal du jour</h2>
        {existing && !existing.confirmed && <Badge color={C.blue}>📝 Brouillon</Badge>}
      </div>
      <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 24, marginTop: 4 }}>{new Date(today).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</p>

      {existing && !existing.confirmed && (
        <div style={{ background: C.blue + "15", border: `1px solid ${C.blue}44`, borderRadius: 12, padding: 14, marginBottom: 20, fontSize: 13, color: C.blue }}>
          💡 Tu peux modifier ton journal au fur et à mesure. N'oublie pas de le <strong>confirmer le soir</strong> pour valider définitivement.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Feeling */}
        <div>
          <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Comment tu te sens ?</div>
          <div style={{ display: "flex", gap: 8 }}>{feelings.map((f, i) => <button key={i} onClick={() => setFeeling(i + 1)} style={{ flex: 1, padding: "12px 0", background: feeling === i + 1 ? C.pink + "22" : "#111", border: `2px solid ${feeling === i + 1 ? C.pink : C.border}`, borderRadius: 12, fontSize: 22, cursor: "pointer" }}>{f}</button>)}</div>
          {feeling && <div style={{ textAlign: "center", fontSize: 12, color: C.textMuted, marginTop: 6 }}>{feelingLabels[feeling - 1]}</div>}
        </div>

        {/* Steps */}
        <Inp label="Nombre de pas" type="number" inputMode="numeric" placeholder="ex: 9500" value={steps} onChange={e => setSteps(e.target.value)} />

        {/* Hydration */}
        <div>
          <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>💧 Hydratation (hors thé & café)</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{["0.5", "1", "1.5", "2", "2.5", "3+"].map(v => <button key={v} onClick={() => setHydration(v === "3+" ? "3" : v)} style={{ padding: "10px 16px", borderRadius: 12, border: `2px solid ${hydration === (v === "3+" ? "3" : v) ? C.blue : C.border}`, background: hydration === (v === "3+" ? "3" : v) ? C.blue + "22" : "#111", color: hydration === (v === "3+" ? "3" : v) ? C.blue : C.textMuted, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>{v} L</button>)}</div>
        </div>

        {/* Sleep */}
        <div>
          <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>😴 Heures de sommeil</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>{["5", "6", "7", "8", "9", "10+"].map(v => <button key={v} onClick={() => setSleepHours(v === "10+" ? "10" : v)} style={{ padding: "10px 16px", borderRadius: 12, border: `2px solid ${sleepHours === (v === "10+" ? "10" : v) ? C.purple : C.border}`, background: sleepHours === (v === "10+" ? "10" : v) ? C.purple + "22" : "#111", color: sleepHours === (v === "10+" ? "10" : v) ? C.purple : C.textMuted, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>{v}h</button>)}</div>
          <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Sieste ?</div>
          <div style={{ display: "flex", gap: 10 }}>{[true, false].map(val => <button key={String(val)} onClick={() => setNap(val)} style={{ flex: 1, padding: 12, borderRadius: 12, border: `2px solid ${nap === val ? C.purple : C.border}`, background: nap === val ? C.purple + "22" : "#111", color: nap === val ? C.purple : C.textMuted, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>{val ? "😴 Oui" : "❌ Non"}</button>)}</div>
        </div>

        {/* Meals + Photos */}
        <div>
          <TA label="Mes repas du jour" placeholder="Décris ce que tu as mangé..." value={mealNote} onChange={e => setMealNote(e.target.value)} />
          <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "#111", border: `1px dashed ${C.pink}55`, borderRadius: 10, cursor: "pointer", marginTop: 10 }}>
            <span style={{ fontSize: 20 }}>📷</span>
            <div>
              <div style={{ fontSize: 13, color: C.white, fontWeight: 600 }}>Ajouter des photos repas</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>Pellicule ou appareil photo</div>
            </div>
            {/* NO capture attribute = user can choose between gallery and camera */}
            <input type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handlePhoto} />
          </label>
          {photos.length > 0 && (
            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              {photos.map((p, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img src={p} alt="" style={{ width: 68, height: 68, objectFit: "cover", borderRadius: 10 }} />
                  <button onClick={() => setPhotos(photos.filter((_, j) => j !== i))} style={{ position: "absolute", top: -6, right: -6, background: C.red, border: "none", borderRadius: "50%", width: 18, height: 18, color: "white", fontSize: 10, cursor: "pointer" }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Session */}
        <div>
          <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Séance du jour</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{SESSION_OPTIONS.map(opt => <button key={opt.value} onClick={() => setSessionStatus(opt.value)} style={{ padding: 13, borderRadius: 12, border: `2px solid ${sessionStatus === opt.value ? opt.color : C.border}`, background: sessionStatus === opt.value ? opt.color + "22" : "#111", color: sessionStatus === opt.value ? opt.color : C.textMuted, fontWeight: 700, fontSize: 14, cursor: "pointer", textAlign: "left" }}>{opt.label}</button>)}</div>
          {sessionStatus === "done" && <div style={{ marginTop: 12 }}><TA label="Note (optionnel)" placeholder="Comment ça s'est passé ?" value={sessionNote} onChange={e => setSessionNote(e.target.value)} /></div>}
        </div>

        {/* Difficulty */}
        <div>
          <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>⚠️ As-tu rencontré une difficulté ?</div>
          <div style={{ display: "flex", gap: 10, marginBottom: hadDifficulty ? 12 : 0 }}>{[true, false].map(val => <button key={String(val)} onClick={() => setHadDifficulty(val)} style={{ flex: 1, padding: 13, borderRadius: 12, border: `2px solid ${hadDifficulty === val ? (val ? C.orange : C.green) : C.border}`, background: hadDifficulty === val ? (val ? C.orange + "22" : C.green + "22") : "#111", color: hadDifficulty === val ? (val ? C.orange : C.green) : C.textMuted, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>{val ? "⚠️ Oui" : "✅ Non"}</button>)}</div>
          {hadDifficulty && <TA label="Décris la difficulté" placeholder="Ex: j'ai craqué le soir..." value={difficultyNote} onChange={e => setDifficultyNote(e.target.value)} />}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 30 }}>
          <Btn variant="draft" onClick={handleSaveDraft} disabled={saving || !steps}>
            {saving ? "Enregistrement..." : "💾 Enregistrer en brouillon"}
          </Btn>
          <Btn onClick={handleConfirm} disabled={!canSubmit || saving}>
            {saving ? "Confirmation..." : "✅ Confirmer mon journal définitivement"}
          </Btn>
          <div style={{ fontSize: 12, color: C.textMuted, textAlign: "center" }}>
            ⚠️ Une fois confirmé, le journal ne pourra plus être modifié.
          </div>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// WORKOUT BUILDER
// ══════════════════════════════════════════════════════════════════════════════
const WorkoutBuilder = ({ workout, onSave, onCancel }) => {
  const [name, setName] = useState(workout?.name || "");
  const [desc, setDesc] = useState(workout?.description || "");
  const [exercises, setExercises] = useState(workout?.exercises || []);
  const [saving, setSaving] = useState(false);

  const addEx = () => setExercises([...exercises, { id: Date.now().toString(), name: "", sets: 3, reps: "12", rest: 60, note: "", photo: null, suggested_weight: "", weight_type: "haltères" }]);
  const updEx = (id, patch) => setExercises(exercises.map(e => e.id === id ? { ...e, ...patch } : e));
  const delEx = id => setExercises(exercises.filter(e => e.id !== id));
  const moveEx = (id, dir) => {
    const i = exercises.findIndex(e => e.id === id);
    if ((dir === -1 && i === 0) || (dir === 1 && i === exercises.length - 1)) return;
    const arr = [...exercises]; [arr[i], arr[i + dir]] = [arr[i + dir], arr[i]]; setExercises(arr);
  };
  const handlePhoto = (id, e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => updEx(id, { photo: ev.target.result });
    reader.readAsDataURL(file);
  };
  const handleSave = async () => {
    if (!name.trim()) return alert("Donne un nom à la séance");
    setSaving(true);
    await onSave({ id: workout?.id, name, description: desc, exercises });
    setSaving(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button onClick={onCancel} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 20, padding: 0 }}>←</button>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>{workout ? "Modifier" : "Nouvelle séance"}</h2>
      </div>
      <Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Inp label="Nom de la séance" placeholder="ex: Full Body A..." value={name} onChange={e => setName(e.target.value)} />
          <TA label="Description" placeholder="Objectif, durée..." value={desc} onChange={e => setDesc(e.target.value)} style={{ minHeight: 56 }} />
        </div>
      </Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>{exercises.length} exercice{exercises.length !== 1 ? "s" : ""}</span>
        <Btn small onClick={addEx} style={{ width: "auto" }}>+ Ajouter un exercice</Btn>
      </div>
      {exercises.map((ex, idx) => (
        <Card key={ex.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.pink + "22", border: `1.5px solid ${C.pink}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, color: C.pink }}>{idx + 1}</div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => moveEx(ex.id, -1)} style={{ background: "#222", border: "none", borderRadius: 6, width: 28, height: 28, color: C.textMuted, cursor: "pointer" }}>↑</button>
              <button onClick={() => moveEx(ex.id, 1)} style={{ background: "#222", border: "none", borderRadius: 6, width: 28, height: 28, color: C.textMuted, cursor: "pointer" }}>↓</button>
              <button onClick={() => delEx(ex.id)} style={{ background: C.red + "22", border: "none", borderRadius: 6, width: 28, height: 28, color: C.red, cursor: "pointer" }}>✕</button>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Inp label="Nom de l'exercice" placeholder="ex: Squat..." value={ex.name} onChange={e => updEx(ex.id, { name: e.target.value })} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              <Inp label="Séries" type="number" min="1" value={ex.sets} onChange={e => updEx(ex.id, { sets: parseInt(e.target.value) || 1 })} />
              <Inp label="Reps / Durée" placeholder="12 ou 45s" value={ex.reps} onChange={e => updEx(ex.id, { reps: e.target.value })} />
              <Inp label="Repos (sec)" type="number" value={ex.rest} onChange={e => updEx(ex.id, { rest: parseInt(e.target.value) || 0 })} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>⚖️ Poids suggéré</label>
              <div style={{ display: "flex", gap: 10 }}>
                <input type="text" placeholder="ex: 10" value={ex.suggested_weight || ""} onChange={e => updEx(ex.id, { suggested_weight: e.target.value })} style={{ ...inputSt, flex: 1 }} />
                <select value={ex.weight_type || "haltères"} onChange={e => updEx(ex.id, { weight_type: e.target.value })} style={{ ...inputSt, width: "auto", flex: 1 }}>
                  <option value="haltères">kg haltères</option>
                  <option value="disques">kg disques</option>
                  <option value="barre">kg barre</option>
                  <option value="poids du corps">poids du corps</option>
                  <option value="élastique">élastique</option>
                  <option value="machine">machine (kg)</option>
                </select>
              </div>
            </div>
            <TA label="Consigne" placeholder="Ex: descends bien..." value={ex.note} onChange={e => updEx(ex.id, { note: e.target.value })} style={{ minHeight: 56 }} />
            <div>
              <label style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Photo</label>
              {ex.photo ? (
                <div style={{ position: "relative", display: "inline-block" }}>
                  <img src={ex.photo} alt="" style={{ width: 120, height: 90, objectFit: "cover", borderRadius: 10 }} />
                  <button onClick={() => updEx(ex.id, { photo: null })} style={{ position: "absolute", top: -8, right: -8, background: C.red, border: "none", borderRadius: "50%", width: 20, height: 20, color: "white", fontSize: 11, cursor: "pointer" }}>✕</button>
                </div>
              ) : (
                <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#111", border: `1px dashed ${C.border}`, borderRadius: 10, cursor: "pointer" }}>
                  <span>🖼️</span><span style={{ fontSize: 13, color: C.textMuted }}>Ajouter une photo</span>
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => handlePhoto(ex.id, e)} />
                </label>
              )}
            </div>
          </div>
        </Card>
      ))}
      {exercises.length === 0 && <div style={{ textAlign: "center", padding: "30px 0", color: C.textMuted }}>Clique sur "+ Ajouter un exercice" pour commencer</div>}
      <div style={{ display: "flex", gap: 10, paddingBottom: 30 }}>
        <Btn variant="secondary" onClick={onCancel} style={{ flex: 1 }}>Annuler</Btn>
        <Btn onClick={handleSave} disabled={saving} style={{ flex: 2 }}>{saving ? "Enregistrement..." : "💾 Enregistrer"}</Btn>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// WORKOUT PLAYER
// ══════════════════════════════════════════════════════════════════════════════
const WorkoutPlayer = ({ workout, onFinish, clientId }) => {
  const [currentEx, setCurrentEx] = useState(0);
  const [completedSets, setCompletedSets] = useState({});
  const [resting, setResting] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [done, setDone] = useState(false);
  const [exLogs, setExLogs] = useState({});
  const [showLog, setShowLog] = useState(false);
  const [globalNote, setGlobalNote] = useState("");
  const timerRef = useRef(null);

  const ex = workout.exercises[currentEx];
  const doneSets = completedSets[ex?.id] || 0;
  const totalExDone = workout.exercises.filter(e => (completedSets[e.id] || 0) >= e.sets).length;

  useEffect(() => () => clearInterval(timerRef.current), []);

  const startRest = secs => {
    setResting(true); setRestTime(secs);
    timerRef.current = setInterval(() => {
      setRestTime(t => { if (t <= 1) { clearInterval(timerRef.current); setResting(false); return 0; } return t - 1; });
    }, 1000);
  };

  const completeSet = () => {
    const newDone = doneSets + 1;
    setCompletedSets({ ...completedSets, [ex.id]: newDone });
    if (newDone < ex.sets) { startRest(ex.rest); }
    else { setShowLog(true); }
  };

  const confirmExercise = () => {
    setShowLog(false);
    const nextIdx = currentEx + 1;
    if (nextIdx < workout.exercises.length) { setTimeout(() => { setCurrentEx(nextIdx); startRest(ex.rest); }, 400); }
    else { setTimeout(() => setDone(true), 600); }
  };

  const saveAndFinish = async () => {
    if (clientId) {
      const logsWithNames = {};
      workout.exercises.forEach(e => {
        logsWithNames[e.id] = { name: e.name, suggested_weight: e.suggested_weight, weight_type: e.weight_type, weight: exLogs[e.id]?.weight || "", reps: exLogs[e.id]?.reps || "" };
      });
      await supabase.from("session_logs").insert([{ client_id: clientId, workout_id: workout.id, workout_name: workout.name, date: today, exercise_logs: JSON.stringify(logsWithNames), note: globalNote }]);
    }
    onFinish();
  };

  if (done) return (
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: "'Helvetica Neue', Arial, sans-serif", padding: 20 }}>
      <div style={{ textAlign: "center", paddingTop: 40, marginBottom: 32 }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>🏆</div>
        <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>Séance terminée !</h1>
        <p style={{ color: C.textMuted }}>{workout.name} · {workout.exercises.length} exercices</p>
      </div>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 12 }}>📝 NOTE SUR LA SÉANCE</div>
        <TA placeholder="Comment c'était ?" value={globalNote} onChange={e => setGlobalNote(e.target.value)} style={{ minHeight: 100 }} />
      </Card>
      <Card style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 16 }}>MES PERFORMANCES</div>
        {workout.exercises.map(ex => (
          <div key={ex.id} style={{ marginBottom: 18, paddingBottom: 18, borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 15 }}>{ex.name}</div>
            {ex.suggested_weight && <div style={{ fontSize: 12, color: C.orange, marginBottom: 8 }}>⚖️ Suggéré : {ex.suggested_weight} {ex.weight_type}</div>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div>
                <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>POIDS UTILISÉ</div>
                <input type="text" placeholder="ex: 10 kg" value={exLogs[ex.id]?.weight || ""} onChange={e => setExLogs({ ...exLogs, [ex.id]: { ...exLogs[ex.id], weight: e.target.value } })} style={{ ...inputSt, fontSize: 13 }} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>REPS RÉELLES</div>
                <input type="text" placeholder={`Prévu: ${ex.reps}`} value={exLogs[ex.id]?.reps || ""} onChange={e => setExLogs({ ...exLogs, [ex.id]: { ...exLogs[ex.id], reps: e.target.value } })} style={{ ...inputSt, fontSize: 13 }} />
              </div>
            </div>
          </div>
        ))}
      </Card>
      <Btn onClick={saveAndFinish} style={{ marginBottom: 30 }}>💾 Enregistrer et terminer</Btn>
    </div>
  );

  if (!ex) return null;

  return (
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={onFinish} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 14, padding: 0 }}>✕ Quitter</button>
        <span style={{ fontWeight: 700, fontSize: 14 }}>{workout.name}</span>
        <span style={{ fontSize: 13, color: C.pink, fontWeight: 700 }}>{currentEx + 1}/{workout.exercises.length}</span>
      </div>
      <div style={{ height: 3, background: C.border }}><div style={{ height: "100%", background: C.pink, width: `${(totalExDone / workout.exercises.length) * 100}%`, transition: "width .4s" }} /></div>
      <div style={{ padding: 20 }}>
        {resting && (
          <div style={{ background: C.surface, border: `1px solid ${C.orange}44`, borderRadius: 20, padding: 28, marginBottom: 20, textAlign: "center" }}>
            <div style={{ fontSize: 13, color: C.orange, fontWeight: 700, marginBottom: 8 }}>TEMPS DE REPOS</div>
            <div style={{ fontSize: 72, fontWeight: 900, color: C.orange, letterSpacing: "-2px" }}>{restTime}s</div>
            <Btn small variant="ghost" onClick={() => { clearInterval(timerRef.current); setResting(false); }} style={{ width: "auto", margin: "16px auto 0" }}>Passer →</Btn>
          </div>
        )}
        {showLog && (
          <Card style={{ marginBottom: 20, borderColor: C.green + "44" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.green, marginBottom: 14 }}>✅ {ex.name} terminé !</div>
            {ex.suggested_weight && <div style={{ fontSize: 12, color: C.orange, marginBottom: 10 }}>⚖️ Suggéré : {ex.suggested_weight} {ex.weight_type}</div>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>POIDS UTILISÉ</div>
                <input type="text" placeholder="ex: 10 kg" value={exLogs[ex.id]?.weight || ""} onChange={e => setExLogs({ ...exLogs, [ex.id]: { ...exLogs[ex.id], weight: e.target.value } })} style={{ ...inputSt, fontSize: 13 }} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>REPS RÉELLES</div>
                <input type="text" placeholder={ex.reps} value={exLogs[ex.id]?.reps || ""} onChange={e => setExLogs({ ...exLogs, [ex.id]: { ...exLogs[ex.id], reps: e.target.value } })} style={{ ...inputSt, fontSize: 13 }} />
              </div>
            </div>
            <Btn onClick={confirmExercise} style={{ fontSize: 14 }}>Continuer →</Btn>
          </Card>
        )}
        {!showLog && (
          <div>
            <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 6 }}>EXERCICE {currentEx + 1}</div>
            <h2 style={{ fontSize: 26, fontWeight: 900, margin: "0 0 10px" }}>{ex.name}</h2>
            {ex.photo && <img src={ex.photo} alt="" style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 14, marginBottom: 14 }} />}
            {ex.suggested_weight && <div style={{ background: C.orange + "15", border: `1px solid ${C.orange}44`, borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13 }}>⚖️ <span style={{ color: C.orange, fontWeight: 700 }}>Suggéré :</span> {ex.suggested_weight} {ex.weight_type}</div>}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 }}>
              {[{ l: "SÉRIES", v: `${doneSets}/${ex.sets}`, c: C.pink }, { l: "REPS", v: ex.reps, c: C.white }, { l: "REPOS", v: `${ex.rest}s`, c: C.orange }].map(s => (
                <div key={s.l} style={{ background: "#111", borderRadius: 12, padding: "12px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>{s.l}</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: s.c }}>{s.v}</div>
                </div>
              ))}
            </div>
            {ex.note && <div style={{ background: C.pink + "0f", border: `1px solid ${C.pink}33`, borderRadius: 12, padding: 14, marginBottom: 14, fontSize: 14, lineHeight: 1.5 }}>💡 {ex.note}</div>}
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              {Array.from({ length: ex.sets }, (_, i) => (
                <div key={i} style={{ width: 36, height: 36, borderRadius: "50%", background: i < doneSets ? C.green : i === doneSets ? C.pink + "22" : "#111", border: `2px solid ${i < doneSets ? C.green : i === doneSets ? C.pink : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: i < doneSets ? C.black : i === doneSets ? C.pink : C.textMuted }}>{i < doneSets ? "✓" : i + 1}</div>
              ))}
            </div>
            {!resting && doneSets < ex.sets && <Btn onClick={completeSet} style={{ fontSize: 17 }}>✅ Série {doneSets + 1} terminée !</Btn>}
          </div>
        )}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// PERF CARD
// ══════════════════════════════════════════════════════════════════════════════
const PerfCard = ({ log }) => {
  let exLogs = {};
  try { exLogs = JSON.parse(log.exercise_logs || "{}"); } catch {}
  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div><div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>{log.workout_name}</div><div style={{ fontSize: 12, color: C.textMuted }}>{formatDate(log.date)}</div></div>
        <Badge color={C.green}>✅ Réalisée</Badge>
      </div>
      {Object.values(exLogs).length > 0 && (
        <div style={{ marginBottom: log.note ? 14 : 0 }}>
          <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 10 }}>DÉTAIL DES EXERCICES</div>
          {Object.values(exLogs).map((exLog, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "#111", borderRadius: 10, marginBottom: 6 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{exLog.name || "Exercice"}</div>
                {exLog.suggested_weight && <div style={{ fontSize: 11, color: C.textMuted }}>Suggéré : {exLog.suggested_weight} {exLog.weight_type}</div>}
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                {exLog.weight && <div style={{ textAlign: "center" }}><div style={{ fontSize: 10, color: C.textMuted, marginBottom: 1 }}>POIDS</div><div style={{ fontWeight: 800, color: C.pink, fontSize: 14 }}>{exLog.weight}</div></div>}
                {exLog.reps && <div style={{ textAlign: "center" }}><div style={{ fontSize: 10, color: C.textMuted, marginBottom: 1 }}>REPS</div><div style={{ fontWeight: 800, color: C.purple, fontSize: 14 }}>{exLog.reps}</div></div>}
                {!exLog.weight && !exLog.reps && <div style={{ fontSize: 11, color: C.muted }}>—</div>}
              </div>
            </div>
          ))}
        </div>
      )}
      {log.note && <div style={{ background: C.pink + "15", borderRadius: 10, padding: 10, fontSize: 13, color: C.pink }}>💬 {log.note}</div>}
    </Card>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// ENTRY CARD (coach view)
// ══════════════════════════════════════════════════════════════════════════════
const EntryCard = ({ e }) => (
  <Card>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
      <span style={{ fontWeight: 700 }}>{new Date(e.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</span>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {e.confirmed ? <Badge color={C.green}>✅ Confirmé</Badge> : <Badge color={C.blue}>📝 Brouillon</Badge>}
        <span style={{ fontSize: 22 }}>{feelings[(e.feeling || 3) - 1]}</span>
      </div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
      <div style={{ background: "#111", borderRadius: 10, padding: 10 }}><div style={{ fontSize: 10, color: C.textMuted, marginBottom: 2 }}>PAS</div><div style={{ fontSize: 18, fontWeight: 900, color: C.pink }}>{(e.steps || 0).toLocaleString()}</div></div>
      <div style={{ background: "#111", borderRadius: 10, padding: 10 }}><div style={{ fontSize: 10, color: C.textMuted, marginBottom: 2 }}>SÉANCE</div><div style={{ fontWeight: 700, fontSize: 13, color: sessionColor(e.session_status) }}>{sessionLabel(e.session_status)}</div></div>
      <div style={{ background: "#111", borderRadius: 10, padding: 10 }}><div style={{ fontSize: 10, color: C.textMuted, marginBottom: 2 }}>HYDRATATION</div><div style={{ fontSize: 18, fontWeight: 900, color: C.blue }}>{e.hydration || "—"} L</div></div>
      <div style={{ background: "#111", borderRadius: 10, padding: 10 }}><div style={{ fontSize: 10, color: C.textMuted, marginBottom: 2 }}>SOMMEIL</div><div style={{ fontSize: 15, fontWeight: 700 }}>{e.sleep_hours || "—"}h {e.nap ? "· 😴" : ""}</div></div>
    </div>
    {e.meal_note && <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 8 }}><span style={{ color: C.white, fontWeight: 700 }}>Repas : </span>{e.meal_note}</div>}
    {e.had_difficulty && <div style={{ background: C.orange + "15", border: `1px solid ${C.orange}44`, borderRadius: 10, padding: 10, marginBottom: 8 }}><div style={{ fontSize: 11, color: C.orange, fontWeight: 700, marginBottom: 4 }}>⚠️ DIFFICULTÉ</div><div style={{ fontSize: 13 }}>{e.difficulty_note}</div></div>}
    {e.coach_message && <div style={{ background: C.pink + "15", borderRadius: 10, padding: 10, fontSize: 13, color: C.pink }}>💬 {e.coach_message}</div>}
  </Card>
);

// ══════════════════════════════════════════════════════════════════════════════
// PAYMENT HISTORY
// ══════════════════════════════════════════════════════════════════════════════
const PaymentHistory = ({ payments }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
    {payments.length === 0 && <p style={{ color: C.textMuted, textAlign: "center", margin: 0 }}>Aucun paiement enregistré.</p>}
    {payments.map((p, i) => (
      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "#111", borderRadius: 12 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: C.green }}>✅ {p.amount} €</div>
          <div style={{ fontSize: 12, color: C.textMuted }}>Reçu le {formatDate(p.paid_date)}</div>
          {p.note && <div style={{ fontSize: 12, color: C.textMuted }}>{p.note}</div>}
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: C.textMuted }}>Prochain</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.yellow }}>{formatDate(p.next_due_date)}</div>
        </div>
      </div>
    ))}
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// COACH APP
// ══════════════════════════════════════════════════════════════════════════════
const CoachApp = ({ user, onLogout }) => {
  const { clients, loading: loadingClients, addClient, updateClient, deleteClient } = useClients();
  const { workouts, loading: loadingWorkouts, saveWorkout, deleteWorkout } = useWorkouts();
  const [selected, setSelected] = useState(null);
  const [mainTab, setMainTab] = useState("dashboard");
  const [clientTab, setClientTab] = useState("journal");
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [buildingWorkout, setBuildingWorkout] = useState(false);
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

  const client = clients.find(c => c.id === selected);
  const { entries, weights, measurements, assignedWorkouts, progressPhotos, payments, loading: loadingData, addEntry, updateEntry, toggleWorkout, updateScheduledDate, addPayment } = useClientData(selected);
  const paymentAlerts = clients.filter(c => { const d = daysUntil(c.next_payment); return d >= 0 && d <= 5; });

  useEffect(() => {
    if (selected) {
      supabase.from("session_logs").select("*").eq("client_id", selected).order("date", { ascending: false }).then(({ data }) => setSessionLogs(data || []));
    }
  }, [selected]);

  const handleAddClient = async () => {
    if (!newClientForm.name || !newClientForm.email || !newClientForm.password) return alert("Remplis au minimum le nom, l'email et le mot de passe.");
    setAddingClient(true);
    const { data: authData, error: authErr } = await supabase.auth.signUp({ email: newClientForm.email, password: newClientForm.password });
    if (authErr) { alert("Erreur : " + authErr.message); setAddingClient(false); return; }
    const userId = authData.user?.id;
    const avatar = newClientForm.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    await addClient({ name: newClientForm.name, avatar, goal: newClientForm.goal, start_date: newClientForm.start_date, next_payment: newClientForm.next_payment, sessions_per_week: parseInt(newClientForm.sessions_per_week) || 3, monthly_amount: parseFloat(newClientForm.monthly_amount) || 0, streak: 0, today_done: false, user_id: userId });
    setAddingClient(false); setShowAddClient(false);
    setNewClientForm({ name: "", email: "", password: "", goal: "", start_date: "", next_payment: "", sessions_per_week: "3", monthly_amount: "" });
    alert(`✅ Compte créé !\n\nEnvoie ces infos :\nEmail : ${newClientForm.email}\nMot de passe : ${newClientForm.password}`);
  };

  const handleSaveClient = async (id, patch, newPassword) => {
    await updateClient(id, patch);
    alert("✅ Profil mis à jour !");
  };

  const handleDeleteClient = async (id) => {
    await deleteClient(id);
    setSelected(null); setMainTab("dashboard");
    alert("✅ Cliente supprimée.");
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
    else { await addEntry({ date: today, steps: 0, feeling: 3, meal_note: "", session_status: "rest", coach_message: msgText, confirmed: false }); }
    setMsgText(""); alert("✅ Message envoyé !");
  };

  if (buildingWorkout || editingWorkout) return (
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: "'Helvetica Neue', Arial, sans-serif", padding: 20 }}>
      <WorkoutBuilder workout={editingWorkout} onSave={async w => { await saveWorkout(w); setEditingWorkout(null); setBuildingWorkout(false); }} onCancel={() => { setEditingWorkout(null); setBuildingWorkout(false); }} />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: "'Helvetica Neue', Arial, sans-serif", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <Logo />
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: C.textMuted, background: C.card, padding: "4px 10px", borderRadius: 6 }}>Coach</span>
          <button onClick={onLogout} style={{ background: "none", border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 8, padding: "5px 12px", fontSize: 12, cursor: "pointer" }}>Déconnexion</button>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <div style={{ width: 220, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", overflowY: "auto" }}>
          {[["dashboard", "🏠", "Dashboard"], ["workouts", "💪", "Séances"]].map(([k, icon, label]) => (
            <button key={k} onClick={() => { setMainTab(k); setSelected(null); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 16px", background: mainTab === k && !selected ? C.pink + "15" : "transparent", borderLeft: `3px solid ${mainTab === k && !selected ? C.pink : "transparent"}`, border: "none", color: mainTab === k && !selected ? C.white : C.textMuted, cursor: "pointer", fontWeight: mainTab === k && !selected ? 700 : 400, fontSize: 14, textAlign: "left" }}>{icon} {label}</button>
          ))}
          <div style={{ padding: "10px 16px 6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Clientes</span>
            <button onClick={() => setShowAddClient(true)} style={{ background: C.pink, border: "none", color: C.black, borderRadius: 6, width: 20, height: 20, fontWeight: 900, fontSize: 14, cursor: "pointer" }}>+</button>
          </div>
          {loadingClients ? <Spinner /> : clients.map(c => (
            <div key={c.id} onClick={() => { setSelected(c.id); setMainTab("client"); setClientTab("journal"); }} style={{ padding: "10px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, background: selected === c.id ? C.pink + "15" : "transparent", borderLeft: `3px solid ${selected === c.id ? C.pink : "transparent"}` }}>
              <div style={{ position: "relative" }}>
                <Avatar initials={c.avatar} size={30} color={c.today_done ? C.pink : C.muted} />
                <div style={{ position: "absolute", bottom: -1, right: -1, width: 8, height: 8, borderRadius: "50%", background: c.today_done ? C.green : C.red, border: `2px solid ${C.black}` }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div>
                <div style={{ fontSize: 10, color: daysUntil(c.next_payment) <= 3 ? C.yellow : C.textMuted }}>{daysUntil(c.next_payment) <= 5 ? `⚠️ J-${daysUntil(c.next_payment)}` : `🔥 ${c.streak}j`}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {mainTab === "dashboard" && !selected && (
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 20px" }}>Tableau de bord 👋</h1>
              {paymentAlerts.length > 0 && (
                <div style={{ background: C.yellow + "15", border: `1px solid ${C.yellow}44`, borderRadius: 12, padding: 16, marginBottom: 20 }}>
                  <div style={{ fontWeight: 700, color: C.yellow, marginBottom: 8, fontSize: 13 }}>⚠️ Paiements à venir</div>
                  {paymentAlerts.map(c => <div key={c.id} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}><span style={{ fontSize: 13 }}>{c.name} — {formatDate(c.next_payment)}</span><Badge color={C.yellow}>J-{daysUntil(c.next_payment)}</Badge></div>)}
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
                {[{ label: "Journal today", val: `${clients.filter(c => c.today_done).length}/${clients.length}`, color: C.pink }, { label: "Séances créées", val: workouts.length, color: C.orange }, { label: "Clientes actives", val: clients.length, color: C.green }].map(s => (
                  <Card key={s.label}><div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 6 }}>{s.label}</div><div style={{ fontSize: 28, fontWeight: 900, color: s.color }}>{s.val}</div></Card>
                ))}
              </div>
              <Card>
                <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 14 }}>JOURNAL DU JOUR</div>
                {clients.length === 0 && <p style={{ color: C.textMuted, textAlign: "center" }}>Aucune cliente. Clique sur "+" pour en ajouter une.</p>}
                {clients.map(c => (
                  <div key={c.id} onClick={() => { setSelected(c.id); setMainTab("client"); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: `1px solid ${C.border}`, cursor: "pointer" }}>
                    <Avatar initials={c.avatar} size={32} color={c.today_done ? C.pink : C.muted} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{c.name}</div>
                      {c.today_done ? <div style={{ fontSize: 12, color: C.textMuted }}>✅ Journal rempli</div> : <div style={{ fontSize: 12, color: C.red }}>Pas encore rempli</div>}
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          )}

          {mainTab === "workouts" && !selected && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h1 style={{ fontSize: 22, fontWeight: 900, margin: 0 }}>Mes séances 💪</h1>
                <Btn small onClick={() => setBuildingWorkout(true)} style={{ width: "auto" }}>+ Nouvelle séance</Btn>
              </div>
              {loadingWorkouts ? <Spinner /> : workouts.map(w => (
                <Card key={w.id} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div><div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>{w.name}</div>{w.description && <div style={{ fontSize: 13, color: C.textMuted }}>{w.description}</div>}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Btn small variant="secondary" onClick={() => setEditingWorkout(w)} style={{ width: "auto" }}>✏️</Btn>
                      <Btn small variant="danger" onClick={() => deleteWorkout(w.id)} style={{ width: "auto" }}>🗑️</Btn>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <Badge color={C.orange}>{w.exercises?.length || 0} exercices</Badge>
                    <Badge color={C.purple}>{w.exercises?.reduce((a, e) => a + e.sets, 0) || 0} séries</Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {mainTab === "client" && client && (
            <div>
              <button onClick={() => { setSelected(null); setMainTab("dashboard"); }} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 13, marginBottom: 18, padding: 0 }}>← Retour</button>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <Avatar initials={client.avatar} size={46} />
                <div style={{ flex: 1 }}>
                  <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 900 }}>{client.name}</h2>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <Badge>🔥 {client.streak}j</Badge>
                    {client.goal && <Badge color={C.purple}>{client.goal}</Badge>}
                    {client.next_payment && <Badge color={C.yellow}>💳 J-{daysUntil(client.next_payment)}</Badge>}
                  </div>
                </div>
                <button onClick={() => setEditingClient(client)} style={{ background: "#222", border: `1px solid ${C.border}`, color: C.white, borderRadius: 10, padding: "8px 14px", fontSize: 13, cursor: "pointer", fontWeight: 600, flexShrink: 0 }}>✏️ Modifier</button>
              </div>

              <Tab tabs={[["journal", "📋 Journal"], ["seances", "💪 Séances"], ["perf", "📊 Perfs"], ["body", "📏 Corps"], ["paiements", "💳 Paiements"], ["message", "💬 Message"]]} active={clientTab} onChange={setClientTab} />

              {clientTab === "journal" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {loadingData ? <Spinner /> : entries.length === 0 ? <Card><p style={{ color: C.textMuted, textAlign: "center", margin: 0 }}>Aucune entrée.</p></Card> : entries.map((e, i) => <EntryCard key={i} e={e} />)}
                </div>
              )}

              {clientTab === "seances" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {workouts.map(w => {
                    const assigned = assignedWorkouts.find(a => a.workout_id === w.id);
                    return (
                      <Card key={w.id} style={{ borderColor: assigned ? C.green + "44" : C.border }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: assigned ? 14 : 0 }}>
                          <div><div style={{ fontWeight: 800, fontSize: 15, marginBottom: 2 }}>{w.name}</div><div style={{ fontSize: 12, color: C.textMuted }}>{w.exercises?.length || 0} exercices</div></div>
                          <button onClick={() => toggleWorkout(w.id)} style={{ padding: "8px 16px", borderRadius: 100, fontWeight: 700, fontSize: 12, cursor: "pointer", background: assigned ? C.green + "22" : C.pink + "22", border: `1.5px solid ${assigned ? C.green : C.pink}`, color: assigned ? C.green : C.pink, flexShrink: 0 }}>
                            {assigned ? "✓ Assignée" : "+ Assigner"}
                          </button>
                        </div>
                        {assigned && (
                          <div>
                            <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>📅 Date prévue</div>
                            <input type="date" value={assigned.scheduled_date || ""} onChange={e => updateScheduledDate(w.id, e.target.value)} style={{ ...inputSt, fontSize: 14 }} />
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              )}

              {clientTab === "perf" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {sessionLogs.length === 0 ? <Card><p style={{ color: C.textMuted, textAlign: "center", margin: 0 }}>Aucune séance enregistrée.</p></Card> : sessionLogs.map((log, i) => <PerfCard key={i} log={log} />)}
                </div>
              )}

              {clientTab === "body" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {weights.length > 1 && (
                    <Card>
                      <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 14 }}>POIDS</div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                        {[{ l: "DÉPART", v: `${weights[0].value} kg`, c: C.white }, { l: "ACTUEL", v: `${weights[weights.length - 1].value} kg`, c: C.pink }, { l: "PERDU", v: `-${(weights[0].value - weights[weights.length - 1].value).toFixed(1)} kg`, c: C.green }].map(s => (
                          <div key={s.l} style={{ background: "#111", borderRadius: 10, padding: 12, textAlign: "center" }}><div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>{s.l}</div><div style={{ fontSize: 18, fontWeight: 900, color: s.c }}>{s.v}</div></div>
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
                  {weights.length <= 1 && progressPhotos.length === 0 && <Card><p style={{ color: C.textMuted, textAlign: "center", margin: 0 }}>Pas encore de données.</p></Card>}
                </div>
              )}

              {clientTab === "paiements" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <Card>
                    <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 14 }}>📋 CONTRAT</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <div style={{ background: "#111", borderRadius: 10, padding: 12 }}><div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>DÉBUT</div><div style={{ fontWeight: 700, fontSize: 13 }}>{formatDate(client.start_date)}</div></div>
                      <div style={{ background: "#111", borderRadius: 10, padding: 12 }}><div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>SÉANCES/SEMAINE</div><div style={{ fontWeight: 700, fontSize: 13 }}>{client.sessions_per_week || 3}x</div></div>
                      <div style={{ background: "#111", borderRadius: 10, padding: 12 }}><div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>MONTANT</div><div style={{ fontWeight: 700, fontSize: 18, color: C.green }}>{client.monthly_amount || "—"} €</div></div>
                      <div style={{ background: daysUntil(client.next_payment) <= 3 ? C.yellow + "15" : "#111", borderRadius: 10, padding: 12 }}><div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>PROCHAIN PAIEMENT</div><div style={{ fontWeight: 700, fontSize: 13, color: daysUntil(client.next_payment) <= 3 ? C.yellow : C.white }}>{formatDate(client.next_payment)}</div></div>
                    </div>
                  </Card>
                  {!showPaymentForm ? (
                    <Btn variant="green" onClick={() => setShowPaymentForm(true)}>✅ Enregistrer un paiement reçu</Btn>
                  ) : (
                    <Card style={{ borderColor: C.green + "44" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.green, marginBottom: 16 }}>✅ Nouveau paiement</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <Inp label="Montant (€)" type="number" placeholder={client.monthly_amount || "150"} value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} />
                        <Inp label="Date de réception" type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} />
                        <Inp label="Note (optionnel)" placeholder="Virement, espèces..." value={paymentNote} onChange={e => setPaymentNote(e.target.value)} />
                      </div>
                      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                        <Btn variant="secondary" onClick={() => setShowPaymentForm(false)} style={{ flex: 1 }}>Annuler</Btn>
                        <Btn variant="green" onClick={handleAddPayment} disabled={addingPayment} style={{ flex: 2 }}>{addingPayment ? "Enregistrement..." : "Confirmer ✅"}</Btn>
                      </div>
                      <div style={{ fontSize: 12, color: C.textMuted, marginTop: 10, textAlign: "center" }}>⚡ Prochain paiement fixé à J+28</div>
                    </Card>
                  )}
                  <Card>
                    <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 14 }}>HISTORIQUE DES PAIEMENTS</div>
                    <PaymentHistory payments={payments} />
                  </Card>
                </div>
              )}

              {clientTab === "message" && (
                <Card>
                  <TA label="Message pour la cliente" value={msgText} onChange={e => setMsgText(e.target.value)} placeholder={`Bravo ${client.name.split(" ")[0]} 💪`} style={{ minHeight: 120 }} />
                  <Btn onClick={handleSendMessage} style={{ marginTop: 14 }}>Envoyer ✉️</Btn>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>

      {showAddClient && (
        <div style={{ position: "fixed", inset: 0, background: "#000c", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 28, width: "100%", maxWidth: 420, maxHeight: "90vh", overflowY: "auto" }}>
            <h3 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 900 }}>Nouvelle cliente</h3>
            <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 20, marginTop: 0 }}>Un compte sera créé automatiquement.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Inp label="Nom complet" placeholder="Camille Rousseau" value={newClientForm.name} onChange={e => setNewClientForm({ ...newClientForm, name: e.target.value })} />
              <Inp label="Email" type="email" placeholder="camille@email.com" value={newClientForm.email} onChange={e => setNewClientForm({ ...newClientForm, email: e.target.value })} />
              <Inp label="Mot de passe temporaire" type="text" placeholder="ex: Processlab2025!" value={newClientForm.password} onChange={e => setNewClientForm({ ...newClientForm, password: e.target.value })} />
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

      {editingClient && (
        <EditClientModal
          client={editingClient}
          onSave={handleSaveClient}
          onDelete={handleDeleteClient}
          onClose={() => setEditingClient(null)}
        />
      )}
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
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [bodyTab, setBodyTab] = useState("weight");
  const [newWeight, setNewWeight] = useState("");
  const [newMeasure, setNewMeasure] = useState({ chest: "", waist: "", hips: "", thighs: "" });
  const [newPhotoNote, setNewPhotoNote] = useState("");
  const [notifEnabled, setNotifEnabled] = useState(typeof Notification !== "undefined" && Notification?.permission === "granted");

  useEffect(() => {
    supabase.from("clients").select("*").eq("user_id", user.id).single().then(({ data }) => {
      if (data) { setClientInfo(data); setClientId(data.id); }
    });
  }, [user.id]);

  const { entries, weights, measurements, assignedWorkouts, progressPhotos, payments, loading, addEntry, updateEntry, addWeight, addMeasurement, addProgressPhoto } = useClientData(clientId);
  const { workouts } = useWorkouts();

  const myWorkouts = workouts.filter(w => assignedWorkouts.find(a => a.workout_id === w.id));
  const todayEntry = entries.find(e => e.date === today);
  const coachMsg = entries.find(e => e.coach_message)?.coach_message;
  const lastWeight = weights[weights.length - 1];
  const startWeight = weights[0];

  const handleSaveJournal = async (payload, confirmed) => {
    if (todayEntry) {
      await updateEntry(todayEntry.id, payload);
    } else {
      await addEntry(payload);
    }
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
    const granted = await requestNotifications();
    if (granted) { setNotifEnabled(true); }
    else { alert("Pour activer les notifications :\nRéglages → Notifications → Process Lab → Autoriser"); }
  };

  if (activeWorkout) return <WorkoutPlayer workout={activeWorkout} onFinish={() => setActiveWorkout(null)} clientId={clientId} />;

  // Show journal form
  if (screen === "journal") return (
    <JournalForm
      existing={todayEntry}
      onSave={handleSaveJournal}
      onBack={() => setScreen("home")}
      clientId={clientId}
    />
  );

  if (!clientInfo) return <div style={{ minHeight: "100vh", background: C.black, display: "flex", alignItems: "center", justifyContent: "center" }}><Spinner /></div>;

  if (screen === "home") return (
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Logo />
        <button onClick={onLogout} style={{ background: "none", border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 8, padding: "5px 12px", fontSize: 12, cursor: "pointer" }}>Déconnexion</button>
      </div>
      <div style={{ padding: 20 }}>
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 13, color: C.pink, fontWeight: 700, marginBottom: 2 }}>Bonjour,</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, margin: "0 0 6px", letterSpacing: "-1px" }}>{clientInfo.name?.split(" ")[0]} 👋</h1>
          <Badge>🔥 {clientInfo.streak || 0} jours</Badge>
        </div>

        {!notifEnabled && (
          <div style={{ background: C.orange + "15", border: `1px solid ${C.orange}44`, borderRadius: 14, padding: 16, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div><div style={{ fontWeight: 700, fontSize: 13, color: C.orange }}>🔔 Active tes rappels</div><div style={{ fontSize: 12, color: C.textMuted }}>Rappel journal à 20h chaque soir</div></div>
            <button onClick={handleEnableNotifs} style={{ background: C.orange, border: "none", borderRadius: 8, padding: "8px 14px", fontWeight: 700, fontSize: 12, color: C.black, cursor: "pointer", flexShrink: 0 }}>Activer</button>
          </div>
        )}

        {coachMsg && <Card style={{ marginBottom: 14, borderColor: C.pink + "44", background: C.pink + "08" }}><div style={{ fontSize: 10, color: C.pink, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 6 }}>MESSAGE DE TON COACH</div><div style={{ fontSize: 14, lineHeight: 1.5 }}>{coachMsg}</div></Card>}

        {/* Journal card */}
        <Card style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10 }}>JOURNAL DU JOUR</div>
          {!todayEntry && (
            <><p style={{ color: C.textMuted, fontSize: 13, marginBottom: 12, marginTop: 0 }}>Tu n'as pas encore commencé ton journal.</p><Btn onClick={() => setScreen("journal")}>Commencer mon journal →</Btn></>
          )}
          {todayEntry && !todayEntry.confirmed && (
            <div>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 26 }}>{feelings[(todayEntry.feeling || 3) - 1]}</span>
                <div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 2 }}>
                    <Badge color={C.blue}>📝 Brouillon</Badge>
                  </div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>{(todayEntry.steps || 0).toLocaleString()} pas · {todayEntry.hydration}L · {todayEntry.sleep_hours}h</div>
                </div>
              </div>
              <Btn onClick={() => setScreen("journal")} style={{ fontSize: 14 }}>✏️ Modifier / Confirmer mon journal</Btn>
            </div>
          )}
          {todayEntry && todayEntry.confirmed && (
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 30 }}>{feelings[(todayEntry.feeling || 3) - 1]}</span>
              <div>
                <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 2 }}>
                  <Badge color={C.green}>✅ Confirmé</Badge>
                </div>
                <div style={{ fontSize: 12, color: C.textMuted }}>{(todayEntry.steps || 0).toLocaleString()} pas · {todayEntry.hydration}L · {todayEntry.sleep_hours}h</div>
              </div>
            </div>
          )}
        </Card>

        {myWorkouts.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10, textTransform: "uppercase" }}>💪 Mes entraînements</div>
            {myWorkouts.map(w => {
              const assignment = assignedWorkouts.find(a => a.workout_id === w.id);
              const scheduledDate = assignment?.scheduled_date;
              const isToday = scheduledDate === today;
              const isPast = scheduledDate && scheduledDate < today;
              return (
                <Card key={w.id} onClick={() => setActiveWorkout(w)} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 14, marginBottom: 10, borderColor: isToday ? C.orange + "66" : C.border }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: C.orange + "22", border: `1.5px solid ${isToday ? C.orange : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>💪</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 2 }}>{w.name}</div>
                    <div style={{ fontSize: 12, color: C.textMuted }}>{w.exercises?.length || 0} exercices</div>
                    {scheduledDate && <div style={{ fontSize: 11, color: isToday ? C.orange : isPast ? C.red : C.textMuted, fontWeight: isToday ? 700 : 400, marginTop: 2 }}>{isToday ? "📅 Prévue aujourd'hui !" : isPast ? `⚠️ Prévue le ${new Date(scheduledDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}` : `📅 ${new Date(scheduledDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}`}</div>}
                  </div>
                  <div style={{ color: C.orange, fontWeight: 700, fontSize: 13 }}>▶</div>
                </Card>
              );
            })}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <Card onClick={() => setScreen("body")} style={{ cursor: "pointer" }}><div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>POIDS</div><div style={{ fontSize: 22, fontWeight: 900, color: C.pink }}>{lastWeight ? `${lastWeight.value} kg` : "—"}</div>{startWeight && lastWeight && startWeight.value !== lastWeight.value && <div style={{ fontSize: 11, color: C.green }}>-{(startWeight.value - lastWeight.value).toFixed(1)} kg</div>}</Card>
          <Card onClick={() => setScreen("history")} style={{ cursor: "pointer" }}><div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>ENTRÉES</div><div style={{ fontSize: 22, fontWeight: 900, color: C.purple }}>{entries.length}</div><div style={{ fontSize: 11, color: C.textMuted }}>jours</div></Card>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="ghost" onClick={() => setScreen("history")} style={{ flex: 1 }}>📋 Historique</Btn>
          <Btn variant="ghost" onClick={() => setScreen("contrat")} style={{ flex: 1 }}>📄 Mon contrat</Btn>
        </div>
      </div>
    </div>
  );

  if (screen === "contrat") return (
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: "'Helvetica Neue', Arial, sans-serif", padding: 20 }}>
      <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 14, marginBottom: 18, padding: 0 }}>← Retour</button>
      <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 20 }}>Mon contrat 📄</h2>
      <Card style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 14 }}>MON ACCOMPAGNEMENT</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[{ label: "Date de début", val: formatDate(clientInfo.start_date), icon: "📅" }, { label: "Séances par semaine", val: `${clientInfo.sessions_per_week || 3} séances`, icon: "💪" }, { label: "Montant toutes les 4 semaines", val: `${clientInfo.monthly_amount || "—"} €`, icon: "💶" }, { label: "Prochain paiement", val: formatDate(clientInfo.next_payment), icon: "💳", highlight: daysUntil(clientInfo.next_payment) <= 7 }].map(item => (
            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: item.highlight ? C.yellow + "15" : "#111", borderRadius: 10, border: item.highlight ? `1px solid ${C.yellow}44` : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 18 }}>{item.icon}</span><span style={{ fontSize: 13, color: C.textMuted }}>{item.label}</span></div>
              <span style={{ fontWeight: 700, fontSize: 14, color: item.highlight ? C.yellow : C.white }}>{item.val}</span>
            </div>
          ))}
        </div>
      </Card>
      {daysUntil(clientInfo.next_payment) <= 7 && (
        <div style={{ background: C.yellow + "15", border: `1px solid ${C.yellow}44`, borderRadius: 14, padding: 16, marginBottom: 14 }}>
          <div style={{ fontWeight: 700, color: C.yellow, marginBottom: 4 }}>⚠️ Paiement à venir</div>
          <div style={{ fontSize: 13 }}>Ton prochain paiement de <strong>{clientInfo.monthly_amount} €</strong> est dû le <strong>{formatDate(clientInfo.next_payment)}</strong>.</div>
        </div>
      )}
      <Card><div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 14 }}>HISTORIQUE DES PAIEMENTS</div><PaymentHistory payments={payments} /></Card>
    </div>
  );

  if (screen === "body") return (
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: "'Helvetica Neue', Arial, sans-serif", padding: 20 }}>
      <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 14, marginBottom: 18, padding: 0 }}>← Retour</button>
      <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 20 }}>Mon suivi corps</h2>
      <Tab tabs={[["weight", "⚖️ Poids"], ["measures", "📏 Mensurations"], ["photos", "📸 Photos"]]} active={bodyTab} onChange={setBodyTab} />
      {bodyTab === "weight" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {weights.length > 1 && <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>{[{ l: "DÉPART", v: `${startWeight.value} kg`, c: C.white }, { l: "ACTUEL", v: `${lastWeight.value} kg`, c: C.pink }, { l: "PERDU", v: `-${(startWeight.value - lastWeight.value).toFixed(1)} kg`, c: C.green }].map(s => <Card key={s.l} style={{ padding: 14, textAlign: "center" }}><div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>{s.l}</div><div style={{ fontSize: 18, fontWeight: 900, color: s.c }}>{s.v}</div></Card>)}</div>}
          <Card><div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 12 }}>AJOUTER UN PESAGE</div><div style={{ display: "flex", gap: 10 }}><input type="number" step="0.1" placeholder="ex: 63.2 kg" value={newWeight} onChange={e => setNewWeight(e.target.value)} style={{ ...inputSt, flex: 1 }} /><button onClick={handleAddWeight} style={{ background: C.pink, border: "none", borderRadius: 10, padding: "11px 18px", fontWeight: 800, color: C.black, cursor: "pointer" }}>+</button></div></Card>
          {weights.length > 0 && <Card>{[...weights].reverse().map((w, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${C.border}`, fontSize: 13 }}><span style={{ color: C.textMuted }}>{formatDate(w.date)}</span><span style={{ fontWeight: 700 }}>{w.value} kg</span></div>)}</Card>}
        </div>
      )}
      {bodyTab === "measures" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {measurements.length >= 2 && (() => { const first = measurements[0], last = measurements[measurements.length - 1]; return <Card>{[["chest", "Poitrine"], ["waist", "Tour de taille"], ["hips", "Hanches"], ["thighs", "Cuisses"]].map(([k, label]) => { const diff = last[k] - first[k]; return <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}`, fontSize: 13 }}><span style={{ color: C.textMuted }}>{label}</span><span><strong>{last[k]} cm</strong> <span style={{ color: diff < 0 ? C.green : diff > 0 ? C.red : C.textMuted, fontSize: 11 }}>{diff < 0 ? diff : diff > 0 ? `+${diff}` : "—"} cm</span></span></div>; })}</Card>; })()}
          <Card><div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 12 }}>NOUVELLES MENSURATIONS</div><div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{[["chest", "Poitrine (cm)"], ["waist", "Tour de taille (cm)"], ["hips", "Hanches (cm)"], ["thighs", "Cuisses (cm)"]].map(([k, label]) => <input key={k} type="number" placeholder={label} value={newMeasure[k]} onChange={e => setNewMeasure({ ...newMeasure, [k]: e.target.value })} style={inputSt} />)}<Btn onClick={handleAddMeasure}>Enregistrer</Btn></div></Card>
        </div>
      )}
      {bodyTab === "photos" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Card>
            <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 12 }}>AJOUTER UNE PHOTO</div>
            <input type="text" placeholder="Note : ex: Semaine 4, de face" value={newPhotoNote} onChange={e => setNewPhotoNote(e.target.value)} style={{ ...inputSt, marginBottom: 10 }} />
            <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "#111", border: `1px dashed ${C.pink}55`, borderRadius: 10, cursor: "pointer" }}>
              <span style={{ fontSize: 20 }}>📸</span>
              <div><div style={{ fontSize: 13, color: C.white, fontWeight: 600 }}>Photo de progression</div><div style={{ fontSize: 11, color: C.textMuted }}>De face, de profil, de dos...</div></div>
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleAddProgressPhoto} />
            </label>
          </Card>
          {progressPhotos.length > 0 && <Card><div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 14 }}>MON ÉVOLUTION</div><div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>{progressPhotos.map((p, i) => <div key={i}><img src={p.photo} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 12, marginBottom: 4 }} /><div style={{ fontSize: 11, color: C.textMuted }}>{formatDate(p.date)}</div>{p.note && <div style={{ fontSize: 11, color: C.white }}>{p.note}</div>}</div>)}</div></Card>}
        </div>
      )}
    </div>
  );

  if (screen === "history") return (
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: "'Helvetica Neue', Arial, sans-serif", padding: 20 }}>
      <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 14, marginBottom: 18, padding: 0 }}>← Retour</button>
      <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 20 }}>Mon historique</h2>
      {loading ? <Spinner /> : entries.map((e, i) => (
        <Card key={i} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>{new Date(e.date).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}</span>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {e.confirmed ? <Badge color={C.green}>✅</Badge> : <Badge color={C.blue}>📝</Badge>}
              <span style={{ fontSize: 22 }}>{feelings[(e.feeling || 3) - 1]}</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            <div style={{ background: "#111", borderRadius: 8, padding: 8, textAlign: "center" }}><div style={{ fontSize: 9, color: C.textMuted }}>PAS</div><div style={{ fontWeight: 800, color: C.pink, fontSize: 13 }}>{(e.steps || 0).toLocaleString()}</div></div>
            <div style={{ background: "#111", borderRadius: 8, padding: 8, textAlign: "center" }}><div style={{ fontSize: 9, color: C.textMuted }}>SÉANCE</div><div style={{ fontWeight: 800, fontSize: 13, color: sessionColor(e.session_status) }}>{e.session_status === "done" ? "✅" : e.session_status === "rest" ? "😴" : "❌"}</div></div>
            <div style={{ background: "#111", borderRadius: 8, padding: 8, textAlign: "center" }}><div style={{ fontSize: 9, color: C.textMuted }}>EAU</div><div style={{ fontWeight: 800, color: C.blue, fontSize: 13 }}>{e.hydration}L</div></div>
            <div style={{ background: "#111", borderRadius: 8, padding: 8, textAlign: "center" }}><div style={{ fontSize: 9, color: C.textMuted }}>SOMMEIL</div><div style={{ fontWeight: 800, color: C.purple, fontSize: 13 }}>{e.sleep_hours}h</div></div>
          </div>
          {e.had_difficulty && <div style={{ background: C.orange + "15", borderRadius: 8, padding: 8, fontSize: 12, color: C.orange, marginTop: 8 }}>⚠️ {e.difficulty_note || "Difficulté signalée"}</div>}
        </Card>
      ))}
    </div>
  );

  return null;
};

// ══════════════════════════════════════════════════════════════════════════════
// ROOT
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
