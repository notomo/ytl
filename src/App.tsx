import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PlayerRoute } from "./Player";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<PlayerRoute />} />
      </Routes>
    </BrowserRouter>
  );
}
