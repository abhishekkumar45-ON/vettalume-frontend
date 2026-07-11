import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import MockAttemptAnalysis from "@/components/mocks/MockAttemptAnalysis";
import { getExam } from "@/app/learn/sectionData";
import { isExamSlug } from "@/app/examCatalog";

export const dynamicParams = true;

export async function generateMetadata({
  params
}: {
  params: Promise<{ exam: string; section: string; attempt: string }>;
}): Promise<Metadata> {
  const { exam, section } = await params;
  return { title: `Sectional mock analysis · ${section.toUpperCase()} · ${exam.toUpperCase()} | VettaLume` };
}

export default async function SectionalAttemptAnalysisPage({
  params
}: {
  params: Promise<{ exam: string; section: string; attempt: string }>;
}) {
  const { exam, section, attempt } = await params;
  const examData = getExam(exam);
  const sectionData = examData?.sections.find((s) => s.slug === section);
  if (!isExamSlug(exam) || !examData || !sectionData) {
    notFound();
  }
  return (
    <>
      <SiteHeader />
      <MockAttemptAnalysis
        exam={exam}
        attemptId={attempt}
        backHref={`/mocks/${exam}/sectional/${section}`}
        backLabel={`${sectionData.name} Mocks`}
      />
      <SiteFooter />
    </>
  );
}
