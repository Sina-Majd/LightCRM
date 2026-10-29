import { PGlite } from "@electric-sql/pglite";

/** Only Supabase-owned Auth primitives are supplied by the test harness. */
export async function createTestDatabase() {
  const database = new PGlite();
  await database.exec(`
    create role anon nologin;
    create role authenticated nologin;
    create role service_role nologin bypassrls;
    create schema auth;
    create table auth.users (id uuid primary key, email text, raw_user_meta_data jsonb default '{}');
    create function auth.uid() returns uuid language sql stable as $$
      select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
    $$;
    grant usage on schema auth, public to authenticated, anon;
    grant execute on function auth.uid() to authenticated, anon;
  `);
  return database;
}

export async function authenticate(database: PGlite, userId: string) {
  await database.exec("reset role");
  await database.query("select set_config('request.jwt.claim.sub', $1, false)", [userId]);
  await database.exec("set role authenticated");
}
