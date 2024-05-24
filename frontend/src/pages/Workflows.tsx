import React, { useState, useEffect, useCallback } from 'react';
import WorkflowCard from '../components/WorkflowCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import NewWorkflowModal from '../components/NewWorkflowModal';
import { useAuth } from "../components/auth/Auth";

const Workflows = () => {
    const [isNewWorkflowModalOpen, setIsNewWorkflowModalOpen] = useState(false);
    const [workflows, setWorkflows] = useState([]);
    const auth = useAuth();

    const toggleNewWorkflowModal = () => {
        setIsNewWorkflowModalOpen(!isNewWorkflowModalOpen);
    };

    const fetchWorkflows = useCallback(async () => {
        if (!auth.isLoggedIn) {
            console.error('User is not logged in');
            return;
        }
        try {
            const response = await auth.fetch('http://localhost:8085/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch workflows');
            }

            const data = await response.json();
            console.log(data);
            setWorkflows(data); // Assuming the response contains workflows array
        } catch (error) {
            console.error('Error fetching workflows:', error);
        }
    }, [auth.isLoggedIn]);

    useEffect(() => {
        fetchWorkflows();
    }, [fetchWorkflows]);

    const handleAddWorkflow = async (workflowName) => {
        try {
            const response = await auth.fetch('http://localhost:8085/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: workflowName,
                    description: ""
                }),
            });

            if (!response.ok) {
                console.error('Failed to add workflow');
                return;
            }

            const newWorkflow = await response.json();
            setWorkflows([...workflows, newWorkflow]); // Add the new workflow to the list
            setIsNewWorkflowModalOpen(false); // Close the modal
        } catch (error) {
            console.error('Error adding workflow:', error);
        }
    };

    const handleDeleteWorkflow = async (index, workflowId) => {
        try {
            const response = await auth.fetch(`http://localhost:8085/${workflowId}`, {
                method: 'DELETE',
            });
    
            if (!response.ok) {
                console.error('Failed to delete workflow');
                return;
            }
    
            const updatedWorkflows = [...workflows];
            updatedWorkflows.splice(index, 1); // Remove the workflow at the specified index
            setWorkflows(updatedWorkflows); // Update the workflows state
        } catch (error) {
            console.error('Error deleting workflow:', error);
        }
    };

    return (
        <div className='w-full h-full bg-white p-8'>
            <div className="border-2 border-blue-[#5583C5] rounded-lg w-45 min-h-[600px] h-auto mx-20 p-5 flex flex-col justify-between">
                <div>
                    <div className="flex max-w-8xl items-center justify-between pl-6">
                        <div className="flex lg:flex-1">
                            <h2 className="text-lg font-semibold text-black">Name</h2>
                        </div>
                        <div className="flex lg:flex-1 justify-left">
                            <h2 className="text-lg font-semibold text-black">Description</h2>
                        </div>
                    </div>
                    <div className="border-b border-blue-[#F5F5F5] my-4"></div>

                    {workflows.map((workflow, index) => (
                        <WorkflowCard key={index} index={index} name={workflow.name} description={workflow.description} id={workflow.id} onDelete={handleDeleteWorkflow} />
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
            {isNewWorkflowModalOpen && <NewWorkflowModal onClose={toggleNewWorkflowModal} onAddWorkflow={handleAddWorkflow} />}
        </div>
    );
}

export default Workflows;
