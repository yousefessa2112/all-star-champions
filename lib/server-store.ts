import { promises as fs } from "node:fs";
import path from "node:path";
import { DEFAULT_STATE } from "@/lib/default-data";
import { TournamentState } from "@/lib/types";

const dataDir = process.env.NODE_ENV === "production" ? "/tmp" : path.join(process.cwd(), ".data");
const dataFile = path.join(dataDir, "tournament-state.json");

const normalizeState = (raw: TournamentState): TournamentState => {
  return {
    ...DEFAULT_STATE,
    ...raw,
    teams: (raw.teams ?? []).map((team) => ({
      ...team,
      status: team.status ?? "approved",
    })),
    settings: { ...DEFAULT_STATE.settings, ...raw.settings },
  };
};

export async function readState(): Promise<TournamentState> {
  try {
    const content = await fs.readFile(dataFile, "utf8");
    const parsed = JSON.parse(content) as TournamentState;
    return normalizeState(parsed);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(dataFile, JSON.stringify(DEFAULT_STATE, null, 2), "utf8");
    return DEFAULT_STATE;
  }
}

export async function writeState(next: TournamentState): Promise<void> {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(next, null, 2), "utf8");
}