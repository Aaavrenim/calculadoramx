"use client";
import { useState, useRef } from "react";

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
  width: "100%", padding: "11px 14px", borderRadius: 10,
  border: "1.5px solid #dde0ff", fontSize: 14, outline: "none",
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

const CATEGORIAS_BIENES = [
  { k: "inmuebles",   e: "🏠", l: "Inmuebles",         tip: "Casas, departamentos, terrenos, locales comerciales. Usa el valor catastral o el precio de mercado aproximado." },
  { k: "cuentas",     e: "🏦", l: "Cuentas bancarias", tip: "Saldo total en cuentas de cheques, ahorro, nómina u otras cuentas bancarias." },
  { k: "vehiculos",   e: "🚗", l: "Vehículos",         tip: "Autos, camionetas, motocicletas u otros vehículos. Usa el valor de mercado actual." },
  { k: "inversiones", e: "📈", l: "Inversiones",       tip: "Acciones, fondos de inversión, CETES, AFORE, seguros de vida con valor en efectivo, etc." },
  { k: "negocios",    e: "🏢", l: "Negocios",          tip: "Valor de participación en empresas, negocios propios o sociedades." },
  { k: "otros",       e: "📦", l: "Otros bienes",      tip: "Joyas, arte, maquinaria, derechos, créditos a favor, y cualquier otro bien de valor." },
];

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
  const [bienesDetalle, setBienesDetalle] = useState({ inmuebles: "", cuentas: "", vehiculos: "", inversiones: "", negocios: "", otros: "" });
  const [deudas, setDeudas] = useState("");
  const [mostrarDeudas, setMostrarDeudas] = useState(false);
  const [familia, setFamilia] = useState({ hijos: 0, nietos: 0, conyuge: false, padres: 0, abuelos: 0, hermanos: 0, sobrinos: 0, tios: 0, concubino: false });
  const [legatarios, setLegatarios] = useState([{ nombre: "", pct: "" }]);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");
  const resultRef = useRef(null);

  const bienes = Object.values(bienesDetalle).reduce((s, v) => s + (parseFloat(v) || 0), 0);
  function updBien(k, v) { setBienesDetalle(p => ({ ...p, [k]: v })); }
  function updFam(k, v) { setFamilia(p => ({ ...p, [k]: v })); }
  function addLeg() { setLegatarios([...legatarios, { nombre: "", pct: "" }]); }
  function remLeg(i) { setLegatarios(legatarios.filter((_, j) => j !== i)); }
  function updLeg(i, k, v) { const c = [...legatarios]; c[i] = { ...c[i], [k]: v }; setLegatarios(c); }

  function calcular() {
    setError(""); setResultado(null);
    const d = parseFloat(deudas) || 0;
    if (!tipo) return setError("Selecciona si hay testamento o no.");
    if (bienes <= 0) return setError("Ingresa el valor de al menos un bien.");
    let res;
    if (tipo === "intestamentaria") {
      res = calcularIntestataria({ bienes, deudas: d, familia });
      res.tipo = "intestamentaria";
    } else {
      const r = calcularTestamentaria({ bienes, deudas: d, legatarios });
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
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
            {[["intestamentaria", "❌ Sin testamento", "El notario o juez determina quién hereda según el Código Civil Federal."], ["testamentaria", "✅ Con testamento", "El fallecido dejó por escrito cómo repartir sus bienes ante notario."]].map(([v, t, d]) => (
              <button key={v} onClick={() => setTipo(v)} style={{ background: tipo === v ? "#f0f4ff" : "#fafbff", border: `2px solid ${tipo === v ? "#1847f0" : "#e0e4ff"}`, borderRadius: 14, padding: "16px", cursor: "pointer", textAlign: "left" }}>
                <p style={{ margin: "0 0 4px", fontWeight: 800, fontSize: 15, color: tipo === v ? "#1847f0" : "#0a0f1e" }}>{t}</p>
                <p style={{ margin: 0, fontSize: 12, color: "#555", lineHeight: 1.4 }}>{d}</p>
              </button>
            ))}
          </div>

          {/* 2 — BIENES POR CATEGORÍA */}
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0a0f1e", margin: "0 0 6px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ background: "#1847f0", color: "#fff", borderRadius: "50%", width: 26, height: 26, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900 }}>2</span>
            Bienes del fallecido
          </h2>
          <p style={{ fontSize: 12, color: "#777", marginBottom: 16 }}>Llena solo los que aplican. El total se calcula automáticamente.</p>

          <div style={{ background: "#f8f9ff", borderRadius: 14, padding: "16px", marginBottom: 8 }}>
            {CATEGORIAS_BIENES.map(({ k, e, l, tip }) => (
              <div key={k} style={{ display: "grid", gridTemplateColumns: "32px 1fr auto", gap: 10, alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 20, textAlign: "center" }}>{e}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: "#0a0f1e" }}>{l}</span>
                  <Tip text={tip} />
                </div>
                <div style={{ position: "relative", width: 170 }}>
                  <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#aaa", fontSize: 13, fontWeight: 600 }}>$</span>
                  <input
                    type="number" placeholder="0" min="0" value={bienesDetalle[k]}
                    onChange={e => updBien(k, e.target.value)}
                    style={{ ...inp, paddingLeft: 22, width: "100%", fontSize: 13 }}
                  />
                </div>
              </div>
            ))}

            {/* TOTAL */}
            <div style={{ borderTop: "1.5px solid #dde0ff", marginTop: 8, paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 800, fontSize: 14, color: "#0a0f1e" }}>Total del patrimonio</span>
              <span style={{ fontWeight: 900, fontSize: 18, color: bienes > 0 ? "#1847f0" : "#aaa" }}>{bienes > 0 ? pesos(bienes) : "$0"}</span>
            </div>
          </div>

          {/* DEUDAS */}
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
              {bienes > 0 && deudas && (
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1847f0", marginTop: 8 }}>
                  Masa hereditaria neta: {pesos(Math.max(0, bienes - parseFloat(deudas)))}
                </p>
              )}
            </div>
          )}

          {/* 3 — FAMILIA */}
          {tipo === "intestamentaria" && (() => {
            const hayDescendientes = familia.hijos > 0 || familia.nietos > 0;
            const hayAscendientes = familia.padres > 0 || familia.abuelos > 0;
            const hayColaterales = familia.hermanos > 0 || familia.sobrinos > 0 || familia.tios > 0;
            const mostrarAscendientes = !hayDescendientes;
            const mostrarAbuelos = mostrarAscendientes && familia.padres === 0;
            const mostrarColaterales = !hayDescendientes && !hayAscendientes && !familia.conyuge;
            const mostrarConcubino = !hayDescendientes && !hayAscendientes && !familia.conyuge && !hayColaterales;
            return (
              <>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0a0f1e", margin: "8px 0 6px", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ background: "#1847f0", color: "#fff", borderRadius: "50%", width: 26, height: 26, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900 }}>3</span>
                  Familia del fallecido
                  <Tip text="El CCF establece un orden estricto: los herederos de mayor grado excluyen a los de menor. El formulario se adapta automáticamente según lo que vayas llenando." />
                </h2>
                <p style={{ fontSize: 12, color: "#777", marginBottom: 16 }}>El formulario se adapta solo — solo verás las secciones que aplican según lo que vayas llenando.</p>

                {/* DESCENDIENTES — siempre visible */}
                <div style={{ background: "#f8f9ff", borderRadius: 12, padding: "16px", marginBottom: 12 }}>
                  <p style={{ margin: "0 0 12px", fontWeight: 800, fontSize: 13, color: "#1847f0" }}>👶 Descendientes (1° prioridad)</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <Label tip="Hijos directos del fallecido, vivos al momento del deceso.">Hijos vivos</Label>
                      <input type="number" min="0" max="20" value={familia.hijos} onChange={e => updFam("hijos", parseInt(e.target.value) || 0)} style={inp} />
                    </div>
                    <div>
                      <Label tip="Nietos del fallecido cuyos padres (hijos del fallecido) también han muerto. Heredan en lugar de su padre/madre fallecido por derecho de representación (Art. 1609 CCF).">
                        Nietos {familia.hijos === 0 ? "(hijos del fallecido murieron)" : "(si algún hijo murió)"}
                      </Label>
                      <input type="number" min="0" max="30" value={familia.nietos} onChange={e => updFam("nietos", parseInt(e.target.value) || 0)} style={inp} />
                    </div>
                  </div>
                  {familia.hijos === 0 && familia.nietos === 0 && (
                    <p style={{ margin: "10px 0 0", fontSize: 12, color: "#888", fontStyle: "italic" }}>
                      Sin hijos ni nietos — continúa con las siguientes secciones.
                    </p>
                  )}
                </div>

                {/* CÓNYUGE — siempre visible */}
                <div style={{ background: "#f8f9ff", borderRadius: 12, padding: "16px", marginBottom: 12 }}>
                  <p style={{ margin: "0 0 12px", fontWeight: 800, fontSize: 13, color: "#1847f0" }}>💍 Cónyuge</p>
                  <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                    <input type="checkbox" checked={familia.conyuge} onChange={e => updFam("conyuge", e.target.checked)} style={{ width: 18, height: 18, accentColor: "#1847f0", cursor: "pointer" }} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#0a0f1e" }}>Había cónyuge al momento del fallecimiento</span>
                    <Tip text="El cónyuge concurre con hijos (recibe parte igual a un hijo) y con ascendientes (recibe 50%). Sin descendientes ni ascendientes, hereda todo." />
                  </label>
                </div>

                {/* ASCENDIENTES — solo si no hay descendientes */}
                {mostrarAscendientes && (
                  <div style={{ background: "#f8f9ff", borderRadius: 12, padding: "16px", marginBottom: 12 }}>
                    <p style={{ margin: "0 0 4px", fontWeight: 800, fontSize: 13, color: "#1847f0" }}>👴 Ascendientes (2° prioridad)</p>
                    <p style={{ margin: "0 0 12px", fontSize: 11, color: "#888" }}>Aparece porque no hay hijos ni nietos.</p>
                    <div>
                      <Label tip="Padre y/o madre del fallecido, vivos al momento del deceso.">Padres vivos</Label>
                      <input type="number" min="0" max="2" value={familia.padres} onChange={e => updFam("padres", parseInt(e.target.value) || 0)} style={inp} />
                    </div>
                    {/* Abuelos — solo si padres = 0 */}
                    {mostrarAbuelos && (
                      <div style={{ marginTop: 12 }}>
                        <Label tip="Solo heredan si los padres también fallecieron.">Abuelos vivos</Label>
                        <input type="number" min="0" max="4" value={familia.abuelos} onChange={e => updFam("abuelos", parseInt(e.target.value) || 0)} style={inp} />
                        <p style={{ fontSize: 11, color: "#888", marginTop: 4 }}>Aparece porque no hay padres vivos.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* COLATERALES — solo si no hay descendientes, ascendientes ni cónyuge */}
                {mostrarColaterales && (
                  <div style={{ background: "#f8f9ff", borderRadius: 12, padding: "16px", marginBottom: 12 }}>
                    <p style={{ margin: "0 0 4px", fontWeight: 800, fontSize: 13, color: "#1847f0" }}>👥 Colaterales (3° prioridad)</p>
                    <p style={{ margin: "0 0 12px", fontSize: 11, color: "#888" }}>Aparece porque no hay descendientes, ascendientes ni cónyuge.</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                      <div><Label tip="Tienen prioridad sobre sobrinos y tíos.">Hermanos</Label><input type="number" min="0" max="20" value={familia.hermanos} onChange={e => updFam("hermanos", parseInt(e.target.value) || 0)} style={inp} /></div>
                      {familia.hermanos === 0 && <div><Label tip="Hijos de hermanos fallecidos. Heredan por representación si el hermano murió.">Sobrinos</Label><input type="number" min="0" max="30" value={familia.sobrinos} onChange={e => updFam("sobrinos", parseInt(e.target.value) || 0)} style={inp} /></div>}
                      {familia.hermanos === 0 && familia.sobrinos === 0 && <div><Label tip="Hermanos de los padres del fallecido. Último grado de colaterales reconocido.">Tíos</Label><input type="number" min="0" max="20" value={familia.tios} onChange={e => updFam("tios", parseInt(e.target.value) || 0)} style={inp} /></div>}
                    </div>
                  </div>
                )}

                {/* CONCUBINO — solo si no hay nadie más */}
                {mostrarConcubino && (
                  <div style={{ background: "#f8f9ff", borderRadius: 12, padding: "16px", marginBottom: 16 }}>
                    <p style={{ margin: "0 0 4px", fontWeight: 800, fontSize: 13, color: "#1847f0" }}>🤝 Concubino/a (4° prioridad)</p>
                    <p style={{ margin: "0 0 12px", fontSize: 11, color: "#888" }}>Aparece porque no hay ningún otro familiar con derechos hereditarios.</p>
                    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                      <input type="checkbox" checked={familia.concubino} onChange={e => updFam("concubino", e.target.checked)} style={{ width: 18, height: 18, accentColor: "#1847f0", cursor: "pointer" }} />
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#0a0f1e" }}>Había concubino/a</span>
                      <Tip text="Derechos equivalentes al cónyuge si convivieron al menos 2 años o tuvieron hijos en común, sin impedimento para casarse (Art. 1635 CCF)." />
                    </label>
                  </div>
                )}
              </>
            );
          })()}

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

            {/* RESUMEN BIENES */}
            {Object.values(bienesDetalle).some(v => parseFloat(v) > 0) && (
              <div style={{ background: "#f8f9ff", border: "1.5px solid #e0e4ff", borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
                <p style={{ margin: "0 0 10px", fontWeight: 700, fontSize: 13, color: "#555" }}>Desglose del patrimonio</p>
                {CATEGORIAS_BIENES.filter(c => parseFloat(bienesDetalle[c.k]) > 0).map(c => (
                  <div key={c.k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                    <span>{c.e} {c.l}</span>
                    <span style={{ fontWeight: 600 }}>{pesos(parseFloat(bienesDetalle[c.k]))}</span>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid #dde0ff", marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 14 }}>
                  <span>Total bruto</span><span style={{ color: "#1847f0" }}>{pesos(bienes)}</span>
                </div>
                {parseFloat(deudas) > 0 && (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#c05000", marginTop: 4 }}>
                      <span>− Deudas</span><span style={{ fontWeight: 600 }}>−{pesos(parseFloat(deudas))}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 14, marginTop: 4 }}>
                      <span>Masa hereditaria neta</span><span style={{ color: "#0a7a3a" }}>{pesos(resultado.masa)}</span>
                    </div>
                  </>
                )}
              </div>
            )}

            <div style={{ background: "linear-gradient(135deg,#1847f0,#4a6fff)", borderRadius: 16, padding: "20px 24px", marginBottom: 20, color: "#fff" }}>
              <p style={{ margin: "0 0 4px", fontSize: 13, opacity: 0.85 }}>Masa hereditaria neta a repartir</p>
              <p style={{ margin: 0, fontSize: "clamp(28px,7vw,44px)", fontWeight: 900, letterSpacing: -1 }}>{pesos(resultado.masa)}</p>
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