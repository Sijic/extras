import React, { useState, useEffect } from 'react';
import { Camera, X, ChevronLeft, ChevronRight, Maximize2, Quote } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { UILang } from './PromoPlayerModal';

interface LookbookFrame {
  id: string;
  frameNum: string;
  act: 'act1' | 'act2' | 'act3';
  actLabel: Record<UILang, string>;
  image: string;
  lens: Record<UILang, string>;
  title: Record<UILang, string>;
  caption: Record<UILang, string>;
}

const LOOKBOOK_FRAMES: LookbookFrame[] = [
  {
    id: 'fr01',
    frameNum: '01',
    act: 'act1',
    actLabel: { en: 'ACT I', zh: '第一幕', ru: 'АКТ I', kk: 'I АКТ' },
    image: './stills/still_bridge_rasul.jpg',
    lens: {
      en: '35MM ANAMORPHIC · DAY',
      zh: '35毫米宽银幕 · 日景',
      ru: '35ММ АНАМОРФОТ · ДЕНЬ',
      kk: '35ММ АНАМОРФОТ · КҮНДІЗ',
    },
    title: {
      ru: 'Мост через Ишим · Пролог-грёза',
      en: 'Astana Bridge · The Mirage Prologue',
      zh: '伊希姆河大桥 · 幻境序幕',
      kk: 'Есіл көпірі · Арман прологы',
    },
    caption: {
      ru: 'Мираж лёгкого бега над рекой обрывается удушьем 207-килограммового тела.',
      en: 'A sunlit dream of effortless running fractures into the reality of 207 kg.',
      zh: '阳光下轻盈奔跑的幻梦瞬间破碎，坠回207公斤的沉重现实。',
      kk: 'Өзен үстімен жеңіл жүгірген қиял 207 келі дененің ауыр шындығымен үзіледі.',
    },
  },
  {
    id: 'fr02',
    frameNum: '02',
    act: 'act1',
    actLabel: { en: 'ACT I', zh: '第一幕', ru: 'АКТ I', kk: 'I АКТ' },
    image: './stills/still_room_posters_80s.jpg',
    lens: {
      en: '35MM T2.0 · INTERIOR',
      zh: '35毫米 · 室内暖光',
      ru: '35ММ T2.0 · ИНТЕРЬЕР',
      kk: '35ММ T2.0 · ИНТЕРЬЕР',
    },
    title: {
      ru: 'Каморка стадиона · Постеры Джеки Чана и VHS',
      en: 'Stadium Room · 1980s Jackie Chan Posters & VHS',
      zh: '看台储物间 · 80年代成龙与李小龙海报',
      kk: 'Стадион бөлмесі · Джеки Чан постерлері мен VHS',
    },
    caption: {
      ru: 'Подтрибунный мир Расула: старый телевизор и герои гонконгского кино 80-х.',
      en: 'Rasul’s secret refuge lined with classic 1980s Hong Kong martial arts posters.',
      zh: '拉苏尔的精神庇护所：旧显像管电视与贴满墙面的黄金港片海报。',
      kk: 'Расулдың жасырын әлемі: ескі теледидар және 80-жылдардағы гонконг киносының батырлары.',
    },
  },
  {
    id: 'fr03',
    frameNum: '03',
    act: 'act1',
    actLabel: { en: 'ACT I', zh: '第一幕', ru: 'АКТ I', kk: 'I АКТ' },
    image: './stills/still_stadium_vest.jpg',
    lens: {
      en: '50MM · NIGHT STADIUM',
      zh: '50毫米 · 夜间球场',
      ru: '50ММ · НОЧНОЙ СТАДИОН',
      kk: '50ММ · ТҮНГІ СТАДИОН',
    },
    title: {
      ru: 'Оранжевый жилет · «Невидимка» на стадионе',
      en: 'The Orange Vest · Invisible Stadium Janitor',
      zh: '橙色背心 · 体育场的“透明人”',
      kk: 'Қызғылт-сары жилет · Стадиондағы «көрінбейтін» жан',
    },
    caption: {
      ru: 'Сигнальный жилет уборщика — единственный яркий цвет в холодном бетоне.',
      en: 'Safety-orange janitor vest cutting through the cold night concrete.',
      zh: '冰冷黑夜中唯一耀眼的色彩——球场清洁工拉苏尔的橙色背心。',
      kk: 'Суық түнгі бетон арасындағы жалғыз жарқын түс — тазалаушының жилеті.',
    },
  },
  {
    id: 'fr04',
    frameNum: '04',
    act: 'act1',
    actLabel: { en: 'ACT I', zh: '第一幕', ru: 'АКТ I', kk: 'I АКТ' },
    image: './stills/still_track_night.jpg',
    lens: {
      en: '28MM WIDE · NIGHT TRACK',
      zh: '28毫米广角 · 深夜跑道',
      ru: '28ММ · НОЧНАЯ ДОРОЖКА',
      kk: '28ММ · ТҮНГІ ЖҮГІРУ ЖОЛЫ',
    },
    title: {
      ru: 'Ночная дорожка · Роковой сбой дыхания',
      en: 'The Night Track · Fatal Asthma Collapse',
      zh: '深夜跑道 · 命运转折之夜',
      kk: 'Түнгі жолақ · Тағдырлы түн',
    },
    caption: {
      ru: 'Случайная гибель марафонца Артёма запускает цепь событий и путь искупления.',
      en: 'Runner Artyom’s collapse on cracked asphalt ignites Rasul’s journey of atonement.',
      zh: '跑者阿尔乔姆在开裂跑道上的意外倒下，开启拉苏尔的赎罪征程。',
      kk: 'Марафоншы Артёмның кездейсоқ қазасы Расулдың өзін табу жолын бастайды.',
    },
  },
  {
    id: 'fr05',
    frameNum: '05',
    act: 'act1',
    actLabel: { en: 'ACT I', zh: '第一幕', ru: 'АКТ I', kk: 'I АКТ' },
    image: './stills/still_diary_watch.jpg',
    lens: {
      en: '85MM MACRO · PROP',
      zh: '85毫米特写 · 日记道具',
      ru: '85ММ МАКРО · РЕКВИЗИТ',
      kk: '85ММ МАКРО · РЕКВИЗИТ',
    },
    title: {
      ru: 'Тюремный штамп «ДОСМОТРЕНО» · Дневник Артёма',
      en: 'Prison-Stamped Diary · The Camp Address',
      zh: '盖有审查印章的日记 · 命运的线索',
      kk: 'Түрме мөрі басылған күнделік · Лагерь мекенжайы',
    },
    caption: {
      ru: 'Потрёпанная тетрадь со штампом досмотра и адресом центра «Лишние».',
      en: 'The weathered prison-inspected notebook leading Rasul to the "Not Extra" camp.',
      zh: '这本盖有监狱审查印章的破旧笔记本，指引拉苏尔找到“绝不多余”训练营。',
      kk: 'Тексеру мөрі бар ескі дәптер Расулды «Артық емес» лагеріне жетелейді.',
    },
  },
  {
    id: 'fr06',
    frameNum: '06',
    act: 'act2',
    actLabel: { en: 'ACT II', zh: '第二幕', ru: 'АКТ II', kk: 'II АКТ' },
    image: './stills/still_janamen_orange_lineup.jpg',
    lens: {
      en: '40MM · BACKLIT HAZE',
      zh: '40毫米 · 逆光训练馆',
      ru: '40ММ · КОНТРОВЫЙ СВЕТ',
      kk: '40ММ · ЖАТТЫҒУ ЗАЛЫ',
    },
    title: {
      ru: 'Построение JANA MEN · Братство в оранжевом',
      en: 'JANA MEN Lineup · Brotherhood in Orange',
      zh: 'JANA MEN 集结列队 · 橙色兄弟连',
      kk: 'JANA MEN сап түзеуі · Бірлік пен жігер',
    },
    caption: {
      ru: 'Реальные участники движения IBA JANA MEN, сбросившие в сумме более 1 500 кг.',
      en: 'Real IBA JANA MEN camp alumni who collectively shed over 1,500 kg.',
      zh: '真实减重公益组织 IBA JANA MEN 学员本色出演，累计减重超1500公斤。',
      kk: 'Жалпы 1 500 келіден астам салмақ тастаған IBA JANA MEN қозғалысының нақты қатысушылары.',
    },
  },
  {
    id: 'fr07',
    frameNum: '07',
    act: 'act2',
    actLabel: { en: 'ACT II', zh: '第二幕', ru: 'АКТ II', kk: 'II АКТ' },
    image: './stills/still_aitym_mentor.jpg',
    lens: {
      en: '75MM CLOSE-UP · CAMP',
      zh: '75毫米特写 · 训练营',
      ru: '75ММ КРУПНЫЙ ПЛАН',
      kk: '75ММ ІРІ ПЛАН',
    },
    title: {
      ru: 'Наставник Айтым · Хирургия духа',
      en: 'Mentor Aitym · No Self-Pity',
      zh: '导师艾特姆 · 直击灵魂的较量',
      kk: 'Тәлімгер Айтым · Рух сынағы',
    },
    caption: {
      ru: 'Основатель JANA MEN Айтым Жакупов играет самого себя — жёстко и честно.',
      en: 'Real-life movement founder Aitym Zhakupov portrays himself on screen.',
      zh: 'JANA MEN 创始人艾特姆本色出演，撕下逃避与自怜的伪装。',
      kk: 'JANA MEN негізін қалаушы Айтым Жақыпов экранда өз-өзін шынайы сомдайды.',
    },
  },
  {
    id: 'fr08',
    frameNum: '08',
    act: 'act2',
    actLabel: { en: 'ACT II', zh: '第二幕', ru: 'АКТ II', kk: 'II АКТ' },
    image: './stills/still_elvira_shoelaces.jpg',
    lens: {
      en: '50MM · LOCKER ROOM',
      zh: '50毫米 · 更衣室',
      ru: '50ММ · РАЗДЕВАЛКА',
      kk: '50ММ · КИІНУ БӨЛМЕСІ',
    },
    title: {
      ru: 'Урок шнурков · Эльвира и Расул',
      en: 'Tying the Knot · Elvira & Rasul',
      zh: '系紧鞋带 · 艾尔薇拉与拉苏尔',
      kk: 'Бәтеңке бауы · Эльвира мен Расул',
    },
    caption: {
      ru: 'Эльвира впервые учит взрослого великана завязывать двойной узел на кроссовках.',
      en: 'Elvira gently teaches the 200-kg janitor to tie a secure double knot for the first time.',
      zh: '外冷内热的管理员艾尔薇拉，第一次耐心教会200公斤的拉苏尔系紧双结。',
      kk: 'Эльвира 200 келі алыпқа алғаш рет кроссовкасының бауын өзі байлауды үйретеді.',
    },
  },
  {
    id: 'fr09',
    frameNum: '09',
    act: 'act2',
    actLabel: { en: 'ACT II', zh: '第二幕', ru: 'АКТ II', kk: 'II АКТ' },
    image: './stills/still_camp_dining.jpg',
    lens: {
      en: '35MM · CAMP DINING',
      zh: '35毫米 · 营地食堂',
      ru: '35ММ · СТОЛОВАЯ ЛАГЕРЯ',
      kk: '35ММ · ЛАГЕРЬ АСХАНАСЫ',
    },
    title: {
      ru: 'Столовая лагеря · Первая дружба и юмор',
      en: 'Camp Dining Hall · Brotherhood & Warmth',
      zh: '训练营食堂 · 温情幽默的同伴情谊',
      kk: 'Лагерь асханасы · Достық пен жылулық',
    },
    caption: {
      ru: 'Человеческая теплота и юмор драмеди от сценариста блокбастера «Я худею».',
      en: 'Heartfelt humor and camaraderie penned by "I Am Losing Weight" writer Konstantin Mayer.',
      zh: '由票房喜剧大片《我是如何减肥的》编剧操刀，笑泪交织的草根温暖。',
      kk: '«Я худею» хитінің сценарисі Константин Майер жазған шынайы юмор мен бауырмалдық.',
    },
  },
  {
    id: 'fr10',
    frameNum: '10',
    act: 'act3',
    actLabel: { en: 'ACT III', zh: '第三幕', ru: 'АКТ III', kk: 'III АКТ' },
    image: './stills/still_dulyga_blinds.jpg',
    lens: {
      en: '50MM · MIRROR SHOT',
      zh: '50毫米 · 镜前构图',
      ru: '50ММ · КАДР У ЗЕРКАЛА',
      kk: '50ММ · АЙНА АЛДЫНДА',
    },
    title: {
      ru: 'Синяя куртка и букет · Новое достоинство',
      en: 'Blue Jacket & Flowers · Reclaiming Dignity',
      zh: '蓝色战袍与花束 · 找回自信与体面',
      kk: 'Көк күрте мен гүл шоғы · Жаңа өмір',
    },
    caption: {
      ru: 'Расул впервые смотрит на себя в зеркало без стыда — готовый к встрече с Юлей.',
      en: 'For the first time, Rasul looks into a mirror without shame—ready to face Yulia.',
      zh: '拉苏尔第一次不再自卑地直视镜中的自己，重拾久违的尊严。',
      kk: 'Расул алғаш рет айнаға ұялмай қарап, Юлямен кездесуге дайындалады.',
    },
  },
  {
    id: 'fr11',
    frameNum: '11',
    act: 'act3',
    actLabel: { en: 'ACT III', zh: '第三幕', ru: 'АКТ III', kk: 'III АКТ' },
    image: './stills/still_rasul_bib261.jpg',
    lens: {
      en: '24MM LOW ANGLE · ASTANA',
      zh: '24毫米低角度 · 阿斯塔纳',
      ru: '24ММ НИЖНИЙ РАКУРС',
      kk: '24ММ · АСТАНА АСПАНЫ',
    },
    title: {
      ru: 'Номер 261 · Свобода под небом Астаны',
      en: 'Bib 261 · Breathing Free in Astana',
      zh: '261号参赛牌 · 阿斯塔纳晴空下的蜕变',
      kk: '261-нөмір · Астана аспаны астындағы еркіндік',
    },
    caption: {
      ru: 'Синяя марафонка застёгнута на груди. Впереди — реальный марафон 42.2 км.',
      en: 'The blue marathon jacket zips shut. Ahead lies the real 42.2 km Astana Marathon.',
      zh: '蓝色战袍终于拉上拉链，261号跑者迎向真实的42.2公里阿斯塔纳赛道。',
      kk: 'Көк марафон күртесі түймеленді. Алда — 42.2 км нағыз Астана марафоны.',
    },
  },
  {
    id: 'fr12',
    frameNum: '12',
    act: 'act3',
    actLabel: { en: 'ACT III', zh: '第三幕', ru: 'АКТ III', kk: 'III АКТ' },
    image: './stills/still_finish_arch.jpg',
    lens: {
      en: '85MM TELEPHOTO · MARATHON',
      zh: '85毫米长焦 · 万人马拉松',
      ru: '85ММ · ЖИВОЙ МАРАФОН',
      kk: '85ММ · НАҒЫЗ МАРАФОН',
    },
    title: {
      ru: 'Финишная арка · Победа над собой',
      en: 'The Finish Arch · Live Astana Marathon Climax',
      zh: '终点拱门 · 万人马拉松高燃瞬间',
      kk: 'Мәре аркасы · Өз-өзіңді жеңу',
    },
    caption: {
      ru: 'Снято вживую внутри официального марафона Астаны среди тысяч реальных бегунов.',
      en: 'Captured live inside the official Astana Marathon surrounded by thousands of runners.',
      zh: '在阿斯塔纳官方万人马拉松真实赛道中实景跟拍，零绿幕造假。',
      kk: 'Мыңдаған нақты желаяқтармен бірге ресми Астана марафонының ішінде түсірілген.',
    },
  },
];

