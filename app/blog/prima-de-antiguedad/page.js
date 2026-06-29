export const metadata = {
  title: "¿Qué es la prima de antigüedad y cuándo te corresponde? | CalculadoraMX",
  description: "La prima de antigüedad es un derecho laboral en México que muchos trabajadores desconocen. Descubre cuándo aplica y cómo calcularla.",
};
import Article from "@/app/blog/ArticleLayout";
export default function Art2() {
  return <Article
    titulo="¿Qué es la prima de antigüedad y cuándo te corresponde?"
    fecha="Junio 2025"
    tag="Finiquito"
    href="/finiquito"
    cta="Calcular mi finiquito"
    contenido={[
      {
        h: "Un derecho que muchos desconocen",
        p: `La prima de antigüedad es una prestación laboral establecida en el Artículo 162 de la Ley Federal del Trabajo. Consiste en 12 días de salario por cada año trabajado, y muchos trabajadores mexicanos la dejan ir simplemente porque no saben que existe.`
      },
      {
        h: "¿Cuándo te corresponde?",
        p: `La prima de antigüedad aplica en los siguientes casos:\n\n• Renuncia voluntaria: solo si tienes 15 o más años de antigüedad\n• Despido injustificado: sin importar los años que tengas\n• Muerte del trabajador: los beneficiarios la reciben\n• Incapacidad permanente: el trabajador tiene derecho a cobrarla\n\nEste es uno de los puntos donde más trabajadores pierden dinero: renuncian antes de los 15 años y no saben que si esperan, tienen derecho a esta prestación extra.`
      },
      {
        h: "¿Cómo se calcula?",
        p: `La fórmula es simple: 12 días de salario diario integrado × número de años trabajados.\n\nPor ejemplo, si ganabas $600 diarios (salario integrado) y tienes 10 años de antigüedad:\n12 días × $600 × 10 años = $72,000 pesos\n\nImportante: el salario diario que se usa tiene un tope de dos veces el salario mínimo vigente para efectos de la prima de antigüedad (Art. 162 LFT), aunque en la práctica muchas empresas usan el salario real.`
      },
      {
        h: "¿Qué es el salario diario integrado?",
        p: `No es solo tu sueldo base dividido entre 30. El salario diario integrado incluye el valor proporcional de todas tus prestaciones ordinarias: aguinaldo, vacaciones y prima vacacional. Generalmente es entre 10% y 30% mayor que tu sueldo base diario.`
      },
      {
        h: "¿Se paga sobre años completos?",
        p: `Sí. Solo cuentan los años completos trabajados. Si tienes 7 años y 8 meses, solo se toman en cuenta 7 años para el cálculo de la prima de antigüedad.`
      },
      {
        h: "Consejo práctico",
        p: `Si estás pensando en renunciar y tienes entre 13 y 15 años de antigüedad, considera esperar a cumplir los 15 para tener derecho a la prima. El monto puede ser significativo. Usa nuestra calculadora para saber exactamente cuánto representaría en tu caso.`
      },
    ]}
  />;
}