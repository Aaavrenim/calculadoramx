"use client";
import { useState, useRef, useEffect } from "react";

function Tip({ text }) {
  const [open, setOpen] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-block", marginLeft: 6 }}>
      <button onClick={() => setOpen((v) => !v)} style={{
        background: "#e8eaff", border: "none", borderRadius: "50%",
        width: 20, height: 20, fontSize: 11, fontWeight: 700,
        color: "#1847f0", cursor: "pointer", lineHeight: "20px",
        padding: 0, display: "inline-flex", alignItems: "center", justifyContent: "center",
      }} aria-label="Más información">?</button>
      {open && (
        <span style={{
          position: "absolute", bottom: "calc(100% + 8px)", left: "50%",
          transform: "translateX(-50%)", background: "#0a0f1e", color: "#fff",
          fontSize: 12, lineHeight: 1.5, padding: "10px 14px", borderRadius: 10,
          width: 240, zIndex: 999, boxShadow: "0 4px 20px rgba(0,0,0,0.25)", whiteSpace: "normal",
        }}>
          {text}
          <span style={{
            position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
            border: "6px solid transparent", borderTopColor: "#0a0f1e",
          }} />
        </span>
      )}
    </span>
  );
}

function Label({ children, tip }) {
  return (
    <label style={{ display: "flex", alignItems: "center", fontWeight: 600, fontSize: 14, color: "#0a0f1e", marginBottom: 6 }}>
      {children}
      {tip && <Tip text={tip} />}
    </label>
  );
}

const inp = {
  width: "100%", padding: "12px 14px", borderRadius: 10,
  border: "1.5px solid #dde0ff", fontSize: 15, outline: "none",
  background: "#fafbff", color: "#0a0f1e", boxSizing: "border-box",
  fontFamily: "inherit",
};

const CORTE_97 = new Date("1997-07-01");
const SEMANAS_MIN_73 = 500;
const SEMANAS_MIN_97 = 1250;
const UMA_DIARIO_2024 = 108.57;
const UMA_MENSUAL = UMA_DIARIO_2024 * 30.4;
const TOPE_SBC = UMA_DIARIO_2024 * 25;
const RENDIMIENTO_AFORE = 0.045;
const APORTACION_TOTAL = 0.065;

function hoyISO() {
  return new Date().toISOString().split("T")[0];
}

function cuantiaBasica73(anios) {
  if (anios < 10) return 0;
  return Math.min(0.80 + Math.max(0, anios - 10) * 0.01299, 1.0);
}

function calcularRegimen73({ sbc, semanas, edadActual }) {
  const anios = semanas / 52;
  const pct = cuantiaBasica73(anios);
  const sbcUsado = Math.min(sbc, TOPE_SBC);
  const mensual = sbcUsado * 30.4 * pct;
  const cumpleVejez = semanas >= SEMANAS_MIN_73 && edadActual >= 65;
  const cumpleCesantia = semanas >= SEMANAS_MIN_73 && edadActual >= 60;
  const cumple = cumpleVejez || cumpleCesantia;
  const semanasRestantes = Math.max(0, SEMANAS_MIN_73 - semanas);
  const faltanParaVejez = Math.max(semanasRestantes, Math.max(0, 65 - edadActual) * 52);
  const faltanParaCesantia = Math.max(semanasRestantes, Math.max(0, 60 - edadActual) * 52);
  return { mensual, pct, cumple, cumpleVejez, cumpleCesantia, semanasRestantes, faltanParaVejez, faltanParaCesantia, regimen: "73", anios, sbcUsado };
}

function calcularRegimen97({ sbc, semanas, edadActual, saldoAfore }) {
  const cumple = semanas >= SEMANAS_MIN_97 && edadActual >= 65;
  const semanasRestantes = Math.max(0, SEMANAS_MIN_97 - semanas);
  const faltanTotal = Math.max(semanasRestantes, Math.max(0, 65 - edadActual) * 52);
  const aniosRestantes = faltanTotal / 52;
  const sbcUsado = Math.min(sbc, TOPE_SBC);
  const aportAnual = sbcUsado * 365 * APORTACION_TOTAL;
  const saldoFV = saldoAfore * Math.pow(1 + RENDIMIENTO_AFORE, aniosRestantes)
    + aportAnual * ((Math.pow(1 + RENDIMIENTO_AFORE, aniosRestantes) - 1) / RENDIMIENTO_AFORE);
  const mensualProyectada = saldoFV / 240;
  const pensionMinimaGarantizada = UMA_MENSUAL;
  const mensualFinal = cumple ? Math.max(mensualProyectada, pensionMinimaGarantizada) : mensualProyectada;
  return { mensual: mensualFinal, saldoFV, semanasRestantes, faltanTotal, cumple, regimen: "97", pensionMinimaGarantizada };
}

