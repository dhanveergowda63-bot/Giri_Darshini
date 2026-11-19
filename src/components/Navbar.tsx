import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onPlanTrekClick: () => void;
}

export function Navbar({ onPlanTrekClick }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = () => {
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F6F7F5]/95 backdrop-blur-md border-b border-[#DCE0D9]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#top"
          className="font-display text-xl font-semibold tracking-tight text-[#111814] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332] rounded-sm"
        >
          Giri Darshini Treks
        </a>

        {/* Zone 2: 4 Single-line Text Navigation Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-8 text-sm font-medium text-[#46524B]"
        >
          <a
            href="#treks"
            className="hover:text-[#111814] hover:underline underline-offset-4 decoration-[#1B4332] transition-colors whitespace-nowrap shrink-0 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332] rounded-sm"
          >
            Treks
          </a>
          <a
            href="#experience"
            className="hover:text-[#111814] hover:underline underline-offset-4 decoration-[#1B4332] transition-colors whitespace-nowrap shrink-0 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332] rounded-sm"
          >
            The Experience
          </a>
          <a
            href="#chikmagalur"
            className="hover:text-[#111814] hover:underline underline-offset-4 decoration-[#1B4332] transition-colors whitespace-nowrap shrink-0 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332] rounded-sm"
          >
            Chikmagalur
          </a>
          <a
            href="#gallery"
            className="hover:text-[#111814] hover:underline underline-offset-4 decoration-[#1B4332] transition-colors whitespace-nowrap shrink-0 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332] rounded-sm"
          >
            Gallery
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onPlanTrekClick}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 min-h-[40px] text-sm font-medium text-white bg-[#1B4332] hover:bg-[#143326] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1B4332]"
          >
            Plan a Trek
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 text-[#111814] rounded-lg hover:bg-[#E7EAE4] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#DCE0D9] bg-[#F6F7F5] px-5 py-4 space-y-2">
          <a
            href="#treks"
            onClick={handleNavClick}
            className="block py-2.5 text-base font-medium text-[#111814] hover:text-[#1B4332]"
          >
            Treks
          </a>
          <a
            href="#experience"
            onClick={handleNavClick}
            className="block py-2.5 text-base font-medium text-[#111814] hover:text-[#1B4332]"
          >
            The Experience
          </a>
          <a
            href="#chikmagalur"
            onClick={handleNavClick}
            className="block py-2.5 text-base font-medium text-[#111814] hover:text-[#1B4332]"
          >
            Chikmagalur
          </a>
          <a
            href="#gallery"
            onClick={handleNavClick}
            className="block py-2.5 text-base font-medium text-[#111814] hover:text-[#1B4332]"
          >
            Gallery
          </a>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onPlanTrekClick();
              }}
              className="w-full py-3 px-5 min-h-[44px] text-sm font-medium text-white bg-[#1B4332] hover:bg-[#143326] rounded-lg transition-colors cursor-pointer"
            >
              Plan a Trek
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
