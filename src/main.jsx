import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import PrinterIdInput from "./components/printer-id-input.jsx";
import App from "./App.jsx";
import { Route, Routes, BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PrinterIdInput />} />
          <Route path="/app" element={<App />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  </StrictMode>,
);
