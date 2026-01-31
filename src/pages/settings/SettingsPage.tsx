import { useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import AdminLayout from "../../layout/AdminLayout";

/* ===== SETTINGS MODULES ===== */
import Settings from "../../components/settings/Settings";
import ManageUsers from "../../components/settings/User/ManageUsers";
import AddUser from "../../components/settings/User/AddUser";
import EditUser from "../../components/settings/User/UpdateUser";

import ManageRoles from "../../components/settings/Role/ManageRoles";
import AddRole from "../../components/settings/Role/AddRole";

import ManageDepartments from "../../components/settings/Departments/ManageDepartments";
import AddDepartment from "../../components/settings/Departments/AddDepartment";
import UpdateDepartment from "../../components/settings/Departments/UpdateDepartment";

/* ===== PROFILE ===== */
import Profile from "../../components/settings/Profile/Profile";

/* ===== UI ===== */
import AppBreadcrumb from "../../components/breadcrumb/AppBreadcrumb";

import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";
import SecurityIcon from "@mui/icons-material/Security";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";

import type { Department } from "../../types/Department";

/* ================= VIEW TYPES ================= */

type View =
  | "home"
  | "users"
  | "addUser"
  | "editUser"
  | "roles"
  | "addRole"
  | "departments"
  | "addDepartment"
  | "editDepartment"
  | "profile";

const SettingsPage = () => {
  const [view, setView] = useState<View>("home");

  const [selectedUserId, setSelectedUserId] =
    useState<string | null>(null);

  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);

  /* ================= BREADCRUMB ================= */

  const breadcrumbItems = (() => {
    switch (view) {
      case "home":
        return [
          {
            label: "Settings",
            icon: <SettingsIcon fontSize="small" />,
            active: true,
          },
        ];

      case "users":
        return [
          {
            label: "Settings",
            icon: <SettingsIcon fontSize="small" />,
            onClick: () => setView("home"),
          },
          {
            label: "Manage Users",
            icon: <PeopleIcon fontSize="small" />,
            active: true,
          },
        ];

      case "addUser":
        return [
          {
            label: "Settings",
            icon: <SettingsIcon fontSize="small" />,
            onClick: () => setView("home"),
          },
          {
            label: "Manage Users",
            icon: <PeopleIcon fontSize="small" />,
            onClick: () => setView("users"),
          },
          { label: "Add User", active: true },
        ];

      case "editUser":
        return [
          {
            label: "Settings",
            icon: <SettingsIcon fontSize="small" />,
            onClick: () => setView("home"),
          },
          {
            label: "Manage Users",
            icon: <PeopleIcon fontSize="small" />,
            onClick: () => setView("users"),
          },
          { label: "Edit User", active: true },
        ];

      case "roles":
        return [
          {
            label: "Settings",
            icon: <SettingsIcon fontSize="small" />,
            onClick: () => setView("home"),
          },
          {
            label: "Manage Roles",
            icon: <SecurityIcon fontSize="small" />,
            active: true,
          },
        ];

      case "addRole":
        return [
          {
            label: "Settings",
            icon: <SettingsIcon fontSize="small" />,
            onClick: () => setView("home"),
          },
          {
            label: "Manage Roles",
            icon: <SecurityIcon fontSize="small" />,
            onClick: () => setView("roles"),
          },
          { label: "Add Role", active: true },
        ];

      case "departments":
        return [
          {
            label: "Settings",
            icon: <SettingsIcon fontSize="small" />,
            onClick: () => setView("home"),
          },
          {
            label: "Departments",
            icon: <BusinessIcon fontSize="small" />,
            active: true,
          },
        ];

      case "addDepartment":
        return [
          {
            label: "Settings",
            icon: <SettingsIcon fontSize="small" />,
            onClick: () => setView("home"),
          },
          {
            label: "Departments",
            icon: <BusinessIcon fontSize="small" />,
            onClick: () => setView("departments"),
          },
          { label: "Add Department", active: true },
        ];

      case "editDepartment":
        return [
          {
            label: "Settings",
            icon: <SettingsIcon fontSize="small" />,
            onClick: () => setView("home"),
          },
          {
            label: "Departments",
            icon: <BusinessIcon fontSize="small" />,
            onClick: () => setView("departments"),
          },
          { label: "Edit Department", active: true },
        ];

      case "profile":
        return [
          {
            label: "Settings",
            icon: <SettingsIcon fontSize="small" />,
            onClick: () => setView("home"),
          },
          {
            label: "My Profile",
            icon: <PersonIcon fontSize="small" />,
            active: true,
          },
        ];

      default:
        return [];
    }
  })();

  /* ================= RENDER ================= */

  return (
    <>
      <Navbar />

      <AdminLayout>
        <div className="order-page">
          <h1 className="page-title">Settings</h1>

          <div className="orders-card">
            <AppBreadcrumb items={breadcrumbItems} />

            {view === "home" && (
              <Settings
                onSelect={(page) => {
                  if (page === "users") setView("users");
                  if (page === "roles") setView("roles");
                  if (page === "departments") setView("departments");
                  if (page === "profile") setView("profile");
                }}
              />
            )}

            {view === "users" && (
              <ManageUsers
                onAddUser={() => setView("addUser")}
                onEditUser={(id) => {
                  setSelectedUserId(id);
                  setView("editUser");
                }}
              />
            )}

            {view === "addUser" && (
              <AddUser onCancel={() => setView("users")} />
            )}

            {view === "editUser" && selectedUserId && (
              <EditUser
                userId={selectedUserId}
                onCancel={() => {
                  setSelectedUserId(null);
                  setView("users");
                }}
              />
            )}

            {view === "roles" && (
              <ManageRoles onAddRole={() => setView("addRole")} />
            )}

            {view === "addRole" && (
              <AddRole onCancel={() => setView("roles")} />
            )}

            {view === "departments" && (
              <ManageDepartments
                onAddDepartment={() => setView("addDepartment")}
                onEditDepartment={(department) => {
                  setSelectedDepartment(department as Department);
                  setView("editDepartment");
                }}
              />
            )}

            {view === "addDepartment" && (
              <AddDepartment onCancel={() => setView("departments")} />
            )}

            {view === "editDepartment" && selectedDepartment && (
              <UpdateDepartment
                department={selectedDepartment}
                onCancel={() => {
                  setSelectedDepartment(null);
                  setView("departments");
                }}
              />
            )}

            {view === "profile" && <Profile />}
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default SettingsPage;
