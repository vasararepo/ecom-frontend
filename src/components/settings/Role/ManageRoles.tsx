import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import "@/assets/css/ManageRoles.css";

import {
  fetchRolesApi,
  fetchRolePermissionsApi,
} from "../../../api/profile.api";

import Pagination from "../../Pagination/Pagination";
import AddRole from "./AddRole";

/* ================= UI TYPES ================= */

type RoleRow = {
  id: string;
  name: string;
  description: string | null;
  assignedUsersCount: number;
};

type PermissionRow = {
  moduleId: string;
  moduleName: string;
  permission: string;
  assigned: boolean;
};

type Props = {
  onAddRole?: () => void;
};

const PAGE_SIZE = 5;

/* ================= COMPONENT ================= */

const ManageRoles = ({ onAddRole }: Props) => {
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [showAddRole, setShowAddRole] = useState(false);

  const [showPermissionDialog, setShowPermissionDialog] =
    useState(false);
  const [selectedRole, setSelectedRole] =
    useState<RoleRow | null>(null);
  const [permissions, setPermissions] =
    useState<PermissionRow[]>([]);
  const [permissionLoading, setPermissionLoading] =
    useState(false);

  /* ================= LOAD ROLES ================= */

  const loadRoles = useCallback(async () => {
    try {
      setLoading(true);

      const data = await fetchRolesApi();

      const mapped: RoleRow[] = Array.isArray(data)
        ? data.map((r) => ({
            id: r.id,
            name: r.name,
            description: r.description ?? null,
            assignedUsersCount: 0,
          }))
        : [];

      setRoles(mapped);
    } catch (err) {
      console.error("Failed to load roles", err);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  /* ================= PAGINATION ================= */

  const totalPages = useMemo(() => {
    return Math.max(
      1,
      Math.ceil(roles.length / PAGE_SIZE)
    );
  }, [roles.length]);

  const paginatedRoles = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return roles.slice(start, start + PAGE_SIZE);
  }, [roles, currentPage]);

  /* ================= VIEW PERMISSIONS ================= */

  const openPermissions = useCallback(
    async (role: RoleRow) => {
      setSelectedRole(role);
      setShowPermissionDialog(true);
      setPermissionLoading(true);

      try {
        const data = await fetchRolePermissionsApi(
          role.id
        );

        const mapped: PermissionRow[] =
          Array.isArray(data)
            ? data.map((p) => ({
                moduleId: p.moduleId,
                moduleName: p.moduleName,
                permission: p.permission,
                assigned: true,
              }))
            : [];

        setPermissions(mapped);
      } catch (err) {
        console.error(
          "Failed to load permissions",
          err
        );
        setPermissions([]);
      } finally {
        setPermissionLoading(false);
      }
    },
    []
  );

  const closePermissions = useCallback(() => {
    setShowPermissionDialog(false);
    setSelectedRole(null);
    setPermissions([]);
  }, []);

  /* ================= ADD ROLE FLOW ================= */

  const openAddRole = useCallback(() => {
    setShowAddRole(true);
    onAddRole?.();
  }, [onAddRole]);

  const closeAddRole = useCallback(() => {
    setShowAddRole(false);
    loadRoles();
    onAddRole?.();
  }, [loadRoles, onAddRole]);

  /* ================= UI ================= */

  if (loading) {
    return <div className="roles-page">Loading roles...</div>;
  }

  if (showAddRole) {
    return <AddRole onCancel={closeAddRole} />;
  }

  return (
    <>
      <div className="roles-page">
        <div className="roles-header">
          <button
            className="new-role-btn"
            onClick={openAddRole}
          >
            + New Role
          </button>
        </div>

        <div className="roles-table-wrapper">
          <table className="roles-table">
            <thead>
              <tr>
                <th>Roles</th>
                <th>Assigned Users</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedRoles.map((role) => (
                <tr key={role.id}>
                  <td className="role-name">
                    {role.name}
                  </td>
                  <td>
                    {role.assignedUsersCount} Users
                  </td>
                  <td>
                    {role.description || "—"}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="view-link-btn"
                      onClick={() =>
                        openPermissions(role)
                      }
                    >
                      View Permission
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {showPermissionDialog && selectedRole && (
        <div className="modal-backdrop">
          <div className="modal large">
            <h3>
              {selectedRole.name} – Permissions
            </h3>

            {permissionLoading ? (
              <div>Loading permissions...</div>
            ) : permissions.length === 0 ? (
              <div>No permissions found</div>
            ) : (
              <table className="roles-table">
                <thead>
                  <tr>
                    <th>Module</th>
                    <th>Permission</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((p) => (
                    <tr
                      key={`${p.moduleId}-${p.permission}`}
                    >
                      <td>{p.moduleName}</td>
                      <td>{p.permission}</td>
                      <td>
                        {p.assigned ? (
                          <span className="status-active">
                            Assigned
                          </span>
                        ) : (
                          <span className="status-inactive">
                            Not Assigned
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="modal-actions">
              <button
                className="primary-btn"
                onClick={closePermissions}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(ManageRoles);
