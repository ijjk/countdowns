const {
  app, 
  Menu,
  Tray
} = require('electron'); 
const fs = require('fs'); 
const path = require('path'); 

// handle squirrel events
if(require('./src/handleSquirrel').bind(app)()) {
  app.quit(); 
  return; 
}

// only allow singleInstance of app

const shouldQuit = app.makeSingleInstance((commandLine, workingDir) => {
  return true; 
});

if(shouldQuit) {
  app.quit(); 
  return; 
}

app.tray = null; 
app.wins = {}; 
app.paths = {}; 
app.paths.icon = path.join(__dirname, 'icon.png'); 
app.paths.dataDir = path.join(__dirname, 'data'); 
app.paths.uiSrc = path.join(__dirname, 'uiSrc'); 
app.paths.countdown = path.join(app.paths.uiSrc, 'countdown', 'index.html'); 
app.paths.configCount = path.join(app.paths.uiSrc, 'configCount', 'index.html'); 
app.paths.selCount = path.join(app.paths.uiSrc, 'selCount', 'index.html'); 

// make sure data dir exists
try {
  fs.readdirSync(app.paths.dataDir); 
}
catch(e) {
  if(e.code === 'ENOENT') {
    fs.mkdirSync(app.paths.dataDir); 
  }
}


app.createCount = require('./src/createCountWin').bind(app); 
app.loadCounts = require('./src/loadCounts').bind(app); 
app.createConfigWin = require('./src/createConfigWin').bind(app); 
app.selCountWin = null; 
app.createSelectWin = require('./src/createSelectWin').bind(app); 
app.watchCounts = require('./src/watchCounts').bind(app)(); 

app.on('ready', () => {
  app.tray = new Tray(app.paths.icon); 

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'New countdown', 
      type: 'normal',
      click: () => {
        app.createConfigWin();  
      }
    },
    {
      label: 'Edit countdowns',
      type: 'normal',
      click: () => {
        if(app.selCountWin) {
          app.selCountWin.focus(); 
          return; 
        }
        app.createSelectWin();
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

  app.tray.setToolTip('Manage countdowns'); 
  app.tray.setContextMenu(contextMenu); 

  // check if first run
  require('./src/firstRun').bind(app)(); 

  app.loadCounts(); 
});
// end of app.on('ready')

app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') {
    // don't quit so icon stays in tray
    // app.quit(); 
  }
}); 

app.on('activate', () => {
  if(Object.keys(app.wins) === 0) {
    app.loadCounts(); 
  }
});