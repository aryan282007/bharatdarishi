const fs = require('fs');
let c = fs.readFileSync('server/seed/seed.js', 'utf8');

// Replace sequential awaits with push and insertMany
c = c.replace(/createdAdmins\.push\(await User\.create\(\{/g, 'createdAdmins.push({');
c = c.replace(/createdPartners\.push\(await User\.create\(\{/g, 'createdPartners.push({');
c = c.replace(/createdTourists\.push\(await User\.create\(\{/g, 'createdTourists.push({');
c = c.replace(/console\.log\(\"Users seeded\.\"\);/g, 'const allU = await User.insertMany([...createdAdmins, ...createdPartners, ...createdTourists]); createdAdmins.length = 0; createdPartners.length = 0; createdTourists.length = 0; allU.forEach(u => { if (u.role.includes(\"ADMIN\") || u.role === \"TOURISM_AUTHORITY\" || u.role.includes(\"MANAGER\") || u.role.includes(\"OFFICER\")) createdAdmins.push(u); else if (u.role === \"devotee\") createdTourists.push(u); else createdPartners.push(u); }); console.log(\"Users seeded.\");');

c = c.replace(/createdPlaces\.push\(await Place\.create\(\{/g, 'createdPlaces.push({');
c = c.replace(/console\.log\(\"Destinations seeded\.\"\);/g, 'const dbPlaces = await Place.insertMany(createdPlaces); createdPlaces.length = 0; createdPlaces.push(...dbPlaces); console.log(\"Destinations seeded.\");');

c = c.replace(/await Infrastructure\.create\(\{/g, 'infras.push({');
c = c.replace(/const infraCategories =/g, 'const infras = []; const infraCategories =');
c = c.replace(/\/\/ 4\. Alerts/g, 'await Infrastructure.insertMany(infras); console.log(\"Infra seeded\"); // 4. Alerts');

c = c.replace(/await Alert\.create\(\{/g, 'alerts.push({');
c = c.replace(/let alertsCreated = 0;/g, 'let alertsCreated = 0; const alerts = [];');
c = c.replace(/\/\/ 5\. Govt Actions/g, 'await Alert.insertMany(alerts); console.log(\"Alerts seeded\"); // 5. Govt Actions');

c = c.replace(/await GovernmentAction\.create\(\{/g, 'actions.push({');
c = c.replace(/let actionsCreated = 0;/g, 'let actionsCreated = 0; const actions = [];');
c = c.replace(/\/\/ 6\. Bookings/g, 'await GovernmentAction.insertMany(actions); console.log(\"Actions seeded\"); // 6. Bookings');

c = c.replace(/await Booking\.create\(\{/g, 'bookings.push({');
c = c.replace(/let bookingsCreated = 0;/g, 'let bookingsCreated = 0; const bookings = [];');
c = c.replace(/\/\/ 7\. Reviews/g, 'await Booking.insertMany(bookings); console.log(\"Bookings seeded\"); // 7. Reviews');

c = c.replace(/await Review\.create\(\{/g, 'reviews.push({');
c = c.replace(/let reviewsCreated = 0;/g, 'let reviewsCreated = 0; const reviews = [];');
c = c.replace(/\/\/ 8\. Events/g, 'await Review.insertMany(reviews); console.log(\"Reviews seeded\"); // 8. Events');

c = c.replace(/await Event\.create\(\{/g, 'events.push({');
c = c.replace(/let eventsCreated = 0;/g, 'let eventsCreated = 0; const events = [];');
c = c.replace(/\/\/ 9\. Circuits/g, 'await Event.insertMany(events); console.log(\"Events seeded\"); // 9. Circuits');

c = c.replace(/await TourismCircuit\.create\(\{/g, 'circuits.push({');
c = c.replace(/let circuitsCreated = 0;/g, 'let circuitsCreated = 0; const circuits = [];');
c = c.replace(/console\.log\(\\\/g, 'await TourismCircuit.insertMany(circuits); console.log(\"Circuits seeded\"); console.log(\\');

fs.writeFileSync('server/seed/seed.js', c);
