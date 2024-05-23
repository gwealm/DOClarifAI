import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { useAuth } from "../components/auth/Auth";

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
        console.error('Failed to create schema');
      }
    } catch (error) {
      console.error('Error creating schema:', error);
    }
  };

  return (
    <div className="border-2 border-blue-500 rounded-lg w-45 min-h-[600px] h-auto mx-20 my-5 p-5 flex flex-col justify-between">
      <div className="grid grid-cols-1 gap-4">
        {schemas.map(schema => (
          <Link key={schema.id} to={`/schemas/${schema.id}`}>
            <div className="bg-gray-200 shadow-md rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{schema.name}</h3>
              </div>
              <p className="text-gray-700">{schema.description}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex items-center justify-start mt-4">
        <button
          onClick={() => setShowModal(true)}
          className="text-sm font-semibold leading-6 text-white flex items-center px-4 py-2 rounded-md bg-blue-500 bg-opacity-80 border border-gray-300 hover:bg-opacity-50 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
        >
          New Schema
          <FontAwesomeIcon icon={faSquarePlus} className="ml-2" style={{ fontSize: '24px' }} />
        </button>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Create New Schema</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newSchema.name}
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
                  value={newSchema.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Document Type</label>
                <select
                  name="document_type_id"
                  value={newSchema.document_type_id}
                  onChange={handleInputChange}
                  className="w-full mt-2 px-3 py-2 border rounded-lg"
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
              <div className="flex justify-around mt-8">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
      )}
    </div>
  );
};

export default Schemas;
