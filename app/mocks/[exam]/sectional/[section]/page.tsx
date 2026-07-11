import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import SectionalMockDashboard from "@/components/mocks/SectionalMockDashboard";
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
  const sectionData = examData?.sections.find((s) => s.slug === section);
  if (!isExamSlug(exam) || !examData || !sectionData) {
    notFound();
  }
  return (
    <>
      <SiteHeader />
      <SectionalMockDashboard
        exam={exam}
        section={section}
        sectionName={sectionData.name}
        sectionFull={sectionData.full}
      />
      <SiteFooter />
    </>
  );
}
