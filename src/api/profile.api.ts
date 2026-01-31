import axios from "axios";
import type { User } from "../types/User";
import type { PermissionModule } from "../types/PermissionModule";
import type { CreateRolePayload } from "../types/CreateRolePayload";

/* ================= AXIOS INSTANCE ================= */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

/* ================= AUTH HEADERS ================= */

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  const email = localStorage.getItem("userEmail");

  return {
    Authorization: token ? `Bearer ${token}` : "",
    email: email || "",
    "Content-Type": "application/json",
    "x-correlationid": "1234567",
  };
};

/* ================= USERS ================= */

export const fetchUsersApi = async (): Promise<User[]> => {
  const res = await api.get("/profile/users/list", {
    headers: getAuthHeaders(),
  });

  return Array.isArray(res.data?.data) ? res.data.data : [];
};

export const fetchUserByIdApi = async (
  userId: string
): Promise<User | null> => {
  const res = await api.get(
    `/profile/users/detail/${userId}`,
    { headers: getAuthHeaders() }
  );

  return res.data?.data ?? null;
};

export type CreateUserPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  contactNumber?: string;
  location?: string;
  departmentId: string;
  roleIds: string[];
};

export const createUserApi = async (
  payload: CreateUserPayload
): Promise<void> => {
  await api.post(
    "/profile/users/create",
    payload,
    { headers: getAuthHeaders() }
  );
};

export type UpdateUserPayload = {
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  location: string;
  departmentId: string;
  roleIds: string[];
};

export const updateUserApi = async (
  userId: string,
  payload: UpdateUserPayload
): Promise<void> => {
  await api.put(
    `/profile/users/update/${userId}`,
    payload,
    { headers: getAuthHeaders() }
  );
};

export const updateUserStatusApi = async (
  userId: string,
  isActive: boolean
): Promise<void> => {
  await api.put(
    `/profile/users/${userId}/status`,
    { isActive },
    { headers: getAuthHeaders() }
  );
};

export const deleteUserApi = async (
  userId: string
): Promise<void> => {
  await api.delete(
    `/profile/users/delete/${userId}`,
    { headers: getAuthHeaders() }
  );
};

/* ================= ROLES ================= */

export type Role = {
  id: string;
  name: string;
  description?: string;
};

export const fetchRolesApi = async (): Promise<Role[]> => {
  const res = await api.get(
    "/profile/roles/list",
    { headers: getAuthHeaders() }
  );

  return Array.isArray(res.data?.data) ? res.data.data : [];
};

export type RolePermissionResponse = {
  moduleId: string;
  moduleName: string;
  permission: "read" | "write";
};

export const fetchRolePermissionsApi = async (
  roleId: string
): Promise<RolePermissionResponse[]> => {
  const res = await api.get(
    `/profile/roles/${roleId}/permissions`,
    { headers: getAuthHeaders() }
  );

  return Array.isArray(res.data?.data) ? res.data.data : [];
};

export const createRoleApi = async (
  payload: CreateRolePayload
): Promise<void> => {
  await api.post(
    "/profile/roles/create",
    payload,
    { headers: getAuthHeaders() }
  );
};

/* ================= PERMISSION MODULES ================= */

export const fetchPermissionModulesApi = async (): Promise<
  PermissionModule[]
> => {
  const res = await api.get(
    "/profile/permissions/modules/list",
    { headers: getAuthHeaders() }
  );

  return Array.isArray(res.data?.data) ? res.data.data : [];
};

/* ================= DEPARTMENTS ================= */

export type Department = {
  id: string;
  name: string;
  description?: string;
};

export const fetchDepartmentsApi = async (): Promise<
  Department[]
> => {
  const res = await api.get(
    "/profile/departments/list",
    { headers: getAuthHeaders() }
  );

  return Array.isArray(res.data?.data) ? res.data.data : [];
};

export type CreateDepartmentPayload = {
  name: string;
  description?: string;
  userIds?: string[];
};

export const createDepartmentApi = async (
  payload: CreateDepartmentPayload
): Promise<void> => {
  await api.post(
    "/profile/departments/create",
    payload,
    { headers: getAuthHeaders() }
  );
};

export type UpdateDepartmentPayload = {
  name: string;
  description?: string;
  userIds?: string[];
};

export const updateDepartmentApi = async (
  departmentId: string,
  payload: UpdateDepartmentPayload
): Promise<void> => {
  await api.put(
    `/profile/departments/update/${departmentId}`,
    payload,
    { headers: getAuthHeaders() }
  );
};

export const deleteDepartmentApi = async (
  departmentId: string
): Promise<void> => {
  await api.delete(
    `/profile/departments/delete/${departmentId}`,
    { headers: getAuthHeaders() }
  );
};

/* ================= PROFILE ================= */

export const fetchMyProfileApi = async (): Promise<User | null> => {
  const res = await api.get(
    "/profile/me",
    { headers: getAuthHeaders() }
  );

  return res.data?.data ?? null;
};
