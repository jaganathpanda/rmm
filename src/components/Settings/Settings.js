import React, { useState } from "react";
import PPCSetting from "./PPCSetting";
import Category from "./Category";
import BagConfiguration from "./BagConfiguration";
import Warehouse from "./Warehouse";
import "./Settings.css";

const Settings = () => {
  const [selectedSetting, setSelectedSetting] = useState("PPCSetting");

  const renderSettingComponent = () => {
    switch (selectedSetting) {
      case "PPCSetting":
        return <PPCSetting />;
      case "Category":
        return <Category />;
      case "BagConfiguration":
        return <BagConfiguration />;
      case "Warehouse":
        return <Warehouse />;
      default:
        return <div>Select a setting from the menu</div>;
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-sidebar">
        <ul>
          <li
            className={selectedSetting === "PPCSetting" ? "active" : ""}
            onClick={() => setSelectedSetting("PPCSetting")}
          >
            PPC Setting
          </li>
          <li
            className={selectedSetting === "Category" ? "active" : ""}
            onClick={() => setSelectedSetting("Category")}
          >
            Category
          </li>
          <li
            className={selectedSetting === "BagConfiguration" ? "active" : ""}
            onClick={() => setSelectedSetting("BagConfiguration")}
          >
            Bag Configuration
          </li>

          <li
            className={selectedSetting === "Warehouse" ? "active" : ""}
            onClick={() => setSelectedSetting("Warehouse")}
          >
            Warehouse
          </li>
        </ul>
      </div>
      <div className="settings-content">{renderSettingComponent()}</div>
    </div>
  );
};

export default Settings;
