import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tournament Rules",
  description:
    "Official rules and guidelines for the All Star Champions soccer tournament. Learn about the format, team requirements, match rules, and venue details.",
};

export default function RulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
