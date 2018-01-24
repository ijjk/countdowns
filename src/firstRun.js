const { BrowserWindow } = require('electron'); 
const fs = require('fs'); 
const path = require('path');
const url = require('url');  

module.exports = function() {
  const app = this; 
  const hasRun = path.join(__dirname, '..', '.hasRun'); 
  let isFirst = true; 

  try {
    fs.statSync(hasRun);
    isFirst = false;  
  }
  catch(err) {
    // its the first leave isFirst = true and create .hasRun
    fs.writeFileSync(hasRun, 'hello'); 
  }
  
  if(isFirst) {

    const AutoLaunch = require('auto-launch'); 
    const autoLaunch = new AutoLaunch({
      name: 'Countdowns'
    }); 

    const getExecName = path.basename(process.execPath).toLowerCase(); 
    
    if(getExecName.indexOf('countdown') > 0) {
      autoLaunch.isEnabled()
        .then((isEnabled) => {
          if(isEnabled) return; 
          autoLaunch.enable().catch();
        })
        .catch(); 
    }

    let welcomeWin = new BrowserWindow({
      icon: app.paths.icon,
      title: 'Installation complete!',
      height: 160,
      width: 400,
      autoHideMenuBar: true
    }); 

    welcomeWin.loadURL(url.format({
      pathname: path.join(app.paths.uiSrc, 'firstRun', 'index.html'),
      protocol: 'file:',
      slashes: true
    })); 

    welcomeWin.on('closed', () => {
      welcomeWin = null; 
    }); 
  }
};