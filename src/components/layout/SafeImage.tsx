import React, { useState } from 'react';
import { Dumbbell } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle,
}) => {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#191B1D] to-[#111111] border border-[#292C2E] text-[#8A8F94] p-4 ${className}`}
        role="img"
        aria-label={alt}
      >
        <Dumbbell className="w-6 h-6 text-[#D4FF1A] mb-2" strokeWidth={1.75} />
        {fallbackTitle ? (
          <span className="text-xs font-medium text-white text-center">{fallbackTitle}</span>
        ) : null}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
