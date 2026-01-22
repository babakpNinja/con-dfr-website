import sqlite3

conn = sqlite3.connect('data/congress.db')
cursor = conn.cursor()

# Add social links from the original site
social_links = [
    ('twitter', 'https://x.com/con_dem_fed_rep/', 'fab fa-x-twitter', 1),
    ('instagram', 'https://www.instagram.com/con_dem_fed_rep/', 'fab fa-instagram', 2),
    ('telegram', 'https://t.me/con_dfr', 'fab fa-telegram', 3),
    ('youtube', 'https://www.youtube.com/@Con_Dem_Fed_Rep', 'fab fa-youtube', 4),
    ('linktree', 'https://linktr.ee/Con_dfr', 'fas fa-link', 5),
]

print("Adding social links...")
for platform, url, icon, order in social_links:
    cursor.execute('''
        INSERT OR REPLACE INTO social_links (platform, url, icon_class, display_order, is_active)
        VALUES (?, ?, ?, ?, 1)
    ''', (platform, url, icon, order))
    print(f"  Added: {platform}")

# Update hero main title with translations
print("\nUpdating page content with translations...")

# Hero main title translations
hero_title_translations = {
    'content_en': 'Joint Congress of Democratic-Republicans and Federal Democrats',
    'content_fa': 'کنگره مشترک جمهوری خواهان دموکرات و فدرال دموکرات',
    'content_tr': 'Demokrat Cumhuriyetçiler ve Federal Demokratlar Ortak Kongresi',
    'content_az': 'Demokrat Respublikaçılar və Federal Demokratların Birgə Konqresi',
    'content_ar': 'المؤتمر المشترك للجمهوريين الديمقراطيين والديمقراطيين الفيدراليين',
    'content_zh': '民主共和党人和联邦民主党人联合大会',
    'content_es': 'Congreso Conjunto de Demócratas Republicanos y Demócratas Federales'
}

cursor.execute('''
    UPDATE page_content SET 
        content_en = ?, content_fa = ?, content_tr = ?, content_az = ?, 
        content_ar = ?, content_zh = ?, content_es = ?
    WHERE section_key = 'hero_main_title'
''', (
    hero_title_translations['content_en'],
    hero_title_translations['content_fa'],
    hero_title_translations['content_tr'],
    hero_title_translations['content_az'],
    hero_title_translations['content_ar'],
    hero_title_translations['content_zh'],
    hero_title_translations['content_es']
))
print("  Updated: hero_main_title")

# Hero subtitle translations
hero_subtitle_translations = {
    'content_en': 'For freedom, justice, citizenship equality and distribution of power in the future Iran',
    'content_fa': 'برای آزادی، عدالت، برابری شهروندی و توزیع قدرت در ایران آینده',
    'content_tr': 'Gelecek İran\'da özgürlük, adalet, vatandaşlık eşitliği ve güç dağılımı için',
    'content_az': 'Gələcək İranda azadlıq, ədalət, vətəndaşlıq bərabərliyi və hakimiyyətin bölüşdürülməsi üçün',
    'content_ar': 'من أجل الحرية والعدالة والمساواة في المواطنة وتوزيع السلطة في إيران المستقبل',
    'content_zh': '为了未来伊朗的自由、正义、公民平等和权力分配',
    'content_es': 'Por la libertad, la justicia, la igualdad ciudadana y la distribución del poder en el futuro Irán'
}

cursor.execute('''
    UPDATE page_content SET 
        content_en = ?, content_fa = ?, content_tr = ?, content_az = ?, 
        content_ar = ?, content_zh = ?, content_es = ?
    WHERE section_key = 'hero_subtitle'
''', (
    hero_subtitle_translations['content_en'],
    hero_subtitle_translations['content_fa'],
    hero_subtitle_translations['content_tr'],
    hero_subtitle_translations['content_az'],
    hero_subtitle_translations['content_ar'],
    hero_subtitle_translations['content_zh'],
    hero_subtitle_translations['content_es']
))
print("  Updated: hero_subtitle")

