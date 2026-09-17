const fs = require('fs');
let c = fs.readFileSync('server/seed/seed.js', 'utf8');

c = c.replace(/for \(let i = 1; i <= 100; i\+\+\) \{/g, 'for (let i = 1; i <= 20; i++) {'); // Partners to 20
c = c.replace(/for \(let i = 1; i <= 250; i\+\+\) \{/g, 'for (let i = 1; i <= 50; i++) {'); // Tourists to 50
c = c.replace(/for \(let i = 0; i < 1200; i\+\+\) \{/g, 'for (let i = 0; i < 150; i++) {'); // Bookings to 150
c = c.replace(/for \(let i = 0; i < 650; i\+\+\) \{/g, 'for (let i = 0; i < 50; i++) {'); // Reviews to 50
c = c.replace(/for \(let i = 0; i < 50; i\+\+\) \{/g, 'for (let i = 0; i < 15; i++) {'); // Govt Actions to 15
c = c.replace(/for \(let i = 0; i < 30; i\+\+\) \{/g, 'for (let i = 0; i < 10; i++) {'); // Events & Alerts to 10
c = c.replace(/for \(let i = 0; i < 10; i\+\+\) \{/g, 'for (let i = 0; i < 5; i++) {'); // Circuits to 5
c = c.replace(/for \(let i = 0; i < 25; i\+\+\) \{/g, 'for (let i = 0; i < 10; i++) {'); // Reports to 10

fs.writeFileSync('server/seed/seed.js', c);
