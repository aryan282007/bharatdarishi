const fs = require('fs');
const path = 'client/src/pages/AIPlanner.jsx';
let content = fs.readFileSync(path, 'utf8');

const startTarget = "{/* ARCH CAPSULE CARDS SLIDING CAROUSEL TRACK */}";
const startReplacement = `{!aiItinerary && (\n          <>\n        {/* ARCH CAPSULE CARDS SLIDING CAROUSEL TRACK */}`;

if (content.includes(startTarget) && !content.includes('{!aiItinerary && (\\n          <>\\n        {/* ARCH CAPSULE CARDS SLIDING CAROUSEL TRACK */}')) {
    content = content.replace(startTarget, startReplacement);
    
    // Replace the very last </div></div>); }
    content = content.replace(/(\s*)\)\}\s*<\/div>\s*<\/div>\s*\);\s*\}/, '$1)}\n          </>\n        )}\n      </div>\n    </div>\n  );\n}');

    fs.writeFileSync(path, content, 'utf8');
    console.log('Successfully wrapped the carousel in !aiItinerary check.');
} else {
    console.log('Already wrapped or start target not found.');
}
