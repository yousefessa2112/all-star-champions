export type GroupName = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";

export const ALL_GROUPS: GroupName[] = ["A", "B", "C", "D", "E", "F", "G", "H"];

export type Team = {
  id: string;
  name: string;
  captainName: string;
  captainPhone: string;
  captainEmail: string;
  players: string[];
  status: "pending" | "approved" | "denied";
  createdAt: string;
};

export type GroupMatch = {
  id: string;
  group: GroupName;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
};

export type GroupStanding = {
  teamId: string;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
};

export type BracketRound = "round-of-16" | "quarterfinals" | "semifinals" | "final";

export type BracketMatch = {
  id: string;
  round: BracketRound;
  homeTeamId: string | null;
  awayTeamId: string | null;
  homeScore: number | null;
  awayScore: number | null;
};

export type ContactMessage = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

export type TournamentSettings = {
  maxTeams: number;
  registrationOpen: boolean;
  groupsVisible: boolean;
  bracketVisible: boolean;
  nextTournamentDate: string;
};

export type TournamentState = {
  teams: Team[];
  groups: Record<GroupName, string[]>;
  groupMatches: GroupMatch[];
  standings: Record<GroupName, GroupStanding[]>;
  bracketMatches: BracketMatch[];
  contactMessages: ContactMessage[];
  settings: TournamentSettings;
};
