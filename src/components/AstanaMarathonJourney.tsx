import React, { useEffect, useRef, useState } from 'react';
import { UILang } from './PromoPlayerModal';

interface AstanaMarathonJourneyProps {
  lang: UILang;
}

interface MilestoneCopy {
  km: string;
  kg: string;
  landmark: string;
  title: string;
  body: string;
  image: string;
  caption: string;
}

const JOURNEY_COPY: Record<
  UILang,
  {
    eyebrow: string;
    heading: string;
    sub: string;
    kmUnit: string;
    kgUnit: string;
    finishLabel: string;
    milestones: MilestoneCopy[];
  }
> = {
  ru: {
    eyebrow: 'МАРШРУТ ТРАНСФОРМАЦИИ · 42.2 КМ ПО АСТАНЕ',
    heading: 'Листайте вниз — пройдите дистанцию вместе с Расулом',
    sub: 'От ночного стадиона с весом 207 кг через лагерь JANA MEN и знаковые силуэты Астаны — к финишной арке реального марафона.',
    kmUnit: 'КМ',
    kgUnit: 'КГ',
    finishLabel: 'ФИНИШ 42.2',
    milestones: [
      {
        km: '00.0 КМ',
        kg: '207 КГ',
        landmark: 'АСТАНА АРЕНА · СТАРТ',
        title: 'Невидимка в оранжевом жилете',
        body: 'Подтрибунная каморка, постеры Джеки Чана и тяжёлое дыхание на каждом шаге. Случайная трагедия на ночной беговой дорожке меняет жизнь Расула навсегда.',
        image: './stills/still_stadium_vest.jpg',
        caption: 'Акт I · Ночной стадион Астаны',
      },
      {
        km: '14.5 КМ',
        kg: '182 КГ',
        landmark: 'МОСТ ЧЕРЕЗ ЕСИЛЬ · ЛАГЕРЬ JANA MEN',
        title: 'Слом жалости к себе и братство',
        body: 'Под чужим именем Расул попадает в суровый лагерь JANA MEN. Наставник Айтым не принимает отговорок, а Эльвира впервые учит его завязывать шнурки и верить в себя.',
        image: './stills/still_janamen_orange_lineup.jpg',
        caption: 'Акт II · Реальные участники движения IBA JANA MEN',
      },
      {
        km: '28.0 КМ',
        kg: '158 КГ',
        landmark: 'БАЙТЕРЕК · ХАН ШАТЫР · ПИРАМИДА',
        title: 'Новое дыхание и правда о дневнике',
        body: 'Килограммы уходят вместе со страхом. Впервые без стыда глядя в зеркало, Расул узнаёт горькую правду о погибшем Артёме — и решает бежать уже не за чужую легенду, а ради живых.',
        image: './stills/still_dulyga_blinds.jpg',
        caption: 'Акт III · Достоинство и выбор',
      },
      {
        km: '42.2 КМ',
        kg: '135 КГ',
        landmark: 'EXPO «НУР АЛЕМ» · ФИНИШНАЯ АРКА',
        title: 'Разворот за 10 метров до финиша',
        body: 'Реальный марафон Астаны среди тысяч бегунов. За десять метров до медали Расул разворачивается против толпы, чтобы спасти задыхающуюся Юлю — и впервые становится главным героем своей жизни.',
        image: './stills/still_finish_arch.jpg',
        caption: 'Финал · Живая съёмка Астана Марафона',
      },
    ],
  },
  kk: {
    eyebrow: 'ӨЗГЕРІС МАРШРУТЫ · АСТАНА БОЙЫМЕН 42.2 КМ',
    heading: 'Төмен жылжытыңыз — Расулмен бірге 42.2 шақырымды өтіңіз',
    sub: '207 келі салмақпен түнгі стадионнан бастап, JANA MEN лагері мен Астананың басты нысандары арқылы нағыз марафон мәресіне дейін.',
    kmUnit: 'КМ',
    kgUnit: 'КГ',
    finishLabel: 'МӘРЕ 42.2',
    milestones: [
      {
        km: '00.0 КМ',
        kg: '207 КГ',
        landmark: 'АСТАНА АРЕНА · БАСТАУ',
        title: 'Қызғылт-сары жилеттегі «көрінбейтін» жан',
        body: 'Стадион астындағы шағын бөлме, Джеки Чан постерлері және әр қадамдағы ауыр тыныс. Түнгі жүгіру жолындағы кездейсоқ оқиға Расулдың өмірін түбегейлі өзгертеді.',
        image: './stills/still_stadium_vest.jpg',
        caption: 'I Акт · Түнгі стадион',
      },
      {
        km: '14.5 КМ',
        kg: '182 КГ',
        landmark: 'ЕСІЛ КӨПІРІ · JANA MEN ЛАГЕРІ',
        title: 'Жігер сынағы және бауырмалдық',
        body: 'Бөтен есіммен JANA MEN лагеріне түскен Расул қатал жаттығулардан өтеді. Тәлімгер Айтым сылтауды қабылдамайды, ал Эльвира оған өзіне сенуді үйретеді.',
        image: './stills/still_janamen_orange_lineup.jpg',
        caption: 'II Акт · IBA JANA MEN қозғалысының нақты қатысушылары',
      },
      {
        km: '28.0 КМ',
        kg: '158 КГ',
        landmark: 'БӘЙТЕРЕК · ХАН ШАТЫР · ПИРАМИДА',
        title: 'Жаңа тыныс және күнделік шындығы',
        body: 'Артық салмақпен бірге қорқыныш та кетеді. Айнаға алғаш рет ұялмай қараған Расул Артём туралы ащы шындықты біліп, өз таңдауын жасайды.',
        image: './stills/still_dulyga_blinds.jpg',
        caption: 'III Акт · Абырой мен таңдау',
      },
      {
        km: '42.2 КМ',
        kg: '135 КГ',
        landmark: 'EXPO «НҰР ӘЛЕМ» · МӘРЕ АРКАСЫ',
        title: 'Мәреге 10 метр қалғандағы шешім',
        body: 'Мыңдаған желаяқ қатысқан нағыз Астана марафоны. Мәреге 10 метр қалғанда Расул медальдан бас тартып, Юляны құтқару үшін кері бұрылады.',
        image: './stills/still_finish_arch.jpg',
        caption: 'Финал · Нағыз Астана марафонындағы түсірілім',
      },
    ],
  },
  en: {
    eyebrow: 'THE 42.2 KM TRANSFORMATION ROUTE · ASTANA',
    heading: 'Scroll down to run the distance with Rasul',
    sub: 'Follow his physical and emotional transformation from 207 kg at the night stadium past Astana’s iconic skyline to the live marathon finish arch.',
    kmUnit: 'KM',
    kgUnit: 'KG',
    finishLabel: 'FINISH 42.2',
    milestones: [
      {
        km: '00.0 KM',
        kg: '207 KG',
        landmark: 'ASTANA ARENA · START LINE',
        title: 'The Invisible Man in an Orange Vest',
        body: 'A basement room lined with 1980s Jackie Chan posters and breathless midnight shifts. One accidental tragedy on the night track ignites a journey he never planned.',
        image: './stills/still_stadium_vest.jpg',
        caption: 'Act I · Night Stadium, Astana',
      },
      {
        km: '14.5 KM',
        kg: '182 KG',
        landmark: 'ISHIM BRIDGE · JANA MEN CAMP',
        title: 'Breaking Self-Pity & Finding Brotherhood',
        body: 'Under a borrowed name, Rasul enters the relentless JANA MEN weight-loss camp. Mentor Aitym strips away excuses while Elvira teaches him to tie his laces and stand tall.',
        image: './stills/still_janamen_orange_lineup.jpg',
        caption: 'Act II · Real IBA JANA MEN Movement Alumni',
      },
      {
        km: '28.0 KM',
        kg: '158 KG',
        landmark: 'BAITEREK · KHAN SHATYR · PYRAMID',
        title: 'Reclaiming Dignity & Facing the Truth',
        body: 'As the weight drops, so does the shame. Seeing himself in a mirror with pride for the first time, Rasul uncovers Artyom’s real past—and chooses to run for the living.',
        image: './stills/still_dulyga_blinds.jpg',
        caption: 'Act III · Pride and Choice',
      },
      {
        km: '42.2 KM',
        kg: '135 KG',
        landmark: 'EXPO NUR ALEM · FINISH ARCH',
        title: 'Turning Back 10 Meters From Glory',
        body: 'Shot live inside the real Astana Marathon. Ten meters from the finish arch, Rasul turns against the crowd to save Yulia from an asthma attack—finally claiming his own name.',
        image: './stills/still_finish_arch.jpg',
        caption: 'Finale · Live Astana Marathon Capture',
      },
    ],
  },
  zh: {
    eyebrow: '阿斯塔纳 42.2 公里蜕变路线 · 随滚动奔跑',
    heading: '向下滑动，陪拉苏尔一起跑完 42.2 公里',
    sub: '从207公斤的深夜体育场出发，穿越 JANA MEN 减重营与阿斯塔纳地标天际线，一路蜕变奔向万人马拉松终点拱门。',
    kmUnit: '公里',
    kgUnit: '公斤',
    finishLabel: '终点 42.2',
    milestones: [
      {
        km: '00.0 公里',
        kg: '207 公斤',
        landmark: '阿斯塔纳竞技场 · 起点',
        title: '身着橙色背心的“透明人”',
        body: '贴满80年代成龙与李小龙海报的看台储物间，每一步都沉重喘息。深夜跑道上的一场意外，彻底改写了他的人生轨迹。',
        image: './stills/still_stadium_vest.jpg',
        caption: '第一幕 · 深夜体育场',
      },
      {
        km: '14.5 公里',
        kg: '182 公斤',
        landmark: '伊希姆河大桥 · JANA MEN 训练营',
        title: '撕碎自怜，遇见热血兄弟连',
        body: '化名进入严苛的 JANA MEN 减重营后，导师艾特姆拒绝一切借口，管理员艾尔薇拉耐心教他系紧鞋带、重拾做人的尊严。',
        image: './stills/still_janamen_orange_lineup.jpg',
        caption: '第二幕 · IBA JANA MEN 真实学员本色出演',
      },
      {
        km: '28.0 公里',
        kg: '158 公斤',
        landmark: '巴伊杰列克观景塔 · 可汗之帐 · 和平宫',
        title: '轻盈呼吸与日记背后的真相',
        body: '随着体重一层层褪去，拉苏尔第一次自信地直视镜中的自己。在得知阿尔乔姆的真实过去后，他决定不再为虚幻传说而跑。',
        image: './stills/still_dulyga_blinds.jpg',
        caption: '第三幕 · 尊严与觉醒',
      },
      {
        km: '42.2 公里',
        kg: '135 公斤',
        landmark: '世博球形馆 · 万人马拉松终点拱门',
        title: '距离终点10米的逆流转身',
        body: '阿斯塔纳官方万人马拉松实景拍摄。在触手可及的终点线前10米，拉苏尔毅然转身救下哮喘发作的尤莉亚，真正成为自己人生的主角。',
        image: './stills/still_finish_arch.jpg',
        caption: '高潮终章 · 万人马拉松真实赛场跟拍',
      },
    ],
  },
};

