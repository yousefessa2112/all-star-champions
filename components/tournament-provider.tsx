"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_STATE } from "@/lib/default-data";
import { GroupName, Team, TournamentState } from "@/lib/types";

type NewTeamInput = Omit<Team, "id" | "createdAt" | "status">;

type TournamentContextValue = {
  state: TournamentState;
  spotsRemaining: number;
  registerTeam: (payload: NewTeamInput) => Promise<{ ok: boolean; message?: string }>;
  submitContactMessage: (name: string, message: string) => Promise<void>;
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
  if (!res.ok) {
    throw new Error("Failed to fetch state");
  }
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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchState()
      .then((s) => {
        setState(s);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      fetchState()
        .then((s) => setState(s))
        .catch(() => {});
    }, 5000);
    return () => window.clearInterval(id);
  }, []);

  const spotsRemaining = useMemo(
    () => Math.max(0, state.settings.maxTeams - state.teams.filter((t) => t.status !== "denied").length),
    [state.settings.maxTeams, state.teams],
  );

  const registerTeam: TournamentContextValue["registerTeam"] = async (payload) => {
    const result = await postAction({ type: "register-team", payload });
    if (result.state) {
      setState(result.state);
    }
    return { ok: result.ok, message: result.message };
  };

  const submitContactMessage: TournamentContextValue["submitContactMessage"] = async (name, message) => {
    const result = await postAction({ type: "contact-message", payload: { name, message } });
    if (result.state) {
      setState(result.state);
    }
  };

  const setRegistrationOpen: TournamentContextValue["setRegistrationOpen"] = async (open) => {
    const result = await postAction({ type: "set-registration-open", payload: { open } });
    if (result.state) {
      setState(result.state);
    }
  };

  const setGroupsVisible: TournamentContextValue["setGroupsVisible"] = async (visible) => {
    const result = await postAction({ type: "set-groups-visible", payload: { visible } });
    if (result.state) {
      setState(result.state);
    }
  };

  const setBracketVisible: TournamentContextValue["setBracketVisible"] = async (visible) => {
    const result = await postAction({ type: "set-bracket-visible", payload: { visible } });
    if (result.state) {
      setState(result.state);
    }
  };

  const setNextTournamentDate: TournamentContextValue["setNextTournamentDate"] = async (date) => {
    const result = await postAction({ type: "set-next-date", payload: { date } });
    if (result.state) {
      setState(result.state);
    }
  };

  const drawGroups: TournamentContextValue["drawGroups"] = async () => {
    const result = await postAction({ type: "draw-groups" });
    if (result.state) {
      setState(result.state);
    }
    return { ok: result.ok, message: result.message };
  };

  const assignTeamToGroup: TournamentContextValue["assignTeamToGroup"] = async (teamId, group) => {
    const result = await postAction({ type: "assign-team-group", payload: { teamId, group } });
    if (result.state) {
      setState(result.state);
    }
  };

  const updateGroupMatchScore: TournamentContextValue["updateGroupMatchScore"] = async (
    matchId,
    homeScore,
    awayScore,
  ) => {
    const result = await postAction({ type: "update-group-score", payload: { matchId, homeScore, awayScore } });
    if (result.state) {
      setState(result.state);
    }
  };

  const updateBracketMatchScore: TournamentContextValue["updateBracketMatchScore"] = async (
    matchId,
    homeScore,
    awayScore,
  ) => {
    const result = await postAction({ type: "update-bracket-score", payload: { matchId, homeScore, awayScore } });
    if (result.state) {
      setState(result.state);
    }
  };

  const setTeamStatus: TournamentContextValue["setTeamStatus"] = async (teamId, status) => {
    const result = await postAction({ type: "set-team-status", payload: { teamId, status } });
    if (result.state) {
      setState(result.state);
    }
  };

  const editTeam: TournamentContextValue["editTeam"] = async (teamId, payload) => {
    const result = await postAction({ type: "edit-team", payload: { teamId, ...payload } });
    if (result.state) {
      setState(result.state);
    }
    return { ok: result.ok, message: result.message };
  };

  const deleteTeam: TournamentContextValue["deleteTeam"] = async (teamId) => {
    const result = await postAction({ type: "delete-team", payload: { teamId } });
    if (result.state) {
      setState(result.state);
    }
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
    setTeamStatus,
    editTeam,
    deleteTeam,
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
