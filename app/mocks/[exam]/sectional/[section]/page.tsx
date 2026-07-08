import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import MockFrame from "@/components/MockFrame";
import { EXAMS, getExam } from "@/app/learn/sectionData";
import { isExamSlug } from "@/app/examCatalog";

export function generateStaticParams() {
  return EXAMS.flatMap((exam) =>
    exam.sections.map((section) => ({ exam: exam.slug, section: section.slug }))
  );
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ exam: string; section: string }>;
}): Promise<Metadata> {
  const { exam, section } = await params;
  return { title: `Sectional mock · ${section.toUpperCase()} · ${exam.toUpperCase()} | VettaLume` };
}

export default async function SectionalMockPage({
  params
}: {
  params: Promise<{ exam: string; section: string }>;
}) {
  const { exam, section } = await params;
  const examData = getExam(exam);
  if (!isExamSlug(exam) || !examData || !examData.sections.some((s) => s.slug === section)) {
    notFound();
  }
  return (
    <>
      <SiteHeader />
      <MockFrame
        src={`/full-mock-answer.html?exam=${exam}&section=${section}`}
        title={`${exam.toUpperCase()} ${section.toUpperCase()} sectional mock`}
        fill
      />
    </>
  );
}
