import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Home.css";

const PRESETS = [
  { label: "20 × 20", cols: 20, rows: 20 },
  { label: "40 × 40", cols: 40, rows: 40 },
  { label: "50 × 50", cols: 50, rows: 50 },
  { label: "25 × 50", cols: 25, rows: 50 },
];

export default function Home() {
  const navigate = useNavigate();

  const openPreset = (preset) => {
    navigate("/planner", { state: { preset: { cols: preset.cols, rows: preset.rows } } });
  };

  return (
    <div className="home-container">
      <Navbar />

      <main className="home-main">
        <section className="hero-section">
          <h2>Design Your Dream Space</h2>
          <p>Create accurate floor plans with our intuitive drag-and-drop tool.</p>
          <button className="cta-button" onClick={() => navigate("/planner")}>
            Start Designing →
          </button>
        </section>

        <section className="presets-section">
          <h3>Quick Start with a Preset</h3>
          <div className="presets-grid">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                className="preset-btn"
                onClick={() => openPreset(p)}
              >
                <span className="preset-size">{p.label}</span>
                <span className="preset-dim">{p.cols * 0.5}m × {p.rows * 0.5}m</span>
              </button>
            ))}
          </div>
        </section>

        <section className="about-section">
          <div className="about-card">
            <h3>About Us</h3>
            <p>We provide standard tools for designers, architects, and homeowners.</p>
          </div>
          <div className="about-card">
            <h3>Our Goal</h3>
            <p>To make floor planning accessible, quick, and fun for everyone.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
