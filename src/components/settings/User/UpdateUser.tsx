import { useEffect, useState } from "react";
import "../../../assets/css/settings.css";
import { toast } from "react-toastify";

import {
  fetchUserByIdApi,
  fetchRolesApi,
  fetchDepartmentsApi,
  updateUserApi,
} from "../../../api/profile.api";

import ConfirmDialog from "../../DialogBox/ConfirmDialog";

/* ================= TYPES ================= */

type Props = {
  userId: string;
  onCancel: () => void;
};

type Role = { id: string; name: string };
type Department = { id: string; name: string };

type UserForm = {
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  location: string;
  roleId: string;
  departmentId: string;
};

/* ================= COMPONENT ================= */

const UpdateUser = ({ userId, onCancel }: Props) => {
  const [form, setForm] = useState<UserForm>({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    location: "",
    roleId: "",
    departmentId: "",
  });

  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showDeptDialog, setShowDeptDialog] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [tempRoleId, setTempRoleId] = useState("");
  const [tempDeptId, setTempDeptId] = useState("");

  /* ================= LOAD USER ================= */

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadUser = async () => {
    try {
      setInitialLoading(true);

      const res = await fetchUserByIdApi(userId);
      const user = res?.data ?? res;

      if (!user) {
        toast.error("User not found");
        onCancel();
        return;
      }

      setForm({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        email: user.email ?? "",
        contactNumber: user.contactNumber ?? "",
        location: user.location ?? "",

        
        roleId: user.roles?.[0]?.id ?? "",
        departmentId: user.department?.id ?? "",
      });
    } catch {
      toast.error("Failed to load user details");
    } finally {
      setInitialLoading(false);
    }
  };

  /* ================= LOAD ROLES & DEPARTMENTS ================= */

  useEffect(() => {
    fetchRolesApi().then((data) =>
      setRoles(Array.isArray(data) ? data : [])
    );

    fetchDepartmentsApi().then((data) =>
      setDepartments(Array.isArray(data) ? data : [])
    );
  }, []);

  /* ================= INPUT ================= */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= MODALS ================= */

  const openRoleDialog = () => {
    setTempRoleId(form.roleId); // auto-check role
    setShowRoleDialog(true);
  };

  const openDeptDialog = () => {
    setTempDeptId(form.departmentId); 
    setShowDeptDialog(true);
  };

  /* ================= UPDATE ================= */

  const handleUpdateClick = () => {
    if (
      !form.firstName ||
      !form.email ||
      !form.roleId ||
      !form.departmentId
    ) {
      toast.error("Please fill required fields");
      return;
    }
    setConfirmOpen(true);
  };

  const confirmUpdate = async () => {
    try {
      setLoading(true);

      await updateUserApi(userId, {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        contactNumber: form.contactNumber,
        location: form.location,
        departmentId: form.departmentId,
        roleIds: [form.roleId], 
      });

      toast.success("User updated successfully");
      onCancel();
    } catch {
      toast.error("Failed to update user");
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  /* ================= UI ================= */

  if (initialLoading) {
    return (
      <div className="add-user-page">
        <div className="add-user-form">Loading user...</div>
      </div>
    );
  }

  return (
    <div className="add-user-page">
      <div className="add-user-form">
        <h2>Edit User</h2>

        <div className="add-user-form-grid">
          <div className="form-row">
            <label>First Name *</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label>Last Name</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label>Email *</label>
            <input value={form.email} disabled />
          </div>

          <div className="form-row">
            <label>Contact Number</label>
            <input
              name="contactNumber"
              value={form.contactNumber}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label>Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
            />
          </div>

          {/* ROLE */}
          <div className="form-row users-row">
            <label>Role *</label>
            <div className="users-inline">
              <span className="users-count">
                {roles.find((r) => r.id === form.roleId)?.name}
              </span>
              <span className="users-link" onClick={openRoleDialog}>
                Manage
              </span>
            </div>
          </div>

          {/* DEPARTMENT */}
          <div className="form-row users-row">
            <label>Department *</label>
            <div className="users-inline">
              <span className="users-count">
                {departments.find((d) => d.id === form.departmentId)?.name}
              </span>
              <span className="users-link" onClick={openDeptDialog}>
                Manage
              </span>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button className="text-btn" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="primary-btn"
            onClick={handleUpdateClick}
            disabled={loading}
          >
            Update
          </button>
        </div>
      </div>

      {/* CONFIRM DIALOG */}
      <ConfirmDialog
        open={confirmOpen}
        title="Confirm Update"
        message="Are you sure you want to update this user?"
        confirmText="Update"
        loading={loading}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmUpdate}
      />

      {/* ROLE MODAL */}
      {showRoleDialog && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Select Role</h3>
            <div className="modal-body">
              {roles.map((r) => (
                <label key={r.id} className="modal-user">
                  <input
                    type="radio"
                    checked={tempRoleId === r.id}
                    onChange={() => setTempRoleId(r.id)}
                  />
                  {r.name}
                </label>
              ))}
            </div>
            <div className="modal-actions">
              <button
                className="text-btn"
                onClick={() => setShowRoleDialog(false)}
              >
                Cancel
              </button>
              <button
                className="save-btn"
                onClick={() => {
                  setForm((p) => ({ ...p, roleId: tempRoleId }));
                  setShowRoleDialog(false);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEPARTMENT MODAL */}
      {showDeptDialog && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Select Department</h3>
            <div className="modal-body">
              {departments.map((d) => (
                <label key={d.id} className="modal-user">
                  <input
                    type="radio"
                    checked={tempDeptId === d.id}
                    onChange={() => setTempDeptId(d.id)}
                  />
                  {d.name}
                </label>
              ))}
            </div>
            <div className="modal-actions">
              <button
                className="text-btn"
                onClick={() => setShowDeptDialog(false)}
              >
                Cancel
              </button>
              <button
                className="save-btn"
                onClick={() => {
                  setForm((p) => ({
                    ...p,
                    departmentId: tempDeptId,
                  }));
                  setShowDeptDialog(false);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateUser;
