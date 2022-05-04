const { exec } = require('node:child_process');

const cmdInRoot = `npm install
truffle migrate --reset`
const cmdInClient = `cd client
npm install`


exec(cmdInRoot, function(err, stdout, stderr) {
    console.log(stdout);
    exec(cmdInClient, function(err, stdout, stderr) {})
})