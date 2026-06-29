export const metadata = {
  title: "¿Las herencias pagan impuestos en México? | CalculadoraMX",
  description: "En México las herencias están exentas de ISR, pero hay excepciones importantes. Conoce cuándo sí pagas impuestos al heredar.",
};
import Article from "@/app/blog/ArticleLayout";
export default function Art9() {
  return <Article
    titulo="¿Las herencias pagan impuestos en México?"
    fecha="Junio 2025"
    tag="Herencias"
    href="/herencias"
    cta="Calcular herencia"
    contenido={[
      {
        h: "La buena noticia: en general no pagas ISR al heredar",
        p: `El Artículo 93 fracción XIX de la Ley del Impuesto Sobre la Renta (LISR) establece que las herencias y legados están exentos del ISR para el heredero. Esto significa que si recibes una casa, dinero o cualquier bien por herencia, no tienes que pagar impuesto al recibirlo. Esta exención aplica tanto para herencias testamentarias como intestamentarias.`
      },
      {
        h: "La excepción importante: cuando vendes el bien heredado",
        p: `Si después de heredar un bien inmueble decides venderlo, ahí sí pagas ISR sobre la ganancia. La ganancia se calcula como la diferencia entre el precio de venta y el valor fiscal del bien al momento en que lo heredaste.\n\nPor eso es importante obtener un avalúo del bien al momento de recibirlo en herencia —ese valor será tu "costo de adquisición" para efectos fiscales futuros.`
      },
      {
        h: "¿Y el impuesto sobre adquisición de inmuebles?",
        p: `Este impuesto local (ISAI) varía por estado, pero en la mayoría de los casos las herencias están exentas de él también. Sin embargo, esto puede variar dependiendo del estado donde esté ubicado el inmueble. Te recomendamos verificar con un notario de la localidad.`
      },
      {
        h: "Costos que sí debes pagar al heredar",
        p: `Aunque no hay ISR sobre la herencia en sí, hay costos notariales y de proceso que sí tienes que cubrir:\n\n• Honorarios notariales: generalmente entre 1% y 2% del valor del patrimonio\n• Gastos de escrituración de inmuebles\n• Certificados, copias y derechos registrales\n• Honorarios de abogado si el proceso es contencioso\n\nEn total, estos costos pueden representar entre 2% y 4% del valor total de la herencia.`
      },
      {
        h: "¿Qué pasa con cuentas bancarias y seguros de vida?",
        p: `Las cuentas bancarias con beneficiario designado no forman parte de la masa hereditaria —pasan directamente al beneficiario sin pasar por el proceso sucesorio y sin ISR.\n\nLos seguros de vida tampoco generan ISR para el beneficiario (Art. 93 fr. XXI LISR). Son un mecanismo muy eficiente para transferir riqueza sin pasar por herencia.`
      },
      {
        h: "¿Las deudas también se heredan?",
        p: `Las deudas del fallecido se pagan del patrimonio antes de repartirlo entre los herederos. Los herederos no responden con su propio patrimonio —solo pierden parte o toda la herencia si las deudas son mayores que los bienes. Nunca heredas deudas que superen lo que recibes.`
      },
      {
        h: "Calcula cuánto recibirías",
        p: `Nuestra calculadora de herencias te muestra la masa hereditaria neta (bienes menos deudas), quién hereda y cuánto, y un estimado de los costos notariales del proceso.`
      },
    ]}
  />;
}