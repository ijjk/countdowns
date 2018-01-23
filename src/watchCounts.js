const fs = require('fs'); 
const path = require('path');
const objDiff = require('deep-diff');  

module.exports = function() {
  const app = this; 
  const changeBuffer = 1250; // milliseconds before acting on change;
  let watchTime = null; 
  
  fs.watch(app.paths.dataDir, (e) => {
    clearTimeout(watchTime); 

    watchTime = setTimeout(() => {
      
      fs.readdir(app.paths.dataDir, (err, files) => {
        if(err) {
          console.error(err); 
          return; 
        }

        const winKeys = Object.keys(app.wins); 
        const winKeysLen = winKeys.length; 
        const filesLen = files.length; 

        // check if countdown deleted
        if(filesLen < winKeysLen) {
          winKeys.forEach((k) => {
            const win = app.wins[k]; 
            let toCheck = path.basename(win.configFile);

            if(files.indexOf(toCheck) < 0) {
              win.destroy(); 
            }
          });
          return;
        }
        
        // check if countdown added
        if(filesLen > winKeysLen) {
          const numAdded = (filesLen - winKeysLen); 

          files.sort((a, b) => a < b); 
          files.splice(numAdded, filesLen); 

          files.forEach((f) => {
            const curFile = path.join(app.paths.dataDir, f); 
            const getConf = fs.readFileSync(curFile).toString(); 
            const conf = JSON.parse(getConf); 

            app.createCount(curFile, conf); 
          });

          return; 
        }

        // a countdown was changed

        files.forEach((f) => {
          const curFile = path.join(app.paths.dataDir, f); 
          const getConf = fs.readFileSync(curFile).toString();
          const newConf = JSON.parse(getConf); 
          const curConf = app.wins[f].countConf; 

          // check if config was changed
          if(JSON.stringify(newConf) === JSON.stringify(curConf)) {
            return; 
          }

          // check what changed 
          let changes = objDiff(curConf, newConf); 
          
          /* 
            if position changed ignore it because
            it has already updated
          */
          switch(changes[path]) {
          case 'posX':
          case 'posY':
            return; 
          default: 
            break; 
          }

          app.wins[f].countConf = newConf; 
          app.wins[f].reload(); 

        });
        
      }); // end of fs.readdir      

    }, changeBuffer); 

  });

};