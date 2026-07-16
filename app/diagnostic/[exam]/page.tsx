import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DiagnosticGate from "@/components/mocks/DiagnosticGate";
import { isExamSlug } from "@/app/examCatalog";

// The diagnostic paper is admin-authored, so this route renders on demand.
export const dynamicParams = true;

export async function generateMetadata({
  params
}: {
  params: Promise<{ exam: string }>;
}): Promise<Metadata> {
  const { exam } = await params;
  return { title: `Diagnostic · ${exam.toUpperCase()} | VettaLume` };
}

export default async function DiagnosticPage({
  params
}: {
  params: Promise<{ exam: string }>;
}) {
  const { exam } = await params;
  if (!isExamSlug(exam)) {
    notFound();
  }
  // Fullscreen CAT-style runner (no site chrome), gated to one attempt per learner.
  return <DiagnosticGate exam={exam} />;
}
