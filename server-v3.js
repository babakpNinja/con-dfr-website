const express = require('express');
const session = require('express-session');
const path = require('path');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const fs = require('fs');
const crypto = require('crypto');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// TRANSLATION SERVICE
// ============================================

const LANGUAGE_CODES = {
  en: 'en',
  fa: 'fa',
  tr: 'tr', 
  az: 'az',
  ar: 'ar',
  zh: 'zh-CN',
  es: 'es'
};

async function translateText(text, targetLang) {
  if (!text || text.trim() === '') return '';
  
  return new Promise((resolve, reject) => {
    const sourceLang = 'en';
    const target = LANGUAGE_CODES[targetLang] || targetLang;
    
    const encodedText = encodeURIComponent(text);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${target}&dt=t&q=${encodedText}`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result && result[0]) {
            const translated = result[0].map(item => item[0]).join('');
            resolve(translated);
          } else {
            resolve(text);
          }
        } catch (e) {
          resolve(text);
        }
      });
    }).on('error', () => resolve(text));
  });
}

async function translateToAllLanguages(name, description) {
  const languages = ['fa', 'tr', 'az', 'ar', 'zh', 'es'];
  const translations = {
    name_en: name,
    description_en: description
  };
  
  for (const lang of languages) {
    try {
      translations[`name_${lang}`] = await translateText(name, lang);
      if (description) {
        translations[`description_${lang}`] = await translateText(description, lang);
      }
      await new Promise(r => setTimeout(r, 100));
    } catch (e) {
      translations[`name_${lang}`] = name;
      translations[`description_${lang}`] = description || '';
    }
  }
  
  return translations;
}

// ============================================
// SECURITY CONFIGURATIONS
// ============================================

const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(64).toString('hex');
const loginAttempts = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000;
const BCRYPT_ROUNDS = 12;

// ============================================
// DATABASE SETUP
// ============================================

const dbPath = path.join(__dirname, 'data', 'congress.db');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    failed_attempts INTEGER DEFAULT 0,
    locked_until DATETIME,
    last_login DATETIME,
    password_changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
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
  
  CREATE TABLE IF NOT EXISTS memberships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    applicant_type TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    membership_type TEXT NOT NULL,
    organization_name TEXT,
    country TEXT,
    city TEXT,
    phone TEXT,
    website TEXT,
    social_media TEXT,
    motivation TEXT,
    experience TEXT,
    skills TEXT,
    how_heard TEXT,
    agrees_to_mou INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending',
    admin_notes TEXT,
    reviewed_by INTEGER,
    reviewed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS login_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    ip_address TEXT,
    user_agent TEXT,
    success INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- CMS Tables for full site customization
  CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type TEXT DEFAULT 'text',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS hero_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_url TEXT NOT NULL,
    title_en TEXT,
    title_fa TEXT,
    title_tr TEXT,
    title_az TEXT,
    title_ar TEXT,
    title_zh TEXT,
    title_es TEXT,
    subtitle_en TEXT,
    subtitle_fa TEXT,
    subtitle_tr TEXT,
    subtitle_az TEXT,
    subtitle_ar TEXT,
    subtitle_zh TEXT,
    subtitle_es TEXT,
    display_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS page_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    section_key TEXT NOT NULL,
    content_en TEXT,
    content_fa TEXT,
    content_tr TEXT,
    content_az TEXT,
    content_ar TEXT,
    content_zh TEXT,
    content_es TEXT,
    content_type TEXT DEFAULT 'text',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(section_key)
  );

  CREATE TABLE IF NOT EXISTS navigation_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nav_key TEXT NOT NULL,
    label_en TEXT NOT NULL,
    label_fa TEXT,
    label_tr TEXT,
    label_az TEXT,
    label_ar TEXT,
    label_zh TEXT,
    label_es TEXT,
    href TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    parent_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS footer_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    section_key TEXT UNIQUE NOT NULL,
    content_en TEXT,
    content_fa TEXT,
    content_tr TEXT,
    content_az TEXT,
    content_ar TEXT,
    content_zh TEXT,
    content_es TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS social_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    icon_class TEXT,
    display_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_memberships_status ON memberships(status);
  CREATE INDEX IF NOT EXISTS idx_memberships_email ON memberships(email);
  CREATE INDEX IF NOT EXISTS idx_partners_type ON partners(partner_type);
  CREATE INDEX IF NOT EXISTS idx_hero_images_order ON hero_images(display_order);
  CREATE INDEX IF NOT EXISTS idx_page_content_key ON page_content(section_key);
`);

// Initialize default site settings
const defaultSettings = [
  { key: 'site_name', value: 'CON-DFR', type: 'text' },
  { key: 'site_tagline', value: 'Congress of Democratic & Federalist Republicans', type: 'text' },
  { key: 'primary_color', value: '#1a365d', type: 'color' },
  { key: 'secondary_color', value: '#c9a227', type: 'color' },
  { key: 'accent_color', value: '#2d3748', type: 'color' },
  { key: 'hero_height', value: '60vh', type: 'text' },
  { key: 'hero_overlay_opacity', value: '0.5', type: 'text' },
  { key: 'carousel_interval', value: '5000', type: 'number' },
  { key: 'logo_url', value: '/images/logo.png', type: 'text' },
  { key: 'favicon_url', value: '/images/favicon.ico', type: 'text' },
  { key: 'contact_email', value: 'info@con-dfr.org', type: 'text' },
  { key: 'contact_phone', value: '', type: 'text' },
  { key: 'contact_address', value: '', type: 'textarea' },
  { key: 'google_analytics_id', value: '', type: 'text' },
  { key: 'meta_description', value: 'Congress of Democratic & Federalist Republicans - Promoting democracy and federalism worldwide', type: 'textarea' },
  { key: 'meta_keywords', value: 'democracy, federalism, republicans, congress, political organization', type: 'textarea' }
];

const insertSetting = db.prepare('INSERT OR IGNORE INTO site_settings (setting_key, setting_value, setting_type) VALUES (?, ?, ?)');
defaultSettings.forEach(s => insertSetting.run(s.key, s.value, s.type));

// Initialize default hero images
const heroCount = db.prepare('SELECT COUNT(*) as count FROM hero_images').get();
if (heroCount.count === 0) {
  const defaultHeroImages = [
    { url: '/images/hero/hero1.png', title_en: 'United for Democracy', subtitle_en: 'Building bridges across nations and cultures' },
    { url: '/images/hero/hero2.png', title_en: 'Strong Institutions', subtitle_en: 'Supporting democratic governance worldwide' },
    { url: '/images/hero/hero3.png', title_en: 'People Power', subtitle_en: 'Empowering citizens to shape their future' },
    { url: '/images/hero/hero4.png', title_en: 'Global Connections', subtitle_en: 'Federalism uniting diverse communities' },
    { url: '/images/hero/hero5.png', title_en: 'Your Voice Matters', subtitle_en: 'Every vote counts in a true democracy' }
  ];
  
  const insertHero = db.prepare(`
    INSERT INTO hero_images (image_url, title_en, subtitle_en, display_order, is_active)
    VALUES (?, ?, ?, ?, 1)
  `);
  
  defaultHeroImages.forEach((hero, index) => {
    insertHero.run(hero.url, hero.title_en, hero.subtitle_en, index);
  });
}

// Initialize default page content
const defaultContent = [
  { key: 'hero_main_title', content_en: 'Congress of Democratic & Federalist Republicans' },
  { key: 'hero_subtitle', content_en: 'Uniting voices for democracy, federalism, and human rights across the globe' },
  { key: 'about_title', content_en: 'About Us' },
  { key: 'about_content', content_en: 'The Congress of Democratic & Federalist Republicans (CON-DFR) is an international organization dedicated to promoting democratic values, federalist principles, and human rights. We bring together individuals and organizations from around the world who share our commitment to building free, fair, and representative societies.' },
  { key: 'mission_title', content_en: 'Our Mission' },
  { key: 'mission_content', content_en: 'To advance democratic governance and federalist principles worldwide through education, advocacy, and international cooperation.' },
  { key: 'vision_title', content_en: 'Our Vision' },
  { key: 'vision_content', content_en: 'A world where every person has a voice in their government and where diverse communities thrive within united, democratic federations.' },
  { key: 'values_title', content_en: 'Our Values' },
  { key: 'values_content', content_en: 'Democracy, Federalism, Human Rights, Transparency, Inclusivity, International Cooperation' },
  { key: 'partners_title', content_en: 'Our Partners' },
  { key: 'partners_subtitle', content_en: 'Working together with organizations and individuals worldwide' },
  { key: 'membership_title', content_en: 'Join Us' },
  { key: 'membership_subtitle', content_en: 'Become a member and help shape the future of democracy' },
  { key: 'contact_title', content_en: 'Contact Us' },
  { key: 'contact_subtitle', content_en: 'Get in touch with our team' },
  { key: 'footer_copyright', content_en: '© 2025 Congress of Democratic & Federalist Republicans. All rights reserved.' },
  { key: 'footer_tagline', content_en: 'Promoting democracy and federalism worldwide' }
];

const insertContent = db.prepare('INSERT OR IGNORE INTO page_content (section_key, content_en) VALUES (?, ?)');
defaultContent.forEach(c => insertContent.run(c.key, c.content_en));

// Initialize default navigation
const navCount = db.prepare('SELECT COUNT(*) as count FROM navigation_items').get();
if (navCount.count === 0) {
  const defaultNav = [
    { key: 'home', label_en: 'Home', href: '#home', order: 0 },
    { key: 'about', label_en: 'About', href: '#about', order: 1 },
    { key: 'mission', label_en: 'Mission', href: '#mission', order: 2 },
    { key: 'partners', label_en: 'Partners', href: '#partners', order: 3 },
    { key: 'membership', label_en: 'Membership', href: '#membership', order: 4 },
    { key: 'contact', label_en: 'Contact', href: '#contact', order: 5 }
  ];
  
  const insertNav = db.prepare('INSERT INTO navigation_items (nav_key, label_en, href, display_order) VALUES (?, ?, ?, ?)');
  defaultNav.forEach(n => insertNav.run(n.key, n.label_en, n.href, n.order));
}

// Create default admin if not exists
const adminExists = db.prepare('SELECT * FROM admin WHERE username = ?').get('admin');
if (!adminExists) {
  const defaultPassword = process.env.ADMIN_PASSWORD || 'Congress@2025!Secure';
  const hashedPassword = bcrypt.hashSync(defaultPassword, BCRYPT_ROUNDS);
  db.prepare('INSERT INTO admin (username, password) VALUES (?, ?)').run('admin', hashedPassword);
  console.log('========================================');
  console.log('🔐 SECURE ADMIN CREATED');
  console.log('Username: admin');
  console.log('Password: ' + defaultPassword);
  console.log('⚠️  CHANGE THIS PASSWORD IMMEDIATELY!');
  console.log('========================================');
}

// ============================================
// MIDDLEWARE
// ============================================

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax'
  }
}));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// File upload configuration
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg|ico/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// Auth middleware
function requireAuth(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
}

