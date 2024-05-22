import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faFloppyDisk } from '@fortawesome/free-regular-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from "../components/auth/Auth";
import Select from 'react-select';


const Template = () => {
  const auth = useAuth();
  const [fields, setFields] = useState([]);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('');
  const [newFieldConfig, setNewFieldConfig] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);
  const [editFieldName, setEditFieldName] = useState('');
  const [editFieldType, setEditFieldType] = useState('');
  const [editFieldConfig, setEditFieldConfig] = useState({});


  const fieldTypes = ['string', 'number', 'date', 'discount', 'currency', 'country/region'];
  const dateFormats = [
    { value: 'yyyy-MM-dd', label: 'yyyy-MM-dd' },
    { value: 'yyyy/MM/dd', label: 'yyyy/MM/dd' },
    { value: 'dd-MM-yyyy', label: 'dd-MM-yyyy' },
    { value: 'dd/MM/yyyy', label: 'dd/MM/yyyy' },
    { value: 'MM-dd-yyyy', label: 'MM-dd-yyyy' },
    { value: 'MM/dd/yyyy', label: 'MM/dd/yyyy' },
  ];



  const handleAddField = () => {
    if (newFieldName && newFieldType) {
      setFields([...fields, { name: newFieldName, type: newFieldType, config: newFieldConfig }]);
      setNewFieldName('');
      setNewFieldType('');
      setNewFieldConfig({});
    }
  };

  const loadProtectedDocument = async (documentUrl) => {
    try {
      const response = await auth.fetch(documentUrl,{
        mode:'no-cors'
      });
      const buffer = await response.arrayBuffer();
      setDocumentBuffer(buffer);
    } catch (error) {
      console.error('Error loading the document:', error);
    }
  };

  const handleDeleteField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleEditField = (index) => {
    const field = fields[index];
    setEditFieldName(field.name);
    setEditFieldType(field.type);
    setEditFieldConfig(field.config);
    setEditingIndex(index);
  };

  const saveEdit = () => {
    const updatedFields = fields.map((field, i) => 
      i === editingIndex ? { name: editFieldName, type: editFieldType, config: editFieldConfig } : field
    );
    setFields(updatedFields);
    setEditingIndex(null);
    setEditFieldName('');
    setEditFieldType('');
    setEditFieldConfig({});
  };

  const renderFieldConfig = (type, config, setConfig) => {
    switch (type) {
      case 'date':
        const styles = {
            menu: ({ width, ...css }) => ({
                ...css,
                width: "max-content",
                minWidth: "100%"
            }),          
        }
        return (
            <Select
                options={dateFormats}
                value={dateFormats.find(option => option.value === config.format)}
                onChange={(selectedOption) => setConfig({ ...config, format: selectedOption.value })}
                className="ml-2"
                placeholder="Select Date Format"
                isClearable
                isSearchable
                styles={styles}
            />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    loadProtectedDocument("https://pspdfkit.com/downloads/pspdfkit-web-demo.pdf");
  }, []);

  return (
    <div className="border-2 border-blue-[#5583C5] rounded-lg w-45 min-h-[600px] h-auto mx-20 my-5 p-5 flex flex-col">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-300">
        <h2 className="text-xl font-semibold text-gray-800">Schemas Configuration</h2>
        <button className="text-sm font-semibold leading-6 text-white flex items-center px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200">
          Save Schema
          <FontAwesomeIcon icon={faFloppyDisk} className="ml-2" style={{ fontSize: '16px' }} />
        </button>
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">Current Fields</h3>
        {fields.map((field, index) => (
          <div key={index} className="mb-4">
            {editingIndex === index ? (
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
                {renderFieldConfig(editFieldType, editFieldConfig, setEditFieldConfig)}
                <button onClick={saveEdit} className="px-4 py-2 bg-green-600 text-white rounded-md">
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-gray-200 rounded-lg shadow">
                <div className="flex flex-col text-left">
                  <p className="text-lg font-semibold text-gray-800">{field.name}</p>
                  <p className="text-md text-gray-600">{field.type}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="cursor-pointer" onClick={() => handleEditField(index)}>
                    <FontAwesomeIcon icon={faEdit} style={{ fontSize: '20px' }} />
                  </div>
                  <div className="cursor-pointer" onClick={() => handleDeleteField(index)}>
                    <FontAwesomeIcon icon={faTrashCan} style={{ fontSize: '20px' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">Add New Field</h3>
        <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-md shadow">
          <input
            type="text"
            className="p-2 border rounded"
            value={newFieldName}
            onChange={(e) => setNewFieldName(e.target.value)}
            placeholder="Field Name"
          />
          <select
            className="p-2 border rounded"
            value={newFieldType}
            onChange={(e) => setNewFieldType(e.target.value)}
          >
            <option value="">Select Type</option>
            {fieldTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {renderFieldConfig(newFieldType, newFieldConfig, setNewFieldConfig)}
          <button onClick={handleAddField} className="px-4 py-2 bg-blue-600 text-white rounded-md">
            Add Field
          </button>
        </div>
      </div>

    </div>
  );
};

export default Template;
