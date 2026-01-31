import { useEffect, useState } from "react";
import "@/assets/css/Departments.css";

import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import {
  fetchDepartmentsApi,
  deleteDepartmentApi,
} from "../../../api/profile.api";

import Pagination from "../../Pagination/Pagination";

/* ================= TYPES ================= */

export type Department = {
  id: string;
  name: string;
  description?: string;
  userIds?: string[];
  activeUsersCount?: number;
};

type Props = {
  onAddDepartment: () => void;
  onEditDepartment: (department: Department) => void;
};

const PAGE_SIZE = 5;

/* ================= COMPONENT ================= */

const ManageDepartments: React.FC<Props> = ({
  onAddDepartment,
  onEditDepartment,
}) => {
  const [departments, setDepartments] =
    useState<Department[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  /* ================= LOAD ================= */

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const data = await fetchDepartmentsApi();
      setDepartments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load departments", error);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (departmentId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this department?"
    );
    if (!confirmed) return;

    try {
      await deleteDepartmentApi(departmentId);
      setDepartments((prev) =>
        prev.filter((d) => d.id !== departmentId)
      );
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete department");
    }
  };

  /* ================= FILTER + PAGINATION ================= */

  const filteredDepartments = departments.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredDepartments.length / PAGE_SIZE)
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    if (filteredDepartments.length === 0)
      setCurrentPage(1);
  }, [filteredDepartments.length, totalPages]);

  const paginatedDepartments = filteredDepartments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  /* ================= RENDER ================= */

  return (
    <div className="department-page">
      <div className="department-header">
        <h2>Departments</h2>

        <div className="department-actions">
          <input
            className="department-search"
            placeholder="Search"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <button
            className="primary-btn blue-green"
            onClick={onAddDepartment}
          >
            + Add Department
          </button>
        </div>
      </div>

      <div className="department-table">
        <div className="department-table-header">
          <span>Department</span>
          <span>Active Users</span>
          <span>Actions</span>
        </div>

        {paginatedDepartments.map((dept) => (
          <div
            className="department-table-row"
            key={dept.id}
          >
            <span>{dept.name}</span>

            <span className="active-users">
              {dept.activeUsersCount ?? 0} Users
            </span>

            <span className="action-icons">
              <EditOutlinedIcon
                className="edit-icon"
                onClick={() =>
                  onEditDepartment(dept)
                }
              />

              <DeleteForeverOutlinedIcon
                className="delete-icon"
                onClick={() =>
                  handleDelete(dept.id)
                }
              />
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ManageDepartments;
