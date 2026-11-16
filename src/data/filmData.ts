export type Lang = 'ru' | 'en' | 'kk' | 'zh';

export interface CastMember {
  id: string;
  actor: Record<Lang, string>;
  characterName: Record<Lang, string>;
  role: Record<Lang, string>;
  metric: string;
  metricLabel: Record<Lang, string>;
  desc: Record<Lang, string>;
  badge: Record<Lang, string>;
  image: string;
  spanClass?: string;
}

export interface KeyCrewMember {
  name: Record<Lang, string>;
  role: Record<Lang, string>;
  bio: Record<Lang, string>;
  photo: string;
  link?: string;
  linkLabel?: string;
}

export interface FullCrewItem {
  department: Record<Lang, string>;
  members: Array<{
    role: Record<Lang, string>;
    name: Record<Lang, string>;
  }>;
}

export interface EnsembleActor {
  name: Record<Lang, string>;
  role: Record<Lang, string>;
  image: string;
}

export const CAST_DATA: CastMember[] = [
  {
    id: 'rasul',
    actor: {
      ru: 'Ерсултан Уаис',
      en: 'Ersultan Uais',
      kk: 'Ерсұлтан Уаис',
      zh: '叶尔苏丹·乌艾斯 (Ersultan Uais)',
    },
    characterName: {
      ru: 'Расул / «Султан»',
      en: 'Rasul / "Sultan"',
      kk: 'Расул / «Сұлтан»',
      zh: '拉苏尔 / “苏丹” (Rasul)',
    },
    role: {
      ru: 'Протагонист · Уборщик стадиона (реальный сброс веса в лагере JANA MEN)',
      en: 'Protagonist · Stadium Janitor (Real Medically Supervised Weight Loss)',
      kk: 'Бас кейіпкер · Стадион тазалаушысы (JANA MEN лагеріндегі нақты салмақ тастау)',
      zh: '男主角 · 体育场清洁工（JANA MEN 训练营医学监督下真实减重蜕变）',
    },
    metric: '207 KG → 42.2 KM',
    metricLabel: {
      ru: 'реальная трансформация без CGI-обмана',
      en: 'authentic physical transformation without CGI cheats',
      kk: 'CGI-сыз нақты физикалық трансформация',
      zh: '零虚假特效作弊 · 100%真实体能重塑',
    },
    desc: {
      ru: '«Грустный великан» ростом за 185 см. Неграмотный уборщик стадиона в ярко-оранжевом жилете, заперший детские обиды и страх перед отчимом в броню из 207 килограммов. Присвоив имя погибшего марафонца Артёма и попав в лагерь «Не лишние» под именем «Султан», он выходит на трассу марафона Астаны, чтобы спасти чужую жизнь и впервые обрести собственное имя.',
      en: 'A 207-kg "gentle giant" and stadium janitor in an orange vest who locked his childhood trauma inside a fortress of weight. Assuming the deceased runner Artyom’s identity at the "Not Extra" camp, he runs the 42.2 km Astana Marathon—ultimately turning back 10 meters from the finish line to save a life and reclaim his own soul.',
      kk: 'Балалық шақтағы реніші мен қорқынышын 207 келілік тән сауытына қамаған стадион тазалаушысы. Қаза тапқан марафоншы Артемнің атын жамылып, «Сұлтан» есімімен «Артық емес» лагеріне түскен ол Астана марафонында өзгенің өмірін құтқарып, өз есімін қайтарады.',
      zh: '身高超过185厘米的“温柔巨人”。这名不识字的体育场清洁工将童年创伤锁在207公斤的脂肪盔甲里。他化名“苏丹”进入“绝不多余”减重营，在42.2公里阿斯塔纳马拉松终点前10米毅然转身救人，赢回了自己的灵魂与尊严。',
    },
    badge: {
      ru: 'Главная роль · Реальная трансформация',
      en: 'Lead Role · Real Transformation',
      kk: 'Басты рөл · Нақты трансформация',
      zh: '领衔主演 · 真实减重蜕变',
    },
    image: './cast/yersultan_uais_portrait.jpg',
    spanClass: 'md:col-span-1 lg:col-span-1',
  },
  {
    id: 'elvira',
    actor: {
      ru: 'Гузель Жан',
      en: 'Guzel Zhan',
      kk: 'Гүзел Жан',
      zh: '古泽尔·詹 (Guzel Zhan)',
    },
    characterName: {
      ru: 'Эльвира',
      en: 'Elvira',
      kk: 'Эльвира',
      zh: '艾尔薇拉 (Elvira)',
    },
    role: {
      ru: 'Администратор центра «Лишние»',
      en: 'Administrator of the "Not Extra" Center',
      kk: '«Артық емес» орталығының әкімшісі',
      zh: '“绝不多余”训练营管理员 · 情感锚点',
    },
    metric: '∞ MERCY',
    metricLabel: {
      ru: 'человеческий якорь и тихое милосердие',
      en: 'human anchor & silent mercy',
      kk: 'мейірімділік пен темірдей тәртіп',
      zh: '外冷内热的温暖港湾',
    },
    desc: {
      ru: 'Выпускница программы с армейской дисциплиной, скрывающая за строгим мундиром глубокую личную боль. Для Расула она становится первым близким человеком, который учит его завязывать крепкий узел на шнурках, выводить первые буквы и верить в себя.',
      en: 'A strict, military-postured camp administrator hiding deep personal grief. She becomes Rasul’s human anchor—the first person to teach him how to tie a secure knot on his shoelaces, write his own name, and trust again.',
      kk: 'Қатал тәртіптің артында жеке драмасын жасырған орталық түлегі. Расул үшін ол бау байлауды, әріп тануды және өз қадірін білуді үйреткен ең жақын жанға айналады.',
      zh: '作风严谨的训练营管理员，在冷峻的外表下隐藏着个人伤痛。她成为拉苏尔生命中的温暖港湾——第一个教会他系紧鞋带、读书写字并重拾自尊的人。',
    },
    badge: {
      ru: 'Главная женская роль',
      en: 'Female Lead',
      kk: 'Басты әйел рөлі',
      zh: '领衔女主角',
    },
    image: './cast/guzel_zhan.png',
    spanClass: 'md:col-span-1 lg:col-span-1',
  },
  {
    id: 'artem',
    actor: {
      ru: 'Михаил Калюжный',
      en: 'Mikhail Kalyuzhny',
      kk: 'Михаил Калюжный',
      zh: '米哈伊尔·卡柳日内 (Mikhail Kalyuzhny)',
    },
    characterName: {
      ru: 'Артём Гележинис (и линия дочери Юли)',
      en: 'Artyom Gelezhinis (& Daughter Yulia)',
      kk: 'Артём Гележинис (және қызы Юля)',
      zh: '阿尔乔姆（及跑者女儿尤莉亚 Yulia）',
    },
    role: {
      ru: 'Катализатор сюжета · Наставник из дневника',
      en: 'Story Catalyst · The Flawed Diary Idol',
      kk: 'Сюжет катализаторы · Күнделік иесі',
      zh: '故事催化剂 · 日记背后的复杂父亲',
    },
    metric: '10 METERS',
    metricLabel: {
      ru: 'до финиша и прощения дочери Юли',
      en: 'short of forgiveness & the finish arch',
      kk: 'мәре мен қызының кешіріміне дейін',
      zh: '距离终点与女儿原谅的最后10米',
    },
    desc: {
      ru: 'Марафонец, чья случайная смерть от астмы на ночной дорожке запускает путь Расула. Его дневник с цитатами Джеки Чана и Брюса Ли становится для Расула священной книгой — пока дочь Артёма Юля не раскрывает, что её отец был аферистом, сочившим красивую легенду ради её прощения.',
      en: 'The runner whose fatal asthma attack sparks Rasul’s journey. His diary of 1980s Jackie Chan and Bruce Lee wisdom guides Rasul—until Artyom’s marathon-running daughter Yulia reveals her father was a con man who wrote a heroic myth to beg for her forgiveness.',
      kk: 'Түнгі жолақта демікпеден қаза тапқан марафоншы. Оның Джеки Чан мен Брюс Ли цитаталарына толы күнделігі Расулға жол көрсетеді, ал қызы Юля әкесінің шынайы өміріндегі құпиясын ашады.',
      zh: '因哮喘意外身亡的马拉松跑者。他写满成龙与李小龙武道哲学的日记成为拉苏尔的精神指南，直到他的跑者女儿尤莉亚揭开真相：这位“英雄父亲”实则是渴望女儿原谅的落魄骗子。',
    },
    badge: {
      ru: 'Главная роль',
      en: 'Lead Role',
      kk: 'Басты рөл',
      zh: '核心主演',
    },
    image: './cast/mikhail_kalyuzhny.png',
    spanClass: 'md:col-span-1 lg:col-span-1',
  },
  {
    id: 'dulyga',
    actor: {
      ru: 'Дулыга Акмолда',
      en: 'Dulyga Akmolda',
      kk: 'Дулыға Ақмолда',
      zh: '杜勒加·阿克莫尔达 (Dulyga Akmolda)',
    },
    characterName: {
      ru: 'Мастер драматического ансамбля',
      en: 'Dramatic Ensemble Master',
      kk: 'Драмалық ансамбль шебері',
      zh: '哈萨克斯坦人民艺术家 · 实力戏骨',
    },
    role: {
      ru: 'Народный артист Казахстана',
      en: 'People’s Artist of Kazakhstan',
      kk: 'Қазақстанның Халық әртісі',
      zh: '国家级功勋演员 · 特别主演',
    },
    metric: 'LEGEND',
    metricLabel: {
      ru: 'высокая психологическая драма',
      en: 'monumental dramatic gravitas',
      kk: 'терең психологиялық драма',
      zh: '殿堂级戏剧张力',
    },
    desc: {
      ru: 'Один из крупнейших драматических актёров Казахстана, чья мощная экранная харизма придаёт картине фундаментальный объём и глубину.',
      en: 'One of Kazakhstan’s greatest dramatic actors, bringing monumental emotional depth and authenticity to the ensemble.',
      kk: 'Қазақ киносының ең ірі драмалық актерлерінің бірі, картинаға фундаменталды тереңдік береді.',
      zh: '哈萨克斯坦最具分量的殿堂级戏剧演员之一，为影片注入深沉厚重的人性感染力。',
    },
    badge: {
      ru: 'Звезда экрана',
      en: 'Special Star',
      kk: 'Экран жұлдызы',
      zh: '国宝级戏骨',
    },
    image: './cast/dulyga_akmolda.png',
    spanClass: 'md:col-span-1 lg:col-span-1',
  },
  {
    id: 'yerbolat',
    actor: {
      ru: 'Ерболат Тогузаков',
      en: 'Yerbolat Toguzakov',
      kk: 'Ерболат Тоғызақов',
      zh: '叶尔波拉特·托古扎科夫 (Yerbolat Toguzakov)',
    },
    characterName: {
      ru: 'Характерный образ',
      en: 'Iconic Character Role',
      kk: 'Характерлік бейне',
      zh: '传奇国民演员（代表作《老人》）',
    },
    role: {
      ru: 'Легенда казахстанского кино («Шал»)',
      en: 'Kazakh Cinema Legend ("Shal / The Old Man")',
      kk: 'Қазақ киносының аңызы («Шал»)',
      zh: '哈萨克斯坦影坛传奇',
    },
    metric: 'WARMTH',
    metricLabel: {
      ru: 'народный юмор и светлая человечность',
      en: 'warm folk humor & heartfelt humanity',
      kk: 'халықтық юмор мен шынайылық',
      zh: '温暖幽默与草根生命力',
    },
    desc: {
      ru: 'Любимец зрителей, чья живая ирония и душевная теплота создают неповторимую интонацию социально-спортивного драмеди.',
      en: 'Beloved star whose unmistakable warmth and folk humor anchor the uplifting Sports Dramedy tone.',
      kk: 'Табиғи юморы мен жылылығы спорттық драмедидің шынайы атмосферасын ашатын халық сүйіктісі.',
      zh: '深受观众喜爱的国民级老戏骨，以真挚温暖的草根幽默赋予这部励志体育轻喜剧独特的生命温度。',
    },
    badge: {
      ru: 'Легенда кино',
      en: 'Cinema Legend',
      kk: 'Кино аңызы',
      zh: '影坛传奇',
    },
    image: './cast/yerbolat_toguzakov.jpg',
    spanClass: 'md:col-span-1 lg:col-span-1',
  },
  {
    id: 'anna',
    actor: {
      ru: 'Анна Старченко',
      en: 'Anna Starchenko',
      kk: 'Анна Старченко',
      zh: '安娜·斯塔琴科 (Anna Starchenko)',
    },
    characterName: {
      ru: 'Яркий женский образ',
      en: 'Key Supporting Ensemble',
      kk: 'Жарқын әйел бейнесі',
      zh: '实力派女性角色',
    },
    role: {
      ru: 'Актриса театра и кино',
      en: 'Theater & Screen Actress',
      kk: 'Театр және кино актрисасы',
      zh: '知名戏剧与影视女演员',
    },
    metric: 'SPARK',
    metricLabel: {
      ru: 'современная энергия и контраст',
      en: 'sharp contemporary energy',
      kk: 'заманауи энергия мен контраст',
      zh: '鲜明时代质感与情感张力',
    },
    desc: {
      ru: 'Яркая актриса современного казахстанского экрана, привносящая в ансамбль точную психологическую пластику и эмоциональный нерв.',
      en: 'Acclaimed contemporary actress bringing sharp emotional contrast and vivid texture to the story.',
      kk: 'Фильм ансамбліне заманауи фактура мен эмоционалды серпін беретін танымал актриса.',
      zh: '哈萨克斯坦实力派女演员，以细腻准确的心理刻画丰富全片群像层次。',
    },
    badge: {
      ru: 'В главных ролях',
      en: 'Main Cast',
      kk: 'Басты рөлдерде',
      zh: '领衔群像',
    },
    image: './cast/anna_starchenko.png',
    spanClass: 'md:col-span-1 lg:col-span-1',
  },
];

