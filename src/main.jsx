import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Printer1 from "./components/printer-1.jsx";
import Printer2 from "./components/printer-2.jsx";
import Printer3 from "./components/printer-3.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/printer-1" element={<Printer1 />} />

          <Route path="/printer-2" element={<Printer2 />} />

          <Route path="/printer-3" element={<Printer3 />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  </StrictMode>,
);
