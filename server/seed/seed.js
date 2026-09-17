require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Place = require('../models/Place');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Event = require('../models/Event');
const GovernmentAction = require('../models/GovernmentAction');
const TourismCircuit = require('../models/TourismCircuit');
const SiteAlert = require('../models/SiteAlert');
const Alert = require('../models/Alert');
const Infrastructure = require('../models/Infrastructure');
const Report = require('../models/Report');
const { calculateReadiness, calculateGapScore, getGapPriority, calculateServiceAvailability, calculateImpactScore, getImpactLevel } = require('../services/tourism/tourismService');

const isReset = process.argv.includes('--reset');

const mpDestinations = [
  { name: 'Ujjain', state: 'Madhya Pradesh', city: 'Ujjain', category: 'Spiritual', desc: 'Ancient city known for Mahakaleshwar Jyotirlinga.', lat: 23.1793, lng: 75.7849, demand: 95, gap: 10, impact: 90 },
  { name: 'Mandu', state: 'Madhya Pradesh', city: 'Dhar', category: 'Heritage', desc: 'Ruined city celebrated for its fine architecture.', lat: 22.3375, lng: 75.3942, demand: 80, gap: 75, impact: 85 },
  { name: 'Pachmarhi', state: 'Madhya Pradesh', city: 'Narmadapuram', category: 'Nature', desc: 'Queen of Satpura, a hill station.', lat: 22.4674, lng: 78.4346, demand: 60, gap: 40, impact: 65 },
  { name: 'Maheshwar', state: 'Madhya Pradesh', city: 'Khargone', category: 'Heritage', desc: 'Town on the north bank of the Narmada River.', lat: 22.1759, lng: 75.5864, demand: 50, gap: 30, impact: 60 },
  { name: 'Khajuraho', state: 'Madhya Pradesh', city: 'Chhatarpur', category: 'Heritage', desc: 'Famous for its ancient temples.', lat: 24.8318, lng: 79.9199, demand: 85, gap: 20, impact: 88 },
  { name: 'Sanchi', state: 'Madhya Pradesh', city: 'Raisen', category: 'Heritage', desc: 'Buddhist complex, famous for its Great Stupa.', lat: 23.4871, lng: 77.7397, demand: 75, gap: 25, impact: 70 },
  { name: 'Orchha', state: 'Madhya Pradesh', city: 'Niwari', category: 'Heritage', desc: 'Town established by Rajput rulers.', lat: 25.3524, lng: 78.6423, demand: 70, gap: 35, impact: 68 },
  { name: 'Omkareshwar', state: 'Madhya Pradesh', city: 'Khandwa', category: 'Spiritual', desc: 'Hindu temple dedicated to Shiva.', lat: 22.2447, lng: 76.1472, demand: 88, gap: 50, impact: 75 },
  { name: 'Bhimbetka', state: 'Madhya Pradesh', city: 'Raisen', category: 'Heritage', desc: 'Archaeological site of rock shelters.', lat: 22.9372, lng: 77.6186, demand: 45, gap: 60, impact: 55 },
  { name: 'Chanderi', state: 'Madhya Pradesh', city: 'Ashoknagar', category: 'Heritage', desc: 'Town of historical importance.', lat: 24.7153, lng: 78.1345, demand: 35, gap: 55, impact: 40 },
  { name: 'Amarkantak', state: 'Madhya Pradesh', city: 'Anuppur', category: 'Nature', desc: 'Pilgrim town, origin of Narmada River.', lat: 22.6780, lng: 81.7584, demand: 55, gap: 65, impact: 60 },
  { name: 'Bhopal', state: 'Madhya Pradesh', city: 'Bhopal', category: 'Culture', desc: 'City of lakes and capital of MP.', lat: 23.2599, lng: 77.4126, demand: 90, gap: 15, impact: 82 },
  { name: 'Jabalpur', state: 'Madhya Pradesh', city: 'Jabalpur', category: 'Nature', desc: 'Known for marble rocks on Narmada River.', lat: 23.1815, lng: 79.9864, demand: 78, gap: 28, impact: 74 },
  { name: 'Gwalior', state: 'Madhya Pradesh', city: 'Gwalior', category: 'Heritage', desc: 'Known for its hilltop fort.', lat: 26.2124, lng: 78.1772, demand: 82, gap: 20, impact: 78 },
  { name: 'Rewa', state: 'Madhya Pradesh', city: 'Rewa', category: 'Nature', desc: 'Land of white tigers.', lat: 24.5373, lng: 81.3042, demand: 40, gap: 45, impact: 45 },
  { name: 'Pench', state: 'Madhya Pradesh', city: 'Seoni', category: 'Nature', desc: 'National park famous for tigers.', lat: 21.6669, lng: 79.6133, demand: 68, gap: 50, impact: 65 },
  { name: 'Kanha', state: 'Madhya Pradesh', city: 'Mandla', category: 'Nature', desc: 'Largest national park in MP.', lat: 22.3345, lng: 80.6115, demand: 72, gap: 45, impact: 70 },
  { name: 'Bandhavgarh', state: 'Madhya Pradesh', city: 'Umaria', category: 'Nature', desc: 'National park with high tiger density.', lat: 23.7225, lng: 80.9995, demand: 65, gap: 55, impact: 62 },
  { name: 'Burhanpur', state: 'Madhya Pradesh', city: 'Burhanpur', category: 'Heritage', desc: 'Historical town.', lat: 21.3129, lng: 76.2238, demand: 30, gap: 70, impact: 35 },
  { name: 'Shivpuri', state: 'Madhya Pradesh', city: 'Shivpuri', category: 'Nature', desc: 'Known for Madhav National Park.', lat: 25.4283, lng: 77.6534, demand: 35, gap: 60, impact: 40 }
];