export const ENSEMBLE_CAST_DATA: EnsembleActor[] = [
  {
    name: { ru: 'Айтым Жакупов', en: 'Aitym Zhakupov', kk: 'Айтым Жақұпов', zh: '艾特姆·贾库波夫 (Aitym Zhakupov)' },
    role: { ru: 'Наставник · Основатель JANA MEN', en: 'Mentor · Founder of JANA MEN', kk: 'Тәлімгер · JANA MEN негізін қалаушы', zh: '精神导师 · JANA MEN 创始人' },
    image: './cast/aitym_zhakupov.png',
  },
  {
    name: { ru: 'Камила Фун-Со', en: 'Kamila Fun-So', kk: 'Камила Фун-Со', zh: '卡米拉·冯-索 (Kamila Fun-So)' },
    role: { ru: 'Динара / DINA_FIT (Фитнес-блогер)', en: 'Dinara / DINA_FIT (Influencer)', kk: 'Динара / DINA_FIT', zh: '迪娜拉 DINA_FIT（网红博主）' },
    image: './cast/kamila_fun_so.jpg',
  },
  {
    name: { ru: 'Ола Кейру', en: 'Ola Keyru', kk: 'Ола Кейру', zh: '奥拉·凯鲁 (Ola Keyru)' },
    role: { ru: 'Малик (Фаворит марафона)', en: 'Malik (Marathon Favorite)', kk: 'Малик (Марафон фавориті)', zh: '马利克（马拉松夺冠热门）' },
    image: './cast/ola_keyru.png',
  },
  {
    name: { ru: 'Расим Жубаев', en: 'Rasim Zhubaev', kk: 'Расим Жұбаев', zh: '拉西姆·朱巴耶夫 (Rasim Zhubaev)' },
    role: { ru: 'Отчим Расула (Флешбэки детства)', en: 'Rasul’s Stepfather', kk: 'Расулдың өгей әкесі', zh: '拉苏尔继父（童年梦魇）' },
    image: './cast/rasim_zhubaev.png',
  },
  {
    name: { ru: 'Жасмин Бегалинова', en: 'Zhasmin Begalinova', kk: 'Жасмин Бегалинова', zh: '贾斯敏·别加利诺娃 (Zhasmin Begalinova)' },
    role: { ru: 'Юля (Дочь Артёма, бегунья)', en: 'Yulia (Artyom’s Daughter)', kk: 'Юля (Артемнің қызы)', zh: '尤莉亚（阿尔乔姆之女）' },
    image: './cast/zhasmin_begalinova.png',
  },
  {
    name: { ru: 'Светлана Подобедова', en: 'Svetlana Podobedova', kk: 'Светлана Подобедова', zh: '斯维特拉娜·波多别多娃 (Svetlana Podobedova)' },
    role: { ru: 'Олимпийская чемпионка · Камео', en: 'Olympic Champion · Special Cameo', kk: 'Олимпиада чемпионы', zh: '奥运冠军 · 特别出演' },
    image: './cast/svetlana_podobedova.png',
  },
  {
    name: { ru: 'Шах-Мурат Ордабаев', en: 'Shakh-Murat Ordabaev', kk: 'Шах-Мұрат Ордабаев', zh: '沙赫-穆拉特·奥尔达巴耶夫' },
    role: { ru: 'Старший сержант полиции', en: 'Senior Police Sergeant', kk: 'Полиция сержанты', zh: '警长角色' },
    image: './cast/shakh_murat_ordabaev.png',
  },
  {
    name: { ru: 'Куантай Абдимади', en: 'Kuantai Abdimadi', kk: 'Қуантай Әбдімәди', zh: '库安泰·阿卜迪马迪' },
    role: { ru: 'Напарник патруля', en: 'Patrol Officer', kk: 'Патруль офицері', zh: '巡警角色' },
    image: './cast/kuantai_abdimadi.png',
  },
  {
    name: { ru: 'Рустам Бекмухамбетов', en: 'Rustam Bekmukhambetov', kk: 'Рустам Бекмұхамбетов', zh: '鲁斯塔姆·别克穆罕别托夫' },
    role: { ru: 'Завхоз стадиона Саныч', en: 'Stadium Manager Sanych', kk: 'Стадион шаруашылық меңгерушісі', zh: '体育场主管萨anych' },
    image: './cast/rustam_bekmukhambetov.png',
  },
  {
    name: { ru: 'Диас Байтуов', en: 'Dias Baituov', kk: 'Диас Байтұов', zh: '迪亚斯·拜图奥夫' },
    role: { ru: 'Характерный ансамбль', en: 'Character Ensemble', kk: 'Ансамбль актері', zh: '实力派群像演员' },
    image: './cast/dias_baituov.png',
  },
  {
    name: { ru: 'Ирина Ажмухамедова', en: 'Irina Azhmukhamedova', kk: 'Ирина Ажмұхамедова', zh: '伊琳娜·阿日穆哈梅多娃' },
    role: { ru: 'Тренер / Врач комиссии', en: 'Medical & Coaching Staff', kk: 'Дәрігер / Жаттықтырушы', zh: '体能教练 / 医疗官' },
    image: './cast/irina_azhmukhamedova.png',
  },
  {
    name: { ru: 'Жалгас Жангазин', en: 'Zhalgas Zhangazin', kk: 'Жалғас Жанғазин', zh: '扎尔加斯·詹加津' },
    role: { ru: 'Молодой Артём', en: 'Young Artyom', kk: 'Жас Артём', zh: '青年阿尔乔姆' },
    image: './cast/zhalgas_zhangazin.png',
  },
  {
    name: { ru: 'Салим Айлазов', en: 'Salim Ailazov', kk: 'Сәлім Айлазов', zh: '萨利姆·艾拉佐夫' },
    role: { ru: 'Магомед (Братство лагеря «Лишние»)', en: 'Magomed (Camp Brotherhood)', kk: 'Магомед («Артық емес» лагері)', zh: '马戈梅德（减重营室友）' },
    image: './cast/salim_ailazov.png',
  },
  {
    name: { ru: 'Расул Бахтияров', en: 'Rasul Bakhtiyarov', kk: 'Расул Бақтияров', zh: '拉苏尔·巴赫蒂亚罗夫' },
    role: { ru: 'Ансамбль фильма', en: 'Supporting Cast', kk: 'Фильм ансамблі', zh: '特邀演员' },
    image: './cast/rasul_bakhtiyarov.png',
  },
  {
    name: { ru: 'Карлыгаш Жакупова', en: 'Karlygash Zhakupova', kk: 'Қарлығаш Жақұпова', zh: '卡尔勒加什·贾库波娃' },
    role: { ru: 'Команда JANA MEN', en: 'JANA MEN Team', kk: 'JANA MEN командасы', zh: 'JANA MEN 核心团队' },
    image: './cast/karlygash_zhakupova.png',
  },
  {
    name: { ru: 'Расул Сабитов', en: 'Rasul Sabitov', kk: 'Расул Сабитов', zh: '拉苏尔·萨比托夫 (Rasul Sabitov)' },
    role: { ru: 'Реальный участник IBA JANA MEN', en: 'Real Alumni of IBA JANA MEN', kk: 'IBA JANA MEN қатысушысы', zh: 'IBA JANA MEN 真实减重学员' },
    image: './cast/rasul_sabitov.png',
  },
  {
    name: { ru: 'Куандык Маткеримов', en: 'Kuandyk Matkerimov', kk: 'Қуандық Мәткерімов', zh: '库安德克·马特克里莫夫 (Kuandyk Matkerimov)' },
    role: { ru: 'Реальный участник IBA JANA MEN', en: 'Real Alumni of IBA JANA MEN', kk: 'IBA JANA MEN қатысушысы', zh: 'IBA JANA MEN 真实减重学员' },
    image: './cast/kuandyk_matkerimov.png',
  },
  {
    name: { ru: 'Участники проекта IBA JANA MEN', en: 'IBA JANA MEN Camp Participants', kk: 'IBA JANA MEN жобасының қатысушылары', zh: 'IBA JANA MEN 真实减重学员群像' },
    role: { ru: 'Реальное братство трансформации (сброс свыше 1500 кг)', en: 'Real Transformation Brotherhood (1,500+ kg lost)', kk: 'Нақты трансформация бауырластығы', zh: '真实减重公益运动群像（累计减重1500+公斤）' },
    image: './cast/janamen_participants.png',
  },
];

