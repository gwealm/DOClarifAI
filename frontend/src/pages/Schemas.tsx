import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { useAuth } from "../components/auth/Auth";
import Modal from 'react-modal';

const Schemas = () => {
  const [schemas, setSchemas] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newSchema, setNewSchema] = useState({
    name: '',
    description: '',
    document_type_id: ''
  });
  const auth = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const openModal = (message) => {
    setErrorMessage(message);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setErrorMessage('');
    window.location.reload();
  };

  useEffect(() => {
    const fetchSchemas = async () => {
      try {
        const response = await auth.fetch('http://localhost:8085/schema/', {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setSchemas(data);
        } else {
          console.error('Failed to fetch schemas');
        }
      } catch (error) {
        console.error('Error fetching schemas:', error);
      }
    };

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

    fetchSchemas();
    fetchDocumentTypes();
  }, [auth]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSchema({ ...newSchema, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await auth.fetch('http://localhost:8085/schema/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSchema),
      });

      if (response.ok) {
        const createdSchema = await response.json();
        setSchemas([...schemas, createdSchema]);
        setShowModal(false);
      } else {
        setShowModal(false);
        console.error('Failed to create schema');
        for (let i = 0; i < schemas.length; i++) {
          if (schemas[i].name === newSchema.name) {
            openModal('Schema name already exists');
            return;
          }
        }
        // check for whitespace in the schema name
        if(newSchema.name.indexOf(' ') >= 0){
          openModal('Schema name cannot contain whitespaces');
        }
        // check for empty schema name
        else if(newSchema.name === ''){
          openModal('Schema name cannot be empty');
        }
        //check if schema name already exists
        else{
          openModal('Error creating schema');
        }
      }
    } catch (error) {
      setShowModal(false);
      console.error('Error creating schema:', error);
      openModal('Error creating schema: ' + error.message);

    }
  };

  return (
    <>
      <div className="border-2 border-blue-[#5583C5] rounded-lg w-45 min-h-[600px] h-auto mx-20 my-5 p-5 flex flex-col justify-between">
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

              {schemas.map((schema) => (
                  <div className="flex max-w-8xl items-center justify-between bg-[#C8EDFD] bg-opacity-50 my-3 p-6 rounded-lg">
                      <div className="flex lg:flex-1">
                          <Link key={schema.id} to={`/schemas/${schema.id}`}>
                          <p className="text-lg font-normal text-black">{schema.name}</p>
                          </Link>
                      </div>
                      <div className="flex lg:flex-1 justify-left">
                          <p className="text-md text-gray-700">{schema.description}</p>
                      </div>
                  </div>
              ))}
          </div>
          <div className="flex items-center justify-start">
              <button
                  className="text-sm font-semibold leading-6 text-white flex items-center px-4 py-2 rounded-md bg-[#5583C5] bg-opacity-80 border border-gray-300 hover:bg-opacity-50 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
                  onClick={() => setShowModal(true)}
              >
                  New Schema
                  <FontAwesomeIcon icon={faSquarePlus} className="ml-2" style={{ fontSize: '24px' }} />
              </button>
          </div>
      </div>
      {showModal && (
        <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div
                    class="flex flex-shrink-0 items-center justify-between rounded-t-md bg-blue-100 border-b-2 border-neutral-100 p-4 dark:border-white/10">
                    <h5
                      class="text-xl font-medium leading-normal text-surface dark:text-white">
                      Create New Schema
                    </h5>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Name"> Name </label>
                        <input 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700  focus:outline-none focus:shadow-outline" 
                            type="text" 
                            name="name"
                            value={newSchema.name}
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
                            value={newSchema.description}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Template"> Document Type </label>
                        <select 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" 
                            name="document_type_id"
                            value={newSchema.document_type_id}
                            onChange={handleInputChange}
                            required
                        >
                          <option value="">Select a document type</option>
                          {documentTypes.map(type => (
                            <option key={type.id} value={type.id}>
                              {type.name}
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
                            onClick={() => setShowModal(false)}
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
      )}
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
    </>
  );
};

export default Schemas;
