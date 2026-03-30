import "../styles/Sidebar.css";

/* TOOL ICONS */
const ICONS = {
  wall: <svg viewBox="0 0 24 24"><rect x="3" y="10" width="18" height="4"/></svg>,
  furniture: <svg viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="8"/></svg>,
  door: <svg viewBox="0 0 24 24"><path d="M4 4h6v16"/></svg>,
  erase: <svg viewBox="0 0 24 24"><line x1="3" y1="21" x2="21" y2="3"/></svg>,
  stairs: (
  <svg viewBox="0 0 24 24">
    <path d="M4 20h4v-4h4v-4h4v-4h4" stroke="currentColor" fill="none"/>
  </svg>
),

};

export default function Sidebar({
  cols,
  rows,
  setCols,
  setRows,
  tool,
  setTool,
  activeFurniture,
  setActiveFurniture,
  doorFacing,
  setDoorFacing,
  savePlan
}) {

  return (
    <div className="sidebar">

      {/* TITLE */}
      <div className="sidebar-section">
        <h2 className="sidebar-title">Floor Planner</h2>
      </div>

      {/* GRID SETTINGS */}
      <div className="sidebar-section">
        <h3>Grid Settings</h3>

        <label>
          Columns:
          <input
            type="number"
            min="5"
            max="100"
            value={cols}
            onChange={(e) => setCols(Number(e.target.value))}
          />
        </label>

        <label>
          Rows:
          <input
            type="number"
            min="5"
            max="100"
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
          />
        </label>

        <p style={{ fontSize: "12px", marginTop: "8px" }}>
          Floor Size: {cols * 0.5}m × {rows * 0.5}m
        </p>
      </div>

      {/* TOOLS */}
      <div className="sidebar-section">
        <h3>Tools</h3>
        <div className="tool-grid">
          {["wall", "furniture","stairs", "door", "erase"].map(t => (
            <button
              key={t}
              className={`tool-btn ${tool === t ? "active" : ""}`}
              onClick={() => setTool(t)}
            >
              <span className="tool-icon">{ICONS[t]}</span>
              <span>{t}</span>
            </button>
          ))}
        </div>
      </div>

      {/* DOOR SETTINGS */}
      {tool === "door" && (
        <div className="sidebar-section">
          <h3>Door Facing</h3>
          <select
            value={doorFacing}
            onChange={(e) => setDoorFacing(e.target.value)}
          >
            <option value="up">Up</option>
            <option value="down">Down</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </div>
      )}

      {/* SAVE BUTTON */}
      <div className="sidebar-section">
        <button onClick={savePlan}>Save Plan</button>
      </div>

    </div>
  );
}
