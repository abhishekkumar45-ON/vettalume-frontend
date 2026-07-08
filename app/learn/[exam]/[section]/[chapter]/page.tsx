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
  return { title: section ? `${name} · ${section.name} | VettaLume` : "Learn | VettaLume" };
}

export default async function ChapterAnalysisPage({
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
  const groupTitle = located ? located.group.title : "Recommended";

  const src =
    `/learning-chapter-analysis.html?exam=${exam.slug}` +
    `&section=${section.slug}` +
    `&sectionName=${encodeURIComponent(section.name)}` +
    `&group=${encodeURIComponent(groupTitle)}` +
    `&chapter=${chapterSlug}` +
    `&chapterName=${encodeURIComponent(chapterName)}`;

  return (
    <>
      <SiteHeader />
      <MockFrame src={src} title={`${chapterName} analysis`} />
      <SiteFooter />
    </>
  );
}
