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

export const sendForSignature = async (data: {
  documentId: number;
  recipientEmail: string;
  message?: string;
  deadline?: string;
  signatureFields?: any[];
}): Promise<any> => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(
      `${apiUrl}/api/documents/send-for-signature`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Send for signature error:", error.response);
    throw new Error(
      error.response?.data?.message || "Failed to send for signature"
    );
  }
};

export const finalizeSignature = async (data: {
  documentId: number;
  signatureFields: any[];
  // userEmail: string;
}): Promise<any> => {
  // const token = localStorage.getItem("token");

  try {
    const response = await axios.post(
      `${apiUrl}/api/documents/finalize-signature`,
      data
      // {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // }
    );
    return response.data;
  } catch (error: any) {
    console.error("Finalize signature error:", error.response);
    throw new Error(
      error.response?.data?.message || "Failed to finalize signature"
    );
  }
};
export const sendFinalDocument = async (data: {
  email: string;
  fileName: string;
  originalName: string;
}): Promise<any> => {
  try {
    const response = await axios.post(
      `${apiUrl}/api/documents/send-final-email`,
      data
    );

    return response.data;
  } catch (error: any) {
    console.error("Send final document email error:", error.response);
    throw new Error(
      error.response?.data?.message || "Failed to send final document"
    );
  }
};
