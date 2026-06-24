import { kv } from "@vercel/kv";
import { DEFAULT_STATE } from "@/lib/default-data";
import { TournamentState } from "@/lib/types";

const KV_KEY = "tournament-state-v2";

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

export async function readState(): Promise<TournamentState> {
  try {
    const data = await kv.get<TournamentState>(KV_KEY);
    if (!data) {
      await kv.set(KV_KEY, DEFAULT_STATE);
      return DEFAULT_STATE;
    }
    return normalizeState(data);
  } catch (error) {
    console.error("KV read error, returning default state:", error);
    return DEFAULT_STATE;
  }
}

export async function writeState(next: TournamentState): Promise<void> {
  try {
    await kv.set(KV_KEY, next);
  } catch (error) {
    console.error("KV write error:", error);
    throw error;
  }
}
