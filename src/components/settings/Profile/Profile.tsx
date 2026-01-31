import { useEffect, useState } from "react";
import "../../../assets/css/Profile.css";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EditIcon from "@mui/icons-material/Edit";

import { fetchMyProfileApi } from "../../../api/profile.api";
import type { User } from "../../../types/User";

/* ================= COMPONENT ================= */

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  /* ================= FETCH PROFILE ================= */

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await fetchMyProfileApi();
      setUser(data);
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  if (loading) {
    return (
      <div className="profile-container">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-container">
        <p>Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* HEADER */}
      <div className="profile-header">
        <div className="profile-avatar">
          <PersonIcon />
        </div>

        <div className="profile-header-info">
          <h2>My Profile</h2>
          <p>Manage your personal information</p>
        </div>

        <button className="profile-edit-btn">
          <EditIcon fontSize="small" />
          Edit Profile
        </button>
      </div>

      {/* DETAILS CARD */}
      <div className="profile-card">
        <div className="profile-row">
          <BadgeIcon />
          <div>
            <label>Full Name</label>
            <p>
              {user.firstName} {user.lastName}
            </p>
          </div>
        </div>

        <div className="profile-row">
          <EmailIcon />
          <div>
            <label>Email Address</label>
            <p>{user.email}</p>
          </div>
        </div>

        <div className="profile-row">
          <PhoneIcon />
          <div>
            <label>Contact Number</label>
            <p>{user.contactNumber ?? "-"}</p>
          </div>
        </div>

        <div className="profile-row">
          <BadgeIcon />
          <div>
            <label>Role</label>
            <p>{user.roleName ?? "-"}</p>
          </div>
        </div>

        <div className="profile-row">
          <LocationOnIcon />
          <div>
            <label>Location</label>
            <p>{user.location ?? "-"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
