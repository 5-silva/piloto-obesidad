import { defineConfig, devices } from "@playwright/test";

// Pruebas de punta a punta en modo demo (sin Supabase): npm run test:e2e
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  use: { baseURL: "http://localhost:3200", trace: "retain-on-failure" },
  projects: [
    { name: "celular", use: { ...devices["Pixel 7"] } },
    { name: "escritorio", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } } },
  ],
  workers: 1,
  webServer: {
    command: "npx next dev -p 3200",
    url: "http://localhost:3200/login",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: { NEXT_PUBLIC_SUPABASE_URL: "", NEXT_PUBLIC_WHATSAPP_NUMBER: "5512345678" },
  },
});