export const KEY_CREW_DATA: KeyCrewMember[] = [
  {
    name: {
      ru: 'Айтым Жакупов',
      en: 'Aitym Zhakupov',
      kk: 'Айтым Жақұпов',
      zh: '艾特姆·贾库波夫 (Aitym Zhakupov)',
    },
    role: {
      ru: 'Генеральный продюсер · Основатель JANA MEN · В роли Наставника',
      en: 'General Producer · Founder of JANA MEN · Mentor Aitym',
      kk: 'Бас продюсер · JANA MEN негізін қалаушы · Тәлімгер рөлінде',
      zh: '总制片人 · JANA MEN 运动创始人 · 本色出演精神导师',
    },
    bio: {
      ru: 'Основатель реального движения трансформации IBA JANA MEN и генеральный продюсер картины. В фильме играет самого себя — бескомпромиссного наставника, чья сцена с латунными весами становится философским стержнем истории.',
      en: 'Founder of the real-life IBA JANA MEN movement and General Producer. Portrays himself on screen—stripping away self-pity with his iconic brass scales philosophy.',
      kk: 'IBA JANA MEN қозғалысының негізін қалаушы және фильмнің бас продюсері. Кадрда өз рөлін сомдап, жез таразы философиясы арқылы кейіпкерлердің рухын оятады.',
      zh: 'IBA JANA MEN 真实减重公益运动创始人兼总制片人。在片中本色出演铁血而慈悲的导师艾特姆，其“黄铜天平”戏份是全片的精神内核。',
    },
    photo: 'https://i.postimg.cc/DZhTS3n7/Ajtym1.jpg',
  },
  {
    name: {
      ru: 'Сергей Бондарев',
      en: 'Sergey Bondarev',
      kk: 'Сергей Бондарев',
      zh: '谢尔盖·邦达列夫 (Sergey Bondarev)',
    },
    role: {
      ru: 'Шоураннер · Ведущий и линейный продюсер · Соавтор сценария (Big Movie Studio)',
      en: 'Showrunner · Lead & Line Producer · Co-Writer (Big Movie Studio)',
      kk: 'Шоураннер · Жетекші продюсер · Сценарий тең авторы (Big Movie Studio)',
      zh: '剧集总监 (Showrunner) · 领衔制片人 · 联合编剧 (Big Movie Studio)',
    },
    bio: {
      ru: 'Автор оригинальной идеи, шоураннер и ведущий продюсер (Big Movie Studio). Более 60 реализованных проектов, выпускник Serial Bridges Central Asia и The Central Asian Showrunner Intensive. Отвечает за архитектуру производства и международную дистрибуцию.',
      en: 'Original concept creator, Showrunner, and Lead Producer at Big Movie Studio (60+ credits). Oversees creative DNA, live marathon production, and global distribution partnerships.',
      kk: 'Түпнұсқа идея авторы, шоураннер және Big Movie Studio жетекші продюсері. 60-тан астам жобаның авторы, өндіріс пен халықаралық дистрибуцияны басқарады.',
      zh: '原创故事概念发起人、剧集总监兼 Big Movie Studio 领衔制片人。拥有60余部影视制作经验，全面统筹本片创意、万人马拉松实景拍摄及国际发行合作。',
    },
    photo: 'https://i.postimg.cc/cJvYY3h6/IMAGE-FILE-CACHE-PROFILE-PROVIDER.gif',
    link: 'https://www.kinopoisk.ru/name/10238377/',
    linkLabel: 'Kinopoisk ↗',
  },
  {
    name: {
      ru: 'Константин Майер',
      en: 'Konstantin Mayer',
      kk: 'Константин Майер',
      zh: '康斯坦丁·迈耶 (Konstantin Mayer)',
    },
    role: {
      ru: 'Художественный руководитель · Креативный продюсер · Соавтор сценария',
      en: 'Artistic Director · Creative Producer · Co-Writer',
      kk: 'Көркемдік жетекші · Креативті продюсер · Сценарий тең авторы',
      zh: '艺术总监 · 创意制片人 · 联合编剧（《我是如何减肥的》编剧）',
    },
    bio: {
      ru: 'Хитмейкер и автор сценария народного блокбастера «Я худею», а также проектов «Толя-робот» и «Физрук». Уроженец Темиртау, создавший в «НЕ ЛИШНИХ» идеальный сплав зрительского юмора, социальной правды и катарсиса.',
      en: 'Hit screenwriter behind the blockbuster weight-loss dramedy "I Am Losing Weight" («Я худею»), "Tolya-Robot", and "Fizruk". Born in Temirtau, crafting an emotional crowd-pleaser.',
      kk: '«Я худею», «Толя-робот» және «Физрук» хиттерінің сценарий авторы. Теміртау тумасы ретінде терең драма мен жарқын драмедиді шебер ұштастырған.',
      zh: '现象级励志喜剧大片《我是如何减肥的》(I Am Losing Weight) 王牌编剧，出生于铁米尔套，深谙大众情感共鸣与商业叙事节奏。',
    },
    photo: 'https://i.postimg.cc/j2SRwH6m/majer-konstantin.jpg',
    link: 'https://www.kinopoisk.ru/name/2206458/',
    linkLabel: 'Kinopoisk ↗',
  },
  {
    name: {
      ru: 'Бахытжан Куншашова',
      en: 'Bakhytzhan Kunshashova',
      kk: 'Бақытжан Күншашова',
      zh: '巴赫特詹·昆沙绍娃 (Bakhytzhan Kunshashova)',
    },
    role: {
      ru: 'Исполнительный продюсер · Продюсер IBA JANA MEN',
      en: 'Executive Producer · Producer IBA JANA MEN',
      kk: 'Атқарушы продюсер · IBA JANA MEN продюсері',
      zh: '执行制片人 · IBA JANA MEN 制片人',
    },
    bio: {
      ru: 'Руководит финансовым контуром, юридической базой, административным ресурсом и организацией съёмок в Астане.',
      en: 'Directs budgeting, legal clearances, municipal coordination in Astana, and operational execution.',
      kk: 'Қаржылық жоспарлауды, заңдық базаны және Астанадағы түсірілім логистикасын басқарады.',
      zh: '全面负责影片预算管控、法务合规、阿斯塔纳市政协调及大型实景拍摄执行。',
    },
    photo: 'https://i.postimg.cc/MZv4T31H/Bahyt.png',
  },
  {
    name: {
      ru: 'Расул Шарафеддинов',
      en: 'Rasul Sharafeddinov',
      kk: 'Расул Шарафеддинов',
      zh: '拉苏尔·沙拉费丁诺夫 (Rasul Sharafeddinov)',
    },
    role: {
      ru: 'Режиссёр-постановщик',
      en: 'Director',
      kk: 'Қоюшы-режиссер',
      zh: '导演 (Director)',
    },
    bio: {
      ru: 'Казахстанский режиссёр и драматург («Должник», «Astana — непростая история», «Іңкәр»), мастер пронзительных психологических историй.',
      en: 'Acclaimed Kazakh director and dramatist ("The Debtor", "Astana — A Complex Story", "Inkar").',
      kk: 'Қазақстандық режиссер әрі драматург («Борышкер», «Іңкәр»), психологиялық драма шебері.',
      zh: '哈萨克斯坦知名导演兼剧作家（代表作《债务人》《阿斯塔纳故事》），擅长细腻动人的现实主义情感表达。',
    },
    photo: 'https://i.postimg.cc/pXMv5ZWC/Rezisser.jpg',
    link: 'https://www.kinopoisk.ru/name/6874809/',
    linkLabel: 'Kinopoisk ↗',
  },
  {
    name: {
      ru: 'Михаил Сирьянов',
      en: 'Mikhail Siryanov',
      kk: 'Михаил Сирьянов',
      zh: '米哈伊尔·西里亚诺夫 (Mikhail Siryanov)',
    },
    role: {
      ru: 'Продюсер · Оператор-постановщик (DP)',
      en: 'Producer · Director of Photography (DP)',
      kk: 'Продюсер · Қоюшы-оператор (DP)',
      zh: '制片人 · 摄影指导 (DP)',
    },
    bio: {
      ru: 'Оператор-постановщик международного уровня («DOMM», «Blue Escape», «КоКе», «Omir»), выстроивший визуальную трансформацию кадра от холодного бетона к марафонскому простору.',
      en: 'International DP & Producer ("DOMM", "Blue Escape", "KoKe", "Omir") architecting the visual evolution of the frame.',
      kk: 'Халықаралық деңгейдегі қоюшы-оператор әрі продюсер («DOMM», «Blue Escape», «КоКе», «Omir»).',
      zh: '国际级摄影指导兼制片人（曾参与好莱坞、印度及HBO项目），以极具冲击力的镜头语言构建全片色彩演进。',
    },
    photo: 'https://i.postimg.cc/PJX1CRRL/600x900-(2).png',
    link: 'https://www.kinopoisk.ru/name/7080215/',
    linkLabel: 'Kinopoisk ↗',
  },
  {
    name: {
      ru: 'Елена Бегайдарова-Латаева',
      en: 'Elena Begaidarova-Lataeva',
      kk: 'Елена Бегайдарова-Латаева',
      zh: '叶莲娜·别盖达罗娃-拉塔耶娃 (Elena Begaidarova)',
    },
    role: {
      ru: 'Второй режиссёр (1st AD)',
      en: 'First Assistant Director (1st AD)',
      kk: 'Екінші режиссер (1st AD)',
      zh: '第一副导演 (1st AD)',
    },
    bio: {
      ru: 'Ведущий 1st AD масштабных экшен-картин, управляющая сложнейшей логистикой съёмок внутри реального марафона.',
      en: 'Veteran 1st AD of international action features, commanding crowd & stunt logistics inside the live marathon.',
      kk: 'Ірі халықаралық экшен-жобалардың тәжірибелі екінші режиссері.',
      zh: '资深国际动作片第一副导演，精准把控万人马拉松实景跟拍与特技调度。',
    },
    photo: 'https://i.postimg.cc/tJkmnQdg/1st.jpg',
  },
  {
    name: {
      ru: 'Евгений Фетисов',
      en: 'Evgeny Fetisov',
      kk: 'Евгений Фетисов',
      zh: '叶夫根尼·费蒂索夫 (Evgeny Fetisov)',
    },
    role: {
      ru: 'Звукорежиссёр · Саунд-дизайнер (ASMR & 5.1)',
      en: 'Sound Director · ASMR Sound Designer',
      kk: 'Дыбыс режиссері · Саунд-дизайнер',
      zh: '声音指导 · 沉浸式 ASMR 音效设计师',
    },
    bio: {
      ru: '«Звукорежиссёр года» с 25-летним опытом. Создал тактильную звуковую партитуру дыхания, трения шнурков и пульсометра SOS (188 BPM).',
      en: 'Award-winning Sound Director (25+ years exp.) crafting the visceral ASMR breathing and 188 BPM SOS pulse soundscape.',
      kk: '25 жылдық тәжірибесі бар «Жыл дыбыс режиссері», фильмнің ASMR дыбыстық әлемін жасаушы.',
      zh: '从业25年的“年度最佳声音指导”，打造出极具生理沉浸感的呼吸声、鞋带摩擦与心率警报声学空间。',
    },
    photo: 'https://i.postimg.cc/Prhdwkyv/fetisov.png',
  },
  {
    name: {
      ru: 'Андрей Цирульник',
      en: 'Andrey Tsirulnik',
      kk: 'Андрей Цирульник',
      zh: '安德烈·齐鲁尔尼克 (Andrey Tsirulnik)',
    },
    role: {
      ru: 'Художник по гриму и костюму · SFX Makeup',
      en: 'Makeup & Costume Designer · SFX',
      kk: 'Грим және костюм суретшісі',
      zh: '造型与服装指导 · 特效化妆师',
    },
    bio: {
      ru: 'Мастер фактурного грима и костюма, проработавший визуальную трансформацию от рабочей робы уборщика до синей марафонки.',
      en: 'Lead costume and SFX makeup designer overseeing the tactile progression of Rasul’s wardrobe and physical look.',
      kk: 'Кейіпкердің киім мен грим эволюциясын жасаған жетекші шебер.',
      zh: '顶尖造型与服装设计指导，细腻呈现男主角从球场清洁工服到蓝色马拉松战袍的视觉蜕变。',
    },
    photo: 'https://i.postimg.cc/zBZG2HCd/andrej.png',
  },
];

