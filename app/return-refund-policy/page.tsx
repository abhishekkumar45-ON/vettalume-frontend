import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Return & Refund Policy | VettaLume",
  description: "The policy governing purchases, subscriptions, and refunds on Vettalume."
};

export default function ReturnRefundPolicyPage() {
  return (
    <>
      <SiteHeader />
      <main className="policyPage">
        <section className="pageHero darkHero">
          <div className="pageHeroInner">
            <h1>Return &amp; Refund Policy</h1>
          </div>
        </section>

        <section className="policyBody">
          <div className="policyInner">
            <p className="policyIntro">
              <strong>Return &amp; Refund Policy</strong>
              <br />
              This policy governs all purchases on Vettalume&trade; (https://www.vettalume.com), operated by Pravesio
              Consulting Private Limited (CIN: U70200HR2025PTC134374). By completing a purchase, you agree to these terms
              and confirm you&apos;ve reviewed the platform&apos;s features before buying.
            </p>

            <h2>1. What This Policy Covers</h2>
            <p>
              This policy applies to all purchases made on the platform and forms part of the Platform Agreements.
            </p>

            <h2>2. Free and Paid Tiers</h2>
            <p>
              <strong>2.1 Free tier</strong> Free access includes select study materials, limited practice questions,
              and basic features. We can change or remove free content at any time without notice. The free tier is a
              courtesy, not a contractual commitment.
            </p>
            <p>
              <strong>2.2 Paid tiers</strong>
            </p>
            <ul>
              <li>Full study notes covering the complete CAT, GMAT and GRE curriculum</li>
              <li>Unrestricted question bank with detailed explanations</li>
              <li>Full-length mock exams</li>
              <li>Advanced analytics, progress tracking, and personalised recommendations</li>
              <li>Priority support</li>
              <li>Early access to new features</li>
            </ul>
            <p>
              <strong>2.3 Feature changes</strong> If we materially reduce core paid-tier features during your active
              subscription, we may offer a pro-rata extension, credit, or comparable alternative&mdash;at our discretion.
              Minor updates, bug fixes, and UI changes don&apos;t count.
            </p>
            <p>
              <strong>2.4 Enterprise and group licensing</strong> For corporate, institutional, or group purchases (5+
              seats), separate enterprise licensing terms apply. Contact admin@vettalume.com for custom pricing and
              volume licensing. Enterprise agreements supersede individual subscription terms where they conflict.
            </p>

            <h2>3. Pricing and Payment</h2>
            <p>
              <strong>3.1 Prices</strong> All prices are in Indian Rupees (INR) and include GST unless separately
              itemised. We can change prices at any time, but changes won&apos;t affect your current active subscription
              period.
            </p>
            <p>
              <strong>3.2 Price errors</strong> If a pricing error occurs (e.g., a plan displayed at an incorrect price
              due to a technical glitch), we may cancel or refuse orders at the incorrect price, even after payment
              confirmation. In such cases, we&apos;ll issue a full refund and notify you promptly.
            </p>
            <p>
              <strong>3.3 How payments work</strong> Payments go through our PCI-DSS compliant payment gateway. We never
              store card numbers. We accept credit/debit cards, net banking, UPI, and digital wallets as shown at
              checkout.
            </p>
            <p>
              <strong>3.4 Payment confirmation</strong> You&apos;ll receive an electronic receipt by email. Keep it for
              your records. This constitutes proof of purchase.
            </p>
            <p>
              <strong>3.5 Failed payments</strong> If a payment fails, your subscription won&apos;t activate or renew.
              We&apos;ll notify you and let you retry. If a previously successful payment is reversed or charged back,
              your access may be suspended until resolved.
            </p>
            <p>
              <strong>3.6 Late payment and collections</strong> If you have an outstanding balance (e.g., from a
              reversed payment or failed auto-renewal):
            </p>
            <ul>
              <li>We&apos;ll send reminders at 7 days and 14 days after the due date</li>
              <li>Access to paid features will be suspended until the balance is cleared</li>
              <li>
                We reserve the right to charge interest on overdue amounts at the rate of 1.5% per month or the maximum
                rate permitted by law, whichever is lower
              </li>
              <li>
                Persistent non-payment may result in account termination and referral to a collections agency, in which
                case you&apos;ll be responsible for all collection costs
              </li>
            </ul>
            <p>
              <strong>3.7 Taxes</strong> GST is included in displayed prices. We&apos;re registered under GST and will
              provide a valid tax invoice. For GST input credit, add your GSTIN in account settings before purchasing.
            </p>
            <p>
              <strong>3.8 International payments</strong> If paying from outside India, you&apos;re responsible for
              currency conversion fees and cross-border charges from your bank. We&apos;re not liable for exchange rate
              fluctuations.
            </p>

            <h2>4. Subscription Terms</h2>
            <p>
              <strong>4.1 Instant activation</strong> Your subscription activates immediately upon successful payment.
              You expressly request and consent to immediate delivery of digital content.
            </p>
            <p>
              <strong>4.2 Duration</strong> Subscriptions run for the period shown at purchase (monthly, quarterly,
              semi-annual, or annual). They expire at the end of that period unless renewed.
            </p>
            <p>
              <strong>4.3 Auto-renewal</strong> By default, subscriptions do not auto-renew. If auto-renewal is
              available, it&apos;ll be disclosed at checkout. With auto-renewal enabled:
            </p>
            <ul>
              <li>Renews at the then-current price</li>
              <li>Charged up to 72 hours before period ends</li>
              <li>Reminder email at least 7 days before renewal</li>
              <li>Cancel anytime via account settings or admin@vettalume.com</li>
            </ul>
            <p>
              <strong>4.4 Grace period</strong> If your subscription expires (non-renewal) or a renewal payment fails,
              you have a 7-day grace period during which:
            </p>
            <ul>
              <li>Your account will display a renewal prompt</li>
              <li>
                You can renew at the current price without losing your study progress or analytics history
              </li>
              <li>Access to paid content will be restricted (read-only for previously accessed materials)</li>
              <li>After the grace period, your account reverts to the free tier and full paid access is lost</li>
            </ul>
            <p>
              <strong>4.5 Subscription pause/freeze</strong> We may offer the option to pause your subscription for a
              defined period (e.g., 30 days). If available:
            </p>
            <ul>
              <li>Pause is available once per subscription period</li>
              <li>Your subscription end date extends by the pause duration</li>
              <li>Access to paid content is suspended during the pause</li>
              <li>You can unpause early at any time via account settings</li>
              <li>
                Pause availability, limits, and duration are displayed in account settings and may vary by tier
              </li>
            </ul>
            <p>
              <strong>4.6 Upgrades and downgrades</strong> Upgrade anytime&mdash;pricing is prorated. Downgrades take
              effect at end of current period. No partial refunds for the price difference.
            </p>
            <p>
              <strong>4.7 Account reactivation</strong> If your account was deactivated due to subscription expiry or
              voluntary cancellation (not for terms violation), you may reactivate by purchasing a new subscription.
              Your study progress and analytics history will be restored if reactivation occurs within 12 months of
              deactivation. After 12 months, previously stored progress may not be recoverable. Reactivation does not
              restore expired subscriptions or promotional pricing.
            </p>

            <h2>5. Refund Policy</h2>
            <p>
              All sales are final. No refunds. Vettalume&trade; is a digital product. Content is delivered and
              accessible immediately upon payment. Under the Consumer Protection (E-Commerce) Rules, 2020, digital goods
              consumed on delivery are non-refundable.
            </p>
            <p>
              <strong>5.1 What you&apos;re acknowledging</strong>
            </p>
            <ul>
              <li>You&apos;re buying digital content delivered immediately</li>
              <li>You&apos;ve tried the free tier and reviewed paid features before buying</li>
              <li>You request immediate delivery and waive any cooling-off period</li>
              <li>
                No refund for: unused time, partial use, dissatisfaction, exam failure, change of mind, scheduling,
                device/internet issues, or post-purchase price drops
              </li>
              <li>The no-refund policy is reflected in our pricing</li>
            </ul>
            <p>
              <strong>5.2 Narrow exceptions</strong>
            </p>
            <ol>
              <li>Duplicate charge: Technical error caused a double charge. Provide bank statement as proof.</li>
              <li>
                Extended outage: Platform substantially unavailable for 7+ consecutive days due to our fault (not force
                majeure, maintenance, or third-party failures), and we couldn&apos;t extend your subscription.
              </li>
              <li>
                Unauthorised transaction: Purchase without your authorisation (not credential sharing). Report within 72
                hours, cooperate with investigation, file police complaint if requested.
              </li>
            </ol>
            <p>
              <strong>5.3 How to request</strong> Email admin@vettalume.com within 15 days (72 hours for unauthorised
              transactions). Include name, email, transaction ID, date, description with evidence, and which exception
              applies. Response within 15 business days. Approved refunds to original payment method within 21 business
              days. Decision is final, subject to applicable law.
            </p>
            <p>
              <strong>5.4 Chargebacks</strong> Don&apos;t initiate a bank chargeback without contacting us first. If you
              file without following our process, we may suspend your account, terminate it if unjustified, recover
              amounts plus fees, and report suspected fraud.
            </p>

            <h2>6. Cancellation</h2>
            <p>Cancel anytime via account settings or admin@vettalume.com. On cancellation:</p>
            <ul>
              <li>Keep access until end of current period</li>
              <li>No refund for remaining time</li>
              <li>Auto-renewal disabled</li>
              <li>Account reverts to free tier</li>
            </ul>
            <p>Cancellation for breach of terms: no refund.</p>

            <h2>7. Promotions, Discounts, and Trials</h2>
            <p>
              <strong>7.1 General rules</strong>
            </p>
            <ul>
              <li>Subject to specific terms communicated at the time</li>
              <li>Non-transferable and can&apos;t be combined unless stated</li>
              <li>May be limited in quantity/duration and withdrawn anytime</li>
              <li>Void if obtained through fraud, multi-account abuse, or exploiting bugs</li>
              <li>For first-time subscribers only unless stated otherwise</li>
              <li>Cannot be applied retroactively to existing subscriptions</li>
            </ul>
            <p>
              <strong>7.2 Promotional abuse prevention</strong> We actively monitor for promotional abuse, including:
            </p>
            <ul>
              <li>Creating multiple accounts to claim the same offer repeatedly</li>
              <li>Using fake or temporary email addresses to exploit trial periods</li>
              <li>Sharing discount codes publicly when they were intended for specific recipients</li>
              <li>Using automated tools or bots to claim offers</li>
              <li>Any other activity designed to exploit promotional mechanics</li>
            </ul>
            <p>
              If we detect abuse, we may void the promotional benefit, charge the full price, suspend or terminate
              affected accounts, and ban the user from future promotions.
            </p>
            <p>
              <strong>7.3 Free trials</strong> If offered, trial period, features, and auto-conversion terms will be
              disclosed upfront. Cancel before trial ends to avoid charges. One trial per person&mdash;we use device
              fingerprinting and payment method data to enforce this.
            </p>
            <p>
              <strong>7.4 No price matching</strong> We don&apos;t offer price matching, retroactive discounts, or
              refunds for post-purchase price drops.
            </p>

            <h2>8. Gift Subscriptions and Vouchers</h2>
            <p>If we offer gift subscriptions or vouchers:</p>
            <ul>
              <li>Non-refundable once purchased</li>
              <li>Recipient must create an account and accept our terms to redeem</li>
              <li>Cannot be converted to cash or transferred after purchase</li>
              <li>Expire 12 months from purchase date if unclaimed</li>
              <li>Only one voucher/gift code per account unless specified</li>
              <li>
                Lost or stolen voucher codes are the purchaser&apos;s responsibility&mdash;we can&apos;t replace them
              </li>
              <li>Purchaser is responsible for recipient&apos;s eligibility</li>
            </ul>

            <h2>9. General</h2>
            <p>
              <strong>9.1 Changes</strong> We can update this policy. Changes won&apos;t retroactively affect active
              subscriptions on pricing/refund terms. 15 days&apos; notice for material changes.
            </p>
            <p>
              <strong>9.2 Consumer protection</strong> Compliant with Consumer Protection Act, 2019 and E-Commerce
              Rules, 2020. Mandatory consumer rights prevail where they conflict.
            </p>
            <p>
              <strong>9.3 Governing law</strong> Governed by Indian law. Disputes follow the Terms of Service.
            </p>

            <h2>10. Contact</h2>
            <p>
              Pravesio Consulting Private Limited
              <br />
              <strong>Registered Office:</strong> Flat No. B-3/103, Sahara Grace, M.G. Road, Gurgaon &ndash; 122002,
              Haryana
              <br />
              <strong>Email:</strong> admin@vettalume.com
              <br />
              <strong>Web:</strong> https://www.vettalume.com
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
