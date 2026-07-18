export type ExamSlug = "cat" | "gmat" | "gre";

export const EXAM_SLUGS: ExamSlug[] = ["cat", "gmat", "gre"];

export type Plan = {
  code: string; // backend PricePlan code (plan_code) — what checkout charges
  name: string;
  tag: string;
  price: string; // display label, e.g. "₹2,499"
  amountInr: number; // whole rupees — must match the backend plan amount
  months: number;
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

function inr(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}

// The four real month-passes per exam. `code`/`amountInr` MUST match the backend PricePlans
// (billing._SUBSCRIPTION_PLANS) so the cart charges the same SKU. Features describe each tier's
// entitlements (see billing._paid_limits): 1m = limited learning + 20/20 mocks; 3m/6m = full learning
// + 20 mocks per month; 12m = everything + unlimited mocks.
function plansFor(exam: ExamSlug, prices: [number, number, number, number]): Plan[] {
  const p = exam;
  const [m1, m3, m6, m12] = prices;
  return [
    {
      code: `${p}_1m`, name: "1 Month", tag: "Kickstart", price: inr(m1), amountInr: m1, months: 1,
      period: "1 month",
      features: ["First 2 chapters of every section", "20 sectional mocks / section", "20 full mocks"]
    },
    {
      code: `${p}_3m`, name: "3 Months", tag: "Most popular", price: inr(m3), amountInr: m3, months: 3,
      period: "3 months", popular: true,
      features: ["All learning content", "Adaptive practice", "60 sectional mocks / section", "60 full mocks"]
    },
    {
      code: `${p}_6m`, name: "6 Months", tag: "Go deep", price: inr(m6), amountInr: m6, months: 6,
      period: "6 months",
      features: ["All learning content", "Adaptive practice", "120 sectional mocks / section", "120 full mocks"]
    },
    {
      code: `${p}_12m`, name: "12 Months", tag: "Till exam", price: inr(m12), amountInr: m12, months: 12,
      period: "12 months",
      features: ["All learning content", "Adaptive practice", "Unlimited sectional & full mocks", "Valid a full year"]
    }
  ];
}

export const EXAM_CATALOG: Record<ExamSlug, ExamCatalogEntry> = {
  cat: { slug: "cat", label: "CAT", band: "cat", plans: plansFor("cat", [999, 2499, 3999, 5999]) },
  gmat: { slug: "gmat", label: "GMAT", band: "gmat", plans: plansFor("gmat", [1299, 2999, 4999, 9999]) },
  gre: { slug: "gre", label: "GRE", band: "gre", plans: plansFor("gre", [1199, 2799, 4599, 8999]) }
};

export function isExamSlug(value: string): value is ExamSlug {
  return (EXAM_SLUGS as string[]).includes(value);
}

export function getCatalog(slug: string): ExamCatalogEntry {
  return isExamSlug(slug) ? EXAM_CATALOG[slug] : EXAM_CATALOG.cat;
}
