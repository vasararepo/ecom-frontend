import type { User } from "../types/User";
import type { UserApi } from "../types/UserApi";

export const mapUserApiToUser = (u: UserApi): User => {
  const primaryRole =
    Array.isArray(u.roles) && u.roles.length > 0
      ? u.roles[0]
      : undefined;

  return {
    id: u.id,

    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,

    contactNumber: u.contactNumber ?? undefined,
    location: u.location ?? undefined,

    
    roleId: primaryRole?.id ?? "",
    roleName: primaryRole?.name ?? undefined,

    departmentId: u.department?.id ?? undefined,
    departmentName: u.department?.name ?? undefined,

   
    isActive: Boolean(u.isActive),

    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
};
