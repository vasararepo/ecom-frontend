import { useEffect, useState } from "react";
import "@/assets/css/AddRole.css";

import {
  fetchPermissionModulesApi,
  createRoleApi,
  fetchUsersApi,
} from "../../../api/profile.api";

import type { PermissionModule } from "../../../types/PermissionModule";
import type { User } from "../../../types/User";
import type {
  CreateRolePayload,
  RolePermission,
} from "../../../types/CreateRolePayload";

type Props = {
  onCancel: () => void;
};

type PermissionState = {
  enabled: boolean;
  read: boolean;
  write: boolean;
};

const EMPTY_PERMISSION: PermissionState = {
  enabled: false,
  read: false,
  write: false,
};

const AddRole = ({ onCancel }: Props) => {
  /* ================= BASIC INFO ================= */

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  /* ================= USERS ================= */

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [userDialogOpen, setUserDialogOpen] = useState(false);

  /* ================= PERMISSIONS ================= */

  const [modules, setModules] = useState<PermissionModule[]>([]);
  const [permissions, setPermissions] = useState<
    Record<string, PermissionState>
  >({});

  const [saving, setSaving] = useState(false);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    loadUsers();
    loadModules();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await fetchUsersApi();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setUsers([]);
    }
  };

  const loadModules = async () => {
    try {
      const data = await fetchPermissionModulesApi();

      const initial: Record<string, PermissionState> = {};
      data.forEach((m) => {
        initial[m.id] = { ...EMPTY_PERMISSION };
      });

      setModules(Array.isArray(data) ? data : []);
      setPermissions(initial);
    } catch {
      setModules([]);
      setPermissions({});
    }
  };

  /* ================= USERS ================= */

  const toggleUser = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  /* ================= PERMISSIONS ================= */

  const toggleModule = (moduleId: string) => {
    setPermissions((prev) => {
      const current = prev[moduleId] ?? EMPTY_PERMISSION;
      const enabled = !current.enabled;

      return {
        ...prev,
        [moduleId]: {
          enabled,
          read: enabled,
          write: false,
        },
      };
    });
  };

  const togglePermission = (
    moduleId: string,
    field: "read" | "write"
  ) => {
    setPermissions((prev) => {
      const current = prev[moduleId] ?? EMPTY_PERMISSION;

      return {
        ...prev,
        [moduleId]: {
          ...current,
          [field]: !current[field],
        },
      };
    });
  };

  /* ================= SAVE ================= */

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Role name is required");
      return;
    }

    const permissionList: RolePermission[] = [];

    Object.entries(permissions).forEach(
      ([moduleId, state]) => {
        if (!state.enabled) return;

        if (state.write) {
          permissionList.push({
            moduleId,
            permission: "write",
          });
        } else if (state.read) {
          permissionList.push({
            moduleId,
            permission: "read",
          });
        }
      }
    );

    if (permissionList.length === 0) {
      alert("Select at least one permission");
      return;
    }

    const payload: CreateRolePayload = {
      name: name.trim(),
      description: description.trim(),
      userIds: selectedUserIds,
      permissions: permissionList,
    };

    try {
      setSaving(true);
      await createRoleApi(payload);
      alert("Role created successfully");
      onCancel();
    } catch {
      alert("Failed to create role");
    } finally {
      setSaving(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="add-role-page">
      <div className="add-role-header">
        <h2>New Role</h2>
      </div>

      <div className="add-role-form">
        {/* NAME */}
        <div className="form-row">
          <label>
            Name <span className="required">*</span>
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter role name"
          />
        </div>

        {/* DESCRIPTION */}
        <div className="form-row">
          <label>Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* USERS ROW (LIKE ADD DEPARTMENT) */}
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
              onClick={() => setUserDialogOpen(true)}
            >
              Manage
            </span>
          </div>
        </div>

        {/* PERMISSIONS */}
        <div className="form-row">
          <label>
            Permissions <span className="required">*</span>
          </label>

          <div className="permissions-wrapper">
            {modules.map((m) => {
              const state =
                permissions[m.id] ?? EMPTY_PERMISSION;

              return (
                <div
                  className="permission-card"
                  key={m.id}
                >
                  <label>
                    <input
                      type="checkbox"
                      checked={state.enabled}
                      onChange={() =>
                        toggleModule(m.id)
                      }
                    />
                    {m.name}
                  </label>

                  {state.enabled && (
                    <div className="permission-children">
                      <label>
                        <input
                          type="checkbox"
                          checked={state.read}
                          onChange={() =>
                            togglePermission(
                              m.id,
                              "read"
                            )
                          }
                        />
                        Read
                      </label>

                      <label>
                        <input
                          type="checkbox"
                          checked={state.write}
                          onChange={() =>
                            togglePermission(
                              m.id,
                              "write"
                            )
                          }
                        />
                        Write
                      </label>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="form-actions">
          <button onClick={onCancel} disabled={saving}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* USERS DIALOG */}
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

export default AddRole;
