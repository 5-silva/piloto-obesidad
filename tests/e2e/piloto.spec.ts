import { expect, test } from "@playwright/test";

test("una persona se une a la lista y contesta el cuestionario", async ({ page }) => {
  await page.goto("/?utm_source=instagram&utm_campaign=e2e");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByRole("button", { name: "Unirme a la lista de espera" }).click();
  await expect(page.getByText("Necesitamos tu autorización para contactarte")).toBeVisible();

  await page.getByLabel("Nombre").fill("Prueba Automática");
  await page.getByLabel("Celular con WhatsApp").fill("55 1234 5678");
  await page.getByLabel("Correo", { exact: true }).fill("e2e@ejemplo.mx");
  await page.getByLabel("Estado donde vives").selectOption("Jalisco");
  await page.getByLabel("Sí, ya lo uso").check();
  await page.getByRole("checkbox", { name: /Acepto el aviso de privacidad/ }).check();
  await page.getByRole("button", { name: "Unirme a la lista de espera" }).click();
  await expect(page.getByText("Ya estás en la lista")).toBeVisible();

  await page.getByRole("link", { name: "Contestar el cuestionario" }).click();
  await page.getByLabel("Edad").fill("44");
  await page.getByLabel("Estatura en centímetros").fill("160");
  await page.getByLabel("Peso en kilos").fill("70");
  await page.getByRole("button", { name: "Enviar mis respuestas" }).click();
  await expect(page.getByText("Marca las que apliquen o «Ninguna aplica para mí»")).toBeVisible();
  await expect(page.getByLabel("Peso en kilos")).toHaveValue("70");

  await page.getByLabel("Presión alta (hipertensión)").check();
  await page.getByLabel("Ninguna aplica para mí").check();
  await page.getByRole("checkbox", { name: /Doy mi consentimiento expreso/ }).check();
  await page.getByRole("button", { name: "Enviar mis respuestas" }).click();
  await expect(page.getByText("El siguiente paso es tu valoración")).toBeVisible();

  await page.reload();
  await expect(page.getByRole("heading", { name: "Ya recibimos tu cuestionario" })).toBeVisible();
});

test("el paciente registra su semana y el equipo ve la alerta", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Entrar como paciente de ejemplo" }).click();
  await expect(page).toHaveURL(/\/portal$/);
  await page.goto("/panel");
  await expect(page).toHaveURL(/\/portal$/); // un paciente no entra al panel

  const correct = page.getByRole("button", { name: "Corregir mi check-in" });
  if (await correct.isVisible()) await correct.click();
  await page.getByLabel("Peso de hoy en kilos").fill("74.3");
  await page.getByLabel("Vómito que no para o no tolero líquidos").check();
  await expect(page.getByText("no esperes: llama al 911")).toBeVisible();
  await page.getByRole("button", { name: /Guardar semana/ }).click();
  await expect(page.getByText("Marcaste una señal de alarma")).toBeVisible();

  await page.getByRole("button", { name: "Salir" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.getByRole("button", { name: "Entrar al panel del equipo" }).click();
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
