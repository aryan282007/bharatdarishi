const fs = require('fs');
const path = 'client/src/pages/AIPlanner.jsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/    days: "3 Days",/g, '    duration: "3 Days",');
content = content.replace(/    days: "4 Days",/g, '    duration: "4 Days",');
content = content.replace(/    days: "5 Days",/g, '    duration: "5 Days",');
content = content.replace(/    days: "7 Days",/g, '    duration: "7 Days",');

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed duplicate keys in AIPlanner.jsx');
