const remote = require('electron').remote; 
const win = remote.getCurrentWindow(); 
const contentEl = document.querySelector('#content'); 
const countTitle = document.querySelector('#countTitle'); 
const countEl = document.querySelector('#count'); 
const conf = win.countConf; 

win.webContents.openDevTools(); 

let winCssWidth = 10; 
let winCssHeight = 10; 

if(conf.windowStyle.border) {
  const borderX2 = parseInt(conf.windowStyle.border.split('px')[0]) * 2; 
  
  winCssWidth += borderX2; 
  winCssHeight += borderX2; 
}

conf.windowStyle.width = 'calc(100% - ' + winCssWidth + 'px)'; 
conf.windowStyle.height = 'calc(100% - ' + winCssHeight + 'px)'; 

Object.assign(document.body.style, conf.windowStyle); 
Object.assign(countTitle.style, conf.titleStyle); 
Object.assign(countEl.style, conf.countStyle); 
countTitle.innerHTML = conf.title; 

window.addEventListener('resize', () => {
    win.resized(window.innerWidth, window.innerHeight); 
});

const parts = [
  'years',
  'months',
  'weeks',
  'days',
  'hours',
  'minutes',
  'seconds'
];

const updateClock = (ts) => {
  let countStr = ''; 
  let numAdded = 0; 

  parts.forEach((p) => {
    if(conf[p]) {

      if(numAdded > 0) {
        countStr += ', '; 
      }
      
      countStr += ts[p] + ' ' + p; 
      numAdded += 1; 
    }
  });

  countEl.innerHTML = countStr; 
};

let units = 0; 

parts.forEach((p) => {
  if(conf[p]) {
    units = units | countdown[p.toUpperCase()]
  }
});

const timer = countdown(
  updateClock,
  new Date(conf.destDate),
  units); 