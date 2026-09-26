// Lucide icons for the requirement columns on ERICA Nav (2px stroke, currentColor).
const P = { width: 28, height: 28, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

export const REQ_ICONS = {
  search: <svg {...P}><path d="m5 8 6 6" /><path d="m4 14 6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" /><path d="m22 22-5-10-5 10" /><path d="M14 18h6" /></svg>,
  map: <svg {...P}><path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" /><path d="M15 5.764v15" /><path d="M9 3.236v15" /></svg>,
  eye: <svg {...P}><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>,
  indoor: <svg {...P}><path d="M12 17v-3a1 1 0 011-1h6" /><path d="M19 17h-9a1 1 0 00-1 1v3" /><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" /><path d="M19 9h-3a1 1 0 00-1 1v3" /><path d="M22 21H2" /></svg>,
};
