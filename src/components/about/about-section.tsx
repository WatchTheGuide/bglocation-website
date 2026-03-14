import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Award, BookOpen, Code2, Linkedin, Mail, MapPin } from "lucide-react";

const EXPERTISE = [
  "React / Next.js",
  "React Native",
  "Capacitor / Ionic",
  "TypeScript",
  "Node.js",
  "GraphQL / REST / tRPC",
  "AWS",
  "CI/CD for Mobile",
  "UI/UX Design",
] as const;

const HIGHLIGHTS = [
  {
    icon: Code2,
    title: "GuideTrackee",
    description:
      "Co-founded and architected GuideTrackee® — a cross-platform mobile application for the tourism industry (iOS & Android). Managed the full app lifecycle from design and development to App Store and Google Play distribution.",
  },
  {
    icon: BookOpen,
    title: "Frontend Framework Author",
    description:
      "Architected and led the development of Spry, an internal frontend framework adopted across multiple product teams, significantly reducing code duplication and delivery time.",
  },
  {
    icon: Award,
    title: "Academic Background",
    description:
      "PhD in Mathematics (University of Łódź). Former university professor and Deputy Director for Scientific Research. This rigorous analytical background informs the architecture of capacitor-bglocation.",
  },
] as const;

export function AboutSection() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-12">
      {/* Intro */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Szymon Walczak</h2>
        <p className="text-muted-foreground">
          Senior Software Architect &amp; Engineering Leader
        </p>
        <p className="leading-relaxed">
          I&apos;m a software architect with over 20 years of experience in
          designing and building complex web and cross-platform mobile
          applications. I hold a{" "}
          <strong>PMP certification (#2115680)</strong> and a{" "}
          <strong>PhD in Mathematics</strong>, which together shape how I
          approach software — with both engineering rigor and product
          thinking.
        </p>
        <p className="leading-relaxed">
          I created <strong>capacitor-bglocation</strong> because I needed a
          reliable, production-ready background location plugin for Capacitor 8
          — and nothing on the market met my standards for quality, performance,
          and developer experience. This plugin is built from real-world
          experience shipping GPS-heavy mobile apps to production.
        </p>
      </div>

      <Separator />

      {/* Highlights */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Background</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {HIGHLIGHTS.map((item) => (
            <Card key={item.title}>
              <CardContent className="pt-6">
                <item.icon className="mb-3 h-6 w-6 text-primary" />
                <h3 className="mb-2 font-semibold">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* Skills */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Technical Expertise</h2>
        <div className="flex flex-wrap gap-2">
          {EXPERTISE.map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      {/* Certifications */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Certifications</h2>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <Award className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              <strong>Project Management Professional (PMP)</strong> — PMI,
              #2115680
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Award className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              <strong>Graph Developer — Professional</strong> — Apollo
              GraphQL
            </span>
          </li>
        </ul>
      </div>

      <Separator />

      {/* Contact */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Contact</h2>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>Kraków, Poland</span>
          </li>
          <li className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <Link
              href="mailto:hello@bglocation.dev"
              className="underline hover:text-foreground"
            >
              hello@bglocation.dev
            </Link>
          </li>
          <li className="flex items-center gap-2">
            <Linkedin className="h-4 w-4 text-muted-foreground" />
            <Link
              href="https://www.linkedin.com/in/szymonwalczak/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              linkedin.com/in/szymonwalczak
            </Link>
          </li>
        </ul>
      </div>
      </div>
    </div>
  );
}
