const fs = require('fs'); 
const path = require('path'); 

module.exports = function() {
  const app = this; 

  fs.readdir(app.paths.dataDir, (err, files) => {
    if(err) {
      console.error(err); 
    }

    files.forEach((item, idx) => {
      const curFile = path.join(app.paths.dataDir, item); 
      const getConf = fs.readFileSync(curFile).toString(); 
      const conf = JSON.parse(getConf); 

      app.createCount(curFile, conf, idx); 

    }); // end of files.forEach

  });
  
};