function calcularModalidad40({ sbcActual, sbcM40, semanas, aniosRestantes }) {
  const sbcNuevo = Math.max(sbcActual, Math.min(sbcM40, TOPE_SBC));
  const aniosTotales = semanas / 52 + aniosRestantes;
  const pct = cuantiaBasica73(aniosTotales);
  const pensionConM40 = sbcNuevo * 30.4 * pct;
  const aportacionMensual = sbcNuevo * 30.4 * 0.10075;
  const totalAportado = aportacionMensual * aniosRestantes * 12;
  return { pensionConM40, sbcNuevo, aportacionMensual, totalAportado, pct };
}

function pesos(n) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);
}
function semToAniosMeses(s) {
  const totalMeses = Math.round((s / 52) * 12);
  const a = Math.floor(totalMeses / 12);
  const m = totalMeses % 12;
  if (a === 0) return `${m} mes${m !== 1 ? "es" : ""}`;
  if (m === 0) return `${a} año${a !== 1 ? "s" : ""}`;
  return `${a} año${a !== 1 ? "s" : ""} y ${m} mes${m !== 1 ? "es" : ""}`;
}
function fechaJubilacion(semanasRestantes) {
  if (semanasRestantes <= 0) return null;
  const fecha = new Date(Date.now() + semanasRestantes * 7 * 86400000);
  return fecha.toLocaleDateString("es-MX", { year: "numeric", month: "long" });
}

