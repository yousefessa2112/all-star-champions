"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_STATE, STORAGE_KEY } from "@/lib/default-data";
import {
  buildGroupMatches,
  computeStandings,
  drawGroupsRandomly,
  seedBracketFromStandings,
} from "@/lib/tournament-utils";
import { BracketMatch, GroupMatch, GroupName, Team, TournamentState } from "@/lib/types";

type NewTeamInput = Omit<Team, "id" | "createdAt">;

type TournamentContextValue = {
  state: TournamentState;
  spotsRemaining: number;
  registerTeam: (payload: NewTeamInput) => { ok: boolean; message?: string };
  submitContactMessage: (name: string, message: string) => void;
  setRegistrationOpen: (open: boolean) => void;
  setGroupsVisible: (visible: boolean) => void;
  setBracketVisible: (visible: boolean) => void;
  setNextTournamentDate: (date: string) => void;
  drawGroups: () => { ok: boolean; message?: string };
  assignTeamToGroup: (teamId: string, group: GroupName) => void;
  updateGroupMatchScore: (matchId: string, homeScore: number, awayScore: number) => void;
  updateBracketMatchScore: (matchId: string, homeScore: number, awayScore: number) => void;
};

const TournamentContext = createContext<TournamentContextValue | null>(null);

const ensureUniqueAcrossGroups = (
  groups: Record<GroupName, string[]>,
  teamId: string,
  targetGroup: GroupName,
) => {
  const next: Record<GroupName, string[]> = {
    A: groups.A.filter((id) => id !== teamId),
    B: groups.B.filter((id) => id !== teamId),
    C: groups.C.filter((id) => id !== teamId),
    D: groups.D.filter((id) => id !== teamId),
  };
  if (next[targetGroup].length < 4) {
    next[targetGroup].push(teamId);
  }
  return next;
};

export function TournamentProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<TournamentState>(() => {
    try {
      if (typeof window === "undefined") {
        return DEFAULT_STATE;
      }
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as TournamentState;
        return {
          ...DEFAULT_STATE,
          ...parsed,
          settings: { ...DEFAULT_STATE.settings, ...parsed.settings },
        };
      }
    } catch {
      return DEFAULT_STATE;
    }
    return DEFAULT_STATE;
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const spotsRemaining = useMemo(
    () => Math.max(0, state.settings.maxTeams - state.teams.length),
    [state.settings.maxTeams, state.teams.length],
  );

  const registerTeam: TournamentContextValue["registerTeam"] = (payload) => {
    if (!state.settings.registrationOpen) {
      return { ok: false, message: "Registration is currently closed." };
    }
    if (state.teams.length >= state.settings.maxTeams) {
      return { ok: false, message: "All spots are filled." };
    }
    const duplicate = state.teams.some(
      (team) => team.name.trim().toLowerCase() === payload.name.trim().toLowerCase(),
    );
    if (duplicate) {
      return { ok: false, message: "Team name already exists." };
    }
    const cleanPlayers = payload.players.map((p) => p.trim()).filter(Boolean);
    if (cleanPlayers.length < 5 || cleanPlayers.length > 7) {
      return { ok: false, message: "Team must have between 5 and 7 players." };
    }
    const nextTeam: Team = {
      ...payload,
      players: cleanPlayers,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({ ...prev, teams: [...prev.teams, nextTeam] }));
    return { ok: true };
  };

  const submitContactMessage = (name: string, message: string) => {
    setState((prev) => ({
      ...prev,
      contactMessages: [
        ...prev.contactMessages,
        {
          id: crypto.randomUUID(),
          name,
          message,
          createdAt: new Date().toISOString(),
        },
      ],
    }));
  };

  const setRegistrationOpen = (open: boolean) => {
    setState((prev) => ({ ...prev, settings: { ...prev.settings, registrationOpen: open } }));
  };

  const setGroupsVisible = (visible: boolean) => {
    setState((prev) => ({ ...prev, settings: { ...prev.settings, groupsVisible: visible } }));
  };

  const setBracketVisible = (visible: boolean) => {
    setState((prev) => ({ ...prev, settings: { ...prev.settings, bracketVisible: visible } }));
  };

  const setNextTournamentDate = (date: string) => {
    setState((prev) => ({ ...prev, settings: { ...prev.settings, nextTournamentDate: date } }));
  };

  const drawGroups = () => {
    if (state.teams.length !== state.settings.maxTeams) {
      return { ok: false, message: `You need exactly ${state.settings.maxTeams} teams to draw groups.` };
    }
    const nextGroups = drawGroupsRandomly(state.teams.map((team) => team.id));
    const groupMatches = buildGroupMatches(nextGroups);
    const standings = computeStandings(nextGroups, groupMatches);
    setState((prev) => ({
      ...prev,
      groups: nextGroups,
      groupMatches,
      standings,
      settings: { ...prev.settings, groupsVisible: true },
    }));
    return { ok: true };
  };

  const assignTeamToGroup = (teamId: string, group: GroupName) => {
    setState((prev) => {
      const nextGroups = ensureUniqueAcrossGroups(prev.groups, teamId, group);
      const groupMatches = buildGroupMatches(nextGroups);
      const standings = computeStandings(nextGroups, groupMatches);
      return { ...prev, groups: nextGroups, groupMatches, standings };
    });
  };

  const updateGroupMatchScore = (matchId: string, homeScore: number, awayScore: number) => {
    setState((prev) => {
      const nextMatches: GroupMatch[] = prev.groupMatches.map((match) =>
        match.id === matchId ? { ...match, homeScore, awayScore } : match,
      );
      const standings = computeStandings(prev.groups, nextMatches);
      const bracketMatches = seedBracketFromStandings(standings, prev.bracketMatches);
      return { ...prev, groupMatches: nextMatches, standings, bracketMatches };
    });
  };

  const updateBracketMatchScore = (matchId: string, homeScore: number, awayScore: number) => {
    setState((prev) => {
      const nextMatches: BracketMatch[] = prev.bracketMatches.map((match) =>
        match.id === matchId ? { ...match, homeScore, awayScore } : match,
      );
      return { ...prev, bracketMatches: nextMatches };
    });
  };

  const value: TournamentContextValue = {
    state,
    spotsRemaining,
    registerTeam,
    submitContactMessage,
    setRegistrationOpen,
    setGroupsVisible,
    setBracketVisible,
    setNextTournamentDate,
    drawGroups,
    assignTeamToGroup,
    updateGroupMatchScore,
    updateBracketMatchScore,
  };

  return <TournamentContext.Provider value={value}>{children}</TournamentContext.Provider>;
}

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error("useTournament must be used within TournamentProvider");
  }
  return context;
};