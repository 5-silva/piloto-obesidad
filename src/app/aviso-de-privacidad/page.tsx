import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/config";

export const metadata: Metadata = { title: "Aviso de privacidad" };

// BORRADOR. Redactado con base en la Ley Federal de Protección de Datos
// Personales en Posesión de los Particulares (DOF 20/03/2025). Lo debe revisar
// el abogado antes de abrir la lista de espera al público.
export default function PrivacyPage() {
  const owner = site.privacyOwner || "[Nombre completo de la persona responsable]";
  const address = site.privacyAddress || "[Domicilio para oír y recibir notificaciones]";
  const email = site.contactEmail || "[correo de privacidad]";

  return (
    <LegalPage title="Aviso de privacidad integral" updated="24 de octubre de 2026">
      <h2>Quién es responsable de tus datos</h2>
      <p>
        {owner}, con domicilio en {address}, es responsable del uso y protección de tus datos personales en el programa{" "}
        {site.brand}. Para cualquier tema de privacidad escríbenos a {email}.
      </p>

      <h2>Qué datos recabamos</h2>
      <ul>
        <li>
          <strong>Identificación y contacto:</strong> nombre, correo, celular y estado donde vives.
        </li>
        <li>
          <strong>Datos de salud (sensibles):</strong> edad, sexo, estatura, peso, cintura, enfermedades, medicamentos que usas,
          antecedentes que pueden hacer riesgoso un tratamiento y, durante el programa, tu peso semanal, síntomas y estado de
          ánimo.
        </li>
        <li>
          <strong>Uso del sitio:</strong> páginas visitadas y el anuncio o la liga por la que llegaste, sin cookies y sin
          vincularlos con tus datos de salud.
        </li>
      </ul>
      <p>
        Los datos de salud son datos personales sensibles. Solo los recabamos con tu consentimiento expreso, que nos das al marcar
        la casilla correspondiente en el cuestionario.
      </p>

      <h2>Para qué usamos tus datos</h2>
      <p>Finalidades necesarias para darte el servicio:</p>
      <ul>
        <li>Registrarte en la lista de espera y contactarte por WhatsApp y correo sobre el programa.</li>
        <li>Revisar si el programa es adecuado para ti y preparar tu valoración con el médico.</li>
        <li>Dar seguimiento semanal a tu tratamiento y avisarte si algo requiere atención.</li>
        <li>Agendar tus citas y enviarte recordatorios.</li>
      </ul>
      <p>Finalidades adicionales, que no son necesarias para el servicio:</p>
      <ul>
        <li>Medir, con datos agregados y sin identificarte, si el programa funciona y cómo mejorarlo.</li>
        <li>Invitarte a entrevistas o encuestas sobre tu experiencia.</li>
      </ul>
      <p>
        Si no quieres que usemos tus datos para las finalidades adicionales, escríbenos a {email}. Negarte no afecta el servicio.
      </p>

      <h2>Con quién compartimos tus datos</h2>
      <ul>
        <li>
          <strong>El médico que te valora</strong>, para tu diagnóstico y atención. Él lleva tu expediente clínico en su propio
          sistema y es responsable de él.
        </li>
        <li>
          <strong>Proveedores que nos ayudan a operar</strong> (alojamiento del sitio y la base de datos, envío de correos, agenda
          de citas y mensajería). Pueden estar fuera de México, solo tratan tus datos por cuenta nuestra y están obligados a
          protegerlos.
        </li>
      </ul>
      <p>No vendemos tus datos ni los compartimos con anunciantes, farmacias o laboratorios.</p>

      <h2>Tus derechos</h2>
      <p>
        Puedes acceder a tus datos, rectificarlos, cancelarlos u oponerte a su uso (derechos ARCO), así como revocar tu
        consentimiento. Envía tu solicitud a {email} con tu nombre, una forma de confirmar tu identidad y lo que pides. Te
        respondemos en un máximo de 20 días hábiles y, si procede, lo aplicamos en los 15 días hábiles siguientes.
      </p>
      <p>
        Si consideras que tu derecho a la protección de datos fue vulnerado, puedes acudir a la autoridad competente, la
        Secretaría Anticorrupción y Buen Gobierno.
      </p>

      <h2>Cómo protegemos tus datos</h2>
      <p>
        Tus datos de salud se guardan cifrados en tránsito y en reposo, con acceso solo para el equipo que te atiende. Como
        paciente, solo tú puedes ver tu propio seguimiento. La analítica del sitio no recibe datos de salud.
      </p>

      <h2>Cambios a este aviso</h2>
      <p>
        Si cambiamos este aviso, publicaremos la nueva versión en esta página con su fecha y, si el cambio es importante, te
        avisaremos por correo.
      </p>
      <p className="text-sm text-piedra">Versión {site.privacyVersion}</p>
    </LegalPage>
  );
}
