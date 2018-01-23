const { BrowserWindow } = require('electron'); 
const fs = require('fs'); 
const url = require('url'); 

module.exports = function(configFile, conf, idx) {
  const app = this; 
  const wins = app.wins;
  
  wins[idx] = new BrowserWindow({
    width: conf.width,
    height: conf.height,
    x: conf.posX,
    y: conf.posY,
    frame: false,
    movable: true,
    transparent: true,
    skipTaskbar: true,
    focusable: false,
    minimizable: false,
    closable: false,
    maximizable: false
  }); 

  wins[idx].countConf = conf; 
  wins[idx].configFile = configFile; 
  wins[idx].updateConfTime = null;

  const updateConf = () => {
    clearTimeout(wins[idx].updateConfTime); 

    wins[idx].updateConfTime = setTimeout(() => {
      try {
        fs.writeFileSync(configFile, JSON.stringify(conf, null, 2));  
      }
      catch(err) {
        console.error(err); 
      }
    }, 1000);
  };

  wins[idx].loadURL(url.format({
    pathname: app.paths.countdown,
    protocol: 'file:',
    slashes: true
  })); 

  wins[idx].on('closed', () => {
    wins.splice(idx, idx + 1); 
  }); 

  wins[idx].resizeTime = null; 
  wins[idx].resized = (width, height) => {
    clearTimeout(wins[idx].resizeTime); 

    wins[idx].resizeTime = setTimeout(() => {
      conf.width = width; 
      conf.height = height; 
      updateConf(); 
    }, 500);
  };

  wins[idx].moveTime = null;
  wins[idx].on('move', () => {
    clearTimeout(wins[idx].moveTime); 

    wins[idx].moveTime = setTimeout(() => {
      const newPos = wins[idx].getPosition(); 
      
      conf.posX = newPos[0]; 
      conf.posY = newPos[1]; 
      updateConf(); 
    }, 500); 

  }); 
};