import React from "react";
import CampusMap from "./components/map/CampusMap";
import SearchBar from "./components/search/SearchBar";
import FilterPanel from "./components/search/FilterPanel";
import LocationDetails from "./components/ui/LocationDetails";

function App() {
  return (
    <div className="min-h-screen p-6 space-y-6">
      <SearchBar />
      <FilterPanel />
      <CampusMap />
      <LocationDetails />
    </div>
  );
}

export default App;
