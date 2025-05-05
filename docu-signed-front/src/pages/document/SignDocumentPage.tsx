import React, { useState, useRef, useEffect } from "react";
import styles from "./SignDocumentPage.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useDrop, useDrag } from "react-dnd";
import Button from "../../components/button/Button";
import { Document, Page, pdfjs } from "react-pdf";
import { renderAsync } from "docx-preview";
import SignatureForm from "../../components/signature/SignatureForm";
import { sendForSignature } from "../../services/DocumentService";
// pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.js`;
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const SignDocumentPage = () => {
  const { state } = useLocation();
  const { document } = state || {};
  const navigate = useNavigate();
  const fileUrl = `http://localhost:5000/uploads/${document?.savedName}`;
  console.log("PDF URL being passed to Document:", fileUrl);
  console.log("DOCUMENT:", document);
  console.log("document.type:", document?.type);
  console.log("fileUrl:", fileUrl);

  const previewRef = useRef<HTMLDivElement | null>(null);
  //za docx
  const docxContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (document?.type?.includes("wordprocessingml.document")) {
      fetch(fileUrl)
        .then((res) => res.blob())
        .then((blob) => {
          if (docxContainerRef.current) {
            renderAsync(blob, docxContainerRef.current);
          }
        })
        .catch(console.error);
    }
  }, [fileUrl, document]);

  const [mode, setMode] = useState<"drag" | "manual">("drag");
  const [signatureFields, setSignatureFields] = useState<any[]>([]);
  const [signatureWidth, setSignatureWidth] = useState("120");
  const [signatureHeight, setSignatureHeight] = useState("40");
  const [signatureColor, setSignatureColor] = useState("#d1c488");
  const [manualLeft, setManualLeft] = useState("100");
  const [manualTop, setManualTop] = useState("100");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  //za slanje
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [deadline, setDeadline] = useState("");
  const [showSendForm, setShowSendForm] = useState(false);

  //za pdf
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  //DODATO
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent, id: number) => {
    const field = signatureFields.find((f) => f.id === id);
    if (!field || field.source !== "drag") return;
    setDraggingId(id);
    setDragOffset({
      x: e.clientX - field.left,
      y: e.clientY - field.top,
    });
  };
  //za reload pdfa
  useEffect(() => {
    if (document?.type?.includes("pdf")) {
      fetch(fileUrl)
        .then((res) => res.blob())
        .then((blob) => setPdfBlob(blob))
        .catch(console.error);
    }
  }, [fileUrl, document]);

  const handleMouseMove = (e: MouseEvent) => {
    if (draggingId === null) return;
    const newLeft = e.clientX - dragOffset.x;
    const newTop = e.clientY - dragOffset.y;

    setSignatureFields((prev) =>
      prev.map((field) =>
        field.id === draggingId
          ? { ...field, left: newLeft, top: newTop }
          : field
      )
    );
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };
  const handleSendForSignature = async () => {
    if (!recipientEmail) {
      alert("Please enter the recipient's email!");
      return;
    }

    try {
      await sendForSignature({
        documentId: document?.id,
        recipientEmail,
        message,
        deadline,
        signatureFields,
      });
      alert("Document sent successfully!");
      navigate("/");
    } catch (error: any) {
      alert(error.message);
    }
  };

  React.useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingId, dragOffset]);

  const updateSelectedField = (
    key: "width" | "height" | "color",
    value: string
  ) => {
    setSignatureFields((prev) =>
      prev.map((field) =>
        field.id === selectedId ? { ...field, [key]: value } : field
      )
    );
  };
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "signature",
    item: {
      width: signatureWidth,
      height: signatureHeight,
      color: signatureColor,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "signature",
    drop: (item, monitor) => {
      if (mode !== "drag") return;
      const offset = monitor.getClientOffset();
      const container = previewRef.current;

      if (offset && container) {
        const containerRect = container.getBoundingClientRect();
        const relativeX = offset.x - containerRect.left;
        const relativeY = offset.y - containerRect.top;
        const id = Date.now();
        setSignatureFields((prev) => [
          ...prev,
          {
            id,
            left: relativeX,
            top: relativeY,
            width: signatureWidth,
            height: signatureHeight,
            color: signatureColor,
            source: "drag",
            page: currentPage,
          },
        ]);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // const handleManualAdd = () => {
  //   const id = Date.now();
  //   setSignatureFields((prev) => [
  //     ...prev,
  //     {
  //       id,
  //       left: parseInt(manualLeft),
  //       top: parseInt(manualTop),
  //       width: signatureWidth,
  //       height: signatureHeight,
  //       color: signatureColor,
  //       source: "manual",
  //       page: currentPage,
  //     },
  //   ]);
  // };

  const removeField = (id: number) => {
    setSignatureFields((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.leftPane}>
        <h2 className={styles.title}>{document?.originalName}</h2>
        <div
          className={styles.previewContainer}
          ref={(node) => {
            drop(node);
            previewRef.current = node;
          }}
          onClick={() => setSelectedId(null)}
        >
          {document?.type?.includes("pdf") ? (
            <Document
              key={{ fileUrl }}
              file={pdfBlob}
              onLoadSuccess={({ numPages }: any) => setNumPages(numPages)}
              loading="Loading PDF..."
              error="Failed to load PDF."
              options={{ workerSrc: pdfjs.GlobalWorkerOptions.workerSrc }}
            >
              {numPages &&
                Array.from({ length: numPages }, (_, index) => (
                  <div
                    key={index}
                    className={styles.pdfPage}
                    onClick={() => setCurrentPage(index + 1)}
                    style={{ position: "relative" }}
                  >
                    <Page
                      pageNumber={index + 1}
                      width={600}
                      renderTextLayer={false}
                    />
                    {signatureFields
                      .filter((f) => f.page === index + 1)
                      .map((field) => (
                        <div
                          key={field.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedId(field.id);
                          }}
                          onMouseDown={(e) => handleMouseDown(e, field.id)}
                          className={`${styles.signatureField} ${
                            selectedId === field.id ? styles.selected : ""
                          }`}
                          style={{
                            left: `${field.left}px`,
                            top: `${field.top}px`,
                            width: `${field.width}px`,
                            height: `${field.height}px`,
                            borderBottom: `2px solid ${field.color}`,
                            position: "absolute",
                            cursor: "move",
                          }}
                          title="Click to edit or drag"
                        >
                          <span
                            className={styles.deleteBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              removeField(field.id);
                            }}
                          >
                            ✖
                          </span>
                        </div>
                      ))}
                  </div>
                ))}
            </Document>
          ) : document?.type?.includes("image") ? (
            <div style={{ position: "relative" }}>
              <img
                src={fileUrl}
                className={styles.imageViewer}
                alt="Uploaded"
                onClick={() => setSelectedId(null)}
              />
              {signatureFields.map((field) => (
                <div
                  key={field.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(field.id);
                  }}
                  onMouseDown={(e) => handleMouseDown(e, field.id)}
                  className={`${styles.signatureField} ${
                    selectedId === field.id ? styles.selected : ""
                  }`}
                  style={{
                    left: `${field.left}px`,
                    top: `${field.top}px`,
                    width: `${field.width}px`,
                    height: `${field.height}px`,
                    borderBottom: `2px solid ${field.color}`,
                    position: "absolute",
                    cursor: "move",
                  }}
                >
                  <span
                    className={styles.deleteBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeField(field.id);
                    }}
                  >
                    ✖
                  </span>
                </div>
              ))}
            </div>
          ) : document?.type?.includes("wordprocessingml.document") ? (
            <div className={styles.docxWrapper}>
              <div ref={docxContainerRef} className={styles.docxPreview} />
              {signatureFields.map((field) => (
                <div
                  key={field.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(field.id);
                  }}
                  onMouseDown={(e) => handleMouseDown(e, field.id)}
                  className={`${styles.signatureField} ${
                    selectedId === field.id ? styles.selected : ""
                  }`}
                  style={{
                    left: `${field.left}px`,
                    top: `${field.top}px`,
                    width: `${field.width}px`,
                    height: `${field.height}px`,
                    borderBottom: `2px solid ${field.color}`,
                    position: "absolute",
                    cursor: "move",
                  }}
                >
                  <span
                    className={styles.deleteBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeField(field.id);
                    }}
                  >
                    ✖
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.downloadBox}>
              <p>
                Preview not available for this file type. Please{" "}
                <a
                  href={fileUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  download the document
                </a>
                .
              </p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.sidebar}>
        <h3>Signature Mode</h3>
        {/* <div className={styles.modeButtons}>
          <button onClick={() => setMode("drag")}>Drag & Drop</button>
          {/* <button onClick={() => setMode("manual")}>Manual</button> */}
        {/* </div> * */}

        {mode === "drag" && (
          <div
            ref={drag}
            className={styles.draggableBox}
            style={{ opacity: isDragging ? 0.5 : 1 }}
          >
            Drag to sign →
          </div>
        )}

        <div className={styles.settings}>
          {selectedId !== null && (
            <>
              <label>
                Width:
                <input
                  type="number"
                  value={
                    signatureFields.find((f) => f.id === selectedId)?.width ||
                    ""
                  }
                  onChange={(e) => updateSelectedField("width", e.target.value)}
                />
              </label>

              <label>
                Height:
                <input
                  type="number"
                  value={
                    signatureFields.find((f) => f.id === selectedId)?.height ||
                    ""
                  }
                  onChange={(e) =>
                    updateSelectedField("height", e.target.value)
                  }
                />
              </label>

              <label>
                Color:
                <input
                  type="color"
                  value={
                    signatureFields.find((f) => f.id === selectedId)?.color ||
                    "#000000"
                  }
                  onChange={(e) => updateSelectedField("color", e.target.value)}
                />
              </label>

              {signatureFields.find((f) => f.id === selectedId)?.source ===
                "manual" && (
                <>
                  <label>
                    X Position:
                    <input
                      type="number"
                      value={
                        signatureFields.find((f) => f.id === selectedId)
                          ?.left || ""
                      }
                      onChange={(e) =>
                        setSignatureFields((prev) =>
                          prev.map((f) =>
                            f.id === selectedId
                              ? { ...f, left: parseInt(e.target.value) }
                              : f
                          )
                        )
                      }
                    />
                  </label>

                  <label>
                    Y Position:
                    <input
                      type="number"
                      value={
                        signatureFields.find((f) => f.id === selectedId)?.top ||
                        ""
                      }
                      onChange={(e) =>
                        setSignatureFields((prev) =>
                          prev.map((f) =>
                            f.id === selectedId
                              ? { ...f, top: parseInt(e.target.value) }
                              : f
                          )
                        )
                      }
                    />
                  </label>
                </>
              )}
            </>
          )}

          {/* {mode === "manual" && selectedId === null && (
            <>
              <h4>Add new manual field</h4>
              <label>
                X Position:
                <input
                  type="number"
                  value={manualLeft}
                  onChange={(e) => setManualLeft(e.target.value)}
                />
              </label>

              <label>
                Y Position:
                <input
                  type="number"
                  value={manualTop}
                  onChange={(e) => setManualTop(e.target.value)}
                />
              </label>

              {/* <Button onClick={handleManualAdd} className={styles.addField}>
                Add Signature Field
              </Button> */}
          {/* </> */}
          {/* //  )} */}
        </div>

        {/* <Button className={styles.sendBtn}>Send for Signature</Button> */}
        {!showSendForm ? (
          <Button
            className={styles.sendBtn}
            onClick={() => setShowSendForm(true)}
          >
            Send for Signature
          </Button>
        ) : (
          <SignatureForm
            recipientEmail={recipientEmail}
            setRecipientEmail={setRecipientEmail}
            message={message}
            setMessage={setMessage}
            deadline={deadline}
            setDeadline={setDeadline}
            onSend={handleSendForSignature}
          />
        )}
      </div>
    </div>
  );
};

export default SignDocumentPage;
