"use client";

import React from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const PdfViewer = ({ fileUrl }: { fileUrl: string }) => {
  const pageWidth = 400; // Sesuaikan lebar halaman

  console.log("fileUrl:", fileUrl);

  return (
    <div
      style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}
    >
      <Document file={fileUrl}>
        <Page pageNumber={1} width={pageWidth} />
      </Document>
    </div>
  );
};

export default PdfViewer;
