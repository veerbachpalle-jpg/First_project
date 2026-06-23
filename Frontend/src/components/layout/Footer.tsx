import { Play } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5 bg-background/60">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <Play className="h-3.5 w-3.5 fill-white text-white" />
            </div>
            <span className="font-bold">Vidora{"\u00a0"}<span className="gradient-text">Hub</span></span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            The premium platform for modern creators.
          </p>
        </div>
        {[
          { title: "Product", links: ["Features", "Pricing", "Changelog"] },
          { title: "Company", links: ["About", "Blog", "Careers"] },
          { title: "Legal", links: ["Privacy", "Terms", "Security"] },
        ].map((col) => (
          <div key={col.title}>
            <div className="text-sm font-semibold">{col.title}</div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {col.links.map((l) => (
                <li key={l}><a href="#" className="hover:text-foreground">{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/5 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} VidoraHub. Crafted for creators.
      </div>
    </footer>
  );
}
