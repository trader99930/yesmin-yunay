# 🌌 Yesmin AI Assistant - Windows Laptop Edition (v2.5.0)

> Celestial 3D Hologram AI Companion & Voice Assistant for Windows Laptop.
> Powered by Google Gemini Live Multimodal AI, WebGL Audio Visualizer & Desktop Automation.

---

## 🌟 Features on Windows Laptop
- **✨ 3D Celestial Hologram HUD**: Full high-performance WebGL cosmic spiral, glowing avatar (`girl.webp`), and audio pulse reactive visualizer.
- **⚡ Gemini 2.0 / Multimodal AI**: Real-time voice interaction and companionship.
- **👁️ Optical Vision & Screen Perception**: Electron desktop capturer allows Yesmin to see and analyze your Windows screen in real-time.
- **🛠️ Windows Automation**:
  - Open Chrome, YouTube, Notepad, Calculator, File Explorer.
  - Windows volume control (Increase, Decrease, Mute).
  - System performance diagnostics (CPU, RAM, Uptime).
- **🎨 Custom Cosmic Titlebar**: Minimize, Maximize, and Close buttons with smooth glassmorphism styling.
- **⚡ Background System Tray & Shortcut**:
  - Runs in Windows System Tray (near taskbar clock).
  - Press `Ctrl + Alt + Y` from any screen to instantly show/hide Yesmin.

---

## 🚀 Laptop par Kaise Chalayein (How to Run)

### Tarika 1: 1-Click Launch (Recommended)
1. Is pure `yesmin-windows` folder ko apne Windows Laptop me copy karein.
2. Make sure aapke laptop me **Node.js** install ho (agar nahi hai to https://nodejs.org se install karein).
3. **`run_windows.bat`** par double click karein!
   - Yeh automatically saari zaroori files setup karega aur Yesmin app laptop screen par start ho jayegi.

---

## 📦 Laptop ke liye `.EXE` Installer Kaise Banayein (Build .EXE)

1. **`build_windows.bat`** par double click karein (ya command prompt me `npm run build:win` run karein).
2. Process complete hote hi **`dist`** folder me aapko do files milengi:
   - **`Yesmin AI Assistant Setup 2.5.0.exe`** (Windows Installer setup)
   - **`Yesmin-AI-Assistant-Portable-2.5.0.exe`** (Bina install kiye direct chalne wali portable exe)

---

## ⚙️ Settings & Configuration
App open hone ke baad:
1. Top right me **Settings (⚙️)** button dabayein.
2. Apna **Google Gemini API Key** paste karein.
3. Voice (Puck, Charon, Kore, Fenrir, Aoede), Theme, aur Personality choose karke Save karein.

---

## 📂 Project Structure
```text
yesmin-windows/
├── assets/
│   ├── hud/            # 3D Celestial HUD, Galaxy background, Visualizer
│   ├── settings/       # Settings control panel
│   └── icon.png        # Windows application icon
├── src/
│   ├── main.js         # Electron Windows main process, Tray, Shortcuts
│   ├── preload.js      # Bridge between HTML HUD and Windows Desktop
│   ├── gemini-live.js  # Gemini Multimodal Live & REST Engine
│   └── windows-automation.js # Windows commands (Apps, Volume, Screen)
├── package.json        # Build configuration and dependencies
├── run_windows.bat     # 1-Click launcher for Windows
├── build_windows.bat   # 1-Click .EXE builder for Windows
└── run_python_preview.py # Python alternative preview
```
