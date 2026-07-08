import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import MockFrame from "@/components/MockFrame";
import { EXAMS, getChapter, getExam, getSection, slugify } from "@/app/learn/sectionData";

type PageParams = { exam: string; section: string; chapter: string };

function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((word) => (word === "and" ? "&" : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(" ");
}

export function generateStaticParams(): PageParams[] {
  return EXAMS.flatMap((exam) =>
    exam.sections.flatMap((section) =>
      section.groups.flatMap((group) =>
        group.chapters.map((chapter) => ({
          exam: exam.slug,
          section: section.slug,
          chapter: slugify(chapter.name)
        }))
      )
    )
  );
}

export async function generateMetadata({
  params
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { exam: examSlug, section: sectionSlug, chapter: chapterSlug } = await params;
  const exam = getExam(examSlug);
  const section = exam ? getSection(exam, sectionSlug) : undefined;
  const located = section ? getChapter(section, chapterSlug) : undefined;
  const name = located?.chapter.name ?? titleFromSlug(chapterSlug);
  return { title: `Revisit · ${name} | VettaLume` };
}

export default async function ChapterRevisitPage({
  params
}: {
  params: Promise<PageParams>;
}) {
  const { exam: examSlug, section: sectionSlug, chapter: chapterSlug } = await params;
  const exam = getExam(examSlug);
  const section = exam ? getSection(exam, sectionSlug) : undefined;
  if (!exam || !section) {
    notFound();
  }

  const located = getChapter(section, chapterSlug);
  const chapterName = located ? located.chapter.name : titleFromSlug(chapterSlug);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
  const src =
    `/practice-revisit.html?exam=${exam.slug}` +
    `&section=${section.slug}` +
    `&chapter=${chapterSlug}` +
    `&chapterName=${encodeURIComponent(chapterName)}` +
    `&api=${encodeURIComponent(apiBase)}`;

  return (
    <>
      <SiteHeader />
      <MockFrame src={src} title={`${chapterName} revisit`} />
      <SiteFooter />
    </>
  );
}
