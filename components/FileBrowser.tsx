"use client";
import Link from "next/link";
import { useState } from "react";

export type FileItem = { href: string; title: string; text: string; kind: string; date: string; folder: string; tags: string[]; preview: React.ReactNode };

function FolderIcon() {
  return (
    <svg viewBox="0 0 30 24" aria-hidden="true">
      <path d="M1.5 4.5a2 2 0 0 1 2-2h7l2.5 3h13.5a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2h-23a2 2 0 0 1-2-2z" fill="var(--f)" stroke="color-mix(in srgb, var(--f), #000 35%)" strokeWidth="1.2" />
    </svg>
  );
}

// Finder-style list view: hovering or focusing a row shows its preview in the side pane.
export default function FileBrowser({ files }: { files: FileItem[] }) {
  const [active, setActive] = useState(0);
  const cur = files[active];
  return (
    <div className="files">
      <div>
        <div className="files-cols label" aria-hidden="true"><span>Name</span><span>Kind</span><span>Date</span></div>
        <ul className="files-list">
          {files.map((f, i) => (
            <li key={f.href}>
              <Link href={f.href} className="file-row" data-folder={f.folder} data-active={i === active}
                onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)}>
                <span className="file-name">
                  <FolderIcon />
                  <strong>{f.title}</strong>
                  <span className="file-desc">{f.text}</span>
                  <ul className="tags" aria-label="Tags" style={{ marginTop: 6 }}>{f.tags.map((t) => <li key={t}>{t}</li>)}</ul>
                </span>
                <span className="file-meta file-kind">{f.kind}</span>
                <span className="file-meta">{f.date}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="files-preview" data-folder={cur.folder} aria-hidden="true">
        <div className="pv">{cur.preview}</div>
        <span className="label">Preview · {cur.title}</span>
      </div>
    </div>
  );
}
