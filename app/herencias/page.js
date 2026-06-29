"use client";
import { useState, useRef } from "react";

/* ─── TOOLTIP ─── */
function Tip({ text }) {
  const [open, setOpen] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-block", marginLeft: 6 }}>
      <button onClick={() => setOpen(v => !v)} style={{
        background: "#e8eaff", border: "none", borderRadius: "50%", width: 20, height: 20,
        fontSize: 11, fontWeight: 700, color: "#1847f0", cursor: "pointer",
        padding: 0, display: "inline-flex", alignItems: "center", justifyContent: "center",
      }}>?</button>
      {open && (
        <span style={{
          position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)",
          background: "#0a0f1e", color: "#fff", fontSize: 12, lineHeight: 1.5,
          padding: "10px 14px", borderRadius: 10, width: 250, zIndex: 999,
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)", whiteSpace: "normal",
        }}>
          {text}
          <span style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", border: "6px solid transparent", borderTopColor: "#0a0f1e" }} />
        </span>
      )}
    </span>
  );
}

function Label({ children, tip }) {
  return (
    <label style={{ display: "flex", alignItems: "center", fontWeight: 600, fontSize: 14, color: "#0a0f1e", marginBottom: 6 }}>
      {children}{tip && <Tip text={tip} />}
    </label>
  );
}

const inp = {
  width: "100%", padding: "12px 14px", borderRadius: 10,
  border: "1.5px solid #dde0ff", fontSize: 15, outline: "none",
  background: "#fafbff", color: "#0a0f1e", boxSizing: "border-box", fontFamily: "inherit",
};

