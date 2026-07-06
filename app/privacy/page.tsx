import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Privacy Policy | VettaLume",
  description: "How VettaLume collects, uses, and protects your personal data."
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <SiteHeader />
      <main className="policyPage">
        <section className="pageHero darkHero">
          <div className="pageHeroInner">
            <h1>Our Privacy Policies</h1>
          </div>
        </section>

        <section className="policyBody">
          <div className="policyInner">
            <p className="policyIntro">
              <strong>Welcome to Vettalume&trade;</strong>
              <br />
              Pravesio Consulting Private Limited (&quot;we&quot;) operates Vettalume&trade; (https://www.Vettalume.com),
              an online platform for CAT, GMAT &amp; GRE examination preparation. This Privacy Policy explains what
              personal data we collect, why, how we use and protect it, and your rights. By using the platform, you
              consent to these practices. If you disagree, don&apos;t use the platform.
            </p>

            <h2>1. About This Policy</h2>
            <p>
              This policy complies with the Information Technology Act, 2000; the IT (Reasonable Security Practices)
              Rules, 2011; the Digital Personal Data Protection Act, 2023 (DPDP Act) and DPDP Rules, 2025; and the
              Consumer Protection Act, 2019. For purposes of the DPDP Act, Pravesio Consulting Private Limited is the
              Data Fiduciary. Our CIN is U70200HR2025PTC134374. We follow privacy-by-design and data-minimization
              principles, collecting only what&apos;s necessary, retaining it only as long as needed, and protecting it
              with industry-standard safeguards.
            </p>

            <h2>2. What We Collect</h2>
            <p>
              Information you give us: Account details (name, email, phone, hashed password, date of birth), profile
              information (educational background, CFA&reg; exam status, study preferences, optional photo), payment
              details (billing name, address, GSTIN, transaction ID, we never store card numbers or CVVs), and support
              communications.
            </p>
            <p>
              Information we collect automatically: Usage data (pages visited, quiz/mock scores, study session duration),
              device and technical data (IP address, browser type, OS, device identifiers), device fingerprinting data
              for anti-piracy and fraud detection, server logs, cookies and tracking technologies, and email engagement
              data via tracking pixels.
            </p>
            <p>
              Information from third parties: Name, email, and profile picture from social login providers (e.g., Google
              Sign-In); transaction status from payment gateways; and aggregated, de-identified usage data from analytics
              providers. We do not collect biometric data, caste or religious affiliation, political opinions, genetic
              data, health data, sexual orientation, or trade union membership.
            </p>

            <h2>3. Why We Use Your Data</h2>
            <p>
              We use your data to provide, maintain, and improve the platform; personalize your learning experience;
              process payments and subscriptions; manage your account and provide customer support; send transactional
              emails; deliver opt-in marketing and promotions; detect fraud, security threats, and anti-piracy
              violations; enforce our terms and protect our intellectual property; conduct internal research and content
              improvement; track email engagement; and comply with applicable laws and government requests.
            </p>

            <h2>4. Who We Share Data With</h2>
            <p>
              We do not sell, rent, or trade your personal data. We share it only with service providers (hosting,
              payment gateways, email delivery, analytics, CDN, support tools) who are bound by data processing
              agreements; professional advisors under professional secrecy; legal authorities when required by law; and
              in corporate transactions (you&apos;ll be notified). We may also share data for anti-piracy enforcement
              with law enforcement or courts when necessary. Aggregated, anonymized data may be shared for research and
              analytics. A current list of sub-processors is available at Vettalume.com/sub-processors.
            </p>

            <h2>5. How Long We Keep Data</h2>
            <p>
              Account data is retained for the account lifetime plus 3 years; transaction records for 8 years (Income Tax
              Act; GST Act); identified usage data for 3 years; communications for 3 years; security and audit logs for 5
              years; device fingerprint data for account life plus 1 year; and email engagement data for 1 year. After
              the retention period, data is securely deleted or anonymized within 30 days, subject to legal obligations.
              Anonymized data may be retained indefinitely for research and analytics.
            </p>

            <h2>6. How We Protect Your Data</h2>
            <p>
              We implement industry-standard security measures including encryption in transit (TLS 1.2+) and at rest
              (AES-256), role-based access controls, multi-factor authentication for admin access, regular vulnerability
              assessments and penetration testing, intrusion detection systems, encrypted backups with geographically
              distributed storage, a secure software development lifecycle, employee confidentiality agreements, mandatory
              data protection training, and documented incident response procedures. No system is 100% secure, but we
              take commercially reasonable steps to protect your data.
            </p>

            <h2>7. Data Breach Notification</h2>
            <p>
              In the event of a breach, we will notify the Data Protection Board of India as required under the DPDP Act;
              notify affected users by email or platform notification with details of the breach, data affected, likely
              consequences, and mitigation measures; report to CERT-In within 6 hours of qualifying incidents; and
              maintain a breach register documenting all incidents and remediation actions.
            </p>

            <h2>8. Your Rights</h2>
            <p>
              Under the DPDP Act, 2023, you have the right to access, correct, and erase your data; withdraw consent at
              any time; request data portability in JSON or CSV format; restrict processing in certain circumstances;
              object to processing based on legitimate interest; nominate someone to exercise your rights; and lodge a
              complaint with our Grievance Officer or the Data Protection Board. Email admin@Vettalume.com to exercise any
              right. We&apos;ll respond within 7 working days after verifying your identity; complex requests may take up
              to 30 days. You may opt out of marketing communications at any time via the unsubscribe link in any
              marketing email, your account settings, or by emailing us.
            </p>

            <h2>9. International Users</h2>
            <p>
              Your data is primarily stored in India. Cross-border transfers, if any, comply with the DPDP Act and
              applicable contractual safeguards. EU/EEA users have additional rights under GDPR, including the right to
              lodge a complaint with a local supervisory authority and protection against automated decisions. California
              residents have additional rights under CCPA/CPRA, including the right to know, delete, and correct personal
              information. We do not sell personal information. To exercise CCPA rights, email admin@Vettalume.com with
              &quot;CCPA Request&quot; in the subject line.
            </p>

            <h2>10. Cookies and Tracking</h2>
            <p>
              We use essential cookies (login, sessions, security — cannot be disabled), analytics cookies (anonymized
              usage patterns), preference cookies (your settings), and marketing cookies (only with explicit consent).
              Manage cookies via our consent banner or browser settings. We do not currently respond to &quot;Do Not
              Track&quot; browser signals. If you enable push notifications, we collect a device token stored securely and
              deleted when you disable notifications. Full cookie details are at Vettalume.com/cookies.
            </p>

            <h2>11. Children&apos;s Privacy</h2>
            <p>
              The platform is not intended for children under 16. We do not knowingly collect data from children under
              16. If we discover we have, we will delete it within 72 hours. Contact admin@Vettalume.com if you believe a
              child has provided us data.
            </p>

            <h2>12. Automated Decision-Making</h2>
            <p>
              We use algorithms for personalized content recommendations, adaptive learning paths, and fraud/piracy
              detection. These do not produce legal or similarly significant effects on you. If we implement automated
              decisions that significantly affect you, we&apos;ll inform you and offer human review on request within 7
              working days.
            </p>

            <h2>13. Changes to This Policy</h2>
            <p>
              We may update this policy. For material changes, we&apos;ll provide at least 15 days&apos; notice by email
              or platform notification. Continued use after the effective date means you accept the changes. Previous
              versions are archived at Vettalume.com/privacy/archive.
            </p>

            <h2>14. Grievance Officer</h2>
            <p>As required by the IT Act, SPDI Rules, and DPDP Act:</p>
            <p>
              <strong>Name:</strong> Niyati Arora
              <br />
              <strong>Designation:</strong> Grievance Officer
              <br />
              <strong>Phone:</strong> +91 98101 18573
              <br />
              <strong>Email:</strong> grievance@Vettalume.com
              <br />
              <strong>Address:</strong> Flat No. B-3/103, Sahara Grace, M.G. Road, Gurgaon – 122002, Haryana
            </p>
            <p>
              We&apos;ll acknowledge your complaint within 48 hours with a tracking ID and resolve it within 7 working
              days. If unsatisfied, you may escalate to the Data Protection Board of India.
            </p>

            <h2>15. Contact</h2>
            <p>
              Pravesio Consulting Private Limited
              <br />
              <strong>Registered Office:</strong> Flat No. B-3/103, Sahara Grace, M.G. Road, Gurgaon – 122002, Haryana
              <br />
              <strong>CIN:</strong> U70200HR2025PTC134374
              <br />
              <strong>Email:</strong> admin@vettalume.com
              <br />
              <strong>Grievance:</strong> grievance@vettalume.com
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
