import React from "react";
import Button from "../../components/button/Button";
import { SignatureProps } from "./SignatureForm.types";
import styles from "./SignatureForm.module.css";
const SignatureForm: React.FC<SignatureProps> = ({
  recipientEmail,
  setRecipientEmail,
  message,
  setMessage,
  deadline,
  setDeadline,
  onSend,
}) => {
  return (
    <div className={styles.formContainer}>
      <label>Email of Signer:</label>
      <input
        type="email"
        value={recipientEmail}
        onChange={(e) => setRecipientEmail(e.target.value)}
        required
      />

      <label>Optional Message:</label>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} />

      <label>Optional Deadline (in days):</label>
      <input
        type="number"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />

      <Button onClick={onSend}>Send for Signature</Button>
    </div>
  );
};
export default SignatureForm;