const DI_SWATCHES: Array<{ hex: string; label: Record<UILang, string> }> = [
  {
    hex: '#060B14',
    label: {
      en: 'ACT I · ASTANA NIGHT',
      zh: '第一幕 · 阿斯塔纳夜幕蓝',
      ru: 'АКТ I · НОЧНОЕ НЕБО АСТАНЫ',
      kk: 'I АКТ · АСТАНА ТҮНІ',
    },
  },
  {
    hex: '#E61E2A',
    label: {
      en: 'SIGNATURE · “NOT” RED',
      zh: '品牌主色 · 热血赤红',
      ru: 'АКЦЕНТ · ФИРМЕННЫЙ АЛЫЙ',
      kk: 'АКЦЕНТ · ФИРМАЛЫҚ ҚЫЗЫЛ',
    },
  },
  {
    hex: '#1E56A0',
    label: {
      en: 'ACT III · MARATHON SKY',
      zh: '第三幕 · 马拉松晴空蓝',
      ru: 'АКТ III · НЕБО МАРАФОНА',
      kk: 'III АКТ · МАРАФОН АСПАНЫ',
    },
  },
  {
    hex: '#F59E0B',
    label: {
      en: 'ACT II · JANA MEN VEST',
      zh: '第二幕 · 逆光安全橙金',
      ru: 'АКТ II · ЖИЛЕТ И ЗАКАТ',
      kk: 'II АКТ · ЖИЛЕТ ПЕН ШАПАҚ',
    },
  },
];

