import Link from "next/link";

const ARTICULOS = [
  { href: "/blog/renuncia-vs-despido", color: "#1847f0", emoji: "💼", titulo: "¿Cuánto me corresponde si renuncio vs si me despiden?", tag: "Finiquito", desc: "La forma en que termina tu relación laboral determina directamente cuánto recibes." },
  { href: "/blog/prima-de-antiguedad", color: "#1847f0", emoji: "💼", titulo: "¿Qué es la prima de antigüedad y cuándo te corresponde?", tag: "Finiquito", desc: "Un derecho laboral que muchos trabajadores mexicanos desconocen." },
  { href: "/blog/como-se-calcula-pension-alimenticia", color: "#7c3aed", emoji: "👧", titulo: "¿Cómo se calcula la pensión alimenticia en México?", tag: "Pensión Alimenticia", desc: "Conoce qué evalúa el juez para fijar el monto." },
  { href: "/blog/que-pasa-si-no-pagan-pension", color: "#7c3aed", emoji: "👧", titulo: "¿Qué pasa si no pagan la pensión alimenticia?", tag: "Pensión Alimenticia", desc: "El incumplimiento tiene consecuencias legales serias." },
  { href: "/blog/regimen-73-vs-97", color: "#0891b2", emoji: "🏛️", titulo: "Régimen 73 vs Régimen 97: ¿cuál te aplica?", tag: "Pensión IMSS", desc: "Una sola fecha determina cuál es el tuyo y cuánto recibirás." },
  { href: "/blog/modalidad-40", color: "#0891b2", emoji: "🏛️", titulo: "Modalidad 40 del IMSS: qué es y cuándo conviene", tag: "Pensión IMSS", desc: "Aumenta tu pensión cotizando voluntariamente al IMSS." },
  { href: "/blog/consultar-semanas-imss", color: "#0891b2", emoji: "🏛️", titulo: "¿Cómo consultar mis semanas cotizadas en el IMSS?", tag: "Pensión IMSS", desc: "Guía paso a paso desde tu celular o computadora." },
  { href: "/blog/muerte-sin-testamento", color: "#059669", emoji: "📋", titulo: "¿Qué pasa si alguien muere sin testamento en México?", tag: "Herencias", desc: "Conoce el orden que establece el Código Civil Federal." },
  { href: "/blog/herencias-e-impuestos", color: "#059669", emoji: "📋", titulo: "¿Las herencias pagan impuestos en México?", tag: "Herencias", desc: "En general no, pero hay excepciones importantes." },
  { href: "/blog/derechos-laborales-mexico", color: "#1847f0", emoji: "💼", titulo: "Guía completa de derechos laborales en México", tag: "Finiquito", desc: "Aguinaldo, vacaciones, IMSS, PTU y más según la LFT." },
];

export default function Blog() {
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
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "60px 24px 80px" }}>
        <p style={{ fontSize: 12, color: "#1847f0", fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>ARTÍCULOS</p>
        <h1 style={{ fontSize: "clamp(28px,6vw,46px)", fontWeight: 900, color: "#0a0f1e", margin: "0 0 12px", letterSpacing: -1 }}>
          Guías legales gratuitas para México
        </h1>
        <p style={{ fontSize: 16, color: "#555", lineHeight: 1.6, marginBottom: 48, maxWidth: 560 }}>
          Todo lo que necesitas saber sobre tus derechos laborales, pensiones y herencias — explicado en términos simples.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {ARTICULOS.map((a) => (
            <Link key={a.href} href={a.href} style={{ textDecoration: "none" }}>
              <div style={{ background: "#fff", border: "1.5px solid #e8eaff", borderRadius: 16, padding: "20px 22px", display: "flex", gap: 16, alignItems: "flex-start" }}>
                <span style={{ fontSize: 28, flexShrink: 0 }}>{a.emoji}</span>
                <div style={{ flex: 1 }}>
                  <span style={{ display: "inline-block", background: `${a.color}15`, color: a.color, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 100, marginBottom: 8, letterSpacing: 0.4 }}>
                    {a.tag.toUpperCase()}
                  </span>
                  <h2 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 800, color: "#0a0f1e", lineHeight: 1.3 }}>{a.titulo}</h2>
                  <p style={{ margin: 0, fontSize: 13, color: "#666", lineHeight: 1.5 }}>{a.desc}</p>
                </div>
                <span style={{ color: "#1847f0", fontWeight: 700, fontSize: 18, flexShrink: 0, marginTop: 4 }}>→</span>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ borderTop: "1px solid #e0e4ff", marginTop: 48, paddingTop: 24 }}>
          <a href="/" style={{ fontSize: 13, color: "#1847f0", fontWeight: 600, textDecoration: "none" }}>← Volver al inicio</a>
        </div>
      </div>
    </div>
  );
}