import axios from "axios";

const apiUrl = "http://localhost:5000";

interface LoginResponse {
  token: string;
}
// interface AuthCredentials {
//   email: string;
//   password: string;
// }
interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: string;
  // createdAt: string;
}
export const login = async (
  email: string,
  password: string
): Promise<string> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${apiUrl}/api/users/login`,
      {
        email,
        password,
      }
    );
    console.log(response.data);
    return response.data.token;
  } catch (error: any) {
    console.error("Error response:", error.response);
    throw new Error(error.response?.data.message || "Login failed");
  }
};

export const register = async (user: RegisterData): Promise<void> => {
  try {
    const response = await axios.post(`${apiUrl}/api/users/register`, user);
    console.log(response.data);
    return response.data.token;
  } catch (error: any) {
    console.error("Error response:", error.response);
    throw new Error(error.response?.data.message || "Failed to register");
  }
};
