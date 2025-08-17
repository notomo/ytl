import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { PlayerRoute } from "./player";
import "./index.css";

const container = document.getElementById("root");
if (!container) {
  throw new Error("bug: not found root element");
}
createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<PlayerRoute />} />
      </Routes>
    </BrowserRouter>
  );
}
