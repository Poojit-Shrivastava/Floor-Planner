import { Link } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Floor Planner Pro</h1>
        <nav>
          <button className="nav-btn">Login</button>
          <button className="nav-btn primary">Sign Up</button>
        </nav>
      </header>

      <main className="home-main">
        <section className="hero-section">
          <h2>Design Your Dream Space</h2>
          <p>Create accurate floor plans with our intuitive drag-and-drop tool.</p>
          <Link to="/planner" className="cta-button">
            Go to Planner
          </Link>
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
