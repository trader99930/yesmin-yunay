const { app, BrowserWindow, ipcMain, Tray, Menu, globalShortcut, desktopCapturer } = require('electron');
const path = require('path');
const fs = require('fs');
const WindowsAutomation = require('./windows-automation');
const GeminiService = require('./gemini-live');

let mainWindow = null;
let settingsWindow = null;
let tray = null;
let geminiService = null;
let isSessionActive = true;

// Persistence file in user data
const settingsFilePath = path.join(app.getPath('userData'), 'yesmin_settings.json');

function loadStoredSettings() {
  const defaults = {
    apiKey: '',
    youtubeApiKey: '',
    model: 'models/gemini-2.0-flash',
    voice: 'Puck',
    personality: 'caring',
    assistantName: 'Yesmin',
    userName: 'Sushil sir',
    theme: 'cyan'
  };

  try {
    if (fs.existsSync(settingsFilePath)) {
      const data = fs.readFileSync(settingsFilePath, 'utf-8');
      return { ...defaults, ...JSON.parse(data) };
    }
  } catch (err) {
    console.error('Error reading settings file:', err);
  }
  return defaults;
}

function saveStoredSettings(settings) {
  try {
    fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing settings file:', err);
  }
}

let appSettings = loadStoredSettings();
geminiService = new GeminiService(appSettings.apiKey, appSettings);

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1180,
    height: 840,
    minWidth: 860,
    minHeight: 640,
    frame: false,
    backgroundColor: '#08090b',
    icon: path.join(__dirname, '../assets/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  const hudPath = path.join(__dirname, '../assets/hud/index.html');
  mainWindow.loadFile(hudPath);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (settingsWindow) settingsWindow.close();
  });
}

function openSettingsModal() {
  if (settingsWindow) {
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow({
    width: 720,
    height: 780,
    minWidth: 500,
    minHeight: 600,
    frame: false,
    parent: mainWindow || undefined,
    modal: true,
    backgroundColor: '#0a0d14',
    icon: path.join(__dirname, '../assets/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  const settingsPath = path.join(__dirname, '../assets/settings/settings.html');
  settingsWindow.loadFile(settingsPath);

  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });
}

function setupTray() {
  const iconPath = path.join(__dirname, '../assets/icon.png');
  try {
    tray = new Tray(iconPath);
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show Yesmin AI',
        click: () => {
          if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
          }
        }
      },
      {
        label: 'Settings',
        click: () => openSettingsModal()
      },
      { type: 'separator' },
      {
        label: 'Mute / Unmute',
        click: () => WindowsAutomation.volumeMute()
      },
      {
        label: 'Open YouTube',
        click: () => WindowsAutomation.openApp('youtube')
      },
      { type: 'separator' },
      {
        label: 'Exit Yesmin',
        click: () => app.quit()
      }
    ]);
    tray.setToolTip('Yesmin AI Companion (Windows)');
    tray.setContextMenu(contextMenu);
    tray.on('double-click', () => {
      if (mainWindow) {
        if (mainWindow.isVisible()) {
          mainWindow.hide();
        } else {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    });
  } catch (err) {
    console.log('Tray initialization notice:', err.message);
  }
}

// IPC Handlers
ipcMain.on('window-minimize', () => {
  const win = BrowserWindow.getFocusedWindow() || mainWindow;
  if (win) win.minimize();
});

ipcMain.on('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('window-close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.on('action-open-settings', () => {
  openSettingsModal();
});

ipcMain.on('close-settings', () => {
  if (settingsWindow) {
    settingsWindow.close();
  }
});

ipcMain.on('get-initial-settings', (event) => {
  event.returnValue = JSON.stringify(appSettings);
});

ipcMain.on('save-settings', (_event, payloadStr) => {
  try {
    const data = typeof payloadStr === 'string' ? JSON.parse(payloadStr) : payloadStr;
    appSettings = { ...appSettings, ...data };
    saveStoredSettings(appSettings);
    geminiService = new GeminiService(appSettings.apiKey, appSettings);

    if (mainWindow) {
      mainWindow.webContents.send('invoke-settings-updated', appSettings);
    }
    if (settingsWindow) {
      settingsWindow.close();
    }
  } catch (err) {
    console.error('Failed to parse and save settings:', err);
  }
});

// HUD Actions
ipcMain.on('action-power', () => {
  isSessionActive = !isSessionActive;
  if (mainWindow) {
    mainWindow.webContents.send('invoke-set-power-state', isSessionActive);
  }
});

ipcMain.on('action-orb', async () => {
  if (!mainWindow) return;

  mainWindow.webContents.send('invoke-set-orb-state', 'listening', 0.7);

  // Check if API key is set
  if (!appSettings.apiKey) {
    setTimeout(() => {
      mainWindow.webContents.send('invoke-set-orb-state', 'idle', 0);
      mainWindow.webContents.send(
        'invoke-add-chat-message',
        'jarvis',
        'Namaste! Please open Settings (⚙️ icon) and enter your Gemini API Key to activate voice conversations.',
        new Date().toLocaleTimeString()
      );
      openSettingsModal();
    }, 600);
    return;
  }
});

ipcMain.on('action-mic', async () => {
  if (!mainWindow) return;
  mainWindow.webContents.send('invoke-set-orb-state', 'listening', 0.8);
});

// Screen Share & Vision Scanner
ipcMain.on('action-screen-share', async () => {
  if (!mainWindow) return;

  try {
    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: { width: 1280, height: 720 }
    });

    if (sources.length > 0) {
      const primaryScreen = sources[0];
      const thumbnailDataUrl = primaryScreen.thumbnail.toDataURL();

      mainWindow.webContents.send('invoke-set-orb-state', 'thinking', 0.9);
      mainWindow.webContents.send(
        'invoke-add-chat-message',
        'you',
        'Analyzing current screen content...',
        new Date().toLocaleTimeString()
      );

      if (appSettings.apiKey) {
        const analysis = await geminiService.analyzeImage(
          thumbnailDataUrl,
          'Aapko screen par kya dikh raha hai? Hindi / Hinglish me concise btaiye.'
        );
        mainWindow.webContents.send('invoke-set-orb-state', 'speaking', 0.8);
        mainWindow.webContents.send('invoke-assistant-response', analysis);
        mainWindow.webContents.send(
          'invoke-add-chat-message',
          'jarvis',
          analysis,
          new Date().toLocaleTimeString()
        );
      } else {
        mainWindow.webContents.send('invoke-set-orb-state', 'idle', 0);
        mainWindow.webContents.send(
          'invoke-add-chat-message',
          'jarvis',
          'Screen snapshot captured. Enter Gemini API key in Settings to get full AI Vision analysis.',
          new Date().toLocaleTimeString()
        );
      }
    }
  } catch (err) {
    console.error('Screen capture error:', err);
    mainWindow.webContents.send('invoke-set-orb-state', 'idle', 0);
  }
});

// App lifecycle
app.whenReady().then(() => {
  createMainWindow();
  setupTray();

  // Register Global Shortcut (Ctrl+Alt+Y) to show/hide Yesmin
  globalShortcut.register('CommandOrControl+Alt+Y', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
