import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import MockAttemptAnalysis from "@/components/mocks/MockAttemptAnalysis";
import { isExamSlug } from "@/app/examCatalog";

export const dynamicParams = true;

export async function generateMetadata({
  params
}: {
  params: Promise<{ exam: string; mock: string }>;
}): Promise<Metadata> {
  const { exam } = await params;
  return { title: `Full mock analysis · ${exam.toUpperCase()} | VettaLume` };
}

// `mock` here is the attempt id (full-mock "View analysis" links to /mocks/{exam}/full/{attemptId}).
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
      <MockAttemptAnalysis
        exam={exam}
        attemptId={mock}
        backHref={`/mocks/${exam}/full`}
        backLabel="Full Mocks"
      />
      <SiteFooter />
    </>
  );
}
