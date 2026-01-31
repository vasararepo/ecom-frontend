import { useEffect, useState } from "react";

import "../../../assets/css/settings.css";
import "../../../assets/css/AddDepartment.css";

import {
  fetchUsersApi,
  updateDepartmentApi,
  deleteDepartmentApi,
} from "../../../api/profile.api";

/* ================= TYPES ================= */

type User = {
  id: string;
  firstName?: string;
  lastName?: string;
};

type Department = {
  id: string;
  name: string;
  description?: string;
  userIds?: string[];
  users?: User[];
};

type Props = {
  department: Department;
  onCancel: () => void;
};

/* ================= COMPONENT ================= */

const UpdateDepartment = ({ department, onCancel }: Props) => {
  /* ================= BASIC ================= */

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  /* ================= USERS ================= */

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [userDialogOpen, setUserDialogOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  /* ================= PREFILL ================= */

  useEffect(() => {
    setName(department.name ?? "");
    setDescription(department.description ?? "");

    // auto-select assigned users
    const ids =
      department.userIds ??
      department.users?.map((u) => u.id) ??
      [];

    setSelectedUserIds(ids);
  }, [department]);

  /* ================= LOAD USERS ================= */

  const openUserDialog = async () => {
    try {
      if (users.length === 0) {
        const data = await fetchUsersApi();
        setUsers(Array.isArray(data) ? data : []);
      }
      setUserDialogOpen(true);
    } catch {
      setUsers([]);
    }
  };

  const toggleUser = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  /* ================= UPDATE ================= */

  const handleUpdate = async () => {
    if (!name.trim()) return;

    try {
      setLoading(true);
      await updateDepartmentApi(department.id, {
        name: name.trim(),
        description: description.trim() || undefined,
        userIds: selectedUserIds,
      });
      alert("Department updated successfully");
      onCancel();
    } catch {
      alert("Failed to update department");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async () => {
    if (!window.confirm("Delete this department?")) return;

    try {
      setLoading(true);
      await deleteDepartmentApi(department.id);
      alert("Department deleted");
      onCancel();
    } catch {
      alert("Failed to delete department");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="add-department-page">
      <h2 className="section-title">Edit Department</h2>

      <div className="add-department-form">
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
            rows={4}
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />
        </div>

        {/* USERS (EXACTLY LIKE ADD ROLE) */}
        <div className="form-row users-row">
          <label>Users</label>

          <div className="users-inline">
            {selectedUserIds.length > 0 && (
              <span className="users-count">
                {selectedUserIds.length}{" "}
                {selectedUserIds.length === 1
                  ? "User"
                  : "Users"}
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

        {/* ACTIONS */}
        <div className="form-actions">
          <button
            className="delete-btn"
            onClick={handleDelete}
            disabled={loading}
          >
            Delete
          </button>

          <button
            className="text-btn"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className="save-btn"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>

      {/* ================= USERS DIALOG (SAME AS ADD ROLE) ================= */}
      {userDialogOpen && (
        <div className="dialog-backdrop">
          <div className="dialog">
            <h3>Select Users</h3>

            <div className="dialog-content">
              {users.length === 0 ? (
                <p>No users available</p>
              ) : (
                users.map((u) => (
                  <label
                    key={u.id}
                    className="user-checkbox"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUserIds.includes(
                        u.id
                      )}
                      onChange={() => toggleUser(u.id)}
                    />
                    {u.firstName} {u.lastName}
                  </label>
                ))
              )}
            </div>

            <div className="dialog-actions">
              <button
                className="btn-cancel"
                onClick={() =>
                  setUserDialogOpen(false)
                }
              >
                Cancel
              </button>

              <button
                className="btn-save"
                onClick={() =>
                  setUserDialogOpen(false)
                }
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateDepartment;
