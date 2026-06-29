import Link from "next/link";

const TAGS = {
  "Finiquito": "#1847f0",
  "Pensión Alimenticia": "#7c3aed",
  "Pensión IMSS": "#0891b2",
  "Herencias": "#059669",
};

export default function Article({ titulo, fecha, tag, href, cta, contenido }) {
  const color = TAGS[tag] || "#1847f0";
  return (
    <div style={{ minHeight: "100vh", background: "#fafbff", fontFamily: "'Inter','Segoe UI',sans-serif" }}>

      <header style={{ position: "sticky", top: 12, zIndex: 100, display: "flex", justifyContent: "center", padding: "0 16px" }}>
        <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(16px)", borderRadius: 100, padding: "12px 28px", display: "flex", alignItems: "center", gap: 24, boxShadow: "0 2px 24px rgba(24,71,240,0.10)", border: "1px solid rgba(24,71,240,0.10)" }}>
          <a href="/" style={{ fontWeight: 800, fontSize: 17, color: "#0a0f1e", textDecoration: "none" }}>Calculadora<span style={{ color: "#1847f0" }}>MX</span></a>
          <nav style={{ display: "flex", gap: 18 }}>
            {[["Finiquito", "/finiquito"], ["Alimentos", "/pension-alimenticia"], ["IMSS", "/pension-imss"], ["Herencias", "/herencias"]].map(([l, h]) => (
              <a key={l} href={h} style={{ fontSize: 13, fontWeight: 600, color: "#444", textDecoration: "none" }}>{l}</a>
            ))}
          </nav>
        </div>
      </header>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* BREADCRUMB */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, fontSize: 13, color: "#888" }}>
          <a href="/" style={{ color: "#1847f0", fontWeight: 600, textDecoration: "none" }}>Inicio</a>
          <span>›</span>
          <a href="/blog" style={{ color: "#1847f0", fontWeight: 600, textDecoration: "none" }}>Artículos</a>
          <span>›</span>
          <span style={{ color: "#555" }}>{tag}</span>
        </div>

        {/* TAG */}
        <span style={{ display: "inline-block", background: `${color}18`, color, fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 100, letterSpacing: 0.5, marginBottom: 16 }}>
          {tag.toUpperCase()}
        </span>

        {/* TÍTULO */}
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: "#0a0f1e", lineHeight: 1.15, margin: "0 0 12px", letterSpacing: -0.5 }}>
          {titulo}
        </h1>
        <p style={{ fontSize: 13, color: "#aaa", marginBottom: 40 }}>{fecha} · CalculadoraMX</p>

        {/* CTA SUPERIOR */}
        <div style={{ background: `${color}10`, border: `1.5px solid ${color}30`, borderRadius: 14, padding: "16px 20px", marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#0a0f1e" }}>¿Quieres saber cuánto te corresponde?</p>
          <a href={href} style={{ background: color, color: "#fff", fontSize: 13, fontWeight: 700, padding: "10px 20px", borderRadius: 10, textDecoration: "none", whiteSpace: "nowrap" }}>
            {cta} →
          </a>
        </div>

        {/* CONTENIDO */}
        <div style={{ fontSize: 16, color: "#333", lineHeight: 1.8 }}>
          {contenido.map(({ h, p }, i) => (
            <div key={i} style={{ marginBottom: 36 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0a0f1e", margin: "0 0 12px", letterSpacing: -0.3 }}>{h}</h2>
              {p.split("\n").map((linea, j) => (
                <p key={j} style={{ margin: "0 0 8px", color: linea.startsWith("•") ? "#444" : "#555" }}>{linea}</p>
              ))}
            </div>
          ))}
        </div>

        {/* CTA INFERIOR */}
        <div style={{ background: "linear-gradient(135deg,#1847f0,#4a6fff)", borderRadius: 16, padding: "28px 24px", textAlign: "center", marginTop: 48 }}>
          <p style={{ margin: "0 0 8px", fontSize: 14, color: "rgba(255,255,255,0.85)" }}>Herramienta gratuita · Sin registro · Resultado inmediato</p>
          <p style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 800, color: "#fff" }}>Calcula lo que te corresponde ahora</p>
          <a href={href} style={{ background: "#fff", color: "#1847f0", fontSize: 15, fontWeight: 800, padding: "13px 28px", borderRadius: 12, textDecoration: "none", display: "inline-block" }}>
            {cta} →
          </a>
        </div>

        {/* ARTÍCULOS RELACIONADOS */}
        <div style={{ marginTop: 48, borderTop: "1px solid #e0e4ff", paddingTop: 32 }}>
          <p style={{ fontWeight: 800, fontSize: 15, color: "#0a0f1e", marginBottom: 16 }}>Más artículos</p>
          <a href="/blog" style={{ color: "#1847f0", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>← Ver todos los artículos</a>
        </div>

        {/* FOOTER LEGAL */}
        <p style={{ fontSize: 11, color: "#bbb", marginTop: 32, lineHeight: 1.6 }}>
          Este artículo es informativo y no constituye asesoría legal profesional. Consulta a un abogado para tu caso específico.
        </p>
      </div>
    </div>
  );
}