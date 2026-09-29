"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { STARS } from "./stars";

export type FileItem = { href: string; title: string; text: string; kind: string; date: string; folder: string; tags: string[] };

// Lucide "folder-open", stroked in the project's folder colour
function FolderOpen() {
  return (
    <svg className="proj-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

// Project index: numbered columns, one per project, each read top to bottom.
// Touch screens can't hover, so the first tap plays the hover state (stars + highlight) and the second tap opens the project.
export default function FileBrowser({ files }: { files: FileItem[] }) {
  const [armed, setArmed] = useState<string | null>(null);
  useEffect(() => {
    if (!armed) return;
    const off = (e: PointerEvent) => { if (!(e.target as Element).closest?.(".proj")) setArmed(null); };
    document.addEventListener("pointerdown", off);
    return () => document.removeEventListener("pointerdown", off);
  }, [armed]);
  return (
    <ol className="projects">
      {files.map((f, i) => (
        <li key={f.href}>
          <Link href={f.href} className="proj" data-folder={f.folder} data-armed={armed === f.href || undefined}
            onClick={(e) => { if (armed !== f.href && matchMedia("(hover: none)").matches) { e.preventDefault(); setArmed(f.href); } }}>
            <span className="proj-top">
              <span className="proj-num">
                <span className="proj-stars" aria-hidden="true">
                  {STARS.map((svg, k) => <span key={k} dangerouslySetInnerHTML={{ __html: svg }} />)}
                </span>
                <span className="proj-num-text">#{String(i + 1).padStart(2, "0")}</span>
              </span>
              <FolderOpen />
            </span>
            <span className="label">{f.kind} · {f.date}</span>
            <strong className="proj-title">{f.title}</strong>
            <span className="proj-desc">{f.text}</span>
            <ul className="tags" aria-label="Tags">{f.tags.map((t) => <li key={t}>{t}</li>)}</ul>
            <svg className="proj-go" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 17 5-5-5-5" /><path d="m13 17 5-5-5-5" /></svg>
          </Link>
        </li>
      ))}
    </ol>
  );
}
