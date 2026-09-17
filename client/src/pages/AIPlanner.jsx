import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
  MapPin,
  Heart,
  Share2,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "../styles/custom.module.css";

// 6 Regions Data Structure with States
const REGION_MAP_DATA = [
  {
    name: "East",
    allLabel: "All East",
    states: [
      "Andaman and Nicobar Islands",
      "Bihar",
      "Jharkhand",
      "Odisha",
      "West Bengal",
    ],
  },
  {
    name: "West",
    allLabel: "All West",
    states: [
      "Dadra and Nagar Haveli and Daman and Diu",
      "Goa",
      "Gujarat",
      "Maharashtra",
    ],
  },
  {
    name: "Central",
    allLabel: "All Central",
    states: ["Chhattisgarh", "Madhya Pradesh"],
  },
  {
    name: "North East",
    allLabel: "All North East",
    states: [
      "Arunachal Pradesh",
      "Assam",
      "Manipur",
      "Meghalaya",
      "Mizoram",
      "Nagaland",
      "Sikkim",
      "Tripura",
    ],
  },
  {
    name: "North",
    allLabel: "All North",
    states: [
      "Chandigarh",
      "Delhi",
      "Haryana",
      "Himachal Pradesh",
      "Jammu and Kashmir",
      "Ladakh",
      "Punjab",
      "Rajasthan",
      "Uttarakhand",
      "Uttar Pradesh",
    ],
  },
  {
    name: "South",
    allLabel: "All South",
    states: [
      "Andhra Pradesh",
      "Karnataka",
      "Kerala",
      "Lakshadweep",
      "Puducherry",
      "Tamil Nadu",
      "Telangana",
    ],
  },
];

// Comprehensive Interests Categories & Sub-options Data Structure
const INTEREST_MAP_DATA = [
  {
    category: "Wildlife",
    allLabel: "All Wildlife",
    options: [
      "Wildlife Sanctuaries",
      "Zoological Parks",
      "Bird Watching",
      "Marine Life",
      "National Parks",
    ],
  },
  {
    category: "Heritage",
    allLabel: "All Heritage",
    options: [
      "Monuments",
      "Museums",
      "Historical Buildings",
      "UNESCO World Heritage Sites",
      "Archeological Sites",
      "Historical Sites",
      "Palaces & Forts",
    ],
  },
  {
    category: "Spiritual",
    allLabel: "All Spiritual",
    options: [
      "Hinduism",
      "Islam",
      "Buddhism",
      "Sikhism",
      "Jainism",
      "Christianity",
      "Jewish",
    ],
  },
  {
    category: "Adventure",
    allLabel: "All Adventure",
    options: [
      "Rafting",
      "Paragliding",
      "Parasailing",
      "Skiing",
      "Sky Diving",
      "Bungee Jumping",
      "Mountain Biking",
      "Hiking & Trekking",
      "Scuba Diving & Snorkeling",
      "Mountaineering & Rock Climbing",
    ],
  },
  {
    category: "Gastronomy",
    allLabel: "All Gastronomy",
    options: [
      "Street Food",
      "Authentically Local",
      "Beverages",
      "Farm to Table",
      "Spices",
    ],
  },
  {
    category: "Weddings",
    allLabel: "All Weddings",
    options: [
      "Palace Weddings",
      "Beach Weddings",
      "Mountain Wedding",
      "Island Wedding",
      "Vineyard Wedding",
      "Sustainable Weddings",
      "Cruise Weddings",
      "Adventure Weddings",
    ],
  },
  {
    category: "Wellness",
    allLabel: "All Wellness",
    options: ["Yoga", "Ayurveda", "Meditation", "Naturopathy"],
  },
  {
    category: "Arts",
    allLabel: "All Arts",
    options: [
      "Dance",
      "Music",
      "Painting",
      "Literature",
      "Theatre",
      "Textiles",
    ],
  },
  {
    category: "Rural",
    allLabel: "All Rural",
    options: [
      "Agro-Tourism",
      "Crafts-Tourism",
      "Tribal-Tourism",
      "Eco-Tourism",
      "Wildlife-Tourism",
      "Live Like a Local",
    ],
  },
  {
    category: "Nature",
    allLabel: "All Nature",
    options: [
      "Deserts",
      "Sustainable Tourism",
      "Beaches & Cruises",
      "Hills & Mountains",
      "Forests & Gardens",
      "Rivers & Lakes",
    ],
  },
  {
    category: "Recreation",
    allLabel: "All Recreation",
    options: ["Cinema", "Night Life", "Sports", "Amusement & Theme Parks"],
  },
];

const TRIP_LENGTH_OPTIONS = [
  "1-2 Days",
  "3-4 Days",
  "5-6 Days",
  "7-13 Days",
  "14+ Days",
];

