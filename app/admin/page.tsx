"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { PageShell } from "@/components/page-shell";
import { useTournament } from "@/components/tournament-provider";
import { ALL_GROUPS, GroupName, Team, TournamentState } from "@/lib/types";
import { AnimateIn } from "@/components/animate-in";
import { Lock, MessageSquare, Trash2 } from "lucide-react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<"teams" | "groups" | "scores" | "bracket" | "messages">("teams");
  const {
    state, drawGroups, assignTeamToGroup, updateGroupMatchScore, updateBracketMatchScore,
    setTeamStatus, editTeam, deleteTeam, deleteContactMessage,
    setRegistrationOpen, setGroupsVisible, setBracketVisible, setNextTournamentDate,
  } = useTournament();

  const teamById = useMemo(() => new Map(state.teams.map((team) => [team.id, team])), [state.teams]);

  const login = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password === "allstar2026") { setAuthorized(true); toast.success("Admin access granted."); return; }
    toast.error("Incorrect password.");
  };

  if (!authorized) {
    return (
      <PageShell>
        <AnimateIn>
          <section className="mx-auto max-w-md border-2 border-[#0A1628] bg-white p-8">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="h-6 w-6 text-[#FFD700]" />
              <h1 className="font-heading text-2xl font-bold tracking-wider uppercase">ADMIN PANEL</h1>
            </div>
            <form onSubmit={login} className="space-y-4">
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter admin password" className="input-field" />
              <button className="gold-btn w-full" type="submit">ENTER ADMIN</button>
            </form>
          </section>
        </AnimateIn>
      </PageShell>
    );
  }

  const tabs = [
    { id: "teams" as const, label: "TEAMS", count: state.teams.length },
    { id: "groups" as const, label: "GROUPS" },
    { id: "scores" as const, label: "SCORES" },
    { id: "bracket" as const, label: "BRACKET" },
    { id: "messages" as const, label: "MESSAGES", count: state.contactMessages.length },
  ];

  return (
    <PageShell>
      {/* Header */}
      <AnimateIn>
        <div className="mb-6">
          <p className="font-condensed text-xs font-bold tracking-[0.3em] text-[#FFD700] uppercase">MANAGEMENT</p>
          <h1 className="section-title mt-2">ADMIN PANEL</h1>
          <div className="mt-2 h-1 w-24 bg-[#FFD700]" style={{ transform: "skewX(-12deg)" }} />
        </div>
      </AnimateIn>

      {/* Settings */}
      <section className="border-2 border-[#0A1628] bg-white p-5 mb-6">
        <h2 className="font-heading text-sm font-bold tracking-wider text-[#0A1628] uppercase mb-4">SETTINGS</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="border border-[#D4D0CB] p-3">
            <span className="font-condensed text-xs font-semibold tracking-wider text-[#0A1628]/50 uppercase block mb-1">Tournament Date</span>
            <input type="datetime-local" className="w-full border border-[#D4D0CB] bg-white px-2 py-1.5 text-sm outline-none focus:border-[#FFD700]"
              onChange={(event) => setNextTournamentDate(new Date(event.target.value).toISOString())} />
          </label>
          <button type="button" className={`border p-3 font-condensed text-sm font-semibold tracking-wide transition-colors ${state.settings.registrationOpen ? "border-green-500 bg-green-50 text-green-700" : "border-[#D4D0CB] text-[#0A1628]/60"}`}
            onClick={() => setRegistrationOpen(!state.settings.registrationOpen)}>
            Registration: {state.settings.registrationOpen ? "OPEN" : "CLOSED"}
          </button>
          <button type="button" className={`border p-3 font-condensed text-sm font-semibold tracking-wide transition-colors ${state.settings.groupsVisible ? "border-green-500 bg-green-50 text-green-700" : "border-[#D4D0CB] text-[#0A1628]/60"}`}
            onClick={() => setGroupsVisible(!state.settings.groupsVisible)}>
            Groups: {state.settings.groupsVisible ? "VISIBLE" : "HIDDEN"}
          </button>
          <button type="button" className={`border p-3 font-condensed text-sm font-semibold tracking-wide transition-colors ${state.settings.bracketVisible ? "border-green-500 bg-green-50 text-green-700" : "border-[#D4D0CB] text-[#0A1628]/60"}`}
            onClick={() => setBracketVisible(!state.settings.bracketVisible)}>
            Bracket: {state.settings.bracketVisible ? "VISIBLE" : "HIDDEN"}
          </button>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-6 border-b-2 border-[#0A1628]">
        {tabs.map((tab) => (
          <button key={tab.id} type="button"
            className={`font-heading text-xs font-bold tracking-wider px-4 py-2.5 transition-colors ${activeTab === tab.id ? "bg-[#0A1628] text-white" : "text-[#0A1628]/60 hover:text-[#0A1628]"}`}
            onClick={() => setActiveTab(tab.id)}>
            {tab.label}
            {tab.count !== undefined && (
              <span className={`ml-1.5 inline-flex h-5 min-w-5 items-center justify-center text-[10px] px-1 ${activeTab === tab.id ? "bg-[#FFD700] text-[#0A1628]" : "bg-[#E8E4DF] text-[#0A1628]/60"}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "teams" && (
        <section className="border-2 border-[#0A1628] bg-white p-5">
          <h2 className="font-heading text-lg font-bold tracking-wider text-[#0A1628] uppercase mb-4">TEAM APPROVAL & MANAGEMENT</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {state.teams.map((team) => (
              <TeamAdminCard key={team.id} team={team} state={state} setTeamStatus={setTeamStatus} editTeam={editTeam} deleteTeam={deleteTeam} />
            ))}
            {state.teams.length === 0 && (
              <p className="font-condensed text-sm text-[#0A1628]/50 tracking-wide sm:col-span-2 lg:col-span-3">No teams registered yet.</p>
            )}
          </div>
        </section>
      )}

      {activeTab === "groups" && (
        <section className="border-2 border-[#0A1628] bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="font-heading text-lg font-bold tracking-wider text-[#0A1628] uppercase">GROUP ASSIGNMENT</h2>
            <button type="button" onClick={async () => {
              const result = await drawGroups();
              if (!result.ok) { toast.error(result.message ?? "Cannot draw groups."); return; }
              toast.success("Groups assigned randomly.");
            }} className="gold-btn text-xs py-2">DRAW GROUPS RANDOMLY</button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {state.teams.filter((t) => t.status === "approved").map((team) => (
              <div key={team.id} className="border border-[#D4D0CB] p-3">
                <p className="font-condensed text-sm font-semibold tracking-wide">{team.name}</p>
                <select className="mt-2 w-full border border-[#D4D0CB] bg-white px-2 py-1.5 text-sm outline-none focus:border-[#FFD700]"
                  value={ALL_GROUPS.find((group) => state.groups[group].includes(team.id)) ?? ""}
                  onChange={async (event) => await assignTeamToGroup(team.id, event.target.value as GroupName)}>
                  <option value="">Select Group</option>
                  {ALL_GROUPS.map((group) => (<option key={group} value={group}>Group {group}</option>))}
                </select>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === "scores" && (
        <section className="border-2 border-[#0A1628] bg-white p-5">
          <h2 className="font-heading text-lg font-bold tracking-wider text-[#0A1628] uppercase mb-4">GROUP STAGE SCORES</h2>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {state.groupMatches.map((match) => (
              <div key={match.id} className="grid gap-2 border border-[#D4D0CB] p-3 md:grid-cols-[1fr_auto_1fr_auto] md:items-center">
                <span className="font-condensed text-sm tracking-wide">{teamById.get(match.homeTeamId)?.name ?? "TBD"}</span>
                <input type="number" min={0} defaultValue={match.homeScore ?? ""}
                  onBlur={async (event) => await updateGroupMatchScore(match.id, Number(event.currentTarget.value || 0), match.awayScore ?? 0)}
                  className="w-16 border border-[#D4D0CB] px-2 py-1 text-center text-sm outline-none focus:border-[#FFD700]" />
                <span className="font-condensed text-sm tracking-wide">{teamById.get(match.awayTeamId)?.name ?? "TBD"}</span>
                <input type="number" min={0} defaultValue={match.awayScore ?? ""}
                  onBlur={async (event) => await updateGroupMatchScore(match.id, match.homeScore ?? 0, Number(event.currentTarget.value || 0))}
                  className="w-16 border border-[#D4D0CB] px-2 py-1 text-center text-sm outline-none focus:border-[#FFD700]" />
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === "bracket" && (
        <section className="border-2 border-[#0A1628] bg-white p-5">
          <h2 className="font-heading text-lg font-bold tracking-wider text-[#0A1628] uppercase mb-4">BRACKET SCORES</h2>
          <div className="space-y-2">
            {state.bracketMatches.map((match) => (
              <div key={match.id} className="grid gap-2 border border-[#D4D0CB] p-3 md:grid-cols-[auto_1fr_auto_1fr_auto] md:items-center">
                <span className="font-condensed text-xs font-semibold tracking-wider text-[#FFD700] uppercase min-w-[60px]">
                  {match.round === "round-of-16" ? "R16" : match.round === "quarterfinals" ? "QF" : match.round === "semifinals" ? "SF" : "F"}
                </span>
                <span className="font-condensed text-sm tracking-wide">{teamById.get(match.homeTeamId ?? "")?.name ?? "TBD"}</span>
                <input type="number" min={0} defaultValue={match.homeScore ?? ""}
                  onBlur={async (event) => await updateBracketMatchScore(match.id, Number(event.currentTarget.value || 0), match.awayScore ?? 0)}
                  className="w-16 border border-[#D4D0CB] px-2 py-1 text-center text-sm outline-none focus:border-[#FFD700]" />
                <span className="font-condensed text-sm tracking-wide">{teamById.get(match.awayTeamId ?? "")?.name ?? "TBD"}</span>
                <input type="number" min={0} defaultValue={match.awayScore ?? ""}
                  onBlur={async (event) => await updateBracketMatchScore(match.id, match.homeScore ?? 0, Number(event.currentTarget.value || 0))}
                  className="w-16 border border-[#D4D0CB] px-2 py-1 text-center text-sm outline-none focus:border-[#FFD700]" />
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === "messages" && (
        <section className="border-2 border-[#0A1628] bg-white p-5">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="h-5 w-5 text-[#FFD700]" />
            <h2 className="font-heading text-lg font-bold tracking-wider text-[#0A1628] uppercase">CONTACT MESSAGES</h2>
          </div>
          {state.contactMessages.length === 0 ? (
            <p className="font-condensed text-sm text-[#0A1628]/50 tracking-wide">No messages yet.</p>
          ) : (
            <div className="space-y-3">
              {[...state.contactMessages].reverse().map((msg) => (
                <div key={msg.id} className="border border-[#D4D0CB] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-condensed text-sm font-semibold tracking-wide">{msg.name}</span>
                        <span className="font-condensed text-xs text-[#0A1628]/40 tracking-wide">
                          {new Date(msg.createdAt).toLocaleDateString()} {new Date(msg.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="font-condensed text-sm text-[#0A1628]/70 tracking-wide whitespace-pre-wrap">{msg.message}</p>
                    </div>
                    <button type="button" onClick={async () => {
                      if (!window.confirm("Delete this message?")) return;
                      await deleteContactMessage(msg.id);
                      toast.success("Message deleted.");
                    }} className="shrink-0 p-1.5 text-[#0A1628]/30 hover:text-[#FFD700] transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </PageShell>
  );
}

function TeamAdminCard({ team, setTeamStatus, editTeam, deleteTeam }: {
  team: Team; state: TournamentState;
  setTeamStatus: (teamId: string, status: "pending" | "approved" | "denied") => Promise<void>;
  editTeam: (teamId: string, payload: Omit<Team, "id" | "createdAt" | "status">) => Promise<{ ok: boolean; message?: string }>;
  deleteTeam: (teamId: string) => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(team.name);
  const [captainName, setCaptainName] = useState(team.captainName);
  const [captainPhone, setCaptainPhone] = useState(team.captainPhone);
  const [captainEmail, setCaptainEmail] = useState(team.captainEmail);
  const [players, setPlayers] = useState(team.players.join(", "));

  const statusStyles = {
    approved: "bg-green-50 text-green-700 border-green-200",
    denied: "bg-red-50 text-red-700 border-red-200",
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  };

  const saveEdit = async () => {
    const playerList = players.split(",").map((p) => p.trim()).filter(Boolean);
    const result = await editTeam(team.id, { name, captainName, captainPhone, captainEmail, players: playerList });
    if (!result.ok) { toast.error(result.message ?? "Failed to save."); return; }
    toast.success("Team updated."); setIsEditing(false);
  };

  return (
    <div className="border border-[#D4D0CB] p-3">
      <div className="flex items-center justify-between mb-2">
        <span className={`font-condensed text-xs font-bold tracking-wider uppercase px-2 py-0.5 border ${statusStyles[team.status]}`}>
          {team.status}
        </span>
        <div className="flex gap-1">
          <button type="button" className="font-condensed text-xs tracking-wide px-2 py-1 border border-[#D4D0CB] hover:border-green-500 hover:text-green-600 transition-colors"
            onClick={async () => { await setTeamStatus(team.id, "approved"); toast.success("Team approved."); }}>
            Approve
          </button>
          <button type="button" className="font-condensed text-xs tracking-wide px-2 py-1 border border-[#D4D0CB] hover:border-red-500 hover:text-red-600 transition-colors"
            onClick={async () => { await setTeamStatus(team.id, "denied"); toast.success("Team denied."); }}>
            Deny
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="mt-2 space-y-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Team Name"
            className="w-full border border-[#D4D0CB] px-2 py-1 text-sm outline-none focus:border-[#FFD700]" />
          <input value={captainName} onChange={(e) => setCaptainName(e.target.value)} placeholder="Captain Name"
            className="w-full border border-[#D4D0CB] px-2 py-1 text-sm outline-none focus:border-[#FFD700]" />
          <input value={captainPhone} onChange={(e) => setCaptainPhone(e.target.value)} placeholder="Captain Phone"
            className="w-full border border-[#D4D0CB] px-2 py-1 text-sm outline-none focus:border-[#FFD700]" />
          <input value={captainEmail} onChange={(e) => setCaptainEmail(e.target.value)} placeholder="Captain Email"
            className="w-full border border-[#D4D0CB] px-2 py-1 text-sm outline-none focus:border-[#FFD700]" />
          <textarea value={players} onChange={(e) => setPlayers(e.target.value)} placeholder="Players (comma separated)" rows={2}
            className="w-full border border-[#D4D0CB] px-2 py-1 text-sm outline-none focus:border-[#FFD700]" />
          <div className="flex gap-2">
            <button type="button" className="gold-btn text-xs py-1.5 px-3" onClick={saveEdit}>SAVE</button>
            <button type="button" className="font-condensed text-xs tracking-wide px-3 py-1.5 border border-[#D4D0CB] hover:border-[#0A1628] transition-colors"
              onClick={() => setIsEditing(false)}>CANCEL</button>
          </div>
        </div>
      ) : (
        <div className="mt-2">
          <p className="font-condensed text-sm font-semibold tracking-wide">{team.name}</p>
          <p className="font-condensed text-xs text-[#0A1628]/60 tracking-wide">Captain: {team.captainName}</p>
          <p className="font-condensed text-xs text-[#0A1628]/60 tracking-wide">Players: {team.players.length}</p>
          <div className="mt-2 flex gap-1">
            <button type="button" className="font-condensed text-xs tracking-wide px-2 py-1 border border-[#D4D0CB] hover:border-[#FFD700] hover:text-[#FFD700] transition-colors"
              onClick={() => setIsEditing(true)}>Edit</button>
            <button type="button" className="font-condensed text-xs tracking-wide px-2 py-1 border border-[#D4D0CB] hover:border-red-500 hover:text-red-600 transition-colors"
              onClick={async () => {
                if (!window.confirm(`Delete team "${team.name}"? This cannot be undone.`)) return;
                await deleteTeam(team.id); toast.success("Team deleted.");
              }}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}
