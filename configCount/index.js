let remote = require('electron').remote; 
let win = remote.getCurrentWindow(); 
let configFile, countConf; 
let newCount = true; 

if(win.countConf) {
  newCount = false; 
  configFile = win.configFile; 
  countConf = win.countConf; 
  countConf.destDate = new Date(countConf.destDate); 
}
else {
  countConf = {
    title: 'Countdown to 5 days away',
    titleStyle: {
      color: '#00ffff',
      fontSize: '16px',
      fontFamily: 'sans-serif'
    },
    windowStyle: {
      background: 'rgba(0, 0, 0, 0.5)',
      border: "",
      borderRadius: ""
    },
    width: 300,
    height: 75,
    posY: 0,
    posX: 0,
    destDate: new Date(),
    labelPos: 'bottom',
    order: [
      'days', 'hours', 'minutes', 'seconds'
    ],
    countStyle: {
      color: '#ffffff',
      fontSize: '16px',
      fontFamily: 'sans-serif'
    }
  };

  countConf.destDate.setTime(countConf.destDate.getTime() + (60 * 60 * 24 * 1000 * 5));
}

const _ = (sel) => {
  return document.querySelector(sel); 
}; 

const onChange = (el, cb) => {
  if(el.tagName === 'INPUT') {
    el.addEventListener('keyup', cb, false); 
  } 
  el.addEventListener('change', cb, false); 
}; 

const rgbToHex = (r, g, b) => {
  const getPart = (p) => {
    let hex = p.toString(16);
    return hex.length === 1 ? '0' + hex : hex; 
  }

  return '#' + getPart(r) + getPart(g) + getPart(b); 
};

const hexToRgb = (hex) => {
  hex = hex.replace('#', ''); 

  let full = parseInt(hex, 16);
  let r = (full >> 16) & 255; 
  let g = (full >> 8) & 255;
  let b = full & 255; 

  return {
    r, g, b
  }; 
};

const [
  destDate,
  destTime,
  title,
  titleFontFamily,
  titleFontSize,
  titleColor,
  titleAlign,
  yearsEl,
  monthsEl,
  weeksEl,
  daysEl,
  minutesEl,
  secondsEl,
  labelPosition,
  countdownColor,
  countdownSize,
  countdownFont,
  countdownPos,
  dropRects,
  bgColor,
  bgOpacity,
  borderWidth,
  borderColor,
  borderOpacity,
  borderRadius,
  countWidth,
  countHeight,
  webview,
  createBtn
] = [
  _('#destDate'),
  _('#destTime'),
  _('#title'),
  _('#titleFontFamily'),
  _('#titleFontSize'),
  _('#titleColor'),
  _('#titleAlign'),
  _('#yearsEl'),
  _('#monthsEl'),
  _('#weeksEl'),
  _('#daysEl'),
  _('#minutesEl'),
  _('#secondsEl'),
  _('#labelPosition'),
  _('#countdownColor'),
  _('#countdownSize'),
  _('#countdownFont'),
  _('#countdownPos'),
  _('#dropRects'),
  _('#bgColor'),
  _('#bgOpacity'),
  _('#borderWidth'),
  _('#borderColor'),
  _('#borderOpacity'),
  _('#borderRadius'),
  _('#countWidth'),
  _('#countHeight'),
  _('#webview'),
  _('#createBtn')
]; 

const orderParts = {
  yearsEl,
  monthsEl,
  weeksEl,
  daysEl,
  hoursEl,
  minutesEl,
  secondsEl
};

const checkAdd0 = (val) => {
  return val < 10 ? '0' + val : val;
}; 

require('./setFields'); 

let updateTime = null; 

const updatePrev = () => {
  clearTimeout(updateTime); 

  updateTime = setTimeout(() => {
    webview.style.width = countConf.width + 'px'; 
    webview.style.height = countConf.height + 'px'; 

    webview.executeJavaScript('window.loadConf(' + JSON.stringify(countConf) + ');'); 
  }, 100); 
}

require('./handleChange'); 
require('./handlePartsOrd');  

webview.addEventListener('dom-ready', () => {
  updatePrev(); 
});

createBtn.addEventListener('click', () => {
  const configData = JSON.stringify(countConf, null, 2); 
  const fs = require('fs'); 
  const path = require('path'); 

  createBtn.innerHTML = 'saving...';
  createBtn.disabled = true; 

  if(!newCount) {
    fs.writeFileSync(configFile, configData); 
    win.close();
  }
  else {
    const dataDir = path.join(__dirname, '..', 'data/'); 
    const nextConfIdx = parseInt(
      fs.readdirSync(dataDir)
        .sort((a, b) => a < b)[0]
    ) + 1; 
    const newConfigFile = path.join(dataDir, nextConfIdx + '.json'); 
    fs.writeFileSync(newConfigFile, configData);
    win.close(); 
  }
}); 

