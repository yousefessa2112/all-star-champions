import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registered Teams",
  description:
    "View all registered teams competing in the All Star Champions soccer tournament in Brooklyn. See rosters, captains, and available spots.",
};

export default function TeamsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
