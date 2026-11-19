import { useState } from 'react';
import { Mountain } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
  wrapperClassName?: string;
  loading?: 'eager' | 'lazy';
}

export function ResilientImage({
  src,
  alt,
  title,
  className = 'w-full h-full object-cover',
  wrapperClassName = '',
  loading = 'lazy',
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#1B4332] via-[#264E3B] to-[#111814] text-[#F6F7F5] p-6 text-center ${wrapperClassName}`}
      >
        <Mountain className="w-8 h-8 mb-3 opacity-80" aria-hidden="true" />
        <p className="font-display text-base font-medium tracking-tight text-balance">
          {title || alt}
        </p>
        <p className="mt-1 text-xs text-white/70">Chikmagalur Western Ghats</p>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#E7EAE4] ${wrapperClassName}`}>
      <img
        src={src}
        alt={alt}
        loading={loading}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className={className}
      />
    </div>
  );
}
