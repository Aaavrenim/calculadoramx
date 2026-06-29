export const metadata = {
  title: "¿Cuáles son tus derechos laborales en México? Guía completa | CalculadoraMX",
  description: "Conoce los derechos laborales fundamentales que te garantiza la Ley Federal del Trabajo en México: aguinaldo, vacaciones, IMSS y más.",
};
import Article from "@/app/blog/ArticleLayout";
export default function Art10() {
  return <Article
    titulo="Guía completa de derechos laborales en México"
    fecha="Junio 2025"
    tag="Finiquito"
    href="/finiquito"
    cta="Calcular mi finiquito"
    contenido={[
      {
        h: "La Ley Federal del Trabajo protege a todos los trabajadores",
        p: `En México, la Ley Federal del Trabajo (LFT) establece un catálogo de derechos mínimos que todo empleador debe respetar, independientemente del contrato que firmes. Estos derechos no pueden reducirse ni eliminarse contractualmente —si un contrato dice que no tienes derecho al aguinaldo, ese punto es nulo de pleno derecho.`
      },
      {
        h: "Aguinaldo",
        p: `Todo trabajador tiene derecho a un aguinaldo anual mínimo de 15 días de salario (Art. 87 LFT). Debe pagarse antes del 20 de diciembre. Si no completaste el año, recibes la parte proporcional. Muchas empresas pagan más de 15 días —ese excedente es una prestación superior a la ley pero igualmente obligatoria una vez ofrecida.`
      },
      {
        h: "Vacaciones",
        p: `Desde el primer año tienes derecho a vacaciones pagadas (Art. 76 LFT). La reforma laboral de 2023 aumentó los días mínimos:\n\n• 1er año: 12 días\n• 2° año: 14 días\n• 3er año: 16 días\n• 4° año: 18 días\n• 5° año: 20 días\n• A partir del 6° año: aumenta 2 días por cada 5 años de servicio\n\nAdemás, tienes derecho a una prima vacacional del 25% sobre el valor de los días de vacaciones (Art. 80 LFT).`
      },
      {
        h: "Seguridad Social (IMSS)",
        p: `Todo empleador está obligado a inscribir a sus trabajadores en el IMSS desde el primer día de trabajo (Art. 12 LSS). Esto te da acceso a:\n\n• Atención médica\n• Incapacidades pagadas\n• Guarderías\n• Pensión por invalidez o vejez\n• Seguro de vida`
      },
      {
        h: "Jornada laboral máxima",
        p: `La jornada diurna no puede exceder 8 horas; la nocturna, 7 horas; y la mixta, 7.5 horas (Art. 61 LFT). Las horas extras se pagan al doble. Las primeras 9 horas extras por semana se pagan al doble; las que excedan ese límite, al triple.`
      },
      {
        h: "Salario mínimo",
        p: `Ningún trabajador puede ganar menos del salario mínimo vigente, que en 2026 es de $315.04 pesos diarios en la zona general y $440.87 en la Zona Libre de la Frontera Norte (CONASAMI, DOF 09-12-2025). Este monto se actualiza anualmente.`
      },
      {
        h: "Reparto de Utilidades (PTU)",
        p: `Si la empresa donde trabajas tuvo ganancias, tienes derecho al 10% de las utilidades distribuidas entre todos los trabajadores (Art. 117 LFT). Se paga dentro de los 60 días posteriores al cierre fiscal de la empresa (mayo para personas morales).`
      },
      {
        h: "Protección contra el despido injustificado",
        p: `Si te despiden sin causa justificada, tienes derecho a una indemnización de 3 meses de salario + 20 días por año trabajado + prima de antigüedad (Art. 50 LFT). Tienes 2 meses para demandar ante la Junta de Conciliación o STPS.`
      },
      {
        h: "¿Cómo saber cuánto te corresponde?",
        p: `Si saliste de tu trabajo o estás en proceso de hacerlo, usa nuestra calculadora de finiquito para saber exactamente cuánto te corresponde recibir según la LFT vigente.`
      },
    ]}
  />;
}