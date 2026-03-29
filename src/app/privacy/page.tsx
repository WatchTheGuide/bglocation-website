import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for bglocation.dev — how we collect, use, and protect your personal data.",
};

export default function PrivacyPage() {
  return (
    <>
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Last updated: March 29, 2026
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-3xl space-y-12 px-4 sm:px-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Data Controller</h2>
            <p className="text-muted-foreground leading-relaxed">
              The data controller for personal data collected through{" "}
              <strong>bglocation.dev</strong> is:
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Szymon Walczak
              <br />
              Kraków, Poland
              <br />
              Email:{" "}
              <a
                href="mailto:hello@bglocation.dev"
                className="underline hover:text-foreground"
              >
                hello@bglocation.dev
              </a>
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">2. What We Sell</h2>
            <p className="text-muted-foreground leading-relaxed">
              bglocation is a <strong>software product</strong> — a Capacitor
              plugin for background location tracking in mobile apps. We sell{" "}
              <strong>perpetual software licenses</strong>, not a subscription
              service. Once you purchase a license, you own it permanently and
              can use it according to the{" "}
              <Link href="/terms" className="underline hover:text-foreground">
                Terms of Service
              </Link>
              .
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              3. What Data We Collect and Why
            </h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">
                  a) License Purchase Data
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  When you purchase a bglocation license, payment is processed
                  by{" "}
                  <a
                    href="https://www.lemonsqueezy.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-foreground"
                  >
                    Lemon Squeezy
                  </a>
                  , which acts as our{" "}
                  <strong>Merchant of Record (MoR)</strong>. Lemon Squeezy
                  collects and processes your payment data (name, email, billing
                  address, payment method) under their own privacy policy. We
                  receive from Lemon Squeezy:
                </p>
                <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
                  <li>Your name and email address</li>
                  <li>Order details (product, date, amount)</li>
                  <li>License key</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>Legal basis:</strong> Performance of a contract (GDPR
                  Art. 6(1)(b)) — necessary to deliver your license.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">
                  b) License Portal (Magic Link Login)
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  When you log in to the License Portal to manage your licenses,
                  we send a one-time login link to your email address. We
                  process your email address and a session cookie to
                  authenticate you.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>Legal basis:</strong> Performance of a contract (GDPR
                  Art. 6(1)(b)).
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">c) Newsletter</h3>
                <p className="text-muted-foreground leading-relaxed">
                  When you subscribe to our newsletter, we collect:
                </p>
                <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
                  <li>Your email address</li>
                  <li>
                    Your IP address (stored as part of the consent record)
                  </li>
                  <li>
                    Platform interest, if provided (e.g. Capacitor, React
                    Native)
                  </li>
                  <li>Subscription source (footer, landing page, or chat)</li>
                  <li>Timestamp and text of your consent</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  We use double opt-in: after you submit your email, you will
                  receive a confirmation email. Your subscription becomes active
                  only after you confirm.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>Legal basis:</strong> Your consent (GDPR Art.
                  6(1)(a)). You can withdraw consent at any time by clicking the
                  unsubscribe link in any email.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">d) AI Chat</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our website includes an AI-powered chat that answers questions
                  about bglocation. Chat messages are processed by OpenAI&apos;s
                  API to generate responses. We do not store chat conversations
                  on our servers. Messages are transmitted to OpenAI during your
                  session and are subject to{" "}
                  <a
                    href="https://openai.com/policies/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-foreground"
                  >
                    OpenAI&apos;s Privacy Policy
                  </a>
                  .
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>Legal basis:</strong> Legitimate interest (GDPR Art.
                  6(1)(f)) — providing product support.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Data Retention</h2>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Customer data</strong> (name, email, orders, licenses):
                retained for the duration of the license and as required by tax
                and accounting regulations.
              </li>
              <li>
                <strong>Newsletter — pending subscriptions</strong>{" "}
                (unconfirmed): automatically deleted after <strong>7 days</strong>
                .
              </li>
              <li>
                <strong>Newsletter — unsubscribed</strong>: automatically
                deleted after <strong>30 days</strong>.
              </li>
              <li>
                <strong>Newsletter — active subscribers</strong>: retained
                until you unsubscribe.
              </li>
              <li>
                <strong>Chat messages</strong>: not stored on our servers.
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Third-Party Processors</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use the following third-party services to operate bglocation.dev:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 pr-4 font-semibold">Service</th>
                    <th className="pb-2 pr-4 font-semibold">Purpose</th>
                    <th className="pb-2 font-semibold">Location</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b">
                    <td className="py-2 pr-4">Lemon Squeezy</td>
                    <td className="py-2 pr-4">
                      Payment processing (Merchant of Record)
                    </td>
                    <td className="py-2">USA</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4">Resend</td>
                    <td className="py-2 pr-4">
                      Transactional emails (login links, newsletter)
                    </td>
                    <td className="py-2">USA</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4">Vercel</td>
                    <td className="py-2 pr-4">Website hosting</td>
                    <td className="py-2">USA / Global CDN</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4">OpenAI</td>
                    <td className="py-2 pr-4">AI chat responses</td>
                    <td className="py-2">USA</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4">Neon</td>
                    <td className="py-2 pr-4">PostgreSQL database hosting</td>
                    <td className="py-2">USA / EU</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Where data is transferred outside the EU/EEA, these providers
              rely on Standard Contractual Clauses (SCCs) or equivalent
              safeguards as required by GDPR Chapter V.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">6. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              Under GDPR, you have the following rights regarding your personal
              data:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Right of access</strong> (Art. 15) — request a copy of
                your data
              </li>
              <li>
                <strong>Right to rectification</strong> (Art. 16) — correct
                inaccurate data
              </li>
              <li>
                <strong>Right to erasure</strong> (Art. 17) — request deletion
                of your data
              </li>
              <li>
                <strong>Right to restrict processing</strong> (Art. 18)
              </li>
              <li>
                <strong>Right to data portability</strong> (Art. 20)
              </li>
              <li>
                <strong>Right to object</strong> (Art. 21) — object to
                processing based on legitimate interest
              </li>
              <li>
                <strong>Right to withdraw consent</strong> (Art. 7(3)) — for
                newsletter, via the unsubscribe link or by contacting us
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              To exercise any of these rights, contact us at{" "}
              <a
                href="mailto:hello@bglocation.dev"
                className="underline hover:text-foreground"
              >
                hello@bglocation.dev
              </a>
              . We will respond within 30 days.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              You also have the right to lodge a complaint with a supervisory
              authority. For Poland, this is the{" "}
              <a
                href="https://uodo.gov.pl"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                UODO (Urząd Ochrony Danych Osobowych)
              </a>
              .
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">7. Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              bglocation.dev uses only{" "}
              <strong>essential, functional cookies</strong>:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Session cookie</strong> (<code className="text-xs">bgl_session</code>) — used for License Portal
                authentication (expires after 7 days)
              </li>
              <li>
                <strong>Admin session cookie</strong> (<code className="text-xs">bgl_admin_session</code>) — used for Admin Panel
                authentication
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              We do not use tracking cookies, analytics cookies, or
              advertising cookies. We do not use Google Analytics or any
              third-party tracking scripts.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              For full details, see our{" "}
              <Link href="/cookies" className="underline hover:text-foreground">
                Cookie Policy
              </Link>
              .
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              8. Changes to This Policy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. Changes will
              be posted on this page with an updated &quot;Last updated&quot;
              date. For significant changes, we will notify active newsletter
              subscribers by email.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">9. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy or your
              personal data, contact us at{" "}
              <a
                href="mailto:hello@bglocation.dev"
                className="underline hover:text-foreground"
              >
                hello@bglocation.dev
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
