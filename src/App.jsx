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

// ══════════════════════════════════════════════════════════════════════════════
// MESSAGING SYSTEM
// ══════════════════════════════════════════════════════════════════════════════
const useMessages = (clientId) => {
  const [messages, setMessages] = useState([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!clientId) return;
    supabase.from("messages").select("*").eq("client_id", clientId).order("created_at").then(({ data }) => {
      setMessages(data || []);
      setUnread((data || []).filter(m => !m.read && m.sender === "client").length);
    });
    const sub = supabase.channel("messages:" + clientId)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `client_id=eq.${clientId}` },
        (payload) => { setMessages(m => [...m, payload.new]); if (payload.new.sender === "client") setUnread(u => u + 1); }
      ).subscribe();
    return () => supabase.removeChannel(sub);
  }, [clientId]);

  const sendMessage = async (clientId, content, sender) => {
    const { data } = await supabase.from("messages").insert([{ client_id: clientId, content, sender, read: false }]).select().single();
    return data;
  };

  const markRead = async (clientId, sender) => {
    await supabase.from("messages").update({ read: true }).eq("client_id", clientId).eq("sender", sender).eq("read", false);
    setUnread(0);
  };

  return { messages, unread, sendMessage, markRead };
};

const ChatScreen = ({ clientId, clientName, sender, onBack }) => {
  const { messages, sendMessage, markRead } = useMessages(clientId);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    markRead(clientId, sender === "coach" ? "client" : "coach");
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim()) return;
    await sendMessage(clientId, text.trim(), sender);
    setText("");
  };

  return (
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: "'Helvetica Neue', Arial, sans-serif", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 20, padding: 0 }}>←</button>
        <div>
          <div style={{ fontWeight: 900, fontSize: 16 }}>{clientName}</div>
          <div style={{ fontSize: 11, color: C.pink }}>💬 Messages</div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.length === 0 && <div style={{ textAlign: "center", color: C.textMuted, fontSize: 13, marginTop: 40 }}>Aucun message pour l'instant 💬</div>}
        {messages.map((m, i) => {
          const isMe = m.sender === sender;
          return (
            <div key={i} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "75%", padding: "10px 14px", borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: isMe ? C.pink : C.card, color: isMe ? C.black : C.white, fontSize: 14, lineHeight: 1.5 }}>
                {m.content}
                <div style={{ fontSize: 10, color: isMe ? C.black + "88" : C.textMuted, marginTop: 4, textAlign: "right" }}>
                  {new Date(m.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: "12px 20px 30px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 10, flexShrink: 0 }}>
        <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()} placeholder="Écrire un message..." style={{ ...inputSt, flex: 1, borderRadius: 24 }} />
        <button onClick={handleSend} style={{ background: C.pink, border: "none", borderRadius: "50%", width: 44, height: 44, color: C.black, fontSize: 20, cursor: "pointer", flexShrink: 0 }}>↑</button>
      </div>
    </div>
  );
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
    carb_target: client.carb_target || "",
    fat_target: client.fat_target || "",
  });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const avatar = form.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    await onSave(client.id, { name: form.name, avatar, goal: form.goal, sessions_per_week: parseInt(form.sessions_per_week) || 3, monthly_amount: parseFloat(form.monthly_amount) || 0, start_date: form.start_date, next_payment: form.next_payment, calories_target: parseInt(form.calories_target) || 0, protein_target: parseInt(form.protein_target) || 0, carb_target: parseInt(form.carb_target) || 0, fat_target: parseInt(form.fat_target) || 0 });
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
              <Inp label="Glucides / jour (g)" type="number" placeholder="ex: 180" value={form.carb_target} onChange={e => setForm({ ...form, carb_target: e.target.value })} />
              <Inp label="Lipides / jour (g)" type="number" placeholder="ex: 60" value={form.fat_target} onChange={e => setForm({ ...form, fat_target: e.target.value })} />
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
    setEntries([]); setWeights([]); setMeasurements([]); setAssignedWorkouts([]); setProgressPhotos([]); setPayments([]);
    setLoading(true);
    const [e, w, m, cw, pp, pay] = await Promise.all([
      supabase.from("entries").select("*").eq("client_id", clientId).order("date", { ascending: false }),
      supabase.from("weights").select("*").eq("client_id", clientId).order("date"),
      supabase.from("measurements").select("*").eq("client_id", clientId).order("date"),
      supabase.from("client_workouts").select("*, workouts(*, blocks, exercises(*))").eq("client_id", clientId),
      supabase.from("progress_photos").select("*").eq("client_id", clientId).order("date", { ascending: false }),
      supabase.from("payments").select("*").eq("client_id", clientId).order("paid_date", { ascending: false }),
    ]);
    setEntries(e.data || []); setWeights(w.data || []); setMeasurements(m.data || []);
    setAssignedWorkouts((cw.data || []).map(x => ({ workout_id: x.workout_id, scheduled_date: x.scheduled_date, workout: x.workouts })));
    setProgressPhotos(pp.data || []); setPayments(pay.data || []);
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

const useWorkouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetch = async () => {
    setLoading(true);
    const [{ data: ws }, { data: exs }] = await Promise.all([
      supabase.from("workouts").select("*").order("created_at"),
      supabase.from("exercises").select("*").order("position"),
    ]);
    if (!ws) { setLoading(false); return; }
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
      await supabase.from("exercises").insert(workout.exercises.map((e, i) => ({ workout_id: workout.id, name: e.name, sets: e.sets, reps: e.reps, rest: e.rest, note: e.note, photo: e.photo, position: i, suggested_weight: e.suggested_weight, weight_type: e.weight_type, tempo: e.tempo || "" })));
    }
    await fetch();
  };
  const deleteWorkout = async (id) => { await supabase.from("workouts").delete().eq("id", id); setWorkouts(w => w.filter(x => x.id !== id)); };
  return { workouts, loading, saveWorkout, deleteWorkout };
};
// ══════════════════════════════════════════════════════════════════════════════
// JOURNAL FORM
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
        <div>
          <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Comment tu te sens ?</div>
          <div style={{ display: "flex", gap: 8 }}>
            {feelings.map((f, i) => (
              <button key={i} onClick={() => setFeeling(i + 1)} style={{ flex: 1, padding: "12px 0", background: feeling === i + 1 ? C.pink + "22" : "#111", border: `2px solid ${feeling === i + 1 ? C.pink : C.border}`, borderRadius: 12, fontSize: 22, cursor: "pointer" }}>{f}</button>
            ))}
          </div>
          {feeling && <div style={{ textAlign: "center", fontSize: 12, color: C.textMuted, marginTop: 6 }}>{feelingLabels[feeling - 1]}</div>}
        </div>

        <Inp label="Nombre de pas" type="number" inputMode="numeric" placeholder="ex: 9500" value={steps} onChange={e => setSteps(e.target.value)} />

        <div>
          <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>💧 Hydratation (hors thé & café)</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["0.5", "1", "1.5", "2", "2.5", "3+"].map(v => {
              const val = v === "3+" ? "3" : v;
              return <button key={v} onClick={() => setHydration(val)} style={{ padding: "10px 16px", borderRadius: 12, border: `2px solid ${hydration === val ? C.blue : C.border}`, background: hydration === val ? C.blue + "22" : "#111", color: hydration === val ? C.blue : C.textMuted, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>{v} L</button>;
            })}
          </div>
        </div>

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

        <div>
          <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>📷 Photos repas</div>
          <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "#111", border: `1px dashed ${C.pink}55`, borderRadius: 10, cursor: "pointer" }}>
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
                  <img src={p} alt="" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 10 }} />
                  <button onClick={() => setPhotos(photos.filter((_, j) => j !== i))} style={{ position: "absolute", top: -6, right: -6, background: C.red, border: "none", borderRadius: "50%", width: 18, height: 18, color: "white", fontSize: 10, cursor: "pointer" }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

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

        <Btn onClick={handleSave} disabled={saving} style={{ marginBottom: 30 }}>
          {saving ? "Enregistrement..." : existing ? "💾 Mettre à jour" : "💾 Enregistrer mon journal"}
        </Btn>
      </div>
    </div>
  );
};
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
  const [newClientForm, setNewClientForm] = useState({ name: "", email: "", password: "", goal: "", start_date: "", next_payment: "", sessions_per_week: "3", monthly_amount: "", calories_target: "", protein_target: "", carb_target: "", fat_target: "" });
  const [addingClient, setAddingClient] = useState(false);
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
  const [selectedNutritionDay, setSelectedNutritionDay] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const client = clients.find(c => c.id === selected);
  const { entries, weights, measurements, assignedWorkouts, progressPhotos, payments, loading: loadingData, addEntry, updateEntry, toggleWorkout, updateScheduledDate, addPayment } = useClientData(selected);
  const { unread: unreadMessages } = useMessages(selected);
  const paymentAlerts = clients.filter(c => { const d = daysUntil(c.next_payment); return !c.is_paused && d >= 0 && d <= 5; });

  useEffect(() => {
    if (selected) {
      setSelectedNutritionDay(null);
      setShowChat(false);
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
    await addClient({ name: newClientForm.name, avatar, goal: newClientForm.goal, start_date: newClientForm.start_date, next_payment: newClientForm.next_payment, sessions_per_week: parseInt(newClientForm.sessions_per_week) || 3, monthly_amount: parseFloat(newClientForm.monthly_amount) || 0, calories_target: parseInt(newClientForm.calories_target) || 0, protein_target: parseInt(newClientForm.protein_target) || 0, carb_target: parseInt(newClientForm.carb_target) || 0, fat_target: parseInt(newClientForm.fat_target) || 0, streak: 0, today_done: false, user_id: userId });
    setAddingClient(false); setShowAddClient(false);
    setNewClientForm({ name: "", email: "", password: "", goal: "", start_date: "", next_payment: "", sessions_per_week: "3", monthly_amount: "", calories_target: "", protein_target: "", carb_target: "", fat_target: "" });
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

  const handleShareMonth = (clientId, monthKey) => {
    setSharedMonths(prev => ({ ...prev, [clientId]: [...(prev[clientId] || []), monthKey] }));
    alert("✅ Bilan partagé avec la cliente !");
  };

  if (showChat && client) return (
    <ChatScreen
      clientId={selected}
      clientName={client.name}
      sender="coach"
      onBack={() => setShowChat(false)}
    />
  );

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
                <div style={{ fontSize: 10, color: c.is_paused ? C.blue : daysUntil(c.next_payment) <= 3 ? C.yellow : C.textMuted }}>{c.is_paused ? "⏸️ En pause" : daysUntil(c.next_payment) <= 5 ? `⚠️ J-${daysUntil(c.next_payment)}` : `🔥 ${c.streak}j`}</div>
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
                    {client.next_payment && !client.is_paused && <Badge color={C.yellow}>💳 J-{daysUntil(client.next_payment)}</Badge>}
                    {client.is_paused && <Badge color={C.blue}>⏸️ En pause</Badge>}
                  </div>
                </div>
                <button onClick={() => setShowChat(true)} style={{ background: C.pink + "22", border: `1px solid ${C.pink}55`, color: C.pink, borderRadius: 10, padding: "8px 14px", fontSize: 13, cursor: "pointer", fontWeight: 700, flexShrink: 0, position: "relative" }}>
                  💬 Chat
                  {unreadMessages > 0 && <span style={{ position: "absolute", top: -6, right: -6, background: C.red, color: C.white, borderRadius: "50%", width: 18, height: 18, fontSize: 10, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{unreadMessages}</span>}
                </button>
                <button onClick={() => setEditingClient(client)} style={{ background: "#222", border: `1px solid ${C.border}`, color: C.white, borderRadius: 10, padding: "8px 14px", fontSize: 13, cursor: "pointer", fontWeight: 600, flexShrink: 0 }}>✏️</button>
              </div>

              <Tab tabs={[["journal", "📋 Journal"], ["seances", "💪 Séances"], ["perf", "📊 Perfs"], ["nutrition", "🍽️ Nutrition"], ["body", "📏 Corps"], ["paiements", "💳 Paiements"]]} active={clientTab} onChange={setClientTab} />

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
                  <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontSize: 13, color: C.textMuted }}>Logs nutrition de {client.name}</div>
                    <button onClick={() => setShowNutritionReport(true)} style={{ background: C.pink, border: "none", color: C.black, borderRadius: 10, padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>📊 Bilan mensuel</button>
                  </div>
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
                  {weights.length <= 1 && <Card><p style={{ color: C.textMuted, textAlign: "center", margin: 0 }}>Pas encore de données.</p></Card>}
                  </>)}
                </div>
              )}

              {clientTab === "paiements" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <Card>
                    <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 14 }}>📋 CONTRAT</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <div style={{ background: "#111", borderRadius: 10, padding: 12 }}><div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>DÉBUT</div><div style={{ fontWeight: 700, fontSize: 13 }}>{formatDate(client.start_date)}</div></div>
                      <div style={{ background: "#111", borderRadius: 10, padding: 12 }}><div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>MONTANT</div><div style={{ fontWeight: 700, fontSize: 18, color: C.green }}>{client.monthly_amount || "—"} €</div></div>
                    </div>
                  </Card>
                  {!showPaymentForm ? (
                    <Btn variant="green" onClick={() => setShowPaymentForm(true)}>✅ Enregistrer un paiement reçu</Btn>
                  ) : (
                    <Card style={{ borderColor: C.green + "44" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.green, marginBottom: 16 }}>✅ Nouveau paiement</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <Inp label="Montant (€)" type="number" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} />
                        <Inp label="Date de réception" type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} />
                        <Inp label="Note (optionnel)" value={paymentNote} onChange={e => setPaymentNote(e.target.value)} />
                      </div>
                      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                        <Btn variant="secondary" onClick={() => setShowPaymentForm(false)} style={{ flex: 1 }}>Annuler</Btn>
                        <Btn variant="green" onClick={handleAddPayment} disabled={addingPayment} style={{ flex: 2 }}>{addingPayment ? "Enregistrement..." : "Confirmer ✅"}</Btn>
                      </div>
                    </Card>
                  )}
                  <Card>
                    <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 14 }}>HISTORIQUE</div>
                    <PaymentHistory payments={payments} />
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showAddClient && (
        <div style={{ position: "fixed", inset: 0, background: "#000c", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 28, width: "100%", maxWidth: 420, maxHeight: "90vh", overflowY: "auto" }}>
            <h3 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 900 }}>Nouvelle cliente</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Inp label="Nom complet" value={newClientForm.name} onChange={e => setNewClientForm({ ...newClientForm, name: e.target.value })} />
              <Inp label="Email" type="email" value={newClientForm.email} onChange={e => setNewClientForm({ ...newClientForm, email: e.target.value })} />
              <Inp label="Mot de passe temporaire" type="text" value={newClientForm.password} onChange={e => setNewClientForm({ ...newClientForm, password: e.target.value })} />
              <Inp label="Objectif" value={newClientForm.goal} onChange={e => setNewClientForm({ ...newClientForm, goal: e.target.value })} />
              <Inp label="Séances par semaine" type="number" value={newClientForm.sessions_per_week} onChange={e => setNewClientForm({ ...newClientForm, sessions_per_week: e.target.value })} />
              <Inp label="Montant (€)" type="number" value={newClientForm.monthly_amount} onChange={e => setNewClientForm({ ...newClientForm, monthly_amount: e.target.value })} />
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
  const { unread: unreadMessages } = useMessages(clientId);

  const myWorkouts = assignedWorkouts
    .filter(a => a.workout || a.workouts)
    .map(a => ({ ...(a.workout || a.workouts), scheduledDate: a.scheduled_date }));

  const todayEntry = entries.find(e => e.date === today);
  const coachMsg = entries.find(e => e.coach_message)?.coach_message;
  const lastWeight = weights[weights.length - 1];
  const startWeight = weights[0];

  const handleSaveJournal = async (payload) => {
    const existingEntry = entries.find(e => e.date === payload.date);
    if (existingEntry) { await updateEntry(existingEntry.id, payload); }
    else { await addEntry({ ...payload, client_id: clientId }); }
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
    if (!("Notification" in window)) { alert("Ajoute l'app à ton écran d'accueil depuis Safari pour activer les notifications."); return; }
    const perm = await Notification.requestPermission();
    if (perm === "granted") setNotifEnabled(true);
  };

  if (screen === "messages" && clientId) return (
    <ChatScreen
      clientId={clientId}
      clientName="Mon Coach 💬"
      sender="client"
      onBack={() => setScreen("home")}
    />
  );

  if (selectedEntry) return <EntryDetail entry={selectedEntry} onBack={() => setSelectedEntry(null)} />;
  if (screen === "nutrition") return <NutritionTracker clientId={clientId} clientInfo={clientInfo} onBack={() => setScreen("home")} />;
  if (activeWorkout) return <WorkoutPlayer workout={activeWorkout} onFinish={() => { setActiveWorkout(null); supabase.from("session_logs").select("*").eq("client_id", clientId).order("date", { ascending: false }).then(({ data }) => setSessionLogs(data || [])); }} clientId={clientId} sessionLogs={sessionLogs} />;

  if (screen === "journal") {
    if (!clientId) return <div style={{ minHeight: "100vh", background: C.black, display: "flex", alignItems: "center", justifyContent: "center" }}><Spinner /></div>;
    return <JournalForm entries={entries} onSave={handleSaveJournal} onBack={() => setScreen("home")} proteinTarget={clientInfo?.protein_target || 0} clientId={clientId} />;
  }

  if (!clientInfo) return <div style={{ minHeight: "100vh", background: C.black, display: "flex", alignItems: "center", justifyContent: "center" }}><Spinner /></div>;

  if (viewingWorkoutPerfs) {
    const logs = sessionLogs.filter(l => l.workout_id === viewingWorkoutPerfs.id);
    return (
      <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: "'Helvetica Neue', Arial, sans-serif", padding: 20 }}>
        <button onClick={() => setViewingWorkoutPerfs(null)} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 14, marginBottom: 18, padding: 0 }}>← Retour</button>
        <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 4 }}>{viewingWorkoutPerfs.name}</h2>
        {logs.map((log, i) => <div key={i} style={{ marginBottom: 14 }}><PerfCard log={log} workout={viewingWorkoutPerfs} /></div>)}
      </div>
    );
  }

  if (screen === "perfs") return (
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: "'Helvetica Neue', Arial, sans-serif", padding: 20 }}>
      <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 14, marginBottom: 18, padding: 0 }}>← Retour</button>
      <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 20 }}>Mes performances 📊</h2>
      {sessionLogs.length === 0 ? <Card><p style={{ color: C.textMuted, textAlign: "center", margin: 0 }}>Pas encore de séance enregistrée.</p></Card> : sessionLogs.map((log, i) => <div key={i} style={{ marginBottom: 12 }}><PerfCard log={log} workout={myWorkouts.find(w => w.id === log.workout_id)} /></div>)}
    </div>
  );

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

        {coachMsg && (
          <Card style={{ marginBottom: 14, borderColor: C.pink + "44", background: C.pink + "08" }}>
            <div style={{ fontSize: 10, color: C.pink, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 6 }}>MESSAGE DE TON COACH</div>
            <div style={{ fontSize: 14, lineHeight: 1.5, marginBottom: 12 }}>{coachMsg}</div>
          </Card>
        )}

        <Card style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10 }}>JOURNAL DU JOUR</div>
          {!todayEntry ? (
            <><p style={{ color: C.textMuted, fontSize: 13, marginBottom: 12, marginTop: 0 }}>Tu n'as pas encore rempli ton journal.</p><Btn onClick={() => setScreen("journal")}>Commencer mon journal →</Btn></>
          ) : (
            <div>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
                <span style={{ fontSize: 30 }}>{feelings[(todayEntry.feeling || 3) - 1]}</span>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 2 }}>Rempli aujourd'hui ✅</div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>{(todayEntry.steps || 0).toLocaleString()} pas · {todayEntry.hydration || "—"}L · {todayEntry.sleep_hours || "—"}h sommeil</div>
                </div>
              </div>
              <Btn onClick={() => setScreen("journal")} variant="ghost" style={{ fontSize: 14 }}>✏️ Modifier mon journal</Btn>
            </div>
          )}
        </Card>

        {myWorkouts.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10, textTransform: "uppercase" }}>💪 Mes entraînements</div>
            {myWorkouts.map(w => (
              <Card key={w.id} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: C.orange + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>💪</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 2 }}>{w.name}</div>
                    <div style={{ fontSize: 12, color: C.textMuted }}>{w.exercises?.length || 0} exercices</div>
                  </div>
                </div>
                <Btn onClick={() => setActiveWorkout(w)} style={{ fontSize: 14 }}>▶ Commencer la séance</Btn>
              </Card>
            ))}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <Card onClick={() => setScreen("body")} style={{ cursor: "pointer" }}><div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>POIDS</div><div style={{ fontSize: 22, fontWeight: 900, color: C.pink }}>{lastWeight ? `${lastWeight.value} kg` : "—"}</div></Card>
          <Card onClick={() => setScreen("perfs")} style={{ cursor: "pointer" }}><div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>SÉANCES</div><div style={{ fontSize: 22, fontWeight: 900, color: C.purple }}>{sessionLogs.length}</div></Card>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="ghost" onClick={() => setScreen("history")} style={{ flex: 1 }}>📋 Journal</Btn>
          <Btn variant="ghost" onClick={() => setScreen("nutrition")} style={{ flex: 1 }}>🍽️ Nutrition</Btn>
          <div style={{ position: "relative", flex: 1 }}>
            <Btn variant="ghost" onClick={() => setScreen("messages")} style={{ width: "100%" }}>💬 Messages</Btn>
            {unreadMessages > 0 && <span style={{ position: "absolute", top: -6, right: -6, background: C.red, color: C.white, borderRadius: "50%", width: 18, height: 18, fontSize: 10, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{unreadMessages}</span>}
          </div>
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
          {[{ label: "Date de début", val: formatDate(clientInfo.start_date), icon: "📅" }, { label: "Séances par semaine", val: `${clientInfo.sessions_per_week || 3} séances`, icon: "💪" }, { label: "Montant toutes les 4 semaines", val: `${clientInfo.monthly_amount || "—"} €`, icon: "💶" }, { label: "Prochain paiement", val: formatDate(clientInfo.next_payment), icon: "💳" }].map(item => (
            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "#111", borderRadius: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 18 }}>{item.icon}</span><span style={{ fontSize: 13, color: C.textMuted }}>{item.label}</span></div>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{item.val}</span>
            </div>
          ))}
        </div>
      </Card>
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
        <Card><div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 12 }}>NOUVELLES MENSURATIONS</div><div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{[["chest", "Poitrine (cm)"], ["waist", "Tour de taille (cm)"], ["hips", "Hanches (cm)"], ["thighs", "Cuisses (cm)"]].map(([k, label]) => <input key={k} type="number" placeholder={label} value={newMeasure[k]} onChange={e => setNewMeasure({ ...newMeasure, [k]: e.target.value })} style={inputSt} />)}<Btn onClick={handleAddMeasure}>Enregistrer</Btn></div></Card>
      )}
      {bodyTab === "photos" && (
        <Card>
          <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 12 }}>AJOUTER UNE PHOTO</div>
          <input type="text" placeholder="Note : ex: Semaine 4, de face" value={newPhotoNote} onChange={e => setNewPhotoNote(e.target.value)} style={{ ...inputSt, marginBottom: 10 }} />
          <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "#111", border: `1px dashed ${C.pink}55`, borderRadius: 10, cursor: "pointer" }}>
            <span style={{ fontSize: 20 }}>📸</span>
            <div><div style={{ fontSize: 13, color: C.white, fontWeight: 600 }}>Photo de progression</div></div>
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleAddProgressPhoto} />
          </label>
          {progressPhotos.length > 0 && <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>{progressPhotos.map((p, i) => <div key={i}><img src={p.photo} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 12 }} /></div>)}</div>}
        </Card>
      )}
    </div>
  );

  if (screen === "history") return (
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: "'Helvetica Neue', Arial, sans-serif", padding: 20 }}>
      <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 14, marginBottom: 18, padding: 0 }}>← Retour</button>
      <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 20 }}>Mon historique</h2>
      {loading ? <Spinner /> : entries.length === 0 ? <p style={{ color: C.textMuted, textAlign: "center" }}>Aucune entrée.</p> : entries.map((e, i) => <div key={i} style={{ marginBottom: 12 }}><EntryCard e={e} onClick={() => setSelectedEntry(e)} /></div>)}
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
