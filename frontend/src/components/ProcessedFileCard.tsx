import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';

const ProcessedFileCard = ({ index, fileId, workflowId, dox_id, name, date, processed_status, onDownload }) => {
    const FileProcessingStatus = {
        0: 'Upload Queued',
        1: 'Upload Processing',
        2: 'Upload Failed',
        3: 'Successful Upload',
    };

    const handleDownloadClick = (e) => {
        e.stopPropagation();
        onDownload(dox_id);
    };

    return (
        <div className="relative grid grid-cols-4 gap-x-4 bg-[#C8EDFD] bg-opacity-50 my-3 p-6 rounded-lg items-center">
            <div>
                <p className="text-lg font-semibold text-black">{name}</p>
            </div>
            <div>
                <p className="text-lg text-black">{new Date(date).toLocaleString()}</p>
            </div>
            <div>
                <p className="text-lg text-black">{FileProcessingStatus[processed_status]}</p>
            </div>
            <div className="flex justify-end items-center">
                {processed_status === 2  && (
                <>
                    <Link
                        to={`/workflow/${workflowId}/processed-files/${fileId}`}
                        className="mr-12 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Results
                    </Link>
                </>
                )}
                {processed_status === 3 && (
                    <>
                    <Link
                        to={`/workflow/${workflowId}/processed-files/${fileId}`}
                        className="mr-12 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Results
                    </Link>
                        <div className="ml-12 cursor-pointer" onClick={handleDownloadClick}>
                            <FontAwesomeIcon icon={faDownload} style={{ fontSize: '24px' }} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProcessedFileCard;
