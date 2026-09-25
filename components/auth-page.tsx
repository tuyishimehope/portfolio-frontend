"use client";

import Link from "next/link";
import { useState, type FormEvent, type InputHTMLAttributes } from "react";
import { ArrowLeft, ArrowRight, Code2, Eye, EyeOff, LockKeyhole, Mail, UserRound, type LucideIcon } from "lucide-react";

type Mode = "login" | "signup" | "reset";
const copy = {
  login: { eyebrow: "WELCOME BACK", title: "Hi there!", description: "Your ideas, your work, your next chapter. Sign in to your workspace.", action: "Log in" },
  signup: { eyebrow: "A NEW BEGINNING", title: "Create an account", description: "A home for everything you’re building. Let’s get you started.", action: "Create account" },
  reset: { eyebrow: "LET’S GET YOU BACK", title: "Forgot password?", description: "It happens. Enter your email and request a link to reset your password.", action: "Send reset link" },
};

export default function AuthPage({ mode }: { mode: Mode }) {
  const signup = mode === "signup";
  const reset = mode === "reset";
  const content = copy[mode];
  const [visible, setVisible] = useState(false);
  const [notice, setNotice] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Replace with the authentication endpoint. Never store credentials in localStorage.
    setNotice(reset ? "Password recovery isn’t connected yet. No reset email has been sent." : signup ? "Account creation isn’t connected yet. No account has been created." : "Sign-in isn’t connected yet. Your credentials haven’t been submitted.");
  }

  return (
    <main className="auth-page relative isolate flex min-h-dvh flex-col overflow-hidden">
      <div className="auth-stars pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
      <div className="auth-orbit auth-orbit-one" aria-hidden="true" />
      <div className="auth-orbit auth-orbit-two" aria-hidden="true" />
      <header className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 py-7 sm:px-12">
        <Link href="/" aria-label="Hope, back to portfolio" className="text-xl font-semibold tracking-tight">Hope<span className="text-[#8b85ff]">.</span></Link>
        <Link href="/" className="group inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-xs text-[#c3cde1] transition-colors hover:text-white sm:text-sm"><ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1 motion-reduce:transform-none" aria-hidden="true" /> Back to portfolio</Link>
      </header>
      <section className="relative flex flex-1 items-center justify-center px-5 py-8 sm:py-12">
        <div className="auth-card relative w-full max-w-[460px] rounded-[32px] px-6 py-9 sm:px-10 sm:py-11">
          <div className="auth-emblem mx-auto mb-7 flex size-14 items-center justify-center rounded-2xl">
            {reset ? <LockKeyhole className="size-6" strokeWidth={1.5} aria-hidden="true" /> : <span aria-hidden="true" className="text-2xl font-semibold tracking-tight">H<span className="text-[#8b85ff]">.</span></span>}
          </div>
          <div className="text-center">
            <p className="mb-3 text-[10px] font-medium tracking-[0.22em] text-[#a9d8ff]">{content.eyebrow}</p>
            <h1 className="text-[32px] font-medium leading-tight tracking-[-0.035em] sm:text-[36px]">{content.title}</h1>
            <p className="mx-auto mt-3 max-w-[32ch] text-sm leading-relaxed text-[#b8c4d9]">{content.description}</p>
          </div>
          {!reset && <>
            <div className="mt-8 grid grid-cols-2 gap-3">
              <button type="button" className="auth-social" onClick={() => setNotice("Google sign-in isn’t connected yet.")}><span aria-hidden="true" className="text-lg font-bold text-[#a9eaff]">G</span> Google</button>
              <button type="button" className="auth-social" onClick={() => setNotice("GitHub sign-in isn’t connected yet.")}><Code2 aria-hidden="true" className="size-5" /> GitHub</button>
            </div>
            <div className="my-6 flex items-center gap-4 text-xs text-[#a9b5cb]"><span className="h-px flex-1 bg-white/10" />or continue with email<span className="h-px flex-1 bg-white/10" /></div>
          </>}
          <form onSubmit={submit} className={reset ? "mt-8 space-y-5" : "space-y-5"}>
            {signup && <AuthField id="full-name" label="Full name" icon={UserRound} name="name" autoComplete="name" required maxLength={120} pattern=".*\S.*" placeholder="Jane Doe" />}
            <AuthField id="email" label="Email address" icon={Mail} name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" />
            {!reset && (
              <AuthField
                id="password"
                label={signup ? "Create password" : "Password"}
                icon={LockKeyhole}
                name="password"
                type={visible ? "text" : "password"}
                autoComplete={signup ? "new-password" : "current-password"}
                required
                minLength={signup ? 8 : undefined}
                maxLength={128}
                placeholder={signup ? "At least 8 characters" : "Your password"}
                hint={signup ? "Use at least 8 characters." : undefined}
                trailing={
                  <button type="button" className="absolute right-1.5 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full text-[#b8c4d9] hover:text-white" onClick={() => setVisible(!visible)} aria-label={visible ? "Hide password" : "Show password"} aria-pressed={visible}>
                    {visible ? <EyeOff className="size-[18px]" aria-hidden="true" /> : <Eye className="size-[18px]" aria-hidden="true" />}
                  </button>
                }
              />
            )}
            {mode === "login" && <div className="-mt-2 flex justify-end"><Link href="/reset-password" className="inline-flex min-h-11 items-center px-1 text-xs text-[#dce7f8] underline-offset-4 hover:underline">Forgot password?</Link></div>}
            <button type="submit" className="auth-submit flex h-14 w-full items-center justify-center gap-3 rounded-full text-sm font-semibold">{content.action}<ArrowRight className="size-4" aria-hidden="true" /></button>
          </form>
          <p role="status" aria-live="polite" className={notice ? "mt-5 rounded-2xl border border-white/15 bg-white/5 p-4 text-sm leading-relaxed text-[#dce7f8]" : "sr-only"}>{notice}</p>
          <p className="mt-6 text-center text-sm text-[#a9b5cb]">{reset ? "Remember your password?" : signup ? "Already have an account?" : "New to the workspace?"}{" "}<Link className="font-medium text-white hover:underline" href={signup || reset ? "/login" : "/signup"}>{signup || reset ? "Log in" : "Sign up"}</Link></p>
        </div>
      </section>
      <footer className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-5 pb-7 pt-4 text-center text-[11px] tracking-wide text-[#95a7c7]"><span>HOPE TUYISHIME</span><span aria-hidden="true">·</span><span>Your work. Your story. Your space.</span></footer>
    </main>
  );
}

/** Visible label above, icon inside, optional hint below (Trustplot auth pattern). */
function AuthField({
  id,
  label,
  icon: Icon,
  hint,
  trailing,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  icon: LucideIcon;
  hint?: string;
  trailing?: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block px-1 text-[13px] font-medium text-[#dce7f8]">
        {label}
      </label>
      <div className="group relative">
        <Icon
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[#95a7c7] transition-colors group-focus-within:text-[#80e9ff]"
        />
        <input
          id={id}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className={`auth-input auth-input-icon${trailing ? " auth-password" : ""}`}
          {...props}
        />
        {trailing}
      </div>
      {hint && (
        <p id={`${id}-hint`} className="mt-2 px-1 text-xs text-[#a9b5cb]">
          {hint}
        </p>
      )}
    </div>
  );
}
