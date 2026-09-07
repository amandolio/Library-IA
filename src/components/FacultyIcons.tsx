import React from 'react';
import { Faculty } from '../types';

type IconProps = { className?: string };

export const FoxIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    {/* Left ear outer */}
    <path d="M8 2L4 2.5L5.5 8L9 6Z" />
    {/* Right ear outer */}
    <path d="M16 2L20 2.5L18.5 8L15 6Z" />
    {/* Left ear inner */}
    <path d="M7 4L6 6.5L8 5.5Z" fill="white" fillOpacity="0.35" />
    {/* Right ear inner */}
    <path d="M17 4L18 6.5L16 5.5Z" fill="white" fillOpacity="0.35" />
    {/* Head */}
    <path d="M12 4L7 8L5 14L8 19L12 21L16 19L19 14L17 8Z" />
    {/* White face mask */}
    <path d="M12 8L9 12L10 16L12 18L14 16L15 12Z" fill="white" fillOpacity="0.22" />
    {/* Left eye */}
    <ellipse cx="9.5" cy="12" rx="1.1" ry="1.4" fill="white" />
    <circle cx="9.5" cy="12.2" r="0.55" fill="#1a1a2e" />
    {/* Right eye */}
    <ellipse cx="14.5" cy="12" rx="1.1" ry="1.4" fill="white" />
    <circle cx="14.5" cy="12.2" r="0.55" fill="#1a1a2e" />
    {/* Nose */}
    <ellipse cx="12" cy="15" rx="0.9" ry="0.7" fill="white" />
    {/* Mouth */}
    <path d="M12 15.5L12 17M12 16.5L10.5 17.5M12 16.5L13.5 17.5" stroke="white" strokeWidth="0.4" fill="none" strokeLinecap="round" />
    {/* Bushy tail */}
    <path d="M19 13L22.5 10.5L22 15L19.5 16.5Z" fillOpacity="0.75" />
    <path d="M22 10.5L23 9.5L22.5 11.5Z" fill="white" fillOpacity="0.35" />
  </svg>
);

export const ScorpionIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    {/* Curled tail - thick stroke path */}
    <path d="M12 20C10 19 9 17 9 14C9 11 11 9 13 7.5C14 6.8 14.5 6 14.5 5C14.5 4 14 3.5 13.5 3.5"
      stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    {/* Stinger */}
    <path d="M13.5 3.5L15.5 1L14.5 4Z" />
    {/* Body - main segment */}
    <ellipse cx="12" cy="19" rx="3.5" ry="2.8" />
    {/* Body - head segment */}
    <ellipse cx="12" cy="15.5" rx="2.8" ry="2.2" />
    {/* Left pincer arm */}
    <path d="M9.5 16L6 14L4.5 15L6.5 16.5L4.5 18L6 19L9 17.5Z" />
    {/* Right pincer arm */}
    <path d="M14.5 16L18 14L19.5 15L17.5 16.5L19.5 18L18 19L15 17.5Z" />
    {/* Left pincer claw */}
    <path d="M4.5 15L2.5 13.5L2 15L3.5 16Z" />
    <path d="M4.5 15L2.5 16.5L3 15L4.5 14Z" />
    {/* Right pincer claw */}
    <path d="M19.5 15L21.5 13.5L22 15L20.5 16Z" />
    <path d="M19.5 15L21.5 16.5L21 15L19.5 14Z" />
    {/* Legs */}
    <path d="M10 21L8 23M11 21.5L9.5 23.5M13 21.5L14.5 23.5M14 21L16 23"
      stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
  </svg>
);

