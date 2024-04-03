import React from "react";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

const WorkflowCard = ({ index, name, date }) => {
    return (
        <div className="flex max-w-8xl items-center justify-between bg-[#C8EDFD] bg-opacity-50 my-3 p-6 rounded-lg">
            <div className="flex lg:flex-1">
                <Link key={index} to={`/workflow/${name}`}>
                <p className="text-lg font-semibold text-black">{name}</p>
                </Link>
            </div>
            <div className="flex lg:flex-1 justify-left">
                <p className="text-lg text-black">{date}</p>
            </div>
            <FontAwesomeIcon icon={faTrashCan} style={{ fontSize: '24px' }}/>
        </div>
    );
}

export default WorkflowCard;