const remote = require('electron').remote; 
const win = remote.getCurrentWindow(); 
const contentEl = document.querySelector('#content'); 
const countTitle = document.querySelector('#countTitle'); 
const countEl = document.querySelector('#count'); 
const conf = win.countConf; 

// win.webContents.openDevTools(); 

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

const destDate = new Date(conf.destDate); 

const updateClock = () => {
  const curDate = new Date(); 
  const diffSecs = Math.round((destDate - curDate) / 1000); 
  const getDays = diffSecs / (60 * 60 * 24); 
  let numDays = Math.floor(getDays) ; 
      numDays = numDays < 0 ? 0 : numDays; 

  const percOfDay = getDays - Math.floor(getDays); 
  const secsInDay = 86400; 
  const totSecs = secsInDay * percOfDay;
  const getHours = totSecs / 3600; 
  const percOfHour = getHours - Math.floor(getHours); 
  const getMins = 60 * percOfHour; 
  const percOfMin = getMins - Math.floor(getMins); 
  const getSecs = 60 * percOfMin; 

  const [days, hours, mins, secs] = [
    getDays, 
    getHours, 
    getMins, 
    getSecs
  ].map((val) => Math.floor(val)); 

  countEl.innerHTML = days + ' days, ' + hours + ' hours, ' + mins + ' minutes, and ' + secs + ' seconds'; 

  setTimeout(updateClock, 1000); 
};

updateClock(); 