/* eslint-disable */

(() => {

  const getFont = (font) => {
    return font.trim().length === 0 
      ? 'sans-serif' 
      : font.trim() + ', sans-serif'; 
  };

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
  };
  
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
  });
  
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
  };
  
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
    countConf.width = parseInt(countWidth.value); 
    updatePrev(); 
  });
  
  onChange(countHeight, () => {
    countConf.height = parseInt(countHeight.value); 
    updatePrev(); 
  }); 
  

})();