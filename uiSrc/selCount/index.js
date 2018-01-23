/* eslint-disable */

const remote = require('electron').remote; 
const fs = require('fs'); 
const path = require('path'); 
const win = remote.getCurrentWindow(); 

// win.webContents.openDevTools(); 

const _ = (sel) => {
  return document.querySelector(sel); 
}; 

const counts = _('#counts'); 
// counts.innerHTML = JSON.stringify(win.configs); 

const getBtn = (id, editDel) => {
  const btn = document.createElement('button');
  btn.innerText = editDel === 'edit' ? 'Edit' : 'Delete';

  const delFunc = () => {
    const sure = confirm('Are you sure you want to delete this countdown? This can not be undone.'); 
    if(!sure) return; 
    
    const curFile = path.join(win.paths.dataDir, id); 
    fs.unlinkSync(curFile); 
    win.reload(); 
  };

  const editFunc = () => {
    win.createConfigWin(id.split('.json')[0]); 
    win.close(); 
  };

  btn.addEventListener('click', editDel === 'edit' ? editFunc : delFunc );
  
  return btn; 
};

win.configs.forEach((f) => {
  const curFile = path.join(win.paths.dataDir, f); 
  const getConf = fs.readFileSync(curFile).toString(); 
  const conf = JSON.parse(getConf); 
  const wrapWv = document.createElement('div'); 
  wrapWv.style.padding = '5px 0'; 
  wrapWv.style.borderBottom = '1px solid #C0C0C0'; 

  const wv = document.createElement('webview'); 
  wv.src = win.paths.countdown; 
  wv.style.height = conf.height + 'px'; 
  wv.style.width = conf.width + 'px'; 
  
  wv.addEventListener('dom-ready', () => {
    wv.executeJavaScript('window.loadConf(' + getConf + ');'); 
  }); 

  wrapWv.appendChild(wv); 
  wrapWv.appendChild(getBtn(f, 'edit')); 
  wrapWv.appendChild(getBtn(f, 'del'));

  counts.appendChild(wrapWv);
}); 