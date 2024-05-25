import React, { useState, useEffect, useCallback } from 'react';
import ProcessedFileCard from '../components/ProcessedFileCard';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from "../components/auth/Auth";

function ProcessedFiles() {
  const auth = useAuth();
  const [files, setUploadedFiles] = useState([]);
  const { id } = useParams();

  const handleDownloadFiles = (id) => {
    const url = '/exporter/documents/' + id + '/xlsx';
    auth.fetch(url, {
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

  const fetchDocuments = useCallback(async () => {
    const url = '/exporter/documents/' + id;
    auth.fetch(url, {
      method: 'GET',
      mode: 'cors',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setUploadedFiles(data);
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
      });
  }, [auth, id]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return (
    <div className='w-full h-full bg-white p-8'>
    <div className="mx-20 my-5">
      <div className="flex max-w-8xl items-center justify-between pl-6 mb-4">
        <div className="flex lg:flex-1 items-center">
          <Link to={`/workflow/${id}`} className="mr-4" style={{ fontSize: '1.5rem' }}>
            &larr;
          </Link>
          <h2 className="text-lg font-semibold text-black">Processed Files</h2>
        </div>
      </div>

      <div className="border-2 rounded-lg p-5 flex flex-col justify-between min-h-[600px]">
        <div>
          <div className="flex max-w-8xl items-center justify-between pl-6 mb-4">
            <div className="flex lg:flex-1 justify-left">
              <h2 className="text-lg font-semibold text-black">Name</h2>
            </div>
            <div className="flex lg:flex-1 justify-left">
              <h2 className="text-lg font-semibold text-black">Last Modified</h2>
            </div>
            <div className="flex lg:flex-1 justify-left">
              <h2 className="text-lg font-semibold text-black">File Status</h2>
            </div>
          </div>

          <div className="border-b border-blue-200 mb-4"></div>

          {files.map((file, index) => (
            <ProcessedFileCard key={index} dox_id={file.dox_id} index={index} name={file.name} date={file.uploaded_at} processed_status={file.process_status} onDownload={handleDownloadFiles} />
          ))}
        </div>
      </div>
    </div></div>
  );
}

export default ProcessedFiles;
