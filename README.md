# 🏖️ Team Urlaubsplaner RLP

Ein **Echtzeit-Kollaborations-Tool** für Teams in Rheinland-Pfalz mit **10+ Mitarbeiter-Support** und **automatischer Synchronisation**.

## ✨ Features

### 🎯 Kernfunktionen
- **📅 Kalender-Ansicht** mit Monatsnavigation
- **👥 Mitarbeiterverwaltung** mit Abteilungen
- **🏖️ Urlaubstypen** (Urlaub, Überstundenfrei, Krank)
- **🎯 Feiertage & Schulferien** für Rheinland-Pfalz

### 🔄 Echtzeit-Kollaboration
- **⚡ Live-Synchronisation** zwischen allen Benutzern
- **👥 Multi-User Support** für 10+ Mitarbeiter
- **💾 Automatische Speicherung** in Datenbank
- **🔄 Echtzeit-Updates** ohne Seitenreload
- **👤 Benutzer-Aktivität** Anzeige

### 🛠️ Technische Features
- **🌙 Dark Mode** Support
- **📱 Responsive Design** für alle Geräte
- **♿ Barrierefreiheit** mit ARIA-Labels
- **⚡ Performance** optimiert
- **🔒 Sicherheit** mit Rate Limiting
- **📊 Monitoring** und Health Checks

## 🚀 Quick Start

### Lokale Entwicklung

```bash
# Repository klonen
git clone https://github.com/your-username/team-urlaubsplaner-rlp.git
cd team-urlaubsplaner-rlp

# Frontend starten
npm install
npm run dev

# Backend starten (neues Terminal)
cd backend
npm install
npm run dev
```

**URLs:**
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:3001
- **API Health:** http://localhost:3001/api/health

### Docker Deployment

```bash
# Alle Services starten
docker-compose -f docker-compose.production.yml up -d

# Logs anzeigen
docker-compose -f docker-compose.production.yml logs -f
```

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

## 🛠️ Technologie Stack

### Frontend
- **React 19.2.0** + TypeScript
- **Vite 6.2.0** Build Tool
- **TailwindCSS** Styling
- **Socket.IO Client** für Echtzeit

### Backend
- **Node.js 20** + Express
- **Socket.IO** für WebSockets
- **SQLite** Datenbank
- **Rate Limiting** & Security

### DevOps
- **Docker** Containerization
- **GitHub Actions** CI/CD
- **Nginx** Load Balancer
- **SSL/TLS** Support

## 📁 Projektstruktur

```
team-urlaubsplaner-rlp/
├── src/                          # Frontend
│   ├── components/               # React Components
│   ├── hooks/                    # Custom Hooks
│   ├── services/                 # API Services
│   └── utils/                    # Utilities
├── backend/                      # Backend
│   ├── server.js                 # Express Server
│   ├── database.js               # SQLite Database
│   └── package.json              # Backend Dependencies
├── .github/workflows/             # CI/CD Pipelines
├── docker-compose.production.yml # Production Setup
└── nginx.production.conf         # Load Balancer Config
```

## 🔧 Konfiguration

### Environment Variables

#### Frontend (.env)
```env
VITE_BACKEND_URL=http://localhost:3001
VITE_APP_NAME=Team Urlaubsplaner
```

#### Backend (.env)
```env
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
DATABASE_URL=./vacation_planner.db
```

## 🚀 Deployment

### Option 1: Docker (Empfohlen)
```bash
# Production Deployment
docker-compose -f docker-compose.production.yml up -d
```

### Option 2: Cloud Platforms
- **Vercel** (Frontend) + **Railway** (Backend)
- **DigitalOcean** App Platform
- **AWS** ECS + RDS
- **Google Cloud** Run + SQL

### Option 3: VPS Server
```bash
# Server Setup
git clone https://github.com/your-username/team-urlaubsplaner-rlp.git
cd team-urlaubsplaner-rlp
docker-compose -f docker-compose.production.yml up -d
```

## 📊 Monitoring

### Health Checks
```bash
# Backend Health
curl http://localhost:3001/api/health

# Frontend Status
curl http://localhost:3000/
```

### Logs
```bash
# Docker Logs
docker-compose -f docker-compose.production.yml logs -f

# Backend Logs
docker-compose -f docker-compose.production.yml logs -f backend
```

## 🔒 Sicherheit

- **Rate Limiting:** 10 req/s API, 30 req/s General
- **CORS:** Konfiguriert für Frontend
- **Helmet:** Security Headers
- **SQLite:** File-based, keine externen Dependencies
- **SSL/TLS:** Nginx Reverse Proxy

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

## 🧪 Testing

```bash
# Frontend Tests
npm test

# Backend Tests
cd backend && npm test

# E2E Tests
npm run test:e2e
```

## 🤝 Contributing

1. **Fork** das Repository
2. **Feature Branch** erstellen (`git checkout -b feature/amazing-feature`)
3. **Changes committen** (`git commit -m 'Add amazing feature'`)
4. **Branch pushen** (`git push origin feature/amazing-feature`)
5. **Pull Request** erstellen

## 📝 Lizenz

MIT License - siehe [LICENSE](LICENSE) für Details.

## 🆘 Support

Bei Problemen:
1. **GitHub Issues** erstellen
2. **Documentation** prüfen
3. **Logs** analysieren
4. **Community** fragen

## 🗺️ Roadmap

- [x] **Echtzeit-Synchronisation** ✅
- [x] **Multi-User Support** ✅
- [x] **Docker Deployment** ✅
- [ ] **Export-Funktionen** (PDF/Excel)
- [ ] **PWA Support** für Offline-Nutzung
- [ ] **Mobile App** (React Native)
- [ ] **Advanced Analytics**
- [ ] **Integration** mit HR-Systemen

---

<div align="center">
  <strong>Entwickelt mit ❤️ für Teams in Rheinland-Pfalz</strong>
  <br>
  <em>Echtzeit-Kollaboration für moderne Teams</em>
</div>