const LOOKBOOK_COPY: Record<
  UILang,
  {
    visionTag: string;
    quote: string;
    authors: string;
    act1Tag: string;
    act1Min: string;
    act1Title: string;
    act1Body: string;
    act2Tag: string;
    act2Min: string;
    act2Title: string;
    act2Body: string;
    act3Tag: string;
    act3Min: string;
    act3Title: string;
    act3Body: string;
    sheetTag: string;
    sheetTitle: string;
    tabAll: string;
    tab1: string;
    tab2: string;
    tab3: string;
    lightboxHint: string;
  }
> = {
  en: {
    visionTag: 'CREATIVE VISION · DIRECTOR & SHOWRUNNER STATEMENT',
    quote:
      '“We refused to put an actor in a latex fat suit to fake struggle. We brought our cameras inside the real JANA MEN weight-loss camp and the live Astana Marathon—every drop of sweat and every trembling breath on screen is real.”',
    authors: 'SERGEY BONDAREV · RASUL SHARAFEDDINOV · AITYM ZHAKUPOV',
    act1Tag: 'ACT I · 207 KG',
    act1Min: '00 — 30 MIN',
    act1Title: 'The Night Track & Stolen Name',
    act1Body:
      'An accidental death on the night track leaves 200-kg janitor Rasul holding runner Artyom’s SOS watch and Jackie Chan-filled diary—leading him under a borrowed name into the "Not Extra" camp.',
    act2Tag: 'ACT II · JANA MEN',
    act2Min: '30 — 80 MIN',
    act2Title: 'Camp Transformation & Shattered Idol',
    act2Body:
      'Mentor Aitym strips away self-pity while Elvira teaches Rasul to tie his shoes and read—until Artyom’s daughter Yulia exposes her father as a con artist.',
    act3Tag: 'ACT III · 42.2 KM',
    act3Min: '188 BPM CLIMAX',
    act3Title: '10 Meters From the Finish Arch',
    act3Body:
      'Ten meters from the Astana Marathon finish arch at 188 BPM, Rasul turns his back on the medal to save Yulia from an asthma attack—finally reclaiming his own name.',
    sheetTag: '35MM CINEMATOGRAPHY CONTACT SHEET · 12 ACTUAL FILM STILLS',
    sheetTitle: 'Visual Lookbook & Cinematography',
    tabAll: 'ALL (12)',
    tab1: 'ACT I',
    tab2: 'ACT II',
    tab3: 'ACT III',
    lightboxHint: '← / → NAVIGATE · ESC CLOSE',
  },
  zh: {
    visionTag: '导演与主创阐述 · 为什么这部电影无法被复制',
    quote:
      '“我们没有给演员套上硅胶胖服去假装挣扎。我们把摄影机架进了真实的 JANA MEN 减重营和阿斯塔纳万人马拉松赛道——镜头里的每一滴汗水和每一次呼吸都是真的。”',
    authors: '谢尔盖·邦达列夫 · 拉苏尔·沙拉费丁诺夫 · 艾特姆·贾库波夫',
    act1Tag: '第一幕 · 207 公斤',
    act1Min: '00 — 30 分钟',
    act1Title: '意外、身份与日记',
    act1Body:
      '200公斤球场清洁工拉苏尔因意外导致跑者阿尔乔姆身亡，带着对方的SOS心率表与写满成龙格言的日记，化名进入“绝不多余”减重营。',
    act2Tag: '第二幕 · 减重营',
    act2Min: '30 — 80 分钟',
    act2Title: '减重蜕变与真相崩塌',
    act2Body:
      '导师艾特姆撕开他的心理防线，管理员艾尔薇拉教他系鞋带与写字；直到阿尔乔姆的女儿尤莉亚揭露父亲实为骗子的残酷真相。',
    act3Tag: '第三幕 · 42.2 公里',
    act3Min: '188 次/分 高潮',
    act3Title: '距终点10米的转身救赎',
    act3Body:
      '在阿斯塔纳万人马拉松终点前10米，心率飙升至188 BPM。拉苏尔放弃触手可及的奖牌，转身逆流救下哮喘发作的尤莉亚，第一次以真名站立。',
    sheetTag: '35毫米实拍剧照接触印相 · 12帧真实电影画面',
    sheetTitle: '影片视觉风格与实拍剧照集',
    tabAll: '全部 (12)',
    tab1: '第一幕',
    tab2: '第二幕',
    tab3: '第三幕',
    lightboxHint: '← / → 切换 · ESC 关闭',
  },
  ru: {
    visionTag: 'ВИДЕНИЕ АВТОРОВ · МАНИФЕСТ РЕЖИССЁРА И ШОУРАННЕРА',
    quote:
      '«Мы отказались надевать на актёра силиконовую толщинку, чтобы имитировать боль. Мы зашли с камерой внутрь реального лагеря JANA MEN и в живую толпу марафона Астаны — каждая капля пота и каждый сбой дыхания в кадре настоящие.»',
    authors: 'СЕРГЕЙ БОНДАРЕВ · РАСУЛ ШАРАФЕДДИНОВ · АЙТЫМ ЖАКУПОВ',
    act1Tag: 'АКТ I · 207 КГ',
    act1Min: '00 — 30 МИН',
    act1Title: 'Ночная дорожка и чужое имя',
    act1Body:
      'Случайная гибель марафонца Артёма на ночной дорожке оставляет 200-килограммовому уборщику Расулу его SOS-часы и дневник с цитатами Джеки Чана, приводя его под чужим именем в лагерь «Не лишние».',
    act2Tag: 'АКТ II · ЛАГЕРЬ',
    act2Min: '30 — 80 МИН',
    act2Title: 'Трансформация и крах кумира',
    act2Body:
      'Наставник Айтым ломает жалость к себе, Эльвира учит завязывать шнурки и писать — пока дочь Артёма Юля не разрушает легенду, открыв, что её отец был аферистом.',
    act3Tag: 'АКТ III · 42.2 КМ',
    act3Min: '188 УД/М ФИНАЛ',
    act3Title: 'Разворот за 10 метров до финиша',
    act3Body:
      'За 10 метров до арки марафона Астаны при 188 уд/мин Расул отказывается от медали и разворачивается против толпы, чтобы спасти задыхающуюся Юлю и впервые обрести своё имя.',
    sheetTag: '35ММ КОНТАКТ-ЛИСТ ФИЛЬМА · 12 РЕАЛЬНЫХ СТОП-КАДРОВ',
    sheetTitle: 'Визуальный лукбук и операторская работа',
    tabAll: 'ВСЕ (12)',
    tab1: 'АКТ I',
    tab2: 'АКТ II',
    tab3: 'АКТ III',
    lightboxHint: '← / → ЛИСТАТЬ · ESC ЗАКРЫТЬ',
  },
  kk: {
    visionTag: 'АВТОРЛАР КӨЗҚАРАСЫ · РЕЖИССЁР ЖӘНЕ ШОУРАННЕР МАНИФЕСТІ',
    quote:
      '«Біз ауырлықты өтірік ойнау үшін актёрге силикон кигізуден бас тарттық. Камерамен нағыз JANA MEN лагерінің ішіне және мыңдаған адам қатысқан Астана марафонына кірдік — кадрдағы әрбір тер тамшысы мен тыныс шынайы.»',
    authors: 'СЕРГЕЙ БОНДАРЕВ · РАСУЛ ШАРАФЕДДИНОВ · АЙТЫМ ЖАҚЫПОВ',
    act1Tag: 'I АКТ · 207 КГ',
    act1Min: '00 — 30 МИН',
    act1Title: 'Түнгі жолақ және бөтен есім',
    act1Body:
      'Түнгі жүгіру жолындағы марафоншы Артёмның кездейсоқ қазасы 200 келі тазалаушы Расулға оның SOS-сағаты мен Джеки Чан дәйексөздері жазылған күнделігін қалдырып, «Артық емес» лагеріне жетелейді.',
    act2Tag: 'II АКТ · JANA MEN',
    act2Min: '30 — 80 МИН',
    act2Title: 'Лагерьдегі өзгеріс және аңыздың күйреуі',
    act2Body:
      'Тәлімгер Айтым өзін аяу сезімін сындырады, Эльвира оған бәтеңке бауын байлау мен жазуды үйретеді — алайда Артёмның қызы Юля әкесінің алаяқ болғанын ашып береді.',
    act3Tag: 'III АКТ · 42.2 КМ',
    act3Min: '188 СОҚ/М ФИНАЛ',
    act3Title: 'Мәреге 10 метр қалғандағы шешім',
    act3Body:
      'Астана марафонының мәре аркасына 10 метр қалғанда, жүрек соғысы 188-ге жеткен сәтте Расул медальдан бас тартып, демікпе ұстамасы басталған Юляны құтқару үшін кері бұрылады.',
    sheetTag: '35ММ КИНО КАДРЛАРЫ · 12 НАҚТЫ СТОП-КАДР',
    sheetTitle: 'Фильмнің визуалды стилі мен кадрлары',
    tabAll: 'БАРЛЫҒЫ (12)',
    tab1: 'I АКТ',
    tab2: 'II АКТ',
    tab3: 'III АКТ',
    lightboxHint: '← / → АУЫСТЫРУ · ESC ЖАБУ',
  },
};

