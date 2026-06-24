import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Group Stage",
  description:
    "Follow the All Star Champions group stage standings. Track wins, draws, losses, goals, and points for all 8 groups in the tournament.",
};

export default function GroupsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
