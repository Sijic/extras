import React, { useState, useEffect, useRef } from 'react';
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
  MessageCircle,
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
import { AstanaMarathonJourney } from './components/AstanaMarathonJourney';
import { CinemaLookbookSection } from './components/CinemaLookbookSection';
import { PromoPlayerModal, UILang } from './components/PromoPlayerModal';

const LANG_OPTIONS: Array<{ code: UILang; label: string }> = [
  { code: 'en', label: 'EN' },
  { code: 'zh', label: '中文' },
  { code: 'ru', label: 'RU' },
  { code: 'kk', label: 'ҚАЗ' },
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
      { id: 'journey', num: '02', label: '42.2 KM' },
      { id: 'lookbook', num: '03', label: 'STILLS' },
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
      { id: 'journey', num: '02', label: '42.2公里' },
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
      { id: 'journey', num: '02', label: '42.2 КМ' },
      { id: 'lookbook', num: '03', label: 'КАДРЫ' },
      { id: 'cast', num: '04', label: 'АКТЁРЫ' },
      { id: 'sales', num: '05', label: 'ПРАВА' },
    ],
  },

  kk: {
    docTitle: 'АРТЫҚ ЕМЕС — Халықаралық дистрибуция және ресми сайты (2027 көктем)',
    filmTitle: 'АРТЫҚ ЕМЕС',
    studioLine: 'АЙТЫМ ЖАҚЫПОВТЫҢ ФИЛЬМІ · BIG MOVIE STUDIO',
    genre: 'ПСИХОЛОГИЯЛЫҚ СПОРТТЫҚ ДРАМЕДИ · ТОЛЫҚ МЕТР',
    slateMeta: '2.39:1 КЕҢ ЭКРАН · 24 КАДР/С · 4K DCP',
    statusText: 'ПОСТПРОДАКШН (АЛДЫН АЛА МОНТАЖ)',
    releaseText: 'КИНОПРОКАТ: 2027 КӨКТЕМ',
    headerPromoBtn: 'Промо 3 мин',
    headerDeckBtn: 'Питч-дек PDF',
    headerTicketsBtn: 'Билет алу',
    heroPitch: 'Ең ауыр қашықтыққа қарсы шыққан ең күтпеген кейіпкер.',
    heroHook:
      '207 келі стадион тазалаушысы қаза тапқан марафоншының есімін иемденіп, қатал салмақ тастау лагеріне түседі және 42.2 шақырымдық Астана марафонына шығады — мәреге 10 метр қалғанда өзге адамның өмірін құтқару үшін кері бұрылу үшін.',
    heroPromoBtn: '3 минуттық промо-роликті көру',
    heroDeckBtn: 'Презентацияны жүктеу (PDF)',
    heroTicketsBtn: 'Премьераға билет алу (2027 көктем)',
    heroBridgeTag: 'ҚЫТАЙ ЖӘНЕ ХАЛЫҚАРАЛЫҚ НАРЫҚ ӘЛЕУЕТІ',
    heroBridgeBody:
      '«YOLO» феномені рухындағы шынайы физикалық өзгеріс, «Кит» фильмінің терең психологиясы және 80-жылдардағы Джеки Чан киносының жанды драйвы бір экранда тоғысады.',
    laceTag: '',
    laceTitle: '',
    laceDesc: '',
    scalesTag: '',
    scalesTitle: '',
    scalesDesc: '',
    panLeftWeight: '',
    panLeftSub: '',
    panLeftTitle: '',
    panLeftBody: '',
    panRightWeight: '',
    panRightSub: '',
    panRightTitle: '',
    panRightBody: '',
    castTag: 'БАСТЫ РӨЛДЕР ЖӘНЕ ШЫНАЙЫ ӨЗГЕРІС',
    castTitle: 'Актёрлік құрам мен шығармашылық топ',
    castSub:
      'Ешқандай силикон мен жасанды грим жоқ — басты рөлдегі Ерсұлтан Уаис пен IBA JANA MEN қозғалысының нақты қатысушылары.',
    ensembleTag: 'ФИЛЬМНІҢ ТОЛЫҚ АКТЁРЛІК АНСАМБЛІ',
    ensembleTitle: 'Екінші пландағы актёрлер, чемпиондар және JANA MEN',
    expandCredits: 'Барлық 150+ шығармашылық топ титрін ашу',
    collapseCredits: 'Толық титрлерді жасыру',
    salesTag: 'ХАЛЫҚАРАЛЫҚ ДИСТРИБУЦИЯ ЖӘНЕ ҚҰҚЫҚТАР',
    salesTitle: 'Дистрибьюторлар мен фестивальдарға арналған материалдар',
    salesSub:
      'Фильмнің техникалық паспорты, кассалық референстері, 4K DCP кестесі және продюсермен тікелей байланыс.',
    specsHeading: 'ТЕХНИКАЛЫҚ ПАСПОРТ ЖӘНЕ СТАТУС',
    specs: [
      { k: 'ҰЗАҚТЫҒЫ', v: '110 мин', sub: 'Толық метражды фильм' },
      { k: 'ФОРМАТ', v: '4K DCP · 2.39:1', sub: '24 кадр/с · 5.1 / Atmos' },
      { k: 'СТАТУСЫ', v: 'Постпродакшн', sub: 'Алдын ала монтаж дайын', accent: true },
      { k: 'ТІЛДЕРІ', v: 'RU / KK', sub: 'EN және ZH субтитрлері' },
      { k: 'ӨНДІРІС', v: 'Қазақстан', sub: 'Big Movie Studio · Астана' },
      { k: 'РЕЛИЗ', v: '2027 көктем', sub: 'Наурыз – Мамыр 2027', accent: true },
    ],
    compsHeading: 'НАРЫҚТЫҚ РЕФЕРЕНСТЕР ЖӘНЕ КАССАЛЫҚ ДӘЛЕЛ',
    comps: [
      {
        tag: 'АНАЛОГ 01 · АЗИЯ ХИТІ',
        metric: '$480M+ ҚЫТАЙ КАССАСЫ',
        title: 'YOLO (2024)',
        body: 'Актёрдің шынайы салмақ тастауы мен «өзің үшін бір рет жеңу» тақырыбы Азияда орасан зор аудитория жинайтынын дәлелдеді.',
      },
      {
        tag: 'АНАЛОГ 02 · ФЕСТИВАЛЬДІК ДЕҢГЕЙ',
        metric: '2× ОСКАР · $55M+',
        title: 'КИТ (THE WHALE)',
        body: '200 келі кейіпкердің терең драмасы — бірақ біздің фильмде ол жарық әрі шабыттандыратын марафон финалымен ұштасады.',
      },
      {
        tag: 'АНАЛОГ 03 · БІР СЦЕНАРИСТ',
        metric: '№1 ТМД ПРОКАТЫНДА',
        title: '«Я ХУДЕЮ»',
        body: 'Сценарий авторы Константин Майер көрерменді баурайтын шынайы юмор мен коммерциялық ырғақты қалыптастырды.',
      },
    ],
    roadmapHeading: 'ПОСТПРОДАКШН ЖӘНЕ 4K DCP ДАЙЫНДАУ КЕСТЕСІ',
    roadmap: [
      {
        phase: '1-КЕЗЕҢ · ТАМ–ҚАЗ 2026',
        badge: 'ТҮСІРІЛДІ',
        title: 'Негізгі түсірілім және Астана марафоны',
        body: 'Астанадағы барлық сахналар, JANA MEN лагері және мыңдаған адам қатысқан марафон 100% нақты локацияларда түсірілді.',
      },
      {
        phase: '2-КЕЗЕҢ · ҚАР 2026 – ҚЫС',
        badge: 'ДӘЛ ҚАЗІР',
        active: true,
        title: 'Алдын ала монтаж → VFX, музыка, 5.1 және DI',
        body: 'Дистрибьюторлар үшін 3 минуттық промо және толық скринер ашық. Қыста — VFX, оркестрлік музыка және түс коррекциясы.',
      },
      {
        phase: '3-КЕЗЕҢ · НАУ–МАМ 2027',
        badge: '2027 КӨКТЕМ',
        title: '4K DCP (EN/ZH/KK/RU) және әлемдік премьера',
        body: 'Кинотеатрлық 4K DCP, субтитрлер мен халықаралық M&E жолақтарын тапсыру және прокатқа шығу.',
      },
    ],
    dealTag: 'ҚҰҚЫҚТАР ЖӘНЕ СЕРІКТЕСТІК ФОРМАТТАРЫ',
    dealTitle: 'Үлкен Қытай және әлемдік прокат құқықтары ашық',
    dealBody:
      'Құрлықтық Қытай, Гонконг, Макао, Тайвань және әлемдік аумақтар бойынша барлық құқықтар ашық (Кинотеатр, SVOD/VOD, ТВ, Әуе). Pre-Buy, бірлескен дистрибуция және MOU мүмкіндігі бар.',
    dealPills: ['ҚҰРЛЫҚТЫҚ ҚЫТАЙ', 'ГОНКОНГ ЖӘНЕ МАКАО', 'ТАЙВАНЬ', 'PRE-BUY / MOU ДАЙЫН'],
    musicTag: 'БАСТЫ САУНДТРЕК ЖӘНЕ КО-МАРКЕТИНГ',
    musicTitle: '«Я — это ты» × Димаш Құдайберген',
    musicBody:
      'Мұрат Насыровтың мұрагерлерінен әнді бейімдеуге ресми құқық алынды. Қытайлық серіктестер үшін Димаш Құдайбергенмен немесе қытай жұлдызымен бірлескен нұсқа жазу мүмкіндігі ашық.',
    musicHighlight:
      'Музыкалық құқықтар толық тазартылған — Douyin / Weibo кампанияларына дайын.',
    contactRole: 'Шоураннер және продюсер · Дистрибуция бойынша тікелей байланыс',
    contactLocation: 'BIG MOVIE STUDIO · АСТАНА, ҚАЗАҚСТАН',
    contactWechatNote: 'Тікелей телефон және WeChat ID сұраныс бойынша беріледі',
    contactInstaNote: 'Фильмнің ресми Instagram парақшасы',
    contactCopy: 'КӨШІРУ',
    contactCopied: 'КӨШІРІЛДІ',
    contactDomainLabel: 'ДОМЕН: EXTRAS.SIJICBOND.SITE',
    contactChainLabel: 'ҚҰҚЫҚТАР ТІЗБЕГІ: ТАЗА',
    deckGalleryTag: 'РЕСМИ ПРЕЗЕНТАЦИЯ СЛАЙДТАРЫ',
    deckGalleryTitle: 'Үлкен Қытайға арналған питч-дек (12 слайд)',
    deckPrimaryBtn: 'Презентацияны жүктеу (PDF)',
    deckSecondaryBtn: 'Актёрлік питч-дек (RU PDF)',
    deckSlideLabel: 'СЛАЙД',
    footerRights: '© 2026–2027 Big Movie Studio және IBA JANA MEN қозғалысы (Астана, Қазақстан). Барлық құқықтар қорғалған.',
    chapters: [
      { id: 'hero', num: '01', label: 'ПРОЛОГ' },
      { id: 'journey', num: '02', label: '42.2 КМ' },
      { id: 'lookbook', num: '03', label: 'КАДРЛАР' },
      { id: 'cast', num: '04', label: 'АКТЁРЛЕР' },
      { id: 'sales', num: '05', label: 'ҚҰҚЫҚТАР' },
    ],
  },
};

