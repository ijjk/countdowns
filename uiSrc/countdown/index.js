let remote, win, conf; 

try {
  remote = require('electron').remote; 
  win = remote.getCurrentWindow(); 
  conf = win.countConf; 

  // win.webContents.openDevTools(); 

  window.addEventListener('resize', () => {
    win.resized(window.innerWidth, window.innerHeight); 
  });
}
catch(e) {
  console.log('running in preview mode'); 
}

let timer; 

const loadConf = (conf) => {
  clearInterval(timer); 

  const contentEl = document.querySelector('#content'); 
  const countTitle = document.querySelector('#countTitle'); 
  const countEl = document.querySelector('#count'); 

  let winCssWidth = 10; 
  let winCssHeight = 0; 

  if(conf.windowStyle.border) {
    const borderX2 = parseInt(conf.windowStyle.border.split('px')[0]) * 2; 
    
    winCssWidth += borderX2; 
    winCssHeight += borderX2; 
  }

  conf.windowStyle.width = 'calc(100% - ' + winCssWidth + 'px)'; 
  conf.windowStyle.height = 'calc(100% - ' + winCssHeight + 'px)'; 

  Object.assign(contentEl.style, conf.windowStyle); 
  Object.assign(countTitle.style, conf.titleStyle); 
  Object.assign(countEl.style, conf.countStyle); 
  countTitle.innerHTML = conf.title; 

  const parts = conf.order; 

  const updateClock = (ts) => {
    let countStr = ''; 
    let numAdded = 0; 

    parts.forEach((p, idx) => {
      countStr += '<div class="' + conf.labelPos + '">'; 
      let comma = ''; 

      if(idx !== parts.length - 1) {
        comma = ', '; 
      }
      const label = p.substr(0, 1).toUpperCase() + p.substr(1, p.length); 

      switch(conf.labelPos) {
      case 'top': {
        countStr += '<p>' + label + '</p>';
        countStr += '<p>' + ts[p] + '</p>'; 
        break; 
      }
      case 'left': {
        countStr += '<p class="left"> ' + label + ' ' + ts[p] + comma + '</p>'; 
        break; 
      }
      case 'bottom': {
        countStr += '<p>' + ts[p] + '</p>'; 
        countStr += '<p>' + label + '</p>';
        break; 
      }
      // default is right
      default: {
        countStr += '<p>' + ' ' + ts[p] + ' ' + label + comma + '</p>'; 
        break;
      }
      }

      countStr += '</div>'; 
      numAdded += 1; 
    });

    countStr += ''; 
    countEl.innerHTML = countStr; 
  };

  let units = 0; 

  parts.forEach((p) => {
    units = units | countdown[p.toUpperCase()];
  });

  timer = countdown(
    updateClock,
    new Date(conf.destDate),
    units
  ); 

}; 

window.loadConf = loadConf; 

if(conf) {
  loadConf(conf); 
}