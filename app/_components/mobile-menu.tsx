"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { MobileAuthButtons } from "./auth-buttons";

const navigationLinks = [
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#our-approach", label: "Our Approach" },
  { href: "/#success-stories", label: "Family Stories" },
  { href: "/#faq", label: "Questions" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // Close when navigating
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function handleToggle() {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownTop(rect.bottom + 8);
    }
    setOpen((v) => !v);
  }

  return (
    <div className="min-[900px]:hidden">
      <button
        ref={buttonRef}
        onClick={handleToggle}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="flex h-11 w-11 items-center justify-center border border-[var(--color-dark-18)] text-[var(--foreground)]"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {open &&
        createPortal(
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-[999] bg-black/30"
              onClick={() => setOpen(false)}
            />
            {/* Dropdown */}
            <div
              className="fixed right-4 z-[1000] w-[min(260px,calc(100vw-2rem))] border border-[var(--color-dark-18)] bg-[var(--surface)] p-4 shadow-[0_18px_40px_rgb(30_58_95_/_0.12)]"
              style={{ top: dropdownTop }}
            >
              <nav aria-label="Primary navigation" className="grid gap-1">
                {navigationLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="px-3 py-3 text-[15px] font-semibold text-[var(--foreground)] hover:bg-[var(--color-dark-08)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <MobileAuthButtons />
            </div>
          </>,
          document.body
        )}
    </div>
  );
}
