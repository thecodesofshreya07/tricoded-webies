import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import EntryPage from "./pages/EntryPage";
import LandingPage from "./pages/LandingPage";
import IITBombayPage from "./pages/IITBombayPage";
import CampusMapPage from "./pages/CampusMapPage";
import NavigationPage from "./pages/NavigationPage";
import CampusServicesPage from "./pages/CampusServicesPage";
import DiningPage from "./pages/Dining"; // ✅ Added

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EntryPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/iit-bombay" element={<IITBombayPage />} />
        <Route path="/campus-map" element={<CampusMapPage />} />
        <Route path="/navigation" element={<NavigationPage />} />
        <Route path="/campus-services" element={<CampusServicesPage />} />
        <Route path="/dining" element={<DiningPage />} /> {/* ✅ Added */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}