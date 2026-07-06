import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MockAnalytics from "@/components/MockAnalytics";
import { buildMockView } from "@/app/mocks/mockData";
import { EXAMS } from "@/app/learn/sectionData";

export function generateStaticParams() {
  return EXAMS.map((exam) => ({ exam: exam.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ exam: string }>;
}): Promise<Metadata> {
  const { exam } = await params;
  return { title: `Full mocks · ${exam.toUpperCase()} | VettaLume` };
}

export default async function FullMockPage({ params }: { params: Promise<{ exam: string }> }) {
  const { exam } = await params;
  const view = buildMockView(exam, "full");
  if (!view) {
    notFound();
  }
  return <MockAnalytics view={view} />;
}
