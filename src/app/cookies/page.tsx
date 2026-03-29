import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Cookie Policy for bglocation.dev — what cookies we use and why.",
};

export default function CookiePolicyPage() {
  return (
    <>
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Cookie Policy
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Last updated: March 29, 2026
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-3xl space-y-12 px-4 sm:px-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">1. What Are Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Cookies are small text files that websites place on your device to
              store information. They are widely used to make websites work
              properly, improve user experience, and provide information to site
              owners.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              2. Cookies We Use
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              bglocation.dev uses only{" "}
              <strong>strictly necessary cookies</strong> required for
              authentication. We do not use any tracking, analytics, advertising,
              or third-party cookies.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 pr-4 font-semibold">Name</th>
                    <th className="pb-2 pr-4 font-semibold">Purpose</th>
                    <th className="pb-2 pr-4 font-semibold">Type</th>
                    <th className="pb-2 pr-4 font-semibold">Duration</th>
                    <th className="pb-2 pr-4 font-semibold">HttpOnly</th>
                    <th className="pb-2 font-semibold">Secure</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-mono text-xs">
                      bgl_session
                    </td>
                    <td className="py-2 pr-4">
                      Authenticates you in the License Portal after magic-link
                      login. Contains a signed JWT token with your email and
                      customer ID. The token is signed (not encrypted), so
                      these values are readable if the cookie is obtained.
                    </td>
                    <td className="py-2 pr-4">Strictly necessary</td>
                    <td className="py-2 pr-4">7 days</td>
                    <td className="py-2 pr-4">Yes</td>
                    <td className="py-2">Yes (production)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-mono text-xs">
                      bgl_admin_session
                    </td>
                    <td className="py-2 pr-4">
                      Authenticates administrators in the Admin Panel. Contains
                      a signed JWT token with your email and admin ID. The
                      token is signed (not encrypted), so these values are
                      readable if the cookie is obtained.
                    </td>
                    <td className="py-2 pr-4">Strictly necessary</td>
                    <td className="py-2 pr-4">7 days</td>
                    <td className="py-2 pr-4">Yes</td>
                    <td className="py-2">Yes (production)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              Both cookies are set only when you explicitly log in. They are{" "}
              <strong>HttpOnly</strong> (not accessible via JavaScript) and{" "}
              <strong>Secure</strong> (transmitted only over HTTPS in
              production). They use <strong>SameSite=Lax</strong> to prevent
              cross-site request forgery.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              3. What We Do Not Use
            </h2>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Analytics cookies</strong> — we do not use Google
                Analytics, PostHog, Plausible, or any other analytics service
              </li>
              <li>
                <strong>Advertising cookies</strong> — we do not serve ads or
                use retargeting
              </li>
              <li>
                <strong>Third-party tracking</strong> — we do not embed
                third-party trackers or social media pixels
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              4. Local Storage
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We use browser <strong>localStorage</strong> (not a cookie) to
              remember that you have acknowledged this cookie notice. Specifically,
              we store a single string value under the key &quot;bgl_cookie_consent_v1&quot;
              to record that you have dismissed the cookie banner. This data
              stays on your device and is never sent to our servers.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              5. How to Manage Cookies
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              You can control and delete cookies through your browser settings.
              Note that disabling our session cookies will prevent you from
              logging in to the License Portal or Admin Panel.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Most browsers allow you to:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>View what cookies are stored</li>
              <li>Delete cookies individually or in bulk</li>
              <li>Block cookies from specific or all websites</li>
              <li>Block third-party cookies (already irrelevant here)</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              Refer to your browser&apos;s help documentation for instructions
              on managing cookies.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              6. Changes to This Policy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Cookie Policy if we introduce new cookies or
              change how we use existing ones. Changes will be posted on this
              page with an updated &quot;Last updated&quot; date.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">7. More Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              For details on how we process personal data, see our{" "}
              <Link
                href="/privacy"
                className="underline hover:text-foreground"
              >
                Privacy Policy
              </Link>
              . If you have questions, contact us at{" "}
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
