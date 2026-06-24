import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tournament Bracket",
  description:
    "Follow the All Star Champions knockout bracket — Round of 16, Quarterfinals, Semifinals, and the Final. See live scores and results.",
};

export default function BracketLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
