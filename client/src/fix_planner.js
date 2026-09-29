
const fs = require('fs');
let code = fs.readFileSync('pages/AIPlanner.jsx', 'utf8');

const regex = /\/\/ Check if routed from CuratedItineraries card click[\s\S]*?\}, \[location\.state\]\);/;

const replacement = \// Check if routed from CuratedItineraries card click
  useEffect(() => {
    if (location.state?.curatedItinerary) {
      const item = location.state.curatedItinerary;
      if (item.isDynamic) {
        const fetchDynamicItinerary = async () => {
          setIsGenerating(true);
          try {
            const res = await axios.post('/api/itineraries/generate', {
              selectedStates: [item.title],
              selectedInterests: ['Exploration'],
              selectedLengths: [item.days],
              days: item.days.replace(/[^0-9]/g, '') || '3',
            });
            if (res.data && res.data.plan) {
              setAiItinerary(res.data.plan);
              setSelectedStates([item.title]);
              setSelectedInterests(['Exploration']);
              setSelectedLengths([item.days]);
              if (!location.search.includes('view=itinerary')) {
                navigate('?view=itinerary', { replace: true });
              }
              setTimeout(() => {
                itinerarySectionRef.current?.scrollIntoView({ behavior: 'smooth' });
              }, 150);
            }
          } catch (err) {
            setItineraryError('Failed to generate dynamic itinerary.');
          } finally {
            setIsGenerating(false);
          }
        };
        fetchDynamicItinerary();
      } else {
        const matched =
          CURATED_ITINERARIES_MAP[item.id] ||
          Object.values(CURATED_ITINERARIES_MAP).find(
            (c) => c.title.toLowerCase() === item.title?.toLowerCase()
          );

        if (matched) {
          setAiItinerary(matched);
          setSelectedStates(['Sikkim']);
          setSelectedInterests(['Heritage & Monasteries']);
          setSelectedLengths([item.days]);
          setTimeout(() => {
            itinerarySectionRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }
      }
    }
  }, [location.state]);\;

code = code.replace(regex, replacement);
fs.writeFileSync('pages/AIPlanner.jsx', code);
console.log('Done');
