import { useNavigate, useLocation } from "react-router-dom";
import "../../assets/css/Sidebar.css";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";

import { logoutApi } from "../../api/auth.api";

/* ================= PROPS ================= */

type Props = {
  expanded: boolean;
  setExpanded: (v: boolean) => void;
};

/* ================= COMPONENT ================= */

const Sidebar = ({ expanded, setExpanded }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  /* ================= ACTIVE ROUTE ================= */
  const isActive = (path: string): boolean =>
    location.pathname === path ||
    location.pathname.startsWith(path + "/");

  /* ================= LOGOUT ================= */

  const handleLogout = async (): Promise<void> => {
    try {
      await logoutApi();
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userEmail");
      navigate("/", { replace: true });
    }
  };

  /* ================= UI ================= */

  return (
    <aside className={`sidebar ${expanded ? "expanded" : ""}`}>
      {/* MENU TOGGLE */}
      <div
        className="sidebar-toggle"
        onClick={() => setExpanded(!expanded)}
      >
        <MenuIcon />
      </div>

      {/* MENU */}
      <div className="sidebar-menu">
        <div
          className={`menu-item ${
            isActive("/dashboard") ? "active" : ""
          }`}
          onClick={() => navigate("/dashboard")}
        >
          <DashboardIcon />
          {expanded && <span>Dashboard</span>}
        </div>

        <div
          className={`menu-item ${
            isActive("/orders") ? "active" : ""
          }`}
          onClick={() => navigate("/orders")}
        >
          <ReceiptLongOutlinedIcon />
          {expanded && <span>Orders</span>}
        </div>

        <div
          className={`menu-item ${
            isActive("/products") ? "active" : ""
          }`}
          onClick={() => navigate("/products")}
        >
          <Inventory2Icon />
          {expanded && <span>Products</span>}
        </div>

        <div
          className={`menu-item ${
            isActive("/settings") ? "active" : ""
          }`}
          onClick={() => navigate("/settings")}
        >
          <SettingsIcon />
          {expanded && <span>Settings</span>}
        </div>
      </div>

      {/* LOGOUT */}
      <div className="menu-item logout" onClick={handleLogout}>
        <LogoutIcon />
        {expanded && <span>Logout</span>}
      </div>
    </aside>
  );
};

export default Sidebar;
