import React, { useState, useEffect } from 'react';
import { useAuth } from "./auth/Auth";


const NewTemplateModal = ({ onClose, onAddTemplate }) => {
    const [template, setTemplate] = useState({
        name:'',
        description: '',
        schema_id:'',
        document_type_id: ''
      }
    );

    const [userSchemas,setUserSchemas] = useState([])
    const [documentTypes,setDocumentTypes] = useState([])


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTemplate({ ...template, [name]: value })
    }

    const handleDocumentTypeChange = (e) => {
        const new_document_type_id = e.target.value
        setTemplate({ ...template, document_type_id: new_document_type_id, schema_id: '' })
        fetchSchemas(new_document_type_id)
    }
    

    const handleAddTemplate = (e) => {
        e.preventDefault();
        onAddTemplate(template);
    };

    const auth = useAuth();

    const fetchSchemas = async (document_type_id) => {
        try {
          const response = await auth.fetch(`/workflowmanagement/document_type/${document_type_id}/schema/active`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
    
          if (!response.ok) {
            throw new Error('Failed to fetch schemas');
          }
    
          const data = await response.json();
          console.log("Schemas: " + data);
          setUserSchemas(data);

        } catch (error) {
          console.error('Error fetching schemas:', error);
        }
      };
    
    useEffect(() => {
  
      const fetchDocumentTypes = async () => {
        try {
          const response = await auth.fetch('/workflowmanagement/document_type/', {
            method: 'GET',
          });
  
          if (response.ok) {
            const data = await response.json();
            console.log(data);
            setDocumentTypes(data);
          } else {
            console.error('Failed to fetch document types');
          }
        } catch (error) {
          console.error('Error fetching document types:', error);
        }
      };
  

      fetchDocumentTypes()
    }, [auth]);

    
    return (
        <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div
                    className="flex flex-shrink-0 items-center justify-between rounded-t-md bg-blue-100 border-b-2 border-neutral-100 p-4 dark:border-white/10">
                    <h5
                      className="text-xl font-medium leading-normal text-surface dark:text-white">
                      Create New Template
                    </h5>
                  </div>
                  <form onSubmit={handleAddTemplate}>
                    <div className="bg-white pt-4 sm:px-6 sm:pb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Name"> Name </label>
                        <input 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700  focus:outline-none focus:shadow-outline" 
                            type="text" 
                            name="name"
                            value={template.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="bg-white sm:px-6 sm:pb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Description"> Description </label>
                        <input 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" 
                            type="text" 
                            name="description"
                            value={template.description}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="bg-white sm:px-6 sm:pb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Template"> Document Type </label>
                        <select 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" 
                            name="document_type_id"
                            value={template.document_type_id}
                            onChange={handleDocumentTypeChange}
                            required
                        >
                          <option value="">Select a document type</option>
                          {documentTypes.map(documentType => (
                            <option key={documentType.id} value={documentType.id}>
                              {documentType.name}
                            </option>
                          ))}
                        </select>
                    </div>
                    <div className="bg-white sm:px-6 sm:pb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Template"> Schema </label>
                        <select 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" 
                            name="schema_id"
                            value={template.schema_id}
                            onChange={handleInputChange}
                            required
                        >
                          <option value="">Select a schema</option>
                          {userSchemas.map(userSchema => (
                            <option key={userSchema.id} value={userSchema.id}>
                              {userSchema.name}
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

export default NewTemplateModal;
