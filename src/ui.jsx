// ══════════════════════════════════════════════════════════════════════════════
// COMPOSANTS DE BASE — cartes, boutons, champs, badges, onglets, logo
// ══════════════════════════════════════════════════════════════════════════════
import { useState, useEffect } from "react";
import { C, F, BRAND_NAME } from "./theme.js";

// Accessibility: respect prefers-reduced-motion
export const usePrefersReducedMotion = () => {
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

export const Logo = ({ size = 44 }) => {
  const [visible, setVisible] = useState(true);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {visible && (
        <img src="/logo.png" alt={BRAND_NAME} style={{ width: size, height: size, borderRadius: 8, objectFit: "cover" }} onError={() => setVisible(false)} />
      )}
      <div style={{ lineHeight: 1 }}>
        <div style={{ fontFamily: F.sans, fontWeight: 900, fontSize: Math.max(18, size * 0.38), color: C.brandDark, letterSpacing: "-0.6px", lineHeight: 0.95 }}>her</div>
        <div style={{ fontFamily: F.sans, fontWeight: 900, fontSize: Math.max(22, size * 0.5), color: C.brandDark, letterSpacing: "-0.6px", lineHeight: 0.9 }}>process<span style={{ color: C.pink }}>.</span></div>
      </div>
    </div>
  );
};

export const Card = ({ children, style = {}, onClick }) => {
    return (
      <div onClick={onClick} style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        padding: 18,
        cursor: onClick ? "pointer" : "default",
        boxShadow: "0 1px 2px rgba(64, 32, 32, 0.04)",
        ...style
      }}>{children}</div>
    );
};

export const Btn = ({ children, onClick, variant = "primary", disabled, small, style = {} }) => {
  const bg = variant === "primary" ? C.cherry : variant === "danger" ? C.red + "14" : variant === "ghost" ? "transparent" : variant === "green" ? C.green : C.card;
  const fg = variant === "primary" || variant === "green" ? C.brandCream : variant === "danger" ? C.red : variant === "ghost" ? C.textMuted : C.cherry;
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: bg,
      color: fg,
      border: variant === "ghost" ? `1px solid ${C.border}` : variant === "danger" ? `1px solid ${C.red}44` : variant === "secondary" ? `1px solid ${C.border}` : "none",
      borderRadius: small ? 10 : 14, padding: small ? "8px 14px" : "14px 20px",
      fontWeight: 650, fontSize: small ? 14 : 16, cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1, fontFamily: "inherit", minHeight: small ? 36 : 48,
      transition: "background .15s ease",
      ...style,
    }}>{children}</button>
  );
};

