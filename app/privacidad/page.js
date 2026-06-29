export default function Privacidad() {
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
        <h1 style={{ fontSize: "clamp(28px,5vw,42px)", fontWeight: 900, color: "#0a0f1e", margin: "0 0 8px" }}>Política de Privacidad</h1>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 40 }}>Última actualización: junio 2025</p>

        {[
          {
            titulo: "1. Quiénes somos",
            texto: `CalculadoraMX es un sitio web de herramientas legales gratuitas para usuarios en México. Puedes contactarnos en minervagoey@gmail.com.`
          },
          {
            titulo: "2. Qué información recopilamos",
            texto: `CalculadoraMX no recopila, almacena ni comparte ningún dato personal que ingreses en nuestras calculadoras. Todos los cálculos se realizan directamente en tu navegador (client-side) y nunca son enviados a ningún servidor.\n\nEl único dato que puede recopilarse de forma automática es información técnica anónima a través de Google Analytics (si está activo), como el tipo de dispositivo, país de origen y páginas visitadas, sin identificarte personalmente.`
          },
          {
            titulo: "3. Cookies",
            texto: `Este sitio puede utilizar cookies de terceros para fines publicitarios a través de Google AdSense. Estas cookies permiten a Google mostrar anuncios relevantes según tus intereses. No tenemos acceso ni control sobre las cookies de Google.\n\nPuedes gestionar o deshabilitar las cookies desde la configuración de tu navegador en cualquier momento.`
          },
          {
            titulo: "4. Google AdSense y publicidad",
            texto: `CalculadoraMX puede mostrar anuncios de Google AdSense. Google, como proveedor externo, utiliza cookies para mostrar anuncios basados en visitas anteriores a este y otros sitios web. Para más información sobre cómo Google usa los datos, visita: policies.google.com/privacy`
          },
          {
            titulo: "5. Uso de la información",
            texto: `La información anónima recopilada (si aplica) se utiliza únicamente para:\n• Mejorar la experiencia del usuario en el sitio\n• Analizar el tráfico de forma agregada y anónima\n• Mostrar publicidad relevante a través de Google AdSense`
          },
          {
            titulo: "6. Compartir información con terceros",
            texto: `No vendemos, intercambiamos ni transferimos tu información personal a terceros. La única excepción es Google AdSense, que opera bajo su propia política de privacidad.`
          },
          {
            titulo: "7. Seguridad",
            texto: `Dado que no almacenamos datos personales en nuestros servidores, el riesgo de exposición de tus datos es mínimo. Los cálculos que realizas permanecen únicamente en tu dispositivo.`
          },
          {
            titulo: "8. Derechos del usuario",
            texto: `De conformidad con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP), tienes derecho a acceder, rectificar, cancelar u oponerte al tratamiento de tus datos personales (derechos ARCO). Para ejercerlos, contáctanos en minervagoey@gmail.com.`
          },
          {
            titulo: "9. Cambios a esta política",
            texto: `Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos de cambios significativos actualizando la fecha en la parte superior de esta página.`
          },
          {
            titulo: "10. Contacto",
            texto: `Si tienes preguntas sobre esta política, contáctanos en: minervagoey@gmail.com`
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
          <a href="/terminos" style={{ fontSize: 13, color: "#1847f0", fontWeight: 600, textDecoration: "none" }}>Términos de Uso</a>
          <a href="/contacto" style={{ fontSize: 13, color: "#1847f0", fontWeight: 600, textDecoration: "none" }}>Contacto</a>
          <a href="/" style={{ fontSize: 13, color: "#1847f0", fontWeight: 600, textDecoration: "none" }}>Inicio</a>
        </div>
      </div>
    </div>
  );
}