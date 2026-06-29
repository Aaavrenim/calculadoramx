export default function Terminos() {
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

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 24px 80px" }}>
        <p style={{ fontSize: 12, color: "#1847f0", fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>LEGAL</p>
        <h1 style={{ fontSize: "clamp(28px,5vw,42px)", fontWeight: 900, color: "#0a0f1e", margin: "0 0 8px" }}>Términos de Uso</h1>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 40 }}>Última actualización: junio 2025</p>

        {[
          {
            titulo: "1. Aceptación de los términos",
            texto: `Al acceder y utilizar CalculadoraMX (calculadoramx.com), aceptas estos Términos de Uso en su totalidad. Si no estás de acuerdo con alguna parte de estos términos, te pedimos que no utilices el sitio.`
          },
          {
            titulo: "2. Naturaleza del servicio",
            texto: `CalculadoraMX es una herramienta informativa gratuita que proporciona estimaciones orientativas sobre cálculos legales y laborales en México, incluyendo finiquitos, pensiones alimenticias, pensiones IMSS y herencias.\n\nLos resultados que genera este sitio son estimaciones basadas en la legislación mexicana vigente y no constituyen asesoría jurídica, contable, fiscal o previsional profesional.`
          },
          {
            titulo: "3. Limitación de responsabilidad",
            texto: `CalculadoraMX no garantiza la exactitud, completitud o vigencia de los resultados generados. Las leyes mexicanas pueden cambiar y los cálculos pueden variar dependiendo de circunstancias específicas de cada caso.\n\nEl uso de esta herramienta no reemplaza la consulta con un abogado, contador, notario público o cualquier otro profesional calificado. CalculadoraMX no se hace responsable de decisiones tomadas con base en los resultados de sus calculadoras.`
          },
          {
            titulo: "4. Propiedad intelectual",
            texto: `Todo el contenido de CalculadoraMX, incluyendo textos, diseño, código y logotipos, es propiedad de CalculadoraMX y está protegido por las leyes de propiedad intelectual aplicables en México.\n\nQueda prohibida la reproducción total o parcial del contenido sin autorización expresa por escrito.`
          },
          {
            titulo: "5. Uso permitido",
            texto: `Puedes utilizar CalculadoraMX para:\n• Obtener estimaciones orientativas para uso personal\n• Informarte sobre tus derechos laborales y legales\n• Compartir los resultados con fines informativos\n\nQueda prohibido:\n• Usar el sitio para fines comerciales sin autorización\n• Intentar acceder, modificar o interferir con el código del sitio\n• Reproducir o distribuir el contenido del sitio sin permiso`
          },
          {
            titulo: "6. Publicidad",
            texto: `CalculadoraMX puede mostrar anuncios a través de Google AdSense u otras redes publicitarias. Estos anuncios son proporcionados por terceros y CalculadoraMX no es responsable de su contenido.`
          },
          {
            titulo: "7. Enlaces externos",
            texto: `Este sitio puede contener enlaces a sitios web externos (como imss.gob.mx, sat.gob.mx u otros). CalculadoraMX no controla ni se hace responsable del contenido de sitios de terceros.`
          },
          {
            titulo: "8. Modificaciones",
            texto: `CalculadoraMX se reserva el derecho de modificar, suspender o discontinuar el servicio en cualquier momento sin previo aviso. También podemos actualizar estos Términos de Uso ocasionalmente.`
          },
          {
            titulo: "9. Legislación aplicable",
            texto: `Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier disputa será resuelta conforme a la legislación mexicana aplicable.`
          },
          {
            titulo: "10. Contacto",
            texto: `Para cualquier pregunta sobre estos términos, contáctanos en: minervagoey@gmail.com`
          },
        ].map(({ titulo, texto }) => (
          <div key={titulo} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: "#0a0f1e", margin: "0 0 10px" }}>{titulo}</h2>
            {texto.split("\n").map((linea, i) => (
              <p key={i} style={{ fontSize: 15, color: "#444", lineHeight: 1.7, margin: "0 0 6px" }}>{linea}</p>
            ))}
          </div>
        ))}

        <div style={{ borderTop: "1px solid #e0e4ff", paddingTop: 24, marginTop: 16, display: "flex", gap: 20, flexWrap: "wrap" }}>
          <a href="/privacidad" style={{ fontSize: 13, color: "#1847f0", fontWeight: 600, textDecoration: "none" }}>Política de Privacidad</a>
          <a href="/contacto" style={{ fontSize: 13, color: "#1847f0", fontWeight: 600, textDecoration: "none" }}>Contacto</a>
          <a href="/" style={{ fontSize: 13, color: "#1847f0", fontWeight: 600, textDecoration: "none" }}>Inicio</a>
        </div>
      </div>
    </div>
  );
}