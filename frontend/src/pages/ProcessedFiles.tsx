import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProcessedFileCard from '../components/ProcessedFileCard';
import { faPenToSquare, faFloppyDisk} from '@fortawesome/free-regular-svg-icons';

function ProcessedFiles() {
  const [files, setUploadedFiles] = useState([]);

  const handleDeleteFiles = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setUploadedFiles(updatedFiles);
  };

  const handleDownloadFiles = (id) => {
    const url = 'http://localhost:8082/export-document-excel?document_id=' + id;
    fetch(url, {
      method: 'GET',
      mode: 'cors',
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'document.xlsx');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
      });
  }

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    const url = 'http://localhost:8082/list-documents';
    fetch(url, {
      method: 'GET',
      mode: 'cors',
    })
      .then((response) => response.json())
      .then((data) => {
        setUploadedFiles(data);
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
      });
  };

  return (
    <div className='w-full h-full bg-white p-8'>
    <div className="mx-20 my-5">
       <div className="flex max-w-8xl items-center justify-between pl-6 mb-4">
      <div className="flex lg:flex-1 items-center">
      <h2 className="text-lg font-semibold text-black">Processed Files </h2>
            <FontAwesomeIcon icon={faPenToSquare} className="ml-4" /> 
        </div>
        <div className="flex lg:flex justify-left">
        <button className="text-sm font-semibold leading-6 text-white flex items-center px-4 py-2 rounded-md bg-[#5583C5] bg-opacity-80 border border-gray-300 hover:bg-opacity-50 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200">
              Save Changes
              <FontAwesomeIcon icon={faFloppyDisk} className="ml-2" style={{ fontSize: '24px' }} />
        </button>

      </div></div>


      <div className="border-2 rounded-lg p-5 flex flex-col justify-between min-h-[600px]">
        <div>
        <div className="flex max-w-8xl items-center justify-between pl-6 mb-4">
            <div className="flex lg:flex-1">
                <h2 className="text-lg font-semibold text-black">Name</h2>
            </div>
            <div className="flex lg:flex-1 justify-left">
                <h2 className="text-lg font-semibold text-black">Last Modified</h2>
            </div>
        </div>


          <div className="border-b border-blue-200 mb-4"></div>

          {files.map((file, index) => (
            <ProcessedFileCard key={index} id={file.id} index={index} name={file.filename} date={file.timestamp} onDelete={handleDeleteFiles} onDownload={handleDownloadFiles} />
          ))}
        </div>

        <div className="flex justify-center space-x-3 pt-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            View logs
          </button>
          <button className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Start Workflow
          </button>
          <button className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Stop Workflow
          </button>
        </div>
      </div>
    </div></div>
  );
}

export default ProcessedFiles;
