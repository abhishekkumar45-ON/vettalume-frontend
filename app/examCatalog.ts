export type ExamSlug = "cat" | "gmat" | "gre";

export const EXAM_SLUGS: ExamSlug[] = ["cat", "gmat", "gre"];

export type Plan = {
  name: string;
  tag: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
};

export type ExamCatalogEntry = {
  slug: ExamSlug;
  label: string;
  band: string;
  plans: Plan[];
};

export const EXAM_CATALOG: Record<ExamSlug, ExamCatalogEntry> = {
  cat: {
    slug: "cat",
    label: "CAT",
    band: "cat",
    plans: [
      {
        name: "Spark",
        tag: "Test the waters",
        price: "₹499",
        period: "1 month",
        features: ["Adaptive CAT engine", "2 full-length mocks", "Unlimited sectional drills"]
      },
      {
        name: "Kindle",
        tag: "Build consistency",
        price: "₹999",
        period: "3 months",
        features: ["Full CAT question bank", "Personalized roadmap", "6 full-length mocks"]
      },
      {
        name: "Glow",
        tag: "Most popular",
        price: "₹1,999",
        period: "6 months",
        features: ["Root-cause analytics", "Mock review workflow", "DILR set-selection trainer"],
        popular: true
      },
      {
        name: "Blaze",
        tag: "Serious prep",
        price: "₹3,499",
        period: "12 months",
        features: ["Priority doubt support", "30 full-length mocks", "2 mentor strategy calls"]
      },
      {
        name: "Lumen",
        tag: "Full route",
        price: "₹5,999",
        period: "Till exam",
        features: ["Unlimited mocks", "Weekly mentor calls", "Valid till exam day"]
      }
    ]
  },
  gmat: {
    slug: "gmat",
    label: "GMAT",
    band: "gmat",
    plans: [
      {
        name: "Spark",
        tag: "Test the waters",
        price: "₹999",
        period: "1 month",
        features: ["Adaptive GMAT engine", "2 full-length mocks", "Unlimited Quant & Verbal drills"]
      },
      {
        name: "Kindle",
        tag: "Build consistency",
        price: "₹1,999",
        period: "3 months",
        features: ["Full GMAT question bank", "Personalized roadmap", "6 full-length mocks"]
      },
      {
        name: "Glow",
        tag: "Most popular",
        price: "₹3,999",
        period: "6 months",
        features: ["Root-cause analytics", "Data Insights trainer", "Mock review workflow"],
        popular: true
      },
      {
        name: "Lumen",
        tag: "Full route",
        price: "₹11,999",
        period: "Till exam",
        features: ["Unlimited mocks", "Weekly mentor calls", "Valid till exam day"]
      }
    ]
  },
  gre: {
    slug: "gre",
    label: "GRE",
    band: "gre",
    plans: [
      {
        name: "Spark",
        tag: "Test the waters",
        price: "₹799",
        period: "1 month",
        features: ["Adaptive GRE engine", "2 full-length mocks", "Unlimited Verbal & Quant drills"]
      },
      {
        name: "Glow",
        tag: "Most popular",
        price: "₹2,999",
        period: "6 months",
        features: ["Root-cause analytics", "Text Completion trainer", "Essay (AWA) review workflow"],
        popular: true
      },
      {
        name: "Lumen",
        tag: "Full route",
        price: "₹8,999",
        period: "Till exam",
        features: ["Unlimited mocks", "Weekly mentor calls", "Valid till exam day"]
      }
    ]
  }
};

export function isExamSlug(value: string): value is ExamSlug {
  return (EXAM_SLUGS as string[]).includes(value);
}

export function getCatalog(slug: string): ExamCatalogEntry {
  return isExamSlug(slug) ? EXAM_CATALOG[slug] : EXAM_CATALOG.cat;
}
