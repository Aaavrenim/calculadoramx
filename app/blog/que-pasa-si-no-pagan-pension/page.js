export const metadata = {
  title: "¿Qué pasa si el papá (o mamá) no paga la pensión alimenticia? | CalculadoraMX",
  description: "Si el deudor alimentario no cumple, la ley mexicana tiene mecanismos de cobro forzoso. Conoce tus opciones legales.",
};
import Article from "@/app/blog/ArticleLayout";
export default function Art4() {
  return <Article
    titulo="¿Qué pasa si no pagan la pensión alimenticia en México?"
    fecha="Junio 2025"
    tag="Pensión Alimenticia"
    href="/pension-alimenticia"
    cta="Calcular pensión alimenticia"
    contenido={[
      {
        h: "El incumplimiento tiene consecuencias legales serias",
        p: `En México, la pensión alimenticia no es opcional. Es una obligación legal establecida en el Código Civil y su incumplimiento puede tener consecuencias que van desde el embargo de bienes hasta la cárcel. Si el deudor alimentario no paga, tienes varias vías de acción.`
      },
      {
        h: "1. Ejecución de sentencia (cobro forzoso)",
        p: `Si ya tienes una sentencia o convenio judicial y el deudor no paga, puedes solicitar al juzgado la ejecución forzosa. Esto permite al juez ordenar:\n\n• Embargo de cuentas bancarias\n• Embargo de bienes muebles o inmuebles\n• Descuento directo de nómina (retención en fuente)\n• Retención del aguinaldo y otras prestaciones`
      },
      {
        h: "2. Arraigo",
        p: `El juez puede dictar arraigo contra el deudor, lo que le impide salir del país hasta que regularice sus pagos. Esto es especialmente útil cuando el deudor amenaza con irse al extranjero.`
      },
      {
        h: "3. Denuncia penal por abandono de familia",
        p: `El incumplimiento reiterado de la pensión alimenticia puede constituir el delito de abandono de familia, tipificado en el Código Penal Federal (Art. 336). La pena puede ser de 1 a 6 años de prisión. Este es un mecanismo de presión importante que muchos desconocen.`
      },
      {
        h: "4. Pensión provisional urgente",
        p: `Si aún no tienes una sentencia definitiva pero el deudor ya dejó de cooperar, puedes solicitar una pensión provisional al juzgado. El juez puede fijarla en cuestión de días mientras se resuelve el juicio principal, para que los hijos no queden desprotegidos durante el proceso.`
      },
      {
        h: "¿Qué pasa con las mensualidades atrasadas?",
        p: `Las pensiones alimenticias vencidas y no pagadas se acumulan como deuda exigible. A diferencia de otras deudas, no prescriben fácilmente y el deudor debe pagarlas todas. Puedes demandar el pago de los meses atrasados junto con la ejecución futura.`
      },
      {
        h: "¿Y si el deudor dice que no tiene trabajo?",
        p: `La falta de empleo formal no extingue la obligación alimentaria. El juez puede considerar la capacidad potencial de trabajo del deudor, sus bienes, o incluso obligaciones de familiares cercanos si el deudor directo es insolvente. El derecho alimentario de los hijos prevalece.`
      },
      {
        h: "Primer paso: conoce el monto que te corresponde",
        p: `Antes de iniciar cualquier proceso legal, es útil tener claro qué monto es razonable pedir. Usa nuestra calculadora para obtener un estimado basado en los criterios del Código Civil Federal.`
      },
    ]}
  />;
}