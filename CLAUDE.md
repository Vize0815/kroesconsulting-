# Kroes Consulting — Website

## Projektübersicht
Professionelle Unternehmenswebsite für **Kroes Consulting** (Alexander Kroes e.U.) — Konfliktcoaching für **KMU & Handwerk**. Standort: Breitenbach am Inn (Raum Kufstein, Tirol, Österreich).

## Projektkontext (wichtig!)
- Es wird eine neue komplette Website erstellt, die NICHT mehr auf die alte Webseite https://www.kroes-consulting.com/ zugreift 
- Es gibt eine neue Ausrichtung des Unternehmens auf Konfliktmanagement (ich mache Handwerksbetriebe führungsstark, damit sie Fachkräfte halten, Konflikte lösen und profitabel wachsen.)
- Meine neue Positionierungsformel:
„Konflikte kosten Unternehmen Geld – ich mache diese Verluste sichtbar und beseitige sie systematisch.“
- neue Positionierung: „Wenn Konflikte Ihr Unternehmen Geld kosten, ist das kein Zufall – sondern ein Systemproblem.“
- Verkaufsseiten mit Suchintention
- Fokus: **SEO** (lokal + thematisch) und **Mobile-First**.
- Echte Zielgruppe: **KMU, Handwerk, Inhaber & Geschäftsführer**.

## Seitenstruktur
- Hauptseite mit SEO Keyword:„Konflikte im Unternehmen lösen“
- Angebotsseite mit SEO Keyword: „Konfliktmanagement Unternehmen“
- Infoseite (Lead-Magnet:) mit SEO-Keyword: Was kosten Konflikte im Unternehmen?“
- „Was kosten Konflikte im Unternehmen wirklich?“
typische Konflikte
reale Auswirkungen
konkrete Kosten
Beispielrechnung
Lösung (dein Angebot)

## Dateistruktur
```
/
├── index.html              # Startseite / Hero im LinkedIn-Banner-Style
├── leistungen.html         # 3 Signature-Produkte + 5-Phasen-Prozess
├── ueber-uns.html          # Bio: Lehrling → Projektmanager → Gründer
├── kontakt.html            # Kontaktformular, FAQ, echte Kontaktdaten
├── sitemap.xml             # XML-Sitemap für Google
├── robots.txt              # Crawler-Anweisungen
├── assets/
│   ├── css/style.css       # Komplettes Design-System (final)
│   ├── js/main.js          # Nav, Animationen, Formular, Foto-Fallback
│   └── img/
│       ├── portrait.jpg    # Portrait-Foto (noch einzufügen!)
│       └── og-image.jpg    # Social-Vorschaubild (noch einzufügen!)
```

## Signature-Leistungen 
| Produkt         | Fokus                                              |
|-----------------|----------------------------------------------------|
                   |
| **LeadResolve** | Konfliktcoaching für Führungskräfte |
| **LEADSHIFT** | Leadershipcoaching für Führungskräfte |

## 5-Phasen-Beratungsprozess
1. Erstgespräch & Kennenlernen
2. Analyse & Standortbestimmung
3. Zieldefinition & Strategie
4. Umsetzung & Begleitung
5. Reflexion & Nachhaltigkeit

## Echte Kontaktdaten
- **Telefon**: `+43 (0) 5338 20105`
- **E-Mail**: `info@kroes-consulting.com`
- **Adresse**: `Unterer Stadtplatz 11, 6330 Kufstein, Österreich`
- **Firma**: `Alexander Kroes e.U.`

## Qualifikationen Alexander Kroes (real, verifiziert)
- Elektrotechnikermeister
- Betriebswirt des Handwerks
- Zertifizierter Unternehmensberater
- Zertifizierter Business Coach
- Konfliktcoach (spezialisiert)


> ⚠️ **Kein Mediator-Zertifikat!** — Alte Versionen der Webseite (Entwurf) listeten fälschlich „Zert. Mediator". Korrekt ist „Konfliktcoach".

