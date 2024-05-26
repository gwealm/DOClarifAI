import React, { useState, useEffect } from 'react';
import { useAuth } from "./auth/Auth";

const NewWorkflowModal = ({ onClose, onAddWorkflow }) => {
    const [workflow, setWorkflow] = useState({
        name:'',
        description: '',
        template_id:'',
      }
    );

    const [userTemplates,setUserTemplates] = useState([])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setWorkflow({ ...workflow, [name]: value })
    }

    const handleAddWorkflow = (e) => {
        e.preventDefault();
        onAddWorkflow(workflow);
    };

    const auth = useAuth();

    useEffect(() => {
      const fetchTemplates = async () => {
        try {
          const response = await auth.fetch('/workflowmanagement/template/', {
            method: 'GET',
          });
  
          if (response.ok) {
            const data = await response.json();
            console.log(data);
            setUserTemplates(data);
          } else {
            console.error('Failed to fetch templates');
          }
        } catch (error) {
          console.error('Error fetching templates:', error);
        }
      };
  
  
      fetchTemplates();
    }, [auth]);

    
    return (
      <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div
                  class="flex flex-shrink-0 items-center justify-between rounded-t-md bg-blue-100 border-b-2 border-neutral-100 p-4 dark:border-white/10">
                  <h5
                    class="text-xl font-medium leading-normal text-surface dark:text-white">
                    Create New Workflow
                  </h5>
                </div>
                <form onSubmit={handleAddWorkflow}>
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Name"> Name </label>
                      <input 
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700  focus:outline-none focus:shadow-outline" 
                          type="text" 
                          name="name"
                          value={workflow.name}
                          onChange={handleInputChange}
                          required
                      />
                  </div>
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Description"> Description </label>
                      <input 
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" 
                          type="text" 
                          name="description"
                          value={workflow.description}
                          onChange={handleInputChange}
                          required
                      />
                  </div>
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Template"> Template </label>
                      <select 
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" 
                          name="template_id"
                          value={workflow.template_id}
                          onChange={handleInputChange}
                          required
                      >
                        <option value="">Select a template</option>
                        {userTemplates.map(template => (
                          <option key={template.id} value={template.id}>
                            {template.name}
                          </option>
                        ))}
                      </select>
                  </div>
                  <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button 
                          type="submit" 
                          className="inline-flex w-full justify-center rounded-md bg-[#1976D2] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-80 sm:ml-3 sm:w-auto"
                      >
                          Create
                      </button>
                      <button 
                          onClick={onClose} 
                          type="button" 
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      >
                          Cancel
                      </button>
                  </div>
                </form>
              </div>
              </div>
          </div>
      </div>
    );
}

export default NewWorkflowModal;
