import React from "react";
import ReactDOM from "react-dom/client";
import FORGEAPC from "./FORGEAPC.jsx";
import "./index.css";

// Catches any crash during render so we see the error on screen instead of a
// blank white page.
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null, info: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { this.setState({ info }); console.error("App crashed:", error, info); }
  render() {
    if (this.state.error) {
      const msg = (this.state.error && (this.state.error.stack || this.state.error.message)) || String(this.state.error);
      const where = (this.state.info && this.state.info.componentStack) || "";
      return (
        <div style={{ minHeight: "100vh", background: "#070a0f", color: "#e8eef5", fontFamily: "monospace", padding: "24px", boxSizing: "border-box" }}>
          <h2 style={{ color: "#ff5c72", fontFamily: "system-ui, sans-serif" }}>Something crashed — here's the error:</h2>
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", background: "#0d131c", border: "1px solid #243042", borderRadius: "10px", padding: "16px", fontSize: "13px", lineHeight: 1.5 }}>{msg}</pre>
          {where && <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", color: "#9fb0c3", fontSize: "12px", marginTop: "12px" }}>{where}</pre>}
          <button onClick={() => { try { window.location.href = "/"; } catch (e) {} }} style={{ marginTop: "16px", padding: "10px 18px", borderRadius: "10px", border: "none", background: "#19e8db", color: "#04110f", fontWeight: 600, cursor: "pointer" }}>Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <FORGEAPC />
  </ErrorBoundary>
);