// Rate limiting helpers
function checkRateLimit(ip) {
  const attempts = loginAttempts.get(ip);
  if (attempts && attempts.count >= MAX_LOGIN_ATTEMPTS) {
    const timeLeft = attempts.lockUntil - Date.now();
    if (timeLeft > 0) {
      return { allowed: false, message: `Too many attempts. Try again in ${Math.ceil(timeLeft / 60000)} minutes.` };
    }
    loginAttempts.delete(ip);
  }
  return { allowed: true };
}

function recordLoginAttempt(ip, success) {
  if (success) {
    loginAttempts.delete(ip);
    return;
  }
  const attempts = loginAttempts.get(ip) || { count: 0 };
  attempts.count++;
  if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
    attempts.lockUntil = Date.now() + LOCKOUT_TIME;
  }
  loginAttempts.set(ip, attempts);
}

// ============================================
// PUBLIC API ROUTES
// ============================================

// Get site settings (public)
app.get('/api/site-settings', (req, res) => {
  try {
    const settings = db.prepare('SELECT setting_key, setting_value FROM site_settings').all();
    const settingsObj = {};
    settings.forEach(s => settingsObj[s.setting_key] = s.setting_value);
    res.json(settingsObj);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Get hero images (public)
app.get('/api/hero-images', (req, res) => {
  try {
    const images = db.prepare('SELECT * FROM hero_images WHERE is_active = 1 ORDER BY display_order').all();
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Get page content (public)
app.get('/api/content', (req, res) => {
  try {
    const content = db.prepare('SELECT * FROM page_content').all();
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Get navigation items (public)
app.get('/api/navigation', (req, res) => {
  try {
    const nav = db.prepare('SELECT * FROM navigation_items WHERE is_active = 1 ORDER BY display_order').all();
    res.json(nav);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Get social links (public)
app.get('/api/social-links', (req, res) => {
  try {
    const links = db.prepare('SELECT * FROM social_links WHERE is_active = 1 ORDER BY display_order').all();
    res.json(links);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Get partners (public)
app.get('/api/partners', (req, res) => {
  try {
    const partners = db.prepare('SELECT * FROM partners WHERE is_active = 1 ORDER BY display_order, created_at').all();
    res.json(partners);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Submit membership application
app.post('/api/membership', (req, res) => {
  try {
    const data = req.body;
    
    if (!data.full_name || !data.email || !data.membership_type || !data.applicant_type) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }
    
    const result = db.prepare(`
      INSERT INTO memberships (
        applicant_type, full_name, email, membership_type, organization_name,
        country, city, phone, website, social_media, motivation, experience,
        skills, how_heard, agrees_to_mou
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.applicant_type,
      data.full_name,
      data.email,
      data.membership_type,
      data.organization_name || '',
      data.country || '',
      data.city || '',
      data.phone || '',
      data.website || '',
      data.social_media || '',
      data.motivation || '',
      data.experience || '',
      data.skills || '',
      data.how_heard || '',
      data.agrees_to_mou ? 1 : 0
    );
    
    res.json({ success: true, id: result.lastInsertRowid, message: 'Application submitted successfully!' });
  } catch (error) {
    console.error('Membership error:', error);
    res.status(500).json({ success: false, message: 'Error submitting application' });
  }
});

// ============================================
// AUTH ROUTES
// ============================================

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const ip = req.ip || 'unknown';
  
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    return res.status(429).json({ success: false, message: rateCheck.message });
  }
  
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password required' });
  }
  
  const admin = db.prepare('SELECT * FROM admin WHERE username = ?').get(username.toLowerCase().trim());
  
  if (admin && bcrypt.compareSync(password, admin.password)) {
    recordLoginAttempt(ip, true);
    req.session.isAdmin = true;
    req.session.adminId = admin.id;
    db.prepare('UPDATE admin SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(admin.id);
    res.json({ success: true, message: 'Login successful' });
  } else {
    recordLoginAttempt(ip, false);
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

app.get('/api/auth/status', (req, res) => {
  res.json({ isAuthenticated: !!(req.session && req.session.isAdmin) });
});

// ============================================
// ADMIN API - SITE SETTINGS
// ============================================

app.get('/api/admin/settings', requireAuth, (req, res) => {
  try {
    const settings = db.prepare('SELECT * FROM site_settings').all();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/admin/settings', requireAuth, (req, res) => {
  try {
    const { settings } = req.body;
    const updateStmt = db.prepare('UPDATE site_settings SET setting_value = ?, updated_at = CURRENT_TIMESTAMP WHERE setting_key = ?');
    const insertStmt = db.prepare('INSERT OR REPLACE INTO site_settings (setting_key, setting_value, setting_type, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)');
    
    Object.entries(settings).forEach(([key, value]) => {
      const existing = db.prepare('SELECT * FROM site_settings WHERE setting_key = ?').get(key);
      if (existing) {
        updateStmt.run(value, key);
      } else {
        insertStmt.run(key, value, 'text');
      }
    });
    
    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Settings error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// ============================================
// ADMIN API - HERO IMAGES
// ============================================

app.get('/api/admin/hero-images', requireAuth, (req, res) => {
  try {
    const images = db.prepare('SELECT * FROM hero_images ORDER BY display_order').all();
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/admin/hero-images', requireAuth, upload.single('image'), (req, res) => {
  try {
    const data = req.body;
    let imageUrl = data.image_url || '';
    if (req.file) {
      imageUrl = '/uploads/' + req.file.filename;
    }
    
    const result = db.prepare(`
      INSERT INTO hero_images (
        image_url, title_en, title_fa, title_tr, title_az, title_ar, title_zh, title_es,
        subtitle_en, subtitle_fa, subtitle_tr, subtitle_az, subtitle_ar, subtitle_zh, subtitle_es,
        display_order, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      imageUrl,
      data.title_en || '', data.title_fa || '', data.title_tr || '', data.title_az || '', data.title_ar || '', data.title_zh || '', data.title_es || '',
      data.subtitle_en || '', data.subtitle_fa || '', data.subtitle_tr || '', data.subtitle_az || '', data.subtitle_ar || '', data.subtitle_zh || '', data.subtitle_es || '',
      parseInt(data.display_order) || 0,
      data.is_active === 'false' ? 0 : 1
    );
    
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Hero image error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/api/admin/hero-images/:id', requireAuth, upload.single('image'), (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    let imageUrl = data.image_url;
    if (req.file) {
      imageUrl = '/uploads/' + req.file.filename;
    }
    
    db.prepare(`
      UPDATE hero_images SET
        image_url = COALESCE(?, image_url),
        title_en = ?, title_fa = ?, title_tr = ?, title_az = ?, title_ar = ?, title_zh = ?, title_es = ?,
        subtitle_en = ?, subtitle_fa = ?, subtitle_tr = ?, subtitle_az = ?, subtitle_ar = ?, subtitle_zh = ?, subtitle_es = ?,
        display_order = ?, is_active = ?
      WHERE id = ?
    `).run(
      imageUrl,
      data.title_en || '', data.title_fa || '', data.title_tr || '', data.title_az || '', data.title_ar || '', data.title_zh || '', data.title_es || '',
      data.subtitle_en || '', data.subtitle_fa || '', data.subtitle_tr || '', data.subtitle_az || '', data.subtitle_ar || '', data.subtitle_zh || '', data.subtitle_es || '',
      parseInt(data.display_order) || 0,
      data.is_active === 'false' ? 0 : 1,
      id
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Hero image update error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/api/admin/hero-images/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM hero_images WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// ============================================
// ADMIN API - PAGE CONTENT
// ============================================

app.get('/api/admin/content', requireAuth, (req, res) => {
  try {
    const content = db.prepare('SELECT * FROM page_content ORDER BY section_key').all();
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/admin/content', requireAuth, (req, res) => {
  try {
    const data = req.body;
    
    db.prepare(`
      INSERT OR REPLACE INTO page_content (
        section_key, content_en, content_fa, content_tr, content_az, content_ar, content_zh, content_es,
        content_type, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(
      data.section_key,
      data.content_en || '', data.content_fa || '', data.content_tr || '', data.content_az || '',
      data.content_ar || '', data.content_zh || '', data.content_es || '',
      data.content_type || 'text'
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Content error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/api/admin/content/:key', requireAuth, (req, res) => {
  try {
    const { key } = req.params;
    const data = req.body;
    
    db.prepare(`
      UPDATE page_content SET
        content_en = ?, content_fa = ?, content_tr = ?, content_az = ?,
        content_ar = ?, content_zh = ?, content_es = ?,
        content_type = ?, updated_at = CURRENT_TIMESTAMP
      WHERE section_key = ?
    `).run(
      data.content_en || '', data.content_fa || '', data.content_tr || '', data.content_az || '',
      data.content_ar || '', data.content_zh || '', data.content_es || '',
      data.content_type || 'text',
      key
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Content update error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Auto-translate content
app.post('/api/admin/content/:key/translate', requireAuth, async (req, res) => {
  try {
    const { key } = req.params;
    const content = db.prepare('SELECT * FROM page_content WHERE section_key = ?').get(key);
    
    if (!content || !content.content_en) {
      return res.status(400).json({ error: 'No English content to translate' });
    }
    
    const languages = ['fa', 'tr', 'az', 'ar', 'zh', 'es'];
    const translations = { content_en: content.content_en };
    
    for (const lang of languages) {
      translations[`content_${lang}`] = await translateText(content.content_en, lang);
      await new Promise(r => setTimeout(r, 100));
    }
    
    db.prepare(`
      UPDATE page_content SET
        content_fa = ?, content_tr = ?, content_az = ?,
        content_ar = ?, content_zh = ?, content_es = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE section_key = ?
    `).run(
      translations.content_fa, translations.content_tr, translations.content_az,
      translations.content_ar, translations.content_zh, translations.content_es,
      key
    );
    
    res.json({ success: true, translations });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
});

// ============================================
// ADMIN API - NAVIGATION
// ============================================

app.get('/api/admin/navigation', requireAuth, (req, res) => {
  try {
    const nav = db.prepare('SELECT * FROM navigation_items ORDER BY display_order').all();
    res.json(nav);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/admin/navigation', requireAuth, (req, res) => {
  try {
    const data = req.body;
    
    const result = db.prepare(`
      INSERT INTO navigation_items (
        nav_key, label_en, label_fa, label_tr, label_az, label_ar, label_zh, label_es,
        href, display_order, is_active, parent_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.nav_key,
      data.label_en || '', data.label_fa || '', data.label_tr || '', data.label_az || '',
      data.label_ar || '', data.label_zh || '', data.label_es || '',
      data.href || '#',
      parseInt(data.display_order) || 0,
      data.is_active === false ? 0 : 1,
      data.parent_id || null
    );
    
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Navigation error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/api/admin/navigation/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    db.prepare(`
      UPDATE navigation_items SET
        nav_key = ?, label_en = ?, label_fa = ?, label_tr = ?, label_az = ?,
        label_ar = ?, label_zh = ?, label_es = ?,
        href = ?, display_order = ?, is_active = ?, parent_id = ?
      WHERE id = ?
    `).run(
      data.nav_key,
      data.label_en || '', data.label_fa || '', data.label_tr || '', data.label_az || '',
      data.label_ar || '', data.label_zh || '', data.label_es || '',
      data.href || '#',
      parseInt(data.display_order) || 0,
      data.is_active === false ? 0 : 1,
      data.parent_id || null,
      id
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Navigation update error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/api/admin/navigation/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM navigation_items WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// ============================================
// ADMIN API - SOCIAL LINKS
// ============================================

app.get('/api/admin/social-links', requireAuth, (req, res) => {
  try {
    const links = db.prepare('SELECT * FROM social_links ORDER BY display_order').all();
    res.json(links);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/admin/social-links', requireAuth, (req, res) => {
  try {
    const data = req.body;
    
    const result = db.prepare(`
      INSERT INTO social_links (platform, url, icon_class, display_order, is_active)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      data.platform,
      data.url,
      data.icon_class || '',
      parseInt(data.display_order) || 0,
      data.is_active === false ? 0 : 1
    );
    
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Social link error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/api/admin/social-links/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    db.prepare(`
      UPDATE social_links SET
        platform = ?, url = ?, icon_class = ?, display_order = ?, is_active = ?
      WHERE id = ?
    `).run(
      data.platform,
      data.url,
      data.icon_class || '',
      parseInt(data.display_order) || 0,
      data.is_active === false ? 0 : 1,
      id
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Social link update error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/api/admin/social-links/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM social_links WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// ============================================
// ADMIN API - PARTNERS
// ============================================

app.get('/api/admin/partners', requireAuth, (req, res) => {
  try {
    const partners = db.prepare('SELECT * FROM partners ORDER BY display_order, created_at').all();
    res.json(partners);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/admin/partners', requireAuth, upload.single('image'), (req, res) => {
  try {
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
  } catch (error) {
    console.error('Partner error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/api/admin/partners/:id', requireAuth, upload.single('image'), (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    let imageUrl = data.image_url;
    if (req.file) {
      imageUrl = '/uploads/' + req.file.filename;
    }
    
    db.prepare(`
      UPDATE partners SET
        name_en = ?, name_fa = ?, name_tr = ?, name_az = ?, name_ar = ?, name_zh = ?, name_es = ?,
        description_en = ?, description_fa = ?, description_tr = ?, description_az = ?, description_ar = ?, description_zh = ?, description_es = ?,
        image_url = COALESCE(?, image_url), website_url = ?, partner_type = ?, display_order = ?, is_active = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      data.name_en || '', data.name_fa || '', data.name_tr || '', data.name_az || '', data.name_ar || '', data.name_zh || '', data.name_es || '',
      data.description_en || '', data.description_fa || '', data.description_tr || '', data.description_az || '', data.description_ar || '', data.description_zh || '', data.description_es || '',
      imageUrl, data.website_url || '', data.partner_type || 'organization', parseInt(data.display_order) || 0, data.is_active === 'false' ? 0 : 1,
      id
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Partner update error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/api/admin/partners/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM partners WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Auto-translate partner
app.post('/api/admin/translate', requireAuth, async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required for translation' });
    }
    
    const translations = await translateToAllLanguages(name, description || '');
    res.json({ success: true, translations });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
});

// ============================================
// ADMIN API - MEMBERSHIPS
// ============================================

app.get('/api/admin/memberships', requireAuth, (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM memberships WHERE 1=1';
    const params = [];
    
    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }
    
    if (search) {
      query += ' AND (full_name LIKE ? OR email LIKE ? OR organization_name LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const memberships = db.prepare(query).all(...params);
    
    let countQuery = 'SELECT COUNT(*) as total FROM memberships WHERE 1=1';
    const countParams = [];
    if (status && status !== 'all') {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }
    if (search) {
      countQuery += ' AND (full_name LIKE ? OR email LIKE ? OR organization_name LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }
    
    const { total } = db.prepare(countQuery).get(...countParams);
    
    res.json({
      memberships,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Memberships error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/api/admin/memberships/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;
    
    db.prepare(`
      UPDATE memberships SET
        status = ?, admin_notes = ?, reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(status, admin_notes || '', req.session.adminId, id);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Membership update error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/api/admin/memberships/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM memberships WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// ============================================
// ADMIN API - FILE UPLOAD
// ============================================

app.post('/api/admin/upload', requireAuth, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ success: true, url: '/uploads/' + req.file.filename });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// List uploaded files
app.get('/api/admin/files', requireAuth, (req, res) => {
  try {
    const files = fs.readdirSync(uploadDir).map(filename => ({
      name: filename,
      url: '/uploads/' + filename,
      size: fs.statSync(path.join(uploadDir, filename)).size
    }));
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: 'Error listing files' });
  }
});

// Delete uploaded file
app.delete('/api/admin/files/:filename', requireAuth, (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(uploadDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting file' });
  }
});

// ============================================
// ADMIN API - DASHBOARD STATS
// ============================================

app.get('/api/admin/stats', requireAuth, (req, res) => {
  try {
    const stats = {
      partners: db.prepare('SELECT COUNT(*) as count FROM partners').get().count,
      activePartners: db.prepare('SELECT COUNT(*) as count FROM partners WHERE is_active = 1').get().count,
      memberships: db.prepare('SELECT COUNT(*) as count FROM memberships').get().count,
      pendingMemberships: db.prepare('SELECT COUNT(*) as count FROM memberships WHERE status = ?').get('pending').count,
      approvedMemberships: db.prepare('SELECT COUNT(*) as count FROM memberships WHERE status = ?').get('approved').count,
      heroImages: db.prepare('SELECT COUNT(*) as count FROM hero_images WHERE is_active = 1').get().count,
      contentSections: db.prepare('SELECT COUNT(*) as count FROM page_content').get().count
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// ============================================
// SEED DATA ENDPOINT (one-time use)
// ============================================

app.post('/api/seed-data', (req, res) => {
  const { secret } = req.body;
  
  // Simple secret to prevent unauthorized seeding
  if (secret !== 'CON-DFR-SEED-2025') {
    return res.status(401).json({ error: 'Invalid seed secret' });
  }
  
  try {
    // Check if data already exists
    const existingPartners = db.prepare('SELECT COUNT(*) as count FROM partners').get();
    const existingHeroes = db.prepare('SELECT COUNT(*) as count FROM hero_images').get();
    
    if (existingPartners.count > 0 || existingHeroes.count > 0) {
      return res.json({ 
        message: 'Data already exists', 
        partners: existingPartners.count, 
        heroes: existingHeroes.count 
      });
    }
    
    // Partner organizations
    const partners = [
      { name_en: 'Hamnava Umbrella Group', name_fa: 'گروه چتری همنوا', partner_type: 'organization', website_url: 'http://hamnava.org', image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/68966f13bc950e2457719d95_Hamnava-p-500.png', description_en: 'Hamnava is an umbrella organization working for democracy in Iran.', description_fa: 'همنوا یک سازمان چتری است که برای دموکراسی در ایران فعالیت می‌کند.' },
      { name_en: 'Dana Research Society', name_fa: 'انجمن پژوهشی دانا', partner_type: 'organization', website_url: 'https://www.danasociety.org/', image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/photo_2026-01-02_19-04-17.jpg', description_en: 'Dana Research Society is dedicated to research and education for a democratic Iran.', description_fa: 'انجمن پژوهشی دانا به تحقیق و آموزش برای ایران دموکراتیک اختصاص دارد.' },
      { name_en: 'Group 25 Shahrivar', name_fa: 'گروه ۲۵ شهریور', partner_type: 'organization', website_url: 'https://group25shahrivar.org/', image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/Mlogo-3.png', description_en: 'Group 25 Shahrivar advocates for democratic change in Iran.', description_fa: 'گروه ۲۵ شهریور برای تغییر دموکراتیک در ایران فعالیت می‌کند.' },
      { name_en: 'Democratic Turkmens of Iran', name_fa: 'ترکمن‌های دموکرات ایران', partner_type: 'organization', website_url: '', image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/photo_2026-01-02_19-04-08.jpg', description_en: 'Democratic Turkmens of Iran represents the Turkmen community in the democratic movement.', description_fa: 'ترکمن‌های دموکرات ایران نماینده جامعه ترکمن در جنبش دموکراتیک است.' },
      { name_en: 'Azerbaijan Democrat Party', name_fa: 'حزب دموکرات آذربایجان', partner_type: 'organization', website_url: 'https://adparty.org/', image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/photo_2026-01-02_19-03-33.jpg', description_en: 'Azerbaijan Democrat Party works for democracy and regional autonomy.', description_fa: 'حزب دموکرات آذربایجان برای دموکراسی و خودمختاری منطقه‌ای فعالیت می‌کند.' },
      { name_en: 'Ahwaz Assembly', name_fa: 'تجمع احواز', partner_type: 'organization', website_url: 'https://ahwaziassembly.org/', image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/photo_2026-01-02_19-03-55.jpg', description_en: 'Ahwaz Assembly represents the Ahwazi Arab community in the democratic movement.', description_fa: 'تجمع احواز نماینده جامعه عرب اهوازی در جنبش دموکراتیک است.' },
      { name_en: 'No to Execution Campaign', name_fa: 'گروه نه به اعدام', partner_type: 'organization', website_url: 'https://linktr.ee/notoexecutioncampaign', image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/NoToExecution.png', description_en: 'No to Execution Campaign advocates against capital punishment in Iran.', description_fa: 'گروه نه به اعدام علیه مجازات اعدام در ایران فعالیت می‌کند.' },
      { name_en: 'Bakhtiari Unity Party', name_fa: 'حزب اتحاد بختیاری', partner_type: 'organization', website_url: 'https://www.instagram.com/etehad_bakhtiari/', image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/photo_2026-01-05_18-44-57-977x1024.jpg', description_en: 'Bakhtiari Unity Party represents the Bakhtiari community in the democratic movement.', description_fa: 'حزب اتحاد بختیاری نماینده جامعه بختیاری در جنبش دموکراتیک است.' },
      { name_en: 'Azerbaijan Democratic Faction', name_fa: 'فرقه دموکرات آذربایجان', partner_type: 'organization', website_url: 'https://adfmk.com/', image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/photo_2026-01-05_18-44-41.jpg', description_en: 'Azerbaijan Democratic Faction works for democracy and rights in Azerbaijan region.', description_fa: 'فرقه دموکرات آذربایجان برای دموکراسی و حقوق در منطقه آذربایجان فعالیت می‌کند.' },
      { name_en: 'Iranian Republicans of Australia (YAR)', name_fa: 'گروه ایرانیان جمهوری خواه استرالیا (یار)', partner_type: 'organization', website_url: 'https://linktr.ee/IAR.Official', image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/Screenshot-2026-01-15-221103.png', description_en: 'Iranian Republicans of Australia supports democratic change in Iran from Australia.', description_fa: 'ایرانیان جمهوری خواه استرالیا از استرالیا از تغییر دموکراتیک در ایران حمایت می‌کند.' },
      { name_en: 'Woman Life Freedom Association Graz', name_fa: 'انجمن زن زندگی آزادی گراتس', partner_type: 'organization', website_url: 'https://woman-life-freedom.at/', image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/WLF-Austria.png', description_en: 'Woman Life Freedom Association Graz supports the women\'s movement in Iran.', description_fa: 'انجمن زن زندگی آزادی گراتس از جنبش زنان در ایران حمایت می‌کند.' },
      { name_en: 'Azerbaijan Democracy and Development Center', name_fa: 'کانون دموکراسی و توسعه آذربایجان', partner_type: 'organization', website_url: 'https://azdemocracy.org/', image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/photo_2026-01-02_19-04-22.jpg', description_en: 'Azerbaijan Democracy and Development Center promotes democracy in the Azerbaijan region.', description_fa: 'کانون دموکراسی و توسعه آذربایجان دموکراسی را در منطقه آذربایجان ترویج می‌کند.' },
      { name_en: 'Iranian Republicans Convergence', name_fa: 'همگرایی جمهوری خواهان ایران', partner_type: 'organization', website_url: 'https://www.instagram.com/hamgerayeejomhoori/', image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/Hamgerayi.png', description_en: 'Iranian Republicans Convergence brings together republican forces for a democratic Iran.', description_fa: 'همگرایی جمهوری خواهان ایران نیروهای جمهوری‌خواه را برای ایران دموکراتیک گرد هم می‌آورد.' },
      { name_en: 'Toronto Iranian Republicans Association (TIRA)', name_fa: 'انجمن ایرانیان جمهوری خواه تورنتو', partner_type: 'organization', website_url: 'https://www.instagram.com/tira4iran', image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/TIRA-1003x1024.png', description_en: 'Toronto Iranian Republicans Association supports democratic change from Canada.', description_fa: 'انجمن ایرانیان جمهوری خواه تورنتو از کانادا از تغییر دموکراتیک حمایت می‌کند.' },
      { name_en: 'United for Iran Australia', name_fa: 'اتحاد برای ایران استرالیا', partner_type: 'organization', website_url: 'https://www.instagram.com/unitedforiranaustralia/', image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/434641411_356248903413056_4836227175912321910_n.jpg', description_en: 'United for Iran Australia advocates for human rights and democracy in Iran.', description_fa: 'اتحاد برای ایران استرالیا برای حقوق بشر و دموکراسی در ایران فعالیت می‌کند.' },
      { name_en: 'Iranian Republicans of Southern Sweden', name_fa: 'کانون ایرانیان جمهوری خواه جنوب سوئد', partner_type: 'organization', website_url: 'https://linktr.ee/Iranian.republicans.sweden', image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/Prorepublicans-1024x1024.png', description_en: 'Iranian Republicans of Southern Sweden supports democratic change from Sweden.', description_fa: 'کانون ایرانیان جمهوری خواه جنوب سوئد از سوئد از تغییر دموکراتیک حمایت می‌کند.' },
      { name_en: 'Rahe Farda Group', name_fa: 'گروه راه فردا', partner_type: 'organization', website_url: 'https://www.instagram.com/rahefarda.group/', image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/Rahe-Farda.png', description_en: 'Rahe Farda Group works for a democratic future for Iran.', description_fa: 'گروه راه فردا برای آینده دموکراتیک ایران فعالیت می‌کند.' },
      { name_en: 'Iran Democratic Left Party', name_fa: 'حزب دموکرات چپ ایران', partner_type: 'organization', website_url: 'https://www.bepish.org/fa', image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/6199645014309145353-1024x1024.jpg', description_en: 'Iran Democratic Left Party advocates for social democracy in Iran.', description_fa: 'حزب دموکرات چپ ایران برای سوسیال دموکراسی در ایران فعالیت می‌کند.' },
      { name_en: 'Mahsa Foundation', name_fa: 'گروه بنیاد مهسا', partner_type: 'organization', website_url: 'https://linktr.ee/mahsafoundation', image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/Mahsa.png', description_en: 'Mahsa Foundation honors the memory of Mahsa Amini and supports the women\'s movement.', description_fa: 'بنیاد مهسا یاد مهسا امینی را گرامی می‌دارد و از جنبش زنان حمایت می‌کند.' },
      { name_en: 'Hassan Shariatmadari', name_fa: 'حسن شریعتمداری', partner_type: 'individual', website_url: '', image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/openart-image_db9xIKps_1766540652029_raw-1024x1024.jpg', description_en: 'Republican and Federalist Politician - Germany', description_fa: 'سیاستمدار جمهوریخواه و فدرالیست - آلمان' },
      { name_en: 'Reza Moridi', name_fa: 'رضا مریدی', partner_type: 'individual', website_url: '', image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/openart-image_db9xIKps_1766540652029_raw-1024x1024.jpg', description_en: 'Republican and Federalist Politician - Canada', description_fa: 'سیاستمدار جمهوریخواه و فدرالیست - کانادا' },
      { name_en: 'Alan Ekbatani', name_fa: 'آلن اکباتانی', partner_type: 'individual', website_url: '', image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/openart-image_db9xIKps_1766540652029_raw-1024x1024.jpg', description_en: 'Independent Activist and Researcher - USA', description_fa: 'کنشگر و پژوهشگر مستقل - آمریکا' },
      { name_en: 'Mehdi Ansari', name_fa: 'مهدی انصاری', partner_type: 'individual', website_url: '', image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/openart-image_db9xIKps_1766540652029_raw-1024x1024.jpg', description_en: 'Political Activist and Federal Republican - Germany', description_fa: 'فعال سیاسی و جمهوری‌خواه فدرال - آلمان' }
    ];
    
    // Hero images
    const heroImages = [
      { image_url: '/images/hero/hero1.png', title_en: 'Congress of Democratic & Federalist Republicans', title_fa: 'کنگره مشترک جمهوری خواهان دموکرات و فدرال دموکرات', subtitle_en: 'For freedom, justice, equality, and the distribution of power in the future of Iran', subtitle_fa: 'برای آزادی، عدالت، برابری شهروندی و توزیع قدرت در ایران آینده', display_order: 1 },
      { image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/ap22295557118668-f885dccf941fcda7f93c9bde311371fff5b7e73d.jpg', title_en: 'United for Democracy', title_fa: 'متحد برای دموکراسی', subtitle_en: 'Organizations and individuals working together for a democratic Iran', subtitle_fa: 'سازمان‌ها و افراد در کنار هم برای ایران دموکراتیک', display_order: 2 }
    ];
    
    // Insert partners
    const insertPartner = db.prepare(`
      INSERT INTO partners (name_en, name_fa, partner_type, website_url, image_url, description_en, description_fa, is_active, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)
    `);
    
    partners.forEach((p, i) => {
      insertPartner.run(p.name_en, p.name_fa, p.partner_type, p.website_url, p.image_url, p.description_en, p.description_fa, i + 1);
    });
    
    // Insert hero images
    const insertHero = db.prepare(`
      INSERT INTO hero_images (image_url, title_en, title_fa, subtitle_en, subtitle_fa, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `);
    
    heroImages.forEach(h => {
      insertHero.run(h.image_url, h.title_en, h.title_fa, h.subtitle_en, h.subtitle_fa, h.display_order);
    });
    
    res.json({ 
      success: true, 
      message: 'Data seeded successfully',
      partners: partners.length,
      heroes: heroImages.length
    });
  } catch (err) {
    console.error('Seed error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🔧 Admin: http://localhost:${PORT}/admin.html`);
});