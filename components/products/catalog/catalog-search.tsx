"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FaMagnifyingGlass, FaXmark } from "react-icons/fa6";

type CatalogSearchProps = {
  initialQuery: string;
};

export function CatalogSearch({ initialQuery }: CatalogSearchProps) {
  const id = useId();
  const router = useRouter();

  const [value, setValue] = useState(initialQuery);

  const [previousQuery, setPreviousQuery] = useState(initialQuery);

  if (initialQuery !== previousQuery) {
    setPreviousQuery(initialQuery);
    setValue(initialQuery);
  }

  const [isPending, startTransition] = useTransition();

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const composingRef = useRef(false);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function cancelScheduledSearch() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function search(nextValue: string) {
    cancelScheduledSearch();

    const params = new URLSearchParams(window.location.search);
    const nextQuery = nextValue.trim().slice(0, 100);

    if ((params.get("q") ?? "") === nextQuery) return;

    if (nextQuery) {
      params.set("q", nextQuery);
    } else {
      params.delete("q");
    }

    params.delete("page");

    const queryString = params.toString();

    startTransition(() => {
      router.replace(queryString ? `/products?${queryString}` : "/products", {
        scroll: false,
      });
    });
  }

  function scheduleSearch(nextValue: string) {
    cancelScheduledSearch();
    timerRef.current = setTimeout(() => search(nextValue), 400);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    search(value);
  }

  return (
    <form
      role="search"
      aria-label="البحث في المنتجات"
      aria-busy={isPending}
      onSubmit={handleSubmit}
      className="w-full sm:max-w-md"
    >
      <label htmlFor={id} className="sr-only">
        ابحث باسم المنتج أو كوده
      </label>

      <div className="flex min-h-11 items-center gap-2 rounded-control border border-border bg-surface px-3 focus-within:border-primary">
        <button
          type="submit"
          aria-label="بحث"
          className="flex size-8 shrink-0 items-center justify-center text-primary"
        >
          <FaMagnifyingGlass aria-hidden="true" className="size-3.5" />
        </button>

        <input
          id={id}
          type="search"
          name="q"
          value={value}
          maxLength={100}
          autoComplete="off"
          enterKeyHint="search"
          placeholder="ابحث باسم المنتج أو كوده…"
          onChange={(event) => {
            const nextValue = event.target.value;
            setValue(nextValue);

            if (!composingRef.current) {
              scheduleSearch(nextValue);
            }
          }}
          onCompositionStart={() => {
            composingRef.current = true;
            cancelScheduledSearch();
          }}
          onCompositionEnd={(event) => {
            composingRef.current = false;
            scheduleSearch(event.currentTarget.value);
          }}
          className="catalog-search-input min-w-0 flex-1 bg-transparent py-3 text-sm text-foreground placeholder:text-muted"
        />

        {value && (
          <button
            type="button"
            aria-label="مسح البحث"
            onClick={() => {
              setValue("");
              search("");
            }}
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted hover:bg-surface-elevated hover:text-foreground"
          >
            <FaXmark aria-hidden="true" className="size-3.5" />
          </button>
        )}
      </div>

      <span role="status" className="sr-only">
        {isPending ? "جارٍ البحث في المنتجات" : ""}
      </span>
    </form>
  );
}