export const FULL_CREDITS_DATA: FullCrewItem[] = [
  {
    department: {
      ru: 'Продюсерский департамент и Авторы',
      en: 'Producers & Screenwriters',
      kk: 'Продюсерлік департамент және Авторлар',
      zh: '制片与编剧部门 (Producers & Writers)',
    },
    members: [
      { role: { ru: 'Генеральный продюсер', en: 'General Producer', kk: 'Бас продюсер', zh: '总制片人' }, name: { ru: 'Айтым Жакупов', en: 'Aitym Zhakupov', kk: 'Айтым Жақұпов', zh: 'Aitym Zhakupov (艾特姆·贾库波夫)' } },
      { role: { ru: 'Художественный руководитель', en: 'Artistic Director', kk: 'Көркемдік жетекші', zh: '艺术总监' }, name: { ru: 'Константин Майер', en: 'Konstantin Mayer', kk: 'Константин Майер', zh: 'Konstantin Mayer (康斯坦丁·迈耶)' } },
      { role: { ru: 'Авторы сценария', en: 'Screenwriters', kk: 'Сценарий авторлары', zh: '编剧' }, name: { ru: 'Константин Майер, Сергей Бондарев', en: 'Konstantin Mayer, Sergey Bondarev', kk: 'Константин Майер, Сергей Бондарев', zh: 'Konstantin Mayer, Sergey Bondarev' } },
      { role: { ru: 'Исполнительный продюсер', en: 'Executive Producer', kk: 'Атқарушы продюсер', zh: '执行制片人' }, name: { ru: 'Бахытжан Куншашова', en: 'Bakhytzhan Kunshashova', kk: 'Бақытжан Күншашова', zh: 'Bakhytzhan Kunshashova' } },
      { role: { ru: 'Продюсер / Оператор-постановщик', en: 'Producer / DP', kk: 'Продюсер / Қоюшы-оператор', zh: '制片人 / 摄影指导' }, name: { ru: 'Михаил Сирьянов', en: 'Mikhail Siryanov', kk: 'Михаил Сирьянов', zh: 'Mikhail Siryanov' } },
      { role: { ru: 'Шоураннер / Ведущий и линейный продюсер', en: 'Showrunner / Lead & Line Producer', kk: 'Шоураннер / Жетекші продюсер', zh: '剧集总监 / 领衔及执行制片人' }, name: { ru: 'Сергей Бондарев', en: 'Sergey Bondarev', kk: 'Сергей Бондарев', zh: 'Sergey Bondarev (谢尔盖·邦达列夫)' } },
      { role: { ru: 'Линейный продюсер', en: 'Line Producer', kk: 'Желілік продюсер', zh: '现场制片主任' }, name: { ru: 'Ольга Опарина', en: 'Olga Oparina', kk: 'Ольга Опарина', zh: 'Olga Oparina' } },
      { role: { ru: 'Директор площадки / Пиротехника', en: 'Unit Manager / Pyrotechnics', kk: 'Алаң директоры / Пиротехника', zh: '场地主任 / 烟火特效' }, name: { ru: 'Вячеслав Асадуллин', en: 'Vyacheslav Asadullin', kk: 'Вячеслав Асадуллин', zh: 'Vyacheslav Asadullin' } },
    ],
  },
  {
    department: {
      ru: 'Режиссёрская группа, Кастинг и Художественный цех',
      en: 'Direction, Casting & Art Department',
      kk: 'Режиссерлік топ, Кастинг және Көркемдік цех',
      zh: '导演、选角与美术造型部门 (Direction, Casting & Art)',
    },
    members: [
      { role: { ru: 'Режиссёр-постановщик', en: 'Director', kk: 'Қоюшы-режиссер', zh: '导演' }, name: { ru: 'Расул Шарафеддинов', en: 'Rasul Sharafeddinov', kk: 'Расул Шарафеддинов', zh: 'Rasul Sharafeddinov' } },
      { role: { ru: 'Второй режиссёр (1st AD)', en: 'First Assistant Director', kk: 'Екінші режиссер', zh: '第一副导演' }, name: { ru: 'Елена Бегайдарова-Латаева', en: 'Elena Begaidarova-Lataeva', kk: 'Елена Бегайдарова-Латаева', zh: 'Elena Begaidarova-Lataeva' } },
      { role: { ru: 'Ассистент режиссёра / Скрипт-супервайзер', en: 'Assistant Director / Script Supervisor', kk: 'Режиссер ассистенті / Скрипт', zh: '副导演 / 场记' }, name: { ru: 'Арсений Опекан, Андрей Волков', en: 'Arseniy Opekan, Andrey Volkov', kk: 'Арсений Опекан, Андрей Волков', zh: 'Arseniy Opekan, Andrey Volkov' } },
      { role: { ru: 'Художник-постановщик', en: 'Production Designer', kk: 'Қоюшы-суретші', zh: '美术指导' }, name: { ru: 'Асель Улжебаева (асс.: Азат Ибраимов, Евгений Пак)', en: 'Assel Ulzhebayeva (Assts: Azat Ibraimov, Evgeny Pak)', kk: 'Әсел Ұлжебаева (асс.: Азат Ибраимов, Евгений Пак)', zh: 'Assel Ulzhebayeva (Azat Ibraimov, Evgeny Pak)' } },
      { role: { ru: 'Художник по гриму и костюму', en: 'Makeup & Costume Designer', kk: 'Грим және костюм суретшісі', zh: '造型与服装设计指导' }, name: { ru: 'Андрей Цирульник (асс.: Д. Карпенкова, А. Нурболатов, А. Бексұлтан, Г. Ермекова)', en: 'Andrey Tsirulnik (Assts: D. Karpenkova, A. Nurbolatov, A. Beksultan, G. Yermekova)', kk: 'Андрей Цирульник (асс.: Д. Карпенкова, А. Нұрболатов, А. Бексұлтан, Г. Ермекова)', zh: 'Andrey Tsirulnik & Team' } },
      { role: { ru: 'Кастинг-директор', en: 'Casting Director', kk: 'Кастинг-директор', zh: '选角导演' }, name: { ru: 'Асия Рахимова (асс.: Валентина Данилова)', en: 'Asiya Rakhimova (Asst: Valentina Danilova)', kk: 'Әсия Рахимова (асс.: Валентина Данилова)', zh: 'Asiya Rakhimova (Valentina Danilova)' } },
    ],
  },
  {
    department: {
      ru: 'Операторская группа, Монтаж, Звук и Администрация',
      en: 'Camera, Editorial, Sound & Unit Administration',
      kk: 'Операторлық топ, Монтаж, Дыбыс және Әкімшілік',
      zh: '摄影、剪辑、声音与制片保障部门 (Camera, Edit & Sound)',
    },
    members: [
      { role: { ru: 'Режиссёр монтажа / DIT (асс. плейбека)', en: 'Film Editor / DIT (Playback)', kk: 'Монтаж режиссері / DIT', zh: '剪辑指导 / DIT' }, name: { ru: 'Даниил Майер (Максим Похила)', en: 'Daniil Mayer (Maxim Pokhila)', kk: 'Даниил Майер (Максим Похила)', zh: 'Daniil Mayer (Maxim Pokhila)' } },
      { role: { ru: 'Тех. директор / Камермен / Стедикам', en: 'Tech Director / Camera / Steadicam', kk: 'Тех. директор / Камермен / Стедикам', zh: '技术总监 / 摄影师 / 斯坦尼康' }, name: { ru: 'Павел Кнебелев, Илья Толстобров', en: 'Pavel Knebelev, Ilya Tolstobrov', kk: 'Павел Кнебелев, Илья Толстобров', zh: 'Pavel Knebelev, Ilya Tolstobrov' } },
      { role: { ru: 'Фокус-пуллер / Механик DJI Ronin 4D', en: 'Focus Puller / DJI Ronin 4D Tech', kk: 'Фокус-пуллер / DJI Ronin 4D механигі', zh: '跟焦员 / Ronin 4D 技师' }, name: { ru: 'Досжан Дилдаханов, Еркебұлан Тұрғанов', en: 'Doszhan Dildakhanov, Yerkebulan Turganov', kk: 'Досжан Ділдаханов, Еркебұлан Тұрғанов', zh: 'Doszhan Dildakhanov, Yerkebulan Turganov' } },
      { role: { ru: 'Гаффер и цех осветителей', en: 'Gaffer & Lighting Crew', kk: 'Гаффер және жарық берушілер', zh: '灯光指导及灯光组' }, name: { ru: 'Адиль Аппазов; Е. Махамбетияров, Д. Колосовский, Д. Закиров, А. Ержанов, И. Ткачёв, Д. Абошев, Е. Хамитов, Ш. Асанова', en: 'Adil Appazov; Y. Makhambetiyarov, D. Kolosovskiy, D. Zakirov, A. Yerzhanov, I. Tkachev, D. Aboshev, Y. Khamitov, S. Asanova', kk: 'Әділ Аппазов және жарық цехы', zh: 'Adil Appazov & Lighting Team' } },
      { role: { ru: 'Звукорежиссёр / Саунд-дизайнер (Бум-оператор)', en: 'Sound Director / Designer (Boom)', kk: 'Дыбыс режиссері (Бум-оператор)', zh: '声音指导 / 混音师' }, name: { ru: 'Евгений Фетисов (Максат Садибеков)', en: 'Evgeny Fetisov (Maksat Sadibekov)', kk: 'Евгений Фетисов (Мақсат Сәдібеков)', zh: 'Evgeny Fetisov (Maksat Sadibekov)' } },
      { role: { ru: 'Бэкстейдж, Администрация и Транспорт', en: 'Backstage, Unit Admin & Transport', kk: 'Бэкстейдж, Әкімшілік және Көлік', zh: '纪录片花、外联制片与车队' }, name: { ru: 'А. Абсалямова, М. Новгородова, К. Голубцова; Д. Тулеуов, А. Альжанов, А. Бектемисов; Л. Носенко; М. Ковальчук, С. Шарапов, Б. Жанатаев', en: 'A. Absalyamova, M. Novgorodova, K. Golubtsova; D. Tuleuov, A. Alzhanov, A. Bektemisov; L. Nosenko; M. Kovalchuk, S. Sharapov, B. Zhanatayev', kk: 'Д. Төлеуов, Ә. Әлжанов, Ә. Бектемісов, Л. Носенко және т.б.', zh: 'Dauren Tuleuov & Unit Administration' } },
    ],
  },
];

