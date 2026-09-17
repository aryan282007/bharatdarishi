const fs = require('fs');
let c = fs.readFileSync('server/seed/seed.js', 'utf8');

c = c.replace(/for \(let i = 0; i < 10; i\+\+\) \{\n\s+let place = createdPlaces/g, 'for (let i = 0; i < 32; i++) {\n      let place = createdPlaces'); // Alerts
c = c.replace(/for \(let i = 0; i < 15; i\+\+\) \{\n\s+let place = createdPlaces\[Math\.floor\(Math\.random\(\) \* createdPlaces\.length\)\];\n\s+let status = \['Assigned'/g, 'for (let i = 0; i < 45; i++) {\n      let place = createdPlaces[Math.floor(Math.random() * createdPlaces.length)];\n      let status = [\\'Assigned\\''); // Govt Actions
c = c.replace(/for \(let i = 0; i < 10; i\+\+\) \{\n\s+let place = createdPlaces\[Math\.floor\(Math\.random\(\) \* createdPlaces\.length\)\];\n\s+if\(\!place\) continue;/g, 'for (let i = 0; i < 30; i++) {\n      let place = createdPlaces[Math.floor(Math.random() * createdPlaces.length)];\n      if(!place) continue;'); // Events
c = c.replace(/for \(let i = 0; i < 5; i\+\+\) \{\n\s+if\(createdPlaces\.length >= 3\)/g, 'for (let i = 0; i < 10; i++) {\n      if(createdPlaces.length >= 3)'); // Circuits
c = c.replace(/for \(let i = 0; i < 15; i\+\+\) \{\n\s+let place = createdPlaces\[Math\.floor\(Math\.random\(\) \* createdPlaces\.length\)\];\n\s+reportsToInsert\.push/g, 'for (let i = 0; i < 25; i++) {\n      let place = createdPlaces[Math.floor(Math.random() * createdPlaces.length)];\n      reportsToInsert.push'); // Reports

fs.writeFileSync('server/seed/seed.js', c);
