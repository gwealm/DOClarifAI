import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import DeleteWorkflowModal from "./DeleteWorkflowModal";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const ProcessedFileCard = ({ index, id, name, date, onDelete, onDownload }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
    
    const toggleDeleteModal = () => {
        setIsDeleteModalOpen(!isDeleteModalOpen);
    }

    return (
        <>
        <div className="flex max-w-8xl items-center justify-between bg-[#C8EDFD] bg-opacity-50 my-3 p-6 rounded-lg">
            <div className="flex lg:flex-1">
                <a key={index}>
                <p className="text-lg font-semibold text-black">{name}</p>
                </a>
            </div>
            <div className="flex lg:flex-1 justify-left">
                <p className="text-lg text-black">{new Date(date).toLocaleString('pt-PT')}</p>
            </div>
            <div className="cursor-pointer hover:cursor-pointer mr-4" onClick={() => onDownload(id)}>
                <FontAwesomeIcon icon={faDownload} style={{ fontSize: '24px' }} />
            </div>
            <div className="cursor-pointer hover:cursor-pointer" onClick={toggleDeleteModal}>
                <FontAwesomeIcon icon={faTrashCan} style={{ fontSize: '24px' }} />
            </div>
            
        </div>
        {/* Render NewWorkflowModal component if isModalOpen is true */}
        {isDeleteModalOpen && <DeleteWorkflowModal onClose={toggleDeleteModal} onDelete={() => onDelete(index)} />}
        </>
    );
}

export default ProcessedFileCard;