import { useEffect, useState } from "react";
import "@/assets/css/Settings.css";

import {
  fetchRolesApi,
  fetchDepartmentsApi,
  createUserApi,
} from "../../../api/profile.api";

import { toast } from "react-toastify";

/* ================= TYPES ================= */

type Props = {
  onCancel: () => void;
};

type Role = {
  id: string;
  name: string;
};

type Department = {
  id: string;
  name: string;
};

/* ================= COMPONENT ================= */

const AddUser = ({ onCancel }: Props) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    contactNumber: "",
    location: "",
    roleId: "",
    departmentId: "",
  });

  /* ================= LOAD DROPDOWNS ================= */

  useEffect(() => {
    loadDropdownData();
  }, []);

  const loadDropdownData = async () => {
    try {
      const [rolesData, departmentsData] = await Promise.all([
        fetchRolesApi(),
        fetchDepartmentsApi(),
      ]);

      setRoles(Array.isArray(rolesData) ? rolesData : []);
      setDepartments(
        Array.isArray(departmentsData) ? departmentsData : []
      );
    } catch {
      toast.error("Failed to load roles or departments");
    }
  };

  /* ================= HANDLERS ================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= SAVE USER ================= */

  const handleSave = async () => {
    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.roleId ||
      !form.departmentId
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      username: form.email.trim(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      password: form.password,
      contactNumber: form.contactNumber,
      location: form.location,
      departmentId: form.departmentId,
      roleIds: [form.roleId],
    };

    try {
      setLoading(true);
      await createUserApi(payload);

      toast.success("User created successfully");
      onCancel();
    } catch (error) {
      console.error("Create user failed", error);
      toast.error("Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div
      className="add-user-page"
      style={{
        paddingTop: 0,
        marginTop: 0,
        display: "flex",
        justifyContent: "flex-start",
      }}
    >
      <div
        className="add-user-form"
        style={{
          marginTop: 8,
          maxWidth: 900,
          padding: "20px 24px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            columnGap: 24,
            rowGap: 14,
          }}
        >
          <div className="form-row">
            <label>
              First Name <span>*</span>
            </label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              style={{ height: 36 }}
            />
          </div>

          <div className="form-row">
            <label>
              Last Name <span>*</span>
            </label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              style={{ height: 36 }}
            />
          </div>

          <div className="form-row">
            <label>
              Email <span>*</span>
            </label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              style={{ height: 36 }}
            />
          </div>

          <div className="form-row">
            <label>
              Password <span>*</span>
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              style={{ height: 36 }}
            />
          </div>

          <div className="form-row">
            <label>Contact Number</label>
            <input
              name="contactNumber"
              value={form.contactNumber}
              onChange={handleChange}
              style={{ height: 36 }}
            />
          </div>

          <div className="form-row">
            <label>Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              style={{ height: 36 }}
            />
          </div>

          <div className="form-row">
            <label>
              Role <span>*</span>
            </label>
            <select
              name="roleId"
              value={form.roleId}
              onChange={handleChange}
              style={{ height: 36 }}
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <label>
              Department <span>*</span>
            </label>
            <select
              name="departmentId"
              value={form.departmentId}
              onChange={handleChange}
              style={{ height: 36 }}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          className="form-actions"
          style={{
            marginTop: 20,
            display: "flex",
            gap: 12,
          }}
        >
          <button
            className="primary-btn"
            style={{ padding: "8px 22px" }}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>

          <button className="text-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
