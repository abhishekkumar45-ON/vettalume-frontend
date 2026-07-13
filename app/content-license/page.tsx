import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Content License & Anti-Piracy Agreement | VettaLume",
  description: "How you can and can't use Vettalume's original educational content."
};

export default function ContentLicensePage() {
  return (
    <>
      <SiteHeader />
      <main className="policyPage">
        <section className="pageHero darkHero">
          <div className="pageHeroInner">
            <h1>Content License &amp; Anti-Piracy Agreement</h1>
          </div>
        </section>

        <section className="policyBody">
          <div className="policyInner">
            <p className="policyIntro">
              <strong>Content License &amp; Anti-Piracy Agreement</strong>
              <br />
              Vettalume&trade; invests heavily in creating original, high-quality educational content&mdash;study notes,
              knowledge graphs, question banks, visual aids, animations, and analytics. This agreement protects that
              investment and sets clear rules for how you can (and can&apos;t) use our content. This agreement is part of
              our Terms of Service and is legally binding on all users of https://www.vettalume.com, operated by Pravesio
              Consulting Private Limited (CIN: U70200HR2025PTC134374).
            </p>

            <h2>1. Why This Agreement Exists</h2>
            <p>
              Vettalume&trade; invests heavily in creating original, high-quality educational content&mdash;study notes,
              knowledge graphs, question banks, visual aids, animations, and analytics. This agreement protects that
              investment and sets clear rules for how you can (and can&apos;t) use our content.
            </p>

            <h2>2. Key Definitions</h2>
            <p>
              <strong>&quot;Content&quot;</strong> &mdash; everything on the platform: study notes, knowledge graphs,
              questions, answer explanations, mock exams, visual aids, animations, interactive elements, diagrams,
              charts, algorithms, software code, database structures, and the arrangement/compilation of all the above.
            </p>
            <p>
              <strong>&quot;Anti-Piracy Measures&quot;</strong> &mdash; all technical protections: digital watermarking,
              device fingerprinting, copy prevention, content rendering protection, behavioural analytics, session
              controls, and any other DRM.
            </p>
            <p>
              <strong>&quot;Authorised Use&quot;</strong> &mdash; viewing content on the platform through your own
              account, on your own devices, solely for your personal CAT, GMAT and GRE exam preparation.
            </p>
            <p>
              <strong>&quot;Digital Watermark&quot;</strong> &mdash; visible or invisible identifiers embedded in content
              that trace it back to your account.
            </p>
            <p>
              <strong>&quot;Derivative Work&quot;</strong> &mdash; any work based on our content: translations,
              summaries, paraphrases, visual recreations, reorganisations, or any adaptation.
            </p>
            <p>
              <strong>&quot;Infringing Activity&quot;</strong> &mdash; any unauthorised reproduction, distribution,
              display, performance, transmission, or commercial exploitation of Content.
            </p>

            <h2>3. We Own the Content</h2>
            <p>
              All content is the exclusive property of Pravesio Consulting Private Limited, protected under:
            </p>
            <ul>
              <li>The Copyright Act, 1957;</li>
              <li>The Trade Marks Act, 1999;</li>
              <li>The Information Technology Act, 2000;</li>
              <li>The Berne Convention and WIPO Copyright Treaty;</li>
              <li>TRIPS and all other applicable IP laws; and</li>
              <li>Database rights under applicable law (for knowledge graphs and compilations).</li>
            </ul>
            <p>These terms don&apos;t transfer any ownership to you.</p>

            <h2>4. What You Can Do</h2>
            <ul>
              <li>View content through the platform on your registered devices;</li>
              <li>Take personal handwritten or typed notes (not substantially reproducing the content); and</li>
              <li>Use platform features (quizzes, mocks, analytics) as intended.</li>
            </ul>
            <p>That&apos;s it. Everything else requires our written permission.</p>

            <h2>5. What You Cannot Do</h2>
            <h3>5.1 Copy or reproduce</h3>
            <ul>
              <li>Take screenshots, screen recordings, photos, or manual transcriptions;</li>
              <li>Use OCR, text extraction, or any tool to extract content;</li>
              <li>Download, save, cache (beyond normal browser caching), or print; or</li>
              <li>Create any Derivative Work.</li>
            </ul>
            <h3>5.2 Share or distribute</h3>
            <ul>
              <li>Send content via any channel (email, WhatsApp, Telegram, Discord, social media, forums);</li>
              <li>Upload to any cloud/file-sharing service (Google Drive, Dropbox, Mega, Scribd, torrents);</li>
              <li>Display in classrooms, study groups, coaching centres, webinars; or</li>
              <li>Post on any website, app, or platform.</li>
            </ul>
            <h3>5.3 Use commercially</h3>
            <ul>
              <li>Create, sell, or distribute competing products using our content;</li>
              <li>Use for paid tutoring, coaching, or consulting;</li>
              <li>Sell, resell, rent, or sublicense access; or</li>
              <li>Use content to train any AI, machine learning model, or LLM &mdash; commercial or non-commercial.</li>
            </ul>
            <h3>5.4 Tamper with protections</h3>
            <ul>
              <li>Circumvent, disable, or interfere with any Anti-Piracy Measures or DRM;</li>
              <li>Use bots, scrapers, or automated tools;</li>
              <li>Reverse-engineer the platform or content delivery;</li>
              <li>Remove, alter, or obscure any copyright notices, watermarks, or labels;</li>
              <li>Frame, mirror, or proxy the platform; or</li>
              <li>Use VPNs or anonymisation tools to evade monitoring.</li>
            </ul>
            <h3>5.5 Abuse your account</h3>
            <ul>
              <li>Share login credentials;</li>
              <li>Create multiple accounts to circumvent restrictions; or</li>
              <li>Let anyone else access through your account.</li>
            </ul>

            <h2>6. How We Protect Content</h2>
            <ol>
              <li>
                <strong>Digital watermarking:</strong> Visible and invisible watermarks unique to your account. Survive
                screenshots, photos, and printouts.
              </li>
              <li>
                <strong>Device fingerprinting:</strong> Detect credential sharing and multi-device abuse.
              </li>
              <li>
                <strong>Behavioural analytics:</strong> Monitor access patterns for automated extraction or abnormal
                use.
              </li>
              <li>
                <strong>Copy prevention:</strong> Text selection, right-click, keyboard shortcuts, dev tools, and print
                restricted.
              </li>
              <li>
                <strong>Content rendering:</strong> Dynamic rendering, session tokens, chunked delivery.
              </li>
              <li>
                <strong>Session controls:</strong> Concurrent limits, device registration, geographic anomaly
                detection, rate limiting.
              </li>
            </ol>
            <p>
              Everything is traceable. Leaked content found anywhere online can be traced to the specific account.
              You&apos;re responsible for all content accessed through your account.
            </p>

            <h2>7. We Actively Monitor</h2>
            <h3>7.1 On the platform</h3>
            <p>
              We log and analyse access patterns. Suspicious activity may trigger verification, throttling, or account
              suspension.
            </p>
            <h3>7.2 Across the internet</h3>
            <ul>
              <li>Social media (Facebook, Instagram, LinkedIn, Twitter/X, YouTube, Reddit);</li>
              <li>Messaging apps (Telegram, WhatsApp, Discord, Signal);</li>
              <li>File-sharing services (Google Drive, Dropbox, Mega, Scribd, torrents, P2P networks);</li>
              <li>Educational forums and study communities;</li>
              <li>E-commerce platforms;</li>
              <li>The dark web and anonymised platforms; and</li>
              <li>Search engine indexes and cached copies.</li>
            </ul>

            <h2>8. Consequences of Violation</h2>
            <h3>8.1 Account actions</h3>
            <ul>
              <li>Formal warning;</li>
              <li>Restrict access to specific content or features;</li>
              <li>Suspend account pending investigation;</li>
              <li>Permanently terminate account without refund;</li>
              <li>Permanently ban from creating new accounts; and</li>
              <li>Preserve all evidence for legal proceedings.</li>
            </ul>
            <h3>8.2 Civil legal action</h3>
            <ul>
              <li>
                Copyright infringement suits under Sections 51, 55, 63 of the Copyright Act&mdash;damages, injunctions,
                cost recovery.
              </li>
              <li>Breach of contract suits for violation of these terms.</li>
              <li>
                Injunctive relief &mdash; ex-parte interim injunctions, John Doe / Ashok Kumar orders, dynamic
                website-blocking orders.
              </li>
              <li>
                Anton Piller (search and seizure) orders &mdash; court orders permitting inspection and seizure of
                infringing materials at the infringer&apos;s premises without prior notice, to prevent destruction of
                evidence.
              </li>
              <li>
                Mareva (asset freezing) injunctions &mdash; court orders freezing the infringer&apos;s assets to prevent
                dissipation before judgment.
              </li>
              <li>
                Takedown notices &mdash; DMCA notices, IT Act intermediary guidelines, and equivalent provisions to
                ISPs, hosting providers, social media platforms, search engines, and domain registrars.
              </li>
              <li>Discovery orders compelling third parties to reveal identity of anonymous infringers.</li>
              <li>Disgorgement of profits earned from Infringing Activity.</li>
              <li>
                Search engine de-indexing &mdash; requesting Google, Bing, and other search engines to remove
                infringing URLs from search results under their copyright policies.
              </li>
              <li>
                Domain seizure &mdash; seeking orders from domain registrars to suspend or transfer domains hosting
                infringing content.
              </li>
            </ul>
            <h3>8.3 Contributory and vicarious liability</h3>
            <p>We will pursue claims not only against direct infringers but also against any person who:</p>
            <ul>
              <li>
                Contributes to infringement &mdash; knowingly inducing, causing, or materially contributing to
                Infringing Activity (e.g., running a Telegram channel that distributes our content, providing tools or
                platforms that facilitate infringement);
              </li>
              <li>
                Benefits from infringement &mdash; deriving financial or other benefit from Infringing Activity while
                having the right and ability to supervise or control it (e.g., coaching centres using our materials
                without licence); or
              </li>
              <li>
                Induces infringement &mdash; actively encouraging, promoting, or soliciting others to engage in
                Infringing Activity.
              </li>
            </ul>
            <h3>8.4 Criminal prosecution</h3>
            <ul>
              <li>
                Copyright Act, S. 63: 6 months to 3 years imprisonment + &#8377;50K to &#8377;2L fine (first offence). S.
                63A: Enhanced for repeat.
              </li>
              <li>IT Act, S. 43: Up to &#8377;5 crore compensation for data theft/system damage.</li>
              <li>
                IT Act, S. 65/66: Up to 3 years + fine for source code tampering and computer offences.
              </li>
              <li>
                Bharatiya Nyaya Sanhita: Criminal breach of trust, cheating, dishonest misappropriation.
              </li>
            </ul>
            <h3>8.5 Liquidated damages</h3>
            <p>Piracy causes real financial harm. These are genuine pre-estimates&mdash;not penalties:</p>
            <ul>
              <li>Sharing with individuals: &#8377;5,00,000 per instance</li>
              <li>Public distribution (social media, forums, groups): &#8377;10,00,000 per instance</li>
              <li>
                Commercial exploitation (selling, competing products): &#8377;25,00,000 per instance + all revenue
              </li>
              <li>Circumventing anti-piracy measures: &#8377;10,00,000 per instance</li>
              <li>AI/ML training using content: &#8377;50,00,000 per instance</li>
              <li>Contributory/vicarious infringement: &#8377;15,00,000 per instance</li>
            </ul>
            <p>These are in addition to actual damages, lost revenue, and legal costs.</p>
            <h3>8.6 Irreparable harm</h3>
            <p>
              You acknowledge any violation causes immediate, irreparable harm for which monetary damages alone are
              inadequate. We can seek injunctive relief without posting a bond, proving actual damages, or exhausting
              arbitration.
            </p>

            <h2>9. DMCA and Takedown Procedures</h2>
            <h3>9.1 Designated DMCA agent</h3>
            <p>
              Our designated agent for receiving copyright infringement notifications under the U.S. Digital Millennium
              Copyright Act (DMCA) and equivalent laws is:
            </p>
            <p>
              <strong>Name:</strong> Niyati Arora
              <br />
              <strong>Email:</strong> admin@vettalume.com
              <br />
              <strong>Address:</strong> Flat No. B-3/103, Sahara Grace, M.G. Road, Gurgaon &ndash; 122002, Haryana
            </p>
            <h3>9.2 How we issue takedowns</h3>
            <p>
              When we discover our content hosted on third-party platforms without authorisation, we:
            </p>
            <ol>
              <li>
                Send a formal takedown notice identifying the copyrighted work, the infringing URL, and our contact
                details;
              </li>
              <li>Request immediate removal or disabling of access;</li>
              <li>Follow up if the content is not removed within a reasonable timeframe;</li>
              <li>
                Escalate to the platform&apos;s legal team or file with the relevant court if the infringing content
                persists; and
              </li>
              <li>Maintain records of all takedown notices sent and their outcomes.</li>
            </ol>
            <h3>9.3 Counter-notification process</h3>
            <p>
              If you believe your content was wrongly removed due to a takedown notice we issued, you may submit a
              counter-notification to admin@vettalume.com that includes:
            </p>
            <ul>
              <li>Your name, address, phone number, and email;</li>
              <li>Identification of the material removed and its prior location;</li>
              <li>
                A statement under penalty of perjury that you believe the material was removed by mistake or
                misidentification;
              </li>
              <li>Consent to the jurisdiction of the courts of Gurugram, Haryana, India; and</li>
              <li>Your physical or electronic signature.</li>
            </ul>
            <p>
              We will review counter-notifications in good faith and respond within 14 business days. If the
              counter-notification is valid, we may restore the removed material unless the original complainant files a
              court action.
            </p>
            <h3>9.4 Repeat infringer policy</h3>
            <p>
              In accordance with DMCA requirements and general copyright enforcement best practices, we maintain a
              repeat infringer policy:
            </p>
            <ul>
              <li>First offence: formal warning and mandatory re-acknowledgement of this agreement;</li>
              <li>Second offence: account suspension for a minimum of 30 days;</li>
              <li>Third offence: permanent account termination without refund; and</li>
              <li>
                Any offence: we reserve the right to skip to permanent termination for severe violations regardless of
                prior history.
              </li>
            </ul>
            <h3>9.5 ISP notification procedures</h3>
            <p>
              Where Infringing Activity is traced to specific internet service providers or hosting providers, we will:
            </p>
            <ul>
              <li>Send formal notifications under the IT Act intermediary guidelines and/or DMCA;</li>
              <li>
                Request subscriber information through lawful processes (court orders, Norwich Pharmacal orders);
              </li>
              <li>Cooperate with ISPs to block access to persistent infringing sources; and</li>
              <li>Escalate to CERT-In or other authorities if the ISP fails to comply.</li>
            </ul>

            <h2>10. Cross-Border Enforcement</h2>
            <p>Copyright infringement is a global problem. Our enforcement strategy includes:</p>
            <ul>
              <li>Filing infringement claims in the jurisdiction where the infringer is located;</li>
              <li>
                Leveraging international copyright treaties (Berne Convention, TRIPS, WIPO treaties) for cross-border
                enforcement;
              </li>
              <li>Using DMCA takedown procedures for content hosted on US-based platforms;</li>
              <li>Engaging local counsel in key jurisdictions where infringement is detected;</li>
              <li>
                Working with international law enforcement through Mutual Legal Assistance Treaties (MLATs); and
              </li>
              <li>Using Interpol and I4C channels for serious criminal infringement.</li>
            </ul>

            <h2>11. Digital Evidence and Chain of Custody</h2>
            <p>For enforcement proceedings, we maintain rigorous digital evidence standards:</p>
            <ul>
              <li>
                All platform access logs, watermark data, and monitoring records are maintained with tamper-proof
                timestamps;
              </li>
              <li>
                Digital evidence is preserved using forensic best practices, including hash verification (SHA-256) for
                integrity;
              </li>
              <li>
                Chain of custody documentation is maintained for all evidence from collection through legal proceedings;
              </li>
              <li>
                Screenshots and captures of external infringement are taken with metadata preservation and notarised
                where necessary;
              </li>
              <li>We engage certified digital forensics experts when required for court proceedings; and</li>
              <li>
                All evidence is stored in compliance with the Indian Evidence Act, 1872 (Section 65B for electronic
                records) and the Bharatiya Sakshya Adhiniyam, 2023.
              </li>
            </ul>

            <h2>12. Report Piracy</h2>
            <p>
              <strong>Email:</strong> admin@vettalume.com
              <br />
              <strong>Web:</strong> https://www.vettalume.com/report-piracy
            </p>
            <p>
              Include: description, location (URL/platform/group), evidence (screenshots, links), approximate date. Your
              identity is kept confidential. Good-faith reporters are protected. False or malicious reports may result in
              account suspension.
            </p>

            <h2>13. Cooperation with Authorities</h2>
            <p>
              We cooperate fully with law enforcement, cyber crime cells (I4C), IP enforcement authorities, CBI, and
              courts. We may disclose account data, logs, device info, and watermark evidence without prior notice to
              you.
            </p>

            <h2>14. Your Promises</h2>
            <ul>
              <li>Use content only for Authorised Use;</li>
              <li>Won&apos;t facilitate piracy or unauthorised distribution;</li>
              <li>Won&apos;t circumvent anti-piracy measures;</li>
              <li>Keep account credentials secure;</li>
              <li>Report piracy or security issues you discover;</li>
              <li>Understand content contains traceable watermarks; and</li>
              <li>Accept full responsibility for content accessed through your account.</li>
            </ul>

            <h2>15. Indemnification</h2>
            <p>
              You&apos;ll indemnify, defend, and hold harmless Pravesio Consulting Private Limited, its affiliates,
              directors, officers, employees, and agents from all claims, damages, losses, and expenses (including legal
              fees) arising from: any Infringing Activity through your account, any breach of this agreement, third-party
              claims from content traced to your account, and your negligence, misconduct, or fraud.
            </p>

            <h2>16. General</h2>
            <p>
              <strong>16.1 Survival</strong> Ownership, restrictions, anti-piracy, consequences, warranties, and
              indemnification survive termination.
            </p>
            <p>
              <strong>16.2 Severability</strong> If any provision (including liquidated damages) is unenforceable, it&apos;ll
              be modified to minimum extent needed.
            </p>
            <p>
              <strong>16.3 Cumulative remedies</strong> All remedies are cumulative. Using one doesn&apos;t prevent
              others. Not enforcing once doesn&apos;t waive future enforcement.
            </p>
            <p>
              <strong>16.4 Governing law</strong> Indian law. Disputes follow the Terms of Service.
            </p>

            <h2>17. Contact</h2>
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
