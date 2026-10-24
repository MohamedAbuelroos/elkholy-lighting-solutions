import type { Metadata } from "next";

import { ContactBranches } from "@/components/contact/contact-branches";
import { ContactHero } from "@/components/contact/contact-hero";
import { ContactMethods } from "@/components/contact/contact-methods";

export const metadata: Metadata = {
  title: "تواصل معنا | الخولي",
  description:
    "تواصل مع فريق الخولي عبر واتساب أو الهاتف والبريد الإلكتروني، وتعرّف على عناوين معارضنا في دمنهور ومواعيد العمل.",
};

export default function ContactPage() {
  return (
    <div className="bg-background">
      <ContactHero />
      <ContactMethods />
      <ContactBranches />
    </div>
  );
}
