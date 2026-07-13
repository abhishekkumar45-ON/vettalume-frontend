import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Terms & Conditions | VettaLume",
  description: "The Terms of Service governing your use of the Vettalume platform."
};

export default function TermsAndConditionsPage() {
  return (
    <>
      <SiteHeader />
      <main className="policyPage">
        <section className="pageHero darkHero">
          <div className="pageHeroInner">
            <h1>Terms &amp; Conditions</h1>
          </div>
        </section>

        <section className="policyBody">
          <div className="policyInner">
            <p className="policyIntro">
              <strong>Terms of Service</strong>
              <br />
              Welcome to Vettalume&trade; (https://www.vettalume.com). This website is operated by Pravesio Consulting
              Private Limited, a company incorporated under the Companies Act, 2013, in India (CIN:
              U70200HR2025PTC134374), with its registered office at Flat No. B-3/103, Sahara Grace, M.G. Road, Gurgaon
              &ndash; 122002, Haryana. Vettalume&trade; provides online study materials, practice questions, mock
              examinations, analytics tools, and related educational services for CAT, GMAT and GRE examination
              preparation. We call all of these the &quot;Services.&quot; By accessing or using the platform in any
              way&mdash;including browsing, registering, purchasing, or simply visiting&mdash;you agree to these Terms of
              Service, our Privacy Policy, Subscription &amp; Refund Policy, and Content License &amp; Anti-Piracy
              Agreement (together, the &quot;Platform Agreements&quot;). If you don&apos;t agree, please don&apos;t use
              the platform. When we say &quot;you&quot; or &quot;your,&quot; we mean anyone who accesses or uses the
              platform. When we say &quot;we,&quot; &quot;us,&quot; or &quot;our,&quot; we mean Pravesio Consulting
              Private Limited.
            </p>

            <h2>1. What This Agreement Covers</h2>
            <p>
              <strong>1.1 Electronic consent</strong> You agree that clicking &quot;I Agree,&quot; &quot;Sign Up,&quot;
              &quot;Accept,&quot; or similar buttons, or continuing to use the platform after updated terms are posted,
              constitutes your electronic signature with the same legal force as a handwritten signature under the
              Information Technology Act, 2000.
            </p>
            <p>
              <strong>1.2 Examination body disclaimer</strong> Not affiliated with any examination body. Vettalume&trade;
              is an independent educational platform. We are not affiliated with, endorsed by, or associated with the
              Indian Institutes of Management (IIMs), the Graduate Management Admission Council (GMAC), or Educational
              Testing Service (ETS). &quot;CAT&quot; is a Common Admission Test conducted by the IIMs; &quot;GMAT&reg;&quot;
              is a registered trademark of the Graduate Management Admission Council; and &quot;GRE&reg;&quot; is a
              registered trademark of Educational Testing Service. We don&apos;t guarantee any exam outcome.
            </p>

            <h2>2. Who Can Use the Platform</h2>
            <p>
              You must be at least 18 years old (or the age of majority in your jurisdiction) to create an account. If
              you&apos;re between 16 and 18, you may use the platform only with a parent or legal guardian&apos;s
              consent&mdash;and they agree to be bound by these terms on your behalf and are jointly liable for your
              activity.
            </p>
            <p>By registering, you confirm that:</p>
            <ul>
              <li>You have the legal capacity to enter a binding agreement;</li>
              <li>All information you provide is truthful, accurate, and complete;</li>
              <li>If acting on behalf of an organisation, you&apos;re authorised to bind it;</li>
              <li>You&apos;re not barred from using the platform under any applicable law;</li>
              <li>
                You are not located in any jurisdiction subject to Indian or international sanctions, embargoes, or trade
                restrictions; and
              </li>
              <li>You will keep your registration information accurate and up to date.</li>
            </ul>
            <p>
              <strong>2.1 International users</strong> The platform is primarily designed for users in India. If you
              access the platform from outside India, you are responsible for compliance with all applicable local laws,
              including export controls, foreign exchange regulations (FEMA, 1999), and data protection laws of your
              jurisdiction. We make no representation that the platform is appropriate or available for use in all
              locations.
            </p>

            <h2>3. Your Account</h2>
            <p>
              <strong>3.1 Registration</strong> Some features require an account. You&apos;re responsible for keeping
              your login credentials confidential and for everything that happens under your account. If you suspect
              unauthorised access, notify us immediately at admin@vettalume.com.
            </p>
            <p>
              <strong>3.2 One person, one account</strong> Each account is for a single individual. You cannot share,
              sell, transfer, or let anyone else use your account. This is a strict rule&mdash;breaching it is grounds
              for immediate termination without refund.
            </p>
            <p>
              <strong>3.3 Device limits</strong> You may access the platform from up to 3 registered devices.
              Simultaneous active sessions from more than 2 devices will be flagged as potential credential sharing and
              may trigger a suspension. We may adjust these limits at any time by updating these terms.
            </p>
            <p>
              <strong>3.4 Account inactivity and dormancy</strong> If your account has no login activity for a
              continuous period of 12 months, we may classify it as dormant. For dormant accounts:
            </p>
            <ul>
              <li>
                We will send a notification to your registered email at least 30 days before taking any action;
              </li>
              <li>
                If you do not respond or log in within 30 days of notification, we may deactivate the account;
              </li>
              <li>
                Deactivated accounts can be reactivated by contacting admin@vettalume.com with identity verification;
              </li>
              <li>
                After 24 months of continuous inactivity following deactivation, we may permanently delete the account
                and all associated data, subject to legal retention requirements; and
              </li>
              <li>
                Any unused subscription time that lapsed during dormancy will not be refunded or extended.
              </li>
            </ul>
            <p>
              <strong>3.5 Account reactivation</strong> If your account was deactivated due to inactivity or voluntary
              termination (not for violation of terms), you may request reactivation within the time periods specified
              above. Reactivation does not restore expired subscriptions or previously available promotional pricing.
            </p>
            <p>
              <strong>3.6 Multiple accounts</strong> Creating multiple accounts to circumvent device limits, exploit
              promotions, evade bans, or for any other reason is strictly prohibited. If we detect multiple accounts
              belonging to the same person, we may terminate all such accounts without notice or refund.
            </p>

            <h2>4. How the Platform Works</h2>
            <p>
              <strong>4.1 Free and paid tiers</strong> We offer a freemium model:
            </p>
            <ul>
              <li>
                Free tier: Limited access to select study materials, sample questions, and basic features. We can
                change, reduce, or remove free tier content at any time without notice.
              </li>
              <li>
                Paid tiers: Full study notes, complete question banks, mock exams, analytics, and priority support.
                Exact features and pricing are on our pricing page.
              </li>
            </ul>
            <p>
              <strong>4.2 No guarantees on exam results</strong> We do not guarantee that using Vettalume&trade; will
              result in a particular score, percentile, or admission outcome in the CAT, GMAT, or GRE. Your results
              depend on your effort, prior knowledge, and exam conditions&mdash;factors beyond our control. Content is
              for educational and preparatory purposes only. No claims we make about content quality, coverage, or study
              methodology should be interpreted as a guarantee of exam performance.
            </p>
            <p>
              <strong>4.3 Content accuracy</strong> We work hard to keep content accurate and current, but we can&apos;t
              warrant it&apos;s error-free or always aligned with the latest exam pattern (which the conducting bodies
              may update from time to time). Cross-reference with official sources. If you find errors, please report
              them to admin@vettalume.com&mdash;we appreciate it, but correcting errors is at our discretion and
              timeline.
            </p>
            <p>
              <strong>4.4 We may change the platform</strong> We can modify, suspend, or discontinue any part of the
              platform at any time. If we materially reduce paid-tier features during your active subscription,
              we&apos;ll make reasonable efforts to notify you and may offer a pro-rata extension or credit at our
              discretion. Minor updates, bug fixes, UI changes, and feature additions don&apos;t count as material
              reductions.
            </p>
            <p>
              <strong>4.5 Platform availability</strong> We aim for high availability but do not guarantee any specific
              uptime percentage or SLA. The platform may be temporarily unavailable due to:
            </p>
            <ul>
              <li>
                Scheduled maintenance (we&apos;ll try to give advance notice via email or platform notification);
              </li>
              <li>Emergency maintenance or critical security patches;</li>
              <li>Third-party service disruptions (hosting, CDN, payment gateways); or</li>
              <li>Force majeure events (see Section 14).</li>
            </ul>
            <p>We are not liable for any loss, damage, or inconvenience caused by platform unavailability.</p>
            <p>
              <strong>4.6 Beta features and early access</strong> We may occasionally offer beta features, experimental
              tools, or early-access programs. These are provided &quot;as-is&quot; without any warranty. Beta features
              may:
            </p>
            <ul>
              <li>Be incomplete, buggy, or unstable;</li>
              <li>Be modified or removed without notice;</li>
              <li>Not represent the final version of any feature;</li>
              <li>Cause data loss (we&apos;ll warn you, but can&apos;t guarantee against it); and</li>
              <li>Be subject to additional terms presented at the time of access.</li>
            </ul>
            <p>
              By opting into beta features, you accept these risks. Feedback you provide on beta features is covered by
              Section 6.2.
            </p>
            <p>
              <strong>4.7 Price errors</strong> In the event of a pricing error on the platform (e.g., a paid tier
              displayed at an incorrect price due to a technical glitch), we reserve the right to cancel or refuse any
              orders placed at the incorrect price, even after payment confirmation. In such cases, we will issue a full
              refund for the affected transaction and notify you promptly. This right applies regardless of how the
              error occurred and whether the error was obvious or detectable by you.
            </p>

            <h2>5. Rules of Use</h2>
            <p>
              Use the platform only for your personal, non-commercial exam preparation. You agree not to:
            </p>
            <ul>
              <li>Copy, reproduce, distribute, or create derivative works from any content;</li>
              <li>Use bots, scrapers, crawlers, or any automated tools to access or extract content;</li>
              <li>Reverse-engineer, decompile, or attempt to extract the platform&apos;s source code or algorithms;</li>
              <li>Circumvent or interfere with any security, DRM, or anti-piracy features;</li>
              <li>Share, sell, or transfer your account or access rights;</li>
              <li>
                Use content for commercial purposes, including building competing products or coaching materials;
              </li>
              <li>Remove or alter any copyright notices, watermarks, or proprietary labels;</li>
              <li>Upload malware, viruses, or harmful code;</li>
              <li>Use platform content to train any AI or machine learning model;</li>
              <li>Frame, mirror, or embed the platform on any other server or site;</li>
              <li>Impersonate any person or entity, or misrepresent your affiliation;</li>
              <li>Use the platform in any way that violates applicable law;</li>
              <li>Interfere with the platform&apos;s infrastructure or impose unreasonable load;</li>
              <li>
                Access the platform through VPNs or anonymisation tools to evade restrictions or monitoring; or
              </li>
              <li>Help or encourage anyone else to do any of the above.</li>
            </ul>
            <p>
              We can investigate suspected violations and, at our discretion, suspend your account, report to
              authorities, and pursue legal remedies&mdash;all without prior notice.
            </p>
            <p>
              <strong>5.1 Academic integrity</strong> Vettalume&trade; is committed to academic integrity. You agree not
              to:
            </p>
            <ul>
              <li>
                Use the platform to gain unfair advantages in the CAT, GMAT, GRE, or any other examination in violation
                of the conducting body&apos;s rules and code of conduct;
              </li>
              <li>
                Share, distribute, or discuss specific examination questions during or after the exam in a way that
                violates the conducting body&apos;s policies;
              </li>
              <li>
                Misrepresent your exam scores, study progress, or Vettalume&trade; usage to third parties for fraudulent
                purposes (e.g., falsifying academic or professional credentials); or
              </li>
              <li>
                Use the platform&apos;s content to facilitate cheating in any examination or academic assessment.
              </li>
            </ul>
            <p>
              We may cooperate with the IIMs, GMAC, ETS, or other examination bodies if we become aware of or are
              notified about academic integrity violations.
            </p>

            <h2>6. Intellectual Property</h2>
            <p>
              <strong>6.1 We own the content</strong> All content on the platform&mdash;study notes, questions,
              explanations, knowledge graphs, visual aids, animations, code, algorithms, branding, and the platform
              itself&mdash;belongs to Pravesio Consulting Private Limited. These terms don&apos;t transfer any ownership
              to you. You get a limited, revocable, non-transferable licence to view content for personal study, and
              nothing more. For detailed licence terms, see the Content License &amp; Anti-Piracy Agreement.
            </p>
            <p>
              <strong>6.2 Your feedback</strong> If you send us suggestions, ideas, or feedback about the platform, you
              irrevocably assign all rights in that feedback to us. We can use it freely without restriction,
              attribution, or compensation. This includes feedback on beta features, bug reports, feature requests, and
              any other input.
            </p>
            <p>
              <strong>6.3 Third-party trademarks</strong> All trademarks, service marks, trade names, and logos
              displayed on the platform that are not owned by us are the property of their respective owners. Their
              display does not imply endorsement, affiliation, or sponsorship. Specifically: &quot;GMAT&reg;&quot; is a
              registered trademark of the Graduate Management Admission Council; &quot;GRE&reg;&quot; is a registered
              trademark of Educational Testing Service; and &quot;CAT&quot; (Common Admission Test) is conducted by the
              Indian Institutes of Management.
            </p>

            <h2>7. Content You Submit</h2>
            <p>If the platform lets you post comments, reviews, or other content:</p>
            <ul>
              <li>You&apos;re responsible for it and must have the rights to post it;</li>
              <li>
                You grant us a worldwide, royalty-free, irrevocable, perpetual, transferable, sublicensable licence to
                use, display, reproduce, modify, and create derivative works from it in connection with the platform;
              </li>
              <li>
                You represent that your content doesn&apos;t infringe any third-party rights, contain illegal material,
                or violate these terms;
              </li>
              <li>We can remove anything that violates these terms, at our discretion, without notice; and</li>
              <li>We have no obligation to monitor, review, store, or maintain your content.</li>
            </ul>

            <h2>8. Third-Party Services</h2>
            <p>
              The platform may link to or integrate with third-party websites, payment gateways, analytics services, or
              other tools. We&apos;re not responsible for their content, policies, availability, or practices. Use them
              at your own risk. Our display of third-party links does not imply endorsement.
            </p>
            <p>
              Specifically, payment processing is handled by authorised, PCI-DSS compliant third-party payment gateways.
              We are not liable for errors, failures, delays, or security issues on the part of payment processors.
            </p>

            <h2>9. Electronic Communications</h2>
            <p>
              By creating an account, you consent to receive electronic communications from us, including:
            </p>
            <ul>
              <li>Transactional emails (receipts, account alerts, subscription confirmations);</li>
              <li>Service updates, maintenance notifications, and security alerts;</li>
              <li>Product announcements, feature updates, and educational content;</li>
              <li>
                Marketing and promotional communications (only with your opt-in consent, and you can unsubscribe at any
                time); and
              </li>
              <li>Legal notices required under the Platform Agreements or applicable law.</li>
            </ul>
            <p>
              You agree that these electronic communications satisfy any legal requirement that such communications be
              in writing. Transactional and service communications are essential to your use of the platform and cannot
              be opted out of while maintaining an active account.
            </p>

            <h2>10. Disclaimers</h2>
            <p>
              The platform and all content are provided &quot;as is&quot; and &quot;as available.&quot; To the fullest
              extent permitted by law, we disclaim all warranties&mdash;express, implied, or statutory&mdash;including
              warranties of merchantability, fitness for a particular purpose, title, and non-infringement. We
              don&apos;t guarantee the platform will be uninterrupted, error-free, secure, or virus-free.
            </p>
            <p>
              Content on the platform is educational only&mdash;not financial, investment, legal, tax, career, or
              professional advice. Consult qualified professionals for those needs.
            </p>
            <p>
              We disclaim all liability for decisions you make based on platform content, including examination
              preparation strategies, career decisions, financial planning, or any other reliance on the content.
            </p>

            <h2>11. Limitation of Liability</h2>
            <p>
              <strong>11.1 No indirect damages</strong> To the maximum extent permitted by law, we (including our
              directors, officers, employees, and agents) are not liable for any indirect, incidental, special,
              consequential, or punitive damages&mdash;including loss of profits, revenue, data, goodwill, business
              opportunities, or anticipated savings&mdash;arising from your use of the platform, regardless of the legal
              theory, and even if we&apos;ve been advised of the possibility.
            </p>
            <p>
              <strong>11.2 Liability cap</strong> Our total liability for all claims is capped at the greater of: (a)
              the amount you paid us in the 12 months before the event giving rise to the claim, or (b) INR 5,000. This
              cap applies regardless of the form of action&mdash;contract, tort, strict liability, or otherwise, and
              covers all claims arising under or in connection with the Platform Agreements collectively, not per-claim.
            </p>
            <p>
              <strong>11.3 Specific exclusions</strong> Without limiting the above, we are specifically not liable for:
            </p>
            <ul>
              <li>Your failure to pass any examination or achieve any score;</li>
              <li>Errors, omissions, or inaccuracies in content;</li>
              <li>Unauthorised access to your account due to your failure to secure credentials;</li>
              <li>Interruptions, bugs, or errors in the platform;</li>
              <li>Third-party service failures (payment gateways, hosting, etc.);</li>
              <li>Currency conversion losses on international payments;</li>
              <li>Loss of data, study progress, or analytics history; or</li>
              <li>Conduct of other users on the platform.</li>
            </ul>
            <p>
              <strong>11.4 Why this matters</strong> These limitations are a fundamental part of the deal between us. We
              wouldn&apos;t be able to offer the platform at its current pricing without them. They apply even if any
              limited remedy here fails its essential purpose.
            </p>
            <p>
              <strong>11.5 Applicable law savings clause</strong> Some jurisdictions don&apos;t allow the exclusion of
              certain damages or warranties. If those laws apply to you, our liability is limited to the fullest extent
              permitted. Nothing in these terms excludes liability for fraud, wilful misconduct, or death/personal
              injury caused by negligence to the extent applicable law prevents such exclusion.
            </p>

            <h2>12. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Pravesio Consulting Private Limited, its affiliates, and
              their respective directors, officers, employees, agents, contractors, and successors (the
              &quot;Indemnified Parties&quot;) from any claims, damages, losses, and expenses (including reasonable legal
              fees, investigation costs, and settlement amounts) arising from: (a) Your use of the platform; (b) Your
              breach of these terms or any Platform Agreement; (c) Your violation of any law or third-party rights; (d)
              Your user content; (e) Any dispute between you and a third party arising from your platform use; (f) Your
              negligence, wilful misconduct, or fraud; or (g) Any regulatory investigation or proceeding triggered by
              your actions on the platform. We&apos;ll notify you of claims and cooperate in the defence at your expense.
              We reserve the right to assume exclusive defence and control of any claim at our own expense. You
              won&apos;t settle any claim without our written consent, which won&apos;t be unreasonably withheld.
            </p>

            <h2>13. Disputes and Governing Law</h2>
            <p>
              <strong>13.1 Governing law</strong> These terms are governed by the laws of India, without regard to
              conflict-of-law principles.
            </p>
            <p>
              <strong>13.2 Try to resolve it first</strong> Before starting any formal proceeding, the disputing party
              must send a written notice describing the dispute (a &quot;Dispute Notice&quot;). Both sides will try to
              resolve it through good-faith negotiation for 30 days from receipt of the notice.
            </p>
            <p>
              <strong>13.3 Arbitration</strong> If negotiation fails, the dispute goes to final and binding arbitration
              under the Arbitration and Conciliation Act, 1996. The arbitration will be in English, seated in Gurugram,
              Haryana, India, with a sole arbitrator. If the parties can&apos;t agree on an arbitrator within 15 days,
              DIAC (Delhi International Arbitration Centre) will appoint one. The arbitrator&apos;s award is final and
              enforceable in any court of competent jurisdiction.
            </p>
            <p>
              <strong>13.4 No class actions</strong> You agree that any dispute will be resolved individually&mdash;not
              as a class action, collective action, or representative proceeding. You waive any right to participate in
              class proceedings. If this waiver is unenforceable for a particular claim, that claim may be brought in
              court instead.
            </p>
            <p>
              <strong>13.5 Courts</strong> For matters not subject to arbitration (like applications for interim or
              injunctive relief), the courts of Gurugram, Haryana, India have exclusive jurisdiction.
            </p>
            <p>
              <strong>13.6 Injunctive relief</strong> We can seek immediate injunctive relief from any court to prevent
              breaches of these terms or IP infringement&mdash;without posting a bond, proving actual damages, or
              exhausting the arbitration process first.
            </p>
            <p>
              <strong>13.7 Time limit on claims</strong> Any claim related to these terms or the platform must be filed
              within 1 year of the event&mdash;otherwise it&apos;s permanently barred (to the extent permitted by law).
              This limitation applies regardless of the form of action.
            </p>
            <p>
              <strong>13.8 Cooperation with investigations</strong> We may cooperate fully with law enforcement,
              regulatory bodies, Governmental Authorities, and court orders&mdash;including disclosing your account
              information&mdash;if we believe in good faith that it&apos;s required by law or necessary to protect our
              rights, the platform, our users, or the public. We will make reasonable efforts to notify you in advance
              unless prohibited by law or court order.
            </p>

            <h2>14. Termination</h2>
            <p>
              <strong>14.1 We can terminate</strong> We may suspend or terminate your account at any time, for any
              reason or no reason, with or without notice&mdash;including for breach of terms, fraud, illegal activity,
              non-payment, abusive behaviour towards staff, regulatory/legal requirements, or if we discontinue the
              platform.
            </p>
            <p>
              <strong>14.2 You can terminate</strong> Delete your account through settings or email admin@vettalume.com.
              No refunds on termination.
            </p>
            <p>
              <strong>14.3 What happens on termination</strong> Your licence to use the platform ends immediately. You
              must stop using the platform and destroy any content in your possession. Any money you owe us becomes due
              immediately. We may delete your data per our Privacy Policy and applicable retention requirements.
            </p>
            <p>
              <strong>14.4 What survives</strong> The following sections survive termination: Sections 1.2 (Examination
              body disclaimer), 5 (Rules of Use), 6 (IP), 7 (User Content licence grant), 9 (Electronic Communications
              consent), 10 (Disclaimers), 11 (Liability), 12 (Indemnification), 13 (Disputes), 14.3&ndash;14.4
              (Termination effects and survival), 15 (Force Majeure), and 16&ndash;19 (General, Compliance, Referrals,
              Contact)&mdash;and any other provision that by its nature should survive.
            </p>

            <h2>15. Force Majeure</h2>
            <p>
              We&apos;re not liable for failures or delays caused by events beyond our reasonable control, including but
              not limited to: natural disasters (floods, earthquakes, fires), epidemics or pandemics, war, terrorism,
              insurrection, civil disturbance, government actions, sanctions, embargoes, regulations, strikes, labour
              disputes, cyberattacks by third parties (DDoS, ransomware), internet or hosting infrastructure failures,
              power outages, or failures of third-party service providers.
            </p>
            <p>
              During a force majeure event, we&apos;ll use commercially reasonable efforts to mitigate the impact and
              resume service. If such an event continues for more than 90 consecutive days, either party may terminate
              these terms by written notice, without further liability except for obligations already accrued.
            </p>

            <h2>16. General Terms</h2>
            <p>
              <strong>16.1 Entire agreement</strong> These terms, together with our Privacy Policy, Subscription &amp;
              Refund Policy, and Content License &amp; Anti-Piracy Agreement, are the complete agreement between us. They
              replace all prior agreements on this subject, whether written or oral.
            </p>
            <p>
              <strong>16.2 Severability</strong> If any provision is found invalid or unenforceable, it will be modified
              to the minimum extent necessary to make it enforceable while preserving its intent. If modification
              isn&apos;t possible, the provision is severed. The rest of the terms continue in full force.
            </p>
            <p>
              <strong>16.3 No waiver</strong> If we don&apos;t enforce a right under these terms, that doesn&apos;t mean
              we&apos;ve waived it. No single or partial exercise of a right precludes any other exercise. Waivers must
              be in writing and signed by us to be effective.
            </p>
            <p>
              <strong>16.4 Assignment</strong> You can&apos;t assign your rights or obligations under these terms without
              our written consent. We can assign ours freely&mdash;including in connection with a merger, acquisition,
              corporate reorganisation, or asset sale. Subject to this, these terms bind and benefit the parties and
              their successors.
            </p>
            <p>
              <strong>16.5 Changes to these terms</strong> We can update these terms at any time. For material changes,
              we&apos;ll give at least 15 days&apos; notice by email or platform notification. Continued use after the
              effective date means you accept the changes. If you disagree, stop using the platform and close your
              account.
            </p>
            <p>
              <strong>16.6 Language</strong> These terms are in English. If there&apos;s a conflict with any
              translation, the English version prevails.
            </p>
            <p>
              <strong>16.7 No partnership</strong> Nothing in these terms creates a partnership, joint venture,
              employment, agency, or fiduciary relationship between us. Neither party can bind the other.
            </p>
            <p>
              <strong>16.8 No third-party beneficiaries</strong> These terms are between you and us. No third party has
              rights under these terms, except the Indemnified Parties under Section 12 who are express third-party
              beneficiaries of that section.
            </p>
            <p>
              <strong>16.9 Notices to us</strong> Legal notices to us must be sent by email to admin@vettalume.com or by
              registered post to our registered office. Notices are deemed received upon actual receipt.
            </p>
            <p>
              <strong>16.10 Set-off</strong> We may set off any amounts you owe us under these terms or any Platform
              Agreement against any amounts we may owe you, without prior notice.
            </p>
            <p>
              <strong>16.11 Cumulative remedies</strong> All rights and remedies under these terms are cumulative and in
              addition to any other rights and remedies available at law or in equity. Exercising one remedy does not
              preclude any other.
            </p>
            <p>
              <strong>16.12 Error and omission correction</strong> We reserve the right to correct any errors,
              inaccuracies, or omissions on the platform&mdash;including in pricing, content, features, and promotional
              offers&mdash;at any time without prior notice. Corrections may apply retroactively where necessary (subject
              to Section 4.7 for pricing errors).
            </p>

            <h2>17. Compliance with Law</h2>
            <p>
              <strong>17.1 Your compliance obligations</strong> You agree to comply with all applicable laws in your use
              of the platform, including:
            </p>
            <ul>
              <li>The Information Technology Act, 2000 and rules thereunder;</li>
              <li>The Consumer Protection Act, 2019 and E-Commerce Rules, 2020;</li>
              <li>The Foreign Exchange Management Act, 1999 (FEMA), if you&apos;re an international user;</li>
              <li>All applicable anti-money laundering and anti-corruption laws;</li>
              <li>All applicable sanctions and export control regulations; and</li>
              <li>Data protection laws applicable in your jurisdiction.</li>
            </ul>
            <p>
              <strong>17.2 Anti-bribery</strong> You represent that you will not, in connection with your use of the
              platform, make, offer, promise, or authorise any payment or transfer of anything of value, directly or
              indirectly, to any government official, public servant, or any other person to secure an improper
              advantage. Any suspected violation may be reported to relevant authorities.
            </p>
            <p>
              <strong>17.3 Sanctions compliance</strong> You represent that you are not: (a) listed on any applicable
              sanctions list maintained by the Government of India, the United Nations, the United States (OFAC), the
              European Union, or the United Kingdom; (b) located in, incorporated under, or a national of any embargoed
              or sanctioned territory; or (c) owned or controlled by any person or entity described in (a) or (b). If any
              of these representations become untrue, you must immediately notify us and cease using the platform.
            </p>

            <h2>18. Referral Programs and Gift Subscriptions</h2>
            <p>
              <strong>18.1 Referral programs</strong> If we offer a referral program, it will be subject to specific
              terms communicated at the time. General rules:
            </p>
            <ul>
              <li>
                Referral rewards are for genuine referrals to real individuals&mdash;not to yourself, fake accounts, or
                bots;
              </li>
              <li>
                We reserve the right to withhold, revoke, or claw back referral rewards if we detect fraud, gaming, or
                abuse;
              </li>
              <li>
                Referral rewards have no cash value and cannot be transferred, sold, or exchanged; and
              </li>
              <li>We may modify or discontinue the referral program at any time without notice.</li>
            </ul>
            <p>
              <strong>18.2 Gift subscriptions</strong> If we offer gift subscriptions:
            </p>
            <ul>
              <li>Gift subscriptions are non-refundable once purchased;</li>
              <li>The recipient must create an account and agree to these terms to redeem the gift;</li>
              <li>
                Gift subscriptions cannot be converted to cash or transferred to a different recipient after purchase;
              </li>
              <li>Unclaimed gift subscriptions expire 12 months from the date of purchase; and</li>
              <li>The purchaser is responsible for ensuring the recipient&apos;s eligibility.</li>
            </ul>

            <h2>19. Contact</h2>
            <p>
              Pravesio Consulting Private Limited
              <br />
              <strong>Registered Office:</strong> Flat No. B-3/103, Sahara Grace, M.G. Road, Gurgaon &ndash; 122002,
              Haryana
              <br />
              <strong>CIN:</strong> U70200HR2025PTC134374
              <br />
              <strong>Email:</strong> admin@vettalume.com
              <br />
              <strong>Website:</strong> https://www.vettalume.com
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
