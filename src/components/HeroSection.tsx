import { ArrowRight } from 'lucide-react';
import { IMAGES } from '../data/treksData';
import { ResilientImage } from './ResilientImage';

interface HeroSectionProps {
  onExploreTreks: () => void;
}

export function HeroSection({ onExploreTreks }: HeroSectionProps) {
  return (
    <section id="top" className="bg-[#F6F7F5]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 pt-6 sm:pt-8 pb-8">
        {/* Dominant 16:9 Focal Visual Carrier with Measured Contrast Scrim */}
        <div className="relative rounded-2xl overflow-hidden bg-[#111814] aspect-[4/3] sm:aspect-[16/9] max-h-[680px] w-full">
          <ResilientImage
            src={IMAGES.heroRidge}
            alt="Golden sunrise above misty valleys and emerald shola grasslands along Mullayanagiri ridge in Chikmagalur"
            title="Mullayanagiri Ridge Sunrise, Chikmagalur"
            loading="eager"
            wrapperClassName="w-full h-full"
            className="w-full h-full object-cover object-center"
          />

          {/* Measured bottom-left scrim ensuring >= 4.5:1 text contrast */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#0B140F]/92 via-[#0B140F]/45 to-transparent"
          />

          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-14 flex flex-col justify-end">
            <div className="max-w-2xl">
              <p className="text-xs sm:text-sm font-medium tracking-[0.04em] text-[#D7E3DC] mb-3">
                Chikmagalur, Western Ghats · Guided Mountain Expeditions
              </p>

              <h1
                className="font-display font-medium text-white tracking-tight leading-[1.06] text-balance"
                style={{ fontSize: 'clamp(2.25rem, 4.3vw, 3.75rem)' }}
              >
                Walk above the morning mist of Chikmagalur
              </h1>

              <p className="mt-4 text-base sm:text-lg text-[#E4EBE7] leading-relaxed max-w-xl">
                Small-batch guided treks across shola grasslands, ancient coffee estates, and cloud-wrapped Western Ghats summits with Giri Darshini Treks.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-6">
                <button
                  type="button"
                  onClick={onExploreTreks}
                  className="inline-flex items-center gap-2.5 px-6 py-3 min-h-[44px] text-sm font-semibold text-[#111814] bg-[#F6F7F5] hover:bg-white rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white focus-visible:ring-offset-[#0B140F]"
                >
                  <span>Explore Guided Treks</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>

                <a
                  href="#experience"
                  className="text-sm font-medium text-[#E4EBE7] hover:text-white underline underline-offset-4 decoration-white/40 hover:decoration-white transition-colors py-2 whitespace-nowrap shrink-0"
                >
                  Discover the Trail Experience
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Trail Ledger Strip directly below hero */}
        <div className="mt-8 pt-6 pb-2 border-t border-b border-[#DCE0D9] grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <div>
            <p className="font-mono text-2xl sm:text-3xl font-medium text-[#111814] tabular-nums">
              1,930 m
            </p>
            <p className="mt-1 text-sm text-[#4D5952]">
              Highest summit crest at Mullayanagiri
            </p>
          </div>

          <div>
            <p className="font-mono text-2xl sm:text-3xl font-medium text-[#111814] tabular-nums">
              06 Trails
            </p>
            <p className="mt-1 text-sm text-[#4D5952]">
              Curated peaks, forts &amp; waterfall basins
            </p>
          </div>

          <div>
            <p className="font-mono text-2xl sm:text-3xl font-medium text-[#111814] tabular-nums">
              12 Guests
            </p>
            <p className="mt-1 text-sm text-[#4D5952]">
              Strict small-batch limit per departure
            </p>
          </div>

          <div>
            <p className="font-mono text-2xl sm:text-3xl font-medium text-[#111814] tabular-nums">
              100% Permits
            </p>
            <p className="mt-1 text-sm text-[#4D5952]">
              Forest check-posts &amp; Malnad meals handled
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