// 16 px minimum : en dessous, l'iPhone zoome sur le champ à chaque saisie
export const inputSt = { background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 14px", color: C.white, fontSize: 16, outline: "none", width: "100%", boxSizing: "border-box", fontFamily: "inherit" };

export const Inp = ({ label, ...p }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && <label style={{ fontSize: 12, color: C.textMuted, fontWeight: 650, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</label>}
    <input {...p} style={{ ...inputSt, ...p.style }} />
  </div>
);

export const TA = ({ label, ...p }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && <label style={{ fontSize: 12, color: C.textMuted, fontWeight: 650, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</label>}
    <textarea {...p} style={{ ...inputSt, resize: "vertical", minHeight: 72, ...p.style }} />
  </div>
);

export const Avatar = ({ initials, size = 38, color = C.pink }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: color + "1f", border: `1.5px solid ${color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: size * 0.33, color, flexShrink: 0 }}>{initials}</div>
);

export const Badge = ({ children, color = C.pink }) => (
  <span style={{ background: color + "1a", color, borderRadius: 7, padding: "3px 9px", fontSize: 12, fontWeight: 650, whiteSpace: "nowrap" }}>{children}</span>
);

export const SectionTitle = ({ title, subtitle, action }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
      <div>
        <h2 style={{ fontFamily: F.serif, fontSize: 24, fontWeight: 400, letterSpacing: "-0.4px", color: C.heading, margin: 0 }}>{title}</h2>
        {subtitle && <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>{subtitle}</div>}
      </div>
      {action}
    </div>
  </div>
);

export const PremiumHero = ({ title, subtitle, badge, children, accent = C.pink }) => (
  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: 18 }}>
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: accent, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>{badge}</div>
        <h1 style={{ fontFamily: F.serif, fontSize: 30, fontWeight: 400, letterSpacing: "-0.6px", color: C.heading, margin: "0 0 6px" }}>{title}</h1>
        {subtitle && <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.45 }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  </div>
);

export const Tab = ({ tabs, active, onChange }) => (
  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
    {tabs.map(([k, v]) => (
      <button key={k} onClick={() => onChange(k)} style={{
        padding: "9px 16px", borderRadius: 100, border: `1px solid ${active === k ? C.cherry : C.border}`,
        background: active === k ? C.cherry : C.card, color: active === k ? C.brandCream : C.textMuted,
        fontWeight: active === k ? 650 : 500, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
      }}>{v}</button>
    ))}
  </div>
);


// Répertoire A-Z : filtre une longue liste (séances, clientes...) par première lettre du nom.
export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
export const AlphaIndex = ({ letters, active, onChange }) => (
  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 16 }}>
    <button onClick={() => onChange(null)} style={{
      padding: "0 12px", height: 28, borderRadius: 100, border: `1.5px solid ${active === null ? C.cherry : C.border}`,
      background: active === null ? C.cherry : "transparent", color: active === null ? C.brandCream : C.textMuted,
      fontWeight: active === null ? 700 : 400, fontSize: 12, cursor: "pointer",
    }}>Tout</button>
    {ALPHABET.map(l => {
      const has = letters.has(l);
      const isActive = active === l;
      return (
        <button key={l} disabled={!has} onClick={() => onChange(l)} style={{
          width: 28, height: 28, borderRadius: 100, border: `1.5px solid ${isActive ? C.pink : C.border}`,
          background: isActive ? C.cherry : "transparent",
          color: isActive ? C.brandCream : C.textMuted,
          fontWeight: isActive ? 700 : 400, fontSize: 12,
          cursor: has ? "pointer" : "default", opacity: has ? 1 : 0.3,
        }}>{l}</button>
      );
    })}
  </div>
);

export const Spinner = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
    <div style={{ width: 32, height: 32, borderRadius: "50%", border: `3px solid ${C.border}`, borderTop: `3px solid ${C.cherry}`, animation: "spin 0.8s linear infinite" }} />
    <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
  </div>
);

// ── Icônes au trait (navigation) ─────────────────────────────────────────────────
const ICON_PATHS = {
  home: "M4 11l8-6 8 6v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z",
  users: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21c.6-3.5 3.4-6 7-6s6.4 2.5 7 6M17 3.5a4 4 0 0 1 0 7.5M22 21c-.4-2.6-2-4.7-4.3-5.6",
  dumbbell: "M3 9v6M6 6v12M18 6v12M21 9v6M6 12h12",
  wallet: "M3 7h15a3 3 0 0 1 3 3v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 7l12-3v3M16 13.5h2",
  key: "M15 7a4 4 0 1 1-3.5 6L4 20.5V17h3v-3h3l1.5-1.5A4 4 0 0 1 15 7zM16 10h.01",
  chevron: "M9 6l6 6-6 6",
  back: "M15 6l-6 6 6 6",
  bell: "M6 16V11a6 6 0 1 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0",
  logout: "M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 16l-4-4 4-4M6 12h10",
  plus: "M12 5v14M5 12h14",
  message: "M4 5h16v11H8l-4 4z",
  book: "M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h10",
  fork: "M7 3v8a3 3 0 0 0 6 0V3M10 3v18M17 3c-2 2-2 6 0 8v10",
  chart: "M4 19l5-6 4 3 7-9",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c1-4 4-6 8-6s7 2 8 6",
  check: "M5 12l5 5 9-10",
};
export const Icon = ({ name, size = 20, color = "currentColor", strokeWidth = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d={ICON_PATHS[name]} />
  </svg>
);

// Vrai sur grand écran (ordinateur, tablette en paysage) : barre latérale au lieu de la barre du bas
export const useIsWide = (minWidth = 960) => {
  const query = `(min-width: ${minWidth}px)`;
  const [wide, setWide] = useState(() => typeof window !== "undefined" && window.matchMedia ? window.matchMedia(query).matches : true);
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia(query);
    const handler = () => setWide(mq.matches);
    handler();
    try { mq.addEventListener("change", handler); } catch { mq.addListener(handler); }
    return () => { try { mq.removeEventListener("change", handler); } catch { mq.removeListener(handler); } };
  }, [query]);
  return wide;
};

// Onglets soulignés (fiche cliente)
export const UnderlineTabs = ({ tabs, active, onChange }) => (
  <div style={{ display: "flex", gap: 24, borderBottom: `1px solid ${C.border}`, marginBottom: 18, overflowX: "auto" }}>
    {tabs.map(([k, label]) => (
      <button key={k} onClick={() => onChange(k)} style={{
        background: "none", border: "none", borderBottom: `2px solid ${active === k ? C.cherry : "transparent"}`,
        color: active === k ? C.cherry : C.textMuted, fontWeight: active === k ? 650 : 500, fontSize: 15,
        padding: "10px 0 12px", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit", marginBottom: -1,
      }}>{label}</button>
    ))}
  </div>
);

// Sélecteur segmenté (sous-vues d'un onglet)
export const Segmented = ({ options, active, onChange }) => (
  <div style={{ display: "inline-flex", background: C.field2, borderRadius: 10, padding: 3, marginBottom: 16, maxWidth: "100%", overflowX: "auto" }}>
    {options.map(([k, label]) => (
      <button key={k} onClick={() => onChange(k)} style={{
        background: active === k ? C.card : "transparent", border: "none", borderRadius: 8,
        color: active === k ? C.cherry : C.textMuted, fontWeight: active === k ? 650 : 500, fontSize: 14,
        padding: "7px 14px", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit",
        boxShadow: active === k ? "0 1px 2px rgba(64,32,32,0.08)" : "none",
      }}>{label}</button>
    ))}
  </div>
);

// Petit titre de section en capitales
export const Eyebrow = ({ children, style = {} }) => (
  <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 650, letterSpacing: "0.14em", textTransform: "uppercase", ...style }}>{children}</div>
);

// Choix du jour « ‹ Aujourd'hui · mer. 22 oct. › » : on remonte jusqu'à `maxBack` jours en arrière.
// `done(dateStr)` permet d'afficher une coche quand le jour est déjà rempli.
export const DayPicker = ({ value, onChange, maxBack = 3, done }) => {
  const todayStr = new Date().toISOString().slice(0, 10);
  const shift = (n) => { const d = new Date(value); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
  const back = Math.round((new Date(todayStr) - new Date(value)) / 86400000);
  const canPrev = back < maxBack, canNext = back > 0;
  const name = back === 0 ? "Aujourd'hui" : back === 1 ? "Hier" : null;
  const date = new Date(value).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
  const arrow = (enabled, dir, label) => (
    <button onClick={() => enabled && onChange(shift(dir))} disabled={!enabled} aria-label={label} style={{ background: "none", border: "none", width: 44, height: 44, display: "grid", placeItems: "center", color: enabled ? C.cherry : C.border, cursor: enabled ? "pointer" : "default" }}>
      <Icon name={dir < 0 ? "back" : "chevron"} size={22} />
    </button>
  );
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, marginBottom: 16 }}>
      {arrow(canPrev, -1, "Jour précédent")}
      <div style={{ textAlign: "center", fontSize: 15 }}>
        <b style={{ fontWeight: 650 }}>{name ? `${name} · ` : ""}</b>{date}
        {done && done(value) && <span style={{ color: C.green, fontWeight: 650, marginLeft: 8 }}>✓ rempli</span>}
      </div>
      {arrow(canNext, 1, "Jour suivant")}
    </div>
  );
};

// Champ chiffré compact (pas, sommeil, eau…) : libellé au-dessus, clavier numérique sur téléphone
export const NumField = ({ label, unit, value, onChange, placeholder, decimal }) => (
  <label style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
    <span style={{ fontSize: 13, color: C.textMuted, fontWeight: 600 }}>{label}</span>
    <span style={{ display: "flex", alignItems: "center", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "0 12px" }}>
      <input type="text" inputMode={decimal ? "decimal" : "numeric"} value={value} onChange={onChange} placeholder={placeholder}
        style={{ border: "none", outline: "none", background: "transparent", padding: "12px 0", fontSize: 17, color: C.white, width: "100%", minWidth: 0, fontFamily: "inherit", fontVariantNumeric: "tabular-nums" }} />
      {unit && <span style={{ color: C.textMuted, fontSize: 14, flexShrink: 0 }}>{unit}</span>}
    </span>
  </label>
);
