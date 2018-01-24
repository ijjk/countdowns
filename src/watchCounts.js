const fs = require('fs'); 
const path = require('path');

module.exports = function() {
  const app = this; 
  app.changeBuffer = 850; // milliseconds before acting on change;
  let watchTime = null; 
  
  fs.watch(app.paths.dataDir, () => {
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

          // check if config was actually changed
          if(JSON.stringify(newConf) === JSON.stringify(curConf)) {
            return; 
          }

          const curSize = app.wins[f].getSize(); 
          app.wins[f].countConf = Object.assign({}, newConf); 
          app.wins[f].reload(); 
          
          if(curSize[0] != newConf.width ||
            curSize[1] != newConf.height)
          {
            app.wins[f].ignoreResize = true; 
            app.wins[f].setSize(newConf.width, newConf.height); 
            app.wins[f].width = newConf.width; 
            app.wins[f].height = newConf.height; 
          }

        });
        
      }); // end of fs.readdir      

    }, app.changeBuffer); 

  });

};