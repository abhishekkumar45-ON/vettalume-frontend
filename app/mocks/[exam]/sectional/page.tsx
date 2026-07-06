import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { EXAMS, getExam } from "@/app/learn/sectionData";

export function generateStaticParams() {
  return EXAMS.map((exam) => ({ exam: exam.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ exam: string }>;
}): Promise<Metadata> {
  const { exam } = await params;
  return { title: `Sectional mocks · ${exam.toUpperCase()} | VettaLume` };
}

const EXAM_TABS = [
  { slug: "cat", label: "CAT" },
  { slug: "gmat", label: "GMAT" },
  { slug: "gre", label: "GRE" }
];

export default async function SectionalPickerPage({
  params
}: {
  params: Promise<{ exam: string }>;
}) {
  const { exam: examSlug } = await params;
  const exam = getExam(examSlug);
  if (!exam) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main className="mockPage">
        <div className="sectionInner">
          <div className="mockTabs" role="tablist" aria-label="Exam">
            {EXAM_TABS.map((tab) => (
              <Link
                key={tab.slug}
                href={`/mocks/${tab.slug}/sectional`}
                className={tab.slug === exam.slug ? "active" : ""}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          <p className="mockEyebrow">{exam.label} · Sectional mocks</p>
          <h1 className="mockTitle">Sectional mocks</h1>
          <p className="mockSubtitle">
            Pick a section to open its mock history, track percentile and accuracy, and start the
            next attempt.
          </p>

          <div className="sectionalPick">
            {exam.sections.map((section) => (
              <a
                className="pickCard"
                key={section.slug}
                href={`/sectional-mock.html?exam=${exam.slug}&section=${section.slug}`}
              >
                <span className="pickName">{section.name}</span>
                <span className="pickFull">{section.full}</span>
                <span className="pickGo">
                  Open {section.name} mocks <ArrowRight size={16} aria-hidden="true" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
