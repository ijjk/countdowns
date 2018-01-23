const {
  app, 
  Menu,
  Tray
} = require('electron'); 
const path = require('path'); 

app.tray = null; 
app.wins = {}; 
app.paths = {}; 
app.paths.icon = path.join(__dirname, 'icon.png'); 
app.paths.dataDir = path.join(__dirname, 'data'); 
app.paths.uiSrc = path.join(__dirname, 'uiSrc'); 
app.paths.countdown = path.join(app.paths.uiSrc, 'countdown', 'index.html'); 
app.paths.configCount = path.join(app.paths.uiSrc, 'configCount', 'index.html'); 
app.paths.selCount = path.join(app.paths.uiSrc, 'selCount', 'index.html'); 

app.createCount = require('./src/createCountWin').bind(app); 
app.loadCounts = require('./src/loadCounts').bind(app); 
app.createConfigWin = require('./src/createConfigWin').bind(app); 
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

  app.tray.setToolTip('Manage countdowns'); 
  app.tray.setContextMenu(contextMenu); 

  app.loadCounts(); 
  app.createConfigWin(0); 
});
// end of app.on('ready')

app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') {
    app.quit(); 
  }
}); 

app.on('activate', () => {
  if(Object.keys(app.wins) === 0) {
    app.loadCounts(); 
  }
});