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
