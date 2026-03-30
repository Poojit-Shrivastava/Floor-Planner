import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFloorPlans } from "../services/api";
import Navbar from "../components/Navbar";
import "../styles/SavedPlans.css";

export default function SavedPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    setError("");
    const result = await getFloorPlans();
    if (result.success) {
      setPlans(result.data);
    } else {
      setError(result.message || "Failed to fetch plans. Is the backend running?");
    }
    setLoading(false);
  };

  const loadPlan = (plan) => {
    // Navigate to planner and pass the plan data via location.state
    navigate("/planner", {
      state: {
        loadPlan: {
          cols: plan.layout?.cols || 20,
          rows: plan.layout?.rows || 16,
          walls: plan.layout?.walls || [],
          objects: plan.layout?.objects || [],
          name: plan.name,
          floorNumber: plan.floorNumber,
        },
      },
    });
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="saved-page">
      <Navbar />
      <div className="saved-content">
        <div className="saved-header">
          <h1>Saved Floor Plans</h1>
          <button className="saved-refresh-btn" onClick={fetchPlans}>
            ↻ Refresh
          </button>
        </div>

        {loading && <p className="saved-status">Loading plans...</p>}
        {error && <p className="saved-error">{error}</p>}

        {!loading && !error && plans.length === 0 && (
          <div className="saved-empty">
            <p>No saved plans yet.</p>
            <button onClick={() => navigate("/planner")} className="saved-cta">
              Create Your First Plan →
            </button>
          </div>
        )}

        {!loading && plans.length > 0 && (
          <div className="saved-grid">
            {plans.map((plan) => (
              <div key={plan._id} className="saved-card">
                <div className="saved-card-header">
                  <h3>{plan.name || "Untitled"}</h3>
                  <span className="saved-floor-badge">Floor {plan.floorNumber}</span>
                </div>
                <div className="saved-card-meta">
                  <span>
                    {plan.layout?.cols || "?"} × {plan.layout?.rows || "?"} grid
                  </span>
                  <span>{formatDate(plan.createdAt)}</span>
                </div>
                <div className="saved-card-stats">
                  <span>{plan.layout?.walls?.length || 0} walls</span>
                  <span>{plan.layout?.objects?.length || 0} objects</span>
                </div>
                <button className="saved-load-btn" onClick={() => loadPlan(plan)}>
                  Load into Planner
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
