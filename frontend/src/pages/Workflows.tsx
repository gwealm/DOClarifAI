import React, { useState } from 'react';
import WorkflowCard from '../components/WorkflowCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import NewWorkflowModal from '../components/NewWorkflowModal';

const Workflows = () => {
    const [isNewWorkflowModalOpen, setIsNewWorkflowModalOpen] = useState(false);
    const [workflows, setWorkflows] = useState([
        { name: 'Workflow 1', date: '10/03/2024 17:45' },
        { name: 'Workflow 2', date: '10/04/2024 09:30' },
        { name: 'Workflow 3', date: '10/05/2024 14:20' },
    ]);

    const toggleNewWorkflowModal = () => {
        setIsNewWorkflowModalOpen(!isNewWorkflowModalOpen);
    };

    const handleAddWorkflow = (workflowName) => {
        const currentDate = new Date();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
        const day = String(currentDate.getDate()).padStart(2, '0'); // Add leading zero if needed
        const hours = String(currentDate.getHours()).padStart(2, '0'); // Add leading zero if needed
        const minutes = String(currentDate.getMinutes()).padStart(2, '0'); // Add leading zero if needed
    
        const formattedDate = `${month}/${day}/${currentDate.getFullYear()} ${hours}:${minutes}`;
    
        const newWorkflow = {
            name: workflowName,
            date: formattedDate
        };
    
        setWorkflows([...workflows, newWorkflow]); // Add the new workflow to the list
        setIsNewWorkflowModalOpen(false); // Close the modal
    };
    
    const handleDeleteWorkflow = (index) => {
        const updatedWorkflows = [...workflows];
        updatedWorkflows.splice(index, 1); // Remove the workflow at the specified index
        setWorkflows(updatedWorkflows); // Update the workflows state
    } 

    return (
        <>
        <div className="border-2 border-blue-[#5583C5] rounded-lg w-45 min-h-[600px] h-auto mx-20 my-5 p-5 flex flex-col justify-between">
            <div>
                <div className="flex max-w-8xl items-center justify-between pl-6">
                    <div className="flex lg:flex-1">
                        <h2 className="text-lg font-semibold text-black">Name</h2>
                    </div>
                    <div className="flex lg:flex-1 justify-left">
                        <h2 className="text-lg font-semibold text-black">Last Modified</h2>
                    </div>
                </div>
                <div className="border-b border-blue-[#F5F5F5] my-4"></div>

                {workflows.map((workflow, index) => (
                    <WorkflowCard key={index} index={index} name={workflow.name} date={workflow.date} onDelete={handleDeleteWorkflow}/>
                ))}
            </div>
            <div className="flex items-center justify-start">
                <button 
                    className="text-sm font-semibold leading-6 text-white flex items-center px-4 py-2 rounded-md bg-[#5583C5] bg-opacity-80 border border-gray-300 hover:bg-opacity-50 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
                    onClick={toggleNewWorkflowModal}
                >
                    New Workflow
                    <FontAwesomeIcon icon={faSquarePlus} className="ml-2" style={{ fontSize: '24px' }} />
                </button>
            </div>
        </div>
        {/* Render NewWorkflowModal component if isModalOpen is true */}
        {isNewWorkflowModalOpen && <NewWorkflowModal onClose={toggleNewWorkflowModal} onAddWorkflow={handleAddWorkflow}/>}
        </>
    );
}

export default Workflows;