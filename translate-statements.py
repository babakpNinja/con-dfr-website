import json
import requests
import time

# Load statements data
with open('statements_data.json', 'r', encoding='utf-8') as f:
    statements = json.load(f)

# Languages to translate to
languages = {
    'en': 'English',
    'tr': 'Turkish',
    'az': 'Azerbaijani',
    'ar': 'Arabic',
    'zh': 'Chinese',
    'es': 'Spanish'
}

# Translation function using Google Translate API (free)
def translate_text(text, target_lang, source_lang='fa'):
    """Translate text using Google Translate"""
    if not text or target_lang == source_lang:
        return text
    
    try:
        url = "https://translate.googleapis.com/translate_a/single"
        params = {
            'client': 'gtx',
            'sl': source_lang,
            'tl': target_lang,
            'dt': 't',
            'q': text
        }
        response = requests.get(url, params=params, timeout=30)
        if response.status_code == 200:
            result = response.json()
            translated = ''.join([item[0] for item in result[0] if item[0]])
            return translated
    except Exception as e:
        print(f"Translation error: {e}")
    return text

# Translate all statements
translated_statements = []

for statement in statements:
    print(f"\nTranslating statement {statement['id']}: {statement['title_fa'][:30]}...")
    
    translated = {
        'id': statement['id'],
        'slug': statement['slug'],
        'date': statement['date'],
        'title_fa': statement['title_fa'],
        'content_fa': statement['content_fa']
    }
    
    # Translate title and content to each language
    for lang_code, lang_name in languages.items():
        print(f"  Translating to {lang_name}...")
        
        # Translate title
        translated[f'title_{lang_code}'] = translate_text(statement['title_fa'], lang_code)
        time.sleep(0.5)  # Rate limiting
        
        # Translate content (split into paragraphs for better results)
        paragraphs = statement['content_fa'].split('\n\n')
        translated_paragraphs = []
        for para in paragraphs:
            if para.strip():
                translated_para = translate_text(para.strip(), lang_code)
                translated_paragraphs.append(translated_para)
                time.sleep(0.3)
        
        translated[f'content_{lang_code}'] = '\n\n'.join(translated_paragraphs)
    
    translated_statements.append(translated)
    print(f"  Done!")

# Save translated statements
with open('statements_translated.json', 'w', encoding='utf-8') as f:
    json.dump(translated_statements, f, ensure_ascii=False, indent=2)

print(f"\n\nTranslation complete! Saved to statements_translated.json")