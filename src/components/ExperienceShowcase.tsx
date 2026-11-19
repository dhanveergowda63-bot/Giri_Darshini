import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';
import {
  CHIKMAGALUR_SEASONS,
  EXPERIENCE_CHAPTERS,
  IMAGES,
  TRAIL_DAY_TIMELINE,
  TREKKER_STORIES,
  type ExperienceChapter,
} from '../data/treksData';
import { ResilientImage } from './ResilientImage';

export function ExperienceShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeSeasonId, setActiveSeasonId] = useState<'monsoon' | 'post-monsoon' | 'blossom'>('post-monsoon');

  const flowContainerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: flowContainerRef,
    offset: ['start 65%', 'end 65%'],
  });

  const smoothRiverProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    restDelta: 0.001,
  });

  useEffect(() => {
    const elements = stepRefs.current.filter((el): el is HTMLDivElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-step-index'));
            if (!Number.isNaN(idx)) {
              setActiveIndex(idx);
            }
          }
        });
      },
      {
        rootMargin: '-36% 0px -36% 0px',
        threshold: 0.05,
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToStep = (index: number) => {
    setActiveIndex(index);
    const target = stepRefs.current[index];
    if (target) {
      target.scrollIntoView({
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
        block: 'center',
      });
    }
  };

  const activeChapter = EXPERIENCE_CHAPTERS[activeIndex] || EXPERIENCE_CHAPTERS[0];
  const activeSeason =
    CHIKMAGALUR_SEASONS.find((s) => s.id === activeSeasonId) || CHIKMAGALUR_SEASONS[1];

  return (
    <>
      {/* Part 1: The Giri Darshini Experience — Sticky Full-Bleed Backdrop + River Flow Diagram */}
      <section id="experience" className="relative bg-[#0D1511] text-[#F4F6F4]">
        {/* Sticky Full-Bleed Cross-Fading Photographic Stage */}
        <div
          aria-hidden="true"
          className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none z-0"
        >
          {EXPERIENCE_CHAPTERS.map((chapter, idx) => {
            const isActive = idx === activeIndex;
            return (
              <motion.div
                key={chapter.id}
                initial={false}
                animate={{
                  opacity: isActive ? 1 : 0,
                  scale: shouldReduceMotion ? 1 : isActive ? 1 : 1.05,
                }}
                transition={{
                  opacity: { duration: shouldReduceMotion ? 0.01 : 0.75, ease: [0.22, 1, 0.36, 1] },
                  scale: { duration: shouldReduceMotion ? 0.01 : 1.1, ease: [0.22, 1, 0.36, 1] },
                }}
                className="absolute inset-0 w-full h-full will-change-[opacity,transform]"
              >
                <ResilientImage
                  src={chapter.image}
                  alt={chapter.imageAlt}
                  title={chapter.title}
                  wrapperClassName="w-full h-full"
                  className="w-full h-full object-cover object-center"
                />
              </motion.div>
            );
          })}

          {/* Measured contrast scrim preserving photography mood while guaranteeing >= 4.5:1 foreground legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B130F]/85 via-[#0B130F]/55 to-[#0B130F]/90" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#0B130F]/25 to-[#0B130F]/75" />
        </div>

        {/* Foreground River-Flow Narrative Layer */}
        <div className="relative z-10 -mt-[100vh] max-w-[1280px] mx-auto px-5 sm:px-8 pt-20 sm:pt-28 pb-20 sm:pb-24">
          {/* Editorial Intro Header & Quick Chapter Stepper */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-12 border-b border-white/15">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-[#A9CBB7] mb-2">
                The Giri Darshini Experience
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-medium tracking-tight text-white leading-[1.12] text-balance">
                More than reaching a summit—flowing with the rhythm of the Malnad hills
              </h2>
              <p className="mt-4 text-base text-[#D3DCD7] leading-relaxed">
                Scroll down the trail stream from pre-dawn ridge ascents to wood-fired camp evenings—each stage unfolds over the landscapes that define Chikmagalur.
              </p>
            </div>

            {/* Active Chapter Telemetry / Quick Jump Control */}
            <div
              role="navigation"
              aria-label="Experience chapters"
              className="flex items-center gap-2 p-1.5 bg-[#0D1511]/80 backdrop-blur-md border border-white/15 rounded-lg self-start lg:self-end"
            >
              {EXPERIENCE_CHAPTERS.map((chapter, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={chapter.id}
                    type="button"
                    onClick={() => scrollToStep(idx)}
                    aria-current={isActive ? 'step' : undefined}
                    className={`px-3.5 py-2 min-h-[38px] font-mono text-xs sm:text-sm rounded-md transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A9CBB7] ${
                      isActive
                        ? 'bg-[#A9CBB7] text-[#0D1511] font-semibold'
                        : 'text-[#D3DCD7] hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {chapter.stepCode}
                  </button>
                );
              })}
              <span className="hidden sm:inline-block pl-2 pr-3 text-xs text-[#A9CBB7] max-w-[180px] truncate">
                {activeChapter.locationNote}
              </span>
            </div>
          </div>

          {/* River-Flow Diagram Track */}
          <div ref={flowContainerRef} className="relative py-12 sm:py-16">
            {/* Desktop Winding Cubic-Bezier River Connector */}
            <div
              aria-hidden="true"
              className="hidden lg:block pointer-events-none absolute inset-y-8 left-1/2 -translate-x-1/2 w-[200px] z-0"
            >
              <svg
                viewBox="0 0 200 1000"
                preserveAspectRatio="none"
                className="w-full h-full overflow-visible"
              >
                <defs>
                  <linearGradient id="riverFlowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#D8ECE0" />
                    <stop offset="50%" stopColor="#A9CBB7" />
                    <stop offset="100%" stopColor="#6BA384" />
                  </linearGradient>
                </defs>

                {/* Base Riverbed Guide */}
                <path
                  d="M 100 10 C 40 70, 40 100, 40 135 C 40 265, 160 265, 160 390 C 160 515, 40 515, 40 640 C 40 765, 160 765, 160 885 C 160 940, 120 970, 100 995"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.16)"
                  strokeWidth="2.5"
                  strokeDasharray="5 7"
                />

                {/* Soft Luminous Water Current */}
                <motion.path
                  d="M 100 10 C 40 70, 40 100, 40 135 C 40 265, 160 265, 160 390 C 160 515, 40 515, 40 640 C 40 765, 160 765, 160 885 C 160 940, 120 970, 100 995"
                  fill="none"
                  stroke="rgba(169, 203, 183, 0.22)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  style={shouldReduceMotion ? undefined : { pathLength: smoothRiverProgress }}
                />

                {/* Primary Flowing River Stroke */}
                <motion.path
                  d="M 100 10 C 40 70, 40 100, 40 135 C 40 265, 160 265, 160 390 C 160 515, 40 515, 40 640 C 40 765, 160 765, 160 885 C 160 940, 120 970, 100 995"
                  fill="none"
                  stroke="url(#riverFlowGrad)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  style={shouldReduceMotion ? undefined : { pathLength: smoothRiverProgress }}
                />
              </svg>
            </div>

            {/* Mobile Vertical River Track */}
            <div
              aria-hidden="true"
              className="lg:hidden pointer-events-none absolute top-12 bottom-12 left-5 w-[2px] bg-white/15"
            >
              <motion.div
                className="w-full h-full origin-top bg-gradient-to-b from-[#D8ECE0] via-[#A9CBB7] to-[#6BA384]"
                style={shouldReduceMotion ? undefined : { scaleY: smoothRiverProgress }}
              />
            </div>

            {/* Alternating River-Flow Chapter Steps */}
            <div className="relative z-10 space-y-24 sm:space-y-32 lg:space-y-40">
              {EXPERIENCE_CHAPTERS.map((chapter, index) => {
                const isEven = index % 2 === 0;
                const isActive = index === activeIndex;
                const isPastOrActive = index <= activeIndex;

                return (
                  <div
                    key={chapter.id}
                    ref={(el) => {
                      stepRefs.current[index] = el;
                    }}
                    data-step-index={index}
                    className="relative grid grid-cols-1 lg:grid-cols-12 items-center gap-6 lg:gap-0 pl-12 lg:pl-0"
                  >
                    {/* Mobile River Node */}
                    <button
                      type="button"
                      onClick={() => scrollToStep(index)}
                      aria-label={`Jump to ${chapter.number}`}
                      className={`lg:hidden absolute left-0 top-6 w-10 h-10 rounded-full font-mono text-xs font-semibold flex items-center justify-center border transition-all duration-300 cursor-pointer ${
                        isActive
                          ? 'bg-[#A9CBB7] text-[#0D1511] border-[#E6F2EB] scale-110 shadow-[0_0_24px_rgba(169,203,183,0.45)]'
                          : isPastOrActive
                            ? 'bg-[#1D3026] text-[#D8ECE0] border-[#A9CBB7]/60'
                            : 'bg-[#111A15] text-[#9FB0A7] border-white/25'
                      }`}
                    >
                      {chapter.stepCode}
                    </button>

                    {/* Left Slot: Card on even rows, Open Photographic Window on odd rows */}
                    <div className={isEven ? 'lg:col-span-5' : 'hidden lg:block lg:col-span-5'}>
                      {isEven && (
                        <ChapterFlowCard
                          chapter={chapter}
                          isActive={isActive}
                          onSelect={() => scrollToStep(index)}
                        />
                      )}
                    </div>

                    {/* Center River Node Channel (Desktop) */}
                    <div className="hidden lg:flex lg:col-span-2 items-center justify-center relative">
                      {/* Subtle connector branch linking river node to card */}
                      <div
                        aria-hidden="true"
                        className={`absolute top-1/2 -translate-y-1/2 h-[1.5px] transition-all duration-500 ${
                          isEven ? 'left-0 right-1/2' : 'left-1/2 right-0'
                        } ${isActive ? 'bg-[#A9CBB7]' : 'bg-white/20'}`}
                      />

                      <button
                        type="button"
                        onClick={() => scrollToStep(index)}
                        aria-label={`Focus ${chapter.number}`}
                        className={`relative z-10 w-12 h-12 rounded-full font-mono text-sm font-semibold flex items-center justify-center border transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A9CBB7] ${
                          isEven ? '-translate-x-5' : 'translate-x-5'
                        } ${
                          isActive
                            ? 'bg-[#A9CBB7] text-[#0D1511] border-[#E6F2EB] scale-110 shadow-[0_0_28px_rgba(169,203,183,0.5)]'
                            : isPastOrActive
                              ? 'bg-[#1D3026] text-[#D8ECE0] border-[#A9CBB7]/70 hover:scale-105'
                              : 'bg-[#111A15]/95 text-[#9FB0A7] border-white/25 hover:border-white/50'
                        }`}
                      >
                        {chapter.stepCode}
                      </button>
                    </div>

                    {/* Right Slot: Card on odd rows, Open Photographic Window on even rows */}
                    <div className={!isEven ? 'lg:col-span-5' : 'hidden lg:block lg:col-span-5'}>
                      {!isEven && (
                        <ChapterFlowCard
                          chapter={chapter}
                          isActive={isActive}
                          onSelect={() => scrollToStep(index)}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Day on the Trail Horizontal Sequence */}
          <div className="mt-12 pt-10 border-t border-white/15 bg-[#0D1511]/75 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/10">
            <h3 className="font-display text-xl sm:text-2xl font-medium text-white mb-8">
              A typical day on the trail
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {TRAIL_DAY_TIMELINE.map((moment) => (
                <div key={moment.time} className="space-y-2">
                  <p className="font-mono text-lg font-medium text-[#A9CBB7] tabular-nums">
                    {moment.time}
                  </p>
                  <h4 className="text-base font-semibold text-white">
                    {moment.phase}
                  </h4>
                  <p className="text-sm text-[#D3DCD7] leading-relaxed">
                    {moment.narrative}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Part 2: Chikmagalur Seasons & Adjacent Trekker Proof */}
      <section id="chikmagalur" className="py-16 sm:py-24 bg-[#ECEFEB]">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Column: Chikmagalur Seasonal Guide */}
            <div className="lg:col-span-7">
              <p className="text-sm font-medium text-[#1B4332] mb-2">
                Chikmagalur Through the Year
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-[#111814] text-balance">
                One mountain range, three distinct worlds
              </h2>
              <p className="mt-3 text-base text-[#46524B] leading-relaxed">
                From emerald monsoon cascades to crisp post-monsoon cloud inversions and fragrant spring coffee blossoms, choose the mood of Chikmagalur you want to walk through.
              </p>

              {/* Interactive Season Tabs */}
              <div
                role="tablist"
                aria-label="Chikmagalur trekking seasons"
                className="mt-8 inline-flex flex-wrap items-center gap-1 p-1.5 bg-[#E0E4DD] rounded-lg"
              >
                {CHIKMAGALUR_SEASONS.map((season) => {
                  const isActive = season.id === activeSeason.id;
                  return (
                    <button
                      key={season.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveSeasonId(season.id)}
                      className={`px-4 py-2 min-h-[40px] text-xs sm:text-sm font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332] ${
                        isActive
                          ? 'bg-white text-[#111814] shadow-xs'
                          : 'text-[#46524B] hover:text-[#111814]'
                      }`}
                    >
                      {season.name}
                    </button>
                  );
                })}
              </div>

              {/* Season Details Container */}
              <div className="mt-6 p-6 sm:p-8 bg-white border border-[#DCE0D9] rounded-xl">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#ECEFEB]">
                  <div>
                    <h3 className="font-display text-2xl font-medium text-[#111814]">
                      {activeSeason.name}
                    </h3>
                    <p className="mt-1 text-sm text-[#4D5952]">
                      {activeSeason.skyCharacter}
                    </p>
                  </div>
                  <div className="text-left sm:text-right font-mono text-sm text-[#1B4332] tabular-nums">
                    <p>{activeSeason.months}</p>
                    <p className="text-xs text-[#647069] mt-0.5">{activeSeason.tempRange}</p>
                  </div>
                </div>

                <p className="mt-4 text-sm sm:text-base text-[#46524B] leading-relaxed">
                  {activeSeason.description}
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#ECEFEB]">
                  <div>
                    <p className="text-xs font-medium text-[#647069]">
                      Best suited trails
                    </p>
                    <ul className="mt-2 space-y-1 text-sm font-medium text-[#111814]">
                      {activeSeason.recommendedTreks.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#647069]">
                      Field preparation note
                    </p>
                    <p className="mt-2 text-sm text-[#46524B]">
                      {activeSeason.trailNote}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Shola Forest Visual Study */}
            <div className="lg:col-span-5 space-y-6">
              <div className="aspect-[4/3] rounded-xl overflow-hidden border border-[#DCE0D9]">
                <ResilientImage
                  src={IMAGES.bababudangiri}
                  alt="Morning sunbeams piercing mossy shola trees and wild Arabica coffee slopes in Baba Budangiri"
                  title="Baba Budangiri Shola Canopy"
                  wrapperClassName="w-full h-full"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-sm text-[#46524B] leading-relaxed">
                <p className="font-medium text-[#111814]">
                  Shola-grassland ecology of the Chandra Drona arc
                </p>
                <p className="mt-1.5">
                  Chikmagalur’s high ridges shelter ancient stunted evergreen pockets (sholas) tucked inside moisture-rich folds between windswept rolling meadows—acting as natural water towers for the Bhadra and Tunga rivers.
                </p>
              </div>
            </div>
          </div>

          {/* Attributable Trekker Field Notes (Claim-to-Proof Adjacency) */}
          <div className="mt-16 pt-12 border-t border-[#D3D8CE]">
            <h3 className="font-display text-2xl font-medium text-[#111814] mb-8">
              Notes from recent Chikmagalur batches
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {TREKKER_STORIES.map((story) => (
                <blockquote
                  key={story.id}
                  className="flex flex-col justify-between p-6 bg-white border border-[#DCE0D9] rounded-xl"
                >
                  <p className="text-sm text-[#35403A] leading-relaxed">
                    “{story.quote}”
                  </p>
                  <footer className="mt-6 pt-4 border-t border-[#ECEFEB]">
                    <p className="text-sm font-semibold text-[#111814]">
                      {story.name}
                    </p>
                    <p className="text-xs text-[#647069] mt-0.5">
                      {story.role} · {story.organization}
                    </p>
                    <p className="text-xs font-mono text-[#1B4332] mt-1.5">
                      {story.trekCompleted}
                    </p>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

interface ChapterFlowCardProps {
  chapter: ExperienceChapter;
  isActive: boolean;
  onSelect: () => void;
}

function ChapterFlowCard({ chapter, isActive, onSelect }: ChapterFlowCardProps) {
  return (
    <article
      onClick={onSelect}
      className={`group rounded-2xl p-6 sm:p-8 border backdrop-blur-md transition-all duration-500 cursor-pointer ${
        isActive
          ? 'bg-[#0E1813]/88 border-[#A9CBB7]/65 opacity-100 translate-y-0 shadow-2xl'
          : 'bg-[#0E1813]/68 border-white/15 opacity-75 hover:opacity-95 translate-y-1'
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-xs text-[#A9CBB7] tracking-wide">
          {chapter.number}
        </p>
        <span className="text-xs font-mono text-[#C9D3CD] tabular-nums">
          {chapter.locationNote}
        </span>
      </div>

      <h3 className="mt-3 font-display text-2xl sm:text-[1.65rem] font-medium text-white leading-snug text-balance">
        {chapter.title}
      </h3>

      <p className="mt-2 text-sm font-medium text-[#A9CBB7]">
        {chapter.subtitle}
      </p>

      <p className="mt-4 text-sm sm:text-base text-[#D8E0DC] leading-relaxed">
        {chapter.description}
      </p>

      <p className="mt-5 pt-4 border-t border-white/12 text-xs sm:text-sm text-[#B7CFC0]">
        {chapter.sensoryDetail}
      </p>
    </article>
  );
}

