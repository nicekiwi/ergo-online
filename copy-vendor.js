const fs = require('fs');

const mp = './node_modules';
const files = [
    { source: `${mp}/`, destination: '' }
]

// destination.txt will be created or overwritten by default.
fs.copyFileSync('source.txt', 'destination.txt');
fs.copyFileSync('source.txt', 'destination.txt');
fs.copyFileSync('source.txt', 'destination.txt');
fs.copyFileSync('source.txt', 'destination.txt');
fs.copyFileSync('source.txt', 'destination.txt');
fs.copyFileSync('source.txt', 'destination.txt');
fs.copyFileSync('source.txt', 'destination.txt');
fs.copyFileSync('source.txt', 'destination.txt');