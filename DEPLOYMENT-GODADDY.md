# CON-DFR Website Deployment Guide for GoDaddy

## Overview
This guide provides step-by-step instructions for deploying the Congress of Democratic & Federalist Republicans (CON-DFR) website to GoDaddy hosting.

## Hosting Options

### Option 1: GoDaddy VPS or Dedicated Server (Recommended for Node.js)
Best for full Node.js support with SQLite database.

### Option 2: GoDaddy cPanel Shared Hosting with Node.js Support
Some GoDaddy plans include Node.js support via cPanel.

### Option 3: Static Export (For Basic Shared Hosting)
If your GoDaddy plan doesn't support Node.js, you can use the static version.

---

## Option 1: VPS/Dedicated Server Deployment

### Prerequisites
- GoDaddy VPS or Dedicated Server with SSH access
- Node.js 18+ installed
- PM2 process manager (recommended)

### Step 1: Connect via SSH
```bash
ssh username@your-server-ip
```

### Step 2: Install Node.js (if not installed)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 3: Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### Step 4: Upload Files
Upload the entire `con-dfr-website` folder to your server using SFTP or SCP:
```bash
scp -r con-dfr-website username@your-server-ip:/var/www/
```

### Step 5: Install Dependencies
```bash
cd /var/www/con-dfr-website
npm install --production
```

### Step 6: Set Environment Variables
Create a `.env` file:
```bash
nano .env
```
Add:
```
PORT=3000
NODE_ENV=production
SESSION_SECRET=your-secure-random-string-here
```

### Step 7: Start the Application with PM2
```bash
pm2 start server-v3.js --name "con-dfr"
pm2 save
pm2 startup
```

### Step 8: Configure Nginx as Reverse Proxy
```bash
sudo nano /etc/nginx/sites-available/con-dfr
```
Add:
```nginx
server {
    listen 80;
    server_name con-dfr.org www.con-dfr.org;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/con-dfr /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 9: Set Up SSL with Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d con-dfr.org -d www.con-dfr.org
```

---

## Option 2: cPanel with Node.js Support

### Step 1: Log into cPanel
Access your GoDaddy cPanel at: `https://yourdomain.com/cpanel`

### Step 2: Check for Node.js Support
Look for "Setup Node.js App" in cPanel. If available:

1. Click "Setup Node.js App"
2. Click "Create Application"
3. Configure:
   - Node.js version: 18.x or higher
   - Application mode: Production
   - Application root: `con-dfr-website`
   - Application URL: Your domain
   - Application startup file: `server-v3.js`

### Step 3: Upload Files via File Manager
1. Open File Manager in cPanel
2. Navigate to `public_html` or your app directory
3. Upload the `con-dfr-website.zip` file
4. Extract the contents

### Step 4: Install Dependencies
In the Node.js app interface, click "Run NPM Install"

### Step 5: Start the Application
Click "Start App" in the Node.js interface

---

## Option 3: Static Hosting (No Node.js Required)

If your GoDaddy plan doesn't support Node.js, you can host the static files only.
Note: This will NOT include the admin panel or dynamic features.

### Step 1: Upload Static Files
Upload only the contents of the `public` folder to your `public_html` directory:
- index.html
- about.html
- membership.html
- statement.html
- css/ folder
- js/ folder
- images/ folder
- robots.txt
- sitemap.xml

### Step 2: Configure .htaccess
Create a `.htaccess` file in `public_html`:
```apache
# Enable Rewrite Engine
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Remove .html extension
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^([^\.]+)$ $1.html [NC,L]

# Custom error pages
ErrorDocument 404 /index.html

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css application/javascript application/json
</IfModule>

# Browser caching
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

---

## Database Backup & Restore

### Backup the SQLite Database
The database is located at `data/congress.db`. To backup:
```bash
cp data/congress.db data/congress_backup_$(date +%Y%m%d).db
```

### Restore Database
```bash
cp data/congress_backup_YYYYMMDD.db data/congress.db
```

---

## Domain Configuration

### Point Domain to GoDaddy Hosting
1. Log into GoDaddy Domain Manager
2. Go to DNS Settings
3. Update A Record to point to your server IP
4. Add CNAME for www subdomain

### DNS Records Example
```
Type    Name    Value               TTL
A       @       YOUR_SERVER_IP      600
CNAME   www     @                   600
```

---

## SSL Certificate

### Using GoDaddy SSL
1. Purchase SSL certificate from GoDaddy
2. Install via cPanel > SSL/TLS
3. Or use Let's Encrypt (free) with certbot

---

## Troubleshooting

### Application Won't Start
1. Check Node.js version: `node -v` (should be 18+)
2. Check logs: `pm2 logs con-dfr`
3. Verify all dependencies: `npm install`

### Database Errors
1. Ensure `data` directory exists and is writable
2. Check file permissions: `chmod 755 data && chmod 644 data/congress.db`

### 502 Bad Gateway
1. Check if Node.js app is running: `pm2 status`
2. Verify Nginx configuration: `sudo nginx -t`
3. Check port conflicts

### Permission Issues
```bash
sudo chown -R www-data:www-data /var/www/con-dfr-website
sudo chmod -R 755 /var/www/con-dfr-website
```

---

## File Structure
```
con-dfr-website/
├── data/
│   └── congress.db          # SQLite database
├── public/
│   ├── css/
│   ├── js/
│   ├── images/
│   ├── uploads/
│   ├── index.html
│   ├── about.html
│   ├── membership.html
│   ├── statement.html
│   ├── admin.html
│   ├── robots.txt
│   └── sitemap.xml
├── server-v3.js             # Main server file
├── package.json
├── .env                     # Environment variables (create this)
└── README.md
```

---

## Support

For technical support:
- Email: info@con-dfr.org
- Website: https://con-dfr.org

---

## Security Recommendations

1. **Change default admin password** immediately after deployment
2. **Use strong SESSION_SECRET** in environment variables
3. **Enable HTTPS** with SSL certificate
4. **Regular backups** of the database
5. **Keep Node.js updated** for security patches
6. **Monitor logs** for suspicious activity

---

Last Updated: January 2025