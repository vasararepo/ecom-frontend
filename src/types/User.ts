export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber?: string;
  location?: string;

  roleId: string;
  roleName?: string;

  departmentId?: string;
  departmentName?: string;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}
