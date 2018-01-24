const electron = require('electron'); 
const { BrowserWindow } = electron; 
const fs = require('fs'); 
const path = require('path'); 
const url = require('url'); 

module.exports = function(configFile, conf) {
  const app = this; 
  const wins = app.wins;
  const idx = path.basename(configFile); 
  
  let curX = conf.posX; 
  let curY = conf.posY; 

  const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize;
  // make sure position isn't set to a greater than or equal value to current display's resolution
  if(curX >= width) {
    curX = (width - conf.width); 
  }
  if(curY >= height) {
    curY = (height - conf.height); 
  }

  wins[idx] = new BrowserWindow({
    width: conf.width,
    height: conf.height,
    x: curX,
    y: curY,
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
        fs.writeFileSync(configFile, JSON.stringify(wins[idx].countConf, null, 2));  
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
    delete wins[idx]; 
  }); 

  wins[idx].resizeTime = null; 

  wins[idx].resized = (width, height) => {    
    clearTimeout(wins[idx].resizeTime); 

    wins[idx].resizeTime = setTimeout(() => {
      wins[idx].countConf.width = width; 
      wins[idx].countConf.height = height; 
      updateConf(); 
    }, 500);
  };

  wins[idx].moveTime = null;
  wins[idx].on('move', () => {
    clearTimeout(wins[idx].moveTime); 

    wins[idx].moveTime = setTimeout(() => {
      const newPos = wins[idx].getPosition(); 
      wins[idx].countConf.posX = newPos[0]; 
      wins[idx].countConf.posY = newPos[1]; 
      updateConf(); 
    }, 500); 

  }); 
};