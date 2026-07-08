import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import MockFrame from "@/components/MockFrame";
import { EXAM_SLUGS, isExamSlug } from "@/app/examCatalog";

const MOCK_IDS = ["1", "2", "3", "4", "5", "6", "7", "8"];

export function generateStaticParams() {
  return EXAM_SLUGS.flatMap((exam) => MOCK_IDS.map((mock) => ({ exam, mock })));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ exam: string; mock: string }>;
}): Promise<Metadata> {
  const { exam, mock } = await params;
  return { title: `Mock ${mock} analysis · ${exam.toUpperCase()} | VettaLume` };
}

export default async function FullMockAnalysisPage({
  params
}: {
  params: Promise<{ exam: string; mock: string }>;
}) {
  const { exam, mock } = await params;
  if (!isExamSlug(exam)) {
    notFound();
  }
  return (
    <>
      <SiteHeader />
      <MockFrame
        src={`/full-mock-analysis.html?exam=${exam}&mock=${encodeURIComponent(mock)}`}
        title={`${exam.toUpperCase()} mock ${mock} analysis`}
      />
      <SiteFooter />
    </>
  );
}