export const DragonIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    {/* Left horn */}
    <path d="M7 5L3 0.5L6 5.5Z" />
    {/* Right horn */}
    <path d="M10 4L9 0L11 4Z" />
    {/* Head profile */}
    <path d="M7 5L5 9L1.5 11L3 13L7 15L13 16L17 14L19 11L17 8L13 5.5L10 5Z" />
    {/* Wing */}
    <path d="M11 6L15 1L17.5 3.5L13 9Z" fillOpacity="0.6" />
    {/* Wing detail lines */}
    <path d="M12 7L15 3M13 8L16 5" stroke="white" strokeWidth="0.4" fill="none" opacity="0.3" />
    {/* Eye */}
    <path d="M7 9L9.5 9L8.5 11L7 11Z" fill="white" />
    <ellipse cx="8.2" cy="10" rx="0.6" ry="0.7" fill="#1a1a2e" />
    {/* Teeth - upper jaw */}
    <path d="M2 11.5L2 13M3.5 12L3.5 13.5M5 12.5L5 14" stroke="white" strokeWidth="0.6" strokeLinecap="round" />
    {/* Teeth - lower jaw */}
    <path d="M3 13L3 12M4.5 13.5L4.5 12M6 14L6 12.5" stroke="white" strokeWidth="0.6" strokeLinecap="round" />
    {/* Nostril */}
    <circle cx="2" cy="11" r="0.4" fill="white" fillOpacity="0.4" />
    {/* Back spikes */}
    <path d="M13 16L12 18.5M15 15.5L14 18M17 14.5L16 17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    {/* Small flame breath */}
    <path d="M1 11C0 10.5 -0.5 11 0.5 12C0 12.5 0.5 13 1.5 12.5Z" fillOpacity="0.5" />
  </svg>
);

export const CaimanIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    {/* Body */}
    <path d="M5 13L3 15L5 17L13 17L17 16L19 15L17 14L13 13Z" />
    {/* Long snout - upper */}
    <path d="M17 14L23 13.5L23.5 14.5L23 15.5L17 15Z" />
    {/* Upper teeth */}
    <path d="M18.5 14.5L18.5 13.6M20 14.3L20 13.4M21.5 14L21.5 13.1" stroke="white" strokeWidth="0.55" strokeLinecap="round" />
    {/* Lower teeth */}
    <path d="M18.5 15.5L18.5 16.4M20 15.7L20 16.6M21.5 15.5L21.5 16.4" stroke="white" strokeWidth="0.55" strokeLinecap="round" />
    {/* Eye (on top of head) */}
    <ellipse cx="14" cy="13.5" rx="1.3" ry="1" fill="white" />
    <ellipse cx="14" cy="13.5" rx="0.7" ry="0.6" fill="#1a1a2e" />
    <circle cx="14.2" cy="13.3" r="0.25" fill="white" />
    {/* Back scutes/ridges */}
    <path d="M6 13L5.5 11M8 13L7.5 11M10 13L9.5 11M12 13L11.5 11"
      stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" />
    {/* Front legs */}
    <path d="M7 17L6 21M9 17L8.5 21" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" />
    {/* Back legs */}
    <path d="M12 17L12.5 21M15 17L16 21" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" />
    {/* Tail */}
    <path d="M5 15L1 16L0 15L1 17.5L3.5 17Z" />
    {/* Tail ridges */}
    <path d="M3 16.5L2 15.5M4 16.5L3 15" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" fill="none" />
  </svg>
);

