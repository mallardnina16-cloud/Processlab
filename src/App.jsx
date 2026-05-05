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
    background: variant === "primary" ? C.pink : variant === "danger" ? C.red + "22" : variant === "ghost" ? "transparent" : variant === "green" ? C.green : "#222",
    color: variant === "primary" ? C.black : variant === "danger" ? C.red : variant === "green" ? C.black : C.white,
    border: variant === "ghost" ? `1px solid ${C.border}` : variant === "danger" ? `1px solid ${C.red}44` : "none",
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

const scheduleNotification = () => {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const now = new Date();
  const target = new Date();
  target.setHours(20, 0, 0, 0);
  if (now >= target) target.setDate(target.getDate() + 1);
  const delay = target - now;
  setTimeout(() => {
    new Notification("process lab. 📋", { body: "N'oublie pas de remplir ton journal du jour !", icon: "/icon.png" });
    scheduleNotification();
  }, delay);
};

const requestNotifications = async () => {
  if (!("Notification" in window)) { alert("Ajoute l'app à ton écran d'accueil depuis Safari pour activer les notifications."); return false; }
  if (Notification.permission === "granted") { scheduleNotification(); return true; }
  const perm = await Notification.requestPermission();
  if (perm === "granted") {
    scheduleNotification();
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
    calories_target: client.calories_target || "",
    protein_target: client.protein_target || "",
  });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const avatar = form.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    await onSave(client.id, { name: form.name, avatar, goal: form.goal, sessions_per_week: parseInt(form.sessions_per_week) || 3, monthly_amount: parseFloat(form.monthly_amount) || 0, start_date: form.start_date, next_payment: form.next_payment, calories_target: parseInt(form.calories_target) || 0, protein_target: parseInt(form.protein_target) || 0 });
    setSaving(false); onClose();
  };

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    await onDelete(client.id);
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
            <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 10, letterSpacing: "0.08em" }}>🍽️ OBJECTIFS NUTRITIONNELS</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Inp label="Calories / jour" type="number" placeholder="ex: 1800" value={form.calories_target} onChange={e => setForm({ ...form, calories_target: e.target.value })} />
              <Inp label="Protéines / jour (g)" type="number" placeholder="ex: 100" value={form.protein_target} onChange={e => setForm({ ...form, protein_target: e.target.value })} />
            </div>
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
              <div style={{ background: C.red + "15", border: `1px solid ${C.red}44`, borderRadius: 10, padding: 14, marginBottom: 10, fontSize: 13, color: C.red, textAlign: "center" }}>⚠️ Action irréversible. Toutes les données seront supprimées.</div>
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
  return { clients, loading, addClient, updateClient, deleteClient };
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
      await supabase.from("workouts").update({ name: workout.name, description: workout.description, blocks: workout.blocks || [] }).eq("id", workout.id);
      await supabase.from("exercises").delete().eq("workout_id", workout.id);
    } else {
      const { data } = await supabase.from("workouts").insert([{ name: workout.name, description: workout.description, blocks: workout.blocks || [] }]).select().single();
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
    // Clear immediately to avoid showing stale data from previous client
    setEntries([]);
    setWeights([]);
    setMeasurements([]);
    setAssignedWorkouts([]);
    setProgressPhotos([]);
    setPayments([]);
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
    if (data) { setEntries(e => [data, ...e]); await supabase.from("clients").update({ today_done: true }).eq("id", clientId); }
    return data;
  };
  const updateEntry = async (id, patch) => {
    const { data } = await supabase.from("entries").update(patch).eq("id", id).select().single();
    if (data) setEntries(e => e.map(x => x.id === id ? data : x));
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

  return { entries, weights, measurements, assignedWorkouts, progressPhotos, payments, loading, addEntry, updateEntry, addWeight, addMeasurement, toggleWorkout, updateScheduledDate, addProgressPhoto, addPayment };
};

