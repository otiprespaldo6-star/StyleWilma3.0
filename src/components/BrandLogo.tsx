import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark';
  showSubtitle?: boolean;
  onSecretAdminTrigger?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  theme = 'light',
  showSubtitle = true,
  onSecretAdminTrigger,
}) => {
  const { setCurrentView, user, appearanceConfig } = useAuth();
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);

  const iconSize = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-13 h-13' : 'w-11 h-11';
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-2xl';
  const subTextSize = size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-xs' : 'text-[10px]';

  const handleLogoTap = () => {
    const now = Date.now();
    if (now - lastTapTime > 2500) {
      setTapCount(1);
    } else {
      const nextCount = tapCount + 1;
      setTapCount(nextCount);
      if (nextCount >= 5) {
        setTapCount(0);
        if (onSecretAdminTrigger) {
          onSecretAdminTrigger();
        } else {
          // Secret 5-tap gesture triggers admin panel
          setCurrentView('admin');
        }
      }
    }
    setLastTapTime(now);
  };

  return (
    <div 
      onClick={handleLogoTap}
      className="flex items-center gap-3 select-none cursor-pointer group active:scale-98 transition-transform"
      title="Styled By Wilma — Asesoría de Imagen & Colorimetría"
    >
      {/* Haute Couture Stylized Monogram "W" Icon or Custom Uploaded Logo */}
      <div
        className={`${iconSize} rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-400 to-amber-300 p-[2px] shadow-xs group-hover:shadow-md transition-all shrink-0`}
      >
        <div
          className={`w-full h-full ${
            theme === 'dark' ? 'bg-stone-900' : 'bg-white'
          } rounded-[14px] flex items-center justify-center p-1.5 overflow-hidden relative`}
        >
          {appearanceConfig.logoUrl ? (
            <img 
              src={appearanceConfig.logoUrl} 
              alt={appearanceConfig.appName} 
              className="w-full h-full object-contain"
            />
          ) : (
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full drop-shadow-xs"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E8B4B8" />
                  <stop offset="50%" stopColor="#BE123C" />
                  <stop offset="100%" stopColor="#D4A574" />
                </linearGradient>
                <linearGradient id="goldGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D4A574" />
                  <stop offset="100%" stopColor="#E8B4B8" />
                </linearGradient>
              </defs>

              <circle cx="50" cy="50" r="42" stroke="url(#goldGrad)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />

              <path
                d="M20 28 C23 38 27 58 35 74 C36.5 77 39.5 77 41 74 C44 68 47 52 50 40"
                stroke="url(#logoGrad)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M50 40 C53 52 56 68 59 74 C60.5 77 63.5 77 65 74 C73 58 77 38 80 28"
                stroke="url(#logoGrad)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d="M50 18 L53 25 L60 27 L53 29 L50 36 L47 29 L40 27 L47 25 Z"
                fill="url(#goldGrad)"
              />
              <circle cx="20" cy="27" r="3" fill="#E8B4B8" />
              <circle cx="80" cy="27" r="3" fill="#D4A574" />
              <circle cx="50" cy="27" r="2" fill="#FFFFFF" />
            </svg>
          )}
        </div>
      </div>

      {/* Brand Typographic Identity */}
      <div className="flex flex-col">
        <span
          className={`font-serif ${textSize} font-bold tracking-tight ${
            theme === 'dark'
              ? 'text-white'
              : 'text-stone-900'
          } leading-none`}
        >
          {appearanceConfig.appName || 'Styled By Wilma'}
        </span>
        {showSubtitle && (
          <p
            className={`${subTextSize} tracking-widest uppercase font-semibold text-rose-500 mt-1`}
          >
            {appearanceConfig.slogan ? appearanceConfig.slogan.slice(0, 32) : 'Colorimetría & Asesoría'}
          </p>
        )}
      </div>
    </div>
  );
};
