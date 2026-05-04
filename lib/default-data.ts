import { BracketMatch, GroupMatch, GroupName, TournamentState } from "@/lib/types";

const makeGroupMatches = (groups: Record<GroupName, string[]>): GroupMatch[] => {
  const matches: GroupMatch[] = [];
  (Object.keys(groups) as GroupName[]).forEach((group) => {
    const teams = groups[group];
    for (let i = 0; i < teams.length; i += 1) {
      for (let j = i + 1; j < teams.length; j += 1) {
        matches.push({
          id: `${group}-${i}-${j}`,
          group,
          homeTeamId: teams[i],
          awayTeamId: teams[j],
          homeScore: null,
          awayScore: null,
        });
      }
    }
  });
  return matches;
};

const emptyBracket = (): BracketMatch[] => {
  return [
    ...Array.from({ length: 8 }, (_, i) => ({
      id: `qf-${i + 1}`,
      round: "quarterfinals" as const,
      homeTeamId: null,
      awayTeamId: null,
      homeScore: null,
      awayScore: null,
    })),
    ...Array.from({ length: 4 }, (_, i) => ({
      id: `sf-${i + 1}`,
      round: "semifinals" as const,
      homeTeamId: null,
      awayTeamId: null,
      homeScore: null,
      awayScore: null,
    })),
    {
      id: "f-1",
      round: "final",
      homeTeamId: null,
      awayTeamId: null,
      homeScore: null,
      awayScore: null,
    },
  ];
};

export const DEFAULT_STATE: TournamentState = {
  teams: [],
  groups: { A: [], B: [], C: [], D: [] },
  groupMatches: makeGroupMatches({ A: [], B: [], C: [], D: [] }),
  standings: { A: [], B: [], C: [], D: [] },
  bracketMatches: emptyBracket(),
  contactMessages: [],
  settings: {
    maxTeams: 16,
    registrationOpen: true,
    groupsVisible: false,
    bracketVisible: false,
    nextTournamentDate: "2026-05-31T02:00:00.000Z",
  },
};

export const STORAGE_KEY = "all-star-champions-state-v1";