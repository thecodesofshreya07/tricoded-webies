import React from "react";

const Building = ({ name, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer p-2 bg-blue-200 rounded hover:bg-blue-400 transition"
    >
      {name}
    </div>
  );
};

export default Building;
