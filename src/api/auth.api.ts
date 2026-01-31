import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export const loginApi = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(
    `${BASE_URL}/auth/login`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        "x-correlationid": "1234567",
      },
    }
  );

  return response.data;
};


export const logoutApi = async () => {
  const token = localStorage.getItem("authToken");
  const email = localStorage.getItem("userEmail");

  const response = await axios.post(
    `${BASE_URL}/auth/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        email: email,
        "Content-Type": "application/json",
        "x-correlationid": "1234567",
      },
    }
  );

  return response.data;
};
