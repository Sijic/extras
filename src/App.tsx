import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import {
  Volume2,
  VolumeX,
  Play,
  Sparkles,
  FileDown,
  Copy,
  Check,
  Mail,
  Phone,
  Instagram,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Disc,
  Award,
  CheckCircle2,
  Clock,
  Ticket,
} from 'lucide-react';
import {
  CAST_DATA,
  ENSEMBLE_CAST_DATA,
  KEY_CREW_DATA,
  FULL_CREDITS_DATA,
} from './data/filmData';
import { SITE_MODE, CONTACT_CONFIG } from './config/siteConfig';
import { soundEngine } from './utils/soundEngine';
import { IshimWaterCanvas } from './components/IshimWaterCanvas';
import { SosHudWidget } from './components/SosHudWidget';
import { DiaryXrayScanner } from './components/DiaryXrayScanner';
import { CinemaLookbookSection } from './components/CinemaLookbookSection';
import { PromoPlayerModal, UILang } from './components/PromoPlayerModal';

gsap.registerPlugin(ScrollTrigger);

const LANG_OPTIONS: Array<{ code: UILang; label: string }> = [
  { code: 'en', label: 'EN' },
  { code: 'zh', label: '中文' },
  { code: 'ru', label: 'RU' },
];

interface PageCopy {
  docTitle: string;
  filmTitle: string;
  studioLine: string;
  genre: string;
  slateMeta: string;
  statusText: string;
  releaseText: string;
  headerPromoBtn: string;
  headerDeckBtn: string;
  headerTicketsBtn: string;
  heroPitch: string;
  heroHook: string;
  heroPromoBtn: string;
  heroDeckBtn: string;
  heroTicketsBtn: string;
  heroBridgeTag: string;
  heroBridgeBody: string;
  laceTag: string;
  laceTitle: string;
  laceDesc: string;
  scalesTag: string;
  scalesTitle: string;
  scalesDesc: string;
  panLeftWeight: string;
  panLeftSub: string;
  panLeftTitle: string;
  panLeftBody: string;
  panRightWeight: string;
  panRightSub: string;
  panRightTitle: string;
  panRightBody: string;
  castTag: string;
  castTitle: string;
  castSub: string;
  ensembleTag: string;
  ensembleTitle: string;
  expandCredits: string;
  collapseCredits: string;
  salesTag: string;
  salesTitle: string;
  salesSub: string;
  specsHeading: string;
  specs: Array<{ k: string; v: string; sub: string; accent?: boolean }>;
  compsHeading: string;
  comps: Array<{ tag: string; metric: string; title: string; body: string }>;
  roadmapHeading: string;
  roadmap: Array<{ phase: string; badge: string; active?: boolean; title: string; body: string }>;
  dealTag: string;
  dealTitle: string;
  dealBody: string;
  dealPills: string[];
  musicTag: string;
  musicTitle: string;
  musicBody: string;
  musicHighlight: string;
  contactRole: string;
  contactLocation: string;
  contactWechatNote: string;
  contactInstaNote: string;
  contactCopy: string;
  contactCopied: string;
  contactDomainLabel: string;
  contactChainLabel: string;
  deckGalleryTag: string;
  deckGalleryTitle: string;
  deckPrimaryBtn: string;
  deckSecondaryBtn: string;
  deckSlideLabel: string;
  footerRights: string;
  chapters: Array<{ id: string; num: string; label: string }>;
}

