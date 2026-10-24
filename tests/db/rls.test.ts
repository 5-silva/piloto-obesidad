// Pruebas de permisos por fila (RLS) contra el esquema real, en un Postgres
// embebido (PGlite). Imita lo mínimo de Supabase: roles anon/authenticated,
// el esquema auth y auth.uid() leyendo el "sub" del JWT.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const SHIM = `
create role anon nologin;
create role authenticated nologin;
create schema auth;
create table auth.users (id uuid primary key, email text);
create function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
$$;
grant usage on schema auth to anon, authenticated;
grant usage on schema public to anon, authenticated;
grant execute on function auth.uid() to anon, authenticated;
`;

const STAFF = "00000000-0000-0000-0000-0000000000a1";
const ANA = "00000000-0000-0000-0000-0000000000b1";
const LUIS = "00000000-0000-0000-0000-0000000000b2";
const STRANGER = "00000000-0000-0000-0000-0000000000c1";

let db: PGlite;
let anaPatient: string;
let luisPatient: string;

async function as(user: string | null, sql: string, params: unknown[] = []) {
  await db.exec("reset role;");
  if (user === null) {
    await db.exec("set role anon; select set_config('request.jwt.claim.sub', '', false);");
  } else {
    await db.exec(`set role authenticated; select set_config('request.jwt.claim.sub', '${user}', false);`);
  }
  try {
    return await db.query(sql, params);
  } finally {
    await db.exec("reset role;");
  }
}

beforeAll(async () => {
  db = new PGlite();
  await db.exec(SHIM);
  const migration = readFileSync(join(__dirname, "../../supabase/migrations/20261024000000_init.sql"), "utf8");
  await db.exec(migration);

  await db.exec(`
    insert into auth.users (id, email) values
      ('${STAFF}', 'equipo@ejemplo.mx'), ('${ANA}', 'ana@ejemplo.mx'),
      ('${LUIS}', 'luis@ejemplo.mx'), ('${STRANGER}', 'x@ejemplo.mx');
    insert into public.staff (user_id, name, role) values ('${STAFF}', 'Coordinación', 'admin');
    insert into public.leads (name, email, phone, glp1, privacy_version)
      values ('Ana', 'ana@ejemplo.mx', '5512345678', 'actualmente', 'v0');
  `);
  const ana = await db.query<{ id: string }>(
    `insert into public.patients (user_id, display_name, email, phone, start_date)
     values ($1, 'Ana', 'ana@ejemplo.mx', '5512345678', current_date - 15) returning id`,
    [ANA],
  );
  const luis = await db.query<{ id: string }>(
    `insert into public.patients (user_id, display_name, email, phone, status)
     values ($1, 'Luis', 'luis@ejemplo.mx', '5587654321', 'baja') returning id`,
    [LUIS],
  );
  anaPatient = ana.rows[0].id;
  luisPatient = luis.rows[0].id;
  await db.query("insert into public.checkins (patient_id, week, weight_kg) values ($1, 1, 82.0)", [luisPatient]);
});

afterAll(async () => {
  await db.close();
});

describe("acceso anónimo", () => {
  it("no puede leer ninguna tabla", async () => {
    for (const table of ["leads", "screenings", "patients", "checkins", "events", "staff"]) {
      await expect(as(null, `select * from public.${table}`)).rejects.toThrow(/permission denied/);
    }
  });

  it("no puede escribir leads", async () => {
    await expect(
      as(
        null,
        `insert into public.leads (name, email, phone, glp1, privacy_version)
         values ('X', 'x@ejemplo.mx', '5500000000', 'no', 'v0')`,
      ),
    ).rejects.toThrow(/permission denied/);
  });
});

describe("paciente", () => {
  it("ve solo su propio registro", async () => {
    const res = await as(ANA, "select display_name from public.patients");
    expect(res.rows).toEqual([{ display_name: "Ana" }]);
  });

  it("no ve leads ni tamizajes", async () => {
    expect((await as(ANA, "select * from public.leads")).rows).toHaveLength(0);
    expect((await as(ANA, "select * from public.screenings")).rows).toHaveLength(0);
  });

  it("registra su check-in y la base calcula la semana y la alerta", async () => {
    await as(
      ANA,
      `insert into public.checkins (patient_id, week, weight_kg, mood, flagged)
       values ($1, 40, 80.5, 1, false)`,
      [anaPatient],
    );
    const res = await as(ANA, "select week, flagged from public.checkins");
    expect(res.rows).toEqual([{ week: 3, flagged: true }]);
  });

  it("corrige su check-in de la semana con upsert sin cambiar de semana", async () => {
    const res = await as(
      ANA,
      `insert into public.checkins (patient_id, week, weight_kg, mood)
       values ($1, 1, 80.1, 4)
       on conflict (patient_id, week) do update
         set weight_kg = excluded.weight_kg, mood = excluded.mood, week = 9
       returning week, weight_kg, flagged`,
      [anaPatient],
    );
    expect(res.rows).toEqual([{ week: 3, weight_kg: "80.1", flagged: false }]);
    const count = await as(ANA, "select count(*)::int as n from public.checkins");
    expect(count.rows).toEqual([{ n: 1 }]);
  });

  it("no puede registrar check-ins de otra persona", async () => {
    await expect(as(ANA, "insert into public.checkins (patient_id, week) values ($1, 1)", [luisPatient])).rejects.toThrow(
      /row-level security/,
    );
  });

  it("no ve check-ins de otra persona", async () => {
    const res = await as(ANA, "select patient_id from public.checkins");
    expect(res.rows.every((r) => (r as { patient_id: string }).patient_id === anaPatient)).toBe(true);
  });

  it("un paciente dado de baja no puede registrar check-ins", async () => {
    await expect(as(LUIS, "insert into public.checkins (patient_id, week) values ($1, 2)", [luisPatient])).rejects.toThrow(
      /row-level security/,
    );
  });

  it("no puede modificar su propio registro de paciente", async () => {
    const res = await as(ANA, "update public.patients set status = 'completado' returning id");
    expect(res.rows).toHaveLength(0);
  });
});

describe("usuario autenticado sin rol", () => {
  it("no ve pacientes ni check-ins", async () => {
    expect((await as(STRANGER, "select * from public.patients")).rows).toHaveLength(0);
    expect((await as(STRANGER, "select * from public.checkins")).rows).toHaveLength(0);
  });
});

describe("equipo", () => {
  it("ve todos los pacientes, leads y check-ins", async () => {
    expect((await as(STAFF, "select * from public.patients")).rows).toHaveLength(2);
    expect((await as(STAFF, "select * from public.leads")).rows).toHaveLength(1);
    expect((await as(STAFF, "select * from public.checkins")).rows.length).toBeGreaterThanOrEqual(2);
  });

  it("puede actualizar el estado de un lead", async () => {
    const res = await as(STAFF, "update public.leads set status = 'contactado' returning status");
    expect(res.rows).toEqual([{ status: "contactado" }]);
  });
});
