# 📖 Speedreader - Snabbläsare

En modern webbapplikation för att läsa artiklar och texter snabbt och effektivt med visuell fokusering. Perfekt för att spara tid och förbättra läshastigheten!

## ✨ Funktioner

- **Två inmatningslägen:**
  - 📎 Ladda artiklar direkt från URL
  - 📝 Klistra in text direkt
  
- **Intelligent textextraktion** - Extraherar automatiskt huvudinnehållet från webbsidor

- **Visuell fokusering** - Mittenbokstaven i varje ord visas i rött för att behålla ögonens fokuspunkt

- **Justerbar läshastighet** - Välj mellan 100-1000 ord per minut (WPM)

- **Lättanvändade kontroller:**
  - ▶ Spela
  - ⏸ Paus
  - ⟲ Nollställ
  
- **Förloppsindikator** - Se hur långt du har kommit i texten

- **Responsiv design** - Fungerar perfekt på dator, surfplatta och mobil

## 🚀 Kom igång

### Direktstart
Öppna `index.html` i din webbläsare och börja snabbläsa direkt!

### Från URL
1. Gå till fliken "📎 URL"
2. Klistra in en artikel-URL
3. Klicka "Ladda artikel"
4. Justera hastigheten med reglaget
5. Klicka "▶ Spela" för att börja

### Direkt text
1. Gå till fliken "📝 Direkt text"
2. Klistra in din text
3. Klicka "Börja läsa"
4. Använd kontrollerna för att läsa

## 📱 Systemkrav

- Modern webbläsare (Chrome, Firefox, Safari, Edge)
- Internetanslutning (för att ladda artiklar från URL)
- JavaScript aktiverat

## 🎨 Design

- **Modernt gränsnitt** med gradient bakgrund
- **Stor, tydlig typografi** för optimal läsbarhet
- **Intuitiva ikoner** för snabb navigering
- **Smooth animationer** för bättre användarupplevelse

## ⚙️ Hur det fungerar

### Snabbläsningsmetoden (RSVP)
Speedreader använder **Rapid Serial Visual Presentation (RSVP)**-metoden:
- Visar ett ord åt gången
- Mittenbokstaven är markerad i rött
- Ordet förblir på samma position på skärmen
- Reducerar ögonrörelser och ökar läshastigheten

### Läshastighet
Hastigheten mäts i **WPM (Words Per Minute)**:
- **100-200 WPM** - Långsam, för svårare texter
- **300 WPM** - Normalläshastighet (standard)
- **600+ WPM** - Snabbläsning

## 🔧 Teknologi

- **HTML5** - Semantisk struktur
- **CSS3** - Modern styling och animationer
- **Vanilla JavaScript** - Ingen beroenden, ren och enkel kod
- **CORS-proxy** - För att hämta innehål från externa webbsidor

## 📝 Projektstruktur

```
Speedreader/
├── index.html      # Huvuddokument
├── style.css       # Stilar och design
├── script.js       # JavaScript-logik
└── README.md       # Denna fil
```

## 🐛 Felsökning

### "Kunde inte hämta innehållet"
- Kontrollera att URL:en är korrekt
- Försök med en annan webbsida
- Några sajter kan blockera proxy-åtkomst

### "Kunde inte extrahera text"
- Webbsidan kanske inte har textinnehål i standardformat
- Testa den direkta text-funktionen istället

## 💡 Tips för bästa resultatet

1. **Börja lågt** - Börja på 200-300 WPM om du är ny på snabbläsning
2. **Fokus** - Håll ögonen på mittenbokstaven
3. **Vilka ord** - Du kan pausa när som helst för att reflektera
4. **Träning** - Läshastigheten ökar med övning

## 📄 Licens

Fritt att använda och modifiera.

## 🎯 Framtida förbättringar

- [ ] Histori över lästa artiklar
- [ ] Möjlighet att spara favoriter
- [ ] Flera färgteman
- [ ] Offline-läsning
- [ ] Statistik över läshastighet

---

**Glad snabbläsning!** 📖✨