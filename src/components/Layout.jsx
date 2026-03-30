import "../styles/Layout.css";

export default function Layout({ sidebar, canvas, children }) {
  return (
    <div className="app-layout">
      {/* SIDEBAR */}
      <aside className="app-sidebar">
        {sidebar}
      </aside>

      {/* CANVAS */}
      <main className="app-canvas">
        {canvas}
      </main>

      {/* OVERLAYS / DIALOGS */}
      {children}
    </div>
  );
}