/* ─── LÓGICA LEGAL ─── */
function calcularIntestataria({ bienes, deudas, familia }) {
  const masa = Math.max(0, bienes - deudas);
  const { hijos, nietos, conyuge, padres, abuelos, hermanos, sobrinos, tios, concubino } = familia;
  let herederos = [], explicacion = "", grado = "";

  if (hijos > 0) {
    grado = "1° grado — Descendientes";
    if (conyuge) {
      const partes = hijos + 1;
      for (let i = 1; i <= hijos; i++) herederos.push({ nombre: `Hijo ${i}`, monto: masa / partes, pct: 100 / partes });
      herederos.push({ nombre: "Cónyuge", monto: masa / partes, pct: 100 / partes });
      explicacion = `Con hijos vivos, el cónyuge hereda una parte igual a la de cada hijo (Art. 1624 CCF). La herencia se divide en ${partes} partes iguales.`;
    } else {
      for (let i = 1; i <= hijos; i++) herederos.push({ nombre: `Hijo ${i}`, monto: masa / hijos, pct: 100 / hijos });
      explicacion = `Los hijos heredan en partes iguales (Art. 1602 CCF). Sin cónyuge, no hay concurrencia.`;
    }
  } else if (nietos > 0) {
    grado = "1° grado — Descendientes (nietos por representación)";
    const partes = conyuge ? nietos + 1 : nietos;
    for (let i = 1; i <= nietos; i++) herederos.push({ nombre: `Nieto ${i}`, monto: masa / partes, pct: 100 / partes });
    if (conyuge) herederos.push({ nombre: "Cónyuge", monto: masa / partes, pct: 100 / partes });
    explicacion = `Los nietos heredan por derecho de representación cuando los hijos han fallecido (Art. 1609 CCF).`;
  } else if (padres > 0 || abuelos > 0) {
    grado = "2° grado — Ascendientes";
    const totalAsc = padres + abuelos;
    if (conyuge) {
      const mitad = masa * 0.5;
      for (let i = 1; i <= padres; i++) herederos.push({ nombre: `Padre/Madre ${i}`, monto: mitad / totalAsc, pct: 50 / totalAsc });
      for (let i = 1; i <= abuelos; i++) herederos.push({ nombre: `Abuelo/a ${i}`, monto: mitad / totalAsc, pct: 50 / totalAsc });
      herederos.push({ nombre: "Cónyuge", monto: masa * 0.5, pct: 50 });
      explicacion = `Sin hijos, el cónyuge concurre con los ascendientes: 50% para el cónyuge y 50% para los ascendientes en partes iguales (Art. 1625 CCF).`;
    } else {
      for (let i = 1; i <= padres; i++) herederos.push({ nombre: `Padre/Madre ${i}`, monto: masa / totalAsc, pct: 100 / totalAsc });
      for (let i = 1; i <= abuelos; i++) herederos.push({ nombre: `Abuelo/a ${i}`, monto: masa / totalAsc, pct: 100 / totalAsc });
      explicacion = `Sin hijos ni cónyuge, heredan los ascendientes en partes iguales (Art. 1606 CCF).`;
    }
  } else if (conyuge) {
    grado = "3° grado — Cónyuge supérstite";
    herederos.push({ nombre: "Cónyuge", monto: masa, pct: 100 });
    explicacion = `Sin descendientes ni ascendientes, el cónyuge hereda la totalidad (Art. 1624 CCF).`;
  } else if (hermanos > 0 || sobrinos > 0 || tios > 0) {
    grado = "4° grado — Colaterales";
    let pool = hermanos > 0
      ? Array.from({ length: hermanos }, (_, i) => `Hermano/a ${i + 1}`)
      : sobrinos > 0
        ? Array.from({ length: sobrinos }, (_, i) => `Sobrino/a ${i + 1}`)
        : Array.from({ length: tios }, (_, i) => `Tío/a ${i + 1}`);
    pool.forEach(n => herederos.push({ nombre: n, monto: masa / pool.length, pct: 100 / pool.length }));
    explicacion = `Sin descendientes, ascendientes ni cónyuge, heredan los colaterales. Los hermanos tienen preferencia sobre sobrinos y tíos (Arts. 1612–1615 CCF).`;
  } else if (concubino) {
    grado = "5° grado — Concubino/a";
    herederos.push({ nombre: "Concubino/a", monto: masa, pct: 100 });
    explicacion = `El concubino/a tiene derechos hereditarios equivalentes al cónyuge si convivieron al menos 2 años o tuvieron hijos en común (Art. 1635 CCF).`;
  } else {
    grado = "6° grado — Beneficencia Pública";
    herederos.push({ nombre: "Beneficencia Pública (Estado)", monto: masa, pct: 100 });
    explicacion = `Sin herederos en ningún grado, la herencia pasa a la Beneficencia Pública (Art. 1636 CCF).`;
  }
  return { herederos, explicacion, grado, masa };
}

function calcularTestamentaria({ bienes, deudas, legatarios }) {
  const masa = Math.max(0, bienes - deudas);
  const totalPct = legatarios.reduce((s, l) => s + (parseFloat(l.pct) || 0), 0);
  const herederos = legatarios.map(l => ({
    nombre: l.nombre || "Heredero",
    pct: parseFloat(l.pct) || 0,
    monto: masa * ((parseFloat(l.pct) || 0) / 100),
  }));
  return { herederos, masa, totalPct };
}

function calcularCostos(masa) {
  const notarial = masa * 0.015;
  const gastos = masa < 1000000 ? 15000 : masa < 5000000 ? 30000 : 50000;
  return { notarial, gastos, total: notarial + gastos };
}

function tiempoEstimado(tipo, numHerederos) {
  if (tipo === "testamentaria") return { min: 3, max: 8, nota: "Con testamento en orden y herederos de acuerdo, el proceso notarial puede resolverse en 3–8 meses." };
  if (numHerederos > 5) return { min: 12, max: 36, nota: "Con muchos herederos el proceso puede extenderse hasta 3 años si hay desacuerdos entre las partes." };
  return { min: 6, max: 18, nota: "La intestamentaria requiere juicio sucesorio o proceso notarial. Sin conflictos, puede resolverse en 6–18 meses." };
}

function pesos(n) { return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n); }
function fmt(n) { return `${n.toFixed(1)}%`; }

