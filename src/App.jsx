import { useState, useEffect, useRef, Children, cloneElement } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

const C = {
  black: "#0a0a0a", white: "#ffffff", pink: "#E7B7BC",
  brandDark: "#4b0f0f", brandCream: "#F7EDE8",
  surface: "#141414", card: "#1a1a1a", border: "#2a2a2a",
  muted: "#555555", textMuted: "#888888", green: "#4ade80", red: "#f87171",
  purple: "#a78bfa", orange: "#fb923c", blue: "#60a5fa", yellow: "#fbbf24",
};

const BRAND_NAME = "Nina - Her process";

const Logo = ({ size = 44 }) => {
  const [visible, setVisible] = useState(true);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {visible && (
        <img src="/logo.png" alt={BRAND_NAME} style={{ width: size, height: size, borderRadius: 8, objectFit: "cover" }} onError={() => setVisible(false)} />
      )}
      <div style={{ lineHeight: 1 }}>
        <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontWeight: 900, fontSize: Math.max(18, size * 0.38), color: C.brandDark, letterSpacing: "-0.6px", lineHeight: 0.95 }}>her</div>
        <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontWeight: 900, fontSize: Math.max(22, size * 0.5), color: C.brandDark, letterSpacing: "-0.6px", lineHeight: 0.9 }}>process<span style={{ color: C.pink }}>.</span></div>
      </div>
    </div>
  );
};

const Card = ({ children, style = {}, onClick }) => {
    const [hover, setHover] = useState(false);
    const reduced = usePrefersReducedMotion();
    return (
      <div onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
        background: "linear-gradient(135deg, #141414 0%, #1a1a1a 100%)",
        border: `1px solid ${C.border}`,
        borderRadius: 18,
        padding: 20,
        cursor: onClick ? "pointer" : "default",
        boxShadow: hover && !reduced ? "0 32px 68px rgba(0,0,0,0.36)" : "0 16px 36px rgba(0,0,0,0.22)",
          transform: hover && !reduced ? "translateY(-8px) scale(1.035)" : "translateY(0) scale(1)",
          transition: reduced ? "none" : "transform .26s cubic-bezier(.2,.9,.25,1), box-shadow .26s ease, border-color .16s ease",
        willChange: "transform, box-shadow",
        ...style
      }}>{children}</div>
    );
};

const Btn = ({ children, onClick, variant = "primary", disabled, small, style = {} }) => {
  const [hover, setHover] = useState(false);
  const reduced = usePrefersReducedMotion();
  const bg = variant === "primary" ? `linear-gradient(135deg, ${C.pink} 0%, #ff9bb0 100%)` : variant === "danger" ? C.red + "22" : variant === "ghost" ? "transparent" : variant === "green" ? `linear-gradient(135deg, ${C.green} 0%, #8ceea5 100%)` : "#222";
  const fg = variant === "primary" ? C.black : variant === "danger" ? C.red : variant === "green" ? C.black : C.white;
  const shadow = variant === "primary" ? `0 10px 24px ${C.pink}28` : variant === "green" ? `0 10px 24px ${C.green}24` : "none";
  return (
    <button onClick={onClick} disabled={disabled} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onMouseDown={() => !reduced && setHover(true)} onMouseUp={() => !reduced && setHover(false)} style={{
      background: bg,
      color: fg,
      border: variant === "ghost" ? `1px solid ${C.border}` : variant === "danger" ? `1px solid ${C.red}44` : "none",
      borderRadius: small ? 10 : 12, padding: small ? "7px 14px" : "13px 20px",
      fontWeight: 800, fontSize: small ? 13 : 15, cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.4 : 1, fontFamily: "inherit",
      transform: hover && !reduced ? "translateY(-4px) scale(1.02)" : "translateY(0) scale(1)",
      boxShadow: hover && !reduced ? shadow : (variant === "primary" || variant === "green") ? shadow : "none",
      transition: reduced ? "none" : "transform .18s cubic-bezier(.2,.9,.25,1), box-shadow .18s ease",
      ...style,
    }}>{children}</button>
  );
};

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

const SectionTitle = ({ title, subtitle, action }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 900, margin: 0 }}>{title}</h2>
        {subtitle && <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>{subtitle}</div>}
      </div>
      {action}
    </div>
  </div>
);

