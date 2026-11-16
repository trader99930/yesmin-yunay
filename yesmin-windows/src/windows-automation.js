const { exec, spawn } = require('child_process');
const os = require('os');
const { shell } = require('electron');

class WindowsAutomation {
  static openApp(appName) {
    const target = appName.toLowerCase().trim();
    if (target.includes('chrome')) {
      exec('start chrome');
    } else if (target.includes('notepad')) {
      exec('start notepad');
    } else if (target.includes('calc') || target.includes('calculator')) {
      exec('start calc');
    } else if (target.includes('cmd') || target.includes('terminal')) {
      exec('start cmd');
    } else if (target.includes('explorer') || target.includes('file')) {
      exec('start explorer');
    } else if (target.includes('youtube')) {
      shell.openExternal('https://www.youtube.com');
    } else {
      exec(`start ${appName}`);
    }
  }

  static openUrl(url) {
    shell.openExternal(url);
  }

  static volumeUp() {
    exec('powershell -Command "(New-Object -ComObject Wscript.Shell).SendKeys([char]175)"');
  }

  static volumeDown() {
    exec('powershell -Command "(New-Object -ComObject Wscript.Shell).SendKeys([char]174)"');
  }

  static volumeMute() {
    exec('powershell -Command "(New-Object -ComObject Wscript.Shell).SendKeys([char]173)"');
  }

  static getSystemInfo() {
    const totalMem = Math.round(os.totalmem() / (1024 * 1024 * 1024));
    const freeMem = Math.round(os.freemem() / (1024 * 1024 * 1024));
    const usedMem = totalMem - freeMem;
    const cpus = os.cpus();
    const cpuModel = cpus.length > 0 ? cpus[0].model : 'Unknown';
    const uptimeHours = Math.floor(os.uptime() / 3600);
    const uptimeMins = Math.floor((os.uptime() % 3600) / 60);

    return {
      platform: os.platform(),
      hostname: os.hostname(),
      cpuModel,
      cpuCores: cpus.length,
      totalMemGB: totalMem,
      usedMemGB: usedMem,
      freeMemGB: freeMem,
      uptime: `${uptimeHours}h ${uptimeMins}m`
    };
  }
}

module.exports = WindowsAutomation;
