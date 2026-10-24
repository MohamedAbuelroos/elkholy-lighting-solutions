"use client";

import { useLinkStatus } from "next/link";

import styles from "./navigation-hint.module.css";

export function NavigationHint() {
  const { pending } = useLinkStatus();

  return (
    <>
      <span
        aria-hidden="true"
        className={`${styles.track} ${pending ? styles.pending : ""}`}
      >
        <span className={styles.light} />
      </span>

      {pending && (
        <span role="status" className="sr-only">
          جارٍ فتح الصفحة…
        </span>
      )}
    </>
  );
}
