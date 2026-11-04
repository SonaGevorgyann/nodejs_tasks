const fs = require('fs');
const path = require('path');

console.log('Start');
const data = fs.readFileSync(path.join(__dirname, 'sample.txt'), 'utf8');
console.log(data);
console.log('End');