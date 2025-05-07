import React from "react";
import styles from "./AboutPage.module.css";

const AboutPage = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.box}>
        <h2 className={styles.heading}>About DocuSigned</h2>
        <p className={styles.text}>
          <strong>DocuSigned</strong> is a secure and user-friendly platform for
          digital document signing. It allows users to upload documents (PDF,
          DOCX, or image files), send them for signing via email, and receive a
          signed PDF – all without printing or scanning. Perfect for both
          personal and professional use.
        </p>

        <h3 className={styles.subheading}>How to use DocuSigned:</h3>
        <ol className={styles.list}>
          <li>
            <strong>Upload a document:</strong> Supported formats – PDF, DOCX,
            JPG, JPEG, PNG (max 20MB)
          </li>
          <li>
            <strong>Add signature fields:</strong> Via drag-and-drop; customize
            size, position, and color
          </li>
          <li>
            <strong>Enter recipient details:</strong> Email address, optional
            message and deadline
          </li>
          <li>
            <strong>Send for signature:</strong> Recipient receives a secure
            signing link via email
          </li>
          <li>
            <strong>Download the signed document:</strong> Automatically
            generated signed PDF available for download
          </li>
        </ol>
      </div>
    </div>
  );
};

export default AboutPage;
