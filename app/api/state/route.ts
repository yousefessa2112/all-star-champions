import { NextResponse } from "next/server";
import { readState, writeState } from "@/lib/server-store";
import { buildGroupMatches, computeStandings, drawGroupsRandomly, seedBracketFromStandings } from "@/lib/tournament-utils";
import { sendContactEmail, sendRegistrationConfirmation } from "@/lib/email";
import { GroupMatch, GroupName, Team } from "@/lib/types";

type ActionPayload =
  | { type: "register-team"; payload: Omit<Team, "id" | "createdAt" | "status"> }
  | { type: "set-registration-open"; payload: { open: boolean } }
  | { type: "set-groups-visible"; payload: { visible: boolean } }
  | { type: "set-bracket-visible"; payload: { visible: boolean } }
  | { type: "set-next-date"; payload: { date: string } }
  | { type: "draw-groups" }
  | { type: "assign-team-group"; payload: { teamId: string; group: GroupName } }
  | { type: "update-group-score"; payload: { matchId: string; homeScore: number; awayScore: number } }
  | { type: "update-bracket-score"; payload: { matchId: string; homeScore: number; awayScore: number } }
  | { type: "set-team-status"; payload: { teamId: string; status: "pending" | "approved" | "denied" } }
  | {
      type: "edit-team";
      payload: {
        teamId: string;
        name: string;
        captainName: string;
        captainPhone: string;
        captainEmail: string;
        players: string[];
      };
    }
  | { type: "delete-team"; payload: { teamId: string } }
  | { type: "contact-message"; payload: { name: string; message: string } };

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

export async function GET() {
  const state = await readState();
  return NextResponse.json(state);
}

export async function POST(request: Request) {
  const body = (await request.json()) as ActionPayload;
  const state = await readState();

  switch (body.type) {
    case "register-team": {
      if (!state.settings.registrationOpen) {
        return NextResponse.json({ ok: false, message: "Registration is currently closed." }, { status: 400 });
      }
      const activeTeams = state.teams.filter((t) => t.status !== "denied");
      if (activeTeams.length >= state.settings.maxTeams) {
        return NextResponse.json({ ok: false, message: "All spots are filled." }, { status: 400 });
      }
      const duplicate = state.teams.some(
        (team) => team.name.trim().toLowerCase() === body.payload.name.trim().toLowerCase(),
      );
      if (duplicate) {
        return NextResponse.json({ ok: false, message: "Team name already exists." }, { status: 400 });
      }
      const cleanPlayers = body.payload.players.map((p) => p.trim()).filter(Boolean);
      if (cleanPlayers.length < 5 || cleanPlayers.length > 7) {
        return NextResponse.json({ ok: false, message: "Team must have between 5 and 7 players." }, { status: 400 });
      }
      state.teams.push({
        ...body.payload,
        players: cleanPlayers,
        id: crypto.randomUUID(),
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      await writeState(state);
      
      // Send confirmation email to the team captain
      const confirmResult = await sendRegistrationConfirmation(body.payload.captainEmail, body.payload.name);
      if (!confirmResult.ok) {
        console.error("Failed to send confirmation email:", confirmResult.error);
      }
      
      return NextResponse.json({ ok: true, state, message: "Registration submitted for admin approval." });
    }
    case "contact-message": {
      state.contactMessages.push({
        id: crypto.randomUUID(),
        name: body.payload.name,
        message: body.payload.message,
        createdAt: new Date().toISOString(),
      });
      await writeState(state);
      
      // Send email notification
      const emailResult = await sendContactEmail(body.payload.name, body.payload.message);
      if (!emailResult.ok) {
        console.error("Failed to send contact email:", emailResult.error);
      }
      
      return NextResponse.json({ ok: true, state, emailSent: emailResult.ok });
    }
    case "set-registration-open":
      state.settings.registrationOpen = body.payload.open;
      break;
    case "set-groups-visible":
      state.settings.groupsVisible = body.payload.visible;
      break;
    case "set-bracket-visible":
      state.settings.bracketVisible = body.payload.visible;
      break;
    case "set-next-date":
      state.settings.nextTournamentDate = body.payload.date;
      break;
    case "draw-groups": {
      const approvedTeams = state.teams.filter((team) => team.status === "approved");
      if (approvedTeams.length !== state.settings.maxTeams) {
        return NextResponse.json(
          { ok: false, message: `You need exactly ${state.settings.maxTeams} approved teams to draw groups.` },
          { status: 400 },
        );
      }
      const nextGroups = drawGroupsRandomly(approvedTeams.map((team) => team.id));
      const groupMatches = buildGroupMatches(nextGroups);
      const standings = computeStandings(nextGroups, groupMatches);
      state.groups = nextGroups;
      state.groupMatches = groupMatches;
      state.standings = standings;
      state.settings.groupsVisible = true;
      await writeState(state);
      return NextResponse.json({ ok: true, state });
    }
    case "assign-team-group": {
      state.groups = ensureUniqueAcrossGroups(state.groups, body.payload.teamId, body.payload.group);
      state.groupMatches = buildGroupMatches(state.groups);
      state.standings = computeStandings(state.groups, state.groupMatches);
      await writeState(state);
      return NextResponse.json({ ok: true, state });
    }
    case "update-group-score": {
      const nextMatches: GroupMatch[] = state.groupMatches.map((match) =>
        match.id === body.payload.matchId
          ? { ...match, homeScore: body.payload.homeScore, awayScore: body.payload.awayScore }
          : match,
      );
      state.groupMatches = nextMatches;
      state.standings = computeStandings(state.groups, nextMatches);
      state.bracketMatches = seedBracketFromStandings(state.standings, state.bracketMatches);
      break;
    }
    case "update-bracket-score":
      state.bracketMatches = state.bracketMatches.map((match) =>
        match.id === body.payload.matchId
          ? { ...match, homeScore: body.payload.homeScore, awayScore: body.payload.awayScore }
          : match,
      );
      break;
    case "set-team-status":
      state.teams = state.teams.map((team) =>
        team.id === body.payload.teamId ? { ...team, status: body.payload.status } : team,
      );
      break;
    case "edit-team": {
      const duplicate = state.teams.some(
        (team) =>
          team.id !== body.payload.teamId &&
          team.name.trim().toLowerCase() === body.payload.name.trim().toLowerCase(),
      );
      if (duplicate) {
        return NextResponse.json({ ok: false, message: "Team name already exists." }, { status: 400 });
      }
      const cleanPlayers = body.payload.players.map((p) => p.trim()).filter(Boolean);
      if (cleanPlayers.length < 5 || cleanPlayers.length > 7) {
        return NextResponse.json({ ok: false, message: "Team must have between 5 and 7 players." }, { status: 400 });
      }
      state.teams = state.teams.map((team) =>
        team.id === body.payload.teamId
          ? {
              ...team,
              name: body.payload.name,
              captainName: body.payload.captainName,
              captainPhone: body.payload.captainPhone,
              captainEmail: body.payload.captainEmail,
              players: cleanPlayers,
            }
          : team,
      );
      break;
    }
    case "delete-team": {
      state.teams = state.teams.filter((team) => team.id !== body.payload.teamId);
      Object.keys(state.groups).forEach((g) => {
        const group = g as GroupName;
        state.groups[group] = state.groups[group].filter((id) => id !== body.payload.teamId);
      });
      state.groupMatches = buildGroupMatches(state.groups);
      state.standings = computeStandings(state.groups, state.groupMatches);
      break;
    }
    default:
      break;
  }

  await writeState(state);
  return NextResponse.json({ ok: true, state });
}