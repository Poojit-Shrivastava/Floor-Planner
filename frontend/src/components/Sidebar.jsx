import html2canvas from "html2canvas";
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
  setObjects,
  setWalls,
  activeFurniture,
  setActiveFurniture,
  doorFacing,
  setDoorFacing,
  savePlan
}) {

  const handleExportImage = async () => {
    const canvasEl = document.querySelector(".canvas-wrapper");
    if (!canvasEl) return;
    
    try {
      const canvas = await html2canvas(canvasEl, { backgroundColor: null });
      const imgData = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = imgData;
      a.download = "floor-plan.png";
      a.click();
    } catch (err) {
      console.error("Export Image failed", err);
    }
  };

  const loadPreset = (c, r) => {
    setCols(c);
    setRows(r);
    // Basic base wall boundary layout could be generated here, but for now we just change grid size
    if (setWalls) setWalls([]);
    if (setObjects) setObjects([]);
  };

  return (
    <div className="sidebar">

      {/* TITLE */}
      <div className="sidebar-section">
        <h2 className="sidebar-title">Floor Planner</h2>
      </div>

      {/* PRESETS */}
      <div className="sidebar-section">
        <h3>Presets</h3>
        <div style={{ display: "flex", gap: "10px" }}>
          <button style={{ flex: 1 }} onClick={() => loadPreset(25, 50)}>25x50</button>
          <button style={{ flex: 1 }} onClick={() => loadPreset(40, 50)}>40x50</button>
        </div>
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

      {/* TOOLS REORGANIZED */}
      <div className="sidebar-section">
        <h3>Structure</h3>
        <div className="tool-grid">
          {["wall", "door", "stairs"].map(t => (
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
        
        <h3 style={{ marginTop: '15px' }}>Furniture</h3>
        <div className="tool-grid">
          {["furniture"].map(t => (
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

        <h3 style={{ marginTop: '15px' }}>Tools</h3>
        <div className="tool-grid">
          {["erase"].map(t => (
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

      {/* SAVE BUTTONS */}
      <div className="sidebar-section" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button onClick={savePlan}>Download JSON</button>
        <button onClick={handleExportImage} style={{ backgroundColor: '#17a2b8', color: '#fff' }}>Export Image (PNG)</button>
      </div>

    </div>
  );
}
