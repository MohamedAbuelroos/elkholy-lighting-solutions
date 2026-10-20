"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { FaChevronLeft } from "react-icons/fa6";

import {
  contactCards,
  isWebUrl,
  type ContactGroup,
} from "@/components/links/contact-data";
import { ContactSheet } from "@/components/links/contact-sheet";

export function ContactLinks() {
  const [activeGroup, setActiveGroup] = useState<ContactGroup | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  function closeSheet() {
    setActiveGroup(null);

    requestAnimationFrame(() => {
      openerRef.current?.focus();
    });
  }

  return (
    <>
      <section aria-label="وسائل التواصل" className="mt-8 space-y-3">
        {contactCards.map((item) => {
          const Icon = item.icon;

          const className = `group flex min-h-24 w-full items-center justify-between gap-3 rounded-2xl border p-4 text-start transition-colors duration-200 sm:px-5 ${
            item.featured
              ? "border-primary/25 bg-primary/5 hover:border-primary/50"
              : "border-border bg-surface hover:border-primary/40"
          }`;

          const content = (
            <>
              <span className="flex min-w-0 items-center gap-3 sm:gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                  <Icon aria-hidden="true" className="size-5" />
                </span>

                <span className="min-w-0">
                  <span className="block text-base font-semibold text-foreground">
                    {item.title}
                  </span>

                  <span className="mt-1 block truncate text-xs leading-6 text-muted">
                    {item.subtitle}
                  </span>
                </span>
              </span>

              <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-primary transition-colors group-hover:border-primary/40">
                <FaChevronLeft aria-hidden="true" className="size-3" />
              </span>
            </>
          );

          if (item.group) {
            const group = item.group;

            return (
              <button
                key={item.id}
                type="button"
                aria-haspopup="dialog"
                onClick={(event) => {
                  openerRef.current = event.currentTarget;
                  setActiveGroup(group);
                }}
                className={className}
              >
                {content}
              </button>
            );
          }

          if (item.href.startsWith("/")) {
            return (
              <Link key={item.id} href={item.href} className={className}>
                {content}
              </Link>
            );
          }

          const external = isWebUrl(item.href);

          return (
            <a
              key={item.id}
              href={item.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className={className}
            >
              {content}
              {external && <span className="sr-only">يفتح في تبويب جديد</span>}
            </a>
          );
        })}
      </section>

      {activeGroup && (
        <ContactSheet
          key={activeGroup.id}
          group={activeGroup}
          onClose={closeSheet}
        />
      )}
    </>
  );
}
