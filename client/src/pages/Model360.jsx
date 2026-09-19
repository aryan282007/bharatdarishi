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
          <p className="text-secondary fs-5 mx-auto" style={{ maxWidth: '600px' }}>
            Meticulously crafted 3D models preserving the sacred architecture 
            of Himalayan monasteries and temples.
          </p>
        </div>
      </header>

      {/* Models Grid */}
      <main className="container pb-5">
        <div className="row g-4">
          {models.map((model) => (
            <div key={model.id} className="col-12 col-md-6 col-lg-4">
              <Link to={`/model-view/${model.slug}`} className="text-decoration-none text-dark d-block h-100">
                <article className="card h-100 border-0 rounded-4 shadow-sm overflow-hidden" style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
                         onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                         onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  {/* Image Container */}
                  <div className="position-relative" style={{ height: '220px' }}>
                    <img
                      src={model.image}
                      alt={model.name}
                      className="w-100 h-100 object-fit-cover"
                    />
                    <div className="position-absolute bottom-0 start-0 w-100 h-50" style={{ background: 'linear-gradient(to top, rgba(255,255,255,1), transparent)' }}></div>
                    
                    {/* Polygon Badge */}
                    <div className="position-absolute top-0 end-0 m-3">
                      <span className="badge bg-white text-dark d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill shadow-sm border">
                        <Layers size={12} />
                        {model.polygons} polys
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="card-body p-4 bg-white d-flex flex-column justify-content-between">
                    <div>
                      <h4 className={`fw-bold mb-2 ${styles.playfairFont}`}>{model.name}</h4>
                      <p className="text-secondary small mb-4">{model.description}</p>
                    </div>
                    
                    <span className="d-inline-flex align-items-center gap-2 text-dark fw-medium small">
                      View Model <ArrowRight size={16} />
                    </span>
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
