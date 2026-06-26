import Link from "next/link";
import { Check } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

const pricingPlans = [
  ["Spark", "₹499", "1 month", "Adaptive CAT engine", "2 full-length mocks", "Unlimited sectional drills"],
  ["Kindle", "₹999", "3 months", "Full CAT question bank", "Personalized roadmap", "6 full-length mocks"],
  ["Glow", "₹1,999", "6 months", "Root-cause analytics", "Mock review workflow", "DILR set-selection trainer"],
  ["Blaze", "₹3,499", "12 months", "Priority doubt support", "30 full-length mocks", "2 mentor strategy calls"],
  ["Lumen", "₹5,999", "Till exam", "Unlimited mocks", "Weekly mentor calls", "Valid till exam day"]
];

export default function PricingPage() {
  return (
    <>
      <SiteHeader />
      <main className="pricingRoute">
        <section className="pageHero darkHero">
          <div className="pageHeroInner">
            <h1>Pricing</h1>
            <p>Pick the plan that matches your exam window and prep intensity.</p>
          </div>
        </section>
        <section className="sectionInner pricingRouteGrid">
          {pricingPlans.map(([name, price, period, ...features], index) => (
            <article className={index === 2 ? "priceCard featured" : "priceCard"} key={name}>
              {index === 2 ? <span className="popularBadge">Most popular</span> : null}
              <p>{name}</p>
              <strong>{price}</strong>
              <span>{period}</span>
              <Link className="button priceButton" href="/cart">Choose {name}</Link>
              <ul>
                {features.map((feature) => (
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