export const HORIZONTAL_TRACK_STAGES = [
  {
    id: 'stage-1',
    step: 'STAGE 01',
    km: '00.0 KM',
    weight: '207 KG',
    bpm: '64 → 142 BPM',
    hex: '#090D16',
    accent: '#94A3B8',
    title: {
      ru: 'Подтрибунная каморка · Холодный бетон изоляции',
      en: 'Under-Stadium Cubicle · Cold Concrete Isolation',
      kk: 'Трибуна астындағы бөлме · Суық бетон оқшаулануы',
      zh: '第一阶段：看台下的幽闭储物间 · 冰冷混凝土与成龙海报',
    },
    desc: {
      ru: 'Антрацитовый мрак под трибунами стадиона (#090D16). Стены каморки Расула обклеены выцветшими постерами гонконгских боевиков 80-х с Джеки Чаном и Брюсом Ли. Развязанный шнурок на ночной беговой дорожке приводит к трагедии: погибает марафонец Артём, а его кричащий SOS-пульсометр остаётся в руках Расула.',
      en: 'Anthracite stadium bowels (#090D16). Rasul’s cramped room is lined with 1980s Jackie Chan and Bruce Lee posters—his only moral compass. On the night track, an untied shoelace triggers an accidental tragedy: runner Artyom dies of asthma, leaving Rasul with his SOS heart-rate watch and marathon diary.',
      kk: 'Стадион трибунасы астындағы қараңғылық (#090D16). Расулдың тар бөлмесінде Джеки Чан мен Брюс Лидің постерлері ілінген. Түнгі жолақта шешілген бау қайғылы оқиғаға әкеліп соғады.',
      zh: '体育场看台下的深灰幽闭空间（#090D16）。拉苏尔狭窄的房间墙上贴满80年代成龙与李小龙的香港动作片海报——这是他唯一的精神寄托。深夜跑道上散落的鞋带引发意外悲剧，跑者阿尔乔姆哮喘身亡，留下尖叫报警的SOS心率表与训练日记。',
    },
    image: 'https://i.postimg.cc/Z54244Kw/Kamorka2.jpg',
  },
  {
    id: 'stage-2',
    step: 'STAGE 02',
    km: '14.5 KM',
    weight: '192 KG',
    bpm: '158 BPM',
    hex: '#F97316',
    accent: '#F97316',
    title: {
      ru: 'Оранжевый пульс лагеря JANA MEN · Без CGI-обмана',
      en: 'JANA MEN Orange Pulse · Authentic Weight Loss (Zero CGI Cheats)',
      kk: 'JANA MEN қызғылт сары серпіні · CGI-сыз нақты трансформация',
      zh: '第二阶段：JANA MEN 橙色风暴 · 演员真实减重（零CGI作弊）',
    },
    desc: {
      ru: 'В реабилитационном лагере «Не лишние» мир взрывается энергией #F97316. Исполнитель главной роли Ерсултан Уаис прошёл через реальный медицински контролируемый сброс веса в лагере JANA MEN прямо во время производства. Наставник Айтым ставит перед ним латунные весы, а Эльвира впервые учит его завязывать крепкий узел.',
      en: 'Inside the "Not Extra" boot camp, the frame ignites with #F97316 orange energy. Lead actor Ersultan Uais underwent an actual medically supervised weight-loss journey inside the real JANA MEN camp during filming. Mentor Aitym confronts his fear with brass apothecary scales while Elvira teaches him to tie his shoes.',
      kk: '«Артық емес» лагерінде кадр #F97316 қызғылт сары энергияға толады. Басты рөлдегі Ерсұлтан Уаис түсірілім кезінде JANA MEN лагерінде нақты медициналық бақылаумен салмақ тастады.',
      zh: '进入“绝不多余”减重训练营，画面燃起 #F97316 的热血橙色。男主角叶尔苏丹·乌艾斯在拍摄期间于真实的 JANA MEN 训练营接受医学监督减重，汗水与肌肉颤抖100%真实（宛如《热辣滚烫》的极限蜕变）。导师艾特姆以黄铜天平叩问内心，艾尔薇拉教会他系紧人生第一个双结。',
    },
    image: 'https://i.postimg.cc/GpC8BDZY/Whats-App-Image-2026-03-09-at-16.jpg',
  },
  {
    id: 'stage-3',
    step: 'STAGE 03',
    km: '35.0 KM',
    weight: '176 KG',
    bpm: '176 BPM',
    hex: '#0284C7',
    accent: '#38BDF8',
    title: {
      ru: 'Синяя марафонка Артёма · Живой марафон Астаны',
      en: 'Artyom’s Blue Jacket · Filmed Live Inside the Astana Marathon',
      kk: 'Артемнің көк марафон күртешесі · Астанадағы нақты марафон',
      zh: '第三阶段：蓝色马拉松战袍 · 阿斯塔纳万人马拉松实景拍摄',
    },
    desc: {
      ru: 'Дочь Артёма Юля разрушает миф о дневнике: её отец был аферистом, а не героем. Но синяя марафонка (#0284C7) впервые застёгивается на груди Расула. Прыгнув с козырька лагеря, он вливается в поток тысяч реальных бегунов официального марафона Астаны.',
      en: 'Artyom’s daughter Yulia exposes her father’s con-artist past, shattering the diary myth. Yet the electric blue marathon jacket (#0284C7) finally zips shut across Rasul’s chest. Leaping from the camp awning, he merges into the live stream of thousands of real runners at the official Astana Marathon.',
      kk: 'Артемнің қызы Юля әкесінің алаяқ болғанын айтып, күнделік аңызын талқандайды. Бірақ көк марафон күртешесі (#0284C7) Расулдың кеудесіне дәл қонып, ол мыңдаған нақты марафоншылардың ағынына қосылады.',
      zh: '尤莉亚揭穿父亲阿尔乔姆实为骗子的真相，精神偶像轰然倒塌。但那件蓝色马拉松战袍（#0284C7）终于在拉苏尔胸前拉上了拉链。他从训练营雨棚跃下，汇入阿斯塔纳官方马拉松数千名真实跑者的滚滚洪流。',
    },
    image: 'https://i.postimg.cc/kM2w6vnj/Krosovki.png',
  },
  {
    id: 'stage-4',
    step: 'STAGE 04',
    km: '42.2 KM',
    weight: 'RECLAIMED',
    bpm: '188 BPM (SOS)',
    hex: '#10B981',
    accent: '#34D399',
    title: {
      ru: '10 метров до финиша · Разворот ради спасения жизни',
      en: '10 Meters from the Finish Line · Turning Back to Save a Life',
      kk: 'Мәреге 10 метр қалғанда · Өмірді құтқару үшін кері бұрылу',
      zh: '第四阶段：距终点10米的转身 · 拯救生命与灵魂救赎',
    },
    desc: {
      ru: 'Пульсометр бьёт 188 BPM (SOS ALERT). За 10 метров до финишной арки Расул падает на красный тартан, в подсознании навсегда останавливая ремень отчима. Открыв глаза в шаге от медали, он разворачивается спиной к финишу и идёт назад против толпы, чтобы спасти задыхающуюся Юлю ингалятором.',
      en: 'The SOS tracker screams at 188 BPM. Collapsing 10 meters from the arch, Rasul breaks his childhood phantom forever. Opening his eyes inches from the medal, he turns his back on the finish line and walks against the crowd to save Yulia from a fatal asthma attack with an inhaler.',
      kk: 'Пульсометр 188 BPM (SOS) соғады. Мәре аркасына 10 метр қалғанда Расул балалық шақ қорқынышын жеңіп, медальдан бас тартады да, демікпеден құлаған Юляны ингалятормен құтқару үшін кері жүреді.',
      zh: '心率表飙升至188 BPM发出刺耳SOS警报。在距离终点拱门仅10米处，拉苏尔战胜了童年继父的梦魇。睁开眼面对触手可及的奖牌，他却毅然背对终点逆流而回，用吸入器救下哮喘发作倒地的尤莉亚，找回了自己的真名“拉苏尔”。',
    },
    image: 'https://i.postimg.cc/zXjjHmcf/finis.jpg',
  },
];

