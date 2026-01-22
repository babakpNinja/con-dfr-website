import sqlite3

conn = sqlite3.connect('data/congress.db')
cursor = conn.cursor()

print("Updating navigation items with translations...")

# Home
cursor.execute('''
    UPDATE navigation_items SET 
        label_en = 'Home',
        label_fa = 'خانه',
        label_tr = 'Ana Sayfa',
        label_az = 'Ana Səhifə',
        label_ar = 'الرئيسية',
        label_zh = '首页',
        label_es = 'Inicio'
    WHERE nav_key = 'home'
''')
print("  Updated: Home")

# About
cursor.execute('''
    UPDATE navigation_items SET 
        label_en = 'About',
        label_fa = 'درباره ما',
        label_tr = 'Hakkımızda',
        label_az = 'Haqqımızda',
        label_ar = 'من نحن',
        label_zh = '关于我们',
        label_es = 'Sobre Nosotros'
    WHERE nav_key = 'about'
''')
print("  Updated: About")

# Mission
cursor.execute('''
    UPDATE navigation_items SET 
        label_en = 'Mission',
        label_fa = 'ماموریت',
        label_tr = 'Misyon',
        label_az = 'Missiya',
        label_ar = 'المهمة',
        label_zh = '使命',
        label_es = 'Misión'
    WHERE nav_key = 'mission'
''')
print("  Updated: Mission")

# Partners -> Member Groups
cursor.execute('''
    UPDATE navigation_items SET 
        label_en = 'Members',
        label_fa = 'اعضا',
        label_tr = 'Üyeler',
        label_az = 'Üzvlər',
        label_ar = 'الأعضاء',
        label_zh = '成员',
        label_es = 'Miembros'
    WHERE nav_key = 'partners'
''')
print("  Updated: Partners -> Members")

# Membership -> Join
cursor.execute('''
    UPDATE navigation_items SET 
        label_en = 'Join',
        label_fa = 'عضویت',
        label_tr = 'Katıl',
        label_az = 'Qoşul',
        label_ar = 'انضم',
        label_zh = '加入',
        label_es = 'Únete'
    WHERE nav_key = 'membership'
''')
print("  Updated: Membership -> Join")

# Contact
cursor.execute('''
    UPDATE navigation_items SET 
        label_en = 'Contact',
        label_fa = 'تماس',
        label_tr = 'İletişim',
        label_az = 'Əlaqə',
        label_ar = 'اتصل',
        label_zh = '联系',
        label_es = 'Contacto'
    WHERE nav_key = 'contact'
''')
print("  Updated: Contact")

# Add Statements navigation item
cursor.execute('''
    INSERT OR REPLACE INTO navigation_items 
    (nav_key, label_en, label_fa, label_tr, label_az, label_ar, label_zh, label_es, href, display_order, is_active)
    VALUES ('statements', 'Statements', 'بیانیه‌ها', 'Bildiriler', 'Bəyanatlar', 'البيانات', '声明', 'Declaraciones', '/statements', 6, 1)
''')
print("  Added: Statements")

conn.commit()
conn.close()

print("\n✅ All navigation items updated with translations!")