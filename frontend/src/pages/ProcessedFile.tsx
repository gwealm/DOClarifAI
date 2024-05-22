import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useAuth } from "../components/auth/Auth";
import { useParams } from 'react-router-dom';

import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ProcessedFile = () => {
  const auth = useAuth();
  const { workflowId, fileId } = useParams();

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedFieldKey, setSelectedFieldKey] = useState(null);
  const [selection, setSelection] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [startCoords, setStartCoords] = useState(null);
  const [fields, setFields] = useState({
    customerName: { type: "Text", value: "John Doe", x: 0, y: 0, w: 1, h: 1 },
    totalAmount:  { type: "Currency", value: 100.0, x: 0, y: 0.5, w: 1, h: 0.5 },
    invoiceDate:  { type: "Date", value: new Date(), x: 0, y: 0.5, w: 1, h: 0.5 }
  });
  const docViewerRef = useRef(null);

  useEffect(() => {
    // Download the PDF file
    fetchPdf();
  }, []);

  const fetchPdf = async () => {
    try {
      const url = `http://localhost:8085/${workflowId}/file/${fileId}/original-file`;
      console.log(url)
      const response = await auth.fetch(url, {
        method: "GET"
      });

      const blob = await response.blob();
      setDocument(blob);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const [document, setDocument] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const goToPrevPage = () =>
    setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);

  const goToNextPage = () =>
    setPageNumber(
      pageNumber + 1 >= numPages ? numPages : pageNumber + 1
    );

  const handleFieldSelection = (fieldKey) => {
    setSelectedFieldKey(fieldKey);
    const field = fields[fieldKey];

    const canvas = docViewerRef.current.querySelector(
      ".react-pdf__Page__canvas"
    );
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    const relX = field.x * rect.width;
    const relY = field.y * rect.height;
    const relW = field.w * rect.width;
    const relH = field.h * rect.height;

    setSelection({ x: relX, y: relY, w: relW, h: relH });
  };

  const getMousePos = (event) => {
    const canvas = docViewerRef.current.querySelector(
      ".react-pdf__Page__canvas"
    );
    if (!canvas) return { relX: 0, relY: 0 };

    const rect = canvas.getBoundingClientRect();

    return {
      relX: event.clientX - rect.left,
      relY: event.clientY - rect.top,
    };
  };

  const handleMouseDown = (event) => {
    if (!selectedFieldKey) return;
    const { relX, relY } = getMousePos(event);
    setStartCoords({ x: relX, y: relY });
    setIsSelecting(true);
  };

  const handleMouseMove = (event) => {
    if (!isSelecting || !selectedFieldKey) return;
    const { relX, relY } = getMousePos(event);
    const minX = Math.min(startCoords.x, relX);
    const minY = Math.min(startCoords.y, relY);
    const width = Math.abs(startCoords.x - relX);
    const height = Math.abs(startCoords.y - relY);

    setSelection({ x: minX, y: minY, w: width, h: height });
  };

  const handleMouseUp = (event) => {
    if (!isSelecting || !selectedFieldKey) return;
    const { relX, relY } = getMousePos(event);
    const topLeftX = Math.min(startCoords.x, relX);
    const topLeftY = Math.min(startCoords.y, relY);
    const width = Math.abs(startCoords.x - relX);
    const height = Math.abs(startCoords.y - relY);
  
    setIsSelecting(false);
  
    const canvas = docViewerRef.current.querySelector(
      ".react-pdf__Page__canvas"
    );
    if (!canvas) return;
  
    const rect = canvas.getBoundingClientRect();
  
    const x = topLeftX / rect.width;
    const y = topLeftY / rect.height;
    const w = width / rect.width;
    const h = height / rect.height;
  
    const updatedField = {
      ...fields[selectedFieldKey],
      x,
      y,
      w,
      h,
    };
  
    setFields({
      ...fields,
      [selectedFieldKey]: updatedField,
    });

    console.log("Selection coordinates:", { x, y, w, h, pageNumber });
  };

  const renderInputByType = (field) => {
    switch (field.type) {
      case "Text":
        return (
          <input
            type="text"
            value={field.value}
            onChange={handleFieldValueChange}
            className="border border-gray-400 px-2 py-1"
          />
        );
      case "Currency":
        return (
          <input
            type="number"
            value={field.value}
            onChange={handleFieldValueChange}
            className="border border-gray-400 px-2 py-1"
          />
        );
      case "Date":
        return (
          <input
            type="date"
            value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value}
            onChange={handleFieldValueChange}
            className="border border-gray-400 px-2 py-1"
          />
        );
      default:
        return (
          <input
            type="text"
            value={field.value}
            onChange={handleFieldValueChange}
            className="border border-gray-400 px-2 py-1"
          />
        );
    }
  };

  const handleFieldValueChange = (event) => {
    const field = fields[selectedFieldKey];
    const updatedField = {
      ...field,
      value: event.target.value
    };
    setFields({
      ...fields,
      [selectedFieldKey]: updatedField,
    });
  };

  return (
    <div className="flex w-full mx-32 my-8">
      <div className="w-1/2 mr-4">
        <div className="relative border border-gray-300 rounded-md mb-4 inline-block">
          <Document file={document} onLoadSuccess={onDocumentLoadSuccess}>
            <div
              id="docviewer"
              ref={docViewerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              <Page
                pageNumber={pageNumber}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
              {selection && (
                <div
                  style={{
                    position: "absolute",
                    border: "2px solid blue",
                    top: selection.y,
                    left: selection.x,
                    width: selection.w,
                    height: selection.h,
                  }}
                ></div>
              )}
            </div>
          </Document>
        </div>
        <div className="flex justify-between items-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={goToPrevPage}
            disabled={pageNumber === 1}
          >
            Prev
          </button>
          <p className="text-gray-700">
            Page {pageNumber} of {numPages}
          </p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={goToNextPage}
            disabled={pageNumber === numPages}
          >
            Next
          </button>

        </div>
      </div>
      <div className="w-1/2">
        <div>
          <h2>Fields</h2>
          <ul>
            {Object.keys(fields).map((fieldKey, index) => {
              const field = fields[fieldKey];
              return (
                <li key={index} className="mb-2">
                  <span className="mr-2">{fieldKey}: </span>
                  {selectedFieldKey === fieldKey ? (
                    renderInputByType(field)
                  ) : (
                    <span>{field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value}</span>
                  )}
                  <button
                    onClick={() => handleFieldSelection(fieldKey)}
                    className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Edit
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProcessedFile;
