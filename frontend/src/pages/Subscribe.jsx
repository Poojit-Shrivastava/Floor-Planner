import Navbar from "../components/Navbar";
import "../styles/Subscribe.css";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: [
      "Up to 3 floor plans",
      "Basic furniture library",
      "PNG export",
      "Single floor per plan",
    ],
    cta: "Current Plan",
    active: true,
  },
  {
    name: "Premium",
    price: "$9",
    period: "/ month",
    features: [
      "Unlimited floor plans",
      "Full furniture library",
      "PNG + PDF export",
      "Multi-floor support",
      "Cloud sync & backup",
      "Priority support",
    ],
    cta: "Upgrade to Premium",
    active: false,
    highlighted: true,
  },
];

export default function Subscribe() {
  return (
    <div className="subscribe-page">
      <Navbar />
      <div className="subscribe-content">
        <h1>Choose Your Plan</h1>
        <p className="subscribe-subtitle">
          Unlock powerful features to take your floor plans to the next level.
        </p>

        <div className="subscribe-cards">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`subscribe-card ${plan.highlighted ? "subscribe-card-highlighted" : ""}`}
            >
              {plan.highlighted && <div className="subscribe-badge">Most Popular</div>}
              <h2>{plan.name}</h2>
              <div className="subscribe-price">
                <span className="subscribe-amount">{plan.price}</span>
                <span className="subscribe-period">{plan.period}</span>
              </div>
              <ul className="subscribe-features">
                {plan.features.map((f, i) => (
                  <li key={i}>✓ {f}</li>
                ))}
              </ul>
              <button
                className={`subscribe-cta ${plan.active ? "subscribe-cta-active" : ""}`}
                disabled={plan.active}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
