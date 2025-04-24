import React, { useState, useRef } from "react";
import styles from "./SignDocumentPage.module.css";
import { useLocation } from "react-router-dom";
import { useDrop, useDrag } from "react-dnd";

const SignDocumentPage = () => {
  const { state } = useLocation();
  const { document } = state || {};
  const fileUrl = `http://localhost:5000/uploads/${document?.savedName}`;
  const previewRef = useRef<HTMLDivElement | null>(null);

  const [mode, setMode] = useState<"drag" | "manual">("drag");
  const [signatureFields, setSignatureFields] = useState<any[]>([]);
  const [signatureWidth, setSignatureWidth] = useState("120");
  const [signatureHeight, setSignatureHeight] = useState("40");
  const [signatureColor, setSignatureColor] = useState("#d1c488");
  const [manualLeft, setManualLeft] = useState("100");
  const [manualTop, setManualTop] = useState("100");
  const [selectedId, setSelectedId] = useState<number | null>(null);

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
          },
        ]);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const handleManualAdd = () => {
    const id = Date.now();
    setSignatureFields((prev) => [
      ...prev,
      {
        id,
        left: parseInt(manualLeft),
        top: parseInt(manualTop),
        width: signatureWidth,
        height: signatureHeight,
        color: signatureColor,
        source: "manual",
      },
    ]);
  };

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
          {document?.type === "application/pdf" ? (
            <iframe
              src={fileUrl}
              className={styles.pdfViewer}
              title="Document"
            />
          ) : (
            <img src={fileUrl} className={styles.imageViewer} alt="Document" />
          )}

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
              title="Click to edit or drag"
            >
              <span
                className={styles.deleteBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  removeField(field.id);
                }}
                title="Delete"
              >
                ✖
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.sidebar}>
        <h3>Signature Mode</h3>
        <div className={styles.modeButtons}>
          <button onClick={() => setMode("drag")}>Drag & Drop</button>
          <button onClick={() => setMode("manual")}>Manual</button>
        </div>

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

          {mode === "manual" && selectedId === null && (
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

              <button onClick={handleManualAdd} className={styles.addField}>
                Add Signature Field
              </button>
            </>
          )}
        </div>

        <button
          className={styles.resetBtn}
          onClick={() => {
            setSignatureWidth("120");
            setSignatureHeight("40");
            setSignatureColor("#62c4c3");
            setManualLeft("100");
            setManualTop("100");
          }}
        >
          Reset
        </button>

        <button className={styles.sendBtn}>Send for Signature</button>
      </div>
    </div>
  );
};

export default SignDocumentPage;