export const DIARY_XRAY_QUOTES = [
  {
    surfaceTitle: {
      ru: 'СТРАНИЦА 14 · «ФИЛОСОФИЯ БРЮСА ЛИ И ДЖЕКИ ЧАНА»',
      en: 'PAGE 14 · "THE WAY OF BRUCE LEE & JACKIE CHAN"',
      kk: '14-БЕТ · «БРЮС ЛИ МЕН ДЖЕКИ ЧАН ФИЛОСОФИЯСЫ»',
      zh: '日记第14页 · “李小龙与成龙的武道信条”',
    },
    surfaceQuote: {
      ru: '«Будь как вода, друг мой. Когда тело горит на 30-м километре, помни: чемпион — это тот, кто встаёт на один раз больше, чем падает. Я бегу этот марафон, чтобы моя дочь гордилась честным именем отца».',
      en: '“Be like water, my friend. When your lungs burn at kilometer 30, remember Jackie Chan in Armor of God: a champion gets up one more time than he falls. I run so my daughter Yulia can be proud of her father’s honest name.”',
      kk: '«Досым, су сияқты бол. 30-шы шақырымда өкпең өртенгенде есіңде болсын: чемпион — құлағаннан бір рет артық тұратын адам. Мен бұл марафонды қызым Юля әкесінің адал атымен мақтануы үшін жүгіремін».',
      zh: '“像水一样吧，我的朋友。当跑到30公里肺部如火烧时，想想成龙电影里的永不言弃：真正的冠军总是比跌倒多站起来一次。我跑这场马拉松，是为了让女儿尤莉亚以父亲清白的名字为傲。”',
    },
    xrayTitle: {
      ru: 'РЕНТГЕН ПРАВДЫ · РЕАЛЬНОЕ ПРОШЛОЕ АРТЁМА',
      en: 'X-RAY TRUTH · ARTYOM’S CON-ARTIST REALITY',
      kk: 'ШЫНДЫҚ РЕНТГЕНІ · АРТЁМНІҢ ШЫНАЙЫ ӨТКЕНІ',
      zh: 'X光真相层 · 阿尔乔姆的诈骗犯过往',
    },
    xrayTruth: {
      ru: 'УГОЛОВНОЕ ДЕЛО №404: Артём Гележинис никогда не был спортсменом. Бывший осуждённый за финансовую пирамиду, оставивший семью в долгах. Весь его «дневник чемпиона» — отчаянная выдумка, сочинённая в камере по пиратским кассетам 80-х, чтобы вымолить прощение у дочери Юли на финише.',
      en: 'CASE FILE #404: Artyom Gelezhinis was never an elite athlete. Convicted of running a financial Ponzi scheme that ruined his family, he fabricated this entire "warrior diary" in prison from 1980s VHS movies as a desperate last gamble to beg his daughter Yulia for forgiveness.',
      kk: '№404 ҚЫЛМЫСТЫҚ ІС: Артём ешқашан спортшы болмаған. Қаржы пирамидасы үшін сотталып, отбасын қарызға батырған алаяқ. Бұл «чемпион күнделігі» — қызы Юлядан кешірім сұрау үшін түрмеде ойдан шығарылған аңыз.',
      zh: '案件卷宗 #404：阿尔乔姆从未是什么体坛英雄。他因设立金融庞氏骗局入狱，令妻女背负巨债。这本所谓的“冠军日记”，不过是他在狱中抄袭80年代港片台词编造的体面谎言，只为在马拉松终点祈求女儿尤莉亚的原谅。',
    },
  },
];

