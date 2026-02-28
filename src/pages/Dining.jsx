import React, { useState } from "react";
import { foodMenus } from "../data/foodMenu";
import FoodMenuModal from "../components/FoodMenuModal/FoodMenuModal";

export default function DiningPage() {
  const [selectedMenu, setSelectedMenu] = useState(null);

  const openMenu = (key) => {
    setSelectedMenu(foodMenus[key]);
  };

  const closeMenu = () => {
    setSelectedMenu(null);
  };

  return (
    <div className="dining-page">
      <h1>Dining Options</h1>

      <div className="canteen-grid">
        <div onClick={() => openMenu("canteen1")}>Main Canteen</div>
        <div onClick={() => openMenu("himalaya")}>Himalaya</div>
        <div onClick={() => openMenu("nightcanteen")}>Night Canteen</div>
        <div onClick={() => openMenu("foodcourt")}>SAC Food Court</div>
      </div>

      <FoodMenuModal
        isOpen={!!selectedMenu}
        onClose={closeMenu}
        data={selectedMenu}
      />
    </div>
  );
}