# About title translations
about_title_translations = {
    'content_en': 'About Us',
    'content_fa': 'درباره ما',
    'content_tr': 'Hakkımızda',
    'content_az': 'Haqqımızda',
    'content_ar': 'من نحن',
    'content_zh': '关于我们',
    'content_es': 'Sobre Nosotros'
}

cursor.execute('''
    UPDATE page_content SET 
        content_en = ?, content_fa = ?, content_tr = ?, content_az = ?, 
        content_ar = ?, content_zh = ?, content_es = ?
    WHERE section_key = 'about_title'
''', (
    about_title_translations['content_en'],
    about_title_translations['content_fa'],
    about_title_translations['content_tr'],
    about_title_translations['content_az'],
    about_title_translations['content_ar'],
    about_title_translations['content_zh'],
    about_title_translations['content_es']
))
print("  Updated: about_title")

# About content translations
about_content_translations = {
    'content_en': 'The Joint Congress of Democratic-Republicans and Federal Democrats is a coalition of political organizations and individuals committed to establishing a democratic, secular, and federal republic in Iran. We believe in the principles of human rights, equality of citizenship, rule of law, and real participation of people in governance.',
    'content_fa': 'کنگره مشترک جمهوری‌خواهان دموکرات و فدرال دموکرات ائتلافی از سازمان‌های سیاسی و افراد متعهد به استقرار یک جمهوری دموکراتیک، سکولار و فدرال در ایران است. ما به اصول حقوق بشر، برابری شهروندی، حاکمیت قانون و مشارکت واقعی مردم در حکومت باور داریم.',
    'content_tr': 'Demokrat Cumhuriyetçiler ve Federal Demokratlar Ortak Kongresi, İran\'da demokratik, laik ve federal bir cumhuriyet kurmaya kararlı siyasi örgütler ve bireylerden oluşan bir koalisyondur. İnsan hakları, vatandaşlık eşitliği, hukukun üstünlüğü ve halkın yönetime gerçek katılımı ilkelerine inanıyoruz.',
    'content_az': 'Demokrat Respublikaçılar və Federal Demokratların Birgə Konqresi İranda demokratik, dünyəvi və federal respublika qurmağa sadiq siyasi təşkilatlar və fərdlərdən ibarət koalisiyasıdır. Biz insan hüquqları, vətəndaşlıq bərabərliyi, qanunun aliliyi və xalqın idarəetmədə real iştirakı prinsiplərinə inanırıq.',
    'content_ar': 'المؤتمر المشترك للجمهوريين الديمقراطيين والديمقراطيين الفيدراليين هو تحالف من المنظمات السياسية والأفراد الملتزمين بإقامة جمهورية ديمقراطية وعلمانية وفيدرالية في إيران. نؤمن بمبادئ حقوق الإنسان والمساواة في المواطنة وسيادة القانون والمشاركة الحقيقية للشعب في الحكم.',
    'content_zh': '民主共和党人和联邦民主党人联合大会是一个由政治组织和个人组成的联盟，致力于在伊朗建立一个民主、世俗和联邦共和国。我们相信人权、公民平等、法治和人民真正参与治理的原则。',
    'content_es': 'El Congreso Conjunto de Demócratas Republicanos y Demócratas Federales es una coalición de organizaciones políticas e individuos comprometidos con el establecimiento de una república democrática, secular y federal en Irán. Creemos en los principios de derechos humanos, igualdad ciudadana, estado de derecho y participación real del pueblo en la gobernanza.'
}

cursor.execute('''
    UPDATE page_content SET 
        content_en = ?, content_fa = ?, content_tr = ?, content_az = ?, 
        content_ar = ?, content_zh = ?, content_es = ?
    WHERE section_key = 'about_content'
''', (
    about_content_translations['content_en'],
    about_content_translations['content_fa'],
    about_content_translations['content_tr'],
    about_content_translations['content_az'],
    about_content_translations['content_ar'],
    about_content_translations['content_zh'],
    about_content_translations['content_es']
))
print("  Updated: about_content")

