import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import DiagnosticResult from "@/components/mocks/DiagnosticResult";
import { isExamSlug } from "@/app/examCatalog";

export const dynamicParams = true;

export async function generateMetadata({
  params
}: {
  params: Promise<{ exam: string }>;
}): Promise<Metadata> {
  const { exam } = await params;
  return { title: `Diagnostic result · ${exam.toUpperCase()} | VettaLume` };
}

export default async function DiagnosticResultPage({
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
      <main className="smPage">
        <DiagnosticResult exam={exam} />
      </main>
      <SiteFooter />
    </>
  );
}
