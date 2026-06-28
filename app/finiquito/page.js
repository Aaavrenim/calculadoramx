"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

/* Tabla de vacaciones Art. 76 LFT (reforma 2023) */
function diasVacaciones(aniosCompletos) {
  if (aniosCompletos < 1) return 0;
  if (aniosCompletos === 1) return 12;
  if (aniosCompletos === 2) return 14;
  if (aniosCompletos === 3) return 16;
  if (aniosCompletos === 4) return 18;
  if (aniosCompletos === 5) return 20;
  const periodosDe5 = Math.floor((aniosCompletos - 5) / 5) + 1;
  return 20 + periodosDe5 * 2;
}

const SALARIO_MINIMO_2026 = 315.04;
const TOPE_PRIMA_ANTIGUEDAD = SALARIO_MINIMO_2026 * 2;

function formatMoney(n) {
  return n.toLocaleString("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 2 });
}

/* Tooltip "?" */
function Tip({ text }) {
  const [open, setOpen] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <button type="button" onClick={() => setOpen(!open)} aria-label="Ver definición"
        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 16, height: 16, borderRadius: "50%", border: "1px solid #d1d5db", background: "#fff", color: "#9ca3af", fontSize: 10, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>
        ?
      </button>
      {open && (
        <div style={{ position: "absolute", top: 22, left: 0, width: 240, zIndex: 50, background: "#0a0f1e", color: "#fff", fontSize: 12, lineHeight: 1.5, padding: "10px 12px", borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.18)" }}>
          {text}
        </div>
      )}
    </span>
  );
}

export default function Finiquito() {
  const [salario, setSalario] = useState("");
  const [periodoSalario, setPeriodoSalario] = useState("diario");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [tipoSalida, setTipoSalida] = useState("renuncia");
  const [diasVacPendientes, setDiasVacPendientes] = useState("");
  const [tieneContrato, setTieneContrato] = useState("si");
  const [resultado, setResultado] = useState(null);
  const [calculando, setCalculando] = useState(false);
  const [usos, setUsos] = useState(null);

  /* Contador de usos (real, guardado en el navegador) */
  useEffect(() => {
    try {
      const n = parseInt(localStorage.getItem("usos_finiquito") || "0", 10);
      setUsos(n);
    } catch {
      setUsos(0);
    }
  }, []);

  /* Progreso del formulario */
  const camposLlenos = [salario, fechaInicio, fechaFin].filter(Boolean).length;
  const totalCampos = 3;
  const progreso = Math.round((camposLlenos / totalCampos) * 100);

  function calcular() {
    const salarioDiario =
      periodoSalario === "diario" ? parseFloat(salario)
      : periodoSalario === "semanal" ? parseFloat(salario) / 7
      : parseFloat(salario) / 30;

    if (!salarioDiario || !fechaInicio || !fechaFin) {
      alert("Por favor completa el salario y las dos fechas.");
      return;
    }
    if (new Date(fechaFin) <= new Date(fechaInicio)) {
      alert("La fecha de salida debe ser posterior a la fecha de inicio.");
      return;
    }

    setCalculando(true);
    setResultado(null);

    // Pequeño delay para que se sienta el cálculo
    setTimeout(() => {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      const msPorAnio = 1000 * 60 * 60 * 24 * 365.25;
      const aniosCompletos = Math.floor((fin - inicio) / msPorAnio);

      const ultimoAniversario = new Date(inicio);
      ultimoAniversario.setFullYear(inicio.getFullYear() + aniosCompletos);
      const diasDesdeAniversario = Math.floor((fin - ultimoAniversario) / (1000 * 60 * 60 * 24));

      // Aguinaldo por año calendario (Art. 87)
      const anioSalida = fin.getFullYear();
      let inicioPeriodoAguinaldo = new Date(anioSalida, 0, 1);
      if (inicio > inicioPeriodoAguinaldo) inicioPeriodoAguinaldo = inicio;
      const diasParaAguinaldo = Math.floor((fin - inicioPeriodoAguinaldo) / (1000 * 60 * 60 * 24)) + 1;
      const aguinaldoProporcional = (15 / 365) * diasParaAguinaldo * salarioDiario;

      const diasVacCorrespondientes = diasVacaciones(aniosCompletos + 1);
      const vacacionesPendientesNum = parseFloat(diasVacPendientes) || 0;
      const montoVacacionesPendientes = vacacionesPendientesNum * salarioDiario;
      const vacacionesProporcionalesAnioActual =
        diasDesdeAniversario > 0 ? (diasVacCorrespondientes / 365) * diasDesdeAniversario * salarioDiario : 0;

      const primaVacacional = (montoVacacionesPendientes + vacacionesProporcionalesAnioActual) * 0.25;

      let indemnizacion = 0, veintePorAnio = 0, primaAntiguedad = 0, explicacion = "";

      if (tipoSalida === "despido_injustificado") {
        indemnizacion = salarioDiario * 90;
        veintePorAnio = salarioDiario * 20 * aniosCompletos;
        const pad = Math.min(salarioDiario, TOPE_PRIMA_ANTIGUEDAD / 2);
        primaAntiguedad = pad * 12 * aniosCompletos;
        explicacion = "Por despido injustificado tienes derecho a indemnización constitucional (Art. 50 LFT): 3 meses de salario + 20 días por cada año trabajado + prima de antigüedad.";
      } else if (tipoSalida === "despido_justificado") {
        explicacion = "En un despido con causa justificada (Art. 47 LFT) no hay indemnización, solo las partes proporcionales que ya generaste.";
      } else {
        if (aniosCompletos >= 15) {
          const pad = Math.min(salarioDiario, TOPE_PRIMA_ANTIGUEDAD / 2);
          primaAntiguedad = pad * 12 * aniosCompletos;
          explicacion = "Al renunciar con 15 años o más de antigüedad, tienes derecho a prima de antigüedad (Art. 162 LFT) además de tus partes proporcionales.";
        } else {
          explicacion = "Al renunciar voluntariamente (menos de 15 años) solo te corresponden las partes proporcionales: aguinaldo, vacaciones y prima vacacional.";
        }
      }

      const total = aguinaldoProporcional + montoVacacionesPendientes + vacacionesProporcionalesAnioActual +
        primaVacacional + indemnizacion + veintePorAnio + primaAntiguedad;

      setResultado({
        salarioDiario, aniosCompletos, aguinaldoProporcional,
        montoVacacionesPendientes, vacacionesProporcionalesAnioActual,
        primaVacacional, indemnizacion, veintePorAnio, primaAntiguedad, total, explicacion,
      });
      setCalculando(false);

      // Incrementar contador real
      try {
        const nuevo = (parseInt(localStorage.getItem("usos_finiquito") || "0", 10)) + 1;
        localStorage.setItem("usos_finiquito", String(nuevo));
        setUsos(nuevo);
      } catch {}
    }, 650);
  }

  function compartir() {
    const texto = resultado
      ? `Según CalculadoraMX, mi finiquito estimado es ${formatMoney(resultado.total)}. Calcula el tuyo gratis en calculadoramx.com`
      : "Calcula tu finiquito gratis en calculadoramx.com";
    const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
  }

  return (
    <main style={{ minHeight: "100vh", background: "#fafbff", paddingBottom: 60 }}>
      {/* HEADER */}
      <header style={{ position: "sticky", top: 0, zIndex: 40, padding: "14px 20px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #eef2ff", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)" }}>
        <Link href="/" style={{ color: "#1847f0", fontSize: 20, textDecoration: "none" }}>←</Link>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#0a0f1e" }}>Finiquito Laboral</div>
        <div style={{ marginLeft: "auto", fontSize: 9, color: "#1847f0", background: "#eef2ff", padding: "4px 9px", borderRadius: 100, fontWeight: 700, border: "1px solid #c7d2fe" }}>GRATIS</div>
      </header>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 20px" }}>
        {/* Intro + contador */}
        <div style={{ padding: "22px 0 8px" }}>
          <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.6, fontWeight: 500 }}>
            Calcula lo que te corresponde por ley al salir de un trabajo. Basado
            en la Ley Federal del Trabajo vigente.
          </p>
          {usos !== null && usos > 0 && (
            <div style={{ marginTop: 10, fontSize: 12, color: "#16a34a", fontWeight: 600 }}>
              ✓ Has usado esta calculadora {usos} {usos === 1 ? "vez" : "veces"}
            </div>
          )}
        </div>

        {/* Barra de progreso */}
        <div style={{ position: "sticky", top: 56, zIndex: 30, background: "#fafbff", paddingTop: 12, paddingBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#6b7280" }}>
              {progreso === 100 ? "¡Listo para calcular!" : "Completa los campos obligatorios"}
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#1847f0" }}>{progreso}%</span>
          </div>
          <div style={{ height: 6, background: "#eef2ff", borderRadius: 100, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progreso}%`, background: "linear-gradient(90deg,#1847f0,#6d5cff)", borderRadius: 100, transition: "width 0.4s ease" }} />
          </div>
        </div>

        {/* Contrato */}
        <Field label="¿Tenías contrato formal de trabajo?" tip="Un contrato formal significa que estabas inscrito ante el IMSS o firmaste un documento. Aunque no hayas firmado nada, la ley te protege igual — solo cambia qué tan fácil es comprobarlo.">
          <div style={{ display: "flex", gap: 8 }}>
            <Toggle active={tieneContrato === "si"} onClick={() => setTieneContrato("si")}>Sí, formal</Toggle>
            <Toggle active={tieneContrato === "no"} onClick={() => setTieneContrato("no")}>No / efectivo</Toggle>
          </div>
          {tieneContrato === "no" && (
            <div style={{ marginTop: 10, background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, padding: 12, fontSize: 11.5, color: "#9a3412", lineHeight: 1.6 }}>
              <strong>Importante:</strong> aunque te pagaran en efectivo o sin
              contrato, la ley te protege igual si había subordinación, horario y
              pago (Art. 20 LFT). El cálculo es el mismo, pero sin recibos o
              testigos puede ser más difícil comprobarlo. Guarda evidencia como
              transferencias, mensajes de WhatsApp o testigos.
            </div>
          )}
        </Field>

        {/* Tipo de salida */}
        <Field label="¿Cómo terminó tu relación laboral?" tip="Esto determina si tienes derecho solo a tus prestaciones acumuladas o también a una indemnización.">
          <select value={tipoSalida} onChange={(e) => setTipoSalida(e.target.value)} style={selectStyle}>
            <option value="renuncia">Renuncié voluntariamente</option>
            <option value="despido_injustificado">Me despidieron sin causa (injustificado)</option>
            <option value="despido_justificado">Me despidieron con causa (justificado)</option>
          </select>
        </Field>

        {/* Salario */}
        <Field label="¿Cuál era tu salario?" tip="Usa el salario que recibías, incluyendo comisiones o bonos regulares. No incluyas vales de despensa.">
          <div style={{ display: "flex", gap: 8 }}>
            <input type="number" inputMode="decimal" placeholder="Ej: 500" value={salario} onChange={(e) => setSalario(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
            <select value={periodoSalario} onChange={(e) => setPeriodoSalario(e.target.value)} style={{ ...selectStyle, width: 120 }}>
              <option value="diario">Diario</option>
              <option value="semanal">Semanal</option>
              <option value="mensual">Mensual</option>
            </select>
          </div>
        </Field>

        {/* Fechas */}
        <Field label="Fecha de inicio del trabajo" tip="La fecha en que empezaste a trabajar, aunque no se haya formalizado por escrito.">
          <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} style={inputStyle} />
        </Field>

        <Field label="Fecha de salida (último día trabajado)" tip="El último día que trabajaste o trabajarás en la empresa.">
          <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} style={inputStyle} />
        </Field>

        <Field label="Días de vacaciones que generaste pero no tomaste" tip="Si llevas más de un año y no tomaste todas tus vacaciones de años anteriores, ponlas aquí. Si no sabes, deja 0.">
          <input type="number" inputMode="numeric" placeholder="Si no sabes, deja 0" value={diasVacPendientes} onChange={(e) => setDiasVacPendientes(e.target.value)} style={inputStyle} />
        </Field>

        <button onClick={calcular} disabled={calculando} style={{ ...ctaStyle, opacity: calculando ? 0.7 : 1 }}>
          {calculando ? "Calculando..." : "Calcular mi finiquito →"}
        </button>

        {/* Loading */}
        {calculando && (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div className="spinner" />
            <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>Aplicando la Ley Federal del Trabajo...</div>
          </div>
        )}

        {/* RESULTADO */}
        {resultado && !calculando && (
          <div style={{ paddingTop: 8 }}>
            <div style={{ background: "#0a0f1e", borderRadius: 18, padding: 24, marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 6, fontWeight: 600, letterSpacing: "0.5px" }}>TOTAL ESTIMADO</div>
              <div style={{ fontSize: 34, fontWeight: 800, color: "#fff", marginBottom: 4, letterSpacing: "-1px" }}>{formatMoney(resultado.total)}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>Antigüedad: {resultado.aniosCompletos} año(s) completo(s)</div>
            </div>

            <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 13.5, color: "#1e3a8a", lineHeight: 1.65, fontWeight: 600 }}>
              {resultado.explicacion}
            </div>

            {/* Botón compartir */}
            <button onClick={compartir} style={{ width: "100%", padding: 14, background: "#16a34a", color: "#fff", border: "none", borderRadius: 12, fontSize: 14.5, fontWeight: 700, cursor: "pointer", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              📲 Compartir mi resultado
            </button>

            <div style={{ fontSize: 13, fontWeight: 700, color: "#0a0f1e", marginBottom: 8 }}>Desglose del cálculo</div>
            <Linea label="Aguinaldo proporcional" valor={resultado.aguinaldoProporcional} nota="Art. 87 LFT" />
            {resultado.montoVacacionesPendientes > 0 && <Linea label="Vacaciones pendientes" valor={resultado.montoVacacionesPendientes} nota="Días acumulados" />}
            <Linea label="Vacaciones proporcionales" valor={resultado.vacacionesProporcionalesAnioActual} nota="Art. 76 LFT" />
            <Linea label="Prima vacacional (25%)" valor={resultado.primaVacacional} nota="Art. 80 LFT" />
            {resultado.indemnizacion > 0 && <Linea label="Indemnización (3 meses)" valor={resultado.indemnizacion} nota="Art. 50 LFT" />}
            {resultado.veintePorAnio > 0 && <Linea label="20 días por año" valor={resultado.veintePorAnio} nota="Art. 50 LFT" />}
            {resultado.primaAntiguedad > 0 && <Linea label="Prima de antigüedad" valor={resultado.primaAntiguedad} nota="Art. 162 LFT" />}

            {/* Fuente legal */}
            <div style={{ marginTop: 18, fontSize: 11.5, color: "#4b5563", background: "#f9fafb", border: "1px solid #eef2ff", borderRadius: 10, padding: 14, lineHeight: 1.65, fontWeight: 500 }}>
              <strong style={{ color: "#374151" }}>Fuente legal:</strong> Ley Federal
              del Trabajo (LFT), artículos 50, 76, 80, 87 y 162 — texto vigente
              publicado por la Cámara de Diputados del H. Congreso de la Unión
              (diputados.gob.mx).
            </div>

            {/* Disclaimer */}
            <div style={{ marginTop: 12, fontSize: 10.5, color: "#9ca3af", lineHeight: 1.7, background: "#fff", border: "1px solid #f0f0f0", borderRadius: 10, padding: 14 }}>
              <strong>Aviso:</strong> esta es una estimación informativa y no
              constituye asesoría legal. El monto real puede variar según tu
              contrato, prestaciones adicionales o convenios. Para asesoría
              gratuita puedes acudir a la PROFEDET (Procuraduría Federal de la
              Defensa del Trabajo).
            </div>
          </div>
        )}

        {/* Otras calculadoras */}
        <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid #eef2ff" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 12 }}>Otras calculadoras gratis</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href="/pension-alimenticia" style={chipStyle}>👧 Pensión Alimenticia</Link>
            <Link href="/pension-imss" style={chipStyle}>🏛️ Pensión IMSS</Link>
            <Link href="/herencias" style={chipStyle}>📋 Herencias</Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .spinner {
          width: 32px; height: 32px; margin: 0 auto;
          border: 3px solid #eef2ff; border-top-color: #1847f0;
          border-radius: 50%; animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </main>
  );
}

function Field({ label, tip, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
        {label}
        <Tip text={tip} />
      </label>
      {children}
    </div>
  );
}

function Toggle({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{ flex: 1, padding: 11, borderRadius: 10, border: active ? "1px solid #1847f0" : "1px solid #e5e7eb", background: active ? "#1847f0" : "#fff", color: active ? "#fff" : "#6b7280", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
      {children}
    </button>
  );
}

function Linea({ label, valor, nota }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid #f0f0f0" }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#0a0f1e" }}>{label}</div>
        <div style={{ fontSize: 10.5, color: "#6b7280", fontWeight: 500 }}>{nota}</div>
      </div>
      <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0a0f1e" }}>{formatMoney(valor)}</div>
    </div>
  );
}

const inputStyle = { width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 14, fontFamily: "inherit", color: "#0a0f1e", background: "#fff" };
const selectStyle = { ...inputStyle };
const ctaStyle = { width: "100%", padding: 16, background: "#1847f0", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 8, marginBottom: 8 };
const chipStyle = { fontSize: 12, fontWeight: 600, color: "#374151", background: "#fff", border: "1px solid #eef2ff", borderRadius: 100, padding: "8px 14px", textDecoration: "none" };