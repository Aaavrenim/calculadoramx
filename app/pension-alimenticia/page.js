"use client";

import { useState } from "react";
import Link from "next/link";
import InfoTooltip from "../InfoTooltip";

// ============================================================
// LÓGICA LEGAL — Pensión Alimenticia
// Fuentes:
// - Código Civil Federal, arts. 301-323 (obligación, contenido y
//   proporcionalidad de los alimentos), art. 311 (proporcionalidad
//   entre posibilidades del deudor y necesidades del acreedor),
//   art. 314 (elementos a considerar).
// - SCJN, Contradicción de tesis 70/2018, Jurisprudencia
//   2a./J. 114/2019 (10a.) — no existe porcentaje fijo legal, el
//   monto se determina caso por caso.
// - Criterio jurisprudencial CDMX: piso orientativo de 15% del
//   ingreso del deudor por cada hijo.
// - Práctica judicial documentada: rangos de 15%-20% (1 hijo),
//   20%-25% (2 hijos), 30%-40% (3 o más hijos, o gastos especiales
//   de salud/educación), hasta 50% en casos extremos.
//
// IMPORTANTE: No existe una fórmula única en la ley mexicana. Este
// cálculo es ORIENTATIVO, basado en criterios judiciales comunes.
// El monto final lo determina un juez familiar caso por caso.
// ============================================================

function calcularRango({
  ingresoNeto,
  numHijos,
  gastoEspecialMensual,
  otrosDependientes,
  patrimonioTipo,
  patrimonioValor,
}) {
  let pisoBase;
  let techoBase;

  if (numHijos <= 1) {
    pisoBase = 15;
    techoBase = 20;
  } else if (numHijos === 2) {
    pisoBase = 20;
    techoBase = 25;
  } else if (numHijos === 3) {
    pisoBase = 25;
    techoBase = 32;
  } else {
    // 4 o más hijos
    pisoBase = 30;
    techoBase = 40;
  }

  let piso = pisoBase;
  let techo = techoBase;

  // Otros dependientes económicos del deudor (otra pensión vigente,
  // otros hijos de otra relación) → reduce el rango disponible,
  // con un piso mínimo del 15% (criterio jurisprudencial CDMX)
  if (otrosDependientes > 0) {
    const reduccion = Math.min(otrosDependientes * 3, 10);
    piso = Math.max(15, piso - reduccion);
    techo = Math.max(piso + 3, techo - reduccion);
  }

  // Patrimonio adicional del deudor (propiedades, inversiones,
  // vehículos, negocio propio) → el juez lo pondera como indicador
  // de capacidad económica real (art. 311 Código Civil Federal),
  // aunque el ingreso declarado sea bajo. Ajuste escalonado por
  // valor estimado del patrimonio.
  if (patrimonioTipo && patrimonioTipo !== "ninguno" && patrimonioValor > 0) {
    let ajustePatrimonio = 2;
    if (patrimonioValor >= 3000000) ajustePatrimonio = 12;
    else if (patrimonioValor >= 1000000) ajustePatrimonio = 8;
    else if (patrimonioValor >= 300000) ajustePatrimonio = 5;
    techo += ajustePatrimonio;
  }

  // Tope práctico observado en la jurisprudencia (sobre el % base,
  // antes de sumar gastos especiales en pesos)
  piso = Math.min(piso, 50);
  techo = Math.min(techo, 50);

  let montoMin = Math.round((ingresoNeto * piso) / 100);
  let montoMax = Math.round((ingresoNeto * techo) / 100);

  // Gastos médicos/educativos especiales (discapacidad, escuela
  // privada, terapias, medicamentos, etc.) → se suman directo en
  // pesos al monto, ya que son un gasto real adicional a cubrir,
  // no un porcentaje genérico del ingreso (art. 308 y 314 CCF)
  const extra = Math.round(gastoEspecialMensual) || 0;
  montoMin += extra;
  montoMax += extra;

  return { piso, techo, montoMin, montoMax, gastoExtra: extra };
}