async function seed() {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI not found in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    if (isReset) {
      console.log("Resetting ONLY DEMO records...");
      const resCount = {
        Places: await Place.deleteMany({ isDemo: true }),
        Users: await User.deleteMany({ isDemo: true }),
        Bookings: await Booking.deleteMany({ isDemo: true }),
        Reviews: await Review.deleteMany({ isDemo: true }),
        Events: await Event.deleteMany({ isDemo: true }),
        GovtActions: await GovernmentAction.deleteMany({ isDemo: true }),
        Circuits: await TourismCircuit.deleteMany({ isDemo: true }),
        Alerts: await Alert.deleteMany({ isDemo: true }),
        Infra: await Infrastructure.deleteMany({ isDemo: true }),
        Reports: await Report.deleteMany({ isDemo: true })
      };
      console.log("Deleted demo records:", Object.fromEntries(Object.entries(resCount).map(([k, v]) => [k, v.deletedCount])));
      process.exit(0);
    }

    console.log("Starting FAST seed process...");

    // Pre-hash password for fast insertMany
    const passwordHash = await bcrypt.hash('password123', 10);
    
    // 1. Users & Partners
    const adminRoles = ['SUPER_ADMIN', 'TOURISM_AUTHORITY', 'VERIFICATION_OFFICER', 'CONTENT_MANAGER', 'SUPPORT_ADMIN'];
    const usersToInsert = [];
    
    for (let role of adminRoles) {
      usersToInsert.push({
        name: `Demo ${role}`, email: `${role.toLowerCase()}@demo.com`, password: passwordHash, role: role, isDemo: true
      });
    }

    const partnerTypes = ['guide', 'hotel', 'artisan', 'driver', 'experience_provider', 'tour_operator', 'local_business'];
    for (let i = 1; i <= 20; i++) {
      let vStatus = i <= 60 ? 'Verified' : i <= 70 ? 'Pending' : i <= 77 ? 'Under Review' : i <= 82 ? 'Changes Requested' : 'Rejected';
      let hist = [{ status: 'Pending', note: 'Application submitted', updatedAt: new Date(Date.now() - 5*24*60*60*1000) }];
      if (vStatus !== 'Pending') hist.push({ status: vStatus, note: 'Status updated', updatedAt: new Date() });

      usersToInsert.push({
        name: `Local Partner ${i}`,
        email: `partner${i}@demo.com`,
        password: passwordHash,
        role: partnerTypes[i % partnerTypes.length],
        verificationStatus: vStatus,
        verificationHistory: hist,
        isDemo: true
      });
    }

    for (let i = 1; i <= 50; i++) {
      usersToInsert.push({
        name: `Tourist ${i}`, email: `tourist${i}@demo.com`, password: passwordHash, role: 'tourist', isDemo: true
      });
    }

    // Attempt insertMany, ignore duplicates safely if email exists
    let createdUsers = [];
    try {
      createdUsers = await User.insertMany(usersToInsert, { ordered: false });
    } catch (err) {
      // If some duplicate emails exist, ordered: false will insert the non-duplicates.
      // We will just fetch all demo users
      if (err.code === 11000) {
        console.log("Some users already existed, fetching demo users...");
      } else {
        throw err;
      }
    }
    
    // Fetch all demo users to use their IDs for relations
    const allDemoUsers = await User.find({ isDemo: true });
    
    const createdAdmins = allDemoUsers.filter(u => adminRoles.includes(u.role));
    const createdTourists = allDemoUsers.filter(u => u.role === 'tourist');
    const createdPartners = allDemoUsers.filter(u => partnerTypes.includes(u.role));
    
    console.log(`Users seeded (Total Demo Users: ${allDemoUsers.length}).`);

    // 2. Destinations
    
    const placesToInsert = [];
    for (let d of mpDestinations) {
      let slug = d.name.toLowerCase().replace(/ /g, '-') + '-demo';
      
      // Default baseline
      let metrics = {
        demand: Math.floor(40 + Math.random() * 40),
        transport: Math.floor(40 + Math.random() * 40),
        accommodation: Math.floor(40 + Math.random() * 40),
        sanitation: Math.floor(40 + Math.random() * 40),
        safety: Math.floor(50 + Math.random() * 30),
        medical: Math.floor(40 + Math.random() * 40),
        information: Math.floor(40 + Math.random() * 40),
        localServices: Math.floor(40 + Math.random() * 40),
        
        economicActivity: Math.floor(40 + Math.random() * 40),
        employment: Math.floor(40 + Math.random() * 40),
        visitorGrowth: Math.floor(40 + Math.random() * 40),
        localParticipation: Math.floor(40 + Math.random() * 40),
        satisfaction: Math.floor(50 + Math.random() * 30)
      };

      // Intentional Scenarios
      if (d.name === 'Mandu') { // HIGH IMPACT + HIGH GAP
        metrics = {
          demand: 91,
          transport: 31,
          accommodation: 70,
          sanitation: 42,
          safety: 80,
          medical: 54,
          information: 62,
          localServices: 47,
          
          economicActivity: 88,
          employment: 72,
          satisfaction: 86,
          localParticipation: 91,
          visitorGrowth: 82
        };
      } else if (d.name === 'Ujjain') { // HIGH IMPACT + LOW GAP
        metrics = {
          demand: 94,
          transport: 85,
          accommodation: 92,
          sanitation: 80,
          safety: 95,
          medical: 78,
          information: 90,
          localServices: 88,
          
          economicActivity: 95,
          employment: 88,
          satisfaction: 92,
          localParticipation: 85,
          visitorGrowth: 80
        };
      } else if (d.name === 'Chanderi') { // EMERGING
        metrics = {
          demand: 55,
          transport: 45,
          accommodation: 40,
          sanitation: 50,
          safety: 60,
          medical: 40,
          information: 55,
          localServices: 65,
          
          economicActivity: 60,
          employment: 65,
          satisfaction: 85,
          localParticipation: 90,
          visitorGrowth: 95
        };
      } else if (d.name === 'Pachmarhi') { // LOW IMPACT + LOW GAP
        metrics = {
          demand: 40,
          transport: 80,
          accommodation: 75,
          sanitation: 70,
          safety: 85,
          medical: 65,
          information: 70,
          localServices: 60,
          
          economicActivity: 45,
          employment: 50,
          satisfaction: 70,
          localParticipation: 55,
          visitorGrowth: 35
        };
      }

      metrics.serviceAvailability = calculateServiceAvailability(metrics);

      let gapScore = calculateGapScore(metrics);
      let readinessScore = calculateReadiness(metrics);
      let impactScore = calculateImpactScore(metrics);
      
      let scores = {
        gapScore: gapScore,
        gapPriority: getGapPriority(gapScore),
        readinessScore: readinessScore,
        impactScore: impactScore,
        impactLevel: getImpactLevel(impactScore),
        calculatedAt: new Date()
      };

      placesToInsert.push({
        id: slug,
        name: d.name,
        subtitle: d.desc,
        city: d.city,
        state: d.state,
        category: d.category,
        description: d.desc,
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&q=80&w=800',
        coordinates: { lat: d.lat, lng: d.lng },
        isDemo: true,
        isPublished: true,
        metrics: metrics,
        scores: scores
      });
    }

    let createdPlaces = [];
    try {
      await Place.insertMany(placesToInsert, { ordered: false });
    } catch(e) {}
    createdPlaces = await Place.find({ isDemo: true });
    console.log(`Destinations seeded (${createdPlaces.length}).`);

    // 3. Infrastructure
    await Infrastructure.deleteMany({ isDemo: true }); // Clear to avoid infinitely stacking on re-seeds
    const infrasToInsert = [];
    const infraCategories = ['transport', 'accommodation', 'sanitation', 'medical', 'information', 'safety'];
    const conditionEnum = ['poor', 'moderate', 'good', 'excellent'];
    for (let place of createdPlaces) {
      for (let cat of infraCategories) {
        let condIndex = Math.floor(Math.random() * 4);
        if (place.gapScore > 60 && cat === 'transport') condIndex = 0; // High gap = poor transport
        if (place.gapScore < 30) condIndex = 3; // Low gap = excellent
        
        infrasToInsert.push({
          destination: place._id,
          category: cat,
          availability: conditionEnum[condIndex],
          condition: conditionEnum[condIndex],
          capacity: Math.floor(Math.random() * 100),
          issueCount: Math.floor(Math.random() * 10),
          isDemo: true
        });
      }
    }
    await Infrastructure.insertMany(infrasToInsert);
    console.log("Infrastructure seeded.");

    // 4. Alerts
    await Alert.deleteMany({ isDemo: true });
    const alertsToInsert = [];
    const alertCats = ['safety', 'scam', 'transport', 'medical', 'infrastructure', 'weather'];
    const alertSeverities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    const alertStatuses = ['OPEN', 'INVESTIGATING', 'RESOLVED'];
    for (let i = 0; i < 5; i++) {
      let place = createdPlaces[Math.floor(Math.random() * createdPlaces.length)];
      alertsToInsert.push({
        destination: place._id,
        title: `Alert for ${place.name}`,
        message: `This is a demo alert regarding ${alertCats[i % alertCats.length]}`,
        category: alertCats[i % alertCats.length],
        severity: alertSeverities[i % alertSeverities.length],
        status: alertStatuses[i % alertStatuses.length],
        isDemo: true
      });
    }
    await Alert.insertMany(alertsToInsert);
    console.log("Alerts seeded.");

    // 5. Govt Actions
    await GovernmentAction.deleteMany({ isDemo: true });
    const actionsToInsert = [];
    for (let i = 0; i < 15; i++) {
      let place = createdPlaces[Math.floor(Math.random() * createdPlaces.length)];
      let status = ['Assigned', 'In Progress', 'Resolved'][Math.floor(Math.random() * 3)];
      let hist = [{ status: 'Created', note: 'Issue reported', updatedAt: new Date(Date.now() - 5*24*60*60*1000) }, { status: 'Assigned', note: 'Assigned to officer', updatedAt: new Date(Date.now() - 4*24*60*60*1000) }];
      if(status === 'In Progress') hist.push({ status: 'In Progress', note: 'Work started', updatedAt: new Date(Date.now() - 2*24*60*60*1000) });
      if(status === 'Resolved') hist.push({ status: 'Resolved', note: 'Issue fixed', updatedAt: new Date() });

      actionsToInsert.push({
        destination: place._id,
        issue: `Infrastructure issue ${i}`,
        department: 'Tourism Board',
        recommendation: 'Fix it immediately',
        priority: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)],
        deadline: new Date(Date.now() + (Math.random() * 30 * 24 * 60 * 60 * 1000)),
        status: status,
        history: hist,
        createdBy: createdAdmins.length ? createdAdmins[0]._id : null,
        isDemo: true
      });
    }
    await GovernmentAction.insertMany(actionsToInsert);
    console.log("Govt Actions seeded.");

    // 6. Bookings & Payments
    await Booking.deleteMany({ isDemo: true });
    const bookingsToInsert = [];
    let paymentsCount = 0;
    for (let i = 0; i < 150; i++) {
      let place = createdPlaces[Math.floor(Math.random() * createdPlaces.length)];
      let tourist = createdTourists[Math.floor(Math.random() * createdTourists.length)];
      let partner = createdPartners[Math.floor(Math.random() * createdPartners.length)];
      
      if (!place || !tourist || !partner) continue;

      let pStatus = Math.random() > 0.1 ? 'completed' : 'failed';
      if (pStatus === 'completed') paymentsCount++;

      let bStatus = pStatus === 'completed' ? 'confirmed' : 'cancelled';

      bookingsToInsert.push({
        bookingRef: 'DEMO-' + Math.floor(100000 + Math.random() * 900000) + '-' + i,
        userId: tourist._id,
        guestName: tourist.name,
        guestEmail: tourist.email,
        hotelPartnerId: partner._id,
        destinationId: place._id,
        checkInDate: new Date(Date.now() - (Math.random() * 90 * 24 * 60 * 60 * 1000)).toISOString(),
        checkOutDate: new Date(Date.now() - (Math.random() * 80 * 24 * 60 * 60 * 1000)).toISOString(),
        nights: Math.floor(Math.random() * 5) + 1,
        totalPrice: Math.floor(Math.random() * 5000) + 1000,
        status: bStatus,
        paymentStatus: pStatus,
        transactionId: pStatus === 'completed' ? 'TXN-BD-' + Math.floor(100000 + Math.random() * 900000) : null,
        isDemo: true
      });
    }
    await Booking.insertMany(bookingsToInsert, { ordered: false });
    console.log("Bookings and Payments seeded.");

    // 7. Reviews
    await Review.deleteMany({ isDemo: true });
    const reviewsToInsert = [];
    for (let i = 0; i < 15; i++) {
      let place = createdPlaces[Math.floor(Math.random() * createdPlaces.length)];
      let tourist = createdTourists[Math.floor(Math.random() * createdTourists.length)];
      if (!place || !tourist) continue;
      
      let rating = Math.random() > 0.3 ? (Math.random() > 0.5 ? 5 : 4) : (Math.random() > 0.5 ? 3 : 2);
      reviewsToInsert.push({
        tourist: tourist._id,
        targetType: 'Place',
        targetId: place._id,
        rating: rating,
        content: rating >= 4 ? `Beautiful heritage site and the services were excellent. The evening view at ${place.name} was incredible.` : `The experience at ${place.name} was okay, but the facilities could be improved.`,
        status: Math.random() > 0.9 ? 'hidden' : 'approved',
        isDemo: true
      });
    }
    await Review.insertMany(reviewsToInsert);
    console.log("Reviews seeded.");

    // 8. Events
    await Event.deleteMany({ isDemo: true });
    const eventsToInsert = [];
    for (let i = 0; i < 5; i++) {
      let place = createdPlaces[Math.floor(Math.random() * createdPlaces.length)];
      if(!place) continue;
      eventsToInsert.push({
        id: `demo-event-${i}-${Date.now()}`,
        title: `${place.name} Festival ${i}`,
        category: 'Festival',
        description: `Join us for the grand festival at ${place.name}`,
        destination: place._id,
        city: place.city,
        state: place.state,
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&q=80&w=800',
        date: new Date(Date.now() + (Math.random() * 30 * 24 * 60 * 60 * 1000)).toDateString(),
        time: '10:00 AM',
        price: Math.floor(Math.random() * 500) + 100,
        isDemo: true
      });
    }
    await Event.insertMany(eventsToInsert, { ordered: false });
    console.log("Events seeded.");

    // 9. Circuits
    await TourismCircuit.deleteMany({ isDemo: true });
    const circuitsToInsert = [];
    for (let i = 0; i < 5; i++) {
      if(createdPlaces.length >= 3) {
        circuitsToInsert.push({
          name: `Demo Circuit ${i}`,
          description: `A beautiful journey through MP.`,
          duration: '5 Days',
          category: 'Heritage',
          destinations: [createdPlaces[0]._id, createdPlaces[1]._id, createdPlaces[2]._id],
          isDemo: true
        });
      }
    }
    if (circuitsToInsert.length > 0) await TourismCircuit.insertMany(circuitsToInsert);
    console.log("Circuits seeded.");

    // 10. Reports
    await Report.deleteMany({ isDemo: true });
    const reportsToInsert = [];
    for (let i = 0; i < 10; i++) {
      let place = createdPlaces[Math.floor(Math.random() * createdPlaces.length)];
      reportsToInsert.push({
        reportId: 'RPT-2026-' + Math.floor(10000 + Math.random() * 90000),
        type: 'Destination Tourism Report',
        title: `Tourism Report - ${place.name}`,
        generatedBy: createdAdmins.length ? createdAdmins[0]._id : null,
        periodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        periodEnd: new Date(),
        status: 'Generated',
        destinationId: place._id,
        isDemo: true
      });
    }
    await Report.insertMany(reportsToInsert);
    console.log("Reports seeded.");

    console.log(`
=============================
BHARATDARSHI DEMO SEED
=============================

Users:                 ${allDemoUsers.length}
Destinations:          ${createdPlaces.length}
Partners:              ${createdPartners.length}
Bookings:              ${bookingsToInsert.length}
Payments:              ${paymentsCount}
Reviews:               ${reviewsToInsert.length}
Alerts:                ${alertsToInsert.length}
Infrastructure:        ${infrasToInsert.length}
Events:                ${eventsToInsert.length}
Circuits:              ${circuitsToInsert.length}
Government Actions:    ${actionsToInsert.length}
Reports:               ${reportsToInsert.length}

Gap Distribution:
HIGH (>60): ${createdPlaces.filter(p => p.scores?.gapScore > 60).length}
MEDIUM (30-60): ${createdPlaces.filter(p => p.scores?.gapScore >= 30 && p.scores?.gapScore <= 60).length}
LOW (<30): ${createdPlaces.filter(p => p.scores?.gapScore < 30).length}

Impact Distribution:
HIGH (>70): ${createdPlaces.filter(p => p.scores?.impactScore > 70).length}
MEDIUM (50-70): ${createdPlaces.filter(p => p.scores?.impactScore >= 50 && p.scores?.impactScore <= 70).length}
LOW (<50): ${createdPlaces.filter(p => p.scores?.impactScore < 50).length}

=============================
SEED COMPLETE
=============================
`);

    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