// ══════════════════════════════════════════════════════════════════════════════
// JOURNAL FORM — allows selecting any past date
// ══════════════════════════════════════════════════════════════════════════════
const JournalForm = ({ entries, onSave, onBack, proteinTarget = 0, clientId }) => {
  const [selectedDate, setSelectedDate] = useState(today);
  const [feeling, setFeeling] = useState(null);
  const [steps, setSteps] = useState("");
  const [mealNote, setMealNote] = useState("");
  const [photos, setPhotos] = useState([]);
  const [sessionStatus, setSessionStatus] = useState(null);
  const [sessionNote, setSessionNote] = useState("");
  const [hydration, setHydration] = useState("");
  const [sleepHours, setSleepHours] = useState("");
  const [nap, setNap] = useState(null);
  const [hadDifficulty, setHadDifficulty] = useState(null);
  const [difficultyNote, setDifficultyNote] = useState("");
  const [proteinEstimate, setProteinEstimate] = useState("");
  const [saving, setSaving] = useState(false);

  const existing = entries.find(e => e.date === selectedDate) || null;

  // Pre-fill when date changes
  useEffect(() => {
    if (existing) {
      setFeeling(existing.feeling || null);
      setSteps(existing.steps?.toString() || "");
      setMealNote(existing.meal_note || "");
      setPhotos(existing.photos || []);
      setSessionStatus(existing.session_status || null);
      setSessionNote(existing.session_note || "");
      setHydration(existing.hydration?.toString() || "");
      setSleepHours(existing.sleep_hours?.toString() || "");
      setNap(existing.nap ?? null);
      setHadDifficulty(existing.had_difficulty ?? null);
      setDifficultyNote(existing.difficulty_note || "");
      setProteinEstimate(existing.protein_estimate || "");
    } else {
      setFeeling(null); setSteps(""); setMealNote(""); setPhotos([]);
      setSessionStatus(null); setSessionNote(""); setHydration("");
      setSleepHours(""); setNap(null); setHadDifficulty(null);
      setDifficultyNote(""); setProteinEstimate("");
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
            // Fallback to base64 if upload fails
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
    for (const file of files) {
      const result = await compressAndUpload(file);
      setPhotos(p => [...p, result]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave({
      date: selectedDate,
      steps: parseInt(steps) || 0,
      feeling: feeling || 3,
      meal_note: mealNote,
      photos: photos,
      session_status: sessionStatus || "rest",
      session_note: sessionNote,
      hydration: parseFloat(hydration) || 0,
      sleep_hours: parseFloat(sleepHours) || 0,
      nap: nap || false,
      had_difficulty: hadDifficulty || false,
      difficulty_note: difficultyNote,
      protein_estimate: proteinEstimate,
    });
    setSaving(false);
    onBack();
  };

  return (
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: "'Helvetica Neue', Arial, sans-serif", padding: 20 }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 14, marginBottom: 18, padding: 0 }}>← Retour</button>
      <h2 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 14px" }}>Mon journal 📋</h2>

      {/* Date selector */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>📅 Pour quel jour ?</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {Array.from({ length: 4 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().slice(0, 10);
            const label = i === 0 ? "Aujourd'hui" : i === 1 ? "Hier" : d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" });
            const hasEntry = entries.find(e => e.date === dateStr);
            return (
              <button key={dateStr} onClick={() => setSelectedDate(dateStr)} style={{ padding: "10px 16px", borderRadius: 12, border: `2px solid ${selectedDate === dateStr ? C.pink : C.border}`, background: selectedDate === dateStr ? C.pink + "22" : "#111", color: selectedDate === dateStr ? C.pink : C.textMuted, fontWeight: selectedDate === dateStr ? 700 : 400, fontSize: 13, cursor: "pointer", position: "relative" }}>
                {label}
                {hasEntry && <span style={{ position: "absolute", top: -4, right: -4, width: 8, height: 8, borderRadius: "50%", background: C.green, border: `2px solid ${C.black}` }} />}
              </button>
            );
          })}
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: C.textMuted }}>
          {new Date(selectedDate).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
          {existing && <span style={{ color: C.green, marginLeft: 8, fontWeight: 700 }}>· Déjà rempli ✅</span>}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Feeling */}
        <div>
          <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Comment tu te sens ?</div>
          <div style={{ display: "flex", gap: 8 }}>
            {feelings.map((f, i) => (
              <button key={i} onClick={() => setFeeling(i + 1)} style={{ flex: 1, padding: "12px 0", background: feeling === i + 1 ? C.pink + "22" : "#111", border: `2px solid ${feeling === i + 1 ? C.pink : C.border}`, borderRadius: 12, fontSize: 22, cursor: "pointer" }}>{f}</button>
            ))}
          </div>
          {feeling && <div style={{ textAlign: "center", fontSize: 12, color: C.textMuted, marginTop: 6 }}>{feelingLabels[feeling - 1]}</div>}
        </div>

        {/* Steps */}
        <Inp label="Nombre de pas" type="number" inputMode="numeric" placeholder="ex: 9500" value={steps} onChange={e => setSteps(e.target.value)} />

        {/* Hydration */}
        <div>
          <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>💧 Hydratation (hors thé & café)</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["0.5", "1", "1.5", "2", "2.5", "3+"].map(v => {
              const val = v === "3+" ? "3" : v;
              return <button key={v} onClick={() => setHydration(val)} style={{ padding: "10px 16px", borderRadius: 12, border: `2px solid ${hydration === val ? C.blue : C.border}`, background: hydration === val ? C.blue + "22" : "#111", color: hydration === val ? C.blue : C.textMuted, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>{v} L</button>;
            })}
          </div>
        </div>

        {/* Sleep */}
        <div>
          <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>😴 Heures de sommeil</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            {["5", "6", "7", "8", "9", "10+"].map(v => {
              const val = v === "10+" ? "10" : v;
              return <button key={v} onClick={() => setSleepHours(val)} style={{ padding: "10px 16px", borderRadius: 12, border: `2px solid ${sleepHours === val ? C.purple : C.border}`, background: sleepHours === val ? C.purple + "22" : "#111", color: sleepHours === val ? C.purple : C.textMuted, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>{v}h</button>;
            })}
          </div>
          <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Sieste ?</div>
          <div style={{ display: "flex", gap: 10 }}>
            {[true, false].map(val => (
              <button key={String(val)} onClick={() => setNap(val)} style={{ flex: 1, padding: 12, borderRadius: 12, border: `2px solid ${nap === val ? C.purple : C.border}`, background: nap === val ? C.purple + "22" : "#111", color: nap === val ? C.purple : C.textMuted, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>{val ? "😴 Oui" : "❌ Non"}</button>
            ))}
          </div>
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
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {SESSION_OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => setSessionStatus(opt.value)} style={{ padding: 13, borderRadius: 12, border: `2px solid ${sessionStatus === opt.value ? opt.color : C.border}`, background: sessionStatus === opt.value ? opt.color + "22" : "#111", color: sessionStatus === opt.value ? opt.color : C.textMuted, fontWeight: 700, fontSize: 14, cursor: "pointer", textAlign: "left" }}>{opt.label}</button>
            ))}
          </div>
          {sessionStatus === "done" && (
            <div style={{ marginTop: 12 }}>
              <TA label="Note (optionnel)" placeholder="Comment ça s'est passé ?" value={sessionNote} onChange={e => setSessionNote(e.target.value)} />
            </div>
          )}
        </div>

        {/* Difficulty */}
        <div>
          <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>⚠️ As-tu rencontré une difficulté ?</div>
          <div style={{ display: "flex", gap: 10, marginBottom: hadDifficulty ? 12 : 0 }}>
            {[true, false].map(val => (
              <button key={String(val)} onClick={() => setHadDifficulty(val)} style={{ flex: 1, padding: 13, borderRadius: 12, border: `2px solid ${hadDifficulty === val ? (val ? C.orange : C.green) : C.border}`, background: hadDifficulty === val ? (val ? C.orange + "22" : C.green + "22") : "#111", color: hadDifficulty === val ? (val ? C.orange : C.green) : C.textMuted, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>{val ? "⚠️ Oui" : "✅ Non"}</button>
            ))}
          </div>
          {hadDifficulty && (
            <TA label="Décris la difficulté" placeholder="Ex: j'ai craqué le soir..." value={difficultyNote} onChange={e => setDifficultyNote(e.target.value)} />
          )}
        </div>

        {/* Protein estimate */}
        {proteinTarget > 0 && (
          <div>
            <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>🥩 Objectif protéines</div>
            <div style={{ background: C.green + "12", border: `1px solid ${C.green}33`, borderRadius: 12, padding: "12px 14px", marginBottom: 12, fontSize: 13 }}>
              Tu vises <span style={{ color: C.green, fontWeight: 800 }}>{proteinTarget}g de protéines</span> aujourd'hui. Comment estimes-tu ta journée ?
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>Pense à : viande, poisson, œufs, fromage blanc, légumineuses...</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { value: "low", label: `😬 Moins de la moitié (<${Math.round(proteinTarget * 0.5)}g)`, color: C.red },
                { value: "medium", label: `😐 La moitié environ (${Math.round(proteinTarget * 0.5)}-${Math.round(proteinTarget * 0.75)}g)`, color: C.orange },
                { value: "good", label: `🙂 Presque l'objectif (${Math.round(proteinTarget * 0.75)}-${Math.round(proteinTarget * 0.9)}g)`, color: C.yellow },
                { value: "great", label: `💪 Objectif atteint ! (${Math.round(proteinTarget * 0.9)}g+)`, color: C.green },
              ].map(opt => (
                <button key={opt.value} onClick={() => setProteinEstimate(opt.value)} style={{ padding: "12px 14px", borderRadius: 12, border: `2px solid ${proteinEstimate === opt.value ? opt.color : C.border}`, background: proteinEstimate === opt.value ? opt.color + "22" : "#111", color: proteinEstimate === opt.value ? opt.color : C.textMuted, fontWeight: 700, fontSize: 13, cursor: "pointer", textAlign: "left" }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Single save button */}
        <Btn onClick={handleSave} disabled={saving} style={{ marginBottom: 30 }}>
          {saving ? "Enregistrement..." : existing ? "💾 Mettre à jour" : "💾 Enregistrer mon journal"}
        </Btn>

      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// WORKOUT BUILDER — supports simple exercises + circuit blocks
// ══════════════════════════════════════════════════════════════════════════════
const newSimpleEx = () => ({ id: Date.now().toString(), type: "exercise", name: "", sets: 3, reps: "12", rest: 60, note: "", photo: null, suggested_weight: "", weight_type: "haltères" });
const newCircuit = () => ({ id: Date.now().toString(), type: "circuit", rounds: 3, rest_between_rounds: 120, interval_mode: false, exercises: [{ id: Date.now().toString() + "a", name: "", reps: "12", work_time: 30, rest_time: 30, note: "", suggested_weight: "", weight_type: "haltères" }] });

const ExerciseFields = ({ ex, onChange, onDelete, showSets = true, intervalMode = false }) => {
  const handlePhoto = e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => onChange({ ...ex, photo: ev.target.result });
    reader.readAsDataURL(file);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}><Inp label="Nom de l'exercice" placeholder="ex: Squat..." value={ex.name} onChange={e => onChange({ ...ex, name: e.target.value })} /></div>
        <button onClick={onDelete} style={{ background: C.red + "22", border: "none", borderRadius: 6, width: 36, height: 42, color: C.red, cursor: "pointer", flexShrink: 0 }}>✕</button>
      </div>
      {showSets && !intervalMode && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <Inp label="Séries" type="number" min="1" value={ex.sets || 3} onChange={e => onChange({ ...ex, sets: parseInt(e.target.value) || 1 })} />
          <Inp label="Reps / Durée" placeholder="12 ou 45s" value={ex.reps || ""} onChange={e => onChange({ ...ex, reps: e.target.value })} />
          <Inp label="Repos (sec)" type="number" value={ex.rest || 60} onChange={e => onChange({ ...ex, rest: parseInt(e.target.value) || 0 })} />
        </div>
      )}
      {!showSets && !intervalMode && (
        <Inp label="Reps" placeholder="ex: 12 ou 30 sec" value={ex.reps || ""} onChange={e => onChange({ ...ex, reps: e.target.value })} />
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
          </select>
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
          <label style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "#111", border: `1px dashed ${C.border}`, borderRadius: 10, cursor: "pointer", width: "fit-content" }}>
            <span>🖼️</span><span style={{ fontSize: 13, color: C.textMuted }}>Photo du mouvement</span>
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhoto} />
          </label>
        )}
      </div>
    </div>
  );
};

const WorkoutBuilder = ({ workout, onSave, onCancel }) => {
  const [name, setName] = useState(workout?.name || "");
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
  const addCircuitEx = cid => setBlocks(b => b.map(x => x.id === cid ? { ...x, exercises: [...x.exercises, { id: Date.now().toString(), name: "", reps: "12", work_time: 30, rest_time: 30, note: "", suggested_weight: "", weight_type: "haltères" }] } : x));
  const delCircuitEx = (cid, eid) => setBlocks(b => b.map(x => x.id === cid ? { ...x, exercises: x.exercises.filter(e => e.id !== eid) } : x));

  const handleSave = async () => {
    if (!name.trim()) return alert("Donne un nom à la séance");
    setSaving(true);
    const allEx = blocks.flatMap(b => b.type === "circuit" ? b.exercises.map(e => ({ ...e, type: "exercise", sets: b.rounds, rest: b.rest_between_rounds })) : [b]);
    await onSave({ id: workout?.id, name, description: desc, exercises: allEx, blocks });
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

      {blocks.map((block, idx) => (
        block.type === "exercise" ? (
          <Card key={block.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: C.pink + "22", border: `1.5px solid ${C.pink}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: C.pink }}>{idx + 1}</div>
                <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 700 }}>EXERCICE</span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => moveBlock(block.id, -1)} style={{ background: "#222", border: "none", borderRadius: 6, width: 26, height: 26, color: C.textMuted, cursor: "pointer" }}>↑</button>
                <button onClick={() => moveBlock(block.id, 1)} style={{ background: "#222", border: "none", borderRadius: 6, width: 26, height: 26, color: C.textMuted, cursor: "pointer" }}>↓</button>
                <button onClick={() => delBlock(block.id)} style={{ background: C.red + "22", border: "none", borderRadius: 6, width: 26, height: 26, color: C.red, cursor: "pointer" }}>✕</button>
              </div>
            </div>
            <ExerciseFields ex={block} onChange={patch => updBlock(block.id, patch)} onDelete={() => delBlock(block.id)} showSets={true} />
          </Card>
        ) : (
          <Card key={block.id} style={{ borderColor: C.purple + "55", background: C.purple + "08" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: C.purple + "22", border: `1.5px solid ${C.purple}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: C.purple }}>{idx + 1}</div>
                <span style={{ fontSize: 11, color: C.purple, fontWeight: 700 }}>🔄 CIRCUIT</span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => moveBlock(block.id, -1)} style={{ background: "#222", border: "none", borderRadius: 6, width: 26, height: 26, color: C.textMuted, cursor: "pointer" }}>↑</button>
                <button onClick={() => moveBlock(block.id, 1)} style={{ background: "#222", border: "none", borderRadius: 6, width: 26, height: 26, color: C.textMuted, cursor: "pointer" }}>↓</button>
                <button onClick={() => delBlock(block.id)} style={{ background: C.red + "22", border: "none", borderRadius: 6, width: 26, height: 26, color: C.red, cursor: "pointer" }}>✕</button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              <Inp label="Nombre de tours" type="number" min="1" value={block.rounds || 3} onChange={e => updBlock(block.id, { rounds: parseInt(e.target.value) || 1 })} />
              <Inp label="Repos entre tours (sec)" type="number" value={block.rest_between_rounds || 120} onChange={e => updBlock(block.id, { rest_between_rounds: parseInt(e.target.value) || 60 })} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, padding: "10px 14px", background: block.interval_mode ? C.orange + "15" : "#111", borderRadius: 10, border: `1px solid ${block.interval_mode ? C.orange + "44" : C.border}` }}>
              <button onClick={() => updBlock(block.id, { interval_mode: !block.interval_mode })} style={{ width: 44, height: 24, borderRadius: 12, background: block.interval_mode ? C.orange : "#333", border: "none", cursor: "pointer", position: "relative" }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.white, position: "absolute", top: 3, left: block.interval_mode ? 23 : 3, transition: "all .2s" }} />
              </button>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: block.interval_mode ? C.orange : C.white }}>⚡ Mode Interval Training</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>Timer travail / repos pour chaque exo</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {block.exercises.map((ex, ei) => (
                <div key={ex.id} style={{ background: "#111", borderRadius: 12, padding: 14, border: `1px solid ${C.purple}33` }}>
                  <div style={{ fontSize: 11, color: C.purple, fontWeight: 700, marginBottom: 10 }}>Exo {ei + 1}</div>
                  <ExerciseFields ex={ex} onChange={patch => updCircuitEx(block.id, ex.id, patch)} onDelete={() => delCircuitEx(block.id, ex.id)} showSets={false} intervalMode={block.interval_mode} />
                </div>
              ))}
              <button onClick={() => addCircuitEx(block.id)} style={{ padding: "10px", borderRadius: 10, border: `1.5px dashed ${C.purple}55`, background: "transparent", color: C.purple, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                + Ajouter un exercice au circuit
              </button>
            </div>
          </Card>
        )
      ))}

      {blocks.length === 0 && <div style={{ textAlign: "center", padding: "20px 0", color: C.textMuted }}>Ajoute des exercices ou un circuit ci-dessous</div>}

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={addSimple} style={{ flex: 1, padding: "12px", borderRadius: 12, border: `1.5px dashed ${C.pink}55`, background: "transparent", color: C.pink, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>+ Exercice simple</button>
        <button onClick={addCircuit} style={{ flex: 1, padding: "12px", borderRadius: 12, border: `1.5px dashed ${C.purple}55`, background: "transparent", color: C.purple, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>🔄 + Circuit</button>
      </div>

      <div style={{ display: "flex", gap: 10, paddingBottom: 30 }}>
        <Btn variant="secondary" onClick={onCancel} style={{ flex: 1 }}>Annuler</Btn>
        <Btn onClick={handleSave} disabled={saving} style={{ flex: 2 }}>{saving ? "Enregistrement..." : "💾 Enregistrer"}</Btn>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// WORKOUT PLAYER — supports simple exercises + circuit blocks
// ══════════════════════════════════════════════════════════════════════════════
const WorkoutPlayer = ({ workout, onFinish, clientId, sessionLogs = [] }) => {
  const blocks = (workout.blocks && workout.blocks.length > 0) ? workout.blocks : workout.exercises.map(e => ({ ...e, type: e.type || "exercise" }));
  const [blockIdx, setBlockIdx] = useState(0);
  const [resting, setResting] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [restLabel, setRestLabel] = useState("REPOS");
  const [done, setDone] = useState(false);
  const [exLogs, setExLogs] = useState({});
  const [globalNote, setGlobalNote] = useState("");
  const [simpleSets, setSimpleSets] = useState(0);
  const [showSimpleLog, setShowSimpleLog] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [circuitExIdx, setCircuitExIdx] = useState(0);
  const [intervalPhase, setIntervalPhase] = useState("work");
  const timerRef = useRef(null);

  const currentBlock = blocks[blockIdx];
  const allExercises = blocks.flatMap(b => b.type === "circuit" ? b.exercises : [b]);

  // Get last session logs for this workout
  const lastLog = sessionLogs.find(l => l.workout_id === workout.id);
  const lastExLogs = (() => { try { return JSON.parse(lastLog?.exercise_logs || "{}"); } catch { return {}; } })();
  const getLastPerf = (exName) => Object.values(lastExLogs).find(l => l.name === exName);

  const getAllPerfs = (exName) => sessionLogs
    .filter(l => l.workout_id === workout.id)
    .map(l => { try { const logs = JSON.parse(l.exercise_logs || "{}"); return { date: l.date, ...Object.values(logs).find(e => e.name === exName) }; } catch { return null; } })
    .filter(l => l && (l.weight || l.reps))
    .slice(0, 5);

  useEffect(() => () => clearInterval(timerRef.current), []);
  useEffect(() => { setSimpleSets(0); setShowSimpleLog(false); setCurrentRound(1); setCircuitExIdx(0); setIntervalPhase("work"); }, [blockIdx]);

  const startTimer = (secs, label, onEnd) => {
    clearInterval(timerRef.current);
    setResting(true); setRestTime(secs); setRestLabel(label);
    timerRef.current = setInterval(() => {
      setRestTime(t => { if (t <= 1) { clearInterval(timerRef.current); setResting(false); onEnd(); return 0; } return t - 1; });
    }, 1000);
  };
  const skipTimer = () => { clearInterval(timerRef.current); setResting(false); };

  const goNextBlock = () => {
    const next = blockIdx + 1;
    if (next < blocks.length) { setBlockIdx(next); }
    else { setDone(true); }
  };

  const completeSimpleSet = () => {
    const nd = simpleSets + 1; setSimpleSets(nd);
    if (nd < currentBlock.sets) startTimer(currentBlock.rest || 60, "REPOS", () => {});
    else setShowSimpleLog(true);
  };

  const circuitEx = currentBlock?.type === "circuit" ? currentBlock.exercises[circuitExIdx] : null;

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

  const saveAndFinish = async () => {
    if (clientId) {
      const logsWithNames = {};
      allExercises.forEach(e => { logsWithNames[e.id] = { name: e.name, suggested_weight: e.suggested_weight, weight_type: e.weight_type, weight: exLogs[e.id]?.weight || "", reps: exLogs[e.id]?.reps || "" }; });
      await supabase.from("session_logs").insert([{ client_id: clientId, workout_id: workout.id, workout_name: workout.name, date: today, exercise_logs: JSON.stringify(logsWithNames), note: globalNote }]);
    }
    onFinish();
  };

  if (done) return (
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: "'Helvetica Neue', Arial, sans-serif", padding: 20 }}>
      <div style={{ textAlign: "center", paddingTop: 40, marginBottom: 32 }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>🏆</div>
        <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>Séance terminée !</h1>
        <p style={{ color: C.textMuted }}>{workout.name}</p>
      </div>
      <Card style={{ marginBottom: 16 }}><div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 12 }}>📝 NOTE SUR LA SÉANCE</div><TA placeholder="Comment c'était ?" value={globalNote} onChange={e => setGlobalNote(e.target.value)} style={{ minHeight: 100 }} /></Card>
      <Card style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 16 }}>MES PERFORMANCES</div>
        {allExercises.map(ex => (
          <div key={ex.id} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>{ex.name || "—"}</div>
            {ex.suggested_weight && <div style={{ fontSize: 12, color: C.orange, marginBottom: 6 }}>⚖️ {ex.suggested_weight} {ex.weight_type}</div>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div><div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>POIDS</div><input type="text" placeholder="ex: 10 kg" value={exLogs[ex.id]?.weight || ""} onChange={e => setExLogs({ ...exLogs, [ex.id]: { ...exLogs[ex.id], weight: e.target.value } })} style={{ ...inputSt, fontSize: 13 }} /></div>
              <div><div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>REPS</div><input type="text" placeholder={ex.reps || "—"} value={exLogs[ex.id]?.reps || ""} onChange={e => setExLogs({ ...exLogs, [ex.id]: { ...exLogs[ex.id], reps: e.target.value } })} style={{ ...inputSt, fontSize: 13 }} /></div>
            </div>
          </div>
        ))}
      </Card>
      <Btn onClick={saveAndFinish} style={{ marginBottom: 30 }}>💾 Enregistrer et terminer</Btn>
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
    </>
  );

  if (currentBlock.type === "exercise") return (
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      <NavBar />
      <div style={{ padding: 20 }}>
        <TimerBar />
        {showSimpleLog ? (
          <Card style={{ borderColor: C.green + "44" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.green, marginBottom: 14 }}>✅ {currentBlock.name} terminé !</div>
            {currentBlock.suggested_weight && <div style={{ fontSize: 12, color: C.orange, marginBottom: 10 }}>⚖️ {currentBlock.suggested_weight} {currentBlock.weight_type}</div>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
              <div><div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>POIDS</div><input type="text" placeholder="ex: 10 kg" value={exLogs[currentBlock.id]?.weight || ""} onChange={e => setExLogs({ ...exLogs, [currentBlock.id]: { ...exLogs[currentBlock.id], weight: e.target.value } })} style={{ ...inputSt, fontSize: 13 }} /></div>
              <div><div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>REPS</div><input type="text" placeholder={currentBlock.reps} value={exLogs[currentBlock.id]?.reps || ""} onChange={e => setExLogs({ ...exLogs, [currentBlock.id]: { ...exLogs[currentBlock.id], reps: e.target.value } })} style={{ ...inputSt, fontSize: 13 }} /></div>
            </div>
            <Btn onClick={() => { setShowSimpleLog(false); goNextBlock(); }}>Continuer →</Btn>
          </Card>
        ) : (
          <div>
            <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 6 }}>EXERCICE</div>
            <h2 style={{ fontSize: 26, fontWeight: 900, margin: "0 0 10px" }}>{currentBlock.name}</h2>
            {currentBlock.photo && <img src={currentBlock.photo} alt="" style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 14, marginBottom: 14 }} />}
            {currentBlock.suggested_weight && <div style={{ background: C.orange + "15", border: `1px solid ${C.orange}44`, borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13 }}>⚖️ <span style={{ color: C.orange, fontWeight: 700 }}>Suggéré :</span> {currentBlock.suggested_weight} {currentBlock.weight_type}</div>}
            {(() => { const lp = getLastPerf(currentBlock.name); return lp && (lp.weight || lp.reps) ? <div style={{ background: C.purple + "15", border: `1px solid ${C.purple}44`, borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13 }}>🕐 <span style={{ color: C.purple, fontWeight: 700 }}>Dernière fois :</span> {lp.weight ? `${lp.weight}` : ""}{lp.weight && lp.reps ? " · " : ""}{lp.reps ? `${lp.reps} reps` : ""}</div> : null; })()}
            {/* History toggle */}
            {getAllPerfs(currentBlock.name).length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <button onClick={() => setShowHistory(!showHistory)} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 12px", color: C.textMuted, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
                  📊 {showHistory ? "Masquer" : "Voir"} mon historique ({getAllPerfs(currentBlock.name).length} séances)
                </button>
                {showHistory && (
                  <div style={{ marginTop: 10, background: "#111", borderRadius: 12, padding: 12 }}>
                    <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 10 }}>HISTORIQUE — {currentBlock.name}</div>
                    {getAllPerfs(currentBlock.name).map((p, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < getAllPerfs(currentBlock.name).length - 1 ? `1px solid ${C.border}` : "none" }}>
                        <span style={{ fontSize: 12, color: C.textMuted }}>{formatDate(p.date)}</span>
                        <span style={{ fontSize: 13, fontWeight: 700 }}>
                          {p.weight && <span style={{ color: C.pink }}>{p.weight}</span>}
                          {p.weight && p.reps && <span style={{ color: C.textMuted }}> · </span>}
                          {p.reps && <span style={{ color: C.purple }}>{p.reps} reps</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 }}>
              {[{ l: "SÉRIES", v: `${simpleSets}/${currentBlock.sets}`, c: C.pink }, { l: "REPS", v: currentBlock.reps, c: C.white }, { l: "REPOS", v: `${currentBlock.rest}s`, c: C.orange }].map(s => (
                <div key={s.l} style={{ background: "#111", borderRadius: 12, padding: "12px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>{s.l}</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: s.c }}>{s.v}</div>
                </div>
              ))}
            </div>
            {currentBlock.note && <div style={{ background: C.pink + "0f", border: `1px solid ${C.pink}33`, borderRadius: 12, padding: 14, marginBottom: 14, fontSize: 14, lineHeight: 1.5 }}>💡 {currentBlock.note}</div>}
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              {Array.from({ length: currentBlock.sets }, (_, i) => (
                <div key={i} style={{ width: 36, height: 36, borderRadius: "50%", background: i < simpleSets ? C.green : i === simpleSets ? C.pink + "22" : "#111", border: `2px solid ${i < simpleSets ? C.green : i === simpleSets ? C.pink : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: i < simpleSets ? C.black : i === simpleSets ? C.pink : C.textMuted }}>{i < simpleSets ? "✓" : i + 1}</div>
              ))}
            </div>
            {!resting && <Btn onClick={completeSimpleSet} style={{ fontSize: 17 }}>✅ Série {simpleSets + 1} terminée !</Btn>}
          </div>
        )}
      </div>
    </div>
  );

  if (currentBlock.type === "circuit") return (
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
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
            <h2 style={{ fontSize: 26, fontWeight: 900, margin: "0 0 10px" }}>{circuitEx.name}</h2>
            {circuitEx.photo && <img src={circuitEx.photo} alt="" style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 14, marginBottom: 14 }} />}
            {circuitEx.suggested_weight && <div style={{ background: C.orange + "15", border: `1px solid ${C.orange}44`, borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13 }}>⚖️ <span style={{ color: C.orange, fontWeight: 700 }}>Suggéré :</span> {circuitEx.suggested_weight} {circuitEx.weight_type}</div>}
            {(() => { const lp = getLastPerf(circuitEx.name); return lp && (lp.weight || lp.reps) ? <div style={{ background: C.purple + "15", border: `1px solid ${C.purple}44`, borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13 }}>🕐 <span style={{ color: C.purple, fontWeight: 700 }}>Dernière fois :</span> {lp.weight ? `${lp.weight}` : ""}{lp.weight && lp.reps ? " · " : ""}{lp.reps ? `${lp.reps} reps` : ""}</div> : null; })()}
            {getAllPerfs(circuitEx.name).length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <button onClick={() => setShowHistory(!showHistory)} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 12px", color: C.textMuted, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
                  📊 {showHistory ? "Masquer" : "Voir"} historique
                </button>
                {showHistory && (
                  <div style={{ marginTop: 10, background: "#111", borderRadius: 12, padding: 12 }}>
                    {getAllPerfs(circuitEx.name).map((p, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < getAllPerfs(circuitEx.name).length - 1 ? `1px solid ${C.border}` : "none" }}>
                        <span style={{ fontSize: 12, color: C.textMuted }}>{formatDate(p.date)}</span>
                        <span style={{ fontSize: 13, fontWeight: 700 }}>
                          {p.weight && <span style={{ color: C.pink }}>{p.weight}</span>}
                          {p.weight && p.reps && <span style={{ color: C.textMuted }}> · </span>}
                          {p.reps && <span style={{ color: C.purple }}>{p.reps} reps</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {currentBlock.interval_mode ? (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                  <div style={{ background: C.green + "15", borderRadius: 12, padding: "14px 8px", textAlign: "center", border: `1px solid ${C.green}44` }}>
                    <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>⚡ TRAVAIL</div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: C.green }}>{circuitEx.work_time}s</div>
                  </div>
                  <div style={{ background: C.orange + "15", borderRadius: 12, padding: "14px 8px", textAlign: "center", border: `1px solid ${C.orange}44` }}>
                    <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>😴 REPOS</div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: C.orange }}>{circuitEx.rest_time}s</div>
                  </div>
                </div>
                {circuitEx.note && <div style={{ background: C.pink + "0f", border: `1px solid ${C.pink}33`, borderRadius: 12, padding: 14, marginBottom: 14, fontSize: 14 }}>💡 {circuitEx.note}</div>}
                <Btn onClick={startIntervalWork} style={{ fontSize: 17, background: C.green, color: C.black }}>▶ Démarrer</Btn>
              </div>
            ) : (
              <div>
                <div style={{ background: "#111", borderRadius: 12, padding: "14px", textAlign: "center", marginBottom: 14 }}>
                  <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>REPS</div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: C.purple }}>{circuitEx.reps}</div>
                </div>
                {circuitEx.note && <div style={{ background: C.pink + "0f", border: `1px solid ${C.pink}33`, borderRadius: 12, padding: 14, marginBottom: 14, fontSize: 14 }}>💡 {circuitEx.note}</div>}
                <Btn onClick={advanceCircuit} style={{ fontSize: 17, background: C.purple, color: C.white }}>✅ Exo suivant →</Btn>
              </div>
            )}
            <div style={{ display: "flex", gap: 6, marginTop: 20 }}>
              {currentBlock.exercises.map((e, i) => (
                <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: i < circuitExIdx ? C.green : i === circuitExIdx ? C.purple : C.border }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return null;
};

// ══════════════════════════════════════════════════════════════════════════════
// PERF CARD
// ══════════════════════════════════════════════════════════════════════════════
const PerfCard = ({ log, workout }) => {
  let exLogs = {};
  try { exLogs = JSON.parse(log.exercise_logs || "{}"); } catch {}

  // Try to match exercise names from workout if log doesn't have them
  const enrichedLogs = Object.entries(exLogs).map(([key, exLog]) => {
    let name = exLog.name;
    if (!name && workout) {
      const allEx = (workout.blocks || []).flatMap(b => b.type === "circuit" ? b.exercises : [b]);
      const match = allEx.find(e => e.id === key) || workout.exercises?.find(e => e.id === key);
      name = match?.name || "—";
    }
    return { ...exLog, name: name || "—" };
  });

  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div><div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>{log.workout_name}</div><div style={{ fontSize: 12, color: C.textMuted }}>{formatDate(log.date)}</div></div>
        <Badge color={C.green}>✅ Réalisée</Badge>
      </div>
      {enrichedLogs.length > 0 && (
        <div style={{ marginBottom: log.note ? 14 : 0 }}>
          <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 10 }}>DÉTAIL DES EXERCICES</div>
          {enrichedLogs.filter(l => l.weight || l.reps).map((exLog, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "#111", borderRadius: 10, marginBottom: 6 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{exLog.name}</div>
                {exLog.suggested_weight && <div style={{ fontSize: 11, color: C.textMuted }}>Suggéré : {exLog.suggested_weight} {exLog.weight_type}</div>}
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                {exLog.weight && <div style={{ textAlign: "center" }}><div style={{ fontSize: 10, color: C.textMuted, marginBottom: 1 }}>POIDS</div><div style={{ fontWeight: 800, color: C.pink, fontSize: 14 }}>{exLog.weight}</div></div>}
                {exLog.reps && <div style={{ textAlign: "center" }}><div style={{ fontSize: 10, color: C.textMuted, marginBottom: 1 }}>REPS</div><div style={{ fontWeight: 800, color: C.purple, fontSize: 14 }}>{exLog.reps}</div></div>}
              </div>
            </div>
          ))}
          {enrichedLogs.filter(l => l.weight || l.reps).length === 0 && <div style={{ fontSize: 13, color: C.textMuted, textAlign: "center", padding: "8px 0" }}>Aucune performance saisie</div>}
        </div>
      )}
      {log.note && <div style={{ background: C.pink + "15", borderRadius: 10, padding: 10, fontSize: 13, color: C.pink }}>💬 {log.note}</div>}
    </Card>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// ENTRY DETAIL — full view of one journal entry (coach + client)
// ══════════════════════════════════════════════════════════════════════════════
const EntryDetail = ({ entry, onBack }) => (
  <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: "'Helvetica Neue', Arial, sans-serif", padding: 20 }}>
    <button onClick={onBack} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 14, marginBottom: 18, padding: 0 }}>← Retour</button>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
      <h2 style={{ fontSize: 20, fontWeight: 900, margin: 0 }}>{new Date(entry.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</h2>
      <span style={{ fontSize: 36 }}>{feelings[(entry.feeling || 3) - 1]}</span>
    </div>
    <div style={{ fontSize: 14, color: C.textMuted, marginBottom: 20, fontWeight: 600 }}>{feelingLabels[(entry.feeling || 3) - 1]}</div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14 }}>
        <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>PAS</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: C.pink }}>{(entry.steps || 0).toLocaleString()}</div>
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14 }}>
        <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>SÉANCE</div>
        <div style={{ fontWeight: 700, fontSize: 13, color: sessionColor(entry.session_status) }}>{sessionLabel(entry.session_status)}</div>
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14 }}>
        <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>💧 HYDRATATION</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: C.blue }}>{entry.hydration || "—"} L</div>
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14 }}>
        <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>😴 SOMMEIL</div>
        <div style={{ fontSize: 20, fontWeight: 900 }}>{entry.sleep_hours || "—"}h{entry.nap ? <span style={{ fontSize: 13, color: C.purple }}> · sieste</span> : ""}</div>
      </div>
    </div>

    {entry.meal_note && (
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 8 }}>🍽️ REPAS</div>
        <div style={{ fontSize: 14, lineHeight: 1.6 }}>{entry.meal_note}</div>
      </div>
    )}

    {entry.photos && entry.photos.length > 0 && (
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 12 }}>📷 PHOTOS REPAS ({entry.photos.length})</div>
        <div style={{ display: "grid", gridTemplateColumns: entry.photos.length === 1 ? "1fr" : "repeat(2, 1fr)", gap: 10 }}>
          {entry.photos.map((p, i) => (
            <img key={i} src={p} alt="" style={{ width: "100%", aspectRatio: entry.photos.length === 1 ? "16/9" : "1", objectFit: "cover", borderRadius: 10 }} />
          ))}
        </div>
      </div>
    )}

    {entry.session_note && (
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 8 }}>💪 NOTE SÉANCE</div>
        <div style={{ fontSize: 14, lineHeight: 1.6 }}>{entry.session_note}</div>
      </div>
    )}

    {entry.had_difficulty && (
      <div style={{ background: C.orange + "15", border: `1px solid ${C.orange}44`, borderRadius: 14, padding: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: C.orange, fontWeight: 700, marginBottom: 8 }}>⚠️ DIFFICULTÉ</div>
        <div style={{ fontSize: 14, lineHeight: 1.6 }}>{entry.difficulty_note || "Difficulté signalée"}</div>
      </div>
    )}

    {entry.protein_estimate && (
      <div style={{ background: C.green + "12", border: `1px solid ${C.green}33`, borderRadius: 14, padding: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: C.green, fontWeight: 700, marginBottom: 8 }}>🥩 PROTÉINES</div>
        <div style={{ fontSize: 14 }}>{{
          low: "😬 Moins de la moitié de l'objectif",
          medium: "😐 Environ la moitié de l'objectif",
          good: "🙂 Presque l'objectif atteint",
          great: "💪 Objectif atteint !",
        }[entry.protein_estimate] || entry.protein_estimate}</div>
      </div>
    )}

    {entry.coach_message && (
      <div style={{ background: C.pink + "15", border: `1px solid ${C.pink}44`, borderRadius: 14, padding: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: C.pink, fontWeight: 700, marginBottom: 8 }}>💬 MESSAGE DE TON COACH</div>
        <div style={{ fontSize: 14, lineHeight: 1.6 }}>{entry.coach_message}</div>
      </div>
    )}
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// ENTRY CARD — summary card (coach + client), clickable
// ══════════════════════════════════════════════════════════════════════════════
const EntryCard = ({ e, onClick }) => (
  <Card onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
      <span style={{ fontWeight: 700 }}>{new Date(e.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {onClick && <span style={{ fontSize: 11, color: C.textMuted }}>Voir →</span>}
        <span style={{ fontSize: 22 }}>{feelings[(e.feeling || 3) - 1]}</span>
      </div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: e.photos?.length > 0 || e.meal_note || e.had_difficulty || e.coach_message ? 12 : 0 }}>
      <div style={{ background: "#111", borderRadius: 10, padding: 10 }}><div style={{ fontSize: 10, color: C.textMuted, marginBottom: 2 }}>PAS</div><div style={{ fontSize: 18, fontWeight: 900, color: C.pink }}>{(e.steps || 0).toLocaleString()}</div></div>
      <div style={{ background: "#111", borderRadius: 10, padding: 10 }}><div style={{ fontSize: 10, color: C.textMuted, marginBottom: 2 }}>SÉANCE</div><div style={{ fontWeight: 700, fontSize: 13, color: sessionColor(e.session_status) }}>{sessionLabel(e.session_status)}</div></div>
      <div style={{ background: "#111", borderRadius: 10, padding: 10 }}><div style={{ fontSize: 10, color: C.textMuted, marginBottom: 2 }}>HYDRATATION</div><div style={{ fontSize: 18, fontWeight: 900, color: C.blue }}>{e.hydration || "—"} L</div></div>
      <div style={{ background: "#111", borderRadius: 10, padding: 10 }}><div style={{ fontSize: 10, color: C.textMuted, marginBottom: 2 }}>SOMMEIL</div><div style={{ fontSize: 15, fontWeight: 700 }}>{e.sleep_hours || "—"}h {e.nap ? "· 😴" : ""}</div></div>
    </div>
    {e.photos && e.photos.length > 0 && (
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        {e.photos.slice(0, 3).map((p, i) => <img key={i} src={p} alt="" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }} />)}
        {e.photos.length > 3 && <div style={{ width: 60, height: 60, borderRadius: 8, background: "#111", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: C.textMuted }}>+{e.photos.length - 3}</div>}
      </div>
    )}
    {e.meal_note && <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 8 }}><span style={{ color: C.white, fontWeight: 700 }}>Repas : </span>{e.meal_note.length > 80 ? e.meal_note.slice(0, 80) + "..." : e.meal_note}</div>}
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
  const [newClientForm, setNewClientForm] = useState({ name: "", email: "", password: "", goal: "", start_date: "", next_payment: "", sessions_per_week: "3", monthly_amount: "", calories_target: "", protein_target: "" });
  const [addingClient, setAddingClient] = useState(false);
  const [msgText, setMsgText] = useState("");
  const [sessionLogs, setSessionLogs] = useState([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(today);
  const [paymentNote, setPaymentNote] = useState("");
  const [addingPayment, setAddingPayment] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [clientNutritionLogs, setClientNutritionLogs] = useState([]);
  const [showNutritionReport, setShowNutritionReport] = useState(false);
  const [sharedMonths, setSharedMonths] = useState({});

  const client = clients.find(c => c.id === selected);
  const { entries, weights, measurements, assignedWorkouts, progressPhotos, payments, loading: loadingData, addEntry, updateEntry, toggleWorkout, updateScheduledDate, addPayment } = useClientData(selected);
  const paymentAlerts = clients.filter(c => { const d = daysUntil(c.next_payment); return d >= 0 && d <= 5; });

  useEffect(() => {
    if (selected) {
      supabase.from("session_logs").select("*").eq("client_id", selected).order("date", { ascending: false }).then(({ data }) => setSessionLogs(data || []));
      supabase.from("nutrition_logs").select("*").eq("client_id", selected).order("created_at").then(({ data }) => setClientNutritionLogs(data || []));
    }
  }, [selected]);

  const handleAddClient = async () => {
    if (!newClientForm.name || !newClientForm.email || !newClientForm.password) return alert("Remplis au minimum le nom, l'email et le mot de passe.");
    setAddingClient(true);
    const { data: authData, error: authErr } = await supabase.auth.signUp({ email: newClientForm.email, password: newClientForm.password });
    if (authErr) { alert("Erreur : " + authErr.message); setAddingClient(false); return; }
    const userId = authData.user?.id;
    const avatar = newClientForm.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    await addClient({ name: newClientForm.name, avatar, goal: newClientForm.goal, start_date: newClientForm.start_date, next_payment: newClientForm.next_payment, sessions_per_week: parseInt(newClientForm.sessions_per_week) || 3, monthly_amount: parseFloat(newClientForm.monthly_amount) || 0, calories_target: parseInt(newClientForm.calories_target) || 0, protein_target: parseInt(newClientForm.protein_target) || 0, streak: 0, today_done: false, user_id: userId });
    setAddingClient(false); setShowAddClient(false);
    setNewClientForm({ name: "", email: "", password: "", goal: "", start_date: "", next_payment: "", sessions_per_week: "3", monthly_amount: "", calories_target: "", protein_target: "" });
    alert(`✅ Compte créé !\n\nEmail : ${newClientForm.email}\nMot de passe : ${newClientForm.password}`);
  };

  const handleSaveClient = async (id, patch) => { await updateClient(id, patch); alert("✅ Profil mis à jour !"); };
  const handleDeleteClient = async (id) => { await deleteClient(id); setSelected(null); setMainTab("dashboard"); alert("✅ Cliente supprimée."); };

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
    setMsgText(""); alert("✅ Message envoyé !");
  };

  const handleShareMonth = (clientId, monthKey) => {
    setSharedMonths(prev => ({ ...prev, [clientId]: [...(prev[clientId] || []), monthKey] }));
    alert("✅ Bilan partagé avec la cliente !");
  };

  if (showNutritionReport && client) return (
    <NutritionReport
      client={client.name}
      clientInfo={client}
      nutritionLogs={clientNutritionLogs}
      isCoach={true}
      onShare={(mk) => handleShareMonth(client.id, mk)}
      onClose={() => setShowNutritionReport(false)}
      sharedMonths={sharedMonths[client.id] || []}
    />
  );

  if (selectedEntry) return <EntryDetail entry={selectedEntry} onBack={() => setSelectedEntry(null)} />;

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

              <Tab tabs={[["journal", "📋 Journal"], ["seances", "💪 Séances"], ["perf", "📊 Perfs"], ["nutrition", "🍽️ Nutrition"], ["body", "📏 Corps"], ["paiements", "💳 Paiements"], ["message", "💬 Message"]]} active={clientTab} onChange={setClientTab} />

              {clientTab === "journal" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {loadingData ? <Spinner /> : entries.length === 0 ? <Card><p style={{ color: C.textMuted, textAlign: "center", margin: 0 }}>Aucune entrée.</p></Card> : entries.map((e, i) => <EntryCard key={i} e={e} onClick={() => setSelectedEntry(e)} />)}
                </div>
              )}

              {clientTab === "seances" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {loadingData ? <Spinner /> : workouts.map(w => {
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
                            <div style={{ display: "flex", gap: 8 }}>
                              {[
                                { label: "Jour", values: Array.from({length:31},(_,i)=>String(i+1).padStart(2,'0')), part: 2 },
                                { label: "Mois", values: ["01","02","03","04","05","06","07","08","09","10","11","12"], part: 1 },
                                { label: "Année", values: ["2025","2026","2027"], part: 0 },
                              ].map(({ label, values, part }) => {
                                const parts = (assigned.scheduled_date || "--").split("-");
                                return (
                                  <select key={label} value={parts[part] || ""} onChange={e => {
                                    const p = (assigned.scheduled_date || `${new Date().getFullYear()}-01-01`).split("-");
                                    p[part] = e.target.value;
                                    updateScheduledDate(w.id, p.join("-"));
                                  }} style={{ ...inputSt, flex: 1, fontSize: 13, padding: "10px 6px" }}>
                                    <option value="">{label}</option>
                                    {values.map(v => <option key={v} value={v}>{v}</option>)}
                                  </select>
                                );
                              })}
                            </div>
                          </div>
                        )}
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

              {clientTab === "nutrition" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {/* Summary today */}
                  <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontSize: 13, color: C.textMuted }}>Logs nutrition de {client.name}</div>
                    <button onClick={() => setShowNutritionReport(true)} style={{ background: C.pink, border: "none", color: C.black, borderRadius: 10, padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>📊 Bilan mensuel</button>
                  </div>
                  {/* Today's nutrition */}
                  {(() => {
                    const todayLogs = clientNutritionLogs.filter(l => l.date === today);
                    const totals = sumMacros(todayLogs);
                    const goals = { kcal: client.calories_target || 1800, prot: client.protein_target || 100, carb: client.carb_target || 180, fat: client.fat_target || 60 };
                    return (
                      <Card>
                        <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 12 }}>AUJOURD'HUI — {todayLogs.length} aliments saisis</div>
                        {todayLogs.length === 0 ? <p style={{ color: C.textMuted, textAlign: "center", margin: 0 }}>Rien de saisi aujourd'hui.</p> : (
                          <>
                            <MacroBar label="Calories" value={Math.round(totals.kcal)} max={goals.kcal} color={C.yellow} unit=" kcal" />
                            <MacroBar label="Protéines 💪" value={Math.round(totals.prot)} max={goals.prot} color={C.green} />
                            <MacroBar label="Glucides" value={Math.round(totals.carb)} max={goals.carb} color={C.blue} />
                            <MacroBar label="Lipides" value={Math.round(totals.fat)} max={goals.fat} color={C.pink} />
                            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                              {MEALS.map((label, i) => {
                                const mealLogs = todayLogs.filter(l => l.meal_idx === i);
                                if (mealLogs.length === 0) return null;
                                return (
                                  <div key={i}>
                                    <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>{label}</div>
                                    {mealLogs.map((e, j) => {
                                      const m = getMacros(e);
                                      return <div key={j} style={{ fontSize: 12, padding: "6px 10px", background: "#111", borderRadius: 8, display: "flex", justifyContent: "space-between" }}><span>{e.name} {e.manual_macros ? "" : `(${e.grams}g)`}</span><span style={{ color: C.yellow, fontWeight: 700 }}>{m.kcal} kcal</span></div>;
                                    })}
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        )}
                      </Card>
                    );
                  })()}
                  {/* Recent history */}
                  <Card>
                    <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 12 }}>HISTORIQUE 7 JOURS</div>
                    {Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - i); return d.toISOString().slice(0, 10); }).map(d => {
                      const dayLogs = clientNutritionLogs.filter(l => l.date === d);
                      if (dayLogs.length === 0) return null;
                      const t = sumMacros(dayLogs);
                      return (
                        <div key={d} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                          <span style={{ fontSize: 12, color: C.textMuted }}>{formatDate(d)}</span>
                          <div style={{ display: "flex", gap: 12 }}>
                            <span style={{ fontSize: 12, color: C.yellow, fontWeight: 700 }}>{Math.round(t.kcal)} kcal</span>
                            <span style={{ fontSize: 12, color: C.green }}>💪 {Math.round(t.prot)}g</span>
                          </div>
                        </div>
                      );
                    })}
                  </Card>
                </div>
              )}

              {clientTab === "body" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {loadingData ? <Spinner /> : (<>
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
                  </>)}
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
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
                <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 10 }}>🍽️ OBJECTIFS NUTRITIONNELS (optionnel)</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <Inp label="Calories / jour" type="number" placeholder="ex: 1800" value={newClientForm.calories_target} onChange={e => setNewClientForm({ ...newClientForm, calories_target: e.target.value })} />
                  <Inp label="Protéines / jour (g)" type="number" placeholder="ex: 100" value={newClientForm.protein_target} onChange={e => setNewClientForm({ ...newClientForm, protein_target: e.target.value })} />
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <Btn variant="secondary" onClick={() => setShowAddClient(false)} style={{ flex: 1 }}>Annuler</Btn>
              <Btn onClick={handleAddClient} disabled={addingClient} style={{ flex: 2 }}>{addingClient ? "Création..." : "Créer le compte"}</Btn>
            </div>
          </div>
        </div>
      )}

      {editingClient && (
        <EditClientModal client={editingClient} onSave={handleSaveClient} onDelete={handleDeleteClient} onClose={() => setEditingClient(null)} />
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
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [selectedPerf, setSelectedPerf] = useState(null);
  const [viewingWorkoutPerfs, setViewingWorkoutPerfs] = useState(null);
  const [sessionLogs, setSessionLogs] = useState([]);
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

  useEffect(() => {
    if (clientId) {
      supabase.from("session_logs").select("*").eq("client_id", clientId).order("date", { ascending: false }).then(({ data }) => setSessionLogs(data || []));
    }
  }, [clientId]);

  const { entries, weights, measurements, assignedWorkouts, progressPhotos, payments, loading, addEntry, updateEntry, addWeight, addMeasurement, addProgressPhoto } = useClientData(clientId);
  const { workouts } = useWorkouts();

  const myWorkouts = workouts.filter(w => assignedWorkouts.find(a => a.workout_id === w.id));
  const todayEntry = entries.find(e => e.date === today);
  const coachMsg = entries.find(e => e.coach_message)?.coach_message;
  const lastWeight = weights[weights.length - 1];
  const startWeight = weights[0];

  // ── Save handler for any date ─────────────────────────────────────────────
  const handleSaveJournal = async (payload) => {
    const existingEntry = entries.find(e => e.date === payload.date);
    if (existingEntry) {
      await updateEntry(existingEntry.id, payload);
    } else {
      await addEntry({ ...payload, client_id: clientId });
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
    if (granted) setNotifEnabled(true);
    else alert("Pour activer : Réglages → Notifications → Process Lab → Autoriser");
  };

  if (selectedEntry) return <EntryDetail entry={selectedEntry} onBack={() => setSelectedEntry(null)} />;

  if (screen === "nutrition") return <NutritionTracker clientId={clientId} clientInfo={clientInfo} onBack={() => setScreen("home")} />;

  if (activeWorkout) return <WorkoutPlayer workout={activeWorkout} onFinish={() => { setActiveWorkout(null); supabase.from("session_logs").select("*").eq("client_id", clientId).order("date", { ascending: false }).then(({ data }) => setSessionLogs(data || [])); }} clientId={clientId} sessionLogs={sessionLogs} />;

  // ── Journal screen — wait for data then show form ─────────────────────────
  if (screen === "journal") {
    if (!clientId) return <div style={{ minHeight: "100vh", background: C.black, display: "flex", alignItems: "center", justifyContent: "center" }}><Spinner /></div>;
    return (
      <JournalForm
        entries={entries}
        onSave={handleSaveJournal}
        onBack={() => setScreen("home")}
        proteinTarget={clientInfo?.protein_target || 0}
        clientId={clientId}
      />
    );
  }

  if (!clientInfo) return <div style={{ minHeight: "100vh", background: C.black, display: "flex", alignItems: "center", justifyContent: "center" }}><Spinner /></div>;

  // ── Workout perfs detail ───────────────────────────────────────────────────
  if (viewingWorkoutPerfs) {
    const logs = sessionLogs.filter(l => l.workout_id === viewingWorkoutPerfs.id);
    return (
      <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: "'Helvetica Neue', Arial, sans-serif", padding: 20 }}>
        <button onClick={() => setViewingWorkoutPerfs(null)} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 14, marginBottom: 18, padding: 0 }}>← Retour</button>
        <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 4 }}>{viewingWorkoutPerfs.name}</h2>
        <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 20 }}>{logs.length} séance{logs.length > 1 ? "s" : ""} réalisée{logs.length > 1 ? "s" : ""}</p>
        {logs.map((log, i) => <div key={i} style={{ marginBottom: 14 }}><PerfCard log={log} workout={viewingWorkoutPerfs} /></div>)}
      </div>
    );
  }

  // ── Perfs screen ───────────────────────────────────────────────────────────
  if (screen === "perfs") return (
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: "'Helvetica Neue', Arial, sans-serif", padding: 20 }}>
      <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 14, marginBottom: 18, padding: 0 }}>← Retour</button>
      <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 6 }}>Mes performances 📊</h2>
      <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 20 }}>{sessionLogs.length} séance{sessionLogs.length > 1 ? "s" : ""} au total</p>

      {/* Par séance */}
      {myWorkouts.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>PAR SÉANCE</div>
          {myWorkouts.map(w => {
            const logs = sessionLogs.filter(l => l.workout_id === w.id);
            if (logs.length === 0) return null;
            return (
              <Card key={w.id} onClick={() => setViewingWorkoutPerfs(w)} style={{ marginBottom: 10, cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>{w.name}</div>
                    <div style={{ fontSize: 12, color: C.textMuted }}>{logs.length} fois · Dernière : {formatDate(logs[0].date)}</div>
                  </div>
                  <span style={{ color: C.purple, fontWeight: 700 }}>→</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Historique complet */}
      <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>HISTORIQUE COMPLET</div>
      {sessionLogs.length === 0 ? (
        <Card><p style={{ color: C.textMuted, textAlign: "center", margin: 0 }}>Pas encore de séance enregistrée.</p></Card>
      ) : sessionLogs.map((log, i) => <div key={i} style={{ marginBottom: 12 }}><PerfCard key={i} log={log} workout={myWorkouts.find(w => w.id === log.workout_id)} /></div>)}
    </div>
  );

  // ── HOME ──────────────────────────────────────────────────────────────────
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
            <><p style={{ color: C.textMuted, fontSize: 13, marginBottom: 12, marginTop: 0 }}>Tu n'as pas encore rempli ton journal.</p><Btn onClick={() => setScreen("journal")}>Commencer mon journal →</Btn></>
          )}
          {todayEntry && (
            <div>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
                <span style={{ fontSize: 30 }}>{feelings[(todayEntry.feeling || 3) - 1]}</span>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 2 }}>Rempli aujourd'hui ✅</div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>
                    {(todayEntry.steps || 0).toLocaleString()} pas · {todayEntry.hydration || "—"}L · {todayEntry.sleep_hours || "—"}h sommeil
                  </div>
                </div>
              </div>
              <Btn onClick={() => setScreen("journal")} variant="ghost" style={{ fontSize: 14 }}>✏️ Modifier mon journal</Btn>
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
              const myLogs = sessionLogs.filter(l => l.workout_id === w.id);
              return (
                <Card key={w.id} style={{ marginBottom: 10, borderColor: isToday ? C.orange + "66" : C.border }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: myLogs.length > 0 ? 12 : 0 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: C.orange + "22", border: `1.5px solid ${isToday ? C.orange : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>💪</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 2 }}>{w.name}</div>
                      <div style={{ fontSize: 12, color: C.textMuted }}>{w.exercises?.length || 0} exercices {myLogs.length > 0 ? `· ${myLogs.length} fois réalisée` : ""}</div>
                      {scheduledDate && <div style={{ fontSize: 11, color: isToday ? C.orange : isPast ? C.red : C.textMuted, fontWeight: isToday ? 700 : 400, marginTop: 2 }}>{isToday ? "📅 Prévue aujourd'hui !" : isPast ? `⚠️ Prévue le ${new Date(scheduledDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}` : `📅 ${new Date(scheduledDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}`}</div>}
                    </div>
                  </div>
                  {myLogs.length > 0 && (
                    <div style={{ background: C.purple + "12", borderRadius: 10, padding: "10px 12px", marginBottom: 12 }}>
                      <div style={{ fontSize: 11, color: C.purple, fontWeight: 700, marginBottom: 6 }}>📊 DERNIÈRE FOIS — {formatDate(myLogs[0].date)}</div>
                      {(() => { let logs = {}; try { logs = JSON.parse(myLogs[0].exercise_logs || "{}"); } catch {} return Object.values(logs).slice(0, 3).map((l, i) => l.weight || l.reps ? <div key={i} style={{ fontSize: 12, color: C.textMuted, marginBottom: 2 }}><span style={{ color: C.white, fontWeight: 600 }}>{l.name}</span> {l.weight ? `· ${l.weight}` : ""} {l.reps ? `· ${l.reps} reps` : ""}</div> : null); })()}
                      <button onClick={() => setViewingWorkoutPerfs(w)} style={{ fontSize: 12, color: C.purple, background: "none", border: "none", cursor: "pointer", fontWeight: 700, marginTop: 4, padding: 0 }}>Voir tout l'historique →</button>
                    </div>
                  )}
                  <Btn onClick={() => setActiveWorkout(w)} style={{ fontSize: 14 }}>▶ Commencer la séance</Btn>
                </Card>
              );
            })}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <Card onClick={() => setScreen("body")} style={{ cursor: "pointer" }}><div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>POIDS</div><div style={{ fontSize: 22, fontWeight: 900, color: C.pink }}>{lastWeight ? `${lastWeight.value} kg` : "—"}</div>{startWeight && lastWeight && startWeight.value !== lastWeight.value && <div style={{ fontSize: 11, color: C.green }}>-{(startWeight.value - lastWeight.value).toFixed(1)} kg</div>}</Card>
          <Card onClick={() => setScreen("perfs")} style={{ cursor: "pointer" }}><div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>SÉANCES</div><div style={{ fontSize: 22, fontWeight: 900, color: C.purple }}>{sessionLogs.length}</div><div style={{ fontSize: 11, color: C.textMuted }}>réalisées</div></Card>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="ghost" onClick={() => setScreen("history")} style={{ flex: 1 }}>📋 Journal</Btn>
          <Btn variant="ghost" onClick={() => setScreen("nutrition")} style={{ flex: 1 }}>🍽️ Nutrition</Btn>
          <Btn variant="ghost" onClick={() => setScreen("contrat")} style={{ flex: 1 }}>📄 Contrat</Btn>
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

      {/* Nutrition targets */}
      {(clientInfo.calories_target > 0 || clientInfo.protein_target > 0) && (
        <Card style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 14 }}>🍽️ MES OBJECTIFS NUTRITIONNELS</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {clientInfo.calories_target > 0 && (
              <div style={{ background: "#111", borderRadius: 12, padding: 14, textAlign: "center" }}>
                <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>🔥 CALORIES</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: C.orange }}>{clientInfo.calories_target}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>kcal / jour</div>
              </div>
            )}
            {clientInfo.protein_target > 0 && (
              <div style={{ background: "#111", borderRadius: 12, padding: 14, textAlign: "center" }}>
                <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>🥩 PROTÉINES</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: C.green }}>{clientInfo.protein_target}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>grammes / jour</div>
              </div>
            )}
          </div>
          {clientInfo.protein_target > 0 && (
            <div style={{ marginTop: 12, padding: "10px 14px", background: C.green + "12", borderRadius: 10, fontSize: 12, color: C.textMuted, lineHeight: 1.5 }}>
              💡 Sources de protéines : poulet, poisson, œufs, fromage blanc 0%, thon, légumineuses, tofu...
            </div>
          )}
        </Card>
      )}
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
      {loading ? <Spinner /> : entries.length === 0 ? <p style={{ color: C.textMuted, textAlign: "center" }}>Aucune entrée.</p> : entries.map((e, i) => (
        <div key={i} style={{ marginBottom: 12 }}>
          <EntryCard e={e} onClick={() => setSelectedEntry(e)} />
        </div>
      ))}
    </div>
  );

  return null;
};

