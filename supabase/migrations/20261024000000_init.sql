-- Piloto de acompañamiento en obesidad: esquema inicial.
-- Principios: datos mínimos, permisos por fila (RLS) en todas las tablas,
-- y nada accesible para usuarios anónimos. Los formularios públicos escriben
-- desde el servidor con la llave secreta; el portal del paciente lee con su sesión.

-- Tipos -----------------------------------------------------------------------

create type public.lead_status as enum (
  'nuevo', 'contactado', 'tamizaje_enviado', 'elegible', 'revisar',
  'no_elegible', 'agendado', 'activo', 'descartado'
);
create type public.glp1_status as enum ('actualmente', 'por_iniciar', 'no', 'no_se');
create type public.eligibility as enum ('elegible', 'revisar', 'no_elegible');
create type public.patient_status as enum ('activo', 'pausa', 'baja', 'completado');
create type public.deposit_status as enum ('ninguno', 'pendiente', 'pagado', 'reembolsado');
create type public.staff_role as enum ('admin', 'coordinador', 'medico');

-- Tablas ----------------------------------------------------------------------

create table public.staff (
  user_id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  role public.staff_role not null default 'coordinador',
  created_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) between 5 and 254),
  phone text not null check (char_length(phone) between 10 and 15),
  state text check (char_length(state) <= 60),
  glp1 public.glp1_status not null,
  utm_source text check (char_length(utm_source) <= 80),
  utm_medium text check (char_length(utm_medium) <= 80),
  utm_campaign text check (char_length(utm_campaign) <= 120),
  ref_code text check (char_length(ref_code) <= 40),
  price_shown_mxn integer,
  status public.lead_status not null default 'nuevo',
  screening_token text not null unique
    default replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', ''),
  privacy_version text not null,
  consent_at timestamptz not null default now(),
  notes text check (char_length(notes) <= 2000)
);
create index leads_created_at_idx on public.leads (created_at desc);

create table public.screenings (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null unique references public.leads (id) on delete cascade,
  created_at timestamptz not null default now(),
  age int not null check (age between 10 and 110),
  sex text check (sex in ('mujer', 'hombre', 'otro')),
  height_cm numeric(5, 1) not null check (height_cm between 120 and 230),
  weight_kg numeric(5, 1) not null check (weight_kg between 30 and 350),
  bmi numeric(4, 1) not null,
  waist_cm numeric(5, 1) check (waist_cm between 40 and 250),
  comorbidities text[] not null default '{}',
  risk_answers text[] not null default '{}',
  medications text check (char_length(medications) <= 1000),
  glp1 public.glp1_status not null,
  result public.eligibility not null,
  flags text[] not null default '{}',
  health_consent_at timestamptz not null default now()
);

create table public.patients (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid unique references public.leads (id) on delete set null,
  user_id uuid unique references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  display_name text not null,
  email text not null,
  phone text not null,
  start_date date not null default current_date,
  status public.patient_status not null default 'activo',
  program_format text not null default 'individual' check (program_format in ('individual', 'grupal')),
  deposit public.deposit_status not null default 'ninguno',
  channel text,
  dropped_at date,
  drop_reason text check (char_length(drop_reason) <= 500)
);

create table public.checkins (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients (id) on delete cascade,
  created_at timestamptz not null default now(),
  week int not null check (week between 1 and 60),
  weight_kg numeric(5, 1) check (weight_kg between 30 and 350),
  waist_cm numeric(5, 1) check (waist_cm between 40 and 250),
  took_dose text check (took_dose in ('si', 'no', 'no_aplica')),
  nausea smallint check (nausea between 0 and 3),
  constipation smallint check (constipation between 0 and 3),
  water_liters numeric(3, 1) check (water_liters between 0 and 10),
  strength_sessions smallint check (strength_sessions between 0 and 14),
  mood smallint check (mood between 1 and 5),
  warning_signs text[] not null default '{}',
  note text check (char_length(note) <= 1000),
  flagged boolean not null default false,
  unique (patient_id, week)
);