/* Architectural Line-Art Landmarks of Astana (Editorial Thin-Line Ink Style) */
const LandmarkIllustration: React.FC<{ index: number; active: boolean }> = ({ index, active }) => {
  const stroke = active ? '#0F2342' : '#94A3B8';
  const accent = active ? '#E61E2A' : '#CBD5E1';
  const sky = active ? '#2563EB' : '#CBD5E1';

  if (index === 0) {
    // Astana Arena Stadium + Night Floodlights + Running Track
    return (
      <svg viewBox="0 0 220 96" className="w-44 sm:w-52 h-auto transition-all duration-500" fill="none">
        {/* Floodlight towers */}
        <path d="M26 78 L32 22 M22 22 L42 22 M25 27 L39 27" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
        <path d="M194 78 L188 22 M178 22 L198 22 M181 27 L195 27" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="32" cy="18" r="3" fill={accent} />
        <circle cx="188" cy="18" r="3" fill={accent} />
        {/* Astana Arena iconic curved roof */}
        <path
          d="M42 74 C52 34, 168 34, 178 74 Z"
          stroke={stroke}
          strokeWidth="2"
          fill={active ? 'rgba(37, 99, 235, 0.06)' : 'none'}
        />
        <path d="M58 74 C68 44, 152 44, 162 74" stroke={sky} strokeWidth="1.3" strokeDasharray="4 3" />
        <path d="M84 52 L84 74 M110 46 L110 74 M136 52 L136 74" stroke={stroke} strokeWidth="1.2" opacity="0.65" />
        {/* Track lanes */}
        <path d="M12 82 Q110 74 208 82" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M18 89 Q110 81 202 89" stroke={stroke} strokeWidth="1.1" strokeDasharray="5 4" opacity="0.5" />
      </svg>
    );
  }

  if (index === 1) {
    // Ishim River Arch Bridge + JANA MEN Camp
    return (
      <svg viewBox="0 0 220 96" className="w-44 sm:w-52 h-auto transition-all duration-500" fill="none">
        {/* Iconic Astana pedestrian bridge arch */}
        <path d="M14 66 L206 66" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        <path d="M30 66 Q110 12 190 66" stroke={stroke} strokeWidth="2.2" />
        <path d="M52 66 Q110 26 168 66" stroke={sky} strokeWidth="1.3" />
        {/* Suspension cables */}
        <path
          d="M66 47 L66 66 M88 37 L88 66 M110 34 L110 66 M132 37 L132 66 M154 47 L154 66"
          stroke={stroke}
          strokeWidth="1.1"
          opacity="0.7"
        />
        <circle cx="110" cy="34" r="3.5" fill={accent} />
        {/* Ishim River waves */}
        <path d="M22 77 Q52 71 82 77 T142 77 T202 77" stroke={sky} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M38 86 Q68 81 98 86 T158 86 T194 86" stroke={sky} strokeWidth="1.1" opacity="0.55" strokeLinecap="round" />
      </svg>
    );
  }

  if (index === 2) {
    // Baiterek Tower + Khan Shatyr Tent + Pyramid of Peace
    return (
      <svg viewBox="0 0 240 104" className="w-48 sm:w-56 h-auto transition-all duration-500" fill="none">
        {/* Khan Shatyr tilted spire (left) */}
        <path
          d="M14 90 L46 36 L82 90 Z"
          stroke={stroke}
          strokeWidth="1.7"
          fill={active ? 'rgba(37, 99, 235, 0.05)' : 'none'}
        />
        <path d="M46 36 L58 22 M34 90 L46 36 M58 90 L46 36" stroke={sky} strokeWidth="1.1" opacity="0.75" />

        {/* Baiterek Monument (center) */}
        <path d="M108 90 L114 42 M132 90 L126 42 M120 90 L120 44" stroke={stroke} strokeWidth="1.8" />
        <path d="M102 36 C106 44, 134 44, 138 36" stroke={stroke} strokeWidth="1.6" />
        <path d="M100 28 C108 42, 132 42, 140 28" stroke={stroke} strokeWidth="1.5" />
        <circle
          cx="120"
          cy="24"
          r="10"
          stroke={accent}
          strokeWidth="2"
          fill={active ? 'rgba(245, 158, 11, 0.22)' : 'none'}
        />

        {/* Pyramid — Palace of Peace (right) */}
        <path
          d="M164 90 L196 44 L228 90 Z"
          stroke={stroke}
          strokeWidth="1.7"
          fill={active ? 'rgba(15, 35, 66, 0.05)' : 'none'}
        />
        <path d="M180 67 L212 67 M172 78 L220 78 M196 44 L196 90" stroke={sky} strokeWidth="1" opacity="0.65" />
        <line x1="8" y1="90" x2="232" y2="90" stroke={stroke} strokeWidth="1.4" opacity="0.45" />
      </svg>
    );
  }

  // EXPO Sphere "Nur Alem" + Astana Marathon 42.2 Finish Arch
  return (
    <svg viewBox="0 0 230 100" className="w-48 sm:w-56 h-auto transition-all duration-500" fill="none">
      {/* EXPO Nur Alem Glass Sphere (left) */}
      <circle
        cx="60"
        cy="54"
        r="28"
        stroke={stroke}
        strokeWidth="1.8"
        fill={active ? 'rgba(37, 99, 235, 0.06)' : 'none'}
      />
      <ellipse cx="60" cy="54" rx="12" ry="28" stroke={sky} strokeWidth="1.1" opacity="0.7" />
      <path d="M33 46 L87 46 M33 62 L87 62" stroke={sky} strokeWidth="1.1" opacity="0.6" />
      <path d="M44 82 L76 82" stroke={stroke} strokeWidth="2" />

      {/* Marathon Finish Arch 42.2 (right) */}
      <path d="M116 86 L116 32 Q164 16 212 32 L212 86" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M116 40 Q164 26 212 40" stroke={accent} strokeWidth="2.2" />
      {/* Ribbon across finish line */}
      <path d="M122 68 Q164 62 206 68" stroke={accent} strokeWidth="2.4" strokeDasharray="6 3" />
      <text x="164" y="34" textAnchor="middle" fill={stroke} fontSize="10" fontFamily="monospace" fontWeight="700">
        42.2 KM
      </text>
      <line x1="16" y1="86" x2="220" y2="86" stroke={stroke} strokeWidth="1.4" opacity="0.45" />
    </svg>
  );
};

