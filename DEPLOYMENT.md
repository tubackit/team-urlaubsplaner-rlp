# 🚀 Deployment Guide - Team Urlaubsplaner

## 📋 Übersicht

Dieser Guide erklärt, wie Sie den Team Urlaubsplaner für 10+ Mitarbeiter mit Echtzeit-Synchronisation deployen.

## 🏗️ Architektur

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (SQLite)      │
│   Port: 3000    │    │   Port: 3001    │    │   File-based    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         └───────────────────────┼─────────────────────────────┐
                                 │                             │
                    ┌─────────────────┐              ┌─────────────────┐
                    │   Nginx         │              │   Socket.IO     │
                    │   Load Balancer │              │   Real-time     │
                    │   Port: 80/443  │              │   Sync          │
                    └─────────────────┘              └─────────────────┘
```

## 🛠️ Lokale Entwicklung

### 1. Backend starten
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend starten
```bash
npm install
npm run dev
```

### 3. URLs
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:3001
- **API Health:** http://localhost:3001/api/health

## 🐳 Docker Deployment

### 1. Lokaler Test
```bash
# Alle Services starten
docker-compose -f docker-compose.production.yml up -d

# Logs anzeigen
docker-compose -f docker-compose.production.yml logs -f

# Services stoppen
docker-compose -f docker-compose.production.yml down
```

### 2. Production Server
```bash
# Repository klonen
git clone https://github.com/your-username/team-urlaubsplaner-rlp.git
cd team-urlaubsplaner-rlp

# Environment Variables setzen
cp .env.example .env.production
# .env.production bearbeiten

# Services starten
docker-compose -f docker-compose.production.yml up -d
```

## ☁️ Cloud Deployment

### Option 1: Vercel + Railway
```bash
# Frontend auf Vercel
npx vercel --prod

# Backend auf Railway
railway login
railway deploy
```

### Option 2: DigitalOcean App Platform
1. Repository mit GitHub verbinden
2. App Platform konfigurieren
3. Environment Variables setzen
4. Automatisches Deployment aktivieren

### Option 3: AWS/GCP/Azure
- **Frontend:** S3 + CloudFront (AWS) / Cloud Storage (GCP)
- **Backend:** ECS/Fargate (AWS) / Cloud Run (GCP)
- **Database:** RDS (AWS) / Cloud SQL (GCP)

## 🔧 Konfiguration

### Environment Variables

#### Frontend (.env)
```env
VITE_BACKEND_URL=https://your-backend-domain.com
VITE_APP_NAME=Team Urlaubsplaner
```

#### Backend (.env)
```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-frontend-domain.com
DATABASE_URL=./vacation_planner.db
```

### GitHub Secrets (für CI/CD)
```
DOCKER_USERNAME=your-dockerhub-username
DOCKER_PASSWORD=your-dockerhub-password
SERVER_HOST=your-server-ip
SERVER_USERNAME=your-server-user
SERVER_SSH_KEY=your-private-ssh-key
```

## 📊 Monitoring & Wartung

### Health Checks
```bash
# Backend Health
curl https://your-domain.com/api/health

# Frontend Status
curl https://your-domain.com/
```

### Logs
```bash
# Docker Logs
docker-compose -f docker-compose.production.yml logs -f

# Backend Logs
docker-compose -f docker-compose.production.yml logs -f backend

# Nginx Logs
docker-compose -f docker-compose.production.yml logs -f nginx
```

### Database Backup
```bash
# SQLite Backup
docker-compose -f docker-compose.production.yml exec backend cp /app/vacation_planner.db /app/data/backup-$(date +%Y%m%d).db
```

## 🔒 Sicherheit

### SSL/TLS
```bash
# Let's Encrypt mit Certbot
certbot --nginx -d your-domain.com
```

### Firewall
```bash
# Nur notwendige Ports öffnen
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw enable
```

### Rate Limiting
- **API:** 10 requests/second
- **General:** 30 requests/second
- **WebSocket:** Verbindung pro IP

## 📈 Skalierung

### Für 10+ Mitarbeiter
- **CPU:** 2+ Cores
- **RAM:** 4+ GB
- **Storage:** 20+ GB SSD
- **Bandwidth:** 100+ Mbps

### Load Balancing
```nginx
upstream backend {
    server backend1:3001;
    server backend2:3001;
    server backend3:3001;
}
```

## 🚨 Troubleshooting

### Häufige Probleme

#### 1. Socket.IO Verbindung fehlschlägt
```bash
# Firewall prüfen
ufw status
# Port 3001 freigeben
ufw allow 3001
```

#### 2. Database Lock
```bash
# SQLite Lock entfernen
docker-compose -f docker-compose.production.yml exec backend rm -f /app/vacation_planner.db-wal
```

#### 3. Memory Issues
```bash
# Container Restart
docker-compose -f docker-compose.production.yml restart backend
```

### Performance Monitoring
```bash
# Container Stats
docker stats

# Resource Usage
htop
```

## 📞 Support

Bei Problemen:
1. **Logs prüfen:** `docker-compose logs -f`
2. **Health Check:** `/api/health`
3. **GitHub Issues:** Repository Issues erstellen
4. **Documentation:** README.md und CONTRIBUTING.md

## 🎯 Nächste Schritte

1. **Repository auf GitHub erstellen**
2. **Secrets konfigurieren**
3. **Server vorbereiten**
4. **Deployment ausführen**
5. **Team einladen**

**Viel Erfolg mit Ihrem Team Urlaubsplaner! 🎉**