const PremiumHero = ({ title, subtitle, badge, children, accent = C.pink }) => (
  <div style={{ background: `linear-gradient(135deg, ${accent}16 0%, #161616 100%)`, border: `1px solid ${accent}33`, borderRadius: 24, padding: 18, boxShadow: "0 18px 45px rgba(0,0,0,0.25)" }}>
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: accent, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>{badge}</div>
        <h1 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 6px" }}>{title}</h1>
        {subtitle && <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.45 }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  </div>
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

const QuickAction = ({ title, subtitle, icon, onClick, accent = C.pink }) => (
  <button onClick={onClick} style={{
    background: "#111", border: `1px solid ${accent}22`, borderRadius: 12, padding: "12px 12px",
    textAlign: "left", cursor: "pointer", color: C.white, display: "flex", alignItems: "center", gap: 10,
  }}>
    <div style={{ width: 34, height: 34, borderRadius: 10, background: accent + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{icon}</div>
    <div style={{ minWidth: 0 }}>
      <div style={{ fontWeight: 700, fontSize: 13 }}>{title}</div>
      <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{subtitle}</div>
    </div>
  </button>
);

const ClientBottomNav = ({ currentScreen, onNavigate }) => {
  const items = [
    { key: "home", label: "Accueil", icon: "🏠" },
    { key: "journal", label: "Journal", icon: "📝" },
    { key: "perfs", label: "Séances", icon: "💪" },
    { key: "body", label: "Suivi", icon: "📏" },
    { key: "contrat", label: "Contrat", icon: "📄" },
  ];
  return (
    <div style={{ position: "sticky", bottom: 0, marginTop: 18, borderTop: `1px solid ${C.border}`, background: C.black, padding: "10px 12px 14px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
        {items.map(item => {
          const active = currentScreen === item.key;
          return (
            <button key={item.key} onClick={() => onNavigate(item.key)} style={{
              background: active ? C.pink + "22" : "#111", border: `1px solid ${active ? C.pink : C.border}`,
              borderRadius: 12, padding: "8px 4px", color: active ? C.white : C.textMuted,
              fontWeight: 700, fontSize: 11, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            }}>
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
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
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: "'Helvetica Neue', Arial, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 430, background: C.card, border: `1px solid ${C.border}`, borderRadius: 24, padding: 24 }}>
        <div style={{ fontSize: 11, color: C.pink, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Bienvenue dans Nina - Her process</div>
        <h2 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 8px" }}>{current.title}</h2>
        <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.5, margin: "0 0 20px" }}>{current.text}</p>
        <div style={{ background: "#111", borderRadius: 12, padding: 14, marginBottom: 18 }}>
          <div style={{ fontSize: 13, color: C.white, lineHeight: 1.5 }}>{current.detail}</div>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          {steps.map((_, idx) => <div key={idx} style={{ flex: 1, height: 5, borderRadius: 999, background: idx <= step ? C.pink : C.border }} />)}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => (step < steps.length - 1 ? setStep(step + 1) : onFinish())} style={{ flex: 1, background: C.pink, border: "none", borderRadius: 12, padding: "12px 14px", color: C.black, fontWeight: 800, cursor: "pointer" }}>
            {step < steps.length - 1 ? "Continuer" : "C’est parti"}
          </button>
          {step > 0 ? (
            <button onClick={() => setStep(step - 1)} style={{ padding: "12px 14px", borderRadius: 12, border: `1px solid ${C.border}`, background: "#111", color: C.white, cursor: "pointer" }}>Retour</button>
          ) : (
            <button onClick={onFinish} style={{ padding: "12px 14px", borderRadius: 12, border: `1px solid ${C.border}`, background: "#111", color: C.textMuted, cursor: "pointer" }}>Passer</button>
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

// Accessibility: respect prefers-reduced-motion
const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setReduced(mq.matches);
    handler();
    try { mq.addEventListener("change", handler); } catch { mq.addListener(handler); }
    return () => { try { mq.removeEventListener("change", handler); } catch { mq.removeListener(handler); } };
  }, []);
  return reduced;
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
      <div style={{ position: "fixed", inset: 0, background: "#000c", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }}>
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
                <label style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "#111", border: `1px dashed ${C.border}`, borderRadius: 10, cursor: "pointer", width: "fit-content" }}>
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
    <div style={{ position: "fixed", inset: 0, background: "#000c", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }} onClick={onClose}>
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
                  <button onClick={() => setOpenCat(openCat === cat ? null : cat)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#111", border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", color: C.white, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
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
const newSimpleEx = () => ({ id: Date.now().toString(), type: "exercise", name: "", sets: 3, reps: "12", mode: "reps", duration: 30, rest: 60, tempo: "", note: "", photo: null, suggested_weight: "", weight_type: "haltères" });
const newCircuit = () => ({ id: Date.now().toString(), type: "circuit", rounds: 3, rest_between_rounds: 120, interval_mode: false, exercises: [{ id: Date.now().toString() + "a", name: "", reps: "12", mode: "reps", duration: 30, work_time: 30, rest_time: 30, tempo: "", note: "", suggested_weight: "", weight_type: "haltères" }] });
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
            <button key={val} type="button" onClick={() => onChange({ ...ex, mode: val })} style={{ flex: 1, padding: "8px", borderRadius: 8, border: `1.5px solid ${(ex.mode || "reps") === val ? C.pink : C.border}`, background: (ex.mode || "reps") === val ? C.pink + "22" : "#111", color: (ex.mode || "reps") === val ? C.pink : C.textMuted, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>{label}</button>
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
  const addCircuitEx = cid => setBlocks(b => b.map(x => x.id === cid ? { ...x, exercises: [...x.exercises, { id: Date.now().toString(), name: "", reps: "12", mode: "reps", duration: 30, work_time: 30, rest_time: 30, note: "", suggested_weight: "", weight_type: "haltères" }] } : x));
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
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: "'Helvetica Neue', Arial, sans-serif", padding: 20 }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 14, marginBottom: 18, padding: 0 }}>← Retour</button>
      <h2 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 6px" }}>{workout.name}</h2>
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
              background: b.type === "circuit" ? C.purple + "0f" : b.type === "warmup" ? C.yellow + "0f" : "#111",
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
  const [showSimpleLog, setShowSimpleLog] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [circuitExIdx, setCircuitExIdx] = useState(0);
  const [intervalPhase, setIntervalPhase] = useState("work");
  const [savingFinal, setSavingFinal] = useState(false);
  const [saveError, setSaveError] = useState("");
  const timerRef = useRef(null);

  const currentBlock = blocks[blockIdx];
  const allExercises = blocks.flatMap(b => b.type === "circuit" ? b.exercises : (b.type === "warmup" ? b.exercises : [b]));

  // Nombre de séries attendues pour un exercice donné (pour générer les lignes de perf)
  const getExpectedSets = (ex) => {
    const n = parseInt(ex.sets, 10);
    return n && n > 0 ? n : 1;
  };

  const lastLog = sessionLogs.find(l => l.workout_id === workout.id);
  const lastExLogs = (() => { try { return JSON.parse(lastLog?.exercise_logs || "{}"); } catch { return {}; } })();
  const getLastPerf = (exName) => Object.values(lastExLogs).find(l => l.name === exName);
  const getAllPerfs = (exName) => sessionLogs
    .filter(l => l.workout_id === workout.id)
    .map(l => { try { const logs = JSON.parse(l.exercise_logs || "{}"); return { date: l.date, ...Object.values(logs).find(e => e.name === exName) }; } catch { return null; } })
    .filter(l => l && (l.weight || l.reps || (l.sets && l.sets.some(s => s.weight || s.reps)))).slice(0, 5);

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
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: "'Helvetica Neue', Arial, sans-serif", padding: 20 }}>
      <div style={{ textAlign: "center", paddingTop: 40, marginBottom: 32 }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>🏆</div>
        <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>Séance terminée !</h1>
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
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
              {Array.from({ length: getExpectedSets(currentBlock) }, (_, i) => {
                const sets = exLogs[currentBlock.id]?.sets || Array.from({ length: getExpectedSets(currentBlock) }, () => ({ weight: "", reps: "" }));
                return (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "28px 1fr 1fr", gap: 8, alignItems: "center" }}>
                    <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, textAlign: "center" }}>S{i + 1}</div>
                    <input type="text" placeholder="ex: 10 kg" value={sets[i]?.weight || ""} onChange={e => setSetField(currentBlock.id, i, "weight", e.target.value, getExpectedSets(currentBlock))} style={{ ...inputSt, fontSize: 13 }} />
                    <input type="text" placeholder={currentBlock.reps} value={sets[i]?.reps || ""} onChange={e => setSetField(currentBlock.id, i, "reps", e.target.value, getExpectedSets(currentBlock))} style={{ ...inputSt, fontSize: 13 }} />
                  </div>
                );
              })}
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
              {[{ l: "SÉRIES", v: `${simpleSets}/${currentBlock.sets}`, c: C.pink }, (currentBlock.mode || "reps") === "time" ? { l: "DURÉE", v: `${currentBlock.duration || 30}s`, c: C.white } : { l: "REPS", v: currentBlock.reps, c: C.white }, { l: "REPOS", v: `${currentBlock.rest}s`, c: C.orange }].map(s => (
                <div key={s.l} style={{ background: "#111", borderRadius: 12, padding: "12px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>{s.l}</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: s.c }}>{s.v}</div>
                </div>
              ))}
            </div>
            {currentBlock.note && <div style={{ background: C.pink + "0f", border: `1px solid ${C.pink}33`, borderRadius: 12, padding: 14, marginBottom: 14, fontSize: 14, lineHeight: 1.5, whiteSpace: "pre-line" }}>💡 {currentBlock.note}</div>}
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              {Array.from({ length: currentBlock.sets }, (_, i) => (
                <div key={i} style={{ width: 36, height: 36, borderRadius: "50%", background: i < simpleSets ? C.green : i === simpleSets ? C.pink + "22" : "#111", border: `2px solid ${i < simpleSets ? C.green : i === simpleSets ? C.pink : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: i < simpleSets ? C.black : i === simpleSets ? C.pink : C.textMuted }}>{i < simpleSets ? "✓" : i + 1}</div>
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
                {circuitEx.note && <div style={{ background: C.pink + "0f", border: `1px solid ${C.pink}33`, borderRadius: 12, padding: 14, marginBottom: 14, fontSize: 14, whiteSpace: "pre-line" }}>💡 {circuitEx.note}</div>}
                <Btn onClick={startIntervalWork} style={{ fontSize: 17, background: C.green, color: C.black }}>▶ Démarrer</Btn>
              </div>
            ) : (
              <div>
                {(circuitEx.mode || "reps") === "time" ? (
                  <div style={{ background: "#111", borderRadius: 12, padding: "14px", textAlign: "center", marginBottom: 14 }}><div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>DURÉE</div><div style={{ fontSize: 32, fontWeight: 900, color: C.purple }}>{circuitEx.duration || 30}s</div></div>
                ) : (
                  <div style={{ background: "#111", borderRadius: 12, padding: "14px", textAlign: "center", marginBottom: 14 }}><div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>REPS</div><div style={{ fontSize: 32, fontWeight: 900, color: C.purple }}>{circuitEx.reps}</div></div>
                )}
                {circuitEx.note && <div style={{ background: C.pink + "0f", border: `1px solid ${C.pink}33`, borderRadius: 12, padding: 14, marginBottom: 14, fontSize: 14, whiteSpace: "pre-line" }}>💡 {circuitEx.note}</div>}
                {(circuitEx.mode || "reps") === "time" ? (
                  <Btn onClick={() => startTimer(circuitEx.duration || 30, "⚡ TRAVAIL", advanceCircuit)} style={{ fontSize: 17, background: C.green, color: C.black }}>▶ Lancer le chrono ({circuitEx.duration || 30}s)</Btn>
                ) : (
                  <Btn onClick={advanceCircuit} style={{ fontSize: 17, background: C.purple, color: C.white }}>✅ Exo suivant →</Btn>
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
    const { data } = await supabase.from("clients").select("id, name, avatar, goal, start_date, next_payment, sessions_per_week, monthly_amount, streak, today_done, user_id, contract_accepted, is_paused, contract_ended, contract_ended_at, created_at").order("created_at");
    const result = data || [];
    writeCache("clients", result);
    setClients(result); setLoading(false);
  };
  useEffect(() => { fetch(); }, []);
  const addClient = async (c) => { const { data } = await supabase.from("clients").insert([c]).select().single(); if (data) setClients(cl => [...cl, data]); return data; };
  const updateClient = async (id, patch) => { const { data } = await supabase.from("clients").update(patch).eq("id", id).select().single(); if (data) setClients(c => c.map(x => x.id === id ? data : x)); return data; };
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
    const { data } = await supabase.from("client_workouts").select("workout_id, client_id");
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
    const [{ data: ws }, { data: exs }] = await Promise.all([
      supabase.from("workouts").select("id, name, description, created_at, is_archived, blocks").order("created_at"),
      supabase.from("exercises").select("id, workout_id, name, sets, reps, rest, note, photo, position, suggested_weight, weight_type, tempo").order("position"),
    ]);
    await fetchAssignments();
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
  const setArchived = async (id, isArchived) => {
    await supabase.from("workouts").update({ is_archived: isArchived }).eq("id", id);
    setWorkouts(w => w.map(x => x.id === id ? { ...x, is_archived: isArchived } : x));
  };
  return { workouts, loading, saveWorkout, deleteWorkout, setArchived, assignmentsByWorkout, toggleAssignment };
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
    const { data } = await supabase.from("payments").select("id, client_id, amount, paid_date, next_due_date, note").order("paid_date", { ascending: false });
    const result = data || [];
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
const useClientData = (clientId) => {
  const cacheKey = `client-data:${clientId || "none"}`;
  const [entries, setEntries] = useState(() => readCache(cacheKey)?.entries || []);
  const [weights, setWeights] = useState(() => readCache(cacheKey)?.weights || []);
  const [measurements, setMeasurements] = useState(() => readCache(cacheKey)?.measurements || []);
  const [assignedWorkouts, setAssignedWorkouts] = useState(() => readCache(cacheKey)?.assignedWorkouts || []);
  const [progressPhotos, setProgressPhotos] = useState(() => readCache(cacheKey)?.progressPhotos || []);
  const [payments, setPayments] = useState(() => readCache(cacheKey)?.payments || []);
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
      setLoading(false);
    } else {
      setEntries([]); setWeights([]); setMeasurements([]); setAssignedWorkouts([]); setProgressPhotos([]); setPayments([]);
      setLoading(true);
    }
    const [e, w, m, cw, pp, pay] = await Promise.all([
      supabase.from("entries").select("id, client_id, date, feeling, steps, meal_note, photos, calories_total, protein_total, carb_total, fat_total, session_status, session_note, hydration, sleep_hours, nap, had_difficulty, difficulty_note, coach_message").eq("client_id", clientId).order("date", { ascending: false }),
      supabase.from("weights").select("id, client_id, value, date").eq("client_id", clientId).order("date"),
      supabase.from("measurements").select("id, client_id, chest, waist, hips, thighs, date").eq("client_id", clientId).order("date"),
      supabase.from("client_workouts").select("workout_id, scheduled_date, workouts(id, name, description, blocks, exercises(*))").eq("client_id", clientId),
      supabase.from("progress_photos").select("id, client_id, photo, note, date").eq("client_id", clientId).order("date", { ascending: false }),
      supabase.from("payments").select("id, client_id, amount, paid_date, next_due_date, note").eq("client_id", clientId).order("paid_date", { ascending: false }),
    ]);
    const nextPayload = {
      entries: e.data || [],
      weights: w.data || [],
      measurements: m.data || [],
      assignedWorkouts: (cw.data || []).map(x => ({ workout_id: x.workout_id, scheduled_date: x.scheduled_date, workout: x.workouts })),
      progressPhotos: pp.data || [],
      payments: pay.data || [],
    };
    writeCache(cacheKey, nextPayload);
    setEntries(nextPayload.entries); setWeights(nextPayload.weights); setMeasurements(nextPayload.measurements);
    setAssignedWorkouts(nextPayload.assignedWorkouts); setProgressPhotos(nextPayload.progressPhotos); setPayments(nextPayload.payments);
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
const JournalForm = ({ entries, onSave, onBack, clientId }) => {
  const [selectedDate, setSelectedDate] = useState(today);
  const [feeling, setFeeling] = useState(null);
  const [steps, setSteps] = useState("");
  const [mealNote, setMealNote] = useState("");
  const [photos, setPhotos] = useState([]);
  const [caloriesTotal, setCaloriesTotal] = useState("");
  const [proteinTotal, setProteinTotal] = useState("");
  const [carbTotal, setCarbTotal] = useState("");
  const [fatTotal, setFatTotal] = useState("");
  const [sessionStatus, setSessionStatus] = useState(null);
  const [sessionNote, setSessionNote] = useState("");
  const [hydration, setHydration] = useState("");
  const [sleepHours, setSleepHours] = useState("");
  const [nap, setNap] = useState(null);
  const [hadDifficulty, setHadDifficulty] = useState(null);
  const [difficultyNote, setDifficultyNote] = useState("");
  const [saving, setSaving] = useState(false);

  const existing = entries.find(e => e.date === selectedDate) || null;

  useEffect(() => {
    if (existing) {
      setFeeling(existing.feeling || null); setSteps(existing.steps?.toString() || "");
      setMealNote(existing.meal_note || ""); setPhotos(existing.photos || []);
      setCaloriesTotal(existing.calories_total?.toString() || ""); setProteinTotal(existing.protein_total?.toString() || "");
      setCarbTotal(existing.carb_total?.toString() || ""); setFatTotal(existing.fat_total?.toString() || "");
      setSessionStatus(existing.session_status || null); setSessionNote(existing.session_note || "");
      setHydration(existing.hydration?.toString() || ""); setSleepHours(existing.sleep_hours?.toString() || "");
      setNap(existing.nap ?? null); setHadDifficulty(existing.had_difficulty ?? null);
      setDifficultyNote(existing.difficulty_note || "");
    } else {
      setFeeling(null); setSteps(""); setMealNote(""); setPhotos([]);
      setCaloriesTotal(""); setProteinTotal(""); setCarbTotal(""); setFatTotal("");
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
    await onSave({
      date: selectedDate, steps: parseInt(steps) || 0, feeling: feeling || 3, meal_note: mealNote, photos,
      calories_total: caloriesTotal ? parseInt(caloriesTotal) : null,
      protein_total: proteinTotal ? parseFloat(proteinTotal) : null,
      carb_total: carbTotal ? parseFloat(carbTotal) : null,
      fat_total: fatTotal ? parseFloat(fatTotal) : null,
      session_status: sessionStatus || "rest", session_note: sessionNote,
      hydration: parseFloat(hydration) || 0, sleep_hours: parseFloat(sleepHours) || 0,
      nap: nap || false, had_difficulty: hadDifficulty || false, difficulty_note: difficultyNote,
    });
    setSaving(false); onBack();
  };

  return (
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: "'Helvetica Neue', Arial, sans-serif", padding: 20 }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 14, marginBottom: 18, padding: 0 }}>← Retour</button>
      <h2 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 14px" }}>Mon journal 📋</h2>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>📅 Pour quel jour ?</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {Array.from({ length: 4 }, (_, i) => {
            const d = new Date(); d.setDate(d.getDate() - i);
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
            {feelings.map((f, i) => (<button key={i} onClick={() => setFeeling(i + 1)} style={{ flex: 1, padding: "12px 0", background: feeling === i + 1 ? C.pink + "22" : "#111", border: `2px solid ${feeling === i + 1 ? C.pink : C.border}`, borderRadius: 12, fontSize: 22, cursor: "pointer" }}>{f}</button>))}
          </div>
          {feeling && <div style={{ textAlign: "center", fontSize: 12, color: C.textMuted, marginTop: 6 }}>{feelingLabels[feeling - 1]}</div>}
        </div>
        <Inp label="Nombre de pas" type="number" inputMode="numeric" placeholder="ex: 9500" value={steps} onChange={e => setSteps(e.target.value)} />
        <div>
          <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>💧 Hydratation (hors thé & café)</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["0.5", "1", "1.5", "2", "2.5", "3+"].map(v => { const val = v === "3+" ? "3" : v; return <button key={v} onClick={() => setHydration(val)} style={{ padding: "10px 16px", borderRadius: 12, border: `2px solid ${hydration === val ? C.blue : C.border}`, background: hydration === val ? C.blue + "22" : "#111", color: hydration === val ? C.blue : C.textMuted, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>{v} L</button>; })}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>😴 Heures de sommeil</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            {["5", "6", "7", "8", "9", "10+"].map(v => { const val = v === "10+" ? "10" : v; return <button key={v} onClick={() => setSleepHours(val)} style={{ padding: "10px 16px", borderRadius: 12, border: `2px solid ${sleepHours === val ? C.purple : C.border}`, background: sleepHours === val ? C.purple + "22" : "#111", color: sleepHours === val ? C.purple : C.textMuted, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>{v}h</button>; })}
          </div>
          <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Sieste ?</div>
          <div style={{ display: "flex", gap: 10 }}>
            {[true, false].map(val => (<button key={String(val)} onClick={() => setNap(val)} style={{ flex: 1, padding: 12, borderRadius: 12, border: `2px solid ${nap === val ? C.purple : C.border}`, background: nap === val ? C.purple + "22" : "#111", color: nap === val ? C.purple : C.textMuted, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>{val ? "😴 Oui" : "❌ Non"}</button>))}
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
          <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>🍽️ Alimentation du jour</div>
          <TA label="Commentaire repas" placeholder="Ce que tu as mangé aujourd'hui, ressenti, écarts..." value={mealNote} onChange={e => setMealNote(e.target.value)} style={{ marginBottom: 14 }} />
          <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "#111", border: `1px dashed ${C.pink}55`, borderRadius: 10, cursor: "pointer", marginBottom: 14 }}>
            <span style={{ fontSize: 20 }}>📷</span>
            <div><div style={{ fontSize: 13, color: C.white, fontWeight: 600 }}>Ajouter des photos repas</div><div style={{ fontSize: 11, color: C.textMuted }}>Pellicule ou appareil photo</div></div>
            <input type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handlePhoto} />
          </label>
          {photos.length > 0 && (
            <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
              {photos.map((p, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img src={p} alt="" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 10 }} />
                  <button onClick={() => setPhotos(photos.filter((_, j) => j !== i))} style={{ position: "absolute", top: -6, right: -6, background: C.red, border: "none", borderRadius: "50%", width: 18, height: 18, color: "white", fontSize: 10, cursor: "pointer" }}>✕</button>
                </div>
              ))}
            </div>
          )}
          <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Totaux du jour (si tu les connais)</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Inp label="Calories (kcal)" type="number" inputMode="numeric" placeholder="ex: 1750" value={caloriesTotal} onChange={e => setCaloriesTotal(e.target.value)} />
            <Inp label="Protéines (g)" type="number" inputMode="numeric" placeholder="ex: 110" value={proteinTotal} onChange={e => setProteinTotal(e.target.value)} />
            <Inp label="Glucides (g)" type="number" inputMode="numeric" placeholder="ex: 180" value={carbTotal} onChange={e => setCarbTotal(e.target.value)} />
            <Inp label="Lipides (g)" type="number" inputMode="numeric" placeholder="ex: 60" value={fatTotal} onChange={e => setFatTotal(e.target.value)} />
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Séance du jour</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {SESSION_OPTIONS.map(opt => (<button key={opt.value} onClick={() => setSessionStatus(opt.value)} style={{ padding: 13, borderRadius: 12, border: `2px solid ${sessionStatus === opt.value ? opt.color : C.border}`, background: sessionStatus === opt.value ? opt.color + "22" : "#111", color: sessionStatus === opt.value ? opt.color : C.textMuted, fontWeight: 700, fontSize: 14, cursor: "pointer", textAlign: "left" }}>{opt.label}</button>))}
          </div>
          {sessionStatus === "done" && (<div style={{ marginTop: 12 }}><TA label="Note (optionnel)" placeholder="Comment ça s'est passé ?" value={sessionNote} onChange={e => setSessionNote(e.target.value)} /></div>)}
        </div>
        <div>
          <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>⚠️ As-tu rencontré une difficulté ?</div>
          <div style={{ display: "flex", gap: 10, marginBottom: hadDifficulty ? 12 : 0 }}>
            {[true, false].map(val => (<button key={String(val)} onClick={() => setHadDifficulty(val)} style={{ flex: 1, padding: 13, borderRadius: 12, border: `2px solid ${hadDifficulty === val ? (val ? C.orange : C.green) : C.border}`, background: hadDifficulty === val ? (val ? C.orange + "22" : C.green + "22") : "#111", color: hadDifficulty === val ? (val ? C.orange : C.green) : C.textMuted, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>{val ? "⚠️ Oui" : "✅ Non"}</button>))}
          </div>
          {hadDifficulty && (<TA label="Décris la difficulté" placeholder="Ex: j'ai craqué le soir..." value={difficultyNote} onChange={e => setDifficultyNote(e.target.value)} />)}
        </div>
        <Btn onClick={handleSave} disabled={saving} style={{ marginBottom: 30 }}>
          {saving ? "Enregistrement..." : existing ? "💾 Mettre à jour" : "💾 Enregistrer mon journal"}
        </Btn>
      </div>
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
            <div key={i} style={{ padding: "10px 12px", background: "#111", borderRadius: 10, marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{exLog.name}</div>
                {exLog.suggested_weight && <div style={{ fontSize: 11, color: C.textMuted }}>Suggéré : {exLog.suggested_weight} {exLog.weight_type}</div>}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {exLog.sets.map((s, si) => (s.weight || s.reps) && (
                  <div key={si} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 8px", background: "#1a1a1a", borderRadius: 8 }}>
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

const EntryDetail = ({ entry, onBack }) => (
  <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: "'Helvetica Neue', Arial, sans-serif", padding: 20 }}>
    <button onClick={onBack} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 14, marginBottom: 18, padding: 0 }}>← Retour</button>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
      <h2 style={{ fontSize: 20, fontWeight: 900, margin: 0 }}>{new Date(entry.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</h2>
      <span style={{ fontSize: 36 }}>{feelings[(entry.feeling || 3) - 1]}</span>
    </div>
    <div style={{ fontSize: 14, color: C.textMuted, marginBottom: 20, fontWeight: 600 }}>{feelingLabels[(entry.feeling || 3) - 1]}</div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14 }}><div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>PAS</div><div style={{ fontSize: 24, fontWeight: 900, color: C.pink }}>{(entry.steps || 0).toLocaleString()}</div></div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14 }}><div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>SÉANCE</div><div style={{ fontWeight: 700, fontSize: 13, color: sessionColor(entry.session_status) }}>{sessionLabel(entry.session_status)}</div></div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14 }}><div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>💧 HYDRATATION</div><div style={{ fontSize: 24, fontWeight: 900, color: C.blue }}>{entry.hydration || "—"} L</div></div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14 }}><div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>😴 SOMMEIL</div><div style={{ fontSize: 20, fontWeight: 900 }}>{entry.sleep_hours || "—"}h{entry.nap ? <span style={{ fontSize: 13, color: C.purple }}> · sieste</span> : ""}</div></div>
    </div>
    {(entry.calories_total || entry.protein_total || entry.carb_total || entry.fat_total) && (
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 12 }}>🍽️ TOTAUX ALIMENTAIRES</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {[{ l: "KCAL", v: entry.calories_total, c: C.yellow, u: "" }, { l: "PROT", v: entry.protein_total, c: C.green, u: "g" }, { l: "GLUC", v: entry.carb_total, c: C.blue, u: "g" }, { l: "LIP", v: entry.fat_total, c: C.pink, u: "g" }].map(s => (
            <div key={s.l} style={{ background: "#111", borderRadius: 10, padding: "8px 4px", textAlign: "center" }}><div style={{ fontSize: 15, fontWeight: 900, color: s.c }}>{s.v != null ? `${s.v}${s.u}` : "—"}</div><div style={{ fontSize: 9, color: C.textMuted, marginTop: 2 }}>{s.l}</div></div>
          ))}
        </div>
      </div>
    )}
    {entry.meal_note && <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, marginBottom: 12 }}><div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 8 }}>🍽️ REPAS</div><div style={{ fontSize: 14, lineHeight: 1.6 }}>{entry.meal_note}</div></div>}
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

const EntryCard = ({ e, onClick }) => (
  <Card onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
      <span style={{ fontWeight: 700 }}>{new Date(e.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {onClick && <span style={{ fontSize: 11, color: C.textMuted }}>Voir →</span>}
        <span style={{ fontSize: 22 }}>{feelings[(e.feeling || 3) - 1]}</span>
      </div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: e.photos?.length > 0 || e.meal_note || e.had_difficulty || e.coach_message || e.calories_total ? 12 : 0 }}>
      <div style={{ background: "#111", borderRadius: 10, padding: 10 }}><div style={{ fontSize: 10, color: C.textMuted, marginBottom: 2 }}>PAS</div><div style={{ fontSize: 18, fontWeight: 900, color: C.pink }}>{(e.steps || 0).toLocaleString()}</div></div>
      <div style={{ background: "#111", borderRadius: 10, padding: 10 }}><div style={{ fontSize: 10, color: C.textMuted, marginBottom: 2 }}>SÉANCE</div><div style={{ fontWeight: 700, fontSize: 13, color: sessionColor(e.session_status) }}>{sessionLabel(e.session_status)}</div></div>
      <div style={{ background: "#111", borderRadius: 10, padding: 10 }}><div style={{ fontSize: 10, color: C.textMuted, marginBottom: 2 }}>HYDRATATION</div><div style={{ fontSize: 18, fontWeight: 900, color: C.blue }}>{e.hydration || "—"} L</div></div>
      <div style={{ background: "#111", borderRadius: 10, padding: 10 }}><div style={{ fontSize: 10, color: C.textMuted, marginBottom: 2 }}>SOMMEIL</div><div style={{ fontSize: 15, fontWeight: 700 }}>{e.sleep_hours || "—"}h {e.nap ? "· 😴" : ""}</div></div>
    </div>
    {e.calories_total != null && <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
      <Badge color={C.yellow}>{e.calories_total} kcal</Badge>
      {e.protein_total != null && <Badge color={C.green}>💪 {e.protein_total}g</Badge>}
      {e.carb_total != null && <Badge color={C.blue}>🌾 {e.carb_total}g</Badge>}
      {e.fat_total != null && <Badge color={C.pink}>🥑 {e.fat_total}g</Badge>}
    </div>}
    {e.photos && e.photos.length > 0 && <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>{e.photos.slice(0, 3).map((p, i) => <img key={i} src={p} alt="" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }} />)}{e.photos.length > 3 && <div style={{ width: 60, height: 60, borderRadius: 8, background: "#111", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: C.textMuted }}>+{e.photos.length - 3}</div>}</div>}
    {e.meal_note && <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 8 }}><span style={{ color: C.white, fontWeight: 700 }}>Repas : </span>{e.meal_note.length > 80 ? e.meal_note.slice(0, 80) + "..." : e.meal_note}</div>}
    {e.had_difficulty && <div style={{ background: C.orange + "15", border: `1px solid ${C.orange}44`, borderRadius: 10, padding: 10, marginBottom: 8 }}><div style={{ fontSize: 11, color: C.orange, fontWeight: 700, marginBottom: 4 }}>⚠️ DIFFICULTÉ</div><div style={{ fontSize: 13 }}>{e.difficulty_note}</div></div>}
    {e.coach_message && <div style={{ background: C.pink + "15", borderRadius: 10, padding: 10, fontSize: 13, color: C.pink }}>💬 {e.coach_message}</div>}
  </Card>
);

const PaymentHistory = ({ payments }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
    {payments.length === 0 && <p style={{ color: C.textMuted, textAlign: "center", margin: 0 }}>Aucun paiement enregistré.</p>}
    {payments.map((p, i) => (
      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "#111", borderRadius: 12 }}>
        <div><div style={{ fontWeight: 700, fontSize: 14, color: C.green }}>✅ {p.amount} €</div><div style={{ fontSize: 12, color: C.textMuted }}>Reçu le {formatDate(p.paid_date)}</div>{p.note && <div style={{ fontSize: 12, color: C.textMuted }}>{p.note}</div>}</div>
        <div style={{ textAlign: "right" }}><div style={{ fontSize: 11, color: C.textMuted }}>Prochain</div><div style={{ fontSize: 13, fontWeight: 700, color: C.yellow }}>{formatDate(p.next_due_date)}</div></div>
      </div>
    ))}
  </div>
);

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
    <div style={{ position: "fixed", inset: 0, background: "#000c", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
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
const WorkoutCard = ({ workout: w, clients, allClients, onEdit, onDelete, onArchive, onUnarchive, assignedIds = [], onToggleAssign }) => {
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
        style={{ background: showAssign ? C.pink + "22" : "#111", border: `1px solid ${showAssign ? C.pink : C.border}`, color: showAssign ? C.pink : C.textMuted, borderRadius: 10, padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", width: "100%" }}
      >
        {showAssign ? "✕ Fermer" : `👩 Assigner à des clientes (${assignments.length}/${clients.length})`}
      </button>
      {showAssign && (
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          {clients.length === 0 && <div style={{ fontSize: 13, color: C.textMuted, textAlign: "center", padding: 10 }}>Aucune cliente active</div>}
          {clients.map(c => {
            const assigned = assignments.includes(c.id);
            return (
              <div key={c.id} onClick={() => toggle(c.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: assigned ? C.green + "12" : "#111", border: `1px solid ${assigned ? C.green + "44" : C.border}`, borderRadius: 10, cursor: "pointer" }}>
                <Avatar initials={c.avatar} size={28} color={C.pink} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.white }}>{c.name}</div>
                </div>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: assigned ? C.green : "#222", border: `2px solid ${assigned ? C.green : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: C.black, fontWeight: 900 }}>
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
  const { workouts, loading: loadingWorkouts, saveWorkout, deleteWorkout, setArchived, assignmentsByWorkout, toggleAssignment } = useWorkouts();
      const { payments: allPayments, loadingPayments, addPaymentRecord } = usePayments();
  const [selected, setSelected] = useState(null);
  const [mainTab, setMainTab] = useState("dashboard");
  const [clientTab, setClientTab] = useState("journal");
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [buildingWorkout, setBuildingWorkout] = useState(false);
  const [showArchivedWorkouts, setShowArchivedWorkouts] = useState(false);
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

  // ── ADMIN ────────────────────────────────────────────────────────────────
  const [adminUsers, setAdminUsers] = useState([]);
  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [resetTargetId, setResetTargetId] = useState(null);
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resettingId, setResettingId] = useState(null);

  const [todayEntries, setTodayEntries] = useState([]);
  const [notifGranted, setNotifGranted] = useState(typeof Notification !== "undefined" && Notification.permission === "granted");

  const client = clients.find(c => c.id === selected);
  const { entries, weights, measurements, assignedWorkouts, progressPhotos, payments, loading: loadingData, addEntry, updateEntry, toggleWorkout, updateScheduledDate, addPayment } = useClientData(selected);
  // Vérifie si une cliente a rempli son journal AUJOURD'HUI (recharge chaque fois que todayEntries change)
  const isDoneToday = (clientId) => todayEntries.some(e => e.client_id === clientId);
  // Exclure les clientes en pause et les contrats terminés des alertes paiement/journal
  const paymentAlerts = clients.filter(c => { const d = daysUntil(c.next_payment); return d >= 0 && d <= 5 && !c.is_paused && !c.contract_ended; });
  const pendingJournalClients = clients.filter(c => !c.is_paused && !c.contract_ended && !isDoneToday(c.id));
  const urgentPayments = clients.filter(c => !c.is_paused && !c.contract_ended && daysUntil(c.next_payment) <= 7);
  const sortByName = (a, b) => a.name.localeCompare(b.name, "fr", { sensitivity: "base" });
  const activeWorkoutsList = workouts.filter(w => !w.is_archived).sort(sortByName);
  const archivedWorkoutsList = workouts.filter(w => w.is_archived).sort(sortByName);

  // Chargement des entrées du jour + abonnement temps réel
  useEffect(() => {
    supabase.from("entries").select("client_id, date").eq("date", today).then(({ data }) => setTodayEntries(data || []));
    const channel = supabase.channel("coach_entries_today")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "entries" }, (payload) => {
        if (payload.new.date !== today) return;
        setTodayEntries(prev => prev.some(e => e.client_id === payload.new.client_id) ? prev : [...prev, payload.new]);
        // Notification navigateur coach
        const newClient = clients.find(c => c.id === payload.new.client_id);
        if (newClient) {
          if (typeof Notification !== "undefined" && Notification.permission === "granted") {
            new Notification(BRAND_NAME + " 📋", { body: `${newClient.name} vient de remplir son journal !`, icon: "/logo.png" });
          }
        }
      })
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
    if (mainTab === "admin" && !selected) {
      setLoadingAdmin(true);
      setAdminError("");
      callAdminFunction({ action: "list_users" }).then(res => {
        if (res.error) { setAdminError(res.error); setAdminUsers([]); }
        else { setAdminUsers(res.users || []); }
        setLoadingAdmin(false);
      });
    }
  }, [mainTab, selected]);

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
    const { data: authData, error: authErr } = await supabase.auth.signUp({ email: newClientForm.email, password: newClientForm.password });
    if (authErr) { alert("Erreur : " + authErr.message); setAddingClient(false); return; }
    const userId = authData.user?.id;
    const avatar = newClientForm.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
await addClient({ name: newClientForm.name, avatar, goal: newClientForm.goal, start_date: newClientForm.start_date, next_payment: newClientForm.next_payment, sessions_per_week: parseInt(newClientForm.sessions_per_week) || 3, monthly_amount: parseFloat(newClientForm.monthly_amount) || 0, streak: 0, today_done: false, user_id: userId, contract_accepted: false });    setAddingClient(false); setShowAddClient(false);
    setNewClientForm({ name: "", email: "", password: "", goal: "", start_date: "", next_payment: "", sessions_per_week: "3", monthly_amount: "" });
    alert(`✅ Compte créé !\n\nEmail : ${newClientForm.email}\nMot de passe : ${newClientForm.password}`);
  };

  const handleSaveClient = async (id, patch) => { await updateClient(id, patch); alert("✅ Profil mis à jour !"); };
  const handleDeleteClient = async (id) => { await deleteClient(id); setSelected(null); setMainTab("dashboard"); alert("✅ Cliente supprimée."); };
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
    setMsgText(""); alert("✅ Message envoyé !");
  };

  if (selectedEntry) return <EntryDetail entry={selectedEntry} onBack={() => setSelectedEntry(null)} />;

  if (buildingWorkout || editingWorkout) return (
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: "'Helvetica Neue', Arial, sans-serif", padding: 20 }}>
      <WorkoutBuilder workout={editingWorkout} onSave={async w => { await saveWorkout(w); setEditingWorkout(null); setBuildingWorkout(false); }} onCancel={() => { setEditingWorkout(null); setBuildingWorkout(false); }} />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: "'Helvetica Neue', Arial, sans-serif", display: "flex", flexDirection: "column" }}>
      {/* HEADER */}
      <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <Logo />
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {!notifGranted && (
            <button onClick={requestCoachNotifs} style={{ background: C.orange + "22", border: `1px solid ${C.orange}44`, color: C.orange, borderRadius: 8, padding: "5px 12px", fontSize: 12, cursor: "pointer", fontWeight: 700 }}>🔔 Activer notifs</button>
          )}
          <span style={{ fontSize: 11, color: C.textMuted, background: C.card, padding: "4px 10px", borderRadius: 6 }}>Coach</span>
          <button onClick={onLogout} style={{ background: "none", border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 8, padding: "5px 12px", fontSize: 12, cursor: "pointer" }}>Déconnexion</button>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* SIDEBAR NAV */}
        <div style={{ width: 220, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", overflowY: "auto", flexShrink: 0 }}>
         {[["dashboard", "🏠", "Dashboard"], ["workouts", "💪", "Séances"], ["mediatheque", "📚", "Médiathèque"], ["comptabilite", "💶", "Comptabilité"], ["admin", "🔐", "Admin"]].map(([k, icon, label]) => (
            <button key={k} onClick={() => { setMainTab(k); setSelected(null); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 16px", background: mainTab === k && !selected ? C.pink + "15" : "transparent", borderLeft: `3px solid ${mainTab === k && !selected ? C.pink : "transparent"}`, border: "none", color: mainTab === k && !selected ? C.white : C.textMuted, cursor: "pointer", fontWeight: mainTab === k && !selected ? 700 : 400, fontSize: 14, textAlign: "left" }}>{icon} {label}</button>
          ))}
          <div style={{ padding: "10px 16px 6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Clientes</span>
            <button onClick={() => setShowAddClient(true)} style={{ background: C.pink, border: "none", color: C.black, borderRadius: 6, width: 20, height: 20, fontWeight: 900, fontSize: 14, cursor: "pointer" }}>+</button>
          </div>
          {loadingClients ? <Spinner /> : (() => {
            const active = clients.filter(c => !c.is_paused && !c.contract_ended);
            const paused = clients.filter(c => c.is_paused && !c.contract_ended);
            const ended = clients.filter(c => c.contract_ended);
            const ClientRow = (c) => (
              <div key={c.id} onClick={() => { setSelected(c.id); setMainTab("client"); setClientTab("journal"); }} style={{ padding: "9px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, background: selected === c.id ? C.pink + "15" : "transparent", borderLeft: `3px solid ${selected === c.id ? C.pink : "transparent"}`, opacity: c.contract_ended ? 0.5 : c.is_paused ? 0.65 : 1 }}>
                <div style={{ position: "relative" }}>
                  <Avatar initials={c.avatar} size={28} color={c.contract_ended ? C.muted : c.is_paused ? C.orange : isDoneToday(c.id) ? C.pink : C.muted} />
                  {!c.contract_ended && <div style={{ position: "absolute", bottom: -1, right: -1, width: 7, height: 7, borderRadius: "50%", background: isDoneToday(c.id) ? C.green : C.red, border: `2px solid ${C.black}` }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: c.contract_ended || c.is_paused ? C.textMuted : C.white }}>{c.name}</div>
                  <div style={{ fontSize: 10, color: c.contract_ended ? C.textMuted : c.is_paused ? C.orange : daysUntil(c.next_payment) <= 3 ? C.yellow : C.textMuted }}>
                    {c.contract_ended ? "🏁 Terminé" : c.is_paused ? "⏸ Pause" : daysUntil(c.next_payment) <= 5 ? `⚠️ J-${daysUntil(c.next_payment)}` : `🔥 ${c.streak}j`}
                  </div>
                </div>
              </div>
            );
            return (
              <>
                {active.map(c => ClientRow(c))}
                {paused.length > 0 && (
                  <>
                    <div style={{ margin: "8px 16px 4px", display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ flex: 1, height: 1, background: C.border }} />
                      <span style={{ fontSize: 9, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", flexShrink: 0 }}>En pause</span>
                      <div style={{ flex: 1, height: 1, background: C.border }} />
                    </div>
                    {paused.map(c => ClientRow(c))}
                  </>
                )}
                {ended.length > 0 && (
                  <>
                    <div style={{ margin: "8px 16px 4px", display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ flex: 1, height: 1, background: C.border }} />
                      <span style={{ fontSize: 9, color: C.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", flexShrink: 0 }}>Contrat terminé</span>
                      <div style={{ flex: 1, height: 1, background: C.border }} />
                    </div>
                    {ended.map(c => ClientRow(c))}
                  </>
                )}
              </>
            );
          })()}
        </div>

        {/* MAIN CONTENT */}
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {mainTab === "dashboard" && !selected && (
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 20px" }}>Tableau de bord 👋</h1>
              <Card style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>ACTIONS RAPIDES</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
                  <QuickAction title="Ajouter une cliente" subtitle="Créer un compte et un profil" icon="➕" onClick={() => setShowAddClient(true)} />
                  <QuickAction title="Créer une séance" subtitle="Préparer un programme clair" icon="💪" onClick={() => setBuildingWorkout(true)} />
                  <QuickAction title="Voir la compta" subtitle="Suivre paiements et échéances" icon="💶" onClick={() => setMainTab("comptabilite")} />
                  <QuickAction title="Médiathèque" subtitle="Gérer exercices et contenus" icon="📚" onClick={() => setMainTab("mediatheque")} />
                </div>
              </Card>

              <Card style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>À FAIRE AUJOURD'HUI</div>
                {pendingJournalClients.length === 0 && urgentPayments.length === 0 ? (
                  <div style={{ color: C.textMuted, fontSize: 13 }}>Tout est à jour pour le moment. Bonne journée !</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {pendingJournalClients.length > 0 && (
                      <div style={{ background: "#111", borderRadius: 10, padding: 12 }}>
                        <div style={{ fontWeight: 700, color: C.orange, marginBottom: 6 }}>📝 Journal non rempli</div>
                        {pendingJournalClients.slice(0, 3).map(c => <div key={c.id} style={{ fontSize: 13, color: C.textMuted, padding: "3px 0" }}>{c.name}</div>)}
                      </div>
                    )}
                    {urgentPayments.length > 0 && (
                      <div style={{ background: "#111", borderRadius: 10, padding: 12 }}>
                        <div style={{ fontWeight: 700, color: C.yellow, marginBottom: 6 }}>💳 Paiements à suivre</div>
                        {urgentPayments.slice(0, 3).map(c => <div key={c.id} style={{ fontSize: 13, color: C.textMuted, padding: "3px 0" }}>{c.name} · {formatDate(c.next_payment)}</div>)}
                      </div>
                    )}
                  </div>
                )}
              </Card>

              {paymentAlerts.length > 0 && (
                <div style={{ background: C.yellow + "15", border: `1px solid ${C.yellow}44`, borderRadius: 12, padding: 16, marginBottom: 20 }}>
                  <div style={{ fontWeight: 700, color: C.yellow, marginBottom: 8, fontSize: 13 }}>⚠️ Paiements à venir</div>
                  {paymentAlerts.map(c => <div key={c.id} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}><span style={{ fontSize: 13 }}>{c.name} — {formatDate(c.next_payment)}</span><Badge color={C.yellow}>J-{daysUntil(c.next_payment)}</Badge></div>)}
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
                {[{ label: "Journal today", val: `${clients.filter(c => isDoneToday(c.id)).length}/${clients.filter(c => !c.is_paused && !c.contract_ended).length}`, color: C.pink }, { label: "Séances actives", val: activeWorkoutsList.length, color: C.orange }, { label: "Clientes actives", val: clients.filter(c => !c.is_paused && !c.contract_ended).length, color: C.green }].map(s => (
                  <Card key={s.label}><div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 6 }}>{s.label}</div><div style={{ fontSize: 28, fontWeight: 900, color: s.color }}>{s.val}</div></Card>
                ))}
              </div>
              <Card>
                <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 14 }}>JOURNAL DU JOUR</div>
                {clients.length === 0 && <p style={{ color: C.textMuted, textAlign: "center" }}>Aucune cliente. Clique sur "+" pour en ajouter une.</p>}
                {clients.filter(c => !c.is_paused && !c.contract_ended).map(c => (
                  <div key={c.id} onClick={() => { setSelected(c.id); setMainTab("client"); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: `1px solid ${C.border}`, cursor: "pointer" }}>
                    <Avatar initials={c.avatar} size={32} color={isDoneToday(c.id) ? C.pink : C.muted} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{c.name}</div>
                      {isDoneToday(c.id) ? <div style={{ fontSize: 12, color: C.green }}>✅ Journal rempli aujourd'hui</div> : <div style={{ fontSize: 12, color: C.red }}>Pas encore rempli</div>}
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          )}

          {mainTab === "workouts" && !selected && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <SectionTitle title="Mes séances 💪" subtitle="Construis et gère tes programmes en quelques clics" action={<Btn small onClick={() => setBuildingWorkout(true)} style={{ width: "auto" }}>+ Nouvelle séance</Btn>} />
              </div>
              {loadingWorkouts ? <Spinner /> : (
                <>
                  {activeWorkoutsList.length === 0 && <Card><p style={{ color: C.textMuted, textAlign: "center", margin: 0 }}>Aucune séance active. Clique sur "+ Nouvelle séance" pour commencer.</p></Card>}
                  {activeWorkoutsList.map(w => (
                    <WorkoutCard
                      key={w.id}
                      workout={w}
                      clients={clients.filter(c => !c.is_paused)}
                      allClients={clients}
                      assignedIds={assignmentsByWorkout[w.id] || []}
                      onToggleAssign={toggleAssignment}
                      onEdit={() => setEditingWorkout(w)}
                      onDelete={() => deleteWorkout(w.id)}
                      onArchive={() => setArchived(w.id, true)}
                      onUnarchive={() => setArchived(w.id, false)}
                    />
                  ))}
                  {archivedWorkoutsList.length > 0 && (
                    <div style={{ marginTop: 20 }}>
                      <button
                        onClick={() => setShowArchivedWorkouts(v => !v)}
                        style={{ background: "none", border: "none", color: C.textMuted, fontSize: 13, cursor: "pointer", padding: 0, marginBottom: showArchivedWorkouts ? 14 : 0, textDecoration: "underline" }}
                      >
                        {showArchivedWorkouts ? "▲ Masquer" : "▼ Voir"} les séances archivées ({archivedWorkoutsList.length})
                      </button>
                      {showArchivedWorkouts && archivedWorkoutsList.map(w => (
                        <WorkoutCard
                          key={w.id}
                          workout={w}
                          clients={clients.filter(c => !c.is_paused)}
                          allClients={clients}
                          assignedIds={assignmentsByWorkout[w.id] || []}
                          onToggleAssign={toggleAssignment}
                          onEdit={() => setEditingWorkout(w)}
                          onDelete={() => deleteWorkout(w.id)}
                          onArchive={() => setArchived(w.id, true)}
                          onUnarchive={() => setArchived(w.id, false)}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
           </div>
          )}

          {mainTab === "mediatheque" && !selected && (
            <CatalogPickerModal onClose={() => setMainTab("dashboard")} onSelect={() => {}} />
          )}

          {mainTab === "comptabilite" && !selected && (() => {
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
                <SectionTitle title="Comptabilité 💶" subtitle="Pilote tes paiements et tes échéances sereinement" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20 }}>
                  <Card><div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 6 }}>CA PRÉVU (CE MOIS)</div><div style={{ fontSize: 26, fontWeight: 900, color: C.pink }}>{caPrevu.toFixed(0)} €</div></Card>
                  <Card><div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 6 }}>CA ENCAISSÉ (CE MOIS)</div><div style={{ fontSize: 26, fontWeight: 900, color: C.green }}>{caEncaisse.toFixed(0)} €</div></Card>
                  <Card><div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 6 }}>CLIENTES À ENCAISSER</div><div style={{ fontSize: 26, fontWeight: 900, color: C.orange }}>{dueThisMonth.length}</div></Card>
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
                <Card>
                  <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 14 }}>TOUTES LES CLIENTES</div>
                  {loadingPayments ? <Spinner /> : activeForBilling.map(c => {
                    const status = rowStatus(c);
                    return (
                      <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: `1px solid ${C.border}` }}>
                        <Avatar initials={c.avatar} size={30} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 13 }}>{c.name}</div>
                          <div style={{ fontSize: 11, color: C.textMuted }}>{c.monthly_amount} € · échéance {formatDate(c.next_payment)}</div>
                        </div>
                       <Badge color={status === "avenir" ? C.green : status === "nouvelle" ? C.blue : status === "retard" ? C.red : C.yellow}>
                          {status === "avenir" ? "✅ À jour" : status === "nouvelle" ? "👋 Nouvelle" : status === "retard" ? "🔴 En retard" : "⏳ En attente"}
                        </Badge>
                        {(status === "attente" || status === "retard") && (
                          <button onClick={() => handleMarkPaid(c)} style={{ background: C.green, border: "none", borderRadius: 8, padding: "7px 14px", fontWeight: 700, fontSize: 12, color: C.black, cursor: "pointer" }}>
                            ✓ Reçu
                          </button>
                        )}
                      </div>
                    );
                  })}
                  {activeForBilling.length === 0 && <p style={{ color: C.textMuted, textAlign: "center" }}>Aucune cliente active.</p>}
                </Card>
              </div>
            );
          })()}
        
          {mainTab === "admin" && !selected && (
            <div>
              <SectionTitle title="Administration 🔐" subtitle="Réinitialise le mot de passe d'une cliente directement depuis l'app, sans passer par Supabase." />
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

          {mainTab === "client" && client && (
            <div>
              <button onClick={() => { setSelected(null); setMainTab("dashboard"); }} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 13, marginBottom: 18, padding: 0 }}>← Retour</button>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <Avatar initials={client.avatar} size={46} />
                <div style={{ flex: 1 }}>
                  <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 900 }}>{client.name}</h2>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {client.contract_ended && <Badge color={C.textMuted}>🏁 Contrat terminé le {formatDate(client.contract_ended_at)}</Badge>}
                    <Badge>🔥 {client.streak}j</Badge>
                    {client.goal && <Badge color={C.purple}>{client.goal}</Badge>}
                    {!client.contract_ended && client.next_payment && <Badge color={C.yellow}>💳 J-{daysUntil(client.next_payment)}</Badge>}
                  </div>
                </div>
                <button onClick={() => setEditingClient(client)} style={{ background: "#222", border: `1px solid ${C.border}`, color: C.white, borderRadius: 10, padding: "8px 14px", fontSize: 13, cursor: "pointer", fontWeight: 600, flexShrink: 0 }}>✏️ Modifier</button>
                {!client.contract_ended && (
                  <button onClick={() => setShowPauseModal(true)} style={{ background: client.is_paused ? C.orange + "22" : "#222", border: `1px solid ${client.is_paused ? C.orange : C.border}`, color: client.is_paused ? C.orange : C.white, borderRadius: 10, padding: "8px 14px", fontSize: 13, cursor: "pointer", fontWeight: 600, flexShrink: 0 }}>
                    {client.is_paused ? "⏸️ En pause" : "⏸️ Pause"}
                  </button>
                )}
                <button onClick={() => handleToggleContractEnded(client)} style={{ background: client.contract_ended ? C.green + "22" : "#222", border: `1px solid ${client.contract_ended ? C.green : C.border}`, color: client.contract_ended ? C.green : C.white, borderRadius: 10, padding: "8px 14px", fontSize: 13, cursor: "pointer", fontWeight: 600, flexShrink: 0 }}>
                  {client.contract_ended ? "🔓 Réactiver" : "🏁 Fin de contrat"}
                </button>
              </div>
              {client.contract_ended && (
                <div style={{ background: C.textMuted + "15", border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, marginBottom: 20, fontSize: 13, color: C.textMuted }}>
                  🏁 Le contrat de {client.name.split(" ")[0]} est marqué comme terminé. Elle garde accès à son espace et aux séances que tu lui assignes, mais n'apparaît plus dans le suivi journal/paiements.
                </div>
              )}

              <Tab tabs={[["journal", "📋 Journal"], ["seances", "💪 Séances"], ["perf", "📊 Perfs"], ["body", "📏 Corps"], ["paiements", "💳 Paiements"], ["message", "💬 Message"]]} active={clientTab} onChange={setClientTab} />

              {clientTab === "journal" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {loadingData ? <Spinner /> : entries.length === 0 ? <Card><p style={{ color: C.textMuted, textAlign: "center", margin: 0 }}>Aucune entrée.</p></Card> : entries.map((e, i) => <EntryCard key={i} e={e} onClick={() => setSelectedEntry(e)} />)}
                </div>
              )}

              {clientTab === "seances" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
                            <div key={i} style={{ background: "#111", borderRadius: 10, padding: "10px 12px" }}>
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
                      <div style={{ background: "#111", borderRadius: 10, padding: 12 }}><div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>DÉBUT</div><div style={{ fontWeight: 700, fontSize: 13 }}>{formatDate(client.start_date)}</div></div>
                      <div style={{ background: "#111", borderRadius: 10, padding: 12 }}><div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>SÉANCES/SEMAINE</div><div style={{ fontWeight: 700, fontSize: 13 }}>{client.sessions_per_week || 3}x</div></div>
                      <div style={{ background: "#111", borderRadius: 10, padding: 12 }}><div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>MONTANT</div><div style={{ fontWeight: 700, fontSize: 18, color: C.green }}>{client.monthly_amount || "—"} €</div></div>
                      <div style={{ background: !client.contract_ended && daysUntil(client.next_payment) <= 3 ? C.yellow + "15" : "#111", borderRadius: 10, padding: 12 }}><div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>PROCHAIN PAIEMENT</div><div style={{ fontWeight: 700, fontSize: 13, color: !client.contract_ended && daysUntil(client.next_payment) <= 3 ? C.yellow : C.white }}>{client.contract_ended ? "Contrat terminé" : formatDate(client.next_payment)}</div></div>
                    </div>
                  </Card>
                  <Card>
                    <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 14 }}>HISTORIQUE DES PAIEMENTS</div>
                    <PaymentHistory payments={payments} />
                    <div style={{ fontSize: 12, color: C.textMuted, marginTop: 12, textAlign: "center" }}>💡 L'enregistrement des paiements se fait désormais depuis l'onglet Comptabilité.</div>
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

      {/* MODALS */}
      {showAddClient && (
        <div style={{ position: "fixed", inset: 0, background: "#000c", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
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
      {editingClient && <EditClientModal client={editingClient} onSave={handleSaveClient} onDelete={handleDeleteClient} onClose={() => setEditingClient(null)} />}
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
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [viewingWorkoutPerfs, setViewingWorkoutPerfs] = useState(null);
  const [sessionLogs, setSessionLogs] = useState([]);
  const [bodyTab, setBodyTab] = useState("weight");
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

  const { entries, weights, measurements, assignedWorkouts, progressPhotos, payments, loading, addEntry, updateEntry, addWeight, addMeasurement, addProgressPhoto } = useClientData(clientId);

  const myWorkouts = assignedWorkouts.filter(a => a.workout).map(a => ({ ...a.workout, scheduledDate: a.scheduled_date }));

  const todayEntry = entries.find(e => e.date === today);
  const todayWorkout = myWorkouts.find(w => w.scheduledDate === today);
  const coachMsg = entries.find(e => e.coach_message)?.coach_message;
  const pendingClientTasks = [];
  if (!todayEntry && !clientInfo?.contract_ended) pendingClientTasks.push({ title: "Compléter ton journal", subtitle: "Un petit check-in vaut souvent mieux que rien", icon: "📝", onClick: () => setScreen("journal"), accent: C.orange });
  if (todayWorkout) pendingClientTasks.push({ title: "Ta séance du jour", subtitle: "Prêt à démarrer ?", icon: "💪", onClick: () => setPreviewWorkout(todayWorkout), accent: C.pink });
  if (!clientInfo?.contract_accepted) pendingClientTasks.push({ title: "Valider ton contrat", subtitle: "Relis les règles et engage-toi", icon: "📄", onClick: () => setScreen("contrat"), accent: C.blue });
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

  if (selectedEntry) return <EntryDetail entry={selectedEntry} onBack={() => setSelectedEntry(null)} />;
  if (previewWorkout) return <WorkoutPreview workout={previewWorkout} onBack={() => setPreviewWorkout(null)} onStart={() => { setActiveWorkout(previewWorkout); setPreviewWorkout(null); }} />;
  if (activeWorkout) return <WorkoutPlayer workout={activeWorkout} onFinish={() => { setActiveWorkout(null); supabase.from("session_logs").select("*").eq("client_id", clientId).order("date", { ascending: false }).then(({ data }) => setSessionLogs(data || [])); }} clientId={clientId} sessionLogs={sessionLogs} />;

  if (screen === "journal") {
    if (!clientId) return <div style={{ minHeight: "100vh", background: C.black, display: "flex", alignItems: "center", justifyContent: "center" }}><Spinner /></div>;
    return <JournalForm entries={entries} onSave={handleSaveJournal} onBack={() => setScreen("home")} clientId={clientId} />;
  }

  if (!clientInfo) return <div style={{ minHeight: "100vh", background: C.black, display: "flex", alignItems: "center", justifyContent: "center" }}><Spinner /></div>;

  if (!onboardingDone) {
    return <ClientOnboarding clientName={clientInfo.name} onFinish={handleCompleteOnboarding} onEnableReminders={handleEnableNotifs} reminderEnabled={notifEnabled} />;
  }

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

  if (screen === "perfs") return (
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: "'Helvetica Neue', Arial, sans-serif", padding: 20 }}>
      <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 14, marginBottom: 18, padding: 0 }}>← Retour</button>
      <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 6 }}>Mes performances 📊</h2>
      <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 20 }}>{sessionLogs.length} séance{sessionLogs.length > 1 ? "s" : ""} au total</p>
      {myWorkouts.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>PAR SÉANCE</div>
          {myWorkouts.map(w => {
            const logs = sessionLogs.filter(l => l.workout_id === w.id);
            if (logs.length === 0) return null;
            return (
              <Card key={w.id} onClick={() => setViewingWorkoutPerfs(w)} style={{ marginBottom: 10, cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div><div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>{w.name}</div><div style={{ fontSize: 12, color: C.textMuted }}>{logs.length} fois · Dernière : {formatDate(logs[0].date)}</div></div>
                  <span style={{ color: C.purple, fontWeight: 700 }}>→</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
      <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>HISTORIQUE COMPLET</div>
      {sessionLogs.length === 0 ? <Card><p style={{ color: C.textMuted, textAlign: "center", margin: 0 }}>Pas encore de séance enregistrée.</p></Card> : sessionLogs.map((log, i) => <div key={i} style={{ marginBottom: 12 }}><PerfCard log={log} workout={myWorkouts.find(w => w.id === log.workout_id)} /></div>)}
    </div>
  );

  // ── HOME ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Logo />
        <button onClick={onLogout} style={{ background: "none", border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 8, padding: "5px 12px", fontSize: 12, cursor: "pointer" }}>Déconnexion</button>
      </div>

      <div style={{ padding: 20, background: "radial-gradient(circle at top left, rgba(232,135,156,0.12), transparent 35%)" }}>
        <PremiumHero
          badge="Espace coaching"
          title={`${clientInfo.name?.split(" ")[0] || "Bonjour"} 👋`}
          subtitle="Tout est pensé pour te guider avec clarté, douceur et efficacité."
          accent={C.pink}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <Badge>🔥 {clientInfo.streak || 0} jours</Badge>
            {clientInfo.contract_ended ? <Badge color={C.textMuted}>🏁 Contrat terminé</Badge> : todayEntry ? <Badge color={C.green}>✅ Journal OK</Badge> : <Badge color={C.orange}>📝 À compléter</Badge>}
          </div>
        </PremiumHero>
{!clientInfo.contract_accepted && (
          <div style={{ background: C.blue + "15", border: `1px solid ${C.blue}44`, borderRadius: 14, padding: 16, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div><div style={{ fontWeight: 700, fontSize: 13, color: C.blue }}>📄 Règlement à valider</div><div style={{ fontSize: 12, color: C.textMuted }}>Prends 2 minutes pour lire et accepter le règlement du coaching</div></div>
            <button onClick={() => { setScreen("contrat"); window.scrollTo(0, 0); }} style={{ background: C.blue, border: "none", borderRadius: 8, padding: "8px 14px", fontWeight: 700, fontSize: 12, color: C.black, cursor: "pointer", flexShrink: 0 }}>Voir</button>          </div>
        )}
        {!notifEnabled && (
          <div style={{ background: C.orange + "15", border: `1px solid ${C.orange}44`, borderRadius: 14, padding: 16, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div><div style={{ fontWeight: 700, fontSize: 13, color: C.orange }}>🔔 Active tes rappels</div><div style={{ fontSize: 12, color: C.textMuted }}>Recevoir des notifications utiles pour ton suivi</div></div>
            <button onClick={handleEnableNotifs} style={{ background: C.orange, border: "none", borderRadius: 8, padding: "8px 14px", fontWeight: 700, fontSize: 12, color: C.black, cursor: "pointer", flexShrink: 0 }}>Activer</button>
          </div>
        )}

        {notifEnabled && (
          <div style={{ background: C.green + "15", border: `1px solid ${C.green}44`, borderRadius: 14, padding: 16, marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.green }}>🔔 Rappels actifs</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Tu seras aidée au bon moment sans surcharge.</div>
          </div>
        )}

        {pendingClientTasks.length > 0 && (
          <Card style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10 }}>À FAIRE MAINTENANT</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {pendingClientTasks.map(task => (
                <QuickAction key={task.title} title={task.title} subtitle={task.subtitle} icon={task.icon} accent={task.accent} onClick={task.onClick} />
              ))}
            </div>
          </Card>
        )}

        {coachMsg && (
          <Card style={{ marginBottom: 14, borderColor: C.pink + "44", background: C.pink + "08" }}>
            <div style={{ fontSize: 10, color: C.pink, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 6 }}>MESSAGE DE TON COACH</div>
            <div style={{ fontSize: 14, lineHeight: 1.5, marginBottom: 12 }}>{coachMsg}</div>
            <button onClick={async () => {
              const entry = entries.find(e => e.coach_message);
              if (entry) await updateEntry(entry.id, { coach_message: "" });
            }} style={{ background: "none", border: `1px solid ${C.pink}55`, borderRadius: 8, padding: "6px 12px", color: C.pink, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
              ✓ Marquer comme lu
            </button>
          </Card>
        )}

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
                  <div style={{ fontSize: 12, color: C.textMuted }}>{(todayEntry.steps || 0).toLocaleString()} pas · {todayEntry.hydration || "—"}L · {todayEntry.sleep_hours || "—"}h sommeil</div>
                </div>
              </div>
              <Btn onClick={() => setScreen("journal")} variant="ghost" style={{ fontSize: 14 }}>✏️ Modifier mon journal</Btn>
            </div>
          )}
        </Card>

        {loading ? <div style={{ marginBottom: 14 }}><Spinner /></div> : myWorkouts.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10, textTransform: "uppercase" }}>💪 Mes entraînements</div>
            {myWorkouts.map(w => {
              const scheduledDate = w.scheduledDate;
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
                      {(() => { let logs = {}; try { logs = JSON.parse(myLogs[0].exercise_logs || "{}"); } catch {} return Object.values(logs).slice(0, 3).map((l, i) => { const s0 = (l.sets && l.sets[0]) || l; return (s0.weight || s0.reps) ? <div key={i} style={{ fontSize: 12, color: C.textMuted, marginBottom: 2 }}><span style={{ color: C.white, fontWeight: 600 }}>{l.name}</span> {s0.weight ? `· ${s0.weight}` : ""} {s0.reps ? `· ${s0.reps} reps` : ""}</div> : null; }); })()}
                      <button onClick={() => setViewingWorkoutPerfs(w)} style={{ fontSize: 12, color: C.purple, background: "none", border: "none", cursor: "pointer", fontWeight: 700, marginTop: 4, padding: 0 }}>Voir tout l'historique →</button>
                    </div>
                  )}
                  <Btn onClick={() => setPreviewWorkout(w)} style={{ fontSize: 14 }}>▶ Commencer la séance</Btn>
                </Card>
              );
            })}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <Card onClick={() => setScreen("body")} style={{ cursor: "pointer" }}><div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>POIDS</div><div style={{ fontSize: 22, fontWeight: 900, color: C.pink }}>{lastWeight ? `${lastWeight.value} kg` : "—"}</div>{startWeight && lastWeight && startWeight.value !== lastWeight.value && <div style={{ fontSize: 11, color: C.green }}>-{(startWeight.value - lastWeight.value).toFixed(1)} kg</div>}</Card>
          <Card onClick={() => setScreen("perfs")} style={{ cursor: "pointer" }}><div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, marginBottom: 4 }}>SÉANCES</div><div style={{ fontSize: 22, fontWeight: 900, color: C.purple }}>{sessionLogs.length}</div><div style={{ fontSize: 11, color: C.textMuted }}>réalisées</div></Card>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <Btn variant="ghost" onClick={() => setScreen("history")} style={{ flex: 1 }}>📋 Historique</Btn>
          <Btn variant="ghost" onClick={() => setScreen("perfs")} style={{ flex: 1 }}>📊 Performances</Btn>
        </div>
        <div style={{ display: "flex" }}>
          <Btn variant="ghost" onClick={() => setScreen("contrat")} style={{ flex: 1 }}>📄 Contrat</Btn>
        </div>
      </div>

      <ClientBottomNav currentScreen={screen} onNavigate={setScreen} />

      {screen === "contrat" && (
        <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: "'Helvetica Neue', Arial, sans-serif", padding: 20 }}>
          <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 14, marginBottom: 18, padding: 0 }}>← Retour</button>
          <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 20 }}>Mon contrat 📄</h2>
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
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: item.highlight ? C.yellow + "15" : "#111", borderRadius: 10, border: item.highlight ? `1px solid ${C.yellow}44` : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 18 }}>{item.icon}</span><span style={{ fontSize: 13, color: C.textMuted }}>{item.label}</span></div>
                  <span style={{ fontWeight: 700, fontSize: 14, color: item.highlight ? C.yellow : C.white }}>{item.val}</span>
                </div>
              ))}
            </div>
          </Card>
          {!clientInfo.contract_ended && daysUntil(clientInfo.next_payment) <= 7 && <div style={{ background: C.yellow + "15", border: `1px solid ${C.yellow}44`, borderRadius: 14, padding: 16, marginBottom: 14 }}><div style={{ fontWeight: 700, color: C.yellow, marginBottom: 4 }}>⚠️ Paiement à venir</div><div style={{ fontSize: 13 }}>Ton prochain paiement de <strong>{clientInfo.monthly_amount} €</strong> est dû le <strong>{formatDate(clientInfo.next_payment)}</strong>.</div></div>}
          <Card style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 16 }}>📄 RÈGLEMENT DU COACHING</div>
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
              <div style={{ marginTop: 16, fontSize: 12, color: C.green, fontWeight: 700 }}>✅ Règlement accepté le {formatDate(clientInfo.contract_accepted_at)}</div>
            )}
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
                  <button key={String(val)} onClick={() => { setImgConsentAnswer(val); if (!val) setImgConsentFaceAnswer(null); }} style={{ flex: 1, padding: 12, borderRadius: 12, border: `2px solid ${imgConsentAnswer === val ? C.pink : C.border}`, background: imgConsentAnswer === val ? C.pink + "22" : "#111", color: imgConsentAnswer === val ? C.pink : C.textMuted, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>{val ? "✅ Oui" : "❌ Non"}</button>
                ))}
              </div>
              {imgConsentAnswer === true && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: C.pink, fontWeight: 700, marginBottom: 8 }}>Souhaites-tu que ton visage soit caché ?</div>
                  <div style={{ display: "flex", gap: 10 }}>
                    {[true, false].map(val => (
                      <button key={String(val)} onClick={() => setImgConsentFaceAnswer(val)} style={{ flex: 1, padding: 12, borderRadius: 12, border: `2px solid ${imgConsentFaceAnswer === val ? C.pink : C.border}`, background: imgConsentFaceAnswer === val ? C.pink + "22" : "#111", color: imgConsentFaceAnswer === val ? C.pink : C.textMuted, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>{val ? "🙈 Oui, caché" : "🙂 Non, visible"}</button>
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
        </div>
      )}

      {screen === "body" && (
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
              {measurements.length >= 2 && (() => { const first = measurements[0], last = measurements[measurements.length - 1]; return <Card><div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 12 }}>ÉVOLUTION GLOBALE</div>{[["chest", "Poitrine"], ["waist", "Tour de taille"], ["hips", "Hanches"], ["thighs", "Cuisses"]].map(([k, label]) => { const diff = last[k] - first[k]; return <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}`, fontSize: 13 }}><span style={{ color: C.textMuted }}>{label}</span><span><strong>{last[k]} cm</strong> <span style={{ color: diff < 0 ? C.green : diff > 0 ? C.red : C.textMuted, fontSize: 11 }}>{diff < 0 ? diff : diff > 0 ? `+${diff}` : "—"} cm</span></span></div>; })}</Card>; })()}
              {measurements.length > 0 && (
                <Card>
                  <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, marginBottom: 12 }}>HISTORIQUE COMPLET</div>
                  {[...measurements].reverse().map((m, i) => (
                    <div key={i} style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: 12, marginBottom: 12 }}>
                      <div style={{ fontSize: 12, color: C.pink, fontWeight: 700, marginBottom: 8 }}>{formatDate(m.date)}</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                        {[["chest", "Poitrine"], ["waist", "Taille"], ["hips", "Hanches"], ["thighs", "Cuisses"]].map(([k, label]) => m[k] ? (
                          <div key={k} style={{ background: "#111", borderRadius: 8, padding: "8px 10px" }}>
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
      )}

      {screen === "history" && (
        <div style={{ minHeight: "100vh", background: C.black, color: C.white, fontFamily: "'Helvetica Neue', Arial, sans-serif", padding: 20 }}>
          <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 14, marginBottom: 18, padding: 0 }}>← Retour</button>
          <SectionTitle title="Mon historique" subtitle="Retour sur tes jours, tes ressentis et ton évolution" />
          {loading ? <Spinner /> : entries.length === 0 ? <p style={{ color: C.textMuted, textAlign: "center" }}>Aucune entrée.</p> : entries.map((e, i) => <div key={i} style={{ marginBottom: 12 }}><EntryCard e={e} onClick={() => setSelectedEntry(e)} /></div>)}
          <ClientBottomNav currentScreen={screen} onNavigate={setScreen} />
        </div>
      )}
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
    <div style={{ minHeight: "100vh", background: "radial-gradient(circle at top, rgba(232,135,156,0.18), transparent 40%), #090909", color: C.white, fontFamily: "'Helvetica Neue', Arial, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420, background: "linear-gradient(135deg, #151515 0%, #1d1d1d 100%)", border: `1px solid ${C.border}`, borderRadius: 24, padding: 24, boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>
        <div style={{ marginBottom: 24, display: "flex", justifyContent: "center" }}><Logo size={32} /></div>
        <h2 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 8px", textAlign: "center" }}>Connexion</h2>
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
const EditClientModal = ({ client, onSave, onDelete, onClose }) => {
  const [form, setForm] = useState({
    name: client.name || "", goal: client.goal || "",
    sessions_per_week: client.sessions_per_week || 3,
    monthly_amount: client.monthly_amount || "",
    start_date: client.start_date || "", next_payment: client.next_payment || "",
  });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const avatar = form.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    await onSave(client.id, { name: form.name, avatar, goal: form.goal, sessions_per_week: parseInt(form.sessions_per_week) || 3, monthly_amount: parseFloat(form.monthly_amount) || 0, start_date: form.start_date, next_payment: form.next_payment });
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
