import { getExam } from "@/app/learn/sectionData";

export type MockRow = { name: string; ile?: number; pct?: number; next?: boolean };
export type Topic = { name: string; pct: number };
export type PathItem = { name: string; section: string; pct: number };

export type MockView = {
  exam: string;
  examLabel: string;
  kind: "full" | "sectional";
  section?: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  stats: { value: string; unit: string; label: string }[];
  scoreProgression: number[];
  accuracyTrend: number[];
  timeManagement: number[];
  sectionWise: { name: string; pct: number }[];
  strongest: Topic[];
  weakest: Topic[];
  path: PathItem[];
  mocks: MockRow[];
  mockLabel: string;
};

const SCORES = [
  { ile: 52, pct: 50 },
  { ile: 65, pct: 69 },
  { ile: 63, pct: 67 },
  { ile: 71, pct: 79 },
  { ile: 67, pct: 71 },
  { ile: 68, pct: 73 },
  { ile: 67, pct: 71 }
];

function buildMocks(label: string): MockRow[] {
  const rows: MockRow[] = SCORES.map((s, i) => ({
    name: `${label} ${i + 1}`,
    ile: s.ile,
    pct: s.pct
  }));
  rows.push({ name: `${label} ${SCORES.length + 1}`, next: true });
  return rows;
}

// Exact content for CAT full mocks (from the design)
function catFull(): MockView {
  return {
    exam: "cat",
    examLabel: "CAT",
    kind: "full",
    eyebrow: "CAT · Full-length mocks",
    title: "Full mocks",
    subtitle:
      "Each mock spans all sections (VARC, DILR, QA). The dashboard aggregates every attempt; scores and analyses are preserved forever.",
    stats: [
      { value: "7", unit: "/8", label: "mocks attempted" },
      { value: "67", unit: "ile", label: "latest percentile" },
      { value: "71", unit: "ile", label: "best percentile" },
      { value: "63%", unit: "", label: "predicted readiness" }
    ],
    scoreProgression: [50, 64, 60, 67, 63, 72, 68],
    accuracyTrend: [46, 62, 58, 66, 61, 70, 67],
    timeManagement: [58, 74, 52, 48, 55, 78, 70],
    sectionWise: [
      { name: "VARC", pct: 80 },
      { name: "DILR", pct: 40 },
      { name: "QA", pct: 80 }
    ],
    strongest: [
      { name: "Linear Equations", pct: 100 },
      { name: "Averages", pct: 100 },
      { name: "Ratio & Proportion", pct: 100 }
    ],
    weakest: [
      { name: "Data Interpretation", pct: 25 },
      { name: "Vocabulary & Usage", pct: 29 },
      { name: "Profit & Loss", pct: 50 }
    ],
    path: [
      { name: "Data Interpretation", section: "DILR", pct: 25 },
      { name: "Vocabulary & Usage", section: "VARC", pct: 29 },
      { name: "Profit & Loss", section: "QA", pct: 50 }
    ],
    mocks: buildMocks("Full Mock"),
    mockLabel: "Full Mock"
  };
}

export function buildMockView(
  examSlug: string,
  kind: "full" | "sectional",
  sectionSlug?: string
): MockView | null {
  const exam = getExam(examSlug);
  if (!exam) {
    return null;
  }
  const section = sectionSlug ? exam.sections.find((s) => s.slug === sectionSlug) : undefined;
  if (kind === "sectional" && !section) {
    return null;
  }

  if (examSlug === "cat" && kind === "full") {
    return catFull();
  }

  // Gather relevant chapters
  const scope = kind === "full" ? exam.sections : [section!];
  const chapters = scope.flatMap((s) =>
    s.groups.flatMap((g) => g.chapters.map((c) => ({ name: c.name, pct: c.pct, section: s.name })))
  );
  const byPct = [...chapters].sort((a, b) => b.pct - a.pct);
  const strongest = byPct.slice(0, 3).map((c) => ({ name: c.name, pct: c.pct }));
  const weakest = [...byPct]
    .reverse()
    .slice(0, 3)
    .map((c) => ({ name: c.name, pct: c.pct }));
  const path = weakest.map((c) => {
    const src = chapters.find((x) => x.name === c.name);
    return { name: c.name, section: src?.section ?? exam.sections[0].name, pct: c.pct };
  });

  const sectionWise =
    kind === "full"
      ? exam.sections.map((s) => ({ name: s.name, pct: s.mastery }))
      : section!.groups[0].chapters.map((c) => ({ name: c.name, pct: c.pct }));

  const latest = SCORES[SCORES.length - 1].ile;
  const best = Math.max(...SCORES.map((s) => s.ile));
  const readiness =
    kind === "full"
      ? Math.round(exam.sections.reduce((a, s) => a + s.mastery, 0) / exam.sections.length)
      : section!.mastery;

  const mockLabel = kind === "full" ? "Full Mock" : `${section!.name} Mock Test`;

  return {
    exam: exam.slug,
    examLabel: exam.label,
    kind,
    section: section?.slug,
    eyebrow:
      kind === "full"
        ? `${exam.label} · Full-length mocks`
        : `${exam.label} · ${section!.name} sectional mocks`,
    title: kind === "full" ? "Full mocks" : `${section!.name} mocks`,
    subtitle:
      kind === "full"
        ? `Each mock spans all sections (${exam.sections
            .map((s) => s.name)
            .join(", ")}). The dashboard aggregates every attempt; scores and analyses are preserved forever.`
        : `${section!.full}. Every ${section!.name} sectional attempt is aggregated here, with scores and analyses preserved forever.`,
    stats: [
      { value: "7", unit: "/8", label: "mocks attempted" },
      { value: `${latest}`, unit: "ile", label: "latest percentile" },
      { value: `${best}`, unit: "ile", label: "best percentile" },
      { value: `${readiness}%`, unit: "", label: "predicted readiness" }
    ],
    scoreProgression: [50, 64, 60, 67, 63, 72, 68],
    accuracyTrend: [46, 62, 58, 66, 61, 70, 67],
    timeManagement: [58, 74, 52, 48, 55, 78, 70],
    sectionWise,
    strongest,
    weakest,
    path,
    mocks: buildMocks(mockLabel),
    mockLabel
  };
}
