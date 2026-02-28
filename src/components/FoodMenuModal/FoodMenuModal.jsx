import React from "react";
import "./FoodMenuModal.css";

export default function FoodMenuModal({ isOpen, onClose, data }) {
  if (!isOpen || !data) return null;

  return (
    <div className="food-modal-overlay" onClick={onClose}>
      <div
        className="food-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <h2>{data.title}</h2>
        <p className="subtitle">{data.subtitle}</p>

        {data.categories.map((category, index) => (
          <div key={index} className="menu-section">
            <h3 className="menu-category">{category.name}</h3>

            {category.items.map((item, i) => (
              <div key={i} className="menu-item">
                <div>
                  <div className="item-name">{item.name}</div>
                  <div className="item-description">{item.desc}</div>
                </div>
                <div className="item-price">{item.price}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}