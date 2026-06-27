import { DEFAULT_STATE } from "@/lib/default-data";
import { TournamentState } from "@/lib/types";
import { get, put } from "@vercel/blob";
import path from "path";
import fs from "fs";

const BLOB_KEY = "all-star-champions/tournament-state-v2.json";

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
// Vercel Blob client
//
// Uses BLOB_READ_WRITE_TOKEN which is auto-provisioned on Vercel deployments.
// Falls back to the local filesystem when the token is missing (local dev).
// ---------------------------------------------------------------------------

function hasBlobToken(): boolean {
  return typeof process.env.BLOB_READ_WRITE_TOKEN === "string" &&
    process.env.BLOB_READ_WRITE_TOKEN.trim().length > 0;
}

async function blobRead(): Promise<TournamentState | null> {
  try {
    const result = await get(BLOB_KEY, { access: "public" });
    if (!result || result.statusCode === 304 || result.stream === null) {
      return null;
    }
    const text = await new Response(result.stream).text();
    return text ? (JSON.parse(text) as TournamentState) : null;
  } catch (error) {
    console.error("[server-store] Blob read error:", error);
    throw error;
  }
}

async function blobWrite(state: TournamentState): Promise<void> {
  await put(BLOB_KEY, JSON.stringify(state, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}

// ---------------------------------------------------------------------------
// Filesystem fallback (local dev only — when BLOB_READ_WRITE_TOKEN is not set)
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
  if (hasBlobToken()) {
    try {
      const data = await blobRead();
      if (!data) {
        await blobWrite(DEFAULT_STATE);
        return DEFAULT_STATE;
      }
      return normalizeState(data);
    } catch (error) {
      console.error("Blob read error, returning default state:", error);
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
  if (hasBlobToken()) {
    try {
      await blobWrite(next);
    } catch (error) {
      console.error("Blob write error:", error);
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
