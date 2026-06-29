export const metadata = {
  title: "¿Qué pasa si alguien muere sin testamento en México? | CalculadoraMX",
  description: "Sin testamento, la ley mexicana decide quién hereda y en qué proporción. Conoce el orden de prelación del Código Civil Federal.",
};
import Article from "@/app/blog/ArticleLayout";
export default function Art8() {
  return <Article
    titulo="¿Qué pasa si alguien muere sin testamento en México?"
    fecha="Junio 2025"
    tag="Herencias"
    href="/herencias"
    cta="Calcular herencia"
    contenido={[
      {
        h: "La ley decide cuando no hay testamento",
        p: `En México, cuando una persona fallece sin dejar testamento, se abre lo que se llama una sucesión intestamentaria o intestada. En este caso, el Código Civil Federal (Arts. 1599-1636) establece un orden de prelación estricto que determina quién hereda y en qué proporción. No importa lo que el fallecido hubiera querido —la ley lo decide.`
      },
      {
        h: "El orden de quienes heredan",
        p: `El Código Civil Federal establece esta jerarquía:\n\n1° Descendientes (hijos, nietos por representación)\n2° Ascendientes (padres, abuelos)\n3° Cónyuge supérstite (si no hay descendientes ni ascendientes)\n4° Colaterales (hermanos, sobrinos, tíos)\n5° Concubino/a (con convivencia mínima de 2 años o hijos en común)\n6° Beneficencia Pública (si no hay ningún heredero)\n\nLos herederos de mayor grado excluyen completamente a los de menor grado.`
      },
      {
        h: "¿Qué pasa con el cónyuge?",
        p: `El cónyuge supérstite tiene un papel especial:\n\n• Si hay hijos: el cónyuge hereda una parte igual a la de cada hijo\n• Si hay ascendientes pero no hijos: el cónyuge recibe el 50% y los ascendientes el otro 50%\n• Si no hay descendientes ni ascendientes: el cónyuge hereda todo\n\nEsto aplica siempre que el matrimonio estuviera vigente al momento del fallecimiento.`
      },
      {
        h: "¿Y si hay hijos de diferentes relaciones?",
        p: `Todos los hijos heredan en partes iguales, independientemente de si son de matrimonios anteriores, relaciones extramaritales o hijos adoptados. La ley mexicana no distingue entre ellos para efectos sucesorios (Art. 1602 CCF).`
      },
      {
        h: "¿Cómo se hace el trámite?",
        p: `Hay dos vías para tramitar una sucesión intestamentaria:\n\n1. Ante notario público: si todos los herederos están de acuerdo y son mayores de edad. Es más rápido (6-18 meses en promedio).\n\n2. Ante un juez familiar: si hay menores de edad, desacuerdos entre herederos, o el patrimonio es complejo. Puede tomar de 1 a 3 años.\n\nEn ambos casos se requiere acreditar el fallecimiento, el parentesco y la inexistencia de testamento.`
      },
      {
        h: "¿Se pagan impuestos por heredar?",
        p: `En México, las herencias están exentas del ISR para el heredero (Art. 93 fracción XIX de la Ley del ISR). No pagas impuesto por recibir la herencia. La excepción es si después vendes un bien heredado —ahí sí pagarías ISR sobre la ganancia de esa venta.`
      },
      {
        h: "¿Cuánto recibirías?",
        p: `Eso depende del patrimonio del fallecido, las deudas pendientes y el número de herederos. Nuestra calculadora de herencias te muestra exactamente quién hereda y cuánto, según la ley mexicana, en menos de un minuto.`
      },
    ]}
  />;
}