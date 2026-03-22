import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for bglocation — perpetual software license terms for the background location plugin.",
};

export default function TermsPage() {
  return (
    <>
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Last updated: March 22, 2026
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-3xl space-y-12 px-4 sm:px-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Overview</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms of Service (&quot;Terms&quot;) govern your purchase
              and use of <strong>bglocation</strong> — a background location
              tracking plugin for mobile applications (&quot;Software&quot;).
              By purchasing a license or using the bglocation.dev website, you
              agree to these Terms.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              bglocation is a <strong>software product</strong>, not a hosted
              service. You install the plugin in your own projects and run it
              on your own infrastructure. We do not provide a SaaS platform,
              and we do not host, process, or store your end-user location
              data.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">2. License</h2>
            <p className="text-muted-foreground leading-relaxed">
              bglocation is distributed under the{" "}
              <Link
                href="/docs#licensing"
                className="underline hover:text-foreground"
              >
                Elastic License v2 (ELv2)
              </Link>
              . When you purchase a license, you receive a{" "}
              <strong>perpetual, non-exclusive, non-transferable</strong>{" "}
              license to use the Software in your projects.
            </p>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">
                License tiers
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Each tier defines the maximum number of applications (bundle
                IDs) you can use the plugin in. There are no limits on the
                number of developers.
              </p>
              <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
                <li>
                  <strong>Indie</strong> — 1 app (bundle ID)
                </li>
                <li>
                  <strong>Team</strong> — up to 5 apps (bundle IDs)
                </li>
                <li>
                  <strong>Factory</strong> — up to 20 apps (bundle IDs)
                </li>
                <li>
                  <strong>Enterprise</strong> — unlimited apps (bundle IDs)
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">
                What &quot;perpetual&quot; means
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Your license never expires. You can use the version you
                purchased (and all updates released within 12 months of
                purchase) indefinitely. After 12 months, you may renew to
                continue receiving updates, but your existing license remains
                valid.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Restrictions</h3>
              <p className="text-muted-foreground leading-relaxed">
                Under the Elastic License v2, you may{" "}
                <strong>not</strong>:
              </p>
              <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
                <li>
                  Provide the Software as a managed service to third parties
                </li>
                <li>
                  Remove or alter license keys or licensing mechanisms
                </li>
                <li>
                  Redistribute the Software source code as your own product
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              3. Purchase and Payment
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              All purchases are processed by{" "}
              <a
                href="https://www.lemonsqueezy.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                Lemon Squeezy
              </a>
              , which acts as our <strong>Merchant of Record</strong>. Lemon
              Squeezy handles payment processing, tax calculation, VAT
              invoicing, and compliance with local tax regulations.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Prices displayed on bglocation.dev are{" "}
              <strong>net prices (before tax)</strong>. Applicable taxes (VAT,
              sales tax) are calculated and added at checkout by Lemon Squeezy
              based on your location.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Upon successful payment, you will receive:
            </p>
            <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
              <li>A license key delivered to your email</li>
              <li>Access to the plugin via npm</li>
              <li>A receipt/invoice from Lemon Squeezy</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Refund Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Since bglocation is a digital product with immediate delivery, we
              generally do not offer refunds after the license key has been
              delivered. However, we handle refund requests on a case-by-case
              basis.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              If you experience issues with the product, please contact us at{" "}
              <a
                href="mailto:hello@bglocation.dev"
                className="underline hover:text-foreground"
              >
                hello@bglocation.dev
              </a>{" "}
              before requesting a refund. We are committed to resolving
              technical problems.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Refund requests are processed through Lemon Squeezy as the
              Merchant of Record.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Trial Mode</h2>
            <p className="text-muted-foreground leading-relaxed">
              bglocation includes a built-in trial mode that allows you to
              evaluate the plugin before purchasing. The trial provides full
              functionality for 30 minutes per session, followed by a 1-hour
              cooldown period. No license key is required for the trial.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              6. Intellectual Property
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              bglocation, including its source code, documentation, and
              branding, is the intellectual property of Szymon Walczak. Your
              license grants you the right to <strong>use</strong> the
              Software — it does not transfer ownership of the Software or its
              intellectual property.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">7. Your Data</h2>
            <p className="text-muted-foreground leading-relaxed">
              bglocation runs entirely within your mobile application. The
              plugin tracks location data on the end user&apos;s device and
              can send it to <strong>your own server</strong> via the built-in
              HTTP feature. We (Szymon Walczak / bglocation.dev) never receive,
              process, or store your end-user location data. You are solely
              responsible for how you handle location data in your
              applications and for complying with applicable privacy laws.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              For information about data we collect through this website, see
              our{" "}
              <Link
                href="/privacy"
                className="underline hover:text-foreground"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">8. Support</h2>
            <p className="text-muted-foreground leading-relaxed">
              Licensed users can reach support via{" "}
              <a
                href="mailto:hello@bglocation.dev"
                className="underline hover:text-foreground"
              >
                hello@bglocation.dev
              </a>
              . We provide best-effort support for integration questions and
              bug reports. We do not guarantee response times or 24/7
              availability.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              9. Disclaimer of Warranties
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The Software is provided <strong>&quot;as is&quot;</strong>{" "}
              without warranties of any kind, express or implied, including
              but not limited to warranties of merchantability, fitness for a
              particular purpose, or non-infringement. We do not warrant that
              the Software will be error-free or uninterrupted.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              10. Limitation of Liability
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              To the maximum extent permitted by law, Szymon Walczak shall not
              be liable for any indirect, incidental, special, consequential,
              or punitive damages, or any loss of profits or revenues, whether
              incurred directly or indirectly, arising from your use of the
              Software. Our total liability shall not exceed the amount you
              paid for the license.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">11. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms are governed by the laws of Poland. Any disputes
              shall be resolved by the courts of Kraków, Poland, unless
              applicable consumer protection laws in your jurisdiction provide
              otherwise.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              12. Changes to These Terms
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update these Terms from time to time. Changes will be
              posted on this page with an updated &quot;Last updated&quot;
              date. Continued use of the Software after changes constitutes
              acceptance of the updated Terms.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">13. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms, contact us at{" "}
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