# Mission title translations
mission_title_translations = {
    'content_en': 'Our Mission',
    'content_fa': 'ماموریت ما',
    'content_tr': 'Misyonumuz',
    'content_az': 'Missiyamız',
    'content_ar': 'مهمتنا',
    'content_zh': '我们的使命',
    'content_es': 'Nuestra Misión'
}

cursor.execute('''
    UPDATE page_content SET 
        content_en = ?, content_fa = ?, content_tr = ?, content_az = ?, 
        content_ar = ?, content_zh = ?, content_es = ?
    WHERE section_key = 'mission_title'
''', (
    mission_title_translations['content_en'],
    mission_title_translations['content_fa'],
    mission_title_translations['content_tr'],
    mission_title_translations['content_az'],
    mission_title_translations['content_ar'],
    mission_title_translations['content_zh'],
    mission_title_translations['content_es']
))
print("  Updated: mission_title")

# Mission content translations
mission_content_translations = {
    'content_en': 'To advance democratic governance and federalist principles, supporting the transition to a republican, democratic and secular order in Iran. We stand by the people and protesters, emphasizing their right to protest, strike and civil disobedience.',
    'content_fa': 'پیشبرد حکومت دموکراتیک و اصول فدرالیستی، حمایت از گذار به نظم جمهوری، دموکراتیک و سکولار در ایران. ما در کنار مردم و معترضان ایستاده و بر حق اعتراض، اعتصاب و نافرمانی مدنی آنها تأکید می‌کنیم.',
    'content_tr': 'İran\'da cumhuriyetçi, demokratik ve laik bir düzene geçişi destekleyerek demokratik yönetim ve federalist ilkeleri ilerletmek. Halkın ve protestocuların yanında duruyoruz, protesto, grev ve sivil itaatsizlik haklarını vurguluyoruz.',
    'content_az': 'İranda respublikaçı, demokratik və dünyəvi nizama keçidi dəstəkləyərək demokratik idarəetmə və federalist prinsipləri irəli aparmaq. Biz xalqın və etirazçıların yanındayıq, onların etiraz, tətil və vətəndaş itaətsizliyi hüquqlarını vurğulayırıq.',
    'content_ar': 'تعزيز الحكم الديمقراطي والمبادئ الفيدرالية، ودعم الانتقال إلى نظام جمهوري وديمقراطي وعلماني في إيران. نقف إلى جانب الشعب والمحتجين، مؤكدين على حقهم في الاحتجاج والإضراب والعصيان المدني.',
    'content_zh': '推进民主治理和联邦主义原则，支持伊朗向共和、民主和世俗秩序过渡。我们与人民和抗议者站在一起，强调他们抗议、罢工和公民不服从的权利。',
    'content_es': 'Avanzar en la gobernanza democrática y los principios federalistas, apoyando la transición a un orden republicano, democrático y secular en Irán. Estamos al lado del pueblo y los manifestantes, enfatizando su derecho a protestar, hacer huelga y desobediencia civil.'
}

cursor.execute('''
    UPDATE page_content SET 
        content_en = ?, content_fa = ?, content_tr = ?, content_az = ?, 
        content_ar = ?, content_zh = ?, content_es = ?
    WHERE section_key = 'mission_content'
''', (
    mission_content_translations['content_en'],
    mission_content_translations['content_fa'],
    mission_content_translations['content_tr'],
    mission_content_translations['content_az'],
    mission_content_translations['content_ar'],
    mission_content_translations['content_zh'],
    mission_content_translations['content_es']
))
print("  Updated: mission_content")

# Partners title translations
partners_title_translations = {
    'content_en': 'Member Groups',
    'content_fa': 'گروه های عضو',
    'content_tr': 'Üye Gruplar',
    'content_az': 'Üzv Qruplar',
    'content_ar': 'المجموعات الأعضاء',
    'content_zh': '成员团体',
    'content_es': 'Grupos Miembros'
}

