// components/PDFPageWithDrop.tsx
import React, { useRef } from "react";
import { Page } from "react-pdf";
import { useDrop } from "react-dnd";

const PDFPageWithDrop = ({
  pageNumber,
  pdfScale,
  onDropField,
  children,
}: {
  pageNumber: number;
  pdfScale: number;
  onDropField: (pos: { left: number; top: number; page: number }) => void;
  children?: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop(() => ({
    accept: "signature",
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const container = containerRef.current;

      if (offset && container) {
        const containerRect = container.getBoundingClientRect();
        const x = (offset.x - containerRect.left) / pdfScale;
        const y = (offset.y - containerRect.top) / pdfScale;

        onDropField({ left: x, top: y, page: pageNumber });
      }
    },
  }));
  drop(containerRef);
  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <Page
        pageNumber={pageNumber}
        scale={pdfScale}
        renderAnnotationLayer={false}
        renderTextLayer={false}
      />
      {children}
    </div>
  );
};

export default PDFPageWithDrop;
