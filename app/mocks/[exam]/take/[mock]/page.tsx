import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MockRunner from "@/components/mocks/MockRunner";
import { isExamSlug } from "@/app/examCatalog";

// The mock id is only known at runtime (admin-authored), so this route renders on demand.
export const dynamicParams = true;

export async function generateMetadata({
  params
}: {
  params: Promise<{ exam: string; mock: string }>;
}): Promise<Metadata> {
  const { exam } = await params;
  return { title: `Mock · ${exam.toUpperCase()} | VettaLume` };
}

export default async function TakeMockPage({
  params
}: {
  params: Promise<{ exam: string; mock: string }>;
}) {
  const { exam, mock } = await params;
  if (!isExamSlug(exam)) {
    notFound();
  }
  // Fullscreen CAT-style runner — no site header/footer during the exam.
  return <MockRunner exam={exam} mockId={mock} />;
}
