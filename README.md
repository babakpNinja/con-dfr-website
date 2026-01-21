# CON-DFR Website

**Congress of Democratic & Federalist Republicans** - A modernized multilingual website for the political activist organization.

## Features

### Public Website
- 🌐 **7 Languages**: English, Farsi (RTL), Turkish, Azerbaijani, Arabic (RTL), Chinese, Spanish
- 📱 **Fully Responsive**: Mobile-friendly design
- 🎨 **Modern UI**: Clean, professional design with animations
- 👥 **Partner Directory**: Clickable partner cards with detail lightbox
- 📝 **Membership Application**: Multi-step form for new members

### Admin Panel
- 🔐 **Secure Authentication**: Bcrypt password hashing, rate limiting
- 👥 **Partner Management**: Full CRUD with image upload
- 🌍 **Auto-Translation**: Automatically translate content to all 7 languages
- 📋 **Membership Management**: Review, approve/reject applications
- 🔍 **Global Search**: Search across all data
- 📊 **Statistics Dashboard**: Track membership applications

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite (better-sqlite3)
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Security**: bcryptjs, express-session, rate limiting

## Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm start

# Access the website
open http://localhost:3000

# Access admin panel
open http://localhost:3000/admin.html
```

## Default Admin Credentials

- **Username**: `admin`
- **Password**: `Congress@2025!Secure`

⚠️ **Important**: Change the default password after first login!

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `SESSION_SECRET` | Session encryption key | Auto-generated |
| `NODE_ENV` | Environment mode | development |

## Deployment

### Railway
```bash
railway login
railway init
railway up
```

### Render
Connect your GitHub repo and Render will auto-detect the configuration from `render.yaml`.

### Docker
```bash
docker build -t con-dfr-website .
docker run -p 3000:3000 con-dfr-website
```

## Project Structure

```
con-dfr-website/
├── public/
│   ├── css/styles.css      # Main stylesheet
│   ├── js/
│   │   ├── main.js         # Frontend JavaScript
│   │   └── translations.js # All language translations
│   ├── index.html          # Main website
│   ├── admin.html          # Admin panel
│   └── membership.html     # Membership form
├── data/
│   └── congress.db         # SQLite database
├── server-v2.js            # Main server file
├── package.json
└── README.md
```

## API Endpoints

### Public
- `GET /api/partners` - List all active partners
- `GET /api/partners/:id` - Get partner details
- `GET /api/partners/type/:type` - Filter by type
- `POST /api/membership` - Submit membership application

### Admin (requires authentication)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/partners` - List all partners
- `POST /api/admin/partners` - Create partner
- `PUT /api/admin/partners/:id` - Update partner
- `DELETE /api/admin/partners/:id` - Delete partner
- `POST /api/admin/translate` - Auto-translate text
- `GET /api/admin/memberships` - List applications
- `PATCH /api/admin/memberships/:id/status` - Update status

## License

© 2025 Congress of Democratic & Federalist Republicans. All rights reserved.# Build trigger: Wed Jan 21 19:55:03 UTC 2026