cursor.execute('''
    UPDATE page_content SET 
        content_en = ?, content_fa = ?, content_tr = ?, content_az = ?, 
        content_ar = ?, content_zh = ?, content_es = ?
    WHERE section_key = 'partners_title'
''', (
    partners_title_translations['content_en'],
    partners_title_translations['content_fa'],
    partners_title_translations['content_tr'],
    partners_title_translations['content_az'],
    partners_title_translations['content_ar'],
    partners_title_translations['content_zh'],
    partners_title_translations['content_es']
))
print("  Updated: partners_title")

# Partners subtitle translations
partners_subtitle_translations = {
    'content_en': 'Working together with organizations and individuals committed to democracy and federalism',
    'content_fa': 'همکاری با سازمان‌ها و افرادی که به دموکراسی و فدرالیسم متعهد هستند',
    'content_tr': 'Demokrasi ve federalizme bağlı kuruluşlar ve bireylerle birlikte çalışmak',
    'content_az': 'Demokratiya və federalizmə sadiq təşkilatlar və fərdlərlə birlikdə işləmək',
    'content_ar': 'العمل مع المنظمات والأفراد الملتزمين بالديمقراطية والفيدرالية',
    'content_zh': '与致力于民主和联邦制的组织和个人合作',
    'content_es': 'Trabajando junto con organizaciones e individuos comprometidos con la democracia y el federalismo'
}

cursor.execute('''
    UPDATE page_content SET 
        content_en = ?, content_fa = ?, content_tr = ?, content_az = ?, 
        content_ar = ?, content_zh = ?, content_es = ?
    WHERE section_key = 'partners_subtitle'
''', (
    partners_subtitle_translations['content_en'],
    partners_subtitle_translations['content_fa'],
    partners_subtitle_translations['content_tr'],
    partners_subtitle_translations['content_az'],
    partners_subtitle_translations['content_ar'],
    partners_subtitle_translations['content_zh'],
    partners_subtitle_translations['content_es']
))
print("  Updated: partners_subtitle")

# Membership title translations
membership_title_translations = {
    'content_en': 'Join the Congress',
    'content_fa': 'پیوستن به کنگره',
    'content_tr': 'Kongreye Katılın',
    'content_az': 'Konqresə Qoşulun',
    'content_ar': 'انضم إلى المؤتمر',
    'content_zh': '加入大会',
    'content_es': 'Únete al Congreso'
}

cursor.execute('''
    UPDATE page_content SET 
        content_en = ?, content_fa = ?, content_tr = ?, content_az = ?, 
        content_ar = ?, content_zh = ?, content_es = ?
    WHERE section_key = 'membership_title'
''', (
    membership_title_translations['content_en'],
    membership_title_translations['content_fa'],
    membership_title_translations['content_tr'],
    membership_title_translations['content_az'],
    membership_title_translations['content_ar'],
    membership_title_translations['content_zh'],
    membership_title_translations['content_es']
))
print("  Updated: membership_title")

# Membership subtitle translations
membership_subtitle_translations = {
    'content_en': 'Become a member and help shape the future of democracy in Iran',
    'content_fa': 'عضو شوید و در شکل‌دهی آینده دموکراسی در ایران کمک کنید',
    'content_tr': 'Üye olun ve İran\'da demokrasinin geleceğini şekillendirmeye yardımcı olun',
    'content_az': 'Üzv olun və İranda demokratiyanın gələcəyini formalaşdırmağa kömək edin',
    'content_ar': 'كن عضواً وساعد في تشكيل مستقبل الديمقراطية في إيران',
    'content_zh': '成为会员，帮助塑造伊朗民主的未来',
    'content_es': 'Conviértete en miembro y ayuda a dar forma al futuro de la democracia en Irán'
}

cursor.execute('''
    UPDATE page_content SET 
        content_en = ?, content_fa = ?, content_tr = ?, content_az = ?, 
        content_ar = ?, content_zh = ?, content_es = ?
    WHERE section_key = 'membership_subtitle'
''', (
    membership_subtitle_translations['content_en'],
    membership_subtitle_translations['content_fa'],
    membership_subtitle_translations['content_tr'],
    membership_subtitle_translations['content_az'],
    membership_subtitle_translations['content_ar'],
    membership_subtitle_translations['content_zh'],
    membership_subtitle_translations['content_es']
))
print("  Updated: membership_subtitle")

