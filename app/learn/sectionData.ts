export type Tone = "green" | "purple" | "rose";

export type Chapter = { name: string; pct: number; tone: Tone };
export type Group = { title: string; chapters: Chapter[] };
export type Recommendation = { name: string; pct: number };

export type Section = {
  slug: string;
  name: string;
  full: string;
  syllabus: number;
  ability: number;
  mastery: number;
  recommendations: Recommendation[];
  groups: Group[];
};

export type Exam = {
  slug: string;
  label: string;
  sections: Section[];
};

export const EXAMS: Exam[] = [
  {
    slug: "cat",
    label: "CAT",
    sections: [
      {
        slug: "varc",
        name: "VARC",
        full: "Verbal Ability & Reading Comprehension",
        syllabus: 58,
        ability: 71,
        mastery: 64,
        recommendations: [
          { name: "Inference & Implication", pct: 64 },
          { name: "Para Jumbles", pct: 47 }
        ],
        groups: [
          {
            title: "Reading Comprehension",
            chapters: [
              { name: "Main Idea & Structure", pct: 64, tone: "green" },
              { name: "Tone & Attitude", pct: 47, tone: "purple" },
              { name: "Vocabulary in Context", pct: 14, tone: "rose" }
            ]
          },
          {
            title: "Verbal Ability",
            chapters: [
              { name: "Para Jumbles", pct: 52, tone: "green" },
              { name: "Para Summary", pct: 38, tone: "purple" },
              { name: "Odd Sentence Out", pct: 20, tone: "rose" }
            ]
          }
        ]
      },
      {
        slug: "dilr",
        name: "DILR",
        full: "Data Interpretation & Logical Reasoning",
        syllabus: 44,
        ability: 54,
        mastery: 49,
        recommendations: [
          { name: "Arrangements", pct: 40 },
          { name: "Data Sufficiency", pct: 35 }
        ],
        groups: [
          {
            title: "Data Interpretation",
            chapters: [
              { name: "Tables & Charts", pct: 58, tone: "green" },
              { name: "Caselets", pct: 42, tone: "purple" },
              { name: "Venn Diagrams", pct: 30, tone: "rose" }
            ]
          },
          {
            title: "Logical Reasoning",
            chapters: [
              { name: "Arrangements", pct: 40, tone: "green" },
              { name: "Puzzles", pct: 33, tone: "purple" },
              { name: "Blood Relations", pct: 22, tone: "rose" }
            ]
          }
        ]
      },
      {
        slug: "qa",
        name: "QA",
        full: "Quantitative Aptitude",
        syllabus: 66,
        ability: 82,
        mastery: 74,
        recommendations: [
          { name: "Number System", pct: 70 },
          { name: "Time & Work", pct: 58 }
        ],
        groups: [
          {
            title: "Arithmetic",
            chapters: [
              { name: "Percentages", pct: 80, tone: "green" },
              { name: "Ratio & Proportion", pct: 72, tone: "purple" },
              { name: "Time & Work", pct: 58, tone: "rose" }
            ]
          },
          {
            title: "Algebra",
            chapters: [
              { name: "Equations", pct: 68, tone: "green" },
              { name: "Functions", pct: 55, tone: "purple" },
              { name: "Progressions", pct: 44, tone: "rose" }
            ]
          }
        ]
      }
    ]
  },
  {
    slug: "gmat",
    label: "GMAT",
    sections: [
      {
        slug: "quant",
        name: "Quant",
        full: "Quantitative Reasoning",
        syllabus: 60,
        ability: 70,
        mastery: 62,
        recommendations: [
          { name: "Number Properties", pct: 58 },
          { name: "Word Problems", pct: 50 }
        ],
        groups: [
          {
            title: "Problem Solving",
            chapters: [
              { name: "Arithmetic", pct: 72, tone: "green" },
              { name: "Algebra", pct: 60, tone: "purple" },
              { name: "Geometry", pct: 44, tone: "rose" }
            ]
          },
          {
            title: "Advanced Topics",
            chapters: [
              { name: "Number Properties", pct: 58, tone: "green" },
              { name: "Rates & Work", pct: 50, tone: "purple" },
              { name: "Combinatorics", pct: 32, tone: "rose" }
            ]
          }
        ]
      },
      {
        slug: "verbal",
        name: "Verbal",
        full: "Verbal Reasoning",
        syllabus: 55,
        ability: 66,
        mastery: 60,
        recommendations: [
          { name: "Reading Comprehension", pct: 62 },
          { name: "Critical Reasoning", pct: 54 }
        ],
        groups: [
          {
            title: "Reading Comprehension",
            chapters: [
              { name: "Main Idea", pct: 66, tone: "green" },
              { name: "Inference", pct: 52, tone: "purple" },
              { name: "Tone", pct: 40, tone: "rose" }
            ]
          },
          {
            title: "Critical Reasoning",
            chapters: [
              { name: "Assumptions", pct: 58, tone: "green" },
              { name: "Strengthen / Weaken", pct: 48, tone: "purple" },
              { name: "Evaluate", pct: 34, tone: "rose" }
            ]
          }
        ]
      },
      {
        slug: "data",
        name: "Data Insights",
        full: "Data Insights",
        syllabus: 48,
        ability: 58,
        mastery: 52,
        recommendations: [
          { name: "Multi-Source Reasoning", pct: 46 },
          { name: "Graphics Interpretation", pct: 50 }
        ],
        groups: [
          {
            title: "Data Sufficiency",
            chapters: [
              { name: "Two-Statement Logic", pct: 56, tone: "green" },
              { name: "Value vs Yes/No", pct: 44, tone: "purple" },
              { name: "Common Traps", pct: 30, tone: "rose" }
            ]
          },
          {
            title: "Integrated Reasoning",
            chapters: [
              { name: "Table Analysis", pct: 52, tone: "green" },
              { name: "Graphics Interpretation", pct: 50, tone: "purple" },
              { name: "Two-Part Analysis", pct: 36, tone: "rose" }
            ]
          }
        ]
      }
    ]
  },
  {
    slug: "gre",
    label: "GRE",
    sections: [
      {
        slug: "verbal",
        name: "Verbal",
        full: "Verbal Reasoning",
        syllabus: 57,
        ability: 68,
        mastery: 61,
        recommendations: [
          { name: "Text Completion", pct: 60 },
          { name: "Sentence Equivalence", pct: 55 }
        ],
        groups: [
          {
            title: "Reading Comprehension",
            chapters: [
              { name: "Main Idea", pct: 64, tone: "green" },
              { name: "Inference", pct: 50, tone: "purple" },
              { name: "Vocabulary in Context", pct: 38, tone: "rose" }
            ]
          },
          {
            title: "Text Completion",
            chapters: [
              { name: "One-Blank", pct: 62, tone: "green" },
              { name: "Two-Blank", pct: 48, tone: "purple" },
              { name: "Three-Blank", pct: 30, tone: "rose" }
            ]
          }
        ]
      },
      {
        slug: "quant",
        name: "Quant",
        full: "Quantitative Reasoning",
        syllabus: 63,
        ability: 76,
        mastery: 69,
        recommendations: [
          { name: "Quantitative Comparison", pct: 66 },
          { name: "Data Interpretation", pct: 58 }
        ],
        groups: [
          {
            title: "Arithmetic & Algebra",
            chapters: [
              { name: "Arithmetic", pct: 78, tone: "green" },
              { name: "Algebra", pct: 66, tone: "purple" },
              { name: "Word Problems", pct: 52, tone: "rose" }
            ]
          },
          {
            title: "Geometry & Data",
            chapters: [
              { name: "Geometry", pct: 60, tone: "green" },
              { name: "Data Interpretation", pct: 58, tone: "purple" },
              { name: "Probability", pct: 40, tone: "rose" }
            ]
          }
        ]
      },
      {
        slug: "awa",
        name: "AWA",
        full: "Analytical Writing",
        syllabus: 40,
        ability: 52,
        mastery: 45,
        recommendations: [
          { name: "Analyze an Argument", pct: 48 },
          { name: "Analyze an Issue", pct: 44 }
        ],
        groups: [
          {
            title: "Issue Task",
            chapters: [
              { name: "Thesis & Structure", pct: 52, tone: "green" },
              { name: "Evidence", pct: 40, tone: "purple" },
              { name: "Style & Clarity", pct: 28, tone: "rose" }
            ]
          },
          {
            title: "Argument Task",
            chapters: [
              { name: "Flaw Identification", pct: 50, tone: "green" },
              { name: "Counterexamples", pct: 42, tone: "purple" },
              { name: "Conclusion", pct: 30, tone: "rose" }
            ]
          }
        ]
      }
    ]
  }
];

export function getExam(slug: string): Exam | undefined {
  return EXAMS.find((exam) => exam.slug === slug);
}

export function getSection(exam: Exam, slug: string): Section | undefined {
  return exam.sections.find((section) => section.slug === slug);
}
