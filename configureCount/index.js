const _ = (sel) => {
  return document.querySelector(sel); 
}; 

const onChange = (el, cb) => {
  if(el.tagName === 'INPUT') {
    el.addEventListener('keyup', cb, false); 
  } 
  el.addEventListener('change', cb, false); 
}; 

let tmpDestDate = new Date(); 
    tmpDestDate.setTime(tmpDestDate.getTime() + (60 * 60 * 24 * 1000 * 5)); 

let countConf = {
  title: 'Countdown to',
  titleStyle: {
    color: 'cyan',
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
  posX: 0,
  posY: 0,
  destDate: tmpDestDate,
  labelPos: 'bottom',
  order: [
    'days', 'hours', 'minutes'
  ],
  countStyle: {
    color: '#ffffff',
    fontSize: '16px',
    fontFamily: 'sans-serif'
  }
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

const checkAdd0 = (val) => {
  return val < 10 ? '0' + val : val;
}; 

let tmpDateVal = tmpDestDate.getFullYear();
let tmpDateM = checkAdd0(tmpDestDate.getMonth() + 1);
let tmpDateD = checkAdd0(tmpDestDate.getDate()); 

tmpDateVal += '-' + tmpDateM;
tmpDateVal += '-' + tmpDateD; 

let tmpTimeH = checkAdd0(tmpDestDate.getHours()); 
let tmpTimeM = checkAdd0(tmpDestDate.getMinutes()); 

destDate.value = tmpDateVal; 
destTime.value = tmpTimeH + ':' + tmpTimeM; 

let updateTime = null; 

const updatePrev = () => {
  clearTimeout(updateTime); 

  updateTime = setTimeout(() => {
    webview.style.width = countConf.width + 'px'; 
    webview.style.height = countConf.height + 'px'; 

    webview.executeJavaScript('window.loadConf(' + JSON.stringify(countConf) + ');'); 
  }, 100); 
}

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

const getFont = (font) => {
  return font.trim().length === 0 
    ? 'sans-serif' 
    : font.trim() + ', sans-serif'; 
}

const updateDestTime = () => {
  const parseParts = destTime.value.split(':');
  const hour = parseInt(parseParts[0]);
  const min = parseInt(parseParts[1]); 
  countConf.destDate.setHours(hour, min); 
};

onChange(destDate, () => {
  const parseDate = destDate.value.split('-').map((i) => parseInt(i)); 
  countConf.destDate = new Date(parseDate); 
  updateDestTime();  
  updatePrev(); 
}); 

onChange(destTime, () => {
  updateDestTime();
  updatePrev();  
}); 

onChange(title, () => {
  countConf.title = title.value.trim(); 
  updatePrev(); 
});

const upTitleStyle = (obj) => {
  countConf.titleStyle = Object.assign(
    countConf.titleStyle,
    obj
  );
  updatePrev();  
}

onChange(titleFontFamily, () => {
  upTitleStyle({
      fontFamily: getFont(titleFontFamily.value)
  });
}); 

onChange(titleFontSize, () => {
  upTitleStyle({
      fontSize: titleFontSize.value.trim() + 'px'
  });
}); 

onChange(titleColor, () => {
  upTitleStyle({
      color: titleColor.value.trim()
  }); 
}); 

onChange(titleAlign, () => {
  upTitleStyle({
    textAlign: titleAlign.value
  }); 
});

onChange(labelPosition, () => {
  countConf.labelPos = labelPosition.value; 
  updatePrev(); 
});

const upCountStyle = (obj) => {
  countConf.countStyle = Object.assign(
    countConf.countStyle,
    obj
  ); 
  updatePrev(); 
};

onChange(countdownColor, () => {
  upCountStyle({
    color: countdownColor.value
  });
});

onChange(countdownSize, () => {
  upCountStyle({
    fontSize: countdownSize.value + 'px'
  }); 
});

onChange(countdownFont, () => {
  upCountStyle({
    fontFamily: getFont(countdownFont.value)
  });
});

onChange(countdownPos, () => {
  upCountStyle({
    textAlign: countdownPos.value
  }); 
})

const upWinStyle = (obj) => {
  countConf.windowStyle = Object.assign(
    countConf.windowStyle,
    obj
  ); 
  updatePrev(); 
}; 

const getRgba = (hexEl, opacityEl) => {
  const rgb = hexToRgb(hexEl.value); 
  const r = rgb.r; 
  const g = rgb.g; 
  const b = rgb.b; 
  const a = opacityEl ? opacityEl.value : 1; 
  return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')'; 
};

const upWinBg = () => {
  upWinStyle({
    background: getRgba(bgColor, bgOpacity)
  }); 
}

onChange(bgColor, upWinBg);
onChange(bgOpacity, upWinBg); 

const upWinBorder = () => {
  let border = borderWidth.value.trim() + 'px';
  border += ' solid '; 
  border += getRgba(borderColor, borderOpacity); 

  upWinStyle({
    border
  }); 
}; 

onChange(borderWidth, upWinBorder); 
onChange(borderColor, upWinBorder); 
onChange(borderOpacity, upWinBorder); 

onChange(borderRadius, () => {
  upWinStyle({
    borderRadius: borderRadius.value.trim() + 'px'
  }); 
}); 

onChange(countWidth, () => {
  countConf.width = countWidth.value.trim(); 
  updatePrev(); 
});

onChange(countHeight, () => {
  countConf.height = countHeight.value.trim(); 
  updatePrev(); 
}); 

const orderParts = [
  yearsEl,
  monthsEl,
  weeksEl,
  daysEl,
  hoursEl,
  minutesEl,
  secondsEl
]; 

const updateOrder = () => {
  const dropRectChldrn = dropRects.children; 
  let order = []; 

  for(let i = 0; i < dropRectChldrn.length; i++) {
    const child = dropRectChldrn[i]; 
    const childsChild = child.children[0]; 
    order.push(childsChild.id.replace('OrdEl', ''));
  }

  countConf.order = order;
  updatePrev(); 
}; 

const updateOrderParts = (e) => {
  let rectIdx = 0; 
  
  dropRects.innerHTML = null; 

  orderParts.forEach((el) => {
    if(!el.checked) return; 

    const dropRect = document.createElement('div');
   
    dropRect.addEventListener('drop', (e) => {
      const id = e.dataTransfer.getData('id');
      const dropRectChldrn = dropRect.children; 

      if(dropRectChldrn.length > 0) {
        const dropRectsChldrn = dropRects.children; 

        for(let i = 0; i < dropRectsChldrn.length; i++) {
          const child = dropRectsChldrn[i]; 
          const childsChild = child.children[0]; 

          if(childsChild.id === id) {
            child.appendChild(dropRectChldrn[0]); 
            break; 
          }
        }
      }

      dropRect.innerHTML = ''; 
      dropRect.appendChild(_('#' + id));  

      updateOrder(); 
      e.preventDefault(); 
    });
   
    dropRect.addEventListener('dragover', (e) => {
      e.preventDefault(); 
    }); 
   
    dropRects.appendChild(dropRect);

    const dragRect = document.createElement('div'); 
    dragRect.innerHTML = el.title; 
    dragRect.id = el.title + 'OrdEl'; 
    dragRect.draggable = true; 
    
    dragRect.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('id', el.title + 'OrdEl'); 
    }); 
 
    dropRect.appendChild(dragRect); 

    rectIdx += 1;  
  });
  
  updateOrder(); 
};

orderParts.forEach((el) => {
  onChange(el, updateOrderParts); 
}); 

// do first run 
updateOrderParts(); 

webview.addEventListener('dom-ready', () => {
  updatePrev(); 
});

createBtn.addEventListener('click', () => {
  console.log('do something'); 
}); 

