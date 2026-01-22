import sqlite3
import json

conn = sqlite3.connect('data/congress.db')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

print("=" * 60)
print("PARTNERS")
print("=" * 60)
cursor.execute("SELECT id, name_en, name_fa, website_url FROM partners")
partners = cursor.fetchall()
for p in partners:
    print(f"{p['id']}. {p['name_en']} | {p['name_fa']} | {p['website_url']}")

print("\n" + "=" * 60)
print("HERO IMAGES - Schema")
print("=" * 60)
cursor.execute("PRAGMA table_info(hero_images)")
cols = cursor.fetchall()
print("Columns:", [c['name'] for c in cols])

cursor.execute("SELECT * FROM hero_images")
heroes = cursor.fetchall()
for h in heroes:
    print(dict(h))

print("\n" + "=" * 60)
print("PAGE CONTENT")
print("=" * 60)
cursor.execute("SELECT id, page_key, title_en, title_fa FROM page_content")
pages = cursor.fetchall()
for p in pages:
    print(f"{p['id']}. {p['page_key']} | {p['title_en']} | {p['title_fa']}")

print("\n" + "=" * 60)
print("STATEMENTS")
print("=" * 60)
cursor.execute("SELECT id, slug, title_en, title_fa, date FROM statements")
statements = cursor.fetchall()
for s in statements:
    print(f"{s['id']}. {s['slug']} | {s['title_en']} | {s['date']}")

print("\n" + "=" * 60)
print("NAVIGATION ITEMS")
print("=" * 60)
cursor.execute("SELECT id, label_en, label_fa, url, sort_order FROM navigation_items ORDER BY sort_order")
nav = cursor.fetchall()
for n in nav:
    print(f"{n['id']}. {n['label_en']} | {n['url']} | order: {n['sort_order']}")

print("\n" + "=" * 60)
print("SITE SETTINGS")
print("=" * 60)
cursor.execute("SELECT setting_key, setting_value FROM site_settings")
settings = cursor.fetchall()
for s in settings:
    val = s['setting_value'][:50] + "..." if len(s['setting_value']) > 50 else s['setting_value']
    print(f"{s['setting_key']}: {val}")

print("\n" + "=" * 60)
print("SOCIAL LINKS")
print("=" * 60)
cursor.execute("SELECT * FROM social_links")
social = cursor.fetchall()
for s in social:
    print(dict(s))

conn.close()