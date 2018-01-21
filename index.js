const {
  app, 
  BrowserWindow
} = require('electron'); 
const path = require('path'); 
const url = require('url'); 
const fs = require('fs'); 

let win; 

const createWindow = () => {

  win = new BrowserWindow({
    width: 300,
    height: 100,
    x: 0,
    y: 0,
    frame: false,
    movable: true,
    transparent: true,
    skipTaskbar: true,
    focusable: false,
    show: false,
    minimizable: false,
    // closable: false
  });

  
  // load local url
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'src', 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  win.on('closed', () => {
    win = null; 
  });

  win.resized = (width, height) => {
    console.log('resized!!!', width, height); 
  }; 

  win.moveTime = null; 

  win.on('move', () => {
    clearTimeout(win.moveTime); 

    win.moveTime = setTimeout(() => {
      console.log('moved!!!', win.getPosition()); 
    }, 500); 
  }); 

  win.on('ready-to-show', () => {
    win.showInactive(); 
  })

};
// end of createWindow()


app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') {
    app.quit(); 
  }
}); 

app.on('activate', () => {
  if(win === null) {
    createWindow(); 
  }
});