const COPY: Record<UILang, PageCopy> = {
  en: {
    docTitle: 'NOT EXTRA — Official International Sales & Distribution Website (Spring 2027)',
    filmTitle: 'NOT EXTRA',
    studioLine: 'BIG MOVIE STUDIO · IBA JANA MEN',
    genre: 'INSPIRATIONAL SPORTS DRAMEDY · FEATURE FILM',
    slateMeta: '2.39:1 SCOPE · 24 FPS · 4K DCP',
    statusText: 'POST-PRODUCTION (ROUGH CUT IN PROGRESS)',
    releaseText: 'THEATRICAL RELEASE: SPRING 2027',
    headerPromoBtn: 'Watch 3-Min Promo',
    headerDeckBtn: 'Pitch Deck PDF',
    headerTicketsBtn: 'Buy Tickets',
    heroPitch: 'The most unlikely man against the hardest distance.',
    heroHook:
      'A 207-kg invisible stadium janitor steals a dead marathoner’s identity, enters a brutal weight-loss camp, and runs the 42.2 km Astana Marathon—turning back 10 meters from the finish line to save a life.',
    heroPromoBtn: 'Watch 3-Min Subtitled Promo',
    heroDeckBtn: 'Download China Pitch Deck (PDF)',
    heroTicketsBtn: 'Book Cinema Tickets (Spring 2027)',
    heroBridgeTag: 'ASIAN & GLOBAL AUDIENCE HOOK',
    heroBridgeBody:
      'Authentic physical weight-loss transformation inspired by the massive wave of “YOLO” meets the emotional redemption of “The Whale” and the warm underdog spirit of classic 1980s Hong Kong action cinema.',
    laceTag: 'SCENE 02 · TACTILE METAPHOR',
    laceTitle: 'The Untied Shoelace & 10 Meters of Eternity',
    laceDesc:
      'An untied shoelace on the night track triggers the tragedy. Inside the camp, Elvira becomes the first person to teach a 207-kg adult how to tie a secure double knot—restoring his dignity step by step.',
    scalesTag: 'SCENE 03 · BRASS SCALES & X-RAY DIARY',
    scalesTitle: '“Your fear and resentment weigh more than your 200 kilograms.”',
    scalesDesc:
      'Mentor Aitym Zhakupov confronts Rasul with antique apothecary scales: 207 kg of childhood trauma versus 1 gram of pure honesty.',
    panLeftWeight: '207 KG',
    panLeftSub: 'TRAUMA & FEAR',
    panLeftTitle: 'PAN I · ARMOR OF FEAR',
    panLeftBody: 'Childhood shame, sleep apnea, a stolen identity, and running away from reality.',
    panRightWeight: '1 GRAM',
    panRightSub: 'PURE HONESTY',
    panRightTitle: 'PAN II · HONESTY OF SPIRIT',
    panRightBody: 'Camp discipline, real physical endurance, and turning back to save a life.',
    castTag: 'CAST & CREATIVE POWERHOUSE',
    castTitle: 'Screen Stars & Filmmakers',
    castSub: 'Confirmed lead cast, 23 real faces from the film, and full verified crew departments.',
    ensembleTag: 'FULL ENSEMBLE CAST',
    ensembleTitle: 'Supporting Cast, Champion Cameos & Real JANA MEN Alumni',
    expandCredits: 'Expand Full Official Crew Credits Roll',
    collapseCredits: 'Collapse Full Crew Credits',
    salesTag: 'INTERNATIONAL SALES & GREATER CHINA BUYERS ROOM',
    salesTitle: 'Distribution Rights, Specs & Direct Producer Desk',
    salesSub:
      'All Greater China and international theatrical, VOD, TV, and festival rights held directly by Big Movie Studio. Clean chain of title.',
    specsHeading: 'TECHNICAL & MARKET PASSPORT',
    specs: [
      { k: 'TITLES', v: 'NOT EXTRA', sub: 'Original: Ne Lishniye' },
      { k: 'GENRE', v: 'Sports Dramedy', sub: 'Uplifting Human Drama', accent: true },
      { k: 'MASTER FORMAT', v: '4K DCP · 2.39:1', sub: '4096 × 1716 · 24 fps DI' },
      { k: 'AUDIO & STEMS', v: '5.1 & Dolby Atmos', sub: 'Full M&E for Dubbing' },
      { k: 'RUNTIME & ORIGIN', v: '~115 min · KZ', sub: 'Big Movie Studio × JANA MEN' },
      { k: 'DELIVERY', v: 'Spring 2027', sub: 'March – May 2027 (EN/ZH)', accent: true },
    ],
    compsHeading: 'MARKET COMPARABLES & BOX-OFFICE PROOF',
    comps: [
      {
        tag: 'COMP 01 · ASIA HIT',
        metric: '$480M+ CHINA BO',
        title: 'YOLO (2024)',
        body: 'Proves real actor weight-loss transformation and “win once for yourself” redemption drives blockbuster theatrical word-of-mouth.',
      },
      {
        tag: 'COMP 02 · A24 PRESTIGE',
        metric: '2× OSCARS · $55M+',
        title: 'THE WHALE (2022)',
        body: 'Deep psychological gravity of a 200-kg recluse seeking forgiveness—elevated here with a warm, uplifting marathon climax.',
      },
      {
        tag: 'COMP 03 · SAME WRITER',
        metric: '#1 CIS BOX OFFICE',
        title: 'I AM LOSING WEIGHT',
        body: 'Written by the exact same screenwriter Konstantin Mayer—bringing proven crowd-pleasing humor and commercial pacing.',
      },
    ],
    roadmapHeading: 'POST-PRODUCTION & DELIVERY ROADMAP',
    roadmap: [
      {
        phase: 'PHASE 01 · AUG–OCT 2026',
        badge: 'WRAPPED',
        title: 'Principal Photography & Live Astana Marathon',
        body: '100% live-action shooting completed in Astana, including real JANA MEN weight-loss camp capture and live marathon crowds.',
      },
      {
        phase: 'PHASE 02 · NOV 2026 – WINTER',
        badge: 'ACTIVE NOW',
        active: true,
        title: 'Rough Cut Review → VFX, Score, 5.1 Mix & DI',
        body: 'Rough Cut assembly review open for acquisition executives. Winter 2026/27: bridge VFX, orchestral score, 5.1/Atmos mix & DI color.',
      },
      {
        phase: 'PHASE 03 · MAR–MAY 2027',
        badge: 'SPRING 2027',
        title: '4K DCP Delivery (EN/ZH Subs) & World Premiere',
        body: 'Delivery of theatrical 4K DCP, English & Chinese subtitled masters, complete M&E stems, and official theatrical launch.',
      },
    ],
    dealTag: 'COMMERCIAL PARTNERSHIP & RIGHTS',
    dealTitle: 'Greater China & International Rights Open',
    dealBody:
      'All rights available for Mainland China, Hong Kong, Macau, Taiwan, and global territories (Theatrical, SVOD/VOD, TV, In-Flight). Flexible Early Pre-Buy, Co-Distribution, and MOU structures open now.',
    dealPills: ['MAINLAND CHINA', 'HONG KONG & MACAU', 'TAIWAN', 'PRE-BUY / MOU READY'],
    musicTag: 'FLAGSHIP OST CO-MARKETING',
    musicTitle: '“Ya Eto Ty” (“I Am You”) × Dimash Qudaibergen',
    musicBody:
      'Official adaptation rights cleared with Murat Nasyrov’s heirs. Exclusive co-marketing opportunity for China partners to co-produce a Mandarin/Bilingual theme song with Dimash Qudaibergen or a top Chinese vocal star.',
    musicHighlight:
      'Official music rights cleared — ready for localized Mandarin OST single & viral Douyin / Weibo campaign.',
    contactRole: 'Showrunner & Lead Producer · Direct Acquisition Desk',
    contactLocation: 'BIG MOVIE STUDIO · ASTANA, KAZAKHSTAN',
    contactWechatNote: 'Direct Phone & WeChat ID Available upon Request',
    contactInstaNote: 'Official Film Instagram',
    contactCopy: 'COPY',
    contactCopied: 'COPIED',
    contactDomainLabel: 'DOMAIN: EXTRAS.SIJICBOND.SITE',
    contactChainLabel: 'CHAIN OF TITLE: CLEAN',
    deckGalleryTag: 'OFFICIAL ACQUISITION DECK PREVIEWS',
    deckGalleryTitle: 'Greater China Pitch Deck (12 Slides)',
    deckPrimaryBtn: 'Download Greater China Deck (PDF)',
    deckSecondaryBtn: 'Visual Cast Deck (RU PDF)',
    deckSlideLabel: 'SLIDE',
    footerRights: '© 2026–2027 Big Movie Studio & IBA JANA MEN Movement (Astana, Kazakhstan). All Rights Reserved.',
    chapters: [
      { id: 'hero', num: '01', label: 'PROLOGUE' },
      { id: 'diary', num: '02', label: 'STORY' },
      { id: 'lookbook', num: '03', label: 'LOOKBOOK' },
      { id: 'cast', num: '04', label: 'CAST' },
      { id: 'sales', num: '05', label: 'BUYERS' },
    ],
  },

  zh: {
    docTitle: '《绝不多余》 / 《并非多余》 — 官方大中华区发行与审片平台 (2027年春季)',
    filmTitle: '《绝不多余》',
    studioLine: 'BIG MOVIE STUDIO · IBA JANA MEN',
    genre: '励志体育轻喜剧 / 剧情片 · 院线长片',
    slateMeta: '2.39:1 宽银幕 · 24帧 · 4K DCP',
    statusText: '后期制作阶段（粗剪进行中）',
    releaseText: '院线公映档期：2027年春季',
    headerPromoBtn: '观看3分钟推介片',
    headerDeckBtn: '下载推介手册',
    headerTicketsBtn: '预订影票',
    heroPitch: '200公斤。42.2公里。你无法逃避过去，但你可以选择背负怎样的重量前行。',
    heroHook:
      '一名体重207公斤、被视作“透明人”的体育场清洁工，冒用逝去跑者的身份进入严苛减重营，踏上阿斯塔纳42.2公里全程马拉松赛道——在距离终点10米处毅然转身救人。',
    heroPromoBtn: '播放3分钟中文字幕推介片',
    heroDeckBtn: '下载大中华区推介手册 (PDF)',
    heroTicketsBtn: '预订2027年春季影院观影票',
    heroBridgeTag: '中哈文化共鸣 · 院线破圈基因',
    heroBridgeBody:
      '兼具《热辣滚烫》真实燃魂的减重蜕变共鸣、《鲸》直击人心的父女救赎深度，以及80年代成龙、李小龙黄金香港动作电影的草根逆袭热血精神。',
    laceTag: '第二幕 · 触觉意象与真实物理',
    laceTitle: '散开的鞋带与决定命运的最后10米',
    laceDesc:
      '深夜跑道上一根散开的鞋带引发意外悲剧；在“绝不多余”训练营里，外冷内热的艾尔薇拉成为第一个教会207公斤的拉苏尔系紧双结、重拾尊严的人。',
    scalesTag: '第三幕 · 黄铜天平与日记X光透视',
    scalesTitle: '“你的恐惧与自卑，比你身上的200公斤更沉重。”',
    scalesDesc:
      'JANA MEN 创始人艾特姆用古老的黄铜天平直击拉苏尔的内心：一边是207公斤的童年创伤，另一边是1克直面自我的诚实。',
    panLeftWeight: '207 公斤',
    panLeftSub: '恐惧与童年创伤',
    panLeftTitle: '左盘 · 207公斤的心理盔甲',
    panLeftBody: '童年阴影、夜间窒息、借用他人的名字，以及用脂肪筑起的逃避高墙。',
    panRightWeight: '1 克',
    panRightSub: '直面自我的诚实',
    panRightTitle: '右盘 · 1克纯粹的勇气',
    panRightBody: '减重营的铁血自律、真实的汗水与泪水，以及终点前10米的转身救人。',
    castTag: '全明星演员阵容与核心主创',
    castTitle: '银幕主演与金牌制作团队',
    castSub: '男主角真实医学减重 × 票房大片王牌编剧 × 哈萨克斯坦国宝级老戏骨与23位实拍演员。',
    ensembleTag: '完整演员群像',
    ensembleTitle: '实力派配角、奥运冠军客串与 JANA MEN 真实学员',
    expandCredits: '展开官方完整演职员表',
    collapseCredits: '收起演职员表',
    salesTag: '大中华区及国际买方专属商务中心',
    salesTitle: '版权合作、技术规格与出品方直联',
    salesSub:
      '大中华区（中国大陆、港澳台）院线、流媒体及电视全媒体版权清晰无瑕疵，由出品方 Big Movie Studio 直接洽谈授权。',
    specsHeading: '影片技术参数与交付标准',
    specs: [
      { k: '中文片名', v: '《绝不多余》 / 《并非多余》', sub: '英文片名：NOT EXTRA' },
      { k: '影片类型', v: '励志体育轻喜剧 / 剧情片', sub: '合家欢笑泪励志大片', accent: true },
      { k: '母带规格', v: '4K DCP · 2.39:1', sub: '4096 × 1716 · 全流程DI调色' },
      { k: '音频分轨', v: '5.1 & 杜比全景声', sub: '完整国际声道 (M&E) 便于译制' },
      { k: '片长与产地', v: '约115分钟 · 哈萨克斯坦', sub: 'Big Movie Studio × JANA MEN' },
      { k: '交付窗口', v: '2027年春季', sub: '3月至5月（含中英字幕）', accent: true },
    ],
    compsHeading: '市场对标影片与票房验证',
    comps: [
      {
        tag: '对标 01 · 华语现象级大片',
        metric: '34亿+ 人民币票房',
        title: '《热辣滚烫》(YOLO, 2024)',
        body: '充分验证了“演员真实减重蜕变 + 为自己赢一次”在华语院线市场拥有极强的情感破圈爆发力。',
      },
      {
        tag: '对标 02 · 奥斯卡口碑佳作',
        metric: '2项奥斯卡大奖',
        title: '《鲸》(The Whale, 2022)',
        body: '具备200公斤主角心理救赎的深沉戏剧张力，同时赋予中国观众更加明亮、温暖、振奋的院线情感出口。',
      },
      {
        tag: '对标 03 · 同款王牌编剧',
        metric: '独联体票房冠军',
        title: '《我是如何减肥的》',
        body: '由同一位票房爆款编剧康斯坦丁·迈耶执笔，精准把控喜剧节奏、观众笑点与催泪高潮。',
      },
    ],
    roadmapHeading: '后期制作与母带交付进度表',
    roadmap: [
      {
        phase: '第一阶段 · 2026年8–10月',
        badge: '已杀青',
        title: '实景拍摄与阿斯塔纳万人马拉松杀青',
        body: '完成全部体育场内景、JANA MEN 真实减重训练营拍摄以及阿斯塔纳官方万人马拉松实景跟拍。',
      },
      {
        phase: '第二阶段 · 2026年11月 – 冬季',
        badge: '当前阶段',
        active: true,
        title: '粗剪进行中 → 视效、配乐、混音与DI调色',
        body: '现阶段开放3分钟中字推介片与内部审片通道；冬季完成大桥视效、原创配乐、杜比混音与全片调色。',
      },
      {
        phase: '第三阶段 · 2027年3–5月',
        badge: '2027年春季',
        title: '4K DCP及中英字幕母带交付与全球公映',
        body: '正式交付4K DCP数字母带、中英文字幕、完整国际分轨（M&E）以及引进申报所需全套法律文件。',
      },
    ],
    dealTag: '大中华区版权开放与合作模式',
    dealTitle: '全面开放中国大陆及港澳台全媒体版权',
    dealBody:
      '支持早期预购（Pre-Buy）、联合发行（Co-Distribution）或签署优先合作备忘录（MOU）。涵括院线发行、流媒体（爱奇艺/腾讯/优酷/B站）、电视及航空版权，并支持主创团队来华路演。',
    dealPills: ['中国大陆', '中国香港 / 澳门', '中国台湾', '支持 MOU / 早期预购'],
    musicTag: '旗舰中文主题曲联合宣发权益',
    musicTitle: '经典金曲《我是你》 × 迪玛希 (Dimash) 专属定制',
    musicBody:
      '剧组已正式获得传奇金曲《我是你》（Ya Eto Ty / I Am You）的官方改编授权。中国发行伙伴享有独家联合宣发权益，可特邀迪玛希或中国一线实力歌手录制官方中文版主题曲。',
    musicHighlight: '已获官方正版改编授权——非常适合抖音、微博及院线全网音乐宣发破圈。',
    contactRole: '剧集总监与领衔制片人 · 大中华区版权直联',
    contactLocation: 'BIG MOVIE STUDIO · 哈萨克斯坦阿斯塔纳',
    contactWechatNote: '电话与微信号 (WeChat ID) 欢迎邮件索取直联',
    contactInstaNote: '',
    contactCopy: '复制邮箱',
    contactCopied: '已复制',
    contactDomainLabel: '官方域名：EXTRAS.SIJICBOND.SITE',
    contactChainLabel: '全版权链清晰完整',
    deckGalleryTag: '大中华区官方推介手册预览',
    deckGalleryTitle: '《绝不多余》 / 《并非多余》推介手册（12页）',
    deckPrimaryBtn: '下载大中华区推介手册 (PDF)',
    deckSecondaryBtn: '查看原版视觉画册 (PDF)',
    deckSlideLabel: '第',
    footerRights: '© 2026–2027 Big Movie Studio & IBA JANA MEN Movement（哈萨克斯坦阿斯塔纳）保留所有权利。',
    chapters: [
      { id: 'hero', num: '01', label: '序幕' },
      { id: 'diary', num: '02', label: '故事' },
      { id: 'lookbook', num: '03', label: '剧照' },
      { id: 'cast', num: '04', label: '阵容' },
      { id: 'sales', num: '05', label: '发行合作' },
    ],
  },

  ru: {
    docTitle: 'НЕ ЛИШНИЕ — Официальный сайт для дистрибьюторов и фестивалей (Весна 2027)',
    filmTitle: 'НЕ ЛИШНИЕ',
    studioLine: 'BIG MOVIE STUDIO · IBA JANA MEN',
    genre: 'ПСИХОЛОГИЧЕСКОЕ СПОРТИВНОЕ ДРАМЕДИ · ПОЛНЫЙ МЕТР',
    slateMeta: '2.39:1 ШИРОКИЙ ЭКРАН · 24 КАДР/С · 4K DCP',
    statusText: 'ПОСТПРОДАКШН (ЧЕРНОВОЙ МОНТАЖ)',
    releaseText: 'РЕЛИЗ В КИНО: ВЕСНА 2027',
    headerPromoBtn: 'Промо 3 мин',
    headerDeckBtn: 'Питч-дек PDF',
    headerTicketsBtn: 'Купить билеты',
    heroPitch: 'Самый неподходящий человек против самой тяжёлой дистанции.',
    heroHook:
      '207-килограммовый уборщик стадиона присваивает имя погибшего марафонца, попадает в жёсткий лагерь трансформации и выходит на трассу 42.2 км — чтобы за 10 метров до финиша развернуться ради спасения чужой жизни.',
    heroPromoBtn: 'Смотреть 3-минутный промо-ролик',
    heroDeckBtn: 'Скачать презентацию (PDF)',
    heroTicketsBtn: 'Купить билеты на премьеру (Весна 2027)',
    heroBridgeTag: 'ПОТЕНЦИАЛ ДЛЯ КИТАЯ И МИРОВОГО ПРОКАТА',
    heroBridgeBody:
      'Реальная физическая трансформация в духе кассового феномена «YOLO» («Горячий и пряный») встречает психологическую глубину «Кита» и душевный драйв гонконгского кино 80-х с Джеки Чаном.',
    laceTag: 'СЦЕНА 02 · ТАКТИЛЬНАЯ МЕТАФОРА',
    laceTitle: 'Развязанный шнурок и 10 метров вечности',
    laceDesc:
      'Развязанный шнурок на ночной беговой дорожке запускает трагедию. В лагере Эльвира впервые учит 207-килограммового великана завязывать крепкий двойной узел — возвращая ему достоинство.',
    scalesTag: 'СЦЕНА 03 · ЛАТУННЫЕ ВЕСЫ И РЕНТГЕН ДНЕВНИКА',
    scalesTitle: '«Твой страх и обиды весят больше твоих 200 килограммов»',
    scalesDesc:
      'Наставник Айтым Жакупов ставит перед Расулом аптекарские весы: на одной чаше — 207 кг детской травмы, на другой — 1 грамм кристальной честности перед собой.',
    panLeftWeight: '207 КГ',
    panLeftSub: 'ТРАВМА И СТРАХ',
    panLeftTitle: 'ЧАША I · БРОНЯ ИЗ СТРАХА',
    panLeftBody: 'Детские обиды, ночное апноэ, чужое имя и бегство от реальности.',
    panRightWeight: '1 ГРАММ',
    panRightSub: 'ЧЕСТНОСТЬ ДУХА',
    panRightTitle: 'ЧАША II · ЧЕСТНОСТЬ И ВОЛЯ',
    panRightBody: 'Дисциплина лагеря JANA MEN, настоящий марафон и спасение чужой жизни.',
    castTag: 'АКТЁРСКИЙ СОСТАВ И СОЗДАТЕЛИ',
    castTitle: 'Звёзды экрана и команда фильма',
    castSub: 'Подтверждённый актёрский ансамбль из 23 лиц и все департаменты съёмочной группы.',
    ensembleTag: 'ПОЛНЫЙ АКТЁРСКИЙ АНСАМБЛЬ',
    ensembleTitle: 'Актёры второго плана, камео чемпионов и участники JANA MEN',
    expandCredits: 'Открыть полный список всех цехов из титров',
    collapseCredits: 'Скрыть полный список титров',
    salesTag: 'ЗАКРЫТЫЙ РАЗДЕЛ ДЛЯ ДИСТРИБЬЮТОРОВ И ФЕСТИВАЛЕЙ',
    salesTitle: 'Права на прокат, спецификации и прямые контакты',
    salesSub:
      'Все права на Большой Китай и международный прокат (кинотеатры, онлайн-платформы, ТВ) принадлежат напрямую студии Big Movie Studio.',
    specsHeading: 'ТЕХНИЧЕСКИЙ И РЫНОЧНЫЙ ПАСПОРТ ФИЛЬМА',
    specs: [
      { k: 'НАЗВАНИЯ', v: 'НЕ ЛИШНИЕ / NOT EXTRA', sub: 'КНР: 《绝不多余》 / 《并非多余》' },
      { k: 'ЖАНР', v: 'Спортивное драмеди', sub: 'Зрительское кино с юмором и драмой', accent: true },
      { k: 'МАСТЕР-ФОРМАТ', v: '4K DCP · 2.39:1', sub: '4096 × 1716 · 24 кадр/с, полный DI' },
      { k: 'ЗВУК И ДОРОЖКИ', v: '5.1 и Dolby Atmos', sub: 'Чистая M&E дорожка для дубляжа' },
      { k: 'ХРОНОМЕТРАЖ', v: '~115 мин · Казахстан', sub: 'Big Movie Studio × JANA MEN' },
      { k: 'СДАЧА МАСТЕРА', v: 'Весна 2027', sub: 'Март – май 2027 (EN/ZH субтитры)', accent: true },
    ],
    compsHeading: 'КАССОВЫЕ РЕФЕРЕНСЫ И ДОКАЗАТЕЛЬСТВО СПРОСА',
    comps: [
      {
        tag: 'РЕФЕРЕНС 01 · ХИТ КИТАЯ',
        metric: '$480М+ В КНР',
        title: '«YOLO» / 《热辣滚烫》 (2024)',
        body: 'Доказал, что реальная трансформация актёра и тема «победить ради себя» собирают рекордную кассу в Китае и Азии.',
      },
      {
        tag: 'РЕФЕРЕНС 02 · ПРЕСТИЖ A24',
        metric: '2 «ОСКАРА» · $55М+',
        title: '«Кит» / The Whale (2022)',
        body: 'Глубокая психология 200-килограммового героя и прощения дочери — но с тёплым зрительским финалом марафона.',
      },
      {
        tag: 'РЕФЕРЕНС 03 · ТОТ ЖЕ АВТОР',
        metric: '№1 ПРОКАТА СНГ',
        title: '«Я худею»',
        body: 'Написано тем же сценаристом Константином Майером — проверенный баланс народного юмора, правды и катарсиса.',
      },
    ],
    roadmapHeading: 'ДОРОЖНАЯ КАРТА ПОСТПРОДАКШНА',
    roadmap: [
      {
        phase: 'ЭТАП 01 · АВГ–ОКТ 2026',
        badge: 'ЗАВЕРШЕНО',
        title: 'Съёмки и живой марафон в Астане',
        body: '100% натурных съёмок завершено, включая реальную трансформацию в лагере JANA MEN и живую трассу марафона.',
      },
      {
        phase: 'ЭТАП 02 · НОЯ 2026 – ЗИМА',
        badge: 'В РАБОТЕ',
        active: true,
        title: 'Черновой монтаж → Графика, музыка, 5.1 и DI',
        body: 'Открыт просмотр 3-минутного промо-ролика и рабочего монтажа; зимой завершаются VFX, саундтрек и цветокоррекция.',
      },
      {
        phase: 'ЭТАП 03 · МАРТ – МАЙ 2027',
        badge: 'ВЕСНА 2027',
        title: 'Сдача 4K DCP и мировой кинопрокат',
        body: 'Передача готового 4K DCP, английских и китайских субтитров, чистой дорожки M&E и выход в широкий прокат.',
      },
    ],
    dealTag: 'ОТКРЫТЫЕ ТЕРРИТОРИИ И ФОРМАТ СДЕЛКИ',
    dealTitle: 'Права на Большой Китай и мир свободны',
    dealBody:
      'Открыты права на материковый Китай, Гонконг, Макао, Тайвань и международные рынки (кинотеатры, стриминг, ТВ, авиа). Доступны ранняя предпродажа, ко-дистрибуция и подписание меморандума (MOU).',
    dealPills: ['МАТЕРИКОВЫЙ КИТАЙ', 'ГОНКОНГ И МАКАО', 'ТАЙВАНЬ', 'ПРЕДПРОДАЖА / MOU'],
    musicTag: 'МУЗЫКАЛЬНЫЙ КО-МАРКЕТИНГ',
    musicTitle: 'Хит «Я — это ты» × Димаш Кудайберген',
    musicBody:
      'Права на легендарную песню Мурата Насырова официально очищены у наследников. Для партнёров в КНР открыта эксклюзивная опция записи китайской версии с Димашем или звездой Китая.',
    musicHighlight: 'Официальная лицензия получена — готовый вирусный повод для промо в Douyin и кинотеатрах.',
    contactRole: 'Шоураннер и ведущий продюсер · Прямые переговоры',
    contactLocation: 'BIG MOVIE STUDIO · АСТАНА, КАЗАХСТАН',
    contactWechatNote: 'Телефон и WeChat ID предоставляются по запросу',
    contactInstaNote: 'Официальный Instagram фильма',
    contactCopy: 'КОПИРОВАТЬ',
    contactCopied: 'СКОПИРОВАНО',
    contactDomainLabel: 'ДОМЕН: EXTRAS.SIJICBOND.SITE',
    contactChainLabel: 'ПРАВА ОЧИЩЕНЫ НА 100%',
    deckGalleryTag: 'ПРЕВЬЮ ОФИЦИАЛЬНЫХ ПРЕЗЕНТАЦИЙ',
    deckGalleryTitle: 'Презентация для Большого Китая (12 слайдов)',
    deckPrimaryBtn: 'Скачать презентацию для Китая (PDF)',
    deckSecondaryBtn: 'Каст-презентация «НЕ ЛИШНИЕ» (PDF)',
    deckSlideLabel: 'СЛАЙД',
    footerRights: '© 2026–2027 Big Movie Studio и движение IBA JANA MEN (Астана, Казахстан). Все права защищены.',
    chapters: [
      { id: 'hero', num: '01', label: 'ПРОЛОГ' },
      { id: 'diary', num: '02', label: 'ИСТОРИЯ' },
      { id: 'lookbook', num: '03', label: 'КАДРЫ' },
      { id: 'cast', num: '04', label: 'КАСТ' },
      { id: 'sales', num: '05', label: 'ПРАВА' },
    ],
  },
};

