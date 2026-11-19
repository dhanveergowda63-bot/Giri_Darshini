export function Footer() {
  return (
    <footer className="bg-[#111A15] text-[#C9D3CD] border-t border-white/10">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/10">
          <div className="md:col-span-5 space-y-3">
            <p className="font-display text-2xl font-medium text-white">
              Giri Darshini Treks
            </p>
            <p className="text-sm leading-relaxed max-w-sm">
              Guided small-batch mountain expeditions, coffee highland walks, and leave-no-trace camping across Chikmagalur and the Western Ghats.
            </p>
          </div>

          <div className="md:col-span-4 space-y-2 text-sm">
            <p className="font-medium text-white">Chikmagalur Basecamp</p>
            <p>Mullayanagiri Foothill Road, Near IG Road</p>
            <p>Chikmagalur, Karnataka 577101</p>
            <p className="pt-1 font-mono text-xs text-[#A9CBB7]">
              hello@giridarshinitreks.in · +91 94480 57710
            </p>
          </div>

          <div className="md:col-span-3 space-y-2 text-sm">
            <p className="font-medium text-white">Explore</p>
            <ul className="space-y-1.5">
              <li>
                <a href="#treks" className="hover:text-white transition-colors">
                  Guided Treks
                </a>
              </li>
              <li>
                <a href="#experience" className="hover:text-white transition-colors">
                  The Experience
                </a>
              </li>
              <li>
                <a href="#chikmagalur" className="hover:text-white transition-colors">
                  Seasons of Chikmagalur
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-white transition-colors">
                  Field Gallery
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#8C9B92]">
          <p>© {new Date().getFullYear()} Giri Darshini Treks, Chikmagalur. All rights reserved.</p>
          <p>Karnataka Forest Department Permit Compliant · Leave-No-Trace Western Ghats Partner</p>
        </div>
      </div>
    </footer>
  );
}
