const { BrowserWindow } = require('electron'); 
const path = require('path'); 
const fs = require('fs'); 
const url = require('url');

module.exports = function(countId) {
  const app = this; 

  let configWin = new BrowserWindow({
    icon: app.paths.icon,
    title: 'Configure countdown',
    height: 600,
    width: 600,
    minWidth: 500,
    autoHideMenuBar: true
  });

  configWin.loadURL(url.format({
    pathname: app.paths.configCount,
    protocol: 'file:',
    slashes: true
  })); 

  if(typeof countId === 'number' || 
    (typeof countId === 'string' && countId.trim().length > 0) )
  {
    const configFile = path.join(app.paths.dataDir, countId + '.json'); 
    
    configWin.configFile = configFile; 
    configWin.countConf = JSON.parse(
      fs.readFileSync(configFile).toString());
  }
  else {
    configWin.dataDir = app.paths.dataDir; 
  }

  configWin.on('close', () => {
    configWin = null; 
  });   
}; 