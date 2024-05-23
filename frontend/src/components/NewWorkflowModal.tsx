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
          const response = await auth.fetch('http://localhost:8085/template/', {
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
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Create New Workflow</h2>
            <form onSubmit={handleAddWorkflow}>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={workflow.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <input
                  type="text"
                  name="description"
                  value={workflow.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Template</label>
                <select
                  name="template_id"
                  value={workflow.template_id}
                  onChange={handleInputChange}
                  className="w-full mt-2 px-3 py-2 border rounded-lg"
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
              <div className="flex justify-around mt-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 mr-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
    );
}

export default NewWorkflowModal;
