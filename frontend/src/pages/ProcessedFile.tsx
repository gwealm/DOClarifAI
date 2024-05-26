/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useAuth } from "../components/auth/Auth";
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { faFloppyDisk } from '@fortawesome/free-regular-svg-icons';
import DeleteFieldModal from "../components/DeleteFieldModal";

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
  const [schema, setSchema] = useState(null);
  const [missingHeaderFields, setMissingHeaderFields] = useState([]);
  const [, setMissingLineFields] = useState([]);

  const FieldComponent = ({ index, item, onAdd }) => {
    return (
      <div onClick={()=>onAdd(index,item)} key={"lineItem" + "-" + index} className="w-full px-4 py-2 text-left border border-blue-300 rounded-lg mb-2">
        <span className="text-gray-700 text-sm">
          {item.name}
        </span>
      </div >
    );
  }

  const AddFieldsComponent = ({ title, fields, onAdd }) => {
    const [toggle, setToggle] = useState<boolean>(false);
    return (<div className="border-2 border-blue-300 rounded-lg my-5 mx-6">
      <button
        onClick={() => setToggle((t) => !t)}
        className="w-full px-4 py-2 text-left bg-[#C8EDFD] bg-opacity-70 hover:bg-opacity-30 rounded-t-lg"
      >
        <div className="flex justify-between items-center">
          <span className="text-gray-700">
            {title} ({fields.length})
          </span>
          <svg
            className={`h-5 w-5 transform transition-transform ${toggle ? 'rotate-180' : ''
              }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </button>
      {toggle && (
        <div className="grid grid-cols-2 gap-2 m-2 max-h-[200px] overflow-y-auto overflow-x-hidden">
          {fields.map((item, i) => <FieldComponent index={i} item={item} onAdd={onAdd} />)} </div>
      )}
    </div>);
  }

  const AddHeaderFieldComponent = () => {
    const onAdd = (index, item) => {
      const newFields = structuredClone(fields);
      const toSend = {
        name: item.name,
        type: item.formattingType,
        value: "",
        confidence: 0,
        page: pageNumber,
        coordinates: { x: 0, y: 0, w: 0, h: 0 },

      }
      newFields.headerFields.push(toSend);
      setFields(newFields);
      setMissingHeaderFields(missingHeaderFields.filter(e => e.name != item.name));
    }
    return <AddFieldsComponent onAdd={onAdd} title={"Add Missing Header Fields"} fields={missingHeaderFields} />
  }
  const AddLineItemsFieldComponent = () => {
    const onAdd = (index, item) => {
      const newFields = structuredClone(fields);
      newFields.lineItems.push([]);
      setFields(newFields);
    }
    return (
      <button
          onClick={onAdd}
          className=" px-4 py-2 text-left bg-blue-400 hover:bg-blue-300 rounded-lg"
        >
          <div className="flex justify-between items-center">
            <span className="text-white text-sm">
              Add New Line Item
            </span>
          </div>
        </button>
    );
  }
  const AddInsideLineComponent = (lineIndex) => {
    const lineIndexIndex = lineIndex.index
    const calculateMissingFields = () => {
      let possibleFields = [];
      if (schema !== null && schema["lineItemFields"] !== null) {
        possibleFields = schema["lineItemFields"];
      }
      const actualFields = fields.lineItems[lineIndexIndex];
      const actualFieldNames = actualFields.map(f => f.name);
      return possibleFields.filter(f => !actualFieldNames.includes(f.name));
    }
    const [lineMissingFields, setLineMissingFields] = useState(calculateMissingFields());

    const onAdd = (index, item) => {

      const newFields = structuredClone(fields);
      const toSend = {
        "name": item.name,
        "category": "details",
        "value": "",
        "type": item.formattingType,
        "page": 0,
        "confidence": 0,
        "coordinates": { "x": 0, "y": 0, "w": 0, "h": 0 }
      };

      newFields.lineItems[lineIndexIndex].push(toSend);
      setFields(newFields);
      setLineMissingFields(calculateMissingFields());
    }

    if (lineMissingFields.length > 0)
      return <AddFieldsComponent title={"Add New Field"} fields={lineMissingFields} onAdd={onAdd} />

  }
  const docViewerRef = useRef(null);

  useEffect(() => {
    fetchExtractedInformation();
    fetchDocument();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDocument = async () => {
    try {
      const url = `/workflowmanagement/${workflowId}/file/${fileId}/original-file`;
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
    const url = `/workflowmanagement/${workflowId}/file/${fileId}/results`;
    await auth.fetch(url, {
      method: "GET"
    })
      .then((response) => response.json())
      .then((data) => {
        setSchema(data["schema"]);
        console.log(data);
        setFields(data["extraction"]);
        const headerFieldNames = data["extraction"]["headerFields"].map(f => f.name);
        setMissingHeaderFields(data["schema"]["headerFields"].filter(f => !headerFieldNames.includes(f.name)));
        setMissingLineFields(data["schema"]["lineItemFields"]);
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
      });
  }

  const postGroundTruth = async () => {
    const url = `/workflowmanagement/${workflowId}/file/${fileId}/ground-truth`;
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
      console.error("Failed saving ground truth with error", json_res.detail)
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

  const handleFieldSelection = (selectedFieldLevel, selectedOuterFieldIdx, selectedInnerFieldIdx) => {
    setSelectedFieldLevel(selectedFieldLevel);
    setSelectedOuterFieldIdx(selectedOuterFieldIdx);
    setSelectedInnerFieldIdx(selectedInnerFieldIdx);

    let field = fields[selectedFieldLevel][selectedOuterFieldIdx];
    if (selectedInnerFieldIdx !== null)
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
    if (selectedOuterFieldIdx === null || selectedFieldLevel === null) return;
    const { relX, relY } = getMousePos(event);
    setStartCoords({ x: relX, y: relY });
    setIsSelecting(true);
  };

  const handleMouseMove = (event) => {
    if (!isSelecting || selectedOuterFieldIdx === null || selectedFieldLevel === null) return;
    const { relX, relY } = getMousePos(event);
    const minX = Math.min(startCoords.x, relX);
    const minY = Math.min(startCoords.y, relY);
    const width = Math.abs(startCoords.x - relX);
    const height = Math.abs(startCoords.y - relY);

    setSelection({ x: minX, y: minY, w: width, h: height });
  };

  const handleMouseUp = (event) => {
    if (!isSelecting || selectedOuterFieldIdx === null || selectedFieldLevel === null) return;
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
    if (selectedInnerFieldIdx !== null)
      field = field[selectedInnerFieldIdx]
    const updatedField = {
      ...field,
      coordinates: {
        x,
        y,
        w,
        h,
      }
    };
    if (selectedInnerFieldIdx === null)
      fields[selectedFieldLevel][selectedOuterFieldIdx] = updatedField
    else
      fields[selectedFieldLevel][selectedOuterFieldIdx][selectedInnerFieldIdx] = updatedField

    setFields(fields);
  };

  const renderInputByType = (fieldLevel, outerFieldIdx, innerFieldIdx) => {
    let field = fields[fieldLevel][outerFieldIdx];
    if (innerFieldIdx !== null)
      field = field[innerFieldIdx]
    switch (field.type) {
      case "string":
        return (
          <input
            type="text"
            value={field.value}
            onChange={handleFieldValueChange}
            className="w-55 px-2 py-1 bg-gray-100 border-none rounded-md outline-none overflow-hidden text-ellipsis"
          />
        );
      case "number":
        return (
          <input
            type="number"
            value={field.value}
            onChange={handleFieldValueChange}
            className="w-55 px-2 py-1 bg-gray-100 border-none rounded-md outline-none overflow-hidden text-ellipsis"
          />
        );
      case "date":
        return (
          <input
            type="date"
            value={field.value}
            onChange={handleFieldValueChange}
            className="w-55 px-2 py-1 bg-gray-100 border-none rounded-md outline-none overflow-hidden text-ellipsis"
          />
        );
      default:
        return (
          <input
            type="text"
            value={field.value}
            onChange={handleFieldValueChange}
            className="w-55 px-2 py-1 bg-gray-100 border-none rounded-md outline-none overflow-hidden text-ellipsis"
          />
        );
    }
  };

  const handleFieldValueChange = (event) => {
    let updatedField;
    const updatedFields = { ...fields };
    if (selectedInnerFieldIdx !== null)
      updatedField = { ...fields[selectedFieldLevel][selectedOuterFieldIdx][selectedInnerFieldIdx] };
    else
      updatedField = { ...fields[selectedFieldLevel][selectedOuterFieldIdx] };

    updatedField = {
      ...updatedField,
      value: event.target.value
    };
    if (selectedInnerFieldIdx !== null)
      updatedFields[selectedFieldLevel][selectedOuterFieldIdx][selectedInnerFieldIdx] = updatedField
    else
      updatedFields[selectedFieldLevel][selectedOuterFieldIdx] = updatedField

    setFields(updatedFields);
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isLineItemsOpen, setIsLineItemsOpen] = useState(false);
  const [openLineItems, setOpenLineItems] = useState([]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleLineItemsDropdown = () => {
    setIsLineItemsOpen(!isLineItemsOpen);
  };

  const toggleIndividualLineItem = (index) => {
    setOpenLineItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const confidenceLevels = {
    low: 'border-l-red-500',
    medium: 'border-l-orange-500',
    high: 'border-l-green-500',
  };

  const getConfidenceLevel = (confidence) => {
    if (confidence >= 0.8) return 'high';
    if (confidence >= 0.5) return 'medium';
    return 'low';
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteFieldIndex, setDeleteFieldIndex] = useState<number | null>(null);

  const toggleDeleteModal = (index: number | null) => {
      setIsDeleteModalOpen(index !== null && !isDeleteModalOpen);
      setDeleteFieldIndex(index);
  };

  const handleDeleteField = (index) => {
    console.log("Field deleted"); 
  };

  return (
    <div className="flex justify-center mx-32 my-8">
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
      <div className="w-full max-w-xl mx-auto">
        <div className="flex items-center">
          <div>
            <span className="flex font-semibold text-xl mb-2">Extraction Confidence Range</span>
            <div className="flex items-center space-x-2 pb-2">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-8 bg-red-600 text-white flex items-center justify-center rounded-md">
                  0% - 50%
                </div>
                <div className="w-24 h-8 bg-orange-500 text-white flex items-center justify-center rounded-md">
                  51% - 79%
                </div>
                <div className="w-24 h-8 bg-green-600 text-white flex items-center justify-center rounded-md">
                  80% - 100%
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={postGroundTruth}
            className="bg-green-500 hover:bg-green-700 text-white text-sm font-bold py-2 px-4 rounded h-10 ml-14"
          >
            <FontAwesomeIcon icon={faFloppyDisk} className="mr-2" />
            Save Changes
          </button>
        </div>

        {/* Header Fields Dropdown */}
        <div className="border border-blue-300 rounded-lg my-5">
          <button
            onClick={toggleDropdown}
            className="w-full px-4 py-2 text-left bg-[#C8EDFD] hover:bg-opacity-50 rounded-t-lg"
          >
            <div className="flex justify-between items-center">
              <span className="text-gray-700 text-lg">Header Fields ({fields.headerFields.length})</span>
              <svg
                className={`h-5 w-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </button>
          {isOpen && (
            <>
              <ul className="p-4 bg-white border-t border-blue-300 divide-y divide-gray-300 max-h-[450px] overflow-y-auto overflow-x-hidden">
                {fields.headerFields.map((field, index) => {
                  const confidenceLevel = getConfidenceLevel(field.confidence);
                  return (
                    <div key={index} className="relative">
                        <li className="py-2 flex items-center" onClick={() => toggleDeleteModal(index)}>
                            <div className={`flex-1 pl-4 p-2 border-l-4 ${confidenceLevels[confidenceLevel]} bg-opacity-20`}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-gray-700">{field.name}:</span>
                                    <div className="flex items-center justify-end ml-auto bg-white border border-gray-300 rounded-md px-2 py-1">
                                        {selectedFieldLevel === "headerFields" && selectedOuterFieldIdx === index ? (
                                            renderInputByType("headerFields", index, null)
                                        ) : (
                                            <input
                                                type="text"
                                                value={field.value}
                                                readOnly
                                                className="w-55 px-2 py-1 bg-white border-none outline-none overflow-hidden text-ellipsis"
                                            />
                                        )}
                                        <FontAwesomeIcon
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleFieldSelection("headerFields", index, null);
                                            }}
                                            icon={faPenToSquare}
                                            className="ml-2 cursor-pointer text-blue-500"
                                        />
                                    </div>
                                </div>
                                <p className="text-gray-500 text-xs text-left">Confidence: {Math.round(field.confidence * 100 * 100) / 100}%</p>
                            </div>
                        </li>
                        {deleteFieldIndex === index && isDeleteModalOpen && (
                            <DeleteFieldModal
                                onClose={() => toggleDeleteModal(null)}
                                onDelete={() => handleDeleteField(index)}
                            />
                        )}
                    </div>
                  );
                })}
              </ul>
              <AddHeaderFieldComponent />
            </>
          )}
        </div>

        {/* Line Items Dropdown */}
        <div className="border border-blue-300 rounded-lg my-5">
          <button
            onClick={toggleLineItemsDropdown}
            className="w-full px-4 py-2 text-left bg-[#C8EDFD] hover:bg-opacity-50 rounded-t-lg"
          >
            <div className="flex justify-between items-center">
              <span className="text-gray-700 text-lg">
                Line Items ({fields.lineItems.length})
              </span>
              <svg
                className={`h-5 w-5 transform transition-transform ${isLineItemsOpen ? 'rotate-180' : ''
                  }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </button>
          {isLineItemsOpen && (
            <div className="p-4 bg-white border-t border-blue-300 divide-y divide-gray-300 max-h-[450px] overflow-y-auto">
              {fields["lineItems"].map((lineItemList, lineItemListIdx) => (
                <div key={"lineItem" + "-" + lineItemListIdx}>
                  <button
                    onClick={() => toggleIndividualLineItem(lineItemListIdx)}
                    className="w-full px-4 py-2 text-left bg-blue-100 hover:bg-opacity-70 rounded-lg my-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">
                        Line Item {lineItemListIdx + 1}
                      </span>
                      <svg
                        className={`h-5 w-5 transform transition-transform ${openLineItems.includes(lineItemListIdx)
                          ? 'rotate-180'
                          : ''
                          }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </button>
                  {openLineItems.includes(lineItemListIdx) && (
                    <>
                      <ul className="divide-y divide-gray-300 mb-4">
                        {lineItemList.map((lineItem, lineItemIdx) => {
                          const confidenceLevel = getConfidenceLevel(
                            lineItem.confidence
                          );
                          return (
                            <li
                              key={"lineItem" + "-" + lineItemListIdx + "-" + lineItemIdx}
                              className="py-2 flex items-start"
                            >
                              <div
                                className={`flex-1 pl-4 p-2 border-l-4 ${confidenceLevels[confidenceLevel]} bg-opacity-20`}
                              >
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-gray-700">
                                    {lineItem.name}:
                                  </span>
                                  <div className="flex items-center justify-end ml-auto bg-white border border-gray-300 rounded-md px-2 py-1">
                                    {selectedFieldLevel === "lineItems" && selectedOuterFieldIdx === lineItemListIdx && selectedInnerFieldIdx == lineItemIdx ? (
                                      renderInputByType("lineItems", lineItemListIdx, lineItemIdx)
                                    ) : (
                                      <input
                                        type="text"
                                        value={lineItem.value}
                                        readOnly
                                        className="w-55 px-2 py-1 bg-white border-none outline-none overflow-hidden text-ellipsis"
                                      />
                                    )}
                                    <FontAwesomeIcon
                                      onClick={() =>
                                        handleFieldSelection(
                                          'lineItems',
                                          lineItemListIdx,
                                          lineItemIdx
                                        )
                                      }
                                      icon={faPenToSquare}
                                      className="ml-2 cursor-pointer text-blue-500"
                                    />
                                  </div>
                                </div>
                                <p className="text-gray-500 text-xs text-left">
                                  Confidence:{' '}
                                  {Math.round(lineItem.confidence * 100)}%
                                </p>
                              </div>
                            </li>
                          );
                        })}

                      </ul>
                      <AddInsideLineComponent index={lineItemListIdx} />
                    </>
                  )}
                </div>
              ))}
              <AddLineItemsFieldComponent />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProcessedFile;
