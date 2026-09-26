"use client";

import { useState, type FormEvent } from "react";
import { Plus, Search, X, Eye, Pencil, ArrowLeft } from "lucide-react";
import { useAdminData, updateAdminData, newEntry, type Entry } from "./store";
import { Empty, PageTitle, Status } from "./ui";

export default function ContentManager({ kind, create = false }: { kind: "projects" | "posts"; create?: boolean }) {
  const data = useAdminData();
  const [editor, setEditor] = useState<Entry | null>(() => create ? newEntry() : null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [notice, setNotice] = useState("");
  const project = kind === "projects";
  const singular = project ? "project" : "post";
  const entries = data[kind].filter(e => (filter === "all" || e.status === filter) && `${e.title} ${e.summary}`.toLowerCase().includes(search.toLowerCase()));
  function save(entry: Entry) {
    if (data[kind].some(e => e.slug === entry.slug && e.id !== entry.id)) { setNotice("That URL slug is already in use. Choose a unique one."); return false; }
    const saved = updateAdminData(current => ({ ...current, [kind]: current[kind].some(e => e.id === entry.id) ? current[kind].map(e => e.id === entry.id ? entry : e) : [entry, ...current[kind]] }));
    setNotice(saved ? `${project ? "Project" : "Post"} saved in this browser${entry.status === "published" ? " as published in preview" : " as a draft"}. Your public site hasn’t changed.` : "Couldn’t save to browser storage. Keep this editor open and try again.");
    if (saved) setEditor(null);
    return saved;
  }
  return <>
    <PageTitle eyebrow={project ? "Selected work" : "Ideas & insights"} title={project ? "Your projects" : "Your writing"} description={project ? "Shape the work you want to be known for. Create, refine, and organize your case studies." : "A space for what you’re learning, building, and thinking about."} action={!editor && <button className="admin-button" onClick={() => { setNotice(""); setEditor(newEntry()); }}><Plus className="size-4" />New {singular}</button>} />
    <p role="status" className={notice ? "mb-5 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-body" : "sr-only"}>{notice}</p>
    {editor ? <Editor key={editor.id} entry={editor} project={project} onSave={save} onDelete={() => {
      const removed = updateAdminData(current => ({ ...current, [kind]: current[kind].filter(e => e.id !== editor.id) }));
      setNotice(removed ? "Local draft deleted. Your public site hasn’t changed." : "Couldn’t delete the local draft. Please try again.");
      if (removed) setEditor(null);
    }} onCancel={() => setEditor(null)} /> : <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4"><div className="flex gap-1 rounded-xl border bg-card p-1" aria-label="Filter by status">{["all", "draft", "published"].map(value => <button key={value} aria-pressed={filter === value} onClick={() => setFilter(value)} className={`rounded-lg px-4 py-2 text-xs capitalize ${filter === value ? "bg-primary/8 font-medium text-primary" : "text-body"}`}>{value === "all" ? "All content" : value === "published" ? "Published preview" : "Drafts"}</button>)}</div><div className="relative w-full sm:w-64"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><input aria-label={`Search ${kind}`} value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${kind}…`} className="admin-input pl-10" /></div></div>
      {entries.length ? <div className="admin-panel overflow-hidden"><div className="hidden grid-cols-[1fr_180px_100px] gap-4 border-b bg-muted/40 px-6 py-3 text-[10px] font-medium uppercase tracking-widest text-muted-foreground md:grid"><span>{project ? "Project" : "Article"}</span><span>Status</span><span className="text-right">Action</span></div>{entries.map(entry => <div key={entry.id} className="grid items-center gap-4 border-b p-6 last:border-0 md:grid-cols-[1fr_180px_100px]"><div className="min-w-0"><button onClick={() => { setEditor(entry); setNotice(""); }} className="text-left text-base font-semibold hover:text-primary">{entry.title}</button><p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{entry.summary || "No description yet"}</p><p className="mt-2 text-[11px] text-muted-foreground">/{project ? "projects" : "blogs"}/{entry.slug}</p></div><div><Status published={entry.status === "published"} /></div><button aria-label={`Edit ${entry.title}`} onClick={() => { setEditor(entry); setNotice(""); }} className="admin-secondary w-fit md:ml-auto"><Pencil className="size-3.5" />Edit</button></div>)}</div> : <Empty title={data[kind].length ? "No matches found" : `Your next ${singular} starts here.`}>{data[kind].length ? "Try a different search or status filter." : <>Create your first {singular} and save it as a draft.<div className="mt-5"><button className="admin-button" onClick={() => setEditor(newEntry())}><Plus className="size-4" />Create {singular}</button></div></>}</Empty>}
    </>}
  </>;
}

function Editor({ entry, project, onSave, onDelete, onCancel }: { entry: Entry; project: boolean; onSave: (entry: Entry) => boolean; onDelete: () => void; onCancel: () => void }) {
  const [preview, setPreview] = useState<Entry | null>(null);
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = (key: string) => String(form.get(key) || "").trim();
    const intent = (event.nativeEvent as SubmitEvent).submitter?.getAttribute("value") || "draft";
    const next: Entry = { ...entry, title: value("title"), slug: value("slug"), summary: value("summary"), body: value("body"), role: value("role"), stack: value("stack"), year: value("year"), updated: new Date().toISOString(), status: intent === "published" ? "published" : "draft" };
    if (!next.title || !next.summary || !next.body) { setError("Add a title, summary, and content before continuing."); return; }
    setError("");
    if (intent === "preview") setPreview(next);
    else onSave(next);
  }
  return <section className="admin-panel p-5 sm:p-8"><div className="mb-7 flex items-center justify-between"><h2 className="text-lg font-semibold">{entry.title ? "Edit" : "New"} {project ? "project" : "post"}</h2><button type="button" className="admin-icon" aria-label="Close editor" onClick={() => dirty ? setConfirmClose(true) : onCancel()}><X className="size-5" /></button></div>
    {confirmClose && <div className="mb-6 rounded-xl border p-4 text-sm"><p>Discard your unsaved changes?</p><div className="mt-3 flex gap-3"><button className="admin-secondary" onClick={() => setConfirmClose(false)}>Keep editing</button><button className="admin-secondary" onClick={onCancel}>Discard changes</button></div></div>}
    {confirmDelete && <div className="mb-6 rounded-xl border p-4 text-sm"><p>Delete this browser-saved draft? This cannot be undone.</p><div className="mt-3 flex gap-3"><button className="admin-secondary" onClick={() => setConfirmDelete(false)}>Keep draft</button><button className="admin-secondary" onClick={onDelete}>Delete local draft</button></div></div>}
    <form onSubmit={submit} onChange={() => { setDirty(true); setPreview(null); }} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2"><label className="admin-label">Title<input name="title" required maxLength={160} defaultValue={entry.title} placeholder={project ? "Project name" : "Give your story a title"} className="admin-input" /></label><label className="admin-label">URL slug<input name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" title="Use lowercase letters, numbers, and single hyphens between words" maxLength={100} defaultValue={entry.slug} placeholder="your-story-here" className="admin-input" /><span className="text-xs font-normal text-muted-foreground">Lowercase words separated by hyphens.</span></label></div>
      <label className="admin-label">Short summary<textarea name="summary" required maxLength={500} rows={3} defaultValue={entry.summary} className="admin-input" placeholder="What’s the story in a sentence or two?" /></label>
      {project && <div className="grid gap-5 md:grid-cols-3"><label className="admin-label">Your role<input name="role" defaultValue={entry.role} maxLength={120} className="admin-input" /></label><label className="admin-label">Technology stack<input name="stack" defaultValue={entry.stack} maxLength={300} placeholder="Python, FastAPI, PostgreSQL" className="admin-input" /></label><label className="admin-label">Year<input name="year" defaultValue={entry.year} maxLength={20} className="admin-input" /></label></div>}
      <label className="admin-label">{project ? "Case study" : "Article content"}<textarea name="body" required maxLength={50000} rows={13} defaultValue={entry.body} placeholder={project ? "Share the context, your approach, and what you learned…" : "Start with an idea…"} className="admin-input font-mono text-sm leading-relaxed" /><span className="text-xs font-normal text-muted-foreground">Plain text preview. Line breaks are preserved.</span></label>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <div className="flex flex-wrap gap-3 border-t pt-5"><button type="submit" value="draft" className="admin-secondary">Save draft</button><button type="submit" value="preview" className="admin-secondary"><Eye className="size-4" />Preview</button><button type="submit" value="published" className="admin-button">Publish in preview</button>{entry.updated && entry.status === "draft" && <button type="button" className="admin-secondary" onClick={() => setConfirmDelete(true)}>Delete draft</button>}</div><p className="text-xs text-muted-foreground">Saved only in this browser. Publishing here does not change your public portfolio.</p>
    </form>
    {preview && <article className="mt-8 rounded-2xl border bg-background p-6 sm:p-8"><div className="mb-6 flex items-center justify-between"><p className="text-xs font-medium uppercase tracking-widest text-primary">Content preview</p><button className="admin-secondary" onClick={() => setPreview(null)}><ArrowLeft className="size-3" />Back to editing</button></div><h2 className="break-words text-3xl font-semibold tracking-tight">{preview.title}</h2><p className="mt-4 text-body">{preview.summary}</p><div className="mt-7 whitespace-pre-wrap break-words text-sm leading-7">{preview.body}</div></article>}
  </section>;
}