create table public.events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text not null check (name in ('landing_view', 'cta_click', 'waitlist_submit')),
  session_id text not null check (char_length(session_id) <= 64),
  utm_source text check (char_length(utm_source) <= 80),
  utm_medium text check (char_length(utm_medium) <= 80),
  utm_campaign text check (char_length(utm_campaign) <= 120),
  ref_code text check (char_length(ref_code) <= 40)
);
create index events_created_at_idx on public.events (created_at desc);

create table public.channel_costs (
  id uuid primary key default gen_random_uuid(),
  month date not null,
  channel text not null check (char_length(channel) <= 80),
  amount_mxn numeric(10, 2) not null default 0 check (amount_mxn >= 0),
  hours numeric(6, 1) not null default 0 check (hours >= 0),
  note text check (char_length(note) <= 500),
  unique (month, channel)
);

-- Reglas que la base aplica aunque el cliente mienta -------------------------

-- La semana del check-in y la bandera de alerta se calculan en la base,
-- no se aceptan del navegador.
create or replace function public.checkins_compute()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  start date;
begin
  if tg_op = 'UPDATE' then
    -- Una corrección no mueve el registro a otra semana ni a otro paciente.
    new.patient_id := old.patient_id;
    new.week := old.week;
    new.created_at := old.created_at;
    new.flagged := coalesce(array_length(new.warning_signs, 1), 0) > 0
      or coalesce(new.mood, 5) = 1
      or coalesce(new.nausea, 0) = 3;
    return new;
  end if;
  select p.start_date into start from public.patients p where p.id = new.patient_id;
  if start is null then
    raise exception 'paciente inexistente';
  end if;
  -- Fecha local de México: la semana cambia a medianoche de CDMX, no de UTC.
  new.week := greatest(1, floor((((now() at time zone 'America/Mexico_City')::date) - start) / 7.0)::int + 1);
  new.flagged := coalesce(array_length(new.warning_signs, 1), 0) > 0
    or coalesce(new.mood, 5) = 1
    or coalesce(new.nausea, 0) = 3;
  return new;
end;
$$;

create trigger checkins_compute
before insert or update on public.checkins
for each row execute function public.checkins_compute();

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.staff s where s.user_id = auth.uid());
$$;

-- Permisos --------------------------------------------------------------------

alter table public.staff enable row level security;
alter table public.leads enable row level security;
alter table public.screenings enable row level security;
alter table public.patients enable row level security;
alter table public.checkins enable row level security;
alter table public.events enable row level security;
alter table public.channel_costs enable row level security;

-- Nadie anónimo toca ninguna tabla.
revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage on all sequences in schema public to authenticated;

create policy staff_read on public.staff
  for select to authenticated
  using (user_id = auth.uid() or public.is_staff());

create policy leads_staff on public.leads
  for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

create policy screenings_staff on public.screenings
  for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

create policy events_staff on public.events
  for select to authenticated
  using (public.is_staff());

create policy costs_staff on public.channel_costs
  for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

create policy patients_read on public.patients
  for select to authenticated
  using (user_id = auth.uid() or public.is_staff());

create policy patients_staff_write on public.patients
  for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

create policy checkins_read on public.checkins
  for select to authenticated
  using (
    public.is_staff()
    or patient_id in (select p.id from public.patients p where p.user_id = auth.uid())
  );

create policy checkins_patient_insert on public.checkins
  for insert to authenticated
  with check (
    patient_id in (
      select p.id from public.patients p
      where p.user_id = auth.uid() and p.status = 'activo'
    )
  );

create policy checkins_patient_update on public.checkins
  for update to authenticated
  using (patient_id in (select p.id from public.patients p where p.user_id = auth.uid()))
  with check (
    patient_id in (
      select p.id from public.patients p
      where p.user_id = auth.uid() and p.status = 'activo'
    )
  );
