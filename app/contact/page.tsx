import type { Metadata } from "next";
import SiteHeader from "../_components/site-header";
import SiteFooter from "../_components/site-footer";
import { ContactForm } from "./_components/contact-form";

export const metadata: Metadata = {
  title: "Contact Us | BanglaNikahCanada",
  description: "Questions about our matrimonial service? Send us a message and our team will get back to you.",
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-light)]">
      <SiteHeader />

      <main className="flex-1">
        <section className="bg-[linear-gradient(180deg,#f6effc_0%,var(--color-light)_100%)] pb-14 pt-10 sm:pb-20 sm:pt-14">
          <div className="mx-auto max-w-[680px] px-5 sm:px-8">
            <h1 className="text-center font-sans text-[32px] font-bold leading-tight text-[#5a1a6b] sm:text-[40px]">
              Contact Us
            </h1>
            <div className="mt-6 h-[2px] bg-[var(--button-gold-mid)] sm:mt-8" />
            <p className="mt-6 text-[17px] leading-[1.75] text-[#2b2b33] sm:text-[18px]">
              Have a question about our service or your registration? Send us a message and our team
              will get back to you, In Sha Allah.
            </p>

            <ContactForm />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
