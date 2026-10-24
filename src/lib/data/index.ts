import "server-only";
import { assertModeAllowed, isDemo } from "@/lib/env";
import { memoryRepo } from "./memory";
import { supabaseRepo } from "./supabase";
import type { Repo } from "./types";

export function getRepo(): Repo {
  assertModeAllowed();
  return isDemo() ? memoryRepo() : supabaseRepo();
}

export * from "./types";
