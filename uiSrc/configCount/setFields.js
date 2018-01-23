(() => {
  let tmpDateVal = countConf.destDate.getFullYear();
  let tmpDateM = checkAdd0(countConf.destDate.getMonth() + 1);
  let tmpDateD = checkAdd0(countConf.destDate.getDate()); 

  tmpDateVal += '-' + tmpDateM;
  tmpDateVal += '-' + tmpDateD; 

  let tmpTimeH = checkAdd0(countConf.destDate.getHours()); 
  let tmpTimeM = checkAdd0(countConf.destDate.getMinutes()); 

  destDate.value = tmpDateVal; 
  destTime.value = tmpTimeH + ':' + tmpTimeM; 

  title.value = countConf.title; 

  if(countConf.titleStyle.fontFamily) {
    titleFontFamily.value = countConf.titleStyle.fontFamily.split(',')[0].trim(); 
  }

  if(countConf.titleStyle.fontSize) {
    titleFontSize.value = parseInt(countConf.titleStyle.fontSize); 
  }

  if(countConf.titleStyle.color) {
    titleColor.value = countConf.titleStyle.color; 
  }

  if(countConf.titleStyle.textAlign) {
    titleAlign.value = countConf.titleStyle.textAlign; 
  }

  if(countConf.countStyle.color) {
    countdownColor.value = countConf.countStyle.color; 
  }

  if(countConf.countStyle.fontSize) {
    countdownSize.value = parseInt(countConf.countStyle.fontSize); 
  }

  if(countConf.countStyle.fontFamily) {
    countdownFont.value = countConf.countStyle.fontFamily.split(',')[0].trim(); 
  }

  if(countConf.countStyle.textAlign) {
    countdownPos.value = countConf.countStyle.textAlign; 
  }

  labelPosition.value = countConf.labelPos; 

  Object.keys(orderParts).forEach((key) => {
    const el = orderParts[key]; 

    if(countConf.order.indexOf(el.title) > -1) {
      el.checked = true; 
      return; 
    }
    el.checked = false; 
  }); 

  if(countConf.windowStyle.background) {
    const rgb = countConf.windowStyle.background.split(','); 
    const r = parseInt(rgb[0].split('(')[1]);
    const g = parseInt(rgb[1]);
    const b = parseInt(rgb[2]); 
    const a = parseFloat(rgb[3].split(')')[0]); 

    const bgHex = rgbToHex(r, g, b); 
    bgColor.value = bgHex; 
    bgOpacity.value = a; 
  }

  if(countConf.windowStyle.border) {
    const parts = countConf.windowStyle.border.split(' solid '); 
    const width = parseFloat(parts[0]);
    const rgbaColor = parts[1]; 

    const rgb = rgbaColor.split(','); 
    const r = parseInt(rgb[0].split('(')[1]); 
    const g = parseInt(rgb[1]); 
    const b = parseInt(rgb[2]); 
    const a = parseFloat(rgb[3].split(')')[0]); 

    const borderHex = rgbToHex(r, g, b); 

    borderWidth.value = width; 
    borderColor.value = borderHex; 
    borderOpacity.value = a; 
  }

  if(countConf.windowStyle.borderRadius) {
    borderRadius.value = parseFloat(countConf.windowStyle.borderRadius); 
  }

  countWidth.value = countConf.width; 
  countHeight.value = countConf.height; 

  if(!newCount) {
    createBtn.innerHTML = 'Save changes'; 
  }
})(); 