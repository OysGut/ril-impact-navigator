import { Link } from "@tanstack/react-router";
import { Sprout } from "lucide-react";

export function Navbar() {
  return (
    <header className="no-print sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold text-primary">
          <Sprout className="h-6 w-6" /> RIL Navigator
        </Link>
        <nav className="flex gap-6 text-sm font-medium text-muted-foreground">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-primary" }}>Mine vurderinger</Link>
          <Link to="/guide" activeProps={{ className: "text-primary" }}>Kunnskapsbase</Link>
        </nav>
      </div>
    </header>
  );
}
