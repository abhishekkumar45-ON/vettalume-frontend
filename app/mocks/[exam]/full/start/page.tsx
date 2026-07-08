import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import MockFrame from "@/components/MockFrame";
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
  return { title: `Section select · ${exam.toUpperCase()} | VettaLume` };
}

export default async function FullMockSelectPage({
  params
}: {
  params: Promise<{ exam: string }>;
}) {
  const { exam } = await params;
  if (!isExamSlug(exam)) {
    notFound();
  }
  return (
    <>
      <SiteHeader />
      <MockFrame src={`/full-mock-select.html?exam=${exam}`} title={`${exam.toUpperCase()} section select`} />
      <SiteFooter />
    </>
  );
}