// ══════════════════════════════════════════════════════════════════════════════
// NUTRITION — LOCAL FOOD DATABASE
// ══════════════════════════════════════════════════════════════════════════════
const LOCAL_DB = [
  // VOLAILLES
  {id:"l1",name:"Blanc de poulet cuit",unit:"g",per100:{kcal:110,prot:23,carb:0,fat:2}},
  {id:"l2",name:"Cuisse de poulet cuite",unit:"g",per100:{kcal:185,prot:20,carb:0,fat:11}},
  {id:"l3",name:"Blanc de dinde cuit",unit:"g",per100:{kcal:135,prot:29,carb:0,fat:1}},
  {id:"l4",name:"Dinde hachée cuite",unit:"g",per100:{kcal:149,prot:20,carb:0,fat:7}},
  {id:"l5",name:"Escalope de dinde",unit:"g",per100:{kcal:104,prot:22,carb:0,fat:1}},
  {id:"l6",name:"Poulet rôti sans peau",unit:"g",per100:{kcal:165,prot:25,carb:0,fat:7}},
  // VIANDES
  {id:"l7",name:"Boeuf haché 5% MG",unit:"g",per100:{kcal:137,prot:20,carb:0,fat:5}},
  {id:"l8",name:"Boeuf haché 10% MG",unit:"g",per100:{kcal:176,prot:18,carb:0,fat:10}},
  {id:"l9",name:"Steak de boeuf cuit",unit:"g",per100:{kcal:180,prot:26,carb:0,fat:8}},
  {id:"l10",name:"Filet de boeuf",unit:"g",per100:{kcal:158,prot:24,carb:0,fat:6}},
  {id:"l11",name:"Filet de porc cuit",unit:"g",per100:{kcal:143,prot:22,carb:0,fat:6}},
  {id:"l12",name:"Cotelette de porc",unit:"g",per100:{kcal:195,prot:20,carb:0,fat:12}},
  {id:"l13",name:"Jambon blanc",unit:"g",per100:{kcal:107,prot:18,carb:1,fat:3}},
  {id:"l14",name:"Jambon de Bayonne",unit:"g",per100:{kcal:196,prot:26,carb:0,fat:10}},
  {id:"l15",name:"Veau escalope cuit",unit:"g",per100:{kcal:150,prot:25,carb:0,fat:5}},
  {id:"l16",name:"Agneau gigot cuit",unit:"g",per100:{kcal:218,prot:25,carb:0,fat:13}},
  // POISSONS
  {id:"l17",name:"Saumon frais cuit",unit:"g",per100:{kcal:208,prot:20,carb:0,fat:13}},
  {id:"l18",name:"Saumon fume",unit:"g",per100:{kcal:172,prot:25,carb:0,fat:8}},
  {id:"l19",name:"Thon boite au naturel",unit:"g",per100:{kcal:116,prot:26,carb:0,fat:1}},
  {id:"l20",name:"Thon boite a l huile egoutte",unit:"g",per100:{kcal:198,prot:25,carb:0,fat:10}},
  {id:"l21",name:"Cabillaud cuit",unit:"g",per100:{kcal:82,prot:18,carb:0,fat:1}},
  {id:"l22",name:"Lieu noir cuit",unit:"g",per100:{kcal:90,prot:19,carb:0,fat:1}},
  {id:"l23",name:"Truite cuite",unit:"g",per100:{kcal:151,prot:21,carb:0,fat:7}},
  {id:"l24",name:"Crevettes cuites",unit:"g",per100:{kcal:99,prot:21,carb:1,fat:1}},
  {id:"l25",name:"Sardines huile egouttees",unit:"g",per100:{kcal:208,prot:25,carb:0,fat:12}},
  {id:"l26",name:"Maquereau fume",unit:"g",per100:{kcal:305,prot:19,carb:0,fat:25}},
  {id:"l27",name:"Dorade cuite",unit:"g",per100:{kcal:109,prot:20,carb:0,fat:3}},
  {id:"l28",name:"Bar cuit",unit:"g",per100:{kcal:97,prot:19,carb:0,fat:2}},
  {id:"l29",name:"Thon mi-cuit",unit:"g",per100:{kcal:124,prot:24,carb:0,fat:3}},
  // OEUFS
  {id:"l30",name:"Oeuf entier cuit",unit:"g",per100:{kcal:155,prot:13,carb:1,fat:11}},
  {id:"l31",name:"Blanc d oeuf cuit",unit:"g",per100:{kcal:52,prot:11,carb:1,fat:0}},
  {id:"l32",name:"Omelette nature",unit:"g",per100:{kcal:154,prot:11,carb:0,fat:12}},
  // LAITIERS
  {id:"l33",name:"Fromage blanc 0%",unit:"g",per100:{kcal:46,prot:8,carb:4,fat:0}},
  {id:"l34",name:"Fromage blanc 3%",unit:"g",per100:{kcal:77,prot:7,carb:4,fat:3}},
  {id:"l35",name:"Skyr nature",unit:"g",per100:{kcal:63,prot:11,carb:4,fat:0}},
  {id:"l36",name:"Yaourt grec 0%",unit:"g",per100:{kcal:57,prot:10,carb:4,fat:0}},
  {id:"l37",name:"Yaourt grec entier",unit:"g",per100:{kcal:115,prot:9,carb:4,fat:7}},
  {id:"l38",name:"Yaourt nature entier",unit:"g",per100:{kcal:61,prot:3,carb:5,fat:3}},
  {id:"l39",name:"Cottage cheese",unit:"g",per100:{kcal:98,prot:11,carb:3,fat:4}},
  {id:"l40",name:"Ricotta",unit:"g",per100:{kcal:174,prot:11,carb:3,fat:13}},
  {id:"l41",name:"Mozzarella light",unit:"g",per100:{kcal:149,prot:22,carb:2,fat:6}},
  {id:"l42",name:"Mozzarella classique",unit:"g",per100:{kcal:254,prot:18,carb:2,fat:19}},
  {id:"l43",name:"Emmental rape",unit:"g",per100:{kcal:382,prot:29,carb:0,fat:29}},
  {id:"l44",name:"Gruyere",unit:"g",per100:{kcal:413,prot:30,carb:0,fat:32}},
  {id:"l45",name:"Feta",unit:"g",per100:{kcal:264,prot:14,carb:4,fat:21}},
  {id:"l46",name:"Camembert",unit:"g",per100:{kcal:299,prot:20,carb:0,fat:24}},
  {id:"l47",name:"Lait demi-ecreme",unit:"ml",per100:{kcal:47,prot:3,carb:5,fat:2}},
  {id:"l48",name:"Lait ecreme",unit:"ml",per100:{kcal:34,prot:3,carb:5,fat:0}},
  {id:"l49",name:"Lait entier",unit:"ml",per100:{kcal:64,prot:3,carb:5,fat:3}},
  {id:"l50",name:"Lait de soja",unit:"ml",per100:{kcal:33,prot:3,carb:2,fat:2}},
  {id:"l51",name:"Lait d avoine",unit:"ml",per100:{kcal:46,prot:1,carb:8,fat:1}},
  // WHEY & COMPLEMENTS
  {id:"l52",name:"Whey proteine vanille",unit:"g",per100:{kcal:380,prot:74,carb:8,fat:5}},
  {id:"l53",name:"Whey isolat",unit:"g",per100:{kcal:360,prot:85,carb:3,fat:1}},
  {id:"l54",name:"Caseine",unit:"g",per100:{kcal:370,prot:78,carb:5,fat:2}},
  // FECULENTS
  {id:"l55",name:"Riz blanc cuit",unit:"g",per100:{kcal:130,prot:3,carb:28,fat:0}},
  {id:"l56",name:"Riz complet cuit",unit:"g",per100:{kcal:111,prot:2,carb:23,fat:1}},
  {id:"l57",name:"Pates blanches cuites",unit:"g",per100:{kcal:158,prot:5,carb:31,fat:1}},
  {id:"l58",name:"Pates completes cuites",unit:"g",per100:{kcal:149,prot:5,carb:29,fat:1}},
  {id:"l59",name:"Quinoa cuit",unit:"g",per100:{kcal:120,prot:4,carb:22,fat:2}},
  {id:"l60",name:"Patate douce cuite",unit:"g",per100:{kcal:90,prot:2,carb:21,fat:0}},
  {id:"l61",name:"Pomme de terre cuite",unit:"g",per100:{kcal:87,prot:2,carb:20,fat:0}},
  {id:"l62",name:"Flocons d avoine",unit:"g",per100:{kcal:370,prot:13,carb:60,fat:7}},
  {id:"l63",name:"Pain complet",unit:"g",per100:{kcal:246,prot:9,carb:43,fat:4}},
  {id:"l64",name:"Pain de mie complet",unit:"g",per100:{kcal:236,prot:9,carb:41,fat:3}},
  {id:"l65",name:"Baguette blanche",unit:"g",per100:{kcal:270,prot:9,carb:55,fat:1}},
  {id:"l66",name:"Galette de riz souffle",unit:"g",per100:{kcal:385,prot:7,carb:83,fat:1}},
  {id:"l67",name:"Couscous cuit",unit:"g",per100:{kcal:112,prot:4,carb:23,fat:0}},
  {id:"l68",name:"Boulgour cuit",unit:"g",per100:{kcal:83,prot:3,carb:19,fat:0}},
  {id:"l69",name:"Orge perle cuit",unit:"g",per100:{kcal:123,prot:2,carb:28,fat:0}},
  // LEGUMINEUSES
  {id:"l70",name:"Lentilles cuites",unit:"g",per100:{kcal:116,prot:9,carb:20,fat:1}},
  {id:"l71",name:"Lentilles corail cuites",unit:"g",per100:{kcal:100,prot:8,carb:17,fat:0}},
  {id:"l72",name:"Pois chiches cuits",unit:"g",per100:{kcal:164,prot:9,carb:27,fat:3}},
  {id:"l73",name:"Haricots rouges cuits",unit:"g",per100:{kcal:127,prot:8,carb:22,fat:1}},
  {id:"l74",name:"Haricots blancs cuits",unit:"g",per100:{kcal:114,prot:7,carb:20,fat:1}},
  {id:"l75",name:"Edamame",unit:"g",per100:{kcal:122,prot:11,carb:10,fat:5}},
  {id:"l76",name:"Tofu ferme",unit:"g",per100:{kcal:76,prot:8,carb:2,fat:4}},
  {id:"l77",name:"Tofu soyeux",unit:"g",per100:{kcal:55,prot:5,carb:2,fat:3}},
  {id:"l78",name:"Tempeh",unit:"g",per100:{kcal:193,prot:19,carb:9,fat:11}},
  // LEGUMES
  {id:"l79",name:"Epinards crus",unit:"g",per100:{kcal:23,prot:3,carb:4,fat:0}},
  {id:"l80",name:"Brocoli cuit",unit:"g",per100:{kcal:35,prot:3,carb:7,fat:0}},
  {id:"l81",name:"Chou-fleur cuit",unit:"g",per100:{kcal:23,prot:2,carb:5,fat:0}},
  {id:"l82",name:"Haricots verts cuits",unit:"g",per100:{kcal:31,prot:2,carb:7,fat:0}},
  {id:"l83",name:"Courgette cuite",unit:"g",per100:{kcal:17,prot:1,carb:3,fat:0}},
  {id:"l84",name:"Tomate",unit:"g",per100:{kcal:18,prot:1,carb:4,fat:0}},
  {id:"l85",name:"Concombre",unit:"g",per100:{kcal:15,prot:1,carb:3,fat:0}},
  {id:"l86",name:"Carotte crue",unit:"g",per100:{kcal:41,prot:1,carb:10,fat:0}},
  {id:"l87",name:"Poivron rouge",unit:"g",per100:{kcal:31,prot:1,carb:6,fat:0}},
  {id:"l88",name:"Champignons de Paris crus",unit:"g",per100:{kcal:22,prot:3,carb:3,fat:0}},
  {id:"l89",name:"Avocat",unit:"g",per100:{kcal:160,prot:2,carb:9,fat:15}},
  {id:"l90",name:"Salade verte",unit:"g",per100:{kcal:15,prot:1,carb:2,fat:0}},
  {id:"l91",name:"Celeri branche",unit:"g",per100:{kcal:16,prot:1,carb:3,fat:0}},
  {id:"l92",name:"Aubergine cuite",unit:"g",per100:{kcal:25,prot:1,carb:6,fat:0}},
  {id:"l93",name:"Poireau cuit",unit:"g",per100:{kcal:31,prot:2,carb:7,fat:0}},
  {id:"l94",name:"Asperge cuite",unit:"g",per100:{kcal:20,prot:2,carb:4,fat:0}},
  {id:"l95",name:"Petits pois cuits",unit:"g",per100:{kcal:84,prot:5,carb:14,fat:0}},
  {id:"l96",name:"Mais doux en boite",unit:"g",per100:{kcal:89,prot:3,carb:19,fat:1}},
  {id:"l97",name:"Betterave cuite",unit:"g",per100:{kcal:44,prot:2,carb:10,fat:0}},
  {id:"l98",name:"Radis",unit:"g",per100:{kcal:16,prot:1,carb:3,fat:0}},
  {id:"l99",name:"Chou rouge cru",unit:"g",per100:{kcal:31,prot:1,carb:7,fat:0}},
  {id:"l100",name:"Fenouil cru",unit:"g",per100:{kcal:31,prot:1,carb:7,fat:0}},
  // FRUITS
  {id:"l101",name:"Banane",unit:"g",per100:{kcal:89,prot:1,carb:23,fat:0}},
  {id:"l102",name:"Pomme",unit:"g",per100:{kcal:52,prot:0,carb:14,fat:0}},
  {id:"l103",name:"Orange",unit:"g",per100:{kcal:47,prot:1,carb:12,fat:0}},
  {id:"l104",name:"Fraises",unit:"g",per100:{kcal:32,prot:1,carb:8,fat:0}},
  {id:"l105",name:"Myrtilles",unit:"g",per100:{kcal:57,prot:1,carb:14,fat:0}},
  {id:"l106",name:"Framboises",unit:"g",per100:{kcal:52,prot:1,carb:12,fat:1}},
  {id:"l107",name:"Mangue",unit:"g",per100:{kcal:60,prot:1,carb:15,fat:0}},
  {id:"l108",name:"Ananas",unit:"g",per100:{kcal:50,prot:1,carb:13,fat:0}},
  {id:"l109",name:"Kiwi",unit:"g",per100:{kcal:61,prot:1,carb:15,fat:1}},
  {id:"l110",name:"Raisin",unit:"g",per100:{kcal:69,prot:1,carb:18,fat:0}},
  {id:"l111",name:"Poire",unit:"g",per100:{kcal:57,prot:0,carb:15,fat:0}},
  {id:"l112",name:"Peche",unit:"g",per100:{kcal:39,prot:1,carb:10,fat:0}},
  {id:"l113",name:"Melon",unit:"g",per100:{kcal:34,prot:1,carb:8,fat:0}},
  {id:"l114",name:"Pasteque",unit:"g",per100:{kcal:30,prot:1,carb:8,fat:0}},
  {id:"l115",name:"Cerise",unit:"g",per100:{kcal:63,prot:1,carb:16,fat:0}},
  {id:"l116",name:"Abricot",unit:"g",per100:{kcal:48,prot:1,carb:11,fat:0}},
  {id:"l117",name:"Prune",unit:"g",per100:{kcal:46,prot:1,carb:11,fat:0}},
  // MATIERES GRASSES
  {id:"l118",name:"Huile d olive",unit:"g",per100:{kcal:884,prot:0,carb:0,fat:100}},
  {id:"l119",name:"Huile de coco",unit:"g",per100:{kcal:862,prot:0,carb:0,fat:100}},
  {id:"l120",name:"Beurre",unit:"g",per100:{kcal:717,prot:1,carb:1,fat:81}},
  {id:"l121",name:"Beurre de cacahuete",unit:"g",per100:{kcal:588,prot:25,carb:20,fat:50}},
  {id:"l122",name:"Beurre d amande",unit:"g",per100:{kcal:614,prot:21,carb:19,fat:56}},
  {id:"l123",name:"Amandes",unit:"g",per100:{kcal:575,prot:21,carb:22,fat:49}},
  {id:"l124",name:"Noix",unit:"g",per100:{kcal:654,prot:15,carb:14,fat:65}},
  {id:"l125",name:"Noix de cajou",unit:"g",per100:{kcal:553,prot:18,carb:30,fat:44}},
  {id:"l126",name:"Noisettes",unit:"g",per100:{kcal:628,prot:15,carb:17,fat:61}},
  {id:"l127",name:"Graines de chia",unit:"g",per100:{kcal:490,prot:17,carb:42,fat:31}},
  {id:"l128",name:"Graines de lin",unit:"g",per100:{kcal:534,prot:18,carb:29,fat:42}},
  {id:"l129",name:"Graines de courge",unit:"g",per100:{kcal:559,prot:30,carb:11,fat:49}},
  {id:"l130",name:"Tahini puree de sesame",unit:"g",per100:{kcal:595,prot:17,carb:21,fat:54}},
  // SAUCES
  {id:"l131",name:"Sauce soja",unit:"ml",per100:{kcal:60,prot:10,carb:6,fat:0}},
  {id:"l132",name:"Ketchup",unit:"g",per100:{kcal:100,prot:1,carb:25,fat:0}},
  {id:"l133",name:"Moutarde",unit:"g",per100:{kcal:66,prot:4,carb:6,fat:3}},
  {id:"l134",name:"Mayonnaise allegee",unit:"g",per100:{kcal:265,prot:1,carb:12,fat:23}},
  {id:"l135",name:"Hummus",unit:"g",per100:{kcal:166,prot:8,carb:14,fat:10}},
  {id:"l136",name:"Vinaigrette",unit:"g",per100:{kcal:462,prot:0,carb:5,fat:48}},
  // CEREALES
  {id:"l137",name:"Muesli sans sucre",unit:"g",per100:{kcal:364,prot:10,carb:59,fat:8}},
  {id:"l138",name:"Corn flakes",unit:"g",per100:{kcal:357,prot:7,carb:84,fat:1}},
  {id:"l139",name:"Crepe nature",unit:"g",per100:{kcal:200,prot:5,carb:27,fat:8}},
  // BOISSONS
  {id:"l140",name:"Jus d orange",unit:"ml",per100:{kcal:45,prot:1,carb:10,fat:0}},
  {id:"l141",name:"Shaker proteine",unit:"ml",per100:{kcal:40,prot:6,carb:3,fat:0}},
  // PROTEINES VEGETALES
  {id:"l142",name:"Seitan",unit:"g",per100:{kcal:370,prot:75,carb:14,fat:2}},
  {id:"l143",name:"Proteines soja texturees",unit:"g",per100:{kcal:345,prot:52,carb:30,fat:1}},
  {id:"l144",name:"Surimi",unit:"g",per100:{kcal:99,prot:8,carb:13,fat:1}},
  // SUCRES & EXTRAS
  {id:"l145",name:"Chocolat noir 70%",unit:"g",per100:{kcal:578,prot:8,carb:45,fat:43}},
  {id:"l146",name:"Miel",unit:"g",per100:{kcal:304,prot:0,carb:82,fat:0}},
  {id:"l147",name:"Confiture allegee",unit:"g",per100:{kcal:120,prot:0,carb:30,fat:0}},
  {id:"l148",name:"Sirop d erable",unit:"g",per100:{kcal:260,prot:0,carb:67,fat:0}},
  {id:"l149",name:"Compote pommes sans sucre",unit:"g",per100:{kcal:47,prot:0,carb:12,fat:0}},
  {id:"l150",name:"Barre proteinee",unit:"g",per100:{kcal:380,prot:30,carb:40,fat:10}},
  {id:"l151",name:"Yaourt aux fruits allege",unit:"g",per100:{kcal:74,prot:4,carb:13,fat:1}},
  {id:"l152",name:"Creme fraiche allegee",unit:"g",per100:{kcal:113,prot:3,carb:4,fat:10}},
  {id:"l153",name:"Creme fraiche entiere",unit:"g",per100:{kcal:292,prot:2,carb:3,fat:30}},
  {id:"l154",name:"Farine de ble",unit:"g",per100:{kcal:340,prot:10,carb:71,fat:1}},
  {id:"l155",name:"Farine d avoine",unit:"g",per100:{kcal:375,prot:13,carb:62,fat:7}},
];

