export interface RolePermission {
  moduleId: string;
  permission: "read" | "write";
}

export interface CreateRolePayload {
  name: string;
  description?: string;
  userIds: string[];
  permissions: RolePermission[];
}
