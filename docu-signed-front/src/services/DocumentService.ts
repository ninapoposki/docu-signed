import axios from "axios";

const apiUrl = "http://localhost:5000";

export const uploadDocument = async (file: File): Promise<any> => {
  const formData = new FormData();

  formData.append("file", file);
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(
      `${apiUrl}/api/documents/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Upload response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Upload error:", error.response);
    throw new Error(
      error.response?.data?.message || "Failed to upload document"
    );
  }
};
