import type { Department } from "./Department";
import type { Role } from "./Role";

export interface UserApi {
  id: string;

  firstName: string;
  lastName: string;
  email: string;

  contactNumber?: string;
  location?: string;

  department?: Department | null;
  roles?: Role[] | null;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}
