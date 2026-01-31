import { useEffect, useState } from "react";
import "@/assets/css/settings.css";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import {
  fetchUsersApi,
  deleteUserApi,
  updateUserStatusApi,
} from "../../../api/profile.api";

import Pagination from "../../Pagination/Pagination";
import ConfirmDialog from "../../DialogBox/ConfirmDialog";
import { toast } from "react-toastify";

/* ===== TYPES ===== */
import type { User } from "../../../types/User";
import type { UserApi } from "../../../types/UserApi";

/* ===== MAPPER ===== */
import { mapUserApiToUser } from "../../../mappers/user.mapper";

/* ================= PROPS ================= */

type Props = {
  onAddUser: () => void;
  onEditUser: (userId: string) => void;
};

const ROWS_PER_PAGE = 5;

/* ================= COMPONENT ================= */

const ManageUsers = ({ onAddUser, onEditUser }: Props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  /* ===== DELETE ===== */
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  /* ===== STATUS ===== */
  const [statusUserId, setStatusUserId] = useState<string | null>(null);
  const [nextStatus, setNextStatus] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  /* ================= LOAD USERS ================= */

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async (): Promise<void> => {
    try {
      setLoading(true);

      
      const apiUsers = (await fetchUsersApi()) as UserApi[];

      
      const mappedUsers = apiUsers.map(mapUserApiToUser);

      setUsers(mappedUsers);
    } catch (error) {
      console.error("Fetch users error:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE USER ================= */

  const confirmDelete = async (): Promise<void> => {
    if (!deleteUserId) return;

    try {
      setDeleteLoading(true);
      await deleteUserApi(deleteUserId);

      setUsers((prev) => prev.filter((u) => u.id !== deleteUserId));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Delete user error:", error);
      toast.error("Failed to delete user");
    } finally {
      setDeleteLoading(false);
      setDeleteUserId(null);
    }
  };

  /* ================= UPDATE STATUS ================= */

  const confirmStatusUpdate = async (): Promise<void> => {
    if (!statusUserId) return;

    try {
      setStatusLoading(true);
      await updateUserStatusApi(statusUserId, nextStatus);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === statusUserId ? { ...u, isActive: nextStatus } : u
        )
      );

      toast.success(
        nextStatus
          ? "User activated successfully"
          : "User deactivated successfully"
      );
    } catch (error) {
      console.error("Update status error:", error);
      toast.error("Failed to update user status");
    } finally {
      setStatusLoading(false);
      setStatusUserId(null);
    }
  };

  /* ================= PAGINATION ================= */

  const totalPages = Math.max(
    1,
    Math.ceil(users.length / ROWS_PER_PAGE)
  );

  const paginatedUsers = users.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  /* ================= UI ================= */

  return (
    <div className="manage-users">
      <div className="users-header">
        <button className="add-user-btn" onClick={onAddUser}>
          <PersonAddIcon />
          Add User
        </button>
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>User Name</th>
            <th>Department</th>
            <th>Role</th>
            <th>Status</th>
            <th className="actions">Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className="table-center">
                Loading users...
              </td>
            </tr>
          ) : paginatedUsers.length === 0 ? (
            <tr>
              <td colSpan={5} className="table-center">
                No users found
              </td>
            </tr>
          ) : (
            paginatedUsers.map((u) => (
              <tr key={u.id}>
                <td>
                  {u.firstName} {u.lastName}
                </td>
                <td>{u.departmentName ?? "-"}</td>
                <td>{u.roleName ?? "-"}</td>

                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={u.isActive}
                      onChange={() => {
                        setStatusUserId(u.id);
                        setNextStatus(!u.isActive);
                      }}
                    />
                    <span className="slider" />
                  </label>
                </td>

                <td className="actions">
                  <EditIcon
                    style={{ cursor: "pointer" }}
                    onClick={() => onEditUser(u.id)}
                  />
                  <DeleteIcon
                    className="delete-icon"
                    onClick={() => setDeleteUserId(u.id)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* DELETE CONFIRM */}
      <ConfirmDialog
        open={Boolean(deleteUserId)}
        title="Delete User"
        message="Are you sure you want to delete this user?"
        loading={deleteLoading}
        onCancel={() => setDeleteUserId(null)}
        onConfirm={confirmDelete}
      />

      {/* STATUS CONFIRM */}
      <ConfirmDialog
        open={Boolean(statusUserId)}
        title="Change User Status"
        message={`Are you sure you want to ${
          nextStatus ? "activate" : "deactivate"
        } this user?`}
        loading={statusLoading}
        onCancel={() => setStatusUserId(null)}
        onConfirm={confirmStatusUpdate}
      />
    </div>
  );
};

export default ManageUsers;
