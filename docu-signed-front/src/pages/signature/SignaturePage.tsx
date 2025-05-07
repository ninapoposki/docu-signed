import React, { useEffect, useRef, useState } from "react";
import styles from "./SignaturePage.module.css";
import { useParams } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import SignArea from "../../components/signature/sign-area/SignArea";
import { useDrop } from "react-dnd";
import Button from "../../components/button/Button";
import { finalizeSignature } from "../../services/DocumentService";
import { useNavigate } from "react-router-dom";
import PDFWithDropSignature from "../../components/page-drop/PDFWithDropSignature";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const SignaturePage = () => {
  const { id: documentId } = useParams();
  const [documentData, setDocumentData] = useState<any>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  // const [numPages, setNumPages] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  //za potpisivanje
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [signatureImages, setSignatureImages] = useState<any[]>([]);
  // const [currentPage, setCurrentPage] = useState(1);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const navigate = useNavigate();
  //stranice pdfa
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [pdfScale, setPdfScale] = useState(1);

  useEffect(() => {
    if (documentId) {
      fetch(`http://localhost:5000/api/documents/${documentId}`)
        .then((res) => {
          if (!res.ok) throw new Error(" Failed to fetch document metadata");
          return res.json();
        })
        .then((data) => {
          setDocumentData(data);
          const fileUrl = `http://localhost:5000/uploads/signed/${data.savedName}`;
          return fetch(fileUrl);
        })
        .then((res) => {
          if (!res.ok) {
            throw new Error(" Failed to fetch file ");
          }
          return res.blob();
        })
        .then((blob) => {
          setPdfBlob(blob);
        })
        .catch(console.error);
    }
  }, [documentId]);

  const handleSignatureConfirm = (imgData: string) => {
    const id = Date.now();
    setSignatureData(imgData);
  };

  const handleMouseDown = (e: React.MouseEvent, id: number) => {
    const img = signatureImages.find((s) => s.id === id);
    if (!img) return;
    setDraggingId(id);
    setDragOffset({
      x: e.clientX - img.x,
      y: e.clientY - img.y,
    });
  };
  const removeImage = (id: number) => {
    setSignatureImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (draggingId === null) return;
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    setSignatureImages((prev) =>
      prev.map((s) => (s.id === draggingId ? { ...s, x: newX, y: newY } : s))
    );
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  const handleFinalizeSigning = async () => {
    if (!documentId || signatureImages.length === 0) {
      alert("Please add  signature before finalizing.");
      return;
    }

    try {
      const response = await finalizeSignature({
        documentId: parseInt(documentId),
        signatureFields: signatureImages,
      });
      alert("Document finalized and saved.");
      setSignatureImages([]);
      setSignatureData(null);
      if (response?.fileName) {
        const finalUrl = `http://localhost:5000/uploads/signed/${response.fileName}`;

        // Otvori u novom tabu
        navigate("/final-document", {
          state: {
            fileName: response.fileName,
            originalName: documentData?.originalName || "Signed Document",
          },
        });
      }
    } catch (error) {
      console.error("Error finalizing signature:", error);
      alert("Something went wrong while saving the signed document.");
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingId, dragOffset]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "signature-img",
    drop: (item: any, monitor) => {
      if (!item.image) return;

      const offset = monitor.getClientOffset();
      const container = previewRef.current;
      if (offset && container) {
        const rect = container.getBoundingClientRect();
        const x = offset.x - rect.left;
        const y = offset.y - rect.top - 10;
        const id = Date.now();
        setSignatureImages((prev) => [
          ...prev,
          {
            id,
            img: item.image,
            x,
            y,
            width: 130,
            height: 50,
            page: currentPage,
          },
        ]);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div className={styles.wrapper}>
      <div className={styles.leftPane}>
        <h2 className={styles.title}>{documentData?.originalName}</h2>
        <div
          className={styles.previewContainer}
          ref={(node) => {
            drop(node);
            previewRef.current = node;
          }}
        >
          {documentData?.savedName?.toLowerCase().endsWith(".pdf") &&
            pdfBlob && (
              <Document
                file={pdfBlob}
                onLoadSuccess={({ numPages }: any) => setNumPages(numPages)}
                loading="Loading PDF..."
                error="Failed to load PDF."
              >
                <div className={styles.pdfPageContainer}>
                  <PDFWithDropSignature
                    key={currentPage}
                    pageNumber={currentPage}
                    pdfScale={pdfScale}
                    onDropImage={(signature) =>
                      setSignatureImages((prev) => [...prev, signature])
                    }
                  >
                    {signatureImages
                      .filter((s) => s.page === currentPage)
                      .map((sig) => (
                        <div
                          key={sig.id}
                          className={`${styles.signatureWrapper} ${
                            selectedId === sig.id ? styles.selected : ""
                          }`}
                          style={{
                            left: `${sig.x * pdfScale}px`,
                            top: `${sig.y * pdfScale}px`,
                            position: "absolute",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedId(sig.id);
                          }}
                          onMouseDown={(e) => handleMouseDown(e, sig.id)}
                        >
                          <img
                            src={sig.img}
                            alt="signature"
                            className={styles.droppedSignature}
                            style={{
                              width: `${sig.width * pdfScale}px`,
                              height: `${sig.height * pdfScale}px`,
                            }}
                          />
                          <span
                            className={styles.deleteBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(sig.id);
                            }}
                          >
                            ✖
                          </span>
                        </div>
                      ))}
                  </PDFWithDropSignature>
                </div>

                <div className={styles.pageControls}>
                  <Button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span style={{ margin: "0 12px" }}>
                    Page {currentPage} of {numPages}
                  </span>
                  <Button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, numPages || prev)
                      )
                    }
                    disabled={currentPage === numPages}
                  >
                    Next
                  </Button>
                </div>
              </Document>
            )}

          {documentData?.savedName
            ?.toLowerCase()
            .match(/\.(jpg|jpeg|png)$/) && (
            <div className={styles.imageWrapper} ref={previewRef}>
              <img
                src={`http://localhost:5000/uploads/signed/${documentData.savedName}`}
                alt="Document"
                width={600}
                style={{ display: "block", maxWidth: "100%" }}
              />
              {signatureImages
                .filter((s) => s.page === 1)
                .map((sig) => (
                  <div
                    key={sig.id}
                    className={`${styles.signatureWrapper} ${
                      selectedId === sig.id ? styles.selected : ""
                    }`}
                    style={{
                      left: `${sig.x}px`,
                      top: `${sig.y}px`,
                      position: "absolute",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedId(sig.id);
                    }}
                    onMouseDown={(e) => handleMouseDown(e, sig.id)}
                  >
                    <img
                      src={sig.img}
                      alt="signature"
                      className={styles.droppedSignature}
                    />
                    <span
                      className={styles.deleteBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSignatureImages((prev) =>
                          prev.filter((img) => img.id !== sig.id)
                        );
                      }}
                    >
                      ✖
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.sidebar}>
        <SignArea onConfirm={handleSignatureConfirm} />
        <Button onClick={handleFinalizeSigning}>Sign and Save</Button>
      </div>
    </div>
  );
};

export default SignaturePage;
