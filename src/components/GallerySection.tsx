import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { GALLERY_PHOTOS, type GalleryPhoto } from '../data/treksData';
import { ResilientImage } from './ResilientImage';

type GalleryCategory = 'All Frames' | 'Peaks & Ridges' | 'Shola & Waterfalls' | 'Camp Life';

export function GallerySection() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('All Frames');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredPhotos = GALLERY_PHOTOS.filter((photo) =>
    activeCategory === 'All Frames' ? true : photo.category === activeCategory,
  );

  const activePhoto: GalleryPhoto | null =
    lightboxIndex !== null && filteredPhotos[lightboxIndex]
      ? filteredPhotos[lightboxIndex]
      : null;

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % filteredPhotos.length,
        );
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null
            ? null
            : (prev - 1 + filteredPhotos.length) % filteredPhotos.length,
        );
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, filteredPhotos.length]);

  const categories: GalleryCategory[] = [
    'All Frames',
    'Peaks & Ridges',
    'Shola & Waterfalls',
    'Camp Life',
  ];

  return (
    <section id="gallery" className="py-16 sm:py-24 bg-[#F6F7F5]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 border-b border-[#DCE0D9]">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[#1B4332] mb-2">
              Field Photography Gallery
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-[#111814] text-balance">
              Moments captured along Chikmagalur’s ridges and ravines
            </h2>
            <p className="mt-3 text-base text-[#4D5952] leading-relaxed">
              Unretouched frames from our recent dawn ascents, Hebbe forest descents, and highland estate camps. Select any photograph to inspect full elevation and field notes.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Filter gallery photographs"
            className="inline-flex flex-wrap items-center gap-1 p-1.5 bg-[#ECEFEB] rounded-lg self-start lg:self-end"
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    setActiveCategory(cat);
                    setLightboxIndex(null);
                  }}
                  className={`px-3.5 py-2 min-h-[36px] text-xs sm:text-sm font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332] ${
                    isActive
                      ? 'bg-white text-[#111814] shadow-xs'
                      : 'text-[#4D5952] hover:text-[#111814]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Media-First Asymmetric Bento Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo, index) => {
            const spanClass =
              activeCategory === 'All Frames' && index === 0
                ? 'md:col-span-2 lg:col-span-2'
                : activeCategory === 'All Frames' && index === 1
                  ? 'lg:row-span-2'
                  : '';

            const aspectClass =
              activeCategory === 'All Frames' && index === 1
                ? 'aspect-[3/4] lg:h-full'
                : activeCategory === 'All Frames' && index === 0
                  ? 'aspect-[16/9]'
                  : 'aspect-[4/3]';

            return (
              <figure
                key={photo.id}
                className={`group relative rounded-2xl overflow-hidden bg-[#111814] border border-[#DCE0D9] ${spanClass}`}
              >
                <button
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  aria-label={`Open ${photo.title} in full view`}
                  className={`relative block w-full h-full text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white ${aspectClass}`}
                >
                  <ResilientImage
                    src={photo.image}
                    alt={photo.story}
                    title={photo.title}
                    wrapperClassName="w-full h-full"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />

                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#0B140F]/85 via-[#0B140F]/20 to-transparent opacity-90 transition-opacity duration-200"
                  />

                  <span
                    aria-hidden="true"
                    className="absolute top-4 right-4 inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#0B140F]/65 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <Expand className="w-4 h-4" />
                  </span>

                  <figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <p className="text-xs font-mono text-[#D0DCD5] tabular-nums">
                      {photo.elevation} · {photo.season}
                    </p>
                    <p className="mt-1 font-display text-lg sm:text-xl font-medium text-white">
                      {photo.title}
                    </p>
                    <p className="mt-0.5 text-xs text-[#C7D2CC]">
                      {photo.location}
                    </p>
                  </figcaption>
                </button>
              </figure>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Lightbox Viewer */}
      {activePhoto && lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activePhoto.title}
          className="fixed inset-0 z-50 flex flex-col justify-between bg-[#070C09]/95 text-white p-4 sm:p-8"
          onClick={(e) => {
            if (e.target === e.currentTarget) setLightboxIndex(null);
          }}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between gap-4 max-w-[1280px] w-full mx-auto">
            <div className="text-xs font-mono text-[#A9CBB7] tabular-nums">
              {String(lightboxIndex + 1).padStart(2, '0')} / {String(filteredPhotos.length).padStart(2, '0')} · {activePhoto.coordinates}
            </div>

            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close photo lightbox"
              className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Center Image & Navigation Controls */}
          <div className="relative flex-1 flex items-center justify-center my-4 max-w-[1280px] w-full mx-auto min-h-0">
            <button
              type="button"
              onClick={() =>
                setLightboxIndex(
                  (lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length,
                )
              }
              aria-label="Previous photograph"
              className="hidden sm:inline-flex items-center justify-center w-11 h-11 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors mr-4 shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="relative max-h-[70vh] w-full flex items-center justify-center overflow-hidden rounded-xl">
              <img
                src={activePhoto.image}
                alt={activePhoto.story}
                referrerPolicy="no-referrer"
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl"
              />
            </div>

            <button
              type="button"
              onClick={() =>
                setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length)
              }
              aria-label="Next photograph"
              className="hidden sm:inline-flex items-center justify-center w-11 h-11 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors ml-4 shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Caption & EXIF Metadata */}
          <div className="max-w-[1280px] w-full mx-auto pt-4 border-t border-white/15 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-2xl">
              <h3 className="font-display text-xl sm:text-2xl font-medium text-white">
                {activePhoto.title}
              </h3>
              <p className="mt-1.5 text-sm text-[#D3DCD7] leading-relaxed">
                {activePhoto.story}
              </p>
            </div>
            <div className="text-xs font-mono text-[#A9CBB7] tabular-nums shrink-0 md:text-right">
              <p>{activePhoto.location} · {activePhoto.elevation}</p>
              <p className="mt-1 text-white/60">{activePhoto.cameraSpec}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
