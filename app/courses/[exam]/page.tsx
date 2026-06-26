import Link from "next/link";
import {
  BookOpen,
  Brain,
  ClipboardList,
  ShoppingCart,
  Target,
  type LucideIcon
} from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

const courseData = {
  cat: {
    label: "CAT",
    band: "cat",
    count: 5,
    plans: [
      ["Spark", "Test the waters", "₹499"],
      ["Kindle", "Build consistency", "₹999"],
      ["Glow", "Most popular", "₹1,999"],
      ["Blaze", "Serious prep", "₹3,499"],
      ["Lumen", "Full route", "₹5,999"]
    ]
  },
  gmat: {
    label: "GMAT",
    band: "gmat",
    count: 4,
    plans: [
      ["Spark", "Test the waters", "₹999"],
      ["Kindle", "Build consistency", "₹1,999"],
      ["Glow", "Most popular", "₹3,999"],
      ["Lumen", "Full route", "₹11,999"]
    ]
  },
  gre: {
    label: "GRE",
    band: "gre",
    count: 3,
    plans: [
      ["Spark", "Test the waters", "₹799"],
      ["Glow", "Most popular", "₹2,999"],
      ["Lumen", "Full route", "₹8,999"]
    ]
  }
} as const;

const includedItems: Array<{ icon: LucideIcon; title: string; text: string }> = [
  {
    icon: BookOpen,
    title: "Adaptive Learning Engine",
    text: "A smart learning system that adjusts based on your performance and helps you focus on the right topics."
  },
  {
    icon: Target,
    title: "Adaptive Learning Engine",
    text: "A smart learning system that adjusts based on your performance and helps you focus on the right topics."
  },
  {
    icon: ClipboardList,
    title: "Mock exam series",
    text: "Practice topic-wise questions and strengthen your concepts with unlimited sectional drills."
  },
  {
    icon: Brain,
    title: "Mock exam series",
    text: "Practice topic-wise questions and strengthen your concepts with unlimited sectional drills."
  }
];

export function generateStaticParams() {
  return Object.keys(courseData).map((exam) => ({ exam }));
}

export default async function ProductListingPage({
  params
}: {
  params: Promise<{ exam: string }>;
}) {
  const { exam } = await params;
  const data = courseData[exam.toLowerCase() as keyof typeof courseData] ?? courseData.cat;

  return (
    <>
      <SiteHeader />
      <main className="coursesPage">
        <section className={`courseColorBand ${data.band}`} aria-label={`${data.label} course theme`} />
        <section className="courseListing">
          {data.plans.slice(0, data.count).map(([name, tag, price]) => (
            <article className="courseProduct" key={`${data.label}-${name}`}>
              <div className="courseProductIntro">
                <h2>{name} <span>— {tag}</span></h2>
                <p className="priceLabel">Pricing starts from:</p>
                <strong>{price}<small>/once</small></strong>
                <div className="courseProductActions">
                  <Link className="button primary" href="/pricing">Explore</Link>
                  <Link className="button ghost" href="/cart">
                    <ShoppingCart size={18} aria-hidden="true" />
                    Add to cart
                  </Link>
                </div>
                <p>
                  Start your preparation journey with focused learning, practice tools,
                  and essential resources to build consistency.
                </p>
              </div>
              <div className="includedPanel">
                <h3>What&apos;s included</h3>
                <div className="includedGrid">
                  {includedItems.map(({ icon: Icon, title, text }, index) => (
                    <div className="includedItem" key={`${name}-${title}-${index}`}>
                      <Icon size={18} aria-hidden="true" />
                      <b>{title}</b>
                      <p>{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