function detectInitialLang(): UILang {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('market') === 'cn' || params.get('lang') === 'zh') return 'zh';
    if (params.get('lang') === 'ru') return 'ru';
    if (params.get('lang') === 'en') return 'en';

    const saved = localStorage.getItem('not_extra_v3_lang');
    if (saved === 'en' || saved === 'zh' || saved === 'ru') return saved;

    const navLang = (navigator.language || '').toLowerCase();
    if (navLang.startsWith('zh')) return 'zh';
    if (navLang.startsWith('ru')) return 'ru';
  } catch {
    // fallback
  }
  return 'en';
}

export default function App() {
  const [isChinaMarketUrl, setIsChinaMarketUrl] = useState<boolean>(false);
  const [lang, setLang] = useState<UILang>(() => detectInitialLang());
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [heroShatter, setHeroShatter] = useState<number>(0);
  const [showFullCredits, setShowFullCredits] = useState<boolean>(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState<boolean>(false);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [titleWeightVar, setTitleWeightVar] = useState<{ tracking: number; skew: number }>({
    tracking: 0,
    skew: 0,
  });

  const lenisRef = useRef<Lenis | null>(null);
  const heroSectionRef = useRef<HTMLElement | null>(null);

  const hideWesternSocials = lang === 'zh' || isChinaMarketUrl;
  const c = COPY[lang];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('market') === 'cn') {
      setIsChinaMarketUrl(true);
      setLang('zh');
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('not_extra_v3_lang', lang);
    } catch {
      // ignore
    }
    document.documentElement.lang = lang;
    document.title = c.docTitle;
  }, [lang, c.docTitle]);

  // Sync audio state & gently arm cinema Foley on first user interaction (always mutable)
  useEffect(() => {
    const unsub = soundEngine.subscribe(setSoundEnabled);
    const onFirstGesture = () => {
      soundEngine.unlockOnFirstGesture();
    };
    window.addEventListener('pointerdown', onFirstGesture, { once: true, passive: true });
    return () => {
      unsub();
      window.removeEventListener('pointerdown', onFirstGesture);
    };
  }, []);

  // Smooth physical scroll via Lenis + GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.35,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', (e: { progress: number; velocity: number }) => {
      ScrollTrigger.update();
      const prog = typeof e.progress === 'number' ? e.progress : 0;
      const vel = typeof e.velocity === 'number' ? e.velocity : 0;
      setScrollProgress(prog);
      soundEngine.setScrollProgress(prog);

      setTitleWeightVar({
        tracking: Math.max(-2, Math.min(6, Math.abs(vel) * 0.35)),
        skew: Math.max(-2.5, Math.min(2.5, vel * 0.08)),
      });

      const lenisInternal = lenis as unknown as { options?: { wheelMultiplier?: number; duration?: number } };
      if (lenisInternal.options) {
        if (prog < 0.25) {
          lenisInternal.options.wheelMultiplier = 0.72;
          lenisInternal.options.duration = 1.55;
        } else if (prog < 0.65) {
          lenisInternal.options.wheelMultiplier = 0.95;
          lenisInternal.options.duration = 1.2;
        } else {
          lenisInternal.options.wheelMultiplier = 1.15;
          lenisInternal.options.duration = 0.95;
        }
      }
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    if (window.location.hash) {
      const targetId = window.location.hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'auto' });
      }, 140);
    }

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroSectionRef.current) {
        ScrollTrigger.create({
          trigger: heroSectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
          onUpdate: (self) => setHeroShatter(self.progress),
        });
      }
    });
    return () => ctx.revert();
  }, []);

  const handleToggleSound = () => {
    soundEngine.toggle(!soundEnabled);
  };

  const handleJumpToSection = (sectionId: string) => {
    soundEngine.playUiTick();
    const el = document.getElementById(sectionId);
    if (!el) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: -64 });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenPromo = () => {
    soundEngine.playUiTick();
    setIsPromoModalOpen(true);
  };

  const handleCopyEmail = () => {
    soundEngine.playUiTick();
    navigator.clipboard?.writeText(CONTACT_CONFIG.email).catch(() => {});
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  return (
    <div className="min-h-screen bg-[#0B0807] text-[#FBF3E8] overflow-x-hidden relative selection:bg-[#E85D04] selection:text-[#0B0807]">
      {/* Zero-FPS 35mm Cinema Grain Veil */}
      <div className="fixed inset-0 cinema-grain pointer-events-none z-30 opacity-55" aria-hidden="true" />

      {/* ==================== CLEAN EDITORIAL TOP BAR (NO DUPLICATE CTA CLUTTER) ==================== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B0807]/85 backdrop-blur-xl border-b border-[#FFEDD7]/10">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          {/* Film Title Monogram */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleJumpToSection('hero');
            }}
            className="flex items-center gap-2.5 group min-w-0"
          >
            <div className="hidden sm:flex w-8 h-8 rounded-full border border-[#FFEDD7]/25 group-hover:border-[#E85D04] items-center justify-center font-mono font-bold text-[10px] text-[#FFEDD7] group-hover:text-[#E85D04] transition-colors flex-shrink-0">
              42.2
            </div>
            <div className="min-w-0">
              <div className="font-unbounded font-bold text-xs sm:text-sm text-[#FBF3E8] tracking-[0.08em] uppercase whitespace-nowrap">
                {c.filmTitle}
              </div>
              <div className="font-mono text-[9px] text-[#8E847C] tracking-[0.18em] uppercase hidden xl:block truncate">
                {c.studioLine}
              </div>
            </div>
          </a>

          {/* Quiet Editorial Section Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
            {c.chapters.slice(1).map((ch) => (
              <a
                key={ch.id}
                href={`#${ch.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleJumpToSection(ch.id);
                }}
                className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#9E948B] hover:text-[#FFEDD7] transition-colors"
              >
                {ch.label}
              </a>
            ))}
          </nav>

          {/* Right Controls: Sticky Promo button ONLY after scrolling past Hero + EN|中文|RU + Mute */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
            {scrollProgress > 0.08 && (
              <button
                type="button"
                onClick={handleOpenPromo}
                data-testid="header-play-promo-btn"
                className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#E85D04] hover:bg-[#FFEDD7] text-[#FBF3E8] hover:text-[#0B0807] font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.1em] transition-all"
              >
                <Play className="w-3 h-3 fill-current flex-shrink-0" />
                <span className="hidden sm:inline">{c.headerPromoBtn}</span>
                <span className="sm:hidden">{lang === 'zh' ? '推介片' : lang === 'ru' ? 'Промо' : 'Play'}</span>
              </button>
            )}

            {/* Pure 3-Language Switcher: EN | 中文 | RU */}
            <div
              className="flex items-center rounded-full border border-[#FFEDD7]/16 bg-[#130F0D] p-0.5"
              role="group"
              aria-label="Language Switcher"
            >
              {LANG_OPTIONS.map((opt) => {
                const active = lang === opt.code;
                return (
                  <button
                    key={opt.code}
                    type="button"
                    onClick={() => {
                      soundEngine.playUiTick();
                      setLang(opt.code);
                    }}
                    data-testid={`lang-btn-${opt.code}`}
                    className={`px-2 sm:px-2.5 py-1 rounded-full font-mono text-[10px] sm:text-[11px] font-bold tracking-wider transition-all ${
                      active
                        ? 'bg-[#FFEDD7] text-[#0B0807]'
                        : 'text-[#9E948B] hover:text-[#FBF3E8]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Mute / Unmute Icon */}
            <button
              type="button"
              onClick={handleToggleSound}
              data-testid="sound-toggle-btn"
              aria-label={soundEnabled ? 'Mute' : 'Unmute'}
              className={`p-2 rounded-full border transition-all ${
                soundEnabled
                  ? 'bg-[#E85D04]/15 border-[#E85D04] text-[#E85D04]'
                  : 'bg-transparent border-[#FFEDD7]/16 text-[#9E948B] hover:text-[#FFEDD7]'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Bottom-Centered Compact SOS Telemetry Bar (Desktop Only — clean mobile viewport!) */}
      <SosHudWidget
        scrollProgress={scrollProgress}
        lang={lang}
        onJumpToSection={handleJumpToSection}
      />

      {/* Right-Edge Vertical Cinema Chapter Scrubber (Desktop 2XL) */}
      <aside
        aria-label="Chapters"
        className="hidden 2xl:flex fixed right-5 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-3"
      >
        {c.chapters.map((ch, idx) => {
          const activeIdx = Math.min(
            c.chapters.length - 1,
            Math.floor(scrollProgress * c.chapters.length)
          );
          const isActive = idx === activeIdx;
          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => handleJumpToSection(ch.id)}
              className="group flex items-center gap-2.5 font-mono text-[9px] tracking-[0.18em] uppercase transition-all"
            >
              <span
                className={`transition-all ${
                  isActive
                    ? 'text-[#FFEDD7] opacity-100'
                    : 'text-[#7E746B] opacity-0 group-hover:opacity-100'
                }`}
              >
                {ch.num} · {ch.label}
              </span>
              <span
                className={`block h-[2px] transition-all ${
                  isActive
                    ? 'w-6 bg-[#E85D04]'
                    : 'w-2.5 bg-[#FFEDD7]/25 group-hover:w-4 group-hover:bg-[#FFEDD7]/70'
                }`}
              />
            </button>
          );
        })}
      </aside>

      {/* ==================== SCENE 1 (HERO): B2B CINEMA HOOK + STEAMING SAMSA SCALES ==================== */}
      <section
        id="hero"
        ref={heroSectionRef}
        className="relative min-h-screen flex flex-col justify-between pt-20 pb-20 sm:pb-24 overflow-hidden"
      >
        <IshimWaterCanvas shatterProgress={heroShatter} />

        {/* Ultra-Light WebP Film Stills (80KB + 23KB) — Instant Load in Mainland China */}
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none transition-opacity duration-300"
          style={{
            backgroundImage: `url('./stills/hero_bridge_web.webp')`,
            opacity: Math.max(0, 0.4 * (1 - heroShatter * 2.2)),
            filter: 'contrast(1.06) saturate(0.86)',
          }}
        />
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none transition-opacity duration-300"
          style={{
            backgroundImage: `url('./stills/hero_vest_web.webp')`,
            opacity: Math.max(0, Math.min(0.54, (heroShatter - 0.25) * 1.15)),
            filter: 'contrast(1.12) saturate(1.04)',
          }}
        />

        <div
          className="absolute inset-0 pointer-events-none z-[5]"
          style={{
            background:
              'linear-gradient(180deg, rgba(11,8,7,0.82) 0%, rgba(11,8,7,0.5) 38%, rgba(11,8,7,0.86) 78%, #0B0807 100%)',
          }}
        />

        <div className="relative z-20 max-w-[1380px] mx-auto px-4 sm:px-8 w-full flex-1 flex flex-col justify-between gap-8">
          {/* Top Cinema Slate Strip */}
          <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-6 pb-3.5 hairline-dashed-b font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em]">
            <div className="flex items-center gap-2.5 text-[#D4A373]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E85D04]" />
              <span>{c.slateMeta}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[#9E948B]">
              <span className="text-[#E85D04]">{c.statusText}</span>
              <span className="text-[#FFEDD7]/20">·</span>
              <span className="text-[#FBF3E8]">{c.releaseText}</span>
            </div>
          </div>

          {/* Main 12-Col Hero Grid: Immediate B2B Pitch + Play/PDF Left | Interactive Samsa Scales Right */}
          <div className="my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center py-2 sm:py-6">
            {/* Left 7 Cols */}
            <div className="lg:col-span-7 space-y-5">
              <div className="font-mono text-[10px] sm:text-xs font-medium uppercase tracking-[0.24em] text-[#D4A373]">
                {c.genre}
              </div>

              <h1
                className="font-unbounded font-black text-4xl sm:text-6xl lg:text-[5.2rem] uppercase text-[#FFEDD7] leading-[0.98] tracking-[-0.025em] transition-transform duration-150"
                style={{
                  letterSpacing: `${-0.02 + titleWeightVar.tracking * 0.008}em`,
                  transform: `skewX(${titleWeightVar.skew}deg)`,
                }}
              >
                {c.filmTitle}
              </h1>

              <p className="text-lg sm:text-2xl font-semibold text-[#FBF3E8] leading-snug max-w-2xl">
                {c.heroPitch}
              </p>

              <p className="text-sm sm:text-[15px] text-[#B8AEA4] leading-relaxed max-w-2xl">
                {c.heroHook}
              </p>

              {/* Immediate 1-Click B2B Primary Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleOpenPromo}
                  data-testid="hero-play-promo-btn"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#FFEDD7] hover:bg-[#E85D04] text-[#0B0807] hover:text-[#FBF3E8] font-mono font-bold text-xs uppercase tracking-[0.14em] transition-all"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{c.heroPromoBtn}</span>
                </button>

                {SITE_MODE === 'DISTRIBUTOR' ? (
                  <a
                    href={CONTACT_CONFIG.pitchDeckUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="hero-download-deck-btn"
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#140F0D]/90 hover:bg-[#1E1714] border border-[#FFEDD7]/22 hover:border-[#FFEDD7]/60 text-[#FBF3E8] font-mono font-semibold text-xs uppercase tracking-[0.14em] transition-all"
                  >
                    <FileDown className="w-4 h-4 text-[#E85D04]" />
                    <span>{c.heroDeckBtn}</span>
                  </a>
                ) : (
                  <a
                    href={CONTACT_CONFIG.ticketsUrl}
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#140F0D]/90 border border-[#D4A373]/50 text-[#FBF3E8] font-mono font-semibold text-xs uppercase tracking-[0.14em]"
                  >
                    <Ticket className="w-4 h-4 text-[#E85D04]" />
                    <span>{c.heroTicketsBtn}</span>
                  </a>
                )}
              </div>

              {/* Clean Cultural Bridge Footnote */}
              <div className="pt-4 mt-2 hairline-dashed max-w-2xl">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#E85D04] mb-1">
                  {c.heroBridgeTag}
                </div>
                <p className="text-xs text-[#9E948B] leading-relaxed">{c.heroBridgeBody}</p>
              </div>
            </div>

            {/* Right 5 Cols: Authentic 2.39:1 Cinema Promo Still Preview (1-Click Play, zero cartoon gimmicks) */}
            <div className="lg:col-span-5">
              <button
                type="button"
                onClick={handleOpenPromo}
                data-testid="hero-video-poster-card"
                aria-label={c.heroPromoBtn}
                className="group relative block w-full rounded-2xl overflow-hidden border border-[#FFEDD7]/18 hover:border-[#E85D04]/70 bg-[#0B0807] text-left shadow-[0_24px_70px_rgba(0,0,0,0.72)] transition-all"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <img
                    src="./stills/hero_vest_web.webp"
                    alt={c.filmTitle}
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0807] via-[#0B0807]/25 to-transparent" />

                  {/* Top Cinema Frame Metadata */}
                  <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em]">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0B0807]/75 backdrop-blur-md border border-[#FFEDD7]/15 text-[#FFEDD7]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E85D04]" />
                      {lang === 'zh' ? '中文字幕 · 03:00' : lang === 'ru' ? 'ПРОМО · 03:00' : 'CHN SUBS · 03:00'}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-[#0B0807]/65 backdrop-blur-md text-[#D4A373]">
                      2.39:1
                    </span>
                  </div>

                  {/* Minimal Center Cinema Play Emblem */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#0B0807]/65 group-hover:bg-[#E85D04] border border-[#FFEDD7]/35 group-hover:border-[#E85D04] backdrop-blur-md flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                      <Play className="w-6 h-6 sm:w-7 sm:h-7 text-[#FFEDD7] fill-current ml-1" />
                    </div>
                  </div>

                  {/* Bottom Subtle Reel Tag */}
                  <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between font-mono text-[10px] text-[#B8AEA4] tracking-[0.14em] uppercase">
                    <span>
                      {lang === 'zh'
                        ? '官方3分钟粗剪推介片'
                        : lang === 'ru'
                        ? 'Официальный черновой промо-ролик'
                        : 'Official 3-Min Rough Cut Promo'}
                    </span>
                    <span className="text-[#FFEDD7]/75">HD 720p</span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SCENE 2: DIARY X-RAY SCANNER (ADULT EDITORIAL INTERACTIVE) ==================== */}
      <section id="diary" className="py-16 sm:py-24 hairline-dashed bg-[#0B0807]">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8">
          <DiaryXrayScanner lang={lang} />
        </div>
      </section>

      {/* ==================== SCENE 4: DIRECTOR'S STATEMENT & 35MM LOOKBOOK ==================== */}
      <CinemaLookbookSection lang={lang} />

      {/* ==================== SCENE 5: CAST & CREW EXHIBITION (23 VERIFIED FACES) ==================== */}
      <section id="cast" className="py-20 sm:py-28 hairline-dashed bg-[#070606]">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#E85D04] mb-3">
              <Award className="w-3.5 h-3.5" />
              <span>{c.castTag}</span>
            </div>
            <h2 className="font-unbounded font-bold text-2xl sm:text-4xl text-[#FFEDD7] mb-3">
              {c.castTitle}
            </h2>
            <p className="text-sm text-[#9E948B]">{c.castSub}</p>
          </div>

          {/* 3x2 Lead Cast Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {CAST_DATA.map((actor) => (
              <div
                key={actor.id}
                className="group rounded-2xl bg-[#100C0B] border border-[#FFEDD7]/10 hover:border-[#FFEDD7]/30 overflow-hidden flex flex-col justify-between transition-all duration-300"
              >
                <div>
                  <div className="aspect-[4/5] bg-[#060505] relative overflow-hidden border-b border-[#FFEDD7]/10 flex items-center justify-center">
                    <img
                      src={`${actor.image}?v=6`}
                      alt={actor.actor[lang]}
                      className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-700"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0A09] via-[#0D0A09]/15 to-transparent" />
                    <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-[#0B0807]/85 backdrop-blur-md border border-[#FFEDD7]/15 text-[#FFEDD7] font-mono text-[9px] font-medium uppercase tracking-[0.14em]">
                      {actor.badge[lang]}
                    </span>
                    <div className="absolute bottom-4 left-5 right-5">
                      <h3 className="font-unbounded font-bold text-lg text-[#FFEDD7]">
                        {actor.actor[lang]}
                      </h3>
                      <div className="font-mono text-[10px] text-[#D4A373] mt-1">
                        {actor.characterName[lang]} · {actor.role[lang]}
                      </div>
                    </div>
                  </div>
                  <div className="p-5 sm:p-6">
                    <p className="text-xs sm:text-[13.5px] text-[#B8AEA4] leading-relaxed">
                      {actor.desc[lang]}
                    </p>
                  </div>
                </div>
                <div className="px-5 py-3.5 bg-[#0B0807]/80 border-t border-[#FFEDD7]/10 flex items-center justify-between gap-2 text-xs">
                  <span className="font-mono font-bold text-[11px] text-[#E85D04]">{actor.metric}</span>
                  <span className="font-mono text-[10px] text-[#7E746B] text-right">
                    {actor.metricLabel[lang]}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Supporting Cast & Real JANA MEN Alumni */}
          <div className="mb-16">
            <div className="mb-7 pb-4 hairline-dashed-b">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#D4A373] mb-1">
                {c.ensembleTag}
              </div>
              <h3 className="font-unbounded font-bold text-xl sm:text-2xl text-[#FFEDD7]">
                {c.ensembleTitle}
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
              {ENSEMBLE_CAST_DATA.map((item, idx) => {
                const isWideGroup = item.image.includes('janamen_participants');
                return (
                  <div
                    key={idx}
                    className={`group rounded-2xl bg-[#0E0B0A] border border-[#FFEDD7]/10 hover:border-[#FFEDD7]/30 overflow-hidden flex flex-col justify-between transition-all ${
                      isWideGroup ? 'col-span-2 sm:col-span-2 md:col-span-3' : ''
                    }`}
                  >
                    <div
                      className={`${
                        isWideGroup ? 'h-full min-h-[240px]' : 'aspect-[4/5]'
                      } w-full bg-[#060505] relative overflow-hidden flex items-center justify-center`}
                    >
                      <img
                        src={`${item.image}?v=6`}
                        alt={item.name[lang]}
                        className={`w-full h-full ${
                          isWideGroup ? 'object-cover object-center' : 'object-cover object-top'
                        } group-hover:scale-[1.03] transition-transform duration-700`}
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0807] via-[#0B0807]/15 to-transparent" />
                      <div className="absolute bottom-3 left-3.5 right-3.5">
                        <div className="font-unbounded font-bold text-xs sm:text-sm text-[#FFEDD7] leading-snug">
                          {item.name[lang]}
                        </div>
                        <div className="font-mono text-[10px] text-[#D4A373] mt-0.5 leading-tight">
                          {item.role[lang]}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key Creative Team */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#FFEDD7]/10 border border-[#FFEDD7]/10 rounded-2xl overflow-hidden mb-8">
            {KEY_CREW_DATA.map((crew, idx) => (
              <div key={idx} className="bg-[#0D0A09] hover:bg-[#140F0D] p-6 flex flex-col justify-between transition-colors">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={crew.photo}
                      alt={crew.name[lang]}
                      className="w-14 h-14 rounded-xl object-cover object-top border border-[#FFEDD7]/15 flex-shrink-0 bg-[#060505]"
                      loading="lazy"
                      decoding="async"
                    />
                    <div>
                      <h4 className="font-unbounded font-bold text-sm text-[#FFEDD7]">
                        {crew.name[lang]}
                      </h4>
                      <div className="font-mono text-[10px] text-[#E85D04] mt-1 leading-snug">
                        {crew.role[lang]}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-[13px] text-[#A69B91] leading-relaxed">
                    {crew.bio[lang]}
                  </p>
                </div>
                {crew.link && !hideWesternSocials && (
                  <div className="mt-4 pt-3 border-t border-[#FFEDD7]/10">
                    <a
                      href={crew.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#D4A373] hover:text-[#FFEDD7]"
                    >
                      {crew.linkLabel}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Expandable Full Official Crew Roll */}
          <div className="rounded-2xl bg-[#0F0B0A] border border-[#FFEDD7]/12 overflow-hidden">
            <button
              type="button"
              onClick={() => {
                soundEngine.playUiTick();
                setShowFullCredits((v) => !v);
              }}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#171210] transition-colors"
            >
              <span className="font-mono font-semibold text-xs uppercase tracking-[0.14em] text-[#FFEDD7]">
                {showFullCredits ? c.collapseCredits : c.expandCredits}
              </span>
              {showFullCredits ? (
                <ChevronUp className="w-4 h-4 text-[#E85D04]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#E85D04]" />
              )}
            </button>

            <div className={`p-6 border-t border-[#FFEDD7]/10 ${showFullCredits ? 'block' : 'hidden md:block'}`}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {FULL_CREDITS_DATA.map((dept, dIdx) => (
                  <div key={dIdx} className="rounded-xl bg-[#0A0807] border border-[#FFEDD7]/10 p-5 space-y-2.5">
                    <h5 className="font-mono font-bold text-[10px] uppercase tracking-[0.18em] text-[#D4A373] border-b border-[#FFEDD7]/10 pb-2">
                      {dept.department[lang]}
                    </h5>
                    {dept.members.map((m, mIdx) => (
                      <div key={mIdx} className="text-xs border-b border-[#FFEDD7]/6 pb-2 last:border-none">
                        <div className="text-[#7E746B]">{m.role[lang]}</div>
                        <div className="font-medium text-[#E9DEC9] mt-0.5">{m.name[lang]}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SCENE 6 (#sales): B2B BUYERS ROOM & PITCH DECK HUB ==================== */}
      <section
        id="sales"
        data-testid="sales-section"
        className="py-20 sm:py-28 border-t-2 border-[#E85D04]/70 bg-[#0B0807] relative"
      >
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8 space-y-14">
          {/* Header */}
          <div className="pb-8 hairline-dashed-b">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E85D04] mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{c.salesTag}</span>
              </div>
              <h2 className="font-unbounded font-bold text-2xl sm:text-4xl text-[#FFEDD7] mb-2">
                {c.salesTitle}
              </h2>
              <p className="text-sm text-[#A69B91]">{c.salesSub}</p>
            </div>
          </div>

          {/* 1. Technical Passport */}
          <div>
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4A373] mb-4">
              {c.specsHeading}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-[#FFEDD7]/10 border border-[#FFEDD7]/10 rounded-2xl overflow-hidden">
              {c.specs.map((sp, i) => (
                <div key={i} className="p-5 bg-[#0F0C0A]">
                  <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#7E746B]">{sp.k}</div>
                  <div
                    className={`font-semibold text-xs sm:text-sm mt-1.5 ${
                      sp.accent ? 'text-[#E85D04]' : 'text-[#FFEDD7]'
                    }`}
                  >
                    {sp.v}
                  </div>
                  <div className="text-[10px] text-[#9E948B] mt-1">{sp.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Market Comparables (COMPS) */}
          <div>
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4A373] mb-4">
              {c.compsHeading}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#FFEDD7]/10 border border-[#FFEDD7]/10 rounded-2xl overflow-hidden">
              {c.comps.map((cp, idx) => (
                <div key={idx} className="p-6 bg-[#0F0C0A] space-y-2">
                  <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.14em]">
                    <span className="text-[#E85D04] font-bold">{cp.tag}</span>
                    <span className="text-[#FFEDD7]">{cp.metric}</span>
                  </div>
                  <div className="font-unbounded font-bold text-base text-[#FFEDD7]">{cp.title}</div>
                  <p className="text-xs text-[#A69B91] leading-relaxed">{cp.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Post-Production Roadmap */}
          <div>
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4A373] mb-4">
              {c.roadmapHeading}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {c.roadmap.map((rm, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl border ${
                    rm.active
                      ? 'bg-[#160E0A] border-[#E85D04]/70'
                      : 'bg-[#100C0B] border-[#FFEDD7]/10'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.12em] mb-3">
                    <span className={rm.active ? 'text-[#E85D04] font-bold' : 'text-[#9E948B]'}>
                      {rm.phase}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 ${
                        rm.active
                          ? 'px-2 py-0.5 rounded-full bg-[#E85D04] text-[#0B0807] text-[9px] font-bold'
                          : 'text-[#D4A373]'
                      }`}
                    >
                      {rm.active ? (
                        <Clock className="w-2.5 h-2.5" />
                      ) : idx === 0 ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <Sparkles className="w-3 h-3" />
                      )}
                      {rm.badge}
                    </span>
                  </div>
                  <h4 className="font-unbounded font-bold text-sm sm:text-base text-[#FFEDD7] mb-2">
                    {rm.title}
                  </h4>
                  <p className="text-xs text-[#A69B91] leading-relaxed">{rm.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Deal Structure + Flagship Music + Direct Producer Contact Desk */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-7 grid grid-cols-1 gap-6">
              <div className="p-6 sm:p-7 rounded-2xl bg-[#100C0B] border border-[#FFEDD7]/10 flex flex-col justify-between">
                <div>
                  <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4A373] mb-2">
                    {c.dealTag}
                  </div>
                  <h3 className="font-unbounded font-bold text-lg text-[#FFEDD7] mb-2.5">
                    {c.dealTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A69B91] leading-relaxed mb-4">
                    {c.dealBody}
                  </p>
                </div>
                <div className="pt-3.5 hairline-dashed flex flex-wrap gap-2 font-mono text-[10px] text-[#E9DEC9]">
                  {c.dealPills.map((pill, idx) => (
                    <span
                      key={idx}
                      className={`px-2.5 py-1 rounded-full bg-[#18120F] border ${
                        idx === c.dealPills.length - 1
                          ? 'border-[#E85D04]/45 text-[#E85D04]'
                          : 'border-[#FFEDD7]/10'
                      }`}
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 sm:p-7 rounded-2xl bg-[#140F0B] border border-[#D4A373]/30 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4A373] mb-2">
                    <Disc className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '10s' }} />
                    <span>{c.musicTag}</span>
                  </div>
                  <h3 className="font-unbounded font-bold text-lg text-[#FFEDD7] mb-2">
                    {c.musicTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#B8AEA4] leading-relaxed mb-4">
                    {c.musicBody}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0B0807] border border-[#D4A373]/25 text-xs text-[#E9DEC9]">
                  ★ {c.musicHighlight}
                </div>
              </div>
            </div>

            {/* Direct Executive Contact Desk (Strictly hides Instagram in ZH / ?market=cn) */}
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-[#120D0B] border border-[#FFEDD7]/16 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#E85D04]">
                  {c.contactLocation}
                </div>
                <h3 className="font-unbounded font-bold text-xl text-[#FFEDD7]">
                  {lang === 'zh' ? '谢尔盖·邦达列夫 (Sergey Bondarev)' : lang === 'ru' ? 'Сергей Бондарев' : 'Sergey Bondarev'}
                </h3>
                <div className="text-xs text-[#9E948B]">{c.contactRole}</div>

                {/* Corporate Email + 1-Click Copy */}
                <div className="p-3.5 rounded-xl bg-[#0A0807] border border-[#FFEDD7]/12 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <Mail className="w-4 h-4 text-[#E85D04] flex-shrink-0" />
                    <div className="truncate">
                      <a
                        href={`mailto:${CONTACT_CONFIG.email}`}
                        className="font-mono font-semibold text-xs sm:text-sm text-[#FFEDD7] hover:text-[#E85D04] truncate block"
                      >
                        {CONTACT_CONFIG.email}
                      </a>
                      <div className="text-[10px] text-[#7E746B]">{CONTACT_CONFIG.altEmail}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="px-3 py-1.5 rounded-full bg-[#1C1613] hover:bg-[#FFEDD7] text-[#FFEDD7] hover:text-[#0B0807] text-[10px] font-mono font-semibold transition-colors flex items-center gap-1 flex-shrink-0"
                  >
                    {copiedEmail ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedEmail ? c.contactCopied : c.contactCopy}</span>
                  </button>
                </div>

                {/* Phone / WeChat */}
                <a
                  href={CONTACT_CONFIG.phoneHref}
                  className="p-3.5 rounded-xl bg-[#0A0807] border border-[#FFEDD7]/12 hover:border-[#D4A373]/60 flex items-center gap-3 transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#D4A373] flex-shrink-0" />
                  <div>
                    <div className="font-mono font-semibold text-xs sm:text-sm text-[#FFEDD7]">
                      {CONTACT_CONFIG.phone}
                    </div>
                    <div className="text-[10px] text-[#7E746B]">{c.contactWechatNote}</div>
                  </div>
                </a>

                {/* Conditional Instagram: strictly hidden in ZH / ?market=cn */}
                {!hideWesternSocials && (
                  <a
                    href={CONTACT_CONFIG.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="instagram-link"
                    className="p-3.5 rounded-xl bg-[#0A0807] border border-[#FFEDD7]/12 hover:border-[#E85D04]/60 flex items-center gap-3 transition-colors"
                  >
                    <Instagram className="w-4 h-4 text-[#E85D04] flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-xs sm:text-sm text-[#FFEDD7]">@ne_lishnie_film</div>
                      <div className="text-[10px] text-[#7E746B]">{c.contactInstaNote}</div>
                    </div>
                  </a>
                )}
              </div>

              <div className="mt-6 pt-4 hairline-dashed flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] text-[#7E746B]">
                <span>{c.contactDomainLabel}</span>
                <span className="text-[#D4A373]">{c.contactChainLabel}</span>
              </div>
            </div>
          </div>

          {/* 5. Official Pitch Deck Slide Preview Gallery */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#100C0B] border border-[#FFEDD7]/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 hairline-dashed-b">
              <div>
                <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#E85D04]">
                  {c.deckGalleryTag}
                </div>
                <h3 className="font-unbounded font-bold text-lg sm:text-2xl text-[#FFEDD7] mt-1">
                  {c.deckGalleryTitle}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href={CONTACT_CONFIG.pitchDeckUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="download-china-pdf-btn"
                  className="px-4 py-2 rounded-full bg-[#FFEDD7] hover:bg-[#E85D04] text-[#0B0807] hover:text-[#FBF3E8] font-mono font-bold text-[10px] uppercase tracking-[0.12em] transition-colors"
                >
                  {c.deckPrimaryBtn} ↗
                </a>
                <a
                  href={CONTACT_CONFIG.ruDeckUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-[#191310] border border-[#FFEDD7]/15 text-[#FFEDD7] hover:border-[#FFEDD7]/40 font-mono font-semibold text-[10px] uppercase tracking-[0.12em] transition-colors"
                >
                  {c.deckSecondaryBtn} ↗
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 9, 11].map((sNum) => (
                <a
                  key={`cn-${sNum}`}
                  href={CONTACT_CONFIG.pitchDeckUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl overflow-hidden border border-[#FFEDD7]/10 hover:border-[#E85D04]/70 bg-[#070606] transition-all"
                >
                  <img
                    src={`./slides/cn_slide_${String(sNum).padStart(2, '0')}.png?v=6`}
                    alt={`${c.deckSlideLabel} ${sNum}`}
                    className="w-full aspect-video object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="px-3 py-2 font-mono text-[10px] text-[#A69B91] flex justify-between">
                    <span>
                      {lang === 'zh'
                        ? `第 ${String(sNum).padStart(2, '0')} 页`
                        : `${c.deckSlideLabel} ${String(sNum).padStart(2, '0')}`}
                    </span>
                    <span className="text-[#E85D04]">PDF ↗</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CLEAN FOOTER */}
      <footer className="pt-12 pb-28 hairline-dashed bg-[#070606] text-center">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8 space-y-3">
          <div className="font-unbounded font-bold text-xs sm:text-sm tracking-[0.2em] uppercase text-[#FFEDD7]">
            {c.filmTitle}
          </div>
          <p className="text-xs text-[#7E746B] max-w-2xl mx-auto">{c.footerRights}</p>
          <div className="flex flex-wrap items-center justify-center gap-6 font-mono text-[11px] text-[#A69B91] pt-2">
            <a href={`mailto:${CONTACT_CONFIG.email}`} className="hover:text-[#E85D04] transition-colors">
              {CONTACT_CONFIG.email}
            </a>
            <a href={CONTACT_CONFIG.phoneHref} className="hover:text-[#FFEDD7] transition-colors">
              {CONTACT_CONFIG.phone}
            </a>
            {!hideWesternSocials && (
              <a
                href={CONTACT_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E85D04] transition-colors"
              >
                @ne_lishnie_film
              </a>
            )}
          </div>
        </div>
      </footer>

      {/* WORKING CUSTOM HTML5 PROMO PLAYER MODAL (ZERO YOUTUBE/VIMEO) */}
      <PromoPlayerModal
        isOpen={isPromoModalOpen}
        onClose={() => setIsPromoModalOpen(false)}
        lang={lang}
      />
    </div>
  );
}