/* Dynamic Illustrated Runner Who Visually Slims Down From 207 KG -> 135 KG as You Scroll! */
const SlimmingRunnerFigure: React.FC<{ progress: number }> = ({ progress }) => {
  const p = Math.max(0, Math.min(1, progress));
  // Real running stride cycle driven smoothly by scroll distance
  const stride = Math.sin(p * 38);
  const strideOpp = Math.sin(p * 38 + Math.PI);

  // Body transformation math: wide heavy silhouette (207kg) -> lean athletic runner (135kg)
  const bellyRx = 14.5 - p * 7.8; // 14.5 -> 6.7
  const torsoWidth = 24 - p * 12; // 24 -> 12
  const postureLean = 14 - p * 5; // Heavy hunched forward -> confident athletic lean
  const isFinished = p > 0.96;

  // Outfit morphs along the film's exact 3-act wardrobe:
  // Act 1 (0–0.32): Orange janitor vest | Act 2 (0.32–0.65): JANA MEN crimson/orange tee | Act 3 (0.65–1.0): Marathon Royal Blue jacket
  const jerseyColor = p < 0.34 ? '#F97316' : p < 0.66 ? '#E61E2A' : '#1D4ED8';
  const stripeColor = p < 0.34 ? '#FEF08A' : '#FFFFFF';

  const leg1Angle = isFinished ? -8 : stride * 34;
  const leg2Angle = isFinished ? 8 : strideOpp * 34;
  const arm1Angle = isFinished ? -145 : strideOpp * 36;
  const arm2Angle = isFinished ? -135 : stride * 36;

  return (
    <svg viewBox="0 0 80 88" className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-[0_8px_18px_rgba(15,35,66,0.24)]" fill="none">
      {/* Ground shadow gets tighter & lighter as Rasul slims down */}
      <ellipse cx="40" cy="80" rx={22 - p * 8} ry="4" fill="rgba(15, 35, 66, 0.16)" />

      <g transform={`translate(40, 44) rotate(${isFinished ? 0 : postureLean})`}>
        {/* Back Leg */}
        <g transform={`translate(-2, 10) rotate(${leg2Angle})`}>
          <path d="M0 0 L-3 13 L-9 23" stroke="#0F2342" strokeWidth={5.2 - p * 1.4} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-9 23 L-2 25" stroke="#E61E2A" strokeWidth="3.2" strokeLinecap="round" />
        </g>

        {/* Front Leg */}
        <g transform={`translate(3, 10) rotate(${leg1Angle})`}>
          <path d="M0 0 L5 13 L1 24" stroke="#0F2342" strokeWidth={5.4 - p * 1.4} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M1 24 L9 25" stroke="#E61E2A" strokeWidth="3.2" strokeLinecap="round" />
        </g>

        {/* Back Arm */}
        <g transform={`translate(-4, -10) rotate(${arm2Angle})`}>
          <path d="M0 0 L-7 11 L-1 17" stroke="#1E3A5F" strokeWidth={4.4 - p * 1.1} strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Torso / Belly that visibly slims down from 207 kg to 135 kg */}
        <ellipse
          cx={2 - p * 1.5}
          cy={-1}
          rx={bellyRx}
          ry={15.5 - p * 1.2}
          fill={jerseyColor}
          stroke="#0F2342"
          strokeWidth="2.2"
        />
        {/* Reflective vest stripe (Act 1) or Marathon Bib #261 (Act 3) */}
        {p < 0.34 ? (
          <path
            d={`M${-torsoWidth * 0.42} 2 L${torsoWidth * 0.48} 2`}
            stroke={stripeColor}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        ) : p >= 0.66 ? (
          <rect x="-3.5" y="-5" width="9" height="8" rx="1.5" fill="#FFFFFF" stroke="#0F2342" strokeWidth="1" />
        ) : null}

        {/* Head */}
        <circle cx="3" cy="-22" r={8.2 - p * 1.1} fill="#F8FAFC" stroke="#0F2342" strokeWidth="2.2" />
        {/* Hair cap */}
        <path d="M-4 -25 Q3 -32 10 -24" stroke="#0F2342" strokeWidth="3" strokeLinecap="round" />

        {/* Front Arm */}
        <g transform={`translate(4, -9) rotate(${arm1Angle})`}>
          <path d="M0 0 L8 10 L13 5" stroke="#0F2342" strokeWidth={4.6 - p * 1.1} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  );
};

