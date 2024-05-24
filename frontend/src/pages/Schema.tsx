import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../components/auth/Auth';
import { useParams } from 'react-router-dom';

const Schema = () => {
  const { id } = useParams();
  const auth = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [headerFields, setHeaderFields] = useState([]);
  const [lineItemFields, setLineItemFields] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [isPredefined, setIsPredefined] = useState(false);
  const [newFieldCategory, setNewFieldCategory] = useState('');
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingCategory, setEditingCategory] = useState('');
  const [editFieldName, setEditFieldName] = useState('');
  const [editFieldType, setEditFieldType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const response = await auth.fetch(`http://localhost:8085/schema/${id}`, {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();
          setName(data.name);
          setDescription(data.schemaDescription);
          setHeaderFields(data.headerFields);
          setLineItemFields(data.lineItemFields);
          if (data.state === 'active') {
            setIsActive(true);
          }
          else {
            setIsActive(false);
          }
          setIsPredefined(data.predefined);
          console.log(isActive);
          console.log(data);
        } else {
          console.error('Failed to fetch schema');
          openModal('Failed to fetch schema');
        }
      } catch (error) {
        console.error('Error fetching schema:', error);
        openModal('Error fetching schema: ' + error.message);
      }
    };

    fetchSchema();
  }, [auth, id, isActive]);

  
  const openModal = (message) => {
    setErrorMessage(message);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setErrorMessage('');
    window.location.reload();
  };

  const handleToggleActiveState = async () => {
    try {
      const endpoint = isActive ? 'deactivate' : 'activate';
      const response = await auth.fetch(`http://localhost:8085/schema/${id}/${endpoint}`, {
        method: 'POST',
      });

      if (response.ok) {
        setIsActive(!isActive);
      } else {
        console.error('Failed to toggle schema state');
        openModal('Error toggling schema state: \n The schema is in use by a template or needs at least one field');
      }
    } catch (error) {
      console.error('Error toggling schema state:', error);
      openModal('Error toggling schema state: \n The schema is in use by a template or needs at least one field');
    }
  };

  const fieldCategories = ['Header', 'Line Item'];
  const fieldTypes = ['string', 'number', 'date', 'discount', 'currency', 'country/region'];

  const handleAddField = async () => {
    if (newFieldName && newFieldType && newFieldCategory) {
      const newField = {
        name: newFieldName,
        description: "",
        label: "",
        defaultExtractor: {},
        setupType: "static",
        setupTypeVersion: "2.0.0",
        setup: {
          type: "manual",
          priority: 1
        },
        formattingType: newFieldType,
        formatting: {},
        formattingTypeVersion: "1.0.0",
        predefined: false
      };
  
      let updatedHeaderFields = [...headerFields];
      let updatedLineItemFields = [...lineItemFields];
  
      if (newFieldCategory === 'Header') {
        updatedHeaderFields.push(newField);
      } else if (newFieldCategory === 'Line Item') {
        updatedLineItemFields.push(newField);
      }
  
      auth.fetch(`http://localhost:8085/schema/${id}/fields`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          headerFields: updatedHeaderFields,
          lineItemFields: updatedLineItemFields
        }),
      })
      .then((response) => {
        if (response.ok) {
          console.log('Schema fields updated');
          setHeaderFields(updatedHeaderFields);
          setLineItemFields(updatedLineItemFields);
        } else {
          if (isActive) {
            openModal('You cannot add a field to an active schema');
          }
          else{
          console.error('Failed to update schema fields');
          openModal('Failed to update schema fields');
          }
        }
      })
      .catch((error) => {
        console.error('Error updating schema fields:', error);
        openModal('Error updating schema fields: ' + error.message);
      });
  
      setNewFieldName('');
      setNewFieldType('');
    }
  };
  

  const handleDeleteField = (index, header) => {
    let updatedHeaderFields = [...headerFields];
    let updatedLineItemFields = [...lineItemFields];

    if (header) {
      updatedHeaderFields.splice(index, 1);
    } else {
      updatedLineItemFields.splice(index, 1);
    }

    auth.fetch(`http://localhost:8085/schema/${id}/fields`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        headerFields: updatedHeaderFields,
        lineItemFields: updatedLineItemFields
      }),
    })
    .then((response) => {
      if (response.ok) {
        console.log('Schema fields updated');
        setHeaderFields(updatedHeaderFields);
        setLineItemFields(updatedLineItemFields);
      } else {
        console.error('Failed to update schema fields');
        openModal('Failed to update schema fields');
      }
    })
    .catch((error) => {
      console.error('Error updating schema fields:', error);
      openModal('Error updating schema fields: ' + error.message);
    });
  };

  const handleEditField = (index, header) => {
    setEditingIndex(index);
    setEditingCategory(header ? 'Header' : 'Line Item');
    const field = header ? headerFields[index] : lineItemFields[index];
    setEditFieldName(field.name);
    setEditFieldType(field.formattingType);
  };

  const saveEdit = () => {
    let updatedHeaderFields = [...headerFields];
    let updatedLineItemFields = [...lineItemFields];

    if (editingIndex !== null && editingCategory === 'Header') {
      updatedHeaderFields[editingIndex].name = editFieldName;
      updatedHeaderFields[editingIndex].formattingType = editFieldType;
    }
    else if (editingIndex !== null && editingCategory === 'Line Item') {
      updatedLineItemFields[editingIndex].name = editFieldName;
      updatedLineItemFields[editingIndex].formattingType = editFieldType;
    }

    auth.fetch(`http://localhost:8085/schema/${id}/fields`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        headerFields: updatedHeaderFields,
        lineItemFields: updatedLineItemFields
      }),
    })
    .then((response) => {
      if (response.ok) {
        console.log('Schema fields updated');
        setHeaderFields(updatedHeaderFields);
        setLineItemFields(updatedLineItemFields);
      } else {
        console.error('Failed to update schema fields');
          if (isActive) {
            openModal('You cannot edit a field in an active schema');
          }
          else{
            openModal('Failed to update schema fields');
          }
      }
    })
    .catch((error) => {
      console.error('Error updating schema fields:', error);
      openModal('Error updating schema fields: ' + error.message);
    });

    setEditingIndex(null);
    setEditFieldName('');
    setEditFieldType('');
  };

  return (
    <div className="border-2 border-blue-[#5583C5] rounded-lg w-45 min-h-[600px] h-auto mx-20 my-5 p-5 flex flex-col">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-300">
        <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
        <h3 className="text-md text-gray-600">{description}</h3>
        {isPredefined ? null : (
          <button
            className={`px-4 py-2 rounded-md ${isActive ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}
            onClick={handleToggleActiveState}
          >
            {isActive ? 'Deactivate' : 'Activate'}
          </button>
        )}
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">Current Header Fields</h3>
        {headerFields.map((field, index) => (
          <div key={index} className="mb-4">
            {editingIndex === index && editingCategory === 'Header' ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  className="p-2 border rounded"
                  value={editFieldName}
                  onChange={(e) => setEditFieldName(e.target.value)}
                  placeholder="Field Name"
                />
                <select
                  className="p-2 border rounded"
                  value={editFieldType}
                  onChange={(e) => setEditFieldType(e.target.value)}
                >
                  {fieldTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <button onClick={saveEdit} className="px-4 py-2 bg-green-600 text-white rounded-md">
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-gray-200 rounded-lg shadow">
                <div className="flex flex-col text-left">
                  <p className="text-lg font-semibold text-gray-800">{field.name}</p>
                  <p className="text-md text-gray-600">{field.formattingType}</p>
                </div>
                {isPredefined ? null : (
                <div className="flex items-center space-x-4">
                  <div className="cursor-pointer" onClick={() => handleEditField(index, true)}>
                    <FontAwesomeIcon icon={faEdit} style={{ fontSize: '20px' }} />
                  </div>
                  <div className="cursor-pointer" onClick={() => handleDeleteField(index, true)}>
                    <FontAwesomeIcon icon={faTrashCan} style={{ fontSize: '20px' }} />
                  </div>
                </div>
                )}
              </div>
            )}
          </div>
        ))}

        <h3 className="text-lg font-medium text-gray-700 mb-3">Current Line Item Fields</h3>
        {lineItemFields.map((field, index) => (
          <div key={index} className="mb-4">
            {editingIndex === index  && editingCategory === 'Line Item' ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  className="p-2 border rounded"
                  value={editFieldName}
                  onChange={(e) => setEditFieldName(e.target.value)}
                  placeholder="Field Name"
                />
                <select
                  className="p-2 border rounded"
                  value={editFieldType}
                  onChange={(e) => setEditFieldType(e.target.value)}
                >
                  {fieldTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <button onClick={saveEdit} className="px-4 py-2 bg-green-600 text-white rounded-md">
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-gray-200 rounded-lg shadow">
                <div className="flex flex-col text-left">
                  <p className="text-lg font-semibold text-gray-800">{field.name}</p>
                  <p className="text-md text-gray-600">{field.formattingType}</p>
                </div>
                {isPredefined ? null : (
                <div className="flex items-center space-x-4">
                  <div className="cursor-pointer" onClick={() => handleEditField(index, false)}>
                    <FontAwesomeIcon icon={faEdit} style={{ fontSize: '20px' }} />
                  </div>
                  <div className="cursor-pointer" onClick={() => handleDeleteField(index, false)}>
                    <FontAwesomeIcon icon={faTrashCan} style={{ fontSize: '20px' }} />
                  </div>
                </div>
                )}
              </div>
            )}
          </div>
        ))}
      
      {isPredefined ? null : (
        <>
        <h3 className="text-lg font-medium text-gray-700 mb-3">Add New Field</h3>
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            className="p-2 border rounded"
            value={newFieldName}
            onChange={(e) => setNewFieldName(e.target.value)}
            placeholder="Field Name"
          />
          <select
            className="p-2 border rounded"
            value={newFieldCategory}
            onChange={(e) => setNewFieldCategory(e.target.value)}
          >
            <option value="">Select Field Category</option>
            {fieldCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            className="p-2 border rounded"
            value={newFieldType}
            onChange={(e) => setNewFieldType(e.target.value)}
          >
            <option value="">Select Field Type</option>
            {fieldTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddField}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Add Field
          </button>
        </div>
        </>
      )}
      </div>
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

export default Schema;
