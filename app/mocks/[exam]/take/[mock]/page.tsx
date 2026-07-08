import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import MockFrame from "@/components/MockFrame";
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
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
  const src =
    `/mock-runner.html?exam=${exam}` +
    `&mock=${encodeURIComponent(mock)}` +
    `&api=${encodeURIComponent(apiBase)}`;
  return (
    <>
      <SiteHeader />
      <MockFrame src={src} title={`${exam.toUpperCase()} mock`} fill />
    </>
  );
}
