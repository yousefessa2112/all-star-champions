import { BracketMatch, GroupMatch, GroupName, TournamentState, ALL_GROUPS } from "@/lib/types";

const emptyGroups = (): Record<GroupName, string[]> => {
  const groups = {} as Record<GroupName, string[]>;
  ALL_GROUPS.forEach((g) => { groups[g] = []; });
  return groups;
};

const emptyStandings = () => {
  const standings = {} as Record<GroupName, never[]>;
  ALL_GROUPS.forEach((g) => { standings[g] = []; });
  return standings;
};

const makeGroupMatches = (groups: Record<GroupName, string[]>): GroupMatch[] => {
  const matches: GroupMatch[] = [];
  ALL_GROUPS.forEach((group) => {
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
      id: `r16-${i + 1}`,
      round: "round-of-16" as const,
      homeTeamId: null,
      awayTeamId: null,
      homeScore: null,
      awayScore: null,
    })),
    ...Array.from({ length: 4 }, (_, i) => ({
      id: `qf-${i + 1}`,
      round: "quarterfinals" as const,
      homeTeamId: null,
      awayTeamId: null,
      homeScore: null,
      awayScore: null,
    })),
    ...Array.from({ length: 2 }, (_, i) => ({
      id: `sf-${i + 1}`,
      round: "semifinals" as const,
      homeTeamId: null,
      awayTeamId: null,
      homeScore: null,
      awayScore: null,
    })),
    {
      id: "f-1",
      round: "final" as const,
      homeTeamId: null,
      awayTeamId: null,
      homeScore: null,
      awayScore: null,
    },
  ];
};

const groups = emptyGroups();

export const DEFAULT_STATE: TournamentState = {
  teams: [],
  groups,
  groupMatches: makeGroupMatches(groups),
  standings: emptyStandings(),
  bracketMatches: emptyBracket(),
  contactMessages: [],
  settings: {
    maxTeams: 32,
    registrationOpen: true,
    groupsVisible: false,
    bracketVisible: false,
    nextTournamentDate: "2026-05-31T02:00:00.000Z",
  },
};

export const STORAGE_KEY = "all-star-champions-state-v2";
