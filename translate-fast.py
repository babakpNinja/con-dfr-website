import json
import requests
import time
import sys

def translate_text(text, target_lang, source_lang='fa'):
    """Translate text using Google Translate"""
    if not text or target_lang == source_lang:
        return text
    
    # Split long text into chunks (max ~5000 chars per request)
    max_chunk = 4500
    if len(text) > max_chunk:
        chunks = []
        current_chunk = ""
        for para in text.split('\n'):
            if len(current_chunk) + len(para) + 1 < max_chunk:
                current_chunk += para + '\n'
            else:
                if current_chunk:
                    chunks.append(current_chunk.strip())
                current_chunk = para + '\n'
        if current_chunk:
            chunks.append(current_chunk.strip())
        
        translated_chunks = []
        for chunk in chunks:
            translated_chunks.append(translate_text(chunk, target_lang, source_lang))
            time.sleep(0.5)
        return '\n\n'.join(translated_chunks)
    
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
        print(f"Translation error for {target_lang}: {e}", file=sys.stderr)
    return text

# Load statements
with open('statements_data.json', 'r', encoding='utf-8') as f:
    statements = json.load(f)

languages = ['en', 'tr', 'az', 'ar', 'zh', 'es']

translated_statements = []

for i, statement in enumerate(statements):
    print(f"Processing statement {i+1}/{len(statements)}: {statement['title_fa'][:30]}...", flush=True)
    
    translated = {
        'id': statement['id'],
        'slug': statement['slug'],
        'date': statement['date'],
        'title_fa': statement['title_fa'],
        'content_fa': statement['content_fa']
    }
    
    for lang in languages:
        print(f"  -> {lang}", end=" ", flush=True)
        translated[f'title_{lang}'] = translate_text(statement['title_fa'], lang)
        time.sleep(0.3)
        translated[f'content_{lang}'] = translate_text(statement['content_fa'], lang)
        time.sleep(0.5)
        print("✓", flush=True)
    
    translated_statements.append(translated)
    print(f"  Statement {i+1} complete!", flush=True)

# Save
with open('statements_translated.json', 'w', encoding='utf-8') as f:
    json.dump(translated_statements, f, ensure_ascii=False, indent=2)

print(f"\nAll translations saved to statements_translated.json", flush=True)