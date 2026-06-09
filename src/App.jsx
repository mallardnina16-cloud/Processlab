import { useState, useEffect, useRef } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://wetjzebxuyefzvulujxl.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndldGp6ZWJ4dXllZnp2dWx1anhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0OTUxMDcsImV4cCI6MjA5MTA3MTEwN30.8DvkApXsMT7hGahVQD5kpAJdD92Tzyo7qC0nwmnGEaU";
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
    <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
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
// CHAT SIDEBAR
// ══════════════════════════════════════════════════════════════════════════════
const ChatSidebar = ({ clientId, clientName, senderRole, onClose, allClients, onSelectClient, unreadCounts }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!clientId) return;
    setMessages([]);
    supabase.from("messages").select("*").eq("client_id", clientId).order("created_at").then(({ data }) => setMessages(data || []));
    const channel = supabase.channel("chat_sidebar_" + clientId)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `client_id=eq.${clientId}` },
        (payload) => {
          setMessages(m => m.find(x => x.id === payload.new.id) ? m : [...m, payload.new]);
        }
      ).subscribe();
    return () => supabase.removeChannel(channel);
  }, [clientId]);

  useEffect(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, [messages]);

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 100); }, [clientId]);

  const handleSend = async () => {
    if (!text.trim() || sending || !clientId) return;
    setSending(true);
    const content = text.trim();
    setText("");
    await supabase.from("messages").insert([{ client_id: clientId, sender: senderRole, content }]);
    setSending(false);
  };

  const formatTime = (ts) => new Date(ts).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const formatDay = (ts) => {
    const d = new Date(ts);
    const diff = Math.floor((new Date(today) - new Date(d.toISOString().slice(0,10))) / 86400000);
    if (diff === 0) return "Aujourd'hui";
    if (diff === 1) return "Hier";
    return d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
  };

  const grouped = [];
  let lastDay = null;
  for (const msg of messages) {
    const day = msg.created_at?.slice(0, 10);
    if (day !== lastDay) { grouped.push({ type: "day", day, ts: msg.created_at }); lastDay = day; }
    grouped.push({ type: "msg", msg });
  }

  const isCoach = senderRole === "coach";

  return (
    <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 340, background: C.card, borderLeft: `1px solid ${C.border}`, display: "flex", flexDirection: "column", zIndex: 50, boxShadow: "-4px 0 30px #000a", fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: isCoach && allClients?.length > 1 ? 10 : 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, color: C.white }}>{clientName || "Chat"}</div>
              <div style={{ fontSize: 10, color: C.textMuted }}>{isCoach ? "Coach → Cliente" : "Toi → Coach"}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "#222", border: "none", color: C.textMuted, borderRadius: "50%", width: 28, height: 28, fontSize: 13, cursor: "pointer" }}>✕</button>
        </div>
        {isCoach && allClients?.length > 0 && (
          <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 2, marginTop: 8 }}>
            {allClients.map(c => (
              <button key={c.id} onClick={() => onSelectClient?.(c.id)} style={{ flexShrink: 0, padding: "4px 10px", borderRadius: 99, border: `1.5px solid ${c.id === clientId ? C.pink : C.border}`, background: c.id === clientId ? C.pink + "22" : "transparent", color: c.id === clientId ? C.pink : C.textMuted, fontSize: 11, fontWeight: c.id === clientId ? 700 : 400, cursor: "pointer", position: "relative" }}>
                {c.name.split(" ")[0]}
                {unreadCounts?.[c.id] > 0 && c.id !== clientId && (
                  <span style={{ position: "absolute", top: -4, right: -4, width: 14, height: 14, background: C.red, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 900, color: C.white }}>
                    {unreadCounts[c.id]}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px 4px" }}>
        {!clientId && <div style={{ textAlign: "center", color: C.textMuted, fontSize: 12, paddingTop: 40 }}>Sélectionne une cliente ci-dessus</div>}
        {clientId && messages.length === 0 && <div style={{ textAlign: "center", color: C.textMuted, fontSize: 12, paddingTop: 40 }}>Aucun message pour l'instant 💬</div>}
        {grouped.map((item, i) => {
          if (item.type === "day") return (
            <div key={`d${i}`} style={{ textAlign: "center", fontSize: 10, color: C.textMuted, fontWeight: 700, margin: "10px 0 6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {formatDay(item.ts)}
            </div>
          );
          const { msg } = item;
          const isMe = msg.sender === senderRole;
          return (
            <div key={msg.id || i} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", marginBottom: 8 }}>
              <div style={{ maxWidth: "80%" }}>
                <div style={{ background: isMe ? C.pink : "#272727", color: isMe ? C.black : C.white, borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px", padding: "9px 12px", fontSize: 13, lineHeight: 1.45, fontWeight: isMe ? 500 : 400 }}>
                  {msg.content}
                </div>
                <div style={{ fontSize: 9, color: C.textMuted, marginTop: 2, textAlign: isMe ? "right" : "left", paddingLeft: isMe ? 0 : 4 }}>
                  {!isMe && isCoach && <span style={{ color: C.pink, fontWeight: 700, marginRight: 4 }}>Elle</span>}
                  {formatTime(msg.created_at)}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: "10px 12px 14px", borderTop: `1px solid ${C.border}`, flexShrink: 0, display: "flex", gap: 8 }}>
        <input
          ref={inputRef}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder={clientId ? "Écrire un message… (Entrée pour envoyer)" : "Sélectionne une cliente d'abord"}
          disabled={!clientId}
          style={{ ...inputSt, flex: 1, fontSize: 13, padding: "9px 12px", borderRadius: 20, opacity: clientId ? 1 : 0.4 }}
        />
        <button onClick={handleSend} disabled={sending || !text.trim() || !clientId} style={{ background: text.trim() && clientId ? C.pink : "#333", border: "none", borderRadius: "50%", width: 38, height: 38, color: text.trim() && clientId ? C.black : C.textMuted, fontSize: 17, cursor: "pointer", flexShrink: 0, transition: "background 0.2s", display: "flex", alignItems: "center", justifyContent: "center" }}>→</button>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// WORKOUT BUILDER
// ══════════════════════════════════════════════════════════════════════════════
const newSimpleEx = () => ({ id: Date.now().toString(), type: "exercise", name: "", sets: 3, reps: "12", rest: 60, tempo: "", note: "", photo: null, suggested_weight: "", weight_type: "haltères" });
const newCircuit = () => ({ id: Date.now().toString(), type: "circuit", rounds: 3, rest_between_rounds: 120, interval_mode: false, exercises: [{ id: Date.now().toString() + "a", name: "", reps: "12", work_time: 30, rest_time: 30, tempo: "", note: "", suggested_weight: "", weight_type: "haltères" }] });
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
      <div>
        <label style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 4 }}>⏱️ Tempo (optionnel)</label>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input type="text" placeholder="ex: 3-1-2-0" value={ex.tempo || ""} onChange={e => onChange({ ...ex, tempo: e.target.value })} style={{ ...inputSt, flex: 1 }} />
          <span style={{ fontSize: 10, color: C.textMuted, flexShrink: 0, lineHeight: 1.3 }}>desc-bas-<br/>mont-haut</span>
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
  const addWarmupEx = wid => setBlocks(b => b.map(x => x.id === wid ? { ...x, exercises: [...x.exercises, { id: Date.now().toString(), name: "", reps: "", note: "", photo: null }] } : x));
  const delWarmupEx = (wid, eid) => setBlocks(b => b.map(x => x.id === wid ? { ...x, exercises: x.exercises.filter(e => e.id !== eid) } : x));
  const updWarmupEx = (wid, eid, patch) => setBlocks(b => b.map(x => x.id === wid ? { ...x, exercises: x.exercises.map(e => e.id === eid ? { ...e, ...patch } : e) } : x));

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
                  <div key={ex.id} style={{ background: "#111", borderRadius: 12, padding: 14, border: `1px solid ${C.yellow}33` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <span style={{ fontSize: 11, color: C.yellow, fontWeight: 700 }}>Exo {ei + 1}</span>
                      <button onClick={() => delWarmupEx(block.id, ex.id)} style={{ background: C.red + "22", border: "none", borderRadius: 6, width: 24, height: 24, color: C.red, cursor: "pointer", fontSize: 11 }}>✕</button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <Inp label="Nom de l'exercice" placeholder="ex: Vélo, étirements..." value={ex.name} onChange={e => updWarmupEx(block.id, ex.id, { name: e.target.value })} />
                      <Inp label="Reps / Durée" placeholder="ex: 10 reps ou 30 sec" value={ex.reps} onChange={e => updWarmupEx(block.id, ex.id, { reps: e.target.value })} />
                      <TA label="Commentaire" placeholder="Consigne, conseil..." value={ex.note} onChange={e => updWarmupEx(block.id, ex.id, { note: e.target.value })} style={{ minHeight: 48 }} />
                      <div>
                        {ex.photo ? (
                          <div style={{ position: "relative", display: "inline-block" }}>
                            <img src={ex.photo} alt="" style={{ width: 100, height: 75, objectFit: "cover", borderRadius: 10 }} />
                            <button onClick={() => updWarmupEx(block.id, ex.id, { photo: null })} style={{ position: "absolute", top: -6, right: -6, background: C.red, border: "none", borderRadius: "50%", width: 18, height: 18, color: "white", fontSize: 10, cursor: "pointer" }}>✕</button>
                          </div>
                        ) : (
                          <label style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "#111", border: `1px dashed ${C.yellow}44`, borderRadius: 10, cursor: "pointer", width: "fit-content" }}>
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
                  <button onClick={() => moveBlock(block.id, -1)} style={{ background: "#222", border: "none", borderRadius: 6, width: 26, height: 26, color: C.textMuted, cursor: "pointer" }}>↑</button>
                  <button onClick={() => moveBlock(block.id, 1)} style={{ background: "#222", border: "none", borderRadius: 6, width: 26, height: 26, color: C.textMuted, cursor: "pointer" }}>↓</button>
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
// WORKOUT PLAYER
// ══════════════════════════════════════════════════════════════════════════════
const WorkoutPlayer = ({ workout, onFinish, clientId, sessionLogs = [] }) => {
  const rawBlocks = (workout.blocks && workout.blocks.length > 0) ? workout.blocks : workout.exercises.map(e => ({ ...e, type: e.type || "exercise" }));
  const blocks = [
    ...rawBlocks.filter(b => b.type === "warmup"),
    ...rawBlocks.filter(b => b.type !== "warmup")
  ];
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
  const allExercises = blocks.flatMap(b => b.type === "circuit" ? b.exercises : (b.type === "warmup" ? b.exercises : [b]));

  const lastLog = sessionLogs.find(l => l.workout_id === workout.id);
  const lastExLogs = (() => { try { return JSON.parse(lastLog?.exercise_logs || "{}"); } catch { return {}; } })();
  const getLastPerf = (exName) => Object.values(lastExLogs).find(l => l.name === exName);
  const getAllPerfs = (exName) => sessionLogs
    .filter(l => l.workout_id === workout.id)
    .map(l => { try { const logs = JSON.parse(l.exercise_logs || "{}"); return { date: l.date, ...Object.values(logs).find(e => e.name === exName) }; } catch { return null; } })
    .filter(l => l && (l.weight || l.reps)).slice(0, 5);

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
  const goNextBlock = () => { const next = blockIdx + 1; if (next < blocks.length) { setBlockIdx(next); } else { setDone(true); } };
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

  if (currentBlock.type === "warmup") return (
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
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
            {currentBlock.tempo && <div style={{ background: C.blue + "15", border: `1px solid ${C.blue}44`, borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13 }}>⏱️ <span style={{ color: C.blue, fontWeight: 700 }}>Tempo :</span> {currentBlock.tempo}</div>}
            {(() => { const lp = getLastPerf(currentBlock.name); return lp && (lp.weight || lp.reps) ? <div style={{ background: C.purple + "15", border: `1px solid ${C.purple}44`, borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13 }}>🕐 <span style={{ color: C.purple, fontWeight: 700 }}>Dernière fois :</span> {lp.weight ? `${lp.weight}` : ""}{lp.weight && lp.reps ? " · " : ""}{lp.reps ? `${lp.reps} reps` : ""}</div> : null; })()}
            {getAllPerfs(currentBlock.name).length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <button onClick={() => setShowHistory(!showHistory)} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 12px", color: C.textMuted, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
                  📊 {showHistory ? "Masquer" : "Voir"} mon historique ({getAllPerfs(currentBlock.name).length} séances)
                </button>
                {showHistory && (
                  <div style={{ marginTop: 10, background: "#111", borderRadius: 12, padding: 12 }}>
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
            {circuitEx.tempo && <div style={{ background: C.blue + "15", border: `1px solid ${C.blue}44`, borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13 }}>⏱️ <span style={{ color: C.blue, fontWeight: 700 }}>Tempo :</span> {circuitEx.tempo}</div>}
            {(() => { const lp = getLastPerf(circuitEx.name); return lp && (lp.weight || lp.reps) ? <div style={{ background: C.purple + "15", border: `1px solid ${C.purple}44`, borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13 }}>🕐 <span style={{ color: C.purple, fontWeight: 700 }}>Dernière fois :</span> {lp.weight ? `${lp.weight}` : ""}{lp.weight && lp.reps ? " · " : ""}{lp.reps ? `${lp.reps} reps` : ""}</div> : null; })()}
            {currentBlock.interval_mode ? (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                  <div style={{ background: C.green + "15", borderRadius: 12, padding: "14px 8px", textAlign: "center", border: `1px solid ${C.green}44` }}><div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>⚡ TRAVAIL</div><div style={{ fontSize: 28, fontWeight: 900, color: C.green }}>{circuitEx.work_time}s</div></div>
                  <div style={{ background: C.orange + "15", borderRadius: 12, padding: "14px 8px", textAlign: "center", border: `1px solid ${C.orange}44` }}><div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>😴 REPOS</div><div style={{ fontSize: 28, fontWeight: 900, color: C.orange }}>{circuitEx.rest_time}s</div></div>
                </div>
                {circuitEx.note && <div style={{ background: C.pink + "0f", border: `1px solid ${C.pink}33`, borderRadius: 12, padding: 14, marginBottom: 14, fontSize: 14 }}>💡 {circuitEx.note}</div>}
                <Btn onClick={startIntervalWork} style={{ fontSize: 17, background: C.green, color: C.black }}>▶ Démarrer</Btn>
              </div>
            ) : (
              <div>
                <div style={{ background: "#111", borderRadius: 12, padding: "14px", textAlign: "center", marginBottom: 14 }}><div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>REPS</div><div style={{ fontSize: 32, fontWeight: 900, color: C.purple }}>{circuitEx.reps}</div></div>
                {circuitEx.note && <div style={{ background: C.pink + "0f", border: `1px solid ${C.pink}33`, borderRadius: 12, padding: 14, marginBottom: 14, fontSize: 14 }}>💡 {circuitEx.note}</div>}
                <Btn onClick={advanceCircuit} style={{ fontSize: 17, background: C.purple, color: C.white }}>✅ Exo suivant →</Btn>
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

// ═══════════════════════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════════════════════
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
    const [{ data: ws }, { data: exs }] = await Promise.all([
      supabase.from("workouts").select("id, name, description, created_at").order("created_at"),
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

// ═══════════════════════════════════════════════════════════════════════════════
// JOURNAL FORM + PERF CARD + ENTRY COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════
const JournalForm = ({ onSave, existingEntry }) => {
  const [status, setStatus] = useState(existingEntry?.status || "");
  const [feeling, setFeeling] = useState(existingEntry?.feeling ?? null);
  const [note, setNote] = useState(existingEntry?.note || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!status) return alert("Choisis un statut !");
    setSaving(true);
    await onSave({ status, feeling, note, date: today });
    setSaving(false);
  };

  return (
    <Card>
      <div style={{ fontSize: 11, color: "#E8879C", fontWeight: 700, marginBottom: 14, letterSpacing: "0.1em" }}>JOURNAL DU JOUR</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <div style={{ fontSize: 11, color: "#888888", fontWeight: 700, marginBottom: 10 }}>STATUT</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {SESSION_OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => setStatus(opt.value)} style={{ padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${status === opt.value ? opt.color : "#2a2a2a"}`, background: status === opt.value ? opt.color + "22" : "transparent", color: status === opt.value ? opt.color : "#888888", fontWeight: status === opt.value ? 700 : 400, fontSize: 14, cursor: "pointer", textAlign: "left" }}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        {status === "done" && (
          <div>
            <div style={{ fontSize: 11, color: "#888888", fontWeight: 700, marginBottom: 10 }}>RESSENTI</div>
            <div style={{ display: "flex", gap: 10 }}>
              {feelings.map((f, i) => (
                <button key={i} onClick={() => setFeeling(i)} style={{ flex: 1, padding: "10px 4px", borderRadius: 12, border: `1.5px solid ${feeling === i ? "#E8879C" : "#2a2a2a"}`, background: feeling === i ? "#E8879C22" : "transparent", fontSize: 22, cursor: "pointer" }} title={feelingLabels[i]}>{f}</button>
              ))}
            </div>
            {feeling !== null && <div style={{ fontSize: 11, color: "#888888", textAlign: "center", marginTop: 6 }}>{feelingLabels[feeling]}</div>}
          </div>
        )}
        <TA label="Note" placeholder="Comment s'est passée ta séance ?" value={note} onChange={e => setNote(e.target.value)} style={{ minHeight: 80 }} />
        <Btn onClick={handleSave} disabled={saving}>{saving ? "Enregistrement..." : existingEntry ? "✏️ Modifier" : "✅ Enregistrer"}</Btn>
      </div>
    </Card>
  );
};

const PerfCard = ({ log }) => {
  if (!log) return null;
  let enrichedLogs = [];
  try {
    const raw = JSON.parse(log.exercise_logs || "{}");
    enrichedLogs = Object.values(raw);
  } catch { return null; }
  if (!enrichedLogs.length) return null;
  return (
    <Card style={{ marginTop: 12 }}>
      <div style={{ fontSize: 11, color: "#888888", fontWeight: 700, marginBottom: 12 }}>💪 PERFS — {log.workout_name}</div>
      {log.note && <div style={{ background: "#111", borderRadius: 10, padding: "10px 12px", marginBottom: 12, fontSize: 13, color: "#888888", fontStyle: "italic" }}>"{log.note}"</div>}
      {enrichedLogs.filter(l => l.weight || l.reps || l.series?.length).map((exLog, i) => (
        <div key={i} style={{ padding: "10px 12px", background: "#111", borderRadius: 10, marginBottom: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: exLog.series?.length > 0 ? 8 : 0 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{exLog.name}</div>
              {exLog.suggested_weight && <div style={{ fontSize: 11, color: "#888888" }}>Suggéré : {exLog.suggested_weight} {exLog.weight_type}</div>}
            </div>
          </div>
          {exLog.series && exLog.series.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {exLog.series.map((s, si) => (
                (s.weight || s.reps) && (
                  <div key={si} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ fontSize: 10, color: "#888888", minWidth: 48 }}>Série {si + 1}</span>
                    {s.weight && <span style={{ fontWeight: 800, color: "#E8879C", fontSize: 13 }}>{s.weight}</span>}
                    {s.weight && s.reps && <span style={{ color: "#888888", fontSize: 11 }}>·</span>}
                    {s.reps && <span style={{ fontWeight: 800, color: "#a78bfa", fontSize: 13 }}>{s.reps} reps</span>}
                  </div>
                )
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", gap: 12 }}>
              {exLog.weight && <div style={{ textAlign: "center" }}><div style={{ fontSize: 10, color: "#888888", marginBottom: 1 }}>POIDS</div><div style={{ fontWeight: 800, color: "#E8879C", fontSize: 14 }}>{exLog.weight}</div></div>}
              {exLog.reps && <div style={{ textAlign: "center" }}><div style={{ fontSize: 10, color: "#888888", marginBottom: 1 }}>REPS</div><div style={{ fontWeight: 800, color: "#a78bfa", fontSize: 14 }}>{exLog.reps}</div></div>}
            </div>
          )}
        </div>
      ))}
    </Card>
  );
};

const EntryDetail = ({ entry, sessionLogs, onEdit }) => {
  const log = sessionLogs.find(l => l.date === entry.date);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{formatDate(entry.date)}</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Badge color={sessionColor(entry.status)}>{sessionLabel(entry.status)}</Badge>
            <button onClick={onEdit} style={{ background: "#222", border: "none", borderRadius: 8, padding: "6px 10px", color: "#888888", fontSize: 12, cursor: "pointer" }}>✏️</button>
          </div>
        </div>
        {entry.feeling !== null && entry.feeling !== undefined && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: "#888888", marginBottom: 6 }}>RESSENTI</div>
            <span style={{ fontSize: 24 }}>{feelings[entry.feeling]}</span>
            <span style={{ fontSize: 12, color: "#888888", marginLeft: 8 }}>{feelingLabels[entry.feeling]}</span>
          </div>
        )}
        {entry.note && <div style={{ background: "#111", borderRadius: 10, padding: "10px 12px", fontSize: 13, color: "#888888", fontStyle: "italic" }}>"{entry.note}"</div>}
      </Card>
      <PerfCard log={log} />
    </div>
  );
};

const EntryCard = ({ entry, onClick }) => (
  <Card onClick={onClick} style={{ cursor: "pointer" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{formatDate(entry.date)}</div>
        <Badge color={sessionColor(entry.status)}>{sessionLabel(entry.status)}</Badge>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {entry.feeling !== null && entry.feeling !== undefined && <span style={{ fontSize: 20 }}>{feelings[entry.feeling]}</span>}
        <span style={{ color: "#888888", fontSize: 18 }}>›</span>
      </div>
    </div>
  </Card>
);

const PaymentHistory = ({ payments }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    {payments.map(p => (
      <Card key={p.id}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{p.amount}€</div>
            <div style={{ fontSize: 12, color: "#888888", marginTop: 2 }}>Payé le {formatDate(p.paid_date)}</div>
            {p.note && <div style={{ fontSize: 12, color: "#888888", marginTop: 2 }}>{p.note}</div>}
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#888888" }}>Prochain</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: daysUntil(p.next_due_date) <= 7 ? "#f87171" : "#4ade80" }}>{formatDate(p.next_due_date)}</div>
          </div>
        </div>
      </Card>
    ))}
  </div>
);

const PauseModal = ({ client, onClose, onPause, onResume }) => {
  const [pauseStart, setPauseStart] = useState(today);
  const [pauseEnd, setPauseEnd] = useState("");

  if (client.paused) {
    return (
      <div style={{ position: "fixed", inset: 0, background: "#000a", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
        <div style={{ background: "#1a1a1a", borderRadius: "20px 20px 0 0", padding: 24, width: "100%", maxWidth: 480 }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>⏸ Cliente en pause</div>
          <div style={{ fontSize: 13, color: "#888888", marginBottom: 6 }}>Pause du {formatDate(client.pause_start)} au {formatDate(client.pause_end)}</div>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <Btn variant="ghost" onClick={onClose} style={{ flex: 1 }}>Annuler</Btn>
            <Btn variant="green" onClick={onResume} style={{ flex: 1 }}>▶ Reprendre</Btn>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000a", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ background: "#1a1a1a", borderRadius: "20px 20px 0 0", padding: 24, width: "100%", maxWidth: 480 }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>⏸ Mettre en pause</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Inp label="Début de la pause" type="date" value={pauseStart} onChange={e => setPauseStart(e.target.value)} />
          <Inp label="Fin de la pause" type="date" value={pauseEnd} onChange={e => setPauseEnd(e.target.value)} />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <Btn variant="ghost" onClick={onClose} style={{ flex: 1 }}>Annuler</Btn>
          <Btn onClick={() => onPause(pauseStart, pauseEnd)} style={{ flex: 1 }}>⏸ Confirmer</Btn>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// NUTRITION DAY HISTORY
// ═══════════════════════════════════════════════════════════════════════════════
const NutritionDayHistory = ({ clientId, date, onClose }) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      const { data } = await supabase.from("nutrition_logs").select("*").eq("client_id", clientId).eq("date", date).order("created_at");
      setMeals(data || []);
      setLoading(false);
    };
    fetchMeals();
  }, [clientId, date]);

  const total = meals.reduce((acc, m) => ({ kcal: acc.kcal + (m.kcal || 0), prot: acc.prot + (m.prot || 0), carb: acc.carb + (m.carb || 0), fat: acc.fat + (m.fat || 0) }), { kcal: 0, prot: 0, carb: 0, fat: 0 });

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000a", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ background: "#1a1a1a", borderRadius: "20px 20px 0 0", padding: 24, width: "100%", maxWidth: 480, maxHeight: "80vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>📅 {formatDate(date)}</div>
          <button onClick={onClose} style={{ background: "#222", border: "none", borderRadius: "50%", width: 28, height: 28, color: "#888888", cursor: "pointer" }}>✕</button>
        </div>
        {loading ? <Spinner /> : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 }}>
              {[["kcal", "KCAL", "#E8879C"], ["prot", "PROT", "#4ade80"], ["carb", "GLUCIDES", "#60a5fa"], ["fat", "LIPIDES", "#fbbf24"]].map(([k, l, c]) => (
                <div key={k} style={{ background: "#111", borderRadius: 10, padding: "10px 6px", textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: "#888888", fontWeight: 700, marginBottom: 2 }}>{l}</div>
                  <div style={{ fontWeight: 900, color: c, fontSize: 15 }}>{Math.round(total[k])}</div>
                </div>
              ))}
            </div>
            {meals.map((m, i) => (
              <div key={i} style={{ background: "#111", borderRadius: 10, padding: "10px 12px", marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{m.food_name}</div>
                    <div style={{ fontSize: 11, color: "#888888", marginTop: 2 }}>{m.quantity}{m.unit === "piece" ? " pièce(s)" : "g"} · {m.meal_type}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 800, color: "#E8879C", fontSize: 14 }}>{Math.round(m.kcal)} kcal</div>
                    <div style={{ fontSize: 11, color: "#888888" }}>{Math.round(m.prot)}p · {Math.round(m.carb)}g · {Math.round(m.fat)}l</div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LOCAL FOOD DATABASE (Ciqual 2020)
// ═══════════════════════════════════════════════════════════════════════════════
const LOCAL_DB = [
  // VIANDES & VOLAILLES
  {id:"l1",name:"Poulet grille sans peau",unit:"g",per100:{kcal:165,prot:31,carb:0,fat:4}},
  {id:"l2",name:"Dinde grille",unit:"g",per100:{kcal:153,prot:30,carb:0,fat:3}},
  {id:"l3",name:"Boeuf haché 5% MG",unit:"g",per100:{kcal:121,prot:21,carb:0,fat:4}},
  {id:"l4",name:"Boeuf haché 15% MG",unit:"g",per100:{kcal:172,prot:19,carb:0,fat:10}},
  {id:"l5",name:"Steak boeuf grillé",unit:"g",per100:{kcal:194,prot:26,carb:0,fat:10}},
  {id:"l6",name:"Escalope veau",unit:"g",per100:{kcal:113,prot:22,carb:0,fat:3}},
  {id:"l7",name:"Porc filet grillé",unit:"g",per100:{kcal:143,prot:25,carb:0,fat:4}},
  // POISSONS & FRUITS DE MER
  {id:"l10",name:"Saumon cuit",unit:"g",per100:{kcal:208,prot:20,carb:0,fat:13}},
  {id:"l11",name:"Thon en boite naturel",unit:"g",per100:{kcal:116,prot:26,carb:0,fat:1}},
  {id:"l12",name:"Cabillaud cuit",unit:"g",per100:{kcal:96,prot:21,carb:0,fat:1}},
  {id:"l13",name:"Crevettes cuites",unit:"g",per100:{kcal:99,prot:21,carb:0,fat:1}},
  {id:"l14",name:"Sardines en boite huile",unit:"g",per100:{kcal:208,prot:25,carb:0,fat:11}},
  {id:"l15",name:"Maquereau cuit",unit:"g",per100:{kcal:239,prot:19,carb:0,fat:17}},
  {id:"l16",name:"Tilapia cuit",unit:"g",per100:{kcal:128,prot:26,carb:0,fat:3}},
  // OEUFS
  {id:"l30",name:"Oeuf entier cuit",unit:"g",piece_weight:60,per100:{kcal:155,prot:13,carb:1,fat:11}},
  {id:"l31",name:"Blanc d oeuf cuit",unit:"g",piece_weight:35,per100:{kcal:52,prot:11,carb:1,fat:0}},
  {id:"l32",name:"Omelette nature",unit:"g",piece_weight:150,per100:{kcal:154,prot:11,carb:0,fat:12}},
  // PRODUITS LAITIERS
  {id:"l40",name:"Yaourt nature 0%",unit:"g",per100:{kcal:46,prot:5,carb:6,fat:0}},
  {id:"l41",name:"Yaourt grec 0%",unit:"g",per100:{kcal:66,prot:10,carb:5,fat:0}},
  {id:"l42",name:"Fromage blanc 0%",unit:"g",per100:{kcal:51,prot:8,carb:4,fat:0}},
  {id:"l43",name:"Lait demi-ecreme",unit:"g",per100:{kcal:46,prot:3,carb:5,fat:2}},
  {id:"l44",name:"Mozzarella",unit:"g",per100:{kcal:280,prot:18,carb:3,fat:22}},
  {id:"l45",name:"Cottage cheese",unit:"g",per100:{kcal:98,prot:11,carb:3,fat:5}},
  {id:"l46",name:"Parmesan rape",unit:"g",per100:{kcal:431,prot:38,carb:0,fat:29}},
  {id:"l47",name:"Skyr nature",unit:"g",per100:{kcal:63,prot:11,carb:4,fat:0}},
  // GLUCIDES & CÉRÉALES
  {id:"l50",name:"Riz blanc cuit",unit:"g",per100:{kcal:130,prot:3,carb:28,fat:0}},
  {id:"l51",name:"Riz basmati cuit",unit:"g",per100:{kcal:121,prot:3,carb:26,fat:0}},
  {id:"l52",name:"Patate douce cuite",unit:"g",per100:{kcal:90,prot:2,carb:21,fat:0}},
  {id:"l53",name:"Pomme de terre cuite",unit:"g",per100:{kcal:79,prot:2,carb:18,fat:0}},
  {id:"l54",name:"Pates cuites",unit:"g",per100:{kcal:157,prot:6,carb:31,fat:1}},
  {id:"l55",name:"Quinoa cuit",unit:"g",per100:{kcal:120,prot:4,carb:21,fat:2}},
  {id:"l56",name:"Flocons avoine",unit:"g",per100:{kcal:375,prot:13,carb:61,fat:7}},
  {id:"l57",name:"Pain complet",unit:"g",per100:{kcal:239,prot:9,carb:44,fat:3}},
  {id:"l58",name:"Pain blanc",unit:"g",per100:{kcal:265,prot:9,carb:51,fat:3}},
  {id:"l59",name:"Lentilles cuites",unit:"g",per100:{kcal:116,prot:9,carb:20,fat:0}},
  {id:"l60",name:"Pois chiches cuits",unit:"g",per100:{kcal:164,prot:9,carb:27,fat:3}},
  {id:"l61",name:"Haricots rouges cuits",unit:"g",per100:{kcal:127,prot:9,carb:23,fat:1}},
  {id:"l62",name:"Wrap farine ble",unit:"g",per100:{kcal:300,prot:9,carb:49,fat:7}},
  {id:"l63",name:"Tortilla mais",unit:"g",per100:{kcal:218,prot:5,carb:45,fat:3}},
  {id:"l64",name:"Corn flakes nature",unit:"g",per100:{kcal:376,prot:7,carb:84,fat:1}},
  {id:"l65",name:"Muesli sans sucre",unit:"g",per100:{kcal:368,prot:11,carb:58,fat:8}},
  {id:"l66",name:"Galette de riz souffle",unit:"g",piece_weight:9,per100:{kcal:385,prot:7,carb:83,fat:1}},
  // MATIÈRES GRASSES & HUILES
  {id:"l70",name:"Huile olive",unit:"g",per100:{kcal:900,prot:0,carb:0,fat:100}},
  {id:"l71",name:"Huile de coco",unit:"g",per100:{kcal:897,prot:0,carb:0,fat:100}},
  {id:"l72",name:"Beurre",unit:"g",per100:{kcal:717,prot:1,carb:1,fat:81}},
  {id:"l73",name:"Amandes",unit:"g",per100:{kcal:579,prot:21,carb:22,fat:50}},
  {id:"l74",name:"Noix",unit:"g",per100:{kcal:654,prot:15,carb:14,fat:65}},
  {id:"l75",name:"Noisettes",unit:"g",per100:{kcal:628,prot:15,carb:17,fat:61}},
  {id:"l76",name:"Beurre amande",unit:"g",per100:{kcal:614,prot:21,carb:19,fat:56}},
  {id:"l77",name:"Beurre cacahuete",unit:"g",per100:{kcal:598,prot:25,carb:20,fat:51}},
  {id:"l78",name:"Graines chia",unit:"g",per100:{kcal:486,prot:17,carb:42,fat:31}},
  {id:"l79",name:"Graines lin",unit:"g",per100:{kcal:534,prot:18,carb:29,fat:42}},
  // LÉGUMES
  {id:"l80",name:"Brocoli cuit",unit:"g",per100:{kcal:28,prot:3,carb:5,fat:0}},
  {id:"l81",name:"Epinards cuits",unit:"g",per100:{kcal:23,prot:3,carb:4,fat:0}},
  {id:"l82",name:"Courgette cuite",unit:"g",per100:{kcal:16,prot:1,carb:3,fat:0}},
  {id:"l83",name:"Haricots verts cuits",unit:"g",per100:{kcal:22,prot:2,carb:5,fat:0}},
  {id:"l84",name:"Tomate",unit:"g",piece_weight:120,per100:{kcal:18,prot:1,carb:4,fat:0}},
  {id:"l85",name:"Concombre",unit:"g",per100:{kcal:12,prot:1,carb:2,fat:0}},
  {id:"l86",name:"Salade verte",unit:"g",per100:{kcal:15,prot:1,carb:3,fat:0}},
  {id:"l87",name:"Poivron rouge",unit:"g",piece_weight:150,per100:{kcal:31,prot:1,carb:6,fat:0}},
  {id:"l88",name:"Carotte cuite",unit:"g",per100:{kcal:41,prot:1,carb:10,fat:0}},
  {id:"l89",name:"Avocat",unit:"g",piece_weight:150,per100:{kcal:160,prot:2,carb:9,fat:15}},
  {id:"l90",name:"Champignon de Paris",unit:"g",per100:{kcal:22,prot:3,carb:4,fat:0}},
  {id:"l91",name:"Asperges cuites",unit:"g",per100:{kcal:20,prot:2,carb:4,fat:0}},
  {id:"l92",name:"Chou-fleur cuit",unit:"g",per100:{kcal:22,prot:2,carb:5,fat:0}},
  {id:"l93",name:"Aubergine cuite",unit:"g",per100:{kcal:25,prot:1,carb:6,fat:0}},
  {id:"l94",name:"Fenouil",unit:"g",per100:{kcal:31,prot:1,carb:7,fat:0}},
  {id:"l95",name:"Betterave rouge",unit:"g",per100:{kcal:43,prot:2,carb:10,fat:0}},
  // FRUITS
  {id:"l101",name:"Banane",unit:"g",piece_weight:120,per100:{kcal:89,prot:1,carb:23,fat:0}},
  {id:"l102",name:"Pomme",unit:"g",piece_weight:150,per100:{kcal:52,prot:0,carb:14,fat:0}},
  {id:"l103",name:"Orange",unit:"g",piece_weight:180,per100:{kcal:47,prot:1,carb:12,fat:0}},
  {id:"l104",name:"Fraises",unit:"g",per100:{kcal:32,prot:1,carb:8,fat:0}},
  {id:"l105",name:"Myrtilles",unit:"g",per100:{kcal:57,prot:1,carb:14,fat:0}},
  {id:"l106",name:"Framboises",unit:"g",per100:{kcal:52,prot:1,carb:12,fat:1}},
  {id:"l107",name:"Ananas",unit:"g",per100:{kcal:50,prot:1,carb:13,fat:0}},
  {id:"l108",name:"Mangue",unit:"g",per100:{kcal:60,prot:1,carb:15,fat:0}},
  {id:"l109",name:"Kiwi",unit:"g",piece_weight:70,per100:{kcal:61,prot:1,carb:15,fat:1}},
  {id:"l110",name:"Raisin",unit:"g",per100:{kcal:69,prot:1,carb:18,fat:0}},
  {id:"l111",name:"Poire",unit:"g",piece_weight:170,per100:{kcal:57,prot:0,carb:15,fat:0}},
  {id:"l112",name:"Peche",unit:"g",piece_weight:150,per100:{kcal:39,prot:1,carb:10,fat:0}},
  {id:"l113",name:"Cerise",unit:"g",per100:{kcal:63,prot:1,carb:16,fat:0}},
  {id:"l114",name:"Pastèque",unit:"g",per100:{kcal:30,prot:1,carb:8,fat:0}},
  {id:"l115",name:"Melon",unit:"g",per100:{kcal:34,prot:1,carb:9,fat:0}},
  {id:"l116",name:"Abricot",unit:"g",piece_weight:40,per100:{kcal:48,prot:1,carb:11,fat:0}},
  {id:"l117",name:"Prune",unit:"g",piece_weight:50,per100:{kcal:46,prot:1,carb:11,fat:0}},
  // PRODUITS TRANSFORMÉS & SNACKS
  {id:"l120",name:"Whey proteine",unit:"g",per100:{kcal:373,prot:75,carb:9,fat:5}},
  {id:"l121",name:"Proteines vegetales",unit:"g",per100:{kcal:368,prot:70,carb:12,fat:5}},
  {id:"l130",name:"Chocolat noir 70%",unit:"g",per100:{kcal:598,prot:10,carb:42,fat:43}},
  {id:"l131",name:"Miel",unit:"g",per100:{kcal:304,prot:0,carb:82,fat:0}},
  {id:"l132",name:"Sirop erable",unit:"g",per100:{kcal:260,prot:0,carb:67,fat:0}},
  {id:"l133",name:"Confiture",unit:"g",per100:{kcal:250,prot:0,carb:65,fat:0}},
  {id:"l134",name:"Sauce tomate",unit:"g",per100:{kcal:34,prot:2,carb:7,fat:0}},
  {id:"l135",name:"Ketchup",unit:"g",per100:{kcal:112,prot:1,carb:26,fat:0}},
  {id:"l136",name:"Mayonnaise",unit:"g",per100:{kcal:680,prot:1,carb:3,fat:74}},
  {id:"l137",name:"Humus",unit:"g",per100:{kcal:166,prot:8,carb:14,fat:10}},
  {id:"l138",name:"Compote pomme sans sucre",unit:"g",per100:{kcal:47,prot:0,carb:12,fat:0}},
  {id:"l139",name:"Crepe nature",unit:"g",piece_weight:80,per100:{kcal:200,prot:5,carb:27,fat:8}},
  {id:"l140",name:"Pancake avoine",unit:"g",per100:{kcal:230,prot:9,carb:35,fat:7}},
  {id:"l150",name:"Barre proteinee",unit:"g",piece_weight:60,per100:{kcal:380,prot:30,carb:40,fat:10}},
  {id:"l151",name:"Yaourt proteines",unit:"g",per100:{kcal:73,prot:10,carb:6,fat:1}},
  {id:"l152",name:"Fromage blanc 20%",unit:"g",per100:{kcal:79,prot:8,carb:4,fat:4}},
  {id:"l153",name:"Tofu ferme",unit:"g",per100:{kcal:76,prot:8,carb:2,fat:4}},
  {id:"l154",name:"Edamame",unit:"g",per100:{kcal:121,prot:11,carb:9,fat:5}},
  {id:"l155",name:"Tempeh",unit:"g",per100:{kcal:195,prot:20,carb:8,fat:11}},
];

const MEALS = ["Petit-déjeuner", "Déjeuner", "Collation", "Dîner", "Autre"];

const calcMacros = (item, qty, unit) => {
  if (unit === "piece" && item.piece_weight) {
    const grams = qty * item.piece_weight;
    return { kcal: (item.per100.kcal * grams) / 100, prot: (item.per100.prot * grams) / 100, carb: (item.per100.carb * grams) / 100, fat: (item.per100.fat * grams) / 100 };
  }
  return { kcal: (item.per100.kcal * qty) / 100, prot: (item.per100.prot * qty) / 100, carb: (item.per100.carb * qty) / 100, fat: (item.per100.fat * qty) / 100 };
};

const getMacros = (food, qty, unit) => {
  if (unit === "piece" && food.piece_weight) {
    const g = qty * food.piece_weight;
    return { kcal: Math.round((food.per100.kcal * g) / 100), prot: Math.round((food.per100.prot * g) / 100), carb: Math.round((food.per100.carb * g) / 100), fat: Math.round((food.per100.fat * g) / 100) };
  }
  return { kcal: Math.round((food.per100.kcal * qty) / 100), prot: Math.round((food.per100.prot * qty) / 100), carb: Math.round((food.per100.carb * qty) / 100), fat: Math.round((food.per100.fat * qty) / 100) };
};

const sumMacros = (logs) => logs.reduce((acc, l) => ({ kcal: acc.kcal + (l.kcal || 0), prot: acc.prot + (l.prot || 0), carb: acc.carb + (l.carb || 0), fat: acc.fat + (l.fat || 0) }), { kcal: 0, prot: 0, carb: 0, fat: 0 });

const parseOFF = (p) => {
  if (!p?.nutriments) return null;
  const n = p.nutriments;
  return { name: p.product_name || p.product_name_fr || "Produit inconnu", per100: { kcal: Math.round(n["energy-kcal_100g"] || n["energy_100g"] / 4.184 || 0), prot: Math.round(n.proteins_100g || 0), carb: Math.round(n.carbohydrates_100g || 0), fat: Math.round(n.fat_100g || 0) } };
};

const getMonthDays = (year, month) => {
  const days = [];
  const d = new Date(year, month, 1);
  while (d.getMonth() === month) { days.push(new Date(d).toISOString().slice(0, 10)); d.setDate(d.getDate() + 1); }
  return days;
};

const MacroBar = ({ kcal, prot, carb, fat, targetKcal = 0, targetProt = 0, targetCarb = 0, targetFat = 0 }) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
    {[["kcal", "KCAL", "#E8879C", kcal, targetKcal], ["prot", "PROT", "#4ade80", prot, targetProt], ["carb", "GLUCIDES", "#60a5fa", carb, targetCarb], ["fat", "LIPIDES", "#fbbf24", fat, targetFat]].map(([k, label, color, val, tgt]) => (
      <div key={k} style={{ background: "#111", borderRadius: 12, padding: "10px 6px", textAlign: "center" }}>
        <div style={{ fontSize: 9, color: "#888888", fontWeight: 700, marginBottom: 2, letterSpacing: "0.05em" }}>{label}</div>
        <div style={{ fontWeight: 900, color: color, fontSize: 17, lineHeight: 1 }}>{Math.round(val)}</div>
        {tgt > 0 && <div style={{ fontSize: 9, color: "#555555", marginTop: 2 }}>/{tgt}</div>}
      </div>
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// FOOD MODAL
// ═══════════════════════════════════════════════════════════════════════════════
const FoodModal = ({ onAdd, onClose, clientId }) => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState("g");
  const [meal, setMeal] = useState(MEALS[0]);
  const [offResults, setOffResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [customFoods, setCustomFoods] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [tab, setTab] = useState("local");
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customPer100, setCustomPer100] = useState({ kcal: "", prot: "", carb: "", fat: "" });

  useEffect(() => {
    if (clientId) {
      supabase.from("custom_foods").select("*").eq("client_id", clientId).then(({ data }) => setCustomFoods(data || []));
      supabase.from("food_favorites").select("*").eq("client_id", clientId).then(({ data }) => setFavorites(data || []));
    }
  }, [clientId]);

  const searchOFF = async () => {
    if (!search.trim()) return;
    setSearching(true);
    try {
      const r = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(search)}&search_simple=1&action=process&json=1&page_size=10&fields=product_name,product_name_fr,nutriments,brands`);
      const d = await r.json();
      setOffResults((d.products || []).filter(p => p.nutriments && p["product_name"]).slice(0, 8));
    } catch { setOffResults([]); }
    setSearching(false);
  };

  const localFiltered = LOCAL_DB.filter(f => f.name.toLowerCase().includes(search.toLowerCase())).slice(0, 15);
  const customFiltered = customFoods.filter(f => f.name.toLowerCase().includes(search.toLowerCase())).slice(0, 10);
  const favFiltered = favorites.filter(f => f.food_name.toLowerCase().includes(search.toLowerCase())).slice(0, 10);

  const selectFood = (food, isParsed = false) => {
    setSelected(isParsed ? food : food);
    setUnit(food.piece_weight ? "piece" : "g");
    setQty(food.piece_weight ? "1" : "100");
  };

  const handleAdd = () => {
    if (!selected || !qty) return;
    const q = parseFloat(qty);
    if (isNaN(q) || q <= 0) return;
    const macros = getMacros(selected, q, unit);
    onAdd({ food_name: selected.name, quantity: q, unit, meal_type: meal, ...macros });
    onClose();
  };

  const handleAddCustom = async () => {
    if (!customName.trim()) return;
    const food = { name: customName, unit: "g", per100: { kcal: parseFloat(customPer100.kcal) || 0, prot: parseFloat(customPer100.prot) || 0, carb: parseFloat(customPer100.carb) || 0, fat: parseFloat(customPer100.fat) || 0 }, client_id: clientId };
    const { data } = await supabase.from("custom_foods").insert([food]).select().single();
    if (data) { setCustomFoods(cf => [...cf, data]); setShowAddCustom(false); setCustomName(""); setCustomPer100({ kcal: "", prot: "", carb: "", fat: "" }); }
  };

  const toggleFavorite = async (food) => {
    const exists = favorites.find(f => f.food_id === food.id);
    if (exists) {
      await supabase.from("food_favorites").delete().eq("id", exists.id);
      setFavorites(fav => fav.filter(f => f.id !== exists.id));
    } else {
      const { data } = await supabase.from("food_favorites").insert([{ client_id: clientId, food_id: food.id, food_name: food.name }]).select().single();
      if (data) setFavorites(fav => [...fav, data]);
    }
  };

  const previewMacros = selected && qty ? getMacros(selected, parseFloat(qty) || 0, unit) : null;

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000a", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ background: "#1a1a1a", borderRadius: "20px 20px 0 0", padding: "20px 20px 32px", width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>🍽 Ajouter un aliment</div>
          <button onClick={onClose} style={{ background: "#222", border: "none", borderRadius: "50%", width: 30, height: 30, color: "#888888", cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>

        <div style={{ display: "flex", gap: 4, marginBottom: 12, flexWrap: "wrap" }}>
          {[["local", "🗂 Base"], ["fav", "⭐ Favoris"], ["custom", "✏️ Perso"], ["off", "🔍 Scanner"]].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} style={{ padding: "6px 12px", borderRadius: 99, border: `1.5px solid ${tab === k ? "#E8879C" : "#2a2a2a"}`, background: tab === k ? "#E8879C22" : "transparent", color: tab === k ? "#E8879C" : "#888888", fontSize: 12, fontWeight: tab === k ? 700 : 400, cursor: "pointer" }}>{l}</button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && tab === "off" && searchOFF()} placeholder={tab === "off" ? "Rechercher (Entrée pour valider)" : "Filtrer..."} style={{ ...inputSt, flex: 1, fontSize: 14 }} />
          {tab === "off" && <Btn small onClick={searchOFF} disabled={searching}>{searching ? "..." : "Go"}</Btn>}
        </div>

        {tab === "local" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
            {localFiltered.map(food => (
              <div key={food.id} onClick={() => selectFood(food)} style={{ background: selected?.id === food.id ? "#E8879C22" : "#111", border: `1px solid ${selected?.id === food.id ? "#E8879C" : "#2a2a2a"}`, borderRadius: 10, padding: "10px 12px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{food.name}</div>
                  <div style={{ fontSize: 11, color: "#888888" }}>{food.per100.kcal} kcal · {food.per100.prot}p · {food.per100.carb}g · {food.per100.fat}l / 100g{food.piece_weight ? ` · ${food.piece_weight}g/pièce` : ""}</div>
                </div>
                <button onClick={e => { e.stopPropagation(); toggleFavorite(food); }} style={{ background: "none", border: "none", fontSize: 16, cursor: "pointer", color: favorites.find(f => f.food_id === food.id) ? "#fbbf24" : "#555555" }}>⭐</button>
              </div>
            ))}
          </div>
        )}

        {tab === "fav" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
            {favFiltered.length === 0 && <div style={{ color: "#888888", fontSize: 13, padding: "16px 0", textAlign: "center" }}>Aucun favori encore ⭐</div>}
            {favFiltered.map(fav => {
              const food = LOCAL_DB.find(f => f.id === fav.food_id);
              if (!food) return null;
              return (
                <div key={fav.id} onClick={() => selectFood(food)} style={{ background: selected?.id === food.id ? "#E8879C22" : "#111", border: `1px solid ${selected?.id === food.id ? "#E8879C" : "#2a2a2a"}`, borderRadius: 10, padding: "10px 12px", cursor: "pointer" }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{food.name}</div>
                  <div style={{ fontSize: 11, color: "#888888" }}>{food.per100.kcal} kcal · {food.per100.prot}p · {food.per100.carb}g · {food.per100.fat}l / 100g</div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "custom" && (
          <div style={{ marginBottom: 16 }}>
            {!showAddCustom ? (
              <button onClick={() => setShowAddCustom(true)} style={{ width: "100%", padding: "10px", borderRadius: 10, border: `1.5px dashed #E8879C55`, background: "transparent", color: "#E8879C", fontWeight: 700, fontSize: 13, cursor: "pointer", marginBottom: 10 }}>+ Créer un aliment perso</button>
            ) : (
              <Card style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: "#888888", fontWeight: 700, marginBottom: 10 }}>NOUVEL ALIMENT</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <Inp label="Nom" value={customName} onChange={e => setCustomName(e.target.value)} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
                    {["kcal", "prot", "carb", "fat"].map(k => (
                      <Inp key={k} label={k} type="number" value={customPer100[k]} onChange={e => setCustomPer100(p => ({ ...p, [k]: e.target.value }))} />
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn variant="ghost" small onClick={() => setShowAddCustom(false)} style={{ flex: 1 }}>Annuler</Btn>
                    <Btn small onClick={handleAddCustom} style={{ flex: 1 }}>Créer</Btn>
                  </div>
                </div>
              </Card>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {customFiltered.map(food => (
                <div key={food.id} onClick={() => selectFood(food)} style={{ background: selected?.id === food.id ? "#E8879C22" : "#111", border: `1px solid ${selected?.id === food.id ? "#E8879C" : "#2a2a2a"}`, borderRadius: 10, padding: "10px 12px", cursor: "pointer" }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{food.name}</div>
                  <div style={{ fontSize: 11, color: "#888888" }}>{food.per100.kcal} kcal · {food.per100.prot}p · {food.per100.carb}g · {food.per100.fat}l / 100g</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "off" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
            {offResults.map((p, i) => {
              const parsed = parseOFF(p);
              if (!parsed) return null;
              return (
                <div key={i} onClick={() => selectFood({ ...parsed, id: "off_" + i, unit: "g" })} style={{ background: selected?.id === "off_" + i ? "#E8879C22" : "#111", border: `1px solid ${selected?.id === "off_" + i ? "#E8879C" : "#2a2a2a"}`, borderRadius: 10, padding: "10px 12px", cursor: "pointer" }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{parsed.name}</div>
                  <div style={{ fontSize: 11, color: "#888888" }}>{parsed.per100.kcal} kcal · {parsed.per100.prot}p · {parsed.per100.carb}g · {parsed.per100.fat}l / 100g</div>
                </div>
              );
            })}
          </div>
        )}

        {selected && (
          <div style={{ background: "#111", borderRadius: 12, padding: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: "#888888", fontWeight: 700, marginBottom: 10 }}>SÉLECTIONNÉ : {selected.name}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              <div>
                <label style={{ fontSize: 10, color: "#888888", fontWeight: 700, display: "block", marginBottom: 4 }}>QUANTITÉ</label>
                <input type="number" value={qty} onChange={e => setQty(e.target.value)} style={{ ...inputSt }} min="1" />
              </div>
              <div>
                <label style={{ fontSize: 10, color: "#888888", fontWeight: 700, display: "block", marginBottom: 4 }}>UNITÉ</label>
                <select value={unit} onChange={e => setUnit(e.target.value)} style={{ ...inputSt }}>
                  <option value="g">grammes</option>
                  {selected.piece_weight && <option value="piece">pièce ({selected.piece_weight}g)</option>}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 10, color: "#888888", fontWeight: 700, display: "block", marginBottom: 4 }}>REPAS</label>
              <select value={meal} onChange={e => setMeal(e.target.value)} style={{ ...inputSt }}>
                {MEALS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            {previewMacros && (
              <div style={{ background: "#0a0a0a", borderRadius: 10, padding: 10, marginBottom: 10 }}>
                <MacroBar kcal={previewMacros.kcal} prot={previewMacros.prot} carb={previewMacros.carb} fat={previewMacros.fat} />
              </div>
            )}
            <Btn onClick={handleAdd}>✅ Ajouter</Btn>
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// NUTRITION TRACKER
// ═══════════════════════════════════════════════════════════════════════════════
const NutritionTracker = ({ clientId, targets = {} }) => {
  const [logs, setLogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(today);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async (date) => {
    setLoading(true);
    const { data } = await supabase.from("nutrition_logs").select("*").eq("client_id", clientId).eq("date", date).order("created_at");
    setLogs(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchLogs(selectedDate); }, [selectedDate, clientId]);

  const addLog = async (entry) => {
    const { data } = await supabase.from("nutrition_logs").insert([{ ...entry, client_id: clientId, date: selectedDate }]).select().single();
    if (data) setLogs(l => [...l, data]);
  };

  const deleteLog = async (id) => {
    await supabase.from("nutrition_logs").delete().eq("id", id);
    setLogs(l => l.filter(x => x.id !== id));
  };

  const total = sumMacros(logs);
  const mealGroups = MEALS.map(m => ({ meal: m, items: logs.filter(l => l.meal_type === m) })).filter(g => g.items.length > 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} style={{ ...inputSt, flex: 1 }} />
        <Btn small onClick={() => setShowModal(true)}>+ Ajouter</Btn>
      </div>

      <MacroBar kcal={total.kcal} prot={total.prot} carb={total.carb} fat={total.fat} targetKcal={targets.kcal} targetProt={targets.prot} targetCarb={targets.carb} targetFat={targets.fat} />

      {loading ? <Spinner /> : (
        <>
          {mealGroups.map(({ meal, items }) => (
            <Card key={meal}>
              <div style={{ fontSize: 11, color: "#888888", fontWeight: 700, marginBottom: 10 }}>{meal.toUpperCase()}</div>
              {items.map(item => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid #2a2a2a` }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{item.food_name}</div>
                    <div style={{ fontSize: 11, color: "#888888" }}>{item.quantity}{item.unit === "piece" ? " pièce(s)" : "g"} · {Math.round(item.prot)}p · {Math.round(item.carb)}g · {Math.round(item.fat)}l</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontWeight: 800, color: "#E8879C", fontSize: 14 }}>{Math.round(item.kcal)}</span>
                    <button onClick={() => deleteLog(item.id)} style={{ background: "#f8717122", border: "none", borderRadius: 6, width: 26, height: 26, color: "#f87171", cursor: "pointer", fontSize: 11 }}>✕</button>
                  </div>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                <span style={{ fontSize: 12, color: "#888888" }}>{Math.round(sumMacros(items).kcal)} kcal</span>
              </div>
            </Card>
          ))}
          {logs.length === 0 && <div style={{ textAlign: "center", padding: "30px 0", color: "#555555", fontSize: 14 }}>Aucun aliment enregistré ce jour 🍽</div>}
        </>
      )}

      {showModal && <FoodModal onAdd={addLog} onClose={() => setShowModal(false)} clientId={clientId} />}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// NUTRITION REPORT
// ═══════════════════════════════════════════════════════════════════════════════
const NutritionReport = ({ clientId, targets = {} }) => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [logs, setLogs] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMonth = async () => {
      setLoading(true);
      const start = new Date(year, month, 1).toISOString().slice(0, 10);
      const end = new Date(year, month + 1, 0).toISOString().slice(0, 10);
      const { data } = await supabase.from("nutrition_logs").select("*").eq("client_id", clientId).gte("date", start).lte("date", end);
      setLogs(data || []);
      setLoading(false);
    };
    fetchMonth();
  }, [year, month, clientId]);

  const days = getMonthDays(year, month);
  const byDay = {};
  logs.forEach(l => { if (!byDay[l.date]) byDay[l.date] = []; byDay[l.date].push(l); });

  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "center" }}>
        <button onClick={() => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); }} style={{ background: "#222", border: "none", borderRadius: 8, padding: "8px 12px", color: "#ffffff", cursor: "pointer" }}>‹</button>
        <span style={{ fontWeight: 700, fontSize: 15 }}>{monthNames[month]} {year}</span>
        <button onClick={() => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); }} style={{ background: "#222", border: "none", borderRadius: 8, padding: "8px 12px", color: "#ffffff", cursor: "pointer" }}>›</button>
      </div>

      {loading ? <Spinner /> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
          {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
            <div key={i} style={{ textAlign: "center", fontSize: 10, color: "#888888", fontWeight: 700, padding: "4px 0" }}>{d}</div>
          ))}
          {Array.from({ length: new Date(year, month, 1).getDay() === 0 ? 6 : new Date(year, month, 1).getDay() - 1 }).map((_, i) => <div key={`empty${i}`} />)}
          {days.map(date => {
            const dayLogs = byDay[date] || [];
            const t = sumMacros(dayLogs);
            const hasData = dayLogs.length > 0;
            const isToday = date === today;
            const pct = targets.kcal ? Math.min(t.kcal / targets.kcal, 1) : 0;
            return (
              <div key={date} onClick={() => hasData && setSelectedDay(date)} style={{ aspectRatio: "1", borderRadius: 8, background: hasData ? (pct >= 0.9 ? "#4ade8022" : "#E8879C11") : "#111", border: `1.5px solid ${isToday ? "#E8879C" : hasData ? "#2a2a2a" : "#1a1a1a"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: hasData ? "pointer" : "default" }}>
                <div style={{ fontSize: 11, fontWeight: isToday ? 900 : 400, color: isToday ? "#E8879C" : "#ffffff" }}>{new Date(date).getDate()}</div>
                {hasData && <div style={{ fontSize: 8, color: "#888888" }}>{Math.round(t.kcal)}</div>}
              </div>
            );
          })}
        </div>
      )}

      {selectedDay && <NutritionDayHistory clientId={clientId} date={selectedDay} onClose={() => setSelectedDay(null)} />}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// COACH APP
// ═══════════════════════════════════════════════════════════════════════════════
const CoachApp = ({ user, onLogout }) => {
  const { clients, loading: clientsLoading, addClient, updateClient, deleteClient } = useClients();
  const { workouts, loading: workoutsLoading, saveWorkout, deleteWorkout } = useWorkouts();
  const [tab, setTab] = useState("clients");
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientTab, setClientTab] = useState("journal");
  const [buildingWorkout, setBuildingWorkout] = useState(null);
  const [editingClient, setEditingClient] = useState(null);
  const [showAddClient, setShowAddClient] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatClientId, setChatClientId] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [sessionLogs, setSessionLogs] = useState([]);

  const { entries, weights, measurements, assignedWorkouts, progressPhotos, payments, loading: dataLoading, addEntry, updateEntry, addWeight, addMeasurement, toggleWorkout, updateScheduledDate, addProgressPhoto, addPayment } = useClientData(selectedClient?.id);

  useEffect(() => {
    if (!clients.length) return;
    const fetchUnread = async () => {
      const counts = {};
      await Promise.all(clients.map(async c => {
        const { count } = await supabase.from("messages").select("id", { count: "exact" }).eq("client_id", c.id).eq("sender", "client").eq("read", false);
        counts[c.id] = count || 0;
      }));
      setUnreadCounts(counts);
    };
    fetchUnread();
    const channel = supabase.channel("coach_unread").on("postgres_changes", { event: "*", schema: "public", table: "messages" }, fetchUnread).subscribe();
    return () => supabase.removeChannel(channel);
  }, [clients]);

  useEffect(() => {
    if (!selectedClient) return;
    supabase.from("session_logs").select("*").eq("client_id", selectedClient.id).order("date", { ascending: false }).then(({ data }) => setSessionLogs(data || []));
  }, [selectedClient]);

  const openChat = (clientId) => {
    supabase.from("messages").update({ read: true }).eq("client_id", clientId).eq("sender", "client");
    setUnreadCounts(u => ({ ...u, [clientId]: 0 }));
    setChatClientId(clientId);
    setChatOpen(true);
  };

  const handleAddClient = async () => {
    if (!newClientName.trim()) return;
    await addClient({ name: newClientName, email: newClientEmail, active: true });
    setNewClientName(""); setNewClientEmail(""); setShowAddClient(false);
  };

  const handlePause = async (start, end) => {
    await updateClient(selectedClient.id, { paused: true, pause_start: start, pause_end: end });
    setSelectedClient(c => ({ ...c, paused: true, pause_start: start, pause_end: end }));
    setShowPauseModal(false);
  };

  const handleResume = async () => {
    await updateClient(selectedClient.id, { paused: false, pause_start: null, pause_end: null });
    setSelectedClient(c => ({ ...c, paused: false }));
    setShowPauseModal(false);
  };

  const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);

  if (buildingWorkout !== null) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#ffffff", fontFamily: "'Helvetica Neue', Arial, sans-serif", padding: 20 }}>
        <WorkoutBuilder workout={buildingWorkout === true ? null : buildingWorkout} onSave={async (w) => { await saveWorkout(w); setBuildingWorkout(null); }} onCancel={() => setBuildingWorkout(null)} />
      </div>
    );
  }

  if (selectedClient) {
    const client = clients.find(c => c.id === selectedClient.id) || selectedClient;
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#ffffff", fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #2a2a2a", display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setSelectedClient(null)} style={{ background: "none", border: "none", color: "#888888", cursor: "pointer", fontSize: 20, padding: 0 }}>←</button>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 16 }}>{client.name}</div>
            {client.paused && <div style={{ fontSize: 11, color: "#fb923c" }}>⏸ En pause jusqu'au {formatDate(client.pause_end)}</div>}
          </div>
          <button onClick={() => openChat(client.id)} style={{ background: "#E8879C22", border: "1px solid #E8879C44", borderRadius: 10, padding: "6px 12px", color: "#E8879C", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>💬</button>
          <button onClick={() => setShowPauseModal(true)} style={{ background: "#222", border: "none", borderRadius: 10, padding: "6px 12px", color: "#888888", cursor: "pointer", fontSize: 13 }}>⏸</button>
        </div>

        <div style={{ padding: "0 20px" }}>
          <Tab tabs={[["journal", "Journal"], ["body", "Corps"], ["workouts", "Séances"], ["nutrition", "Nutrition"], ["payments", "Paiements"]]} active={clientTab} onChange={setClientTab} />
        </div>

        <div style={{ padding: "0 20px 30px" }}>
          {clientTab === "journal" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {dataLoading ? <Spinner /> : (
                <>
                  {entries.slice(0, 30).map(entry => (
                    <EntryCard key={entry.id} entry={entry} onClick={() => {}} />
                  ))}
                  {entries.length === 0 && <div style={{ color: "#555555", textAlign: "center", padding: "40px 0" }}>Aucune entrée de journal</div>}
                </>
              )}
            </div>
          )}

          {clientTab === "body" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {weights.length > 0 && (
                <Card>
                  <div style={{ fontSize: 11, color: "#888888", fontWeight: 700, marginBottom: 12 }}>POIDS</div>
                  {weights.slice(-5).reverse().map(w => (
                    <div key={w.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #2a2a2a", fontSize: 13 }}>
                      <span style={{ color: "#888888" }}>{formatDate(w.date)}</span>
                      <span style={{ fontWeight: 700 }}>{w.value} kg</span>
                    </div>
                  ))}
                </Card>
              )}
              {measurements.length > 0 && (
                <Card>
                  <div style={{ fontSize: 11, color: "#888888", fontWeight: 700, marginBottom: 12 }}>MENSURATIONS</div>
                  {measurements.slice(-3).reverse().map(m => (
                    <div key={m.id} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid #2a2a2a" }}>
                      <div style={{ fontSize: 11, color: "#888888", marginBottom: 6 }}>{formatDate(m.date)}</div>
                      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                        {[["chest", "Poitrine"], ["waist", "Taille"], ["lower_belly", "Bas ventre"], ["hips", "Hanches"], ["thighs", "Cuisses"]].filter(([k]) => m[k]).map(([k, l]) => (
                          <div key={k} style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 9, color: "#888888" }}>{l}</div>
                            <div style={{ fontWeight: 700, fontSize: 14 }}>{m[k]}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </Card>
              )}
              {progressPhotos.length > 0 && (
                <Card>
                  <div style={{ fontSize: 11, color: "#888888", fontWeight: 700, marginBottom: 12 }}>PHOTOS PROGRÈS</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {progressPhotos.slice(0, 6).map(p => (
                      <div key={p.id}>
                        <img src={p.photo} alt="" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 10 }} />
                        <div style={{ fontSize: 9, color: "#888888", textAlign: "center", marginTop: 2 }}>{formatDate(p.date)}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          {clientTab === "workouts" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontSize: 11, color: "#888888", fontWeight: 700, marginBottom: 4 }}>SÉANCES ASSIGNÉES</div>
              {workouts.map(w => {
                const assigned = assignedWorkouts.find(a => a.workout_id === w.id);
                return (
                  <Card key={w.id} style={{ borderColor: assigned ? "#E8879C44" : "#2a2a2a" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{w.name}</div>
                        {w.description && <div style={{ fontSize: 12, color: "#888888", marginTop: 2 }}>{w.description}</div>}
                        {assigned?.scheduled_date && <div style={{ fontSize: 11, color: "#fb923c", marginTop: 4 }}>📅 {formatDate(assigned.scheduled_date)}</div>}
                      </div>
                      <button onClick={() => toggleWorkout(w.id)} style={{ background: assigned ? "#E8879C22" : "#111", border: `1px solid ${assigned ? "#E8879C" : "#2a2a2a"}`, borderRadius: 8, padding: "6px 12px", color: assigned ? "#E8879C" : "#888888", cursor: "pointer", fontSize: 13, fontWeight: assigned ? 700 : 400 }}>
                        {assigned ? "✓ Assignée" : "Assigner"}
                      </button>
                    </div>
                    {assigned && (
                      <div style={{ marginTop: 10 }}>
                        <Inp label="Date planifiée" type="date" value={assigned.scheduled_date || ""} onChange={e => updateScheduledDate(w.id, e.target.value)} style={{ fontSize: 13 }} />
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}

          {clientTab === "nutrition" && (
            <NutritionReport clientId={client.id} targets={{ kcal: client.target_kcal, prot: client.target_prot, carb: client.target_carb, fat: client.target_fat }} />
          )}

          {clientTab === "payments" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Card>
                <div style={{ fontSize: 11, color: "#888888", fontWeight: 700, marginBottom: 12 }}>ENREGISTRER UN PAIEMENT</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <Inp label="Montant (€)" type="number" id="pay_amount" placeholder="120" />
                  <Inp label="Date de paiement" type="date" id="pay_date" defaultValue={today} />
                  <TA label="Note" id="pay_note" placeholder="Mois de juin..." style={{ minHeight: 56 }} />
                  <Btn onClick={async () => {
                    const amt = document.getElementById("pay_amount")?.value;
                    const dt = document.getElementById("pay_date")?.value || today;
                    const nt = document.getElementById("pay_note")?.value || "";
                    if (!amt) return;
                    await addPayment(parseFloat(amt), dt, nt);
                    document.getElementById("pay_amount").value = "";
                    document.getElementById("pay_note").value = "";
                  }}>💳 Enregistrer</Btn>
                </div>
              </Card>
              <PaymentHistory payments={payments} />
            </div>
          )}
        </div>

        {chatOpen && <ChatSidebar clientId={chatClientId} clientName={clients.find(c => c.id === chatClientId)?.name} senderRole="coach" onClose={() => setChatOpen(false)} allClients={clients} onSelectClient={id => { setChatClientId(id); openChat(id); }} unreadCounts={unreadCounts} />}
        {showPauseModal && <PauseModal client={client} onClose={() => setShowPauseModal(false)} onPause={handlePause} onResume={handleResume} />}
        {editingClient && <EditClientModal client={editingClient} onSave={async (patch) => { await updateClient(editingClient.id, patch); setEditingClient(null); }} onClose={() => setEditingClient(null)} />}
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#ffffff", fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <Logo size={20} />
          <div style={{ display: "flex", gap: 10 }}>
            {totalUnread > 0 && (
              <button onClick={() => { const c = clients.find(x => unreadCounts[x.id] > 0); if (c) openChat(c.id); }} style={{ background: "#f8717122", border: "1px solid #f8717144", borderRadius: 10, padding: "6px 12px", color: "#f87171", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
                💬 {totalUnread}
              </button>
            )}
            <button onClick={onLogout} style={{ background: "#222", border: "none", borderRadius: 10, padding: "6px 12px", color: "#888888", cursor: "pointer", fontSize: 13 }}>Déco</button>
          </div>
        </div>
        <Tab tabs={[["clients", "Clientes"], ["workouts", "Séances"]]} active={tab} onChange={setTab} />
      </div>

      <div style={{ padding: "0 20px 30px" }}>
        {tab === "clients" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {!showAddClient ? (
              <button onClick={() => setShowAddClient(true)} style={{ width: "100%", padding: "12px", borderRadius: 12, border: "1.5px dashed #E8879C55", background: "transparent", color: "#E8879C", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>+ Nouvelle cliente</button>
            ) : (
              <Card>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <Inp label="Prénom Nom" value={newClientName} onChange={e => setNewClientName(e.target.value)} />
                  <Inp label="Email" type="email" value={newClientEmail} onChange={e => setNewClientEmail(e.target.value)} />
                  <div style={{ display: "flex", gap: 10 }}>
                    <Btn variant="ghost" small onClick={() => setShowAddClient(false)} style={{ flex: 1 }}>Annuler</Btn>
                    <Btn small onClick={handleAddClient} style={{ flex: 1 }}>Créer</Btn>
                  </div>
                </div>
              </Card>
            )}
            {clientsLoading ? <Spinner /> : clients.filter(c => !c.paused).map(client => (
              <Card key={client.id} onClick={() => setSelectedClient(client)} style={{ cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Avatar initials={client.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{client.name}</div>
                      <div style={{ fontSize: 12, color: "#888888", marginTop: 2 }}>
                        {client.next_payment ? <span style={{ color: daysUntil(client.next_payment) <= 7 ? "#f87171" : "#888888" }}>💳 {formatDate(client.next_payment)}</span> : <span>Active</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {unreadCounts[client.id] > 0 && (
                      <span style={{ background: "#f87171", color: "#ffffff", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900 }}>{unreadCounts[client.id]}</span>
                    )}
                    <span style={{ color: "#888888", fontSize: 20 }}>›</span>
                  </div>
                </div>
              </Card>
            ))}
            {!clientsLoading && clients.some(c => c.paused) && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "4px 0" }}>
                <div style={{ flex: 1, height: 1, background: "#2a2a2a" }} />
                <span style={{ fontSize: 10, color: "#555555", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", flexShrink: 0 }}>En pause</span>
                <div style={{ flex: 1, height: 1, background: "#2a2a2a" }} />
              </div>
            )}
            {!clientsLoading && clients.filter(c => c.paused).map(client => (
              <Card key={client.id} onClick={() => setSelectedClient(client)} style={{ cursor: "pointer", opacity: 0.5, borderColor: "#fb923c44" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Avatar initials={client.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()} color="#fb923c" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{client.name}</div>
                      <div style={{ fontSize: 12, color: "#fb923c", marginTop: 2 }}>⏸ Pause jusqu'au {formatDate(client.pause_end)}</div>
                    </div>
                  </div>
                  <span style={{ color: "#888888", fontSize: 20 }}>›</span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {tab === "workouts" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <button onClick={() => setBuildingWorkout(true)} style={{ width: "100%", padding: "12px", borderRadius: 12, border: "1.5px dashed #E8879C55", background: "transparent", color: "#E8879C", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>+ Nouvelle séance</button>
            {workoutsLoading ? <Spinner /> : workouts.map(w => (
              <Card key={w.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{w.name}</div>
                    {w.description && <div style={{ fontSize: 12, color: "#888888", marginTop: 2 }}>{w.description}</div>}
                    <div style={{ fontSize: 11, color: "#888888", marginTop: 4 }}>{w.exercises?.length || 0} exercices</div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setBuildingWorkout(w)} style={{ background: "#222", border: "none", borderRadius: 8, padding: "6px 10px", color: "#888888", cursor: "pointer", fontSize: 13 }}>✏️</button>
                    <button onClick={() => { if (confirm("Supprimer cette séance ?")) deleteWorkout(w.id); }} style={{ background: "#f8717122", border: "none", borderRadius: 8, padding: "6px 10px", color: "#f87171", cursor: "pointer", fontSize: 13 }}>🗑</button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {chatOpen && <ChatSidebar clientId={chatClientId} clientName={clients.find(c => c.id === chatClientId)?.name} senderRole="coach" onClose={() => setChatOpen(false)} allClients={clients} onSelectClient={id => { setChatClientId(id); openChat(id); }} unreadCounts={unreadCounts} />}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CLIENT APP — with MOD 2, 3, 4 applied (lower_belly)
// ═══════════════════════════════════════════════════════════════════════════════
const ClientApp = ({ user, onLogout }) => {
  const [tab, setTab] = useState("home");
  const [bodyTab, setBodyTab] = useState("weight");
  const [nutritionTab, setNutritionTab] = useState("today");
  const [playingWorkout, setPlayingWorkout] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [editingEntry, setEditingEntry] = useState(false);
  const [newWeight, setNewWeight] = useState("");
  // MOD 2: newMeasure with lower_belly
  const [newMeasure, setNewMeasure] = useState({ chest: "", waist: "", lower_belly: "", hips: "", thighs: "" });
  const [photoNote, setPhotoNote] = useState("");
  const [notifEnabled, setNotifEnabled] = useState(Notification?.permission === "granted");

  const clientId = user.id;
  const { entries, weights, measurements, assignedWorkouts, progressPhotos, payments, loading, addEntry, updateEntry, addWeight, addMeasurement, toggleWorkout, addProgressPhoto } = useClientData(clientId);
  const [sessionLogs, setSessionLogs] = useState([]);
  const [clientData, setClientData] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setClientData(data?.user));
    supabase.from("session_logs").select("*").eq("client_id", clientId).order("date", { ascending: false }).then(({ data }) => setSessionLogs(data || []));
  }, [clientId]);

  useEffect(() => {
    const checkUnread = async () => {
      const { count } = await supabase.from("messages").select("id", { count: "exact" }).eq("client_id", clientId).eq("sender", "coach").eq("read", false);
      setHasUnread(count > 0);
    };
    checkUnread();
    const channel = supabase.channel("client_unread_" + clientId).on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `client_id=eq.${clientId}` }, checkUnread).subscribe();
    return () => supabase.removeChannel(channel);
  }, [clientId]);

  const todayEntry = entries.find(e => e.date === today);
  const lastWeight = weights.length ? weights[weights.length - 1] : null;

  // MOD 3: handleAddMeasure with lower_belly
  const handleAddMeasure = async () => {
    await addMeasurement({
      chest: parseFloat(newMeasure.chest),
      waist: parseFloat(newMeasure.waist),
      lower_belly: parseFloat(newMeasure.lower_belly),
      hips: parseFloat(newMeasure.hips),
      thighs: parseFloat(newMeasure.thighs),
    });
    setNewMeasure({ chest: "", waist: "", lower_belly: "", hips: "", thighs: "" });
    alert("✅ Mensurations enregistrées !");
  };

  const handlePhoto = async e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = async ev => {
      const base64 = ev.target.result;
      const fileName = `progress/${clientId}/${Date.now()}.jpg`;
      const res = await fetch(base64);
      const blob = await res.blob();
      const { data, error } = await supabase.storage.from("progress-photos").upload(fileName, blob, { contentType: "image/jpeg", upsert: true });
      if (!error) {
        const { data: urlData } = supabase.storage.from("progress-photos").getPublicUrl(fileName);
        await addProgressPhoto(urlData.publicUrl, photoNote);
        setPhotoNote("");
      } else {
        await addProgressPhoto(base64, photoNote);
        setPhotoNote("");
      }
    };
    reader.readAsDataURL(file);
  };

  if (playingWorkout) {
    return <WorkoutPlayer workout={playingWorkout} onFinish={() => setPlayingWorkout(null)} clientId={clientId} sessionLogs={sessionLogs} />;
  }

  if (selectedEntry && !editingEntry) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#ffffff", fontFamily: "'Helvetica Neue', Arial, sans-serif", padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button onClick={() => setSelectedEntry(null)} style={{ background: "none", border: "none", color: "#888888", cursor: "pointer", fontSize: 20, padding: 0 }}>←</button>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Journal</h2>
        </div>
        <EntryDetail entry={selectedEntry} sessionLogs={sessionLogs} onEdit={() => setEditingEntry(true)} />
      </div>
    );
  }

  if (editingEntry && selectedEntry) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#ffffff", fontFamily: "'Helvetica Neue', Arial, sans-serif", padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button onClick={() => setEditingEntry(false)} style={{ background: "none", border: "none", color: "#888888", cursor: "pointer", fontSize: 20, padding: 0 }}>←</button>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Modifier</h2>
        </div>
        <JournalForm existingEntry={selectedEntry} onSave={async (data) => { await updateEntry(selectedEntry.id, data); setEditingEntry(false); setSelectedEntry(null); }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#ffffff", fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <Logo size={20} />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { supabase.from("messages").update({ read: true }).eq("client_id", clientId).eq("sender", "coach"); setHasUnread(false); setChatOpen(true); }} style={{ background: hasUnread ? "#f8717122" : "#E8879C22", border: `1px solid ${hasUnread ? "#f8717144" : "#E8879C44"}`, borderRadius: 10, padding: "6px 12px", color: hasUnread ? "#f87171" : "#E8879C", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
              {hasUnread ? "💬 !" : "💬"}
            </button>
            <button onClick={onLogout} style={{ background: "#222", border: "none", borderRadius: 10, padding: "6px 12px", color: "#888888", cursor: "pointer", fontSize: 13 }}>Déco</button>
          </div>
        </div>
        <Tab tabs={[["home", "Accueil"], ["journal", "Journal"], ["body", "Corps"], ["workouts", "Séances"], ["nutrition", "Nutrition"]]} active={tab} onChange={setTab} />
      </div>

      <div style={{ padding: "0 20px 100px" }}>

        {tab === "home" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {!todayEntry ? (
              <JournalForm onSave={async (data) => { await addEntry(data); }} />
            ) : (
              <Card style={{ borderColor: sessionColor(todayEntry.status) + "44" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#888888", fontWeight: 700, marginBottom: 4 }}>AUJOURD'HUI</div>
                    <Badge color={sessionColor(todayEntry.status)}>{sessionLabel(todayEntry.status)}</Badge>
                    {todayEntry.feeling !== null && todayEntry.feeling !== undefined && <span style={{ fontSize: 20, marginLeft: 10 }}>{feelings[todayEntry.feeling]}</span>}
                  </div>
                  <button onClick={() => { setSelectedEntry(todayEntry); setEditingEntry(true); }} style={{ background: "#222", border: "none", borderRadius: 8, padding: "6px 10px", color: "#888888", cursor: "pointer", fontSize: 12 }}>✏️</button>
                </div>
                {todayEntry.note && <div style={{ marginTop: 10, fontSize: 13, color: "#888888", fontStyle: "italic" }}>"{todayEntry.note}"</div>}
              </Card>
            )}

            {lastWeight && (
              <Card>
                <div style={{ fontSize: 11, color: "#888888", fontWeight: 700, marginBottom: 4 }}>POIDS</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#E8879C" }}>{lastWeight.value} <span style={{ fontSize: 14, color: "#888888" }}>kg</span></div>
                <div style={{ fontSize: 11, color: "#888888", marginTop: 2 }}>{formatDate(lastWeight.date)}</div>
              </Card>
            )}

            {assignedWorkouts.length > 0 && (
              <div>
                <div style={{ fontSize: 11, color: "#888888", fontWeight: 700, marginBottom: 10 }}>MES SÉANCES</div>
                {assignedWorkouts.filter(a => a.workout).map(a => (
                  <Card key={a.workout_id} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>{a.workout.name}</div>
                        {a.scheduled_date && <div style={{ fontSize: 11, color: "#fb923c", marginTop: 2 }}>📅 {formatDate(a.scheduled_date)}</div>}
                      </div>
                      <Btn small onClick={() => setPlayingWorkout(a.workout)}>▶ Lancer</Btn>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {!notifEnabled && (
              <button onClick={async () => { const ok = await requestNotifications(); if (ok) setNotifEnabled(true); }} style={{ background: "#a78bfa22", border: "1px solid #a78bfa44", borderRadius: 12, padding: "12px 16px", color: "#a78bfa", cursor: "pointer", fontSize: 13, fontWeight: 700, width: "100%" }}>
                🔔 Activer les rappels à 20h
              </button>
            )}
          </div>
        )}

        {tab === "journal" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {!todayEntry && <JournalForm onSave={async (data) => { await addEntry(data); }} />}
            {loading ? <Spinner /> : entries.map(entry => (
              <EntryCard key={entry.id} entry={entry} onClick={() => setSelectedEntry(entry)} />
            ))}
          </div>
        )}

        {tab === "body" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <Tab tabs={[["weight", "Poids"], ["measures", "Mensurations"], ["photos", "Photos"]]} active={bodyTab} onChange={setBodyTab} />

            {bodyTab === "weight" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Card>
                  <div style={{ fontSize: 11, color: "#888888", fontWeight: 700, marginBottom: 12 }}>AJOUTER MON POIDS</div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <input type="number" step="0.1" inputMode="decimal" placeholder="Ex: 62.5" value={newWeight} onChange={e => setNewWeight(e.target.value)} style={{ ...inputSt, flex: 1 }} />
                    <Btn onClick={async () => { if (!newWeight) return; await addWeight(parseFloat(newWeight)); setNewWeight(""); alert("✅ Poids enregistré !"); }}>OK</Btn>
                  </div>
                </Card>
                {weights.length >= 2 && (() => {
                  const first = weights[0], last = weights[weights.length - 1];
                  const diff = (last.value - first.value).toFixed(1);
                  return (
                    <Card>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontSize: 11, color: "#888888", marginBottom: 4 }}>POIDS ACTUEL</div>
                          <div style={{ fontSize: 28, fontWeight: 900, color: "#E8879C" }}>{last.value} kg</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 11, color: "#888888", marginBottom: 4 }}>DEPUIS LE DÉBUT</div>
                          <div style={{ fontSize: 20, fontWeight: 800, color: parseFloat(diff) < 0 ? "#4ade80" : "#f87171" }}>{parseFloat(diff) < 0 ? diff : "+" + diff} kg</div>
                        </div>
                      </div>
                    </Card>
                  );
                })()}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {weights.slice(-10).reverse().map(w => (
                    <div key={w.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "#1a1a1a", borderRadius: 10, border: "1px solid #2a2a2a" }}>
                      <span style={{ fontSize: 13, color: "#888888" }}>{formatDate(w.date)}</span>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{w.value} kg</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MOD 4: bodyTab measures with 5 fields, step, inputMode */}
            {bodyTab === "measures" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {measurements.length >= 2 && (() => {
                  const first = measurements[0], last = measurements[measurements.length - 1];
                  return (
                    <Card>
                      {[["chest", "Poitrine"], ["waist", "Tour de taille"], ["lower_belly", "Bas du ventre"], ["hips", "Hanches"], ["thighs", "Cuisses"]].map(([k, label]) => {
                        const diff = ((last[k] || 0) - (first[k] || 0)).toFixed(1);
                        return (
                          <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid #2a2a2a`, fontSize: 13 }}>
                            <span style={{ color: "#888888" }}>{label}</span>
                            <span>
                              <strong>{last[k] ? `${last[k]} cm` : "—"}</strong>{" "}
                              {last[k] && first[k] && last[k] !== first[k] && (
                                <span style={{ color: parseFloat(diff) < 0 ? "#4ade80" : "#f87171", fontSize: 11 }}>
                                  {parseFloat(diff) < 0 ? diff : `+${diff}`} cm
                                </span>
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </Card>
                  );
                })()}
                <Card>
                  <div style={{ fontSize: 11, color: "#888888", fontWeight: 700, marginBottom: 12 }}>NOUVELLES MENSURATIONS</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[["chest", "Poitrine (cm)"], ["waist", "Tour de taille (cm)"], ["lower_belly", "Bas du ventre (cm)"], ["hips", "Hanches (cm)"], ["thighs", "Cuisses (cm)"]].map(([k, label]) => (
                      <input
                        key={k}
                        type="number"
                        step="0.1"
                        inputMode="decimal"
                        placeholder={label}
                        value={newMeasure[k]}
                        onChange={e => setNewMeasure({ ...newMeasure, [k]: e.target.value })}
                        style={inputSt}
                      />
                    ))}
                    <Btn onClick={handleAddMeasure}>Enregistrer</Btn>
                  </div>
                </Card>
              </div>
            )}

            {bodyTab === "photos" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Card>
                  <div style={{ fontSize: 11, color: "#888888", fontWeight: 700, marginBottom: 12 }}>AJOUTER UNE PHOTO</div>
                  <TA label="Note (optionnel)" value={photoNote} onChange={e => setPhotoNote(e.target.value)} style={{ minHeight: 56, marginBottom: 10 }} />
                  <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "12px", background: "#111", border: "1.5px dashed #E8879C55", borderRadius: 12, cursor: "pointer" }}>
                    <span style={{ fontSize: 20 }}>📷</span>
                    <span style={{ color: "#E8879C", fontWeight: 700, fontSize: 14 }}>Choisir une photo</span>
                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhoto} />
                  </label>
                </Card>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {progressPhotos.map(p => (
                    <div key={p.id} style={{ borderRadius: 14, overflow: "hidden" }}>
                      <img src={p.photo} alt="" style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover" }} />
                      <div style={{ fontSize: 10, color: "#888888", padding: "4px 6px", background: "#1a1a1a" }}>{formatDate(p.date)}{p.note ? ` · ${p.note}` : ""}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "workouts" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {assignedWorkouts.filter(a => a.workout).map(a => (
              <Card key={a.workout_id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: a.workout.description ? 8 : 0 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{a.workout.name}</div>
                    {a.scheduled_date && <div style={{ fontSize: 11, color: "#fb923c", marginTop: 2 }}>📅 {formatDate(a.scheduled_date)}</div>}
                  </div>
                  <Btn small onClick={() => setPlayingWorkout(a.workout)}>▶ Lancer</Btn>
                </div>
                {a.workout.description && <div style={{ fontSize: 13, color: "#888888" }}>{a.workout.description}</div>}
                <div style={{ marginTop: 10 }}>
                  {(() => {
                    const lastLog = sessionLogs.find(l => l.workout_id === a.workout_id);
                    if (!lastLog) return null;
                    return <div style={{ fontSize: 11, color: "#4ade80" }}>✓ Dernière fois : {formatDate(lastLog.date)}</div>;
                  })()}
                </div>
              </Card>
            ))}
            {assignedWorkouts.length === 0 && <div style={{ color: "#555555", textAlign: "center", padding: "40px 0", fontSize: 14 }}>Aucune séance assignée encore 💪</div>}
          </div>
        )}

        {tab === "nutrition" && (
          <div>
            <Tab tabs={[["today", "Aujourd'hui"], ["report", "Historique"]]} active={nutritionTab} onChange={setNutritionTab} />
            {nutritionTab === "today" && <NutritionTracker clientId={clientId} />}
            {nutritionTab === "report" && <NutritionReport clientId={clientId} />}
          </div>
        )}

      </div>

      {chatOpen && <ChatSidebar clientId={clientId} clientName="Coach Nina" senderRole="client" onClose={() => setChatOpen(false)} />}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LOGIN SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true); setError("");
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) { setError(err.message); setLoading(false); return; }
    onLogin(data.user);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#ffffff", fontFamily: "'Helvetica Neue', Arial, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Logo size={28} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {error && <div style={{ background: "#f8717122", border: "1px solid #f8717144", borderRadius: 10, padding: "10px 14px", color: "#f87171", fontSize: 13 }}>{error}</div>}
          <Inp label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} autoComplete="email" />
          <Inp label="Mot de passe" type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} autoComplete="current-password" />
          <Btn onClick={handleLogin} disabled={loading}>{loading ? "Connexion..." : "Se connecter"}</Btn>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// EDIT CLIENT MODAL
// ═══════════════════════════════════════════════════════════════════════════════
const EditClientModal = ({ client, onSave, onClose }) => {
  const [name, setName] = useState(client.name || "");
  const [email, setEmail] = useState(client.email || "");
  const [targetKcal, setTargetKcal] = useState(client.target_kcal || "");
  const [targetProt, setTargetProt] = useState(client.target_prot || "");
  const [targetCarb, setTargetCarb] = useState(client.target_carb || "");
  const [targetFat, setTargetFat] = useState(client.target_fat || "");

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000a", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ background: "#1a1a1a", borderRadius: "20px 20px 0 0", padding: 24, width: "100%", maxWidth: 480 }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>✏️ Modifier la cliente</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Inp label="Nom" value={name} onChange={e => setName(e.target.value)} />
          <Inp label="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <div style={{ fontSize: 11, color: "#888888", fontWeight: 700, marginTop: 4 }}>OBJECTIFS NUTRITIONNELS</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
            <Inp label="kcal" type="number" value={targetKcal} onChange={e => setTargetKcal(e.target.value)} />
            <Inp label="Prot" type="number" value={targetProt} onChange={e => setTargetProt(e.target.value)} />
            <Inp label="Gluc" type="number" value={targetCarb} onChange={e => setTargetCarb(e.target.value)} />
            <Inp label="Lip" type="number" value={targetFat} onChange={e => setTargetFat(e.target.value)} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <Btn variant="ghost" onClick={onClose} style={{ flex: 1 }}>Annuler</Btn>
          <Btn onClick={() => onSave({ name, email, target_kcal: parseFloat(targetKcal) || null, target_prot: parseFloat(targetProt) || null, target_carb: parseFloat(targetCarb) || null, target_fat: parseFloat(targetFat) || null })} style={{ flex: 1 }}>Enregistrer</Btn>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user || null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Spinner />
      </div>
    );
  }

  if (!user) return <LoginScreen onLogin={setUser} />;

  const isCoach = user.email === COACH_EMAIL;
  if (isCoach) return <CoachApp user={user} onLogout={handleLogout} />;
  return <ClientApp user={user} onLogout={handleLogout} />;
}
