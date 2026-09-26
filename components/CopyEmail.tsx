"use client";
import { useState } from "react";

const EMAIL = "hakeemwafiq04@gmail.com";

export default function CopyEmail() {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the address is still selectable text.
    }
  }
  return (
    <>
      <a className="email" href={`mailto:${EMAIL}`}>{EMAIL}</a>
      <button type="button" className="btn small" onClick={copy}>{copied ? "Copied" : "Copy"}</button>
      <span className="sr-only" aria-live="polite">{copied ? "Email copied" : ""}</span>
    </>
  );
}
