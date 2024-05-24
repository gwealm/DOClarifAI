import React, { useState, useEffect } from 'react';
import { useAuth } from "../components/auth/Auth";
import { useParams } from 'react-router-dom';
import Modal from 'react-modal';

const Template = () => {
  const [schemas, setSchemas] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [template, setTemplate] = useState({
    name:'',
    description: '',
    schema_id:'',
    document_type_id: ''
  });
  const [isActive, setIsActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');



  const auth = useAuth();
  const { id } = useParams();


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTemplate({ ...template, [name]: value })
  }

  const handleDocumentTypeChange = (e) => {
    const new_document_type_id = e.target.value
    setTemplate({ ...template, document_type_id: new_document_type_id, schema_id: '' })
    fetchSchemas(new_document_type_id)
  }
  const openModal = (message) => {
    setErrorMessage(message);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setErrorMessage('');
    window.location.reload();
  };


  const updateTemplate = async (e) => {
    e.preventDefault();
    try {
      const response = await auth.fetch(`http://localhost:8085/template/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(template),
      });
      console.log({
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(template),
      })
      e.preventDefault()

      if (!response.ok) {
        openModal('Failed to update template. Make sure the template is not active.');
        throw new Error('Failed to update template');
      }

      const data = await response.json();
      console.log("Template: " + data);
    } catch (error) {
      console.error('Error fetching document types:', error);
      openModal('Failed to update template. Make sure the template is not active.');
    }
  };


  useEffect(() => {
    fetchDocumentTypes()
    fetchTemplate(id);
  }, []);

  const fetchDocumentTypes = async () => {
    try {
      const response = await fetch(`http://localhost:8085/document_type/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch document types');
      }

      const data = await response.json();
      console.log("Document types: " + data);
      setDocumentTypes(data);
    } catch (error) {
      console.error('Error fetching document types:', error);
    }
  };

  const fetchTemplate = async (id) => {
    try {
      const response = await auth.fetch(`http://localhost:8085/template/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch template');
      }

      const data = await response.json();
      await fetchSchemas(data.document_type_id)
      setTemplate(data);
      setIsActive(data.active)
    } catch (error) {
      console.error('Error fetching document types:', error);
    }
  };

  const toggleIsActive = async () => {
    try {
      const url = `http://localhost:8085/template/${id}/${isActive ? 'deactivate' : 'activate'}`;
      const response = await auth.fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        openModal('Failed to update template. Make sure the template is not being used by any workflow.');
        throw new Error(`Failed to ${isActive ? 'deactivate' : 'activate'} schema`);
      }

      setIsActive(!isActive);
    } catch (error) {
      console.error(`Error toggling template active state:`, error);
      openModal('Failed to update template. Make sure the template is not being used by any workflow.');
    }
  };

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
      setSchemas(data);

    } catch (error) {
      console.error('Error fetching schemas:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Edit Template</h2>
      <button
            className={`px-4 py-2 rounded-md ${isActive ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}
            onClick={toggleIsActive}
          >
            {isActive ? 'Deactivate' : 'Activate'}
      </button>
        
      <form onSubmit={updateTemplate} className="space-y-4">
        <div>
          <label htmlFor="templateName" className="block text-sm font-medium text-gray-700">
            Template Name
          </label>
          <input
            type="text"
            name="name"
            value={template.name}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={template.description}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="templateType" className="block text-sm font-medium text-gray-700">
            Document Type
          </label>
          <select
            name="document_type_id"
            value={template.document_type_id}
            onChange={handleDocumentTypeChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="" disabled>Select a document type</option>
            {documentTypes.map((documentType) => (
              <option key={documentType.id} value={documentType.id}>
                {documentType.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="schemaId" className="block text-sm font-medium text-gray-700">
            Schema
          </label>
          <select
            name="schema_id"
            value={template.schema_id}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="" disabled>Select a schema</option>
            {schemas.map((schema) => (
              <option key={schema.id} value={schema.id}>
                {schema.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Update Template
          </button>
        </div>
      </form>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Error Modal"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div className="bg-white p-5 rounded shadow-lg">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
          <p>{errorMessage}</p>
          <button onClick={closeModal} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md">
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Template;
