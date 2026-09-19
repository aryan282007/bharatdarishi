import React, { useState, useEffect, Suspense } from "react";
import { useParams, Link } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import { ArrowLeft } from "lucide-react";

// Map slugs to their specific GLB file and model details
const modelDetails = {
  "dzong-style-temple": {
    file: "/models/dzong-style temple 3d model.glb",
    title: "Dzong Style Temple",
    location: "Eastern Himalayas, Bhutan",
    description: "Experience the sacred architecture of Dzong Style Temple, perched amid the misty peaks of Sikkim."
  },
  "bhutanese_temple": {
    file: "/models/bhutanese temple 3d model.glb",
    title: "Bhutanese Temple",
    location: "Bhutan",
    description: "Intricate 3D recreation of traditional Bhutanese temple architecture."
  },
  "bhudistt_stupa": {
    file: "/models/buddhist stupa 3d model.glb",
    title: "Buddha Stupa",
    location: "Sacred Sites",
    description: "Sacred Buddhist stupa with detailed ornamental elements."
  },
  "buddhist_temple": {
    file: "/models/buddhist temple 3d model.glb",
    title: "Buddhist Temple",
    location: "Himalayas",
    description: "Authentic Buddhist temple with traditional Himalayan design."
  },
  "Gojang_monastery": {
    file: "/models/gonjang.glb",
    title: "Gonjang Monastery",
    location: "Sikkim, India",
    description: "Historic Gonjang monastery preserved in digital form."
  },
  "labrang_monastery": {
    file: "/models/labrang monastry.glb",
    title: "Labrang Monastery",
    location: "Tibet",
    description: "One of the largest Tibetan monasteries captured in stunning detail."
  }
};

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={8} />;
}

function ModelFallback() {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#d4af37" />
    </mesh>
  );
}

export function ModelView() {
  const { slug } = useParams();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(true);
  }, []);

  const details = modelDetails[slug];

  if (!details) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-black text-white">
        <h2>Model not found</h2>
        <Link to="/model-360" className="text-warning mt-3">Back to Models</Link>
      </div>
    );
  }

  return (
    <div className="vw-100 vh-100 text-white force-white-text overflow-hidden d-flex flex-column position-absolute top-0 start-0" style={{ backgroundColor: '#000000', color: '#ffffff' }}>
      {/* Back Button */}
      <div className="position-absolute top-0 start-0 z-3 p-4">
        <Link to="/model-360" className="text-white force-white-text text-decoration-none d-flex align-items-center gap-2" style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '20px', backdropFilter: 'blur(4px)' }}>
          <ArrowLeft size={18} /> Back to Gallery
        </Link>
      </div>

      {/* Header */}
      <div className="position-absolute top-0 start-0 w-100 z-2 px-4 px-md-5 py-4 pt-5 mt-4" style={{ pointerEvents: 'none' }}>
        <div className="container-fluid max-w-7xl mx-auto mt-4 text-center text-md-start">
          <h1 className="display-4 fw-light text-white force-white-text mb-1">
            {details.title}
          </h1>
          <p className="text-white force-white-text opacity-75 small">
            {details.location}
          </p>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-grow-1 position-relative">
        <Canvas
          camera={{
            position: [0, 2, 8],
            fov: 50,
            near: 0.1,
            far: 1000,
          }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >
          {/* Lighting for premium look */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 15, 10]}
            intensity={0.8}
            castShadow
          />
          <directionalLight
            position={[-10, 5, -10]}
            intensity={0.2}
            color="#e6d5b8"
          />

          {/* Environment for subtle reflection */}
          <Environment preset="studio" />

          {/* Model */}
          <Suspense fallback={<ModelFallback />}>
            <Model url={details.file} />
          </Suspense>

          {/* Controls */}
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            autoRotate={true}
            autoRotateSpeed={3}
            minDistance={3}
            maxDistance={20}
            dampingFactor={0.05}
            rotateSpeed={0.5}
          />
        </Canvas>

        {/* Bottom Info Panel */}
        <div className="position-absolute bottom-0 start-0 w-100 p-4 p-md-5" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', pointerEvents: 'none' }}>
          <div className="max-w-2xl">
            <p className="text-white force-white-text font-light lh-lg opacity-75">
              {details.description} <br/> Rotate • Zoom • Explore
            </p>
            <div className="d-flex gap-4 mt-3">
              <div className="text-white force-white-text opacity-75 small">
                <p className="fw-medium text-white force-white-text mb-0">Built</p>
                <p className="fw-light force-white-text">Traditional Architecture</p>
              </div>
              <div className="text-white force-white-text opacity-75 small">
                <p className="fw-medium text-white force-white-text mb-0">Location</p>
                <p className="fw-light force-white-text">{details.location}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interaction Hints */}
      <div className="position-absolute top-50 start-50 translate-middle" style={{ pointerEvents: 'none' }}>
        {showContent && (
          <div className="text-center" style={{ animation: 'pulse 2s infinite' }}>
            <p className="text-white force-white-text small tracking-widest" style={{ letterSpacing: '4px' }}>
              DRAG TO ROTATE
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
