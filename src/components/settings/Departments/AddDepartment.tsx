import { useState } from "react";

import "../../../assets/css/settings.css";
import "../../../assets/css/AddDepartment.css";

import {
  createDepartmentApi,
  deleteDepartmentApi,
  fetchUsersApi,
} from "../../../api/profile.api";

/* ================= TYPES ================= */

type Props = {
  onCancel: () => void;
  departmentId?: string;
};

type User = {
  id: string;
  firstName?: string;
  lastName?: string;
};

/* ================= COMPONENT ================= */

const AddDepartment: React.FC<Props> = ({ onCancel, departmentId }) => {
  /* ================= STATE ================= */

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>([]);

  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const isEditMode = Boolean(departmentId);

  /* ================= USERS ================= */

  const openUserDialog = async () => {
    if (users.length === 0) {
      try {
        const data = await fetchUsersApi();
        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    }

    setTempSelectedIds(selectedUserIds);
    setShowDialog(true);
  };

  const toggleTempUser = (id: string) => {
    setTempSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((userId) => userId !== id)
        : [...prev, id]
    );
  };

  const confirmUsers = () => {
    setSelectedUserIds(tempSelectedIds);
    setShowDialog(false);
  };

  /* ================= SAVE ================= */

  const handleSave = async () => {
    if (!name.trim()) return;

    const confirmed = window.confirm(
      "Are you sure you want to submit this department?"
    );
    if (!confirmed) return;

    const payload = {
      name: name.trim(),
      description: description.trim() || undefined,
      userIds: selectedUserIds,
    };

    try {
      setLoading(true);
      await createDepartmentApi(payload);
      alert("Department created successfully");
      onCancel();
    } catch (error) {
      console.error("Create department failed", error);
      alert("Failed to create department");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async () => {
    if (!departmentId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this department?"
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      await deleteDepartmentApi(departmentId);
      alert("Department deleted successfully");
      onCancel();
    } catch (error) {
      console.error("Delete department failed", error);
      alert("Failed to delete department");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RENDER ================= */

  return (
    <div className="add-department-page">
      <h2 className="section-title">
        {isEditMode ? "Edit Department" : "New Department"}
      </h2>

      <div className="add-department-form">
        {/* ================= SCROLLABLE CONTENT ================= */}
        <div className="form-scroll">
          {/* NAME */}
          <div className="form-row">
            <label>
              Name <span className="required">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* DESCRIPTION */}
          <div className="form-row">
            <label>Description</label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* USERS */}
          <div className="form-row users-row">
            <label>Users</label>

            <div className="users-inline">
              {selectedUserIds.length > 0 && (
                <span className="users-count">
                  {selectedUserIds.length}{" "}
                  {selectedUserIds.length === 1 ? "User" : "Users"}
                </span>
              )}

              <span
                className="users-link"
                onClick={openUserDialog}
              >
                Manage
              </span>
            </div>
          </div>
        </div>

        {/* ================= FIXED ACTIONS ================= */}
        <div className="form-actions sticky">
          {isEditMode && (
            <button
              className="delete-btn"
              onClick={handleDelete}
              disabled={loading}
            >
              Delete
            </button>
          )}

          <button
            className="text-btn"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className="save-btn"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* ================= USER DIALOG ================= */}
      {showDialog && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Select Users</h3>

            <div className="modal-body">
              {users.map((user) => {
                const fullName =
                  `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

                return (
                  <label
                    key={user.id}
                    className="modal-user"
                  >
                    <input
                      type="checkbox"
                      checked={tempSelectedIds.includes(user.id)}
                      onChange={() => toggleTempUser(user.id)}
                    />
                    {fullName || "Unnamed User"}
                  </label>
                );
              })}
            </div>

            <div className="modal-actions">
              <button
                className="text-btn"
                onClick={() => setShowDialog(false)}
              >
                Cancel
              </button>
              <button
                className="save-btn"
                onClick={confirmUsers}
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

export default AddDepartment;
