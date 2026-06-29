"use client";
import { useState } from "react";

export default function Contacto() {
  const [enviado, setEnviado] = useState(false);
  const [form, setForm] = useState({ nombre: "", email: "", asunto: "", mensaje: "" });

  function handleChange(e) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  }

  function handleSubmit() {
    const { nombre, email, asunto, mensaje } = form;
    if (!nombre || !email || !mensaje) return;
    const mailto = `mailto:minervagoey@gmail.com?subject=${encodeURIComponent(asunto || "Contacto desde CalculadoraMX")}&body=${encodeURIComponent(`Nombre: ${nombre}\nEmail: ${email}\n\n${mensaje}`)}`;
    window.location.href = mailto;
    setEnviado(true);
  }

  const inp = {
    width: "100%", padding: "12px 14px", borderRadius: 10,
    border: "1.5px solid #dde0ff", fontSize: 15, outline: "none",
    background: "#fafbff", color: "#0a0f1e", boxSizing: "border-box",
    fontFamily: "inherit",
  };

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

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "60px 24px 80px" }}>
        <p style={{ fontSize: 12, color: "#1847f0", fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>CONTACTO</p>
        <h1 style={{ fontSize: "clamp(28px,5vw,42px)", fontWeight: 900, color: "#0a0f1e", margin: "0 0 12px" }}>¿Tienes alguna pregunta?</h1>
        <p style={{ fontSize: 15, color: "#555", lineHeight: 1.6, marginBottom: 40 }}>
          Puedes escribirnos para reportar errores en los cálculos, sugerir nuevas calculadoras o cualquier otra consulta. Respondemos en un plazo de 1-3 días hábiles.
        </p>

        {!enviado ? (
          <div style={{ background: "#fff", borderRadius: 20, padding: "32px 28px", boxShadow: "0 4px 40px rgba(24,71,240,0.08)", border: "1px solid rgba(24,71,240,0.08)" }}>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: "block", fontWeight: 600, fontSize: 14, color: "#0a0f1e", marginBottom: 6 }}>Nombre</label>
                <input name="nombre" type="text" placeholder="Tu nombre" value={form.nombre} onChange={handleChange} style={inp} />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 600, fontSize: 14, color: "#0a0f1e", marginBottom: 6 }}>Email</label>
                <input name="email" type="email" placeholder="tu@email.com" value={form.email} onChange={handleChange} style={inp} />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: 14, color: "#0a0f1e", marginBottom: 6 }}>Asunto</label>
              <input name="asunto" type="text" placeholder="Ej. Error en calculadora de finiquito" value={form.asunto} onChange={handleChange} style={inp} />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: 14, color: "#0a0f1e", marginBottom: 6 }}>Mensaje</label>
              <textarea name="mensaje" placeholder="Escribe tu mensaje aquí..." value={form.mensaje} onChange={handleChange}
                style={{ ...inp, minHeight: 140, resize: "vertical" }} />
            </div>

            <button onClick={handleSubmit} disabled={!form.nombre || !form.email || !form.mensaje}
              style={{
                width: "100%", padding: "16px", background: "linear-gradient(90deg,#1847f0,#4a6fff)",
                color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 800,
                cursor: form.nombre && form.email && form.mensaje ? "pointer" : "not-allowed",
                opacity: form.nombre && form.email && form.mensaje ? 1 : 0.5,
                boxShadow: "0 4px 20px rgba(24,71,240,0.25)",
              }}>
              Enviar mensaje →
            </button>

            <p style={{ fontSize: 12, color: "#888", textAlign: "center", marginTop: 12 }}>
              Al enviar abrirás tu cliente de correo con el mensaje listo.
            </p>
          </div>
        ) : (
          <div style={{ background: "#f0fff4", border: "1.5px solid #a3e4b3", borderRadius: 20, padding: "40px 32px", textAlign: "center" }}>
            <p style={{ fontSize: 40, margin: "0 0 16px" }}>✅</p>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0a7a3a", margin: "0 0 10px" }}>¡Mensaje listo para enviar!</h2>
            <p style={{ fontSize: 15, color: "#333", lineHeight: 1.6, margin: "0 0 24px" }}>
              Se abrió tu cliente de correo con el mensaje preparado. Solo dale enviar desde ahí.
            </p>
            <a href="/" style={{ background: "#1847f0", color: "#fff", padding: "12px 28px", borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
              Volver al inicio
            </a>
          </div>
        )}

        {/* INFO DIRECTA */}
        <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { emoji: "📧", titulo: "Email directo", desc: "minervagoey@gmail.com" },
            { emoji: "⏱️", titulo: "Tiempo de respuesta", desc: "1–3 días hábiles" },
          ].map(({ emoji, titulo, desc }) => (
            <div key={titulo} style={{ background: "#fff", border: "1.5px solid #e0e4ff", borderRadius: 14, padding: "18px" }}>
              <p style={{ margin: "0 0 6px", fontSize: 24 }}>{emoji}</p>
              <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 13, color: "#0a0f1e" }}>{titulo}</p>
              <p style={{ margin: 0, fontSize: 13, color: "#555" }}>{desc}</p>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid #e0e4ff", paddingTop: 24, marginTop: 40, display: "flex", gap: 20, flexWrap: "wrap" }}>
          <a href="/privacidad" style={{ fontSize: 13, color: "#1847f0", fontWeight: 600, textDecoration: "none" }}>Política de Privacidad</a>
          <a href="/terminos" style={{ fontSize: 13, color: "#1847f0", fontWeight: 600, textDecoration: "none" }}>Términos de Uso</a>
          <a href="/" style={{ fontSize: 13, color: "#1847f0", fontWeight: 600, textDecoration: "none" }}>Inicio</a>
        </div>
      </div>
    </div>
  );
}