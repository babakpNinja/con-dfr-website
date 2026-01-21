const express = require('express');
const session = require('express-session');
const path = require('path');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Database setup
const db = new Database('./data/congress.db');

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS partners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_en TEXT NOT NULL,
    name_fa TEXT,
    name_tr TEXT,
    name_az TEXT,
    name_ar TEXT,
    name_zh TEXT,
    name_es TEXT,
    description_en TEXT,
    description_fa TEXT,
    description_tr TEXT,
    description_az TEXT,
    description_ar TEXT,
    description_zh TEXT,
    description_es TEXT,
    image_url TEXT,
    website_url TEXT,
    partner_type TEXT DEFAULT 'organization',
    display_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Create default admin if not exists (username: admin, password: congress2025)
const adminExists = db.prepare('SELECT * FROM admin WHERE username = ?').get('admin');
if (!adminExists) {
  const hashedPassword = bcrypt.hashSync('congress2025', 10);
  db.prepare('INSERT INTO admin (username, password) VALUES (?, ?)').run('admin', hashedPassword);
  console.log('Default admin created - Username: admin, Password: congress2025');
}

// Insert sample partners if table is empty
const partnerCount = db.prepare('SELECT COUNT(*) as count FROM partners').get();
if (partnerCount.count === 0) {
  const samplePartners = [
    {
      name_en: 'Hamnava Umbrella Group',
      name_fa: 'گروه چتری همنوا',
      name_tr: 'Hamnava Şemsiye Grubu',
      name_az: 'Həmnəva Çətir Qrupu',
      name_ar: 'مجموعة همنوا المظلية',
      name_zh: '哈姆纳瓦伞组',
      name_es: 'Grupo Paraguas Hamnava',
      description_en: 'A coalition organization working for democratic change in Iran',
      description_fa: 'یک سازمان ائتلافی که برای تغییر دموکراتیک در ایران کار می‌کند',
      description_tr: 'İran\'da demokratik değişim için çalışan bir koalisyon örgütü',
      description_az: 'İranda demokratik dəyişiklik üçün çalışan koalisiya təşkilatı',
      description_ar: 'منظمة ائتلافية تعمل من أجل التغيير الديمقراطي في إيران',
      description_zh: '一个致力于伊朗民主变革的联盟组织',
      description_es: 'Una organización de coalición que trabaja por el cambio democrático en Irán',
      image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/68966f13bc950e2457719d95_Hamnava-p-500.png',
      website_url: 'http://hamnava.org',
      partner_type: 'organization'
    },
    {
      name_en: 'Dana Research Society',
      name_fa: 'انجمن پژوهشی دانا',
      name_tr: 'Dana Araştırma Derneği',
      name_az: 'Dana Tədqiqat Cəmiyyəti',
      name_ar: 'جمعية دانا للأبحاث',
      name_zh: '达纳研究学会',
      name_es: 'Sociedad de Investigación Dana',
      description_en: 'Research organization focused on Iranian political and social studies',
      description_fa: 'سازمان پژوهشی متمرکز بر مطالعات سیاسی و اجتماعی ایران',
      description_tr: 'İran siyasi ve sosyal çalışmalarına odaklanan araştırma kuruluşu',
      description_az: 'İran siyasi və sosial araşdırmalarına yönəlmiş tədqiqat təşkilatı',
      description_ar: 'منظمة بحثية تركز على الدراسات السياسية والاجتماعية الإيرانية',
      description_zh: '专注于伊朗政治和社会研究的研究组织',
      description_es: 'Organización de investigación enfocada en estudios políticos y sociales iraníes',
      image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/photo_2026-01-02_19-04-17.jpg',
      website_url: 'https://www.danasociety.org/',
      partner_type: 'organization'
    },
    {
      name_en: 'Group 25 Shahrivar',
      name_fa: 'گروه ۲۵ شهریور',
      name_tr: '25 Şehriver Grubu',
      name_az: '25 Şəhrivər Qrupu',
      name_ar: 'مجموعة 25 شهريور',
      name_zh: '25沙赫里瓦尔小组',
      name_es: 'Grupo 25 Shahrivar',
      description_en: 'Political activist group commemorating September 16 movement',
      description_fa: 'گروه فعال سیاسی به یادبود جنبش ۱۶ سپتامبر',
      description_tr: '16 Eylül hareketini anan siyasi aktivist grubu',
      description_az: '16 sentyabr hərəkatını xatırladan siyasi fəal qrupu',
      description_ar: 'مجموعة ناشطة سياسية تحيي ذكرى حركة 16 سبتمبر',
      description_zh: '纪念9月16日运动的政治活动团体',
      description_es: 'Grupo activista político que conmemora el movimiento del 16 de septiembre',
      image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/Mlogo-3.png',
      website_url: 'https://group25shahrivar.org/',
      partner_type: 'organization'
    },
    {
      name_en: 'Democratic Turkmens of Iran',
      name_fa: 'ترکمن‌های دموکرات ایران',
      name_tr: 'İran Demokrat Türkmenleri',
      name_az: 'İranın Demokrat Türkmənləri',
      name_ar: 'التركمان الديمقراطيون في إيران',
      name_zh: '伊朗民主土库曼人',
      name_es: 'Turcomanos Democráticos de Irán',
      description_en: 'Organization representing democratic Turkmen community in Iran',
      description_fa: 'سازمان نماینده جامعه ترکمن دموکرات در ایران',
      description_tr: 'İran\'daki demokratik Türkmen topluluğunu temsil eden örgüt',
      description_az: 'İranda demokratik türkmən icmasını təmsil edən təşkilat',
      description_ar: 'منظمة تمثل المجتمع التركماني الديمقراطي في إيران',
      description_zh: '代表伊朗民主土库曼社区的组织',
      description_es: 'Organización que representa a la comunidad turcomana democrática en Irán',
      image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/photo_2026-01-02_19-04-08.jpg',
      website_url: '',
      partner_type: 'organization'
    },
    {
      name_en: 'Azerbaijan Democrat Party',
      name_fa: 'حزب دموکرات آذربایجان',
      name_tr: 'Azerbaycan Demokrat Partisi',
      name_az: 'Azərbaycan Demokrat Partiyası',
      name_ar: 'حزب أذربيجان الديمقراطي',
      name_zh: '阿塞拜疆民主党',
      name_es: 'Partido Demócrata de Azerbaiyán',
      description_en: 'Democratic party representing Azerbaijani community interests',
      description_fa: 'حزب دموکراتیک نماینده منافع جامعه آذربایجانی',
      description_tr: 'Azerbaycan toplumu çıkarlarını temsil eden demokratik parti',
      description_az: 'Azərbaycan icmasının maraqlarını təmsil edən demokratik partiya',
      description_ar: 'حزب ديمقراطي يمثل مصالح المجتمع الأذربيجاني',
      description_zh: '代表阿塞拜疆社区利益的民主党',
      description_es: 'Partido democrático que representa los intereses de la comunidad azerbaiyana',
      image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/photo_2026-01-02_19-03-33.jpg',
      website_url: 'https://adparty.org/',
      partner_type: 'organization'
    },
    {
      name_en: 'Ahwaz Assembly',
      name_fa: 'تجمع احواز',
      name_tr: 'Ahvaz Meclisi',
      name_az: 'Əhvaz Məclisi',
      name_ar: 'تجمع الأحواز',
      name_zh: '阿瓦兹议会',
      name_es: 'Asamblea de Ahwaz',
      description_en: 'Assembly representing Ahwazi Arab community rights',
      description_fa: 'مجمع نماینده حقوق جامعه عرب اهوازی',
      description_tr: 'Ahvazlı Arap toplumu haklarını temsil eden meclis',
      description_az: 'Əhvazlı ərəb icmasının hüquqlarını təmsil edən məclis',
      description_ar: 'تجمع يمثل حقوق المجتمع العربي الأحوازي',
      description_zh: '代表阿瓦兹阿拉伯社区权利的议会',
      description_es: 'Asamblea que representa los derechos de la comunidad árabe ahwazí',
      image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/photo_2026-01-02_19-03-55.jpg',
      website_url: 'https://ahwaziassembly.org/',
      partner_type: 'organization'
    },
    {
      name_en: 'No to Execution Campaign',
      name_fa: 'گروه نه به اعدام',
      name_tr: 'İdama Hayır Kampanyası',
      name_az: 'Edama Yox Kampaniyası',
      name_ar: 'حملة لا للإعدام',
      name_zh: '反对死刑运动',
      name_es: 'Campaña No a la Ejecución',
      description_en: 'Campaign against capital punishment in Iran',
      description_fa: 'کمپین علیه مجازات اعدام در ایران',
      description_tr: 'İran\'da idam cezasına karşı kampanya',
      description_az: 'İranda edam cəzasına qarşı kampaniya',
      description_ar: 'حملة ضد عقوبة الإعدام في إيران',
      description_zh: '反对伊朗死刑的运动',
      description_es: 'Campaña contra la pena capital en Irán',
      image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/NoToExecution.png',
      website_url: 'https://linktr.ee/notoexecutioncampaign',
      partner_type: 'organization'
    },
    {
      name_en: 'Bakhtiari Unity Party',
      name_fa: 'حزب اتحاد بختیاری',
      name_tr: 'Bahtiyari Birlik Partisi',
      name_az: 'Bəxtiyari Birlik Partiyası',
      name_ar: 'حزب الاتحاد البختياري',
      name_zh: '巴赫蒂亚里统一党',
      name_es: 'Partido de Unidad Bakhtiari',
      description_en: 'Party representing Bakhtiari community interests',
      description_fa: 'حزب نماینده منافع جامعه بختیاری',
      description_tr: 'Bahtiyari toplumu çıkarlarını temsil eden parti',
      description_az: 'Bəxtiyari icmasının maraqlarını təmsil edən partiya',
      description_ar: 'حزب يمثل مصالح المجتمع البختياري',
      description_zh: '代表巴赫蒂亚里社区利益的政党',
      description_es: 'Partido que representa los intereses de la comunidad bakhtiari',
      image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/photo_2026-01-05_18-44-57-977x1024.jpg',
      website_url: 'https://www.instagram.com/etehad_bakhtiari/',
      partner_type: 'organization'
    },
    {
      name_en: 'Azerbaijan Democrat Fraction',
      name_fa: 'فرقه دموکرات آذربایجان',
      name_tr: 'Azerbaycan Demokrat Fraksiyonu',
      name_az: 'Azərbaycan Demokrat Fraksiyası',
      name_ar: 'الفرقة الديمقراطية الأذربيجانية',
      name_zh: '阿塞拜疆民主派',
      name_es: 'Fracción Demócrata de Azerbaiyán',
      description_en: 'Democratic fraction for Azerbaijan region advocacy',
      description_fa: 'فراکسیون دموکراتیک برای حمایت از منطقه آذربایجان',
      description_tr: 'Azerbaycan bölgesi savunuculuğu için demokratik fraksiyon',
      description_az: 'Azərbaycan bölgəsinin müdafiəsi üçün demokratik fraksiya',
      description_ar: 'فصيل ديمقراطي للدفاع عن منطقة أذربيجان',
      description_zh: '为阿塞拜疆地区倡导的民主派',
      description_es: 'Fracción democrática para la defensa de la región de Azerbaiyán',
      image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/photo_2026-01-05_18-44-41.jpg',
      website_url: 'https://adfmk.com/',
      partner_type: 'organization'
    },
    {
      name_en: 'Iranian Republicans Australia (YAR)',
      name_fa: 'گروه ایرانیان جمهوری خواه استرالیا (یار)',
      name_tr: 'Avustralya İranlı Cumhuriyetçiler (YAR)',
      name_az: 'Avstraliya İranlı Respublikaçılar (YAR)',
      name_ar: 'الجمهوريون الإيرانيون في أستراليا (يار)',
      name_zh: '澳大利亚伊朗共和党人（YAR）',
      name_es: 'Republicanos Iraníes de Australia (YAR)',
      description_en: 'Australian-based Iranian republican advocacy group',
      description_fa: 'گروه حمایتی جمهوری‌خواهان ایرانی مستقر در استرالیا',
      description_tr: 'Avustralya merkezli İranlı cumhuriyetçi savunuculuk grubu',
      description_az: 'Avstraliyada yerləşən İranlı respublikaçı müdafiə qrupu',
      description_ar: 'مجموعة مناصرة جمهورية إيرانية مقرها أستراليا',
      description_zh: '总部位于澳大利亚的伊朗共和党倡导团体',
      description_es: 'Grupo de defensa republicano iraní con sede en Australia',
      image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/Screenshot-2026-01-15-221103.png',
      website_url: 'https://linktr.ee/IAR.Official',
      partner_type: 'organization'
    },
    {
      name_en: 'Woman Life Freedom Association Graz',
      name_fa: 'انجمن زن زندگی آزادی گراتس',
      name_tr: 'Kadın Yaşam Özgürlük Derneği Graz',
      name_az: 'Qadın Həyat Azadlıq Dərnəyi Qraz',
      name_ar: 'جمعية المرأة الحياة الحرية غراتس',
      name_zh: '格拉茨女性生命自由协会',
      name_es: 'Asociación Mujer Vida Libertad Graz',
      description_en: 'Austrian association supporting Woman Life Freedom movement',
      description_fa: 'انجمن اتریشی حامی جنبش زن زندگی آزادی',
      description_tr: 'Kadın Yaşam Özgürlük hareketini destekleyen Avusturya derneği',
      description_az: 'Qadın Həyat Azadlıq hərəkatını dəstəkləyən Avstriya dərnəyi',
      description_ar: 'جمعية نمساوية تدعم حركة المرأة الحياة الحرية',
      description_zh: '支持女性生命自由运动的奥地利协会',
      description_es: 'Asociación austriaca que apoya el movimiento Mujer Vida Libertad',
      image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/WLF-Austria.png',
      website_url: 'https://woman-life-freedom.at/',
      partner_type: 'organization'
    },
    {
      name_en: 'Center for Democracy and Development of Azerbaijan',
      name_fa: 'کانون دموکراسی و توسعه آذربایجان',
      name_tr: 'Azerbaycan Demokrasi ve Kalkınma Merkezi',
      name_az: 'Azərbaycan Demokratiya və İnkişaf Mərkəzi',
      name_ar: 'مركز الديمقراطية والتنمية في أذربيجان',
      name_zh: '阿塞拜疆民主与发展中心',
      name_es: 'Centro para la Democracia y el Desarrollo de Azerbaiyán',
      description_en: 'Center promoting democracy and development in Azerbaijan region',
      description_fa: 'مرکز ترویج دموکراسی و توسعه در منطقه آذربایجان',
      description_tr: 'Azerbaycan bölgesinde demokrasi ve kalkınmayı teşvik eden merkez',
      description_az: 'Azərbaycan bölgəsində demokratiya və inkişafı təşviq edən mərkəz',
      description_ar: 'مركز يعزز الديمقراطية والتنمية في منطقة أذربيجان',
      description_zh: '促进阿塞拜疆地区民主与发展的中心',
      description_es: 'Centro que promueve la democracia y el desarrollo en la región de Azerbaiyán',
      image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/photo_2026-01-02_19-04-22.jpg',
      website_url: 'https://azdemocracy.org/',
      partner_type: 'organization'
    },
    {
      name_en: 'Iranian Republicans Convergence',
      name_fa: 'همگرایی جمهوری خواهان ایران',
      name_tr: 'İranlı Cumhuriyetçiler Yakınlaşması',
      name_az: 'İranlı Respublikaçılar Yaxınlaşması',
      name_ar: 'تقارب الجمهوريين الإيرانيين',
      name_zh: '伊朗共和党人融合',
      name_es: 'Convergencia de Republicanos Iraníes',
      description_en: 'Coalition of Iranian republican groups and activists',
      description_fa: 'ائتلاف گروه‌ها و فعالان جمهوری‌خواه ایرانی',
      description_tr: 'İranlı cumhuriyetçi gruplar ve aktivistlerin koalisyonu',
      description_az: 'İranlı respublikaçı qruplar və fəalların koalisiyası',
      description_ar: 'تحالف المجموعات والناشطين الجمهوريين الإيرانيين',
      description_zh: '伊朗共和党团体和活动人士联盟',
      description_es: 'Coalición de grupos y activistas republicanos iraníes',
      image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/Hamgerayi.png',
      website_url: 'https://www.instagram.com/hamgerayeejomhoori/',
      partner_type: 'organization'
    },
    {
      name_en: 'Toronto Iranian Republicans Association (TIRA)',
      name_fa: 'انجمن ایرانیان جمهوری خواه تورنتو',
      name_tr: 'Toronto İranlı Cumhuriyetçiler Derneği (TIRA)',
      name_az: 'Toronto İranlı Respublikaçılar Dərnəyi (TIRA)',
      name_ar: 'جمعية الجمهوريين الإيرانيين في تورنتو (تيرا)',
      name_zh: '多伦多伊朗共和党人协会（TIRA）',
      name_es: 'Asociación de Republicanos Iraníes de Toronto (TIRA)',
      description_en: 'Toronto-based Iranian republican advocacy association',
      description_fa: 'انجمن حمایتی جمهوری‌خواهان ایرانی مستقر در تورنتو',
      description_tr: 'Toronto merkezli İranlı cumhuriyetçi savunuculuk derneği',
      description_az: 'Torontoda yerləşən İranlı respublikaçı müdafiə dərnəyi',
      description_ar: 'جمعية مناصرة جمهورية إيرانية مقرها تورنتو',
      description_zh: '总部位于多伦多的伊朗共和党倡导协会',
      description_es: 'Asociación de defensa republicana iraní con sede en Toronto',
      image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/TIRA-1003x1024.png',
      website_url: 'https://www.instagram.com/tira4iran',
      partner_type: 'organization'
    },
    {
      name_en: 'United for Iran Australia',
      name_fa: 'اتحاد برای ایران استرالیا',
      name_tr: 'Avustralya İran İçin Birlik',
      name_az: 'Avstraliya İran üçün Birlik',
      name_ar: 'متحدون من أجل إيران أستراليا',
      name_zh: '澳大利亚为伊朗联合',
      name_es: 'Unidos por Irán Australia',
      description_en: 'Australian coalition united for democratic Iran',
      description_fa: 'ائتلاف استرالیایی متحد برای ایران دموکراتیک',
      description_tr: 'Demokratik İran için birleşmiş Avustralya koalisyonu',
      description_az: 'Demokratik İran üçün birləşmiş Avstraliya koalisiyası',
      description_ar: 'تحالف أسترالي متحد من أجل إيران ديمقراطية',
      description_zh: '为民主伊朗联合的澳大利亚联盟',
      description_es: 'Coalición australiana unida por un Irán democrático',
      image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/434641411_356248903413056_4836227175912321910_n.jpg',
      website_url: 'https://www.instagram.com/unitedforiranaustralia/',
      partner_type: 'organization'
    },
    {
      name_en: 'Iranian Republicans Center South Sweden',
      name_fa: 'کانون ایرانیان جمهوری خواه جنوب سوئد',
      name_tr: 'Güney İsveç İranlı Cumhuriyetçiler Merkezi',
      name_az: 'Cənubi İsveç İranlı Respublikaçılar Mərkəzi',
      name_ar: 'مركز الجمهوريين الإيرانيين جنوب السويد',
      name_zh: '瑞典南部伊朗共和党人中心',
      name_es: 'Centro de Republicanos Iraníes del Sur de Suecia',
      description_en: 'Swedish-based Iranian republican center',
      description_fa: 'مرکز جمهوری‌خواهان ایرانی مستقر در سوئد',
      description_tr: 'İsveç merkezli İranlı cumhuriyetçi merkezi',
      description_az: 'İsveçdə yerləşən İranlı respublikaçı mərkəzi',
      description_ar: 'مركز جمهوري إيراني مقره السويد',
      description_zh: '总部位于瑞典的伊朗共和党中心',
      description_es: 'Centro republicano iraní con sede en Suecia',
      image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/Prorepublicans-1024x1024.png',
      website_url: 'https://linktr.ee/Iranian.republicans.sweden',
      partner_type: 'organization'
    },
    {
      name_en: 'Rahe Farda Group',
      name_fa: 'گروه راه فردا',
      name_tr: 'Rahe Farda Grubu',
      name_az: 'Rahe Farda Qrupu',
      name_ar: 'مجموعة راه فردا',
      name_zh: '明日之路小组',
      name_es: 'Grupo Rahe Farda',
      description_en: 'Political group focused on Iran\'s future path',
      description_fa: 'گروه سیاسی متمرکز بر مسیر آینده ایران',
      description_tr: 'İran\'ın gelecek yoluna odaklanan siyasi grup',
      description_az: 'İranın gələcək yoluna yönəlmiş siyasi qrup',
      description_ar: 'مجموعة سياسية تركز على مسار إيران المستقبلي',
      description_zh: '专注于伊朗未来道路的政治团体',
      description_es: 'Grupo político enfocado en el camino futuro de Irán',
      image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/Rahe-Farda.png',
      website_url: 'https://www.instagram.com/rahefarda.group/',
      partner_type: 'organization'
    },
    {
      name_en: 'Iran Democratic Left Party',
      name_fa: 'حزب دموکرات چپ ایران',
      name_tr: 'İran Demokratik Sol Partisi',
      name_az: 'İran Demokratik Sol Partiyası',
      name_ar: 'حزب اليسار الديمقراطي الإيراني',
      name_zh: '伊朗民主左翼党',
      name_es: 'Partido de Izquierda Democrática de Irán',
      description_en: 'Democratic left-wing political party of Iran',
      description_fa: 'حزب سیاسی چپ دموکراتیک ایران',
      description_tr: 'İran\'ın demokratik sol siyasi partisi',
      description_az: 'İranın demokratik sol siyasi partiyası',
      description_ar: 'حزب سياسي يساري ديمقراطي إيراني',
      description_zh: '伊朗民主左翼政党',
      description_es: 'Partido político de izquierda democrática de Irán',
      image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/6199645014309145353-1024x1024.jpg',
      website_url: 'https://www.bepish.org/fa',
      partner_type: 'organization'
    },
    {
      name_en: 'Mahsa Foundation',
      name_fa: 'گروه بنیاد مهسا',
      name_tr: 'Mahsa Vakfı',
      name_az: 'Mahsa Fondu',
      name_ar: 'مؤسسة مهسا',
      name_zh: '玛莎基金会',
      name_es: 'Fundación Mahsa',
      description_en: 'Foundation honoring Mahsa Amini and supporting women\'s rights',
      description_fa: 'بنیاد به یاد مهسا امینی و حمایت از حقوق زنان',
      description_tr: 'Mahsa Amini\'yi onurlandıran ve kadın haklarını destekleyen vakıf',
      description_az: 'Mahsa Aminini şərəfləndirən və qadın hüquqlarını dəstəkləyən fond',
      description_ar: 'مؤسسة تكرم مهسا أميني وتدعم حقوق المرأة',
      description_zh: '纪念玛莎·阿米尼并支持妇女权利的基金会',
      description_es: 'Fundación que honra a Mahsa Amini y apoya los derechos de las mujeres',
      image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/Mahsa.png',
      website_url: 'https://linktr.ee/mahsafoundation',
      partner_type: 'organization'
    },
    {
      name_en: 'Hassan Shariatmadari',
      name_fa: 'حسن شریعتمداری',
      name_tr: 'Hasan Şeriatmedari',
      name_az: 'Həsən Şəriətmədari',
      name_ar: 'حسن شريعتمداري',
      name_zh: '哈桑·沙里亚特马达里',
      name_es: 'Hassan Shariatmadari',
      description_en: 'Republican and Federalist Politician - Germany',
      description_fa: 'سیاستمدار جمهوریخواه و فدرالیست - آلمان',
      description_tr: 'Cumhuriyetçi ve Federalist Politikacı - Almanya',
      description_az: 'Respublikaçı və Federalist Siyasətçi - Almaniya',
      description_ar: 'سياسي جمهوري وفيدرالي - ألمانيا',
      description_zh: '共和党和联邦主义政治家 - 德国',
      description_es: 'Político Republicano y Federalista - Alemania',
      image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/openart-image_db9xIKps_1766540652029_raw-1024x1024.jpg',
      website_url: '',
      partner_type: 'individual'
    },
    {
      name_en: 'Reza Moridi',
      name_fa: 'رضا مریدی',
      name_tr: 'Rıza Moridi',
      name_az: 'Rza Moridi',
      name_ar: 'رضا مريدي',
      name_zh: '雷扎·莫里迪',
      name_es: 'Reza Moridi',
      description_en: 'Republican and Federalist Politician - Canada',
      description_fa: 'سیاستمدار جمهوریخواه و فدرالیست - کانادا',
      description_tr: 'Cumhuriyetçi ve Federalist Politikacı - Kanada',
      description_az: 'Respublikaçı və Federalist Siyasətçi - Kanada',
      description_ar: 'سياسي جمهوري وفيدرالي - كندا',
      description_zh: '共和党和联邦主义政治家 - 加拿大',
      description_es: 'Político Republicano y Federalista - Canadá',
      image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/openart-image_db9xIKps_1766540652029_raw-1024x1024.jpg',
      website_url: '',
      partner_type: 'individual'
    },
    {
      name_en: 'Alan Ekbatani',
      name_fa: 'آلن اکباتانی',
      name_tr: 'Alan Ekbatani',
      name_az: 'Alan Ekbatani',
      name_ar: 'آلان إكباتاني',
      name_zh: '艾伦·埃克巴塔尼',
      name_es: 'Alan Ekbatani',
      description_en: 'Independent Activist and Researcher - USA',
      description_fa: 'کنشگر و پژوهشگر مستقل - آمریکا',
      description_tr: 'Bağımsız Aktivist ve Araştırmacı - ABD',
      description_az: 'Müstəqil Fəal və Tədqiqatçı - ABŞ',
      description_ar: 'ناشط وباحث مستقل - الولايات المتحدة',
      description_zh: '独立活动家和研究员 - 美国',
      description_es: 'Activista e Investigador Independiente - EE.UU.',
      image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/openart-image_db9xIKps_1766540652029_raw-1024x1024.jpg',
      website_url: '',
      partner_type: 'individual'
    },
    {
      name_en: 'Mehdi Ansari',
      name_fa: 'مهدی انصاری',
      name_tr: 'Mehdi Ensari',
      name_az: 'Mehdi Ənsari',
      name_ar: 'مهدي أنصاري',
      name_zh: '迈赫迪·安萨里',
      name_es: 'Mehdi Ansari',
      description_en: 'Political Activist and Federal Republican - Germany',
      description_fa: 'فعال سیاسی و جمهوری‌خواه فدرال - آلمان',
      description_tr: 'Siyasi Aktivist ve Federal Cumhuriyetçi - Almanya',
      description_az: 'Siyasi Fəal və Federal Respublikaçı - Almaniya',
      description_ar: 'ناشط سياسي وجمهوري فيدرالي - ألمانيا',
      description_zh: '政治活动家和联邦共和党人 - 德国',
      description_es: 'Activista Político y Republicano Federal - Alemania',
      image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/openart-image_db9xIKps_1766540652029_raw-1024x1024.jpg',
      website_url: '',
      partner_type: 'individual'
    }
  ];

  const insertPartner = db.prepare(`
    INSERT INTO partners (
      name_en, name_fa, name_tr, name_az, name_ar, name_zh, name_es,
      description_en, description_fa, description_tr, description_az, description_ar, description_zh, description_es,
      image_url, website_url, partner_type, display_order
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  samplePartners.forEach((partner, index) => {
    insertPartner.run(
      partner.name_en, partner.name_fa, partner.name_tr, partner.name_az, partner.name_ar, partner.name_zh, partner.name_es,
      partner.description_en, partner.description_fa, partner.description_tr, partner.description_az, partner.description_ar, partner.description_zh, partner.description_es,
      partner.image_url, partner.website_url, partner.partner_type, index
    );
  });
  console.log('Sample partners inserted');
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'congress-dfr-secret-key-2025',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Auth middleware
const requireAuth = (req, res, next) => {
  if (req.session && req.session.isAdmin) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// API Routes

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const admin = db.prepare('SELECT * FROM admin WHERE username = ?').get(username);
  
  if (admin && bcrypt.compareSync(password, admin.password)) {
    req.session.isAdmin = true;
    req.session.adminId = admin.id;
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Check auth status
app.get('/api/auth/status', (req, res) => {
  res.json({ isAuthenticated: !!req.session.isAdmin });
});

// Change password
app.post('/api/admin/change-password', requireAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const admin = db.prepare('SELECT * FROM admin WHERE id = ?').get(req.session.adminId);
  
  if (admin && bcrypt.compareSync(currentPassword, admin.password)) {
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    db.prepare('UPDATE admin SET password = ? WHERE id = ?').run(hashedPassword, req.session.adminId);
    res.json({ success: true, message: 'Password changed successfully' });
  } else {
    res.status(400).json({ success: false, message: 'Current password is incorrect' });
  }
});

// Get all partners (public)
app.get('/api/partners', (req, res) => {
  const partners = db.prepare('SELECT * FROM partners WHERE is_active = 1 ORDER BY display_order, created_at').all();
  res.json(partners);
});

// Get partners by type (public)
app.get('/api/partners/type/:type', (req, res) => {
  const partners = db.prepare('SELECT * FROM partners WHERE partner_type = ? AND is_active = 1 ORDER BY display_order, created_at').all(req.params.type);
  res.json(partners);
});

// Get single partner (public)
app.get('/api/partners/:id', (req, res) => {
  const partner = db.prepare('SELECT * FROM partners WHERE id = ?').get(req.params.id);
  if (partner) {
    res.json(partner);
  } else {
    res.status(404).json({ error: 'Partner not found' });
  }
});

// Admin: Get all partners including inactive
app.get('/api/admin/partners', requireAuth, (req, res) => {
  const partners = db.prepare('SELECT * FROM partners ORDER BY display_order, created_at').all();
  res.json(partners);
});

// Admin: Create partner
app.post('/api/admin/partners', requireAuth, upload.single('image'), (req, res) => {
  const data = req.body;
  let imageUrl = data.image_url || '';
  
  if (req.file) {
    imageUrl = '/uploads/' + req.file.filename;
  }
  
  const result = db.prepare(`
    INSERT INTO partners (
      name_en, name_fa, name_tr, name_az, name_ar, name_zh, name_es,
      description_en, description_fa, description_tr, description_az, description_ar, description_zh, description_es,
      image_url, website_url, partner_type, display_order, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    data.name_en || '', data.name_fa || '', data.name_tr || '', data.name_az || '', data.name_ar || '', data.name_zh || '', data.name_es || '',
    data.description_en || '', data.description_fa || '', data.description_tr || '', data.description_az || '', data.description_ar || '', data.description_zh || '', data.description_es || '',
    imageUrl, data.website_url || '', data.partner_type || 'organization', parseInt(data.display_order) || 0, data.is_active === 'false' ? 0 : 1
  );
  
  res.json({ success: true, id: result.lastInsertRowid });
});

