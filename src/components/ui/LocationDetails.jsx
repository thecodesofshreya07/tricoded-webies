import React from "react";

const LocationDetails = ({ location }) => {
  if (!location) {
    return (
      <div className="p-4 border rounded-lg">
        <p className="text-gray-500">Select a location to see details</p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-semibold">{location.name}</h2>
      <p className="text-sm text-gray-600 mt-2">{location.description}</p>
    </div>
  );
};

export default LocationDetails;
