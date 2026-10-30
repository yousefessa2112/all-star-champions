"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_STATE } from "@/lib/default-data";
import { GroupName, Team, TournamentState } from "@/lib/types";

type NewTeamInput = Omit<Team, "id" | "createdAt" | "status">;

type TournamentContextValue = {
  state: TournamentState;
  spotsRemaining: number;
  registerTeam: (payload: NewTeamInput) => Promise<{ ok: boolean; message?: string }>;
  submitContactMessage: (name: string, message: string, email?: string) => Promise<void>;
  deleteContactMessage: (messageId: string) => Promise<void>;
  setRegistrationOpen: (open: boolean) => Promise<void>;
  setGroupsVisible: (visible: boolean) => Promise<void>;
  setBracketVisible: (visible: boolean) => Promise<void>;
  setNextTournamentDate: (date: string) => Promise<void>;
  drawGroups: () => Promise<{ ok: boolean; message?: string }>;
  assignTeamToGroup: (teamId: string, group: GroupName) => Promise<void>;
  updateGroupMatchScore: (matchId: string, homeScore: number, awayScore: number) => Promise<void>;
  updateBracketMatchScore: (matchId: string, homeScore: number, awayScore: number) => Promise<void>;
  setTeamStatus: (teamId: string, status: "pending" | "approved" | "denied") => Promise<void>;
  editTeam: (teamId: string, payload: NewTeamInput) => Promise<{ ok: boolean; message?: string }>;
  deleteTeam: (teamId: string) => Promise<void>;
};

const TournamentContext = createContext<TournamentContextValue | null>(null);

async function fetchState(): Promise<TournamentState> {
  const res = await fetch("/api/state");
  if (!res.ok) throw new Error("Failed to fetch state");
  return res.json();
}

async function postAction(body: unknown): Promise<{ ok: boolean; state?: TournamentState; message?: string }> {
  const res = await fetch("/api/state", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Request failed" }));
    return { ok: false, message: err.message ?? "Request failed" };
  }
  return res.json();
}

export function TournamentProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<TournamentState>(DEFAULT_STATE);

  useEffect(() => {
    fetchState().then((s) => setState(s)).catch(() => {});
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      fetchState().then((s) => setState(s)).catch(() => {});
    }, 5000);
    return () => window.clearInterval(id);
  }, []);

  // Only approved teams take a spot. Pending submissions are not counted
  // publicly and do not consume capacity until an admin approves them.
  const spotsRemaining = useMemo(
    () => Math.max(0, state.settings.maxTeams - state.teams.filter((t) => t.status === "approved").length),
    [state.settings.maxTeams, state.teams],
  );

  const act = async (body: unknown) => {
    const result = await postAction(body);
    if (result.state) setState(result.state);
    return result;
  };

  const registerTeam: TournamentContextValue["registerTeam"] = async (payload) => {
    const result = await act({ type: "register-team", payload });
    return { ok: result.ok, message: result.message };
  };

  const submitContactMessage: TournamentContextValue["submitContactMessage"] = async (name, message, email) => {
    await act({ type: "contact-message", payload: { name, message, email } });
  };

  const deleteContactMessage: TournamentContextValue["deleteContactMessage"] = async (messageId) => {
    await act({ type: "delete-contact-message", payload: { messageId } });
  };

  const setRegistrationOpen: TournamentContextValue["setRegistrationOpen"] = async (open) => {
    await act({ type: "set-registration-open", payload: { open } });
  };

  const setGroupsVisible: TournamentContextValue["setGroupsVisible"] = async (visible) => {
    await act({ type: "set-groups-visible", payload: { visible } });
  };

  const setBracketVisible: TournamentContextValue["setBracketVisible"] = async (visible) => {
    await act({ type: "set-bracket-visible", payload: { visible } });
  };

  const setNextTournamentDate: TournamentContextValue["setNextTournamentDate"] = async (date) => {
    await act({ type: "set-next-date", payload: { date } });
  };

  const drawGroups: TournamentContextValue["drawGroups"] = async () => {
    const result = await act({ type: "draw-groups" });
    return { ok: result.ok, message: result.message };
  };

  const assignTeamToGroup: TournamentContextValue["assignTeamToGroup"] = async (teamId, group) => {
    await act({ type: "assign-team-group", payload: { teamId, group } });
  };

  const updateGroupMatchScore: TournamentContextValue["updateGroupMatchScore"] = async (matchId, homeScore, awayScore) => {
    await act({ type: "update-group-score", payload: { matchId, homeScore, awayScore } });
  };

  const updateBracketMatchScore: TournamentContextValue["updateBracketMatchScore"] = async (matchId, homeScore, awayScore) => {
    await act({ type: "update-bracket-score", payload: { matchId, homeScore, awayScore } });
  };

  const setTeamStatus: TournamentContextValue["setTeamStatus"] = async (teamId, status) => {
    await act({ type: "set-team-status", payload: { teamId, status } });
  };

  const editTeam: TournamentContextValue["editTeam"] = async (teamId, payload) => {
    const result = await act({ type: "edit-team", payload: { teamId, ...payload } });
    return { ok: result.ok, message: result.message };
  };

  const deleteTeam: TournamentContextValue["deleteTeam"] = async (teamId) => {
    await act({ type: "delete-team", payload: { teamId } });
  };

  const value: TournamentContextValue = {
    state, spotsRemaining, registerTeam, submitContactMessage, deleteContactMessage,
    setRegistrationOpen, setGroupsVisible, setBracketVisible, setNextTournamentDate,
    drawGroups, assignTeamToGroup, updateGroupMatchScore, updateBracketMatchScore,
    setTeamStatus, editTeam, deleteTeam,
  };

  return <TournamentContext.Provider value={value}>{children}</TournamentContext.Provider>;
}

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (!context) throw new Error("useTournament must be used within TournamentProvider");
  return context;
};
