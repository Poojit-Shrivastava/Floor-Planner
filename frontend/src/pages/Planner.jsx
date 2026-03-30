import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { saveFloorPlan } from "../services/api";
import Canvas from "../components/Canvas";
import Sidebar from "../components/Sidebar";
import Layout from "../components/Layout";
import FurnitureDialog from "../components/FurnitureDialog";
import {
  CELL_SIZE,
  SCALE,
  DOOR_WIDTH,
  FURNITURE_PRESETS
} from "../constants";

/* ========================= GEOMETRY ========================= */
function boxesOverlap(a, b) {
  return !(
    a.right <= b.left ||
    a.left >= b.right ||
    a.bottom <= b.top ||
    a.top >= b.bottom
  );
}

function getBounds(o) {
  if (o.kind === "furniture") {
    return {
      left: o.col,
      right: o.col + o.w / CELL_SIZE,
      top: o.row,
      bottom: o.row + o.d / CELL_SIZE
    };
  }

  if (o.kind === "door") {
    const s = o.width / CELL_SIZE;
    return {
      left: o.col,
      right: o.col + s,
      top: o.row,
      bottom: o.row + 1
    };
  }
}

export default function Planner() {
  /* MULTI-FLOOR STATE */
  const [numFloors, setNumFloors] = useState(1);
  const [currentFloor, setCurrentFloor] = useState(1);
  // Store layout configurations per floor: array of objects { floor: 1, cols: 20, rows: 16, walls: [], objects: [] }
  const [floorsData, setFloorsData] = useState([
    { floor: 1, cols: 20, rows: 16, walls: [], objects: [] }
  ]);

  /* CURRENT FLOOR OVERRIDES - initialized from current active floor */
  const activeData = floorsData.find(f => f.floor === currentFloor) || floorsData[0];
  const [cols, setCols] = useState(activeData.cols);
  const [rows, setRows] = useState(activeData.rows);
  const [walls, setWalls] = useState(activeData.walls);
  const [objects, setObjects] = useState(activeData.objects);
  const [selected, setSelected] = useState(null);

  /* THEME SYSTEM */
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark-theme" : "light-theme";
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Sync state back to floorsData when changing floors
  useEffect(() => {
    handleSaveCurrentFloorLocal();
    const targetData = floorsData.find(f => f.floor === currentFloor);
    if (targetData) {
      setCols(targetData.cols);
      setRows(targetData.rows);
      setWalls(targetData.walls);
      setObjects(targetData.objects);
    }
  }, [currentFloor]);

  // Automatically update the local floorsData when making edits
  useEffect(() => {
    setFloorsData(prev => prev.map(f => 
       f.floor === currentFloor 
         ? { ...f, cols, rows, walls, objects }
         : f
    ));
  }, [cols, rows, walls, objects]);


  /* ACCEPT PRESETS / LOADED PLANS FROM NAVIGATION */
  const location = useLocation();
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    const state = location.state;
    if (!state) return;

    if (state.preset) {
      setCols(state.preset.cols);
      setRows(state.preset.rows);
      setWalls([]);
      setObjects([]);
      hasLoadedRef.current = true;
    }

    if (state.loadPlan) {
      const lp = state.loadPlan;
      setCols(lp.cols || 20);
      setRows(lp.rows || 16);
      setWalls(lp.walls || []);
      setObjects(lp.objects || []);
      if (lp.floorNumber) setCurrentFloor(lp.floorNumber);
      hasLoadedRef.current = true;
    }
  }, [location.state]);

  const handleSaveCurrentFloorLocal = () => {
    setFloorsData(prev => prev.map(f => 
       f.floor === currentFloor ? { ...f, cols, rows, walls, objects } : f
    ));
  };

  const handleAddFloor = () => {
    const nextFloor = floorsData.length + 1;
    setFloorsData(prev => [...prev, {
      floor: nextFloor,
      cols: 20,
      rows: 16,
      walls: [],
      objects: []
    }]);
    setNumFloors(nextFloor);
    setCurrentFloor(nextFloor);
  };

  const savePlanToDB = async () => {
    const result = await saveFloorPlan({
      floorNumber: currentFloor,
      layout: { cols, rows, walls, objects },
      name: `Floor ${currentFloor} Plan`
    });
    if (result.success) {
      alert(`Floor ${currentFloor} saved successfully!`);
    } else {
      alert(`Error saving: ${result.message}`);
    }
  };

  const savePlanAsJSON = () => {
    const blob = new Blob(
      [JSON.stringify({ cols, rows, walls, objects }, null, 2)],
      { type: "application/json" }
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "floor-plan.json";
    a.click();
  };


  /* TOOLS */
  const [tool, setTool] = useState("wall");
  const [activeFurniture, setActiveFurniture] = useState(null);
  const [doorFacing, setDoorFacing] = useState("up");

  /* UI */
  const [showFurnitureDialog, setShowFurnitureDialog] = useState(false);

  /* INTERACTION STATES */
  const [drawingWall, setDrawingWall] = useState(false);
  const [draggingObject, setDraggingObject] = useState(false);
  const [wallThickness] = useState(0.1);

  useEffect(() => {
    if (tool === "furniture" || tool === "stairs") {
      setShowFurnitureDialog(true);
    }
  }, [tool]);

  function hitsWall(bounds) {
    return walls.some(cell => {
      const [r, c] = cell.split("-").map(Number);
      return boxesOverlap(bounds, {
        left: c,
        right: c + 1,
        top: r,
        bottom: r + 1
      });
    });
  }

  function isValid(obj) {
    const b = getBounds(obj);
    if (hitsWall(b)) return false;

    return !objects.some(
      o => o.id !== obj.id && boxesOverlap(b, getBounds(o))
    );
  }

  function applyGrid(row, col) {
    const key = `${row}-${col}`;

    if (tool === "wall") {
      if (!walls.includes(key)) {
        setWalls(p => [...p, key]);
      }
      return;
    }

    if (tool === "erase") {
      setWalls(p => p.filter(x => x !== key));
      setObjects(p =>
        p.filter(o => !(o.row === row && o.col === col))
      );
      return;
    }

    if ((tool === "furniture"||tool === "stairs" )&& activeFurniture) {
      const f = FURNITURE_PRESETS[activeFurniture];
      if (!f) return;

      const obj = {
        id: Date.now(),
        kind: "furniture",
        furnitureKey: activeFurniture,
        shape: f.shape,
        row,
        col,
        w: f.w,
        d: f.d
      };

      if (isValid(obj)) {
        setObjects(p => [...p, obj]);
      }
      return;
    }

    if (tool === "door") {
      const door = {
        id: Date.now(),
        kind: "door",
        row,
        col,
        width: DOOR_WIDTH,
        facing: doorFacing
      };

      if (isValid(door)) {
        setObjects(p => [...p, door]);
      }
    }
  }

  function moveSelected(row, col) {
    if (!selected) return;

    const moved = { ...selected, row, col };
    if (!isValid(moved)) return;

    setObjects(p =>
      p.map(o => (o.id === moved.id ? moved : o))
    );

    setSelected(moved);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ padding: '10px 20px', backgroundColor: 'var(--sidebar-bg, #f4f4f4)', borderBottom: '1px solid var(--border-color, #ccc)', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <strong>Floors:</strong>
        {floorsData.map(f => (
           <button 
             key={f.floor} 
             onClick={() => setCurrentFloor(f.floor)}
             style={{ fontWeight: currentFloor === f.floor ? 'bold' : 'normal', border: '1px solid currentColor', padding: '4px 8px', background: currentFloor === f.floor ? 'var(--text-color, #000)' : 'transparent', color: currentFloor === f.floor ? 'var(--bg-color, #fff)' : 'currentColor' }}
           >
             Floor {f.floor}
           </button>
        ))}
        <button onClick={handleAddFloor} style={{ marginLeft: '10px' }}>+ Add Floor</button>
        <div style={{ flex: 1 }}></div>
        <button onClick={() => setTheme(p => p === "light" ? "dark" : "light")}>
          Toggle Theme ({theme})
        </button>
        <button onClick={savePlanToDB} style={{ backgroundColor: '#28a745', color: 'white', padding: '6px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save to DB</button>
      </div>

      <Layout
        sidebar={
          <Sidebar
            cols={cols}
            rows={rows}
            setCols={setCols}
            setRows={setRows}
            tool={tool}
            setTool={setTool}
            activeFurniture={activeFurniture}
            setActiveFurniture={setActiveFurniture}
            doorFacing={doorFacing}
            setDoorFacing={setDoorFacing}
            selected={selected}
            setSelected={setSelected}
            objects={objects}
            setObjects={setObjects}
            setWalls={setWalls}
            isValid={isValid}
            savePlan={savePlanAsJSON}
          />
        }
        canvas={
          <Canvas
            cols={cols}
            rows={rows}
            walls={walls}
            setWalls={setWalls}
            objects={objects}
            selected={selected}
            setSelected={setSelected}
            tool={tool}
            activeFurniture={activeFurniture}
            drawingWall={drawingWall}
            setDrawingWall={setDrawingWall}
            draggingObject={draggingObject}
            setDraggingObject={setDraggingObject}
            applyGrid={applyGrid}
            moveSelected={moveSelected}
            wallThickness={wallThickness}
          />
        }
      >
        {showFurnitureDialog && (
          <FurnitureDialog
            onClose={() => setShowFurnitureDialog(false)}
            setActiveFurniture={setActiveFurniture}
            setTool={setTool}
          />
        )}
      </Layout>
    </div>
  );
}
