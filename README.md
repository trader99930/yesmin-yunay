# 🌌 Yesmin AI Assistant (v2.5.0)

> Advanced Real-Time Voice Assistant powered by Google Gemini 3.1 Flash Live & Vosk Offline ASR.

[![Build and Release Yesmin AI Assistant APK](https://github.com/trader99930/yesmin/actions/workflows/build.yml/badge.svg)](https://github.com/trader99930/yesmin/actions/workflows/build.yml)

---

## 🌟 Highlights

- **⚡ Gemini 3.1 Flash Live Voice**: Bi-directional ultra-low latency audio streaming over WebSockets.
- **✨ 3D Celestial Hologram HUD**: Custom responsive HUD featuring a glowing celestial starlight avatar that pulses with audio levels.
- **🪐 Deep Cosmic Background**: Dynamic space spiral galaxy environment with glassmorphic telemetry indicators.
- **🎙️ Vosk Offline Speech Recognition**: Bundled offline ASR model for instant wakeword and fallback voice commands.
- **⚙️ Native Settings Interface**: Configure Gemini API Keys, live voices (Puck, Charon, Kore, Fenrir, Aoede, etc.), personality, and permissions.
- **📱 Phone & YouTube Automation**: Voice-controlled media playback, system brightness, volume, and app management.

---

## 🚀 Building the APK

### Automatic Build (GitHub Actions)
Every push to `main` or new tag automatically triggers `.github/workflows/build.yml` which builds and signs the APK, then makes it available under **Actions Artifacts** and **Releases**.

### Local Build (Linux / Termux)
Make sure `python3`, `zipalign`, and `apksigner` are installed:
```bash
python3 build_apk.py
```
The output file will be saved as `Yesmin.apk`.

---

## 📦 Architecture & Stack
- **Engine**: Kotlin / Android Native + Android WebView Bridge (`JarvisBridge`)
- **HUD**: Modern HTML5 / TailwindCSS / WebGL Canvas / Dynamic Audio Visualizer
- **Voice Protocol**: Gemini Multimodal Live API (PCM 24kHz / 16kHz)
- **Speech Engine**: Vosk Kaldi offline library (`libvosk.so`)
