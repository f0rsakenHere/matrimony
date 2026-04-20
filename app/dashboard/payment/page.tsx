"use client";

import { cn } from "@/lib/utils";
import { goldButtonClass } from "@/components/ui/button-styles";
import { Check } from "lucide-react";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started and explore",
    features: [
      "Create your biodata",
      "Browse limited profiles",
      "Basic search filters",
    ],
    current: true,
  },
  {
    name: "Premium",
    price: "$29",
    period: "per month",
    description: "For serious candidates",
    features: [
      "Unlimited profile views",
      "Advanced search filters",
      "Send & receive messages",
      "See who viewed your profile",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    name: "Family",
    price: "$49",
    period: "per month",
    description: "For families searching together",
    features: [
      "Everything in Premium",
      "Up to 3 family member accounts",
      "Family verification badge",
      "Dedicated family advisor",
      "Shortlist & compare profiles",
    ],
  },
];

export default function PaymentPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h2 className="text-[var(--foreground)]">Plans & Payment</h2>
      <p className="mt-2 text-[var(--color-dark-56)]">
        Choose the right plan for your journey
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "flex flex-col border p-6",
              plan.highlighted
                ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]"
                : "border-[var(--border-subtle)]"
            )}
          >
            <div>
              <p
                className={cn(
                  "text-[13px] font-semibold uppercase tracking-wider",
                  plan.highlighted
                    ? "text-[var(--color-light-72)]"
                    : "text-[var(--color-dark-56)]"
                )}
              >
                {plan.name}
              </p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-[40px] font-bold leading-none">
                  {plan.price}
                </span>
                <span
                  className={cn(
                    "text-[14px]",
                    plan.highlighted
                      ? "text-[var(--color-light-72)]"
                      : "text-[var(--color-dark-56)]"
                  )}
                >
                  /{plan.period}
                </span>
              </div>
              <p
                className={cn(
                  "mt-2 text-[14px]",
                  plan.highlighted
                    ? "text-[var(--color-light-72)]"
                    : "text-[var(--color-dark-56)]"
                )}
              >
                {plan.description}
              </p>
            </div>

            <ul className="mt-6 flex-1 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-[14px]">
                  <Check
                    className={cn(
                      "mt-0.5 size-4 shrink-0",
                      plan.highlighted
                        ? "text-[var(--color-light-72)]"
                        : "text-[var(--color-dark-56)]"
                    )}
                  />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              {plan.current ? (
                <button
                  disabled
                  className="inline-flex h-11 w-full items-center justify-center border border-[var(--border-subtle)] text-[14px] font-semibold opacity-60"
                >
                  Current Plan
                </button>
              ) : plan.highlighted ? (
                <button
                  className={`${goldButtonClass} inline-flex h-11 w-full items-center justify-center text-[14px] font-semibold`}
                >
                  Upgrade
                </button>
              ) : (
                <button className="inline-flex h-11 w-full items-center justify-center border border-[var(--color-light-72)] text-[14px] font-semibold text-[var(--background)] transition-colors hover:bg-[var(--color-light-18)]">
                  Choose Plan
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Payment history placeholder */}
      <div className="mt-14 border-t border-[var(--border-subtle)] pt-10">
        <h3 className="text-[var(--foreground)]">Payment History</h3>
        <p className="mt-4 text-[14px] text-[var(--color-dark-56)]">
          No transactions yet. Your payment history will appear here once you
          subscribe to a plan.
        </p>
      </div>
    </div>
  );
}
