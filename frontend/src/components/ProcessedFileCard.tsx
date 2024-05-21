import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const ProcessedFileCard = ({ index, dox_id, name, date, processed_status, onDownload }) => {
    // const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
    
    const FileProcessingStatus = {
        0: 'Upload Queued',
        1: 'Upload Processing',
        2: 'Upload Failed',
        3: 'Successful Upload',
      };

    return (
        <>
        <div className="relative flex max-w-8xl justify-between bg-[#C8EDFD] bg-opacity-50 my-3 p-6 rounded-lg">
            <div className="flex lg:flex-1 justify-left">
                <a key={index}>
                <p className="text-lg font-semibold text-black">{name}</p>
                </a>
            </div>
            <div className="flex lg:flex-1 justify-left">
                <p className="text-lg text-black">{new Date(date).toLocaleString()}</p>
            </div>
            <div className="flex lg:flex-1 justify-left">
                <p className="text-lg text-black">{FileProcessingStatus[processed_status]}</p>
            </div>
            {processed_status === 3 && (
            <div className="absolute right-5 cursor-pointer hover:cursor-pointer" onClick={() => onDownload(dox_id)}>
                <FontAwesomeIcon icon={faDownload} style={{ fontSize: '24px' }} />
            </div>
            )}
        </div>
        </>
    );
}

export default ProcessedFileCard;