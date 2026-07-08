"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { EXAM_CATALOG } from "@/app/examCatalog";
import { useUser } from "@/components/UserContext";

export default function PricingPage() {
  const { activeExam, isOwned } = useUser();
  const catalog = EXAM_CATALOG[activeExam];
  const owned = isOwned(activeExam);

  return (
    <>
      <SiteHeader showExamSwitcher />
      <main className="pricingRoute">
        <section className="pageHero darkHero">
          <div className="pageHeroInner">
            <h1>{catalog.label} Pricing</h1>
            <p>
              Pick the plan that matches your exam window and prep intensity.
              {owned ? " You already own this course." : ""}
            </p>
          </div>
        </section>
        <section className="sectionInner pricingRouteGrid">
          {catalog.plans.map((plan) => (
            <article className={plan.popular ? "priceCard featured" : "priceCard"} key={plan.name}>
              {plan.popular ? <span className="popularBadge">Most popular</span> : null}
              <p>{plan.name}</p>
              <strong>{plan.price}</strong>
              <span>{plan.period}</span>
              <Link className="button priceButton" href="/cart">
                Choose {plan.name}
              </Link>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <Check size={14} aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
