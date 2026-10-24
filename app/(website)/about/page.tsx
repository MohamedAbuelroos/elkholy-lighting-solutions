import type { Metadata } from "next";

import { AboutAreas } from "@/components/about/about-areas";
import { AboutExperience } from "@/components/about/about-experience";
import { AboutHero } from "@/components/about/about-hero";
import { AboutStory } from "@/components/about/about-story";
import { ContactCTA } from "@/components/home/contact-cta/contact-cta";

export const metadata: Metadata = {
  title: "من نحن | الخولي",
  description:
    "تعرّف على الخولي في دمنهور منذ 2005، واكتشف مجالات الإضاءة والتشطيبات الكهربائية والأنظمة الذكية والصوتية.",
};

export default function AboutPage() {
  return (
    <div className="bg-background">
      <AboutHero />
      <AboutStory />
      <AboutAreas />
      <AboutExperience />
      <ContactCTA />
    </div>
  );
}
