# 🚀 Aryo Damar Prasetia - Portfolio

A cyberpunk-styled interactive portfolio using **Anime.js** + **Three.js**.  
Dynamic data is loaded from JSON to make content easy to update.

---

## 📂 Structure

- `index.html` → Page structure only
- `styles.css` → Styling & responsive rules
- `data.json` → Content (hero, about, skills, experience, contact)
- `ContentHandler.js` → Reads `data.json` and generates DOM
- `AnimationHandler.js` → Handles all animations & interactivity
- `README.md` → Documentation

---

## ✨ How It Works

1. **ContentHandler.js** loads `data.json` and injects HTML into sections.
   - To add skills → add new object in `skills` array.
   - To add job experience → add object in `experience`.
   - To add contact link → edit `contact`.

2. **AnimationHandler.js** uses Anime.js & Three.js.
   - Handles header/hero animations, scroll-based reveals, floating shapes, profile card tilt, etc.
   - To add new animations → extend `animateElement()` or add new timeline.

3. **styles.css** defines theme variables, responsive rules, and component layouts.

---

## 🛠 Development

- Open `index.html` in browser (no server needed).  
- For JSON fetch to work, use local server (`python3 -m http.server`, `live-server`, or VSCode Live Server).

---

## 📌 Notes

- Profile image is set in `data.json`.
- Glow/3D interactions handled in `AnimationHandler.js`.
- Modular → change content without touching HTML.