const MEALS = ["Petit-déjeuner","Déjeuner","Dîner","Collation"];

const calcMacros = (per100, grams) => {
  const r = grams / 100;
  return { kcal: Math.round(per100.kcal * r), prot: Math.round(per100.prot * r * 10) / 10, carb: Math.round(per100.carb * r * 10) / 10, fat: Math.round(per100.fat * r * 10) / 10 };
};

const getMacros = (entry) => {
  if (entry.manual_macros) return entry.manual_macros;
  if (entry.per100) return calcMacros(entry.per100, entry.grams);
  const f = LOCAL_DB.find(f => f.id === entry.food_id);
  return f ? calcMacros(f.per100, entry.grams) : { kcal: 0, prot: 0, carb: 0, fat: 0 };
};

const sumMacros = (logs = []) => logs.reduce((acc, e) => {
  const m = getMacros(e);
  return { kcal: acc.kcal + m.kcal, prot: acc.prot + m.prot, carb: acc.carb + m.carb, fat: acc.fat + m.fat };
}, { kcal: 0, prot: 0, carb: 0, fat: 0 });

const parseOFF = (p) => {
  const n = p.nutriments || {};
  return {
    id: "off_" + p.code, name: p.product_name_fr || p.product_name || "Produit inconnu",
    brand: p.brands || "", unit: "g",
    per100: { kcal: Math.round(n["energy-kcal_100g"] || (n["energy_100g"] || 0) / 4.184), prot: Math.round((n.proteins_100g || 0) * 10) / 10, carb: Math.round((n.carbohydrates_100g || 0) * 10) / 10, fat: Math.round((n.fat_100g || 0) * 10) / 10 },
    source: "off", image: p.image_small_url || null
  };
};

