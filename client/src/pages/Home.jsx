import React from 'react';
import { HeroCarousel } from '../components/HeroCarousel';
import { FeaturedTemples } from '../components/FeaturedTemples';
import { CuratedItineraries } from '../components/CuratedItineraries';
import { MobileAppSection } from '../components/MobileAppSection';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from '../styles/custom.module.css';

export function Home({ temples, events, itineraries }) {
  return (
    <div>
      {/* Hero Carousel Banner */}
      <HeroCarousel />

      {/* Featured Shrines Section */}
      <FeaturedTemples temples={temples} />

      {/* Curated Itineraries Section */}
      <CuratedItineraries itineraries={itineraries} />

      {/* Mobile App Download Showcase Section */}
      <MobileAppSection />
    </div>
  );
}
