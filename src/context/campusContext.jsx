import React, { createContext, useState } from "react";

export const CampusContext = createContext();

export const CampusProvider = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  return (
    <CampusContext.Provider
      value={{ selectedLocation, setSelectedLocation }}
    >
      {children}
    </CampusContext.Provider>
  );
};