# Contact title translations
contact_title_translations = {
    'content_en': 'Contact Us',
    'content_fa': 'تماس با ما',
    'content_tr': 'Bize Ulaşın',
    'content_az': 'Bizimlə Əlaqə',
    'content_ar': 'اتصل بنا',
    'content_zh': '联系我们',
    'content_es': 'Contáctenos'
}

cursor.execute('''
    UPDATE page_content SET 
        content_en = ?, content_fa = ?, content_tr = ?, content_az = ?, 
        content_ar = ?, content_zh = ?, content_es = ?
    WHERE section_key = 'contact_title'
''', (
    contact_title_translations['content_en'],
    contact_title_translations['content_fa'],
    contact_title_translations['content_tr'],
    contact_title_translations['content_az'],
    contact_title_translations['content_ar'],
    contact_title_translations['content_zh'],
    contact_title_translations['content_es']
))
print("  Updated: contact_title")

# Contact subtitle translations
contact_subtitle_translations = {
    'content_en': 'Get in touch with our team',
    'content_fa': 'با تیم ما در تماس باشید',
    'content_tr': 'Ekibimizle iletişime geçin',
    'content_az': 'Komandamızla əlaqə saxlayın',
    'content_ar': 'تواصل مع فريقنا',
    'content_zh': '与我们的团队联系',
    'content_es': 'Ponte en contacto con nuestro equipo'
}

cursor.execute('''
    UPDATE page_content SET 
        content_en = ?, content_fa = ?, content_tr = ?, content_az = ?, 
        content_ar = ?, content_zh = ?, content_es = ?
    WHERE section_key = 'contact_subtitle'
''', (
    contact_subtitle_translations['content_en'],
    contact_subtitle_translations['content_fa'],
    contact_subtitle_translations['content_tr'],
    contact_subtitle_translations['content_az'],
    contact_subtitle_translations['content_ar'],
    contact_subtitle_translations['content_zh'],
    contact_subtitle_translations['content_es']
))
print("  Updated: contact_subtitle")

# Footer copyright translations
footer_copyright_translations = {
    'content_en': '© 2025 Joint Congress of Democratic-Republicans and Federal Democrats. All rights reserved.',
    'content_fa': '© ۲۰۲۵ کنگره مشترک جمهوری‌خواهان دموکرات و فدرال دموکرات. تمامی حقوق محفوظ است.',
    'content_tr': '© 2025 Demokrat Cumhuriyetçiler ve Federal Demokratlar Ortak Kongresi. Tüm hakları saklıdır.',
    'content_az': '© 2025 Demokrat Respublikaçılar və Federal Demokratların Birgə Konqresi. Bütün hüquqlar qorunur.',
    'content_ar': '© 2025 المؤتمر المشترك للجمهوريين الديمقراطيين والديمقراطيين الفيدراليين. جميع الحقوق محفوظة.',
    'content_zh': '© 2025 民主共和党人和联邦民主党人联合大会。保留所有权利。',
    'content_es': '© 2025 Congreso Conjunto de Demócratas Republicanos y Demócratas Federales. Todos los derechos reservados.'
}

cursor.execute('''
    UPDATE page_content SET 
        content_en = ?, content_fa = ?, content_tr = ?, content_az = ?, 
        content_ar = ?, content_zh = ?, content_es = ?
    WHERE section_key = 'footer_copyright'
''', (
    footer_copyright_translations['content_en'],
    footer_copyright_translations['content_fa'],
    footer_copyright_translations['content_tr'],
    footer_copyright_translations['content_az'],
    footer_copyright_translations['content_ar'],
    footer_copyright_translations['content_zh'],
    footer_copyright_translations['content_es']
))
print("  Updated: footer_copyright")

