import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Auditoría de accesibilidad con axe (WCAG 2.1 A y AA) en las pantallas principales.
// Corre en celular y escritorio; en escritorio repite cada pantalla a 768 px (tableta).
// Correr solo esta auditoría: npm run test:a11y

const TABLETA = { width: 768, height: 1024 };
const ETIQUETAS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

async function auditar(page: Page) {
  // Sin animaciones: axe revisa el estado final, no un cuadro a mitad de transición.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForLoadState("networkidle");
  const { violations } = await new AxeBuilder({ page }).withTags(ETIQUETAS).analyze();
  const resumen = violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`);
  expect(resumen, `Violaciones de axe en ${page.url()}`).toEqual([]);
}

async function auditarEnTamanos(page: Page, esEscritorio: boolean) {
  await auditar(page);
  if (!esEscritorio) return;
  const original = page.viewportSize();
  await page.setViewportSize(TABLETA);
  await page.reload();
  await auditar(page);
  if (original) await page.setViewportSize(original);
}

test("páginas públicas sin violaciones de accesibilidad", async ({ page }, info) => {
  const esEscritorio = info.project.name === "escritorio";
  for (const ruta of ["/", "/login", "/aviso-de-privacidad", "/terminos"]) {
    await page.goto(ruta);
    await auditarEnTamanos(page, esEscritorio);
  }
});

test("cuestionario sin violaciones de accesibilidad", async ({ page }, info) => {
  await page.goto("/?utm_source=a11y");
  await page.getByLabel("Nombre").fill("Prueba Accesible");
  await page.getByLabel("Celular con WhatsApp").fill("55 8765 4321");
  await page.getByLabel("Correo", { exact: true }).fill("a11y@ejemplo.mx");
  await page.getByLabel("Estado donde vives").selectOption("Puebla");
  await page.getByLabel("Sí, ya lo uso").check();
  await page.getByRole("checkbox", { name: /Acepto el aviso de privacidad/ }).check();
  await page.getByRole("button", { name: "Apartar mi lugar" }).click();
  await expect(page.getByText("Tu lugar está apartado")).toBeVisible();
  await auditar(page); // confirmación de la lista de espera

  await page.getByRole("link", { name: "Contestar el cuestionario" }).click();
  await expect(page.getByLabel("Edad")).toBeVisible();
  await auditarEnTamanos(page, info.project.name === "escritorio");
});

test("portal del paciente sin violaciones de accesibilidad", async ({ page }, info) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Paciente de ejemplo" }).click();
  await expect(page).toHaveURL(/\/portal$/);
  await auditarEnTamanos(page, info.project.name === "escritorio");
});

test("panel del equipo sin violaciones de accesibilidad", async ({ page }, info) => {
  const esEscritorio = info.project.name === "escritorio";
  await page.goto("/login");
  await page.getByRole("button", { name: "Panel del equipo" }).click();
  await expect(page).toHaveURL(/\/panel$/);
  for (const ruta of ["/panel", "/panel/hoy", "/panel/leads", "/panel/pacientes", "/panel/costos"]) {
    await page.goto(ruta);
    await auditarEnTamanos(page, esEscritorio);
  }
});
