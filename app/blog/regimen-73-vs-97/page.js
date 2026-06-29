export const metadata = {
  title: "Régimen 73 vs Régimen 97 del IMSS: ¿Cuál es la diferencia? | CalculadoraMX",
  description: "Dos sistemas de pensión completamente distintos. Descubre cuál te aplica y cómo afecta el monto que recibirás al jubilarte.",
};
import Article from "@/app/blog/ArticleLayout";
export default function Art5() {
  return <Article
    titulo="Régimen 73 vs Régimen 97: ¿cuál te aplica y qué significa para tu pensión?"
    fecha="Junio 2025"
    tag="Pensión IMSS"
    href="/pension-imss"
    cta="Calcular mi pensión IMSS"
    contenido={[
      {
        h: "Dos sistemas, dos realidades",
        p: `En México coexisten dos sistemas de pensión del IMSS completamente distintos. A cuál perteneces depende de una sola fecha: el 1 de julio de 1997. Si empezaste a cotizar antes de esa fecha, eres Régimen 73. Si fue después, eres Régimen 97. Esta diferencia puede significar cientos de miles de pesos al momento de jubilarte.`
      },
      {
        h: "Régimen 73: pensión vitalicia garantizada",
        p: `La Ley del Seguro Social de 1973 (abrogada pero vigente para quienes tienen derechos adquiridos) establece una pensión vitalicia basada en:\n\n• Mínimo 500 semanas cotizadas\n• Edad mínima de 65 años (vejez) o 60 años (cesantía en edad avanzada)\n• La pensión es un porcentaje fijo de tu salario promedio de los últimos 5 años\n• A los 10 años cotizados corresponde el 80% del salario; aumenta ~1.3% por cada año adicional\n\nLa gran ventaja: una vez que la obtienes, es de por vida y el IMSS asume el riesgo de que vivas muchos años.`
      },
      {
        h: "Régimen 97: cuenta individual AFORE",
        p: `La Ley del Seguro Social de 1997 cambió el modelo radicalmente:\n\n• Mínimo 1,250 semanas cotizadas (más del doble que el régimen 73)\n• Edad mínima de 65 años\n• Tu pensión depende del saldo acumulado en tu AFORE, no de tu salario\n• Si el saldo no alcanza para una pensión digna, aplica la Pensión Mínima Garantizada (1 UMA mensual)\n\nEl riesgo aquí es del trabajador: si tu AFORE tuvo malos rendimientos, tu pensión será menor.`
      },
      {
        h: "¿Quién sale mejor?",
        p: `En general, quienes tienen derechos bajo el Régimen 73 suelen obtener pensiones más altas, especialmente si tuvieron salarios buenos y muchos años cotizados. El Régimen 97 depende mucho de los rendimientos del mercado y de las aportaciones acumuladas.\n\nEn 2020, el promedio de pensión IMSS en México era de apenas $4,500 mensuales bajo el Régimen 97, mientras que el 73 generaba pensiones promedio superiores.`
      },
      {
        h: "¿Puedo saber cuánto recibiré?",
        p: `Sí. Nuestra calculadora detecta automáticamente cuál régimen te aplica según tu fecha de primera cotización y te da un estimado de tu pensión mensual, cuántas semanas te faltan y cuándo podrías jubilarte.`
      },
    ]}
  />;
}