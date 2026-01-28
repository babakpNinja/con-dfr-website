import sqlite3

# Connect to the database
conn = sqlite3.connect('data/congress.db')
cursor = conn.cursor()

# Create ethnic_groups table
cursor.execute('''
CREATE TABLE IF NOT EXISTS ethnic_groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
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
    population TEXT,
    region_en TEXT,
    region_fa TEXT,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
''')

# Ethnic groups data
ethnic_groups = [
    {
        'slug': 'persian',
        'name_en': 'Persian',
        'name_fa': 'فارس',
        'name_tr': 'Fars',
        'name_az': 'Fars',
        'name_ar': 'الفرس',
        'name_zh': '波斯人',
        'name_es': 'Persa',
        'description_en': 'The Persian people are the largest ethnic group in Iran, comprising about 61% of the population. They are the descendants of ancient Aryan tribes who settled in the Iranian plateau. Persians have made significant contributions to world civilization, including literature, poetry, art, architecture, and science. The Persian language (Farsi) is the official language of Iran and has a rich literary tradition spanning over 2,500 years.',
        'description_fa': 'مردم فارس بزرگترین گروه قومی در ایران هستند که حدود ۶۱ درصد جمعیت را تشکیل می‌دهند. آنها از نوادگان قبایل آریایی باستان هستند که در فلات ایران ساکن شدند. فارس‌ها سهم قابل توجهی در تمدن جهانی داشته‌اند، از جمله ادبیات، شعر، هنر، معماری و علم.',
        'population': '~53 million (61%)',
        'region_en': 'Central, Southern, and Eastern Iran',
        'region_fa': 'مرکز، جنوب و شرق ایران',
        'image_url': '/images/ethnic-persian.jpg',
        'display_order': 1
    },
    {
        'slug': 'azerbaijani',
        'name_en': 'Azerbaijani',
        'name_fa': 'آذربایجانی',
        'name_tr': 'Azerbaycanlı',
        'name_az': 'Azərbaycanlı',
        'name_ar': 'الأذربيجانيون',
        'name_zh': '阿塞拜疆人',
        'name_es': 'Azerbaiyano',
        'description_en': 'Azerbaijanis (also known as Azeris or Iranian Turks) are the second-largest ethnic group in Iran, comprising about 16% of the population. They primarily inhabit the northwestern provinces of East Azerbaijan, West Azerbaijan, Ardabil, and Zanjan. Azerbaijanis speak Azerbaijani Turkish and have a rich cultural heritage including distinctive music, dance, and cuisine.',
        'description_fa': 'آذربایجانی‌ها (همچنین به عنوان آذری‌ها یا ترک‌های ایرانی شناخته می‌شوند) دومین گروه قومی بزرگ در ایران هستند که حدود ۱۶ درصد جمعیت را تشکیل می‌دهند. آنها عمدتاً در استان‌های شمال غربی آذربایجان شرقی، آذربایجان غربی، اردبیل و زنجان ساکن هستند.',
        'population': '~14 million (16%)',
        'region_en': 'Northwestern Iran (East & West Azerbaijan, Ardabil, Zanjan)',
        'region_fa': 'شمال غرب ایران (آذربایجان شرقی و غربی، اردبیل، زنجان)',
        'image_url': '/images/ethnic-azerbaijani.jpg',
        'display_order': 2
    },
    {
        'slug': 'kurdish',
        'name_en': 'Kurdish',
        'name_fa': 'کرد',
        'name_tr': 'Kürt',
        'name_az': 'Kürd',
        'name_ar': 'الأكراد',
        'name_zh': '库尔德人',
        'name_es': 'Kurdo',
        'description_en': 'The Kurdish people are the third-largest ethnic group in Iran, comprising about 10% of the population. They inhabit the western provinces of Kurdistan, Kermanshah, West Azerbaijan, and Ilam. Kurds have a distinct language (Kurdish), culture, and traditions. They are known for their colorful traditional clothing, vibrant music, and the celebration of Nowruz.',
        'description_fa': 'مردم کرد سومین گروه قومی بزرگ در ایران هستند که حدود ۱۰ درصد جمعیت را تشکیل می‌دهند. آنها در استان‌های غربی کردستان، کرمانشاه، آذربایجان غربی و ایلام ساکن هستند. کردها زبان (کردی)، فرهنگ و سنت‌های متمایزی دارند.',
        'population': '~9 million (10%)',
        'region_en': 'Western Iran (Kurdistan, Kermanshah, West Azerbaijan, Ilam)',
        'region_fa': 'غرب ایران (کردستان، کرمانشاه، آذربایجان غربی، ایلام)',
        'image_url': '/images/ethnic-kurdish.jpg',
        'display_order': 3
    },
    {
        'slug': 'gilaki',
        'name_en': 'Gilaki',
        'name_fa': 'گیلکی',
        'name_tr': 'Gilekler',
        'name_az': 'Giləklər',
        'name_ar': 'الجيلاك',
        'name_zh': '吉拉基人',
        'name_es': 'Gilaki',
        'description_en': 'The Gilaki people inhabit the Gilan Province along the southwestern coast of the Caspian Sea. They speak Gilaki, an Iranian language distinct from Persian. Known for their lush green homeland, rice cultivation, and unique cuisine, Gilakis have preserved their distinct cultural identity including traditional music, dance, and architecture.',
        'description_fa': 'مردم گیلک در استان گیلان در امتداد ساحل جنوب غربی دریای خزر ساکن هستند. آنها به زبان گیلکی صحبت می‌کنند که یک زبان ایرانی متمایز از فارسی است. گیلک‌ها به خاطر سرزمین سبز و سرسبز، کشت برنج و غذاهای منحصر به فرد خود شناخته شده‌اند.',
        'population': '~3 million (3%)',
        'region_en': 'Gilan Province (Caspian Coast)',
        'region_fa': 'استان گیلان (ساحل خزر)',
        'image_url': '/images/ethnic-gilaki.jpg',
        'display_order': 4
    },
    {
        'slug': 'lur',
        'name_en': 'Lur',
        'name_fa': 'لر',
        'name_tr': 'Lurlar',
        'name_az': 'Lurlar',
        'name_ar': 'اللور',
        'name_zh': '卢尔人',
        'name_es': 'Lur',
        'description_en': 'The Lur people inhabit the Lorestan, Khuzestan, Kohgiluyeh and Boyer-Ahmad, and Ilam provinces in western Iran. They speak Luri, a southwestern Iranian language. Lurs are known for their nomadic and semi-nomadic traditions, distinctive music featuring the kamancheh and daf, and colorful traditional clothing.',
        'description_fa': 'مردم لر در استان‌های لرستان، خوزستان، کهگیلویه و بویراحمد و ایلام در غرب ایران ساکن هستند. آنها به زبان لری صحبت می‌کنند. لرها به خاطر سنت‌های کوچ‌نشینی و نیمه‌کوچ‌نشینی، موسیقی متمایز با کمانچه و دف، و لباس‌های سنتی رنگارنگ شناخته شده‌اند.',
        'population': '~5 million (6%)',
        'region_en': 'Lorestan, Khuzestan, Kohgiluyeh and Boyer-Ahmad, Ilam',
        'region_fa': 'لرستان، خوزستان، کهگیلویه و بویراحمد، ایلام',
        'image_url': '/images/ethnic-lor.jpg',
        'display_order': 5
    },
    {
        'slug': 'baloch',
        'name_en': 'Baloch',
        'name_fa': 'بلوچ',
        'name_tr': 'Beluci',
        'name_az': 'Bəluc',
        'name_ar': 'البلوش',
        'name_zh': '俾路支人',
        'name_es': 'Baluchi',
        'description_en': 'The Baloch people inhabit the Sistan and Baluchestan Province in southeastern Iran. They speak Balochi, a northwestern Iranian language. Baloch culture is characterized by a strong tribal structure, distinctive embroidered clothing, traditional music, and a rich oral literary tradition including epic poetry.',
        'description_fa': 'مردم بلوچ در استان سیستان و بلوچستان در جنوب شرقی ایران ساکن هستند. آنها به زبان بلوچی صحبت می‌کنند. فرهنگ بلوچ با ساختار قبیله‌ای قوی، لباس‌های گلدوزی شده متمایز، موسیقی سنتی و سنت ادبی شفاهی غنی شامل شعر حماسی مشخص می‌شود.',
        'population': '~2 million (2%)',
        'region_en': 'Sistan and Baluchestan Province (Southeast)',
        'region_fa': 'استان سیستان و بلوچستان (جنوب شرق)',
        'image_url': '/images/ethnic-baloch.jpg',
        'display_order': 6
    },
    {
        'slug': 'mazandarani',
        'name_en': 'Mazandarani',
        'name_fa': 'مازندرانی',
        'name_tr': 'Mazenderanlı',
        'name_az': 'Mazandaranlı',
        'name_ar': 'المازندرانيون',
        'name_zh': '马赞德兰人',
        'name_es': 'Mazandaraní',
        'description_en': 'The Mazandarani people inhabit Mazandaran Province along the southern coast of the Caspian Sea. They speak Mazandarani, a Caspian Iranian language. Known for their lush green homeland, rice and tea cultivation, and traditional wooden stilt houses, Mazandaranis have a rich cultural heritage including distinctive music and dance.',
        'description_fa': 'مردم مازندرانی در استان مازندران در امتداد ساحل جنوبی دریای خزر ساکن هستند. آنها به زبان مازندرانی صحبت می‌کنند. مازندرانی‌ها به خاطر سرزمین سبز و سرسبز، کشت برنج و چای، و خانه‌های چوبی سنتی شناخته شده‌اند.',
        'population': '~4 million (4%)',
        'region_en': 'Mazandaran Province (Caspian Coast)',
        'region_fa': 'استان مازندران (ساحل خزر)',
        'image_url': '/images/ethnic-mazandarani.jpg',
        'display_order': 7
    },
    {
        'slug': 'turkmen',
        'name_en': 'Turkmen',
        'name_fa': 'ترکمن',
        'name_tr': 'Türkmen',
        'name_az': 'Türkmən',
        'name_ar': 'التركمان',
        'name_zh': '土库曼人',
        'name_es': 'Turcomano',
        'description_en': 'The Turkmen people inhabit the Turkmen Sahra region in northeastern Iran, primarily in Golestan Province. They speak Turkmen, a Turkic language. Known for their nomadic heritage, Akhal-Teke horses, distinctive tall wool hats (telpek), and world-famous carpet weaving traditions.',
        'description_fa': 'مردم ترکمن در منطقه ترکمن صحرا در شمال شرقی ایران، عمدتاً در استان گلستان ساکن هستند. آنها به زبان ترکمنی صحبت می‌کنند. ترکمن‌ها به خاطر میراث کوچ‌نشینی، اسب‌های آخال‌تکه، کلاه‌های پشمی بلند (تلپک) و سنت‌های قالی‌بافی مشهور جهانی شناخته شده‌اند.',
        'population': '~1.5 million (2%)',
        'region_en': 'Golestan Province (Turkmen Sahra)',
        'region_fa': 'استان گلستان (ترکمن صحرا)',
        'image_url': '/images/ethnic-turkmen.jpg',
        'display_order': 8
    },
    {
        'slug': 'arab',
        'name_en': 'Arab',
        'name_fa': 'عرب',
        'name_tr': 'Arap',
        'name_az': 'Ərəb',
        'name_ar': 'العرب',
        'name_zh': '阿拉伯人',
        'name_es': 'Árabe',
        'description_en': 'Iranian Arabs primarily inhabit Khuzestan Province in southwestern Iran. They speak Arabic (Khuzestani Arabic dialect) alongside Persian. Known for their rich cultural traditions including traditional music, date palm cultivation, and the historic connection to the ancient civilizations of Mesopotamia.',
        'description_fa': 'عرب‌های ایرانی عمدتاً در استان خوزستان در جنوب غربی ایران ساکن هستند. آنها به زبان عربی (گویش عربی خوزستانی) در کنار فارسی صحبت می‌کنند. عرب‌ها به خاطر سنت‌های فرهنگی غنی شامل موسیقی سنتی، کشت نخل خرما و ارتباط تاریخی با تمدن‌های باستانی بین‌النهرین شناخته شده‌اند.',
        'population': '~2 million (2%)',
        'region_en': 'Khuzestan Province (Southwest)',
        'region_fa': 'استان خوزستان (جنوب غرب)',
        'image_url': '/images/ethnic-arab.jpg',
        'display_order': 9
    },
    {
        'slug': 'armenian',
        'name_en': 'Armenian',
        'name_fa': 'ارمنی',
        'name_tr': 'Ermeni',
        'name_az': 'Erməni',
        'name_ar': 'الأرمن',
        'name_zh': '亚美尼亚人',
        'name_es': 'Armenio',
        'description_en': 'Iranian Armenians are one of the oldest Christian communities in Iran, with a history dating back over 2,000 years. They primarily live in Isfahan (Julfa neighborhood), Tehran, and northwestern Iran. Known for their contributions to Iranian commerce, arts, and culture, including the historic Vank Cathedral in Isfahan.',
        'description_fa': 'ارمنی‌های ایرانی یکی از قدیمی‌ترین جوامع مسیحی در ایران هستند که تاریخ آنها به بیش از ۲۰۰۰ سال پیش برمی‌گردد. آنها عمدتاً در اصفهان (محله جلفا)، تهران و شمال غرب ایران زندگی می‌کنند. ارمنی‌ها به خاطر سهم خود در تجارت، هنر و فرهنگ ایران شناخته شده‌اند.',
        'population': '~150,000',
        'region_en': 'Isfahan (Julfa), Tehran, Northwestern Iran',
        'region_fa': 'اصفهان (جلفا)، تهران، شمال غرب ایران',
        'image_url': '/images/ethnic-armenian.jpg',
        'display_order': 10
    },
    {
        'slug': 'assyrian',
        'name_en': 'Assyrian',
        'name_fa': 'آشوری',
        'name_tr': 'Süryani',
        'name_az': 'Assuriyalı',
        'name_ar': 'الآشوريون',
        'name_zh': '亚述人',
        'name_es': 'Asirio',
        'description_en': 'Iranian Assyrians are an ancient Semitic people with a Christian heritage dating back to the earliest days of Christianity. They primarily live in the Urmia region of West Azerbaijan Province. Known for their ancient language (Neo-Aramaic), traditional circle dance (khigga), and rich cultural traditions.',
        'description_fa': 'آشوری‌های ایرانی یک قوم سامی باستانی با میراث مسیحی هستند که به اولین روزهای مسیحیت برمی‌گردد. آنها عمدتاً در منطقه ارومیه استان آذربایجان غربی زندگی می‌کنند. آشوری‌ها به خاطر زبان باستانی (آرامی نو)، رقص دایره‌ای سنتی (خیگا) و سنت‌های فرهنگی غنی شناخته شده‌اند.',
        'population': '~20,000',
        'region_en': 'Urmia Region (West Azerbaijan)',
        'region_fa': 'منطقه ارومیه (آذربایجان غربی)',
        'image_url': '/images/ethnic-assyrian.jpg',
        'display_order': 11
    },
    {
        'slug': 'jewish',
        'name_en': 'Jewish',
        'name_fa': 'یهودی',
        'name_tr': 'Yahudi',
        'name_az': 'Yəhudi',
        'name_ar': 'اليهود',
        'name_zh': '犹太人',
        'name_es': 'Judío',
        'description_en': 'Persian Jews have one of the oldest Jewish communities in the world, with a history in Iran spanning over 2,700 years since the Babylonian exile. They have made significant contributions to Iranian culture, commerce, and medicine. Historic synagogues in Isfahan, Shiraz, and Hamadan testify to their long presence.',
        'description_fa': 'یهودیان ایرانی یکی از قدیمی‌ترین جوامع یهودی در جهان را دارند که تاریخ آنها در ایران به بیش از ۲۷۰۰ سال از زمان تبعید بابلی برمی‌گردد. آنها سهم قابل توجهی در فرهنگ، تجارت و پزشکی ایران داشته‌اند. کنیسه‌های تاریخی در اصفهان، شیراز و همدان گواه حضور طولانی آنهاست.',
        'population': '~9,000',
        'region_en': 'Tehran, Isfahan, Shiraz, Hamadan',
        'region_fa': 'تهران، اصفهان، شیراز، همدان',
        'image_url': '/images/ethnic-jewish.jpg',
        'display_order': 12
    },
    {
        'slug': 'zoroastrian',
        'name_en': 'Zoroastrian',
        'name_fa': 'زرتشتی',
        'name_tr': 'Zerdüşt',
        'name_az': 'Zərdüşt',
        'name_ar': 'الزرادشتيون',
        'name_zh': '琐罗亚斯德教徒',
        'name_es': 'Zoroastriano',
        'description_en': 'Zoroastrians are followers of one of the world\'s oldest monotheistic religions, founded by the prophet Zoroaster in ancient Persia. They primarily live in Yazd and Kerman. Known for their fire temples, the Faravahar symbol, and their significant contributions to Persian culture and the celebration of Nowruz.',
        'description_fa': 'زرتشتیان پیروان یکی از قدیمی‌ترین ادیان یکتاپرست جهان هستند که توسط پیامبر زرتشت در ایران باستان بنیان‌گذاری شده است. آنها عمدتاً در یزد و کرمان زندگی می‌کنند. زرتشتیان به خاطر آتشکده‌ها، نماد فروهر و سهم قابل توجه در فرهنگ ایرانی و جشن نوروز شناخته شده‌اند.',
        'population': '~25,000',
        'region_en': 'Yazd, Kerman, Tehran',
        'region_fa': 'یزد، کرمان، تهران',
        'image_url': '/images/ethnic-zoroastrian.jpg',
        'display_order': 13
    }
]

# Insert ethnic groups
for group in ethnic_groups:
    cursor.execute('''
        INSERT OR REPLACE INTO ethnic_groups 
        (slug, name_en, name_fa, name_tr, name_az, name_ar, name_zh, name_es,
         description_en, description_fa, population, region_en, region_fa, image_url, display_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        group['slug'], group['name_en'], group['name_fa'], group['name_tr'],
        group['name_az'], group['name_ar'], group['name_zh'], group['name_es'],
        group['description_en'], group['description_fa'], group['population'],
        group['region_en'], group['region_fa'], group['image_url'], group['display_order']
    ))

conn.commit()
print(f"Successfully added {len(ethnic_groups)} ethnic groups to the database!")

# Verify
cursor.execute("SELECT slug, name_en, image_url FROM ethnic_groups ORDER BY display_order")
rows = cursor.fetchall()
print("\nEthnic groups in database:")
for row in rows:
    print(f"  - {row[0]}: {row[1]} ({row[2]})")

conn.close()