export interface SignatureProps {
  recipientEmail: string;
  setRecipientEmail: (value: string) => void;
  message: string;
  setMessage: (value: string) => void;
  deadline: string;
  setDeadline: (value: string) => void;
  onSend: () => void;
}
