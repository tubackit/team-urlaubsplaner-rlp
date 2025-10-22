# 🚀 Deployment Guide

Dieses Dokument beschreibt verschiedene Deployment-Optionen für den Team Urlaubsplaner RLP.

## 📋 Voraussetzungen

- Node.js 18+
- npm oder yarn
- Git
- (Optional) Docker für Container-Deployment

## 🏗️ Build Process

### Lokaler Build

```bash
# Dependencies installieren
npm install

# Production Build erstellen
npm run build

# Build testen
npm run preview
```

### Build Output

Der Build-Prozess erstellt einen `dist/` Ordner mit:

- Optimierte JavaScript/CSS Dateien
- Statische Assets
- HTML-Dateien

## 🌐 Deployment Optionen

### 1. Vercel (Empfohlen)

**Vorteile:**

- ✅ Automatisches Deployment
- ✅ CDN Integration
- ✅ HTTPS out-of-the-box
- ✅ Environment Variables Support

**Setup:**

1. Vercel Account erstellen
2. GitHub Repository verbinden
3. Environment Variables setzen:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
4. Deploy

**Vercel CLI:**

```bash
npm i -g vercel
vercel login
vercel --prod
```

### 2. Netlify

**Vorteile:**

- ✅ Drag & Drop Deployment
- ✅ Form Handling
- ✅ Serverless Functions

**Setup:**

1. Netlify Account erstellen
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Environment Variables setzen
4. Deploy

**Netlify CLI:**

```bash
npm i -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

### 3. GitHub Pages

**Setup:**

1. Repository Settings → Pages
2. Source: GitHub Actions
3. Workflow erstellen (siehe `.github/workflows/deploy.yml`)

### 4. Docker Deployment

**Build Image:**

```bash
docker build -t team-urlaubsplaner-rlp .
```

**Run Container:**

```bash
docker run -p 3000:80 team-urlaubsplaner-rlp
```

**Docker Compose:**

```bash
docker-compose up -d
```

### 5. Traditional Web Server

**Nginx Configuration:**

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/team-urlaubsplaner-rlp/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Apache Configuration:**

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/team-urlaubsplaner-rlp/dist

    <Directory /var/www/team-urlaubsplaner-rlp/dist>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

## 🔧 Environment Variables

### Development

```env
GEMINI_API_KEY=your_development_key
NODE_ENV=development
```

### Production

```env
GEMINI_API_KEY=your_production_key
NODE_ENV=production
```

## 📊 Performance Optimierung

### Build Optimierungen

- ✅ Code Splitting
- ✅ Tree Shaking
- ✅ Minification
- ✅ Gzip Compression

### CDN Integration

```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ai: ['@google/genai'],
        },
      },
    },
  },
});
```

## 🔒 Security

### HTTPS Setup

```bash
# Let's Encrypt mit Certbot
sudo certbot --nginx -d your-domain.com
```

### Security Headers

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
```

## 📈 Monitoring

### Analytics Integration

```javascript
// Google Analytics
gtag('config', 'GA_MEASUREMENT_ID');
```

### Error Tracking

```javascript
// Sentry Integration
import * as Sentry from '@sentry/react';
Sentry.init({ dsn: 'YOUR_SENTRY_DSN' });
```

## 🚨 Troubleshooting

### Häufige Probleme

**Build Fehler:**

```bash
# Cache leeren
rm -rf node_modules package-lock.json
npm install
```

**Environment Variables:**

```bash
# Überprüfen ob Variablen gesetzt sind
echo $GEMINI_API_KEY
```

**Port Konflikte:**

```bash
# Anderen Port verwenden
npm run preview -- --port 4173
```

## 📚 Weitere Ressourcen

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Deployment](https://create-react-app.dev/docs/deployment/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

**Happy Deploying! 🚀**
