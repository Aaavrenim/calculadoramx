"use client";
import { useState, useRef, useEffect } from "react";

/* ─────────────────────────────────────────────
   TOOLTIP
───────────────────────────────────────────── */
function Tip({ text }) {
  const [open, setOpen] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-block", marginLeft: 6 }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          background: "#e8eaff", border: "none", borderRadius: "50%",
          width: 20, height: 20, fontSize: 11, fontWeight: 700,
          color: "#1847f0", cursor: "pointer", lineHeight: "20px",
          padding: 0, display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}
        aria-label="Más información"
      >?</button>
      {open && (
        <span style={{
          position: "absolute", bottom: "calc(100% + 8px)", left: "50%",
          transform: "translateX(-50%)", background: "#0a0f1e", color: "#fff",
          fontSize: 12, lineHeight: 1.5, padding: "10px 14px", borderRadius: 10,
          width: 230, zIndex: 999, boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
          whiteSpace: "normal",
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

/* ─────────────────────────────────────────────
   LABEL ROW
───────────────────────────────────────────── */
function Label({ children, tip }) {
  return (
    <label style={{ display: "flex", alignItems: "center", fontWeight: 600, fontSize: 14, color: "#0a0f1e", marginBottom: 6 }}>
      {children}
      {tip && <Tip text={tip} />}
    </label>
  );
}

/* ─────────────────────────────────────────────
   INPUT STYLES
───────────────────────────────────────────── */
const inp = {
  width: "100%", padding: "12px 14px", borderRadius: 10,
  border: "1.5px solid #dde0ff", fontSize: 15, outline: "none",
  background: "#fafbff", color: "#0a0f1e", boxSizing: "border-box",
  fontFamily: "inherit",
};

/* ─────────────────────────────────────────────
   LEGAL LOGIC
───────────────────────────────────────────── */
const CORTE_97 = new Date("1997-07-01");
const SEMANAS_MIN_73 = 500;
const SEMANAS_MIN_97 = 1250;
const UMA_DIARIO_2024 = 108.57; // UMA 2024
const UMA_MENSUAL = UMA_DIARIO_2024 * 30.4;
const TOPE_SBC = UMA_DIARIO_2024 * 25; // tope 25 UMAs diarias
const RENDIMIENTO_AFORE = 0.045; // 4.5% real anual histórico
const APORTACION_TOTAL = 0.065; // 6.5% sobre SBC (patrón + trabajador + Gob)

function cuantiaBasica73(anios) {
  // Tabla IMSS: 10 años = 80%, cada año adicional suma 1.299%
  if (anios < 10) return 0;
  const base = 0.80;
  const extra = Math.max(0, anios - 10) * 0.01299;
  return Math.min(base + extra, 1.0); // tope 100%
}

function calcularRegimen73({ sbc, semanas, edadActual }) {
  const anios = semanas / 52;
  const pct = cuantiaBasica73(anios);
  const sbcUsado = Math.min(sbc, TOPE_SBC);
  const mensual = sbcUsado * 30.4 * pct; // SBC diario × 30.4 días × %
  const cumpleVejez = semanas >= SEMANAS_MIN_73 && edadActual >= 65;
  const cumpleCesantia = semanas >= SEMANAS_MIN_73 && edadActual >= 60;
  const cumple = cumpleVejez || cumpleCesantia;
  const semanasRestantes = Math.max(0, SEMANAS_MIN_73 - semanas);
  const aniosPara65 = Math.max(0, 65 - edadActual);
  const aniosPara60 = Math.max(0, 60 - edadActual);
  const semanasParaEdad65 = aniosPara65 * 52;
  const semanasParaEdad60 = aniosPara60 * 52;
  const faltanPorSemanas = semanasRestantes;
  const faltanParaVejez = Math.max(faltanPorSemanas, semanasParaEdad65);
  const faltanParaCesantia = Math.max(faltanPorSemanas, semanasParaEdad60);
  return { mensual, pct, cumple, cumpleVejez, cumpleCesantia, semanasRestantes, faltanParaVejez, faltanParaCesantia, regimen: "73", anios };
}

function calcularRegimen97({ sbc, semanas, edadActual, saldoAfore }) {
  const cumple = semanas >= SEMANAS_MIN_97 && edadActual >= 65;
  const semanasRestantes = Math.max(0, SEMANAS_MIN_97 - semanas);
  const aniosPara65 = Math.max(0, 65 - edadActual);
  const semanasParaEdad = aniosPara65 * 52;
  const faltanTotal = Math.max(semanasRestantes, semanasParaEdad);

  // Proyección AFORE: años restantes para 65
  const aniosRestantes = faltanTotal / 52;
  const sbcUsado = Math.min(sbc, TOPE_SBC);
  const aportAnual = sbcUsado * 365 * APORTACION_TOTAL;
  // Valor futuro saldo actual + aportaciones
  const saldoFV = saldoAfore * Math.pow(1 + RENDIMIENTO_AFORE, aniosRestantes)
    + aportAnual * ((Math.pow(1 + RENDIMIENTO_AFORE, aniosRestantes) - 1) / RENDIMIENTO_AFORE);

  // Pensión mensual: saldo / (expectativa de vida restante en meses)
  // IMSS usa tabla de mortalidad, simplificamos: 85 - 65 = 20 años = 240 meses
  const mesesVida = 240;
  const mensualProyectada = saldoFV / mesesVida;

  // Pensión mínima garantizada = 1 UMA mensual (régimen 97 con 1250 semanas)
  const pensionMinimaGarantizada = UMA_MENSUAL;
  const mensualFinal = cumple
    ? Math.max(mensualProyectada, pensionMinimaGarantizada)
    : mensualProyectada; // si no cumple, es proyección referencial

  return { mensual: mensualFinal, saldoFV, semanasRestantes, faltanTotal, cumple, regimen: "97", pensionMinimaGarantizada };
}

/* ─────────────────────────────────────────────
   FORMATO
───────────────────────────────────────────── */
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
  const hoy = new Date();
  const diasRestantes = semanasRestantes * 7;
  const fecha = new Date(hoy.getTime() + diasRestantes * 86400000);
  return fecha.toLocaleDateString("es-MX", { year: "numeric", month: "long" });
}

/* ─────────────────────────────────────────────
   COMPONENTE PRINCIPAL
───────────────────────────────────────────── */
export default function PensionIMSS() {
  // modo ingreso semanas
  const [modoSemanas, setModoSemanas] = useState("directo"); // "directo" | "periodos"
  // campos básicos
  const [fechaPrimeraCot, setFechaPrimeraCot] = useState("");
  const [edadActual, setEdadActual] = useState("");
  const [sbcDiario, setSbcDiario] = useState("");
  // modo directo
  const [semanasDirectas, setSemanasDirectas] = useState("");
  // modo periodos
  const [periodos, setPeriodos] = useState([{ inicio: "", fin: "" }]);
  // régimen 97 extra
  const [saldoAfore, setSaldoAfore] = useState("");
  // resultado
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");
  const resultRef = useRef(null);

  // Detectar régimen
  const regimen = fechaPrimeraCot
    ? (new Date(fechaPrimeraCot) < CORTE_97 ? "73" : "97")
    : null;

  // Calcular semanas desde periodos
  function semanasDePeridos() {
    let total = 0;
    for (const p of periodos) {
      if (!p.inicio || !p.fin) continue;
      const ini = new Date(p.inicio);
      const fin = new Date(p.fin);
      if (fin <= ini) continue;
      const dias = (fin - ini) / 86400000;
      total += dias / 7;
    }
    return Math.round(total);
  }

  function calcular() {
    setError("");
    setResultado(null);

    const edad = parseInt(edadActual);
    const sbc = parseFloat(sbcDiario);

    if (!fechaPrimeraCot) return setError("Ingresa tu fecha de primera cotización.");
    if (!edad || edad < 16 || edad > 100) return setError("Ingresa una edad válida.");
    if (!sbc || sbc <= 0) return setError("Ingresa tu Salario Base de Cotización diario.");

    let semanas = 0;
    if (modoSemanas === "directo") {
      semanas = parseInt(semanasDirectas);
      if (!semanas || semanas < 0) return setError("Ingresa tus semanas cotizadas.");
    } else {
      semanas = semanasDePeridos();
      if (semanas <= 0) return setError("Verifica tus periodos de empleo. Las fechas no son válidas.");
    }

    let res;
    if (regimen === "73") {
      res = calcularRegimen73({ sbc, semanas, edadActual: edad });
    } else {
      const saldo = parseFloat(saldoAfore) || 0;
      res = calcularRegimen97({ sbc, semanas, edadActual: edad, saldoAfore: saldo });
    }
    res.semanasTotales = semanas;
    setResultado(res);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }

  function addPeriodo() {
    setPeriodos([...periodos, { inicio: "", fin: "" }]);
  }
  function removePeriodo(i) {
    setPeriodos(periodos.filter((_, idx) => idx !== i));
  }
  function updatePeriodo(i, campo, val) {
    const copy = [...periodos];
    copy[i][campo] = val;
    setPeriodos(copy);
  }

  const semanasPreview = modoSemanas === "periodos" ? semanasDePeridos() : null;

  return (
    <div style={{ minHeight: "100vh", background: "#fafbff", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>

      {/* HEADER */}
      <header style={{
        position: "sticky", top: 12, zIndex: 100,
        display: "flex", justifyContent: "center", padding: "0 16px",
      }}>
        <div style={{
          background: "rgba(255,255,255,0.85)", backdropFilter: "blur(16px)",
          borderRadius: 100, padding: "12px 28px", display: "flex",
          alignItems: "center", gap: 24, boxShadow: "0 2px 24px rgba(24,71,240,0.10)",
          border: "1px solid rgba(24,71,240,0.10)",
        }}>
          <a href="/" style={{ fontWeight: 800, fontSize: 17, color: "#0a0f1e", textDecoration: "none" }}>
            Calculadora<span style={{ color: "#1847f0" }}>MX</span>
          </a>
          <nav style={{ display: "flex", gap: 18 }}>
            {[["Finiquito", "/finiquito"], ["Alimentos", "/pension-alimenticia"], ["IMSS", "/pension-imss"], ["Herencias", "/herencias"]].map(([l, h]) => (
              <a key={l} href={h} style={{
                fontSize: 13, fontWeight: 600, color: h === "/pension-imss" ? "#1847f0" : "#444",
                textDecoration: "none", borderBottom: h === "/pension-imss" ? "2px solid #1847f0" : "2px solid transparent",
                paddingBottom: 2,
              }}>{l}</a>
            ))}
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section style={{ textAlign: "center", padding: "60px 20px 0" }}>
        <div style={{
          display: "inline-block", background: "#eef0ff", color: "#1847f0",
          fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 100,
          letterSpacing: 1, marginBottom: 18,
        }}>GRATIS · SIN REGISTRO · PRIVADO</div>
        <h1 style={{
          fontSize: "clamp(28px, 6vw, 52px)", fontWeight: 900, lineHeight: 1.1,
          color: "#0a0f1e", margin: "0 0 16px",
        }}>
          Calculadora de<br />
          <span style={{ background: "linear-gradient(90deg,#1847f0,#6c8fff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Pensión IMSS
          </span>
        </h1>
        <p style={{ color: "#555", fontSize: 16, maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.6 }}>
          Descubre cuánto recibirás al jubilarte según tus semanas cotizadas,
          régimen (73 o 97) y salario. Resultado inmediato y gratuito.
        </p>
      </section>

      {/* CARD */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 16px 60px" }}>
        <div style={{
          background: "#fff", borderRadius: 20, padding: "32px 28px",
          boxShadow: "0 4px 40px rgba(24,71,240,0.08)",
          border: "1px solid rgba(24,71,240,0.08)",
        }}>

          {/* SECCIÓN 1: DATOS BÁSICOS */}
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0a0f1e", margin: "0 0 20px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ background: "#1847f0", color: "#fff", borderRadius: "50%", width: 26, height: 26, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900 }}>1</span>
            Datos básicos
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <Label tip="Fecha en que empezaste a cotizar por primera vez en el IMSS. Esto determina si eres Régimen 73 (antes del 1 julio 1997) o Régimen 97.">
                Primera cotización IMSS
              </Label>
              <input type="date" value={fechaPrimeraCot} onChange={e => setFechaPrimeraCot(e.target.value)} style={inp} max="2024-12-31" />
            </div>
            <div>
              <Label tip="Tu edad actual en años completos.">
                Edad actual
              </Label>
              <input type="number" placeholder="Ej. 45" value={edadActual} onChange={e => setEdadActual(e.target.value)} style={inp} min="16" max="100" />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <Label tip="El Salario Base de Cotización es el salario diario integrado que reporta tu patrón al IMSS. Incluye sueldo + partes proporcionales de gratificaciones, vacaciones, etc. Lo puedes ver en tu recibo de nómina o en tu AFORE.">
              Salario Base de Cotización (SBC) diario
            </Label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#888", fontWeight: 600 }}>$</span>
              <input type="number" placeholder="Ej. 450" value={sbcDiario} onChange={e => setSbcDiario(e.target.value)}
                style={{ ...inp, paddingLeft: 28 }} min="0" step="0.01" />
            </div>
            {sbcDiario && parseFloat(sbcDiario) > TOPE_SBC && (
              <p style={{ fontSize: 12, color: "#e07000", marginTop: 4 }}>
                ⚠️ El IMSS tiene un tope de {pesos(TOPE_SBC)}/día ({pesos(TOPE_SBC * 30.4)}/mes). El cálculo usará ese tope.
              </p>
            )}
          </div>

          {/* DETECCIÓN RÉGIMEN */}
          {regimen && (
            <div style={{
              background: regimen === "73" ? "#f0f4ff" : "#f0fff4",
              border: `1.5px solid ${regimen === "73" ? "#c7d4ff" : "#a3e4b3"}`,
              borderRadius: 12, padding: "12px 16px", marginBottom: 20,
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <span style={{ fontSize: 20 }}>{regimen === "73" ? "🏛️" : "💼"}</span>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#0a0f1e" }}>
                  Régimen {regimen} detectado
                </p>
                <p style={{ margin: 0, fontSize: 12, color: "#444" }}>
                  {regimen === "73"
                    ? "Tu primera cotización fue antes del 1 julio 1997. Tu pensión se calcula sobre el promedio salarial con cuantía básica IMSS."
                    : "Tu primera cotización fue después del 1 julio 1997. Tu pensión depende del saldo acumulado en tu AFORE."}
                </p>
              </div>
            </div>
          )}

          {/* SALDO AFORE si es régimen 97 */}
          {regimen === "97" && (
            <div style={{ marginBottom: 16 }}>
              <Label tip="Es el saldo total acumulado en tu cuenta individual de AFORE. Puedes consultarlo en la app de tu AFORE, en el portal SARWEB del CONSAR (sarweb.org.mx) o en tu estado de cuenta. Si no lo sabes, puedes dejar 0 y el cálculo proyectará solo tus aportaciones futuras.">
                Saldo actual en AFORE
              </Label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#888", fontWeight: 600 }}>$</span>
                <input type="number" placeholder="Ej. 250000 (escribe 0 si no lo sabes)" value={saldoAfore}
                  onChange={e => setSaldoAfore(e.target.value)} style={{ ...inp, paddingLeft: 28 }} min="0" />
              </div>
            </div>
          )}

          {/* SECCIÓN 2: SEMANAS */}
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0a0f1e", margin: "24px 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ background: "#1847f0", color: "#fff", borderRadius: "50%", width: 26, height: 26, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900 }}>2</span>
            Semanas cotizadas
            <Tip text="Las semanas cotizadas son las semanas que has estado dado de alta en el IMSS como trabajador asegurado. Puedes consultarlas en Mi IMSS (imss.gob.mx), en tu NSS o en tu AFORE." />
          </h2>

          {/* TOGGLE */}
          <div style={{ display: "flex", gap: 0, background: "#f0f2ff", borderRadius: 10, padding: 4, marginBottom: 20, width: "100%", boxSizing: "border-box" }}>
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
              <Label tip="Número total de semanas cotizadas acumuladas en el IMSS a lo largo de toda tu vida laboral. Puedes verlo en tu Constancia de Semanas Cotizadas en imss.gob.mx con tu NSS.">
                Total de semanas cotizadas
              </Label>
              <input type="number" placeholder="Ej. 650" value={semanasDirectas}
                onChange={e => setSemanasDirectas(e.target.value)} style={inp} min="0" />
              {semanasDirectas && (
                <p style={{ fontSize: 12, color: "#555", marginTop: 4 }}>
                  ≈ {semToAniosMeses(parseInt(semanasDirectas) || 0)} cotizados
                </p>
              )}
            </div>
          ) : (
            <div>
              <p style={{ fontSize: 13, color: "#555", marginBottom: 12 }}>
                Agrega cada periodo en que estuviste dado de alta en el IMSS. El sistema sumará las semanas automáticamente.
              </p>
              {periodos.map((p, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 10, marginBottom: 10, alignItems: "end" }}>
                  <div>
                    {i === 0 && <Label>Inicio</Label>}
                    <input type="date" value={p.inicio} onChange={e => updatePeriodo(i, "inicio", e.target.value)} style={inp} />
                  </div>
                  <div>
                    {i === 0 && <Label>Fin</Label>}
                    <input type="date" value={p.fin} onChange={e => updatePeriodo(i, "fin", e.target.value)} style={inp} />
                  </div>
                  <button onClick={() => removePeriodo(i)} disabled={periodos.length === 1}
                    style={{
                      background: "#ffe0e0", border: "none", borderRadius: 8, padding: "11px 14px",
                      color: "#c00", cursor: "pointer", fontWeight: 700, fontSize: 16,
                      opacity: periodos.length === 1 ? 0.3 : 1,
                    }}>×</button>
                </div>
              ))}
              <button onClick={addPeriodo} style={{
                background: "#f0f4ff", border: "1.5px dashed #1847f0", borderRadius: 10,
                padding: "10px 16px", color: "#1847f0", fontWeight: 700, fontSize: 13,
                cursor: "pointer", width: "100%", marginBottom: 8,
              }}>+ Agregar periodo</button>
              {semanasPreview > 0 && (
                <div style={{ background: "#f0f4ff", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#1847f0", fontWeight: 600 }}>
                  Total calculado: <strong>{semanasPreview} semanas</strong> ({semToAniosMeses(semanasPreview)})
                </div>
              )}
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div style={{ background: "#fff0f0", border: "1px solid #ffc0c0", borderRadius: 10, padding: "12px 16px", color: "#c00", fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          {/* BOTÓN */}
          <button onClick={calcular} style={{
            width: "100%", padding: "16px", background: "linear-gradient(90deg,#1847f0,#4a6fff)",
            color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 800,
            cursor: "pointer", marginTop: 8, letterSpacing: 0.3,
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
            {/* BADGE RÉGIMEN */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0a0f1e" }}>Tu resultado estimado</h3>
              <span style={{
                background: resultado.regimen === "73" ? "#e8edff" : "#e8fff0",
                color: resultado.regimen === "73" ? "#1847f0" : "#0a7a3a",
                fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 100,
              }}>Régimen {resultado.regimen}</span>
            </div>

            {/* PENSIÓN MENSUAL */}
            <div style={{
              background: "linear-gradient(135deg,#1847f0 0%,#4a6fff 100%)",
              borderRadius: 16, padding: "24px", textAlign: "center", marginBottom: 20,
              color: "#fff",
            }}>
              <p style={{ margin: "0 0 6px", fontSize: 13, opacity: 0.85 }}>Pensión mensual estimada</p>
              <p style={{ margin: 0, fontSize: "clamp(32px,8vw,48px)", fontWeight: 900, letterSpacing: -1 }}>
                {pesos(resultado.mensual)}
              </p>
              {resultado.regimen === "73" && (
                <p style={{ margin: "8px 0 0", fontSize: 12, opacity: 0.8 }}>
                  ({Math.round(resultado.pct * 100)}% de tu SBC promedio — cuantía básica IMSS)
                </p>
              )}
              {resultado.regimen === "97" && resultado.mensual <= resultado.pensionMinimaGarantizada + 1 && resultado.cumple && (
                <p style={{ margin: "8px 0 0", fontSize: 12, opacity: 0.8 }}>
                  Se aplica la Pensión Mínima Garantizada (1 UMA mensual ≈ {pesos(UMA_MENSUAL)})
                </p>
              )}
            </div>

            {/* SEMÁFORO */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>

              {/* Requisito mínimo */}
              <div style={{
                background: resultado.cumple ? "#f0fff4" : "#fff8f0",
                border: `1.5px solid ${resultado.cumple ? "#a3e4b3" : "#ffd0a0"}`,
                borderRadius: 14, padding: "16px",
              }}>
                <p style={{ margin: "0 0 4px", fontSize: 12, color: "#666", fontWeight: 600 }}>Requisito mínimo</p>
                <p style={{ margin: 0, fontSize: 20, fontWeight: 900, color: resultado.cumple ? "#0a7a3a" : "#c05000" }}>
                  {resultado.cumple ? "✅ Cumples" : "⚠️ Aún no"}
                </p>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "#555" }}>
                  {resultado.regimen === "73" ? "500 semanas + 60/65 años" : "1,250 semanas + 65 años"}
                </p>
              </div>

              {/* Semanas cotizadas */}
              <div style={{
                background: "#f0f4ff", border: "1.5px solid #dde0ff",
                borderRadius: 14, padding: "16px",
              }}>
                <p style={{ margin: "0 0 4px", fontSize: 12, color: "#666", fontWeight: 600 }}>Semanas cotizadas</p>
                <p style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#1847f0" }}>{resultado.semanasTotales}</p>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "#555" }}>≈ {semToAniosMeses(resultado.semanasTotales)}</p>
              </div>

              {/* Semanas faltantes */}
              {resultado.regimen === "73" ? (
                <>
                  <div style={{ background: "#fafbff", border: "1.5px solid #eee", borderRadius: 14, padding: "16px" }}>
                    <p style={{ margin: "0 0 4px", fontSize: 12, color: "#666", fontWeight: 600 }}>Para pensión vejez (65 años)</p>
                    {resultado.faltanParaVejez <= 0
                      ? <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0a7a3a" }}>✅ Ya puedes solicitarla</p>
                      : <>
                        <p style={{ margin: 0, fontSize: 18, fontWeight: 900, color: "#0a0f1e" }}>{resultado.faltanParaVejez} sem. más</p>
                        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#555" }}>≈ {semToAniosMeses(resultado.faltanParaVejez)}</p>
                        {fechaJubilacion(resultado.faltanParaVejez) && (
                          <p style={{ margin: "4px 0 0", fontSize: 12, color: "#1847f0", fontWeight: 600 }}>
                            📅 ~{fechaJubilacion(resultado.faltanParaVejez)}
                          </p>
                        )}
                      </>}
                  </div>
                  <div style={{ background: "#fafbff", border: "1.5px solid #eee", borderRadius: 14, padding: "16px" }}>
                    <p style={{ margin: "0 0 4px", fontSize: 12, color: "#666", fontWeight: 600 }}>Para cesantía (60 años)</p>
                    {resultado.faltanParaCesantia <= 0
                      ? <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0a7a3a" }}>✅ Ya puedes solicitarla</p>
                      : <>
                        <p style={{ margin: 0, fontSize: 18, fontWeight: 900, color: "#0a0f1e" }}>{resultado.faltanParaCesantia} sem. más</p>
                        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#555" }}>≈ {semToAniosMeses(resultado.faltanParaCesantia)}</p>
                        {fechaJubilacion(resultado.faltanParaCesantia) && (
                          <p style={{ margin: "4px 0 0", fontSize: 12, color: "#1847f0", fontWeight: 600 }}>
                            📅 ~{fechaJubilacion(resultado.faltanParaCesantia)}
                          </p>
                        )}
                      </>}
                  </div>
                </>
              ) : (
                <div style={{ background: "#fafbff", border: "1.5px solid #eee", borderRadius: 14, padding: "16px", gridColumn: "1 / -1" }}>
                  <p style={{ margin: "0 0 4px", fontSize: 12, color: "#666", fontWeight: 600 }}>Para pensión completa (65 años / 1,250 semanas)</p>
                  {resultado.faltanTotal <= 0
                    ? <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0a7a3a" }}>✅ Ya cumples los requisitos mínimos</p>
                    : <>
                      <p style={{ margin: 0, fontSize: 18, fontWeight: 900, color: "#0a0f1e" }}>{resultado.faltanTotal} semanas más</p>
                      <p style={{ margin: "4px 0 0", fontSize: 12, color: "#555" }}>≈ {semToAniosMeses(resultado.faltanTotal)}</p>
                      {fechaJubilacion(resultado.faltanTotal) && (
                        <p style={{ margin: "6px 0 0", fontSize: 13, color: "#1847f0", fontWeight: 700 }}>
                          📅 Fecha estimada de jubilación: {fechaJubilacion(resultado.faltanTotal)}
                        </p>
                      )}
                    </>}
                </div>
              )}

              {/* Saldo AFORE proyectado (solo régimen 97) */}
              {resultado.regimen === "97" && (
                <div style={{ background: "#f0f4ff", border: "1.5px solid #c7d4ff", borderRadius: 14, padding: "16px", gridColumn: "1 / -1" }}>
                  <p style={{ margin: "0 0 4px", fontSize: 12, color: "#666", fontWeight: 600 }}>Saldo AFORE proyectado al jubilarte</p>
                  <p style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#1847f0" }}>{pesos(resultado.saldoFV)}</p>
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: "#555" }}>
                    Proyección con rendimiento histórico promedio CONSAR de 4.5% real anual.
                  </p>
                </div>
              )}
            </div>

            {/* FUENTE LEGAL */}
            <div style={{
              background: "#f8f9ff", borderRadius: 12, padding: "14px 16px",
              borderLeft: "3px solid #1847f0", marginBottom: 16,
            }}>
              <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 700, color: "#1847f0" }}>📋 Fundamento legal</p>
              <p style={{ margin: 0, fontSize: 12, color: "#444", lineHeight: 1.6 }}>
                {resultado.regimen === "73"
                  ? "Ley del Seguro Social 1973 (abrogada, vigente para derechos adquiridos): Art. 167 (cuantía básica), Art. 162 (semanas mínimas vejez), Art. 128 (semanas mínimas cesantía). Tabla de cuantía básica: 10 años = 80%, +1.299% por año adicional."
                  : "Ley del Seguro Social 1997: Art. 154 (vejez, 1,250 semanas), Art. 159 (pensión mínima garantizada = 1 UMA mensual). Rendimiento de referencia: CONSAR, rendimiento histórico neto del sistema 2000–2024."}
              </p>
            </div>

            {/* DISCLAIMER */}
            <div style={{
              background: "#fffbf0", border: "1px solid #ffe0a0",
              borderRadius: 12, padding: "14px 16px",
            }}>
              <p style={{ margin: 0, fontSize: 12, color: "#7a5500", lineHeight: 1.6 }}>
                ⚠️ <strong>Estimación orientativa.</strong> El cálculo real puede variar según tu historial completo de semanas, salarios registrados, semanas en múltiples empleos simultáneos, o beneficios adicionales (invalidez, viudez, guarderías). Consulta tu NSS en <strong>imss.gob.mx</strong> o acude a una Subdelegación IMSS para una cifra oficial. Esto no es asesoría previsional profesional.
              </p>
            </div>
          </div>
        )}

        {/* CHIPS */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginTop: 32 }}>
          {[["💼 Finiquito", "/finiquito"], ["👧 Pensión Alimenticia", "/pension-alimenticia"], ["📋 Herencias", "/herencias"]].map(([l, h]) => (
            <a key={h} href={h} style={{
              background: "#fff", border: "1.5px solid #dde0ff", borderRadius: 100,
              padding: "8px 18px", fontSize: 13, fontWeight: 600, color: "#1847f0",
              textDecoration: "none",
            }}>{l}</a>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        input:focus { border-color: #1847f0 !important; box-shadow: 0 0 0 3px rgba(24,71,240,0.10); }
        @media (max-width: 500px) {
          nav { display: none !important; }
        }
      `}</style>
    </div>
  );
}