const fs = require('fs'); 

module.exports = function() {
  const app = this; 
  const changeBuffer = 1000; // milliseconds before acting on change;
  let watchTime = null; 
  
  fs.watch(app.paths.dataDir, (e) => {
    clearTimeout(watchTime); 

    watchTime = setTimeout(() => {
      console.log(e); 

    }, changeBuffer); 

  });

};