# Congress of Democratic & Federalist Republicans (CON-DFR) Website

## 🌐 Official Website for CON-DFR

**For freedom, justice, equality, and the distribution of power in the future of Iran**

کنگره جمهوری‌خواهان دموکرات و فدرالیست

---

## 📋 Overview

This is the official website for the Congress of Democratic & Federalist Republicans (CON-DFR), a coalition of political organizations, civil society groups, and individuals committed to establishing a democratic, federal, and secular republic in Iran.

### Key Features
- 🌍 **Multi-language Support**: English, Persian (فارسی), Turkish, Azerbaijani, Arabic, Chinese, Spanish
- 📱 **Responsive Design**: Optimized for all devices
- 🔒 **Secure Admin Panel**: Full CMS capabilities
- 👥 **Partner Management**: Showcase organizations and individuals
- 📝 **Statement Publishing**: Official declarations and news
- 🤝 **Membership System**: Online application processing
- 🎨 **Ethnic Groups Showcase**: Celebrating Iran's diversity
- 🔍 **SEO Optimized**: Full meta tags, structured data, sitemap

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Installation

```bash
# Clone or extract the repository
cd con-dfr-website

# Install dependencies
npm install

# Start the server
npm start
```

The website will be available at `http://localhost:3000`

### Default Admin Credentials
- **URL**: http://localhost:3000/admin.html
- **Username**: admin
- **Password**: congress2025

⚠️ **Important**: Change the default password immediately after first login!

---

## 📁 Project Structure

```
con-dfr-website/
├── data/
│   └── congress.db              # SQLite database
├── public/
│   ├── css/
│   │   └── styles.css           # Main stylesheet
│   ├── js/
│   │   ├── main.js              # Main JavaScript
│   │   └── translations.js      # Multi-language translations
│   ├── images/
│   │   ├── hero/                # Hero carousel images
│   │   └── ethnic-*.jpg         # Ethnic group images
│   ├── uploads/                 # User uploaded files
│   ├── index.html               # Homepage
│   ├── about.html               # About page
│   ├── membership.html          # Membership application
│   ├── statement.html           # Statements page
│   ├── admin.html               # Admin panel
│   ├── robots.txt               # Search engine directives
│   ├── sitemap.xml              # XML sitemap
│   └── .htaccess                # Apache configuration
├── server-v3.js                 # Express.js server
├── package.json                 # Node.js dependencies
├── DEPLOYMENT-GODADDY.md        # GoDaddy deployment guide
└── README.md                    # This file
```

---

## 🌐 Pages

| Page | URL | Description |
|------|-----|-------------|
| Homepage | `/` | Main landing page with hero, about, partners, statements |
| About | `/about.html` | Detailed information about CON-DFR |
| Membership | `/membership.html` | Join the congress application form |
| Statements | `/statement.html` | Official statements and declarations |
| Admin | `/admin.html` | Content management system |

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=production
SESSION_SECRET=your-secure-random-string-minimum-32-characters
```

### Database

The website uses SQLite for data storage. The database file is located at `data/congress.db`.

**Tables:**
- `admin` - Administrator accounts
- `partners` - Partner organizations and individuals
- `hero_images` - Hero carousel images
- `page_content` - CMS content sections
- `memberships` - Membership applications
- `site_settings` - Site configuration
- `ethnic_groups` - Ethnic groups of Iran

---

## 🌍 Multi-Language Support

The website supports 7 languages:

| Code | Language | Direction |
|------|----------|-----------|
| en | English | LTR |
| fa | فارسی (Persian) | RTL |
| tr | Türkçe (Turkish) | LTR |
| az | Azərbaycan (Azerbaijani) | LTR |
| ar | العربية (Arabic) | RTL |
| zh | 中文 (Chinese) | LTR |
| es | Español (Spanish) | LTR |

Translations are stored in `/public/js/translations.js`

---

## 🔍 SEO Features

### Implemented SEO Elements
- ✅ Meta titles and descriptions
- ✅ Open Graph tags (Facebook, LinkedIn)
- ✅ Twitter Card tags
- ✅ Schema.org structured data (JSON-LD)
- ✅ Canonical URLs
- ✅ Hreflang tags for multi-language
- ✅ XML Sitemap
- ✅ Robots.txt
- ✅ Mobile-friendly responsive design
- ✅ Fast loading with compression

### Target Keywords
- Congress of Democratic & Federalist Republicans
- CON-DFR
- con-dfr.org
- For freedom, justice, equality, and the distribution of power in the future of Iran
- کنگره جمهوری‌خواهان دموکرات و فدرالیست

---

## 🚀 Deployment

### Option 1: Railway (Current)
The site is deployed on Railway with automatic deployments from GitHub.

### Option 2: GoDaddy
See `DEPLOYMENT-GODADDY.md` for detailed instructions.

### Option 3: Any Node.js Host
```bash
# Production start
NODE_ENV=production npm start

# With PM2 (recommended)
pm2 start server-v3.js --name "con-dfr"
```

---

## 🔒 Security

### Implemented Security Features
- Password hashing with bcrypt (12 rounds)
- Session-based authentication
- Rate limiting on login attempts
- CSRF protection
- XSS prevention headers
- SQL injection prevention (parameterized queries)
- File upload validation

### Security Recommendations
1. Change default admin password
2. Use HTTPS in production
3. Set strong SESSION_SECRET
4. Regular database backups
5. Keep dependencies updated

---

## 📞 API Endpoints

### Public Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/partners` | Get all active partners |
| GET | `/api/hero-images` | Get hero carousel images |
| GET | `/api/ethnic-groups` | Get ethnic groups |
| GET | `/api/content/:key` | Get page content |
| POST | `/api/membership` | Submit membership application |
| POST | `/api/contact` | Submit contact form |

### Admin Endpoints (Authenticated)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login` | Admin login |
| POST | `/api/logout` | Admin logout |
| GET | `/api/admin/partners` | Get all partners |
| POST | `/api/admin/partners` | Create partner |
| PUT | `/api/admin/partners/:id` | Update partner |
| DELETE | `/api/admin/partners/:id` | Delete partner |
| ... | ... | (See server-v3.js for full list) |

---

## 🛠️ Development

### Running in Development Mode
```bash
npm run dev
```

### Building for Production
```bash
# No build step required - Node.js serves files directly
npm start
```

### Testing
```bash
# Test API endpoints
curl http://localhost:3000/api/partners
curl http://localhost:3000/api/ethnic-groups
```

---

## 📄 License

© 2025 Congress of Democratic & Federalist Republicans. All rights reserved.

---

## 📧 Contact

- **Website**: https://con-dfr.org
- **Email**: info@con-dfr.org
- **Twitter/X**: [@con_dem_fed_rep](https://x.com/con_dem_fed_rep/)
- **Instagram**: [@con_dem_fed_rep](https://www.instagram.com/con_dem_fed_rep/)
- **Telegram**: [t.me/con_dfr](https://t.me/con_dfr)
- **YouTube**: [@Con_Dem_Fed_Rep](https://www.youtube.com/@Con_Dem_Fed_Rep)

---

## 🙏 Acknowledgments

Built with:
- [Express.js](https://expressjs.com/) - Web framework
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) - SQLite database
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) - Password hashing
- [multer](https://github.com/expressjs/multer) - File uploads

---

**For freedom, justice, equality, and the distribution of power in the future of Iran** 🇮🇷

برای آزادی، عدالت، برابری و توزیع قدرت در آینده ایران