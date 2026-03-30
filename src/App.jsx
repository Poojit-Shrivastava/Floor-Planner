import { useState, useEffect } from "react";
import Canvas from "./components/Canvas";
import Sidebar from "./components/Sidebar";
import Layout from "./components/Layout";
import FurnitureDialog from "./components/FurnitureDialog";
import {
  CELL_SIZE,
  SCALE,
  DOOR_WIDTH,
  FURNITURE_PRESETS
} from "./constants";

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

export default function App() {

  /* GRID */
  const [cols, setCols] = useState(20);
  const [rows, setRows] = useState(16);

  /* WALLS & OBJECTS */
  const [walls, setWalls] = useState([]);
  const [objects, setObjects] = useState([]);
  const [selected, setSelected] = useState(null);

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
    if (tool === "furniture") {
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

  function savePlan() {
    const blob = new Blob(
      [JSON.stringify({ cols, rows, walls, objects }, null, 2)],
      { type: "application/json" }
    );

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "floor-plan.json";
    a.click();
  }

  return (
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
          isValid={isValid}
          savePlan={savePlan}
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
  );
}
