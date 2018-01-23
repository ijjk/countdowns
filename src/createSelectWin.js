const { BrowserWindow } = require('electron'); 
const path = require('path'); 
const fs = require('fs'); 
const url = require('url');

module.exports = function() {
  const app = this; 

  let win = new BrowserWindow({
    icon: app.paths.icon,
    title: 'Edit countdowns',
    height: 600,
    width: 600,
    minWidth: 500,
    autoHideMenuBar: true
  });

  win.dataDir = app.paths.dataDir; 
  win.configs = Object.keys(app.wins); 
  win.createConfigWin = app.createConfigWin;
  win.paths = app.paths;   

  win.loadURL(url.format({
    pathname: app.paths.selCount,
    protocol: 'file:',
    slashes: true 
  })); 

  win.on('closed', () => {
    app.selCountWin = null; 
  }); 

  app.selCountWin = win; 
};