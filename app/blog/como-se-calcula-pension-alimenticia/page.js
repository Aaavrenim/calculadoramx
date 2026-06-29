export const metadata = {
  title: "¿Cómo se calcula la pensión alimenticia en México? | CalculadoraMX",
  description: "Aprende cómo los jueces determinan el monto de la pensión alimenticia en México: qué factores consideran y cuál es el rango típico.",
};
import Article from "@/app/blog/ArticleLayout";
export default function Art3() {
  return <Article
    titulo="¿Cómo se calcula la pensión alimenticia en México?"
    fecha="Junio 2025"
    tag="Pensión Alimenticia"
    href="/pension-alimenticia"
    cta="Calcular pensión alimenticia"
    contenido={[
      {
        h: "No existe una fórmula fija — pero sí hay criterios claros",
        p: `A diferencia del finiquito laboral, la pensión alimenticia no tiene una fórmula matemática exacta establecida en la ley. Lo que el Código Civil Federal establece (Art. 311 y siguientes) son los criterios que el juez debe considerar para fijar un monto justo. Conocerlos te ayuda a estimar cuánto podrías recibir o pagar.`
      },
      {
        h: "Los dos factores principales",
        p: `El juez evalúa siempre dos elementos en equilibrio:\n\n1. La capacidad económica del deudor alimentario (quien paga)\n2. Las necesidades del acreedor alimentario (quien recibe)\n\nEsto significa que un porcentaje alto del ingreso no necesariamente se otorga si las necesidades son menores, y viceversa.`
      },
      {
        h: "¿Qué porcentaje suele fijarse?",
        p: `En la práctica judicial mexicana, los montos más comunes son:\n\n• 1 hijo: entre 20% y 30% del ingreso neto del deudor\n• 2 hijos: entre 30% y 40%\n• 3 hijos o más: entre 40% y 50%\n\nEstos porcentajes son orientativos. El juez puede fijar montos distintos dependiendo de las circunstancias específicas del caso.`
      },
      {
        h: "Otros factores que influyen",
        p: `Además del ingreso y el número de hijos, el juez considera:\n\n• Edad y estado de salud de los hijos\n• Gastos educativos (escuela, útiles, uniformes)\n• Gastos médicos extraordinarios\n• Si hay más hijos de otras relaciones\n• Si el acreedor tiene también ingresos propios\n• El nivel de vida que tenía la familia antes de la separación`
      },
      {
        h: "¿Incluye solo dinero?",
        p: `No necesariamente. La pensión alimenticia puede cubrirse en especie (pagando directamente la renta, colegio, médico) o en dinero. Lo más común es en dinero con depósito mensual, pero el acuerdo puede ser mixto si ambas partes lo convienen.`
      },
      {
        h: "¿Se puede modificar?",
        p: `Sí. Si cambian las circunstancias —el deudor pierde su trabajo, los hijos tienen nuevas necesidades, o el deudor mejora su ingreso— cualquiera de las partes puede solicitar al juez una modificación del monto. Esta es una de las razones por las que es importante documentar bien los ingresos.`
      },
      {
        h: "Estima el monto antes de ir al juzgado",
        p: `Conocer el rango probable antes de iniciar un proceso legal te ayuda a negociar mejor o a tener expectativas realistas. Nuestra calculadora te da un estimado basado en los criterios del Código Civil Federal, de forma gratuita y en menos de un minuto.`
      },
    ]}
  />;
}