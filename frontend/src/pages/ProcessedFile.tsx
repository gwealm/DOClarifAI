import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useAuth } from "../components/auth/Auth";
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk } from '@fortawesome/free-regular-svg-icons';

import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ProcessedFile = () => {
  const auth = useAuth();
  const { workflowId, fileId } = useParams();

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedFieldLevel, setSelectedFieldLevel] = useState(null);
  const [selectedOuterFieldIdx, setSelectedOuterFieldIdx] = useState(null);
  const [selectedInnerFieldIdx, setSelectedInnerFieldIdx] = useState(null);
  const [selection, setSelection] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [startCoords, setStartCoords] = useState(null);
  const [fields, setFields] = useState(
    {
        "headerFields": [],
        "lineItems": []
    }
  );
  const docViewerRef = useRef(null);

  useEffect(() => {
    fetchExtractedInformation();
    fetchDocument();
  }, []);

  const fetchDocument = async () => {
    try {
      const url = `http://localhost:8085/${workflowId}/file/${fileId}/original-file`;
      const response = await auth.fetch(url, {
        method: "GET"
      });

      const blob = await response.blob();
      setDocument(blob);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const fetchExtractedInformation = async () => {
    const url = `http://localhost:8085/${workflowId}/file/${fileId}/results`;
    await auth.fetch(url, {
        method: "GET"
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        setFields(data["extraction"]);
    })
    .catch((error) => {
        console.error(`Error: ${error}`);
    });
  }

  const postGroundTruth = async () => {
    const url = `http://localhost:8085/${workflowId}/file/${fileId}/ground-truth/`;
    const data = {
        extraction: fields
    }
    const res = await auth.fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    const json_res = await res.json();
    if (res.ok) {
        console.log("Saved ground truth succesfully");
    } else {
        console.error("Failed saving ground truth with error",json_res.detail)
    }
  }

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

  const handleFieldSelection = (selectedFieldLevel,selectedOuterFieldIdx,selectedInnerFieldIdx) => {
    setSelectedFieldLevel(selectedFieldLevel);
    setSelectedOuterFieldIdx(selectedOuterFieldIdx);
    setSelectedInnerFieldIdx(selectedInnerFieldIdx);

    let field = fields[selectedFieldLevel][selectedOuterFieldIdx];
    if(selectedInnerFieldIdx !== null)
        field = field[selectedInnerFieldIdx]

    const canvas = docViewerRef.current.querySelector(
      ".react-pdf__Page__canvas"
    );
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    const relX = field.coordinates.x * rect.width;
    const relY = field.coordinates.y * rect.height;
    const relW = field.coordinates.w * rect.width;
    const relH = field.coordinates.h * rect.height;

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
    if (selectedOuterFieldIdx===null|| selectedFieldLevel===null) return;
    const { relX, relY } = getMousePos(event);
    setStartCoords({ x: relX, y: relY });
    setIsSelecting(true);
  };

  const handleMouseMove = (event) => {
    if (!isSelecting || selectedOuterFieldIdx===null|| selectedFieldLevel===null) return;
    const { relX, relY } = getMousePos(event);
    const minX = Math.min(startCoords.x, relX);
    const minY = Math.min(startCoords.y, relY);
    const width = Math.abs(startCoords.x - relX);
    const height = Math.abs(startCoords.y - relY);

    setSelection({ x: minX, y: minY, w: width, h: height });
  };

  const handleMouseUp = (event) => {
    if (!isSelecting || selectedOuterFieldIdx===null|| selectedFieldLevel===null) return;
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

    let field = fields[selectedFieldLevel][selectedOuterFieldIdx]
    if(selectedInnerFieldIdx !== null)
        field = field[selectedInnerFieldIdx]
    const updatedField = {
      ...field,
      coordinates:{
        x,
        y,
        w,
        h,
      }
    };
    if(selectedInnerFieldIdx === null)
        fields[selectedFieldLevel][selectedOuterFieldIdx] = updatedField
    else
        fields[selectedFieldLevel][selectedOuterFieldIdx][selectedInnerFieldIdx] = updatedField

    setFields(fields);
  };

  const renderInputByType = (fieldLevel,outerFieldIdx,innerFieldIdx) => {
    let field = fields[fieldLevel][outerFieldIdx];
    if(innerFieldIdx!==null)
        field = field[innerFieldIdx]
    switch (field.type) {
      case "string":
        return (
          <input
            type="text"
            value={field.value}
            onChange={handleFieldValueChange}
            className="border border-gray-400 px-2 py-1"
          />
        );
      case "number":
        return (
          <input
            type="number"
            value={field.value}
            onChange={handleFieldValueChange}
            className="border border-gray-400 px-2 py-1"
          />
        );
      case "date":
        return (
          <input
            type="date"
            value={field.value}
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
    let updatedField;
    let updatedFields = {...fields};
    if(selectedInnerFieldIdx !== null)
        updatedField = {... fields[selectedFieldLevel][selectedOuterFieldIdx][selectedInnerFieldIdx] };
    else 
        updatedField = {... fields[selectedFieldLevel][selectedOuterFieldIdx]};

    updatedField = {
        ...updatedField,
        value:event.target.value
    };
    if(selectedInnerFieldIdx !== null)
        updatedFields[selectedFieldLevel][selectedOuterFieldIdx][selectedInnerFieldIdx]  = updatedField
    else
        updatedFields[selectedFieldLevel][selectedOuterFieldIdx] = updatedField

    setFields(updatedFields);
  };

  return (
        <div className="flex justify-center mx-32 my-8">
        <button
            onClick={postGroundTruth}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded h-16 mx-6"
        >
            <FontAwesomeIcon icon={faFloppyDisk} className="mr-2" />
            Save Changes
        </button>
          <div className="relative mr-32">
            <div className="relative border border-gray-300 rounded-md mb-4 inline-block">
              {
                document && (
                  document.type === 'application/pdf' ? (
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
                  ) : (
                    <div
                      id="docviewer"
                      ref={docViewerRef}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                    >
                      <canvas
                        className="react-pdf__Page__canvas"
                        dir="ltr"
                        width="595"
                        height="841"
                        style={{ display: "block", userSelect: "none", width: "595px", height: "841px" }}
                      ></canvas>
                      <img
                        src={URL.createObjectURL(document)}
                        alt="Document"
                        style={{ display: "none" }}
                        onLoad={() => {
                          const img = new Image();
                          img.src = URL.createObjectURL(document);
                          const canvas = docViewerRef.current.querySelector(
                            ".react-pdf__Page__canvas"
                          );
                          const ctx = canvas.getContext("2d");
                          img.onload = () => {
                            canvas.width = img.width;
                            canvas.height = img.height;
                            ctx.drawImage(img, 0, 0);
                          };
                        }}
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
                  )
                )
              }
    
            </div>
            {document && document.type === 'application/pdf' && (
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
            )}
          </div>
          <div>
            <div>
              <h2>Header fields</h2>
              <ul className="divide-y divide-gray-300">
                {fields["headerFields"].map((field, index) => {
                  return (
                    <li key={"headerField" + "-" + index} className="mb-2">
                        <div>
                      <span className="mr-2">{field.name}: </span>
                      {selectedFieldLevel === "headerFields" && selectedOuterFieldIdx === index ? (
                        renderInputByType("headerFields", index, null)
                      ) : (
                        <span>{field.value}</span>
                      )}
                      <button
                        onClick={() => handleFieldSelection("headerFields", index, null)}
                        className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                      >
                        Edit
                      </button>
                      </div>
                      <p>Confidence: {Math.round(field.confidence*100 * 100) / 100}%</p>

                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <h2>Line items</h2>
              <div>
                {fields["lineItems"].map((lineItemList, lineItemListIdx) => (
                  <ul key={"lineItem" + "-" + lineItemListIdx} className="divide-y divide-gray-300 mb-4">
                    <p>Line item {lineItemListIdx + 1}</p>
                    {lineItemList.map((lineItem, lineItemIdx) => {
                      return (
                        <li key={"lineItem" + "-" + lineItemListIdx + "-" + lineItemIdx} className="mb-2">
                            <div>
                          <span className="mr-2">{lineItem.name}: </span>
                          {selectedFieldLevel === "lineItems" && selectedOuterFieldIdx === lineItemListIdx && selectedInnerFieldIdx == lineItemIdx ? (
                            renderInputByType("lineItems", lineItemListIdx, lineItemIdx)
                          ) : (
                            <span>{lineItem.value}</span>
                          )}
                          <button
                            onClick={() => handleFieldSelection("lineItems", lineItemListIdx, lineItemIdx)}
                            className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                          >
                            Edit
                          </button>
                            </div>
                            <p>Confidence: {Math.round(lineItem.confidence * 100 * 100) / 100}%</p>
                        </li>
                      );
                    })}
                  </ul>
                ))}
              </div>
            </div>
          </div>
        </div>
  );
};

export default ProcessedFile;
