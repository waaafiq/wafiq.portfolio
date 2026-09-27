import Link from "next/link";

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
export default function FileBrowser({ files }: { files: FileItem[] }) {
  return (
    <ol className="projects">
      {files.map((f, i) => (
        <li key={f.href}>
          <Link href={f.href} className="proj" data-folder={f.folder}>
            <span className="proj-top">
              <span className="proj-num">#{String(i + 1).padStart(2, "0")}</span>
              <FolderOpen />
            </span>
            <span className="label">{f.kind} · {f.date}</span>
            <strong className="proj-title">{f.title}</strong>
            <span className="proj-desc">{f.text}</span>
            <ul className="tags" aria-label="Tags">{f.tags.map((t) => <li key={t}>{t}</li>)}</ul>
            <span className="proj-go" aria-hidden="true">Open →</span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
