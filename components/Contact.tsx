import CopyEmail from "./CopyEmail";

export default function Contact() {
  return (
    <ul className="contact-list">
      <li><span className="label">Email</span><CopyEmail /></li>
      <li><span className="label">GitHub</span><a href="https://github.com/waaafiq">github.com/waaafiq</a></li>
      <li><span className="label">LinkedIn</span><span className="todo">TODO: LinkedIn URL</span></li>
    </ul>
  );
}

// TODO: drop the resume PDF into /public as resume.pdf, then swap this for a real download link.
export function ResumeButton() {
  return <span className="btn" aria-disabled="true">TODO: Resume PDF</span>;
}
