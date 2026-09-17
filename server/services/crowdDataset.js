const fs = require('fs');
const path = require('path');

// Centralized Real-World Crowd Level Thresholds
const CROWD_THRESHOLDS = {
  LOW: 500,
  MEDIUM: 1500,
  HIGH: 3000
};

/**
 * Helper to compute Crowd Level based on daily visitor total
 */
function getCrowdLevel(dailyCount) {
  if (dailyCount < CROWD_THRESHOLDS.LOW) return 'LOW';
  if (dailyCount < CROWD_THRESHOLDS.MEDIUM) return 'MEDIUM';
  if (dailyCount < CROWD_THRESHOLDS.HIGH) return 'HIGH';
  return 'CRITICAL';
}

// In-Memory Cache Store for AI Forecast
let forecastCache = {
  data: null,
  cachedAt: null,
  isStale: true
};

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes TTL

/**
 * Invalidate forecast cache (called whenever a booking is created, cancelled, or rescheduled)
 */
function invalidateCrowdCache() {
  forecastCache.isStale = true;
  forecastCache.data = null;
  console.log('🔄 AI forecast cache invalidated due to real-time booking update.');
}

const MOCK_DATA_PATH = path.join(__dirname, '../data/mockPrevYearData.json');

/**
 * Load or generate 1-year historical dataset stored in server/data/mockPrevYearData.json
 * Marks July (month === 6) as Sawan Month Festival with HIGH crowd surge.
 */
function loadOrGenerateMockPrevYearData() {
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (fs.existsSync(MOCK_DATA_PATH)) {
    try {
      const raw = fs.readFileSync(MOCK_DATA_PATH, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.warn("⚠️ Failed to parse existing mockPrevYearData.json, regenerating...");
    }
  }

  console.log("⚡ Generating 1-Year Historical Dataset in mockPrevYearData.json (July = Sawan Festival Surge)...");

  const hourlyAartiPattern = [
    0.02, 0.01, 0.01, 0.08, 0.18, 0.12, 0.09, 0.08, 0.11, 0.12, 0.10, 0.08,
    0.06, 0.05, 0.04, 0.05, 0.08, 0.12, 0.14, 0.09, 0.06, 0.04, 0.02, 0.01
  ];

  const now = new Date();
  const mockSeries = [];

  // Generate 365 days of 24-hour historical points
  for (let d = 365; d >= 0; d--) {
    const targetDate = new Date(now.getTime() - d * 24 * 60 * 60 * 1000);
    const month = targetDate.getMonth(); // 0 = Jan, 6 = July
    const dayOfWeek = targetDate.getDay(); // 1 = Monday (Somvar)

    // Mark July (month === 6) as Sawan Month Festival
    const isSawanMonth = month === 6;
    const isMonday = dayOfWeek === 1;

    let baseDailyCrowd = 10000; // Normal regular day baseline (~10,000 / day)
    
    if (isSawanMonth) {
      // Sawan Month: HIGH SURGE
      baseDailyCrowd = isMonday ? 65000 : 42000; // Sawan Somvar (65k) vs Sawan Days (42k)
    } else if (isMonday) {
      baseDailyCrowd = 22000; // Regular Monday Mahakal Somvar Surge
    } else if (dayOfWeek === 0 || dayOfWeek === 6) {
      baseDailyCrowd = 15000; // Weekend Surge
    }

    for (let hr = 0; hr < 24; hr++) {
      const pointDt = new Date(targetDate);
      pointDt.setHours(hr, 0, 0, 0);

      const hourFraction = hourlyAartiPattern[hr];
      const hourlyCrowd = Math.round(baseDailyCrowd * hourFraction);

      mockSeries.push({
        timestamp: pointDt.toISOString(),
        crowd: hourlyCrowd,
        isSawanMonth,
        isMonday,
        isFestival: isSawanMonth || isMonday
      });
    }
  }

  try {
    fs.writeFileSync(MOCK_DATA_PATH, JSON.stringify(mockSeries, null, 2), 'utf8');
    console.log(`✅ Saved 1-Year Historical Dataset (${mockSeries.length} points) to mockPrevYearData.json`);
  } catch (err) {
    console.error("❌ Failed to write mockPrevYearData.json:", err);
  }

  return mockSeries;
}

/**
 * Fetch dynamic Chronos AI context
 */
async function getDynamicCrowdDataset() {
  const historicalBaseline = loadOrGenerateMockPrevYearData();
  const slicePoints = historicalBaseline.slice(-720);
  return { series: slicePoints, realTotalPersons: 0, totalPassCount: 0 };
}

module.exports = {
  CROWD_THRESHOLDS,
  getCrowdLevel,
  forecastCache,
  CACHE_TTL_MS,
  invalidateCrowdCache,
  getDynamicCrowdDataset,
  loadOrGenerateMockPrevYearData
};
