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
          const response = await auth.fetch(`http://localhost:8085/document_type/${document_type_id}/schema/active`, {
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
          const response = await auth.fetch('http://localhost:8085/document_type/', {
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
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg px-12">
            <h2 className="text-xl font-semibold mb-4">Create New Template</h2>
            <form onSubmit={handleAddTemplate}>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={template.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                    name="description"
                    value={template.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Document Type</label>
                <select
                  name="document_type_id"
                  value={template.document_type_id}
                  onChange={handleDocumentTypeChange}
                  className="w-full mt-2 px-3 py-2 border rounded-lg"
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
              <div className="mb-4">
                <label className="block text-gray-700">Schema</label>
                <select
                  name="schema_id"
                  value={template.schema_id}
                  onChange={handleInputChange}
                  className="w-full mt-2 px-3 py-2 border rounded-lg"
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

export default NewTemplateModal;
