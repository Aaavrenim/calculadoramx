export const metadata = {
  title: "¿Qué es la Modalidad 40 del IMSS y cuándo conviene? | CalculadoraMX",
  description: "La Modalidad 40 te permite aumentar tu pensión IMSS cotizando voluntariamente. Descubre cómo funciona, cuánto cuesta y si te conviene.",
};
import Article from "@/app/blog/ArticleLayout";
export default function Art6() {
  return <Article
    titulo="Modalidad 40 del IMSS: qué es, cómo funciona y cuándo conviene"
    fecha="Junio 2025"
    tag="Pensión IMSS"
    href="/pension-imss"
    cta="Simular Modalidad 40"
    contenido={[
      {
        h: "Una herramienta poco conocida para mejorar tu pensión",
        p: `La Modalidad 40 es un esquema de cotización voluntaria al IMSS, establecido en el Artículo 218 de la Ley del Seguro Social de 1973. Permite que trabajadores del Régimen 73 continúen cotizando —o coticen con un salario mayor— para aumentar el monto de su pensión futura. Es una de las estrategias de ahorro previsional más eficientes disponibles en México, y sorprendentemente pocas personas la conocen.`
      },
      {
        h: "¿Quién puede usarla?",
        p: `La Modalidad 40 está disponible exclusivamente para personas del Régimen 73, es decir, quienes empezaron a cotizar antes del 1 de julio de 1997. Si eres Régimen 97 (AFORE), esta opción no aplica para ti.`
      },
      {
        h: "¿Cómo funciona?",
        p: `Tú declaras voluntariamente al IMSS un Salario Base de Cotización (SBC) —que puede ser mayor al que tu patrón reporta, o un salario para seguir cotizando si ya no trabajas— y pagas mensualmente el 10.075% de ese salario.\n\nEse SBC declarado es el que el IMSS usará para calcular tu pensión. A mayor SBC, mayor pensión de por vida.`
      },
      {
        h: "Reglas importantes",
        p: `• El SBC que declares no puede ser menor al que ya tienes registrado en el IMSS\n• El tope máximo es 25 UMAs diarias (~$2,714/día en 2024)\n• Debes pagar puntualmente todos los meses sin interrupción. Si fallas un mes, el IMSS no reconoce el SBC mayor para ese período\n• Se tramita directamente en una subdelegación del IMSS`
      },
      {
        h: "¿Cuándo conviene?",
        p: `La Modalidad 40 conviene especialmente cuando:\n\n• Te faltan pocos años para jubilarte (5-15 años) y quieres mejorar tu pensión\n• Tu salario real es mayor al que tu patrón reporta al IMSS\n• Dejaste de trabajar pero quieres seguir acumulando semanas y mejorar tu SBC\n• Quieres aumentar significativamente tu ingreso vitalicio de jubilación\n\nNo conviene si tienes muy pocos años antes de jubilarte y el costo de las aportaciones supera el beneficio acumulado en pensión.`
      },
      {
        h: "Ejemplo concreto",
        p: `Si tu SBC actual es $400/día y lo subes a $800/día por 5 años bajo Modalidad 40, pagarías aproximadamente $2,440 mensuales al IMSS. A cambio, tu pensión mensual podría aumentar entre $3,000 y $6,000 pesos de por vida, dependiendo de tus años cotizados totales.`
      },
      {
        h: "Simula el impacto antes de decidir",
        p: `Nuestra calculadora de Pensión IMSS incluye una sección de simulación de Modalidad 40 donde puedes ver exactamente cuánto pagarías mensualmente y cuánto aumentaría tu pensión, antes de comprometerte con el IMSS.`
      },
    ]}
  />;
}