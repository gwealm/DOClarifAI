import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import DeleteWorkflowModal from "./DeleteWorkflowModal";

const WorkflowCard = ({ index, name, description, id, onDelete}) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const toggleDeleteModal = () => {
        setIsDeleteModalOpen(!isDeleteModalOpen);
    }

    return (
        <>
        <div className="flex max-w-8xl items-center justify-between bg-[#C8EDFD] bg-opacity-50 my-3 p-6 rounded-lg">
            <div className="flex lg:flex-1">
                <Link key={index} to={`/workflow/${id}`}>
                <p className="text-lg font-semibold text-black">{name}</p>
                </Link>
            </div>
            <div className="flex lg:flex-1 justify-left">
                <p className="text-lg text-black">{description}</p>
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

export default WorkflowCard;