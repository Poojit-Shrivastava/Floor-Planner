import { CELL_SIZE, SCALE } from "../constants";
import "../styles/Canvas.css";

export default function Canvas({
  cols,
  rows,
  walls,
  objects,
  selected,
  setSelected,
  tool,
  activeFurniture,
  drawingWall,
  setDrawingWall,
  draggingObject,
  setDraggingObject,
  applyGrid,
  moveSelected,
  wallThickness
}) {
  return (
    <div
      className="canvas-wrapper"
      onMouseUp={() => {
        setDrawingWall(false);
        setDraggingObject(false);
      }}
    >
      <div className="canvas-center">
        <div
          className="canvas-grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, ${CELL_SIZE * SCALE}px)`,
            gridTemplateRows: `repeat(${rows}, ${CELL_SIZE * SCALE}px)`
          }}
        >
          {Array.from({ length: rows * cols }).map((_, i) => {
            const r = Math.floor(i / cols);
            const c = i % cols;
            const isWall = walls.includes(`${r}-${c}`);

            return (
              <div
                key={i}
                className={`grid-cell ${isWall ? "wall-cell" : ""}`}
                onMouseDown={() => {
                  if (tool === "wall") {
                    setDrawingWall(true);
                    applyGrid(r, c);
                  }
                }}
                onMouseEnter={() => {
                  if (drawingWall && tool === "wall")
                    applyGrid(r, c);

                  if (draggingObject && selected)
                    moveSelected(r, c);
                }}
                onClick={() => applyGrid(r, c)}
              />
            );
          })}

          {objects.map(o => {
            if (o.kind === "furniture") {
              return (
                <div
                  key={o.id}
                  className={`object furniture ${selected?.id === o.id ? "selected" : ""}`}
                  onMouseDown={e => {
                    e.stopPropagation();
                    setSelected(o);
                    setDraggingObject(true);
                  }}
                  style={{
                    left: o.col * CELL_SIZE * SCALE,
                    top: o.row * CELL_SIZE * SCALE,
                    width: o.w * SCALE,
                    height: o.d * SCALE
                  }}
                />
              );
            }

            if (o.kind === "door") {
              const px = o.width * SCALE;
              const t = wallThickness * SCALE;

              const map = {
                up: { w: px, h: t },
                down: { w: px, h: t },
                left: { w: t, h: px },
                right: { w: t, h: px }
              };

              const s = map[o.facing];

              return (
                <div
                  key={o.id}
                  className="object door"
                  style={{
                    left: o.col * CELL_SIZE * SCALE,
                    top: o.row * CELL_SIZE * SCALE,
                    width: s.w,
                    height: s.h
                  }}
                />
              );
            }

            return null;
          })}
        </div>
      </div>
    </div>
  );
}
