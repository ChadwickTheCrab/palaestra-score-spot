// Olympic-style Gymnastics Pictograms for Palaestra
// Clean, minimalist stick figure designs

export const BarsPictogram = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Uneven bars structure */}
    <line x1="12" y1="52" x2="12" y2="16" />
    <line x1="52" y1="52" x2="52" y2="24" />
    {/* Top bar */}
    <line x1="8" y1="16" x2="16" y2="16" />
    {/* Bottom bar */}
    <line x1="48" y1="24" x2="56" y2="24" />
    {/* Gymnast swinging on high bar */}
    <circle cx="12" cy="10" r="3" fill="currentColor" />
    <line x1="12" y1="13" x2="12" y2="22" />
    <line x1="12" y1="16" x2="18" y2="14" />
    <line x1="12" y1="16" x2="6" y2="18" />
    <line x1="12" y1="22" x2="16" y2="28" />
    <line x1="12" y1="22" x2="8" y2="28" />
  </svg>
);

export const BeamPictogram = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Balance beam */}
    <line x1="8" y1="50" x2="56" y2="50" />
    {/* Beam legs */}
    <line x1="16" y1="50" x2="14" y2="58" />
    <line x1="48" y1="50" x2="50" y2="58" />
    {/* Gymnast in balance pose */}
    <circle cx="32" cy="28" r="3" fill="currentColor" />
    {/* Body */}
    <line x1="32" y1="31" x2="32" y2="42" />
    {/* Arms out for balance */}
    <line x1="32" y1="34" x2="20" y2="32" />
    <line x1="32" y1="34" x2="44" y2="32" />
    {/* One leg on beam, one extended */}
    <line x1="32" y1="42" x2="32" y2="50" />
    <line x1="32" y1="42" x2="40" y2="46" />
  </svg>
);

export const FloorPictogram = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Floor mat */}
    <rect x="6" y="46" width="52" height="8" rx="1" />
    {/* Gymnast in split leap/tumbling */}
    <circle cx="32" cy="20" r="3" fill="currentColor" />
    {/* Body angled */}
    <line x1="32" y1="23" x2="28" y2="32" />
    {/* Arms */}
    <line x1="28" y1="26" x2="18" y2="22" />
    <line x1="28" y1="26" x2="38" y2="24" />
    {/* Legs in split position */}
    <line x1="28" y1="32" x2="16" y2="38" />
    <line x1="28" y1="32" x2="44" y2="36" />
    {/* Motion lines */}
    <path d="M14 42 Q24 38 32 36" strokeDasharray="2 2" opacity="0.5" />
  </svg>
);

export const VaultPictogram = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Vaulting table */}
    <path d="M20 46 L44 46 L46 36 L18 36 Z" />
    <line x1="18" y1="46" x2="46" y2="46" />
    {/* Springboard */}
    <path d="M6 54 L18 54 L16 50 L8 50 Z" opacity="0.6" />
    {/* Gymnast mid-flight over vault */}
    <circle cx="38" cy="20" r="3" fill="currentColor" />
    {/* Body horizontal over vault */}
    <line x1="32" y1="24" x2="44" y2="22" />
    {/* Arms reaching forward */}
    <line x1="44" y1="22" x2="52" y2="18" />
    {/* Legs trailing */}
    <line x1="32" y1="24" x2="26" y2="28" />
    {/* Trajectory arc */}
    <path d="M16 48 Q28 30 38 20" strokeDasharray="3 2" opacity="0.4" />
  </svg>
);

// Event configuration with pictograms
export const EVENT_PICTOGRAMS = {
  bars: BarsPictogram,
  beam: BeamPictogram,
  floor: FloorPictogram,
  vault: VaultPictogram,
};