const CURATED_ITINERARIES_MAP = {
  1: {
    id: 1,
    title: "Yuksom",
    duration: "3 Days",
    destinationTitle: "Yuksom - Sacred Monasteries & Royal Heritage Trail",
    subtitle: "Explore Dubdi Monastery, Coronation Throne & Ancient Himalayan Trails in 3 Days",
    summaryParagraph1: "Yuksom, the historic first capital of the Kingdom of Sikkim, is a serene town surrounded by dense pine forests and sacred monasteries. Established in 1642 AD, it is where the first Chogyal monarch was consecrated by three revered lamas.",
    summaryParagraph2: "This 3-day curated itinerary takes you through the oldest monastery of Sikkim (Dubdi), sacred Kathok Lake, the royal Norbugang Coronation Throne, and the wish-fulfilling Khecheopalri Lake.",
    routeDistance: "68 Kms",
    heroImage: "/itineraries/yuksom.png",
    mapRegionName: "Yuksom, West Sikkim",
    highlights: ["Dubdi Monastery (1701 AD)", "Norbugang Coronation Throne", "Kathok Sacred Lake", "Khecheopalri Lake", "Phamrong Waterfalls"],
    sidebarExperience: {
      title: "Tranquil Himalayan Meditation & Forest Trails",
      image: "/itineraries/yuksom.png"
    },
    days: [
      {
        dayNumber: 1,
        title: "Arrival in Yuksom & Sacred Norbugang Throne",
        dayImage: "/itineraries/yuksom.png",
        timeOfDaySections: [
          {
            timeOfDay: "Morning",
            paragraphs: [
              "Arrive in Yuksom (1,780m) in West Sikkim. Check into your cozy mountain stay overlooking Mount Kanchenjunga ridges.",
              "10:00 AM: Enjoy traditional Butter Tea (Suja) and local breakfast."
            ]
          },
          {
            timeOfDay: "Afternoon",
            paragraphs: [
              "Visit Norbugang Park and the sacred Coronation Throne of Norbugang where Phuntsog Namgyal was crowned the first Chogyal in 1642.",
              "2:30 PM: Walk around Kathok Sacred Lake, surrounded by fluttering colorful prayer flags."
            ]
          },
          {
            timeOfDay: "Evening",
            paragraphs: [
              "Stroll through Yuksom village bazaar and interact with local Bhutia & Lepcha community members.",
              "7:00 PM: Relish authentic Sikkimese Thukpa and local bamboo shoot delicacies."
            ]
          }
        ]
      },
      {
        dayNumber: 2,
        title: "Dubdi Monastery & Phamrong Waterfalls",
        dayImage: "/itineraries/yuksom.png",
        timeOfDaySections: [
          {
            timeOfDay: "Morning",
            paragraphs: [
              "7:30 AM: Morning trek up the forested ridge to Dubdi Monastery (Hermit's Cell), the oldest monastery in Sikkim built in 1701.",
              "10:00 AM: Explore the ancient painted statues, rare Buddhist manuscripts, and quiet hilltop meditation grounds."
            ]
          },
          {
            timeOfDay: "Afternoon",
            paragraphs: [
              "Drive down to Phamrong Waterfalls and enjoy a scenic picnic along the roaring mountain cascade.",
              "2:30 PM: Visit the historic Kartok Monastery nestled near the valley slope."
            ]
          },
          {
            timeOfDay: "Evening",
            paragraphs: [
              "Enjoy sunset lighting over the surrounding Himalayan pine forest.",
              "6:30 PM: Relax at local village teahouses and sample homemade Tongba."
            ]
          }
        ]
      },
      {
        dayNumber: 3,
        title: "Khecheopalri Wish-Fulfilling Lake & Tashiding",
        dayImage: "/itineraries/yuksom.png",
        timeOfDaySections: [
          {
            timeOfDay: "Morning",
            paragraphs: [
              "8:00 AM: Excursion to sacred Khecheopalri Lake (Wish-Fulfilling Lake), revered deeply by Buddhists and Hindus alike.",
              "10:30 AM: Walk the wooden jetty through ancient mossy trees to the crystal clear sacred waters."
            ]
          },
          {
            timeOfDay: "Afternoon",
            paragraphs: [
              "Visit Tashiding Monastery perched atop a heart-shaped hill between the Rathong and Rangeet rivers.",
              "2:00 PM: Spin the sacred prayer wheels and witness panoramic mountain views."
            ]
          },
          {
            timeOfDay: "Evening",
            paragraphs: [
              "Farewell to Yuksom as your 3-day spiritual trail concludes.",
              "Departure towards Gangtok / Siliguri with everlasting memories."
            ]
          }
        ]
      }
    ]
  },
  2: {
    id: 2,
    title: "Pelling",
    duration: "4 Days",
    destinationTitle: "Pelling - Royal Palace Ruins & Kanchenjunga Skywalk",
    subtitle: "Experience Pemayangtse Monastery, Rabdentse Ruins & Panoramic Kanchenjunga Views in 4 Days",
    summaryParagraph1: "Pelling is a picturesque town in West Sikkim offering the closest, most mesmerizing full-scale views of Mount Kanchenjunga. Rich in royal history, it houses Sikkim's most revered Nyingma monasteries and royal palace ruins.",
    summaryParagraph2: "This 4-day itinerary takes you across the famous Glass Skywalk, historic Pemayangtse Monastery, Rabdentse Palace Ruins, Kanchenjunga Waterfalls, and peaceful Orange Gardens.",
    routeDistance: "95 Kms",
    heroImage: "/itineraries/pelling.png",
    mapRegionName: "Pelling, West Sikkim",
    highlights: ["Pelling Glass Skywalk", "Pemayangtse Monastery", "Rabdentse Palace Ruins", "Kanchenjunga Waterfalls", "Sangachoeling Monastery"],
    sidebarExperience: {
      title: "Majestic Kanchenjunga Sunrises & Royal Architecture",
      image: "/itineraries/pelling.png"
    },
    days: [
      {
        dayNumber: 1,
        title: "Arrival in Pelling & Glass Skywalk",
        dayImage: "/itineraries/pelling.png",
        timeOfDaySections: [
          {
            timeOfDay: "Morning",
            paragraphs: [
              "Arrive in Pelling (2,150m). Check into your mountain resort facing the snow-capped Kanchenjunga range.",
              "11:00 AM: Relax with fresh Himalayan ginger tea."
            ]
          },
          {
            timeOfDay: "Afternoon",
            paragraphs: [
              "Visit India's first Glass Skywalk at Sangachoeling, walking high above the valley floor.",
              "3:00 PM: Marvel at the colossal 137ft tall statue of Chenrezig (Avalokiteshvara)."
            ]
          },
          {
            timeOfDay: "Evening",
            paragraphs: [
              "Witness golden sunset hues glowing on Mount Kanchenjunga peaks.",
              "7:00 PM: Enjoy cozy dinner with local Sikkimese dishes."
            ]
          }
        ]
      },
      {
        dayNumber: 2,
        title: "Pemayangtse Monastery & Rabdentse Ruins",
        dayImage: "/itineraries/pelling.png",
        timeOfDaySections: [
          {
            timeOfDay: "Morning",
            paragraphs: [
              "8:30 AM: Tour Pemayangtse Monastery ('Perfect Sublime Lotus'), built in 1705 for premier lamas.",
              "10:30 AM: Admire the magnificent 7-tiered hand-carved wooden model of Zandog Palri inside."
            ]
          },
          {
            timeOfDay: "Afternoon",
            paragraphs: [
              "Walk through bird-filled chestnut forest to Rabdentse Palace Ruins, the second royal capital of Sikkim (1670-1814).",
              "2:30 PM: Stand at the royal stone chortens overlooking deep river valleys."
            ]
          },
          {
            timeOfDay: "Evening",
            paragraphs: [
              "Stroll through Upper Pelling market and try steaming hot vegetable momos.",
              "6:30 PM: Evening cultural folk performance at resort."
            ]
          }
        ]
      },
      {
        dayNumber: 3,
        title: "Waterfalls, Lakes & Rock Garden",
        dayImage: "/itineraries/pelling.png",
        timeOfDaySections: [
          {
            timeOfDay: "Morning",
            paragraphs: [
              "8:00 AM: Scenic drive to Rimbi Orange Garden & Rimbi Waterfall.",
              "10:30 AM: Excursion to roaring Kanchenjunga Waterfalls, cascading dramatically over giant boulders."
            ]
          },
          {
            timeOfDay: "Afternoon",
            paragraphs: [
              "Visit sacred Khecheopalri Lake, where birds reportedly pick up every leaf that falls on the water surface.",
              "3:00 PM: Spend relaxing time at Sewaro Rock Garden by the mountain stream."
            ]
          },
          {
            timeOfDay: "Evening",
            paragraphs: [
              "Return to Pelling town for evening rest.",
              "7:00 PM: Traditional Tibetan dinner with soup & noodles."
            ]
          }
        ]
      },
      {
        dayNumber: 4,
        title: "Sangachoeling Monastery Hike & Departure",
        dayImage: "/itineraries/pelling.png",
        timeOfDaySections: [
          {
            timeOfDay: "Morning",
            paragraphs: [
              "7:00 AM: Early morning hill trek to Sangachoeling Monastery (built in 1697), one of the oldest in Sikkim.",
              "9:30 AM: Enjoy 360-degree panoramic views of Pelling valley."
            ]
          },
          {
            timeOfDay: "Afternoon",
            paragraphs: [
              "Shop for local Sikkimese tea, cardamom, and woven prayer flags.",
              "12:00 PM: Check out and commence your return journey."
            ]
          },
          {
            timeOfDay: "Evening",
            paragraphs: [
              "Transfer to Bagdogra / NJP / Gangtok with timeless mountain memories."
            ]
          }
        ]
      }
    ]
  },
  3: {
    id: 3,
    title: "Ravangla",
    duration: "5 Days",
    destinationTitle: "Ravangla - Buddha Park & Organic Tea Valleys",
    subtitle: "Immerse in Tathagata Tsal, Ralang Monasteries & Temi Tea Gardens in 5 Days",
    summaryParagraph1: "Ravangla is a tranquil hill station in South Sikkim at an elevation of 7,000 feet. Famous for Tathagata Tsal (Buddha Park) featuring a breathtaking 130-foot statue of Lord Buddha, Ravangla is a haven for peace-seekers and nature lovers.",
    summaryParagraph2: "This 5-day curated itinerary features Buddha Park, historic Ralang & Bon Monasteries, Temi Organic Tea Estate, and Maenam Wildlife Sanctuary trekking trails.",
    routeDistance: "110 Kms",
    heroImage: "/itineraries/ravangla.png",
    mapRegionName: "Ravangla, South Sikkim",
    highlights: ["Buddha Park (Tathagata Tsal)", "Ralang Kagyu Monastery", "Temi Tea Garden", "Bon Monastery", "Rayong Sunrise Viewpoint"],
    sidebarExperience: {
      title: "Spiritual Harmony & Pristine Tea Garden Estates",
      image: "/itineraries/ravangla.png"
    },
    days: [
      {
        dayNumber: 1,
        title: "Arrival & Tathagata Tsal (Buddha Park)",
        dayImage: "/itineraries/ravangla.png",
        timeOfDaySections: [
          {
            timeOfDay: "Morning",
            paragraphs: [
              "Arrive in Ravangla (2,130m) amidst rolling mist and pine forests. Check in to your valley resort.",
              "11:00 AM: Welcome drink with organic herbal tea."
            ]
          },
          {
            timeOfDay: "Afternoon",
            paragraphs: [
              "Explore Tathagata Tsal (Buddha Park), centered around a magnificent 130ft high copper & gold Buddha statue consecrated by H.H. Dalai Lama.",
              "2:30 PM: Walk around the manicured gardens, electric fountain, and serene prayer halls."
            ]
          },
          {
            timeOfDay: "Evening",
            paragraphs: [
              "Watch the evening illumination light up the grand Buddha statue against the starry Himalayan sky.",
              "7:00 PM: Enjoy local Bhutia hospitality and dinner."
            ]
          }
        ]
      },
      {
        dayNumber: 2,
        title: "Ralang Monasteries & Rare Bon Shrine",
        dayImage: "/itineraries/ravangla.png",
        timeOfDaySections: [
          {
            timeOfDay: "Morning",
            paragraphs: [
              "8:30 AM: Drive to Ralang Monastery, one of the most prominent Karma Kagyu centers in Sikkim.",
              "10:30 AM: Experience morning monastic prayers, chanting, and traditional horns."
            ]
          },
          {
            timeOfDay: "Afternoon",
            paragraphs: [
              "Visit Yungdrung Kundrak Ling, one of the very few Bon religion monasteries in India.",
              "2:30 PM: Learn about ancient pre-Buddhist Tibetan Bon traditions and murals."
            ]
          },
          {
            timeOfDay: "Evening",
            paragraphs: [
              "Stroll around Ravangla Town square.",
              "6:30 PM: Cozy dinner at local cafe."
            ]
          }
        ]
      },
      {
        dayNumber: 3,
        title: "Temi Organic Tea Estate & Factory Tour",
        dayImage: "/itineraries/ravangla.png",
        timeOfDaySections: [
          {
            timeOfDay: "Morning",
            paragraphs: [
              "9:00 AM: Scenic excursion to Temi Tea Garden, Sikkim's only tea estate producing internationally acclaimed organic tea.",
              "10:30 AM: Take a guided walk through lush green tea slopes with views of Mount Kanchenjunga."
            ]
          },
          {
            timeOfDay: "Afternoon",
            paragraphs: [
              "Enjoy a tea-tasting session of First Flush & Orthodox organic teas.",
              "2:00 PM: Visit Cherry Resort view deck nestled within the tea gardens."
            ]
          },
          {
            timeOfDay: "Evening",
            paragraphs: [
              "Return to Ravangla in the evening.",
              "7:00 PM: Bonfire dinner under Himalayan stars."
            ]
          }
        ]
      },
      {
        dayNumber: 4,
        title: "Maenam Hill Sanctuary & Rayong Sunrise",
        dayImage: "/itineraries/ravangla.png",
        timeOfDaySections: [
          {
            timeOfDay: "Morning",
            paragraphs: [
              "5:30 AM: Early morning trip to Rayong Sunrise Viewpoint for spectacular first rays on snow peaks.",
              "9:00 AM: Trek into Maenam Wildlife Sanctuary home to Red Pandas, rare orchids, and rhododendrons."
            ]
          },
          {
            timeOfDay: "Afternoon",
            paragraphs: [
              "Reach Maenam Hill peak (3,230m) for breathtaking views of Teesta & Rangeet river valleys.",
              "3:00 PM: Descend safely back to Ravangla base."
            ]
          },
          {
            timeOfDay: "Evening",
            paragraphs: [
              "Rejuvenate with traditional hot stone bath (Dotsho) at resort.",
              "7:30 PM: Relaxing evening meal."
            ]
          }
        ]
      },
      {
        dayNumber: 5,
        title: "Local Crafts & Departure",
        dayImage: "/itineraries/ravangla.png",
        timeOfDaySections: [
          {
            timeOfDay: "Morning",
            paragraphs: [
              "9:00 AM: Visit local handicraft centers for handwoven carpets, thangka paintings, and wooden crafts.",
              "11:00 AM: Final souvenir shopping."
            ]
          },
          {
            timeOfDay: "Afternoon",
            paragraphs: [
              "Check out from resort and commence return journey."
            ]
          },
          {
            timeOfDay: "Evening",
            paragraphs: [
              "Transfer to NJP / Bagdogra / Gangtok."
            ]
          }
        ]
      }
    ]
  },
  4: {
    id: 4,
    title: "North Sikkim",
    duration: "7 Days",
    destinationTitle: "North Sikkim - High Altitude Lakes & Valley of Flowers",
    subtitle: "Journey across Gurudongmar Lake, Lachen, Lachung & Yumthang Valley in 7 Days",
    summaryParagraph1: "North Sikkim is a realm of dramatic snow peaks, sacred alpine lakes at 17,000+ feet, hot springs, and vibrant valleys. Bordering Tibet, this region offers some of the most spectacular mountain wilderness in the entire Himalayas.",
    summaryParagraph2: "This 7-day curated journey takes you through Gangtok, Lachen, holy Gurudongmar Lake, Chopta Valley, Lachung, Yumthang Valley of Flowers, and Zero Point (Yumesamdong).",
    routeDistance: "340 Kms",
    heroImage: "/itineraries/north_sikkim.png",
    mapRegionName: "North Sikkim",
    highlights: ["Gurudongmar Lake (5,425m)", "Yumthang Valley of Flowers", "Zero Point (Yumesamdong)", "Lachen & Lachung Valleys", "Tsomgo Glacial Lake"],
    sidebarExperience: {
      title: "Sacred Alpine Wonders & Snow-Capped Valleys",
      image: "/itineraries/north_sikkim.png"
    },
    days: [
      {
        dayNumber: 1,
        title: "Gangtok to Lachen Valley",
        dayImage: "/itineraries/north_sikkim.png",
        timeOfDaySections: [
          {
            timeOfDay: "Morning",
            paragraphs: [
              "8:00 AM: Depart from Gangtok towards Lachen (2,750m) in North Sikkim.",
              "10:30 AM: Stop at Seven Sister Waterfalls & Singhik Viewpoint for Kanchenjunga photos."
            ]
          },
          {
            timeOfDay: "Afternoon",
            paragraphs: [
              "Cross Chungthang confluence where Lachen and Lachung rivers meet to form the Teesta River.",
              "3:30 PM: Arrive in scenic Lachen village nestled in pine mountains."
            ]
          },
          {
            timeOfDay: "Evening",
            paragraphs: [
              "Check into Lachen stay. Rest early for tomorrow's high-altitude lake expedition.",
              "7:00 PM: Warm home-cooked Sikkimese dinner."
            ]
          }
        ]
      },
      {
        dayNumber: 2,
        title: "Sacred Gurudongmar Lake & Chopta Valley",
        dayImage: "/itineraries/north_sikkim.png",
        timeOfDaySections: [
          {
            timeOfDay: "Morning",
            paragraphs: [
              "4:00 AM: Early morning drive to Gurudongmar Lake (5,425m / 17,800ft), one of the highest sacred lakes in the world.",
              "8:30 AM: Stand before the pristine turquoise water, blessed by Guru Nanak & Guru Padmasambhava."
            ]
          },
          {
            timeOfDay: "Afternoon",
            paragraphs: [
              "Explore high-altitude cold desert terrain of Chopta Valley & Thangu Valley.",
              "1:00 PM: Return to Lachen for lunch."
            ]
          },
          {
            timeOfDay: "Evening",
            paragraphs: [
              "Drive towards Lachung village (2,700m). Check in to Lachung hotel.",
              "7:00 PM: Cozy dinner by fireside."
            ]
          }
        ]
      },
      {
        dayNumber: 3,
        title: "Yumthang Valley of Flowers & Hot Springs",
        dayImage: "/itineraries/north_sikkim.png",
        timeOfDaySections: [
          {
            timeOfDay: "Morning",
            paragraphs: [
              "7:00 AM: Excursion to Yumthang Valley (3,500m), famous as the Valley of Flowers with 24 species of rhododendrons.",
              "9:30 AM: Visit Yumthang Natural Hot Springs across the wooden footbridge."
            ]
          },
          {
            timeOfDay: "Afternoon",
            paragraphs: [
              "Continue further to Zero Point (Yumesamdong, 4,600m), where snow persists year-round at the Tibetan border.",
              "2:00 PM: Enjoy snow sports and hot noodles at Zero Point."
            ]
          },
          {
            timeOfDay: "Evening",
            paragraphs: [
              "Return to Lachung village. Visit 160-year-old Lachung Monastery.",
              "7:00 PM: Traditional Tibetan dinner."
            ]
          }
        ]
      },
      {
        dayNumber: 4,
        title: "Lachung to Gangtok via Phodong Monastery",
        dayImage: "/itineraries/north_sikkim.png",
        timeOfDaySections: [
          {
            timeOfDay: "Morning",
            paragraphs: [
              "8:00 AM: Return journey from Lachung towards Gangtok.",
              "11:00 AM: Visit Phodong Monastery, one of the six main Karma Kagyu monasteries in Sikkim."
            ]
          },
          {
            timeOfDay: "Afternoon",
            paragraphs: [
              "Lunch break enroute along Teesta River valley.",
              "3:30 PM: Arrive in Gangtok and check into your hotel."
            ]
          },
          {
            timeOfDay: "Evening",
            paragraphs: [
              "Leisurely walk along MG Marg pedestrian boulevard.",
              "7:00 PM: Dinner at MG Marg fine dining restaurant."
            ]
          }
        ]
      },
      {
        dayNumber: 5,
        title: "Tsomgo Glacial Lake & Baba Mandir",
        dayImage: "/itineraries/north_sikkim.png",
        timeOfDaySections: [
          {
            timeOfDay: "Morning",
            paragraphs: [
              "7:30 AM: Drive to Tsomgo (Changu) Lake (3,753m), a sacred oval glacial lake surrounded by steep mountains.",
              "10:00 AM: Experience traditional Yak rides around the snow-covered lake shore."
            ]
          },
          {
            timeOfDay: "Afternoon",
            paragraphs: [
              "Visit Baba Harbhajan Singh Temple (Baba Mandir) honoring the legendary Indian soldier hero.",
              "1:30 PM: View Nathula Pass border posts in the distance."
            ]
          },
          {
            timeOfDay: "Evening",
            paragraphs: [
              "Return to Gangtok in late afternoon.",
              "6:30 PM: Enjoy evening hot beverages and local souvenirs."
            ]
          }
        ]
      },
      {
        dayNumber: 6,
        title: "Gangtok Local Sightseeing & Temples",
        dayImage: "/itineraries/north_sikkim.png",
        timeOfDaySections: [
          {
            timeOfDay: "Morning",
            paragraphs: [
              "9:00 AM: Visit Rumtek Monastery (Dharma Chakra Centre), the seat of H.H. Karmapa.",
              "11:30 AM: Tour Namgyal Institute of Tibetology & Do Drul Chorten Stupa."
            ]
          },
          {
            timeOfDay: "Afternoon",
            paragraphs: [
              "Visit Enchey Monastery and Flower Exhibition Centre.",
              "3:00 PM: Enjoy Gangtok Cable Car Ropeway ride over Gangtok valley."
            ]
          },
          {
            timeOfDay: "Evening",
            paragraphs: [
              "Final shopping for Sikkim tea, prayer wheels, and handicrafts.",
              "7:30 PM: Gala farewell dinner."
            ]
          }
        ]
      },
      {
        dayNumber: 7,
        title: "Farewell to Sikkim",
        dayImage: "/itineraries/north_sikkim.png",
        timeOfDaySections: [
          {
            timeOfDay: "Morning",
            paragraphs: [
              "8:30 AM: Breakfast with sunrise views over Gangtok valley.",
              "10:00 AM: Check out from hotel."
            ]
          },
          {
            timeOfDay: "Afternoon",
            paragraphs: [
              "Transfer to Bagdogra Airport (IXB) / New Jalpaiguri Railway Station (NJP)."
            ]
          },
          {
            timeOfDay: "Evening",
            paragraphs: [
              "Departure with unforgettable Himalayan memories of North Sikkim."
            ]
          }
        ]
      }
    ]
  }
};

