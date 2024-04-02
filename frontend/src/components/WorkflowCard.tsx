import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

const WorkflowCard = () => {
    return (
        <div className="flex max-w-8xl items-center justify-between bg-[#C8EDFD] bg-opacity-50 my-6 p-6 rounded-lg">
            <div className="flex lg:flex-1">
                <Link to="/workflow/1">
                    <a
                    href="#"
                    className="text-lg font-semibold text-black"
                    >
                    Workflow 1
                    </a>
                </Link>
            </div>
            <div className="flex lg:flex-1 justify-left">
                <p className="text-lg text-black">10/03/2024 17:45</p>
            </div>
            <FontAwesomeIcon icon={faTrashCan} style={{ fontSize: '24px' }}/>
        </div>
    );
}

export default WorkflowCard;