// Admin: Update partner
app.put('/api/admin/partners/:id', requireAuth, upload.single('image'), (req, res) => {
  const data = req.body;
  const partnerId = req.params.id;
  
  let imageUrl = data.image_url;
  if (req.file) {
    imageUrl = '/uploads/' + req.file.filename;
  }
  
  db.prepare(`
    UPDATE partners SET
      name_en = ?, name_fa = ?, name_tr = ?, name_az = ?, name_ar = ?, name_zh = ?, name_es = ?,
      description_en = ?, description_fa = ?, description_tr = ?, description_az = ?, description_ar = ?, description_zh = ?, description_es = ?,
      image_url = ?, website_url = ?, partner_type = ?, display_order = ?, is_active = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    data.name_en || '', data.name_fa || '', data.name_tr || '', data.name_az || '', data.name_ar || '', data.name_zh || '', data.name_es || '',
    data.description_en || '', data.description_fa || '', data.description_tr || '', data.description_az || '', data.description_ar || '', data.description_zh || '', data.description_es || '',
    imageUrl, data.website_url || '', data.partner_type || 'organization', parseInt(data.display_order) || 0, data.is_active === 'false' ? 0 : 1,
    partnerId
  );
  
  res.json({ success: true });
});

// Admin: Delete partner
app.delete('/api/admin/partners/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM partners WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// Admin: Toggle partner active status
app.patch('/api/admin/partners/:id/toggle', requireAuth, (req, res) => {
  const partner = db.prepare('SELECT is_active FROM partners WHERE id = ?').get(req.params.id);
  if (partner) {
    db.prepare('UPDATE partners SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(partner.is_active ? 0 : 1, req.params.id);
    res.json({ success: true, is_active: !partner.is_active });
  } else {
    res.status(404).json({ error: 'Partner not found' });
  }
});

// Serve main page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Default admin credentials - Username: admin, Password: congress2025');
});