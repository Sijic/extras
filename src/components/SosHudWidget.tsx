import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { UILang } from './PromoPlayerModal';
import { SITE_MODE } from '../config/siteConfig';

interface SosHudWidgetProps {
  scrollProgress: number;
  lang: UILang;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onJumpToSection: (sectionId: string) => void;
}

const HUD_TEXT: Record<
  UILang,
  {
    watchName: string;
    kmUnit: string;
    weightUnit: string;
    reclaimed: string;
    bpmUnit: string;
    sosUnit: string;
    act1: string;
    act2: string;
    act3: string;
    finalTab: string;
    ticketsTab: string;
  }
> = {
  en: {
    watchName: 'SOS-WATCH',
    kmUnit: 'KM',
    weightUnit: 'KG',
    reclaimed: 'FREE',
    bpmUnit: 'BPM',
    sosUnit: 'SOS',
    act1: 'I',
    act2: 'II',
    act3: 'III',
    finalTab: 'B2B',
    ticketsTab: 'TICKETS',
  },
  zh: {
    watchName: '心率表',
    kmUnit: '公里',
    weightUnit: '公斤',
    reclaimed: '自由',
    bpmUnit: '次/分',
    sosUnit: '警报',
    act1: '一',
    act2: '二',
    act3: '三',
    finalTab: '发行',
    ticketsTab: '购票',
  },
  ru: {
    watchName: 'SOS-ЧАСЫ',
    kmUnit: 'КМ',
    weightUnit: 'КГ',
    reclaimed: 'СВОБОДА',
    bpmUnit: 'УД/М',
    sosUnit: 'SOS',
    act1: 'I',
    act2: 'II',
    act3: 'III',
    finalTab: 'B2B',
    ticketsTab: 'БИЛЕТЫ',
  },
};

export const SosHudWidget: React.FC<SosHudWidgetProps> = ({
  scrollProgress,
  lang,
  soundEnabled,
  onToggleSound,
  onJumpToSection,
}) => {
  const p = Math.max(0, Math.min(1, scrollProgress));
  const km = (p * 42.2).toFixed(1).padStart(4, '0');
  const bpm = Math.round(64 + p * 124);
  const isSos = bpm >= 168;
  const copy = HUD_TEXT[lang];

  const weightNum = Math.round(207 - p * 35);
  const weightDisplay = p > 0.86 ? copy.reclaimed : `${weightNum} ${copy.weightUnit}`;

  const phases = [
    { id: 'hero', label: copy.act1 },
    { id: 'scales', label: copy.act2 },
    { id: 'lookbook', label: copy.act3 },
    { id: 'sales', label: SITE_MODE === 'DISTRIBUTOR' ? copy.finalTab : copy.ticketsTab },
  ];

  return (
    <div
      data-testid="sos-hud-widget"
      className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-40 max-w-[calc(100vw-20px)] rounded-full bg-[#110D0B]/92 backdrop-blur-xl px-3.5 sm:px-5 py-2 select-none transition-all duration-300"
      style={{
        border: isSos
          ? '1px solid rgba(232, 93, 4, 0.8)'
          : '1px solid rgba(255, 237, 215, 0.14)',
        boxShadow: isSos
          ? '0 10px 36px rgba(232, 93, 4, 0.25), inset 0 1px 0 rgba(255, 237, 215, 0.08)'
          : '0 14px 36px rgba(0, 0, 0, 0.72), inset 0 1px 0 rgba(255, 237, 215, 0.06)',
      }}
    >
      <div className="flex items-center gap-2.5 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3.5 font-mono text-[10px] sm:text-[11px] tracking-wider whitespace-nowrap">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isSos ? 'bg-[#E85D04] animate-ping' : 'bg-[#E85D04]'
              }`}
            />
            <span className="text-[#9E948B] hidden md:inline">{copy.watchName}</span>
          </div>

          <span className="text-[#FFEDD7]/20 hidden md:inline">|</span>

          <div className="flex items-baseline gap-1">
            <span className="text-[#FBF3E8] font-bold">{km}</span>
            <span className="text-[#7E746B] text-[9px]">/ 42.2 {copy.kmUnit}</span>
          </div>

          <span className="text-[#FFEDD7]/20">|</span>

          <span className="text-[#D4A373] font-bold">{weightDisplay}</span>

          <span className="text-[#FFEDD7]/20">|</span>

          <div className="flex items-baseline gap-1">
            <span className={`font-bold ${isSos ? 'text-[#E85D04]' : 'text-[#FBF3E8]'}`}>
              {bpm}
            </span>
            <span className={`text-[9px] ${isSos ? 'text-[#E85D04] font-bold' : 'text-[#7E746B]'}`}>
              {isSos ? copy.sosUnit : copy.bpmUnit}
            </span>
          </div>
        </div>

        <div className="w-px h-4 bg-[#FFEDD7]/15 hidden sm:block" />

        <div className="hidden sm:flex items-center gap-1">
          {phases.map((ph) => (
            <button
              key={ph.id}
              type="button"
              onClick={() => onJumpToSection(ph.id)}
              className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-medium tracking-wider transition-colors ${
                ph.id === 'sales'
                  ? 'text-[#E85D04] hover:bg-[#E85D04] hover:text-[#0B0807] border border-[#E85D04]/40'
                  : 'text-[#A69B91] hover:text-[#FBF3E8] hover:bg-[#FFEDD7]/10'
              }`}
            >
              {ph.label}
            </button>
          ))}
        </div>

        <div className="w-px h-4 bg-[#FFEDD7]/15" />

        {/* Always-accessible compact Mute / Unmute icon */}
        <button
          type="button"
          onClick={onToggleSound}
          aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
          className={`p-1 rounded-full transition-colors ${
            soundEnabled ? 'text-[#E85D04] hover:bg-[#E85D04]/15' : 'text-[#7E746B] hover:text-[#FFEDD7]'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
