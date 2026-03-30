import Navbar from "../components/Navbar";
import "../styles/About.css";

export default function About() {
  return (
    <div className="about-page">
      <Navbar />
      <div className="about-content">
        <section className="about-hero">
          <h1>About Floor Planner</h1>
          <p>
            We are building the most accessible and intuitive floor planning tool 
            for architects, interior designers, students, and homeowners alike.
          </p>
        </section>

        <section className="about-grid">
          <div className="about-feature-card">
            <div className="about-icon">📐</div>
            <h3>Precision Design</h3>
            <p>Grid-based placement ensures pixel-perfect accuracy for every wall, door, and furniture piece.</p>
          </div>
          <div className="about-feature-card">
            <div className="about-icon">🏗️</div>
            <h3>Multi-Floor Support</h3>
            <p>Design complete buildings with independent layouts for each floor level.</p>
          </div>
          <div className="about-feature-card">
            <div className="about-icon">💾</div>
            <h3>Cloud Save</h3>
            <p>Save your designs to the cloud and access them from anywhere at any time.</p>
          </div>
          <div className="about-feature-card">
            <div className="about-icon">📸</div>
            <h3>Image Export</h3>
            <p>Export your floor plans as high-quality PNG images with a single click.</p>
          </div>
        </section>

        <section className="about-mission">
          <h2>Our Mission</h2>
          <p>
            To democratize floor planning — making professional-grade design tools 
            available to everyone, for free. Whether you're sketching your first apartment 
            layout or architecting a multi-story building, Floor Planner has you covered.
          </p>
        </section>
      </div>
    </div>
  );
}
