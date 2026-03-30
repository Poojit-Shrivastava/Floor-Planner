import { useState } from "react";
import { FURNITURE_PRESETS } from "../constants";
import "../styles/FurnitureDialog.css";

/* UNIQUE GROUP LIST */
const GROUPS = [...new Set(
  Object.values(FURNITURE_PRESETS).map(f => f.group)
)];

export default function FurnitureDialog({
  onClose,
  setActiveFurniture,
  setTool
}) {
  const [group, setGroup] = useState(null);

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="dialog" onClick={e => e.stopPropagation()}>
        <h3>Select Furniture</h3>

        {/* GROUP SELECTION */}
        {!group && (
          <div className="dialog-grid">
            {GROUPS.map(g => (
              <button
                key={g}
                className="dialog-btn"
                onClick={() => setGroup(g)}
              >
                {g}
              </button>
            ))}
          </div>
        )}

        {/* ITEM SELECTION */}
        {group && (
          <>
            <button
              className="back-btn"
              onClick={() => setGroup(null)}
            >
              ← Back
            </button>

            <div className="dialog-grid">
              {Object.entries(FURNITURE_PRESETS)
                .filter(([, f]) => f.group === group)
                .map(([key, f]) => (
                  <button
                    key={key}
                    className="dialog-btn"
                    onClick={() => {
                      setActiveFurniture(key);
                      setTool("furniture");
                      onClose();
                    }}
                  >
                    {f.label}
                  </button>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
