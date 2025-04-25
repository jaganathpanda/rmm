import React, { useState } from "react";
import PPCSetting from "./PPCSetting";
import "./Settings.css";

const Settings = () => {
  const [selectedSetting, setSelectedSetting] = useState("PPCSetting");

  const renderSettingComponent = () => {
    switch (selectedSetting) {
      case "PPCSetting":
        return <PPCSetting />;
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
          {/* Add more settings in the future */}
        </ul>
      </div>
      <div className="settings-content">
        {renderSettingComponent()}
      </div>
    </div>
  );
};

export default Settings;