export const CinemaLookbookSection: React.FC<{ lang: UILang }> = ({ lang }) => {
  const [actFilter, setActFilter] = useState<'all' | 'act1' | 'act2' | 'act3'>('all');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const t = LOOKBOOK_COPY[lang];

  const visibleFrames =
    actFilter === 'all'
      ? LOOKBOOK_FRAMES
      : LOOKBOOK_FRAMES.filter((f) => f.act === actFilter);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIdx(null);
      if (e.key === 'ArrowRight') {
        soundEngine.playUiTick();
        setLightboxIdx((prev) => (prev === null ? null : (prev + 1) % LOOKBOOK_FRAMES.length));
      }
      if (e.key === 'ArrowLeft') {
        soundEngine.playUiTick();
        setLightboxIdx((prev) =>
          prev === null ? null : (prev - 1 + LOOKBOOK_FRAMES.length) % LOOKBOOK_FRAMES.length
        );
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIdx]);

  const activeLightboxFrame = lightboxIdx !== null ? LOOKBOOK_FRAMES[lightboxIdx] : null;

  return (
    <section
      id="lookbook"
      className="py-24 sm:py-32 hairline-dashed bg-gradient-to-b from-[#060B14] via-[#091221] to-[#050911]"
    >
      <div className="max-w-[1380px] mx-auto px-4 sm:px-8 space-y-20">
        {/* PART 1: DIRECTOR'S STATEMENT + 3-ACT SYNOPSIS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#E61E2A]">
              <Quote className="w-3.5 h-3.5" />
              <span>{t.visionTag}</span>
            </div>

            <blockquote className="font-editorial italic text-2xl sm:text-4xl lg:text-[40px] text-[#F8FAFC] leading-[1.22] tracking-[-0.01em]">
              {t.quote}
            </blockquote>

            <div className="pt-4 hairline-dashed flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.18em]">
              <span className="text-[#38BDF8]">{t.authors}</span>
              <span className="text-[#64748B]">BIG MOVIE STUDIO × IBA JANA MEN</span>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl bg-[#0B1424] border border-[#38BDF8]/16 overflow-hidden divide-y divide-[#38BDF8]/12">
            <div className="p-5">
              <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.18em] mb-1.5">
                <span className="text-[#E61E2A] font-semibold">{t.act1Tag}</span>
                <span className="text-[#64748B]">{t.act1Min}</span>
              </div>
              <div className="font-unbounded font-bold text-xs sm:text-sm text-[#F8FAFC] mb-1">
                {t.act1Title}
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">{t.act1Body}</p>
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.18em] mb-1.5">
                <span className="text-[#38BDF8] font-semibold">{t.act2Tag}</span>
                <span className="text-[#64748B]">{t.act2Min}</span>
              </div>
              <div className="font-unbounded font-bold text-xs sm:text-sm text-[#F8FAFC] mb-1">
                {t.act2Title}
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">{t.act2Body}</p>
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.18em] mb-1.5">
                <span className="text-[#F8FAFC] font-semibold">{t.act3Tag}</span>
                <span className="text-[#E61E2A]">{t.act3Min}</span>
              </div>
              <div className="font-unbounded font-bold text-xs sm:text-sm text-[#F8FAFC] mb-1">
                {t.act3Title}
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">{t.act3Body}</p>
            </div>
          </div>
        </div>

        {/* PART 2: 35MM CONTACT-SHEET LOOKBOOK + DI COLOR PALETTE */}
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-5 hairline-dashed-b">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#38BDF8] mb-2">
                <Camera className="w-3.5 h-3.5 text-[#E61E2A]" />
                <span>{t.sheetTag}</span>
              </div>
              <h2 className="font-unbounded font-bold text-2xl sm:text-4xl text-[#F8FAFC]">
                {t.sheetTitle}
              </h2>
            </div>

            <div className="flex items-center gap-1 rounded-full border border-[#38BDF8]/18 bg-[#0B1424] p-1 self-start lg:self-auto flex-shrink-0 whitespace-nowrap">
              {(
                [
                  { id: 'all', label: t.tabAll },
                  { id: 'act1', label: t.tab1 },
                  { id: 'act2', label: t.tab2 },
                  { id: 'act3', label: t.tab3 },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    soundEngine.playUiTick();
                    setActFilter(tab.id);
                  }}
                  className={`px-3.5 py-1.5 rounded-full font-mono text-[10px] font-semibold uppercase tracking-[0.14em] transition-all ${
                    actFilter === tab.id
                      ? 'bg-[#F8FAFC] text-[#060B14]'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4-Act DI Color Palette Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#38BDF8]/14 border border-[#38BDF8]/14 rounded-xl overflow-hidden">
            {DI_SWATCHES.map((sw) => (
              <div key={sw.hex} className="bg-[#091221] px-4 py-3 flex items-center gap-3">
                <span
                  className="w-7 h-7 rounded-lg border border-white/20 flex-shrink-0"
                  style={{ backgroundColor: sw.hex }}
                />
                <div className="min-w-0">
                  <div className="font-mono text-[10px] font-bold text-[#F8FAFC]">{sw.hex}</div>
                  <div className="font-mono text-[9px] text-[#94A3B8] truncate uppercase">
                    {sw.label[lang]}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 35mm Contact-Sheet Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {visibleFrames.map((frame) => {
              const globalIdx = LOOKBOOK_FRAMES.findIndex((f) => f.id === frame.id);
              return (
                <button
                  key={frame.id}
                  type="button"
                  onClick={() => {
                    soundEngine.playUiTick();
                    setLightboxIdx(globalIdx);
                  }}
                  className="group text-left rounded-xl overflow-hidden bg-[#0B1424] border border-[#38BDF8]/14 hover:border-[#E61E2A]/80 transition-all flex flex-col"
                >
                  <div className="px-3 py-1.5 bg-[#070D19] border-b border-white/8 flex items-center justify-between font-mono text-[9px] tracking-[0.16em]">
                    <span className="text-[#E61E2A] font-semibold">
                      #{frame.frameNum} · {frame.actLabel[lang]}
                    </span>
                    <span className="text-[#64748B] inline-flex items-center gap-1 group-hover:text-white transition-colors">
                      <Maximize2 className="w-2.5 h-2.5" /> 1080P
                    </span>
                  </div>

                  <div className="aspect-video w-full bg-[#040810] overflow-hidden relative">
                    <img
                      src={frame.image}
                      alt={frame.title[lang]}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div className="font-unbounded font-semibold text-xs text-[#F8FAFC] leading-snug mb-1">
                      {frame.title[lang]}
                    </div>
                    <p className="text-[11px] text-[#94A3B8] leading-relaxed line-clamp-2">
                      {frame.caption[lang]}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* FULLSCREEN 35MM CINEMA LIGHTBOX */}
      {activeLightboxFrame && lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-[#03060C]/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
          onClick={() => setLightboxIdx(null)}
        >
          <div
            className="max-w-5xl w-full bg-[#0A1322] border border-[#38BDF8]/20 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-3.5 bg-[#060B14] border-b border-white/10 flex items-center justify-between gap-4 font-mono text-[10px] tracking-[0.18em]">
              <div className="flex items-center gap-3">
                <span className="text-[#E61E2A] font-bold">#{activeLightboxFrame.frameNum}</span>
                <span className="text-white/20">|</span>
                <span className="text-[#38BDF8]">{activeLightboxFrame.lens[lang]}</span>
                <span className="text-[#64748B] hidden sm:inline">
                  ({lightboxIdx + 1} / {LOOKBOOK_FRAMES.length})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setLightboxIdx(null)}
                className="p-1.5 rounded-full bg-[#111F36] text-[#94A3B8] hover:text-white"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative bg-black aspect-video flex items-center justify-center">
              <img
                src={activeLightboxFrame.image}
                alt={activeLightboxFrame.title[lang]}
                className="w-full h-full object-contain"
              />

              <button
                type="button"
                onClick={() => {
                  soundEngine.playUiTick();
                  setLightboxIdx((lightboxIdx - 1 + LOOKBOOK_FRAMES.length) % LOOKBOOK_FRAMES.length);
                }}
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#060B14]/85 border border-white/20 hover:border-[#E61E2A] text-white flex items-center justify-center transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playUiTick();
                  setLightboxIdx((lightboxIdx + 1) % LOOKBOOK_FRAMES.length);
                }}
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#060B14]/85 border border-white/20 hover:border-[#E61E2A] text-white flex items-center justify-center transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-4 bg-[#070E1B] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="font-unbounded font-bold text-sm sm:text-base text-[#F8FAFC]">
                  {activeLightboxFrame.title[lang]}
                </div>
                <div className="text-xs text-[#94A3B8] mt-0.5">{activeLightboxFrame.caption[lang]}</div>
              </div>
              <div className="font-mono text-[10px] text-[#64748B] whitespace-nowrap">
                {t.lightboxHint}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
