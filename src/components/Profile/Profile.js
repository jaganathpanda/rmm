import React, { useState} from "react";
import { getUserInfo, setUserInfo } from "../../utils/userSession";
import "./Profile.css";

const Profile = () => {
  const initialUser = getUserInfo();

  const [firstName, setFirstName] = useState(initialUser[2] || "");
  const [lastName, setLastName] = useState(initialUser[3] || "");
  const [company, setCompany] = useState(initialUser[4] || "");
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    const updatedUser = {
      ...initialUser,
      firstName,
      lastName,
      company,
    };
    setUserInfo(updatedUser);
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <h2>Profile</h2>

      <div className="profile-details">
        {isEditing ? (
          <>
            <label>
              First Name:
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </label>
            <label>
              Last Name:
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </label>
            <label>
              Company:
              <input value={company} onChange={(e) => setCompany(e.target.value)} />
            </label>
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {firstName} {lastName}</p>
            <p><strong>Email:</strong> {initialUser[5]}</p>
            <p><strong>Phone:</strong> {initialUser[6]}</p>
            <p><strong>Company:</strong> {company}</p>
            <p><strong>Username:</strong> {initialUser[1]}</p>
            <p><strong>Customer ID:</strong> {initialUser[0]}</p>
            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