# Footer tagline translations
footer_tagline_translations = {
    'content_en': 'For freedom, justice, citizenship equality and distribution of power',
    'content_fa': 'برای آزادی، عدالت، برابری شهروندی و توزیع قدرت',
    'content_tr': 'Özgürlük, adalet, vatandaşlık eşitliği ve güç dağılımı için',
    'content_az': 'Azadlıq, ədalət, vətəndaşlıq bərabərliyi və hakimiyyətin bölüşdürülməsi üçün',
    'content_ar': 'من أجل الحرية والعدالة والمساواة في المواطنة وتوزيع السلطة',
    'content_zh': '为了自由、正义、公民平等和权力分配',
    'content_es': 'Por la libertad, la justicia, la igualdad ciudadana y la distribución del poder'
}

cursor.execute('''
    UPDATE page_content SET 
        content_en = ?, content_fa = ?, content_tr = ?, content_az = ?, 
        content_ar = ?, content_zh = ?, content_es = ?
    WHERE section_key = 'footer_tagline'
''', (
    footer_tagline_translations['content_en'],
    footer_tagline_translations['content_fa'],
    footer_tagline_translations['content_tr'],
    footer_tagline_translations['content_az'],
    footer_tagline_translations['content_ar'],
    footer_tagline_translations['content_zh'],
    footer_tagline_translations['content_es']
))
print("  Updated: footer_tagline")

# Vision title translations
vision_title_translations = {
    'content_en': 'Our Vision',
    'content_fa': 'چشم‌انداز ما',
    'content_tr': 'Vizyonumuz',
    'content_az': 'Vizyonumuz',
    'content_ar': 'رؤيتنا',
    'content_zh': '我们的愿景',
    'content_es': 'Nuestra Visión'
}

cursor.execute('''
    UPDATE page_content SET 
        content_en = ?, content_fa = ?, content_tr = ?, content_az = ?, 
        content_ar = ?, content_zh = ?, content_es = ?
    WHERE section_key = 'vision_title'
''', (
    vision_title_translations['content_en'],
    vision_title_translations['content_fa'],
    vision_title_translations['content_tr'],
    vision_title_translations['content_az'],
    vision_title_translations['content_ar'],
    vision_title_translations['content_zh'],
    vision_title_translations['content_es']
))
print("  Updated: vision_title")

# Vision content translations
vision_content_translations = {
    'content_en': 'A future in which Iran\'s ethnic and national, linguistic and cultural diversity is not an issue to be denied and suppressed, but an asset for coexistence and progress. A future in which decentralization and administration of regional affairs by the people of the same regions will be recognized as one of the foundations of justice and national solidarity.',
    'content_fa': 'آینده‌ای که در آن تنوع قومی و ملی، زبانی و فرهنگی ایران نه موضوعی برای انکار و سرکوب، بلکه دارایی برای همزیستی و پیشرفت باشد. آینده‌ای که در آن تمرکززدایی و اداره امور منطقه‌ای توسط مردم همان مناطق به عنوان یکی از پایه‌های عدالت و همبستگی ملی شناخته شود.',
    'content_tr': 'İran\'ın etnik ve ulusal, dilsel ve kültürel çeşitliliğinin inkar edilip bastırılacak bir sorun değil, birlikte yaşama ve ilerleme için bir varlık olduğu bir gelecek. Bölgesel işlerin aynı bölgelerin halkı tarafından yönetilmesi ve ademi merkeziyetçiliğin adalet ve ulusal dayanışmanın temellerinden biri olarak kabul edileceği bir gelecek.',
    'content_az': 'İranın etnik və milli, dil və mədəni müxtəlifliyinin inkar edilib sıxışdırılacaq bir problem deyil, birgə yaşayış və tərəqqi üçün bir sərvət olduğu gələcək. Regional işlərin eyni bölgələrin xalqı tərəfindən idarə edilməsi və mərkəzsizləşdirmənin ədalət və milli həmrəyliyin əsaslarından biri kimi tanınacağı gələcək.',
    'content_ar': 'مستقبل لا يكون فيه التنوع العرقي والقومي واللغوي والثقافي في إيران قضية يجب إنكارها وقمعها، بل ثروة للتعايش والتقدم. مستقبل يُعترف فيه باللامركزية وإدارة الشؤون الإقليمية من قبل شعوب نفس المناطق كأحد أسس العدالة والتضامن الوطني.',
    'content_zh': '一个伊朗的民族、语言和文化多样性不是被否认和压制的问题，而是共存和进步的资产的未来。一个地方分权和由同一地区人民管理地区事务将被认为是正义和民族团结基础之一的未来。',
    'content_es': 'Un futuro en el que la diversidad étnica y nacional, lingüística y cultural de Irán no sea un problema a negar y reprimir, sino un activo para la convivencia y el progreso. Un futuro en el que la descentralización y la administración de los asuntos regionales por los pueblos de las mismas regiones sea reconocida como uno de los fundamentos de la justicia y la solidaridad nacional.'
}

