import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./FinalDocumentPage.module.css";
import InputField from "../../components/input/InputField";
import Button from "../../components/button/Button";
import { sendFinalDocument } from "../../services/DocumentService";
import axios from "axios";

const FinalDocumentPage = () => {
  const { state } = useLocation();
  const { fileName, originalName } = state || {};

  const [email, setEmail] = useState("");
  const fileUrl = `http://localhost:5000/uploads/signed/${fileName}`;

  const handleSendEmail = async () => {
    if (!email || !fileName) return alert("Please enter a valid email.");
    try {
      await sendFinalDocument({ email, fileName, originalName });
      alert("Document sent to email successfully.");
      setEmail("");
    } catch (error) {
      console.error("Email sending failed:", error);
      alert("Failed to send document to the email.");
    }
  };
  const handleDownload = async () => {
    try {
      const response = await axios.get(fileUrl, { responseType: "blob" });
      const blob = new Blob([response.data], { type: "application/pdf" });

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download failed", error);
      alert("Failed to download the document.");
    }
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.leftPane}>
        <h2 className={styles.title}>{fileName}</h2>
        <div className={styles.previewContainer}>
          <iframe
            src={fileUrl}
            width="100%"
            height="800px"
            title="Signed Document"
          />
        </div>
      </div>
      <div className={styles.sidebar}>
        {/* <a href={fileUrl} download={originalName}>
          <Button>Download PDF</Button>
        </a> */}
        <Button onClick={handleDownload}>Download PDF</Button>

        <label className={styles.label}>Recipient Email</label>
        <InputField
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
        />
        <Button onClick={handleSendEmail}>Send to Email</Button>
      </div>
    </div>
  );
};

export default FinalDocumentPage;
