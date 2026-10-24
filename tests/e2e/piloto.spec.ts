import { expect, test } from "@playwright/test";

test("una persona aparta su lugar y contesta el cuestionario por pasos", async ({ page }) => {
  await page.goto("/?utm_source=instagram&utm_campaign=e2e");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("El lunes empiezas.");

  const submit = page.getByRole("button", { name: "Apartar mi lugar" });
  await submit.click();
  await expect(page.getByText("Necesitamos tu autorización para contactarte")).toBeVisible();

  await page.getByLabel("Nombre").fill("Prueba Automática");
  await page.getByLabel("Celular con WhatsApp").fill("55 1234 5678");
  await page.getByLabel("Correo", { exact: true }).fill("e2e@ejemplo.mx");
  await page.getByLabel("Estado donde vives").selectOption("Jalisco");
  await page.getByLabel("Sí, ya lo uso").check();
  await page.getByRole("checkbox", { name: /Acepto el aviso de privacidad/ }).check();
  await submit.click();
  await expect(page.getByText("Tu lugar está apartado")).toBeVisible();

  await page.getByRole("link", { name: "Contestar el cuestionario" }).click();
  const next = page.getByRole("button", { name: "Siguiente" });

  // Paso 1: datos básicos, con coma decimal
  await page.getByLabel("Edad").fill("44");
  await page.getByLabel("Estatura en centímetros").fill("160");
  await page.getByLabel("Peso en kilos").fill("70,5");
  await expect(page.getByText("Tu IMC aproximado es")).toBeVisible();
  await next.click();

  // Paso 2: enfermedades
  await page.getByLabel("Presión alta (hipertensión)").check();
  await next.click();

  // Paso 3: seguridad, obligatoria
  await next.click();
  await expect(page.getByText("Marca las que apliquen o «Ninguna aplica para mí».")).toBeVisible();
  await page.getByLabel("Ninguna aplica para mí").check();
  await next.click();

  // Paso 4: medicamentos (viene prellenado de la lista de espera)
  await next.click();

  // Paso 5: consentimiento, obligatorio antes de enviar
  const send = page.getByRole("button", { name: "Enviar mis respuestas" });
  await send.click();
  await expect(page.getByText("Sin tu consentimiento no podemos guardar tus respuestas.")).toBeVisible();
  await page.getByRole("checkbox", { name: /Doy mi consentimiento expreso/ }).check();
  await send.click();
  await expect(page.getByText("El siguiente paso es tu valoración")).toBeVisible();

  await page.reload();
  await expect(page.getByRole("heading", { name: "Ya recibimos tu cuestionario" })).toBeVisible();
});

test("el paciente entra con código, registra su lunes y el equipo ve la alerta", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Tu correo").fill("ana@ejemplo.mx");
  await page.getByRole("button", { name: "Mandarme un código" }).click();
  await page.getByLabel("Código").fill("000000");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(page.getByText("En la demo el código es 123456.")).toBeVisible();
  await page.getByLabel("Código").fill("123456");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(page).toHaveURL(/\/portal$/);

  await page.goto("/panel");
  await expect(page).toHaveURL(/\/portal$/); // un paciente no entra al panel

  const start = page.getByRole("button", { name: "Empezar mi check-in" });
  if (await start.isVisible()) await start.click();
  else await page.getByRole("button", { name: "Corregir" }).click();

  const next = page.getByRole("button", { name: "Siguiente" });
  await page.getByLabel("Peso en kilos").fill("74.3");
  await next.click();
  await next.click();
  await next.click();
  await next.click();

  // El paso de seguridad no se puede saltar: llegar a él no envía el formulario
  const save = page.getByRole("button", { name: /Guardar mi lunes/ });
  await expect(save).toBeVisible();
  await page.getByLabel("Vómito que no para o no tolero líquidos").check();
  await expect(page.getByText("Si lo tienes ahora y es fuerte, no esperes")).toBeVisible();
  await save.click();
  await expect(page.getByText("Marcaste una señal de alarma")).toBeVisible();

  await page.getByRole("button", { name: "Salir" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.getByRole("button", { name: "Panel del equipo" }).click();
  await expect(page).toHaveURL(/\/panel$/);
  await page.getByRole("link", { name: /^Hoy/ }).click();
  await expect(page.getByRole("heading", { name: "Hoy", level: 1 })).toBeVisible();
  await expect(page.getByText("Vómito que no para o no tolero líquidos").first()).toBeVisible();
});

test("las áreas privadas piden sesión", async ({ page }) => {
  for (const path of ["/panel", "/portal"]) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/login\?next=/);
  }
});
