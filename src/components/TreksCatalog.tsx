import { useEffect, useState } from 'react';
import { ArrowUpRight, Check, X } from 'lucide-react';
import { TREK_PACKAGES, type TrekPackage } from '../data/treksData';
import { ResilientImage } from './ResilientImage';

type TrekFilter = 'all' | '1 Day' | '2D / 1N' | 'Moderate' | 'Challenging';

interface TreksCatalogProps {
  onReserveTrek: (trekId: string) => void;
}

export function TreksCatalog({ onReserveTrek }: TreksCatalogProps) {
  const [activeFilter, setActiveFilter] = useState<TrekFilter>('all');
  const [selectedTrek, setSelectedTrek] = useState<TrekPackage | null>(null);

  const filteredTreks = TREK_PACKAGES.filter((trek) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === '1 Day' || activeFilter === '2D / 1N') {
      return trek.duration === activeFilter;
    }
    return trek.difficulty === activeFilter;
  });

  useEffect(() => {
    if (!selectedTrek) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedTrek(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTrek]);

  const filterButtons: { id: TrekFilter; label: string }[] = [
    { id: 'all', label: 'All Treks' },
    { id: '1 Day', label: '1 Day' },
    { id: '2D / 1N', label: '2D / 1N' },
    { id: 'Moderate', label: 'Moderate' },
    { id: 'Challenging', label: 'Challenging' },
  ];

  return (
    <section id="treks" className="py-16 sm:py-24 bg-[#F6F7F5]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
        {/* Section Header & Segmented Filter Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 border-b border-[#DCE0D9]">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[#1B4332] mb-2">
              Guided Packages
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-[#111814] text-balance">
              Curated trails across the Western Ghats
            </h2>
            <p className="mt-3 text-base text-[#4D5952] leading-relaxed">
              Each route includes local Chikmagalur mountain leaders, forest department permits, and traditional Malnad meals—paced for deep immersion rather than rushed summit checklists.
            </p>
          </div>

          {/* Functional Segmented Filter Buttons */}
          <div
            role="tablist"
            aria-label="Filter trek packages"
            className="inline-flex flex-wrap items-center gap-1 p-1.5 bg-[#ECEFEB] rounded-lg self-start lg:self-end"
          >
            {filterButtons.map((btn) => {
              const isActive = activeFilter === btn.id;
              return (
                <button
                  key={btn.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveFilter(btn.id)}
                  className={`px-3.5 py-2 min-h-[36px] text-xs sm:text-sm font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332] ${
                    isActive
                      ? 'bg-white text-[#111814] shadow-xs'
                      : 'text-[#4D5952] hover:text-[#111814]'
                  }`}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Trek Packages Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {filteredTreks.map((trek) => (
            <article
              key={trek.id}
              className="group flex flex-col justify-between bg-white border border-[#DCE0D9] rounded-xl overflow-hidden transition-transform duration-200 hover:-translate-y-0.5"
            >
              <div>
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <ResilientImage
                    src={trek.image}
                    alt={trek.imageAlt}
                    title={trek.name}
                    wrapperClassName="w-full h-full"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>

                <div className="p-6">
                  {/* Zero-Pill Unboxed Metadata Line */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-[#4D5952] tabular-nums">
                    <span>{trek.elevationMeters.toLocaleString('en-IN')} m</span>
                    <span aria-hidden="true">·</span>
                    <span>{trek.distanceKm} km</span>
                    <span aria-hidden="true">·</span>
                    <span>{trek.duration}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-sans font-medium text-[#1B4332]">
                      {trek.difficulty}
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-xl font-medium text-[#111814] leading-snug text-balance">
                    {trek.name}
                  </h3>

                  <p className="mt-1 text-xs text-[#647069]">
                    {trek.region}
                  </p>

                  <p className="mt-3 text-sm text-[#46524B] leading-relaxed">
                    {trek.summary}
                  </p>

                  <div className="mt-4 pt-4 border-t border-[#ECEFEB]">
                    <p className="text-xs font-medium text-[#111814]">
                      On the trail
                    </p>
                    <p className="mt-1 text-xs text-[#4D5952] leading-relaxed">
                      {trek.experienceHighlight}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-[#FAFBF9] border-t border-[#ECEFEB] flex items-center justify-between gap-4">
                <div>
                  <span className="font-mono text-lg font-medium text-[#111814] tabular-nums">
                    ₹{trek.priceInr.toLocaleString('en-IN')}
                  </span>
                  <span className="ml-1.5 text-xs text-[#647069]">
                    per trekker
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedTrek(trek)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[40px] text-xs sm:text-sm font-medium text-[#1B4332] hover:text-white bg-white hover:bg-[#1B4332] border border-[#1B4332]/30 hover:border-[#1B4332] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332]"
                >
                  <span>View Itinerary</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Trek Detail & Full Itinerary Modal */}
      {selectedTrek && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="trek-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0B140F]/75 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedTrek(null);
          }}
        >
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#F6F7F5] rounded-2xl border border-[#DCE0D9] shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-4 bg-[#F6F7F5]/95 backdrop-blur-sm border-b border-[#DCE0D9]">
              <div className="min-w-0">
                <p className="text-xs font-mono text-[#4D5952] truncate">
                  {selectedTrek.coordinates} · Best: {selectedTrek.bestSeason}
                </p>
                <h3
                  id="trek-modal-title"
                  className="font-display text-xl sm:text-2xl font-medium text-[#111814] truncate"
                >
                  {selectedTrek.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTrek(null)}
                aria-label="Close trek itinerary"
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-[#46524B] hover:text-[#111814] hover:bg-[#E7EAE4] transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-8">
              <div className="aspect-[16/9] w-full rounded-xl overflow-hidden">
                <ResilientImage
                  src={selectedTrek.image}
                  alt={selectedTrek.imageAlt}
                  title={selectedTrek.name}
                  wrapperClassName="w-full h-full"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Tabular Key Trail Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-t border-b border-[#DCE0D9]">
                <div>
                  <p className="text-xs text-[#647069]">Summit Altitude</p>
                  <p className="mt-1 font-mono text-lg font-medium text-[#111814] tabular-nums">
                    {selectedTrek.elevationMeters.toLocaleString('en-IN')} m
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#647069]">Trail Distance</p>
                  <p className="mt-1 font-mono text-lg font-medium text-[#111814] tabular-nums">
                    {selectedTrek.distanceKm} km
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#647069]">Duration &amp; Grade</p>
                  <p className="mt-1 text-base font-medium text-[#111814]">
                    {selectedTrek.duration} · {selectedTrek.difficulty}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#647069]">Guided Tariff</p>
                  <p className="mt-1 font-mono text-lg font-medium text-[#1B4332] tabular-nums">
                    ₹{selectedTrek.priceInr.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Trail Story */}
              <div>
                <h4 className="font-display text-lg font-medium text-[#111814]">
                  The Trail &amp; Sensory Experience
                </h4>
                <p className="mt-2 text-sm sm:text-base text-[#46524B] leading-relaxed">
                  {selectedTrek.summary} {selectedTrek.experienceHighlight}
                </p>
              </div>

              {/* Itinerary */}
              <div>
                <h4 className="font-display text-lg font-medium text-[#111814] mb-4">
                  Guided Route Schedule
                </h4>
                <div className="divide-y divide-[#DCE0D9] border-t border-b border-[#DCE0D9]">
                  {selectedTrek.itinerary.map((step) => (
                    <div
                      key={step.time}
                      className="py-3.5 grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 sm:gap-6"
                    >
                      <span className="font-mono text-sm font-medium text-[#1B4332] tabular-nums">
                        {step.time}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[#111814]">
                          {step.title}
                        </p>
                        <p className="mt-1 text-sm text-[#4D5952] leading-relaxed">
                          {step.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inclusions & Packing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-display text-base font-medium text-[#111814] mb-3">
                    Included with Giri Darshini
                  </h4>
                  <ul className="space-y-2">
                    {selectedTrek.inclusions.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm text-[#46524B]"
                      >
                        <Check
                          className="w-4 h-4 text-[#1B4332] shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-display text-base font-medium text-[#111814] mb-3">
                    Recommended Trekker Kit
                  </h4>
                  <ul className="space-y-2">
                    {selectedTrek.gearChecklist.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm text-[#46524B]"
                      >
                        <span
                          aria-hidden="true"
                          className="text-[#1B4332] font-mono text-xs mt-1"
                        >
                          —
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Modal Footer CTA */}
              <div className="pt-4 border-t border-[#DCE0D9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-sm text-[#4D5952]">
                  Small-batch departure · Max 12 trekkers · All forest permits arranged
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const id = selectedTrek.id;
                    setSelectedTrek(null);
                    onReserveTrek(id);
                  }}
                  className="px-6 py-3 min-h-[44px] text-sm font-medium text-white bg-[#1B4332] hover:bg-[#143326] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332]"
                >
                  Reserve This Trek
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
