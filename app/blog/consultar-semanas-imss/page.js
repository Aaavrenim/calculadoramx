export const metadata = {
  title: "¿Cómo consultar mis semanas cotizadas en el IMSS? | CalculadoraMX",
  description: "Guía paso a paso para saber cuántas semanas tienes cotizadas en el IMSS desde tu celular o computadora, gratis y en minutos.",
};
import Article from "@/app/blog/ArticleLayout";
export default function Art7() {
  return <Article
    titulo="¿Cómo consultar mis semanas cotizadas en el IMSS? Guía paso a paso"
    fecha="Junio 2025"
    tag="Pensión IMSS"
    href="/pension-imss"
    cta="Calcular mi pensión IMSS"
    contenido={[
      {
        h: "Saber tus semanas cotizadas es el primer paso para planear tu jubilación",
        p: `Las semanas cotizadas son el indicador más importante para saber si puedes jubilarte y cuánto recibirás. Muchos trabajadores mexicanos no saben cuántas semanas tienen acumuladas. Aquí te explicamos cómo consultarlas gratis y en minutos.`
      },
      {
        h: "Método 1: Portal IMSS Digital (imss.gob.mx)",
        p: `1. Entra a www.imss.gob.mx\n2. Ve a la sección "IMSS Digital" o "Servicios en Línea"\n3. Selecciona "Constancia de semanas cotizadas"\n4. Ingresa tu Número de Seguridad Social (NSS)\n5. Descarga o imprime tu constancia\n\nNecesitas: tu NSS (aparece en tu tarjeta IMSS o en tu recibo de nómina) y una conexión a internet.`
      },
      {
        h: "Método 2: App IMSS Digital",
        p: `El IMSS tiene una aplicación oficial para iOS y Android llamada "IMSS Digital". Desde ella puedes:\n\n• Consultar tus semanas cotizadas\n• Ver tu historial laboral\n• Descargar tu constancia\n• Verificar tus datos de afiliación\n\nBúscala en App Store o Google Play como "IMSS Digital".`
      },
      {
        h: "Método 3: Consulta en la AFORE",
        p: `Si eres Régimen 97, tu AFORE también tiene registro de tus semanas cotizadas. Puedes consultarlo:\n\n• En la app de tu AFORE\n• En el portal SARWEB del CONSAR (sarweb.org.mx)\n• Llamando al número de atención al cliente de tu AFORE\n• En el estado de cuenta trimestral que te envían por correo`
      },
      {
        h: "Método 4: Subdelegación IMSS presencial",
        p: `Si tienes problemas con los métodos digitales, puedes acudir directamente a la Subdelegación del IMSS más cercana con:\n\n• Identificación oficial (INE o pasaporte)\n• Tu Número de Seguridad Social\n\nTe dan la constancia de semanas cotizadas de forma gratuita.`
      },
      {
        h: "¿Qué es el NSS y cómo lo encuentro?",
        p: `El Número de Seguridad Social (NSS) es un número de 11 dígitos que el IMSS te asigna al afiliarte por primera vez. Puedes encontrarlo en:\n\n• Tu tarjeta del IMSS\n• Cualquier recibo de nómina\n• Una carta de tu empleador\n• El portal del IMSS si recuerdas algún dato de registro`
      },
      {
        h: "Ya tengo mis semanas, ¿y ahora?",
        p: `Una vez que conoces tus semanas cotizadas, puedes calcular cuánto recibirás al jubilarte, cuántas semanas te faltan y cuándo podrías pensionarte. Nuestra calculadora hace todo eso en menos de un minuto.`
      },
    ]}
  />;
}