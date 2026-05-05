# 🤍 Instagram Bio Generator – work.life.love

## Dateien im Paket

```
wll-bio-generator/
├── index.html                          ← Das Tool (Frontend)
├── netlify.toml                        ← Netlify Konfiguration
├── netlify/functions/
│   ├── generate-bio.js                 ← AI Bio-Generierung (sicher)
│   └── save-email.js                   ← Active Campaign Anbindung
└── README.md                           ← Diese Anleitung
```

---

## Schritt-für-Schritt Deployment auf Netlify

### 1. Netlify Account erstellen
→ https://netlify.com → kostenlos registrieren

### 2. Neues Projekt anlegen
- Dashboard → "Add new site" → "Deploy manually"
- Den gesamten Ordner `wll-bio-generator` hochladen (drag & drop)

### 3. Umgebungsvariablen eintragen
Netlify Dashboard → deine Site → **Site configuration → Environment variables**

| Variable | Wert | Wo finden? |
|---|---|---|
| `ANTHROPIC_API_KEY` | sk-ant-... | https://console.anthropic.com |
| `AC_API_URL` | https://DEINACCOUNT.api-us1.com | Active Campaign → Einstellungen → API |
| `AC_API_KEY` | Dein AC API Key | Active Campaign → Einstellungen → API |
| `AC_LIST_ID` | z.B. 3 | AC → Listen → ID in der URL |
| `AC_TAG_ID` | z.B. 12 | AC → Tags → ID (optional) |

### 4. Redeploy auslösen
Nach dem Eintragen der Variablen:
Deploys → "Trigger deploy" → "Deploy site"

### 5. Fertig! 🎉
Deine URL: `https://DEINNAME.netlify.app`

---

## Auf deiner eigenen Website einbinden

Falls du das Tool auf deiner bestehenden Website (z.B. WordPress) einbetten möchtest, gibt es zwei Möglichkeiten:

**Option A – Direkt verlinken**
Einfach auf die Netlify-URL verlinken. Fertig.

**Option B – Als iFrame einbetten**
```html
<iframe 
  src="https://DEINNAME.netlify.app" 
  width="100%" 
  height="900px" 
  frameborder="0"
  style="border-radius: 16px;">
</iframe>
```

---

## Kosten

- **Netlify Hosting**: kostenlos (bis 100GB Bandbreite/Monat)
- **Anthropic API**: ca. 0,01–0,03€ pro Generierung
- **Active Campaign**: dein bestehendes Abo

Bei 100 Nutzungen/Monat: ca. 1–3€ API-Kosten.

---

## Fragen?
Erstellt mit 🤍 von Claude für Sandra – work.life.love
