import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import SubtopicLearning from "@/components/SubtopicLearning";
import { getChapter, getExam, getSection } from "@/app/learn/sectionData";

type PageParams = { exam: string; section: string; chapter: string; subtopic: string };

function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((word) => (word === "and" ? "&" : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(" ");
}

export async function generateMetadata({
  params
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { subtopic } = await params;
  return { title: `${titleFromSlug(subtopic)} | VettaLume` };
}

export default async function SubtopicLearningPage({
  params
}: {
  params: Promise<PageParams>;
}) {
  const { exam: examSlug, section: sectionSlug, chapter: chapterSlug, subtopic } = await params;
  const exam = getExam(examSlug);
  const section = exam ? getSection(exam, sectionSlug) : undefined;
  if (!exam || !section) {
    notFound();
  }

  const located = getChapter(section, chapterSlug);
  const chapterName = located ? located.chapter.name : titleFromSlug(chapterSlug);
  const subtopicName = titleFromSlug(subtopic);

  return (
    <>
      <SiteHeader />
      <SubtopicLearning
        examLabel={exam.label}
        exam={examSlug}
        sectionSlug={sectionSlug}
        chapterSlug={chapterSlug}
        subtopicSlug={subtopic}
        // back button returns to the chapter-analysis page
        sectionHref={`/learn/${exam.slug}/${section.slug}/${chapterSlug}`}
        sectionName={chapterName}
        groupTitle={section.name}
        chapterName={subtopicName}
      />
      <SiteFooter />
    </>
  );
}
