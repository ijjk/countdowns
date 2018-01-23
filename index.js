const {
  app, 
  BrowserWindow,
  Menu,
  Tray
} = require('electron'); 
const path = require('path'); 
const url = require('url'); 
const fs = require('fs'); 

let tray = null; 
let wins = []; 

const icon = path.join(__dirname, 'icon.png'); 
const dataDir = path.join(__dirname, 'data'); 
const countdownIndex = path.join(__dirname, 'countdown', 'index.html'); 
const configCountIndex = path.join(__dirname, 'configCount', 'index.html'); 
const selCountIndex = path.join(__dirname, 'selCount', 'index.html'); 

const createCount = (configFile, conf, idx) => {
  
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
    pathname: countdownIndex,
    protocol: 'file:',
    slashes: true
  })); 

  wins[idx].on('closed', () => {
    delete wins[idx];
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

const createWindows = () => {

  fs.readdir(path.join(__dirname, 'data'), (err, files) => {
    if(err) {
      console.error(err); 
    }

    files.forEach((item, idx) => {
      const curFile = path.join(dataDir, item); 
      const getConf = fs.readFileSync(curFile).toString(); 
      const conf = JSON.parse(getConf); 

      createCount(curFile, conf, idx); 

    }); // end of files.forEach

  });
  
};
// end of createWindows()

let watchTime = null; 
// watch data dir for changes and update countdowns that changed
fs.watch(
  dataDir,

  (data) => {
    clearTimeout(watchTime); 

    watchTime = setTimeout(() => {
      
    }, 1000); 

  }); 


let configCountWin = null; 

const makeConfigCount = (countId) => {
  configCountWin = new BrowserWindow({
    icon,
    title: 'Configure countdown',
    height: 600,
    width: 600,
    minWidth: 500,
    autoHideMenuBar: true
  });

  configCountWin.loadURL(url.format({
    pathname: configCountIndex,
    protocol: 'file:',
    slashes: true
  })); 

  if(countId) {
    const configFile = path.join(dataDir, countId + '.json'); 
  
    configCountWin.configFile = configFile; 
    configCountWin.countConf = JSON.parse(
      fs.readFileSync(configFile).toString());
  }

  configCountWin.on('close', () => {
    configCountWin = null; 
  });   
}; 
// end of makeNewCountWindow

app.on('ready', () => {
  tray = new Tray(icon); 

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'New countdown', 
      type: 'normal',
      click: () => {
        if(configCountWin) return; 
        makeConfigCount(); 
      }
    },
    {
      label: 'Edit countdowns',
      type: 'normal',
      click: () => {
        console.log('edit clicked');  
      }
    },
    {
      label: 'Exit completely',
      type: 'normal',
      click: () => {
        app.exit(); 
      }
    }
  ]); 

  tray.setToolTip('Manage countdowns'); 
  tray.setContextMenu(contextMenu); 

  createWindows(); 
});
// end of app.on('ready')

app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') {
    app.quit(); 
  }
}); 

app.on('activate', () => {
  if(win.length === 0) {
    createWindows(); 
  }
});