cursor.execute('''
    UPDATE page_content SET 
        content_en = ?, content_fa = ?, content_tr = ?, content_az = ?, 
        content_ar = ?, content_zh = ?, content_es = ?
    WHERE section_key = 'vision_content'
''', (
    vision_content_translations['content_en'],
    vision_content_translations['content_fa'],
    vision_content_translations['content_tr'],
    vision_content_translations['content_az'],
    vision_content_translations['content_ar'],
    vision_content_translations['content_zh'],
    vision_content_translations['content_es']
))
print("  Updated: vision_content")

# Values title translations
values_title_translations = {
    'content_en': 'Our Values',
    'content_fa': 'ارزش‌های ما',
    'content_tr': 'Değerlerimiz',
    'content_az': 'Dəyərlərimiz',
    'content_ar': 'قيمنا',
    'content_zh': '我们的价值观',
    'content_es': 'Nuestros Valores'
}

cursor.execute('''
    UPDATE page_content SET 
        content_en = ?, content_fa = ?, content_tr = ?, content_az = ?, 
        content_ar = ?, content_zh = ?, content_es = ?
    WHERE section_key = 'values_title'
''', (
    values_title_translations['content_en'],
    values_title_translations['content_fa'],
    values_title_translations['content_tr'],
    values_title_translations['content_az'],
    values_title_translations['content_ar'],
    values_title_translations['content_zh'],
    values_title_translations['content_es']
))
print("  Updated: values_title")

# Values content translations
values_content_translations = {
    'content_en': 'Democracy, Federalism, Human Rights, Transparency, Accountability, Collective Action, Non-Violence, Respect for Human Dignity',
    'content_fa': 'دموکراسی، فدرالیسم، حقوق بشر، شفافیت، پاسخگویی، اقدام جمعی، پرهیز از خشونت، احترام به کرامت انسانی',
    'content_tr': 'Demokrasi, Federalizm, İnsan Hakları, Şeffaflık, Hesap Verebilirlik, Kolektif Eylem, Şiddetsizlik, İnsan Onuruna Saygı',
    'content_az': 'Demokratiya, Federalizm, İnsan Hüquqları, Şəffaflıq, Hesabatlılıq, Kollektiv Fəaliyyət, Zorakılıqsızlıq, İnsan Ləyaqətinə Hörmət',
    'content_ar': 'الديمقراطية، الفيدرالية، حقوق الإنسان، الشفافية، المساءلة، العمل الجماعي، اللاعنف، احترام الكرامة الإنسانية',
    'content_zh': '民主、联邦制、人权、透明度、问责制、集体行动、非暴力、尊重人的尊严',
    'content_es': 'Democracia, Federalismo, Derechos Humanos, Transparencia, Responsabilidad, Acción Colectiva, No Violencia, Respeto a la Dignidad Humana'
}

cursor.execute('''
    UPDATE page_content SET 
        content_en = ?, content_fa = ?, content_tr = ?, content_az = ?, 
        content_ar = ?, content_zh = ?, content_es = ?
    WHERE section_key = 'values_content'
''', (
    values_content_translations['content_en'],
    values_content_translations['content_fa'],
    values_content_translations['content_tr'],
    values_content_translations['content_az'],
    values_content_translations['content_ar'],
    values_content_translations['content_zh'],
    values_content_translations['content_es']
))
print("  Updated: values_content")

conn.commit()
conn.close()

print("\n✅ All content updated successfully!")