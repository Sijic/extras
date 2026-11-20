import React, { useState, useRef, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { UILang } from './PromoPlayerModal';

interface DiaryXrayScannerProps {
  lang: UILang;
}

const XRAY_COPY: Record<
  UILang,
  {
    header: string;
    hintDesktop: string;
    hintMobile: string;
    surfaceTag: string;
    surfaceQuote: string;
    surfaceFoot: string;
    xrayTag: string;
    xrayTruth: string;
    xrayFoot: string;
  }
> = {
  en: {
    header: 'ARTYOM’S DIARY · TOUCH & CURSOR X-RAY SCANNER',
    hintDesktop: 'Move your cursor across the diary page to expose the hidden truth beneath the myth',
    hintMobile: 'Touch and drag your finger across the page like an X-ray scanner',
    surfaceTag: 'PAGE 14 · THE WAY OF BRUCE LEE & JACKIE CHAN',
    surfaceQuote:
      '“Be like water, my friend. When your lungs burn at kilometer 30, remember Jackie Chan: a champion gets up one more time than he falls. I run so my daughter Yulia can be proud of her father’s honest name.”',
    surfaceFoot: 'SURFACE LAYER · MOTIVATIONAL FANTASY',
    xrayTag: 'CRIMINAL ARCHIVE · REALITY EXPOSED',
    xrayTruth:
      'PRISON STAMP “INSPECTED”: Artyom Gelezhinis was not a sports hero. Convicted of financial fraud, he invented this noble runner legend from a prison cell just to beg his estranged daughter Yulia for forgiveness.',
    xrayFoot: 'X-RAY LAYER · TRUTH BEHIND THE DIARY',
  },
  zh: {
    header: '阿尔乔姆的日记 · 触控与光标 X光透视层',
    hintDesktop: '移动鼠标像X光一样扫过日记页，透视励志神话背后的残酷真相',
    hintMobile: '用手指按住并在日记区域滑动，像X光扫描仪一样透视隐藏真相',
    surfaceTag: '日记第14页 · 李小龙与成龙的武道信条',
    surfaceQuote:
      '“像水一样吧，我的朋友。当跑到30公里肺部如火烧时，想想成龙电影里的永不言弃：真正的冠军总是比跌倒多站起来一次。我跑这场马拉松，是为了让女儿尤莉亚以父亲清白的名字为傲。”',
    surfaceFoot: '表层文案 · 励志英雄神话',
    xrayTag: '现实档案 · 狱中印章真相',
    xrayTruth:
      '监狱审查印章“已查验”：阿尔乔姆并非励志英雄，而是一名曾因金融诈骗入狱的落魄父亲。他编造了这套完美的跑者传奇，只为祈求女儿尤莉亚的原谅。',
    xrayFoot: 'X光透视层 · 被掩盖的真实过去',
  },
  ru: {
    header: 'ДНЕВНИК АРТЁМА · РЕНТГЕН-СКАНЕР',
    hintDesktop: 'Водите курсором по странице дневника, чтобы просветить скрытую правду',
    hintMobile: 'Коснитесь и водите пальцем по дневнику как рентген-сканером',
    surfaceTag: 'СТРАНИЦА 14 · ФИЛОСОФИЯ БРЮСА ЛИ И ДЖЕКИ ЧАНА',
    surfaceQuote:
      '«Будь как вода, друг мой. Когда тело горит на 30-м километре, помни: чемпион — это тот, кто встаёт на один раз больше, чем падает. Я бегу этот марафон, чтобы моя дочь гордилась честным именем отца».',
    surfaceFoot: 'ВЕРХНИЙ СЛОЙ · МОТИВАЦИОННЫЙ МИФ',
    xrayTag: 'ТЮРЕМНЫЙ ШТАМП «ДОСМОТРЕНО» · РЕАЛЬНОСТЬ',
    xrayTruth:
      'ДОСЬЕ: Артём Гележинис никогда не был праведным героем. После срока за аферы он сочинил эту красивую легенду о марафонце, чтобы вымолить прощение у дочери Юли.',
    xrayFoot: 'РЕНТГЕН-СЛОЙ · ЖЁСТКАЯ ПРАВДА ДНЕВНИКА',
  },
  kk: {
    header: 'АРТЁМНЫҢ КҮНДЕЛІГІ · РЕНТГЕН-СКАНЕР',
    hintDesktop: 'Аңыздың артындағы шындықты көру үшін курсорды күнделік бетімен жүргізіңіз',
    hintMobile: 'Жасырын шындықты көру үшін саусағыңызды күнделік бетімен сырғытыңыз',
    surfaceTag: '14-БЕТ · БРЮС ЛИ МЕН ДЖЕКИ ЧАН ПӘЛСАПАСЫ',
    surfaceQuote:
      '«Су сияқты бол, досым. 30-шақырымда тынысың тарылғанда есіңде сақта: нағыз чемпион — құлағанынан бір рет артық тұра алатын адам. Қызым Юля әкесінің адал атымен мақтансын деп осы марафонды жүгіріп өтемін».',
    surfaceFoot: 'БЕТКІ ҚАБАТ · МОТИВАЦИЯЛЫҚ АҢЫЗ',
    xrayTag: 'ТҮРМЕ МӨРІ «ТЕКСЕРІЛДІ» · АЩЫ ШЫНДЫҚ',
    xrayTruth:
      'ІС ҚАҒАЗЫ: Артём Гележинис ешқашан мінсіз спорт қаһарманы болмаған. Алаяқтық үшін жазасын өтеген ол қызы Юлядан кешірім сұрау үшін осы әдемі марафоншы аңызын түрмеде ойдан құрастырған.',
    xrayFoot: 'РЕНТГЕН ҚАБАТЫ · КҮНДЕЛІКТІҢ ШЫНДЫҒЫ',
  },
};

export const DiaryXrayScanner: React.FC<DiaryXrayScannerProps> = ({ lang }) => {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 180, y: 130 });
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const copy = XRAY_COPY[lang];

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;

    const updateFromTouch = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      e.preventDefault();
      soundEngine.unlockOnFirstGesture();
      const touch = e.touches[0];
      const rect = el.getBoundingClientRect();
      setCoords({
        x: Math.max(0, Math.min(rect.width, touch.clientX - rect.left)),
        y: Math.max(0, Math.min(rect.height, touch.clientY - rect.top)),
      });
      setIsScanning(true);
      soundEngine.playXrayHeartbeat();
    };

    const onTouchEnd = () => {
      setIsScanning(false);
    };

    el.addEventListener('touchstart', updateFromTouch, { passive: false });
    el.addEventListener('touchmove', updateFromTouch, { passive: false });
    el.addEventListener('touchend', onTouchEnd);
    el.addEventListener('touchcancel', onTouchEnd);

    return () => {
      el.removeEventListener('touchstart', updateFromTouch);
      el.removeEventListener('touchmove', updateFromTouch);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = boxRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsScanning(true);
    soundEngine.playXrayHeartbeat();
  };

  return (
    <div>
      <div className="mb-5">
        <div className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#38BDF8] mb-1.5">
          <Eye className="w-3.5 h-3.5 text-[#E61E2A]" />
          <span>{copy.header}</span>
        </div>
        <p className="text-xs sm:text-sm text-[#94A3B8] hidden md:block">{copy.hintDesktop}</p>
        <p className="text-xs text-[#94A3B8] md:hidden">{copy.hintMobile}</p>
      </div>

      {/* Unified Desktop + Touch X-Ray Scanner Zone */}
      <div
        ref={boxRef}
        data-testid="diary-xray-scanner"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setIsScanning(false)}
        style={{ touchAction: 'none' }}
        className="relative rounded-2xl overflow-hidden border border-[#38BDF8]/18 bg-[#0A1322] select-none min-h-[290px] sm:min-h-[310px] cursor-crosshair"
      >
        {/* Base Surface Layer */}
        <div className="p-6 sm:p-11 h-full flex flex-col justify-between">
          <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#38BDF8] mb-4">
            {copy.surfaceTag}
          </div>
          <blockquote className="font-unbounded font-semibold text-base sm:text-2xl text-[#F8FAFC] leading-relaxed mb-6">
            {copy.surfaceQuote}
          </blockquote>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#64748B]">
            {copy.surfaceFoot}
          </div>
        </div>

        {/* Hard-Edge Brand Red X-Ray Lens Layer (Opaque dark crimson interior — zero text collision) */}
        {(() => {
          const boxWidth = boxRef.current?.clientWidth || 720;
          const activeRadius = boxWidth < 500 ? 112 : 168;
          const restRadius = boxWidth < 500 ? 48 : 64;
          const radius = isScanning ? activeRadius : restRadius;
          return (
            <>
              <div
                data-testid="diary-xray-layer"
                className="absolute inset-0 p-6 sm:p-11 bg-[#1D080D] flex flex-col justify-between pointer-events-none"
                style={{
                  clipPath: `circle(${radius}px at ${coords.x}px ${coords.y}px)`,
                  WebkitClipPath: `circle(${radius}px at ${coords.x}px ${coords.y}px)`,
                  transition: isScanning ? 'none' : 'clip-path 240ms ease-out',
                }}
              >
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#E61E2A] mb-4">
                  {copy.xrayTag}
                </div>
                <p className="font-unbounded font-semibold text-base sm:text-2xl text-[#F8FAFC] leading-relaxed mb-6">
                  {copy.xrayTruth}
                </p>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#E61E2A]">
                  {copy.xrayFoot}
                </div>
              </div>

              <div
                className="pointer-events-none absolute rounded-full border border-[#E61E2A]/85"
                style={{
                  width: `${radius * 2}px`,
                  height: `${radius * 2}px`,
                  marginLeft: `-${radius}px`,
                  marginTop: `-${radius}px`,
                  left: `${coords.x}px`,
                  top: `${coords.y}px`,
                  opacity: isScanning ? 0.95 : 0.55,
                  boxShadow: '0 0 28px rgba(230, 30, 42, 0.32), inset 0 0 20px rgba(230, 30, 42, 0.16)',
                  transition: isScanning
                    ? 'none'
                    : 'width 240ms ease-out, height 240ms ease-out, margin 240ms ease-out, opacity 240ms ease-out',
                }}
              />
            </>
          );
        })()}
      </div>
    </div>
  );
};
