"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/content";
import { track } from "@/lib/analytics";

const fieldClass = "field";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Integrate the message endpoint here. Preserve the fields until delivery succeeds.
    // Analytics: only the fact of the attempt, never the name, email or message.
    track("contact_form_submitted", { delivered: false });
    setSubmitted(true);
  }

  return (
    <form onSubmit={handleSubmit} aria-labelledby="message-heading" aria-describedby="message-note" className="rounded-[28px] border bg-card p-6 shadow-[0_24px_60px_-30px_rgb(10_37_64/0.25),inset_0_1px_0_rgb(255_255_255/0.6)] dark:shadow-[0_24px_60px_-30px_rgb(0_0_0/0.6),inset_0_1px_0_rgb(255_255_255/0.08)] sm:p-8">
      <h2 id="message-heading" className="text-2xl font-semibold tracking-tight">Send a message</h2>
      <p id="message-note" className="mt-2 text-sm leading-relaxed text-body">
        Message delivery is coming soon. For now, please <a href={`mailto:${site.email}`} className="text-primary underline underline-offset-4">email me directly</a>.
      </p>
      <div className="mt-8 space-y-6">
        <div>
          <label htmlFor="contact-name" className="mb-2 block text-sm font-medium">Name</label>
          <input id="contact-name" name="name" autoComplete="name" required maxLength={120} pattern=".*\S.*" placeholder="Your name" className={fieldClass} />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-2 block text-sm font-medium">Email</label>
          <input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" className={fieldClass} />
        </div>
        <div>
          <label htmlFor="contact-message" className="mb-2 block text-sm font-medium">Message</label>
          <textarea id="contact-message" name="message" required minLength={10} maxLength={5000} rows={7} placeholder="Tell me about your project, opportunity, or idea…" className={`${fieldClass} min-h-48 resize-y`} />
        </div>
      </div>
      <Button type="submit" className="btn-glow group mt-6 h-13 w-full rounded-full text-base hover:bg-primary-hover">
        Send message <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </Button>
      <div role="status" aria-live="polite">
        {submitted && (
          <p className="mt-4 rounded-xl border bg-muted p-4 text-sm leading-relaxed text-body">
            Your message hasn’t been sent. Message delivery isn’t available yet; please contact me at{" "}
            <a href={`mailto:${site.email}`} className="break-words text-primary underline underline-offset-4">{site.email}</a>.
          </p>
        )}
      </div>
    </form>
  );
}
