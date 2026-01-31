import "../../assets/css/settings.css";
import PeopleIcon from "@mui/icons-material/People";
import SecurityIcon from "@mui/icons-material/Security";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import HistoryIcon from "@mui/icons-material/History";

type Props = {
  onSelect: (
    page: "users" | "roles" | "departments" | "profile"
  ) => void;
};

const Settings = ({ onSelect }: Props) => {
  return (
    <div className="settings-container">
      {/* USER MANAGEMENT */}
      <div className="settings-section">
        <h3 className="settings-title">User Management</h3>

        <div className="settings-cards">
          {/* Manage Users */}
          <div
            className="settings-card vasara"
            onClick={() => onSelect("users")}
          >
            <PeopleIcon />
            <div>
              <p className="card-title">
                <b>Manage Users</b>
              </p>
              <span className="card-sub">
                Add, edit and control users
              </span>
            </div>
          </div>

          {/* Manage Roles */}
          <div
            className="settings-card vasara"
            onClick={() => onSelect("roles")}
          >
            <SecurityIcon />
            <div>
              <p className="card-title">
                <b>Manage Roles</b>
              </p>
              <span className="card-sub">
                Control access permissions
              </span>
            </div>
          </div>

          {/* Departments */}
          <div
            className="settings-card vasara"
            onClick={() => onSelect("departments")}
          >
            <BusinessIcon />
            <div>
              <p className="card-title">
                <b>Department</b>
              </p>
              <span className="card-sub">
                Create and manage departments
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MY ACCOUNT */}
      <div className="settings-section">
        <h3 className="settings-title">
          <b>My Account</b>
        </h3>

        <div className="settings-cards">
          {/* Profile */}
          <div
            className="settings-card light"
            onClick={() => onSelect("profile")}
          >
            <PersonIcon />
            <div>
              <p className="card-title">
                <b>Profile</b>
              </p>
              <span className="card-sub">
                Manage personal details
              </span>
            </div>
          </div>

          {/* Security */}
          <div className="settings-card light">
            <SecurityIcon />
            <div>
              <p className="card-title">
                <b>Security</b>
              </p>
              <span className="card-sub">
                Password & authentication
              </span>
            </div>
          </div>

          {/* Activity Log */}
          <div className="settings-card light">
            <HistoryIcon />
            <div>
              <p className="card-title">
                <b>Activity Log</b>
              </p>
              <span className="card-sub">
                Track recent actions
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