## Biografie-Narrativ (für ueber-uns.html)
Lehrling im Handwerk → 15 Jahre Projektmanager (u.a. Finnland-Projekt für Mobiltelefon-Hersteller) → persönlicher Schicksalsschlag („Erst als alles stillstand, wurde vieles klar und DEUTLICH.") → Gründung Kroes Consulting.

## Design-System

### Typografie
- **Display / Headings**: Playfair Display (400, 700, Italic)
- **Body / UI**: Libre Franklin (300, 400, 500, 600)

### Farben
| Variable       | Wert         | Verwendung                        |
|----------------|--------------|-----------------------------------|
| `--navy`       | `#1F2F58`    | Primärfarbe, Hintergründe, Logos  |
| `--peri`       | `#768CFD`    | Akzentfarbe, CTAs, KMU-Highlight  |
| `--warm-50`    | `#faf8f5`    | Seitenhintergrund (hell)          |
| `--warm-100`   | `#f3f0ea`    | Alternierende Sektionen           |
| `--ink-900`    | `#141210`    | Fließtext dunkel                  |

### AK-Logo-Signet
- CSS-Raute (rotiertes Quadrat, `border: 2.5px solid var(--navy)`)
- „AK" in Playfair Display Bold
- Klassen: `.ak-mark` (Hero groß), `.nav-logo-mark .ak-mark` (Nav klein)

## Hero-Bereich (index.html) — LinkedIn-Banner-Style
- 2-Spalten-Layout: Content links, Portrait rechts
- AK-Signet + Markenname oben
- Heading: „Unternehmensberatung & Coaching für **KMU** & **Handwerk**" (Highlight in Periwinkle)
- Slogans (groß, Caps): „Konflikte lösen. Klarheit gewinnen." / „Entscheidungen treffen. Verantwortung führen."
- CTA: „Erstgespräch vereinbaren" (Periwinkle) + „Leistungen entdecken" (Outline)
- Erfahrungs-Badge: „20 Jahre Praxis-Erfahrung als Projektmanager"
- Credentials-Reihe: Zert. Unternehmensberater · Zert. Business Coach · Betriebswirt d. Handwerks
- **Kein** Punktmuster
- Portrait-Fallback via JS bei fehlender `portrait.jpg`

## SEO-Konfiguration

### Primäre Keywords
- Konflikte im Unternehmen lösen
- Konfliktmanagement Unternehmen
- Mitarbeiterkonflikte lösen
- Probleme im Team lösen
- Team funktioniert nicht

### Sekundäre Keywords
- schlechte Kommunikation im Team
- Konflikte im Team Ursachen
- Mitarbeiter kündigen wegen Führung
- Team funktioniert nicht
- hohe Fluktuation Ursachen
- schlechte Führung im Unternehmen


### Structured Data (JSON-LD)
- `ProfessionalService` mit `areaServed: AT` — index.html
- `BreadcrumbList` — alle Unterseiten
- `ContactPage` + `LocalBusiness` (Adresse) — kontakt.html
- `AboutPage` + `Person` (Alexander Kroes) + `Organization` — ueber-uns.html
- `ItemList` mit Services — leistungen.html

### Meta-Tags (alle Seiten)
- Unique `<title>` (50–60 Zeichen)
- Unique `<meta name="description">` (150–160 Zeichen, Keyword + CTA)
- `<link rel="canonical">` → `https://www.kroes-consulting.com/*`
- Open Graph (og:title, og:description, og:type, og:locale=de_AT, og:url, og:image)
- Twitter Cards
- `<html lang="de-AT">` statt `de` (Austria-Locale)

## Mobile-First Checkliste
- Viewport-Meta gesetzt ✓
- Breakpoints: 1024px / 768px / 480px ✓
- Touch-Targets min. 48×48px ✓
- `clamp()` für fluide Typografie ✓
- `100svh` für Hero auf Mobile ✓
- Mobile-Menü (Burger) implementiert ✓

## Nächste Schritte (noch ausstehend)
1. **Portrait-Foto** `assets/img/portrait.jpg` ablegen
2. **Impressum** + **Datenschutz** (rechtlich erforderlich, Österreich: ECG-Pflichtangaben)
3. **OG-Image** 1200×630px erstellen
4. **Formular-Backend** (Netlify Forms / Formspree)
5. **DSGVO-Cookie-Banner** falls Analytics
6. **Google Search Console** + `sitemap.xml` einreichen
7. **Domain-Migration** von kroes-consulting.com (ggf. 301-Redirects von alten URLs)