const getMonthDays = (year, month) => {
  const days = [], d = new Date(year, month - 1, 1);
  while (d.getMonth() === month - 1) { days.push(d.toISOString().slice(0, 10)); d.setDate(d.getDate() + 1); }
  return days;
};

// ── FOOD SEARCH MODAL ─────────────────────────────────────────────────────────
const FoodModal = ({ onAdd, onClose }) => {
  const [tab, setTab] = useState("search");
  const [query, setQuery] = useState("");
  const [localRes, setLR] = useState([]);
  const [offRes, setOR] = useState([]);
  const [offLoading, setOL] = useState(false);
  const [selected, setSel] = useState(null);
  const [grams, setGrams] = useState("");
  const [meal, setMeal] = useState(0);
  const [manual, setManual] = useState({ name: "", kcal: "", prot: "", carb: "", fat: "" });
  const debRef = useRef(null);

  useEffect(() => {
    if (tab !== "search") return;
    const q = query.trim().toLowerCase();
    if (q.length < 2) { setLR([]); setOR([]); return; }
    setLR(LOCAL_DB.filter(f => f.name.toLowerCase().includes(q)).slice(0, 5));
    clearTimeout(debRef.current); setOL(true);
    debRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=8&lc=fr&cc=fr&fields=code,product_name,product_name_fr,brands,nutriments,image_small_url`);
        const data = await res.json();
        setOR((data.products || []).filter(p => p.product_name_fr || p.product_name).map(parseOFF).filter(p => p.per100.kcal > 0).slice(0, 7));
      } catch { setOR([]); } finally { setOL(false); }
    }, 700);
  }, [query, tab]);

  const preview = selected && grams ? calcMacros(selected.per100, Number(grams)) : null;

  const handleAdd = () => {
    if (tab === "manual") {
      if (!manual.name || !manual.kcal) return;
      onAdd({ name: manual.name, grams: 100, meal_idx: meal, manual_macros: { kcal: +manual.kcal, prot: +manual.prot || 0, carb: +manual.carb || 0, fat: +manual.fat || 0 }, source: "manual" });
    } else {
      if (!selected || !grams) return;
      onAdd({ name: selected.name, food_id: selected.id, grams: Number(grams), meal_idx: meal, per100: selected.per100, source: selected.source || "local" });
    }
    onClose();
  };

  const FoodItem = ({ food }) => (
    <div onClick={() => { setSel(food); setGrams(""); }} style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}`, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, background: "transparent" }}
      onMouseEnter={e => e.currentTarget.style.background = "#222"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
      {food.image && <img src={food.image} alt="" style={{ width: 32, height: 32, objectFit: "contain", borderRadius: 6, background: "#fff", flexShrink: 0 }} onError={e => e.target.style.display = "none"} />}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: C.white, fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{food.name}</div>
        {food.brand && <div style={{ color: C.textMuted, fontSize: 10 }}>{food.brand}</div>}
        <div style={{ color: C.textMuted, fontSize: 10 }}>{food.per100.kcal} kcal · 💪 {food.per100.prot}g prot</div>
      </div>
      <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 6, fontWeight: 700, background: food.source === "off" ? C.blue + "22" : C.purple + "22", color: food.source === "off" ? C.blue : C.purple }}>{food.source === "off" ? "OFF" : "BASE"}</span>
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: C.card, borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 500, maxHeight: "92vh", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}><div style={{ width: 40, height: 4, background: C.border, borderRadius: 99 }} /></div>
        <div style={{ padding: "14px 20px 0", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ color: C.white, margin: 0, fontSize: 16, fontWeight: 900 }}>Ajouter un aliment</h3>
            <button onClick={onClose} style={{ background: "#222", border: "none", color: C.textMuted, fontSize: 15, cursor: "pointer", width: 30, height: 30, borderRadius: "50%" }}>✕</button>
          </div>
          {/* Meal selector */}
          <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
            {MEALS.map((m, i) => <button key={i} onClick={() => setMeal(i)} style={{ padding: "5px 12px", borderRadius: 99, fontSize: 11, cursor: "pointer", fontWeight: 700, background: meal === i ? C.pink : "#222", color: meal === i ? C.black : C.textMuted, border: "none" }}>{m}</button>)}
          </div>
          {/* Tabs */}
          <div style={{ display: "flex", background: "#111", borderRadius: 12, padding: 3, marginBottom: 12 }}>
            {[["🔍 Recherche", "search"], ["✏️ Manuel", "manual"]].map(([label, t]) => (
              <button key={t} onClick={() => { setTab(t); setSel(null); setQuery(""); }} style={{ flex: 1, padding: "7px 4px", borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: "pointer", border: "none", background: tab === t ? C.card : "transparent", color: tab === t ? C.pink : C.textMuted }}>{label}</button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "0 20px" }}>
          {tab === "search" && !selected && (
            <>
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Poulet, skyr, oeufs…" style={{ ...inputSt, marginBottom: 10 }} autoFocus />
              {localRes.length > 0 && <div style={{ marginBottom: 10 }}><div style={{ fontSize: 9, color: C.textMuted, letterSpacing: 1, marginBottom: 6 }}>BASE LOCALE</div><div style={{ background: "#111", border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>{localRes.map(f => <FoodItem key={f.id} food={f} />)}</div></div>}
              {query.length >= 2 && <div style={{ marginBottom: 14 }}><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}><div style={{ fontSize: 9, color: C.textMuted, letterSpacing: 1 }}>OPEN FOOD FACTS</div>{offLoading && <div style={{ width: 12, height: 12, border: `2px solid ${C.border}`, borderTopColor: C.blue, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />}</div>{offRes.length > 0 ? <div style={{ background: "#111", border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>{offRes.map(f => <FoodItem key={f.id} food={f} />)}</div> : !offLoading && <div style={{ color: C.textMuted, fontSize: 12, textAlign: "center", padding: "8px 0" }}>Aucun résultat</div>}</div>}
              {query.length < 2 && <div style={{ textAlign: "center", padding: "20px 0", color: C.textMuted, fontSize: 12 }}><div style={{ fontSize: 26, marginBottom: 6 }}>🔍</div>Tape au moins 2 lettres</div>}
            </>
          )}
          {tab === "search" && selected && (
            <div>
              <button onClick={() => setSel(null)} style={{ background: "none", border: "none", color: C.textMuted, fontSize: 12, cursor: "pointer", marginBottom: 10 }}>← Retour</button>
              <div style={{ background: "#111", borderRadius: 14, padding: "11px 14px", marginBottom: 12 }}>
                <div style={{ color: C.white, fontWeight: 700, fontSize: 14 }}>{selected.name}</div>
                {selected.brand && <div style={{ color: C.textMuted, fontSize: 11 }}>{selected.brand}</div>}
                <div style={{ color: C.textMuted, fontSize: 11, marginTop: 2 }}>Pour 100g — {selected.per100.kcal} kcal · 💪 {selected.per100.prot}g</div>
              </div>
              <label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 5 }}>QUANTITÉ (g)</label>
              <input type="number" value={grams} onChange={e => setGrams(e.target.value)} placeholder="Ex : 150" autoFocus style={{ ...inputSt, fontSize: 20, marginBottom: 8 }} />
              {preview && <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                {[["⚡", `${preview.kcal} kcal`, C.yellow], ["💪", `${preview.prot}g prot`, C.green], ["🌾", `${preview.carb}g gluc`, C.blue], ["🥑", `${preview.fat}g lip`, C.pink]].map(([ico, val, color]) => (
                  <div key={val} style={{ background: color + "22", border: `1px solid ${color}44`, borderRadius: 8, padding: "4px 8px", fontSize: 11, color, fontWeight: 600 }}>{ico} {val}</div>
                ))}
              </div>}
            </div>
          )}
          {tab === "manual" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingBottom: 10 }}>
              {[["Nom de l'aliment *", "name", "text"], ["Calories (kcal) *", "kcal", "number"], ["Protéines (g)", "prot", "number"], ["Glucides (g)", "carb", "number"], ["Lipides (g)", "fat", "number"]].map(([label, key, type]) => (
                <div key={key}><label style={{ fontSize: 10, color: C.textMuted, display: "block", marginBottom: 3 }}>{label}</label><input type={type} value={manual[key]} onChange={e => setManual(p => ({ ...p, [key]: e.target.value }))} style={inputSt} /></div>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: "12px 20px 26px", flexShrink: 0 }}>
          <button onClick={handleAdd} style={{ width: "100%", padding: 13, borderRadius: 16, background: C.pink, color: C.black, fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer", opacity: ((tab === "manual" && manual.name && manual.kcal) || (tab !== "manual" && selected && grams)) ? 1 : 0.4 }}>
            + Ajouter au journal
          </button>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
      </div>
    </div>
  );
};

// ── MACRO BAR ─────────────────────────────────────────────────────────────────
const MacroBar = ({ label, value, max, color, unit = "g" }) => {
  const pct = Math.min((value / max) * 100, 100);
  const over = value > max;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, textTransform: "uppercase" }}>{label}</span>
        <span style={{ fontSize: 11, color: over ? C.red : C.white, fontWeight: 700 }}>{value}{unit} / {max}{unit}</span>
      </div>
      <div style={{ height: 6, background: "#111", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: over ? C.red : color, borderRadius: 99, transition: "width 0.5s" }} />
      </div>
    </div>
  );
};

// ── NUTRITION TRACKER (client) ────────────────────────────────────────────────
const NutritionTracker = ({ clientId, clientInfo, onBack }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeDay, setActiveDay] = useState(today);
  const [historyTab, setHistoryTab] = useState(false);

  const goals = {
    kcal: clientInfo?.calories_target || 1800,
    prot: clientInfo?.protein_target || 100,
    carb: clientInfo?.carb_target || 180,
    fat: clientInfo?.fat_target || 60,
  };

  useEffect(() => {
    if (!clientId) return;
    setLoading(true);
    supabase.from("nutrition_logs").select("*").eq("client_id", clientId).order("created_at").then(({ data }) => { setLogs(data || []); setLoading(false); });
  }, [clientId]);

  const dayLogs = logs.filter(l => l.date === activeDay);
  const totals = sumMacros(dayLogs);
  const byMeal = MEALS.map((label, i) => ({ label, entries: dayLogs.filter(e => e.meal_idx === i) }));

  const getLast7 = () => Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - i); return d.toISOString().slice(0, 10); }).reverse();

  const handleAdd = async (entry) => {
    const { data } = await supabase.from("nutrition_logs").insert([{ ...entry, client_id: clientId, date: activeDay }]).select().single();
    if (data) setLogs(l => [...l, data]);
  };

  const handleDelete = async (id) => {
    await supabase.from("nutrition_logs").delete().eq("id", id);
    setLogs(l => l.filter(x => x.id !== id));
  };

  const kcalLeft = goals.kcal - totals.kcal;
  const kcalPct = Math.min((totals.kcal / goals.kcal) * 100, 100);

  return (
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: "'Helvetica Neue', Arial, sans-serif", padding: 20 }}>
      {showModal && <FoodModal onAdd={handleAdd} onClose={() => setShowModal(false)} />}
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 14, marginBottom: 18, padding: 0 }}>← Retour</button>
      <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>🍽️ Mon journal nutrition</h2>

      {/* Date selector */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
        {getLast7().map(d => {
          const hasLogs = logs.some(l => l.date === d);
          const isToday = d === today;
          const label = isToday ? "Auj." : new Date(d).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" });
          return (
            <button key={d} onClick={() => setActiveDay(d)} style={{ padding: "8px 12px", borderRadius: 12, border: `2px solid ${activeDay === d ? C.pink : C.border}`, background: activeDay === d ? C.pink + "22" : "#111", color: activeDay === d ? C.pink : C.textMuted, fontWeight: activeDay === d ? 700 : 400, fontSize: 12, cursor: "pointer", flexShrink: 0, position: "relative" }}>
              {label}
              {hasLogs && <span style={{ position: "absolute", top: -3, right: -3, width: 7, height: 7, borderRadius: "50%", background: C.green, border: `2px solid ${C.black}` }} />}
            </button>
          );
        })}
      </div>

      {loading ? <Spinner /> : (
        <>
          {/* Calories hero */}
          <Card style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <svg width={90} height={90} style={{ transform: "rotate(-90deg)" }}>
                  <circle cx={45} cy={45} r={37} fill="none" stroke="#222" strokeWidth={7} />
                  <circle cx={45} cy={45} r={37} fill="none" stroke={kcalPct >= 100 ? C.red : C.yellow} strokeWidth={7} strokeDasharray={`${kcalPct / 100 * 2 * Math.PI * 37} ${2 * Math.PI * 37}`} strokeLinecap="round" style={{ transition: "stroke-dasharray 0.8s" }} />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: C.yellow, lineHeight: 1 }}>{Math.round(totals.kcal)}</div>
                  <div style={{ fontSize: 9, color: C.textMuted }}>KCAL</div>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>Objectif : {goals.kcal} kcal</div>
                <div style={{ padding: "8px 12px", background: kcalLeft < 0 ? C.red + "22" : C.green + "22", border: `1px solid ${kcalLeft < 0 ? C.red : C.green}44`, borderRadius: 10 }}>
                  <div style={{ fontSize: 9, color: C.textMuted, marginBottom: 1 }}>{kcalLeft < 0 ? "DÉPASSEMENT" : "RESTANT"}</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: kcalLeft < 0 ? C.red : C.green }}>{Math.abs(Math.round(kcalLeft))} kcal</div>
                </div>
              </div>
            </div>
            <MacroBar label="Protéines 💪" value={Math.round(totals.prot)} max={goals.prot} color={C.green} />
            <MacroBar label="Glucides" value={Math.round(totals.carb)} max={goals.carb} color={C.blue} />
            <MacroBar label="Lipides" value={Math.round(totals.fat)} max={goals.fat} color={C.pink} />
          </Card>

          <button onClick={() => setShowModal(true)} style={{ width: "100%", padding: 13, borderRadius: 14, background: C.pink, color: C.black, fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer", marginBottom: 16 }}>
            + Ajouter un aliment
          </button>

          {/* Meals */}
          {byMeal.map(({ label, entries }, mi) => (
            <div key={mi} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase" }}>{label}</span>
                {entries.length > 0 && <span style={{ background: C.yellow + "22", color: C.yellow, borderRadius: 99, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>{entries.reduce((s, e) => s + getMacros(e).kcal, 0)} kcal</span>}
              </div>
              {entries.length === 0
                ? <div style={{ padding: "9px 14px", border: `1px dashed ${C.border}`, borderRadius: 12, color: C.textMuted, fontSize: 12, textAlign: "center" }}>Rien de saisi</div>
                : <Card style={{ padding: 0, overflow: "hidden" }}>
                  {entries.map((e, i) => {
                    const m = getMacros(e);
                    return (
                      <div key={i} style={{ padding: "10px 14px", borderBottom: i < entries.length - 1 ? `1px solid ${C.border}` : "none" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ color: C.white, fontSize: 13, fontWeight: 600 }}>{e.name}</div>
                            <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>{e.manual_macros ? "saisie libre" : `${e.grams}g`} · 💪 {m.prot}g · 🌾 {m.carb}g · 🥑 {m.fat}g</div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontWeight: 800, fontSize: 13, color: C.yellow }}>{m.kcal} kcal</span>
                            <button onClick={() => handleDelete(e.id)} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 14 }}>✕</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </Card>
              }
            </div>
          ))}
        </>
      )}
    </div>
  );
};