const DEUDAS_SI = [
  { e: "🏠", n: "Hipoteca", d: "El inmueble se hereda con la deuda pendiente. El heredero puede pagar, refinanciar o vender." },
  { e: "💳", n: "Créditos bancarios o personales", d: "Se pagan del patrimonio antes de repartir. Los herederos no responden con su propio dinero." },
  { e: "🏛️", n: "Deudas fiscales (SAT)", d: "Tienen preferencia de cobro sobre otros acreedores y se descuentan antes de repartir." },
  { e: "⚕️", n: "Gastos de última enfermedad y funerarios", d: "Por ley se descuentan primero del patrimonio (Art. 1755 CCF)." },
];
const DEUDAS_NO = [
  "Pensión alimenticia que el fallecido debía pagar",
  "Multas administrativas o penales personales",
  "Contratos personalísimos (servicios intransferibles)",
  "Obligaciones exclusivas del fallecido por título personal",
];

export default function Herencias() {
  const [tipo, setTipo] = useState("");
  const [bienes, setBienes] = useState("");
  const [deudas, setDeudas] = useState("");
  const [mostrarDeudas, setMostrarDeudas] = useState(false);
  const [familia, setFamilia] = useState({ hijos: 0, nietos: 0, conyuge: false, padres: 0, abuelos: 0, hermanos: 0, sobrinos: 0, tios: 0, concubino: false });
  const [legatarios, setLegatarios] = useState([{ nombre: "", pct: "" }]);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");
  const resultRef = useRef(null);

  function updFam(k, v) { setFamilia(p => ({ ...p, [k]: v })); }
  function addLeg() { setLegatarios([...legatarios, { nombre: "", pct: "" }]); }
  function remLeg(i) { setLegatarios(legatarios.filter((_, j) => j !== i)); }
  function updLeg(i, k, v) { const c = [...legatarios]; c[i] = { ...c[i], [k]: v }; setLegatarios(c); }

  function calcular() {
    setError(""); setResultado(null);
    const b = parseFloat(bienes), d = parseFloat(deudas) || 0;
    if (!tipo) return setError("Selecciona si hay testamento o no.");
    if (!b || b <= 0) return setError("Ingresa el valor total de los bienes.");
    let res;
    if (tipo === "intestamentaria") {
      res = calcularIntestataria({ bienes: b, deudas: d, familia });
      res.tipo = "intestamentaria";
    } else {
      const r = calcularTestamentaria({ bienes: b, deudas: d, legatarios });
      if (Math.abs(r.totalPct - 100) > 0.01) return setError(`Los porcentajes deben sumar 100%. Actualmente suman ${r.totalPct.toFixed(1)}%.`);
      res = { ...r, tipo: "testamentaria", explicacion: "La herencia se reparte según lo establecido en el testamento (Art. 1295 CCF).", grado: "Testamentaria" };
    }
    res.costos = calcularCostos(res.masa);
    res.tiempo = tiempoEstimado(tipo, res.herederos.length);
    setResultado(res);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }

  const totalPct = legatarios.reduce((s, l) => s + (parseFloat(l.pct) || 0), 0);

  return (
    <div style={{ minHeight: "100vh", background: "#fafbff", fontFamily: "'Inter','Segoe UI',sans-serif" }}>

      <header style={{ position: "sticky", top: 12, zIndex: 100, display: "flex", justifyContent: "center", padding: "0 16px" }}>
        <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(16px)", borderRadius: 100, padding: "12px 28px", display: "flex", alignItems: "center", gap: 24, boxShadow: "0 2px 24px rgba(24,71,240,0.10)", border: "1px solid rgba(24,71,240,0.10)" }}>
          <a href="/" style={{ fontWeight: 800, fontSize: 17, color: "#0a0f1e", textDecoration: "none" }}>Calculadora<span style={{ color: "#1847f0" }}>MX</span></a>
          <nav style={{ display: "flex", gap: 18 }}>
            {[["Finiquito", "/finiquito"], ["Alimentos", "/pension-alimenticia"], ["IMSS", "/pension-imss"], ["Herencias", "/herencias"]].map(([l, h]) => (
              <a key={l} href={h} style={{ fontSize: 13, fontWeight: 600, color: h === "/herencias" ? "#1847f0" : "#444", textDecoration: "none", borderBottom: h === "/herencias" ? "2px solid #1847f0" : "2px solid transparent", paddingBottom: 2 }}>{l}</a>
            ))}
          </nav>
        </div>
      </header>

      <section style={{ textAlign: "center", padding: "60px 20px 0" }}>
        <div style={{ display: "inline-block", background: "#eef0ff", color: "#1847f0", fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 100, letterSpacing: 1, marginBottom: 18 }}>GRATIS · SIN REGISTRO · PRIVADO</div>
        <h1 style={{ fontSize: "clamp(28px,6vw,52px)", fontWeight: 900, lineHeight: 1.1, color: "#0a0f1e", margin: "0 0 16px" }}>
          Calculadora de<br />
          <span style={{ background: "linear-gradient(90deg,#1847f0,#6c8fff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Herencias en México</span>
        </h1>
        <p style={{ color: "#555", fontSize: 16, maxWidth: 540, margin: "0 auto 40px", lineHeight: 1.6 }}>
          Calcula quién hereda y cuánto según la ley mexicana. Con o sin testamento, incluyendo costos notariales y tiempo estimado del proceso.
        </p>
      </section>

      <div style={{ maxWidth: 660, margin: "0 auto", padding: "0 16px 60px" }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "32px 28px", boxShadow: "0 4px 40px rgba(24,71,240,0.08)", border: "1px solid rgba(24,71,240,0.08)" }}>

          {/* 1 — TIPO */}
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0a0f1e", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ background: "#1847f0", color: "#fff", borderRadius: "50%", width: 26, height: 26, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900 }}>1</span>
            ¿Hay testamento?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
            {[["intestamentaria", "❌ Sin testamento", "El notario o juez determina quién hereda según el Código Civil Federal."], ["testamentaria", "✅ Con testamento", "El fallecido dejó por escrito cómo repartir sus bienes ante notario."]].map(([v, t, d]) => (
              <button key={v} onClick={() => setTipo(v)} style={{ background: tipo === v ? "#f0f4ff" : "#fafbff", border: `2px solid ${tipo === v ? "#1847f0" : "#e0e4ff"}`, borderRadius: 14, padding: "16px", cursor: "pointer", textAlign: "left" }}>
                <p style={{ margin: "0 0 4px", fontWeight: 800, fontSize: 15, color: tipo === v ? "#1847f0" : "#0a0f1e" }}>{t}</p>
                <p style={{ margin: 0, fontSize: 12, color: "#555", lineHeight: 1.4 }}>{d}</p>
              </button>
            ))}
          </div>

          {/* 2 — BIENES */}
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0a0f1e", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ background: "#1847f0", color: "#fff", borderRadius: "50%", width: 26, height: 26, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900 }}>2</span>
            Valor total de los bienes
            <Tip text="Suma el valor aproximado de todo lo que dejó el fallecido: inmuebles, cuentas bancarias, vehículos, inversiones, negocios, etc." />
          </h2>
          <div style={{ marginBottom: 8 }}>
            <Label>Valor total del patrimonio</Label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#888", fontWeight: 600 }}>$</span>
              <input type="number" placeholder="Ej. 2500000" value={bienes} onChange={e => setBienes(e.target.value)} style={{ ...inp, paddingLeft: 28 }} min="0" />
            </div>
            {bienes && <p style={{ fontSize: 12, color: "#555", marginTop: 4 }}>= {pesos(parseFloat(bienes) || 0)}</p>}
          </div>

          <button onClick={() => setMostrarDeudas(!mostrarDeudas)} style={{ background: "none", border: "none", color: "#1847f0", fontSize: 13, fontWeight: 700, cursor: "pointer", padding: "8px 0", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            {mostrarDeudas ? "▲ Ocultar" : "▼ Agregar"} deudas del fallecido
          </button>

          {mostrarDeudas && (
            <div style={{ background: "#fff8f0", border: "1.5px solid #ffd0a0", borderRadius: 14, padding: "18px", marginBottom: 16 }}>
              <p style={{ margin: "0 0 12px", fontWeight: 800, fontSize: 13, color: "#7a3500" }}>⚠️ Deudas que sí afectan la herencia</p>
              {DEUDAS_SI.map((d, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 18, marginTop: 1 }}>{d.e}</span>
                  <div>
                    <p style={{ margin: "0 0 2px", fontWeight: 700, fontSize: 13, color: "#0a0f1e" }}>{d.n}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "#555", lineHeight: 1.4 }}>{d.d}</p>
                  </div>
                </div>
              ))}
              <div style={{ background: "#f0fff4", border: "1px solid #a3e4b3", borderRadius: 10, padding: "12px 14px", margin: "12px 0" }}>
                <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 12, color: "#0a7a3a" }}>✅ Deudas que NO se heredan</p>
                {DEUDAS_NO.map((d, i) => <p key={i} style={{ margin: "2px 0", fontSize: 12, color: "#333" }}>• {d}</p>)}
              </div>
              <Label tip="Suma solo las deudas aplicables: hipoteca pendiente, créditos bancarios, deudas SAT, gastos médicos y funerarios.">Total de deudas aplicables</Label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#888", fontWeight: 600 }}>$</span>
                <input type="number" placeholder="Ej. 400000" value={deudas} onChange={e => setDeudas(e.target.value)} style={{ ...inp, paddingLeft: 28 }} min="0" />
              </div>
              {bienes && deudas && (
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1847f0", marginTop: 8 }}>
                  Masa hereditaria neta: {pesos(Math.max(0, parseFloat(bienes) - parseFloat(deudas)))}
                </p>
              )}
            </div>
          )}

          {/* 3 — FAMILIA o TESTAMENTO */}
          {tipo === "intestamentaria" && (
            <>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0a0f1e", margin: "8px 0 6px", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ background: "#1847f0", color: "#fff", borderRadius: "50%", width: 26, height: 26, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900 }}>3</span>
                Familia del fallecido
                <Tip text="El Código Civil Federal establece un orden estricto: los herederos de mayor grado excluyen a los de menor. Llena solo los familiares vivos al momento del fallecimiento." />
              </h2>
              <p style={{ fontSize: 12, color: "#777", marginBottom: 16 }}>Los de mayor jerarquía excluyen a los de menor. Llena solo los que había vivos.</p>

              {[
                { titulo: "👶 Descendientes (1° prioridad)", campos: [
                  { k: "hijos", l: "Hijos vivos", tip: "Hijos directos del fallecido, vivos al momento del deceso.", max: 20 },
                  { k: "nietos", l: "Nietos (si algún hijo murió)", tip: "Solo cuentan si el hijo correspondiente también falleció (derecho de representación, Art. 1609 CCF).", max: 30 },
                ]},
                { titulo: "👴 Ascendientes (2° prioridad — si no hay hijos)", campos: [
                  { k: "padres", l: "Padres vivos", tip: "Padre y/o madre del fallecido, vivos al momento del deceso.", max: 2 },
                  { k: "abuelos", l: "Abuelos vivos", tip: "Solo heredan si los padres también fallecieron.", max: 4 },
                ]},
              ].map(({ titulo, campos }) => (
                <div key={titulo} style={{ background: "#f8f9ff", borderRadius: 12, padding: "16px", marginBottom: 12 }}>
                  <p style={{ margin: "0 0 12px", fontWeight: 800, fontSize: 13, color: "#1847f0" }}>{titulo}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {campos.map(({ k, l, tip, max }) => (
                      <div key={k}>
                        <Label tip={tip}>{l}</Label>
                        <input type="number" min="0" max={max} value={familia[k]} onChange={e => updFam(k, parseInt(e.target.value) || 0)} style={inp} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div style={{ background: "#f8f9ff", borderRadius: 12, padding: "16px", marginBottom: 12 }}>
                <p style={{ margin: "0 0 12px", fontWeight: 800, fontSize: 13, color: "#1847f0" }}>💍 Cónyuge</p>
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <input type="checkbox" checked={familia.conyuge} onChange={e => updFam("conyuge", e.target.checked)} style={{ width: 18, height: 18, accentColor: "#1847f0", cursor: "pointer" }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#0a0f1e" }}>Había cónyuge al momento del fallecimiento</span>
                  <Tip text="El cónyuge concurre con hijos (recibe parte igual a un hijo) y con ascendientes (recibe 50%). Sin descendientes ni ascendientes, hereda todo." />
                </label>
              </div>

              <div style={{ background: "#f8f9ff", borderRadius: 12, padding: "16px", marginBottom: 12 }}>
                <p style={{ margin: "0 0 12px", fontWeight: 800, fontSize: 13, color: "#1847f0" }}>👥 Colaterales (3° prioridad — si no hay descendientes, ascendientes ni cónyuge)</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  {[
                    { k: "hermanos", l: "Hermanos", tip: "Tienen prioridad sobre sobrinos y tíos.", max: 20 },
                    { k: "sobrinos", l: "Sobrinos", tip: "Hijos de hermanos fallecidos. Heredan por representación si el hermano murió.", max: 30 },
                    { k: "tios", l: "Tíos", tip: "Hermanos de los padres del fallecido. Son el último grado de colaterales reconocido.", max: 20 },
                  ].map(({ k, l, tip, max }) => (
                    <div key={k}>
                      <Label tip={tip}>{l}</Label>
                      <input type="number" min="0" max={max} value={familia[k]} onChange={e => updFam(k, parseInt(e.target.value) || 0)} style={inp} />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: "#f8f9ff", borderRadius: 12, padding: "16px", marginBottom: 16 }}>
                <p style={{ margin: "0 0 12px", fontWeight: 800, fontSize: 13, color: "#1847f0" }}>🤝 Concubino/a (4° prioridad — si no hay ningún familiar anterior)</p>
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <input type="checkbox" checked={familia.concubino} onChange={e => updFam("concubino", e.target.checked)} style={{ width: 18, height: 18, accentColor: "#1847f0", cursor: "pointer" }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#0a0f1e" }}>Había concubino/a</span>
                  <Tip text="Derechos hereditarios equivalentes al cónyuge si convivieron al menos 2 años o tuvieron hijos en común, sin impedimento para casarse (Art. 1635 CCF)." />
                </label>
              </div>
            </>
          )}

          {tipo === "testamentaria" && (
            <>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0a0f1e", margin: "8px 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ background: "#1847f0", color: "#fff", borderRadius: "50%", width: 26, height: 26, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900 }}>3</span>
                Herederos según el testamento
                <Tip text="Agrega a cada heredero con el porcentaje que le corresponde. El total debe sumar exactamente 100%." />
              </h2>
              {legatarios.map((l, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 10, marginBottom: 10, alignItems: "end" }}>
                  <div>
                    {i === 0 && <Label>Nombre del heredero</Label>}
                    <input type="text" placeholder="Ej. María García" value={l.nombre} onChange={e => updLeg(i, "nombre", e.target.value)} style={inp} />
                  </div>
                  <div style={{ width: 90 }}>
                    {i === 0 && <Label>%</Label>}
                    <div style={{ position: "relative" }}>
                      <input type="number" placeholder="50" min="0" max="100" value={l.pct} onChange={e => updLeg(i, "pct", e.target.value)} style={{ ...inp, paddingRight: 28 }} />
                      <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#888", fontSize: 13 }}>%</span>
                    </div>
                  </div>
                  <button onClick={() => remLeg(i)} disabled={legatarios.length === 1} style={{ background: "#ffe0e0", border: "none", borderRadius: 8, padding: "11px 14px", color: "#c00", cursor: "pointer", fontWeight: 700, fontSize: 16, opacity: legatarios.length === 1 ? 0.3 : 1 }}>×</button>
                </div>
              ))}
              <button onClick={addLeg} style={{ background: "#f0f4ff", border: "1.5px dashed #1847f0", borderRadius: 10, padding: "10px 16px", color: "#1847f0", fontWeight: 700, fontSize: 13, cursor: "pointer", width: "100%", marginBottom: 10 }}>+ Agregar heredero</button>
              <div style={{ background: Math.abs(totalPct - 100) < 0.01 ? "#f0fff4" : totalPct > 100 ? "#fff0f0" : "#f8f9ff", border: `1.5px solid ${Math.abs(totalPct - 100) < 0.01 ? "#a3e4b3" : totalPct > 100 ? "#ffc0c0" : "#dde0ff"}`, borderRadius: 10, padding: "10px 14px", fontSize: 13, fontWeight: 700, marginBottom: 16, color: Math.abs(totalPct - 100) < 0.01 ? "#0a7a3a" : totalPct > 100 ? "#c00" : "#555" }}>
                Total asignado: {totalPct.toFixed(1)}%{Math.abs(totalPct - 100) < 0.01 ? " ✅ Correcto" : totalPct > 100 ? " ⚠️ Excede 100%" : ` — faltan ${(100 - totalPct).toFixed(1)}%`}
              </div>
            </>
          )}

          {error && <div style={{ background: "#fff0f0", border: "1px solid #ffc0c0", borderRadius: 10, padding: "12px 16px", color: "#c00", fontSize: 13, marginBottom: 16 }}>{error}</div>}

          <button onClick={calcular} style={{ width: "100%", padding: "16px", background: "linear-gradient(90deg,#1847f0,#4a6fff)", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: "pointer", letterSpacing: 0.3, boxShadow: "0 4px 20px rgba(24,71,240,0.25)" }}>
            Calcular herencia →
          </button>
        </div>

        {/* RESULTADO */}
        {resultado && (
          <div ref={resultRef} style={{ background: "#fff", borderRadius: 20, padding: "32px 28px", marginTop: 24, boxShadow: "0 4px 40px rgba(24,71,240,0.10)", border: "1.5px solid rgba(24,71,240,0.15)", animation: "fadeUp 0.4s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0a0f1e" }}>Resultado de la herencia</h3>
              <span style={{ background: "#e8edff", color: "#1847f0", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 100 }}>{resultado.tipo === "intestamentaria" ? "Sin testamento" : "Con testamento"}</span>
            </div>

            <div style={{ background: "linear-gradient(135deg,#1847f0,#4a6fff)", borderRadius: 16, padding: "20px 24px", marginBottom: 20, color: "#fff" }}>
              <p style={{ margin: "0 0 4px", fontSize: 13, opacity: 0.85 }}>Masa hereditaria neta a repartir</p>
              <p style={{ margin: "0 0 8px", fontSize: "clamp(28px,7vw,44px)", fontWeight: 900, letterSpacing: -1 }}>{pesos(resultado.masa)}</p>
              {parseFloat(deudas) > 0 && <p style={{ margin: 0, fontSize: 12, opacity: 0.8 }}>Bienes {pesos(parseFloat(bienes))} − Deudas {pesos(parseFloat(deudas))} = {pesos(resultado.masa)}</p>}
            </div>

            {resultado.tipo === "intestamentaria" && (
              <div style={{ background: "#f0f4ff", border: "1.5px solid #c7d4ff", borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
                <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 700, color: "#1847f0" }}>⚖️ {resultado.grado}</p>
                <p style={{ margin: 0, fontSize: 13, color: "#333", lineHeight: 1.6 }}>{resultado.explicacion}</p>
              </div>
            )}

            <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0a0f1e", margin: "0 0 12px" }}>Distribución de la herencia</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {resultado.herederos.map((h, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fafbff", border: "1.5px solid #e8eaff", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#1847f0", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 14, flexShrink: 0 }}>{h.nombre[0]}</div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#0a0f1e" }}>{h.nombre}</p>
                      <p style={{ margin: 0, fontSize: 12, color: "#777" }}>{fmt(h.pct)} de la herencia</p>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontWeight: 900, fontSize: 18, color: "#1847f0" }}>{pesos(h.monto)}</p>
                </div>
              ))}
            </div>

            <div style={{ background: "#f0fff4", border: "1.5px solid #a3e4b3", borderRadius: 12, padding: "14px 16px", marginBottom: 12 }}>
              <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 800, color: "#0a7a3a" }}>✅ ISR: Las herencias están exentas de impuesto</p>
              <p style={{ margin: 0, fontSize: 12, color: "#333", lineHeight: 1.5 }}>El heredero no paga ISR por recibir la herencia (Art. 93 fr. XIX LISR). <strong>Excepción:</strong> si después vende un bien heredado, sí paga ISR sobre la ganancia de esa venta.</p>
            </div>

            <div style={{ background: "#fff8f0", border: "1.5px solid #ffd0a0", borderRadius: 12, padding: "14px 16px", marginBottom: 12 }}>
              <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 800, color: "#7a3500" }}>💰 Costos estimados del proceso</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {[["Honorarios notariales", pesos(resultado.costos.notarial), "~1.5% del patrimonio"], ["Gastos del proceso", pesos(resultado.costos.gastos), "Trámites, certificados, derechos"], ["Total estimado", pesos(resultado.costos.total), "Estimación referencial"]].map(([t, m, s], i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.6)", borderRadius: 10, padding: "12px" }}>
                    <p style={{ margin: "0 0 4px", fontSize: 11, color: "#7a3500", fontWeight: 700 }}>{t}</p>
                    <p style={{ margin: "0 0 2px", fontSize: 16, fontWeight: 900, color: "#0a0f1e" }}>{m}</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#777" }}>{s}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#f0f4ff", border: "1.5px solid #c7d4ff", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
              <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 800, color: "#1847f0" }}>🕐 Tiempo estimado: {resultado.tiempo.min}–{resultado.tiempo.max} meses</p>
              <p style={{ margin: 0, fontSize: 12, color: "#444", lineHeight: 1.5 }}>{resultado.tiempo.nota}</p>
            </div>

            <div style={{ background: "#f8f9ff", borderRadius: 12, padding: "14px 16px", borderLeft: "3px solid #1847f0", marginBottom: 16 }}>
              <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 700, color: "#1847f0" }}>📋 Fundamento legal</p>
              <p style={{ margin: 0, fontSize: 12, color: "#444", lineHeight: 1.6 }}>
                {resultado.tipo === "intestamentaria"
                  ? "Código Civil Federal: Arts. 1599–1636 (sucesión legítima y orden de herederos). Art. 1755 (gastos preferentes). Art. 93 fr. XIX LISR (exención ISR)."
                  : "Código Civil Federal: Arts. 1295–1350 (testamento y disposiciones testamentarias). Art. 93 fr. XIX LISR (exención ISR)."}
              </p>
            </div>

            <div style={{ background: "#fffbf0", border: "1px solid #ffe0a0", borderRadius: 12, padding: "14px 16px" }}>
              <p style={{ margin: 0, fontSize: 12, color: "#7a5500", lineHeight: 1.6 }}>⚠️ <strong>Estimación orientativa.</strong> Cada herencia es diferente. Los costos y tiempos varían por estado, complejidad y acuerdos entre herederos. Consulta a un notario público o abogado especialista en sucesiones para asesoría oficial.</p>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginTop: 32 }}>
          {[["💼 Finiquito", "/finiquito"], ["👧 Pensión Alimenticia", "/pension-alimenticia"], ["🏛️ IMSS", "/pension-imss"]].map(([l, h]) => (
            <a key={h} href={h} style={{ background: "#fff", border: "1.5px solid #dde0ff", borderRadius: 100, padding: "8px 18px", fontSize: 13, fontWeight: 600, color: "#1847f0", textDecoration: "none" }}>{l}</a>
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