export const I18N = {
  ru: {
    title: 'НЕ ЛИШНИЕ',
    subTitle: 'NOT EXTRA · АРТЫҚ ЕМЕС · 《绝不多余》',
    genre: 'Психологическое социально-спортивное драмеди',
    statusPill: 'РАННИЙ ПОСТПРОДАКШН (ЧЕРНОВОЙ МОНТАЖ)',
    releasePill: 'РЕЛИЗ В КИНО: ВЕСНА 2027 (МАРТ – МАЙ)',
    soundOn: 'SOUND ON · ASMR',
    soundOff: 'SOUND OFF',
    nav: {
      hero: 'Пролог',
      lace: 'Узел судьбы',
      scales: 'Весы & Рентген',
      track: '42.2 КМ',
      cast: 'Каст & Команда',
      sales: 'Buyers Room (#sales)',
    },
    hero: {
      bridgeTag: 'СЦЕНА 01 · ЛОВУШКА ГРЁЗЫ НА МОСТУ АСТАНЫ',
      dreamState: 'ИЛЛЮЗИЯ: ЛЁГКИЙ БЕГ НАД РЕКОЙ ИШИМ',
      realityState: 'РЕАЛЬНОСТЬ: 207 КГ · ХОЛОДНЫЙ БЕТОН СТАДИОНА',
      pitchLine: 'Самый неподходящий человек против самой тяжёлой дистанции.',
      hookLine:
        'Эмоциональная трансформация «YOLO» (热辣滚烫) встречает искупление «Кита» и драйв гонконгского экшена 80-х.',
      scrollHint: 'Крутите вниз — почувствуйте тяжесть 207 кг и слом иллюзии',
      ctaSales: 'International Sales & Buyers Room',
      ctaTeaser: 'Смотреть референс-промо (Rough Cut)',
    },
    lace: {
      tag: 'СЦЕНА 02 · РАЗВЯЗАННЫЙ ШНУРОК И 10 МЕТРОВ ВЕЧНОСТИ',
      title: 'Узел, который возвращает человеческое достоинство',
      desc: 'В первом акте развязанный шнурок Расула приводит к трагедии на ночной дорожке и гибели Артёма. В лагере «Не лишние» администратор Эльвира опускается на колени перед 200-килограммовым изгоем и учит его завязывать крепкий двойной узел. Прокрутите страницу, чтобы стянуть нить судьбы.',
      untiedLabel: 'АКТ I: РАЗВЯЗАННЫЙ ШНУРОК (ВИНА И ПАДЕНИЕ)',
      tiedLabel: 'ЭПИЛОГ: КРЕПКИЙ УЗЕЛ (ИСЦЕЛЕНИЕ И КОНТРОЛЬ)',
    },
    scales: {
      tag: 'СЦЕНА 03 · ЛАТУННЫЕ ВЕСЫ АЙТЫМА & РЕНТГЕН ДНЕВНИКА',
      title: '«Твой страх и обиды весят больше твоих 200 килограммов»',
      desc: 'Наведите курсор или наклоните чаши аптекарских весов наставника Айтыма Жакупова. На одной чаше — 207 кг детской травмы, чужой лжи и саможалости; на другой — 1 грамм кристальной честности перед самим собой.',
      leftPanTitle: 'ЧАША I · 207 КГ БРОНИ И СТРАХА',
      leftPanSub: 'Детская травма, ночное апноэ, чужое имя и побег от реальности',
      rightPanTitle: 'ЧАША II · 1 ГРАММ ЧЕСТНОСТИ ДУХА',
      rightPanSub: 'Дисциплина JANA MEN, пост Ораза и спасение чужой жизни на финише',
      xrayHeader: 'РЕНТГЕН ДНЕВНИКА АРТЁМА: ФАНТАЗИЯ ПРОТИВ РЕАЛЬНОСТИ',
      xrayHintDesktop: 'Водите лучом фонарика по странице тетради Артёма, чтобы просветить правду сквозь мотивационный миф:',
      xrayHintMobile: 'Двигайте ползунок рентгена, чтобы вскрыть правду под страницами дневника Артёма:',
    },
    track: {
      tag: 'СЦЕНА 04 · ГОРИЗОНТАЛЬНЫЙ ТРЕК «42.2 КМ»',
      title: 'Хроматическая и физическая эволюция кадра',
      hint: 'Прокручивайте страницу или переключайте фазы дистанции',
    },
    cast: {
      tag: 'АКТЁРСКИЙ АНСАМБЛЬ И КОМАНДА (BENTO GRID)',
      title: 'Звёзды экрана и создатели фильма',
      sub: 'Подтверждённый актёрский состав и все департаменты съёмочной группы из официальных титров картины',
      expandCredits: 'Открыть полный список всех цехов из официальных титров (PDF Verified)',
      collapseCredits: 'Свернуть полный список титров',
    },
    sales: {
      tag: 'СЦЕНА 05 · ЗАКРЫТЫЙ ПРОДЮСЕРСКИЙ ТЕРМИНАЛ (B2B BUYERS ROOM)',
      title: 'International Sales, Greater China & Festival Desk',
      sub: 'Официальный B2B-паспорт проекта, дорожная карта постпродакшна, музыкальное предложение и прямые контакты для закупщиков (Beijing Hugoeast Media & мировых дистрибьюторов).',
      specsTitle: 'Инженерный паспорт проекта (Technical & Market Specs)',
      roadmapTitle: 'Интерактивная шкала готовности (Post-Production Roadmap)',
      dealTitle: 'Условия сделки и открытые права (Commercial Terms & Rights)',
      dealBody:
        'Открыты права на Большой Китай (Mainland China, Hong Kong, Macau, Taiwan) и международные территории (Theatrical, VOD/SVOD, TV, Ancillary). Команда открыта к подписанию предварительного договора (Pre-Buy / Co-Distribution) или Меморандума о взаимопонимании (MOU) на этапе чернового монтажа (Rough Cut) с предоставлением закрытого скринера «рыбы» для аккредитованных байеров.',
      musicTitle: 'Эксклюзивный музыкальный ко-маркетинг: «Я — это ты» × Димаш Кудайберген',
      musicBody:
        'Официально очищены права у наследников Мурата Насырова на создание новой заглавной версии легендарного хита «Я — это ты» («I Am You» / 《我是你》) специально для фильма. Эксклюзивная опция для китайских партнёров: совместная запись официального саундтрека на китайском языке (Mandarin) в исполнении Димаша Кудайбергена (迪玛希) или топ-звезды КНР.',
      screeningRoomTitle: 'Кинозал референсного промо-ролика (3-Min Subtitled Preview)',
      disclaimerBadge: 'Work-in-Progress Rough Cut Reference — Temp Un-cleared Music for Tonal Preview Only',
      disclaimerText:
        'Текущий 3-минутный промо-ролик с китайскими и английскими субтитрами собран из материалов раннего чернового монтажа (Rough Cut) и использует временную референсную музыку (Temp Track) исключительно для демонстрации темпоритма и тональности.',
      downloadChinaDeck: 'Скачать China Export Pitch Deck (PDF)',
      downloadEnDeck: 'Скачать International Pitch Deck (PDF)',
      copyEmail: 'Скопировать корпоративный Email',
      copied: 'Скопировано в буфер!',
    },
  },
  en: {
    title: 'NOT EXTRA',
    subTitle: 'НЕ ЛИШНИЕ · 《绝不多余》 · АРТЫҚ ЕМЕС',
    genre: 'Psychological Sports Dramedy',
    statusPill: 'EARLY POST-PRODUCTION (ROUGH CUT STAGE)',
    releasePill: 'THEATRICAL RELEASE: SPRING 2027 (MARCH – MAY)',
    soundOn: 'SOUND ON · ASMR',
    soundOff: 'SOUND OFF',
    nav: {
      hero: 'Prologue',
      lace: 'The Shoelace',
      scales: 'Scales & X-Ray',
      track: '42.2 KM Track',
      cast: 'Cast & Crew',
      sales: 'Buyers Room (#sales)',
    },
    hero: {
      bridgeTag: 'SCENE 01 · THE MIRAGE TRAP ON ASTANA BRIDGE',
      dreamState: 'ILLUSION: WEIGHTLESS RUN OVER THE ISHIM RIVER',
      realityState: 'REALITY: 207 KG · COLD STADIUM CONCRETE (#090D16)',
      pitchLine: 'The most unlikely man against the hardest distance on Earth.',
      hookLine:
        'The emotional weight-loss transformation of "YOLO" (热辣滚烫) meets the gripping redemption arc of "The Whale" and the kinetic drive of 1980s Hong Kong action cinema.',
      scrollHint: 'Scroll down — feel the 207 kg inertia and shatter the mirage',
      ctaSales: 'International Sales & Buyers Room',
      ctaTeaser: 'Watch Rough-Cut Reference Reel',
    },
    lace: {
      tag: 'SCENE 02 · THE UNTIED SHOELACE & 10 METERS OF ETERNITY',
      title: 'The Knot That Restores Human Dignity',
      desc: 'In Act I, Rasul’s untied shoelace causes a fatal accident on the night track. At the "Not Extra" camp, administrator Elvira kneels before the 200-kg outcast and teaches him to tie a secure double-knot. Scroll to pull the laces tight.',
      untiedLabel: 'ACT I: UNTIED LACES (FALL & GUILT)',
      tiedLabel: 'EPILOGUE: DOUBLE KNOT (AGENCY & SELF-MASTERY)',
    },
    scales: {
      tag: 'SCENE 03 · AITYM’S BRASS SCALES & DIARY X-RAY',
      title: '“Your fear and resentment weigh more than all 200 kg of your flesh”',
      desc: 'Move your cursor across Mentor Aitym Zhakupov’s apothecary balance beam. On one pan rests 207 kg of childhood trauma and stolen identity; on the other rests 1 gram of fearless honesty.',
      leftPanTitle: 'PAN I · 207 KG OF TRAUMA & ARMOR',
      leftPanSub: 'Childhood fear, sleep apnea, borrowed identity & hiding in shadows',
      rightPanTitle: 'PAN II · 1 GRAM OF SPIRITUAL HONESTY',
      rightPanSub: 'JANA MEN discipline, fasting clarity & saving a life at the finish line',
      xrayHeader: 'ARTYOM’S DIARY X-RAY: FANTASY VS. REALITY',
      xrayHintDesktop: 'Move the flashlight beam over Artyom’s notebook to expose the con-artist truth beneath his 1980s action-movie quotes:',
      xrayHintMobile: 'Drag the X-Ray slider to reveal the truth hidden beneath Artyom’s motivational diary:',
    },
    track: {
      tag: 'SCENE 04 · 42.2 KM HORIZONTAL CHROMATIC TRACK',
      title: 'Evolution of Color, Weight & Marathon Scale',
      hint: 'Scroll through the pinned track or click any distance marker',
    },
    cast: {
      tag: 'STARRING ENSEMBLE & FILMMAKERS (BENTO GRID)',
      title: 'Main Cast & Key Creative Powerhouse',
      sub: '100% verified cast and full department credits from official production records',
      expandCredits: 'Expand Complete Official Crew Credits (All Departments)',
      collapseCredits: 'Collapse Full Crew Credits',
    },
    sales: {
      tag: 'SCENE 05 · B2B PRODUCER TERMINAL (INTERNATIONAL SALES & BUYERS ROOM)',
      title: 'International Sales, Greater China & Festival Desk',
      sub: 'Engineered for Beijing Hugoeast Media, major Mainland Chinese distributors, international buyers, and festival programmers.',
      specsTitle: 'Technical & Market Passport (Engineering Grid)',
      roadmapTitle: 'Post-Production & Delivery Roadmap (2026–2027)',
      dealTitle: 'Commercial Partnership & Available Rights',
      dealBody:
        'All rights open for Greater China (Mainland China, Hong Kong, Macau, Taiwan) and international territories (Theatrical, VOD/SVOD, TV, Ancillary). Open to early Pre-Buy Agreements, Co-Distribution, or Memorandum of Understanding (MOU) at the current Rough Cut stage, with private screener access provided to accredited buyers.',
      musicTitle: 'Music Strategy & China Co-Marketing: “I Am You” × Dimash Qudaibergen',
      musicBody:
        'Official rights secured from the heirs of Murat Nasyrov for a brand-new adaptation of the iconic hit “Ya Eto Ty” (“I Am You” / 《我是你》). Exclusive offer for China partners: opportunity to record an official Mandarin Chinese version with Dimash Qudaibergen (迪玛希) or a top Mainland Chinese star.',
      screeningRoomTitle: 'Reference Promo Reel Screening Room (3-Min Subtitled Assembly)',
      disclaimerBadge: 'Work-in-Progress Rough Cut Reference — Temp Un-cleared Music for Tonal Preview Only',
      disclaimerText:
        'Note for buyers: The current 3-minute video with Chinese and English subtitles is an early rough-cut assembly utilizing temporary reference music (temp track). Final original score, VFX morphing, and Dolby Atmos mix deliver in Spring 2027.',
      downloadChinaDeck: 'Download China Export Pitch Deck (PDF)',
      downloadEnDeck: 'Download International Pitch Deck (PDF)',
      copyEmail: 'Copy Corporate Email',
      copied: 'Copied to Clipboard!',
    },
  },
  kk: {
    title: 'АРТЫҚ ЕМЕС',
    subTitle: 'НЕ ЛИШНИЕ · NOT EXTRA · 《绝不多余》',
    genre: 'Психологиялық әлеуметтік-спорттық драмеди',
    statusPill: 'ЕРТЕ ПОСТПРОДАКШН (БАСТАПҚЫ МОНТАЖ)',
    releasePill: 'КИНОПРОКАТ: КӨКТЕМ 2027 (НАУРЫЗ – МАМЫР)',
    soundOn: 'SOUND ON · ASMR',
    soundOff: 'SOUND OFF',
    nav: {
      hero: 'Пролог',
      lace: 'Тағдыр түйіні',
      scales: 'Таразы & Рентген',
      track: '42.2 КМ',
      cast: 'Каст & Команда',
      sales: 'Buyers Room (#sales)',
    },
    hero: {
      bridgeTag: '01 САХНА · АСТАНА КӨПІРІНДЕГІ ЕЛЕС ҚҰРЫҒЫ',
      dreamState: 'ИЛЛЮЗИЯ: ЕРТІС-ЕСІЛ ҮСТІНДЕГІ ЖЕҢІЛ ЖҮГІРІС',
      realityState: 'ШЫНДЫҚ: 207 КГ · СТАДИОННЫҢ СУЫҚ БЕТОНЫ',
      pitchLine: 'Ең ауыр қашықтыққа қарсы шыққан ең күтпеген адам.',
      hookLine:
        '«YOLO» (热辣滚烫) эмоциялық трансформациясы, «Кит» драмасының тереңдігі және 80-жылдардағы Джеки Чан экшенінің рухы.',
      scrollHint: 'Төмен айналдырыңыз — 207 келі салмақ инерциясын сезініңіз',
      ctaSales: 'International Sales & Buyers Room',
      ctaTeaser: 'Референс-промоны көру (Rough Cut)',
    },
    lace: {
      tag: '02 САХНА · ШЕШІЛГЕН БАУ ЖӘНЕ МӘҢГІЛІКТІҢ 10 МЕТРІ',
      title: 'Адамдық қадір-қасиетті қайтаратын берік түйін',
      desc: 'Бірінші актіде Расулдың шешілген бауы түнгі жолақтағы қайғылы оқиғаға себеп болады. «Артық емес» лагерінде Эльвира оған кроссовка бауын мықтап байлауды үйретеді.',
      untiedLabel: 'I АКТ: ШЕШІЛГЕН БАУ (ҚҰЛАУ ЖӘНЕ КІНӘ)',
      tiedLabel: 'ЭПИЛОГ: БЕРІК ТҮЙІН (ЕРКІНДІК ЖӘНЕ СЕНІМ)',
    },
    scales: {
      tag: '03 САХНА · АЙТЫМНЫҢ ЖЕЗ ТАРАЗЫСЫ ЖӘНЕ КҮНДЕЛІК РЕНТГЕНІ',
      title: '«Сенің қорқынышың мен ренішің 200 келі тәніңнен де ауыр»',
      desc: 'Айтым Жақұповтың дәріхана таразысын қозғап көріңіз: бір басында — 207 келі балалық шақ жарақаты мен жалған ат, екінші басында — 1 грамм шынайы адалдық.',
      leftPanTitle: 'I ТАБАҚША · 207 КГ ҚОРҚЫНЫШ ПЕН ҚОРҒАНЫС',
      leftPanSub: 'Балалық шақ жарақаты, түнгі апноэ және бөтен есім',
      rightPanTitle: 'II ТАБАҚША · 1 ГРАММ РУХАНИ АДАЛДЫҚ',
      rightPanSub: 'JANA MEN тәртібі, Ораза тазалығы және мәреде өмірді құтқару',
      xrayHeader: 'АРТЁМ КҮНДЕЛІГІНІҢ РЕНТГЕНІ: АҢЫЗ БЕН АҚИҚАТ',
      xrayHintDesktop: 'Күнделік бетіне шам сәулесін бағыттап, мотивациялық сөздердің астындағы шындықты ашыңыз:',
      xrayHintMobile: 'Артем күнделігінің астындағы шындықты көру үшін слайдерді жылжытыңыз:',
    },
    track: {
      tag: '04 САХНА · «42.2 КМ» ГОРИЗОНТАЛДЫ ТРЕК',
      title: 'Кадр палитрасы мен кейіпкер трансформациясының эволюциясы',
      hint: 'Қашықтық кезеңдерін ауыстырыңыз немесе төмен айналдырыңыз',
    },
    cast: {
      tag: 'АКТЕРЛІК АНСАМБЛЬ ЖӘНЕ ТҮСІРІЛІМ ТОБЫ (BENTO GRID)',
      title: 'Басты рөлдерде және Фильмді жасаушылар',
      sub: 'Ресми титрлерден алынған толық актерлік құрам мен барлық департаменттер',
      expandCredits: 'Ресми титрлердегі барлық цехтар тізімін ашу',
      collapseCredits: 'Толық титрлер тізімін жабу',
    },
    sales: {
      tag: '05 САХНА · ХАЛЫҚАРАЛЫҚ ДИСТРИБЬЮТОРЛАР ТЕРМИНАЛЫ (#sales)',
      title: 'International Sales, Greater China & Festival Desk',
      sub: 'Халықаралық дистрибьюторлар мен фестиваль іріктеушілеріне арналған ресми B2B панель.',
      specsTitle: 'Жобаның техникалық паспорты (Technical Specs)',
      roadmapTitle: 'Постпродакшн және дайындық кестесі (2026–2027)',
      dealTitle: 'Коммерциялық серіктестік және құқықтар',
      dealBody:
        'Үлкен Қытай (Mainland China, Hong Kong, Macau, Taiwan) және халықаралық аумақтарға барлық құқықтар ашық. Бастапқы монтаж (Rough Cut) кезеңінде Pre-Buy, Co-Distribution немесе MOU (Өзара түсіністік туралы меморандум) жасасуға дайынбыз.',
      musicTitle: 'Музыкалық ко-маркетинг: «Я — это ты» × Димаш Құдайберген',
      musicBody:
        'Мұрат Насыровтың мұрагерлерінен «Я — это ты» («I Am You») хитінің жаңа нұсқасына ресми құқықтар алынды. Қытай нарығы үшін Димаш Құдайбергенмен немесе ҚХР жұлдызымен қытай тіліндегі эксклюзивті саундтрек жазу мүмкіндігі ұсынылады.',
      screeningRoomTitle: 'Референс промо-ролик кинозалы (3-Min Subtitled Preview)',
      disclaimerBadge: 'Work-in-Progress Rough Cut Reference — Temp Un-cleared Music for Tonal Preview Only',
      disclaimerText:
        'Назар аударыңыз: субтитрлері бар 3 минуттық промо-ролик ерте бастапқы монтаждан (Rough Cut) жиналған және тек тональділікті көрсету үшін уақытша музыканы (Temp Track) қолданады.',
      downloadChinaDeck: 'China Export Pitch Deck жүктеу (PDF)',
      downloadEnDeck: 'International Pitch Deck жүктеу (PDF)',
      copyEmail: 'Корпоративтік поштаны көшіру',
      copied: 'Көшірілді!',
    },
  },
  zh: {
    title: '《绝不多余》 (NOT EXTRA)',
    subTitle: 'NOT EXTRA · 励志体育轻喜剧 / 剧情片 · 哈萨克斯坦',
    genre: '励志体育轻喜剧 / 剧情片 (Inspirational Sports Dramedy)',
    statusPill: '后期制作阶段（粗剪已完成 / ROUGH CUT STAGE）',
    releasePill: '院线公映档期：2027年春季（3月至5月）',
    soundOn: '开启沉浸音效 · ASMR',
    soundOff: '静音模式',
    nav: {
      hero: '序幕：大桥幻境',
      lace: '命运鞋带',
      scales: '黄铜天平 & 日记X光',
      track: '42.2公里蜕变',
      cast: '主演与主创团队',
      sales: '中国区发行专区 (#sales)',
    },
    hero: {
      bridgeTag: '第一幕序曲 · 阿斯塔纳大桥的幻境与现实崩塌',
      dreamState: '幻境：伊希姆河畔轻盈奔跑的健美跑者',
      realityState: '现实：207公斤 · 体育场地下储物间的冰冷混凝土 (#090D16)',
      pitchLine: '200公斤。42.2公里。你无法逃避过去，但你可以选择背负怎样的重量前行。',
      hookLine:
        '《热辣滚烫》(YOLO) 的燃魂减重蜕变 × 《鲸》(The Whale) 的深沉救赎 × 80年代成龙、李小龙黄金港片的草根逆袭精神。',
      scrollHint: '向下滚动 — 感受207公斤的沉重惯性与视觉破壁',
      ctaSales: '进入大中华区版权与审片室 (#sales)',
      ctaTeaser: '观看3分钟中字粗剪推介片',
    },
    lace: {
      tag: '第二幕意象 · 散落的鞋带与距离终点10米的永恒',
      title: '系紧鞋带：重拾人生尊严的第一个死结',
      desc: '第一幕中，拉苏尔因永远系不紧的鞋带在深夜跑道绊倒，意外踩碎跑者阿尔乔姆的哮喘吸入器。在“绝不多余”减重营，管理员艾尔薇拉蹲在这位200公斤的孤独巨人面前，第一次教会他系紧双结。滚动页面，亲手拉紧命运的鞋带。',
      untiedLabel: '第一幕：散落的鞋带（失控、愧疚与意外）',
      tiedLabel: '尾声：紧系的双结（掌控命运与自我和解）',
    },
    scales: {
      tag: '第三幕核心 · 导师艾特姆的黄铜天平 & 阿尔乔姆日记X光透视',
      title: '“你内心的恐惧与委屈，比你身上这200公斤肉还要沉重”',
      desc: '移动鼠标或拨动导师艾特姆·贾库波夫的黄铜药剂天平：一端是207公斤的童年创伤、谎言与自我逃避；另一端则是仅重1克却能压倒一切的真诚与自律。',
      leftPanTitle: '左盘 · 207公斤的创伤与心理盔甲',
      leftPanSub: '童年家暴阴影、睡眠呼吸暂停、冒名顶替与暴食逃避',
      rightPanTitle: '右盘 · 1克直面自我的灵魂诚实',
      rightPanSub: 'JANA MEN 极限自律、斋戒磨砺与终点前10米转身救人',
      xrayHeader: '阿尔乔姆日记X光透视：港片英雄格言 vs 残酷真相',
      xrayHintDesktop: '在日记本上移动手电筒光束，穿透80年代成龙/李小龙式的励志格言，照见阿尔乔姆隐秘的真实过去：',
      xrayHintMobile: '拖动下方X光滑块，揭开励志日记背后的残酷真相：',
    },
    track: {
      tag: '第四幕 · 42.2公里色彩叙事与真实减重轨迹',
      title: '从幽闭深灰混凝土到阿斯塔纳万人马拉松的橙蓝交响',
      hint: '滚动页面或点击里程碑，检视四个阶段的视觉色彩与心率演进',
    },
    cast: {
      tag: '核心演员阵容与金牌主创团队 (BENTO GRID)',
      title: '实力派群像与国际级制作班底',
      sub: '主演真实医学减重 × 独联体票房冠军编剧 × 哈萨克斯坦国宝级老戏骨倾情加盟',
      expandCredits: '展开官方完整演职员表（全部制作部门）',
      collapseCredits: '收起完整演职员表',
    },
    sales: {
      tag: '第五幕 · 大中华区及国际买方专属终端 (BUYERS ROOM · BEIJING HUGOEAST MEDIA)',
      title: '大中华区版权合作、后期进度与联合宣发方案',
      sub: '专为北京聚合影联 (Beijing Hugoeast Media) 及中国大陆主流院线发行方定制的B2B审片与商务中心。',
      specsTitle: '影片技术规格与发行参数 (Technical & Market Specs)',
      roadmapTitle: '后期制作与母带交付时间表 (Post-Production Roadmap)',
      dealTitle: '大中华区版权开放范围与合作模式 (Commercial Partnership)',
      dealBody:
        '全面开放中国大陆、中国香港、中国澳门及中国台湾地区全媒体版权（院线发行、流媒体VOD/SVOD、电视及航空衍生版权）。在当前粗剪阶段（Rough Cut），支持签订早期预购协议（Pre-Buy）、联合发行（Co-Distribution）或合作备忘录（MOU），并为认证买方开放内部全片粗剪审片链接。',
      musicTitle: '旗舰音乐联合宣发：《Я это ты》(我是你) × 迪玛希 (Dimash) 中文版定制',
      musicBody:
        '剧组已正式获得传奇歌手穆拉特·纳asy罗夫经典金曲《Я это ты》（《我是你》/ I Am You）的官方改编授权。中国合作方专属权益：可联合制作并特邀在中国极具国民度的哈萨克斯坦国宝级歌手迪玛希（Dimash Qudaibergen）或中国一线歌手录制专属中文版/双语版主题曲，引爆全网短视频与院线宣发。',
      screeningRoomTitle: '3分钟中文字幕粗剪推介片审片室 (Reference Promo Screening Room)',
      disclaimerBadge: 'Work-in-Progress Rough Cut Reference — Temp Un-cleared Music for Tonal Preview Only',
      disclaimerText:
        '买方审片重要说明：当前3分钟中文字幕视频为早期粗剪组装片段（Rough Cut Assembly），使用的是临时参考配乐（Temp Music），仅供评估影片基调与表演质感。最终成片将配备全新原创配乐、官方授权改编主题曲及杜比全景声混音。',
      downloadChinaDeck: '下载中国区专属中英双语推介手册 (PDF)',
      downloadEnDeck: '下载国际版英文推介手册 (PDF)',
      copyEmail: '一键复制出品方官方邮箱',
      copied: '已复制到剪贴板！',
    },
  },
};