export function AIPlanner({ user }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mega dropdown toggle states & selected filter arrays
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [selectedStates, setSelectedStates] = useState([]);

  const [isInterestOpen, setIsInterestOpen] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState([]);

  const [isTripLengthOpen, setIsTripLengthOpen] = useState(false);
  const [selectedLengths, setSelectedLengths] = useState([]);

  // AI Itinerary state
  const itinerarySectionRef = useRef(null);
  const [aiItinerary, setAiItinerary] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [itineraryError, setItineraryError] = useState("");

  // Check if routed from CuratedItineraries card click
  useEffect(() => {
    if (location.state?.curatedItinerary) {
      const item = location.state.curatedItinerary;
      const matched =
        CURATED_ITINERARIES_MAP[item.id] ||
        Object.values(CURATED_ITINERARIES_MAP).find(
          (c) => c.title.toLowerCase() === item.title?.toLowerCase()
        );

      if (matched) {
        setAiItinerary(matched);
        setSelectedStates(["Sikkim"]);
        setSelectedInterests(["Heritage & Monasteries"]);
        setSelectedLengths([item.days]);
        setTimeout(() => {
          itinerarySectionRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    }
  }, [location.state]);

  // Reset filters and itinerary state when planning another trip
  const handlePlanAnotherTrip = () => {
    setAiItinerary(null);
    setItineraryError("");
    setSelectedStates([]);
    setSelectedInterests([]);
    setSelectedLengths([]);
    setSelectedLength("All");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGenerateItinerary = async () => {
    const hasRegion = selectedStates.length > 0;
    const hasInterest = selectedInterests.length > 0;
    const hasTripLength = selectedLengths.length > 0;

    if (!hasRegion || !hasInterest || !hasTripLength) {
      const missing = [];
      if (!hasRegion) missing.push("Region");
      if (!hasInterest) missing.push("Interest");
      if (!hasTripLength) missing.push("Trip Length");

      const formattedMissing = missing.join(", ");
      setItineraryError(
        `Please select ${formattedMissing} to generate itinerary`,
      );
      return;
    }

    try {
      setIsGenerating(true);
      setItineraryError("");
      setIsRegionOpen(false);
      setIsInterestOpen(false);
      setIsTripLengthOpen(false);

      const res = await axios.post("/api/itineraries/generate", {
        selectedStates,
        selectedInterests,
        selectedLengths,
        days: selectedLengths.length > 0 ? selectedLengths[0] : "2",
      });

      if (res.data && res.data.plan) {
        setAiItinerary(res.data.plan);
        setTimeout(() => {
          itinerarySectionRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 150);
      } else {
        setItineraryError(
          "We couldn't generate an itinerary for these selections. Please try different options!",
        );
      }
    } catch (err) {
      console.error("Error generating itinerary:", err);
      setItineraryError(
        "Unable to generate itinerary right now. Please check your connection or try again.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const [selectedLength, setSelectedLength] = useState("All");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(5);

  // Responsive cards per view calculation
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w >= 1200) setCardsPerPage(5);
      else if (w >= 992) setCardsPerPage(4);
      else if (w >= 768) setCardsPerPage(3);
      else if (w >= 576) setCardsPerPage(2);
      else setCardsPerPage(1);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch places strictly from MongoDB API endpoints (/api/places first, then /api/temples)
  useEffect(() => {
    const fetchMongoPlacesData = async () => {
      setLoading(true);
      const combinedPlaces = [];

      // 1. Fetch from /api/places
      try {
        const placesRes = await axios.get("/api/places");
        if (placesRes.data && Array.isArray(placesRes.data)) {
          placesRes.data.forEach((p, idx) => {
            combinedPlaces.push({
              id: p.id || p._id,
              type: "place",
              duration:
                p.idealDuration || p.duration || `${(idx % 3) + 1} Days`,
              locationName:
                p.city || p.name || p.location?.split(",")[0] || "Attraction",
              description:
                p.subtitle ||
                p.description ||
                `${p.name}: Sightseeing & Heritage Trail`,
              image: p.image || (Array.isArray(p.images) ? p.images[0] : ""),
              state: p.state || "India",
              region: p.state
                ? p.state.includes("Pradesh")
                  ? "Central India"
                  : "North India"
                : "All",
              interest: p.category || "Heritage & Culture",
              tripLength: p.idealDuration || `${(idx % 3) + 1} Days`,
            });
          });
        }
      } catch (err) {
        console.error("Error fetching /api/places from MongoDB:", err);
      }

      // 2. Fetch from /api/temples
      try {
        const templesRes = await axios.get("/api/temples");
        if (templesRes.data && Array.isArray(templesRes.data)) {
          templesRes.data.forEach((t) => {
            combinedPlaces.push({
              id: t.id || t._id,
              type: "temple",
              duration: "2 Days",
              locationName: t.city || t.name,
              description: t.tagline
                ? `${t.name}: ${t.tagline}`
                : t.description || `${t.name} Sacred Darshan`,
              image: t.image || (Array.isArray(t.images) ? t.images[0] : ""),
              state: t.city === "Ujjain" ? "Madhya Pradesh" : "India",
              region: t.city === "Ujjain" ? "Central India" : "North India",
              interest: "Spiritual & Temples",
              tripLength: "2 Days",
            });
          });
        }
      } catch (err) {
        console.error("Error fetching /api/temples from MongoDB:", err);
      }

      // Deduplicate by item ID
      const uniqueMap = new Map();
      combinedPlaces.forEach((item) => {
        if (item.id && !uniqueMap.has(item.id)) {
          uniqueMap.set(item.id, item);
        }
      });

      const list = Array.from(uniqueMap.values());
      setPlaces(list);
      setFilteredPlaces(list);
      setLoading(false);
    };

    fetchMongoPlacesData();
  }, []);

  // Toggle Region State Selection
  const toggleState = (stName) => {
    if (stName.startsWith("All ")) {
      const regionObj = REGION_MAP_DATA.find((r) => r.allLabel === stName);
      if (!regionObj) return;
      const allRegionStates = regionObj.states;
      const isAllSelected = allRegionStates.every((st) =>
        selectedStates.includes(st),
      );

      if (isAllSelected) {
        setSelectedStates(
          selectedStates.filter(
            (st) => !allRegionStates.includes(st) && st !== stName,
          ),
        );
      } else {
        const updated = Array.from(
          new Set([...selectedStates, ...allRegionStates, stName]),
        );
        setSelectedStates(updated);
      }
    } else {
      if (selectedStates.includes(stName)) {
        setSelectedStates(selectedStates.filter((s) => s !== stName));
      } else {
        setSelectedStates([...selectedStates, stName]);
      }
    }
  };

  // Toggle Interest Option Selection
  const toggleInterestOption = (optName) => {
    if (optName.startsWith("All ")) {
      const catObj = INTEREST_MAP_DATA.find((i) => i.allLabel === optName);
      if (!catObj) return;
      const allOpts = catObj.options;
      const isAllSelected = allOpts.every((o) => selectedInterests.includes(o));

      if (isAllSelected) {
        setSelectedInterests(
          selectedInterests.filter(
            (o) => !allOpts.includes(o) && o !== optName,
          ),
        );
      } else {
        const updated = Array.from(
          new Set([...selectedInterests, ...allOpts, optName]),
        );
        setSelectedInterests(updated);
      }
    } else {
      if (selectedInterests.includes(optName)) {
        setSelectedInterests(selectedInterests.filter((o) => o !== optName));
      } else {
        setSelectedInterests([...selectedInterests, optName]);
      }
    }
  };

  // Toggle Trip Length Selection
  const toggleTripLength = (lenOpt) => {
    if (selectedLengths.includes(lenOpt)) {
      setSelectedLengths(selectedLengths.filter((l) => l !== lenOpt));
    } else {
      setSelectedLengths([...selectedLengths, lenOpt]);
    }
  };

  // Handle Filtering
  useEffect(() => {
    let result = [...places];

    if (selectedStates.length > 0) {
      result = result.filter((p) => {
        const pState = (p.state || "").toLowerCase();
        const pLoc = (p.locationName || "").toLowerCase();
        return selectedStates.some((st) => {
          const cleanSt = st.replace(/^All\s+/, "").toLowerCase();
          return (
            pState.includes(cleanSt) ||
            pLoc.includes(cleanSt) ||
            st === "All East" ||
            st === "All West" ||
            st === "All Central" ||
            st === "All North" ||
            st === "All North East" ||
            st === "All South"
          );
        });
      });
    }

    if (selectedInterests.length > 0) {
      result = result.filter((p) => {
        const pCat = (p.interest || "").toLowerCase();
        const pDesc = (p.description || "").toLowerCase();
        return selectedInterests.some((intOpt) => {
          const cleanOpt = intOpt.replace(/^All\s+/, "").toLowerCase();
          return pCat.includes(cleanOpt) || pDesc.includes(cleanOpt);
        });
      });
    }

    if (selectedLengths.length > 0) {
      result = result.filter((p) => {
        const durationStr = (p.duration || p.tripLength || "").toLowerCase();
        const daysMatch = durationStr.match(/(\d+)/);
        const daysNum = daysMatch ? parseInt(daysMatch[1], 10) : null;

        return selectedLengths.some((range) => {
          if (range === "1-2 Days")
            return (
              (daysNum !== null && daysNum >= 1 && daysNum <= 2) ||
              durationStr.includes("1-2") ||
              durationStr.includes("1 day") ||
              durationStr.includes("2 day")
            );
          if (range === "3-4 Days")
            return (
              (daysNum !== null && daysNum >= 3 && daysNum <= 4) ||
              durationStr.includes("3-4") ||
              durationStr.includes("3 day") ||
              durationStr.includes("4 day")
            );
          if (range === "5-6 Days")
            return (
              (daysNum !== null && daysNum >= 5 && daysNum <= 6) ||
              durationStr.includes("5-6") ||
              durationStr.includes("5 day") ||
              durationStr.includes("6 day")
            );
          if (range === "7-13 Days")
            return (
              (daysNum !== null && daysNum >= 7 && daysNum <= 13) ||
              durationStr.includes("7-13")
            );
          if (range === "14+ Days")
            return (
              (daysNum !== null && daysNum >= 14) || durationStr.includes("14+")
            );
          return durationStr.includes(range.toLowerCase());
        });
      });
    }

    if (selectedLength !== "All") {
      result = result.filter(
        (p) =>
          p.duration.includes(selectedLength) ||
          p.tripLength === selectedLength,
      );
    }

    setFilteredPlaces(result);
    setCarouselIndex(0);
  }, [
    selectedStates,
    selectedInterests,
    selectedLengths,
    selectedLength,
    places,
  ]);

  const maxIndex = Math.max(0, filteredPlaces.length - cardsPerPage);

  const handlePrev = () => {
    setCarouselIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCarouselIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const handleCardClick = (item) => {
    if (item.type === "temple") {
      navigate(`/temple/${item.id}`);
    } else {
      navigate(`/place/${item.id}`);
    }
  };

  const cardWidthPercentage = 100 / cardsPerPage;

  return (
    <div
      className={`min-vh-100 ${styles.itineraryMapBg} d-flex flex-column justify-content-between position-relative overflow-x-hidden`}
      style={{
        paddingTop: "120px",
        paddingBottom: "80px",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* MAIN CONTAINER */}
      <div className="container-fluid px-3 px-md-5 my-auto">
        {/* HEADER SECTION */}
        <div className="text-center mb-4">
          <h1 className={styles.itinerariesTitle}>ITINERARIES</h1>
          <div className={styles.itinerarySubtitle}>
            <span className={styles.itinerarySubtitleLine}></span>
            <span>that beckon every traveller</span>
            <span className={styles.itinerarySubtitleLine}></span>
          </div>
        </div>

        {/* FILTER DROPDOWNS BAR */}
        <div className="d-flex flex-wrap align-items-center justify-content-center gap-3 mb-4 position-relative">
          {/* Region Toggle Button (Red when open) */}
          <button
            type="button"
            className={`btn shadow-xs rounded-3 px-4 py-2 fw-bold d-inline-flex align-items-center gap-2 transition-all ${
              isRegionOpen ? "text-white" : "bg-white text-dark border"
            }`}
            style={{
              backgroundColor: isRegionOpen ? "#ef4444" : "#ffffff",
              borderColor: isRegionOpen ? "#ef4444" : "#cbd5e1",
              fontSize: "0.95rem",
            }}
            onClick={() => {
              setIsRegionOpen(!isRegionOpen);
              if (!isRegionOpen) {
                setIsInterestOpen(false);
                setIsTripLengthOpen(false);
              }
            }}
          >
            <span>Region</span>
            {isRegionOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {/* Interest Toggle Button (Red when open) */}
          <button
            type="button"
            className={`btn shadow-xs rounded-3 px-4 py-2 fw-bold d-inline-flex align-items-center gap-2 transition-all ${
              isInterestOpen ? "text-white" : "bg-white text-dark border"
            }`}
            style={{
              backgroundColor: isInterestOpen ? "#ef4444" : "#ffffff",
              borderColor: isInterestOpen ? "#ef4444" : "#cbd5e1",
              fontSize: "0.95rem",
            }}
            onClick={() => {
              setIsInterestOpen(!isInterestOpen);
              if (!isInterestOpen) {
                setIsRegionOpen(false);
                setIsTripLengthOpen(false);
              }
            }}
          >
            <span>Interest</span>
            {isInterestOpen ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>

          {/* Trip Length Toggle Button (Red when open) */}
          <button
            type="button"
            className={`btn shadow-xs rounded-3 px-4 py-2 fw-bold d-inline-flex align-items-center gap-2 transition-all ${
              isTripLengthOpen ? "text-white" : "bg-white text-dark border"
            }`}
            style={{
              backgroundColor: isTripLengthOpen ? "#ef4444" : "#ffffff",
              borderColor: isTripLengthOpen ? "#ef4444" : "#cbd5e1",
              fontSize: "0.95rem",
            }}
            onClick={() => {
              setIsTripLengthOpen(!isTripLengthOpen);
              if (!isTripLengthOpen) {
                setIsRegionOpen(false);
                setIsInterestOpen(false);
              }
            }}
          >
            <span>Trip Length</span>
            {isTripLengthOpen ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>

          {/* Generate AI Itinerary Action Button */}
          <button
            type="button"
            className="btn text-white shadow-sm rounded-3 px-4 py-2 fw-bold d-inline-flex align-items-center gap-2 transition-all hover-scale"
            style={{
              backgroundColor: "#ef4444",
              border: "none",
              fontSize: "0.95rem",
            }}
            onClick={handleGenerateItinerary}
            disabled={isGenerating}
          >
            <span>{isGenerating ? "Generating..." : "Generate Itinerary"}</span>
          </button>

          {/* MEGA DROPDOWN OVERLAY PANEL FOR REGIONS & STATES */}
          {isRegionOpen && (
            <div className={`p-4 p-md-5 ${styles.megaRegionPanel}`}>
              {/* Close Button X on Top Right */}
              <button
                type="button"
                className="btn btn-link p-1 text-dark position-absolute top-0 end-0 m-3 m-md-4 border-0 shadow-none hover-scale"
                onClick={() => setIsRegionOpen(false)}
                title="Close Region Selection"
              >
                <X size={24} />
              </button>

              {/* 6 Region Columns: East, West, Central, North East, North, South */}
              <div className="row g-4 justify-content-between">
                {REGION_MAP_DATA.map((reg) => (
                  <div
                    key={reg.name}
                    className="col-12 col-sm-6 col-md-4 col-lg-2"
                  >
                    {/* Generated Clean India Map PNG Graphic for this Region Column */}
                    <div className="text-center mb-2">
                      <img
                        src="/india_map_region.png"
                        alt={`India Map - ${reg.name}`}
                        className="mx-auto d-block rounded-3 transition-all hover-scale"
                        style={{
                          width: "84px",
                          height: "94px",
                          objectFit: "contain",
                          filter:
                            "drop-shadow(0 4px 10px rgba(14, 165, 233, 0.25))",
                        }}
                      />
                    </div>

                    {/* Red Region Title Header */}
                    <h6
                      className={`text-center mb-3 ${styles.regionColHeader}`}
                    >
                      {reg.name}
                    </h6>

                    {/* Checkbox Options List */}
                    <div className="d-flex flex-column gap-2">
                      {/* All [Region] Checkbox Option */}
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="checkbox"
                          id={`cb-${reg.allLabel}`}
                          className={styles.regionCheckboxInput}
                          checked={reg.states.every((st) =>
                            selectedStates.includes(st),
                          )}
                          onChange={() => toggleState(reg.allLabel)}
                        />
                        <label
                          htmlFor={`cb-${reg.allLabel}`}
                          className={`${styles.regionCheckboxLabel} fw-bold`}
                        >
                          {reg.allLabel}
                        </label>
                      </div>

                      {/* Sub-State Checkbox Options */}
                      {reg.states.map((st) => (
                        <div
                          key={st}
                          className="d-flex align-items-start gap-2"
                        >
                          <input
                            type="checkbox"
                            id={`cb-${st}`}
                            className={`${styles.regionCheckboxInput} mt-1`}
                            checked={selectedStates.includes(st)}
                            onChange={() => toggleState(st)}
                          />
                          <label
                            htmlFor={`cb-${st}`}
                            className={styles.regionCheckboxLabel}
                          >
                            {st}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Action Bar: Clear & Apply Buttons */}
              <div className="d-flex align-items-center justify-content-end gap-3 mt-4 pt-3 border-top">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm rounded-pill px-4 py-2 fw-bold"
                  onClick={() => setSelectedStates([])}
                >
                  Clear
                </button>
                <button
                  type="button"
                  className="btn text-white btn-sm rounded-pill px-4 py-2 fw-bold shadow-sm"
                  style={{ backgroundColor: "#ef4444", border: "none" }}
                  onClick={() => setIsRegionOpen(false)}
                >
                  Apply
                </button>
              </div>
            </div>
          )}

          {/* MEGA DROPDOWN OVERLAY PANEL FOR INTERESTS & CATEGORIES */}
          {isInterestOpen && (
            <div
              className={`p-4 p-md-5 ${styles.megaRegionPanel}`}
              style={{ maxHeight: "72vh", overflowY: "auto" }}
            >
              {/* Close Button X on Top Right */}
              <button
                type="button"
                className="btn btn-link p-1 text-dark position-absolute top-0 end-0 m-3 m-md-4 border-0 shadow-none hover-scale"
                onClick={() => setIsInterestOpen(false)}
                title="Close Interest Selection"
              >
                <X size={24} />
              </button>

              {/* Interest Categories Rows */}
              <div className="d-flex flex-column gap-4 pt-2">
                {INTEREST_MAP_DATA.map((catObj) => (
                  <div key={catObj.category} className="pb-3 border-bottom">
                    {/* Red Category Title Header */}
                    <h6
                      className="fw-bold mb-2.5"
                      style={{ color: "#ef4444", fontSize: "1.05rem" }}
                    >
                      {catObj.category}
                    </h6>

                    {/* Options Row with Checkboxes */}
                    <div
                      className="d-flex flex-wrap align-items-center"
                      style={{ gap: "10px 24px" }}
                    >
                      {/* All [Category] Checkbox */}
                      <div className="d-flex align-items-center">
                        <input
                          type="checkbox"
                          id={`cb-int-${catObj.allLabel}`}
                          className={styles.regionCheckboxInput}
                          checked={catObj.options.every((o) =>
                            selectedInterests.includes(o),
                          )}
                          onChange={() => toggleInterestOption(catObj.allLabel)}
                        />
                        <label
                          htmlFor={`cb-int-${catObj.allLabel}`}
                          className={`${styles.regionCheckboxLabel} fw-bold`}
                        >
                          {catObj.allLabel}
                        </label>
                      </div>

                      {/* Sub-Options Checkboxes */}
                      {catObj.options.map((opt) => (
                        <div key={opt} className="d-flex align-items-center">
                          <input
                            type="checkbox"
                            id={`cb-int-${opt}`}
                            className={styles.regionCheckboxInput}
                            checked={selectedInterests.includes(opt)}
                            onChange={() => toggleInterestOption(opt)}
                          />
                          <label
                            htmlFor={`cb-int-${opt}`}
                            className={styles.regionCheckboxLabel}
                          >
                            {opt}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Action Bar: Clear & Apply Buttons */}
              <div className="d-flex align-items-center justify-content-end gap-3 mt-4 pt-3 border-top">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm rounded-pill px-4 py-2 fw-bold"
                  onClick={() => setSelectedInterests([])}
                >
                  Clear
                </button>
                <button
                  type="button"
                  className="btn text-white btn-sm rounded-pill px-4 py-2 fw-bold shadow-sm"
                  style={{ backgroundColor: "#ef4444", border: "none" }}
                  onClick={() => setIsInterestOpen(false)}
                >
                  Apply
                </button>
              </div>
            </div>
          )}

          {/* MEGA DROPDOWN OVERLAY PANEL FOR TRIP LENGTH */}
          {isTripLengthOpen && (
            <div className={`p-4 p-md-5 ${styles.megaRegionPanel}`}>
              {/* Close Button X on Top Right */}
              <button
                type="button"
                className="btn btn-link p-1 text-dark position-absolute top-0 end-0 m-3 m-md-4 border-0 shadow-none hover-scale"
                onClick={() => setIsTripLengthOpen(false)}
                title="Close Trip Length Selection"
              >
                <X size={24} />
              </button>

              {/* Checkbox Options Row */}
              <div
                className="d-flex flex-wrap align-items-center py-2"
                style={{ gap: "16px 36px" }}
              >
                {TRIP_LENGTH_OPTIONS.map((lenOpt) => (
                  <div key={lenOpt} className="d-flex align-items-center">
                    <input
                      type="checkbox"
                      id={`cb-len-${lenOpt}`}
                      className={styles.regionCheckboxInput}
                      checked={selectedLengths.includes(lenOpt)}
                      onChange={() => toggleTripLength(lenOpt)}
                    />
                    <label
                      htmlFor={`cb-len-${lenOpt}`}
                      className={styles.regionCheckboxLabel}
                    >
                      {lenOpt}
                    </label>
                  </div>
                ))}
              </div>

              {/* Bottom Action Bar: Apply & Clear Buttons on Bottom Left */}
              <div className="d-flex align-items-center justify-content-start gap-3 mt-4 pt-3 border-top">
                <button
                  type="button"
                  className="btn text-white btn-sm rounded-pill px-4 py-2 fw-bold shadow-sm"
                  style={{ backgroundColor: "#ef4444", border: "none" }}
                  onClick={handleGenerateItinerary}
                >
                  Apply & Plan Itinerary
                </button>
                <button
                  type="button"
                  className="btn btn-sm rounded-pill px-4 py-2 fw-bold"
                  style={{
                    border: "1px solid #ef4444",
                    color: "#ef4444",
                    backgroundColor: "transparent",
                  }}
                  onClick={() => setSelectedLengths([])}
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        {/* LOADING CONTAINER */}
        {isGenerating && (
          <div className="text-center py-5 my-4 bg-white rounded-4 shadow-sm border max-w-800 mx-auto p-4">
            <div
              className="spinner-border text-danger"
              role="status"
              style={{ width: "3.2rem", height: "3.2rem" }}
            >
              <span className="visually-hidden">Generating...</span>
            </div>
            <h4 className="mt-3 fw-bold text-dark">
              Planning your Itinerary...
            </h4>
            <p className="text-muted m-0">
              Creating personalized day-by-day travel plan with real images.
            </p>
          </div>
        )}

        {/* ERROR NOTIFICATION */}
        {itineraryError && (
          <div className="alert alert-danger max-w-800 mx-auto my-3 rounded-3 text-center fw-semibold">
            {itineraryError}
          </div>
        )}

        {/* DAY-BY-DAY GENERATED ITINERARY VIEW (MATCHING REFERENCE UI) */}
        {aiItinerary && !isGenerating && (
          <div
            ref={itinerarySectionRef}
            className="bg-white rounded-4 shadow-lg border overflow-hidden my-5 max-w-1200 mx-auto text-start position-relative"
          >
            {/* TOP HEADER CONTROLS BAR FOR ON-PAGE ITINERARY */}
            <div className="bg-light p-3 px-4 border-bottom d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div className="d-flex align-items-center gap-2">
                <span className="fw-bold text-dark fs-5">
                  Generated Itinerary
                </span>
              </div>
              <div className="d-flex align-items-center gap-3">
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm rounded-pill px-4 py-2 fw-bold d-inline-flex align-items-center gap-2"
                  onClick={handlePlanAnotherTrip}
                >
                  <ArrowLeft size={16} />
                  <span>Plan Another Trip</span>
                </button>
                <button
                  type="button"
                  className="btn text-white btn-sm rounded-pill px-4 py-2 fw-bold shadow-sm"
                  style={{ backgroundColor: "#ef4444", border: "none" }}
                  onClick={() => window.print()}
                >
                  Save Itinerary PDF
                </button>
              </div>
            </div>

            {/* Full-Width Hero Banner */}
            <div
              className="w-100 position-relative"
              style={{ height: "400px" }}
            >
              <img
                src={
                  aiItinerary.heroImage ||
                  "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1200"
                }
                alt={aiItinerary.destinationTitle || "Itinerary Hero"}
                className="w-100 h-100 object-fit-cover"
              />
            </div>

            {/* Section 1: Overview & Map Card */}
            <div className="p-4 p-md-5">
              <div className="row g-4 align-items-start">
                {/* Left Column: Destination Title & Paragraphs */}
                <div className="col-12 col-lg-8">
                  <h2
                    className="fw-bold mb-3 text-dark"
                    style={{ fontSize: "2.1rem" }}
                  >
                    {aiItinerary.destinationTitle ||
                      "Blend of heritage and modernity"}
                  </h2>
                  <p
                    className="text-secondary leading-relaxed mb-3"
                    style={{ fontSize: "1.02rem", lineHeight: "1.7" }}
                  >
                    {aiItinerary.summaryParagraph1}
                  </p>
                  <p
                    className="text-secondary leading-relaxed mb-0"
                    style={{ fontSize: "1.02rem", lineHeight: "1.7" }}
                  >
                    {aiItinerary.summaryParagraph2}
                  </p>
                </div>

                {/* Right Column: Map Card */}
                <div className="col-12 col-lg-4">
                  <div className="rounded-3 border overflow-hidden bg-light shadow-xs">
                    {/* Map Graphic Preview */}
                    <div
                      className="p-3 text-center bg-white border-bottom position-relative"
                      style={{
                        height: "150px",
                        backgroundImage:
                          "url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=600')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div className="position-absolute top-50 start-50 translate-middle text-danger">
                        <MapPin size={34} fill="#ef4444" color="#ffffff" />
                      </div>
                    </div>
                    {/* Distance Badge & Action Buttons */}
                    <div className="p-3 bg-white">
                      <p className="m-0 text-muted small fw-semibold">
                        Route distance :{" "}
                        <strong className="text-danger fs-6 fw-bold">
                          {aiItinerary.routeDistance || "45 Kms"}
                        </strong>
                      </p>
                    </div>
                    <div className="d-flex border-top">
                      <button
                        type="button"
                        className="btn btn-danger rounded-0 flex-fill py-2 d-flex align-items-center justify-content-center"
                        style={{ backgroundColor: "#ef4444", border: "none" }}
                        title="Favorite Itinerary"
                      >
                        <Heart size={18} fill="#ffffff" color="#ffffff" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger rounded-0 flex-fill py-2 d-flex align-items-center justify-content-center border-start border-white"
                        style={{ backgroundColor: "#ef4444", border: "none" }}
                        title="Share Itinerary"
                      >
                        <Share2 size={18} color="#ffffff" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Day-by-Day Timeline */}
            <div className="px-4 px-md-5 pb-5">
              {aiItinerary.days?.map((dayObj) => (
                <div
                  key={dayObj.dayNumber}
                  className="mb-5 position-relative border-top pt-4"
                >
                  {/* Cyan/Blue Circular Day Pin Badge */}
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <span
                      className="badge rounded-circle text-white d-inline-flex align-items-center justify-content-center fw-bold shadow-sm"
                      style={{
                        width: "52px",
                        height: "52px",
                        backgroundColor: "#0ea5e9",
                        fontSize: "1.05rem",
                      }}
                    >
                      Day {dayObj.dayNumber}
                    </span>
                    <h3
                      className="fw-bold m-0 text-dark"
                      style={{ fontSize: "1.65rem" }}
                    >
                      {dayObj.title}
                    </h3>
                  </div>

                  {/* Day Feature Image */}
                  {dayObj.dayImage && (
                    <div
                      className="rounded-4 overflow-hidden mb-4 shadow-sm"
                      style={{ maxHeight: "420px" }}
                    >
                      <img
                        src={dayObj.dayImage}
                        alt={`Day ${dayObj.dayNumber}`}
                        className="w-100 h-100 object-fit-cover"
                        style={{ maxHeight: "420px" }}
                      />
                    </div>
                  )}

                  {/* Content Row: Timeline Schedule & Right Sidebar Card */}
                  <div className="row g-4 align-items-start">
                    {/* Timeline Sections (Morning, Afternoon, Evening) */}
                    <div className="col-12 col-lg-8">
                      {dayObj.timeOfDaySections?.map((sec, sIdx) => (
                        <div key={sIdx} className="mb-4">
                          <h4
                            className="fw-bold text-dark mb-2"
                            style={{ fontSize: "1.25rem" }}
                          >
                            {sec.timeOfDay}
                          </h4>
                          {sec.paragraphs?.map((pText, pIdx) => (
                            <p
                              key={pIdx}
                              className="text-secondary leading-relaxed mb-2"
                              style={{
                                fontSize: "0.98rem",
                                lineHeight: "1.65",
                              }}
                            >
                              {pText}
                            </p>
                          ))}
                        </div>
                      ))}
                    </div>

                    {/* Right Sidebar Card: Information & Experience Photo Card */}
                    <div className="col-12 col-lg-4">
                      <div className="bg-light p-3.5 rounded-3 border mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="small text-muted fw-bold">
                            More Information →
                          </span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="small text-dark fw-bold">
                            You may enjoy →
                          </span>
                        </div>
                        {aiItinerary.sidebarExperience && (
                          <div className="rounded-3 overflow-hidden border bg-white mt-2 shadow-xs">
                            <img
                              src={aiItinerary.sidebarExperience.image}
                              alt="Experience"
                              className="w-100 object-fit-cover"
                              style={{ height: "140px" }}
                            />
                            <div className="p-3">
                              <span className="text-danger small fw-bold d-block mb-1">
                                Experience
                              </span>
                              <p className="small text-dark fw-semibold m-0 leading-snug">
                                {aiItinerary.sidebarExperience.title}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Highlights Bar */}
              {aiItinerary.highlights && aiItinerary.highlights.length > 0 && (
                <div className="d-flex flex-wrap align-items-center gap-2 pt-3 border-top">
                  <span className="fw-bold text-dark me-2">Highlights:</span>
                  {aiItinerary.highlights.map((h, hIdx) => (
                    <span
                      key={hIdx}
                      className="badge bg-light text-dark border px-3 py-1.5 rounded-pill fw-semibold"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="d-flex align-items-center justify-content-center gap-3 mt-4 pt-3">
                <button
                  type="button"
                  className="btn btn-outline-dark rounded-pill px-4 py-2 fw-bold"
                  onClick={handlePlanAnotherTrip}
                >
                  Plan Another Trip
                </button>
                <button
                  type="button"
                  className="btn text-white rounded-pill px-4 py-2 fw-bold shadow-sm"
                  style={{ backgroundColor: "#ef4444", border: "none" }}
                  onClick={() => window.print()}
                >
                  Save Itinerary PDF
                </button>
              </div>
            </div>
          </div>
        )}

        {!aiItinerary && (
          <>
        {/* ARCH CAPSULE CARDS SLIDING CAROUSEL TRACK */}
        <div
          className="overflow-hidden position-relative max-w-1400 mx-auto px-2 pt-5 pb-3"
          style={{ paddingTop: "52px" }}
        >
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-info" role="status">
                <span className="visually-hidden">Loading places...</span>
              </div>
              <p className="mt-2 text-muted fw-semibold">Fetching places...</p>
            </div>
          ) : filteredPlaces.length === 0 ? (
            <div className="text-center py-5 bg-white rounded-4 shadow-sm border max-w-600 mx-auto">
              <p className="fs-5 text-muted mb-2">
                No places found matching your selected filters.
              </p>
              <button
                className="btn btn-outline-danger btn-sm rounded-pill px-4 py-2 fw-semibold"
                onClick={() => {
                  setSelectedStates([]);
                  setSelectedInterests([]);
                  setSelectedLength("All");
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div
              className={styles.carouselSliderTrack}
              style={{
                transform: `translateX(-${carouselIndex * cardWidthPercentage}%)`,
              }}
            >
              {filteredPlaces.map((item) => (
                <div
                  key={item.id}
                  className={`${styles.itineraryCardWrapper} px-3 text-center cursor-pointer flex-shrink-0`}
                  style={{
                    flex: `0 0 ${cardWidthPercentage}%`,
                    maxWidth: `${cardWidthPercentage}%`,
                  }}
                  onClick={() => handleCardClick(item)}
                >
                  {/* DOME ARCH CAPSULE IMAGE CONTAINER */}
                  <div
                    className={`${styles.archCapsuleContainer} mx-auto mb-3`}
                  >
                    <img
                      src={item.image}
                      alt={item.locationName}
                      className={styles.archCapsuleImage}
                    />
                  </div>

                  {/* BOTTOM TEXT METADATA */}
                  <div className="d-flex flex-column align-items-center px-1">
                    {/* Duration Red Text */}
                    <span
                      className="fw-bold mb-0 text-uppercase"
                      style={{ color: "#e11d48", fontSize: "0.95rem" }}
                    >
                      {item.duration}
                    </span>

                    {/* Location Name Red Text */}
                    <h5
                      className="fw-bold mb-1 text-truncate w-100"
                      style={{ color: "#e11d48", fontSize: "1.15rem" }}
                    >
                      {item.locationName}
                    </h5>

                    {/* Description Black Text */}
                    <p
                      className="mb-0 text-dark fw-semibold"
                      style={{
                        fontSize: "0.88rem",
                        lineHeight: "1.35",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        color: "#1e293b",
                      }}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BOTTOM NAV ARROWS */}
        {filteredPlaces.length > cardsPerPage && (
          <div className="d-flex align-items-center justify-content-center gap-4 mt-4">
            <button
              type="button"
              className="btn btn-link p-2 text-dark border-0 transition-all hover-scale"
              onClick={handlePrev}
              disabled={carouselIndex === 0}
              style={{ opacity: carouselIndex === 0 ? 0.3 : 1 }}
              title="Previous Itineraries"
            >
              <ArrowLeft size={28} strokeWidth={2.5} />
            </button>
            <button
              type="button"
              className="btn btn-link p-2 text-dark border-0 transition-all hover-scale"
              onClick={handleNext}
              disabled={carouselIndex >= maxIndex}
              style={{ opacity: carouselIndex >= maxIndex ? 0.3 : 1 }}
              title="Next Itineraries"
            >
              <ArrowRight size={28} strokeWidth={2.5} />
            </button>
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
}
