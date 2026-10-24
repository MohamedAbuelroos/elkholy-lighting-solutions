"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { FaArrowUpRightFromSquare, FaChevronLeft } from "react-icons/fa6";

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
      <section aria-label="روابط ووسائل التواصل" className="mt-7 space-y-2.5">
        {contactCards.map((item) => {
          const Icon = item.icon;

          const external = !item.group && isWebUrl(item.href);

          const className = `group/contact relative flex min-h-20 w-full items-center justify-between gap-3 overflow-hidden rounded-2xl border px-4 py-3.5 text-start transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none sm:px-5 ${
            item.featured
              ? "border-primary/30 bg-primary/5 hover:border-primary/60 hover:bg-primary/10"
              : "border-border bg-surface hover:border-primary/40 hover:bg-surface-elevated"
          }`;

          const content = (
            <>
              <span className="flex min-w-0 items-center gap-3.5">
                <span
                  aria-hidden="true"
                  className={`flex size-11 shrink-0 items-center justify-center rounded-xl border text-primary transition-colors duration-300 motion-reduce:transition-none ${
                    item.featured
                      ? "border-primary/25 bg-primary/10"
                      : "border-primary/15 bg-primary/5 group-hover/contact:border-primary/30"
                  }`}
                >
                  <Icon className="size-[18px]" />
                </span>

                <span className="min-w-0">
                  <span className="block text-sm font-medium leading-6 text-foreground">
                    {item.title}
                  </span>

                  <span className="mt-0.5 block truncate text-[11px] leading-6 text-muted">
                    {item.subtitle}
                  </span>
                </span>
              </span>

              <span
                aria-hidden="true"
                className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-muted transition-colors duration-300 group-hover/contact:border-primary/30 group-hover/contact:text-primary motion-reduce:transition-none"
              >
                {external ? (
                  <FaArrowUpRightFromSquare className="size-3" />
                ) : (
                  <FaChevronLeft className="size-2.5" />
                )}
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
