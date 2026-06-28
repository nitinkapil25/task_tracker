import { CheckCircle2 } from 'lucide-react';

export default function Header() {
  return (
    <header className="topbar">
      <a className="brand" href="#top" aria-label="TaskFlow home">
        <span className="brand-mark"><CheckCircle2 size={21} strokeWidth={2.5} /></span>
        <span>TaskFlow</span>
      </a>
    </header>
  );
}
