import { Fragment, type ReactNode } from "react";
import { Info } from "lucide-react";
import type { Block } from "@/lib/posts";

// Inline markup: `code` and **bold**. Anything else renders as plain text.
function inline(text: string): ReactNode {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="rounded-md border bg-muted px-1.5 py-0.5 font-mono text-[0.86em] text-ink">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export default function PostBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="text-[18px] leading-[1.75] text-body">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h2":
            return (
              <h2
                key={i}
                id={block.id}
                className="mt-16 mb-5 scroll-mt-24 text-[28px] leading-tight font-semibold tracking-[-0.02em] text-ink md:text-[32px]"
              >
                <a href={`#${block.id}`} className="hover:text-primary">
                  {block.text}
                </a>
              </h2>
            );
          case "p":
            return (
              <p key={i} className="mt-5">
                {inline(block.text)}
              </p>
            );
          case "list":
            return (
              <ul key={i} className="mt-5 space-y-3">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden className="mt-[0.72em] size-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{inline(item)}</span>
                  </li>
                ))}
              </ul>
            );
          case "code":
            return (
              <figure key={i} className="mt-7 -mx-4 sm:mx-0">
                <pre className="overflow-x-auto border-y bg-ink px-5 py-4 font-mono text-[13.5px] leading-6 text-[#e6e9f5] sm:rounded-2xl sm:border dark:bg-[#0b1536]">
                  <code>{block.code}</code>
                </pre>
                {block.caption && (
                  <figcaption className="mt-2 px-4 text-[14px] text-muted-foreground sm:px-1">{block.caption}</figcaption>
                )}
              </figure>
            );
          case "table":
            return (
              <figure key={i} className="mt-7">
                <div className="overflow-x-auto rounded-2xl border bg-card">
                  <table className="w-full min-w-[520px] text-left text-[15px]">
                    <thead>
                      <tr className="border-b bg-muted/60">
                        {block.head.map((h) => (
                          <th key={h} scope="col" className="px-4 py-3 font-mono text-[12px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.rows.map((row) => (
                        <tr key={row.join("|")} className="border-b last:border-0">
                          {row.map((cell, c) => (
                            <td key={c} className={c === 1 ? "px-4 py-3 font-mono text-[13.5px] text-ink" : "px-4 py-3 text-body"}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {block.caption && <figcaption className="mt-2 px-1 text-[14px] text-muted-foreground">{block.caption}</figcaption>}
              </figure>
            );
          case "note":
            return (
              <aside key={i} className="mt-7 flex gap-3 rounded-2xl border border-sun/50 bg-sun-50 p-5 text-[16px] leading-relaxed text-ink">
                <Info className="mt-0.5 size-5 shrink-0" aria-hidden />
                <p>{inline(block.text)}</p>
              </aside>
            );
        }
      })}
    </div>
  );
}
