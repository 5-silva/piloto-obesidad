import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { CRISIS_LINE, formatMxn, site } from "@/lib/config";

export const metadata: Metadata = { title: "Términos del programa" };

export default function TermsPage() {
  return (
    <LegalPage title="Términos del programa piloto" updated="24 de octubre de 2026">
      <h2>Qué es {site.brand}</h2>
      <p>
        Un programa piloto de acompañamiento para personas que usan o van a iniciar un tratamiento médico para bajar
        de peso. Incluye seguimiento semanal en línea, orientación de nutrición y comunicación con el equipo por
        WhatsApp.
      </p>

      <h2>Qué no es</h2>
      <ul>
        <li>No es un servicio de urgencias. En una urgencia llama al 911.</li>
        <li>No vende, distribuye ni almacena medicamentos.</li>
        <li>
          No sustituye al médico. La valoración, el diagnóstico y cualquier receta los hace un médico con cédula
          profesional, de forma independiente y bajo su responsabilidad.
        </li>
      </ul>

      <h2>Quién puede participar</h2>
      <p>
        Personas de 18 años o más que vivan en México y que, según el cuestionario y la valoración médica, puedan
        beneficiarse del programa. Podemos no aceptar o pausar tu participación si el médico considera que no es
        seguro para ti.
      </p>

      <h2>Precio</h2>
      <p>
        El plan fundador cuesta {formatMxn(site.priceMxn)} al mes y no incluye el medicamento, estudios de laboratorio
        ni consultas fuera del programa. Durante la lista de espera no cobramos nada. Antes de cualquier cobro te
        explicaremos las condiciones y podrás decidir si continúas.
      </p>

      <h2>Tu participación</h2>
      <ul>
        <li>Responder con la verdad el cuestionario y los check-ins semanales.</li>
        <li>Avisar al médico si aparecen síntomas nuevos o fuertes.</li>
        <li>Puedes dejar el programa cuando quieras avisándonos por WhatsApp.</li>
      </ul>

      <h2>Apoyo emocional</h2>
      <p>
        Si en algún momento te sientes muy mal o piensas en hacerte daño, llama a la {CRISIS_LINE.name} al{" "}
        {CRISIS_LINE.phone}, disponible las 24 horas.
      </p>

      <h2>Tus datos</h2>
      <p>
        El uso de tus datos se rige por nuestro <a href="/aviso-de-privacidad">aviso de privacidad</a>.
      </p>
    </LegalPage>
  );
}
