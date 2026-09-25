"use client";
import { useState, type FormEvent } from "react";
import { Check, FileText } from "lucide-react";
import { useAdminData, updateAdminData } from "./store";
import { PageTitle } from "./ui";

export default function Settings() {
  const data = useAdminData();
  return <SettingsForm key={JSON.stringify(data.profile)} profile={data.profile} />;
}
function SettingsForm({ profile }: { profile: ReturnType<typeof useAdminData>["profile"] }) {
  const [notice, setNotice] = useState("");
  const [resume, setResume] = useState(profile.resume);
  const [dirty, setDirty] = useState(false);
  const safeResume = /^https:\/\//i.test(resume) || /^\/(?!\/)/.test(resume);
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = (name: string) => String(form.get(name) || "").trim();
    if (!safeResume) { setNotice("Use an HTTPS résumé URL or a local path such as /resume.pdf."); return; }
    if (!value("name") || !value("bio") || !value("location")) { setNotice("Please fill in your name, location, and bio."); return; }
    const saved = updateAdminData(d => ({ ...d, profile: { name: value("name"), email: value("email"), location: value("location"), bio: value("bio"), linkedin: value("linkedin"), github: value("github"), resume: value("resume") } }));
    setNotice(saved ? "Settings saved in this browser. The public portfolio hasn’t changed." : "Couldn’t save settings. Browser storage may be full or unavailable.");
    if (saved) setDirty(false);
  }
  return <><PageTitle eyebrow="Make it yours" title="Profile & settings" description="The details that help people find you and understand your work." />
    <form onSubmit={save} onChange={() => setDirty(true)} className="grid gap-6 xl:grid-cols-[1fr_300px]"><div className="space-y-6"><section className="admin-panel p-6 sm:p-8"><h2 className="text-lg font-semibold">Personal details</h2><p className="mt-2 text-xs text-muted-foreground">Your introduction to the world.</p><div className="mt-6 grid gap-5 sm:grid-cols-2"><label className="admin-label">Full name<input className="admin-input" name="name" autoComplete="name" required maxLength={120} defaultValue={profile.name} /></label><label className="admin-label">Contact email<input className="admin-input" name="email" type="email" autoComplete="email" required defaultValue={profile.email} /></label><label className="admin-label sm:col-span-2">Location<input className="admin-input" name="location" required maxLength={120} defaultValue={profile.location} /></label><label className="admin-label sm:col-span-2">Short bio<textarea className="admin-input" name="bio" required rows={4} maxLength={1000} defaultValue={profile.bio} /></label></div></section><section className="admin-panel p-6 sm:p-8"><h2 className="text-lg font-semibold">Around the web</h2><div className="mt-6 space-y-5"><label className="admin-label">LinkedIn URL<input className="admin-input" name="linkedin" type="url" pattern="https://.*" title="Use an HTTPS URL" required defaultValue={profile.linkedin} /></label><label className="admin-label">GitHub URL<input className="admin-input" name="github" type="url" pattern="https://.*" title="Use an HTTPS URL" required defaultValue={profile.github} /></label></div></section><section className="admin-panel p-6 sm:p-8"><div className="flex items-center gap-3"><FileText className="size-5 text-primary" /><h2 className="text-lg font-semibold">Your résumé</h2></div><label className="admin-label mt-6">Résumé link<input className="admin-input" name="resume" required value={resume} onChange={e => setResume(e.target.value)} placeholder="/resume.pdf or https://…" /><span className="text-xs font-normal leading-relaxed text-muted-foreground">Use a hosted résumé URL or /resume.pdf. File uploads will be available when storage is connected.</span></label>{safeResume && <a href={resume} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-xs font-medium text-primary">Open résumé ↗</a>}</section></div><aside className="h-fit space-y-5 xl:sticky xl:top-6"><div className="admin-panel p-6"><p className="text-sm font-semibold">Ready to save?</p><p className="mt-3 text-xs leading-relaxed text-body">Your changes are saved locally for this development preview. Connecting the backend will let you update your live portfolio.</p><button type="submit" className="admin-button mt-5 w-full"><Check className="size-4" />Save changes</button><p className="mt-3 text-center text-[11px] text-muted-foreground">{dirty ? "You have unsaved changes" : "All changes saved locally"}</p><p role="status" className={notice ? "mt-4 text-xs leading-relaxed text-body" : "sr-only"}>{notice}</p></div><div className="rounded-2xl border border-dashed p-5 text-xs leading-relaxed text-muted-foreground"><p className="mb-2 font-semibold text-foreground">Owner access</p>These routes only run in development. Add server-side authentication and owner authorization before enabling a production dashboard.</div></aside></form>
  </>;
}
