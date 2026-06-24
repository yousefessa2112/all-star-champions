import { Redis } from "@upstash/redis";
import { DEFAULT_STATE } from "@/lib/default-data";
import { TournamentState } from "@/lib/types";
import path from "path";
import fs from "fs";

const KV_KEY = "tournament-state-v2";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const normalizeState = (raw: TournamentState): TournamentState => {
  return {
    ...DEFAULT_STATE,
    ...raw,
    teams: (raw.teams ?? []).map((team) => ({
      ...team,
      status: team.status ?? "approved",
    })),
    contactMessages: raw.contactMessages ?? [],
    settings: { ...DEFAULT_STATE.settings, ...raw.settings },
  };
};

// ---------------------------------------------------------------------------
// Redis client (Upstash REST API)
//
// Supports two REDIS_URL formats:
//   1. https://<host>  — Upstash REST URL; also needs REDIS_TOKEN
//   2. rediss://default:<token>@<host>:<port>  — standard Redis URL (convert)
//   3. redis://default:<token>@<host>:<port>   — same, non-TLS variant
// ---------------------------------------------------------------------------

function buildRedisClient(): Redis | null {
  const rawUrl = process.env.REDIS_URL;
  if (!rawUrl) return null;

  if (rawUrl.startsWith("https://")) {
    // Already an Upstash REST URL
    const token = process.env.REDIS_TOKEN ?? "";
    return new Redis({ url: rawUrl, token });
  }

  // Parse standard redis:// or rediss:// URL and convert to Upstash REST
  try {
    const parsed = new URL(rawUrl);
    const restUrl = `https://${parsed.hostname}`;
    // Upstash token is the password field in the standard URL
    const token = parsed.password || parsed.username;
    return new Redis({ url: restUrl, token });
  } catch {
    console.error("server-store: failed to parse REDIS_URL:", rawUrl);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Filesystem fallback (local dev only — when REDIS_URL is not set)
// ---------------------------------------------------------------------------

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "tournament-state.json");

function fsRead(): TournamentState | null {
  try {
    if (!fs.existsSync(DATA_FILE)) return null;
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw) as TournamentState;
  } catch {
    return null;
  }
}

function fsWrite(state: TournamentState): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), "utf-8");
}

// ---------------------------------------------------------------------------
// Public API — same interface as before
// ---------------------------------------------------------------------------

export async function readState(): Promise<TournamentState> {
  const redis = buildRedisClient();

  if (redis) {
    try {
      const data = await redis.get<TournamentState>(KV_KEY);
      if (!data) {
        await redis.set(KV_KEY, DEFAULT_STATE);
        return DEFAULT_STATE;
      }
      return normalizeState(data);
    } catch (error) {
      console.error("Redis read error, returning default state:", error);
      return DEFAULT_STATE;
    }
  }

  // Filesystem fallback (local dev)
  const data = fsRead();
  if (!data) {
    fsWrite(DEFAULT_STATE);
    return DEFAULT_STATE;
  }
  return normalizeState(data);
}

export async function writeState(next: TournamentState): Promise<void> {
  const redis = buildRedisClient();

  if (redis) {
    try {
      await redis.set(KV_KEY, next);
    } catch (error) {
      console.error("Redis write error:", error);
      throw error;
    }
    return;
  }

  // Filesystem fallback (local dev)
  try {
    fsWrite(next);
  } catch (error) {
    console.error("Filesystem write error:", error);
    throw error;
  }
}
