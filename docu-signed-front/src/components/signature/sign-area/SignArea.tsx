import React, { useRef, useState } from "react";
import styles from "./SignArea.module.css";
import Button from "../../button/Button";
import { useDrag } from "react-dnd";
import SignatureCanvas from "react-signature-canvas";

const SignArea = ({ onConfirm }: { onConfirm: (img: string) => void }) => {
  const [mode, setMode] = useState<"draw" | "upload">("draw");
  const [signature, setSignature] = useState<string | null>(null);
  const sigPad = useRef<SignatureCanvas>(null);
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: "signature-img",
      item: () => ({ image: signature }),
      end: (item, monitor) => {
        if (monitor.didDrop() && signature) {
          onConfirm(signature); //tek kad se stvarno dropuje
        }
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [signature]
  );
  const handleConfirm = () => {
    if (mode == "draw" && sigPad.current && !sigPad.current.isEmpty()) {
      const data = sigPad.current.getTrimmedCanvas().toDataURL("image/png");
      setSignature(data);
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setSignature(result);
    };
    reader.readAsDataURL(file);
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.toggle}>
        <Button onClick={() => setMode("draw")}>Draw</Button>
        <Button onClick={() => setMode("upload")}>Upload</Button>
      </div>

      {mode == "draw" && (
        <div className={styles.canvasSection}>
          <SignatureCanvas
            {...({ penColor: "#000" } as any)}
            ref={sigPad}
            canvasProps={{ className: styles.canvas }}
          />
          <div className={styles.controls}>
            <Button onClick={() => sigPad.current?.clear()}>Clear</Button>
            <Button onClick={handleConfirm}>Confirm</Button>
          </div>
        </div>
      )}
      {mode == "upload" && (
        <input
          type="file"
          accept="image/png"
          onChange={handleUpload}
          className={styles.uploadInput}
        />
      )}
      {signature && (
        <div className={styles.preview}>
          <p className={styles.dragText}>
            Drag and drop this signature onto the document →
          </p>
          <img
            ref={dragRef}
            src={signature}
            alt="Signature preview"
            className={styles.previewImg}
            style={{ opacity: isDragging ? 0.5 : 1, cursor: "grab" }}
          />
        </div>
      )}
    </div>
  );
};
export default SignArea;
