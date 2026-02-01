const fs = require('fs-extra');
const path = require('path');

const publicPath = path.resolve(__dirname, '../public');
const clientPath = path.resolve(__dirname, '../../client/');
const distPath = path.resolve(clientPath, '/dist');


if(!fs.existsSync(clientPath)){
    console.log('copy public skipped, no client folder found');
}else{
    fs.copySync(
        path.resolve(__dirname, distPath),
        path.resolve(__dirname, publicPath)
    )
}