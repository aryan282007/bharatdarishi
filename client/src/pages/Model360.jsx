import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Box, Layers } from 'lucide-react';
import styles from '../styles/custom.module.css';

const models = [
  {
    id: 1,
    name: "Dzong-style-temple",
    slug: "dzong-style-temple",
    description: "Intricate 3D recreation of traditional dzong-style-temple architecture",
    image: "/images/Dzong_style_temple.webp",
    polygons: "85K"
  },
  {
    id: 2,
    name: "Bhutanese Temple",
    slug: "bhutanese_temple",
    description: "Intricate 3D recreation of traditional Bhutanese temple architecture",
    image: "/images/Bhutanes_temple.webp",
    polygons: "125K"
  },
  {
    id: 3,
    name: "Buddha Stupa",
    slug: "bhudistt_stupa",
    description: "Sacred Buddhist stupa with detailed ornamental elements",
    image: "/images/Buddha_stupa_.webp",
    polygons: "89K"
  },
  {
    id: 4,
    name: "Buddhist Temple",
    slug: "buddhist_temple",
    description: "Authentic Buddhist temple with traditional Himalayan design",
    image: "/images/Buddhist_temple.webp",
    polygons: "156K"
  },
  {
    id: 5,
    name: "Gonjang Monastery",
    slug: "Gojang_monastery",
    description: "Historic Gonjang monastery preserved in digital form",
    image: "/images/gonjang_3d.webp",
    polygons: "142K"
  },
  {
    id: 6,
    name: "Labrang Monastery",
    slug: "labrang_monastery",
    description: "One of the largest Tibetan monasteries captured in stunning detail",
    image: "/images/labrang_3d_model.webp",
    polygons: "198K"
  }
];

export function Model360() {
  return (
    <div className="bg-light min-vh-100" style={{ paddingTop: '100px', paddingBottom: '80px' }}>
      {/* Hero Header */}
      <header className="py-5 px-4 text-center">
        <div className="container max-w-4xl mx-auto">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)', color: '#333' }}>
            <Box size={16} />
            <span className="fw-medium small">3D Heritage Collection</span>
          </div>
          <h1 className={`display-4 fw-bold mb-4 text-dark ${styles.playfairFont}`}>
            Our 3D Models
          </h1>
          <p className="text-secondary fs-5 mx-auto" style={{ maxWidth: '700px' }}>
           See Bharat from a new perspective through interactive 3D experiences of its iconic places, cultural treasures, natural wonders, and heritage sites. Explore the rich history and vibrant culture of India in a whole new way.
          </p>
        </div>
      </header>

      {/* Models Grid */}
      <main className="container pb-5">
        <div className="row g-4 justify-content-center">
          {models.map((model) => (
            <div key={model.id} className="col-12 col-sm-6 col-lg-4">
              <Link to={`/model-view/${model.slug}`} className="text-decoration-none d-block h-100">
                <article 
                  className="card border-0 rounded-4 shadow-sm overflow-hidden position-relative" 
                  style={{ height: '450px', transition: 'all 0.3s ease', cursor: 'pointer' }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 .125rem .25rem rgba(0,0,0,.075)';
                  }}
                >
                  {/* Background Image */}
                  <img
                    src={model.image}
                    alt={model.name}
                    className="w-100 h-100 object-fit-cover position-absolute top-0 start-0 z-0"
                  />
                  
                  {/* Gradient Overlay for Text Readability */}
                  <div className="position-absolute top-0 start-0 w-100 h-100 z-1" 
                       style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 40%, transparent 100%)' }}>
                  </div>

                  {/* Polygon Badge (Optional, keeping it top-right if user wants) */}
                  <div className="position-absolute top-0 end-0 m-3 z-2">
                    <span className="badge bg-dark bg-opacity-75 text-white d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill shadow-sm border border-secondary border-opacity-50">
                      <Layers size={12} />
                      {model.polygons}
                    </span>
                  </div>

                  {/* Content Overlay */}
                  <div className="position-absolute bottom-0 start-0 w-100 p-4 d-flex flex-column align-items-start text-start z-2">
                    <h3 className={`text-white force-white-text fw-bold mb-2 ${styles.playfairFont}`} style={{ fontSize: '1.8rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                      {model.name}
                    </h3>
                    <p className="text-white force-white-text text-opacity-75 small mb-3" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                      {model.description}
                    </p>
                    <div 
                      className="btn rounded-pill px-4 py-2 fw-bold text-dark shadow-sm d-inline-flex align-items-center gap-2" 
                      style={{ backgroundColor: '#ffc107', border: 'none', fontSize: '0.95rem' }}
                    >
                      View Model <ArrowRight size={16} />
                    </div>
                  </div>
                </article>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
