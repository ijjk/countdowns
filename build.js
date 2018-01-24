const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller;
const path = require('path');

const rootPath = path.join(__dirname);
const outPath = path.join(rootPath, 'build/');

console.log('creating windows installer');

createWindowsInstaller({
  appDirectory: path.join(outPath, 'Countdowns-win32-x64'),
  authors: 'JJ Kasper',
  noMsi: true,
  outputDirectory: path.join(outPath, 'windows-installer'),
  exe: 'Countdowns.exe',
  setupExe: 'Countdowns-Setup-x64.exe',
  setupIcon: path.join(rootPath, 'icon.ico')
});