function TarjetaTiempo({ titulo, tipTitulo, semanasFaltan, cumple, textoOk }) {
  return (
    <div style={{
      background: cumple ? "#f0fff4" : "#fafbff",
      border: `1.5px solid ${cumple ? "#a3e4b3" : "#e0e4ff"}`,
      borderRadius: 14, padding: "18px",
    }}>
      <p style={{ margin: "0 0 8px", fontSize: 12, color: "#666", fontWeight: 700, display: "flex", alignItems: "center" }}>
        {titulo}{tipTitulo && <Tip text={tipTitulo} />}
      </p>
      {cumple ? (
        <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: "#0a7a3a" }}>{textoOk}</p>
      ) : (
        <>
          <p style={{ margin: "0 0 4px", fontSize: 13, color: "#0a0f1e", fontWeight: 700, lineHeight: 1.5 }}>
            Te faltan <strong style={{ color: "#1847f0" }}>{semanasFaltan} semanas</strong>{" "}
            (≈ {semToAniosMeses(semanasFaltan)}) para jubilarte por esta vía.
          </p>
          {fechaJubilacion(semanasFaltan) && (
            <p style={{ margin: "6px 0 0", fontSize: 12, color: "#1847f0", fontWeight: 600 }}>
              📅 Fecha estimada: {fechaJubilacion(semanasFaltan)}
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default function PensionIMSS() {
  const [modoSemanas, setModoSemanas] = useState("directo");
  const [fechaPrimeraCot, setFechaPrimeraCot] = useState("");
  const [edadActual, setEdadActual] = useState("");
  const [sbcDiario, setSbcDiario] = useState("");
  const [semanasDirectas, setSemanasDirectas] = useState("");
  const [periodos, setPeriodos] = useState([{ inicio: "", fin: "", activo: false }]);
  const [saldoAfore, setSaldoAfore] = useState("");
  const [sbcM40, setSbcM40] = useState("");
  const [aniosM40, setAniosM40] = useState("");
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");
  const resultRef = useRef(null);

  const regimen = fechaPrimeraCot
    ? (new Date(fechaPrimeraCot) < CORTE_97 ? "73" : "97")
    : null;

  useEffect(() => {
    if (modoSemanas === "periodos" && fechaPrimeraCot) {
      setPeriodos(prev => {
        const copy = [...prev];
        if (!copy[0].inicio) copy[0] = { ...copy[0], inicio: fechaPrimeraCot };
        return copy;
      });
    }
  }, [modoSemanas, fechaPrimeraCot]);

  function semanasDePeridos() {
    let total = 0;
    for (const p of periodos) {
      if (!p.inicio) continue;
      const ini = new Date(p.inicio);
      const fin = p.activo ? new Date() : (p.fin ? new Date(p.fin) : null);
      if (!fin || fin <= ini) continue;
      total += (fin - ini) / (86400000 * 7);
    }
    return Math.round(total);
  }

  function updatePeriodo(i, campo, val) {
    const copy = [...periodos];
    copy[i] = { ...copy[i], [campo]: val };
    setPeriodos(copy);
  }

  function toggleActivo(i) {
    const copy = [...periodos];
    copy[i] = { ...copy[i], activo: !copy[i].activo, fin: !copy[i].activo ? "" : copy[i].fin };
    setPeriodos(copy);
  }

  function addPeriodo() {
    setPeriodos([...periodos, { inicio: "", fin: "", activo: false }]);
  }

  function removePeriodo(i) {
    if (periodos.length === 1) return;
    setPeriodos(periodos.filter((_, idx) => idx !== i));
  }

  function calcular() {
    setError(""); setResultado(null);
    const edad = parseInt(edadActual);
    const sbc = parseFloat(sbcDiario);
    if (!fechaPrimeraCot) return setError("Ingresa tu fecha de primera cotización.");
    if (!edad || edad < 16 || edad > 100) return setError("Ingresa una edad válida.");
    if (!sbc || sbc <= 0) return setError("Ingresa tu Salario Base de Cotización diario.");
    let semanas = modoSemanas === "directo" ? parseInt(semanasDirectas) : semanasDePeridos();
    if (!semanas || semanas <= 0) return setError("Ingresa tus semanas cotizadas.");

    let res;
    if (regimen === "73") {
      res = calcularRegimen73({ sbc, semanas, edadActual: edad });
    } else {
      res = calcularRegimen97({ sbc, semanas, edadActual: edad, saldoAfore: parseFloat(saldoAfore) || 0 });
    }
    res.semanasTotales = semanas;
    res.sbcOriginal = sbc;

    if (regimen === "73" && sbcM40 && aniosM40) {
      res.m40 = calcularModalidad40({
        sbcActual: Math.min(sbc, TOPE_SBC),
        sbcM40: parseFloat(sbcM40),
        semanas,
        aniosRestantes: parseFloat(aniosM40),
      });
    }

    setResultado(res);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }

  const semanasPreview = modoSemanas === "periodos" ? semanasDePeridos() : null;
  const ultimoIdx = periodos.length - 1;

  return (
    <div style={{ minHeight: "100vh", background: "#fafbff", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>

      {/* HEADER */}
      <header style={{ position: "sticky", top: 12, zIndex: 100, display: "flex", justifyContent: "center", padding: "0 16px" }}>
        <div style={{
          background: "rgba(255,255,255,0.85)", backdropFilter: "blur(16px)",
          borderRadius: 100, padding: "12px 28px", display: "flex", alignItems: "center", gap: 24,
          boxShadow: "0 2px 24px rgba(24,71,240,0.10)", border: "1px solid rgba(24,71,240,0.10)",
        }}>
          <a href="/" style={{ fontWeight: 800, fontSize: 17, color: "#0a0f1e", textDecoration: "none" }}>
            Calculadora<span style={{ color: "#1847f0" }}>MX</span>
          </a>
          <nav style={{ display: "flex", gap: 18 }}>
            {[["Finiquito", "/finiquito"], ["Alimentos", "/pension-alimenticia"], ["IMSS", "/pension-imss"], ["Herencias", "/herencias"]].map(([l, h]) => (
              <a key={l} href={h} style={{
                fontSize: 13, fontWeight: 600, color: h === "/pension-imss" ? "#1847f0" : "#444",
                textDecoration: "none", borderBottom: h === "/pension-imss" ? "2px solid #1847f0" : "2px solid transparent", paddingBottom: 2,
              }}>{l}</a>
            ))}
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section style={{ textAlign: "center", padding: "60px 20px 0" }}>
        <div style={{
          display: "inline-block", background: "#eef0ff", color: "#1847f0",
          fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 100, letterSpacing: 1, marginBottom: 18,
        }}>GRATIS · SIN REGISTRO · PRIVADO</div>
        <h1 style={{ fontSize: "clamp(28px, 6vw, 52px)", fontWeight: 900, lineHeight: 1.1, color: "#0a0f1e", margin: "0 0 16px" }}>
          Calculadora de<br />
          <span style={{ background: "linear-gradient(90deg,#1847f0,#6c8fff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Pensión IMSS
          </span>
        </h1>
        <p style={{ color: "#555", fontSize: 16, maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.6 }}>
          Descubre cuánto recibirás al jubilarte según tus semanas cotizadas, régimen (73 o 97) y salario. Resultado inmediato y gratuito.
        </p>
      </section>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 16px 60px" }}>
        <div style={{
          background: "#fff", borderRadius: 20, padding: "32px 28px",
          boxShadow: "0 4px 40px rgba(24,71,240,0.08)", border: "1px solid rgba(24,71,240,0.08)",
        }}>

          {/* SECCIÓN 1 */}
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0a0f1e", margin: "0 0 20px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ background: "#1847f0", color: "#fff", borderRadius: "50%", width: 26, height: 26, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900 }}>1</span>
            Datos básicos
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <Label tip="Fecha en que empezaste a cotizar por primera vez en el IMSS. Si fue antes del 1 julio 1997, eres Régimen 73. Si fue después, eres Régimen 97 (AFORE).">
                Primera cotización IMSS
              </Label>
              <input type="date" value={fechaPrimeraCot} onChange={e => setFechaPrimeraCot(e.target.value)} style={inp} max="2024-12-31" />
            </div>
            <div>
              <Label tip="Tu edad actual en años completos.">Edad actual</Label>
              <input type="number" placeholder="Ej. 45" value={edadActual} onChange={e => setEdadActual(e.target.value)} style={inp} min="16" max="100" />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <Label tip="El Salario Base de Cotización (SBC) es el salario diario integrado que tu patrón reporta al IMSS. Incluye tu sueldo más partes proporcionales de aguinaldo, vacaciones y otras prestaciones. Lo encuentras en tu recibo de nómina o en el estado de cuenta de tu AFORE.">
              Salario Base de Cotización (SBC) diario
            </Label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#888", fontWeight: 600 }}>$</span>
              <input type="number" placeholder="Ej. 450" value={sbcDiario} onChange={e => setSbcDiario(e.target.value)} style={{ ...inp, paddingLeft: 28 }} min="0" step="0.01" />
            </div>
            {sbcDiario && parseFloat(sbcDiario) > TOPE_SBC && (
              <p style={{ fontSize: 12, color: "#e07000", marginTop: 4 }}>
                ⚠️ El IMSS tiene un tope de {pesos(TOPE_SBC)}/día. El cálculo usará ese tope.
              </p>
            )}
          </div>

          {regimen && (
            <div style={{
              background: regimen === "73" ? "#f0f4ff" : "#f0fff4",
              border: `1.5px solid ${regimen === "73" ? "#c7d4ff" : "#a3e4b3"}`,
              borderRadius: 12, padding: "12px 16px", marginBottom: 20,
              display: "flex", alignItems: "flex-start", gap: 10,
            }}>
              <span style={{ fontSize: 20, marginTop: 2 }}>{regimen === "73" ? "🏛️" : "💼"}</span>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#0a0f1e" }}>Régimen {regimen} detectado</p>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "#444", lineHeight: 1.5 }}>
                  {regimen === "73"
                    ? "Cotizaste antes del 1 julio 1997. Tu pensión se calcula como un porcentaje fijo de tu salario según los años cotizados."
                    : "Cotizaste después del 1 julio 1997. Tu pensión depende del saldo acumulado en tu cuenta AFORE y su rendimiento."}
                </p>
              </div>
            </div>
          )}

          {regimen === "97" && (
            <div style={{ marginBottom: 16 }}>
              <Label tip="Total acumulado en tu cuenta individual de AFORE. Consúltalo en la app de tu AFORE, en sarweb.org.mx o en tu estado de cuenta trimestral. Si no lo sabes, escribe 0.">
                Saldo actual en AFORE
              </Label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#888", fontWeight: 600 }}>$</span>
                <input type="number" placeholder="Ej. 250000 (escribe 0 si no lo sabes)" value={saldoAfore}
                  onChange={e => setSaldoAfore(e.target.value)} style={{ ...inp, paddingLeft: 28 }} min="0" />
              </div>
            </div>
          )}

          {/* SECCIÓN 2 — SEMANAS */}
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0a0f1e", margin: "24px 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ background: "#1847f0", color: "#fff", borderRadius: "50%", width: 26, height: 26, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900 }}>2</span>
            Semanas cotizadas
            <Tip text="Son las semanas que estuviste dado/a de alta en el IMSS como trabajador asegurado. Consúltalas gratis en imss.gob.mx con tu NSS, o en la app de tu AFORE." />
          </h2>

          <div style={{ display: "flex", background: "#f0f2ff", borderRadius: 10, padding: 4, marginBottom: 20 }}>
            {[["directo", "Ingresar número directo"], ["periodos", "Calcular por periodos de trabajo"]].map(([val, label]) => (
              <button key={val} onClick={() => setModoSemanas(val)} style={{
                flex: 1, padding: "9px 12px", borderRadius: 8, border: "none",
                background: modoSemanas === val ? "#fff" : "transparent",
                fontWeight: 700, fontSize: 13, color: modoSemanas === val ? "#1847f0" : "#666",
                cursor: "pointer", boxShadow: modoSemanas === val ? "0 1px 6px rgba(0,0,0,0.10)" : "none",
                transition: "all 0.2s",
              }}>{label}</button>
            ))}
          </div>

          {modoSemanas === "directo" ? (
            <div style={{ marginBottom: 16 }}>
              <Label tip="Número total de semanas cotizadas en toda tu vida laboral. Lo puedes ver en tu Constancia de Semanas Cotizadas en imss.gob.mx usando tu NSS.">
                Total de semanas cotizadas
              </Label>
              <input type="number" placeholder="Ej. 650" value={semanasDirectas}
                onChange={e => setSemanasDirectas(e.target.value)} style={inp} min="0" />
              {semanasDirectas && (
                <p style={{ fontSize: 12, color: "#555", marginTop: 4 }}>≈ {semToAniosMeses(parseInt(semanasDirectas) || 0)} cotizados</p>
              )}
            </div>
          ) : (
            <div>
              <p style={{ fontSize: 13, color: "#555", marginBottom: 12 }}>
                Agrega cada periodo en que estuviste dado/a de alta en el IMSS. El sistema suma las semanas automáticamente.
              </p>
              {periodos.map((p, i) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 10, alignItems: "end" }}>
                    <div>
                      {i === 0 && <Label>Inicio</Label>}
                      <input type="date" value={p.inicio} onChange={e => updatePeriodo(i, "inicio", e.target.value)} style={inp} />
                      {i === 0 && p.inicio === fechaPrimeraCot && fechaPrimeraCot && (
                        <p style={{ fontSize: 11, color: "#1847f0", margin: "3px 0 0", fontWeight: 600 }}>✓ Autocompletado</p>
                      )}
                    </div>
                    <div>
                      {i === 0 && <Label>Fin</Label>}
                      <input type="date" value={p.activo ? hoyISO() : p.fin}
                        onChange={e => updatePeriodo(i, "fin", e.target.value)}
                        style={{ ...inp, opacity: p.activo ? 0.5 : 1 }}
                        disabled={p.activo} />
                    </div>
                    <button onClick={() => removePeriodo(i)} disabled={periodos.length === 1}
                      style={{
                        background: "#ffe0e0", border: "none", borderRadius: 8,
                        padding: "11px 14px", color: "#c00", cursor: "pointer",
                        fontWeight: 700, fontSize: 16, opacity: periodos.length === 1 ? 0.3 : 1,
                      }}>×</button>
                  </div>

                  {/* CHECKBOX "Aún sigo trabajando" — solo en el último periodo */}
                  {i === ultimoIdx && (
                    <label style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      marginTop: 8, cursor: "pointer",
                      background: p.activo ? "#eef6ff" : "#f8f9ff",
                      border: `1.5px solid ${p.activo ? "#1847f0" : "#dde0ff"}`,
                      borderRadius: 8, padding: "8px 14px",
                    }}>
                      <input
                        type="checkbox"
                        checked={p.activo}
                        onChange={() => toggleActivo(i)}
                        style={{ width: 16, height: 16, accentColor: "#1847f0", cursor: "pointer" }}
                      />
                      <span style={{ fontSize: 13, fontWeight: 700, color: p.activo ? "#1847f0" : "#444" }}>
                        Aún sigo trabajando aquí
                      </span>
                      {p.activo && (
                        <span style={{ fontSize: 11, color: "#1847f0", fontWeight: 600 }}>
                          — se calcula hasta hoy
                        </span>
                      )}
                    </label>
                  )}
                </div>
              ))}

              <button onClick={addPeriodo} style={{
                background: "#f0f4ff", border: "1.5px dashed #1847f0", borderRadius: 10,
                padding: "10px 16px", color: "#1847f0", fontWeight: 700, fontSize: 13,
                cursor: "pointer", width: "100%", marginBottom: 10,
              }}>+ Agregar otro periodo</button>

              {semanasPreview > 0 && (
                <div style={{ background: "#f0f4ff", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#1847f0", fontWeight: 600 }}>
                  Total calculado: <strong>{semanasPreview} semanas</strong> ({semToAniosMeses(semanasPreview)})
                  {periodos.some(p => p.activo) && <span style={{ fontWeight: 400, color: "#555" }}> — incluye semanas hasta hoy</span>}
                </div>
              )}
            </div>
          )}

          {/* SECCIÓN 3 — MODALIDAD 40 siempre visible, solo régimen 73 */}
          {regimen === "73" && (
            <div style={{
              marginTop: 28,
              background: "linear-gradient(135deg, #fffbe6 0%, #fff8d6 100%)",
              border: "2px solid #f5d000",
              borderRadius: 16, padding: "22px 20px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 26 }}>💰</span>
                <div>
                  <p style={{ margin: 0, fontWeight: 900, fontSize: 15, color: "#7a5000" }}>
                    Simular Modalidad 40
                  </p>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9a6500" }}>
                    Aporta voluntariamente y aumenta tu pensión de por vida — solo Régimen 73
                  </p>
                </div>
              </div>

              {/* Explicación */}
              <div style={{
                background: "rgba(255,255,255,0.7)", borderRadius: 10,
                padding: "14px", marginBottom: 16, borderLeft: "3px solid #f5c000",
              }}>
                <p style={{ margin: "0 0 6px", fontSize: 12, color: "#5a4000", lineHeight: 1.6 }}>
                  <strong>¿Qué es?</strong> Un esquema que te permite cotizar al IMSS con un salario mayor al que tu patrón reporta, o seguir cotizando aunque ya no trabajes. A mayor SBC declarado = mayor pensión mensual de por vida.
                </p>
                <p style={{ margin: "0 0 6px", fontSize: 12, color: "#5a4000", lineHeight: 1.6 }}>
                  <strong>¿Cuánto pagas?</strong> El <strong>10.075% del SBC que declares</strong> cada mes, directamente al IMSS. El SBC no puede ser menor al que ya tienes ni mayor a 25 UMAs (~{pesos(TOPE_SBC)}/día).
                </p>
                <p style={{ margin: 0, fontSize: 12, color: "#c04000", fontWeight: 700, lineHeight: 1.5 }}>
                  ⚠️ Solo funciona si pagas todos los meses sin interrupción. Si dejas de pagar, el IMSS no reconoce el SBC más alto para ese periodo.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <Label tip="El SBC que quieres declarar bajo Modalidad 40. Debe ser mayor a tu SBC actual para subir tu pensión. Tope máximo: 25 UMAs (~$2,714/día en 2024).">
                    SBC a declarar (diario)
                  </Label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#888", fontWeight: 600 }}>$</span>
                    <input type="number" placeholder={`Mayor a $${sbcDiario || "tu SBC"}`} value={sbcM40}
                      onChange={e => setSbcM40(e.target.value)} style={{ ...inp, paddingLeft: 28 }} min="0" step="0.01" />
                  </div>
                  {sbcM40 && sbcDiario && parseFloat(sbcM40) <= parseFloat(sbcDiario) && (
                    <p style={{ fontSize: 11, color: "#c00", marginTop: 4, fontWeight: 600 }}>
                      ⚠️ Debe ser mayor a tu SBC actual
                    </p>
                  )}
                </div>
                <div>
                  <Label tip="¿Cuántos años planeas mantener las aportaciones? Solo cuenta si pagas todos los meses sin falta.">
                    Años que planeas aportar
                  </Label>
                  <input type="number" placeholder="Ej. 5" value={aniosM40}
                    onChange={e => setAniosM40(e.target.value)} style={inp} min="1" max="40" />
                </div>
              </div>

              {(!sbcM40 || !aniosM40) && (
                <p style={{ margin: "12px 0 0", fontSize: 12, color: "#9a6500", textAlign: "center" }}>
                  Llena los dos campos y presiona "Calcular mi pensión" para ver el impacto.
                </p>
              )}
            </div>
          )}

          {error && (
            <div style={{ background: "#fff0f0", border: "1px solid #ffc0c0", borderRadius: 10, padding: "12px 16px", color: "#c00", fontSize: 13, marginTop: 16 }}>
              {error}
            </div>
          )}

          <button onClick={calcular} style={{
            width: "100%", padding: "16px", background: "linear-gradient(90deg,#1847f0,#4a6fff)",
            color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 800,
            cursor: "pointer", marginTop: 20, letterSpacing: 0.3,
            boxShadow: "0 4px 20px rgba(24,71,240,0.25)",
          }}>
            Calcular mi pensión →
          </button>
        </div>

        {/* RESULTADO */}
        {resultado && (
          <div ref={resultRef} style={{
            background: "#fff", borderRadius: 20, padding: "32px 28px", marginTop: 24,
            boxShadow: "0 4px 40px rgba(24,71,240,0.10)",
            border: "1.5px solid rgba(24,71,240,0.15)",
            animation: "fadeUp 0.4s ease",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0a0f1e" }}>Tu resultado estimado</h3>
              <span style={{
                background: resultado.regimen === "73" ? "#e8edff" : "#e8fff0",
                color: resultado.regimen === "73" ? "#1847f0" : "#0a7a3a",
                fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 100,
              }}>Régimen {resultado.regimen}</span>
            </div>

            <div style={{
              background: "linear-gradient(135deg,#1847f0 0%,#4a6fff 100%)",
              borderRadius: 16, padding: "24px", textAlign: "center", marginBottom: 20, color: "#fff",
            }}>
              <p style={{ margin: "0 0 6px", fontSize: 13, opacity: 0.85 }}>Pensión mensual estimada</p>
              <p style={{ margin: 0, fontSize: "clamp(32px,8vw,48px)", fontWeight: 900, letterSpacing: -1 }}>
                {pesos(resultado.mensual)}
              </p>
              {resultado.regimen === "73" && (
                <p style={{ margin: "8px 0 0", fontSize: 12, opacity: 0.85 }}>
                  {Math.round(resultado.pct * 100)}% de tu SBC — tabla de cuantía básica IMSS
                </p>
              )}
              {resultado.regimen === "97" && resultado.mensual <= resultado.pensionMinimaGarantizada + 1 && resultado.cumple && (
                <p style={{ margin: "8px 0 0", fontSize: 12, opacity: 0.85 }}>
                  Se aplica la Pensión Mínima Garantizada (1 UMA ≈ {pesos(UMA_MENSUAL)}/mes)
                </p>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              <div style={{
                background: resultado.cumple ? "#f0fff4" : "#fff8f0",
                border: `1.5px solid ${resultado.cumple ? "#a3e4b3" : "#ffd0a0"}`,
                borderRadius: 14, padding: "16px",
              }}>
                <p style={{ margin: "0 0 6px", fontSize: 12, color: "#666", fontWeight: 700 }}>Requisito mínimo</p>
                <p style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 900, color: resultado.cumple ? "#0a7a3a" : "#c05000" }}>
                  {resultado.cumple ? "✅ Ya cumples" : "⚠️ Aún no cumples"}
                </p>
                <p style={{ margin: 0, fontSize: 12, color: "#555", lineHeight: 1.4 }}>
                  {resultado.regimen === "73"
                    ? "Mínimo 500 semanas cotizadas y 60 años (cesantía) o 65 años (vejez)."
                    : "Mínimo 1,250 semanas cotizadas y 65 años."}
                </p>
              </div>

              <div style={{ background: "#f0f4ff", border: "1.5px solid #dde0ff", borderRadius: 14, padding: "16px" }}>
                <p style={{ margin: "0 0 6px", fontSize: 12, color: "#666", fontWeight: 700 }}>Semanas cotizadas</p>
                <p style={{ margin: "0 0 2px", fontSize: 26, fontWeight: 900, color: "#1847f0" }}>{resultado.semanasTotales}</p>
                <p style={{ margin: 0, fontSize: 12, color: "#555" }}>≈ {semToAniosMeses(resultado.semanasTotales)} en el IMSS</p>
              </div>

              {resultado.regimen === "73" ? (
                <>
                  <TarjetaTiempo
                    titulo="Pensión por vejez"
                    tipTitulo="Aplica a los 65 años o más con mínimo 500 semanas cotizadas. Es la jubilación estándar."
                    semanasFaltan={resultado.faltanParaVejez}
                    cumple={resultado.cumpleVejez}
                    textoOk="✅ Ya puedes solicitar pensión por vejez (65+ años)"
                  />
                  <TarjetaTiempo
                    titulo="Pensión por cesantía"
                    tipTitulo="Aplica a los 60 años con mínimo 500 semanas, si te quedaste sin empleo. El monto es ligeramente menor al de vejez."
                    semanasFaltan={resultado.faltanParaCesantia}
                    cumple={resultado.cumpleCesantia}
                    textoOk="✅ Ya puedes solicitar pensión por cesantía (60+ años)"
                  />
                </>
              ) : (
                <div style={{ gridColumn: "1 / -1" }}>
                  <TarjetaTiempo
                    titulo="Pensión por vejez (Régimen 97)"
                    tipTitulo="Necesitas 65 años y 1,250 semanas cotizadas. Si no llegas, puedes retirar tu saldo AFORE en una sola exhibición."
                    semanasFaltan={resultado.faltanTotal}
                    cumple={resultado.cumple}
                    textoOk="✅ Ya cumples los requisitos para solicitar tu pensión"
                  />
                </div>
              )}

              {resultado.regimen === "97" && (
                <div style={{ background: "#f0f4ff", border: "1.5px solid #c7d4ff", borderRadius: 14, padding: "16px", gridColumn: "1 / -1" }}>
                  <p style={{ margin: "0 0 4px", fontSize: 12, color: "#666", fontWeight: 700 }}>Saldo AFORE proyectado al jubilarte</p>
                  <p style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 900, color: "#1847f0" }}>{pesos(resultado.saldoFV)}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#555" }}>Proyección con rendimiento histórico CONSAR de 4.5% real anual.</p>
                </div>
              )}
            </div>

            {/* RESULTADO MODALIDAD 40 */}
            {resultado.m40 && (
              <div style={{
                background: "linear-gradient(135deg,#fffbe6,#fff8d6)",
                border: "2px solid #f5d000", borderRadius: 16, padding: "20px", marginBottom: 20,
              }}>
                <p style={{ margin: "0 0 14px", fontWeight: 800, fontSize: 15, color: "#7a5000" }}>
                  💰 Resultado con Modalidad 40
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: 10, padding: "14px" }}>
                    <p style={{ margin: "0 0 4px", fontSize: 12, color: "#7a5500", fontWeight: 700 }}>Sin Modalidad 40</p>
                    <p style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#555" }}>{pesos(resultado.mensual)}</p>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: 10, padding: "14px" }}>
                    <p style={{ margin: "0 0 4px", fontSize: 12, color: "#0a7a3a", fontWeight: 700 }}>Con Modalidad 40</p>
                    <p style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#0a7a3a" }}>{pesos(resultado.m40.pensionConM40)}</p>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: 10, padding: "14px" }}>
                    <p style={{ margin: "0 0 4px", fontSize: 12, color: "#7a5500", fontWeight: 700 }}>Aportación mensual al IMSS</p>
                    <p style={{ margin: "0 0 2px", fontSize: 20, fontWeight: 900, color: "#0a0f1e" }}>{pesos(resultado.m40.aportacionMensual)}</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#777" }}>10.075% sobre {pesos(resultado.m40.sbcNuevo)}/día × 30.4</p>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: 10, padding: "14px" }}>
                    <p style={{ margin: "0 0 4px", fontSize: 12, color: "#7a5500", fontWeight: 700 }}>Total invertido en {aniosM40} años</p>
                    <p style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "#0a0f1e" }}>{pesos(resultado.m40.totalAportado)}</p>
                  </div>
                </div>
                <div style={{ marginTop: 12, background: "rgba(255,255,255,0.6)", borderRadius: 10, padding: "12px 14px" }}>
                  <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 13, color: "#0a7a3a" }}>
                    ✅ Ganarías {pesos(resultado.m40.pensionConM40 - resultado.mensual)} más al mes de por vida
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: "#555", lineHeight: 1.5 }}>
                    Solo si mantienes las aportaciones todos los meses sin interrupción.
                  </p>
                </div>
              </div>
            )}

            <div style={{ background: "#f8f9ff", borderRadius: 12, padding: "14px 16px", borderLeft: "3px solid #1847f0", marginBottom: 16 }}>
              <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 700, color: "#1847f0" }}>📋 Fundamento legal</p>
              <p style={{ margin: 0, fontSize: 12, color: "#444", lineHeight: 1.6 }}>
                {resultado.regimen === "73"
                  ? "Ley del Seguro Social 1973 (abrogada, vigente para derechos adquiridos): Art. 167 (cuantía básica), Art. 162 (semanas mínimas vejez), Art. 128 (cesantía en edad avanzada). Modalidad 40: Art. 218 LSS 1973."
                  : "Ley del Seguro Social 1997: Art. 154 (vejez, 1,250 semanas), Art. 159 (pensión mínima garantizada = 1 UMA mensual). Rendimiento de referencia: CONSAR, rendimiento histórico neto del sistema 2000–2024."}
              </p>
            </div>

            <div style={{ background: "#fffbf0", border: "1px solid #ffe0a0", borderRadius: 12, padding: "14px 16px" }}>
              <p style={{ margin: 0, fontSize: 12, color: "#7a5500", lineHeight: 1.6 }}>
                ⚠️ <strong>Estimación orientativa.</strong> El cálculo real puede variar según tu historial completo. Consulta tu NSS en <strong>imss.gob.mx</strong> o acude a tu Subdelegación IMSS para una cifra oficial.
              </p>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginTop: 32 }}>
          {[["💼 Finiquito", "/finiquito"], ["👧 Pensión Alimenticia", "/pension-alimenticia"], ["📋 Herencias", "/herencias"]].map(([l, h]) => (
            <a key={h} href={h} style={{
              background: "#fff", border: "1.5px solid #dde0ff", borderRadius: 100,
              padding: "8px 18px", fontSize: 13, fontWeight: 600, color: "#1847f0", textDecoration: "none",
            }}>{l}</a>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        input:focus { border-color: #1847f0 !important; box-shadow: 0 0 0 3px rgba(24,71,240,0.10); }
        @media (max-width: 500px) { nav { display: none !important; } }
      `}</style>
    </div>
  );
}