export const AstanaMarathonJourney: React.FC<AstanaMarathonJourneyProps> = ({ lang }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [runnerPt, setRunnerPt] = useState<{ x: number; y: number }>({ x: 100, y: 20 });
  const [pathLen, setPathLen] = useState<number>(1200);

  const copy = JOURNEY_COPY[lang];

  useEffect(() => {
    if (pathRef.current) {
      setPathLen(pathRef.current.getTotalLength());
    }
  }, []);

  useEffect(() => {
    let rafId = 0;

    const updateProgress = () => {
      rafId = 0;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Keep the slimming runner right around viewport eye-level from Start (0 km) to Finish (42.2 km)
      const startOffset = vh * 0.22;
      const totalScrollable = Math.max(1, rect.height - vh * 0.78);
      const passed = startOffset - rect.top;
      const next = Math.max(0, Math.min(1, passed / totalScrollable));
      setProgress(next);

      if (pathRef.current) {
        const len = pathRef.current.getTotalLength();
        const pt = pathRef.current.getPointAtLength(next * len);
        setRunnerPt({ x: pt.x, y: pt.y });
      }
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const currentKm = (progress * 42.2).toFixed(1);
  const currentKg = Math.round(207 - progress * 72); // 207 KG -> 135 KG

  return (
    <section
      id="journey"
      ref={sectionRef}
      data-testid="astana-marathon-journey"
      className="relative bg-[#F5F7FB] text-[#0B172A] py-20 sm:py-28 overflow-hidden"
    >
      {/* Subtle Architectural Blueprint Grid Texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.42]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(15, 35, 66, 0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 35, 66, 0.045) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 max-w-[1320px] mx-auto px-4 sm:px-8">
        {/* Section Editorial Header */}
        <div className="max-w-3xl mx-auto text-center mb-14 sm:mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#E61E2A]">
            <span className="w-2 h-2 rounded-full bg-[#E61E2A]" />
            <span>{copy.eyebrow}</span>
          </div>
          <h2 className="font-unbounded font-black text-2xl sm:text-4xl lg:text-[42px] text-[#0B172A] leading-[1.12] tracking-[-0.02em]">
            {copy.heading}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {copy.sub}
          </p>
        </div>

        {/* Sticky Live Transformation Progress Bar (Solid Deep Navy — High Contrast!) */}
        <div className="sticky top-20 z-30 flex justify-center mb-10 pointer-events-none">
          <div
            data-testid="marathon-live-meter"
            className="inline-flex items-center gap-3 sm:gap-5 px-4 sm:px-6 py-2.5 rounded-full bg-[#060B14] text-white shadow-[0_12px_32px_rgba(6,11,20,0.32)] border border-white/15 font-mono text-[11px] sm:text-xs"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#E61E2A]" />
              <strong className="text-white tabular-nums">{currentKm}</strong>
              <span className="text-slate-400">/ 42.2 {copy.kmUnit}</span>
            </span>
            <span className="text-white/20">|</span>
            <span className="flex items-center gap-1.5">
              <strong className="text-[#38BDF8] tabular-nums">{currentKg}</strong>
              <span className="text-slate-400">{copy.kgUnit}</span>
            </span>
            <span className="hidden sm:inline-block w-24 h-1.5 rounded-full bg-white/15 overflow-hidden">
              <span
                className="block h-full bg-[#E61E2A] rounded-full"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </span>
          </div>
        </div>

        {/* ==================== VERTICAL ILLUSTRATED ASTANA MARATHON ROUTE ==================== */}
        <div className="relative">
          {/* Desktop Center Winding Marathon Route SVG + Slimming Animated Runner */}
          <div
            className="hidden lg:block pointer-events-none absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[200px] z-10"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 200 1000"
              preserveAspectRatio="none"
              className="w-full h-full overflow-visible"
            >
              {/* Faint architectural dashed route base */}
              <path
                d="M 100 16 C 175 150, 25 320, 100 490 C 175 660, 25 830, 100 984"
                fill="none"
                stroke="#CBD5E1"
                strokeWidth="4"
                strokeDasharray="8 8"
                strokeLinecap="round"
              />
              {/* Active Red Marathon Path Drawing Dynamically With Scroll */}
              <path
                ref={pathRef}
                d="M 100 16 C 175 150, 25 320, 100 490 C 175 660, 25 830, 100 984"
                fill="none"
                stroke="#E61E2A"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeDasharray={pathLen}
                strokeDashoffset={Math.max(0, pathLen * (1 - progress))}
              />
              {/* Start & Finish Route Pins */}
              <circle cx="100" cy="16" r="7" fill="#0F2342" stroke="#FFFFFF" strokeWidth="2.5" />
              <circle cx="100" cy="984" r="8" fill="#E61E2A" stroke="#FFFFFF" strokeWidth="2.5" />
            </svg>

            {/* Moving Slimming Runner Locked to Exact Point Along the Winding Route! */}
            <div
              data-testid="marathon-slimming-runner"
              className="absolute -ml-10 -mt-12 will-change-transform"
              style={{
                left: `${(runnerPt.x / 200) * 100}%`,
                top: `${(runnerPt.y / 1000) * 100}%`,
              }}
            >
              <SlimmingRunnerFigure progress={progress} />
            </div>
          </div>

          {/* Mobile Left-Rail Marathon Track + Slimming Runner */}
          <div
            className="lg:hidden pointer-events-none absolute top-2 bottom-2 left-4 w-12 z-10"
            aria-hidden="true"
          >
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-300" />
            <div
              className="absolute left-5 top-0 w-0.5 bg-[#E61E2A]"
              style={{ height: `${Math.round(progress * 100)}%` }}
            />
            <div
              className="absolute -left-2.5 -mt-8 will-change-transform"
              style={{ top: `${Math.max(2, Math.min(95, progress * 100))}%` }}
            >
              <SlimmingRunnerFigure progress={progress} />
            </div>
          </div>

          {/* 4 Editorial Story Stops Along Astana's Iconic Landmarks */}
          <div className="space-y-16 sm:space-y-28 lg:space-y-32 pl-14 lg:pl-0">
            {copy.milestones.map((m, idx) => {
              const isReached = progress >= idx * 0.27 - 0.04;
              const isLeftText = idx % 2 === 0;

              return (
                <div
                  key={m.km}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-center relative"
                >
                  {/* Story & Astana Landmark Side */}
                  <div
                    className={`lg:col-span-5 space-y-4 ${
                      isLeftText ? 'lg:order-1 lg:pr-8' : 'lg:order-3 lg:pl-8'
                    }`}
                  >
                    {/* Hand-drawn Architectural Landmark of Astana */}
                    <div className="inline-block">
                      <LandmarkIllustration index={idx} active={isReached} />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em]">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#E61E2A] text-white">
                        {m.km}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#0F2342] text-white">
                        {m.kg}
                      </span>
                      <span className="text-slate-500">{m.landmark}</span>
                    </div>

                    <h3 className="font-unbounded font-bold text-xl sm:text-2xl lg:text-[26px] text-[#0B172A] leading-snug">
                      {m.title}
                    </h3>

                    <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed">
                      {m.body}
                    </p>
                  </div>

                  {/* Center Route Spacer (Desktop) */}
                  <div className="hidden lg:block lg:col-span-2 lg:order-2" />

                  {/* Clean Cinema Film Still Side (Borderless Editorial Photo!) */}
                  <div
                    className={`lg:col-span-5 ${
                      isLeftText ? 'lg:order-3 lg:pl-8' : 'lg:order-1 lg:pr-8'
                    }`}
                  >
                    <figure className="group">
                      <div className="overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(11,23,42,0.16)] bg-[#060B14]">
                        <img
                          src={m.image}
                          alt={m.title}
                          className="w-full aspect-[16/10] object-cover group-hover:scale-[1.03] transition-transform duration-700"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <figcaption className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500 flex items-center justify-between">
                        <span>{m.caption}</span>
                        <span className="text-[#E61E2A] font-semibold">35MM</span>
                      </figcaption>
                    </figure>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
