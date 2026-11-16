const { ipcRenderer, clipboard } = require('electron');

// Setup Desktop Bridge for HUD (JarvisBridge / YesminBridge)
const JarvisBridge = {
  onMicClicked: () => {
    ipcRenderer.send('action-mic');
  },
  onOrbClicked: () => {
    ipcRenderer.send('action-orb');
  },
  onPowerClicked: () => {
    ipcRenderer.send('action-power');
  },
  onScreenShareClicked: () => {
    ipcRenderer.send('action-screen-share');
  },
  onSettingsClicked: () => {
    ipcRenderer.send('action-open-settings');
  },
  onHistoryClicked: () => {
    ipcRenderer.send('action-history');
  },
  speak: (text) => {
    ipcRenderer.send('action-speak', text);
  },
  speakOfflineStatic: (text) => {
    ipcRenderer.send('action-speak', text);
  },
  getHudTheme: () => {
    return localStorage.getItem('yesmin_hud_theme') || 'cyan';
  },
  setHudTheme: (theme) => {
    localStorage.setItem('yesmin_hud_theme', theme);
    ipcRenderer.send('theme-changed', theme);
  }
};

// Setup Bridge for Settings Panel
const JarvisSettingsBridge = {
  saveSettings: (payloadStr) => {
    ipcRenderer.send('save-settings', payloadStr);
  },
  getInitialSettings: () => {
    return ipcRenderer.sendSync('get-initial-settings');
  },
  onBackClicked: () => {
    ipcRenderer.send('close-settings');
  },
  pasteApiKey: () => {
    const text = clipboard.readText();
    const input = document.getElementById('apiKeyInput');
    if (input) {
      input.value = text;
      input.dispatchEvent(new Event('input'));
    }
  },
  pasteYouTubeKey: () => {
    const text = clipboard.readText();
    const input = document.getElementById('ytApiKeyInput');
    if (input) {
      input.value = text;
      input.dispatchEvent(new Event('input'));
    }
  },
  requestPermission: (perm) => {
    console.log(`[Windows] Permission granted: ${perm}`);
  },
  requestAllPermissions: () => {
    console.log('[Windows] All permissions granted.');
  },
  clearMemories: () => {
    localStorage.removeItem('mem0_long_term_memories');
  },
  viewMemories: () => {
    alert('Viewing memories from localStorage.');
  }
};

window.JarvisBridge = JarvisBridge;
window.YesminBridge = JarvisBridge;
window.JarvisSettingsBridge = JarvisSettingsBridge;

// IPC Listeners from Main process to invoke window HUD methods
ipcRenderer.on('invoke-set-orb-state', (_event, stateName, level) => {
  if (typeof window.setOrbState === 'function') {
    window.setOrbState(stateName, level);
  }
});

ipcRenderer.on('invoke-set-audio-level', (_event, level) => {
  if (typeof window.setAudioLevel === 'function') {
    window.setAudioLevel(level);
  }
});

ipcRenderer.on('invoke-set-power-state', (_event, isOn) => {
  if (typeof window.setPowerState === 'function') {
    window.setPowerState(isOn);
  }
});

ipcRenderer.on('invoke-add-chat-message', (_event, who, text, timeStr) => {
  if (typeof window.addChatMessage === 'function') {
    window.addChatMessage(who, text, timeStr);
  }
});

ipcRenderer.on('invoke-assistant-response', (_event, text) => {
  if (typeof window.updateLiveAssistantResponse === 'function') {
    window.updateLiveAssistantResponse(text);
  }
  if (typeof window.finalizeLiveTurn === 'function') {
    window.finalizeLiveTurn();
  }
});

ipcRenderer.on('invoke-settings-updated', (_event, newSettings) => {
  console.log('[Windows] Settings updated:', newSettings);
});

// Windows Titlebar Injection
window.addEventListener('DOMContentLoaded', () => {
  const isSettingsPage = window.location.pathname.includes('settings.html');
  
  const titlebar = document.createElement('div');
  titlebar.id = 'yesmin-desktop-titlebar';
  titlebar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 34px;
    background: rgba(10, 14, 20, 0.95);
    border-bottom: 1px solid rgba(0, 229, 255, 0.25);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    z-index: 99999;
    user-select: none;
    -webkit-app-region: drag;
    font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 11px;
    color: #c3f5ff;
    letter-spacing: 1px;
  `;

  const leftBadge = document.createElement('div');
  leftBadge.style.cssText = 'display: flex; align-items: center; gap: 8px; font-weight: 600;';
  leftBadge.innerHTML = `
    <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#00e5ff; box-shadow: 0 0 8px #00e5ff;"></span>
    <span>YESMIN // ${isSettingsPage ? 'SETTINGS CONTROL' : 'AI DESKTOP COMPANION'}</span>
  `;

  const controls = document.createElement('div');
  controls.style.cssText = 'display: flex; align-items: center; gap: 4px; -webkit-app-region: no-drag;';

  const btnStyle = `
    width: 28px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: #a7b3b6;
    cursor: pointer;
    font-size: 12px;
    border-radius: 4px;
    transition: background 0.15s, color 0.15s;
  `;

  const minBtn = document.createElement('button');
  minBtn.style.cssText = btnStyle;
  minBtn.innerHTML = '&#9866;';
  minBtn.title = 'Minimize';
  minBtn.onmouseenter = () => { minBtn.style.background = 'rgba(255,255,255,0.1)'; minBtn.style.color = '#fff'; };
  minBtn.onmouseleave = () => { minBtn.style.background = 'transparent'; minBtn.style.color = '#a7b3b6'; };
  minBtn.onclick = () => ipcRenderer.send('window-minimize');

  const maxBtn = document.createElement('button');
  maxBtn.style.cssText = btnStyle;
  maxBtn.innerHTML = '&#9634;';
  maxBtn.title = 'Maximize / Restore';
  maxBtn.onmouseenter = () => { maxBtn.style.background = 'rgba(255,255,255,0.1)'; maxBtn.style.color = '#fff'; };
  maxBtn.onmouseleave = () => { maxBtn.style.background = 'transparent'; maxBtn.style.color = '#a7b3b6'; };
  maxBtn.onclick = () => ipcRenderer.send('window-maximize');

  const closeBtn = document.createElement('button');
  closeBtn.style.cssText = btnStyle;
  closeBtn.innerHTML = '&#10005;';
  closeBtn.title = 'Close';
  closeBtn.onmouseenter = () => { closeBtn.style.background = '#e81123'; closeBtn.style.color = '#fff'; };
  closeBtn.onmouseleave = () => { closeBtn.style.background = 'transparent'; closeBtn.style.color = '#a7b3b6'; };
  closeBtn.onclick = () => {
    if (isSettingsPage) {
      ipcRenderer.send('close-settings');
    } else {
      ipcRenderer.send('window-close');
    }
  };

  controls.appendChild(minBtn);
  if (!isSettingsPage) controls.appendChild(maxBtn);
  controls.appendChild(closeBtn);

  titlebar.appendChild(leftBadge);
  titlebar.appendChild(controls);

  document.body.prepend(titlebar);

  // Shift body down slightly for titlebar
  document.body.style.paddingTop = '34px';
});
