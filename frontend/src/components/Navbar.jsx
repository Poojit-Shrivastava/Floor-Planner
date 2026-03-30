import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Floor Planner</Link>

      <div className="navbar-links">
        <Link to="/" className="navbar-link">Home</Link>
        <Link to="/about" className="navbar-link">About</Link>
        {isAuthenticated && (
          <>
            <Link to="/saved" className="navbar-link">Saved Plans</Link>
            <Link to="/subscribe" className="navbar-link">Subscribe</Link>
          </>
        )}
        <Link to="/planner" className="navbar-link navbar-link-primary">Planner</Link>
      </div>

      <div className="navbar-auth">
        {isAuthenticated ? (
          <>
            <span className="navbar-user">Hi, {user.name}</span>
            <button className="navbar-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-btn">Login</Link>
            <Link to="/signup" className="navbar-btn navbar-btn-primary">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
