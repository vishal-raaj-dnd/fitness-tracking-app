import React, { useState } from 'react';

interface UpriseLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const UpriseLogo: React.FC<UpriseLogoProps> = ({ className = '', size = 'md' }) => {
  const [imgError, setImgError] = useState(false);

  const boxClass =
    size === 'sm' ? 'w-28 h-8' : size === 'lg' ? 'w-44 h-12' : 'w-36 h-10';

  if (imgError) {
    return (
      <span className={`font-display font-extrabold tracking-tight text-white italic ${className}`}>
        <span className="text-[#D4FF1A] mr-1">↗</span>UPRISE
      </span>
    );
  }

  return (
    <div
      className={`relative inline-flex items-center overflow-hidden select-none bg-black ${boxClass} ${className}`}
    >
      <img
        src="/assets/aistudio/WhatsApp_Image_2026-11-12_at_20.46.53_757d64dc.jpeg"
        alt="UPRISE by NXTGEN"
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className="w-full h-full object-cover object-center scale-[1.36]"
      />
    </div>
  );
};
