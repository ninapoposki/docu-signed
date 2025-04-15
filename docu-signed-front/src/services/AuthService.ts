import axios from "axios";

const apiUrl = "http://localhost:5000";

interface LoginResponse {
  token: string;
}
interface AuthCredentials {
  email: string;
  password: string;
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
  } catch (error) {
    console.error("Error response:", error.response);
    throw new Error(error.response?.data.message || "Login failed");
  }
};