// ── NUTRITION MONTHLY REPORT ──────────────────────────────────────────────────
const NutritionReport = ({ client, clientInfo, nutritionLogs, isCoach, onShare, onClose, sharedMonths = [] }) => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const days = getMonthDays(year, month);
  const monthKey = `${year}-${String(month).padStart(2, "0")}`;
  const isShared = sharedMonths.includes(monthKey);

  const goals = {
    kcal: clientInfo?.calories_target || 1800,
    prot: clientInfo?.protein_target || 100,
    carb: clientInfo?.carb_target || 180,
    fat: clientInfo?.fat_target || 60,
  };

  const daysWithLogs = days.filter(d => nutritionLogs.some(l => l.date === d));
  const loggedDays = daysWithLogs.length;
  const totalDays = days.length;

  const macroAvgs = loggedDays === 0 ? { kcal: 0, prot: 0, carb: 0, fat: 0 } : (() => {
    const sums = daysWithLogs.reduce((acc, d) => {
      const t = sumMacros(nutritionLogs.filter(l => l.date === d));
      return { kcal: acc.kcal + t.kcal, prot: acc.prot + t.prot, carb: acc.carb + t.carb, fat: acc.fat + t.fat };
    }, { kcal: 0, prot: 0, carb: 0, fat: 0 });
    return { kcal: Math.round(sums.kcal / loggedDays), prot: Math.round(sums.prot / loggedDays * 10) / 10, carb: Math.round(sums.carb / loggedDays * 10) / 10, fat: Math.round(sums.fat / loggedDays * 10) / 10 };
  })();

  const protGoalDays = daysWithLogs.filter(d => sumMacros(nutritionLogs.filter(l => l.date === d)).prot >= goals.prot).length;
  const kcalOkDays = daysWithLogs.filter(d => { const t = sumMacros(nutritionLogs.filter(l => l.date === d)); return t.kcal >= goals.kcal * 0.85 && t.kcal <= goals.kcal * 1.1; }).length;

  // Meal contribution analysis
  const mealContrib = MEALS.map((label, i) => {
    const mealLogs = nutritionLogs.filter(l => l.date >= `${year}-${String(month).padStart(2, "0")}-01` && l.date <= `${year}-${String(month).padStart(2, "0")}-31` && l.meal_idx === i);
    const total = sumMacros(mealLogs);
    return { label, kcal: total.kcal, count: new Set(mealLogs.map(l => l.date)).size };
  });
  const totalMealKcal = mealContrib.reduce((s, m) => s + m.kcal, 0);

  const maxKcal = Math.max(goals.kcal * 1.2, ...days.map(d => sumMacros(nutritionLogs.filter(l => l.date === d)).kcal));

  const prevMonth = () => { if (month === 1) { setMonth(12); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 12) { setMonth(1); setYear(y => y + 1); } else setMonth(m => m + 1); };
  const canNext = year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1);

  const generatePDF = () => {
    const lines = [
      `BILAN MENSUEL NUTRITION — ${client}`,
      `Mois : ${new Date(year, month - 1, 1).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}`,
      ``,
      `ASSIDUITÉ`,
      `Jours renseignés : ${loggedDays} / ${totalDays} (${Math.round(loggedDays / totalDays * 100)}%)`,
      ``,
      `MOYENNES QUOTIDIENNES`,
      `Calories : ${macroAvgs.kcal} kcal (objectif : ${goals.kcal})`,
      `Protéines : ${macroAvgs.prot}g (objectif : ${goals.prot}g)`,
      `Glucides : ${macroAvgs.carb}g (objectif : ${goals.carb}g)`,
      `Lipides : ${macroAvgs.fat}g (objectif : ${goals.fat}g)`,
      ``,
      `ANALYSE PROTÉINES`,
      `Objectif atteint : ${protGoalDays} jours sur ${loggedDays} (${loggedDays > 0 ? Math.round(protGoalDays / loggedDays * 100) : 0}%)`,
      ``,
      `COMPLIANCE CALORIQUE (±15%)`,
      `Dans la cible : ${kcalOkDays} / ${loggedDays} jours`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `bilan-${client}-${monthKey}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.97)", zIndex: 300, overflowY: "auto" }}>
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "20px 16px 60px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <button onClick={onClose} style={{ background: C.card, border: "none", color: C.textMuted, fontSize: 13, cursor: "pointer", padding: "7px 14px", borderRadius: 10, fontWeight: 600 }}>← Retour</button>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 2 }}>BILAN MENSUEL</div>
            <div style={{ fontSize: 14, fontWeight: 900, color: C.white }}>{client}</div>
          </div>
          {isCoach ? <button onClick={generatePDF} style={{ background: C.pink, border: "none", color: C.black, fontSize: 11, cursor: "pointer", padding: "7px 12px", borderRadius: 10, fontWeight: 700 }}>📄 Export</button> : <div style={{ width: 70 }} />}
        </div>

        {/* Month nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 20 }}>
          <button onClick={prevMonth} style={{ background: C.card, border: `1px solid ${C.border}`, color: C.textMuted, width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: 14 }}>‹</button>
          <div style={{ fontSize: 16, fontWeight: 900, color: C.white, minWidth: 180, textAlign: "center", textTransform: "capitalize" }}>
            {new Date(year, month - 1, 1).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
          </div>
          <button onClick={nextMonth} disabled={!canNext} style={{ background: canNext ? C.card : "transparent", border: `1px solid ${canNext ? C.border : "#222"}`, color: canNext ? C.textMuted : "#333", width: 32, height: 32, borderRadius: "50%", cursor: canNext ? "pointer" : "default", fontSize: 14 }}>›</button>
        </div>

        {loggedDays === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: C.textMuted }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <div>Aucune donnée pour ce mois</div>
          </div>
        ) : (
          <>
            {/* Assiduité */}
            <Card style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 12 }}>📋 ASSIDUITÉ DU SUIVI</div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <svg width={80} height={80} style={{ transform: "rotate(-90deg)" }}>
                    <circle cx={40} cy={40} r={33} fill="none" stroke="#222" strokeWidth={7} />
                    <circle cx={40} cy={40} r={33} fill="none" stroke={C.purple} strokeWidth={7} strokeDasharray={`${(loggedDays / totalDays) * 2 * Math.PI * 33} ${2 * Math.PI * 33}`} strokeLinecap="round" />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ fontSize: 16, fontWeight: 900, color: C.purple }}>{Math.round(loggedDays / totalDays * 100)}%</div>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <div style={{ flex: 1, background: C.purple + "22", border: `1px solid ${C.purple}44`, borderRadius: 10, padding: "8px", textAlign: "center" }}>
                      <div style={{ fontSize: 20, fontWeight: 900, color: C.purple }}>{loggedDays}</div>
                      <div style={{ fontSize: 9, color: C.textMuted }}>JOURS SAISIS</div>
                    </div>
                    <div style={{ flex: 1, background: "#111", border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px", textAlign: "center" }}>
                      <div style={{ fontSize: 20, fontWeight: 900, color: C.textMuted }}>{totalDays - loggedDays}</div>
                      <div style={{ fontSize: 9, color: C.textMuted }}>MANQUANTS</div>
                    </div>
                  </div>
                  {/* Heatmap */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                    {days.map(d => {
                      const hasLog = nutritionLogs.some(l => l.date === d);
                      const isFuture = d > today;
                      return <div key={d} style={{ width: 10, height: 10, borderRadius: 2, background: isFuture ? "#111" : hasLog ? C.purple : "#333", opacity: isFuture ? 0.3 : 1, border: d === today ? `1px solid ${C.pink}` : "none" }} />;
                    })}
                  </div>
                </div>
              </div>
            </Card>

            {/* Moyennes macros */}
            <Card style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 12 }}>📊 MOYENNES / JOUR RENSEIGNÉ</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 14 }}>
                {[{ l: "KCAL", v: macroAvgs.kcal, obj: goals.kcal, c: C.yellow, u: "" }, { l: "PROT", v: macroAvgs.prot, obj: goals.prot, c: C.green, u: "g" }, { l: "GLUC", v: macroAvgs.carb, obj: goals.carb, c: C.blue, u: "g" }, { l: "LIP", v: macroAvgs.fat, obj: goals.fat, c: C.pink, u: "g" }].map(s => (
                  <div key={s.l} style={{ background: s.c + "15", border: `1px solid ${s.c}33`, borderRadius: 10, padding: "8px 6px", textAlign: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: 900, color: s.c }}>{s.v}{s.u}</div>
                    <div style={{ fontSize: 8, color: C.textMuted }}>obj. {s.obj}{s.u}</div>
                    <div style={{ fontSize: 8, color: C.textMuted, marginTop: 2 }}>{s.l}</div>
                  </div>
                ))}
              </div>
              <MacroBar label="Kcal moy. vs objectif" value={macroAvgs.kcal} max={goals.kcal} color={C.yellow} unit=" kcal" />
              <MacroBar label="Protéines moy. vs objectif" value={macroAvgs.prot} max={goals.prot} color={C.green} />
            </Card>

            {/* Analyse protéines */}
            <Card style={{ marginBottom: 14, borderColor: C.green + "44" }}>
              <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 12 }}>💪 ANALYSE PROTÉINES</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 12 }}>
                {[{ l: "Objectif atteint", v: protGoalDays, c: C.green }, { l: "En dessous", v: loggedDays - protGoalDays, c: C.red }, { l: "Taux réussite", v: `${loggedDays > 0 ? Math.round(protGoalDays / loggedDays * 100) : 0}%`, c: C.purple }].map(s => (
                  <div key={s.l} style={{ background: s.c + "15", border: `1px solid ${s.c}33`, borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: s.c }}>{s.v}</div>
                    <div style={{ fontSize: 9, color: C.textMuted, marginTop: 2 }}>{s.l}</div>
                  </div>
                ))}
              </div>
              <div style={{ height: 6, background: "#111", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ width: `${loggedDays > 0 ? protGoalDays / loggedDays * 100 : 0}%`, height: "100%", background: `linear-gradient(90deg, ${C.purple}, ${C.green})`, borderRadius: 99 }} />
              </div>
            </Card>

            {/* Compliance calorique */}
            <Card style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 12 }}>⚡ COMPLIANCE CALORIQUE (±15%)</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ background: C.green + "15", border: `1px solid ${C.green}33`, borderRadius: 10, padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: C.green }}>{kcalOkDays}</div>
                  <div style={{ fontSize: 10, color: C.textMuted }}>Jours dans la cible</div>
                </div>
                <div style={{ background: C.red + "15", border: `1px solid ${C.red}33`, borderRadius: 10, padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: C.red }}>{loggedDays - kcalOkDays}</div>
                  <div style={{ fontSize: 10, color: C.textMuted }}>Jours hors cible</div>
                </div>
              </div>
            </Card>

            {/* Tendances par repas */}
            <Card style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 12 }}>🍽️ CONTRIBUTION PAR REPAS</div>
              {mealContrib.map((m, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 700 }}>{m.label}</span>
                    <span style={{ fontSize: 11, color: C.textMuted }}>{m.count} jours · {totalMealKcal > 0 ? Math.round(m.kcal / totalMealKcal * 100) : 0}%</span>
                  </div>
                  <div style={{ height: 5, background: "#111", borderRadius: 99 }}>
                    <div style={{ width: `${totalMealKcal > 0 ? Math.min(m.kcal / totalMealKcal * 100, 100) : 0}%`, height: "100%", background: [C.orange, C.blue, C.purple, C.green][i], borderRadius: 99 }} />
                  </div>
                </div>
              ))}
            </Card>

            {/* Graphique calories */}
            <Card style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 12 }}>📈 CALORIES — VUE MENSUELLE</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 70, marginBottom: 6 }}>
                {days.map(d => {
                  const kcal = sumMacros(nutritionLogs.filter(l => l.date === d)).kcal;
                  const pct = Math.min((kcal / maxKcal) * 100, 100);
                  const over = kcal > goals.kcal;
                  const isEmpty = kcal === 0;
                  const isFuture = d > today;
                  return (
                    <div key={d} style={{ flex: 1, height: "100%", display: "flex", alignItems: "flex-end" }}>
                      <div style={{ width: "100%", height: isFuture || isEmpty ? 3 : `${Math.max(pct / 100 * 70, 3)}px`, background: isFuture ? "#111" : isEmpty ? "#222" : over ? C.red : C.yellow, borderRadius: "2px 2px 0 0", opacity: isFuture ? 0.3 : isEmpty ? 0.4 : 1 }} />
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 12, fontSize: 9, color: C.textMuted }}>
                <span style={{ color: C.yellow }}>■</span> Normal
                <span style={{ color: C.red }}>■</span> Dépassement
              </div>
            </Card>

            {/* Partager / export */}
            {isCoach && (
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={generatePDF} style={{ flex: 1, padding: 13, borderRadius: 14, background: "#222", color: C.white, fontWeight: 700, border: `1px solid ${C.border}`, cursor: "pointer", fontSize: 13 }}>📄 Exporter le bilan</button>
                <button onClick={() => onShare(monthKey)} disabled={isShared} style={{ flex: 1, padding: 13, borderRadius: 14, background: isShared ? "#222" : C.pink, color: isShared ? C.textMuted : C.black, fontWeight: 700, border: "none", cursor: isShared ? "default" : "pointer", fontSize: 13 }}>
                  {isShared ? "✓ Partagé" : "Partager avec la cliente"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
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