export default function PensionAlimenticiaPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);

  const [ingresoNeto, setIngresoNeto] = useState("");
  const [numHijos, setNumHijos] = useState("1");
  const [gastoEspecialMensual, setGastoEspecialMensual] = useState("");
  const [otrosDependientes, setOtrosDependientes] = useState("0");
  const [patrimonioTipo, setPatrimonioTipo] = useState("ninguno");
  const [patrimonioValor, setPatrimonioValor] = useState("");

  const totalSteps = 4;

  function siguiente() {
    if (step < totalSteps) setStep(step + 1);
  }
  function anterior() {
    if (step > 1) setStep(step - 1);
  }

  function calcular() {
    setLoading(true);
    setTimeout(() => {
      const r = calcularRango({
        ingresoNeto: parseFloat(ingresoNeto) || 0,
        numHijos: parseInt(numHijos) || 1,
        gastoEspecialMensual: parseFloat(gastoEspecialMensual) || 0,
        otrosDependientes: parseInt(otrosDependientes) || 0,
        patrimonioTipo,
        patrimonioValor: parseFloat(patrimonioValor) || 0,
      });
      setResultado(r);
      setLoading(false);

      try {
        const usos = parseInt(localStorage.getItem("calculadoramx_pension_usos") || "0");
        localStorage.setItem("calculadoramx_pension_usos", String(usos + 1));
      } catch (e) {}
    }, 900);
  }

  function reiniciar() {
    setResultado(null);
    setStep(1);
    setIngresoNeto("");
    setNumHijos("1");
    setGastoEspecialMensual("");
    setOtrosDependientes("0");
    setPatrimonioTipo("ninguno");
    setPatrimonioValor("");
  }

  function compartirWhatsApp() {
    const texto = resultado
      ? `Calculé un estimado de pensión alimenticia en CalculadoraMX: entre $${resultado.montoMin.toLocaleString("es-MX")} y $${resultado.montoMax.toLocaleString("es-MX")} MXN mensuales (${resultado.piso}%-${resultado.techo}% del ingreso). Gratis aquí:`
      : "Calculadora de Pensión Alimenticia gratis en CalculadoraMX:";
    const url = `https://wa.me/?text=${encodeURIComponent(texto + " https://calculadoramx.com/pension-alimenticia")}`;
    window.open(url, "_blank");
  }

  return (
    <div className="page">
      {/* Header flotante tipo píldora */}
      <header className="header">
        <Link href="/" style={{ textDecoration: "none" }}>
          <div className="logo">
            Calculadora<span className="logoAccent">MX</span>
          </div>
        </Link>
        <div className="badge">100% GRATIS</div>
      </header>

      <main className="main">
        <div className="breadcrumb">
          <Link href="/" style={{ color: "#6b7280", textDecoration: "none" }}>
            Inicio
          </Link>
          <span> / Pensión Alimenticia</span>
        </div>

        <h1 className="title">
          Calculadora de <span className="titleAccent">Pensión Alimenticia</span>
        </h1>
        <p className="subtitle">
          Estimación orientativa basada en criterios judiciales comunes en México.
        </p>

        <div className="disclaimerBox">
          <strong>⚠️ Importante:</strong> No existe una fórmula fija en la ley mexicana
          para calcular la pensión alimenticia. Cada juez familiar decide caso por caso,
          considerando las necesidades de los hijos y la capacidad económica del deudor
          (Código Civil Federal, arts. 311 y 314). Este resultado es un{" "}
          <strong>rango ORIENTATIVO</strong>, no una cifra exacta ni vinculante. Consulta
          siempre con un abogado familiar para tu caso específico.
        </div>

        {!resultado && (
          <div className="card">
            <div className="progressBarTrack">
              <div
                className="progressBarFill"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
            <div className="stepLabel">Paso {step} de {totalSteps}</div>

            {step === 1 && (
              <div className="stepContent">
                <label className="label">
                  Ingreso neto mensual del deudor alimentario
                  <InfoTooltip text="Es el salario o ingreso después de impuestos y deducciones obligatorias (ISR, IMSS, etc.). Incluye ingresos ordinarios y extraordinarios." />
                </label>
                <input
                  type="number"
                  className="input"
                  placeholder="Ej. 15000"
                  value={ingresoNeto}
                  onChange={(e) => setIngresoNeto(e.target.value)}
                />
              </div>
            )}

            {step === 2 && (
              <div className="stepContent">
                <label className="label">
                  Número de hijos a quienes se les debe pensión
                  <InfoTooltip text="A mayor número de hijos, mayor es el rango orientativo, hasta un tope práctico observado en la jurisprudencia." />
                </label>
                <select
                  className="input"
                  value={numHijos}
                  onChange={(e) => setNumHijos(e.target.value)}
                >
                  <option value="1">1 hijo</option>
                  <option value="2">2 hijos</option>
                  <option value="3">3 hijos</option>
                  <option value="4">4 o más hijos</option>
                </select>
              </div>
            )}

            {step === 3 && (
              <div className="stepContent">
                <label className="label">
                  Gasto médico/educativo especial mensual (si aplica)
                  <InfoTooltip text="Monto mensual aproximado de gastos extra y fijos: colegiatura privada, terapias, medicamentos, tratamiento médico continuo, etc. Se suma directo al resultado en pesos. Si no aplica, déjalo en 0." />
                </label>
                <input
                  type="number"
                  className="input"
                  placeholder="Ej. 2500 (déjalo en 0 si no aplica)"
                  value={gastoEspecialMensual}
                  onChange={(e) => setGastoEspecialMensual(e.target.value)}
                />

                <label className="label" style={{ marginTop: 20 }}>
                  Otros dependientes económicos del deudor
                  <InfoTooltip text="Otra pensión alimenticia vigente, otros hijos de otra relación, etc. Esto puede reducir el rango disponible, aunque la jurisprudencia de CDMX marca un piso mínimo de 15% por hijo." />
                </label>
                <select
                  className="input"
                  value={otrosDependientes}
                  onChange={(e) => setOtrosDependientes(e.target.value)}
                >
                  <option value="0">Ninguno</option>
                  <option value="1">1 dependiente más</option>
                  <option value="2">2 dependientes más</option>
                  <option value="3">3 o más dependientes</option>
                </select>
              </div>
            )}

            {step === 4 && (
              <div className="stepContent">
                <label className="label">
                  Tipo de patrimonio adicional del deudor
                  <InfoTooltip text="El juez considera propiedades, vehículos, inversiones o negocio propio como indicador de capacidad económica real, aunque el ingreso declarado sea bajo (art. 311 Código Civil Federal)." />
                </label>
                <select
                  className="input"
                  value={patrimonioTipo}
                  onChange={(e) => setPatrimonioTipo(e.target.value)}
                >
                  <option value="ninguno">Ninguno declarado</option>
                  <option value="inmueble">Inmueble (casa, departamento, terreno)</option>
                  <option value="vehiculo">Vehículo(s)</option>
                  <option value="inversiones">Inversiones / ahorro</option>
                  <option value="negocio">Negocio propio</option>
                </select>

                {patrimonioTipo !== "ninguno" && (
                  <>
                    <label className="label" style={{ marginTop: 20 }}>
                      Valor estimado de ese patrimonio
                      <InfoTooltip text="Una estimación aproximada del valor comercial. No necesita ser exacta — entre más alto, mayor es el efecto sobre el rango estimado, ya que refleja mayor capacidad económica." />
                    </label>
                    <input
                      type="number"
                      className="input"
                      placeholder="Ej. 800000"
                      value={patrimonioValor}
                      onChange={(e) => setPatrimonioValor(e.target.value)}
                    />
                  </>
                )}
              </div>
            )}

            <div className="navButtons">
              {step > 1 && (
                <button className="btnSecondary" onClick={anterior}>
                  ← Atrás
                </button>
              )}
              {step < totalSteps && (
                <button
                  className="btnPrimary"
                  onClick={siguiente}
                  disabled={step === 1 && !ingresoNeto}
                >
                  Siguiente →
                </button>
              )}
              {step === totalSteps && (
                <button className="btnPrimary" onClick={calcular} disabled={loading}>
                  {loading ? "Calculando..." : "Calcular rango estimado"}
                </button>
              )}
            </div>
          </div>
        )}

        {resultado && (
          <div className="resultCard">
            <div className="resultLabel">Rango estimado mensual</div>
            <div className="resultRange">
              ${resultado.montoMin.toLocaleString("es-MX")} – $
              {resultado.montoMax.toLocaleString("es-MX")} <span className="mxn">MXN</span>
            </div>
            <div className="resultPercent">
              Equivalente a {resultado.piso}% – {resultado.techo}% del ingreso neto declarado
              {resultado.gastoExtra > 0 && (
                <>
                  {" "}
                  + ${resultado.gastoExtra.toLocaleString("es-MX")} de gasto especial mensual
                </>
              )}
            </div>

            <div className="fuenteLegal">
              <strong>Fuente legal:</strong> Código Civil Federal, arts. 301-323 (contenido
              de los alimentos), art. 311 (proporcionalidad), art. 314 (elementos a
              considerar) · SCJN, Contradicción de tesis 70/2018, Jurisprudencia
              2a./J. 114/2019 (10a.) · Criterio jurisprudencial CDMX: piso orientativo de
              15% por hijo.
            </div>

            <div className="disclaimerBox" style={{ marginTop: 16 }}>
              Este resultado es <strong>orientativo</strong>. El monto final de la pensión
              lo determina un juez familiar, considerando tu caso específico y el código
              civil de tu estado (cada entidad federativa tiene su propio código).
              Recomendamos asesorarte con un abogado familiar.
            </div>

            <div className="resultButtons">
              <button className="btnPrimary" onClick={compartirWhatsApp}>
                Compartir por WhatsApp
              </button>
              <button className="btnSecondary" onClick={reiniciar}>
                Calcular de nuevo
              </button>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #fafbff;
          color: #0a0f1e;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          padding-bottom: 60px;
        }
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 700px;
          margin: 20px auto;
          padding: 14px 24px;
          background: #ffffff;
          border-radius: 999px;
          box-shadow: 0 4px 20px rgba(10, 15, 30, 0.08);
        }
        .logo {
          font-weight: 800;
          font-size: 18px;
          color: #0a0f1e;
        }
        .logoAccent {
          color: #1847f0;
        }
        .badge {
          background: #1847f0;
          color: white;
          font-size: 12px;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 999px;
        }
        .main {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px 20px 0;
        }
        .breadcrumb {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 20px;
        }
        .title {
          font-size: 32px;
          font-weight: 800;
          text-align: center;
          line-height: 1.2;
          margin-bottom: 8px;
        }
        .titleAccent {
          background: linear-gradient(90deg, #1847f0, #4d6bff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .subtitle {
          text-align: center;
          color: #6b7280;
          margin-bottom: 24px;
        }
        .disclaimerBox {
          background: #fff7e6;
          border: 1px solid #ffd684;
          border-radius: 12px;
          padding: 14px 16px;
          font-size: 13px;
          line-height: 1.5;
          color: #5a4400;
          margin-bottom: 24px;
        }
        .card {
          background: white;
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 4px 24px rgba(10, 15, 30, 0.06);
        }
        .progressBarTrack {
          height: 6px;
          background: #eef0fa;
          border-radius: 999px;
          overflow: hidden;
          margin-bottom: 8px;
        }
        .progressBarFill {
          height: 100%;
          background: #1847f0;
          transition: width 0.3s ease;
        }
        .stepLabel {
          font-size: 12px;
          color: #9ca3af;
          margin-bottom: 20px;
        }
        .stepContent {
          min-height: 100px;
        }
        .label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 10px;
        }
        .checkboxLabel {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
        }
        .input {
          width: 100%;
          padding: 14px 16px;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          font-size: 16px;
          outline: none;
        }
        .input:focus {
          border-color: #1847f0;
        }
        .navButtons {
          display: flex;
          gap: 12px;
          margin-top: 28px;
        }
        .btnPrimary {
          flex: 1;
          background: #1847f0;
          color: white;
          border: none;
          padding: 14px 20px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
        }
        .btnPrimary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .btnSecondary {
          flex: 1;
          background: #eef0fa;
          color: #0a0f1e;
          border: none;
          padding: 14px 20px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
        }
        .resultCard {
          background: #0a0f1e;
          color: white;
          border-radius: 20px;
          padding: 32px 28px;
          text-align: center;
        }
        .resultLabel {
          font-size: 13px;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }
        .resultRange {
          font-size: 34px;
          font-weight: 800;
          color: #5d7dff;
          margin-bottom: 6px;
        }
        .mxn {
          font-size: 16px;
          color: #9ca3af;
        }
        .resultPercent {
          font-size: 14px;
          color: #d1d5db;
          margin-bottom: 20px;
        }
        .fuenteLegal {
          text-align: left;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 14px 16px;
          font-size: 12px;
          line-height: 1.6;
          color: #c7cbe0;
        }
        .resultButtons {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }
      `}</style>
    </div>
  );
}