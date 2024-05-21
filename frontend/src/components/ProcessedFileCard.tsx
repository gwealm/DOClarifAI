import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const ProcessedFileCard = ({ index, dox_id, name, date, onDownload }) => {
    // const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
    

    return (
        <>
        <div className="flex max-w-8xl items-center justify-between bg-[#C8EDFD] bg-opacity-50 my-3 p-6 rounded-lg">
            <div className="flex lg:flex-1">
                <a key={index}>
                <p className="text-lg font-semibold text-black">{name}</p>
                </a>
            </div>
            <div className="flex lg:flex-1 justify-left">
                <p className="text-lg text-black">{new Date(date).toLocaleString()}</p>
            </div>
            <div className="cursor-pointer hover:cursor-pointer mr-4" onClick={() => onDownload(dox_id)}>
                <FontAwesomeIcon icon={faDownload} style={{ fontSize: '24px' }} />
            </div>
        </div>
        </>
    );
}

export default ProcessedFileCard;