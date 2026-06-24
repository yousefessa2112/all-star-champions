import { BracketMatch, GroupName, GroupStanding, Team, ALL_GROUPS } from "@/lib/types";

export const shuffleArray = <T,>(items: T[]): T[] => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export const emptyGroups = (): Record<GroupName, string[]> => {
  const groups = {} as Record<GroupName, string[]>;
  ALL_GROUPS.forEach((g) => { groups[g] = []; });
  return groups;
};

export const emptyStandings = (): Record<GroupName, GroupStanding[]> => {
  const standings = {} as Record<GroupName, GroupStanding[]>;
  ALL_GROUPS.forEach((g) => { standings[g] = []; });
  return standings;
};

export const drawGroupsRandomly = (teamIds: string[]): Record<GroupName, string[]> => {
  const shuffled = shuffleArray(teamIds);
  const groups = emptyGroups();
  shuffled.forEach((id, index) => {
    const bucket = ALL_GROUPS[Math.floor(index / 4)];
    groups[bucket].push(id);
  });
  return groups;
};

export const buildGroupMatches = (groups: Record<GroupName, string[]>) => {
  return ALL_GROUPS.flatMap((group) => {
    const ids = groups[group];
    const matches: Array<{
      id: string;
      group: GroupName;
      homeTeamId: string;
      awayTeamId: string;
      homeScore: number | null;
      awayScore: number | null;
    }> = [];
    for (let i = 0; i < ids.length; i += 1) {
      for (let j = i + 1; j < ids.length; j += 1) {
        matches.push({
          id: `${group}-${ids[i]}-${ids[j]}`,
          group,
          homeTeamId: ids[i],
          awayTeamId: ids[j],
          homeScore: null,
          awayScore: null,
        });
      }
    }
    return matches;
  });
};

export const computeStandings = (
  groups: Record<GroupName, string[]>,
  matches: Array<{
    group: GroupName;
    homeTeamId: string;
    awayTeamId: string;
    homeScore: number | null;
    awayScore: number | null;
  }>,
): Record<GroupName, GroupStanding[]> => {
  const standings = emptyStandings();
  ALL_GROUPS.forEach((group) => {
    const table = new Map<string, GroupStanding>();
    groups[group].forEach((teamId) => {
      table.set(teamId, { teamId, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, points: 0 });
    });

    matches
      .filter((match) => match.group === group && match.homeScore !== null && match.awayScore !== null)
      .forEach((match) => {
        const home = table.get(match.homeTeamId);
        const away = table.get(match.awayTeamId);
        if (!home || !away || match.homeScore === null || match.awayScore === null) return;
        home.gf += match.homeScore;
        home.ga += match.awayScore;
        away.gf += match.awayScore;
        away.ga += match.homeScore;

        if (match.homeScore > match.awayScore) {
          home.w += 1; home.points += 3; away.l += 1;
        } else if (match.homeScore < match.awayScore) {
          away.w += 1; away.points += 3; home.l += 1;
        } else {
          home.d += 1; away.d += 1; home.points += 1; away.points += 1;
        }
      });

    standings[group] = Array.from(table.values())
      .map((row) => ({ ...row, gd: row.gf - row.ga }))
      .sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf);
  });
  return standings;
};

export const seedBracketFromStandings = (
  standings: Record<GroupName, GroupStanding[]>,
  existing: BracketMatch[],
): BracketMatch[] => {
  const rank = (group: GroupName, pos: number) => standings[group][pos]?.teamId ?? null;

  // 8 groups -> top 2 from each group -> 16 teams -> Round of 16
  // Classic FIFA-style: 1A vs 2B, 1C vs 2D, 1E vs 2F, 1G vs 2H, 1B vs 2A, 1D vs 2C, 1F vs 2E, 1H vs 2G
  const r16Seeds: [string | null, string | null][] = [
    [rank("A", 0), rank("B", 1)],
    [rank("C", 0), rank("D", 1)],
    [rank("E", 0), rank("F", 1)],
    [rank("G", 0), rank("H", 1)],
    [rank("B", 0), rank("A", 1)],
    [rank("D", 0), rank("C", 1)],
    [rank("F", 0), rank("E", 1)],
    [rank("H", 0), rank("G", 1)],
  ];

  return existing.map((match) => {
    if (match.round !== "round-of-16") return match;
    const index = Number(match.id.split("-")[1]) - 1;
    const [home, away] = r16Seeds[index] ?? [null, null];
    return { ...match, homeTeamId: home, awayTeamId: away, homeScore: null, awayScore: null };
  });
};

export const teamNameById = (teams: Team[], id: string | null): string => {
  if (!id) return "TBD";
  return teams.find((team) => team.id === id)?.name ?? "TBD";
};