function detectInitialLang(): UILang {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('market') === 'cn' || params.get('lang') === 'zh') return 'zh';
    if (params.get('lang') === 'kk' || params.get('lang') === 'kz') return 'kk';
    if (params.get('lang') === 'ru') return 'ru';
    if (params.get('lang') === 'en') return 'en';

    const saved = localStorage.getItem('not_extra_v3_lang');
    if (saved === 'en' || saved === 'zh' || saved === 'ru' || saved === 'kk') return saved;

    const navLang = (navigator.language || '').toLowerCase();
    if (navLang.startsWith('zh')) return 'zh';
    if (navLang.startsWith('kk') || navLang.startsWith('kz')) return 'kk';
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
  const [showFullCredits, setShowFullCredits] = useState<boolean>(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState<boolean>(false);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [copiedWechat, setCopiedWechat] = useState<boolean>(false);

  const heroBgRef = useRef<HTMLImageElement | null>(null);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);

  const hideWesternSocials = lang === 'zh' || isChinaMarketUrl;
  const showRussianDeck = lang === 'ru' || lang === 'kk';
  const c = COPY[lang];

  // Pause the tiny Hero preview loop while the full 3-min Promo Modal is open (zero decoder contention)
  useEffect(() => {
    const pv = previewVideoRef.current;
    if (!pv) return;
    if (isPromoModalOpen) {
      pv.pause();
    } else {
      pv.play().catch(() => {});
    }
  }, [isPromoModalOpen]);

  const handleHeroParallax = (e: React.MouseEvent<HTMLElement>) => {
    const img = heroBgRef.current;
    if (!img) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    img.style.transform = `scale(1.05) translate3d(${(-nx * 18).toFixed(1)}px, ${(-ny * 12).toFixed(1)}px, 0)`;
  };

  const resetHeroParallax = () => {
    if (heroBgRef.current) {
      heroBgRef.current.style.transform = 'scale(1.03) translate3d(0px, 0px, 0)';
    }
  };

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

  const handleToggleSound = () => {
    soundEngine.toggle(!soundEnabled);
  };

  const handleJumpToSection = (sectionId: string) => {
    soundEngine.playUiTick();
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
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

  const handleCopyWechat = () => {
    soundEngine.playUiTick();
    navigator.clipboard?.writeText(CONTACT_CONFIG.phone).catch(() => {});
    setCopiedWechat(true);
    setTimeout(() => setCopiedWechat(false), 2200);
  };

  return (
    <div className="min-h-screen bg-[#060B14] text-[#F8FAFC] overflow-x-clip relative selection:bg-[#E61E2A] selection:text-white">

      {/* ==================== CLEAN EDITORIAL TOP BAR (ROYAL SKY NAVY — MATCHES BLUE SKY HERO) ==================== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#07336B]/95 backdrop-blur-md border-b border-white/15">
        <div className="max-w-[1380px] mx-auto px-3 sm:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo Title in Official @ne_lishnie_film Red + White Palette */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleJumpToSection('hero');
            }}
            className="flex items-center gap-2.5 group min-w-0"
          >
            <div className="hidden sm:flex w-8 h-8 rounded-full border border-[#38BDF8]/30 group-hover:border-[#E61E2A] items-center justify-center font-mono font-bold text-[10px] text-[#F8FAFC] group-hover:text-[#E61E2A] transition-colors flex-shrink-0">
              42.2
            </div>
            <div className="min-w-0">
              <div className="font-unbounded font-black text-xs sm:text-sm tracking-[0.06em] uppercase whitespace-nowrap">
                {lang === 'ru' ? (
                  <>
                    <span className="text-[#E61E2A] inline-block -skew-x-6 mr-1">НЕ</span>
                    <span className="text-[#F8FAFC]">ЛИШНИЕ</span>
                  </>
                ) : lang === 'kk' ? (
                  <>
                    <span className="text-[#F8FAFC]">АРТЫҚ</span>
                    <span className="text-[#E61E2A] inline-block -skew-x-6 ml-1">ЕМЕС</span>
                  </>
                ) : lang === 'zh' ? (
                  <>
                    <span className="text-[#E61E2A]">《绝不</span>
                    <span className="text-[#F8FAFC]">多余》</span>
                  </>
                ) : (
                  <>
                    <span className="text-[#E61E2A] inline-block -skew-x-6 mr-1">NOT</span>
                    <span className="text-[#F8FAFC]">EXTRA</span>
                  </>
                )}
              </div>
              <div className="font-mono text-[9px] text-[#94A3B8] tracking-[0.16em] uppercase hidden xl:block truncate">
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
                className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
              >
                {ch.label}
              </a>
            ))}
          </nav>

          {/* Right Controls: Pure 4-Language Switcher (EN | 中文 | RU | ҚАЗ) + Mute */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            <div
              className="flex items-center rounded-full border border-[#38BDF8]/20 bg-[#0B1424] p-0.5"
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
                        ? 'bg-[#E61E2A] text-white'
                        : 'text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleToggleSound}
              data-testid="sound-toggle-btn"
              aria-label={soundEnabled ? 'Mute' : 'Unmute'}
              className={`p-2 rounded-full border transition-all ${
                soundEnabled
                  ? 'bg-[#E61E2A]/15 border-[#E61E2A] text-[#E61E2A]'
                  : 'bg-transparent border-[#38BDF8]/20 text-[#94A3B8] hover:text-white'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ==================== SCENE 1 (HERO): LIVE ASTANA STADIUM UNDER BLUE SKY + PARALLAX + VIDEO LOOP ==================== */}
      <section
        id="hero"
        onMouseMove={handleHeroParallax}
        onMouseLeave={resetHeroParallax}
        className="relative min-h-[92vh] flex flex-col justify-between pt-20 pb-16 sm:pb-24 overflow-hidden bg-[#0E7AE0]"
      >
        {/* Authentic 35mm Astana Stadium + Baiterek Skyline + Clear Blue Sky (94KB WebP) with Mouse 3D Parallax */}
        <img
          ref={heroBgRef}
          src="./stills/hero_stadium_sky.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-bottom pointer-events-none select-none transition-transform duration-300 ease-out will-change-transform"
          style={{ transform: 'scale(1.03) translate3d(0px, 0px, 0)' }}
        />

        {/* Subtle Moving Daylight Clouds Veil Across Upper Sky (Zero JS CPU) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-16 top-0 h-[55%] z-[3] animate-cloud-drift opacity-45"
          style={{
            background:
              'radial-gradient(ellipse 36% 24% at 24% 34%, rgba(255,255,255,0.42) 0%, transparent 72%), radial-gradient(ellipse 42% 28% at 72% 26%, rgba(255,255,255,0.38) 0%, transparent 72%)',
          }}
        />

        {/* Delicate Editorial Contrast Scrim ONLY Behind Left Text (Leaves Blue Sky, Stadium Pitch, Track & Baiterek Vivid!) */}
        <div
          className="absolute inset-0 pointer-events-none z-[5]"
          style={{
            background:
              'linear-gradient(100deg, rgba(4,44,98,0.68) 0%, rgba(7,64,136,0.38) 46%, rgba(7,64,136,0.06) 76%, transparent 100%), linear-gradient(180deg, rgba(4,40,88,0.42) 0%, transparent 24%, transparent 86%, rgba(245,247,251,0.92) 100%)',
          }}
        />

        <div className="relative z-20 max-w-[1340px] mx-auto px-4 sm:px-8 w-full flex-1 flex flex-col justify-between gap-8">
          {/* Minimal Top Metadata Strip */}
          <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-6 pb-3 border-b border-white/25 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em]">
            <div className="flex items-center gap-2 text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E61E2A]" />
              <span>{c.slateMeta}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-white/95">
              <span className="text-amber-200 font-semibold">{c.statusText}</span>
              <span className="text-white/40">·</span>
              <span className="text-white font-bold">{c.releaseText}</span>
            </div>
          </div>

          {/* Main 12-Col Hero Grid */}
          <div className="my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-4 sm:py-8">
            {/* Left 7 Cols */}
            <div className="lg:col-span-7 space-y-5">
              <div className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.24em] text-white/95 drop-shadow-[0_1px_8px_rgba(7,51,107,0.35)]">
                {c.genre}
              </div>

              <div>
                <h1 className="font-unbounded font-black text-4xl sm:text-6xl lg:text-[5.5rem] uppercase leading-[0.96] tracking-[-0.025em]">
                  {lang === 'ru' ? (
                    <>
                      <span className="text-[#E61E2A] inline-block -skew-x-6 mr-2 drop-shadow-[0_4px_18px_rgba(0,0,0,0.38)]">
                        НЕ
                      </span>
                      <span className="text-white drop-shadow-[0_4px_20px_rgba(7,51,107,0.45)]">ЛИШНИЕ</span>
                    </>
                  ) : lang === 'kk' ? (
                    <>
                      <span className="text-white drop-shadow-[0_4px_20px_rgba(7,51,107,0.45)]">АРТЫҚ</span>
                      <span className="text-[#E61E2A] inline-block -skew-x-6 ml-3 drop-shadow-[0_4px_18px_rgba(0,0,0,0.38)]">
                        ЕМЕС
                      </span>
                    </>
                  ) : lang === 'zh' ? (
                    <>
                      <span className="text-[#E61E2A] drop-shadow-[0_4px_18px_rgba(0,0,0,0.38)]">《绝不</span>
                      <span className="text-white drop-shadow-[0_4px_20px_rgba(7,51,107,0.45)]">多余》</span>
                    </>
                  ) : (
                    <>
                      <span className="text-[#E61E2A] inline-block -skew-x-6 mr-3 drop-shadow-[0_4px_18px_rgba(0,0,0,0.38)]">
                        NOT
                      </span>
                      <span className="text-white drop-shadow-[0_4px_20px_rgba(7,51,107,0.45)]">EXTRA</span>
                    </>
                  )}
                </h1>
                <div className="mt-2.5 font-mono text-[11px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-white drop-shadow-[0_1px_10px_rgba(7,51,107,0.4)]">
                  {lang === 'ru'
                    ? 'ФИЛЬМ АЙТЫМА ЖАКУПОВА'
                    : lang === 'kk'
                    ? 'АЙТЫМ ЖАҚЫПОВТЫҢ ФИЛЬМІ'
                    : lang === 'zh'
                    ? '艾特姆·扎库波夫作品 · BIG MOVIE STUDIO × IBA JANA MEN'
                    : 'A FILM BY AITYM ZHAKUPOV'}
                </div>
              </div>

              <p className="text-lg sm:text-2xl font-bold text-white leading-snug max-w-2xl drop-shadow-[0_2px_12px_rgba(7,51,107,0.35)]">
                {c.heroPitch}
              </p>

              <p className="text-sm sm:text-[15px] text-white/95 font-medium leading-relaxed max-w-2xl drop-shadow-[0_1px_8px_rgba(7,51,107,0.3)]">
                {c.heroHook}
              </p>

              {/* Clean Document Actions (RU & KK also include original Russian Deck; EN & ZH show ONLY International/China Deck) */}
              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                {SITE_MODE === 'DISTRIBUTOR' ? (
                  <>
                    <a
                      href={CONTACT_CONFIG.pitchDeckUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid="hero-download-deck-btn"
                      className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-white hover:bg-[#E61E2A] text-[#07336B] hover:text-white font-mono font-bold text-xs uppercase tracking-[0.14em] shadow-[0_12px_28px_rgba(7,51,107,0.28)] transition-all"
                    >
                      <FileDown className="w-4 h-4" />
                      <span>{c.heroDeckBtn}</span>
                    </a>

                    {showRussianDeck && (
                      <a
                        href={CONTACT_CONFIG.ruDeckUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid="hero-ru-deck-btn"
                        className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-[#07336B]/75 hover:bg-[#07336B] border border-white/45 text-white font-mono font-semibold text-xs uppercase tracking-[0.12em] backdrop-blur-sm transition-all"
                      >
                        <FileDown className="w-4 h-4 text-sky-300" />
                        <span>{lang === 'kk' ? 'Орысша презентация (PDF)' : 'Презентация RU (PDF)'}</span>
                      </a>
                    )}
                  </>
                ) : (
                  <a
                    href={CONTACT_CONFIG.ticketsUrl}
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#E61E2A] hover:bg-white text-white hover:text-[#07336B] font-mono font-bold text-xs uppercase tracking-[0.14em] shadow-lg transition-all"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>{c.heroTicketsBtn}</span>
                  </a>
                )}

                <a
                  href="#journey"
                  onClick={(e) => {
                    e.preventDefault();
                    handleJumpToSection('journey');
                  }}
                  className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-white hover:text-amber-200 drop-shadow-[0_1px_6px_rgba(7,51,107,0.4)] transition-colors"
                >
                  {lang === 'zh'
                    ? '跟随 42.2 公里蜕变路线 ↓'
                    : lang === 'kk'
                    ? '42.2 км марафон жолы ↓'
                    : lang === 'ru'
                    ? 'Пройти марафон 42.2 км ↓'
                    : 'Run the 42.2 km Journey ↓'}
                </a>
              </div>
            </div>

            {/* Right 5 Cols: THE Single Live Silent Cinema Teaser Card (151KB Loop -> Click for Full 3-Min Audio Promo) */}
            <div className="lg:col-span-5">
              <button
                type="button"
                onClick={handleOpenPromo}
                data-testid="hero-video-poster-card"
                aria-label={c.heroPromoBtn}
                className="group relative block w-full rounded-2xl overflow-hidden border-2 border-white/60 hover:border-[#E61E2A] bg-[#060B14] text-left shadow-[0_28px_70px_rgba(4,24,58,0.48)] transition-all"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                  <video
                    ref={previewVideoRef}
                    src="./hero_preview_loop.mp4"
                    poster="./stills/hero_vest_web.webp"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060B14]/85 via-transparent to-[#060B14]/25" />

                  <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em]">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#060B14]/80 text-white">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E61E2A]" />
                      {lang === 'zh'
                        ? '中文字幕 · 03:00'
                        : lang === 'kk'
                        ? 'ПРОМО · 03:00'
                        : lang === 'ru'
                        ? 'ПРОМО · 03:00'
                        : 'CHN SUBS · 03:00'}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-[#060B14]/70 text-sky-300">
                      2.39:1
                    </span>
                  </div>

                  {/* Single Signature Red Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#E61E2A] group-hover:scale-110 border-2 border-white/40 flex items-center justify-center shadow-[0_0_40px_rgba(230,30,42,0.55)] transition-transform duration-300">
                      <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-current ml-1" />
                    </div>
                  </div>

                  <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between font-mono text-[10px] text-white/95 tracking-[0.14em] uppercase">
                    <span>{c.heroPromoBtn}</span>
                    <span className="text-sky-300">FAST STREAM</span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SCENE 2: ILLUSTRATED ASTANA 42.2 KM MARATHON JOURNEY (SLIMMING RUNNER!) ==================== */}
      <AstanaMarathonJourney lang={lang} />

      {/* ==================== SCENE 4: DIRECTOR'S STATEMENT & 35MM LOOKBOOK ==================== */}
      <CinemaLookbookSection lang={lang} />

      {/* ==================== SCENE 4: EDITORIAL LIGHT CAST & CREW EXHIBITION (23 VERIFIED FACES) ==================== */}
      <section id="cast" className="py-20 sm:py-28 bg-white text-[#0B172A]">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-8">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#E61E2A] mb-3">
              <Award className="w-3.5 h-3.5" />
              <span>{c.castTag}</span>
            </div>
            <h2 className="font-unbounded font-black text-2xl sm:text-4xl text-[#0B172A] mb-3">
              {c.castTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-600">{c.castSub}</p>
          </div>

          {/* 3x2 Lead Cast Cards (Magazine Portrait Style) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mb-16">
            {CAST_DATA.map((actor) => (
              <div
                key={actor.id}
                className="group rounded-2xl bg-[#F8FAFC] border border-slate-200/80 shadow-[0_12px_36px_rgba(11,23,42,0.06)] hover:shadow-[0_18px_48px_rgba(11,23,42,0.12)] overflow-hidden flex flex-col justify-between transition-all duration-300"
              >
                <div>
                  <div className="aspect-[4/5] bg-slate-900 relative overflow-hidden flex items-center justify-center">
                    <img
                      src={`${actor.image}?v=6`}
                      alt={actor.actor[lang]}
                      className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-700"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060B14]/90 via-transparent to-transparent" />
                    <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-[#060B14]/80 text-white font-mono text-[9px] font-semibold uppercase tracking-[0.14em]">
                      {actor.badge[lang]}
                    </span>
                    <div className="absolute bottom-4 left-5 right-5">
                      <h3 className="font-unbounded font-bold text-lg text-white">
                        {actor.actor[lang]}
                      </h3>
                      <div className="font-mono text-[10px] text-sky-300 mt-1">
                        {actor.characterName[lang]} · {actor.role[lang]}
                      </div>
                    </div>
                  </div>
                  <div className="p-5 sm:p-6">
                    <p className="text-xs sm:text-[13.5px] text-slate-600 leading-relaxed">
                      {actor.desc[lang]}
                    </p>
                  </div>
                </div>
                <div className="px-5 py-3.5 bg-white border-t border-slate-200/70 flex items-center justify-between gap-2 text-xs">
                  <span className="font-mono font-bold text-[11px] text-[#E61E2A]">{actor.metric}</span>
                  <span className="font-mono text-[10px] text-slate-500 text-right">
                    {actor.metricLabel[lang]}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Supporting Cast & Real JANA MEN Alumni */}
          <div className="mb-16">
            <div className="mb-7 pb-4 border-b border-slate-200">
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#2563EB] mb-1">
                {c.ensembleTag}
              </div>
              <h3 className="font-unbounded font-bold text-xl sm:text-2xl text-[#0B172A]">
                {c.ensembleTitle}
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
              {ENSEMBLE_CAST_DATA.map((item, idx) => {
                const isWideGroup = item.image.includes('janamen_participants');
                return (
                  <div
                    key={idx}
                    className={`group rounded-2xl bg-slate-900 shadow-md overflow-hidden flex flex-col justify-between transition-all ${
                      isWideGroup ? 'col-span-2 sm:col-span-2 md:col-span-3' : ''
                    }`}
                  >
                    <div
                      className={`${
                        isWideGroup ? 'h-full min-h-[240px]' : 'aspect-[4/5]'
                      } w-full relative overflow-hidden flex items-center justify-center`}
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
                      <div className="absolute inset-0 bg-gradient-to-t from-[#060B14]/90 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3.5 right-3.5">
                        <div className="font-unbounded font-bold text-xs sm:text-sm text-white leading-snug">
                          {item.name[lang]}
                        </div>
                        <div className="font-mono text-[10px] text-sky-300 mt-0.5 leading-tight">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {KEY_CREW_DATA.map((crew, idx) => (
              <div key={idx} className="rounded-2xl bg-[#F8FAFC] border border-slate-200 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={crew.photo}
                      alt={crew.name[lang]}
                      className="w-14 h-14 rounded-xl object-cover object-top border border-slate-200 flex-shrink-0 bg-slate-100"
                      loading="lazy"
                      decoding="async"
                    />
                    <div>
                      <h4 className="font-unbounded font-bold text-sm text-[#0B172A]">
                        {crew.name[lang]}
                      </h4>
                      <div className="font-mono text-[10px] font-semibold text-[#E61E2A] mt-1 leading-snug">
                        {crew.role[lang]}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                    {crew.bio[lang]}
                  </p>
                </div>
                {crew.link && !hideWesternSocials && (
                  <div className="mt-4 pt-3 border-t border-slate-200">
                    <a
                      href={crew.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#2563EB] hover:text-[#E61E2A]"
                    >
                      {crew.linkLabel}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Expandable Full Official Crew Roll */}
          <div className="rounded-2xl bg-[#F8FAFC] border border-slate-200 overflow-hidden">
            <button
              type="button"
              onClick={() => {
                soundEngine.playUiTick();
                setShowFullCredits((v) => !v);
              }}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-100 transition-colors"
            >
              <span className="font-mono font-bold text-xs uppercase tracking-[0.14em] text-[#0B172A]">
                {showFullCredits ? c.collapseCredits : c.expandCredits}
              </span>
              {showFullCredits ? (
                <ChevronUp className="w-4 h-4 text-[#E61E2A]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#E61E2A]" />
              )}
            </button>

            <div className={`p-6 border-t border-slate-200 ${showFullCredits ? 'block' : 'hidden md:block'}`}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {FULL_CREDITS_DATA.map((dept, dIdx) => (
                  <div key={dIdx} className="rounded-xl bg-white border border-slate-200 p-5 space-y-2.5">
                    <h5 className="font-mono font-bold text-[10px] uppercase tracking-[0.18em] text-[#2563EB] border-b border-slate-200 pb-2">
                      {dept.department[lang]}
                    </h5>
                    {dept.members.map((m, mIdx) => (
                      <div key={mIdx} className="text-xs border-b border-slate-100 pb-2 last:border-none">
                        <div className="text-slate-500">{m.role[lang]}</div>
                        <div className="font-semibold text-[#0B172A] mt-0.5">{m.name[lang]}</div>
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
        className="py-20 sm:py-28 border-t-2 border-[#E61E2A]/70 bg-[#060B14] relative"
      >
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8 space-y-14">
          {/* Header */}
          <div className="pb-8 hairline-dashed-b">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E61E2A] mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{c.salesTag}</span>
              </div>
              <h2 className="font-unbounded font-bold text-2xl sm:text-4xl text-[#F8FAFC] mb-2">
                {c.salesTitle}
              </h2>
              <p className="text-sm text-[#94A3B8]">{c.salesSub}</p>
            </div>
          </div>

          {/* 1. Technical Passport */}
          <div>
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#38BDF8] mb-4">
              {c.specsHeading}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-[#F8FAFC]/10 border border-[#F8FAFC]/10 rounded-2xl overflow-hidden">
              {c.specs.map((sp, i) => (
                <div key={i} className="p-5 bg-[#0A1322]">
                  <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#64748B]">{sp.k}</div>
                  <div
                    className={`font-semibold text-xs sm:text-sm mt-1.5 ${
                      sp.accent ? 'text-[#E61E2A]' : 'text-[#F8FAFC]'
                    }`}
                  >
                    {sp.v}
                  </div>
                  <div className="text-[10px] text-[#94A3B8] mt-1">{sp.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Market Comparables (COMPS) */}
          <div>
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#38BDF8] mb-4">
              {c.compsHeading}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#F8FAFC]/10 border border-[#F8FAFC]/10 rounded-2xl overflow-hidden">
              {c.comps.map((cp, idx) => (
                <div key={idx} className="p-6 bg-[#0A1322] space-y-2">
                  <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.14em]">
                    <span className="text-[#E61E2A] font-bold">{cp.tag}</span>
                    <span className="text-[#F8FAFC]">{cp.metric}</span>
                  </div>
                  <div className="font-unbounded font-bold text-base text-[#F8FAFC]">{cp.title}</div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">{cp.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Post-Production Roadmap */}
          <div>
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#38BDF8] mb-4">
              {c.roadmapHeading}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {c.roadmap.map((rm, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl border ${
                    rm.active
                      ? 'bg-[#0B1424] border-[#E61E2A]/70'
                      : 'bg-[#0A1322] border-[#F8FAFC]/10'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.12em] mb-3">
                    <span className={rm.active ? 'text-[#E61E2A] font-bold' : 'text-[#94A3B8]'}>
                      {rm.phase}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 ${
                        rm.active
                          ? 'px-2 py-0.5 rounded-full bg-[#E61E2A] text-[#060B14] text-[9px] font-bold'
                          : 'text-[#38BDF8]'
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
                  <h4 className="font-unbounded font-bold text-sm sm:text-base text-[#F8FAFC] mb-2">
                    {rm.title}
                  </h4>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">{rm.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Deal Structure + Flagship Music + Direct Producer Contact Desk */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-7 grid grid-cols-1 gap-6">
              <div className="p-6 sm:p-7 rounded-2xl bg-[#0A1322] border border-[#F8FAFC]/10 flex flex-col justify-between">
                <div>
                  <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#38BDF8] mb-2">
                    {c.dealTag}
                  </div>
                  <h3 className="font-unbounded font-bold text-lg text-[#F8FAFC] mb-2.5">
                    {c.dealTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed mb-4">
                    {c.dealBody}
                  </p>
                </div>
                <div className="pt-3.5 hairline-dashed flex flex-wrap gap-2 font-mono text-[10px] text-[#E2E8F0]">
                  {c.dealPills.map((pill, idx) => (
                    <span
                      key={idx}
                      className={`px-2.5 py-1 rounded-full bg-[#111F36] border ${
                        idx === c.dealPills.length - 1
                          ? 'border-[#E61E2A]/45 text-[#E61E2A]'
                          : 'border-[#F8FAFC]/10'
                      }`}
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 sm:p-7 rounded-2xl bg-[#0B1424] border border-[#38BDF8]/30 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#38BDF8] mb-2">
                    <Disc className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '10s' }} />
                    <span>{c.musicTag}</span>
                  </div>
                  <h3 className="font-unbounded font-bold text-lg text-[#F8FAFC] mb-2">
                    {c.musicTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed mb-4">
                    {c.musicBody}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#060B14] border border-[#38BDF8]/25 text-xs text-[#E2E8F0]">
                  ★ {c.musicHighlight}
                </div>
              </div>
            </div>

            {/* Direct Executive Contact Desk (Strictly hides Instagram in ZH / ?market=cn) */}
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-[#0B1424] border border-[#F8FAFC]/16 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#E61E2A]">
                  {c.contactLocation}
                </div>
                <h3 className="font-unbounded font-bold text-xl text-[#F8FAFC]">
                  {lang === 'zh'
                    ? '谢尔盖·邦达列夫 (Sergey Bondarev)'
                    : lang === 'ru' || lang === 'kk'
                    ? 'Сергей Бондарев'
                    : 'Sergey Bondarev'}
                </h3>
                <div className="text-xs text-[#94A3B8]">{c.contactRole}</div>

                {/* Corporate Email + 1-Click Copy */}
                <div className="p-3.5 rounded-xl bg-[#060B14] border border-[#F8FAFC]/12 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <Mail className="w-4 h-4 text-[#E61E2A] flex-shrink-0" />
                    <div className="truncate">
                      <a
                        href={`mailto:${CONTACT_CONFIG.email}`}
                        className="font-mono font-semibold text-xs sm:text-sm text-[#F8FAFC] hover:text-[#E61E2A] truncate block"
                      >
                        {CONTACT_CONFIG.email}
                      </a>
                      <div className="text-[10px] text-[#64748B]">{CONTACT_CONFIG.altEmail}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="px-3 py-1.5 rounded-full bg-[#111F36] hover:bg-[#F8FAFC] text-[#F8FAFC] hover:text-[#060B14] text-[10px] font-mono font-semibold transition-colors flex items-center gap-1 flex-shrink-0"
                  >
                    {copiedEmail ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedEmail ? c.contactCopied : c.contactCopy}</span>
                  </button>
                </div>

                {/* Phone */}
                <a
                  href={CONTACT_CONFIG.phoneHref}
                  className="p-3.5 rounded-xl bg-[#060B14] border border-[#F8FAFC]/12 hover:border-[#38BDF8]/60 flex items-center gap-3 transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#38BDF8] flex-shrink-0" />
                  <div>
                    <div className="font-mono font-semibold text-xs sm:text-sm text-[#F8FAFC]">
                      {CONTACT_CONFIG.phone}
                    </div>
                    <div className="text-[10px] text-[#64748B]">
                      {lang === 'zh' ? '直联手机 / 微信同号 (WeChat)' : c.contactWechatNote}
                    </div>
                  </div>
                </a>

                {/* Social Channel: WeChat (+7 776 800 6262) for Chinese | Instagram (@ne_lishnie_film) for RU / KK / EN */}
                {hideWesternSocials ? (
                  <div
                    data-testid="wechat-contact-card"
                    className="p-3.5 rounded-xl bg-[#071F14] border border-[#07C160]/45 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <MessageCircle className="w-4 h-4 text-[#07C160] flex-shrink-0" />
                      <div className="truncate">
                        <div className="font-mono font-bold text-xs sm:text-sm text-[#F8FAFC]">
                          WeChat / 微信: {CONTACT_CONFIG.phone}
                        </div>
                        <div className="text-[10px] text-[#86EFAC]">
                          复制微信号直接联系制片人 (谢尔盖)
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyWechat}
                      data-testid="copy-wechat-btn"
                      className="px-3 py-1.5 rounded-full bg-[#07C160] hover:bg-white text-[#060B14] text-[10px] font-mono font-bold transition-colors flex items-center gap-1 flex-shrink-0"
                    >
                      {copiedWechat ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedWechat ? c.contactCopied : '复制微信'}</span>
                    </button>
                  </div>
                ) : (
                  <a
                    href={CONTACT_CONFIG.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="instagram-link"
                    className="p-3.5 rounded-xl bg-[#060B14] border border-[#F8FAFC]/12 hover:border-[#E61E2A]/60 flex items-center gap-3 transition-colors"
                  >
                    <Instagram className="w-4 h-4 text-[#E61E2A] flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-xs sm:text-sm text-[#F8FAFC]">@ne_lishnie_film</div>
                      <div className="text-[10px] text-[#64748B]">{c.contactInstaNote}</div>
                    </div>
                  </a>
                )}
              </div>

              <div className="mt-6 pt-4 hairline-dashed flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] text-[#64748B]">
                <span>{c.contactDomainLabel}</span>
                <span className="text-[#38BDF8]">{c.contactChainLabel}</span>
              </div>
            </div>
          </div>

          {/* 5. Official Pitch Deck Slide Preview Gallery */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0A1322] border border-[#F8FAFC]/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 hairline-dashed-b">
              <div>
                <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#E61E2A]">
                  {c.deckGalleryTag}
                </div>
                <h3 className="font-unbounded font-bold text-lg sm:text-2xl text-[#F8FAFC] mt-1">
                  {c.deckGalleryTitle}
                </h3>
              </div>
              {showRussianDeck && (
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href={CONTACT_CONFIG.ruDeckUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="ru-deck-link"
                    className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#38BDF8] hover:text-white transition-colors"
                  >
                    {c.deckSecondaryBtn} ↗
                  </a>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 9, 11].map((sNum) => (
                <a
                  key={`cn-${sNum}`}
                  href={CONTACT_CONFIG.pitchDeckUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl overflow-hidden border border-[#F8FAFC]/10 hover:border-[#E61E2A]/70 bg-[#040810] transition-all"
                >
                  <img
                    src={`./slides/cn_slide_${String(sNum).padStart(2, '0')}.png?v=6`}
                    alt={`${c.deckSlideLabel} ${sNum}`}
                    className="w-full aspect-video object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="px-3 py-2 font-mono text-[10px] text-[#94A3B8] flex justify-between">
                    <span>
                      {lang === 'zh'
                        ? `第 ${String(sNum).padStart(2, '0')} 页`
                        : `${c.deckSlideLabel} ${String(sNum).padStart(2, '0')}`}
                    </span>
                    <span className="text-[#E61E2A]">PDF ↗</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CLEAN FOOTER */}
      <footer className="pt-12 pb-28 hairline-dashed bg-[#040810] text-center">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8 space-y-3">
          <div className="font-unbounded font-bold text-xs sm:text-sm tracking-[0.2em] uppercase text-[#F8FAFC]">
            {c.filmTitle}
          </div>
          <p className="text-xs text-[#64748B] max-w-2xl mx-auto">{c.footerRights}</p>
          <div className="flex flex-wrap items-center justify-center gap-6 font-mono text-[11px] text-[#94A3B8] pt-2">
            <a href={`mailto:${CONTACT_CONFIG.email}`} className="hover:text-[#E61E2A] transition-colors">
              {CONTACT_CONFIG.email}
            </a>
            <a href={CONTACT_CONFIG.phoneHref} className="hover:text-[#F8FAFC] transition-colors">
              {CONTACT_CONFIG.phone}
            </a>
            {!hideWesternSocials && (
              <a
                href={CONTACT_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E61E2A] transition-colors"
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
