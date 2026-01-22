const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'data', 'congress.db');
const db = new Database(dbPath);

// Load translated statements
const statementsData = JSON.parse(fs.readFileSync('statements_translated.json', 'utf-8'));

console.log('Creating statements table if not exists...');

// Create statements table
db.exec(`
  CREATE TABLE IF NOT EXISTS statements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    date DATE NOT NULL,
    title_en TEXT,
    title_fa TEXT,
    title_tr TEXT,
    title_az TEXT,
    title_ar TEXT,
    title_zh TEXT,
    title_es TEXT,
    content_en TEXT,
    content_fa TEXT,
    content_tr TEXT,
    content_az TEXT,
    content_ar TEXT,
    content_zh TEXT,
    content_es TEXT,
    display_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE INDEX IF NOT EXISTS idx_statements_date ON statements(date);
  CREATE INDEX IF NOT EXISTS idx_statements_slug ON statements(slug);
`);

// Clear existing statements
db.exec('DELETE FROM statements');

console.log('Inserting statements...');

const insertStmt = db.prepare(`
  INSERT INTO statements (
    slug, date,
    title_en, title_fa, title_tr, title_az, title_ar, title_zh, title_es,
    content_en, content_fa, content_tr, content_az, content_ar, content_zh, content_es,
    display_order, is_active
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

statementsData.forEach((s, index) => {
  console.log(`  Inserting: ${s.slug}`);
  insertStmt.run(
    s.slug,
    s.date,
    s.title_en || '',
    s.title_fa || '',
    s.title_tr || '',
    s.title_az || '',
    s.title_ar || '',
    s.title_zh || '',
    s.title_es || '',
    s.content_en || '',
    s.content_fa || '',
    s.content_tr || '',
    s.content_az || '',
    s.content_ar || '',
    s.content_zh || '',
    s.content_es || '',
    index,
    1
  );
});

console.log(`\nInserted ${statementsData.length} statements successfully!`);

// Verify
const count = db.prepare('SELECT COUNT(*) as count FROM statements').get();
console.log(`Total statements in database: ${count.count}`);

const statements = db.prepare('SELECT id, slug, date, title_en FROM statements ORDER BY date DESC').all();
statements.forEach(s => {
  console.log(`  ${s.id}: ${s.slug} (${s.date}) - ${s.title_en.substring(0, 50)}...`);
});

db.close();