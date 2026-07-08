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
import { EXAM_SLUGS, getCatalog } from "@/app/examCatalog";

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
  return EXAM_SLUGS.map((exam) => ({ exam }));
}

export default async function ProductListingPage({
  params
}: {
  params: Promise<{ exam: string }>;
}) {
  const { exam } = await params;
  const data = getCatalog(exam.toLowerCase());

  return (
    <>
      <SiteHeader showExamSwitcher />
      <main className="coursesPage">
        <section className={`courseColorBand ${data.band}`} aria-label={`${data.label} course theme`} />
        <section className="courseListing">
          {data.plans.map(({ name, tag, price }) => (
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
