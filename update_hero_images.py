import sqlite3

conn = sqlite3.connect('data/congress.db')
cursor = conn.cursor()

print("Updating hero images with translations...")

# Hero image 1 - United for Democracy
cursor.execute('''
    UPDATE hero_images SET 
        title_en = 'United for Democracy',
        title_fa = 'متحد برای دموکراسی',
        title_tr = 'Demokrasi İçin Birlik',
        title_az = 'Demokratiya Üçün Birlik',
        title_ar = 'متحدون من أجل الديمقراطية',
        title_zh = '团结为民主',
        title_es = 'Unidos por la Democracia',
        subtitle_en = 'Building bridges across nations and cultures',
        subtitle_fa = 'ساختن پل‌ها میان ملت‌ها و فرهنگ‌ها',
        subtitle_tr = 'Milletler ve kültürler arasında köprüler kurmak',
        subtitle_az = 'Millətlər və mədəniyyətlər arasında körpülər qurmaq',
        subtitle_ar = 'بناء الجسور بين الأمم والثقافات',
        subtitle_zh = '在国家和文化之间架起桥梁',
        subtitle_es = 'Construyendo puentes entre naciones y culturas'
    WHERE id = 1
''')
print("  Updated: Hero image 1")

# Hero image 2 - Strong Institutions
cursor.execute('''
    UPDATE hero_images SET 
        title_en = 'Strong Institutions',
        title_fa = 'نهادهای قوی',
        title_tr = 'Güçlü Kurumlar',
        title_az = 'Güclü Qurumlar',
        title_ar = 'مؤسسات قوية',
        title_zh = '强大的机构',
        title_es = 'Instituciones Fuertes',
        subtitle_en = 'Supporting democratic governance worldwide',
        subtitle_fa = 'حمایت از حکومت دموکراتیک در سراسر جهان',
        subtitle_tr = 'Dünya çapında demokratik yönetimi desteklemek',
        subtitle_az = 'Dünya miqyasında demokratik idarəetməni dəstəkləmək',
        subtitle_ar = 'دعم الحكم الديمقراطي في جميع أنحاء العالم',
        subtitle_zh = '支持全球民主治理',
        subtitle_es = 'Apoyando la gobernanza democrática en todo el mundo'
    WHERE id = 2
''')
print("  Updated: Hero image 2")

# Hero image 3 - People Power
cursor.execute('''
    UPDATE hero_images SET 
        title_en = 'People Power',
        title_fa = 'قدرت مردم',
        title_tr = 'Halk Gücü',
        title_az = 'Xalq Gücü',
        title_ar = 'قوة الشعب',
        title_zh = '人民力量',
        title_es = 'Poder del Pueblo',
        subtitle_en = 'Empowering citizens to shape their future',
        subtitle_fa = 'توانمندسازی شهروندان برای شکل‌دهی آینده‌شان',
        subtitle_tr = 'Vatandaşları geleceklerini şekillendirmeleri için güçlendirmek',
        subtitle_az = 'Vətəndaşları gələcəklərini formalaşdırmaq üçün gücləndirir',
        subtitle_ar = 'تمكين المواطنين من تشكيل مستقبلهم',
        subtitle_zh = '赋予公民塑造未来的能力',
        subtitle_es = 'Empoderando a los ciudadanos para dar forma a su futuro'
    WHERE id = 3
''')
print("  Updated: Hero image 3")

# Hero image 4 - Global Connections
cursor.execute('''
    UPDATE hero_images SET 
        title_en = 'Federal Democracy',
        title_fa = 'دموکراسی فدرال',
        title_tr = 'Federal Demokrasi',
        title_az = 'Federal Demokratiya',
        title_ar = 'الديمقراطية الفيدرالية',
        title_zh = '联邦民主',
        title_es = 'Democracia Federal',
        subtitle_en = 'Federalism uniting diverse communities',
        subtitle_fa = 'فدرالیسم متحدکننده جوامع متنوع',
        subtitle_tr = 'Çeşitli toplulukları birleştiren federalizm',
        subtitle_az = 'Müxtəlif icmaları birləşdirən federalizm',
        subtitle_ar = 'الفيدرالية توحد المجتمعات المتنوعة',
        subtitle_zh = '联邦制团结多元社区',
        subtitle_es = 'El federalismo une comunidades diversas'
    WHERE id = 4
''')
print("  Updated: Hero image 4")

# Hero image 5 - Your Voice Matters
cursor.execute('''
    UPDATE hero_images SET 
        title_en = 'Your Voice Matters',
        title_fa = 'صدای شما مهم است',
        title_tr = 'Sesiniz Önemli',
        title_az = 'Səsiniz Vacibdir',
        title_ar = 'صوتك مهم',
        title_zh = '你的声音很重要',
        title_es = 'Tu Voz Importa',
        subtitle_en = 'Every vote counts in a true democracy',
        subtitle_fa = 'هر رأی در یک دموکراسی واقعی اهمیت دارد',
        subtitle_tr = 'Gerçek bir demokraside her oy önemlidir',
        subtitle_az = 'Həqiqi demokratiyada hər səs önəmlidir',
        subtitle_ar = 'كل صوت مهم في الديمقراطية الحقيقية',
        subtitle_zh = '在真正的民主中，每一票都很重要',
        subtitle_es = 'Cada voto cuenta en una verdadera democracia'
    WHERE id = 5
''')
print("  Updated: Hero image 5")

conn.commit()
conn.close()

print("\n✅ All hero images updated with translations!")