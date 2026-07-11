import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import FullMockDashboard from "@/components/mocks/FullMockDashboard";
import { EXAM_SLUGS, isExamSlug } from "@/app/examCatalog";

export function generateStaticParams() {
  return EXAM_SLUGS.map((exam) => ({ exam }));
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
  if (!isExamSlug(exam)) {
    notFound();
  }
  return (
    <>
      <SiteHeader />
      <FullMockDashboard exam={exam} />
      <SiteFooter />
    </>
  );
}
