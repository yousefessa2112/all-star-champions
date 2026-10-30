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

// The SDK accepts either a static read-write token, or an OIDC token paired
// with a store id. Vercel now provisions the latter pair by default, so
// checking only for BLOB_READ_WRITE_TOKEN sends live deployments down the
// local-filesystem path, which does not exist on a serverless runtime.
function hasBlobToken(): boolean {
  const readWrite = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (readWrite) return true;
  const storeId = process.env.BLOB_STORE_ID?.trim();
  const oidcToken = process.env.VERCEL_OIDC_TOKEN?.trim();
  return Boolean(storeId && oidcToken);
}

const BLOB_TIMEOUT_MS = 7000;

function withTimeout<T>(work: Promise<T>, label: string): Promise<T> {
  return Promise.race([
    work,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${BLOB_TIMEOUT_MS}ms`)), BLOB_TIMEOUT_MS),
    ),
  ]);
}

async function blobRead(): Promise<TournamentState | null> {
  try {
    const result = await withTimeout(get(BLOB_KEY, { access: "public" }), "blob read");
    if (!result || result.statusCode === 304 || result.stream === null) {
      return null;
    }
    const text = await new Response(result.stream).text();
    return text ? (JSON.parse(text) as TournamentState) : null;
  } catch (error) {
    // A missing blob is the normal first-run case, not a failure.
    console.warn("[server-store] Blob read failed, treating as empty:", error);
    return null;
  }
}

async function blobWrite(state: TournamentState): Promise<void> {
  await withTimeout(
    put(BLOB_KEY, JSON.stringify(state, null, 2), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
    }),
    "blob write",
  );
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
        // Seed the store, but never let seeding break a read.
        try {
          await blobWrite(DEFAULT_STATE);
        } catch (seedError) {
          console.error("[server-store] Could not seed blob:", seedError);
        }
        return DEFAULT_STATE;
      }
      return normalizeState(data);
    } catch (error) {
      console.error("[server-store] readState failed, serving defaults:", error);
      return DEFAULT_STATE;
    }
  }

  // Filesystem fallback (local dev)
  try {
    const data = fsRead();
    if (!data) {
      fsWrite(DEFAULT_STATE);
      return DEFAULT_STATE;
    }
    return normalizeState(data);
  } catch (error) {
    console.error("[server-store] Filesystem read failed, serving defaults:", error);
    return DEFAULT_STATE;
  }
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
