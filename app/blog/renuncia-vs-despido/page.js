export const metadata = {
  title: "¿Cuánto me corresponde si renuncio vs si me despiden? | CalculadoraMX",
  description: "Conoce la diferencia entre renuncia y despido en México: qué prestaciones te corresponden en cada caso según la Ley Federal del Trabajo.",
};
import Article from "@/app/blog/ArticleLayout";
export default function Art1() {
  return <Article
    titulo="¿Cuánto me corresponde si renuncio vs si me despiden?"
    fecha="Junio 2025"
    tag="Finiquito"
    href="/finiquito"
    cta="Calcular mi finiquito"
    contenido={[
      {
        h: "La diferencia importa — y mucho",
        p: `En México, la forma en que termina tu relación laboral determina directamente cuánto dinero recibes al salir. No es lo mismo renunciar voluntariamente que ser despedido. La Ley Federal del Trabajo (LFT) establece prestaciones distintas para cada caso, y conocerlas puede hacerte ganar o perder miles de pesos.`
      },
      {
        h: "Si renuncias voluntariamente",
        p: `Cuando tú decides terminar la relación laboral, tienes derecho a tu finiquito, que incluye:\n\n• Días trabajados del período en curso\n• Partes proporcionales de aguinaldo (15 días de salario por año, Art. 87 LFT)\n• Partes proporcionales de vacaciones no disfrutadas (según tabla del Art. 76 LFT)\n• Prima vacacional (25% del valor de las vacaciones, Art. 80 LFT)\n• Prima de antigüedad si tienes 15 o más años trabajando (12 días de salario por año, Art. 162 LFT)\n\nLo que NO recibes al renunciar: indemnización constitucional ni los 20 días por año.`
      },
      {
        h: "Si te despiden sin causa justificada",
        p: `Un despido injustificado —también llamado despido sin causa— te da derecho a todo lo del finiquito más una indemnización adicional:\n\n• 3 meses de salario integrado (indemnización constitucional, Art. 50 LFT)\n• 20 días de salario integrado por cada año trabajado (Art. 50 LFT)\n• Prima de antigüedad: 12 días por año trabajado (Art. 162 LFT)\n• Todas las prestaciones proporcionales del finiquito\n\nEsta diferencia puede ser sustancial. Con 5 años de antigüedad y un salario de $15,000 mensuales, la diferencia entre renunciar y ser despedido puede ser de $60,000 pesos o más.`
      },
      {
        h: "Si te despiden con causa justificada",
        p: `Si tu patrón puede probar una causa de rescisión válida (Art. 47 LFT), como robo, faltas repetidas o daño intencional, solo tienes derecho al finiquito básico, sin indemnización. Por eso es importante documentar cualquier irregularidad del empleador.`
      },
      {
        h: "¿Qué es el salario integrado?",
        p: `El salario integrado no es solo tu sueldo base. Incluye también el valor diario proporcional de todas tus prestaciones: aguinaldo, vacaciones, prima vacacional, y cualquier otra prestación ordinaria. Este es el salario que se usa para calcular indemnizaciones y se puede ser hasta 30% mayor al sueldo base.`
      },
      {
        h: "Conclusión: conoce tu situación antes de firmar",
        p: `Antes de aceptar cualquier acuerdo o firmar documentos de terminación laboral, calcula cuánto te corresponde. Muchas empresas ofrecen liquidaciones más bajas esperando que el trabajador no conozca sus derechos. Usa nuestra calculadora de finiquito para obtener un estimado inmediato basado en la LFT vigente.`
      },
    ]}
  />;
}