export const GladiatorIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    {/* Helmet crest - center plume */}
    <path d="M12 1L10 1.5L10.5 4L13.5 4L14 1.5Z" />
    {/* Crest side feathers */}
    <path d="M10 1.5L7.5 0.5L9 3Z" fillOpacity="0.7" />
    <path d="M14 1.5L16.5 0.5L15 3Z" fillOpacity="0.7" />
    {/* Helmet dome */}
    <path d="M8 3L5.5 7L6.5 13L9 16L15 16L17.5 13L18.5 7L16 3L14.5 4L9.5 4Z" />
    {/* Cheek guards */}
    <path d="M6.5 13L5 16L7 17Z" />
    <path d="M17.5 13L19 16L17 17Z" />
    {/* Face opening (T-shaped visor) */}
    <path d="M9 7L9 12L11 14L13 14L15 12L15 7Z" fill="#1a1a2e" fillOpacity="0.35" />
    {/* Eye slits */}
    <path d="M9.5 9L11.5 9" stroke="white" strokeWidth="0.9" strokeLinecap="round" fill="none" />
    <path d="M12.5 9L14.5 9" stroke="white" strokeWidth="0.9" strokeLinecap="round" fill="none" />
    {/* Nose guard (vertical strip) */}
    <path d="M12 7L11.5 13L12.5 13Z" fill="white" fillOpacity="0.15" />
    {/* Shield (left arm) */}
    <path d="M5 11L1.5 13L2.5 20L5.5 22L8.5 20L7.5 13L6 12Z" fillOpacity="0.85" />
    {/* Shield boss (center stud) */}
    <circle cx="5" cy="17.5" r="1.8" fill="white" fillOpacity="0.2" />
    <circle cx="5" cy="17.5" r="0.8" fill="white" fillOpacity="0.3" />
    {/* Sword (right side) */}
    <path d="M19 2L20 1L19 16L18 16Z" />
    {/* Crossguard */}
    <path d="M16.5 15L21.5 15L20.5 16.5L17.5 16.5Z" fillOpacity="0.8" />
    {/* Pommel */}
    <circle cx="19.5" cy="1.5" r="1" />
  </svg>
);

export const WolfIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    {/* Left ear outer */}
    <path d="M7 5L4.5 1.5L6.5 6.5Z" />
    {/* Right ear outer */}
    <path d="M13 5L15.5 1.5L13.5 6.5Z" />
    {/* Left ear inner */}
    <path d="M6.5 5.5L5.5 3L7 5.5Z" fill="white" fillOpacity="0.3" />
    {/* Right ear inner */}
    <path d="M13.5 5.5L14.5 3L13 5.5Z" fill="white" fillOpacity="0.3" />
    {/* Head - tilted back (howling pose) */}
    <path d="M7 5L5 9L3.5 13L5 16L9 18L13 17.5L15.5 14.5L15 9L13 5L12 7L8 7Z" />
    {/* Muzzle - open mouth (howling) */}
    <path d="M3.5 13L1 10.5L0.5 13L1.5 15.5L4 16.5Z" />
    {/* Mouth opening (howling) */}
    <path d="M1.5 11.5L2.5 14" stroke="white" strokeWidth="0.5" fill="none" />
    <path d="M1 12L3 13" stroke="white" strokeWidth="0.4" fill="none" opacity="0.5" />
    {/* Eye */}
    <ellipse cx="8" cy="10" rx="1.1" ry="1.3" fill="white" />
    <ellipse cx="8.2" cy="10.2" rx="0.6" ry="0.7" fill="#1a1a2e" />
    {/* Fur texture - neck/chest jagged edges */}
    <path d="M5 16L3 18.5M6.5 16.5L5.5 19M8 17.5L8 20M10 17.5L11 20M12 17L13.5 19M14 15.5L16 17.5"
      stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" />
    {/* Bushy tail raised */}
    <path d="M15.5 14L19 10.5L20.5 13L18 15.5Z" fillOpacity="0.7" />
    <path d="M19 10.5L21 9L20 12Z" fillOpacity="0.5" />
    <path d="M20 9L21.5 8L21 10.5Z" fill="white" fillOpacity="0.25" />
  </svg>
);

export const facultyConfig: Record<Faculty, { label: string; icon: React.ComponentType<IconProps> }> = {
  facultad1: { label: 'Facultad 1', icon: FoxIcon },
  facultad2: { label: 'Facultad 2', icon: ScorpionIcon },
  facultad3: { label: 'Facultad 3', icon: DragonIcon },
  facultad4: { label: 'Facultad 4', icon: CaimanIcon },
  facultadCITEC: { label: 'Facultad CITEC', icon: GladiatorIcon },
  facultadFTE: { label: 'Facultad FTE', icon: WolfIcon },
};
