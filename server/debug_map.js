const mongoose = require('mongoose');
const { getGoogleMapsUrl, getGoogleMapsEmbedUrl } = require('./services/tourism/tourismService');

mongoose.connect('mongodb+srv://tnitish440_db_user:gfVtw7HHD5iGnXps@aicte.prjfwlh.mongodb.net/AICTE')
  .then(async () => {
    console.log("Connected");
    const Place = require('./models/Place');
    const Alert = require('./models/Alert');
    const Infrastructure = require('./models/Infrastructure');

    const places = await Place.find({}).lean();
    console.log("Found", places.length, "places");

    const placeIds = places.map(p => p._id);
    const [alerts, infras] = await Promise.all([
      Alert.find({ destination: { $in: placeIds }, status: { $ne: 'RESOLVED' } }).lean(),
      Infrastructure.find({ destination: { $in: placeIds } }).lean()
    ]);
    
    const alertsByDest = {};
    const infrasByDest = {};
    alerts.forEach(a => {
      const did = a.destination.toString();
      if(!alertsByDest[did]) alertsByDest[did] = [];
      alertsByDest[did].push(a);
    });
    infras.forEach(i => {
      const did = i.destination.toString();
      if(!infrasByDest[did]) infrasByDest[did] = [];
      infrasByDest[did].push(i);
    });

    const data = [];
    for (let p of places) {
      try {
        const lat = p.coordinates?.lat;
        const lng = p.coordinates?.lng;
        if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
          continue; 
        }

        const destAlerts = alertsByDest[p._id.toString()] || [];
        const destInfras = infrasByDest[p._id.toString()] || [];

        const isEmerging = p.metrics?.visitorGrowth >= 60 && p.metrics?.demand < 80;
        const isPopular = p.metrics?.demand > 85;

        let infraStatus = 'Good';
        const poorCount = destInfras.filter(i => i.condition === 'poor').length;
        if (poorCount > 1) infraStatus = 'Needs Attention';
        else if (poorCount === 1) infraStatus = 'Moderate';

        const severities = destAlerts.map(a => a.severity);
        let highestSeverity = null;
        if (severities.includes('CRITICAL')) highestSeverity = 'CRITICAL';
        else if (severities.includes('HIGH')) highestSeverity = 'HIGH';
        else if (severities.includes('MEDIUM')) highestSeverity = 'MEDIUM';
        else if (severities.includes('LOW')) highestSeverity = 'LOW';

        data.push({
          id: p._id,
          name: p.name,
          state: p.state,
          district: p.city,
          category: p.category,
          location: { lat, lng },
          image: p.images?.[0] || p.image,
          googleMapsUrl: getGoogleMapsUrl(p),
          googleMapsEmbedUrl: getGoogleMapsEmbedUrl(p),
          visitorCount: p.metrics?.visitorsCurrentYear || Math.floor(Math.random() * 20000) + 5000,
          bookingCount: p.bookingCount || Math.floor(Math.random() * 5000) + 1000,
          revenue: p.metrics?.revenueGenerated || Math.floor(Math.random() * 900000) + 100000,
          visitorGrowth: p.metrics?.visitorGrowth || 0,
          demandScore: p.metrics?.demand || 0,
          isEmerging,
          isPopular,
          gapScore: p.scores?.gapScore || 0,
          gapPriority: p.scores?.gapPriority || 'LOW',
          impactScore: p.scores?.impactScore || 0,
          impactLevel: p.scores?.impactLevel || 'LOW',
          transportScore: p.metrics?.transport || 0,
          accommodationScore: p.metrics?.accommodation || 0,
          sanitationScore: p.metrics?.sanitation || 0,
          safetyScore: p.metrics?.safety || 0,
          medicalScore: p.metrics?.medical || 0,
          informationScore: p.metrics?.information || 0,
          localServicesScore: p.metrics?.localServices || 0,
          activeAlertsCount: destAlerts.length,
          highestAlertSeverity: highestSeverity,
          infrastructureStatus: infraStatus
        });
      } catch (err) {
        console.error("Error on place", p.name, err);
      }
    }
    console.log("Success! Data length:", data.length);
    process.exit(0);
  })
  .catch(console.error);
