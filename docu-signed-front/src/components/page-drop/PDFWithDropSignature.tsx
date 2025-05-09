import React, { useRef } from "react";
import { Page } from "react-pdf";
import { useDrop } from "react-dnd";

const PDFWithDropSignature = ({
  pageNumber,
  pdfScale,
  onDropImage,
  children,
}: {
  pageNumber: number;
  pdfScale: number;
  onDropImage: (signature: {
    id: number;
    img: string;
    x: number;
    y: number;
    width: number;
    height: number;
    page: number;
  }) => void;
  children?: React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop(() => ({
    accept: "signature-img",
    drop: (item: any, monitor) => {
      const offset = monitor.getClientOffset();
      const container = ref.current;
      if (offset && container && item.image) {
        const rect = container.getBoundingClientRect();
        const x = (offset.x - rect.left) / pdfScale;
        const y = (offset.y - rect.top) / pdfScale - 30;
        const id = Date.now();
        const width = 130;
        const height = 50;

        onDropImage({
          id,
          img: item.image,
          x,
          y,
          width,
          height,
          page: pageNumber,
        });
      }
    },
  }));
  drop(ref);
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <Page
        pageNumber={pageNumber}
        scale={pdfScale}
        renderTextLayer={false}
        renderAnnotationLayer={false}
      />
      {children}
    </div>
  );
};
export default PDFWithDropSignature;
