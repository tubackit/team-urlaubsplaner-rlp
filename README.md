# 🏖️ Team Urlaubsplaner RLP

Ein interaktiver Urlaubsplaner für Teams in Rheinland-Pfalz für 2025 & 2026. Die Anwendung zeigt gesetzliche Feiertage und Schulferien an und ermöglicht die Planung von Urlaub, Überstundenfrei und Krankheitstagen für mehrere Mitarbeiter in einer übersichtlichen Jahres- und Monatsansicht.

## ✨ Features

- 📅 **Kalender-Ansicht** mit Monatsnavigation
- 👥 **Mitarbeiter-Management** (Hinzufügen/Löschen nach Abteilungen)
- 🏖️ **Abwesenheits-Tracking** (Urlaub, Überstundenfrei, Krank)
- 🎉 **Feiertags-Integration** (gesetzliche Feiertage + Schulferien)
- 🌙 **Dark Mode** Support
- 📱 **Responsive Design** für alle Geräte
- 💾 **LocalStorage** Persistierung
- 🤖 **AI-Integration** mit Google Gemini (optional)

## 🚀 Quick Start

### Voraussetzungen

- Node.js (Version 18 oder höher)
- npm oder yarn

### Installation

1. **Repository klonen:**

   ```bash
   git clone https://github.com/your-username/team-urlaubsplaner-rlp.git
   cd team-urlaubsplaner-rlp
   ```

2. **Dependencies installieren:**

   ```bash
   npm install
   ```

3. **Umgebungsvariablen setzen (optional für AI-Features):**

   ```bash
   echo "GEMINI_API_KEY=your_api_key_here" > .env.local
   ```

4. **Development Server starten:**

   ```bash
   npm run dev
   ```

5. **Browser öffnen:**
   ```
   http://localhost:3000
   ```

## 🛠️ Verfügbare Scripts

```bash
npm run dev      # Development Server starten
npm run build    # Production Build erstellen
npm run preview  # Production Build testen
```

## 🏗️ Technologie Stack

- **Frontend:** React 19.2.0 + TypeScript
- **Build Tool:** Vite 6.2.0
- **Styling:** TailwindCSS
- **AI Integration:** Google Gemini AI
- **State Management:** React Hooks
- **Storage:** LocalStorage

## 📁 Projektstruktur

```
team-urlaubsplaner-rlp/
├── src/
│   ├── App.tsx              # Hauptkomponente
│   ├── index.tsx            # React Entry Point
│   ├── types.ts             # TypeScript Definitionen
│   ├── constants.ts         # Konstanten & Feiertagsdaten
│   └── services/
│       └── geminiService.ts # AI Service Integration
├── public/
│   └── index.html           # HTML Template
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript Config
├── vite.config.ts           # Vite Configuration
└── README.md                # Diese Datei
```

## 🎨 Features im Detail

### 📅 Kalender-Ansicht

- Monatliche Ansicht mit deutscher Lokalisierung
- Automatisches Scrollen zum heutigen Tag
- Wochenend-Hervorhebung
- Heute-Markierung

### 👥 Mitarbeiter-Management

- Mitarbeiter nach Abteilungen gruppieren (Büro/Versand)
- Drag & Drop Interface
- Ein-Klick Löschung mit Bestätigung

### 🏖️ Abwesenheits-Tracking

- **Urlaub** (Blau) - Geplante Urlaubstage
- **Überstundenfrei** (Grün) - Überstundenausgleich
- **Krank** (Orange) - Krankheitstage
- Interaktive Zellen mit Popover-Menü

### 🎉 Feiertags-Integration

- **Gesetzliche Feiertage** (Rot) - Automatisch für RLP
- **Schulferien** (Lila) - Ferienzeiten in RLP
- **Wochenenden** (Grau) - Samstag/Sonntag

## 🔧 Konfiguration

### Umgebungsvariablen

Erstellen Sie eine `.env.local` Datei:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### Vite Konfiguration

Die Anwendung läuft standardmäßig auf Port 3000. Dies kann in `vite.config.ts` angepasst werden:

```typescript
export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  // ...
});
```

## 🚀 Deployment

### Vercel (Empfohlen)

1. Repository zu GitHub pushen
2. Vercel Account erstellen
3. GitHub Repository verbinden
4. Environment Variables setzen
5. Deploy

### Netlify

1. `npm run build` ausführen
2. `dist` Ordner zu Netlify hochladen
3. Environment Variables konfigurieren

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🤝 Contributing

1. Fork das Repository
2. Feature Branch erstellen (`git checkout -b feature/amazing-feature`)
3. Changes committen (`git commit -m 'Add amazing feature'`)
4. Branch pushen (`git push origin feature/amazing-feature`)
5. Pull Request erstellen

## 📝 Lizenz

Dieses Projekt steht unter der MIT Lizenz. Siehe [LICENSE](LICENSE) für Details.

## 🆘 Support

Bei Fragen oder Problemen:

1. **Issues** auf GitHub erstellen
2. **Discussions** für allgemeine Fragen nutzen
3. **Wiki** für detaillierte Dokumentation

## 🗺️ Roadmap

- [ ] **Export-Funktionen** (PDF/Excel)
- [ ] **Team-Kollaboration** Features
- [ ] **PWA Support** für Offline-Nutzung
- [ ] **Unit Tests** hinzufügen
- [ ] **E2E Tests** für kritische Workflows
- [ ] **Multi-Language** Support
- [ ] **API Integration** für externe Systeme

## 🙏 Danksagungen

- **React Team** für das großartige Framework
- **Vite Team** für das schnelle Build Tool
- **TailwindCSS** für das Utility-First CSS Framework
- **Google Gemini** für die AI-Integration

---

<div align="center">
  <strong>Entwickelt mit ❤️ für Teams in Rheinland-Pfalz</strong>
</div>
